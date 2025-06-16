// src/utils/dateTimeUtils.ts - VERSIÓN MEJORADA
// Solo se actualizan las funciones isDST() y getTimezoneOffset()
// El resto del código permanece igual

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
 * 🆕 FUNCIÓN MEJORADA: Calcula el último domingo de un mes
 */
function getLastSunday(year: number, month: number): Date {
  const lastDay = new Date(year, month, 0);
  const dayOfWeek = lastDay.getDay();
  const lastSundayDate = lastDay.getDate() - dayOfWeek;
  return new Date(year, month - 1, lastSundayDate);
}

/**
 * 🆕 FUNCIÓN MEJORADA: Calcula el primer domingo de un mes
 */
function getFirstSunday(year: number, month: number): Date {
  const firstDay = new Date(year, month - 1, 1);
  const dayOfWeek = firstDay.getDay();
  const firstSundayDate = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  return new Date(year, month - 1, firstSundayDate);
}

/**
 * 🆕 FUNCIÓN MEJORADA: Calcula el segundo domingo de un mes
 */
function getSecondSunday(year: number, month: number): Date {
  const firstSunday = getFirstSunday(year, month);
  return new Date(firstSunday.getTime() + 7 * 24 * 60 * 60 * 1000);
}

/**
 * 🔄 FUNCIÓN ACTUALIZADA: Determina si una fecha está en horario de verano con PRECISIÓN
 * @param date - Fecha a evaluar
 * @param timezone - Zona horaria
 */
export function isDST(date: Date, timezone: string): boolean {
  const year = date.getFullYear();

  switch (timezone) {
    case 'Europe/Madrid':
    case 'Europe/Paris':
    case 'Europe/Berlin':
      // DST: último domingo de marzo (2AM) al último domingo de octubre (3AM)
      const cestStart = getLastSunday(year, 3);
      cestStart.setHours(2, 0, 0, 0);
      
      const cestEnd = getLastSunday(year, 10);
      cestEnd.setHours(3, 0, 0, 0);
      
      return date >= cestStart && date < cestEnd;
    
    case 'Europe/London':
      // Reino Unido: último domingo de marzo (1AM) al último domingo de octubre (2AM)
      const bstStart = getLastSunday(year, 3);
      bstStart.setHours(1, 0, 0, 0);
      
      const bstEnd = getLastSunday(year, 10);
      bstEnd.setHours(2, 0, 0, 0);
      
      return date >= bstStart && date < bstEnd;
    
    case 'America/New_York':
      // USA Este: segundo domingo de marzo (2AM) al primer domingo de noviembre (2AM)
      const edtStart = getSecondSunday(year, 3);
      edtStart.setHours(2, 0, 0, 0);
      
      const edtEnd = getFirstSunday(year, 11);
      edtEnd.setHours(2, 0, 0, 0);
      
      return date >= edtStart && date < edtEnd;
    
    case 'America/Los_Angeles':
      // USA Oeste: mismo que NY pero con horas diferentes
      const pdtStart = getSecondSunday(year, 3);
      pdtStart.setHours(2, 0, 0, 0);
      
      const pdtEnd = getFirstSunday(year, 11);
      pdtEnd.setHours(2, 0, 0, 0);
      
      return date >= pdtStart && date < pdtEnd;
    
    case 'America/Mexico_City':
      // México: primer domingo de abril al último domingo de octubre
      const cdtStart = getFirstSunday(year, 4);
      cdtStart.setHours(2, 0, 0, 0);
      
      const cdtEnd = getLastSunday(year, 10);
      cdtEnd.setHours(2, 0, 0, 0);
      
      return date >= cdtStart && date < cdtEnd;
    
    case 'America/Santiago':
      // Chile (hemisferio sur): primer domingo de septiembre al primer domingo de abril
      const clstStart = getFirstSunday(year, 9);
      clstStart.setHours(0, 0, 0, 0);
      
      // Si estamos antes de abril, el DST empezó el año anterior
      if (date.getMonth() < 3) {
        const clstEndCurrent = getFirstSunday(year, 4);
        clstEndCurrent.setHours(0, 0, 0, 0);
        return date < clstEndCurrent;
      }
      
      return date >= clstStart;
      
    default:
      // Zonas sin cambio de horario
      return false;
  }
}

/**
 * 🔄 FUNCIÓN ACTUALIZADA: Obtiene el offset correcto para una fecha y timezone específicos
 * @param date - Fecha
 * @param timezone - Zona horaria
 */
export function getTimezoneOffset(date: Date, timezone: string): string {
  const baseOffset = TIMEZONE_MAP[timezone]?.offset || '+00:00';
  
  // Mapeo extendido para DST
  const dstOffsets: Record<string, string> = {
    'Europe/Madrid': '+02:00',
    'Europe/Paris': '+02:00',
    'Europe/Berlin': '+02:00',
    'Europe/London': '+01:00',
    'America/New_York': '-04:00',
    'America/Los_Angeles': '-07:00',
    'America/Mexico_City': '-05:00',
    'America/Santiago': '-03:00'
  };
  
  // Si la zona tiene DST y está activo, usar el offset de verano
  if (isDST(date, timezone) && dstOffsets[timezone]) {
    return dstOffsets[timezone];
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