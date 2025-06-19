// src/utils/astrology/aspectCalculations.ts - VERSIÓN SIMPLIFICADA SIN ERRORES
import type { AspectType, Planet, ExtendedPlanet, PlanetaryAspect } from '../../../types/astrology';

// =============================================================================
// CONFIGURACIÓN DE ASPECTOS COMPLETA
// =============================================================================

export interface AspectDefinition {
  name: AspectType;
  angle: number;
  orb_major: number;      // Orbe para planetas mayores (Sol, Luna, Mercurio, Venus, Marte)
  orb_minor: number;      // Orbe para planetas menores (Júpiter, Saturno, Urano, Neptuno, Plutón)
  nature: 'harmonico' | 'tensional' | 'neutro';
  symbol: string;
  color: string;
  line_style: 'solid' | 'dashed' | 'dotted';
  line_width: number;
  priority: number;       // 1 = más importante
  is_major: boolean;
}

export const ASPECT_DEFINITIONS: Record<AspectType, AspectDefinition> = {
  conjunction: {
    name: 'conjunction',
    angle: 0,
    orb_major: 8,
    orb_minor: 6,
    nature: 'neutro',
    symbol: '☌',
    color: '#22C55E',        // Verde brillante
    line_style: 'solid',
    line_width: 4,
    priority: 1,
    is_major: true
  },
  opposition: {
    name: 'opposition',
    angle: 180,
    orb_major: 8,
    orb_minor: 6,
    nature: 'tensional',
    symbol: '☍',
    color: '#EF4444',        // Rojo brillante
    line_style: 'solid',
    line_width: 3.5,
    priority: 2,
    is_major: true
  },
  trine: {
    name: 'trine',
    angle: 120,
    orb_major: 8,
    orb_minor: 6,
    nature: 'harmonico',
    symbol: '△',
    color: '#3B82F6',        // Azul brillante
    line_style: 'solid',
    line_width: 3,
    priority: 3,
    is_major: true
  },
  square: {
    name: 'square',
    angle: 90,
    orb_major: 8,
    orb_minor: 6,
    nature: 'tensional',
    symbol: '□',
    color: '#F59E0B',        // Naranja brillante
    line_style: 'solid',
    line_width: 3,
    priority: 4,
    is_major: true
  },
  sextile: {
    name: 'sextile',
    angle: 60,
    orb_major: 6,
    orb_minor: 4,
    nature: 'harmonico',
    symbol: '⚹',
    color: '#8B5CF6',        // Púrpura brillante
    line_style: 'dashed',
    line_width: 2.5,
    priority: 5,
    is_major: true
  },
  quincunx: {
    name: 'quincunx',
    angle: 150,
    orb_major: 3,
    orb_minor: 2,
    nature: 'tensional',
    symbol: '⚻',
    color: '#EC4899',        // Rosa brillante
    line_style: 'dotted',
    line_width: 2,
    priority: 6,
    is_major: false
  },
  semisextile: {
    name: 'semisextile',
    angle: 30,
    orb_major: 2,
    orb_minor: 1.5,
    nature: 'harmonico',
    symbol: '⚺',
    color: '#10B981',        // Verde esmeralda
    line_style: 'dotted',
    line_width: 1.5,
    priority: 7,
    is_major: false
  },
  sesquiquadrate: {
    name: 'sesquiquadrate',
    angle: 135,
    orb_major: 2,
    orb_minor: 1.5,
    nature: 'tensional',
    symbol: '⚼',
    color: '#F97316',        // Naranja intenso
    line_style: 'dotted',
    line_width: 1.5,
    priority: 8,
    is_major: false
  },
  semisquare: {
    name: 'semisquare',
    angle: 45,
    orb_major: 2,
    orb_minor: 1.5,
    nature: 'tensional',
    symbol: '∠',
    color: '#EF4444',        // Rojo claro
    line_style: 'dotted',
    line_width: 1.5,
    priority: 9,
    is_major: false
  },
  quintile: {
    name: 'quintile',
    angle: 72,
    orb_major: 1.5,
    orb_minor: 1,
    nature: 'harmonico',
    symbol: 'Q',
    color: '#06B6D4',        // Cian brillante
    line_style: 'dotted',
    line_width: 1,
    priority: 10,
    is_major: false
  },
  biquintile: {
    name: 'biquintile',
    angle: 144,
    orb_major: 1.5,
    orb_minor: 1,
    nature: 'harmonico',
    symbol: 'bQ',
    color: '#0EA5E9',        // Azul cielo
    line_style: 'dotted',
    line_width: 1,
    priority: 11,
    is_major: false
  }
};

// =============================================================================
// CONFIGURACIÓN DE PLANETAS
// =============================================================================

export const MAJOR_PLANETS = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte'];
export const MINOR_PLANETS = ['Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'];

