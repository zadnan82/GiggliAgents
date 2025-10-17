#!/bin/bash

# Build Tauri apps and copy to backend downloads folder
# Run this from the backend directory

echo "🏗️  Building GiggliAgents Desktop Apps"
echo "======================================"

# Check if desktop-app directory exists
if [ ! -d "../desktop-app" ]; then
    echo "❌ Error: desktop-app directory not found!"
    echo "   This script should be run from the backend directory"
    exit 1
fi

# Navigate to desktop app
cd ../desktop-app

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔨 Building for all platforms..."
echo "This will take several minutes..."

# Build for Windows
echo ""
echo "Windows..."
npm run tauri build -- --target x86_64-pc-windows-msvc

# Build for macOS
echo ""
echo "macOS (Intel)..."
npm run tauri build -- --target x86_64-apple-darwin

echo ""
echo "macOS (Apple Silicon)..."
npm run tauri build -- --target aarch64-apple-darwin

# Build for Linux
echo ""
echo "Linux..."
npm run tauri build -- --target x86_64-unknown-linux-gnu

echo ""
echo "✅ Build complete!"

# Go back to backend
cd ../backend

echo ""
echo "📋 Copying files to downloads folder..."

# Create downloads directories
mkdir -p downloads/windows
mkdir -p downloads/macos
mkdir -p downloads/linux

# Copy Windows
if [ -f "../desktop-app/src-tauri/target/release/bundle/msi/GiggliAgents_1.0.0_x64_en-US.msi" ]; then
    cp "../desktop-app/src-tauri/target/release/bundle/msi/GiggliAgents_1.0.0_x64_en-US.msi" \
       "downloads/windows/GiggliAgents-1.0.0-windows.exe"
    echo "✅ Windows package copied"
else
    echo "⚠️  Windows package not found"
fi

# Copy macOS
if [ -f "../desktop-app/src-tauri/target/release/bundle/dmg/GiggliAgents_1.0.0_x64.dmg" ]; then
    cp "../desktop-app/src-tauri/target/release/bundle/dmg/GiggliAgents_1.0.0_x64.dmg" \
       "downloads/macos/GiggliAgents-1.0.0-macos.dmg"
    echo "✅ macOS package copied"
else
    echo "⚠️  macOS package not found"
fi

# Copy Linux
if [ -f "../desktop-app/src-tauri/target/release/bundle/appimage/giggliagents_1.0.0_amd64.AppImage" ]; then
    cp "../desktop-app/src-tauri/target/release/bundle/appimage/giggliagents_1.0.0_amd64.AppImage" \
       "downloads/linux/GiggliAgents-1.0.0-linux.AppImage"
    echo "✅ Linux package copied"
else
    echo "⚠️  Linux package not found"
fi

echo ""
echo "✅ All done!"
echo ""
echo "📦 Download packages available in:"
echo "   backend/downloads/"
echo ""
echo "🔍 Verify with:"
echo "   python scripts/verify_downloads.py"