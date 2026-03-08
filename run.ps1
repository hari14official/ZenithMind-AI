# Zenith AI Launcher - Unified (Single Port 8000)

Write-Host "============================"
Write-Host "Zenith AI Launcher - Unified"
Write-Host "============================"

# Port cleanup
Write-Host "Cleaning up ports 8000/3000..."
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force

# 1. Build Frontend
Write-Host "Preparing Frontend (Building static files)..."
Push-Location apps/web
if (-Not (Test-Path "node_modules")) { 
    Write-Host "Installing Node.js dependencies..."
    npm install 
}
Write-Host "Building... this may take 30-60 seconds"
npm run build
Pop-Location

# 2. Setup Backend
Write-Host "Setting up Backend..."
Push-Location apps/api
if (-Not (Test-Path "venv")) { python -m venv venv }
$venvPath = Join-Path (Get-Location) "venv"
$env:VIRTUAL_ENV = $venvPath
$env:PATH = "$(Join-Path $venvPath 'Scripts');$env:PATH"

python -m pip install -q -r requirements.txt

Write-Host "Training ML model (if required)..."
python -m app.ml.train

# 3. Start Unified Server
Write-Host "`nStarting Zenith AI on port 8000..." -ForegroundColor Green
Write-Host "Both Frontend and Backend are now connected." -ForegroundColor Cyan
Write-Host "Access Link: http://localhost:8000" -ForegroundColor Yellow

# Use -NoExit if you want to see the logs
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$(Get-Location)'; `$env:VIRTUAL_ENV='$env:VIRTUAL_ENV'; `$env:PATH='$env:PATH'; uvicorn app.main:app --host 0.0.0.0 --port 8000"

Pop-Location

Write-Host "`nDone! Open http://localhost:8000 in your browser."
Start-Sleep -Seconds 3
