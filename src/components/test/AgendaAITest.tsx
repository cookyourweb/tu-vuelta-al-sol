// src/components/test/AgendaAITest.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface AgendaTestResult {
  success: boolean;
  data?: {
    agenda?: any;
    agenda_texto?: string;
    metadata?: {
      generado_en: string;
      usuario: string;
      edad: number;
      tokens_utilizados: number;
      costo_estimado: string;
      tiene_carta_natal: boolean;
      tiene_carta_progresada: boolean;
    };
  };
  error?: string;
  message?: string;
  action?: string;
}

export default function AgendaAITest() {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState<AgendaTestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAgendaGeneration = async () => {
    if (!user?.uid) {
      setError('Usuario no autenticado');
      return;
    }

    setLoading(true);
    setError(null);
    setTestResult(null);
    
    try {
      console.log('🧪 Iniciando test de generación de agenda IA...');
      
      const response = await fetch('/api/astrology/generate-agenda-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.uid,
          regenerate: true // Forzar regeneración para test
        })
      });
      
      const data: AgendaTestResult = await response.json();
      setTestResult(data);
      
      if (data.success) {
        console.log('✅ Agenda generada exitosamente:', data);
      } else {
        console.error('❌ Error en generación:', data.error);
        setError(data.error || 'Error desconocido');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      console.error('❌ Error en test:', err);
    } finally {
      setLoading(false);
    }
  };

  const testEndpointStatus = async () => {
    try {
      const response = await fetch('/api/astrology/generate-agenda-ai');
      const data = await response.json();
      console.log('🔍 Estado del endpoint:', data);
      alert('Estado del endpoint mostrado en consola');
    } catch (err) {
      console.error('❌ Error verificando endpoint:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🧪 Test de Agenda Astrológica IA
      </h2>
      
      {/* Información del usuario */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">👤 Usuario Actual:</h3>
        <p><strong>UID:</strong> {user?.uid || 'No autenticado'}</p>
        <p><strong>Email:</strong> {user?.email || 'No disponible'}</p>
        <p><strong>Nombre:</strong> {user?.displayName || 'No disponible'}</p>
      </div>

      {/* Botones de test */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={testAgendaGeneration}
          disabled={loading || !user?.uid}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Generando...
            </>
          ) : (
            '🔮 Generar Agenda IA'
          )}
        </button>
        
        <button
          onClick={testEndpointStatus}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          🔍 Verificar Estado
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-2">❌ Error:</h4>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Resultado */}
      {testResult && (
        <div className="space-y-6">
          {/* Estado general */}
          <div className={`p-4 rounded-lg border ${testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h3 className={`font-semibold mb-2 ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
              {testResult.success ? '✅ Éxito' : '❌ Error'}
            </h3>
            <p className={testResult.success ? 'text-green-700' : 'text-red-700'}>
              {testResult.message}
            </p>
            
            {testResult.action && (
              <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded">
                <p className="text-yellow-800"><strong>Acción requerida:</strong> {testResult.action}</p>
                {testResult.action === 'redirect_to_birth_data' && (
                  <a href="/birth-data" className="text-blue-600 hover:underline">
                    → Ir a configurar datos de nacimiento
                  </a>
                )}
                {testResult.action === 'redirect_to_natal_chart' && (
                  <a href="/natal-chart" className="text-blue-600 hover:underline">
                    → Ir a generar carta natal
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Metadatos */}
          {testResult.success && testResult.data?.metadata && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">📊 Metadatos:</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Usuario:</strong> {testResult.data.metadata.usuario}</p>
                  <p><strong>Edad:</strong> {testResult.data.metadata.edad} años</p>
                  <p><strong>Generado:</strong> {new Date(testResult.data.metadata.generado_en).toLocaleString()}</p>
                </div>
                <div>
                  <p><strong>Tokens usados:</strong> {testResult.data.metadata.tokens_utilizados}</p>
                  <p><strong>Costo estimado:</strong> {testResult.data.metadata.costo_estimado}</p>
                  <p><strong>Carta natal:</strong> {testResult.data.metadata.tiene_carta_natal ? '✅' : '❌'}</p>
                  <p><strong>Carta progresada:</strong> {testResult.data.metadata.tiene_carta_progresada ? '✅' : '❌'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Agenda generada */}
          {testResult.success && testResult.data?.agenda && (
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">🌟 Agenda Generada:</h4>
              
              {/* Título e intro */}
              <div className="mb-4">
                <h5 className="text-lg font-bold text-purple-900">{testResult.data.agenda.titulo}</h5>
                <p className="text-purple-700 italic">{testResult.data.agenda.subtitulo}</p>
                <p className="text-purple-600 mt-2">{testResult.data.agenda.intro_disruptiva}</p>
              </div>

              {/* Muestra de meses */}
              {testResult.data.agenda.meses && testResult.data.agenda.meses.length > 0 && (
                <div className="mb-4">
                  <h6 className="font-semibold text-purple-800 mb-2">📅 Ejemplo de Mes:</h6>
                  <div className="bg-white p-3 rounded border">
                    <p><strong>{testResult.data.agenda.meses[0].mes}:</strong> {testResult.data.agenda.meses[0].tema_central}</p>
                    <p><strong>Mantra:</strong> {testResult.data.agenda.meses[0].mantra_mensual}</p>
                    <p><strong>Energía:</strong> {testResult.data.agenda.meses[0].energia_dominante}</p>
                    
                    {/* Eventos del mes */}
                    {testResult.data.agenda.meses[0].eventos_clave && testResult.data.agenda.meses[0].eventos_clave.length > 0 && (
                      <div className="mt-2">
                        <p><strong>Evento destacado:</strong></p>
                        <div className="ml-4 text-sm">
                          <p>📅 {testResult.data.agenda.meses[0].eventos_clave[0].fecha}</p>
                          <p>🌟 {testResult.data.agenda.meses[0].eventos_clave[0].evento}</p>
                          <p>💫 {testResult.data.agenda.meses[0].eventos_clave[0].impacto_personal}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fechas power */}
              {testResult.data.agenda.fechas_power && (
                <div className="mb-4">
                  <h6 className="font-semibold text-purple-800 mb-2">⚡ Fechas Power:</h6>
                  <div className="bg-white p-3 rounded border">
                    <p><strong>Cumpleaños solar:</strong> {testResult.data.agenda.fechas_power.cumpleanos_solar}</p>
                    {testResult.data.agenda.fechas_power.eclipses_personales && (
                      <p><strong>Eclipses:</strong> {testResult.data.agenda.fechas_power.eclipses_personales}</p>
                    )}
                    {testResult.data.agenda.fechas_power.retrogrados_clave && (
                      <p><strong>Retrógrados:</strong> {testResult.data.agenda.fechas_power.retrogrados_clave}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Llamada a la acción */}
              {testResult.data.agenda.llamada_accion_final && (
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded font-bold">
                  {testResult.data.agenda.llamada_accion_final}
                </div>
              )}
            </div>
          )}

          {/* Agenda como texto */}
          {testResult.success && testResult.data?.agenda_texto && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">📝 Agenda como Texto:</h4>
              <pre className="whitespace-pre-wrap text-sm text-gray-700 max-h-96 overflow-y-auto">
                {testResult.data.agenda_texto}
              </pre>
            </div>
          )}

          {/* Datos completos para debug */}
          <details className="bg-gray-100 rounded-lg p-4">
            <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
              🔧 Ver datos completos (debug)
            </summary>
            <pre className="text-sm whitespace-pre-wrap text-gray-600 mt-2 overflow-auto max-h-96 bg-white p-3 rounded border">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Instrucciones */}
      <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">💡 Instrucciones:</h4>
        <ol className="text-yellow-700 text-sm space-y-1 list-decimal list-inside">
          <li>Asegúrate de estar autenticado</li>
          <li>Verifica que tengas datos de nacimiento configurados</li>
          <li>Asegúrate de tener una carta natal generada</li>
          <li>Haz clic en "Generar Agenda IA" para probar</li>
          <li>Si hay errores, revisa la consola del navegador</li>
        </ol>
      </div>
    </div>
  );
}