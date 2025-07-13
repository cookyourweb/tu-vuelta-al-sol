// src/types/astrology/chartDisplay.ts - TIPOS ACTUALIZADOS PARA CARTA PROGRESADA


// export type { AspectMeaning, PlanetMeaning, HouseMeaning } from "./chartDisplay";

// =============================================================================
// INTERFACES PRINCIPALES PARA CHARTDISPLAY ACTUALIZADAS
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

// ✅ INTERFACE ACTUALIZADA CON PROPS PARA CARTA PROGRESADA
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
  // ✅ NUEVAS PROPS PARA CARTA PROGRESADA
  chartType?: 'natal' | 'progressed';
  progressionInfo?: {
    year: number;
    period: string;
    description: string;
    startDate?: string;
    endDate?: string;
    ageAtStart?: number;
    isCurrentYear?: boolean;
    progressionDate?: string;
    progressionTime?: string;
  };
  showOnlyProgressedAspects?: boolean; // ✅ NUEVA PROP CLAVE
  progressionLocation?: {
    progressionPlace: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
}

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
  isProgressed?: boolean; // ✅ NUEVO: Para distinguir aspectos progresados
}

export interface SelectedAspectTypes {
  major: boolean;
  minor: boolean;
  hard: boolean;
  easy: boolean;
}

export interface TooltipPosition {
  x: number;
  y: number;
}

export interface CirclePosition {
  x: number;
  y: number;
}

export interface MenuItemConfig {
  id: string;
  label: string;
  icon: () => React.ReactElement;
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
