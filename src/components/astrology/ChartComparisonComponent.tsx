// =============================================================================
// 🌟 COMPONENTE COMPARACIÓN NATAL VS PROGRESADA
// src/components/astrology/ChartComparisonComponent.tsx
// =============================================================================

'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  Star, 
  TrendingUp, 
  Eye, 
  BarChart3,
  Lightbulb,
  Target,
  Zap,
  RefreshCw,
  Info,
  Calendar,
  User,
  Sparkles
} from 'lucide-react';

interface ChartComparisonProps {
  natalData?: any;
  progressedData?: any;
  userId?: string;
}

interface PlanetComparison {
  planet: string;
  natalSign: string;
  natalHouse: number;
  natalDegree: number;
  progressedSign: string;
  progressedHouse: number;
  progressedDegree: number;
  hasChanged: boolean;
  evolutionDescription: string;
}

const ChartComparisonComponent: React.FC<ChartComparisonProps> = ({
  natalData,
  progressedData,
  userId
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'planets' | 'elements' | 'insights'>('overview');
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

  // ✅ SÍMBOLOS PLANETARIOS
  const planetSymbols: { [key: string]: string } = {
    'Sol': '☉',
    'Luna': '☽', 
    'Mercurio': '☿',
    'Venus': '♀',
    'Marte': '♂',
    'Júpiter': '♃',
    'Saturno': '♄'
  };

  // ✅ FUNCIÓN: Calcular comparaciones planetarias
  const calculatePlanetaryComparisons = (): PlanetComparison[] => {
    if (!natalData?.planets || !progressedData?.planets) return [];

    const comparisons: PlanetComparison[] = [];
    const mainPlanets = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte'];

    mainPlanets.forEach(planetName => {
      const natalPlanet = natalData.planets.find((p: any) => p.name === planetName);
      const progressedPlanet = progressedData.planets.find((p: any) => p.name === planetName);

      if (natalPlanet && progressedPlanet) {
        const hasSignChange = natalPlanet.sign !== progressedPlanet.sign;
        const hasHouseChange = (natalPlanet.house || natalPlanet.housePosition) !== (progressedPlanet.house || progressedPlanet.housePosition);
        const hasChanged = hasSignChange || hasHouseChange;

        let evolutionDescription = '';
        if (hasSignChange && hasHouseChange) {
          evolutionDescription = `Tu ${planetName.toLowerCase()} ha evolucionado desde ${natalPlanet.sign} (Casa ${natalPlanet.house || natalPlanet.housePosition}) hacia ${progressedPlanet.sign} (Casa ${progressedPlanet.house || progressedPlanet.housePosition}). Esto representa una transformación profunda en esta área de tu personalidad.`;
        } else if (hasSignChange) {
          evolutionDescription = `Tu ${planetName.toLowerCase()} ha evolucionado de ${natalPlanet.sign} a ${progressedPlanet.sign}, cambiando tu forma de expresar esta energía.`;
        } else if (hasHouseChange) {
          evolutionDescription = `Tu ${planetName.toLowerCase()} se manifiesta ahora en Casa ${progressedPlanet.house || progressedPlanet.housePosition} (antes Casa ${natalPlanet.house || natalPlanet.housePosition}), cambiando el área de vida donde se enfoca esta energía.`;
        } else {
          evolutionDescription = `Tu ${planetName.toLowerCase()} permanece estable en ${natalPlanet.sign}, pero ha madurado internamente a través de las experiencias.`;
        }

        comparisons.push({
          planet: planetName,
          natalSign: natalPlanet.sign,
          natalHouse: natalPlanet.house || natalPlanet.housePosition || 1,
          natalDegree: Math.floor(natalPlanet.degree || 0),
          progressedSign: progressedPlanet.sign,
          progressedHouse: progressedPlanet.house || progressedPlanet.housePosition || 1,
          progressedDegree: Math.floor(progressedPlanet.degree || 0),
          hasChanged,
          evolutionDescription
        });
      }
    });

    return comparisons;
  };

  // ✅ FUNCIÓN: Calcular diferencias elementales
  const calculateElementalDifferences = () => {
    if (!natalData?.elementDistribution || !progressedData?.elementDistribution) return null;

    const elements = ['fire', 'earth', 'air', 'water'];
    const elementNames: { [key: string]: string } = {
      fire: 'Fuego',
      earth: 'Tierra', 
      air: 'Aire',
      water: 'Agua'
    };

    return elements.map(element => ({
      element: elementNames[element],
      natal: natalData.elementDistribution[element] || 0,
      progressed: progressedData.elementDistribution[element] || 0,
      change: (progressedData.elementDistribution[element] || 0) - (natalData.elementDistribution[element] || 0)
    }));
  };

  const planetaryComparisons = calculatePlanetaryComparisons();
  const elementalDifferences = calculateElementalDifferences();
  const hasSignificantChanges = planetaryComparisons.some(p => p.hasChanged);

  // Si no hay datos suficientes para comparar
  if (!natalData || !progressedData) {
    return (
      <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-sm border border-amber-400/20 rounded-3xl p-8 text-center">
        <div className="text-6xl mb-4">⚖️</div>
        <h3 className="text-2xl font-bold text-white mb-4">Comparación de Cartas</h3>
        <p className="text-amber-200 mb-6">
          Para ver la comparación necesitas tener tanto tu carta natal como la progresada.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center">
            <Star className="w-4 h-4 mr-2" />
            Ver Carta Natal
          </button>
          <button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Ver Carta Progresada
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ✅ NAVEGACIÓN DE VISTAS */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { id: 'overview', label: '👁️ Resumen', icon: Eye },
          { id: 'planets', label: '🪐 Planetas', icon: Star },
          { id: 'elements', label: '🔥 Elementos', icon: BarChart3 },
          { id: 'insights', label: '💡 Insights', icon: Lightbulb }
        ].map((view) => {
          const IconComponent = view.icon;
          return (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                activeView === view.id
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {view.label}
            </button>
          );
        })}
      </div>

      {/* ✅ VISTA: RESUMEN GENERAL */}
      {activeView === 'overview' && (
        <div className="bg-gradient-to-br from-orange-900/30 to-amber-900/30 backdrop-blur-sm border border-orange-400/20 rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <ArrowRight className="w-6 h-6 text-orange-400 mr-3" />
            Tu Evolución Astrológica - Resumen
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Carta Natal */}
            <div className="bg-blue-900/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-8 h-8 text-blue-400" />
                <div>
                  <h4 className="text-xl font-semibold text-blue-300">Carta Natal</h4>
                  <p className="text-blue-200 text-sm">Tu potencial innato</p>
                </div>
              </div>
              
              <div className="space-y-3 text-blue-100 text-sm">
                <p>• <strong>Representa:</strong> Tus talentos naturales y propósito del alma</p>
                <p>• <strong>Muestra:</strong> Características con las que naciste</p>
                <p>• <strong>Pregunta clave:</strong> "¿Quién soy en esencia?"</p>
                <p>• <strong>Planetas:</strong> {natalData.planets?.length || 0} posiciones calculadas</p>
              </div>
            </div>

            {/* Carta Progresada */}
            <div className="bg-emerald-900/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-emerald-400" />
                <div>
                  <h4 className="text-xl font-semibold text-emerald-300">Carta Progresada</h4>
                  <p className="text-emerald-200 text-sm">Tu evolución desarrollada</p>
                </div>
              </div>
              
              <div className="space-y-3 text-emerald-100 text-sm">
                <p>• <strong>Representa:</strong> Cómo has crecido y evolucionado</p>
                <p>• <strong>Muestra:</strong> Tu maduración interna actual</p>
                <p>• <strong>Pregunta clave:</strong> "¿En qué me he convertido?"</p>
                <p>• <strong>Edad evolutiva:</strong> {progressedData.progressionInfo?.ageAtStart || 0} años</p>
              </div>
            </div>
          </div>

          {/* Estadísticas de cambio */}
          <div className="bg-orange-800/20 rounded-xl p-6 mt-6">
            <h4 className="text-orange-300 font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Estadísticas de Tu Evolución
            </h4>
            
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-orange-700/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-300 mb-1">
                  {planetaryComparisons.filter(p => p.hasChanged).length}
                </div>
                <div className="text-orange-200 text-sm">Planetas que han cambiado</div>
              </div>
              
              <div className="bg-orange-700/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-300 mb-1">
                  {planetaryComparisons.length - planetaryComparisons.filter(p => p.hasChanged).length}
                </div>
                <div className="text-orange-200 text-sm">Planetas estables</div>
              </div>
              
              <div className="bg-orange-700/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-300 mb-1">
                  {hasSignificantChanges ? 'Alto' : 'Moderado'}
                </div>
                <div className="text-orange-200 text-sm">Nivel de evolución</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ VISTA: COMPARACIÓN DE PLANETAS */}
      {activeView === 'planets' && (
        <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 backdrop-blur-sm border border-purple-400/20 rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Star className="w-6 h-6 text-purple-400 mr-3" />
            Evolución Planetaria Detallada
          </h3>

          <div className="space-y-6">
            {planetaryComparisons.map((comparison, index) => (
              <div 
                key={index}
                className={`rounded-2xl p-6 transition-all cursor-pointer ${
                  comparison.hasChanged 
                    ? 'bg-gradient-to-r from-purple-800/40 to-pink-800/40 border border-purple-500/30' 
                    : 'bg-purple-800/20 border border-purple-600/20'
                }`}
                onMouseEnter={() => setHoveredPlanet(comparison.planet)}
                onMouseLeave={() => setHoveredPlanet(null)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">
                      {planetSymbols[comparison.planet] || '🪐'}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-purple-300">{comparison.planet}</h4>
                      <p className="text-purple-200 text-sm">
                        {comparison.hasChanged ? '✨ Ha evolucionado' : '🔄 Evolución interna'}
                      </p>
                    </div>
                  </div>
                  
                  {comparison.hasChanged && (
                    <div className="bg-pink-600/30 rounded-full px-3 py-1">
                      <span className="text-pink-300 text-sm font-medium">Cambio significativo</span>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  {/* Posición Natal */}
                  <div className="bg-blue-900/30 rounded-xl p-4">
                    <h5 className="text-blue-300 font-medium mb-3 flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      Posición Natal
                    </h5>
                    <div className="space-y-2 text-blue-100 text-sm">
                      <p><strong>Signo:</strong> {comparison.natalSign}</p>
                      <p><strong>Casa:</strong> {comparison.natalHouse}</p>
                      <p><strong>Grado:</strong> {comparison.natalDegree}°</p>
                    </div>
                  </div>

                  {/* Posición Progresada */}
                  <div className="bg-emerald-900/30 rounded-xl p-4">
                    <h5 className="text-emerald-300 font-medium mb-3 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Posición Progresada
                    </h5>
                    <div className="space-y-2 text-emerald-100 text-sm">
                      <p><strong>Signo:</strong> {comparison.progressedSign}</p>
                      <p><strong>Casa:</strong> {comparison.progressedHouse}</p>
                      <p><strong>Grado:</strong> {comparison.progressedDegree}°</p>
                    </div>
                  </div>
                </div>

                {/* Descripción de la evolución */}
                {hoveredPlanet === comparison.planet && (
                  <div className="bg-purple-700/30 rounded-xl p-4 border-t border-purple-600/30">
                    <h5 className="text-purple-300 font-medium mb-2 flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Significado de Esta Evolución
                    </h5>
                    <p className="text-purple-100 text-sm leading-relaxed">
                      {comparison.evolutionDescription}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ VISTA: COMPARACIÓN ELEMENTAL */}
      {activeView === 'elements' && elementalDifferences && (
        <div className="bg-gradient-to-br from-indigo-900/30 to-cyan-900/30 backdrop-blur-sm border border-indigo-400/20 rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 text-indigo-400 mr-3" />
            Evolución de Tu Temperamento
          </h3>

          <div className="mb-6">
            <p className="text-indigo-200 mb-2">
              Los elementos muestran tu temperamento básico. Observa cómo ha cambiado tu naturaleza elemental:
            </p>
            <p className="text-indigo-300 text-sm">
              🔥 Fuego = Acción • 🌍 Tierra = Practicidad • 💨 Aire = Mental • 💧 Agua = Emocional
            </p>
          </div>

          <div className="space-y-6">
            {elementalDifferences.map((element, index) => {
              const getElementColor = (elem: string) => {
                const colors: { [key: string]: string } = {
                  'Fuego': 'from-red-500 to-orange-500',
                  'Tierra': 'from-green-500 to-emerald-500',
                  'Aire': 'from-blue-500 to-cyan-500',
                  'Agua': 'from-indigo-500 to-purple-500'
                };
                return colors[elem] || 'from-gray-500 to-gray-600';
              };

              const getElementIcon = (elem: string) => {
                const icons: { [key: string]: string } = {
                  'Fuego': '🔥',
                  'Tierra': '🌍',
                  'Aire': '💨',
                  'Agua': '💧'
                };
                return icons[elem] || '⭐';
              };

              const changeDirection = element.change > 0 ? 'aumentado' : element.change < 0 ? 'disminuido' : 'mantenido';
              const changeColor = element.change > 0 ? 'text-green-400' : element.change < 0 ? 'text-red-400' : 'text-gray-400';

              return (
                <div key={index} className="bg-indigo-800/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getElementIcon(element.element)}</div>
                      <h4 className="text-xl font-semibold text-indigo-300">{element.element}</h4>
                    </div>
                    <div className={`font-medium ${changeColor}`}>
                      {element.change > 0 ? '+' : ''}{element.change.toFixed(1)}%
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-indigo-300 text-sm mb-2">Natal</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-3 bg-indigo-900 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${getElementColor(element.element)} transition-all`}
                            style={{ width: `${element.natal}%` }}
                          />
                        </div>
                        <span className="text-indigo-200 text-sm w-12">{element.natal}%</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-indigo-300 text-sm mb-2">Progresada</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-3 bg-indigo-900 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${getElementColor(element.element)} transition-all`}
                            style={{ width: `${element.progressed}%` }}
                          />
                        </div>
                        <span className="text-indigo-200 text-sm w-12">{element.progressed}%</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-indigo-100 text-sm">
                    Tu naturaleza {element.element.toLowerCase()} ha <strong className={changeColor}>{changeDirection}</strong>
                    {Math.abs(element.change) > 5 && (
                      <span> significativamente, lo que indica una evolución notable en este aspecto de tu temperamento</span>
                    )}
                    {Math.abs(element.change) <= 5 && Math.abs(element.change) > 0 && (
                      <span> ligeramente, mostrando una evolución sutil pero importante</span>
                    )}
                    {element.change === 0 && (
                      <span>, manteniéndose estable a lo largo de tu desarrollo</span>
                    )}
                    .
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ✅ VISTA: INSIGHTS EVOLUTIVOS */}
      {activeView === 'insights' && (
        <div className="bg-gradient-to-br from-rose-900/30 to-pink-900/30 backdrop-blur-sm border border-rose-400/20 rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Lightbulb className="w-6 h-6 text-rose-400 mr-3" />
            Insights de Tu Evolución Personal
          </h3>

          <div className="space-y-6">
            {/* Insight Principal */}
            <div className="bg-rose-800/30 rounded-2xl p-6">
              <h4 className="text-rose-300 font-semibold mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Patrón Evolutivo Principal
              </h4>
              <p className="text-rose-100 leading-relaxed">
                {hasSignificantChanges ? (
                  <>
                    Tu carta progresada muestra una <strong>evolución significativa</strong>. Has experimentado 
                    cambios importantes en {planetaryComparisons.filter(p => p.hasChanged).length} de tus planetas 
                    principales, lo que indica un período de crecimiento interno profundo y transformación personal.
                  </>
                ) : (
                  <>
                    Tu carta progresada muestra una <strong>evolución estable y consolidada</strong>. Aunque tus 
                    planetas mantienen posiciones similares, has desarrollado una expresión más madura y sabia 
                    de tus energías innatas.
                  </>
                )}
              </p>
            </div>

            {/* Insights por Planeta Cambiado */}
            {planetaryComparisons.filter(p => p.hasChanged).length > 0 && (
              <div className="bg-rose-800/20 rounded-2xl p-6">
                <h4 className="text-rose-300 font-semibold mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Áreas de Mayor Crecimiento
                </h4>
                <div className="space-y-3">
                  {planetaryComparisons.filter(p => p.hasChanged).map((comparison, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-rose-700/20 rounded-lg">
                      <div className="text-lg">{planetSymbols[comparison.planet]}</div>
                      <div className="flex-1">
                        <h5 className="text-rose-200 font-medium">{comparison.planet} - Transformación Clave</h5>
                        <p className="text-rose-100 text-sm mt-1">
                          {comparison.natalSign} → {comparison.progressedSign}: 
                          {comparison.planet === 'Sol' && ' Has desarrollado una nueva forma de expresar tu identidad y liderazgo.'}
                          {comparison.planet === 'Luna' && ' Tus necesidades emocionales y forma de cuidar han evolucionado.'}
                          {comparison.planet === 'Mercurio' && ' Tu estilo de comunicación y procesamiento mental se ha refinado.'}
                          {comparison.planet === 'Venus' && ' Tus valores, gustos y forma de relacionarte han madurado.'}
                          {comparison.planet === 'Marte' && ' Tu forma de actuar y canalizar la energía se ha transformado.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recomendaciones */}
            <div className="bg-rose-800/20 rounded-2xl p-6">
              <h4 className="text-rose-300 font-semibold mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Cómo Integrar Esta Evolución
              </h4>
              <div className="space-y-3 text-rose-100 text-sm">
                <p>• <strong>Reconoce tu crecimiento:</strong> Aprecia cómo has evolucionado desde tu juventud.</p>
                <p>• <strong>Integra conscientemente:</strong> Usa tu carta progresada para entender tu yo actual.</p>
                <p>• <strong>Honra tu natal:</strong> No abandones tus características innatas, sino refínalas.</p>
                <p>• <strong>Abraza el cambio:</strong> Los planetas que han cambiado indican nuevas capacidades.</p>
                <p>• <strong>Planifica el futuro:</strong> Usa esta información para continuar tu desarrollo.</p>
              </div>
            </div>

            {/* Próximos Pasos */}
            <div className="bg-gradient-to-r from-rose-700/20 to-pink-700/20 rounded-2xl p-6 text-center">
              <h4 className="text-rose-300 font-semibold mb-4">Continúa Tu Viaje Astrológico</h4>
              <p className="text-rose-100 mb-6">
                Esta comparación es solo el inicio. Tu evolución continúa día a día.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Ver Agenda Astrológica
                </button>
                <button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center text-sm">
                  <Zap className="w-4 h-4 mr-2" />
                  Análisis IA Completo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartComparisonComponent;