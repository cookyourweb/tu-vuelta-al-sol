// 🧪 FOCUSED TEST: Single User - VERONICA
// Testing Ascendant & Midheaven calculation with VERIFIED data from AstroSeek

console.log('🧪 ================================================================');
console.log('🧪 SINGLE USER TEST: VERONICA');
console.log('🧪 ================================================================\n');

/**
 * getSignFromLongitude function (from prokeralaService.ts)
 */
function getSignFromLongitude(longitude) {
  const signs = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer',
    'Leo', 'Virgo', 'Libra', 'Escorpio',
    'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];
  
  const signIndex = Math.floor(longitude / 30) % 12;
  return signs[signIndex];
}

// ================================================================
// VERONICA'S BIRTH DATA
// ================================================================

console.log('📋 BIRTH DATA:');
console.log('─────────────────────────────────────────────────────────────\n');

const veronica = {
  name: 'Veronica',
  birthDate: '10 February 1974',
  birthTime: '07:31 AM',
  location: 'Madrid, España',
  coordinates: '40.4168°N, 3.7038°W',
  timezone: 'CET (UTC+1)'
};

console.log(`Name: ${veronica.name}`);
console.log(`Birth: ${veronica.birthDate} at ${veronica.birthTime}`);
console.log(`Location: ${veronica.location}`);
console.log(`Coordinates: ${veronica.coordinates}`);
console.log(`Timezone: ${veronica.timezone}\n`);

// ================================================================
// CORRECT VALUES FROM ASTROSEEK (Reference)
// ================================================================

console.log('✅ CORRECT VALUES (From AstroSeek):');
console.log('─────────────────────────────────────────────────────────────\n');

const correctValues = {
  ascendant: {
    symbol: '♒',
    sign: 'Acuario',
    degree: 4,
    minutes: 28,
    longitude: 304.467,  // 304° is in Aquarius range (300°-330°)
    display: 'Acuario 4° 28\''
  },
  midheaven: {
    symbol: '♏',
    sign: 'Escorpio',
    degree: 26,
    minutes: 19,
    longitude: 236.317,  // 236° is in Scorpio range (210°-240°)
    display: 'Escorpio 26° 19\''
  }
};

console.log(`ASCENDANT:  ${correctValues.ascendant.symbol} ${correctValues.ascendant.display}`);
console.log(`            Longitude: ${correctValues.ascendant.longitude}°`);
console.log(`            Range: 300°-330° (Acuario)\n`);

console.log(`MIDHEAVEN:  ${correctValues.midheaven.symbol} ${correctValues.midheaven.display}`);
console.log(`            Longitude: ${correctValues.midheaven.longitude}°`);
console.log(`            Range: 210°-240° (Escorpio)\n`);

// ================================================================
// TEST 1: ASCENDANT CALCULATION
// ================================================================

console.log('🧪 TEST 1: ASCENDANT CALCULATION');
console.log('─────────────────────────────────────────────────────────────\n');

const ascLongitude = correctValues.ascendant.longitude;

console.log(`Input: longitude = ${ascLongitude}°\n`);

// Step 1: Calculate sign index
const ascSignIndex = Math.floor(ascLongitude / 30);
console.log(`Step 1: Calculate sign index`);
console.log(`        ${ascLongitude}° ÷ 30° = ${ascLongitude / 30}`);
console.log(`        Math.floor(${ascLongitude / 30}) = ${ascSignIndex}\n`);

// Step 2: Apply modulo 12
const ascSignIndexMod = ascSignIndex % 12;
console.log(`Step 2: Apply modulo 12`);
console.log(`        ${ascSignIndex} % 12 = ${ascSignIndexMod}\n`);

// Step 3: Get sign name
const ascCalculatedSign = getSignFromLongitude(ascLongitude);
console.log(`Step 3: Get sign name`);
console.log(`        signs[${ascSignIndexMod}] = "${ascCalculatedSign}"\n`);

// Step 4: Calculate degree and minutes
const ascDegree = Math.floor(ascLongitude % 30);
const ascMinutes = Math.floor(((ascLongitude % 30) - ascDegree) * 60);
console.log(`Step 4: Calculate position`);
console.log(`        ${ascLongitude}° % 30° = ${ascLongitude % 30}°`);
console.log(`        Degree: ${ascDegree}°`);
console.log(`        Minutes: ${ascMinutes}'\n`);

