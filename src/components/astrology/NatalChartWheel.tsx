// src/components/astrology/NatalChartWheel.tsx
'use client';

import React from 'react';

interface Planet {
  name: string;
  sign: string;
  longitude: number;
  symbol?: string;
}

interface House {
  number: number;
  longitude: number;
}

interface NatalChartWheelProps {
  planets: Planet[];
  houses: House[];
  ascendant?: { longitude: number };
  midheaven?: { longitude: number };
  width?: number;
  height?: number;
}

const NatalChartWheel: React.FC<NatalChartWheelProps> = ({
  planets = [],
  houses = [],
  ascendant,
  midheaven,
  width = 500,
  height = 500
}) => {
  // Constantes para dibujar el gráfico
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = Math.min(centerX, centerY) * 0.9;
  const innerRadius = outerRadius * 0.5;  // Radio para el círculo interno
  const middleRadius = (outerRadius + innerRadius) / 2;  // Radio para las casas
  
  // Símbolos de los signos zodiacales
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
  
  // Símbolos de los planetas
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
  
  // Colores para los elementos
  const elementColors: Record<string, string> = {
    'Aries': '#FF5733', 'Leo': '#FF5733', 'Sagitario': '#FF5733', // Fuego - rojo/naranja
    'Tauro': '#33A02C', 'Virgo': '#33A02C', 'Capricornio': '#33A02C', // Tierra - verde
    'Géminis': '#6BA9FF', 'Libra': '#6BA9FF', 'Acuario': '#6BA9FF', // Aire - azul claro
    'Cáncer': '#B19CD9', 'Escorpio': '#B19CD9', 'Piscis': '#B19CD9' // Agua - púrpura
  };
  
  // Calcular posición basada en longitud zodiacal
  const getPositionFromLongitude = (longitude: number, radius: number) => {
    // Convertir longitud a radianes (considerando 0° = parte superior y avanzando en sentido horario)
    const angleInRadians = ((longitude + 90) % 360) * (Math.PI / 180);
    
    // Calcular posición
    const x = centerX + radius * Math.cos(angleInRadians);
    const y = centerY + radius * Math.sin(angleInRadians);
    
    return { x, y };
  };
  
  // Generamos las líneas de las casas
  const renderHouseLines = () => {
    if (houses.length === 0) return null;
    
    return houses.map((house, index) => {
      const position = getPositionFromLongitude(house.longitude, outerRadius);
      
      return (
        <line
          key={`house-line-${index}`}
          x1={centerX}
          y1={centerY}
          x2={position.x}
          y2={position.y}
          stroke="#999"
          strokeWidth="1"
          strokeDasharray="4 2"
        />
      );
    });
  };
  
  // Renderizar los números de las casas
  const renderHouseNumbers = () => {
    if (houses.length === 0) return null;
    
    return houses.map((house, index) => {
      // Calcular posición para el número de la casa
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
          fontSize="12"
          fill="#666"
          fontWeight="bold"
        >
          {house.number}
        </text>
      );
    });
  };
  
  // Renderizar los símbolos del zodíaco
  const renderZodiacSigns = () => {
    return zodiacSymbols.map((zodiacSign, index) => {
      const position = getPositionFromLongitude(zodiacSign.longitude + 15, outerRadius * 0.95);
      const color = elementColors[zodiacSign.name] || '#666';
      
      return (
        <text
          key={`zodiac-${index}`}
          x={position.x}
          y={position.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fill={color}
          fontWeight="bold"
        >
          {zodiacSign.symbol}
        </text>
      );
    });
  };
  
  // Renderizar los planetas
  const renderPlanets = () => {
    return planets.map((planet, index) => {
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
  
  // Renderizar el ascendente si está disponible
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
          fontSize="14"
          fill="#FF6B35"
          fontWeight="bold"
        >
          AC
        </text>
      </g>
    );
  };
  
  // Renderizar el medio cielo si está disponible
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
          fontSize="14"
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
      <svg width={width} height={height} className="border border-gray-200 rounded-lg shadow-lg">
        {/* Círculo exterior (zodíaco) */}
        <circle
          cx={centerX}
          cy={centerY}
          r={outerRadius}
          fill="none"
          stroke="#333"
          strokeWidth="2"
        />
        
        {/* Círculo interior (planetas) */}
        <circle
          cx={centerX}
          cy={centerY}
          r={innerRadius}
          fill="none"
          stroke="#666"
          strokeWidth="1"
        />
        
        {/* Círculo medio (casas) */}
        <circle
          cx={centerX}
          cy={centerY}
          r={middleRadius}
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
          cx={centerX}
          cy={centerY}
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