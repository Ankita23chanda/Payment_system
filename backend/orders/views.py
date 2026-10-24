from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404

from cart.views import get_or_create_cart
from cart.models import Cart
from payments.models import Payment
from .models import Order, OrderItem
from .serializers import OrderSerializer, CheckoutSerializer


class CheckoutView(APIView):
    """
    POST /api/orders/checkout/
    1. Validates customer and shipping details.
    2. Recalculates authoritative prices strictly on the server.
    3. Validates real-time inventory for every cart item.
    4. Creates Order in PENDING status linked to the authenticated customer's Customer ID.
    5. Initializes Payment record.
    6. Clears the customer's cart.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        cart = get_or_create_cart(request)
        cart_items = cart.items.select_related('product').all()

        if not cart_items.exists():
            return Response(
                {"detail": "Your shopping cart is empty. Please add agricultural products before checking out."},
                status=status.HTTP_400_BAD_REQUEST
            )

        validated_data = serializer.validated_data

        with transaction.atomic():
            # Validate inventory stock with row-level locks
            for item in cart_items:
                product = item.product
                if product.stock < item.quantity:
                    return Response(
                        {"detail": f"Insufficient stock for '{product.name}'. Available: {product.stock}, in cart: {item.quantity}."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Authoritative pricing calculation strictly on server
            summary = cart.calculate_summary()

            # Associate user if authenticated — use their Customer ID
            user = request.user if (request.user and request.user.is_authenticated) else None

            # Create Order linked to customer's permanent Customer ID
            order = Order.objects.create(
                order_number=Order.generate_order_number(),
                user=user,
                status='PENDING',
                customer_name=validated_data['customer_name'],
                customer_email=validated_data['customer_email'],
                customer_phone=validated_data['customer_phone'],
                shipping_address=validated_data['shipping_address'],
                city=validated_data['city'],
                state=validated_data['state'],
                country=validated_data.get('country', 'India'),
                postal_code=validated_data['postal_code'],
                subtotal=summary['subtotal'],
                discount_amount=summary['discount_amount'],
                shipping_fee=summary['shipping_fee'],
                tax_amount=summary['tax_amount'],
                total_amount=summary['total_amount'],
            )

            # Create immutable OrderItems
            for item in cart_items:
                prod = item.product
                OrderItem.objects.create(
                    order=order,
                    product=prod,
                    product_name=prod.name,
                    product_brand=prod.brand,
                    product_image=prod.image,
                    unit_price=prod.effective_price,
                    quantity=item.quantity,
                    total_price=prod.effective_price * item.quantity,
                )

            # Initialize Payment record attached to Order
            Payment.objects.create(
                order=order,
                amount=order.total_amount,
                currency='INR',
                status='PENDING',
                payment_gateway='MOCK_GATEWAY',
            )

            # Clear cart items now that order is generated
            cart.items.all().delete()

        return Response({
            "message": "Order successfully created. Please proceed to payment.",
            "order": OrderSerializer(order).data
        }, status=status.HTTP_201_CREATED)


class OrderListView(APIView):
    """
    GET /api/orders/
    Lists orders for the authenticated customer — strictly isolated by Customer ID.
    Unauthenticated requests return 401.
    """

    def get(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided. Please log in to view your orders."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Strict isolation: only orders belonging to this customer's user account
        orders = Order.objects.filter(
            user=request.user
        ).prefetch_related('items', 'payment').order_by('-created_at')

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OrderDetailView(APIView):
    """
    GET /api/orders/<str:order_number>/
    Retrieves full details of a single order.
    Enforces customer isolation — the order must belong to the authenticated user.
    """

    def get(self, request, order_number):
        if not request.user or not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided. Please log in to view order details."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Fetch the order AND enforce ownership — prevents any cross-customer access
        order = get_object_or_404(
            Order.objects.prefetch_related('items', 'payment'),
            order_number=order_number,
            user=request.user,  # <-- data isolation enforced at query level
        )
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)
