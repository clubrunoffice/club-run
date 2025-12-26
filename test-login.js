/**
 * Quick Test Login Script
 * Tests if we can login with test credentials
 */

const axios = require('axios');

const API_URL = 'http://localhost:3001';

async function testLogin(email, password) {
  try {
    console.log(`\n🔐 Testing login: ${email}`);
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password
    });

    console.log('✅ SUCCESS!');
    console.log('User:', response.data.user);
    return true;
  } catch (error) {
    console.log('❌ FAILED:', error.response?.data?.error || error.message);
    return false;
  }
}

async function runTests() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║     Testing Login Credentials     ║');
  console.log('╚════════════════════════════════════════╝');

  await testLogin('admin@test.com', 'Admin123!');
  await testLogin('client@test.com', 'Client123!');
  await testLogin('verified.dj@test.com', 'VerifiedDJ123!');
  
  console.log('\n');
}

runTests();
