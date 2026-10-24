from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product',
            'product_name',
            'product_brand',
            'product_image',
            'unit_price',
            'quantity',
            'total_price',
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment_status = serializers.CharField(source='payment.status', read_only=True, default='PENDING')
    transaction_id = serializers.CharField(source='payment.transaction_id', read_only=True, default=None)
    # Expose the permanent customer_id on every order response
    customer_id = serializers.CharField(source='user.customer_id', read_only=True, default=None)

    class Meta:
        model = Order
        fields = [
            'id',
            'order_number',
            'customer_id',
            'status',
            'payment_status',
            'transaction_id',
            'customer_name',
            'customer_email',
            'customer_phone',
            'shipping_address',
            'city',
            'state',
            'country',
            'postal_code',
            'subtotal',
            'discount_amount',
            'shipping_fee',
            'tax_amount',
            'total_amount',
            'items',
            'created_at',
            'updated_at',
        ]
        read_only_fields = fields


class CheckoutSerializer(serializers.Serializer):
    customer_name = serializers.CharField(max_length=150)
    customer_email = serializers.EmailField(max_length=255)
    customer_phone = serializers.CharField(max_length=20)
    shipping_address = serializers.CharField()
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)
    country = serializers.CharField(max_length=100, default='India')
    postal_code = serializers.CharField(max_length=20)
