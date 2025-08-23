const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/rbac');
const router = express.Router();

// Get all teams for a curator
router.get('/', authenticateToken, checkRole(['CURATOR', 'ADMIN']), async (req, res) => {
  try {
    const userId = req.user.id;
    
    const teams = await req.prisma.team.findMany({
      where: { curatorId: userId },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            missionsCompleted: true,
            lastLoginAt: true
          }
        },
        missions: {
          where: { isActive: true },
          select: {
            id: true,
            title: true,
            status: true,
            budget: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            members: true,
            missions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ teams });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// Create a new team
router.post('/', authenticateToken, checkRole(['CURATOR', 'ADMIN']), async (req, res) => {
  try {
    const { name, description } = req.body;
    const curatorId = req.user.id;

    if (!name) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    const team = await req.prisma.team.create({
      data: {
        name,
        description,
        curatorId
      },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true
          }
        }
      }
    });

    res.json({
      message: 'Team created successfully',
      team
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ error: 'Failed to create team' });
  }
});

// Get team details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.user.id;

    const team = await req.prisma.team.findFirst({
      where: { 
        id: teamId,
        OR: [
          { curatorId: userId },
          { members: { some: { id: userId } } }
        ]
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            missionsCompleted: true,
            lastLoginAt: true,
            isActive: true
          }
        },
        missions: {
          include: {
            runner: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json({ team });
  } catch (error) {
    console.error('Get team details error:', error);
    res.status(500).json({ error: 'Failed to fetch team details' });
  }
});

// Update team
router.put('/:id', authenticateToken, checkRole(['CURATOR', 'ADMIN']), async (req, res) => {
  try {
    const teamId = req.params.id;
    const curatorId = req.user.id;
    const { name, description, isActive } = req.body;

    const team = await req.prisma.team.findFirst({
      where: { id: teamId, curatorId }
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const updatedTeam = await req.prisma.team.update({
      where: { id: teamId },
      data: {
        name: name || team.name,
        description: description !== undefined ? description : team.description,
        isActive: isActive !== undefined ? isActive : team.isActive
      },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true
          }
        }
      }
    });

    res.json({
      message: 'Team updated successfully',
      team: updatedTeam
    });
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({ error: 'Failed to update team' });
  }
});

// Invite runner to team
router.post('/:id/invite', authenticateToken, checkRole(['CURATOR', 'ADMIN']), async (req, res) => {
  try {
    const teamId = req.params.id;
    const curatorId = req.user.id;
    const { runnerEmail } = req.body;

    if (!runnerEmail) {
      return res.status(400).json({ error: 'Runner email is required' });
    }

    // Check if team exists and curator owns it
    const team = await req.prisma.team.findFirst({
      where: { id: teamId, curatorId }
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Find runner by email
    const runner = await req.prisma.user.findUnique({
      where: { email: runnerEmail }
    });

    if (!runner) {
      return res.status(404).json({ error: 'Runner not found' });
    }

    if (runner.role !== 'RUNNER') {
      return res.status(400).json({ error: 'User must be a runner to join teams' });
    }

    // Check if runner is already in the team
    const existingMember = await req.prisma.user.findFirst({
      where: { 
        id: runner.id,
        teamId: teamId
      }
    });

    if (existingMember) {
      return res.status(400).json({ error: 'Runner is already a member of this team' });
    }

    // Add runner to team
    await req.prisma.user.update({
      where: { id: runner.id },
      data: { teamId: teamId }
    });

    res.json({
      message: 'Runner invited to team successfully',
      runner: {
        id: runner.id,
        name: runner.name,
        email: runner.email,
        avatar: runner.avatar
      }
    });
  } catch (error) {
    console.error('Invite runner error:', error);
    res.status(500).json({ error: 'Failed to invite runner' });
  }
});

// Remove runner from team
router.delete('/:id/members/:runnerId', authenticateToken, checkRole(['CURATOR', 'ADMIN']), async (req, res) => {
  try {
    const teamId = req.params.id;
    const runnerId = req.params.runnerId;
    const curatorId = req.user.id;

    // Check if team exists and curator owns it
    const team = await req.prisma.team.findFirst({
      where: { id: teamId, curatorId }
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if runner is in the team
    const runner = await req.prisma.user.findFirst({
      where: { 
        id: runnerId,
        teamId: teamId
      }
    });

    if (!runner) {
      return res.status(404).json({ error: 'Runner not found in team' });
    }

    // Remove runner from team
    await req.prisma.user.update({
      where: { id: runnerId },
      data: { teamId: null }
    });

    res.json({
      message: 'Runner removed from team successfully'
    });
  } catch (error) {
    console.error('Remove runner error:', error);
    res.status(500).json({ error: 'Failed to remove runner' });
  }
});

// Get team members
router.get('/:id/members', authenticateToken, async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.user.id;

    // Check if user has access to this team
    const team = await req.prisma.team.findFirst({
      where: { 
        id: teamId,
        OR: [
          { curatorId: userId },
          { members: { some: { id: userId } } }
        ]
      }
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const members = await req.prisma.user.findMany({
      where: { teamId: teamId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        missionsCompleted: true,
        lastLoginAt: true,
        isActive: true
      },
      orderBy: { name: 'asc' }
    });

    res.json({ members });
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// Get team missions
router.get('/:id/missions', authenticateToken, async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.user.id;
    const { status } = req.query;

    // Check if user has access to this team
    const team = await req.prisma.team.findFirst({
      where: { 
        id: teamId,
        OR: [
          { curatorId: userId },
          { members: { some: { id: userId } } }
        ]
      }
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const whereClause = { teamId: teamId };
    if (status) {
      whereClause.status = status;
    }

    const missions = await req.prisma.p2pMission.findMany({
      where: whereClause,
      include: {
        curator: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        runner: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ missions });
  } catch (error) {
    console.error('Get team missions error:', error);
    res.status(500).json({ error: 'Failed to fetch team missions' });
  }
});

// Get team analytics
router.get('/:id/analytics', authenticateToken, checkRole(['CURATOR', 'ADMIN']), async (req, res) => {
  try {
    const teamId = req.params.id;
    const curatorId = req.user.id;

    // Check if team exists and curator owns it
    const team = await req.prisma.team.findFirst({
      where: { id: teamId, curatorId }
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Get team statistics
    const memberCount = await req.prisma.user.count({
      where: { teamId: teamId }
    });

    const missionStats = await req.prisma.p2pMission.groupBy({
      by: ['status'],
      where: { teamId: teamId },
      _count: {
        status: true
      }
    });

    const totalBudget = await req.prisma.p2pMission.aggregate({
      where: { 
        teamId: teamId,
        status: 'COMPLETED'
      },
      _sum: {
        budget: true
      }
    });

    const recentActivity = await req.prisma.p2pMission.findMany({
      where: { teamId: teamId },
      include: {
        runner: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 10
    });

    res.json({
      analytics: {
        memberCount,
        missionStats,
        totalBudget: totalBudget._sum.budget || 0,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Get team analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch team analytics' });
  }
});

// Leave team (for runners)
router.post('/:id/leave', authenticateToken, async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.user.id;

    // Check if user is a member of this team
    const user = await req.prisma.user.findFirst({
      where: { 
        id: userId,
        teamId: teamId
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'You are not a member of this team' });
    }

    // Remove user from team
    await req.prisma.user.update({
      where: { id: userId },
      data: { teamId: null }
    });

    res.json({
      message: 'Successfully left the team'
    });
  } catch (error) {
    console.error('Leave team error:', error);
    res.status(500).json({ error: 'Failed to leave team' });
  }
});

module.exports = router;
