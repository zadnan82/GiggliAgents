import secrets
import string
from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime
from ..models import License, User
from ..schemas import LicenseCreate


class LicenseService:
    @staticmethod
    def generate_license_key(template_id: str) -> str:
        """Generate a unique license key"""
        # Format: BETA-XXXX-XXXX-TEMPLATE
        part1 = "".join(
            secrets.choice(string.ascii_uppercase + string.digits) for _ in range(4)
        )
        part2 = "".join(
            secrets.choice(string.ascii_uppercase + string.digits) for _ in range(4)
        )
        template_code = template_id.upper()[:6]

        return f"BETA-{part1}-{part2}-{template_code}"

    @staticmethod
    def create_license(
        db: Session, user_id: int, template_id: str, tier: str
    ) -> License:
        """Create a new license"""
        license_key = LicenseService.generate_license_key(template_id)

        # Ensure unique key
        while db.query(License).filter(License.license_key == license_key).first():
            license_key = LicenseService.generate_license_key(template_id)

        license = License(
            license_key=license_key,
            user_id=user_id,
            template_id=template_id,
            tier=tier,
            is_active=True,
            activation_count=0,
            max_activations=3,
        )

        db.add(license)
        db.commit()
        db.refresh(license)

        return license

    @staticmethod
    def validate_license(
        db: Session, license_key: str
    ) -> tuple[bool, Optional[License]]:
        """Validate a license key"""
        license = (
            db.query(License)
            .filter(License.license_key == license_key, License.is_active == True)
            .first()
        )

        if not license:
            return False, None

        # Check if expired (for subscriptions)
        if license.expires_at and license.expires_at < datetime.now():
            return False, None

        # Check activation limit
        if license.activation_count >= license.max_activations:
            return False, None

        return True, license

    @staticmethod
    def increment_activation(db: Session, license: License):
        """Increment activation count"""
        license.activation_count += 1
        db.commit()
