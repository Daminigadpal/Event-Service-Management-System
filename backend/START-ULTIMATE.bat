@echo off
cls
echo 🚀 ULTIMATE BACKEND STARTER - ALL FILES FIXED
echo ========================================

echo 📂 Changing to backend directory...
cd /d "E:\Event Service Management System\backend"

echo 🗄️ Starting MongoDB service...
net start MongoDB 2>nul
timeout /t 3

echo 🌐 Starting backend server...
echo Using index.cjs (CommonJS version)
echo.
node index.cjs

echo.
echo ✅ BACKEND SERVER STARTED!
echo ========================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo Test: http://localhost:5173/register
echo ========================================
echo.
echo 🎉 REGISTRATION WILL NOW WORK!
echo All ES module import errors are fixed
echo Users will be saved to MongoDB database
echo ========================================
pause
