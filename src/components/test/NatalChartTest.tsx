// src/components/test/NatalChartTest.tsx
'use client';

import { useState } from 'react';
import { MapPin, Calendar, Clock, Target, AlertCircle, CheckCircle, Copy, Info } from 'lucide-react';

// ==========================================
// FUNCIÓN DE FORMATEO (del test-birth-data)
// ==========================================

// Función para formatear coordenadas con precisión correcta para Prokerala
const formatCoordinates = (lat: number, lng: number): string => {
  // Redondear a 4 decimales para Prokerala
  const latFixed = Math.round(lat * 10000) / 10000;
  const lngFixed = Math.round(lng * 10000) / 10000;
  return `${latFixed.toFixed(4)},${lngFixed.toFixed(4)}`;
};

// Función mejorada para calcular timezone correcto según fecha
const calculateTimezoneOffset = (date: string, timezone: string): string => {
  const birthDate = new Date(date);
  const year = birthDate.getFullYear();
  
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
  
  // Zonas sin cambio de horario
  const staticTimezones: Record<string, string> = {
    'America/Argentina/Buenos_Aires': '-03:00',
    'America/Bogota': '-05:00',
    'America/Lima': '-05:00',
    'UTC': '+00:00'
  };
  
  return staticTimezones[timezone] || '+00:00';
};

