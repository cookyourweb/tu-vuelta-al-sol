// types/astrology/unified-types.ts
// TIPOS UNIFICADOS PARA TODO EL SISTEMA ASTROLÓGICO

export type AspectFilter = 'all' | 'major' | 'minor'; // Definición de AspectFilter
export type AspectType = 
  'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile' |
  'quincunx' | 'semisextile' | 'sesquiquadrate' | 'semisquare' |
  'quintile' | 'biquintile'; // Definición de AspectType

export type ExtendedPlanet = PlanetName | 'Nodo Norte' | 'Nodo Sur' | 'Quirón' | 'Lilith'; // Definición de ExtendedPlanet

// ==========================================
// IMPORTAR Y RE-EXPORTAR TIPOS EXISTENTES
// ==========================================

// Tipos base de Prokerala
export type { 
  ZodiacSign as ProkeralaZodiacSign, 
  PlanetName as ProkeralaPlanetName,
  Planet,
  House,
  Aspect,
  Angle
} from '@/lib/prokerala/types';

// ==========================================
// TIPOS UNIFICADOS PRINCIPALES
// ==========================================

export type ZodiacSign = 
  'Aries' | 'Tauro' | 'Géminis' | 'Cáncer' | 'Leo' | 'Virgo' | 
  'Libra' | 'Escorpio' | 'Sagitario' | 'Capricornio' | 'Acuario' | 'Piscis';

export type PlanetName = 
  'Sol' | 'Luna' | 'Mercurio' | 'Venus' | 'Marte' | 'Júpiter' | 
  'Saturno' | 'Urano' | 'Neptuno' | 'Plutón' | 'Quirón' | 'Lilith' | 
  'Nodo N Verdadero' | 'Nodo S Verdadero';

export type ElementType = 'fire' | 'earth' | 'air' | 'water';
export type ModeType = 'cardinal' | 'fixed' | 'mutable';

// Tipos específicos para eventos personalizados
export type EventType = 
  'solar_activation' | 'lunar_resonance' | 'life_purpose_activation' | 
  'venus_harmony' | 'mars_action' | 'mercury_communication' | 
  'jupiter_expansion' | 'saturn_discipline' | 'uranus_innovation' | 
  'neptune_intuition' | 'pluto_transformation' |
  // Tipos de eventos astrológicos tradicionales
  'lunar_phase' | 'retrograde' | 'eclipse' | 'planetary_transit' | 'aspect' | 'seasonal';

// ==========================================
// INTERFACES PARA CONTEXTO PERSONAL
// ==========================================

export interface PersonalContext {
  natalConnection: string;
  progressedConnection: string | null;
  personalTheme: string;
  lifeArea: string;
}

export interface PersonalizedEventContext {
  relevantPlanet: string;
  relevantSign: string;
  natalConnection: string;
  progressedConnection: string | null;
  personalTheme: string;
  lifeArea: string;
}

export interface UserContext {
  name: string;
  age: number;
  place: string;
  signs: {
    sun: string;
    moon: string;
    ascendant: string;
    mercury: string;
    venus: string;
    mars: string;
  };
  houses: {
    sun: number;
    moon: number;
    mercury: number;
    venus: number;
    mars: number;
  };
  lifeThemes: string[];
  strengths: string[];
  challenges: string[];
}

// ==========================================
// INTERFACES DE ANÁLISIS ASTROLÓGICO
// ==========================================

export interface AstrologicalAnalysis {
  dominantElements: ElementType[];
  dominantMode: ModeType;
  lifeThemes: string[];
  strengths: string[];
  challenges: string[];
}

export interface ProgressedAnalysis {
  activeProgressions: {
    planet: string;
    from: any;
    to: any;
    meaning: string;
  }[];
  year: number;
  focus: string;
}

// ==========================================
// INTERFACES PARA EVENTOS Y INTERPRETACIONES
// ==========================================

export interface ActionPlan {
  category: 'trabajo' | 'amor' | 'salud' | 'dinero' | 'crecimiento' | 'relaciones' | 'creatividad';
  action: string;
  timing: 'inmediato' | 'esta_semana' | 'este_mes' | 'próximo_trimestre';
  difficulty: 'fácil' | 'moderado' | 'desafiante';
  impact: 'bajo' | 'medio' | 'alto';
}

