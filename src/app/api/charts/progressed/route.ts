// src/app/api/charts/progressed/route.ts - CORRECCIÓN RÁPIDA
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData from '@/models/BirthData';
import Chart from '@/models/Chart';
// ✅ CORRECCIÓN 1: Cambiar import
import { generateProgressedChart } from '@/services/progressedChartService';
import axios from 'axios';

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
 * Llamar a API de carta progresada de Prokerala
 */
async function callProkeralaProgressedAPI(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezone: string,
  progressionYear: number
) {
  console.log('📡 === LLAMADA A PROKERALA API - CARTA PROGRESADA ===');
  console.log('📅 Parámetros:', { birthDate, birthTime, latitude, longitude, timezone, progressionYear });

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

    console.log('🔧 Datos procesados:', { datetime, coordinates, progressionYear });

    // ✅ INTENTAR MÚLTIPLES ENDPOINTS PARA CARTA PROGRESADA
    const endpoints = [
      'astrology/progression-aspect-chart', // ✅ ENDPOINT QUE FUNCIONA EN POSTMAN
      'astrology/progression-chart',
      'astrology/progressed-planet-position',
      'astrology/progression-planet-position',
      'astrology/solar-progression',
      'astrology/progressed-chart'
    ];

    let response;
    let successfulEndpoint = '';

    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Probando endpoint: ${endpoint}`);
        const url = new URL(`${API_BASE_URL}/${endpoint}`);
        url.searchParams.append('profile[datetime]', datetime);
        url.searchParams.append('profile[coordinates]', coordinates);
        url.searchParams.append('progression_year', progressionYear.toString());
        url.searchParams.append('birth_time_unknown', 'false');
        url.searchParams.append('house_system', 'placidus');
        url.searchParams.append('orb', 'default');
        url.searchParams.append('birth_time_rectification', 'flat-chart');
        url.searchParams.append('aspect_filter', 'all');
        url.searchParams.append('la', 'es');
        url.searchParams.append('ayanamsa', '0');

        console.log(`🌐 URL: ${url.toString()}`);

        response = await axios.get(url.toString(), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          timeout: 10000
        });

        successfulEndpoint = endpoint;
        console.log(`✅ Endpoint exitoso: ${endpoint}`);
        break;

      } catch (endpointError) {
        console.log(`❌ Endpoint ${endpoint} falló:`, endpointError instanceof Error ? endpointError.message : 'Error desconocido');
        continue;
      }
    }

    if (!response) {
      throw new Error('Todos los endpoints de carta progresada fallaron');
    }

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

    return processProkeralaProgressedData(actualData, latitude, longitude, timezone, progressionYear);
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
 * Procesar datos de carta progresada de Prokerala
 */
function processProkeralaProgressedData(apiResponse: any, latitude: number, longitude: number, timezone: string, progressionYear: number) {
  console.log('🔄 Procesando datos de carta progresada de Prokerala...');
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

  // Procesar planetas progresados
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

    console.log(`🪐 ${result.name} Progresado: ${result.sign} ${result.degree}°${result.minutes}' (Casa ${result.housePosition})`);
    return result;
  });

  // Procesar casas progresadas
  const houseData = apiResponse.houses || [];
  const houses = houseData.map((house: any, index: number) => ({
    number: house.number || (index + 1),
    sign: house.start_cusp?.zodiac?.name || house.zodiac?.name || house.sign || getSignFromLongitude(house.start_cusp?.longitude || house.longitude || 0),
    degree: house.start_cusp?.degree || house.degree || Math.floor((house.start_cusp?.longitude || house.longitude || 0) % 30),
    minutes: house.start_cusp?.minutes || house.minutes || Math.floor(((house.start_cusp?.longitude || house.longitude || 0) % 1) * 60),
    longitude: house.start_cusp?.longitude || house.longitude || 0
  }));

  // Procesar aspectos progresados
  const aspectData = apiResponse.aspects || [];
  const aspects = aspectData.map((aspect: any) => ({
    planet1: aspect.planet_one?.name ? translatePlanet(aspect.planet_one.name) : (aspect.planet1?.name ? translatePlanet(aspect.planet1.name) : 'Unknown'),
    planet2: aspect.planet_two?.name ? translatePlanet(aspect.planet_two.name) : (aspect.planet2?.name ? translatePlanet(aspect.planet2.name) : 'Unknown'),
    type: aspect.aspect?.name || aspect.type || 'conjunction',
    orb: aspect.orb || 0
  }));

  // Procesar ascendente progresado
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

  // Procesar medio cielo progresado
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

  // Distribuciones elementales y modales
  const elementDistribution = calculateElementDistribution(planets);
  const modalityDistribution = calculateModalityDistribution(planets);

  console.log('✅ Datos de carta progresada procesados correctamente:', {
    planetsCount: planets.length,
    housesCount: houses.length,
    aspectsCount: aspects.length,
    ascendantSign: ascendant?.sign,
    midheavenSign: midheaven?.sign,
    progressionYear
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
    progressionYear,
    latitude,
    longitude,
    timezone
  };
}

