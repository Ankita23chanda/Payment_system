from rest_framework import serializers
from .models import CustomUser, Wishlist


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id',
            'customer_id',
            'email',
            'phone',
            'name',
            'location',
            'address',
            'is_email_verified',
            'is_phone_verified',
            'is_active',
            'is_staff',
            'date_joined',
            'last_login',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'customer_id',
            'is_email_verified',
            'is_phone_verified',
            'is_active',
            'is_staff',
            'date_joined',
            'last_login',
            'created_at',
            'updated_at',
        ]


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['name', 'email', 'phone', 'location', 'address']

    def validate_phone(self, value):
        """Ensure updated phone is not taken by another customer."""
        if value:
            qs = CustomUser.objects.filter(phone=value)
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError(
                    "This mobile number is already registered. Please log in."
                )
        return value

    def validate_email(self, value):
        """Ensure updated email is not taken by another customer."""
        if value:
            email = value.strip().lower()
            qs = CustomUser.objects.filter(email=email)
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError(
                    "An account with this email address already exists."
                )
        return value


class WishlistItemSerializer(serializers.ModelSerializer):
    """Serializes a single wishlist entry, embedding product summary."""
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.CharField(source='product.image', read_only=True)
    product_price = serializers.DecimalField(
        source='product.effective_price', max_digits=10, decimal_places=2, read_only=True
    )
    product_brand = serializers.CharField(source='product.brand', read_only=True)

    class Meta:
        model = Wishlist
        fields = [
            'id',
            'product_id',
            'product_name',
            'product_image',
            'product_price',
            'product_brand',
            'added_at',
        ]
        read_only_fields = fields
