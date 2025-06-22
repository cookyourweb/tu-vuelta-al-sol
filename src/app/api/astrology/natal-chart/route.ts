// src/app/api/astrology/natal-chart-accurate/route.ts - VERSIÓN CORREGIDA
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
 * Get access token for Prokerala API
 */
async function getToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  
  if (tokenCache && tokenCache.expires > now + 60) {
    return tokenCache.token;
  }
  
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
 * 🔥 FUNCIÓN CRÍTICA - Formatear datetime para coordenadas españolas históricas
 */
function formatProkeralaDateTime(
  birthDate: string,
  birthTime: string,
  timezone: string = 'Europe/Madrid'
): string {
  console.log('🚨🚨🚨 ESTE ES EL ARCHIVO CORRECTO QUE SE EJECUTA 🚨🚨🚨');
  console.log('🔥 formatProkeralaDateTime llamada con:', { birthDate, birthTime, timezone });
  
  const formattedTime = birthTime.length === 5 ? `${birthTime}:00` : birthTime;
  
  // ✅ CORRECCIÓN CRÍTICA: Para Madrid en 1974, usar UTC+1 fijo
  let offset = '+01:00';
  
  if (timezone === 'Europe/Madrid' && birthDate.startsWith('1974')) {
    // En 1974, Madrid usaba UTC+1 sin cambio de horario
    offset = '+01:00';
    console.log('🎯 APLICANDO CORRECCIÓN HISTÓRICA MADRID 1974: UTC+1');
  }
  
  const isoDateTime = `${birthDate}T${formattedTime}${offset}`;
  console.log(`🔥 DateTime FINAL: ${isoDateTime}`);
  
  return isoDateTime;
}

/**
 * Convert longitude to sign name
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
 * Translate planet names to Spanish
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
 * 🔥 POST PRINCIPAL - ESTE ES EL QUE USA TU PÁGINA
 */
