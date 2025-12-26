const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAllRoleUsers() {
  const password = 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);

  const users = [
    { email: 'guest@test.com', name: 'Guest User', role: 'GUEST' },
    { email: 'dj@test.com', name: 'DJ User', role: 'DJ' },
    { email: 'verified-dj@test.com', name: 'Verified DJ', role: 'VERIFIED_DJ' },
    { email: 'client@test.com', name: 'Client User', role: 'CLIENT' },
    { email: 'curator@test.com', name: 'Curator User', role: 'CURATOR' },
    { email: 'operations@test.com', name: 'Operations User', role: 'OPERATIONS' },
    { email: 'partner@test.com', name: 'Partner User', role: 'PARTNER' },
    { email: 'admin@test.com', name: 'Admin User', role: 'ADMIN' }
  ];

  console.log('Creating all RBAC role users...\n');

  for (const userData of users) {
    try {
      // Check if user exists
      const existing = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existing) {
        console.log(`✓ ${userData.role} already exists: ${userData.email}`);
        continue;
      }

      // Create user
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          passwordHash,
          name: userData.name,
          role: userData.role,
          badges: ''
        }
      });

      console.log(`✓ Created ${userData.role}: ${userData.email}`);
    } catch (error) {
      console.error(`✗ Failed to create ${userData.role}:`, error.message);
    }
  }

  console.log('\n✅ All users created successfully!');
  console.log('\nLogin credentials (all users):');
  console.log('Password: admin123\n');
  users.forEach(u => {
    console.log(`${u.role.padEnd(15)} : ${u.email}`);
  });
}

createAllRoleUsers()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
