// src/types/astrology/unified-types.ts
// TIPOS UNIFICADOS PARA SISTEMA ASTROLÓGICO COMPLETO

// ==========================================
// TIPOS BÁSICOS
// ==========================================

export type ElementType = 'fire' | 'earth' | 'air' | 'water';
export type ModeType = 'cardinal' | 'fixed' | 'mutable';
export type EventType = 
  | 'lunar_phase' 
  | 'lunar_resonance'
  | 'solar_activation'
  | 'planetary_transit' 
  | 'retrograde' 
  | 'direct' 
  | 'aspect' 
  | 'eclipse' 
  | 'seasonal'
  | 'venus_harmony'
  | 'mars_action'
  | 'mercury_communication'
  | 'life_purpose_activation';

export type PersonalizedEventType = 
  | 'solar_activation'
  | 'lunar_resonance' 
  | 'life_purpose_activation'
  | 'venus_harmony'
  | 'mars_action'
  | 'mercury_communication'
  | 'lunar_phase'
  | 'planetary_transit'
  | 'eclipse';

export interface PersonalizedEventTypeWithContext {
  type: PersonalizedEventType;
  frequency: number;
  personalContext: PersonalizedEventContext;
}

// ==========================================
// PERFIL DE USUARIO
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
  
  astrological?: AstrologicalAnalysis;
}

export interface AstrologicalAnalysis {
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
  progressions?: any; // Análisis de progresiones (opcional)
}

// ==========================================
// ANÁLISIS PROGRESADO
// ==========================================

export interface ProgressedAnalysis {
  currentYear: number;
  progessedSun: {
    sign: string;
    house: number;
    degree: number;
  };
  progressedMoon: {
    sign: string;
    house: number;
    phase: string;
  };
  majorThemes: string[];
  opportunities: string[];
  challenges: string[];
  keyDates: Array<{
    date: string;
    event: string;
    significance: string;
  }>;
}

// ==========================================
// EVENTOS ASTROLÓGICOS
// ==========================================

export interface AstrologicalEvent {
  id: string;
  type: EventType | string;
  date: string;
  time?: string;
  title: string;
  description: string;
  priority?: 'high' | 'medium' | 'low';
  planet?: string;
  sign?: string;
  house?: number;
  phase?: string;
  
  // Interpretación IA opcional
  aiInterpretation?: PersonalizedInterpretation;
  
  // Contexto personalizado opcional
  personalContext?: PersonalizedEventContext;
}

export interface PersonalizedEventContext {
  relevantPlanet?: string;
  relevantSign?: string;
  natalConnection?: string;
  progressedConnection?: string | null;
  personalTheme?: string;
  lifeArea?: string;
}

// ==========================================
// INTERPRETACIONES PERSONALIZADAS
// ==========================================

export interface PersonalizedInterpretation {
  meaning: string;
  lifeAreas: string[];
  advice: string | string[];
  mantra: string;
  ritual: string;
  actionPlan?: ActionPlan[];
  warningsAndOpportunities?: {
    warnings: string[];
    opportunities: string[];
  };
}

export interface ActionPlan {
  // Para compatibilidad con ambos formatos
  category?: string;
  action?: string;
  timing?: string;
  difficulty?: string;
  impact?: string;
  
  // Formato alternativo
  steps?: string[];
  powerHours?: string[];
  dangerZones?: string[];
  timeframe?: 'immediate' | 'weekly' | 'monthly' | 'quarterly';
  objectives?: string[];
  actions?: string[];
  milestones?: string[];
  metrics?: string[];
}

// ==========================================
// FUNCIONES AUXILIARES DE SIGNOS
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

// ==========================================
// TIPOS PARA AGENDA
// ==========================================

export interface AgendaData {
  userProfile: UserProfile;
  events: AstrologicalEvent[];
  executiveSummary?: ExecutiveSummary;
  statistics?: EventStatistics;
  metadata?: {
    generatedAt: string;
    version: string;
    dataQuality: {
      completeness: number;
      hasNatalChart: boolean;
      hasProgressedChart: boolean;
      hasAIInterpretations: boolean;
    };
  };
}

export interface ExecutiveSummary {
  monthlyHighlights: string[];
  quarterlyFocus: string[];
  yearlyThemes: string[];
  priorityActions: ActionPlan[];
  keyInsights?: {
    dominantElements: string[];
    primaryChallenges: string[];
    biggestOpportunities: string[];
    overallTheme: string;
  };
}

export interface EventStatistics {
  totalEvents: number;
  byType: Record<string, number>;
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
  byMonth: Record<string, number>;
}

// ==========================================
// TIPOS PARA INTERPRETACIÓN DISRUPTIVA
// ==========================================

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
// EXPORTACIONES DE COMPATIBILIDAD
// ==========================================

export default {
  getSignElement,
  getSignMode
};