/**
 * Tipos para carta natal completa y su estructura de datos
 * Archivo: types/astrology/chart.ts
 */

import type { 
  BirthData, 
  PlanetInfo, 
  HouseInfo, 
  ChartAngles, 
  ZodiacSign,
  Planet,
  ExtendedPlanet
} from './basic';
import type { PlanetaryAspect } from './aspects';

// =============================================================================
// CARTA NATAL COMPLETA
// =============================================================================

export interface NatalChart {
  // Información básica
  birth_data: BirthData;
  chart_id: string;
  created_at: string;
  
  // Posiciones planetarias
  planets: PlanetInfo[];
  
  // Casas astrológicas
  houses: HouseInfo[];
  
  // Ángulos principales
  angles: ChartAngles;
  
  // Aspectos entre planetas
  aspects: PlanetaryAspect[];
  
  // Metadatos del cálculo
  calculation_data: {
    house_system: 'placidus' | 'koch' | 'equal' | 'whole_sign';
    ayanamsa: 'tropical' | 'lahiri' | 'raman';
    coordinate_system: 'geocentric' | 'topocentric';
    timezone_used: string;
    julian_day: number;
    sidereal_time: number;
  };
}

// =============================================================================
// CARTA PROGRESADA  
// =============================================================================

export interface ProgressedChart {
  base_chart: NatalChart;
  progression_date: string;        // Fecha para la que se calcula
  progression_type: 'secondary' | 'solar_arc' | 'primary';
  
  // Planetas progresados
  progressed_planets: PlanetInfo[];
  
  // Casas progresadas (si aplica)
  progressed_houses?: HouseInfo[];
  
  // Ángulos progresados
  progressed_angles: ChartAngles;
  
  // Aspectos entre planetas progresados
  progressed_aspects: PlanetaryAspect[];
  
  // Aspectos entre planetas natales y progresados
  natal_to_progressed_aspects: PlanetaryAspect[];
}

// =============================================================================
// RESPUESTA DE API PROKERALA
// =============================================================================

export interface ProkeralaChartResponse {
  status: number;
  message: string;
  data: {
    // Información del perfil
    profile: {
      datetime: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
      timezone: string;
    };
    
    // Posiciones planetarias (formato Prokerala)
    planets: Array<{
      id: number;
      name: string;
      full_degree: number;
      normalized_degree: number;
      degree: number;
      house: number;
      sign: number;
      sign_lord: string;
      nakshatra: string;
      nakshatra_lord: string;
      retrograde: boolean;
    }>;
    
    // Casas (formato Prokerala)
    houses: Array<{
      id: number;
      degree: number;
      sign: number;
      sign_lord: string;
    }>;
    
    // Aspectos (formato Prokerala)
    aspects?: Array<{
      aspecting_planet: string;
      aspected_planet: string;
      aspect: string;
      orb: number;
      aspect_angle: number;
      applying: boolean;
    }>;
    
    // Información adicional
    chart_url?: string;
    svg_chart?: string;
  };
}

// =============================================================================
// CONFIGURACIÓN DE VISUALIZACIÓN
// =============================================================================

export interface ChartVisualizationConfig {
  // Dimensiones
  chart_size: number;              // Tamaño del SVG (píxeles)
  outer_circle_radius: number;     // Radio del círculo exterior
  inner_circle_radius: number;     // Radio del círculo interior
  planet_circle_radius: number;    // Radio donde se colocan planetas
  
  // Colores
  colors: {
    background: string;
    zodiac_circle: string;
    house_lines: string;
    degree_markers: string;
    sign_boundaries: string;
    planet_symbols: string;
    aspect_lines: Record<string, string>;
  };
  
  // Texto y símbolos
  fonts: {
    planet_symbols: string;
    degrees: string;
    house_numbers: string;
    sign_symbols: string;
  };
  
  // Configuración de aspectos
  aspects: {
    show_major: boolean;
    show_minor: boolean;
    opacity_based_on_orb: boolean;
    max_orb_to_display: number;
  };
  
