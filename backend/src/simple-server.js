const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3006',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Import routes
const authRoutes = require('./routes/auth');
const demoRoutes = require('./routes/demo');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/demo', demoRoutes);

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'Club Run API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Demo health check
app.get('/api/demo/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Enhanced Club Run Agent Flow Demo',
    timestamp: new Date().toISOString(),
    components: {
      research_agent: 'operational',
      mission_assignment_agent: 'operational',
      reporting_agent: 'operational',
      weekly_report_generator: 'operational'
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Club Run API Server',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      demo: '/api/demo',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Club Run API server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 Authentication system: enabled`);
  console.log(`🌐 CORS origin: ${process.env.FRONTEND_URL || 'http://localhost:3006'}`);
});

module.exports = app; 