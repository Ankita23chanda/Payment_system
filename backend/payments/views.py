import logging
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404

from orders.models import Order
from .models import Payment
from .serializers import PaymentSerializer, CreatePaymentSessionSerializer, VerifyPaymentSerializer
from .gateways import get_payment_gateway

logger = logging.getLogger(__name__)


class CreatePaymentSessionView(APIView):
    """
    POST /api/payments/create-session/
    Initiates payment session with payment gateway.
    Amount is strictly determined by the server-side Order total.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CreatePaymentSessionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        order_number = serializer.validated_data['order_number']
        order = get_object_or_404(Order, order_number=order_number)

        # Check if already paid
        existing_payment = Payment.objects.filter(order=order).first()
        if existing_payment and existing_payment.status == 'SUCCESS':
            return Response({
                "detail": "This order has already been paid and confirmed.",
                "status": "SUCCESS",
                "transaction_id": existing_payment.transaction_id,
            }, status=status.HTTP_400_BAD_REQUEST)

        gateway = get_payment_gateway()
        session_info = gateway.create_order_session(order)

        # Update gateway tracking on payment record
        if existing_payment:
            existing_payment.gateway_order_id = session_info.get("gateway_order_id")
            existing_payment.payment_gateway = session_info.get("gateway", "MOCK_GATEWAY")
            existing_payment.save(update_fields=['gateway_order_id', 'payment_gateway'])
        else:
            Payment.objects.create(
                order=order,
                amount=order.total_amount,
                currency='INR',
                status='PENDING',
                gateway_order_id=session_info.get("gateway_order_id"),
                payment_gateway=session_info.get("gateway", "MOCK_GATEWAY"),
            )

        return Response(session_info, status=status.HTTP_200_OK)


class VerifyPaymentView(APIView):
    """
    POST /api/payments/verify/
    Verifies payment response server-side using atomic database locks.
    Guards against race conditions, duplicate processing, and amount tampering.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyPaymentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        order_number = serializer.validated_data['order_number']

        with transaction.atomic():
            # Acquire exclusive row lock on payment and order
            order = get_object_or_404(Order.objects.select_for_update(), order_number=order_number)
            payment, _ = Payment.objects.select_for_update().get_or_create(
                order=order,
                defaults={'amount': order.total_amount, 'currency': 'INR', 'status': 'PENDING'}
            )

            # Prevent duplicate payment processing (Idempotency Guard)
            if payment.status == 'SUCCESS':
                return Response({
                    "status": "SUCCESS",
                    "order_number": order.order_number,
                    "transaction_id": payment.transaction_id,
                    "message": "Payment was already verified and confirmed.",
                }, status=status.HTTP_200_OK)

            gateway = get_payment_gateway()
            verification_result = gateway.verify_payment(serializer.validated_data)

            payment_status = verification_result.get("status", "FAILED")
            payment.raw_response = verification_result

            if verification_result.get("success") is True and payment_status == "SUCCESS":
                payment.status = 'SUCCESS'
                payment.transaction_id = verification_result.get("transaction_id")
                payment.gateway_payment_id = verification_result.get("gateway_payment_id")
                payment.gateway_signature = verification_result.get("gateway_signature")
                payment.save()

                # Update order status
                order.status = 'CONFIRMED'
                order.save(update_fields=['status'])

                # Deduct inventory stock for each purchased product
                for item in order.items.select_related('product').all():
                    if item.product:
                        product = item.product
                        # Decrease stock, ensuring no negative inventory
                        product.stock = max(0, product.stock - item.quantity)
                        product.save(update_fields=['stock'])

                logger.info(f"Payment successful for Order {order.order_number}. Txn: {payment.transaction_id}")

                return Response({
                    "status": "SUCCESS",
                    "order_number": order.order_number,
                    "transaction_id": payment.transaction_id,
                    "amount": float(payment.amount),
                    "currency": payment.currency,
                    "message": "Payment verified successfully. Order confirmed!",
                }, status=status.HTTP_200_OK)

            else:
                # Handle FAILED or CANCELLED
                payment.status = payment_status
                payment.transaction_id = verification_result.get("transaction_id")
                payment.save()

                logger.warning(f"Payment {payment_status} for Order {order.order_number}")

                return Response({
                    "status": payment_status,
                    "order_number": order.order_number,
                    "transaction_id": payment.transaction_id,
                    "reason": verification_result.get("reason", "Payment verification failed."),
                }, status=status.HTTP_400_BAD_REQUEST)


class PaymentStatusView(APIView):
    """
    GET /api/payments/<str:order_number>/status/
    Retrieves current payment ledger status for an order.
    """
    permission_classes = [AllowAny]

    def get(self, request, order_number):
        order = get_object_or_404(Order, order_number=order_number)
        payment = Payment.objects.filter(order=order).first()
        if not payment:
            return Response({"status": "PENDING", "order_number": order_number}, status=status.HTTP_200_OK)

        serializer = PaymentSerializer(payment)
        return Response(serializer.data, status=status.HTTP_200_OK)
