from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import LicenseValidation, LicenseResponse
from ..services.license_service import LicenseService
from ..models import User

router = APIRouter(prefix="/api", tags=["licenses"])


@router.post("/validate-license", response_model=LicenseResponse)
async def validate_license(request: LicenseValidation, db: Session = Depends(get_db)):
    """Validate a license key"""

    try:
        valid, license = LicenseService.validate_license(db, request.license_key)

        if not valid or not license:
            raise HTTPException(status_code=400, detail="Invalid license key")

        # Get user info
        user = db.query(User).filter(User.id == license.user_id).first()

        # Increment activation count (optional - track device activations)
        # LicenseService.increment_activation(db, license)

        print(f"✅ License validated: {request.license_key} - {user.email}")

        return LicenseResponse(
            valid=True,
            email=user.email,
            template_id=license.template_id,
            tier=license.tier,
            created_at=license.created_at.isoformat(),
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Validation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/license-info/{license_key}")
async def get_license_info(license_key: str, db: Session = Depends(get_db)):
    """Get detailed license information"""

    try:
        valid, license = LicenseService.validate_license(db, license_key)

        if not valid or not license:
            raise HTTPException(status_code=404, detail="License not found")

        user = db.query(User).filter(User.id == license.user_id).first()

        return {
            "license_key": license.license_key,
            "email": user.email,
            "name": user.name,
            "tier": license.tier,
            "template_id": license.template_id,
            "is_active": license.is_active,
            "activation_count": license.activation_count,
            "max_activations": license.max_activations,
            "created_at": license.created_at.isoformat(),
            "expires_at": license.expires_at.isoformat()
            if license.expires_at
            else None,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
