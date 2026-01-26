// scripts/verify-solar-return.ts
// Script to verify Solar Return is calculated correctly

import connectDB from '@/lib/db';
import Chart from '@/models/Chart';
import BirthData from '@/models/BirthData';

async function verifySolarReturn() {
  try {
    await connectDB();
    
    console.log('🔍 VERIFYING SOLAR RETURN CALCULATION\n');
    
    // Get test user data (Vero)
    const userId = "1XJWLBXo6XOxeMMkkFTqlP2Bc7y1";
    
    // 1. Get birth data
    const birthData = await BirthData.findOne({ userId });
    if (!birthData) {
      throw new Error('Birth data not found');
    }
    
    console.log('📋 Birth Data:');
    console.log(`   Name: ${birthData.fullName}`);
    console.log(`   Birth Date: ${birthData.birthDate}`);
    console.log(`   Birth Place: ${birthData.birthPlace}`);
    console.log(`   Current Place: ${birthData.currentPlace}`);
    console.log(`   Lives in same place: ${birthData.livesInSamePlace}\n`);
    
    // 2. Get chart data
    const chart = await Chart.findOne({ userId });
    if (!chart) {
      throw new Error('Chart not found');
    }
    
    // 3. Verify Natal Chart
    const natalSun = chart.natalChart?.planets?.find(
      (p: any) => p.name === 'Sun' || p.name === 'Sol'
    );
    
    if (!natalSun) {
      throw new Error('Natal Sun not found');
    }
    
    console.log('☀️ NATAL SUN:');
    console.log(`   Sign: ${natalSun.sign}`);
    console.log(`   Degree: ${natalSun.degree}°`);
    console.log(`   House: ${natalSun.house || natalSun.houseNumber || '?'}\n`);
    
    // 4. Verify Solar Return (if exists)
    if (!chart.solarReturnChart) {
      console.log('⚠️  NO SOLAR RETURN FOUND IN DATABASE');
      console.log('   Need to generate Solar Return first');
      console.log('   Run: POST /api/charts/progressed?userId=' + userId);
      return;
    }
    
    const solarSun = chart.solarReturnChart?.planets?.find(
      (p: any) => p.name === 'Sun' || p.name === 'Sol'
    );
    
    if (!solarSun) {
      throw new Error('Solar Return Sun not found');
    }
    
    console.log('🌅 SOLAR RETURN SUN:');
    console.log(`   Sign: ${solarSun.sign}`);
    console.log(`   Degree: ${solarSun.degree}°`);
    console.log(`   House: ${solarSun.house || solarSun.houseNumber || '?'}`);
    console.log(`   Year: ${chart.solarReturnChart?.solarReturnInfo?.year || '?'}\n`);
    
    // 5. VERIFICATION CHECKS
    console.log('✅ VERIFICATION CHECKS:\n');
    
    // Check 1: Sun degree match
    const degreeDiff = Math.abs(natalSun.degree - solarSun.degree);
    const sunMatch = degreeDiff < 0.5;
    
    console.log(`   1. Sun Position Match: ${sunMatch ? '✅' : '❌'}`);
    console.log(`      Natal: ${natalSun.degree}° ${natalSun.sign}`);
    console.log(`      Solar: ${solarSun.degree}° ${solarSun.sign}`);
    console.log(`      Difference: ${degreeDiff.toFixed(3)}° ${degreeDiff < 0.5 ? '(GOOD)' : '(BAD - should be <0.5°)'}\n`);
    
    // Check 2: Location used
    const locationUsed = chart.solarReturnChart?.location || 'Unknown';
    const correctLocation = birthData.livesInSamePlace
      ? birthData.birthPlace
      : birthData.currentPlace;

    console.log(`   2. Location Check:`);
    console.log(`      Should use: ${correctLocation || 'N/A'}`);
    console.log(`      Actually used: ${locationUsed}`);

    if (correctLocation) {
      const locationMatch = locationUsed.includes(correctLocation.split(',')[0]);
      console.log(`      Match: ${locationMatch ? '✅' : '❌'}\n`);
    } else {
      console.log(`      Match: ⚠️  (No location data)\n`);
    }
    
    // Check 3: Ascendant changed
    const natalAsc = chart.natalChart?.ascendant?.sign;
    const solarAsc = chart.solarReturnChart?.ascendant?.sign;
    
    console.log(`   3. Ascendant Change:`);
    console.log(`      Natal: ${natalAsc}`);
    console.log(`      Solar Return: ${solarAsc}`);
    console.log(`      Changed: ${natalAsc !== solarAsc ? '✅' : '⚠️  (Can be same, but usually changes)'}\n`);
    
    // Check 4: Year
    const currentYear = new Date().getFullYear();
    const solarYear = chart.solarReturnChart?.solarReturnInfo?.year;
    
    console.log(`   4. Year Check:`);
    console.log(`      Current Year: ${currentYear}`);
    console.log(`      Solar Return Year: ${solarYear}`);
    console.log(`      Correct: ${solarYear >= currentYear ? '✅' : '❌'}\n`);
    
    // SUMMARY
    console.log('📊 SUMMARY:\n');
    if (sunMatch && solarYear >= currentYear) {
      console.log('✅ Solar Return appears CORRECT');
      console.log('✅ Ready to generate interpretations\n');
      return true;
    } else {
      console.log('❌ Solar Return has ISSUES');
      console.log('❌ Need to regenerate before proceeding\n');
      console.log('🔧 To regenerate:');
      console.log(`   POST /api/charts/progressed`);
      console.log(`   Body: { "userId": "${userId}", "force": true }`);
      return false;
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error);
    return false;
  }
}

// Run verification
verifySolarReturn().then(success => {
  process.exit(success ? 0 : 1);
});