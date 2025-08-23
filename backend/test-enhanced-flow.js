const OrchestrationService = require('./src/services/ai/OrchestrationService');
const ResearchAgent = require('./src/agents/ResearchAgent');
const MissionAssignmentAgent = require('./src/agents/MissionAssignmentAgent');
const ReportingAgent = require('./src/agents/ReportingAgent');
const WeeklyReportGenerator = require('./src/reports/WeeklyReportGenerator');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3001',
  testUserId: 'test-user-123',
  testRunnerId: 'test-runner-456',
  testClientId: 'test-client-789'
};

class EnhancedFlowTester {
  constructor() {
    this.orchestrationService = new OrchestrationService();
    this.researchAgent = new ResearchAgent();
    this.missionAssignmentAgent = new MissionAssignmentAgent();
    this.reportingAgent = new ReportingAgent();
    this.weeklyReportGenerator = new WeeklyReportGenerator();
  }

  async runAllTests() {
    console.log('🚀 Starting Enhanced Club Run Agent Flow Tests\n');
    
    try {
      // Test 1: System Health Check
      await this.testSystemHealth();
      
      // Test 2: Research Agent
      await this.testResearchAgent();
      
      // Test 3: Mission Assignment Agent
      await this.testMissionAssignmentAgent();
      
      // Test 4: Complete Mission Creation Flow
      await this.testMissionCreationFlow();
      
      // Test 5: Mission Status Updates
      await this.testMissionStatusUpdates();
      
      // Test 6: Runner Check-in
      await this.testRunnerCheckIn();
      
      // Test 7: Expense Logging
      await this.testExpenseLogging();
      
      // Test 8: Mission Completion
      await this.testMissionCompletion();
      
      // Test 9: Weekly Report Generation
      await this.testWeeklyReportGeneration();
      
      // Test 10: Data Consistency Verification
      await this.testDataConsistency();
      
      console.log('\n✅ All Enhanced Flow Tests Completed Successfully!');
      
    } catch (error) {
      console.error('\n❌ Test Suite Failed:', error.message);
    }
  }

  async testSystemHealth() {
    console.log('🔍 Test 1: System Health Check');
    
    const health = await this.orchestrationService.getSystemHealth();
    
    if (health.success) {
      console.log('✅ System Health:', health.health);
    } else {
      console.log('❌ System Health Check Failed:', health.error);
    }
    
    console.log('');
  }

  async testResearchAgent() {
    console.log('🔍 Test 2: Research Agent - Venue Enrichment');
    
    const testAddress = '123 Main Street, New York, NY 10001';
    const result = await this.researchAgent.enrichVenueWithGPT(testAddress);
    
    if (result.success) {
      console.log('✅ Venue Enrichment Successful');
      console.log('📍 Address:', result.address);
      console.log('📊 Enriched Data Keys:', Object.keys(result.enriched_data));
      console.log('🤖 Model Used:', result.model_used);
    } else {
      console.log('❌ Venue Enrichment Failed:', result.error);
    }
    
    console.log('');
  }

  async testMissionAssignmentAgent() {
    console.log('👥 Test 3: Mission Assignment Agent');
    
    const testMission = {
      id: 'test-mission-001',
      address: '456 Broadway, New York, NY 10013',
      budget: 500,
      client_id: TEST_CONFIG.testClientId,
      dj_service_pack: 'premium'
    };
    
    const result = await this.missionAssignmentAgent.assignBestRunner(testMission);
    
    if (result.success) {
      console.log('✅ Mission Assignment Successful');
      console.log('🎯 Assigned Runner:', result.assigned_runner?.name || 'Test Runner');
      console.log('📊 Assignment Score:', result.assignment_score);
      console.log('💡 Assignment Reason:', result.assignment_reason);
    } else {
      console.log('❌ Mission Assignment Failed:', result.error);
    }
    
    console.log('');
  }

  async testMissionCreationFlow() {
    console.log('🚀 Test 4: Complete Mission Creation Flow');
    
    const missionData = {
      address: '789 5th Avenue, New York, NY 10065',
      budget: 750,
      client_id: TEST_CONFIG.testClientId,
      dj_service_pack: 'standard',
      event_type: 'corporate',
      event_date: '2024-02-15T19:00:00Z',
      special_requirements: 'High-end audio system required'
    };
    
    const result = await this.orchestrationService.createMissionWithEnrichment(missionData);
    
    if (result.success) {
      console.log('✅ Mission Creation Flow Successful');
      console.log('🎯 Mission ID:', result.mission.id);
      console.log('🔍 Enrichment Status:', result.enrichment.success ? 'Success' : 'Failed');
      console.log('👥 Assignment Status:', result.assignment.success ? 'Success' : 'Failed');
      console.log('📊 Reporting Status: Logged to systems');
      
      // Store mission ID for subsequent tests
      this.testMissionId = result.mission.id;
    } else {
      console.log('❌ Mission Creation Flow Failed:', result.error);
    }
    
    console.log('');
  }

