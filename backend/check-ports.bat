@echo off
echo 🔍 CHECKING PORTS...
echo.

echo Port 5000 (Backend should be here):
netstat -ano | findstr :5000

echo.
echo Port 5010 (Old backend port):
netstat -ano | findstr :5010

echo.
echo Port 5173 (Frontend):
netstat -ano | findstr :5173

echo.
echo Node processes running:
tasklist | findstr node.exe

pause
