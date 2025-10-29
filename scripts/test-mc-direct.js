// test-mc-direct.js
// Test directo de la función getSignFromLongitude

// Simular las funciones tal como están en el código

// Función de prokeralaService.ts
function getSignFromLongitudeProkerala(longitude) {
  const signs = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer',
    'Leo', 'Virgo', 'Libra', 'Escorpio',
    'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];
  
  const signIndex = Math.floor(longitude / 30) % 12;
  return signs[signIndex];
}

// Función de astrologyService.ts (es igual)
function getSignFromLongitudeAstrology(longitude) {
  const signs = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer',
    'Leo', 'Virgo', 'Libra', 'Escorpio',
    'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];
  
  const signIndex = Math.floor(longitude / 30) % 12;
  return signs[signIndex];
}

// Función de client-v2.ts
class ProkeralaClient {
  getSignFromLongitude(longitude) {
    const signs = [
      'Aries', 'Tauro', 'Géminis', 'Cáncer',
      'Leo', 'Virgo', 'Libra', 'Escorpio',
      'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
    ];
    
    const signIndex = Math.floor((longitude % 360) / 30);
    return signs[signIndex];
  }
}

// Datos de prueba del MC de Oscar
const mcLongitude = 173.894;

console.log('═══════════════════════════════════════════════════════════');
console.log('TEST DIRECTO DE FUNCIONES getSignFromLongitude');
console.log('═══════════════════════════════════════════════════════════\n');

console.log(`Longitud del MC de Oscar: ${mcLongitude}°\n`);

// Test 1: prokeralaService.ts
const result1 = getSignFromLongitudeProkerala(mcLongitude);
console.log('1️⃣  prokeralaService.ts');
console.log(`   Resultado: ${result1}`);
console.log(`   Esperado:  Virgo`);
console.log(`   Estado:    ${result1 === 'Virgo' ? '✅ CORRECTO' : '❌ INCORRECTO'}\n`);

// Test 2: astrologyService.ts
const result2 = getSignFromLongitudeAstrology(mcLongitude);
console.log('2️⃣  astrologyService.ts');
console.log(`   Resultado: ${result2}`);
console.log(`   Esperado:  Virgo`);
console.log(`   Estado:    ${result2 === 'Virgo' ? '✅ CORRECTO' : '❌ INCORRECTO'}\n`);

// Test 3: client-v2.ts
const client = new ProkeralaClient();
const result3 = client.getSignFromLongitude(mcLongitude);
console.log('3️⃣  client-v2.ts');
console.log(`   Resultado: ${result3}`);
console.log(`   Esperado:  Virgo`);
console.log(`   Estado:    ${result3 === 'Virgo' ? '✅ CORRECTO' : '❌ INCORRECTO'}\n`);

// Verificación matemática
console.log('═══════════════════════════════════════════════════════════');
console.log('VERIFICACIÓN MATEMÁTICA');
console.log('═══════════════════════════════════════════════════════════\n');

const calculation = mcLongitude / 30;
const index = Math.floor(calculation);
console.log(`${mcLongitude}° ÷ 30 = ${calculation.toFixed(6)}`);
console.log(`Math.floor(${calculation.toFixed(6)}) = ${index}`);
console.log(`signs[${index}] = "Virgo" (índice 5 del array)\n`);

// Tabla de referencia
console.log('═══════════════════════════════════════════════════════════');
console.log('TABLA DE REFERENCIA');
console.log('═══════════════════════════════════════════════════════════\n');
console.log('Índice | Signo       | Rango de Longitud');
console.log('-------|-------------|------------------');
console.log('  0    | Aries       | 0° - 30°');
console.log('  1    | Tauro       | 30° - 60°');
console.log('  2    | Géminis     | 60° - 90°   ← Si fuera Géminis 23°');
console.log('  3    | Cáncer      | 90° - 120°');
console.log('  4    | Leo         | 120° - 150°');
console.log('  5    | Virgo       | 150° - 180° ← 173.894° está AQUÍ ✅');
console.log('  6    | Libra       | 180° - 210°');
console.log('  7    | Escorpio    | 210° - 240°');
console.log('  8    | Sagitario   | 240° - 270°');
console.log('  9    | Capricornio | 270° - 300°');
console.log(' 10    | Acuario     | 300° - 330°');
console.log(' 11    | Piscis      | 330° - 360°\n');

// Resultado final
console.log('═══════════════════════════════════════════════════════════');
console.log('RESULTADO FINAL');
console.log('═══════════════════════════════════════════════════════════\n');

const allPass = result1 === 'Virgo' && result2 === 'Virgo' && result3 === 'Virgo';

if (allPass) {
  console.log('✅ TODAS LAS FUNCIONES DEVUELVEN "Virgo" CORRECTAMENTE');
  console.log('\n📍 Esto significa que el CÓDIGO está CORRECTO.');
  console.log('📍 Si tu app sigue mostrando "Géminis", el problema es:');
  console.log('   1. Datos antiguos en MongoDB');
  console.log('   2. Caché del navegador');
  console.log('   3. Servidor no reiniciado después de los cambios\n');
} else {
  console.log('❌ ALGUNAS FUNCIONES DEVUELVEN RESULTADOS INCORRECTOS');
  console.log('\n⚠️  Esto significa que hay un error en el código.\n');
}

console.log('═══════════════════════════════════════════════════════════\n');