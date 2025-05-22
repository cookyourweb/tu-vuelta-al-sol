// src/app/api/charts/progressed/route.ts
//REVISAR CODIGO INCORRECTO ES DE SERVICES
import axios from 'axios';

// Constantes para la API de Prokerala
const PROKERALA_API_BASE_URL = 'https://api.prokerala.com/v2';
const TOKEN_ENDPOINT = `${PROKERALA_API_BASE_URL}/token`;

// Obtener claves de las variables de entorno
const CLIENT_ID = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_SECRET;

// -----------------------
// Definición de interfaces
// -----------------------

// Interfaz para la respuesta de autenticación
interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Interfaz para el token de acceso
interface AccessToken {
  token: string;
  expires: number; // timestamp
}

// Interfaces para perfiles de carta natal
export interface NatalChartProfile {
  date: string;
  time?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

// Interfaces para objetos de la API de Prokerala
export interface ProkeralaPlanet {
  name: string;
  longitude: number;
  latitude?: number;
  sign?: string;
  house?: number;
  is_retrograde?: boolean;
  speed?: number;
  declination?: number;
}

export interface ProkeralaHouse {
  number: number;
  longitude: number;
  sign?: string;
}

export interface ProkeralaAspect {
  planet1: string;
  planet2: string;
  aspect?: string;
  type?: string;
  orb: number;
  is_applying?: boolean;
}

export interface ProkeralaPoint {
  sign?: string;
  longitude: number;
}

export interface ProkeralaNatalChartResponse {
  datetime: string;
  planets?: ProkeralaPlanet[];
  houses?: ProkeralaHouse[];
  aspects?: ProkeralaAspect[];
  ascendant?: ProkeralaPoint;
  mc?: ProkeralaPoint;
}

// Interfaces para los objetos de nuestra aplicación
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
  applying: boolean;
}

export interface NatalChart {modalityDistribution?: {
  cardinal: number;
  fixed: number;
  mutable: number;
};
elementDistribution?: {
  fire: number;
  earth: number;
  air: number;
  water: number;
};
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

// -----------------------
// Almacén de token en memoria
// -----------------------
let accessToken: AccessToken | null = null;

/**
 * Obtiene un token de acceso válido para la API de Prokerala
 */
export async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (accessToken && accessToken.expires > now + 60) {
    return accessToken.token;
  }

