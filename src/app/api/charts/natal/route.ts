// src/app/api/charts/natal/route.ts - CORREGIDO PARA USAR ENDPOINT QUE FUNCIONA
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData from '@/models/BirthData';
import Chart from '@/models/Chart';
import axios from 'axios';

/**
 * ✅ API CHARTS/NATAL - LLAMADA DIRECTA A PROKERALA (ENDPOINT CORRECTO)
 * 
 * GET: Obtiene carta guardada
 * POST: Genera nueva carta llamando DIRECTAMENTE a Prokerala API con natal-planet-position
 * DELETE: Elimina carta guardada (para forzar regeneración)
 */

// Configuración de Prokerala
const API_BASE_URL = 'https://api.prokerala.com/v2';
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
 * ✅ CORRECCIÓN CRÍTICA: Llamar a endpoint que devuelve datos JSON, no SVG
 */
async function callProkeralaAPI(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezone: string
) {
  console.log('📡 === LLAMADA DIRECTA A PROKERALA API (ENDPOINT CORRECTO) ===');
  console.log('📅 Parámetros:', { birthDate, birthTime, latitude, longitude, timezone });
  
  try {
    // Obtener token
    const token = await getProkeralaToken();
    
    // Formatear parámetros
    const formattedBirthTime = birthTime || '12:00:00';
    const offset = calculateTimezoneOffset(birthDate, timezone);
    const datetime = `${birthDate}T${formattedBirthTime}${offset}`;
    
    const latFixed = Math.round(latitude * 10000) / 10000;
    const lngFixed = Math.round(longitude * 10000) / 10000;
    const coordinates = `${latFixed},${lngFixed}`;
    
    console.log('🔧 Datos procesados:', { datetime, coordinates });
    
    // ✅ CORRECCIÓN: Usar endpoint que devuelve datos JSON, no SVG
    const url = new URL(`${API_BASE_URL}/astrology/natal-planet-position`); // ✅ CAMBIADO de natal-chart
    url.searchParams.append('profile[datetime]', datetime);
    url.searchParams.append('profile[coordinates]', coordinates);
    url.searchParams.append('birth_time_unknown', 'false');
    url.searchParams.append('house_system', 'placidus');
    url.searchParams.append('orb', 'default');
    url.searchParams.append('birth_time_rectification', 'flat-chart');
    url.searchParams.append('aspect_filter', 'all');
    url.searchParams.append('la', 'es');
    url.searchParams.append('ayanamsa', '0');
    
    console.log('🌐 URL (natal-planet-position):', url.toString());
    
    // Hacer llamada
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      timeout: 15000 // 15 segundos
    });
    
    console.log('✅ Respuesta recibida:', {
      status: response.status,
      dataType: typeof response.data,
      isArray: Array.isArray(response.data),
      keys: Object.keys(response.data || {})
    });
    
    // ✅ NUEVA VALIDACIÓN: Verificar estructura nueva de Prokerala
    const actualData = response.data?.data || response.data;
    
    console.log('🔍 Estructura de datos:', {
      hasData: !!actualData,
      hasPlanetPositions: !!actualData?.planet_positions,
      hasAngles: !!actualData?.angles,
      hasHouses: !!actualData?.houses,
      planetCount: actualData?.planet_positions?.length || 0,
      angleCount: actualData?.angles?.length || 0
    });
    
    // ✅ CORRECCIÓN: Verificar nueva estructura en lugar de planets directamente
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
      }
    }
    
    throw error;
  }
}

/**
 * ✅ CORRECCIÓN: Procesar datos de nueva estructura de Prokerala
 */
