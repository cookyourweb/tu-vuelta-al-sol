// test-ascendant-mc-verification.js
// Test ESPECÍFICO para verificar si Ascendente y MC vienen intercambiados de la API
const axios = require('axios');

// Configuración de Prokerala API
const API_BASE_URL = 'https://api.prokerala.com/v2';
const CLIENT_ID = '1XJWLBXo6XOxeMMMkFTqlP2Bc7y1';
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

// Test con datos de Oscar (caso documentado en el análisis)
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

    // Llamar a la API
    const url = `${API_BASE_URL}/astrology/natal-chart`;
    const response = await axios.get(url, {
      params: {
        'datetime': datetime,
        'coordinates': coordinates,
        'ayanamsa': '0',
        'house_system': 'placidus',
        'la': 'es'
      },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      timeout: 15000
    });

    console.log('✅ API Response recibida correctamente\n');
    console.log('═══════════════════════════════════════════════════\n');

    // Extraer datos del Ascendente y MC
    const ascendant = response.data?.ascendant;
    const mc = response.data?.mc;

    console.log('🎯 DATOS DEVUELTOS POR LA API:\n');
    
    // ============================================
    // ANÁLISIS DEL CAMPO "ascendant"
    // ============================================
    if (ascendant) {
      console.log('📊 Campo: apiResponse.ascendant');
      console.log('   ┌─────────────────────────────────────────');
      console.log(`   │ Signo devuelto por API: ${ascendant.sign || 'N/A'}`);
      console.log(`   │ Longitude: ${ascendant.longitude?.toFixed(3)}°`);
      
      const ascCalcSign = getSignFromLongitude(ascendant.longitude);
      const ascDegreeInSign = Math.floor(ascendant.longitude % 30);
      
      console.log(`   │ Signo CALCULADO desde longitude: ${ascCalcSign}`);
      console.log(`   │ Grados en signo: ${ascDegreeInSign}°`);
      console.log('   └─────────────────────────────────────────\n');
    } else {
      console.log('📊 Campo: apiResponse.ascendant → NO DISPONIBLE\n');
    }

    // ============================================
    // ANÁLISIS DEL CAMPO "mc"
    // ============================================
    if (mc) {
      console.log('📊 Campo: apiResponse.mc');
      console.log('   ┌─────────────────────────────────────────');
      console.log(`   │ Signo devuelto por API: ${mc.sign || 'N/A'}`);
      console.log(`   │ Longitude: ${mc.longitude?.toFixed(3)}°`);
      
      const mcCalcSign = getSignFromLongitude(mc.longitude);
      const mcDegreeInSign = Math.floor(mc.longitude % 30);
      
      console.log(`   │ Signo CALCULADO desde longitude: ${mcCalcSign}`);
      console.log(`   │ Grados en signo: ${mcDegreeInSign}°`);
      console.log('   └─────────────────────────────────────────\n');
    } else {
      console.log('📊 Campo: apiResponse.mc → NO DISPONIBLE\n');
    }

    console.log('═══════════════════════════════════════════════════\n');

    // ============================================
    // ANÁLISIS COMPARATIVO
    // ============================================
    if (ascendant && mc) {
      console.log('🔍 ANÁLISIS COMPARATIVO:\n');
      
      const ascLongitude = ascendant.longitude;
      const mcLongitude = mc.longitude;
      
      const ascCalcSign = getSignFromLongitude(ascLongitude);
      const mcCalcSign = getSignFromLongitude(mcLongitude);
      
      console.log('✓ Comparación de longitudes:');
      console.log(`   • ascendant.longitude: ${ascLongitude.toFixed(3)}° → ${ascCalcSign} ${Math.floor(ascLongitude % 30)}°`);
      console.log(`   • mc.longitude: ${mcLongitude.toFixed(3)}° → ${mcCalcSign} ${Math.floor(mcLongitude % 30)}°\n`);
      
      // Verificar contra valores esperados de Oscar
      const isAscInVirgo = ascLongitude >= 150 && ascLongitude < 180;
      const isMcInVirgo = mcLongitude >= 150 && mcLongitude < 180;
      
      console.log('✓ Verificación contra valores CORRECTOS de Oscar:');
      console.log(`   • ¿ascendant.longitude en Virgo (150°-180°)? ${isAscInVirgo ? '✅ SÍ' : '❌ NO'}`);
      console.log(`   • ¿mc.longitude en Virgo (150°-180°)? ${isMcInVirgo ? '✅ SÍ' : '❌ NO'}\n`);
      
      console.log('═══════════════════════════════════════════════════\n');
      
      // ============================================
      // CONCLUSIÓN FINAL
      // ============================================
      console.log('🎯 CONCLUSIÓN:\n');
      
      if (mcLongitude >= 150 && mcLongitude < 180) {
        console.log('✅ CORRECTO: apiResponse.mc contiene el Medio Cielo en Virgo');
        console.log('✅ NO es necesario intercambiar variables');
        console.log('✅ El código actual de prokeralaService.ts está bien\n');
      } else if (ascLongitude >= 150 && ascLongitude < 180) {
        console.log('⚠️  ERROR DETECTADO: Los datos están INTERCAMBIADOS');
        console.log('⚠️  apiResponse.ascendant contiene el Medio Cielo (Virgo)');
        console.log('⚠️  apiResponse.mc contiene el Ascendente\n');
        console.log('🔧 SOLUCIÓN REQUERIDA:');
        console.log('   → Intercambiar las variables en prokeralaService.ts');
        console.log('   → Líneas 537-556: cambiar apiResponse.ascendant ↔ apiResponse.mc\n');
      } else {
        console.log('❌ ERROR: Ninguno de los valores está en Virgo');
        console.log('❌ Puede haber un problema con los datos o cálculos\n');
      }
    } else {
      console.log('❌ No se pudieron obtener ambos valores para comparar\n');
    }

    console.log('═══════════════════════════════════════════════════\n');

    return { ascendant, mc, rawData: response.data };

  } catch (error) {
    console.error('\n❌ Error en test:', error.response?.data || error.message);
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
    console.log('   VERIFICACIÓN ASCENDENTE Y MEDIO CIELO');
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