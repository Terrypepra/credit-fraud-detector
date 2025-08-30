# FraudGuard - Authentication System

## Overview

The FraudGuard system now includes a complete user authentication system that requires users to register and login before accessing the fraud detection features.

## Features

### 🔐 **Authentication Features**
- **User Registration**: Create new accounts with email, password, and name
- **User Login**: Secure login with email and password
- **JWT Token Authentication**: Secure token-based authentication
- **Protected Routes**: All fraud detection endpoints require authentication
- **User Profile**: View user information and account details
- **Logout**: Secure logout with token invalidation

### 🛡️ **Security Features**
- **Password Hashing**: Passwords are securely hashed using Werkzeug
- **JWT Tokens**: Secure JSON Web Tokens for session management
- **Token Expiration**: Tokens expire after 24 hours
- **Protected API Endpoints**: All sensitive endpoints require authentication
- **CORS Support**: Cross-origin requests properly handled

## Backend Authentication Endpoints

### Public Endpoints (No Authentication Required)
- `GET /api/health` - Health check endpoint

### Protected Endpoints (Authentication Required)
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile
- `GET /api/model-info` - Get model information
- `POST /api/predict` - ML model prediction
- `POST /api/analyze-transaction` - Single transaction analysis
- `POST /api/analyze-batch` - Batch transaction analysis
- `POST /api/upload-csv` - CSV file upload
- `GET /api/model-evaluation` - Model evaluation metrics

## Frontend Authentication Flow

### 1. **Initial Load**
- App checks for existing authentication token
- If token exists, validates with backend
- If valid, shows main application
- If invalid, shows login screen

### 2. **Login/Register Screen**
- Users can switch between login and register forms
- Modern, responsive UI with error handling
- Password visibility toggle
- Form validation and loading states

### 3. **Main Application**
- Protected by authentication wrapper
- Shows user information in header
- Logout button available
- All fraud detection features accessible

## User Experience

### **Registration Process**
1. User clicks "Sign up" on login screen
2. Fills in name, email, and password
3. System validates input and creates account
4. User is automatically logged in and redirected to main app

### **Login Process**
1. User enters email and password
2. System validates credentials
3. If valid, user is logged in and redirected to main app
4. If invalid, error message is displayed

### **Session Management**
- Tokens are stored in localStorage
- Automatic token validation on app load
- Automatic logout on token expiration
- Secure logout with token removal

## Technical Implementation

### **Backend (Flask)**
- **JWT Manager**: Flask-JWT-Extended for token management
- **Password Security**: Werkzeug for password hashing
- **User Storage**: JSON file-based storage (can be upgraded to database)
- **Protected Routes**: `@jwt_required()` decorator

### **Frontend (React)**
- **Auth Service**: Centralized authentication management
- **Auth Wrapper**: Component that handles authentication state
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Token Management**: Automatic token inclusion in API requests

## Security Considerations

### **Current Implementation**
- ✅ Password hashing with salt
- ✅ JWT token authentication
- ✅ Token expiration (24 hours)
- ✅ Protected API endpoints
- ✅ Secure logout

### **Production Recommendations**
- 🔄 Use HTTPS in production
- 🔄 Implement refresh tokens
- 🔄 Add rate limiting
- 🔄 Use database instead of JSON file
- 🔄 Add email verification
- 🔄 Implement password reset functionality
- 🔄 Add session management
- 🔄 Implement audit logging

## Usage

### **Starting the Application**

1. **Start Backend**:
   ```bash
   python app.py
   ```

2. **Start Frontend**:
   ```bash
   cd fraud-finder-web-1
   npm run dev
   ```

3. **Access Application**:
   - Open browser to `http://localhost:8081`
   - Register a new account or login
   - Start using fraud detection features

### **Testing Authentication**

Run the test script to verify authentication endpoints:
```bash
python test_auth.py
```

## File Structure

```
credit-fraud-detector/
├── app.py                          # Backend with authentication
├── users.json                      # User storage (auto-created)
├── test_auth.py                    # Authentication tests
├── fraud-finder-web-1/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthWrapper.tsx    # Authentication wrapper
│   │   │   ├── LoginForm.tsx      # Login form
│   │   │   └── RegisterForm.tsx   # Registration form
│   │   ├── services/
│   │   │   ├── authService.ts     # Authentication service
│   │   │   └── fraudDetectionService.ts # Updated with auth
│   │   └── pages/
│   │       └── Index.tsx          # Updated with AuthWrapper
```

## Benefits

1. **Security**: Protects sensitive fraud detection data
2. **User Management**: Track individual user activity
3. **Compliance**: Meets data protection requirements
4. **Scalability**: Foundation for multi-user system
5. **Professional**: Enterprise-grade authentication system

The authentication system is now fully integrated and ready for use! 