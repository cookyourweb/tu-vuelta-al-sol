// src/app/test-aspects/page.tsx - PÁGINA TEMPORAL PARA PROBAR ASPECTOS
'use client';

import React, { useState } from 'react';
import NatalChartWheel from '@/components/astrology/NatalChartWheel';

// Datos de prueba exactos de tu carta de referencia (10 Feb 1974, 07:30, Madrid)
const REFERENCE_DATA = {
  planets: [
    { name: 'Sol', longitude: 321.139, sign: 'Acuario', isRetrograde: false },
    { name: 'Luna', longitude: 186.058, sign: 'Libra', isRetrograde: false },
    { name: 'Mercurio', longitude: 309.5, sign: 'Acuario', isRetrograde: false },
    { name: 'Venus', longitude: 280.2, sign: 'Capricornio', isRetrograde: false },
    { name: 'Marte', longitude: 52.7, sign: 'Tauro', isRetrograde: false },
    { name: 'Júpiter', longitude: 34.1, sign: 'Aries', isRetrograde: false },
    { name: 'Saturno', longitude: 112.3, sign: 'Cáncer', isRetrograde: false },
    { name: 'Urano', longitude: 199.8, sign: 'Libra', isRetrograde: false },
    { name: 'Neptuno', longitude: 249.1, sign: 'Sagitario', isRetrograde: false },
    { name: 'Plutón', longitude: 207.4, sign: 'Escorpio', isRetrograde: false },
  ],
  houses: [
    { number: 1, longitude: 304.155 }, // Ascendente ≈ 04°09' Acuario
    { number: 2, longitude: 334 },
    { number: 3, longitude: 4 },
    { number: 4, longitude: 34 },
    { number: 5, longitude: 64 },
    { number: 6, longitude: 94 },
    { number: 7, longitude: 124.155 }, // Descendente
    { number: 8, longitude: 154 },
    { number: 9, longitude: 184 },
    { number: 10, longitude: 214 }, // MC
    { number: 11, longitude: 244 },
    { number: 12, longitude: 274 },
  ]
};

