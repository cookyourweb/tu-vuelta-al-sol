// src/app/test-birth-data/page.tsx
'use client';

import React, { useState } from 'react';
import { MapPin, Calendar, Clock, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface TestResult {
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
}

export default function TestBirthDataPage() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función mejorada para calcular timezone correcto según fecha
  const calculateTimezoneOffset = (date: string, timezone: string): string => {
    const birthDate = new Date(date);
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1; // 1-12
    const day = birthDate.getDate();
    
    // Función auxiliar para obtener el último domingo de un mes
    const getLastSunday = (year: number, month: number): number => {
      const lastDay = new Date(year, month, 0);
      const dayOfWeek = lastDay.getDay();
      return lastDay.getDate() - dayOfWeek;
    };
    
    if (timezone === 'Europe/Madrid' || timezone === 'Europe/Berlin' || timezone === 'Europe/Paris') {
      // Europa Central: Horario de verano desde último domingo de marzo hasta último domingo de octubre
      const dstStart = new Date(year, 2, getLastSunday(year, 3)); // Marzo
      const dstEnd = new Date(year, 9, getLastSunday(year, 10)); // Octubre
      
      if (birthDate >= dstStart && birthDate < dstEnd) {
        return '+02:00'; // CEST (Verano)
      } else {
        return '+01:00'; // CET (Invierno)
      }
    }
    
    if (timezone === 'America/New_York') {
      // USA Este: Segundo domingo de marzo hasta primer domingo de noviembre
      const getSecondSunday = (year: number, month: number): number => {
        const firstDay = new Date(year, month - 1, 1);
        const dayOfWeek = firstDay.getDay();
        const firstSunday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
        return firstSunday + 7;
      };
      
      const getFirstSunday = (year: number, month: number): number => {
        const firstDay = new Date(year, month - 1, 1);
        const dayOfWeek = firstDay.getDay();
        return dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
      };
      
      const dstStart = new Date(year, 2, getSecondSunday(year, 3));
      const dstEnd = new Date(year, 10, getFirstSunday(year, 11));
      
      if (birthDate >= dstStart && birthDate < dstEnd) {
        return '-04:00'; // EDT (Verano)
      } else {
        return '-05:00'; // EST (Invierno)
      }
    }
    
    // Zonas sin cambio de horario
    const staticTimezones: Record<string, string> = {
      'America/Argentina/Buenos_Aires': '-03:00',
      'America/Bogota': '-05:00',
      'America/Lima': '-05:00',
      'Asia/Tokyo': '+09:00',
      'Asia/Kolkata': '+05:30',
      'UTC': '+00:00'
    };
    
    return staticTimezones[timezone] || '+00:00';
  };

  // Función para formatear coordenadas con precisión correcta
  const formatCoordinates = (lat: number, lng: number): string => {
    // Redondear a 4 decimales para Prokerala
    const latFixed = Math.round(lat * 10000) / 10000;
    const lngFixed = Math.round(lng * 10000) / 10000;
    return `${latFixed.toFixed(4)},${lngFixed.toFixed(4)}`;
  };

  // Casos de test específicos
  const testCases = [
    {
      id: 'madrid_winter',
      name: '🌨️ Madrid Invierno (10 Feb 1974)',
      description: 'Nacimiento en Madrid en febrero - horario de invierno CET',
      data: {
        fullName: 'Test Madrid Invierno',
        birthDate: '1974-02-10',
        birthTime: '07:30:00',
        birthTimeKnown: true,
        inputMethod: 'coordinates',
        latitude: 40.4164,
        longitude: -3.7025,
        timezone: 'Europe/Madrid',
        timeType: 'HL'
      },
      expected: {
        datetime: '1974-02-10T07:30:00+01:00',
        coordinates: '40.4164,-3.7025',
        timezone_offset: '+01:00'
      }
    },
    {
      id: 'madrid_summer',
      name: '☀️ Madrid Verano (15 Jul 1985)',
      description: 'Nacimiento en Madrid en julio - horario de verano CEST',
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
        datetime: '1985-07-15T14:20:00+02:00',
        coordinates: '40.4164,-3.7025',
        timezone_offset: '+02:00'
      }
    },
    {
      id: 'border_spring',
      name: '🌸 Madrid Cambio Primavera (31 Mar 2024)',
      description: 'Justo después del cambio a horario de verano',
      data: {
        fullName: 'Test Cambio Primavera',
        birthDate: '2024-03-31',
        birthTime: '10:00:00',
        birthTimeKnown: true,
        inputMethod: 'coordinates',
        latitude: 40.4164,
        longitude: -3.7025,
        timezone: 'Europe/Madrid',
        timeType: 'HL'
      },
      expected: {
        datetime: '2024-03-31T10:00:00+02:00',
        coordinates: '40.4164,-3.7025',
        timezone_offset: '+02:00'
      }
    },
    {
      id: 'border_autumn',
      name: '🍂 Madrid Cambio Otoño (27 Oct 2024)',
      description: 'Justo después del cambio a horario de invierno',
      data: {
        fullName: 'Test Cambio Otoño',
        birthDate: '2024-10-27',
        birthTime: '10:00:00',
        birthTimeKnown: true,
        inputMethod: 'coordinates',
        latitude: 40.4164,
        longitude: -3.7025,
        timezone: 'Europe/Madrid',
        timeType: 'HL'
      },
      expected: {
        datetime: '2024-10-27T10:00:00+01:00',
        coordinates: '40.4164,-3.7025',
        timezone_offset: '+01:00'
      }
    },
    {
      id: 'unknown_time',
      name: '❓ Hora Desconocida',
      description: 'Persona que no sabe su hora exacta de nacimiento',
      data: {
        fullName: 'Test Hora Desconocida',
        birthDate: '1990-05-20',
        birthTime: '12:00:00',
        birthTimeKnown: false,
        inputMethod: 'location',
        birthPlace: 'Madrid, España',
        timeType: 'HL'
      },
      expected: {
        datetime: '1990-05-20T12:00:00+02:00',
        warning: 'Hora aproximada - precisión limitada',
        coordinates: '40.4164,-3.7025',
        timezone_offset: '+02:00'
      }
    },
    {
      id: 'google_coords',
      name: '📍 Coordenadas Google Maps',
      description: 'Usando coordenadas exactas de Google Maps (muchos decimales)',
      data: {
        fullName: 'Test Google Maps',
        birthDate: '1995-12-25',
        birthTime: '09:15:00',
        birthTimeKnown: true,
        inputMethod: 'coordinates',
        latitude: 40.41678945,
        longitude: -3.70379123,
        timezone: 'Europe/Madrid',
        timeType: 'HL'
      },
      expected: {
        datetime: '1995-12-25T09:15:00+01:00',
        coordinates: '40.4168,-3.7038',
        precision: 'Google Maps coordinates'
      }
    },
    {
      id: 'buenos_aires',
      name: '🇦🇷 Buenos Aires (Sin DST)',
      description: 'Zona horaria sin cambio de horario',
      data: {
        fullName: 'Test Buenos Aires',
        birthDate: '2000-06-15',
        birthTime: '22:45:00',
        birthTimeKnown: true,
        inputMethod: 'coordinates',
        latitude: -34.6037,
        longitude: -58.3816,
        timezone: 'America/Argentina/Buenos_Aires',
        timeType: 'HL'
      },
      expected: {
        datetime: '2000-06-15T22:45:00-03:00',
        coordinates: '-34.6037,-58.3816',
        timezone_offset: '-03:00'
      }
    },
    {
      id: 'new_york_summer',
      name: '🗽 Nueva York Verano',
      description: 'USA Este con horario de verano EDT',
      data: {
        fullName: 'Test Nueva York',
        birthDate: '2023-07-04',
        birthTime: '16:30:00',
        birthTimeKnown: true,
        inputMethod: 'coordinates',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: 'America/New_York',
        timeType: 'HL'
      },
      expected: {
        datetime: '2023-07-04T16:30:00-04:00',
        coordinates: '40.7128,-74.0060',
        timezone_offset: '-04:00'
      }
    }
  ];

  // Función de test
  const runTest = async (testCase: any) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`\n🧪 === EJECUTANDO TEST: ${testCase.name} ===`);
      console.log('📋 Datos de entrada:', JSON.stringify(testCase.data, null, 2));
      
      const { data, expected } = testCase;
      
      // 1. Calcular timezone correcto considerando DST
      const timezoneOffset = calculateTimezoneOffset(data.birthDate, data.timezone || 'Europe/Madrid');
      console.log(`🌍 Timezone calculado: ${timezoneOffset} para ${data.timezone} en ${data.birthDate}`);
      
      // 2. Formatear datetime para Prokerala
      const datetime = `${data.birthDate}T${data.birthTime}${timezoneOffset}`;
      console.log(`📅 DateTime formateado: ${datetime}`);
      
      // 3. Formatear coordenadas
      let coordinates = '';
      if (data.inputMethod === 'coordinates') {
        coordinates = formatCoordinates(data.latitude, data.longitude);
        console.log(`📍 Coordenadas originales: ${data.latitude}, ${data.longitude}`);
        console.log(`📍 Coordenadas formateadas: ${coordinates}`);
      } else {
        // Simular geocoding de Madrid
        coordinates = '40.4164,-3.7025';
        console.log(`📍 Coordenadas geocodificadas: ${coordinates}`);
      }
      
      // 4. Preparar datos para API de Prokerala
      const prokeralaData = {
        'profile[datetime]': datetime,
        'profile[coordinates]': coordinates,
        'birth_time_unknown': !data.birthTimeKnown ? 'true' : 'false',
        'house_system': 'placidus',
        'orb': 'default',
        'birth_time_rectification': 'flat-chart',
        'aspect_filter': 'all',
        'la': 'es',
        'ayanamsa': '0' // Tropical
      };
      
      console.log('🔧 Datos procesados para Prokerala:', prokeralaData);
      
      // 5. Verificar contra expectativas
      const results: TestResult = {
        success: true,
        test_case: testCase.id,
        input: data,
        processed: {
          datetime,
          coordinates,
          timezone_offset: timezoneOffset,
          params: prokeralaData
        },
        verification: {
          datetime_correct: datetime === expected.datetime,
          coordinates_correct: !expected.coordinates || coordinates === expected.coordinates,
          timezone_correct: !expected.timezone_offset || timezoneOffset === expected.timezone_offset
        },
        warnings: []
      };
      
      // Verificación detallada
      if (!results.verification.datetime_correct) {
        console.error(`❌ DateTime incorrecto: esperado ${expected.datetime}, obtenido ${datetime}`);
      } else {
        console.log('✅ DateTime correcto');
      }
      
      if (!results.verification.coordinates_correct && expected.coordinates) {
        console.error(`❌ Coordenadas incorrectas: esperado ${expected.coordinates}, obtenido ${coordinates}`);
      } else {
        console.log('✅ Coordenadas correctas');
      }
      
      if (!results.verification.timezone_correct && expected.timezone_offset) {
        console.error(`❌ Timezone incorrecto: esperado ${expected.timezone_offset}, obtenido ${timezoneOffset}`);
      } else {
        console.log('✅ Timezone correcto');
      }
      
      // Añadir advertencias si es necesario
      if (!data.birthTimeKnown) {
        results.warnings.push('⚠️ Hora desconocida - usando mediodía como aproximación');
        results.warnings.push('⚠️ La precisión de la carta natal será limitada sin hora exacta');
      }
      
      if (data.inputMethod === 'location') {
        results.warnings.push('ℹ️ Ubicación geocodificada automáticamente');
      }
      
      // Advertencias sobre precisión de coordenadas
      if (data.inputMethod === 'coordinates') {
        const originalDecimals = {
          lat: data.latitude.toString().split('.')[1]?.length || 0,
          lng: data.longitude.toString().split('.')[1]?.length || 0
        };
        
        if (originalDecimals.lat > 4 || originalDecimals.lng > 4) {
          results.warnings.push(`ℹ️ Coordenadas redondeadas de ${originalDecimals.lat}/${originalDecimals.lng} decimales a 4 decimales`);
        }
      }
      
      results.success = results.verification.datetime_correct && 
                       results.verification.coordinates_correct && 
                       results.verification.timezone_correct;
      
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

  // Función para ejecutar todos los tests
  const runAllTests = async () => {
    console.log('🚀 Ejecutando todos los tests...\n');
    
    for (const testCase of testCases) {
      await runTest(testCase);
      // Pequeña pausa entre tests para ver los resultados
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('✅ Todos los tests completados');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          🧪 Test Completo de BirthDataForm
        </h1>
        <p className="text-center text-gray-300 mb-8">
          Verificación de coordenadas Google Maps y cálculo de timezones
        </p>
        
        {/* Panel informativo */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              Explicación de Tipos de Hora
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-400 mb-2">🕒 HL (Hora Local)</h3>
                <p className="text-gray-300">
                  La hora que marca el reloj en tu ciudad. Incluye cambios de horario verano/invierno.
                </p>
                <p className="text-blue-300 mt-2">
                  <strong>Ejemplo:</strong> 7:30 AM en Madrid
                </p>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="font-semibold text-green-400 mb-2">🌍 UT (Tiempo Universal)</h3>
                <p className="text-gray-300">
                  Hora estándar mundial (UTC/GMT). No cambia con las estaciones.
                </p>
                <p className="text-blue-300 mt-2">
                  <strong>Ejemplo:</strong> 6:30 UT (invierno)
                </p>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="font-semibold text-purple-400 mb-2">🌞 LMT (Tiempo Solar)</h3>
                <p className="text-gray-300">
                  Hora solar real del lugar. Usado históricamente antes de 1900.
                </p>
                <p className="text-blue-300 mt-2">
                  <strong>Ejemplo:</strong> Variable por ciudad
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-yellow-500/10 rounded-lg border border-yellow-400/30">
              <p className="text-yellow-300 text-sm">
                <strong>💡 Recomendación:</strong> Usa siempre <strong>HL (Hora Local)</strong> - es la hora 
                que aparecía en el reloj cuando naciste. El sistema calculará automáticamente el timezone correcto.
              </p>
            </div>
          </div>
        </div>

        {/* Panel de verificaciones */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-green-300 mb-4">✅ Qué verifican estos tests</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-green-400 mb-3">🔍 Verificaciones Principales:</h3>
                <ul className="space-y-2 text-green-200 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Cálculo correcto de timezone (invierno/verano)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Formateo de coordenadas Google Maps → Prokerala</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Formato datetime ISO 8601 con offset correcto</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Manejo de hora desconocida (mediodía + aviso)</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-emerald-400 mb-3">📊 Casos Especiales:</h3>
                <ul className="space-y-2 text-emerald-200 text-sm">
                  <li className="flex items-start">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Madrid: GMT+1 (invierno) / GMT+2 (verano)</span>
                  </li>
                  <li className="flex items-start">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Cambios de horario: último domingo marzo/octubre</span>
                  </li>
                  <li className="flex items-start">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Coordenadas: redondeo a 4 decimales máximo</span>
                  </li>
                  <li className="flex items-start">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Zonas sin DST: Argentina, Colombia, Perú</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Botón para ejecutar todos los tests */}
        <div className="text-center mb-8">
          <button
            onClick={runAllTests}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-purple-400 disabled:to-pink-400 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-105 disabled:scale-100 shadow-lg"
          >
            {loading ? '⏳ Ejecutando Tests...' : '🚀 Ejecutar Todos los Tests'}
          </button>
        </div>

        {/* Grid de casos de test */}
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6">
            {testCases.map((testCase) => (
              <div 
                key={testCase.id} 
                className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl shadow-xl p-6 border border-purple-400/30 backdrop-blur-sm hover:border-purple-400/50 transition-all"
              >
                <div className="flex items-start mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-lg">🧪</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{testCase.name}</h3>
                    <p className="text-gray-300 text-sm mt-1">{testCase.description}</p>
                  </div>
                </div>
                
                {/* Datos de entrada */}
                <div className="mb-4 p-4 bg-black/30 rounded-lg border border-gray-700">
                  <h4 className="font-semibold text-blue-300 text-sm mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Datos de Entrada
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">Fecha:</span>
                      <span className="text-white ml-2">{testCase.data.birthDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Hora:</span>
                      <span className="text-white ml-2">
                        {testCase.data.birthTime}
                        {!testCase.data.birthTimeKnown && ' ❓'}
                      </span>
                    </div>
                    {testCase.data.latitude !== undefined && (
                      <>
                        <div>
                          <span className="text-gray-400">Lat:</span>
                          <span className="text-white ml-2">{testCase.data.latitude}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Lng:</span>
                          <span className="text-white ml-2">{testCase.data.longitude}</span>
                        </div>
                      </>
                    )}
                    {testCase.data.birthPlace && (
                      <div className="col-span-2">
                        <span className="text-gray-400">Lugar:</span>
                        <span className="text-white ml-2">{testCase.data.birthPlace}</span>
                      </div>
                    )}
                    <div className="col-span-2">
                      <span className="text-gray-400">Timezone:</span>
                      <span className="text-white ml-2">{testCase.data.timezone || 'Europe/Madrid'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Expectativas */}
                <div className="mb-4 p-4 bg-green-900/20 rounded-lg border border-green-700">
                  <h4 className="font-semibold text-green-300 text-sm mb-3 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Resultado Esperado
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center">
                      <span className="text-green-400 font-medium">DateTime:</span>
                      <code className="text-green-200 ml-2 bg-black/50 px-2 py-0.5 rounded">
                        {testCase.expected.datetime}
                      </code>
                    </div>
                    {testCase.expected.coordinates && (
                      <div className="flex items-center">
                        <span className="text-green-400 font-medium">Coords:</span>
                        <code className="text-green-200 ml-2 bg-black/50 px-2 py-0.5 rounded">
                          {testCase.expected.coordinates}
                        </code>
                      </div>
                    )}
                    {testCase.expected.timezone_offset && (
                      <div className="flex items-center">
                        <span className="text-green-400 font-medium">Offset:</span>
                        <code className="text-green-200 ml-2 bg-black/50 px-2 py-0.5 rounded">
                          {testCase.expected.timezone_offset}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => runTest(testCase)}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-400 disabled:to-purple-400 text-white px-4 py-2 rounded-lg font-semibold transition-all text-sm transform hover:scale-[1.02] disabled:scale-100"
                >
                  {loading ? '⏳ Ejecutando Test...' : '▶️ Ejecutar Test'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Resultados del test */}
        {testResult && (
          <div className="mt-8 max-w-5xl mx-auto">
            <div className={`rounded-xl shadow-2xl p-6 border backdrop-blur-sm ${
              testResult.success 
                ? 'bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-400/50' 
                : 'bg-gradient-to-br from-red-900/50 to-pink-900/50 border-red-400/50'
            }`}>
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                {testResult.success ? (
                  <>
                    <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
                    <span className="text-green-300">Test Completado Exitosamente</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-8 h-8 text-red-400 mr-3" />
                    <span className="text-red-300">Test Fallido</span>
                  </>
                )}
              </h3>
              
              {/* Grid de verificaciones */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className={`rounded-lg p-4 ${
                  testResult.verification.datetime_correct 
                    ? 'bg-green-900/50 border border-green-600' 
                    : 'bg-red-900/50 border border-red-600'
                }`}>
                  <div className="flex items-center mb-2">
                    {testResult.verification.datetime_correct ? (
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                    )}
                    <span className="font-semibold">DateTime</span>
                  </div>
                  <code className="text-xs block bg-black/50 p-2 rounded">
                    {testResult.processed.datetime}
                  </code>
                </div>
                
                <div className={`rounded-lg p-4 ${
                  testResult.verification.coordinates_correct 
                    ? 'bg-green-900/50 border border-green-600' 
                    : 'bg-red-900/50 border border-red-600'
                }`}>
                  <div className="flex items-center mb-2">
                    {testResult.verification.coordinates_correct ? (
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                    )}
                    <span className="font-semibold">Coordenadas</span>
                  </div>
                  <code className="text-xs block bg-black/50 p-2 rounded">
                    {testResult.processed.coordinates}
                  </code>
                </div>
                
                <div className={`rounded-lg p-4 ${
                  testResult.verification.timezone_correct 
                    ? 'bg-green-900/50 border border-green-600' 
                    : 'bg-red-900/50 border border-red-600'
                }`}>
                  <div className="flex items-center mb-2">
                    {testResult.verification.timezone_correct ? (
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                    )}
                    <span className="font-semibold">Timezone</span>
                  </div>
                  <code className="text-xs block bg-black/50 p-2 rounded">
                    {testResult.processed.timezone_offset}
                  </code>
                </div>
              </div>
              
              {/* Advertencias */}
              {testResult.warnings.length > 0 && (
                <div className="mb-6 p-4 bg-yellow-900/30 rounded-lg border border-yellow-600">
                  <h4 className="font-semibold text-yellow-300 text-sm mb-3 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Advertencias
                  </h4>
                  <ul className="space-y-1">
                    {testResult.warnings.map((warning: string, i: number) => (
                      <li key={i} className="text-xs text-yellow-200 flex items-start">
                        <span className="mr-2">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Parámetros procesados para Prokerala */}
              <div className="mb-4 p-4 bg-purple-900/30 rounded-lg border border-purple-600">
                <h4 className="font-semibold text-purple-300 text-sm mb-3">
                  🔧 Parámetros Prokerala Generados
                </h4>
                <div className="grid md:grid-cols-2 gap-2 text-xs">
                  {Object.entries(testResult.processed.params).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="text-purple-400 font-mono">{key}:</span>
                      <span className="text-purple-200 ml-2 font-mono">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Datos completos */}
              <details className="mt-4">
                <summary className="cursor-pointer font-semibold text-gray-300 text-sm hover:text-white transition-colors">
                  Ver datos procesados completos (JSON)
                </summary>
                <pre className="text-xs text-gray-300 mt-3 overflow-auto max-h-64 bg-black/50 p-4 rounded-lg border border-gray-700">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-red-900/50 to-pink-900/50 border border-red-400/50 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-red-300 mb-2 flex items-center">
                <AlertCircle className="w-6 h-6 mr-2" />
                Error en Test
              </h3>
              <p className="text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Panel de ejemplo de uso */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-purple-300 mb-4">
              💡 Cómo usar este test
            </h2>
            
            <div className="space-y-4 text-sm text-purple-200">
              <div>
                <h3 className="font-semibold text-purple-400 mb-2">1. Ejecutar tests individuales:</h3>
                <p>Haz clic en "Ejecutar Test" en cada tarjeta para verificar un caso específico.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-purple-400 mb-2">2. Ejecutar todos los tests:</h3>
                <p>Usa el botón "Ejecutar Todos los Tests" para una verificación completa.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-purple-400 mb-2">3. Verificar resultados:</h3>
                <ul className="ml-4 space-y-1">
                  <li>• ✅ Verde = Cálculo correcto</li>
                  <li>• ❌ Rojo = Error en el cálculo</li>
                  <li>• ⚠️ Amarillo = Advertencias (no errores)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-purple-400 mb-2">4. Casos especiales a verificar:</h3>
                <ul className="ml-4 space-y-1">
                  <li>• Cambios de horario (marzo/octubre)</li>
                  <li>• Coordenadas con muchos decimales</li>
                  <li>• Zonas sin cambio de horario</li>
                  <li>• Hora desconocida de nacimiento</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}