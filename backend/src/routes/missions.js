const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get user missions
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type, completed } = req.query;
    const userId = req.user.id;

    const whereClause = { userId };
    if (completed !== undefined) {
      whereClause.completed = completed === 'true';
    }

    const missions = await req.prisma.userMission.findMany({
      where: whereClause,
      include: {
        mission: {
          where: type ? { type } : undefined
        }
      },
      orderBy: [
        { completed: 'asc' },
        { mission: { priority: 'desc' } },
        { createdAt: 'desc' }
      ]
    });

    const categorized = {
      daily: missions.filter(m => m.mission.type === 'daily'),
      weekly: missions.filter(m => m.mission.type === 'weekly'),
      special: missions.filter(m => m.mission.type === 'special'),
      completed: missions.filter(m => m.completed)
    };

    res.json({
      missions: categorized,
      stats: {
        total: missions.length,
        completed: missions.filter(m => m.completed).length,
        active: missions.filter(m => !m.completed).length,
        totalRewards: missions
          .filter(m => m.completed && m.rewardClaimed)
          .reduce((sum, m) => sum + m.mission.reward, 0)
      }
    });
  } catch (error) {
    console.error('Get missions error:', error);
    res.status(500).json({ error: 'Failed to fetch missions' });
  }
});

// Claim mission reward
router.post('/:id/claim', authenticateToken, async (req, res) => {
  try {
    const userMissionId = req.params.id;
    const userId = req.user.id;

    const userMission = await req.prisma.userMission.findFirst({
      where: { id: userMissionId, userId, completed: true, rewardClaimed: false },
      include: { mission: true }
    });

    if (!userMission) {
      return res.status(404).json({ error: 'Mission not found or already claimed' });
    }

    // Award tokens
    await req.prisma.$transaction([
      req.prisma.user.update({
        where: { id: userId },
        data: {
          tokenBalance: { increment: userMission.mission.reward },
          missionsCompleted: { increment: 1 }
        }
      }),
      req.prisma.userMission.update({
        where: { id: userMissionId },
        data: { rewardClaimed: true }
      })
    ]);

    // Broadcast update
    req.io.to(`user-${userId}`).emit('reward-claimed', {
      mission: userMission.mission.title,
      reward: userMission.mission.reward,
      newBalance: req.user.tokenBalance + userMission.mission.reward
    });

    res.json({
      message: 'Reward claimed successfully',
      reward: userMission.mission.reward,
      mission: userMission.mission.title
    });
  } catch (error) {
    console.error('Claim reward error:', error);
    res.status(500).json({ error: 'Failed to claim reward' });
  }
});

// Get available missions (not yet started)
router.get('/available', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const availableMissions = await req.prisma.mission.findMany({
      where: {
        isActive: true,
        NOT: {
          userMissions: { some: { userId } }
        }
      },
      orderBy: { priority: 'desc' }
    });

    res.json({ missions: availableMissions });
  } catch (error) {
    console.error('Get available missions error:', error);
    res.status(500).json({ error: 'Failed to fetch available missions' });
  }
});

// Start a mission
router.post('/:id/start', authenticateToken, async (req, res) => {
  try {
    const missionId = req.params.id;
    const userId = req.user.id;

    const mission = await req.prisma.mission.findFirst({
      where: { id: missionId, isActive: true }
    });

    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    // Check if already started
    const existingUserMission = await req.prisma.userMission.findFirst({
      where: { userId, missionId }
    });

    if (existingUserMission) {
      return res.status(409).json({ error: 'Mission already started' });
    }

    // Create user mission
    const userMission = await req.prisma.userMission.create({
      data: { userId, missionId },
      include: { mission: true }
    });

    res.json({
      message: 'Mission started successfully',
      userMission
    });
  } catch (error) {
    console.error('Start mission error:', error);
    res.status(500).json({ error: 'Failed to start mission' });
  }
});

module.exports = router; 