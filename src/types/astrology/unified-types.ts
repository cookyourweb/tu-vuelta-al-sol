// src/types/astrology/unified-types.ts - VERSIÓN CORREGIDA CON PLANETPOSITION COMPLETA

// ==========================================
// TIPOS BÁSICOS
// ==========================================

export type ElementType = 'fire' | 'earth' | 'air' | 'water';
export type ModeType = 'cardinal' | 'fixed' | 'mutable';

// ✅ TODOS LOS TIPOS DE EVENTOS POSIBLES
export type EventType = 
  | 'lunar_phase' | 'lunar_new' | 'lunar_full' | 'lunar_resonance'
  | 'solar_activation' | 'planetary_transit' | 'retrograde' | 'direct' 
  | 'aspect' | 'eclipse' | 'seasonal'
  | 'venus_harmony' | 'mars_action' | 'mercury_communication'
  | 'life_purpose_activation' | 'ai_generated';

// ==========================================
// EVENTOS ASTROLÓGICOS - SOLUCIÓN DEFINITIVA
// ==========================================

export interface AstrologicalEvent {
  id: string;
  type: EventType;
  date: string;
  time?: string;
  title: string;
  description: string;
  
  // ✅ SOLUCIÓN: AMBOS CAMPOS PARA COMPATIBILIDAD TOTAL
  importance: 'high' | 'medium' | 'low';  // NUEVO estándar
  priority: 'high' | 'medium' | 'low';    // COMPATIBILIDAD con código existente
  
  // Información planetaria
  planet?: string;
  sign?: string;
  house?: number;
  degree?: number;
  phase?: string;
  
  // ✅ INTERPRETACIONES: AMBOS NOMBRES SOPORTADOS
  personalInterpretation?: PersonalizedInterpretation;
  aiInterpretation?: PersonalizedInterpretation; // ALIAS para compatibilidad
  
  // Para compatibilidad con agenda existente
  avoid?: string;
  opportunity?: string;
  ritual?: string;
  mantra?: string;
  action?: string;

  // Contexto personalizado para eventos generados localmente
  personalContext?: PersonalizedEventContext;
  localInterpretation?: any;
  interpretationSource?: string;
}

// ==========================================
// INTERPRETACIONES Y PLANES DE ACCIÓN
// ==========================================

export interface ActionPlan {
  category: 'trabajo' | 'amor' | 'salud' | 'dinero' | 'crecimiento' | 'relaciones' | 'creatividad' | 'poder_planetario_personal' | 'activacion_planetaria';
  action: string;
  timing: 'inmediato' | 'esta_semana' | 'este_mes' | 'próximo_trimestre';
  difficulty: 'fácil' | 'moderado' | 'desafiante';
  impact: 'bajo' | 'medio' | 'alto' | 'transformador' | 'revolucionario' | 'activador';
}

export interface PersonalizedInterpretation {
  meaning: string;
  lifeAreas: string[];
  advice: string;
  mantra: string;
  ritual?: string;
  actionPlan?: ActionPlan[];
  warningsAndOpportunities?: {
    warnings: string[];
    opportunities: string[];
  };
  natalContext?: {
    conexionPlanetaria: string;
    casaActivada: number;
    temaVida: string;
    desafioEvolutivo: string;
  };
  // ✅ CAPA 2: Interpretación aplicada con estructura detallada
  capa_2_aplicado?: {
    cruce_con_tu_estructura_natal?: string;
    como_se_vive_en_ti?: string;
    riesgo_si_vives_inconscientemente?: string;
    uso_consciente_consejo_aplicado?: string;
    accion_practica_sugerida?: string;
    sintesis_final?: string;
  };
}

