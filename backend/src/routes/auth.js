const express = require('express');
const router = express.Router();
const AuthController = require('../auth/AuthController');

// Apply rate limiting to all auth routes
router.use(AuthController.rateLimit);

// Public routes (no authentication required)
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.get('/verify-email', AuthController.verifyEmail);

// Google OAuth routes
router.post('/google', AuthController.googleAuth);
router.get('/google/callback', AuthController.googleCallback);

// Protected routes (authentication required)
router.get('/me', AuthController.authenticate, AuthController.me);

// Admin-only routes
router.get('/admin/users', 
  AuthController.authenticate, 
  AuthController.authorize(['admin']), 
  (req, res) => {
    res.json({ 
      message: 'Admin access granted',
      users: AuthController.getMockUsers().map(u => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        verified: u.verified,
        createdAt: u.createdAt
      }))
    });
  }
);

// Health check for auth system
router.get('/health', (req, res) => {
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

module.exports = router; 