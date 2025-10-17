import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import get_db, Base, engine
from sqlalchemy.orm import Session

client = TestClient(app)


def test_validate_license():
    """Test license validation"""
    response = client.post(
        "/api/validate-license", json={"license_key": "BETA-TEST1234-EMAIL"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["valid"] == True
    assert data["tier"] == "pro"


def test_invalid_license():
    """Test invalid license"""
    response = client.post(
        "/api/validate-license", json={"license_key": "INVALID-KEY-123"}
    )

    assert response.status_code == 400


def test_create_checkout_session():
    """Test checkout session creation"""
    response = client.post(
        "/api/create-checkout-session",
        json={
            "email": "test@example.com",
            "name": "Test User",
            "template_id": "email_assistant",
            "price": 2900,
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert "url" in data
    assert "session_id" in data
