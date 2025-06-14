// src/components/astrology/ChartDisplay.tsx - VERSIÓN MEJORADA
'use client';

import React, { useMemo } from 'react';
import NatalChartWheel from './NatalChartWheel';
import { 
  calculateAllAspects, 
  convertToComponentFormat 
} from '../../utils/astrology/aspectCalculations';

// =============================================================================
// INTERFACES
// =============================================================================

interface Planet {
  name: string;
  sign: string;
  degree?: number;
  minutes?: number;
  longitude: number;
  isRetrograde?: boolean;
  retrograde?: boolean;
  house?: number;
}

interface House {
  number: number;
  sign?: string;
  degree?: number;
  minutes?: number;
  longitude: number;
}

interface Aspect {
  planet1?: string;
  planet2?: string;
  type?: string;
  orb?: number;
  planet_one?: { name: string };
  planet_two?: { name: string };
  aspect?: { name: string };
}

interface ChartDisplayProps {
  planets: Planet[];
  houses: House[];
  elementDistribution: { fire: number; earth: number; air: number; water: number };
  modalityDistribution: { cardinal: number; fixed: number; mutable: number };
  keyAspects?: Aspect[];
  aspects?: Aspect[];
  ascendant?: any;
  midheaven?: any;
  showAspects?: boolean;
  showDebugInfo?: boolean;
}

// =============================================================================
// UTILIDADES DE CONVERSIÓN
// =============================================================================

function convertToLongitude(sign: string, degree: number | string, minutes: number | string = 0): number {
  const zodiacOrder = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
    'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];
  
  const signIndex = zodiacOrder.indexOf(sign);
  if (signIndex === -1) return 0;
  
  const signOffset = signIndex * 30;
  const deg = typeof degree === 'string' ? parseFloat(degree) : degree;
  const min = typeof minutes === 'string' ? parseFloat(minutes) : minutes;
  
  return signOffset + deg + (min / 60);
}

function detectVeronicaData(planets: Planet[]): boolean {
  // Simplificado: detectar si tenemos datos específicos de prueba
  const sol = planets.find(p => p.name === 'Sol');
  if (!sol) return false;
  
  // Sol en Acuario alrededor de 21° indica datos de prueba específicos
  const solLongitude = sol.longitude || 0;
  return solLongitude >= 315 && solLongitude <= 325; // Rango de Acuario medio
}

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

