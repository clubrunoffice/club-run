const axios = require('axios');

// Test the ChatGPT integration
async function testChatGPTIntegration() {
  console.log('🧪 Testing ChatGPT Integration...\n');

  try {
    // Test 1: Check if the enhanced service is loaded
    console.log('✅ Test 1: Enhanced ChatGPT Service');
    const enhancedService = require('./backend/src/services/ai/EnhancedChatGPTService');
    console.log('   - Service loaded successfully');
    console.log('   - Daily limits configured:', Object.keys(enhancedService.dailyLimits).length, 'roles');
    console.log('   - Local queries configured:', enhancedService.localQueries.length, 'queries');
    console.log('   - Complex queries configured:', enhancedService.complexQueries.length, 'queries\n');

    // Test 2: Check environment variables
    console.log('✅ Test 2: Environment Configuration');
    console.log('   - OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('   - CHATGPT_ENABLED:', process.env.CHATGPT_ENABLED || 'true');
    console.log('   - Database: SQLite (dev.db)\n');

    // Test 3: Check database schema
    console.log('✅ Test 3: Database Schema');
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    try {
      await prisma.$connect();
      console.log('   - Database connection: ✅ Success');
      
      // Check if ChatGPTCostLog table exists
      const tableExists = await prisma.$queryRaw`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='ChatGPTCostLog'
      `;
      console.log('   - ChatGPTCostLog table:', tableExists.length > 0 ? '✅ Exists' : '❌ Missing');
      
      await prisma.$disconnect();
    } catch (dbError) {
      console.log('   - Database connection: ❌ Failed');
      console.log('   - Error:', dbError.message);
    }

    // Test 4: Test data sanitization
    console.log('\n✅ Test 4: Data Sanitization');
    const testMessage = "My email is user@example.com and phone is 555-123-4567. My SSN is 123-45-6789.";
    const sanitized = enhancedService.sanitizeInput(testMessage);
    console.log('   - Original:', testMessage);
    console.log('   - Sanitized:', sanitized);
    console.log('   - Sanitization working:', sanitized.includes('[EMAIL]') && sanitized.includes('[PHONE]') ? '✅ Yes' : '❌ No');

    // Test 5: Test query routing
    console.log('\n✅ Test 5: Query Routing Logic');
    const localQuery = "Create mission";
    const complexQuery = "Help me plan a music festival";
    
    console.log('   - Local query detection:', enhancedService.shouldHandleLocally(localQuery) ? '✅ Correct' : '❌ Wrong');
    console.log('   - Complex query detection:', !enhancedService.shouldHandleLocally(complexQuery) ? '✅ Correct' : '❌ Wrong');

    // Test 6: Test role-based limits
    console.log('\n✅ Test 6: Role-Based Cost Limits');
    console.log('   - GUEST limit:', enhancedService.dailyLimits.GUEST, '(should be 0)');
    console.log('   - DJ limit:', enhancedService.dailyLimits.DJ, '(should be 1.00)');
    console.log('   - ADMIN limit:', enhancedService.dailyLimits.ADMIN, '(should be 10.00)');

    console.log('\n🎉 All tests completed!');
    console.log('\n📋 Next Steps:');
    console.log('1. Start your frontend: cd frontend && npm run dev');
    console.log('2. Open http://localhost:5173 in your browser');
    console.log('3. Try the chat bot with different queries');
    console.log('4. Check the admin dashboard for analytics');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testChatGPTIntegration();
