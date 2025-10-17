"""
Setup script for GiggliAgents Backend
Run this to initialize the database and create test data
"""

import os
import sys
from pathlib import Path

# Add app to path
sys.path.insert(0, str(Path(__file__).parent))

from app.database import SessionLocal, init_db
from app.models import User, License
from app.services.license_service import LicenseService
from app.config import settings
from sqlalchemy import text
import secrets


def create_admin_user(db):
    """Create admin user"""
    admin = db.query(User).filter(User.email == settings.admin_email).first()

    if not admin:
        admin = User(
            email=settings.admin_email, name="Admin", is_active=True, is_admin=True
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        print(f"✅ Admin user created: {settings.admin_email}")
    else:
        print(f"ℹ️  Admin user already exists: {settings.admin_email}")

    return admin


def create_test_licenses(db):
    """Create test licenses for development"""

    test_licenses = [
        {
            "key": "BETA-TEST1234-EMAIL",
            "email": "developer@test.com",
            "name": "Developer",
            "tier": "pro",
            "template": "email_assistant",
        },
        {
            "key": "BETA-DEVFREE-EMAIL",
            "email": "free@test.com",
            "name": "Free User",
            "tier": "free",
            "template": "email_assistant",
        },
        {
            "key": "BETA-DEVCUST-CUSTOM",
            "email": "custom@test.com",
            "name": "Custom User",
            "tier": "custom",
            "template": "custom",
        },
    ]

    for test_lic in test_licenses:
        # Check if user exists
        user = db.query(User).filter(User.email == test_lic["email"]).first()
        if not user:
            user = User(email=test_lic["email"], name=test_lic["name"], is_active=True)
            db.add(user)
            db.commit()
            db.refresh(user)

        # Check if license exists
        existing = (
            db.query(License).filter(License.license_key == test_lic["key"]).first()
        )
        if not existing:
            license = License(
                license_key=test_lic["key"],
                user_id=user.id,
                template_id=test_lic["template"],
                tier=test_lic["tier"],
                is_active=True,
                activation_count=0,
                max_activations=3,
            )
            db.add(license)
            db.commit()
            print(f"✅ Test license created: {test_lic['key']} ({test_lic['tier']})")
        else:
            print(f"ℹ️  Test license already exists: {test_lic['key']}")


def setup_database():
    """Setup database and initial data"""
    print("=" * 60)
    print("🔧 GiggliAgents Backend Setup")
    print("=" * 60)

    # Initialize database
    print("\n📊 Initializing database...")
    init_db()

    # Create session
    db = SessionLocal()

    try:
        # Create admin user
        print("\n👤 Creating admin user...")
        create_admin_user(db)

        # Create test licenses
        if settings.debug:
            print("\n🔑 Creating test licenses...")
            create_test_licenses(db)

        print("\n" + "=" * 60)
        print("✅ Setup completed successfully!")
        print("=" * 60)

        if settings.debug:
            print("\n🔑 Test Licenses Available:")
            print("   BETA-TEST1234-EMAIL (pro tier)")
            print("   BETA-DEVFREE-EMAIL (free tier)")
            print("   BETA-DEVCUST-CUSTOM (custom tier)")
            print("\n📝 Admin Email:", settings.admin_email)
            print("🌐 Frontend URL:", settings.frontend_url)
            print("📚 API Docs: http://localhost:8000/docs")

        print("=" * 60)

    except Exception as e:
        print(f"\n❌ Setup failed: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    setup_database()
