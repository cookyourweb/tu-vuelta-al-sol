// src/types/astrology/events.ts
// 🎯 EXTENSIÓN DE TIPOS EXISTENTES PARA EVENTOS ASTROLÓGICOS CON IA

import { PlanetName, ZodiacSign } from "@/lib/prokerala/types";

// Importar tipos base existentes


// ==========================================
// 🤖 TIPOS PARA IA Y PLANES DE ACCIÓN
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

export interface UserProfile {
  birthDate: string;
  currentAge: number;
  nextAge: number;
  natalChart?: any;
  latitude: number;
  longitude: number;
  timezone: string;
  place: string;
}

// ==========================================
// 🌟 EVENTOS ASTROLÓGICOS EXTENDIDOS
// ==========================================

export interface AstrologicalEvent {
  id: string;
  type: 'lunar_phase' | 'planetary_transit' | 'retrograde' | 'direct' | 'eclipse' | 'aspect' | 'seasonal';
  date: string;
  title: string;
  description: string;
  planet?: PlanetName | string;
  sign?: ZodiacSign | string;
  house?: number;
  degree?: number;
  priority: 'high' | 'medium' | 'low';
  isHybrid?: boolean;
  aiInterpretation?: PersonalizedInterpretation;
}

// ==========================================
// 🎯 COMPATIBILIDAD CON TIPOS EXISTENTES
// ==========================================

// Extender el tipo existente AstronomicalEvent para compatibilidad
export interface AstronomicalEvent extends AstrologicalEvent {
  importance: 'high' | 'medium' | 'low'; // Alias para priority
  mantra?: string;     // Compatibilidad con componente existente
  ritual?: string;     // Compatibilidad con componente existente
  action?: string;     // Compatibilidad con componente existente
  avoid?: string;      // Compatibilidad con componente existente
}

// ==========================================
// 🔄 FUNCIONES DE CONVERSIÓN
// ==========================================

/**
 * Convierte AstrologicalEvent a AstronomicalEvent para compatibilidad
 */
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

/**
 * Convierte array de AstrologicalEvent a AstronomicalEvent
 */
export function convertEventsForAgenda(events: AstrologicalEvent[]): AstronomicalEvent[] {
  return events.map(astroToAstronomical);
}

// ==========================================
// 🎯 TIPOS PARA AGENDA Y CALENDARIO
// ==========================================

export interface AstronomicalDay {
  date: Date;
  events: AstronomicalEvent[];
  isCurrentMonth: boolean;
  hasEvents?: boolean;
}

export interface EventStats {
  totalEvents: number;
  highPriorityEvents: number;
  mediumPriorityEvents: number;
  lowPriorityEvents: number;
  eventTypes: {
    lunarPhases: number;
    retrogrades: number;
    eclipses: number;
    transits: number;
    aspects: number;
    seasonal: number;
  };
  actionPlans: {
    total: number;
    immediate: number;
    weekly: number;
    monthly: number;
    quarterly: number;
  };
}

// ==========================================
// 🎯 TIPOS PARA RESUMEN EJECUTIVO
// ==========================================

export interface ExecutiveSummary {
  monthlyHighlights: string[];
  quarterlyFocus: string[];
  yearlyThemes: string[];
  priorityActions: ActionPlan[];
  keyInsights: {
    dominantElements: string[];
    primaryChallenges: string[];
    biggestOpportunities: string[];
    overallTheme: string;
  };
}

// ==========================================
// 🎯 EXPORTACIONES PARA COMPATIBILIDAD
// ==========================================

// Re-exportar tipos existentes para mantener compatibilidad


// Exportar todo lo nuevo
// (Ya exportado arriba con 'export interface' y 'export type')