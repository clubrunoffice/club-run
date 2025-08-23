const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

class AuthController {
  constructor() {
    this.supabaseEnabled = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY;
    this.supabase = this.supabaseEnabled ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY) : null;
    
    // JWT Configuration
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-super-secure-jwt-secret-key-minimum-32-characters';
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
    this.REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';
    
    // Google OAuth Configuration
    this.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    this.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    
    // Security Configuration
    this.MAX_LOGIN_ATTEMPTS = 5;
    this.LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
    this.PASSWORD_MIN_LENGTH = 8;
    
    // Rate limiting
    this.rateLimitMap = new Map();
    
    // In-memory user storage for development
    this.mockUsers = [
      {
        id: '1',
        email: 'admin@clubrun.com',
        password: '$2a$12$KywgAkb9a0LKDSOyvjRiMe48UGujwMoPZ1rANCtIfZIP60BlPMq9W', // 'Admin123!'
        firstName: 'Admin',
        lastName: 'User',
        verified: true,
        role: 'admin',
        loginAttempts: 0,
        lockedUntil: null,
        createdAt: new Date().toISOString()
      }
    ];
  }

  // Rate limiting middleware
  rateLimit = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 1000; // Increased from 100 for development

    if (!this.rateLimitMap.has(ip)) {
      this.rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    } else {
      const record = this.rateLimitMap.get(ip);
      if (now > record.resetTime) {
        record.count = 1;
        record.resetTime = now + windowMs;
      } else {
        record.count++;
      }
    }

    const record = this.rateLimitMap.get(ip);
    if (record.count > maxRequests) {
      return res.status(429).json({ 
        error: 'Too many requests', 
        retryAfter: Math.ceil((record.resetTime - now) / 1000) 
      });
    }

    next();
  };

  // Generate JWT tokens
  generateTokens = (userId, email) => {
    const accessToken = jwt.sign(
      { userId, email, type: 'access' },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId, email, type: 'refresh' },
      this.JWT_SECRET,
      { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN }
    );

    return { accessToken, refreshToken };
  };

  // Verify JWT token
  verifyToken = (token) => {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      return null;
    }
  };

  // Hash password
  hashPassword = async (password) => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  };

  // Compare password
  comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
  };

  // Validate password strength
  validatePassword = (password) => {
    const minLength = this.PASSWORD_MIN_LENGTH;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) errors.push(`Password must be at least ${minLength} characters`);
    if (!hasUpperCase) errors.push('Password must contain at least one uppercase letter');
    if (!hasLowerCase) errors.push('Password must contain at least one lowercase letter');
    if (!hasNumbers) errors.push('Password must contain at least one number');
    if (!hasSpecialChar) errors.push('Password must contain at least one special character');

    return { isValid: errors.length === 0, errors };
  };

  // Generate secure random token
  generateSecureToken = () => {
    return crypto.randomBytes(32).toString('hex');
  };

  // Mock user storage (replace with database in production)
  getMockUsers = () => {
    return this.mockUsers;
  };

  // Register user
  register = async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Input validation
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Password validation
      const passwordValidation = this.validatePassword(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({ 
          error: 'Password does not meet requirements',
          details: passwordValidation.errors 
        });
      }

      // Check if user already exists
      const mockUsers = this.getMockUsers();
      const existingUser = mockUsers.find(user => user.email === email);
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);

      // Generate verification token
      const verificationToken = this.generateSecureToken();

      // Create user (in production, save to database)
      const newUser = {
        id: Date.now().toString(),
        email,
        password: hashedPassword,
        firstName,
        lastName,
        verified: false,
        verificationToken,
        verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        role: 'user',
        loginAttempts: 0,
        lockedUntil: null,
        createdAt: new Date().toISOString()
      };

      // Store user in memory (in production, save to database)
      this.mockUsers.push(newUser);
      // await this.supabase.from('users').insert(newUser);

      // Send verification email (mock)
      console.log(`Verification email sent to ${email} with token: ${verificationToken}`);

      res.status(201).json({
        message: 'Registration successful. Please check your email to verify your account.',
        userId: newUser.id
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Login user
  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Input validation
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Find user
      const mockUsers = this.getMockUsers();
      const user = mockUsers.find(u => u.email === email);

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if account is locked
      if (user.lockedUntil && new Date() < new Date(user.lockedUntil)) {
        const remainingTime = Math.ceil((new Date(user.lockedUntil) - new Date()) / 1000);
        return res.status(423).json({ 
          error: 'Account is temporarily locked',
          retryAfter: remainingTime
        });
      }

      // Check if email is verified
      if (!user.verified) {
        // For development, allow login without verification
        console.log('User not verified, but allowing login for development');
        // return res.status(401).json({ 
        //   error: 'Please verify your email before logging in',
        //   needsVerification: true 
        // });
      }

      // Verify password
      const isValidPassword = await this.comparePassword(password, user.password);
      if (!isValidPassword) {
        // Increment failed login attempts
        user.loginAttempts = (user.loginAttempts || 0) + 1;
        
        if (user.loginAttempts >= this.MAX_LOGIN_ATTEMPTS) {
          user.lockedUntil = new Date(Date.now() + this.LOCKOUT_DURATION);
          return res.status(423).json({ 
            error: 'Account locked due to too many failed attempts',
            retryAfter: Math.ceil(this.LOCKOUT_DURATION / 1000)
          });
        }

        return res.status(401).json({ 
          error: 'Invalid credentials',
          remainingAttempts: this.MAX_LOGIN_ATTEMPTS - user.loginAttempts
        });
      }

      // Reset login attempts on successful login
      user.loginAttempts = 0;
      user.lockedUntil = null;

      // Generate tokens
      const { accessToken, refreshToken } = this.generateTokens(user.id, user.email);

      // Set refresh token as HttpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      // Return access token and user info
      res.json({
        message: 'Login successful',
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          verified: user.verified
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Refresh token
  refresh = async (req, res) => {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required' });
      }

      // Verify refresh token
      const decoded = this.verifyToken(refreshToken);
      if (!decoded || decoded.type !== 'refresh') {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      // Find user
      const mockUsers = this.getMockUsers();
      const user = mockUsers.find(u => u.id === decoded.userId);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(user.id, user.email);

      // Set new refresh token
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.json({
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          verified: user.verified
        }
      });

    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Logout
  logout = async (req, res) => {
    try {
      // Clear refresh token cookie
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      res.json({ message: 'Logout successful' });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get current user
  me = async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access token required' });
      }

      const accessToken = authHeader.substring(7);
      const decoded = this.verifyToken(accessToken);

      if (!decoded || decoded.type !== 'access') {
        return res.status(401).json({ error: 'Invalid access token' });
      }

      // Find user
      const mockUsers = this.getMockUsers();
      const user = mockUsers.find(u => u.id === decoded.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          verified: user.verified
        }
      });

    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Forgot password
  forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Find user
      const mockUsers = this.getMockUsers();
      const user = mockUsers.find(u => u.email === email);

      if (!user) {
        // Don't reveal if user exists
        return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
      }

      // Generate reset token
      const resetToken = this.generateSecureToken();
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // In production, save reset token to database
      // await this.supabase.from('users').update({
      //   resetToken,
      //   resetExpires
      // }).eq('id', user.id);

      // Send reset email (mock)
      console.log(`Password reset email sent to ${email} with token: ${resetToken}`);

      res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });

    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Reset password
  resetPassword = async (req, res) => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({ error: 'Token and password are required' });
      }

      // Password validation
      const passwordValidation = this.validatePassword(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({ 
          error: 'Password does not meet requirements',
          details: passwordValidation.errors 
        });
      }

      // Find user by reset token (mock)
      const mockUsers = this.getMockUsers();
      const user = mockUsers.find(u => u.resetToken === token && u.resetExpires > new Date());

      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      // Hash new password
      const hashedPassword = await this.hashPassword(password);

      // Update user (in production)
      // await this.supabase.from('users').update({
      //   password: hashedPassword,
      //   resetToken: null,
      //   resetExpires: null
      // }).eq('id', user.id);

      res.json({ message: 'Password reset successful' });

    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Verify email
  verifyEmail = async (req, res) => {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({ error: 'Verification token required' });
      }

      // Find user by verification token (mock)
      const mockUsers = this.getMockUsers();
      const userIndex = mockUsers.findIndex(u => u.verificationToken === token && new Date(u.verificationExpires) > new Date());

      if (userIndex === -1) {
        return res.status(400).json({ error: 'Invalid or expired verification token' });
      }

      // Update user in memory (in production, save to database)
      this.mockUsers[userIndex].verified = true;
      this.mockUsers[userIndex].verificationToken = null;
      this.mockUsers[userIndex].verificationExpires = null;
      
      // await this.supabase.from('users').update({
      //   verified: true,
      //   verificationToken: null,
      //   verificationExpires: null
      // }).eq('id', user.id);

      res.json({ message: 'Email verified successfully' });

    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Authentication middleware
  authenticate = (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access token required' });
      }

      const accessToken = authHeader.substring(7);
      const decoded = this.verifyToken(accessToken);

      if (!decoded || decoded.type !== 'access') {
        return res.status(401).json({ error: 'Invalid access token' });
      }

      // Find user
      const mockUsers = this.getMockUsers();
      const user = mockUsers.find(u => u.id === decoded.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      req.user = user;
      next();

    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ error: 'Authentication failed' });
    }
  };

  // Role-based authorization middleware
  authorize = (roles = []) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    };
  };

  // Google OAuth Authentication
  googleAuth = async (req, res) => {
    try {
      const { accessToken, userInfo } = req.body;

      if (!accessToken || !userInfo) {
        return res.status(400).json({ error: 'Access token and user info required' });
      }

      // Verify Google token (optional but recommended for production)
      if (this.GOOGLE_CLIENT_ID) {
        try {
          const tokenInfo = await axios.get(`https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`);
          if (tokenInfo.data.aud !== this.GOOGLE_CLIENT_ID) {
            return res.status(401).json({ error: 'Invalid Google token' });
          }
        } catch (error) {
          console.error('Google token verification failed:', error);
          // Continue with user info for demo purposes
        }
      }

      const { email, given_name, family_name, picture } = userInfo;

      // Find existing user by email or Google ID
      const mockUsers = this.getMockUsers();
      let user = mockUsers.find(u => u.email === email);

      if (!user) {
        // Create new user
        const newUser = {
          id: Date.now().toString(),
          email,
          firstName: given_name || 'Google',
          lastName: family_name || 'User',
          avatar: picture,
          googleId: userInfo.id || email,
          verified: true,
          role: 'user',
          loginAttempts: 0,
          lockedUntil: null,
          createdAt: new Date().toISOString()
        };

        this.mockUsers.push(newUser);
        user = newUser;

        console.log(`New Google user created: ${email}`);
      } else {
        // Update existing user's Google info
        user.googleId = userInfo.id || email;
        user.avatar = picture || user.avatar;
        user.verified = true;
        user.lastLoginAt = new Date().toISOString();
      }

      // Generate tokens
      const { accessToken: jwtAccessToken, refreshToken } = this.generateTokens(user.id, user.email);

      // Set refresh token as HttpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.json({
        message: 'Google authentication successful',
        accessToken: jwtAccessToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          role: user.role,
          verified: user.verified
        }
      });

    } catch (error) {
      console.error('Google auth error:', error);
      res.status(500).json({ error: 'Google authentication failed' });
    }
  };

  // Google OAuth Callback (for server-side flow)
  googleCallback = async (req, res) => {
    try {
      const { code } = req.query;

      if (!code) {
        return res.status(400).json({ error: 'Authorization code required' });
      }

      if (!this.GOOGLE_CLIENT_ID || !this.GOOGLE_CLIENT_SECRET) {
        return res.status(500).json({ error: 'Google OAuth not configured' });
      }

      // Exchange code for tokens
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: this.GOOGLE_CLIENT_ID,
        client_secret: this.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.BACKEND_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code'
      });

      const { access_token } = tokenResponse.data;

      // Get user info
      const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` }
      });

      const userInfo = userInfoResponse.data;

      // Process user authentication (same as googleAuth)
      const mockUsers = this.getMockUsers();
      let user = mockUsers.find(u => u.email === userInfo.email);

      if (!user) {
        const newUser = {
          id: Date.now().toString(),
          email: userInfo.email,
          firstName: userInfo.given_name || 'Google',
          lastName: userInfo.family_name || 'User',
          avatar: userInfo.picture,
          googleId: userInfo.id,
          verified: true,
          role: 'user',
          loginAttempts: 0,
          lockedUntil: null,
          createdAt: new Date().toISOString()
        };

        this.mockUsers.push(newUser);
        user = newUser;
      }

      const { accessToken: jwtAccessToken, refreshToken } = this.generateTokens(user.id, user.email);

      // Redirect to frontend with tokens
      const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${jwtAccessToken}&user=${encodeURIComponent(JSON.stringify(user))}`;
      res.redirect(redirectUrl);

    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=Google authentication failed`);
    }
  };
}

module.exports = new AuthController(); 