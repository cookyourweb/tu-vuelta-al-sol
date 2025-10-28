// test-prokerala-fixed.js - VERSION COMPLETA CORREGIDA
const axios = require('axios');

// ConfiguraciÃ³n de Prokerala API
const API_BASE_URL = 'https://api.prokerala.com/v2';
const CLIENT_ID = '1c6bf7c7-2b6b-4721-8b32-d054129ecd87';
const CLIENT_SECRET = 'uUBszMlWGA3cPZrngCOrQssCygjBvCZh8w3SQPus';

// FunciÃ³n para obtener token
async function getToken() {
  try {
    console.log('ðŸ” Solicitando token a Prokerala...');

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

    console.log('âœ… Token response status:', response.status);
    console.log('ðŸ“‹ Token data:', response.data);

    if (!response.data || !response.data.access_token) {
      throw new Error('Token de acceso no recibido');
    }

    return response.data.access_token;
  } catch (error) {
    console.error('âŒ Error obteniendo token:', error.response?.data || error.message);
    throw error;
  }
}

// FunciÃ³n corregida para probar carta natal
async function testCorrectedNatalChart(token) {
  try {
    console.log('ðŸ”® Probando carta natal con parÃ¡metros CORREGIDOS...');

    // Datos de prueba bien formateados
    const testData = {
      birthDate: "1974-02-10", // Fecha de VerÃ³nica
      birthTime: "07:30:00",
      latitude: 40.4164,
      longitude: -3.7025
    };

    // Formateo correcto de datetime (ISO 8601)
    const datetime = `${testData.birthDate}T${testData.birthTime}+01:00`;
    console.log('ðŸ“… Datetime formateado CORRECTAMENTE:', datetime);

    // Formateo correcto de coordenadas
    const coordinates = `${testData.latitude},${testData.longitude}`;
    console.log('ðŸ—ºï¸ Coordenadas formateadas CORRECTAMENTE:', coordinates);

    // Usar endpoint completo de carta natal
    const apiUrl = 'https://api.prokerala.com/v2/astrology/natal-aspect-chart';
    
    console.log('ðŸŒ URL completa:', apiUrl);

    const response = await axios.get(apiUrl, {
      params: {
        'profile[datetime]': datetime,
        'profile[coordinates]': coordinates,
        'profile[birth_time_unknown]': 'false',
        'house_system': 'placidus',
        'orb': 'default',
        'birth_time_rectification': 'flat-chart',
        'aspect_filter': 'all',
        'la': 'es',
        'ayanamsa': 0
      },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      timeout: 15000
    });

    console.log('âœ… API EXITOSA!');
    console.log('ðŸ“Š Status:', response.status);
    console.log('ðŸŽ¯ Datos recibidos:', {
      planetas: response.data?.planets?.length || 0,
      ascendente: response.data?.ascendant || null,
      casas: response.data?.houses?.length || 0,
      aspectos: response.data?.aspects?.length || 0
    });

    // Mostrar datos especÃ­ficos
    if (response.data?.planets) {
      console.log('\nðŸŒŸ PLANETAS ENCONTRADOS:');
      response.data.planets.forEach(planet => {
        console.log(`  - ${planet.name}: ${planet.degree?.toFixed(2)}Â° ${planet.sign} Casa ${planet.house}`);
      });
    }

    if (response.data?.ascendant) {
      console.log(`\nðŸŽ­ ASCENDENTE: ${response.data.ascendant.degree?.toFixed(2)}Â° ${response.data.ascendant.sign}`);
    }

    if (response.data?.aspects) {
      console.log(`\nðŸ”— ASPECTOS: ${response.data.aspects.length} encontrados`);
    }

    return response.data;

  } catch (error) {
    console.error('âŒ Error en carta natal corregida:', error.response?.data || error.message);
    
    if (error.response?.data) {
      console.log('ðŸ“Š Status code:', error.response.status);
      console.log('ðŸ” Detalles del error:', JSON.stringify(error.response.data, null, 2));
    }
    
    throw error;
  }
}

