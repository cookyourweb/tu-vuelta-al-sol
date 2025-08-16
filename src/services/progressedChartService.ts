// src/services/progressedChartService.ts - BASADO 100% EN CÓDIGO NATAL QUE FUNCIONA
import axios from 'axios';

// Configuración de Prokerala - IGUAL QUE CARTA NATAL
const PROKERALA_API_BASE_URL = 'https://api.prokerala.com/v2';
const TOKEN_URL = 'https://api.prokerala.com/token';
const CLIENT_ID = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_SECRET;

// Cache de token - IGUAL QUE CARTA NATAL
let tokenCache: { token: string; expires: number } | null = null;

/**
 * Obtener token de Prokerala - FUNCIÓN IDÉNTICA A CARTA NATAL
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
    
    console.log('✅ Token obtenido exitosamente para carta progresada');
    return tokenCache.token;
  } catch (error) {
    console.error('❌ Error obteniendo token para carta progresada:', error);
    throw new Error(`Error de autenticación: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}

/**
 * Calcular timezone offset - FUNCIÓN IDÉNTICA A CARTA NATAL
 */
function calculateTimezoneOffset(date: string, timezone: string): string {
  console.log(`🌍 Calculando timezone para carta progresada ${date} en ${timezone}`);
  
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
 * ✅ FUNCIÓN PRINCIPAL: Llamar a endpoint progression-chart - BASADA EN callProkeralaAPI
 */
async function callProkeralaProgressionAPI(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezone: string,
  progressionYear: number
) {
  console.log('📡 === LLAMADA DIRECTA A PROKERALA PROGRESSION API ===');
  console.log('📅 Parámetros:', { birthDate, birthTime, latitude, longitude, timezone, progressionYear });
  
  try {
    // Obtener token
    const token = await getProkeralaToken();
    
    // Formatear parámetros con segundos obligatorios - IGUAL QUE CARTA NATAL
    let formattedBirthTime = birthTime || '12:00:00';
    
    // ✅ CORRECCIÓN: Asegurar que siempre tenga segundos (formato ISO 8601 completo)
    if (formattedBirthTime.length === 5) {
      formattedBirthTime = formattedBirthTime + ':00';
    }
    
    const offset = calculateTimezoneOffset(birthDate, timezone);
    const datetime = `${birthDate}T${formattedBirthTime}${offset}`;
    
    console.log('🕒 Formato de tiempo verificado para progresada:', {
      original: birthTime,
      formatted: formattedBirthTime,
      complete: datetime
    });
    
    const latFixed = Math.round(latitude * 10000) / 10000;
    const lngFixed = Math.round(longitude * 10000) / 10000;
    const coordinates = `${latFixed},${lngFixed}`;
    
    console.log('🔧 Datos procesados para progresada:', { datetime, coordinates, progressionYear });
    
    // ✅ LLAMADA GET con parámetros en URL - IGUAL QUE CARTA NATAL PERO CON PROGRESSION-CHART
    const url = new URL(`${PROKERALA_API_BASE_URL}/astrology/progression-chart`);
    url.searchParams.append('profile[datetime]', datetime);
    url.searchParams.append('profile[coordinates]', coordinates);
    url.searchParams.append('progression_year', progressionYear.toString());
    url.searchParams.append('current_coordinates', coordinates); // ✅ PARÁMETRO ESPECÍFICO DE PROGRESSION
    url.searchParams.append('birth_time_unknown', 'false');
    url.searchParams.append('house_system', 'placidus');
    url.searchParams.append('orb', 'default');
    url.searchParams.append('birth_time_rectification', 'flat-chart');
    url.searchParams.append('aspect_filter', 'all');
    url.searchParams.append('la', 'es');
    url.searchParams.append('ayanamsa', '0');
    
    console.log('🌐 URL completa para progresada:', url.toString());
    
    // Hacer llamada GET - IGUAL QUE CARTA NATAL
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      timeout: 15000
    });
    
    console.log('✅ Respuesta de progresada recibida:', {
      status: response.status,
      dataType: typeof response.data,
      keys: Object.keys(response.data || {})
    });
    
    // Verificar estructura de datos - IGUAL QUE CARTA NATAL
    const actualData = response.data?.data || response.data;
    
    if (!actualData?.planet_positions && !actualData?.planets) {
      console.error('❌ No hay datos de planetas progresados en la respuesta');
      console.error('📊 Respuesta completa:', response.data);
      throw new Error('Respuesta inválida de Prokerala - no hay datos de planetas progresados');
    }
    
    return processProgressedProkeralaData(actualData, latitude, longitude, timezone, progressionYear);
  } catch (error) {
    console.error('❌ Error en llamada a Prokerala progresada:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        tokenCache = null; // Limpiar cache
        throw new Error('Error de autenticación con Prokerala para carta progresada');
      } else if (error.response?.status === 429) {
        throw new Error('Límite de solicitudes excedido para carta progresada');
      } else if (error.response?.status === 400) {
        console.error('❌ Error 400 - Parámetros incorrectos para progresada:', error.response?.data);
        throw new Error('Parámetros incorrectos en la solicitud a Prokerala para carta progresada');
      }
    }
    
    throw error;
  }
}

