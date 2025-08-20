const requireAdmin = (req, res, next) => {
  // Check if user has admin role
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      error: 'Access denied. Admin privileges required.' 
    });
  }
  next();
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient privileges.' 
      });
    }
    next();
  };
};

const requirePermission = (resource, action) => {
  return (req, res, next) => {
    // For now, we'll use role-based checks
    // In a more complex system, you'd check specific permissions
    const rolePermissions = {
      ADMIN: ['*:*'], // All permissions
      OPERATIONS: ['user:read', 'stats:read', 'logs:read'],
      PARTNER: ['user:read', 'stats:read'],
      CLIENT: ['user:read'],
      RUNNER: ['user:read'],
      GUEST: ['public:read'] // Limited public access
    };

    const userPermissions = rolePermissions[req.user.role] || [];
    const requiredPermission = `${resource}:${action}`;

    if (!userPermissions.includes('*:*') && !userPermissions.includes(requiredPermission)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.' 
      });
    }
    next();
  };
};

module.exports = {
  requireAdmin,
  requireRole,
  requirePermission
}; 