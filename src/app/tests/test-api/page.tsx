// src/app/test-api/page.tsx - PÁGINA DE PRUEBA COMPLETA
'use client';

import { useState } from 'react';

export default function TestAPIPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<string | null>(null);

  // 🧪 Test 1: API Prokerala Corregida (la que funciona)
  const testProkeralaAPI = async () => {
    setLoading('prokerala');
    try {
      console.log('🧪 === PROBANDO /api/prokerala/natal-chart ===');
      
      const response = await fetch('/api/prokerala/natal-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: '1974-02-10',
          birthTime: '07:30:00', 
          latitude: 40.4164,
          longitude: -3.7025,
          timezone: 'Europe/Madrid'
        })
      });

      const data = await response.json();
      
      console.log('📊 Respuesta Prokerala:', data);
      
      setResults((prev: any) => ({
        ...prev,
        prokerala: {
          success: data.success,
          ascendant: data.data?.ascendant,
          sol: data.data?.planets?.find((p: any) => p.name === 'Sol'),
          debug: data.debug,
          url_generada: data.debug?.url_generated,
          timezone_usado: data.debug?.timezone_used,
          datetime_enviado: data.debug?.datetime_sent,
          es_correcto: data.data?.ascendant?.sign === 'Acuario'
        }
      }));
      
    } catch (error) {
      console.error('❌ Error Prokerala:', error);
      setResults((prev: any) => ({
        ...prev,
        prokerala: { error: error instanceof Error ? error.message : 'Error desconocido' }
      }));
    } finally {
      setLoading(null);
    }
  };

  // 🧪 Test 2: API Charts/Natal (la que usa el frontend)
  const testChartsAPI = async () => {
    setLoading('charts');
    try {
      console.log('🧪 === PROBANDO /api/charts/natal ===');
      
      // Simular user ID (puedes cambiar esto por tu user ID real)
      const userId = 'test-user-veronica';
      
      const response = await fetch('/api/charts/natal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          regenerate: true // Forzar regeneración
        })
      });

      const data = await response.json();
      
      console.log('📊 Respuesta Charts:', data);
      
      setResults((prev: typeof results) => ({
        ...prev,
        charts: {
          success: data.success,
          ascendant: data.natalChart?.ascendant,
          sol: data.natalChart?.planets?.find((p: any) => p.name === 'Sol'),
          error: data.error,
          es_correcto: data.natalChart?.ascendant?.sign === 'Acuario'
        }
      }));
      
    } catch (error) {
      console.error('❌ Error Charts:', error);
      setResults((prev: any) => ({
        ...prev,
        charts: { error: error instanceof Error ? error.message : 'Error desconocido' }
      }));
    } finally {
      setLoading(null);
    }
  };

  // 🧪 Test 3: Verificar datos de nacimiento en BD
  const testBirthData = async () => {
    setLoading('birthdata');
    try {
      console.log('🧪 === VERIFICANDO DATOS DE NACIMIENTO ===');
      
      // Usar tu user ID real aquí (mira en localStorage o en la consola)
      const userId = localStorage.getItem('user') ? 
        JSON.parse(localStorage.getItem('user') || '{}').uid : 
        'test-user';
      
      const response = await fetch(`/api/birth-data?userId=${userId}`);
      const data = await response.json();
      
      console.log('📊 Datos de nacimiento:', data);
      
      if (!data.success || !data.data) {
        alert('No hay datos de nacimiento guardados. Por favor, ingresa tus datos.');
      }
      
      setResults((prev: any) => ({
        ...prev,
        birthdata: {
          success: data.success,
          data: data.data,
          es_veronica: data.data?.birthDate === '1974-02-10T00:00:00.000Z' || data.data?.birthDate === '1974-02-10'
        }
      }));
      
    } catch (error) {
      console.error('❌ Error Birth Data:', error);
      setResults((prev: any) => ({
        ...prev,
        birthdata: { error: error instanceof Error ? error.message : 'Error desconocido' }
      }));
    } finally {
      setLoading(null);
    }
  };

  // 🧪 Test 4: Crear datos de Verónica directamente
  const createVeronicaData = async () => {
    setLoading('create');
    try {
      console.log('🧪 === CREANDO DATOS DE VERÓNICA ===');
      
      const userId = localStorage.getItem('user') ? 
        JSON.parse(localStorage.getItem('user') || '{}').uid : 
        'test-user';
      
      // Crear datos de nacimiento de Verónica
      const response = await fetch('/api/birth-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          birthDate: '1974-02-10',
          birthTime: '07:30:00',
          birthPlace: 'Madrid, España',
          latitude: 40.4164,
          longitude: -3.7025,
          timezone: 'Europe/Madrid'
        })
      });

      const data = await response.json();
      
      console.log('📊 Datos creados:', data);
      
      setResults((prev: any) => ({
        ...prev,
        create: {
          success: data.success,
          message: data.message,
          error: data.error
        }
      }));
      
    } catch (error) {
      console.error('❌ Error Create:', error);
      setResults((prev: any) => ({
        ...prev,
        create: { error: error instanceof Error ? error.message : 'Error desconocido' }
      }));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">🧪 Diagnóstico de API</h1>
          <p className="text-gray-300">
            Probemos todas las APIs para encontrar dónde está el problema
          </p>
        </div>

        {/* Botones de prueba */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={testProkeralaAPI}
            disabled={loading === 'prokerala'}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 p-4 rounded-lg"
          >
            {loading === 'prokerala' ? '⏳' : '🔵'} Prokerala API
          </button>
          
          <button
            onClick={testChartsAPI}
            disabled={loading === 'charts'}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 p-4 rounded-lg"
          >
            {loading === 'charts' ? '⏳' : '🟢'} Charts API
          </button>
          
          <button
            onClick={testBirthData}
            disabled={loading === 'birthdata'}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 p-4 rounded-lg"
          >
            {loading === 'birthdata' ? '⏳' : '🟡'} Birth Data
          </button>
          
          <button
            onClick={createVeronicaData}
            disabled={loading === 'create'}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 p-4 rounded-lg"
          >
            {loading === 'create' ? '⏳' : '🟣'} Crear Verónica
          </button>
        </div>

        {/* Resultados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Resultado Prokerala API */}
          {results.prokerala && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-blue-400">
                🔵 API Prokerala (Corregida)
              </h3>
              
              {results.prokerala.error ? (
                <div className="text-red-400">❌ Error: {results.prokerala.error}</div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Estado:</span>
                    <span className={results.prokerala.success ? 'text-green-400' : 'text-red-400'}>
                      {results.prokerala.success ? '✅ Éxito' : '❌ Error'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Ascendente:</span>
                    <span className={results.prokerala.es_correcto ? 'text-green-400' : 'text-red-400'}>
                      {results.prokerala.ascendant?.sign || 'N/A'} 
                      {results.prokerala.es_correcto ? ' ✅' : ' ❌'}
                    </span>
                  </div>
                  
                  {results.prokerala.sol && (
                    <div className="flex justify-between">
                      <span>Sol:</span>
                      <span className="text-yellow-400">
                        {results.prokerala.sol.sign} {results.prokerala.sol.degree}°
                      </span>
                    </div>
                  )}
                  
                  {results.prokerala.datetime_enviado && (
                    <div className="text-xs mt-4 p-3 bg-black/20 rounded">
                      <div><strong>DateTime:</strong> {results.prokerala.datetime_enviado}</div>
                      <div><strong>Timezone:</strong> {results.prokerala.timezone_usado}</div>
                      <div><strong>Esperado:</strong> 1974-02-10T07:30:00+01:00</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Resultado Charts API */}
          {results.charts && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-green-400">
                🟢 API Charts (Frontend)
              </h3>
              
              {results.charts.error ? (
                <div className="text-red-400">❌ Error: {results.charts.error}</div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Estado:</span>
                    <span className={results.charts.success ? 'text-green-400' : 'text-red-400'}>
                      {results.charts.success ? '✅ Éxito' : '❌ Error'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Ascendente:</span>
                    <span className={results.charts.es_correcto ? 'text-green-400' : 'text-red-400'}>
                      {results.charts.ascendant?.sign || 'N/A'} 
                      {results.charts.es_correcto ? ' ✅' : ' ❌'}
                    </span>
                  </div>
                  
                  {results.charts.sol && (
                    <div className="flex justify-between">
                      <span>Sol:</span>
                      <span className="text-yellow-400">
                        {results.charts.sol.sign} {results.charts.sol.degree}°
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Resultado Birth Data */}
          {results.birthdata && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-yellow-400">
                🟡 Datos de Nacimiento
              </h3>
              
              {results.birthdata.error ? (
                <div className="text-red-400">❌ Error: {results.birthdata.error}</div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Encontrados:</span>
                    <span className={results.birthdata.success ? 'text-green-400' : 'text-red-400'}>
                      {results.birthdata.success ? '✅ Sí' : '❌ No'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Es Verónica:</span>
                    <span className={results.birthdata.es_veronica ? 'text-green-400' : 'text-red-400'}>
                      {results.birthdata.es_veronica ? '✅ Sí' : '❌ No'}
                    </span>
                  </div>
                  
                  {results.birthdata.data && (
                    <div className="text-xs mt-4 p-3 bg-black/20 rounded">
                      <div><strong>Fecha:</strong> {results.birthdata.data.birthDate}</div>
                      <div><strong>Hora:</strong> {results.birthdata.data.birthTime}</div>
                      <div><strong>Lugar:</strong> {results.birthdata.data.birthPlace}</div>
                      <div><strong>Coords:</strong> {results.birthdata.data.latitude}, {results.birthdata.data.longitude}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Resultado Create */}
          {results.create && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-purple-400">
                🟣 Crear Datos Verónica
              </h3>
              
              {results.create.error ? (
                <div className="text-red-400">❌ Error: {results.create.error}</div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Estado:</span>
                    <span className={results.create.success ? 'text-green-400' : 'text-red-400'}>
                      {results.create.success ? '✅ Creado' : '❌ Error'}
                    </span>
                  </div>
                  
                  {results.create.message && (
                    <div className="text-gray-300 text-sm">
                      {results.create.message}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Diagnóstico */}
        <div className="bg-gray-800/50 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">🔍 Diagnóstico</h3>
          
          <div className="space-y-2 text-sm">
            {results.prokerala?.es_correcto && (
              <div className="text-green-400">✅ API Prokerala funciona correctamente (ASC: Acuario)</div>
            )}
            
            {results.charts?.es_correcto === false && (
              <div className="text-red-400">❌ API Charts aún devuelve ASC incorrecto</div>
            )}
            
            {results.birthdata?.es_veronica === false && (
              <div className="text-yellow-400">⚠️ Los datos guardados no son de Verónica</div>
            )}
            
            {!results.birthdata?.success && (
              <div className="text-red-400">❌ No hay datos de nacimiento guardados</div>
            )}
          </div>
          
          <div className="mt-6 p-4 bg-black/20 rounded text-xs">
            <strong>Pasos para arreglar:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Verificar que API Prokerala devuelve ASC: Acuario ✅</li>
              <li>Crear/actualizar datos de nacimiento de Verónica</li>
              <li>Verificar que API Charts usa la API Prokerala corregida</li>
              <li>Limpiar caché de cartas guardadas</li>
              <li>Regenerar carta natal</li>
            </ol>
          </div>
        </div>

        {/* Logs en vivo */}
        <div className="bg-black/30 rounded-xl p-4">
          <h4 className="font-bold mb-2">📊 Ver logs en tiempo real:</h4>
          <p className="text-sm text-gray-400">
            Abre la consola del navegador (F12) para ver logs detallados de cada prueba.
          </p>
        </div>
      </div>
    </div>
  );
}