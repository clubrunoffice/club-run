const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createServer } = require('http');
require('dotenv').config();

const app = express();
const server = createServer(app);

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
  origin: [process.env.FRONTEND_URL || "http://localhost:3000", "http://localhost:8081"],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Health check (no database required)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    message: 'Orchestration test server running'
  });
});

// Basic API test endpoints
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working',
    endpoints: [
      '/health',
      '/api/test',
      '/api/orchestration/status'
    ]
  });
});

app.get('/api/orchestration/status', (req, res) => {
  res.json({
    status: 'orchestration_ready',
    components: {
      server: 'running',
      api: 'available',
      cors: 'configured',
      middleware: 'loaded'
    },
    timestamp: new Date().toISOString()
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

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`🚀 Club Run Orchestration Test Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Test: http://localhost:${PORT}/api/test`);
  console.log(`🔗 Orchestration Status: http://localhost:${PORT}/api/orchestration/status`);
});

module.exports = { app, server }; 