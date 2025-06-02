// src/components/test/NatalChartTest.tsx
'use client';

import { useState } from 'react';

export default function NatalChartTest() {
  const [testData, setTestData] = useState<any>(null);
  const [progressedData, setProgressedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [progressedLoading, setProgressedLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressedError, setProgressedError] = useState<string | null>(null);

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

  // ✅ NUEVA FUNCIÓN PARA CARTA PROGRESADA
  const testProgressedChart = async () => {
    setProgressedLoading(true);
    setProgressedError(null);
    
    try {
      console.log('🔮 Iniciando test de carta progresada...');
      
      const response = await fetch('/api/charts/progressed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          birthDate: "1990-01-15",
          birthTime: "12:30:00", 
          latitude: 40.4168,
          longitude: -3.7038,
          timezone: "Europe/Madrid"
        })
      });
      
      const data = await response.json();
      setProgressedData(data);
      
      if (data.success) {
        console.log('✅ Carta progresada obtenida exitosamente:', data);
      } else {
        console.error('❌ Error en carta progresada:', data.error);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setProgressedError(errorMsg);
      console.error('❌ Error de conexión:', errorMsg);
    } finally {
      setProgressedLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* ===== CARTA NATAL BÁSICA ===== */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-xl">🔗</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Carta Natal Básica</h2>
              <p className="text-gray-600 text-sm">Test de conexión y carta natal</p>
            </div>
          </div>
          
          <div className="mb-6">
            <button
              onClick={testConnection}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {loading ? 'Probando Conexión...' : 'Probar Carta Natal'}
            </button>
          </div>

          {loading && (
            <div className="text-center py-6">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600"></div>
              <p className="mt-3 text-gray-600 text-sm">Conectando con Prokerala...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <div className="flex">
                <span className="text-red-400 mr-2">❌</span>
                <div>
                  <h3 className="font-bold text-red-800 text-sm">Error de Conexión</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {testData && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border-l-4 ${
                testData.success 
                  ? 'bg-green-50 border-green-400' 
                  : 'bg-red-50 border-red-400'
              }`}>
                <div className="flex items-center">
                  <span className="mr-2">{testData.success ? '✅' : '❌'}</span>
                  <h3 className="font-bold text-sm">
                    {testData.success ? 'Conexión Exitosa' : 'Error de Conexión'}
                  </h3>
                </div>
                {testData.success && (
                  <div className="mt-2 text-xs text-gray-600">
                    <p>La API de Prokerala está funcionando correctamente.</p>
                    {testData.credits && (
                      <p className="font-medium">Créditos restantes: {testData.credits}</p>
                    )}
                  </div>
                )}
              </div>

              <details className="bg-gray-50 rounded-lg p-4">
                <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900 text-sm">
                  Ver detalles técnicos
                </summary>
                <pre className="text-xs whitespace-pre-wrap text-gray-600 mt-3 overflow-auto max-h-48 bg-white p-3 rounded border">
                  {JSON.stringify(testData, null, 2)}
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
              <h2 className="text-xl font-bold text-gray-800">Carta Progresada</h2>
              <p className="text-gray-600 text-sm">Test de progresiones secundarias</p>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm">📊 Datos de Prueba:</h4>
            <ul className="text-purple-700 text-xs space-y-1">
              <li>• <strong>Fecha:</strong> 15 enero 1990</li>
              <li>• <strong>Hora:</strong> 12:30 CET</li>
              <li>• <strong>Lugar:</strong> Madrid, España</li>
              <li>• <strong>Método:</strong> Progresión Secundaria</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <button
              onClick={testProgressedChart}
              disabled={progressedLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {progressedLoading ? 'Generando Carta...' : 'Probar Carta Progresada'}
            </button>
          </div>

          {progressedLoading && (
            <div className="text-center py-6">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600"></div>
              <p className="mt-3 text-gray-600 text-sm">Calculando progresiones...</p>
            </div>
          )}

          {progressedError && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <div className="flex">
                <span className="text-red-400 mr-2">❌</span>
                <div>
                  <h3 className="font-bold text-red-800 text-sm">Error en Carta Progresada</h3>
                  <p className="text-red-700 text-sm">{progressedError}</p>
                </div>
              </div>
            </div>
          )}

          {progressedData && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border-l-4 ${
                progressedData.success 
                  ? 'bg-green-50 border-green-400' 
                  : 'bg-red-50 border-red-400'
              }`}>
                <div className="flex items-center">
                  <span className="mr-2">{progressedData.success ? '✅' : '❌'}</span>
                  <h3 className="font-bold text-sm">
                    {progressedData.success ? 'Carta Progresada Generada' : 'Error en Carta Progresada'}
                  </h3>
                </div>
                {progressedData.success && (
                  <div className="mt-2 text-xs text-gray-600 space-y-1">
                    <p>• <strong>Año Actual:</strong> {progressedData.data?.progression?.current?.year}</p>
                    <p>• <strong>Año Siguiente:</strong> {progressedData.data?.progression?.next?.year}</p>
                    <p>• <strong>Después del cumpleaños:</strong> {progressedData.data?.metadata?.isAfterBirthday ? 'Sí' : 'No'}</p>
                    <p>• <strong>Calculado:</strong> {new Date(progressedData.data?.metadata?.calculatedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>

              <details className="bg-gray-50 rounded-lg p-4">
                <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900 text-sm">
                  Ver datos completos
                </summary>
                <pre className="text-xs whitespace-pre-wrap text-gray-600 mt-3 overflow-auto max-h-48 bg-white p-3 rounded border">
                  {JSON.stringify(progressedData, null, 2)}
                </pre>
              </details>
              
              {progressedData.success && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center text-sm">
                    <span className="mr-2">🎉</span>
                    ¡Éxito!
                  </h4>
                  <ul className="text-green-700 text-xs space-y-1">
                    <li>• Carta progresada generada correctamente</li>
                    <li>• Dos años de progresión obtenidos</li>
                    <li>• Cálculo automático de períodos</li>
                    <li>• Revisa la consola para más detalles</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== INFORMACIÓN TÉCNICA ===== */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">📋 Información Técnica</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold text-blue-800 mb-2 flex items-center text-sm">
              <span className="mr-2">🔗</span>
              Carta Natal Básica
            </h4>
            <ul className="text-blue-700 text-xs space-y-1">
              <li>• <strong>Endpoint:</strong> /api/prokerala/test</li>
              <li>• <strong>Método:</strong> GET</li>
              <li>• <strong>Verifica:</strong> Autenticación con Prokerala</li>
              <li>• <strong>Variables:</strong> CLIENT_ID, CLIENT_SECRET</li>
              <li>• <strong>Datos:</strong> Madrid, 15 enero 1990</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-bold text-purple-800 mb-2 flex items-center text-sm">
              <span className="mr-2">🔮</span>
              Carta Progresada
            </h4>
            <ul className="text-purple-700 text-xs space-y-1">
              <li>• <strong>Endpoint:</strong> /api/charts/progressed</li>
              <li>• <strong>Método:</strong> POST</li>
              <li>• <strong>Calcula:</strong> Progresiones secundarias</li>
              <li>• <strong>Años:</strong> Actual + Siguiente automático</li>
              <li>• <strong>Servicio:</strong> getProgressedChart</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}