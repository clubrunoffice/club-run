const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/rbac');
const ipfsService = require('../services/ipfs/IPFSService');
const hybridPaymentService = require('../services/payments/HybridPaymentService');
const router = express.Router();

// Get all P2P missions (decentralized discovery)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { paymentType, status, minBudget, maxBudget, teamOnly } = req.query;
    const userId = req.user.id;
    
    // Build where clause for missions
    const whereClause = {};
    
    if (paymentType) {
      whereClause.paymentMethod = paymentType;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (minBudget || maxBudget) {
      whereClause.budget = {};
      if (minBudget) whereClause.budget.gte = parseFloat(minBudget);
      if (maxBudget) whereClause.budget.lte = parseFloat(maxBudget);
    }

    // Filter missions based on user role and team membership
    if (teamOnly === 'true') {
      // Show only team missions for the user
      whereClause.OR = [
        { teamId: { not: null }, team: { members: { some: { id: userId } } } },
        { teamId: { not: null }, curatorId: userId }
      ];
    } else {
      // Show open market missions + user's team missions
      whereClause.OR = [
        { openMarket: true },
        { teamId: { not: null }, team: { members: { some: { id: userId } } } },
        { teamId: { not: null }, curatorId: userId }
      ];
    }

    const missions = await req.prisma.p2pMission.findMany({
      where: whereClause,
      include: {
        curator: {
          select: {
            id: true,
            name: true,
            avatar: true,
            reputation: true
          }
        },
        runner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            reputation: true
          }
        },
        team: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Fetch mission details from IPFS
    const missionsWithDetails = await Promise.all(
      missions.map(async (mission) => {
        try {
          const details = await ipfsService.fetchFromIPFS(mission.ipfsHash);
          return {
            ...mission,
            details
          };
        } catch (error) {
          console.error(`Failed to fetch IPFS details for mission ${mission.id}:`, error);
          return mission;
        }
      })
    );

    res.json({
      missions: missionsWithDetails,
      total: missionsWithDetails.length,
      filters: {
        paymentType,
        status,
        minBudget,
        maxBudget
      }
    });
  } catch (error) {
    console.error('Get P2P missions error:', error);
    res.status(500).json({ error: 'Failed to fetch P2P missions' });
  }
});

