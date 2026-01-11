@echo off
echo Killing existing node processes...
taskkill /f /im node.exe 2>nul

echo Starting backend server...
cd /d "e:\Event Service Management System\backend"
npm start
