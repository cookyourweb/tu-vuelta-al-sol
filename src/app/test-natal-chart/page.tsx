// src/app/test-natal-chart/page.tsx - VERSIÓN COMPLETADA Y CORREGIDA
'use client';

import React, { useState, useEffect } from 'react';
import NatalChartWheel from '../../components/astrology/NatalChartWheel';
import ChartDisplay from '../../components/astrology/ChartDisplay';

// =============================================================================
// 🔥 DATOS DE PRUEBA CORREGIDOS - Solo para testing
// =============================================================================

const REFERENCE_CHART_DATA = {
  birthData: {
    date: '1974-02-10',
    time: '07:30:00',
    place: 'Madrid, España',
    latitude: 40.4164,
    longitude: -3.7025,
    timezone: 'Europe/Madrid'
  },
  planets: [
    { name: 'Sol', sign: 'Acuario', degree: 21, minutes: 8, longitude: 321.1397, house: 1, isRetrograde: false },
    { name: 'Luna', sign: 'Cáncer', degree: 6, minutes: 3, longitude: 96.0586, house: 8, isRetrograde: false },
    { name: 'Mercurio', sign: 'Piscis', degree: 9, minutes: 16, longitude: 339.2667, house: 1, isRetrograde: false },
    { name: 'Venus', sign: 'Escorpio', degree: 25, minutes: 59, longitude: 205.9833, house: 12, isRetrograde: true },
    { name: 'Marte', sign: 'Tauro', degree: 20, minutes: 47, longitude: 50.7833, house: 3, isRetrograde: false },
    { name: 'Júpiter', sign: 'Acuario', degree: 23, minutes: 45, longitude: 323.75, house: 1, isRetrograde: false },
    { name: 'Saturno', sign: 'Géminis', degree: 28, minutes: 4, longitude: 88.0667, house: 5, isRetrograde: true },
    { name: 'Urano', sign: 'Escorpio', degree: 27, minutes: 44, longitude: 207.7333, house: 8, isRetrograde: true },
    { name: 'Neptuno', sign: 'Sagitario', degree: 9, minutes: 22, longitude: 249.3667, house: 10, isRetrograde: false },
    { name: 'Plutón', sign: 'Libra', degree: 6, minutes: 32, longitude: 186.5333, house: 8, isRetrograde: true }
  ],
  houses: [
    { number: 1, sign: 'Acuario', degree: 4, minutes: 9, longitude: 304.15 },
    { number: 2, sign: 'Piscis', degree: 12, minutes: 0, longitude: 342 },
    { number: 3, sign: 'Aries', degree: 20, minutes: 0, longitude: 20 },
    { number: 4, sign: 'Tauro', degree: 25, minutes: 0, longitude: 55 },
    { number: 5, sign: 'Géminis', degree: 20, minutes: 0, longitude: 80 },
    { number: 6, sign: 'Cáncer', degree: 12, minutes: 0, longitude: 102 },
    { number: 7, sign: 'Leo', degree: 4, minutes: 9, longitude: 124.15 },
    { number: 8, sign: 'Virgo', degree: 12, minutes: 0, longitude: 162 },
    { number: 9, sign: 'Libra', degree: 20, minutes: 0, longitude: 200 },
    { number: 10, sign: 'Escorpio', degree: 25, minutes: 0, longitude: 235 },
    { number: 11, sign: 'Sagitario', degree: 20, minutes: 0, longitude: 260 },
    { number: 12, sign: 'Capricornio', degree: 12, minutes: 0, longitude: 282 }
  ],
  // 🔥 ASCENDENTE CORREGIDO: Acuario, no Aries
  ascendant: { sign: 'Acuario', degree: 4, minutes: 9, longitude: 304.15 },
  midheaven: { sign: 'Escorpio', degree: 25, minutes: 0, longitude: 235 }
};

// =============================================================================
// 🔥 COMPONENTE DE CÁLCULO DE ASPECTOS CORREGIDO
// =============================================================================

type AspectType = 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile' | 'quincunx';

interface Aspect {
  planet1: string;
  planet2: string;
  type: AspectType;
  orb: number;
  exact: boolean;
  angle: number;
}

