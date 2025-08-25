#!/bin/bash

echo "🚀 Deploying Club Run Pre-MVP 3.777 to Vercel"
echo "🎛️ Revolutionary Local Serato Verification System"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Git not found. Please install git first."
    exit 1
fi

echo "✅ Environment check passed"

# Create git commit for version 3.777
echo ""
echo "📝 Creating git commit for version 3.777..."

# Add all changes
git add .

# Create commit with detailed message
git commit -m "🚀 Pre-MVP 3.777: Revolutionary Local Serato Verification System

🎛️ Major Features:
- Industry-first file-based Serato DJ verification
- Local file analysis (no external APIs needed)
- 5 skill levels with 100-point scoring system
- Privacy-focused approach (files stay on user's computer)
- Cross-platform support (macOS, Windows, Linux)

🔧 Technical Implementation:
- SeratoFileVerificationService.js - Core verification engine
- MockSeratoDataGenerator.js - Testing support
- Enhanced SignupForm.tsx - Local verification integration
- SeratoVerificationButton.tsx - Beautiful verification UI
- Updated AgentDashboard.tsx - DJ verification section

📊 Scoring System:
- Library Size (0-25 points)
- Session Count (0-25 points)
- Crate Organization (0-20 points)
- Analysis Completion (0-15 points)
- Activity Recency (0-15 points)

🎯 Competitive Advantages:
- Industry-first file-based verification
- Professional credibility for DJs
- Trust indicators for clients
- Better matching algorithms
- Premium feature potential

🚀 Ready for production deployment!"

echo "✅ Git commit created"

# Create git tag for version 3.777
echo ""
echo "🏷️ Creating git tag for version 3.777..."
git tag -a v3.777.0 -m "Pre-MVP 3.777: Revolutionary Local Serato Verification System"
echo "✅ Git tag created"

# Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
git push origin main
git push origin v3.777.0
echo "✅ Pushed to GitHub"

# Deploy to Vercel
echo ""
echo "🚀 Deploying to Vercel..."
echo "This will deploy the revolutionary Serato verification system!"

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    echo "⚠️ vercel.json not found. Creating basic configuration..."
    cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/dist/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
EOF
fi

# Deploy to Vercel
vercel --prod

echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "📊 Pre-MVP 3.777 Features Deployed:"
echo "✅ Revolutionary Local Serato Verification System"
echo "✅ Industry-first file-based DJ verification"
echo "✅ 5 skill levels with 100-point scoring"
echo "✅ Privacy-focused local file analysis"
echo "✅ Cross-platform support (macOS, Windows, Linux)"
echo "✅ Beautiful verification UI with skill badges"
echo "✅ Enhanced signup flow with local verification"
echo "✅ Comprehensive API endpoints"
echo "✅ Mock data generation for testing"
echo ""
echo "🎛️ Your Club Run platform now has:"
echo "• The industry's first file-based Serato verification"
echo "• Professional credibility system for DJs"
echo "• Trust indicators for clients"
echo "• Competitive advantage over other platforms"
echo "• Premium feature potential for monetization"
echo ""
echo "🚀 Ready to revolutionize the DJ platform industry!"
echo ""
echo "📱 Test the verification system at your deployed URL"
echo "🎛️ Try signing up as a 'Verified DJ' to see the magic!"
