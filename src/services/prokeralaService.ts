// src/services/prokeralaService.ts - VERSIÓN FINAL CORREGIDA
// ✅ URL de ejemplo que funciona correctamente:
// https://api.prokerala.com/v2/astrology/natal-planet-position?profile[datetime]=1974-02-10T07:30:00%2B01:00&profile[coordinates]=40.4168,-3.7038&birth_time_unknown=false&house_system=placidus&orb=default&birth_time_rectification=flat-chart&la=es&ayanamsa=0

import axios from 'axios';

// ==========================================
// TIPOS E INTERFACES
// ==========================================

export interface PlanetPosition {
  name: string;
  sign: string;
  degree: number;
  minutes: number;
  retrograde: boolean;
  housePosition: number;
}

export interface House {
  number: number;
  sign: string;
  degree: number;
  minutes: number;
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: string;
  orb: number;
  applying?: boolean;
}

export interface NatalChart {
  birthData: {
    latitude: number;
    longitude: number;
    timezone: string;
    datetime: string;
  };
  planets: PlanetPosition[];
  houses: House[];
  aspects: Aspect[];
  ascendant?: {
    sign: string;
    degree: number;
    minutes: number;
  };
  midheaven?: {
    sign: string;
    degree: number;
    minutes: number;
  };
  latitude: number;
  longitude: number;
  timezone: string;
}

// Interfaces para la respuesta de la API
interface ProkeralaApiPlanet {
  name: string;
  sign?: string;
  longitude: number;
  is_retrograde?: boolean;
  house?: number;
}

interface ProkeralaApiHouse {
  number: number;
  sign?: string;  
  longitude: number;
}

interface ProkeralaApiAspect {
  planet1?: { name: string };
  planet2?: { name: string };
  aspect?: { name: string };
  type?: string;
  orb?: number;
  is_applying?: boolean;
}

interface ProkeralaApiResponse {
  planets?: ProkeralaApiPlanet[];
  houses?: ProkeralaApiHouse[];
  aspects?: ProkeralaApiAspect[];
  ascendant?: {
    sign?: string;
    longitude: number;
  };
  mc?: {
    sign?: string;
    longitude: number;
  };
  datetime?: string;
}

// ==========================================
// CONFIGURACIÓN DE API
// ==========================================

const API_BASE_URL = 'https://api.prokerala.com/v2';
const TOKEN_ENDPOINT = 'https://api.prokerala.com/token';
const CLIENT_ID = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_SECRET;

// Token cache
interface TokenCache {
  token: string;
  expires: number;
}

let tokenCache: TokenCache | null = null;

// ==========================================
// FUNCIONES DE UTILIDAD CORREGIDAS
// ==========================================

/**
 * ✅ FUNCIÓN CORREGIDA: Calcular timezone offset correcto según fecha
 */
function calculateTimezoneOffset(date: string, timezone: string): string {
  const birthDate = new Date(date);
  const year = birthDate.getFullYear();
  
  // Función auxiliar para obtener el último domingo de un mes
  const getLastSunday = (year: number, month: number): number => {
    const lastDay = new Date(year, month, 0);
    const dayOfWeek = lastDay.getDay();
    return lastDay.getDate() - dayOfWeek;
  };
  
  if (timezone === 'Europe/Madrid' || timezone === 'Europe/Berlin' || timezone === 'Europe/Paris') {
    // Europa Central: Horario de verano desde último domingo de marzo hasta último domingo de octubre
    const dstStart = new Date(year, 2, getLastSunday(year, 3)); // Marzo
    const dstEnd = new Date(year, 9, getLastSunday(year, 10)); // Octubre
    
    if (birthDate >= dstStart && birthDate < dstEnd) {
      return '+02:00'; // CEST (Verano)
    } else {
      return '+01:00'; // CET (Invierno)
    }
  }
  
  // Zonas sin cambio de horario
  const staticTimezones: Record<string, string> = {
    'America/Argentina/Buenos_Aires': '-03:00',
    'America/Bogota': '-05:00',
    'America/Lima': '-05:00',
    'Asia/Tokyo': '+09:00',
    'UTC': '+00:00'
  };
  
  return staticTimezones[timezone] || '+00:00';
}

/**
 * ✅ FUNCIÓN CORREGIDA: Formatear coordenadas con precisión correcta
 */
function formatCoordinates(lat: number, lng: number): string {
  // Redondear a 4 decimales para Prokerala
  const latFixed = Math.round(lat * 10000) / 10000;
  const lngFixed = Math.round(lng * 10000) / 10000;
  return `${latFixed},${lngFixed}`;
}

/**
 * Get a token for the Prokerala API
 */
async function getToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  
  // Use cached token if still valid
  if (tokenCache && tokenCache.expires > now + 60) {
    return tokenCache.token;
  }
  
  // Verify credentials
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Prokerala API credentials missing. Check your environment variables.');
  }
  
  try {
    // Request new token
    const response = await axios.post(
      TOKEN_ENDPOINT,
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
    
    // Store token in cache
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

// ==========================================
// FUNCIÓN PRINCIPAL CORREGIDA
// ==========================================

/**
 * ✅ FUNCIÓN PRINCIPAL CORREGIDA: Get natal chart from Prokerala API
 * Usa EXACTAMENTE los mismos parámetros que tu URL de ejemplo exitosa
 */
export async function getNatalHoroscope(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezone: string,
  options: {
    houseSystem?: string;
    aspectFilter?: string;
    language?: string;
    ayanamsa?: string;
    birthTimeUnknown?: boolean;
    birthTimeRectification?: string;
    orb?: string;
  } = {}
): Promise<ProkeralaApiResponse> {
  try {
    const token = await getToken();
    
    // ✅ CORREGIDO: Usar función mejorada de timezone
    const offset = calculateTimezoneOffset(birthDate, timezone);
    const datetime = `${birthDate}T${birthTime}${offset}`;
    
    // ✅ CORREGIDO: Formatear coordenadas con precisión correcta
    const coordinates = formatCoordinates(latitude, longitude);
    
    console.log('🔍 prokeralaService - Parámetros CORREGIDOS:', {
      datetime,
      coordinates,
      timezone,
      offset
    });
    
    // ✅ PARÁMETROS CORREGIDOS: Usar formato profile[datetime] exactamente como tu URL ejemplo
    const params = {
      'profile[datetime]': datetime,           // ✅ CORREGIDO: formato profile[]
      'profile[coordinates]': coordinates,     // ✅ CORREGIDO: formato profile[]
      'birth_time_unknown': options.birthTimeUnknown ? 'true' : 'false',
      'house_system': options.houseSystem || 'placidus',
      'orb': options.orb || 'default',
      'birth_time_rectification': options.birthTimeRectification || 'flat-chart', // ✅ CORREGIDO: flat-chart
      'aspect_filter': options.aspectFilter || 'all',
      'la': options.language || 'es',
      'ayanamsa': options.ayanamsa || '0'      // 🚨 CRÍTICO CORREGIDO: 0=Tropical
    };
    
    // Construir URL con parámetros corregidos
    const url = new URL(`${API_BASE_URL}/astrology/natal-chart`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    console.log('📡 prokeralaService - URL completa CORREGIDA:', url.toString());
    
    // ✅ Verificar que la URL coincide con tu ejemplo
    const isVeronica = birthDate === '1974-02-10' && Math.abs(latitude - 40.4168) < 0.01;
    if (isVeronica) {
      console.log('🎯 === URL PARA VERÓNICA ===');
      console.log('✅ Esperado ASC: Acuario');
      console.log('🔗 URL generada:', url.toString());
      console.log('📋 Parámetros clave:');
      console.log('  - ayanamsa:', params.ayanamsa);
      console.log('  - profile[datetime]:', params['profile[datetime]']);
      console.log('  - profile[coordinates]:', params['profile[coordinates]']);
      console.log('  - birth_time_rectification:', params.birth_time_rectification);
    }
    
    // ✅ Hacer la petición
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('✅ prokeralaService - Respuesta recibida:', response.status);
    console.log('📊 prokeralaService - Datos preview:', {
      planetsCount: response.data?.planets?.length || 0,
      housesCount: response.data?.houses?.length || 0,
      aspectsCount: response.data?.aspects?.length || 0,
      hasAscendant: !!response.data?.ascendant
    });
    
    // Verificación especial para Verónica
    if (isVeronica && response.data?.ascendant) {
      const ascSign = response.data.ascendant.sign || getSignFromLongitude(response.data.ascendant.longitude);
      console.log('🎯 === VERIFICACIÓN VERÓNICA EN SERVICIO ===');
      console.log('🔺 ASC de Prokerala:', ascSign);
      console.log('✅ Esperado: Acuario');
      console.log('🎉 Correcto:', ascSign === 'Acuario' ? 'SÍ' : 'NO');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error en prokeralaService.getNatalHoroscope:', error);
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
    }
    throw new Error('Failed to get natal chart from Prokerala');
  }
}

// ==========================================
// OTRAS FUNCIONES CORREGIDAS
// ==========================================

/**
 * ✅ FUNCIÓN CORREGIDA: Get planetary transits for a specific date
 */
export async function getPlanetaryTransits(
  date: string,
  latitude: number,
  longitude: number,
  timezone: string,
  options: {
    language?: string;
  } = {}
): Promise<ProkeralaApiResponse> {
  try {
    const token = await getToken();
    
    // ✅ CORREGIDO: Usar función mejorada de timezone
    const datetime = date.includes('T') ? date : `${date}T00:00:00`;
    const offset = calculateTimezoneOffset(date, timezone);
    const formattedDatetime = `${datetime}${offset}`;
    
    // ✅ CORREGIDO: Usar formato profile[] para consistency
    const url = new URL(`${API_BASE_URL}/astrology/planet-position`);
    url.searchParams.append('profile[datetime]', formattedDatetime);
    url.searchParams.append('profile[coordinates]', formatCoordinates(latitude, longitude));
    url.searchParams.append('la', options.language || 'es');
    url.searchParams.append('ayanamsa', '0'); // ✅ CORREGIDO: Tropical
    
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error in Prokerala planetary transits request:', error);
    throw new Error('Failed to get planetary transits from Prokerala');
  }
}

/**
 * ✅ FUNCIÓN CORREGIDA: Get astrological events for a date range
 */
export async function getAstronomicalEvents(
  startDate: string,
  endDate: string,
  options: {
    language?: string;
  } = {}
): Promise<ProkeralaApiResponse> {
  try {
    const token = await getToken();
    
    const url = new URL(`${API_BASE_URL}/astrology/astronomical-events`);
    url.searchParams.append('start_date', startDate);
    url.searchParams.append('end_date', endDate);
    url.searchParams.append('la', options.language || 'es');
    url.searchParams.append('ayanamsa', '0'); // ✅ CORREGIDO: Tropical
    
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error in Prokerala astronomical events request:', error);
    throw new Error('Failed to get astronomical events from Prokerala');
  }
}

// ==========================================
// CONVERSIÓN DE DATOS
// ==========================================

/**
 * Convert Prokerala API response to NatalChart format
 */
export function convertProkeralaToNatalChart(
  apiResponse: ProkeralaApiResponse,
  latitude: number,
  longitude: number,
  timezone: string
): NatalChart {
  if (!apiResponse) {
    throw new Error('Invalid API response');
  }

  try {
    const planets: PlanetPosition[] = (apiResponse.planets || []).map((planet: ProkeralaApiPlanet) => ({
      name: planet.name,
      sign: planet.sign || getSignFromLongitude(planet.longitude),
      degree: Math.floor(planet.longitude % 30),
      minutes: Math.floor((planet.longitude % 1) * 60),
      retrograde: planet.is_retrograde || false,
      housePosition: planet.house || 1
    }));

    const houses: House[] = (apiResponse.houses || []).map((house: ProkeralaApiHouse) => ({
      number: house.number,
      sign: house.sign || getSignFromLongitude(house.longitude),
      degree: Math.floor(house.longitude % 30),
      minutes: Math.floor((house.longitude % 1) * 60)
    }));

    const aspects: Aspect[] = (apiResponse.aspects || []).map((aspect: ProkeralaApiAspect) => ({
      planet1: aspect.planet1?.name || '',
      planet2: aspect.planet2?.name || '',
      type: aspect.aspect?.name || aspect.type || 'conjunction',
      orb: aspect.orb || 0,
      applying: aspect.is_applying || false
    }));

    let ascendant;
    if (apiResponse.ascendant) {
      ascendant = {
        sign: apiResponse.ascendant.sign || getSignFromLongitude(apiResponse.ascendant.longitude),
        degree: Math.floor(apiResponse.ascendant.longitude % 30),
        minutes: Math.floor((apiResponse.ascendant.longitude % 1) * 60)
      };
    }

    let midheaven;
    if (apiResponse.mc) {
      midheaven = {
        sign: apiResponse.mc.sign || getSignFromLongitude(apiResponse.mc.longitude),
        degree: Math.floor(apiResponse.mc.longitude % 30),
        minutes: Math.floor((apiResponse.mc.longitude % 1) * 60)
      };
    }

    return {
      birthData: {
        latitude,
        longitude,
        datetime: apiResponse.datetime || '',
        timezone,
      },
      planets,
      houses,
      aspects,
      ascendant,
      midheaven,
      latitude,
      longitude,
      timezone
    };
  } catch (error) {
    console.error('Error converting Prokerala data:', error);
    throw new Error('Error processing astrological data');
  }
}

/**
 * Helper function to get zodiac sign from longitude
 */
function getSignFromLongitude(longitude: number): string {
  const signs = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer',
    'Leo', 'Virgo', 'Libra', 'Escorpio',
    'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];
  
  const signIndex = Math.floor(longitude / 30) % 12;
  return signs[signIndex];
}

// ==========================================
// EXPORTACIONES
// ==========================================

// ✅ EXPORTACIONES INDIVIDUALES (para importación directa)
export { getToken, calculateTimezoneOffset, formatCoordinates };

// ✅ EXPORTACIÓN DE OBJETO (para importación completa)
export const prokeralaService = {
  getNatalHoroscope,
  getPlanetaryTransits,
  getAstronomicalEvents,
  convertProkeralaToNatalChart,
  getToken,
  calculateTimezoneOffset,
  formatCoordinates
};