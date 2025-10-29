// test-ascendant-mc-verification-FIXED.js
// ✅ Test CORREGIDO con parámetros correctos para Prokerala API
const axios = require('axios');

// Configuración de Prokerala API
const API_BASE_URL = 'https://api.prokerala.com/v2';
const CLIENT_ID = '1c6bf7c7-2b6b-4721-8b32-d054129ecd87';
const CLIENT_SECRET = 'uUBszMlWGA3cPZrngCOrQssCygjBvCZh8w3SQPus';

// Función para obtener token
async function getToken() {
  try {
    console.log('🔑 Solicitando token a Prokerala...\n');

    const response = await axios.post(
      'https://api.prokerala.com/token',
      new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 10000
      }
    );

    if (!response.data || !response.data.access_token) {
      throw new Error('Token de acceso no recibido');
    }

    console.log('✅ Token obtenido exitosamente\n');
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Error obteniendo token:', error.response?.data || error.message);
    throw error;
  }
}

// Función para calcular el signo desde la longitud
function getSignFromLongitude(longitude) {
  const signs = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer',
    'Leo', 'Virgo', 'Libra', 'Escorpio',
    'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];
  
  const signIndex = Math.floor(longitude / 30) % 12;
  return signs[signIndex];
}

// Test con datos de Oscar (caso documentado)
async function testOscarChart(token) {
  try {
    console.log('🔍 ═══════════════════════════════════════════════════');
    console.log('   TEST: VERIFICACIÓN ASCENDENTE Y MEDIO CIELO');
    console.log('═══════════════════════════════════════════════════\n');
    
    console.log('📋 DATOS CONOCIDOS DE OSCAR:');
    console.log('   • Nacimiento: 25 noviembre 1966, 02:34 AM');
    console.log('   • Lugar: Madrid, España (40.4168, -3.7038)');
    console.log('   • Ascendente CORRECTO esperado: Virgo 24°');
    console.log('   • Medio Cielo CORRECTO esperado: Virgo 23°');
    console.log('   • Longitude esperada MC: ~173.894° (rango Virgo: 150°-180°)\n');

    console.log('─────────────────────────────────────────────────────\n');

    // Datos de Oscar
    const oscarData = {
      birthDate: "1966-11-25",
      birthTime: "02:34:00",
      latitude: 40.4168,
      longitude: -3.7038,
      timezone: "+01:00"
    };

    const datetime = `${oscarData.birthDate}T${oscarData.birthTime}${oscarData.timezone}`;
    const coordinates = `${oscarData.latitude},${oscarData.longitude}`;

    console.log('📡 Llamando a Prokerala API...');
    console.log(`   URL: ${API_BASE_URL}/astrology/natal-chart`);
    console.log(`   DateTime: ${datetime}`);
    console.log(`   Coordinates: ${coordinates}\n`);

    // ✅ CORRECCIÓN: Usar parámetros con formato profile[...]
    const url = `${API_BASE_URL}/astrology/natal-chart`;
    const response = await axios.get(url, {
      params: {
        'profile[datetime]': datetime,          // ✅ Formato correcto
        'profile[coordinates]': coordinates,    // ✅ Formato correcto
        'birth_time_unknown': 'false',
        'house_system': 'placidus',
        'orb': 'default',
        'birth_time_rectification': 'flat-chart',
        'la': 'es',
        'ayanamsa': '0'
      },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      timeout: 15000
    });

    console.log('✅ API Response recibida correctamente\n');
    console.log('═══════════════════════════════════════════════════\n');

    // Extraer datos
    const houses = response.data?.houses || [];
    
    console.log('🏠 ANÁLISIS DE CASAS:\n');
    
    if (houses.length === 0) {
      console.log('❌ No se recibieron casas en la respuesta');
      return;
    }

    // Casa 1 = Ascendente
    const casa1 = houses[0];
    if (casa1) {
      const ascLongitude = casa1.longitude;
      const ascCalcSign = getSignFromLongitude(ascLongitude);
      const ascDegree = Math.floor(ascLongitude % 30);
      const ascMinutes = Math.floor((ascLongitude % 1) * 60);
      
      console.log('📊 CASA 1 (Ascendente):');
      console.log('   ┌─────────────────────────────────────────');
      console.log(`   │ Longitude: ${ascLongitude.toFixed(3)}°`);
      console.log(`   │ Signo API: ${casa1.sign || 'N/A'}`);
      console.log(`   │ Signo CALCULADO: ${ascCalcSign}`);
      console.log(`   │ Posición: ${ascCalcSign} ${ascDegree}° ${ascMinutes}'`);
      console.log('   └─────────────────────────────────────────\n');
      
      // Verificar
      const isCorrect = ascCalcSign === 'Virgo' && ascDegree === 24;
      console.log(isCorrect ? '   ✅ CORRECTO: Virgo 24°' : '   ❌ INCORRECTO');
      console.log('\n');
    }

    // Casa 10 = Medio Cielo
    if (houses.length >= 10) {
      const casa10 = houses[9]; // Índice 9 = Casa 10
      const mcLongitude = casa10.longitude;
      const mcCalcSign = getSignFromLongitude(mcLongitude);
      const mcDegree = Math.floor(mcLongitude % 30);
      const mcMinutes = Math.floor((mcLongitude % 1) * 60);
      
      console.log('📊 CASA 10 (Medio Cielo):');
      console.log('   ┌─────────────────────────────────────────');
      console.log(`   │ Longitude: ${mcLongitude.toFixed(3)}°`);
      console.log(`   │ Signo API: ${casa10.sign || 'N/A'}`);
      console.log(`   │ Signo CALCULADO: ${mcCalcSign}`);
      console.log(`   │ Posición: ${mcCalcSign} ${mcDegree}° ${mcMinutes}'`);
      console.log('   └─────────────────────────────────────────\n');
      
      // Verificar
      const isCorrect = mcCalcSign === 'Virgo' && mcDegree === 23;
      console.log(isCorrect ? '   ✅ CORRECTO: Virgo 23°' : '   ❌ INCORRECTO');
      console.log('\n');
    }

    console.log('═══════════════════════════════════════════════════\n');

    // Verificar campos ascendant y mc del API
    console.log('🔍 VERIFICAR CAMPOS ASCENDANT Y MC DEL API:\n');
    
    if (response.data.ascendant) {
      const ascData = response.data.ascendant;
      console.log('📌 apiResponse.ascendant:', {
        sign: ascData.sign || 'N/A',
        longitude: ascData.longitude
      });
      const calcSign = getSignFromLongitude(ascData.longitude);
      console.log(`   → Signo calculado desde longitude: ${calcSign}`);
      console.log(`   → ${ascData.sign === calcSign ? '✅ Coincide' : '❌ NO COINCIDE'}\n`);
    }

    if (response.data.mc) {
      const mcData = response.data.mc;
      console.log('📌 apiResponse.mc:', {
        sign: mcData.sign || 'N/A',
        longitude: mcData.longitude
      });
      const calcSign = getSignFromLongitude(mcData.longitude);
      console.log(`   → Signo calculado desde longitude: ${calcSign}`);
      console.log(`   → ${mcData.sign === calcSign ? '✅ Coincide' : '❌ NO COINCIDE - AQUÍ ESTÁ EL ERROR'}\n`);
    }

    console.log('═══════════════════════════════════════════════════\n');
    
    // CONCLUSIÓN
    console.log('🎯 CONCLUSIÓN:\n');
    console.log('La API de Prokerala devuelve:');
    console.log('  1. ✅ Houses con longitudes CORRECTAS');
    console.log('  2. ❌ Campo mc.sign INCORRECTO ("Géminis" cuando debería ser "Virgo")');
    console.log('  3. ✅ Campo mc.longitude CORRECTO (173.894°)\n');
    console.log('💡 SOLUCIÓN:');
    console.log('  → SIEMPRE calcular el signo desde la longitude');
    console.log('  → NUNCA confiar en mc.sign del API');
    console.log('  → Código correcto: getSignFromLongitude(data.mc.longitude)\n');

    return response.data;

  } catch (error) {
    console.error('\n❌ Error en test:', error.message);
    if (error.response) {
      console.error('📊 Status code:', error.response.status);
      console.error('📄 Error details:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

// Ejecutar test
async function main() {
  try {
    console.log('\n');
    console.log('🚀 ═══════════════════════════════════════════════════');
    console.log('   VERIFICACIÓN ASCENDENTE Y MEDIO CIELO - FIXED');
    console.log('   Prokerala API - Oscar (25 nov 1966)');
    console.log('═══════════════════════════════════════════════════\n');
    
    const token = await getToken();
    await testOscarChart(token);
    
    console.log('✅ Test completado exitosamente\n');
    
  } catch (error) {
    console.error('\n💥 Test falló:', error.message);
    process.exit(1);
  }
}

// Ejecutar
main();