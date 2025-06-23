// src/components/test/TimezoneTestComponent.tsx - VERIFICAR CORRECCIÓN
'use client';

import React, { useState } from 'react';

// ✅ IMPORTACIONES CORREGIDAS - Manejar posibles exports que no existan
import {
  formatProkeralaDateTime,
  runAllTimezoneTests,
  testVeronicaDateTime,
  CRITICAL_TEST_CASES,
  ProkeralaUtils,
} from '@/utils/dateTimeUtils';

const TimezoneTestComponent: React.FC = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [apiTestResult, setApiTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Ejecutar pruebas de timezone
  const runTimezoneTests = () => {
    console.log('🧪 === EJECUTANDO PRUEBAS DE TIMEZONE ===');
    
    const results = {
      timestamp: new Date().toISOString(),
      tests: {} as any,
      summary: {
        total: 0,
        passed: 0,
        failed: 0
      }
    };

    // Prueba específica de Verónica
    const veronicaResult = testVeronicaDateTime();
    results.tests.veronica = {
      input: '10 febrero 1974, 07:30, Madrid',
      expected: '1974-02-10T07:30:00+01:00',
      actual: veronicaResult,
      passed: veronicaResult === '1974-02-10T07:30:00+01:00'
    };

    // Ejecutar todos los casos de prueba
    for (const [testName, testCase] of Object.entries(CRITICAL_TEST_CASES)) {
      // Type assertion to avoid "unknown" error
      const tc = testCase as {
        input: { birthDate: string; birthTime: string; timezone: string };
        expected: string;
        notes?: string;
      };

      const result = formatProkeralaDateTime(
        tc.input.birthDate,
        tc.input.birthTime,
        tc.input.timezone
      );
      
      const passed = result === tc.expected;
      
      results.tests[testName] = {
        input: tc.input,
        expected: tc.expected,
        actual: result,
        passed,
        notes: tc.notes
      };
      
      results.summary.total++;
      if (passed) {
        results.summary.passed++;
      } else {
        results.summary.failed++;
      }
    }

    // Prueba de ProkeralaUtils
    const utilsTest = ProkeralaUtils.testVeronica();
    results.tests.prokeralaUtils = {
      description: 'ProkeralaUtils.testVeronica()',
      passed: utilsTest,
      result: utilsTest ? 'PASS' : 'FAIL'
    };

    results.summary.total++;
    if (utilsTest) {
      results.summary.passed++;
    } else {
      results.summary.failed++;
    }

    setTestResults(results);
    
    console.log('🏆 === RESULTADOS FINALES ===');
    console.log(`✅ Pasaron: ${results.summary.passed}/${results.summary.total}`);
    console.log(`❌ Fallaron: ${results.summary.failed}/${results.summary.total}`);
    
    return results.summary.failed === 0;
  };

  // Probar API completa con Verónica
  const testVeronicaAPI = async () => {
    setLoading(true);
    try {
      console.log('🔥 === PROBANDO API COMPLETA CON VERÓNICA ===');
      
      const response = await fetch('/api/prokerala/natal-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthDate: '1974-02-10',
          birthTime: '07:30:00',
          latitude: 40.4164,
          longitude: -3.7025,
          timezone: 'Europe/Madrid'
        }),
      });

      const data = await response.json();
      
      console.log('📊 Respuesta API:', data);
      
      // Analizar el ascendente
      const ascendant = data.data?.ascendant;
      const isCorrect = ascendant?.sign === 'Acuario';
      
      setApiTestResult({
        success: data.success,
        ascendant: ascendant,
        expectedAscendant: 'Acuario ~4°',
        isCorrect: isCorrect,
        debug: data.debug,
        timestamp: new Date().toISOString()
      });
      
      console.log(isCorrect ? '✅ ¡ÉXITO! Ascendente correcto' : '❌ ERROR: Ascendente incorrecto');
      
    } catch (error) {
      console.error('❌ Error en prueba API:', error);
      setApiTestResult({
        error: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🧪 Pruebas de Corrección de Timezone
        </h1>
        <p className="text-gray-600">
          Verificación de que el ascendente de Verónica sea <strong>Acuario</strong> y no Aries
        </p>
      </div>

      {/* Botones de prueba */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={runTimezoneTests}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          🕐 Probar Timezone Utils
        </button>
        
        <button
          onClick={testVeronicaAPI}
          disabled={loading}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold disabled:opacity-50"
        >
          {loading ? '⏳ Probando...' : '🔮 Probar API Completa'}
        </button>
      </div>

      {/* Resultados de timezone tests */}
      {testResults && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            🧪 Resultados de Timezone Tests
            <span className={`ml-4 px-3 py-1 rounded-full text-sm ${
              testResults.summary.failed === 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {testResults.summary.passed}/{testResults.summary.total} PASS
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(testResults.tests).map(([testName, test]: [string, any]) => (
              <div 
                key={testName}
                className={`p-4 rounded-lg border-2 ${
                  test.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold capitalize">{testName}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    test.passed ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {test.passed ? '✅ PASS' : '❌ FAIL'}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  {test.input && typeof test.input === 'object' ? (
                    <div>
                      <strong>Input:</strong> {test.input.birthDate} {test.input.birthTime} {test.input.timezone}
                    </div>
                  ) : test.input && (
                    <div><strong>Input:</strong> {test.input}</div>
                  )}
                  
                  {test.expected && (
                    <div><strong>Esperado:</strong> <code className="bg-gray-100 px-1 rounded">{test.expected}</code></div>
                  )}
                  
                  {test.actual && (
                    <div><strong>Actual:</strong> <code className={`px-1 rounded ${
                      test.passed ? 'bg-green-100' : 'bg-red-100'
                    }`}>{test.actual}</code></div>
                  )}
                  
                  {test.notes && (
                    <div className="text-gray-600"><strong>Notas:</strong> {test.notes}</div>
                  )}
                  
                  {test.description && (
                    <div><strong>Descripción:</strong> {test.description}</div>
                  )}
                  
                  {test.result && (
                    <div><strong>Resultado:</strong> {test.result}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resultados de API test */}
      {apiTestResult && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            🔮 Resultado de API Test (Verónica)
            <span className={`ml-4 px-3 py-1 rounded-full text-sm ${
              apiTestResult.isCorrect 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {apiTestResult.isCorrect ? '✅ CORRECTO' : '❌ INCORRECTO'}
            </span>
          </h2>
          
          {apiTestResult.error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800"><strong>Error:</strong> {apiTestResult.error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Ascendente Obtenido:</h3>
                {apiTestResult.ascendant ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-lg">{apiTestResult.ascendant.sign}</span>
                      <span className="text-gray-600">
                        {apiTestResult.ascendant.degree}°{apiTestResult.ascendant.minutes}'
                      </span>
                    </div>
                    {apiTestResult.ascendant.longitude && (
                      <div className="text-sm text-gray-500">
                        Longitud: {apiTestResult.ascendant.longitude.toFixed(2)}°
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-red-600">No se encontró ascendente en la respuesta</p>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Esperado:</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-lg text-green-600">Acuario</span>
                    <span className="text-gray-600">~4°09'</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Longitud: ~304.15°
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Debug info */}
          {apiTestResult.debug && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="font-semibold mb-2">🔍 Debug Info:</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(apiTestResult.debug, null, 2)}
                </pre>
              </div>
            </div>
          )}
          
          <div className="mt-4 text-xs text-gray-500">
            Timestamp: {apiTestResult.timestamp}
          </div>
        </div>
      )}

      {/* Información explicativa */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-blue-800">
          📚 ¿Por qué es importante el timezone correcto?
        </h2>
        
        <div className="space-y-4 text-blue-700">
          <div>
            <h3 className="font-semibold">El Problema:</h3>
            <p className="text-sm">
              Verónica nació el 10 de febrero de 1974 a las 07:30 en Madrid. 
              En esa fecha, Madrid estaba en horario de invierno (CET = UTC+1).
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold">La Diferencia:</h3>
            <ul className="text-sm space-y-1 ml-4">
              <li>• <strong>Correcto:</strong> 1974-02-10T07:30:00<span className="text-green-600 font-bold">+01:00</span> → ASC: Acuario ✅</li>
              <li>• <strong>Incorrecto:</strong> 1974-02-10T07:30:00<span className="text-red-600 font-bold">+00:00</span> → ASC: Aries ❌</li>
              <li>• <strong>Incorrecto:</strong> 1974-02-10T07:30:00<span className="text-red-600 font-bold">+02:00</span> → ASC: Piscis ❌</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold">Por qué ocurre:</h3>
            <p className="text-sm">
              Una diferencia de 1-2 horas en el timezone puede cambiar completamente el ascendente, 
              ya que la Tierra rota 15° por hora (360° ÷ 24h = 15°/h). El ascendente es muy sensible al tiempo exacto.
            </p>
          </div>
        </div>
      </div>

      {/* Manual test */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">🧪 Prueba Manual Rápida</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Datos de Verónica:</h3>
            <div className="bg-white rounded p-3 text-sm font-mono">
              <div>📅 Fecha: 1974-02-10</div>
              <div>🕐 Hora: 07:30:00</div>
              <div>📍 Lugar: Madrid (40.4164, -3.7025)</div>
              <div>🌍 Timezone: Europe/Madrid</div>
              <div>❄️ Estación: Invierno (CET = +01:00)</div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">URL que debe generar:</h3>
            <div className="bg-white rounded p-3 text-xs break-all">
              <code>
                https://api.prokerala.com/v2/astrology/natal-chart?profile[datetime]=<span className="text-green-600 font-bold">1974-02-10T07:30:00+01:00</span>&profile[coordinates]=40.4164,-3.7025&birth_time_unknown=false&house_system=placidus&orb=default&birth_time_rectification=flat-chart&aspect_filter=all&la=es&ayanamsa=0
              </code>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Resultado esperado:</h3>
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <div className="text-green-800">
                ✅ <strong>Ascendente:</strong> Acuario 4°09'<br/>
                ✅ <strong>Sol:</strong> Acuario 21°08'<br/>
                ✅ <strong>Luna:</strong> Libra 6°03'<br/>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instrucciones siguientes pasos */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-yellow-800">
          🔧 Siguientes Pasos
        </h2>
        
        <div className="space-y-3 text-yellow-700">
          <div>
            <strong>1. Ejecutar pruebas:</strong> Haz clic en los botones de arriba para verificar que el timezone se calcula correctamente.
          </div>
          
          <div>
            <strong>2. Verificar API:</strong> La prueba de API completa debe devolver ASC: Acuario (no Aries).
          </div>
          
          <div>
            <strong>3. Si las pruebas pasan:</strong> El problema del ascendente estará resuelto. 
            Podrás proceder a integrar este código corregido en tu aplicación.
          </div>
          
          <div>
            <strong>4. Si las pruebas fallan:</strong> Revisar que las nuevas funciones de 
            <code className="bg-white px-1 rounded">dateTimeUtils.ts</code> se estén importando correctamente.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimezoneTestComponent;