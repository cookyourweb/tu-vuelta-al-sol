// src/services/prokeralaService.ts - VERSIÓN UNIFICADA Y CORREGIDA
// ✅ Basado en documentación oficial de Prokerala API
// ✅ URL de ejemplo que funciona: https://api.prokerala.com/v2/astrology/natal-chart?profile[datetime]=1974-02-10T07:30:00%2B01:00&profile[coordinates]=40.4168,-3.7038&birth_time_unknown=false&house_system=placidus&orb=default&birth_time_rectification=flat-chart&la=es&ayanamsa=0

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
  longitude?: number;
}

export interface House {
  number: number;
  sign: string;
  degree: number;
  minutes: number;
  longitude?: number;
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
    longitude?: number;
  };
  midheaven?: {
    sign: string;
    degree: number;
    minutes: number;
    longitude?: number;
  };
  latitude: number;
  longitude: number;
  timezone: string;
}

// Interfaces para la respuesta cruda de Prokerala API
interface ProkeralaApiPlanet {
  id?: number;
  name: string;
  sign?: string;
  longitude: number;
  latitude?: number;
  is_retrograde?: boolean;
  house?: number;
  speed?: number;
}

interface ProkeralaApiHouse {
  id?: number;
  number: number;
  sign?: string;
  longitude: number;
}

interface ProkeralaApiAspect {
  planet1?: { id?: number; name: string };
  planet2?: { id?: number; name: string };
  aspect?: { id?: number; name: string };
  type?: string;
  orb?: number;
  is_applying?: boolean;
}

interface ProkeralaApiAngle {
  id?: number;
  name?: string;
  sign?: string;
  longitude: number;
}

interface ProkeralaApiResponse {
  planets?: ProkeralaApiPlanet[];
  houses?: ProkeralaApiHouse[];
  aspects?: ProkeralaApiAspect[];
  ascendant?: ProkeralaApiAngle;
  mc?: ProkeralaApiAngle;
  datetime?: string;
  coordinates?: string;
  timezone?: string;
}

// ==========================================
// CONFIGURACIÓN DE API
// ==========================================

const API_BASE_URL = 'https://api.prokerala.com/v2';
const TOKEN_ENDPOINT = 'https://api.prokerala.com/token';
const CLIENT_ID = process.env.PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.PROKERALA_CLIENT_SECRET;

// Cache de token mejorado
interface TokenCache {
  token: string;
  expires: number;
  created: number;
}

let tokenCache: TokenCache | null = null;

// ==========================================
// FUNCIONES DE UTILIDAD MEJORADAS
// ==========================================

/**
 * ✅ FUNCIÓN CORREGIDA: Calcular timezone offset según fecha y zona horaria
 */
export function calculateTimezoneOffset(date: string, timezone: string): string {
  try {
    // Crear fecha para el cálculo
    const targetDate = new Date(date);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth(); // 0-11
    const day = targetDate.getDate();
    
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
      
      if (targetDate >= dstStart && targetDate < dstEnd) {
        return '+02:00'; // CEST (Central European Summer Time)
      } else {
        return '+01:00'; // CET (Central European Time)
      }
    }
    
    // Islas Canarias
    if (timezone === 'Atlantic/Canary') {
      const dstStart = getLastSunday(year, 2);
      const dstEnd = getLastSunday(year, 9);
      dstStart.setUTCHours(1, 0, 0, 0);
      dstEnd.setUTCHours(1, 0, 0, 0);
      
      if (targetDate >= dstStart && targetDate < dstEnd) {
        return '+01:00'; // WEST (Western European Summer Time)
      } else {
        return '+00:00'; // WET (Western European Time)
      }
    }
    
    // Zonas horarias fijas (sin cambio estacional)
    const staticTimezones: Record<string, string> = {
      'America/Argentina/Buenos_Aires': '-03:00',
      'America/Bogota': '-05:00',
      'America/Lima': '-05:00',
      'America/Caracas': '-04:00',
      'America/Mexico_City': '-06:00', // Simplificado
      'America/Santiago': '-04:00',    // Simplificado
      'Asia/Tokyo': '+09:00',
      'UTC': '+00:00',
      'GMT': '+00:00'
    };
    
    if (staticTimezones[timezone]) {
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
 * ✅ FUNCIÓN MEJORADA: Formatear coordenadas con precisión óptima para Prokerala
 */
export function formatCoordinates(lat: number, lng: number): string {
  // Prokerala acepta hasta 4 decimales de precisión
  const latFixed = Math.round(lat * 10000) / 10000;
  const lngFixed = Math.round(lng * 10000) / 10000;
  
  console.log(`🌍 Coordenadas formateadas: ${latFixed},${lngFixed} (precisión: 4 decimales)`);
  return `${latFixed},${lngFixed}`;
}

/**
 * ✅ FUNCIÓN MEJORADA: Obtener token de Prokerala con cache inteligente
 */
export async function getToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  
  // Verificar cache válido (con margen de 60 segundos)
  if (tokenCache && tokenCache.expires > now + 60) {
    console.log('✅ Usando token cacheado');
    return tokenCache.token;
  }
  
  // Verificar credenciales
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('❌ Credenciales de Prokerala no configuradas. Verifica PROKERALA_CLIENT_ID y PROKERALA_CLIENT_SECRET');
  }
  
  try {
    console.log('🔑 Solicitando nuevo token a Prokerala...');
    
    // Solicitar token
    const response = await axios.post(
      TOKEN_ENDPOINT,
      new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        timeout: 10000 // 10 segundos timeout
      }
    );
    
    if (!response.data || !response.data.access_token) {
      throw new Error('Respuesta inválida del servidor de tokens');
    }
    
    // Almacenar en cache
    tokenCache = {
      token: response.data.access_token,
      expires: now + (response.data.expires_in || 3600),
      created: now
    };
    
    console.log('✅ Token obtenido exitosamente', {
      expires_in: response.data.expires_in,
      token_preview: tokenCache.token.substring(0, 20) + '...'
    });
    
    return tokenCache.token;
    
  } catch (error) {
    console.error('❌ Error obteniendo token de Prokerala:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Respuesta del servidor:', error.response.data);
        throw new Error(`Error de autenticación: ${error.response.status} - ${error.response.data?.error || 'Error desconocido'}`);
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor de Prokerala. Verifica tu conexión a internet.');
      }
    }
    
    throw new Error('Error de autenticación con la API de Prokerala');
  }
}

