//src/components/astrology/ChartTooltipsWithDrawer.tsx

// =============================================================================
// 🎨 TOOLTIPS CON DRAWER INTEGRADO - VERSIÓN MEJORADA
// ChartTooltipsWithDrawer.tsx
// =============================================================================
// Extiende ChartTooltips.tsx actual añadiendo:
// - Botón "Ver interpretación completa" en cada tooltip
// - Drawer lateral con interpretación triple fusionada
// - Generación de interpretaciones con IA
// =============================================================================

'use client';

import React, { useState } from 'react';


import { InterpretationDrawer } from './InterpretationDrawer';

import { Planet } from '@/types/astrology';
import { Aspect } from '@/services/astrologyService';
import { aspectMeanings, houseMeanings, planetMeanings, signMeanings } from '@/constants/astrology';
import { getPersonalizedAspectInterpretation, getPersonalizedPlanetInterpretation } from '@/services/chartInterpretationsService';
import { generateAscendantInterpretation, generateAspectInterpretation, generateMidheavenInterpretation, generatePlanetInterpretation } from '@/services/tripleFusedInterpretationService';

// =============================================================================
// 📚 INTERFACES
// =============================================================================

interface ChartTooltipsWithDrawerProps {
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
  // Nuevo: información del usuario para las interpretaciones
  userProfile?: {
    name: string;
    age: number;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
  };
}

interface DrawerContent {
  titulo: string;
  educativo: string;
  poderoso: string;
  poetico: string;
  sombras: {
    nombre: string;
    descripcion: string;
    trampa: string;
    regalo: string;
  }[];
  sintesis: {
    frase: string;
    declaracion: string;
  };
}

// =============================================================================
// 🎨 COMPONENTE PRINCIPAL
// =============================================================================

