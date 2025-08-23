#!/bin/bash

# Club Run Development Deployment Script
# This script sets up Club Run for development/testing without SSL

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN=${1:-"localhost"}
API_DOMAIN="api.${DOMAIN}"

echo -e "${BLUE}🚀 Club Run Development Deployment${NC}"
echo -e "${BLUE}Domain: ${DOMAIN}${NC}"
echo -e "${BLUE}API Domain: ${API_DOMAIN}${NC}"
echo ""

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running"
        print_error "Please start Docker Desktop and try again"
        exit 1
    fi
    
    print_status "Prerequisites check passed"
}

# Generate development environment
generate_dev_environment() {
    print_status "Generating development environment..."
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        cp backend/env.production.example .env
        
        # Generate development passwords
        POSTGRES_PASSWORD="dev_password_123"
        REDIS_PASSWORD="dev_redis_123"
        JWT_SECRET="dev-jwt-secret-key-for-development-only"
        GRAFANA_PASSWORD="admin"
        
        # Update .env file with development values
        sed -i.bak "s/your_secure_password/$POSTGRES_PASSWORD/g" .env
        sed -i.bak "s/your_redis_password/$REDIS_PASSWORD/g" .env
        sed -i.bak "s/your-super-secure-jwt-secret-key-minimum-32-characters-change-this/$JWT_SECRET/g" .env
        sed -i.bak "s/admin/$GRAFANA_PASSWORD/g" .env
        sed -i.bak "s/yourdomain.com/$DOMAIN/g" .env
        sed -i.bak "s/api.yourdomain.com/$API_DOMAIN/g" .env
        sed -i.bak "s/NODE_ENV=production/NODE_ENV=development/g" .env
        
        print_status "Generated .env file with development settings"
    else
        print_warning ".env file already exists - using existing configuration"
    fi
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p logs/nginx
    mkdir -p uploads
    mkdir -p backups
    mkdir -p ssl
    mkdir -p monitoring
    
    print_status "Directories created"
}

# Create development nginx configuration (HTTP only)
create_dev_nginx_config() {
    print_status "Creating development Nginx configuration..."
    
    cat > nginx.conf << EOF
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }
    
    upstream backend {
        server backend:3001;
    }
    
    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone \$binary_remote_addr zone=login:10m rate=5r/m;
    
    server {
        listen 80;
        server_name $DOMAIN $API_DOMAIN localhost;
        
        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
        
        # API rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            
            # WebSocket support
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection "upgrade";
        }
        
        # Login rate limiting
        location /api/auth/login {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
    }
}
EOF
    
    print_status "Development Nginx configuration created"
}

# Create monitoring configuration
create_monitoring_config() {
    print_status "Creating monitoring configuration..."
    
    # Prometheus configuration
    cat > monitoring/prometheus.yml << EOF
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'clubrun-backend'
    static_configs:
      - targets: ['backend:3001']
    metrics_path: '/metrics'
    
  - job_name: 'clubrun-postgres'
    static_configs:
      - targets: ['postgres:5432']
    
  - job_name: 'clubrun-redis'
    static_configs:
      - targets: ['redis:6379']
EOF
    
    print_status "Monitoring configuration created"
}

# Build and deploy
deploy() {
    print_status "Building and deploying services..."
    
    # Build images
    docker-compose build --no-cache
    
    # Start services
    docker-compose up -d
    
    # Wait for services to be healthy
    print_status "Waiting for services to be healthy..."
    sleep 30
    
    # Check service health
    if docker-compose ps | grep -q "unhealthy"; then
        print_error "Some services are unhealthy"
        docker-compose ps
        exit 1
    fi
    
    print_status "All services are healthy"
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Wait for database to be ready
    sleep 10
    
    # Run migrations
    docker-compose exec backend npx prisma migrate deploy || print_warning "Migrations failed - database might not be ready yet"
    
    # Generate Prisma client
    docker-compose exec backend npx prisma generate || print_warning "Prisma generate failed"
    
    print_status "Database setup completed"
}

# Test endpoints
test_endpoints() {
    print_status "Testing API endpoints..."
    
    # Wait for services to be ready
    sleep 10
    
    # Test health endpoint
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        print_status "Health endpoint working"
    else
        print_warning "Health endpoint not responding yet"
    fi
    
    # Test API health
    if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
        print_status "API health endpoint working"
    else
        print_warning "API health endpoint not responding yet"
    fi
    
    # Test auth health
    if curl -f http://localhost:3001/api/auth/health > /dev/null 2>&1; then
        print_status "Auth health endpoint working"
    else
        print_warning "Auth health endpoint not responding yet"
    fi
}

# Main deployment process
main() {
    echo -e "${BLUE}Starting Club Run development deployment...${NC}"
    
    check_prerequisites
    generate_dev_environment
    create_directories
    create_dev_nginx_config
    create_monitoring_config
    deploy
    setup_database
    test_endpoints
    
    echo ""
    echo -e "${GREEN}🎉 Development deployment completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}Services:${NC}"
    echo "- Frontend: http://localhost:3000"
    echo "- Backend API: http://localhost:3001"
    echo "- Health Check: http://localhost:3001/health"
    echo "- API Health: http://localhost:3001/api/health"
    echo "- Auth Health: http://localhost:3001/api/auth/health"
    echo ""
    echo -e "${BLUE}Monitoring (optional):${NC}"
    echo "- Prometheus: http://localhost:9090"
    echo "- Grafana: http://localhost:3002 (admin/admin)"
    echo ""
    echo -e "${BLUE}Useful commands:${NC}"
    echo "- View logs: docker-compose logs -f"
    echo "- Stop services: docker-compose down"
    echo "- Restart services: docker-compose restart"
    echo "- Test OAuth: node test-google-oauth.js"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Test the API endpoints using the documentation"
    echo "2. Set up Google OAuth credentials for full functionality"
    echo "3. Deploy to production with SSL: ./deploy-production.sh yourdomain.com"
}

# Run main function
main "$@"
