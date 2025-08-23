const express = require('express');
const router = express.Router();
const OrchestrationService = require('../services/ai/OrchestrationService');

const orchestrationService = new OrchestrationService();

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const health = await orchestrationService.getSystemHealth();
    res.json(health);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create mission with enrichment and assignment
router.post('/missions/create', async (req, res) => {
  try {
    const missionData = req.body;
    
    // Validate required fields
    if (!missionData.address || !missionData.budget || !missionData.client_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: address, budget, client_id'
      });
    }

    const result = await orchestrationService.createMissionWithEnrichment(missionData);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Mission creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update mission status
router.put('/missions/:missionId/status', async (req, res) => {
  try {
    const { missionId } = req.params;
    const { status, additionalData } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const result = await orchestrationService.updateMissionStatus(missionId, status, additionalData);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Mission status update error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Runner check-in
router.post('/missions/:missionId/checkin', async (req, res) => {
  try {
    const { missionId } = req.params;
    const { runnerId, checkInData } = req.body;
    
    if (!runnerId) {
      return res.status(400).json({
        success: false,
        error: 'Runner ID is required'
      });
    }

    const result = await orchestrationService.handleRunnerCheckIn(missionId, runnerId, checkInData);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Runner check-in error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Log expense
router.post('/expenses', async (req, res) => {
  try {
    const expenseData = req.body;
    
    // Validate required fields
    if (!expenseData.description || !expenseData.amount || !expenseData.runner_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: description, amount, runner_id'
      });
    }

    const result = await orchestrationService.logExpense(expenseData);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Expense logging error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Mission completion
router.post('/missions/:missionId/complete', async (req, res) => {
  try {
    const { missionId } = req.params;
    const completionData = req.body;

    const result = await orchestrationService.handleMissionCompletion(missionId, completionData);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Mission completion error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate weekly report
router.post('/reports/weekly', async (req, res) => {
  try {
    const { userId, role, weekStart } = req.body;
    
    if (!userId || !role) {
      return res.status(400).json({
        success: false,
        error: 'User ID and role are required'
      });
    }

    const result = await orchestrationService.generateWeeklyReport(userId, role, weekStart ? new Date(weekStart) : null);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Weekly report generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user's available reports
router.get('/reports/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await orchestrationService.getUserReports(userId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Get user reports error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Verify data consistency
router.get('/missions/:missionId/consistency', async (req, res) => {
  try {
    const { missionId } = req.params;

    const result = await orchestrationService.verifyDataConsistency(missionId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Data consistency check error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test research agent
router.post('/test/research', async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Address is required'
      });
    }

    const ResearchAgent = require('../agents/ResearchAgent');
    const researchAgent = new ResearchAgent();
    
    const result = await researchAgent.enrichVenueWithGPT(address);
    
    res.json(result);
  } catch (error) {
    console.error('Research agent test error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test mission assignment
router.post('/test/assignment', async (req, res) => {
  try {
    const missionData = req.body;
    
    if (!missionData.address || !missionData.budget) {
      return res.status(400).json({
        success: false,
        error: 'Address and budget are required'
      });
    }

    const MissionAssignmentAgent = require('../agents/MissionAssignmentAgent');
    const assignmentAgent = new MissionAssignmentAgent();
    
    const result = await assignmentAgent.assignBestRunner(missionData);
    
    res.json(result);
  } catch (error) {
    console.error('Mission assignment test error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 