const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await req.prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        _count: {
          select: {
            checkIns: true,
            expenses: true,
            userMissions: true
          }
        },
        userMissions: {
          where: { completed: false },
          include: { mission: true },
          take: 5
        }
      }
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tokenBalance: user.tokenBalance,
        currentStreak: user.currentStreak,
        totalCheckIns: user._count.checkIns,
        missionsCompleted: user.missionsCompleted,
        level: user.level,
        theme: user.theme,
        badges: user.badges,
        activeMissions: user.userMissions,
        stats: {
          totalCheckIns: user._count.checkIns,
          totalExpenses: user._count.expenses,
          totalMissions: user._count.userMissions
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, theme, walletAddress } = req.body;
    const userId = req.user.id;

    const updateData = {};
    if (name) updateData.name = name;
    if (theme) updateData.theme = theme;
    if (walletAddress) updateData.walletAddress = walletAddress;

    const user = await req.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        theme: true,
        walletAddress: true,
        tokenBalance: true,
        currentStreak: true,
        level: true,
        badges: true
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const userId = req.user.id;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const [
      checkIns,
      expenses,
      missions,
      user
    ] = await Promise.all([
      req.prisma.checkIn.findMany({
        where: {
          userId,
          createdAt: { gte: startDate }
        },
        include: { venue: true },
        orderBy: { createdAt: 'desc' }
      }),
      req.prisma.expense.findMany({
        where: {
          userId,
          createdAt: { gte: startDate }
        },
        orderBy: { createdAt: 'desc' }
      }),
      req.prisma.userMission.findMany({
        where: {
          userId,
          completed: true,
          completedAt: { gte: startDate }
        },
        include: { mission: true }
      }),
      req.prisma.user.findUnique({
        where: { id: userId },
        select: {
          tokenBalance: true,
          currentStreak: true,
          totalCheckIns: true,
          missionsCompleted: true,
          level: true
        }
      })
    ]);

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalTokensEarned = checkIns.reduce((sum, checkIn) => sum + checkIn.tokens, 0);
    const missionRewards = missions.reduce((sum, um) => sum + um.mission.reward, 0);

    res.json({
      stats: {
        period: `${days} days`,
        checkIns: {
          count: checkIns.length,
          totalTokens: totalTokensEarned,
          venues: [...new Set(checkIns.map(c => c.venue.name))]
        },
        expenses: {
          count: expenses.length,
          totalAmount: totalSpent,
          byCategory: expenses.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
          }, {})
        },
        missions: {
          completed: missions.length,
          rewards: missionRewards
        },
        overall: {
          tokenBalance: user.tokenBalance,
          currentStreak: user.currentStreak,
          totalCheckIns: user.totalCheckIns,
          missionsCompleted: user.missionsCompleted,
          level: user.level
        }
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get user activity feed
router.get('/activity', authenticateToken, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const userId = req.user.id;

    const activities = await req.prisma.$queryRaw`
      SELECT 
        'check_in' as type,
        c.id,
        c.created_at as created_at,
        c.tokens,
        v.name as venue_name,
        v.id as venue_id
      FROM check_ins c
      JOIN venues v ON c.venue_id = v.id
      WHERE c.user_id = ${userId}
      
      UNION ALL
      
      SELECT 
        'expense' as type,
        e.id,
        e.created_at as created_at,
        e.amount as tokens,
        v.name as venue_name,
        v.id as venue_id
      FROM expenses e
      LEFT JOIN venues v ON e.venue_id = v.id
      WHERE e.user_id = ${userId}
      
      UNION ALL
      
      SELECT 
        'mission' as type,
        um.id,
        um.completed_at as created_at,
        m.reward as tokens,
        m.title as venue_name,
        NULL as venue_id
      FROM user_missions um
      JOIN missions m ON um.mission_id = m.id
      WHERE um.user_id = ${userId} AND um.completed = true
      
      ORDER BY created_at DESC
      LIMIT ${parseInt(limit)}
      OFFSET ${parseInt(offset)}
    `;

    res.json({
      activities,
      hasMore: activities.length === parseInt(limit)
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

module.exports = router; 