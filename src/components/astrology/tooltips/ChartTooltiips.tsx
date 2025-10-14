// src/components/astrology/tooltips/ChartTooltips.tsx
// Componente especializado para todos los tooltips de la carta

import React from 'react';
import type { 
  CalculatedAspect, 
  Planet, 
  TooltipPosition 
} from '../../../types/astrology/chartDisplay';
import { 
  PLANET_SYMBOLS, 
  planetMeanings, 
  signMeanings, 
  houseMeanings, 
  aspectMeanings 
} from '../../../constants/astrology/chartConstants';

interface ChartTooltipsProps {
  // Estados de hover
  hoveredPlanet: string | null;
  hoveredAspect: string | null;
  hoveredHouse: number | null;
  hoveredNavGuide: boolean;
  
  // Datos
  planets: Planet[];
  calculatedAspects: CalculatedAspect[];
  ascendant?: { longitude?: number; sign?: string; degree?: number };
  midheaven?: { longitude?: number; sign?: string; degree?: number };
  
  // Posición
  tooltipPosition: TooltipPosition;
}

const ChartTooltips: React.FC<ChartTooltipsProps> = ({
  hoveredPlanet,
  hoveredAspect,
  hoveredHouse,
  hoveredNavGuide,
  planets,
  calculatedAspects,
  ascendant,
  midheaven,
  tooltipPosition
}) => {

  // =============================================================================
  // FUNCIONES DE INTERPRETACIÓN
  // =============================================================================

  const getPersonalizedPlanetInterpretation = (planet: Planet): string => {
    const planetName = planet.name;
    const sign = planet.sign;
    const house = planet.house;

    return `Con ${planetName} en ${sign} en Casa ${house}, ${planetMeanings[planetName as keyof typeof planetMeanings]?.meaning.toLowerCase()} se manifiesta con las cualidades de ${signMeanings[sign as keyof typeof signMeanings]?.toLowerCase()} en el área de ${houseMeanings[house as keyof typeof houseMeanings]?.meaning.toLowerCase()}`;
  };

  const getPersonalizedAspectInterpretation = (aspect: CalculatedAspect): string => {
    const planet1Name = aspect.planet1;
    const planet2Name = aspect.planet2;
    const aspectType = aspect.type;

    const planet1Desc = planetMeanings[planet1Name as keyof typeof planetMeanings]?.keywords.split(',')[0]?.trim() || planet1Name;
    const planet2Desc = planetMeanings[planet2Name as keyof typeof planetMeanings]?.keywords.split(',')[0]?.trim() || planet2Name;

    if (aspectType === 'conjunction') {
      return `Fusión de ${planet1Name} (${planet1Desc}) y ${planet2Name} (${planet2Desc}). Los planetas trabajan como uno solo. Esto significa que tu ${planet1Desc.toLowerCase()} se fusiona con tu ${planet2Desc.toLowerCase()}, creando una energía unificada y potente.`;
    } else if (aspectType === 'opposition') {
      return `Polarización entre ${planet1Name} (${planet1Desc}) y ${planet2Name} (${planet2Desc}). Necesitas encontrar equilibrio entre estas dos energías opuestas en tu vida.`;
    } else if (aspectType === 'trine') {
      return `Armonía natural entre ${planet1Name} (${planet1Desc}) y ${planet2Name} (${planet2Desc}). Las energías fluyen sin esfuerzo, creando talento natural en la combinación de estas cualidades.`;
    } else if (aspectType === 'square') {
      return `Tensión creativa entre ${planet1Name} (${planet1Desc}) y ${planet2Name} (${planet2Desc}). Esta fricción genera crecimiento y te impulsa a integrar ambas energías de forma constructiva.`;
    } else if (aspectType === 'sextile') {
      return `Oportunidad entre ${planet1Name} (${planet1Desc}) y ${planet2Name} (${planet2Desc}). Tienes facilidad para combinar estas energías cuando te lo propones conscientemente.`;
    }

    return `${aspectMeanings[aspectType as keyof typeof aspectMeanings]?.meaning || ''} entre ${planet1Name} y ${planet2Name}.`;
  };

  // =============================================================================
  // ESTILOS COMPARTIDOS
  // =============================================================================

  const getTooltipStyle = (baseLeft: number, baseTop: number) => ({
    left: baseLeft,
    top: baseTop,
    zIndex: 99999,
    transform: baseLeft > window.innerWidth - 300 ? 'translateX(-100%)' : 'none'
  });

  const tooltipBaseClasses = "fixed backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-sm pointer-events-none";

  // =============================================================================
  // TOOLTIP DE PLANETA
  // =============================================================================

  const PlanetTooltip = () => {
    if (!hoveredPlanet || hoveredPlanet === 'Ascendente' || hoveredPlanet === 'Medio Cielo') return null;

    const planet = planets.find(p => p && p.name === hoveredPlanet);
    if (!planet) return null;

    return (
      <div 
        className={`${tooltipBaseClasses} bg-gradient-to-r from-purple-500/95 to-pink-500/95`}
        style={getTooltipStyle(tooltipPosition.x + 25, tooltipPosition.y - 50)}
      >
        <div className="flex items-center mb-3">
          <span className="text-3xl mr-3">
            {PLANET_SYMBOLS[hoveredPlanet] || '●'}
          </span>
          <div>
            <div className="text-white font-bold text-lg">{hoveredPlanet}</div>
            <div className="text-gray-200 text-sm">
              {planet.degree}° {planet.sign}
            </div>
            <div className="text-gray-300 text-xs">
              Casa {planet.house} • {signMeanings[planet.sign as keyof typeof signMeanings]}
            </div>
          </div>
        </div>
        
        {planetMeanings[hoveredPlanet as keyof typeof planetMeanings] && (
          <div className="mb-2">
            <div className="text-white text-sm font-semibold mb-1">🎯 Significado:</div>
            <div className="text-gray-200 text-xs mb-2">
              {planetMeanings[hoveredPlanet as keyof typeof planetMeanings].meaning}
            </div>
            <div className="text-gray-300 text-xs mb-2">
              <strong>Palabras clave:</strong> {planetMeanings[hoveredPlanet as keyof typeof planetMeanings].keywords}
            </div>
            
            <div className="text-white text-sm font-semibold mb-1">⚡ En tu carta:</div>
            <div className="text-cyan-200 text-xs leading-relaxed">
              {getPersonalizedPlanetInterpretation(planet)}
            </div>
          </div>
        )}
        
        {planet.retrograde && (
          <div className="bg-red-400/20 rounded-lg p-2 mt-2">
            <div className="text-red-300 text-xs font-semibold">⚠️ Retrógrado</div>
            <div className="text-red-200 text-xs">Energía internalizada, revisión de temas pasados</div>
          </div>
        )}
      </div>
    );
  };

  // =============================================================================
  // TOOLTIP DE ASPECTO
  // =============================================================================

  const AspectTooltip = () => {
    if (!hoveredAspect || calculatedAspects.length === 0) return null;

    const currentAspect = calculatedAspects.find(aspect => 
      `${aspect.planet1}-${aspect.planet2}-${aspect.type}` === hoveredAspect
    );
    
    if (!currentAspect) return null;
    
    const planet1Desc = planetMeanings[currentAspect.planet1 as keyof typeof planetMeanings]?.keywords.split(',')[0]?.trim() || 'planeta';
    const planet2Desc = planetMeanings[currentAspect.planet2 as keyof typeof planetMeanings]?.keywords.split(',')[0]?.trim() || 'planeta';

    return (
      <div 
        className={`${tooltipBaseClasses} bg-gradient-to-r from-purple-500/95 to-pink-500/95 max-w-lg`}
        style={getTooltipStyle(tooltipPosition.x, tooltipPosition.y)}
      >
        <div className="flex items-center mb-3">
          <div 
            className="w-6 h-6 rounded-full mr-3" 
            style={{ backgroundColor: currentAspect.config?.color || '#666' }}
          ></div>
          <div>
            <div className="text-white font-bold text-lg">{currentAspect.config?.name || currentAspect.type}</div>
            <div className="text-gray-200 text-sm">
              entre {currentAspect.planet1} ({planet1Desc}) y {currentAspect.planet2} ({planet2Desc})
            </div>
          </div>
        </div>
        
        <div className="mb-3 p-3 bg-white/10 rounded-lg border border-white/10">
          <div className="text-blue-300 text-xs mb-1">
            <strong>Ángulo:</strong> {currentAspect.config?.angle || 'N/A'}°
          </div>
          <div className="text-blue-300 text-xs mb-1">
            <strong>Orbe máximo:</strong> ±{currentAspect.config?.orb || 'N/A'}°
          </div>
          <div className="text-yellow-300 text-xs font-semibold">
            {currentAspect.exact ? 'EXACTO' : `Orbe: ${currentAspect.orb.toFixed(2)}°`}
          </div>
        </div>
        
        <div className="mb-2">
          <div className="text-white text-sm font-semibold mb-1">🎯 Significado:</div>
          <div className="text-gray-200 text-xs mb-2">
            {getPersonalizedAspectInterpretation(currentAspect)}
          </div>
          <div className="text-gray-300 text-xs mb-2">
            <strong>Efecto:</strong> {aspectMeanings[currentAspect.type as keyof typeof aspectMeanings]?.effect}
          </div>
          <div className="text-gray-300 text-xs">
            <strong>Tipo:</strong> {aspectMeanings[currentAspect.type as keyof typeof aspectMeanings]?.type}
          </div>
        </div>
        
        {currentAspect.exact && (
          <div className="mt-2 p-2 bg-yellow-400/20 border border-yellow-400/40 rounded">
            <div className="text-yellow-200 text-xs font-bold mb-1">⭐ Aspecto Exacto</div>
            <div className="text-yellow-100 text-xs leading-relaxed">
              Este aspecto tiene <strong>máxima potencia energética</strong> (orbe &lt; 1°). 
              Es una de las influencias <strong>más poderosas</strong> en tu personalidad.
            </div>
          </div>
        )}
      </div>
    );
  };

  // =============================================================================
  // TOOLTIP DE ASCENDENTE
  // =============================================================================

  const AscendantTooltip = () => {
    if (hoveredPlanet !== 'Ascendente' || !ascendant) return null;

    return (
      <div 
        className={`${tooltipBaseClasses} bg-gradient-to-r from-green-500/95 to-emerald-500/95`}
        style={getTooltipStyle(tooltipPosition.x + 25, tooltipPosition.y - 50)}
      >
        <div className="flex items-center mb-3">
          <svg className="w-8 h-8 text-white mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="19" x2="12" y2="5"/>
            <polyline points="5,12 12,5 19,12"/>
          </svg>
          <div>
            <div className="text-white font-bold text-lg">Ascendente</div>
            <div className="text-gray-200 text-sm">
              {ascendant.degree}° {ascendant.sign}
            </div>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="text-white text-sm font-semibold mb-1">🎯 Significado:</div>
          <div className="text-gray-200 text-xs mb-2">
            Tu máscara social, cómo te presentas al mundo y tu apariencia física. 
            La energía que proyectas en primeras impresiones.
          </div>
          <div className="text-gray-300 text-xs mb-2">
            <strong>En {ascendant.sign}:</strong> {signMeanings[ascendant.sign as keyof typeof signMeanings]}
          </div>
          <div className="text-cyan-200 text-xs leading-relaxed">
            <strong>⚡ En tu carta:</strong> Con Ascendente en {ascendant.sign}, te presentas al mundo con las cualidades de {signMeanings[ascendant.sign as keyof typeof signMeanings]?.toLowerCase()}. Tu personalidad externa refleja estas características de forma natural.
          </div>
          <div className="text-gray-300 text-xs mt-2">
            <strong>Palabras clave:</strong> Personalidad externa, imagen, vitalidad, enfoque de vida
          </div>
        </div>
      </div>
    );
  };

  // =============================================================================
  // TOOLTIP DE MEDIO CIELO
  // =============================================================================

  const MidheavenTooltip = () => {
    if (hoveredPlanet !== 'Medio Cielo' || !midheaven) return null;

    return (
      <div 
        className={`${tooltipBaseClasses} bg-gradient-to-r from-purple-500/95 to-violet-500/95`}
        style={getTooltipStyle(tooltipPosition.x + 25, tooltipPosition.y - 50)}
      >
        <div className="flex items-center mb-3">
          <svg className="w-8 h-8 text-white mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
            <polyline points="16,7 22,7 22,13"/>
          </svg>
          <div>
            <div className="text-white font-bold text-lg">Medio Cielo</div>
            <div className="text-gray-200 text-sm">
              {midheaven.degree}° {midheaven.sign}
            </div>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="text-white text-sm font-semibold mb-1">🎯 Significado:</div>
          <div className="text-gray-200 text-xs mb-2">
            Tu vocación, carrera ideal, reputación pública y lo que quieres lograr 
            en el mundo. Tu propósito profesional.
          </div>
          <div className="text-gray-300 text-xs mb-2">
            <strong>En {midheaven.sign}:</strong> {signMeanings[midheaven.sign as keyof typeof signMeanings]}
          </div>
          <div className="text-cyan-200 text-xs leading-relaxed">
            <strong>⚡ En tu carta:</strong> Con Medio Cielo en {midheaven.sign}, tu vocación y carrera se expresan a través de {signMeanings[midheaven.sign as keyof typeof signMeanings]?.toLowerCase()}. Esta es la energía que quieres proyectar profesionalmente.
          </div>
          <div className="text-gray-300 text-xs mt-2">
            <strong>Palabras clave:</strong> Carrera, estatus, reconocimiento, autoridad
          </div>
        </div>
      </div>
    );
  };

  // =============================================================================
  // TOOLTIP DE CASA
  // =============================================================================

  const HouseTooltip = () => {
    if (!hoveredHouse) return null;

    return (
      <div 
        className={`${tooltipBaseClasses} bg-gradient-to-r from-blue-500/95 to-cyan-500/95`}
        style={getTooltipStyle(tooltipPosition.x + 25, tooltipPosition.y - 50)}
      >
        <div className="flex items-start mb-3">
          <span className="text-3xl mr-3">🏠</span>
          <div>
            <div className="text-white font-bold text-lg">
              {houseMeanings[hoveredHouse as keyof typeof houseMeanings]?.name}
            </div>
            <div className="text-gray-200 text-sm mb-2">
              {houseMeanings[hoveredHouse as keyof typeof houseMeanings]?.meaning}
            </div>
            <div className="text-gray-300 text-xs">
              <strong>Temas:</strong> {houseMeanings[hoveredHouse as keyof typeof houseMeanings]?.keywords}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // =============================================================================
  // TOOLTIP DE NAVEGACIÓN
  // =============================================================================

  const NavigationTooltip = () => {
    if (!hoveredNavGuide) return null;

    return (
      <div 
        className={`${tooltipBaseClasses} bg-gradient-to-r from-blue-500/95 to-purple-500/95 max-w-md`}
        style={getTooltipStyle(tooltipPosition.x, tooltipPosition.y)}
      >
        <div className="text-white font-bold mb-2">Guía de navegación</div>
        <div className="text-gray-200 text-xs">
          Usa el menú para saltar entre secciones de tu carta natal.<br />
          Pasa el cursor sobre los íconos y elementos para ver interpretaciones y detalles.<br />
          ¡Explora cada sección para descubrir el significado de tu carta!
        </div>
      </div>
    );
  };

  // =============================================================================
  // RENDER PRINCIPAL
  // =============================================================================

  return (
    <>
      <PlanetTooltip />
      <AspectTooltip />
      <AscendantTooltip />
      <MidheavenTooltip />
      <HouseTooltip />
      <NavigationTooltip />
    </>
  );
};

export default ChartTooltips;