// ==========================================
// FUNCIÓN PRINCIPAL PARA CARTA NATAL
// ==========================================

/**
 * ✅ FUNCIÓN PRINCIPAL CORREGIDA: Obtener carta natal de Prokerala
 * Usa el formato EXACTO de la documentación oficial
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
    console.log('🌟 Generando carta natal con Prokerala API...');
    
    // 1. Obtener token
    const token = await getToken();
    
    // 2. Procesar tiempo de nacimiento
    let timeWithSeconds = birthTime || '12:00:00';
    if (timeWithSeconds.length === 5) {
      timeWithSeconds = timeWithSeconds + ':00';
    }
    
    // 3. Calcular offset de timezone correcto
    const offset = calculateTimezoneOffset(birthDate, timezone);
    const datetime = `${birthDate}T${timeWithSeconds}${offset}`;
    
    // 4. Formatear coordenadas
    const coordinates = formatCoordinates(latitude, longitude);
    
    console.log('📋 Parámetros procesados:', {
      datetime,
      coordinates,
      timezone,
      offset,
      originalBirthTime: birthTime
    });
    
    // 5. Preparar parámetros según documentación oficial
    const params = {
      'profile[datetime]': datetime,              // ✅ Formato profile[] requerido
      'profile[coordinates]': coordinates,        // ✅ Formato profile[] requerido
      'birth_time_unknown': options.birthTimeUnknown ? 'true' : 'false',
      'house_system': options.houseSystem || 'placidus',
      'orb': options.orb || 'default',
      'birth_time_rectification': options.birthTimeRectification || 'flat-chart',
      'aspect_filter': options.aspectFilter || 'all',
      'la': options.language || 'es',
      'ayanamsa': options.ayanamsa || '0'         // ✅ CRÍTICO: 0=Tropical, 1=Sideral
    };
    
    // 6. Construir URL
    const url = new URL(`${API_BASE_URL}/astrology/natal-chart`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    console.log('🌐 URL de Prokerala:', url.toString());
    
    // 7. Realizar petición con token en header
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,        // ✅ Token en header (NO en URL)
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 segundos timeout
    });
    
    console.log('✅ Respuesta recibida de Prokerala:', {
      status: response.status,
      planetsCount: response.data?.planets?.length || 0,
      housesCount: response.data?.houses?.length || 0,
      aspectsCount: response.data?.aspects?.length || 0,
      hasAscendant: !!response.data?.ascendant,
      hasMC: !!response.data?.mc
    });
    
    // 8. Validar respuesta
    if (!response.data) {
      throw new Error('Respuesta vacía de Prokerala API');
    }
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error en getNatalHoroscope:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Error de Prokerala API:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        if (error.response.status === 401) {
          // Limpiar cache de token si hay error de autenticación
          tokenCache = null;
          throw new Error('Error de autenticación. Verifica tus credenciales de Prokerala.');
        } else if (error.response.status === 429) {
          throw new Error('Límite de rate exceeded. Intenta nuevamente en unos minutos.');
        } else if (error.response.status >= 500) {
          throw new Error('Error del servidor de Prokerala. Intenta nuevamente más tarde.');
        }
      } else if (error.request) {
        throw new Error('No se pudo conectar con Prokerala. Verifica tu conexión a internet.');
      }
    }
    
    throw new Error(`Error generando carta natal: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

/**
 * Convierte la respuesta de Prokerala API a formato interno NatalChart
 */
