const express = require('express');
const router = express.Router();

// Mock data for demonstration
const MOCK_DATA = {
  venues: {
    "123 Main Street, New York, NY 10001": {
      neighborhood_profile: "Trendy downtown area with mix of businesses and nightlife",
      safety_info: "Generally safe, well-lit streets, police presence",
      parking_info: "Street parking available, nearby garage at 125 Main St",
      local_restrictions: "Noise ordinance after 11 PM, alcohol license required",
      nearby_amenities: "Restaurants, hotels, public transport within 2 blocks",
      special_tips: "Best access via subway, avoid rush hour traffic",
      accessibility: "Wheelchair accessible entrance, elevator available",
      estimated_travel_time: "15-25 minutes from downtown"
    },
    "456 Broadway, New York, NY 10013": {
      neighborhood_profile: "Historic district with modern amenities",
      safety_info: "Tourist area, high foot traffic, generally safe",
      parking_info: "Limited street parking, recommend public transport",
      local_restrictions: "Historical district regulations apply",
      nearby_amenities: "Shopping, dining, cultural attractions",
      special_tips: "Peak hours 7-9 PM, plan for crowds",
      accessibility: "Ramps available, some areas may have restrictions",
      estimated_travel_time: "20-30 minutes from midtown"
    }
  },
  runners: [
    {
      id: "runner-001",
      name: "Alex Johnson",
      performance_rating: 4.8,
      completed_missions_count: 47,
      total_earnings: 2840,
      specialties: ["venue research", "client relations"],
      availability: "flexible"
    },
    {
      id: "runner-002", 
      name: "Sam Rivera",
      performance_rating: 4.6,
      completed_missions_count: 32,
      total_earnings: 1920,
      specialties: ["logistics", "safety assessment"],
      availability: "evenings"
    },
    {
      id: "runner-003",
      name: "Jordan Chen",
      performance_rating: 4.9,
      completed_missions_count: 58,
      total_earnings: 3480,
      specialties: ["reporting", "expense tracking"],
      availability: "weekends"
    }
  ]
};

// Demo health check
router.get('/health', (req, res) => {
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
router.post('/research', (req, res) => {
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
router.post('/assignment', (req, res) => {
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
router.post('/missions/create', (req, res) => {
  const missionData = req.body;
  
  if (!missionData.address || !missionData.budget || !missionData.client_id) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: address, budget, client_id'
    });
  }

  // Simulate the complete flow
  const missionId = `mission-${Date.now()}`;
  const assignedRunner = MOCK_DATA.runners[0];

  res.json({
    success: true,
    mission: {
      id: missionId,
      address: missionData.address,
      budget: missionData.budget,
      client_id: missionData.client_id,
      status: 'assigned',
      assigned_runner: assignedRunner,
      created_at: new Date().toISOString(),
      estimated_completion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    },
    enriched_data: MOCK_DATA.venues[missionData.address] || {},
    assignment_score: 92,
    timestamp: new Date().toISOString()
  });
});

// Mock Mission Status Update
router.put('/missions/:missionId/status', (req, res) => {
  const { missionId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      error: 'Status is required'
    });
  }

  res.json({
    success: true,
    mission_id: missionId,
    status: status,
    updated_at: new Date().toISOString(),
    timestamp: new Date().toISOString()
  });
});

// Mock Runner Check-in
router.post('/missions/:missionId/checkin', (req, res) => {
  const { missionId } = req.params;
  const { location, notes } = req.body;

  res.json({
    success: true,
    mission_id: missionId,
    checkin: {
      location: location || 'Venue location',
      notes: notes || 'Runner arrived at venue',
      timestamp: new Date().toISOString()
    },
    timestamp: new Date().toISOString()
  });
});

// Mock Expense Logging
router.post('/expenses', (req, res) => {
  const { mission_id, amount, category, description } = req.body;

  if (!mission_id || !amount || !category) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: mission_id, amount, category'
    });
  }

  res.json({
    success: true,
    expense: {
      id: `expense-${Date.now()}`,
      mission_id: mission_id,
      amount: amount,
      category: category,
      description: description || 'Mission expense',
      timestamp: new Date().toISOString()
    },
    timestamp: new Date().toISOString()
  });
});

// Mock Weekly Report Generation
router.post('/reports/weekly', (req, res) => {
  const { start_date, end_date } = req.body;

  const reportId = `report-${Date.now()}`;

  res.json({
    success: true,
    report: {
      id: reportId,
      type: 'weekly',
      start_date: start_date || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: end_date || new Date().toISOString(),
      summary: {
        total_missions: 12,
        completed_missions: 11,
        total_revenue: 8400,
        total_expenses: 1200,
        net_profit: 7200,
        average_mission_rating: 4.7
      },
      generated_at: new Date().toISOString()
    },
    download_urls: {
      csv_url: `https://demo.example.com/reports/${reportId}.csv`,
      pdf_url: `https://demo.example.com/reports/${reportId}.pdf`,
      excel_url: `https://demo.example.com/reports/${reportId}.xlsx`
    },
    timestamp: new Date().toISOString()
  });
});

// Demo dashboard data
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    dashboard: {
      total_missions: 156,
      active_missions: 8,
      total_revenue: 124800,
      monthly_growth: 23.5,
      top_performers: MOCK_DATA.runners.slice(0, 3),
      recent_activity: [
        {
          type: 'mission_completed',
          description: 'Venue research completed for 123 Main St',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          type: 'runner_assigned',
          description: 'Alex Johnson assigned to new mission',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 