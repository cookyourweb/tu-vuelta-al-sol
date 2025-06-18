// src/services/progressedChartService.ts - FORMATO DATETIME CORREGIDO
import axios from 'axios';

// Constantes para la API de Prokerala
const PROKERALA_API_BASE_URL = process.env.NEXT_PUBLIC_PROKERALA_API_BASE_URL || 'https://api.prokerala.com/v2';
const TOKEN_ENDPOINT = process.env.NEXT_PUBLIC_PROKERALA_TOKEN_ENDPOINT || 'https://api.prokerala.com/token';

// Obtener claves de las variables de entorno
const CLIENT_ID = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_SECRET;

// Almacén de token en memoria
interface AccessToken {
  token: string;
  expires: number; // timestamp
}

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
    console.log('🔑 Obteniendo nuevo token de Prokerala...');
    const response = await axios.post(
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

    console.log('✅ Token de Prokerala obtenido exitosamente');
    return accessToken.token;
  } catch (error) {
    console.error('❌ Error obteniendo token de acceso de Prokerala:', error);
    throw new Error('No se pudo autenticar con la API de Prokerala');
  }
}

/**
 * Formatea datetime con timezone correcto para Prokerala
 */
function formatProkeralaDateTime(birthDate: string, birthTime: string, timezone: string = 'Europe/Madrid'): string {
  const formattedTime = birthTime.length === 5 ? `${birthTime}:00` : birthTime;
  
  // Crear fecha en la zona horaria especificada
  const date = new Date(`${birthDate}T${formattedTime}`);
  
  // Obtener offset para la timezone
  let offset = '+01:00'; // Default para Madrid
  
  try {
    // Calcular offset dinámicamente
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'longOffset'
    });
    
    const parts = formatter.formatToParts(date);
    const offsetPart = parts.find(part => part.type === 'timeZoneName');
    
    if (offsetPart && offsetPart.value.includes('GMT')) {
      const match = offsetPart.value.match(/GMT([+-]\d{1,2})/);
      if (match) {
        const hours = parseInt(match[1]);
        offset = `${hours >= 0 ? '+' : ''}${hours.toString().padStart(2, '0')}:00`;
      }
    }
  } catch (error) {
    console.warn('Error calculando timezone, usando default +01:00');
  }
  
  const isoDateTime = `${birthDate}T${formattedTime}${offset}`;
  console.log(`🕒 DateTime formateado: ${isoDateTime} (timezone: ${timezone})`);
  
  return isoDateTime;
}

/**
 * 🌟 FUNCIÓN CORREGIDA: Obtiene la carta progresada con formato datetime correcto
 */
export async function getProgressedChart(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezone: string,
  progressionYear: number,
  options: {
    houseSystem?: string;
    aspectFilter?: string;
    language?: string;
    ayanamsa?: string;
    birthTimeRectification?: string;
  } = {}
): Promise<any> {
  console.log(`🔮 Generando carta progresada para año: ${progressionYear}`);
  console.log(`📅 Datos: ${birthDate} ${birthTime} (${latitude}, ${longitude})`);
  
  const token = await getAccessToken();
  
  // ✅ CORRECCIÓN: Formatear datetime CON timezone según ISO 8601
  const datetime = formatProkeralaDateTime(birthDate, birthTime, timezone);
  
  // ✅ CORRECCIÓN: Coordenadas con 4 decimales precisos
  const coordinates = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  const currentCoordinates = coordinates; // Usar las mismas coordenadas
  
  console.log('📍 Coordenadas formateadas:', coordinates);
  
  // ✅ CORRECCIÓN: Usar profile[datetime] y profile[coordinates] como espera la API
  const params = {
    'profile[datetime]': datetime,                           // ✅ CON profile[]
    'profile[coordinates]': coordinates,                     // ✅ CON profile[]
    'birth_time_unknown': 'false',                          // ✅ String
    'progression_year': progressionYear.toString(),         // ✅ String
    'current_coordinates': currentCoordinates,              // ✅ Coordenadas actuales
    'house_system': options.houseSystem || 'placidus',     // ✅ Sistema de casas
    'orb': 'default',                                       // ✅ Orbe por defecto
    'birth_time_rectification': options.birthTimeRectification || 'flat-chart', // ✅ Rectificación
    'aspect_filter': options.aspectFilter || 'all',        // ✅ Filtro de aspectos
    'la': options.language || 'es',                        // ✅ Idioma
    'ayanamsa': options.ayanamsa || '0'                     // ✅ String: 0=Tropical
  };

  console.log('📡 Parámetros carta progresada:', params);

  // ✅ Construir URL manualmente para mayor control
  const url = new URL(`${PROKERALA_API_BASE_URL}/astrology/progression-chart`);
  
  // Añadir cada parámetro individualmente
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  console.log('🌐 URL completa carta progresada:', url.toString());

  try {
    // ✅ Hacer la petición
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    console.log('✅ Carta progresada obtenida exitosamente');
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo carta progresada:', error);
    
    // Log detallado del error para debugging
    if (axios.isAxiosError(error)) {
      console.log('Detalles del error de Prokerala:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: url.toString()
      });
    }
    
    throw error;
  }
}

