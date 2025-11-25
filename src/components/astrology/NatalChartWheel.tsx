// src/components/astrology/NatalChartWheel.tsx - VERSIÓN FINAL CORREGIDA
'use client';

import React, { useState, useRef } from 'react';

interface Planet {
  name: string;
  sign: string;
  degree: number;
  minutes: number;
  longitude: number;
  retrograde?: boolean;
  housePosition?: number;
}

interface House {
  number: number;
  sign: string;
  degree: number;
  minutes: number;
  longitude: number;
}

interface Aspect {
  planet1: string;
  planet2: string;
  type: string;
  orb: number;
}

interface AngleData {
  sign: string;
  degree: number;
  minutes: number;
  longitude: number;
}

interface NatalChartWheelProps {
  planets: Planet[];
  houses: House[];
  aspects?: Aspect[];
  ascendant?: AngleData;
  midheaven?: AngleData;
  width?: number;
  height?: number;
  showAspects?: boolean;
  showDegreeMarkers?: boolean;
}

const NatalChartWheel: React.FC<NatalChartWheelProps> = ({
  planets = [],
  houses = [],
  aspects = [],
  ascendant,
  midheaven,
  width = 600,
  height = 600,
  showAspects = true,
  showDegreeMarkers = true
}) => {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [hoveredAspect, setHoveredAspect] = useState<string | null>(null);
  const aspectHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Manejar hover de aspectos con delay para dar tiempo a mover mouse al tooltip
  const handleAspectMouseEnter = (aspectId: string) => {
    // Cancelar cualquier timeout pendiente
    if (aspectHoverTimeoutRef.current) {
      clearTimeout(aspectHoverTimeoutRef.current);
      aspectHoverTimeoutRef.current = null;
    }
    setHoveredAspect(aspectId);
  };

  const handleAspectMouseLeave = () => {
    // Agregar delay de 800ms antes de ocultar - tiempo suficiente para mover mouse al tooltip
    aspectHoverTimeoutRef.current = setTimeout(() => {
      setHoveredAspect(null);
    }, 800);
  };

  const cancelAspectHideTimeout = () => {
    // Cancelar timeout si el mouse entra al tooltip
    if (aspectHoverTimeoutRef.current) {
      clearTimeout(aspectHoverTimeoutRef.current);
      aspectHoverTimeoutRef.current = null;
    }
  };

  // Cleanup al desmontar
  React.useEffect(() => {
    return () => {
      if (aspectHoverTimeoutRef.current) {
        clearTimeout(aspectHoverTimeoutRef.current);
      }
    };
  }, []);

  // Constantes para dibujar el gráfico
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = Math.min(centerX, centerY) * 0.88;
  const innerRadius = outerRadius * 0.45;
  const middleRadius = outerRadius * 0.7;
  const planetRadius = outerRadius * 0.55;
  
  // 🌟 Símbolos zodiacales mejorados
  const zodiacSymbols = [
    { symbol: '♈', name: 'Aries', longitude: 0, element: 'fire' },
    { symbol: '♉', name: 'Tauro', longitude: 30, element: 'earth' },
    { symbol: '♊', name: 'Géminis', longitude: 60, element: 'air' },
    { symbol: '♋', name: 'Cáncer', longitude: 90, element: 'water' },
    { symbol: '♌', name: 'Leo', longitude: 120, element: 'fire' },
    { symbol: '♍', name: 'Virgo', longitude: 150, element: 'earth' },
    { symbol: '♎', name: 'Libra', longitude: 180, element: 'air' },
    { symbol: '♏', name: 'Escorpio', longitude: 210, element: 'water' },
    { symbol: '♐', name: 'Sagitario', longitude: 240, element: 'fire' },
    { symbol: '♑', name: 'Capricornio', longitude: 270, element: 'earth' },
    { symbol: '♒', name: 'Acuario', longitude: 300, element: 'air' },
    { symbol: '♓', name: 'Piscis', longitude: 330, element: 'water' }
  ];
  
  // 🪐 Símbolos planetarios mejorados
  const planetSymbols: Record<string, { symbol: string; color: string }> = {
    'Sol': { symbol: '☉', color: '#FFD700' },
    'Luna': { symbol: '☽', color: '#C0C0C0' },
    'Mercurio': { symbol: '☿', color: '#FFA500' },
    'Venus': { symbol: '♀', color: '#FF69B4' },
    'Marte': { symbol: '♂', color: '#FF0000' },
    'Júpiter': { symbol: '♃', color: '#800080' },
    'Saturno': { symbol: '♄', color: '#4169E1' },
    'Urano': { symbol: '♅', color: '#00CED1' },
    'Neptuno': { symbol: '♆', color: '#4682B4' },
    'Plutón': { symbol: '♇', color: '#8B4513' },
    'Quirón': { symbol: '⚷', color: '#FF8C00' },
    'Nodo Norte': { symbol: '☊', color: '#32CD32' },
    'Nodo Sur': { symbol: '☋', color: '#ADFF2F' },
    'Lilith': { symbol: '⚸', color: '#696969' }
  };
  
  // 🎨 Colores para elementos
  const elementColors: Record<string, { primary: string; secondary: string; gradient: string }> = {
    'fire': { primary: '#FF4500', secondary: '#FF6347', gradient: 'url(#fireGradient)' },
    'earth': { primary: '#8B4513', secondary: '#CD853F', gradient: 'url(#earthGradient)' },
    'air': { primary: '#4169E1', secondary: '#6495ED', gradient: 'url(#airGradient)' },
    'water': { primary: '#1E90FF', secondary: '#87CEEB', gradient: 'url(#waterGradient)' }
  };

  // ⚡ Estilos de aspectos ULTRA VISIBLES
  const aspectStyles: Record<string, { color: string; width: number; opacity: number; pattern?: string }> = {
    'conjunción': { color: '#FFD700', width: 6, opacity: 1.0 },
    'conjunction': { color: '#FFD700', width: 6, opacity: 1.0 },
    'oposición': { color: '#FF0000', width: 5, opacity: 0.9 },
    'opposition': { color: '#FF0000', width: 5, opacity: 0.9 },
    'trígono': { color: '#00FF00', width: 4, opacity: 0.8 },
    'trine': { color: '#00FF00', width: 4, opacity: 0.8 },
    'cuadratura': { color: '#FF8C00', width: 4, opacity: 0.8 },
    'square': { color: '#FF8C00', width: 4, opacity: 0.8 },
    'sextil': { color: '#00BFFF', width: 3, opacity: 0.7, pattern: '8,4' },
    'sextile': { color: '#00BFFF', width: 3, opacity: 0.7, pattern: '8,4' },
    'quincunx': { color: '#FF69B4', width: 3, opacity: 0.6, pattern: '4,4' }
  };
  
  // 📐 Calcular posición desde longitud
  const getPositionFromLongitude = (longitude: number, radius: number) => {
    if (typeof longitude !== 'number' || isNaN(longitude) || !isFinite(longitude)) {
      console.warn('⚠️ Longitud inválida:', longitude);
      return { x: centerX, y: centerY };
    }

    // Ajustar para que 0° Aries esté en la posición de las 9 en punto
    const adjustedAngle = (longitude + 270) % 360;
    const angleInRadians = (adjustedAngle * Math.PI) / 180;
    
    const x = centerX + radius * Math.cos(angleInRadians);
    const y = centerY + radius * Math.sin(angleInRadians);
    
    if (isNaN(x) || isNaN(y)) {
      console.warn('⚠️ Posición calculada inválida:', { x, y, longitude, radius });
      return { x: centerX, y: centerY };
    }
    
    return { x, y };
  };

  // 🎯 Renderizar marcadores de grados
  const renderDegreeMarkers = () => {
    if (!showDegreeMarkers) return null;

    const markers = [];
    
    for (let degree = 0; degree < 360; degree += 10) {
      const innerPos = getPositionFromLongitude(degree, outerRadius * 0.92);
      const outerPos = getPositionFromLongitude(degree, outerRadius * 0.98);
      
      markers.push(
        <line
          key={`major-marker-${degree}`}
          x1={innerPos.x}
          y1={innerPos.y}
          x2={outerPos.x}
          y2={outerPos.y}
          stroke="#666"
          strokeWidth="1.5"
          opacity="0.7"
        />
      );
      
      if (degree % 30 === 0) {
        const textPos = getPositionFromLongitude(degree, outerRadius * 0.85);
        markers.push(
          <text
            key={`degree-text-${degree}`}
            x={textPos.x}
            y={textPos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fill="#888"
            fontWeight="500"
          >
            {degree}°
          </text>
        );
      }
    }
    
    return markers;
  };
  
  // 🏠 Renderizar líneas de casas
  const renderHouseLines = () => {
    if (!houses || houses.length === 0) return null;
    
    return houses.map((house, index) => {
      if (!house || typeof house.longitude !== 'number' || isNaN(house.longitude)) {
        console.warn('⚠️ Casa con longitud inválida:', house);
        return null;
      }

      const innerPos = getPositionFromLongitude(house.longitude, innerRadius);
      const outerPos = getPositionFromLongitude(house.longitude, outerRadius);
      
      return (
        <line
          key={`house-line-${index}`}
          x1={innerPos.x}
          y1={innerPos.y}
          x2={outerPos.x}
          y2={outerPos.y}
          stroke="#4A5568"
          strokeWidth="1.5"
          strokeDasharray="6 3"
          opacity="0.8"
        />
      );
    });
  };
  
  // 🔢 Renderizar números de casas
  const renderHouseNumbers = () => {
    if (!houses || houses.length === 0) return null;
    
    return houses.map((house, index) => {
      if (!house || typeof house.longitude !== 'number' || isNaN(house.longitude)) {
        return null;
      }

      const nextHouse = houses[(index + 1) % houses.length];
      const nextLongitude = nextHouse && typeof nextHouse.longitude === 'number' && !isNaN(nextHouse.longitude) 
        ? nextHouse.longitude 
        : house.longitude + 30;
      
      let midAngle = (house.longitude + nextLongitude) / 2;
      
      if (nextLongitude < house.longitude) {
        midAngle = ((house.longitude + nextLongitude + 360) / 2) % 360;
      }
      
      const position = getPositionFromLongitude(midAngle, middleRadius);
      
      return (
        <g key={`house-${index}`}>
          <circle
            cx={position.x}
            cy={position.y}
            r="16"
            fill="rgba(255,255,255,0.9)"
            stroke="#4A5568"
            strokeWidth="1"
            opacity="0.8"
          />
          <text
            x={position.x}
            y={position.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12"
            fill="#2D3748"
            fontWeight="bold"
          >
            {house.number}
          </text>
        </g>
      );
    });
  };
  
  // ♈ Renderizar símbolos del zodíaco
  const renderZodiacSigns = () => {
    return zodiacSymbols.map((zodiacSign, index) => {
      const position = getPositionFromLongitude(zodiacSign.longitude + 15, outerRadius * 1.05);
      const elementColor = elementColors[zodiacSign.element];
      
      return (
        <g key={`zodiac-${index}`}>
          <circle
            cx={position.x}
            cy={position.y}
            r="18"
            fill={elementColor.gradient}
            opacity="0.2"
          />
          <text
            x={position.x}
            y={position.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="18"
            fill={elementColor.primary}
            fontWeight="bold"
            style={{
              filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.3))',
              textShadow: '0 0 2px rgba(255,255,255,0.5)'
            }}
          >
            {zodiacSign.symbol}
          </text>
        </g>
      );
    });
  };
  
  // 🪐 Renderizar planetas
  const renderPlanets = () => {
    if (!planets || planets.length === 0) {
      console.warn('⚠️ No hay planetas para renderizar');
      return null;
    }
    
    console.log(`🪐 Renderizando ${planets.length} planetas`);
    
    return planets.map((planet, index) => {
      if (!planet || typeof planet.longitude !== 'number' || isNaN(planet.longitude)) {
        console.warn(`⚠️ Planeta ${index} con longitud inválida:`, planet);
        return null;
      }

      const position = getPositionFromLongitude(planet.longitude, planetRadius);
      const planetData = planetSymbols[planet.name] || { symbol: planet.name.charAt(0), color: '#666' };
      const isHovered = hoveredPlanet === planet.name;
      const scale = isHovered ? 1.3 : 1;
      
      return (
        <g 
          key={`planet-${index}`}
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setHoveredPlanet(planet.name)}
          onMouseLeave={() => setHoveredPlanet(null)}
        >
          {isHovered && (
            <circle
              cx={position.x}
              cy={position.y}
              r="20"
              fill={planetData.color}
              opacity="0.3"
              style={{
                filter: 'blur(3px)',
                animation: 'pulse 2s infinite'
              }}
            />
          )}
          
          <circle
            cx={position.x}
            cy={position.y}
            r={12 * scale}
            fill="rgba(255,255,255,0.95)"
            stroke={planetData.color}
            strokeWidth="2"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              transition: 'all 0.3s ease'
            }}
          />
          
          <text
            x={position.x}
            y={position.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={14 * scale}
            fill={planetData.color}
            fontWeight="bold"
            style={{
              transition: 'all 0.3s ease',
              textShadow: '0 0 2px rgba(255,255,255,0.8)'
            }}
          >
            {planetData.symbol}
          </text>
          
          {planet.retrograde && (
            <text
              x={position.x + 15}
              y={position.y - 10}
              fontSize="8"
              fill="#FF6B6B"
              fontWeight="bold"
            >
              ℞
            </text>
          )}
          
          {isHovered && (
            <g>
              <rect
                x={position.x + 20}
                y={position.y - 25}
                width="120"
                height="50"
                fill="rgba(0,0,0,0.9)"
                rx="5"
                ry="5"
              />
              <text
                x={position.x + 25}
                y={position.y - 10}
                fontSize="12"
                fill="white"
                fontWeight="bold"
              >
                {planet.name}
              </text>
              <text
                x={position.x + 25}
                y={position.y + 5}
                fontSize="10"
                fill="#FFD700"
              >
                {planet.sign} {planet.degree}°{planet.minutes}'
              </text>
              <text
                x={position.x + 25}
                y={position.y + 18}
                fontSize="9"
                fill="#87CEEB"
              >
                {planet.longitude.toFixed(2)}°
              </text>
            </g>
          )}
        </g>
      );
    });
  };

  // ⚡ Renderizar líneas de aspectos
  const renderAspectLines = () => {
    if (!showAspects || !aspects || aspects.length === 0) {
      return null;
    }

    console.log(`⚡ Renderizando ${aspects.length} aspectos`);

    return aspects.map((aspect, index) => {
      const planet1 = planets.find(p => p.name === aspect.planet1);
      const planet2 = planets.find(p => p.name === aspect.planet2);
      
      if (!planet1 || !planet2) {
        console.warn('⚠️ No se encontraron planetas para aspecto:', aspect);
        return null;
      }

      if (typeof planet1.longitude !== 'number' || isNaN(planet1.longitude) ||
          typeof planet2.longitude !== 'number' || isNaN(planet2.longitude)) {
        console.warn('⚠️ Longitudes inválidas en aspecto:', planet1.longitude, planet2.longitude);
        return null;
      }

      const pos1 = getPositionFromLongitude(planet1.longitude, planetRadius);
      const pos2 = getPositionFromLongitude(planet2.longitude, planetRadius);
      const style = aspectStyles[aspect.type] || aspectStyles['conjunción'];
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
            stroke="rgba(0,0,0,0.3)"
            strokeWidth={(style.width + 1) * (isHovered ? 1.5 : 1)}
            strokeDasharray={style.pattern || ''}
            opacity="0.5"
            style={{ pointerEvents: 'none' }}
          />
          
          {/* Línea principal */}
          <line
            x1={pos1.x}
            y1={pos1.y}
            x2={pos2.x}
            y2={pos2.y}
            stroke={style.color}
            strokeWidth={style.width * (isHovered ? 1.5 : 1)}
            strokeDasharray={style.pattern || ''}
            opacity={style.opacity * (isHovered ? 1.2 : 1)}
            style={{
              cursor: 'pointer',
              filter: isHovered ? `drop-shadow(0 0 6px ${style.color})` : `drop-shadow(0 0 2px ${style.color})`,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={() => handleAspectMouseEnter(aspectId)}
            onMouseLeave={() => handleAspectMouseLeave()}
          />
          
          {/* Tooltip para aspecto */}
          {isHovered && (
            <g>
              <rect
                x={(pos1.x + pos2.x) / 2 - 60}
                y={(pos1.y + pos2.y) / 2 - 30}
                width="120"
                height="60"
                fill="rgba(0,0,0,0.9)"
                rx="5"
                ry="5"
                stroke={style.color}
                strokeWidth="1"
              />
              <text
                x={(pos1.x + pos2.x) / 2}
                y={(pos1.y + pos2.y) / 2 - 15}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill="white"
                fontWeight="bold"
              >
                {aspect.type.toUpperCase()}
              </text>
              <text
                x={(pos1.x + pos2.x) / 2}
                y={(pos1.y + pos2.y) / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fill={style.color}
              >
                {aspect.planet1} ↔ {aspect.planet2}
              </text>
              <text
                x={(pos1.x + pos2.x) / 2}
                y={(pos1.y + pos2.y) / 2 + 15}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9"
                fill="#FFD700"
              >
                Orbe: {aspect.orb.toFixed(1)}°
              </text>
            </g>
          )}
        </g>
      );
    });
  };
  
  // 🧭 Renderizar Ascendente
  const renderAscendant = () => {
    if (!ascendant || typeof ascendant.longitude !== 'number' || isNaN(ascendant.longitude)) {
      console.warn('⚠️ Ascendente no disponible o inválido:', ascendant);
      return null;
    }
    
    const position = getPositionFromLongitude(ascendant.longitude, outerRadius * 1.12);
    
    return (
      <g>
        <circle
          cx={position.x}
          cy={position.y}
          r="10"
          fill="#FFD700"
          stroke="#FFA000"
          strokeWidth="2"
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}
        />
        <text
          x={position.x}
          y={position.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="8"
          fill="#FFA000"
          fontWeight="bold"
        >
          ASC
        </text>
        <text
          x={position.x}
          y={position.y + 25}
          textAnchor="middle"
          fontSize="10"
          fill="#FFA000"
          fontWeight="bold"
        >
          {ascendant.sign} {ascendant.degree}°
        </text>
      </g>
    );
  };
  
  // 🎯 Renderizar Medio Cielo
  const renderMidheaven = () => {
    if (!midheaven || typeof midheaven.longitude !== 'number' || isNaN(midheaven.longitude)) {
      console.warn('⚠️ Midheaven no disponible o inválido:', midheaven);
      return null;
    }
    
    const position = getPositionFromLongitude(midheaven.longitude, outerRadius * 1.12);
    
    return (
      <g>
        <circle
          cx={position.x}
          cy={position.y}
          r="10"
          fill="#E91E63"
          stroke="#C2185B"
          strokeWidth="2"
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}
        />
        <text
          x={position.x}
          y={position.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="8"
          fill="#C2185B"
          fontWeight="bold"
        >
          MC
        </text>
        <text
          x={position.x}
          y={position.y + 25}
          textAnchor="middle"
          fontSize="10"
          fill="#C2185B"
          fontWeight="bold"
        >
          {midheaven.sign} {midheaven.degree}°
        </text>
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Debug info mejorado - Solo en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="p-3 bg-blue-50 rounded-lg text-xs max-w-4xl border border-blue-200">
          <div className="font-bold text-blue-800 mb-2">🔍 Debug Info:</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-blue-700">
            <div>
              <div className="font-semibold">Planetas:</div>
              <div>{planets.length} total</div>
              <div>{planets.filter(p => p && typeof p.longitude === 'number' && !isNaN(p.longitude)).length} válidos</div>
            </div>
            <div>
              <div className="font-semibold">Casas:</div>
              <div>{houses.length} total</div>
              <div>{houses.filter(h => h && typeof h.longitude === 'number' && !isNaN(h.longitude)).length} válidas</div>
            </div>
            <div>
              <div className="font-semibold">Aspectos:</div>
              <div>{aspects.length} total</div>
              <div>Mostrar: {showAspects ? '✅' : '❌'}</div>
            </div>
            <div>
              <div className="font-semibold">Ángulos:</div>
              <div>ASC: {ascendant ? `${ascendant.sign} ${ascendant.degree}°` : '❌'}</div>
              <div>MC: {midheaven ? `${midheaven.sign} ${midheaven.degree}°` : '❌'}</div>
            </div>
          </div>
        </div>
      )}
      
      <svg 
        width={width} 
        height={height} 
        className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-2xl border border-purple-200/50"
        style={{
          filter: 'drop-shadow(0 8px 25px rgba(0,0,0,0.15))'
        }}
      >
        <defs>
          <radialGradient id="fireGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE0B2" />
            <stop offset="100%" stopColor="#FF5722" />
          </radialGradient>
          <radialGradient id="earthGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E8F5E8" />
            <stop offset="100%" stopColor="#8B4513" />
          </radialGradient>
          <radialGradient id="airGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E3F2FD" />
            <stop offset="100%" stopColor="#4169E1" />
          </radialGradient>
          <radialGradient id="waterGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E1F5FE" />
            <stop offset="100%" stopColor="#1E90FF" />
          </radialGradient>
          <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#F8F9FA" />
            <stop offset="100%" stopColor="#E9ECEF" />
          </radialGradient>
        </defs>

        {/* Círculos base */}
        <circle
          cx={centerX}
          cy={centerY}
          r={outerRadius + 20}
          fill="url(#centerGradient)"
          opacity="0.3"
        />
        
        <circle
          cx={centerX}
          cy={centerY}
          r={outerRadius}
          fill="none"
          stroke="#4169E1"
          strokeWidth="3"
          opacity="0.8"
        />
        
        <circle
          cx={centerX}
          cy={centerY}
          r={middleRadius}
          fill="none"
          stroke="#718096"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.6"
        />
        
        <circle
          cx={centerX}
          cy={centerY}
          r={innerRadius}
          fill="rgba(255,255,255,0.1)"
          stroke="#A0AEC0"
          strokeWidth="2"
          opacity="0.8"
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
              stroke="#CBD5E0"
              strokeWidth="1.5"
              opacity="0.7"
            />
          );
        })}
        
        {/* Símbolos zodiacales */}
        {renderZodiacSigns()}
        
        {/* Líneas de casas */}
        {renderHouseLines()}
        
        {/* Números de casas */}
        {renderHouseNumbers()}
        
        {/* ASPECTOS - Renderizar primero (detrás de los planetas) */}
        {renderAspectLines()}
        
        {/* PLANETAS - Encima de los aspectos */}
        {renderPlanets()}
        
        {/* Ascendente */}
        {renderAscendant()}
        
        {/* Medio Cielo */}
        {renderMidheaven()}
        
        {/* Centro */}
        <circle
          cx={centerX}
          cy={centerY}
          r="6"
          fill="url(#centerGradient)"
          stroke="#4A5568"
          strokeWidth="2"
        />
      </svg>
     
      {/* Panel de información mejorado */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-200/50 max-w-4xl">
        <h3 className="font-bold mb-4 text-gray-800 text-center">📊 Información de la Carta Natal</h3>
        
        {/* Información del planeta seleccionado */}
        {hoveredPlanet && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
              <span className="mr-2">{planetSymbols[hoveredPlanet]?.symbol || ''}</span>
              {hoveredPlanet}
            </h4>
            {(() => {
              const planet = planets.find(p => p.name === hoveredPlanet);
              if (planet) {
                return (
                  <div className="text-sm text-blue-700 grid grid-cols-2 gap-4">
                    <div>
                      <p><strong>Signo:</strong> {planet.sign}</p>
                      <p><strong>Posición:</strong> {planet.degree}°{planet.minutes}'</p>
                      <p><strong>Longitud:</strong> {planet.longitude.toFixed(2)}°</p>
                    </div>
                    <div>
                      {planet.retrograde && <p><strong>Estado:</strong> <span className="text-red-600">Retrógrado ℞</span></p>}
                      <p><strong>Casa:</strong> {planet.housePosition || 'N/A'}</p>
                      <p><strong>Elemento:</strong> {
                        ['Aries', 'Leo', 'Sagitario'].includes(planet.sign) ? '🔥 Fuego' :
                        ['Tauro', 'Virgo', 'Capricornio'].includes(planet.sign) ? '🌍 Tierra' :
                        ['Géminis', 'Libra', 'Acuario'].includes(planet.sign) ? '💨 Aire' :
                        '💧 Agua'
                      }</p>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}
        
        {/* Información del aspecto hovereado */}
        {hoveredAspect && (
          <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">
              Aspecto: {hoveredAspect.split('-')[2].toUpperCase()}
            </h4>
            <p className="text-sm text-purple-700">
              <strong>Entre:</strong> {hoveredAspect.split('-')[0]} y {hoveredAspect.split('-')[1]}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              {
                hoveredAspect.includes('conjunción') || hoveredAspect.includes('conjunction') ? 'Unión y fusión de energías planetarias' :
                hoveredAspect.includes('oposición') || hoveredAspect.includes('opposition') ? 'Tensión y polaridad que requiere equilibrio' :
                hoveredAspect.includes('trígono') || hoveredAspect.includes('trine') ? 'Flujo armonioso y talento natural' :
                hoveredAspect.includes('cuadratura') || hoveredAspect.includes('square') ? 'Desafío y motivación para el crecimiento' :
                hoveredAspect.includes('sextil') || hoveredAspect.includes('sextile') ? 'Oportunidad y cooperación fácil' :
                'Ajuste y reorientación necesaria'
              }
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Elementos */}
          <div>
            <h4 className="font-semibold mb-3 text-gray-700">🌟 Elementos</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded mr-3" style={{ background: elementColors.fire.gradient }}></div>
                <span>Fuego (♈♌♐)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded mr-3" style={{ background: elementColors.earth.gradient }}></div>
                <span>Tierra (♉♍♑)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded mr-3" style={{ background: elementColors.air.gradient }}></div>
                <span>Aire (♊♎♒)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded mr-3" style={{ background: elementColors.water.gradient }}></div>
                <span>Agua (♋♏♓)</span>
              </div>
            </div>
          </div>
          
          {/* Aspectos */}
          <div>
            <h4 className="font-semibold mb-3 text-gray-700">⚡ Aspectos ({aspects.length})</h4>
            <div className="space-y-2 text-sm">
              {Object.entries(aspectStyles).slice(0, 6).map(([aspect, style]) => (
                <div key={aspect} className="flex items-center">
                  <div 
                    className="w-6 h-1 mr-3 rounded"
                    style={{ 
                      backgroundColor: style.color,
                      height: `${style.width}px`,
                      opacity: style.opacity
                    }}
                  ></div>
                  <span className="capitalize">{aspect}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Ángulos importantes */}
          <div>
            <h4 className="font-semibold mb-3 text-gray-700">🎯 Ángulos Importantes</h4>
            <div className="space-y-2 text-xs">
              {ascendant && (
                <p><strong className="text-yellow-600">ASC:</strong> {ascendant.sign} {ascendant.degree}°{ascendant.minutes}' 
                  <br/><span className="text-gray-500">({ascendant.longitude ? ascendant.longitude.toFixed(2) : 'N/A'}°)</span>
                </p>
              )}
              {midheaven && (
                <p><strong className="text-pink-600">MC:</strong> {midheaven.sign} {midheaven.degree}°{midheaven.minutes}'
                  <br/><span className="text-gray-500">({midheaven.longitude ? midheaven.longitude.toFixed(2) : 'N/A'}°)</span>
                </p>
              )}
              <p><strong className="text-red-600">℞:</strong> Retrogradación</p>
              <p><strong>Números:</strong> Casas astrológicas (1-12)</p>
              <p><strong>Líneas punteadas:</strong> Divisiones de casas</p>
              <p><strong>Interacción:</strong> Hover sobre elementos</p>
            </div>
          </div>
        </div>
        
        {/* Estadísticas mejoradas */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-sm">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="font-bold text-blue-800">{planets.length}</div>
              <div className="text-blue-600">Planetas</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="font-bold text-green-800">{houses.length}</div>
              <div className="text-green-600">Casas</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="font-bold text-purple-800">{aspects.length}</div>
              <div className="text-purple-600">Aspectos</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="font-bold text-red-800">{planets.filter(p => p.retrograde).length}</div>
              <div className="text-red-600">Retrógrados</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="font-bold text-yellow-800">
                {ascendant && midheaven ? '✅' : '⚠️'}
              </div>
              <div className="text-yellow-600">Ángulos</div>
            </div>
          </div>
        </div>
        
        {/* Estado de la carta */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-center items-center space-x-4 text-sm">
            <button 
              onClick={() => {
                setHoveredPlanet(null);
                setHoveredAspect(null);
              }}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Limpiar selección
            </button>
            <div className="flex items-center text-gray-600">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Carta natal activa e interactiva
            </div>
            {ascendant && (
              <div className="text-xs text-green-600 font-semibold">
                ✅ ASC: {ascendant.sign}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NatalChartWheel;