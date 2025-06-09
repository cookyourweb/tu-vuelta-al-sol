// src/components/astrology/AspectLines.tsx
'use client';

import React from 'react';

// =============================================================================
// INTERFACES Y TIPOS (Compatible con NatalChartWheel)
// =============================================================================

export interface AspectLineProps {
  planet1: string;
  planet2: string;
  type: 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile' | 'quincunx';
  orb: number;
  exact_angle: number;
  strength?: 'muy_fuerte' | 'fuerte' | 'moderado' | 'debil';
}

export interface PlanetPosition {
  name: string;
  x: number;
  y: number;
  longitude: number;
}

export interface AspectLinesProps {
  aspects: AspectLineProps[];
  planetPositions: PlanetPosition[];
  svgConfig: {
    centerX: number;
    centerY: number;
    radius: number;
    size: number;
  };
  filters?: {
    showMajorAspects?: boolean;
    showMinorAspects?: boolean;
    maxOrb?: number;
    selectedPlanets?: string[];
  };
  onAspectHover?: (aspect: AspectLineProps | null) => void;
  hoveredAspect?: string | null;
}

// =============================================================================
// CONFIGURACIÓN DE ASPECTOS
// =============================================================================

const ASPECT_STYLES: Record<string, {
  color: string;
  width: number;
  opacity: number;
  dashArray?: string;
  nature: 'harmonico' | 'tensional' | 'neutro';
}> = {
  conjunction: {
    color: '#FFD700',
    width: 3,
    opacity: 0.9,
    nature: 'neutro'
  },
  opposition: {
    color: '#FF4444',
    width: 2.5,
    opacity: 0.8,
    nature: 'tensional'
  },
  trine: {
    color: '#4CAF50',
    width: 2,
    opacity: 0.7,
    nature: 'harmonico'
  },
  square: {
    color: '#FF9800',
    width: 2,
    opacity: 0.7,
    nature: 'tensional'
  },
  sextile: {
    color: '#2196F3',
    width: 1.5,
    opacity: 0.6,
    dashArray: '5,5',
    nature: 'harmonico'
  },
  quincunx: {
    color: '#9C27B0',
    width: 1,
    opacity: 0.5,
    dashArray: '2,2',
    nature: 'tensional'
  }
};

const MAJOR_ASPECTS = ['conjunction', 'opposition', 'trine', 'square', 'sextile'];
const MINOR_ASPECTS = ['quincunx', 'semisextile', 'sesquiquadrate', 'semisquare'];

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

export const AspectLines: React.FC<AspectLinesProps> = ({
  aspects,
  planetPositions,
  svgConfig,
  filters = {},
  onAspectHover,
  hoveredAspect
}) => {
  const {
    showMajorAspects = true,
    showMinorAspects = false,
    maxOrb = 8,
    selectedPlanets = []
  } = filters;

  // Filtrar aspectos según configuración
  const filteredAspects = React.useMemo(() => {
    return aspects.filter(aspect => {
      // Filtro por orbe máximo
      if (Math.abs(aspect.orb) > maxOrb) return false;
      
      // Filtro por tipo de aspecto
      const isMajor = MAJOR_ASPECTS.includes(aspect.type);
      const isMinor = MINOR_ASPECTS.includes(aspect.type);
      
      if (!showMajorAspects && isMajor) return false;
      if (!showMinorAspects && isMinor) return false;
      
      // Filtro por planetas seleccionados
      if (selectedPlanets.length > 0) {
        const hasSelectedPlanet = selectedPlanets.includes(aspect.planet1) || 
                                 selectedPlanets.includes(aspect.planet2);
        if (!hasSelectedPlanet) return false;
      }
      
      return true;
    });
  }, [aspects, showMajorAspects, showMinorAspects, maxOrb, selectedPlanets]);

  // Encontrar posiciones de planetas
  const getPlanetPosition = (planetName: string): PlanetPosition | null => {
    return planetPositions.find(p => p.name === planetName) || null;
  };

  // Calcular intensidad basada en orbe
  const calculateIntensity = (orb: number, maxOrb: number): number => {
    return Math.max(0.3, 1 - (Math.abs(orb) / maxOrb));
  };

  // ID único para cada aspecto
  const getAspectId = (aspect: AspectLineProps): string => {
    return `${aspect.planet1}-${aspect.planet2}-${aspect.type}`;
  };

  return (
    <g className="aspect-lines">
      {/* Definir filtros para efectos de brillo */}
      <defs>
        <filter id="aspectGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="aspectGlowStrong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {filteredAspects.map((aspect) => {
        const pos1 = getPlanetPosition(aspect.planet1);
        const pos2 = getPlanetPosition(aspect.planet2);
        
        if (!pos1 || !pos2) return null;

        const style = ASPECT_STYLES[aspect.type];
        if (!style) return null;

        const aspectId = getAspectId(aspect);
        const isHovered = hoveredAspect === aspectId;
        const intensity = calculateIntensity(aspect.orb, maxOrb);
        
        // Calcular propiedades visuales
        const strokeWidth = style.width * (isHovered ? 1.5 : 1);
        const opacity = style.opacity * intensity * (isHovered ? 1.2 : 1);
        const filter = isHovered ? 'url(#aspectGlowStrong)' : 
                      intensity > 0.7 ? 'url(#aspectGlow)' : '';

        return (
          <g key={aspectId} className="aspect-line-group">
            {/* Línea principal del aspecto */}
            <line
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke={style.color}
              strokeWidth={strokeWidth}
              strokeOpacity={opacity}
              strokeDasharray={style.dashArray}
              filter={filter}
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                pointerEvents: 'stroke'
              }}
              onMouseEnter={() => onAspectHover?.(aspect)}
              onMouseLeave={() => onAspectHover?.(null)}
            />
            
            {/* Línea de fondo para mejor interacción */}
            <line
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke="transparent"
              strokeWidth={Math.max(8, strokeWidth * 2)}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => onAspectHover?.(aspect)}
              onMouseLeave={() => onAspectHover?.(null)}
            />
            
            {/* Punto medio para información adicional */}
            {isHovered && (
              <circle
                cx={(pos1.x + pos2.x) / 2}
                cy={(pos1.y + pos2.y) / 2}
                r="3"
                fill={style.color}
                opacity="0.8"
                style={{
                  animation: 'pulse 2s infinite'
                }}
              />
            )}
          </g>
        );
      })}
    </g>
  );
};

