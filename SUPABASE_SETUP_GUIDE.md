# 🚀 Club Run Supabase Setup Guide

## Overview

This guide will help you set up Supabase as the database for Club Run. Supabase provides a PostgreSQL database with real-time capabilities, authentication, and storage - perfect for the Club Run platform.

## 🎯 Quick Setup Options

### Option 1: Supabase Cloud (Recommended for Production)
- Free tier available
- Automatic backups
- Real-time subscriptions
- Built-in authentication

### Option 2: SQLite (Quick Development)
- Local database
- No setup required
- Perfect for development

## 📋 Supabase Cloud Setup

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `club-run`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project"

### Step 2: Get API Keys

1. In your Supabase dashboard, go to **Settings > API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-ref.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

### Step 3: Update Environment Variables

Edit `backend/.env` and replace the placeholder values:

```bash
# Supabase Configuration
SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"

# Database URL (from Supabase dashboard)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### Step 4: Deploy Database Schema

```bash
cd backend
npx prisma db push
```

### Step 5: Seed Database (Optional)

```bash
npx prisma db seed
```

### Step 6: Restart Backend

```bash
npm run dev
```

## 🗄️ SQLite Setup (Alternative)

If you want to get started quickly without Supabase:

### Step 1: Update Prisma Schema

Edit `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### Step 2: Update Environment

Edit `backend/.env`:

```bash
DATABASE_URL="file:./dev.db"
```

### Step 3: Deploy Schema

```bash
cd backend
npx prisma db push
```

## 🔧 Verification

### Test Database Connection

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-08-23T03:35:00.000Z"
}
```

### Test API Endpoints

```bash
# Test venue research
curl -X POST http://localhost:3001/api/venues/research \
  -H "Content-Type: application/json" \
  -d '{"address": "123 Main Street, Atlanta, GA"}'

# Test user registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123", "name": "Test User"}'
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Verify Supabase credentials
   - Ensure database is accessible

2. **Prisma Migration Errors**
   - Run `npx prisma generate` first
   - Check schema syntax
   - Verify database permissions

3. **Supabase Authentication Issues**
   - Verify API keys are correct
   - Check project URL format
   - Ensure service role key is kept secret

### Reset Database

```bash
cd backend
npx prisma migrate reset
npx prisma db push
npx prisma db seed
```

## 📊 Database Schema

The Club Run database includes:

- **Users**: User accounts and profiles
- **Venues**: Nightlife venues and locations
- **CheckIns**: User check-ins at venues
- **Missions**: AI-generated missions and tasks
- **Expenses**: Expense tracking and reporting
- **Reports**: Generated reports and analytics

## 🔐 Security Notes

- Never commit `.env` files to version control
- Keep service role keys secret
- Use environment variables in production
- Enable Row Level Security (RLS) in Supabase
- Set up proper authentication policies

## 🚀 Next Steps

After setting up the database:

1. **Test the API**: Verify all endpoints work
2. **Set up Authentication**: Configure Google OAuth
3. **Deploy to Production**: Use Vercel or similar
4. **Monitor Performance**: Set up logging and analytics

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Club Run API Documentation](./backend/API.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

---

**🎉 Congratulations! Your Club Run database is now set up and ready for development!**
