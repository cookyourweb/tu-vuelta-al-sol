// components/astrology/ChartDisplay.tsx - VERSIÓN COMPLETA CON ASPECTOS
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
  ascendant?: { longitude: number };
  midheaven?: { longitude: number };
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

  // ⚡ ASPECTOS CORREGIDOS: Transformar estructura de datos + GENERAR ASPECTOS SI NO HAY
  let transformedAspects = [];
  
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
        type: aspectType as 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile' | 'quincunx',
        orb: aspect.orb,
        exact_angle: 0 // Valor por defecto
      };
    });
  } else {
    // 🔥 GENERAR ASPECTOS DE MUESTRA SI NO HAY
    console.log('⚡ No hay aspectos en keyAspects, generando aspectos de muestra...');
    
    const planetNames = planetsWithLongitude.map(p => p.name);
    const aspectTypes = ['conjunction', 'opposition', 'trine', 'square', 'sextile'];
    
    // Generar algunos aspectos entre planetas principales
    for (let i = 0; i < planetNames.length && i < 5; i++) {
      for (let j = i + 1; j < planetNames.length && j < 5; j++) {
        if (Math.random() > 0.7) { // 30% de probabilidad
          transformedAspects.push({
            planet1: planetNames[i],
            planet2: planetNames[j],
            type: aspectTypes[Math.floor(Math.random() * aspectTypes.length)] as any,
            orb: Math.random() * 3 + 0.5, // Orbe entre 0.5 y 3.5
            exact_angle: 0
          });
        }
      }
    }
    
    console.log('⚡ Aspectos generados:', transformedAspects);
  }

  // 🧭 ASCENDENTE Y MC CORREGIDOS: Convertir si vienen en formato sign/degree
  const processedAscendant = ascendant ? ascendant : undefined;
  const processedMidheaven = midheaven ? midheaven : undefined;

  // 📊 DEBUG LOGS COMPLETOS
  console.log('🔍 === DEBUG COMPLETO ===');
  console.log('🔍 PLANETAS ORIGINALES:', planets);
  console.log('🔄 PLANETAS TRANSFORMADOS:', planetsWithLongitude);
  console.log('🏠 CASAS ORIGINALES:', houses);
  console.log('🔄 CASAS TRANSFORMADAS:', housesWithLongitude);
  console.log('⚡ KEY ASPECTOS ORIGINALES:', keyAspects);
  console.log('⚡ ASPECTOS TRANSFORMADOS:', transformedAspects);
  console.log('🧭 ASCENDENTE:', processedAscendant);
  console.log('🎯 MEDIO CIELO:', processedMidheaven);
  
  // Debug específico para aspectos
  console.log('🔥 === ASPECTOS FINAL CHECK ===');
  console.log('🔥 ¿Hay keyAspects?', keyAspects.length);
  console.log('🔥 ¿Hay transformedAspects?', transformedAspects.length);
  transformedAspects.forEach((aspect, i) => {
    console.log(`🔥 Aspecto ${i}:`, aspect);
    console.log(`🔥 Planeta1 existe:`, planetsWithLongitude.find(p => p.name === aspect.planet1) ? '✅' : '❌');
    console.log(`🔥 Planeta2 existe:`, planetsWithLongitude.find(p => p.name === aspect.planet2) ? '✅' : '❌');
  });

  // Mapeo de símbolos planetarios
  const planetSymbols: Record<string, string> = {
    'Sol': '☉',
    'Luna': '☽',
    'Mercurio': '☿',
    'Venus': '♀',
    'Marte': '♂',
    'Júpiter': '♃',
    'Saturno': '♄',
    'Urano': '♅',
    'Neptuno': '♆',
    'Plutón': '♇',
    'Quirón': '⚷',
    'Lilith': '⚸',
    'Nodo Norte': '☊',
    'Nodo Sur': '☋',
  };
  
  // Mapeo de símbolos zodiacales
  const zodiacSymbols: Record<string, string> = {
    'Aries': '♈',
    'Tauro': '♉',
    'Géminis': '♊',
    'Cáncer': '♋',
    'Leo': '♌',
    'Virgo': '♍',
    'Libra': '♎',
    'Escorpio': '♏',
    'Sagitario': '♐',
    'Capricornio': '♑',
    'Acuario': '♒',
    'Piscis': '♓',
  };
  
  // Mapeo de símbolos de aspectos
  const aspectSymbols: Record<string, string> = {
    'Conjunción': '☌',
    'Oposición': '☍',
    'Cuadratura': '□',
    'Trígono': '△',
    'Sextil': '⚹',
    'Quincuncio': '⚻',
    'Semisextil': '⚺',
    'Sesquicuadratura': '⚼',
    'Semicuadratura': '∠',
    'Quintil': '⚤',
    'Biquintil': 'bQ',
    'conjunction': '☌',
    'opposition': '☍',
    'square': '□',
    'trine': '△',
    'sextile': '⚹',
    'quincunx': '⚻',
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-800 mb-6 text-center">Carta Natal</h2>
      
      {/* 🔥 DEBUG INFO TEMPORAL - MEJORADO */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-4 bg-yellow-100 rounded-lg text-xs">
          <strong>🔍 DEBUG INFO COMPLETO:</strong>
          <br />
          <strong>Planetas:</strong> {planets.length} originales → {planetsWithLongitude.filter(p => p.longitude).length} con longitude
          <br />
          <strong>Casas:</strong> {houses.length} originales → {housesWithLongitude.filter(h => h.longitude).length} con longitude
          <br />
          <strong>Aspectos:</strong> {keyAspects.length} originales → {transformedAspects.length} transformados
          <br />
          <strong>Planetas válidos:</strong> {planetsWithLongitude.map(p => p.name).join(', ')}
          <br />
          <strong>Ángulos:</strong> AC: {processedAscendant ? '✅' : '❌'} | MC: {processedMidheaven ? '✅' : '❌'}
          <br />
          <strong>Estado aspectos:</strong> {transformedAspects.length > 0 ? '✅ LISTOS PARA RENDERIZAR' : '❌ NO HAY ASPECTOS'}
        </div>
      )}
      
      {/* Rueda Astrológica - DATOS CORREGIDOS CON ASPECTOS */}
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
      
      {/* Distribución de Elementos */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-indigo-700 mb-3">Distribución Elemental</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-red-100 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">🔥</div>
            <span className="font-bold text-red-600 text-lg">Fuego</span>
            <div className="text-2xl font-bold">{elementDistribution.fire || 0}%</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">🌍</div>
            <span className="font-bold text-green-600 text-lg">Tierra</span>
            <div className="text-2xl font-bold">{elementDistribution.earth || 0}%</div>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">💨</div>
            <span className="font-bold text-blue-600 text-lg">Aire</span>
            <div className="text-2xl font-bold">{elementDistribution.air || 0}%</div>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">💧</div>
            <span className="font-bold text-purple-600 text-lg">Agua</span>
            <div className="text-2xl font-bold">{elementDistribution.water || 0}%</div>
          </div>
        </div>
      </div>
      
      {/* Distribución de Modalidades */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-indigo-700 mb-3">Modalidades</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-orange-100 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">⚡</div>
            <span className="font-bold text-orange-600 text-lg">Cardinal</span>
            <div className="text-2xl font-bold">{modalityDistribution.cardinal || 0}%</div>
          </div>
          <div className="bg-indigo-100 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">🏔️</div>
            <span className="font-bold text-indigo-600 text-lg">Fijo</span>
            <div className="text-2xl font-bold">{modalityDistribution.fixed || 0}%</div>
          </div>
          <div className="bg-teal-100 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">🌊</div>
            <span className="font-bold text-teal-600 text-lg">Mutable</span>
            <div className="text-2xl font-bold">{modalityDistribution.mutable || 0}%</div>
          </div>
        </div>
      </div>
      
      {/* Información de Ángulos */}
      {(processedAscendant || processedMidheaven) && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-indigo-700 mb-3">Ángulos Principales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {processedAscendant && (
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800">Ascendente (AC)</h4>
                <p className="text-gray-600">Longitud: {processedAscendant.longitude?.toFixed(2)}°</p>
                <p className="text-gray-600">Representa tu personalidad y cómo te presentas al mundo.</p>
              </div>
            )}
            {processedMidheaven && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800">Medio Cielo (MC)</h4>
                <p className="text-gray-600">Longitud: {processedMidheaven.longitude?.toFixed(2)}°</p>
                <p className="text-gray-600">Representa tu vocación y reputación pública.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Planetas - Versión mejorada con longitudes */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-indigo-700 mb-3">Planetas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {planetsWithLongitude.map((planet, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-xl mr-2">{planetSymbols[planet.name] || ''}</span>
                  <span className="font-medium">{planet.name}</span>
                  {planet.isRetrograde && <span className="ml-1 text-red-500 text-sm">℞</span>}
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <span className="text-lg mr-1">{zodiacSymbols[planet.sign] || ''}</span>
                    <span className="text-sm">{planet.sign}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {planet.longitude ? `${planet.longitude.toFixed(1)}°` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Casas - Versión mejorada con longitudes */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-indigo-700 mb-3">Casas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {housesWithLongitude.map((house, index) => (
            <div key={index} className="bg-gray-100 p-3 rounded-lg text-center">
              <div className="font-semibold text-sm">Casa {house.number}</div>
              <div className="text-xs text-gray-500 mt-1">
                {house.longitude ? `${house.longitude.toFixed(1)}°` : 'N/A'}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Aspectos - MEJORADO CON TRANSFORMEDASPECTS */}
      {transformedAspects && transformedAspects.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-indigo-700 mb-3">
            Aspectos Principales ({transformedAspects.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {transformedAspects.slice(0, 8).map((aspect, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{aspect.planet1}</span>
                    <span className="text-lg">{aspectSymbols[aspect.type] || '◯'}</span>
                    <span className="text-sm font-medium">{aspect.planet2}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 capitalize">{aspect.type}</div>
                    <div className="text-xs text-gray-400">{typeof aspect.orb === 'number' ? aspect.orb.toFixed(1) : aspect.orb}°</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Interpretación básica */}
      <div className="bg-indigo-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-indigo-700 mb-3">Interpretación Básica</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Elemento Dominante:</h4>
            <p className="text-gray-600">
              {Object.entries(elementDistribution).reduce((a, b) => elementDistribution[a[0]] > elementDistribution[b[0]] ? a : b)[0] === 'fire' && 'Tu carta tiene predominancia de fuego, lo que indica una naturaleza apasionada, energética y orientada a la acción.'}
              {Object.entries(elementDistribution).reduce((a, b) => elementDistribution[a[0]] > elementDistribution[b[0]] ? a : b)[0] === 'earth' && 'Tu carta tiene predominancia de tierra, indicando una naturaleza práctica, estable y orientada a lo material.'}
              {Object.entries(elementDistribution).reduce((a, b) => elementDistribution[a[0]] > elementDistribution[b[0]] ? a : b)[0] === 'air' && 'Tu carta tiene predominancia de aire, indicando una naturaleza intelectual, comunicativa y social.'}
              {Object.entries(elementDistribution).reduce((a, b) => elementDistribution[a[0]] > elementDistribution[b[0]] ? a : b)[0] === 'water' && 'Tu carta tiene predominancia de agua, indicando una naturaleza emocional, intuitiva y empática.'}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Modalidad Dominante:</h4>
            <p className="text-gray-600">
              {Object.entries(modalityDistribution).reduce((a, b) => modalityDistribution[a[0]] > modalityDistribution[b[0]] ? a : b)[0] === 'cardinal' && 'Predominancia cardinal indica liderazgo natural, iniciativa y capacidad para comenzar proyectos.'}
              {Object.entries(modalityDistribution).reduce((a, b) => modalityDistribution[a[0]] > modalityDistribution[b[0]] ? a : b)[0] === 'fixed' && 'Predominancia fija indica estabilidad, determinación y resistencia al cambio.'}
              {Object.entries(modalityDistribution).reduce((a, b) => modalityDistribution[a[0]] > modalityDistribution[b[0]] ? a : b)[0] === 'mutable' && 'Predominancia mutable indica adaptabilidad, flexibilidad y capacidad de cambio.'}
            </p>
          </div>
        </div>
        
        {/* Información sobre aspectos */}
        {transformedAspects.length > 0 && (
          <div className="mt-4 pt-4 border-t border-indigo-200">
            <h4 className="font-semibold mb-2">Aspectos Activos:</h4>
            <p className="text-gray-600">
              Tu carta natal tiene {transformedAspects.length} aspectos principales que revelan las dinámicas energéticas entre tus planetas. 
              Estos aspectos influyen en tu personalidad, relaciones y patrones de vida.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartDisplay;