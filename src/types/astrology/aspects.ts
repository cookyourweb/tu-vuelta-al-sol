/**
 * Tipos para aspectos astrológicos y su visualización
 * Archivo: types/astrology/aspects.ts
 */

import type { Planet, ExtendedPlanet } from './basic';

// =============================================================================
// TIPOS DE ASPECTOS
// =============================================================================

export type AspectType = 
  | 'conjunction'     // 0° - Conjunción
  | 'opposition'      // 180° - Oposición  
  | 'trine'          // 120° - Trígono
  | 'square'         // 90° - Cuadratura
  | 'sextile'        // 60° - Sextil
  | 'quincunx'       // 150° - Quincuncio
  | 'semisextile'    // 30° - Semisextil
  | 'sesquiquadrate' // 135° - Sesquicuadratura
  | 'semisquare'     // 45° - Semicuadratura
  | 'quintile'       // 72° - Quintil
  | 'biquintile';    // 144° - Biquintil

// =============================================================================
// INFORMACIÓN DE ASPECTOS
// =============================================================================

export interface AspectInfo {
  type: AspectType;
  name: string;
  symbol: string;
  angle: number;           // Ángulo exacto del aspecto
  orb_major: number;       // Orbe para planetas mayores
  orb_minor: number;       // Orbe para planetas menores
  nature: 'harmonico' | 'tensional' | 'neutro';
  color: string;           // Color para visualización
  line_style: 'solid' | 'dashed' | 'dotted';
  line_width: number;      // Grosor de línea base
  priority: number;        // Prioridad de renderizado (1 = mayor)
}

// =============================================================================
// ASPECTO ESPECÍFICO ENTRE DOS PLANETAS
// =============================================================================

export interface PlanetaryAspect {
  id: string;                    // ID único del aspecto
  planet1: Planet | ExtendedPlanet;
  planet2: Planet | ExtendedPlanet;
  aspect_type: AspectType;
  exact_angle: number;           // Ángulo exacto entre planetas
  orb: number;                   // Diferencia del aspecto exacto
  applying: boolean;             // Si el aspecto se está aplicando
  separating: boolean;           // Si el aspecto se está separando
  strength: 'muy_fuerte' | 'fuerte' | 'moderado' | 'debil';
  
  // Datos para visualización
  visual: {
    color: string;
    line_width: number;
    line_style: 'solid' | 'dashed' | 'dotted';
    opacity: number;             // 0-1 basado en la fuerza
    z_index: number;             // Para layering de líneas
  };
}

// =============================================================================
// CONFIGURACIÓN DE ASPECTOS
// =============================================================================

