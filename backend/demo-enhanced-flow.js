const express = require('express');
const cors = require('cors');

// Mock data for demonstration
const MOCK_DATA = {
  venues: {
    '123 Main Street, New York, NY 10001': {
      neighborhood_profile: 'Upper East Side - affluent residential area',
      safety_info: 'Very safe neighborhood with low crime rates',
      parking_info: 'Street parking available, some restrictions during business hours',
      local_restrictions: 'Noise ordinances after 10 PM, permit required for large events',
      nearby_amenities: 'Central Park, luxury hotels, fine dining restaurants',
      special_tips: 'Arrive early for parking, bring backup equipment',
      accessibility: 'Subway access via 4/5/6 trains, wheelchair accessible',
      estimated_travel_time: '15-20 minutes from Midtown'
    },
    '456 Broadway, New York, NY 10013': {
      neighborhood_profile: 'SoHo - trendy shopping and arts district',
      safety_info: 'Safe during day, moderate foot traffic at night',
      parking_info: 'Limited street parking, recommend public transport',
      local_restrictions: 'Historic district restrictions, noise monitoring',
      nearby_amenities: 'Boutique shops, art galleries, trendy restaurants',
      special_tips: 'Check for street closures during events',
      accessibility: 'Multiple subway lines, some cobblestone streets',
      estimated_travel_time: '10-15 minutes from Lower Manhattan'
    }
  },
  runners: [
    {
      id: 'runner-001',
      name: 'Alex Johnson',
      performance_rating: 4.8,
      completed_missions_count: 45,
      total_earnings: 8500,
      location: 'Manhattan',
      availability_status: 'available'
    },
    {
      id: 'runner-002',
      name: 'Sarah Chen',
      performance_rating: 4.9,
      completed_missions_count: 67,
      total_earnings: 12000,
      location: 'Brooklyn',
      availability_status: 'available'
    },
    {
      id: 'runner-003',
      name: 'Mike Rodriguez',
      performance_rating: 4.6,
      completed_missions_count: 23,
      total_earnings: 4200,
      location: 'Queens',
      availability_status: 'available'
    }
  ],
  missions: [],
  expenses: [],
  reports: []
};

// Create Express app for demo
const app = express();
app.use(cors());
app.use(express.json());

// Demo endpoints
app.get('/demo/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Enhanced Club Run Agent Flow Demo',
    timestamp: new Date().toISOString(),
    components: {
      research_agent: 'operational',
      mission_assignment_agent: 'operational',
      reporting_agent: 'operational',
      weekly_report_generator: 'operational'
    }
  });
});

// Mock Research Agent
app.post('/demo/research', (req, res) => {
  const { address } = req.body;
  
  if (!address) {
    return res.status(400).json({
      success: false,
      error: 'Address is required'
    });
  }

  const venueData = MOCK_DATA.venues[address] || {
    neighborhood_profile: 'Information available',
    safety_info: 'Check local resources',
    parking_info: 'Verify on-site',
    local_restrictions: 'Check local ordinances',
    nearby_amenities: 'Explore area',
    special_tips: 'Plan ahead',
    accessibility: 'Contact venue',
    estimated_travel_time: 'Varies by location'
  };

  res.json({
    success: true,
    address: address,
    enriched_data: venueData,
    timestamp: new Date().toISOString(),
    model_used: 'gpt-4o-mini (mock)'
  });
});

// Mock Mission Assignment
app.post('/demo/assignment', (req, res) => {
  const { address, budget, client_id } = req.body;
  
  if (!address || !budget) {
    return res.status(400).json({
      success: false,
      error: 'Address and budget are required'
    });
  }

  // Simple scoring algorithm
  const scoredRunners = MOCK_DATA.runners.map(runner => {
    const locationScore = Math.random() * 30 + 70; // 70-100
    const performanceScore = runner.performance_rating * 20; // 0-100
    const experienceScore = Math.min(runner.completed_missions_count * 1.5, 100);
    const earningsScore = Math.max(0, 100 - runner.total_earnings / 100);
    
    const totalScore = (locationScore * 0.3) + (performanceScore * 0.25) + (experienceScore * 0.15) + (earningsScore * 0.1);
    
    return {
      ...runner,
      score: Math.round(totalScore),
      assignment_reason: `High performance (${runner.performance_rating}/5), ${runner.completed_missions_count} missions completed`
    };
  }).sort((a, b) => b.score - a.score);

  const bestRunner = scoredRunners[0];

  res.json({
    success: true,
    mission_id: `mission-${Date.now()}`,
    assigned_runner: bestRunner,
    assignment_score: bestRunner.score,
    assignment_reason: bestRunner.assignment_reason,
    timestamp: new Date().toISOString()
  });
});

// Mock Mission Creation Flow
app.post('/demo/missions/create', (req, res) => {
  const missionData = req.body;
  
  if (!missionData.address || !missionData.budget || !missionData.client_id) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: address, budget, client_id'
    });
  }

  const missionId = `mission-${Date.now()}`;
  const venueData = MOCK_DATA.venues[missionData.address] || {};
  
  // Mock assignment
  const bestRunner = MOCK_DATA.runners[0];
  
  const mission = {
    id: missionId,
    ...missionData,
    enriched_venue_data: venueData,
    status: 'created',
    assigned_runner: bestRunner,
    assignment_score: 85,
    assignment_reason: 'Best available runner based on location and performance',
    created_at: new Date().toISOString()
  };

  MOCK_DATA.missions.push(mission);

  res.status(201).json({
    success: true,
    mission: mission,
    enrichment: {
      success: true,
      address: missionData.address,
      enriched_data: venueData
    },
    assignment: {
      success: true,
      assigned_runner: bestRunner,
      assignment_score: 85
    },
    timestamp: new Date().toISOString()
  });
});

