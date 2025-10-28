// src/components/test/NatalChartTest.tsx - VERSIÓN SIMPLIFICADA SIN ERRORES
'use client';

import { useState } from 'react';

// (Removed duplicate implementation and export)

export default function NatalChartTest() {
  const [testData, setTestData] = useState<any>(null);
  const [progressedData, setProgressedData] = useState<any>(null);
  const [veronicaTestData, setVeronicaTestData] = useState<any>(null); // ✅ NUEVO: Test específico de Verónica
  const [loading, setLoading] = useState(false);
  const [progressedLoading, setProgressedLoading] = useState(false);
  const [veronicaLoading, setVeronicaLoading] = useState(false); // ✅ NUEVO
  const [error, setError] = useState<string | null>(null);
  const [progressedError, setProgressedError] = useState<string | null>(null);
  const [veronicaError, setVeronicaError] = useState<string | null>(null); // ✅ NUEVO

  // Test básico de Prokerala (función existente)
  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/prokerala/test');
      const data = await response.json();
      setTestData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNCIÓN CORREGIDA PARA CARTA PROGRESADA - CON DATOS DE NACIMIENTO
  const testProgressedChart = async () => {
    setProgressedLoading(true);
    setProgressedError(null);
    
    try {
      console.log('🔮 Iniciando test de carta progresada...');
      
      // ✅ PASO 1: Crear userId de prueba único
      const testUserId = 'test-user-progressed-' + Date.now();
      console.log('👤 Usuario de prueba:', testUserId);
      
      // ✅ PASO 2: PRIMERO crear datos de nacimiento
      console.log('📋 Creando datos de nacimiento...');
      
      const birthDataResponse = await fetch('/api/birth-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: testUserId,
          fullName: 'Usuario Test Progresada',
          birthDate: '1990-01-15',
          birthTime: '12:30:00',
          birthPlace: 'Madrid, España',
          latitude: 40.4168,
          longitude: -3.7038,
          timezone: 'Europe/Madrid'
        })
      });
      
      const birthDataResult = await birthDataResponse.json();
      
      if (!birthDataResult.success) {
        throw new Error(`Error creando datos de nacimiento: ${birthDataResult.error}`);
      }
      
      console.log('✅ Datos de nacimiento creados:', birthDataResult);
      
      // ✅ PASO 3: AHORA generar carta natal (requerida para carta progresada)
      console.log('🌟 Generando carta natal base...');
      
      const natalResponse = await fetch('/api/charts/natal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: testUserId
        })
      });
      
      const natalResult = await natalResponse.json();
      
      if (!natalResult.success) {
        console.warn('⚠️ Carta natal no generada, pero continuando:', natalResult);
        // No lanzar error, continuar con progresada
      } else {
        console.log('✅ Carta natal generada:', natalResult);
      }
      
      // ✅ PASO 4: FINALMENTE generar carta progresada
      console.log('🔮 Generando carta progresada...');
      
      const progressedResponse = await fetch('/api/charts/solar-return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: testUserId,
          regenerate: true
        })
      });
      
      const progressedResult = await progressedResponse.json();
      setProgressedData(progressedResult);
      
      if (progressedResult.success) {
        console.log('✅ Carta progresada obtenida exitosamente:', progressedResult);
      } else {
        console.error('❌ Error en carta progresada:', progressedResult.error);
        setProgressedError(progressedResult.error || progressedResult.message || 'Error desconocido en API');
      }
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setProgressedError(errorMsg);
      console.error('❌ Error en proceso completo:', errorMsg);
    } finally {
      setProgressedLoading(false);
    }
  };

  // ✅ NUEVA FUNCIÓN: Probar endpoint corregido directamente con datos de Verónica
  const testVeronicaNatalChart = async () => {
    setVeronicaLoading(true);
    setVeronicaError(null);
    
    try {
      console.log('🎯 === PROBANDO ENDPOINT CORREGIDO CON VERÓNICA ===');
      
      // Llamar directamente al endpoint corregido
      const response = await fetch('/api/prokerala/natal-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          birthDate: '1974-02-10',   // ✅ Datos reales de Verónica
          birthTime: '07:30:00',
          latitude: 40.4164,
          longitude: -3.7025,
          timezone: 'Europe/Madrid'
        })
      });
      
      const data = await response.json();
      setVeronicaTestData(data);
      
      console.log('📊 Respuesta completa:', data);
      console.log('🔺 Ascendente obtenido:', data.data?.ascendant?.sign);
      console.log('🎉 ¿Es Acuario?', data.data?.ascendant?.sign === 'Acuario' ? 'SÍ ✅' : 'NO ❌');
      console.log('📊 Fallback usado:', data.fallback ? 'SÍ (datos simulados)' : 'NO (API real)');
      
      if (data.success) {
        console.log('✅ Endpoint corregido funcionando');
      } else {
        console.error('❌ Error en endpoint corregido:', data.error);
        setVeronicaError(data.error || 'Error desconocido');
      }
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setVeronicaError(errorMsg);
      console.error('❌ Error probando endpoint corregido:', errorMsg);
    } finally {
      setVeronicaLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* ===== CARTA NATAL BÁSICA ===== */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-xl">🔗</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Carta Natal Básica</h2>
              <p className="text-gray-600 text-sm">Test de conexión</p>
            </div>
          </div>
          
          <div className="mb-6">
            <button
              onClick={testConnection}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
            >
              {loading ? 'Probando...' : 'Probar Conexión'}
            </button>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-200 border-t-indigo-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-4">
              <div className="flex">
                <span className="text-red-400 mr-2">❌</span>
                <div>
                  <h3 className="font-bold text-red-800 text-xs">Error</h3>
                  <p className="text-red-700 text-xs">{error}</p>
                </div>
              </div>
            </div>
          )}

          {testData && (
            <div className="space-y-3">
              <div className={`p-3 rounded-lg border-l-4 ${
                testData.success 
                  ? 'bg-green-50 border-green-400' 
                  : 'bg-red-50 border-red-400'
              }`}>
                <div className="flex items-center">
                  <span className="mr-2">{testData.success ? '✅' : '❌'}</span>
                  <h3 className="font-bold text-xs">
                    {testData.success ? 'Conexión OK' : 'Error'}
                  </h3>
                </div>
                {testData.success && testData.credits && (
                  <p className="text-xs text-gray-600 mt-1">Créditos: {testData.credits}</p>
                )}
              </div>

              <details className="bg-gray-50 rounded-lg p-3">
                <summary className="cursor-pointer font-semibold text-gray-700 text-xs">
                  Ver detalles
                </summary>
                <pre className="text-xs text-gray-600 mt-2 max-h-32 overflow-auto">
                  {JSON.stringify(testData, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>

        {/* ===== TEST VERÓNICA (NUEVO) ===== */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-yellow-100">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-xl">🎯</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Test Verónica</h2>
              <p className="text-gray-600 text-sm">Endpoint corregido</p>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-lg mb-4">
            <h4 className="font-semibold text-yellow-800 mb-1 text-xs">🔍 Datos test:</h4>
            <ul className="text-yellow-700 text-xs space-y-1">
              <li>• **Fecha:** 10/02/1974</li>
              <li>• **Hora:** 07:30 Madrid</li>
              <li>• **Esperado:** ASC Acuario</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <button
              onClick={testVeronicaNatalChart}
              disabled={veronicaLoading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-300 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
            >
              {veronicaLoading ? 'Probando...' : 'Probar Endpoint Corregido'}
            </button>
          </div>

          {veronicaLoading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-200 border-t-yellow-600"></div>
            </div>
          )}

          {veronicaError && (
            <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-4">
              <div className="flex">
                <span className="text-red-400 mr-2">❌</span>
                <div>
                  <h3 className="font-bold text-red-800 text-xs">Error</h3>
                  <p className="text-red-700 text-xs">{veronicaError}</p>
                </div>
              </div>
            </div>
          )}

          {veronicaTestData && (
            <div className="space-y-3">
              <div className={`p-3 rounded-lg border-l-4 ${
                veronicaTestData.data?.ascendant?.sign === 'Acuario'
                  ? 'bg-green-50 border-green-400' 
                  : 'bg-red-50 border-red-400'
              }`}>
                <div className="flex items-center">
                  <span className="mr-2">{veronicaTestData.data?.ascendant?.sign === 'Acuario' ? '✅' : '❌'}</span>
                  <h3 className="font-bold text-xs">
                    ASC: {veronicaTestData.data?.ascendant?.sign || 'undefined'}
                  </h3>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {veronicaTestData.fallback ? '⚠️ Datos simulados' : '✅ API real'}
                </p>
              </div>

              <details className="bg-gray-50 rounded-lg p-3">
                <summary className="cursor-pointer font-semibold text-gray-700 text-xs">
                  Ver respuesta completa
                </summary>
                <pre className="text-xs text-gray-600 mt-2 max-h-32 overflow-auto">
                  {JSON.stringify(veronicaTestData, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>

        {/* ===== CARTA PROGRESADA ===== */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-xl">🔮</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Carta Progresada</h2>
              <p className="text-gray-600 text-sm">Progresiones secundarias</p>
            </div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg mb-4">
            <h4 className="font-semibold text-purple-800 mb-1 text-xs">📊 Proceso:</h4>
            <ul className="text-purple-700 text-xs space-y-1">
              <li>• **Fecha:** 15 enero 1990</li>
              <li>• **Proceso:** Datos → Natal → Progresada</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <button
              onClick={testProgressedChart}
              disabled={progressedLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
            >
              {progressedLoading ? 'Generando...' : 'Probar Progresada'}
            </button>
          </div>

          {progressedLoading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-200 border-t-purple-600"></div>
              <p className="mt-2 text-gray-600 text-xs">Proceso completo...</p>
            </div>
          )}

          {progressedError && (
            <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-4">
              <div className="flex">
                <span className="text-red-400 mr-2">❌</span>
                <div>
                  <h3 className="font-bold text-red-800 text-xs">Error</h3>
                  <p className="text-red-700 text-xs">{progressedError}</p>
                </div>
              </div>
            </div>
          )}

          {progressedData && (
            <div className="space-y-3">
              <div className={`p-3 rounded-lg border-l-4 ${
                progressedData.success 
                  ? 'bg-green-50 border-green-400' 
                  : 'bg-red-50 border-red-400'
              }`}>
                <div className="flex items-center">
                  <span className="mr-2">{progressedData.success ? '✅' : '❌'}</span>
                  <h3 className="font-bold text-xs">
                    {progressedData.success ? 'Progresada OK' : 'Error'}
                  </h3>
                </div>
                {progressedData.success && progressedData.data && (
                  <div className="mt-1 text-xs text-gray-600">
                    <p>Año: {progressedData.data.progression?.current?.year || 'N/A'}</p>
                  </div>
                )}
              </div>

              <details className="bg-gray-50 rounded-lg p-3">
                <summary className="cursor-pointer font-semibold text-gray-700 text-xs">
                  Ver datos
                </summary>
                <pre className="text-xs text-gray-600 mt-2 max-h-32 overflow-auto">
                  {JSON.stringify(progressedData, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>

      {/* ===== INFORMACIÓN TÉCNICA ===== */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Información Técnica</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">🔗**Carta Natal Básica**</h4>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• **Endpoint:** /api/prokerala/test</li>
              <li>• **Método:** GET</li>
              <li>• **Verifica:** Autenticación con Prokerala</li>
              <li>• **Variables:** CLIENT_ID, CLIENT_SECRET</li>
              <li>• **Datos:** Madrid, 15 enero 1990</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">🔮**Carta Progresada**</h4>
            <ul className="text-gray-600 text-sm space-y-1">
            <li>• **Endpoint:** /api/charts/solar-return</li>
              <li>• **Método:** POST</li>
              <li>• **Calcula:** Progresiones secundarias</li>
              <li>• **Años:** Actual + Siguiente automático</li>
              <li>• **Servicio:** getProgressedChart</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}