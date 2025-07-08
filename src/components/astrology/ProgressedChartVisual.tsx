// src/components/astrology/ProgressedChartVisual.tsx - VERSIÓN CORRECTA SOLO PROGRESIONES
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
  Eye
} from 'lucide-react';

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
}

interface ProgressedChartVisualProps {
  data: ProgressedChartData;
  isLoading?: boolean;
  error?: string | null;
}

// ✅ SÍMBOLOS PLANETARIOS PARA TABLA
const planetSymbols = {
  'Sun': '☉',
  'Moon': '☽',
  'Mercury': '☿',
  'Venus': '♀',
  'Mars': '♂',
  'Jupiter': '♃',
  'Saturn': '♄',
  'Uranus': '♅',
  'Neptune': '♆',
  'Pluto': '♇'
};

// ✅ INTERPRETACIONES PROGRESADAS ESPECÍFICAS
const progressedMeanings = {
  'Sun': 'Tu identidad y propósito están evolucionando hacia nuevas formas de autoexpresión',
  'Moon': 'Tus necesidades emocionales y forma de sentir están cambiando',
  'Mercury': 'Tu forma de pensar y comunicarte está en proceso de transformación',
  'Venus': 'Tus valores, amor y estética están evolucionando',
  'Mars': 'Tu energía y forma de actuar están desarrollándose'
};

