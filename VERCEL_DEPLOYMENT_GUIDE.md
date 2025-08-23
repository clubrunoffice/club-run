# 🚀 Club Run - Vercel Deployment Guide

## ✅ **Yes, Club Run Can Be Deployed to Vercel!**

Your application is already configured for Vercel deployment with:
- ✅ **Frontend**: React + Vite (ready for Vercel)
- ✅ **Backend API**: Express.js serverless functions
- ✅ **Database**: Can use Supabase, PlanetScale, or Vercel Postgres
- ✅ **Authentication**: Google OAuth ready
- ✅ **Build Configuration**: Already set up

## 🎯 **Deployment Options**

### **Option 1: Full Stack Deployment (Recommended)**
Deploy both frontend and backend to Vercel

### **Option 2: Frontend Only**
Deploy frontend to Vercel, backend to another service

### **Option 3: Backend Only**
Deploy backend to Vercel, frontend to another service

## 🚀 **Quick Deploy (Option 1 - Full Stack)**

### **Step 1: Prepare Your Repository**
```bash
# Make sure you're in the project root
cd /Users/truecastlefilmsllc/CLUB\ RUN

# Build the frontend
cd frontend
npm run build
cd ..

# Commit your changes
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### **Step 2: Deploy to Vercel**
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Deploy to Vercel
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set project name: club-run
# - Confirm deployment settings
```

### **Step 3: Configure Environment Variables**
In your Vercel dashboard, go to **Settings** → **Environment Variables** and add:

```env
# Core Configuration
NODE_ENV=production
FRONTEND_URL=https://your-domain.vercel.app
CORS_ORIGIN=https://your-domain.vercel.app

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters
JWT_EXPIRES_IN=7d

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database (Choose one)
# Option A: Supabase
DATABASE_URL=your-supabase-connection-string

# Option B: Vercel Postgres
POSTGRES_URL=your-vercel-postgres-url
POSTGRES_PRISMA_URL=your-vercel-postgres-prisma-url
POSTGRES_URL_NON_POOLING=your-vercel-postgres-non-pooling-url
POSTGRES_USER=your-vercel-postgres-user
POSTGRES_HOST=your-vercel-postgres-host
POSTGRES_PASSWORD=your-vercel-postgres-password
POSTGRES_DATABASE=your-vercel-postgres-database

# Option C: PlanetScale
DATABASE_URL=your-planetscale-connection-string

# Redis (Optional - for caching)
REDIS_URL=your-redis-url

# AI Services (Optional)
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# Email (Optional)
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

## 🔧 **Updated Vercel Configuration**

### **vercel.json (Updated)**
```json
{
  "version": 2,
  "functions": {
    "api/index.js": {
      "maxDuration": 30
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/dist/index.html"
    }
  ],
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "npm install"
}
```

### **Frontend Build Configuration**
Your frontend is already configured for production builds:
- ✅ **Vite build**: `npm run build`
- ✅ **TypeScript**: Configured
- ✅ **Tailwind CSS**: Configured
- ✅ **Environment variables**: Ready

## 🗄️ **Database Setup Options**

### **Option A: Supabase (Recommended)**
```bash
# 1. Create Supabase project
# 2. Get connection string
# 3. Add to Vercel environment variables
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
```

### **Option B: Vercel Postgres**
```bash
# 1. In Vercel dashboard, go to Storage
# 2. Create Postgres database
# 3. Environment variables auto-added
```

### **Option C: PlanetScale**
```bash
# 1. Create PlanetScale account
# 2. Create database
# 3. Get connection string
# 4. Add to Vercel environment variables
```

## 🔐 **Authentication Setup**

### **Google OAuth Configuration**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - `https://your-domain.vercel.app/api/auth/google/callback`
4. Add credentials to Vercel environment variables

## 🧪 **Testing Your Deployment**

### **Health Checks**
```bash
# Test API health
curl https://your-domain.vercel.app/api/health

# Test demo endpoints
curl https://your-domain.vercel.app/api/demo/health
```

### **Frontend Access**
- **URL**: `https://your-domain.vercel.app`
- **API**: `https://your-domain.vercel.app/api/*`

## 🚨 **Common Issues & Solutions**

### **Issue 1: Build Failures**
```bash
# Solution: Check build logs
vercel logs

# Ensure all dependencies are installed
npm install
```

### **Issue 2: Database Connection**
```bash
# Solution: Verify DATABASE_URL
# Test connection locally first
npx prisma db push
```

### **Issue 3: CORS Errors**
```bash
# Solution: Update CORS_ORIGIN in environment variables
CORS_ORIGIN=https://your-domain.vercel.app
```

### **Issue 4: Function Timeout**
```bash
# Solution: Increase maxDuration in vercel.json
"maxDuration": 60
```

## 📊 **Performance Optimization**

### **Frontend Optimization**
- ✅ **Code splitting**: Vite handles this automatically
- ✅ **Image optimization**: Vercel handles this
- ✅ **Caching**: Vercel edge caching

### **Backend Optimization**
- ✅ **Serverless functions**: Auto-scaling
- ✅ **Database pooling**: Use connection pooling
- ✅ **Caching**: Redis for session storage

## 🔄 **Continuous Deployment**

### **GitHub Integration**
1. Connect your GitHub repository to Vercel
2. Automatic deployments on push to main branch
3. Preview deployments for pull requests

### **Environment Management**
- **Production**: `main` branch
- **Preview**: `develop` branch
- **Development**: Local development

## 📈 **Monitoring & Analytics**

### **Vercel Analytics**
- Built-in performance monitoring
- Real user metrics
- Error tracking

### **Custom Monitoring**
```bash
# Add monitoring endpoints
GET /api/health
GET /api/metrics
```

## 🎯 **Production Checklist**

### **Before Deployment**
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Google OAuth configured
- [ ] Frontend builds successfully
- [ ] API endpoints tested

### **After Deployment**
- [ ] Health checks passing
- [ ] Frontend loads correctly
- [ ] Authentication works
- [ ] Database operations working
- [ ] Error monitoring set up

## 🚀 **Deploy Now!**

```bash
# Quick deployment command
vercel --prod

# Or use the Vercel dashboard
# 1. Go to vercel.com
# 2. Import your GitHub repository
# 3. Configure environment variables
# 4. Deploy!
```

## 📞 **Need Help?**

### **Vercel Support**
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### **Club Run Support**
- Check deployment logs: `vercel logs`
- Test endpoints locally first
- Verify environment variables

---

## 🎉 **Ready to Deploy!**

Your Club Run application is fully configured for Vercel deployment. Choose your preferred deployment option and follow the steps above!

**Recommended Path**: Full Stack Deployment with Supabase database for the best developer experience.
