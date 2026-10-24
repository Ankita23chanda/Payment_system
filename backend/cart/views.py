import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from products.models import Product
from .models import Cart, CartItem
from .serializers import CartSerializer


def get_or_create_cart(request):
    """
    Helper retrieving or initializing an authoritative cart for the request.
    Works with both authenticated accounts and anonymous guest session keys.
    """
    if request.user and request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
        # Check if an anonymous session key was provided to merge items
        session_key = request.headers.get('X-Session-Key') or request.query_params.get('session_key')
        if session_key:
            anon_cart = Cart.objects.filter(session_key=session_key, user__isnull=True).first()
            if anon_cart and anon_cart.id != cart.id:
                for anon_item in anon_cart.items.all():
                    existing = CartItem.objects.filter(cart=cart, product=anon_item.product).first()
                    if existing:
                        existing.quantity = min(existing.quantity + anon_item.quantity, anon_item.product.stock)
                        existing.save()
                    else:
                        CartItem.objects.create(cart=cart, product=anon_item.product, quantity=min(anon_item.quantity, anon_item.product.stock))
                anon_cart.delete()
        return cart

    # Anonymous user handling
    session_key = request.headers.get('X-Session-Key') or request.query_params.get('session_key')
    if not session_key:
        session_key = str(uuid.uuid4())

    cart, _ = Cart.objects.get_or_create(session_key=session_key, user__isnull=True)
    return cart


class CartDetailView(APIView):
    """
    GET /api/cart/
    Fetches the current user or guest cart along with computed pricing summary.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        cart = get_or_create_cart(request)
        serializer = CartSerializer(cart)
        response_data = serializer.data
        if not (request.user and request.user.is_authenticated):
            response_data['session_key'] = cart.session_key
        return Response(response_data, status=status.HTTP_200_OK)


class AddToCartView(APIView):
    """
    POST /api/cart/add/
    Payload: { "product_id": 1, "quantity": 1 }
    Adds product to cart, validating inventory availability.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        product_id = request.data.get('product_id')
        try:
            quantity = int(request.data.get('quantity', 1))
            if quantity <= 0:
                quantity = 1
        except (ValueError, TypeError):
            quantity = 1

        if not product_id:
            return Response({"detail": "product_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        product = get_object_or_404(Product, id=product_id, is_active=True)

        if product.stock <= 0:
            return Response({"detail": f"Sorry, '{product.name}' is currently out of stock."}, status=status.HTTP_400_BAD_REQUEST)

        cart = get_or_create_cart(request)
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )

        if not created:
            new_qty = cart_item.quantity + quantity
            if new_qty > product.stock:
                cart_item.quantity = product.stock
                cart_item.save(update_fields=['quantity'])
                return Response({
                    "detail": f"Maximum available stock for '{product.name}' is {product.stock}. Cart adjusted.",
                    "cart": CartSerializer(cart).data
                }, status=status.HTTP_200_OK)
            else:
                cart_item.quantity = new_qty
                cart_item.save(update_fields=['quantity'])

        return Response({
            "message": f"Added '{product.name}' to cart successfully.",
            "cart": CartSerializer(cart).data,
            "session_key": cart.session_key if not request.user.is_authenticated else None
        }, status=status.HTTP_200_OK)


class UpdateCartItemView(APIView):
    """
    PUT /api/cart/items/<int:item_id>/
    Payload: { "quantity": 3 }
    Updates item quantity, enforcing inventory constraints.
    """
    permission_classes = [AllowAny]

    def put(self, request, item_id):
        cart = get_or_create_cart(request)
        item = get_object_or_404(CartItem, id=item_id, cart=cart)

        try:
            quantity = int(request.data.get('quantity', 1))
        except (ValueError, TypeError):
            return Response({"detail": "Invalid quantity provided."}, status=status.HTTP_400_BAD_REQUEST)

        if quantity <= 0:
            item.delete()
            return Response({
                "message": "Item removed from cart.",
                "cart": CartSerializer(cart).data
            }, status=status.HTTP_200_OK)

        if quantity > item.product.stock:
            item.quantity = item.product.stock
            item.save(update_fields=['quantity'])
            return Response({
                "detail": f"Requested quantity exceeds available stock ({item.product.stock}). Adjusted to maximum.",
                "cart": CartSerializer(cart).data
            }, status=status.HTTP_200_OK)

        item.quantity = quantity
        item.save(update_fields=['quantity'])

        return Response({
            "message": "Quantity updated.",
            "cart": CartSerializer(cart).data
        }, status=status.HTTP_200_OK)


class RemoveCartItemView(APIView):
    """
    DELETE /api/cart/items/<int:item_id>/
    Removes item from cart.
    """
    permission_classes = [AllowAny]

    def delete(self, request, item_id):
        cart = get_or_create_cart(request)
        item = get_object_or_404(CartItem, id=item_id, cart=cart)
        item.delete()

        return Response({
            "message": "Product removed from cart.",
            "cart": CartSerializer(cart).data
        }, status=status.HTTP_200_OK)


class ClearCartView(APIView):
    """
    POST /api/cart/clear/
    Removes all items from current cart.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        cart = get_or_create_cart(request)
        cart.items.all().delete()
        return Response({
            "message": "Cart cleared.",
            "cart": CartSerializer(cart).data
        }, status=status.HTTP_200_OK)