// ✅ COMPONENTE PRINCIPAL CORREGIDO
const ProgressedChartVisual: React.FC<ProgressedChartVisualProps> = ({
  data,
  isLoading = false,
  error = null
}) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'positions' | 'aspects' | 'details'>('chart');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [hoveredAspect, setHoveredAspect] = useState<string | null>(null);

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
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
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
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-red-900/30 via-pink-900/20 to-purple-900/30 backdrop-blur-sm border border-red-400/30 rounded-3xl p-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-xl font-bold text-white mb-2">Error en Progresiones</h3>
              <p className="text-red-200 mb-4">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.planets || data.planets.length === 0) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-gray-900/30 via-emerald-900/20 to-teal-900/30 backdrop-blur-sm border border-gray-400/30 rounded-3xl p-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-6xl mb-4">🔮</div>
              <h3 className="text-xl font-bold text-white mb-2">Progresiones No Disponibles</h3>
              <p className="text-gray-200 mb-4">No se han recibido datos de progresiones</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ RENDERIZADO PRINCIPAL ENFOCADO EN PROGRESIONES
  return (
    <div className="space-y-8">
      {/* ✅ HEADER ESPECÍFICO PARA PROGRESIONES */}
      <div className="bg-gradient-to-br from-red-900/30 via-pink-900/20 to-purple-900/30 backdrop-blur-sm border border-red-400/30 rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
              <TrendingUp className="w-8 h-8 text-red-400 mr-3" />
              Progression Chart
            </h2>
            <p className="text-red-200">Sistema de Casas Placidus • Zodíaco Tropical</p>
          </div>
          
          <div className="text-right">
            <div className="text-white font-bold text-lg">{data.birthData.fullName}</div>
            <div className="text-red-200 text-sm">Análisis Evolutivo Personalizado</div>
          </div>
        </div>

        {/* ✅ INFORMACIÓN ESPECÍFICA DE PROGRESIÓN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Datos de Nacimiento (Referencia) */}
          <div className="bg-blue-900/20 border border-blue-400/30 rounded-xl p-4">
            <h3 className="text-blue-300 font-semibold mb-3 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Datos de Nacimiento (Referencia)
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Nombre:</span>
                <span className="text-white font-medium">{data.birthData.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Fecha y Hora:</span>
                <span className="text-white font-medium">
                  {new Date(data.birthData.birthDate).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'long', 
                    year: 'numeric'
                  })} {data.birthData.birthTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Lugar:</span>
                <span className="text-white font-medium">{data.birthData.birthPlace}</span>
              </div>
            </div>
          </div>

          {/* Datos de Progresión (Actual) */}
          <div className="bg-red-900/20 border border-red-400/30 rounded-xl p-4">
            <h3 className="text-red-300 font-semibold mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Datos de Progresión (Actuales)
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Fecha Progresada:</span>
                <span className="text-white font-medium">
                  {data.progressionInfo.progressionDate || 
                   new Date(data.progressionInfo.startDate).toLocaleDateString('es-ES', {
                     day: '2-digit',
                     month: 'long', 
                     year: 'numeric'
                   })} {data.progressionInfo.progressionTime || '12:00'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Lugar de Progresión:</span>
                <div className="flex items-center">
                  <span className="text-white font-medium mr-2">
                    {data.progressionLocation?.progressionPlace || data.birthData.birthPlace}
                  </span>
                  <button
                    onClick={() => setShowLocationModal(true)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    title="La carta progresada debe calcularse desde tu ubicación actual. ¿Sigues en Madrid?"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Edad en Progresión:</span>
                <span className="text-white font-medium">{data.progressionInfo.ageAtStart} años</span>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ TABS ESPECÍFICOS PARA PROGRESIONES */}
        <div className="flex justify-center mt-6">
          <div className="bg-black/30 rounded-xl p-1 flex space-x-1">
            <button
              onClick={() => setActiveTab('chart')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                activeTab === 'chart'
                  ? 'bg-red-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Target className="w-4 h-4 mr-2" />
              Chart Wheel
            </button>
            <button
              onClick={() => setActiveTab('positions')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                activeTab === 'positions'
                  ? 'bg-red-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Star className="w-4 h-4 mr-2" />
              Positions
            </button>
            <button
              onClick={() => setActiveTab('aspects')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                activeTab === 'aspects'
                  ? 'bg-red-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Aspects
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                activeTab === 'details'
                  ? 'bg-red-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Info className="w-4 h-4 mr-2" />
              Details
            </button>
          </div>
        </div>
      </div>

      {/* ✅ CONTENIDO SEGÚN TAB ACTIVO */}
      {activeTab === 'chart' && (
        <div className="space-y-6">
          {/* Info sobre aspectos progresados */}
          <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 backdrop-blur-sm border border-red-400/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Sparkles className="w-5 h-5 text-red-400 mr-2" />
              Solo Aspectos de Progresión
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="text-red-200">
                <p className="mb-2">
                  • <strong 
                      className="cursor-help relative"
                      onMouseEnter={() => setHoveredAspect('outer-circle')}
                      onMouseLeave={() => setHoveredAspect(null)}
                    >
                      Círculo Exterior:
                      {hoveredAspect === 'outer-circle' && (
                        <span className="absolute top-full left-0 mt-1 p-2 bg-black/90 rounded text-xs text-white border border-white/20 z-50 w-64">
                          En tu carta wheel, si te fijas hay dos círculos. El exterior (más grande) muestra dónde están tus planetas AHORA después de haber progresado desde tu nacimiento.
                        </span>
                      )}
                    </strong> Posiciones planetarias progresadas (rojas)
                </p>
                <p className="mb-2">
                  • <strong 
                      className="cursor-help relative"
                      onMouseEnter={() => setHoveredAspect('inner-circle')}
                      onMouseLeave={() => setHoveredAspect(null)}
                    >
                      Círculo Interior:
                      {hoveredAspect === 'inner-circle' && (
                        <span className="absolute top-full left-0 mt-1 p-2 bg-black/90 rounded text-xs text-white border border-white/20 z-50 w-64">
                          El círculo interior (más pequeño) muestra tus posiciones planetarias originales del día que naciste. Es tu carta natal de referencia.
                        </span>
                      )}
                    </strong> Posiciones natales (referencia)
                </p>
              </div>
              <div className="text-red-200">
                <p className="mb-2">
                  • <strong 
                      className="cursor-help relative"
                      onMouseEnter={() => setHoveredAspect('red-lines')}
                      onMouseLeave={() => setHoveredAspect(null)}
                    >
                      Líneas Rojas:
                      {hoveredAspect === 'red-lines' && (
                        <span className="absolute top-full right-0 mt-1 p-2 bg-black/90 rounded text-xs text-white border border-white/20 z-50 w-64">
                          Las líneas rojas conectan SOLO planetas progresados entre sí. No verás aspectos natales aquí, solo las nuevas conexiones que han surgido con tu evolución.
                        </span>
                      )}
                    </strong> Solo aspectos progresados
                </p>
                <p className="mb-2">
                  • <strong 
                      className="cursor-help relative"
                      onMouseEnter={() => setHoveredAspect('evolution')}
                      onMouseLeave={() => setHoveredAspect(null)}
                    >
                      Evolución:
                      {hoveredAspect === 'evolution' && (
                        <span className="absolute top-full right-0 mt-1 p-2 bg-black/90 rounded text-xs text-white border border-white/20 z-50 w-64">
                          Muestra cómo has crecido astrológicamente. Cada planeta se ha "movido" simbólicamente desde tu nacimiento, creando nuevas energías y oportunidades.
                        </span>
                      )}
                    </strong> Cómo han progresado tus planetas desde el nacimiento
                </p>
              </div>
            </div>
          </div>

          {/* Chart Display */}
          <ChartDisplay
            houses={data.houses}
            planets={data.planets}
            elementDistribution={data.elementDistribution}
            modalityDistribution={data.modalityDistribution}
            keyAspects={data.aspects}
            ascendant={data.ascendant}
            midheaven={data.midheaven}
            birthData={{
              birthDate: data.progressionInfo.progressionDate || data.progressionInfo.startDate,
              birthTime: data.progressionInfo.progressionTime || '12:00',
              birthPlace: data.progressionLocation?.progressionPlace || data.birthData.birthPlace,
            }}
            chartType="progressed"
            progressionInfo={data.progressionInfo}
            showOnlyProgressedAspects={true}
          />
        </div>
      )}

      {/* ✅ TAB: POSICIONES PROGRESADAS (COMO EN LA IMAGEN) */}
      {activeTab === 'positions' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-sm border border-purple-400/20 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Star className="w-6 h-6 text-purple-400 mr-3" />
              Planetary Positions - Natal vs Progression
            </h3>
            
            {/* Tabla de posiciones */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 text-white font-semibold">Planet</th>
                    <th className="text-left py-3 px-4 text-blue-300 font-semibold">Natal Position</th>
                    <th className="text-left py-3 px-4 text-red-300 font-semibold">Progressed Position</th>
                    <th className="text-left py-3 px-4 text-green-300 font-semibold">House</th>
                    <th className="text-left py-3 px-4 text-yellow-300 font-semibold">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {data.planets.slice(0, 10).map((planet: any, index: number) => {
                    const planetNames = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
                    const planetName = planetNames[index] || planet.name;
                    const symbol = planetSymbols[planetName as keyof typeof planetSymbols] || '●';
                    
                    return (
                      <tr 
                        key={planetName}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
                        onMouseEnter={() => setHoveredPlanet(planetName)}
                        onMouseLeave={() => setHoveredPlanet(null)}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{symbol}</span>
                            <span className="text-white font-medium">{planetName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-blue-200 text-sm">
                          Natal: {planet.natalSign || 'N/A'} {Math.floor(planet.natalDegree || 0)}°
                        </td>
                        <td className="py-3 px-4 text-red-200 text-sm">
                          <strong>{planet.sign || 'N/A'} {Math.floor(planet.degree || 0)}°</strong>
                        </td>
                        <td className="py-3 px-4 text-green-200 text-sm">
                          House {planet.house || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-yellow-200 text-xs">
                          {hoveredPlanet === planetName ? 
                            progressedMeanings[planetName as keyof typeof progressedMeanings] || 'Evolución planetaria' :
                            'Hover para ver significado'
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ✅ TAB: ASPECTOS PROGRESADOS */}
      {activeTab === 'aspects' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-sm border border-orange-400/20 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Sparkles className="w-6 h-6 text-orange-400 mr-3" />
              Progression Aspects - Planetary Interactions
            </h3>
            
            {/* Aspectos progresados */}
            <div className="space-y-4">
              {data.aspects && data.aspects.length > 0 ? (
                data.aspects.map((aspect: any, index: number) => (
                  <div key={index} className="bg-black/30 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">
                          {planetSymbols[aspect.planet1 as keyof typeof planetSymbols] || '●'}
                        </span>
                        <span className="text-white font-medium">{aspect.planet1}</span>
                        <span className="text-red-400 mx-3">{aspect.type}</span>
                        <span className="text-2xl mr-3">
                          {planetSymbols[aspect.planet2 as keyof typeof planetSymbols] || '●'}
                        </span>
                        <span className="text-white font-medium">{aspect.planet2}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-red-200 text-sm">
                          Orb: {aspect.orb}°
                        </div>
                        <div className="text-gray-400 text-xs">
                          {aspect.exact ? 'Exact' : 'Applying'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-lg mb-2">No progression aspects found</div>
                  <div className="text-gray-500 text-sm">
                    Aspects will appear as planets progress through their cycles
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ✅ TAB: DETALLES TÉCNICOS */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900/30 to-blue-900/30 backdrop-blur-sm border border-indigo-400/20 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Info className="w-6 h-6 text-indigo-400 mr-3" />
              Technical Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-xl p-4">
                  <h4 className="text-indigo-300 font-semibold mb-2">Calculation Method</h4>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p><strong>Type:</strong> Secondary Progressions</p>
                    <p><strong>Formula:</strong> 1 day after birth = 1 year of life</p>
                    <p><strong>House System:</strong> Placidus</p>
                    <p><strong>Zodiac:</strong> Tropical</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-xl p-4">
                  <h4 className="text-cyan-300 font-semibold mb-2">Current Period</h4>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p><strong>Age:</strong> {data.progressionInfo.ageAtStart} years</p>
                    <p><strong>Solar Year:</strong> {data.progressionInfo.year}</p>
                    <p><strong>Period:</strong> {data.progressionInfo.period}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ FOOTER ESPECÍFICO PARA PROGRESIONES */}
      <div className="bg-gradient-to-r from-gray-900/30 to-slate-900/30 backdrop-blur-sm border border-gray-400/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          💡 Understanding Progression Charts
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="text-emerald-300 font-semibold mb-2">🌟 What Are Progressions?</h4>
            <ul className="space-y-1 text-gray-300">
              <li>• Show your astrological evolution since birth</li>
              <li>• Based on planetary movement after birth</li>
              <li>• Reveal current themes and opportunities</li>
              <li>• Complement your natal chart</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-teal-300 font-semibold mb-2">🎯 How to Read This Chart</h4>
            <ul className="space-y-1 text-gray-300">
              <li>• Red lines show progression aspects only</li>
              <li>• Outer circle shows current progressed positions</li>
              <li>• Inner circle shows your natal positions</li>
              <li>• Focus on major life themes for this year</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ✅ MODAL DE CONFIGURACIÓN DE LUGAR */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-3xl p-8 max-w-md mx-4">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              <MapPin className="w-6 h-6 text-blue-400 mr-3" />
              Progression Location
            </h3>
            <p className="text-gray-300 mb-6">
              Configure the location for your progression calculations. This can be different from your birth place.
            </p>
            
            <div className="space-y-4">
              <button className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-colors">
                Use Birth Location
              </button>
              <button className="w-full p-3 bg-green-600 hover:bg-green-700 rounded-xl text-white font-medium transition-colors">
                Use Current Location
              </button>
              <button className="w-full p-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-medium transition-colors">
                Set Custom Location
              </button>
            </div>
            
            <button
              onClick={() => setShowLocationModal(false)}
              className="w-full mt-6 p-3 bg-gray-600 hover:bg-gray-700 rounded-xl text-white font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressedChartVisual;