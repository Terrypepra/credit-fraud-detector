#!/bin/bash

# Credit Fraud Detector - GitHub Deployment Script

echo "🚀 Preparing to deploy Credit Fraud Detector to GitHub..."

# Check if we're in the right directory
if [ ! -f "app.py" ]; then
    echo "❌ Error: app.py not found. Please run this script from the project root."
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git repository not initialized. Please run 'git init' first."
    exit 1
fi

# Check if remote is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "📝 Setting up GitHub remote..."
    echo "Please enter your GitHub username:"
    read -r username
    echo "Please enter your repository name (default: credit-fraud-detector):"
    read -r repo_name
    repo_name=${repo_name:-credit-fraud-detector}
    
    git remote add origin "https://github.com/$username/$repo_name.git"
    echo "✅ Remote added: https://github.com/$username/$repo_name.git"
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📦 Committing changes..."
    git add .
    git commit -m "Update for deployment - production configuration"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Go to Railway.app and deploy your backend"
    echo "2. Go to Vercel.com and deploy your frontend"
    echo "3. Follow the DEPLOYMENT_GUIDE.md for detailed instructions"
    echo ""
    echo "📚 Deployment Guide: DEPLOYMENT_GUIDE.md"
else
    echo "❌ Failed to push to GitHub. Please check your credentials and try again."
    exit 1
fi 