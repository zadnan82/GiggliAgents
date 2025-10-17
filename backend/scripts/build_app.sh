#!/bin/bash

# Build script for desktop app
# This builds the Tauri app for all platforms

echo "🔨 Building GiggliAgents Desktop App"
echo "===================================="

# Navigate to desktop app directory
cd ../desktop-app

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for all platforms
echo "🏗️  Building for all platforms..."

# Windows
echo "Building for Windows..."
npm run tauri:build -- --target x86_64-pc-windows-msvc

# macOS
echo "Building for macOS..."
npm run tauri:build -- --target x86_64-apple-darwin
npm run tauri:build -- --target aarch64-apple-darwin

# Linux
echo "Building for Linux..."
npm run tauri:build -- --target x86_64-unknown-linux-gnu

echo "✅ Build complete!"
echo "📦 Packages available in: src-tauri/target/release/bundle/"

# Copy to backend downloads folder
echo "📋 Copying to backend downloads folder..."
cp src-tauri/target/release/bundle/msi/*.msi ../backend/downloads/windows/
cp src-tauri/target/release/bundle/dmg/*.dmg ../backend/downloads/macos/
cp src-tauri/target/release/bundle/appimage/*.AppImage ../backend/downloads/linux/

echo "✅ All done!"