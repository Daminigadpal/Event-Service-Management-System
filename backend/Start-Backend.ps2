Write-Host "Starting backend..." -ForegroundColor Green

Set-Location "E:\Event Service Management System\backend"

$env:NODE_OPTIONS="--require=cjs"

$process = Start-Process -FilePath "node.exe" -ArgumentList "index.cjs" -PassThru -Wait -NoNewWindow

Start-Sleep -Seconds 3

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000" -Method GET -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "SUCCESS: Backend is running!" -ForegroundColor Green
        Write-Host "API: http://localhost:5000/api/v1" -ForegroundColor Cyan
        Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
        Write-Host "Users can now register and login!" -ForegroundColor Green
        Write-Host "Registration data will be saved to MongoDB database" -ForegroundColor White
    } else {
        Write-Host "FAILED: Backend not responding" -ForegroundColor Red
    }
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
}

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
