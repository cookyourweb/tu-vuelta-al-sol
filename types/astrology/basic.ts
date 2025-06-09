/**
 * Tipos básicos para el sistema astrológico
 * Archivo: types/astrology/basic.ts
 */

// =============================================================================
// SIGNOS ZODIACALES
// =============================================================================

export type ZodiacSign = 
  | 'aries' | 'tauro' | 'geminis' | 'cancer' | 'leo' | 'virgo'
  | 'libra' | 'escorpio' | 'sagitario' | 'capricornio' | 'acuario' | 'piscis';

export interface ZodiacSignInfo {
  name: ZodiacSign;
  symbol: string;
  element: 'fuego' | 'tierra' | 'aire' | 'agua';
  modality: 'cardinal' | 'fijo' | 'mutable';
  ruler: Planet;
  degree_start: number; // 0, 30, 60, etc.
  degree_end: number;   // 29.99, 59.99, etc.
}

// =============================================================================
// PLANETAS
// =============================================================================

export type Planet = 
  | 'sol' | 'luna' | 'mercurio' | 'venus' | 'marte' | 'jupiter' 
  | 'saturno' | 'urano' | 'neptuno' | 'pluton';

export type ExtendedPlanet = Planet | 'nodo_norte' | 'nodo_sur' | 'quiron' | 'lilith';

export interface PlanetInfo {
  name: Planet | ExtendedPlanet;
  symbol: string;
  degree: number;           // Grado exacto (0-359.99)
  sign: ZodiacSign;
  house: number;            // Casa (1-12)
  retrograde: boolean;
  dignity: 'domicilio' | 'exaltacion' | 'detrimento' | 'caida' | 'neutral';
  speed: number;            // Velocidad diaria
}

// =============================================================================
// CASAS ASTROLÓGICAS
// =============================================================================

export type HouseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface HouseInfo {
  number: HouseNumber;
  cusp_degree: number;      // Grado de la cúspide
  cusp_sign: ZodiacSign;
  size: number;             // Tamaño de la casa en grados
  planets: Planet[];        // Planetas en esta casa
  meaning: string;          // Significado de la casa
}

export const HOUSE_MEANINGS: Record<HouseNumber, string> = {
  1: "Personalidad y apariencia física",
  2: "Recursos personales y valores", 
  3: "Comunicación y hermanos",
  4: "Hogar y familia",
  5: "Creatividad y romance",
  6: "Trabajo y salud",
  7: "Relaciones y asociaciones",
  8: "Transformación y recursos compartidos",
  9: "Filosofía y viajes largos", 
  10: "Carrera y reputación",
  11: "Amistad y objetivos",
  12: "Subconsciente y espiritualidad"
};

// =============================================================================
// ÁNGULOS IMPORTANTES
// =============================================================================

export interface ChartAngles {
  ascendant: {
    degree: number;
    sign: ZodiacSign;
  };
  midheaven: {
    degree: number;
    sign: ZodiacSign;
  };
  descendant: {
    degree: number;
    sign: ZodiacSign;
  };
  ic: { // Immum Coeli
    degree: number;
    sign: ZodiacSign;
  };
}

// =============================================================================
// COORDENADAS Y TIEMPO
// =============================================================================

export interface GeographicCoordinates {
  latitude: number;   // -90 a 90
  longitude: number;  // -180 a 180
  timezone: string;   // 'Europe/Madrid'
  city?: string;
  country?: string;
}

export interface BirthData {
  date: string;       // 'YYYY-MM-DD'
  time: string;       // 'HH:mm:ss'
  coordinates: GeographicCoordinates;
  name?: string;
  time_known: boolean; // Si la hora es conocida con certeza
}

// =============================================================================
// UTILIDADES DE TIPOS
// =============================================================================

export type DegreeMinuteSecond = {
  degrees: number;
  minutes: number;
  seconds: number;
};

export interface AstrologicalPosition {
  planet: Planet | ExtendedPlanet;
  longitude: number;        // 0-359.99
  latitude: number;         // Latitud eclíptica
  distance: number;         // Distancia en AU
  speed_longitude: number;  // Velocidad en longitud
  speed_latitude: number;   // Velocidad en latitud
}

// =============================================================================
// CONSTANTES ÚTILES
// =============================================================================

export const ZODIAC_SIGNS: ZodiacSignInfo[] = [
  { name: 'aries', symbol: '♈', element: 'fuego', modality: 'cardinal', ruler: 'marte', degree_start: 0, degree_end: 29.99 },
  { name: 'tauro', symbol: '♉', element: 'tierra', modality: 'fijo', ruler: 'venus', degree_start: 30, degree_end: 59.99 },
  { name: 'geminis', symbol: '♊', element: 'aire', modality: 'mutable', ruler: 'mercurio', degree_start: 60, degree_end: 89.99 },
  { name: 'cancer', symbol: '♋', element: 'agua', modality: 'cardinal', ruler: 'luna', degree_start: 90, degree_end: 119.99 },
  { name: 'leo', symbol: '♌', element: 'fuego', modality: 'fijo', ruler: 'sol', degree_start: 120, degree_end: 149.99 },
  { name: 'virgo', symbol: '♍', element: 'tierra', modality: 'mutable', ruler: 'mercurio', degree_start: 150, degree_end: 179.99 },
  { name: 'libra', symbol: '♎', element: 'aire', modality: 'cardinal', ruler: 'venus', degree_start: 180, degree_end: 209.99 },
  { name: 'escorpio', symbol: '♏', element: 'agua', modality: 'fijo', ruler: 'pluton', degree_start: 210, degree_end: 239.99 },
  { name: 'sagitario', symbol: '♐', element: 'fuego', modality: 'mutable', ruler: 'jupiter', degree_start: 240, degree_end: 269.99 },
  { name: 'capricornio', symbol: '♑', element: 'tierra', modality: 'cardinal', ruler: 'saturno', degree_start: 270, degree_end: 299.99 },
  { name: 'acuario', symbol: '♒', element: 'aire', modality: 'fijo', ruler: 'urano', degree_start: 300, degree_end: 329.99 },
  { name: 'piscis', symbol: '♓', element: 'agua', modality: 'mutable', ruler: 'neptuno', degree_start: 330, degree_end: 359.99 }
];

export const PLANET_SYMBOLS: Record<Planet | ExtendedPlanet, string> = {
  sol: '☉',
  luna: '☽',
  mercurio: '☿',
  venus: '♀',
  marte: '♂',
  jupiter: '♃',
  saturno: '♄',
  urano: '♅',
  neptuno: '♆',
  pluton: '♇',
  nodo_norte: '☊',
  nodo_sur: '☋',
  quiron: '⚷',
  lilith: '⚸'
};