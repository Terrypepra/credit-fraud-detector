#!/bin/bash

# Credit Fraud Detector Deployment Script

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "app.py" ]; then
    echo "❌ Error: app.py not found. Please run this script from the project root."
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt

# Check if model files exist
if [ ! -f "fraud_model.pkl" ] || [ ! -f "scaler.pkl" ]; then
    echo "❌ Error: Model files (fraud_model.pkl, scaler.pkl) not found."
    echo "Please ensure the trained model files are present."
    exit 1
fi

# Build frontend
echo "🏗️ Building frontend..."
cd fraud-finder-web-1
npm install
npm run build
cd ..

# Test backend
echo "🧪 Testing backend..."
python -c "
import app
print('✅ Backend imports successfully')
"

echo "✅ Deployment preparation complete!"
echo ""
echo "To start the application:"
echo "1. Backend: python app.py"
echo "2. Frontend: cd fraud-finder-web-1 && npm run dev"
echo ""
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:5173" 