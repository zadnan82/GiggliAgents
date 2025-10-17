import stripe
from ..config import settings
from sqlalchemy.orm import Session
from ..models import Purchase, User
from datetime import datetime

stripe.api_key = settings.stripe_secret_key


class StripeService:
    @staticmethod
    def create_checkout_session(
        email: str, name: str, template_id: str, price: int
    ) -> dict:
        """Create Stripe checkout session"""

        try:
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[
                    {
                        "price_data": {
                            "currency": "usd",
                            "product_data": {
                                "name": "GiggliAgents Email Assistant Pro",
                                "description": "AI-Powered Email Automation - Lifetime License",
                                "images": [
                                    f"{settings.frontend_url}/images/product.png"
                                ],
                            },
                            "unit_amount": price,
                        },
                        "quantity": 1,
                    }
                ],
                mode="payment",
                success_url=f"{settings.frontend_url}/download/{{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{settings.frontend_url}/checkout/{template_id}?canceled=true",
                customer_email=email,
                metadata={"customer_name": name, "template_id": template_id},
                allow_promotion_codes=True,  # Enable promo codes
            )

            return {"url": session.url, "session_id": session.id}

        except stripe.error.StripeError as e:
            raise Exception(f"Stripe error: {str(e)}")

    @staticmethod
    def retrieve_session(session_id: str) -> dict:
        """Retrieve Stripe session"""
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            return session
        except stripe.error.StripeError as e:
            raise Exception(f"Failed to retrieve session: {str(e)}")

    @staticmethod
    def create_refund(payment_intent_id: str, amount: int = None) -> dict:
        """Create a refund"""
        try:
            refund = stripe.Refund.create(
                payment_intent=payment_intent_id,
                amount=amount,  # None = full refund
            )
            return refund
        except stripe.error.StripeError as e:
            raise Exception(f"Refund failed: {str(e)}")

    @staticmethod
    def verify_webhook_signature(payload: bytes, sig_header: str) -> dict:
        """Verify Stripe webhook signature"""
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.stripe_webhook_secret
            )
            return event
        except ValueError:
            raise Exception("Invalid payload")
        except stripe.error.SignatureVerificationError:
            raise Exception("Invalid signature")
