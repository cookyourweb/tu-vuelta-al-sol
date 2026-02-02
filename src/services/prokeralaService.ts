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
const CLIENT_ID = process.env.DEFPROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.DEFPROKERALA_CLIENT_SECRET;

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
      expiresIn: `${Math.floor((tokenCache.expires - now) / 60)} minutos`,
      creditsRemaining: response.data.credits_remaining || 'desconocido'
    });
    
    return tokenCache.token;
    
  } catch (error) {
    console.error('❌ Error obteniendo token de Prokerala:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor de Prokerala. Verifica tu conexión a internet.');
      }
    }
    
    throw new Error('Error inesperado al obtener token de autenticación');
  }
}

/**
 * ✅ FUNCIÓN PRINCIPAL: Obtener carta natal desde Prokerala
 */
export async function getNatalHoroscope(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezone: string,
  options: {
    houseSystem?: string;
    orb?: string;
    birthTimeRectification?: string;
    aspectFilter?: string;
    language?: string;
  } = {}
): Promise<NatalChart> {
  
  try {
    console.log('🔮 Solicitando carta natal a Prokerala...', {
      birthDate,
      birthTime,
      latitude,
      longitude,
      timezone
    });
    
    // Obtener token
    const token = await getToken();
    
    // Formatear datetime con offset correcto
    const datetime = birthTime 
      ? `${birthDate}T${birthTime}` 
      : `${birthDate}T12:00:00`;
    
    const offset = calculateTimezoneOffset(birthDate, timezone);
    const formattedDatetime = `${datetime}${offset}`;
    
    console.log('📅 Datetime formateado:', formattedDatetime);
    
    // Construir URL
    const url = new URL(`${API_BASE_URL}/astrology/natal-aspect-chart`);
    url.searchParams.append('profile[datetime]', formattedDatetime);
    url.searchParams.append('profile[coordinates]', formatCoordinates(latitude, longitude));
    url.searchParams.append('profile[birth_time_unknown]', 'false');
    url.searchParams.append('house_system', options.houseSystem || 'placidus');
    url.searchParams.append('orb', options.orb || 'default');
    url.searchParams.append('birth_time_rectification', options.birthTimeRectification || 'flat-chart');
    url.searchParams.append('aspect_filter', options.aspectFilter || 'all');
    url.searchParams.append('la', options.language || 'es');
    url.searchParams.append('ayanamsa', '0');
    
    console.log('🌐 URL completa:', url.toString());
    
    // Hacer petición
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      timeout: 30000 // 30 segundos
    });
    
    console.log('✅ Respuesta recibida de Prokerala');
    
    // Convertir respuesta
    const chart = convertProkeralaToNatalChart(
      response.data,
      latitude,
      longitude,
      timezone
    );
    
    console.log('✅ Carta natal procesada exitosamente');
    
    return chart;
    
  } catch (error) {
    console.error('❌ Error obteniendo carta natal de Prokerala:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          throw new Error(`Parámetros inválidos: ${JSON.stringify(data)}`);
        } else if (status === 401) {
          throw new Error('Error de autenticación. Verifica tus credenciales de Prokerala.');
        } else if (status === 403) {
          throw new Error('Acceso denegado. Verifica que tu cuenta tenga créditos suficientes.');
        } else if (status === 429) {
          throw new Error('Límite de peticiones excedido. Intenta más tarde.');
        }
        
        throw new Error(`Error ${status} de Prokerala API: ${JSON.stringify(data)}`);
      }
    }
    
    throw new Error('Error inesperado al obtener carta natal');
  }
}

/**
 * Calculate house position from planet longitude and house cusps
 */
