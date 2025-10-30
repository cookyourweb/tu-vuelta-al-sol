// src/components/astrology/ChartDisplay.tsx
'use client';

import React, { useState, useEffect } from 'react';

// ✅ IMPORTACIONES MODULARIZADAS
import type { ChartDisplayProps } from '../../types/astrology/chartDisplay';
import { 
  ASPECTS, 
  PLANET_SYMBOLS, 
  PLANET_COLORS, 
  SIGN_SYMBOLS,
  aspectMeanings,
  planetMeanings,
  signMeanings,
  houseMeanings 
} from '../../constants/astrology/chartConstants';

// ✅ COMPONENTES EXTRAÍDOS
import SectionMenu from './SectionMenu';
import BirthDataCard from './BirthDataCard';
import AscendantCard from './AscendantCard';
import MidheavenCard from './MidheavenCard';
import CombinedAscendantMCCard from './CombinedAscendantMCCard';
import ElementsModalitiesCard from './ElementsModalitiesCard';
import ChartTooltips from './ChartTooltips';

const ChartDisplay = ({
  houses = [],
  planets = [],
  elementDistribution = { fire: 0, earth: 0, air: 0, water: 0 },
  modalityDistribution = { cardinal: 0, fixed: 0, mutable: 0 },
  keyAspects = [],
  ascendant,
  midheaven,
  birthData,
  chartType = 'natal',
  showOnlyProgressedAspects = false,
  progressionInfo,
  // ✅ NUEVAS PROPS PARA SOLAR RETURN
  birthDate,
  birthTime,
  birthPlace,
  solarReturnYear,
  solarReturnTheme,
  ascSRInNatalHouse,
  onCloseDrawer,
  // ✅ ADDED: For drawer functionality
  onOpenDrawer,
  drawerOpen = false
}: ChartDisplayProps) => {

  // ✅ ESTADOS
  const [showAspects, setShowAspects] = useState(true);
  const [selectedAspectTypes, setSelectedAspectTypes] = useState({
    major: true,
    minor: false,
    hard: true,
    easy: true
  });
  const [hoveredAspect, setHoveredAspect] = useState<string | null>(null);
  const [calculatedAspects, setCalculatedAspects] = useState<any[]>([]);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [hoveredNavGuide, setHoveredNavGuide] = useState(false);
  const [activeSection, setActiveSection] = useState('carta-visual');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // ✅ FUNCIONES UTILITARIAS
  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPosition({ 
      x: event?.clientX ?? 0,
      y: event?.clientY ?? 0
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  // ✅ INTERSECTION OBSERVER PARA NAVEGACIÓN
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

  // ✅ FUNCIONES DE CÁLCULO ASTROLÓGICO
  const convertAstrologicalDegreeToPosition = (degree: number, sign: string) => {
    const signPositions: { [key: string]: number } = {
      'Aries': 0, 'Tauro': 30, 'Géminis': 60, 'Cáncer': 90,
      'Leo': 120, 'Virgo': 150, 'Libra': 180, 'Escorpio': 210,
      'Sagitario': 240, 'Capricornio': 270, 'Acuario': 300, 'Piscis': 330
    };

    const signBase = signPositions[sign] || 0;
    return signBase + degree;
  };

  const normalizedPlanets: any[] = planets.map((planet, index) => {
    if (!planet) return null;

    const realPosition = convertAstrologicalDegreeToPosition(
      planet.degree || 0, 
      planet.sign || 'Aries'
    );

    return {
      ...planet,
      position: realPosition,
      house: planet.house || planet.houseNumber || 1,
      retrograde: planet.retrograde || false
    };
  }).filter(Boolean) as any[];

  const normalizedHouses = houses.map((house, index) => {
    if (!house) return null;

    const realPosition = house.sign ? 
      convertAstrologicalDegreeToPosition(house.degree || 0, house.sign) :
      (index * 30);

    return {
      ...house,
      position: realPosition
    };
  }).filter(Boolean);

  const calculateAspects = (planets: any[]) => {
    const aspects: any[] = [];
    
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const planet1 = planets[i];
        const planet2 = planets[j];
        
        if (!planet1 || !planet2 || !planet1.name || !planet2.name) {
          continue;
        }

        let angle = Math.abs(planet1.position - planet2.position);
        if (angle > 180) angle = 360 - angle;
        
        Object.entries(ASPECTS).forEach(([aspectType, config]) => {
          const orb = Math.abs(angle - config.angle);
          if (orb <= config.orb) {
            aspects.push({
              planet1: planet1.name,
              planet2: planet2.name,
              angle: angle,
              type: aspectType,
              orb: orb,
              config: config,
              exact: orb < 1
            });
          }
        });
      }
    }
    
    return aspects.sort((a, b) => a.orb - b.orb);
  };

  const getCirclePosition = (angle: number, radius: number) => {
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: 250 + Math.cos(radian) * radius,
      y: 250 + Math.sin(radian) * radius
    };
  };

  const getPersonalizedPlanetInterpretation = (planet: any) => {
    const planetName = planet.name;
    const sign = planet.sign;
    const house = planet.house;

    return `Con ${planetName} en ${sign} en Casa ${house}, ${planetMeanings[planetName as keyof typeof planetMeanings]?.meaning.toLowerCase()} se manifiesta con las cualidades de ${signMeanings[sign as keyof typeof signMeanings]?.toLowerCase()} en el área de ${houseMeanings[house as keyof typeof houseMeanings]?.meaning.toLowerCase()}`;
  };

  const getPersonalizedAspectInterpretation = (aspect: any) => {
    const planet1Name = aspect.planet1;
    const planet2Name = aspect.planet2;
    const aspectType = aspect.type;

    const planet1Desc = planetMeanings[planet1Name as keyof typeof planetMeanings]?.keywords.split(',')[0]?.trim() || planet1Name;
    const planet2Desc = planetMeanings[planet2Name as keyof typeof planetMeanings]?.keywords.split(',')[0]?.trim() || planet2Name;

    let baseInterpretation = aspectMeanings[aspectType as keyof typeof aspectMeanings]?.meaning || '';
    
    if (aspectType === 'conjunction') {
      return `Fusión de ${planet1Name} (${planet1Desc}) y ${planet2Name} (${planet2Desc}). Los planetas trabajan como uno solo. Esto significa que tu ${planet1Desc.toLowerCase()} se fusiona con tu ${planet2Desc.toLowerCase()}, creando una energía unificada y potente.`;
    } else if (aspectType === 'opposition') {
      return `Polarización entre ${planet1Name} (${planet1Desc}) y ${planet2Name} (${planet2Desc}). Necesitas encontrar equilibrio entre estas dos energías opuestas en tu vida.`;
    } else if (aspectType === 'trine') {
      return `Armonía natural entre ${planet1Name} (${planet1Desc}) y ${planet2Name} (${planet2Desc}). Las energías fluyen sin esfuerzo, creando talento natural en la combinación de estas cualidades.`;
    } else if (aspectType === 'square') {
      return `Tensión creativa entre ${planet1Name} (${planet1Desc}) y ${planet2Name} (${planet2Desc}). Esta fricción genera crecimiento y te impulsa a integrar ambas energías de forma constructiva.`;
    } else if (aspectType === 'sextile') {
      return `Oportunidad entre ${planet1Name} (${planet1Desc}) y ${planet2Name} (${planet2Desc}). Tienes facilidad para combinar estas energías cuando te lo propones conscientemente.`;
    }

    return `${baseInterpretation} entre ${planet1Name} y ${planet2Name}.`;
  };

  // ✅ EFECTOS
  useEffect(() => {
    if (normalizedPlanets.length > 0) {
      const aspects = calculateAspects(normalizedPlanets);
      setCalculatedAspects(aspects);
    }
  }, [planets]);

  // ✅ FUNCIONES DE RENDERIZADO SVG
  const renderAspectLines = () => {
    if (!showAspects || calculatedAspects.length === 0) return null;

    return calculatedAspects.map((aspect, index) => {
      const planet1 = normalizedPlanets.find(p => p?.name === aspect.planet1);
      const planet2 = normalizedPlanets.find(p => p?.name === aspect.planet2);
      
      if (!planet1 || !planet2) return null;

      const isHard = aspect.config.difficulty === 'hard';
      const isEasy = aspect.config.difficulty === 'easy';
      const isMajor = ['conjunction', 'sextile', 'square', 'trine', 'opposition'].includes(aspect.type);
      const isMinor = !isMajor;

      if (!selectedAspectTypes.hard && isHard) return null;
      if (!selectedAspectTypes.easy && isEasy) return null;
      if (!selectedAspectTypes.major && isMajor) return null;
      if (!selectedAspectTypes.minor && isMinor) return null;

      const pos1 = getCirclePosition(planet1.position, 170);
      const pos2 = getCirclePosition(planet2.position, 170);
      
      const strokeWidth = aspect.exact ? 3 : aspect.orb < 2 ? 2 : 1;
      const opacity = aspect.exact ? 0.9 : aspect.orb < 2 ? 0.7 : 0.5;
      
      const aspectKey = `${aspect.planet1}-${aspect.planet2}-${aspect.type}`;
      const isHovered = hoveredAspect === aspectKey;

      return (
        <g key={index}>
          <line
            x1={pos1.x}
            y1={pos1.y}
            x2={pos2.x}
            y2={pos2.y}
            stroke={showOnlyProgressedAspects ? '#ef4444' : aspect.config.color}
            strokeWidth={isHovered ? strokeWidth + 1 : strokeWidth}
            opacity={isHovered ? 1 : opacity}
            strokeDasharray={isMinor ? "3,3" : "none"}
            className="transition-all duration-200 cursor-pointer"
            onMouseEnter={(e) => {
              setHoveredAspect(aspectKey);
              handleMouseMove(e);
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredAspect(null)}
          />
        </g>
      );
    });
  };

  const renderPlanets = () => {
    return normalizedPlanets.map((planet, index) => {
      if (!planet || !planet.name) return null;

      const position = getCirclePosition(planet.position, 190);
      const symbol = PLANET_SYMBOLS[planet.name] || planet.name.charAt(0);
      const color = PLANET_COLORS[planet.name] || '#ffffff';
      const isHovered = hoveredPlanet === planet.name;
      
      return (
        <g key={index}>
          <circle
            cx={position.x}
            cy={position.y}
            r={isHovered ? "15" : "12"}
            fill={color}
            stroke={isHovered ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)"}
            strokeWidth={isHovered ? "2" : "1"}
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => {
              setHoveredPlanet(planet.name);
              handleMouseMove(e);
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredPlanet(null)}
          />
          
          <text
            x={position.x}
            y={position.y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="black"
            fontSize="12"
            fontWeight="bold"
            className="pointer-events-none"
          >
            {symbol}
          </text>
          
          <text
            x={position.x}
            y={position.y + 28}
            textAnchor="middle"
            fill="white"
            fontSize="11"
            fontWeight="semibold"
            className="pointer-events-none drop-shadow-lg"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
          >
            {planet.name}
          </text>
          
          <text
            x={position.x}
            y={position.y + 42}
            textAnchor="middle"
            fill="rgba(255,255,255,0.8)"
            fontSize="9"
            className="pointer-events-none"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
          >
            {planet.degree}° {planet.sign}
          </text>

          {planet.retrograde && (
            <text
              x={position.x + 16}
              y={position.y - 8}
              textAnchor="middle"
              fill="#ef4444"
              fontSize="10"
              fontWeight="bold"
              className="animate-pulse"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
            >
              R
            </text>
          )}
        </g>
      );
    });
  };

  const renderHouses = () => {
    const houseLines = [];
    const houseLabels = [];
    
    for (let i = 0; i < 12; i++) {
      const angle = i * 30;
      const startPos = getCirclePosition(angle, 130);
      const endPos = getCirclePosition(angle, 240);
      const labelPos = getCirclePosition(angle + 15, 115);
      const houseNumber = i + 1;
      
      houseLines.push(
        <line
          key={`house-line-${i}`}
          x1={startPos.x}
          y1={startPos.y}
          x2={endPos.x}
          y2={endPos.y}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />
      );
      
      houseLabels.push(
        <g key={`house-label-${i}`}>
          <circle
            cx={labelPos.x}
            cy={labelPos.y}
            r="16"
            fill="rgba(0,0,0,0.3)"
            stroke={hoveredHouse === houseNumber ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)"}
            strokeWidth="1"
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => {
              setHoveredHouse(houseNumber);
              handleMouseMove(e);
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredHouse(null)}
          />
          
          <text
            x={labelPos.x}
            y={labelPos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.9)"
            fontSize="14"
            fontWeight="bold"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
            className="pointer-events-none"
          >
            {houseNumber}
          </text>
        </g>
      );
    }
    
    return [...houseLines, ...houseLabels];
  };

  const renderSigns = () => {
    const signs = [
      'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
      'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
    ];
    
    return signs.map((sign, index) => {
      const angle = index * 30;
      const symbolPosition = getCirclePosition(angle + 15, 270);
      const textPosition = getCirclePosition(angle + 15, 290);
      const symbol = SIGN_SYMBOLS[sign] || sign.charAt(0);
      
      return (
        <g key={index}>
          <text
            x={symbolPosition.x}
            y={symbolPosition.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fbbf24"
            fontSize="20"
            fontWeight="bold"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
          >
            {symbol}
          </text>
          
          <text
            x={textPosition.x}
            y={textPosition.y}
            textAnchor="middle"
            fill="rgba(251,191,36,0.9)"
            fontSize="12"
            fontWeight="semibold"
            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}
          >
            {sign}
          </text>
        </g>
      );
    });
  };

  const renderAngles = () => {
    const angles = [];
    
    if (ascendant && ascendant.sign) {
      const ascPosition = convertAstrologicalDegreeToPosition(
        ascendant.degree || 0, 
        ascendant.sign
      );
      const position = getCirclePosition(ascPosition, 220);
      
      angles.push(
        <g key="ascendant">
          <line
            x1={250}
            y1={250}
            x2={position.x}
            y2={position.y}
            stroke="#22c55e"
            strokeWidth="3"
            strokeDasharray="5,5"
            className="animate-pulse"
          />
          
          <circle
            cx={position.x}
            cy={position.y}
            r="8"
            fill="#22c55e"
            stroke="white"
            strokeWidth="2"
            className="cursor-pointer hover:r-10 transition-all duration-200"
            onMouseEnter={(e) => {
              setHoveredPlanet('Ascendente');
              handleMouseMove(e);
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredPlanet(null)}
          />
          
          <text
            x={position.x}
            y={position.y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="10"
            fontWeight="bold"
            className="pointer-events-none"
          >
            ASC
          </text>
          
          <text
            x={position.x}
            y={position.y + 25}
            textAnchor="middle"
            fill="#22c55e"
            fontSize="12"
            fontWeight="bold"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
            className="pointer-events-none"
          >
            Ascendente
          </text>
          
          <text
            x={position.x}
            y={position.y + 38}
            textAnchor="middle"
            fill="rgba(34,197,94,0.8)"
            fontSize="10"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
            className="pointer-events-none"
          >
            {ascendant.degree}° {ascendant.sign}
          </text>
        </g>
      );
    }
    
    if (midheaven && midheaven.sign) {
      const mcPosition = convertAstrologicalDegreeToPosition(
        midheaven.degree || 0, 
        midheaven.sign
      );
      const position = getCirclePosition(mcPosition, 215);
      
      angles.push(
        <g key="midheaven">
          <circle
            cx={position.x}
            cy={position.y}
            r="6"
            fill="#8b5cf6"
            stroke="white"
            strokeWidth="1"
            className="cursor-pointer hover:r-8 transition-all duration-200"
            onMouseEnter={(e) => {
              setHoveredPlanet('Medio Cielo');
              handleMouseMove(e);
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredPlanet(null)}
          />
          
          <text
            x={position.x}
            y={position.y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="8"
            fontWeight="bold"
            className="pointer-events-none"
          >
            MC
          </text>
        </g>
      );
    }
    
    return angles;
  };

  return (
    <div className="space-y-8 relative">
      {/* 🧭 HEADER ESTILO DASHBOARD */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-6 mt-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-400">Carta Activa</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Interpretando</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <span className="text-sm text-gray-400">Personalizada</span>
            </div>
            
            <div className="relative" style={{ zIndex: 100000 }}>
              <svg 
                className="w-5 h-5 text-blue-400 cursor-help hover:text-blue-300 transition-colors duration-200"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                onMouseEnter={(e) => {
                  setHoveredNavGuide(true);
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltipPosition({ 
                    x: rect.left - 300,
                    y: rect.top - 20
                  });
                }}
                onMouseLeave={() => setHoveredNavGuide(false)}
              >
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* TOOLTIP NAVEGACIÓN */}
      {hoveredNavGuide && (
        <div 
          className="fixed bg-gradient-to-r from-blue-500/95 to-purple-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-md pointer-events-none"
          style={{ 
            left: tooltipPosition.x, 
            top: tooltipPosition.y,
            zIndex: 100000
          }}
        >
          <div className="text-white font-bold mb-2">Guía de navegación</div>
          <div className="text-gray-200 text-xs">
            Usa el menú para saltar entre secciones de tu carta natal.<br />
            Pasa el cursor sobre los íconos y elementos para ver interpretaciones y detalles.<br />
            ¡Explora cada sección para descubrir el significado de tu carta!
          </div>
        </div>
      )}

      {/* ✅ NAVEGACIÓN PRINCIPAL - TOP */}
      <div className="flex justify-center items-center gap-4 mb-8">
        <button
          onClick={() => scrollToSection('carta-visual')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
            activeSection === 'carta-visual'
              ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-2 border-blue-400/50 text-blue-300 shadow-lg shadow-blue-500/20'
              : 'bg-slate-800/50 border border-slate-600/30 text-slate-400 hover:border-slate-500/50 hover:text-slate-300'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
          Carta
        </button>

        <button
          onClick={() => scrollToSection('aspectos-detectados')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
            activeSection === 'aspectos-detectados'
              ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-2 border-yellow-400/50 text-yellow-300 shadow-lg shadow-yellow-500/20'
              : 'bg-slate-800/50 border border-slate-600/30 text-slate-400 hover:border-slate-500/50 hover:text-slate-300'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
          Aspectos
        </button>

        <button
          onClick={() => scrollToSection('posiciones-planetarias')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
            activeSection === 'posiciones-planetarias'
              ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border-2 border-cyan-400/50 text-cyan-300 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-800/50 border border-slate-600/30 text-slate-400 hover:border-slate-500/50 hover:text-slate-300'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          Planetas
        </button>

        {/* ✅ NEW: LÍNEA DE TIEMPO TAB - ONLY FOR SOLAR RETURN */}
        {chartType === 'solar-return' && (
          <button
            onClick={() => {
              const timelineSection = document.getElementById('linea-tiempo-solar');
              if (timelineSection) {
                timelineSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 bg-slate-800/50 border border-slate-600/30 text-slate-400 hover:border-rose-500/50 hover:text-rose-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            Línea de Tiempo
          </button>
        )}
      </div>

{/* 🎯 SECCIÓN: TRES CARDS PRINCIPALES - ADAPTATIVO SEGÚN TIPO DE CARTA */}
{(chartType === 'natal' || chartType === 'solar-return') && (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

    {/* ✅ CARD 1: BIRTH DATA - SAME EXACT STYLES FOR BOTH */}
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4 relative group hover:scale-[1.02] transition-all duration-300 overflow-hidden">
      <div className="absolute top-3 right-3 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>

      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-r from-green-400/20 to-blue-500/20 border border-green-400/30 rounded-full p-2 mr-3">
          <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <h3 className="text-white font-bold text-lg">Tu Momento Cósmico</h3>
      </div>

      <div className="space-y-3">
        {/* Fecha compacta */}
        <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/10">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-yellow-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="text-gray-300 text-sm">Fecha{chartType === 'solar-return' ? ' Nacimiento' : ''}</span>
          </div>
          <span className="text-white font-semibold text-sm">
            {(() => {
              let dateStr = '';
              if (chartType === 'solar-return') {
                dateStr = birthDate || '';
              } else {
                dateStr = birthData?.birthDate || '';
              }

              if (!dateStr) return 'No disponible';

              try {
                const date = new Date(dateStr);
                return date.toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                });
              } catch {
                return dateStr;
              }
            })()}
          </span>
        </div>

        {/* Hora compacta */}
        <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/10">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-blue-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            <span className="text-gray-300 text-sm">Hora</span>
          </div>
          <span className="text-white font-semibold text-sm">
            {chartType === 'solar-return'
              ? (birthTime || 'No disponible')
              : (birthData?.birthTime || 'No disponible')
            }
          </span>
        </div>

        {/* Lugar compacto */}
        <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/10">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-green-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="text-gray-300 text-sm">Lugar</span>
          </div>
          <span className="text-white font-semibold text-sm text-right max-w-[120px] truncate">
            {(() => {
              let place = '';
              if (chartType === 'solar-return') {
                place = birthPlace || '';
              } else {
                place = birthData?.birthPlace || birthData?.location || '';
              }

              if (!place) return 'No disponible';

              // Show only first 2 parts (city, country)
              return place.split(',').slice(0, 2).join(', ');
            })()}
          </span>
        </div>

        {/* Estado de precisión compacto */}
        <div className="flex items-center justify-center p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg">
          <svg className="w-3 h-3 text-green-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
          <span className="text-green-300 font-semibold text-xs">Precisión Exacta</span>
        </div>
      </div>
    </div>

    {/* ✅ CARD 2: ANGLES - CONDITIONAL DISTRIBUTIONS */}
    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl p-6 border border-indigo-400/30">
      <h3 className="text-xl font-bold text-indigo-100 mb-4 flex items-center gap-2">
        <span className="text-2xl">⚡</span>
        Ángulos Principales
      </h3>

      <div className="space-y-3 mb-4">
        {/* Ascendente */}
        {ascendant && (
          <div className="bg-indigo-800/30 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-indigo-300">↑</span>
              <span className="text-indigo-200 text-sm">Ascendente</span>
            </div>
            <div className="text-right">
              <p className="text-indigo-50 font-bold">{ascendant.sign}</p>
              <p className="text-indigo-300 text-xs">{Math.floor(ascendant.degree || 0)}°</p>
            </div>
          </div>
        )}

        {/* Medio Cielo */}
        {midheaven ? (
          <div className="bg-purple-800/30 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-purple-300">⬆</span>
              <span className="text-purple-200 text-sm">Medio Cielo</span>
            </div>
            <div className="text-right">
              <p className="text-purple-50 font-bold">{midheaven.sign}</p>
              <p className="text-purple-300 text-xs">{Math.floor(midheaven.degree || 0)}°</p>
            </div>
          </div>
        ) : (
          <div className="bg-purple-800/30 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-purple-300">⬆</span>
              <span className="text-purple-200 text-sm">Medio Cielo</span>
            </div>
            <span className="text-purple-400 text-xs">No disponible</span>
          </div>
        )}
      </div>

      {/* ✅ ONLY FOR SOLAR RETURN: Add FULL distributions with bars */}
      {chartType === 'solar-return' && (
        <div className="mt-4 pt-4 border-t border-indigo-400/20">
          <h4 className="text-indigo-200 font-semibold text-sm mb-3">Distribuciones Energéticas</h4>

          {/* ✨ ELEMENTOS CON BARRAS */}
          <div className="mb-4">
            <p className="text-indigo-300 text-xs mb-2 font-semibold">✨ Elementos</p>
            <div className="space-y-2">
              {/* FUEGO */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-red-400">🔥</span>
                  <span className="text-indigo-100 text-xs">Fuego</span>
                </div>
                <div className="flex-1 bg-indigo-900/40 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-red-500 transition-all duration-500"
                    style={{ width: `${elementDistribution?.fire || 0}%` }}
                  />
                </div>
                <span className="text-indigo-300 text-xs w-10 text-right font-semibold">
                  {elementDistribution?.fire || 0}%
                </span>
              </div>

              {/* TIERRA */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-green-400">🌱</span>
                  <span className="text-indigo-100 text-xs">Tierra</span>
                </div>
                <div className="flex-1 bg-indigo-900/40 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${elementDistribution?.earth || 0}%` }}
                  />
                </div>
                <span className="text-indigo-300 text-xs w-10 text-right font-semibold">
                  {elementDistribution?.earth || 0}%
                </span>
              </div>

              {/* AIRE */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-blue-400">💨</span>
                  <span className="text-indigo-100 text-xs">Aire</span>
                </div>
                <div className="flex-1 bg-indigo-900/40 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${elementDistribution?.air || 0}%` }}
                  />
                </div>
                <span className="text-indigo-300 text-xs w-10 text-right font-semibold">
                  {elementDistribution?.air || 0}%
                </span>
              </div>

              {/* AGUA */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-purple-400">💧</span>
                  <span className="text-indigo-100 text-xs">Agua</span>
                </div>
                <div className="flex-1 bg-indigo-900/40 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all duration-500"
                    style={{ width: `${elementDistribution?.water || 0}%` }}
                  />
                </div>
                <span className="text-indigo-300 text-xs w-10 text-right font-semibold">
                  {elementDistribution?.water || 0}%
                </span>
              </div>
            </div>
          </div>

          {/* ⚡ MODALIDADES CON BARRAS */}
          <div className="mb-4">
            <p className="text-indigo-300 text-xs mb-2 font-semibold">⚡ Modalidades</p>
            <div className="space-y-2">
              {/* CARDINAL */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-yellow-400">⚡</span>
                  <span className="text-indigo-100 text-xs">Cardinal</span>
                </div>
                <div className="flex-1 bg-indigo-900/40 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 transition-all duration-500"
                    style={{ width: `${modalityDistribution?.cardinal || 0}%` }}
                  />
                </div>
                <span className="text-indigo-300 text-xs w-10 text-right font-semibold">
                  {modalityDistribution?.cardinal || 0}%
                </span>
              </div>

              {/* FIJO */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-orange-400">🔒</span>
                  <span className="text-indigo-100 text-xs">Fijo</span>
                </div>
                <div className="flex-1 bg-indigo-900/40 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all duration-500"
                    style={{ width: `${modalityDistribution?.fixed || 0}%` }}
                  />
                </div>
                <span className="text-indigo-300 text-xs w-10 text-right font-semibold">
                  {modalityDistribution?.fixed || 0}%
                </span>
              </div>

              {/* MUTABLE */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-cyan-400">🌀</span>
                  <span className="text-indigo-100 text-xs">Mutable</span>
                </div>
                <div className="flex-1 bg-indigo-900/40 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-500"
                    style={{ width: `${modalityDistribution?.mutable || 0}%` }}
                  />
                </div>
                <span className="text-indigo-300 text-xs w-10 text-right font-semibold">
                  {modalityDistribution?.mutable || 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Perfil energético */}
          <div className="bg-indigo-900/40 rounded-lg p-2 border border-indigo-400/20">
            <p className="text-indigo-200 text-xs text-center flex items-center justify-center gap-1">
              <span>🌟</span>
              <span className="font-semibold">Perfil energético único</span>
            </p>
          </div>
        </div>
      )}
    </div>

    {/* ✅ CARD 3: CONDITIONAL - NATAL vs SOLAR RETURN */}
    {chartType === 'natal' ? (
      // NATAL: Full distributions card on the right
      <ElementsModalitiesCard
        elementDistribution={elementDistribution}
        modalityDistribution={modalityDistribution}
      />
    ) : (
      // SOLAR RETURN: Cycle info
      <div className="bg-gradient-to-br from-rose-900/40 to-pink-900/40 rounded-xl p-6 border border-rose-400/30">
        <h3 className="text-xl font-bold text-rose-100 mb-4 flex items-center gap-2">
          <span className="text-2xl">✨</span>
          Solar Return {solarReturnYear}
        </h3>
        <div className="space-y-3">
          <div className="bg-rose-800/30 rounded-lg p-3">
            <p className="text-rose-200 text-xs mb-1">🎂 Ciclo Anual</p>
            <p className="text-rose-50 font-semibold text-sm">
              {birthDate ? (
                <>
                  {new Date(birthDate).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long'
                  })} {solarReturnYear}
                  <br />
                  <span className="text-rose-300 text-xs">→</span>
                  <br />
                  {new Date(birthDate).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long'
                  })} {(solarReturnYear || 0) + 1}
                </>
              ) : 'No disponible'}
            </p>
          </div>

          <div className="bg-rose-800/30 rounded-lg p-3">
            <p className="text-rose-200 text-xs mb-1">📍 Lugar del SR</p>
            <p className="text-rose-50 text-sm line-clamp-2">
              {birthPlace?.split(',').slice(0, 2).join(', ') || 'No disponible'}
            </p>
          </div>

          {solarReturnTheme && (
            <div className="bg-rose-800/30 rounded-lg p-3">
              <p className="text-rose-200 text-xs mb-1">⭐ Tema Central</p>
              <p className="text-rose-50 text-sm italic line-clamp-3">
                "{solarReturnTheme}"
              </p>
            </div>
          )}

          {ascSRInNatalHouse && (
            <div className="bg-green-900/30 rounded-lg p-3 border border-green-400/20">
              <p className="text-green-200 text-xs mb-1">🏠 ASC SR en Casa Natal</p>
              <p className="text-green-100 font-bold text-lg">Casa {ascSRInNatalHouse}</p>
              <p className="text-green-200 text-xs mt-1">
                Área de vida activada este año
              </p>
            </div>
          )}
        </div>
      </div>
    )}

  </div>
)}

      {/* 🎯 SECCIÓN 1: CARTA VISUAL */}
      <div id="carta-visual" className="space-y-8">
        {/* Controles de aspectos */}
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-purple-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="13.5" cy="6.5" r=".5"/>
                <circle cx="17.5" cy="10.5" r=".5"/>
                <circle cx="8.5" cy="7.5" r=".5"/>
                <circle cx="6.5" cy="12.5" r=".5"/>
                <polyline points="13.5,6.5 8.5,7.5 6.5,12.5 17.5,10.5"/>
              </svg>
              <h3 className="text-lg font-bold text-white">Configuración de Aspectos de la Carta</h3>
              <div className="ml-2 text-gray-400 text-sm">
                (Líneas que conectan planetas en la carta visual)
              </div>
            </div>
            
            <button
              onClick={() => setShowAspects(!showAspects)}
              className={`flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                showAspects 
                  ? 'bg-gradient-to-r from-green-400/20 to-blue-500/20 border border-green-400/30 text-green-300' 
                  : 'bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-500/30 text-gray-400'
              }`}
            >
              {showAspects ? (
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              )}
              {showAspects ? 'Ocultar Aspectos' : 'Mostrar Aspectos'}
            </button>
          </div>
          
          {showAspects && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries({
                major: { 
                  label: 'Aspectos Mayores', 
                  tooltip: 'Los 5 aspectos principales: más fuertes y definitorios',
                  icon: () => (
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                    </svg>
                  )
                },
                minor: { 
                  label: 'Aspectos Menores', 
                  tooltip: 'Influencias más sutiles pero importantes',
                  icon: () => (
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                  )
                },
                easy: { 
                  label: 'Aspectos Armónicos', 
                  tooltip: 'Facilidades, talentos y energías que fluyen',
                  icon: () => (
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                  )
                },
                hard: { 
                  label: 'Aspectos Tensos', 
                  tooltip: 'Tensiones creativas que impulsan el desarrollo',
                  icon: () => (
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
                    </svg>
                  )
                }
              }).map(([key, config]) => {
                const IconComponent = config.icon;
                return (
                  <div key={key} className="relative group">
                    <button
                      onClick={() => setSelectedAspectTypes({...selectedAspectTypes, [key]: !selectedAspectTypes[key as keyof typeof selectedAspectTypes]})}
                      className={`w-full p-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center ${
                        selectedAspectTypes[key as keyof typeof selectedAspectTypes]
                          ? `bg-gradient-to-r ${
                              key === 'major' ? 'from-blue-400/30 to-purple-500/30 border-blue-400/50 text-blue-300' :
                              key === 'minor' ? 'from-purple-400/30 to-pink-500/30 border-purple-400/50 text-purple-300' :
                              key === 'easy' ? 'from-cyan-400/30 to-blue-500/30 border-cyan-400/50 text-cyan-300' :
                              'from-red-400/30 to-pink-500/30 border-red-400/50 text-red-300'
                            } border`
                          : 'bg-gray-600/20 border border-gray-500/30 text-gray-400'
                      }`}
                    >
                      <IconComponent />
                      {config.label}
                    </button>
                    
                    <div 
                      className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-sm border border-white/30 rounded-xl p-3 shadow-2xl transition-opacity duration-200 pointer-events-none max-w-xs"
                      style={{ zIndex: 99999 }}
                    >
                      <div className="text-white text-xs font-semibold mb-1">{config.label}</div>
                      <div className="text-gray-300 text-xs">{config.tooltip}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 🎨 CARTA NATAL PRINCIPAL */}
        <div className="bg-gradient-to-br from-black/50 to-purple-900/30 backdrop-blur-sm border border-white/20 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
          
          <div className="flex justify-center">
            <svg
              width="600"
              height="600"
              viewBox="0 0 500 500"
              className="border border-white/20 rounded-full bg-gradient-to-br from-indigo-950/50 via-purple-900/30 to-black/50 backdrop-blur-sm"
            >
              <circle cx="250" cy="250" r="130" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <circle cx="250" cy="250" r="170" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              <circle cx="250" cy="250" r="190" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <circle cx="250" cy="250" r="220" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <circle cx="250" cy="250" r="240" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              
              {renderAspectLines()}
              {renderHouses()}
              {renderSigns()}
              {renderAngles()}
              {renderPlanets()}
              
              <circle cx="250" cy="250" r="8" fill="#fbbf24" className="animate-pulse" />
              <text x="250" y="255" textAnchor="middle" dominantBaseline="middle" fill="black" fontSize="10" fontWeight="bold">
                ☉
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* ✅ NAVEGACIÓN - AFTER CARTA */}
      <div className="flex justify-center items-center gap-4 my-8">
        <button
          onClick={() => scrollToSection('carta-visual')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 bg-slate-800/50 border border-slate-600/30 text-slate-400 hover:border-blue-500/50 hover:text-blue-300"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
          Carta
        </button>

        <button
          onClick={() => scrollToSection('aspectos-detectados')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
            activeSection === 'aspectos-detectados'
              ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-2 border-yellow-400/50 text-yellow-300 shadow-lg shadow-yellow-500/20'
              : 'bg-slate-800/50 border border-slate-600/30 text-slate-400 hover:border-slate-500/50 hover:text-slate-300'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
          Aspectos
        </button>

        <button
          onClick={() => scrollToSection('posiciones-planetarias')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 bg-slate-800/50 border border-slate-600/30 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-300"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          Planetas
        </button>

        {chartType === 'solar-return' && (
          <button
            onClick={() => {
              const timelineSection = document.getElementById('linea-tiempo-solar');
              if (timelineSection) {
                timelineSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 bg-slate-800/50 border border-slate-600/30 text-slate-400 hover:border-rose-500/50 hover:text-rose-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            Línea de Tiempo
          </button>
        )}
      </div>

      {/* 🎯 SECCIÓN 2: ASPECTOS DETECTADOS */}
      {calculatedAspects.length > 0 && (
        <div id="aspectos-detectados" className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6">
          <div className="flex items-center mb-6">
            <svg className="w-6 h-6 text-yellow-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
            <h3 className="text-xl font-bold text-white">
              Aspectos Específicos Detectados en Tu Carta ({calculatedAspects.length})
            </h3>
          </div>
          
          <div className="mb-4 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
            <div className="text-blue-200 text-sm leading-relaxed">
              <strong>💡 Interpretación:</strong> Estos son los aspectos específicos encontrados entre tus planetas. 
              Cada uno representa una dinámica energética única en tu personalidad. Los aspectos 
              <span className="bg-yellow-400 text-black px-1 rounded mx-1 font-bold">EXACTOS</span> 
              (orbe &lt; 1°) son especialmente poderosos y definen rasgos muy marcados en ti.
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {calculatedAspects.slice(0, 20).map((aspect, index) => {
              const getAspectNature = (aspect: any) => {
                const difficulty = aspect.config.difficulty;
                if (difficulty === 'easy') return { label: 'Armónico', color: 'text-green-300 bg-green-400/20', icon: '✨' };
                if (difficulty === 'hard') return { label: 'Tenso', color: 'text-red-300 bg-red-400/20', icon: '⚡' };
                if (difficulty === 'neutral') return { label: 'Neutro', color: 'text-yellow-300 bg-yellow-400/20', icon: '🔥' };
                return { label: 'Menor', color: 'text-purple-300 bg-purple-400/20', icon: '🌟' };
              };

              const nature = getAspectNature(aspect);
              
              return (
                <div 
                  key={index}
                  className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10 cursor-pointer hover:border-white/20 transition-all duration-200 group relative"
                  onMouseEnter={(e) => {
                    setHoveredAspect(`${aspect.planet1}-${aspect.planet2}-${aspect.type}`);
                    handleMouseMove(e);
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setHoveredAspect(null)}
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold text-sm">
                      {aspect.planet1} - {aspect.planet2}
                    </span>
                    <div className="flex items-center space-x-2">
                      {aspect.exact && (
                        <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                          EXACTO
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: aspect.config.color }}
                    ></div>
                    <span className="text-gray-300 text-sm">{aspect.config.name}</span>
                  </div>

                  <div className="flex items-center mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${nature.color} border border-current/30`}>
                      {nature.icon} {nature.label}
                    </span>
                  </div>
                  
                  <div className="text-gray-400 text-xs">
                    Orbe: {aspect.orb.toFixed(2)}° | Ángulo: {aspect.angle.toFixed(1)}°
                  </div>
                  
                  <div className="mt-2 text-cyan-200 text-xs leading-relaxed">
                    {getPersonalizedAspectInterpretation(aspect).substring(0, 100)}...
                  </div>
                </div>
              );
            })}
          </div>
          
          {calculatedAspects.length > 20 && (
            <div className="mt-4 text-center">
              <div className="text-gray-400 text-sm">
                Se muestran los primeros 20 aspectos de {calculatedAspects.length} encontrados. 
                Los aspectos se ordenan por precisión (orbe menor = más importante).
              </div>
            </div>
          )}
        </div>
      )}

      {/* ✅ NAVEGACIÓN - AFTER ASPECTOS */}
      <div className="flex justify-center items-center gap-4 my-8">
        <button
          onClick={() => scrollToSection('carta-visual')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 bg-slate-800/50 border border-slate-600/30 text-slate-400 hover:border-blue-500/50 hover:text-blue-300"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
          Carta
        </button>

        <button
          onClick={() => scrollToSection('aspectos-detectados')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 bg-slate-800/50 border border-slate-600/30 text-slate-400 hover:border-yellow-500/50 hover:text-yellow-300"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
          Aspectos
        </button>

        <button
          onClick={() => scrollToSection('posiciones-planetarias')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
            activeSection === 'posiciones-planetarias'
              ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border-2 border-cyan-400/50 text-cyan-300 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-800/50 border border-slate-600/30 text-slate-400 hover:border-slate-500/50 hover:text-slate-300'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          Planetas
        </button>

        {chartType === 'solar-return' && (
          <button
            onClick={() => {
              const timelineSection = document.getElementById('linea-tiempo-solar');
              if (timelineSection) {
                timelineSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 bg-slate-800/50 border border-slate-600/30 text-slate-400 hover:border-rose-500/50 hover:text-rose-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            Línea de Tiempo
          </button>
        )}
      </div>

      {/* 🎯 SECCIÓN 3: POSICIONES PLANETARIAS */}
      <div id="posiciones-planetarias" className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6">
        <div className="flex items-center mb-6">
          <svg className="w-6 h-6 text-yellow-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <h3 className="text-xl font-bold text-white">Posiciones Planetarias - Tus Energías Básicas</h3>
        </div>
        
        <div className="mb-4 p-4 bg-purple-500/10 border border-purple-400/30 rounded-lg">
          <div className="text-purple-200 text-sm leading-relaxed">
            <strong>🌟 Guía:</strong> Cada planeta representa una energía específica en tu personalidad. 
            El signo muestra <em>cómo</em> expresas esa energía, y la casa indica <em>dónde</em> la manifiestas en tu vida. 
            Pasa el cursor sobre cada planeta para interpretaciones personalizadas.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {normalizedPlanets.map((planet, index) => (
            planet ? (
              <div 
                key={index} 
                className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10 cursor-pointer hover:border-white/20 transition-all duration-200"
                onMouseEnter={(e) => {
                  setHoveredPlanet(planet.name);
                  handleMouseMove(e);
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoveredPlanet(null)}
              >
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3" style={{ color: PLANET_COLORS[planet.name] || '#ffffff' }}>
                    {PLANET_SYMBOLS[planet.name] || '●'}
                  </span>
                  <div className="flex-1">
                    <div className="text-white font-semibold">{planet.name}</div>
                    <div className="text-gray-400 text-sm">
                      {(planet?.degree ?? 0)}° {planet?.sign ?? ''}
                      {planet.retrograde && <span className="text-red-400 ml-1 animate-pulse">R</span>}
                    </div>
                  </div>
                </div>
                
                <div className="text-gray-500 text-xs mb-2">
                  Casa {planet.house} | {SIGN_SYMBOLS[planet.sign] || ''} {signMeanings[planet.sign as keyof typeof signMeanings]}
                </div>
                
                <div className="text-cyan-200 text-xs leading-relaxed">
                  <strong>Significado:</strong> {planetMeanings[planet.name as keyof typeof planetMeanings]?.meaning.substring(0, 60)}...
                </div>
                
                <div className="mt-2 flex flex-wrap gap-1">
                  {planetMeanings[planet.name as keyof typeof planetMeanings]?.keywords.split(',').slice(0, 2).map((keyword: string, i: number) => (
                    <span key={i} className="bg-purple-400/20 text-purple-200 text-xs px-2 py-1 rounded-full">
                      {keyword.trim()}
                    </span>
                  ))}
                </div>
              </div>
            ) : null
          ))}
        </div>
      </div>

      {/* ✅ NAVEGACIÓN FINAL - BEFORE TIMELINE */}
      <div className="flex justify-center items-center gap-4 my-8">
        <button
          onClick={() => scrollToSection('carta-visual')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 bg-slate-800/50 border border-slate-600/30 text-slate-400 hover:border-blue-500/50 hover:text-blue-300"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
          Carta
        </button>

        <button
          onClick={() => scrollToSection('aspectos-detectados')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 bg-slate-800/50 border border-slate-600/30 text-slate-400 hover:border-yellow-500/50 hover:text-yellow-300"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
          Aspectos
        </button>

        <button
          onClick={() => scrollToSection('posiciones-planetarias')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 bg-slate-800/50 border border-slate-600/30 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-300"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          Planetas
        </button>

        {chartType === 'solar-return' && (
          <button
            onClick={() => {
              const timelineSection = document.getElementById('linea-tiempo-solar');
              if (timelineSection) {
                timelineSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-rose-500/30 to-pink-500/30 border-2 border-rose-400/50 text-rose-300 shadow-lg shadow-rose-500/20`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            Línea de Tiempo
          </button>
        )}
      </div>

      {/* 📊 SECCIONES EDUCATIVAS */}
      <div className="space-y-8">
        <div className="p-6 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-xl border border-indigo-400/30">
          <div className="text-center mb-6">
            <h4 className="text-white font-bold text-xl mb-3">
              <svg className="w-6 h-6 inline mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
              Resumen de Aspectos - Cómo interactúan tus energías planetarias
            </h4>
            <div className="text-indigo-200 text-base mb-4">Comprende las dinámicas internas de tu personalidad a través de los aspectos astrológicos</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div className="text-center p-4 bg-green-400/10 rounded-xl border border-green-400/30">
              <div className="text-green-300 font-bold text-xl mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
                Aspectos Armónicos
              </div>
              <div className="text-green-200 text-sm mb-2 font-semibold">Trígono (120°), Sextil (60°), Semisextil (30°)</div>
              <div className="text-green-100 text-xs leading-relaxed">
                <strong>🌟 Qué significan:</strong> Son tus facilidades naturales, talentos innatos y energías que fluyen sin esfuerzo. 
                Representan las áreas donde tienes habilidades naturales y donde las cosas te salen más fácil.
              </div>
              <div className="text-green-200 text-xs mt-2 font-medium">✨ En tu vida: Aprovecha estos aspectos para desarrollar tus fortalezas</div>
            </div>
            
            <div className="text-center p-4 bg-red-400/10 rounded-xl border border-red-400/30">
              <div className="text-red-300 font-bold text-xl mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
                </svg>
                Aspectos Tensos
              </div>
              <div className="text-red-200 text-sm mb-2 font-semibold">Cuadratura (90°), Oposición (180°), Quincuncio (150°)</div>
              <div className="text-red-100 text-xs leading-relaxed">
                <strong>⚡ Qué significan:</strong> Son tus desafíos internos que generan crecimiento. Crean tensión creativa que te impulsa 
                a evolucionar y desarrollar nuevas capacidades. Son tu motor de transformación personal.
              </div>
              <div className="text-red-200 text-xs mt-2 font-medium">🚀 En tu vida: Abraza estos desafíos como oportunidades de crecimiento</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-400/10 rounded-xl border border-yellow-400/30">
              <div className="text-yellow-300 font-bold text-xl mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="6"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
                Aspectos Especiales
              </div>
              <div className="text-yellow-200 text-sm mb-2 font-semibold">Conjunción (0°), Aspectos Menores</div>
              <div className="text-yellow-100 text-xs leading-relaxed">
                <strong>🔥 Qué significan:</strong> Las conjunciones fusionan energías planetarias creando una fuerza unificada muy potente. 
                Los aspectos menores añaden matices y sutilezas a tu personalidad.
              </div>
              <div className="text-yellow-200 text-xs mt-2 font-medium">💫 En tu vida: Reconoce estas energías intensas y únicas en ti</div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-yellow-400/15 border border-yellow-400/40 rounded-xl">
          <div className="text-center mb-4">
            <div className="text-yellow-300 font-bold text-xl mb-2 flex items-center justify-center">
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
              ¿Qué son los Aspectos EXACTOS?
            </div>
          </div>
          
          <div className="text-yellow-100 text-sm leading-relaxed max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="font-semibold mb-2 text-yellow-200">🎯 Definición:</div>
                <div className="mb-4">
                  Un aspecto se considera <span className="bg-yellow-400 text-black px-2 py-1 rounded font-bold">EXACTO</span> cuando 
                  el orbe (diferencia angular) es menor a <span className="font-semibold text-yellow-200">1 grado</span>. 
                  Esto significa que los planetas están casi en el ángulo perfecto del aspecto.
                </div>
                
                <div className="font-semibold mb-2 text-yellow-200">⚡ Intensidad:</div>
                <div>
                  Los aspectos exactos tienen <span className="font-semibold text-yellow-200">máxima potencia energética</span> 
                  y representan las influencias <span className="font-semibold text-yellow-200">más poderosas y definitorias</span> 
                  en tu personalidad y destino.
                </div>
              </div>
              
              <div>
                <div className="font-semibold mb-2 text-yellow-200">🌟 En tu carta:</div>
                <div className="mb-4">
                  Si tienes aspectos exactos, estas energías planetarias están <span className="font-semibold text-yellow-200">perfectamente sincronizadas</span> 
                  en tu ser. Son como "superpoderes astrológicos" que definen rasgos muy marcados de tu personalidad.
                </div>
                
                <div className="font-semibold mb-2 text-yellow-200">💫 Importancia:</div>
                <div>
                  Presta especial atención a tus aspectos exactos: son las <span className="font-semibold text-yellow-200">claves maestras</span> 
                  para entender tu naturaleza más profunda y tus potenciales más desarrollados.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 TOOLTIPS DINÁMICOS CON DRAWER */}
      <ChartTooltips
        hoveredPlanet={hoveredPlanet}
        hoveredAspect={hoveredAspect}
        hoveredHouse={hoveredHouse}
        ascendant={ascendant ?? undefined}
        midheaven={midheaven ?? undefined}
        planets={normalizedPlanets}
        calculatedAspects={calculatedAspects}
        tooltipPosition={tooltipPosition}
        setHoveredPlanet={setHoveredPlanet}
        setHoveredAspect={setHoveredAspect}
        setHoveredHouse={setHoveredHouse}
        onOpenDrawer={onOpenDrawer}
        drawerOpen={drawerOpen}
      />




      {/* Debug info */}
      <div className="bg-black/30 rounded-xl p-4 text-xs text-gray-400">
        <div>🔍 Planetas: {planets.length} | Casas: {houses.length} | Aspectos: {calculatedAspects.length}</div>
        <div>🔺 Ascendente: {ascendant?.sign || 'N/A'} | MC: {midheaven?.sign || 'N/A'}</div>
        <div className="mt-2 text-yellow-300">💡 <strong>Tip:</strong> Pasa el cursor sobre elementos para interpretaciones personalizadas</div>
      </div>
    </div>
  );
};

export default ChartDisplay;
