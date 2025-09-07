const axios = require('axios');

// Configuración de Prokerala API
const API_BASE_URL = 'https://api.prokerala.com/v2';
const CLIENT_ID = '1c6bf7c7-2b6b-4721-8b32-d054129ecd87';
const CLIENT_SECRET = 'uUBszMlWGA3cPZrngCOrQssCygjBvCZh8w3SQPus';

// Función para obtener token
async function getToken() {
  try {
    console.log('🔑 Solicitando token a Prokerala...');

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

    console.log('✅ Token response status:', response.status);
    console.log('📋 Token data:', response.data);

    if (!response.data || !response.data.access_token) {
      throw new Error('Token de acceso no recibido');
    }

    return response.data.access_token;
  } catch (error) {
    console.error('❌ Error obteniendo token:', error.response?.data || error.message);
    throw error;
  }
}

// Función para probar endpoint más simple - Carta Natal básica
async function testBasicNatalChart(token) {
  try {
    console.log('🔮 Probando API de carta natal básica (menos costosa)...');

    // Datos de prueba simples
    const testData = {
      birthDate: "1990-01-15",
      birthTime: "12:30:00",
      latitude: 40.4168,
      longitude: -3.7038
    };

    // Formatear datetime
    const datetime = `${testData.birthDate}T${testData.birthTime}:00+01:00`;

    console.log('📋 Datos de prueba:', testData);
    console.log('📅 Datetime formateado:', datetime);

    // Construir URL para carta natal básica
    const url = new URL(`${API_BASE_URL}/astrology/natal-chart`);
    url.searchParams.append('datetime', datetime);
    url.searchParams.append('coordinates', `${testData.latitude},${testData.longitude}`);
    url.searchParams.append('ayanamsa', '0');
    url.searchParams.append('house_system', 'placidus');
    url.searchParams.append('la', 'es');

    console.log('🌐 URL completa:', url.toString());

    // Llamar a la API
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 15000
    });

    console.log('✅ API Response status:', response.status);
    console.log('📊 Response data type:', typeof response.data);

    if (typeof response.data === 'string' && response.data.includes('<svg')) {
      console.log('🎨 Respuesta es SVG - OK');
    } else if (response.data && typeof response.data === 'object') {
      console.log('📋 Respuesta JSON - OK');
      console.log('🔍 Contenido:', JSON.stringify(response.data, null, 2).substring(0, 500) + '...');
    }

    return response.data;
  } catch (error) {
    console.error('❌ Error en API de carta natal:', error.response?.data || error.message);
    console.error('📊 Status code:', error.response?.status);
    throw error;
  }
}

// Función para probar endpoint de aspectos (muy básico)
async function testBasicAspects(token) {
  try {
    console.log('🔮 Probando API de aspectos básicos...');

    // Datos de prueba simples
    const testData = {
      birthDate: "1990-01-15",
      birthTime: "12:30:00",
      latitude: 40.4168,
      longitude: -3.7038
    };

    // Formatear datetime
    const datetime = `${testData.birthDate}T${testData.birthTime}:00+01:00`;

    console.log('📋 Datos de prueba:', testData);

    // Construir URL para aspectos básicos
    const url = new URL(`${API_BASE_URL}/astrology/aspects`);
    url.searchParams.append('datetime', datetime);
    url.searchParams.append('coordinates', `${testData.latitude},${testData.longitude}`);
    url.searchParams.append('ayanamsa', '0');
    url.searchParams.append('la', 'es');

    console.log('🌐 URL completa:', url.toString());

    // Llamar a la API
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 15000
    });

    console.log('✅ API Response status:', response.status);
    console.log('📊 Response data type:', typeof response.data);

    if (response.data && typeof response.data === 'object') {
      console.log('📋 Respuesta JSON - OK');
      console.log('🔍 Contenido:', JSON.stringify(response.data, null, 2).substring(0, 500) + '...');
    }

    return response.data;
  } catch (error) {
    console.error('❌ Error en API de aspectos:', error.response?.data || error.message);
    console.error('📊 Status code:', error.response?.status);
    throw error;
  }
}

// Función principal
async function main() {
  try {
    console.log('🚀 Iniciando prueba de conexión con Prokerala API...\n');

    // 1. Obtener token
    const token = await getToken();
    console.log('✅ Token obtenido exitosamente\n');

    // 2. Probar API más simple primero
    console.log('🔍 Probando endpoints más simples para verificar créditos...\n');

    try {
      console.log('📊 Intentando carta natal básica...');
      const natalResult = await testBasicNatalChart(token);
      console.log('✅ Carta natal básica funciona - ¡Tienes créditos!\n');

      console.log('📊 Intentando aspectos básicos...');
      const aspectsResult = await testBasicAspects(token);
      console.log('✅ Aspectos básicos funcionan - ¡Tienes suficientes créditos!\n');

      console.log('🎉 ¡Los endpoints básicos funcionan! Ahora probemos la carta progresada...\n');

      // 3. Si los básicos funcionan, probar carta progresada
      const progressedResult = await testProgressedChart(token);
      console.log('\n🎉 ¡TODO FUNCIONA! La API de Prokerala está completamente operativa');

    } catch (basicError) {
      console.log('\n⚠️ Los endpoints básicos también fallan. Esto confirma que no hay créditos suficientes.');
      console.log('💡 Solución: Recarga créditos en tu cuenta de Prokerala');
    }

  } catch (error) {
    console.error('\n💥 Error general en la prueba:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verificar que hayas recargado créditos en Prokerala');
    console.log('2. Verificar que los créditos se aplicaron a la cuenta correcta');
    console.log('3. Esperar unos minutos si acabas de recargar');
    process.exit(1);
  }
}

// Ejecutar prueba
main();
