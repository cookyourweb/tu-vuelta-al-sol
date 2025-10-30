import React from 'react';
import { Planet, Aspect } from '../../types/astrology/chartDisplay';
import { planetMeanings, signMeanings, houseMeanings, aspectMeanings } from '../../constants/astrology';
import { getPersonalizedPlanetInterpretation, getPersonalizedAspectInterpretation } from '../../services/chartInterpretationsService';
import { getExampleInterpretation } from '../../data/interpretations/ExampleInterpretations';


interface ChartTooltipsProps {
  hoveredPlanet: string | null;
  hoveredAspect: string | null;
  hoveredHouse: number | null;
  ascendant?: { degree?: number; sign?: string };
  midheaven?: { degree?: number; sign?: string };
  planets: Planet[];
  calculatedAspects: (Aspect & { config: { color: string; difficulty: string; name: string; angle: number; orb: number }; exact: boolean })[];
  tooltipPosition: { x: number; y: number };
  setHoveredPlanet: (planet: string | null) => void;
  setHoveredAspect: (aspect: string | null) => void;
  setHoveredHouse: (house: number | null) => void;
  onOpenDrawer?: (content: any) => void;
  onCloseDrawer?: () => void;
  drawerOpen?: boolean;
  clickedPlanet?: string | null;
  setClickedPlanet?: (planet: string | null) => void;
}

