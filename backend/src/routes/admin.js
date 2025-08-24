const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin, requireRole } = require('../middleware/rbac');
const router = express.Router();

const enhancedChatGPTService = require('../services/ai/EnhancedChatGPTService');

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
    const validRoles = ['GUEST', 'RUNNER', 'VERIFIED_DJ', 'CLIENT', 'CURATOR', 'OPERATIONS', 'PARTNER', 'ADMIN'];
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

// Get pending DJ verification requests (operations and admin only)
router.get('/dj-verification-requests', authenticateToken, requireRole(['OPERATIONS', 'ADMIN']), async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const users = await req.prisma.user.findMany({
      where: {
        role: 'RUNNER',
        isActive: true
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
        totalCheckIns: true,
        missionsCompleted: true,
        currentStreak: true,
        tokenBalance: true
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await req.prisma.user.count({
      where: {
        role: 'RUNNER',
        isActive: true
      }
    });

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get DJ verification requests error:', error);
    res.status(500).json({ error: 'Failed to get DJ verification requests' });
  }
});

// Verify DJ (upgrade from RUNNER to VERIFIED_DJ)
router.post('/verify-dj/:userId', authenticateToken, requireRole(['OPERATIONS', 'ADMIN']), async (req, res) => {
  try {
    const { userId } = req.params;
    const { verificationNotes } = req.body;

    // Check if user exists and is a RUNNER
    const user = await req.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'RUNNER') {
      return res.status(400).json({ error: 'User is not a RUNNER' });
    }

    // Update user role to VERIFIED_DJ
    const updatedUser = await req.prisma.user.update({
      where: { id: userId },
      data: { 
        role: 'VERIFIED_DJ',
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true
      }
    });

    // Log the verification
    await req.prisma.systemLog.create({
      data: {
        level: 'info',
        message: `DJ verified: ${user.name} (${user.email})`,
        userId: req.user.id,
        metadata: {
          targetUserId: userId,
          oldRole: 'RUNNER',
          newRole: 'VERIFIED_DJ',
          verifiedBy: req.user.id,
          verificationNotes: verificationNotes || null
        }
      }
    });

    res.json({
      message: 'DJ verified successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Verify DJ error:', error);
    res.status(500).json({ error: 'Failed to verify DJ' });
  }
});

// Reject DJ verification (keep as RUNNER)
router.post('/reject-dj/:userId', authenticateToken, requireRole(['OPERATIONS', 'ADMIN']), async (req, res) => {
  try {
    const { userId } = req.params;
    const { rejectionReason } = req.body;

    // Check if user exists and is a RUNNER
    const user = await req.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'RUNNER') {
      return res.status(400).json({ error: 'User is not a RUNNER' });
    }

    // Log the rejection
    await req.prisma.systemLog.create({
      data: {
        level: 'warning',
        message: `DJ verification rejected: ${user.name} (${user.email})`,
        userId: req.user.id,
        metadata: {
          targetUserId: userId,
          role: 'RUNNER',
          rejectedBy: req.user.id,
          rejectionReason: rejectionReason || 'No reason provided'
        }
      }
    });

    res.json({
      message: 'DJ verification rejected',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Reject DJ error:', error);
    res.status(500).json({ error: 'Failed to reject DJ verification' });
  }
});

// Get DJ verification statistics
router.get('/dj-verification-stats', authenticateToken, requireRole(['OPERATIONS', 'ADMIN']), async (req, res) => {
  try {
    const [
      totalRunners,
      verifiedDJs,
      pendingVerifications,
      recentVerifications
    ] = await Promise.all([
      req.prisma.user.count({ where: { role: 'RUNNER' } }),
      req.prisma.user.count({ where: { role: 'VERIFIED_DJ' } }),
      req.prisma.user.count({ where: { role: 'RUNNER', isActive: true } }),
      req.prisma.systemLog.count({
        where: {
          message: { contains: 'DJ verified' },
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
        }
      })
    ]);

    res.json({
      stats: {
        totalRunners,
        verifiedDJs,
        pendingVerifications,
        recentVerifications,
        verificationRate: totalRunners > 0 ? (verifiedDJs / totalRunners * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    console.error('Get DJ verification stats error:', error);
    res.status(500).json({ error: 'Failed to get DJ verification statistics' });
  }
});

// Get ChatGPT cost analytics
router.get('/chatgpt-analytics', authenticateToken, requireRole(['OPERATIONS', 'ADMIN']), async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const analytics = await enhancedChatGPTService.getCostAnalytics(req.prisma, parseInt(days));
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('ChatGPT analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch ChatGPT analytics' });
  }
});

// Get user's ChatGPT usage
router.get('/chatgpt-usage/:userId', authenticateToken, requireRole(['OPERATIONS', 'ADMIN']), async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 7 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const usage = await req.prisma.chatGPTCostLog.findMany({
      where: {
        userId,
        timestamp: { gte: startDate }
      },
      orderBy: { timestamp: 'desc' }
    });
    
    const totalCost = usage.reduce((sum, log) => sum + log.cost, 0);
    const totalQueries = usage.length;
    
    res.json({
      success: true,
      data: {
        usage,
        totalCost,
        totalQueries,
        averageCostPerQuery: totalQueries > 0 ? totalCost / totalQueries : 0
      }
    });
  } catch (error) {
    console.error('User ChatGPT usage error:', error);
    res.status(500).json({ error: 'Failed to fetch user ChatGPT usage' });
  }
});

module.exports = router; 