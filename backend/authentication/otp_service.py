import hmac
import hashlib
import secrets
import logging
from datetime import timedelta

from django.conf import settings
from django.utils import timezone
from django.core.mail import send_mail
from django.core.exceptions import ValidationError

from .models import OTPRecord

logger = logging.getLogger(__name__)

OTP_EXPIRY_MINUTES = getattr(settings, "OTP_EXPIRY_MINUTES", 5)
OTP_MAX_ATTEMPTS = getattr(settings, "OTP_MAX_ATTEMPTS", 3)
OTP_RESEND_COOLDOWN_SECONDS = getattr(
    settings,
    "OTP_RESEND_COOLDOWN_SECONDS",
    60,
)
OTP_HOURLY_RATE_LIMIT = getattr(
    settings,
    "OTP_HOURLY_RATE_LIMIT",
    5,
)


class BaseOTPProvider:
    def send(self, identifier: str, identifier_type: str, otp: str) -> bool:
        raise NotImplementedError


class MockOTPProvider(BaseOTPProvider):
    """
    ONLY for local testing.
    Never use this in production.
    """

    def send(self, identifier: str, identifier_type: str, otp: str) -> bool:
        logger.warning(
            "[MOCK OTP] OTP generated for %s: %s",
            identifier,
            otp,
        )
        return True


class EmailOTPProvider(BaseOTPProvider):
    def send(self, identifier: str, identifier_type: str, otp: str) -> bool:
        subject = "Your AgriProducts Verification Code"

        message = (
            f"Your AgriProducts verification code is: {otp}\n\n"
            f"This code expires in {OTP_EXPIRY_MINUTES} minutes.\n"
            "Do not share this code with anyone."
        )

        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=getattr(
                    settings,
                    "DEFAULT_FROM_EMAIL",
                    "no-reply@agriproducts.com",
                ),
                recipient_list=[identifier],
                fail_silently=False,
            )
            return True

        except Exception as exc:
            logger.exception(
                "Failed to send email OTP to %s: %s",
                identifier,
                exc,
            )
            return False


class SMSOTPProvider(BaseOTPProvider):
    """
    Sends the already-generated OTP through Twilio SMS.
    """

    def send(self, identifier: str, identifier_type: str, otp: str) -> bool:
        account_sid = getattr(settings, "TWILIO_ACCOUNT_SID", "")
        auth_token = getattr(settings, "TWILIO_AUTH_TOKEN", "")
        from_number = getattr(settings, "TWILIO_FROM_NUMBER", "")

        is_placeholder = (
            not account_sid
            or not auth_token
            or not from_number
            or "YOUR_" in account_sid
            or "YOUR_" in auth_token
        )

        if is_placeholder:
            if getattr(settings, "DEBUG", True):
                logger.warning(
                    "[SMS OTP DEV] Twilio credentials not configured in .env. "
                    "OTP generated for %s: %s",
                    identifier,
                    otp,
                )
                return True

            logger.error("Twilio SMS configuration is incomplete.")
            return False

        message_body = (
            f"Your AgriProducts OTP is {otp}. "
            f"It expires in {OTP_EXPIRY_MINUTES} minutes. "
            "Do not share this OTP."
        )

        try:
            from twilio.rest import Client

            client = Client(account_sid, auth_token)

            message = client.messages.create(
                body=message_body,
                from_=from_number,
                to=identifier,
            )

            logger.info(
                "SMS OTP sent successfully. Twilio SID: %s",
                message.sid,
            )
            return True

        except Exception as exc:
            logger.exception(
                "Failed to send SMS OTP to %s: %s",
                identifier,
                exc,
            )
            if getattr(settings, "DEBUG", True):
                logger.warning(
                    "[SMS OTP FALLBACK] Twilio error encountered. "
                    "Falling back to console for %s. OTP: %s",
                    identifier,
                    otp,
                )
                return True
            return False


def get_otp_provider(identifier_type: str) -> BaseOTPProvider:
    provider = getattr(
        settings,
        "OTP_PROVIDER",
        "mock",
    ).lower()

    if provider == "mock":
        return MockOTPProvider()

    if identifier_type == "email":
        return EmailOTPProvider()

    if identifier_type == "phone":
        return SMSOTPProvider()

    raise ValidationError(
        f"Unsupported OTP identifier type: {identifier_type}"
    )


