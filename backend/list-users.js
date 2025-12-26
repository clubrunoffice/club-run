const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        role: true,
        passwordHash: true
      }
    });

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║        DATABASE USERS LIST         ║');
    console.log('╚════════════════════════════════════════╝\n');

    if (users.length === 0) {
      console.log('❌ No users found in database!\n');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. EMAIL: ${user.email}`);
        console.log(`   NAME:  ${user.name}`);
        console.log(`   ROLE:  ${user.role}`);
        console.log(`   HAS PASSWORD: ${user.passwordHash ? 'YES' : 'NO'}`);
        console.log('   ---');
      });
      console.log(`\n✅ Total: ${users.length} users\n`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

listAllUsers();