export const PLANET_ORB_MODIFIERS: Record<string, number> = {
  'Sol': 1.3,
  'Luna': 1.3,
  'Mercurio': 1.0,
  'Venus': 1.0,
  'Marte': 1.0,
  'Júpiter': 1.1,
  'Saturno': 1.1,
  'Urano': 0.8,
  'Neptuno': 0.8,
  'Plutón': 0.8,
  'Quirón': 0.6,
  'Nodo Norte': 0.7,
  'Nodo Sur': 0.7,
  'Lilith': 0.5
};

// =============================================================================
// INTERFACES
// =============================================================================

export interface PlanetPosition {
  name: string;
  longitude: number;
  classification: 'major' | 'minor' | 'special';
}

export interface CalculatedAspect {
  id: string;
  visual: {};
  separating: boolean;
  applying: boolean;
  planet1: string;
  planet2: string;
  aspect_type: AspectType;
  exact_angle: number;
  current_separation: number;
  orb: number;
  orb_percentage: number;
  is_applying: boolean;
  strength: 'muy_fuerte' | 'fuerte' | 'moderado' | 'debil';
  nature: 'harmonico' | 'tensional' | 'neutro';
}

export interface AspectCalculationOptions {
  include_minor_aspects?: boolean;
  orb_modifier?: number;
  max_orb_override?: number;
  only_applying_aspects?: boolean;
  minimum_strength?: 'muy_fuerte' | 'fuerte' | 'moderado' | 'debil';
}

// =============================================================================
// FUNCIONES MATEMÁTICAS
// =============================================================================

export function normalizeAngle(angle: number): number {
  while (angle < 0) angle += 360;
  while (angle >= 360) angle -= 360;
  return angle;
}

export function calculateAngularSeparation(angle1: number, angle2: number): number {
  const diff = Math.abs(normalizeAngle(angle1) - normalizeAngle(angle2));
  return Math.min(diff, 360 - diff);
}

export function classifyPlanet(planetName: string): 'major' | 'minor' | 'special' {
  if (MAJOR_PLANETS.includes(planetName)) return 'major';
  if (MINOR_PLANETS.includes(planetName)) return 'minor';
  return 'special';
}

export function calculateEffectiveOrb(
  planet1: string,
  planet2: string,
  aspectDefinition: AspectDefinition,
  orbModifier: number = 1.0
): number {
  const class1 = classifyPlanet(planet1);
  const class2 = classifyPlanet(planet2);
  
  const baseOrb = (class1 === 'major' || class2 === 'major') 
    ? aspectDefinition.orb_major 
    : aspectDefinition.orb_minor;
  
  const modifier1 = PLANET_ORB_MODIFIERS[planet1] || 1.0;
  const modifier2 = PLANET_ORB_MODIFIERS[planet2] || 1.0;
  const averageModifier = (modifier1 + modifier2) / 2;
  
  return baseOrb * averageModifier * orbModifier;
}

export function calculateAspectStrength(
  actualOrb: number,
  maxOrb: number
): 'muy_fuerte' | 'fuerte' | 'moderado' | 'debil' {
  const orbPercentage = Math.abs(actualOrb) / maxOrb;
  
  if (orbPercentage <= 0.15) return 'muy_fuerte';
  if (orbPercentage <= 0.35) return 'fuerte';
  if (orbPercentage <= 0.65) return 'moderado';
  return 'debil';
}

// =============================================================================
// CÁLCULO PRINCIPAL DE ASPECTOS
// =============================================================================

export function findAspectBetweenPlanets(
  planet1: PlanetPosition,
  planet2: PlanetPosition,
  options: AspectCalculationOptions = {}
): CalculatedAspect | null {
  const {
    include_minor_aspects = false,
    orb_modifier = 1.0,
    max_orb_override,
    only_applying_aspects = false,
    minimum_strength
  } = options;

  const separation = calculateAngularSeparation(planet1.longitude, planet2.longitude);
  
  const aspectsToCheck = include_minor_aspects 
    ? Object.values(ASPECT_DEFINITIONS)
    : Object.values(ASPECT_DEFINITIONS).filter(a => a.is_major);

  let bestAspect: CalculatedAspect | null = null;
  let smallestOrb = Infinity;

  for (const aspectDef of aspectsToCheck) {
    const effectiveOrb = calculateEffectiveOrb(
      planet1.name,
      planet2.name,
      aspectDef,
      orb_modifier
    );
    
    const maxOrb = max_orb_override || effectiveOrb;
    
    const orbFromExact = Math.abs(separation - aspectDef.angle);
    const orbFromExactReverse = Math.abs((360 - separation) - aspectDef.angle);
    const actualOrb = Math.min(orbFromExact, orbFromExactReverse);
    
    if (actualOrb <= maxOrb && actualOrb < smallestOrb) {
      const isApplying = actualOrb < 1.0; // Simplificado
      
      if (only_applying_aspects && !isApplying) continue;
      
      const strength = calculateAspectStrength(actualOrb, maxOrb);
      
      if (minimum_strength) {
        const strengthOrder = { 'muy_fuerte': 4, 'fuerte': 3, 'moderado': 2, 'debil': 1 };
        if (strengthOrder[strength] < strengthOrder[minimum_strength]) continue;
      }
      
      const orbPercentage = actualOrb / maxOrb;
      
      bestAspect = {
        id: `${planet1.name}-${planet2.name}-${aspectDef.name}`,
        visual: {},
        separating: !isApplying,
        applying: isApplying,
        planet1: planet1.name,
        planet2: planet2.name,
        aspect_type: aspectDef.name,
        exact_angle: aspectDef.angle,
        current_separation: separation,
        orb: actualOrb,
        orb_percentage: orbPercentage,
        is_applying: isApplying,
        strength,
        nature: aspectDef.nature
      };
      
      smallestOrb = actualOrb;
    }
  }

  return bestAspect;
}

