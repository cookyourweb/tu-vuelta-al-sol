// ═══════════════════════════════════════════════════════════
// INTERFACES PRINCIPALES
// ═══════════════════════════════════════════════════════════

export interface TooltipContent {
  titulo: string;              // Título profesional sin emojis
  descripcionBreve: string;    // "Sol en Acuario en Casa 1"
  significado: string;         // 2-4 líneas con lenguaje observador
  efecto: string;              // 1 línea de efecto
  tipo: string;                // 1 línea de tipo/cualidad
}

export interface ShadowWork {
  nombre: string;              // "Rebeldía sin Causa"
  descripcion: string;         // Descripción de la sombra
  trampa: string;              // ❌ Lo que NO hacer
  regalo: string;              // ✅ Lo que SÍ hacer
}

export interface DrawerContent {
  titulo: string;              // Título profesional completo
  educativo: string;           // Múltiples párrafos (usar \n\n)
  observador: string;          // Múltiples párrafos - Cómo se manifiesta
  impacto_real: string;        // Múltiples párrafos - Impacto concreto en la vida
  sombras: ShadowWork[];       // Array de sombras
  sintesis: {
    frase: string;             // Frase memorable
    declaracion: string;       // Declaración personalizada
  };
}

export interface FullInterpretation {
  tooltip: TooltipContent;
  drawer: DrawerContent;
}

// ═══════════════════════════════════════════════════════════
// TIPOS DE IDENTIFICADORES
// ═══════════════════════════════════════════════════════════

export type PlanetName = 
  | 'Sol' | 'Luna' | 'Mercurio' | 'Venus' | 'Marte' 
  | 'Júpiter' | 'Saturno' | 'Urano' | 'Neptuno' | 'Plutón';

export type ZodiacSign = 
  | 'Aries' | 'Tauro' | 'Géminis' | 'Cáncer' | 'Leo' | 'Virgo'
  | 'Libra' | 'Escorpio' | 'Sagitario' | 'Capricornio' | 'Acuario' | 'Piscis';

export type HouseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type AspectType = 
  | 'Conjunción' | 'Oposición' | 'Trígono' | 'Cuadratura' 
  | 'Sextil' | 'Quincuncio' | 'Semisextil' | 'Semicuadratura';

// ═══════════════════════════════════════════════════════════
// MAPAS DE INTERPRETACIONES
// ═══════════════════════════════════════════════════════════

export type PlanetInterpretationMap = {
  [key: string]: FullInterpretation; // Key: "Sol-Acuario-Casa1"
};

export type AspectInterpretationMap = {
  [key: string]: FullInterpretation; // Key: "Sol-Oposicion-Luna"
};