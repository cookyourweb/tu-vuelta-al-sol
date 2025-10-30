//src/data/astrology.ts

export type ZodiacSign = 
  'Aries' | 'Tauro' | 'Géminis' | 'Cáncer' | 'Leo' | 'Virgo' | 
  'Libra' | 'Escorpio' | 'Sagitario' | 'Capricornio' | 'Acuario' | 'Piscis';
// types/astrology.ts (continuación)

export type PlanetName = 
  'Sol' | 'Luna' | 'Mercurio' | 'Venus' | 'Marte' | 'Júpiter' | 
  'Saturno' | 'Urano' | 'Neptuno' | 'Plutón' | 'Quirón' | 'Lilith' | 
  'Nodo N Verdadero' | 'Nodo S Verdadero';

export type AspectName = 
  'Conjunción' | 'Oposición' | 'Cuadratura' | 'Trígono' | 'Sextil' | 
  'Quincuncio' | 'Semisextil' | 'Sesquicuadratura' | 'Semicuadratura' | 
  'Quintil' | 'Biquintil' | 'Paralelo' | 'Contraparalelo';

export type AngleName = 
  'Ascendente' | 'Medio Cielo' | 'Descendente' | 'Nadir';

export interface Planet {
  name: PlanetName;
  sign: ZodiacSign;
  degree: string;
  longitude: number;
  houseNumber: number;
  isRetrograde: boolean;
}

export interface House {
  number: number;
  sign: ZodiacSign;
  degree: string;
  longitude: number;
}

export interface Aspect {
  planet1: {
    id: number;
    name: string;
  };
  planet2: {
    id: number;
    name: string;
  };
  aspect: {
    id: number;
    name: AspectName;
  };
  orb: number;
}

export interface Angle {
  name: AngleName;
  sign: ZodiacSign;
  degree: string;
  longitude: number;
}


export interface ChartData {
  houses: House[];
  planets: Planet[];
  aspects: Aspect[];
  angles: Angle[];
  elementDistribution: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };
  
  modalityDistribution: {
    cardinal: number;
    fixed: number;
    mutable: number;
  };
  keyAspects: Aspect[];
}
export interface PlanetPosition {
  name: PlanetName;
  sign: ZodiacSign;
  degree: string;
  longitude: number;          
  houseNumber: number;      
  isRetrograde: boolean;
}