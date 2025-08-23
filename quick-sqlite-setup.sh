#!/bin/bash

# Quick SQLite Setup for Club Run Development
set -e

echo "🚀 Quick SQLite Setup for Club Run"
echo "==================================="

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

print_status "Setting up SQLite for immediate development..."

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    print_error "Please run this script from the Club Run root directory"
    exit 1
fi

cd backend

# Backup original schema
if [ -f "prisma/schema.prisma" ]; then
    cp prisma/schema.prisma prisma/schema.prisma.backup
    print_status "Backed up original Prisma schema"
fi

# Update schema to use SQLite
print_status "Updating Prisma schema to use SQLite..."

# Create temporary schema with SQLite
cat > prisma/schema.sqlite.prisma << 'EOF'
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

// Role field for automatic role assignment (SQLite doesn't support enums)
model User {
  id               String    @id @default(cuid())
  email            String    @unique
  passwordHash     String?
  name             String
  googleId         String?   @unique
  avatar           String?
  walletAddress    String?   @unique
  role             String    @default("RUNNER") // GUEST, RUNNER, CLIENT, OPERATIONS, PARTNER, ADMIN
  tokenBalance     Int       @default(0)
  currentStreak    Int       @default(0)
  totalCheckIns    Int       @default(0)
  missionsCompleted Int      @default(0)
  level            String    @default("Navigator")
  theme            String    @default("dark")
  badges           String
  isActive         Boolean   @default(true)
  lastLoginAt      DateTime?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  
  // Relations
  checkIns         CheckIn[]
  userMissions     UserMission[]
  expenses         Expense[]
  chatMessages     ChatMessage[]
  sessions         UserSession[]
  
  @@map("users")
}

model UserSession {
  id          String   @id @default(cuid())
  userId      String
  token       String   @unique
  expiresAt   DateTime
  userAgent   String?
  ipAddress   String?
  createdAt   DateTime @default(now())
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("user_sessions")
}

model Venue {
  id              String   @id @default(cuid())
  name            String
  address         String
  city            String   @default("Atlanta")
  state           String   @default("GA")
  zipCode         String?
  latitude        Float?
  longitude       Float?
  type            String
  hours           String
  phoneNumber     String?
  website         String?
  checkInReward   Int
  status          String   @default("open")
  crowdLevel      String   @default("Medium")
  safetyRating    Float    @default(4.0)
  avgCost         Int
  specialMissions String
  amenities       String
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  checkIns        CheckIn[]
  expenses        Expense[]
  
  @@map("venues")
}

model CheckIn {
  id          String   @id @default(cuid())
  userId      String
  venueId     String
  timestamp   DateTime @default(now())
  location    String?
  notes       String?
  photos      String?
  rating      Int?
  isVerified  Boolean  @default(false)
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  venue       Venue    @relation(fields: [venueId], references: [id], onDelete: Cascade)
  
  @@map("check_ins")
}

model Mission {
  id              String   @id @default(cuid())
  title           String
  description     String
  type            String   // research, checkin, social, creative
  difficulty      String   @default("Easy") // Easy, Medium, Hard
  reward          Int
  requirements    String
  deadline        DateTime?
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  userMissions    UserMission[]
  
  @@map("missions")
}

model UserMission {
  id          String   @id @default(cuid())
  userId      String
  missionId   String
  status      String   @default("assigned") // assigned, in_progress, completed, failed
  startedAt   DateTime @default(now())
  completedAt DateTime?
  notes       String?
  evidence    String?
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  mission     Mission  @relation(fields: [missionId], references: [id], onDelete: Cascade)
  
  @@map("user_missions")
}

model Expense {
  id          String   @id @default(cuid())
  userId      String
  venueId     String?
  amount      Float
  category    String
  description String
  date        DateTime @default(now())
  receipt     String?
  isReimbursed Boolean @default(false)
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  venue       Venue?   @relation(fields: [venueId], references: [id], onDelete: SetNull)
  
  @@map("expenses")
}

model ChatMessage {
  id          String   @id @default(cuid())
  userId      String
  content     String
  type        String   @default("text") // text, image, location
  timestamp   DateTime @default(now())
  isRead      Boolean  @default(false)
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("chat_messages")
}
EOF

# Replace the schema
mv prisma/schema.sqlite.prisma prisma/schema.prisma

# Update .env to use SQLite
print_status "Updating environment to use SQLite..."

# Update DATABASE_URL in .env
sed -i.bak 's|DATABASE_URL="postgresql://.*"|DATABASE_URL="file:./dev.db"|' .env

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Push schema to database
print_status "Creating SQLite database..."
npx prisma db push

# Seed database if seed script exists
if [ -f "prisma/seed.js" ]; then
    print_status "Seeding database..."
    npx prisma db seed
fi

print_success "SQLite setup completed!"
print_status "Database file created at: backend/dev.db"

# Test the connection
print_status "Testing database connection..."
if curl -s http://localhost:3001/health | grep -q "healthy"; then
    print_success "Database connection successful!"
else
    print_warning "Database connection test failed. Restart the backend server:"
    echo "  npm run dev"
fi

print_status "Next steps:"
echo ""
echo "1. Restart the backend server:"
echo "   npm run dev"
echo ""
echo "2. Test the API:"
echo "   curl http://localhost:3001/health"
echo ""
echo "3. When ready for production, switch to Supabase:"
echo "   See SUPABASE_SETUP_GUIDE.md"
echo ""

cd ..

print_success "Quick SQLite setup completed! 🎉"