export function convertProkeralaToNatalChart(
  apiResponse: ProkeralaApiResponse,
  latitude: number,
  longitude: number,
  timezone: string
): NatalChart {
  try {
    console.log('🔄 Convirtiendo datos de Prokerala a formato interno...');
    
    // Procesar planetas
    const planets: PlanetPosition[] = (apiResponse.planets || []).map((planet: ProkeralaApiPlanet) => ({
      name: translatePlanetName(planet.name),
      sign: planet.sign || getSignFromLongitude(planet.longitude),
      degree: Math.floor(planet.longitude % 30),
      minutes: Math.floor((planet.longitude % 1) * 60),
      retrograde: planet.is_retrograde || false,
      housePosition: planet.house || 1,
      longitude: planet.longitude
    }));

    // Procesar casas
    const houses: House[] = (apiResponse.houses || []).map((house: ProkeralaApiHouse) => ({
      number: house.number,
      sign: house.sign || getSignFromLongitude(house.longitude),
      degree: Math.floor(house.longitude % 30),
      minutes: Math.floor((house.longitude % 1) * 60),
      longitude: house.longitude
    }));

    // Procesar aspectos
    const aspects: Aspect[] = (apiResponse.aspects || []).map((aspect: ProkeralaApiAspect) => ({
      planet1: translatePlanetName(aspect.planet1?.name || ''),
      planet2: translatePlanetName(aspect.planet2?.name || ''),
      type: translateAspectType(aspect.aspect?.name || aspect.type || 'conjunction'),
      orb: aspect.orb || 0,
      applying: aspect.is_applying || false
    }));

    // Procesar ángulos importantes
    let ascendant;
    if (apiResponse.ascendant) {
      ascendant = {
        sign: apiResponse.ascendant.sign || getSignFromLongitude(apiResponse.ascendant.longitude),
        degree: Math.floor(apiResponse.ascendant.longitude % 30),
        minutes: Math.floor((apiResponse.ascendant.longitude % 1) * 60),
        longitude: apiResponse.ascendant.longitude
      };
    }

    let midheaven;
    if (apiResponse.mc) {
      midheaven = {
        sign: apiResponse.mc.sign || getSignFromLongitude(apiResponse.mc.longitude),
        degree: Math.floor(apiResponse.mc.longitude % 30),
        minutes: Math.floor((apiResponse.mc.longitude % 1) * 60),
        longitude: apiResponse.mc.longitude
      };
    }

    const chart: NatalChart = {
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
    
    console.log('✅ Conversión completada:', {
      planetsProcessed: planets.length,
      housesProcessed: houses.length,
      aspectsProcessed: aspects.length,
      hasAscendant: !!ascendant,
      hasMidheaven: !!midheaven
    });
    
    return chart;
    
  } catch (error) {
    console.error('❌ Error convirtiendo datos de Prokerala:', error);
    throw new Error('Error procesando datos astrológicos');
  }
}

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

/**
 * Obtener signo zodiacal desde longitud eclíptica
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

/**
 * Traducir nombres de planetas de inglés a español
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
    'Lilith': 'Lilith',
    'Part of Fortune': 'Parte de la Fortuna'
  };
  
  return translations[englishName] || englishName;
}

/**
 * Traducir tipos de aspectos
 */
function translateAspectType(englishType: string): string {
  const translations: Record<string, string> = {
    'Conjunction': 'conjunction',
    'Opposition': 'opposition',
    'Trine': 'trine',
    'Square': 'square',
    'Sextile': 'sextile',
    'Quincunx': 'quincunx',
    'Semi-square': 'semisquare',
    'Sesquiquadrate': 'sesquiquadrate',
    'Semisextile': 'semisextile'
  };
  
  return translations[englishType] || englishType.toLowerCase();
}

// ==========================================
// OTRAS FUNCIONES DE API
// ==========================================

/**
 * ✅ Obtener tránsitos planetarios
 */
export async function getPlanetaryTransits(
  date: string,
  latitude: number,
  longitude: number,
  timezone: string,
  options: { language?: string } = {}
): Promise<ProkeralaApiResponse> {
  
  try {
    const token = await getToken();
    
    const datetime = date.includes('T') ? date : `${date}T12:00:00`;
    const offset = calculateTimezoneOffset(date, timezone);
    const formattedDatetime = `${datetime}${offset}`;
    
    const url = new URL(`${API_BASE_URL}/astrology/planet-position`);
    url.searchParams.append('profile[datetime]', formattedDatetime);
    url.searchParams.append('profile[coordinates]', formatCoordinates(latitude, longitude));
    url.searchParams.append('la', options.language || 'es');
    url.searchParams.append('ayanamsa', '0');
    
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      timeout: 30000
    });
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error obteniendo tránsitos planetarios:', error);
    throw new Error('Error obteniendo tránsitos planetarios');
  }
}

// ==========================================
// EXPORTACIONES
// ==========================================


export const prokeralaService = {
  getNatalHoroscope,
  getPlanetaryTransits,
  convertProkeralaToNatalChart,
  getToken,
  calculateTimezoneOffset,
  formatCoordinates
};