#!/bin/bash

# Club Run Production Deployment Script
# This script sets up and deploys Club Run to production

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="club-run"
DOMAIN=${1:-"yourdomain.com"}
API_DOMAIN="api.${DOMAIN}"

echo -e "${BLUE}🚀 Club Run Production Deployment${NC}"
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
    
    # Check if running as root
    if [ "$EUID" -eq 0 ]; then
        print_warning "Running as root - this is not recommended for production"
    fi
    
    print_status "Prerequisites check passed"
}

# Generate secure passwords
generate_secrets() {
    print_status "Generating secure secrets..."
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        cp backend/env.production.example .env
        
        # Generate secure passwords
        POSTGRES_PASSWORD=$(openssl rand -base64 32)
        REDIS_PASSWORD=$(openssl rand -base64 32)
        JWT_SECRET=$(openssl rand -base64 64)
        GRAFANA_PASSWORD=$(openssl rand -base64 16)
        
        # Update .env file with generated secrets
        sed -i.bak "s/your_secure_password/$POSTGRES_PASSWORD/g" .env
        sed -i.bak "s/your_redis_password/$REDIS_PASSWORD/g" .env
        sed -i.bak "s/your-super-secure-jwt-secret-key-minimum-32-characters-change-this/$JWT_SECRET/g" .env
        sed -i.bak "s/admin/$GRAFANA_PASSWORD/g" .env
        sed -i.bak "s/yourdomain.com/$DOMAIN/g" .env
        sed -i.bak "s/api.yourdomain.com/$API_DOMAIN/g" .env
        
        print_status "Generated .env file with secure secrets"
    else
        print_warning ".env file already exists - skipping secret generation"
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

# Setup SSL certificates (Let's Encrypt)
setup_ssl() {
    print_status "Setting up SSL certificates..."
    
    if [ ! -f ssl/cert.pem ] || [ ! -f ssl/key.pem ]; then
        print_warning "SSL certificates not found"
        print_warning "Please obtain SSL certificates for $DOMAIN and $API_DOMAIN"
        print_warning "Place them in the ssl/ directory as cert.pem and key.pem"
        print_warning "For Let's Encrypt, you can use:"
        print_warning "certbot certonly --standalone -d $DOMAIN -d $API_DOMAIN"
    else
        print_status "SSL certificates found"
    fi
}

# Create Nginx configuration
create_nginx_config() {
    print_status "Creating Nginx configuration..."
    
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
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    server {
        listen 80;
        server_name $DOMAIN $API_DOMAIN;
        return 301 https://\$server_name\$request_uri;
    }
    
    server {
        listen 443 ssl http2;
        server_name $DOMAIN;
        
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        
        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
    }
    
    server {
        listen 443 ssl http2;
        server_name $API_DOMAIN;
        
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        
        # API rate limiting
        limit_req zone=api burst=20 nodelay;
        
        # Backend API
        location / {
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
    
    print_status "Nginx configuration created"
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
    docker-compose exec backend npx prisma migrate deploy
    
    # Generate Prisma client
    docker-compose exec backend npx prisma generate
    
    # Seed database (if needed)
    # docker-compose exec backend npm run seed
    
    print_status "Database setup completed"
}

# Create backup script
create_backup_script() {
    print_status "Creating backup script..."
    
    cat > backup.sh << 'EOF'
#!/bin/bash

# Club Run Backup Script
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Backup PostgreSQL
docker-compose exec -T postgres pg_dump -U clubrun clubrun > "$BACKUP_DIR/db_backup_$DATE.sql"

# Backup uploads
tar -czf "$BACKUP_DIR/uploads_backup_$DATE.tar.gz" uploads/

# Clean old backups (keep last 30 days)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
EOF
    
    chmod +x backup.sh
    print_status "Backup script created"
}

# Main deployment process
main() {
    echo -e "${BLUE}Starting Club Run production deployment...${NC}"
    
    check_prerequisites
    generate_secrets
    create_directories
    setup_ssl
    create_nginx_config
    create_monitoring_config
    deploy
    setup_database
    create_backup_script
    
    echo ""
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Configure your DNS to point $DOMAIN and $API_DOMAIN to this server"
    echo "2. Update Google OAuth settings with your domain"
    echo "3. Set up SSL certificates in the ssl/ directory"
    echo "4. Configure monitoring at http://localhost:9090 (Prometheus)"
    echo "5. Access Grafana at http://localhost:3002 (admin/password)"
    echo ""
    echo -e "${BLUE}Services:${NC}"
    echo "- Frontend: https://$DOMAIN"
    echo "- API: https://$API_DOMAIN"
    echo "- Health Check: https://$API_DOMAIN/health"
    echo ""
    echo -e "${BLUE}Useful commands:${NC}"
    echo "- View logs: docker-compose logs -f"
    echo "- Stop services: docker-compose down"
    echo "- Restart services: docker-compose restart"
    echo "- Create backup: ./backup.sh"
}

# Run main function
main "$@"
