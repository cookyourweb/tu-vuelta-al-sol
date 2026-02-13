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
  // Colores adaptados según modo (print=fondo morado igual que web, web=fondo oscuro)
  const colors = isPrint ? {
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
    labelColor: 'rgba(255,255,255,0.85)',
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
    labelColor: 'rgba(255,255,255,0.85)',
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

      // Calcular posición de la etiqueta (fuera del círculo del planeta)
      const labelPos = getCirclePosition(planet.position!, 155);

      return (
        <g key={index}>
          <circle
            cx={position.x}
            cy={position.y}
            r={isHovered ? 15 : 12}
            fill={planetColor}
            stroke={isHovered ? "rgba(255,255,255,0.8)" : colors.planetStroke}
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
            fill="#fff"
            fontSize="13"
            fontWeight="bold"
            className="pointer-events-none"
          >
            {symbol}
          </text>

          {/* Etiqueta con nombre, grado y signo */}
          {isPrint && planet.sign && (
            <g className="pointer-events-none">
              <text
                x={labelPos.x}
                y={labelPos.y - 6}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={colors.labelColor}
                fontSize="7"
                fontWeight="bold"
              >
                {planet.name}
              </text>
              <text
                x={labelPos.x}
                y={labelPos.y + 3}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={colors.labelColor}
                fontSize="6"
              >
                {planet.degree !== undefined ? `${Math.round(planet.degree * 100) / 100}°` : ''} {planet.sign}
              </text>
              {planet.retrograde && (
                <text
                  x={position.x + 14}
                  y={position.y - 10}
                  textAnchor="middle"
                  fill="#ef4444"
                  fontSize="8"
                  fontWeight="bold"
                >
                  R
                </text>
              )}
            </g>
          )}
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
          <text
            x={textPosition.x}
            y={textPosition.y}
            textAnchor="middle"
            fill={colors.signSubColor}
            fontSize={isPrint ? "8" : "10"}
            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}
          >
            {sign}
          </text>
        </g>
      );
    });
  };

  // Render ángulos (ASC, MC, DSC, IC) - solo en modo print
  const renderAngles = () => {
    if (!isPrint || houses.length < 10) return null;

    const angles = [
      { name: 'ASC', fullName: 'Ascendente', houseIdx: 0, color: '#22c55e' },
      { name: 'IC', fullName: 'Fondo Cielo', houseIdx: 3, color: '#f59e0b' },
      { name: 'DSC', fullName: 'Descendente', houseIdx: 6, color: '#ef4444' },
      { name: 'MC', fullName: 'Medio Cielo', houseIdx: 9, color: '#3b82f6' },
    ];

    return angles.map((angle) => {
      const house = houses[angle.houseIdx];
      if (!house) return null;

      // Posición del ángulo en el borde exterior del chart
      const houseAngle = angle.houseIdx * 30;
      const pos = getCirclePosition(houseAngle, 230);
      const labelPos = getCirclePosition(houseAngle, 205);

      return (
        <g key={angle.name}>
          {/* Círculo del ángulo */}
          <circle
            cx={pos.x}
            cy={pos.y}
            r="10"
            fill={angle.color}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.5"
          />
          <text
            x={pos.x}
            y={pos.y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="7"
            fontWeight="bold"
            className="pointer-events-none"
          >
            {angle.name}
          </text>

          {/* Etiqueta con nombre completo y signo */}
          <text
            x={labelPos.x}
            y={labelPos.y - 5}
            textAnchor="middle"
            fill={angle.color}
            fontSize="6"
            fontWeight="bold"
          >
            {angle.fullName}
          </text>
          <text
            x={labelPos.x}
            y={labelPos.y + 3}
            textAnchor="middle"
            fill={colors.labelColor}
            fontSize="5.5"
          >
            {house.degree ? `${Math.round(house.degree)}°` : ''} {house.sign}
          </text>
        </g>
      );
    });
  };

  const svgClassName = isPrint
    ? 'rounded-full'
    : 'border border-white/20 rounded-full bg-gradient-to-br from-indigo-950/50 via-purple-900/30 to-black/50 backdrop-blur-sm';

  return (
    <svg
      width={isPrint ? "100%" : "600"}
      height={isPrint ? "100%" : "600"}
      viewBox="0 0 500 500"
      className={svgClassName}
      style={isPrint ? { background: 'radial-gradient(circle, #2e1065 0%, #1e1b4b 50%, #0f0a2a 100%)' } : undefined}
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
      {renderAngles()}

      <circle cx="250" cy="250" r="8" fill={colors.centerFill} className={isPrint ? '' : 'animate-pulse'} />
      <text x="250" y="255" textAnchor="middle" dominantBaseline="middle" fill="black" fontSize="10" fontWeight="bold">
        ☉
      </text>
    </svg>
  );
};

export default ChartWheel;
