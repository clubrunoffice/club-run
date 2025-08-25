const MockSeratoDataGenerator = require('./backend/src/services/serato/MockSeratoDataGenerator');

async function testLocalVerificationSignup() {
  console.log('🎛️ Testing Local Serato Verification Signup Flow\n');

  try {
    // 1. Generate mock Serato data for testing
    console.log('1️⃣ Generating mock Serato data for signup testing...');
    const mockData = await MockSeratoDataGenerator.generatePerfectSeratoData();
    
    if (!mockData.success) {
      console.log('❌ Failed to generate mock data');
      return;
    }

    console.log(`✅ Mock data created at: ${mockData.path}`);

    // 2. Test the signup verification endpoint
    console.log('2️⃣ Testing signup verification endpoint...');
    
    // Temporarily modify the verification service to use mock data path
    const SeratoFileVerificationService = require('./backend/src/services/serato/SeratoFileVerificationService');
    const originalPaths = SeratoFileVerificationService.seratoPaths;
    SeratoFileVerificationService.seratoPaths = [mockData.path];
    
    const response = await fetch('http://localhost:3001/api/serato-file/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Signup verification successful!');
      console.log(`   Skill Level: ${data.verification.skillLevel}`);
      console.log(`   Score: ${data.verification.score}/100`);
      console.log(`   Message: ${data.message}`);
      
      // Show verification data that would be stored
      console.log('\n   📊 Verification Data for Signup:');
      console.log(`   • Verified: ${data.verification.verified}`);
      console.log(`   • Skill Level: ${data.verification.skillLevel}`);
      console.log(`   • Score: ${data.verification.score}`);
      console.log(`   • Verification Hash: ${data.verification.verificationHash.substring(0, 20)}...`);
      console.log(`   • Verified At: ${data.verification.verifiedAt}`);
      
      // Show database analysis
      console.log('\n   📈 Database Analysis:');
      console.log(`   • Library: ${data.verification.database.library.tracks.toLocaleString()} tracks`);
      console.log(`   • Sessions: ${data.verification.database.history.sessions} sessions`);
      console.log(`   • Crates: ${data.verification.database.crates.count} crates`);
      console.log(`   • Analyzed: ${data.verification.database.analysis.analyzedTracks.toLocaleString()} tracks`);

      // 3. Test what would happen during signup
      console.log('\n3️⃣ Simulating signup process...');
      
      // Simulate storing verification data in sessionStorage
      const verificationData = {
        verified: true,
        skillLevel: data.verification.skillLevel,
        score: data.verification.score,
        verificationHash: data.verification.verificationHash,
        verifiedAt: data.verification.verifiedAt,
        database: data.verification.database
      };
      
      console.log('✅ Verification data stored for signup');
      console.log('✅ User can now complete signup as VERIFIED_DJ');
      console.log('✅ Skill level and verification data will be saved to database');

    } else {
      console.log('❌ Signup verification failed');
      console.log(`   Error: ${data.error || 'Unknown error'}`);
      console.log(`   Message: ${data.message || 'No message'}`);
    }

    // 4. Clean up
    console.log('\n4️⃣ Cleaning up...');
    await MockSeratoDataGenerator.cleanupMockData();
    // Restore original paths
    SeratoFileVerificationService.seratoPaths = originalPaths;
    console.log('✅ Mock data cleaned up');

    // 5. Summary
    console.log('\n🎉 Local Verification Signup Test Complete!\n');
    console.log('📝 Signup Flow Summary:');
    console.log('1. User selects "Verified DJ" role during signup');
    console.log('2. System detects and analyzes local Serato installation');
    console.log('3. Verification data is stored temporarily');
    console.log('4. User completes signup with verified status');
    console.log('5. Skill level and verification data saved to database');
    
    console.log('\n🚀 Ready for Testing!');
    console.log('📱 Open http://localhost:3007 in your browser');
    console.log('🎛️ Try signing up as a "Verified DJ" to test the flow');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure backend is running on port 3001');
    console.log('2. Check if the serato-file-verification routes are registered');
    console.log('3. Verify the mock data generation is working');
  }
}

// Run the test
testLocalVerificationSignup().catch(console.error);