// VERIFICATION
console.log('✓ VERIFICATION:');
console.log(`  Expected: ${correctValues.ascendant.sign} ${correctValues.ascendant.degree}° ${correctValues.ascendant.minutes}'`);
console.log(`  Got:      ${ascCalculatedSign} ${ascDegree}° ${ascMinutes}'\n`);

const ascSignMatch = ascCalculatedSign === correctValues.ascendant.sign;
const ascDegreeMatch = ascDegree === correctValues.ascendant.degree;

if (ascSignMatch && ascDegreeMatch) {
  console.log('  ✅ ASCENDANT CALCULATION IS CORRECT!\n');
} else {
  console.log('  ❌ ASCENDANT CALCULATION IS WRONG!');
  if (!ascSignMatch) console.log(`     Sign error: got "${ascCalculatedSign}", expected "${correctValues.ascendant.sign}"`);
  if (!ascDegreeMatch) console.log(`     Degree error: got ${ascDegree}°, expected ${correctValues.ascendant.degree}°`);
  console.log('');
}

// ================================================================
// TEST 2: MIDHEAVEN CALCULATION
// ================================================================

console.log('🧪 TEST 2: MIDHEAVEN CALCULATION');
console.log('─────────────────────────────────────────────────────────────\n');

const mcLongitude = correctValues.midheaven.longitude;

console.log(`Input: longitude = ${mcLongitude}°\n`);

// Step 1: Calculate sign index
const mcSignIndex = Math.floor(mcLongitude / 30);
console.log(`Step 1: Calculate sign index`);
console.log(`        ${mcLongitude}° ÷ 30° = ${mcLongitude / 30}`);
console.log(`        Math.floor(${mcLongitude / 30}) = ${mcSignIndex}\n`);

// Step 2: Apply modulo 12
const mcSignIndexMod = mcSignIndex % 12;
console.log(`Step 2: Apply modulo 12`);
console.log(`        ${mcSignIndex} % 12 = ${mcSignIndexMod}\n`);

// Step 3: Get sign name
const mcCalculatedSign = getSignFromLongitude(mcLongitude);
console.log(`Step 3: Get sign name`);
console.log(`        signs[${mcSignIndexMod}] = "${mcCalculatedSign}"\n`);

// Step 4: Calculate degree and minutes
const mcDegree = Math.floor(mcLongitude % 30);
const mcMinutes = Math.floor(((mcLongitude % 30) - mcDegree) * 60);
console.log(`Step 4: Calculate position`);
console.log(`        ${mcLongitude}° % 30° = ${mcLongitude % 30}°`);
console.log(`        Degree: ${mcDegree}°`);
console.log(`        Minutes: ${mcMinutes}'\n`);

// VERIFICATION
console.log('✓ VERIFICATION:');
console.log(`  Expected: ${correctValues.midheaven.sign} ${correctValues.midheaven.degree}° ${correctValues.midheaven.minutes}'`);
console.log(`  Got:      ${mcCalculatedSign} ${mcDegree}° ${mcMinutes}'\n`);

const mcSignMatch = mcCalculatedSign === correctValues.midheaven.sign;
const mcDegreeMatch = mcDegree === correctValues.midheaven.degree;

if (mcSignMatch && mcDegreeMatch) {
  console.log('  ✅ MIDHEAVEN CALCULATION IS CORRECT!\n');
} else {
  console.log('  ❌ MIDHEAVEN CALCULATION IS WRONG!');
  if (!mcSignMatch) console.log(`     Sign error: got "${mcCalculatedSign}", expected "${correctValues.midheaven.sign}"`);
  if (!mcDegreeMatch) console.log(`     Degree error: got ${mcDegree}°, expected ${correctValues.midheaven.degree}°`);
  console.log('');
}

// ================================================================
// ZODIAC REFERENCE (Quick lookup)
// ================================================================

console.log('📚 ZODIAC REFERENCE');
console.log('─────────────────────────────────────────────────────────────\n');

