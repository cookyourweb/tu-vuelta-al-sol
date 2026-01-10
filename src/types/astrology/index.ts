/**
 * Índice principal de tipos astrológicos
 * Archivo: types/astrology/index.ts
 */

// =============================================================================
// TIPOS UNIFICADOS PRINCIPALES (MÁXIMA PRIORIDAD)
// =============================================================================

export type {
  UserProfile,
  AstrologicalEvent,
  PersonalizedInterpretation,
  PersonalizedEventType,
  AstrologicalAnalysis,
  ProgressedAnalysis,
  ElementType,
  ModeType,
  ActionPlan,
  EventType,
  PersonalizedEventContext as PersonalContext,
} from './unified-types';

export {
  getSignElement,
  getSignMode
} from './unified-types';

// =============================================================================
// TIPOS DE PROKERALA
// =============================================================================

export type { 
  ZodiacSign as ProkeralaZodiacSign,
  PlanetName as ProkeralaPlanetName,
  Planet as ProkeralaPlanet,
  House as ProkeralaHouse,
  Aspect as ProkeralaAspect,
  Angle as ProkeralaAngle
} from '@/lib/prokerala/types';

// Re-exportar Planet desde Prokerala para compatibilidad
export type { Planet } from '@/lib/prokerala/types';

// Exportar tipos de aspectos desde aspects.ts
export type { 
  PlanetaryAspect,
  AspectType,
  AspectFilter 
} from './aspects';

// =============================================================================
// ALIAS PARA COMPATIBILIDAD
// =============================================================================

export type { AstrologicalEvent as AstronomicalEvent } from './unified-types';

// =============================================================================
// FUNCIONES UTILITARIAS
// =============================================================================

export function convertEventsForAgenda(events: import('./unified-types').AstrologicalEvent[]): any[] {
  return events.map(event => ({
    ...event,
    importance: event.priority,
    mantra: event.aiInterpretation?.mantra,
    ritual: event.aiInterpretation?.ritual,
    action: event.aiInterpretation?.advice,
    avoid: event.aiInterpretation?.warningsAndOpportunities?.warnings?.[0]
  }));
}

// =============================================================================
// CONSTANTES ÚTILES
// =============================================================================

export const ZODIAC_SIGNS = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
] as const;

export const EVENT_TYPES = [
  'solar_activation', 'lunar_resonance', 'life_purpose_activation',
  'venus_harmony', 'mars_action', 'mercury_communication',
  'jupiter_expansion', 'saturn_discipline', 'uranus_innovation',
  'neptune_intuition', 'pluto_transformation'
] as const;

// =============================================================================
// TIPOS DE EVENTOS ASTROLÓGICOS (Agenda)
// =============================================================================

export type {
  LunarPhase,
  Retrograde,
  Eclipse,
  PlanetaryIngress,
  SeasonalEvent,
  SolarYearEvents,
  MonthEvent,
  MonthData,
  MonthInterpretation,
  EventCategory,
  CategorizedEvent,
  EventId,
  EventInterpretationInput,
  EventInterpretation,
} from './events';

export {
  generateEventId,
  isLunarPhase,
  isEclipse,
  isRetrograde,
  isPlanetaryIngress,
  isSeasonalEvent,
} from './events';