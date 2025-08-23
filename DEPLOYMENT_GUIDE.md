# Club Run Deployment Guide

This guide covers setting up environment variables, deploying to production, and integrating with your existing frontend.

## 🚀 Quick Start

### 1. Environment Setup

First, set up your environment variables:

```bash
# Make the setup script executable
chmod +x backend/setup-env.sh
chmod +x deploy.sh

# Run the setup script
./deploy.sh setup
```

This will create:
- `backend/.env` - Development environment variables
- `backend/.env.production` - Production environment variables

### 2. Install Dependencies

```bash
# Install all dependencies
./deploy.sh install
```

### 3. Run the Demo

```bash
# Run the demo enhanced flow
./deploy.sh demo
```

The demo will be available at `http://localhost:3005`

## 🔧 Environment Variables

### Backend Environment Variables

Update `backend/.env` with your actual values:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/clubrun"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# AI Services
OPENAI_API_KEY="your-openai-api-key"
OPENROUTER_API_KEY="your-openrouter-api-key"
AI_MODEL="gpt-4o-mini"

# Google Services
GOOGLE_SERVICE_ACCOUNT_KEY_FILE="path/to/service-account-key.json"
REPORTING_SHEET_ID="your-google-sheet-id-for-reporting"

# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# App Config
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:3000"

# Optional Services
REDIS_URL="redis://localhost:6379"
LOG_LEVEL="info"
```

### Frontend Environment Variables

Create `frontend/.env`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=10000

# Environment
VITE_NODE_ENV=development

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=true

# External Services
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# App Configuration
VITE_APP_NAME="Club Run"
VITE_APP_VERSION="1.0.0-pre"
VITE_APP_DESCRIPTION="AI-Powered Nightlife Operations Platform"
```

## 🐳 Docker Development

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Services Available

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🚀 Production Deployment

### Option 1: Vercel Deployment

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   ./deploy.sh deploy-vercel
   ```

3. **Set Environment Variables in Vercel Dashboard**:
   - Go to your project settings
   - Add all production environment variables
   - Redeploy

### Option 2: Netlify Deployment

1. **Install Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy to Netlify**:
   ```bash
   ./deploy.sh deploy-netlify
   ```

3. **Set Environment Variables in Netlify Dashboard**:
   - Go to Site settings > Environment variables
   - Add all production environment variables
   - Redeploy

### Option 3: Docker Production

1. **Build and run with Docker**:
   ```bash
   # Build the production image
   docker build -t clubrun:latest .

   # Run the container
   docker run -d \
     --name clubrun \
     -p 3001:3001 \
     --env-file backend/.env.production \
     clubrun:latest
   ```

2. **Using Docker Compose for production**:
   ```bash
   docker-compose --profile production up -d
   ```

## 🔗 Frontend Integration

### API Service Usage

The frontend includes a comprehensive API service for backend integration:

```typescript
import { apiService } from '../services/api';

// Authentication
const loginResponse = await apiService.login(email, password);
const registerResponse = await apiService.register(email, password, name);

// Venue research
const venueData = await apiService.researchVenue(address);

// Mission management
const missions = await apiService.getMissions();
const newMission = await apiService.createMission(missionData);

// Demo endpoints
const health = await apiService.getDemoHealth();
const demoResearch = await apiService.demoResearch(address);
```

### Environment Configuration

The frontend automatically configures itself based on the environment:

```typescript
import { config, isDevelopment, isProduction } from '../config/environment';

// Check environment
if (isDevelopment()) {
  console.log('Running in development mode');
}

// Use configuration
const apiUrl = config.apiBaseUrl;
```

## 📊 Monitoring and Health Checks

### Health Check Endpoints

- **Backend Health**: `GET /health`
- **Demo Health**: `GET /demo/health`

### Logging

The application uses structured logging with different levels:

```env
LOG_LEVEL="info"  # debug, info, warn, error
```

### Performance Monitoring

For production, consider adding:

- **Sentry** for error tracking
- **New Relic** for performance monitoring
- **Prometheus** for metrics collection

## 🔒 Security Considerations

### Production Security Checklist

- [ ] Use strong JWT secrets
- [ ] Enable HTTPS
- [ ] Set up CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set up proper authentication
- [ ] Use secure database connections
- [ ] Enable security headers

### Environment Variable Security

Never commit sensitive environment variables to version control:

```bash
# Add to .gitignore
.env
.env.local
.env.production
```

## 🧪 Testing

### Run Tests

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests (if configured)
cd frontend && npm test
```

### Test the Demo

```bash
# Start the demo
./deploy.sh demo

# Test endpoints
curl http://localhost:3005/demo/health
curl -X POST http://localhost:3005/demo/research \
  -H "Content-Type: application/json" \
  -d '{"address": "123 Main Street, New York, NY 10001"}'
```

## 🚨 Troubleshooting

### Common Issues

1. **Module not found errors**:
   - Make sure you're in the correct directory
   - Run `npm install` in both backend and frontend directories

2. **Port conflicts**:
   - Check if ports 3000, 3001, 3005 are available
   - Use different ports in environment variables

3. **Database connection issues**:
   - Verify DATABASE_URL is correct
   - Ensure database is running
   - Check network connectivity

4. **CORS errors**:
   - Verify FRONTEND_URL in backend environment
   - Check CORS configuration

### Getting Help

- Check the logs: `docker-compose logs -f`
- Verify environment variables are set correctly
- Test individual services independently
- Check the demo endpoints for basic functionality

## 📚 Additional Resources

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [API Documentation](./backend/API.md)
- [Database Schema](./backend/prisma/schema.prisma) 