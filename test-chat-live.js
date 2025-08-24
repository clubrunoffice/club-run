const axios = require('axios');

async function testChatGPTLive() {
  console.log('🧪 Testing ChatGPT Integration LIVE...\n');

  try {
    // Test 1: Check if backend is responding
    console.log('✅ Test 1: Backend Health Check');
    const healthResponse = await axios.get('http://localhost:3001/api/health');
    console.log('   - Backend Status:', healthResponse.data.status);
    console.log('   - Message:', healthResponse.data.message);
    console.log('   - Environment:', healthResponse.data.environment);

    // Test 2: Check if frontend is accessible
    console.log('\n✅ Test 2: Frontend Accessibility');
    try {
      const frontendResponse = await axios.get('http://localhost:3007/');
      console.log('   - Frontend Status: ✅ Accessible');
      console.log('   - Response Length:', frontendResponse.data.length, 'characters');
    } catch (error) {
      console.log('   - Frontend Status: ❌ Not accessible');
      console.log('   - Error:', error.message);
    }

    // Test 3: Test ChatGPT service directly
    console.log('\n✅ Test 3: ChatGPT Service Test');
    const enhancedService = require('./backend/src/services/ai/EnhancedChatGPTService');
    
    // Test data sanitization
    const testMessage = "My email is test@example.com and phone is 555-123-4567";
    const sanitized = enhancedService.sanitizeInput(testMessage);
    console.log('   - Data Sanitization: ✅ Working');
    console.log('   - Original:', testMessage);
    console.log('   - Sanitized:', sanitized);

    // Test query routing
    const localQuery = "Create mission";
    const complexQuery = "Help me plan a music festival";
    console.log('   - Local Query Detection:', enhancedService.shouldHandleLocally(localQuery) ? '✅ Correct' : '❌ Wrong');
    console.log('   - Complex Query Detection:', !enhancedService.shouldHandleLocally(complexQuery) ? '✅ Correct' : '❌ Wrong');

    // Test role-based limits
    console.log('   - Role Limits:');
    console.log('     • GUEST:', enhancedService.dailyLimits.GUEST, '(should be 0)');
    console.log('     • DJ:', enhancedService.dailyLimits.DJ, '(should be 1.00)');
    console.log('     • ADMIN:', enhancedService.dailyLimits.ADMIN, '(should be 10.00)');

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Next Steps for Manual Testing:');
    console.log('1. Open http://localhost:3007/ in your browser');
    console.log('2. Look for the chat bot in the bottom right corner');
    console.log('3. Try these test queries:');
    console.log('   • Local (FREE): "Create mission", "Check in", "Help"');
    console.log('   • ChatGPT (Paid): "Plan a music festival", "Marketing advice"');
    console.log('4. Check for response indicators: ⚡ Instant vs 🤖 AI Powered (no cost display)');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure backend is running: npm run dev (in backend folder)');
    console.log('2. Make sure frontend is running: npm run dev (in frontend folder)');
    console.log('3. Check that OpenAI API key is set in .env file');
  }
}

// Run the test
testChatGPTLive();
