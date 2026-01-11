# PowerShell script to start backend
Write-Host "🚀 Starting Backend Server..." -ForegroundColor Green

# Navigate to backend directory
Set-Location "E:\Event Service Management System\backend"

# Start MongoDB service
try {
    Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
    Start-Service MongoDB -ErrorAction SilentlyContinue
    Write-Host "✅ MongoDB started" -ForegroundColor Green
} catch {
    Write-Host "❌ MongoDB failed to start" -ForegroundColor Red
}

# Start Node.js server
try {
    Write-Host "🌐 Starting Node.js server..." -ForegroundColor Yellow
    
    # Force CommonJS module loading
    $env:NODE_OPTIONS="--require=cjs"
    
    # Start the server
    $process = Start-Process -FilePath "node.exe" -ArgumentList "index.cjs" -PassThru -Wait -NoNewWindow
    
    # Wait for server to start
    Start-Sleep -Seconds 5
    
    # Check if server is running
    $serverRunning = $false
    for ($i = 0; $i -lt 10; $i++) {
        Start-Sleep -Seconds 1
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:5000" -Method GET -TimeoutSec 5
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ Backend server is running!" -ForegroundColor Green
                $serverRunning = $true
                break
            }
        } catch {
            Write-Host "⚠ Waiting for server to start..." -ForegroundColor Yellow
        }
    }
    
    if ($serverRunning) {
        Write-Host ""
        Write-Host "🎉 BACKEND SERVER STARTED SUCCESSFULLY!" -ForegroundColor Green
        Write-Host "📡 API: http://localhost:5000/api/v1" -ForegroundColor Cyan
        Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Users can now register and login!" -ForegroundColor Green
        Write-Host "Registration data will be saved to MongoDB database" -ForegroundColor White
    } else {
        Write-Host "❌ Failed to start backend server" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor White
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
