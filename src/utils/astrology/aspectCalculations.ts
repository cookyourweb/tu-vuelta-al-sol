// src/app/utils/astrology/aspectCalculations.ts - VERSIÓN CORREGIDA

import { AspectType, PlanetaryAspect } from "../../types/astrology";
import type { Planet, ExtendedPlanet } from "../../types/astrology/basic";



// =============================================================================
// CONFIGURACIÓN DE ASPECTOS
// =============================================================================

export interface AspectDefinition {
  name: AspectType;
  angle: number;
  orb: number;
  nature: 'harmonico' | 'tensional' | 'neutro';
  symbol: string;
  isMajor: boolean;
}

export const ASPECT_DEFINITIONS: Record<AspectType, AspectDefinition> = {
  conjunction: {
    name: 'conjunction',
    angle: 0,
    orb: 8,
    nature: 'neutro',
    symbol: '☌',
    isMajor: true
  },
  opposition: {
    name: 'opposition',
    angle: 180,
    orb: 8,
    nature: 'tensional',
    symbol: '☍',
    isMajor: true
  },
  trine: {
    name: 'trine',
    angle: 120,
    orb: 8,
    nature: 'harmonico',
    symbol: '△',
    isMajor: true
  },
  square: {
    name: 'square',
    angle: 90,
    orb: 8,
    nature: 'tensional',
    symbol: '□',
    isMajor: true
  },
  sextile: {
    name: 'sextile',
    angle: 60,
    orb: 6,
    nature: 'harmonico',
    symbol: '⚹',
    isMajor: true
  },
  quincunx: {
    name: 'quincunx',
    angle: 150,
    orb: 3,
    nature: 'tensional',
    symbol: '⚻',
    isMajor: false
  },
  semisextile: {
    name: 'semisextile',
    angle: 30,
    orb: 2,
    nature: 'harmonico',
    symbol: '⚺',
    isMajor: false
  },
  sesquiquadrate: {
    name: 'sesquiquadrate',
    angle: 135,
    orb: 2,
    nature: 'tensional',
    symbol: '⚼',
    isMajor: false
  },
  semisquare: {
    name: 'semisquare',
    angle: 45,
    orb: 2,
    nature: 'tensional',
    symbol: '∠',
    isMajor: false
  },
  quintile: {
    name: 'quintile',
    angle: 72,
    orb: 1,
    nature: 'harmonico',
    symbol: 'Q',
    isMajor: false
  },
  biquintile: {
    name: 'biquintile',
    angle: 144,
    orb: 1,
    nature: 'harmonico',
    symbol: 'bQ',
    isMajor: false
  }
};

// Modificadores de orbe por planeta
export const PLANET_ORB_MODIFIERS: Record<string, number> = {
  'sol': 1.3,
  'luna': 1.3,
  'mercurio': 1.0,
  'venus': 1.0,
  'marte': 1.0,
  'jupiter': 1.2,
  'saturno': 1.2,
  'urano': 0.8,
  'neptuno': 0.8,
  'pluton': 0.8,
  'quiron': 0.6,
  'nodo_norte': 0.8,
  'nodo_sur': 0.8,
  'lilith': 0.5
};

// =============================================================================
// INTERFACES
// =============================================================================

export interface PlanetPosition {
  planet: Planet | ExtendedPlanet | string;
  degree: number;
  name?: string;
  longitude?: number;
}

export interface AspectCalculationOptions {
  includeMinorAspects?: boolean;
  orbModifier?: number;
  maxOrb?: number;
  onlyApplyingAspects?: boolean;
}

export interface CalculatedAspect {
  planet1: Planet | ExtendedPlanet | string;
  planet2: Planet | ExtendedPlanet | string;
  aspect_type: AspectType;
  orb: number;
  exact_angle: number;
  is_applying: boolean;
  strength: 'muy_fuerte' | 'fuerte' | 'moderado' | 'debil';
  nature: 'harmonico' | 'tensional' | 'neutro';
}

// =============================================================================
// FUNCIONES DE CÁLCULO
// =============================================================================

/**
 * Normalizar ángulo a rango 0-360
 */
export function normalizeAngle(angle: number): number {
  while (angle < 0) angle += 360;
  while (angle >= 360) angle -= 360;
  return angle;
}

/**
 * Calcular diferencia angular más corta entre dos puntos
 */
export function calculateAngularDifference(angle1: number, angle2: number): number {
  const diff = Math.abs(normalizeAngle(angle1) - normalizeAngle(angle2));
  return Math.min(diff, 360 - diff);
}

