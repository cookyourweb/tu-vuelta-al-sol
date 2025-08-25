/**
 * Hook personalizado para gestionar aspectos astrológicos
 * Archivo: hooks/useAspects.ts
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import { AspectFilter, AspectType, PlanetaryAspect } from '../types/astrology';
import type { Planet, ExtendedPlanet } from '../types/astrology/basic';
import { calculateAllAspects, convertToPlanetaryAspect } from '@/utils/astrology/aspectCalculations';

// =============================================================================
// TIPOS DEL HOOK
// =============================================================================

export interface UseAspectsConfig {
  /** Incluir aspectos menores por defecto */
  includeMinorAspects?: boolean;
  
  /** Modificador de orbe por defecto */
  orbModifier?: number;
  
  /** Orbe máximo por defecto */
  maxOrb?: number;
  
  /** Filtro inicial */
  initialFilter?: AspectFilter;
}

export interface UseAspectsReturn {
  /** Todos los aspectos calculados */
  allAspects: PlanetaryAspect[];
  
  /** Aspectos filtrados según configuración actual */
  filteredAspects: PlanetaryAspect[];
  
  /** Filtro activo */
  activeFilter: AspectFilter;
  
  /** Tipos de aspectos visibles */
  visibleAspectTypes: Set<AspectType>;
  
  /** Planetas seleccionados */
  selectedPlanets: Set<Planet | ExtendedPlanet>;
  
  /** Estado de carga */
  isCalculating: boolean;
  
  /** Error si existe */
  error: string | null;
  
  // Acciones
  
  /** Calcular aspectos a partir de posiciones planetarias */
  calculateAspects: (
    planets: Array<{
      planet: Planet | ExtendedPlanet;
      degree: number;
    }>,
    options?: {
      includeMinorAspects?: boolean;
      orbModifier?: number;
      maxOrb?: number;
    }
  ) => void;
  
  /** Cambiar filtro de aspectos */
  setFilter: (filter: AspectFilter) => void;
  
  /** Toggle de tipo de aspecto específico */
  toggleAspectType: (aspectType: AspectType) => void;
  
  /** Toggle de planeta específico */
  togglePlanet: (planet: Planet | ExtendedPlanet) => void;
  
  /** Limpiar selección */
  clearSelection: () => void;
  
  /** Reset completo */
  reset: () => void;
  
  /** Obtener aspectos entre dos planetas específicos */
  getAspectsBetween: (planet1: Planet | ExtendedPlanet, planet2: Planet | ExtendedPlanet) => PlanetaryAspect[];
  
  /** Obtener estadísticas de aspectos */
  getAspectStats: () => {
    total: number;
    byType: Record<AspectType, number>;
    byNature: Record<'harmonico' | 'tensional' | 'neutro', number>;
    strongestAspect: PlanetaryAspect | null;
  };
}

// =============================================================================
// CONFIGURACIÓN POR DEFECTO
// =============================================================================

const DEFAULT_CONFIG: Required<UseAspectsConfig> = {
  includeMinorAspects: false,
  orbModifier: 1.0,
  maxOrb: 8,
  initialFilter: 'major'
};

// =============================================================================
// HOOK PRINCIPAL
// =============================================================================

