import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from products.models import Product


class Order(models.Model):
    """
    Authoritative Order model tracking customer purchases, delivery addresses,
    and server-verified pricing snapshots.
    """
    STATUS_CHOICES = (
        ('PENDING', 'Pending Payment'),
        ('CONFIRMED', 'Confirmed & Placed'),
        ('PROCESSING', 'Processing in Warehouse'),
        ('SHIPPED', 'Dispatched / In Transit'),
        ('DELIVERED', 'Delivered to Farm'),
        ('CANCELLED', 'Cancelled'),
    )

    id = models.BigAutoField(primary_key=True)
    order_number = models.CharField(max_length=50, unique=True, db_index=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='orders',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING', db_index=True)

    # Customer Contact Info
    customer_name = models.CharField(max_length=150)
    customer_email = models.EmailField(max_length=255)
    customer_phone = models.CharField(max_length=20)

    # Shipping Address Details
    shipping_address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default='India')
    postal_code = models.CharField(max_length=20)

    # Authoritative Server Pricing Snapshot
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Agricultural Order'
        verbose_name_plural = 'Agricultural Orders'
        ordering = ['-created_at']

    @classmethod
    def generate_order_number(cls):
        random_suffix = uuid.uuid4().hex[:8].upper()
        return f"AGRI-{random_suffix}"

    def __str__(self):
        return f"{self.order_number} - {self.customer_name} (₹{self.total_amount})"


class OrderItem(models.Model):
    """
    Immutable snapshot of line items captured at the time of order placement.
    """
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='order_items', on_delete=models.SET_NULL, null=True, blank=True)
    product_name = models.CharField(max_length=255)
    product_brand = models.CharField(max_length=150, blank=True, default='')
    product_image = models.CharField(max_length=500, blank=True, default='')
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = 'Order Line Item'
        verbose_name_plural = 'Order Line Items'

    def __str__(self):
        return f"{self.quantity}x {self.product_name} ({self.order.order_number})"
