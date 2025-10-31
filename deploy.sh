#!/bin/bash

# Mood Sync Deployment Script
# This script helps deploy the app to GitHub Pages

echo "🚀 Starting Mood Sync Deployment Process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Please run this script from the project root."
  exit 1
fi

# Check if git repository is initialized
if [ ! -d ".git" ]; then
  echo "❌ Error: This is not a git repository. Please initialize git first:"
  echo "   git init"
  echo "   git remote add origin https://github.com/YOUR_USERNAME/MoodTrackingApp.git"
  exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Run type checking
echo "🔍 Running type check..."
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ Type check failed. Please fix TypeScript errors before deploying."
  exit 1
fi

# Run linting
echo "🧹 Running lint check..."
npm run lint
if [ $? -ne 0 ]; then
  echo "⚠️  Lint warnings found. Consider fixing them before deploying."
  read -p "Continue anyway? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Build the project
echo "🏗️  Building project..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Please fix build errors before deploying."
  exit 1
fi

# Deploy to GitHub Pages
echo "🌐 Deploying to GitHub Pages..."
npm run deploy
if [ $? -ne 0 ]; then
  echo "❌ Deployment failed. Please check your GitHub repository settings."
  exit 1
fi

echo "✅ Deployment completed successfully!"
echo "🎉 Your app should be available at: https://YOUR_USERNAME.github.io/MoodTrackingApp/"
echo ""
echo "📝 Next steps:"
echo "1. Update the repository name in vite.config.ts if different"
echo "2. Enable GitHub Pages in repository settings"
echo "3. Set source to 'GitHub Actions'"
echo "4. Push changes to trigger automatic deployment"