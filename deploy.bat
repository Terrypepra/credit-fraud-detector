@echo off
echo 🚀 Starting deployment process...

REM Check if we're in the right directory
if not exist "app.py" (
    echo ❌ Error: app.py not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install Python dependencies
echo 📥 Installing Python dependencies...
pip install -r requirements.txt

REM Check if model files exist
if not exist "fraud_model.pkl" (
    echo ❌ Error: fraud_model.pkl not found.
    echo Please ensure the trained model files are present.
    pause
    exit /b 1
)

if not exist "scaler.pkl" (
    echo ❌ Error: scaler.pkl not found.
    echo Please ensure the trained model files are present.
    pause
    exit /b 1
)

REM Build frontend
echo 🏗️ Building frontend...
cd fraud-finder-web-1
call npm install
call npm run build
cd ..

REM Test backend
echo 🧪 Testing backend...
python -c "import app; print('✅ Backend imports successfully')"

echo ✅ Deployment preparation complete!
echo.
echo To start the application:
echo 1. Backend: python app.py
echo 2. Frontend: cd fraud-finder-web-1 ^&^& npm run dev
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:5173
pause 