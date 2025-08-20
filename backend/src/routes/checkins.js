const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get user check-ins
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { limit = 20, offset = 0, venueId } = req.query;
    const userId = req.user.id;

    const whereClause = { userId };
    if (venueId) whereClause.venueId = venueId;

    const checkIns = await req.prisma.checkIn.findMany({
      where: whereClause,
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { createdAt: 'desc' },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            type: true,
            checkInReward: true
          }
        }
      }
    });

    const total = await req.prisma.checkIn.count({ where: whereClause });

    res.json({
      checkIns,
      total,
      hasMore: total > parseInt(offset) + checkIns.length
    });
  } catch (error) {
    console.error('Get check-ins error:', error);
    res.status(500).json({ error: 'Failed to fetch check-ins' });
  }
});

// Create check-in
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { venueId, notes, location, photoUrl } = req.body;
    const userId = req.user.id;

    if (!venueId) {
      return res.status(400).json({ error: 'Venue ID is required' });
    }

    // Verify venue exists
    const venue = await req.prisma.venue.findUnique({
      where: { id: venueId, isActive: true }
    });

    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    // Check for recent check-in (prevent duplicates)
    const recentCheckIn = await req.prisma.checkIn.findFirst({
      where: {
        userId,
        venueId,
        createdAt: { gte: new Date(Date.now() - 2 * 60 * 60 * 1000) } // 2 hours
      }
    });

    if (recentCheckIn) {
      return res.status(409).json({ error: 'Already checked in recently' });
    }

    // Create check-in
    const checkIn = await req.prisma.checkIn.create({
      data: {
        userId,
        venueId,
        tokens: venue.checkInReward,
        notes,
        location,
        photoUrl,
        hasPhoto: !!photoUrl,
        verified: true
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            type: true,
            checkInReward: true
          }
        }
      }
    });

    // Update user stats
    await req.prisma.user.update({
      where: { id: userId },
      data: {
        tokenBalance: { increment: venue.checkInReward },
        totalCheckIns: { increment: 1 }
      }
    });

    // Broadcast update
    req.io.to(`user-${userId}`).emit('check-in-created', {
      checkIn,
      tokensEarned: venue.checkInReward
    });

    res.status(201).json({
      message: 'Check-in successful',
      checkIn,
      tokensEarned: venue.checkInReward
    });
  } catch (error) {
    console.error('Create check-in error:', error);
    res.status(500).json({ error: 'Failed to create check-in' });
  }
});

// Get check-in by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const checkIn = await req.prisma.checkIn.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            type: true,
            checkInReward: true
          }
        }
      }
    });

    if (!checkIn) {
      return res.status(404).json({ error: 'Check-in not found' });
    }

    res.json({ checkIn });
  } catch (error) {
    console.error('Get check-in error:', error);
    res.status(500).json({ error: 'Failed to fetch check-in' });
  }
});

// Update check-in
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { notes, photoUrl } = req.body;
    const checkInId = req.params.id;
    const userId = req.user.id;

    const checkIn = await req.prisma.checkIn.findFirst({
      where: { id: checkInId, userId }
    });

    if (!checkIn) {
      return res.status(404).json({ error: 'Check-in not found' });
    }

    const updatedCheckIn = await req.prisma.checkIn.update({
      where: { id: checkInId },
      data: {
        notes,
        photoUrl,
        hasPhoto: !!photoUrl
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            type: true,
            checkInReward: true
          }
        }
      }
    });

    res.json({
      message: 'Check-in updated successfully',
      checkIn: updatedCheckIn
    });
  } catch (error) {
    console.error('Update check-in error:', error);
    res.status(500).json({ error: 'Failed to update check-in' });
  }
});

module.exports = router; 