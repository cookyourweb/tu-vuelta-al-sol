'use client';

import React, { useState } from 'react';
import { 
  formatProkeralaDateTime, 
  runAllTimezoneTests, 
  testVeronicaDateTime,
  CRITICAL_TEST_CASES,
  ProkeralaUtils
} from '@/utils/dateTimeUtils';

const SimpleTimezoneTest = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [apiTestResult, setApiTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Ejecutar pruebas básicas
  const runBasicTests = () => {
    console.log('🧪 === EJECUTANDO PRUEBAS BÁSICAS ===');
    
    const results = {
      timestamp: new Date().toISOString(),
      veronicaTest: '',
      allTestsPass: false,
      tests: {} as any
    };

    // Prueba de Verónica
    try {
      results.veronicaTest = testVeronicaDateTime();
      console.log('✅ Prueba Verónica completada');
    } catch (error) {
      console.error('❌ Error en prueba Verónica:', error);
      results.veronicaTest = 'ERROR';
    }

    // Ejecutar todas las pruebas
    try {
      results.allTestsPass = runAllTimezoneTests();
      console.log('✅ Todas las pruebas completadas');
    } catch (error) {
      console.error('❌ Error en pruebas:', error);
      results.allTestsPass = false;
    }

    // Pruebas individuales
    try {
      Object.entries(CRITICAL_TEST_CASES).forEach(([testName, testCase]) => {
        const result = formatProkeralaDateTime(
          testCase.input.birthDate,
          testCase.input.birthTime,
          testCase.input.timezone
        );
        
        results.tests[testName] = {
          input: testCase.input,
          expected: testCase.expected,
          actual: result,
          passed: result === testCase.expected
        };
      });
    } catch (error) {
      console.error('❌ Error en pruebas individuales:', error);
    }

    setTestResults(results);
  };

  // Probar API completa
  const testAPI = async () => {
    setLoading(true);
    try {
      console.log('🔥 === PROBANDO API COMPLETA ===');
      
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
      
      const ascendant = data.data?.ascendant;
      const isCorrect = ascendant?.sign === 'Acuario';
      
      setApiTestResult({
        success: data.success,
        ascendant: ascendant,
        isCorrect: isCorrect,
        debug: data.debug,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Error en API:', error);
      setApiTestResult({
        error: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          🧪 Prueba de Corrección de Timezone
        </h1>
        <p className="text-gray-600">
          Verificar que Verónica tenga <strong>Ascendente Acuario</strong>
        </p>
      </div>

      {/* Botones */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={runBasicTests}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🕐 Probar Timezone
        </button>
        
        <button
          onClick={testAPI}
          disabled={loading}
          className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? '⏳ Probando...' : '🔮 Probar API'}
        </button>
      </div>

      {/* Resultados de timezone */}
      {testResults && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">
            🧪 Resultados de Timezone
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span>Prueba Verónica:</span>
              <code className={`px-2 py-1 rounded text-sm ${
                testResults.veronicaTest === '1974-02-10T07:30:00+01:00' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {testResults.veronicaTest}
              </code>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span>Todas las pruebas:</span>
              <span className={`px-2 py-1 rounded text-sm font-bold ${
                testResults.allTestsPass 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {testResults.allTestsPass ? '✅ PASS' : '❌ FAIL'}
              </span>
            </div>

            {/* Tests individuales */}
            {Object.entries(testResults.tests).map(([testName, test]: [string, any]) => (
              <div key={testName} className="border rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold capitalize">{testName}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    test.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {test.passed ? '✅' : '❌'}
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <div><strong>Input:</strong> {test.input.birthDate} {test.input.birthTime} {test.input.timezone}</div>
                  <div><strong>Expected:</strong> <code>{test.expected}</code></div>
                  <div><strong>Actual:</strong> <code className={test.passed ? 'text-green-600' : 'text-red-600'}>{test.actual}</code></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resultados de API */}
      {apiTestResult && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">
            🔮 Resultado de API (Verónica)
          </h2>
          
          {apiTestResult.error ? (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <p className="text-red-800"><strong>Error:</strong> {apiTestResult.error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Ascendente obtenido:</span>
                <span className={`font-bold ${
                  apiTestResult.isCorrect ? 'text-green-600' : 'text-red-600'
                }`}>
                  {apiTestResult.ascendant ? 
                    `${apiTestResult.ascendant.sign} ${apiTestResult.ascendant.degree}°${apiTestResult.ascendant.minutes}'` : 
                    'No encontrado'
                  }
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Esperado:</span>
                <span className="font-bold text-green-600">Acuario ~4°09'</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Resultado:</span>
                <span className={`px-3 py-1 rounded font-bold ${
                  apiTestResult.isCorrect 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {apiTestResult.isCorrect ? '✅ CORRECTO' : '❌ INCORRECTO'}
                </span>
              </div>

              {apiTestResult.debug && (
                <div className="mt-4 p-3 bg-gray-100 rounded">
                  <h4 className="font-semibold mb-2">Debug Info:</h4>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(apiTestResult.debug, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default SimpleTimezoneTest;
