const MockSeratoDataGenerator = require('./backend/src/services/serato/MockSeratoDataGenerator');
const SeratoFileVerificationService = require('./backend/src/services/serato/SeratoFileVerificationService');

async function test100PercentScore() {
  console.log('🎯 Testing 100% Serato Verification Score\n');

  try {
    // 1. Generate perfect Serato data
    console.log('1️⃣ Generating perfect Serato data for 100% score...');
    const perfectData = await MockSeratoDataGenerator.generatePerfectSeratoData();
    
    if (!perfectData.success) {
      console.log('❌ Failed to generate perfect data');
      return;
    }

    console.log(`✅ Perfect data created at: ${perfectData.path}`);

    // 2. Temporarily modify the verification service to use perfect data path
    const originalPaths = SeratoFileVerificationService.seratoPaths;
    SeratoFileVerificationService.seratoPaths = [perfectData.path];

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

    // 4. Test verification for 100% score
    console.log('3️⃣ Testing verification for 100% score...');
    const verification = await SeratoFileVerificationService.verifySeratoSkills();
    
    if (verification.success) {
      console.log('✅ Verification successful!');
      console.log(`   Skill Level: ${verification.skillLevel}`);
      console.log(`   Score: ${verification.score}/100`);
      console.log(`   Message: ${verification.message}`);
      
      // Show detailed score breakdown
      console.log('\n   📈 Perfect Score Breakdown:');
      verification.factors.forEach(factor => {
        console.log(`      • ${factor}`);
      });

      // Show perfect database stats
      console.log('\n   📊 Perfect Database Stats:');
      console.log(`      • Library: ${verification.database.library.tracks.toLocaleString()} tracks`);
      console.log(`      • Sessions: ${verification.database.history.sessions} sessions`);
      console.log(`      • Crates: ${verification.database.crates.count} crates`);
      console.log(`      • Analyzed: ${verification.database.analysis.analyzedTracks.toLocaleString()} tracks`);

      // Check if we achieved 100%
      if (verification.score === 100) {
        console.log('\n🎉 SUCCESS: Achieved 100% score!');
        console.log('🏆 You are now an EXPERT level DJ!');
      } else {
        console.log(`\n⚠️  Close but not quite 100%: ${verification.score}/100`);
        console.log('🔧 Let me adjust the data for perfect score...');
        
        // Try with even higher numbers
        const ultraPerfectData = {
          library: { tracks: 3000, size: 102400000 },
          history: { sessions: 300, totalTime: 36000 },
          crates: { count: 120, names: perfectData.data.crates.names },
          analysis: { analyzedTracks: 1000 }
        };
        
        // Update the mock data
        await MockSeratoDataGenerator.cleanupMockData();
        await MockSeratoDataGenerator.generatePerfectSeratoData();
        
        const retryVerification = await SeratoFileVerificationService.verifySeratoSkills();
        console.log(`\n🔄 Retry Score: ${retryVerification.score}/100`);
      }

    } else {
      console.log('❌ Verification failed');
      console.log(`   Error: ${verification.error}`);
      console.log(`   Message: ${verification.message}`);
    }

    // 5. Clean up
    console.log('\n4️⃣ Cleaning up perfect data...');
    await MockSeratoDataGenerator.cleanupMockData();

    // 6. Restore original paths
    SeratoFileVerificationService.seratoPaths = originalPaths;

    console.log('\n🎯 Perfect Score Test Complete!');
    console.log('\n📝 How to Achieve 100% Score:');
    console.log('• Library: 2,500+ tracks (25 points)');
    console.log('• Sessions: 250+ sessions (25 points)');
    console.log('• Crates: 100+ organized crates (20 points)');
    console.log('• Analysis: 750+ analyzed tracks (15 points)');
    console.log('• Recency: Active within 7 days (15 points)');
    console.log('\n🏆 Total: 100/100 = EXPERT DJ!');

  } catch (error) {
    console.error('❌ Error testing 100% score:', error);
  }
}

// Run the 100% score test
test100PercentScore().catch(console.error);
