from django.urls import path

from .views import (
    SendOTPView,
    VerifyOTPView,
    RegisterView,
    LoginView,
)

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [

    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),

    path(
        "login/",
        LoginView.as_view(),
        name="login",
    ),

    path(
        "send-otp/",
        SendOTPView.as_view(),
        name="send-otp",
    ),

    path(
        "verify-otp/",
        VerifyOTPView.as_view(),
        name="verify-otp",
    ),

    path(
        "refresh/",
        TokenRefreshView.as_view(),
        name="token-refresh",
    ),
]