  // Configuración de elementos
  show_elements: {
    degree_markers: boolean;
    house_numbers: boolean;
    sign_symbols: boolean;
    planet_degrees: boolean;
    aspect_grid: boolean;
  };
}

// =============================================================================
// DATOS PARA COMPONENTES DE VISUALIZACIÓN
// =============================================================================

export interface ChartRenderData {
  // Posiciones calculadas para SVG
  planet_positions: Array<{
    planet: Planet | ExtendedPlanet;
    angle: number;           // Ángulo en el círculo (0-360)
    x: number;              // Coordenada X en SVG
    y: number;              // Coordenada Y en SVG
    symbol: string;
    color: string;
    house: number;
    sign: ZodiacSign;
    degree_in_sign: number;
  }>;
  
  // Líneas de casas
  house_lines: Array<{
    house_number: number;
    start_angle: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }>;
  
  // Líneas de aspectos
  aspect_lines: Array<{
    id: string;
    planet1: Planet | ExtendedPlanet;
    planet2: Planet | ExtendedPlanet;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
    width: number;
    style: 'solid' | 'dashed' | 'dotted';
    opacity: number;
  }>;
  
  // Marcadores de grados
  degree_markers: Array<{
    degree: number;
    x: number;
    y: number;
    is_major: boolean;     // Cada 10° vs cada 1°
  }>;
}

// =============================================================================
// ESTADO DE LA CARTA
// =============================================================================

export interface ChartState {
  // Estado de carga
  loading: boolean;
  error: string | null;
  
  // Datos de la carta
  natal_chart: NatalChart | null;
  progressed_chart: ProgressedChart | null;
  
  // Configuración actual
  display_config: ChartVisualizationConfig;
  
  // Filtros activos
  active_filters: {
    planets: (Planet | ExtendedPlanet)[];
    aspects: string[];           // IDs de aspectos a mostrar
    houses: number[];           // Casas a destacar
  };
  
  // Modo de visualización
  view_mode: 'natal' | 'progressed' | 'comparison';
}

// =============================================================================
// ACCIONES PARA GESTIÓN DE ESTADO
// =============================================================================

export type ChartAction = 
  | { type: 'LOAD_CHART_START'; payload: BirthData }
  | { type: 'LOAD_CHART_SUCCESS'; payload: NatalChart }
  | { type: 'LOAD_CHART_ERROR'; payload: string }
  | { type: 'UPDATE_CONFIG'; payload: Partial<ChartVisualizationConfig> }
  | { type: 'TOGGLE_PLANET'; payload: Planet | ExtendedPlanet }
  | { type: 'TOGGLE_ASPECT'; payload: string }
  | { type: 'SET_VIEW_MODE'; payload: 'natal' | 'progressed' | 'comparison' }
  | { type: 'RESET_FILTERS' };

// =============================================================================
// UTILIDADES PARA CONVERSIÓN DE DATOS
// =============================================================================

export interface DataTransformers {
  // Convierte respuesta de Prokerala a nuestro formato
  prokeralaToNatalChart: (response: ProkeralaChartResponse) => NatalChart;
  
  // Prepara datos para renderizado
  chartToRenderData: (chart: NatalChart, config: ChartVisualizationConfig) => ChartRenderData;
  
  // Calcula posiciones SVG
  degreesToSvgPosition: (degree: number, radius: number, centerX: number, centerY: number) => { x: number; y: number };
  
  // Convierte nombres de planetas entre formatos
  planetNameConverter: (prokeralaName: string) => Planet | ExtendedPlanet | null;
}

// =============================================================================
// TIPOS ADICIONALES PARA API Y RESPUESTAS
// =============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export interface ChartGenerationRequest {
  birth_data: BirthData;
  options?: {
    house_system?: 'placidus' | 'koch' | 'equal' | 'whole_sign';
    include_aspects?: boolean;
    include_minor_aspects?: boolean;
    aspect_orb_modifier?: number;
    coordinate_system?: 'geocentric' | 'topocentric';
  };
}

export interface ChartGenerationResponse extends ApiResponse<NatalChart> {
  calculation_time_ms?: number;
  api_credits_used?: number;
}