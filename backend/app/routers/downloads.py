from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import DownloadRequest
from ..services.storage_service import storage_service
from ..services.license_service import LicenseService
from ..models import Download
from pathlib import Path

router = APIRouter(prefix="/api/downloads", tags=["downloads"])


@router.post("/get-url")
async def get_download_url(
    request: DownloadRequest,
    db: Session = Depends(get_db),
    http_request: Request = None,
):
    """Get download URL for licensed user"""

    try:
        # Validate license
        valid, license = LicenseService.validate_license(db, request.license_key)

        if not valid or not license:
            raise HTTPException(status_code=403, detail="Invalid license")

        # Get download URL
        url, metadata = storage_service.get_download_url(
            platform=request.platform, version="1.0.0"
        )

        # Log download
        download = Download(
            license_key=request.license_key,
            platform=request.platform,
            version="1.0.0",
            ip_address=http_request.client.host if http_request else None,
            user_agent=http_request.headers.get("user-agent") if http_request else None,
        )
        db.add(download)
        db.commit()

        print(f"✅ Download URL generated: {request.platform} - {request.license_key}")

        return {
            "download_url": url,
            "platform": request.platform,
            "version": "1.0.0",
            **metadata,
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Download error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/file/{platform}/{filename}")
async def download_file(platform: str, filename: str, db: Session = Depends(get_db)):
    """Direct file download (for local storage)"""

    try:
        file_path = Path(storage_service.local_path) / platform / filename

        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found")

        # Add proper headers for Chrome to accept the download
        return FileResponse(
            path=file_path,
            filename=filename,
            media_type="application/octet-stream",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Content-Type": "application/octet-stream",
                "X-Content-Type-Options": "nosniff",
                "Cache-Control": "no-cache",
            },
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/latest-version")
async def get_latest_version():
    """Get latest app version info"""
    return {
        "version": "1.0.0",
        "release_date": "2025-01-15",
        "changelog": [
            "Initial release",
            "AI-powered email replies",
            "Multi-account support",
            "Advanced analytics",
        ],
        "platforms": ["windows", "macos", "linux"],
    }
