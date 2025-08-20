#!/bin/bash

echo "🚀 Setting up Club Run Next.js Application"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/club_run_db"

# NextAuth.js
NEXTAUTH_SECRET="club-run-nextjs-secret-key-2024-development"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Application
NODE_ENV="development"
EOF
    echo "✅ .env.local created successfully!"
else
    echo "✅ .env.local already exists"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

echo "📋 Setup Instructions:"
echo ""
echo "1. Update .env.local with your database credentials:"
echo "   - Set DATABASE_URL to your PostgreSQL connection string"
echo "   - Optionally add Google OAuth credentials"
echo ""
echo "2. Set up your database:"
echo "   npm run db:push    # Push schema to database"
echo "   npm run db:seed    # Seed with initial data"
echo ""
echo "3. Start the development server:"
echo "   npm run dev"
echo ""
echo "4. Default admin credentials (after seeding):"
echo "   Email: admin@clubrun.com"
echo "   Password: admin123"
echo ""
echo "🎉 Setup complete! Follow the instructions above to get started." 