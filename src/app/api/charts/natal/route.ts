// src/app/api/charts/natal/route.ts - VERSIÓN FINAL LIMPIA
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData from '@/models/BirthData';
import Chart from '@/models/Chart';
import axios from 'axios';

/**
 * ✅ API CHARTS/NATAL - LLAMADA DIRECTA A PROKERALA (VERSIÓN LIMPIA)
 * 
 * GET: Obtiene carta guardada
 * POST: Genera nueva carta llamando DIRECTAMENTE a Prokerala API con natal-planet-position
 * DELETE: Elimina carta guardada (para forzar regeneración)
 */

// Configuración de Prokerala
const API_BASE_URL = 'https://api.prokerala.com/v2';
const TOKEN_URL = 'https://api.prokerala.com/token';
const CLIENT_ID = process.env.PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.PROKERALA_CLIENT_SECRET;

// Cache de token
let tokenCache: { token: string; expires: number } | null = null;

/**
 * Obtener token de Prokerala
 */
async function getProkeralaToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  
  // Usar token en cache si es válido
  if (tokenCache && tokenCache.expires > now + 300) {
    console.log('🔄 Usando token en cache');
    return tokenCache.token;
  }
  
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Credenciales de Prokerala faltantes');
  }
  
  console.log('🔑 Solicitando nuevo token...');
  
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
    
    console.log('✅ Token obtenido exitosamente');
    return tokenCache.token;
  } catch (error) {
    console.error('❌ Error obteniendo token:', error);
    throw new Error(`Error de autenticación: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}

/**
 * Calcular timezone offset
 */
function calculateTimezoneOffset(date: string, timezone: string): string {
  console.log(`🌍 Calculando timezone para ${date} en ${timezone}`);
  
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
      console.log(`✅ Timezone Europa: ${offset}`);
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
      console.log(`✅ Timezone fijo: ${staticTimezones[timezone]}`);
      return staticTimezones[timezone];
    }
    
    console.warn(`⚠️ Timezone '${timezone}' no reconocida, usando UTC`);
    return '+00:00';
  } catch (error) {
    console.error('❌ Error calculando timezone:', error);
    return '+00:00';
  }
}

/**
 * ✅ FUNCIÓN PRINCIPAL: Llamar a endpoint que devuelve datos JSON
 */
async function callProkeralaAPI(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezone: string
) {
  console.log('📡 === LLAMADA DIRECTA A PROKERALA API (VERSIÓN LIMPIA) ===');
  console.log('📅 Parámetros:', { birthDate, birthTime, latitude, longitude, timezone });
  
  try {
    // Obtener token
    const token = await getProkeralaToken();
    
    // Formatear parámetros con segundos obligatorios
    let formattedBirthTime = birthTime || '12:00:00';
    
    // ✅ CORRECCIÓN: Asegurar que siempre tenga segundos (formato ISO 8601 completo)
    if (formattedBirthTime.length === 5) {
      formattedBirthTime = formattedBirthTime + ':00';
    }
    
    const offset = calculateTimezoneOffset(birthDate, timezone);
    const datetime = `${birthDate}T${formattedBirthTime}${offset}`;
    
    console.log('🕒 Formato de tiempo verificado:', {
      original: birthTime,
      formatted: formattedBirthTime,
      complete: datetime
    });
    
    const latFixed = Math.round(latitude * 10000) / 10000;
    const lngFixed = Math.round(longitude * 10000) / 10000;
    const coordinates = `${latFixed},${lngFixed}`;
    
    console.log('🔧 Datos procesados:', { datetime, coordinates });
    
    // ✅ LLAMADA GET con parámetros en URL (NO POST)
    const url = new URL(`${API_BASE_URL}/astrology/natal-planet-position`);
    url.searchParams.append('profile[datetime]', datetime);
    url.searchParams.append('profile[coordinates]', coordinates);
    url.searchParams.append('birth_time_unknown', 'false');
    url.searchParams.append('house_system', 'placidus');
    url.searchParams.append('orb', 'default');
    url.searchParams.append('birth_time_rectification', 'flat-chart');
    url.searchParams.append('aspect_filter', 'all');
    url.searchParams.append('la', 'es');
    url.searchParams.append('ayanamsa', '0');
    
    console.log('🌐 URL completa:', url.toString());
    
    // Hacer llamada GET
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      timeout: 15000
    });
    
    console.log('✅ Respuesta recibida:', {
      status: response.status,
      dataType: typeof response.data,
      keys: Object.keys(response.data || {})
    });
    
    // Verificar estructura de datos
    const actualData = response.data?.data || response.data;
    
    if (!actualData?.planet_positions && !actualData?.planets) {
      console.error('❌ No hay datos de planetas en la respuesta');
      console.error('📊 Respuesta completa:', response.data);
      throw new Error('Respuesta inválida de Prokerala - no hay datos de planetas');
    }
    
    return processProkeralaData(actualData, latitude, longitude, timezone);
  } catch (error) {
    console.error('❌ Error en llamada a Prokerala:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        tokenCache = null; // Limpiar cache
        throw new Error('Error de autenticación con Prokerala');
      } else if (error.response?.status === 429) {
        throw new Error('Límite de solicitudes excedido');
      } else if (error.response?.status === 400) {
        console.error('❌ Error 400 - Parámetros incorrectos:', error.response?.data);
        throw new Error('Parámetros incorrectos en la solicitud a Prokerala');
      }
    }
    
    throw error;
  }
}

/**
 * ✅ PROCESAR DATOS de Prokerala
 */
function processProkeralaData(apiResponse: any, latitude: number, longitude: number, timezone: string) {
  console.log('🔄 Procesando datos de Prokerala...');
  console.log('📊 Datos recibidos:', Object.keys(apiResponse || {}));
  
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
  
  // Procesar planetas
  const planetData = apiResponse.planet_positions || apiResponse.planets || [];
  console.log('🪐 Procesando planetas:', planetData.length);
  
  const planets = planetData.map((planet: any) => {
    const houseValue = planet.house_number || planet.house || planet.housePosition || 1; // ← Obtener valor de casa

    const result = {
      name: translatePlanet(planet.name || 'Unknown'),
      sign: planet.zodiac?.name || planet.sign || getSignFromLongitude(planet.longitude || 0),
      degree: planet.degree || Math.floor((planet.longitude || 0) % 30),
      minutes: planet.minutes || Math.floor(((planet.longitude || 0) % 1) * 60),
      retrograde: planet.is_retrograde || planet.retrograde || false,
      housePosition: houseValue,  // ← Para el servicio
      houseNumber: houseValue,    // ← Para los prompts (NUEVO)
      house: houseValue,          // ← Para compatibilidad (NUEVO)
      longitude: planet.longitude || 0
    };
    
    console.log(`🪐 ${result.name}: ${result.sign} ${result.degree}°${result.minutes}' (Casa ${result.housePosition})`);
    return result;
  });
  
  // Procesar casas
  const houseData = apiResponse.houses || [];
  const houses = houseData.map((house: any, index: number) => ({
    number: house.number || (index + 1),
    sign: house.start_cusp?.zodiac?.name || house.zodiac?.name || house.sign || getSignFromLongitude(house.start_cusp?.longitude || house.longitude || 0),
    degree: house.start_cusp?.degree || house.degree || Math.floor((house.start_cusp?.longitude || house.longitude || 0) % 30),
    minutes: house.start_cusp?.minutes || house.minutes || Math.floor(((house.start_cusp?.longitude || house.longitude || 0) % 1) * 60),
    longitude: house.start_cusp?.longitude || house.longitude || 0
  }));
  
  // Procesar aspectos
  const aspectData = apiResponse.aspects || [];
  const aspects = aspectData.map((aspect: any) => ({
    planet1: aspect.planet_one?.name ? translatePlanet(aspect.planet_one.name) : (aspect.planet1?.name ? translatePlanet(aspect.planet1.name) : 'Unknown'),
    planet2: aspect.planet_two?.name ? translatePlanet(aspect.planet_two.name) : (aspect.planet2?.name ? translatePlanet(aspect.planet2.name) : 'Unknown'),
    type: aspect.aspect?.name || aspect.type || 'conjunction',
    orb: aspect.orb || 0
  }));
  
  // Procesar ascendente
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
  
  // Procesar medio cielo
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
  
  // Distribuciones corregidas
  const elementDistribution = calculateElementDistribution(planets);
  const modalityDistribution = calculateModalityDistribution(planets);
  
  console.log('✅ Datos procesados correctamente:', {
    planetsCount: planets.length,
    housesCount: houses.length,
    aspectsCount: aspects.length,
    ascendantSign: ascendant?.sign,
    midheavenSign: midheaven?.sign
  });
  
  return {
    birthData: { latitude, longitude, timezone, datetime: apiResponse.datetime || '' },
    planets,
    houses,
    aspects,
    ascendant,
    midheaven,
    elementDistribution,
    modalityDistribution,
    latitude,
    longitude,
    timezone
  };
}

