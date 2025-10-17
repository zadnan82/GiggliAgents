"""
Upload app packages to storage
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.storage_service import storage_service
import argparse


def upload_app(file_path: str, platform: str):
    """Upload app package"""

    file_path = Path(file_path)

    if not file_path.exists():
        print(f"❌ File not found: {file_path}")
        return

    print(f"📦 Uploading {file_path.name} ({platform})...")

    try:
        storage_service.upload_file(str(file_path), platform)
        print(f"✅ Upload successful!")
    except Exception as e:
        print(f"❌ Upload failed: {e}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload app package")
    parser.add_argument("file", help="Path to app package")
    parser.add_argument(
        "platform", choices=["windows", "macos", "linux"], help="Platform"
    )

    args = parser.parse_args()

    upload_app(args.file, args.platform)
