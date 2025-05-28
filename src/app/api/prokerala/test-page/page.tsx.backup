'use client';

import { useState } from 'react';

export default function ProkeralaTestPage() {
  const [testData, setTestData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-900">
        Prueba de Integración con Prokerala
      </h1>
      
      <p className="text-center mb-8 text-gray-600 max-w-2xl mx-auto">
        Esta página te permite probar la integración con la API de Prokerala para generar cartas natales.
        Haz clic en el botón para probar la conexión con la API.
      </p>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <button
            onClick={testConnection}
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
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

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">💡 Información:</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Esta prueba verifica la autenticación con Prokerala</li>
            <li>• Si hay errores, revisa las variables de entorno</li>
            <li>• Las credenciales deben estar configuradas en Vercel</li>
            <li>• Una vez que funcione, podremos agregar la visualización de cartas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}