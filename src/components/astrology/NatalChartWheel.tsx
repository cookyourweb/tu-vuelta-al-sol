// src/components/astrology/NatalChartWheel.tsx - VERSIÓN CORREGIDA Y MEJORADA
'use client';

import React, { useState, useMemo } from 'react';

// =============================================================================
// INTERFACES Y TIPOS
// =============================================================================

interface Planet {
  name: string;
  sign: string;
  longitude: number;
  isRetrograde?: boolean;
  house?: number;
}

interface House {
  number: number;
  longitude: number;
  sign?: string;
}

interface Aspect {
  planet1: string;
  planet2: string;
  type: string;
  orb: number;
  angle?: number;
}

interface NatalChartWheelProps {
  planets: Planet[];
  houses: House[];
  aspects: Aspect[];
  ascendant?: any;
  midheaven?: any;
  showAspects?: boolean;
  showPlanetNames?: boolean;
  showDegrees?: boolean;
  width?: number;
  height?: number;
}

// =============================================================================
// CONFIGURACIÓN DE ASPECTOS MEJORADA
// =============================================================================

const ASPECT_DEFINITIONS = {
  conjunction: { angle: 0, orb: 8, color: '#FFD700', width: 4, style: 'solid', priority: 1 },
  opposition: { angle: 180, orb: 8, color: '#FF4444', width: 3.5, style: 'solid', priority: 2 },
  trine: { angle: 120, orb: 8, color: '#4CAF50', width: 3, style: 'solid', priority: 3 },
  square: { angle: 90, orb: 8, color: '#FF9800', width: 3, style: 'solid', priority: 4 },
  sextile: { angle: 60, orb: 6, color: '#2196F3', width: 2.5, style: 'dashed', priority: 5 },
  quincunx: { angle: 150, orb: 3, color: '#9C27B0', width: 2, style: 'dotted', priority: 6 }
};

// =============================================================================
// FUNCIONES DE CÁLCULO DE ASPECTOS
// =============================================================================

function calculateAngularDifference(angle1: number, angle2: number): number {
  const diff = Math.abs(angle1 - angle2);
  return Math.min(diff, 360 - diff);
}

function findAspectType(separation: number): string | null {
  for (const [type, config] of Object.entries(ASPECT_DEFINITIONS)) {
    const exactAngle = config.angle;
    const orb = config.orb;
    
    // Verificar aspecto directo
    if (Math.abs(separation - exactAngle) <= orb) {
      return type;
    }
    
    // Verificar aspecto complementario (ej: 180° también es 180° desde el otro lado)
    if (Math.abs((360 - separation) - exactAngle) <= orb) {
      return type;
    }
  }
  return null;
}

function calculateAllAspects(planets: Planet[]): Aspect[] {
  const calculatedAspects: Aspect[] = [];
  
  // Verificar cada par de planetas
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];
      
      // Calcular separación angular
      const separation = calculateAngularDifference(planet1.longitude, planet2.longitude);
      
      // Buscar tipo de aspecto
      const aspectType = findAspectType(separation);
      
      if (aspectType) {
        const aspectConfig = ASPECT_DEFINITIONS[aspectType as keyof typeof ASPECT_DEFINITIONS];
        const orb = Math.abs(separation - aspectConfig.angle);
        
        calculatedAspects.push({
          planet1: planet1.name,
          planet2: planet2.name,
          type: aspectType,
          orb: orb,
          angle: separation
        });
      }
    }
  }
  
  // Ordenar por prioridad y orbe
  return calculatedAspects.sort((a, b) => {
    const configA = ASPECT_DEFINITIONS[a.type as keyof typeof ASPECT_DEFINITIONS];
    const configB = ASPECT_DEFINITIONS[b.type as keyof typeof ASPECT_DEFINITIONS];
    
    if (configA.priority !== configB.priority) {
      return configA.priority - configB.priority;
    }
    
    return a.orb - b.orb;
  });
}

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

