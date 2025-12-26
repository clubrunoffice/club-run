/**
 * Create Admin-Level Test Accounts
 * These roles cannot be created via public registration
 * Run this after running create-test-users.js
 * 
 * Usage: node create-admin-users.js
 */

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Admin-level test users
const ADMIN_USERS = [
  {
    email: 'operations@test.com',
    password: 'Operations123!',
    firstName: 'Operations',
    lastName: 'Manager',
    role: 'OPERATIONS'
  },
  {
    email: 'partner@test.com',
    password: 'Partner123!',
    firstName: 'Business',
    lastName: 'Partner',
    role: 'PARTNER'
  },
  {
    email: 'admin@test.com',
    password: 'Admin123!',
    firstName: 'System',
    lastName: 'Admin',
    role: 'ADMIN'
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

async function createAdminUser(user) {
  try {
    console.log(`${colors.cyan}Creating admin user: ${user.email}${colors.reset}`);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (existingUser) {
      console.log(`${colors.yellow}⚠️  SKIPPED: ${user.email} already exists${colors.reset}\n`);
      return { success: true, user: user.email, role: user.role, skipped: true };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        passwordHash: hashedPassword,
        role: user.role,
        badges: '',
        isActive: true
      }
    });

    console.log(`${colors.green}✅ SUCCESS: ${user.role} account created${colors.reset}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${user.password}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   ID: ${newUser.id}\n`);
    
    return { success: true, user: user.email, role: user.role };
  } catch (error) {
    console.log(`${colors.red}❌ FAILED: ${user.email}${colors.reset}`);
    console.log(`   Error: ${error.message}\n`);
    return { success: false, user: user.email, role: user.role, error: error.message };
  }
}

async function createAllAdminUsers() {
  console.log(`\n${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}      Creating Admin-Level Test Accounts${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════════${colors.reset}\n`);
  
  console.log(`${colors.cyan}Total Admin Users to Create: ${ADMIN_USERS.length}${colors.reset}`);
  console.log(`${colors.yellow}These accounts have elevated privileges${colors.reset}\n`);

  const results = [];

  for (const user of ADMIN_USERS) {
    const result = await createAdminUser(user);
    results.push(result);
  }

  // Summary
  console.log(`${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`);
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
    console.log(`${colors.green}🎉 Admin accounts are ready!${colors.reset}`);
    console.log(`${colors.cyan}📋 See TEST_CREDENTIALS.md for login details${colors.reset}`);
    console.log(`${colors.cyan}📖 See RBAC_TESTING_GUIDE.md for testing instructions${colors.reset}\n`);
  }

  if (failed > 0) {
    console.log(`${colors.yellow}⚠️  Some users failed to create. Check errors above.${colors.reset}\n`);
  }

  console.log(`${colors.blue}═══════════════════════════════════════════════════════${colors.reset}\n`);
}

// Main execution
(async () => {
  try {
    await createAllAdminUsers();
  } catch (error) {
    console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  } finally {
    await prisma.$disconnect();
  }
})();
