from django.urls import path
from .views import UserProfileView, WishlistView, WishlistItemDeleteView

urlpatterns = [
    path('me/', UserProfileView.as_view(), name='user-profile'),
    path('wishlist/', WishlistView.as_view(), name='wishlist'),
    path('wishlist/<int:product_id>/', WishlistItemDeleteView.as_view(), name='wishlist-item-delete'),
]
