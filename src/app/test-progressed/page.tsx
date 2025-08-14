// src/app/test-progressed/page.tsx - PRUEBA TU FECHA ESPECÍFICA
'use client';

import { useState } from 'react';
// import { testProgressedChartConnection } from '@/services/progressedChartService';

export default function TestProgressedChart() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 🧪 Test 1: Verificar configuración
  const handleTestConnection = async () => {
    setLoading(true);
    try {
      // testProgressedChartConnection function no está disponible
      setTestResult({
        success: false,
        message: 'La función testProgressedChartConnection no está exportada desde el módulo.',
      });
      console.log('🧪 testProgressedChartConnection no disponible');
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Error en test',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setLoading(false);
    }
  };

  // 🧪 Test 2: Debug específico para tu fecha
  const handleDebugYourDate = () => {
    console.log('🧪 === DEBUGGING TU FECHA ESPECÍFICA ===');
    
    // debugProgressedVsNatal function removed because it is not exported
    
    setTestResult({
      success: true,
      message: 'Debug de tu fecha completado - función debugProgressedVsNatal no disponible',
      details: {
        birthDate: '1974-02-10',
        birthTime: '07:30:00',
        location: 'Madrid',
        expectedProgressionYear: 2025,
        note: 'Función debugProgressedVsNatal no está implementada o exportada'
      }
    });
  };

  // 🧪 Test 3: Llamar al API route
  const handleTestApiRoute = async () => {
    setLoading(true);
    try {
      // Simular llamada con userId ficticio
      const response = await fetch('/api/charts/progressed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'test-user-id',
          regenerate: true
        }),
      });

      const result = await response.json();
      
      setTestResult({
        success: response.ok,
        message: response.ok ? 'API route funcionando' : 'Error en API route',
        apiResponse: result,
        status: response.status
      });
      
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Error llamando API route',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-900">
        🔮 Test Carta Progresada
      </h1>
      
      <div className="space-y-6">
        {/* Info de tu fecha específica */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            📅 Tu Información de Nacimiento
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Fecha:</strong> 10 febrero 1974</div>
            <div><strong>Hora:</strong> 07:30</div>
            <div><strong>Lugar:</strong> Madrid, España</div>
            <div><strong>Período actual:</strong> Feb 2025 - Feb 2026</div>
            <div><strong>Progression Year:</strong> 2025</div>
            <div><strong>Timezone:</strong> Europe/Madrid (+01:00)</div>
          </div>
        </div>

        {/* Botones de test */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleTestConnection}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
          >
            🔧 Test Configuración
          </button>
          
          <button
            onClick={handleDebugYourDate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            🧪 Debug Tu Fecha
          </button>
          
          <button
            onClick={handleTestApiRoute}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
          >
            🚀 Test API Route
          </button>
        </div>

        {/* Resultado */}
        {testResult && (
          <div className={`border rounded-lg p-6 ${
            testResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              testResult.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {testResult.success ? '✅ Éxito' : '❌ Error'}
            </h3>
            
            <p className="mb-4">{testResult.message}</p>
            
            {testResult.details && (
              <div className="bg-white border rounded p-4">
                <h4 className="font-medium mb-2">Detalles:</h4>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(testResult.details, null, 2)}
                </pre>
              </div>
            )}
            
            {testResult.apiResponse && (
              <div className="bg-white border rounded p-4 mt-4">
                <h4 className="font-medium mb-2">Respuesta API:</h4>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(testResult.apiResponse, null, 2)}
                </pre>
              </div>
            )}
            
            {testResult.error && (
              <div className="bg-red-100 border border-red-300 rounded p-4 mt-4">
                <h4 className="font-medium text-red-800 mb-2">Error:</h4>
                <p className="text-red-700 text-sm">{testResult.error}</p>
              </div>
            )}
          </div>
        )}

        {/* URL esperada */}
        <div className="bg-gray-50 border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🌐 URL que se debería generar para tu fecha:
          </h3>
          <div className="bg-white border rounded p-4 text-xs break-all font-mono">
            https://api.prokerala.com/v2/astrology/progression-chart?profile[datetime]=1974-02-10T07:30:00%2B01:00&profile[coordinates]=40.4164,-3.7025&current_coordinates=40.4164,-3.7025&progression_year=2025&ayanamsa=0&house_system=placidus&birth_time_rectification=flat-chart&aspect_filter=all&la=es
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Parámetros clave para tu caso:</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><code>profile[datetime]</code>: 1974-02-10T07:30:00+01:00 (invierno Madrid)</li>
              <li><code>progression_year</code>: 2025 (tu edad progresada actual)</li>
              <li><code>ayanamsa</code>: 0 (tropical occidental)</li>
              <li><code>birth_time_rectification</code>: flat-chart</li>
            </ul>
          </div>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Ejecutando test...</p>
          </div>
        )}
      </div>
    </div>
  );
}