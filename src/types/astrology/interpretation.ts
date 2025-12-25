// src/types/interpretation.ts
// 🎯 PROFESSIONAL TYPE DEFINITIONS FOR SOLAR RETURN INTERPRETATIONS

export interface UserProfile {
  name: string;
  age: number;
  birthPlace: string;
  birthDate: string;
  birthTime: string;
}

export interface TechnicalAnalysis {
  asc_sr_en_casa_natal: {
    casa: number;
    signo_asc_sr: string;
    significado: string;
    area_vida_dominante: string;
  };
  sol_en_casa_sr: {
    casa: number;
    significado: string;
    energia_disponible?: string;
  };
  planetas_angulares_sr: Array<{
    planeta: string;
    angulo: string;
    interpretacion: string;
  }>;
  aspectos_cruzados_natal_sr: Array<{
    planeta_natal: string;
    planeta_sr: string;
    aspecto: string;
    orbe: number;
    significado: string;
  }>;
  configuraciones_especiales: string[];
}

export interface ActionPlan {
  trimestre_1: {
    foco: string;
    acciones: string[];
  };
  trimestre_2: {
    foco: string;
    acciones: string[];
  };
  trimestre_3: {
    foco: string;
    acciones: string[];
  };
  trimestre_4: {
    foco: string;
    acciones: string[];
  };
}

export interface LunarMonth {
  mes: string;
  luna_nueva: {
    fecha: string;
    signo: string;
    mensaje: string;
  };
  luna_llena: {
    fecha: string;
    signo: string;
    mensaje: string;
  };
}

export interface KeyEvent {
  periodo: string;
  evento: string;
  tipo: string;
  descripcion: string;
  planetas_involucrados?: string[];
  accion_recomendada: string;
}

export interface FinalIntegration {
  sintesis: string;
  pregunta_reflexion: string;
}

// ==========================================
// 🔥 PLANETARY COMPARISON INTERFACES (3-Layer Architecture)
// ==========================================

export interface UsoAgenda {
  luna_nueva: string;
  luna_llena: string;
  retrogradaciones: string;
}

export interface ComparacionPlanetaria {
  natal: {
    posicion: string;
    descripcion: string;
  };
  solar_return: {
    posicion: string;
    descripcion: string;
  };
  choque: string;
  que_hacer: string;
  uso_agenda: UsoAgenda;
  error_automatico: string;
  frase_clave: string;
}

export interface ComparacionesPlanetarias {
  sol: ComparacionPlanetaria;
  luna: ComparacionPlanetaria;
  mercurio: ComparacionPlanetaria;
  venus: ComparacionPlanetaria;
  marte: ComparacionPlanetaria;
  jupiter: ComparacionPlanetaria;
  saturno: ComparacionPlanetaria;
}

// ==========================================
// 🌟 COMPLETE SOLAR RETURN INTERPRETATION
// ==========================================

export interface CompleteSolarReturnInterpretation {
  esencia_revolucionaria_anual: string;
  proposito_vida_anual: string;
  tema_central_del_anio: string;
  comparaciones_planetarias: ComparacionesPlanetarias;  // ✅ NEW: Personalized comparisons
  analisis_tecnico_profesional: TechnicalAnalysis;
  plan_accion: ActionPlan;
  calendario_lunar_anual: LunarMonth[];
  declaracion_poder_anual: string;
  advertencias: string[];
  eventos_clave_del_anio: KeyEvent[];
  insights_transformacionales: string[];
  rituales_recomendados: string[];
  integracion_final: FinalIntegration;
}

export interface InterpretationDocument {
  _id: string;
  userId: string;
  chartType: 'natal' | 'solar-return' | 'progressed';
  natalChart?: any;
  solarReturnChart?: any;
  progressedChart?: any;
  userProfile: UserProfile;
  interpretation: CompleteSolarReturnInterpretation | any;
  generatedAt: Date;
  expiresAt: Date;
  method: 'openai' | 'fallback' | 'mongodb_cache';
  cached: boolean;
}

export interface APIResponse {
  success: boolean;
  interpretation?: CompleteSolarReturnInterpretation | any;
  cached?: boolean;
  generatedAt?: Date | string;
  method?: string;
  error?: string;
  details?: string;
  debug?: any;
}