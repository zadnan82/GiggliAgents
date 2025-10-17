# 🚀 Quick Start Guide

## Prerequisites

- Python 3.11+
- PostgreSQL 15+ (or use SQLite for dev)

## 1. Install Dependencies

```bash
pip install -r requirements.txt
```

## 2. Configure Environment

```bash
# Copy example and edit
cp .env.example .env
nano .env
```

**Minimum required:**

- `STRIPE_SECRET_KEY` - Get from https://dashboard.stripe.com
- `DATABASE_URL` - PostgreSQL or `sqlite:///./giggliagents.db`
- `SECRET_KEY` - Run `python scripts/generate_secret.py`

## 3. Initialize Database

```bash
python setup.py
```

## 4. Start Server

```bash
# Simple
python -m uvicorn app.main:app --reload

# Or use script
bash scripts/start_dev.sh

# Or use Make
make dev
```

## 5. Test License

Go to http://localhost:8000/docs and try:

**POST** `/api/validate-license`

```json
{
  "license_key": "BETA-TEST1234-EMAIL"
}
```

## 6. Test Payment (Stripe)

**POST** `/api/create-checkout-session`

```json
{
  "email": "test@example.com",
  "name": "Test User",
  "template_id": "email_assistant",
  "price": 2900
}
```

Use Stripe test card: `4242 4242 4242 4242`

## Done! 🎉

Your backend is running at http://localhost:8000

API Docs: http://localhost:8000/docs
