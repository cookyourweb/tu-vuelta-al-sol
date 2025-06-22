// src/services/prokeralaService.ts - VERSIÓN LIMPIA Y CORREGIDA
import axios from 'axios';

const API_BASE_URL = 'https://api.prokerala.com/v2';
const TOKEN_URL = 'https://api.prokerala.com/token';

// Token cache
let tokenCache: { token: string; expires: number } | null = null;

/**
 * Get access token for Prokerala API
 */
async function getToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  
  if (tokenCache && tokenCache.expires > now + 60) {
    return tokenCache.token;
  }
  
  const CLIENT_ID = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_ID;
  const CLIENT_SECRET = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_SECRET;
  
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Prokerala API credentials missing');
  }
  
  try {
    const response = await axios.post(
      TOKEN_URL,
      new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    if (!response.data || !response.data.access_token) {
      throw new Error('Invalid token response from Prokerala');
    }
    
    tokenCache = {
      token: response.data.access_token,
      expires: now + response.data.expires_in
    };
    
    return tokenCache.token;
  } catch (error) {
    console.error('Error getting Prokerala token:', error);
    throw new Error('Authentication failed with Prokerala API');
  }
}

/**
 * 🔥 FUNCIÓN CRÍTICA CORREGIDA - Formatear datetime correctamente
 */
function formatProkeralaDateTime(
  birthDate: string,
  birthTime: string,
  timezone: string = 'Europe/Madrid'
): string {
  // Asegurar que birthTime tenga formato completo HH:MM:SS
  let formattedTime = birthTime;
  if (birthTime.length === 5) {
    formattedTime = `${birthTime}:00`;
  }
  
  // 🔥 CRÍTICO: Para fechas históricas como 1974, usar offset correcto
  let offset = '+01:00'; // Madrid estándar
  
  // Para Madrid en fechas históricas (antes de 1980), siempre UTC+1
  if (timezone === 'Europe/Madrid') {
    const year = parseInt(birthDate.split('-')[0]);
    if (year <= 1980) {
      offset = '+01:00'; // Madrid histórico siempre UTC+1
    } else {
      // Para fechas modernas, calcular DST
      const birthDateObj = new Date(birthDate);
      const month = birthDateObj.getMonth() + 1;
      const day = birthDateObj.getDate();
      
      // DST aproximado: último domingo marzo a último domingo octubre
      const isDST = (month > 3 && month < 10) || 
                   (month === 3 && day >= 25) || 
                   (month === 10 && day < 25);
      
      offset = isDST ? '+02:00' : '+01:00';
    }
  }
  
  // 🔥 FORMATO ISO 8601 EXACTO (sin doble offset)
  const isoDateTime = `${birthDate}T${formattedTime}${offset}`;
  
  console.log(`🔥 DateTime CORREGIDO: ${isoDateTime}`);
  console.log(`🔥 Componentes: fecha=${birthDate}, hora=${formattedTime}, offset=${offset}`);
  
  return isoDateTime;
}

/**
 * 🔥 FUNCIÓN HELPER - Crear parámetros base para Prokerala (FORMATO CORRECTO)
 */
function createBaseProkeralaParams(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezone: string = 'Europe/Madrid'
): URLSearchParams {
  const datetime = formatProkeralaDateTime(birthDate, birthTime, timezone);
  const coordinates = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  
  const params = new URLSearchParams();
  // 🔥 FORMATO CORRECTO CON profile[] (como esperaba Prokerala)
  params.append('profile[datetime]', datetime);
  params.append('profile[coordinates]', coordinates);
  params.append('birth_time_unknown', 'false');
  params.append('house_system', 'placidus');
  params.append('orb', 'default');
  params.append('birth_time_rectification', 'flat-chart'); // 🔥 CORREGIDO: era 'none'
  params.append('la', 'es');
  params.append('ayanamsa', '1'); // Sideral
  
  return params;
}

/**
 * 🔥 FUNCIÓN PRINCIPAL - Obtener carta natal completa
 */
