# Credit Fraud Detector

A comprehensive credit card fraud detection system with a modern web interface and machine learning backend.

## Features

- **Real-time Fraud Detection**: Analyze individual transactions for fraud patterns
- **Batch Processing**: Upload CSV files for bulk transaction analysis
- **Machine Learning Model**: Uses RandomForest classifier with 95%+ accuracy
- **User Authentication**: Secure JWT-based authentication system
- **Transaction History**: Track and export analysis history
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **API Documentation**: RESTful API with comprehensive endpoints

## Tech Stack

### Backend
- **Python Flask**: REST API server
- **Machine Learning**: scikit-learn with RandomForest classifier
- **Authentication**: JWT tokens with Flask-JWT-Extended
- **Data Processing**: pandas and numpy for data manipulation

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Beautiful component library
- **React Router**: Client-side routing
- **React Query**: Data fetching and caching

## Project Structure

```
credit-fraud-detector/
├── app.py                          # Flask backend server
├── requirements.txt                # Python dependencies
├── fraud_model.pkl                # Trained ML model
├── scaler.pkl                     # Feature scaler
├── creditcard.csv                 # Sample dataset
├── fraud-finder-web-1/           # React frontend
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API services
│   │   └── hooks/               # Custom hooks
│   ├── package.json
│   └── README.md
└── README.md                     # This file
```

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd credit-fraud-detector
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the Flask server**
   ```bash
   python app.py
   ```
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd fraud-finder-web-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile (protected)

### Fraud Detection
- `POST /api/analyze-transaction` - Analyze single transaction (protected)
- `POST /api/analyze-batch` - Analyze multiple transactions (protected)
- `POST /api/upload-csv` - Upload CSV for batch analysis (protected)
- `POST /api/predict` - Direct ML model prediction (protected)

### Analytics
- `GET /api/transaction-history` - Get user's analysis history (protected)
- `GET /api/export-history` - Export history as CSV (protected)
- `GET /api/real-time-stats` - Get real-time statistics (protected)
- `GET /api/model-evaluation` - Get model performance metrics (protected)

### System
- `GET /api/health` - Health check
- `GET /api/model-info` - Model information (protected)

## Usage

1. **Register/Login**: Create an account or login to access the system
2. **Single Transaction Analysis**: Enter transaction details manually
3. **Batch Analysis**: Upload CSV files with transaction data
4. **View History**: Check your analysis history and export results
5. **Monitor Stats**: View real-time statistics and model performance

## Model Information

- **Algorithm**: RandomForest Classifier
- **Accuracy**: 95.2%
- **Precision**: 94.8%
- **Recall**: 92.1%
- **F1-Score**: 93.4%
- **Features**: 30 (Time, V1-V28, Amount)

## Security Features

- JWT-based authentication
- Password hashing with Werkzeug
- CORS protection
- Input validation and sanitization
- Rate limiting (recommended for production)

## Deployment

### Backend Deployment
The Flask app can be deployed to:
- Heroku
- Railway
- Render
- AWS Elastic Beanstalk
- Google Cloud Run

### Frontend Deployment
The React app can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub. 