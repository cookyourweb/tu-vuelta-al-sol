// src/app/test-prokerala/page.tsx
'use client';

import React, { useState } from 'react';

const ProkeralaTestPage = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Datos de prueba (Verónica - Madrid)
  const testData = {
    birthDate: '1974-02-10',
    birthTime: '07:30:00',
    latitude: 40.4168,
    longitude: -3.7038,
    timezone: 'Europe/Madrid'
  };

  const testNatalChart = async () => {
    setLoading(true);
    addLog('🌟 Iniciando test de carta natal...');
    
    try {
      addLog(`📅 Datos: ${testData.birthDate} ${testData.birthTime} en ${testData.latitude}, ${testData.longitude}`);
      
      const response = await fetch('/api/prokerala/natal-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      addLog(`📡 Respuesta HTTP: ${response.status}`);
      
      const data = await response.json();
      
      if (data.success) {
        addLog('✅ Carta natal obtenida exitosamente');
        addLog(`🔺 Ascendente: ${data.data?.ascendant?.sign || 'No encontrado'}`);
        addLog(`🪐 Planetas: ${data.data?.planets?.length || 0}`);
        addLog(`🏠 Casas: ${data.data?.houses?.length || 0}`);
        
        setResults({
          ...results,
          natal: {
            success: true,
            ascendant: data.data?.ascendant?.sign,
            planetsCount: data.data?.planets?.length,
            fallback: data.fallback
          }
        });
      } else {
        addLog(`❌ Error: ${data.error}`);
        setResults({
          ...results,
          natal: { success: false, error: data.error }
        });
      }
    } catch (error) {
      addLog(`❌ Error de conexión: ${error.message}`);
      setResults({
        ...results,
        natal: { success: false, error: error.message }
      });
    } finally {
      setLoading(false);
    }
  };

  const testDirectProkerala = async () => {
    setLoading(true);
    addLog('🌐 Probando URL directa de Prokerala...');
    
    try {
      // URL exacta de tu documentación
      const prokeralaUrl = 'https://api.prokerala.com/v2/astrology/natal-chart?profile[datetime]=1974-02-10T07:30:00%2B01:00&profile[coordinates]=40.4168,-3.7038&profile[birth_time_unknown]=false&house_system=placidus&orb=default&birth_time_rectification=flat-chart&aspect_filter=all&la=es&ayanamsa=0';
      
      addLog(`🌐 URL: ${prokeralaUrl.substring(0, 100)}...`);
      
      // Nota: Esto no funcionará desde el browser debido a CORS
      // Pero podemos probar nuestro endpoint que debería generar esta URL
      
      addLog('📝 Comparando con nuestra implementación...');
      
      setResults({
        ...results,
        directTest: {
          success: false,
          message: 'Test directo no disponible desde browser (CORS). Usa el test de natal chart.'
        }
      });
      
    } catch (error) {
      addLog(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setResults({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            🔮 Test Prokerala API
          </h1>

          {/* Datos de prueba */}
          <div className="bg-black/20 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              📅 Datos de Prueba (Verónica - Madrid)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div><strong>Fecha:</strong> {testData.birthDate}</div>
              <div><strong>Hora:</strong> {testData.birthTime}</div>
              <div><strong>Timezone:</strong> {testData.timezone}</div>
              <div><strong>Latitud:</strong> {testData.latitude}</div>
              <div><strong>Longitud:</strong> {testData.longitude}</div>
              <div className="col-span-2 md:col-span-1"><strong>Esperado ASC:</strong> <span className="text-yellow-300">Acuario</span></div>
            </div>
          </div>

          {/* Botones de test */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={testNatalChart}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? '⏳ Probando...' : '🌟 Test Carta Natal'}
            </button>
            
            <button
              onClick={testDirectProkerala}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? '⏳ Probando...' : '🌐 Test URL Directa'}
            </button>
            
            <button
              onClick={clearLogs}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:from-gray-600 hover:to-gray-700 transition-all"
            >
              🗑️ Limpiar Logs
            </button>
          </div>

          {/* Resultados */}
          {Object.keys(results).length > 0 && (
            <div className="bg-black/20 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3">📊 Resultados</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {results.natal && (
                  <div className="bg-blue-500/20 rounded-lg p-3">
                    <h4 className="font-semibold text-blue-300 mb-2">🌟 Carta Natal</h4>
                    {results.natal.success ? (
                      <div className="space-y-1 text-sm">
                        <div className="text-green-300">✅ Exitoso</div>
                        <div>🔺 ASC: <strong className={results.natal.ascendant === 'Acuario' ? 'text-green-300' : 'text-red-300'}>{results.natal.ascendant || 'N/A'}</strong></div>
                        <div>🪐 Planetas: <strong>{results.natal.planetsCount || 0}</strong></div>
                        {results.natal.fallback && (
                          <div className="text-yellow-300">⚠️ Usando datos simulados</div>
                        )}
                        {results.natal.ascendant === 'Acuario' && (
                          <div className="text-green-300 font-semibold">🎉 ¡Correcto! Ascendente esperado</div>
                        )}
                      </div>
                    ) : (
                      <div className="text-red-300">❌ Error: {results.natal.error}</div>
                    )}
                  </div>
                )}
                
                {results.directTest && (
                  <div className="bg-green-500/20 rounded-lg p-3">
                    <h4 className="font-semibold text-green-300 mb-2">🌐 Test Directo</h4>
                    <div className="text-sm text-gray-300">
                      {results.directTest.message}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Logs */}
          {logs.length > 0 && (
            <div className="bg-black/30 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                📋 Logs de Debug
              </h3>
              <div className="space-y-1 text-sm font-mono max-h-80 overflow-y-auto bg-black/40 rounded p-3">
                {logs.map((log, index) => (
                  <div key={index} className="text-gray-300">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* URL de referencia */}
          <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-4">
            <h4 className="text-yellow-300 font-semibold mb-2">📌 URL de Referencia Prokerala</h4>
            <div className="text-xs font-mono text-gray-300 break-all bg-black/30 rounded p-2">
              https://api.prokerala.com/v2/astrology/natal-chart?profile[datetime]=1974-02-10T07:30:00%2B01:00&profile[coordinates]=40.4168,-3.7038&profile[birth_time_unknown]=false&house_system=placidus&orb=default&birth_time_rectification=flat-chart&aspect_filter=all&la=es&ayanamsa=0
            </div>
            <div className="text-yellow-200 text-sm mt-2">
              ✅ <strong>Esperado:</strong> ASC en Acuario | 🪐 Planetas: ~10-13 | 🏠 Casas: 12
            </div>
          </div>

          {/* Navegación de vuelta */}
          <div className="mt-6 text-center">
            <a 
              href="/dashboard" 
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              ← Volver al Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProkeralaTestPage;