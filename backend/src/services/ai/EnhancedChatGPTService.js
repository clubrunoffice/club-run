const axios = require('axios');
const crypto = require('crypto');

class EnhancedChatGPTService {
  constructor() {
    this.openaiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
    
    // Role-based daily cost limits (in USD)
    this.dailyLimits = {
      GUEST: 0,        // No ChatGPT access for guests
      RUNNER: 0.50,    // $0.50/day for runners
      DJ: 1.00,        // $1.00/day for DJs
      VERIFIED_DJ: 2.00, // $2.00/day for verified DJs
      CLIENT: 1.50,    // $1.50/day for clients
      CURATOR: 2.50,   // $2.50/day for curators
      OPERATIONS: 5.00, // $5.00/day for operations
      PARTNER: 3.00,   // $3.00/day for partners
      ADMIN: 10.00     // $10.00/day for admins
    };

    // Simple queries that can be handled locally (FREE)
    this.localQueries = [
      'create mission', 'check in', 'submit expense', 'show missions',
      'show balance', 'show stats', 'help', 'about', 'features',
      'music submissions', 'music library', 'team management',
      'user management', 'analytics', 'settings', 'profile'
    ];

    // Complex queries that need ChatGPT
    this.complexQueries = [
      'plan', 'strategy', 'advice', 'recommend', 'suggest', 'how to',
      'best practice', 'optimize', 'improve', 'festival', 'event',
      'marketing', 'promotion', 'collaboration', 'partnership'
    ];
  }

  /**
   * Main method to process user queries with smart routing
   */
  async processQuery(prisma, userId, message, userRole = 'GUEST') {
    try {
      // Step 1: Sanitize input data
      const sanitizedMessage = this.sanitizeInput(message);
      
      // Step 2: Check if query can be handled locally
      if (this.shouldHandleLocally(sanitizedMessage)) {
        return await this.handleLocalQuery(prisma, userId, sanitizedMessage, userRole);
      }

      // Step 3: Check cost limits for ChatGPT access
      const costCheck = await this.checkCostLimits(prisma, userId, userRole);
      if (!costCheck.allowed) {
        return {
          success: false,
          message: `I've reached my daily limit for ${userRole} users. I can still help with basic tasks like creating missions, checking in, and showing your stats. Try again tomorrow!`,
          fallback: true,
          localResponse: await this.handleLocalQuery(prisma, userId, sanitizedMessage, userRole)
        };
      }

      // Step 4: Route to ChatGPT with enhanced security
      const chatGPTResponse = await this.routeToChatGPT(sanitizedMessage, userRole, userId);
      
      // Step 5: Log the cost
      await this.logCost(prisma, userId, costCheck.estimatedCost);

      return {
        success: true,
        message: chatGPTResponse,
        source: 'chatgpt',
        cost: costCheck.estimatedCost
      };

    } catch (error) {
      console.error('Enhanced ChatGPT error:', error);
      
      // Always provide fallback response
      return {
        success: false,
        message: "I'm having trouble with that request, but I can help with basic tasks. What would you like to do?",
        fallback: true,
        localResponse: await this.handleLocalQuery(prisma, userId, message, userRole)
      };
    }
  }

  /**
   * Sanitize input to remove sensitive data
   */
  sanitizeInput(message) {
    let sanitized = message;

    // Remove email addresses
    sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');
    
    // Remove phone numbers
    sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]');
    
