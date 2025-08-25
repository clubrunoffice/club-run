const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const seratoFileService = require('../services/serato/SeratoFileVerificationService');
const router = express.Router();

/**
 * Detect Serato installation (for signup)
 * GET /api/serato-file/detect
 */
router.get('/detect', async (req, res) => {
  try {
    const installation = await seratoFileService.detectSeratoInstallation();
    
    res.json({
      success: true,
      found: installation.found,
      path: installation.path,
      files: installation.files,
      message: installation.found 
        ? 'Serato installation detected' 
        : 'Serato installation not found'
    });
  } catch (error) {
    console.error('Serato detection error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to detect Serato installation',
      message: error.message
    });
  }
});

/**
 * Verify Serato skills by reading database files (for signup)
 * POST /api/serato-file/verify
 */
router.post('/verify', async (req, res) => {
  try {
    // Perform verification (no user ID needed for signup)
    const verification = await seratoFileService.verifySeratoSkills();
    
    if (!verification.success) {
      return res.status(400).json({
        success: false,
        error: verification.error,
        message: verification.message
      });
    }

    // For signup, we just return the verification results
    // The verification data will be saved when the user completes signup
    const verificationData = {
      verified: true,
      skillLevel: verification.skillLevel,
      score: verification.score,
      verificationHash: verification.verificationHash,
      verifiedAt: new Date(),
      database: verification.database
    };

    console.log('Verification data for signup:', verificationData);

    res.json({
      success: true,
      message: verification.message,
      verification: {
        skillLevel: verification.skillLevel,
        score: verification.score,
        factors: verification.factors,
        verifiedAt: verificationData.verifiedAt,
        database: {
          library: verification.database.library,
          history: verification.database.history,
          crates: verification.database.crates,
          analysis: verification.database.analysis,
          lastActivity: verification.database.lastActivity,
          installationDate: verification.database.installationDate
        }
      }
    });

  } catch (error) {
    console.error('Serato verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify Serato skills',
      message: error.message
    });
  }
});

/**
 * Get verification status for a user
 * GET /api/serato-file/status/:userId
 */
router.get('/status/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // In production, retrieve from database
    // For now, return mock data
    const mockStatus = {
      verified: false,
      skillLevel: null,
      score: null,
      verifiedAt: null,
      lastVerified: null
    };

    res.json({
      success: true,
      status: mockStatus,
      message: 'Verification status retrieved'
    });

  } catch (error) {
    console.error('Status retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve verification status',
      message: error.message
    });
  }
});

/**
 * Re-verify Serato skills
 * POST /api/serato-file/reverify
 */
router.post('/reverify', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Perform new verification
    const verification = await seratoFileService.verifySeratoSkills();
    
    if (!verification.success) {
      return res.status(400).json({
        success: false,
        error: verification.error,
        message: verification.message
      });
    }

    // Update verification data
    const updatedVerification = {
      userId,
      verified: true,
      skillLevel: verification.skillLevel,
      score: verification.score,
      verificationHash: verification.verificationHash,
      verifiedAt: new Date(),
      lastVerified: new Date(),
      database: verification.database
    };

    // Mock database update
    console.log('Updating verification data:', updatedVerification);

    res.json({
      success: true,
      message: `Re-verified as ${verification.skillLevel} DJ`,
      verification: {
        skillLevel: verification.skillLevel,
        score: verification.score,
        factors: verification.factors,
        verifiedAt: updatedVerification.verifiedAt,
        lastVerified: updatedVerification.lastVerified,
        database: {
          library: verification.database.library,
          history: verification.database.history,
          crates: verification.database.crates,
          analysis: verification.database.analysis,
          lastActivity: verification.database.lastActivity,
          installationDate: verification.database.installationDate
        }
      }
    });

  } catch (error) {
    console.error('Serato re-verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to re-verify Serato skills',
      message: error.message
    });
  }
});

/**
 * Get skill level statistics
 * GET /api/serato-file/stats
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // In production, retrieve from database
    // For now, return mock statistics
    const mockStats = {
      totalVerified: 1250,
      skillLevels: {
        BEGINNER: 150,
        NOVICE: 300,
        INTERMEDIATE: 400,
        ADVANCED: 250,
        EXPERT: 150
      },
      averageScore: 65,
      recentVerifications: 45
    };

    res.json({
      success: true,
      stats: mockStats,
      message: 'Statistics retrieved successfully'
    });

  } catch (error) {
    console.error('Stats retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve statistics',
      message: error.message
    });
  }
});

/**
 * Compare user's skills with others
 * GET /api/serato-file/compare
 */
router.get('/compare', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // In production, retrieve user's verification and compare
    // For now, return mock comparison data
    const mockComparison = {
      userRank: 1250,
      totalUsers: 5000,
      percentile: 75,
      skillLevel: 'ADVANCED',
      score: 78,
      improvements: [
        'Add more tracks to your library',
        'Create more organized crates',
        'Analyze more tracks for better mixing'
      ]
    };

    res.json({
      success: true,
      comparison: mockComparison,
      message: 'Comparison data retrieved'
    });

  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve comparison data',
      message: error.message
    });
  }
});

module.exports = router;
