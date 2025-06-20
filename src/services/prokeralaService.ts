// src/services/prokeralaService.ts
import axios from 'axios';

// Define and export types
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

// API access configuration
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

/**
 * Format timezone offset for API requests
 */
function getTimezoneOffset(timezone: string): string {
  try {
    // Mapeo básico de zonas horarias comunes
    const timezoneMap: { [key: string]: string } = {
      'Europe/Madrid': '+01:00',      // UTC+1 (puede ser UTC+2 en verano)
      'Europe/London': '+00:00',      // UTC+0
      'America/New_York': '-05:00',   // UTC-5
      'America/Los_Angeles': '-08:00', // UTC-8
      'Asia/Tokyo': '+09:00',         // UTC+9
      'Asia/Kolkata': '+05:30',       // UTC+5:30
    };
    
    return timezoneMap[timezone] || '+00:00';
  } catch (error) {
    console.warn('Error calculating timezone offset, using +00:00:', error);
    return '+00:00';
  }
}

/**
 * Get natal chart from Prokerala API using the correct endpoint
 */
import { createProkeralaParams } from '@/utils/dateTimeUtils';

export async function getNatalHoroscope(
  formattedDateTime: string,
  formattedCoordinates: string,
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

    // Build URLSearchParams using createProkeralaParams
    const params = createProkeralaParams({
      birthDate: formattedDateTime.substring(0, 10),
      birthTime: formattedDateTime.substring(11),
      latitude: parseFloat(formattedCoordinates.split(',')[0]),
      longitude: parseFloat(formattedCoordinates.split(',')[1]),
      houseSystem: options.houseSystem,
      aspectFilter: options.aspectFilter,
      language: options.language,
      ayanamsa: options.ayanamsa,
      birthTimeUnknown: options.birthTimeUnknown,
      birthTimeRectification: options.birthTimeRectification || 'none',
      orb: options.orb
    });

    const url = new URL(`${API_BASE_URL}/astrology/natal-chart`);
    url.search = params.toString();

    console.log('📡 URL completa:', url.toString());

    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('✅ Respuesta recibida:', response.status);

    return response.data;
  } catch (error) {
    console.error('❌ Error en getNatalHoroscope:', error);
    throw new Error('Failed to get natal chart from Prokerala');
  }
}

/**
 * Get planetary transits for a specific date
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
    
    const datetime = date.includes('T') ? date : `${date}T00:00:00`;
    const offset = getTimezoneOffset(timezone);
    const formattedDatetime = `${datetime}${offset}`;
    
    const url = new URL(`${API_BASE_URL}/astrology/planet-position`);
    url.searchParams.append('datetime', formattedDatetime);
    url.searchParams.append('coordinates', `${latitude},${longitude}`);
    url.searchParams.append('la', options.language || 'es');
    
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
 * Get astrological events for a date range
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

// EXPORTACIÓN CORREGIDA: Crear objeto con nombre antes de exportar
const prokeralaServiceObj = {
  getNatalHoroscope,
  getPlanetaryTransits,
  getAstronomicalEvents,
  convertProkeralaToNatalChart,
  getToken
};

export const prokeralaService = prokeralaServiceObj;