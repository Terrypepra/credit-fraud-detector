# 🚀 Deployment Guide - Credit Fraud Detector

This guide will help you deploy your credit fraud detector application so others can test it online.

## 📋 Prerequisites

- GitHub account
- Railway account (free tier available)
- Vercel account (free tier available)

## 🎯 Quick Deployment (Recommended)

### Step 1: Push to GitHub

1. **Create GitHub Repository:**
   ```bash
   # Go to GitHub.com and create a new repository named "credit-fraud-detector"
   # Don't initialize with README (we already have one)
   ```

2. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/credit-fraud-detector.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy Backend to Railway

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"** → "Deploy from GitHub repo"
4. **Select your repository** `credit-fraud-detector`
5. **Railway will automatically detect** it's a Python app
6. **Set Environment Variables:**
   - `JWT_SECRET_KEY`: Generate a random secret (e.g., `your-super-secret-key-123`)
   - `FLASK_ENV`: `production`
   - `CORS_ORIGINS`: Your frontend URL (we'll add this after frontend deployment)

7. **Deploy** - Railway will automatically build and deploy
8. **Copy the deployment URL** (e.g., `https://your-app-name.railway.app`)

### Step 3: Deploy Frontend to Vercel

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"** → Import your repository
4. **Configure build settings:**
   - Framework Preset: `Vite`
   - Build Command: `cd fraud-finder-web-1 && npm run build`
   - Output Directory: `fraud-finder-web-1/dist`
   - Install Command: `cd fraud-finder-web-1 && npm install`

5. **Set Environment Variables:**
   - `VITE_API_BASE_URL`: Your Railway backend URL + `/api` (e.g., `https://your-app-name.railway.app/api`)

6. **Deploy** - Vercel will build and deploy automatically

### Step 4: Update CORS Settings

1. **Go back to Railway dashboard**
2. **Update the `CORS_ORIGINS` environment variable:**
   - Add your Vercel frontend URL (e.g., `https://your-app-name.vercel.app`)
   - Separate multiple URLs with commas if needed

3. **Redeploy** the backend (Railway will auto-redeploy)

## 🔧 Alternative Deployment Options

### Option A: Render + Netlify

**Backend (Render):**
1. Go to [Render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `gunicorn app:app`
6. Set environment variables

**Frontend (Netlify):**
1. Go to [Netlify.com](https://netlify.com)
2. Import from GitHub
3. Build Command: `cd fraud-finder-web-1 && npm run build`
4. Publish Directory: `fraud-finder-web-1/dist`

### Option B: Heroku (Paid)

**Backend:**
```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set JWT_SECRET_KEY=your-secret-key
git push heroku main
```

**Frontend:**
- Deploy to Heroku or use Vercel/Netlify

## 🌐 Environment Variables Reference

### Backend Variables:
```bash
JWT_SECRET_KEY=your-super-secret-key-123
FLASK_ENV=production
CORS_ORIGINS=https://your-frontend-url.com
PORT=5000
```

### Frontend Variables:
```bash
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_APP_NAME=Credit Fraud Detector
```

## 🧪 Testing Your Deployment

1. **Test Backend:**
   ```bash
   curl https://your-backend-url.com/api/health
   ```

2. **Test Frontend:**
   - Open your frontend URL
   - Try to register/login
   - Test fraud detection features

3. **Test Integration:**
   - Make sure frontend can connect to backend
   - Test all features work properly

## 🔒 Security Considerations

1. **Change JWT Secret:** Use a strong, random secret key
2. **Enable HTTPS:** All platforms provide this automatically
3. **CORS Configuration:** Restrict to your frontend domain
4. **Environment Variables:** Never commit secrets to Git

## 📊 Monitoring & Maintenance

1. **Check Logs:** Monitor application logs for errors
2. **Performance:** Monitor response times and resource usage
3. **Updates:** Keep dependencies updated
4. **Backups:** Consider database backups for production

## 🆘 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Check CORS_ORIGINS environment variable
   - Ensure frontend URL is included

2. **Build Failures:**
   - Check build logs for dependency issues
   - Verify Python/Node.js versions

3. **Connection Errors:**
   - Verify API_BASE_URL is correct
   - Check if backend is running

4. **Model File Issues:**
   - Ensure fraud_model.pkl and scaler.pkl are in repository
   - Check file paths in code

### Debug Commands:
```bash
# Test backend locally
python app.py

# Test frontend locally
cd fraud-finder-web-1 && npm run dev

# Check environment variables
echo $JWT_SECRET_KEY
echo $VITE_API_BASE_URL
```

## 🎉 Success!

Once deployed, you'll have:
- **Backend API:** `https://your-app-name.railway.app`
- **Frontend App:** `https://your-app-name.vercel.app`
- **Public Access:** Anyone can test your fraud detection system!

## 📞 Support

If you encounter issues:
1. Check platform documentation
2. Review error logs
3. Verify environment variables
4. Test locally first

Your application will be live and accessible to users worldwide! 🌍 