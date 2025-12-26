// Lightweight Privy auth routes for Vercel serverless (using Supabase)
const { PrivyClient } = require('@privy-io/server-auth');
const { createClient } = require('@supabase/supabase-js');

const privy = new PrivyClient(
  process.env.PRIVY_APP_ID,
  process.env.PRIVY_APP_SECRET
);

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Authenticate user via Privy token
async function authenticate(req) {
  const authToken = req.headers.authorization?.replace('Bearer ', '');
  
  if (!authToken) {
    throw new Error('No auth token provided');
  }

  const verifiedClaims = await privy.verifyAuthToken(authToken);
  
  // Fetch user from Supabase
  const { data: user, error } = await supabase
    .from('users')
    .select('id,privyId,email,name,role,walletAddress,phone,badges,createdAt')
    .eq('privyId', verifiedClaims.userId)
    .maybeSingle();

  if (error) {
    console.error('Supabase select error:', error.message || error);
    throw new Error('Database error');
  }

  if (!user) {
    // Auto-create user if not exists
    const insert = {
      privyId: verifiedClaims.userId,
      email: verifiedClaims.email || `user_${verifiedClaims.userId.slice(-8)}@privy.generated`,
      name: (verifiedClaims.email && verifiedClaims.email.split('@')[0]) || `User_${verifiedClaims.userId.slice(-8)}`,
      role: 'GUEST',
      createdAt: new Date().toISOString()
    };

    const { data: newUsers, error: insertErr } = await supabase
      .from('users')
      .insert([insert])
      .select('id,privyId,email,name,role,walletAddress,phone,badges,createdAt')
      .limit(1);

    if (insertErr) {
      console.error('Supabase insert error:', insertErr.message || insertErr);
      throw new Error('Database insert error');
    }

    return Array.isArray(newUsers) ? newUsers[0] : newUsers;
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

      const { data: updatedUser, error: updateErr } = await supabase
        .from('users')
        .update({ walletAddress })
        .eq('id', user.id)
        .select('id,privyId,email,name,role,walletAddress,phone,badges,createdAt')
        .maybeSingle();

      if (updateErr) {
        console.error('Supabase update error:', updateErr.message || updateErr);
        return res.status(500).json({ error: 'Failed to update wallet' });
      }

      return res.json({ success: true, user: updatedUser });
    }

    // POST /api/auth/privy-webhook - Privy webhook
    if (path === '/privy-webhook' && req.method === 'POST') {
      const { user_id, email, wallet_address, phone } = req.body;

      // Upsert via Supabase
      const row = {
        privyId: user_id,
        email: email || `user_${user_id.slice(-8)}@privy.generated`,
        phone: phone,
        name: (email && email.split('@')[0]) || phone || `User_${user_id.slice(-8)}`,
        walletAddress: wallet_address || null,
        role: 'GUEST'
      };

      const { data: upserted, error: upsertErr } = await supabase
        .from('users')
        .upsert(row, { onConflict: 'privyId' })
        .select('id')
        .maybeSingle();

      if (upsertErr) {
        console.error('Supabase upsert error:', upsertErr.message || upsertErr);
        return res.status(500).json({ error: 'Failed to sync user' });
      }

      return res.json({ success: true, userId: upserted?.id });
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
