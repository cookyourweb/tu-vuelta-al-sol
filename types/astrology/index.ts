/**
 * Índice principal de tipos astrológicos
 * Archivo: types/astrology/index.ts
 * 
 * Centraliza todas las exportaciones de tipos para fácil importación
 */

import { AspectFilter, AspectVisualizationConfig, PlanetaryAspect } from './aspects';
import { Planet } from './basic';
import { ChartGenerationRequest, ChartVisualizationConfig, NatalChart } from './chart';

// =============================================================================
// TIPOS BÁSICOS
// =============================================================================

export type {
  ZodiacSign,
  ZodiacSignInfo,
  Planet,
  ExtendedPlanet,
  PlanetInfo,
  HouseNumber,
  HouseInfo,
  ChartAngles,
  GeographicCoordinates,
  BirthData,
  DegreeMinuteSecond,
  AstrologicalPosition
} from './basic';

export {
  HOUSE_MEANINGS,
  ZODIAC_SIGNS,
  PLANET_SYMBOLS
} from './basic';

// =============================================================================
// TIPOS DE ASPECTOS
// =============================================================================

export type {
  AspectType,
  AspectInfo,
  PlanetaryAspect,
  AspectCalculationResult,
  AspectVisualizationConfig,
  AspectFilter
} from './aspects';

export {
  ASPECT_DEFINITIONS,
  PLANET_ORB_MODIFIERS,
  ASPECT_FILTER_GROUPS
} from './aspects';

// =============================================================================
// TIPOS DE CARTA NATAL
// =============================================================================

export type {
  NatalChart,
  ProgressedChart,
  ProkeralaChartResponse,
  ChartVisualizationConfig,
  ChartRenderData,
  ChartState,
  ChartAction,
  DataTransformers,
  ApiResponse,
  ChartGenerationRequest,
  ChartGenerationResponse
} from './chart';

// =============================================================================
// TIPOS DE UTILIDADES
// =============================================================================

export type {
  Point2D,
  PolarCoordinates,
  SvgDimensions,
  AspectCalculationInput,
  AspectCalculationOutput,
  PlanetPositionCalculation,
  HouseCalculationInput,
  HouseCalculationOutput,
  ValidationResult,
  BirthDataValidation,
  CoordinateValidation,
  DegreeConversion,
  TimeConversion,
  SvgElementProps,
  SvgCircleProps,
  SvgLineProps,
  SvgTextProps,
  SvgPathProps,
  AspectCalculationConfig,
  HouseCalculationConfig,
  ChartStatistics,
  CalculationPerformance
} from './utils';

// =============================================================================
// TIPOS PARA HOOKS Y ESTADO GLOBAL
// =============================================================================

export interface UseChartReturn {
  chart: NatalChart | null;
  loading: boolean;
  error: string | null;
  generateChart: (request: ChartGenerationRequest) => Promise<void>;
  updateChart: (updates: Partial<NatalChart>) => void;
  resetChart: () => void;
}

export interface UseAspectsReturn {
  aspects: PlanetaryAspect[];
  filteredAspects: PlanetaryAspect[];
  aspectFilter: AspectFilter;
  setAspectFilter: (filter: AspectFilter) => void;
  toggleAspect: (aspectId: string) => void;
  getAspectsBetween: (planet1: Planet, planet2: Planet) => PlanetaryAspect[];
}

// =============================================================================
// CONFIGURACIÓN GLOBAL
// =============================================================================

export interface AstrologyAppConfig {
  // Configuración de API
  api: {
    prokerala_client_id: string;
    base_url: string;
    timeout_ms: number;
    retry_attempts: number;
  };
  
  // Configuración por defecto de cartas
  default_chart_config: ChartVisualizationConfig;
  
  // Configuración de aspectos por defecto
  default_aspect_config: AspectVisualizationConfig;
  
  // Configuración de precisión
  precision: {
    degree_precision: number;    // Decimales para grados
    orb_precision: number;       // Decimales para orbes
    time_precision: string;      // 'minute' | 'second'
  };
  
  // Configuración de localización
  localization: {
    language: 'es' | 'en';
    date_format: string;
    time_format: string;
    coordinate_format: 'decimal' | 'dms';
  };
}