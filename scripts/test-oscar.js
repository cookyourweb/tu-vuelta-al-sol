// 🧪 DIRECT PROKERALA API TEST FOR OSCAR
// This will show us EXACTLY what Prokerala returns

const axios = require('axios');

// ================================================================
// OSCAR'S DATA
// ================================================================

const oscar = {
  name: 'Oscar',
  date: '1966-11-25',
  time: '02:34:00',
  timezone: '+01:00', // CET
  latitude: 40.4168,
  longitude: -3.7038,
  location: 'Madrid, Spain'
};

console.log('🧪 ================================================================');
console.log('🧪 DIRECT PROKERALA API TEST FOR OSCAR');
console.log('🧪 ================================================================\n');

console.log('📋 BIRTH DATA:');
console.log(`   Name: ${oscar.name}`);
console.log(`   Date: ${oscar.date}`);
console.log(`   Time: ${oscar.time}`);
console.log(`   Timezone: ${oscar.timezone}`);
console.log(`   Location: ${oscar.location}`);
console.log(`   Coordinates: ${oscar.latitude}°N, ${oscar.longitude}°W\n`);

// ================================================================
// PROKERALA API CREDENTIALS
// ================================================================

const PROKERALA_CLIENT_ID = process.env.PROKERALA_CLIENT_ID;
const PROKERALA_CLIENT_SECRET = process.env.PROKERALA_CLIENT_SECRET;

if (!PROKERALA_CLIENT_ID || !PROKERALA_CLIENT_SECRET) {
  console.error('❌ ERROR: Prokerala credentials not found!');
  console.error('   Please set environment variables:');
  console.error('   PROKERALA_CLIENT_ID');
  console.error('   PROKERALA_CLIENT_SECRET\n');
  process.exit(1);
}

console.log('✅ Prokerala credentials found\n');

// ================================================================
// STEP 1: GET ACCESS TOKEN
// ================================================================