class OTPService:

    @staticmethod
    def _hash_otp(otp: str, salt: str) -> str:
        return hashlib.sha256(
            (salt + otp).encode("utf-8")
        ).hexdigest()

    @classmethod
    def send_otp(
        cls,
        identifier: str,
        identifier_type: str,
    ) -> dict:

        if identifier_type == "email":
            identifier = identifier.strip().lower()
        else:
            identifier = identifier.strip()

        now = timezone.now()

        # -----------------------------------------
        # Hourly rate limit
        # -----------------------------------------
        one_hour_ago = now - timedelta(hours=1)

        recent_requests_count = OTPRecord.objects.filter(
            identifier=identifier,
            created_at__gte=one_hour_ago,
        ).count()

        if recent_requests_count >= OTP_HOURLY_RATE_LIMIT:
            raise ValidationError(
                "OTP request limit exceeded. "
                "Please try again later."
            )

        # -----------------------------------------
        # Resend cooldown
        # -----------------------------------------
        last_otp = (
            OTPRecord.objects
            .filter(identifier=identifier)
            .order_by("-created_at")
            .first()
        )

        if last_otp:
            time_since_last = (
                now - last_otp.last_sent_at
            ).total_seconds()

            if time_since_last < OTP_RESEND_COOLDOWN_SECONDS:
                remaining = int(
                    OTP_RESEND_COOLDOWN_SECONDS
                    - time_since_last
                )

                raise ValidationError(
                    f"Please wait {remaining} seconds "
                    "before requesting another OTP."
                )

        # -----------------------------------------
        # Invalidate previous OTPs
        # -----------------------------------------
        OTPRecord.objects.filter(
            identifier=identifier,
            is_used=False,
        ).update(is_used=True)

        # -----------------------------------------
        # Generate secure random 6-digit OTP
        # -----------------------------------------
        otp = f"{secrets.randbelow(1_000_000):06d}"

        salt = secrets.token_hex(16)

        otp_hash = cls._hash_otp(
            otp,
            salt,
        )

        expires_at = now + timedelta(
            minutes=OTP_EXPIRY_MINUTES
        )

        # -----------------------------------------
        # Store OTP
        # -----------------------------------------
        OTPRecord.objects.create(
            identifier=identifier,
            identifier_type=identifier_type,
            otp_hash=otp_hash,
            salt=salt,
            attempts=0,
            is_used=False,
            expires_at=expires_at,
            last_sent_at=now,
        )

        # -----------------------------------------
        # Send OTP
        # -----------------------------------------
        provider = get_otp_provider(
            identifier_type
        )

        sent = provider.send(
            identifier,
            identifier_type,
            otp,
        )

        if not sent:
            raise ValidationError(
                "Unable to send OTP. "
                "Please try again later."
            )

        # -----------------------------------------
        # IMPORTANT:
        # Never return the OTP to frontend.
        # -----------------------------------------
        return {
            "message": (
                f"OTP sent successfully to your "
                f"{identifier_type}."
            ),
            "cooldown_seconds": (
                OTP_RESEND_COOLDOWN_SECONDS
            ),
            "expires_in_minutes": (
                OTP_EXPIRY_MINUTES
            ),
        }

    @classmethod
    def verify_otp(
        cls,
        identifier: str,
        otp: str,
    ) -> bool:

        if "@" in identifier:
            identifier = identifier.strip().lower()
        else:
            identifier = identifier.strip()

        otp = str(otp).strip()

        now = timezone.now()

        record = (
            OTPRecord.objects
            .filter(
                identifier=identifier,
                is_used=False,
                expires_at__gte=now,
            )
            .order_by("-created_at")
            .first()
        )

        if not record:
            raise ValidationError(
                "No active OTP found or the OTP has expired."
            )

        if record.attempts >= OTP_MAX_ATTEMPTS:
            record.is_used = True
            record.save(update_fields=["is_used"])

            raise ValidationError(
                "Maximum OTP attempts exceeded."
            )

        record.attempts += 1
        record.save(
            update_fields=["attempts"]
        )

        computed_hash = cls._hash_otp(
            otp,
            record.salt,
        )

        if not hmac.compare_digest(
            record.otp_hash,
            computed_hash,
        ):
            remaining = (
                OTP_MAX_ATTEMPTS
                - record.attempts
            )

            if remaining <= 0:
                record.is_used = True
                record.save(
                    update_fields=["is_used"]
                )

                raise ValidationError(
                    "Invalid OTP. Maximum attempts reached."
                )

            raise ValidationError(
                f"Invalid OTP. "
                f"{remaining} attempt(s) remaining."
            )

        # OTP is correct
        record.is_used = True
        record.save(
            update_fields=["is_used"]
        )

        return True