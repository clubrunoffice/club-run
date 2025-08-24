// Enhanced RBAC middleware with security fixes
// Addresses: Permission inheritance, middleware vulnerabilities, role explosion, and security best practices

const ROLE_HIERARCHY = {
  GUEST: 0,
  DJ: 1,
  VERIFIED_DJ: 2,
  CLIENT: 3,
  CURATOR: 4,
  OPERATIONS: 5,
  PARTNER: 6,
  ADMIN: 7
};

// Base permissions for each role level
const BASE_PERMISSIONS = {
  GUEST: [
    'public:read',
    'auth:login',
    'auth:register'
  ],
  DJ: [
    'public:read',
    'auth:login',
    'auth:register',
    'user:read',
    'user:update',
    'missions:read',
    'missions:apply',
    'missions:accept',
    'missions:complete',
    'checkins:create',
    'checkins:read',
    'expenses:create',
    'expenses:read',
    'chat:read',
    'chat:send',
    'p2p-missions:accept',
    'p2p-missions:complete',
    'payments:receive'
  ],
  VERIFIED_DJ: [
    'serato:connect',
    'serato:verify'
  ],
  CLIENT: [
    'missions:create',
    'missions:update',
    'missions:delete',
    'p2p-missions:create',
    'p2p-missions:read',
    'p2p-missions:update',
    'p2p-missions:delete',
    'payments:send'
  ],
  CURATOR: [
    'teams:create',
    'teams:read',
    'teams:update',
    'teams:delete'
  ],
  OPERATIONS: [
    'user:verify',
    'user:delete',
    'missions:update',
    'missions:delete',
    'p2p-missions:update',
    'p2p-missions:delete',
    'teams:update',
    'teams:delete',
    'stats:read',
    'logs:read',
    'payments:read',
    'payments:process',
    'chat:moderate'
  ],
  PARTNER: [
    'missions:update',
    'p2p-missions:update',
    'teams:update',
    'stats:read',
    'payments:read'
  ],
  ADMIN: [
    '*:*' // All permissions
  ]
};

// Role inheritance hierarchy - higher roles inherit lower role permissions
const ROLE_INHERITANCE = {
  GUEST: [],
  DJ: ['GUEST'],
  VERIFIED_DJ: ['DJ'],
  CLIENT: ['DJ'], // Clients should have basic DJ permissions
  CURATOR: ['CLIENT'],
  OPERATIONS: ['CLIENT', 'CURATOR', 'DJ'], // Operations should inherit from multiple roles including DJ
  PARTNER: ['CLIENT'],
  ADMIN: ['ALL']
};

// Generate complete permissions with inheritance
const generateRolePermissions = () => {
  const completePermissions = {};
  
  Object.keys(ROLE_HIERARCHY).forEach(role => {
    let permissions = [...BASE_PERMISSIONS[role] || []];
    
    // Add inherited permissions
    if (ROLE_INHERITANCE[role]) {
      ROLE_INHERITANCE[role].forEach(inheritedRole => {
        if (inheritedRole === 'ALL') {
          // Admin gets all permissions from all roles
          Object.values(BASE_PERMISSIONS).forEach(rolePerms => {
            permissions.push(...rolePerms);
          });
        } else if (BASE_PERMISSIONS[inheritedRole]) {
          permissions.push(...BASE_PERMISSIONS[inheritedRole]);
        }
      });
    }
    
    // Remove duplicates
    completePermissions[role] = [...new Set(permissions)];
  });
  
  return completePermissions;
};

const ROLE_PERMISSIONS = generateRolePermissions();

// Security logging utility
const logSecurityEvent = (event, details) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    ...details,
    userAgent: details.userAgent || 'unknown',
    ipAddress: details.ipAddress || 'unknown'
  };
  
  console.warn(`[SECURITY] ${event}:`, JSON.stringify(logEntry));
  
  // In production, this should go to a proper logging service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to logging service (e.g., Winston, Bunyan, etc.)
  }
};

