//src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina múltiples clases de Tailwind y las fusiona correctamente
 * Utiliza clsx para combinar las clases condicionales
 * Utiliza tailwind-merge para resolver conflictos de clases de Tailwind
 * 
 * @param inputs Clases de CSS y/o expresiones condicionales
 * @returns String de clases CSS combinadas y optimizadas
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea una fecha en español
 * 
 * @param date Fecha a formatear
 * @param options Opciones de formato
 * @returns String con la fecha formateada
 */
export function formatDate(date: Date | string, options: Intl.DateTimeFormatOptions = {}): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('es-ES', defaultOptions).format(dateObj);
}

/**
 * Capitaliza la primera letra de un string
 * 
 * @param str String a capitalizar
 * @returns String con la primera letra en mayúscula
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Genera un ID único
 * 
 * @returns String con ID único
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Convierte grados decimales a grados, minutos y segundos
 * 
 * @param decimal Grados en formato decimal
 * @returns Objeto con grados, minutos y segundos
 */
export function decimalToDMS(decimal: number): { degrees: number; minutes: number; seconds: number } {
  const degrees = Math.floor(decimal);
  const minutesDecimal = (decimal - degrees) * 60;
  const minutes = Math.floor(minutesDecimal);
  const seconds = Math.floor((minutesDecimal - minutes) * 60);
  
  return { degrees, minutes, seconds };
}

/**
 * Formatea grados decimales como texto en formato DMS
 * 
 * @param decimal Grados en formato decimal
 * @param showSeconds Si se deben mostrar los segundos
 * @returns String formateado (ej: "15° 30' 45"")
 */
export function formatDegrees(decimal: number, showSeconds = false): string {
  const { degrees, minutes, seconds } = decimalToDMS(decimal);
  
  if (showSeconds) {
    return `${degrees}° ${minutes}' ${seconds}"`;
  }
  
  return `${degrees}° ${minutes}'`;
}

/**
 * Verifica si un objeto está vacío
 * 
 * @param obj Objeto a verificar
 * @returns true si el objeto está vacío, false en caso contrario
 */
export function isEmptyObject(obj: object): boolean {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

/**
 * Trunca un texto a una longitud máxima y añade puntos suspensivos
 * s<
 * @param text Texto a truncar
 * @param maxLength Longitud máxima
 * @returns Texto truncado
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Retrasa la ejecución de una función
 * 
 * @param ms Milisegundos de espera
 * @returns Promesa que resuelve después del tiempo especificado
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}