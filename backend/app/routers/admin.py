from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import User, License, Purchase, Download
from typing import List
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/admin", tags=["admin"])

# TODO: Add authentication middleware for admin routes


@router.get("/stats")
async def get_admin_stats(db: Session = Depends(get_db)):
    """Get overall statistics"""

    total_users = db.query(func.count(User.id)).scalar()
    total_licenses = db.query(func.count(License.id)).scalar()
    active_licenses = (
        db.query(func.count(License.id)).filter(License.is_active == True).scalar()
    )
    total_revenue = (
        db.query(func.sum(Purchase.amount))
        .filter(Purchase.status == "completed")
        .scalar()
        or 0
    )

    # Sales last 7 days
    seven_days_ago = datetime.now() - timedelta(days=7)
    recent_sales = (
        db.query(func.count(Purchase.id))
        .filter(Purchase.created_at >= seven_days_ago, Purchase.status == "completed")
        .scalar()
    )

    # Downloads
    total_downloads = db.query(func.count(Download.id)).scalar()

    return {
        "total_users": total_users,
        "total_licenses": total_licenses,
        "active_licenses": active_licenses,
        "total_revenue": float(total_revenue),
        "recent_sales": recent_sales,
        "total_downloads": total_downloads,
        "conversion_rate": (total_licenses / total_users * 100)
        if total_users > 0
        else 0,
    }


@router.get("/recent-purchases")
async def get_recent_purchases(limit: int = 20, db: Session = Depends(get_db)):
    """Get recent purchases"""

    purchases = (
        db.query(Purchase).order_by(Purchase.created_at.desc()).limit(limit).all()
    )

    result = []
    for purchase in purchases:
        user = db.query(User).filter(User.id == purchase.user_id).first()
        result.append(
            {
                "id": purchase.id,
                "email": user.email,
                "name": user.name,
                "amount": purchase.amount,
                "tier": purchase.tier,
                "status": purchase.status,
                "created_at": purchase.created_at.isoformat(),
            }
        )

    return result


@router.get("/users")
async def get_users(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """Get all users"""

    users = db.query(User).offset(skip).limit(limit).all()

    result = []
    for user in users:
        licenses_count = (
            db.query(func.count(License.id)).filter(License.user_id == user.id).scalar()
        )

        result.append(
            {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "is_active": user.is_active,
                "licenses_count": licenses_count,
                "created_at": user.created_at.isoformat(),
            }
        )

    return result


@router.get("/licenses")
async def get_licenses(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """Get all licenses"""

    licenses = db.query(License).offset(skip).limit(limit).all()

    result = []
    for license in licenses:
        user = db.query(User).filter(User.id == license.user_id).first()

        result.append(
            {
                "id": license.id,
                "license_key": license.license_key,
                "user_email": user.email,
                "tier": license.tier,
                "is_active": license.is_active,
                "activation_count": license.activation_count,
                "created_at": license.created_at.isoformat(),
            }
        )

    return result


@router.post("/deactivate-license/{license_id}")
async def deactivate_license(license_id: int, db: Session = Depends(get_db)):
    """Deactivate a license"""

    license = db.query(License).filter(License.id == license_id).first()

    if not license:
        raise HTTPException(status_code=404, detail="License not found")

    license.is_active = False
    db.commit()

    return {"message": "License deactivated successfully"}
