// src/lib/prokerala/types.ts
export interface NatalChartParams {
    birthDate: string;
    birthTime?: string;
    latitude: number;
    longitude: number;
    timezone?: string;
  }
  
  export interface NatalChartResponse {
    planets?: Planet[];
    houses?: House[];
    aspects?: Aspect[];
    ascendant?: Angle;
    mc?: Angle;
    // Add other fields as needed
  }
  
  export interface Planet {
    id: number;
    name: string;
    longitude: number;
    latitude?: number;
    sign?: string;
    house?: number;
    is_retrograde?: boolean;
  }
  
  export interface House {
    id: number;
    number: number;
    longitude: number;
    sign?: string;
  }
  
  export interface Aspect {
    planet1: { id: number; name: string };
    planet2: { id: number; name: string };
    aspect: { id: number; name: string };
    orb: number;
  }
  
  export interface Angle {
    id: number;
    name: string;
    longitude: number;
    sign?: string;
  }
  
  // Add utility type for zodiac signs
  export type ZodiacSign = 
    'Aries' | 'Tauro' | 'Géminis' | 'Cáncer' | 'Leo' | 'Virgo' | 
    'Libra' | 'Escorpio' | 'Sagitario' | 'Capricornio' | 'Acuario' | 'Piscis';
  
  // Add utility type for planet names
  export type PlanetName = 
    'Sol' | 'Luna' | 'Mercurio' | 'Venus' | 'Marte' | 'Júpiter' | 
    'Saturno' | 'Urano' | 'Neptuno' | 'Plutón' | 'Quirón' | 'Nodo Norte' | 
    'Nodo Sur' | 'Lilith';