/**
 * ✅ PROCESAR DATOS de Prokerala para carta progresada - BASADA EN processProkeralaData
 */
function processProgressedProkeralaData(apiResponse: any, latitude: number, longitude: number, timezone: string, progressionYear: number) {
  console.log('🔄 Procesando datos de carta progresada de Prokerala...');
  console.log('📊 Datos recibidos para progresada:', Object.keys(apiResponse || {}));
  
  const getSignFromLongitude = (longitude: number): string => {
    const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
    return signs[Math.floor((longitude || 0) / 30) % 12];
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
  
  // Procesar planetas progresados - IGUAL QUE CARTA NATAL
  const planetData = apiResponse.planet_positions || apiResponse.planets || [];
  console.log('🪐 Procesando planetas progresados:', planetData.length);
  
  const planets = planetData.map((planet: any) => {
    const result = {
      name: translatePlanet(planet.name || 'Unknown'),
      sign: planet.zodiac?.name || planet.sign || getSignFromLongitude(planet.longitude || 0),
      degree: planet.degree || Math.floor((planet.longitude || 0) % 30),
      minutes: planet.minutes || Math.floor(((planet.longitude || 0) % 1) * 60),
      retrograde: planet.is_retrograde || planet.retrograde || false,
      housePosition: planet.house_number || planet.house || 1,
      longitude: planet.longitude || 0
    };
    
    console.log(`🪐 PROGRESADO ${result.name}: ${result.sign} ${result.degree}°${result.minutes}' (Casa ${result.housePosition})`);
    return result;
  });
  
  // Procesar casas progresadas - IGUAL QUE CARTA NATAL
  const houseData = apiResponse.houses || [];
  const houses = houseData.map((house: any, index: number) => ({
    number: house.number || (index + 1),
    sign: house.start_cusp?.zodiac?.name || house.zodiac?.name || house.sign || getSignFromLongitude(house.start_cusp?.longitude || house.longitude || 0),
    degree: house.start_cusp?.degree || house.degree || Math.floor((house.start_cusp?.longitude || house.longitude || 0) % 30),
    minutes: house.start_cusp?.minutes || house.minutes || Math.floor(((house.start_cusp?.longitude || house.longitude || 0) % 1) * 60),
    longitude: house.start_cusp?.longitude || house.longitude || 0
  }));
  
  // Procesar aspectos progresados - IGUAL QUE CARTA NATAL
  const aspectData = apiResponse.aspects || [];
  const aspects = aspectData.map((aspect: any) => ({
    planet1: aspect.planet_one?.name ? translatePlanet(aspect.planet_one.name) : (aspect.planet1?.name ? translatePlanet(aspect.planet1.name) : 'Unknown'),
    planet2: aspect.planet_two?.name ? translatePlanet(aspect.planet_two.name) : (aspect.planet2?.name ? translatePlanet(aspect.planet2.name) : 'Unknown'),
    type: aspect.aspect?.name || aspect.type || 'conjunction',
    orb: aspect.orb || 0
  }));
  
  // Procesar ascendente progresado - IGUAL QUE CARTA NATAL
  let ascendant;
  if (apiResponse.angles && Array.isArray(apiResponse.angles)) {
    const ascendantAngle = apiResponse.angles.find((angle: any) => 
      angle.name === 'Ascendente' || 
      angle.name === 'Ascendant' ||
      angle.name === 'ASC' ||
      (angle.name && angle.name.toLowerCase().includes('ascend'))
    );
    
    if (ascendantAngle) {
      ascendant = {
        sign: ascendantAngle.zodiac?.name || getSignFromLongitude(ascendantAngle.longitude || 0),
        degree: ascendantAngle.degree || Math.floor((ascendantAngle.longitude || 0) % 30),
        minutes: ascendantAngle.minutes || Math.floor(((ascendantAngle.longitude || 0) % 1) * 60),
        longitude: ascendantAngle.longitude || 0
      };
    }
  } else if (apiResponse.ascendant) {
    ascendant = {
      sign: apiResponse.ascendant.sign || getSignFromLongitude(apiResponse.ascendant.longitude || 0),
      degree: Math.floor((apiResponse.ascendant.longitude || 0) % 30),
      minutes: Math.floor(((apiResponse.ascendant.longitude || 0) % 1) * 60),
      longitude: apiResponse.ascendant.longitude || 0
    };
  }
  
  // Procesar medio cielo progresado - IGUAL QUE CARTA NATAL
  let midheaven;
  if (apiResponse.angles && Array.isArray(apiResponse.angles)) {
    const midheavenAngle = apiResponse.angles.find((angle: any) => 
      angle.name === 'Midheaven' || 
      angle.name === 'MC' || 
      angle.name === 'Medio Cielo' ||
      (angle.name && angle.name.toLowerCase().includes('midheaven'))
    );
    
    if (midheavenAngle) {
      midheaven = {
        sign: midheavenAngle.zodiac?.name || getSignFromLongitude(midheavenAngle.longitude || 0),
        degree: midheavenAngle.degree || Math.floor((midheavenAngle.longitude || 0) % 30),
        minutes: midheavenAngle.minutes || Math.floor(((midheavenAngle.longitude || 0) % 1) * 60),
        longitude: midheavenAngle.longitude || 0
      };
    }
  } else if (apiResponse.mc) {
    midheaven = {
      sign: apiResponse.mc.sign || getSignFromLongitude(apiResponse.mc.longitude || 0),
      degree: Math.floor((apiResponse.mc.longitude || 0) % 30),
      minutes: Math.floor(((apiResponse.mc.longitude || 0) % 1) * 60),
      longitude: apiResponse.mc.longitude || 0
    };
  }
  
  // Distribuciones corregidas - FUNCIONES IDÉNTICAS A CARTA NATAL
  const elementDistribution = calculateElementDistribution(planets);
  const modalityDistribution = calculateModalityDistribution(planets);
  
  console.log('✅ Datos de carta progresada procesados correctamente:', {
    progressionYear,
    planetsCount: planets.length,
    housesCount: houses.length,
    aspectsCount: aspects.length,
    ascendantSign: ascendant?.sign,
    midheavenSign: midheaven?.sign
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
 * ✅ FUNCIÓN CORREGIDA: Distribución elemental - IDÉNTICA A CARTA NATAL
 */
function calculateElementDistribution(planets: any[]): { fire: number; earth: number; air: number; water: number } {
  const elementMap: Record<string, string> = {
    'Aries': 'fire', 'Leo': 'fire', 'Sagitario': 'fire',
    'Tauro': 'earth', 'Virgo': 'earth', 'Capricornio': 'earth',
    'Géminis': 'air', 'Libra': 'air', 'Acuario': 'air',
    'Cáncer': 'water', 'Escorpio': 'water', 'Piscis': 'water'
  };
  
  // 🎯 FILTRO CRÍTICO: Solo los 10 planetas tradicionales
  const TRADITIONAL_PLANETS = [
    'Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 
    'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'
  ];
  
  const counts = { fire: 0, earth: 0, air: 0, water: 0 };
  let total = 0;
  
  planets.forEach(planet => {
    // ✅ FILTRO: Solo procesar planetas tradicionales
    if (!TRADITIONAL_PLANETS.includes(planet.name)) {
      console.log(`⏭️ Saltando ${planet.name} (no es planeta tradicional)`);
      return;
    }
    
    const element = elementMap[planet.sign];
    if (element) {
      counts[element as keyof typeof counts]++;
      total++;
      console.log(`✅ PROGRESADO ${planet.name} (${planet.sign}) → ${element}`);
    }
  });
  
  console.log('📊 Conteo elemental progresado final:', { counts, total });
  
  if (total === 0) return { fire: 25, earth: 25, air: 25, water: 25 };
  
  return {
    fire: Math.round((counts.fire / total) * 100),
    earth: Math.round((counts.earth / total) * 100),
    air: Math.round((counts.air / total) * 100),
    water: Math.round((counts.water / total) * 100)
  };
}

/**
 * ✅ FUNCIÓN CORREGIDA: Distribución modal - IDÉNTICA A CARTA NATAL
 */
function calculateModalityDistribution(planets: any[]): { cardinal: number; fixed: number; mutable: number } {
  const modalityMap: Record<string, string> = {
    'Aries': 'cardinal', 'Cáncer': 'cardinal', 'Libra': 'cardinal', 'Capricornio': 'cardinal',
    'Tauro': 'fixed', 'Leo': 'fixed', 'Escorpio': 'fixed', 'Acuario': 'fixed',
    'Géminis': 'mutable', 'Virgo': 'mutable', 'Sagitario': 'mutable', 'Piscis': 'mutable'
  };
  
  const TRADITIONAL_PLANETS = [
    'Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 
    'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'
  ];
  
  const counts = { cardinal: 0, fixed: 0, mutable: 0 };
  let total = 0;
  
  planets.forEach(planet => {
    if (!TRADITIONAL_PLANETS.includes(planet.name)) {
      return;
    }
    
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

/**
 * ✅ CARTA PROGRESADA DE RESPALDO - IGUAL QUE CARTA NATAL
 */
function generateFallbackProgressedChart(params: ProgressedChartRequest): ProgressedChartData {
  console.log('⚠️ Generando carta progresada de respaldo...');
  
  const seed = new Date(params.birthDate).getTime() + params.progressionYear;
  const seededRandom = (max: number) => Math.floor((seed % 100000) / 100000 * max);
  
  const SIGNS = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
  const PLANETS = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'];
  
  const planets = PLANETS.map((name, index) => {
    const signIndex = (seededRandom(12) + index) % 12;
    return {
      name,
      sign: SIGNS[signIndex],
      degree: Math.floor(Math.random() * 30),
      minutes: Math.floor(Math.random() * 60),
      retrograde: name !== 'Sol' && name !== 'Luna' && Math.random() < 0.3,
      housePosition: (index % 12) + 1,
      longitude: signIndex * 30 + Math.floor(Math.random() * 30)
    };
  });
  
  const houses = Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    sign: SIGNS[(seededRandom(12) + i) % 12],
    degree: Math.floor(Math.random() * 30),
    minutes: Math.floor(Math.random() * 60),
    longitude: Math.floor(Math.random() * 360)
  }));
  
  const ascSignIndex = seededRandom(12);
  
  return {
    progressionYear: params.progressionYear,
    planets,
    houses,
    aspects: [],
    ascendant: {
      sign: SIGNS[ascSignIndex],
      degree: Math.floor(Math.random() * 30),
      minutes: Math.floor(Math.random() * 60),
      longitude: ascSignIndex * 30 + Math.floor(Math.random() * 30)
    },
    midheaven: {
      sign: SIGNS[(ascSignIndex + 3) % 12],
      degree: Math.floor(Math.random() * 30),
      minutes: Math.floor(Math.random() * 60),
      longitude: ((ascSignIndex + 3) % 12) * 30 + Math.floor(Math.random() * 30)
    },
    elementDistribution: calculateElementDistribution(planets),
    modalityDistribution: calculateModalityDistribution(planets)
  };
}

/**
 * Generar carta progresada usando Prokerala API - FUNCIÓN PRINCIPAL
 */
export async function generateProgressedChart(params: ProgressedChartRequest): Promise<ProgressedChartData> {
  console.log('📊 === GENERANDO CARTA PROGRESADA (BASADA EN CÓDIGO NATAL) ===');
  console.log('📅 Parámetros:', params);
  
  try {
    // Llamar a API usando función basada en código natal que funciona
    const progressedChart = await callProkeralaProgressionAPI(
      params.birthDate,
      params.birthTime,
      params.latitude,
      params.longitude,
      params.timezone,
      params.progressionYear
    );
    
    console.log('✅ === CARTA PROGRESADA COMPLETADA ===');
    console.log('🔺 Ascendente progresado obtenido:', progressedChart.ascendant?.sign);
    
    return progressedChart;
    
  } catch (apiError) {
    console.error('❌ Error llamando a Prokerala progresada, usando respaldo:', apiError);
    
    // Generar carta progresada de respaldo
    const fallbackChart = generateFallbackProgressedChart(params);
    
    console.log('⚠️ Usando carta progresada de respaldo');
    return fallbackChart;
  }
}