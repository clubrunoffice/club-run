#!/bin/bash

echo "🚀 Club Run Vercel Deployment Fix Script"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found. Please run this script from the project root."
    exit 1
fi

echo "📦 Building frontend..."
cd club-run-clean/frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📥 Installing frontend dependencies..."
    npm install
fi

# Build the frontend
echo "🔨 Building frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

cd ../..

echo "🔧 Checking API configuration..."
# Test the API locally
echo "🧪 Testing API health endpoint..."
curl -s http://localhost:3001/api/health || echo "⚠️  API not running locally (this is OK for deployment)"

echo "🚀 Ready to deploy to Vercel!"
echo ""
echo "📋 Next steps:"
echo "1. Commit your changes:"
echo "   git add ."
echo "   git commit -m 'Fix Vercel deployment issues'"
echo ""
echo "2. Push to GitHub:"
echo "   git push origin main"
echo ""
echo "3. Vercel will automatically redeploy from the main branch"
echo ""
echo "🔍 To monitor deployment:"
echo "   - Check Vercel dashboard for build logs"
echo "   - Test the health endpoint: https://your-domain.vercel.app/api/health"
echo "   - Test the frontend: https://your-domain.vercel.app"
echo ""
echo "🎯 Expected fixes:"
echo "   ✅ Frontend build issues resolved"
echo "   ✅ API error handling improved"
echo "   ✅ CORS configuration updated"
echo "   ✅ Database connection errors handled gracefully"
echo "   ✅ Tailwind CSS configuration added"
echo "   ✅ Vite configuration optimized"
echo "   ✅ React Router SPA routing fixed"
echo "   ✅ Asset chunking and optimization"
echo ""
echo "🚨 BLANK SCREEN FIXES APPLIED:"
echo "   ✅ Added missing Vite configuration"
echo "   ✅ Fixed Tailwind CSS setup (35KB CSS vs 9KB before)"
echo "   ✅ Fixed Vercel routing for SPA (React Router)"
echo "   ✅ Proper asset path handling"
echo "   ✅ JavaScript chunking for better loading"
echo ""
echo "✨ Your Club Run homepage should now display correctly!"