const ChartTooltips: React.FC<ChartTooltipsProps> = ({
  hoveredPlanet,
  hoveredAspect,
  hoveredHouse,
  ascendant,
  midheaven,
  planets,
  calculatedAspects,
  tooltipPosition,
  setHoveredPlanet,
  setHoveredAspect,
  setHoveredHouse,
  onOpenDrawer,
  onCloseDrawer,
  drawerOpen = false,
  clickedPlanet = null,
  setClickedPlanet
}) => {

  // ============================================================================
  // 🪐 TOOLTIP FOR PLANET
  // ============================================================================
  if ((hoveredPlanet || clickedPlanet) && hoveredPlanet !== 'Ascendente' && hoveredPlanet !== 'Medio Cielo') {
    const planetName = clickedPlanet || hoveredPlanet;
    const planet = planets.find(p => p.name === planetName);
    if (!planet) return null;

    // Obtener interpretación con lenguaje triple fusionado
    const interpretationKey = `${planet.name}-${planet.sign}-${planet.house}`;
    const interpretation = getExampleInterpretation(interpretationKey);

    // TODO: Abrir drawer automáticamente al mostrar tooltip - ahora se maneja desde la página

    return (
      <div
        className="fixed bg-gradient-to-r from-purple-500/95 to-pink-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-md pointer-events-auto z-[150000]"
        style={{
          left: tooltipPosition.x + 25,
          top: tooltipPosition.y - 50,
          transform: tooltipPosition.x > window.innerWidth - 400 ? 'translateX(-100%)' : 'none'
        }}
        onMouseEnter={() => {
          // Mantener el tooltip visible cuando el mouse está sobre él
          setHoveredPlanet(planet.name);
        }}
        onMouseLeave={() => {
          // Solo cerrar tooltip si el drawer no está abierto y no hay planeta clickeado
          if (!drawerOpen && !clickedPlanet) {
            setTimeout(() => {
              setHoveredPlanet(null);
            }, 100);
          }
        }}
        onClick={(e) => {
          // Si se hace click en el tooltip, marcar como clickeado
          if (e.target === e.currentTarget) {
            if (setClickedPlanet) {
              setClickedPlanet(planet.name);
            }
          }
        }}
      >
        {/* Header del tooltip */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <span className="text-3xl mr-3">{planet.name.charAt(0)}</span>
            <div>
              <div className="text-white font-bold text-lg">
                {interpretation?.tooltip?.titulo || planet.name}
              </div>
              <div className="text-gray-200 text-sm">
                {planet.degree}° {planet.sign}
              </div>
            </div>
          </div>
          {/* Botón X para cerrar tooltip */}
          <button
            onClick={() => {
              setHoveredPlanet(null);
              if (setClickedPlanet) {
                setClickedPlanet(null);
              }
              // Si el drawer está abierto, también cerrarlo
              if (onCloseDrawer) {
                onCloseDrawer();
              }
            }}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Cerrar tooltip"
          >
            ✕
          </button>
        </div>

        {/* Descripción breve */}
        <div className="text-gray-300 text-xs mb-3">
          {interpretation?.tooltip?.descripcionBreve || `${planet.name} en ${planet.sign} en Casa ${planet.house}`}
        </div>

        {/* Significado con lenguaje triple fusionado */}
        <div className="mb-3">
          <div className="text-white text-sm font-semibold mb-2">🎯 Significado:</div>
          <div className="text-gray-200 text-sm leading-relaxed">
            {interpretation?.tooltip?.significado || getPersonalizedPlanetInterpretation(planet)}
          </div>
        </div>

        {/* Efecto y Tipo */}
        <div className="space-y-1 mb-3">
          <div className="text-cyan-200 text-xs">
            <strong>Efecto:</strong> {interpretation?.tooltip?.efecto || 'Influencia planetaria significativa'}
          </div>
          <div className="text-purple-200 text-xs">
            <strong>Tipo:</strong> {interpretation?.tooltip?.tipo || 'Energía transformadora'}
          </div>
        </div>

        {/* Retrógrado (si aplica) */}
        {planet.retrograde && (
          <div className="bg-red-400/20 rounded-lg p-2 mb-3">
            <div className="text-red-300 text-xs font-semibold">⚠️ Retrógrado</div>
            <div className="text-red-200 text-xs">Energía internalizada, revisión de temas pasados</div>
          </div>
        )}

        {/* Botón para ver interpretación completa */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenDrawer && interpretation?.drawer) {
              onOpenDrawer(interpretation.drawer);
              // Mantener tooltip abierto al abrir drawer
            }
          }}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg"
        >
          <span>📖 Ver interpretación completa</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>


      </div>
    );
  }

  // Tooltip for aspect
  if (hoveredAspect && calculatedAspects.length > 0) {
    const currentAspect = calculatedAspects.find(aspect => 
      `${aspect.planet1}-${aspect.planet2}-${aspect.type}` === hoveredAspect
    );
    
    if (!currentAspect) return null;

    const planet1Desc = planetMeanings[currentAspect.planet1 as keyof typeof planetMeanings]?.keywords.split(',')[0]?.trim() || 'planeta';
    const planet2Desc = planetMeanings[currentAspect.planet2 as keyof typeof planetMeanings]?.keywords.split(',')[0]?.trim() || 'planeta';

    return (
      <div 
        className="fixed bg-gradient-to-r from-purple-500/95 to-pink-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-lg pointer-events-none"
        style={{ 
          left: tooltipPosition.x, 
          top: tooltipPosition.y,
          zIndex: 99999,
          transform: tooltipPosition.x > window.innerWidth - 350 ? 'translateX(-100%)' : 'none'
        }}
      >
        <div className="flex items-center mb-3">
          <div 
            className="w-6 h-6 rounded-full mr-3" 
            style={{ backgroundColor: currentAspect.config.color }}
          ></div>
          <div>
            <div className="text-white font-bold text-lg">{currentAspect.config.name}</div>
            <div className="text-gray-200 text-sm">
              entre {currentAspect.planet1} ({planet1Desc}) y {currentAspect.planet2} ({planet2Desc})
            </div>
          </div>
        </div>
        
        <div className="mb-3 p-3 bg-white/10 rounded-lg border border-white/10">
          <div className="text-blue-300 text-xs mb-1">
            <strong>Ãngulo:</strong> {currentAspect.config.angle}Â°
          </div>
          <div className="text-blue-300 text-xs mb-1">
            <strong>Orbe mÃ¡ximo:</strong> Â±{currentAspect.config.orb}Â°
          </div>
          <div className="text-yellow-300 text-xs font-semibold">
            {currentAspect.exact ? 'EXACTO' : `Orbe: ${currentAspect.orb.toFixed(2)}Â°`}
          </div>
        </div>
        
        <div className="mb-2">
          <div className="text-white text-sm font-semibold mb-1">ðŸŽ¯ Significado:</div>
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
            <div className="text-yellow-200 text-xs font-bold mb-1">â­ Aspecto Exacto</div>
            <div className="text-yellow-100 text-xs leading-relaxed">
              Este aspecto tiene <strong>mÃ¡xima potencia energÃ©tica</strong> (orbe &lt; 1Â°). 
              Es una de las influencias <strong>mÃ¡s poderosas</strong> en tu personalidad.
            </div>
          </div>
        )}
      </div>
    );
  }

  // Tooltip for Ascendant
  if (hoveredPlanet === 'Ascendente' && ascendant) {
    return (
      <div 
        className="fixed bg-gradient-to-r from-green-500/95 to-emerald-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-sm pointer-events-none"
        style={{ 
          left: tooltipPosition.x + 25,
          top: tooltipPosition.y - 50,
          zIndex: 99999,
          transform: tooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none'
        }}
      >
        <div className="flex items-center mb-3">
          <svg className="w-8 h-8 text-white mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="19" x2="12" y2="5"/>
            <polyline points="5,12 12,5 19,12"/>
          </svg>
          <div>
            <div className="text-white font-bold text-lg">Ascendente</div>
            <div className="text-gray-200 text-sm">
              {ascendant.degree}Â° {ascendant.sign}
            </div>
          </div>
        </div>
        
        <div className="text-white text-sm font-semibold mb-1">ðŸŽ¯ Significado:</div>
        <div className="text-gray-200 text-xs mb-2">
          Tu mÃ¡scara social, cÃ³mo te presentas al mundo y tu apariencia fÃ­sica. 
          La energÃ­a que proyectas en primeras impresiones.
        </div>
        <div className="text-gray-300 text-xs mb-2">
          <strong>En {ascendant.sign}:</strong> {signMeanings[ascendant.sign as keyof typeof signMeanings]}
        </div>
        <div className="text-cyan-200 text-xs leading-relaxed">
          <strong>âš¡ En tu carta:</strong> Con Ascendente en {ascendant.sign}, te presentas al mundo con las cualidades de {signMeanings[ascendant.sign as keyof typeof signMeanings]?.toLowerCase()}. Tu personalidad externa refleja estas caracterÃ­sticas de forma natural.
        </div>
        <div className="text-gray-300 text-xs mt-2">
          <strong>Palabras clave:</strong> Personalidad externa, imagen, vitalidad, enfoque de vida
        </div>
      </div>
    );
  }

  // Tooltip for Midheaven
  if (hoveredPlanet === 'Medio Cielo' && midheaven) {
    return (
      <div 
        className="fixed bg-gradient-to-r from-purple-500/95 to-violet-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-sm pointer-events-none"
        style={{ 
          left: tooltipPosition.x + 25,
          top: tooltipPosition.y - 50,
          zIndex: 99999,
          transform: tooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none'
        }}
      >
        <div className="flex items-center mb-3">
          <svg className="w-8 h-8 text-white mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
            <polyline points="16,7 22,7 22,13"/>
          </svg>
          <div>
            <div className="text-white font-bold text-lg">Medio Cielo</div>
            <div className="text-gray-200 text-sm">
              {midheaven.degree}Â° {midheaven.sign}
            </div>
          </div>
        </div>
        
        <div className="text-white text-sm font-semibold mb-1">ðŸŽ¯ Significado:</div>
        <div className="text-gray-200 text-xs mb-2">
          Tu vocaciÃ³n, carrera ideal, reputaciÃ³n pÃºblica y lo que quieres lograr 
          en el mundo. Tu propÃ³sito profesional.
        </div>
        <div className="text-gray-300 text-xs mb-2">
          <strong>En {midheaven.sign}:</strong> {signMeanings[midheaven.sign as keyof typeof signMeanings]}
        </div>
        <div className="text-cyan-200 text-xs leading-relaxed">
          <strong>âš¡ En tu carta:</strong> Con Medio Cielo en {midheaven.sign}, tu vocaciÃ³n y carrera se expresan a travÃ©s de {signMeanings[midheaven.sign as keyof typeof signMeanings]?.toLowerCase()}. Esta es la energÃ­a que quieres proyectar profesionalmente.
        </div>
      </div>
    );
  }

  // Tooltip for house
  if (hoveredHouse) {
    return (
      <div 
        className="fixed bg-gradient-to-r from-blue-500/95 to-cyan-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-sm pointer-events-none"
        style={{ 
          left: tooltipPosition.x + 25,
          top: tooltipPosition.y - 50,
          zIndex: 99999,
          transform: tooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none'
        }}
      >
        <div className="flex items-start mb-3">
          <span className="text-3xl mr-3">ðŸ </span>
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
  }

  // No renderizar drawer aquí - se maneja desde la página
  return <></>;
};

export default ChartTooltips;