/**
 * Determinar si un aspecto está aplicándose o separándose
 */
export function isAspectApplying(
  planet1Degree: number, 
  planet2Degree: number, 
  aspectAngle: number
): boolean {
  const currentSeparation = calculateAngularDifference(planet1Degree, planet2Degree);
  return Math.abs(currentSeparation - aspectAngle) < 1;
}

/**
 * Calcular orbe efectivo considerando los planetas involucrados
 */
export function calculateEffectiveOrb(
  planet1: Planet | ExtendedPlanet | string,
  planet2: Planet | ExtendedPlanet | string,
  baseOrb: number,
  orbModifier: number = 1.0
): number {
  const modifier1 = PLANET_ORB_MODIFIERS[planet1.toLowerCase()] || 1.0;
  const modifier2 = PLANET_ORB_MODIFIERS[planet2.toLowerCase()] || 1.0;
  const averageModifier = (modifier1 + modifier2) / 2;
  
  return baseOrb * averageModifier * orbModifier;
}

/**
 * Determinar la fuerza de un aspecto basada en el orbe
 */
export function calculateAspectStrength(
  orb: number, 
  maxOrb: number
): 'muy_fuerte' | 'fuerte' | 'moderado' | 'debil' {
  const orbPercentage = Math.abs(orb) / maxOrb;
  
  if (orbPercentage <= 0.2) return 'muy_fuerte';      // 0-20% del orbe máximo
  if (orbPercentage <= 0.4) return 'fuerte';          // 20-40%
  if (orbPercentage <= 0.7) return 'moderado';        // 40-70%
  return 'debil';                                      // 70-100%
}

/**
 * Buscar aspecto entre dos planetas
 */
export function findAspectBetweenPlanets(
  planet1: PlanetPosition,
  planet2: PlanetPosition,
  options: AspectCalculationOptions = {}
): CalculatedAspect | null {
  const {
    includeMinorAspects = false,
    orbModifier = 1.0,
    maxOrb = 8
  } = options;

  const separation = calculateAngularDifference(planet1.degree, planet2.degree);
  
  // Verificar cada tipo de aspecto
  const aspectsToCheck = includeMinorAspects 
    ? Object.values(ASPECT_DEFINITIONS)
    : Object.values(ASPECT_DEFINITIONS).filter(a => a.isMajor);

  for (const aspectDef of aspectsToCheck) {
    const effectiveOrb = calculateEffectiveOrb(
      planet1.planet, 
      planet2.planet, 
      aspectDef.orb, 
      orbModifier
    );
    
    const finalMaxOrb = Math.min(effectiveOrb, maxOrb);
    const orbFromExact = Math.abs(separation - aspectDef.angle);
    
    // Verificar también el aspecto "al revés" (ej: 180° también es 180°)
    const orbFromExactReverse = Math.abs((360 - separation) - aspectDef.angle);
    const actualOrb = Math.min(orbFromExact, orbFromExactReverse);
    
    if (actualOrb <= finalMaxOrb) {
      // Determinar el orbe con signo (aplicándose vs separándose)
      const isApplying = isAspectApplying(planet1.degree, planet2.degree, aspectDef.angle);
      const signedOrb = isApplying ? -actualOrb : actualOrb;
      
      return {
        planet1: planet1.planet,
        planet2: planet2.planet,
        aspect_type: aspectDef.name,
        orb: signedOrb,
        exact_angle: aspectDef.angle,
        is_applying: isApplying,
        strength: calculateAspectStrength(actualOrb, finalMaxOrb),
        nature: aspectDef.nature
      };
    }
  }
  
  return null;
}

/**
 * Calcular todos los aspectos entre una lista de planetas
 */
export function calculateAllAspects(
  planets: PlanetPosition[],
  options: AspectCalculationOptions = {}
): CalculatedAspect[] {
  const aspects: CalculatedAspect[] = [];
  
  // Verificar cada par de planetas
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const aspect = findAspectBetweenPlanets(planets[i], planets[j], options);
      if (aspect) {
        aspects.push(aspect);
      }
    }
  }
  
  // Ordenar por fuerza del aspecto
  return aspects.sort((a, b) => {
    const strengthOrder = { 'muy_fuerte': 4, 'fuerte': 3, 'moderado': 2, 'debil': 1 };
    return strengthOrder[b.strength] - strengthOrder[a.strength];
  });
}

/**
 * Convertir CalculatedAspect a PlanetaryAspect (para compatibilidad)
 */
