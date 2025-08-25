#!/bin/bash

echo "🎛️ Setting up Serato File Verification Testing"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install fs-extra

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Run the test
echo ""
echo "🧪 Running Serato verification tests..."
node test-serato-verification.js

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Testing completed successfully!"
    echo ""
    echo "📝 Next Steps:"
    echo "1. Add the verification component to your DJ dashboard"
    echo "2. Register the API routes in your server"
    echo "3. Update your database schema"
    echo "4. Test with real Serato installation (optional)"
else
    echo ""
    echo "❌ Testing failed. Please check the error messages above."
    exit 1
fi
