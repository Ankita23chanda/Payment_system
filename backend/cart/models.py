from decimal import Decimal
from django.db import models
from django.conf import settings
from products.models import Product


class Cart(models.Model):
    """
    Shopping cart supporting both authenticated users and anonymous sessions.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='carts',
        null=True,
        blank=True
    )
    session_key = models.CharField(max_length=100, null=True, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Shopping Cart'
        verbose_name_plural = 'Shopping Carts'

    @property
    def total_items_count(self):
        return sum(item.quantity for item in self.items.all())

    def calculate_summary(self):
        """
        Authoritative server-side price calculation.
        """
        subtotal = Decimal('0.00')
        discount_amount = Decimal('0.00')

        items = self.items.select_related('product').all()
        for item in items:
            product = item.product
            qty = Decimal(item.quantity)
            subtotal += product.price * qty
            if product.discount_price and product.discount_price < product.price:
                discount_amount += (product.price - product.discount_price) * qty

        effective_subtotal = subtotal - discount_amount

        # Free shipping threshold for agricultural orders over ₹999; otherwise ₹99 delivery fee
        if effective_subtotal >= Decimal('999.00') or effective_subtotal == Decimal('0.00'):
            shipping_fee = Decimal('0.00')
        else:
            shipping_fee = Decimal('99.00')

        # 5% Agricultural GST
        tax_amount = (effective_subtotal * Decimal('0.05')).quantize(Decimal('0.01'))
        total_amount = effective_subtotal + shipping_fee + tax_amount

        return {
            "subtotal": subtotal,
            "discount_amount": discount_amount,
            "effective_subtotal": effective_subtotal,
            "shipping_fee": shipping_fee,
            "tax_amount": tax_amount,
            "total_amount": total_amount,
            "free_shipping_threshold": Decimal('999.00'),
            "free_shipping_applied": shipping_fee == Decimal('0.00') and effective_subtotal > 0
        }

    def __str__(self):
        owner = self.user.identifier if self.user else f"Session {self.session_key}"
        return f"Cart #{self.id} ({owner})"


class CartItem(models.Model):
    """
    Individual product line within a shopping cart.
    """
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='cart_items', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Cart Item'
        verbose_name_plural = 'Cart Items'
        unique_together = ('cart', 'product')

    @property
    def line_subtotal(self):
        return self.product.price * self.quantity

    @property
    def line_total(self):
        return self.product.effective_price * self.quantity

    def __str__(self):
        return f"{self.quantity}x {self.product.name} (Cart #{self.cart_id})"