/**
 * ✅ FUNCIÓN CORREGIDA: Distribución elemental - SOLO PLANETAS TRADICIONALES
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
      console.log(`✅ ${planet.name} (${planet.sign}) → ${element}`);
    }
  });
  
  console.log('📊 Conteo elemental final:', { counts, total });
  
  if (total === 0) return { fire: 25, earth: 25, air: 25, water: 25 };
  
  return {
    fire: Math.round((counts.fire / total) * 100),
    earth: Math.round((counts.earth / total) * 100),
    air: Math.round((counts.air / total) * 100),
    water: Math.round((counts.water / total) * 100)
  };
}

/**
 * ✅ FUNCIÓN CORREGIDA: Distribución modal - SOLO PLANETAS TRADICIONALES
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
 * ✅ CARTA DE RESPALDO MEJORADA cuando API falla
 */
function generateFallbackChart(birthDate: string, birthTime: string, latitude: number, longitude: number, timezone: string) {
  console.log('⚠️ Generando carta de respaldo completa...');

  const seed = new Date(birthDate).getTime() + (birthTime ? new Date(`1970-01-01T${birthTime}`).getTime() : 0);

  // Función para generar números consistentes basados en seed
  const seededRandom = (max: number, offset: number = 0) => {
    const x = Math.sin((seed + offset) * 0.001) * 10000;
    return Math.floor((x - Math.floor(x)) * max);
  };

  const SIGNS = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
  const PLANETS = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'];

  // Generar posiciones de planetas más realistas
  const planets = PLANETS.map((name, index) => {
    const baseSign = seededRandom(12, index * 100);
    const signIndex = (baseSign + Math.floor(index * 1.5)) % 12;
    const degree = seededRandom(30, index * 200);
    const minutes = seededRandom(60, index * 300);

    return {
      name,
      sign: SIGNS[signIndex],
      degree,
      minutes,
      retrograde: name !== 'Sol' && name !== 'Luna' && seededRandom(4, index * 400) === 0,
      housePosition: (seededRandom(12, index * 500) + 1),
      longitude: (signIndex * 30) + degree + (minutes / 60)
    };
  });

  // Generar casas
  const houses = Array.from({ length: 12 }, (_, i) => {
    const signIndex = seededRandom(12, i * 600 + 10000);
    return {
      number: i + 1,
      sign: SIGNS[signIndex],
      degree: seededRandom(30, i * 700 + 10000),
      minutes: seededRandom(60, i * 800 + 10000),
      longitude: (signIndex * 30) + seededRandom(30, i * 900 + 10000)
    };
  });

  // Generar aspectos realistas
  const aspects = [];
  const aspectTypes = ['conjunction', 'opposition', 'trine', 'square', 'sextile'];
  const aspectAngles = { conjunction: 0, opposition: 180, trine: 120, square: 90, sextile: 60 };

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];

      // Calcular ángulo real entre planetas
      const angle = Math.abs(planet1.longitude - planet2.longitude) % 360;
      const minAngle = Math.min(angle, 360 - angle);

      // Determinar tipo de aspecto basado en el ángulo
      let aspectType = null;
      let orb = 0;

      for (const [type, targetAngle] of Object.entries(aspectAngles)) {
        if (Math.abs(minAngle - targetAngle) <= 8) { // Orb de 8 grados
          aspectType = type;
          orb = Math.abs(minAngle - targetAngle);
          break;
        }
      }

      if (aspectType && seededRandom(3, i * 1000 + j * 2000) === 0) { // 33% de probabilidad
        aspects.push({
          planet1: planet1.name,
          planet2: planet2.name,
          type: aspectType,
          orb: Math.round(orb * 10) / 10
        });
      }
    }
  }

  // Asegurar que haya al menos algunos aspectos
  if (aspects.length < 3) {
    for (let i = 0; i < 3 - aspects.length; i++) {
      const p1 = seededRandom(planets.length, i * 3000);
      const p2 = seededRandom(planets.length, i * 4000);
      if (p1 !== p2) {
        aspects.push({
          planet1: planets[p1].name,
          planet2: planets[p2].name,
          type: aspectTypes[seededRandom(aspectTypes.length, i * 5000)],
          orb: seededRandom(8, i * 6000) / 10
        });
      }
    }
  }

  // Ascendente basado en hora de nacimiento
  const birthHour = birthTime ? parseInt(birthTime.split(':')[0]) : 12;
  const ascSignIndex = seededRandom(12, birthHour * 1000);

  const ascendant = {
    sign: SIGNS[ascSignIndex],
    degree: seededRandom(30, 9999),
    minutes: seededRandom(60, 9999),
    longitude: (ascSignIndex * 30) + seededRandom(30, 9999)
  };

  // Medio cielo
  const mcSignIndex = (ascSignIndex + 3) % 12;
  const midheaven = {
    sign: SIGNS[mcSignIndex],
    degree: seededRandom(30, 8888),
    minutes: seededRandom(60, 8888),
    longitude: (mcSignIndex * 30) + seededRandom(30, 8888)
  };

  console.log('📊 Carta de respaldo generada:', {
    planetsCount: planets.length,
    housesCount: houses.length,
    aspectsCount: aspects.length,
    ascendant: ascendant.sign,
    midheaven: midheaven.sign
  });

  return {
    birthData: { latitude, longitude, timezone, datetime: `${birthDate}T${birthTime}` },
    planets,
    houses,
    aspects,
    ascendant,
    midheaven,
    elementDistribution: calculateElementDistribution(planets),
    modalityDistribution: calculateModalityDistribution(planets),
    latitude,
    longitude,
    timezone,
    isFallback: true,
    generatedAt: new Date().toISOString()
  };
}

