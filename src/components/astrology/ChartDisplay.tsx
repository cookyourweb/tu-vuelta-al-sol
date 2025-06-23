import React from 'react';
import NatalChartWheel from './NatalChartWheel';

// Define interfaces for props
interface House {
  number: number;
  sign: string;
  degree: number;
  minutes?: number;
  longitude?: number;
}

interface Planet {
  name: string;
  sign: string;
  degree: number;
  minutes?: number;
  longitude?: number;
  houseNumber?: number;
  isRetrograde?: boolean;
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
  };

  // Generar longitudes ficticias si no existen (para la rueda)
  const planetsWithLongitude = planets.map((planet, index) => ({
    ...planet,
    longitude: planet.longitude || (index * 30) + Math.random() * 30,
    minutes: planet.minutes || 0
  }));

  const housesWithLongitude = houses.map((house, index) => ({
    ...house,
    longitude: house.longitude || (index * 30),
    minutes: house.minutes || 0
  }));

  // Asegurar que ascendant y midheaven tengan las propiedades necesarias
  const ascendantWithDefaults = ascendant
    ? {
        longitude: ascendant.longitude,
        sign: (ascendant as any).sign || '',
        degree: (ascendant as any).degree || '',
        minutes: (ascendant as any).minutes || 0
      }
    : undefined;

  const midheavenWithDefaults = midheaven
    ? {
        longitude: midheaven.longitude,
        sign: (midheaven as any).sign || '',
        degree: (midheaven as any).degree || '',
        minutes: (midheaven as any).minutes || 0
      }
    : undefined;
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-800 mb-6 text-center">Carta Natal</h2>
      
      {/* Rueda Astrológica */}
      <div className="mb-8 flex justify-center">
        <NatalChartWheel
          planets={planetsWithLongitude}
          houses={housesWithLongitude}
          ascendant={ascendantWithDefaults}
          midheaven={midheavenWithDefaults}
          width={400}
          height={400}
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
      {(ascendant || midheaven) && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-indigo-700 mb-3">Ángulos Principales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ascendant && (
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800">Ascendente (AC)</h4>
                <p className="text-gray-600">Representa tu personalidad y cómo te presentas al mundo.</p>
              </div>
            )}
            {midheaven && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800">Medio Cielo (MC)</h4>
                <p className="text-gray-600">Representa tu vocación y reputación pública.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Planetas - Versión compacta */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-indigo-700 mb-3">Planetas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {planets.map((planet, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-xl mr-2">{planetSymbols[planet.name] || ''}</span>
                  <span className="font-medium">{planet.name}</span>
                  {planet.isRetrograde && <span className="ml-1 text-red-500 text-sm">R</span>}
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <span className="text-lg mr-1">{zodiacSymbols[planet.sign] || ''}</span>
                    <span className="text-sm">{planet.sign}</span>
                  </div>
                  <div className="text-xs text-gray-500">{planet.degree}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Casas - Versión compacta */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-indigo-700 mb-3">Casas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {houses.map((house, index) => (
            <div key={index} className="bg-gray-100 p-3 rounded-lg text-center">
              <div className="font-semibold text-sm">Casa {house.number}</div>
              <div className="flex items-center justify-center mt-1">
                <span className="text-lg mr-1">{zodiacSymbols[house.sign] || ''}</span>
                <span className="text-xs">{house.sign}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Aspectos Clave */}
      {keyAspects && keyAspects.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-indigo-700 mb-3">Aspectos Principales</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {keyAspects.slice(0, 8).map((aspect, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{aspect.planet_one.name}</span>
                    <span className="text-lg">{aspectSymbols[aspect.aspect.name] || '◯'}</span>
                    <span className="text-sm font-medium">{aspect.planet_two.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">{aspect.aspect.name}</div>
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
              {elementDistribution && Object.entries(elementDistribution).length > 0 && Object.entries(elementDistribution).reduce((a, b) => elementDistribution[a[0]] > elementDistribution[b[0]] ? a : b)[0] === 'fire' && 'Tu carta tiene predominancia de fuego, lo que indica una naturaleza apasionada, energética y orientada a la acción.'}
              {elementDistribution && Object.entries(elementDistribution).length > 0 && Object.entries(elementDistribution).reduce((a, b) => elementDistribution[a[0]] > elementDistribution[b[0]] ? a : b)[0] === 'earth' && 'Tu carta tiene predominancia de tierra, indicando una naturaleza práctica, estable y orientada a lo material.'}
              {elementDistribution && Object.entries(elementDistribution).length > 0 && Object.entries(elementDistribution).reduce((a, b) => elementDistribution[a[0]] > elementDistribution[b[0]] ? a : b)[0] === 'air' && 'Tu carta tiene predominancia de aire, indicando una naturaleza intelectual, comunicativa y social.'}
              {elementDistribution && Object.entries(elementDistribution).length > 0 && Object.entries(elementDistribution).reduce((a, b) => elementDistribution[a[0]] > elementDistribution[b[0]] ? a : b)[0] === 'water' && 'Tu carta tiene predominancia de agua, indicando una naturaleza emocional, intuitiva y empática.'}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Modalidad Dominante:</h4>
            <p className="text-gray-600">
              {modalityDistribution && Object.entries(modalityDistribution).length > 0 && Object.entries(modalityDistribution).reduce((a, b) => modalityDistribution[a[0]] > modalityDistribution[b[0]] ? a : b)[0] === 'cardinal' && 'Predominancia cardinal indica liderazgo natural, iniciativa y capacidad para comenzar proyectos.'}
              {modalityDistribution && Object.entries(modalityDistribution).length > 0 && Object.entries(modalityDistribution).reduce((a, b) => modalityDistribution[a[0]] > modalityDistribution[b[0]] ? a : b)[0] === 'fixed' && 'Predominancia fija indica estabilidad, determinación y resistencia al cambio.'}
              {modalityDistribution && Object.entries(modalityDistribution).length > 0 && Object.entries(modalityDistribution).reduce((a, b) => modalityDistribution[a[0]] > modalityDistribution[b[0]] ? a : b)[0] === 'mutable' && 'Predominancia mutable indica adaptabilidad, flexibilidad y capacidad de cambio.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartDisplay;
