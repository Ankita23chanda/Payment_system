from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser, Wishlist


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = (
        'customer_id', 'id', 'email', 'phone', 'name',
        'is_email_verified', 'is_phone_verified', 'is_staff', 'is_active', 'created_at',
    )
    list_filter = ('is_email_verified', 'is_phone_verified', 'is_staff', 'is_active')
    search_fields = ('customer_id', 'email', 'phone', 'name')
    ordering = ('customer_id',)
    readonly_fields = ('customer_id', 'date_joined', 'last_login', 'created_at', 'updated_at')

    fieldsets = (
        ('Customer Identity', {'fields': ('customer_id', 'email', 'phone', 'name')}),
        ('Address', {'fields': ('location', 'address')}),
        ('Verification Status', {'fields': ('is_email_verified', 'is_phone_verified')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')}),
    )


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_customer_id', 'get_customer_name', 'product', 'added_at')
    list_filter = ('added_at',)
    search_fields = ('customer__customer_id', 'customer__email', 'customer__phone', 'product__name')
    ordering = ('-added_at',)
    readonly_fields = ('added_at',)

    @admin.display(description='Customer ID')
    def get_customer_id(self, obj):
        return obj.customer.customer_id

    @admin.display(description='Customer')
    def get_customer_name(self, obj):
        return obj.customer.name or obj.customer.email or obj.customer.phone
