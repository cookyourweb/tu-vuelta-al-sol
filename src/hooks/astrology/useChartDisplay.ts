// src/hooks/astrology/useChartDisplay.ts
// Hook personalizado optimizado para manejar estado del ChartDisplay - TIPOS CORREGIDOS

import { useState, useEffect, useCallback, useMemo } from 'react';
import { calculateAspects } from '@/services/chartCalculationsService';
import type { 
  CalculatedAspect, 
  Planet, 
  SelectedAspectTypes, 
  TooltipPosition
} from '@/types/astrology/chartDisplay';

interface UseChartDisplayProps {
  planets: Planet[];
  initialActiveSection?: string;
  initialShowAspects?: boolean;
  initialSelectedAspectTypes?: SelectedAspectTypes;
}

interface UseChartDisplayReturn {
  // Estados principales
  showAspects: boolean;
  setShowAspects: (show: boolean) => void;
  selectedAspectTypes: SelectedAspectTypes;
  setSelectedAspectTypes: (types: SelectedAspectTypes) => void;
  hoveredAspect: string | null;
  setHoveredAspect: (aspectKey: string | null) => void;
  calculatedAspects: CalculatedAspect[];
  setCalculatedAspects: (aspects: CalculatedAspect[]) => void;
  hoveredPlanet: string | null;
  setHoveredPlanet: (planet: string | null) => void;
  hoveredHouse: number | null;
  setHoveredHouse: (house: number | null) => void;
  tooltipPosition: TooltipPosition;
  setTooltipPosition: (position: TooltipPosition) => void;
  hoveredNavGuide: boolean;
  setHoveredNavGuide: (hovered: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;

  // Funciones optimizadas
  handleMouseMove: (event: React.MouseEvent) => void;
  scrollToSection: (sectionId: string) => void;
  handleAspectHover: (aspectKey: string | null, event?: React.MouseEvent) => void;
  handlePlanetHover: (planet: string | null, event?: React.MouseEvent) => void;
  handleHouseHover: (house: number | null, event?: React.MouseEvent) => void;
  toggleAspectType: (aspectType: keyof SelectedAspectTypes) => void;
  resetTooltips: () => void;

  // Datos computados
  filteredAspects: CalculatedAspect[];
  aspectStats: {
    total: number;
    exact: number;
    major: number;
    minor: number;
  };
  normalizedPlanets: Planet[];
}

export const useChartDisplay = ({
  planets,
  initialActiveSection = 'carta-visual',
  initialShowAspects = true,
  initialSelectedAspectTypes = {
    major: true,
    minor: false,
    hard: true,
    easy: true
  }
}: UseChartDisplayProps): UseChartDisplayReturn => {
  
  // =============================================================================
  // ESTADOS PRINCIPALES
  // =============================================================================
  
  const [showAspects, setShowAspects] = useState(initialShowAspects);
  const [selectedAspectTypes, setSelectedAspectTypes] = useState<SelectedAspectTypes>(initialSelectedAspectTypes);
  const [hoveredAspect, setHoveredAspect] = useState<string | null>(null);
  const [calculatedAspects, setCalculatedAspects] = useState<CalculatedAspect[]>([]);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ x: 0, y: 0 });
  const [hoveredNavGuide, setHoveredNavGuide] = useState(false);
  const [activeSection, setActiveSection] = useState(initialActiveSection);

  // =============================================================================
  // FUNCIONES OPTIMIZADAS CON USECALLBACK
  // =============================================================================

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    setTooltipPosition({ 
      x: event?.clientX ?? 0,
      y: event?.clientY ?? 0
    });
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  }, []);

  const handleAspectHover = useCallback((aspectKey: string | null, event?: React.MouseEvent) => {
    setHoveredAspect(aspectKey);
    if (event) {
      handleMouseMove(event);
    }
  }, [handleMouseMove]);

  const handlePlanetHover = useCallback((planet: string | null, event?: React.MouseEvent) => {
    setHoveredPlanet(planet);
    if (event) {
      handleMouseMove(event);
    }
  }, [handleMouseMove]);

  const handleHouseHover = useCallback((house: number | null, event?: React.MouseEvent) => {
    setHoveredHouse(house);
    if (event) {
      handleMouseMove(event);
    }
  }, [handleMouseMove]);

  const toggleAspectType = useCallback((aspectType: keyof SelectedAspectTypes) => {
    setSelectedAspectTypes(prev => ({
      ...prev,
      [aspectType]: !prev[aspectType]
    }));
  }, []);

  const resetTooltips = useCallback(() => {
    setHoveredAspect(null);
    setHoveredPlanet(null);
    setHoveredHouse(null);
    setHoveredNavGuide(false);
  }, []);

  // =============================================================================
  // FUNCIONES DE UTILIDAD INTERNAS
  // =============================================================================

  const convertAstrologicalDegreeToPosition = useCallback((degree: number, sign: string): number => {
    const signPositions: { [key: string]: number } = {
      'Aries': 0, 'Tauro': 30, 'Géminis': 60, 'Cáncer': 90,
      'Leo': 120, 'Virgo': 150, 'Libra': 180, 'Escorpio': 210,
      'Sagitario': 240, 'Capricornio': 270, 'Acuario': 300, 'Piscis': 330
    };

    const signBase = signPositions[sign] || 0;
    return signBase + degree;
  }, []);

  // =============================================================================
  // EFECTOS OPTIMIZADOS
  // =============================================================================

  // Calcular aspectos cuando cambian los planetas
  useEffect(() => {
    if (planets && planets.length > 0) {
      const aspects = calculateAspects(planets);
      setCalculatedAspects(aspects);
    }
  }, [planets]);

  // Intersection Observer para navegación
  useEffect(() => {
    const sections = ['carta-visual', 'aspectos-detectados', 'posiciones-planetarias'];
    const observers: IntersectionObserver[] = [];

    sections.forEach(sectionId => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              setActiveSection(sectionId);
            }
          });
        },
        { threshold: 0.5 }
      );

      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  // =============================================================================
  // VALORES MEMOIZADOS
  // =============================================================================

  const filteredAspects = useMemo(() => {
    return calculatedAspects.filter(aspect => {
      const isHard = aspect.config.difficulty === 'hard';
      const isEasy = aspect.config.difficulty === 'easy';
      const isMajor = ['conjunction', 'sextile', 'square', 'trine', 'opposition'].includes(aspect.type);
      const isMinor = !isMajor;

      if (!selectedAspectTypes.hard && isHard) return false;
      if (!selectedAspectTypes.easy && isEasy) return false;
      if (!selectedAspectTypes.major && isMajor) return false;
      if (!selectedAspectTypes.minor && isMinor) return false;

      return true;
    });
  }, [calculatedAspects, selectedAspectTypes]);

  const aspectStats = useMemo(() => {
    const total = calculatedAspects.length;
    const exact = calculatedAspects.filter(a => a.exact).length;
    const major = calculatedAspects.filter(a => 
      ['conjunction', 'sextile', 'square', 'trine', 'opposition'].includes(a.type)
    ).length;
    const minor = total - major;

    return { total, exact, major, minor };
  }, [calculatedAspects]);

  const normalizedPlanets = useMemo(() => {
    return planets.map((planet: Planet) => {
      if (!planet) return null;

      const realPosition = convertAstrologicalDegreeToPosition(
        planet.degree || 0, 
        planet.sign || 'Aries'
      );

      return {
        ...planet,
        position: realPosition,
        house: planet.house || planet.houseNumber || planet.housePosition || 1,
        retrograde: planet.retrograde || planet.isRetrograde || false
      } as Planet;
    }).filter((planet): planet is Planet => planet !== null);
  }, [planets, convertAstrologicalDegreeToPosition]);

  // =============================================================================
  // RETURN DEL HOOK
  // =============================================================================

  return {
    // Estados principales
    showAspects,
    setShowAspects,
    selectedAspectTypes,
    setSelectedAspectTypes,
    hoveredAspect,
    setHoveredAspect,
    calculatedAspects,
    setCalculatedAspects,
    hoveredPlanet,
    setHoveredPlanet,
    hoveredHouse,
    setHoveredHouse,
    tooltipPosition,
    setTooltipPosition,
    hoveredNavGuide,
    setHoveredNavGuide,
    activeSection,
    setActiveSection,

    // Funciones optimizadas
    handleMouseMove,
    scrollToSection,
    handleAspectHover,
    handlePlanetHover,
    handleHouseHover,
    toggleAspectType,
    resetTooltips,

    // Datos computados
    filteredAspects,
    aspectStats,
    normalizedPlanets
  };
};

// =============================================================================
// VERSIÓN LIGERA DEL HOOK (para casos simples)
// =============================================================================

export const useSimpleChartDisplay = (planets: Planet[]) => {
  const [calculatedAspects, setCalculatedAspects] = useState<CalculatedAspect[]>([]);
  const [activeSection, setActiveSection] = useState('carta-visual');

  useEffect(() => {
    if (planets && planets.length > 0) {
      const aspects = calculateAspects(planets);
      setCalculatedAspects(aspects);
    }
  }, [planets]);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  }, []);

  return {
    calculatedAspects,
    activeSection,
    scrollToSection
  };
};