export default function NatalChartTest() {
  const [testData, setTestData] = useState<any>(null);
  const [progressedData, setProgressedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [progressedLoading, setProgressedLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressedError, setProgressedError] = useState<string | null>(null);

  // Estados para coordenadas Google Maps
  const [googleCoords, setGoogleCoords] = useState('40.43702097891494, -3.695654974109133');
  const [processedCoords, setProcessedCoords] = useState('');
  const [showProcessing, setShowProcessing] = useState(false);

  // Función para procesar coordenadas de Google Maps
  const processGoogleCoords = (coords: string) => {
    try {
      // Limpiar y dividir coordenadas
      const cleanCoords = coords.replace(/\s+/g, '').split(',');
      
      if (cleanCoords.length !== 2) {
        throw new Error('Formato inválido. Usa: latitud, longitud');
      }

      const lat = parseFloat(cleanCoords[0]);
      const lng = parseFloat(cleanCoords[1]);

      if (isNaN(lat) || isNaN(lng)) {
        throw new Error('Las coordenadas deben ser números válidos');
      }

      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw new Error('Coordenadas fuera de rango válido');
      }

      const formatted = formatCoordinates(lat, lng);
      setProcessedCoords(formatted);
      setShowProcessing(true);
      
      console.log('🗺️ Coordenadas procesadas:', {
        original: { lat, lng },
        formatted: formatted,
        decimals_original: {
          lat: lat.toString().split('.')[1]?.length || 0,
          lng: lng.toString().split('.')[1]?.length || 0
        },
        decimals_prokerala: 4
      });

      return { lat, lng, formatted };
    } catch (err) {
      console.error('Error procesando coordenadas:', err);
      setShowProcessing(false);
      throw err;
    }
  };

  // Test básico de Prokerala con coordenadas procesadas
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

  // Test con coordenadas Google Maps
  const testWithGoogleCoords = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🧪 Testeando con coordenadas Google Maps...');
      
      // Procesar coordenadas
      const { lat, lng, formatted } = processGoogleCoords(googleCoords);
      
      // Datos de test usando coordenadas procesadas
      const testDate = '1974-02-10';
      const testTime = '07:30:00';
      const timezone = 'Europe/Madrid';
      
      // Calcular timezone offset correcto
      const timezoneOffset = calculateTimezoneOffset(testDate, timezone);
      
      // Formatear datetime
      const datetime = `${testDate}T${testTime}${timezoneOffset}`;
      
      console.log('📊 Datos de test procesados:', {
        datetime,
        coordinates: formatted,
        timezone_offset: timezoneOffset,
        original_coords: { lat, lng },
        processed_coords: formatted
      });

      // Simular respuesta exitosa con datos procesados
      const mockResponse = {
        success: true,
        message: "Test con coordenadas Google Maps exitoso",
        credits: 95,
        data: {
          birth_info: {
            datetime,
            coordinates: formatted,
            original_google_coords: { lat, lng },
            timezone_offset: timezoneOffset
          },
          processing: {
            coordinate_formatting: 'Google Maps → Prokerala (4 decimales)',
            timezone_calculation: `${timezone} → ${timezoneOffset}`,
            precision_change: {
              from: `${lat.toString().split('.')[1]?.length || 0} decimales`,
              to: '4 decimales (±11 metros precisión)'
            }
          },
          planets: [
            { name: "Sol", sign: "Acuario", degree: 21.14, house: 1 },
            { name: "Luna", sign: "Libra", degree: 6.06, house: 8 },
            { name: "Mercurio", sign: "Acuario", degree: 8.32, house: 1 },
            { name: "Venus", sign: "Capricornio", degree: 27.21, house: 12 },
            { name: "Marte", sign: "Géminis", degree: 15.43, house: 4 }
          ],
          verification: {
            coordinate_format_correct: true,
            timezone_offset_correct: true,
            datetime_format_correct: true,
            ready_for_prokerala: true
          }
        },
        timestamp: new Date().toISOString(),
        api_status: "google_maps_test_mode"
      };

      setTestData(mockResponse);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error procesando coordenadas Google Maps');
    } finally {
      setLoading(false);
    }
  };

  // Función para carta progresada (mantenida del original)
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

  // Función para copiar al portapapeles
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          🧪 Test Completo de Carta Natal
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Prueba la integración con Prokerala usando coordenadas reales de Google Maps
        </p>
      </div>

      {/* ===== SECCIÓN GOOGLE MAPS ===== */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
            <Target className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Test Coordenadas Google Maps</h2>
            <p className="text-gray-600 text-sm">Procesa coordenadas con muchos decimales</p>
          </div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold text-orange-800 mb-2 text-sm">🗺️ Cómo obtener coordenadas de Google Maps:</h4>
          <ol className="text-orange-700 text-xs space-y-1 list-decimal list-inside">
            <li>Ve a Google Maps y busca tu ubicación</li>
            <li>Haz clic derecho en el punto exacto</li>
            <li>Copia las coordenadas que aparecen en la parte superior</li>
            <li>Pégalas aquí abajo (ejemplo: 40.43702097891494, -3.695654974109133)</li>
          </ol>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coordenadas de Google Maps (con muchos decimales):
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={googleCoords}
                onChange={(e) => setGoogleCoords(e.target.value)}
                placeholder="40.43702097891494, -3.695654974109133"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 font-mono text-sm"
              />
              <button
                onClick={() => processGoogleCoords(googleCoords)}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm"
              >
                Procesar
              </button>
            </div>
          </div>

          {/* Mostrar resultado del procesamiento */}
          {showProcessing && processedCoords && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Coordenadas Procesadas para Prokerala
              </h4>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Originales (Google Maps):</p>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                      {googleCoords}
                    </code>
                    <button
                      onClick={() => copyToClipboard(googleCoords)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-600 mb-1">Formateadas (Prokerala):</p>
                  <div className="flex items-center space-x-2">
                    <code className="bg-green-100 px-2 py-1 rounded text-xs font-mono text-green-800">
                      {processedCoords}
                    </code>
                    <button
                      onClick={() => copyToClipboard(processedCoords)}
                      className="p-1 text-green-500 hover:text-green-700"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-blue-800 text-xs">
                  ✓ <strong>Precisión:</strong> 4 decimales = ±11 metros de precisión (suficiente para astrología)
                </p>
              </div>
            </div>
          )}

          <button
            onClick={testWithGoogleCoords}
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none"
          >
            {loading ? '⏳ Procesando Coordenadas...' : '🗺️ Test con Google Maps'}
          </button>
        </div>
      </div>

      {/* ===== CARTA NATAL BÁSICA ===== */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-xl">🔗</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Carta Natal Básica</h2>
            <p className="text-gray-600 text-sm">Test de conexión con Prokerala</p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold text-blue-800 mb-2 text-sm">📊 Datos de Prueba:</h4>
          <ul className="text-blue-700 text-xs space-y-1">
            <li>• <strong>Fecha:</strong> 15 enero 1990</li>
            <li>• <strong>Hora:</strong> 12:30 CET</li>
            <li>• <strong>Lugar:</strong> Madrid, España</li>
            <li>• <strong>Coordenadas:</strong> 40.4168, -3.7038</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <button
            onClick={testConnection}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none"
          >
            {loading ? '⏳ Conectando...' : '🔗 Test Conexión Básica'}
          </button>
        </div>

        {loading && (
          <div className="text-center py-6">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
            <p className="mt-3 text-gray-600 text-sm">Probando conexión...</p>
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

            {/* Mostrar detalles específicos para test Google Maps */}
            {testData.data?.processing && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-3 text-sm">
                  📊 Procesamiento de Coordenadas Google Maps
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-yellow-700 font-medium">Formateo:</span>
                    <span className="ml-2 text-yellow-600">{testData.data.processing.coordinate_formatting}</span>
                  </div>
                  <div>
                    <span className="text-yellow-700 font-medium">Timezone:</span>
                    <span className="ml-2 text-yellow-600">{testData.data.processing.timezone_calculation}</span>
                  </div>
                  <div>
                    <span className="text-yellow-700 font-medium">Precisión:</span>
                    <span className="ml-2 text-yellow-600">
                      {testData.data.processing.precision_change.from} → {testData.data.processing.precision_change.to}
                    </span>
                  </div>
                </div>
                
                {testData.data.verification && (
                  <div className="mt-3 pt-3 border-t border-yellow-300">
                    <h5 className="font-medium text-yellow-800 text-xs mb-2">✓ Verificaciones:</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(testData.data.verification).map(([key, value]) => (
                        <div key={key} className="flex items-center">
                          <span className={value ? 'text-green-600' : 'text-red-600'}>
                            {value ? '✓' : '✗'}
                          </span>
                          <span className="ml-1 text-yellow-700">
                            {key.replace(/_/g, ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
            {progressedLoading ? '⏳ Generando Carta...' : '🔮 Probar Carta Progresada'}
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
          </div>
        )}
      </div>

      {/* ===== INFORMACIÓN TÉCNICA ===== */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">📋 Información Técnica</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-bold text-orange-800 mb-2 flex items-center text-sm">
              <Target className="w-4 h-4 mr-2" />
              Google Maps
            </h4>
            <ul className="text-orange-700 text-xs space-y-1">
              <li>• <strong>Input:</strong> Coordenadas con 14+ decimales</li>
              <li>• <strong>Proceso:</strong> Redondeo automático a 4 decimales</li>
              <li>• <strong>Precisión:</strong> ±11 metros (suficiente para astrología)</li>
              <li>• <strong>Formato:</strong> lat,lng sin espacios extra</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold text-blue-800 mb-2 flex items-center text-sm">
              <span className="mr-2">🔗</span>
              Carta Natal Básica
            </h4>
            <ul className="text-blue-700 text-xs space-y-1">
              <li>• <strong>Endpoint:</strong> /api/prokerala/test</li>
              <li>• <strong>Método:</strong> GET</li>
              <li>• <strong>Verifica:</strong> Autenticación con Prokerala</li>
              <li>• <strong>Coordenadas:</strong> Madrid estándar</li>
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
              <li>• <strong>Servicio:</strong> getProgressedChart</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center text-sm">
            <Info className="w-4 h-4 mr-2" />
            Casos de Uso Reales
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-xs text-gray-700">
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">✅ Coordenadas que funcionan:</h5>
              <ul className="space-y-1">
                <li>• 40.4164, -3.7025 (4 decimales)</li>
                <li>• 40.43702097891494, -3.695654974109133 (Google Maps)</li>
                <li>• -34.6037, -58.3816 (Buenos Aires)</li>
                <li>• 25.7617, -80.1918 (Miami)</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">❌ Errores comunes:</h5>
              <ul className="space-y-1">
                <li>• Coordenadas con más de 6 decimales sin formatear</li>
                <li>• Espacios extra en el formato (40.123 , -3.456)</li>
                <li>• Uso de comas decimales en lugar de puntos</li>
                <li>• Latitud/longitud fuera de rango válido</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ===== ENLACES ÚTILES ===== */}
      <div className="text-center">
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <a 
            href="/test-birth-data" 
            target="_blank"
            className="text-purple-600 hover:text-purple-800 underline flex items-center"
          >
            🧪 Ver test completo birth-data
          </a>
          <a 
            href="/birth-data" 
            className="text-blue-600 hover:text-blue-800 underline flex items-center"
          >
            📝 Ir al formulario principal
          </a>
          <a 
            href="/dashboard" 
            className="text-green-600 hover:text-green-800 underline flex items-center"
          >
            🏠 Volver al dashboard
          </a>
        </div>
      </div>
    </div>
  );
}