 // Script de diagnóstico para verificar datos de Prokerala API
// Para Oscar: 25/11/1966, 02:34:00, Madrid

const axios = require('axios');

const CLIENT_ID = '1c6bf7c7-2b6b-4721-8b32-d054129ecd87';
const CLIENT_SECRET = 'uUBszMlWGA3cPZrngCOrQssCygjBvCZh8w3SQPus';
const API_BASE_URL = 'https://api.prokerala.com';

async function getToken() {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/token`,
      new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('✅ Token obtenido:', response.data.access_token.substring(0, 20) + '...');
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Error obteniendo token:', error.message);
    throw error;
  }
}

async function testOscarChart() {
  try {
    // Datos de Oscar
    const birthDate = '1966-11-25';
    const birthTime = '02:34:00';
    const latitude = 40.4168;
    const longitude = -3.7038;
    const timezone = 'Europe/Madrid';
    
    // Calcular offset (+01:00 para CET en 1966)
    const offset = '+01:00';
    const datetime = `${birthDate}T${birthTime}${offset}`;
    const coordinates = `${latitude},${longitude}`;
    
    console.log('\n📋 DATOS DE ENTRADA:');
    console.log('==================');
    console.log('Fecha:', birthDate);
    console.log('Hora:', birthTime);
    console.log('Datetime:', datetime);
    console.log('Coordenadas:', coordinates);
    console.log('Timezone:', timezone);
    
    // Obtener token
    const token = await getToken();
    
    // Construir URL
    const params = {
      'profile[datetime]': datetime,
      'profile[coordinates]': coordinates,
      'birth_time_unknown': 'false',
      'house_system': 'placidus',
      'orb': 'default',
      'birth_time_rectification': 'flat-chart',
      'aspect_filter': 'all',
      'la': 'es',
      'ayanamsa': '0' // Tropical
    };
    
    const url = new URL(`${API_BASE_URL}/v2/astrology/natal-chart`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    console.log('\n🌐 URL:', url.toString());
    
    // Hacer petición
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n✅ RESPUESTA RECIBIDA');
    console.log('=====================\n');

    // Detectar formato de respuesta
    let data;
    if (typeof response.data === 'string' && response.data.includes('<svg')) {
      console.log('📊 FORMATO: SVG (Gráfico de carta natal)\n');
      console.log('⚠️ SVG response detected but parseSvgResponse function not implemented');
      console.log('💡 For now, skipping SVG parsing and continuing with JSON endpoint');
      return; // Skip SVG processing for now
    } else {
      console.log('📊 FORMATO: JSON\n');
      data = response.data;
    }

    // ANÁLISIS DETALLADO DE PLANETAS
    console.log('🪐 PLANETAS:');
    console.log('============\n');

    const planets = data.planets || [];
    if (planets.length === 0) {
      console.log('❌ No se encontraron datos de planetas en la respuesta\n');
    } else {
      planets.forEach(planet => {
        const calculatedSignIndex = Math.floor(planet.longitude / 30) % 12;
        const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
                       'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
        const calculatedSign = signs[calculatedSignIndex];

        console.log(`${planet.name}:`);
        console.log(`  - Longitud: ${planet.longitude}°`);
        console.log(`  - Signo (API): ${planet.sign || 'NO PROPORCIONADO'}`);
        console.log(`  - Signo (Calculado): ${calculatedSign}`);
        console.log(`  - Casa (API): ${planet.house || 'NO PROPORCIONADO'}`);
        console.log(`  - Retrógrado: ${planet.is_retrograde || false}`);

        // Verificar si hay discrepancia
        if (planet.sign && planet.sign !== calculatedSign) {
          console.log(`  ❌ DISCREPANCIA: API dice ${planet.sign} pero debería ser ${calculatedSign}`);
        }
        console.log('');
      });
    }
    
    // ANÁLISIS DE ASCENDENTE Y MC
    console.log('\n⚡ ÁNGULOS:');
    console.log('===========\n');

    const angles = data.angles || [];
    if (angles.length === 0) {
      console.log('❌ No se encontraron datos de ángulos en la respuesta\n');
    } else {
      angles.forEach(angle => {
        const angleSignIndex = Math.floor(angle.longitude / 30) % 12;
        const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
                       'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
        const angleCalculatedSign = signs[angleSignIndex];

        console.log(`${angle.name || 'ÁNGULO DESCONOCIDO'}:`);
        console.log(`  - Longitud: ${angle.longitude}°`);
        console.log(`  - Signo (API): ${angle.sign || 'NO PROPORCIONADO'}`);
        console.log(`  - Signo (Calculado): ${angleCalculatedSign}`);
        console.log(`  - Grados en signo: ${Math.floor(angle.longitude % 30)}°${Math.floor((angle.longitude % 1) * 60)}'`);

        if (angle.sign && angle.sign !== angleCalculatedSign) {
          console.log(`  ❌ DISCREPANCIA: API dice ${angle.sign} pero debería ser ${angleCalculatedSign}`);
        }
        console.log('');
      });
    }
    
    // ANÁLISIS DE CASAS
    console.log('\n🏠 CASAS:');
    console.log('=========\n');

    const houses = data.houses || [];
    if (houses.length === 0) {
      console.log('❌ No se encontraron datos de casas en la respuesta\n');
    } else {
      houses.slice(0, 3).forEach(house => {
        const houseSignIndex = Math.floor(house.longitude / 30) % 12;
        const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
                       'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
        const houseCalculatedSign = signs[houseSignIndex];

        console.log(`Casa ${house.number}:`);
        console.log(`  - Longitud: ${house.longitude}°`);
        console.log(`  - Signo (API): ${house.sign || 'NO PROPORCIONADO'}`);
        console.log(`  - Signo (Calculado): ${houseCalculatedSign}`);

        if (house.sign && house.sign !== houseCalculatedSign) {
          console.log(`  ❌ DISCREPANCIA: API dice ${house.sign} pero debería ser ${houseCalculatedSign}`);
        }
        console.log('');
      });
    }
    
    // COMPARACIÓN CON CARTA-NATAL.ES
    console.log('\n📊 COMPARACIÓN CON CARTA-NATAL.ES:');
    console.log('===================================\n');

    const expectedData = {
      mercury: { sign: 'Virgo', longitude: 167.381 },
      jupiter: { sign: 'Cáncer', longitude: 94.461 },
      mc: { sign: 'Virgo', longitude: 173.894 },
      ascendant: { sign: 'Virgo', longitude: 174.707 }
    };

    if (planets.length > 0) {
      const mercuryPlanet = planets.find(p => p.name.toLowerCase() === 'mercury' || p.name.toLowerCase() === 'mercurio');
      if (mercuryPlanet) {
        console.log('Mercurio:');
        console.log(`  Esperado: ${expectedData.mercury.sign} (${expectedData.mercury.longitude}°)`);
        console.log(`  Recibido: ${mercuryPlanet.sign || 'N/A'} (${mercuryPlanet.longitude}°)`);
        console.log(`  Diferencia: ${Math.abs(mercuryPlanet.longitude - expectedData.mercury.longitude).toFixed(3)}°`);
        console.log('');
      }

      const jupiterPlanet = planets.find(p => p.name.toLowerCase() === 'jupiter' || p.name.toLowerCase() === 'júpiter');
      if (jupiterPlanet) {
        console.log('Júpiter:');
        console.log(`  Esperado: ${expectedData.jupiter.sign} (${expectedData.jupiter.longitude}°)`);
        console.log(`  Recibido: ${jupiterPlanet.sign || 'N/A'} (${jupiterPlanet.longitude}°)`);
        console.log(`  Diferencia: ${Math.abs(jupiterPlanet.longitude - expectedData.jupiter.longitude).toFixed(3)}°`);
        console.log('');
      }
    }

    if (angles.length > 0) {
      const mcAngle = angles.find(a => a.name.toLowerCase().includes('mc') || a.name.toLowerCase().includes('medio cielo'));
      if (mcAngle) {
        console.log('Medio Cielo:');
        console.log(`  Esperado: ${expectedData.mc.sign} (${expectedData.mc.longitude}°)`);
        console.log(`  Recibido: ${mcAngle.sign || 'N/A'} (${mcAngle.longitude}°)`);
        console.log(`  Diferencia: ${Math.abs(mcAngle.longitude - expectedData.mc.longitude).toFixed(3)}°`);
        console.log('');
      }

      const ascAngle = angles.find(a => a.name.toLowerCase().includes('asc') || a.name.toLowerCase().includes('ascendente'));
      if (ascAngle) {
        console.log('Ascendente:');
        console.log(`  Esperado: ${expectedData.ascendant.sign} (${expectedData.ascendant.longitude}°)`);
        console.log(`  Recibido: ${ascAngle.sign || 'N/A'} (${ascAngle.longitude}°)`);
        console.log(`  Diferencia: ${Math.abs(ascAngle.longitude - expectedData.ascendant.longitude).toFixed(3)}°`);
        console.log('');
      }
    }
    
    // Guardar respuesta completa para análisis
    const fs = require('fs');
    const outputPath = './prokerala-response.json';
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`\n💾 Respuesta completa guardada en: ${outputPath}`);
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Ejecutar test
testOscarChart();