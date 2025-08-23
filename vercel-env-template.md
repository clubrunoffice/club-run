# Vercel Environment Variables Template

## Required Environment Variables for Club Run Deployment

Add these environment variables in your Vercel dashboard under **Settings** → **Environment Variables**:

### Basic Configuration
```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-domain.vercel.app
CORS_ORIGIN=https://your-domain.vercel.app
```

### Authentication
```
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d
```

### Database (Optional - for full functionality)
```
DATABASE_URL=postgresql://username:password@host:port/database
```

### AI Services (Optional - for enhanced features)
```
OPENAI_API_KEY=your-openai-api-key
OPENROUTER_API_KEY=your-openrouter-api-key
AI_MODEL=gpt-4o-mini
```

### Google Services (Optional - for reporting)
```
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=path/to/service-account-key.json
REPORTING_SHEET_ID=your-google-sheet-id
```

### Supabase (Optional - for database)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### App Configuration
```
LOG_LEVEL=info
ENABLE_ANALYTICS=false
ENABLE_DEBUG_MODE=false
```

## Deployment Steps

1. **Add Environment Variables**: Copy the above variables to Vercel dashboard
2. **Disable Deployment Protection**: Go to Settings → Security → Set to "None"
3. **Deploy**: Push to your connected Git repository
4. **Test Endpoints**:
   - Health: `https://your-domain.vercel.app/api/health`
   - Demo: `https://your-domain.vercel.app/api/demo/health`

## Troubleshooting

- **404 Errors**: Check if deployment protection is disabled
- **CORS Errors**: Verify CORS_ORIGIN matches your domain
- **Database Errors**: Ensure DATABASE_URL is correct or remove for demo mode
- **Function Timeouts**: Check function maxDuration in vercel.json 