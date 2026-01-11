@echo off
echo 🔥 KILLING EXISTING BACKEND...
taskkill /f /im node.exe 2>nul

echo ✅ PORT FIXED TO 5000!
echo 🚀 STARTING BACKEND ON CORRECT PORT...

cd /d "e:\Event Service Management System\backend"
node index.js

pause
