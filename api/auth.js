// Lightweight Privy auth routes for Vercel serverless
const { PrivyClient } = require('@privy-io/server-auth');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const privy = new PrivyClient(
  process.env.PRIVY_APP_ID,
  process.env.PRIVY_APP_SECRET
);

// Authenticate user via Privy token
async function authenticate(req) {
  const authToken = req.headers.authorization?.replace('Bearer ', '');
  
  if (!authToken) {
    throw new Error('No auth token provided');
  }

  const verifiedClaims = await privy.verifyAuthToken(authToken);
  
  // Fetch user from database
  const user = await prisma.user.findUnique({
    where: { privyId: verifiedClaims.userId },
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

  if (!user) {
    // Auto-create user if not exists
    const newUser = await prisma.user.create({
      data: {
        privyId: verifiedClaims.userId,
        email: verifiedClaims.email || `user_${verifiedClaims.userId.slice(-8)}@privy.generated`,
        name: verifiedClaims.email?.split('@')[0] || `User_${verifiedClaims.userId.slice(-8)}`,
        role: 'GUEST'
      }
    });
    return newUser;
  }

  return user;
}

// Export Vercel serverless handler
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const path = req.url.replace('/api/auth', '');

  try {
    // GET /api/auth/me - Get current user
    if (path === '/me' && req.method === 'GET') {
      const user = await authenticate(req);
      return res.json(user);
    }

    // POST /api/auth/update-wallet - Update wallet address
    if (path === '/update-wallet' && req.method === 'POST') {
      const user = await authenticate(req);
      const { walletAddress } = req.body;

      if (!walletAddress) {
        return res.status(400).json({ error: 'walletAddress is required' });
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { walletAddress }
      });

      return res.json({ success: true, user: updatedUser });
    }

    // POST /api/auth/privy-webhook - Privy webhook
    if (path === '/privy-webhook' && req.method === 'POST') {
      const { user_id, email, wallet_address, phone } = req.body;

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
          role: 'GUEST',
          badges: ''
        }
      });

      return res.json({ success: true, userId: user.id });
    }

    // 404 for unknown routes
    return res.status(404).json({ 
      error: 'Route not found',
      path: req.url 
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
};
