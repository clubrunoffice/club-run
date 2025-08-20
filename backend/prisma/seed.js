const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  console.log('👤 Creating admin user...');
  const adminPassword = await bcrypt.hash('admin123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@clubrun.com' },
    update: {},
    create: {
      email: 'admin@clubrun.com',
      name: 'System Administrator',
      passwordHash: adminPassword,
      role: 'ADMIN',
      tokenBalance: 1000,
      level: 'Admin',
      theme: 'dark'
    }
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create sample users with different roles
  console.log('👥 Creating sample users...');
  
  const sampleUsers = [
    {
      email: 'runner@clubrun.com',
      name: 'John Runner',
      role: 'RUNNER',
      tokenBalance: 150,
      level: 'Navigator'
    },
    {
      email: 'client@clubrun.com',
      name: 'Sarah Client',
      role: 'CLIENT',
      tokenBalance: 200,
      level: 'VIP'
    },
    {
      email: 'operations@clubrun.com',
      name: 'Mike Operations',
      role: 'OPERATIONS',
      tokenBalance: 300,
      level: 'Manager'
    },
    {
      email: 'partner@clubrun.com',
      name: 'Lisa Partner',
      role: 'PARTNER',
      tokenBalance: 250,
      level: 'Partner'
    }
  ];

  for (const userData of sampleUsers) {
    const password = await bcrypt.hash('password123', 12);
    
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        passwordHash: password,
        theme: 'dark'
      }
    });
    
    console.log(`✅ Created ${userData.role} user:`, userData.email);
  }

  // Create some sample system logs
  console.log('📝 Creating sample system logs...');
  
  const sampleLogs = [
    {
      level: 'info',
      message: 'System initialized successfully',
      userId: adminUser.id
    },
    {
      level: 'info',
      message: 'Admin user logged in',
      userId: adminUser.id
    },
    {
      level: 'warn',
      message: 'High memory usage detected',
      userId: null
    }
  ];

  for (const logData of sampleLogs) {
    await prisma.systemLog.create({
      data: logData
    });
  }

  console.log('✅ Sample system logs created');

  console.log('🎉 Database seeding completed!');
  console.log('\n📋 Login Credentials:');
  console.log('Admin: admin@clubrun.com / admin123');
  console.log('Runner: runner@clubrun.com / password123');
  console.log('Client: client@clubrun.com / password123');
  console.log('Operations: operations@clubrun.com / password123');
  console.log('Partner: partner@clubrun.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 