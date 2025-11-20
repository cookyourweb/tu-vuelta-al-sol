// =============================================================================
// 🌟 PÁGINA CARTA NATAL - ✅ WITH AI INTERPRETATION AUTO-GENERATION
// src/app/(dashboard)/natal-chart/page.tsx
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ChartDisplay from '@/components/astrology/ChartDisplay';
import InterpretationButton from '@/components/astrology/InterpretationButton';
import { useInterpretationDrawer } from '@/hooks/useInterpretationDrawer';
import { InterpretationDrawer } from '@/components/astrology/InterpretationDrawer';
import InterpretationProgressModal from '@/components/astrology/InterpretationProgressModal';
import ChartProgressModal from '@/components/astrology/ChartProgressModal';
import EnergyProfileTooltip from '@/components/astrology/EnergyProfileTooltip';
import { Sparkles, Edit, Star, RefreshCw, Brain } from 'lucide-react';
import Button from '@/components/ui/Button';

// ✅ INTERFACES
interface NatalChartData {
  planets: any[];
  houses: any[];
  aspects?: any[];
  keyAspects?: any[];
  elementDistribution: { fire: number; earth: number; air: number; water: number };
  modalityDistribution: { cardinal: number; fixed: number; mutable: number };
  ascendant?: { longitude?: number; sign?: string; degree?: number };
  midheaven?: { longitude?: number; sign?: string; degree?: number };
  isFallback?: boolean;
  generatedAt?: string;
}

interface BirthData {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;
  fullName: string;
}

