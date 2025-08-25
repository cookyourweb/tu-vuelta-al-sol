// src/components/test/MongoDBTest.tsx
// 🧪 TEST ESPECÍFICO PARA VERIFICAR ESTRUCTURA DE BIRTH DATA EN MONGODB

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface TestResult {
  success: boolean;
  data?: any;
  error?: string;
  rawResponse?: any;
  mappedData?: any;
  validationResult?: any;
}

export default function MongoDBTest() {
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      setCurrentUserId(user.uid);
    }
  }, [user]);

  // 🔍 FUNCIÓN PRINCIPAL DE TEST
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
          birthDate: rawData.data.birthDate ? 
            new Date(rawData.data.birthDate).toISOString().split('T')[0] : '',
          birthTime: rawData.data.birthTime || '',
          birthPlace: rawData.data.birthPlace || '',
          latitude: rawData.data.latitude || 0,
          longitude: rawData.data.longitude || 0,
          timezone: rawData.data.timezone || 'UTC'
        };

        console.log('🗺️ MAPPED DATA:', JSON.stringify(mappedData, null, 2));

        // 3. 🔍 SIMULAR VALIDACIÓN
        const requiredFields = ['birthDate', 'birthTime', 'birthPlace', 'latitude', 'longitude'];
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          🧪 Test MongoDB Birth Data Structure
        </h2>

        {/* INPUT USERID */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium mb-2">User ID a probar:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentUserId}
              onChange={(e) => setCurrentUserId(e.target.value)}
              placeholder="Ingresa userId o usa el tuyo"
              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setCurrentUserId(user?.uid || '')}
              disabled={!user?.uid}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
              Usar mi ID
            </button>
          </div>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={testMongoDBStructure}
            disabled={loading || !currentUserId}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? '🔄 Testeando...' : '🧪 Test Estructura MongoDB'}
          </button>

          <button
            onClick={createTestData}
            disabled={loading || !currentUserId}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? '🔄 Creando...' : '🔧 Crear Datos de Prueba'}
          </button>
        </div>

        {/* RESULTADOS */}
        {result && (
          <div className="space-y-6">
            {/* STATUS GENERAL */}
            <div className={`p-4 rounded-lg border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <h3 className={`text-lg font-bold mb-2 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.success ? '✅ API Response OK' : '❌ API Error'}
              </h3>
              {result.error && (
                <p className="text-red-700">{result.error}</p>
              )}
            </div>

            {/* RAW DATA */}
            {result.data && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">📥 Raw Data from MongoDB:</h4>
                <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}

            {/* MAPPED DATA */}
            {result.mappedData && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-3 text-blue-800">🗺️ Mapped Data (userDataService):</h4>
                <pre className="bg-blue-900 text-blue-100 p-4 rounded text-sm overflow-x-auto">
                  {JSON.stringify(result.mappedData, null, 2)}
                </pre>
              </div>
            )}

            {/* VALIDATION RESULT */}
            {result.validationResult && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-3 text-purple-800">🔍 Validation Result:</h4>
                
                <div className={`mb-4 p-3 rounded ${result.validationResult.hasRequiredData ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                  <p className={`font-semibold ${result.validationResult.hasRequiredData ? 'text-green-800' : 'text-red-800'}`}>
                    {result.validationResult.hasRequiredData ? '✅ Todos los datos requeridos están presentes' : '❌ Faltan datos requeridos'}
                  </p>
                  {result.validationResult.missingFields.length > 0 && (
                    <p className="text-red-700 mt-2">
                      Campos faltantes: {result.validationResult.missingFields.join(', ')}
                    </p>
                  )}
                </div>

                <h5 className="font-semibold mb-2 text-purple-700">Detalles por campo:</h5>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(result.validationResult.fieldDetails).map(([field, details]: [string, any]) => (
                    <div key={field} className={`p-3 rounded border ${details.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{field}</span>
                        <span className={`text-sm px-2 py-1 rounded ${details.isValid ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                          {details.isValid ? '✅ OK' : '❌ FAIL'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <p>Valor: <code className="bg-gray-100 px-1 rounded">{JSON.stringify(details.value)}</code></p>
                        <p>Tipo: <code className="bg-gray-100 px-1 rounded">{details.type}</code></p>
                        {details.isEmpty && <p className="text-red-600">⚠️ Está vacío</p>}
                        {details.isZero && <p className="text-red-600">⚠️ Es cero</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* AYUDA */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-lg font-semibold text-yellow-800 mb-2">💡 Cómo usar este test:</h4>
          <ol className="list-decimal list-inside text-yellow-700 space-y-1">
            <li>Ingresa tu userId o usa el botón "Usar mi ID"</li>
            <li>Si no tienes datos, usa "Crear Datos de Prueba" primero</li>
            <li>Ejecuta "Test Estructura MongoDB" para ver exactamente qué devuelve la API</li>
            <li>Revisa los resultados para entender por qué falla la validación</li>
          </ol>
        </div>
      </div>
    </div>
  );
}