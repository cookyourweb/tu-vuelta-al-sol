// src/components/test/NatalChartTest.tsx
'use client';

import { useState } from 'react';

export default function NatalChartTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testNatalChart = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Datos de prueba
      const testData = {
        birthDate: '1990-01-01',
        birthTime: '12:00:00',
        latitude: 40.4168,
        longitude: -3.7038,
        timezone: 'Europe/Madrid'
      };

      console.log('Testing with data:', testData);
      
      // Simular llamada a la API (puedes cambiar esto por tu endpoint real)
      const response = await fetch('/api/prokerala/test', {
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Prueba de Carta Natal (Sin Visualización)
        </h2>

        <div className="text-center mb-6">
          <button
            onClick={testNatalChart}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            {loading ? 'Generando Carta...' : 'Probar Carta Natal'}
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-600">Generando carta natal...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <h3 className="font-bold text-red-800">❌ Error</h3>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <h3 className="font-bold">✅ Carta Generated</h3>
              <p>Los datos de la carta natal se generaron correctamente.</p>
            </div>

            <details className="bg-gray-100 rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                Ver datos de la carta natal
              </summary>
              <div className="mt-2 max-h-96 overflow-auto">
                <pre className="text-sm whitespace-pre-wrap text-gray-600">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        )}

        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Nota:</h4>
          <p className="text-yellow-700 text-sm">
            La visualización SVG de la carta natal está temporalmente deshabilitada 
            para evitar errores. Una vez que la API funcione correctamente, 
            añadiremos la visualización visual.
          </p>
        </div>
      </div>
    </div>
  );
}