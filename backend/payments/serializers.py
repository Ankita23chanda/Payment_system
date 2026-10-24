from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id',
            'order',
            'transaction_id',
            'payment_gateway',
            'gateway_order_id',
            'gateway_payment_id',
            'amount',
            'currency',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = fields


class CreatePaymentSessionSerializer(serializers.Serializer):
    order_number = serializers.CharField(max_length=50)


class VerifyPaymentSerializer(serializers.Serializer):
    order_number = serializers.CharField(max_length=50)
    gateway_order_id = serializers.CharField(max_length=100, required=False, allow_blank=True)
    gateway_payment_id = serializers.CharField(max_length=100, required=False, allow_blank=True)
    gateway_signature = serializers.CharField(max_length=255, required=False, allow_blank=True)
    simulate_action = serializers.ChoiceField(
        choices=['SUCCESS', 'FAILED', 'CANCELLED'],
        default='SUCCESS',
        required=False
    )