    // Remove SSN patterns
    sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]');
    
    // Remove credit card numbers
    sanitized = sanitized.replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, '[CARD]');
    
    // Remove passwords (common patterns)
    sanitized = sanitized.replace(/password[:\s]*[^\s]+/gi, 'password: [REDACTED]');
    sanitized = sanitized.replace(/pass[:\s]*[^\s]+/gi, 'pass: [REDACTED]');
    
    // Remove API keys
    sanitized = sanitized.replace(/sk-[a-zA-Z0-9]{48}/g, '[API_KEY]');
    
    // Remove user IDs (hash them instead)
    sanitized = sanitized.replace(/\buser_id[:\s]*[^\s]+/gi, 'user_id: [HASHED]');
    
    return sanitized;
  }

  /**
   * Determine if query should be handled locally
   */
  shouldHandleLocally(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for simple queries
    for (const query of this.localQueries) {
      if (lowerMessage.includes(query)) {
        return true;
      }
    }
    
    // Check for complex queries that need ChatGPT
    for (const query of this.complexQueries) {
      if (lowerMessage.includes(query)) {
        return false;
      }
    }
    
    // Default to local for short messages
    return message.length < 50;
  }

  /**
   * Handle queries locally (FREE)
   */
  async handleLocalQuery(prisma, userId, message, userRole) {
    const lowerMessage = message.toLowerCase();
    
    // Role-based local responses
    const responses = {
      GUEST: {
        'help': "Welcome to Club Run! I can help you learn about our platform. What would you like to know?",
        'about': "Club Run is a nightlife operations platform connecting DJs, venues, and clients.",
        'features': "Our features include mission management, music curation, team collaboration, and more!",
        'sign up': "Ready to join? Click the sign up button to create your account and start your journey!"
      },
      RUNNER: {
        'create mission': "I can help you browse available missions. Check the mission board for opportunities!",
        'check in': "I can help you check into venues. Just let me know which venue you're at!",
        'submit expense': "I can help you log expenses. What amount and category should I record?",
        'show missions': "I'll show you your active missions and progress. Let me fetch that for you!",
        'show balance': "I'll check your current token balance for you.",
        'show stats': "I'll display your statistics including check-ins, missions completed, and more!"
      },
      DJ: {
        'music submissions': "I can help you review and manage music submissions. Check your music dashboard!",
        'music library': "I'll show you your music library and playlists. Let me fetch that for you!",
        'create playlist': "I can help you create and manage playlists. What type of playlist are you thinking?",
        'serato': "I can help you connect and manage your Serato integration. Check your Serato settings!"
      },
      CLIENT: {
        'create mission': "I can help you create a new mission. What type of mission are you looking to create?",
        'p2p missions': "I'll show you your P2P missions and collaborations. Let me fetch that for you!",
        'manage bookings': "I can help you manage your bookings and track mission progress.",
        'payments': "I can help you send payments and track your financial transactions."
      },
      CURATOR: {
        'team management': "I can help you manage your teams and coordinate collaborations.",
        'create p2p mission': "I can help you create P2P missions for team collaboration.",
        'coordinate': "I can help you coordinate team activities and manage collaborations."
      },
      OPERATIONS: {
        'user management': "I can help you manage users and verify accounts. Check the admin panel!",
        'analytics': "I'll show you system analytics and performance metrics.",
        'system': "I can help you monitor system operations and ensure quality control."
      }
    };

    // Get role-specific responses
    const roleResponses = responses[userRole] || responses.GUEST;
    
    // Find matching response
    for (const [key, response] of Object.entries(roleResponses)) {
      if (lowerMessage.includes(key)) {
        return {
          success: true,
          message: response,
          source: 'local',
          cost: 0
        };
      }
    }

    // Default response
    return {
      success: true,
      message: "I can help you with that! What specific aspect would you like assistance with?",
      source: 'local',
      cost: 0
    };
  }

  /**
   * Check if user has exceeded daily cost limits
   */
  async checkCostLimits(prisma, userId, userRole) {
    const dailyLimit = this.dailyLimits[userRole] || 0;
    
    if (dailyLimit === 0) {
      return { allowed: false, estimatedCost: 0 };
    }

    // Get today's usage
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const usage = await prisma.chatGPTCostLog.findMany({
      where: {
        userId,
        createdAt: { gte: today }
      }
    });

    const totalUsed = usage.reduce((sum, log) => sum + log.cost, 0);
    const estimatedCost = 0.002; // Average cost per ChatGPT query
    
    return {
      allowed: (totalUsed + estimatedCost) <= dailyLimit,
      estimatedCost,
      totalUsed,
      remaining: dailyLimit - totalUsed
    };
  }

  /**
   * Route query to ChatGPT with enhanced security
   */
  async routeToChatGPT(message, userRole, userId) {
    // Hash user ID for privacy
    const hashedUserId = crypto.createHash('sha256').update(userId.toString()).digest('hex').substring(0, 8);
    
    // Create role-specific context
    const roleContext = this.getRoleContext(userRole);
    
    const prompt = `
You are an AI assistant for Club Run, a nightlife operations platform. 
User Role: ${userRole}
User ID: ${hashedUserId}

${roleContext}

User Query: "${message}"

Provide a helpful, professional response that's specific to their role and the Club Run platform. 
Keep responses concise but informative. Focus on practical advice and actionable steps.

Response:`;

    try {
      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('ChatGPT API error:', error);
      throw new Error('ChatGPT service temporarily unavailable');
    }
  }

  /**
   * Get role-specific context for ChatGPT
   */
  getRoleContext(userRole) {
    const contexts = {
      RUNNER: "You're helping a mission runner who executes tasks and checks into venues. Focus on mission completion, venue check-ins, and earning tokens.",
      DJ: "You're helping a DJ who curates music and manages playlists. Focus on music curation, playlist management, and Serato integration.",
      VERIFIED_DJ: "You're helping a verified DJ with enhanced music curation capabilities. Focus on advanced music features, Serato integration, and professional advice.",
      CLIENT: "You're helping a client who creates missions and manages bookings. Focus on mission creation, P2P collaborations, and client management.",
      CURATOR: "You're helping a curator who manages teams and coordinates collaborations. Focus on team management, P2P missions, and collaboration strategies.",
      OPERATIONS: "You're helping an operations manager who monitors the platform. Focus on system management, user verification, and operational efficiency.",
      PARTNER: "You're helping a business partner. Focus on partnership opportunities, analytics, and business development.",
      ADMIN: "You're helping a system administrator. Focus on system configuration, user management, and platform administration."
    };

    return contexts[userRole] || "You're helping a Club Run user. Provide general assistance with the platform.";
  }

  /**
   * Log ChatGPT usage cost
   */
  async logCost(prisma, userId, cost) {
    try {
      await prisma.chatGPTCostLog.create({
        data: {
          userId,
          cost,
          timestamp: new Date()
        }
      });
    } catch (error) {
      console.error('Failed to log ChatGPT cost:', error);
    }
  }

  /**
   * Get cost analytics for admin dashboard
   */
  async getCostAnalytics(prisma, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const costs = await prisma.chatGPTCostLog.groupBy({
      by: ['userId'],
      where: {
        timestamp: { gte: startDate }
      },
      _sum: {
        cost: true
      },
      _count: {
        id: true
      }
    });

    const totalCost = costs.reduce((sum, record) => sum + record._sum.cost, 0);
    const totalQueries = costs.reduce((sum, record) => sum + record._count.id, 0);

    return {
      totalCost,
      totalQueries,
      averageCostPerQuery: totalQueries > 0 ? totalCost / totalQueries : 0,
      userBreakdown: costs
    };
  }
}

module.exports = new EnhancedChatGPTService();