const ChartTooltipsWithDrawer: React.FC<ChartTooltipsWithDrawerProps> = ({
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
  userProfile
}) => {

  // =========================================================================
  // 🔄 ESTADO DEL DRAWER
  // =========================================================================
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<DrawerContent | null>(null);
  const [isLoadingInterpretation, setIsLoadingInterpretation] = useState(false);

  // =========================================================================
  // 🤖 FUNCIÓN PARA GENERAR Y ABRIR INTERPRETACIÓN CON IA
  // =========================================================================
  const openInterpretationDrawer = async (type: 'planet' | 'ascendant' | 'midheaven' | 'aspect', data: any) => {
    if (!userProfile) {
      console.warn('No hay perfil de usuario disponible para generar interpretación');
      return;
    }

    setIsLoadingInterpretation(true);

    try {
      let interpretation;

      switch (type) {
        case 'planet':
          interpretation = await generatePlanetInterpretation(
            data.name,
            data.sign,
            data.house,
            data.degree,
            userProfile
          );
          break;

        case 'ascendant':
          interpretation = await generateAscendantInterpretation(
            data.sign,
            data.degree,
            userProfile
          );
          break;

        case 'midheaven':
          interpretation = await generateMidheavenInterpretation(
            data.sign,
            data.degree,
            userProfile
          );
          break;

        case 'aspect':
          interpretation = await generateAspectInterpretation(
            data.planet1,
            data.planet2,
            data.type,
            data.orb,
            userProfile
          );
          break;

        default:
          throw new Error('Tipo de interpretación no válido');
      }

      // Abrir drawer con la interpretación
      setDrawerContent(interpretation.drawer);
      setDrawerOpen(true);

    } catch (error) {
      console.error('Error generando interpretación:', error);
      // TODO: Mostrar mensaje de error al usuario
    } finally {
      setIsLoadingInterpretation(false);
    }
  };

  // =========================================================================
  // 🎨 BOTÓN "VER INTERPRETACIÓN COMPLETA"
  // =========================================================================
  const InterpretationButton: React.FC<{ onClick: () => void; disabled?: boolean }> = ({ onClick, disabled }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-white transition-all duration-200 flex items-center justify-center gap-2"
    >
      {disabled ? (
        <>
          <span className="animate-spin">⏳</span>
          <span>Generando...</span>
        </>
      ) : (
        <>
          <span>📖</span>
          <span>Ver interpretación completa →</span>
        </>
      )}
    </button>
  );

  // =========================================================================
  // 🪐 TOOLTIP PARA PLANETAS
  // =========================================================================
  if (hoveredPlanet && hoveredPlanet !== 'Ascendente' && hoveredPlanet !== 'Medio Cielo') {
    const planet = planets.find(p => p.name === hoveredPlanet);
    if (!planet) return null;

    return (
      <>
        <div 
          className="fixed bg-gradient-to-r from-purple-500/95 to-pink-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-sm z-[99998]"
          style={{ 
            left: tooltipPosition.x + 25,
            top: tooltipPosition.y - 50,
            transform: tooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none',
            pointerEvents: 'auto'
          }}
        >
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">
              {planet.name.charAt(0)}
            </span>
            <div>
              <div className="text-white font-bold text-lg">{planet.name}</div>
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

          {/* NUEVO: Botón para abrir drawer */}
          <InterpretationButton
            onClick={() => openInterpretationDrawer('planet', {
              name: planet.name,
              sign: planet.sign,
              house: planet.house,
              degree: planet.degree
            })}
            disabled={isLoadingInterpretation}
          />
        </div>

        {/* DRAWER */}
        <InterpretationDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          content={drawerContent}
        />
      </>
    );
  }

  // =========================================================================
  // ⚡ TOOLTIP PARA ASPECTOS
  // =========================================================================
  if (hoveredAspect && calculatedAspects.length > 0) {
    const currentAspect = calculatedAspects.find(aspect => 
      `${aspect.planet1}-${aspect.planet2}-${aspect.type}` === hoveredAspect
    );
    
    if (!currentAspect) return null;

    const planet1Desc = planetMeanings[currentAspect.planet1 as keyof typeof planetMeanings]?.keywords.split(',')[0]?.trim() || 'planeta';
    const planet2Desc = planetMeanings[currentAspect.planet2 as keyof typeof planetMeanings]?.keywords.split(',')[0]?.trim() || 'planeta';

    return (
      <>
        <div 
          className="fixed bg-gradient-to-r from-purple-500/95 to-pink-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-lg z-[99998]"
          style={{ 
            left: tooltipPosition.x, 
            top: tooltipPosition.y,
            transform: tooltipPosition.x > window.innerWidth - 350 ? 'translateX(-100%)' : 'none',
            pointerEvents: 'auto'
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
              <strong>Ángulo:</strong> {currentAspect.config.angle}°
            </div>
            <div className="text-blue-300 text-xs mb-1">
              <strong>Orbe máximo:</strong> ±{currentAspect.config.orb}°
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

          {/* NUEVO: Botón para abrir drawer */}
          <InterpretationButton
            onClick={() => openInterpretationDrawer('aspect', {
              planet1: currentAspect.planet1,
              planet2: currentAspect.planet2,
              type: currentAspect.type,
              orb: currentAspect.orb
            })}
            disabled={isLoadingInterpretation}
          />
        </div>

        {/* DRAWER */}
        <InterpretationDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          content={drawerContent}
        />
      </>
    );
  }

  // =========================================================================
  // 🎯 TOOLTIP PARA ASCENDENTE
  // =========================================================================
  if (hoveredPlanet === 'Ascendente' && ascendant) {
    return (
      <>
        <div 
          className="fixed bg-gradient-to-r from-green-500/95 to-emerald-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-sm z-[99998]"
          style={{ 
            left: tooltipPosition.x + 25,
            top: tooltipPosition.y - 50,
            transform: tooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none',
            pointerEvents: 'auto'
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
                {ascendant.degree}° {ascendant.sign}
              </div>
            </div>
          </div>
          
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

          {/* NUEVO: Botón para abrir drawer */}
          <InterpretationButton
            onClick={() => openInterpretationDrawer('ascendant', {
              sign: ascendant.sign,
              degree: ascendant.degree
            })}
            disabled={isLoadingInterpretation}
          />
        </div>

        {/* DRAWER */}
        <InterpretationDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          content={drawerContent}
        />
      </>
    );
  }

  // =========================================================================
  // 🎯 TOOLTIP PARA MEDIO CIELO
  // =========================================================================
  if (hoveredPlanet === 'Medio Cielo' && midheaven) {
    return (
      <>
        <div 
          className="fixed bg-gradient-to-r from-purple-500/95 to-violet-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-sm z-[99998]"
          style={{ 
            left: tooltipPosition.x + 25,
            top: tooltipPosition.y - 50,
            transform: tooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none',
            pointerEvents: 'auto'
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
                {midheaven.degree}° {midheaven.sign}
              </div>
            </div>
          </div>
          
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

          {/* NUEVO: Botón para abrir drawer */}
          <InterpretationButton
            onClick={() => openInterpretationDrawer('midheaven', {
              sign: midheaven.sign,
              degree: midheaven.degree
            })}
            disabled={isLoadingInterpretation}
          />
        </div>

        {/* DRAWER */}
        <InterpretationDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          content={drawerContent}
        />
      </>
    );
  }

  // =========================================================================
  // 🏠 TOOLTIP PARA CASAS (sin drawer, se mantiene como está)
  // =========================================================================
  if (hoveredHouse) {
    return (
      <div 
        className="fixed bg-gradient-to-r from-blue-500/95 to-cyan-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-sm pointer-events-none z-[99998]"
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

export default ChartTooltipsWithDrawer;