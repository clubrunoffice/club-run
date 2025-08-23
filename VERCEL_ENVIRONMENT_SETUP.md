# Vercel Environment Setup Guide

## 🚨 Current Issue
Your Club Run deployment is protected by Vercel's authentication system, which is why you're seeing a 404 error.

## 🔧 Quick Fix Steps

### Step 1: Disable Deployment Protection
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your Club Run project
3. Go to **Settings** → **Security**
4. Set **Deployment Protection** to **"None"**
5. Save changes

### Step 2: Add Basic Environment Variables
1. Go to **Settings** → **Environment Variables**
2. Add these variables:

```env
NODE_ENV=production
FRONTEND_URL=https://your-domain.vercel.app
CORS_ORIGIN=https://your-domain.vercel.app
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters
JWT_EXPIRES_IN=7d
```

### Step 3: Test Your Deployment
After making these changes, your endpoints should work:

- **Health Check**: `https://your-domain.vercel.app/api/health`
- **Demo Health**: `https://your-domain.vercel.app/api/demo/health`
- **Demo Dashboard**: `https://your-domain.vercel.app/api/demo/dashboard`

## 🧪 Test Commands

```bash
# Test health endpoint
curl https://your-domain.vercel.app/api/health

# Test demo health
curl https://your-domain.vercel.app/api/demo/health

# Test demo research
curl -X POST https://your-domain.vercel.app/api/demo/research \
  -H "Content-Type: application/json" \
  -d '{"address":"123 Main Street, New York, NY 10001"}'
```

## 🔍 What's Working Now

✅ **Backend API**: Fully functional with demo endpoints  
✅ **Health Checks**: Both basic and demo health endpoints  
✅ **Demo Features**: Research, missions, expenses, reports  
✅ **Frontend**: Built and ready to serve  

## 🚀 Next Steps

1. **Disable deployment protection** (as shown above)
2. **Add environment variables** for full functionality
3. **Set up a database** (Supabase recommended) for production use
4. **Configure AI services** (OpenAI API) for enhanced features

## 📞 Need Help?

If you're still seeing issues after following these steps:
1. Check the Vercel deployment logs
2. Verify environment variables are set correctly
3. Test endpoints using the curl commands above

Your deployment is working correctly - it just needs the protection disabled and environment variables configured! 