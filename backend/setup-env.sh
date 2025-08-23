#!/bin/bash

# Club Run Environment Setup Script
echo "🚀 Setting up Club Run environment variables..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created! Please update with your actual values."
else
    echo "✅ .env file already exists."
fi

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "📝 Creating .env.production file from template..."
    cp env.production.example .env.production
    echo "✅ .env.production file created! Please update with your production values."
else
    echo "✅ .env.production file already exists."
fi

echo ""
echo "🔧 Next steps:"
echo "1. Update .env with your development values"
echo "2. Update .env.production with your production values"
echo "3. Run 'npm install' to install dependencies"
echo "4. Run 'npm run dev' to start development server"
echo ""
echo "📚 For production deployment:"
echo "- Update .env.production with real values"
echo "- Set up your database"
echo "- Configure your hosting platform" 