@echo off
echo =========================================
echo    JobMatcher AI Portal - Quick Start
echo =========================================
echo.

:: Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [1/3] Starting MongoDB...
docker run -d --name jobmatcher-mongo -p 27017:27017 mongo:7 2>nul || echo MongoDB already running

echo [2/3] Installing backend dependencies...
cd backend
call npm install
cd ..

echo [3/3] Starting services...
echo.
echo Starting Backend (port 5000)...
start "Backend" cmd /c "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend (port 5173)...
start "Frontend" cmd /c "npm run dev"

echo.
echo =========================================
echo    All services starting!
echo =========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo MongoDB:  localhost:27017
echo.
echo Demo Login:
echo   Email:    john@email.com
echo   Password: password123
echo.
echo To seed data, run: cd backend ^&^& npm run seed
echo =========================================
pause
