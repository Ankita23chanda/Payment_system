from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    """
    Agricultural Product Category:
    Pesticides, Insecticides, Herbicides, Fungicides, Fertilizers,
    Seeds, Plant-growth products, Agricultural tools, Equipment, Organic farming products.
    """
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True, default='')
    icon = models.CharField(max_length=50, blank=True, default='leaf')
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ['display_order', 'name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    """
    Agricultural Product model with comprehensive agronomic metadata,
    pricing, inventory, and safety compliance attributes.
    """
    id = models.BigAutoField(primary_key=True)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock = models.PositiveIntegerField(default=10)
    image = models.CharField(max_length=500, blank=True, default='')
    brand = models.CharField(max_length=150, db_index=True)
    
    # Detailed agricultural specifications: Active ingredient, Formulation, Pack size, Target crop/pests
    specifications = models.JSONField(default=dict, blank=True)
    
    # Agricultural safety, hazard classification, PPE requirements, and withholding period
    safety_information = models.TextField(blank=True, default='')
    
    # Dosage, dilution ratio, application method, and recommended spraying time
    usage_instructions = models.TextField(blank=True, default='')
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Agricultural Product'
        verbose_name_plural = 'Agricultural Products'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['price']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            candidate_slug = base_slug
            counter = 1
            while Product.objects.filter(slug=candidate_slug).exclude(pk=self.pk).exists():
                candidate_slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = candidate_slug
        super().save(*args, **kwargs)

    @property
    def effective_price(self):
        if self.discount_price and self.discount_price > 0 and self.discount_price < self.price:
            return self.discount_price
        return self.price

    @property
    def discount_percentage(self):
        if self.discount_price and self.discount_price < self.price and self.price > 0:
            discount = ((self.price - self.discount_price) / self.price) * 100
            return round(discount)
        return 0

    @property
    def in_stock(self):
        return self.stock > 0

    def __str__(self):
        return f"{self.name} ({self.brand}) - ₹{self.effective_price}"