// FunciÃ³n CORREGIDA para probar carta progresada
async function testProgressedChart(token) {
  try {
    console.log('\nðŸ”„ Probando carta PROGRESADA CORREGIDA...');

    // Datos para carta progresada
    const testData = {
      birthDate: "1974-02-10",
      birthTime: "07:30:00",
      latitude: 40.4164,
      longitude: -3.7025,
      progressionYear: 2025
    };

    const datetime = `${testData.birthDate}T${testData.birthTime}+01:00`;
    const coordinates = `${testData.latitude},${testData.longitude}`;

    console.log('ðŸ“… Datos progresiÃ³n:', {
      datetime,
      coordinates,
      progressionYear: testData.progressionYear
    });

    // CORRECCIÃ“N: Usar GET en lugar de POST
    const progressedUrl = 'https://api.prokerala.com/v2/astrology/progression-chart';

    const response = await axios.get(progressedUrl, {
      params: {
        'profile[datetime]': datetime,
        'profile[coordinates]': coordinates,
        'profile[birth_time_unknown]': 'false',
        'progression_year': testData.progressionYear,
        'current_coordinates': coordinates,
        'house_system': 'placidus',
        'orb': 'default',
        'birth_time_rectification': 'flat-chart',
        'aspect_filter': 'all',
        'la': 'es',
        'ayanamsa': 0
      },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      timeout: 20000
    });

    console.log('âœ… CARTA PROGRESADA EXITOSA!');
    console.log('ðŸ“Š Status:', response.status);
    console.log('ðŸŽ¯ Datos:', {
      planetas: response.data?.planets?.length || 0,
      aspectos: response.data?.aspects?.length || 0,
      casas: response.data?.houses?.length || 0
    });

    // Mostrar planetas progresados
    if (response.data?.planets) {
      console.log('\nðŸŒŸ PLANETAS PROGRESADOS:');
      response.data.planets.slice(0, 7).forEach(planet => {
        console.log(`  - ${planet.name}: ${planet.degree?.toFixed(2)}Â° ${planet.sign} Casa ${planet.house}`);
      });
    }

    if (response.data?.aspects) {
      console.log(`\nðŸ”— ASPECTOS PROGRESADOS: ${response.data.aspects.length} encontrados`);
    }

    return response.data;

  } catch (error) {
    console.error('âŒ Error en carta progresada:', error.response?.data || error.message);
    
    if (error.response?.data) {
      console.log('ðŸ“Š Status code:', error.response.status);
      console.log('ðŸ” Error details:', JSON.stringify(error.response.data, null, 2));
    }

    // Si falla, intentar endpoints alternativos
    if (error.response?.status === 404 || error.response?.status === 405) {
      console.log('\nðŸ”„ Intentando endpoints alternativos...');
      return await tryAlternativeEndpoints(token, testData);
    }
    
    throw error;
  }
}

// FunciÃ³n para probar endpoints alternativos
async function tryAlternativeEndpoints(token, testData) {
  const datetime = `${testData.birthDate}T${testData.birthTime}+01:00`;
  const coordinates = `${testData.latitude},${testData.longitude}`;

  const alternativeEndpoints = [
    'progression-aspect-chart',
    'secondary-progression',
    'progressed-chart'
  ];

  for (const endpoint of alternativeEndpoints) {
    try {
      console.log(`ðŸ”„ Probando: ${endpoint}`);
      
      const url = `${API_BASE_URL}/astrology/${endpoint}`;
      const response = await axios.get(url, {
        params: {
          'profile[datetime]': datetime,
          'profile[coordinates]': coordinates,
          'profile[birth_time_unknown]': 'false',
          'progression_year': testData.progressionYear,
          'house_system': 'placidus',
          'la': 'es',
          'ayanamsa': 0
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        timeout: 20000
      });

      console.log(`âœ… Ã‰XITO con ${endpoint}!`);
      console.log('ðŸ“Š Status:', response.status);
      return response.data;

    } catch (altError) {
      console.log(`âŒ ${endpoint} fallÃ³:`, altError.response?.status || altError.message);
      continue;
    }
  }

  throw new Error('Todos los endpoints alternativos fallaron');
}

// Ejecutar todas las pruebas
async function runAllTests() {
  try {
    console.log('ðŸš€ === INICIANDO PRUEBAS CORREGIDAS COMPLETAS ===\n');

    // 1. Obtener token
    const token = await getToken();
    console.log(`ðŸ”‘ Token obtenido: ${token.slice(0, 20)}...\n`);

    // 2. Probar carta natal completa
    const natalData = await testCorrectedNatalChart(token);

    // 3. Probar carta progresada corregida
    const progressedData = await testProgressedChart(token);

    console.log('\nðŸŽ‰ === TODAS LAS PRUEBAS COMPLETADAS ===');
    console.log('âœ… Carta natal: FUNCIONANDO');
    console.log('âœ… Carta progresada: FUNCIONANDO');
    console.log('ðŸ”§ Todos los parÃ¡metros CORREGIDOS');
    console.log('ðŸ’° CrÃ©ditos suficientes disponibles');

    // GuÃ­a de implementaciÃ³n
    console.log('\nðŸ“‹ === PARÃMETROS PARA TU APLICACIÃ“N ===');
    console.log('1. Endpoint natal: /v2/astrology/natal-aspect-chart');
    console.log('2. Endpoint progresada: /v2/astrology/progression-chart');
    console.log('3. MÃ©todo: GET para ambos');
    console.log('4. Formato datetime: YYYY-MM-DDTHH:MM:SS+01:00');
    console.log('5. Coordenadas: "lat,lon" exacto');
    console.log('6. ParÃ¡metros: profile[datetime], profile[coordinates]');

    return { natal: natalData, progressed: progressedData };

  } catch (error) {
    console.error('\nðŸ’¥ ERROR CRÃTICO:', error.message);
    
    // DiagnÃ³stico especÃ­fico
    if (error.message.includes('405')) {
      console.log('ðŸ’¡ PROBLEMA: MÃ©todo HTTP incorrecto');
    } else if (error.message.includes('parameter')) {
      console.log('ðŸ’¡ PROBLEMA: Formato de parÃ¡metros');
    } else if (error.message.includes('credit')) {
      console.log('ðŸ’¡ PROBLEMA: CrÃ©ditos insuficientes');
    } else {
      console.log('ðŸ’¡ REVISA: Credenciales y conectividad');
    }
    
    throw error;
  }
}

// Ejecutar pruebas
runAllTests();