from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: Optional[str] = None


class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True


# License Schemas
class LicenseBase(BaseModel):
    license_key: str
    template_id: str
    tier: str


class LicenseCreate(LicenseBase):
    user_id: int


class License(LicenseBase):
    id: int
    is_active: bool
    activation_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class LicenseValidation(BaseModel):
    license_key: str


class LicenseResponse(BaseModel):
    valid: bool
    email: str
    template_id: str
    tier: str
    created_at: str


# Payment Schemas
class CheckoutRequest(BaseModel):
    email: EmailStr
    name: str
    template_id: str
    price: int  # in cents


class CheckoutResponse(BaseModel):
    url: str
    session_id: str


class PaymentVerification(BaseModel):
    success: bool
    license_key: str
    email: str
    name: str
    tier: str


# Download Schemas
class DownloadRequest(BaseModel):
    license_key: str
    platform: str  # windows, macos, linux


class DownloadResponse(BaseModel):
    download_url: str
    version: str
    size_mb: float
    checksum: str
