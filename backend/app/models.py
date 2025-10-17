from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    Text,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=True)  # Optional for OAuth users
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    licenses = relationship("License", back_populates="user")
    purchases = relationship("Purchase", back_populates="user")


class License(Base):
    __tablename__ = "licenses"

    id = Column(Integer, primary_key=True, index=True)
    license_key = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    template_id = Column(String, nullable=False)  # email_assistant, custom, etc.
    tier = Column(String, nullable=False)  # free, pro, custom
    is_active = Column(Boolean, default=True)
    activation_count = Column(Integer, default=0)  # Track how many times activated
    max_activations = Column(Integer, default=3)  # Allow 3 devices
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)  # For subscriptions

    # Relationships
    user = relationship("User", back_populates="licenses")


class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    stripe_session_id = Column(String, unique=True, index=True)
    stripe_payment_intent_id = Column(String, nullable=True)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="usd")
    template_id = Column(String, nullable=False)
    tier = Column(String, nullable=False)
    status = Column(String, default="pending")  # pending, completed, refunded
    license_id = Column(Integer, ForeignKey("licenses.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="purchases")


class Download(Base):
    __tablename__ = "downloads"

    id = Column(Integer, primary_key=True, index=True)
    license_key = Column(String, index=True, nullable=False)
    platform = Column(String, nullable=False)  # windows, macos, linux
    version = Column(String, nullable=False)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    downloaded_at = Column(DateTime(timezone=True), server_default=func.now())


class EmailLog(Base):
    __tablename__ = "email_logs"

    id = Column(Integer, primary_key=True, index=True)
    recipient = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    template = Column(String, nullable=False)  # welcome, license_key, etc.
    status = Column(String, default="pending")  # pending, sent, failed
    error_message = Column(Text, nullable=True)
    sent_at = Column(DateTime(timezone=True), server_default=func.now())
