"""
Django settings for Agriculture Products E-Commerce Platform.
"""

import os
from pathlib import Path
from datetime import timedelta

from dotenv import load_dotenv
import dj_database_url
from corsheaders.defaults import default_headers


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Load environment variables from .env file
load_dotenv(BASE_DIR / ".env")


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "django-insecure-agri-platform-dev-key-change-in-production-123456",
)


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")


ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv(
        "ALLOWED_HOSTS",
        "localhost,127.0.0.1",
    ).split(",")
    if host.strip()
]


# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third party packages
    "rest_framework",
    "corsheaders",

    # Agri platform core apps
    "users.apps.UsersConfig",
    "authentication.apps.AuthenticationConfig",
    "products.apps.ProductsConfig",
    "cart.apps.CartConfig",
    "orders.apps.OrdersConfig",
    "payments.apps.PaymentsConfig",
]


MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


ROOT_URLCONF = "config.urls"


TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


WSGI_APPLICATION = "config.wsgi.application"


# Custom User Model
AUTH_USER_MODEL = "users.CustomUser"


# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    DATABASES = {
        "default": dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=600,
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "UserAttributeSimilarityValidator"
        )
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "MinimumLengthValidator"
        )
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "CommonPasswordValidator"
        )
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "NumericPasswordValidator"
        )
    },
]


# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"

USE_I18N = True
USE_TZ = True


# Static files
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ============================================================
# Django REST Framework Configuration
# ============================================================

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "authentication.authentication.DeveloperConfiguredJWTAuthentication",
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],

    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],

    "DATETIME_FORMAT": "%Y-%m-%d %H:%M:%S",
}


# ============================================================
# Simple JWT Configuration
# ============================================================

SIMPLE_JWT = {
    # Access token is valid for 15 minutes
    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=15
    ),

    # Refresh token is valid for 7 days
    "REFRESH_TOKEN_LIFETIME": timedelta(
        days=7
    ),

    # Create a new refresh token when refreshing
    "ROTATE_REFRESH_TOKENS": True,

    # Old refresh token becomes invalid after rotation
    "BLACKLIST_AFTER_ROTATION": True,

    # Frontend must send:
    # Authorization: Bearer <access_token>
    "AUTH_HEADER_TYPES": (
        "Bearer",
    ),
}


# ============================================================
# CORS Configuration for React Frontend
# ============================================================

CORS_ALLOW_ALL_ORIGINS = True

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = list(default_headers) + [
    "x-session-key",
]


# ============================================================
# OTP Configuration
# ============================================================

OTP_PROVIDER = os.getenv(
    "OTP_PROVIDER",
    "sms",
)

SMS_PROVIDER = os.getenv(
    "SMS_PROVIDER",
    "twilio",
)

TWILIO_ACCOUNT_SID = os.getenv(
    "TWILIO_ACCOUNT_SID",
    "",
)

TWILIO_AUTH_TOKEN = os.getenv(
    "TWILIO_AUTH_TOKEN",
    "",
)

TWILIO_FROM_NUMBER = os.getenv(
    "TWILIO_FROM_NUMBER",
    "",
)


# OTP security settings

OTP_EXPIRY_MINUTES = int(
    os.getenv(
        "OTP_EXPIRY_MINUTES",
        "5",
    )
)

OTP_MAX_ATTEMPTS = int(
    os.getenv(
        "OTP_MAX_ATTEMPTS",
        "3",
    )
)

OTP_RESEND_COOLDOWN_SECONDS = int(
    os.getenv(
        "OTP_RESEND_COOLDOWN_SECONDS",
        "60",
    )
)

OTP_HOURLY_RATE_LIMIT = int(
    os.getenv(
        "OTP_HOURLY_RATE_LIMIT",
        "5",
    )
)


# ============================================================
# Email Settings
# ============================================================

EMAIL_BACKEND = os.getenv(
    "EMAIL_BACKEND",
    (
        "django.core.mail.backends.console.EmailBackend"
        if DEBUG
        else "django.core.mail.backends.smtp.EmailBackend"
    ),
)

EMAIL_HOST = os.getenv(
    "EMAIL_HOST",
    "localhost",
)

EMAIL_PORT = int(
    os.getenv(
        "EMAIL_PORT",
        "587",
    )
)

EMAIL_USE_TLS = os.getenv(
    "EMAIL_USE_TLS",
    "True",
).lower() in (
    "true",
    "1",
)

EMAIL_HOST_USER = os.getenv(
    "EMAIL_USERNAME",
    "",
)

EMAIL_HOST_PASSWORD = os.getenv(
    "EMAIL_PASSWORD",
    "",
)

DEFAULT_FROM_EMAIL = os.getenv(
    "DEFAULT_FROM_EMAIL",
    "AgriProducts Marketplace <no-reply@agriproducts.com>",
)


# ============================================================
# Payment Gateway Configuration
# ============================================================

PAYMENT_PROVIDER = os.getenv(
    "PAYMENT_PROVIDER",
    "mock",
)

PAYMENT_PUBLIC_KEY = os.getenv(
    "PAYMENT_PUBLIC_KEY",
    "pk_test_sample_public_key",
)

PAYMENT_SECRET_KEY = os.getenv(
    "PAYMENT_SECRET_KEY",
    "sk_test_sample_secret_key",
)