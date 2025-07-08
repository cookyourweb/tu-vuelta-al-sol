// src/services/astrology/chartRenderingService.ts
// Servicio especializado para renderizado de elementos SVG de la carta - TIPOS CORREGIDOS

import React from 'react';
import type { JSX } from 'react';
import type { 
  CalculatedAspect, 
  CirclePosition, 
  Planet, 
  SelectedAspectTypes 
} from '@/types/astrology/chartDisplay';
import { PLANET_COLORS, PLANET_SYMBOLS, SIGN_SYMBOLS } from '@/constants/astrology/chartConstants';

export class ChartRenderingService {
  
  /**
   * Calcula la posición de un elemento en el círculo
   */
  static getCirclePosition(angle: number, radius: number): CirclePosition {
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: 250 + Math.cos(radian) * radius,
      y: 250 + Math.sin(radian) * radius
    };
  }

  /**
   * Renderiza las líneas de aspectos entre planetas
   */
  static renderAspectLines(
    aspects: CalculatedAspect[],
    planets: Planet[],
    selectedTypes: SelectedAspectTypes,
    showAspects: boolean,
    hoveredAspect: string | null,
    onAspectHover: (aspectKey: string | null, event?: React.MouseEvent) => void
  ): JSX.Element | null {
    
    if (!showAspects || aspects.length === 0) return null;

    return (
      <g key="aspect-lines">
        {aspects.map((aspect: CalculatedAspect, index: number) => {
          const planet1 = planets.find((p: Planet) => p?.name === aspect.planet1);
          const planet2 = planets.find((p: Planet) => p?.name === aspect.planet2);
          
          if (!planet1 || !planet2) return null;

          const isHard = aspect.config.difficulty === 'hard';
          const isEasy = aspect.config.difficulty === 'easy';
          const isMajor = ['conjunction', 'sextile', 'square', 'trine', 'opposition'].includes(aspect.type);
          const isMinor = !isMajor;

          // Filtros de visibilidad
          if (!selectedTypes.hard && isHard) return null;
          if (!selectedTypes.easy && isEasy) return null;
          if (!selectedTypes.major && isMajor) return null;
          if (!selectedTypes.minor && isMinor) return null;

          const pos1 = this.getCirclePosition(planet1.position || 0, 170);
          const pos2 = this.getCirclePosition(planet2.position || 0, 170);
          
          const strokeWidth = aspect.exact ? 3 : aspect.orb < 2 ? 2 : 1;
          const opacity = aspect.exact ? 0.9 : aspect.orb < 2 ? 0.7 : 0.5;
          
          const aspectKey = `${aspect.planet1}-${aspect.planet2}-${aspect.type}`;
          const isHovered = hoveredAspect === aspectKey;

          return (
            <line
              key={index}
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke={aspect.config.color}
              strokeWidth={isHovered ? strokeWidth + 1 : strokeWidth}
              opacity={isHovered ? 1 : opacity}
              strokeDasharray={isMinor ? "3,3" : "none"}
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={(e) => onAspectHover(aspectKey, e)}
              onMouseLeave={() => onAspectHover(null)}
            />
          );
        })}
      </g>
    );
  }

  /**
   * Renderiza los planetas en sus posiciones
   */
  static renderPlanets(
    planets: Planet[],
    hoveredPlanet: string | null,
    onPlanetHover: (planet: string | null, event?: React.MouseEvent) => void
  ): JSX.Element[] {
    
    return planets
      .filter((planet: Planet) => planet && planet.name)
      .map((planet: Planet, index: number) => {
        const position = this.getCirclePosition(planet.position || 0, 190);
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
              onMouseEnter={(e) => onPlanetHover(planet.name, e)}
              onMouseLeave={() => onPlanetHover(null)}
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
  }

  /**
   * Renderiza las líneas y números de las casas
   */
  static renderHouses(
    hoveredHouse: number | null,
    onHouseHover: (house: number | null, event?: React.MouseEvent) => void
  ): JSX.Element[] {
    
    const houseElements: JSX.Element[] = [];
    
    for (let i = 0; i < 12; i++) {
      const angle = i * 30;
      const startPos = this.getCirclePosition(angle, 130);
      const endPos = this.getCirclePosition(angle, 240);
      const labelPos = this.getCirclePosition(angle + 15, 115);
      const houseNumber = i + 1;
      
      // Línea de la casa
      houseElements.push(
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
      
      // Etiqueta de la casa
      houseElements.push(
        <g key={`house-label-${i}`}>
          <circle
            cx={labelPos.x}
            cy={labelPos.y}
            r="16"
            fill="rgba(0,0,0,0.3)"
            stroke={hoveredHouse === houseNumber ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)"}
            strokeWidth="1"
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => onHouseHover(houseNumber, e)}
            onMouseLeave={() => onHouseHover(null)}
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
    
    return houseElements;
  }

  /**
   * Renderiza los símbolos de signos zodiacales
   */
  static renderSigns(): JSX.Element[] {
    const signs = [
      'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
      'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
    ];
    
    return signs.map((sign, index) => {
      const angle = index * 30;
      const symbolPosition = this.getCirclePosition(angle + 15, 270);
      const textPosition = this.getCirclePosition(angle + 15, 290);
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
  }

  /**
   * Renderiza ángulos importantes (Ascendente y Medio Cielo)
   */
  static renderAngles(
    ascendant?: { longitude?: number; sign?: string; degree?: number },
    midheaven?: { longitude?: number; sign?: string; degree?: number },
    onAngleHover?: (angle: string | null, event?: React.MouseEvent) => void
  ): JSX.Element[] {
    
    const angles: JSX.Element[] = [];
    
    // Renderizar Ascendente
    if (ascendant && ascendant.sign) {
      const ascPosition = this.convertAstrologicalDegreeToPosition(
        ascendant.degree || 0, 
        ascendant.sign
      );
      const position = this.getCirclePosition(ascPosition, 220);
      
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
            onMouseEnter={(e) => onAngleHover?.('Ascendente', e)}
            onMouseLeave={() => onAngleHover?.(null)}
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
    
    // Renderizar Medio Cielo
    if (midheaven && midheaven.sign) {
      const mcPosition = this.convertAstrologicalDegreeToPosition(
        midheaven.degree || 0, 
        midheaven.sign
      );
      const position = this.getCirclePosition(mcPosition, 215);
      
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
            onMouseEnter={(e) => onAngleHover?.('Medio Cielo', e)}
            onMouseLeave={() => onAngleHover?.(null)}
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
  }

  /**
   * Convierte grados astrológicos a posición en el círculo
   */
  private static convertAstrologicalDegreeToPosition(degree: number, sign: string): number {
    const signPositions: { [key: string]: number } = {
      'Aries': 0, 'Tauro': 30, 'Géminis': 60, 'Cáncer': 90,
      'Leo': 120, 'Virgo': 150, 'Libra': 180, 'Escorpio': 210,
      'Sagitario': 240, 'Capricornio': 270, 'Acuario': 300, 'Piscis': 330
    };

    const signBase = signPositions[sign] || 0;
    return signBase + degree;
  }

  /**
   * Renderiza círculos base de la carta
   */
  static renderBaseCircles(): JSX.Element[] {
    return [
      <circle key="circle-1" cx="250" cy="250" r="130" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />,
      <circle key="circle-2" cx="250" cy="250" r="170" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />,
      <circle key="circle-3" cx="250" cy="250" r="190" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />,
      <circle key="circle-4" cx="250" cy="250" r="220" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />,
      <circle key="circle-5" cx="250" cy="250" r="240" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />,
      <circle key="center" cx="250" cy="250" r="8" fill="#fbbf24" className="animate-pulse" />,
      <text key="center-symbol" x="250" y="255" textAnchor="middle" dominantBaseline="middle" fill="black" fontSize="10" fontWeight="bold">☉</text>
    ];
  }
}