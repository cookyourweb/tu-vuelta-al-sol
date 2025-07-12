// src/app/api/prokerala/natal-chart/route.ts - VERSIÓN COMPLETAMENTE CORREGIDA
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// API configuration
const API_BASE_URL = 'https://api.prokerala.com/v2';
const TOKEN_URL = 'https://api.prokerala.com/token';
const CLIENT_ID = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_SECRET;

// Token cache
let tokenCache: { token: string; expires: number } | null = null;

/**
 * ✅ FUNCIÓN CORREGIDA: Obtener token de Prokerala con mejor manejo de errores
 */
async function getToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  
  // Use cached token if still valid (with more buffer time)
  if (tokenCache && tokenCache.expires > now + 300) { // 5 minutos de buffer
    console.log('🔄 Usando token en cache');
    return tokenCache.token;
  }
  
  // Verify credentials
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('❌ Credenciales faltantes:', { CLIENT_ID: !!CLIENT_ID, CLIENT_SECRET: !!CLIENT_SECRET });
    throw new Error('Prokerala API credentials missing. Check environment variables.');
  }
  
  console.log('🔑 Solicitando nuevo token a Prokerala...');
  
  try {
    // Request new token
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
        timeout: 10000 // 10 segundos para token
      }
    );
    
    console.log('✅ Respuesta de token recibida:', {
      status: response.status,
      hasToken: !!response.data?.access_token,
      expiresIn: response.data?.expires_in
    });
    
    if (!response.data || !response.data.access_token) {
      console.error('❌ Respuesta inválida de token:', response.data);
      throw new Error('Invalid token response from Prokerala');
    }
    
    // Store token in cache
    tokenCache = {
      token: response.data.access_token,
      expires: now + (response.data.expires_in || 3600) // Default 1 hora si no viene expires_in
    };
    
    console.log('✅ Token guardado en cache, expira en:', new Date(tokenCache.expires * 1000));
    
    return tokenCache.token;
  } catch (error) {
    console.error('❌ Error obteniendo token de Prokerala:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Detalles del error de token:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }
    
    throw new Error(`Authentication failed with Prokerala API: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * ✅ FUNCIÓN CORREGIDA: Calcular timezone offset según fecha y zona horaria
 */
function calculateTimezoneOffset(date: string, timezone: string): string {
  try {
    console.log(`🌍 Calculando timezone offset para ${date} en ${timezone}`);
    
    // Crear fecha para el cálculo
    const targetDate = new Date(date);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth(); // 0-11
    
    // Función para obtener el último domingo de un mes
    const getLastSunday = (year: number, month: number): Date => {
      const lastDay = new Date(year, month + 1, 0); // Último día del mes
      const dayOfWeek = lastDay.getDay(); // 0=domingo, 1=lunes, etc.
      const lastSunday = new Date(lastDay);
      lastSunday.setDate(lastDay.getDate() - dayOfWeek);
      return lastSunday;
    };
    
    // Europa Central (Madrid, Berlín, París, etc.)
    if (timezone === 'Europe/Madrid' || 
        timezone === 'Europe/Berlin' || 
        timezone === 'Europe/Paris' ||
        timezone === 'Europe/Rome' ||
        timezone === 'Europe/Barcelona') {
      
      // Horario de verano: último domingo de marzo a último domingo de octubre
      const dstStart = getLastSunday(year, 2); // Marzo (mes 2)
      const dstEnd = getLastSunday(year, 9);   // Octubre (mes 9)
      
      // Ajustar horarios (2:00 AM UTC)
      dstStart.setUTCHours(2, 0, 0, 0);
      dstEnd.setUTCHours(2, 0, 0, 0);
      
      const offset = (targetDate >= dstStart && targetDate < dstEnd) ? '+02:00' : '+01:00';
      console.log(`✅ Timezone Europa Central: ${offset}`);
      return offset;
    }
    
    // Islas Canarias
    if (timezone === 'Atlantic/Canary') {
      const dstStart = getLastSunday(year, 2);
      const dstEnd = getLastSunday(year, 9);
      dstStart.setUTCHours(1, 0, 0, 0);
      dstEnd.setUTCHours(1, 0, 0, 0);
      
      const offset = (targetDate >= dstStart && targetDate < dstEnd) ? '+01:00' : '+00:00';
      console.log(`✅ Timezone Canarias: ${offset}`);
      return offset;
    }
    
    // Zonas horarias fijas (sin cambio estacional)
    const staticTimezones: Record<string, string> = {
      'America/Argentina/Buenos_Aires': '-03:00',
      'America/Bogota': '-05:00',
      'America/Lima': '-05:00',
      'America/Caracas': '-04:00',
      'America/Mexico_City': '-06:00',
      'America/Santiago': '-04:00',
      'Asia/Tokyo': '+09:00',
      'UTC': '+00:00',
      'GMT': '+00:00'
    };
    
    if (staticTimezones[timezone]) {
      console.log(`✅ Timezone estático: ${staticTimezones[timezone]}`);
      return staticTimezones[timezone];
    }
    
    // Fallback: intentar calcular automáticamente
    console.warn(`⚠️ Timezone '${timezone}' no reconocida, usando UTC`);
    return '+00:00';
    
  } catch (error) {
    console.error('❌ Error calculando timezone offset:', error);
    return '+00:00';
  }
}

/**
 * Get sign name from longitude
 */
function getSignNameFromLongitude(longitude: number): string {
  const signs = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer',
    'Leo', 'Virgo', 'Libra', 'Escorpio',
    'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];
  
  const signIndex = Math.floor(longitude / 30) % 12;
  return signs[signIndex];
}

/**
 * Convert planet name from English to Spanish
 */
function translatePlanetNameToSpanish(englishName: string): string {
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

/**
 * ✅ POST COMPLETAMENTE CORREGIDO: Generate a natal chart
 */
export async function POST(request: NextRequest) {
  console.log('🌟 === INICIO PETICIÓN CARTA NATAL PROKERALA ===');
  
  try {
    const body = await request.json();
    const { birthDate, birthTime, latitude, longitude, timezone } = body;
    
    // Log received parameters
    console.log('📥 Parámetros recibidos:', { 
      birthDate, 
      birthTime, 
      latitude, 
      longitude, 
      timezone,
      hasCredentials: !!CLIENT_ID && !!CLIENT_SECRET
    });
    
    // Validate required parameters
    if (!birthDate || latitude === undefined || longitude === undefined) {
      console.error('❌ Parámetros faltantes:', { birthDate: !!birthDate, latitude, longitude });
      return NextResponse.json(
        { success: false, error: 'Missing required parameters (birthDate, latitude, longitude)' },
        { status: 400 }
      );
    }
    
    try {
      console.log('🔑 === OBTENIENDO TOKEN ===');
      
      // Get token
      const token = await getToken();
      
      console.log('✅ Token obtenido, procediendo con carta natal...');
      
      // ✅ CORREGIDO: Procesar parámetros
      const formattedBirthTime = birthTime || '12:00:00';
      const offset = calculateTimezoneOffset(birthDate, timezone || 'UTC');
      const datetime = `${birthDate}T${formattedBirthTime}${offset}`;
      
      // ✅ CORREGIDO: Formatear coordenadas con precisión correcta (4 decimales)
      const latFixed = Math.round(latitude * 10000) / 10000;
      const lngFixed = Math.round(longitude * 10000) / 10000;
      const coordinates = `${latFixed},${lngFixed}`;
      
      console.log('📡 Parámetros procesados para Prokerala:', {
        datetime,
        coordinates,
        timezone,
        offset,
        originalBirthTime: birthTime
      });
      
      // Create URL with parameters in the exact format needed
      const url = new URL(`${API_BASE_URL}/astrology/natal-chart`);
      url.searchParams.append('profile[datetime]', datetime);
      url.searchParams.append('profile[coordinates]', coordinates);
      url.searchParams.append('birth_time_unknown', 'false');
      url.searchParams.append('house_system', 'placidus');
      url.searchParams.append('orb', 'default');
      url.searchParams.append('birth_time_rectification', 'flat-chart');
      url.searchParams.append('aspect_filter', 'all');
      url.searchParams.append('la', 'es');
      url.searchParams.append('ayanamsa', '0'); // 0=Tropical (Occidental)
      
      console.log('🌐 URL completa para Prokerala:', url.toString());
      
      console.log('📡 === LLAMANDO A PROKERALA API ===');
      
      // Make the request
      const response = await axios.get(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        timeout: 20000 // Reducido a 20 segundos
      });
      
      console.log('✅ Respuesta recibida de Prokerala:', {
        status: response.status,
        hasData: !!response.data,
        planetsCount: response.data?.planets?.length || 0,
        housesCount: response.data?.houses?.length || 0,
        aspectsCount: response.data?.aspects?.length || 0,
        hasAscendant: !!response.data?.ascendant
      });
      
      // Verificar que la respuesta tenga datos válidos
      if (!response.data || !response.data.planets) {
        console.error('❌ Respuesta de Prokerala sin datos válidos:', response.data);
        throw new Error('Invalid response from Prokerala API - no planet data');
      }
      
      console.log('🔄 === PROCESANDO DATOS DE CARTA ===');
      
      // Process the response
      const chartData = processChartData(response.data, latitude, longitude, timezone || 'UTC');
      
      console.log('✅ === CARTA NATAL COMPLETADA ===');
      console.log('🔺 Ascendente:', chartData.ascendant?.sign);
      console.log('🏠 Casas:', chartData.houses?.length);
      console.log('🪐 Planetas:', chartData.planets?.length);
      
      // Verificación específica para casos de prueba
      if (birthDate === '1974-02-10' && Math.abs(latitude - 40.4168) < 0.01) {
        console.log('🎯 === CASO VERÓNICA DETECTADO ===');
        console.log('🔺 ASC obtenido:', chartData.ascendant?.sign);
        console.log('✅ Esperado: Acuario');
        console.log('🎉 Correcto:', chartData.ascendant?.sign === 'Acuario' ? 'SÍ' : 'NO');
      }
      
      return NextResponse.json({
        success: true,
        data: chartData,
        debug: {
          method: 'prokerala_api',
          timestamp: new Date().toISOString(),
          coordinates_used: coordinates,
          datetime_used: datetime
        }
      });
      
    } catch (apiError) {
      console.error('❌ Error en llamada a API de Prokerala:', apiError);
      
      if (axios.isAxiosError(apiError)) {
        console.error('Detalles del error de Axios:', {
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data,
          headers: apiError.response?.headers,
          message: apiError.message
        });
        
        if (apiError.response?.status === 401) {
          // Limpiar cache de token si hay error de autenticación
          tokenCache = null;
          throw new Error('Error de autenticación con Prokerala. Verifica tus credenciales.');
        } else if (apiError.response?.status === 429) {
          throw new Error('Límite de solicitudes excedido. Intenta nuevamente en unos minutos.');
        } else if (apiError.response?.status >= 500) {
          throw new Error('Error del servidor de Prokerala. Intenta nuevamente más tarde.');
        } else if (apiError.code === 'ECONNABORTED') {
          throw new Error('Timeout en la conexión con Prokerala. Intenta nuevamente.');
        }
      }
      
      console.log('🔄 === GENERANDO DATOS DE RESPALDO ===');
      
      // Generate fallback data
      const fallbackData = generateFallbackChart(birthDate, birthTime, latitude, longitude, timezone || 'UTC');
      
      return NextResponse.json({
        success: true,
        data: fallbackData,
        fallback: true,
        message: 'Usando datos simulados debido a error en la API de Prokerala',
        debug: {
          method: 'fallback',
          error: apiError instanceof Error ? apiError.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error('❌ Error general procesando solicitud de carta natal:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error processing request',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * ✅ FUNCIÓN CORREGIDA: Process chart data from API response
 */
function processChartData(apiResponse: unknown, latitude: number, longitude: number, timezone: string) {
  console.log('🔄 Procesando datos de carta...');
  
  const data = apiResponse as any;

  if (!data) {
    throw new Error('No data received from API');
  }

  // Process planets
  const planets = (data.planets || []).map((planet: unknown) => {
    const p = planet as any;
    return {
      name: translatePlanetNameToSpanish(p.name || 'Unknown'),
      sign: p.sign || getSignNameFromLongitude(p.longitude || 0),
      degree: Math.floor((p.longitude || 0) % 30),
      minutes: Math.floor(((p.longitude || 0) % 1) * 60),
      retrograde: p.is_retrograde || false,
      housePosition: p.house || 1,
      longitude: p.longitude || 0
    };
  });

  // Process houses
  const houses = (data.houses || []).map((house: unknown) => {
    const h = house as any;
    return {
      number: h.number || 1,
      sign: h.sign || getSignNameFromLongitude(h.longitude || 0),
      degree: Math.floor((h.longitude || 0) % 30),
      minutes: Math.floor(((h.longitude || 0) % 1) * 60),
      longitude: h.longitude || 0
    };
  });

  // Process aspects
  const aspects = (data.aspects || []).map((aspect: unknown) => {
    const a = aspect as any;
    return {
      planet1: a.planet1?.name ? translatePlanetNameToSpanish(a.planet1.name) : 'Unknown',
      planet2: a.planet2?.name ? translatePlanetNameToSpanish(a.planet2.name) : 'Unknown',
      type: a.aspect?.name || a.type || 'conjunction',
      orb: a.orb || 0
    };
  });

  // Extract ascendant and midheaven
  let ascendant;
  if (data.ascendant) {
    ascendant = {
      sign: data.ascendant.sign || getSignNameFromLongitude(data.ascendant.longitude || 0),
      degree: Math.floor((data.ascendant.longitude || 0) % 30),
      minutes: Math.floor(((data.ascendant.longitude || 0) % 1) * 60),
      longitude: data.ascendant.longitude || 0
    };
  }

  let midheaven;
  if (data.mc) {
    midheaven = {
      sign: data.mc.sign || getSignNameFromLongitude(data.mc.longitude || 0),
      degree: Math.floor((data.mc.longitude || 0) % 30),
      minutes: Math.floor(((data.mc.longitude || 0) % 1) * 60),
      longitude: data.mc.longitude || 0
    };
  }

  // Calculate distributions
  const elementDistribution = calculateElementDistribution(planets);
  const modalityDistribution = calculateModalityDistribution(planets);

  console.log('✅ Datos procesados:', {
    planetsCount: planets.length,
    housesCount: houses.length,
    aspectsCount: aspects.length,
    ascendantSign: ascendant?.sign,
    midheavenSign: midheaven?.sign
  });

  // Return formatted chart data
  return {
    birthData: {
      latitude,
      longitude,
      timezone,
      datetime: data.datetime || ''
    },
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
 * Generate fallback chart when API fails
 */
function generateFallbackChart(
  birthDate: string,
  birthTime: string | undefined,
  latitude: number,
  longitude: number,
  timezone: string
) {
  console.log('⚠️ Generando carta natal de respaldo para:', birthDate, birthTime);
  
  // Random generators
  const randomDegree = () => Math.floor(Math.random() * 30);
  const randomMinutes = () => Math.floor(Math.random() * 60);
  const randomHouse = () => Math.floor(Math.random() * 12) + 1;
  
  // Use birth date as seed for consistent "random" values
  const seed = new Date(birthDate).getTime();
  const seededRandom = (max: number) => Math.floor((seed % 100000) / 100000 * max);
  
  // Zodiac signs
  const SIGNS = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer',
    'Leo', 'Virgo', 'Libra', 'Escorpio',
    'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];
  
  // Planet names
  const PLANETS = [
    'Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 
    'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón',
    'Quirón', 'Nodo Norte', 'Nodo Sur'
  ];
  
  // Generate planets
  const planets = PLANETS.map((name, index) => {
    const signOffset = (index * 83) % 12;
    const signIndex = (seededRandom(12) + signOffset) % 12;
    
    return {
      name,
      sign: SIGNS[signIndex],
      degree: randomDegree(),
      minutes: randomMinutes(),
      retrograde: name !== 'Sol' && name !== 'Luna' && Math.random() < 0.3,
      housePosition: randomHouse()
    };
  });
  
  // Generate houses
  const houses = Array.from({ length: 12 }, (_, i) => {
    const signIndex = (seededRandom(12) + i) % 12;
    
    return {
      number: i + 1,
      sign: SIGNS[signIndex],
      degree: randomDegree(),
      minutes: randomMinutes()
    };
  });
  
  // Generate aspects
  const aspects = [];
  const aspectTypes = ['conjunction', 'opposition', 'trine', 'square', 'sextile'];
  
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      if (Math.random() < 0.3) {
        const aspectType = aspectTypes[Math.floor(Math.random() * aspectTypes.length)];
        aspects.push({
          planet1: planets[i].name,
          planet2: planets[j].name,
          type: aspectType,
          orb: parseFloat((Math.random() * 5).toFixed(1))
        });
      }
    }
  }
  
  // Generate angles
  const ascSignIndex = seededRandom(12);
  const mcSignIndex = (ascSignIndex + 3) % 12;
  
  return {
    birthData: {
      latitude,
      longitude,
      timezone,
      datetime: `${birthDate}T${birthTime || '12:00:00'}`
    },
    planets,
    houses,
    aspects,
    ascendant: {
      sign: SIGNS[ascSignIndex],
      degree: randomDegree(),
      minutes: randomMinutes()
    },
    midheaven: {
      sign: SIGNS[mcSignIndex],
      degree: randomDegree(),
      minutes: randomMinutes()
    },
    elementDistribution: calculateElementDistribution(planets),
    modalityDistribution: calculateModalityDistribution(planets),
    latitude,
    longitude,
    timezone
  };
}

/**
 * Calculate element distribution (fire, earth, air, water)
 */
function calculateElementDistribution(planets: unknown[]): { fire: number; earth: number; air: number; water: number } {
  const elementMap: Record<string, string> = {
    'Aries': 'fire', 'Leo': 'fire', 'Sagitario': 'fire',
    'Tauro': 'earth', 'Virgo': 'earth', 'Capricornio': 'earth',
    'Géminis': 'air', 'Libra': 'air', 'Acuario': 'air',
    'Cáncer': 'water', 'Escorpio': 'water', 'Piscis': 'water'
  };
  
  const counts = { fire: 0, earth: 0, air: 0, water: 0 };
  let total = 0;
  
  planets.forEach((planet: any) => {
    const element = elementMap[planet.sign];
    if (element) {
      counts[element as keyof typeof counts]++;
      total++;
    }
  });
  
  if (total === 0) {
    return { fire: 25, earth: 25, air: 25, water: 25 };
  }
  
  return {
    fire: Math.round((counts.fire / total) * 100),
    earth: Math.round((counts.earth / total) * 100),
    air: Math.round((counts.air / total) * 100),
    water: Math.round((counts.water / total) * 100)
  };
}

/**
 * Calculate modality distribution (cardinal, fixed, mutable)
 */
function calculateModalityDistribution(planets: unknown[]): { cardinal: number; fixed: number; mutable: number } {
  const modalityMap: Record<string, string> = {
    'Aries': 'cardinal', 'Cáncer': 'cardinal', 'Libra': 'cardinal', 'Capricornio': 'cardinal',
    'Tauro': 'fixed', 'Leo': 'fixed', 'Escorpio': 'fixed', 'Acuario': 'fixed',
    'Géminis': 'mutable', 'Virgo': 'mutable', 'Sagitario': 'mutable', 'Piscis': 'mutable'
  };
  
  const counts = { cardinal: 0, fixed: 0, mutable: 0 };
  let total = 0;
  
  planets.forEach((planet: any) => {
    const modality = modalityMap[planet.sign];
    if (modality) {
      counts[modality as keyof typeof counts]++;
      total++;
    }
  });
  
  if (total === 0) {
    return { cardinal: 33, fixed: 33, mutable: 34 };
  }
  
  return {
    cardinal: Math.round((counts.cardinal / total) * 100),
    fixed: Math.round((counts.fixed / total) * 100),
    mutable: Math.round((counts.mutable / total) * 100)
  };
}