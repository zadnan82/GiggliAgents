from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import CheckoutRequest
from ..models import User, Purchase, License
from ..services.license_service import LicenseService
import uuid
from datetime import datetime

router = APIRouter(prefix="/api", tags=["mock-payments"])


@router.post("/mock-checkout")
async def mock_checkout(request: CheckoutRequest, db: Session = Depends(get_db)):
    """Mock payment endpoint for testing without Stripe"""

    try:
        print(f"🎭 Mock checkout for: {request.email}")

        # Create or get user
        user = db.query(User).filter(User.email == request.email).first()
        if not user:
            user = User(email=request.email, name=request.name, is_active=True)
            db.add(user)
            db.commit()
            db.refresh(user)

        # Create mock session ID
        mock_session_id = f"mock_session_{uuid.uuid4().hex[:16]}"

        # Create purchase record
        purchase = Purchase(
            user_id=user.id,
            stripe_session_id=mock_session_id,
            amount=request.price / 100,
            template_id=request.template_id,
            tier="pro" if request.price >= 2900 else "free",
            status="complete",  # Mock payment is instant
        )
        db.add(purchase)
        db.commit()
        db.refresh(purchase)

        # Generate license key
        # Generate license key
        license_key = LicenseService.generate_license_key(request.template_id)

        license = License(
            user_id=user.id,
            license_key=license_key,
            template_id=request.template_id,
            tier=purchase.tier,
            is_active=True,
        )
        db.add(license)
        db.commit()
        db.refresh(license)

        # Link purchase to license
        purchase.license_id = license.id
        db.commit()
        print(f"✅ Mock payment complete: {license_key}")

        # Return mock checkout URL (redirect to download page)
        return {
            "url": f"http://localhost:5173/download/{mock_session_id}",
            "session_id": mock_session_id,
        }

    except Exception as e:
        print(f"❌ Mock checkout error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/mock-verify/{session_id}")
async def mock_verify_payment(session_id: str, db: Session = Depends(get_db)):
    """Mock payment verification"""

    try:
        # Find purchase by session ID
        purchase = (
            db.query(Purchase).filter(Purchase.stripe_session_id == session_id).first()
        )

        if not purchase:
            raise HTTPException(status_code=404, detail="Purchase not found")

        # Get license using the license_id from purchase (not purchase_id from license)
        license = (
            db.query(License)
            .filter(
                License.id
                == purchase.license_id  # ✅ Use License.id instead of License.purchase_id
            )
            .first()
        )

        if not license:
            raise HTTPException(status_code=404, detail="License not found")

        # Get user
        user = db.query(User).filter(User.id == purchase.user_id).first()

        print(f"✅ Mock verify complete: {license.license_key}")

        return {
            "success": True,
            "license_key": license.license_key,
            "email": user.email,
            "name": user.name,
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Mock verify error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
