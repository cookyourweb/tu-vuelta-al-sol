// src/utils/dateTimeUtils.ts

/**
 * Utilidades para formateo consistente de fechas y timezones
 * para la API de Prokerala
 */

export interface TimezoneInfo {
  name: string;
  offset: string;
  isDST?: boolean;
}

/**
 * Mapeo de zonas horarias principales
 */
export const TIMEZONE_MAP: Record<string, TimezoneInfo> = {
  'Europe/Madrid': { name: 'CET/CEST', offset: '+01:00' },
  'Europe/London': { name: 'GMT/BST', offset: '+00:00' },
  'America/New_York': { name: 'EST/EDT', offset: '-05:00' },
  'America/Los_Angeles': { name: 'PST/PDT', offset: '-08:00' },
  'America/Mexico_City': { name: 'CST/CDT', offset: '-06:00' },
  'America/Argentina/Buenos_Aires': { name: 'ART', offset: '-03:00' },
  'America/Bogota': { name: 'COT', offset: '-05:00' },
  'America/Lima': { name: 'PET', offset: '-05:00' },
  'America/Santiago': { name: 'CLT/CLST', offset: '-04:00' },
  'UTC': { name: 'UTC', offset: '+00:00' }
};

/**
 * Determina si una fecha está en horario de verano (aproximación)
 * @param date - Fecha a evaluar
 * @param timezone - Zona horaria
 */
export function isDST(date: Date, timezone: string): boolean {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  switch (timezone) {
    case 'Europe/Madrid':
      // DST: último domingo de marzo al último domingo de octubre
      return month > 3 && month < 10;
    
    case 'America/New_York':
      // DST: segundo domingo de marzo al primer domingo de noviembre
      return month > 3 && month < 11;
      
    default:
      return false;
  }
}

/**
 * Obtiene el offset correcto para una fecha y timezone específicos
 * @param date - Fecha
 * @param timezone - Zona horaria
 */
export function getTimezoneOffset(date: Date, timezone: string): string {
  const baseOffset = TIMEZONE_MAP[timezone]?.offset || '+00:00';
  
  if (timezone === 'Europe/Madrid' && isDST(date, timezone)) {
    return '+02:00'; // CEST (verano)
  }
  
  if (timezone === 'America/New_York' && isDST(date, timezone)) {
    return '-04:00'; // EDT (verano)
  }
  
  return baseOffset;
}

/**
 * Formatea datetime para Prokerala API con timezone correcto
 * @param birthDate - Fecha en formato YYYY-MM-DD
 * @param birthTime - Hora en formato HH:MM:SS o HH:MM
 * @param timezone - Zona horaria (default: Europe/Madrid)
 */
export function formatProkeralaDateTime(
  birthDate: string, 
  birthTime: string, 
  timezone: string = 'Europe/Madrid'
): string {
  // Asegurar formato HH:MM:SS
  const formattedTime = birthTime.length === 5 ? `${birthTime}:00` : birthTime;
  
  // Crear objeto Date para determinar offset
  const date = new Date(`${birthDate}T${formattedTime}`);
  
  // Obtener offset correcto
  let offset = getTimezoneOffset(date, timezone);

  // Fix offset format if missing minutes (e.g., "+2" -> "+02:00")
  if (/^[+-]\d$/.test(offset)) {
    offset = offset.replace(/^([+-])(\d)$/, '$10$2:00');
  } else if (/^[+-]\d:\d{2}$/.test(offset)) {
    // e.g. "+2:30" -> "+02:30"
    offset = offset.replace(/^([+-])(\d):(\d{2})$/, '$10$2:$3');
  }

  // Formato ISO 8601 completo
  const isoDateTime = `${birthDate}T${formattedTime}${offset}`;
  
  console.log(`📅 DateTime formateado: ${isoDateTime} (${timezone})`);
  
  return isoDateTime;
}

/**
 * Convierte datetime a UTC para APIs que lo requieran
 * @param birthDate - Fecha YYYY-MM-DD
 * @param birthTime - Hora HH:MM:SS o HH:MM
 * @param timezone - Zona horaria original
 */
