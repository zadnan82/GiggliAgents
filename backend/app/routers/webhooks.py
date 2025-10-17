from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.stripe_service import StripeService
from ..services.license_service import LicenseService
from ..services.email_service import email_service
from ..models import Purchase, User
from datetime import datetime

router = APIRouter(prefix="/api", tags=["webhooks"])


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhook events"""

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = StripeService.verify_webhook_signature(payload, sig_header)
    except Exception as e:
        print(f"❌ Webhook signature verification failed: {e}")
        raise HTTPException(status_code=400, detail=str(e))

    # Handle different event types
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

        # Find purchase
        purchase = (
            db.query(Purchase)
            .filter(Purchase.stripe_session_id == session["id"])
            .first()
        )

        if purchase and purchase.status == "pending":
            # Get user
            user = db.query(User).filter(User.id == purchase.user_id).first()

            # Create license
            license = LicenseService.create_license(
                db=db,
                user_id=user.id,
                template_id=purchase.template_id,
                tier=purchase.tier,
            )

            # Update purchase
            purchase.status = "completed"
            purchase.license_id = license.id
            purchase.completed_at = datetime.now()
            purchase.stripe_payment_intent_id = session["payment_intent"]
            db.commit()

            # Send license email
            email_service.send_license_email(
                db=db,
                recipient=user.email,
                name=user.name,
                license_key=license.license_key,
            )

            print(
                f"🎉 Webhook: Payment completed - {user.email} - {license.license_key}"
            )

    elif event["type"] == "charge.refunded":
        charge = event["data"]["object"]
        payment_intent_id = charge["payment_intent"]

        # Find purchase
        purchase = (
            db.query(Purchase)
            .filter(Purchase.stripe_payment_intent_id == payment_intent_id)
            .first()
        )

        if purchase:
            purchase.status = "refunded"

            # Deactivate license if exists
            if purchase.license_id:
                from ..models import License

                license = (
                    db.query(License).filter(License.id == purchase.license_id).first()
                )
                if license:
                    license.is_active = False

            db.commit()
            print(f"💰 Webhook: Refund processed for purchase {purchase.id}")

    elif event["type"] == "payment_intent.payment_failed":
        payment_intent = event["data"]["object"]
        print(f"❌ Webhook: Payment failed - {payment_intent['id']}")

    return {"status": "success"}
