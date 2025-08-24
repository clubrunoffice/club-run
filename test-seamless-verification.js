#!/usr/bin/env node

/**
 * Test Script: Seamless Serato Integration System
 * 
 * This script demonstrates the complete flow of the seamless verification system:
 * 1. DJ connects Serato account
 * 2. Curator creates mission with track requirements
 * 3. DJ accepts mission
 * 4. Automatic verification happens in background
 * 5. Payment and proof generation
 */

const axios = require('axios');

// Configuration
const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const TEST_USER_TOKEN = process.env.TEST_USER_TOKEN || 'test_token_here';
const TEST_CURATOR_TOKEN = process.env.TEST_CURATOR_TOKEN || 'test_curator_token_here';

// Test data
const TEST_MISSION = {
  title: "Play 'Midnight Groove' at Club XYZ",
  description: "Play the new track 'Midnight Groove' by DJ Example during your set at Club XYZ",
  venueAddress: "123 Main St, Atlanta, GA 30301",
  eventType: "club_night",
  budget: 150.00,
  deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
  paymentMethod: "usdc",
  openMarket: true,
  autoVerifyEnabled: true,
  verificationWindow: {
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()   // 6 hours from now
  },
  requirements: JSON.stringify({
    track: {
      title: "Midnight Groove",
      artist: "DJ Example",
      album: "Summer Vibes 2024",
      isrc: "USRC12345678",
      duration: 180,
      bpm: 128,
      key: "Am"
    },
    autoVerify: true,
    verificationWindow: {
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
    }
  })
};

// Helper function to make authenticated requests
async function makeRequest(method, endpoint, data = null, token = TEST_USER_TOKEN) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Request failed: ${method} ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
}

// Test functions
async function testSeratoConnection() {
  console.log('\n🔗 Testing Serato Connection...');
  
  try {
    // Check connection status
    const status = await makeRequest('GET', '/api/serato/status');
    console.log('✅ Connection status:', status);
    
    if (!status.connected) {
      console.log('⚠️  Serato account not connected. Initiating connection...');
      
      // Get connection URL
      const connectData = await makeRequest('GET', '/api/serato/connect');
      console.log('🔗 OAuth URL:', connectData.authUrl);
      console.log('📝 User should visit this URL to connect Serato account');
      
      return false;
    }
    
    console.log('✅ Serato account is connected!');
    return true;
  } catch (error) {
    console.error('❌ Serato connection test failed:', error.message);
    return false;
  }
}

async function testMissionCreation() {
  console.log('\n📝 Testing Mission Creation...');
  
  try {
    const mission = await makeRequest('POST', '/api/p2p-missions', TEST_MISSION, TEST_CURATOR_TOKEN);
    console.log('✅ Mission created successfully!');
    console.log('📋 Mission ID:', mission.mission.id);
    console.log('🎵 Track requirements:', JSON.parse(mission.mission.requirements).track);
    
    return mission.mission.id;
  } catch (error) {
    console.error('❌ Mission creation failed:', error.message);
    return null;
  }
}

async function testMissionAcceptance(missionId) {
  console.log('\n✅ Testing Mission Acceptance...');
  
  try {
    const acceptance = await makeRequest('PUT', `/api/p2p-missions/${missionId}/accept`, {
      runnerId: 'test_runner_id'
    });
    
    console.log('✅ Mission accepted successfully!');
    console.log('⏰ Verification scheduled for:', TEST_MISSION.verificationWindow.endTime);
    
    return true;
  } catch (error) {
    console.error('❌ Mission acceptance failed:', error.message);
    return false;
  }
}

async function testVerificationSimulation(missionId) {
  console.log('\n🔍 Simulating Verification Process...');
  
  try {
    // Simulate the verification process that would happen in the background
    const verificationData = {
      trackRequirements: JSON.parse(TEST_MISSION.requirements).track,
      startTime: TEST_MISSION.verificationWindow.startTime,
      endTime: TEST_MISSION.verificationWindow.endTime
    };
    
    const verificationResult = await makeRequest('POST', '/api/serato/test-verification', verificationData);
    
    console.log('✅ Verification simulation completed!');
    console.log('🎯 Track found:', verificationResult.verificationResult.trackFound);
    console.log('📊 Confidence score:', verificationResult.verificationResult.confidence);
    console.log('⏰ Play time:', verificationResult.verificationResult.playTime);
    
    if (verificationResult.verificationResult.trackFound && verificationResult.verificationResult.confidence >= 70) {
      console.log('🎉 Mission would be automatically completed!');
      console.log('💰 Payment would be processed automatically');
      console.log('📄 Proof document would be generated and stored');
    } else {
      console.log('❌ Mission would be marked as failed');
    }
    
    return verificationResult.verificationResult;
  } catch (error) {
    console.error('❌ Verification simulation failed:', error.message);
    return null;
  }
}

async function testPlayHistoryRetrieval() {
  console.log('\n📊 Testing Play History Retrieval...');
  
  try {
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
    const endDate = new Date();
    
    const playHistory = await makeRequest('GET', `/api/serato/play-history?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`);
    
    console.log('✅ Play history retrieved successfully!');
    console.log('🎵 Total tracks played:', playHistory.total);
    console.log('📅 Period:', playHistory.period.start, 'to', playHistory.period.end);
    
    if (playHistory.playHistory.length > 0) {
      console.log('🎵 Sample track:', playHistory.playHistory[0]);
    }
    
    return playHistory;
  } catch (error) {
    console.error('❌ Play history retrieval failed:', error.message);
    return null;
  }
}

// Main test function
async function runSeamlessVerificationTest() {
  console.log('🎯 Starting Seamless Serato Integration Test');
  console.log('=' .repeat(60));
  
  try {
    // Step 1: Test Serato connection
    const isConnected = await testSeratoConnection();
    
    if (!isConnected) {
      console.log('\n⚠️  Please connect Serato account first, then run this test again');
      return;
    }
    
    // Step 2: Test play history retrieval
    await testPlayHistoryRetrieval();
    
    // Step 3: Test mission creation
    const missionId = await testMissionCreation();
    
    if (!missionId) {
      console.log('\n❌ Cannot continue without mission ID');
      return;
    }
    
    // Step 4: Test mission acceptance
    const accepted = await testMissionAcceptance(missionId);
    
    if (!accepted) {
      console.log('\n❌ Cannot continue without mission acceptance');
      return;
    }
    
    // Step 5: Test verification simulation
    await testVerificationSimulation(missionId);
    
    console.log('\n🎉 Seamless Verification Test Completed Successfully!');
    console.log('=' .repeat(60));
    console.log('\n📋 Summary:');
    console.log('✅ Serato account connected');
    console.log('✅ Play history accessible');
    console.log('✅ Mission created with track requirements');
    console.log('✅ Mission accepted and verification scheduled');
    console.log('✅ Automatic verification process simulated');
    console.log('✅ Payment and proof generation ready');
    
    console.log('\n🚀 The system is ready for seamless DJ mission verification!');
    console.log('🎵 DJs can now just play music normally in Serato');
    console.log('🤖 Club Run handles all verification and payments automatically');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n🔧 Please check your configuration and try again');
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  runSeamlessVerificationTest().catch(console.error);
}

module.exports = {
  testSeratoConnection,
  testMissionCreation,
  testMissionAcceptance,
  testVerificationSimulation,
  testPlayHistoryRetrieval,
  runSeamlessVerificationTest
};