export interface DisruptiveInterpretation {
  shockValue: string;
  epicRealization: string;
  whatToExpect: {
    energeticShift: string;
    emotionalWave: string;
    mentalClarity: string;
    physicalSensations: string;
  };
  preparation: {
    ritual: string;
    mindsetShift: string;
    physicalAction: string;
    energeticProtection: string;
  };
  revolutionaryAdvice: {
    doThis: string[];
    avoidThis: string[];
    powerHours: string[];
    dangerZones: string[];
  };
  manifestation: {
    mantra: string;
    visualization: string;
    physicalGesture: string;
    elementalConnection: string;
  };
  expectedTransformation: {
    immediate: string;
    weekly: string;
    longTerm: string;
  };
}

// ==========================================
// PERFIL DE USUARIO COMPLETO
// ==========================================

export interface UserProfile {
  userId: string;
  name?: string;
  birthDate: string;
  birthTime?: string;
  birthPlace?: string;
  currentAge: number;
  nextAge: number;
  latitude: number;
  longitude: number;
  timezone: string;
  place: string;
  
  // Análisis astrológico básico
  astrological?: {
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
  };

  // Cartas detalladas para IA
  detailedNatalChart?: DetailedNatalChart;
  detailedProgressedChart?: DetailedProgressedChart;
}

// ✅ CORRECCIÓN: PlanetPosition COMPLETA con todas las propiedades necesarias
export interface PlanetPosition {
  sign: string;
  house: number;
  degree: number;
  longitude: number;
  retrograde: boolean;
  element?: ElementType;
  mode?: ModeType;
  
  // ✅ PROPIEDADES ADICIONALES para cartas progresadas
  symbol?: string;      // Símbolo del planeta (☉, ☽, etc.)
  meaning?: string;     // Interpretación del planeta progresado
  minutes?: number;     // Minutos del grado
}

export interface DetailedNatalChart {
  sol: PlanetPosition;
  luna: PlanetPosition;
  mercurio: PlanetPosition;
  venus: PlanetPosition;
  marte: PlanetPosition;
  jupiter: PlanetPosition;
  saturno: PlanetPosition;
  urano: PlanetPosition;
  neptuno: PlanetPosition;
  pluton: PlanetPosition;
  ascendente?: PlanetPosition;
  mediocielo?: PlanetPosition;
  aspectos: any[];
}

// ✅ CORRECCIÓN: DetailedProgressedChart con estructura flexible
export interface DetailedProgressedChart {
  // Planetas progresados principales
  sol_progresado: PlanetPosition;
  luna_progresada: PlanetPosition;
  mercurio_progresado?: PlanetPosition;
  venus_progresada?: PlanetPosition;
  marte_progresado?: PlanetPosition;
  jupiter_progresado?: PlanetPosition;
  saturno_progresado?: PlanetPosition;
  urano_progresado?: PlanetPosition;
  neptuno_progresado?: PlanetPosition;
  pluton_progresado?: PlanetPosition;
 
  
  // Puntos progresados
  ascendente?: PlanetPosition;
  mediocielo?: PlanetPosition;

  // ✅ COMPATIBILIDAD con diferentes estructuras de datos
  ascendant?: any;      // Para compatibilidad con APIs externas
  midheaven?: any;      // Para compatibilidad con APIs externas

  // Datos adicionales
  currentAge?: number;
  houses?: any[];
  aspectos_natales_progresados: any[];

  // ✅ AÑADIR ESTAS LÍNEAS:
  elementDistribution?: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };
  modalityDistribution?: {
    cardinal: number;
    fixed: number;
    mutable: number;
  };

  // Metadata
  generatedAt?: string;
  isMockData?: boolean;
  progressionPeriod?: any;

  // ✅ COMPATIBILIDAD con diferentes estructuras de datos
  planets?: any;        // Para compatibilidad con APIs externas
}

// ==========================================
// TIPOS PARA EVENTOS PERSONALIZADOS
// ==========================================

export interface PersonalizedEventContext {
  relevantPlanet: string;
  relevantSign: string;
  natalConnection: string;
  progressedConnection?: string | null;
  personalTheme: string;
  lifeArea: string;
}

export interface PersonalizedEventType {
  type: EventType;
  frequency: number;
  personalContext: PersonalizedEventContext;
}

