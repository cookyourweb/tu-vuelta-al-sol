'use client';

import React, { useState, useEffect } from 'react';

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
  ascendant?: { longitude: number };
  midheaven?: { longitude: number };
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

import { calculateAllAspects } from '@/utils/astrology/aspectCalculations';

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
  width = 650,
  height = 650
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div
        style={{ width: width, height: height }}
        className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-2xl border border-purple-200/50 animate-pulse flex items-center justify-center"
      >
        <div className="text-purple-400">
          <svg className="w-12 h-12 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  const toFixedString = (value: number, decimals: number = 6): string => {
    return value.toFixed(decimals);
  };

  const svgWidth = width;
  const svgHeight = height;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const outerRadius = Math.min(centerX, centerY) * 0.9;
  const innerRadius = outerRadius * 0.5;
  const middleRadius = (outerRadius + innerRadius) / 2;

  const getPositionFromLongitude = (longitude: number, radius: number) => {
    if (
      longitude === null ||
      longitude === undefined ||
      typeof longitude !== 'number' ||
      isNaN(longitude) ||
      !isFinite(longitude)
    ) {
      return { x: toFixedString(centerX), y: toFixedString(centerY) };
    }

    const adjustedAngle = (longitude + 270) % 360;
    const angleInRadians = (adjustedAngle * Math.PI) / 180;

    const x = centerX + radius * Math.cos(angleInRadians);
    const y = centerY + radius * Math.sin(angleInRadians);

    if (isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) {
      return { x: toFixedString(centerX), y: toFixedString(centerY) };
    }

    return {
      x: toFixedString(x),
      y: toFixedString(y)
    };
  };

  const renderAspectLines = () => {
    if (!showAspects || !aspects || aspects.length === 0) return null;

    return aspects.map((aspect: Aspect, index: number) => {
      const planet1 = planets.find((p: Planet) => p.name === aspect.planet1);
      const planet2 = planets.find((p: Planet) => p.name === aspect.planet2);

      if (!planet1 || !planet2) return null;

      const pos1 = getPositionFromLongitude(planet1.longitude, innerRadius * 0.85);
      const pos2 = getPositionFromLongitude(planet2.longitude, innerRadius * 0.85);

      const aspectConfig = ASPECT_DEFINITIONS[aspect.type as keyof typeof ASPECT_DEFINITIONS];

      if (!aspectConfig) return null;

      return (
        <line
          key={`aspect-line-${index}`}
          x1={pos1.x}
          y1={pos1.y}
          x2={pos2.x}
          y2={pos2.y}
          stroke={aspectConfig.color}
          strokeWidth={aspectConfig.width}
          strokeDasharray={aspectConfig.style === 'dashed' ? '6 4' : aspectConfig.style === 'dotted' ? '2 4' : '0'}
          opacity={0.7}
        />
      );
    });
  };

  const renderHouseLines = () => {
    if (!houses || houses.length === 0) return null;

    return houses.map((house: House, index: number) => {
      const position = getPositionFromLongitude(house.longitude, outerRadius);

      return React.createElement(
        'line',
        {
          key: `house-line-${index}`,
          x1: toFixedString(centerX),
          y1: toFixedString(centerY),
          x2: position.x,
          y2: position.y,
          stroke: '#999',
          strokeWidth: '1',
          strokeDasharray: '4 2'
        }
      );
    });
  };

  const renderHouseNumbers = () => {
    if (!houses || houses.length === 0) return null;

    return houses.map((house: House, index: number) => {
      const nextHouse = houses[(index + 1) % houses.length];
      const nextLongitude = nextHouse ? nextHouse.longitude : house.longitude + 30;
      const midAngle = (house.longitude + nextLongitude) / 2;
      const position = getPositionFromLongitude(midAngle, middleRadius * 0.82);

      return (
        <text
          key={`house-number-${index}`}
          x={position.x}
          y={position.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={12}
          fill="#666"
          fontWeight="bold"
        >
          {house.number}
        </text>
      );
    });
  };

  const zodiacSymbols = [
    { symbol: '♈', name: 'Aries', longitude: 0 },
    { symbol: '♉', name: 'Tauro', longitude: 30 },
    { symbol: '♊', name: 'Géminis', longitude: 60 },
    { symbol: '♋', name: 'Cáncer', longitude: 90 },
    { symbol: '♌', name: 'Leo', longitude: 120 },
    { symbol: '♍', name: 'Virgo', longitude: 150 },
    { symbol: '♎', name: 'Libra', longitude: 180 },
    { symbol: '♏', name: 'Escorpio', longitude: 210 },
    { symbol: '♐', name: 'Sagitario', longitude: 240 },
    { symbol: '♑', name: 'Capricornio', longitude: 270 },
    { symbol: '♒', name: 'Acuario', longitude: 300 },
    { symbol: '♓', name: 'Piscis', longitude: 330 }
  ];

  const elementColors: Record<string, string> = {
    'Aries': '#FF5733', 'Leo': '#FF5733', 'Sagitario': '#FF5733',
    'Tauro': '#33A02C', 'Virgo': '#33A02C', 'Capricornio': '#33A02C',
    'Géminis': '#6BA9FF', 'Libra': '#6BA9FF', 'Acuario': '#6BA9FF',
    'Cáncer': '#B19CD9', 'Escorpio': '#B19CD9', 'Piscis': '#B19CD9'
  };

  const renderZodiacSigns = () => {
    return zodiacSymbols.map((zodiacSign: { symbol: string; name: string; longitude: number }, index: number) => {
      const position = getPositionFromLongitude(zodiacSign.longitude + 15, outerRadius * 0.95);
      const color = elementColors[zodiacSign.name] || '#666';

      return (
        <text
          key={`zodiac-${index}`}
          x={position.x}
          y={position.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={16}
          fill={color}
          fontWeight="bold"
        >
          {zodiacSign.symbol}
        </text>
      );
    });
  };

  const planetSymbols: Record<string, string> = {
    'Sol': '☉',
    'Luna': '☽',
    'Mercurio': '☿',
    'Venus': '♀',
    'Marte': '♂',
    'Júpiter': '♃',
    'Saturno': '♄',
    'Urano': '♅',
    'Neptuno': '♆',
    'Plutón': '♇',
    'Quirón': '⚷',
    'Nodo Norte': '☊',
    'Nodo Sur': '☋',
    'Lilith': '⚸'
  };

  const renderPlanets = () => {
    return planets.map((planet: Planet, index: number) => {
      const position = getPositionFromLongitude(planet.longitude, innerRadius * 0.85);
      const symbol = planetSymbols[planet.name] || planet.name.charAt(0);

      return (
        <g key={`planet-${index}`}>
          <circle
            cx={position.x}
            cy={position.y}
            r="12"
            fill="white"
            stroke="#333"
            strokeWidth="1"
          />
          <text
            x={position.x}
            y={position.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fill="#333"
            fontWeight="bold"
          >
            {symbol}
          </text>
        </g>
      );
    });
  };

  const renderAscendant = () => {
    if (!ascendant) return null;

    const position = getPositionFromLongitude(ascendant.longitude, outerRadius * 1.05);

    return (
      <g>
        <text
          x={position.x}
          y={position.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={14}
          fill="#FF6B35"
          fontWeight="bold"
        >
          AC
        </text>
      </g>
    );
  };

  const renderMidheaven = () => {
    if (!midheaven) return null;

    const position = getPositionFromLongitude(midheaven.longitude, outerRadius * 1.05);

    return (
      <g>
        <text
          x={position.x}
          y={position.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={14}
          fill="#2E8B57"
          fontWeight="bold"
        >
          MC
        </text>
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={svgWidth} height={svgHeight} className="border border-gray-200 rounded-lg shadow-lg">
        {/* Círculo exterior (zodíaco) */}
        <circle
          cx={toFixedString(centerX)}
          cy={toFixedString(centerY)}
          r={toFixedString(outerRadius)}
          fill="none"
          stroke="#333"
          strokeWidth="2"
        />

        {/* Círculo interior (planetas) */}
        <circle
          cx={toFixedString(centerX)}
          cy={toFixedString(centerY)}
          r={toFixedString(innerRadius)}
          fill="none"
          stroke="#666"
          strokeWidth="1"
        />

        {/* Círculo medio (casas) */}
        <circle
          cx={toFixedString(centerX)}
          cy={toFixedString(centerY)}
          r={toFixedString(middleRadius)}
          fill="none"
          stroke="#999"
          strokeWidth="1"
          strokeDasharray="2 2"
        />

        {/* Líneas de las casas */}
        {renderHouseLines()}

        {/* Líneas de división del zodíaco (cada 30 grados) */}
        {zodiacSymbols.map((_, index) => {
          const startPos = getPositionFromLongitude(index * 30, innerRadius);
          const endPos = getPositionFromLongitude(index * 30, outerRadius);

          return (
            <line
              key={`zodiac-line-${index}`}
              x1={startPos.x}
              y1={startPos.y}
              x2={endPos.x}
              y2={endPos.y}
              stroke="#ddd"
              strokeWidth="1"
            />
          );
        })}

        {/* Líneas de aspectos */}
        {renderAspectLines()}

        {/* Símbolos del zodíaco */}
        {renderZodiacSigns()}

        {/* Números de las casas */}
        {renderHouseNumbers()}

        {/* Planetas */}
        {renderPlanets()}

        {/* Ascendente */}
        {renderAscendant()}

        {/* Medio Cielo */}
        {renderMidheaven()}

        {/* Punto central */}
        <circle
          cx={toFixedString(centerX)}
          cy={toFixedString(centerY)}
          r="3"
          fill="#333"
        />
      </svg>

      {/* Leyenda */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg max-w-md">
        <h3 className="font-semibold mb-2">Leyenda</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <span className="w-4 h-4 bg-red-500 rounded mr-2"></span>
            <span>Fuego</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-green-500 rounded mr-2"></span>
            <span>Tierra</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-blue-400 rounded mr-2"></span>
            <span>Aire</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-purple-400 rounded mr-2"></span>
            <span>Agua</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          <p><strong>AC:</strong> Ascendente</p>
          <p><strong>MC:</strong> Medio Cielo</p>
        </div>
      </div>
    </div>
  );
};

export default NatalChartWheel;