// Enhanced middleware with proper security checks
const requireAdmin = (req, res, next) => {
  try {
    // ✅ Proper null checking
    if (!req.user || !req.user.role) {
      logSecurityEvent('AUTHENTICATION_FAILED', {
        path: req.path,
        method: req.method,
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip
      });
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // ✅ Normalize role comparison
    const userRole = req.user.role.toUpperCase();
    
    if (userRole !== 'ADMIN') {
      logSecurityEvent('AUTHORIZATION_FAILED', {
        path: req.path,
        method: req.method,
        requiredRole: 'ADMIN',
        currentRole: userRole,
        userId: req.user.id,
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip
      });
      return res.status(403).json({ 
        error: 'Access denied. Admin privileges required.',
        code: 'ADMIN_REQUIRED'
      });
    }
    
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    logSecurityEvent('MIDDLEWARE_ERROR', {
      path: req.path,
        method: req.method,
        error: error.message,
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip
    });
    return res.status(500).json({ 
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // ✅ Proper null checking
      if (!req.user || !req.user.role) {
        logSecurityEvent('AUTHENTICATION_FAILED', {
          path: req.path,
          method: req.method,
          userAgent: req.get('User-Agent'),
          ipAddress: req.ip
        });
        return res.status(401).json({ 
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      // ✅ Normalize role comparison
      const userRole = req.user.role.toUpperCase();
      const normalizedRoles = allowedRoles.map(role => role.toUpperCase());
      
      if (!normalizedRoles.includes(userRole)) {
        logSecurityEvent('AUTHORIZATION_FAILED', {
          path: req.path,
          method: req.method,
          requiredRoles: normalizedRoles,
          currentRole: userRole,
          userId: req.user.id,
          userAgent: req.get('User-Agent'),
          ipAddress: req.ip
        });
        return res.status(403).json({ 
          error: 'Access denied. Insufficient privileges.',
          code: 'INSUFFICIENT_PRIVILEGES',
          required: normalizedRoles,
          current: userRole
        });
      }
      
      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      logSecurityEvent('MIDDLEWARE_ERROR', {
        path: req.path,
        method: req.method,
        error: error.message,
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip
      });
      return res.status(500).json({ 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  };
};

const requireVerifiedDJ = (req, res, next) => {
  try {
    // ✅ Proper null checking
    if (!req.user || !req.user.role) {
      logSecurityEvent('AUTHENTICATION_FAILED', {
        path: req.path,
        method: req.method,
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip
      });
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // ✅ Normalize role comparison
    const userRole = req.user.role.toUpperCase();
    
    if (userRole !== 'VERIFIED_DJ') {
      logSecurityEvent('AUTHORIZATION_FAILED', {
        path: req.path,
        method: req.method,
        requiredRole: 'VERIFIED_DJ',
        currentRole: userRole,
        userId: req.user.id,
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip
      });
      return res.status(403).json({ 
        error: 'Access denied. Verified DJ privileges required.',
        message: 'Your account must be verified by operations to access this feature.',
        code: 'VERIFIED_DJ_REQUIRED'
      });
    }
    
    next();
  } catch (error) {
    console.error('Verified DJ middleware error:', error);
    logSecurityEvent('MIDDLEWARE_ERROR', {
      path: req.path,
      method: req.method,
      error: error.message,
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip
    });
    return res.status(500).json({ 
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
};

const requireRunnerOrVerifiedDJ = (req, res, next) => {
  try {
    // ✅ Proper null checking
    if (!req.user || !req.user.role) {
      logSecurityEvent('AUTHENTICATION_FAILED', {
        path: req.path,
        method: req.method,
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip
      });
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // ✅ Normalize role comparison
    const userRole = req.user.role.toUpperCase();
    const allowedRoles = ['DJ', 'VERIFIED_DJ'];
    
    if (!allowedRoles.includes(userRole)) {
      logSecurityEvent('AUTHORIZATION_FAILED', {
        path: req.path,
        method: req.method,
        requiredRoles: allowedRoles,
        currentRole: userRole,
        userId: req.user.id,
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip
      });
      return res.status(403).json({ 
        error: 'Access denied. DJ or Verified DJ privileges required.',
        code: 'DJ_REQUIRED'
      });
    }
    
    next();
  } catch (error) {
    console.error('DJ middleware error:', error);
    logSecurityEvent('MIDDLEWARE_ERROR', {
      path: req.path,
      method: req.method,
      error: error.message,
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip
    });
    return res.status(500).json({ 
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
};

const requirePermission = (resource, action) => {
  return (req, res, next) => {
    try {
      // ✅ Proper null checking
      if (!req.user || !req.user.role) {
        logSecurityEvent('AUTHENTICATION_FAILED', {
          path: req.path,
          method: req.method,
          userAgent: req.get('User-Agent'),
          ipAddress: req.ip
        });
        return res.status(401).json({ 
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      // ✅ Normalize role comparison
      const userRole = req.user.role.toUpperCase();
      const userPermissions = ROLE_PERMISSIONS[userRole] || [];
      const requiredPermission = `${resource}:${action}`;

      if (!userPermissions.includes('*:*') && !userPermissions.includes(requiredPermission)) {
        logSecurityEvent('PERMISSION_DENIED', {
          path: req.path,
          method: req.method,
          requiredPermission,
          availablePermissions: userPermissions,
          userId: req.user.id,
          userRole,
          userAgent: req.get('User-Agent'),
          ipAddress: req.ip
        });
        return res.status(403).json({ 
          error: 'Access denied. Insufficient permissions.',
          code: 'INSUFFICIENT_PERMISSIONS',
          required: requiredPermission,
          available: userPermissions
        });
      }
      
      next();
    } catch (error) {
      console.error('Permission middleware error:', error);
      logSecurityEvent('MIDDLEWARE_ERROR', {
        path: req.path,
        method: req.method,
        error: error.message,
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip
      });
      return res.status(500).json({ 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  };
};

// Enhanced role hierarchy checking
const hasRole = (userRole, requiredRole) => {
  try {
    // ✅ Normalize role comparison
    const normalizedUserRole = userRole?.toUpperCase();
    const normalizedRequiredRole = requiredRole?.toUpperCase();
    
    if (!normalizedUserRole || !normalizedRequiredRole) {
      return false;
    }
    
    return ROLE_HIERARCHY[normalizedUserRole] >= ROLE_HIERARCHY[normalizedRequiredRole];
  } catch (error) {
    console.error('Role hierarchy check error:', error);
    return false;
  }
};

const getUserPermissions = (role) => {
  try {
    // ✅ Normalize role comparison
    const normalizedRole = role?.toUpperCase();
    return ROLE_PERMISSIONS[normalizedRole] || [];
  } catch (error) {
    console.error('Get user permissions error:', error);
    return [];
  }
};

const getRoleHierarchy = () => {
  return { ...ROLE_HIERARCHY };
};

// New utility functions for better security
const validateRole = (role) => {
  const normalizedRole = role?.toUpperCase();
  return Object.keys(ROLE_HIERARCHY).includes(normalizedRole);
};

const getInheritedPermissions = (role) => {
  try {
    const normalizedRole = role?.toUpperCase();
    const inheritedRoles = ROLE_INHERITANCE[normalizedRole] || [];
    let allPermissions = [];
    
    inheritedRoles.forEach(inheritedRole => {
      if (inheritedRole === 'ALL') {
        Object.values(BASE_PERMISSIONS).forEach(perms => {
          allPermissions.push(...perms);
        });
      } else if (BASE_PERMISSIONS[inheritedRole]) {
        allPermissions.push(...BASE_PERMISSIONS[inheritedRole]);
      }
    });
    
    return [...new Set(allPermissions)];
  } catch (error) {
    console.error('Get inherited permissions error:', error);
    return [];
  }
};

module.exports = {
  requireAdmin,
  requireRole,
  requireVerifiedDJ,
  requireRunnerOrVerifiedDJ,
  requirePermission,
  hasRole,
  getUserPermissions,
  getRoleHierarchy,
  validateRole,
  getInheritedPermissions,
  logSecurityEvent,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
  ROLE_INHERITANCE,
  BASE_PERMISSIONS
}; 