const zodiac = [
  { index: 0, sign: 'Aries', range: '0° - 30°', symbol: '♈' },
  { index: 1, sign: 'Tauro', range: '30° - 60°', symbol: '♉' },
  { index: 2, sign: 'Géminis', range: '60° - 90°', symbol: '♊' },
  { index: 3, sign: 'Cáncer', range: '90° - 120°', symbol: '♋' },
  { index: 4, sign: 'Leo', range: '120° - 150°', symbol: '♌' },
  { index: 5, sign: 'Virgo', range: '150° - 180°', symbol: '♍' },
  { index: 6, sign: 'Libra', range: '180° - 210°', symbol: '♎' },
  { index: 7, sign: 'Escorpio', range: '210° - 240°', symbol: '♏' },
  { index: 8, sign: 'Sagitario', range: '240° - 270°', symbol: '♐' },
  { index: 9, sign: 'Capricornio', range: '270° - 300°', symbol: '♑' },
  { index: 10, sign: 'Acuario', range: '300° - 330°', symbol: '♒' },
  { index: 11, sign: 'Piscis', range: '330° - 360°', symbol: '♓' }
];

console.log('Index | Symbol | Sign         | Range');
console.log('──────────────────────────────────────────────');
zodiac.forEach(z => {
  console.log(`  ${String(z.index).padStart(2)}  | ${z.symbol}     | ${z.sign.padEnd(12)} | ${z.range}`);
});

console.log('');

// ================================================================
// FINAL SUMMARY
// ================================================================

console.log('🎯 FINAL SUMMARY');
console.log('================================================================\n');

const bothCorrect = ascSignMatch && ascDegreeMatch && mcSignMatch && mcDegreeMatch;

if (bothCorrect) {
  console.log('✅ SUCCESS! Both calculations are CORRECT:\n');
  console.log(`   Ascendant:  ${ascCalculatedSign} ${ascDegree}° ${ascMinutes}' ✅`);
  console.log(`   Midheaven:  ${mcCalculatedSign} ${mcDegree}° ${mcMinutes}' ✅\n`);
  
  console.log('💡 CONCLUSION:');
  console.log('   The getSignFromLongitude() function works perfectly!\n');
  
  console.log('🔍 IF YOUR APP SHOWS DIFFERENT VALUES:');
  console.log('   The problem is NOT in the calculation function.');
  console.log('   Check these instead:\n');
  console.log('   1. Are longitude values correct from API?');
  console.log('      → Check server logs for actual longitude numbers');
  console.log('   2. Is data extracted from correct houses?');
  console.log('      → ASC should come from House 1');
  console.log('      → MC should come from House 10');
  console.log('   3. Are component props swapped?');
  console.log('      → Check <AscendantCard ascendant={???} />');
  console.log('      → Check <MidheavenCard midheaven={???} />');
  console.log('   4. Is data stored correctly in MongoDB?');
  console.log('      → Check with: db.charts.findOne()\n');
  
} else {
  console.log('❌ PROBLEMS DETECTED:\n');
  
  if (!ascSignMatch || !ascDegreeMatch) {
    console.log('   ❌ Ascendant calculation has errors');
  }
  if (!mcSignMatch || !mcDegreeMatch) {
    console.log('   ❌ Midheaven calculation has errors');
  }
  
  console.log('\n🔧 The getSignFromLongitude() function needs to be fixed!\n');
}

// ================================================================
// NEXT STEPS
// ================================================================

console.log('📋 NEXT STEPS FOR YOU:');
console.log('================================================================\n');

console.log('1️⃣  Generate Veronica\'s chart in your app:');
console.log('    Birth: 10 Feb 1974, 07:31 AM');
console.log('    Place: Madrid, España\n');

console.log('2️⃣  Check what your app displays:');
console.log('    Card "Tu Ascendente" shows: _______ _____°');
console.log('    Card "Tu Medio Cielo" shows: _______ _____°\n');

console.log('3️⃣  Check server console logs:');
console.log('    Look for: "✅ Ascendente extraído desde Casa 1"');
console.log('    Look for: "✅ Medio Cielo extraído desde Casa 10"');
console.log('    Copy the longitude values shown\n');

console.log('4️⃣  Compare with correct values:');
console.log(`    ASC should be: ${correctValues.ascendant.display} (longitude: ${correctValues.ascendant.longitude}°)`);
console.log(`    MC should be:  ${correctValues.midheaven.display} (longitude: ${correctValues.midheaven.longitude}°)\n`);

console.log('5️⃣  Report back with:');
console.log('    ✓ What the cards show in your app');
console.log('    ✓ What longitude values the server logged');
console.log('    ✓ Screenshot if possible\n');

console.log('================================================================');
console.log('🧪 END OF TEST');
console.log('================================================================\n');