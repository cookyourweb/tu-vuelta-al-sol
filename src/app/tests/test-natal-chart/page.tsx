// src/components/test/NatalChartTest.tsx - CON TEST DE ASCENDENTE
'use client';

import { useState } from 'react';

export default function NatalChartTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ NUEVO: Estados para test de ascendente
  const [ascendantTest, setAscendantTest] = useState<any>(null);
  const [ascendantLoading, setAscendantLoading] = useState(false);
  const [ascendantError, setAscendantError] = useState<string | null>(null);

  const testNatalChart = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Datos de Verónica para prueba principal
      const testData = {
        birthDate: '1974-02-10',
        birthTime: '07:30:00',
        latitude: 40.4164,
        longitude: -3.7025,
        timezone: 'Europe/Madrid'
      };

      console.log('Testing natal chart with data:', testData);
      
      const response = await fetch('/api/prokerala/natal-chart', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });

      const data = await response.json();
      setResult(data);
      
    } catch (err) {
      console.error('Error testing natal chart:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // ✅ NUEVO: Test específico para ascendente
  const testAscendantOnly = async () => {
    setAscendantLoading(true);
    setAscendantError(null);
    
    try {
      // Datos de Verónica con modo test
      const testData = {
        birthDate: '1974-02-10',
        birthTime: '07:30:00',
        latitude: 40.4164,
        longitude: -3.7025,
        timezone: 'Europe/Madrid',
        testMode: 'ascendant-only'  // ✅ ACTIVAR MODO TEST
      };

      console.log('🧪 Testing ascendant only with data:', testData);
      
      const response = await fetch('/api/prokerala/natal-chart', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });

      const data = await response.json();
      setAscendantTest(data);
      
      console.log('🧪 Ascendant test result:', data);
      
    } catch (err) {
      console.error('❌ Error testing ascendant:', err);
      setAscendantError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setAscendantLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      
      {/* ===== CARTA NATAL PRINCIPAL ===== */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-xl">🌟</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Carta Natal Completa</h2>
            <p className="text-gray-600 text-sm">Test completo de Verónica</p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold text-blue-800 mb-2 text-sm">🎯 Datos de Verónica:</h4>
          <ul className="text-blue-700 text-xs space-y-1">
            <li>• <strong>Fecha:</strong> 10 febrero 1974</li>
            <li>• <strong>Hora:</strong> 07:30 CET</li>
            <li>• <strong>Lugar:</strong> Madrid, España</li>
            <li>• <strong>Esperado:</strong> Ascendente en Acuario ♒</li>
          </ul>
        </div>

        <div className="mb-6">
          <button
            onClick={testNatalChart}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando carta natal...
              </span>
            ) : (
              '🌟 Generar Carta Natal Completa'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {result && (
          <div className={`border-2 rounded-lg p-4 ${
            result.success ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'
          }`}>
            <div className="flex items-center mb-2">
              <span className="mr-2">{result.success ? '✅' : '❌'}</span>
              <h3 className="font-bold text-sm">
                {result.success ? 'Carta Natal Generada' : 'Error en Carta Natal'}
              </h3>
            </div>
            {result.success && (
              <div className="mt-2 text-xs text-gray-600">
                <p><strong>Ascendente:</strong> {result.data?.ascendant?.sign || 'No detectado'}</p>
                <p><strong>Planetas:</strong> {result.data?.planets?.length || 0}</p>
                <p><strong>Fallback:</strong> {result.fallback ? 'Sí (API falló)' : 'No (API funcionó)'}</p>
              </div>
            )}
            <details className="mt-3">
              <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900 text-sm">
                Ver detalles completos
              </summary>
              <pre className="text-xs whitespace-pre-wrap text-gray-600 mt-2 overflow-auto max-h-64 bg-white p-3 rounded border">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>

      {/* ===== NUEVO: TEST DE ASCENDENTE ===== */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-xl">🧪</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Test de Ascendente</h2>
            <p className="text-gray-600 text-sm">Prueba múltiples endpoints para encontrar ascendente</p>
          </div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold text-orange-800 mb-2 text-sm">🔍 Qué hace este test:</h4>
          <ul className="text-orange-700 text-xs space-y-1">
            <li>• Prueba 3 endpoints: natal-chart, natal-aspect-chart, natal-planet-position</li>
            <li>• Busca ascendente en múltiples ubicaciones de cada respuesta</li>
            <li>• Muestra estructura completa de datos de cada endpoint</li>
            <li>• Identifica cuál endpoint tiene realmente el ascendente</li>
          </ul>
        </div>

        <div className="mb-6">
          <button
            onClick={testAscendantOnly}
            disabled={ascendantLoading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none"
          >
            {ascendantLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Probando endpoints...
              </span>
            ) : (
              '🧪 Test de Ascendente (Depuración)'
            )}
          </button>
        </div>

        {ascendantError && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span className="font-bold">Error:</span> {ascendantError}
          </div>
        )}

        {ascendantTest && (
          <div className={`border-2 rounded-lg p-4 ${
            ascendantTest.success ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'
          }`}>
            <div className="flex items-center mb-2">
              <span className="mr-2">{ascendantTest.success ? '✅' : '❌'}</span>
              <h3 className="font-bold text-sm">Test de Múltiples Endpoints</h3>
            </div>
            
            {ascendantTest.data?.summary && (
              <div className="mt-4">
                <h4 className="font-semibold text-sm mb-2">📊 Resumen de Endpoints:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  {ascendantTest.data.summary.map((item: any, index: number) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg text-xs ${
                        item.hasAscendant 
                          ? 'bg-green-100 border border-green-300' 
                          : 'bg-gray-100 border border-gray-300'
                      }`}
                    >
                      <div className="font-bold">{item.endpoint}</div>
                      <div>Funciona: {item.works ? '✅' : '❌'}</div>
                      <div>Ascendente: {item.hasAscendant ? '✅' : '❌'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <details className="mt-3">
              <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900 text-sm">
                Ver detalles técnicos completos
              </summary>
              <pre className="text-xs whitespace-pre-wrap text-gray-600 mt-2 overflow-auto max-h-96 bg-white p-3 rounded border">
                {JSON.stringify(ascendantTest, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>

      {/* ===== INFO ADICIONAL ===== */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">💡</span>
          Información del Test
        </h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Objetivo:</strong> Encontrar dónde Prokerala devuelve realmente el ascendente.</p>
          <p><strong>Problema actual:</strong> La carta natal devuelve datos pero el ascendente aparece como undefined.</p>
          <p><strong>Solución:</strong> El test de ascendente probará múltiples endpoints y estructuras de datos para identificar el formato correcto.</p>
        </div>
      </div>
    </div>
  );
}