const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { requireVerifiedDJ, requirePermission } = require('../middleware/rbac');
const seratoService = require('../services/serato/SeratoIntegrationService');
const router = express.Router();

/**
 * Initiate Serato OAuth connection
 * GET /api/serato/connect
 */
router.get('/connect', authenticateToken, requireVerifiedDJ, async (req, res) => {
  try {
    const userId = req.user.id;
    const state = req.query.state || `user_${userId}_${Date.now()}`;
    
    // Generate OAuth URL
    const authUrl = seratoService.generateAuthUrl(userId, state);
    
    res.json({
      success: true,
      authUrl,
      state,
      message: 'Redirect user to this URL to connect Serato account'
    });
  } catch (error) {
    console.error('Serato connect error:', error);
    res.status(500).json({ 
      error: 'Failed to generate Serato connection URL',
      message: error.message 
    });
  }
});

/**
 * Handle Serato OAuth callback
 * GET /api/serato/callback
 */
router.get('/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;
    
    if (error) {
      return res.status(400).json({ 
        error: 'Serato authorization failed',
        message: error 
      });
    }
    
    if (!code) {
      return res.status(400).json({ 
        error: 'Authorization code not provided' 
      });
    }

    // Exchange code for tokens
    const tokenData = await seratoService.exchangeCodeForToken(code);
    
    // Extract user ID from state
    const userId = state.split('_')[1];
    
    // Get user profile from Serato
    const seratoProfile = await seratoService.getUserProfile(tokenData.accessToken);
    
    // Save Serato connection to database
    await saveSeratoConnection(userId, tokenData, seratoProfile);
    
    // Redirect to success page
    const successUrl = `${process.env.FRONTEND_URL}/serato-connected?success=true`;
    res.redirect(successUrl);
    
  } catch (error) {
    console.error('Serato callback error:', error);
    const errorUrl = `${process.env.FRONTEND_URL}/serato-connected?error=${encodeURIComponent(error.message)}`;
    res.redirect(errorUrl);
  }
});

/**
 * Get user's Serato connection status
 * GET /api/serato/status
 */
router.get('/status', authenticateToken, requireVerifiedDJ, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const connection = await getSeratoConnection(userId);
    
    if (!connection) {
      return res.json({
        connected: false,
        message: 'Serato account not connected'
      });
    }
    
    // Check if token is still valid
    const isExpired = seratoService.isTokenExpired(connection.seratoTokenExpiresAt);
    
    res.json({
      connected: true,
      isExpired,
      profile: {
        seratoUsername: connection.seratoUsername,
        seratoDisplayName: connection.seratoDisplayName,
        connectedAt: connection.connectedAt
      },
      message: isExpired ? 'Token expired, refresh needed' : 'Serato account connected'
    });
    
  } catch (error) {
    console.error('Serato status error:', error);
    res.status(500).json({ 
      error: 'Failed to get Serato connection status',
      message: error.message 
    });
  }
});

/**
 * Refresh Serato connection
 * POST /api/serato/refresh
 */
router.post('/refresh', authenticateToken, requireVerifiedDJ, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const connection = await getSeratoConnection(userId);
    if (!connection) {
      return res.status(404).json({ 
        error: 'Serato account not connected' 
      });
    }
    
    // Refresh the token
    const tokenData = await seratoService.refreshAccessToken(connection.seratoRefreshToken);
    
    // Update connection in database
    await updateSeratoConnection(userId, tokenData);
    
    res.json({
      success: true,
      message: 'Serato connection refreshed successfully'
    });
    
  } catch (error) {
    console.error('Serato refresh error:', error);
    res.status(500).json({ 
      error: 'Failed to refresh Serato connection',
      message: error.message 
    });
  }
});

/**
 * Disconnect Serato account
 * DELETE /api/serato/disconnect
 */
router.delete('/disconnect', authenticateToken, requireVerifiedDJ, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Remove Serato connection from database
    await removeSeratoConnection(userId);
    
    res.json({
      success: true,
      message: 'Serato account disconnected successfully'
    });
    
  } catch (error) {
    console.error('Serato disconnect error:', error);
    res.status(500).json({ 
      error: 'Failed to disconnect Serato account',
      message: error.message 
    });
  }
});

