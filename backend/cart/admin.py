from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ('product', 'quantity', 'line_subtotal', 'line_total')


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'session_key', 'total_items_count', 'created_at', 'updated_at')
    search_fields = ('user__email', 'user__phone', 'session_key')
    inlines = [CartItemInline]