// ✅ ENDPOINTS PRINCIPALES
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Se requiere el parámetro userId' }, 
        { status: 400 }
      );
    }
    
    await connectDB();
    
    const chart = await Chart.findOne({ userId });
    
    if (!chart || !chart.natalChart) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No se encontró una carta natal para este usuario',
          message: 'Necesitas generar tu carta natal primero'
        }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Carta natal recuperada con éxito',
        natalChart: chart.natalChart 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener carta natal:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al recuperar la carta natal',
        message: 'Hubo un problema al recuperar tu carta natal. Por favor, inténtalo nuevamente.'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Se requiere el ID de usuario' }, 
        { status: 400 }
      );
    }
    
    console.log('🗑️ === ELIMINANDO CARTA GUARDADA ===');
    console.log('👤 Usuario:', userId);
    
    await connectDB();
    
    const result = await Chart.deleteOne({ userId });
    
    console.log('📊 Resultado eliminación:', result);
    
    if (result.deletedCount > 0) {
      console.log('✅ Carta eliminada exitosamente');
      return NextResponse.json(
        { 
          success: true,
          message: 'Carta natal eliminada. La próxima generación será nueva.',
          deletedCount: result.deletedCount
        },
        { status: 200 }
      );
    } else {
      console.log('📭 No había carta para eliminar');
      return NextResponse.json(
        { 
          success: true,
          message: 'No había carta guardada para este usuario',
          deletedCount: 0
        },
        { status: 200 }
      );
    }
    
  } catch (error) {
    console.error('❌ Error eliminando carta:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al eliminar la carta natal',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('🌟 === INICIO GENERACIÓN CARTA NATAL (VERSIÓN LIMPIA) ===');
  
  try {
    const body = await request.json();
    const { userId, regenerate = false } = body;
    
    console.log('📝 Parámetros:', { userId, regenerate });
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Se requiere el ID de usuario' }, 
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Buscar datos de nacimiento
    const birthData = await BirthData.findOne({ userId });
    
    if (!birthData) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No se encontraron datos de nacimiento',
          message: 'Primero debes ingresar tus datos de nacimiento para generar la carta natal.'
        }, 
        { status: 404 }
      );
    }
    
    console.log('✅ Datos de nacimiento encontrados:', {
      birthDate: birthData.birthDate,
      birthTime: birthData.birthTime,
      birthPlace: birthData.birthPlace,
      latitude: birthData.latitude,
      longitude: birthData.longitude
    });
    
    // Eliminar carta existente si se solicita regenerar
    if (regenerate) {
      console.log('🔄 Regeneración solicitada, eliminando carta existente...');
      await Chart.deleteOne({ userId });
    } else {
      // Comprobar si ya existe carta
      const existingChart = await Chart.findOne({ userId });
      
      if (existingChart && existingChart.natalChart) {
        console.log('📋 Carta existente encontrada');
        return NextResponse.json(
          { 
            success: true,
            message: 'Ya existe una carta natal para este usuario',
            natalChart: existingChart.natalChart 
          },
          { status: 200 }
        );
      }
    }
    
    // Preparar datos
    const birthDate = birthData.birthDate.toISOString().split('T')[0];
    const birthTime = birthData.birthTime || '12:00:00';
    const latitude = parseFloat(birthData.latitude);
    const longitude = parseFloat(birthData.longitude);
    const timezone = birthData.timezone || 'Europe/Madrid';
    
    console.log('🔧 Datos procesados:', {
      birthDate, birthTime, latitude, longitude, timezone
    });
    
    // Generar carta natal
    try {
      console.log('📡 === LLAMADA DIRECTA A PROKERALA (VERSIÓN LIMPIA) ===');
      
      const natalChart = await callProkeralaAPI(
        birthDate,
        birthTime,
        latitude,
        longitude,
        timezone
      );
      
      // Guardar en base de datos
      const chartData = {
        userId,
        birthDataId: birthData._id,
        natalChart,
        progressedCharts: [],
        lastUpdated: new Date()
      };
      
      await Chart.findOneAndUpdate(
        { userId },
        chartData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      
      console.log('✅ === CARTA NATAL COMPLETADA (VERSIÓN LIMPIA) ===');
      console.log('🔺 Ascendente obtenido:', natalChart.ascendant?.sign);
      
      // Verificación especial para casos de prueba
      if (birthDate === '1974-02-10' && Math.abs(latitude - 40.4168) < 0.01) {
        console.log('🎯 === VERIFICACIÓN VERÓNICA (VERSIÓN LIMPIA) ===');
        console.log('🔺 ASC obtenido:', natalChart.ascendant?.sign);
        console.log('✅ Esperado: Acuario');
        console.log('🎉 Correcto:', natalChart.ascendant?.sign === 'Acuario' ? 'SÍ ✅' : 'NO ❌');
      }
      
      return NextResponse.json(
        { 
          success: true,
          message: `Carta natal ${regenerate ? 'regenerada' : 'generada'} correctamente usando versión limpia`,
          natalChart,
          debug: {
            method: 'direct_prokerala_clean',
            endpoint: 'natal-planet-position',
            timestamp: new Date().toISOString(),
            ascendant_detected: natalChart.ascendant?.sign
          }
        },
        { status: 200 }
      );
      
    } catch (apiError) {
      console.error('❌ Error llamando a Prokerala (versión limpia), usando respaldo:', apiError);
      
      // Generar carta de respaldo
      const fallbackChart = generateFallbackChart(birthDate, birthTime, latitude, longitude, timezone);
      
      // Guardar carta de respaldo
      const chartData = {
        userId,
        birthDataId: birthData._id,
        natalChart: fallbackChart,
        progressedCharts: [],
        lastUpdated: new Date()
      };
      
      await Chart.findOneAndUpdate(
        { userId },
        chartData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      
      return NextResponse.json(
        { 
          success: true,
          message: 'Carta natal generada con datos simulados debido a problemas con la API',
          natalChart: fallbackChart,
          fallback: true,
          debug: {
            method: 'fallback',
            originalEndpoint: 'natal-planet-position',
            error: apiError instanceof Error ? apiError.message : 'Unknown',
            timestamp: new Date().toISOString()
          }
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('❌ Error general:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor',
        message: 'Ocurrió un error inesperado. Por favor, inténtalo más tarde.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}