export function useAspects(config: UseAspectsConfig = {}): UseAspectsReturn {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Estados principales
  const [allAspects, setAllAspects] = useState<PlanetaryAspect[]>([]);
  const [activeFilter, setActiveFilter] = useState<AspectFilter>(finalConfig.initialFilter);
  const [visibleAspectTypes, setVisibleAspectTypes] = useState<Set<AspectType>>(new Set());
  const [selectedPlanets, setSelectedPlanets] = useState<Set<Planet | ExtendedPlanet>>(new Set());
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Aspectos filtrados (calculado)
  const filteredAspects = useMemo(() => {
    let filtered = allAspects;
    
    // Aplicar filtro principal
    if (activeFilter !== 'all') {
      const allowedTypes = {
        major: ['conjunction', 'opposition', 'trine', 'square', 'sextile'] as AspectType[],
        minor: ['quincunx', 'semisextile', 'sesquiquadrate', 'semisquare', 'quintile', 'biquintile'] as AspectType[],
        harmonious: ['trine', 'sextile', 'semisextile', 'quintile', 'biquintile'] as AspectType[],
        tense: ['opposition', 'square', 'quincunx', 'sesquiquadrate', 'semisquare'] as AspectType[]
      };
      
      if (activeFilter in allowedTypes) {
        filtered = filtered.filter(aspect => allowedTypes[activeFilter as keyof typeof allowedTypes].includes(aspect.aspect_type));
      }
    }
    
    // Filtrar por tipos de aspectos visibles
    if (visibleAspectTypes.size > 0) {
      filtered = filtered.filter(aspect => visibleAspectTypes.has(aspect.aspect_type));
    }
    
    // Filtrar por planetas seleccionados
    if (selectedPlanets.size > 0) {
      filtered = filtered.filter(aspect => 
        selectedPlanets.has(aspect.planet1) || selectedPlanets.has(aspect.planet2)
      );
    }
    
    return filtered;
  }, [allAspects, activeFilter, visibleAspectTypes, selectedPlanets]);
  
  // Función para calcular aspectos
  const calculateAspects = useCallback(async (
    planets: Array<{
      planet: Planet | ExtendedPlanet;
      degree: number;
    }>,
    options: {
      includeMinorAspects?: boolean;
      orbModifier?: number;
      maxOrb?: number;
    } = {}
  ) => {
    setIsCalculating(true);
    setError(null);
    
    try {
      const calcOptions = {
        includeMinorAspects: options.includeMinorAspects ?? finalConfig.includeMinorAspects,
        orbModifier: options.orbModifier ?? finalConfig.orbModifier,
        maxOrb: options.maxOrb ?? finalConfig.maxOrb
      };
      
      // Simular tiempo de cálculo para UX
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const aspects = calculateAllAspects(planets, calcOptions);
      // Convert CalculatedAspect[] to PlanetaryAspect[]
      const convertedAspects = aspects.map(a => convertToPlanetaryAspect(a));
      setAllAspects(convertedAspects);
      
      // Inicializar tipos visibles con todos los tipos encontrados
      const foundTypes = new Set(aspects.map(a => a.aspect_type));
      setVisibleAspectTypes(foundTypes);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error calculando aspectos';
      setError(errorMessage);
      console.error('Error en cálculo de aspectos:', err);
    } finally {
      setIsCalculating(false);
    }
  }, [finalConfig]);
  
  // Cambiar filtro
  const setFilter = useCallback((filter: AspectFilter) => {
    setActiveFilter(filter);
  }, []);
  
  // Toggle tipo de aspecto
  const toggleAspectType = useCallback((aspectType: AspectType) => {
    setVisibleAspectTypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(aspectType)) {
        newSet.delete(aspectType);
      } else {
        newSet.add(aspectType);
      }
      return newSet;
    });
  }, []);
  
  // Toggle planeta
  const togglePlanet = useCallback((planet: Planet | ExtendedPlanet) => {
    setSelectedPlanets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(planet)) {
        newSet.delete(planet);
      } else {
        newSet.add(planet);
      }
      return newSet;
    });
  }, []);
  
  // Limpiar selección
  const clearSelection = useCallback(() => {
    setSelectedPlanets(new Set());
    setVisibleAspectTypes(new Set(allAspects.map(a => a.aspect_type)));
  }, [allAspects]);
  
  // Reset completo
  const reset = useCallback(() => {
    setAllAspects([]);
    setActiveFilter(finalConfig.initialFilter);
    setVisibleAspectTypes(new Set());
    setSelectedPlanets(new Set());
    setError(null);
  }, [finalConfig.initialFilter]);
  
  // Obtener aspectos entre dos planetas
  const getAspectsBetween = useCallback((
    planet1: Planet | ExtendedPlanet, 
    planet2: Planet | ExtendedPlanet
  ): PlanetaryAspect[] => {
    return allAspects.filter(aspect => 
      (aspect.planet1.toLowerCase() === planet1.toLowerCase() && aspect.planet2.toLowerCase() === planet2.toLowerCase()) ||
      (aspect.planet1.toLowerCase() === planet2.toLowerCase() && aspect.planet2.toLowerCase() === planet1.toLowerCase())
    );
  }, [allAspects]);
  
  // Obtener estadísticas
  const getAspectStats = useCallback(() => {
    const byType: Record<string, number> = {};
    const byNature: Record<'harmonico' | 'tensional' | 'neutro', number> = {
      harmonico: 0,
      tensional: 0,
      neutro: 0
    };
    
    let strongestAspect: PlanetaryAspect | null = null;
    let maxStrength = 0;
    
    allAspects.forEach(aspect => {
      // Contar por tipo
      byType[aspect.aspect_type] = (byType[aspect.aspect_type] || 0) + 1;
      
      // Contar por naturaleza
      const aspectDef: Record<AspectType, 'harmonico' | 'tensional' | 'neutro'> = {
        conjunction: 'neutro',
        opposition: 'tensional',
        trine: 'harmonico',
        square: 'tensional',
        sextile: 'harmonico',
        quincunx: 'tensional',
        semisextile: 'harmonico',
        sesquiquadrate: 'tensional',
        semisquare: 'tensional',
        quintile: 'harmonico',
        biquintile: 'harmonico'
      };
      
      const nature: 'harmonico' | 'tensional' | 'neutro' = aspectDef[aspect.aspect_type] || 'neutro';
      byNature[nature]++;
      
      // Encontrar el más fuerte
      const strengthValue = aspect.strength === 'muy_fuerte' ? 4 :
                           aspect.strength === 'fuerte' ? 3 :
                           aspect.strength === 'moderado' ? 2 : 1;
      
      if (strengthValue > maxStrength) {
        maxStrength = strengthValue;
        strongestAspect = aspect;
      }
    });
    
    return {
      total: allAspects.length,
      byType: byType as Record<AspectType, number>,
      byNature,
      strongestAspect
    };
  }, [allAspects]);
  
  return {
    allAspects,
    filteredAspects,
    activeFilter,
    visibleAspectTypes,
    selectedPlanets,
    isCalculating,
    error,
    calculateAspects,
    setFilter,
    toggleAspectType,
    togglePlanet,
    clearSelection,
    reset,
    getAspectsBetween,
    getAspectStats
  };
}

