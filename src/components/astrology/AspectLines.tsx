
/**
 * Componente mejorado para renderizar líneas de aspectos astrológicos con animaciones
 * Archivo: components/astrology/AspectLines.tsx
 */

'use client';

import React, { useState, useEffect } from 'react';

import { AspectVisualizationConfig, ExtendedPlanet, Planet, PlanetaryAspect } from '../../../types/astrology';

// =============================================================================
// TIPOS MEJORADOS
// =============================================================================

export interface AspectLinesProps {
  aspects: PlanetaryAspect[];
  planetPositions: Array<{
    planet: Planet | ExtendedPlanet;
    degree: number;
    x: number;
    y: number;
  }>;
  svgConfig: {
    centerX: number;
    centerY: number;
    radius: number;
    size: number;
  };
  config?: Partial<AspectVisualizationConfig>;
  filters?: {
    showMajorAspects?: boolean;
    showMinorAspects?: boolean;
    maxOrb?: number;
    selectedPlanets?: (Planet | ExtendedPlanet)[];
  };
  onAspectClick?: (aspect: PlanetaryAspect) => void;
  onAspectHover?: (aspect: PlanetaryAspect | null) => void;
  className?: string;
  // ✨ NUEVAS PROPS
  showAnimations?: boolean;
  highlightStrongest?: boolean;
  showTooltips?: boolean;
}

// =============================================================================
// CONFIGURACIÓN MEJORADA
// =============================================================================

const DEFAULT_CONFIG: AspectVisualizationConfig = {
  show_major_aspects: true,
  show_minor_aspects: true,
  show_aspect_symbols: false,
  max_orb_display: 8,
  opacity_based_on_strength: true,
  color_coding: 'by_nature',
  line_style_coding: true
};

const DEFAULT_FILTERS = {
  showMajorAspects: true,
  showMinorAspects: false,
  maxOrb: 8,
  selectedPlanets: []
};

// Colores mejorados para los aspectos
const ASPECT_COLORS = {
  // Aspectos armónicos (verdes/azules)
  conjunction: '#FFD700', // Oro - neutral pero poderoso
  trine: '#00FF7F',       // Verde brillante - muy armónico
  sextile: '#87CEEB',     // Azul cielo - armónico suave
  semisextile: '#98FB98', // Verde pálido - armónico menor
  quintile: '#20B2AA',    // Turquesa - creativo
  biquintile: '#48D1CC',  // Turquesa medio - creativo
  
  // Aspectos tensionales (rojos/naranjas)
  opposition: '#FF4500',     // Rojo-naranja - tensión fuerte
  square: '#DC143C',         // Rojo carmesí - tensión dinámica
  quincunx: '#FF6347',       // Tomate - tensión adaptable
  sesquiquadrate: '#B22222', // Rojo ladrillo - tensión menor
  semisquare: '#CD5C5C'      // Rojo indio - tensión menor
};

// =============================================================================
// COMPONENTE PRINCIPAL MEJORADO
// =============================================================================

