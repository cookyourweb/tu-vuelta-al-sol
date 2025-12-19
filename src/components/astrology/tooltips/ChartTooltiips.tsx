// =============================================================================
// 🎨 CHART TOOLTIPS WITH AI INTERPRETATION INTEGRATION
// src/components/astrology/tooltips/ChartTooltips.tsx
// =============================================================================

'use client';

import React, { useState, useEffect } from 'react';
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
  
  // ✅ NUEVAS PROPS PARA AI
  userId?: string;
  chartType?: 'natal' | 'progressed' | 'solar-return';
  onOpenDrawer?: (content: any) => void;
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
  tooltipPosition,
  userId,
  chartType = 'natal',
  onOpenDrawer
}) => {

  // ✅ Helper para obtener descripción de casas
  const getHouseDescription = (house: number): string => {
    const descriptions: Record<number, string> = {
      1: 'Identidad y autopercepción',
      2: 'Recursos y valores personales',
      3: 'Comunicación y entorno cercano',
      4: 'Hogar y raíces emocionales',
      5: 'Creatividad y expresión personal',
      6: 'Trabajo y salud cotidiana',
      7: 'Relaciones y asociaciones',
      8: 'Transformación y recursos compartidos',
      9: 'Filosofía y expansión',
      10: 'Carrera y reconocimiento público',
      11: 'Comunidad y visión futura',
      12: 'Espiritualidad y lo inconsciente'
    };
    return descriptions[house] || 'Área de vida';
  };

  // ✅ HELPER: ENRIQUECER DRAWER CON METADATOS
  // =============================================================================

  const openDrawerWithMetadata = (drawerContent: any, metadata: any) => {
    if (!onOpenDrawer) return;

    // Enriquecer el drawer content con metadatos técnicos
    const enrichedContent = {
      ...drawerContent,
      metadata
    };

    console.log('📊 Opening drawer with metadata:', metadata);
    onOpenDrawer(enrichedContent);
  };

  // ✅ HELPER: Obtener nombre legible del aspecto
  const getAspectName = (aspectType: string): string => {
    const names: Record<string, string> = {
      'conjunction': 'Conjunción',
      'opposition': 'Oposición',
      'trine': 'Trígono',
      'square': 'Cuadratura',
      'sextile': 'Sextil'
    };
    return names[aspectType] || aspectType;
  };

  // ✅ HELPER: Calcular ángulo del aspecto
  const getAspectAngle = (aspectType: string): number => {
    const angles: Record<string, number> = {
      'conjunction': 0,
      'opposition': 180,
      'trine': 120,
      'square': 90,
      'sextile': 60
    };
    return angles[aspectType] || 0;
  };

  // =============================================================================
  // ✅ ESTADO PARA INTERPRETACIONES AI
  // =============================================================================
  
  const [natalInterpretations, setNatalInterpretations] = useState<any>(null);
  const [loadingInterpretations, setLoadingInterpretations] = useState(true);
  const [loadingAspect, setLoadingAspect] = useState(false);

  // =============================================================================
  // ✅ FETCH INTERPRETATIONS ON MOUNT
  // =============================================================================
  
  useEffect(() => {
    async function fetchNatalInterpretations() {
      if (!userId || chartType !== 'natal') {
        setLoadingInterpretations(false);
        return;
      }
      
      setLoadingInterpretations(true);
      
      try {
        console.log('📡 Fetching natal interpretations for user:', userId);
        const response = await fetch(`/api/astrology/interpret-natal?userId=${userId}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          console.log('✅ Natal interpretations loaded successfully');
          setNatalInterpretations(result.data);
        } else if (result.needsGeneration) {
          console.log('⚠️ No interpretations found - user needs to generate');
          // User hasn't generated interpretations yet
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
  // ✅ GENERATE INDIVIDUAL ASPECT INTERPRETATION
  // =============================================================================
  
  async function generateAspectInterpretation(aspect: CalculatedAspect) {
    if (!userId) return;
    
    try {
      setLoadingAspect(true);
      console.log('🔮 Generating aspect interpretation:', aspect);
      
      const response = await fetch('/api/astrology/interpret-natal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          planet1: aspect.planet1,
          planet2: aspect.planet2,
          aspectType: aspect.type,
          orb: aspect.orb
        })
      });
      
      const result = await response.json();
      
      if (result.success && result.data) {
        console.log('✅ Aspect interpretation generated');
        
        // Update state with new aspect
        setNatalInterpretations((prev: any) => ({
          ...prev,
          aspects: {
            ...prev?.aspects,
            [`${aspect.planet1}-${aspect.planet2}-${aspect.type}`]: result.data
          }
        }));
      }
    } catch (error) {
      console.error('❌ Error generating aspect:', error);
    } finally {
      setLoadingAspect(false);
    }
  }

  // =============================================================================
  // FUNCIONES DE INTERPRETACIÓN (FALLBACK - si no hay AI)
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
      return `Fusión de ${planet1Name} (${planet1Desc}) y ${planet2Name} (${planet2Desc}). Los planetas trabajan como uno solo.`;
    } else if (aspectType === 'opposition') {
      return `Polarización entre ${planet1Name} (${planet1Desc}) y ${planet2Name} (${planet2Desc}). Necesitas encontrar equilibrio.`;
    } else if (aspectType === 'trine') {
      return `Armonía natural entre ${planet1Name} (${planet1Desc}) y ${planet2Name} (${planet2Desc}).`;
    } else if (aspectType === 'square') {
      return `Tensión creativa entre ${planet1Name} (${planet1Desc}) y ${planet2Name} (${planet2Desc}).`;
    } else if (aspectType === 'sextile') {
      return `Oportunidad entre ${planet1Name} (${planet1Desc}) y ${planet2Name} (${planet2Desc}).`;
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

  const tooltipBaseClasses = "fixed backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-sm pointer-events-auto";

  // =============================================================================
  // ✅ TOOLTIP DE PLANETA (CON AI)
  // =============================================================================

  const PlanetTooltip = () => {
    if (!hoveredPlanet || hoveredPlanet === 'Ascendente' || hoveredPlanet === 'Medio Cielo') return null;

    const planet = planets.find(p => p && p.name === hoveredPlanet);
    if (!planet) return null;

    // ✅ CHECK IF AI INTERPRETATION EXISTS
    const planetKey = `${planet.name}-${planet.sign}-${planet.house}`;
    const aiInterpretation = natalInterpretations?.planets?.[planetKey];

    if (aiInterpretation?.tooltip) {
      // ✅ RENDER AI-POWERED TOOLTIP
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
              <div className="text-white font-bold text-lg">{aiInterpretation.tooltip.titulo}</div>
              <div className="text-gray-200 text-sm space-y-0.5">
                <div>Casa {planet.house} ({getHouseDescription(planet.house)})</div>
                <div>{planet.name} en {planet.sign} {Math.floor(planet.degree)}°</div>
              </div>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="text-white text-sm font-semibold mb-1">🎯 Significado:</div>
            <div className="text-gray-200 text-xs mb-2">
              {aiInterpretation.tooltip.significado}
            </div>
            <div className="text-cyan-200 text-xs leading-relaxed">
              <strong>En tu carta:</strong> {aiInterpretation.tooltip.efecto}
            </div>
          </div>

          {/* ✅ BUTTON TO OPEN DRAWER */}
          {onOpenDrawer && aiInterpretation.drawer && (
            <button
              onClick={() => openDrawerWithMetadata(aiInterpretation.drawer, {
                type: 'planet',
                name: planet.name,
                sign: planet.sign,
                house: planet.house,
                degree: planet.degree
              })}
              className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              📖 Ver interpretación completa
            </button>
          )}
        </div>
      );
    }

    // ✅ FALLBACK: BASIC TOOLTIP (if no AI interpretation)
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
            <div className="text-cyan-200 text-xs leading-relaxed">
              {getPersonalizedPlanetInterpretation(planet)}
            </div>
          </div>
        )}

        {!natalInterpretations && !loadingInterpretations && (
          <div className="mt-3 bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-2">
            <p className="text-yellow-200 text-xs">
              💡 Genera interpretaciones AI para contenido personalizado
            </p>
          </div>
        )}
      </div>
    );
  };

  // =============================================================================
  // ✅ TOOLTIP DE ASCENDENTE (CON AI)
  // =============================================================================

  const AscendantTooltip = () => {
    if (hoveredPlanet !== 'Ascendente' || !ascendant) return null;

    const aiInterpretation = natalInterpretations?.angles?.Ascendente;

    if (aiInterpretation?.tooltip) {
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
              <div className="text-white font-bold text-lg">{aiInterpretation.tooltip.titulo}</div>
              <div className="text-gray-200 text-sm">
                Ascendente en {ascendant.sign} {Math.floor(ascendant.degree)}°
              </div>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="text-white text-sm font-semibold mb-1">🎯 Significado:</div>
            <div className="text-gray-200 text-xs">
              {aiInterpretation.tooltip.significado}
            </div>
          </div>

          {onOpenDrawer && aiInterpretation.drawer && (
            <button
              onClick={() => openDrawerWithMetadata(aiInterpretation.drawer, {
                type: 'angle',
                name: 'Ascendente',
                sign: ascendant.sign,
                degree: ascendant.degree
              })}
              className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              📖 Ver interpretación completa
            </button>
          )}
        </div>
      );
    }

    // Fallback
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

        <div className="text-gray-200 text-xs">
          Tu máscara social y cómo te presentas al mundo.
        </div>
      </div>
    );
  };

  // =============================================================================
  // ✅ TOOLTIP DE MEDIO CIELO (CON AI)
  // =============================================================================

  const MidheavenTooltip = () => {
    if (hoveredPlanet !== 'Medio Cielo' || !midheaven) return null;

    const aiInterpretation = natalInterpretations?.angles?.MedioCielo;

    if (aiInterpretation?.tooltip) {
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
              <div className="text-white font-bold text-lg">{aiInterpretation.tooltip.titulo}</div>
              <div className="text-gray-200 text-sm">
                Medio Cielo en {midheaven.sign} {Math.floor(midheaven.degree)}°
              </div>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="text-white text-sm font-semibold mb-1">🎯 Significado:</div>
            <div className="text-gray-200 text-xs">
              {aiInterpretation.tooltip.significado}
            </div>
          </div>

          {onOpenDrawer && aiInterpretation.drawer && (
            <button
              onClick={() => openDrawerWithMetadata(aiInterpretation.drawer, {
                type: 'angle',
                name: 'Medio Cielo',
                sign: midheaven.sign,
                degree: midheaven.degree
              })}
              className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              📖 Ver interpretación completa
            </button>
          )}
        </div>
      );
    }

    // Fallback
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

        <div className="text-gray-200 text-xs">
          Tu vocación y propósito profesional.
        </div>
      </div>
    );
  };

  // =============================================================================
  // ✅ TOOLTIP DE ASPECTO (CON GENERACIÓN BAJO DEMANDA)
  // =============================================================================

  const AspectTooltip = () => {
    if (!hoveredAspect || calculatedAspects.length === 0) return null;

    const currentAspect = calculatedAspects.find(aspect => 
      `${aspect.planet1}-${aspect.planet2}-${aspect.type}` === hoveredAspect
    );
    
    if (!currentAspect) return null;

    // Check if AI interpretation exists for this aspect
    const aspectKey = `${currentAspect.planet1}-${currentAspect.planet2}-${currentAspect.type}`;
    const aiInterpretation = natalInterpretations?.aspects?.[aspectKey];

    const nature = currentAspect.isEasy ? 
      { color: 'from-green-500/95 to-emerald-500/95', label: 'Armónico', icon: '✨' } :
      currentAspect.isHard ?
      { color: 'from-red-500/95 to-orange-500/95', label: 'Tenso', icon: '⚡' } :
      { color: 'from-blue-500/95 to-purple-500/95', label: 'Neutral', icon: '🔷' };

    if (aiInterpretation?.tooltip) {
      // Render AI-powered aspect tooltip
      return (
        <div 
          className={`${tooltipBaseClasses} bg-gradient-to-r ${nature.color}`}
          style={getTooltipStyle(tooltipPosition.x + 25, tooltipPosition.y - 50)}
        >
          <div className="mb-3">
            <div className="text-white font-bold text-base mb-2">
              {aiInterpretation.tooltip.titulo}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-white/20 px-2 py-1 rounded">
                {nature.icon} {nature.label}
              </span>
              <span className="text-xs text-gray-200">
                Orbe: {currentAspect.orb.toFixed(2)}°
              </span>
            </div>
          </div>
          
          <div className="text-gray-200 text-xs mb-3">
            {aiInterpretation.tooltip.significado}
          </div>

          {onOpenDrawer && aiInterpretation.drawer && (
            <button
              onClick={() => openDrawerWithMetadata(aiInterpretation.drawer, {
                type: 'aspect',
                name: getAspectName(currentAspect.type),
                planet1: currentAspect.planet1,
                planet2: currentAspect.planet2,
                aspectType: currentAspect.type,
                angle: getAspectAngle(currentAspect.type),
                orb: currentAspect.orb,
                isExact: currentAspect.orb < 1
              })}
              className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              📖 Ver interpretación completa
            </button>
          )}
        </div>
      );
    }

    // ✅ ASPECT NOT GENERATED YET - SHOW GENERATE BUTTON
    return (
      <div 
        className={`${tooltipBaseClasses} bg-gradient-to-r ${nature.color}`}
        style={getTooltipStyle(tooltipPosition.x + 25, tooltipPosition.y - 50)}
      >
        <div className="mb-3">
          <div className="text-white font-bold text-base mb-2">
            {currentAspect.planet1} {currentAspect.type} {currentAspect.planet2}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-white/20 px-2 py-1 rounded">
              {nature.icon} {nature.label}
            </span>
            <span className="text-xs text-gray-200">
              Orbe: {currentAspect.orb.toFixed(2)}°
            </span>
          </div>
        </div>
        
        <div className="text-gray-200 text-xs mb-3">
          {getPersonalizedAspectInterpretation(currentAspect)}
        </div>

        {userId && !loadingAspect && (
          <button
            onClick={() => generateAspectInterpretation(currentAspect)}
            className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            <span>✨</span>
            <span>Generar interpretación AI</span>
          </button>
        )}

        {loadingAspect && (
          <div className="w-full bg-white/10 text-white px-4 py-2 rounded-lg text-sm text-center">
            🔮 Generando...
          </div>
        )}
      </div>
    );
  };

  // Other tooltips remain the same...
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

  const NavigationTooltip = () => {
    if (!hoveredNavGuide) return null;

    return (
      <div 
        className="fixed bg-gradient-to-r from-yellow-500/95 to-orange-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-xs pointer-events-none"
        style={{ 
          left: tooltipPosition.x + 25,
          top: tooltipPosition.y - 50,
          zIndex: 99999
        }}
      >
        <div className="text-white text-sm leading-relaxed">
          <strong>💡 Guía de Navegación:</strong><br/>
          • Haz hover sobre planetas para ver su significado<br/>
          • Haz hover sobre líneas para ver aspectos<br/>
          • Haz hover sobre números para ver casas
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