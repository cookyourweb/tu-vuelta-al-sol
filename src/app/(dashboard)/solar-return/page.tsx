//src/app/(dashboard)/solar-return/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ChartDisplay from '@/components/astrology/ChartDisplay';
import InterpretationButton from '@/components/astrology/InterpretationButton';
import { useInterpretationDrawer } from '@/hooks/useInterpretationDrawer';
import { InterpretationDrawer } from '@/components/astrology/InterpretationDrawer';
import {
  Sun, RefreshCw, Sparkles, AlertTriangle
} from 'lucide-react';

export default function SolarReturnPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { isOpen: drawerOpen, content: drawerContent, open: openDrawer, close: closeDrawer } = useInterpretationDrawer();

  const [chartData, setChartData] = useState<any>(null);
  const [natalChart, setNatalChart] = useState<any>(null);
  const [birthData, setBirthData] = useState<any>(null);
  const [solarReturnData, setSolarReturnData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('☀️ Iniciando tu Vuelta al Sol...');
  const [generatingInterpretations, setGeneratingInterpretations] = useState(false);
  const [interpretationProgress, setInterpretationProgress] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      loadAllData();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (loading) {
      const messages = [
        '☀️ Iniciando tu Vuelta al Sol...',
        '🔄 Calculando tu revolución solar anual...',
        '🌅 Localizando el momento exacto de tu retorno solar...',
        '⚡ Comparando carta natal vs solar return...',
        '🪐 Identificando energías del nuevo ciclo...',
        '✨ Determinando áreas de vida activadas...',
        '💫 Preparando tu mapa anual personalizado...'
      ];

      let index = 0;
      const interval = setInterval(() => {
        index = (index + 1) % messages.length;
        setLoadingMessage(messages[index]);
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [loading]);

  const loadAllData = async () => {
    console.log('🚀 ===== INICIO loadAllData =====');

    if (!user?.uid) {
      console.error('❌ No hay usuario autenticado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // STEP 1: Load Birth Data
      console.log('📋 Paso 1: Cargando Birth Data...');
      const birthResponse = await fetch(`/api/birth-data?userId=${user?.uid}`);

      if (!birthResponse.ok) {
        throw new Error('Error cargando datos de nacimiento');
      }

      const birthResult = await birthResponse.json();
      
      if (!birthResult.success || !birthResult.data) {
        throw new Error('No se encontraron datos de nacimiento');
      }

      setBirthData(birthResult.data);

      // STEP 2: Load NATAL Chart
      console.log('📋 Paso 2: Cargando Carta Natal...');
      const natalResponse = await fetch(`/api/charts/natal?userId=${user?.uid}`);

      if (!natalResponse.ok) {
        throw new Error('Error cargando carta natal');
      }

      const natalResult = await natalResponse.json();

      if (!natalResult.natalChart || !natalResult.natalChart.planets) {
        throw new Error('Carta natal incompleta');
      }

      setNatalChart(natalResult.natalChart);

      // STEP 3: Load Solar Return
      console.log('📋 Paso 3: Cargando Solar Return...');
      const srResponse = await fetch(`/api/charts/solar-return?userId=${user?.uid}`);

      if (!srResponse.ok) {
        throw new Error('Error cargando solar return');
      }

      const srResult = await srResponse.json();

      if (srResult.success && srResult.data?.solarReturnChart) {
        setSolarReturnData(srResult.data.solarReturnChart);
        setChartData(srResult.data.solarReturnChart);
      } else {
        setSolarReturnData(null);
        setChartData(null);
      }

      console.log('✅ ===== FIN loadAllData EXITOSO =====');

    } catch (error) {
      console.error('❌ Error en loadAllData:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // ✅ GENERAR INTERPRETACIONES (similar a natal-chart)
  const generateInterpretations = async (srData?: any, natalData?: any) => {
    // Usar datos pasados por parámetro o del estado
    const solarReturn = srData || solarReturnData;
    const natal = natalData || natalChart;

    if (!user?.uid || !birthData || !solarReturn || !natal) {
      console.log('⚠️ Cannot generate - missing data');
      return;
    }

    setGeneratingInterpretations(true);
    setInterpretationProgress('🔮 Generando interpretación Solar Return con OpenAI...');

    try {
      console.log('🚀 Starting Solar Return AI interpretation generation...');

      const response = await fetch('/api/astrology/interpret-solar-return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          solarReturnChart: solarReturn,
          natalChart: natal,
          userProfile: {
            name: birthData.fullName || 'Usuario',
            age: new Date().getFullYear() - new Date(birthData.birthDate || birthData.date).getFullYear(),
            birthPlace: birthData.birthPlace,
            birthDate: birthData.birthDate || birthData.date,
            birthTime: birthData.birthTime || birthData.time,
            locationContext: {
              birthPlace: birthData.birthPlace,
              currentPlace: birthData.currentPlace,
              relocated: birthData.currentPlace && birthData.currentPlace !== birthData.birthPlace
            }
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Solar Return interpretations generated successfully!');
        setInterpretationProgress('✨ ¡Interpretación Solar Return lista!');

        setTimeout(() => {
          setInterpretationProgress('');
        }, 3000);
      } else {
        console.error('❌ Error generating interpretations:', result.error);
        setInterpretationProgress('⚠️ Error generando interpretación');
        setTimeout(() => {
          setInterpretationProgress('');
        }, 3000);
      }

    } catch (error) {
      console.error('❌ Exception generating interpretations:', error);
      setInterpretationProgress('❌ Error en la generación');
      setTimeout(() => {
        setInterpretationProgress('');
      }, 3000);
    } finally {
      setGeneratingInterpretations(false);
    }
  };

  const handleRegenerateChart = async () => {
    if (!user?.uid || !birthData) {
      setError('Faltan datos necesarios');
      return;
    }

    setRegenerating(true);
    setLoadingMessage('☀️ Iniciando regeneración de Solar Return...');
    setError(null);

    try {
      console.log('🔄 Iniciando regeneración de Solar Return...');

      // 1. ✅ Borrar Solar Return existente
      const deleteSRResponse = await fetch(`/api/charts/solar-return?userId=${user.uid}`, {
        method: 'DELETE'
      });
      console.log('🗑️ Solar Return borrado:', deleteSRResponse.ok);

      // 2. ✅ Borrar interpretaciones cacheadas de Solar Return
      const deleteInterpResponse = await fetch(`/api/astrology/interpret-solar-return?userId=${user.uid}`, {
        method: 'DELETE'
      });
      console.log('🗑️ Interpretaciones borradas:', deleteInterpResponse.ok);

      // 3. Generar nueva Solar Return con mensajes de progreso
      const progressMessages = [
        '☀️ Calculando tu retorno solar exacto...',
        '⚡ Posicionando planetas para tu cumpleaños solar...',
        '🔮 Comparando carta natal vs solar return...',
        '✨ Identificando energías del nuevo ciclo anual...',
        '🪐 Analizando casas y aspectos anuales...',
        '🌟 Revelando oportunidades del próximo año...',
        '💫 Casi listo... preparando tu revolución anual...'
      ];

      let messageIndex = 0;
      const messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % progressMessages.length;
        setLoadingMessage(progressMessages[messageIndex]);
      }, 2000);

      const response = await fetch('/api/charts/solar-return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          birthDate: birthData.date,
          birthTime: birthData.time,
          birthPlace: birthData.birthPlace,
          currentLocation: birthData.currentPlace || birthData.birthPlace,
          regenerate: true
        })
      });

      clearInterval(messageInterval);
      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        throw new Error('Error regenerando Solar Return');
      }

      const data = await response.json();
      console.log('📦 Data recibida:', data);

      if (data.success && data.data?.solarReturnChart) {
        setLoadingMessage('✨ ¡Solar Return completado! 🎉');
        const newSolarReturn = data.data.solarReturnChart;
        setSolarReturnData(newSolarReturn);
        setChartData(newSolarReturn);

        setRegenerating(false);
        setLoadingMessage('☀️ Iniciando tu Vuelta al Sol...');

        // 4. ✅ Auto-generate NEW interpretations after regeneration (como en natal-chart)
        console.log('🔮 Generating new Solar Return interpretations after chart regeneration...');
        await generateInterpretations(newSolarReturn, natalChart);

        console.log('✅ Regeneración completada con nuevas interpretaciones');
      } else {
        throw new Error('Solar Return incompleto');
      }

    } catch (err) {
      console.error('❌ Error regenerando Solar Return:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setRegenerating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-orange-900/20 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto relative">
              <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-0 bg-orange-600 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sun className="w-12 h-12 text-white animate-spin" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-amber-300 mb-4 animate-pulse">
            {loadingMessage}
          </h2>

          <div className="bg-orange-900/30 backdrop-blur-sm border border-orange-400/30 rounded-xl p-4">
            <p className="text-orange-200 text-sm">
              Estamos calculando tu Solar Return con precisión astronómica.
              Este proceso puede tomar hasta 90 segundos...
            </p>
          </div>

          <div className="mt-6 w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 animate-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-900/10 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-red-900/30 border border-red-500/30 rounded-2xl p-8 max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-300 mb-4 text-center">Error</h2>
          <p className="text-red-200 mb-6 text-center">{error}</p>
          <button
            onClick={loadAllData}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-all"
          >
            <RefreshCw className="w-5 h-5 inline mr-2" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-orange-900/10 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-orange-900/30 border border-orange-500/30 rounded-2xl p-8 max-w-md text-center">
          <Sun className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-orange-300 mb-4">Solar Return No Disponible</h2>
          <p className="text-orange-200 mb-6">
            Necesitas generar tu Solar Return primero.
          </p>
          <button
            onClick={handleRegenerateChart}
            disabled={regenerating}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            {regenerating ? (
              <>
                <RefreshCw className="w-5 h-5 inline mr-2 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sun className="w-5 h-5 inline mr-2" />
                Generar Solar Return
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        
        {/* ✅ SECCIÓN 1: HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-2 text-center">
            ☀️ Tu Vuelta al Sol {new Date().getFullYear()}
          </h1>
          <p className="text-purple-200 text-center text-lg">
            Revolución Solar • Ciclo Anual Personalizado
          </p>
        </div>

        {/* ✅ SECCIÓN 2: BOTONES DE ACCIÓN (Regenerar + Interpretación) */}
        {solarReturnData && natalChart && birthData && (() => {
          const userProfile = {
            name: birthData.fullName || 'Usuario',
            age: calculateAge(birthData.birthDate || birthData.date),
            birthPlace: birthData.birthPlace || '',
            birthDate: new Date(birthData.birthDate || birthData.date).toLocaleDateString('es-ES'),
            birthTime: birthData.birthTime || birthData.time || ''
          };

          const isAdmin = user?.email?.includes('admin') || false;

          if (!userProfile.name || userProfile.name === 'Usuario') {
            return (
              <div className="mb-8 p-4 bg-yellow-900/30 border border-yellow-400/30 rounded-lg">
                <p className="text-yellow-200">⚠️ Nombre de usuario no disponible</p>
              </div>
            );
          }

          return (
            <div className="mb-8">
              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-4xl mx-auto mb-8">
                {/* BOTÓN REGENERAR CARTA (Para todos los usuarios) */}
                <button
                  onClick={handleRegenerateChart}
                  disabled={loading || regenerating}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center text-sm disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${(loading || regenerating) ? 'animate-spin' : ''}`} />
                  {(loading || regenerating) ? 'Regenerando...' : 'Regenerar Carta'}
                </button>

                {/* BOTÓN INTERPRETACIÓN */}
                <div data-interpret-button>
                  <InterpretationButton
                    type="solar-return"
                    userId={user?.uid || ''}
                    chartData={solarReturnData}
                    natalChart={natalChart}
                    userProfile={userProfile}
                    isAdmin={isAdmin}
                    className="w-full sm:w-auto"
                  />
                </div>
              </div>

              {/* ✅ MENSAJE DE PROGRESO DE INTERPRETACIONES */}
              {interpretationProgress && (
                <div className="mt-4 p-4 bg-purple-900/40 border border-purple-400/30 rounded-lg text-center">
                  <p className="text-purple-200 font-medium animate-pulse">
                    {interpretationProgress}
                  </p>
                </div>
              )}
            </div>
          );
        })()}

        {/* ✅ SECCIÓN 3: EXPLICACIÓN QUÉ ES SOLAR RETURN */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-2xl p-8 border border-purple-400/30">
            <h2 className="text-2xl font-bold text-purple-100 mb-4 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-purple-300" />
              ¿Qué es la Revolución Solar?
            </h2>
            <div className="space-y-4 text-purple-50">
              <p className="leading-relaxed">
                La <strong>Revolución Solar</strong> es la carta astral levantada para el momento exacto
                en que el Sol regresa a la posición que tenía cuando naciste. Este evento ocurre cerca
                de tu cumpleaños cada año y marca el inicio de un nuevo ciclo anual.
              </p>
              <div className="bg-purple-800/30 rounded-lg p-4">
                <p className="text-sm text-purple-200">
                  <strong>💡 Dato clave:</strong> El Sol siempre está en la misma posición zodiacal
                  que en tu carta natal, pero los otros planetas cambian, creando un mapa único de
                  energías disponibles para los próximos 12 meses.
                </p>
              </div>
              <p className="leading-relaxed">
                Esta técnica predictiva te permite conocer las áreas de vida que se activarán,
                los desafíos que enfrentarás y las oportunidades que surgirán durante tu año personal.
              </p>
            </div>
          </div>
        </div>

        {/* ✅ SECCIÓN 3.5: DATOS DE UBICACIÓN SOLAR RETURN */}
        {birthData && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-orange-900/40 to-amber-900/40 rounded-2xl p-6 border border-orange-400/30">
              <h3 className="text-xl font-bold text-orange-100 mb-4 flex items-center gap-2">
                <Sun className="w-5 h-5 text-orange-300" />
                Datos de tu Solar Return {new Date().getFullYear()}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Datos de Nacimiento */}
                <div className="bg-orange-800/20 rounded-lg p-4 border border-orange-400/20">
                  <h4 className="text-orange-200 font-semibold text-sm mb-3">📍 Datos de Nacimiento</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-orange-300">Lugar:</span>
                      <span className="text-orange-50 font-medium">{birthData.birthPlace || 'No disponible'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-300">Fecha:</span>
                      <span className="text-orange-50 font-medium">
                        {new Date(birthData.date || birthData.birthDate).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-300">Hora:</span>
                      <span className="text-orange-50 font-medium">{birthData.time || birthData.birthTime || 'No disponible'}</span>
                    </div>
                  </div>
                </div>

                {/* Ubicación del Solar Return */}
                <div className={`rounded-lg p-4 border ${
                  birthData.currentPlace && birthData.currentPlace !== birthData.birthPlace
                    ? 'bg-green-800/20 border-green-400/30'
                    : 'bg-orange-800/20 border-orange-400/20'
                }`}>
                  <h4 className={`font-semibold text-sm mb-3 ${
                    birthData.currentPlace && birthData.currentPlace !== birthData.birthPlace
                      ? 'text-green-200'
                      : 'text-orange-200'
                  }`}>
                    {birthData.currentPlace && birthData.currentPlace !== birthData.birthPlace
                      ? '🌍 Ubicación Actual (Solar Return)'
                      : '📍 Ubicación Solar Return'
                    }
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={birthData.currentPlace && birthData.currentPlace !== birthData.birthPlace ? 'text-green-300' : 'text-orange-300'}>
                        Lugar:
                      </span>
                      <span className={`font-medium ${
                        birthData.currentPlace && birthData.currentPlace !== birthData.birthPlace
                          ? 'text-green-50'
                          : 'text-orange-50'
                      }`}>
                        {birthData.currentPlace || birthData.birthPlace || 'No disponible'}
                      </span>
                    </div>
                    {birthData.currentPlace && birthData.currentPlace !== birthData.birthPlace && (
                      <div className="mt-3 p-2 bg-green-900/30 rounded border border-green-400/20">
                        <p className="text-green-200 text-xs">
                          ✨ <strong>Importante:</strong> Tu Solar Return se calcula para tu ubicación actual,
                          no tu lugar de nacimiento. Esto puede cambiar significativamente tu carta anual.
                        </p>
                      </div>
                    )}
                    {(!birthData.currentPlace || birthData.currentPlace === birthData.birthPlace) && (
                      <div className="mt-3 p-2 bg-orange-900/30 rounded border border-orange-400/20">
                        <p className="text-orange-200 text-xs">
                          📍 Se usa tu lugar de nacimiento por defecto. Si vives en otra ciudad,
                          considera actualizar tu ubicación actual para un cálculo más preciso.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ✅ SECCIÓN 4: RUEDA ASTROLÓGICA CON 3 CARDS */}
        {chartData && (
          <div className="max-w-5xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-purple-100 mb-6 text-center">
                🌟 Tu Rueda Solar Return {new Date().getFullYear()}
              </h2>
              <div className="flex justify-center">
                <ChartDisplay
                  planets={chartData.planets || []}
                  houses={chartData.houses || []}
                  elementDistribution={chartData.elementDistribution || {}}
                  modalityDistribution={chartData.modalityDistribution || {}}
                  keyAspects={chartData.keyAspects || []}
                  ascendant={chartData.ascendant}
                  midheaven={chartData.midheaven}
                  chartType="solar-return"
                  // ✅ NEW PROPS FOR SOLAR RETURN CARDS
                  birthDate={birthData?.date || birthData?.birthDate}
                  birthTime={birthData?.time || birthData?.birthTime}
                  birthPlace={birthData?.birthPlace}
                  solarReturnYear={new Date().getFullYear()}
                  solarReturnTheme="Revolución de Identidad y Empoderamiento Profesional"
                  ascSRInNatalHouse={10}
                  // ✅ DRAWER INTEGRATION
                  userId={user?.uid}
                  onOpenDrawer={openDrawer}
                  onCloseDrawer={closeDrawer}
                  drawerOpen={drawerOpen}
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ✅ DRAWER GLOBAL PARA INTERPRETACIONES */}
      <InterpretationDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        content={drawerContent}
      />
    </div>
  );
}

// ✅ HELPER FUNCTIONS
function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
}

function calculateAge(birthDateString: string): number {
  if (!birthDateString) return 0;
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}