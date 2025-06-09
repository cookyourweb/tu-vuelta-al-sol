/**
 * Tipos para utilidades y cálculos astrológicos
 * Archivo: types/astrology/utils.ts
 */

import type { Planet, ExtendedPlanet } from './basic';
import type { AspectType } from './aspects';

// =============================================================================
// CÁLCULOS GEOMÉTRICOS
// =============================================================================

export interface Point2D {
  x: number;
  y: number;
}

export interface PolarCoordinates {
  radius: number;
  angle: number;        // En grados (0-360)
}

export interface SvgDimensions {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  outerRadius: number;
  innerRadius: number;
  planetRadius: number;
}

// =============================================================================
// CÁLCULOS DE ASPECTOS
// =============================================================================

export interface AspectCalculationInput {
  planet1_degree: number;
  planet2_degree: number;
  planet1_type: Planet | ExtendedPlanet;
  planet2_type: Planet | ExtendedPlanet;
  orb_modifier?: number;        // Multiplicador de orbe (por defecto 1.0)
}

export interface AspectCalculationOutput {
  has_aspect: boolean;
  aspect_type?: AspectType;
  exact_difference: number;     // Diferencia exacta en grados
  orb_used: number;            // Orbe utilizado para el cálculo
  actual_orb: number;          // Orbe real del aspecto
  strength_percentage: number;  // 0-100, donde 100 = aspecto exacto
  is_applying: boolean;
  is_separating: boolean;
}

// =============================================================================
// CÁLCULOS DE POSICIONES
// =============================================================================

export interface PlanetPositionCalculation {
  planet: Planet | ExtendedPlanet;
  longitude: number;           // 0-359.99
  latitude: number;
  house: number;               // 1-12
  sign_position: {
    sign: number;              // 0-11 (Aries=0)
    degree_in_sign: number;    // 0-29.99
    formatted: string;         // "15°32' Aries"
  };
  motion: {
    speed: number;             // Grados por día
    direction: 'direct' | 'retrograde' | 'stationary';
  };
}

// =============================================================================
// CÁLCULOS DE CASAS
// =============================================================================

export interface HouseCalculationInput {
  birth_data: {
    julian_day: number;
    latitude: number;
    longitude: number;
    timezone_offset: number;
  };
  house_system: 'placidus' | 'koch' | 'equal' | 'whole_sign';
}

export interface HouseCalculationOutput {
  cusps: number[];             // 12 cúspides en grados (0-359.99)
  sizes: number[];             // Tamaño de cada casa en grados
  quadrants: {
    angular: number[];         // Casas 1, 4, 7, 10
    succedent: number[];       // Casas 2, 5, 8, 11  
    cadent: number[];          // Casas 3, 6, 9, 12
  };
}

// =============================================================================
// VALIDACIONES
// =============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface BirthDataValidation extends ValidationResult {
  corrected_data?: {
    timezone?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    time_zone_offset?: number;
  };
}

export interface CoordinateValidation extends ValidationResult {
  normalized_coordinates?: {
    latitude: number;    // -90 a 90
    longitude: number;   // -180 a 180
  };
}

// =============================================================================
// CONVERSIONES DE FORMATO
// =============================================================================

export interface DegreeConversion {
  decimal: number;             // 125.753
  degrees: number;             // 125
  minutes: number;             // 45
  seconds: number;             // 10.8
  formatted_dms: string;       // "125°45'11""
  formatted_astro: string;     // "05°45' Leo"
}

export interface TimeConversion {
  local_time: string;          // "14:30:00"
  utc_time: string;           // "12:30:00"
  julian_day: number;         // 2451545.0208333
  sidereal_time: number;      // En horas
  timezone_offset: number;    // En horas desde UTC
}

// =============================================================================
// UTILIDADES PARA RENDERIZADO SVG
// =============================================================================

export interface SvgElementProps {
  id: string;
  className?: string;
  transform?: string;
  style?: React.CSSProperties;
}

export interface SvgCircleProps extends SvgElementProps {
  cx: number;
  cy: number;
  r: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface SvgLineProps extends SvgElementProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  strokeWidth: number;
  strokeDasharray?: string;
  opacity?: number;
}

export interface SvgTextProps extends SvgElementProps {
  x: number;
  y: number;
  text: string;
  fontSize?: number;
  fontFamily?: string;
  textAnchor?: 'start' | 'middle' | 'end';
  fill?: string;
}

export interface SvgPathProps extends SvgElementProps {
  d: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

// =============================================================================
// CONFIGURACIÓN DE ALGORITMOS
// =============================================================================

export interface AspectCalculationConfig {
  use_mean_orbs: boolean;           // Usar orbes promedio vs específicos por planeta
  apply_orb_modifiers: boolean;     // Aplicar modificadores de orbe por planeta
  consider_planet_speeds: boolean;  // Considerar velocidades para applying/separating
  minimum_orb_threshold: number;    // Orbe mínimo para considerar aspecto
  maximum_orb_threshold: number;    // Orbe máximo para considerar aspecto
}

export interface HouseCalculationConfig {
  house_system: 'placidus' | 'koch' | 'equal' | 'whole_sign';
  use_topocentric: boolean;         // Usar coordenadas topocentricas vs geocéntricas
  ayanamsa: 'tropical' | 'lahiri';  // Sistema de referencia
  coordinate_precision: number;     // Precisión decimal para coordenadas
}

// =============================================================================
// MÉTRICAS Y ESTADÍSTICAS
// =============================================================================

export interface ChartStatistics {
  element_distribution: Record<'fuego' | 'tierra' | 'aire' | 'agua', number>;
  modality_distribution: Record<'cardinal' | 'fijo' | 'mutable', number>;
  house_emphasis: Record<number, number>;    // Cuántos planetas por casa
  aspect_counts: Record<AspectType, number>;
  strongest_aspects: Array<{
    planets: [Planet | ExtendedPlanet, Planet | ExtendedPlanet];
    aspect: AspectType;
    strength: number;
  }>;
  chart_shape: 'bundle' | 'bowl' | 'bucket' | 'locomotive' | 'seesaw' | 'splash' | 'splay';
}

export interface CalculationPerformance {
  total_time_ms: number;
  planet_calculation_ms: number;
  house_calculation_ms: number;
  aspect_calculation_ms: number;
  rendering_preparation_ms: number;
  api_call_ms?: number;
}