from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import CheckoutRequest, CheckoutResponse, PaymentVerification
from ..services.stripe_service import StripeService
from ..services.license_service import LicenseService
from ..services.email_service import email_service
from ..models import User, Purchase
from datetime import datetime

router = APIRouter(prefix="/api", tags=["payments"])


@router.post("/create-checkout-session", response_model=CheckoutResponse)
async def create_checkout_session(
    request: CheckoutRequest, db: Session = Depends(get_db)
):
    """Create Stripe checkout session"""

    try:
        # Create or get user
        user = db.query(User).filter(User.email == request.email).first()
        if not user:
            user = User(email=request.email, name=request.name, is_active=True)
            db.add(user)
            db.commit()
            db.refresh(user)

        # Create Stripe session
        result = StripeService.create_checkout_session(
            email=request.email,
            name=request.name,
            template_id=request.template_id,
            price=request.price,
        )

        # Create purchase record
        purchase = Purchase(
            user_id=user.id,
            stripe_session_id=result["session_id"],
            amount=request.price / 100,  # Convert cents to dollars
            template_id=request.template_id,
            tier="pro" if request.price >= 2900 else "free",
            status="pending",
        )
        db.add(purchase)
        db.commit()

        print(f"✅ Checkout session created for {request.email}")

        return CheckoutResponse(url=result["url"], session_id=result["session_id"])

    except Exception as e:
        print(f"❌ Checkout error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/verify-payment/{session_id}", response_model=PaymentVerification)
async def verify_payment(session_id: str, db: Session = Depends(get_db)):
    """Verify payment and return license"""

    try:
        # Check if already processed
        purchase = (
            db.query(Purchase).filter(Purchase.stripe_session_id == session_id).first()
        )

        if not purchase:
            raise HTTPException(status_code=404, detail="Purchase not found")

        # If already completed, return existing license
        if purchase.status == "completed" and purchase.license_id:
            from ..models import License

            license = (
                db.query(License).filter(License.id == purchase.license_id).first()
            )
            user = db.query(User).filter(User.id == purchase.user_id).first()

            return PaymentVerification(
                success=True,
                license_key=license.license_key,
                email=user.email,
                name=user.name,
                tier=license.tier,
            )

        # Retrieve session from Stripe
        session = StripeService.retrieve_session(session_id)

        if session.payment_status != "paid":
            raise HTTPException(status_code=400, detail="Payment not completed")

        # Get user
        user = db.query(User).filter(User.id == purchase.user_id).first()

        # Create license
        license = LicenseService.create_license(
            db=db, user_id=user.id, template_id=purchase.template_id, tier=purchase.tier
        )

        # Update purchase
        purchase.status = "completed"
        purchase.license_id = license.id
        purchase.completed_at = datetime.now()
        purchase.stripe_payment_intent_id = session.payment_intent
        db.commit()

        # Send license email
        email_service.send_license_email(
            db=db, recipient=user.email, name=user.name, license_key=license.license_key
        )

        print(f"✅ Payment verified: {user.email} - {license.license_key}")

        return PaymentVerification(
            success=True,
            license_key=license.license_key,
            email=user.email,
            name=user.name,
            tier=license.tier,
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Verification error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
