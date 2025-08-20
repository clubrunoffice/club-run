const axios = require('axios');

class CopilotService {
  constructor() {
    this.openRouterKey = process.env.OPENROUTER_API_KEY;
    this.baseURL = 'https://openrouter.ai/api/v1';
    this.model = process.env.AI_MODEL || 'meta-llama/llama-3.1-8b-instruct:free';
  }

  async processCommand(prisma, userId, message, socketId = null) {
    try {
      // Get user context
      const user = await this.getUserContext(prisma, userId);
      
      // Analyze intent
      const intent = await this.analyzeIntent(message, user);
      
      // Execute action
      const result = await this.executeAction(prisma, userId, intent);
      
      // Generate natural response
      const response = await this.generateResponse(intent, result, user);
      
      // Log conversation
      await prisma.chatMessage.createMany({
        data: [
          { userId, type: 'user', message },
          { userId, type: 'copilot', message: response.message, metadata: result }
        ]
      });

      return {
        success: true,
        message: response.message,
        actions: response.actions || [],
        data: result.data || null
      };
    } catch (error) {
      console.error('Copilot error:', error);
      return {
        success: false,
        message: "I'm having trouble processing that request. Please try again.",
        error: error.message
      };
    }
  }

  async getUserContext(prisma, userId) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userMissions: {
          include: { mission: true },
          where: { completed: false }
        },
        checkIns: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { venue: true }
        }
      }
    });
  }

  async analyzeIntent(message, userContext) {
    const prompt = this.buildIntentPrompt(message, userContext);
    
    const response = await axios.post(`${this.baseURL}/chat/completions`, {
      model: this.model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.3
    }, {
      headers: {
        'Authorization': `Bearer ${this.openRouterKey}`,
        'Content-Type': 'application/json'
      }
    });

    try {
      return JSON.parse(response.data.choices[0].message.content);
    } catch (parseError) {
      console.error('Intent parsing error:', parseError);
      return { action: 'general_query', params: {}, confidence: 0.5 };
    }
  }

  buildIntentPrompt(message, userContext) {
    return `
You are an AI assistant for Club Run, a nightlife operations app. Analyze the user's message and extract their intent.

User Context:
- Token Balance: ${userContext.tokenBalance}
- Current Streak: ${userContext.currentStreak}
- Active Missions: ${userContext.userMissions.length}
- Recent Venues: ${userContext.checkIns.map(c => c.venue.name).join(', ')}

User Message: "${message}"

Possible Actions:
- check_in: User wants to check into a venue
- show_missions: Show mission progress
- log_expense: Log an expense
- show_venues: Show venue information
- theme_toggle: Change app theme
- show_balance: Show token balance
- show_stats: Show user statistics
- general_query: General question/conversation

Return JSON format:
{
  "action": "action_name",
  "params": {
    "venue": "venue name if applicable",
    "amount": "expense amount if applicable",
    "category": "expense category if applicable",
    "theme": "light/dark if applicable"
  },
  "confidence": 0.95
}
`;
  }

  async executeAction(prisma, userId, intent) {
    switch (intent.action) {
      case 'check_in':
        return await this.handleCheckIn(prisma, userId, intent.params);
      case 'show_missions':
        return await this.showMissions(prisma, userId);
      case 'log_expense':
        return await this.logExpense(prisma, userId, intent.params);
      case 'show_venues':
        return await this.showVenues(prisma, intent.params);
      case 'theme_toggle':
        return await this.toggleTheme(prisma, userId, intent.params);
      case 'show_balance':
        return await this.showBalance(prisma, userId);
      case 'show_stats':
        return await this.showStats(prisma, userId);
      default:
        return { success: true, data: null };
    }
  }

  async handleCheckIn(prisma, userId, params) {
    try {
      // Find venue by name (fuzzy matching)
      const venue = await prisma.venue.findFirst({
        where: {
          name: { contains: params.venue, mode: 'insensitive' },
          isActive: true
        }
      });

      if (!venue) {
        return {
          success: false,
          message: `I couldn't find a venue matching "${params.venue}". Could you check the spelling?`
        };
      }

      // Check if already checked in recently (prevent duplicates)
      const recentCheckIn = await prisma.checkIn.findFirst({
        where: {
          userId,
          venueId: venue.id,
          createdAt: { gte: new Date(Date.now() - 2 * 60 * 60 * 1000) } // 2 hours
        }
      });

      if (recentCheckIn) {
        return {
          success: false,
          message: `You've already checked into ${venue.name} recently. Try again later!`
        };
      }

      // Create check-in
      const checkIn = await prisma.checkIn.create({
        data: {
          userId,
          venueId: venue.id,
          tokens: venue.checkInReward,
          verified: true
        }
      });

      // Update user stats
      await prisma.user.update({
        where: { id: userId },
        data: {
          tokenBalance: { increment: venue.checkInReward },
          totalCheckIns: { increment: 1 }
        }
      });

      // Update missions
      await this.updateMissions(prisma, userId, 'check_in', { venueId: venue.id });

      return {
        success: true,
        data: { venue, tokens: venue.checkInReward, checkIn },
        actions: ['update_balance', 'update_missions']
      };
    } catch (error) {
      console.error('Check-in error:', error);
      return { success: false, message: 'Check-in failed. Please try again.' };
    }
  }

  async showMissions(prisma, userId) {
    const missions = await prisma.userMission.findMany({
      where: { userId, completed: false },
      include: { mission: true },
      orderBy: { mission: { priority: 'desc' } }
    });

    return {
      success: true,
      data: { missions },
      count: missions.length
    };
  }

  async logExpense(prisma, userId, params) {
    if (!params.amount || isNaN(params.amount)) {
      return { success: false, message: 'Please specify a valid amount.' };
    }

    const expense = await prisma.expense.create({
      data: {
        userId,
        amount: parseFloat(params.amount),
        category: params.category || 'other',
        description: params.description || 'Logged via copilot'
      }
    });

    // Update budget mission if exists
    await this.updateMissions(prisma, userId, 'budget', { amount: expense.amount });

    return {
      success: true,
      data: { expense },
      actions: ['update_missions']
    };
  }

  async updateMissions(prisma, userId, actionType, actionData) {
    try {
      const relevantMissions = await prisma.userMission.findMany({
        where: {
          userId,
          completed: false,
          mission: {
            category: actionType,
            isActive: true
          }
        },
        include: { mission: true }
      });

      for (const userMission of relevantMissions) {
        let progressIncrement = 1;
        
        // Specific logic for different mission types
        if (actionType === 'budget' && actionData.amount) {
          progressIncrement = Math.floor(actionData.amount / 10); // 1 progress per $10
        }

        const newProgress = Math.min(
          userMission.progress + progressIncrement,
          userMission.mission.target
        );

        const isCompleted = newProgress >= userMission.mission.target;

        await prisma.userMission.update({
          where: { id: userMission.id },
          data: {
            progress: newProgress,
            completed: isCompleted,
            completedAt: isCompleted ? new Date() : null
          }
        });

        // Award mission completion tokens
        if (isCompleted && !userMission.rewardClaimed) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              tokenBalance: { increment: userMission.mission.reward },
              missionsCompleted: { increment: 1 }
            }
          });

          await prisma.userMission.update({
            where: { id: userMission.id },
            data: { rewardClaimed: true }
          });
        }
      }
    } catch (error) {
      console.error('Mission update error:', error);
    }
  }

  async generateResponse(intent, result, userContext) {
    if (!result.success) {
      return { message: result.message };
    }

    switch (intent.action) {
      case 'check_in':
        const venue = result.data.venue;
        const tokens = result.data.tokens;
        return {
          message: `✅ Successfully checked into ${venue.name}! You earned ${tokens} tokens. ${this.getMissionUpdate(result)}`,
          actions: ['refresh_dashboard', 'update_tokens']
        };

      case 'show_missions':
        const missions = result.data.missions;
        let missionText = '📊 Your Active Missions:\n\n';
        missions.forEach(um => {
          const progress = `${um.progress}/${um.mission.target}`;
          const percentage = Math.round((um.progress / um.mission.target) * 100);
          missionText += `-  **${um.mission.title}**: ${progress} (${percentage}%)\n`;
          missionText += `  Reward: ${um.mission.reward} tokens\n\n`;
        });
        return { message: missionText };

      case 'log_expense':
        const amount = result.data.expense.amount;
        const category = result.data.expense.category;
        return {
          message: `💰 Logged $${amount} expense for ${category}. Your budget tracking is updated!`,
          actions: ['refresh_budget']
        };

      default:
        return { message: 'Action completed successfully!' };
    }
  }

  getMissionUpdate(result) {
    // Check if any missions were completed as part of this action
    if (result.actions && result.actions.includes('mission_completed')) {
      return ' 🎉 You also completed a mission!';
    }
    return '';
  }
}

module.exports = new CopilotService(); 