// Create P2P mission
router.post('/', authenticateToken, checkRole(['CLIENT', 'CURATOR', 'ADMIN']), async (req, res) => {
  try {
    const {
      title,
      description,
      venueAddress,
      eventType,
      budget,
      deadline,
      paymentMethod,
      requirements = [],
      teamId = null,
      openMarket = true
    } = req.body;

    const userId = req.user.id;

    // Validate payment method
    if (!hybridPaymentService.validatePaymentMethod(paymentMethod)) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    // Validate team access if teamId is provided
    if (teamId) {
      const team = await req.prisma.team.findFirst({
        where: { id: teamId, curatorId: userId }
      });
      
      if (!team) {
        return res.status(403).json({ error: 'You do not have access to this team' });
      }
    }

    // Upload mission details to IPFS
    const missionData = {
      title,
      description,
      venueAddress,
      eventType,
      requirements,
      budget,
      deadline,
      paymentMethod,
      curator: userId,
      teamId,
      openMarket
    };

    const ipfsHash = await ipfsService.uploadMissionDetails(missionData);

    // Generate mission ID
    const missionId = `0x${Date.now().toString(16).padStart(64, '0')}`;

    // Create mission in database (cache of blockchain state)
    const mission = await req.prisma.p2pMission.create({
      data: {
        id: missionId,
        curatorId: userId,
        teamId,
        title,
        description,
        venueAddress,
        eventType,
        budget: parseFloat(budget),
        deadline: new Date(deadline),
        paymentMethod,
        ipfsHash,
        status: 'OPEN',
        requirements: JSON.stringify(requirements),
        openMarket
      },
      include: {
        curator: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    res.json({
      message: 'P2P mission created successfully',
      mission: {
        ...mission,
        details: missionData
      },
      ipfsHash
    });
  } catch (error) {
    console.error('Create P2P mission error:', error);
    res.status(500).json({ error: 'Failed to create P2P mission' });
  }
});

// Accept P2P mission
router.post('/:id/accept', authenticateToken, checkRole(['RUNNER']), async (req, res) => {
  try {
    const missionId = req.params.id;
    const userId = req.user.id;

    const mission = await req.prisma.p2pMission.findUnique({
      where: { id: missionId },
      include: { curator: true }
    });

    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    if (mission.status !== 'OPEN') {
      return res.status(400).json({ error: 'Mission is not available' });
    }

    if (mission.curatorId === userId) {
      return res.status(400).json({ error: 'Cannot accept your own mission' });
    }

    if (new Date() > mission.deadline) {
      return res.status(400).json({ error: 'Mission has expired' });
    }

    // Update mission status
    const updatedMission = await req.prisma.p2pMission.update({
      where: { id: missionId },
      data: {
        runnerId: userId,
        status: 'ASSIGNED',
        assignedAt: new Date()
      },
      include: {
        curator: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        runner: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    res.json({
      message: 'Mission accepted successfully',
      mission: updatedMission
    });
  } catch (error) {
    console.error('Accept P2P mission error:', error);
    res.status(500).json({ error: 'Failed to accept mission' });
  }
});

// Submit proof of completion
router.post('/:id/proof', authenticateToken, async (req, res) => {
  try {
    const missionId = req.params.id;
    const userId = req.user.id;
    const { notes, location, photos, audio } = req.body;

    const mission = await req.prisma.p2pMission.findUnique({
      where: { id: missionId }
    });

    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    if (mission.runnerId !== userId) {
      return res.status(403).json({ error: 'Only assigned runner can submit proof' });
    }

    if (mission.status !== 'ASSIGNED') {
      return res.status(400).json({ error: 'Mission is not in assigned status' });
    }

    // Upload proof to IPFS
    const proofData = {
      photos: photos || [],
      audio: audio || null,
      notes,
      location,
      runner: userId,
      missionId,
      timestamp: Date.now()
    };

    const proofHash = await ipfsService.uploadProof(proofData);

    // Update mission status
    const updatedMission = await req.prisma.p2pMission.update({
      where: { id: missionId },
      data: {
        status: 'IN_PROGRESS',
        proofHash,
        proofSubmittedAt: new Date()
      }
    });

    res.json({
      message: 'Proof submitted successfully',
      mission: updatedMission,
      proofHash
    });
  } catch (error) {
    console.error('Submit proof error:', error);
    res.status(500).json({ error: 'Failed to submit proof' });
  }
});

// Approve and release payment
router.post('/:id/approve', authenticateToken, async (req, res) => {
  try {
    const missionId = req.params.id;
    const userId = req.user.id;

    const mission = await req.prisma.p2pMission.findUnique({
      where: { id: missionId },
      include: {
        curator: true,
        runner: true
      }
    });

    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    if (mission.curatorId !== userId) {
      return res.status(403).json({ error: 'Only curator can approve mission' });
    }

    if (mission.status !== 'IN_PROGRESS') {
      return res.status(400).json({ error: 'Mission is not ready for approval' });
    }

    if (!mission.proofHash) {
      return res.status(400).json({ error: 'No proof submitted' });
    }

    // Process payment based on method
    const paymentResult = await hybridPaymentService.processPayment(
      mission.paymentMethod,
      mission.budget,
      {
        email: mission.runner.email,
        cashAppHandle: mission.runner.cashAppHandle,
        venmoHandle: mission.runner.venmoHandle,
        paypalEmail: mission.runner.paypalEmail
      },
      missionId,
      userId
    );

    // Update mission status
    const updatedMission = await req.prisma.p2pMission.update({
      where: { id: missionId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        paymentDetails: JSON.stringify(paymentResult)
      }
    });

    res.json({
      message: 'Mission approved and payment released',
      mission: updatedMission,
      payment: paymentResult
    });
  } catch (error) {
    console.error('Approve mission error:', error);
    res.status(500).json({ error: 'Failed to approve mission' });
  }
});

// Get mission details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const missionId = req.params.id;

    const mission = await req.prisma.p2pMission.findUnique({
      where: { id: missionId },
      include: {
        curator: {
          select: {
            id: true,
            name: true,
            avatar: true,
            reputation: true
          }
        },
        runner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            reputation: true
          }
        }
      }
    });

    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    // Fetch mission details from IPFS
    let details = null;
    try {
      details = await ipfsService.fetchFromIPFS(mission.ipfsHash);
    } catch (error) {
      console.error('Failed to fetch IPFS details:', error);
    }

    // Fetch proof if available
    let proof = null;
    if (mission.proofHash) {
      try {
        proof = await ipfsService.fetchFromIPFS(mission.proofHash);
      } catch (error) {
        console.error('Failed to fetch proof:', error);
      }
    }

    res.json({
      mission: {
        ...mission,
        details,
        proof
      }
    });
  } catch (error) {
    console.error('Get mission details error:', error);
    res.status(500).json({ error: 'Failed to fetch mission details' });
  }
});

// Cancel mission (curator only)
router.post('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const missionId = req.params.id;
    const userId = req.user.id;

    const mission = await req.prisma.p2pMission.findUnique({
      where: { id: missionId }
    });

    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    if (mission.curatorId !== userId) {
      return res.status(403).json({ error: 'Only curator can cancel mission' });
    }

    if (mission.status !== 'OPEN') {
      return res.status(400).json({ error: 'Cannot cancel assigned mission' });
    }

    const updatedMission = await req.prisma.p2pMission.update({
      where: { id: missionId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date()
      }
    });

    res.json({
      message: 'Mission cancelled successfully',
      mission: updatedMission
    });
  } catch (error) {
    console.error('Cancel mission error:', error);
    res.status(500).json({ error: 'Failed to cancel mission' });
  }
});

