const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get all venues
router.get('/', async (req, res) => {
  try {
    const { type, status, search, limit = 50 } = req.query;
    
    const whereClause = { isActive: true };
    
    if (type) whereClause.type = type;
    if (status) whereClause.status = status;
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ];
    }

    const venues = await req.prisma.venue.findMany({
      where: whereClause,
      take: parseInt(limit),
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { checkIns: true }
        }
      }
    });

    res.json({
      venues: venues.map(venue => ({
        ...venue,
        popularity: venue._count.checkIns
      })),
      total: venues.length
    });
  } catch (error) {
    console.error('Get venues error:', error);
    res.status(500).json({ error: 'Failed to fetch venues' });
  }
});

// Get single venue
router.get('/:id', async (req, res) => {
  try {
    const venue = await req.prisma.venue.findUnique({
      where: { id: req.params.id },
      include: {
        checkIns: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true } } }
        },
        _count: {
          select: { checkIns: true }
        }
      }
    });

    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    res.json({
      venue: {
        ...venue,
        popularity: venue._count.checkIns,
        recentActivity: venue.checkIns
      }
    });
  } catch (error) {
    console.error('Get venue error:', error);
    res.status(500).json({ error: 'Failed to fetch venue' });
  }
});

// Get venue analytics (authenticated)
router.get('/:id/analytics', authenticateToken, async (req, res) => {
  try {
    const venueId = req.params.id;
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const analytics = await req.prisma.checkIn.groupBy({
      by: ['createdAt'],
      where: {
        venueId,
        createdAt: { gte: startDate }
      },
      _count: { id: true },
      orderBy: { createdAt: 'desc' }
    });

    const totalCheckIns = await req.prisma.checkIn.count({
      where: { venueId, createdAt: { gte: startDate } }
    });

    const avgRating = await req.prisma.venue.findUnique({
      where: { id: venueId },
      select: { safetyRating: true, avgCost: true }
    });

    res.json({
      analytics: {
        totalCheckIns,
        dailyBreakdown: analytics,
        averageRating: avgRating?.safetyRating || 0,
        averageCost: avgRating?.avgCost || 0,
        period: `${days} days`
      }
    });
  } catch (error) {
    console.error('Get venue analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router; 