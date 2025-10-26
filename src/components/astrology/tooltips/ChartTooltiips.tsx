// =============================================================================
// 🎨 TOOLTIPS MEJORADOS CON PSICOLOGÍA PROFUNDA
// src/components/astrology/tooltips/ChartTooltips.tsx
// =============================================================================

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

// ✅ IMPORTAR NUEVOS MENSAJES PSICOLÓGICOS
import {
  ascendantPsychology,
  midheavenPsychology,
  planetPsychology,
  aspectPsychology
} from '../../../constants/astrology/psychologicalTooltips';

interface ChartTooltipsProps {
  hoveredPlanet: string | null;
  hoveredAspect: string | null;
  hoveredHouse: number | null;
  hoveredNavGuide: boolean;
  
  planets: Planet[];
  calculatedAspects: CalculatedAspect[];
  ascendant?: { longitude?: number; sign?: string; degree?: number };
  midheaven?: { longitude?: number; sign?: string; degree?: number };
  
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
  // 🎭 TOOLTIP ASCENDENTE (MEJORADO)
  // =============================================================================
  
  if (hoveredPlanet === 'Ascendente' && ascendant?.sign) {
    const psychData = ascendantPsychology[ascendant.sign];
    
    return (
      <div 
        className="fixed bg-gradient-to-r from-green-500/95 to-emerald-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-md pointer-events-none"
        style={{ 
          left: tooltipPosition.x + 25,
          top: tooltipPosition.y - 50,
          zIndex: 99999,
          transform: tooltipPosition.x > window.innerWidth - 350 ? 'translateX(-100%)' : 'none'
        }}
      >
        {/* Header */}
        <div className="flex items-center mb-3 border-b border-white/20 pb-2">
          <span className="text-3xl mr-3">🎭</span>
          <div>
            <div className="text-white font-bold text-lg">Ascendente</div>
            <div className="text-emerald-200 text-sm">
              {ascendant.sign} {ascendant.degree}°
            </div>
          </div>
        </div>

        {psychData && (
          <>
            {/* Título del patrón */}
            <div className="bg-white/10 rounded-lg p-2 mb-3">
              <div className="text-yellow-300 text-sm font-bold">{psychData.title}</div>
            </div>

            {/* Esencia */}
            <div className="mb-2">
              <div className="text-white text-xs font-semibold mb-1">✨ Tu Máscara Social:</div>
              <div className="text-emerald-100 text-xs leading-relaxed">
                {psychData.essence}
              </div>
            </div>

            {/* Proyección */}
            <div className="mb-2">
              <div className="text-white text-xs font-semibold mb-1">👁️ Cómo Te Ven:</div>
<div className="text-emerald-100 text-xs leading-relaxed">
{psychData.projection}
</div>
</div>{/* Sombra */}
        <div className="bg-red-400/20 rounded-lg p-2 mt-2">
          <div className="text-red-300 text-xs font-semibold mb-1">⚠️ Tu Sombra:</div>
          <div className="text-red-200 text-xs leading-relaxed">
            {psychData.shadow}
          </div>
        </div>
      </>
    )}
  </div>
);}
// =============================================================================
// 🎯 TOOLTIP MEDIO CIELO (MEJORADO)
// =============================================================================
// 
if (hoveredPlanet === 'Medio Cielo' && midheaven?.sign) {
const psychData = midheavenPsychology[midheaven.sign];
return (
  <div 
    className="fixed bg-gradient-to-r from-blue-500/95 to-indigo-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-md pointer-events-none"
    style={{ 
      left: tooltipPosition.x + 25,
      top: tooltipPosition.y - 50,
      zIndex: 99999,
      transform: tooltipPosition.x > window.innerWidth - 350 ? 'translateX(-100%)' : 'none'
    }}
  >
    {/* Header */}
    <div className="flex items-center mb-3 border-b border-white/20 pb-2">
      <span className="text-3xl mr-3">🎯</span>
      <div>
        <div className="text-white font-bold text-lg">Medio Cielo</div>
        <div className="text-blue-200 text-sm">
          {midheaven.sign} {midheaven.degree}°
        </div>
      </div>
    </div>

    {psychData && (
      <>
        {/* Título del patrón */}
        <div className="bg-white/10 rounded-lg p-2 mb-3">
          <div className="text-yellow-300 text-sm font-bold">{psychData.title}</div>
        </div>

        {/* Vocación */}
        <div className="mb-2">
          <div className="text-white text-xs font-semibold mb-1">🌟 Tu Vocación:</div>
          <div className="text-blue-100 text-xs leading-relaxed">
            {psychData.vocation}
          </div>
        </div>

        {/* Legado */}
        <div className="mb-2">
          <div className="text-white text-xs font-semibold mb-1">👑 Tu Legado:</div>
          <div className="text-blue-100 text-xs leading-relaxed">
            {psychData.legacy}
          </div>
        </div>

        {/* Realización */}
        <div className="bg-green-400/20 rounded-lg p-2 mt-2">
          <div className="text-green-300 text-xs font-semibold mb-1">💚 Te Realizas Cuando:</div>
          <div className="text-green-200 text-xs leading-relaxed">
            {psychData.fulfillment}
          </div>
        </div>
      </>
    )}
  </div>
);
}
// =============================================================================
// 🪐 TOOLTIP PLANETA (MEJORADO)
// =============================================================================
if (hoveredPlanet && hoveredPlanet !== 'Ascendente' && hoveredPlanet !== 'Medio Cielo') {
const planet = planets.find(p => p.name === hoveredPlanet);
if (!planet) return null;
const psychData = planetPsychology[hoveredPlanet];

return (
  <div 
    className="fixed bg-gradient-to-r from-purple-500/95 to-pink-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-md pointer-events-none"
    style={{ 
      left: tooltipPosition.x + 25,
      top: tooltipPosition.y - 50,
      zIndex: 99999,
      transform: tooltipPosition.x > window.innerWidth - 350 ? 'translateX(-100%)' : 'none'
    }}
  >
    {/* Header */}
    <div className="flex items-center mb-3 border-b border-white/20 pb-2">
      <span className="text-3xl mr-3">
        {PLANET_SYMBOLS[hoveredPlanet] || '●'}
      </span>
      <div>
        <div className="text-white font-bold text-lg">{hoveredPlanet}</div>
        <div className="text-purple-200 text-sm">
          {planet.sign} {Math.floor(planet.degree)}° - Casa {planet.house}
        </div>
      </div>
    </div>

    {psychData && (
      <>
        {/* Esencia */}
        <div className="bg-white/10 rounded-lg p-2 mb-3">
          <div className="text-yellow-300 text-sm font-bold">{psychData.essence}</div>
        </div>

        {/* Luz */}
        <div className="mb-2">
          <div className="text-white text-xs font-semibold mb-1">✨ Tu Luz:</div>
          <div className="text-purple-100 text-xs leading-relaxed">
            {psychData.light}
          </div>
        </div>

        {/* Sombra */}
        <div className="mb-2">
          <div className="text-white text-xs font-semibold mb-1">🌑 Tu Sombra:</div>
          <div className="text-red-200 text-xs leading-relaxed">
            {psychData.shadow}
          </div>
        </div>

        {/* Superpoder */}
        <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg p-2 mb-2 border border-yellow-400/40">
          <div className="text-yellow-300 text-xs font-semibold mb-1">🎁 Superpoder:</div>
          <div className="text-yellow-100 text-xs leading-relaxed font-medium">
            {psychData.superpower}
          </div>
        </div>

        {/* Integración */}
        <div className="bg-green-400/20 rounded-lg p-2 border border-green-400/40">
          <div className="text-green-300 text-xs font-semibold mb-1">🌱 Integración:</div>
          <div className="text-green-200 text-xs leading-relaxed">
            {psychData.integration}
          </div>
        </div>
      </>
    )}

    {/* Retrógrado */}
    {planet.retrograde && (
      <div className="bg-red-400/20 rounded-lg p-2 mt-2 border border-red-400/40">
        <div className="text-red-300 text-xs font-semibold">♻️ Retrógrado</div>
        <div className="text-red-200 text-xs">Energía internalizada. Revisión profunda de este planeta.</div>
      </div>
    )}
  </div>
);
}
// =============================================================================
// ⚡ TOOLTIP ASPECTO (MEJORADO)
// =============================================================================
if (hoveredAspect && calculatedAspects.length > 0) {
const currentAspect = calculatedAspects.find(aspect =>
`${aspect.planet1}-${aspect.planet2}-${aspect.type}` === hoveredAspect
);
if (!currentAspect) return null;

// Buscar patrón psicológico
const aspectKey = `${currentAspect.planet1}-${currentAspect.planet2}`;
const psychData = aspectPsychology[aspectKey];

return (
  <div 
    className="fixed bg-gradient-to-r from-purple-500/95 to-pink-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-lg pointer-events-none"
    style={{ 
      left: tooltipPosition.x, 
      top: tooltipPosition.y,
      zIndex: 99999,
      transform: tooltipPosition.x > window.innerWidth - 400 ? 'translateX(-100%)' : 'none'
    }}
  >
    {/* Header */}
    <div className="flex items-center mb-3 border-b border-white/20 pb-2">
      <div 
        className="w-6 h-6 rounded-full mr-3" 
        style={{ backgroundColor: currentAspect.config?.color || '#666' }}
      ></div>
      <div>
        <div className="text-white font-bold text-base">
          {currentAspect.config?.name || currentAspect.type}
        </div>
        <div className="text-gray-200 text-sm">
          {currentAspect.planet1} - {currentAspect.planet2}
        </div>
        <div className="text-gray-300 text-xs">
          Orbe: {currentAspect.orb.toFixed(2)}° {currentAspect.exact && '⭐ EXACTO'}
        </div>
      </div>
    </div>

    {psychData ? (
      <>
        {/* Nombre del patrón */}
        <div className="bg-white/10 rounded-lg p-2 mb-3">
          <div className="text-yellow-300 text-sm font-bold">{psychData.pattern_name}</div>
        </div>

        {/* Tensión */}
        <div className="mb-2">
          <div className="text-white text-xs font-semibold mb-1">🔥 La Tensión:</div>
          <div className="text-purple-100 text-xs leading-relaxed">
            {psychData.tension}
          </div>
        </div>

        {/* Cómo se manifiesta */}
        <div className="mb-2">
          <div className="text-white text-xs font-semibold mb-1">👁️ Cómo Se Manifiesta:</div>
          <div className="text-purple-100 text-xs space-y-1">
            {psychData.manifestation.map((item, idx) => (
              <div key={idx} className="flex items-start">
                <span className="text-pink-400 mr-1">→</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Evolución */}
        <div className="bg-green-400/20 rounded-lg p-2 mb-2 border border-green-400/40">
          <div className="text-green-300 text-xs font-semibold mb-1">🌱 Tu Evolución:</div>
          <div className="text-green-200 text-xs leading-relaxed">
            {psychData.evolution}
          </div>
        </div>

        {/* Regalo cuando integras */}
        <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg p-2 border border-yellow-400/40">
          <div className="text-yellow-300 text-xs font-semibold mb-1">🎁 Regalo al Integrar:</div>
          <div className="text-yellow-100 text-xs leading-relaxed font-medium">
            {psychData.gift_when_integrated}
          </div>
        </div>
      </>
    ) : (
      /* Fallback si no hay patrón específico */
      <div className="mb-2">
        <div className="text-white text-xs font-semibold mb-1">🎯 Significado:</div>
        <div className="text-gray-200 text-xs leading-relaxed">
          {aspectMeanings[currentAspect.type as keyof typeof aspectMeanings]?.meaning || 
           `Aspecto ${currentAspect.type} entre ${currentAspect.planet1} y ${currentAspect.planet2}`}
        </div>
      </div>
    )}

    {/* Indicador de exactitud */}
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

}
// =============================================================================
// 🏠 TOOLTIP CASA (mantener original)
// =============================================================================
if (hoveredHouse !== null) {
return (
<div
className="fixed bg-gradient-to-r from-indigo-500/95 to-purple-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-3 shadow-2xl max-w-xs pointer-events-none"
style={{
left: tooltipPosition.x + 15,
top: tooltipPosition.y - 30,
zIndex: 99999,
transform: tooltipPosition.x > window.innerWidth - 250 ? 'translateX(-100%)' : 'none'
}}
>
<div className="text-white font-bold text-sm mb-1">Casa {hoveredHouse}</div>
<div className="text-indigo-100 text-xs">
{houseMeanings[hoveredHouse as keyof typeof houseMeanings]?.meaning || 'Área de vida'}
</div>
</div>
);
}
// =============================================================================
// 🧭 TOOLTIP NAVEGACIÓN (mantener original)
// =============================================================================
if (hoveredNavGuide) {
return (
<div
className="fixed bg-gradient-to-r from-gray-800/95 to-gray-900/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-sm pointer-events-none"
style={{
left: tooltipPosition.x + 25,
top: tooltipPosition.y - 50,
zIndex: 99999
}}
>
<div className="text-white font-bold text-sm mb-2">🧭 Cómo Navegar la Carta</div>
<div className="text-gray-300 text-xs space-y-1">
<div>• Pasa el cursor sobre planetas para ver detalles</div>
<div>• Haz click en aspectos para ver relaciones</div>
<div>• Usa el menú lateral para filtrar información</div>
</div>
</div>
);
}
return null;
};
export default ChartTooltips;