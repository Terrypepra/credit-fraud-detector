# Credit Fraud Detector Startup Script
# Add this to Windows Task Scheduler for auto-start

$projectPath = "D:\beeeen\credit-fraud-detector"
$frontendPath = "$projectPath\fraud-finder-web-1"

# Start Backend Server
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd /d $projectPath && venv\Scripts\Activate.bat && python app.py" -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep -Seconds 5

# Start Frontend Server
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd /d $frontendPath && npm run dev" -WindowStyle Normal

Write-Host "Credit Fraud Detector servers started successfully!"
Write-Host "Backend: http://localhost:5000"
Write-Host "Frontend: http://localhost:5174"
