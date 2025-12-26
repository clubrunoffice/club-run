const { PrivyClient } = require('@privy-io/server-auth');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const privy = new PrivyClient(
  process.env.PRIVY_APP_ID,
  process.env.PRIVY_APP_SECRET
);

// Role hierarchy for authorization
const ROLE_HIERARCHY = {
  GUEST: 0,
  RUNNER: 1,
  DJ: 1,
  VERIFIED_DJ: 2,
  CLIENT: 3,
  CURATOR: 4,
  OPERATIONS: 5,
  PARTNER: 6,
  ADMIN: 7
};

/**
 * Authenticate user via Privy token
 */
async function authenticate(req, res, next) {
  try {
    const authToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (!authToken) {
      return res.status(401).json({ error: 'No auth token provided' });
    }

    // Verify token with Privy
    const verifiedClaims = await privy.verifyAuthToken(authToken);
    
    console.log('✅ Privy token verified for user:', verifiedClaims.userId);
    
    // Fetch or create user from database
    let user = await prisma.user.findUnique({
      where: { privyId: verifiedClaims.userId },
      select: {
        id: true,
        privyId: true,
        email: true,
        name: true,
        role: true,
        walletAddress: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // If user doesn't exist, create them with GUEST role
    if (!user) {
      console.log('🆕 Creating new user from Privy auth:', verifiedClaims.userId);
      user = await prisma.user.create({
        data: {
          privyId: verifiedClaims.userId,
          email: verifiedClaims.email || `user_${verifiedClaims.userId.slice(-8)}@privy.generated`,
          name: verifiedClaims.email?.split('@')[0] || `User_${verifiedClaims.userId.slice(-8)}`,
          role: 'GUEST',
          badges: ''
        },
        select: {
          id: true,
          privyId: true,
          email: true,
          name: true,
          role: true,
          walletAddress: true,
          createdAt: true,
          updatedAt: true
        }
      });
      console.log('✅ New user created:', user.id);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Privy auth error:', error);
    return res.status(401).json({ 
      error: 'Invalid or expired token',
      details: error.message 
    });
  }
}

/**
 * Role-based authorization middleware
 * @param {string|string[]} allowedRoles - Single role or array of roles
 */
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    if (roles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({ 
      error: 'Insufficient permissions',
      required: roles,
      current: req.user.role
    });
  };
}

/**
 * Minimum role level authorization
 * @param {number} minimumLevel - Minimum role level required (0-7)
 */
function requireRoleLevel(minimumLevel) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const userLevel = ROLE_HIERARCHY[req.user.role] || 0;
    
    if (userLevel >= minimumLevel) {
      return next();
    }

    return res.status(403).json({ 
      error: 'Insufficient role level',
      required: minimumLevel,
      current: userLevel
    });
  };
}

/**
 * Optional authentication - doesn't fail if no token
 */
async function optionalAuth(req, res, next) {
  try {
    const authToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (!authToken) {
      req.user = null;
      return next();
    }

    const verifiedClaims = await privy.verifyAuthToken(authToken);
    
    const user = await prisma.user.findUnique({
      where: { privyId: verifiedClaims.userId },
      select: {
        id: true,
        privyId: true,
        email: true,
        name: true,
        role: true,
        walletAddress: true
      }
    });

    req.user = user || null;
    next();
  } catch (error) {
    // Don't fail, just set user to null
    req.user = null;
    next();
  }
}

module.exports = {
  authenticate,
  requireRole,
  requireRoleLevel,
  optionalAuth,
  ROLE_HIERARCHY,
  privy
};