// Mock Mission Status Updates
app.put('/demo/missions/:missionId/status', (req, res) => {
  const { missionId } = req.params;
  const { status, additionalData } = req.body;
  
  const mission = MOCK_DATA.missions.find(m => m.id === missionId);
  if (!mission) {
    return res.status(404).json({
      success: false,
      error: 'Mission not found'
    });
  }

  mission.status = status;
  mission.last_updated = new Date().toISOString();

  res.json({
    success: true,
    mission_id: missionId,
    new_status: status,
    reporting_result: {
      spreadsheet: { success: true },
      supabase: { success: true }
    },
    timestamp: new Date().toISOString()
  });
});

// Mock Runner Check-in
app.post('/demo/missions/:missionId/checkin', (req, res) => {
  const { missionId } = req.params;
  const { runnerId, checkInData } = req.body;
  
  const mission = MOCK_DATA.missions.find(m => m.id === missionId);
  if (!mission) {
    return res.status(404).json({
      success: false,
      error: 'Mission not found'
    });
  }

  res.json({
    success: true,
    mission_id: missionId,
    runner_id: runnerId,
    check_in_data: checkInData,
    reporting_result: {
      spreadsheet: { success: true },
      supabase: { success: true }
    },
    timestamp: new Date().toISOString()
  });
});

// Mock Expense Logging
app.post('/demo/expenses', (req, res) => {
  const expenseData = req.body;
  
  if (!expenseData.description || !expenseData.amount || !expenseData.runner_id) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: description, amount, runner_id'
    });
  }

  const expense = {
    id: `expense-${Date.now()}`,
    ...expenseData,
    created_at: new Date().toISOString()
  };

  MOCK_DATA.expenses.push(expense);

  res.status(201).json({
    success: true,
    expense_data: expense,
    reporting_result: {
      spreadsheet: { success: true },
      supabase: { success: true }
    },
    timestamp: new Date().toISOString()
  });
});

// Mock Weekly Report Generation
app.post('/demo/reports/weekly', (req, res) => {
  const { userId, role, weekStart } = req.body;
  
  if (!userId || !role) {
    return res.status(400).json({
      success: false,
      error: 'User ID and role are required'
    });
  }

  const reportId = `report-${Date.now()}`;
  const report = {
    id: reportId,
    user_id: userId,
    role: role,
    week_start: weekStart || new Date().toISOString(),
    csv_url: `https://demo.example.com/reports/${reportId}.csv`,
    pdf_url: `https://demo.example.com/reports/${reportId}.pdf`,
    excel_url: `https://demo.example.com/reports/${reportId}.xlsx`,
    generated_at: new Date().toISOString(),
    mission_count: MOCK_DATA.missions.length,
    expense_count: MOCK_DATA.expenses.length,
    total_budget: MOCK_DATA.missions.reduce((sum, m) => sum + (m.budget || 0), 0),
    total_expenses: MOCK_DATA.expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
  };

  MOCK_DATA.reports.push(report);

  res.json({
    success: true,
    user_id: userId,
    role: role,
    reports: {
      csv: report.csv_url,
      pdf: report.pdf_url,
      excel: report.excel_url
    },
    metadata: report,
    timestamp: new Date().toISOString()
  });
});

// Demo dashboard data
app.get('/demo/dashboard', (req, res) => {
  res.json({
    missions: MOCK_DATA.missions,
    expenses: MOCK_DATA.expenses,
    reports: MOCK_DATA.reports,
    runners: MOCK_DATA.runners,
    stats: {
      total_missions: MOCK_DATA.missions.length,
      total_expenses: MOCK_DATA.expenses.reduce((sum, e) => sum + (e.amount || 0), 0),
      total_budget: MOCK_DATA.missions.reduce((sum, m) => sum + (m.budget || 0), 0),
      active_runners: MOCK_DATA.runners.filter(r => r.availability_status === 'available').length
    }
  });
});

// Start demo server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`🚀 Enhanced Club Run Agent Flow Demo running on port ${PORT}`);
  console.log(`📊 Demo Dashboard: http://localhost:${PORT}/demo/dashboard`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/demo/health`);
  console.log(`\n📡 Available Demo Endpoints:`);
  console.log(`  POST /demo/research - Test venue enrichment`);
  console.log(`  POST /demo/assignment - Test runner assignment`);
  console.log(`  POST /demo/missions/create - Test complete mission creation`);
  console.log(`  PUT /demo/missions/:id/status - Test status updates`);
  console.log(`  POST /demo/missions/:id/checkin - Test runner check-in`);
  console.log(`  POST /demo/expenses - Test expense logging`);
  console.log(`  POST /demo/reports/weekly - Test report generation`);
  console.log(`\n🎯 Try the complete flow with these example requests:`);
  console.log(`\n1. Create a mission:`);
  console.log(`   curl -X POST http://localhost:${PORT}/demo/missions/create \\`);
  console.log(`     -H "Content-Type: application/json" \\`);
  console.log(`     -d '{"address":"123 Main Street, New York, NY 10001","budget":500,"client_id":"client-123"}'`);
  console.log(`\n2. Test venue research:`);
  console.log(`   curl -X POST http://localhost:${PORT}/demo/research \\`);
  console.log(`     -H "Content-Type: application/json" \\`);
  console.log(`     -d '{"address":"456 Broadway, New York, NY 10013"}'`);
  console.log(`\n3. Generate weekly report:`);
  console.log(`   curl -X POST http://localhost:${PORT}/demo/reports/weekly \\`);
  console.log(`     -H "Content-Type: application/json" \\`);
  console.log(`     -d '{"userId":"user-123","role":"runner"}'`);
}); 