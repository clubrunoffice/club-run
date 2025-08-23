# Club Run Production Setup Guide

## ⚠️ Important Production Requirements

This guide addresses the critical requirements for deploying Club Run to production:
- **Database Setup**: Production database configuration
- **Environment Variables**: Production secrets and configuration

## 🗄️ Database Setup Options

### Option 1: Supabase (Recommended)

**Why Supabase?**
- Free tier with 500MB database
- PostgreSQL with real-time features
- Built-in authentication
- Easy setup and management

**Setup Steps:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your connection details:
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
   SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
   SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"
   ```

### Option 2: PlanetScale

**Why PlanetScale?**
- MySQL-compatible
- Serverless database
- Good for scaling

**Setup Steps:**
1. Go to [planetscale.com](https://planetscale.com)
2. Create a new database
3. Get your connection string:
   ```
   DATABASE_URL="mysql://[USERNAME]:[PASSWORD]@[HOST]/[DATABASE]?sslaccept=strict"
   ```

### Option 3: Railway

**Why Railway?**
- PostgreSQL hosting
- Simple deployment
- Good for small to medium projects

**Setup Steps:**
1. Go to [railway.app](https://railway.app)
2. Create a new PostgreSQL database
3. Get your connection string from the variables tab

## 🔧 Environment Variables Setup

### Required for Production

Create these environment variables in your Vercel dashboard:

#### **Database Configuration**
```env
DATABASE_URL="your-production-database-connection-string"
```

#### **Security**
```env
JWT_SECRET="your-super-secure-jwt-secret-key-minimum-32-characters"
JWT_EXPIRES_IN="7d"
```

#### **AI Services**
```env
OPENAI_API_KEY="sk-your-openai-api-key"
OPENROUTER_API_KEY="your-openrouter-api-key"
AI_MODEL="gpt-4o-mini"
```

#### **App Configuration**
```env
NODE_ENV="production"
FRONTEND_URL="https://your-domain.vercel.app"
CORS_ORIGIN="https://your-domain.vercel.app"
```

### Optional but Recommended

#### **Google Services**
```env
GOOGLE_SERVICE_ACCOUNT_KEY_FILE="your-service-account-key-json"
REPORTING_SHEET_ID="your-google-sheet-id"
```

#### **Supabase (if using)**
```env
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

#### **Monitoring & Logging**
```env
LOG_LEVEL="info"
SENTRY_DSN="your-sentry-dsn"
```

## 🚀 Production Deployment Steps

### Step 1: Set Up Database

1. **Choose your database provider** (Supabase recommended)
2. **Create your database**
3. **Get your connection string**

### Step 2: Configure Environment Variables

1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Go to Settings > Environment Variables**
4. **Add all required variables**

### Step 3: Deploy to Production

```bash
# Deploy to Vercel
./deploy.sh deploy-vercel

# Or manually
vercel --prod
```

### Step 4: Verify Deployment

1. **Check your deployment URL**
2. **Test the health endpoint**: `https://your-domain.vercel.app/api/health`
3. **Test demo endpoints**: `https://your-domain.vercel.app/api/demo/health`

## 🔍 Testing Production Setup

### Health Check
```bash
curl https://your-domain.vercel.app/api/health
```

### Demo Endpoints
```bash
# Test venue research
curl -X POST https://your-domain.vercel.app/api/demo/research \
  -H "Content-Type: application/json" \
  -d '{"address":"123 Main Street, New York, NY 10001"}'

# Test mission creation
curl -X POST https://your-domain.vercel.app/api/demo/missions/create \
  -H "Content-Type: application/json" \
  -d '{"address":"456 Broadway, New York, NY 10013","budget":500,"client_id":"client-123"}'
```

## 🛡️ Security Checklist

- [ ] **Strong JWT Secret**: Use a secure, random 32+ character string
- [ ] **HTTPS Enabled**: Vercel provides this automatically
- [ ] **CORS Configured**: Set proper origins
- [ ] **Environment Variables**: All secrets in Vercel dashboard
- [ ] **Database Security**: Use SSL connections
- [ ] **Rate Limiting**: Configured in production
- [ ] **Logging**: Set appropriate log levels

## 🚨 Common Issues & Solutions

### Database Connection Issues
```bash
# Check if DATABASE_URL is correct
# Ensure database is accessible from Vercel
# Verify SSL settings for production
```

### Environment Variable Issues
```bash
# Verify all variables are set in Vercel dashboard
# Check for typos in variable names
# Ensure values are properly quoted
```

### CORS Issues
```bash
# Set CORS_ORIGIN to your actual domain
# Include both http and https if needed
# Add localhost for development
```

## 📊 Monitoring Production

### Health Monitoring
- **Vercel Analytics**: Built-in performance monitoring
- **Health Endpoints**: `/api/health` and `/api/demo/health`
- **Error Tracking**: Consider adding Sentry

### Database Monitoring
- **Connection Pool**: Monitor database connections
- **Query Performance**: Use database provider's monitoring tools
- **Backup Strategy**: Ensure regular backups

## 🔄 Continuous Deployment

### GitHub Integration
1. **Connect your GitHub repository to Vercel**
2. **Enable automatic deployments**
3. **Set up preview deployments for PRs**

### Environment Management
- **Development**: Use local `.env` files
- **Staging**: Use Vercel preview environments
- **Production**: Use Vercel production environment variables

## 📞 Support

If you encounter issues:

1. **Check Vercel deployment logs**
2. **Verify environment variables**
3. **Test database connectivity**
4. **Review application logs**

## 🎯 Next Steps

After production deployment:

1. **Set up custom domain** (optional)
2. **Configure monitoring and alerts**
3. **Set up backup strategies**
4. **Plan scaling strategies**
5. **Document deployment procedures**

---

**Remember**: Never commit sensitive environment variables to your repository. Always use Vercel's environment variable management for production secrets. 