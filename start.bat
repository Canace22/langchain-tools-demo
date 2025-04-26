@echo off
setlocal

echo === LangChain Tools Demo - Startup Script ===
echo.

REM Check if npm is installed
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: npm is not installed. Please install Node.js and npm first.
    exit /b 1
)

REM Start backend service
echo Starting Backend...
cd backend
if not exist node_modules (
    echo Installing dependencies for Backend...
    call npm install
)
start cmd /k "echo Backend service starting... && npm run dev"
cd ..

REM Give backend a moment to start
timeout /t 2 /nobreak >nul

REM Start frontend service
echo Starting Frontend...
cd frontend
if not exist node_modules (
    echo Installing dependencies for Frontend...
    call npm install
)
start cmd /k "echo Frontend service starting... && npm run dev"
cd ..

echo.
echo Services started successfully!
echo Backend running at: http://localhost:3000
echo Frontend should be accessible at: http://localhost:5173
echo MCP service running at: http://localhost:3001
echo.
echo Press Ctrl+C in each command window to stop the services

endlocal 