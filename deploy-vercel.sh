#!/bin/bash

# 🚀 Club Run - Vercel Deployment Script
# This script automates the deployment process to Vercel

set -e  # Exit on any error

echo "🚀 Starting Club Run Vercel Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    print_error "Please run this script from the Club Run project root directory"
    exit 1
fi

print_status "Checking prerequisites..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

print_success "Prerequisites check passed"

# Step 1: Install dependencies
print_status "Installing dependencies..."
npm install

print_status "Installing frontend dependencies..."
cd frontend
npm install
cd ..

print_success "Dependencies installed"

# Step 2: Build frontend
print_status "Building frontend..."
cd frontend
npm run build
cd ..

if [ ! -d "frontend/dist" ]; then
    print_error "Frontend build failed. Please check the build logs."
    exit 1
fi

print_success "Frontend built successfully"

# Step 3: Check if Vercel is linked
print_status "Checking Vercel project status..."
if ! vercel ls &> /dev/null; then
    print_warning "No Vercel project linked. You'll need to link or create a project."
    print_status "Running 'vercel' to link/create project..."
    vercel
else
    print_success "Vercel project is linked"
fi

# Step 4: Deploy to Vercel
print_status "Deploying to Vercel..."
vercel --prod

print_success "Deployment completed!"

# Step 5: Get deployment URL
print_status "Getting deployment URL..."
DEPLOYMENT_URL=$(vercel ls --json | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$DEPLOYMENT_URL" ]; then
    print_success "Your application is deployed at: $DEPLOYMENT_URL"
    echo ""
    echo "🔗 Quick Links:"
    echo "   Frontend: $DEPLOYMENT_URL"
    echo "   API Health: $DEPLOYMENT_URL/api/health"
    echo "   Demo Health: $DEPLOYMENT_URL/api/demo/health"
    echo ""
    echo "📋 Next Steps:"
    echo "   1. Configure environment variables in Vercel dashboard"
    echo "   2. Set up database (Supabase recommended)"
    echo "   3. Configure Google OAuth"
    echo "   4. Test all endpoints"
    echo ""
    echo "📚 Documentation:"
    echo "   - Vercel Dashboard: https://vercel.com/dashboard"
    echo "   - Environment Variables: https://vercel.com/docs/projects/environment-variables"
    echo "   - Database Setup: See VERCEL_DEPLOYMENT_GUIDE.md"
else
    print_warning "Could not determine deployment URL. Please check Vercel dashboard."
fi

print_success "🎉 Deployment script completed!"
echo ""
echo "💡 Tips:"
echo "   - Use 'vercel logs' to view deployment logs"
echo "   - Use 'vercel env ls' to list environment variables"
echo "   - Use 'vercel env add' to add environment variables"
echo "   - Check VERCEL_DEPLOYMENT_GUIDE.md for detailed setup instructions"
