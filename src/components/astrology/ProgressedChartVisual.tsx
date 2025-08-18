// src/components/astrology/ProgressedChartVisual.tsx - VERSIÓN EDUCATIVA COMPLETA
'use client';

import React, { useState } from 'react';
import ChartDisplay from '@/components/astrology/ChartDisplay';
import { 
  TrendingUp, 
  Calendar, 
  Target,
  Info,
  Settings,
  MapPin,
  Star,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  Eye,
  BookOpen,
  Lightbulb,
  Zap,
  RefreshCw,
  HelpCircle,
  Brain
} from 'lucide-react';

// ✅ IMPORTAR CONSTANTES EDUCATIVAS
import { 
  progressedPlanetMeanings, 
  progressedChartEducation, 
  lifePhases,
  progressedAspectMeanings,
  progressedTooltips
} from '@/constants/astrology/progressedChartConstants';

// ✅ INTERFACE PARA CARTA PROGRESADA ESPECÍFICA
interface ProgressedChartData {
  houses: any[];
  planets: any[];
  aspects: any[];
  elementDistribution: { fire: number; earth: number; air: number; water: number };
  modalityDistribution: { cardinal: number; fixed: number; mutable: number };
  keyAspects: any[];
  ascendant?: { longitude?: number; sign?: string; degree?: number };
  midheaven?: { longitude?: number; sign?: string; degree?: number };
  progressionInfo: {
    year: number;
    period: string;
    description: string;
    startDate: string;
    endDate: string;
    ageAtStart: number;
    isCurrentYear: boolean;
    progressionDate?: string;
    progressionTime?: string;
  };
  birthData: {
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    latitude: number;
    longitude: number;
    timezone: string;
    fullName: string;
  };
  progressionLocation?: {
    progressionPlace: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  // ✅ AÑADIDO: Comparación con natal
  natalComparison?: {
    planetaryMovements: any[];
    significantChanges: any[];
    newAspects: any[];
    dissolvingAspects: any[];
  };
}

interface ProgressedChartVisualProps {
  data: ProgressedChartData;
  isLoading?: boolean;
  error?: string | null;
}

// ✅ SÍMBOLOS PLANETARIOS PARA TABLA
const planetSymbols = {
  'Sol': '☉',
  'Luna': '☽',
  'Mercurio': '☿',
  'Venus': '♀',
  'Marte': '♂',
  'Júpiter': '♃',
  'Saturno': '♄',
  'Urano': '♅',
  'Neptuno': '♆',
  'Plutón': '♇'
};

// ✅ COMPONENTE PRINCIPAL CON EDUCACIÓN COMPLETA
const ProgressedChartVisual: React.FC<ProgressedChartVisualProps> = ({
  data,
  isLoading = false,
  error = null
}) => {
  const [activeTab, setActiveTab] = useState<'education' | 'chart' | 'positions' | 'aspects' | 'evolution'>('education');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [hoveredAspect, setHoveredAspect] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  // Estados de carga y error
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-emerald-900/30 via-teal-900/20 to-cyan-900/30 backdrop-blur-sm border border-emerald-400/30 rounded-3xl p-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin text-6xl mb-4">🌙</div>
              <h3 className="text-xl font-bold text-white mb-2">Calculando Progresiones</h3>
              <p className="text-emerald-200">Procesando tu evolución astrológica...</p>
              <div className="mt-4 flex justify-center">
                <div className="animate-pulse text-emerald-300">
                  Analizando {data?.progressionInfo?.ageAtStart || 0} años de crecimiento interno
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 backdrop-blur-sm border border-red-400/30 rounded-3xl p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-white mb-2">Error en Carta Progresada</h3>
          <p className="text-red-200 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2 inline" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-gradient-to-br from-gray-900/30 to-slate-900/30 backdrop-blur-sm border border-gray-600/30 rounded-3xl p-8">
        <div className="text-center">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No hay datos de progresión</h3>
          <p className="text-gray-300">Genera tu carta progresada para ver tu evolución astrológica</p>
        </div>
      </div>
    );
  }

  // ✅ FUNCIÓN: Determinar fase de vida
  const getLifePhase = (age: number) => {
    if (age < 30) return lifePhases.youngAdult;
    if (age < 40) return lifePhases.earlyMaturity;
    if (age < 50) return lifePhases.midlife;
    return lifePhases.matureWisdom;
  };

  const currentLifePhase = getLifePhase(data.progressionInfo.ageAtStart);

  return (
    <div className="space-y-8">
      {/* ✅ HEADER EDUCATIVO PRINCIPAL */}
      <div className="bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-blue-900/40 backdrop-blur-sm border border-purple-400/30 rounded-3xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-purple-400 mr-3" />
            Tu Carta Progresada - Evolución Interna
          </h2>
          
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/20 rounded-xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="text-center">
                <div className="text-purple-300 font-semibold mb-1">Tu Edad Actual</div>
                <div className="text-white text-2xl font-bold">{data.progressionInfo.ageAtStart} años</div>
                <div className="text-purple-200 text-xs">{currentLifePhase.ageRange}</div>
              </div>
              <div className="text-center">
                <div className="text-purple-300 font-semibold mb-1">Período de Análisis</div>
                <div className="text-white text-lg">{data.progressionInfo.period}</div>
                <div className="text-purple-200 text-xs">Año solar personal</div>
              </div>
              <div className="text-center">
                <div className="text-purple-300 font-semibold mb-1">Fase de Vida</div>
                <div className="text-white text-lg font-semibold">{currentLifePhase.description.split(' - ')[0]}</div>
                <div className="text-purple-200 text-xs">{currentLifePhase.focus.substring(0, 30)}...</div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ NAVEGACIÓN EDUCATIVA */}
        <div className="flex justify-center mt-8">
          <div className="bg-black/30 rounded-xl p-1 flex flex-wrap justify-center gap-1">
            <button
              onClick={() => setActiveTab('education')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                activeTab === 'education'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              ¿Qué es esto?
            </button>
            <button
              onClick={() => setActiveTab('chart')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                activeTab === 'chart'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Target className="w-4 h-4 mr-2" />
              Carta Visual
            </button>
            <button
              onClick={() => setActiveTab('positions')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                activeTab === 'positions'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Star className="w-4 h-4 mr-2" />
              Planetas Progresados
            </button>
            <button
              onClick={() => setActiveTab('aspects')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                activeTab === 'aspects'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 mr-2" />
              Aspectos Nuevos
            </button>
            <button
              onClick={() => setActiveTab('evolution')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                activeTab === 'evolution'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Brain className="w-4 h-4 mr-2" />
              Tu Evolución
            </button>
          </div>
        </div>
      </div>

      {/* ✅ TAB: EDUCACIÓN PRINCIPAL */}
      {activeTab === 'education' && (
        <div className="space-y-8">
          {/* Concepto principal */}
          <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-sm border border-blue-400/20 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Lightbulb className="w-6 h-6 text-blue-400 mr-3" />
              {progressedChartEducation.mainConcept.title}
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-blue-100 text-lg leading-relaxed">
                  {progressedChartEducation.mainConcept.explanation}
                </p>
                
                <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-6">
                  <h4 className="text-blue-300 font-semibold mb-3 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analogía fácil de entender
                  </h4>
                  <p className="text-blue-100 italic">
                    "{progressedChartEducation.mainConcept.analogy}"
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-blue-300 font-semibold text-xl mb-4">
                  ¿Cómo funciona para ti?
                </h4>
                
                <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-4">
                  <div className="text-green-300 font-semibold mb-2">Tu caso específico:</div>
                  <div className="text-green-100 text-sm space-y-1">
                    <p>• Naciste: {new Date(data.birthData.birthDate).toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                    <p>• Edad actual: {data.progressionInfo.ageAtStart} años</p>
                    <p>• Progresión calculada: {data.progressionInfo.ageAtStart} días después de tu nacimiento</p>
                    <p>• Válida para tu año solar: {data.progressionInfo.period}</p>
                  </div>
                </div>
                
                <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-xl p-4">
                  <div className="text-yellow-300 font-semibold mb-2">Tu fase de vida actual:</div>
                  <div className="text-yellow-100 text-sm">
                    <p className="font-medium">{currentLifePhase.description}</p>
                    <p className="mt-2 text-xs">{currentLifePhase.focus}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Diferencias Natal vs Progresada */}
          <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 backdrop-blur-sm border border-emerald-400/20 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <ArrowRight className="w-6 h-6 text-emerald-400 mr-3" />
              {progressedChartEducation.differences.title}
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Carta Natal */}
              <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-6">
                <h4 className="text-blue-300 font-bold text-xl mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  {progressedChartEducation.differences.natal.what}
                </h4>
                <div className="space-y-3 text-blue-100">
                  <div>
                    <div className="font-semibold text-blue-200">Representa:</div>
                    <div className="text-sm">{progressedChartEducation.differences.natal.represents}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-200">Cambia:</div>
                    <div className="text-sm font-bold text-blue-300">{progressedChartEducation.differences.natal.changes}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-200">Se usa para:</div>
                    <div className="text-sm">{progressedChartEducation.differences.natal.use}</div>
                  </div>
                </div>
              </div>

              {/* Carta Progresada */}
              <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-xl p-6">
                <h4 className="text-emerald-300 font-bold text-xl mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  {progressedChartEducation.differences.progressed.what}
                </h4>
                <div className="space-y-3 text-emerald-100">
                  <div>
                    <div className="font-semibold text-emerald-200">Representa:</div>
                    <div className="text-sm">{progressedChartEducation.differences.progressed.represents}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-200">Cambia:</div>
                    <div className="text-sm font-bold text-emerald-300">{progressedChartEducation.differences.progressed.changes}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-200">Se usa para:</div>
                    <div className="text-sm">{progressedChartEducation.differences.progressed.use}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interpretación de cambios */}
            <div className="mt-8 bg-purple-500/10 border border-purple-400/20 rounded-xl p-6">
              <h4 className="text-purple-300 font-semibold text-lg mb-4 flex items-center">
                <HelpCircle className="w-5 h-5 mr-2" />
                Cómo interpretar las diferencias en tu carta
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <div className="bg-green-500/10 border border-green-400/20 rounded-lg p-3">
                    <div className="text-green-300 font-semibold mb-1">Mismo signo que natal:</div>
                    <div className="text-green-100">{progressedChartEducation.interpretation.sameSign}</div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-3">
                    <div className="text-blue-300 font-semibold mb-1">Cambió de signo:</div>
                    <div className="text-blue-100">{progressedChartEducation.interpretation.differentSign}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-lg p-3">
                    <div className="text-emerald-300 font-semibold mb-1">Aspectos nuevos:</div>
                    <div className="text-emerald-100">{progressedChartEducation.interpretation.newAspects}</div>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-400/20 rounded-lg p-3">
                    <div className="text-amber-300 font-semibold mb-1">Aspectos que se disuelven:</div>
                    <div className="text-amber-100">{progressedChartEducation.interpretation.dissolvedAspects}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ TAB: CARTA VISUAL */}
      {activeTab === 'chart' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 backdrop-blur-sm border border-red-400/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Target className="w-5 h-5 text-red-400 mr-2" />
              Tu Carta Progresada Visual
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
              <div className="text-red-200">
                <p className="mb-2">
                  • <strong 
                      className="cursor-help relative"
                      onMouseEnter={() => setHoveredAspect('outer-circle')}
                      onMouseLeave={() => setHoveredAspect(null)}
                    >
                      Círculo Exterior (Rojo):
                      {hoveredAspect === 'outer-circle' && (
                        <span className="absolute top-full left-0 mt-1 p-2 bg-black/90 rounded text-xs text-white border border-white/20 z-50 w-64">
                          Posiciones planetarias progresadas - dónde están tus planetas AHORA después de {data.progressionInfo.ageAtStart} años de evolución interna.
                        </span>
                      )}
                    </strong> Tus planetas progresados (actuales)
                </p>
                <p className="mb-2">
                  • <strong 
                      className="cursor-help relative"
                      onMouseEnter={() => setHoveredAspect('inner-circle')}
                      onMouseLeave={() => setHoveredAspect(null)}
                    >
                      Círculo Interior (Azul):
                      {hoveredAspect === 'inner-circle' && (
                        <span className="absolute top-full left-0 mt-1 p-2 bg-black/90 rounded text-xs text-white border border-white/20 z-50 w-64">
                          Tus posiciones planetarias originales del día que naciste - tu configuración base de referencia.
                        </span>
                      )}
                    </strong> Tus planetas natales (referencia)
                </p>
              </div>
              <div className="text-red-200">
                <p className="mb-2">• <strong>Líneas:</strong> Aspectos entre planetas progresados</p>
                <p className="mb-2">• <strong>Casas:</strong> Áreas de vida donde se manifiestan los cambios</p>
              </div>
            </div>
          </div>
          
          {/* Carta visual usando ChartDisplay */}
          <ChartDisplay
            houses={data.houses}
            planets={data.planets}
            aspects={data.aspects}
            elementDistribution={data.elementDistribution}
            modalityDistribution={data.modalityDistribution}
            keyAspects={data.keyAspects}
            ascendant={data.ascendant}
            midheaven={data.midheaven}
            birthData={data.birthData}
          />
        </div>
      )}

      {/* ✅ TAB: POSICIONES PLANETARIAS EDUCATIVAS */}
      {activeTab === 'positions' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm border border-indigo-400/20 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Star className="w-6 h-6 text-indigo-400 mr-3" />
              Tus Planetas Progresados - Evolución Personal
            </h3>
            
            <div className="text-indigo-100 mb-6">
              <p className="mb-2">
                Cada planeta progresado muestra cómo has evolucionado internamente en esa área de vida desde que naciste.
              </p>
              <p className="text-sm text-indigo-300">
                💡 <strong>Tip:</strong> Compara con tu carta natal para ver qué ha cambiado en tu personalidad.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.planets?.filter(planet => 
                ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte'].includes(planet.name)
              ).map((planet: any, index: number) => (
                <div 
                  key={index} 
                  className="bg-black/30 rounded-xl p-6 border border-white/10 hover:border-indigo-400/30 transition-all cursor-help"
                  onMouseEnter={() => setHoveredPlanet(planet.name)}
                  onMouseLeave={() => setHoveredPlanet(null)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">
                        {planetSymbols[planet.name as keyof typeof planetSymbols] || '●'}
                      </span>
                      <div>
                        <h4 className="text-white font-semibold text-lg">{planet.name} Progresado</h4>
                        <div className="text-indigo-300 text-sm">
                          {planet.sign} {Math.floor(planet.degree || 0)}°{Math.floor((planet.degree || 0) % 1 * 60)}'
                          {planet.retrograde && <span className="text-red-400 ml-2 animate-pulse">Retrógrado ℞</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-gray-400">Casa {planet.housePosition || planet.house}</div>
                    </div>
                  </div>

                  {/* Significado evolutivo */}
                  <div className="space-y-3">
                    <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-lg p-3">
                      <div className="text-indigo-300 font-semibold text-sm mb-1">
                        ¿Cómo has evolucionado?
                      </div>
                      <div className="text-indigo-100 text-xs leading-relaxed">
                        {progressedPlanetMeanings[planet.name]?.currentPhase || 'Evolución en progreso...'}
                      </div>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-400/20 rounded-lg p-3">
                      <div className="text-purple-300 font-semibold text-sm mb-1">
                        Áreas de vida afectadas:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {progressedPlanetMeanings[planet.name]?.lifeAreas.slice(0, 3).map((area: string, i: number) => (
                          <span key={i} className="bg-purple-400/20 text-purple-200 text-xs px-2 py-1 rounded-full">
                            {area}
                          </span>
                        )) || null}
                      </div>
                    </div>

                    {hoveredPlanet === planet.name && (
                      <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-lg p-3 animate-fadeIn">
                        <div className="text-emerald-300 font-semibold text-sm mb-1">
                          Tiempo de evolución:
                        </div>
                        <div className="text-emerald-100 text-xs">
                          {progressedPlanetMeanings[planet.name]?.timeframe || 'Consulta a un astrólogo'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Planetas transpersonales */}
            {data.planets?.filter(planet => 
              ['Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'].includes(planet.name)
            ).length > 0 && (
              <div className="mt-8">
                <h4 className="text-white font-semibold text-lg mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 text-yellow-400 mr-2" />
                  Planetas de Evolución Profunda
                </h4>
                <div className="text-yellow-100 text-sm mb-4">
                  Estos planetas cambian muy lentamente, pero cuando lo hacen marcan transformaciones profundas en tu vida.
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.planets.filter(planet => 
                    ['Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'].includes(planet.name)
                  ).map((planet: any, index: number) => (
                    <div key={index} className="bg-black/20 rounded-lg p-4 border border-yellow-400/20">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">
                          {planetSymbols[planet.name as keyof typeof planetSymbols]}
                        </span>
                        <div>
                          <div className="text-white font-medium">{planet.name}</div>
                          <div className="text-yellow-300 text-xs">{planet.sign} Casa {planet.housePosition || planet.house}</div>
                        </div>
                      </div>
                      <div className="text-yellow-100 text-xs">
                        {progressedPlanetMeanings[planet.name]?.evolutiveRole.substring(0, 50)}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ TAB: ASPECTOS NUEVOS */}
      {activeTab === 'aspects' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 backdrop-blur-sm border border-emerald-400/20 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Zap className="w-6 h-6 text-emerald-400 mr-3" />
              Aspectos en tu Carta Progresada
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-4 text-center">
                <div className="text-green-300 font-bold text-lg mb-2">
                  {progressedAspectMeanings.forming.title}
                </div>
                <div className="text-green-100 text-sm mb-3">
                  {progressedAspectMeanings.forming.meaning}
                </div>
                <div className="text-green-200 text-xs">
                  {progressedAspectMeanings.forming.significance}
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-4 text-center">
                <div className="text-blue-300 font-bold text-lg mb-2">
                  {progressedAspectMeanings.exact.title}
                </div>
                <div className="text-blue-100 text-sm mb-3">
                  {progressedAspectMeanings.exact.meaning}
                </div>
                <div className="text-blue-200 text-xs">
                  {progressedAspectMeanings.exact.significance}
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-400/20 rounded-xl p-4 text-center">
                <div className="text-amber-300 font-bold text-lg mb-2">
                  {progressedAspectMeanings.separating.title}
                </div>
                <div className="text-amber-100 text-sm mb-3">
                  {progressedAspectMeanings.separating.meaning}
                </div>
                <div className="text-amber-200 text-xs">
                  {progressedAspectMeanings.separating.significance}
                </div>
              </div>
            </div>

            {/* Lista de aspectos progresados */}
            <div className="space-y-4">
              {data.aspects && data.aspects.length > 0 ? (
                data.aspects.map((aspect: any, index: number) => (
                  <div key={index} className="bg-black/30 rounded-xl p-4 border border-white/10 hover:border-emerald-400/30 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">
                          {planetSymbols[aspect.planet1 as keyof typeof planetSymbols] || '●'}
                        </span>
                        <span className="text-white font-medium mr-3">{aspect.planet1}</span>
                        <span className="text-emerald-400 mx-3 font-semibold">{aspect.type}</span>
                        <span className="text-2xl mr-3">
                          {planetSymbols[aspect.planet2 as keyof typeof planetSymbols] || '●'}
                        </span>
                        <span className="text-white font-medium">{aspect.planet2}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-200 text-sm">
                          Orb: {aspect.orb}°
                        </div>
                        <div className="text-gray-400 text-xs">
                          {aspect.exact ? 'Exacto' : 'Aplicando'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-lg mb-2">No hay aspectos progresados detectados</div>
                  <div className="text-gray-500 text-sm">
                    Los aspectos aparecerán conforme los planetas progresen a través de sus ciclos
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ✅ TAB: TU EVOLUCIÓN */}
      {activeTab === 'evolution' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 backdrop-blur-sm border border-violet-400/20 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Brain className="w-6 h-6 text-violet-400 mr-3" />
              Tu Evolución Personal a los {data.progressionInfo.ageAtStart} Años
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Fase de vida actual */}
              <div className="bg-violet-500/10 border border-violet-400/20 rounded-xl p-6">
                <h4 className="text-violet-300 font-bold text-xl mb-4">
                  Tu Momento de Vida Actual
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="text-violet-200 font-semibold mb-2">Rango de edad:</div>
                    <div className="text-white text-lg">{currentLifePhase.ageRange}</div>
                  </div>
                  <div>
                    <div className="text-violet-200 font-semibold mb-2">Características de esta fase:</div>
                    <div className="text-violet-100 text-sm leading-relaxed">{currentLifePhase.description}</div>
                  </div>
                  <div>
                    <div className="text-violet-200 font-semibold mb-2">En qué enfocarte:</div>
                    <div className="text-violet-100 text-sm leading-relaxed">{currentLifePhase.focus}</div>
                  </div>
                </div>
              </div>

              {/* Recomendaciones personalizadas */}
              <div className="bg-pink-500/10 border border-pink-400/20 rounded-xl p-6">
                <h4 className="text-pink-300 font-bold text-xl mb-4">
                  Recomendaciones para tu Evolución
                </h4>
                <div className="space-y-3">
                  <div className="text-pink-100 text-sm">
                    <p className="mb-2">
                      🌟 <strong>Consejos específicos para tus {data.progressionInfo.ageAtStart} años:</strong>
                    </p>
                    <p className="mb-3">
                      {progressedTooltips.ageRelevance(data.progressionInfo.ageAtStart)}
                    </p>
                  </div>
                  
                  <div className="bg-pink-400/10 border border-pink-300/20 rounded-lg p-3">
                    <div className="text-pink-200 font-semibold text-sm mb-2">
                      ⏰ Validez temporal:
                    </div>
                    <div className="text-pink-100 text-xs">
                      {progressedTooltips.timeRelevance}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparación con natal si está disponible */}
            {data.natalComparison && (
              <div className="mt-8 bg-indigo-500/10 border border-indigo-400/20 rounded-xl p-6">
                <h4 className="text-indigo-300 font-bold text-lg mb-4 flex items-center">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Comparación con tu Carta Natal
                </h4>
                
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors mb-4"
                >
                  {showComparison ? 'Ocultar' : 'Mostrar'} Comparación Detallada
                </button>

                {showComparison && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.natalComparison.significantChanges?.length > 0 && (
                      <div>
                        <h5 className="text-indigo-200 font-semibold mb-3">Cambios Significativos:</h5>
                        <div className="space-y-2">
                          {data.natalComparison.significantChanges.slice(0, 3).map((change: any, index: number) => (
                            <div key={index} className="bg-indigo-400/10 rounded-lg p-3 text-sm">
                              <div className="text-indigo-100">{change.description || 'Cambio detectado'}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {data.natalComparison.planetaryMovements?.length > 0 && (
                      <div>
                        <h5 className="text-indigo-200 font-semibold mb-3">Movimientos Planetarios:</h5>
                        <div className="space-y-2">
                          {data.natalComparison.planetaryMovements.slice(0, 3).map((movement: any, index: number) => (
                            <div key={index} className="bg-indigo-400/10 rounded-lg p-3 text-sm">
                              <div className="text-indigo-100">{movement.planet}: {movement.from} → {movement.to}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressedChartVisual;