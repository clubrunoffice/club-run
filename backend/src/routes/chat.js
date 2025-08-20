const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const copilotService = require('../services/copilotService');
const router = express.Router();

// Get chat history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const userId = req.user.id;

    const messages = await req.prisma.chatMessage.findMany({
      where: { userId },
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { createdAt: 'desc' }
    });

    const total = await req.prisma.chatMessage.count({ where: { userId } });

    res.json({
      messages: messages.reverse(), // Return in chronological order
      total,
      hasMore: total > parseInt(offset) + messages.length
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Send message to copilot
router.post('/message', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Process with AI Copilot
    const response = await copilotService.processCommand(
      req.prisma,
      userId,
      message.trim()
    );

    // Broadcast to WebSocket clients
    req.io.to(`user-${userId}`).emit('copilot-response', response);

    res.json({
      message: 'Message processed successfully',
      response
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Clear chat history
router.delete('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    await req.prisma.chatMessage.deleteMany({
      where: { userId }
    });

    res.json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    console.error('Clear chat history error:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
});

// Get chat statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const userId = req.user.id;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const stats = await req.prisma.chatMessage.groupBy({
      by: ['type'],
      where: {
        userId,
        createdAt: { gte: startDate }
      },
      _count: { id: true }
    });

    const totalMessages = await req.prisma.chatMessage.count({
      where: {
        userId,
        createdAt: { gte: startDate }
      }
    });

    const userMessages = stats.find(s => s.type === 'user')?._count.id || 0;
    const copilotMessages = stats.find(s => s.type === 'copilot')?._count.id || 0;

    res.json({
      stats: {
        period: `${days} days`,
        totalMessages,
        userMessages,
        copilotMessages,
        averageResponseTime: '2.5s' // This would need to be calculated from actual data
      }
    });
  } catch (error) {
    console.error('Get chat stats error:', error);
    res.status(500).json({ error: 'Failed to fetch chat statistics' });
  }
});

module.exports = router; 