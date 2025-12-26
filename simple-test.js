// Simple direct test
const axios = require('axios');

async function testLogin() {
  try {
    console.log('\nTesting admin@test.com...');
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@test.com',
      password: 'Admin123!'
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    });
    
    console.log('✅ SUCCESS!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ FAILED');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else if (error.request) {
      console.log('No response received');
      console.log('Request made but no response');
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLogin();
