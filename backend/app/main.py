from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .routers import mock_payments
from .config import settings
from .database import init_db
from .routers import payments, licenses, downloads, webhooks, admin

# Initialize FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Complete backend for GiggliAgents licensing and distribution",
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:3000",
        "http://localhost:5173",
        "https://giggliagents.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(payments.router)
app.include_router(licenses.router)
app.include_router(downloads.router)
app.include_router(webhooks.router)
app.include_router(admin.router)
app.include_router(mock_payments.router)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    print("=" * 60)
    print(f"🚀 Starting {settings.app_name} v{settings.app_version}")
    print("=" * 60)
    init_db()
    print(f"✅ Database initialized")
    print(f"📝 API Documentation: http://localhost:8000/docs")
    print(f"🔗 Frontend URL: {settings.frontend_url}")
    print("=" * 60)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "running",
        "docs": "/docs",
        "endpoints": {
            "payments": "/api/create-checkout-session",
            "validate": "/api/validate-license",
            "download": "/api/downloads/get-url",
            "webhook": "/api/webhook",
            "admin": "/api/admin/stats",
        },
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": "2025-01-15T00:00:00Z"}


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    print(f"❌ Unhandled exception: {exc}")
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=settings.debug)
