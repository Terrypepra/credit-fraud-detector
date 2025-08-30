@echo off
echo Starting Credit Fraud Detector...
echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d D:\beeeen\credit-fraud-detector && venv\Scripts\Activate.bat && python app.py"
echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d D:\beeeen\credit-fraud-detector\fraud-finder-web-1 && npm run dev"
echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5174
echo.
pause
