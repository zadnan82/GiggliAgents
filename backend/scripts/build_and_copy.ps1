# Build Tauri apps and copy to backend downloads folder

Write-Host "🏗️  Building GiggliAgents Desktop Apps" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Check if desktop-app directory exists
if (-not (Test-Path "../desktop-app")) {
    Write-Host "❌ Error: desktop-app directory not found!" -ForegroundColor Red
    Write-Host "   This script should be run from the backend directory" -ForegroundColor Yellow
    exit 1
}

# Navigate to desktop app
Push-Location ../desktop-app

Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "`n🔨 Building for Windows..." -ForegroundColor Yellow
Write-Host "This will take several minutes..." -ForegroundColor Gray

# Build for Windows
npm run tauri build

Write-Host "`n✅ Build complete!" -ForegroundColor Green

# Go back to backend
Pop-Location

Write-Host "`n📋 Copying files to downloads folder..." -ForegroundColor Yellow

# Create downloads directories
New-Item -ItemType Directory -Force -Path "downloads/windows" | Out-Null
New-Item -ItemType Directory -Force -Path "downloads/macos" | Out-Null
New-Item -ItemType Directory -Force -Path "downloads/linux" | Out-Null

# Find and copy Windows MSI
$msiFiles = Get-ChildItem -Path "../desktop-app/src-tauri/target/release/bundle/msi" -Filter "*.msi" -ErrorAction SilentlyContinue

if ($msiFiles) {
    $latestMsi = $msiFiles | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    Copy-Item $latestMsi.FullName "downloads/windows/GiggliAgents-1.0.0-windows.msi"
    Write-Host "✅ Windows package copied: $($latestMsi.Name)" -ForegroundColor Green
    
    $sizeMB = [math]::Round($latestMsi.Length / 1MB, 2)
    Write-Host "   Size: $sizeMB MB" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Windows package not found" -ForegroundColor Yellow
}

Write-Host "`n✅ All done!" -ForegroundColor Green
Write-Host "`n📦 Download packages available in:" -ForegroundColor Cyan
Write-Host "   backend/downloads/" -ForegroundColor White
Write-Host "`n🔍 Verify with:" -ForegroundColor Cyan
Write-Host "   python scripts\verify_downloads.py" -ForegroundColor White