"""
Build Tauri apps and copy to backend downloads folder
Cross-platform Python version
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path


def run_command(cmd, cwd=None):
    """Run a command and print output"""
    try:
        result = subprocess.run(
            cmd, cwd=cwd, shell=True, check=True, capture_output=True, text=True
        )
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {e}")
        print(e.stderr)
        return False


def main():
    print("🏗️  Building GiggliAgents Desktop Apps")
    print("=" * 50)

    # Get paths
    backend_dir = Path(__file__).parent.parent
    desktop_dir = backend_dir.parent / "desktop-app"

    if not desktop_dir.exists():
        print("❌ Error: desktop-app directory not found!")
        print("   Expected at:", desktop_dir)
        return False

    print(f"📁 Desktop app directory: {desktop_dir}")
    print(f"📁 Backend directory: {backend_dir}")

    # Install dependencies
    print("\n📦 Installing dependencies...")
    if not run_command("npm install", cwd=desktop_dir):
        return False

    # Build for Windows
    print("\n🔨 Building for Windows...")
    print("⏰ This will take several minutes...")
    if not run_command("npm run tauri build", cwd=desktop_dir):
        print("⚠️  Build failed or incomplete")

    # Create downloads directories
    print("\n📋 Setting up downloads folder...")
    downloads_dir = backend_dir / "downloads"
    (downloads_dir / "windows").mkdir(parents=True, exist_ok=True)
    (downloads_dir / "macos").mkdir(parents=True, exist_ok=True)
    (downloads_dir / "linux").mkdir(parents=True, exist_ok=True)

    # Copy Windows MSI
    bundle_dir = desktop_dir / "src-tauri" / "target" / "release" / "bundle"
    msi_dir = bundle_dir / "msi"

    if msi_dir.exists():
        msi_files = list(msi_dir.glob("*.msi"))
        if msi_files:
            latest_msi = max(msi_files, key=lambda p: p.stat().st_mtime)
            dest = downloads_dir / "windows" / "GiggliAgents-1.0.0-windows.msi"
            shutil.copy2(latest_msi, dest)

            size_mb = dest.stat().st_size / (1024 * 1024)
            print(f"✅ Windows package copied: {latest_msi.name}")
            print(f"   Size: {size_mb:.2f} MB")
        else:
            print("⚠️  No MSI files found")
    else:
        print("⚠️  MSI directory not found")

    # Copy EXE if exists
    nsis_dir = bundle_dir / "nsis"
    if nsis_dir.exists():
        exe_files = list(nsis_dir.glob("*.exe"))
        if exe_files:
            latest_exe = max(exe_files, key=lambda p: p.stat().st_mtime)
            dest = downloads_dir / "windows" / "GiggliAgents-1.0.0-windows.exe"
            shutil.copy2(latest_exe, dest)
            print(f"✅ Windows EXE copied: {latest_exe.name}")

    print("\n" + "=" * 50)
    print("✅ All done!")
    print(f"\n📦 Download packages in: {downloads_dir}")
    print("\n🔍 Verify with:")
    print("   python scripts/verify_downloads.py")

    return True


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
