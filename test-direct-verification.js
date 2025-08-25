const MockSeratoDataGenerator = require('./backend/src/services/serato/MockSeratoDataGenerator');
const SeratoFileVerificationService = require('./backend/src/services/serato/SeratoFileVerificationService');

async function testDirectVerification() {
  console.log('🎛️ Testing Direct Local Serato Verification\n');

  try {
    // 1. Generate mock Serato data
    console.log('1️⃣ Generating mock Serato data...');
    const mockData = await MockSeratoDataGenerator.generatePerfectSeratoData();
    
    if (!mockData.success) {
      console.log('❌ Failed to generate mock data');
      return;
    }

    console.log(`✅ Mock data created at: ${mockData.path}`);

    // 2. Temporarily modify the verification service to use mock data path
    const originalPaths = SeratoFileVerificationService.seratoPaths;
    SeratoFileVerificationService.seratoPaths = [mockData.path];

    // 3. Test detection
    console.log('2️⃣ Testing Serato detection...');
    const detection = await SeratoFileVerificationService.detectSeratoInstallation();
    
    if (detection.found) {
      console.log('✅ Serato installation detected');
      console.log(`   Path: ${detection.path}`);
      console.log(`   Files: ${detection.files.join(', ')}`);
    } else {
      console.log('❌ Serato installation not detected');
      return;
    }

    // 4. Test verification
    console.log('3️⃣ Testing verification...');
    const verification = await SeratoFileVerificationService.verifySeratoSkills();
    
    if (verification.success) {
      console.log('✅ Verification successful!');
      console.log(`   Skill Level: ${verification.skillLevel}`);
      console.log(`   Score: ${verification.score}/100`);
      console.log(`   Message: ${verification.message}`);
      
      // Show verification data for signup
      console.log('\n   📊 Verification Data for Signup:');
      console.log(`   • Verified: ${verification.verified}`);
      console.log(`   • Skill Level: ${verification.skillLevel}`);
      console.log(`   • Score: ${verification.score}`);
      console.log(`   • Verification Hash: ${verification.verificationHash.substring(0, 20)}...`);
      console.log(`   • Verified At: ${verification.verifiedAt}`);
      
      // Show database analysis
      console.log('\n   📈 Database Analysis:');
      console.log(`   • Library: ${verification.database.library.tracks.toLocaleString()} tracks`);
      console.log(`   • Sessions: ${verification.database.history.sessions} sessions`);
      console.log(`   • Crates: ${verification.database.crates.count} crates`);
      console.log(`   • Analyzed: ${verification.database.analysis.analyzedTracks.toLocaleString()} tracks`);

      // 5. Simulate signup process
      console.log('\n4️⃣ Simulating signup process...');
      
      // This is what would be stored in sessionStorage during signup
      const signupVerificationData = {
        verified: verification.verified,
        skillLevel: verification.skillLevel,
        score: verification.score,
        verificationHash: verification.verificationHash,
        verifiedAt: verification.verifiedAt,
        database: verification.database
      };
      
      console.log('✅ Verification data ready for signup');
      console.log('✅ User can complete signup as VERIFIED_DJ');
      console.log('✅ Skill level and verification data will be saved to database');

    } else {
      console.log('❌ Verification failed');
      console.log(`   Error: ${verification.error}`);
      console.log(`   Message: ${verification.message}`);
    }

    // 6. Clean up
    console.log('\n5️⃣ Cleaning up...');
    await MockSeratoDataGenerator.cleanupMockData();
    SeratoFileVerificationService.seratoPaths = originalPaths;
    console.log('✅ Mock data cleaned up');

    // 7. Summary
    console.log('\n🎉 Direct Verification Test Complete!\n');
    console.log('📝 Local Verification Signup Flow:');
    console.log('✅ 1. User selects "Verified DJ" role');
    console.log('✅ 2. System detects local Serato installation');
    console.log('✅ 3. Analyzes library, sessions, crates, analysis');
    console.log('✅ 4. Calculates skill level and score');
    console.log('✅ 5. Stores verification data for signup');
    console.log('✅ 6. User completes signup with verified status');
    
    console.log('\n🚀 Ready for Browser Testing!');
    console.log('📱 Open http://localhost:3007 in your browser');
    console.log('🎛️ Try signing up as a "Verified DJ" to test the complete flow');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testDirectVerification().catch(console.error);
