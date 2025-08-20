const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/rbac');
const router = express.Router();

// Get all users with their roles (admin only)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await req.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Update user role (admin only)
router.patch('/users/:userId/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ['GUEST', 'RUNNER', 'CLIENT', 'OPERATIONS', 'PARTNER', 'ADMIN'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Update user role
    const updatedUser = await req.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true
      }
    });

    // Log the role change
    await req.prisma.systemLog.create({
      data: {
        level: 'info',
        message: `User role changed`,
        userId: req.user.id,
        metadata: {
          targetUserId: userId,
          oldRole: req.body.oldRole,
          newRole: role,
          changedBy: req.user.id
        }
      }
    });

    res.json({
      message: 'User role updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Get system logs (admin only)
router.get('/logs', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, level } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (level) {
      where.level = level;
    }

    const logs = await req.prisma.systemLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    const total = await req.prisma.systemLog.count({ where });

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Failed to get system logs' });
  }
});

// Get system statistics (admin only)
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalCheckIns,
      totalExpenses,
      roleDistribution
    ] = await Promise.all([
      req.prisma.user.count(),
      req.prisma.user.count({ where: { isActive: true } }),
      req.prisma.checkIn.count(),
      req.prisma.expense.count(),
      req.prisma.user.groupBy({
        by: ['role'],
        _count: { role: true }
      })
    ]);

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        totalCheckIns,
        totalExpenses,
        roleDistribution: roleDistribution.reduce((acc, item) => {
          acc[item.role] = item._count.role;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get system statistics' });
  }
});

module.exports = router; 