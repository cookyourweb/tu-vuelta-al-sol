// src/services/progressedChartService.ts - CORREGIDO
import axios from 'axios';

// Configuración de Prokerala
const PROKERALA_API_BASE_URL = 'https://api.prokerala.com/v2';
const TOKEN_URL = 'https://api.prokerala.com/token';
const CLIENT_ID = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_SECRET;

// Cache de token
let tokenCache: { token: string; expires: number } | null = null;

/**
 * Obtener token de Prokerala
 */
async function getProkeralaToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  
  // Usar token en cache si es válido
  if (tokenCache && tokenCache.expires > now + 300) {
    console.log('🔄 Usando token en cache para carta progresada');
    return tokenCache.token;
  }
  
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Credenciales de Prokerala faltantes');
  }
  
  console.log('🔑 Solicitando nuevo token para carta progresada...');
  
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
        },
        timeout: 10000
      }
    );
    
    if (!response.data?.access_token) {
      throw new Error('Respuesta de token inválida');
    }
    
    tokenCache = {
      token: response.data.access_token,
      expires: now + (response.data.expires_in || 3600)
    };
    
    console.log('✅ Token obtenido para carta progresada');
    return tokenCache.token;
  } catch (error) {
    console.error('❌ Error obteniendo token para carta progresada:', error);
    throw new Error(`Error de autenticación: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}

/**
 * Calcular timezone offset
 */
function calculateTimezoneOffset(date: string, timezone: string): string {
  console.log(`🌍 Calculando timezone para carta progresada: ${date} en ${timezone}`);
  
  try {
    const targetDate = new Date(date);
    const year = targetDate.getFullYear();
    
    const getLastSunday = (year: number, month: number): Date => {
      const lastDay = new Date(year, month + 1, 0);
      const dayOfWeek = lastDay.getDay();
      const lastSunday = new Date(lastDay);
      lastSunday.setDate(lastDay.getDate() - dayOfWeek);
      return lastSunday;
    };
    
    // Europa Central
    if (timezone === 'Europe/Madrid' || 
        timezone === 'Europe/Berlin' || 
        timezone === 'Europe/Paris' ||
        timezone === 'Europe/Rome') {
      
      const dstStart = getLastSunday(year, 2); // Marzo
      const dstEnd = getLastSunday(year, 9);   // Octubre
      
      dstStart.setUTCHours(2, 0, 0, 0);
      dstEnd.setUTCHours(2, 0, 0, 0);
      
      const offset = (targetDate >= dstStart && targetDate < dstEnd) ? '+02:00' : '+01:00';
      console.log(`✅ Timezone Europa para progresada: ${offset}`);
      return offset;
    }
    
    // Zonas fijas
    const staticTimezones: Record<string, string> = {
      'America/Argentina/Buenos_Aires': '-03:00',
      'America/Bogota': '-05:00',
      'America/Lima': '-05:00',
      'America/Mexico_City': '-06:00',
      'Asia/Tokyo': '+09:00',
      'UTC': '+00:00',
      'GMT': '+00:00'
    };
    
    if (staticTimezones[timezone]) {
      console.log(`✅ Timezone fijo para progresada: ${staticTimezones[timezone]}`);
      return staticTimezones[timezone];
    }
    
    console.warn(`⚠️ Timezone '${timezone}' no reconocida, usando UTC`);
    return '+00:00';
  } catch (error) {
    console.error('❌ Error calculando timezone para progresada:', error);
    return '+00:00';
  }
}

/**
 * Interfaces para carta progresada
 */
export interface ProgressedChartRequest {
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
  timezone: string;
  progressionYear: number;
}

export interface ProgressedChartData {
  progressionYear: number;
  planets: any[];
  houses: any[];
  aspects: any[];
  ascendant?: any;
  midheaven?: any;
  elementDistribution: any;
  modalityDistribution: any;
}

/**
 * Generar carta progresada usando Prokerala API
 */
export async function generateProgressedChart(params: ProgressedChartRequest): Promise<ProgressedChartData> {
  console.log('📊 === GENERANDO CARTA PROGRESADA ===');
  console.log('📅 Parámetros:', params);
  
  try {
    // Obtener token
    const token = await getProkeralaToken();
    
    // Formatear parámetros
    const formattedBirthTime = params.birthTime || '12:00:00';
    const offset = calculateTimezoneOffset(params.birthDate, params.timezone);
    const datetime = `${params.birthDate}T${formattedBirthTime}${offset}`;
    
    const latFixed = Math.round(params.latitude * 10000) / 10000;
    const lngFixed = Math.round(params.longitude * 10000) / 10000;
    const coordinates = `${latFixed},${lngFixed}`;
    
    console.log('🔧 Datos procesados para progresada:', { 
      datetime, 
      coordinates, 
      progressionYear: params.progressionYear 
    });
    
    // Crear URL para carta progresada
    const url = new URL(`${PROKERALA_API_BASE_URL}/astrology/progression-chart`);
    url.searchParams.append('profile[datetime]', datetime);
    url.searchParams.append('profile[coordinates]', coordinates);
    url.searchParams.append('progression_year', params.progressionYear.toString());
    url.searchParams.append('birth_time_unknown', 'false');
    url.searchParams.append('house_system', 'placidus');
    url.searchParams.append('orb', 'default');
    url.searchParams.append('birth_time_rectification', 'flat-chart');
    url.searchParams.append('aspect_filter', 'all');
    url.searchParams.append('la', 'es');
    url.searchParams.append('ayanamsa', '0');
    
    console.log('🌐 URL para carta progresada:', url.toString());
    
    // Hacer llamada a Prokerala
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      timeout: 20000 // 20 segundos
    });
    
    console.log('✅ Respuesta de carta progresada recibida:', {
      status: response.status,
      planetsCount: response.data?.planets?.length || 0,
      hasAscendant: !!response.data?.ascendant
    });
    
    if (!response.data?.planets) {
      throw new Error('Respuesta inválida de Prokerala - no hay datos de planetas progresados');
    }
    
    return processProgressedData(response.data, params.progressionYear);
    
  } catch (error) {
    console.error('❌ Error generando carta progresada:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        tokenCache = null; // Limpiar cache
        throw new Error('Error de autenticación con Prokerala para carta progresada');
      } else if (error.response?.status === 429) {
        throw new Error('Límite de solicitudes excedido para carta progresada');
      }
    }
    
    // Generar carta progresada de respaldo
    return generateFallbackProgressedChart(params);
  }
}

/**
 * Procesar datos de carta progresada de Prokerala
 */
function processProgressedData(apiResponse: any, progressionYear: number): ProgressedChartData {
  console.log('🔄 Procesando datos de carta progresada...');
  
  const getSignFromLongitude = (longitude: number): string => {
    const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
    return signs[Math.floor(longitude / 30) % 12];
  };
  
  const translatePlanet = (englishName: string): string => {
    const translations: Record<string, string> = {
      'Sun': 'Sol', 'Moon': 'Luna', 'Mercury': 'Mercurio', 'Venus': 'Venus',
      'Mars': 'Marte', 'Jupiter': 'Júpiter', 'Saturn': 'Saturno',
      'Uranus': 'Urano', 'Neptune': 'Neptuno', 'Pluto': 'Plutón',
      'Chiron': 'Quirón', 'North Node': 'Nodo Norte', 'South Node': 'Nodo Sur'
    };
    return translations[englishName] || englishName;
  };
  
  // Procesar planetas progresados
  const planets = (apiResponse.planets || []).map((planet: any) => ({
    name: translatePlanet(planet.name || 'Unknown'),
    sign: planet.sign || getSignFromLongitude(planet.longitude || 0),
    degree: Math.floor((planet.longitude || 0) % 30),
    minutes: Math.floor(((planet.longitude || 0) % 1) * 60),
    retrograde: planet.is_retrograde || false,
    housePosition: planet.house || 1,
    longitude: planet.longitude || 0
  }));
  
  // Procesar casas progresadas
  const houses = (apiResponse.houses || []).map((house: any) => ({
    number: house.number || 1,
    sign: house.sign || getSignFromLongitude(house.longitude || 0),
    degree: Math.floor((house.longitude || 0) % 30),
    minutes: Math.floor(((house.longitude || 0) % 1) * 60),
    longitude: house.longitude || 0
  }));
  
  // Procesar aspectos progresados
  const aspects = (apiResponse.aspects || []).map((aspect: any) => ({
    planet1: aspect.planet1?.name ? translatePlanet(aspect.planet1.name) : 'Unknown',
    planet2: aspect.planet2?.name ? translatePlanet(aspect.planet2.name) : 'Unknown',
    type: aspect.aspect?.name || aspect.type || 'conjunction',
    orb: aspect.orb || 0
  }));
  
  // Ascendente progresado
  let ascendant;
  if (apiResponse.ascendant) {
    ascendant = {
      sign: apiResponse.ascendant.sign || getSignFromLongitude(apiResponse.ascendant.longitude || 0),
      degree: Math.floor((apiResponse.ascendant.longitude || 0) % 30),
      minutes: Math.floor(((apiResponse.ascendant.longitude || 0) % 1) * 60),
      longitude: apiResponse.ascendant.longitude || 0
    };
  }
  
  // Medio Cielo progresado
  let midheaven;
  if (apiResponse.mc) {
    midheaven = {
      sign: apiResponse.mc.sign || getSignFromLongitude(apiResponse.mc.longitude || 0),
      degree: Math.floor((apiResponse.mc.longitude || 0) % 30),
      minutes: Math.floor(((apiResponse.mc.longitude || 0) % 1) * 60),
      longitude: apiResponse.mc.longitude || 0
    };
  }
  
  // Distribuciones elementales y modales
  const elementDistribution = calculateElementDistribution(planets);
  const modalityDistribution = calculateModalityDistribution(planets);
  
  console.log('✅ Carta progresada procesada:', {
    progressionYear,
    planetsCount: planets.length,
    ascendantSign: ascendant?.sign
  });
  
  return {
    progressionYear,
    planets,
    houses,
    aspects,
    ascendant,
    midheaven,
    elementDistribution,
    modalityDistribution
  };
}

/**
 * Generar carta progresada de respaldo
 */
function generateFallbackProgressedChart(params: ProgressedChartRequest): ProgressedChartData {
  console.log('⚠️ Generando carta progresada de respaldo...');
  
  const seed = new Date(params.birthDate).getTime() + params.progressionYear;
  const seededRandom = (max: number) => Math.floor((seed % 100000) / 100000 * max);
  
  const SIGNS = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
  const PLANETS = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'];
  
  const planets = PLANETS.map((name, index) => {
    const signIndex = (seededRandom(12) + index + params.progressionYear) % 12;
    return {
      name,
      sign: SIGNS[signIndex],
      degree: Math.floor(Math.random() * 30),
      minutes: Math.floor(Math.random() * 60),
      retrograde: name !== 'Sol' && name !== 'Luna' && Math.random() < 0.3,
      housePosition: (index % 12) + 1
    };
  });
  
  const houses = Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    sign: SIGNS[(seededRandom(12) + i) % 12],
    degree: Math.floor(Math.random() * 30),
    minutes: Math.floor(Math.random() * 60)
  }));
  
  const ascSignIndex = (seededRandom(12) + params.progressionYear) % 12;
  
  return {
    progressionYear: params.progressionYear,
    planets,
    houses,
    aspects: [],
    ascendant: {
      sign: SIGNS[ascSignIndex],
      degree: Math.floor(Math.random() * 30),
      minutes: Math.floor(Math.random() * 60)
    },
    midheaven: {
      sign: SIGNS[(ascSignIndex + 3) % 12],
      degree: Math.floor(Math.random() * 30),
      minutes: Math.floor(Math.random() * 60)
    },
    elementDistribution: calculateElementDistribution(planets),
    modalityDistribution: calculateModalityDistribution(planets)
  };
}

/**
 * Calcular distribución elemental
 */
function calculateElementDistribution(planets: any[]) {
  const elementMap: Record<string, string> = {
    'Aries': 'fire', 'Leo': 'fire', 'Sagitario': 'fire',
    'Tauro': 'earth', 'Virgo': 'earth', 'Capricornio': 'earth',
    'Géminis': 'air', 'Libra': 'air', 'Acuario': 'air',
    'Cáncer': 'water', 'Escorpio': 'water', 'Piscis': 'water'
  };
  
  const counts = { fire: 0, earth: 0, air: 0, water: 0 };
  let total = 0;
  
  planets.forEach(planet => {
    const element = elementMap[planet.sign];
    if (element) {
      counts[element as keyof typeof counts]++;
      total++;
    }
  });
  
  if (total === 0) return { fire: 25, earth: 25, air: 25, water: 25 };
  
  return {
    fire: Math.round((counts.fire / total) * 100),
    earth: Math.round((counts.earth / total) * 100),
    air: Math.round((counts.air / total) * 100),
    water: Math.round((counts.water / total) * 100)
  };
}

/**
 * Calcular distribución modal
 */
function calculateModalityDistribution(planets: any[]) {
  const modalityMap: Record<string, string> = {
    'Aries': 'cardinal', 'Cáncer': 'cardinal', 'Libra': 'cardinal', 'Capricornio': 'cardinal',
    'Tauro': 'fixed', 'Leo': 'fixed', 'Escorpio': 'fixed', 'Acuario': 'fixed',
    'Géminis': 'mutable', 'Virgo': 'mutable', 'Sagitario': 'mutable', 'Piscis': 'mutable'
  };
  
  const counts = { cardinal: 0, fixed: 0, mutable: 0 };
  let total = 0;
  
  planets.forEach(planet => {
    const modality = modalityMap[planet.sign];
    if (modality) {
      counts[modality as keyof typeof counts]++;
      total++;
    }
  });
  
  if (total === 0) return { cardinal: 33, fixed: 33, mutable: 34 };
  
  return {
    cardinal: Math.round((counts.cardinal / total) * 100),
    fixed: Math.round((counts.fixed / total) * 100),
    mutable: Math.round((counts.mutable / total) * 100)
  };
}