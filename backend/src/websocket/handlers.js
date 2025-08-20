const copilotService = require('../services/copilotService');

module.exports = (io, prisma) => {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // User joins their personal room
    socket.on('join-user', (userId) => {
      socket.join(`user-${userId}`);
      socket.userId = userId;
      console.log(`User ${userId} joined room`);
    });

    // Handle chat messages
    socket.on('chat-message', async (data) => {
      try {
        const { message } = data;
        const userId = socket.userId;

        if (!userId || !message) {
          socket.emit('error', { message: 'Invalid message data' });
          return;
        }

        // Show typing indicator
        socket.to(`user-${userId}`).emit('copilot-typing', true);

        // Process with AI Copilot
        const response = await copilotService.processCommand(
          prisma, 
          userId, 
          message, 
          socket.id
        );

        // Stop typing indicator
        socket.to(`user-${userId}`).emit('copilot-typing', false);

        // Send response
        socket.emit('copilot-response', response);

        // Broadcast to other sessions if needed
        if (response.actions && response.actions.includes('refresh_dashboard')) {
          io.to(`user-${userId}`).emit('refresh-data', {
            type: 'dashboard',
            timestamp: new Date()
          });
        }
      } catch (error) {
        console.error('Chat message error:', error);
        socket.emit('error', { message: 'Failed to process message' });
      }
    });

    // Handle voice commands
    socket.on('voice-command', async (data) => {
      try {
        const { transcript } = data;
        const userId = socket.userId;

        // Process voice command same as text
        const response = await copilotService.processCommand(
          prisma,
          userId,
          transcript,
          socket.id
        );

        socket.emit('voice-response', response);
      } catch (error) {
        console.error('Voice command error:', error);
        socket.emit('error', { message: 'Failed to process voice command' });
      }
    });

    // Handle real-time updates
    socket.on('request-update', async (data) => {
      try {
        const { type } = data;
        const userId = socket.userId;

        let updateData = {};

        switch (type) {
          case 'missions':
            const missions = await prisma.userMission.findMany({
              where: { userId, completed: false },
              include: { mission: true }
            });
            updateData = { missions };
            break;

          case 'balance':
            const user = await prisma.user.findUnique({
              where: { id: userId },
              select: { tokenBalance: true, currentStreak: true }
            });
            updateData = user;
            break;

          case 'venues':
            const venues = await prisma.venue.findMany({
              where: { isActive: true },
              orderBy: { name: 'asc' }
            });
            updateData = { venues };
            break;
        }

        socket.emit('update-response', { type, data: updateData });
      } catch (error) {
        console.error('Update request error:', error);
        socket.emit('error', { message: 'Failed to get updates' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Broadcast system-wide updates
  const broadcastUpdate = (type, data, targetUsers = null) => {
    if (targetUsers) {
      targetUsers.forEach(userId => {
        io.to(`user-${userId}`).emit('system-update', { type, data });
      });
    } else {
      io.emit('system-update', { type, data });
    }
  };

  // Export for use in other services
  io.broadcastUpdate = broadcastUpdate;
}; 