/**
 * ✅ FUNCIÓN ADICIONAL: Obtener aspectos de carta progresada
 */
export async function getProgressedAspects(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezone: string,
  progressionYear: number,
  options: {
    houseSystem?: string;
    aspectFilter?: string;
    language?: string;
    ayanamsa?: string;
    birthTimeRectification?: string;
  } = {}
): Promise<any> {
  console.log(`🔮 Obteniendo aspectos progresados para año: ${progressionYear}`);
  
  const token = await getAccessToken();
  
  const datetime = formatProkeralaDateTime(birthDate, birthTime, timezone);
  const coordinates = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  
  const params = {
    'profile[datetime]': datetime,
    'profile[coordinates]': coordinates,
    'birth_time_unknown': 'false',
    'progression_year': progressionYear.toString(),
    'current_coordinates': coordinates,
    'house_system': options.houseSystem || 'placidus',
    'orb': 'default',
    'birth_time_rectification': options.birthTimeRectification || 'flat-chart',
    'aspect_filter': options.aspectFilter || 'all',
    'la': options.language || 'es',
    'ayanamsa': options.ayanamsa || '0'
  };

  const url = new URL(`${PROKERALA_API_BASE_URL}/astrology/progression-aspect-chart`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  try {
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    console.log('✅ Aspectos progresados obtenidos exitosamente');
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo aspectos progresados:', error);
    throw error;
  }
}

/**
 * ✅ FUNCIÓN ADICIONAL: Obtener posiciones planetarias progresadas
 */
export async function getProgressedPlanetPositions(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezone: string,
  progressionYear: number,
  options: {
    language?: string;
    ayanamsa?: string;
    birthTimeRectification?: string;
  } = {}
): Promise<any> {
  console.log(`🔮 Obteniendo posiciones planetarias progresadas para año: ${progressionYear}`);
  
  const token = await getAccessToken();
  
  const datetime = formatProkeralaDateTime(birthDate, birthTime, timezone);
  const coordinates = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  
  const params = {
    'profile[datetime]': datetime,
    'profile[coordinates]': coordinates,
    'birth_time_unknown': 'false',
    'progression_year': progressionYear.toString(),
    'current_coordinates': coordinates,
    'birth_time_rectification': options.birthTimeRectification || 'flat-chart',
    'la': options.language || 'es',
    'ayanamsa': options.ayanamsa || '0'
  };

  const url = new URL(`${PROKERALA_API_BASE_URL}/astrology/progression-planet-position`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  try {
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    console.log('✅ Posiciones planetarias progresadas obtenidas exitosamente');
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo posiciones planetarias progresadas:', error);
    throw error;
  }
}