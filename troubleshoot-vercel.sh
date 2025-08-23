#!/bin/bash

# Club Run Vercel Deployment Troubleshooting Script
echo "🔍 Club Run Vercel Deployment Troubleshooting"
echo "=============================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
else
    echo "✅ Vercel CLI is installed"
fi

# Check project structure
echo ""
echo "📁 Checking project structure..."
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json found"
else
    echo "❌ vercel.json missing"
fi

if [ -f "frontend/package.json" ]; then
    echo "✅ Frontend package.json found"
else
    echo "❌ Frontend package.json missing"
fi

if [ -f "backend/package.json" ]; then
    echo "✅ Backend package.json found"
else
    echo "❌ Backend package.json missing"
fi

# Check for common issues
echo ""
echo "🔧 Checking for common issues..."

# Check if .env files exist
if [ -f "backend/.env" ]; then
    echo "✅ Backend .env found"
else
    echo "⚠️  Backend .env missing (will use Vercel env vars)"
fi

if [ -f "frontend/.env" ]; then
    echo "✅ Frontend .env found"
else
    echo "⚠️  Frontend .env missing (will use Vercel env vars)"
fi

# Check build scripts
echo ""
echo "📦 Checking build scripts..."
if grep -q "build" frontend/package.json; then
    echo "✅ Frontend build script found"
else
    echo "❌ Frontend build script missing"
fi

if grep -q "vercel-build" frontend/package.json; then
    echo "✅ Frontend vercel-build script found"
else
    echo "❌ Frontend vercel-build script missing"
fi

# Check dependencies
echo ""
echo "📋 Checking dependencies..."
if [ -f "frontend/node_modules" ]; then
    echo "✅ Frontend node_modules found"
else
    echo "⚠️  Frontend node_modules missing - run: cd frontend && npm install"
fi

if [ -f "backend/node_modules" ]; then
    echo "✅ Backend node_modules found"
else
    echo "⚠️  Backend node_modules missing - run: cd backend && npm install"
fi

# Test local builds
echo ""
echo "🧪 Testing local builds..."

echo "Testing frontend build..."
cd frontend
if npm run build; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
fi
cd ..

echo "Testing backend build..."
cd backend
if npm run build; then
    echo "✅ Backend build successful"
else
    echo "❌ Backend build failed"
fi
cd ..

# Check Vercel project status
echo ""
echo "🚀 Checking Vercel project status..."
if [ -f ".vercel/project.json" ]; then
    echo "✅ Vercel project configured"
    PROJECT_ID=$(cat .vercel/project.json | grep -o '"projectId":"[^"]*"' | cut -d'"' -f4)
    echo "   Project ID: $PROJECT_ID"
else
    echo "❌ Vercel project not configured"
    echo "   Run: vercel link"
fi

echo ""
echo "📝 Next Steps:"
echo "1. Add environment variables to Vercel dashboard"
echo "2. Disable deployment protection in Vercel settings"
echo "3. Deploy with: vercel --prod"
echo "4. Test endpoints after deployment"
echo ""
echo "📚 For more help, see: vercel-env-template.md" 