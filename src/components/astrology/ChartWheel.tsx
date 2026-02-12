import React from 'react';
import { getCirclePosition } from '../../services/chartCalculationsService';
import { Planet, Aspect, House } from '../../types/astrology/chartDisplay';
import { PLANET_SYMBOLS, PLANET_COLORS, SIGN_SYMBOLS } from '../../constants/astrology/chartConstants';

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
  isPrint?: boolean;
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
  handleMouseMove,
  isPrint = false
}) => {
  // Colores adaptados según modo (print=fondo blanco, web=fondo oscuro)
  const colors = isPrint ? {
    circleStroke: 'rgba(100,100,120,0.3)',
    circleStrokeBold: 'rgba(80,80,100,0.5)',
    houseLine: 'rgba(100,100,120,0.3)',
    houseBg: 'rgba(230,230,240,0.8)',
    houseStroke: 'rgba(100,100,120,0.5)',
    houseText: 'rgba(60,60,80,0.9)',
    signColor: '#6b21a8',
    signSubColor: 'rgba(107,33,168,0.7)',
    planetBg: '#fff',
    planetStroke: 'rgba(100,100,120,0.4)',
    centerFill: '#fbbf24',
  } : {
    circleStroke: 'rgba(255,255,255,0.2)',
    circleStrokeBold: 'rgba(255,255,255,0.3)',
    houseLine: 'rgba(255,255,255,0.3)',
    houseBg: 'rgba(0,0,0,0.3)',
    houseStroke: 'rgba(255,255,255,0.4)',
    houseText: 'rgba(255,255,255,0.9)',
    signColor: '#fbbf24',
    signSubColor: 'rgba(251,191,36,0.9)',
    planetBg: '#fff',
    planetStroke: 'rgba(255,255,255,0.3)',
    centerFill: '#fbbf24',
  };

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
      const opacity = isPrint
        ? (aspect.exact ? 0.8 : aspect.orb < 2 ? 0.6 : 0.4)
        : (aspect.exact ? 0.9 : aspect.orb < 2 ? 0.7 : 0.5);

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
            className={isPrint ? '' : 'transition-all duration-200 cursor-pointer'}
            onMouseEnter={isPrint ? undefined : (e) => {
              setHoveredAspect(aspectKey);
              handleMouseMove(e);
            }}
            onMouseMove={isPrint ? undefined : handleMouseMove}
            onMouseLeave={isPrint ? undefined : () => setHoveredAspect(null)}
          />
        </g>
      );
    });
  };

  // Render planets with proper symbols
  const renderPlanets = () => {
    return planets.map((planet, index) => {
      if (!planet || !planet.name) return null;

      const position = getCirclePosition(planet.position!, 190);
      const symbol = PLANET_SYMBOLS[planet.name] || planet.name.charAt(0);
      const planetColor = PLANET_COLORS[planet.name] || '#888';
      const isHovered = hoveredPlanet === planet.name;

      return (
        <g key={index}>
          <circle
            cx={position.x}
            cy={position.y}
            r={isHovered ? 15 : 12}
            fill={isPrint ? planetColor : colors.planetBg}
            stroke={isPrint ? 'rgba(60,60,80,0.6)' : (isHovered ? "rgba(255,255,255,0.8)" : colors.planetStroke)}
            strokeWidth={isHovered ? 2 : 1}
            className={isPrint ? '' : 'cursor-pointer transition-all duration-200'}
            onMouseEnter={isPrint ? undefined : (e) => {
              setHoveredPlanet(planet.name);
              handleMouseMove(e);
            }}
            onMouseMove={isPrint ? undefined : handleMouseMove}
            onMouseLeave={isPrint ? undefined : () => setHoveredPlanet(null)}
          />
          <text
            x={position.x}
            y={position.y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={isPrint ? '#fff' : 'black'}
            fontSize="13"
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
          stroke={colors.houseLine}
          strokeWidth="1"
        />
      );

      houseLabels.push(
        <g key={`house-label-${i}`}>
          <circle
            cx={labelPos.x}
            cy={labelPos.y}
            r="16"
            fill={colors.houseBg}
            stroke={colors.houseStroke}
            strokeWidth="1"
            className={isPrint ? '' : 'cursor-pointer transition-all duration-200'}
            onMouseEnter={isPrint ? undefined : (e) => {
              setHoveredHouse(houseNumber);
              handleMouseMove(e);
            }}
            onMouseMove={isPrint ? undefined : handleMouseMove}
            onMouseLeave={isPrint ? undefined : () => setHoveredHouse(null)}
          />
          <text
            x={labelPos.x}
            y={labelPos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={colors.houseText}
            fontSize="14"
            fontWeight="bold"
            className="pointer-events-none"
          >
            {houseNumber}
          </text>
        </g>
      );
    }

    return [...houseLines, ...houseLabels];
  };

  // Render zodiac signs with proper symbols
  const renderSigns = () => {
    const signs = [
      'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
      'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
    ];

    return signs.map((sign, index) => {
      const angle = index * 30;
      const symbolPosition = getCirclePosition(angle + 15, 265);
      const textPosition = getCirclePosition(angle + 15, 288);
      const symbol = SIGN_SYMBOLS[sign] || sign.charAt(0);

      return (
        <g key={index}>
          <text
            x={symbolPosition.x}
            y={symbolPosition.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={colors.signColor}
            fontSize="18"
            fontWeight="bold"
          >
            {symbol}
          </text>
          {!isPrint && (
            <text
              x={textPosition.x}
              y={textPosition.y}
              textAnchor="middle"
              fill={colors.signSubColor}
              fontSize="10"
              style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}
            >
              {sign}
            </text>
          )}
        </g>
      );
    });
  };

  const svgClassName = isPrint
    ? 'rounded-full'
    : 'border border-white/20 rounded-full bg-gradient-to-br from-indigo-950/50 via-purple-900/30 to-black/50 backdrop-blur-sm';

  return (
    <svg
      width="600"
      height="600"
      viewBox="0 0 500 500"
      className={svgClassName}
      style={isPrint ? { background: 'radial-gradient(circle, #f0f0f8 0%, #e8e8f0 50%, #d8d8e8 100%)' } : undefined}
    >
      <circle cx="250" cy="250" r="130" fill="none" stroke={colors.circleStroke} strokeWidth="1" />
      <circle cx="250" cy="250" r="170" fill="none" stroke={colors.circleStrokeBold} strokeWidth="2" />
      <circle cx="250" cy="250" r="190" fill="none" stroke={colors.circleStroke} strokeWidth="1" />
      <circle cx="250" cy="250" r="220" fill="none" stroke={colors.circleStrokeBold} strokeWidth="2" />
      <circle cx="250" cy="250" r="240" fill="none" stroke={colors.circleStroke} strokeWidth="1" />

      {renderAspectLines()}
      {renderHouses()}
      {renderSigns()}
      {renderPlanets()}

      <circle cx="250" cy="250" r="8" fill={colors.centerFill} className={isPrint ? '' : 'animate-pulse'} />
      <text x="250" y="255" textAnchor="middle" dominantBaseline="middle" fill="black" fontSize="10" fontWeight="bold">
        ☉
      </text>
    </svg>
  );
};

export default ChartWheel;
