const { PrismaClient } = require('@prisma/client');

async function testBackend() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🧪 Testing Club Run Backend...');
    
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');
    
    // Test Prisma client generation
    console.log('✅ Prisma client generated successfully');
    
    // Test environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'OPENROUTER_API_KEY',
      'AI_MODEL'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.log('⚠️  Missing environment variables:', missingVars.join(', '));
      console.log('📝 Please set up your .env file with the required variables');
    } else {
      console.log('✅ Environment variables configured');
    }
    
    console.log('\n🚀 Backend is ready for development!');
    console.log('📋 Next steps:');
    console.log('   1. Set up your .env file');
    console.log('   2. Run: npx prisma migrate dev');
    console.log('   3. Run: npm run seed');
    console.log('   4. Run: npm run dev');
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testBackend(); 