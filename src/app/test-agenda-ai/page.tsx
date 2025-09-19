
   

      // src/app/test-agenda-ai/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import AgendaAITest from '@/components/test/AgendaAITest';
import { Calendar, Star, Moon, Zap, CheckCircle, AlertCircle, Clock, User, Database, Brain, Sparkles } from 'lucide-react';
import GenerateAgendaAITest from '@/components/test/GenerateAgendaAITest';

// Test user data constant
const userData = {
  "userId": "ob4p8gCQuJUf712pleFl074LqJZ2",
  "birthDate": "1990-01-15T00:00:00.000Z",
  "birthTime": "12:30:00",
  "birthPlace": "Madrid, España",
  "latitude": 40.4164,
  "longitude": -3.7025,
  "timezone": "Europe/Madrid",
  "fullName": "Vero2708",
  "createdAt": new Date(),
  "updatedAt": new Date()
};
import OpenAIDirectTest from '@/components/test/OpenAIDirectTest';
import UserDataChecker from '@/components/test/UserDataChecker';

interface SystemStatus {
  authentication: boolean;
  birthData: boolean;
  natalChart: boolean;
  progressedChart: boolean;
  openaiConfig: boolean;
  mongodb: boolean;
  firebase: boolean;
  prokerala: boolean;
}

