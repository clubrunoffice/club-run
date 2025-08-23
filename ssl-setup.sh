#!/bin/bash

# Club Run SSL Certificate Setup Script
# This script automates SSL certificate setup using Let's Encrypt

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN=${1:-"yourdomain.com"}
API_DOMAIN="api.${DOMAIN}"
EMAIL=${2:-"admin@${DOMAIN}"}

echo -e "${BLUE}🔐 Club Run SSL Certificate Setup${NC}"
echo -e "${BLUE}Domain: ${DOMAIN}${NC}"
echo -e "${BLUE}API Domain: ${API_DOMAIN}${NC}"
echo -e "${BLUE}Email: ${EMAIL}${NC}"
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
    
    # Check if running as root (required for certbot)
    if [ "$EUID" -ne 0 ]; then
        print_error "This script must be run as root for Let's Encrypt certificate setup"
        print_error "Please run: sudo ./ssl-setup.sh ${DOMAIN} ${EMAIL}"
        exit 1
    fi
    
    # Check if certbot is installed
    if ! command -v certbot &> /dev/null; then
        print_status "Installing certbot..."
        if command -v apt-get &> /dev/null; then
            # Ubuntu/Debian
            apt-get update
            apt-get install -y certbot
        elif command -v yum &> /dev/null; then
            # CentOS/RHEL
            yum install -y certbot
        elif command -v brew &> /dev/null; then
            # macOS
            brew install certbot
        else
            print_error "Could not install certbot automatically"
            print_error "Please install certbot manually: https://certbot.eff.org/"
            exit 1
        fi
    fi
    
    # Check if nginx is installed
    if ! command -v nginx &> /dev/null; then
        print_warning "Nginx not found - will install as part of deployment"
    fi
    
    print_status "Prerequisites check passed"
}

# Create SSL directory structure
create_ssl_directories() {
    print_status "Creating SSL directories..."
    
    mkdir -p ssl
    mkdir -p ssl/backup
    mkdir -p ssl/renewal
    
    print_status "SSL directories created"
}

# Generate self-signed certificates (for testing)
generate_self_signed() {
    print_status "Generating self-signed certificates for testing..."
    
    # Generate private key
    openssl genrsa -out ssl/key.pem 2048
    
    # Generate certificate signing request
    cat > ssl/openssl.conf << EOF
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = US
ST = Georgia
L = Atlanta
O = Club Run
OU = IT Department
CN = ${DOMAIN}

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = ${DOMAIN}
DNS.2 = ${API_DOMAIN}
DNS.3 = *.${DOMAIN}
EOF
    
    # Generate certificate
    openssl req -new -x509 -key ssl/key.pem -out ssl/cert.pem -days 365 -config ssl/openssl.conf
    
    # Set permissions
    chmod 600 ssl/key.pem
    chmod 644 ssl/cert.pem
    
    print_status "Self-signed certificates generated"
    print_warning "These are for testing only - not suitable for production"
}

# Setup Let's Encrypt certificates
setup_lets_encrypt() {
    print_status "Setting up Let's Encrypt certificates..."
    
    # Stop nginx if running (required for standalone mode)
    if systemctl is-active --quiet nginx; then
        print_status "Stopping nginx for certificate generation..."
        systemctl stop nginx
    fi
    
    # Generate certificates using standalone mode
    certbot certonly \
        --standalone \
        --email ${EMAIL} \
        --agree-tos \
        --no-eff-email \
        --domains ${DOMAIN},${API_DOMAIN} \
        --cert-path /etc/letsencrypt/live/${DOMAIN}/cert.pem \
        --key-path /etc/letsencrypt/live/${DOMAIN}/privkey.pem
    
    # Copy certificates to our ssl directory
    if [ -f "/etc/letsencrypt/live/${DOMAIN}/cert.pem" ]; then
        cp /etc/letsencrypt/live/${DOMAIN}/cert.pem ssl/cert.pem
        cp /etc/letsencrypt/live/${DOMAIN}/privkey.pem ssl/key.pem
        
        # Set permissions
        chmod 644 ssl/cert.pem
        chmod 600 ssl/key.pem
        
        print_status "Let's Encrypt certificates installed"
        print_status "Certificate expires: $(openssl x509 -in ssl/cert.pem -text -noout | grep 'Not After')"
    else
        print_error "Certificate generation failed"
        exit 1
    fi
}