/**
 * Distribución elemental para planetas progresados
 */
function calculateElementDistribution(planets: any[]): { fire: number; earth: number; air: number; water: number } {
  const elementMap: Record<string, string> = {
    'Aries': 'fire', 'Leo': 'fire', 'Sagitario': 'fire',
    'Tauro': 'earth', 'Virgo': 'earth', 'Capricornio': 'earth',
    'Géminis': 'air', 'Libra': 'air', 'Acuario': 'air',
    'Cáncer': 'water', 'Escorpio': 'water', 'Piscis': 'water'
  };

  const TRADITIONAL_PLANETS = [
    'Sol', 'Luna', 'Mercurio', 'Venus', 'Marte',
    'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'
  ];

  const counts = { fire: 0, earth: 0, air: 0, water: 0 };
  let total = 0;

  planets.forEach(planet => {
    if (!TRADITIONAL_PLANETS.includes(planet.name)) {
      return;
    }

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
 * Distribución modal para planetas progresados
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

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { userId, regenerate = false } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      );
    }

    console.log(`🔮 Generando carta progresada personalizada para usuario: ${userId}`);

    // 1. Obtener datos de nacimiento del usuario
    const birthData = await BirthData.findOne({ userId });
    if (!birthData) {
      return NextResponse.json(
        { error: 'Datos de nacimiento no encontrados. Completa tu perfil primero.' },
        { status: 404 }
      );
    }

    // 2. Calcular período personalizado (cumpleaños a cumpleaños)
    const progressionPeriod = calculateProgressionPeriod(birthData.birthDate);
    
    console.log(`📅 Período progresado personalizado:`, progressionPeriod);

    // 3. Verificar si ya existe carta progresada para este período
    if (!regenerate) {
      const existingChart = await Chart.findOne({ 
        userId,
        'progressedCharts.period': progressionPeriod.description
      });
      
      if (existingChart) {
        const currentProgressedChart = existingChart.progressedCharts.find(
          (pc: any) => pc.period === progressionPeriod.description
        );
        
        if (currentProgressedChart) {
          console.log(`✅ Carta progresada existente encontrada para período: ${progressionPeriod.description}`);
          return NextResponse.json({
            success: true,
            data: {
              period: progressionPeriod,
              chart: currentProgressedChart.chart,
              cached: true,
              message: 'Carta progresada encontrada en cache'
            }
          });
        }
      }
    }

    // 4. Generar nueva carta progresada
    console.log(`🔄 Generando nueva carta progresada para período: ${progressionPeriod.description}`);

    // ✅ LLAMADA DIRECTA A PROKERALA API para carta progresada
    try {
      console.log('📡 === LLAMADA DIRECTA A PROKERALA PARA CARTA PROGRESADA ===');

      const progressedChartData = await callProkeralaProgressedAPI(
        birthData.birthDate.toISOString().split('T')[0], // YYYY-MM-DD
        birthData.birthTime || '12:00:00',
        parseFloat(birthData.latitude),
        parseFloat(birthData.longitude),
        birthData.timezone || 'Europe/Madrid',
        progressionPeriod.startYear
      );

      console.log('✅ === CARTA PROGRESADA COMPLETADA ===');
      console.log('🔺 Ascendente progresado obtenido:', progressedChartData.ascendant?.sign);
      console.log('🪐 Planetas progresados:', progressedChartData.planets?.length || 0);
      console.log('🏠 Casas progresadas:', progressedChartData.houses?.length || 0);
      console.log('🔗 Aspectos progresados:', progressedChartData.aspects?.length || 0);

      // 5. Guardar en base de datos
      const progressedEntry = {
        period: progressionPeriod.description,
        year: progressionPeriod.startYear,
        startDate: progressionPeriod.startDate,
        endDate: progressionPeriod.endDate,
        chart: progressedChartData,
        createdAt: new Date()
      };

      await Chart.findOneAndUpdate(
        { userId },
        {
          $push: { progressedCharts: progressedEntry },
          $set: { lastUpdated: new Date() }
        },
        { upsert: true, new: true }
      );

      console.log(`✅ Carta progresada guardada exitosamente para período: ${progressionPeriod.description}`);

      return NextResponse.json({
        success: true,
        data: {
          period: progressionPeriod,
          chart: progressedChartData,
          cached: false,
          message: 'Carta progresada generada exitosamente desde Prokerala API'
        }
      });

    } catch (apiError) {
      console.error('❌ Error llamando a Prokerala para carta progresada, usando respaldo:', apiError);

      // Usar respaldo del servicio si la API falla
      const fallbackChartData = await generateProgressedChart({
        birthDate: birthData.birthDate.toISOString().split('T')[0],
        birthTime: birthData.birthTime || '12:00:00',
        latitude: parseFloat(birthData.latitude),
        longitude: parseFloat(birthData.longitude),
        timezone: birthData.timezone || 'Europe/Madrid',
        progressionYear: progressionPeriod.startYear
      });

      // 5. Guardar en base de datos (con datos de respaldo)
      const progressedEntry = {
        period: progressionPeriod.description,
        year: progressionPeriod.startYear,
        startDate: progressionPeriod.startDate,
        endDate: progressionPeriod.endDate,
        chart: fallbackChartData,
        createdAt: new Date()
      };

      await Chart.findOneAndUpdate(
        { userId },
        {
          $push: { progressedCharts: progressedEntry },
          $set: { lastUpdated: new Date() }
        },
        { upsert: true, new: true }
      );

      console.log(`✅ Carta progresada guardada exitosamente (con respaldo) para período: ${progressionPeriod.description}`);

      return NextResponse.json({
        success: true,
        data: {
          period: progressionPeriod,
          chart: fallbackChartData,
          cached: false,
          fallback: true,
          message: 'Carta progresada generada con datos simulados debido a problemas con la API'
        }
      });
    }

  } catch (error) {
    console.error('❌ Error generando carta progresada:', error);
    return NextResponse.json(
      { 
        error: 'Error interno generando carta progresada',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// ⭐ FUNCIÓN CLAVE: Calcular período personalizado por cumpleaños
function calculateProgressionPeriod(birthDate: Date) {
  const today = new Date();
  const birthMonth = birthDate.getMonth(); // 0-11
  const birthDay = birthDate.getDate(); // 1-31
  
  // Calcular próximo cumpleaños
  let nextBirthday = new Date(today.getFullYear(), birthMonth, birthDay);
  
  // Si el cumpleaños ya pasó este año, usar el próximo año
  if (nextBirthday < today) {
    nextBirthday = new Date(today.getFullYear() + 1, birthMonth, birthDay);
  }
  
  // Calcular cumpleaños siguiente (fin del período)
  const followingBirthday = new Date(nextBirthday.getFullYear() + 1, birthMonth, birthDay);
  
  // Formatear fechas para mostrar al usuario
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  return {
    startDate: nextBirthday,
    endDate: followingBirthday,
    startYear: nextBirthday.getFullYear(),
    description: `${formatDate(nextBirthday)} - ${formatDate(followingBirthday)}`,
    shortDescription: `Año ${nextBirthday.getFullYear()}-${followingBirthday.getFullYear()}`,
    daysUntilStart: Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
    isCurrentPeriod: nextBirthday.getFullYear() === today.getFullYear()
  };
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Obtener datos de nacimiento para calcular período actual
    const birthData = await BirthData.findOne({ userId });
    if (!birthData) {
      return NextResponse.json(
        { error: 'Datos de nacimiento no encontrados' },
        { status: 404 }
      );
    }

    // Calcular período actual
    const currentPeriod = calculateProgressionPeriod(birthData.birthDate);
    
    // Buscar carta progresada existente
    const chart = await Chart.findOne({ 
      userId,
      'progressedCharts.period': currentPeriod.description
    });

    if (!chart || !chart.progressedCharts.length) {
      return NextResponse.json({
        success: true,
        data: {
          period: currentPeriod,
          hasChart: false,
          message: 'No hay carta progresada generada para este período'
        }
      });
    }

    const currentProgressedChart = chart.progressedCharts.find(
      (pc: { period: string; chart: any; createdAt?: Date }) => pc.period === currentPeriod.description
    );

    return NextResponse.json({
      success: true,
      data: {
        period: currentPeriod,
        chart: currentProgressedChart?.chart || null,
        hasChart: !!currentProgressedChart,
        createdAt: currentProgressedChart?.createdAt || null
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo carta progresada:', error);
    return NextResponse.json(
      { error: 'Error interno obteniendo carta progresada' },
      { status: 500 }
    );
  }
}