  try {
    console.log('Obteniendo nuevo token de Prokerala...');
    const response = await axios.post<AuthResponse>(
      TOKEN_ENDPOINT,
      new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID || '',
        'client_secret': CLIENT_SECRET || '',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (!response.data || !response.data.access_token) {
      throw new Error('Respuesta de token inválida');
    }

    accessToken = {
      token: response.data.access_token,
      expires: now + response.data.expires_in
    };

    return accessToken.token;
  } catch (error) {
    console.error('Error obteniendo token de acceso de Prokerala:', error);
    throw new Error('No se pudo autenticar con la API de Prokerala');
  }
}

/**
 * Realiza una solicitud a la API de Prokerala con autenticación
 */
async function makeApiRequest<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  try {
    const token = await getAccessToken();
    const url = new URL(`${PROKERALA_API_BASE_URL}${endpoint}`);
    
    // Añadir parámetros a la URL
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    console.log(`Prokerala API Request URL: ${url.toString()}`);

    const response = await axios.get<T>(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error en solicitud a Prokerala (${endpoint}):`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Proporcionar información de error detallada
      throw new Error(`Error en API Prokerala: ${error.response?.data?.error || error.message}`);
    }
    
    console.error(`Error desconocido en solicitud a Prokerala (${endpoint}):`, error);
    throw error;
  }
}

/**
 * Busca ubicaciones por nombre
 */
export async function searchLocation(query: string) {
  try {
    return await makeApiRequest('/location-search', { q: query });
  } catch (error) {
    console.error('Error buscando ubicación:', error);
    throw error;
  }
}

/**
 * Obtiene la carta natal desde Prokerala
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
): Promise<ProkeralaNatalChartResponse> {
  try {
    // Formatear fecha y hora según la documentación de Prokerala
    const datetime = `${birthDate}T${birthTime || '00:00:00'}`;
    
    const params = {
      datetime: datetime,
      coordinates: `${latitude},${longitude}`,
      timezone: timezone,
      system: options.houseSystem || 'placidus',
      aspect_filter: options.aspectFilter || 'major',
      la: options.language || 'es'
    };

    return await makeApiRequest<ProkeralaNatalChartResponse>('/astrology/natal-chart', params);
  } catch (error) {
    console.error('Error obteniendo carta natal:', error);
    throw error;
  }
}

/**
 * Obtiene tránsitos planetarios para una fecha específica
 */
export async function getPlanetaryTransits(
  date: string,
  latitude: number,
  longitude: number,
  timezone: string,
  options: {
    language?: string;
  } = {}
): Promise<ProkeralaNatalChartResponse> {
  try {
    // Formatear fecha y hora
    const datetime = date.includes('T') ? date : `${date}T00:00:00`;
    
    const params = {
      datetime: datetime,
      coordinates: `${latitude},${longitude}`,
      timezone: timezone,
      la: options.language || 'es'
    };

    return await makeApiRequest<ProkeralaNatalChartResponse>('/astrology/planet-position', params);
  } catch (error) {
    console.error('Error obteniendo tránsitos planetarios:', error);
    throw error;
  }
}

/**
 * Obtiene eventos astrológicos para un período
 */
export async function getAstronomicalEvents(
  startDate: string,
  endDate: string,
  options: {
    language?: string;
  } = {}
) {
  try {
    const params = {
      start_date: startDate,
      end_date: endDate,
      la: options.language || 'es'
    };

    return await makeApiRequest('/astrology/astronomical-events', params);
  } catch (error) {
    console.error('Error obteniendo eventos astrológicos:', error);
    throw error;
  }
}

/**
 * Obtiene aspectos entre planetas para una fecha específica
 */
export async function getPlanetaryAspects(
  date: string,
  latitude: number,
  longitude: number,
  timezone: string,
  options: {
    language?: string;
  } = {}
) {
  try {
    // Formatear fecha y hora
    const datetime = date.includes('T') ? date : `${date}T00:00:00`;
    
    const params = {
      datetime: datetime,
      coordinates: `${latitude},${longitude}`,
      timezone: timezone,
      la: options.language || 'es'
    };

    return await makeApiRequest('/astrology/planet-aspects', params);
  } catch (error) {
    console.error('Error obteniendo aspectos planetarios:', error);
    throw error;
  }
}

/**
 * Convierte la respuesta de Prokerala al formato de la aplicación
 */
export function convertProkeralaToNatalChart(
  apiResponse: ProkeralaNatalChartResponse, 
  latitude: number, 
  longitude: number, 
  timezone: string
): NatalChart {
  if (!apiResponse) {
    throw new Error('Respuesta de API inválida');
  }

  try {
    // Extraer datos de los planetas
    const planets: PlanetPosition[] = (apiResponse.planets || []).map((planet: ProkeralaPlanet) => ({
      name: planet.name,
      sign: planet.sign || convertLongitudeToSign(planet.longitude),
      degree: Math.floor(planet.longitude % 30),
      minutes: Math.floor((planet.longitude % 1) * 60),
      retrograde: planet.is_retrograde || false,
      housePosition: planet.house || 1
    }));

    // Extraer datos de las casas
    const houses: House[] = (apiResponse.houses || []).map((house: ProkeralaHouse) => ({
      number: house.number,
      sign: house.sign || convertLongitudeToSign(house.longitude),
      degree: Math.floor(house.longitude % 30),
      minutes: Math.floor((house.longitude % 1) * 60)
    }));

    // Extraer datos de los aspectos
    const aspects: Aspect[] = (apiResponse.aspects || []).map((aspect: ProkeralaAspect) => ({
      planet1: aspect.planet1,
      planet2: aspect.planet2,
      type: aspect.type || aspect.aspect || 'conjunction',
      orb: aspect.orb,
      applying: aspect.is_applying || false
    }));

    // Extraer datos del ascendente
    let ascendant;
    if (apiResponse.ascendant) {
      ascendant = {
        sign: apiResponse.ascendant.sign || convertLongitudeToSign(apiResponse.ascendant.longitude),
        degree: Math.floor(apiResponse.ascendant.longitude % 30),
        minutes: Math.floor((apiResponse.ascendant.longitude % 1) * 60)
      };
    }

    // Extraer datos del medio cielo
    let midheaven;
    if (apiResponse.mc) {
      midheaven = {
        sign: apiResponse.mc.sign || convertLongitudeToSign(apiResponse.mc.longitude),
        degree: Math.floor(apiResponse.mc.longitude % 30),
        minutes: Math.floor((apiResponse.mc.longitude % 1) * 60)
      };
    }

    // Crear y devolver el objeto de carta natal
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
    console.error('Error convirtiendo datos de Prokerala:', error);
    throw new Error('Error procesando datos astrológicos');
  }
}

// Función auxiliar para convertir longitud zodiacal a signo
function convertLongitudeToSign(longitude: number): string {
  const signs = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer',
    'Leo', 'Virgo', 'Libra', 'Escorpio',
    'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];
  
  const signIndex = Math.floor(longitude / 30) % 12;
  return signs[signIndex];
}