# Setup automatic renewal
setup_renewal() {
    print_status "Setting up automatic certificate renewal..."
    
    # Create renewal script
    cat > ssl/renew-certs.sh << 'EOF'
#!/bin/bash

# Club Run Certificate Renewal Script
set -e

DOMAIN="yourdomain.com"
SSL_DIR="/path/to/club-run/ssl"

# Renew certificates
certbot renew --quiet

# Copy renewed certificates
if [ -f "/etc/letsencrypt/live/${DOMAIN}/cert.pem" ]; then
    cp /etc/letsencrypt/live/${DOMAIN}/cert.pem ${SSL_DIR}/cert.pem
    cp /etc/letsencrypt/live/${DOMAIN}/privkey.pem ${SSL_DIR}/key.pem
    
    # Reload nginx
    if systemctl is-active --quiet nginx; then
        systemctl reload nginx
    fi
    
    echo "$(date): Certificates renewed successfully" >> ${SSL_DIR}/renewal.log
fi
EOF
    
    # Update domain in renewal script
    sed -i "s/yourdomain.com/${DOMAIN}/g" ssl/renew-certs.sh
    sed -i "s|/path/to/club-run|$(pwd)|g" ssl/renew-certs.sh
    
    chmod +x ssl/renew-certs.sh
    
    # Add to crontab for automatic renewal
    (crontab -l 2>/dev/null; echo "0 12 * * * ${PWD}/ssl/renew-certs.sh") | crontab -
    
    print_status "Automatic renewal configured (daily at 12:00 PM)"
}

# Verify certificates
verify_certificates() {
    print_status "Verifying certificates..."
    
    if [ -f "ssl/cert.pem" ] && [ -f "ssl/key.pem" ]; then
        # Check certificate validity
        if openssl x509 -checkend 86400 -noout -in ssl/cert.pem; then
            print_status "Certificate is valid and not expiring soon"
        else
            print_warning "Certificate is expiring soon or invalid"
        fi
        
        # Check certificate details
        echo ""
        echo "Certificate Details:"
        echo "===================="
        openssl x509 -in ssl/cert.pem -text -noout | grep -E "(Subject:|DNS:|Not After)"
        echo ""
        
        print_status "Certificate verification completed"
    else
        print_error "Certificate files not found"
        exit 1
    fi
}

# Create SSL configuration for nginx
create_nginx_ssl_config() {
    print_status "Creating nginx SSL configuration..."
    
    cat > ssl/nginx-ssl.conf << EOF
# SSL Configuration for Club Run
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;

# Security headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";

# Certificate files
ssl_certificate /etc/nginx/ssl/cert.pem;
ssl_certificate_key /etc/nginx/ssl/key.pem;
EOF
    
    print_status "Nginx SSL configuration created"
}

# Main setup process
main() {
    echo -e "${BLUE}Starting SSL certificate setup...${NC}"
    
    check_prerequisites
    create_ssl_directories
    
    # Ask user for certificate type
    echo ""
    echo "Choose certificate type:"
    echo "1. Let's Encrypt (recommended for production)"
    echo "2. Self-signed (for testing only)"
    echo "3. Manual (you provide certificates)"
    read -p "Enter choice (1-3): " choice
    
    case $choice in
        1)
            setup_lets_encrypt
            setup_renewal
            ;;
        2)
            generate_self_signed
            ;;
        3)
            print_warning "Please place your certificates in the ssl/ directory:"
            print_warning "  - ssl/cert.pem (certificate)"
            print_warning "  - ssl/key.pem (private key)"
            print_warning "Then run this script again to verify them."
            exit 0
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
    
    verify_certificates
    create_nginx_ssl_config
    
    echo ""
    echo -e "${GREEN}🎉 SSL certificate setup completed!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Deploy to production: ./deploy-production.sh ${DOMAIN}"
    echo "2. Test SSL: curl -I https://${DOMAIN}"
    echo "3. Monitor certificate expiration"
    echo ""
    echo -e "${BLUE}Certificate files:${NC}"
    echo "- Certificate: ssl/cert.pem"
    echo "- Private key: ssl/key.pem"
    echo "- Renewal script: ssl/renew-certs.sh"
    echo ""
    echo -e "${BLUE}Automatic renewal:${NC}"
    echo "- Configured to run daily at 12:00 PM"
    echo "- Logs: ssl/renewal.log"
}

# Run main function
main "$@"