// =============================================================================
// COMPONENTE DE LEYENDA
// =============================================================================

export interface AspectLegendProps {
  aspects: AspectLineProps[];
  onToggleAspectType?: (aspectType: string) => void;
  visibleTypes?: Set<string>;
  className?: string;
}

export const AspectLegend: React.FC<AspectLegendProps> = ({
  aspects,
  onToggleAspectType,
  visibleTypes = new Set(),
  className = ""
}) => {
  // Contar aspectos por tipo
  const aspectCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    aspects.forEach(aspect => {
      counts[aspect.type] = (counts[aspect.type] || 0) + 1;
    });
    return counts;
  }, [aspects]);

  // Tipos de aspectos encontrados
  const aspectTypes = Object.keys(aspectCounts).sort((a, b) => {
    const aIsMajor = MAJOR_ASPECTS.includes(a);
    const bIsMajor = MAJOR_ASPECTS.includes(b);
    if (aIsMajor && !bIsMajor) return -1;
    if (!aIsMajor && bIsMajor) return 1;
    return aspectCounts[b] - aspectCounts[a];
  });

  if (aspectTypes.length === 0) {
    return (
      <div className={`text-sm text-gray-500 text-center p-4 ${className}`}>
        No hay aspectos para mostrar
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="font-semibold text-gray-700 text-sm">
        Aspectos Activos ({aspects.length})
      </h4>
      
      <div className="grid grid-cols-2 gap-2">
        {aspectTypes.map((aspectType) => {
          const style = ASPECT_STYLES[aspectType];
          const count = aspectCounts[aspectType];
          const isVisible = visibleTypes.has(aspectType);
          const isMajor = MAJOR_ASPECTS.includes(aspectType);
          
          if (!style) return null;
          
          return (
            <button
              key={aspectType}
              onClick={() => onToggleAspectType?.(aspectType)}
              className={`
                flex items-center justify-between p-2 rounded-lg border transition-all text-xs
                ${isVisible 
                  ? 'bg-white border-gray-300 shadow-sm' 
                  : 'bg-gray-50 border-gray-200 opacity-60'
                }
                hover:shadow-md hover:scale-105
              `}
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-1 rounded"
                  style={{
                    backgroundColor: style.color,
                    opacity: isVisible ? style.opacity : 0.3
                  }}
                />
                <span className={`capitalize font-medium ${isVisible ? 'text-gray-800' : 'text-gray-500'}`}>
                  {aspectType}
                </span>
                {isMajor && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-1 py-0.5 rounded">
                    M
                  </span>
                )}
              </div>
              
              <span className={`font-bold ${isVisible ? 'text-gray-600' : 'text-gray-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Resumen por naturaleza */}
      <div className="pt-2 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-2 text-xs">
          {['harmonico', 'tensional', 'neutro'].map(nature => {
            const count = aspectTypes.reduce((acc, type) => {
              const style = ASPECT_STYLES[type];
              return acc + (style?.nature === nature ? aspectCounts[type] : 0);
            }, 0);
            
            const colors = {
              harmonico: 'text-green-600 bg-green-50',
              tensional: 'text-red-600 bg-red-50',
              neutro: 'text-yellow-600 bg-yellow-50'
            };
            
            return (
              <div key={nature} className={`text-center p-1 rounded ${colors[nature as keyof typeof colors]}`}>
                <div className="font-semibold">{count}</div>
                <div className="capitalize">{nature}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENTE DE TOOLTIP
// =============================================================================

export interface AspectTooltipProps {
  aspect: AspectLineProps;
  position: { x: number; y: number };
  className?: string;
}

export const AspectTooltip: React.FC<AspectTooltipProps> = ({
  aspect,
  position,
  className = ""
}) => {
  const style = ASPECT_STYLES[aspect.type];
  if (!style) return null;

  return (
    <div 
      className={`absolute z-50 pointer-events-none ${className}`}
      style={{
        left: position.x + 10,
        top: position.y - 10,
        transform: 'translateY(-100%)'
      }}
    >
      <div className="bg-black/80 text-white text-xs rounded-lg p-3 shadow-lg max-w-xs">
        <div className="font-semibold capitalize mb-1">
          {aspect.type}
        </div>
        
        <div className="space-y-1 text-gray-300">
          <div>{aspect.planet1} → {aspect.planet2}</div>
          <div>Orbe: {Math.abs(aspect.orb).toFixed(1)}°</div>
          <div>Ángulo: {aspect.exact_angle.toFixed(1)}°</div>
          {aspect.strength && (
            <div className="capitalize">Fuerza: {aspect.strength.replace('_', ' ')}</div>
          )}
        </div>
        
        <div className={`text-xs mt-2 capitalize font-medium`}>
          Naturaleza: <span style={{ color: style.color }}>{style.nature}</span>
        </div>
      </div>
    </div>
  );
};

export default AspectLines;