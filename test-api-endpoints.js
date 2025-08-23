#!/usr/bin/env node

/**
 * Club Run API Endpoint Testing Script
 * Tests all API endpoints to verify functionality
 */

const axios = require('axios');

const BASE_URL = process.env.API_URL || 'http://localhost:3001';

// Test configuration
const TESTS = {
  health: {
    name: 'Health Check',
    endpoint: '/health',
    method: 'GET',
    expectedStatus: 200
  },
  apiHealth: {
    name: 'API Health Check',
    endpoint: '/api/health',
    method: 'GET',
    expectedStatus: 200
  },
  authHealth: {
    name: 'Auth Health Check',
    endpoint: '/api/auth/health',
    method: 'GET',
    expectedStatus: 200
  },
  venues: {
    name: 'Venues API',
    endpoint: '/api/venues',
    method: 'GET',
    expectedStatus: 200
  },
  venuesWithParams: {
    name: 'Venues API with Parameters',
    endpoint: '/api/venues?type=bar&limit=5',
    method: 'GET',
    expectedStatus: 200
  },
  authRegister: {
    name: 'Auth Register',
    endpoint: '/api/auth/register',
    method: 'POST',
    expectedStatus: 201,
    data: {
      email: 'test@clubrun.com',
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User'
    }
  },
  authLogin: {
    name: 'Auth Login',
    endpoint: '/api/auth/login',
    method: 'POST',
    expectedStatus: 200,
    data: {
      email: 'admin@clubrun.com',
      password: 'Admin123!'
    }
  },
  googleOAuth: {
    name: 'Google OAuth',
    endpoint: '/api/auth/google',
    method: 'POST',
    expectedStatus: 200,
    data: {
      accessToken: 'mock_google_token',
      userInfo: {
        email: 'test-google@clubrun.com',
        given_name: 'Test',
        family_name: 'Google',
        picture: 'https://via.placeholder.com/150',
        id: 'test_google_user_123'
      }
    }
  }
};

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(test) {
  try {
    log(`🧪 Testing: ${test.name}`, 'blue');
    
    const config = {
      method: test.method,
      url: `${BASE_URL}${test.endpoint}`,
      timeout: 10000
    };

    if (test.data) {
      config.data = test.data;
      config.headers = {
        'Content-Type': 'application/json'
      };
    }

    const response = await axios(config);
    
    if (response.status === test.expectedStatus) {
      log(`✅ ${test.name}: PASSED (${response.status})`, 'green');
      
      // Log response details for important endpoints
      if (test.name.includes('Health') || test.name.includes('OAuth')) {
        console.log(`   Response:`, JSON.stringify(response.data, null, 2));
      }
      
      return { success: true, status: response.status, data: response.data };
    } else {
      log(`❌ ${test.name}: FAILED (Expected ${test.expectedStatus}, got ${response.status})`, 'red');
      return { success: false, status: response.status, error: 'Unexpected status code' };
    }
  } catch (error) {
    if (error.response) {
      log(`❌ ${test.name}: FAILED (${error.response.status})`, 'red');
      console.log(`   Error: ${error.response.data?.error || error.message}`);
      return { success: false, status: error.response.status, error: error.response.data };
    } else if (error.code === 'ECONNREFUSED') {
      log(`❌ ${test.name}: FAILED (Connection refused)`, 'red');
      console.log(`   Error: Cannot connect to ${BASE_URL}`);
      return { success: false, error: 'Connection refused' };
    } else {
      log(`❌ ${test.name}: FAILED (${error.message})`, 'red');
      return { success: false, error: error.message };
    }
  }
}

async function runAllTests() {
  log('🚀 Starting Club Run API Endpoint Tests', 'blue');
  log(`📍 Base URL: ${BASE_URL}`, 'blue');
  log('');

  const results = [];
  
  for (const [key, test] of Object.entries(TESTS)) {
    const result = await testEndpoint(test);
    results.push({ ...result, test: test.name });
    log(''); // Add spacing between tests
  }

  // Summary
  log('📊 Test Results Summary', 'blue');
  log('====================', 'blue');
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const total = results.length;

  log(`✅ Passed: ${passed}`, 'green');
  log(`❌ Failed: ${failed}`, 'red');
  log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`, 'blue');
  log('');

  if (failed > 0) {
    log('❌ Failed Tests:', 'red');
    results.filter(r => !r.success).forEach(result => {
      log(`   - ${result.test}: ${result.error || `Status ${result.status}`}`, 'red');
    });
    log('');
  }

  if (passed > 0) {
    log('✅ Working Endpoints:', 'green');
    results.filter(r => r.success).forEach(result => {
      log(`   - ${result.test}`, 'green');
    });
    log('');
  }

  // Recommendations
  log('💡 Recommendations:', 'yellow');
  if (failed > 0) {
    log('   - Check if the backend service is running properly');
    log('   - Verify Docker containers are healthy');
    log('   - Check backend logs for errors');
  } else {
    log('   - All API endpoints are working correctly!');
    log('   - Ready for production deployment');
  }

  return { passed, failed, total, results };
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests()
    .then(({ passed, failed, total }) => {
      process.exit(failed > 0 ? 1 : 0);
    })
    .catch(error => {
      log(`❌ Test execution failed: ${error.message}`, 'red');
      process.exit(1);
    });
}

module.exports = { runAllTests, testEndpoint };
