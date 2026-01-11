@echo off
echo 🔥 FORCE KILL ALL NODE PROCESSES
taskkill /f /im node.exe 2>nul
timeout /t 2

echo 🗑️ CLEARING PORT 5000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    taskkill /f /pid %%a 2>nul
)

echo 🚀 FORCE STARTING BACKEND ON PORT 5000
cd /d "e:\Event Service Management System\backend"

set PORT=5000
echo PORT set to: %PORT%

echo Starting server...
node index.js

pause