/**
 * Get user's recent play history (for testing/verification)
 * GET /api/serato/play-history
 */
router.get('/play-history', authenticateToken, requireVerifiedDJ, async (req, res) => {
  try {
    const userId = req.user.id;
    const { start_date, end_date } = req.query;
    
    const connection = await getSeratoConnection(userId);
    if (!connection) {
      return res.status(404).json({ 
        error: 'Serato account not connected' 
      });
    }
    
    // Check if token needs refresh
    let accessToken = connection.seratoAccessToken;
    if (seratoService.isTokenExpired(connection.seratoTokenExpiresAt)) {
      const tokenData = await seratoService.refreshAccessToken(connection.seratoRefreshToken);
      accessToken = tokenData.accessToken;
      await updateSeratoConnection(userId, tokenData);
    }
    
    // Get play history
    const startDate = start_date ? new Date(start_date) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
    const endDate = end_date ? new Date(end_date) : new Date();
    
    const playHistory = await seratoService.getPlayHistory(accessToken, startDate, endDate);
    
    res.json({
      success: true,
      playHistory,
      period: {
        start: startDate,
        end: endDate
      },
      total: playHistory.length
    });
    
  } catch (error) {
    console.error('Serato play history error:', error);
    res.status(500).json({ 
      error: 'Failed to get play history',
      message: error.message 
    });
  }
});

/**
 * Test track verification (for development/testing)
 * POST /api/serato/test-verification
 */
router.post('/test-verification', authenticateToken, requireVerifiedDJ, async (req, res) => {
  try {
    const userId = req.user.id;
    const { trackRequirements, startTime, endTime } = req.body;
    
    const connection = await getSeratoConnection(userId);
    if (!connection) {
      return res.status(404).json({ 
        error: 'Serato account not connected' 
      });
    }
    
    // Check if token needs refresh
    let accessToken = connection.seratoAccessToken;
    if (seratoService.isTokenExpired(connection.seratoTokenExpiresAt)) {
      const tokenData = await seratoService.refreshAccessToken(connection.seratoRefreshToken);
      accessToken = tokenData.accessToken;
      await updateSeratoConnection(userId, tokenData);
    }
    
    // Test verification
    const verificationResult = await seratoService.verifyTrackPlay(
      accessToken,
      trackRequirements,
      new Date(startTime),
      new Date(endTime)
    );
    
    res.json({
      success: true,
      verificationResult,
      trackRequirements,
      timeWindow: {
        start: startTime,
        end: endTime
      }
    });
    
  } catch (error) {
    console.error('Serato test verification error:', error);
    res.status(500).json({ 
      error: 'Failed to test verification',
      message: error.message 
    });
  }
});

// Database helper functions (to be implemented with your database client)
async function saveSeratoConnection(userId, tokenData, seratoProfile) {
  // This would save to your database
  console.log(`Saving Serato connection for user ${userId}`, {
    accessToken: tokenData.accessToken,
    refreshToken: tokenData.refreshToken,
    expiresAt: new Date(Date.now() + tokenData.expiresIn * 1000),
    seratoUsername: seratoProfile.username,
    seratoDisplayName: seratoProfile.display_name
  });
}

async function getSeratoConnection(userId) {
  // This would retrieve from your database
  // For now, returning mock data
  return {
    userId,
    seratoAccessToken: "mock_access_token",
    seratoRefreshToken: "mock_refresh_token",
    seratoTokenExpiresAt: new Date(Date.now() + 3600000),
    seratoUsername: "mock_serato_user",
    seratoDisplayName: "Mock Serato User",
    connectedAt: new Date()
  };
}

async function updateSeratoConnection(userId, tokenData) {
  // This would update your database
  console.log(`Updating Serato connection for user ${userId}`, tokenData);
}

async function removeSeratoConnection(userId) {
  // This would remove from your database
  console.log(`Removing Serato connection for user ${userId}`);
}

module.exports = router;
