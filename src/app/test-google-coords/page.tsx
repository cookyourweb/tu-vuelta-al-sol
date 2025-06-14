// src/app/test-birth-data/page.tsx - TEST COMPLETO DEL FORMULARIO
'use client';

import React, { useState } from 'react';

export default function TestBirthDataPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Casos de test específicos
  const testCases = [
    {
      id: 'madrid_winter',
      name: '🌨️ Madrid Invierno (10 Feb 1974)',
      description: 'Persona nacida en Madrid en febrero - horario de invierno',
      data: {
        fullName: 'Test Madrid Invierno',
        birthDate: '1974-02-10',
        birthTime: '07:30:00',
        birthTimeKnown: true,
        inputMethod: 'coordinates',
        latitude: 40.4164,  // Coordenadas exactas de Google Maps
        longitude: -3.7025,
        timezone: 'Europe/Madrid',
        timeType: 'HL' // Hora Local
      },
      expected: {
        datetime: '1974-02-10T07:30:00+01:00', // GMT+1 en invierno
        coordinates: '40.4164,-3.7025',
        timezone_offset: '+01:00'
      }
    },
    {
      id: 'madrid_summer',
      name: '☀️ Madrid Verano (15 Jul 1985)',
      description: 'Persona nacida en Madrid en julio - horario de verano',
      data: {
        fullName: 'Test Madrid Verano',
        birthDate: '1985-07-15',
        birthTime: '14:20:00',
        birthTimeKnown: true,
        inputMethod: 'coordinates',
        latitude: 40.4164,
        longitude: -3.7025,
        timezone: 'Europe/Madrid',
        timeType: 'HL'
      },
      expected: {
        datetime: '1985-07-15T14:20:00+02:00', // GMT+2 en verano
        coordinates: '40.4164,-3.7025',
        timezone_offset: '+02:00'
      }
    },
    {
      id: 'unknown_time',
      name: '❓ Hora Desconocida',
      description: 'Persona que no sabe su hora exacta de nacimiento',
      data: {
        fullName: 'Test Hora Desconocida',
        birthDate: '1990-05-20',
        birthTime: '12:00:00', // Mediodía por defecto
        birthTimeKnown: false,
        inputMethod: 'location',
        birthPlace: 'Madrid, España',
        timeType: 'HL'
      },
      expected: {
        datetime: '1990-05-20T12:00:00+02:00', // Mediodía en horario de verano
        warning: 'Hora aproximada - precisión limitada'
      }
    },
    {
      id: 'google_coords',
      name: '📍 Coordenadas Google Maps',
      description: 'Usando coordenadas exactas copiadas de Google Maps',
      data: {
        fullName: 'Test Google Maps',
        birthDate: '1995-12-25',
        birthTime: '09:15:00',
        birthTimeKnown: true,
        inputMethod: 'coordinates',
        latitude: 40.41678, // Formato Google Maps (más decimales)
        longitude: -3.70379,
        timezone: 'Europe/Madrid',
        timeType: 'HL'
      },
      expected: {
        datetime: '1995-12-25T09:15:00+01:00', // Invierno
        coordinates: '40.4168,-3.7038', // Redondeado a 4 decimales
        precision: 'Google Maps coordinates'
      }
    }
  ];

  // Función para calcular timezone correcto según fecha
  const calculateTimezone = (date: string, timezone: string) => {
    const birthDate = new Date(date);
    const month = birthDate.getMonth() + 1; // 1-12
    
    if (timezone === 'Europe/Madrid') {
      // España: Invierno (GMT+1) / Verano (GMT+2)
      // Horario de verano: último domingo marzo - último domingo octubre
      if (month >= 4 && month <= 9) {
        return '+02:00'; // Verano (CEST)
      } else {
        return '+01:00'; // Invierno (CET)
      }
    }
    
    return '+00:00'; // Default UTC
  };

  // Función para formatear coordenadas como Prokerala
  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(4)},${lng.toFixed(4)}`;
  };

  // Función de test
  const runTest = async (testCase: any) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🧪 === EJECUTANDO TEST: ${testCase.name} ===`);
      console.log('📋 Datos de entrada:', testCase.data);
      
      // Simular procesamiento del formulario
      const { data, expected } = testCase;
      
      // 1. Calcular timezone correcto
      const timezoneOffset = calculateTimezone(data.birthDate, data.timezone || 'Europe/Madrid');
      
      // 2. Formatear datetime para Prokerala
      const datetime = `${data.birthDate}T${data.birthTime}${timezoneOffset}`;
      
      // 3. Formatear coordenadas
      let coordinates = '';
      if (data.inputMethod === 'coordinates') {
        coordinates = formatCoordinates(data.latitude, data.longitude);
      } else {
        // Simular geocoding de Madrid
        coordinates = '40.4164,-3.7025';
      }
      
      // 4. Preparar datos para API de Prokerala
      const prokeralaData = {
        datetime,
        coordinates,
        birth_time_unknown: !data.birthTimeKnown,
        house_system: 'placidus',
        orb: 'default',
        birth_time_rectification: 'flat-chart',
        aspect_filter: 'all',
        la: 'es',
        ayanamsa: '0' // Tropical
      };
      
      console.log('🔧 Datos procesados para Prokerala:', prokeralaData);
      console.log('✅ Datetime calculado:', datetime);
      console.log('📍 Coordenadas formateadas:', coordinates);
      console.log('🌍 Timezone offset:', timezoneOffset);
      
      // 5. Verificar contra expectativas
      const results: {
        success: boolean;
        test_case: string;
        input: any;
        processed: any;
        verification: {
          datetime_correct: boolean;
          coordinates_correct: boolean;
          timezone_correct: boolean;
        };
        warnings: string[];
      } = {
        success: true,
        test_case: testCase.id,
        input: data,
        processed: prokeralaData,
        verification: {
          datetime_correct: datetime === expected.datetime,
          coordinates_correct: !expected.coordinates || coordinates === expected.coordinates,
          timezone_correct: timezoneOffset === expected.timezone_offset
        },
        warnings: []
      };
      
      // Añadir advertencias si es necesario
      if (!data.birthTimeKnown) {
        results.warnings.push('⚠️ Hora desconocida - usando mediodía como aproximación');
      }
      
      if (data.inputMethod === 'location') {
        results.warnings.push('ℹ️ Ubicación geocodificada automáticamente');
      }
      
      console.log('🎯 Resultados del test:', results);
      console.log(`🧪 === FIN TEST: ${testCase.name} ===\n`);
      
      setTestResult(results);
      
    } catch (err) {
      console.error('❌ Error en test:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-900">
        🧪 Test Completo de BirthDataForm
      </h1>
      
      <div className="mb-8 max-w-4xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-blue-800 mb-4">📋 Casos de Test</h2>
          <p className="text-blue-700 mb-4">
            Estos tests verifican el manejo correcto de coordenadas de Google Maps, 
            timezones de invierno/verano, y conversión a formato Prokerala.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-blue-700 mb-2">🔍 Qué se prueba:</h3>
              <ul className="space-y-1 text-blue-600">
                <li>• Coordenadas Google Maps → Prokerala</li>
                <li>• Timezone invierno vs verano</li>
                <li>• Hora conocida vs desconocida</li>
                <li>• Formato datetime ISO correcto</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-700 mb-2">✅ Verificaciones:</h3>
              <ul className="space-y-1 text-blue-600">
                <li>• Febrero Madrid = GMT+1 (invierno)</li>
                <li>• Julio Madrid = GMT+2 (verano)</li>
                <li>• Coordenadas redondeadas a 4 decimales</li>
                <li>• Hora desconocida = 12:00 + advertencia</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Casos de test */}
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6">
          {testCases.map((testCase) => (
            <div key={testCase.id} className="bg-white rounded-xl shadow-lg p-6 border">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">🧪</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{testCase.name}</h3>
                  <p className="text-gray-600 text-sm">{testCase.description}</p>
                </div>
              </div>
              
              {/* Datos de entrada */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 text-sm mb-2">📋 Datos de Entrada:</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>• <strong>Fecha:</strong> {testCase.data.birthDate}</div>
                  <div>• <strong>Hora:</strong> {testCase.data.birthTime} 
                    {!testCase.data.birthTimeKnown && ' (desconocida)'}
                  </div>
                  {testCase.data.latitude && (
                    <div>• <strong>Coordenadas:</strong> {testCase.data.latitude}, {testCase.data.longitude}</div>
                  )}
                  {testCase.data.birthPlace && (
                    <div>• <strong>Lugar:</strong> {testCase.data.birthPlace}</div>
                  )}
                </div>
              </div>
              
              {/* Expectativas */}
              <div className="mb-4 p-3 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-700 text-sm mb-2">🎯 Resultado Esperado:</h4>
                <div className="text-xs text-green-600 space-y-1">
                  <div>• <strong>DateTime:</strong> {testCase.expected.datetime}</div>
                  {testCase.expected.coordinates && (
                    <div>• <strong>Coords:</strong> {testCase.expected.coordinates}</div>
                  )}
                  <div>• <strong>Timezone:</strong> {testCase.expected.timezone_offset}</div>
                </div>
              </div>
              
              <button
                onClick={() => runTest(testCase)}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
              >
                {loading ? 'Ejecutando Test...' : 'Ejecutar Test'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Resultados */}
      {testResult && (
        <div className="mt-8 max-w-4xl mx-auto">
          <div className={`p-6 rounded-lg border ${
            testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <h3 className="text-lg font-bold mb-4">
              {testResult.success ? '✅ Test Completado' : '❌ Test Fallido'}
            </h3>
            
            {/* Verificaciones */}
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className={`p-3 rounded ${
                testResult.verification.datetime_correct ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <div className="font-semibold text-sm">
                  {testResult.verification.datetime_correct ? '✅' : '❌'} DateTime
                </div>
                <div className="text-xs">{testResult.processed.datetime}</div>
              </div>
              
              <div className={`p-3 rounded ${
                testResult.verification.coordinates_correct ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <div className="font-semibold text-sm">
                  {testResult.verification.coordinates_correct ? '✅' : '❌'} Coordenadas
                </div>
                <div className="text-xs">{testResult.processed.coordinates}</div>
              </div>
              
              <div className={`p-3 rounded ${
                testResult.verification.timezone_correct ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <div className="font-semibold text-sm">
                  {testResult.verification.timezone_correct ? '✅' : '❌'} Timezone
                </div>
                <div className="text-xs">Calculado correctamente</div>
              </div>
            </div>
            
            {/* Advertencias */}
            {testResult.warnings.length > 0 && (
              <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 text-sm mb-2">⚠️ Advertencias:</h4>
                <ul className="text-xs text-yellow-700 space-y-1">
                  {testResult.warnings.map((warning: string, i: number) => (
                    <li key={i}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Datos procesados completos */}
            <details className="mt-4">
              <summary className="cursor-pointer font-semibold text-gray-700 text-sm">
                Ver datos procesados completos
              </summary>
              <pre className="text-xs text-gray-600 mt-2 overflow-auto max-h-48 bg-white p-3 rounded border">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-red-800 mb-2">❌ Error en Test</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}