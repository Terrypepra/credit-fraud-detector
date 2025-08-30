# GitHub Setup Guide

## Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in to your account
2. Click the "+" icon in the top right corner and select "New repository"
3. Name your repository: `credit-fraud-detector`
4. Add a description: "A comprehensive credit card fraud detection system with Flask backend and React frontend"
5. Choose "Public" or "Private" (your preference)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 2: Connect Your Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these commands in your terminal:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/credit-fraud-detector.git

# Set the main branch (GitHub now uses 'main' by default)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

## Step 3: Verify the Push

1. Go to your GitHub repository page
2. You should see all your files including:
   - `app.py` (Flask backend)
   - `fraud-finder-web-1/` (React frontend)
   - `requirements.txt` (Python dependencies)
   - `README.md` (Project documentation)
   - `fraud_model.pkl` and `scaler.pkl` (ML models)

## Step 4: Set Up GitHub Pages (Optional)

If you want to deploy the frontend to GitHub Pages:

1. Go to your repository settings
2. Scroll down to "Pages" section
3. Select "Deploy from a branch"
4. Choose "main" branch and "/docs" folder
5. Click "Save"

## Step 5: Set Up GitHub Actions (Optional)

You can create a GitHub Actions workflow for automated testing and deployment. See the `.github/workflows/` directory for examples.

## Troubleshooting

### If you get authentication errors:
1. Use GitHub CLI: `gh auth login`
2. Or use Personal Access Token:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate a new token with repo permissions
   - Use the token as your password when pushing

### If you get large file errors:
The repository includes large files (ML models and dataset). GitHub has a 100MB file limit, but these files should be under that limit. If you encounter issues, consider using Git LFS.

## Next Steps

After pushing to GitHub:

1. **Deploy Backend**: Consider deploying to Heroku, Railway, or Render
2. **Deploy Frontend**: Consider deploying to Vercel, Netlify, or GitHub Pages
3. **Add Issues**: Create issues for bugs or feature requests
4. **Add Collaborators**: Invite team members if working with others
5. **Set up CI/CD**: Configure automated testing and deployment

## Repository Structure

Your repository should look like this:

```
credit-fraud-detector/
├── app.py                          # Flask backend
├── requirements.txt                # Python dependencies
├── fraud_model.pkl                # Trained ML model
├── scaler.pkl                     # Feature scaler
├── creditcard.csv                 # Sample dataset
├── README.md                      # Project documentation
├── .gitignore                     # Git ignore rules
├── Procfile                       # Heroku deployment
├── runtime.txt                    # Python version
├── deploy.sh                      # Linux deployment script
├── deploy.bat                     # Windows deployment script
└── fraud-finder-web-1/           # React frontend
    ├── src/
    ├── package.json
    ├── vite.config.ts
    └── README.md
```

## Support

If you encounter any issues:
1. Check the GitHub documentation
2. Look at the error messages in your terminal
3. Ensure all files are properly committed
4. Verify your GitHub credentials are correct 