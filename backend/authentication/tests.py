from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from products.models import Product, Category
from authentication.models import OTPRecord


class AgriPlatformFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name="Pesticides", slug="pesticides")
        self.product = Product.objects.create(
            category=self.category,
            name="Organic Neem Shield",
            slug="organic-neem-shield",
            brand="NatureAgri",
            price=500.00,
            discount_price=450.00,
            stock=20,
            description="Pure neem extract",
        )

    def test_complete_e2e_customer_flow(self):
        # 1. Send OTP
        res = self.client.post('/api/auth/send-otp/', {
            "identifier": "farmer.ramesh@agri.com",
            "identifier_type": "email"
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        dev_otp = res.data.get('dev_otp')
        self.assertIsNotNone(dev_otp)

        # 2. Verify OTP
        res = self.client.post('/api/auth/verify-otp/', {
            "identifier": "farmer.ramesh@agri.com",
            "otp": dev_otp
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("access", res.data)
        self.assertIn("user", res.data)
        self.assertEqual(res.data["user"]["email"], "farmer.ramesh@agri.com")

        # 3. Browse Products
        res = self.client.get('/api/products/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data), 1)

        # 4. Add to Cart
        res = self.client.post('/api/cart/add/', {
            "product_id": self.product.id,
            "quantity": 2
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['cart']['total_items_count'], 2)
        session_key = res.data.get('session_key')

        # 5. Checkout
        checkout_payload = {
            "customer_name": "Ramesh Patel",
            "customer_email": "farmer.ramesh@agri.com",
            "customer_phone": "+919876543210",
            "shipping_address": "Plot 42, Farm Road, Sector 5",
            "city": "Nashik",
            "state": "Maharashtra",
            "country": "India",
            "postal_code": "422001",
        }
        res = self.client.post(
            '/api/orders/checkout/',
            checkout_payload,
            HTTP_X_SESSION_KEY=session_key
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        order_number = res.data['order']['order_number']
        self.assertIsNotNone(order_number)

        # 6. Payment Session
        res = self.client.post('/api/payments/create-session/', {
            "order_number": order_number
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        gateway_order_id = res.data['gateway_order_id']

        # 7. Payment Verification
        res = self.client.post('/api/payments/verify/', {
            "order_number": order_number,
            "gateway_order_id": gateway_order_id,
            "simulate_action": "SUCCESS"
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['status'], 'SUCCESS')
        self.assertIsNotNone(res.data['transaction_id'])

        # 8. Check stock reduction
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 18)
