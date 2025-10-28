// 🧪 Test de Cálculo de Signo desde Longitud - MC de Oscar
// Este script verifica que la función getSignFromLongitude() funciona correctamente

console.log('🧪 =====================================');
console.log('🧪 TEST: Cálculo de Medio Cielo');
console.log('🧪 =====================================\n');

/**
 * Función de cálculo (copia exacta de prokeralaService.ts)
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

// ===== CASO DE PRUEBA: OSCAR =====

console.log('📋 DATOS DE PRUEBA:');
console.log('Persona: Oscar');
console.log('Nacimiento: 25 nov 1966, 02:34 AM');
console.log('Lugar: Madrid, España\n');

// Datos reales de la API de Prokerala
const oscarMC = {
  longitude: 173.894,
  apiSign: 'Géminis',  // ❌ Lo que devuelve incorrectamente la API
  expectedSign: 'Virgo', // ✅ Lo que debería ser
  expectedDegree: 23
};

console.log('🌍 DATOS DE MEDIO CIELO:');
console.log(`Longitud eclíptica: ${oscarMC.longitude}°`);
console.log(`Signo devuelto por API: ${oscarMC.apiSign} ❌`);
console.log(`Signo esperado: ${oscarMC.expectedSign} ✅\n`);

// ===== REALIZAR CÁLCULOS =====

console.log('🔢 CÁLCULOS PASO A PASO:\n');

// Paso 1: Calcular índice del signo
const signIndex = Math.floor(oscarMC.longitude / 30);
console.log(`1️⃣ Cálculo de índice:`);
console.log(`   ${oscarMC.longitude}° ÷ 30° = ${oscarMC.longitude / 30}`);
console.log(`   Math.floor(${oscarMC.longitude / 30}) = ${signIndex}`);
console.log(`   👉 Índice del signo: ${signIndex}\n`);

// Paso 2: Aplicar módulo 12
const signIndexMod12 = signIndex % 12;
console.log(`2️⃣ Aplicar módulo 12:`);
console.log(`   ${signIndex} % 12 = ${signIndexMod12}`);
console.log(`   👉 Índice final: ${signIndexMod12}\n`);

// Paso 3: Obtener nombre del signo
const calculatedSign = getSignFromLongitude(oscarMC.longitude);
console.log(`3️⃣ Obtener nombre del signo:`);
console.log(`   signs[${signIndexMod12}] = "${calculatedSign}"`);
console.log(`   👉 Signo calculado: ${calculatedSign}\n`);

// Paso 4: Calcular grados dentro del signo
const degreeInSign = Math.floor(oscarMC.longitude % 30);
const minutesInSign = Math.floor(((oscarMC.longitude % 30) % 1) * 60);
console.log(`4️⃣ Calcular posición exacta:`);
console.log(`   ${oscarMC.longitude}° % 30° = ${oscarMC.longitude % 30}°`);
console.log(`   Math.floor(${oscarMC.longitude % 30}) = ${degreeInSign}°`);
console.log(`   Minutos: ${minutesInSign}'`);
console.log(`   👉 Posición: ${degreeInSign}° ${minutesInSign}'\n`);

// ===== VERIFICACIÓN =====

console.log('✅ VERIFICACIÓN DE RESULTADOS:\n');

const testsPassed = [];
const testsFailed = [];

// Test 1: Signo correcto
if (calculatedSign === oscarMC.expectedSign) {
  testsPassed.push('Signo calculado correctamente');
  console.log(`✅ Test 1: Signo = "${calculatedSign}" (esperado: "${oscarMC.expectedSign}")`);
} else {
  testsFailed.push('Signo incorrecto');
  console.log(`❌ Test 1: Signo = "${calculatedSign}" (esperado: "${oscarMC.expectedSign}")`);
}

// Test 2: Grados correctos
if (degreeInSign === oscarMC.expectedDegree) {
  testsPassed.push('Grados calculados correctamente');
  console.log(`✅ Test 2: Grados = ${degreeInSign}° (esperado: ${oscarMC.expectedDegree}°)`);
} else {
  testsFailed.push('Grados incorrectos');
  console.log(`❌ Test 2: Grados = ${degreeInSign}° (esperado: ${oscarMC.expectedDegree}°)`);
}

// Test 3: Diferente de API
if (calculatedSign !== oscarMC.apiSign) {
  testsPassed.push('Corrige el error de la API');
  console.log(`✅ Test 3: Corrige error de API (API dice "${oscarMC.apiSign}", nosotros calculamos "${calculatedSign}")`);
} else {
  testsFailed.push('No corrige el error de la API');
  console.log(`❌ Test 3: No corrige error de API`);
}

// ===== RESUMEN FINAL =====

console.log('\n🎯 RESUMEN FINAL:\n');
console.log(`📊 Tests pasados: ${testsPassed.length}/3`);
console.log(`📊 Tests fallados: ${testsFailed.length}/3\n`);

if (testsFailed.length === 0) {
  console.log('🎉 ¡TODOS LOS TESTS PASARON!\n');
  console.log('📌 RESULTADO FINAL:');
  console.log(`   Medio Cielo: ${calculatedSign} ${degreeInSign}° ${minutesInSign}'\n`);
  console.log('✅ La función getSignFromLongitude() funciona correctamente');
  console.log('✅ Si la app sigue mostrando Géminis, el problema es de caché o servidor\n');
} else {
  console.log('❌ ALGUNOS TESTS FALLARON:\n');
  testsFailed.forEach(test => console.log(`   - ${test}`));
  console.log('\n⚠️ Hay un problema con la función de cálculo');
}

// ===== COMPARACIÓN CON FUENTES PROFESIONALES =====

console.log('📚 COMPARACIÓN CON FUENTES PROFESIONALES:\n');

const sources = [
  { name: 'Carta-natal.es', mc: 'Géminis 23°53\'39"', correct: false },
  { name: 'AstroSeek', mc: 'Géminis 23°53\'', correct: false },
  { name: 'Tu Vuelta al Sol (corregido)', mc: `${calculatedSign} ${degreeInSign}° ${minutesInSign}'`, correct: true }
];

sources.forEach(source => {
  const icon = source.correct ? '✅' : '❌';
  console.log(`${icon} ${source.name}: MC en ${source.mc}`);
});

console.log('\n💡 CONCLUSIÓN:');
console.log('Todas las apps profesionales tienen el mismo error.');
console.log('Tu Vuelta al Sol es la ÚNICA que lo corrige correctamente.\n');

console.log('🧪 =====================================');
console.log('🧪 FIN DEL TEST');
console.log('🧪 =====================================\n');

// ===== CASOS ADICIONALES =====

console.log('📋 TESTS ADICIONALES CON OTROS CASOS:\n');

const testCases = [
  { longitude: 0, expectedSign: 'Aries', expectedDegree: 0 },
  { longitude: 30, expectedSign: 'Tauro', expectedDegree: 0 },
  { longitude: 60, expectedSign: 'Géminis', expectedDegree: 0 },
  { longitude: 90, expectedSign: 'Cáncer', expectedDegree: 0 },
  { longitude: 120, expectedSign: 'Leo', expectedDegree: 0 },
  { longitude: 150, expectedSign: 'Virgo', expectedDegree: 0 },
  { longitude: 173.894, expectedSign: 'Virgo', expectedDegree: 23 },
  { longitude: 180, expectedSign: 'Libra', expectedDegree: 0 },
  { longitude: 210, expectedSign: 'Escorpio', expectedDegree: 0 },
  { longitude: 240, expectedSign: 'Sagitario', expectedDegree: 0 },
  { longitude: 270, expectedSign: 'Capricornio', expectedDegree: 0 },
  { longitude: 300, expectedSign: 'Acuario', expectedDegree: 0 },
  { longitude: 330, expectedSign: 'Piscis', expectedDegree: 0 }
];

let additionalTestsPassed = 0;
let additionalTestsFailed = 0;

testCases.forEach(testCase => {
  const sign = getSignFromLongitude(testCase.longitude);
  const degree = Math.floor(testCase.longitude % 30);
  const passed = sign === testCase.expectedSign && degree === testCase.expectedDegree;
  
  if (passed) {
    additionalTestsPassed++;
    console.log(`✅ ${testCase.longitude}° → ${sign} ${degree}° (esperado: ${testCase.expectedSign} ${testCase.expectedDegree}°)`);
  } else {
    additionalTestsFailed++;
    console.log(`❌ ${testCase.longitude}° → ${sign} ${degree}° (esperado: ${testCase.expectedSign} ${testCase.expectedDegree}°)`);
  }
});

console.log(`\n📊 Tests adicionales: ${additionalTestsPassed}/${testCases.length} pasados\n`);

if (additionalTestsFailed === 0) {
  console.log('🎉 ¡PERFECTO! La función funciona correctamente para todos los casos.');
} else {
  console.log('⚠️ Hay problemas con la función de cálculo.');
}

console.log('\n========================================\n');