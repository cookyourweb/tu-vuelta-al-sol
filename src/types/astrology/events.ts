// =============================================================================
// 🌙 ASTROLOGY EVENTS TYPES
// src/types/astrology/events.ts
// =============================================================================
// Tipos centralizados para todos los eventos astrológicos de la agenda
// =============================================================================

// =============================================================================
// BASE EVENT TYPES (from solarYearEvents.ts)
// =============================================================================

/**
 * Tipo base para fases lunares (Luna Nueva y Luna Llena)
 */
export interface LunarPhase {
  type: 'new_moon' | 'full_moon';
  date: Date | string;
  sign: string;
  degree: number;
  description: string;
  house?: number; // Casa natal donde cae el evento
}

/**
 * Tipo base para planetas retrógrados
 */
export interface Retrograde {
  planet: string;
  startDate: Date | string;
  endDate: Date | string;
  startSign: string;
  endSign: string;
  startDegree?: number;
  endDegree?: number;
  description: string;
  house?: number;
}

/**
 * Tipo base para eclipses (solares y lunares)
 */
export interface Eclipse {
  type: 'solar' | 'lunar';
  date: Date | string;
  sign: string;
  degree: number;
  magnitude: number;
  description: string;
  house?: number;
}

/**
 * Tipo base para ingresos planetarios (cambio de signo)
 */
export interface PlanetaryIngress {
  planet: string;
  date: Date | string;
  fromSign: string;
  toSign: string;
  toDegree?: number;
  description: string;
  house?: number;
}

/**
 * Tipo base para eventos estacionales (equinoccios y solsticios)
 */
export interface SeasonalEvent {
  type: 'spring_equinox' | 'summer_solstice' | 'autumn_equinox' | 'winter_solstice';
  date: Date | string;
  description: string;
  sign?: string;
  degree?: number;
  house?: number;
}

/**
 * Colección completa de eventos del año solar
 */
export interface SolarYearEvents {
  lunarPhases: LunarPhase[];
  retrogrades: Retrograde[];
  eclipses: Eclipse[];
  planetaryIngresses: PlanetaryIngress[];
  seasonalEvents: SeasonalEvent[];
}

// =============================================================================
// GENERIC EVENT TYPES (for UI components)
// =============================================================================

/**
 * Tipo genérico para eventos de mes (usado en MesPage, etc.)
 * Acepta propiedades en inglés (estándar) y español (legacy)
 */
export interface MonthEvent {
  date: Date | string;
  type: string;
  sign?: string;
  signo?: string; // Legacy - se mantiene para compatibilidad
  description?: string;
  house?: number;
  interpretation?: any; // Interpretación personalizada del evento (si existe)
}

/**
 * Datos de mes para la agenda
 */
export interface MonthData {
  month: string;
  year: number;
  eclipses: MonthEvent[];
  lunas_nuevas: MonthEvent[];
  lunas_llenas: MonthEvent[];
  retrogrades?: MonthEvent[];
  ingresos?: MonthEvent[];
  estacionales?: MonthEvent[];
}

/**
 * Interpretación mensual personalizada
 */
export interface MonthInterpretation {
  mes: string;
  portada_mes?: string;
  interpretacion_mensual?: string;
  mantra_mensual?: string;
  ritual_del_mes?: string;
  eventos_destacados?: string[];
}

// =============================================================================
// EVENT CATEGORY TYPES
// =============================================================================

/**
 * Categorías de eventos para clasificación
 */
export type EventCategory =
  | 'lunar_phase'
  | 'retrograde'
  | 'eclipse'
  | 'ingress'
  | 'seasonal';

/**
 * Evento con categoría (para timeline view)
 */
export interface CategorizedEvent extends MonthEvent {
  category: EventCategory;
}

// =============================================================================
// EVENT ID GENERATION UTILITIES
// =============================================================================

/**
 * Formato estándar para IDs de eventos
 * Ejemplos:
 * - luna_nueva_2025-05-15_tauro
 * - eclipse_2025-10-14_libra
 * - retrograde_mercurio_2025-08-23
 */
export type EventId = string;

/**
 * Genera un ID único para un evento
 */
export function generateEventId(
  type: string,
  date: Date | string,
  sign?: string,
  planet?: string
): EventId {
  const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
  const signLower = sign?.toLowerCase() || '';
  const planetLower = planet?.toLowerCase() || '';

  if (planet) {
    return `${type}_${planetLower}_${dateStr}`;
  } else if (sign) {
    return `${type}_${dateStr}_${signLower}`;
  } else {
    return `${type}_${dateStr}`;
  }
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

/**
 * Verifica si un evento es una fase lunar
 */
export function isLunarPhase(event: any): event is LunarPhase {
  return event && (event.type === 'new_moon' || event.type === 'full_moon');
}

/**
 * Verifica si un evento es un eclipse
 */
export function isEclipse(event: any): event is Eclipse {
  return event && (event.type === 'solar' || event.type === 'lunar');
}

/**
 * Verifica si un evento es un retrógrado
 */
export function isRetrograde(event: any): event is Retrograde {
  return event && event.planet && event.startDate && event.endDate;
}

/**
 * Verifica si un evento es un ingreso planetario
 */
export function isPlanetaryIngress(event: any): event is PlanetaryIngress {
  return event && event.planet && event.fromSign && event.toSign;
}

/**
 * Verifica si un evento es estacional
 */
export function isSeasonalEvent(event: any): event is SeasonalEvent {
  return event && (
    event.type === 'spring_equinox' ||
    event.type === 'summer_solstice' ||
    event.type === 'autumn_equinox' ||
    event.type === 'winter_solstice'
  );
}

// =============================================================================
// EVENT INTERPRETATION TYPES
// =============================================================================

/**
 * Input para generar interpretación de evento
 */
export interface EventInterpretationInput {
  userId: string;
  event: {
    type: string;
    date: string;
    sign: string;
    house: number;
    planetsInvolved?: string[];
    transitingPlanet?: string;
    natalPlanet?: string;
    aspectType?: string;
  };
  natalChart: any;
  solarReturn: any;
  natalInterpretation: any;
}

/**
 * Output de interpretación de evento
 */
export interface EventInterpretation {
  titulo_evento: string;
  para_ti_especificamente: string;
  tu_fortaleza_a_usar: {
    fortaleza: string;
    como_usarla: string;
  };
  tu_bloqueo_a_trabajar: {
    bloqueo: string;
    reframe: string;
  };
  mantra_personalizado: string;
  ejercicio_para_ti: string;
  consejo_especifico: string;
  timing_evolutivo: {
    que_sembrar: string;
    cuando_actuar: string;
    resultado_esperado: string;
  };
  analisis_tecnico?: {
    evento_en_casa_natal: number;
    significado_casa: string;
    planetas_natales_activados: string[];
    aspectos_cruzados: string[];
  };
}

// =============================================================================
// EXPORTS
// =============================================================================
// All types are already exported at their definition point above