export const AspectLines: React.FC<AspectLinesProps> = ({
  aspects,
  planetPositions,
  svgConfig,
  config = {},
  filters = {},
  onAspectClick,
  onAspectHover,
  className = '',
  showAnimations = true,
  highlightStrongest = true,
  showTooltips = true
}) => {
  // Estados para animaciones y interactividad
  const [animatedAspects, setAnimatedAspects] = useState<Set<string>>(new Set());
  const [hoveredAspect, setHoveredAspect] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<{
    aspect: PlanetaryAspect;
    x: number;
    y: number;
  } | null>(null);

  // Combinar configuración
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const finalFilters = { ...DEFAULT_FILTERS, ...filters };

  // Filtrar aspectos
  const filteredAspects = React.useMemo(() => {
    let filtered = aspects;
    
    if (!finalFilters.showMajorAspects || !finalFilters.showMinorAspects) {
      const majorAspects = ['conjunction', 'opposition', 'trine', 'square', 'sextile'];
      filtered = filtered.filter(aspect => {
        const isMajor = majorAspects.includes(aspect.aspect_type);
        return (isMajor && finalFilters.showMajorAspects) || 
               (!isMajor && finalFilters.showMinorAspects);
      });
    }
    
    if (finalFilters.maxOrb) {
      filtered = filtered.filter(aspect => aspect.orb <= finalFilters.maxOrb);
    }
    
    if (finalFilters.selectedPlanets && finalFilters.selectedPlanets.length > 0) {
      filtered = filtered.filter(aspect => 
        finalFilters.selectedPlanets!.includes(aspect.planet1) ||
        finalFilters.selectedPlanets!.includes(aspect.planet2)
      );
    }
    
    return filtered;
  }, [aspects, finalFilters]);

  // Calcular posiciones de líneas
  const linePositions = React.useMemo(() => {
    try {
      return calculateAspectLinePositions(filteredAspects, planetPositions, {
        centerX: svgConfig.centerX,
        centerY: svgConfig.centerY,
        radius: svgConfig.radius
      });
    } catch (error) {
      console.error('Error calculando posiciones de aspectos:', error);
      return [];
    }
  }, [filteredAspects, planetPositions, svgConfig]);

  // Encontrar el aspecto más fuerte
  const strongestAspect = React.useMemo(() => {
    if (!highlightStrongest || filteredAspects.length === 0) return null;
    
    return filteredAspects.reduce((strongest, current) => {
      const strengthValues = { muy_fuerte: 4, fuerte: 3, moderado: 2, debil: 1 };
      const currentStrength = strengthValues[current.strength] || 1;
      const strongestStrength = strengthValues[strongest.strength] || 1;
      
      return currentStrength > strongestStrength ? current : strongest;
    });
  }, [filteredAspects, highlightStrongest]);

  // Animación de entrada escalonada
  useEffect(() => {
    if (!showAnimations) return;
    
    const timer = setTimeout(() => {
      filteredAspects.forEach((aspect, index) => {
        setTimeout(() => {
          setAnimatedAspects(prev => new Set([...prev, aspect.id]));
        }, index * 100);
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, [filteredAspects, showAnimations]);

  // Obtener color del aspecto
  const getAspectColor = (aspect: PlanetaryAspect, isStrongest: boolean = false): string => {
    if (isStrongest) return '#FFD700'; // Oro para el más fuerte
    return ASPECT_COLORS[aspect.aspect_type as keyof typeof ASPECT_COLORS] || '#888888';
  };

  // Obtener patrón de línea
  const getStrokeDashArray = (style: string, width: number): string => {
    switch (style) {
      case 'dashed': return `${width * 4} ${width * 2}`;
      case 'dotted': return `${width} ${width}`;
      default: return 'none';
    }
  };

  // Manejar eventos del mouse
  const handleLineClick = (aspect: PlanetaryAspect, event: React.MouseEvent) => {
    event.stopPropagation();
    onAspectClick?.(aspect);
  };

  const handleLineHover = (aspect: PlanetaryAspect | null, event?: React.MouseEvent) => {
    setHoveredAspect(aspect?.id || null);
    onAspectHover?.(aspect);
    
    if (showTooltips && aspect && event) {
      const rect = (event.target as SVGElement).closest('svg')?.getBoundingClientRect();
      if (rect) {
        setTooltipData({
          aspect,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top - 10
        });
      }
    } else {
      setTooltipData(null);
    }
  };

  if (linePositions.length === 0) return null;

  return (
    <g className={`aspect-lines ${className}`}>
      {/* Definir filtros y gradientes mejorados */}
      <defs>
        {/* Filtro de brillo para aspectos fuertes */}
        <filter id="aspect-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Filtro de pulso para el aspecto más fuerte */}
        <filter id="aspect-pulse" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feOffset dx="0" dy="0" result="offset"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="offset"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Gradientes para líneas especiales */}
        <linearGradient id="strongest-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8">
            <animate attributeName="stop-opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
          </stop>
          <stop offset="50%" stopColor="#FFA500" stopOpacity="1"/>
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0.8">
            <animate attributeName="stop-opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
          </stop>
        </linearGradient>
      </defs>

      {/* Renderizar líneas de aspectos */}
      {linePositions
        .filter((line): line is NonNullable<typeof line> => line !== null)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((line, index) => {
          const aspect = filteredAspects.find(a => a.id === line.id);
          if (!aspect) return null;
          
          const isStrongest = strongestAspect?.id === aspect.id;
          const isHovered = hoveredAspect === aspect.id;
          const isAnimated = animatedAspects.has(aspect.id);
          const color = getAspectColor(aspect, isStrongest);
          
          return (
            <g key={line.id}>
              {/* Sombra/resplandor de fondo */}
              {(isStrongest || isHovered) && (
                <line
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={color}
                  strokeWidth={Math.max(2, line.width + 2)}
                  strokeDasharray={getStrokeDashArray(line.style, line.width)}
                  opacity={0.3}
                  fill="none"
                  filter={isStrongest ? "url(#aspect-pulse)" : "url(#aspect-glow)"}
                />
              )}
              
              {/* Línea principal */}
              <line
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={isStrongest ? "url(#strongest-gradient)" : color}
                strokeWidth={Math.max(1, line.width + (isHovered ? 1 : 0))}
                strokeDasharray={getStrokeDashArray(line.style, line.width)}
                opacity={finalConfig.opacity_based_on_strength ? 
                  Math.max(0.4, line.opacity + (isHovered ? 0.2 : 0)) : 0.7}
                fill="none"
                className={`aspect-line aspect-${aspect.aspect_type} ${
                  isAnimated ? 'animate-aspect-draw' : ''
                }`}
                style={{
                  cursor: onAspectClick ? 'pointer' : 'default',
                  filter: aspect.strength === 'muy_fuerte' ? 'url(#aspect-glow)' : 'none',
                  pointerEvents: onAspectClick ? 'stroke' : 'none',
                  strokeDashoffset: isAnimated ? 0 : 1000,
                  animation: showAnimations && isAnimated ? 
                    `drawLine 1s ease-out forwards, ${isStrongest ? 'pulseLine 2s ease-in-out infinite' : ''}` : 'none',
                  transformOrigin: 'center'
                }}
                onClick={(e) => handleLineClick(aspect, e)}
                onMouseEnter={(e) => handleLineHover(aspect, e)}
                onMouseLeave={() => handleLineHover(null)}
              >
                <title>
                  {`${aspect.planet1} ${aspect.aspect_type} ${aspect.planet2} (${aspect.orb.toFixed(1)}°)`}
                </title>
              </line>
              
              {/* Puntos en los extremos para aspectos muy fuertes */}
              {aspect.strength === 'muy_fuerte' && (
                <>
                  <circle
                    cx={line.x1}
                    cy={line.y1}
                    r="2"
                    fill={color}
                    opacity="0.8"
                    className={showAnimations ? 'animate-pulse' : ''}
                  />
                  <circle
                    cx={line.x2}
                    cy={line.y2}
                    r="2"
                    fill={color}
                    opacity="0.8"
                    className={showAnimations ? 'animate-pulse' : ''}
                  />
                </>
              )}
            </g>
          );
        })}

      {/* Tooltip */}
      {showTooltips && tooltipData && (
        <foreignObject
          x={tooltipData.x - 60}
          y={tooltipData.y - 30}
          width="120"
          height="60"
          className="pointer-events-none"
        >
          <div className="bg-black/90 text-white text-xs rounded-lg p-2 shadow-lg backdrop-blur-sm border border-white/20">
            <div className="font-semibold text-center mb-1">
              {tooltipData.aspect.aspect_type.toUpperCase()}
            </div>
            <div className="text-center text-gray-300">
              {tooltipData.aspect.planet1} ↔ {tooltipData.aspect.planet2}
            </div>
            <div className="text-center text-gray-400 text-xs">
              Orbe: {tooltipData.aspect.orb.toFixed(1)}°
            </div>
          </div>
        </foreignObject>
      )}
      
      {/* Estilos CSS para animaciones */}
      <style jsx>{`
        @keyframes drawLine {
          from {
            stroke-dashoffset: 1000;
            opacity: 0;
          }
          to {
            stroke-dashoffset: 0;
            opacity: var(--final-opacity, 0.7);
          }
        }
        
        @keyframes pulseLine {
          0%, 100% {
            filter: drop-shadow(0 0 3px currentColor);
          }
          50% {
            filter: drop-shadow(0 0 8px currentColor);
          }
        }
        
        .animate-aspect-draw {
          animation: drawLine 1s ease-out forwards;
        }
      `}</style>
    </g>
  );
};

// =============================================================================
// LEYENDA MEJORADA CON ESTADÍSTICAS
// =============================================================================

export interface AspectLegendProps {
  aspects: PlanetaryAspect[];
  config?: Partial<AspectVisualizationConfig>;
  onToggleAspectType?: (aspectType: string) => void;
  activeAspectTypes?: string[];
  className?: string;
  showStatistics?: boolean;
}

export const AspectLegend: React.FC<AspectLegendProps> = ({
  aspects,
  config = {},
  onToggleAspectType,
  activeAspectTypes = [],
  className = '',
  showStatistics = true
}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Agrupar aspectos por tipo
  const aspectGroups = React.useMemo(() => {
    const groups: Record<string, PlanetaryAspect[]> = {};
    aspects.forEach(aspect => {
      if (!groups[aspect.aspect_type]) {
        groups[aspect.aspect_type] = [];
      }
      groups[aspect.aspect_type].push(aspect);
    });
    return groups;
  }, [aspects]);

  // Calcular estadísticas
  const statistics = React.useMemo(() => {
    const byNature = { harmonico: 0, tensional: 0, neutro: 0 };
    const byStrength = { muy_fuerte: 0, fuerte: 0, moderado: 0, debil: 0 };
    
    aspects.forEach(aspect => {
      // Por naturaleza
      const harmoniousTypes = ['trine', 'sextile', 'semisextile', 'quintile', 'biquintile'];
      const tensionalTypes = ['opposition', 'square', 'quincunx', 'sesquiquadrate', 'semisquare'];
      
      if (harmoniousTypes.includes(aspect.aspect_type)) {
        byNature.harmonico++;
      } else if (tensionalTypes.includes(aspect.aspect_type)) {
        byNature.tensional++;
      } else {
        byNature.neutro++;
      }
      
      // Por fuerza
      byStrength[aspect.strength]++;
    });
    
    return { byNature, byStrength };
  }, [aspects]);

  const aspectTypes = Object.keys(aspectGroups);

  if (aspectTypes.length === 0) {
    return null;
  }

  return (
    <div className={`aspect-legend ${className}`}>
      <h3 className="text-lg font-bold mb-4 text-white flex items-center">
        🔮 Aspectos Astrológicos
        <span className="ml-2 text-sm bg-white/10 rounded-full px-2 py-1">
          {aspects.length}
        </span>
      </h3>
      
      {/* Lista de aspectos */}
      <div className="space-y-2 mb-6">
        {aspectTypes.map(aspectType => {
          const firstAspect = aspectGroups[aspectType][0];
          const count = aspectGroups[aspectType].length;
          const isActive = activeAspectTypes.includes(aspectType);
          const color = ASPECT_COLORS[aspectType as keyof typeof ASPECT_COLORS] || '#888888';
          
          return (
            <div
              key={aspectType}
              className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                isActive 
                  ? 'bg-white/20 border border-white/30' 
                  : 'bg-white/5 hover:bg-white/10 border border-transparent'
              }`}
              onClick={() => onToggleAspectType?.(aspectType)}
            >
              {/* Línea de muestra */}
              <svg width="30" height="16" className="flex-shrink-0">
                <line
                  x1="2"
                  y1="8"
                  x2="28"
                  y2="8"
                  stroke={color}
                  strokeWidth={Math.max(2, firstAspect.visual.line_width)}
                  strokeDasharray={
                    firstAspect.visual.line_style === 'dashed' ? '4 3' :
                    firstAspect.visual.line_style === 'dotted' ? '2 2' : 'none'
                  }
                  opacity={0.9}
                />
              </svg>
              
              {/* Información del aspecto */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white capitalize truncate">
                  {aspectType.replace('_', ' ')}
                </div>
                <div className="text-xs text-gray-400">
                  {count} aspecto{count !== 1 ? 's' : ''} • 
                  {firstAspect.strength === 'muy_fuerte' ? ' 🔥 Muy fuerte' :
                   firstAspect.strength === 'fuerte' ? ' ⚡ Fuerte' :
                   firstAspect.strength === 'moderado' ? ' ✨ Moderado' : ' 💫 Suave'}
                </div>
              </div>
              
              {/* Indicador de actividad */}
              <div className={`w-3 h-3 rounded-full transition-all ${
                isActive ? 'bg-white' : 'bg-white/30'
              }`} />
            </div>
          );
        })}
      </div>
      
      {/* Estadísticas */}
      {showStatistics && (
        <div className="border-t border-white/20 pt-4">
          <h4 className="font-semibold text-sm mb-3 text-white">📊 Resumen</h4>
          
          {/* Por naturaleza */}
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-2">Por naturaleza:</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-2 text-center">
                <div className="font-bold text-green-300">{statistics.byNature.harmonico}</div>
                <div className="text-green-400">Armónicos</div>
              </div>
              <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-2 text-center">
                <div className="font-bold text-red-300">{statistics.byNature.tensional}</div>
                <div className="text-red-400">Tensionales</div>
              </div>
              <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-2 text-center">
                <div className="font-bold text-yellow-300">{statistics.byNature.neutro}</div>
                <div className="text-yellow-400">Neutros</div>
              </div>
            </div>
          </div>
          
          {/* Por fuerza */}
          <div>
            <div className="text-xs text-gray-400 mb-2">Por intensidad:</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-300">🔥 Muy fuertes:</span>
                <span className="text-white font-bold">{statistics.byStrength.muy_fuerte}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-300">⚡ Fuertes:</span>
                <span className="text-white font-bold">{statistics.byStrength.fuerte}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-300">✨ Moderados:</span>
                <span className="text-white font-bold">{statistics.byStrength.moderado}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-300">💫 Suaves:</span>
                <span className="text-white font-bold">{statistics.byStrength.debil}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AspectLines;

function calculateAspectLinePositions(
  filteredAspects: PlanetaryAspect[],
  planetPositions: { planet: Planet | ExtendedPlanet; degree: number; x: number; y: number; }[],
  { centerX, centerY, radius }: { centerX: number; centerY: number; radius: number; }
) {
  // Helper to find planet position by planet name
  const getPlanetPos = (planet: Planet | ExtendedPlanet) =>
    planetPositions.find(p => p.planet === planet);

  // Map aspect strength to opacity and width
  const strengthMap = {
    muy_fuerte: { opacity: 1, width: 3 },
    fuerte: { opacity: 0.85, width: 2.5 },
    moderado: { opacity: 0.7, width: 2 },
    debil: { opacity: 0.5, width: 1.5 }
  };

  // Map aspect type to line style
  const styleMap: Record<string, string> = {
    conjunction: 'solid',
    opposition: 'dashed',
    trine: 'solid',
    sextile: 'dashed',
    square: 'dotted',
    quincunx: 'dotted',
    semisextile: 'dashed',
    quintile: 'dashed',
    biquintile: 'dashed',
    sesquiquadrate: 'dotted',
    semisquare: 'dotted'
  };

  // Z-index: major aspects above minor
  const zIndexMap: Record<string, number> = {
    conjunction: 10,
    opposition: 9,
    trine: 8,
    square: 7,
    sextile: 6,
    // minor aspects
    quincunx: 5,
    sesquiquadrate: 4,
    semisquare: 3,
    semisextile: 2,
    quintile: 2,
    biquintile: 2
  };

  return filteredAspects.map(aspect => {
    const pos1 = getPlanetPos(aspect.planet1);
    const pos2 = getPlanetPos(aspect.planet2);

    if (!pos1 || !pos2) {
      // Fallback: skip if planet position not found
      return null;
    }

    // Optionally, you could shorten the lines a bit so they don't overlap planet glyphs
    const shorten = 10; // px to shorten from each end
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const ratio = dist === 0 ? 0 : shorten / dist;

    const x1 = pos1.x + dx * ratio;
    const y1 = pos1.y + dy * ratio;
    const x2 = pos2.x - dx * ratio;
    const y2 = pos2.y - dy * ratio;

    const strength = strengthMap[aspect.strength] || strengthMap['debil'];
    const style = aspect.visual?.line_style || styleMap[aspect.aspect_type] || 'solid';
    const width = aspect.visual?.line_width || strength.width;
    const opacity = aspect.visual?.opacity ?? strength.opacity;
    const zIndex = zIndexMap[aspect.aspect_type] || 1;

    return {
      id: aspect.id,
      x1,
      y1,
      x2,
      y2,
      width,
      opacity,
      style,
      zIndex
    };
  }).filter(Boolean);
}
