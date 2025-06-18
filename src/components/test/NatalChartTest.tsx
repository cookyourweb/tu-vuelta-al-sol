// src/components/test/NatalChartTest.tsx - CORREGIDO
'use client';

import { useState } from 'react';

export default function NatalChartTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testNatalChart = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('🎯 Probando carta natal con endpoint CORRECTO...');
      
      // ✅ CAMBIADO: Ahora llama al endpoint que funciona
      const response = await fetch('/api/astrology/test-postman', {
        method: 'GET' // Cambiado de POST a GET
      });

      const data = await response.json();
      console.log('📊 Respuesta del servidor:', data);
      
      if (data.success) {
        setResult(data);
        
        // ✅ MOSTRAR VALIDACIÓN EN CONSOLA
        if (data.verification) {
          console.log('🔍 VERIFICACIÓN AUTOMÁTICA:');
          console.log(`☀️  Sol correcto: ${data.verification.sun_correct ? '✅' : '❌'}`);
          console.log(`🌙 Luna correcta: ${data.verification.moon_correct ? '✅' : '❌'}`);
          console.log(`🔺 ASC correcto: ${data.verification.ascendant_correct ? '✅' : '❌'}`);
          console.log(`🎯 TODO CORRECTO: ${data.verification.all_correct ? '✅ ¡PERFECTO!' : '❌ Revisar'}`);
        }
        
        if (data.instructions) {
          console.log('📋 SIGUIENTE PASO:', data.instructions.next_step);
        }
      } else {
        setError(data.error || 'Error desconocido');
      }
      
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err instanceof Error ? err.message : 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          🎯 Prueba de Carta Natal (CORREGIDA)
        </h2>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <h3 className="font-bold text-blue-800 mb-2">📋 Datos de Prueba:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• <strong>Nombre:</strong> Verónica (caso de referencia)</li>
            <li>• <strong>Fecha:</strong> 10 de febrero de 1974</li>
            <li>• <strong>Hora:</strong> 07:30:00 CET</li>
            <li>• <strong>Lugar:</strong> Madrid (40.4164, -3.7025)</li>
            <li>• <strong>Endpoint:</strong> /api/astrology/test-postman</li>
          </ul>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={testNatalChart}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center mx-auto"
          >
            {loading ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Generando carta natal...
              </>
            ) : (
              <>
                🎯 Probar Carta Natal Corregida
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="text-red-400">❌</div>
              <div className="ml-3">
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {result && result.success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
            <div className="flex">
              <div className="text-green-400">✅</div>
              <div className="ml-3">
                <h3 className="text-green-800 font-medium">¡Carta natal generada!</h3>
                <p className="text-green-700 text-sm mt-1">{result.message}</p>
                
                {/* Mostrar validación de posiciones */}
                {result.validation && (
                  <div className="mt-3 bg-white p-3 rounded border">
                    <h4 className="font-medium text-gray-800 mb-2">🔍 Posiciones planetarias:</h4>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>☀️ Sol:</span>
                        <span className="font-mono">{result.validation.sun_position}</span>
                        <span className="text-gray-500">({result.validation.expected_sun})</span>
                        {result.verification?.sun_correct && <span className="text-green-600">✅</span>}
                      </div>
                      <div className="flex justify-between">
                        <span>🌙 Luna:</span>
                        <span className="font-mono">{result.validation.moon_position}</span>
                        <span className="text-gray-500">({result.validation.expected_moon})</span>
                        {result.verification?.moon_correct && <span className="text-green-600">✅</span>}
                      </div>
                      <div className="flex justify-between">
                        <span>🔺 ASC:</span>
                        <span className="font-mono">{result.validation.ascendant_position}</span>
                        <span className="text-gray-500">({result.validation.expected_ascendant})</span>
                        {result.verification?.ascendant_correct && <span className="text-green-600">✅</span>}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Mostrar resultado general */}
                {result.verification && (
                  <div className={`mt-3 p-3 rounded border ${
                    result.verification.all_correct 
                      ? 'bg-green-100 border-green-500' 
                      : 'bg-yellow-100 border-yellow-500'
                  }`}>
                    <p className={`text-sm font-medium ${
                      result.verification.all_correct 
                        ? 'text-green-800' 
                        : 'text-yellow-800'
                    }`}>
                      {result.verification.all_correct 
                        ? '🎉 ¡PERFECTO! Todas las posiciones coinciden con la carta de referencia.'
                        : '⚠️ Algunas posiciones no coinciden. Revisar configuración.'
                      }
                    </p>
                    {result.instructions && (
                      <p className="text-xs mt-1 text-gray-600">
                        {result.instructions.next_step}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mostrar datos raw para debug */}
        {result && (
          <div className="bg-gray-50 p-4 rounded-md">
            <details>
              <summary className="font-medium cursor-pointer text-gray-700 hover:text-gray-900">
                📋 Ver respuesta completa de la API
              </summary>
              <pre className="mt-4 text-xs overflow-auto max-h-96 bg-white p-3 rounded border">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </details>
          </div>
        )}
        
        {/* Información técnica */}
        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold text-blue-800 mb-2">🔧 Información técnica:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• <strong>Configuración:</strong> Tropical (ayanamsa=0), Placidus</li>
            <li>• <strong>Aspectos:</strong> Todos (all), Rectificación: flat-chart</li>
            <li>• <strong>Idioma:</strong> Español (la=es)</li>
            <li>• <strong>Endpoint funcional:</strong> /api/astrology/test-postman</li>
            <li>• <strong>Verificación:</strong> Automática contra carta de referencia</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
