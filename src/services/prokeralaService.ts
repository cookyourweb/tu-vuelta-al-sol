// services/prokeralaService.ts
import axios from 'axios';

// Constantes para la API de Prokerala
const PROKERALA_API_BASE_URL = 'https://api.prokerala.com/v2';
const CLIENT_ID = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_SECRET;

// Interfaz para el token de acceso
interface AccessToken {
  token: string;
  expires: number; // timestamp
}

// Almacén de token en memoria (en un entorno de producción real, considerar usar Redis o similar)
let accessToken: AccessToken | null = null;

/**
 * Obtiene un token de acceso válido para la API de Prokerala
 */
async function getAccessToken(): Promise<string> {
  // Si ya tenemos un token y no ha expirado, lo devolvemos
  const now = Math.floor(Date.now() / 1000);
  if (accessToken && accessToken.expires > now + 60) { // 60 segundos de margen
    return accessToken.token;
  }

  try {
    // Solicitar un nuevo token
    const response = await axios.post(
      `${PROKERALA_API_BASE_URL}/token`,
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

    // Guardar el token y su tiempo de expiración
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
async function makeRequest(endpoint: string, params: Record<string, string | number> = {}): Promise<unknown> {
  try {
    const token = await getAccessToken();
    
    // Construir la URL con parámetros
    const url = new URL(`${PROKERALA_API_BASE_URL}${endpoint}`);
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, String(params[key]));
    });

    // Realizar la solicitud
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error(`Error en solicitud a Prokerala (${endpoint}):`, error);
    throw error;
  }
}

/**
 * Busca ubicaciones por nombre
 */
export async function searchLocation(query: string) {
  try {
    return await makeRequest('/location-search', { q: query });
  } catch (error) {
    console.error('Error buscando ubicación:', error);
    throw error;
  }
}

/**
 * Obtiene la carta natal desde Prokerala
 */
export async function getNatalHoroscope(
  datetime: string,
  latitude: number,
  longitude: number,
  timezone: string,
  language: string = 'es'
) {
  try {
    const params = {
      datetime: datetime,
      coordinates: `${latitude},${longitude}`,
      ayanamsa: 'lahiri', // Sistema de Ayanamsa (puedes cambiar según prefieras)
      system: 'placidus', // Sistema de casas (puedes cambiar según prefieras)
      la: language
    };

    return await makeRequest('/astrology/natal-horoscope', params);
  } catch (error) {
    console.error('Error obteniendo carta natal:', error);
    throw error;
  }
}

/**
 * Obtiene tránsitos planetarios
 */
export async function getPlanetaryTransits(
  datetime: string,
  latitude: number,
  longitude: number,
  timezone: string,
  language: string = 'es'
) {
  try {
    const params = {
      datetime: datetime,
      coordinates: `${latitude},${longitude}`,
      ayanamsa: 'lahiri',
      la: language
    };

    return await makeRequest('/astrology/planet-position', params);
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
  language: string = 'es'
) {
  try {
    const params = {
      start_date: startDate,
      end_date: endDate,
      la: language
    };

    return await makeRequest('/astrology/astronomical-events', params);
  } catch (error) {
    console.error('Error obteniendo eventos astrológicos:', error);
    throw error;
  }
}

/**
 * Obtiene aspectos entre planetas
 */
export async function getPlanetaryAspects(
  datetime: string,
  latitude: number,
  longitude: number,
  timezone: string,
  language: string = 'es'
) {
  try {
    const params = {
      datetime: datetime,
      coordinates: `${latitude},${longitude}`,
      ayanamsa: 'lahiri',
      la: language
    };

    return await makeRequest('/astrology/planet-aspects', params);
  } catch (error) {
    console.error('Error obteniendo aspectos planetarios:', error);
    throw error;
  }
}

/**
 * Convierte la respuesta de Prokerala al formato de tu aplicación
 */
interface ProkeralaData {
  planets?: { name: string; sign: string; longitude: number; is_retrograde?: boolean; house?: number }[];
  houses?: { number: number; sign: string; longitude: number }[];
  aspects?: { planet1: string; planet2: string; type: string; orb: number; is_applying?: boolean }[];
  ascendant?: { sign: string; longitude: number };
  mc?: { sign: string; longitude: number };
}

export function convertProkeralaToNatalChart(prokeralaData: ProkeralaData, latitude: number, longitude: number, timezone: string) {
  // Esta función dependerá de la estructura exacta de la respuesta de Prokerala
  // Ajústala según la documentación y tus pruebas

  // Ejemplo básico (necesitarás ajustar esto)
  const planets = (prokeralaData.planets || []).map((planet: { name: string; sign: string; longitude: number; is_retrograde?: boolean; house?: number }) => ({
    name: planet.name,
    sign: planet.sign,
    degree: Math.floor(planet.longitude % 30),
    minutes: Math.floor((planet.longitude % 1) * 60),
    retrograde: planet.is_retrograde || false,
    housePosition: planet.house || 1
  }));

  const houses = (prokeralaData.houses || []).map((house: { number: number; sign: string; longitude: number }) => ({
    number: house.number,
    sign: house.sign,
    degree: Math.floor(house.longitude % 30),
    minutes: Math.floor((house.longitude % 1) * 60)
  }));

  const aspects = (prokeralaData.aspects || []).map((aspect: { planet1: string; planet2: string; type: string; orb: number; is_applying?: boolean }) => ({
    planet1: aspect.planet1,
    planet2: aspect.planet2,
    type: aspect.type,
    orb: aspect.orb,
    applying: aspect.is_applying || false
  }));

  // Extraer datos del ascendente
  let ascendant;
  if (prokeralaData.ascendant) {
    ascendant = {
      sign: prokeralaData.ascendant.sign,
      degree: Math.floor(prokeralaData.ascendant.longitude % 30),
      minutes: Math.floor((prokeralaData.ascendant.longitude % 1) * 60)
    };
  }

  // Extraer datos del medio cielo
  let midheaven;
  if (prokeralaData.mc) {
    midheaven = {
      sign: prokeralaData.mc.sign,
      degree: Math.floor(prokeralaData.mc.longitude % 30),
      minutes: Math.floor((prokeralaData.mc.longitude % 1) * 60)
    };
  }

  return {
    planets,
    houses,
    aspects,
    ascendant,
    midheaven,
    latitude,
    longitude,
    timezone
  };
}

export default {
  searchLocation,
  getNatalHoroscope,
  getPlanetaryTransits,
  getAstronomicalEvents,
  getPlanetaryAspects,
  convertProkeralaToNatalChart
};