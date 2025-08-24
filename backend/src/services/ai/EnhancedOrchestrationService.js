const ResearchAgent = require('../../agents/ResearchAgent');
const MissionAssignmentAgent = require('../../agents/MissionAssignmentAgent');
const ReportingAgent = require('../../agents/ReportingAgent');
const WeeklyReportGenerator = require('../../reports/WeeklyReportGenerator');
const RoleBasedAgentSystem = require('../../agents/RoleBasedAgentSystem');

/**
 * 🎯 Enhanced Club Run Orchestration Service
 * 
 * This service orchestrates all agents with role-based intelligence:
 * - Integrates existing agents (Research, Mission Assignment, Reporting)
 * - Adds role-based agent system
 * - Provides unified workflow orchestration
 * - Supports LangGraph integration
 * - Maintains RBAC compliance
 */

class EnhancedOrchestrationService {
  constructor() {
    // Initialize existing agents
    this.researchAgent = new ResearchAgent();
    this.missionAssignmentAgent = new MissionAssignmentAgent();
    this.reportingAgent = new ReportingAgent();
    this.weeklyReportGenerator = new WeeklyReportGenerator();
    
    // Initialize role-based agent system
    this.roleBasedAgentSystem = new RoleBasedAgentSystem();
    
    // Workflow configurations
    this.workflowConfigs = {
      mission_creation: {
        steps: ['research', 'assignment', 'reporting'],
        roles: ['CLIENT', 'CURATOR', 'OPERATIONS', 'ADMIN'],
        description: 'Complete mission creation workflow'
      },
      music_curation: {
        steps: ['submission_review', 'playlist_creation', 'library_management'],
        roles: ['DJ', 'VERIFIED_DJ'],
        description: 'Music curation and management workflow'
      },
      team_coordination: {
        steps: ['team_analysis', 'coordination_planning', 'project_management'],
        roles: ['CURATOR', 'OPERATIONS', 'ADMIN'],
        description: 'Team coordination and project management'
      },
      system_operations: {
        steps: ['system_monitoring', 'user_management', 'performance_optimization'],
        roles: ['OPERATIONS', 'ADMIN'],
        description: 'System operations and administration'
      },
      business_intelligence: {
        steps: ['business_analysis', 'partnership_evaluation', 'market_research'],
        roles: ['PARTNER', 'ADMIN'],
        description: 'Business intelligence and analytics'
      }
    };
  }