export interface PersonalizedEventTypeWithContext extends PersonalizedEventType {
  personalContext: PersonalizedEventContext;
}

// ==========================================
// ANÁLISIS ASTROLÓGICO
// ==========================================

export interface AstrologicalAnalysis {
  dominantElements: ElementType[];
  dominantMode: ModeType;
  lifeThemes: string[];
  strengths: string[];
  challenges: string[];
  planetaryBalance: Record<string, number>;
  elementalBalance: Record<ElementType, number>;
  modalBalance: Record<ModeType, number>;
}

export interface ProgressedAnalysis {
  currentProgression: {
    age: number;
    period: string;
    description: string;
  };
  progressedPlanets: Record<string, PlanetPosition>;
  progressedAspects: any[];
  progressedHouses: any[];
  progressionThemes: string[];
  lifeLessons: string[];
}

// ==========================================
// FUNCIONES UTILITARIAS
// ==========================================

export function getSignElement(sign: string): ElementType {
  const elements: Record<string, ElementType> = {
    'Aries': 'fire', 'Leo': 'fire', 'Sagitario': 'fire',
    'Tauro': 'earth', 'Virgo': 'earth', 'Capricornio': 'earth',
    'Géminis': 'air', 'Libra': 'air', 'Acuario': 'air',
    'Cáncer': 'water', 'Escorpio': 'water', 'Piscis': 'water'
  };
  return elements[sign] || 'fire';
}

export function getSignMode(sign: string): ModeType {
  const modes: Record<string, ModeType> = {
    'Aries': 'cardinal', 'Cáncer': 'cardinal', 'Libra': 'cardinal', 'Capricornio': 'cardinal',
    'Tauro': 'fixed', 'Leo': 'fixed', 'Escorpio': 'fixed', 'Acuario': 'fixed',
    'Géminis': 'mutable', 'Virgo': 'mutable', 'Sagitario': 'mutable', 'Piscis': 'mutable'
  };
  return modes[sign] || 'cardinal';
}

// ✅ FUNCIÓN CLAVE: NORMALIZAR EVENTOS CON AMBOS CAMPOS
export function normalizeEvent(event: any): AstrologicalEvent {
  const priorityValue = event.priority || event.importance || 'medium';
  
  return {
    id: event.id || `event-${Date.now()}-${Math.random()}`,
    type: event.type || 'ai_generated',
    date: event.date,
    time: event.time,
    title: event.title,
    description: event.description,
    
    // ✅ AMBOS CAMPOS SIEMPRE PRESENTE
    importance: priorityValue,
    priority: priorityValue,
    
    planet: event.planet,
    sign: event.sign,
    house: event.house,
    degree: event.degree,
    phase: event.phase,
    
    // ✅ INTERPRETACIONES CON AMBOS NOMBRES
    personalInterpretation: event.personalInterpretation || event.aiInterpretation,
    aiInterpretation: event.personalInterpretation || event.aiInterpretation,
    
    avoid: event.avoid,
    opportunity: event.opportunity,
    ritual: event.ritual,
    mantra: event.mantra,
    action: event.action
  };
}

export function normalizeEvents(events: any[]): AstrologicalEvent[] {
  return events.map(normalizeEvent);
}

// ==========================================
// CONSTANTES ÚTILES
// ==========================================

export const ZODIAC_SIGNS = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
] as const;

export const PLANET_NAMES = [
  'Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 
  'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'
] as const;

export const HOUSE_THEMES: Record<number, string> = {
  1: 'Identidad y personalidad',
  2: 'Recursos y valores personales', 
  3: 'Comunicación y aprendizaje',
  4: 'Hogar y familia',
  5: 'Creatividad y diversión',
  6: 'Rutina y salud',
  7: 'Relaciones y partnerships',
  8: 'Transformación personal',
  9: 'Filosofía y expansión mental',
  10: 'Carrera y reputación',
  11: 'Amistades y grupos',
  12: 'Espiritualidad y subconsciente'
};

// ALIAS para compatibilidad con código existente
export type AstronomicalEvent = AstrologicalEvent;