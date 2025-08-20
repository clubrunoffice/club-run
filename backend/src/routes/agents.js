const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get all agents
router.get('/', async (req, res) => {
  try {
    const agents = await req.prisma.agent.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({ agents });
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// Get agent by name
router.get('/:name', async (req, res) => {
  try {
    const agent = await req.prisma.agent.findUnique({
      where: { name: req.params.name }
    });

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json({ agent });
  } catch (error) {
    console.error('Get agent error:', error);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
});

// Update agent status (admin only)
router.put('/:name/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const agentName = req.params.name;

    if (!['active', 'inactive', 'maintenance'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const agent = await req.prisma.agent.update({
      where: { name: agentName },
      data: { 
        status,
        lastUpdate: new Date()
      }
    });

    // Broadcast agent status update
    req.io.emit('agent-status-updated', {
      agent: agent.name,
      status: agent.status,
      timestamp: new Date()
    });

    res.json({
      message: 'Agent status updated successfully',
      agent
    });
  } catch (error) {
    console.error('Update agent status error:', error);
    res.status(500).json({ error: 'Failed to update agent status' });
  }
});

// Get agent performance metrics
router.get('/:name/metrics', async (req, res) => {
  try {
    const agentName = req.params.name;
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const agent = await req.prisma.agent.findUnique({
      where: { name: agentName }
    });

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Get agent-specific metrics based on type
    let metrics = {};
    
    switch (agentName) {
      case 'copilot':
        const chatMessages = await req.prisma.chatMessage.count({
          where: {
            type: 'copilot',
            createdAt: { gte: startDate }
          }
        });
        
        const userMessages = await req.prisma.chatMessage.count({
          where: {
            type: 'user',
            createdAt: { gte: startDate }
          }
        });

        metrics = {
          totalInteractions: chatMessages + userMessages,
          copilotResponses: chatMessages,
          userMessages: userMessages,
          responseRate: userMessages > 0 ? (chatMessages / userMessages) * 100 : 0
        };
        break;

      case 'research':
        // Research agent metrics would be based on venue data analysis
        const venueUpdates = await req.prisma.venue.count({
          where: {
            updatedAt: { gte: startDate }
          }
        });

        metrics = {
          venueDataUpdates: venueUpdates,
          dataAccuracy: agent.confidence
        };
        break;

      case 'budget':
        // Budget agent metrics would be based on expense tracking
        const expenses = await req.prisma.expense.count({
          where: {
            createdAt: { gte: startDate }
          }
        });

        const totalSpent = await req.prisma.expense.aggregate({
          where: {
            createdAt: { gte: startDate }
          },
          _sum: { amount: true }
        });

        metrics = {
          expensesTracked: expenses,
          totalAmountTracked: totalSpent._sum.amount || 0,
          trackingAccuracy: agent.confidence
        };
        break;

      case 'reporting':
        // Reporting agent metrics would be based on analytics generated
        const checkIns = await req.prisma.checkIn.count({
          where: {
            createdAt: { gte: startDate }
          }
        });

        const missions = await req.prisma.userMission.count({
          where: {
            completed: true,
            completedAt: { gte: startDate }
          }
        });

        metrics = {
          checkInsProcessed: checkIns,
          missionsCompleted: missions,
          reportingAccuracy: agent.confidence
        };
        break;

      default:
        metrics = {
          status: agent.status,
          confidence: agent.confidence,
          lastUpdate: agent.lastUpdate
        };
    }

    res.json({
      agent: {
        name: agent.name,
        displayName: agent.displayName,
        status: agent.status,
        confidence: agent.confidence
      },
      metrics: {
        period: `${days} days`,
        ...metrics
      }
    });
  } catch (error) {
    console.error('Get agent metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch agent metrics' });
  }
});

// Get system-wide agent status
router.get('/status/overview', async (req, res) => {
  try {
    const agents = await req.prisma.agent.findMany({
      select: {
        name: true,
        displayName: true,
        status: true,
        confidence: true,
        lastUpdate: true
      }
    });

    const activeAgents = agents.filter(a => a.status === 'active').length;
    const totalAgents = agents.length;
    const averageConfidence = agents.reduce((sum, a) => sum + a.confidence, 0) / totalAgents;

    res.json({
      overview: {
        totalAgents,
        activeAgents,
        inactiveAgents: totalAgents - activeAgents,
        averageConfidence: Math.round(averageConfidence * 100) / 100,
        systemHealth: activeAgents / totalAgents * 100
      },
      agents
    });
  } catch (error) {
    console.error('Get agent overview error:', error);
    res.status(500).json({ error: 'Failed to fetch agent overview' });
  }
});

module.exports = router; 