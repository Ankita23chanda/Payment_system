from decimal import Decimal
from django.db import models
from orders.models import Order


class Payment(models.Model):
    """
    Payment transaction ledger ensuring atomic state transitions,
    tamper-proof server-side pricing, and duplicate payment prevention.
    """
    STATUS_CHOICES = (
        ('PENDING', 'Pending Payment'),
        ('SUCCESS', 'Payment Successful'),
        ('FAILED', 'Payment Failed'),
        ('CANCELLED', 'Payment Cancelled'),
        ('REFUNDED', 'Payment Refunded'),
    )

    id = models.BigAutoField(primary_key=True)
    order = models.OneToOneField(Order, related_name='payment', on_delete=models.CASCADE)
    transaction_id = models.CharField(max_length=100, unique=True, null=True, blank=True, db_index=True)
    payment_gateway = models.CharField(max_length=50, default='MOCK_GATEWAY')
    gateway_order_id = models.CharField(max_length=100, null=True, blank=True)
    gateway_payment_id = models.CharField(max_length=100, null=True, blank=True)
    gateway_signature = models.CharField(max_length=255, null=True, blank=True)
    
    # Authoritative server-side verified amount
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='INR')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING', db_index=True)
    raw_response = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Payment Ledger'
        verbose_name_plural = 'Payment Ledgers'
        ordering = ['-created_at']

    def __str__(self):
        return f"Payment #{self.id} for Order {self.order.order_number} - {self.status} (₹{self.amount})"