export default function NatalChartPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { isOpen: drawerOpen, content: drawerContent, open: openDrawer, close: closeDrawer } = useInterpretationDrawer();
  
  // Estados principales
  const [chartData, setChartData] = useState<NatalChartData | null>(null);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('🌌 Conectando con el cosmos...');

  // ✅ NEW: Estados para interpretaciones AI
  const [hasInterpretations, setHasInterpretations] = useState(false);
  const [generatingInterpretations, setGeneratingInterpretations] = useState(false);
  const [interpretationProgress, setInterpretationProgress] = useState('');

  // ✅ FUNCIÓN: Procesar datos de carta
  const processChartData = (rawData: any): NatalChartData => {
    if (!rawData) {
      throw new Error('No hay datos para procesar');
    }

    return {
      planets: rawData.planets || [],
      houses: rawData.houses || [],
      aspects: rawData.aspects || [],
      keyAspects: rawData.keyAspects || [],
      elementDistribution: rawData.elementDistribution || { fire: 25, earth: 25, air: 25, water: 25 },
      modalityDistribution: rawData.modalityDistribution || { cardinal: 33, fixed: 33, mutable: 34 },
      ascendant: rawData.ascendant || null,
      midheaven: rawData.midheaven || null,
      isFallback: rawData.isFallback || false,
      generatedAt: rawData.generatedAt || new Date().toISOString()
    };
  };

  // ✅ FUNCIÓN: Cargar datos de nacimiento
  const loadBirthDataInfo = async () => {
    try {
      const response = await fetch(`/api/birth-data?userId=${user?.uid}`);
      
      if (response.ok) {
        const result = await response.json();
        
        console.log('🔍 API Response completa:', result.data);
        
        if (result.success && result.data) {
          setBirthData({
            birthDate: result.data.date || result.data.birthDate,
            birthTime: result.data.time || result.data.birthTime,
            birthPlace: result.data.location || result.data.birthPlace,
            latitude: result.data.latitude,
            longitude: result.data.longitude,
            timezone: result.data.timezone,
            fullName: result.data.fullName
          });
        }
      }
    } catch (error) {
      console.log('⚠️ Error loading birth data:', error);
    }
  };

  // ✅ NEW: Check if AI interpretations exist
  const checkInterpretations = async (): Promise<boolean> => {
    if (!user?.uid) return false;
    
    try {
      console.log('🔍 Checking if interpretations exist...');
      const response = await fetch(`/api/astrology/interpret-natal?userId=${user.uid}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        console.log('✅ Interpretations already exist');
        setHasInterpretations(true);
        return true;
      } else {
        console.log('⚠️ No interpretations found');
        setHasInterpretations(false);
        return false;
      }
    } catch (error) {
      console.error('❌ Error checking interpretations:', error);
      return false;
    }
  };

  // ✅ NEW: Generate AI interpretations with detailed progress
  const generateInterpretations = async () => {
    if (!user?.uid || !birthData) {
      console.log('⚠️ Cannot generate - missing user or birth data');
      return;
    }

    setGeneratingInterpretations(true);

    // ⚠️ MENSAJE INICIAL DE ADVERTENCIA
    setInterpretationProgress('⚠️ IMPORTANTE: Este es un análisis muy detallado que tomará 2-3 minutos. Por favor NO cierres esta pantalla.');

    // Esperar 3 segundos para que lean la advertencia
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      console.log('🚀 Starting AI interpretation generation...');

      // 📊 MENSAJES DE PROGRESO SIMULADOS (actualizados mientras el backend trabaja)
      const progressMessages = [
        { message: '🔮 Conectando con GPT-4o para análisis profundo...', delay: 500 },
        { message: '🌅 Generando Ascendente y Medio Cielo...', delay: 8000 },
        { message: '🪐 Iniciando interpretaciones de planetas...', delay: 5000 },
        { message: '☀️ Generando Sol en ' + (chartData?.planets.find(p => p.name === 'Sun' || p.name === 'Sol')?.sign || 'tu signo') + '...', delay: 10000 },
        { message: '🌙 Generando Luna en ' + (chartData?.planets.find(p => p.name === 'Moon' || p.name === 'Luna')?.sign || 'tu signo') + '...', delay: 10000 },
        { message: '☿️ Generando Mercurio en ' + (chartData?.planets.find(p => p.name === 'Mercury' || p.name === 'Mercurio')?.sign || 'tu signo') + '...', delay: 10000 },
        { message: '💎 Generando Venus en ' + (chartData?.planets.find(p => p.name === 'Venus')?.sign || 'tu signo') + '...', delay: 10000 },
        { message: '⚔️ Generando Marte en ' + (chartData?.planets.find(p => p.name === 'Mars' || p.name === 'Marte')?.sign || 'tu signo') + '...', delay: 10000 },
        { message: '🎯 Generando Jupiter en ' + (chartData?.planets.find(p => p.name === 'Jupiter' || p.name === 'Júpiter')?.sign || 'tu signo') + '...', delay: 10000 },
        { message: '⏳ Generando Saturno en ' + (chartData?.planets.find(p => p.name === 'Saturn' || p.name === 'Saturno')?.sign || 'tu signo') + '...', delay: 10000 },
        { message: '🌑 Procesando Lilith y Chiron...', delay: 8000 },
        { message: '🔄 Generando Nodos Lunares (evolución kármica)...', delay: 10000 },
        { message: '🔥 Analizando Elemento Fuego...', delay: 5000 },
        { message: '🌍 Analizando Elemento Tierra...', delay: 5000 },
        { message: '💨 Analizando Elemento Aire...', delay: 5000 },
        { message: '💧 Analizando Elemento Agua...', delay: 5000 },
        { message: '⚡ Procesando Modalidades astrológicas...', delay: 5000 },
        { message: '✨ Finalizando interpretaciones...', delay: 3000 },
      ];

      let messageIndex = 0;
      const messageInterval = setInterval(() => {
        if (messageIndex < progressMessages.length) {
          setInterpretationProgress(progressMessages[messageIndex].message);
          messageIndex++;
        }
      }, 7000); // Cambiar mensaje cada 7 segundos

      // 🚀 LLAMADA AL BACKEND (mientras mostramos progreso)
      const response = await fetch('/api/astrology/interpret-natal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          chartData: chartData,
          userProfile: {
            name: birthData.fullName || 'Usuario',
            age: new Date().getFullYear() - new Date(birthData.birthDate).getFullYear(),
            birthPlace: birthData.birthPlace,
            birthDate: birthData.birthDate,
            birthTime: birthData.birthTime
          }
        })
      });

      clearInterval(messageInterval);
      const result = await response.json();

      if (result.success) {
        console.log('✅ AI Interpretations generated successfully!');
        setHasInterpretations(true);
        setInterpretationProgress('🎉 ¡Interpretaciones completadas! Tu análisis profundo está listo.');

        // Clear progress message after 5 seconds
        setTimeout(() => {
          setInterpretationProgress('');
          setGeneratingInterpretations(false);
        }, 5000);
      } else {
        console.error('❌ Error generating interpretations:', result.error);
        setInterpretationProgress('⚠️ Error generando interpretaciones: ' + (result.error || 'Error desconocido'));
        setTimeout(() => {
          setGeneratingInterpretations(false);
        }, 5000);
      }
    } catch (error) {
      console.error('❌ Error in generation request:', error);
      setInterpretationProgress('❌ Error en la solicitud. Por favor intenta de nuevo.');
      setTimeout(() => {
        setGeneratingInterpretations(false);
      }, 5000);
    }
  };

  // ✅ FUNCIÓN: Cargar carta natal
  const loadChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo('🔍 Cargando carta natal...');
      
      console.log('🔍 Cargando carta natal para usuario:', user?.uid);
      
      // Intentar cargar carta existente
      const response = await fetch(`/api/charts/natal?userId=${user?.uid}`, {
        method: 'GET'
      });
      
      console.log('📡 Respuesta carta natal:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.natalChart) {
          console.log('✅ Carta natal cargada correctamente');
          setDebugInfo('✅ Carta natal cargada');
          
          const processedData = processChartData(result.natalChart);
          setChartData(processedData);

          // 🔍 DIAGNOSE: Check planets count
          console.log('📊 Planets in chartData:', processedData?.planets.length);
          console.log('🪐 Names:', processedData?.planets.map(p => p.name));

          // Cargar datos de nacimiento
          await loadBirthDataInfo();
          return;
        }
      }
      
      // Si no existe, generar automáticamente
      setDebugInfo('📝 Generando carta natal automáticamente...');
      console.log('📝 No existe carta natal, generando...');
      
      const generateResponse = await fetch('/api/charts/natal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.uid,
          regenerate: false
        })
      });
      
      if (generateResponse.ok) {
        const generateResult = await generateResponse.json();
        
        if (generateResult.success) {
          console.log('✅ Carta natal generada correctamente');
          setDebugInfo('✅ Carta natal generada');
          
          const processedData = processChartData(generateResult.natalChart);
          setChartData(processedData);
          
          await loadBirthDataInfo();
        } else {
          throw new Error(generateResult.error || 'Error generando carta');
        }
      } else {
        throw new Error('Error en respuesta del servidor');
      }
      
    } catch (error) {
      console.error('❌ Error cargando carta natal:', error);
      setError(error instanceof Error ? error.message : 'Error cargando carta');
      setDebugInfo(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNCIÓN: Regenerar carta
  const regenerateChart = async () => {
    if (!user?.uid) return;

    setIsRegenerating(true);
    setLoadingMessage('🌌 Conectando con el cosmos...');

    try {
      console.log('🔄 Iniciando regeneración...');

      // 1. Borrar carta existente
      const deleteResponse = await fetch(`/api/charts/natal?userId=${user.uid}`, {
        method: 'DELETE'
      });
      console.log('🗑️ Carta borrada:', deleteResponse.ok);

      // 2. ✅ Borrar interpretaciones cacheadas
      const deleteInterpResponse = await fetch(`/api/astrology/interpret-natal?userId=${user.uid}`, {
        method: 'DELETE'
      });
      console.log('🗑️ Interpretaciones borradas:', deleteInterpResponse.ok);

      // 3. Generar nueva carta con mensajes de progreso
      const progressMessages = [
        '🌌 Conectando con el cosmos...',
        '⚡ Calculando posiciones planetarias exactas...',
        '🔮 Descifrando tu mapa cósmico...',
        '✨ Interpretando las energías astrales...',
        '🪐 Analizando aspectos planetarios...',
        '🌟 Revelando tu configuración única...',
        '💫 Casi listo... preparando tu revolución personal...'
      ];

      let messageIndex = 0;
      const messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % progressMessages.length;
        setLoadingMessage(progressMessages[messageIndex]);
      }, 2000);

      const response = await fetch('/api/charts/natal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          regenerate: true
        })
      });

      clearInterval(messageInterval);
      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('📦 Data recibida:', data);

        if (data.success && data.natalChart) {
          setLoadingMessage('✨ ¡Carta completada! 🎉');
          const processedData = processChartData(data.natalChart);
          setChartData(processedData);
          await loadBirthDataInfo();

          // 4. ✅ Auto-generate NEW interpretations after regeneration
          console.log('🔮 Generating new interpretations after chart regeneration...');
          setHasInterpretations(false);
          await generateInterpretations();

          console.log('✅ Regeneración completada');
        }
      } else {
        throw new Error('Error en la regeneración');
      }

    } catch (error) {
      console.error('❌ Error regenerando:', error);
      setError(error instanceof Error ? error.message : 'Error regenerando');
    } finally {
      setIsRegenerating(false);
    }
  };

  // ✅ CARGAR DATOS AL MONTAR
  useEffect(() => {
    if (user?.uid && !authLoading) {
      loadChartData();
    }
  }, [user?.uid, authLoading]);

  // ✅ NEW: Auto-generate interpretations when chart + birth data are ready
  useEffect(() => {
    async function autoGenerateIfNeeded() {
      if (!chartData || !birthData || !user?.uid) {
        console.log('⏸️ Waiting for chart and birth data...');
        return;
      }
      
      console.log('🔍 Chart and birth data ready, checking interpretations...');
      const exists = await checkInterpretations();
      
      if (!exists) {
        console.log('🚀 No interpretations found - auto-generating...');
        await generateInterpretations();
      } else {
        console.log('✅ Interpretations already exist, skipping generation');
      }
    }
    
    autoGenerateIfNeeded();
  }, [chartData, birthData, user?.uid]);

  // ✅ ANIMACIÓN DE MENSAJES DE CARGA
  useEffect(() => {
    if (loading) {
      const messages = [
        '🌌 Conectando con el cosmos...',
        '⚡ Calculando posiciones planetarias exactas...',
        '🔮 Descifrando tu mapa cósmico...',
        '✨ Interpretando las energías astrales...',
        '🪐 Analizando aspectos planetarios...',
        '🌟 Revelando tu configuración única...',
        '💫 Casi listo... preparando tu revolución personal...'
      ];

      let index = 0;
      const interval = setInterval(() => {
        index = (index + 1) % messages.length;
        setLoadingMessage(messages[index]);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [loading]);

  // ✅ FUNCIONES DE NAVEGACIÓN
  const navigateToBirthData = () => {
    router.push('/birth-data');
  };

  // ✅ PANTALLA DE CARGA
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto relative">
              <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-0 bg-purple-600 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-white animate-spin" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-4 animate-pulse">
            {loadingMessage}
          </h2>

          <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-400/30 rounded-xl p-4">
            <p className="text-purple-200 text-sm">
              Estamos calculando tu carta natal con precisión astronómica.
              Este proceso puede tomar hasta 60 segundos...
            </p>
          </div>

          <div className="mt-6 w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ PANTALLA DE ERROR
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 rounded-full p-8 backdrop-blur-sm mx-auto w-fit">
            <Sparkles className="w-16 h-16 text-red-400" />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Error al cargar carta</h2>
            <p className="text-gray-300">{error}</p>

            {debugInfo && (
              <div className="bg-black/30 rounded-lg p-3 text-sm text-red-300 font-mono text-left">
                {debugInfo}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {error.includes('datos de nacimiento') ? (
                <Button
                  onClick={navigateToBirthData}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Configurar datos</span>
                </Button>
              ) : (
                <Button
                  onClick={() => loadChartData()}
                  className="bg-purple-600 hover:bg-purple-700 flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Intentar de nuevo</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ PANTALLA PRINCIPAL
  if (!chartData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-300">No hay datos de carta natal disponibles</p>
          <Button
            onClick={() => loadChartData()}
            className="mt-4 bg-purple-600 hover:bg-purple-700"
          >
            Cargar carta
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header principal */}
      <div className="text-center space-y-6">
        <div className="flex justify-center items-center mb-6">
          <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-6 backdrop-blur-sm relative">
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            <Star className="w-12 h-12 text-yellow-400" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl text-white font-bold">
          Carta Natal{' '}
          <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
            Tu Mapa Cósmico
          </span>
        </h1>

        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed flex items-center justify-center gap-3">
          <Star className="w-6 h-6 text-yellow-400 flex-shrink-0" />
          Descubre los secretos que los astros revelaron en el momento exacto de tu nacimiento
        </p>

        {/* ✅ NEW: Progress Modals */}
        <ChartProgressModal
          isOpen={loading && !isRegenerating}
          progress={loadingMessage}
          onClose={() => setLoading(false)}
        />

        <InterpretationProgressModal
          isOpen={generatingInterpretations}
          progress={interpretationProgress}
          onClose={() => setGeneratingInterpretations(false)}
        />

        {hasInterpretations && !generatingInterpretations && (
          <div className="bg-green-900/30 backdrop-blur-sm border border-green-400/30 rounded-xl p-3 max-w-md mx-auto">
            <p className="text-green-200 text-xs flex items-center justify-center gap-2">
              <span>✅</span>
              <span>Interpretaciones AI disponibles - Haz hover en los planetas</span>
            </p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* BOTÓN DE REGENERAR */}
          <button
            onClick={regenerateChart}
            disabled={isRegenerating}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center text-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? 'Regenerando...' : 'Regenerar Carta'}
          </button>

          {/* BOTÓN DE INTERPRETACIÓN */}
          {chartData && birthData && (
            <div data-interpret-button>
              <InterpretationButton
                type="natal"
                userId={user?.uid || ''}
                chartData={chartData}
                userProfile={{
                  name: birthData.fullName || 'Usuario',
                  age: new Date().getFullYear() - new Date(birthData.birthDate).getFullYear(),
                  birthPlace: birthData.birthPlace,
                  birthDate: birthData.birthDate,
                  birthTime: birthData.birthTime
                }}
                className="w-full sm:w-auto"
              />
            </div>
          )}
        </div>
      </div>

      {/* ✅ Energy Profile Tooltip - Initial Section */}
      {chartData && (
        <EnergyProfileTooltip
          ascendant={chartData.ascendant}
          midheaven={chartData.midheaven}
          elementDistribution={chartData.elementDistribution}
          modalityDistribution={chartData.modalityDistribution}
          userId={user?.uid}
        />
      )}

      {/* ✅ Carta natal with AI integration */}
      {chartData && (
        <div className="flex justify-center">
          <ChartDisplay
            planets={chartData.planets}
            houses={chartData.houses}
            elementDistribution={chartData.elementDistribution}
            modalityDistribution={chartData.modalityDistribution}
            keyAspects={chartData.keyAspects || []}
            ascendant={chartData.ascendant}
            midheaven={chartData.midheaven}
            birthData={birthData || undefined}
            userId={user?.uid}           // ✅ Pass userId for AI fetch
            onOpenDrawer={openDrawer}    // ✅ Pass drawer opener
            onCloseDrawer={closeDrawer}  // ✅ Pass drawer closer
            drawerOpen={drawerOpen}      // ✅ Pass drawer state
          />
        </div>
      )}

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 60s linear infinite;
        }
      `}</style>

      {/* Drawer global para interpretaciones */}
      <InterpretationDrawer
        isOpen={drawerOpen}
        onClose={() => {
          closeDrawer();
        }}
        content={drawerContent}
      />
    </div>
  );
}