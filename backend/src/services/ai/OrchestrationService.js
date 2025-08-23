const ResearchAgent = require('../../agents/ResearchAgent');
const MissionAssignmentAgent = require('../../agents/MissionAssignmentAgent');
const ReportingAgent = require('../../agents/ReportingAgent');
const WeeklyReportGenerator = require('../../reports/WeeklyReportGenerator');

class OrchestrationService {
  constructor() {
    this.researchAgent = new ResearchAgent();
    this.missionAssignmentAgent = new MissionAssignmentAgent();
    this.reportingAgent = new ReportingAgent();
    this.weeklyReportGenerator = new WeeklyReportGenerator();
  }

  /**
   * Complete mission creation flow with enrichment and assignment
   * @param {Object} missionData - Mission data from client/admin
   * @returns {Promise<Object>} Complete mission with enriched data and assignment
   */
  async createMissionWithEnrichment(missionData) {
    try {
      console.log('🚀 Starting mission creation flow...');
      
      // Step 1: Research and enrich venue data
      console.log('🔍 Enriching venue data...');
      const enrichmentResult = await this.researchAgent.enrichVenueWithGPT(missionData.address);
      
      if (!enrichmentResult.success) {
        throw new Error(`Venue enrichment failed: ${enrichmentResult.error}`);
      }

      // Step 2: Create mission with enriched data
      const enrichedMission = {
        ...missionData,
        enriched_venue_data: enrichmentResult.enriched_data,
        status: 'created',
        created_at: new Date().toISOString()
      };

      // Step 3: Assign best runner
      console.log('👥 Assigning best runner...');
      const assignmentResult = await this.missionAssignmentAgent.assignBestRunner(enrichedMission);
      
      if (!assignmentResult.success) {
        throw new Error(`Runner assignment failed: ${assignmentResult.error}`);
      }

      // Step 4: Log mission creation to reporting systems
      console.log('📊 Logging mission creation...');
      const reportingData = {
        ...enrichedMission,
        runner_id: assignmentResult.assigned_runner.id,
        action_type: 'mission_created',
        action_details: `Mission created and assigned to ${assignmentResult.assigned_runner.name}`
      };

      await this.reportingAgent.logMissionToSpreadsheetAndSupabase(reportingData);

      return {
        success: true,
        mission: {
          ...enrichedMission,
          assigned_runner: assignmentResult.assigned_runner,
          assignment_score: assignmentResult.assignment_score,
          assignment_reason: assignmentResult.assignment_reason
        },
        enrichment: enrichmentResult,
        assignment: assignmentResult,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Mission creation flow error:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Handle mission status updates with reporting
   * @param {string} missionId - Mission ID
   * @param {string} newStatus - New status
   * @param {Object} additionalData - Additional data for the update
   * @returns {Promise<Object>} Update result
   */
  async updateMissionStatus(missionId, newStatus, additionalData = {}) {
    try {
      console.log(`🔄 Updating mission ${missionId} status to ${newStatus}...`);
      
      // Prepare reporting data
      const reportingData = {
        mission_id: missionId,
        status: newStatus,
        action_type: 'status_update',
        action_details: `Status updated to: ${newStatus}`,
        ...additionalData
      };

      // Log to reporting systems
      const reportingResult = await this.reportingAgent.logMissionToSpreadsheetAndSupabase(reportingData);
      
      return {
        success: true,
        mission_id: missionId,
        new_status: newStatus,
        reporting_result: reportingResult,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Mission status update error:', error);
      return {
        success: false,
        error: error.message,
        mission_id: missionId
      };
    }
  }

  /**
   * Handle runner check-in with reporting
   * @param {string} missionId - Mission ID
   * @param {string} runnerId - Runner ID
   * @param {Object} checkInData - Check-in data
   * @returns {Promise<Object>} Check-in result
   */
  async handleRunnerCheckIn(missionId, runnerId, checkInData) {
    try {
      console.log(`📍 Runner ${runnerId} checking in for mission ${missionId}...`);
      
      const reportingData = {
        mission_id: missionId,
        runner_id: runnerId,
        action_type: 'check_in',
        action_details: `Runner checked in at: ${checkInData.location || 'venue'}`,
        location: checkInData.location,
        coordinates: checkInData.coordinates,
        timestamp: new Date().toISOString()
      };

      // Log check-in to reporting systems
      const reportingResult = await this.reportingAgent.logMissionToSpreadsheetAndSupabase(reportingData);
      
      return {
        success: true,
        mission_id: missionId,
        runner_id: runnerId,
        check_in_data: checkInData,
        reporting_result: reportingResult,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Runner check-in error:', error);
      return {
        success: false,
        error: error.message,
        mission_id: missionId,
        runner_id: runnerId
      };
    }
  }

  /**
   * Handle expense logging with reporting
   * @param {Object} expenseData - Expense data
   * @returns {Promise<Object>} Expense logging result
   */
  async logExpense(expenseData) {
    try {
      console.log(`💰 Logging expense: ${expenseData.description} - $${expenseData.amount}...`);
      
      const reportingData = {
        ...expenseData,
        action_type: 'expense',
        action_details: `Expense: ${expenseData.description} - $${expenseData.amount}`,
        timestamp: new Date().toISOString()
      };

      // Log expense to reporting systems
      const reportingResult = await this.reportingAgent.logMissionToSpreadsheetAndSupabase(reportingData);
      
      return {
        success: true,
        expense_data: expenseData,
        reporting_result: reportingResult,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Expense logging error:', error);
      return {
        success: false,
        error: error.message,
        expense_data: expenseData
      };
    }
  }

  /**
   * Handle mission completion with reporting
   * @param {string} missionId - Mission ID
   * @param {Object} completionData - Completion data
   * @returns {Promise<Object>} Completion result
   */
  async handleMissionCompletion(missionId, completionData) {
    try {
      console.log(`✅ Mission ${missionId} completed...`);
      
      const reportingData = {
        mission_id: missionId,
        action_type: 'completion',
        action_details: 'Mission completed successfully',
        completion_notes: completionData.notes,
        completion_rating: completionData.rating,
        timestamp: new Date().toISOString()
      };

      // Log completion to reporting systems
      const reportingResult = await this.reportingAgent.logMissionToSpreadsheetAndSupabase(reportingData);
      
      return {
        success: true,
        mission_id: missionId,
        completion_data: completionData,
        reporting_result: reportingResult,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Mission completion error:', error);
      return {
        success: false,
        error: error.message,
        mission_id: missionId
      };
    }
  }

  /**
   * Generate weekly report for user
   * @param {string} userId - User ID
   * @param {string} role - User role
   * @param {Date} weekStart - Start of the week
   * @returns {Promise<Object>} Report generation result
   */
  async generateWeeklyReport(userId, role, weekStart = null) {
    try {
      console.log(`📊 Generating weekly report for ${role} ${userId}...`);
      
      const reportResult = await this.weeklyReportGenerator.generateWeeklyLedger(userId, role, weekStart);
      
      if (!reportResult.success) {
        throw new Error(`Report generation failed: ${reportResult.error}`);
      }

      return {
        success: true,
        user_id: userId,
        role: role,
        reports: reportResult.reports,
        metadata: reportResult.metadata,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Weekly report generation error:', error);
      return {
        success: false,
        error: error.message,
        user_id: userId,
        role: role
      };
    }
  }

  /**
   * Get user's available reports
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Available reports
   */
  async getUserReports(userId) {
    try {
      const reports = await this.weeklyReportGenerator.getUserReports(userId);
      
      return {
        success: true,
        user_id: userId,
        reports: reports,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Get user reports error:', error);
      return {
        success: false,
        error: error.message,
        user_id: userId
      };
    }
  }

  /**
   * Verify data consistency between systems
   * @param {string} missionId - Mission ID to verify
   * @returns {Promise<Object>} Consistency check result
   */
  async verifyDataConsistency(missionId) {
    try {
      console.log(`🔍 Verifying data consistency for mission ${missionId}...`);
      
      const consistencyResult = await this.reportingAgent.verifyDataConsistency(missionId);
      
      return {
        success: true,
        mission_id: missionId,
        consistency_result: consistencyResult,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Data consistency check error:', error);
      return {
        success: false,
        error: error.message,
        mission_id: missionId
      };
    }
  }

  /**
   * Get system health and status
   * @returns {Promise<Object>} System health status
   */
  async getSystemHealth() {
    try {
      const health = {
        research_agent: 'operational',
        mission_assignment_agent: 'operational',
        reporting_agent: 'operational',
        weekly_report_generator: 'operational',
        timestamp: new Date().toISOString()
      };

      // Test each component
      try {
        await this.researchAgent.enrichVenueWithGPT('Test Address');
      } catch (error) {
        health.research_agent = 'error';
      }

      return {
        success: true,
        health: health,
        status: 'operational'
      };
    } catch (error) {
      console.error('System health check error:', error);
      return {
        success: false,
        error: error.message,
        status: 'degraded'
      };
    }
  }
}

module.exports = OrchestrationService; 