// src/app/api/charts/natal/route.ts - VERSIÓN SIN DEPENDENCIA CIRCULAR
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData from '@/models/BirthData';
import Chart from '@/models/Chart';
import axios from 'axios';

/**
 * ✅ API CHARTS/NATAL - LLAMADA DIRECTA A PROKERALA (SIN DEPENDENCIA CIRCULAR)
 * 
 * GET: Obtiene carta guardada
 * POST: Genera nueva carta llamando DIRECTAMENTE a Prokerala API  
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
 * Llamar directamente a Prokerala API
 */
async function callProkeralaAPI(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezone: string
) {
  console.log('📡 === LLAMADA DIRECTA A PROKERALA API ===');
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
    
    // Crear URL
    const url = new URL(`${API_BASE_URL}/astrology/natal-chart`);
    url.searchParams.append('profile[datetime]', datetime);
    url.searchParams.append('profile[coordinates]', coordinates);
    url.searchParams.append('birth_time_unknown', 'false');
    url.searchParams.append('house_system', 'placidus');
    url.searchParams.append('orb', 'default');
    url.searchParams.append('birth_time_rectification', 'flat-chart');
    url.searchParams.append('aspect_filter', 'all');
    url.searchParams.append('la', 'es');
    url.searchParams.append('ayanamsa', '0');
    
    console.log('🌐 URL:', url.toString());
    
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
      planetsCount: response.data?.planets?.length || 0,
      hasAscendant: !!response.data?.ascendant
    });
    
    if (!response.data?.planets) {
      throw new Error('Respuesta inválida de Prokerala - no hay datos de planetas');
    }
    
    return processProkeralaData(response.data, latitude, longitude, timezone);
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
 * Procesar datos de Prokerala
 */
function processProkeralaData(apiResponse: any, latitude: number, longitude: number, timezone: string) {
  console.log('🔄 Procesando datos de Prokerala...');
  
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
  
  // Procesar planetas
  const planets = (apiResponse.planets || []).map((planet: any) => ({
    name: translatePlanet(planet.name || 'Unknown'),
    sign: planet.sign || getSignFromLongitude(planet.longitude || 0),
    degree: Math.floor((planet.longitude || 0) % 30),
    minutes: Math.floor(((planet.longitude || 0) % 1) * 60),
    retrograde: planet.is_retrograde || false,
    housePosition: planet.house || 1,
    longitude: planet.longitude || 0
  }));
  
  // Procesar casas
  const houses = (apiResponse.houses || []).map((house: any) => ({
    number: house.number || 1,
    sign: house.sign || getSignFromLongitude(house.longitude || 0),
    degree: Math.floor((house.longitude || 0) % 30),
    minutes: Math.floor(((house.longitude || 0) % 1) * 60),
    longitude: house.longitude || 0
  }));
  
  // Procesar aspectos
  const aspects = (apiResponse.aspects || []).map((aspect: any) => ({
    planet1: aspect.planet1?.name ? translatePlanet(aspect.planet1.name) : 'Unknown',
    planet2: aspect.planet2?.name ? translatePlanet(aspect.planet2.name) : 'Unknown',
    type: aspect.aspect?.name || aspect.type || 'conjunction',
    orb: aspect.orb || 0
  }));
  
  // Ascendente
  let ascendant;
  if (apiResponse.ascendant) {
    ascendant = {
      sign: apiResponse.ascendant.sign || getSignFromLongitude(apiResponse.ascendant.longitude || 0),
      degree: Math.floor((apiResponse.ascendant.longitude || 0) % 30),
      minutes: Math.floor(((apiResponse.ascendant.longitude || 0) % 1) * 60),
      longitude: apiResponse.ascendant.longitude || 0
    };
  }
  
  // Medio Cielo
  let midheaven;
  if (apiResponse.mc) {
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
  
  console.log('✅ Datos procesados:', {
    planetsCount: planets.length,
    ascendantSign: ascendant?.sign
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

/**
 * Generar carta de respaldo
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
  console.log('🌟 === INICIO GENERACIÓN CARTA NATAL (SIN DEPENDENCIA CIRCULAR) ===');
  
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
      console.log('📡 === LLAMADA DIRECTA A PROKERALA ===');
      
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
      
      console.log('✅ === CARTA NATAL COMPLETADA ===');
      console.log('🔺 Ascendente:', natalChart.ascendant?.sign);
      
      // Verificación para casos de prueba
      if (birthDate === '1974-02-10' && Math.abs(latitude - 40.4168) < 0.01) {
        console.log('🎯 === CASO VERÓNICA ===');
        console.log('🔺 ASC obtenido:', natalChart.ascendant?.sign);
        console.log('✅ Esperado: Acuario');
        console.log('🎉 Correcto:', natalChart.ascendant?.sign === 'Acuario' ? 'SÍ' : 'NO');
      }
      
      return NextResponse.json(
        { 
          success: true,
          message: `Carta natal ${regenerate ? 'regenerada' : 'generada'} correctamente`,
          natalChart,
          debug: {
            method: 'direct_prokerala',
            timestamp: new Date().toISOString()
          }
        },
        { status: 200 }
      );
      
    } catch (apiError) {
      console.error('❌ Error llamando a Prokerala, usando respaldo:', apiError);
      
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