export async function getNatalHoroscope(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezone: string = 'Europe/Madrid'
): Promise<any> {
  try {
    console.log('🌟 getNatalHoroscope - Endpoint único:', { birthDate, birthTime, latitude, longitude, timezone });
    
    // 🔥 VALIDACIÓN Y CONVERSIÓN ROBUSTA DE COORDENADAS
    const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
    const lon = typeof longitude === 'string' ? parseFloat(longitude) : longitude;
    
    // Validar que son números válidos
    if (isNaN(lat) || isNaN(lon)) {
      throw new Error(`Coordenadas inválidas: lat=${latitude} (${typeof latitude}), lon=${longitude} (${typeof longitude})`);
    }
    
    // Validar rangos geográficos válidos
    if (lat < -90 || lat > 90) {
      throw new Error(`Latitud fuera de rango: ${lat} (debe estar entre -90 y 90)`);
    }
    
    if (lon < -180 || lon > 180) {
      throw new Error(`Longitud fuera de rango: ${lon} (debe estar entre -180 y 180)`);
    }
    
    const token = await getToken();
    console.log('✅ Token obtenido exitosamente');
    
    // Crear parámetros base según Postman
    const baseParams = createBaseProkeralaParams(birthDate, birthTime, lat, lon, timezone);
    
    console.log('🔧 Parámetros base creados:');
    console.log('   DateTime:', baseParams.get('datetime'));
    console.log('   Coordinates:', baseParams.get('coordinates'));
    
    // 🔥 HEADERS PARA AUTENTICACIÓN
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };
    
    // 🔥 USAR SOLO EL ENDPOINT PRINCIPAL natal-chart (como en Postman)
    const natalParams = new URLSearchParams(baseParams);
    natalParams.append('aspect_filter', 'all');
    const natalUrl = `${API_BASE_URL}/astrology/natal-chart?${natalParams.toString()}`;
    
    console.log('🌟 URL Natal Chart:', natalUrl);
    console.log('🎯 URL decodificada:', decodeURIComponent(natalUrl));
    
    // Comparar con Postman
    const postmanExample = 'https://api.prokerala.com/v2/astrology/natal-chart?datetime=1974-02-10T07:30:00%2B05:30&coordinates=10.21%2C78.09&birth_time_unknown=false&house_system=placidus&orb=default&birth_time_rectification=none&aspect_filter=all&la=es&ayanamsa=1';
    console.log('🎯 URL Postman ejemplo:', postmanExample);
    
    // 🔥 UNA SOLA LLAMADA COMO EN POSTMAN
    const response = await axios.get(natalUrl, { headers, timeout: 30000 });
    
    console.log('✅ Respuesta natal-chart exitosa');
    console.log('📊 Status:', response.status);
    console.log('📊 Tipo de datos:', typeof response.data);
    console.log('📊 Es array:', Array.isArray(response.data));
    
    if (Array.isArray(response.data)) {
      console.log('❌ ERROR: Recibido array con', response.data.length, 'elementos');
      console.log('📊 Primeros 3 elementos:', response.data.slice(0, 3));
      throw new Error('API devolvió formato array inesperado');
    }
    
    console.log('📊 Keys de respuesta:', Object.keys(response.data || {}));
    
    // Buscar datos específicos en la respuesta
    const data = response.data;
    let foundPlanets = false;
    let foundAscendant = false;
    let foundAspects = false;
    
    // Verificar estructura de datos
    if (data && typeof data === 'object') {
      // Buscar planetas
      if (data.data && data.data.planet_positions) {
        foundPlanets = true;
        console.log('✅ Planetas encontrados en data.planet_positions:', data.data.planet_positions.length);
      } else if (data.planet_positions) {
        foundPlanets = true;
        console.log('✅ Planetas encontrados en planet_positions:', data.planet_positions.length);
      } else if (data.planets) {
        foundPlanets = true;
        console.log('✅ Planetas encontrados en planets:', data.planets.length);
      }
      
      // Buscar ascendente
      if (data.data && data.data.ascendant) {
        foundAscendant = true;
        console.log('✅ Ascendente encontrado en data.ascendant:', data.data.ascendant);
      } else if (data.ascendant) {
        foundAscendant = true;
        console.log('✅ Ascendente encontrado en ascendant:', data.ascendant);
      } else if (data.data && data.data.houses && data.data.houses[0]) {
        foundAscendant = true;
        console.log('✅ Ascendente encontrado en houses[0]:', data.data.houses[0]);
      }
      
      // Buscar aspectos
      if (data.data && data.data.aspects) {
        foundAspects = true;
        console.log('✅ Aspectos encontrados en data.aspects:', data.data.aspects.length);
      } else if (data.aspects) {
        foundAspects = true;
        console.log('✅ Aspectos encontrados en aspects:', data.aspects.length);
      }
      
      // Mostrar muestra de la estructura completa
      console.log('🔍 Muestra de estructura (primeros 1000 chars):');
      console.log(JSON.stringify(data, null, 2).substring(0, 1000));
    }
    
    if (!foundPlanets && !foundAscendant) {
      console.log('❌ No se encontraron datos astrológicos válidos');
      console.log('📊 Estructura completa recibida:', JSON.stringify(data, null, 2));
    }
    
    // Procesar los datos en el formato esperado
    const combinedData: {
      planets: any[];
      aspects: any[];
      houses: any[];
      ascendant: { sign: string; degree: number; minutes: number; longitude: number } | null;
      midheaven: { sign: string; degree: number; minutes: number; longitude: number } | null;
      raw: any;
    } = {
      planets: [],
      aspects: [],
      houses: [],
      ascendant: null,
      midheaven: null,
      raw: data
    };
    
    // Procesar planetas
    processPlanetData(data, combinedData);
    
    // Procesar aspectos
    processAspectData(data, combinedData);
    
    // Procesar casas  
    processHouseData(data, combinedData);
    
    console.log('✅ Datos procesados:');
    console.log(`   Planetas: ${combinedData.planets.length}`);
    console.log(`   Aspectos: ${combinedData.aspects.length}`);
    console.log(`   Casas: ${combinedData.houses.length}`);
    console.log(`   Ascendente: ${combinedData.ascendant ? combinedData.ascendant.sign : 'NO ENCONTRADO'}`);
    
    return combinedData;
    
  } catch (error) {
    console.error('❌ Error en getNatalHoroscope:', error);
    
    // 🔥 DEBUGGING DETALLADO
    if (axios.isAxiosError(error)) {
      console.error('📋 Detalles del error Axios:');
      console.error('   Status:', error.response?.status);
      console.error('   StatusText:', error.response?.statusText);
      console.error('   Data:', error.response?.data);
      console.error('   URL:', error.config?.url);
      
      // Mostrar error específico de Prokerala
      if (error.response?.data) {
        console.error('🚨 Error Prokerala específico:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    throw new Error(`Failed to get natal chart from Prokerala: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * 🔥 PROCESAR DATOS DE PLANETAS
 */
function processPlanetData(apiResponse: any, combinedData: any): void {
  console.log('🪐 Procesando datos de planetas...');
  console.log('📊 Estructura recibida:', Object.keys(apiResponse || {}));
  
  // Buscar planetas en diferentes ubicaciones posibles
  let planets = null;
  
  if (apiResponse.data && apiResponse.data.planet_positions) {
    planets = apiResponse.data.planet_positions;
  } else if (apiResponse.planet_positions) {
    planets = apiResponse.planet_positions;
  } else if (apiResponse.data && Array.isArray(apiResponse.data)) {
    // Si viene como array, buscar objetos que parezcan planetas
    planets = apiResponse.data.filter((item: any) => 
      item && typeof item === 'object' && (item.name || item.planet)
    );
  }
  
  if (planets && Array.isArray(planets)) {
    console.log(`✅ Encontrados ${planets.length} planetas`);
    
    combinedData.planets = planets.map((planet: any) => ({
      name: translatePlanetName(planet.name || planet.planet?.name || ''),
      sign: planet.sign?.name || getSignFromLongitude(planet.longitude),
      degree: Math.floor((planet.longitude || 0) % 30),
      minutes: Math.floor(((planet.longitude || 0) % 1) * 60),
      longitude: planet.longitude || 0,
      retrograde: planet.is_retrograde || planet.retrograde || false,
      housePosition: planet.house || 1
    }));
    
    // Buscar ascendente
    if (apiResponse.data && apiResponse.data.ascendant) {
      const asc = apiResponse.data.ascendant;
      combinedData.ascendant = {
        sign: asc.sign?.name || getSignFromLongitude(asc.longitude),
        degree: Math.floor((asc.longitude || 0) % 30),
        minutes: Math.floor(((asc.longitude || 0) % 1) * 60),
        longitude: asc.longitude || 0
      };
      console.log('🔥 ASCENDENTE ENCONTRADO:', combinedData.ascendant);
    }
    
    // Buscar medio cielo
    if (apiResponse.data && (apiResponse.data.midheaven || apiResponse.data.mc)) {
      const mc = apiResponse.data.midheaven || apiResponse.data.mc;
      combinedData.midheaven = {
        sign: mc.sign?.name || getSignFromLongitude(mc.longitude),
        degree: Math.floor((mc.longitude || 0) % 30),
        minutes: Math.floor(((mc.longitude || 0) % 1) * 60),
        longitude: mc.longitude || 0
      };
      console.log('🔥 MEDIO CIELO ENCONTRADO:', combinedData.midheaven);
    }
  } else {
    console.log('❌ No se encontraron planetas en la respuesta');
    console.log('📊 Muestra de datos:', JSON.stringify(apiResponse, null, 2).substring(0, 500));
  }
}

/**
 * 🔥 PROCESAR DATOS DE ASPECTOS
 */
function processAspectData(apiResponse: any, combinedData: any): void {
  console.log('🔗 Procesando datos de aspectos...');
  console.log('📊 Estructura recibida:', Object.keys(apiResponse || {}));
  
  let aspects = null;
  
  if (apiResponse.data && apiResponse.data.aspects) {
    aspects = apiResponse.data.aspects;
  } else if (apiResponse.aspects) {
    aspects = apiResponse.aspects;
  } else if (apiResponse.data && Array.isArray(apiResponse.data)) {
    // Si viene como array, buscar objetos que parezcan aspectos
    aspects = apiResponse.data.filter((item: any) => 
      item && typeof item === 'object' && (item.aspect || item.type)
    );
  }
  
  if (aspects && Array.isArray(aspects)) {
    console.log(`✅ Encontrados ${aspects.length} aspectos`);
    
    combinedData.aspects = aspects.map((aspect: any) => ({
      planet1: translatePlanetName(aspect.planet1?.name || aspect.from?.name || ''),
      planet2: translatePlanetName(aspect.planet2?.name || aspect.to?.name || ''),
      type: aspect.aspect?.name || aspect.type || 'conjunction',
      orb: aspect.orb || 0
    }));
  } else {
    console.log('❌ No se encontraron aspectos en la respuesta');
  }
}

/**
 * 🔥 PROCESAR DATOS DE CASAS
 */
function processHouseData(apiResponse: any, combinedData: any): void {
  console.log('🏠 Procesando datos de casas...');
  console.log('📊 Estructura recibida:', Object.keys(apiResponse || {}));
  
  let houses = null;
  
  if (apiResponse.data && apiResponse.data.houses) {
    houses = apiResponse.data.houses;
  } else if (apiResponse.houses) {
    houses = apiResponse.houses;
  } else if (apiResponse.data && apiResponse.data.house_cusps) {
    houses = apiResponse.data.house_cusps;
  } else if (apiResponse.house_cusps) {
    houses = apiResponse.house_cusps;
  }
  
  if (houses && Array.isArray(houses)) {
    console.log(`✅ Encontradas ${houses.length} casas`);
    
    combinedData.houses = houses.map((house: any, index: number) => ({
      number: index + 1,
      sign: house.sign?.name || getSignFromLongitude(house.longitude),
      degree: Math.floor((house.longitude || 0) % 30),
      minutes: Math.floor(((house.longitude || 0) % 1) * 60),
      longitude: house.longitude || 0
    }));
  } else {
    console.log('❌ No se encontraron casas en la respuesta');
  }
}

/**
 * Helper functions
 */
function translatePlanetName(englishName: string): string {
  const translations: Record<string, string> = {
    'Sun': 'Sol',
    'Moon': 'Luna',
    'Mercury': 'Mercurio',
    'Venus': 'Venus',
    'Mars': 'Marte',
    'Jupiter': 'Júpiter',
    'Saturn': 'Saturno',
    'Uranus': 'Urano',
    'Neptune': 'Neptuno',
    'Pluto': 'Plutón',
    'Chiron': 'Quirón',
    'North Node': 'Nodo Norte',
    'South Node': 'Nodo Sur',
    'Lilith': 'Lilith'
  };
  
  return translations[englishName] || englishName;
}

function getSignFromLongitude(longitude: number): string {
  const signs = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer',
    'Leo', 'Virgo', 'Libra', 'Escorpio',
    'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];
  
  const signIndex = Math.floor((longitude || 0) / 30) % 12;
  return signs[signIndex];
}