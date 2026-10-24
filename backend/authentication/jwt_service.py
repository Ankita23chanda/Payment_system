from rest_framework_simplejwt.tokens import RefreshToken


def generate_tokens_for_user(user):
    """
    Generate access + refresh JWT tokens for a user.
    """

    refresh = RefreshToken.for_user(user)

    # Optional claims
    refresh["user_id"] = user.id
    refresh["customer_id"] = getattr(user, "customer_id", None)

    if hasattr(user, "role"):
        refresh["role"] = user.role

    access_token = refresh.access_token

    access_token["user_id"] = user.id
    access_token["customer_id"] = getattr(user, "customer_id", None)

    if hasattr(user, "role"):
        access_token["role"] = user.role

    return {
        "access": str(access_token),
        "refresh": str(refresh),
        "user": serialize_user(user),
    }


def serialize_user(user):
    """
    Return only the user information the frontend needs.
    """

    return {
        "id": user.id,
        "customer_id": getattr(user, "customer_id", None),
        "name": getattr(user, "name", ""),
        "email": getattr(user, "email", None),
        "phone": getattr(user, "phone", None),
        "location": getattr(user, "location", ""),
        "address": getattr(user, "address", ""),
        "role": getattr(user, "role", None),
        "is_email_verified": getattr(
            user,
            "is_email_verified",
            True,
        ),
        "is_phone_verified": getattr(
            user,
            "is_phone_verified",
            False,
        ),
    }