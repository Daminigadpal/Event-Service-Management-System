@echo off
cls
echo 🚀 BACKEND STARTER - WORKING VERSION
echo ========================================

echo 📂 Changing to backend directory...
cd /d "E:\Event Service Management System\backend"

echo 🗄️ Starting MongoDB service...
net start MongoDB 2>nul
timeout /t 3

echo 🌐 Starting Node.js server...
echo Using fixed index.js with CommonJS imports
echo.
node index.js

echo.
echo ✅ BACKEND STARTED!
echo ========================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo Test: http://localhost:5173/register
echo ========================================
echo.
echo If you see "Server running on port 5000" above, registration will work!
echo.
pause
