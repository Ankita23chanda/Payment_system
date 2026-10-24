from django.urls import path
from .views import CheckoutView, OrderListView, OrderDetailView

urlpatterns = [
    path('checkout/', CheckoutView.as_view(), name='order-checkout'),
    path('', OrderListView.as_view(), name='order-list'),
    path('<str:order_number>/', OrderDetailView.as_view(), name='order-detail'),
]
