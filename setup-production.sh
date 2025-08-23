#!/bin/bash

# Club Run Production Setup Script
# This script helps you set up the production environment

echo "🚀 Club Run Production Setup"
echo "============================"

# Fix PATH for Vercel CLI
export PATH="/usr/local/Cellar/node/24.3.0/bin:$PATH"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
    export PATH="/usr/local/Cellar/node/24.3.0/bin:$PATH"
fi

echo "✅ Vercel CLI version: $(vercel --version)"

# Check if user is logged into Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel:"
    vercel login
fi

echo ""
echo "📋 Production Setup Checklist:"
echo "=============================="
echo ""
echo "1. 🗄️  Database Setup:"
echo "   - Choose a database provider (Supabase recommended)"
echo "   - Create your production database"
echo "   - Get your DATABASE_URL"
echo ""
echo "2. 🔑 Environment Variables:"
echo "   - Set up your Vercel project"
echo "   - Add all required environment variables"
echo "   - Configure production secrets"
echo ""
echo "3. 🚀 Deployment:"
echo "   - Deploy to Vercel"
echo "   - Test your production endpoints"
echo "   - Verify functionality"
echo ""

# Ask user if they want to proceed with deployment
read -p "Do you want to proceed with Vercel deployment? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting Vercel deployment..."
    
    # Check if we're in the right directory
    if [ ! -f "vercel.json" ]; then
        echo "❌ Error: vercel.json not found. Make sure you're in the Club Run root directory."
        exit 1
    fi
    
    # Deploy to Vercel
    echo "📦 Deploying to Vercel..."
    vercel --prod
    
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "🔧 Next Steps:"
    echo "1. Go to your Vercel dashboard"
    echo "2. Add your environment variables"
    echo "3. Test your production endpoints"
    echo "4. Set up your database"
    echo ""
    echo "📖 For detailed instructions, see: PRODUCTION_SETUP_GUIDE.md"
    
else
    echo "⏸️  Deployment skipped."
    echo ""
    echo "📖 Please review PRODUCTION_SETUP_GUIDE.md for manual setup instructions."
fi

echo ""
echo "🎯 Quick Commands:"
echo "=================="
echo "• View production guide: cat PRODUCTION_SETUP_GUIDE.md"
echo "• Deploy manually: ./deploy.sh deploy-vercel"
echo "• Test demo locally: ./deploy.sh demo"
echo "• Check health: curl http://localhost:3005/demo/health" 