# Deployment Guide

This guide covers deploying both the backend and frontend of the Credit Fraud Detector application.

## Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI**
   ```bash
   # Windows
   winget install --id=Heroku.HerokuCLI
   
   # macOS
   brew tap heroku/brew && brew install heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET_KEY=your-secret-key-here
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Open the App**
   ```bash
   heroku open
   ```

### Option 2: Railway

1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select the repository
4. Railway will automatically detect it's a Python app
5. Set environment variables in the dashboard
6. Deploy automatically on push

### Option 3: Render

1. Go to [Render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `python app.py`
6. Deploy

## Frontend Deployment

### Option 1: Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set build settings:
   - Framework Preset: Vite
   - Build Command: `cd fraud-finder-web-1 && npm run build`
   - Output Directory: `fraud-finder-web-1/dist`
4. Set environment variables:
   - `VITE_API_BASE_URL`: Your backend URL
5. Deploy

### Option 2: Netlify

1. Go to [Netlify.com](https://netlify.com)
2. Import your GitHub repository
3. Set build settings:
   - Build command: `cd fraud-finder-web-1 && npm run build`
   - Publish directory: `fraud-finder-web-1/dist`
4. Set environment variables
5. Deploy

### Option 3: GitHub Pages

1. In your repository settings, go to Pages
2. Select "Deploy from a branch"
3. Choose main branch and `/docs` folder
4. Create a GitHub Action to build and deploy:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
    
    - name: Install dependencies
      working-directory: fraud-finder-web-1
      run: npm ci
    
    - name: Build
      working-directory: fraud-finder-web-1
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./fraud-finder-web-1/dist
```

## Environment Variables

### Backend Environment Variables

```bash
# Required
JWT_SECRET_KEY=your-secret-key-here

# Optional
FLASK_ENV=production
FLASK_DEBUG=False
PORT=5000
```

### Frontend Environment Variables

```bash
# Required
VITE_API_BASE_URL=https://your-backend-url.com/api

# Optional
VITE_APP_NAME=Credit Fraud Detector
VITE_APP_VERSION=1.0.0
```

## Production Considerations

### Security

1. **Change JWT Secret**: Use a strong, random secret key
2. **Enable HTTPS**: Always use HTTPS in production
3. **CORS Configuration**: Restrict CORS to your frontend domain
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **Input Validation**: Ensure all inputs are properly validated

### Performance

1. **Database**: Consider using a proper database instead of JSON files
2. **Caching**: Implement Redis for session storage
3. **CDN**: Use a CDN for static assets
4. **Load Balancing**: For high traffic, use load balancers

### Monitoring

1. **Logging**: Implement proper logging
2. **Error Tracking**: Use services like Sentry
3. **Health Checks**: Implement health check endpoints
4. **Metrics**: Monitor application performance

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure CORS is properly configured
2. **Environment Variables**: Check all required env vars are set
3. **Port Issues**: Ensure the correct port is exposed
4. **Build Failures**: Check Node.js and Python versions

### Debug Commands

```bash
# Check backend logs
heroku logs --tail

# Check frontend build
cd fraud-finder-web-1 && npm run build

# Test backend locally
python app.py

# Test frontend locally
cd fraud-finder-web-1 && npm run dev
```

## Support

For deployment issues:
1. Check the platform's documentation
2. Review error logs
3. Verify environment variables
4. Test locally first 