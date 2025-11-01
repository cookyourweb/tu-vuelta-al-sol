// src/types/astrology/chartDisplay.ts
// ✅ FIXED - Added "solar-return" to chartType

export interface ChartDisplayProps {
  houses?: House[];
  planets?: Planet[];
  elementDistribution?: ElementDistribution;
  modalityDistribution?: ModalityDistribution;
  keyAspects?: KeyAspect[];
  aspects?: Aspect[]; // ✅ AÑADIDA

  ascendant?: Angle | null;
  midheaven?: Angle | null;
  birthData?: BirthData;
  showInterpretation?: boolean;
  onInterpretationGenerated?: (interpretation: any) => void;

  // ✅ FIXED: Added "solar-return" as valid value
  chartType?: 'natal' | 'progressed' | 'solar-return';
  showOnlyProgressedAspects?: boolean;
  progressionInfo?: ProgressionInfo;
  data?: any; // For flexibility

  // ✅ NEW PROPS FOR SOLAR RETURN
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  solarReturnYear?: number;
  solarReturnTheme?: string;
  ascSRInNatalHouse?: number;

  // ✅ ADDED: For drawer functionality
  onOpenDrawer?: (content: any) => void;
  onCloseDrawer?: () => void;
  drawerOpen?: boolean;
  userId?: string;                         // ID del usuario
}

// Rest of interfaces remain the same
export interface House {
  number: number;
  sign: string;
  degree: number;
  longitude?: number;
}

export interface Planet {
  name: string;
  sign: string;
  degree: number;
  position?: number; // ✅ AÑADIDO para ChartWheel
  house?: number;
  houseNumber?: number;
  retrograde?: boolean;
  longitude?: number;
  latitude?: number;
  speed?: number;
  element?: string;
  mode?: string;
}

export interface ElementDistribution {
  fire: number;
  earth: number;
  air: number;
  water: number;
}

export interface ModalityDistribution {
  cardinal: number;
  fixed: number;
  mutable: number;
}

export interface KeyAspect {
  id?: number | string;
  planet1?: string;
  planet2?: string;
  type?: string;
  aspect?: string;
  degree?: number;
  orb?: number;
  description?: string;
  importance?: number;
}

export interface Angle {
  sign?: string;
  degree?: number;
  longitude?: number;
  name?: string;
}

export interface BirthData {
  name?: string;
  fullName?: string;
  birthDate?: string;
  birthTime?: string;
  location?: string;
  birthPlace?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

export interface ProgressionInfo {
  year?: number;
  period?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  ageAtStart?: number;
  isCurrentYear?: boolean;
  progressionDate?: string;
  progressionTime?: string;
}

export interface CalculatedAspect {
  planet1: string;
  planet2: string;
  type: string;
  aspect: string;
  orb: number;
  degree: number;
  category: 'major' | 'minor';
  isHard: boolean;
  isEasy: boolean;
  key: string;
  config?: { // ✅ AÑADIDO para ChartTooltips
    color: string;
    name: string;
    angle: number;
    orb: number;
    difficulty?: 'easy' | 'hard' | 'neutral' | 'minor';
  };
  exact?: boolean; // ✅ AÑADIDO para ChartTooltips
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

// Define Aspect interface (adjust fields as needed)
export interface Aspect {
  planet1: string;
  planet2: string;
  type: string;
  aspect: string;
  orb: number;
  degree: number;
  description?: string;
}