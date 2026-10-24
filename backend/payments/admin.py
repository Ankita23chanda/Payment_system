from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'order',
        'transaction_id',
        'payment_gateway',
        'amount',
        'currency',
        'status',
        'created_at',
    )
    list_filter = ('status', 'payment_gateway', 'created_at')
    search_fields = ('order__order_number', 'transaction_id', 'gateway_order_id', 'gateway_payment_id')
    readonly_fields = (
        'order',
        'transaction_id',
        'payment_gateway',
        'gateway_order_id',
        'gateway_payment_id',
        'gateway_signature',
        'amount',
        'currency',
        'raw_response',
        'created_at',
        'updated_at',
    )
    list_editable = ('status',)
