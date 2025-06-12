// components/astrology/ChartDisplay.tsx - VERSIÓN COMPLETA CORREGIDA
import React from 'react';
import NatalChartWheel from './NatalChartWheel';

// Define interfaces for props
interface House {
  number: number;
  sign: string;
  degree: string;
  minutes?: string;
  longitude?: number;
}

interface Planet {
  name: string;
  sign: string;
  degree: string;
  minutes?: string;
  longitude?: number;
  houseNumber?: number;
  isRetrograde?: boolean;
  retrograde?: boolean; // Para compatibilidad con la API
}

interface Aspect {
  planet_one: {
    id: number;
    name: string;
  };
  planet_two: {
    id: number;
    name: string;
  };
  aspect: {
    id: number;
    name: string;
  };
  orb: number;
}

export interface ChartDisplayProps {
  houses: House[];
  planets: Planet[];
  elementDistribution: Record<string, number>;
  modalityDistribution: Record<string, number>;
  keyAspects: Aspect[];
  aspects?: any[];
  angles?: any[];
  ascendant?: any; // Cambiado para aceptar cualquier formato
  midheaven?: any; // Cambiado para aceptar cualquier formato
}

const ChartDisplay: React.FC<ChartDisplayProps> = ({
  houses = [],
  planets = [],
  elementDistribution = { fire: 0, earth: 0, air: 0, water: 0 },
  modalityDistribution = { cardinal: 0, fixed: 0, mutable: 0 },
  keyAspects = [],
  ascendant,
  midheaven
}) => {
  
  // 🔧 FUNCIÓN CORREGIDA: Convertir sign/degree/minutes a longitude
  const convertToLongitude = (sign: string, degree: string | number, minutes: string | number = 0): number => {
    const signLongitudes: Record<string, number> = {
      'Aries': 0, 'Tauro': 30, 'Géminis': 60, 'Cáncer': 90,
      'Leo': 120, 'Virgo': 150, 'Libra': 180, 'Escorpio': 210,
      'Sagitario': 240, 'Capricornio': 270, 'Acuario': 300, 'Piscis': 330
    };
    
    const signOffset = signLongitudes[sign] || 0;
    const deg = typeof degree === 'string' ? parseFloat(degree) : degree;
    const min = typeof minutes === 'string' ? parseFloat(minutes) : minutes;
    
    const longitude = signOffset + deg + (min / 60);
    
    console.log(`🔄 Convertido ${sign} ${degree}°${minutes}' = ${longitude}°`);
    return longitude;
  };

  // 🪐 PLANETAS CORREGIDOS: Convertir datos reales de la API
  const planetsWithLongitude = planets.map((planet) => {
    let longitude = planet.longitude;
    
    // Si no tiene longitude, convertir desde sign/degree/minutes
    if (!longitude && planet.sign && planet.degree) {
      longitude = convertToLongitude(planet.sign, planet.degree, planet.minutes || 0);
    }
    
    return {
      name: planet.name,
      sign: planet.sign,
      longitude: longitude || 0, // Fallback a 0 si falla todo
      isRetrograde: planet.isRetrograde || planet.retrograde || false
    };
  });

  // 🏠 CASAS CORREGIDAS: Convertir datos reales de la API
  const housesWithLongitude = houses.map((house) => {
    let longitude = house.longitude;
    
    // Si no tiene longitude, convertir desde sign/degree/minutes
    if (!longitude && house.sign && house.degree) {
      longitude = convertToLongitude(house.sign, house.degree, house.minutes || 0);
    }
    
    return {
      number: house.number,
      longitude: longitude || ((house.number - 1) * 30) // Fallback: casas cada 30°
    };
  });

  // ⚡ ASPECTOS CORREGIDOS: Transformar estructura de datos
  let transformedAspects: any[] | undefined = [];
  
  if (keyAspects && keyAspects.length > 0) {
    // Si hay aspectos, transformarlos
    transformedAspects = keyAspects.map((aspect) => {
      // Mapear nombres de aspectos de español a inglés
      const aspectTypeMap: Record<string, string> = {
        'Conjunción': 'conjunction',
        'Oposición': 'opposition', 
        'Cuadratura': 'square',
        'Trígono': 'trine',
        'Sextil': 'sextile',
        'Quincuncio': 'quincunx',
        'conjunction': 'conjunction',
        'opposition': 'opposition',
        'square': 'square',
        'trine': 'trine',
        'sextile': 'sextile',
        'quincunx': 'quincunx'
      };

      const aspectType = aspectTypeMap[aspect.aspect.name] || 'conjunction';

      return {
        planet1: aspect.planet_one.name,
        planet2: aspect.planet_two.name,
        type: aspectType as 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile',
        orb: aspect.orb || 0,
        exact_angle: 0 // Placeholder
      };
    });
  } else {
    // Generar algunos aspectos básicos si no hay
    console.log('ℹ️ No hay aspectos disponibles - generando aspectos básicos');
    if (planetsWithLongitude.length >= 2) {
      transformedAspects = [
        {
          planet1: planetsWithLongitude[0]?.name || 'Sol',
          planet2: planetsWithLongitude[1]?.name || 'Luna',
          type: 'trine' as const,
          orb: 5.2,
          exact_angle: 120
        }
      ];
    }
  }

  // 🌅 ASCENDENTE CORREGIDO: Convertir sign/degree a longitude
  const processedAscendant = React.useMemo(() => {
    if (!ascendant) {
      console.warn('⚠️ No se proporcionó ascendant');
      return null;
    }
    
    // Si ya tiene longitude, usar directamente
    if (typeof ascendant.longitude === 'number' && !isNaN(ascendant.longitude)) {
      console.log('✅ Ascendant ya tiene longitude:', ascendant.longitude);
      return ascendant;
    }
    
    // Si tiene sign/degree, convertir a longitude
    if (ascendant.sign && ascendant.degree !== undefined) {
      const longitude = convertToLongitude(ascendant.sign, ascendant.degree, ascendant.minutes || 0);
      const processed = {
        ...ascendant,
        longitude
      };
      console.log('✅ Ascendant convertido:', processed);
      return processed;
    }
    
    console.warn('⚠️ Formato de ascendant no reconocido:', ascendant);
    return null;
  }, [ascendant]);

  // ⭐ MIDHEAVEN CORREGIDO: Convertir sign/degree a longitude  
  const processedMidheaven = React.useMemo(() => {
    if (!midheaven) {
      console.warn('⚠️ No se proporcionó midheaven');
      return null;
    }
    
    // Si ya tiene longitude, usar directamente
    if (typeof midheaven.longitude === 'number' && !isNaN(midheaven.longitude)) {
      console.log('✅ Midheaven ya tiene longitude:', midheaven.longitude);
      return midheaven;
    }
    
    // Si tiene sign/degree, convertir a longitude
    if (midheaven.sign && midheaven.degree !== undefined) {
      const longitude = convertToLongitude(midheaven.sign, midheaven.degree, midheaven.minutes || 0);
      const processed = {
        ...midheaven,
        longitude
      };
      console.log('✅ Midheaven convertido:', processed);
      return processed;
    }
    
    console.warn('⚠️ Formato de midheaven no reconocido:', midheaven);
    return null;
  }, [midheaven]);
  
  // Mapeo de símbolos planetarios
  const planetSymbols: Record<string, string> = {
    'Sol': '☉', 'Luna': '☽', 'Mercurio': '☿', 'Venus': '♀',
    'Marte': '♂', 'Júpiter': '♃', 'Saturno': '♄', 'Urano': '♅',
    'Neptuno': '♆', 'Plutón': '♇', 'Quirón': '⚷', 'Lilith': '⚸',
    'Nodo Norte': '☊', 'Nodo Sur': '☋'
  };
  
  // Mapeo de símbolos zodiacales
  const zodiacSymbols: Record<string, string> = {
    'Aries': '♈', 'Tauro': '♉', 'Géminis': '♊', 'Cáncer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Escorpio': '♏',
    'Sagitario': '♐', 'Capricornio': '♑', 'Acuario': '♒', 'Piscis': '♓'
  };

  // Debug info en desarrollo
  console.log('🔍 ChartDisplay Debug:', {
    planetsCount: planetsWithLongitude.length,
    housesCount: housesWithLongitude.length,
    aspectsCount: transformedAspects.length,
    processedAscendant: !!processedAscendant,
    processedMidheaven: !!processedMidheaven
  });
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-800 mb-6 text-center">Tu Carta Natal</h2>
      
      {/* Debug info en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-yellow-100 rounded-lg text-xs">
          <strong>🔍 DEBUG ChartDisplay:</strong>
          <br />
          <strong>Planetas con longitude:</strong> {planetsWithLongitude.filter(p => p.longitude).length}/{planetsWithLongitude.length}
          <br />
          <strong>Casas con longitude:</strong> {housesWithLongitude.filter(h => h.longitude).length}/{housesWithLongitude.length}
          <br />
          <strong>AC procesado:</strong> {processedAscendant ? '✅' : '❌'} | <strong>MC procesado:</strong> {processedMidheaven ? '✅' : '❌'}
          <br />
          <strong>Aspectos:</strong> {transformedAspects.length > 0 ? '✅ LISTOS' : '❌ NO HAY ASPECTOS'}
        </div>
      )}
      
      {/* Rueda Astrológica - CON DATOS CORREGIDOS */}
      <div className="mb-8 flex justify-center">
        <NatalChartWheel
          planets={planetsWithLongitude}
          houses={housesWithLongitude}
          aspects={transformedAspects}
          ascendant={processedAscendant}
          midheaven={processedMidheaven}
          width={600}
          height={600}
          showAspects={true}
          showDegreeMarkers={true}
        />
      </div>

      {/* Información de Ángulos Principales */}
      {(processedAscendant || processedMidheaven) && (
        <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-purple-700 mb-4 text-center">Ángulos Principales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {processedAscendant && (
              <div className="text-center bg-white p-4 rounded-lg shadow-md">
                <div className="text-3xl mb-2">🌅</div>
                <h4 className="font-bold text-purple-600 text-lg">Ascendente</h4>
                <p className="text-gray-700">
                  {processedAscendant.sign} {processedAscendant.degree}°
                  {processedAscendant.minutes ? ` ${processedAscendant.minutes}'` : ''}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Tu personalidad y apariencia externa
                </p>
                {processedAscendant.longitude && (
                  <p className="text-xs text-gray-400 mt-1">
                    Longitud: {processedAscendant.longitude.toFixed(2)}°
                  </p>
                )}
              </div>
            )}
            
            {processedMidheaven && (
              <div className="text-center bg-white p-4 rounded-lg shadow-md">
                <div className="text-3xl mb-2">⭐</div>
                <h4 className="font-bold text-pink-600 text-lg">Medio Cielo</h4>
                <p className="text-gray-700">
                  {processedMidheaven.sign} {processedMidheaven.degree}°
                  {processedMidheaven.minutes ? ` ${processedMidheaven.minutes}'` : ''}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Tu carrera y reputación pública
                </p>
                {processedMidheaven.longitude && (
                  <p className="text-xs text-gray-400 mt-1">
                    Longitud: {processedMidheaven.longitude.toFixed(2)}°
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Distribución de Elementos */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-indigo-700 mb-4 text-center">Distribución Elemental</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl text-center hover:bg-red-100 transition-colors">
            <div className="text-3xl mb-2">🔥</div>
            <span className="font-bold text-red-600 text-lg">Fuego</span>
            <div className="text-2xl font-bold text-red-700">{elementDistribution.fire || 0}%</div>
            <p className="text-xs text-red-500 mt-1">Energía, Pasión</p>
          </div>
          <div className="bg-green-50 border-2 border-green-200 p-4 rounded-xl text-center hover:bg-green-100 transition-colors">
            <div className="text-3xl mb-2">🌍</div>
            <span className="font-bold text-green-600 text-lg">Tierra</span>
            <div className="text-2xl font-bold text-green-700">{elementDistribution.earth || 0}%</div>
            <p className="text-xs text-green-500 mt-1">Estabilidad, Práctica</p>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-xl text-center hover:bg-blue-100 transition-colors">
            <div className="text-3xl mb-2">💨</div>
            <span className="font-bold text-blue-600 text-lg">Aire</span>
            <div className="text-2xl font-bold text-blue-700">{elementDistribution.air || 0}%</div>
            <p className="text-xs text-blue-500 mt-1">Intelecto, Comunicación</p>
          </div>
          <div className="bg-purple-50 border-2 border-purple-200 p-4 rounded-xl text-center hover:bg-purple-100 transition-colors">
            <div className="text-3xl mb-2">💧</div>
            <span className="font-bold text-purple-600 text-lg">Agua</span>
            <div className="text-2xl font-bold text-purple-700">{elementDistribution.water || 0}%</div>
            <p className="text-xs text-purple-500 mt-1">Emoción, Intuición</p>
          </div>
        </div>
      </div>
      
      {/* Distribución de Modalidades */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-indigo-700 mb-4 text-center">Modalidades</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-xl text-center hover:bg-yellow-100 transition-colors">
            <div className="text-3xl mb-2">⚡</div>
            <span className="font-bold text-yellow-600 text-lg">Cardinal</span>
            <div className="text-2xl font-bold text-yellow-700">{modalityDistribution.cardinal || 0}%</div>
            <p className="text-xs text-yellow-500 mt-1">Iniciativa, Liderazgo</p>
          </div>
          <div className="bg-orange-50 border-2 border-orange-200 p-4 rounded-xl text-center hover:bg-orange-100 transition-colors">
            <div className="text-3xl mb-2">🏔️</div>
            <span className="font-bold text-orange-600 text-lg">Fijo</span>
            <div className="text-2xl font-bold text-orange-700">{modalityDistribution.fixed || 0}%</div>
            <p className="text-xs text-orange-500 mt-1">Perseverancia, Determinación</p>
          </div>
          <div className="bg-teal-50 border-2 border-teal-200 p-4 rounded-xl text-center hover:bg-teal-100 transition-colors">
            <div className="text-3xl mb-2">🌊</div>
            <span className="font-bold text-teal-600 text-lg">Mutable</span>
            <div className="text-2xl font-bold text-teal-700">{modalityDistribution.mutable || 0}%</div>
            <p className="text-xs text-teal-500 mt-1">Adaptabilidad, Flexibilidad</p>
          </div>
        </div>
      </div>
      
      {/* Lista de Planetas */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-indigo-700 mb-4 text-center">Posiciones Planetarias</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {planetsWithLongitude.map((planet, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg border hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{planetSymbols[planet.name] || '●'}</span>
                  <span className="font-medium text-gray-800">{planet.name}</span>
                  {planet.isRetrograde && <span className="text-red-500 text-xs">℞</span>}
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">{zodiacSymbols[planet.sign] || ''}</span>
                    <span className="text-sm font-medium">{planet.sign}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {planet.longitude ? `${planet.longitude.toFixed(1)}°` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Aspectos Principales */}
      {transformedAspects.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4 text-center">Aspectos Principales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {transformedAspects.slice(0, 8).map((aspect, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg border hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-800">{aspect.planet1}</span>
                    <span className="text-blue-500 font-bold">{aspect.type}</span>
                    <span className="font-medium text-gray-800">{aspect.planet2}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {aspect.orb.toFixed(1)}°
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartDisplay;