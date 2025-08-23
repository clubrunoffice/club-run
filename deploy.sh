#!/bin/bash

# Club Run Deployment Script
set -e

echo "🚀 Club Run Deployment Script"
echo "=============================="

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
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the Club Run root directory"
    exit 1
fi

# Function to setup environment
setup_environment() {
    print_status "Setting up environment variables..."
    
    cd backend
    if [ ! -f .env ]; then
        cp env.example .env
        print_warning "Created .env file. Please update with your actual values."
    fi
    
    if [ ! -f .env.production ]; then
        cp env.production.example .env.production
        print_warning "Created .env.production file. Please update with your production values."
    fi
    cd ..
    
    print_success "Environment setup complete"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Backend dependencies
    cd backend
    npm install
    cd ..
    
    # Frontend dependencies
    cd frontend
    npm install
    cd ..
    
    print_success "Dependencies installed"
}

# Function to build frontend
build_frontend() {
    print_status "Building frontend..."
    
    cd frontend
    npm run build
    cd ..
    
    print_success "Frontend built successfully"
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    cd backend
    if npm test; then
        print_success "Backend tests passed"
    else
        print_error "Backend tests failed"
        exit 1
    fi
    cd ..
}

# Function to deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if command -v vercel &> /dev/null; then
        vercel --prod
        print_success "Deployed to Vercel"
    else
        print_error "Vercel CLI not found. Install with: npm i -g vercel"
        exit 1
    fi
}

# Function to deploy to Netlify
deploy_netlify() {
    print_status "Deploying to Netlify..."
    
    if command -v netlify &> /dev/null; then
        netlify deploy --prod --dir=frontend/dist
        print_success "Deployed to Netlify"
    else
        print_error "Netlify CLI not found. Install with: npm i -g netlify-cli"
        exit 1
    fi
}

# Function to run development server
run_dev() {
    print_status "Starting development servers..."
    
    # Start backend in background
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Start frontend
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    print_success "Development servers started"
    print_status "Backend: http://localhost:3001"
    print_status "Frontend: http://localhost:3000"
    print_status "Press Ctrl+C to stop servers"
    
    # Wait for user to stop
    wait $BACKEND_PID $FRONTEND_PID
}

# Function to run the demo
run_demo() {
    print_status "Running demo enhanced flow..."
    
    cd backend
    PORT=3005 node demo-enhanced-flow.js
    cd ..
}

# Main script logic
case "${1:-help}" in
    "setup")
        setup_environment
        install_dependencies
        ;;
    "install")
        install_dependencies
        ;;
    "build")
        build_frontend
        ;;
    "test")
        run_tests
        ;;
    "dev")
        run_dev
        ;;
    "demo")
        run_demo
        ;;
    "deploy-vercel")
        setup_environment
        install_dependencies
        build_frontend
        deploy_vercel
        ;;
    "deploy-netlify")
        setup_environment
        install_dependencies
        build_frontend
        deploy_netlify
        ;;
    "full-deploy")
        setup_environment
        install_dependencies
        build_frontend
        run_tests
        deploy_vercel
        deploy_netlify
        ;;
    "help"|*)
        echo "Usage: $0 {setup|install|build|test|dev|demo|deploy-vercel|deploy-netlify|full-deploy}"
        echo ""
        echo "Commands:"
        echo "  setup           - Setup environment and install dependencies"
        echo "  install         - Install dependencies only"
        echo "  build           - Build frontend for production"
        echo "  test            - Run tests"
        echo "  dev             - Start development servers"
        echo "  demo            - Run the demo enhanced flow"
        echo "  deploy-vercel   - Deploy to Vercel"
        echo "  deploy-netlify  - Deploy to Netlify"
        echo "  full-deploy     - Deploy to both Vercel and Netlify"
        echo "  help            - Show this help message"
        ;;
esac 