const ASPECTS: { type: AspectType; angle: number; orb: number }[] = [
  { type: 'conjunction', angle: 0, orb: 8 },
  { type: 'opposition', angle: 180, orb: 8 },
  { type: 'trine', angle: 120, orb: 6 },
  { type: 'square', angle: 90, orb: 6 },
  { type: 'sextile', angle: 60, orb: 4 },
  { type: 'quincunx', angle: 150, orb: 3 },
];

function calculateAllAspects(planets: { name: string; sign: string; degree: number; minutes: number; longitude: number; house: number; isRetrograde: boolean; }[]): Aspect[] {
  const aspects: Aspect[] = [];
  
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      
      // Calcular diferencia angular
      let diff = Math.abs(p1.longitude - p2.longitude);
      if (diff > 180) diff = 360 - diff;
      
      // Verificar cada tipo de aspecto
      for (const aspectDef of ASPECTS) {
        const orb = Math.abs(diff - aspectDef.angle);
        
        if (orb <= aspectDef.orb) {
          aspects.push({
            planet1: p1.name,
            planet2: p2.name,
            type: aspectDef.type,
            orb: parseFloat(orb.toFixed(2)),
            exact: orb < 1,
            angle: parseFloat(diff.toFixed(2)),
          });
          break; // Solo un aspecto por par de planetas
        }
      }
    }
  }
  
  return aspects.sort((a, b) => a.orb - b.orb); // Ordenar por precisión
}

// =============================================================================
// 🔥 COMPONENTE DE TEST INTERACTIVO
// =============================================================================

interface TestResult {
  category: string;
  expected: any;
  actual: any;
  passed: boolean;
  description: string;
}

const NatalChartTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testData, setTestData] = useState<any>(null);

  const runTests = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    try {
      // 🔥 TEST 1: API de Prokerala con datos corregidos
      console.log('🧪 Ejecutando test de API Prokerala...');
      
      const apiResponse = await fetch('/api/prokerala/natal-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: '1974-02-10',
          birthTime: '07:30:00',
          latitude: 40.4164,
          longitude: -3.7025,
          timezone: 'Europe/Madrid'
        })
      });

      const apiData = await apiResponse.json();
      setTestData(apiData.data);

      // Test del ascendente
      results.push({
        category: 'API',
        expected: 'Acuario',
        actual: apiData.data?.ascendant?.sign || 'No encontrado',
        passed: apiData.data?.ascendant?.sign === 'Acuario',
        description: 'Ascendente debe ser Acuario para Madrid 10/02/1974 7:30'
      });

      // Test de planetas
      results.push({
        category: 'API',
        expected: 10,
        actual: apiData.data?.planets?.length || 0,
        passed: (apiData.data?.planets?.length || 0) >= 7,
        description: 'Debe devolver al menos 7 planetas principales'
      });

      // Test de casas
      results.push({
        category: 'API',
        expected: 12,
        actual: apiData.data?.houses?.length || 0,
        passed: (apiData.data?.houses?.length || 0) === 12,
        description: 'Debe devolver exactamente 12 casas astrológicas'
      });

      // Test de aspectos
      results.push({
        category: 'API',
        expected: '> 0',
        actual: apiData.data?.aspects?.length || 0,
        passed: (apiData.data?.aspects?.length || 0) > 0,
        description: 'Debe calcular aspectos planetarios'
      });

    } catch (error) {
      console.error('Error en test de API:', error);
      results.push({
        category: 'API',
        expected: 'Success',
        actual: 'Error: ' + (error as Error).message,
        passed: false,
        description: 'La API debe responder sin errores'
      });
    }

    // 🔥 TEST 2: Cálculo manual de aspectos
    const calculatedAspects = calculateAllAspects(REFERENCE_CHART_DATA.planets);
    
    results.push({
      category: 'Cálculos',
      expected: '> 5',
      actual: calculatedAspects.length,
      passed: calculatedAspects.length > 5,
      description: 'Debe calcular múltiples aspectos entre planetas'
    });

    // Test de aspecto Sol-Júpiter (ambos en Acuario)
    const solJupiterAspect = calculatedAspects.find(a => 
      (a.planet1 === 'Sol' && a.planet2 === 'Júpiter') ||
      (a.planet1 === 'Júpiter' && a.planet2 === 'Sol')
    );
    
    results.push({
      category: 'Cálculos',
      expected: 'conjunction',
      actual: solJupiterAspect?.type || 'No encontrado',
      passed: solJupiterAspect?.type === 'conjunction',
      description: 'Sol y Júpiter deben estar en conjunción (ambos en Acuario)'
    });

    // 🔥 TEST 3: Validación de coordenadas
    results.push({
      category: 'Datos',
      expected: 'Madrid coordinates',
      actual: `${REFERENCE_CHART_DATA.birthData.latitude}, ${REFERENCE_CHART_DATA.birthData.longitude}`,
      passed: Math.abs(REFERENCE_CHART_DATA.birthData.latitude - 40.4164) < 0.01,
      description: 'Coordenadas deben corresponder a Madrid'
    });

    setTestResults(results);
    setIsRunning(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-purple-300/30">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          🧪 Tests de Validación
          <span className="text-sm bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
            Solo Testing
          </span>
        </h2>
        
        <button
          onClick={runTests}
          disabled={isRunning}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            isRunning 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isRunning ? 'Ejecutando...' : 'Ejecutar Tests'}
        </button>
      </div>

      {/* Resultados de tests */}
      {testResults.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  result.passed 
                    ? 'bg-green-500/10 border-green-400/30' 
                    : 'bg-red-500/10 border-red-400/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-2xl ${result.passed ? '' : ''}`}>
                    {result.passed ? '✅' : '❌'}
                  </span>
                  <span className="font-bold text-white">
                    {result.category}
                  </span>
                </div>
                
                <p className="text-sm text-gray-300 mb-3">
                  {result.description}
                </p>
                
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Esperado:</span>
                    <span className="text-green-300 font-mono">{String(result.expected)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Actual:</span>
                    <span className={`font-mono ${result.passed ? 'text-green-300' : 'text-red-300'}`}>
                      {String(result.actual)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="bg-black/20 rounded-lg p-4 border border-white/20">
            <h3 className="font-bold text-white mb-2">📊 Resumen de Tests</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {testResults.filter(r => r.passed).length}
                </div>
                <div className="text-sm text-gray-300">Pasaron</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {testResults.filter(r => !r.passed).length}
                </div>
                <div className="text-sm text-gray-300">Fallaron</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {Math.round((testResults.filter(r => r.passed).length / testResults.length) * 100)}%
                </div>
                <div className="text-sm text-gray-300">Éxito</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Datos de API para debugging */}
      {testData && (
        <div className="mt-6 bg-black/30 rounded-lg p-4">
          <h3 className="font-bold text-white mb-2">🔍 Datos de API Recibidos</h3>
          <div className="text-xs text-gray-300 font-mono">
            <p><strong>Ascendente:</strong> {testData.ascendant?.sign} {testData.ascendant?.degree}°</p>
            <p><strong>Planetas:</strong> {testData.planets?.length || 0}</p>
            <p><strong>Aspectos:</strong> {testData.aspects?.length || 0}</p>
            <p><strong>Fallback:</strong> {testData.fallback ? 'Sí' : 'No'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// 🔥 COMPONENTE PRINCIPAL COMPLETADO
// =============================================================================

const TestNatalChartPage: React.FC = () => {
  const [showDebugInfo, setShowDebugInfo] = useState(true);
  const [showWheel, setShowWheel] = useState(true);
  const [showChartDisplay, setShowChartDisplay] = useState(true);

  // Calcular aspectos
  const aspects = calculateAllAspects(REFERENCE_CHART_DATA.planets);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-white">
          🧪 Test Carta Natal - Ambiente de Desarrollo
        </h1>
        <p className="text-xl text-purple-200 max-w-3xl mx-auto">
          Página de testing para validar cálculos astrológicos y visualización de cartas natales.
          <br />
          <span className="text-yellow-300 font-semibold">
            Datos fijos: 10 Febrero 1974, 7:30 AM, Madrid
          </span>
        </p>
      </div>

      {/* Controles de visualización */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex gap-4">
          <label className="flex items-center gap-2 text-white cursor-pointer">
            <input
              type="checkbox"
              checked={showWheel}
              onChange={(e) => setShowWheel(e.target.checked)}
              className="rounded"
            />
            Mostrar Rueda
          </label>
          <label className="flex items-center gap-2 text-white cursor-pointer">
            <input
              type="checkbox"
              checked={showChartDisplay}
              onChange={(e) => setShowChartDisplay(e.target.checked)}
              className="rounded"
            />
            Mostrar ChartDisplay
          </label>
          <label className="flex items-center gap-2 text-white cursor-pointer">
            <input
              type="checkbox"
              checked={showDebugInfo}
              onChange={(e) => setShowDebugInfo(e.target.checked)}
              className="rounded"
            />
            Info Debug
          </label>
        </div>
      </div>

      {/* Test interactivo */}
      <NatalChartTest />

      {/* Rueda de la carta natal */}
      {showWheel && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            🎯 NatalChartWheel Component
          </h2>
          <div className="flex justify-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-300/30">
              <NatalChartWheel
                planets={REFERENCE_CHART_DATA.planets}
                houses={REFERENCE_CHART_DATA.houses}
                aspects={aspects}
                ascendant={REFERENCE_CHART_DATA.ascendant}
                midheaven={REFERENCE_CHART_DATA.midheaven}
                showAspects={true}
                showPlanetNames={true}
                showDegrees={true}
                width={700}
                height={700}
              />
            </div>
          </div>
        </div>
      )}

      {/* ChartDisplay completo */}
      {showChartDisplay && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            📊 ChartDisplay Component
          </h2>
          <ChartDisplay
            planets={REFERENCE_CHART_DATA.planets}
            houses={REFERENCE_CHART_DATA.houses}
            elementDistribution={{ fire: 30, earth: 20, air: 30, water: 20 }}
            modalityDistribution={{ cardinal: 40, fixed: 30, mutable: 30 }}
            keyAspects={aspects.map(a => ({
              planet1: a.planet1,
              planet2: a.planet2,
              type: a.type,
              orb: a.orb
            }))}
            ascendant={REFERENCE_CHART_DATA.ascendant}
            midheaven={REFERENCE_CHART_DATA.midheaven}
            showAspects={true}
            showDebugInfo={showDebugInfo}
          />
        </div>
      )}

      {/* Debug Info */}
      {showDebugInfo && (
        <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-6">
          <h3 className="font-semibold mb-4 text-yellow-300 text-xl">🔍 Información de Debug</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-white mb-2">📊 Estadísticas:</h4>
                <ul className="text-gray-300 space-y-1">
                  <li>• Planetas: {REFERENCE_CHART_DATA.planets.length}</li>
                  <li>• Casas: {REFERENCE_CHART_DATA.houses.length}</li>
                  <li>• Aspectos calculados: {aspects.length}</li>
                  <li>• Planetas retrógrados: {REFERENCE_CHART_DATA.planets.filter(p => p.isRetrograde).length}</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-white mb-2">🎯 Puntos Clave:</h4>
                <ul className="text-gray-300 space-y-1">
                  <li>• Ascendente: {REFERENCE_CHART_DATA.ascendant.sign} {REFERENCE_CHART_DATA.ascendant.degree}°</li>
                  <li>• Medio Cielo: {REFERENCE_CHART_DATA.midheaven.sign} {REFERENCE_CHART_DATA.midheaven.degree}°</li>
                  <li>• Sol: {REFERENCE_CHART_DATA.planets[0].sign} {REFERENCE_CHART_DATA.planets[0].degree}°</li>
                  <li>• Luna: {REFERENCE_CHART_DATA.planets[1].sign} {REFERENCE_CHART_DATA.planets[1].degree}°</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-2">🔗 Aspectos Principales:</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {aspects.slice(0, 8).map((aspect, i) => (
                  <div key={i} className="text-xs bg-black/20 rounded p-2 border border-white/10">
                    <span className="text-yellow-300">{aspect.planet1}</span>
                    <span className="text-gray-400 mx-2">{aspect.type}</span>
                    <span className="text-blue-300">{aspect.planet2}</span>
                    <span className="text-gray-500 ml-2">({aspect.orb.toFixed(1)}°)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Nota importante */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
            <p className="text-blue-200 text-sm">
              <strong>📝 Nota:</strong> Esta página usa datos fijos para testing. 
              Los datos reales del usuario se obtienen en <code>/natal-chart</code> desde la base de datos.
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-12 text-gray-400">
        <p>🧪 Página de testing - Solo para desarrollo y validación</p>
        <p className="text-sm mt-2">Los datos son ficticios y no representan una carta natal real</p>
      </div>
    </div>
  );
};

export default TestNatalChartPage;