/**
 * Create Test User Accounts for RBAC Testing
 * Run this script to populate database with test credentials
 * 
 * Usage: node create-test-users.js
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

// Test user credentials for all 8 RBAC roles
// Note: Only CLIENT, RUNNER, DJ, VERIFIED_DJ, CURATOR can self-register
// OPERATIONS, PARTNER, ADMIN must be created by admin or via database
const TEST_USERS = [
  {
    email: 'dj@test.com',
    password: 'DJ123456!',
    firstName: 'DJ',
    lastName: 'Test User',
    role: 'DJ'
  },
  {
    email: 'runner@test.com',
    password: 'Runner123!',
    firstName: 'Runner',
    lastName: 'User',
    role: 'RUNNER'
  },
  {
    email: 'verified.dj@test.com',
    password: 'VerifiedDJ123!',
    firstName: 'Verified',
    lastName: 'DJ Pro',
    role: 'DJ', // Will be upgraded to VERIFIED_DJ after Serato verification
    seratoVerified: false
  },
  {
    email: 'client@test.com',
    password: 'Client123!',
    firstName: 'Event',
    lastName: 'Client',
    role: 'CLIENT'
  },
  {
    email: 'curator@test.com',
    password: 'Curator123!',
    firstName: 'Music',
    lastName: 'Curator',
    role: 'CURATOR'
  }
];

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

async function createTestUser(user) {
  try {
    console.log(`${colors.cyan}Creating user: ${user.email}${colors.reset}`);
    
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, user);
    
    if (response.status === 201 || response.status === 200) {
      console.log(`${colors.green}✅ SUCCESS: ${user.role} account created${colors.reset}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Role: ${user.role}\n`);
      return { success: true, user: user.email, role: user.role };
    }
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
      console.log(`${colors.yellow}⚠️  SKIPPED: ${user.email} already exists${colors.reset}\n`);
      return { success: true, user: user.email, role: user.role, skipped: true };
    } else {
      console.log(`${colors.red}❌ FAILED: ${user.email}${colors.reset}`);
      console.log(`   Error: ${error.response?.data?.message || error.message}\n`);
      return { success: false, user: user.email, role: user.role, error: error.message };
    }
  }
}

async function createAllTestUsers() {
  console.log(`${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}      Creating Test Users for RBAC Testing${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════════${colors.reset}\n`);
  
  console.log(`${colors.cyan}API Base URL: ${API_BASE_URL}${colors.reset}`);
  console.log(`${colors.cyan}Total Users to Create: ${TEST_USERS.length}${colors.reset}`);
  console.log(`${colors.yellow}Note: Only CLIENT, RUNNER, DJ, CURATOR can self-register${colors.reset}`);
  console.log(`${colors.yellow}      Higher roles (OPERATIONS, PARTNER, ADMIN) need admin creation${colors.reset}\n`);

  const results = [];

  for (const user of TEST_USERS) {
    const result = await createTestUser(user);
    results.push(result);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  console.log(`\n${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}                    SUMMARY${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════════${colors.reset}\n`);

  const created = results.filter(r => r.success && !r.skipped).length;
  const skipped = results.filter(r => r.skipped).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`${colors.green}✅ Created: ${created}${colors.reset}`);
  console.log(`${colors.yellow}⚠️  Skipped: ${skipped}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);
  console.log(`${colors.cyan}📊 Total: ${results.length}${colors.reset}\n`);

  if (created > 0 || skipped > 0) {
    console.log(`${colors.green}🎉 Test accounts are ready!${colors.reset}`);
    console.log(`${colors.cyan}📋 See TEST_CREDENTIALS.md for login details${colors.reset}`);
    console.log(`${colors.cyan}📖 See RBAC_TESTING_GUIDE.md for testing instructions${colors.reset}\n`);
  }

  if (failed > 0) {
    console.log(`${colors.yellow}⚠️  Some users failed to create. Check errors above.${colors.reset}\n`);
  }

  console.log(`${colors.blue}═══════════════════════════════════════════════════════${colors.reset}\n`);
}

// Check if server is running
async function checkServer() {
  try {
    console.log(`${colors.cyan}Checking if API server is running...${colors.reset}`);
    await axios.get(`${API_BASE_URL}/api/auth/me`, {
      validateStatus: () => true // Accept any status
    });
    console.log(`${colors.green}✅ API server is running${colors.reset}\n`);
    return true;
  } catch (error) {
    console.log(`${colors.red}❌ Cannot connect to API server at ${API_BASE_URL}${colors.reset}`);
    console.log(`${colors.yellow}Please make sure the backend server is running:${colors.reset}`);
    console.log(`${colors.yellow}   cd backend && npm start${colors.reset}\n`);
    return false;
  }
}

// Main execution
(async () => {
  const serverRunning = await checkServer();
  
  if (serverRunning) {
    await createAllTestUsers();
  } else {
    process.exit(1);
  }
})();