// Raise dispute
router.post('/:id/dispute', authenticateToken, async (req, res) => {
  try {
    const missionId = req.params.id;
    const userId = req.user.id;
    const { reason, evidence } = req.body;

    const mission = await req.prisma.p2pMission.findUnique({
      where: { id: missionId }
    });

    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    if (mission.curatorId !== userId && mission.runnerId !== userId) {
      return res.status(403).json({ error: 'Not authorized to raise dispute' });
    }

    if (mission.status === 'COMPLETED' || mission.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Cannot dispute completed or cancelled mission' });
    }

    const updatedMission = await req.prisma.p2pMission.update({
      where: { id: missionId },
      data: {
        status: 'DISPUTED',
        disputeRaisedBy: userId,
        disputeReason: reason,
        disputeEvidence: evidence,
        disputeRaisedAt: new Date()
      }
    });

    res.json({
      message: 'Dispute raised successfully',
      mission: updatedMission
    });
  } catch (error) {
    console.error('Raise dispute error:', error);
    res.status(500).json({ error: 'Failed to raise dispute' });
  }
});

// Get payment methods
router.get('/payment-methods', authenticateToken, async (req, res) => {
  try {
    const methods = ['matic', 'usdc', 'cashapp', 'zelle', 'venmo', 'paypal'];
    const paymentMethods = methods.map(method => 
      hybridPaymentService.getPaymentMethodDetails(method)
    ).filter(Boolean);

    res.json({ paymentMethods });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
});

// Get user's P2P missions
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { type } = req.query; // 'curated' or 'running'

    const whereClause = {};
    
    if (type === 'curated') {
      whereClause.curatorId = userId;
    } else if (type === 'running') {
      whereClause.runnerId = userId;
    } else {
      whereClause.OR = [
        { curatorId: userId },
        { runnerId: userId }
      ];
    }

    const missions = await req.prisma.p2pMission.findMany({
      where: whereClause,
      include: {
        curator: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        runner: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      missions,
      stats: {
        total: missions.length,
        open: missions.filter(m => m.status === 'OPEN').length,
        assigned: missions.filter(m => m.status === 'ASSIGNED').length,
        inProgress: missions.filter(m => m.status === 'IN_PROGRESS').length,
        completed: missions.filter(m => m.status === 'COMPLETED').length,
        disputed: missions.filter(m => m.status === 'DISPUTED').length,
        cancelled: missions.filter(m => m.status === 'CANCELLED').length
      }
    });
  } catch (error) {
    console.error('Get user P2P missions error:', error);
    res.status(500).json({ error: 'Failed to fetch user missions' });
  }
});

module.exports = router;