export function convertToPlanetaryAspect(aspect: CalculatedAspect): PlanetaryAspect {
  // Convertir nombres de planetas a minúsculas para compatibilidad con el tipo Planet
  const planet1 = typeof aspect.planet1 === 'string' ? aspect.planet1.toLowerCase() : aspect.planet1;
  const planet2 = typeof aspect.planet2 === 'string' ? aspect.planet2.toLowerCase() : aspect.planet2;
  
  return {
    id: `${planet1}_${aspect.aspect_type}_${planet2}`,
    planet1: planet1 as Planet | ExtendedPlanet,
    planet2: planet2 as Planet | ExtendedPlanet,
    aspect_type: aspect.aspect_type,
    exact_angle: aspect.exact_angle,
    orb: aspect.orb,
    applying: aspect.is_applying,
    separating: !aspect.is_applying,
    strength: aspect.strength,
    visual: {
      color: getAspectColor(aspect.nature, aspect.aspect_type),
      line_width: getAspectLineWidth(aspect.strength),
      line_style: getAspectLineStyle(aspect.aspect_type),
      opacity: getAspectOpacity(aspect.strength),
      z_index: getAspectZIndex(aspect.strength)
    }
  };
}

/**
 * Obtener color del aspecto según su naturaleza
 */
function getAspectColor(nature: 'harmonico' | 'tensional' | 'neutro', aspectType: AspectType): string {
  const colorMap = {
    'conjunction': '#FFD700',
    'opposition': '#FF4444',
    'trine': '#4CAF50',
    'square': '#FF9800',
    'sextile': '#2196F3',
    'quincunx': '#9C27B0',
    'semisextile': '#81C784',
    'sesquiquadrate': '#FF5722',
    'semisquare': '#FF7043',
    'quintile': '#E1BEE7',
    'biquintile': '#CE93D8'
  };
  
  return colorMap[aspectType as keyof typeof colorMap] || '#999999';
}

/**
 * Obtener grosor de línea según fuerza
 */
function getAspectLineWidth(strength: 'muy_fuerte' | 'fuerte' | 'moderado' | 'debil'): number {
  const widthMap = {
    'muy_fuerte': 3,
    'fuerte': 2.5,
    'moderado': 2,
    'debil': 1.5
  };
  
  return widthMap[strength];
}

/**
 * Obtener estilo de línea según tipo de aspecto
 */
function getAspectLineStyle(aspectType: AspectType): 'solid' | 'dashed' | 'dotted' {
  const majorAspects = ['conjunction', 'opposition', 'trine', 'square', 'sextile'];
  
  if (majorAspects.includes(aspectType)) {
    return 'solid';
  } else if (aspectType === 'quincunx') {
    return 'dashed';
  } else {
    return 'dotted';
  }
}

/**
 * Obtener opacidad según fuerza
 */
function getAspectOpacity(strength: 'muy_fuerte' | 'fuerte' | 'moderado' | 'debil'): number {
  const opacityMap = {
    'muy_fuerte': 0.9,
    'fuerte': 0.8,
    'moderado': 0.7,
    'debil': 0.5
  };
  
  return opacityMap[strength];
}

/**
 * Obtener z-index según fuerza (para layering)
 */
function getAspectZIndex(strength: 'muy_fuerte' | 'fuerte' | 'moderado' | 'debil'): number {
  const zIndexMap = {
    'muy_fuerte': 4,
    'fuerte': 3,
    'moderado': 2,
    'debil': 1
  };
  
  return zIndexMap[strength];
}

/**
 * Filtrar aspectos por criterios específicos
 */
export function filterAspects(
  aspects: CalculatedAspect[],
  criteria: {
    aspectTypes?: AspectType[];
    planets?: (Planet | ExtendedPlanet | string)[];
    maxOrb?: number;
    minStrength?: 'debil' | 'moderado' | 'fuerte' | 'muy_fuerte';
    nature?: ('harmonico' | 'tensional' | 'neutro')[];
  }
): CalculatedAspect[] {
  return aspects.filter(aspect => {
    // Filtro por tipo de aspecto
    if (criteria.aspectTypes && !criteria.aspectTypes.includes(aspect.aspect_type)) {
      return false;
    }
    
    // Filtro por planetas
    if (criteria.planets) {
      const hasTargetPlanet = criteria.planets.includes(aspect.planet1) || 
                             criteria.planets.includes(aspect.planet2);
      if (!hasTargetPlanet) return false;
    }
    
    // Filtro por orbe máximo
    if (criteria.maxOrb && Math.abs(aspect.orb) > criteria.maxOrb) {
      return false;
    }
    
    // Filtro por fuerza mínima
    if (criteria.minStrength) {
      const strengthOrder = { 'debil': 1, 'moderado': 2, 'fuerte': 3, 'muy_fuerte': 4 };
      const minStrengthValue = strengthOrder[criteria.minStrength];
      const aspectStrengthValue = strengthOrder[aspect.strength];
      if (aspectStrengthValue < minStrengthValue) return false;
    }
    
    // Filtro por naturaleza
    if (criteria.nature && !criteria.nature.includes(aspect.nature)) {
      return false;
    }
    
    return true;
  });
}