const NatalChartWheel: React.FC<NatalChartWheelProps> = ({
  planets = [],
  houses = [],
  aspects = [],
  ascendant,
  midheaven,
  showAspects = true,
  showPlanetNames = true,
  showDegrees = true,
  width = 600,
  height = 600
}) => {
  // Estados para interactividad
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [hoveredAspect, setHoveredAspect] = useState<string | null>(null);
  const [aspectFilter, setAspectFilter] = useState<string>('major');

  // Configuración del SVG
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = Math.min(width, height) * 0.42;
  const middleRadius = outerRadius * 0.75;
  const innerRadius = outerRadius * 0.5;
  const planetRadius = outerRadius * 0.85;

  // Símbolos zodiacales
  const zodiacSymbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
  
  // Símbolos planetarios
  const planetSymbols: Record<string, string> = {
    'Sol': '☉', 'Luna': '☽', 'Mercurio': '☿', 'Venus': '♀', 'Marte': '♂',
    'Júpiter': '♃', 'Saturno': '♄', 'Urano': '♅', 'Neptuno': '♆', 'Plutón': '♇',
    'Quirón': '⚷', 'Nodo Norte': '☊', 'Nodo Sur': '☋', 'Lilith': '⚸'
  };

  // Colores de planetas
  const planetColors: Record<string, string> = {
    'Sol': '#FFD700', 'Luna': '#C0C0C0', 'Mercurio': '#FFA500', 'Venus': '#FF69B4',
    'Marte': '#FF4500', 'Júpiter': '#4169E1', 'Saturno': '#8B4513', 'Urano': '#00CED1',
    'Neptuno': '#4682B4', 'Plutón': '#8B008B', 'Quirón': '#FF8C00', 'Nodo Norte': '#228B22',
    'Nodo Sur': '#32CD32', 'Lilith': '#696969'
  };

  // Calcular aspectos automáticamente si no se proporcionan
  const finalAspects = useMemo(() => {
    if (aspects.length > 0) {
      return aspects;
    }
    
    if (planets.length >= 2) {
      const calculated = calculateAllAspects(planets);
      console.log('🔥 Aspectos calculados automáticamente:', calculated.length);
      return calculated;
    }
    
    return [];
  }, [aspects, planets]);

  // Filtrar aspectos según configuración
  const filteredAspects = useMemo(() => {
    if (aspectFilter === 'major') {
      return finalAspects.filter(aspect => 
        ['conjunction', 'opposition', 'trine', 'square', 'sextile'].includes(aspect.type)
      );
    }
    return finalAspects;
  }, [finalAspects, aspectFilter]);

  // =============================================================================
  // FUNCIONES DE UTILIDAD
  // =============================================================================

  const getPositionFromLongitude = (longitude: number, radius: number) => {
    // Convertir a radianes, ajustar para que 0° esté en la parte superior
    const radians = (longitude - 90) * (Math.PI / 180);
    return {
      x: centerX + radius * Math.cos(radians),
      y: centerY + radius * Math.sin(radians)
    };
  };

  // =============================================================================
  // FUNCIONES DE RENDERIZADO
  // =============================================================================

  const renderZodiacSigns = () => {
    return zodiacSymbols.map((symbol, index) => {
      const angle = index * 30;
      const position = getPositionFromLongitude(angle + 15, outerRadius + 30);
      
      return (
        <text
          key={`zodiac-${index}`}
          x={position.x}
          y={position.y}
          fontSize="20"
          fill="#4A5568"
          textAnchor="middle"
          dominantBaseline="middle"
          fontWeight="bold"
        >
          {symbol}
        </text>
      );
    });
  };

  const renderHouseLines = () => {
    return houses.map((house, index) => {
      if (typeof house.longitude !== 'number' || isNaN(house.longitude)) return null;
      
      const innerPos = getPositionFromLongitude(house.longitude, innerRadius);
      const outerPos = getPositionFromLongitude(house.longitude, outerRadius);
      
      return (
        <line
          key={`house-line-${index}`}
          x1={innerPos.x}
          y1={innerPos.y}
          x2={outerPos.x}
          y2={outerPos.y}
          stroke="#CBD5E0"
          strokeWidth="1"
          strokeDasharray="3,3"
          opacity="0.6"
        />
      );
    });
  };

  const renderHouseNumbers = () => {
    return houses.map((house, index) => {
      if (typeof house.longitude !== 'number' || isNaN(house.longitude)) return null;
      
      const nextHouse = houses[(index + 1) % houses.length];
      const nextLongitude = nextHouse?.longitude || (house.longitude + 30);
      const midPoint = (house.longitude + nextLongitude) / 2;
      
      const position = getPositionFromLongitude(midPoint, middleRadius);
      
      return (
        <text
          key={`house-number-${index}`}
          x={position.x}
          y={position.y}
          fontSize="14"
          fill="#718096"
          textAnchor="middle"
          dominantBaseline="middle"
          fontWeight="bold"
        >
          {house.number}
        </text>
      );
    });
  };

  const renderPlanets = () => {
    return planets.map((planet, index) => {
      if (typeof planet.longitude !== 'number' || isNaN(planet.longitude)) return null;
      
      const position = getPositionFromLongitude(planet.longitude, planetRadius);
      const symbol = planetSymbols[planet.name] || planet.name.charAt(0);
      const color = planetColors[planet.name] || '#666666';
      const isHovered = hoveredPlanet === planet.name;
      
      return (
        <g key={`planet-${index}`}>
          {/* Círculo de fondo */}
          <circle
            cx={position.x}
            cy={position.y}
            r={isHovered ? 18 : 15}
            fill="rgba(255, 255, 255, 0.95)"
            stroke={color}
            strokeWidth={isHovered ? 3 : 2}
            filter={isHovered ? 'drop-shadow(0 0 8px rgba(0,0,0,0.3))' : 'none'}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHoveredPlanet(planet.name)}
            onMouseLeave={() => setHoveredPlanet(null)}
          />
          
          {/* Símbolo del planeta */}
          <text
            x={position.x}
            y={position.y}
            fontSize={isHovered ? "16" : "14"}
            fill={color}
            textAnchor="middle"
            dominantBaseline="middle"
            fontWeight="bold"
            style={{ cursor: 'pointer', pointerEvents: 'none' }}
          >
            {symbol}
          </text>
          
          {/* Indicador de retrogradación */}
          {planet.isRetrograde && (
            <text
              x={position.x + 12}
              y={position.y - 8}
              fontSize="10"
              fill="#FF4444"
              textAnchor="middle"
              dominantBaseline="middle"
              fontWeight="bold"
            >
              ℞
            </text>
          )}
          
          {/* Tooltip al hacer hover */}
          {isHovered && (
            <g>
              <rect
                x={position.x + 25}
                y={position.y - 35}
                width="140"
                height="55"
                fill="rgba(0,0,0,0.85)"
                rx="8"
                ry="8"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
              />
              <text
                x={position.x + 30}
                y={position.y - 20}
                fontSize="12"
                fill="white"
                fontWeight="bold"
              >
                {planet.name}
              </text>
              <text
                x={position.x + 30}
                y={position.y - 5}
                fontSize="10"
                fill="#FFD700"
              >
                {planet.sign} {Math.floor(planet.longitude % 30)}°
              </text>
              <text
                x={position.x + 30}
                y={position.y + 8}
                fontSize="10"
                fill="#87CEEB"
              >
                Casa {planet.house || '?'}
              </text>
            </g>
          )}
        </g>
      );
    });
  };

  const renderAspectLines = () => {
    if (!showAspects) return null;
    
    console.log('🔥 Renderizando aspectos:', filteredAspects.length);
    
    return filteredAspects.map((aspect, index) => {
      const planet1 = planets.find(p => p.name === aspect.planet1);
      const planet2 = planets.find(p => p.name === aspect.planet2);
      
      if (!planet1 || !planet2) return null;
      
      const pos1 = getPositionFromLongitude(planet1.longitude, planetRadius);
      const pos2 = getPositionFromLongitude(planet2.longitude, planetRadius);
      
      const aspectConfig = ASPECT_DEFINITIONS[aspect.type as keyof typeof ASPECT_DEFINITIONS];
      if (!aspectConfig) return null;
      
      const aspectId = `${aspect.planet1}-${aspect.planet2}-${aspect.type}`;
      const isHovered = hoveredAspect === aspectId;
      
      return (
        <g key={`aspect-${index}`}>
          {/* Línea de sombra */}
          <line
            x1={pos1.x}
            y1={pos1.y}
            x2={pos2.x}
            y2={pos2.y}
            stroke="rgba(0,0,0,0.2)"
            strokeWidth={(aspectConfig.width + 1) * (isHovered ? 1.5 : 1)}
            strokeDasharray={
              aspectConfig.style === 'dashed' ? '8,4' : 
              aspectConfig.style === 'dotted' ? '3,3' : 
              ''
            }
            opacity="0.7"
          />
          
          {/* Línea principal del aspecto */}
          <line
            x1={pos1.x}
            y1={pos1.y}
            x2={pos2.x}
            y2={pos2.y}
            stroke={aspectConfig.color}
            strokeWidth={aspectConfig.width * (isHovered ? 1.5 : 1)}
            strokeDasharray={
              aspectConfig.style === 'dashed' ? '8,4' : 
              aspectConfig.style === 'dotted' ? '3,3' : 
              ''
            }
            opacity={isHovered ? 1.0 : 0.8}
            style={{
              cursor: 'pointer',
              filter: isHovered ? 'drop-shadow(0 0 4px rgba(0,0,0,0.5))' : 'none'
            }}
            onMouseEnter={() => setHoveredAspect(aspectId)}
            onMouseLeave={() => setHoveredAspect(null)}
          />
        </g>
      );
    });
  };

  const renderDegreeMarkers = () => {
    const markers = [];
    
    for (let i = 0; i < 360; i += 10) {
      const isMajor = i % 30 === 0;
      const innerPos = getPositionFromLongitude(i, outerRadius - (isMajor ? 15 : 8));
      const outerPos = getPositionFromLongitude(i, outerRadius);
      
      markers.push(
        <line
          key={`degree-${i}`}
          x1={innerPos.x}
          y1={innerPos.y}
          x2={outerPos.x}
          y2={outerPos.y}
          stroke={isMajor ? "#4A5568" : "#CBD5E0"}
          strokeWidth={isMajor ? 2 : 1}
          opacity={isMajor ? 0.8 : 0.5}
        />
      );
    }
    
    return markers;
  };

  // =============================================================================
  // RENDER PRINCIPAL
  // =============================================================================

  return (
    <div className="flex flex-col items-center">
      {/* Controles */}
      <div className="mb-4 flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setAspectFilter('major')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            aspectFilter === 'major' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Aspectos Mayores ({filteredAspects.length})
        </button>
        <button
          onClick={() => setAspectFilter('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            aspectFilter === 'all' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todos los Aspectos ({finalAspects.length})
        </button>
      </div>

      {/* Carta SVG */}
      <div className="relative">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="border-2 border-gray-200 rounded-xl shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50"
        >
          {/* Definiciones de gradientes */}
          <defs>
            <radialGradient id="chartBackground" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#f8fafc" stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* Fondo de la carta */}
          <circle
            cx={centerX}
            cy={centerY}
            r={outerRadius}
            fill="url(#chartBackground)"
            stroke="#e2e8f0"
            strokeWidth="2"
          />

          {/* Círculos concéntricos */}
          <circle
            cx={centerX}
            cy={centerY}
            r={middleRadius}
            fill="none"
            stroke="#cbd5e0"
            strokeWidth="1"
            strokeDasharray="5,5"
            opacity="0.5"
          />
          
          <circle
            cx={centerX}
            cy={centerY}
            r={innerRadius}
            fill="rgba(255,255,255,0.8)"
            stroke="#a0aec0"
            strokeWidth="1"
            opacity="0.7"
          />

          {/* Marcadores de grados */}
          {renderDegreeMarkers()}

          {/* Líneas zodiacales */}
          {zodiacSymbols.map((_, index) => {
            const innerPos = getPositionFromLongitude(index * 30, innerRadius);
            const outerPos = getPositionFromLongitude(index * 30, outerRadius);
            
            return (
              <line
                key={`zodiac-line-${index}`}
                x1={innerPos.x}
                y1={innerPos.y}
                x2={outerPos.x}
                y2={outerPos.y}
                stroke="#e2e8f0"
                strokeWidth="1.5"
                opacity="0.6"
              />
            );
          })}

          {/* Símbolos zodiacales */}
          {renderZodiacSigns()}

          {/* Líneas de casas */}
          {renderHouseLines()}

          {/* Números de casas */}
          {renderHouseNumbers()}

          {/* ASPECTOS - Renderizar primero para que aparezcan detrás */}
          {renderAspectLines()}

          {/* PLANETAS - Renderizar encima */}
          {renderPlanets()}

          {/* Ascendente y MC */}
          {ascendant && (
            <g>
              <line
                x1={centerX}
                y1={centerY}
                x2={getPositionFromLongitude(0, outerRadius).x}
                y2={getPositionFromLongitude(0, outerRadius).y}
                stroke="#ff6b6b"
                strokeWidth="3"
                opacity="0.8"
              />
              <text
                x={getPositionFromLongitude(0, outerRadius + 35).x}
                y={getPositionFromLongitude(0, outerRadius + 35).y}
                fontSize="12"
                fill="#ff6b6b"
                textAnchor="middle"
                fontWeight="bold"
              >
                AC
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Información de aspectos */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <div className="font-bold text-gray-800">{planets.length}</div>
          <div className="text-gray-600">Planetas</div>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <div className="font-bold text-gray-800">{houses.length}</div>
          <div className="text-gray-600">Casas</div>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <div className="font-bold text-gray-800">{filteredAspects.length}</div>
          <div className="text-gray-600">Aspectos</div>
        </div>
      </div>

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs max-w-4xl">
          <strong>🔧 Debug Info:</strong>
          <br />
          <strong>Aspectos originales:</strong> {aspects.length}
          <br />
          <strong>Aspectos calculados:</strong> {finalAspects.length}
          <br />
          <strong>Aspectos filtrados:</strong> {filteredAspects.length}
          <br />
          <strong>Planetas válidos:</strong> {planets.filter(p => typeof p.longitude === 'number').length}/{planets.length}
          <br />
          <strong>Hover planeta:</strong> {hoveredPlanet || 'Ninguno'}
          <br />
          <strong>Hover aspecto:</strong> {hoveredAspect || 'Ninguno'}
          
          {filteredAspects.length > 0 && (
            <div className="mt-2">
              <strong>Aspectos detectados:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {filteredAspects.map((aspect, i) => (
                  <span key={i} className="bg-white px-2 py-1 rounded text-xs border">
                    {aspect.planet1} {aspect.type} {aspect.planet2} ({aspect.orb.toFixed(1)}°)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NatalChartWheel;