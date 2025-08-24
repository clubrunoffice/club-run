const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const app = express();

// Initialize Prisma client for serverless environment
let prisma;
try {
  const { PrismaClient } = require('@prisma/client');
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  } else {
    prisma = new PrismaClient();
  }
} catch (error) {
  console.warn('Prisma initialization failed:', error.message);
  prisma = null;
}

// Load environment variables
try {
  require('dotenv').config();
} catch (error) {
  console.warn('dotenv loading failed:', error.message);
}

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "wss:", "ws:"],
    },
  },
}));

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000", 
    "http://localhost:3003", 
    "http://localhost:3006", 
    "http://localhost:3007", 
    "http://localhost:8081",
    "https://club-run-zeta.vercel.app",
    "https://club-nlvzypylp-club-runs-projects.vercel.app"
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Make prisma available to routes
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Health check
app.get('/health', async (req, res) => {
  try {
    if (prisma) {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: 'healthy', timestamp: new Date().toISOString() });
    } else {
      res.json({ status: 'healthy (no database)', timestamp: new Date().toISOString() });
    }
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// Simple health check (no database required)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'Club Run API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: prisma ? 'connected' : 'not available'
  });
});

// Test endpoint for Vercel
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Club Run API is working on Vercel!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: prisma ? 'connected' : 'not available'
  });
});

// API Routes - with error handling
const loadRoute = (routePath, routeName) => {
  try {
    return require(routePath);
  } catch (error) {
    console.error(`Failed to load ${routeName} route:`, error.message);
    const router = express.Router();
    router.get('/', (req, res) => {
      res.json({ 
        error: `${routeName} route not available`, 
        message: 'This route is temporarily unavailable',
        timestamp: new Date().toISOString()
      });
    });
    return router;
  }
};

// API Routes
app.use('/api/auth', loadRoute('../backend/src/routes/auth', 'auth'));
app.use('/api/admin', loadRoute('../backend/src/routes/admin', 'admin'));
app.use('/api/users', loadRoute('../backend/src/routes/users', 'users'));
app.use('/api/venues', loadRoute('../backend/src/routes/venues', 'venues'));
app.use('/api/checkins', loadRoute('../backend/src/routes/checkins', 'checkins'));
app.use('/api/missions', loadRoute('../backend/src/routes/missions', 'missions'));
app.use('/api/p2p-missions', loadRoute('../backend/src/routes/p2p-missions', 'p2p-missions'));
app.use('/api/teams', loadRoute('../backend/src/routes/teams', 'teams'));
app.use('/api/expenses', loadRoute('../backend/src/routes/expenses', 'expenses'));
app.use('/api/chat', loadRoute('../backend/src/routes/chat', 'chat'));
app.use('/api/agents', loadRoute('../backend/src/routes/agents', 'agents'));
app.use('/api/orchestration', loadRoute('../backend/src/routes/orchestration', 'orchestration'));
app.use('/api/serato', loadRoute('../backend/src/routes/serato', 'serato'));
app.use('/api/demo', loadRoute('../backend/src/routes/demo', 'demo'));

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Export for Vercel serverless function
module.exports = app; 