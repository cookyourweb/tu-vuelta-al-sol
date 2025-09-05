// =============================================================================
// 🌟 COMPONENTE CARTA PROGRESADA VISUAL COMPLETO - VERSIÓN EDUCATIVA
// src/components/astrology/ProgressedChartVisual.tsx
// =============================================================================

'use client';

import React, { useState } from 'react';
import ChartDisplay from '@/components/astrology/ChartDisplay';
import { progressedPlanetMeanings, progressedTooltips } from '@/constants/astrology/progressedChartConstants';
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
  Brain,
  Compass,
  Orbit,
  Flame,
  Mountain,
  Wind,
  Waves,
  Moon,
  Sun,
  AlertTriangle
} from 'lucide-react';

// ✅ INTERFACES COMPLETAS
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
  progressionLocation?: {
    progressionPlace: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  natalComparison?: {
    planetaryMovements: any[];
    significantChanges: any[];
    newAspects: any[];
    dissolvingAspects: any[];
  };
  birthData?: {
    birthPlace: string;
    birthDate: string;
    birthTime: string;
  };
}

interface ProgressedChartVisualProps {
  data: ProgressedChartData;
  isLoading?: boolean;
  error?: string | null;
}

// ✅ SÍMBOLOS PLANETARIOS
const planetSymbols: { [key: string]: string } = {
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



const ProgressedChartVisual: React.FC<ProgressedChartVisualProps> = ({
  data,
  isLoading = false,
  error = null
}) => {
  const birthData = data.birthData;
  const [activeTab, setActiveTab] = useState<'education' | 'chart' | 'positions' | 'aspects' | 'evolution'>('education');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [hoveredAspect, setHoveredAspect] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  // ✅ FUNCIÓN: Obtener icono de elemento
  const getElementIcon = (element: string) => {
    const icons: { [key: string]: JSX.Element } = {
      'fuego': <Flame className="w-4 h-4 text-red-400" />,
      'tierra': <Mountain className="w-4 h-4 text-green-400" />,
      'aire': <Wind className="w-4 h-4 text-blue-400" />,
      'agua': <Waves className="w-4 h-4 text-blue-600" />
    };
    return icons[element.toLowerCase()] || <Star className="w-4 h-4" />;
  };

  // ✅ ESTADO DE CARGA
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

  // ✅ ESTADO DE ERROR
  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-900/30 via-pink-900/20 to-rose-900/30 backdrop-blur-sm border border-red-400/30 rounded-3xl p-8">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">Error en Carta Progresada</h3>
          <p className="text-red-200 text-lg mb-6">{error}</p>
          <div className="flex justify-center gap-4">
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ✅ NAVEGACIÓN POR PESTAÑAS */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { id: 'education', label: '📚 Educación', icon: BookOpen },
          { id: 'chart', label: '🌙 Carta Visual', icon: Star },
          { id: 'positions', label: '🪐 Posiciones', icon: Compass },
          { id: 'aspects', label: '⚡ Aspectos', icon: Zap },
          { id: 'evolution', label: '🔮 Evolución', icon: TrendingUp }
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ✅ TAB: EDUCACIÓN ASTROLÓGICA */}
      {activeTab === 'education' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-sm border border-purple-400/20 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <BookOpen className="w-6 h-6 text-purple-400 mr-3" />
              ¿Qué es una Carta Progresada?
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-purple-800/30 rounded-xl p-6">
                  <h4 className="text-purple-300 font-semibold mb-3 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Concepto Básico
                  </h4>
                  <p className="text-purple-100 text-sm leading-relaxed">
                    Tu carta progresada muestra cómo has evolucionado internamente desde tu nacimiento. 
                    Mientras que tu carta natal es tu "semilla cósmica", la progresada es tu "árbol crecido".
                  </p>
                </div>
                
                <div className="bg-purple-800/30 rounded-xl p-6">
                  <h4 className="text-purple-300 font-semibold mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Método de Cálculo
                  </h4>
                  <p className="text-purple-100 text-sm leading-relaxed">
                    Cada día después de tu nacimiento = 1 año de tu vida. Si tienes 30 años, 
                    tu carta progresada se calcula para el día 30 después de que naciste.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-indigo-800/30 rounded-xl p-6">
                  <h4 className="text-indigo-300 font-semibold mb-3 flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    Diferencia Clave
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div>
                        <span className="text-yellow-300 font-medium">Carta Natal:</span>
                        <span className="text-indigo-100 ml-2">Tu potencial y características innatas</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                      <div>
                        <span className="text-emerald-300 font-medium">Carta Progresada:</span>
                        <span className="text-indigo-100 ml-2">Cómo has desarrollado ese potencial</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-indigo-800/30 rounded-xl p-6">
                  <h4 className="text-indigo-300 font-semibold mb-3 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Para Qué Sirve
                  </h4>
                  <ul className="text-indigo-100 text-sm space-y-1">
                    <li>• Entender tu evolución personal</li>
                    <li>• Ver patrones de crecimiento</li>
                    <li>• Timing de cambios internos</li>
                    <li>• Integrar nuevas facetas de ti</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ TAB: CARTA VISUAL */}
      {activeTab === 'chart' && (
        <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm border border-indigo-400/20 rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Star className="w-6 h-6 text-indigo-400 mr-3" />
            Tu Carta Progresada - Evolución Interior
          </h3>
          
          <div className="mb-6">
            <div className="bg-indigo-800/30 rounded-xl p-4 mb-4">
              <h4 className="text-indigo-300 font-medium mb-2">Cómo Leer Esta Carta</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="text-indigo-100">
                  <p className="mb-2">• <strong>Planetas con símbolos {
                    Object.values(planetSymbols).slice(0, 3).join(' ')
                  }:</strong> Tus planetas progresados (evolución)</p>
                  <p className="mb-2">• <strong>Planetas transparentes:</strong> Posiciones natales (referencia)</p>
                </div>
                <div className="text-red-200">
                  <p className="mb-2">• <strong>Líneas:</strong> Aspectos entre planetas progresados</p>
                  <p className="mb-2">• <strong>Casas:</strong> Áreas de vida donde se manifiestan los cambios</p>
                </div>
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
            birthData={birthData} // ✅ CORREGIDO: usar birthData prop, no data.birthData
            chartType="progressed"
            progressionInfo={data.progressionInfo}
            showOnlyProgressedAspects={true}
          />
        </div>
      )}

      {/* ✅ TAB: POSICIONES PLANETARIAS EDUCATIVAS */}
      {activeTab === 'positions' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 backdrop-blur-sm border border-emerald-400/20 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Compass className="w-6 h-6 text-emerald-400 mr-3" />
              Tus Planetas Progresados - Evolución Personal
            </h3>
            
            <div className="text-emerald-100 mb-6">
              <p className="mb-2">
                Cada planeta progresado muestra cómo has evolucionado internamente en esa área de vida desde que naciste.
              </p>
              <p className="text-sm text-emerald-300">
                💡 <strong>Tip:</strong> Compara con tu carta natal para ver qué ha cambiado en tu personalidad.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {data.planets.filter((planet: { name: string }) => ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte'].includes(planet.name)).map((planet: { name: string; degree?: number; sign?: string; housePosition?: number; house?: number }, index: number) => (
                <div 
                  key={index}
                  className="bg-emerald-800/30 rounded-xl p-6 hover:bg-emerald-800/40 transition-colors cursor-pointer"
                  onMouseEnter={() => setHoveredPlanet(planet.name)}
                  onMouseLeave={() => setHoveredPlanet(null)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {planetSymbols[planet.name] || '🪐'}
                      </div>
                      <div>
                        <h4 className="text-emerald-300 font-semibold">{planet.name} Progresado</h4>
                        <p className="text-emerald-400 text-sm">
                          {Math.floor(planet.degree || 0)}° {planet.sign} - Casa {planet.housePosition || planet.house}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-200 text-sm">Edad {data.progressionInfo.ageAtStart}</div>
                    </div>
                  </div>
                  
                  {hoveredPlanet === planet.name && progressedPlanetMeanings[planet.name as keyof typeof progressedPlanetMeanings] && (
                    <div className="border-t border-emerald-600/50 pt-4 mt-4">
                      <p className="text-emerald-100 text-sm mb-2">
                        <strong>Significado:</strong> {progressedPlanetMeanings[planet.name as keyof typeof progressedPlanetMeanings].meaning}
                      </p>
                      <p className="text-emerald-200 text-xs">
                        <strong>Evolución:</strong> {progressedPlanetMeanings[planet.name as keyof typeof progressedPlanetMeanings].evolution}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ✅ TAB: ASPECTOS PROGRESADOS */}
      {activeTab === 'aspects' && (
        <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-sm border border-amber-400/20 rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Zap className="w-6 h-6 text-amber-400 mr-3" />
            Aspectos Progresados - Nuevas Dinámicas
          </h3>
          
          <div className="text-amber-100 mb-6">
            <p className="mb-2">
              Los aspectos progresados son nuevas dinámicas internas que has desarrollado con la edad. 
              No estaban activas al nacer, pero han emergido con tu crecimiento.
            </p>
            <p className="text-sm text-amber-300">
              ⚡ <strong>Importante:</strong> Estos aspectos muestran cómo diferentes partes de tu personalidad han aprendido a trabajar juntas.
            </p>
          </div>

          <div className="space-y-4">
            {data.keyAspects && data.keyAspects.length > 0 ? (
              data.keyAspects.map((aspect, index) => (
                <div 
                  key={index}
                  className="bg-amber-800/30 rounded-xl p-6 hover:bg-amber-800/40 transition-colors"
                  onMouseEnter={() => setHoveredAspect(`${aspect.planet1}-${aspect.planet2}`)}
                  onMouseLeave={() => setHoveredAspect(null)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{planetSymbols[aspect.planet1] || '🪐'}</span>
                        <span className="text-amber-300 text-sm">{aspect.planet1}</span>
                      </div>
                      <div className="text-amber-400 font-medium">{aspect.type}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{planetSymbols[aspect.planet2] || '🪐'}</span>
                        <span className="text-amber-300 text-sm">{aspect.planet2}</span>
                      </div>
                    </div>
                    <div className="text-amber-200 text-sm">
                      Orbe: {Math.round(aspect.orb * 10) / 10}°
                    </div>
                  </div>
                  
                  {hoveredAspect === `${aspect.planet1}-${aspect.planet2}` && (
                    <div className="border-t border-amber-600/50 pt-4 mt-4">
                      <p className="text-amber-100 text-sm">
                        <strong>Dinámica Evolutiva:</strong> El diálogo interno entre tu {aspect.planet1.toLowerCase()} 
                        y tu {aspect.planet2.toLowerCase()} ha evolucionado hacia una relación de {aspect.type.toLowerCase()}.
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-amber-200">No se encontraron aspectos progresados significativos</p>
                <p className="text-amber-300 text-sm mt-2">Esto puede indicar un período de estabilidad interna</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ TAB: EVOLUCIÓN PERSONAL */}
      {activeTab === 'evolution' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 backdrop-blur-sm border border-violet-400/20 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 text-violet-400 mr-3" />
              Tu Evolución Astrológica
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Período Actual */}
              <div className="bg-violet-800/30 rounded-xl p-6 text-center">
                <Calendar className="w-8 h-8 text-violet-400 mx-auto mb-3" />
                <h4 className="text-violet-300 font-semibold mb-2">Período Actual</h4>
                <div className="space-y-1 text-violet-100 text-sm">
                  <p><strong>Año:</strong> {data.progressionInfo.year}</p>
                  <p><strong>Edad:</strong> {data.progressionInfo.ageAtStart} años</p>
                  <p><strong>Fase:</strong> {data.progressionInfo.isCurrentYear ? 'Actual' : 'Histórica'}</p>
                </div>
              </div>

              {/* Distribución Elemental */}
              <div className="bg-violet-800/30 rounded-xl p-6">
                <h4 className="text-violet-300 font-semibold mb-3 flex items-center">
                  {getElementIcon('fuego')}
                  <span className="ml-2">Elementos Activos</span>
                </h4>
                <div className="space-y-2">
                  {Object.entries(data.elementDistribution)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .map(([element, value]) => (
                    <div key={element} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {getElementIcon(element)}
                        <span className="text-violet-100 capitalize">{element}</span>
                      </div>
                      <span className="text-violet-300">{value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modalidades */}
              <div className="bg-violet-800/30 rounded-xl p-6">
                <h4 className="text-violet-300 font-semibold mb-3 flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Modalidades
                </h4>
                <div className="space-y-2">
                  {Object.entries(data.modalityDistribution)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .map(([modality, value]) => (
                    <div key={modality} className="flex items-center justify-between text-sm">
                      <span className="text-violet-100 capitalize">{modality}</span>
                      <span className="text-violet-300">{value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Descripción del Período */}
            <div className="bg-violet-800/20 rounded-xl p-6 mt-6">
              <h4 className="text-violet-300 font-semibold mb-3 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Significado de Este Período
              </h4>
              <p className="text-violet-100 leading-relaxed">
                {data.progressionInfo.description || 
                 `En este período de tu vida (edad ${data.progressionInfo.ageAtStart}), tu evolución astrológica 
                 muestra un enfoque en el desarrollo interno y la maduración de tus capacidades innatas. 
                 Los planetas progresados indican las áreas donde has experimentado el mayor crecimiento 
                 desde tu nacimiento.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ✅ INFORMACIÓN CONTEXTUAL SIEMPRE VISIBLE - Solo si hay birthData */}
      {birthData && (
        <div className="bg-gradient-to-r from-indigo-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-indigo-400/10 rounded-2xl p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-indigo-300 font-semibold mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Datos de Nacimiento
              </h4>
              <div className="space-y-1 text-indigo-100 text-sm">
                <p><MapPin className="w-3 h-3 inline mr-1" /> {birthData.birthPlace}</p>
                <p><Calendar className="w-3 h-3 inline mr-1" /> {birthData.birthDate}</p>
                <p><Clock className="w-3 h-3 inline mr-1" /> {birthData.birthTime}</p>
              </div>
            </div>
            <div>
              <h4 className="text-purple-300 font-semibold mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Período de Progresión
              </h4>
              <div className="space-y-1 text-purple-100 text-sm">
                <p>Año: {data.progressionInfo.year}</p>
                <p>Edad: {data.progressionInfo.ageAtStart} años</p>
                <p>Estado: {data.progressionInfo.isCurrentYear ? 'Período actual' : 'Período histórico'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressedChartVisual;