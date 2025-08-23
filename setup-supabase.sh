#!/bin/bash

# Club Run Supabase Setup Script
set -e

echo "🚀 Club Run Supabase Setup"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

print_status "Setting up Supabase for Club Run..."

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the Club Run root directory"
    exit 1
fi

# Create Supabase configuration
print_status "Creating Supabase configuration..."

# Update backend .env with Supabase placeholders
if [ -f "backend/.env" ]; then
    # Backup original .env
    cp backend/.env backend/.env.backup
    
    # Add Supabase configuration
    cat >> backend/.env << EOF

# Supabase Configuration
SUPABASE_URL="your-supabase-project-url"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Update DATABASE_URL to use Supabase
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
EOF
    
    print_success "Updated backend/.env with Supabase configuration"
else
    print_error "backend/.env not found"
    exit 1
fi

print_status "Next steps:"
echo ""
echo "1. Go to https://supabase.com and create a new project"
echo "2. Get your project URL and API keys from Settings > API"
echo "3. Update the following in backend/.env:"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "   - DATABASE_URL (use the connection string from Supabase)"
echo ""
echo "4. Run the database migration:"
echo "   cd backend && npx prisma db push"
echo ""
echo "5. Restart the backend server:"
echo "   cd backend && npm run dev"
echo ""

print_success "Supabase setup script completed!"
print_warning "Remember to update the environment variables with your actual Supabase credentials"
