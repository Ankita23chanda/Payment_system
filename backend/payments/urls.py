from django.urls import path
from .views import CreatePaymentSessionView, VerifyPaymentView, PaymentStatusView

urlpatterns = [
    path('create-session/', CreatePaymentSessionView.as_view(), name='payment-create-session'),
    path('verify/', VerifyPaymentView.as_view(), name='payment-verify'),
    path('<str:order_number>/status/', PaymentStatusView.as_view(), name='payment-status'),
]
