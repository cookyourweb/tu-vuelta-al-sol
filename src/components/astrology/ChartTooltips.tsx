// =============================================================================
// 🎨 CHART TOOLTIPS - FIXED WITH LONGER DELAYS
// src/components/astrology/ChartTooltips.tsx
// =============================================================================
// ✅ LONGER DELAY: 2000ms (2 seconds) for aspect tooltips
// ✅ 1000ms (1 second) for planet tooltips
// ✅ pointer-events-auto on ALL tooltips with buttons
// =============================================================================

import React, { useState, useEffect } from 'react';
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
  userId?: string;
  chartType?: 'natal' | 'progressed' | 'solar-return';
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
  setClickedPlanet,
  userId,
  chartType = 'natal'
}) => {

  // =============================================================================
  // STATE
  // =============================================================================
  
  const [natalInterpretations, setNatalInterpretations] = useState<any>(null);
  const [loadingInterpretations, setLoadingInterpretations] = useState(true);
  const [tooltipTimer, setTooltipTimer] = useState<NodeJS.Timeout | null>(null);
  const [generatingAspect, setGeneratingAspect] = useState(false);
  const [aspectTooltipLocked, setAspectTooltipLocked] = useState(false);

  // =============================================================================
  // FETCH AI INTERPRETATIONS
  // =============================================================================
  
  useEffect(() => {
    async function fetchNatalInterpretations() {
      if (!userId || chartType !== 'natal') {
        setLoadingInterpretations(false);
        return;
      }
      
      setLoadingInterpretations(true);
      
      try {
        console.log('🔍 Fetching interpretations for userId:', userId);
        const response = await fetch(`/api/astrology/interpret-natal?userId=${userId}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          console.log('✅ AI Interpretations loaded:', Object.keys(result.data.planets || {}).length, 'planets');
          setNatalInterpretations(result.data);
        } else if (result.needsGeneration) {
          console.log('⚠️ No interpretations found - needs generation');
          setNatalInterpretations(null);
        }
      } catch (error) {
        console.error('❌ Error fetching interpretations:', error);
        setNatalInterpretations(null);
      } finally {
        setLoadingInterpretations(false);
      }
    }
    
    fetchNatalInterpretations();
  }, [userId, chartType]);

  // =============================================================================
  // TOOLTIP HOVER DELAY (CONFIGURABLE PER TYPE)
  // =============================================================================
  
  const handleMouseLeaveTooltip = (callback: () => void, delay: number = 1000) => {
    if (tooltipTimer) {
      clearTimeout(tooltipTimer);
    }
    
    const timer = setTimeout(() => {
      callback();
      setAspectTooltipLocked(false);
    }, delay);
    
    setTooltipTimer(timer);
  };

  const handleMouseEnterTooltip = () => {
    if (tooltipTimer) {
      clearTimeout(tooltipTimer);
      setTooltipTimer(null);
    }
  };

  // =============================================================================
  // GENERATE ASPECT INTERPRETATION
  // =============================================================================
  
  const generateAspectInterpretation = async (planet1: string, planet2: string, aspectType: string, orb: number) => {
    if (!userId) {
      alert('Usuario no encontrado');
      return;
    }

    setGeneratingAspect(true);
    setAspectTooltipLocked(true); // Lock tooltip while generating

    try {
      console.log(`🎯 Generating aspect: ${planet1} ${aspectType} ${planet2}`);
      
      const response = await fetch('/api/astrology/interpret-natal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          planet1,
          planet2,
          aspectType,
          orb
        })
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Aspect interpretation generated');
        
        // Refresh interpretations
        const refreshResponse = await fetch(`/api/astrology/interpret-natal?userId=${userId}`);
        const refreshResult = await refreshResponse.json();
        
        if (refreshResult.success) {
          setNatalInterpretations(refreshResult.data);
          console.log('✅ Interpretations refreshed');
        }
      }
    } catch (error) {
      console.error('❌ Error generating aspect:', error);
      alert('❌ Error generando interpretación');
    } finally {
      setGeneratingAspect(false);
    }
  };

  // =============================================================================
  // 🪐 TOOLTIP FOR PLANET (WITH AI)
  // =============================================================================
  
  if ((hoveredPlanet || clickedPlanet) && hoveredPlanet !== 'Ascendente' && hoveredPlanet !== 'Medio Cielo') {
    const planetName = clickedPlanet || hoveredPlanet;
    const planet = planets.find(p => p.name === planetName);
    if (!planet) return null;

    const interpretationKey = `${planet.name}-${planet.sign}-${planet.house}`;
    let interpretation = null;
    
    if (natalInterpretations?.planets?.[interpretationKey]) {
      interpretation = natalInterpretations.planets[interpretationKey];
      console.log('✅ Using AI interpretation for', interpretationKey);
    } else {
      interpretation = getExampleInterpretation(interpretationKey);
      console.log('⚠️ Using fallback for', interpretationKey);
    }

    return (
      <div
        className="fixed bg-gradient-to-r from-purple-500/95 to-pink-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-md pointer-events-auto z-[150000]"
        style={{
          left: tooltipPosition.x + 25,
          top: tooltipPosition.y - 50,
          transform: tooltipPosition.x > window.innerWidth - 400 ? 'translateX(-100%)' : 'none'
        }}
        onMouseEnter={handleMouseEnterTooltip}
        onMouseLeave={() => {
          if (!drawerOpen && !clickedPlanet) {
            handleMouseLeaveTooltip(() => setHoveredPlanet(null), 1000); // 1 second delay
          }
        }}
      >
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
          <button
            onClick={() => {
              setHoveredPlanet(null);
              if (setClickedPlanet) setClickedPlanet(null);
              if (onCloseDrawer) onCloseDrawer();
            }}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            ✕
          </button>
        </div>

        <div className="text-gray-300 text-xs mb-3">
          {interpretation?.tooltip?.descripcionBreve || `${planet.name} en ${planet.sign} en Casa ${planet.house}`}
        </div>

        <div className="mb-3">
          <div className="text-white text-sm font-semibold mb-2">🎯 Significado:</div>
          <div className="text-gray-200 text-sm leading-relaxed">
            {interpretation?.tooltip?.significado || getPersonalizedPlanetInterpretation(planet)}
          </div>
        </div>

        <div className="space-y-1 mb-3">
          <div className="text-cyan-200 text-xs">
            <strong>Efecto:</strong> {interpretation?.tooltip?.efecto || 'Influencia planetaria significativa'}
          </div>
          <div className="text-purple-200 text-xs">
            <strong>Tipo:</strong> {interpretation?.tooltip?.tipo || 'Energía transformadora'}
          </div>
        </div>

        {planet.retrograde && (
          <div className="bg-red-400/20 rounded-lg p-2 mb-3">
            <div className="text-red-300 text-xs font-semibold">⚠️ Retrógrado</div>
            <div className="text-red-200 text-xs">Energía internalizada, revisión de temas pasados</div>
          </div>
        )}

        {interpretation?.drawer && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenDrawer) {
                onOpenDrawer(interpretation.drawer);
              }
            }}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg"
          >
            <span>📖 Ver interpretación completa</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        )}

        {!interpretation?.drawer && (
          <div className="text-center text-xs text-gray-400 py-2">
            💡 Haz hover más tiempo para ver la interpretación
          </div>
        )}
      </div>
    );
  }

  // =============================================================================
  // 🌅 TOOLTIP FOR ASCENDANT
  // =============================================================================
  
  if (hoveredPlanet === 'Ascendente' && ascendant) {
    let interpretation = null;
    
    if (natalInterpretations?.angles?.Ascendente) {
      interpretation = natalInterpretations.angles.Ascendente;
    }

    return (
      <div 
        className="fixed bg-gradient-to-r from-green-500/95 to-emerald-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-sm pointer-events-auto z-[150000]"
        style={{ 
          left: tooltipPosition.x + 25,
          top: tooltipPosition.y - 50,
          transform: tooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none'
        }}
        onMouseEnter={handleMouseEnterTooltip}
        onMouseLeave={() => handleMouseLeaveTooltip(() => setHoveredPlanet(null), 1000)}
      >
        <div className="flex items-center mb-3">
          <svg className="w-8 h-8 text-white mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="19" x2="12" y2="5"/>
            <polyline points="5,12 12,5 19,12"/>
          </svg>
          <div>
            <div className="text-white font-bold text-lg">
              {interpretation?.tooltip?.titulo || 'Ascendente'}
            </div>
            <div className="text-gray-200 text-sm">
              {ascendant.degree}° {ascendant.sign}
            </div>
          </div>
        </div>
        
        <div className="text-white text-sm font-semibold mb-1">🎯 Significado:</div>
        <div className="text-gray-200 text-xs mb-2">
          {interpretation?.tooltip?.significado || 
            `Tu máscara social, cómo te presentas al mundo y tu apariencia física.`}
        </div>
        
        {interpretation?.tooltip?.efecto && (
          <div className="text-cyan-200 text-xs mb-3">
            <strong>Efecto:</strong> {interpretation.tooltip.efecto}
          </div>
        )}
        
        {interpretation?.drawer && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenDrawer) {
                onOpenDrawer(interpretation.drawer);
              }
            }}
            className="w-full py-2 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg text-sm font-semibold transition-all"
          >
            📖 Ver interpretación completa
          </button>
        )}
      </div>
    );
  }

  // =============================================================================
  // 🎯 TOOLTIP FOR MIDHEAVEN
  // =============================================================================
  
  if (hoveredPlanet === 'Medio Cielo' && midheaven) {
    let interpretation = null;
    
    if (natalInterpretations?.angles?.MedioCielo) {
      interpretation = natalInterpretations.angles.MedioCielo;
    }

    return (
      <div 
        className="fixed bg-gradient-to-r from-purple-500/95 to-violet-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-sm pointer-events-auto z-[150000]"
        style={{ 
          left: tooltipPosition.x + 25,
          top: tooltipPosition.y - 50,
          transform: tooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none'
        }}
        onMouseEnter={handleMouseEnterTooltip}
        onMouseLeave={() => handleMouseLeaveTooltip(() => setHoveredPlanet(null), 1000)}
      >
        <div className="flex items-center mb-3">
          <svg className="w-8 h-8 text-white mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2 L12 12 L8 8 M12 12 L16 8" />
            <circle cx="12" cy="18" r="4" />
          </svg>
          <div>
            <div className="text-white font-bold text-lg">
              {interpretation?.tooltip?.titulo || 'Medio Cielo'}
            </div>
            <div className="text-gray-200 text-sm">
              {midheaven.degree}° {midheaven.sign}
            </div>
          </div>
        </div>
        
        <div className="text-white text-sm font-semibold mb-1">🎯 Significado:</div>
        <div className="text-gray-200 text-xs mb-2">
          {interpretation?.tooltip?.significado || 
            `Tu vocación, imagen pública y dirección profesional.`}
        </div>
        
        {interpretation?.tooltip?.efecto && (
          <div className="text-cyan-200 text-xs mb-3">
            <strong>Efecto:</strong> {interpretation.tooltip.efecto}
          </div>
        )}
        
        {interpretation?.drawer && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenDrawer) {
                onOpenDrawer(interpretation.drawer);
              }
            }}
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white rounded-lg text-sm font-semibold transition-all"
          >
            📖 Ver interpretación completa
          </button>
        )}
      </div>
    );
  }

  // =============================================================================
  // ⚡ TOOLTIP FOR ASPECT (WITH LONGER DELAY - 2 SECONDS!)
  // =============================================================================
  
  if (hoveredAspect && calculatedAspects.length > 0) {
    const currentAspect = calculatedAspects.find(aspect => 
      `${aspect.planet1}-${aspect.planet2}-${aspect.type}` === hoveredAspect
    );
    
    if (!currentAspect) return null;

    const planet1Desc = planetMeanings[currentAspect.planet1 as keyof typeof planetMeanings]?.keywords.split(',')[0]?.trim() || 'planeta';
    const planet2Desc = planetMeanings[currentAspect.planet2 as keyof typeof planetMeanings]?.keywords.split(',')[0]?.trim() || 'planeta';

    const aspectKey = `${currentAspect.planet1}-${currentAspect.planet2}-${currentAspect.type}`;
    const hasAIInterpretation = natalInterpretations?.aspects?.[aspectKey];

    return (
      <div 
        className="fixed bg-gradient-to-r from-purple-500/95 to-pink-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-lg pointer-events-auto z-[150000]"
        style={{ 
          left: tooltipPosition.x, 
          top: tooltipPosition.y,
          transform: tooltipPosition.x > window.innerWidth - 350 ? 'translateX(-100%)' : 'none'
        }}
        onMouseEnter={() => {
          handleMouseEnterTooltip();
          setAspectTooltipLocked(true);
        }}
        onMouseLeave={() => {
          if (!aspectTooltipLocked && !generatingAspect) {
            handleMouseLeaveTooltip(() => setHoveredAspect(null), 2000); // 2 SECONDS!
          }
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center flex-1">
            <div 
              className="w-6 h-6 rounded-full mr-3 flex-shrink-0" 
              style={{ backgroundColor: currentAspect.config.color }}
            ></div>
            <div>
              <div className="text-white font-bold text-lg">{currentAspect.config.name}</div>
              <div className="text-gray-200 text-sm">
                entre {currentAspect.planet1} y {currentAspect.planet2}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setHoveredAspect(null);
              setAspectTooltipLocked(false);
            }}
            className="text-gray-400 hover:text-white transition-colors p-1 ml-2"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-3 p-3 bg-white/10 rounded-lg border border-white/10">
          <div className="text-blue-300 text-xs mb-1">
            <strong>Ángulo:</strong> {currentAspect.config.angle}°
          </div>
          <div className="text-blue-300 text-xs mb-1">
            <strong>Orbe:</strong> {currentAspect.orb.toFixed(2)}° (máx ±{currentAspect.config.orb}°)
          </div>
          <div className="text-yellow-300 text-xs font-semibold">
            {currentAspect.exact ? '⭐ EXACTO' : `Orbe: ${currentAspect.orb.toFixed(2)}°`}
          </div>
        </div>
        
        <div className="mb-3">
          <div className="text-white text-sm font-semibold mb-1">🎯 Significado:</div>
          <div className="text-gray-200 text-xs mb-2">
            {getPersonalizedAspectInterpretation(currentAspect)}
          </div>
          <div className="text-gray-300 text-xs mb-1">
            <strong>Efecto:</strong> {aspectMeanings[currentAspect.type as keyof typeof aspectMeanings]?.effect}
          </div>
          <div className="text-gray-300 text-xs">
            <strong>Tipo:</strong> {aspectMeanings[currentAspect.type as keyof typeof aspectMeanings]?.type}
          </div>
        </div>
        
        {currentAspect.exact && (
          <div className="mb-3 p-2 bg-yellow-400/20 border border-yellow-400/40 rounded">
            <div className="text-yellow-200 text-xs font-bold mb-1">⭐ Aspecto Exacto</div>
            <div className="text-yellow-100 text-xs leading-relaxed">
              <strong>Máxima potencia</strong> (orbe &lt; 1°). Influencia muy poderosa.
            </div>
          </div>
        )}

        {/* Generate AI interpretation button */}
        {!hasAIInterpretation && userId && (
          <button
            onClick={async (e) => {
              e.stopPropagation();
              setAspectTooltipLocked(true);
              await generateAspectInterpretation(
                currentAspect.planet1,
                currentAspect.planet2,
                currentAspect.type,
                currentAspect.orb
              );
            }}
            disabled={generatingAspect}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {generatingAspect ? (
              <>
                <div className="animate-spin">⏳</div>
                <span>Generando interpretación...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Generar Interpretación AI</span>
              </>
            )}
          </button>
        )}

        {/* Show full interpretation if available */}
        {hasAIInterpretation && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenDrawer) {
                onOpenDrawer(natalInterpretations.aspects[aspectKey].drawer);
              }
            }}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 group"
          >
            <span>📖</span>
            <span>Ver interpretación completa</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        )}

        {/* Tooltip stays visible hint */}
        <div className="mt-2 text-center text-xs text-gray-400">
          💡 Tooltip permanece 2 segundos después de salir
        </div>
      </div>
    );
  }

  // =============================================================================
  // 🏠 TOOLTIP FOR HOUSE
  // =============================================================================
  
  if (hoveredHouse) {
    return (
      <div 
        className="fixed bg-gradient-to-r from-blue-500/95 to-cyan-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-sm pointer-events-none z-[150000]"
        style={{ 
          left: tooltipPosition.x + 25,
          top: tooltipPosition.y - 50,
          transform: tooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none'
        }}
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
  }

  return null;
};

export default ChartTooltips;