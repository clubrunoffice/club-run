const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireRole } = require('../middleware/privyAuth');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Privy webhook endpoint for user sync
 * Configure this URL in Privy dashboard: https://dashboard.privy.io
 */
router.post('/privy-webhook', async (req, res) => {
  try {
    const { user_id, email, wallet_address, phone } = req.body;

    console.log('📥 Privy webhook received:', { user_id, email });

    // Sync user to database
    const user = await prisma.user.upsert({
      where: { privyId: user_id },
      update: {
        email: email || undefined,
        phone: phone || undefined,
        walletAddress: wallet_address || undefined,
        updatedAt: new Date()
      },
      create: {
        privyId: user_id,
        email: email || `user_${user_id.slice(-8)}@privy.generated`,
        phone: phone,
        name: email?.split('@')[0] || phone || `User_${user_id.slice(-8)}`,
        walletAddress: wallet_address,
        role: 'GUEST', // Default role
        badges: ''
      }
    });

    console.log('✅ User synced:', user.id);

    res.json({ success: true, userId: user.id });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ 
      error: 'Failed to sync user',
      details: error.message 
    });
  }
});

/**
 * Get current user with role
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        privyId: true,
        email: true,
        name: true,
        role: true,
        walletAddress: true,
        phone: true,
        badges: true,
        createdAt: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

/**
 * Update user role (ADMIN/OPERATIONS only)
 */
router.post('/update-role', authenticate, requireRole(['ADMIN', 'OPERATIONS']), async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    if (!userId || !newRole) {
      return res.status(400).json({ error: 'userId and newRole are required' });
    }

    // Validate role
    const validRoles = ['GUEST', 'RUNNER', 'DJ', 'VERIFIED_DJ', 'CLIENT', 'CURATOR', 'OPERATIONS', 'PARTNER', 'ADMIN'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Prevent non-ADMIN from creating ADMIN
    if (newRole === 'ADMIN' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can create admin users' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });

    console.log(`✅ Role updated: ${updatedUser.email} → ${newRole}`);

    res.json({ 
      success: true, 
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

/**
 * Select initial role during onboarding (self-service for new users)
 */
router.post('/select-role', authenticate, async (req, res) => {
  try {
    const { newRole } = req.body;

    if (!newRole) {
      return res.status(400).json({ error: 'newRole is required' });
    }

    // Only allow GUEST users to select their initial role
    if (req.user.role !== 'GUEST') {
      return res.status(403).json({ error: 'Role selection is only for new users. Contact admin to change your role.' });
    }

    // Only allow selecting RUNNER, DJ, CLIENT, or CURATOR during onboarding
    const allowedRoles = ['RUNNER', 'DJ', 'CLIENT', 'CURATOR'];
    if (!allowedRoles.includes(newRole)) {
      return res.status(400).json({ error: 'Invalid role selection. Choose RUNNER, DJ, CLIENT, or CURATOR.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { role: newRole }
    });

    console.log(`✅ User selected initial role: ${updatedUser.email} → ${newRole}`);

    res.json({ 
      success: true, 
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error('Error selecting role:', error);
    res.status(500).json({ error: 'Failed to select role' });
  }
});

/**
 * Update wallet address (for embedded wallet creation)
 */
router.post('/update-wallet', authenticate, async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'walletAddress is required' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { walletAddress }
    });

    res.json({ 
      success: true,
      walletAddress: updatedUser.walletAddress
    });
  } catch (error) {
    console.error('Error updating wallet:', error);
    res.status(500).json({ error: 'Failed to update wallet address' });
  }
});

/**
 * Request role upgrade (for users to request role changes)
 */
router.post('/request-role-upgrade', authenticate, async (req, res) => {
  try {
    const { requestedRole, reason } = req.body;

    // Validate requested role
    const allowedUpgrades = {
      GUEST: ['DJ', 'CLIENT'],
      DJ: ['VERIFIED_DJ', 'CLIENT'],
      VERIFIED_DJ: ['CURATOR'],
      CLIENT: ['CURATOR']
    };

    const userAllowedUpgrades = allowedUpgrades[req.user.role] || [];
    
    if (!userAllowedUpgrades.includes(requestedRole)) {
      return res.status(400).json({ 
        error: 'Invalid role upgrade request',
        allowed: userAllowedUpgrades
      });
    }

    // TODO: Create upgrade request in database for admin review
    // For now, just log it
    console.log(`📝 Role upgrade request: ${req.user.email} → ${requestedRole}`);
    console.log(`   Reason: ${reason}`);

    res.json({ 
      success: true,
      message: 'Role upgrade request submitted. An admin will review it shortly.'
    });
  } catch (error) {
    console.error('Error requesting role upgrade:', error);
    res.status(500).json({ error: 'Failed to submit role upgrade request' });
  }
});

/**
 * List all users (ADMIN/OPERATIONS only)
 */
router.get('/users', authenticate, requireRole(['ADMIN', 'OPERATIONS']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        walletAddress: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * Get user online status
 */
router.get('/online-status', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { isOnline: true }
    });

    res.json({ isOnline: user?.isOnline || false });
  } catch (error) {
    console.error('Error fetching online status:', error);
    res.status(500).json({ error: 'Failed to fetch online status' });
  }
});

/**
 * Update user online status
 * Only RUNNER, DJ, VERIFIED_DJ can go online
 */
router.post('/online-status', authenticate, async (req, res) => {
  try {
    const { isOnline } = req.body;
    const allowedRoles = ['RUNNER', 'DJ', 'VERIFIED_DJ'];

    // Check if user has permission to go online
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Only RUNNER, DJ, and VERIFIED_DJ can go online' 
      });
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { 
        isOnline: isOnline,
        lastOnlineAt: isOnline ? new Date() : undefined
      },
      select: {
        id: true,
        email: true,
        role: true,
        isOnline: true,
        lastOnlineAt: true
      }
    });

    console.log(`✅ ${user.role} ${user.email} is now ${isOnline ? 'ONLINE' : 'OFFLINE'}`);

    res.json({ 
      success: true,
      isOnline: user.isOnline,
      lastOnlineAt: user.lastOnlineAt
    });
  } catch (error) {
    console.error('Error updating online status:', error);
    res.status(500).json({ error: 'Failed to update online status' });
  }
});

module.exports = router;
