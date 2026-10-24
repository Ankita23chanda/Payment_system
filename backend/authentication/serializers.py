import re

from rest_framework import serializers
from django.core.validators import validate_email
from django.core.exceptions import ValidationError


class SendOTPSerializer(serializers.Serializer):

    identifier = serializers.CharField(
        max_length=255
    )

    identifier_type = serializers.ChoiceField(
        choices=["email", "phone"]
    )

    def validate(self, attrs):

        identifier = (
            attrs["identifier"].strip()
        )

        identifier_type = attrs[
            "identifier_type"
        ]

        if identifier_type == "email":

            try:
                validate_email(identifier)

            except ValidationError:

                raise serializers.ValidationError(
                    {
                        "identifier":
                        "Please enter a valid email address."
                    }
                )

            attrs["identifier"] = (
                identifier.lower()
            )

        elif identifier_type == "phone":

            cleaned_phone = re.sub(
                r"[^\d+]",
                "",
                identifier,
            )

            if not re.match(
                r"^\+?[1-9]\d{9,14}$",
                cleaned_phone,
            ):
                raise serializers.ValidationError(
                    {
                        "identifier":
                        "Please enter a valid mobile number."
                    }
                )

            attrs["identifier"] = cleaned_phone

        return attrs


class VerifyOTPSerializer(serializers.Serializer):

    identifier = serializers.CharField(
        max_length=255
    )

    otp = serializers.CharField(
        min_length=6,
        max_length=6,
    )

    def validate_otp(self, value):

        value = value.strip()

        if not value.isdigit():

            raise serializers.ValidationError(
                "OTP must contain only numbers."
            )

        if len(value) != 6:

            raise serializers.ValidationError(
                "OTP must be exactly 6 digits."
            )

        return value


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6, write_only=True)
    name = serializers.CharField(max_length=150, required=False, allow_blank=True, default="")
    location = serializers.CharField(max_length=255, required=False, allow_blank=True, default="")
    address = serializers.CharField(required=False, allow_blank=True, default="")
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True, default="")

    def validate_email(self, value):
        from users.models import CustomUser
        email = value.strip().lower()
        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError("An account with this email address already exists.")
        return email

    def validate_phone(self, value):
        from users.models import CustomUser
        if value and value.strip():
            phone = value.strip()
            if CustomUser.objects.filter(phone=phone).exists():
                raise serializers.ValidationError(
                    "This mobile number is already registered. Please log in."
                )
        return value


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)