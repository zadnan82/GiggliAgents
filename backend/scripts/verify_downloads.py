"""
Verify that all required download files exist
"""

import os
from pathlib import Path


def verify_downloads():
    """Check if all download files exist"""

    print("🔍 Verifying Download Files")
    print("=" * 50)

    downloads_dir = Path(__file__).parent.parent / "downloads"

    required_files = {
        "windows": ["GiggliAgents-1.0.0-windows.exe"],
        "macos": ["GiggliAgents-1.0.0-macos.dmg"],
        "linux": ["GiggliAgents-1.0.0-linux.AppImage"],
    }

    all_ok = True

    for platform, files in required_files.items():
        platform_dir = downloads_dir / platform

        if not platform_dir.exists():
            print(f"❌ {platform.capitalize()} directory missing!")
            all_ok = False
            continue

        for filename in files:
            file_path = platform_dir / filename

            if file_path.exists():
                size_mb = file_path.stat().st_size / (1024 * 1024)
                print(f"✅ {platform.capitalize()}: {filename} ({size_mb:.2f} MB)")
            else:
                print(f"❌ {platform.capitalize()}: {filename} - NOT FOUND")
                all_ok = False

    print("=" * 50)

    if all_ok:
        print("✅ All download files present!")
    else:
        print("❌ Some files are missing!")
        print("\n💡 To create demo files for testing:")
        print("   python scripts/create_demo_packages.py")
        print("\n💡 To build real apps:")
        print("   cd desktop-app")
        print("   npm run tauri:build")

    return all_ok


if __name__ == "__main__":
    verify_downloads()