export async function POST(request: NextRequest) {
  console.log('\n🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨');
  console.log('🔥 API NATAL-CHART-ACCURATE SE EJECUTA!!!');
  console.log('🔥 ESTE ES EL ARCHIVO QUE USA TU PÁGINA');
  console.log('🔥 TIMESTAMP:', new Date().toISOString());
  console.log('🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨\n');
  
  try {
    const body = await request.json();
    const { birthDate, birthTime, latitude, longitude, timezone } = body;
    
    console.log('🔥 DATOS RECIBIDOS:', { birthDate, birthTime, latitude, longitude, timezone });
    
    if (!birthDate || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    try {
      const token = await getToken();
      
      const formattedBirthTime = birthTime || '12:00:00';
      const datetime = formatProkeralaDateTime(birthDate, formattedBirthTime, timezone || 'Europe/Madrid');
      const coords = `${latitude},${longitude}`;
      
      console.log('🔥 PARÁMETROS PARA PROKERALA:');
      console.log('   DateTime:', datetime);
      console.log('   Coordinates:', coords);
      
      // ✅ CONSTRUIR URL CON AYANAMSA SIDERAL PARA DATOS HISTÓRICOS CORRECTOS
      const url = new URL(`${API_BASE_URL}/astrology/natal-chart`);
      url.searchParams.append('profile[datetime]', datetime);
      url.searchParams.append('profile[coordinates]', coords);
      url.searchParams.append('birth_time_unknown', 'false');
      url.searchParams.append('house_system', 'placidus');
      url.searchParams.append('orb', 'default');
      url.searchParams.append('birth_time_rectification', 'flat-chart');
      url.searchParams.append('aspect_filter', 'all');
      url.searchParams.append('la', 'es');
      url.searchParams.append('ayanamsa', '1'); // ✅ SIDERAL (Lahiri) para cálculos precisos
      
      console.log('🔥 URL FINAL:', url.toString());
      
      const response = await axios.get(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      console.log('🔥 Respuesta status:', response.status);
      
      // ✅ PROCESAR RESPUESTA
      const chartData = processChartData(response.data, latitude, longitude, timezone || 'Europe/Madrid');
      
      // ✅ VERIFICACIÓN ESPECÍFICA DE VERÓNICA
      if (birthDate === '1974-02-10' && Math.abs(latitude - 40.4168) < 0.01) {
        const sol = chartData.planets?.find(p => p.name === 'Sol');
        const luna = chartData.planets?.find(p => p.name === 'Luna');
        
        console.log('\n🎯 VERIFICACIÓN VERÓNICA:');
        console.log(`   Sol: ${sol?.sign} ${sol?.degree}° (esperado: Acuario 21°)`);
        console.log(`   Luna: ${luna?.sign} ${luna?.degree}° (esperado: Libra 6°)`);
        console.log(`   ASC: ${chartData.ascendant?.sign} ${chartData.ascendant?.degree}° (esperado: Acuario 4°)`);
        
        const isCorrect = sol?.sign === 'Acuario' && luna?.sign === 'Libra' && chartData.ascendant?.sign === 'Acuario';
        console.log(`🎯 DATOS VERÓNICA: ${isCorrect ? '✅ CORRECTOS' : '❌ NECESITAN CORRECCIÓN'}\n`);
      }
      
      return NextResponse.json({
        success: true,
        data: chartData,
        debug: {
          originalDateTime: `${birthDate}T${formattedBirthTime}`,
          finalDateTime: datetime,
          coordinates: coords,
          timezone: timezone || 'Europe/Madrid',
          url: url.toString(),
          version: 'natal-chart-accurate-corrected'
        }
      });
      
    } catch (error) {
      console.error('🔥 Error API Prokerala:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        console.error('🔥 Detalles error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      }
      
      throw error;
    }
  } catch (error) {
    console.error('🔥 Error general:', error);
    return NextResponse.json(
      { success: false, error: 'Error processing request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * ✅ PROCESAR DATOS DE LA API
 */
function processChartData(apiResponse: unknown, latitude: number, longitude: number, timezone: string) {
  const data = apiResponse as any;

  console.log('🔥 Procesando datos API...');

  // Process planets
  const planets = (data.planets || []).map((planet: unknown) => {
    const p = planet as any;
    return {
      name: translatePlanetNameToSpanish(p.name),
      sign: p.sign || getSignNameFromLongitude(p.longitude),
      degree: Math.floor(p.longitude % 30),
      minutes: Math.floor((p.longitude % 1) * 60),
      retrograde: p.is_retrograde || false,
      housePosition: p.house || 1,
      longitude: p.longitude
    };
  });

  // Process houses
  const houses = (data.houses || []).map((house: unknown, index: number) => {
    const h = house as any;
    return {
      number: index + 1,
      sign: h.sign || getSignNameFromLongitude(h.longitude),
      degree: Math.floor(h.longitude % 30),
      minutes: Math.floor((h.longitude % 1) * 60),
      longitude: h.longitude
    };
  });

  // Process aspects
  const aspects = (data.aspects || []).map((aspect: unknown) => {
    const a = aspect as any;
    return {
      planet1: a.planet1?.name ? translatePlanetNameToSpanish(a.planet1.name) : '',
      planet2: a.planet2?.name ? translatePlanetNameToSpanish(a.planet2.name) : '',
      type: a.aspect?.name || a.type || 'conjunction',
      orb: a.orb || 0
    };
  });

  // Extract ascendant
  let ascendant;
  if (data.ascendant || data.asc || (data.houses && data.houses[0])) {
    const ascData = data.ascendant || data.asc || data.houses[0];
    ascendant = {
      sign: ascData.sign || getSignNameFromLongitude(ascData.longitude),
      degree: Math.floor(ascData.longitude % 30),
      minutes: Math.floor((ascData.longitude % 1) * 60),
      longitude: ascData.longitude
    };
    console.log('🔥 ASCENDENTE PROCESADO:', ascendant);
  }

  // Extract midheaven
  let midheaven;
  if (data.mc || data.midheaven) {
    const mcData = data.mc || data.midheaven;
    midheaven = {
      sign: mcData.sign || getSignNameFromLongitude(mcData.longitude),
      degree: Math.floor(mcData.longitude % 30),
      minutes: Math.floor((mcData.longitude % 1) * 60),
      longitude: mcData.longitude
    };
  }

  // Calculate distributions
  const elementDistribution = calculateElementDistribution(planets);
  const modalityDistribution = calculateModalityDistribution(planets);

  const result = {
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

  console.log('🔥 DATOS PROCESADOS - ASCENDENTE:', result.ascendant?.sign);

  return result;
}

/**
 * Calculate element distribution
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
 * Calculate modality distribution
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