export default function TestAspectsPage() {
  const [showDebugInfo, setShowDebugInfo] = useState(true);
  const [currentDataSet, setCurrentDataSet] = useState('reference');

  // Datos alternativos para comparar
  const SIMPLE_DATA = {
    planets: [
      { name: 'Sol', longitude: 0, sign: 'Aries', isRetrograde: false },    // 0°
      { name: 'Luna', longitude: 180, sign: 'Libra', isRetrograde: false }, // 180° - Oposición
      { name: 'Venus', longitude: 120, sign: 'Leo', isRetrograde: false },  // 120° - Trígono con Sol
      { name: 'Marte', longitude: 90, sign: 'Cáncer', isRetrograde: false } // 90° - Cuadratura con Sol
    ],
    houses: [
      { number: 1, longitude: 0 },
      { number: 2, longitude: 30 },
      { number: 3, longitude: 60 },
      { number: 4, longitude: 90 },
      { number: 5, longitude: 120 },
      { number: 6, longitude: 150 },
      { number: 7, longitude: 180 },
      { number: 8, longitude: 210 },
      { number: 9, longitude: 240 },
      { number: 10, longitude: 270 },
      { number: 11, longitude: 300 },
      { number: 12, longitude: 330 },
    ]
  };

  const currentData = currentDataSet === 'reference' ? REFERENCE_DATA : SIMPLE_DATA;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-900">
        🔮 Test de Aspectos en Wheel Chart
      </h1>
      
      <div className="mb-8 max-w-4xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-blue-800 mb-4">📋 Instrucciones de Test</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-blue-700 mb-2">🎯 Qué deberías ver:</h3>
              <ul className="space-y-1 text-blue-600">
                <li>• <strong>Múltiples líneas de aspectos</strong> (no solo 1)</li>
                <li>• <strong>Colores diferentes</strong> por tipo de aspecto</li>
                <li>• <strong>Debug info</strong> mostrando aspectos calculados</li>
                <li>• <strong>Consola del navegador</strong> con logs detallados</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-700 mb-2">🔍 Aspectos esperados (Referencia):</h3>
              <ul className="space-y-1 text-blue-600">
                <li>• Sol-Luna: ~135° (Sesquicuadratura)</li>
                <li>• Sol-Mercurio: ~12° (No aspecto)</li>
                <li>• Luna-Urano: ~14° (No aspecto)</li>
                <li>• Varios aspectos más...</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="mb-6 text-center">
        <div className="inline-flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setCurrentDataSet('reference')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentDataSet === 'reference'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📊 Datos de Referencia (Feb 1974)
          </button>
          <button
            onClick={() => setCurrentDataSet('simple')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentDataSet === 'simple'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🎯 Datos Simples (Aspectos Obvios)
          </button>
        </div>
      </div>

      {/* Comparación lado a lado */}
      {currentDataSet === 'reference' && (
        <div className="mb-8 max-w-6xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-yellow-800 mb-4">🔍 Comparación Visual</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-yellow-700 mb-2">✅ Tu Implementación (Izquierda)</h4>
                <ul className="text-sm text-yellow-600 space-y-1">
                  <li>• <strong>Aspectos detectados:</strong> Verificar en debug info de abajo</li>
                  <li>• <strong>Líneas visibles:</strong> Contar colores diferentes</li>
                  <li>• <strong>Posiciones:</strong> Planetas en lugares correctos</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-700 mb-2">📊 Carta de Referencia (Derecha)</h4>
                <ul className="text-sm text-yellow-600 space-y-1">
                  <li>• <strong>Aspectos esperados:</strong> Líneas verdes, rojas, azules</li>
                  <li>• <strong>Distribución:</strong> Similar patrón de aspectos</li>
                  <li>• <strong>Planetas:</strong> Sol y Luna en posiciones similares</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded border">
              <p className="text-sm text-gray-700">
                <strong>✅ Señales de Éxito:</strong> Si ves múltiples líneas de colores (verde=trígonos, rojo=cuadraturas, azul=sextiles) 
                y los planetas están distribuidos similar a la carta de referencia, ¡tu implementación está funcionando correctamente!
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="mb-6 max-w-4xl mx-auto">
        <div className={`p-4 rounded-lg ${
          currentDataSet === 'reference' 
            ? 'bg-purple-50 border border-purple-200' 
            : 'bg-green-50 border border-green-200'
        }`}>
          <h3 className="font-bold mb-2">
            {currentDataSet === 'reference' 
              ? '📊 Dataset: Carta de Referencia (Verónica - 10 Feb 1974)'
              : '🎯 Dataset: Aspectos Simples y Obvios'
            }
          </h3>
          <p className="text-sm">
            {currentDataSet === 'reference' 
              ? 'Datos reales de tu carta de referencia. Deberías ver múltiples aspectos complejos.'
              : 'Datos diseñados para mostrar aspectos obvios: Sol-Luna oposición (180°), Sol-Venus trígono (120°), Sol-Marte cuadratura (90°).'
            }
          </p>
        </div>
      </div>

      {/* Wheel Chart */}
      <div className="mb-8">
        <NatalChartWheel
          planets={currentData.planets}
          houses={currentData.houses}
          width={600}
          height={600}
          showAspects={true} aspects={[]}        />
      </div>

      {/* Debug manual */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🔧 Debug Manual</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">🪐 Planetas Cargados:</h4>
              <div className="space-y-1 text-sm">
                {currentData.planets.map((planet, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{planet.name}:</span>
                    <span className="font-mono">{planet.longitude.toFixed(1)}°</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">📐 Cálculos Esperados:</h4>
              <div className="space-y-1 text-sm text-gray-600">
                {currentDataSet === 'reference' ? (
                  <>
                    <div>Sol (321°) - Luna (186°) = 135° ≈ Sesquicuadratura</div>
                    <div>Sol (321°) - Mercurio (309°) = 12° ≈ No aspecto</div>
                    <div>Luna (186°) - Urano (199°) = 14° ≈ No aspecto</div>
                    <div>Venus (280°) - Saturno (112°) = 168° ≈ Oposición</div>
                  </>
                ) : (
                  <>
                    <div>Sol (0°) - Luna (180°) = 180° ≈ <strong>Oposición</strong></div>
                    <div>Sol (0°) - Venus (120°) = 120° ≈ <strong>Trígono</strong></div>
                    <div>Sol (0°) - Marte (90°) = 90° ≈ <strong>Cuadratura</strong></div>
                    <div>Deberías ver <strong>3 líneas</strong> como mínimo</div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-2">🎯 Verificación Específica para tu Carta:</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-gray-600 mb-1">🔍 Aspectos que DEBES ver:</h5>
                <ul className="text-gray-600 space-y-1 text-xs">
                  <li>• <strong>Sol square Marte</strong> (cerca de 0.4°)</li>
                  <li>• <strong>Luna square Plutón</strong> (cerca de 0.5°)</li>
                  <li>• <strong>Marte square Júpiter</strong> (cerca de 3.0°)</li>
                  <li>• <strong>Neptuno sextile Plutón</strong> (cerca de 2.8°)</li>
                  <li>• <strong>Total esperado:</strong> 15-20 aspectos</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-600 mb-1">🎨 Colores que DEBES ver:</h5>
                <ul className="text-gray-600 space-y-1 text-xs">
                  <li>• <strong style={{color: '#FF9800'}}>Naranja:</strong> Cuadraturas (squares)</li>
                  <li>• <strong style={{color: '#4CAF50'}}>Verde:</strong> Trígonos (trines)</li>
                  <li>• <strong style={{color: '#2196F3'}}>Azul:</strong> Sextiles</li>
                  <li>• <strong style={{color: '#FFD700'}}>Dorado:</strong> Conjunciones</li>
                  <li>• <strong style={{color: '#FF4444'}}>Rojo:</strong> Oposiciones</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}