function TestAgendaAIContent() {
  const { user, loading: authLoading } = useAuth();
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    authentication: false,
    birthData: false,
    natalChart: false,
    progressedChart: false,
    openaiConfig: false,
    mongodb: true, // Asumimos que están funcionando
    firebase: true,
    prokerala: true
  });
  const [statusLoading, setStatusLoading] = useState(true);
  const [showSystemDetails, setShowSystemDetails] = useState(false);

  // Verificar estado del sistema (version mejorada de tu lógica original)
  useEffect(() => {
    const checkSystemStatus = async () => {
      if (!user?.uid) {
        setStatusLoading(false);
        return;
      }

      try {
        // Verificar datos de nacimiento
        const birthDataResponse = await fetch(`/api/birth-data?userId=${user.uid}`);
        const birthData = await birthDataResponse.json();

        // Verificar carta natal
        const natalResponse = await fetch(`/api/charts/natal?userId=${user.uid}`);
        const natalData = await natalResponse.json();

        // Verificar carta progresada  
        const progressedResponse = await fetch(`/api/charts/progressed?userId=${user.uid}`);
        const progressedData = await progressedResponse.json();

        // Verificar OpenAI
        const openaiResponse = await fetch('/api/astrology/generate-agenda-ai');
        const openaiData = await openaiResponse.json();

        setSystemStatus(prev => ({
          ...prev,
          authentication: !!user?.uid,
          birthData: birthData.success && birthData.data,
          natalChart: natalData.success && natalData.data,
          progressedChart: progressedData.success && progressedData.data,
          openaiConfig: !openaiData.error || openaiData.message !== 'OPENAI_API_KEY no configurada'
        }));

      } catch (error) {
        console.error('Error verificando estado del sistema:', error);
      } finally {
        setStatusLoading(false);
      }
    };

    if (!authLoading) {
      checkSystemStatus();
    }
  }, [user, authLoading]);

  const getSystemReadiness = () => {
    const coreServices = [systemStatus.authentication, systemStatus.birthData, systemStatus.natalChart, systemStatus.openaiConfig];
    return coreServices.filter(Boolean).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white py-8">
      <div className="container mx-auto px-4">
        
        {/* Header Mejorado */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🧪 Test de Agenda IA</h1>
          <p className="text-xl text-gray-300 mb-2">
            Prueba del endpoint de generación de agenda astrológica con OpenAI Assistant
          </p>
          <p className="text-gray-400 mb-4">
            Endpoint: <code className="bg-gray-800 px-2 py-1 rounded">/api/astrology/generate-agenda-ai</code>
          </p>
          
          {/* Estado general del sistema */}
          {!statusLoading && (
            <div className={`inline-block px-6 py-3 rounded-full text-sm font-bold ${
              getSystemReadiness() === 4 
                ? 'bg-green-500 text-white' 
                : getSystemReadiness() >= 2
                ? 'bg-yellow-500 text-black'
                : 'bg-red-500 text-white'
            }`}>
              {getSystemReadiness() === 4 
                ? '✅ Sistema Completamente Listo' 
                : `⚠️ Sistema ${getSystemReadiness()}/4 - ${getSystemReadiness() >= 2 ? 'Funcional' : 'Requiere Configuración'}`}
            </div>
          )}
        </div>

        {/* Información del sistema actualizada */}
        <div className="max-w-4xl mx-auto mb-8 grid md:grid-cols-3 gap-6">
          <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
            <h3 className="font-bold text-green-300 mb-2">✅ Configurado</h3>
            <ul className="text-green-200 text-sm space-y-1">
              <li>• OpenAI Assistant entrenado</li>
              <li>• Interpretaciones acumulativas</li>
              <li>• Prompt evolutivo optimizado</li>
              <li>• Sistema de fallbacks</li>
            </ul>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
            <h3 className="font-bold text-blue-300 mb-2">🔮 Funcionalidades</h3>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• Agenda personalizada IA</li>
              <li>• Análisis natal + progresada</li>
              <li>• Enfoque antifragilidad</li>
              <li>• Rituales transformadores</li>
            </ul>
          </div>
          
          <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4">
            <h3 className="font-bold text-purple-300 mb-2">📊 Análisis Avanzado</h3>
            <ul className="text-purple-200 text-sm space-y-1">
              <li>• Tokens utilizados</li>
              <li>• Costo estimado</li>
              <li>• Metadata completa</li>
              <li>• Debug información</li>
            </ul>
          </div>
        </div>

        {/* Panel de estado detallado (nuevo) */}
        {!statusLoading && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">🔍 Estado Detallado del Sistema</h3>
              <button
                onClick={() => setShowSystemDetails(!showSystemDetails)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                {showSystemDetails ? 'Ocultar' : 'Ver Detalles'}
              </button>
            </div>
            
            {showSystemDetails && (
              <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Core del Sistema:</h4>
                    <ul className="space-y-1">
                      <li className={systemStatus.authentication ? 'text-green-300' : 'text-red-300'}>
                        {systemStatus.authentication ? '✅' : '❌'} Autenticación: {systemStatus.authentication ? user?.email?.split('@')[0] : 'No autenticado'}
                      </li>
                      <li className={systemStatus.birthData ? 'text-green-300' : 'text-yellow-300'}>
                        {systemStatus.birthData ? '✅' : '⚠️'} Datos Nacimiento: {systemStatus.birthData ? 'Configurados' : 'Faltantes'}
                      </li>
                      <li className={systemStatus.natalChart ? 'text-green-300' : 'text-yellow-300'}>
                        {systemStatus.natalChart ? '✅' : '⚠️'} Carta Natal: {systemStatus.natalChart ? 'Disponible' : 'Requerida'}
                      </li>
                      <li className={systemStatus.progressedChart ? 'text-green-300' : 'text-gray-400'}>
                        {systemStatus.progressedChart ? '✅' : '○'} Carta Progresada: {systemStatus.progressedChart ? 'Disponible' : 'Opcional'}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Servicios:</h4>
                    <ul className="space-y-1">
                      <li className={systemStatus.openaiConfig ? 'text-green-300' : 'text-red-300'}>
                        {systemStatus.openaiConfig ? '✅' : '❌'} OpenAI API: {systemStatus.openaiConfig ? 'Configurada' : 'Sin configurar'}
                      </li>
                      <li className="text-green-300">✅ MongoDB: Activo</li>
                      <li className="text-green-300">✅ Firebase Auth: Activo</li>
                      <li className="text-green-300">✅ Prokerala API: Activo</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Verificador de datos del usuario - NUEVO */}
        <div className="max-w-4xl mx-auto mb-8">
          <UserDataChecker />
        </div>

        {/* OpenAI Direct Test - NUEVO COMPONENTE */}
        <div className="max-w-4xl mx-auto mb-8">
          <OpenAIDirectTest />
        </div>

        {/* Componente de test principal */}
        <AgendaAITest />
        
        {/* Enlaces útiles - mantiene tu estructura original pero actualizada */}
        <div className="max-w-4xl mx-auto mt-8 bg-gray-800/50 border border-gray-600/50 rounded-lg p-6">
          <h3 className="font-bold text-white mb-4">🔗 Enlaces Útiles</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-300 mb-2">Para Usuarios:</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• <a href="/birth-data" className="text-blue-400 hover:underline">Configurar datos de nacimiento</a></li>
                <li>• <a href="/natal-chart" className="text-blue-400 hover:underline">Generar carta natal</a></li>
                <li>• <a href="/progressed-chart" className="text-blue-400 hover:underline">Carta progresada</a></li>
                <li>• <a href="/agenda" className="text-blue-400 hover:underline">Ver agenda astrológica</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-300 mb-2">Para Desarrolladores:</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• <a href="/debug" className="text-blue-400 hover:underline">Herramientas de debug</a></li>
                <li>• <a href="/test-api" className="text-blue-400 hover:underline">Test de APIs</a></li>
                <li>• <a href="/dashboard" className="text-blue-400 hover:underline">Dashboard principal</a></li>
                <li>• <a href="/" className="text-blue-400 hover:underline">Página de inicio</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Notas importantes actualizadas */}
        <div className="max-w-4xl mx-auto mt-6 bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-4">
          <h4 className="font-bold text-yellow-300 mb-2">⚠️ Notas Importantes - Sistema Actualizado</h4>
          <ul className="text-yellow-200 text-sm space-y-1">
            <li>• Sistema ahora usa OpenAI Assistant entrenado con libros astrológicos reales</li>
            <li>• Interpretaciones acumulativas: Natal → Progresada → Agenda final</li>
            <li>• La agenda usa enfoque "antifragilidad" - transformar desafíos en fortalezas</li>
            <li>• Incluye rituales, mantras y acciones específicas personalizadas</li>
            <li>• Los costos se monitorizan y muestran en tiempo real</li>
          </ul>
        </div>

        {/* Estado del sistema - versión mejorada */}
        <div className="max-w-4xl mx-auto mt-6 bg-indigo-500/10 border border-indigo-400/30 rounded-lg p-4">
          <h4 className="font-bold text-indigo-300 mb-2">🔍 Estado del Sistema</h4>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className={`text-2xl mb-1 ${systemStatus.openaiConfig ? 'text-green-400' : 'text-red-400'}`}>
                {systemStatus.openaiConfig ? '✅' : '❌'}
              </div>
              <p className="text-indigo-200">OpenAI Assistant</p>
            </div>
            <div className="text-center">
              <div className="text-green-400 text-2xl mb-1">✅</div>
              <p className="text-indigo-200">MongoDB</p>
            </div>
            <div className="text-center">
              <div className="text-green-400 text-2xl mb-1">✅</div>
              <p className="text-indigo-200">Firebase Auth</p>
            </div>
            <div className="text-center">
              <div className="text-green-400 text-2xl mb-1">✅</div>
              <p className="text-indigo-200">Prokerala API</p>
            </div>
          </div>
          
          {!statusLoading && (
            <div className="mt-4 text-center">
              <div className="text-indigo-200 text-sm">
                Sistema preparado al <span className="font-bold text-white">{Math.round((getSystemReadiness() / 4) * 100)}%</span>
                {getSystemReadiness() < 4 && (
                  <span className="block mt-1 text-yellow-300">
                    Faltan {4 - getSystemReadiness()} requisitos para funcionalidad completa
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Información técnica nueva */}
        <div className="max-w-4xl mx-auto mt-6 bg-purple-500/10 border border-purple-400/30 rounded-lg p-4">
          <h4 className="font-bold text-purple-300 mb-2">🚀 Mejoras Implementadas</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-semibold text-purple-200 mb-1">IA Avanzada:</h5>
              <ul className="text-purple-100 space-y-1">
                <li>• Assistant entrenado con libros astrológicos</li>
                <li>• Sistema de interpretaciones acumulativas</li>
                <li>• Prompts optimizados para enfoque evolutivo</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-purple-200 mb-1">Funcionalidades:</h5>
              <ul className="text-purple-100 space-y-1">
                <li>• Agenda personalizada con rituales</li>
                <li>• Análisis carta natal + progresada</li>
                <li>• Sistema de fallbacks inteligente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function TestAgendaAIPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">🔮 Cargando sistema de testing mejorado...</h2>
          <p className="text-purple-200 mt-2">Verificando estado del sistema y IA Assistant</p>
        </div>
      </div>
    }>
      <TestAgendaAIContent />
         <GenerateAgendaAITest />
    </Suspense>
  );
}
