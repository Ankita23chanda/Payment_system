from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from products.models import Product
from .models import CustomUser, Wishlist
from .serializers import UserSerializer, UserUpdateSerializer, WishlistItemSerializer


class UserProfileView(APIView):
    """
    GET  /api/users/me/  — get the authenticated customer's profile (includes customer_id).
    PATCH /api/users/me/ — update name, email, phone, location, address.
    """
    def get(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided or invalid."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided or invalid."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WishlistView(APIView):
    """
    GET  /api/users/wishlist/  — list all wishlist items for the authenticated customer.
    POST /api/users/wishlist/  — add a product to the customer's wishlist.

    Enforces: one wishlist per Customer ID, UNIQUE(customer, product) at DB level.
    Customers cannot see or modify each other's wishlists.
    """

    def get(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response(
                {"detail": "Please log in to view your wishlist."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        items = Wishlist.objects.filter(
            customer=request.user
        ).select_related('product')
        serializer = WishlistItemSerializer(items, many=True)
        return Response({
            "customer_id": request.user.customer_id,
            "count": items.count(),
            "items": serializer.data,
        }, status=status.HTTP_200_OK)

    def post(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response(
                {"detail": "Please log in to add items to your wishlist."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        product_id = request.data.get("product_id")
        if not product_id:
            return Response(
                {"detail": "product_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        product = get_object_or_404(Product, id=product_id)

        # get_or_create ensures UNIQUE(customer, product) — no duplicate entries
        item, created = Wishlist.objects.get_or_create(
            customer=request.user,
            product=product,
        )
        if not created:
            return Response(
                {"detail": "This product is already in your wishlist."},
                status=status.HTTP_200_OK,
            )
        serializer = WishlistItemSerializer(item)
        return Response({
            "message": "Product added to your wishlist.",
            "customer_id": request.user.customer_id,
            "item": serializer.data,
        }, status=status.HTTP_201_CREATED)


class WishlistItemDeleteView(APIView):
    """
    DELETE /api/users/wishlist/<int:product_id>/
    Removes a product from the authenticated customer's wishlist.
    Enforces ownership — a customer can only delete from their own wishlist.
    """

    def delete(self, request, product_id):
        if not request.user or not request.user.is_authenticated:
            return Response(
                {"detail": "Please log in to manage your wishlist."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        item = get_object_or_404(
            Wishlist,
            customer=request.user,   # ownership enforced here
            product_id=product_id,
        )
        item.delete()
        return Response(
            {"message": "Product removed from your wishlist.", "customer_id": request.user.customer_id},
            status=status.HTTP_200_OK,
        )
