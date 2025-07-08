// src/types/astrology/chartDisplay.ts
// Tipos optimizados y unificados para ChartDisplay

import { JSX } from 'react';

// =============================================================================
// INTERFACES PRINCIPALES PARA CHARTDISPLAY
// =============================================================================

export interface Planet {
  name: string;
  degree: number;
  sign: string;
  minutes?: number;
  longitude?: number;
  houseNumber?: number;
  housePosition?: number;
  isRetrograde?: boolean;
  retrograde?: boolean;
  position?: number;
  house?: number;
  element?: string;
  modality?: string;
}

export interface House {
  number: number;
  sign: string;
  degree: number;
  minutes?: number;
  longitude?: number;
  position?: number;
  element?: string;
  modality?: string;
}

export interface Aspect {
  planet1: string;
  planet2: string;
  angle?: number;
  type: string;
  orb: number;
  applying?: boolean;
}

export interface ChartDisplayProps {
  houses: House[];
  planets: Planet[];
  elementDistribution: { fire: number; earth: number; air: number; water: number };
  modalityDistribution: { cardinal: number; fixed: number; mutable: number };
  keyAspects: Aspect[];
  aspects?: any[];
  angles?: any[];
  ascendant?: { 
    longitude?: number; 
    sign?: string; 
    degree?: number; 
    minutes?: number;
  };
  midheaven?: { 
    longitude?: number; 
    sign?: string; 
    degree?: number; 
    minutes?: number;
  };
  birthData?: {
    birthDate?: string;
    birthTime?: string;
    birthPlace?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
  };
  chartType?: 'natal' | 'progressed'; // Nuevo: para distinguir tipos
  progressionInfo?: {                  // Nuevo: para cartas progresadas
    year: number;
    period: string;
    description: string;
    startDate?: string;
    endDate?: string;
  };
}

// =============================================================================
// INTERFACES PARA CONFIGURACIÓN DE ASPECTOS
// =============================================================================

export interface AspectConfig {
  angle: number;
  orb: number;
  color: string;
  name: string;
  difficulty: 'neutral' | 'easy' | 'hard' | 'minor';
}

export interface CalculatedAspect {
  planet1: string;
  planet2: string;
  angle: number;
  type: string;
  orb: number;
  config: AspectConfig;
  exact: boolean;
}

export interface SelectedAspectTypes {
  major: boolean;
  minor: boolean;
  hard: boolean;
  easy: boolean;
}

// =============================================================================
// INTERFACES PARA TOOLTIPS Y POSICIONAMIENTO
// =============================================================================

export interface TooltipPosition {
  x: number;
  y: number;
}

export interface CirclePosition {
  x: number;
  y: number;
}

// =============================================================================
// INTERFACES PARA COMPONENTES EXTRAÍDOS
// =============================================================================

export interface MenuItemConfig {
  id: string;
  label: string;
  icon: () => JSX.Element;
}

export interface BirthDataCardProps {
  birthData?: {
    birthDate?: string;
    birthTime?: string;
    birthPlace?: string;
  };
  ascendant?: { 
    longitude?: number; 
    sign?: string; 
    degree?: number; 
    minutes?: number;
  };
}

export interface AscendantCardProps {
  ascendant?: { 
    longitude?: number; 
    sign?: string; 
    degree?: number; 
    minutes?: number;
  };
}

export interface MidheavenCardProps {
  midheaven?: { 
    longitude?: number; 
    sign?: string; 
    degree?: number; 
    minutes?: number;
  };
}

export interface SectionMenuProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

// =============================================================================
// INTERFACES PARA SIGNIFICADOS ASTROLÓGICOS
// =============================================================================

export interface AspectMeaning {
  name: string;
  meaning: string;
  effect: string;
  type: string;
  explanation: string;
}

export interface PlanetMeaning {
  meaning: string;
  keywords: string;
}

export interface HouseMeaning {
  name: string;
  meaning: string;
  keywords: string;
}

// =============================================================================
// INTERFACES PARA HOOKS Y ESTADO
// =============================================================================

export interface UseChartDisplayReturn {
  showAspects: boolean;
  setShowAspects: (show: boolean) => void;
  selectedAspectTypes: SelectedAspectTypes;
  setSelectedAspectTypes: (types: SelectedAspectTypes) => void;
  hoveredAspect: string | null;
  setHoveredAspect: (aspectKey: string | null) => void;
  calculatedAspects: CalculatedAspect[];
  setCalculatedAspects: (aspects: CalculatedAspect[]) => void;
  hoveredPlanet: string | null;
  setHoveredPlanet: (planet: string | null) => void;
  hoveredHouse: number | null;
  setHoveredHouse: (house: number | null) => void;
  tooltipPosition: TooltipPosition;
  setTooltipPosition: (position: TooltipPosition) => void;
  hoveredNavGuide: boolean;
  setHoveredNavGuide: (hovered: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  handleMouseMove: (event: React.MouseEvent) => void;
  scrollToSection: (sectionId: string) => void;
}

// =============================================================================
// FUNCIONES UTILITARIAS
// =============================================================================

export interface ChartCalculationFunctions {
  convertAstrologicalDegreeToPosition: (degree: number, sign: string) => number;
  calculateAspects: (planets: Planet[]) => CalculatedAspect[];
  getCirclePosition: (angle: number, radius: number) => CirclePosition;
  getPersonalizedPlanetInterpretation: (planet: Planet) => string;
  getPersonalizedAspectInterpretation: (aspect: CalculatedAspect) => string;
}

// =============================================================================
// TIPOS PARA RENDERIZADO SVG
// =============================================================================

export interface SVGRenderFunctions {
  renderAspectLines: () => JSX.Element | null;
  renderPlanets: () => JSX.Element[];
  renderHouses: () => JSX.Element[];
  renderSigns: () => JSX.Element[];
  renderAngles: () => JSX.Element[];
}

// =============================================================================
// CONFIGURACIÓN Y CONSTANTES
// =============================================================================

export interface ChartDisplayConfiguration {
  chartSize: number;
  planetRadius: number;
  houseRadius: number;
  signRadius: number;
  defaultAspectTypes: SelectedAspectTypes;
  tooltipDelay: number;
  animationDuration: number;
}

// Exportar configuración por defecto
export const DEFAULT_CHART_CONFIG: ChartDisplayConfiguration = {
  chartSize: 600,
  planetRadius: 190,
  houseRadius: 115,
  signRadius: 270,
  defaultAspectTypes: {
    major: true,
    minor: false,
    hard: true,
    easy: true
  },
  tooltipDelay: 200,
  animationDuration: 300
};