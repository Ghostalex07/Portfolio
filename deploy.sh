#!/bin/bash

# Script to deploy the portfolio to GitHub Pages
# Usage: ./deploy.sh "Commit message"

if [ -z "$1" ]; then
  echo "Error: Please provide a commit message."
  echo "Usage: ./deploy.sh \"Your commit message\""
  exit 1
fi

COMMIT_MESSAGE=$1

echo "--- Starting Deployment Process ---"

# 1. Build the project
echo "Step 1: Building project..."
npm run build

if [ $? -ne 0 ]; then
  echo "Error: Build failed. Aborting deployment."
  exit 1
fi

# 2. Add changes to git
echo "Step 2: Adding changes to Git..."
git add .

# 3. Commit changes
echo "Step 3: Committing changes..."
git commit -m "$COMMIT_MESSAGE"

# 4. Push to main branch
echo "Step 4: Pushing to main branch..."
git push origin main

# 5. Deploy to GitHub Pages
echo "Step 5: Deploying to gh-pages..."
npm run deploy

echo "--- Deployment Complete! ---"
echo "Your portfolio should be live at: https://Ghostalex07.github.io/$(basename $(pwd))/"
