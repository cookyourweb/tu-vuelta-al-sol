'use client';

import { useState } from 'react';

export default function ProkeralaTestPage() {
  const [testData, setTestData] = useState<any>(null);
  const [progressedData, setProgressedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [progressedLoading, setProgressedLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressedError, setProgressedError] = useState<string | null>(null);

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-900">
        🔮 Prueba de Integración con Prokerala
      </h1>
      
      <p className="text-center mb-8 text-gray-600 max-w-2xl mx-auto">
        Esta página te permite probar tanto la integración básica como las cartas progresadas con la API de Prokerala.
      </p>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* ===== SECCIÓN CONEXIÓN BÁSICA ===== */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            🔗 <span className="ml-2">Test de Conexión Básica</span>
          </h2>
          
          <div className="text-center mb-6">
            <button
              onClick={testConnection}
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors w-full"
            >
              {loading ? 'Probando Conexión...' : 'Probar API de Prokerala'}
            </button>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
              <p className="mt-4 text-gray-600">Conectando con Prokerala...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <h3 className="font-bold text-red-800">❌ Error de Conexión</h3>
              <p className="mt-1">{error}</p>
            </div>
          )}

          {testData && (
            <div className="mt-6">
              <div className={`p-4 rounded-lg mb-4 ${
                testData.success 
                  ? 'bg-green-100 border border-green-400 text-green-700' 
                  : 'bg-red-100 border border-red-400 text-red-700'
              }`}>
                <h3 className="font-bold">
                  {testData.success ? '✅ Conexión Exitosa' : '❌ Error de Conexión'}
                </h3>
                {testData.success && <p>La API de Prokerala está funcionando correctamente.</p>}
                {testData.credits && (
                  <p className="text-sm mt-1">Créditos restantes: {testData.credits}</p>
                )}
              </div>

              <details className="bg-gray-100 rounded-lg p-4">
                <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                  Ver detalles técnicos
                </summary>
                <pre className="text-sm whitespace-pre-wrap text-gray-600 mt-2 overflow-auto max-h-96">
                  {JSON.stringify(testData, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>

        {/* ===== NUEVA SECCIÓN CARTA PROGRESADA ===== */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            🔮 <span className="ml-2">Test de Carta Progresada</span>
          </h2>
          
          <div className="bg-purple-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-purple-800 mb-2">📊 Datos de Prueba:</h4>
            <ul className="text-purple-700 text-sm space-y-1">
              <li>• <strong>Fecha:</strong> 15 enero 1990</li>
              <li>• <strong>Hora:</strong> 12:30 CET</li>
              <li>• <strong>Lugar:</strong> Madrid, España</li>
              <li>• <strong>Método:</strong> Progresión Secundaria (años completos)</li>
            </ul>
          </div>
          
          <div className="text-center mb-6">
            <button
              onClick={testProgressedChart}
              disabled={progressedLoading}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors w-full"
            >
              {progressedLoading ? 'Generando Carta Progresada...' : 'Probar Carta Progresada'}
            </button>
          </div>

          {progressedLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              <p className="mt-4 text-gray-600">Calculando progresiones astrológicas...</p>
            </div>
          )}

          {progressedError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <h3 className="font-bold text-red-800">❌ Error en Carta Progresada</h3>
              <p className="mt-1">{progressedError}</p>
            </div>
          )}

          {progressedData && (
            <div className="mt-6">
              <div className={`p-4 rounded-lg mb-4 ${
                progressedData.success 
                  ? 'bg-green-100 border border-green-400 text-green-700' 
                  : 'bg-red-100 border border-red-400 text-red-700'
              }`}>
                <h3 className="font-bold">
                  {progressedData.success ? '✅ Carta Progresada Generada' : '❌ Error en Carta Progresada'}
                </h3>
                {progressedData.success && (
                  <div className="mt-2 text-sm space-y-1">
                    <p>• <strong>Año Actual:</strong> {progressedData.data?.progression?.current?.year}</p>
                    <p>• <strong>Año Siguiente:</strong> {progressedData.data?.progression?.next?.year}</p>
                    <p>• <strong>Después del cumpleaños:</strong> {progressedData.data?.metadata?.isAfterBirthday ? 'Sí' : 'No'}</p>
                    <p>• <strong>Calculado en:</strong> {new Date(progressedData.data?.metadata?.calculatedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>

              <details className="bg-gray-100 rounded-lg p-4">
                <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                  Ver datos completos de carta progresada
                </summary>
                <pre className="text-sm whitespace-pre-wrap text-gray-600 mt-2 overflow-auto max-h-96">
                  {JSON.stringify(progressedData, null, 2)}
                </pre>
              </details>
              
              {progressedData.success && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">🎉 ¡Éxito!</h4>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Carta progresada generada correctamente</li>
                    <li>• Dos años de progresión obtenidos automáticamente</li>
                    <li>• Cálculo basado en progresiones secundarias</li>
                    <li>• Revisa la consola del navegador para más detalles</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== INFORMACIÓN ADICIONAL ===== */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg max-w-6xl mx-auto">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Información General:</h4>
        <div className="grid md:grid-cols-2 gap-4 text-blue-700 text-sm">
          <div>
            <strong>Conexión Básica:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Verifica autenticación con Prokerala</li>
              <li>• Revisa variables de entorno</li>
              <li>• Confirma credenciales en Vercel</li>
            </ul>
          </div>
          <div>
            <strong>Carta Progresada:</strong>
            <ul className="mt-1 space-y-1">
              <li>• ✅ Respuesta exitosa (success: true)</li>
              <li>• ✅ Dos cartas progresadas automáticas</li>
              <li>• ✅ Cálculo de años completos</li>
              <li>• ✅ Endpoint: /api/charts/progressed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}