export const ASPECT_DEFINITIONS: Record<AspectType, AspectInfo> = {
  conjunction: {
    type: 'conjunction',
    name: 'Conjunción',
    symbol: '☌',
    angle: 0,
    orb_major: 8,
    orb_minor: 6,
    nature: 'neutro',
    color: '#22c55e',      // Verde
    line_style: 'solid',
    line_width: 3,
    priority: 1
  },
  opposition: {
    type: 'opposition',
    name: 'Oposición', 
    symbol: '☍',
    angle: 180,
    orb_major: 8,
    orb_minor: 6,
    nature: 'tensional',
    color: '#ef4444',      // Rojo
    line_style: 'solid',
    line_width: 3,
    priority: 2
  },
  trine: {
    type: 'trine',
    name: 'Trígono',
    symbol: '△',
    angle: 120,
    orb_major: 8,
    orb_minor: 6,
    nature: 'harmonico',
    color: '#3b82f6',      // Azul
    line_style: 'solid',
    line_width: 2.5,
    priority: 3
  },
  square: {
    type: 'square',
    name: 'Cuadratura',
    symbol: '□',
    angle: 90,
    orb_major: 8,
    orb_minor: 6,
    nature: 'tensional',
    color: '#f59e0b',      // Naranja/Amarillo
    line_style: 'solid',
    line_width: 2.5,
    priority: 4
  },
  sextile: {
    type: 'sextile',
    name: 'Sextil',
    symbol: '⚹',
    angle: 60,
    orb_major: 6,
    orb_minor: 4,
    nature: 'harmonico',
    color: '#8b5cf6',      // Violeta
    line_style: 'solid',
    line_width: 2,
    priority: 5
  },
  quincunx: {
    type: 'quincunx',
    name: 'Quincuncio',
    symbol: '⚻',
    angle: 150,
    orb_major: 3,
    orb_minor: 2,
    nature: 'tensional',
    color: '#6b7280',      // Gris
    line_style: 'dashed',
    line_width: 1.5,
    priority: 6
  },
  semisextile: {
    type: 'semisextile',
    name: 'Semisextil',
    symbol: '⚺',
    angle: 30,
    orb_major: 3,
    orb_minor: 2,
    nature: 'harmonico',
    color: '#06b6d4',      // Cyan
    line_style: 'dotted',
    line_width: 1.5,
    priority: 7
  },
  sesquiquadrate: {
    type: 'sesquiquadrate',
    name: 'Sesquicuadratura',
    symbol: '⚼',
    angle: 135,
    orb_major: 3,
    orb_minor: 2,
    nature: 'tensional',
    color: '#dc2626',      // Rojo oscuro
    line_style: 'dashed',
    line_width: 1.5,
    priority: 8
  },
  semisquare: {
    type: 'semisquare',
    name: 'Semicuadratura',
    symbol: '∠',
    angle: 45,
    orb_major: 3,
    orb_minor: 2,
    nature: 'tensional',
    color: '#ea580c',      // Naranja oscuro
    line_style: 'dotted',
    line_width: 1.5,
    priority: 9
  },
  quintile: {
    type: 'quintile',
    name: 'Quintil',
    symbol: 'Q',
    angle: 72,
    orb_major: 2,
    orb_minor: 1,
    nature: 'harmonico',
    color: '#84cc16',      // Verde lima
    line_style: 'dotted',
    line_width: 1,
    priority: 10
  },
  biquintile: {
    type: 'biquintile',
    name: 'Biquintil',
    symbol: 'bQ',
    angle: 144,
    orb_major: 2,
    orb_minor: 1,
    nature: 'harmonico',
    color: '#65a30d',      // Verde lima oscuro
    line_style: 'dotted',
    line_width: 1,
    priority: 11
  }
};

// =============================================================================
// CONFIGURACIÓN DE ORBES POR PLANETA
// =============================================================================

export const PLANET_ORB_MODIFIERS: Record<Planet | ExtendedPlanet, number> = {
  // Planetas personales (orbes más amplios)
  sol: 1.0,
  luna: 1.0,
  mercurio: 0.8,
  venus: 0.8,
  marte: 0.8,
  
  // Planetas sociales
  jupiter: 0.7,
  saturno: 0.7,
  
  // Planetas transpersonales (orbes más estrechos)
  urano: 0.6,
  neptuno: 0.6,
  pluton: 0.6,
  
  // Puntos matemáticos
  nodo_norte: 0.5,
  nodo_sur: 0.5,
  quiron: 0.4,
  lilith: 0.3
};

// =============================================================================
// FILTROS DE ASPECTOS
// =============================================================================

export type AspectFilter = 'all' | 'major' | 'minor' | 'harmonious' | 'tense';

export const ASPECT_FILTER_GROUPS: Record<AspectFilter, AspectType[]> = {
  all: Object.keys(ASPECT_DEFINITIONS) as AspectType[],
  major: ['conjunction', 'opposition', 'trine', 'square', 'sextile'],
  minor: ['quincunx', 'semisextile', 'sesquiquadrate', 'semisquare', 'quintile', 'biquintile'],
  harmonious: ['trine', 'sextile', 'semisextile', 'quintile', 'biquintile'],
  tense: ['opposition', 'square', 'quincunx', 'sesquiquadrate', 'semisquare']
};

// =============================================================================
// UTILIDADES PARA CÁLCULOS
// =============================================================================

export interface AspectCalculationResult {
  has_aspect: boolean;
  aspect_type?: AspectType;
  exact_angle: number;
  orb: number;
  strength: 'muy_fuerte' | 'fuerte' | 'moderado' | 'debil';
  applying: boolean;
}

// =============================================================================
// CONFIGURACIÓN VISUAL
// =============================================================================

export interface AspectVisualizationConfig {
  show_major_aspects: boolean;
  show_minor_aspects: boolean;
  show_aspect_symbols: boolean;
  max_orb_display: number;        // Orbe máximo para mostrar
  opacity_based_on_strength: boolean;
  color_coding: 'by_nature' | 'by_type' | 'monochrome';
  line_style_coding: boolean;     // Si usar diferentes estilos de línea
}