// src/types/astrology/chartDisplay.ts
// Tipos específicos para el componente ChartDisplay
// Compatible con los tipos existentes del proyecto

import type { 
  Planet as BasePlanet, 
  ExtendedPlanet, 
  ZodiacSign, 
  HouseNumber 
} from './basic';
import type { 
  AspectType, 
  PlanetaryAspect,
  AspectInfo 
} from './aspects';
import { JSX } from 'react';

// =============================================================================
// INTERFACES PARA CHARTDISPLAY (Compatible con código existente)
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
  ascendant?: { longitude?: number; sign?: string; degree?: number; minutes?: number };
  midheaven?: { longitude?: number; sign?: string; degree?: number; minutes?: number };
  birthData?: {
    birthDate?: string;
    birthTime?: string;
    birthPlace?: string;
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
}

export interface TooltipPosition {
  x: number;
  y: number;
}

export interface SelectedAspectTypes {
  major: boolean;
  minor: boolean;
  hard: boolean;
  easy: boolean;
}

export interface CirclePosition {
  x: number;
  y: number;
}

export interface MenuItemConfig {
  id: string;
  label: string;
  icon: () => JSX.Element;
}

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