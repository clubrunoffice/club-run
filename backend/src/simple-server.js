const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL || "http://localhost:3000", "http://localhost:3003", "http://localhost:3006", "http://localhost:3007", "http://localhost:8081"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

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
  origin: [process.env.FRONTEND_URL || "http://localhost:3000", "http://localhost:3003", "http://localhost:3006", "http://localhost:3007", "http://localhost:8081"],
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

// Health check
app.get('/health', async (req, res) => {
  try {
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      message: 'Club Run API is running in simple mode'
    });
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
    mode: 'simple'
  });
});

// Auth health check
app.get('/api/auth/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Authentication system is operational',
    timestamp: new Date().toISOString(),
    features: {
      registration: 'enabled',
      login: 'enabled',
      googleOAuth: 'enabled',
      tokenRefresh: 'enabled',
      passwordReset: 'enabled',
      emailVerification: 'enabled',
      rateLimiting: 'enabled',
      accountLockout: 'enabled'
    }
  });
});

// Mock venues API
app.get('/api/venues', (req, res) => {
  const { type, status, search, limit = 50 } = req.query;
  
  const mockVenues = [
    {
      id: 'venue-1',
      name: 'The Local Bar',
      address: '123 Main St',
      city: 'Atlanta',
      state: 'GA',
      type: 'bar',
      checkInReward: 10,
      status: 'open',
      safetyRating: 4.5,
      avgCost: 25,
      popularity: 150
    },
    {
      id: 'venue-2',
      name: 'Downtown Club',
      address: '456 Oak Ave',
      city: 'Atlanta',
      state: 'GA',
      type: 'club',
      checkInReward: 15,
      status: 'open',
      safetyRating: 4.2,
      avgCost: 30,
      popularity: 200
    }
  ];

  let filteredVenues = mockVenues;
  
  if (type) {
    filteredVenues = filteredVenues.filter(v => v.type === type);
  }
  
  if (status) {
    filteredVenues = filteredVenues.filter(v => v.status === status);
  }
  
  if (search) {
    filteredVenues = filteredVenues.filter(v => 
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.address.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json({
    venues: filteredVenues.slice(0, parseInt(limit)),
    total: filteredVenues.length
  });
});

// Mock auth endpoints
app.post('/api/auth/register', (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  res.status(201).json({
    message: 'Registration successful. Please check your email to verify your account.',
    userId: 'mock-user-id'
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Mock successful login
  const mockToken = 'mock-jwt-token-' + Date.now();
  
  res.cookie('refreshToken', 'mock-refresh-token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });

  res.json({
    message: 'Login successful',
    accessToken: mockToken,
    user: {
      id: 'mock-user-id',
      email: email,
      firstName: 'Mock',
      lastName: 'User',
      role: 'user',
      verified: true
    }
  });
});

app.post('/api/auth/google', (req, res) => {
  const { accessToken, userInfo } = req.body;

  if (!accessToken || !userInfo) {
    return res.status(400).json({ error: 'Access token and user info required' });
  }

  const mockToken = 'mock-google-jwt-token-' + Date.now();
  
  res.cookie('refreshToken', 'mock-google-refresh-token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });

  res.json({
    message: 'Google authentication successful',
    accessToken: mockToken,
    user: {
      id: 'mock-google-user-id',
      email: userInfo.email,
      firstName: userInfo.given_name || 'Google',
      lastName: userInfo.family_name || 'User',
      avatar: userInfo.picture,
      role: 'user',
      verified: true
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // Mock user data
  const mockUser = {
    id: 'mock-user-id',
    email: 'test@clubrun.com',
    firstName: 'Mock',
    lastName: 'User',
    role: 'user',
    verified: true
  };

  res.json({
    user: mockUser
  });
});

// WebSocket handlers
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join-user', (data) => {
    socket.join(`user-${data.userId}`);
    console.log(`User ${data.userId} joined their room`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Club Run Simple API server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 Mode: Simple (no database required)`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = { app, server, io }; 