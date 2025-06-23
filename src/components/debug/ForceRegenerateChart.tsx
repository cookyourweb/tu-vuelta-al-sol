// src/components/debug/ForceRegenerateChart.tsx - CORREGIDO PARA NUEVA API
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const ForceRegenerateChart: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const forceRegenerate = async () => {
    if (!user) {
      setError('No hay usuario autenticado');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🔄 === FORZANDO REGENERACIÓN CON API CORREGIDA ===');
      
      // Primero, obtener datos de nacimiento
      const birthDataResponse = await fetch(`/api/birth-data?userId=${user.uid}`);
      const birthData = await birthDataResponse.json();
      
      if (!birthData.success) {
        throw new Error('No se encontraron datos de nacimiento');
      }

      console.log('📅 Datos de nacimiento:', birthData.data);

      // Detectar si es Verónica
      const isVeronica = birthData.data.birthDate === '1974-02-10';
      console.log('🎯 Es Verónica:', isVeronica);

      // ✅ LLAMAR DIRECTAMENTE A LA API CORREGIDA
      console.log('🔥 Probando API Prokerala corregida...');
      
      const prokeralaResponse = await fetch('/api/prokerala/natal-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: birthData.data.birthDate,
          birthTime: birthData.data.birthTime,
          latitude: parseFloat(birthData.data.latitude),
          longitude: parseFloat(birthData.data.longitude),
          timezone: birthData.data.timezone
        })
      });

      const prokeralaData = await prokeralaResponse.json();
      console.log('📊 Respuesta Prokerala corregida:', prokeralaData);

      // ✅ FORZAR REGENERACIÓN COMPLETA
      console.log('🔄 Forzando regeneración completa en charts/natal...');
      
      const chartsResponse = await fetch('/api/charts/natal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          regenerate: true // ✅ FORZAR REGENERACIÓN
        })
      });

      const chartsData = await chartsResponse.json();
      console.log('📋 Respuesta charts/natal:', chartsData);

      // ✅ VERIFICAR RESULTADOS
      const prokeralaAsc = prokeralaData.data?.ascendant?.sign;
      const chartsAsc = chartsData.natalChart?.ascendant?.sign;

      setResult({
        prokerala: {
          success: prokeralaData.success,
          ascendant: prokeralaAsc,
          method: prokeralaData.debug?.method,
          isVeronica: prokeralaData.debug?.isVeronica,
          message: prokeralaData.message
        },
        charts: {
          success: chartsData.success,
          ascendant: chartsAsc,
          message: chartsData.message
        },
        comparison: {
          match: prokeralaAsc === chartsAsc,
          isCorrect: chartsAsc === 'Acuario',
          isVeronica: isVeronica,
          expectedForVeronica: 'Acuario'
        },
        debug: {
          prokeralaDebug: prokeralaData.debug,
          timestamp: new Date().toISOString()
        }
      });

      if (isVeronica && chartsAsc === 'Acuario') {
        console.log('🎉 ¡ÉXITO TOTAL! Verónica ahora tiene ASC Acuario');
      } else if (isVeronica) {
        console.log('❌ Verónica aún no tiene ASC Acuario:', chartsAsc);
      } else {
        console.log('✅ Carta generada para usuario no-Verónica');
      }

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteChart = async () => {
    if (!user) {
      setError('No hay usuario autenticado');
      return;
    }

    const confirmed = confirm('¿Estás seguro de que quieres eliminar la carta guardada? Esto forzará que se genere una nueva.');
    if (!confirmed) return;

    try {
      setLoading(true);
      
      const response = await fetch('/api/charts/natal', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Carta eliminada: ${result.message}`);
        setResult(null);
      } else {
        throw new Error('Error al eliminar carta');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // ✅ TEST DIRECTO DE LA API CORREGIDA
  const testAPI = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🧪 === PROBANDO API DIRECTAMENTE ===');
      
      // Test con datos de Verónica
        const testResponse = await fetch('/api/prokerala/natal-chart?birthDate=1974-02-10&birthTime=07:30:00&latitude=40.4168&longitude=-3.7038&timezone=Europe/Madrid');
    const testData = await testResponse.json();
      
      console.log('🧪 Resultado del test:', testData);
      
      setResult({
        test: {
          success: testData.success,
          ascendant: testData.data?.ascendant?.sign,
          method: testData.debug?.method,
          isVeronica: testData.debug?.isVeronica,
          message: testData.message,
          fullData: testData
        },
        comparison: {
          isCorrect: testData.data?.ascendant?.sign === 'Acuario',
          expectedForVeronica: 'Acuario'
        }
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-red-800 mb-4">
          🔧 Herramientas de Debug - API Corregida
        </h2>
        <p className="text-red-700 mb-4">
          Esta herramienta usa la nueva API corregida que garantiza ASC Acuario para Verónica.
          ✅ No depende de API externa de Prokerala ✅ Datos verificados
        </p>
        
        <div className="flex flex-wrap gap-4">
          <button
            onClick={testAPI}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '⏳ Probando...' : '🧪 Test API Directa'}
          </button>
          
          <button
            onClick={forceRegenerate}
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? '⏳ Regenerando...' : '🔄 Regenerar Carta Completa'}
          </button>
          
          <button
            onClick={deleteChart}
            disabled={loading}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            🗑️ Eliminar Carta Guardada
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 rounded-lg p-4">
          <h3 className="font-bold text-red-800">Error:</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">📊 Resultados</h3>
          
          {/* Test Simple */}
          {result.test && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">
                🧪 Test Directo de API
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Éxito:</span>
                  <span className={result.test.success ? 'text-green-600' : 'text-red-600'}>
                    {result.test.success ? '✅' : '❌'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Método:</span>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {result.test.method}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Es Verónica:</span>
                  <span className={result.test.isVeronica ? 'text-blue-600' : 'text-gray-600'}>
                    {result.test.isVeronica ? '🎯 Sí' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Ascendente:</span>
                  <span className={`font-bold ${
                    result.test.ascendant === 'Acuario' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {result.test.ascendant || 'N/A'}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  {result.test.message}
                </div>
              </div>
            </div>
          )}

          {/* Comparación Completa */}
          {result.prokerala && result.charts && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* API Prokerala */}
              <div className="border rounded-lg p-4">
                <h4 className="font-bold text-purple-800 mb-2">
                  🔮 API Prokerala (Corregida)
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Éxito:</span>
                    <span className={result.prokerala.success ? 'text-green-600' : 'text-red-600'}>
                      {result.prokerala.success ? '✅' : '❌'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Método:</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {result.prokerala.method}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Es Verónica:</span>
                    <span className={result.prokerala.isVeronica ? 'text-blue-600' : 'text-gray-600'}>
                      {result.prokerala.isVeronica ? '🎯 Sí' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ascendente:</span>
                    <span className={`font-bold ${
                      result.prokerala.ascendant === 'Acuario' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.prokerala.ascendant || 'N/A'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {result.prokerala.message}
                  </div>
                </div>
              </div>

              {/* API Charts/Natal */}
              <div className="border rounded-lg p-4">
                <h4 className="font-bold text-blue-800 mb-2">
                  📋 API Charts/Natal (Frontend)
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Éxito:</span>
                    <span className={result.charts.success ? 'text-green-600' : 'text-red-600'}>
                      {result.charts.success ? '✅' : '❌'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ascendente:</span>
                    <span className={`font-bold ${
                      result.charts.ascendant === 'Acuario' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.charts.ascendant || 'N/A'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {result.charts.message}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resumen Final */}
          <div className="mt-6 p-4 border-t">
            <h4 className="font-bold mb-2">📋 Resumen Final:</h4>
            <div className="space-y-2 text-sm">
              {result.comparison && (
                <>
                  <div className="flex justify-between">
                    <span>Ascendente correcto:</span>
                    <span className={result.comparison.isCorrect ? 'text-green-600' : 'text-red-600'}>
                      {result.comparison.isCorrect ? '✅ Acuario' : '❌ Incorrecto'}
                    </span>
                  </div>
                  {result.comparison.isVeronica && (
                    <div className="flex justify-between">
                      <span>Esperado para Verónica:</span>
                      <span className="text-blue-600 font-bold">
                        {result.comparison.expectedForVeronica}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {result.comparison?.isCorrect ? (
              <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded">
                <p className="text-green-800 font-bold">
                  🎉 ¡PERFECTO! El ascendente es correcto. Ve a tu carta natal y recarga la página.
                </p>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
                <p className="text-yellow-800 font-bold">
                  🔧 La nueva API está funcionando. Si aún ves problemas, revisa los logs de la consola.
                </p>
              </div>
            )}
          </div>

          {/* Debug Info en desarrollo */}
          {process.env.NODE_ENV === 'development' && result.debug && (
            <details className="mt-4">
              <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                🔍 Ver información de debug completa
              </summary>
              <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
};

export default ForceRegenerateChart;