function processProkeralaData(apiResponse: any, latitude: number, longitude: number, timezone: string) {
  console.log('🔄 Procesando datos de Prokerala (nueva estructura)...');
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
  
  // ✅ PROCESAR PLANETAS - Nueva estructura
  const planetData = apiResponse.planet_positions || apiResponse.planets || [];
  console.log('🪐 Procesando planetas:', planetData.length);
  
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
    
    console.log(`🪐 ${result.name}: ${result.sign} ${result.degree}°${result.minutes}' (Casa ${result.housePosition})`);
    return result;
  });
  
  // ✅ PROCESAR CASAS - Nueva estructura
  const houseData = apiResponse.houses || [];
  console.log('🏠 Procesando casas:', houseData.length);
  
  const houses = houseData.map((house: any, index: number) => ({
    number: house.number || (index + 1),
    sign: house.start_cusp?.zodiac?.name || house.zodiac?.name || house.sign || getSignFromLongitude(house.start_cusp?.longitude || house.longitude || 0),
    degree: house.start_cusp?.degree || house.degree || Math.floor((house.start_cusp?.longitude || house.longitude || 0) % 30),
    minutes: house.start_cusp?.minutes || house.minutes || Math.floor(((house.start_cusp?.longitude || house.longitude || 0) % 1) * 60),
    longitude: house.start_cusp?.longitude || house.longitude || 0
  }));
  
  // ✅ PROCESAR ASPECTOS - Nueva estructura
  const aspectData = apiResponse.aspects || [];
  console.log('🔗 Procesando aspectos:', aspectData.length);
  
  const aspects = aspectData.map((aspect: any) => ({
    planet1: aspect.planet_one?.name ? translatePlanet(aspect.planet_one.name) : (aspect.planet1?.name ? translatePlanet(aspect.planet1.name) : 'Unknown'),
    planet2: aspect.planet_two?.name ? translatePlanet(aspect.planet_two.name) : (aspect.planet2?.name ? translatePlanet(aspect.planet2.name) : 'Unknown'),
    type: aspect.aspect?.name || aspect.type || 'conjunction',
    orb: aspect.orb || 0
  }));
  
  // ✅ CRÍTICO: PROCESAR ASCENDENTE desde ANGLES array
  let ascendant;
  if (apiResponse.angles && Array.isArray(apiResponse.angles)) {
    console.log('🔍 Buscando ascendente en angles:', apiResponse.angles.map((a: any) => a.name));
    
    const ascendantAngle = apiResponse.angles.find((angle: any) => 
      angle.name === 'Ascendente' || 
      angle.name === 'Ascendant' ||
      angle.name === 'ASC' ||
      (angle.name && angle.name.toLowerCase().includes('ascend'))
    );
    
    if (ascendantAngle) {
      console.log('🔺 Ascendente encontrado en angles:', ascendantAngle);
      ascendant = {
        sign: ascendantAngle.zodiac?.name || getSignFromLongitude(ascendantAngle.longitude || 0),
        degree: ascendantAngle.degree || Math.floor((ascendantAngle.longitude || 0) % 30),
        minutes: ascendantAngle.minutes || Math.floor(((ascendantAngle.longitude || 0) % 1) * 60),
        longitude: ascendantAngle.longitude || 0
      };
      console.log('🔺 Ascendente procesado:', ascendant);
    } else {
      console.warn('⚠️ No se encontró ascendente en angles array');
    }
  } else if (apiResponse.ascendant) {
    // ✅ FALLBACK: Estructura antigua
    console.log('🔺 Usando ascendente de estructura antigua:', apiResponse.ascendant);
    ascendant = {
      sign: apiResponse.ascendant.sign || getSignFromLongitude(apiResponse.ascendant.longitude || 0),
      degree: Math.floor((apiResponse.ascendant.longitude || 0) % 30),
      minutes: Math.floor(((apiResponse.ascendant.longitude || 0) % 1) * 60),
      longitude: apiResponse.ascendant.longitude || 0
    };
  } else {
    console.warn('⚠️ No se encontró ascendente en ninguna estructura');
  }
  
  // ✅ PROCESAR MEDIO CIELO desde ANGLES array
  let midheaven;
  if (apiResponse.angles && Array.isArray(apiResponse.angles)) {
    const midheavenAngle = apiResponse.angles.find((angle: any) => 
      angle.name === 'Midheaven' || 
      angle.name === 'MC' || 
      angle.name === 'Medio Cielo' ||
      (angle.name && angle.name.toLowerCase().includes('midheaven'))
    );
    
    if (midheavenAngle) {
      console.log('🔺 Medio Cielo encontrado en angles:', midheavenAngle);
      midheaven = {
        sign: midheavenAngle.zodiac?.name || getSignFromLongitude(midheavenAngle.longitude || 0),
        degree: midheavenAngle.degree || Math.floor((midheavenAngle.longitude || 0) % 30),
        minutes: midheavenAngle.minutes || Math.floor(((midheavenAngle.longitude || 0) % 1) * 60),
        longitude: midheavenAngle.longitude || 0
      };
    }
  } else if (apiResponse.mc) {
    // ✅ FALLBACK: Estructura antigua
    midheaven = {
      sign: apiResponse.mc.sign || getSignFromLongitude(apiResponse.mc.longitude || 0),
      degree: Math.floor((apiResponse.mc.longitude || 0) % 30),
      minutes: Math.floor(((apiResponse.mc.longitude || 0) % 1) * 60),
      longitude: apiResponse.mc.longitude || 0
    };
  }
  
  // Distribuciones
  const elementDistribution = calculateElementDistribution(planets);
  const modalityDistribution = calculateModalityDistribution(planets);
  
  console.log('✅ Datos procesados correctamente:', {
    planetsCount: planets.length,
    housesCount: houses.length,
    aspectsCount: aspects.length,
    ascendantSign: ascendant?.sign,
    midheavenSign: midheaven?.sign
  });
  
  // ✅ VERIFICACIÓN ESPECIAL PARA VERÓNICA
  if (ascendant?.sign) {
    console.log('🎯 Ascendente final procesado:', ascendant.sign);
  }
  
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
 * ✅ FUNCIÓN CORREGIDA: Calcular distribución elemental
 * 🎯 SOLUCIÓN: Solo contar los 10 planetas tradicionales, NO puntos como Quirón, Nodos, etc.
 */
