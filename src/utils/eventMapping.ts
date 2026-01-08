// =============================================================================
// 🔄 EVENT MAPPING UTILITIES
// src/utils/eventMapping.ts
// =============================================================================
// Mapea eventos del calendario (AstrologicalEvent) al formato requerido
// por el sistema de interpretaciones personalizadas (EventData)
// =============================================================================

import type { AstrologicalEvent } from '@/types/astrology/unified-types';
import type { EventData } from '@/utils/prompts/eventInterpretationPrompt';

// =============================================================================
// MAIN MAPPING FUNCTION
// =============================================================================

/**
 * Mapea un evento del calendario (AstrologicalEvent) al formato
 * requerido por el sistema de interpretaciones personalizadas (EventData)
 *
 * @param event - Evento del calendario
 * @param options - Opciones adicionales para el mapeo
 * @returns EventData compatible con el sistema de interpretaciones
 */
export function mapAstrologicalEventToEventData(
  event: AstrologicalEvent,
  options?: {
    userNatalChart?: any; // Para cálculo preciso de casa (futuro)
    defaultHouse?: number; // Fallback si no se puede calcular
  }
): EventData {

  // 1. Mapear tipo de evento
  const type = mapEventType(event);

  // 2. Obtener casa natal donde cae el evento
  // Si el evento ya tiene 'house', usarlo
  // Si no, usar defaultHouse o 1 como fallback
  const house = event.house || options?.defaultHouse || 1;

  // 3. Extraer planetas involucrados
  const planetsInvolved = extractPlanetsInvolved(event);

  // 4. Construir EventData base
  const eventData: EventData = {
    type,
    date: event.date,
    sign: event.sign,
    house,
    planetsInvolved: planetsInvolved.length > 0 ? planetsInvolved : undefined
  };

  // 5. Si es tránsito, agregar planetas específicos
  if (type === 'transito' && event.planet) {
    eventData.transitingPlanet = event.planet;

    // TODO: Detectar planeta natal activado desde metadata del evento
    // Por ahora, si el evento tiene información adicional, usarla
    if (event.type === 'planetary_transit') {
      // Placeholder: el planeta natal es el mismo (simplificación)
      eventData.natalPlanet = event.planet;
    }
  }

  // 6. Si es aspecto, agregar tipo de aspecto
  if (type === 'aspecto') {
    eventData.aspectType = extractAspectType(event);
  }

  return eventData;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Mapea el tipo de evento del calendario al tipo esperado por interpretaciones
 */
function mapEventType(event: AstrologicalEvent): EventData['type'] {

  if (event.type === 'lunar_phase') {
    // Detectar si es Luna Nueva o Luna Llena por el título
    const titleLower = event.title.toLowerCase();

    if (titleLower.includes('nueva')) {
      return 'luna_nueva';
    } else if (titleLower.includes('llena')) {
      return 'luna_llena';
    } else {
      // Si no está claro, usar descripción o defaultear a luna_nueva
      const descLower = event.description?.toLowerCase() || '';
      if (descLower.includes('llena') || descLower.includes('full')) {
        return 'luna_llena';
      }
      return 'luna_nueva';
    }
  }

  else if (event.type === 'retrograde' || event.type === 'planetary_transit') {
    return 'transito';
  }

  else if (event.type === 'eclipse') {
    return 'aspecto'; // Los eclipses se tratan como aspectos especiales
  }

  else if (event.type === 'aspect') {
    return 'aspecto';
  }

  else {
    // Default para eventos desconocidos
    return 'aspecto';
  }
}

/**
 * Extrae planetas involucrados del evento
 */
function extractPlanetsInvolved(event: AstrologicalEvent): string[] {
  const planets: string[] = [];

  if (event.planet) {
    planets.push(event.planet);
  }

  // Si hay metadata adicional con planetas, extraerlos
  // (Esto dependerá de la estructura exacta de tus eventos)
  // Por ahora, solo usamos el campo 'planet' principal

  return planets;
}

/**
 * Extrae el tipo de aspecto del evento
 */
function extractAspectType(event: AstrologicalEvent): string {
  const titleLower = event.title.toLowerCase();
  const descLower = event.description?.toLowerCase() || '';

  // Buscar tipos de aspectos comunes en el título o descripción
  if (titleLower.includes('conjunción') || descLower.includes('conjunción')) {
    return 'conjunción';
  }
  if (titleLower.includes('oposición') || descLower.includes('oposición')) {
    return 'oposición';
  }
  if (titleLower.includes('trígono') || descLower.includes('trígono')) {
    return 'trígono';
  }
  if (titleLower.includes('cuadratura') || descLower.includes('cuadratura')) {
    return 'cuadratura';
  }
  if (titleLower.includes('sextil') || descLower.includes('sextil')) {
    return 'sextil';
  }

  // Default
  return 'conjunción';
}

// =============================================================================
// HOUSE CALCULATION (ADVANCED - Para implementación futura)
// =============================================================================

/**
 * Calcula en qué casa natal cae un evento astrológico
 * basado en el signo del evento y la carta natal del usuario
 *
 * @param eventSign - Signo zodiacal del evento (ej: "Aries")
 * @param eventDegree - Grado del evento en el signo (0-30)
 * @param natalChart - Carta natal del usuario
 * @returns Número de casa (1-12)
 *
 * TODO: Implementar cálculo real usando astronomy-engine
 */
export function calculateHouseForEvent(
  eventSign: string,
  eventDegree: number,
  natalChart: any
): number {

  if (!natalChart || !natalChart.houses) {
    console.warn('No natal chart houses available, defaulting to house 1');
    return 1;
  }

  // Convertir signo + grado a longitud eclíptica absoluta (0-360°)
  const longitude = signAndDegreeToLongitude(eventSign, eventDegree);

  // Buscar en qué casa cae esa longitud
  const houses = natalChart.houses;

  for (let i = 0; i < houses.length; i++) {
    const currentHouse = houses[i];
    const nextHouse = houses[(i + 1) % houses.length];

    const currentCusp = currentHouse.degree || 0;
    const nextCusp = nextHouse.degree || 0;

    // Manejar wrap-around en 360°
    if (nextCusp > currentCusp) {
      // Caso normal: nextCusp > currentCusp
      if (longitude >= currentCusp && longitude < nextCusp) {
        return i + 1;
      }
    } else {
      // Caso wrap-around: nextCusp < currentCusp (cruce de 0°)
      if (longitude >= currentCusp || longitude < nextCusp) {
        return i + 1;
      }
    }
  }

  // Fallback
  return 1;
}

/**
 * Convierte signo zodiacal + grado a longitud eclíptica absoluta (0-360°)
 *
 * @param sign - Signo zodiacal (ej: "Aries", "Tauro", etc.)
 * @param degree - Grado dentro del signo (0-30)
 * @returns Longitud absoluta (0-360°)
 */
export function signAndDegreeToLongitude(sign: string, degree: number): number {
  const signs = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer',
    'Leo', 'Virgo', 'Libra', 'Escorpio',
    'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];

  const signIndex = signs.findIndex(s =>
    s.toLowerCase() === sign.toLowerCase()
  );

  if (signIndex === -1) {
    console.warn(`Unknown sign: ${sign}, defaulting to 0°`);
    return 0;
  }

  // Cada signo ocupa 30° de la eclíptica
  const longitude = signIndex * 30 + degree;

  // Normalizar a rango 0-360
  return longitude % 360;
}

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Valida que un EventData tenga todos los campos requeridos
 */
export function validateEventData(eventData: EventData): boolean {
  if (!eventData.type) return false;
  if (!eventData.date) return false;
  if (eventData.house === undefined || eventData.house < 1 || eventData.house > 12) return false;

  return true;
}

/**
 * Crea un EventData placeholder para casos donde faltan datos
 */
export function createFallbackEventData(event: AstrologicalEvent): EventData {
  return {
    type: 'aspecto',
    date: event.date || new Date().toISOString().split('T')[0],
    sign: event.sign || 'Desconocido',
    house: 1, // Fallback a casa 1
    planetsInvolved: event.planet ? [event.planet] : undefined
  };
}
