'use client';

import React from 'react';

// ✅ IMPORTACIONES MODULARIZADAS
import type { ChartDisplayProps } from '../../types/astrology/chartDisplay';
import { useChartDisplay } from '../../hooks/astrology/useChartDisplay';

// ✅ COMPONENTES EXTRAÍDOS
import SectionMenu from './SectionMenu';
import BirthDataCard from './BirthDataCard';
import AscendantCard from './AscendantCard';
import MidheavenCard from './MidheavenCard';
import AspectControlPanel from './AspectControlPanel';
import ChartTooltips from './ChartTooltips';

// ✅ SERVICIOS EXTRAÍDOS
import { ChartRenderingService } from '../../services/chartRenderingService';
import { 
  getPersonalizedPlanetInterpretation, 
  getPersonalizedAspectInterpretation 
} from '../../services/chartInterpretationsService';

// ✅ CONSTANTES
import { 
  PLANET_SYMBOLS, 
  PLANET_COLORS, 
  SIGN_SYMBOLS,
  aspectMeanings,
  planetMeanings,
  signMeanings,
  houseMeanings 
} from '../../constants/astrology/chartConstants';

const ChartDisplay: React.FC<ChartDisplayProps> = ({
  houses = [],
  planets = [],
  elementDistribution = { fire: 0, earth: 0, air: 0, water: 0 },
  modalityDistribution = { cardinal: 0, fixed: 0, mutable: 0 },
  keyAspects = [],
  ascendant,
  midheaven,
  birthData
}) => {
  
  // ✅ USAR HOOK PERSONALIZADO PARA TODA LA LÓGICA DE ESTADO
  const {
    showAspects,
    setShowAspects,
    selectedAspectTypes,
    hoveredAspect,
    setHoveredAspect,
    calculatedAspects,
    hoveredPlanet,
    setHoveredPlanet,
    hoveredHouse,
    setHoveredHouse,
    tooltipPosition,
    hoveredNavGuide,
    setHoveredNavGuide,
    activeSection,
    handleMouseMove,
    scrollToSection,
    toggleAspectType,
    aspectStats,
    filteredAspects,
    normalizedPlanets,
    handleAspectHover,
    handlePlanetHover,
    handleHouseHover
  } = useChartDisplay({
    planets,
    initialActiveSection: 'carta-visual',
    initialShowAspects: true,
    initialSelectedAspectTypes: {
      major: true,
      minor: false,
      hard: true,
      easy: true
    }
  });

  // ✅ MANTENER FUNCIONES ESPECÍFICAS DE RENDERIZADO
  const renderMainChart = () => (
    <div className="bg-gradient-to-br from-black/50 to-purple-900/30 backdrop-blur-sm border border-white/20 rounded-3xl p-8 relative overflow-hidden">
      <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
      
      <div className="flex justify-center">
        <svg
          width="600"
          height="600"
          viewBox="0 0 500 500"
          className="border border-white/20 rounded-full bg-gradient-to-br from-indigo-950/50 via-purple-900/30 to-black/50 backdrop-blur-sm"
        >
          {/* Círculos base */}
          {ChartRenderingService.renderBaseCircles()}
          
          {/* Aspectos */}
          {ChartRenderingService.renderAspectLines(
            filteredAspects,
            normalizedPlanets,
            selectedAspectTypes,
            showAspects,
            hoveredAspect,
            handleAspectHover
          )}
          
          {/* Casas */}
          {ChartRenderingService.renderHouses(
            hoveredHouse,
            handleHouseHover
          )}
          
          {/* Signos */}
          {ChartRenderingService.renderSigns()}
          
          {/* Ángulos */}
          {ChartRenderingService.renderAngles(
            ascendant,
            midheaven,
            handlePlanetHover
          )}
          
          {/* Planetas */}
          {ChartRenderingService.renderPlanets(
            normalizedPlanets,
            hoveredPlanet,
            handlePlanetHover
          )}
        </svg>
      </div>
    </div>
  );

  // ✅ RENDERIZAR ASPECTOS DETECTADOS
  const renderAspectsSection = () => {
    if (calculatedAspects.length === 0) return null;

    return (
      <div id="aspectos-detectados" className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <div className="flex items-center mb-6">
          <svg className="w-6 h-6 text-yellow-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
          <h3 className="text-xl font-bold text-white">
            Aspectos Específicos Detectados en Tu Carta ({calculatedAspects.length})
          </h3>
        </div>
        
        <div className="mb-4 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
          <div className="text-blue-200 text-sm leading-relaxed">
            <strong>💡 Interpretación:</strong> Estos son los aspectos específicos encontrados entre tus planetas. 
            Cada uno representa una dinámica energética única en tu personalidad. Los aspectos 
            <span className="bg-yellow-400 text-black px-1 rounded mx-1 font-bold">EXACTOS</span> 
            (orbe &lt; 1°) son especialmente poderosos y definen rasgos muy marcados en ti.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {calculatedAspects.slice(0, 20).map((aspect, index) => {
            const getAspectNature = (aspect: any) => {
              const difficulty = aspect.config.difficulty;
              if (difficulty === 'easy') return { label: 'Armónico', color: 'text-green-300 bg-green-400/20', icon: '✨' };
              if (difficulty === 'hard') return { label: 'Tenso', color: 'text-red-300 bg-red-400/20', icon: '⚡' };
              if (difficulty === 'neutral') return { label: 'Neutro', color: 'text-yellow-300 bg-yellow-400/20', icon: '🔥' };
              return { label: 'Menor', color: 'text-purple-300 bg-purple-400/20', icon: '🌟' };
            };

            const nature = getAspectNature(aspect);
            
            return (
              <div 
                key={index}
                className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10 cursor-pointer hover:border-white/20 transition-all duration-200 group relative"
                onMouseEnter={(e) => handleAspectHover(`${aspect.planet1}-${aspect.planet2}-${aspect.type}`, e)}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => handleAspectHover(null)}
                style={{ position: 'relative', zIndex: 1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold text-sm">
                    {aspect.planet1} - {aspect.planet2}
                  </span>
                  <div className="flex items-center space-x-2">
                    {aspect.exact && (
                      <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                        EXACTO
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center mb-2">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: aspect.config.color }}
                  ></div>
                  <span className="text-gray-300 text-sm">{aspect.config.name}</span>
                </div>

                <div className="flex items-center mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${nature.color} border border-current/30`}>
                    {nature.icon} {nature.label}
                  </span>
                </div>
                
                <div className="text-gray-400 text-xs">
                  Orbe: {aspect.orb.toFixed(2)}° | Ángulo: {aspect.angle.toFixed(1)}°
                </div>
                
                <div className="mt-2 text-cyan-200 text-xs leading-relaxed">
                  {getPersonalizedAspectInterpretation(aspect).substring(0, 100)}...
                </div>
              </div>
            );
          })}
        </div>
        
        {calculatedAspects.length > 20 && (
          <div className="mt-4 text-center">
            <div className="text-gray-400 text-sm">
              Se muestran los primeros 20 aspectos de {calculatedAspects.length} encontrados. 
              Los aspectos se ordenan por precisión (orbe menor = más importante).
            </div>
          </div>
        )}
      </div>
    );
  };

  // ✅ RENDERIZAR POSICIONES PLANETARIAS
  const renderPlanetsSection = () => (
    <div id="posiciones-planetarias" className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
      <div className="flex items-center mb-6">
        <svg className="w-6 h-6 text-yellow-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <h3 className="text-xl font-bold text-white">Posiciones Planetarias - Tus Energías Básicas</h3>
      </div>
      
      <div className="mb-4 p-4 bg-purple-500/10 border border-purple-400/30 rounded-lg">
        <div className="text-purple-200 text-sm leading-relaxed">
          <strong>🌟 Guía:</strong> Cada planeta representa una energía específica en tu personalidad. 
          El signo muestra <em>cómo</em> expresas esa energía, y la casa indica <em>dónde</em> la manifiestas en tu vida. 
          Pasa el cursor sobre cada planeta para interpretaciones personalizadas.
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {normalizedPlanets.map((planet, index) => (
          planet ? (
            <div 
              key={index} 
              className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10 cursor-pointer hover:border-white/20 transition-all duration-200"
              onMouseEnter={(e) => handlePlanetHover(planet.name, e)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => handlePlanetHover(null)}
            >
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3" style={{ color: PLANET_COLORS[planet.name] || '#ffffff' }}>
                  {PLANET_SYMBOLS[planet.name] || '●'}
                </span>
                <div className="flex-1">
                  <div className="text-white font-semibold">{planet.name}</div>
                  <div className="text-gray-400 text-sm">
                    {(planet?.degree ?? 0)}° {planet?.sign ?? ''}
                    {planet.retrograde && <span className="text-red-400 ml-1 animate-pulse">R</span>}
                  </div>
                </div>
              </div>
              
              <div className="text-gray-500 text-xs mb-2">
                Casa {planet.house} | {SIGN_SYMBOLS[planet.sign] || ''} {signMeanings[planet.sign as keyof typeof signMeanings]}
              </div>
              
              <div className="text-cyan-200 text-xs leading-relaxed">
                <strong>Significado:</strong> {planetMeanings[planet.name as keyof typeof planetMeanings]?.meaning.substring(0, 60)}...
              </div>
              
              <div className="mt-2 flex flex-wrap gap-1">
{planetMeanings[planet.name as keyof typeof planetMeanings]?.keywords.split(',').slice(0, 2).map((keyword: string, i: number) => (
  <span key={i} className="bg-purple-400/20 text-purple-200 text-xs px-2 py-1 rounded-full">
    {keyword.trim()}
  </span>
))}
              </div>
            </div>
          ) : null
        ))}
      </div>
    </div>
  );

  // ✅ RENDERIZAR SECCIONES EDUCATIVAS
  const renderEducationalSections = () => (
    <div className="space-y-8">
      <div className="p-6 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-xl border border-indigo-400/30">
        <div className="text-center mb-6">
          <h4 className="text-white font-bold text-xl mb-3">
            <svg className="w-6 h-6 inline mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            Resumen de Aspectos - Cómo interactúan tus energías planetarias
          </h4>
          <div className="text-indigo-200 text-base mb-4">Comprende las dinámicas internas de tu personalidad a través de los aspectos astrológicos</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div className="text-center p-4 bg-green-400/10 rounded-xl border border-green-400/30">
            <div className="text-green-300 font-bold text-xl mb-3 flex items-center justify-center">
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
              Aspectos Armónicos
            </div>
            <div className="text-green-200 text-sm mb-2 font-semibold">Trígono (120°), Sextil (60°), Semisextil (30°)</div>
            <div className="text-green-100 text-xs leading-relaxed">
              <strong>🌟 Qué significan:</strong> Son tus facilidades naturales, talentos innatos y energías que fluyen sin esfuerzo. 
              Representan las áreas donde tienes habilidades naturales y donde las cosas te salen más fácil.
            </div>
            <div className="text-green-200 text-xs mt-2 font-medium">✨ En tu vida: Aprovecha estos aspectos para desarrollar tus fortalezas</div>
          </div>
          
          <div className="text-center p-4 bg-red-400/10 rounded-xl border border-red-400/30">
            <div className="text-red-300 font-bold text-xl mb-3 flex items-center justify-center">
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
              </svg>
              Aspectos Tensos
            </div>
            <div className="text-red-200 text-sm mb-2 font-semibold">Cuadratura (90°), Oposición (180°), Quincuncio (150°)</div>
            <div className="text-red-100 text-xs leading-relaxed">
              <strong>⚡ Qué significan:</strong> Son tus desafíos internos que generan crecimiento. Crean tensión creativa que te impulsa 
              a evolucionar y desarrollar nuevas capacidades. Son tu motor de transformación personal.
            </div>
            <div className="text-red-200 text-xs mt-2 font-medium">🚀 En tu vida: Abraza estos desafíos como oportunidades de crecimiento</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-400/10 rounded-xl border border-yellow-400/30">
            <div className="text-yellow-300 font-bold text-xl mb-3 flex items-center justify-center">
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
              Aspectos Especiales
            </div>
            <div className="text-yellow-200 text-sm mb-2 font-semibold">Conjunción (0°), Aspectos Menores</div>
            <div className="text-yellow-100 text-xs leading-relaxed">
              <strong>🔥 Qué significan:</strong> Las conjunciones fusionan energías planetarias creando una fuerza unificada muy potente. 
              Los aspectos menores añaden matices y sutilezas a tu personalidad.
            </div>
            <div className="text-yellow-200 text-xs mt-2 font-medium">💫 En tu vida: Reconoce estas energías intensas y únicas en ti</div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-yellow-400/15 border border-yellow-400/40 rounded-xl">
        <div className="text-center mb-4">
          <div className="text-yellow-300 font-bold text-xl mb-2 flex items-center justify-center">
            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
            ¿Qué son los Aspectos EXACTOS?
          </div>
        </div>
        
        <div className="text-yellow-100 text-sm leading-relaxed max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-semibold mb-2 text-yellow-200">🎯 Definición:</div>
              <div className="mb-4">
                Un aspecto se considera <span className="bg-yellow-400 text-black px-2 py-1 rounded font-bold">EXACTO</span> cuando 
                el orbe (diferencia angular) es menor a <span className="font-semibold text-yellow-200">1 grado</span>. 
                Esto significa que los planetas están casi en el ángulo perfecto del aspecto.
              </div>
              
              <div className="font-semibold mb-2 text-yellow-200">⚡ Intensidad:</div>
              <div>
                Los aspectos exactos tienen <span className="font-semibold text-yellow-200">máxima potencia energética</span> 
                y representan las influencias <span className="font-semibold text-yellow-200">más poderosas y definitorias</span> 
                en tu personalidad y destino.
              </div>
            </div>
            
            <div>
              <div className="font-semibold mb-2 text-yellow-200">🌟 En tu carta:</div>
              <div className="mb-4">
                Si tienes aspectos exactos, estas energías planetarias están <span className="font-semibold text-yellow-200">perfectamente sincronizadas</span> 
                en tu ser. Son como "superpoderes astrológicos" que definen rasgos muy marcados de tu personalidad.
              </div>
              
              <div className="font-semibold mb-2 text-yellow-200">💫 Importancia:</div>
              <div>
                Presta especial atención a tus aspectos exactos: son las <span className="font-semibold text-yellow-200">claves maestras</span> 
                para entender tu naturaleza más profunda y tus potenciales más desarrollados.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ✅ RENDER PRINCIPAL - USANDO TODOS LOS COMPONENTES EXTRAÍDOS
  return (
    <div className="space-y-8 relative">
      {/* 🧭 HEADER ESTILO DASHBOARD */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-6 mt-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-400">Carta Activa</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Interpretando</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <span className="text-sm text-gray-400">Personalizada</span>
            </div>
            
            <div className="relative" style={{ zIndex: 100000 }}>
              <svg 
                className="w-5 h-5 text-blue-400 cursor-help hover:text-blue-300 transition-colors duration-200"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                onMouseEnter={(e) => {
                  setHoveredNavGuide(true);
                  const rect = e.currentTarget.getBoundingClientRect();
                  handleMouseMove({ clientX: rect.left - 300, clientY: rect.top - 20 } as React.MouseEvent);
                }}
                onMouseLeave={() => setHoveredNavGuide(false)}
              >
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ✨ MENÚ DE NAVEGACIÓN PRINCIPAL */}
      <SectionMenu activeSection={activeSection} scrollToSection={scrollToSection} />

      {/* 🎯 SECCIÓN: TRES CARDS PRINCIPALES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <BirthDataCard birthData={birthData} ascendant={ascendant} />
        <AscendantCard ascendant={ascendant} />
        <MidheavenCard midheaven={midheaven} />
      </div>

      {/* 🎯 SECCIÓN 1: CARTA VISUAL */}
      <div id="carta-visual" className="space-y-8">
        {/* ✅ PANEL DE CONTROL DE ASPECTOS EXTRAÍDO */}
        <AspectControlPanel
          showAspects={showAspects}
          setShowAspects={setShowAspects}
          selectedAspectTypes={selectedAspectTypes}
          toggleAspectType={toggleAspectType}
          aspectStats={aspectStats}
        />

        {/* 🎨 CARTA NATAL PRINCIPAL */}
        {renderMainChart()}
      </div>

      {/* 🎯 SECCIÓN 2: ASPECTOS DETECTADOS */}
      {renderAspectsSection()}

      {/* 🎯 SECCIÓN 3: POSICIONES PLANETARIAS */}
      {renderPlanetsSection()}

      {/* 📊 SECCIONES EDUCATIVAS */}
      {renderEducationalSections()}

      {/* 🎯 TODOS LOS TOOLTIPS DINÁMICOS */}
      <ChartTooltips
        hoveredPlanet={hoveredPlanet}
        hoveredAspect={hoveredAspect}
        hoveredHouse={hoveredHouse}
        planets={normalizedPlanets}
        calculatedAspects={calculatedAspects}
        ascendant={ascendant}
        midheaven={midheaven}
        tooltipPosition={tooltipPosition}
        setHoveredPlanet={setHoveredPlanet}
        setHoveredAspect={setHoveredAspect}
        setHoveredHouse={setHoveredHouse}
      />

      {/* Debug info */}
      <div className="bg-black/30 rounded-xl p-4 text-xs text-gray-400">
        <div>🔍 Planetas: {planets.length} | Casas: {houses.length} | Aspectos: {calculatedAspects.length}</div>
        <div>🔺 Ascendente: {ascendant?.sign || 'N/A'} | MC: {midheaven?.sign || 'N/A'}</div>
        <div className="mt-2 text-yellow-300">💡 <strong>Tip:</strong> Pasa el cursor sobre elementos para interpretaciones personalizadas</div>
      </div>
    </div>
  );
};

export default ChartDisplay;