const OpenAI = require('openai');
const { createClient } = require('@supabase/supabase-js');

/**
 * 🎯 Role-Based Agent System for Club Run
 * 
 * This system provides role-specific AI agents that align with:
 * - RBAC role hierarchy and permissions
 * - LangGraph workflow integration
 * - Club Run's vision and mission
 * - Real-time workflow orchestration
 */

class RoleBasedAgentSystem {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
      baseURL: process.env.OPENROUTER_API_KEY ? 'https://openrouter.ai/api/v1' : undefined,
    });

    // Initialize Supabase if configured
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      this.supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
      );
      this.supabaseEnabled = true;
    } else {
      console.log('⚠️  Supabase not configured - using mock data');
      this.supabaseEnabled = false;
    }

    // Role-specific agent configurations
    this.roleAgents = {
      GUEST: {
        name: 'Platform Guide Agent',
        description: 'Helps guests explore Club Run features and benefits',
        capabilities: ['platform_overview', 'feature_explanation', 'signup_guidance'],
        color: '#6b7280'
      },
      DJ: {
        name: 'Music Curation Agent',
        description: 'Assists DJs with music submissions and playlist management',
        capabilities: ['music_submission_review', 'playlist_creation', 'library_management'],
        color: '#3b82f6'
      },
      VERIFIED_DJ: {
        name: 'Enhanced Music Agent',
        description: 'Advanced music curation with Serato integration',
        capabilities: ['serato_integration', 'advanced_curation', 'verification_tools'],
        color: '#10b981'
      },
      CLIENT: {
        name: 'Mission Management Agent',
        description: 'Helps clients create and manage missions',
        capabilities: ['mission_creation', 'p2p_collaboration', 'expense_tracking'],
        color: '#8b5cf6'
      },
      CURATOR: {
        name: 'Team Coordination Agent',
        description: 'Manages team collaboration and project coordination',
        capabilities: ['team_management', 'collaboration_coordination', 'project_tracking'],
        color: '#f59e0b'
      },
      OPERATIONS: {
        name: 'System Operations Agent',
        description: 'Monitors platform health and manages system operations',
        capabilities: ['system_monitoring', 'user_management', 'performance_analytics'],
        color: '#ef4444'
      },
      PARTNER: {
        name: 'Business Intelligence Agent',
        description: 'Provides business analytics and partnership insights',
        capabilities: ['business_analytics', 'partnership_insights', 'market_analysis'],
        color: '#06b6d4'
      },
      ADMIN: {
        name: 'System Administration Agent',
        description: 'Complete system control and oversight',
        capabilities: ['full_system_access', 'user_administration', 'platform_configuration'],
        color: '#dc2626'
      }
    };
  }

  /**
   * Get role-specific agent configuration
   * @param {string} role - User role
   * @returns {Object} Agent configuration
   */
  getAgentConfig(role) {
    return this.roleAgents[role] || this.roleAgents.GUEST;
  }

  /**
   * Process user query with role-specific agent
   * @param {string} query - User query
   * @param {string} role - User role
   * @param {Object} context - Additional context
   * @returns {Promise<Object>} Agent response
   */
  async processQuery(query, role, context = {}) {
    try {
      const agentConfig = this.getAgentConfig(role);
      const prompt = this.buildRoleSpecificPrompt(query, role, agentConfig, context);
      
      const completion = await this.openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1000
      });

      const response = completion.choices[0].message.content;
      
      return {
        success: true,
        role: role,
        agent: agentConfig.name,
        response: response,
        capabilities: agentConfig.capabilities,
        timestamp: new Date().toISOString(),
        model_used: process.env.AI_MODEL || 'gpt-4o-mini'
      };
    } catch (error) {
      console.error('Role-based agent error:', error);
      return {
        success: false,
        role: role,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Build role-specific prompt
   * @param {string} query - User query
   * @param {string} role - User role
   * @param {Object} agentConfig - Agent configuration
   * @param {Object} context - Additional context
   * @returns {string} Formatted prompt
   */
  buildRoleSpecificPrompt(query, role, agentConfig, context) {
    const basePrompt = `You are the ${agentConfig.name} for Club Run, a nightlife operations platform.

Your role: ${agentConfig.description}
Your capabilities: ${agentConfig.capabilities.join(', ')}

User Role: ${role}
User Query: ${query}

Context: ${JSON.stringify(context, null, 2)}

Please provide a helpful, role-appropriate response that aligns with Club Run's vision and the user's permissions.`;

    // Add role-specific instructions
    switch (role) {
      case 'GUEST':
        return `${basePrompt}

Focus on:
- Explaining Club Run features and benefits
- Encouraging sign-up with clear value propositions
- Providing helpful information about the platform
- Being welcoming and informative`;
      
      case 'DJ':
        return `${basePrompt}

Focus on:
- Music submission review and feedback
- Playlist creation and management
- Library organization and metadata
- Music curation best practices
- Understanding client needs for music selection`;
      
      case 'VERIFIED_DJ':
        return `${basePrompt}

Focus on:
- Advanced music curation techniques
- Serato integration and workflow optimization
- Verification and quality assurance
- Professional music industry insights
- Enhanced client collaboration`;
      
      case 'CLIENT':
        return `${basePrompt}

Focus on:
- Mission creation and management
- P2P collaboration opportunities
- Budget planning and expense tracking
- Finding the right DJs for events
- Mission success optimization`;
      
      case 'CURATOR':
        return `${basePrompt}

Focus on:
- Team management and coordination
- Project timeline optimization
- Collaboration workflow management
- Resource allocation and planning
- Multi-team coordination`;
      
      case 'OPERATIONS':
        return `${basePrompt}

Focus on:
- System health monitoring
- User verification and management
- Performance analytics and insights
- Platform optimization recommendations
- Operational efficiency improvements`;
      
      case 'PARTNER':
        return `${basePrompt}

Focus on:
- Business analytics and insights
- Partnership opportunities
- Market analysis and trends
- Revenue optimization strategies
- Strategic business recommendations`;
      
      case 'ADMIN':
        return `${basePrompt}

Focus on:
- Complete system oversight
- User administration and management
- Platform configuration and settings
- Security and compliance
- Strategic platform decisions`;
      
      default:
        return basePrompt;
    }
  }

  /**
   * Get role-specific quick actions
   * @param {string} role - User role
   * @returns {Array} Quick actions for the role
   */
  getQuickActions(role) {
    const actions = {
      GUEST: [
        { label: 'Learn About Features', action: 'explore_features' },
        { label: 'See How It Works', action: 'how_it_works' },
        { label: 'Sign Up Now', action: 'signup_guidance' }
      ],
      DJ: [
        { label: 'Review Submissions', action: 'review_submissions' },
        { label: 'Create Playlist', action: 'create_playlist' },
        { label: 'Manage Library', action: 'manage_library' }
      ],
      VERIFIED_DJ: [
        { label: 'Serato Integration', action: 'serato_setup' },
        { label: 'Advanced Curation', action: 'advanced_curation' },
        { label: 'Quality Assurance', action: 'quality_check' }
      ],
      CLIENT: [
        { label: 'Create Mission', action: 'create_mission' },
        { label: 'P2P Collaboration', action: 'p2p_setup' },
        { label: 'Track Expenses', action: 'expense_tracking' }
      ],
      CURATOR: [
        { label: 'Manage Teams', action: 'team_management' },
        { label: 'Coordinate Projects', action: 'project_coordination' },
        { label: 'Resource Planning', action: 'resource_allocation' }
      ],
      OPERATIONS: [
        { label: 'System Health', action: 'system_monitoring' },
        { label: 'User Management', action: 'user_administration' },
        { label: 'Performance Analytics', action: 'performance_analysis' }
      ],
      PARTNER: [
        { label: 'Business Analytics', action: 'business_insights' },
        { label: 'Market Analysis', action: 'market_research' },
        { label: 'Partnership Opportunities', action: 'partnership_insights' }
      ],
      ADMIN: [
        { label: 'System Overview', action: 'system_overview' },
        { label: 'User Administration', action: 'user_admin' },
        { label: 'Platform Configuration', action: 'platform_config' }
      ]
    };

    return actions[role] || actions.GUEST;
  }

  /**
   * Get role-specific dashboard insights
   * @param {string} role - User role
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Dashboard insights
   */
  async getDashboardInsights(role, userData = {}) {
    try {
      const agentConfig = this.getAgentConfig(role);
      const prompt = `As the ${agentConfig.name}, provide dashboard insights for a ${role} user.

User Data: ${JSON.stringify(userData, null, 2)}

Please provide:
1. Key metrics relevant to this role
2. Recent activity summary
3. Recommended actions
4. Performance insights
5. Upcoming opportunities

Format as JSON with these keys: metrics, activities, recommendations, insights, opportunities`;

      const completion = await this.openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 800
      });

      const response = completion.choices[0].message.content;
      
      try {
        const insights = JSON.parse(response);
        return {
          success: true,
          role: role,
          agent: agentConfig.name,
          insights: insights,
          timestamp: new Date().toISOString()
        };
      } catch (parseError) {
        return {
          success: true,
          role: role,
          agent: agentConfig.name,
          insights: {
            metrics: ['Data processing...'],
            activities: ['Analyzing recent activity...'],
            recommendations: ['Generating recommendations...'],
            insights: ['Processing insights...'],
            opportunities: ['Identifying opportunities...']
          },
          raw_response: response,
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('Dashboard insights error:', error);
      return {
        success: false,
        role: role,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Execute role-specific workflow
   * @param {string} role - User role
   * @param {string} action - Action to perform
   * @param {Object} data - Action data
   * @returns {Promise<Object>} Workflow result
   */
  async executeWorkflow(role, action, data = {}) {
    try {
      const agentConfig = this.getAgentConfig(role);
      const prompt = `As the ${agentConfig.name}, execute the following workflow action:

Action: ${action}
Data: ${JSON.stringify(data, null, 2)}
Role: ${role}

Please provide:
1. Action execution plan
2. Required steps
3. Expected outcomes
4. Risk assessment
5. Success criteria

Format as JSON with these keys: plan, steps, outcomes, risks, criteria`;

      const completion = await this.openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1000
      });

      const response = completion.choices[0].message.content;
      
      try {
        const workflow = JSON.parse(response);
        return {
          success: true,
          role: role,
          agent: agentConfig.name,
          action: action,
          workflow: workflow,
          timestamp: new Date().toISOString()
        };
      } catch (parseError) {
        return {
          success: true,
          role: role,
          agent: agentConfig.name,
          action: action,
          workflow: {
            plan: 'Workflow execution plan',
            steps: ['Step 1', 'Step 2', 'Step 3'],
            outcomes: ['Expected outcome'],
            risks: ['Risk assessment'],
            criteria: ['Success criteria']
          },
          raw_response: response,
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('Workflow execution error:', error);
      return {
        success: false,
        role: role,
        action: action,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get all available agents for system overview
   * @returns {Object} All agent configurations
   */
  getAllAgents() {
    return this.roleAgents;
  }

  /**
   * Validate role permissions for agent access
   * @param {string} role - User role
   * @param {string} capability - Required capability
   * @returns {boolean} Whether role has access
   */
  hasCapability(role, capability) {
    const agentConfig = this.getAgentConfig(role);
    return agentConfig.capabilities.includes(capability);
  }
}

module.exports = RoleBasedAgentSystem;
