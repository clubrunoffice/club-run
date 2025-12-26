// Quick script to reset user role to GUEST for testing
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetUserRole() {
  try {
    // Find the most recent user
    const user = await prisma.user.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (!user) {
      console.log('❌ No users found');
      return;
    }

    console.log(`📝 Found user: ${user.email} (${user.role})`);

    // Update to GUEST
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'GUEST' }
    });

    console.log(`✅ Updated ${updated.email} role to GUEST`);
    console.log('🔄 Please refresh browser and clear localStorage');
    console.log('   1. Press F12');
    console.log('   2. Go to Console tab');
    console.log('   3. Type: localStorage.clear()');
    console.log('   4. Press Enter');
    console.log('   5. Refresh page');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetUserRole();