const ChartDisplay: React.FC<ChartDisplayProps> = ({
  planets = [],
  houses = [],
  elementDistribution,
  modalityDistribution,
  keyAspects = [],
  aspects = [],
  ascendant,
  midheaven,
  showAspects = true,
  showDebugInfo = false
}) => {
  console.log('🔥 ChartDisplay - Datos recibidos:', {
    planets: planets.length,
    houses: houses.length,
    keyAspects: keyAspects.length,
    aspects: aspects.length
  });

  // =============================================================================
  // PROCESAMIENTO DE DATOS
  // =============================================================================

  // Procesar planetas con longitudes válidas
  const processedPlanets = useMemo(() => {
    return planets.map((planet) => {
      let longitude = planet.longitude;
      
      // Si no tiene longitude, convertir desde sign/degree/minutes
      if ((!longitude || isNaN(longitude)) && planet.sign && planet.degree !== undefined) {
        longitude = convertToLongitude(planet.sign, planet.degree, planet.minutes || 0);
      }
      
      return {
        name: planet.name,
        sign: planet.sign,
        longitude: longitude || 0,
        isRetrograde: planet.isRetrograde || planet.retrograde || false,
        house: planet.house
      };
    }).filter(p => p.longitude > 0); // Filtrar planetas sin posición válida
  }, [planets]);

  // Procesar casas con longitudes válidas
  const processedHouses = useMemo(() => {
    return houses.map((house) => {
      let longitude = house.longitude;
      
      // Si no tiene longitude, convertir desde sign/degree/minutes
      if ((!longitude || isNaN(longitude)) && house.sign && house.degree !== undefined) {
        longitude = convertToLongitude(house.sign, house.degree, house.minutes || 0);
      }
      
      return {
        number: house.number,
        longitude: longitude || ((house.number - 1) * 30) // Fallback: casas cada 30°
      };
    });
  }, [houses]);

  // =============================================================================
  // CÁLCULO DE ASPECTOS INTELIGENTE
  // =============================================================================

  const finalAspects = useMemo(() => {
    console.log('🔥 Calculando aspectos...');
    
    // 1. Usar aspectos proporcionados si existen y son válidos
    const providedAspects = keyAspects.length > 0 ? keyAspects : aspects;
    
    if (providedAspects.length > 0) {
      console.log('✅ Usando aspectos proporcionados:', providedAspects.length);
      
      // Transformar aspectos a formato estándar
      const transformedAspects = providedAspects.map((aspect) => {
        // Mapear nombres de aspectos
        const aspectTypeMap: Record<string, string> = {
          'Conjunción': 'conjunction',
          'Oposición': 'opposition',
          'Cuadratura': 'square',
          'Trígono': 'trine',
          'Sextil': 'sextile',
          'Quincuncio': 'quincunx'
        };

        const aspectName = aspect.aspect?.name || aspect.type || 'conjunction';
        const aspectType = aspectTypeMap[aspectName] || aspectName.toLowerCase();

        const planet1 = aspect.planet_one?.name || aspect.planet1 || '';
        const planet2 = aspect.planet_two?.name || aspect.planet2 || '';

        return {
          planet1,
          planet2,
          type: aspectType,
          orb: aspect.orb || 0
        };
      }).filter(a => a.planet1 && a.planet2); // Filtrar aspectos incompletos

      if (transformedAspects.length > 0) {
        return transformedAspects;
      }
    }

    // 2. Si no hay aspectos válidos proporcionados, calcular automáticamente
    if (processedPlanets.length >= 2) {
      console.log('🔄 Calculando aspectos automáticamente...');
      
      // Calcular aspectos para cualquier conjunto de datos
      const calculatedAspects = calculateAllAspects(
        processedPlanets.map(p => ({ name: p.name, longitude: p.longitude })),
        {
          include_minor_aspects: false, // Solo aspectos mayores por defecto
          orb_modifier: 1.0,
          minimum_strength: 'debil'     // Incluir incluso aspectos débiles
        }
      );
      
      console.log('✅ Aspectos calculados:', calculatedAspects.length);
      return convertToComponentFormat(calculatedAspects);
    }

    console.log('⚠️ No se pudieron calcular aspectos');
    return [];
  }, [keyAspects, aspects, processedPlanets]);

  // =============================================================================
  // PROCESAMIENTO DE ÁNGULOS
  // =============================================================================

  const processedAscendant = useMemo(() => {
    if (!ascendant) return null;
    
    let longitude = ascendant.longitude;
    if (!longitude && ascendant.sign && ascendant.degree !== undefined) {
      longitude = convertToLongitude(ascendant.sign, ascendant.degree, ascendant.minutes || 0);
    }
    
    return longitude ? { ...ascendant, longitude } : null;
  }, [ascendant]);

  const processedMidheaven = useMemo(() => {
    if (!midheaven) return null;
    
    let longitude = midheaven.longitude;
    if (!longitude && midheaven.sign && midheaven.degree !== undefined) {
      longitude = convertToLongitude(midheaven.sign, midheaven.degree, midheaven.minutes || 0);
    }
    
    return longitude ? { ...midheaven, longitude } : null;
  }, [midheaven]);

  // =============================================================================
  // ESTADÍSTICAS Y ANÁLISIS
  // =============================================================================

  const chartStats = useMemo(() => {
    const retrogradeCount = processedPlanets.filter(p => p.isRetrograde).length;
    
    // Distribución de elementos
    const elementCount = { fire: 0, earth: 0, air: 0, water: 0 };
    processedPlanets.forEach(planet => {
      const signIndex = Math.floor((planet.longitude || 0) / 30);
      const element = ['fire', 'earth', 'air', 'water'][signIndex % 4];
      elementCount[element as keyof typeof elementCount]++;
    });
    
    // Distribución de aspectos por tipo
    const aspectCount = finalAspects.reduce((acc, aspect) => {
      acc[aspect.type] = (acc[aspect.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalPlanets: processedPlanets.length,
      totalHouses: processedHouses.length,
      totalAspects: finalAspects.length,
      retrogradeCount,
      elementCount,
      aspectCount
    };
  }, [processedPlanets, processedHouses, finalAspects]);

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Tu Carta Natal
        </h2>
        <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{chartStats.totalPlanets} Planetas</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>{chartStats.totalAspects} Aspectos</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>{chartStats.retrogradeCount} Retrógrados</span>
          </div>
        </div>
      </div>

      {/* Debug Info (solo en desarrollo) */}
      {(showDebugInfo || process.env.NODE_ENV === 'development') && (
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <h3 className="font-bold text-yellow-800 mb-2">🔍 Información de Debug</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Datos de entrada:</strong></p>
              <p>• Planetas originales: {planets.length}</p>
              <p>• Planetas procesados: {processedPlanets.length}</p>
              <p>• Casas originales: {houses.length}</p>
              <p>• Casas procesadas: {processedHouses.length}</p>
              <p>• Aspectos originales: {keyAspects.length + aspects.length}</p>
              <p>• Aspectos finales: {finalAspects.length}</p>
            </div>
            <div>
              <p><strong>Validación:</strong></p>
              <p>• Planetas con longitude: {processedPlanets.filter(p => p.longitude > 0).length}</p>
              <p>• Casas con longitude: {processedHouses.filter(h => h.longitude >= 0).length}</p>
              <p>• Aspectos válidos: {finalAspects.filter(a => a.planet1 && a.planet2).length}</p>
              <p>• Datos de Verónica: {detectVeronicaData(processedPlanets) ? '✅' : '❌'}</p>
            </div>
          </div>
          
          {/* Lista de aspectos para debug */}
          {finalAspects.length > 0 && (
            <div className="mt-3 pt-3 border-t border-yellow-300">
              <p><strong>Aspectos detectados:</strong></p>
              <div className="flex flex-wrap gap-1 mt-2">
                {finalAspects.map((aspect, i) => (
                  <span key={i} className="bg-white px-2 py-1 rounded text-xs border border-yellow-300">
                    {aspect.planet1} {aspect.type} {aspect.planet2} ({aspect.orb?.toFixed(1)}°)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Wheel Chart Principal */}
      <div className="flex justify-center mb-6">
        <NatalChartWheel
          planets={processedPlanets}
          houses={processedHouses}
          aspects={finalAspects}
          ascendant={processedAscendant}
          midheaven={processedMidheaven}
          showAspects={showAspects}
          showPlanetNames={true}
          showDegrees={true}
          width={650}
          height={650}
        />
      </div>

      {/* Estadísticas de la Carta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Distribución de Elementos */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-bold text-blue-800 mb-3">Distribución de Elementos</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                Fuego
              </span>
              <span className="font-bold text-red-600">{chartStats.elementCount.fire}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Tierra
              </span>
              <span className="font-bold text-green-600">{chartStats.elementCount.earth}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Aire
              </span>
              <span className="font-bold text-blue-600">{chartStats.elementCount.air}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                Agua
              </span>
              <span className="font-bold text-purple-600">{chartStats.elementCount.water}</span>
            </div>
          </div>
        </div>

        {/* Aspectos por Tipo */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-bold text-purple-800 mb-3">Aspectos por Tipo</h3>
          <div className="space-y-2">
            {Object.entries(chartStats.aspectCount).map(([type, count]) => {
              const typeNames: Record<string, string> = {
                'conjunction': 'Conjunción',
                'opposition': 'Oposición',
                'trine': 'Trígono',
                'square': 'Cuadratura',
                'sextile': 'Sextil',
                'quincunx': 'Quincuncio'
              };
              
              const colors: Record<string, string> = {
                'conjunction': 'text-green-600',
                'opposition': 'text-red-600',
                'trine': 'text-blue-600',
                'square': 'text-orange-600',
                'sextile': 'text-purple-600',
                'quincunx': 'text-pink-600'
              };
              
              return (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-sm">{typeNames[type] || type}</span>
                  <span className={`font-bold ${colors[type] || 'text-gray-600'}`}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Información General */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-bold text-green-800 mb-3">Información General</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Planetas Totales</span>
              <span className="font-bold text-green-600">{chartStats.totalPlanets}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Casas Astrológicas</span>
              <span className="font-bold text-green-600">{chartStats.totalHouses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Aspectos Totales</span>
              <span className="font-bold text-green-600">{chartStats.totalAspects}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Planetas Retrógrados</span>
              <span className="font-bold text-red-600">{chartStats.retrogradeCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Planetas */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-3">Posiciones Planetarias</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left p-2 font-semibold">Planeta</th>
                <th className="text-left p-2 font-semibold">Signo</th>
                <th className="text-left p-2 font-semibold">Grado</th>
                <th className="text-left p-2 font-semibold">Casa</th>
                <th className="text-left p-2 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {processedPlanets.map((planet, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-white transition-colors">
                  <td className="p-2 font-medium">{planet.name}</td>
                  <td className="p-2">{planet.sign}</td>
                  <td className="p-2">{Math.floor((planet.longitude || 0) % 30)}°</td>
                  <td className="p-2">{planet.house || '?'}</td>
                  <td className="p-2">
                    {planet.isRetrograde ? (
                      <span className="text-red-600 font-bold">℞ Retrógrado</span>
                    ) : (
                      <span className="text-green-600">Directo</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Información de Ángulos */}
      {(processedAscendant || processedMidheaven) && (
        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
          <h3 className="font-bold text-indigo-800 mb-3">Ángulos Principales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {processedAscendant && (
              <div>
                <p className="font-semibold text-indigo-700">Ascendente (AC)</p>
                <p className="text-sm text-gray-600">
                  {processedAscendant.sign} {Math.floor((processedAscendant.longitude || 0) % 30)}°
                </p>
              </div>
            )}
            {processedMidheaven && (
              <div>
                <p className="font-semibold text-indigo-700">Medio Cielo (MC)</p>
                <p className="text-sm text-gray-600">
                  {processedMidheaven.sign} {Math.floor((processedMidheaven.longitude || 0) % 30)}°
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer con consejos */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          <strong>💡 Consejos:</strong> Pasa el cursor sobre los planetas y aspectos para ver más información. 
          Los aspectos se calculan automáticamente con precisión astrológica máxima.
        </p>
      </div>
    </div>
  );
};

// Exportación por defecto
export default ChartDisplay;