// =============================================================================
// HOOKS AUXILIARES
// =============================================================================

/**
 * Hook simplificado para aspectos básicos
 */
export function useSimpleAspects(
  planets: Array<{
    planet: Planet | ExtendedPlanet;
    degree: number;
  }>,
  options: {
    autoCalculate?: boolean;
    includeMinorAspects?: boolean;
  } = {}
) {
  const { autoCalculate = true, includeMinorAspects = false } = options;
  
  const {
    allAspects,
    filteredAspects,
    isCalculating,
    error,
    calculateAspects
  } = useAspects({
    includeMinorAspects,
    initialFilter: includeMinorAspects ? 'all' : 'major'
  });
  
  // Auto-calcular cuando cambian los planetas
  useState(() => {
    if (autoCalculate && planets.length > 0) {
      calculateAspects(planets, { includeMinorAspects });
    }
  });
  
  return {
    aspects: filteredAspects,
    isCalculating,
    error,
    recalculate: () => calculateAspects(planets, { includeMinorAspects })
  };
}

/**
 * Hook para aspectos de un planeta específico
 */
export function usePlanetAspects(
  targetPlanet: Planet | ExtendedPlanet,
  allAspects: PlanetaryAspect[]
) {
  return useMemo(() => {
    return allAspects.filter(aspect => 
      aspect.planet1 === targetPlanet || aspect.planet2 === targetPlanet
    );
  }, [targetPlanet, allAspects]);
}

export default useAspects;