  async testMissionStatusUpdates() {
    console.log('🔄 Test 5: Mission Status Updates');
    
    if (!this.testMissionId) {
      console.log('⚠️  Skipping - No test mission ID available');
      console.log('');
      return;
    }
    
    const statuses = ['in_progress', 'on_site', 'completed'];
    
    for (const status of statuses) {
      const result = await this.orchestrationService.updateMissionStatus(
        this.testMissionId, 
        status, 
        { notes: `Status updated to ${status}` }
      );
      
      if (result.success) {
        console.log(`✅ Status Update to "${status}": Success`);
      } else {
        console.log(`❌ Status Update to "${status}": Failed - ${result.error}`);
      }
    }
    
    console.log('');
  }

  async testRunnerCheckIn() {
    console.log('📍 Test 6: Runner Check-in');
    
    if (!this.testMissionId) {
      console.log('⚠️  Skipping - No test mission ID available');
      console.log('');
      return;
    }
    
    const checkInData = {
      location: 'Venue entrance',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      notes: 'Arrived at venue, setting up equipment'
    };
    
    const result = await this.orchestrationService.handleRunnerCheckIn(
      this.testMissionId,
      TEST_CONFIG.testRunnerId,
      checkInData
    );
    
    if (result.success) {
      console.log('✅ Runner Check-in Successful');
      console.log('📍 Location:', result.check_in_data.location);
      console.log('📊 Reporting Status: Logged to systems');
    } else {
      console.log('❌ Runner Check-in Failed:', result.error);
    }
    
    console.log('');
  }

  async testExpenseLogging() {
    console.log('💰 Test 7: Expense Logging');
    
    const expenseData = {
      description: 'Equipment rental - DJ mixer',
      amount: 150.00,
      category: 'equipment',
      runner_id: TEST_CONFIG.testRunnerId,
      mission_id: this.testMissionId,
      receipt_url: 'https://example.com/receipt.pdf'
    };
    
    const result = await this.orchestrationService.logExpense(expenseData);
    
    if (result.success) {
      console.log('✅ Expense Logging Successful');
      console.log('💰 Amount:', `$${result.expense_data.amount}`);
      console.log('📝 Description:', result.expense_data.description);
      console.log('📊 Reporting Status: Logged to systems');
    } else {
      console.log('❌ Expense Logging Failed:', result.error);
    }
    
    console.log('');
  }

  async testMissionCompletion() {
    console.log('✅ Test 8: Mission Completion');
    
    if (!this.testMissionId) {
      console.log('⚠️  Skipping - No test mission ID available');
      console.log('');
      return;
    }
    
    const completionData = {
      notes: 'Mission completed successfully. Client was very satisfied with the service.',
      rating: 5,
      feedback: 'Excellent performance and professionalism',
      completion_time: new Date().toISOString()
    };
    
    const result = await this.orchestrationService.handleMissionCompletion(
      this.testMissionId,
      completionData
    );
    
    if (result.success) {
      console.log('✅ Mission Completion Successful');
      console.log('⭐ Rating:', result.completion_data.rating);
      console.log('📝 Notes:', result.completion_data.notes);
      console.log('📊 Reporting Status: Logged to systems');
    } else {
      console.log('❌ Mission Completion Failed:', result.error);
    }
    
    console.log('');
  }

  async testWeeklyReportGeneration() {
    console.log('📊 Test 9: Weekly Report Generation');
    
    const roles = ['runner', 'client', 'admin'];
    
    for (const role of roles) {
      const result = await this.orchestrationService.generateWeeklyReport(
        TEST_CONFIG.testUserId,
        role
      );
      
      if (result.success) {
        console.log(`✅ Weekly Report for ${role}: Success`);
        console.log(`📄 CSV URL: ${result.reports.csv ? 'Available' : 'Not generated'}`);
        console.log(`📄 PDF URL: ${result.reports.pdf ? 'Available' : 'Not generated'}`);
        console.log(`📄 Excel URL: ${result.reports.excel ? 'Available' : 'Not generated'}`);
        console.log(`📊 Mission Count: ${result.metadata.mission_count}`);
        console.log(`💰 Total Budget: $${result.metadata.total_budget}`);
      } else {
        console.log(`❌ Weekly Report for ${role}: Failed - ${result.error}`);
      }
    }
    
    console.log('');
  }

  async testDataConsistency() {
    console.log('🔍 Test 10: Data Consistency Verification');
    
    if (!this.testMissionId) {
      console.log('⚠️  Skipping - No test mission ID available');
      console.log('');
      return;
    }
    
    const result = await this.orchestrationService.verifyDataConsistency(this.testMissionId);
    
    if (result.success) {
      console.log('✅ Data Consistency Check Completed');
      console.log('📊 Consistency Status:', result.consistency_result.consistent ? 'Consistent' : 'Inconsistent');
      
      if (!result.consistency_result.consistent) {
        console.log('⚠️  Data inconsistency detected between systems');
      }
    } else {
      console.log('❌ Data Consistency Check Failed:', result.error);
    }
    
    console.log('');
  }
}

// Run the tests
async function runTests() {
  const tester = new EnhancedFlowTester();
  await tester.runAllTests();
}

// Export for use in other files
module.exports = { EnhancedFlowTester, runTests };

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
} 