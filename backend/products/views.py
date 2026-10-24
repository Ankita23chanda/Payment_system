from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.db.models import Q
from .models import Category, Product
from .serializers import CategorySerializer, ProductListSerializer, ProductDetailSerializer


class CategoryListView(APIView):
    """
    GET /api/products/categories/
    List all active agricultural categories.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        categories = Category.objects.filter(is_active=True).order_by('display_order', 'name')
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductListView(APIView):
    """
    GET /api/products/
    Filterable and searchable marketplace listing.
    Query parameters:
    - search: search term for name, brand, description
    - category: category slug or ID
    - min_price: minimum price threshold
    - max_price: maximum price threshold
    - brand: brand filter
    - in_stock: true
    - sort: price_asc | price_desc | discount | newest
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        queryset = Product.objects.filter(is_active=True).select_related('category')

        # Search
        search_query = request.query_params.get('search', '').strip()
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(brand__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(category__name__icontains=search_query)
            )

        # Category filter
        category_param = request.query_params.get('category', '').strip()
        if category_param:
            if category_param.isdigit():
                queryset = queryset.filter(category_id=int(category_param))
            else:
                queryset = queryset.filter(category__slug=category_param)

        # Brand filter
        brand_param = request.query_params.get('brand', '').strip()
        if brand_param:
            queryset = queryset.filter(brand__iexact=brand_param)

        # Price range filter
        min_price = request.query_params.get('min_price')
        if min_price:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except ValueError:
                pass

        max_price = request.query_params.get('max_price')
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except ValueError:
                pass

        # In stock only
        in_stock_param = request.query_params.get('in_stock', '').lower()
        if in_stock_param in ['true', '1', 'yes']:
            queryset = queryset.filter(stock__gt=0)

        # Sorting
        sort_param = request.query_params.get('sort', 'newest')
        if sort_param == 'price_asc':
            queryset = queryset.order_by('price')
        elif sort_param == 'price_desc':
            queryset = queryset.order_by('-price')
        elif sort_param == 'discount':
            queryset = queryset.order_by('-discount_price', 'price')
        elif sort_param == 'name_asc':
            queryset = queryset.order_by('name')
        else: # newest
            queryset = queryset.order_by('-created_at')

        serializer = ProductListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductDetailView(APIView):
    """
    GET /api/products/<id_or_slug>/
    Retrieves full agricultural product dossier including safety instructions & specs.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request, identifier):
        queryset = Product.objects.filter(is_active=True).select_related('category')
        product = None
        if identifier.isdigit():
            product = queryset.filter(id=int(identifier)).first()
        if not product:
            product = queryset.filter(slug=identifier).first()

        if not product:
            return Response({"detail": "Agricultural product not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductDetailSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)
