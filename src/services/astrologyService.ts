// src/services/astrologyService.ts
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

// API access configuration
const API_BASE_URL = 'https://api.prokerala.com/v2';
const TOKEN_ENDPOINT = 'https://api.prokerala.com/token';
const CLIENT_ID = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_SECRET;

// Token cache
let tokenCache: { token: string; expires: number } | null = null;

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
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short'
    });
    
    const formatted = formatter.format(date);
    const matches = formatted.match(/GMT([+-]\d+)/);
    
    if (matches && matches[1]) {
      const offset = matches[1];
      // Format to ensure +/-HH:MM format
      if (offset.length === 3) {
        return `${offset}:00`;
      }
      return offset.replace(/(\d{2})(\d{2})/, '$1:$2');
    }
    
    // Default to UTC if we can't determine
    return '+00:00';
  } catch (error) {
    console.warn('Error calculating timezone offset, using UTC:', error);
    return '+00:00';
  }
}

/**
 * Get natal horoscope from Prokerala API
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
  } = {}
): Promise<any> {
  try {
    const token = await getToken();
    
    // Format datetime with timezone
    const offset = getTimezoneOffset(timezone);
    const datetime = `${birthDate}T${birthTime}${offset}`;
    
    // Build URL with correct parameters format
    const url = new URL(`${API_BASE_URL}/astrology/natal-chart`);
    url.searchParams.append('profile[datetime]', datetime);
    url.searchParams.append('profile[coordinates]', `${latitude},${longitude}`);
    url.searchParams.append('birth_time_unknown', 'false');
    url.searchParams.append('house_system', options.houseSystem || 'placidus');
    url.searchParams.append('orb', 'default');
    url.searchParams.append('birth_time_rectification', 'flat-chart');
    url.searchParams.append('aspect_filter', options.aspectFilter || 'all');
    url.searchParams.append('la', options.language || 'es');
    url.searchParams.append('ayanamsa', '0');
    
    console.log('Prokerala natal chart request URL:', url.toString());
    
    // Make the request
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error in Prokerala natal chart request:', error);
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
): Promise<any> {
  try {
    const token = await getToken();
    
    // Format datetime
    const datetime = date.includes('T') ? date : `${date}T00:00:00`;
    const offset = getTimezoneOffset(timezone);
    const formattedDatetime = `${datetime}${offset}`;
    
    // Build URL
    const url = new URL(`${API_BASE_URL}/astrology/planet-position`);
    url.searchParams.append('datetime', formattedDatetime);
    url.searchParams.append('coordinates', `${latitude},${longitude}`);
    url.searchParams.append('la', options.language || 'es');
    
    // Make the request
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
): Promise<any> {
  try {
    const token = await getToken();
    
    // Build URL
    const url = new URL(`${API_BASE_URL}/astrology/astronomical-events`);
    url.searchParams.append('start_date', startDate);
    url.searchParams.append('end_date', endDate);
    url.searchParams.append('la', options.language || 'es');
    
    // Make the request
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
  apiResponse: any,
  latitude: number,
  longitude: number,
  timezone: string
): NatalChart {
  if (!apiResponse) {
    throw new Error('Invalid API response');
  }

  try {
    // Process planets
    const planets: PlanetPosition[] = (apiResponse.planets || []).map((planet: any) => ({
      name: planet.name,
      sign: planet.sign || getSignFromLongitude(planet.longitude),
      degree: Math.floor(planet.longitude % 30),
      minutes: Math.floor((planet.longitude % 1) * 60),
      retrograde: planet.is_retrograde || false,
      housePosition: planet.house || 1
    }));

    // Process houses
    const houses: House[] = (apiResponse.houses || []).map((house: any) => ({
      number: house.number,
      sign: house.sign || getSignFromLongitude(house.longitude),
      degree: Math.floor(house.longitude % 30),
      minutes: Math.floor((house.longitude % 1) * 60)
    }));

    // Process aspects
    const aspects: Aspect[] = (apiResponse.aspects || []).map((aspect: any) => ({
      planet1: aspect.planet1?.name || '',
      planet2: aspect.planet2?.name || '',
      type: aspect.aspect?.name || aspect.type || 'conjunction',
      orb: aspect.orb || 0,
      applying: aspect.is_applying || false
    }));

    // Extract ascendant and midheaven
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

    // Create and return the chart object
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