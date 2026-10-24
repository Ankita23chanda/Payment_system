from django.contrib import admin
from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'icon', 'display_order', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('display_order', 'is_active')
    search_fields = ('name', 'description')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'brand', 'price', 'discount_price', 'stock', 'is_active', 'created_at')
    list_filter = ('category', 'brand', 'is_active')
    search_fields = ('name', 'brand', 'description', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('price', 'discount_price', 'stock', 'is_active')
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        ('General Information', {
            'fields': ('name', 'slug', 'category', 'brand', 'description', 'image', 'is_active')
        }),
        ('Pricing & Inventory', {
            'fields': ('price', 'discount_price', 'stock')
        }),
        ('Agronomic Specifications & Safety', {
            'fields': ('specifications', 'safety_information', 'usage_instructions')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        })
    )