  /**
   * Execute role-based workflow
   * @param {string} workflowType - Type of workflow to execute
   * @param {string} userRole - User's role
   * @param {Object} workflowData - Workflow data
   * @returns {Promise<Object>} Workflow result
   */
  async executeRoleBasedWorkflow(workflowType, userRole, workflowData = {}) {
    try {
      console.log(`🚀 Starting ${workflowType} workflow for ${userRole} role`);
      
      // Validate workflow access
      const workflowConfig = this.workflowConfigs[workflowType];
      if (!workflowConfig) {
        throw new Error(`Unknown workflow type: ${workflowType}`);
      }
      
      if (!workflowConfig.roles.includes(userRole)) {
        throw new Error(`Role ${userRole} does not have access to ${workflowType} workflow`);
      }

      // Initialize workflow state
      const workflowState = {
        workflowType,
        userRole,
        data: workflowData,
        steps: workflowConfig.steps,
        results: {},
        errors: [],
        startTime: new Date().toISOString()
      };

      // Execute workflow steps
      for (const step of workflowConfig.steps) {
        try {
          console.log(`📋 Executing step: ${step}`);
          const stepResult = await this.executeWorkflowStep(step, userRole, workflowState);
          workflowState.results[step] = stepResult;
        } catch (error) {
          console.error(`❌ Step ${step} failed:`, error);
          workflowState.errors.push({
            step,
            error: error.message,
            timestamp: new Date().toISOString()
          });
        }
      }

      // Generate final workflow result
      const finalResult = await this.generateWorkflowResult(workflowState);
      
      console.log(`✅ ${workflowType} workflow completed for ${userRole}`);
      return finalResult;

    } catch (error) {
      console.error('Enhanced orchestration error:', error);
      return {
        success: false,
        error: error.message,
        workflowType,
        userRole,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Execute individual workflow step
   * @param {string} step - Step to execute
   * @param {string} userRole - User's role
   * @param {Object} workflowState - Current workflow state
   * @returns {Promise<Object>} Step result
   */
  async executeWorkflowStep(step, userRole, workflowState) {
    switch (step) {
      case 'research':
        return await this.executeResearchStep(userRole, workflowState);
      
      case 'assignment':
        return await this.executeAssignmentStep(userRole, workflowState);
      
      case 'reporting':
        return await this.executeReportingStep(userRole, workflowState);
      
      case 'submission_review':
        return await this.executeSubmissionReviewStep(userRole, workflowState);
      
      case 'playlist_creation':
        return await this.executePlaylistCreationStep(userRole, workflowState);
      
      case 'library_management':
        return await this.executeLibraryManagementStep(userRole, workflowState);
      
      case 'team_analysis':
        return await this.executeTeamAnalysisStep(userRole, workflowState);
      
      case 'coordination_planning':
        return await this.executeCoordinationPlanningStep(userRole, workflowState);
      
      case 'project_management':
        return await this.executeProjectManagementStep(userRole, workflowState);
      
      case 'system_monitoring':
        return await this.executeSystemMonitoringStep(userRole, workflowState);
      
      case 'user_management':
        return await this.executeUserManagementStep(userRole, workflowState);
      
      case 'performance_optimization':
        return await this.executePerformanceOptimizationStep(userRole, workflowState);
      
      case 'business_analysis':
        return await this.executeBusinessAnalysisStep(userRole, workflowState);
      
      case 'partnership_evaluation':
        return await this.executePartnershipEvaluationStep(userRole, workflowState);
      
      case 'market_research':
        return await this.executeMarketResearchStep(userRole, workflowState);
      
      default:
        throw new Error(`Unknown workflow step: ${step}`);
    }
  }

  /**
   * Execute research step with role-based intelligence
   */
  async executeResearchStep(userRole, workflowState) {
    const query = `Research venue information for mission creation`;
    const context = {
      workflowType: workflowState.workflowType,
      userRole,
      missionData: workflowState.data
    };

    // Use role-based agent for research
    const roleBasedResult = await this.roleBasedAgentSystem.processQuery(query, userRole, context);
    
    // Use existing research agent for venue enrichment
    const venueEnrichment = workflowState.data.address ? 
      await this.researchAgent.enrichVenueWithGPT(workflowState.data.address) : 
      { success: false, error: 'No address provided' };

    return {
      step: 'research',
      roleBasedInsights: roleBasedResult,
      venueEnrichment,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute assignment step with role-based intelligence
   */
  async executeAssignmentStep(userRole, workflowState) {
    const query = `Assign best runner for mission`;
    const context = {
      workflowType: workflowState.workflowType,
      userRole,
      missionData: workflowState.data,
      researchResults: workflowState.results.research
    };

    // Use role-based agent for assignment strategy
    const roleBasedResult = await this.roleBasedAgentSystem.processQuery(query, userRole, context);
    
    // Use existing mission assignment agent
    const assignmentResult = await this.missionAssignmentAgent.assignBestRunner(workflowState.data);

    return {
      step: 'assignment',
      roleBasedStrategy: roleBasedResult,
      assignmentResult,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute reporting step with role-based intelligence
   */
  async executeReportingStep(userRole, workflowState) {
    const query = `Generate comprehensive mission report`;
    const context = {
      workflowType: workflowState.workflowType,
      userRole,
      missionData: workflowState.data,
      researchResults: workflowState.results.research,
      assignmentResults: workflowState.results.assignment
    };

    // Use role-based agent for reporting insights
    const roleBasedResult = await this.roleBasedAgentSystem.processQuery(query, userRole, context);
    
    // Use existing reporting agent
    const reportingData = {
      ...workflowState.data,
      enriched_venue_data: workflowState.results.research?.venueEnrichment?.enriched_data,
      runner_assignment: workflowState.results.assignment?.assignmentResult?.assigned_runner,
      action_type: 'mission_created',
      action_details: `Mission created and assigned via ${userRole} workflow`
    };

    const reportingResult = await this.reportingAgent.logMissionToSpreadsheetAndSupabase(reportingData);

    return {
      step: 'reporting',
      roleBasedInsights: roleBasedResult,
      reportingResult,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute music submission review step
   */
  async executeSubmissionReviewStep(userRole, workflowState) {
    const query = `Review music submission for quality and suitability`;
    const context = {
      workflowType: workflowState.workflowType,
      userRole,
      submissionData: workflowState.data
    };

    const result = await this.roleBasedAgentSystem.processQuery(query, userRole, context);
    
    return {
      step: 'submission_review',
      reviewResult: result,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute playlist creation step
   */
  async executePlaylistCreationStep(userRole, workflowState) {
    const query = `Create optimized playlist based on requirements`;
    const context = {
      workflowType: workflowState.workflowType,
      userRole,
      playlistData: workflowState.data
    };

    const result = await this.roleBasedAgentSystem.processQuery(query, userRole, context);
    
    return {
      step: 'playlist_creation',
      playlistResult: result,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute library management step
   */
  async executeLibraryManagementStep(userRole, workflowState) {
    const query = `Manage and organize music library`;
    const context = {
      workflowType: workflowState.workflowType,
      userRole,
      libraryData: workflowState.data
    };

    const result = await this.roleBasedAgentSystem.processQuery(query, userRole, context);
    
    return {
      step: 'library_management',
      libraryResult: result,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute team analysis step
   */
  async executeTeamAnalysisStep(userRole, workflowState) {
    const query = `Analyze team composition and capabilities`;
    const context = {
      workflowType: workflowState.workflowType,
      userRole,
      teamData: workflowState.data
    };

    const result = await this.roleBasedAgentSystem.processQuery(query, userRole, context);
    
    return {
      step: 'team_analysis',
      analysisResult: result,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute coordination planning step
   */
  async executeCoordinationPlanningStep(userRole, workflowState) {
    const query = `Plan team coordination and communication`;
    const context = {
      workflowType: workflowState.workflowType,
      userRole,
      coordinationData: workflowState.data
    };

    const result = await this.roleBasedAgentSystem.processQuery(query, userRole, context);
    
    return {
      step: 'coordination_planning',
      planningResult: result,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute project management step
   */
  async executeProjectManagementStep(userRole, workflowState) {
    const query = `Manage project timeline and deliverables`;
    const context = {
      workflowType: workflowState.workflowType,
      userRole,
      projectData: workflowState.data
    };

    const result = await this.roleBasedAgentSystem.processQuery(query, userRole, context);
    
    return {
      step: 'project_management',
      managementResult: result,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute system monitoring step
   */
  async executeSystemMonitoringStep(userRole, workflowState) {
    const query = `Monitor system health and performance`;
    const context = {
      workflowType: workflowState.workflowType,
      userRole,
      systemData: workflowState.data
    };

    const result = await this.roleBasedAgentSystem.processQuery(query, userRole, context);
    
    return {
      step: 'system_monitoring',
      monitoringResult: result,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute user management step
   */
  async executeUserManagementStep(userRole, workflowState) {
    const query = `Manage user accounts and permissions`;
    const context = {
      workflowType: workflowState.workflowType,
      userRole,
      userData: workflowState.data
    };

    const result = await this.roleBasedAgentSystem.processQuery(query, userRole, context);
    
    return {
      step: 'user_management',
      managementResult: result,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute performance optimization step
   */
  async executePerformanceOptimizationStep(userRole, workflowState) {
    const query = `Optimize system performance and efficiency`;
    const context = {
      workflowType: workflowState.workflowType,
      userRole,
      performanceData: workflowState.data
    };

    const result = await this.roleBasedAgentSystem.processQuery(query, userRole, context);
    
    return {
      step: 'performance_optimization',
      optimizationResult: result,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute business analysis step
   */
  async executeBusinessAnalysisStep(userRole, workflowState) {
    const query = `Analyze business metrics and trends`;
    const context = {
      workflowType: workflowState.workflowType,
      userRole,
      businessData: workflowState.data
    };

    const result = await this.roleBasedAgentSystem.processQuery(query, userRole, context);
    
    return {
      step: 'business_analysis',
      analysisResult: result,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute partnership evaluation step
   */
  async executePartnershipEvaluationStep(userRole, workflowState) {
    const query = `Evaluate partnership opportunities and performance`;
    const context = {
      workflowType: workflowState.workflowType,
      userRole,
      partnershipData: workflowState.data
    };

    const result = await this.roleBasedAgentSystem.processQuery(query, userRole, context);
    
    return {
      step: 'partnership_evaluation',
      evaluationResult: result,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute market research step
   */
  async executeMarketResearchStep(userRole, workflowState) {
    const query = `Conduct market research and competitive analysis`;
    const context = {
      workflowType: workflowState.workflowType,
      userRole,
      marketData: workflowState.data
    };

    const result = await this.roleBasedAgentSystem.processQuery(query, userRole, context);
    
    return {
      step: 'market_research',
      researchResult: result,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate final workflow result
   * @param {Object} workflowState - Complete workflow state
   * @returns {Promise<Object>} Final result
   */
  async generateWorkflowResult(workflowState) {
    const query = `Generate comprehensive workflow summary`;
    const context = {
      workflowType: workflowState.workflowType,
      userRole: workflowState.userRole,
      allResults: workflowState.results,
      errors: workflowState.errors
    };

    const summaryResult = await this.roleBasedAgentSystem.processQuery(query, workflowState.userRole, context);

    return {
      success: workflowState.errors.length === 0,
      workflowType: workflowState.workflowType,
      userRole: workflowState.userRole,
      summary: summaryResult,
      results: workflowState.results,
      errors: workflowState.errors,
      startTime: workflowState.startTime,
      endTime: new Date().toISOString(),
      duration: new Date(workflowState.startTime).getTime() - new Date().getTime()
    };
  }

  /**
   * Get available workflows for a role
   * @param {string} userRole - User's role
   * @returns {Array} Available workflows
   */
  getAvailableWorkflows(userRole) {
    return Object.entries(this.workflowConfigs)
      .filter(([_, config]) => config.roles.includes(userRole))
      .map(([type, config]) => ({
        type,
        description: config.description,
        steps: config.steps,
        roles: config.roles
      }));
  }

  /**
   * Get role-specific agent capabilities
   * @param {string} userRole - User's role
   * @returns {Object} Agent capabilities
   */
  getRoleCapabilities(userRole) {
    return this.roleBasedAgentSystem.getAgentConfig(userRole);
  }

  /**
   * Get all agent configurations
   * @returns {Object} All agent configurations
   */
  getAllAgentConfigurations() {
    return this.roleBasedAgentSystem.getAllAgents();
  }

  /**
   * Check if role has specific capability
   * @param {string} userRole - User's role
   * @param {string} capability - Required capability
   * @returns {boolean} Whether role has capability
   */
  hasCapability(userRole, capability) {
    return this.roleBasedAgentSystem.hasCapability(userRole, capability);
  }

  /**
   * Legacy method for backward compatibility
   * @param {Object} missionData - Mission data
   * @returns {Promise<Object>} Mission creation result
   */
  async createMissionWithEnrichment(missionData) {
    return await this.executeRoleBasedWorkflow('mission_creation', 'CLIENT', missionData);
  }
}

module.exports = EnhancedOrchestrationService;