export function calculateAllAspects(
  planets: Array<{ name: string; longitude: number }>,
  options: AspectCalculationOptions = {}
): CalculatedAspect[] {
  const planetPositions: PlanetPosition[] = planets.map(planet => ({
    name: planet.name,
    longitude: planet.longitude,
    classification: classifyPlanet(planet.name)
  }));

  const aspects: CalculatedAspect[] = [];
  
  for (let i = 0; i < planetPositions.length; i++) {
    for (let j = i + 1; j < planetPositions.length; j++) {
      const aspect = findAspectBetweenPlanets(planetPositions[i], planetPositions[j], options);
      if (aspect) {
        aspects.push(aspect);
      }
    }
  }
  
  return aspects.sort((a, b) => {
    const configA = ASPECT_DEFINITIONS[a.aspect_type];
    const configB = ASPECT_DEFINITIONS[b.aspect_type];
    
    if (configA.priority !== configB.priority) {
      return configA.priority - configB.priority;
    }
    
    return a.orb - b.orb;
  });
}

export function convertToComponentFormat(aspects: CalculatedAspect[]): Array<{
  planet1: string;
  planet2: string;
  type: string;
  orb: number;
  angle?: number;
}> {
  return aspects.map(aspect => ({
    planet1: aspect.planet1,
    planet2: aspect.planet2,
    type: aspect.aspect_type,
    orb: aspect.orb,
    angle: aspect.current_separation
  }));  
}

// =============================================================================
// EXPORTACIONES ADICIONALES PARA COMPATIBILIDAD
// =============================================================================


// Función de validación
export function validateAspects(aspects: CalculatedAspect[]): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  aspects.forEach((aspect, index) => {
    if (!aspect.planet1 || !aspect.planet2) {
      errors.push(`Aspecto ${index}: planetas faltantes`);
    }
    
    if (!aspect.aspect_type || !ASPECT_DEFINITIONS[aspect.aspect_type]) {
      errors.push(`Aspecto ${index}: tipo de aspecto inválido`);
    }
    
    if (typeof aspect.orb !== 'number' || isNaN(aspect.orb)) {
      errors.push(`Aspecto ${index}: orbe inválido`);
    }
    
    const aspectDef = ASPECT_DEFINITIONS[aspect.aspect_type];
    if (aspectDef && Math.abs(aspect.orb) > aspectDef.orb_major + 2) {
      warnings.push(`Aspecto ${index}: orbe muy amplio (${aspect.orb.toFixed(2)}°)`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// =============================================================================
// EXPORTACIÓN DEFAULT Y NAMED EXPORTS
// =============================================================================

// Exportación por defecto
export default {
  calculateAllAspects,
  findAspectBetweenPlanets,
  convertToComponentFormat,
  analyzeAspectDistribution,
  validateAspects,
  ASPECT_DEFINITIONS,
  PLANET_ORB_MODIFIERS,
  normalizeAngle,
  calculateAngularSeparation,
  calculateEffectiveOrb,
  calculateAspectStrength,
  classifyPlanet
};

// =============================================================================
// EXPORTACIONES ADICIONALES PARA COMPATIBILIDAD
// =============================================================================

// Función de análisis de aspectos
export function analyzeAspectDistribution(aspects: CalculatedAspect[]) {
  const byType = aspects.reduce((acc, aspect) => {
    acc[aspect.aspect_type] = (acc[aspect.aspect_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const byNature = aspects.reduce((acc, aspect) => {
    acc[aspect.nature] = (acc[aspect.nature] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const byStrength = aspects.reduce((acc, aspect) => {
    acc[aspect.strength] = (acc[aspect.strength] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  };
  
