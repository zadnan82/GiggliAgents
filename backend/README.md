# GiggliAgents Backend

Complete production-ready backend for GiggliAgents licensing, payments, and distribution.

## 🚀 Features

- ✅ Stripe payment processing
- ✅ License key generation & validation
- ✅ User management & authentication
- ✅ Email notifications (SendGrid)
- ✅ File storage (Local or AWS S3)
- ✅ Admin dashboard API
- ✅ PostgreSQL database
- ✅ Docker support
- ✅ Comprehensive API documentation

## 📋 Prerequisites

- Python 3.11+
- PostgreSQL 15+ (or SQLite for development)
- Stripe account
- SendGrid account (optional, for emails)
- AWS account (optional, for S3 storage)

## 🔧 Quick Start

### 1. Clone & Install

```bash
# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Generate secret keys
python scripts/generate_secret.py

# Edit .env with your keys
nano .env
```

**Required variables:**

- `SECRET_KEY` - App secret key
- `JWT_SECRET_KEY` - JWT signing key
- `DATABASE_URL` - PostgreSQL connection string
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `SENDGRID_API_KEY` - SendGrid API key
- `FRONTEND_URL` - Your frontend URL

### 3. Setup Database

```bash
# Run setup script
python setup.py
```

This will:

- Create database tables
- Create admin user
- Create test licenses (in debug mode)

### 4. Start Server

```bash
# Development
uvicorn app.main:app --reload --port 8000

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 5. Access API Documentation

Open http://localhost:8000/docs for interactive API documentation (Swagger UI)

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

Services:

- **API**: http://localhost:8000
- **Database**: localhost:5432
- **Nginx** (optional): http://localhost

### Individual Docker Build

```bash
# Build image
docker build -t giggliagents-backend .

# Run container
docker run -d \
  -p 8000:8000 \
  --env-file .env \
  -v $(pwd)/downloads:/app/downloads \
  giggliagents-backend
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration
│   ├── database.py          # Database connection
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── routers/             # API endpoints
│   │   ├── payments.py      # Stripe checkout
│   │   ├── licenses.py      # License validation
│   │   ├── downloads.py     # App downloads
│   │   ├── webhooks.py      # Stripe webhooks
│   │   └── admin.py         # Admin endpoints
│   ├── services/            # Business logic
│   │   ├── stripe_service.py
│   │   ├── license_service.py
│   │   ├── email_service.py
│   │   └── storage_service.py
│   └── utils/               # Utilities
├── downloads/               # App packages
│   ├── windows/
│   ├── macos/
│   └── linux/
├── scripts/                 # Helper scripts
├── tests/                   # Unit tests
├── .env                     # Environment variables
├── requirements.txt         # Dependencies
├── Dockerfile              # Docker image
└── docker-compose.yml      # Docker services
```

## 🔑 API Endpoints

### Public Endpoints

**Create Checkout Session**

```http
POST /api/create-checkout-session
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "template_id": "email_assistant",
  "price": 2900
}
```

**Validate License**

```http
POST /api/validate-license
Content-Type: application/json

{
  "license_key": "BETA-XXXX-XXXX-EMAIL"
}
```

**Get Download URL**

```http
POST /api/downloads/get-url
Content-Type: application/json

{
  "license_key": "BETA-XXXX-XXXX-EMAIL",
  "platform": "windows"
}
```

**Verify Payment**

```http
GET /api/verify-payment/{session_id}
```

### Admin Endpoints

**Get Statistics**

```http
GET /api/admin/stats
```

**Recent Purchases**

```http
GET /api/admin/recent-purchases?limit=20
```

**All Users**

```http
GET /api/admin/users?skip=0&limit=50
```

**All Licenses**

```http
GET /api/admin/licenses?skip=0&limit=50
```

## 🧪 Testing

### Test Licenses (Development Mode)

```
BETA-TEST1234-EMAIL  (pro tier)
BETA-DEVFREE-EMAIL   (free tier)
BETA-DEVCUST-CUSTOM  (custom tier)
```

### Create Test Purchase

```bash
python scripts/create_test_purchase.py
```

### Run Tests

```bash
pytest tests/ -v
```

## 📦 Upload App Packages

### Local Storage

```bash
# Upload Windows app
python scripts/upload_app.py path/to/GiggliAgents-1.0.0-windows.exe windows

# Upload macOS app
python scripts/upload_app.py path/to/GiggliAgents-1.0.0-macos.dmg macos

# Upload Linux app
python scripts/upload_app.py path/to/GiggliAgents-1.0.0-linux.AppImage linux
```

### AWS S3 Storage

Set `USE_S3=True` in `.env` and configure AWS credentials:

```bash
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=giggliagents-downloads
AWS_REGION=us-east-1
```

## 🔐 Security Best Practices

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use strong secret keys** - Generate with `scripts/generate_secret.py`
3. **Enable HTTPS in production** - Use Nginx with SSL certificates
4. **Rotate keys regularly** - Update Stripe and SendGrid keys
5. **Validate webhook signatures** - Always verify Stripe webhooks
6. **Rate limit endpoints** - Use middleware to prevent abuse
7. **Monitor logs** - Set up logging and monitoring

## 🚀 Production Deployment

### Option 1: Traditional Server (DigitalOcean, AWS EC2)

```bash
# SSH into server
ssh user@your-server.com

# Clone repository
git clone https://github.com/yourusername/giggliagents-backend.git
cd giggliagents-backend

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
nano .env

# Setup database
python setup.py

# Run with systemd
sudo cp giggliagents.service /etc/systemd/system/
sudo systemctl start giggliagents
sudo systemctl enable giggliagents
```

### Option 2: Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Option 3: Render

1. Connect GitHub repository
2. Create new Web Service
3. Set environment variables
4. Deploy!

### Option 4: Docker on Cloud

```bash
# Build and push to Docker Hub
docker build -t yourusername/giggliagents-backend .
docker push yourusername/giggliagents-backend

# Deploy on any cloud provider supporting Docker
```

## 📊 Database Migrations

Using Alembic for database migrations:

```bash
# Create migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## 🔍 Monitoring & Logs

### View Logs

```bash
# Docker Compose
docker-compose logs -f api

# Systemd
sudo journalctl -u giggliagents -f

# Direct
tail -f logs/app.log
```

### Metrics to Monitor

- API response times
- Database connection pool
- Stripe webhook success rate
- Email delivery rate
- License validation requests
- Download counts

## 🆘 Troubleshooting

**Database connection fails**

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U giggliagents -d giggliagents -h localhost
```

**Stripe webhook not working**

```bash
# Use Stripe CLI for local testing
stripe listen --forward-to localhost:8000/api/webhook

# Check webhook secret matches
echo $STRIPE_WEBHOOK_SECRET
```

**SendGrid emails not sending**

```bash
# Test API key
curl -X "POST" "https://api.sendgrid.com/v3/mail/send" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

**File downloads failing**

```bash
# Check downloads directory exists
ls -la downloads/

# Check file permissions
chmod -R 755 downloads/

# For S3, test AWS credentials
aws s3 ls s3://your-bucket --region us-east-1
```

## 📞 Support

- 📚 Documentation: https://docs.giggliagents.com
- 💬 Discord: https://discord.gg/giggliagents
- ✉️ Email: support@giggliagents.com

## 📄 License

Proprietary - © 2025 GiggliAgents