export function formatProkeralaDateTimeUTC(
  birthDate: string,
  birthTime: string,
  timezone: string = 'Europe/Madrid'
): string {
  const formattedTime = birthTime.length === 5 ? `${birthTime}:00` : birthTime;
  const date = new Date(`${birthDate}T${formattedTime}`);
  const offset = getTimezoneOffset(date, timezone);
  
  // Calcular UTC
  const offsetHours = parseInt(offset.substring(1, 3)) * (offset.startsWith('+') ? -1 : 1);
  const offsetMinutes = parseInt(offset.substring(4, 6)) * (offset.startsWith('+') ? -1 : 1);
  
  const utcDate = new Date(date.getTime() + (offsetHours * 60 + offsetMinutes) * 60000);
  
  return utcDate.toISOString().substring(0, 19) + 'Z';
}

/**
 * Valida formato de coordenadas
 * @param latitude - Latitud
 * @param longitude - Longitud
 */
export function validateCoordinates(latitude: number, longitude: number): boolean {
  return (
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180
  );
}

/**
 * Formatea coordenadas para Prokerala API
 * @param latitude - Latitud
 * @param longitude - Longitud
 * @param precision - Decimales (default: 4)
 */
export function formatProkeralaCoordinates(
  latitude: number, 
  longitude: number, 
  precision: number = 4
): string {
  if (!validateCoordinates(latitude, longitude)) {
    throw new Error(`Coordenadas inválidas: ${latitude}, ${longitude}`);
  }
  
  const lat = latitude.toFixed(precision);
  const lon = longitude.toFixed(precision);
  
  return `${lat},${lon}`;
}

/**
 * Crea parámetros estándar para Prokerala API
 * @param params - Parámetros de entrada
 */
export interface ProkeralaParams {
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  houseSystem?: string;
  aspectFilter?: string;
  language?: string;
  ayanamsa?: string;
  birthTimeUnknown?: boolean;
  birthTimeRectification?: string;
  orb?: string;
}

export function createProkeralaParams(params: ProkeralaParams): URLSearchParams {
  const {
    birthDate,
    birthTime,
    latitude,
    longitude,
    timezone = 'Europe/Madrid',
    houseSystem = 'placidus',
    aspectFilter = 'all',
    language = 'es',
    ayanamsa = '0', // 🚨 CRÍTICO: Siempre tropical
    birthTimeUnknown = false,
    birthTimeRectification = 'flat-chart',
    orb = 'default'
  } = params;

  // Formatear datetime y coordenadas
  const formattedDateTime = formatProkeralaDateTime(birthDate, birthTime, timezone);
  const formattedCoordinates = formatProkeralaCoordinates(latitude, longitude);

  // Crear parámetros de URL
  const urlParams = new URLSearchParams({
    'profile[datetime]': formattedDateTime,
    'profile[coordinates]': formattedCoordinates,
    'birth_time_unknown': birthTimeUnknown.toString(),
    'house_system': houseSystem,
    'orb': orb,
    'birth_time_rectification': birthTimeRectification,
    'aspect_filter': aspectFilter,
    'la': language,
    'ayanamsa': ayanamsa
  });

  console.log('🔧 Parámetros Prokerala creados:', {
    datetime: formattedDateTime,
    coordinates: formattedCoordinates,
    timezone,
    ayanamsa
  });

  return urlParams;
}

/**
 * Función de conveniencia para casos de uso específicos
 */
export const ProkeralaUtils = {
  // Para carta natal
  natalChart: (params: ProkeralaParams) => {
    return createProkeralaParams({
      ...params,
      aspectFilter: 'all',
      ayanamsa: '0' // Tropical obligatorio
    });
  },

  // Para carta progresada
  progressedChart: (params: ProkeralaParams & { progressionYear: number }) => {
    const urlParams = createProkeralaParams({
      ...params,
      ayanamsa: '0' // Tropical obligatorio
    });
    
    urlParams.append('progression_year', params.progressionYear.toString());
    urlParams.append('current_coordinates', formatProkeralaCoordinates(params.latitude, params.longitude));
    
    return urlParams;
  },

  // Para eventos astrológicos
  events: (startDate: string, endDate: string, language: string = 'es') => {
    return new URLSearchParams({
      'start_date': startDate,
      'end_date': endDate,
      'la': language
    });
  }
};

/**
 * Casos de prueba / ejemplos
 */
export const EXAMPLE_USAGE = {
  // Ejemplo: Verónica 10/02/1974 07:30 Madrid
  veronica: {
    birthDate: '1974-02-10',
    birthTime: '07:30:00',
    latitude: 40.4164,
    longitude: -3.7025,
    timezone: 'Europe/Madrid'
  },
  
  // Resultado esperado:
  // profile[datetime] = 1974-02-10T07:30:00+01:00
  // profile[coordinates] = 40.4164,-3.7025
};