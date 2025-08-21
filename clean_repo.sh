#!/bin/bash

echo "🧹 Starting repository cleanup process..."
echo "📋 This will remove large files from Git history to make the repo GitHub-compatible"

# Create a mirror of the repository for BFG to work with
echo "📦 Creating repository mirror..."
git clone --mirror . ../club-run-mirror

# Navigate to the mirror
cd ../club-run-mirror

echo "🗑️  Removing large files from Git history..."

# Remove node_modules directories and their contents
bfg --delete-folders node_modules

# Remove .next directories (Next.js build cache)
bfg --delete-folders .next

# Remove specific large files we identified
bfg --delete-files "*.node"
bfg --delete-files "*.pack"
bfg --delete-files "*.pack.gz"

# Clean up the repository
echo "🧽 Cleaning up repository..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo "✅ Repository cleanup complete!"
echo "📁 Cleaned repository is in: ../club-run-mirror"
echo ""
echo "🔄 To apply the cleaned history to your original repo:"
echo "   cd ../club-run-mirror"
echo "   git push --mirror"
echo ""
echo "⚠️  WARNING: This will rewrite Git history. Make sure to:"
echo "   1. Backup your current repo (already done)"
echo "   2. Coordinate with your team"
echo "   3. Force push to GitHub after cleanup" 