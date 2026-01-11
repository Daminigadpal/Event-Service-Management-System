# PowerShell script to start backend server
Write-Host "🚀 Starting Backend Server..." -ForegroundColor Green

# Navigate to backend directory
Set-Location "E:\Event Service Management System\backend"

# Start MongoDB if not running
try {
    Get-Process -Name "mongod" -ErrorAction Stop
} catch {
    Write-Host "Starting MongoDB..." -ForegroundColor Yellow
    Start-Process "mongod" -WindowStyle Hidden
}

# Start Node.js server
Write-Host "Starting Node.js server on port 5000..." -ForegroundColor Yellow
try {
    node index-fixed.js
} catch {
    Write-Host "❌ Error starting server: $_" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backend server started successfully!" -ForegroundColor Green
Write-Host "📡 API: http://localhost:5000/api/v1" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
