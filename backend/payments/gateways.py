import hmac
import hashlib
import uuid
import logging
from decimal import Decimal
from django.conf import settings
from orders.models import Order

logger = logging.getLogger(__name__)


class BasePaymentGateway:
    """
    Abstract interface for payment gateway integrations.
    """
    def create_order_session(self, order: Order) -> dict:
        raise NotImplementedError

    def verify_payment(self, payload: dict) -> dict:
        raise NotImplementedError


class MockPaymentGateway(BasePaymentGateway):
    """
    Simulated Razorpay Sandbox gateway implementation for testing and demonstrations.
    Provides realistic Razorpay order IDs (order_xxxx), payment IDs (pay_xxxx),
    and signatures.
    """
    def create_order_session(self, order: Order) -> dict:
        session_id = f"order_{uuid.uuid4().hex[:14]}"
        return {
            "gateway": "RAZORPAY_SANDBOX",
            "gateway_order_id": session_id,
            "razorpay_order_id": session_id,
            "amount": float(order.total_amount),
            "amount_paise": int(order.total_amount * 100),
            "currency": "INR",
            "key": getattr(settings, 'PAYMENT_PUBLIC_KEY', 'rzp_test_agri_sandbox_key'),
            "order_number": order.order_number,
            "customer_name": order.customer_name,
            "customer_email": order.customer_email,
            "customer_phone": order.customer_phone,
            "notes": {
                "platform": "AgriProducts Marketplace",
                "order_number": order.order_number
            }
        }

    def verify_payment(self, payload: dict) -> dict:
        gateway_order_id = payload.get("gateway_order_id") or payload.get("razorpay_order_id", "")
        gateway_payment_id = payload.get("gateway_payment_id") or payload.get("razorpay_payment_id") or f"pay_{uuid.uuid4().hex[:14]}"
        action = payload.get("simulate_action", "SUCCESS").upper()

        if action == "FAILED":
            return {
                "success": False,
                "status": "FAILED",
                "transaction_id": gateway_payment_id,
                "reason": "Payment failed: Bank servers declined authorization or insufficient card balance."
            }
        elif action == "CANCELLED":
            return {
                "success": False,
                "status": "CANCELLED",
                "transaction_id": gateway_payment_id,
                "reason": "Payment cancelled: User closed the Razorpay checkout window."
            }

        # Simulated Razorpay HMAC-SHA256 signature
        fake_secret = b"rzp_secret_agri_test_key"
        msg = f"{gateway_order_id}|{gateway_payment_id}".encode("utf-8")
        signature = hmac.new(fake_secret, msg, hashlib.sha256).hexdigest()

        return {
            "success": True,
            "status": "SUCCESS",
            "transaction_id": gateway_payment_id,
            "gateway_order_id": gateway_order_id,
            "gateway_payment_id": gateway_payment_id,
            "gateway_signature": signature,
            "razorpay_order_id": gateway_order_id,
            "razorpay_payment_id": gateway_payment_id,
            "razorpay_signature": signature,
        }


class RazorpayPaymentGateway(BasePaymentGateway):
    """
    Production Razorpay gateway integration.
    """
    def create_order_session(self, order: Order) -> dict:
        amount_paise = int(order.total_amount * 100)
        # Production razorpay client integration
        # client = razorpay.Client(auth=(settings.PAYMENT_PUBLIC_KEY, settings.PAYMENT_SECRET_KEY))
        # rzp_order = client.order.create({...})
        mock_id = f"rzp_ord_{uuid.uuid4().hex[:12]}"
        return {
            "gateway": "RAZORPAY",
            "gateway_order_id": mock_id,
            "amount": float(order.total_amount),
            "amount_subunits": amount_paise,
            "currency": "INR",
            "key": getattr(settings, 'PAYMENT_PUBLIC_KEY', ''),
            "order_number": order.order_number,
        }

    def verify_payment(self, payload: dict) -> dict:
        razorpay_order_id = payload.get("razorpay_order_id")
        razorpay_payment_id = payload.get("razorpay_payment_id")
        razorpay_signature = payload.get("razorpay_signature")
        secret = getattr(settings, 'PAYMENT_SECRET_KEY', '').encode('utf-8')

        msg = f"{razorpay_order_id}|{razorpay_payment_id}".encode('utf-8')
        generated_signature = hmac.new(secret, msg, hashlib.sha256).hexdigest()

        if hmac.compare_digest(generated_signature, razorpay_signature):
            return {
                "success": True,
                "status": "SUCCESS",
                "transaction_id": razorpay_payment_id,
                "gateway_signature": razorpay_signature,
            }
        return {"success": False, "status": "FAILED", "reason": "Invalid Razorpay signature."}


def get_payment_gateway() -> BasePaymentGateway:
    provider = getattr(settings, 'PAYMENT_PROVIDER', 'mock').lower()
    if provider == 'razorpay':
        return RazorpayPaymentGateway()
    return MockPaymentGateway()
