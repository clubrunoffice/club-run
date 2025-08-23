#!/bin/bash

# 🌐 Club Run P2P Mission System Deployment Script
# This script deploys the complete peer-to-peer mission system

set -e

echo "🚀 Starting Club Run P2P Mission System Deployment..."

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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16+ first."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check if Hardhat is available
    if ! command -v npx &> /dev/null; then
        print_error "npx is not available. Please install Node.js with npm."
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Deploy smart contracts
deploy_contracts() {
    print_status "Deploying smart contracts..."
    
    cd contracts
    
    # Install dependencies
    if [ ! -d "node_modules" ]; then
        print_status "Installing contract dependencies..."
        npm install
    fi
    
    # Compile contracts
    print_status "Compiling smart contracts..."
    npx hardhat compile
    
    # Check if we have deployment credentials
    if [ -z "$PRIVATE_KEY" ]; then
        print_warning "PRIVATE_KEY not set. Skipping contract deployment."
        print_warning "Please set PRIVATE_KEY environment variable to deploy contracts."
        cd ..
        return
    fi
    
    # Deploy to testnet first
    if [ ! -z "$DEPLOY_TO_TESTNET" ]; then
        print_status "Deploying to Mumbai testnet..."
        npx hardhat deploy --network mumbai
    fi
    
    # Deploy to mainnet if requested
    if [ ! -z "$DEPLOY_TO_MAINNET" ]; then
        print_warning "Deploying to Polygon mainnet..."
        read -p "Are you sure you want to deploy to mainnet? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npx hardhat deploy --network polygon
        fi
    fi
    
    cd ..
    print_success "Smart contract deployment completed"
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Install dependencies
    if [ ! -d "node_modules" ]; then
        print_status "Installing backend dependencies..."
        npm install
    fi
    
    # Run database migrations
    print_status "Running database migrations..."
    npx prisma migrate dev --name init
    
    # Generate Prisma client
    print_status "Generating Prisma client..."
    npx prisma generate
    
    # Seed database if needed
    if [ ! -z "$SEED_DATABASE" ]; then
        print_status "Seeding database..."
        npm run db:seed
    fi
    
    cd ..
    print_success "Backend setup completed"
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    # Build frontend
    print_status "Building frontend..."
    npm run build
    
    cd ..
    print_success "Frontend setup completed"
}

# Create environment files
create_env_files() {
    print_status "Creating environment files..."
    
    # Backend .env
    if [ ! -f "backend/.env" ]; then
        cat > backend/.env << EOF
# Database
DATABASE_URL="file:./dev.db"

# IPFS Configuration
IPFS_HOST="ipfs.infura.io"
IPFS_PORT=5001
IPFS_PROTOCOL="https"
INFURA_PROJECT_ID="your_infura_project_id"
INFURA_SECRET="your_infura_secret"

# Pinata (IPFS Backup)
PINATA_API_KEY="your_pinata_api_key"
PINATA_SECRET_KEY="your_pinata_secret_key"

# Smart Contract (Update after deployment)
ESCROW_CONTRACT_ADDRESS="0x..."
POLYGON_RPC_URL="https://polygon-rpc.com"

# JWT Secret
JWT_SECRET="your_jwt_secret_here"

# Server Configuration
PORT=3000
NODE_ENV=development
EOF
        print_success "Created backend/.env"
    fi
    
    # Frontend .env
    if [ ! -f "frontend/.env" ]; then
        cat > frontend/.env << EOF
# API Configuration
VITE_API_URL="http://localhost:3000"

# Smart Contract (Update after deployment)
VITE_ESCROW_CONTRACT_ADDRESS="0x..."
VITE_POLYGON_RPC_URL="https://polygon-rpc.com"

# IPFS Gateway
VITE_IPFS_GATEWAY="https://ipfs.io/ipfs/"
EOF
        print_success "Created frontend/.env"
    fi
    
    # Contract .env
    if [ ! -f "contracts/.env" ]; then
        cat > contracts/.env << EOF
# Deployment Configuration
PRIVATE_KEY="your_private_key_here"
POLYGON_RPC_URL="https://polygon-rpc.com"
MUMBAI_RPC_URL="https://rpc-mumbai.maticvigil.com"

# Etherscan API Key
POLYGONSCAN_API_KEY="your_polygonscan_api_key"

# Optional: CoinMarketCap for gas reporting
COINMARKETCAP_API_KEY="your_coinmarketcap_api_key"
EOF
        print_success "Created contracts/.env"
    fi
}

# Start development servers
start_development() {
    print_status "Starting development servers..."
    
    # Start backend
    print_status "Starting backend server..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    sleep 5
    
    # Start frontend
    print_status "Starting frontend server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    print_success "Development servers started"
    print_status "Backend: http://localhost:3000"
    print_status "Frontend: http://localhost:5173"
    print_status "P2P Missions: http://localhost:5173/p2p-missions"
    
    # Wait for user to stop
    echo
    print_warning "Press Ctrl+C to stop all servers"
    wait
}

# Main deployment function
main() {
    echo "🌐 Club Run P2P Mission System"
    echo "================================"
    echo
    
    # Check dependencies
    check_dependencies
    
    # Create environment files
    create_env_files
    
    # Setup backend
    setup_backend
    
    # Setup frontend
    setup_frontend
    
    # Deploy contracts (if credentials provided)
    deploy_contracts
    
    echo
    print_success "🎉 P2P Mission System setup completed!"
    echo
    
    print_status "Next steps:"
    echo "1. Update environment variables in .env files"
    echo "2. Deploy smart contracts (if not done already)"
    echo "3. Start development servers: ./deploy-p2p-system.sh --dev"
    echo "4. Visit http://localhost:5173/p2p-missions"
    echo
    
    # Start development if requested
    if [ "$1" = "--dev" ]; then
        start_development
    fi
}

# Handle command line arguments
case "$1" in
    --dev)
        main --dev
        ;;
    --testnet)
        DEPLOY_TO_TESTNET=true
        main
        ;;
    --mainnet)
        DEPLOY_TO_MAINNET=true
        main
        ;;
    --seed)
        SEED_DATABASE=true
        main
        ;;
    --help)
        echo "Usage: $0 [OPTIONS]"
        echo
        echo "Options:"
        echo "  --dev       Start development servers after setup"
        echo "  --testnet   Deploy contracts to Mumbai testnet"
        echo "  --mainnet   Deploy contracts to Polygon mainnet"
        echo "  --seed      Seed the database with sample data"
        echo "  --help      Show this help message"
        echo
        echo "Environment Variables:"
        echo "  PRIVATE_KEY           Private key for contract deployment"
        echo "  POLYGONSCAN_API_KEY   API key for contract verification"
        echo "  INFURA_PROJECT_ID     Infura project ID for IPFS"
        echo "  PINATA_API_KEY        Pinata API key for IPFS backup"
        ;;
    *)
        main
        ;;
esac