export interface PersonalizedInterpretation {
  meaning: string;
  lifeAreas: string[];
  advice: string;
  mantra: string;
  ritual: string;
  actionPlan: ActionPlan[];
  warningsAndOpportunities: {
    warnings: string[];
    opportunities: string[];
  };
}

export interface AstrologicalEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: EventType; // CORREGIDO: Usar EventType específico
  priority: 'high' | 'medium' | 'low';
  planet?: string;
  sign?: string;
  personalContext?: PersonalContext;
  userContext?: UserContext;
  aiInterpretation?: {
    meaning: string;
    lifeAreas: string[];
    advice: string;
    mantra: string;
    ritual: string;
    actionPlan: ActionPlan[];
    warningsAndOpportunities: {
      warnings: string[];
      opportunities: string[];
    };
    personalContext?: {
      forAge: number;
      forLocation: string;
      natalConnections: string;
      progressedConnections: string | null;
      hasRealChartData: boolean;
      interpretationMethod?: string;
      evolutionaryMeaning?: string;
      practicalAdvice?: string;
    };
  };
}

// ==========================================
// INTERFACE DE PERFIL DE USUARIO COMPLETO
// ==========================================

export interface UserProfile {
  userId: string;
  name: string;
  birthDate: string;
  currentAge: number;
  nextAge: number;
  latitude: number;
  longitude: number;
  timezone: string;
  place: string;
  natalChart?: any;
  astrological: {
    signs: {
      sun: string;
      moon: string;
      ascendant: string;
      mercury: string;
      venus: string;
      mars: string;
    };
    houses: {
      sun: number;
      moon: number;
      mercury: number;
      venus: number;
      mars: number;
    };
    dominantElements: ElementType[];
    dominantMode: ModeType;
    lifeThemes: string[];
    strengths: string[];
    challenges: string[];
    progressions?: ProgressedAnalysis | null;
  };
}

// ==========================================
// TIPOS PARA EVENTOS PERSONALIZADOS
// ==========================================

export interface PersonalizedEventType {
  type: EventType; // CORREGIDO: Usar EventType específico
  frequency: number;
  personalContext: PersonalizedEventContext;
}

// ==========================================
// COMPATIBILIDAD CON TIPOS EXISTENTES
// ==========================================

// Para compatibilidad con AstronomicalEvent existente
export interface AstronomicalEvent extends AstrologicalEvent {
  importance: 'high' | 'medium' | 'low'; // Alias para priority
  mantra?: string;
  ritual?: string;
  action?: string;
  avoid?: string;
}

// Función de conversión para compatibilidad
export function astroToAstronomical(event: AstrologicalEvent): AstronomicalEvent {
  return {
    ...event,
    importance: event.priority,
    mantra: event.aiInterpretation?.mantra,
    ritual: event.aiInterpretation?.ritual,
    action: event.aiInterpretation?.advice,
    avoid: event.aiInterpretation?.warningsAndOpportunities?.warnings?.[0]
  };
}

// ==========================================
// FUNCIONES DE UTILIDAD PARA TIPOS
// ==========================================

export function isElementType(value: string): value is ElementType {
  return ['fire', 'earth', 'air', 'water'].includes(value);
}

export function isModeType(value: string): value is ModeType {
  return ['cardinal', 'fixed', 'mutable'].includes(value);
}

export function getSignElement(sign: string): ElementType | null {
  const elements: Record<string, ElementType> = {
    'Aries': 'fire', 'Leo': 'fire', 'Sagittarius': 'fire',
    'Taurus': 'earth', 'Virgo': 'earth', 'Capricorn': 'earth',
    'Gemini': 'air', 'Libra': 'air', 'Aquarius': 'air',
    'Cancer': 'water', 'Scorpio': 'water', 'Pisces': 'water'
  };
  const element = elements[sign];
  return isElementType(element) ? element : null;
}

export function getSignMode(sign: string): ModeType | null {
  const modes: Record<string, ModeType> = {
    'Aries': 'cardinal', 'Cancer': 'cardinal', 'Libra': 'cardinal', 'Capricorn': 'cardinal',
    'Taurus': 'fixed', 'Leo': 'fixed', 'Scorpio': 'fixed', 'Aquarius': 'fixed',
    'Gemini': 'mutable', 'Virgo': 'mutable', 'Sagittarius': 'mutable', 'Pisces': 'mutable'
  };
  const mode = modes[sign];
  return isModeType(mode) ? mode : null;
}