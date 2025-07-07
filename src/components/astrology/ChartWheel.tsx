import React from 'react';
import { getCirclePosition } from '../../services/chartCalculationsService';
import { Planet, Aspect, House } from '../../types/astrology/chartDisplay';

interface ChartWheelProps {
  planets: Planet[];
  houses: House[];
  calculatedAspects: (Aspect & { config: { color: string; difficulty: string; }; exact: boolean })[];
  showAspects: boolean;
  selectedAspectTypes: { major: boolean; minor: boolean; hard: boolean; easy: boolean };
  hoveredAspect: string | null;
  setHoveredAspect: (aspect: string | null) => void;
  hoveredPlanet: string | null;
  setHoveredPlanet: (planet: string | null) => void;
  hoveredHouse: number | null;
  setHoveredHouse: (house: number | null) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
}

const ChartWheel: React.FC<ChartWheelProps> = ({
  planets,
  houses,
  calculatedAspects,
  showAspects,
  selectedAspectTypes,
  hoveredAspect,
  setHoveredAspect,
  hoveredPlanet,
  setHoveredPlanet,
  hoveredHouse,
  setHoveredHouse,
  handleMouseMove
}) => {
  // Render aspect lines
  const renderAspectLines = () => {
    if (!showAspects || calculatedAspects.length === 0) return null;

    return calculatedAspects.map((aspect, index) => {
      const planet1 = planets.find(p => p?.name === aspect.planet1);
      const planet2 = planets.find(p => p?.name === aspect.planet2);
      
      if (!planet1 || !planet2) return null;

      const isHard = aspect.config.difficulty === 'hard';
      const isEasy = aspect.config.difficulty === 'easy';
      const isMajor = ['conjunction', 'sextile', 'square', 'trine', 'opposition'].includes(aspect.type);
      const isMinor = !isMajor;

      if (!selectedAspectTypes.hard && isHard) return null;
      if (!selectedAspectTypes.easy && isEasy) return null;
      if (!selectedAspectTypes.major && isMajor) return null;
      if (!selectedAspectTypes.minor && isMinor) return null;

      const pos1 = getCirclePosition(planet1.position!, 170);
      const pos2 = getCirclePosition(planet2.position!, 170);
      
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
            stroke={aspect.config.color}
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

  // Render planets
  const renderPlanets = () => {
    return planets.map((planet, index) => {
      if (!planet || !planet.name) return null;

      const position = getCirclePosition(planet.position!, 190);
      const symbol = planet.name.charAt(0); // Simplified, can import symbols if needed
      const isHovered = hoveredPlanet === planet.name;
      
      return (
        <g key={index}>
          <circle
            cx={position.x}
            cy={position.y}
            r={isHovered ? 15 : 12}
            fill="#fff"
            stroke={isHovered ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)"}
            strokeWidth={isHovered ? 2 : 1}
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
        </g>
      );
    });
  };

  // Render houses
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
            stroke="rgba(255,255,255,0.4)"
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

  // Render signs
  const renderSigns = () => {
    const signs = [
      'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
      'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
    ];
    
    return signs.map((sign, index) => {
      const angle = index * 30;
      const symbolPosition = getCirclePosition(angle + 15, 270);
      const textPosition = getCirclePosition(angle + 15, 290);
      const symbol = sign.charAt(0); // Simplified, can import symbols if needed
      
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

  // Render angles (Ascendant, Midheaven) - simplified here, can be extended
  const renderAngles = () => {
    // Implementation omitted for brevity, can be added similarly
    return null;
  };

  return (
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
  );
};

export default ChartWheel;
