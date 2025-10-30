// src/app/test-mongodb/page.tsx
// 🧪 PÁGINA ESPECÍFICA PARA TESTEAR MONGODB Y BIRTH DATA

'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function TestMongoDBPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const { user } = useAuth();

  // 🔍 TEST PRINCIPAL
  const testMongoDBStructure = async () => {
    if (!currentUserId) {
      alert('Por favor, ingresa un userId o inicia sesión');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      console.log('🧪 === TESTING MONGODB BIRTH DATA STRUCTURE ===');
      console.log('👤 Usuario a probar:', currentUserId);

      // 1. 📡 LLAMADA DIRECTA A LA API
      const response = await fetch(`/api/birth-data?userId=${currentUserId}`);
      const rawData = await response.json();

      console.log('📥 RAW RESPONSE:', JSON.stringify(rawData, null, 2));

      // 2. 🗺️ SIMULAR EL MAPEO DEL userDataService
      let mappedData = null;
      let validationResult = null;

      if (rawData.success && rawData.data) {
        // Aplicar el mismo mapeo que usa userDataService
        mappedData = {
          date: rawData.data.date || '',
          time: rawData.data.time || '',
          location: rawData.data.location || '',
          latitude: rawData.data.latitude || 0,
          longitude: rawData.data.longitude || 0,
          timezone: rawData.data.timezone || 'UTC'
        };

        console.log('🗺️ MAPPED DATA:', JSON.stringify(mappedData, null, 2));

        // 3. 🔍 SIMULAR VALIDACIÓN
        const requiredFields = ['date', 'time', 'location', 'latitude', 'longitude'];
        const missingFields: string[] = [];
        const fieldDetails: any = {};

        for (const field of requiredFields) {
          const value = mappedData[field as keyof typeof mappedData];
          let isValid = false;
          
          if (field === 'latitude' || field === 'longitude') {
            isValid = typeof value === 'number' && value !== 0 && !isNaN(value);
          } else {
            isValid = !!value && value !== '' && value.toString().trim() !== '';
          }

          fieldDetails[field] = {
            value,
            type: typeof value,
            isValid,
            isEmpty: !value || value === '',
            isZero: value === 0
          };

          if (!isValid) {
            missingFields.push(field);
          }
        }

        validationResult = {
          hasRequiredData: missingFields.length === 0,
          missingFields,
          fieldDetails
        };

        console.log('✅ VALIDATION RESULT:', JSON.stringify(validationResult, null, 2));
      }

      // 4. 📊 RESULTADO FINAL
      setResult({
        success: response.ok,
        data: rawData.data,
        rawResponse: rawData,
        mappedData,
        validationResult,
        error: rawData.error
      });

    } catch (error) {
      console.error('❌ Error en test:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔄 CREAR DATOS DE PRUEBA
  const createTestData = async () => {
    if (!currentUserId) {
      alert('Por favor, ingresa un userId');
      return;
    }

    setLoading(true);

    try {
      console.log('🔧 === CREANDO DATOS DE PRUEBA ===');

      const testData = {
        userId: currentUserId,
        fullName: 'Usuario Test MongoDB',
        birthDate: '1974-02-10',
        birthTime: '07:30:00',
        birthPlace: 'Madrid, España',
        latitude: 40.4164,
        longitude: -3.7025,
        timezone: 'Europe/Madrid'
      };

      const response = await fetch('/api/birth-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      const data = await response.json();
      console.log('📝 Datos creados:', data);

      if (data.success) {
        alert('✅ Datos de prueba creados. Ahora puedes hacer el test.');
      } else {
        alert(`❌ Error creando datos: ${data.error}`);
      }

    } catch (error) {
      console.error('❌ Error creando datos:', error);
      alert('Error creando datos de prueba');
    } finally {
      setLoading(false);
    }
  };

  // 🧪 TEST DEL userDataService COMPLETO
  const testUserDataService = async () => {
    if (!currentUserId) {
      alert('Por favor, ingresa un userId');
      return;
    }

    setLoading(true);

    try {
      console.log('🧪 === TESTING userDataService COMPLETO ===');

      // Simular lo que hace checkUserDataCompleteness
      const response = await fetch('/api/astrology/complete-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId
        })
      });

      const data = await response.json();
      console.log('📡 Respuesta de complete-events:', data);

      setResult((prev: any) => ({
        ...prev,
        completeEventsTest: {
          success: data.success,
          error: data.error,
          missingData: data.missingData,
          action: data.action,
          receivedData: data.receivedData
        }
      }));

    } catch (error) {
      console.error('❌ Error en test userDataService:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          
          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🧪 Test MongoDB Birth Data
            </h1>
            <p className="text-gray-600">
              Herramienta para diagnosticar problemas con la estructura de datos de nacimiento
            </p>
          </div>

          {/* USER INFO */}
          {user && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                👤 <strong>Usuario logueado:</strong> {user.email}
              </p>
              <p className="text-blue-700 text-sm">
                🆔 <strong>ID:</strong> <code className="bg-blue-100 px-2 py-1 rounded">{user.uid}</code>
              </p>
            </div>
          )}

          {/* INPUT USERID */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">🎯 Configuración del Test</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={currentUserId}
                onChange={(e) => setCurrentUserId(e.target.value)}
                placeholder="Ingresa userId o usa el tuyo"
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => setCurrentUserId(user?.uid || '')}
                disabled={!user?.uid}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 font-medium"
              >
                Usar mi ID
              </button>
            </div>
            
            {currentUserId && (
              <p className="text-sm text-gray-600">
                🎯 <strong>User ID a probar:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{currentUserId}</code>
              </p>
            )}
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={createTestData}
              disabled={loading || !currentUserId}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-lg font-semibold transition-colors text-center"
            >
              {loading ? '🔄 Creando...' : '🔧 Crear Datos de Prueba'}
            </button>

            <button
              onClick={testMongoDBStructure}
              disabled={loading || !currentUserId}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-lg font-semibold transition-colors text-center"
            >
              {loading ? '🔄 Testeando...' : '🧪 Test Estructura Raw'}
            </button>

            <button
              onClick={testUserDataService}
              disabled={loading || !currentUserId}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-lg font-semibold transition-colors text-center"
            >
              {loading ? '🔄 Testeando...' : '🔬 Test Complete Events'}
            </button>
          </div>

          {/* RESULTADOS */}
          {result && (
            <div className="space-y-6">
              
              {/* STATUS GENERAL */}
              <div className={`p-6 rounded-lg border-2 ${result.success ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <h3 className={`text-xl font-bold mb-2 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.success ? '✅ API Response OK' : '❌ API Error'}
                </h3>
                {result.error && (
                  <p className="text-red-700 font-medium">{result.error}</p>
                )}
              </div>

              {/* RAW DATA FROM MONGODB */}
              {result.data && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4 text-white">📥 Raw Data from MongoDB:</h4>
                  <pre className="text-green-400 text-sm overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}

              {/* MAPPED DATA */}
              {result.mappedData && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4 text-blue-800">🗺️ Datos Mapeados (como los ve userDataService):</h4>
                  <div className="bg-blue-900 text-blue-100 p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {JSON.stringify(result.mappedData, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* VALIDATION RESULT */}
              {result.validationResult && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4 text-purple-800">🔍 Resultado de Validación:</h4>
                  
                  <div className={`mb-6 p-4 rounded-lg ${result.validationResult.hasRequiredData ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                    <p className={`text-lg font-semibold ${result.validationResult.hasRequiredData ? 'text-green-800' : 'text-red-800'}`}>
                      {result.validationResult.hasRequiredData ? 
                        '✅ TODOS LOS DATOS ESTÁN PRESENTES' : 
                        '❌ FALTAN DATOS REQUERIDOS'
                      }
                    </p>
                    {result.validationResult.missingFields.length > 0 && (
                      <p className="text-red-700 mt-2 font-medium">
                        Campos faltantes: <code className="bg-red-200 px-2 py-1 rounded">{result.validationResult.missingFields.join(', ')}</code>
                      </p>
                    )}
                  </div>

                  <h5 className="font-semibold mb-4 text-purple-700">📋 Análisis Detallado por Campo:</h5>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(result.validationResult.fieldDetails).map(([field, details]: [string, any]) => (
                      <div key={field} className={`p-4 rounded-lg border-2 ${details.isValid ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-gray-800">{field}</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${details.isValid ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                            {details.isValid ? '✅ OK' : '❌ FAIL'}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p><strong>Valor:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{JSON.stringify(details.value)}</code></p>
                          <p><strong>Tipo:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{details.type}</code></p>
                          {details.isEmpty && <p className="text-red-600 font-medium">⚠️ Está vacío</p>}
                          {details.isZero && <p className="text-red-600 font-medium">⚠️ Es cero</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TEST COMPLETE EVENTS */}
              {result.completeEventsTest && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4 text-yellow-800">🔬 Test Complete Events API:</h4>
                  
                  <div className={`p-4 rounded-lg ${result.completeEventsTest.success ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                    <p className={`font-semibold ${result.completeEventsTest.success ? 'text-green-800' : 'text-red-800'}`}>
                      {result.completeEventsTest.success ? '✅ Complete Events OK' : '❌ Complete Events Failed'}
                    </p>
                    
                    {result.completeEventsTest.error && (
                      <p className="text-red-700 mt-2">{result.completeEventsTest.error}</p>
                    )}
                    
                    {result.completeEventsTest.missingData && (
                      <div className="mt-3">
                        <p className="text-red-700 font-medium">Datos faltantes detectados:</p>
                        <code className="bg-red-200 px-2 py-1 rounded text-red-800">
                          {JSON.stringify(result.completeEventsTest.missingData)}
                        </code>
                      </div>
                    )}
                    
                    {result.completeEventsTest.action && (
                      <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded">
                        <p className="text-yellow-800">
                          <strong>Acción requerida:</strong> {result.completeEventsTest.action}
                        </p>
                      </div>
                    )}
                    
                    {result.completeEventsTest.receivedData && (
                      <div className="mt-3">
                        <p className="text-gray-700 font-medium">Datos recibidos por complete-events:</p>
                        <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto mt-2">
                          {JSON.stringify(result.completeEventsTest.receivedData, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AYUDA E INSTRUCCIONES */}
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="text-lg font-semibold text-yellow-800 mb-4">💡 Cómo usar este test:</h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h5 className="font-semibold text-yellow-700 mb-2">🔧 Paso 1: Crear Datos</h5>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Ingresa tu userId</li>
                  <li>• Crea datos de prueba</li>
                  <li>• Verifica que se guardaron</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-yellow-700 mb-2">🧪 Paso 2: Test Raw</h5>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Ve la estructura raw de MongoDB</li>
                  <li>• Revisa el mapeo de campos</li>
                  <li>• Identifica problemas de validación</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-yellow-700 mb-2">🔬 Paso 3: Test API</h5>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Prueba complete-events</li>
                  <li>• Ve exactamente qué falla</li>
                  <li>• Obtén datos para debug</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
              <p className="text-yellow-800 font-medium">
                🎯 <strong>Objetivo:</strong> Identificar exactamente por qué falla la validación de birth data y corregir el mapeo de campos.
              </p>
            </div>
          </div>

          {/* DEBUG INFO */}
          <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">🐛 Debug Info:</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Usuario actual:</strong> {user?.email || 'No logueado'}</p>
                <p><strong>User ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{user?.uid || 'N/A'}</code></p>
              </div>
              <div>
                <p><strong>Test User ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{currentUserId || 'No configurado'}</code></p>
                <p><strong>Estado:</strong> {loading ? '🔄 Procesando...' : '✅ Listo'}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}