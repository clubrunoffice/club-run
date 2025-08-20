class MonitoringService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async logActivity(level, message, userId = null, metadata = null) {
    try {
      await this.prisma.systemLog.create({
        data: {
          level,
          message,
          userId,
          metadata
        }
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }

  async getSystemHealth() {
    try {
      const [
        totalUsers,
        activeUsers,
        totalVenues,
        recentCheckIns,
        activeMissions
      ] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({
          where: { lastLoginAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
        }),
        this.prisma.venue.count({ where: { isActive: true } }),
        this.prisma.checkIn.count({
          where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
        }),
        this.prisma.userMission.count({ where: { completed: false } })
      ]);

      return {
        status: 'healthy',
        metrics: {
          totalUsers,
          activeUsers,
          totalVenues,
          recentCheckIns,
          activeMissions
        },
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Health check error:', error);
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  async getSystemMetrics(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const [
        newUsers,
        totalCheckIns,
        totalExpenses,
        completedMissions,
        chatMessages
      ] = await Promise.all([
        this.prisma.user.count({
          where: { createdAt: { gte: startDate } }
        }),
        this.prisma.checkIn.count({
          where: { createdAt: { gte: startDate } }
        }),
        this.prisma.expense.aggregate({
          where: { createdAt: { gte: startDate } },
          _sum: { amount: true }
        }),
        this.prisma.userMission.count({
          where: { 
            completed: true,
            completedAt: { gte: startDate }
          }
        }),
        this.prisma.chatMessage.count({
          where: { createdAt: { gte: startDate } }
        })
      ]);

      return {
        period: `${days} days`,
        metrics: {
          newUsers,
          totalCheckIns,
          totalExpenses: totalExpenses._sum.amount || 0,
          completedMissions,
          chatMessages
        }
      };
    } catch (error) {
      console.error('Get system metrics error:', error);
      throw error;
    }
  }

  async logError(error, context = {}) {
    try {
      await this.logActivity('error', error.message, context.userId, {
        stack: error.stack,
        context
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  }

  async logInfo(message, metadata = null) {
    await this.logActivity('info', message, null, metadata);
  }

  async logWarning(message, metadata = null) {
    await this.logActivity('warn', message, null, metadata);
  }

  async logDebug(message, metadata = null) {
    await this.logActivity('debug', message, null, metadata);
  }
}

module.exports = MonitoringService; 