function calculateHouseFromLongitude(
  planetLongitude: number,
  houses: ProkeralaApiHouse[]
): number {
  if (!houses || houses.length === 0) return 1;

  // Normalize longitude to 0-360
  const normLong = ((planetLongitude % 360) + 360) % 360;

  // Find which house the planet is in
  for (let i = 0; i < houses.length; i++) {
    const currentHouse = houses[i];
    const nextHouse = houses[(i + 1) % houses.length];

    const currentLong = ((currentHouse.longitude % 360) + 360) % 360;
    const nextLong = ((nextHouse.longitude % 360) + 360) % 360;

    // Handle houses that cross 0° Aries
    if (currentLong > nextLong) {
      if (normLong >= currentLong || normLong < nextLong) {
        return currentHouse.number;
      }
    } else {
      if (normLong >= currentLong && normLong < nextLong) {
        return currentHouse.number;
      }
    }
  }

  return 1; // Default to house 1
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

    // ✅ STEP 1: Process houses FIRST (before planets)
    const houses: House[] = (apiResponse.houses || []).map((house: ProkeralaApiHouse) => ({
      number: house.number,
      sign: getSignFromLongitude(house.longitude),  // ✅ Calcular desde longitude
      degree: Math.floor(house.longitude % 30),
      minutes: Math.floor((house.longitude % 1) * 60),
      longitude: house.longitude
    }));

    // ✅ STEP 2: Process planets WITH house calculation
    const planets: PlanetPosition[] = (apiResponse.planets || []).map((planet: ProkeralaApiPlanet) => {
      // Calculate house position if not provided by API
      let housePosition = planet.house || 1;
      if (!planet.house && houses.length === 12) {
        const normalizedPlanet = ((planet.longitude % 360) + 360) % 360;
        for (let i = 0; i < 12; i++) {
          const currentHouse = houses[i];
          const nextHouse = houses[(i + 1) % 12];
          const startLong = currentHouse.longitude!;
          const endLong = nextHouse.longitude!;

          if (endLong < startLong) {
            // House crosses 0° Aries
            if (normalizedPlanet >= startLong || normalizedPlanet < endLong) {
              housePosition = currentHouse.number;
              break;
            }
          } else {
            // Normal house
            if (normalizedPlanet >= startLong && normalizedPlanet < endLong) {
              housePosition = currentHouse.number;
              break;
            }
          }
        }
      }

      return {
        name: translatePlanetName(planet.name),
        sign: getSignFromLongitude(planet.longitude),  // ✅ Calcular desde longitude
        degree: Math.floor(planet.longitude % 30),
        minutes: Math.floor((planet.longitude % 1) * 60),
        retrograde: planet.is_retrograde || false,
        housePosition: housePosition,
        longitude: planet.longitude
      };
    });

    // Procesar aspectos
    const aspects: Aspect[] = (apiResponse.aspects || []).map((aspect: ProkeralaApiAspect) => ({
      planet1: translatePlanetName(aspect.planet1?.name || ''),
      planet2: translatePlanetName(aspect.planet2?.name || ''),
      type: translateAspectType(aspect.aspect?.name || aspect.type || 'conjunction'),
      orb: aspect.orb || 0,
      applying: aspect.is_applying || false
    }));

    // ✅ CORRECCIÓN CRÍTICA: Extraer Ascendente y Medio Cielo desde houses
    let ascendant;
    let midheaven;

    // Extraer Ascendente desde Casa 1
    if (houses && houses.length > 0) {
      const casa1 = houses[0];
      if (casa1 && casa1.longitude !== undefined) {
        ascendant = {
          sign: getSignFromLongitude(casa1.longitude),
          degree: Math.floor(casa1.longitude % 30),
          minutes: Math.floor((casa1.longitude % 1) * 60),
          longitude: casa1.longitude
        };
        console.log('✅ Ascendente extraído desde Casa 1:', {
          sign: ascendant.sign,
          degree: ascendant.degree,
          minutes: ascendant.minutes,
          longitude: casa1.longitude
        });
      }
    }

    // Extraer Medio Cielo desde Casa 10
    if (houses && houses.length >= 10) {
      const casa10 = houses[9]; // Índice 9 = Casa 10
      if (casa10 && casa10.longitude !== undefined) {
        midheaven = {
          sign: getSignFromLongitude(casa10.longitude),
          degree: Math.floor(casa10.longitude % 30),
          minutes: Math.floor((casa10.longitude % 1) * 60),
          longitude: casa10.longitude
        };
        console.log('✅ Medio Cielo extraído desde Casa 10:', {
          sign: midheaven.sign,
          degree: midheaven.degree,
          minutes: midheaven.minutes,
          longitude: casa10.longitude
        });
      }
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