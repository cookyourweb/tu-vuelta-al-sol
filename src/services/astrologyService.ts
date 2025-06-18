// services/astrologyService.ts - CORREGIDO PARA OBTENER ASCENDENTE
import axios from 'axios';
import { formatProkeralaDateTime, ProkeralaUtils } from '../utils/dateTimeUtils';

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
  degree: string;
  longitude: number;
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
 * ✅ FUNCIÓN CORREGIDA: Obtiene carta natal COMPLETA con Ascendente
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
    const datetime = formatProkeralaDateTime(birthDate, birthTime, timezone);
    const coordinates = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;

    console.log('🔮 Obteniendo carta natal completa...');
    console.log(`📅 DateTime: ${datetime}`);
    console.log(`📍 Coordenadas: ${coordinates}`);

    // ✅ USAR ENDPOINT NATAL-CHART QUE INCLUYE ASCENDENTE
    const params = {
      'profile[datetime]': datetime,
      'profile[coordinates]': coordinates,
      'birth_time_unknown': 'false',
      'house_system': options.houseSystem || 'placidus',
      'orb': 'default',
      'birth_time_rectification': 'flat-chart',
      'aspect_filter': options.aspectFilter || 'all',
      'la': options.language || 'es',
      'ayanamsa': '0' // Tropical
    };

    const url = new URL(`${API_BASE_URL}/astrology/natal-chart`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    console.log('🌐 URL carta natal:', url.toString());

    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    console.log('✅ Carta natal completa obtenida con Ascendente');
    
    // Procesar y estructurar la respuesta
    const processedData = processNatalChartResponse(response.data, latitude, longitude, timezone, datetime);
    
    return processedData;
  } catch (error) {
    console.error('Error in Prokerala natal chart request:', error);
    throw new Error('Failed to get natal chart from Prokerala');
  }
}

/**
 * ✅ FUNCIÓN AUXILIAR: Procesa la respuesta de la carta natal
 */
