const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('📋 Current users in database:');
    
    const users = await prisma.user.findMany();
    console.log(JSON.stringify(users, null, 2));
    
    console.log('\n✨ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
