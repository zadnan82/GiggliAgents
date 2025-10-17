"""
Create demo/placeholder app packages for testing
"""

import os
from pathlib import Path


def create_demo_package(platform: str, filename: str):
    """Create a small demo package file"""

    downloads_dir = Path(__file__).parent.parent / "downloads" / platform
    downloads_dir.mkdir(parents=True, exist_ok=True)

    file_path = downloads_dir / filename

    # Create demo content (removed fancy unicode characters)
    demo_content = """
================================================
   GiggliAgents Email Assistant v1.0.0
   Demo Package for Testing
================================================

This is a DEMO/PLACEHOLDER file for testing the download system.

Platform: {}
Filename: {}

TO REPLACE WITH REAL APP:
1. Build your Tauri app:
   cd desktop-app
   npm run tauri:build

2. Copy the built app here:
   - Windows: src-tauri/target/release/bundle/msi/*.msi
   - macOS: src-tauri/target/release/bundle/dmg/*.dmg
   - Linux: src-tauri/target/release/bundle/appimage/*.AppImage

3. Rename to match convention:
   GiggliAgents-{{version}}-{{platform}}.{{ext}}

For testing, this placeholder file will work with the download API.

Copyright 2025 GiggliAgents
""".format(platform, filename)

    # Write demo file with UTF-8 encoding
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(demo_content)

    # Make it a bit larger (simulate ~1MB file)
    with open(file_path, "a", encoding="utf-8") as f:
        f.write("\n" + "=" * 1000000)

    size_mb = file_path.stat().st_size / (1024 * 1024)
    print(f"✅ Created demo package: {filename} ({size_mb:.2f} MB)")

    return file_path


def create_all_demo_packages():
    """Create demo packages for all platforms"""

    print("🎨 Creating Demo App Packages")
    print("=" * 50)

    packages = [
        ("windows", "GiggliAgents-1.0.0-windows.exe"),
        ("macos", "GiggliAgents-1.0.0-macos.dmg"),
        ("linux", "GiggliAgents-1.0.0-linux.AppImage"),
    ]

    for platform, filename in packages:
        create_demo_package(platform, filename)

    print("=" * 50)
    print("✅ All demo packages created!")
    print("\n⚠️  IMPORTANT:")
    print("   These are PLACEHOLDER files for testing only.")
    print("   Replace with real Tauri builds before production!")
    print("\n💡 Next steps:")
    print("   1. Run: python scripts/verify_downloads.py")
    print("   2. Start backend: python -m uvicorn app.main:app --reload")
    print("   3. Test downloads at: http://localhost:8000/docs")


if __name__ == "__main__":
    create_all_demo_packages()
