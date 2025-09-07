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

// Función para probar la API de carta progresada
async function testProgressedChart(token) {
  try {
    console.log('🔮 Probando API de carta progresada...');

    // Datos de prueba
    const testData = {
      birthDate: "1990-01-15",
      birthTime: "12:30:00",
      latitude: 40.4168,
      longitude: -3.7038,
      timezone: "Europe/Madrid",
      progressionYear: 2025
    };

    // Formatear datetime
    const datetime = `${testData.birthDate}T${testData.birthTime}:00+01:00`;

    console.log('📋 Datos de prueba:', testData);
    console.log('📅 Datetime formateado:', datetime);

    // Construir URL
    const url = new URL(`${API_BASE_URL}/astrology/progression-aspect-chart`);
    url.searchParams.append('profile[datetime]', datetime);
    url.searchParams.append('profile[coordinates]', `${testData.latitude},${testData.longitude}`);
    url.searchParams.append('profile[birth_time_unknown]', 'false');
    url.searchParams.append('progression_year', testData.progressionYear.toString());
    url.searchParams.append('current_coordinates', `${testData.latitude},${testData.longitude}`);
    url.searchParams.append('house_system', 'placidus');
    url.searchParams.append('orb', 'default');
    url.searchParams.append('birth_time_rectification', 'flat-chart');
    url.searchParams.append('aspect_filter', 'all');
    url.searchParams.append('la', 'es');
    url.searchParams.append('ayanamsa', '0');

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
    console.log('📊 Response data keys:', Object.keys(response.data || {}));

    if (typeof response.data === 'string' && response.data.includes('<svg')) {
      console.log('🎨 Respuesta es SVG - OK');
    } else if (response.data && typeof response.data === 'object') {
      console.log('📋 Respuesta JSON - OK');
      console.log('🔍 Contenido:', JSON.stringify(response.data, null, 2).substring(0, 500) + '...');
    }

    return response.data;
  } catch (error) {
    console.error('❌ Error en API de carta progresada:', error.response?.data || error.message);
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

    // 2. Probar API de carta progresada
    const result = await testProgressedChart(token);
    console.log('\n🎉 ¡Prueba completada exitosamente!');
    console.log('✅ La API de Prokerala está funcionando correctamente');

  } catch (error) {
    console.error('\n💥 Error en la prueba:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verificar que las credenciales sean correctas');
    console.log('2. Verificar que tengas créditos disponibles en tu cuenta Prokerala');
    console.log('3. Verificar que la API esté disponible');
    process.exit(1);
  }
}

// Ejecutar prueba
main();