/**
 * Obtener estadísticas de aspectos
 */
export function getAspectStatistics(aspects: CalculatedAspect[]) {
  const stats = {
    total: aspects.length,
    byType: {} as Record<AspectType, number>,
    byNature: { harmonico: 0, tensional: 0, neutro: 0 },
    byStrength: { muy_fuerte: 0, fuerte: 0, moderado: 0, debil: 0 },
    strongestAspect: null as CalculatedAspect | null,
    averageOrb: 0
  };
  
  let totalOrb = 0;
  
  aspects.forEach(aspect => {
    // Contar por tipo
    stats.byType[aspect.aspect_type] = (stats.byType[aspect.aspect_type] || 0) + 1;
    
    // Contar por naturaleza
    stats.byNature[aspect.nature]++;
    
    // Contar por fuerza
    stats.byStrength[aspect.strength]++;
    
    // Sumar orbes para promedio
    totalOrb += Math.abs(aspect.orb);
    
    // Encontrar el aspecto más fuerte
    if (!stats.strongestAspect || 
        (aspect.strength === 'muy_fuerte' && stats.strongestAspect.strength !== 'muy_fuerte') ||
        (aspect.strength === 'fuerte' && !['muy_fuerte'].includes(stats.strongestAspect.strength)) ||
        (aspect.strength === 'moderado' && ['debil'].includes(stats.strongestAspect.strength))) {
      stats.strongestAspect = aspect;
    }
  });
  
  stats.averageOrb = aspects.length > 0 ? totalOrb / aspects.length : 0;
  
  return stats;
}

/**
 * Convertir desde el formato de la página natal-chart
 */
export function convertFromNatalChartFormat(aspects: Array<{
  planet1: string;
  planet2: string;
  type: string;
  orb: number;
  exact_angle: number;
}>): CalculatedAspect[] {
  return aspects.map(aspect => ({
    planet1: aspect.planet1,
    planet2: aspect.planet2,
    aspect_type: aspect.type as AspectType,
    orb: aspect.orb,
    exact_angle: aspect.exact_angle,
    is_applying: aspect.orb < 0,
    strength: calculateAspectStrength(Math.abs(aspect.orb), 8),
    nature: ASPECT_DEFINITIONS[aspect.type as AspectType]?.nature || 'neutro'
  }));
}

/**
 * Convertir hacia el formato de NatalChartWheel
 */
export function convertToNatalChartFormat(aspects: CalculatedAspect[]): Array<{
  planet1: string;
  planet2: string;
  type: 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile' | 'quincunx';
  orb: number;
  exact_angle: number;
}> {
  return aspects.map(aspect => ({
    planet1: aspect.planet1.toString(),
    planet2: aspect.planet2.toString(),
    type: aspect.aspect_type as 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile' | 'quincunx',
    orb: aspect.orb,
    exact_angle: aspect.exact_angle
  }));
}

/**
 * Función helper para debugging - mostrar aspectos en consola
 */
export function debugAspects(aspects: CalculatedAspect[]): void {
  console.group('🔮 Aspectos Calculados');
  
  aspects.forEach((aspect, index) => {
    const symbol = ASPECT_DEFINITIONS[aspect.aspect_type]?.symbol || '?';
    console.log(
      `${index + 1}. ${aspect.planet1} ${symbol} ${aspect.planet2} ` +
      `(${aspect.aspect_type}) - Orbe: ${aspect.orb.toFixed(2)}° ` +
      `(${aspect.strength}, ${aspect.nature})`
    );
  });
  
  const stats = getAspectStatistics(aspects);
  console.log('\n📊 Estadísticas:', stats);
  
  console.groupEnd();
}

export default {
  calculateAllAspects,
  findAspectBetweenPlanets,
  filterAspects,
  getAspectStatistics,
  convertToPlanetaryAspect,
  convertFromNatalChartFormat,
  convertToNatalChartFormat,
  debugAspects,
  ASPECT_DEFINITIONS,
  PLANET_ORB_MODIFIERS
};