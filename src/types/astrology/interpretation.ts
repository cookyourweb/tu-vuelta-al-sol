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

// ==========================================
// 📅 AGENDA INTERFACES (Layer 3 - Functional)
// ==========================================

export interface EjercicioPersonalizado {
  tipo: 'conciencia' | 'accion_guiada' | 'mantra_funcional' | 'meditacion' | 'pregunta_integracion';
  titulo: string;
  instrucciones: string;
  duracion: string; // "2 minutos", "5 minutos"
  cuando_hacerlo: string;
}

export interface RitualPractico {
  nombre: string;
  duracion: string;
  pasos: string[];
  frase_mental: string;
  cuando: 'luna_nueva' | 'luna_llena' | 'diario' | 'semanal';
}

export interface GuiaLunar {
  tipo: 'luna_nueva' | 'luna_llena';
  fecha_proxima?: Date;
  titulo: string;
  que_hacer: string; // Del uso_agenda de comparaciones
  ejercicio_sugerido: EjercicioPersonalizado;
}

export interface AgendaMensual {
  mes: string;
  planeta_activo: string;
  entrenamiento_principal: string; // Del que_hacer de comparaciones
  frase_clave: string;
  error_evitar: string;
  rituales: RitualPractico[];
  ejercicios: EjercicioPersonalizado[]; // Los 5 tipos
  guias_lunares: GuiaLunar[];
}

// ==========================================
// 🕯️ SYMBOLIC OBJECTS INTERFACES (Store - Optional)
// ==========================================

export interface ObjetoSimbolico {
  tipo: 'vela' | 'piedra' | 'kit';
  nombre: string;
  color?: string;
  descripcion: string;
  funcion: string;
  como_usar: string;
  cuando_usar: string;
  advertencia?: string;
  frase_ancla: string;
}

export interface MicroRitual {
  duracion: string;
  pasos: string[];
  frase_mental: string;
}

export interface KitMensual {
  mes: string;
  planeta_activo: string;
  entrenamiento: string;
  vela: ObjetoSimbolico;
  piedra: ObjetoSimbolico;
  micro_ritual: MicroRitual;
  qr_audio?: string;
  // ⚠️ IMPORTANTE: Este kit es OPCIONAL y se ofrece en tienda
  // La agenda NO depende de esto
}

// ==========================================
// 🪐 INDIVIDUAL PLANET INTERPRETATION (SOLAR RETURN CONTEXT)
// ==========================================

export interface PlanetTooltipSR {
  simbolo: string;
  titulo: string;
  subtitulo: string;
  grado: string;
  area_activada: string;
  tipo_energia: string;
  frase_clave: string;
}

export interface PlanetDrawerQuienEres {
  titulo: string;
  posicion_natal: string;
  descripcion: string;
}

export interface PlanetDrawerQueSeActiva {
  titulo: string;
  posicion_sr: string;
  descripcion: string;
}

export interface PlanetDrawerCruceClave {
  titulo: string;
  descripcion: string;
}

export interface PlanetDrawerImpactoReal {
  titulo: string;
  descripcion: string;
}

export interface PlanetDrawerComoUsar {
  titulo: string;
  accion_concreta: string;
  ejemplo_practico: string;
}

export interface PlanetDrawerSombras {
  titulo: string;
  trampa_automatica: string;
  antidoto: string;
}

export interface PlanetDrawerSintesis {
  titulo: string;
  frase_resumen: string;
}

export interface PlanetDrawerEncajaAgenda {
  titulo: string;
  luna_nueva: string;
  luna_llena: string;
  retrogradaciones: string;
}

export interface PlanetDrawerSR {
  quien_eres: PlanetDrawerQuienEres;
  que_se_activa: PlanetDrawerQueSeActiva;
  cruce_clave: PlanetDrawerCruceClave;
  impacto_real: PlanetDrawerImpactoReal;
  como_usar: PlanetDrawerComoUsar;
  sombras: PlanetDrawerSombras;
  sintesis: PlanetDrawerSintesis;
  encaja_agenda: PlanetDrawerEncajaAgenda;
}

export interface PlanetIndividualSRInterpretation {
  tooltip: PlanetTooltipSR;
  drawer: PlanetDrawerSR;
}

// ==========================================
// 📄 DOCUMENT INTERFACES
// ==========================================

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