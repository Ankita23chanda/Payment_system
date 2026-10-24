from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db.models import Max


class CustomUserManager(BaseUserManager):
    """
    Custom user manager supporting passwordless OTP authentication via Email or Phone.
    """
    def create_user(self, email=None, phone=None, password=None, **extra_fields):
        if not email and not phone:
            raise ValueError("A user must have either an email address or a phone number.")
        
        if email:
            email = self.normalize_email(email).lower()
        if phone:
            phone = phone.strip()

        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)

        user = self.model(email=email, phone=phone, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email=None, phone=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_email_verified', True)
        extra_fields.setdefault('is_phone_verified', True)

        if not email and not phone:
            email = 'admin@agriproducts.com'

        if not password:
            raise ValueError("Superusers must have a password.")

        return self.create_user(email=email, phone=phone, password=password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    Custom User Model adhering strictly to requirements:
    - id
    - email
    - phone
    - is_email_verified
    - is_phone_verified
    - is_active
    - is_staff
    - date_joined
    - last_login
    - created_at
    - updated_at
    Prevents duplicate accounts when a customer uses email and mobile authentication.
    """
    id = models.BigAutoField(primary_key=True)
    customer_id = models.CharField(
        max_length=20,
        unique=True,
        null=True,
        blank=True,
        db_index=True,
        editable=False,
        help_text="Permanent customer identifier, e.g. CUST-1001",
    )
    email = models.EmailField(unique=True, null=True, blank=True, max_length=255, db_index=True)
    phone = models.CharField(unique=True, null=True, blank=True, max_length=20, db_index=True)
    name = models.CharField(max_length=150, blank=True, default='')
    location = models.CharField(max_length=255, blank=True, default='')
    address = models.TextField(blank=True, default='')

    is_email_verified = models.BooleanField(default=True)
    is_phone_verified = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = 'Customer User'
        verbose_name_plural = 'Customer Users'
        ordering = ['-created_at']

    def clean(self):
        super().clean()
        if not self.email and not self.phone:
            raise ValidationError("Either email or phone number must be provided.")

    def save(self, *args, **kwargs):
        """Auto-assign a permanent customer_id on first save."""
        if not self.customer_id:
            self.customer_id = CustomUser._generate_customer_id()
        super().save(*args, **kwargs)

    @staticmethod
    def _generate_customer_id():
        """Generate the next sequential CUST-XXXX identifier."""
        last = CustomUser.objects.filter(
            customer_id__startswith='CUST-'
        ).aggregate(Max('customer_id'))['customer_id__max']
        if last:
            try:
                last_num = int(last.split('-')[1])
            except (IndexError, ValueError):
                last_num = 1000
            return f"CUST-{last_num + 1}"
        return "CUST-1001"

    def __str__(self):
        cid = self.customer_id or f"User #{self.id}"
        if self.email and self.phone:
            return f"{cid} — {self.email} ({self.phone})"
        return f"{cid} — {self.email or self.phone or f'User #{self.id}'}"

    @property
    def identifier(self):
        return self.email or self.phone or f"user_{self.id}"


class Wishlist(models.Model):
    """
    Customer wishlist entries.
    Enforces UNIQUE(customer, product) at the database level.
    Each entry is permanently linked to the customer's Customer ID.
    """
    customer = models.ForeignKey(
        CustomUser,
        related_name='wishlist_items',
        on_delete=models.CASCADE,
        db_index=True,
    )
    product = models.ForeignKey(
        'products.Product',
        related_name='wishlisted_by',
        on_delete=models.CASCADE,
    )
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Wishlist Item'
        verbose_name_plural = 'Wishlist Items'
        unique_together = [('customer', 'product')]  # DB-level UNIQUE(customer_id, product_id)
        ordering = ['-added_at']

    def __str__(self):
        return f"{self.customer.customer_id} → {self.product.name}"
