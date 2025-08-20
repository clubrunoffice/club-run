const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get user expenses
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { limit = 20, offset = 0, category, venueId } = req.query;
    const userId = req.user.id;

    const whereClause = { userId };
    if (category) whereClause.category = category;
    if (venueId) whereClause.venueId = venueId;

    const expenses = await req.prisma.expense.findMany({
      where: whereClause,
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { createdAt: 'desc' },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      }
    });

    const total = await req.prisma.expense.count({ where: whereClause });
    const totalAmount = await req.prisma.expense.aggregate({
      where: whereClause,
      _sum: { amount: true }
    });

    res.json({
      expenses,
      total,
      totalAmount: totalAmount._sum.amount || 0,
      hasMore: total > parseInt(offset) + expenses.length
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Create expense
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { amount, category, description, venueId, receiptUrl } = req.body;
    const userId = req.user.id;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    // Verify venue exists if provided
    if (venueId) {
      const venue = await req.prisma.venue.findUnique({
        where: { id: venueId, isActive: true }
      });

      if (!venue) {
        return res.status(404).json({ error: 'Venue not found' });
      }
    }

    const expense = await req.prisma.expense.create({
      data: {
        userId,
        venueId,
        amount: parseFloat(amount),
        category,
        description,
        receiptUrl
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Expense logged successfully',
      expense
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Failed to log expense' });
  }
});

// Get expense by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const expense = await req.prisma.expense.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      }
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ expense });
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ error: 'Failed to fetch expense' });
  }
});

// Update expense
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { amount, category, description, receiptUrl } = req.body;
    const expenseId = req.params.id;
    const userId = req.user.id;

    const expense = await req.prisma.expense.findFirst({
      where: { id: expenseId, userId }
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const updatedExpense = await req.prisma.expense.update({
      where: { id: expenseId },
      data: {
        amount: amount ? parseFloat(amount) : undefined,
        category,
        description,
        receiptUrl
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      }
    });

    res.json({
      message: 'Expense updated successfully',
      expense: updatedExpense
    });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// Delete expense
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const expenseId = req.params.id;
    const userId = req.user.id;

    const expense = await req.prisma.expense.findFirst({
      where: { id: expenseId, userId }
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await req.prisma.expense.delete({
      where: { id: expenseId }
    });

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Get expense analytics
router.get('/analytics/summary', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const userId = req.user.id;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const analytics = await req.prisma.expense.groupBy({
      by: ['category'],
      where: {
        userId,
        createdAt: { gte: startDate }
      },
      _sum: { amount: true },
      _count: { id: true }
    });

    const totalAmount = await req.prisma.expense.aggregate({
      where: {
        userId,
        createdAt: { gte: startDate }
      },
      _sum: { amount: true }
    });

    const totalCount = await req.prisma.expense.count({
      where: {
        userId,
        createdAt: { gte: startDate }
      }
    });

    res.json({
      analytics: {
        byCategory: analytics,
        totalAmount: totalAmount._sum.amount || 0,
        totalCount,
        period: `${days} days`
      }
    });
  } catch (error) {
    console.error('Get expense analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router; 