function calculateElementDistribution(planets: any[]): { fire: number; earth: number; air: number; water: number } {
  const elementMap: Record<string, string> = {
    'Aries': 'fire', 'Leo': 'fire', 'Sagitario': 'fire',
    'Tauro': 'earth', 'Virgo': 'earth', 'Capricornio': 'earth',
    'Géminis': 'air', 'Libra': 'air', 'Acuario': 'air',
    'Cáncer': 'water', 'Escorpio': 'water', 'Piscis': 'water'
  };
  
  // 🎯 CORRECCIÓN PRINCIPAL: Solo contar los 10 planetas tradicionales
  const TRADITIONAL_PLANETS = [
    'Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 
    'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'
  ];
  
  const counts = { fire: 0, earth: 0, air: 0, water: 0 };
  let total = 0;
  
  planets.forEach(planet => {
    // ✅ FILTRO CRÍTICO: Solo procesar planetas tradicionales
    if (!TRADITIONAL_PLANETS.includes(planet.name)) {
      console.log(`⏭️ Saltando ${planet.name} (no es planeta tradicional)`);
      return; // Saltar Quirón, Nodos, Lilith, etc.
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
 * ✅ FUNCIÓN CORREGIDA: Calcular distribución modal
 * 🎯 SOLUCIÓN: Solo contar los 10 planetas tradicionales
 */
function calculateModalityDistribution(planets: any[]): { cardinal: number; fixed: number; mutable: number } {
  const modalityMap: Record<string, string> = {
    'Aries': 'cardinal', 'Cáncer': 'cardinal', 'Libra': 'cardinal', 'Capricornio': 'cardinal',
    'Tauro': 'fixed', 'Leo': 'fixed', 'Escorpio': 'fixed', 'Acuario': 'fixed',
    'Géminis': 'mutable', 'Virgo': 'mutable', 'Sagitario': 'mutable', 'Piscis': 'mutable'
  };
  
  // 🎯 CORRECCIÓN PRINCIPAL: Solo contar los 10 planetas tradicionales
  const TRADITIONAL_PLANETS = [
    'Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 
    'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'
  ];
  
  const counts = { cardinal: 0, fixed: 0, mutable: 0 };
  let total = 0;
  
  planets.forEach(planet => {
    // ✅ FILTRO CRÍTICO: Solo procesar planetas tradicionales
    if (!TRADITIONAL_PLANETS.includes(planet.name)) {
      return; // Saltar Quirón, Nodos, Lilith, etc.
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
 * ✅ MANTENER: Generar carta de respaldo (sin cambios para preservar funcionalidad)
 */
function generateFallbackChart(birthDate: string, birthTime: string, latitude: number, longitude: number, timezone: string) {
  console.log('⚠️ Generando carta de respaldo...');
  
  const seed = new Date(birthDate).getTime();
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
      housePosition: (index % 12) + 1
    };
  });
  
  const houses = Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    sign: SIGNS[(seededRandom(12) + i) % 12],
    degree: Math.floor(Math.random() * 30),
    minutes: Math.floor(Math.random() * 60)
  }));
  
  const ascSignIndex = seededRandom(12);
  
  return {
    birthData: { latitude, longitude, timezone, datetime: `${birthDate}T${birthTime}` },
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
    modalityDistribution: calculateModalityDistribution(planets),
    latitude,
    longitude,
    timezone
  };
}

// ✅ MANTENER: Todas las funciones GET, DELETE, POST sin cambios en la estructura
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
  console.log('🌟 === INICIO GENERACIÓN CARTA NATAL (ENDPOINT CORRECTO) ===');
  
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
      console.log('📡 === LLAMADA DIRECTA A PROKERALA (ENDPOINT CORRECTO) ===');
      
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
      
      console.log('✅ === CARTA NATAL COMPLETADA (ENDPOINT CORRECTO) ===');
      console.log('🔺 Ascendente obtenido:', natalChart.ascendant?.sign);
      
      // Verificación especial para casos de prueba
      if (birthDate === '1974-02-10' && Math.abs(latitude - 40.4168) < 0.01) {
        console.log('🎯 === VERIFICACIÓN VERÓNICA (ENDPOINT CORRECTO) ===');
        console.log('🔺 ASC obtenido:', natalChart.ascendant?.sign);
        console.log('✅ Esperado: Acuario');
        console.log('🎉 Correcto:', natalChart.ascendant?.sign === 'Acuario' ? 'SÍ ✅' : 'NO ❌');
      }
      
      return NextResponse.json(
        { 
          success: true,
          message: `Carta natal ${regenerate ? 'regenerada' : 'generada'} correctamente usando endpoint correcto`,
          natalChart,
          debug: {
            method: 'direct_prokerala_corrected',
            endpoint: 'natal-planet-position',
            timestamp: new Date().toISOString(),
            ascendant_detected: natalChart.ascendant?.sign
          }
        },
        { status: 200 }
      );
      
    } catch (apiError) {
      console.error('❌ Error llamando a Prokerala (endpoint correcto), usando respaldo:', apiError);
      
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