async function getToken() {
  console.log('🔑 STEP 1: Getting access token...\n');
  
  try {
    const response = await axios.post(
      'https://api.prokerala.com/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: PROKERALA_CLIENT_ID,
        client_secret: PROKERALA_CLIENT_SECRET
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    console.log('   ✅ Token obtained successfully\n');
    return response.data.access_token;
    
  } catch (error) {
    console.error('   ❌ Error getting token:', error.response?.data || error.message);
    throw error;
  }
}

// ================================================================
// STEP 2: GET NATAL CHART
// ================================================================

async function getNatalChart(token) {
  console.log('📊 STEP 2: Requesting natal chart from Prokerala...\n');
  
  // Format datetime
  const datetime = `${oscar.date}T${oscar.time}${oscar.timezone}`;
  const coordinates = `${oscar.latitude},${oscar.longitude}`;
  
  console.log('   Request parameters:');
  console.log(`   • datetime: ${datetime}`);
  console.log(`   • coordinates: ${coordinates}`);
  console.log(`   • house_system: placidus`);
  console.log(`   • ayanamsa: 0 (Tropical)`);
  console.log('');
  
  const url = new URL('https://api.prokerala.com/v2/astrology/natal-chart');
  url.searchParams.append('profile[datetime]', datetime);
  url.searchParams.append('profile[coordinates]', coordinates);
  url.searchParams.append('birth_time_unknown', 'false');
  url.searchParams.append('house_system', 'placidus');
  url.searchParams.append('orb', 'default');
  url.searchParams.append('birth_time_rectification', 'flat-chart');
  url.searchParams.append('la', 'es');
  url.searchParams.append('ayanamsa', '0'); // 0 = Tropical (Western)
  
  console.log('   Full URL:');
  console.log(`   ${url.toString()}\n`);
  
  try {
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('   ✅ Chart data received!\n');
    return response.data;
    
  } catch (error) {
    console.error('   ❌ Error getting chart:', error.response?.data || error.message);
    throw error;
  }
}

// ================================================================
// STEP 3: ANALYZE THE DATA
// ================================================================

function analyzeChart(data) {
  console.log('🔍 ================================================================');
  console.log('🔍 ANALYZING RAW API RESPONSE');
  console.log('🔍 ================================================================\n');
  
  const apiData = data.data || data;
  
  // Show full structure
  console.log('📦 API Response Structure:');
  console.log(`   Keys available: ${Object.keys(apiData).join(', ')}\n`);
  
  // ================================================================
  // ASCENDANT
  // ================================================================
  
  console.log('📍 ASCENDANT (ASC):');
  console.log('─────────────────────────────────────────────────────────────\n');
  
  if (apiData.ascendant) {
    console.log('   Raw ascendant object:');
    console.log(JSON.stringify(apiData.ascendant, null, 2));
    console.log('');
    
    const ascLon = apiData.ascendant.longitude;
    const ascSign = apiData.ascendant.sign;
    const calculatedSign = getSignFromLongitude(ascLon);
    
    console.log('   Analysis:');
    console.log(`   • API says sign: "${ascSign}"`);
    console.log(`   • Longitude: ${ascLon}°`);
    console.log(`   • Calculated sign from longitude: "${calculatedSign}"`);
    console.log(`   • Degree: ${Math.floor(ascLon % 30)}°`);
    console.log(`   • Match: ${ascSign === calculatedSign ? '✅ YES' : '❌ NO'}\n`);
  } else {
    console.log('   ❌ No ascendant data found\n');
  }
  
  // ================================================================
  // MIDHEAVEN (MC)
  // ================================================================
  
  console.log('📍 MIDHEAVEN (MC):');
  console.log('─────────────────────────────────────────────────────────────\n');
  
  if (apiData.mc) {
    console.log('   Raw MC object:');
    console.log(JSON.stringify(apiData.mc, null, 2));
    console.log('');
    
    const mcLon = apiData.mc.longitude;
    const mcSign = apiData.mc.sign;
    const calculatedSign = getSignFromLongitude(mcLon);
    
    console.log('   Analysis:');
    console.log(`   • API says sign: "${mcSign}"`);
    console.log(`   • Longitude: ${mcLon}°`);
    console.log(`   • Calculated sign from longitude: "${calculatedSign}"`);
    console.log(`   • Degree: ${Math.floor(mcLon % 30)}°`);
    console.log(`   • Match: ${mcSign === calculatedSign ? '✅ YES' : '❌ NO'}\n`);
    
    // Show zodiac reference
    console.log('   📚 Zodiac reference:');
    const signs = [
      { name: 'Aries', start: 0, end: 30 },
      { name: 'Taurus', start: 30, end: 60 },
      { name: 'Gemini', start: 60, end: 90 },
      { name: 'Cancer', start: 90, end: 120 },
      { name: 'Leo', start: 120, end: 150 },
      { name: 'Virgo', start: 150, end: 180 },
      { name: 'Libra', start: 180, end: 210 },
      { name: 'Scorpio', start: 210, end: 240 },
      { name: 'Sagittarius', start: 240, end: 270 },
      { name: 'Capricorn', start: 270, end: 300 },
      { name: 'Aquarius', start: 300, end: 330 },
      { name: 'Pisces', start: 330, end: 360 }
    ];
    
    const mcSignData = signs.find(s => mcLon >= s.start && mcLon < s.end);
    console.log(`   • ${mcLon}° falls in: ${mcSignData?.name || 'Unknown'} (${mcSignData?.start}° - ${mcSignData?.end}°)\n`);
    
  } else {
    console.log('   ❌ No MC data found\n');
  }
  
  // ================================================================
  // HOUSES
  // ================================================================
  
  console.log('🏠 HOUSES:');
  console.log('─────────────────────────────────────────────────────────────\n');
  
  if (apiData.houses && Array.isArray(apiData.houses)) {
    console.log(`   Total houses: ${apiData.houses.length}\n`);
    
    // Show House 1 and House 10
    const house1 = apiData.houses.find(h => h.number === 1);
    const house10 = apiData.houses.find(h => h.number === 10);
    
    if (house1) {
      console.log('   House 1 (should match ASC):');
      console.log(`   • Sign: ${house1.sign}`);
      console.log(`   • Longitude: ${house1.longitude}°`);
      console.log(`   • Calculated sign: ${getSignFromLongitude(house1.longitude)}\n`);
    }
    
    if (house10) {
      console.log('   House 10 (should match MC):');
      console.log(`   • Sign: ${house10.sign}`);
      console.log(`   • Longitude: ${house10.longitude}°`);
      console.log(`   • Calculated sign: ${getSignFromLongitude(house10.longitude)}\n`);
    }
  } else {
    console.log('   ❌ No houses data found\n');
  }
  
  // ================================================================
  // SUMMARY
  // ================================================================
  
  console.log('🎯 SUMMARY:');
  console.log('================================================================\n');
  
  if (apiData.mc) {
    const mcLon = apiData.mc.longitude;
    const mcSign = apiData.mc.sign;
    const calculatedSign = getSignFromLongitude(mcLon);
    
    if (mcSign !== calculatedSign) {
      console.log('❌ PROBLEM FOUND!');
      console.log(`   API returns sign: "${mcSign}"`);
      console.log(`   But longitude ${mcLon}° means: "${calculatedSign}"`);
      console.log('');
      console.log('💡 SOLUTION:');
      console.log('   ALWAYS calculate sign from longitude, NEVER trust API sign string!');
      console.log('');
      console.log('   Change this line in prokeralaService.ts:');
      console.log('   ❌ sign: apiResponse.mc.sign || getSignFromLongitude(...)');
      console.log('   ✅ sign: getSignFromLongitude(apiResponse.mc.longitude)\n');
    } else {
      console.log('✅ NO PROBLEM!');
      console.log(`   API sign "${mcSign}" matches calculated sign from longitude ${mcLon}°\n`);
    }
  }
  
  console.log('================================================================\n');
}

// ================================================================
// HELPER FUNCTION
// ================================================================

function getSignFromLongitude(longitude) {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  const signIndex = Math.floor(longitude / 30) % 12;
  return signs[signIndex];
}

// ================================================================
// RUN THE TEST
// ================================================================

async function runTest() {
  try {
    const token = await getToken();
    const chartData = await getNatalChart(token);
    analyzeChart(chartData);
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    process.exit(1);
  }
}

// Run it!
runTest();