function processNatalChartResponse(apiData: any, latitude: number, longitude: number, timezone: string, datetime: string) {
  console.log('🔄 Procesando respuesta de carta natal...');
  
  const data = apiData?.data || apiData;
  
  // Procesar planetas
  const planets = (data?.planets || []).map((planet: any) => ({
    name: planet.name || 'Desconocido',
    sign: planet.sign || getSignFromLongitude(planet.longitude || 0),
    degree: Math.floor((planet.longitude || 0) % 30),
    minutes: Math.floor(((planet.longitude || 0) % 1) * 60),
    retrograde: planet.is_retrograde || false,
    housePosition: planet.house || 1,
    longitude: planet.longitude || 0
  }));

  // Procesar casas
  const houses = (data?.houses || []).map((house: any, index: number) => ({
    number: house.number || (index + 1),
    sign: house.sign || getSignFromLongitude(house.longitude || 0),
    degree: formatDegreeString(house.longitude || 0),
    longitude: house.longitude || 0
  }));

  // Procesar aspectos
  const aspects = (data?.aspects || []).map((aspect: any) => ({
    planet1: aspect.planet1?.name || 'Desconocido',
    planet2: aspect.planet2?.name || 'Desconocido',
    type: aspect.aspect?.name || aspect.type || 'Conjunción',
    orb: aspect.orb || 0,
    applying: aspect.is_applying
  }));

  // ✅ PROCESAR ASCENDENTE Y MEDIO CIELO
  let ascendant;
  if (data?.ascendant) {
    ascendant = {
      sign: data.ascendant.sign || getSignFromLongitude(data.ascendant.longitude || 0),
      degree: Math.floor((data.ascendant.longitude || 0) % 30),
      minutes: Math.floor(((data.ascendant.longitude || 0) % 1) * 60),
      longitude: data.ascendant.longitude || 0
    };
    console.log('✅ Ascendente procesado:', ascendant);
  }

  let midheaven;
  if (data?.mc || data?.midheaven) {
    const mcData = data.mc || data.midheaven;
    midheaven = {
      sign: mcData.sign || getSignFromLongitude(mcData.longitude || 0),
      degree: Math.floor((mcData.longitude || 0) % 30),
      minutes: Math.floor(((mcData.longitude || 0) % 1) * 60),
      longitude: mcData.longitude || 0
    };
    console.log('✅ Medio Cielo procesado:', midheaven);
  }

  const result = {
    birthData: {
      latitude,
      longitude,
      timezone,
      datetime
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

  console.log(`✅ Carta natal procesada: ${planets.length} planetas, ${houses.length} casas, ${aspects.length} aspectos`);
  if (ascendant) console.log(`🌅 Ascendente en ${ascendant.sign} ${ascendant.degree}°${ascendant.minutes}'`);
  
  return result;
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

/**
 * Helper function to format degree as string
 */
function formatDegreeString(longitude: number): string {
  const deg = Math.floor(longitude % 30);
  const min = Math.floor((longitude % 1) * 60);
  const sec = Math.floor(((longitude % 1) * 60 % 1) * 60);
  return `${deg}°${min}'${sec}"`;
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
    const formattedDatetime = formatProkeralaDateTime(datetime.split('T')[0], datetime.split('T')[1], timezone);
    
    // Build URL
    const url = new URL(`${API_BASE_URL}/astrology/planet-position`);
    url.searchParams.append('profile[datetime]', formattedDatetime);
    url.searchParams.append('profile[coordinates]', `${latitude.toFixed(4)},${longitude.toFixed(4)}`);
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
}// services/astrologyService.ts - CORREGIDO PARA OBTENER ASCENDENTE
import axios from 'axios';
import { formatProkeralaDateTime, ProkeralaUtils } from '../utils/dateTimeUtils';

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
  degree: string;
  longitude: number;
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
 * ✅ FUNCIÓN CORREGIDA: Obtiene carta natal COMPLETA con Ascendente
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
    const datetime = formatProkeralaDateTime(birthDate, birthTime, timezone);
    const coordinates = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;

    console.log('🔮 Obteniendo carta natal completa...');
    console.log(`📅 DateTime: ${datetime}`);
    console.log(`📍 Coordenadas: ${coordinates}`);

    // ✅ USAR ENDPOINT NATAL-CHART QUE INCLUYE ASCENDENTE
    const params = {
      'profile[datetime]': datetime,
      'profile[coordinates]': coordinates,
      'birth_time_unknown': 'false',
      'house_system': options.houseSystem || 'placidus',
      'orb': 'default',
      'birth_time_rectification': 'flat-chart',
      'aspect_filter': options.aspectFilter || 'all',
      'la': options.language || 'es',
      'ayanamsa': '0' // Tropical
    };

    const url = new URL(`${API_BASE_URL}/astrology/natal-chart`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    console.log('🌐 URL carta natal:', url.toString());

    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    console.log('✅ Carta natal completa obtenida con Ascendente');
    
    // Procesar y estructurar la respuesta
    const processedData = processNatalChartResponse(response.data, latitude, longitude, timezone, datetime);
    
    return processedData;
  } catch (error) {
    console.error('Error in Prokerala natal chart request:', error);
    throw new Error('Failed to get natal chart from Prokerala');
  }
}

/**
 * ✅ FUNCIÓN AUXILIAR: Procesa la respuesta de la carta natal
 */
function processNatalChartResponse(apiData: any, latitude: number, longitude: number, timezone: string, datetime: string) {
  console.log('🔄 Procesando respuesta de carta natal...');
  
  const data = apiData?.data || apiData;
  
  // Procesar planetas
  const planets = (data?.planets || []).map((planet: any) => ({
    name: planet.name || 'Desconocido',
    sign: planet.sign || getSignFromLongitude(planet.longitude || 0),
    degree: Math.floor((planet.longitude || 0) % 30),
    minutes: Math.floor(((planet.longitude || 0) % 1) * 60),
    retrograde: planet.is_retrograde || false,
    housePosition: planet.house || 1,
    longitude: planet.longitude || 0
  }));

  // Procesar casas
  const houses = (data?.houses || []).map((house: any, index: number) => ({
    number: house.number || (index + 1),
    sign: house.sign || getSignFromLongitude(house.longitude || 0),
    degree: formatDegreeString(house.longitude || 0),
    longitude: house.longitude || 0
  }));

  // Procesar aspectos
  const aspects = (data?.aspects || []).map((aspect: any) => ({
    planet1: aspect.planet1?.name || 'Desconocido',
    planet2: aspect.planet2?.name || 'Desconocido',
    type: aspect.aspect?.name || aspect.type || 'Conjunción',
    orb: aspect.orb || 0,
    applying: aspect.is_applying
  }));

  // ✅ PROCESAR ASCENDENTE Y MEDIO CIELO
  let ascendant;
  if (data?.ascendant) {
    ascendant = {
      sign: data.ascendant.sign || getSignFromLongitude(data.ascendant.longitude || 0),
      degree: Math.floor((data.ascendant.longitude || 0) % 30),
      minutes: Math.floor(((data.ascendant.longitude || 0) % 1) * 60),
      longitude: data.ascendant.longitude || 0
    };
    console.log('✅ Ascendente procesado:', ascendant);
  }

  let midheaven;
  if (data?.mc || data?.midheaven) {
    const mcData = data.mc || data.midheaven;
    midheaven = {
      sign: mcData.sign || getSignFromLongitude(mcData.longitude || 0),
      degree: Math.floor((mcData.longitude || 0) % 30),
      minutes: Math.floor(((mcData.longitude || 0) % 1) * 60),
      longitude: mcData.longitude || 0
    };
    console.log('✅ Medio Cielo procesado:', midheaven);
  }

  const result = {
    birthData: {
      latitude,
      longitude,
      timezone,
      datetime
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

  console.log(`✅ Carta natal procesada: ${planets.length} planetas, ${houses.length} casas, ${aspects.length} aspectos`);
  if (ascendant) console.log(`🌅 Ascendente en ${ascendant.sign} ${ascendant.degree}°${ascendant.minutes}'`);
  
  return result;
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

/**
 * Helper function to format degree as string
 */
function formatDegreeString(longitude: number): string {
  const deg = Math.floor(longitude % 30);
  const min = Math.floor((longitude % 1) * 60);
  const sec = Math.floor(((longitude % 1) * 60 % 1) * 60);
  return `${deg}°${min}'${sec}"`;
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
    const formattedDatetime = formatProkeralaDateTime(datetime.split('T')[0], datetime.split('T')[1], timezone);
    
    // Build URL
    const url = new URL(`${API_BASE_URL}/astrology/planet-position`);
    url.searchParams.append('profile[datetime]', formattedDatetime);
    url.searchParams.append('profile[coordinates]', `${latitude.toFixed(4)},${longitude.toFixed(4)}`);
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