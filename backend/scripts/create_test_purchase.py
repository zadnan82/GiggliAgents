"""
Create a test purchase for development
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import SessionLocal
from app.models import User, Purchase, License
from app.services.license_service import LicenseService
from datetime import datetime


def create_test_purchase():
    db = SessionLocal()

    try:
        # Create test user
        email = "testpurchase@example.com"
        user = db.query(User).filter(User.email == email).first()

        if not user:
            user = User(email=email, name="Test Purchase User", is_active=True)
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"✅ Created test user: {email}")

        # Create test purchase
        purchase = Purchase(
            user_id=user.id,
            stripe_session_id=f"test_session_{datetime.now().timestamp()}",
            amount=29.00,
            currency="usd",
            template_id="email_assistant",
            tier="pro",
            status="completed",
            completed_at=datetime.now(),
        )
        db.add(purchase)
        db.commit()
        db.refresh(purchase)

        # Create license
        license = LicenseService.create_license(
            db=db, user_id=user.id, template_id="email_assistant", tier="pro"
        )

        # Link license to purchase
        purchase.license_id = license.id
        db.commit()

        print(f"✅ Test purchase created!")
        print(f"   Session ID: {purchase.stripe_session_id}")
        print(f"   License Key: {license.license_key}")
        print(f"   Email: {email}")

    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    create_test_purchase()
