const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');
const { generateTokens, hashPassword } = require('../utils/auth');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user exists
    const existingUser = await req.prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create user with default RUNNER role
    const passwordHash = await hashPassword(password);
    const user = await req.prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name,
        role: 'RUNNER' // Default role assignment
      }
    });

    // Create session
    const { token, expiresAt } = generateTokens(user);
    await req.prisma.userSession.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip
      }
    });

    // Initialize default missions for new user
    await initializeDefaultMissions(req.prisma, user.id);

    res.status(201).json({
      message: 'User created successfully',
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        role: user.role,
        tokenBalance: user.tokenBalance,
        level: user.level
      },
      token,
      expiresAt
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await req.prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create session
    const { token, expiresAt } = generateTokens(user);
    await req.prisma.userSession.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip
      }
    });

    // Update last login
    await req.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tokenBalance: user.tokenBalance,
        level: user.level,
        theme: user.theme,
        currentStreak: user.currentStreak
      },
      token,
      expiresAt
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await req.prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        userMissions: {
          include: { mission: true },
          where: { completed: false }
        },
        _count: {
          select: { checkIns: true }
        }
      }
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tokenBalance: user.tokenBalance,
        currentStreak: user.currentStreak,
        totalCheckIns: user._count.checkIns,
        level: user.level,
        theme: user.theme,
        badges: user.badges,
        activeMissions: user.userMissions.length
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    await req.prisma.userSession.delete({
      where: { id: req.sessionId }
    });
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Google OAuth
router.post('/google', async (req, res) => {
  try {
    const { accessToken, userInfo } = req.body;
    
    if (!accessToken || !userInfo) {
      return res.status(400).json({ error: 'Access token and user info are required' });
    }

    // Check if user exists
    let user = await req.prisma.user.findUnique({
      where: { email: userInfo.email.toLowerCase() }
    });

    if (!user) {
      // Create new user
      user = await req.prisma.user.create({
        data: {
          email: userInfo.email.toLowerCase(),
          name: userInfo.name,
          googleId: userInfo.id,
          avatar: userInfo.picture,
          tokenBalance: 50, // Welcome bonus
          level: 'Navigator',
          theme: 'dark'
        }
      });

      // Initialize default missions for new user
      await initializeDefaultMissions(req.prisma, user.id);
    } else {
      // Update existing user's Google info if not set
      if (!user.googleId) {
        await req.prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: userInfo.id,
            avatar: userInfo.picture
          }
        });
      }
      
      // Give welcome bonus to existing users who haven't received it yet
      if (user.tokenBalance === 0) {
        await req.prisma.user.update({
          where: { id: user.id },
          data: {
            tokenBalance: 50 // Welcome bonus for existing users
          }
        });
        user.tokenBalance = 50;
      }
    }

    // Create session
    const { token, expiresAt } = generateTokens(user);
    await req.prisma.userSession.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip
      }
    });

    // Update last login
    await req.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    res.json({
      message: user.googleId ? 'Login successful' : 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tokenBalance: user.tokenBalance,
        level: user.level,
        theme: user.theme,
        currentStreak: user.currentStreak,
        avatar: user.avatar
      },
      token,
      expiresAt
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

// Helper function to initialize default missions
const initializeDefaultMissions = async (prisma, userId) => {
  const defaultMissions = await prisma.mission.findMany({
    where: { 
      type: { in: ['daily', 'weekly'] },
      isActive: true 
    }
  });

  const userMissions = defaultMissions.map(mission => ({
    userId,
    missionId: mission.id
  }));

  await prisma.userMission.createMany({
    data: userMissions,
    skipDuplicates: true
  });
};

module.exports = router; 