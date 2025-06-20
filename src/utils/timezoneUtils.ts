// src/utils/astrology/timezoneUtils.ts
/**
 * Wrapper para compatibilidad - usa las funciones existentes de dateTimeUtils
 */

// Importar todo desde dateTimeUtils
// export * from '../dateTimeUtils';
// import { getTimezoneOffset, isDST, formatProkeralaCoordinates, validateCoordinates } from '../dateTimeUtils';

// Ajusta la ruta al archivo correcto si está en otra ubicación, por ejemplo:
export * from './dateTimeUtils';
import { getTimezoneOffset, isDST, formatProkeralaCoordinates, validateCoordinates } from './dateTimeUtils';

// Función adicional para convertToUTC que falta en dateTimeUtils
export function convertToUTC(
  birthDate: string, 
  birthTime: string, 
  timezone: string
): { utcTime: string; offset: string; isDST: boolean } {
  
  const formattedTime = birthTime.length === 5 ? `${birthTime}:00` : birthTime;
  const dateObj = new Date(`${birthDate}T${formattedTime}`);
  
  const offset = getTimezoneOffset(dateObj, timezone);
  const isDSTActive = isDST(dateObj, timezone);
  
  // Calcular UTC
  const [hours, minutes, seconds = '00'] = birthTime.split(':');
  const offsetHours = parseInt(offset.substring(1, 3), 10) * (offset[0] === '+' ? -1 : 1);
  const offsetMinutes = parseInt(offset.substring(4, 6), 10) * (offset[0] === '+' ? -1 : 1);
  
  let utcHours = parseInt(hours, 10) + offsetHours;
  let utcMinutes = parseInt(minutes, 10) + offsetMinutes;
  
  if (utcMinutes < 0) {
    utcMinutes += 60;
    utcHours -= 1;
  } else if (utcMinutes >= 60) {
    utcMinutes -= 60;
    utcHours += 1;
  }
  
  if (utcHours < 0) utcHours += 24;
  if (utcHours >= 24) utcHours -= 24;
  
  const utcTime = `${String(utcHours).padStart(2, '0')}:${String(utcMinutes).padStart(2, '0')}:${seconds}`;
  
  return { utcTime, offset, isDST: isDSTActive };
}

// Wrapper para formatCoordinates
export function formatCoordinates(
  latitude: number | string, 
  longitude: number | string
): { lat: number; lon: number; formatted: string } {
  const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
  const lon = typeof longitude === 'string' ? parseFloat(longitude) : longitude;
  
  const formatted = formatProkeralaCoordinates(lat, lon);
  
  return { lat, lon, formatted };
}

// Función validateBirthData simplificada
export function validateBirthData(data: any) {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!data.birthDate) errors.push('Fecha requerida');
  
  const lat = typeof data.latitude === 'string' ? parseFloat(data.latitude) : data.latitude;
  const lon = typeof data.longitude === 'string' ? parseFloat(data.longitude) : data.longitude;
  
  if (!validateCoordinates(lat, lon)) {
    errors.push('Coordenadas inválidas');
  }
  
  const { utcTime, offset, isDST } = convertToUTC(
    data.birthDate, 
    data.birthTime || '12:00:00', 
    data.timezone || 'UTC'
  );
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    correctedData: {
      ...data,
      birthTime: data.birthTime || '12:00:00',
      latitude: lat,
      longitude: lon,
      coordinatesFormatted: `${lat},${lon}`,
      birthTimeUTC: utcTime,
      timezoneOffset: offset,
      isDST
    }
  };
}

// Alias para compatibilidad
export { createProkeralaParams } from './dateTimeUtils';

// Datos de ejemplo
export const HOSPITAL_LA_MILAGROSA = {
  coordinates: { latitude: 40.4383, longitude: -3.7058 },
  timezone: 'Europe/Madrid'
};