#!/bin/bash

echo "🚀 Club Run - Push to GitHub"
echo "================================"
echo ""

# Check if repository URL is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide your GitHub repository URL"
    echo ""
    echo "Usage: ./push_to_github.sh <your-github-repo-url>"
    echo ""
    echo "Example: ./push_to_github.sh https://github.com/yourusername/club-run.git"
    echo ""
    echo "📋 Steps to get your repository URL:"
    echo "1. Go to GitHub.com and create a new repository"
    echo "2. Copy the repository URL (ends with .git)"
    echo "3. Run this script with the URL"
    exit 1
fi

REPO_URL="$1"

echo "📦 Repository URL: $REPO_URL"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "frontend-src" ] || [ ! -d "backend-src" ]; then
    echo "❌ Error: Please run this script from the club-run-clean directory"
    exit 1
fi

echo "✅ Current directory looks correct"
echo ""

# Check repository size
REPO_SIZE=$(du -sh . | cut -f1)
echo "📊 Repository size: $REPO_SIZE"
echo ""

# Add remote
echo "🔗 Adding GitHub remote..."
git remote add origin "$REPO_URL"

if [ $? -eq 0 ]; then
    echo "✅ Remote added successfully"
else
    echo "❌ Failed to add remote. URL might be incorrect."
    exit 1
fi

echo ""

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Repository pushed to GitHub!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Visit your GitHub repository: $REPO_URL"
    echo "2. Share the repository with your community"
    echo "3. Use the COMMUNITY_ANNOUNCEMENT.md for marketing"
    echo "4. Set up GitHub Actions for CI/CD"
    echo "5. Invite contributors and collaborators"
    echo ""
    echo "🎵 Your clean repository is now live and ready for collaboration!"
else
    echo ""
    echo "❌ Failed to push to GitHub. Please check:"
    echo "1. Your GitHub credentials are set up"
    echo "2. The repository URL is correct"
    echo "3. You have write access to the repository"
    exit 1
fi 