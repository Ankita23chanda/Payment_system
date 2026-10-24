import logging

from django.utils import timezone
from django.core.exceptions import ValidationError as DjangoValidationError

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from users.models import CustomUser

from .serializers import (
    SendOTPSerializer,
    VerifyOTPSerializer,
    RegisterSerializer,
    LoginSerializer,
)

from .otp_service import OTPService
from .jwt_service import generate_tokens_for_user


logger = logging.getLogger(__name__)


class SendOTPView(APIView):
    """
    POST /api/auth/send-otp/

    Sends a random 6-digit OTP to the user's
    phone or email.
    """

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = SendOTPSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        identifier = serializer.validated_data[
            "identifier"
        ]

        identifier_type = serializer.validated_data[
            "identifier_type"
        ]

        try:

            result = OTPService.send_otp(
                identifier,
                identifier_type,
            )

            return Response(
                result,
                status=status.HTTP_200_OK,
            )

        except DjangoValidationError as exc:

            message = (
                exc.message
                if hasattr(exc, "message")
                else str(exc)
            )

            return Response(
                {"detail": message},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception:

            logger.exception(
                "Unexpected error while sending OTP."
            )

            return Response(
                {
                    "detail": (
                        "Unable to send OTP at this time."
                    )
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class VerifyOTPView(APIView):
    """
    POST /api/auth/verify-otp/

    Verifies OTP, finds/creates the user,
    and returns JWT access + refresh tokens.
    """

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = VerifyOTPSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        identifier = (
            serializer.validated_data["identifier"]
            .strip()
        )

        otp = (
            serializer.validated_data["otp"]
            .strip()
        )

        try:

            # -------------------------------
            # Verify OTP
            # -------------------------------

            OTPService.verify_otp(
                identifier,
                otp,
            )

            # -------------------------------
            # Find/create user
            # -------------------------------

            if "@" in identifier:

                email = identifier.lower()

                user = (
                    CustomUser.objects
                    .filter(email=email)
                    .first()
                )

                if not user:

                    user = (
                        CustomUser.objects
                        .create_user(
                            email=email,
                            is_email_verified=True,
                            is_active=True,
                        )
                    )

                else:

                    user.is_email_verified = True
                    user.last_login = timezone.now()

                    user.save(
                        update_fields=[
                            "is_email_verified",
                            "last_login",
                        ]
                    )

            else:

                phone = identifier

                user = (
                    CustomUser.objects
                    .filter(phone=phone)
                    .first()
                )

                if not user:

                    # Check for duplicate phone before creating
                    if CustomUser.objects.filter(phone=phone).exists():
                        user = CustomUser.objects.get(phone=phone)
                    else:
                        user = (
                            CustomUser.objects
                            .create_user(
                                phone=phone,
                                is_phone_verified=True,
                                is_active=True,
                            )
                        )

                else:

                    user.is_phone_verified = True
                    user.last_login = timezone.now()

                    user.save(
                        update_fields=[
                            "is_phone_verified",
                            "last_login",
                        ]
                    )

            # -------------------------------
            # Generate JWT
            # -------------------------------

            tokens = generate_tokens_for_user(
                user
            )

            return Response(
                tokens,
                status=status.HTTP_200_OK,
            )

        except DjangoValidationError as exc:

            message = (
                exc.message
                if hasattr(exc, "message")
                else str(exc)
            )

            return Response(
                {"detail": message},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception:

            logger.exception(
                "Unexpected OTP verification error."
            )

            return Response(
                {
                    "detail": (
                        "Unable to verify OTP."
                    )
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class RegisterView(APIView):
    """
    POST /api/auth/register/
    Registers a new user with email, password, name, location, address, and optional phone.
    Returns JWT tokens on successful registration.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        email = data["email"]
        password = data["password"]
        name = data.get("name", "")
        location = data.get("location", "")
        address = data.get("address", "")
        phone = data.get("phone", "")

        user = CustomUser.objects.create_user(
            email=email,
            password=password,
            name=name,
            location=location,
            address=address,
            phone=phone if phone else None,
            is_email_verified=True,
            is_active=True,
        )

        tokens = generate_tokens_for_user(user)
        return Response(
            {
                "message": "Registration successful.",
                **tokens,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """
    POST /api/auth/login/
    Authenticates a user via email and password, returning JWT access and refresh tokens.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"].strip().lower()
        password = serializer.validated_data["password"]

        user = CustomUser.objects.filter(email=email).first()

        if not user or not user.check_password(password):
            return Response(
                {"detail": "Invalid email or password. Please check your credentials."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.is_active:
            return Response(
                {"detail": "Your account has been deactivated. Please contact support."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])

        tokens = generate_tokens_for_user(user)
        return Response(
            {
                "message": "Login successful.",
                **tokens,
            },
            status=status.HTTP_200_OK,
        )