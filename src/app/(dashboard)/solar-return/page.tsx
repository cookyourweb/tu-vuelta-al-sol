//src/app/(dashboard)/solar-return/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ChartDisplay from '@/components/astrology/ChartDisplay';
import InterpretationButton from '@/components/astrology/InterpretationButton';
import {
  Sun, RefreshCw, Sparkles, AlertTriangle
} from 'lucide-react';

export default function SolarReturnPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [chartData, setChartData] = useState<any>(null);
  const [natalChart, setNatalChart] = useState<any>(null);
  const [birthData, setBirthData] = useState<any>(null);
  const [solarReturnData, setSolarReturnData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('☀️ Iniciando tu Vuelta al Sol...');

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
      const srResponse = await fetch(`/api/charts/progressed?userId=${user?.uid}`);

      if (!srResponse.ok) {
        throw new Error('Error cargando solar return');
      }

      const srResult = await srResponse.json();

      if (srResult.success && srResult.solarReturnChart) {
        setSolarReturnData(srResult.solarReturnChart);
        setChartData(srResult.solarReturnChart);
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

  const handleRegenerateChart = async () => {
    if (!user?.uid || !birthData) {
      setError('Faltan datos necesarios');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/charts/progressed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          birthDate: birthData.date,
          birthTime: birthData.time,
          birthPlace: birthData.birthPlace,
          currentLocation: birthData.currentLocation || birthData.birthPlace,
          regenerate: true
        })
      });

      if (!response.ok) {
        throw new Error('Error regenerando carta');
      }

      const data = await response.json();

      if (data.solarReturnChart) {
        setChartData(data.solarReturnChart);
        setSolarReturnData(data.solarReturnChart);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
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

        {/* ✅ SECCIÓN 2: BOTÓN DE INTERPRETACIÓN */}
        {solarReturnData && natalChart && birthData && (() => {
          const userProfile = {
            name: birthData.fullName || 'Usuario',
            age: calculateAge(birthData.birthDate || birthData.date),
            birthPlace: birthData.birthPlace || '',
            birthDate: new Date(birthData.birthDate || birthData.date).toLocaleDateString('es-ES'),
            birthTime: birthData.birthTime || birthData.time || ''
          };

          if (!userProfile.name || userProfile.name === 'Usuario') {
            return (
              <div className="mb-8 p-4 bg-yellow-900/30 border border-yellow-400/30 rounded-lg">
                <p className="text-yellow-200">⚠️ Nombre de usuario no disponible</p>
              </div>
            );
          }

          return (
            <div className="mb-8">
              <InterpretationButton
                type="solar-return"
                userId={user?.uid || ''}
                chartData={solarReturnData}
                natalChart={natalChart}
                userProfile={userProfile}
                isAdmin={user?.email?.includes('admin') || false}
                className="max-w-2xl mx-auto"
              />
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
                />
              </div>
            </div>
          </div>
        )}

        {/* ✅ SECCIÓN 5: LÍNEA DE TIEMPO SOLAR RETURN */}
        <div id="linea-tiempo-solar" className="max-w-6xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-rose-900/40 to-pink-900/40 rounded-xl p-8 border border-rose-400/30">
            <h3 className="text-2xl font-bold text-rose-100 mb-6 text-center flex items-center justify-center gap-3">
              <span className="text-3xl">📅</span>
              Línea de Tiempo Solar Return {new Date().getFullYear()}-{new Date().getFullYear() + 1}
            </h3>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500 via-pink-500 to-rose-500"></div>

              <div className="space-y-6">
                {/* Mes 1 */}
                <div className="flex items-start gap-4 relative">
                  <div className="w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center flex-shrink-0 z-10 border-4 border-rose-900">
                    <span className="text-white font-bold text-sm">MES 1</span>
                  </div>
                  <div className="flex-1 bg-rose-800/30 rounded-lg p-4">
                    <h4 className="text-rose-100 font-bold mb-2">🎯 Activación del Ciclo Anual</h4>
                    <p className="text-rose-200 text-sm mb-2">
                      📅 {formatDate(birthData?.date || birthData?.birthDate)} {new Date().getFullYear()}
                    </p>
                    <p className="text-rose-50 text-sm">
                      Las primeras 4 semanas marcan el TONO del año. Cada acción cuenta DOBLE.
                    </p>
                  </div>
                </div>

                {/* Mes 3 */}
                <div className="flex items-start gap-4 relative">
                  <div className="w-16 h-16 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0 z-10 border-4 border-rose-900">
                    <span className="text-white font-bold text-sm">MES 3</span>
                  </div>
                  <div className="flex-1 bg-orange-800/30 rounded-lg p-4">
                    <h4 className="text-orange-100 font-bold mb-2">⚡ Primera Cuadratura Solar</h4>
                    <p className="text-orange-200 text-sm mb-2">Tipo: Desafío Necesario</p>
                    <p className="text-orange-50 text-sm">
                      MOMENTO DE VERDAD: ¿Estás alineado con tus intenciones o solo hablando?
                    </p>
                  </div>
                </div>

                {/* Mes 6 */}
                <div className="flex items-start gap-4 relative">
                  <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 z-10 border-4 border-rose-900">
                    <span className="text-white font-bold text-sm">MES 6</span>
                  </div>
                  <div className="flex-1 bg-green-800/30 rounded-lg p-4">
                    <h4 className="text-green-100 font-bold mb-2">🌟 Trígono Solar - Flujo Cósmico</h4>
                    <p className="text-green-200 text-sm mb-2">Tipo: Ventana de Oportunidad</p>
                    <p className="text-green-50 text-sm">
                      TODO fluye SI hiciste el trabajo previo. Momento de CAPITALIZAR esfuerzos.
                    </p>
                  </div>
                </div>

                {/* Mes 7 */}
                <div className="flex items-start gap-4 relative">
                  <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0 z-10 border-4 border-rose-900">
                    <span className="text-white font-bold text-sm">MES 7</span>
                  </div>
                  <div className="flex-1 bg-red-800/30 rounded-lg p-4 border-2 border-red-500/50">
                    <h4 className="text-red-100 font-bold mb-2 text-lg">🔥 OPOSICIÓN SOLAR - Momento de Verdad Definitivo</h4>
                    <p className="text-red-200 text-sm mb-2">Tipo: Revelación Total (Crítico)</p>
                    <p className="text-red-50 text-sm">
                      VES con claridad TOTAL: ¿funcionó tu estrategia o no? Sin filtros, sin excusas.
                    </p>
                  </div>
                </div>

                {/* Mes 9 */}
                <div className="flex items-start gap-4 relative">
                  <div className="w-16 h-16 rounded-full bg-yellow-600 flex items-center justify-center flex-shrink-0 z-10 border-4 border-rose-900">
                    <span className="text-white font-bold text-sm">MES 9</span>
                  </div>
                  <div className="flex-1 bg-yellow-800/30 rounded-lg p-4">
                    <h4 className="text-yellow-100 font-bold mb-2">🎁 Cosecha Visible</h4>
                    <p className="text-yellow-200 text-sm mb-2">Tipo: Manifestación de Resultados</p>
                    <p className="text-yellow-50 text-sm">
                      Frutos de tu trabajo se vuelven VISIBLES. Si trabajaste, cosecharás.
                    </p>
                  </div>
                </div>

                {/* Mes 12 */}
                <div className="flex items-start gap-4 relative">
                  <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 z-10 border-4 border-rose-900">
                    <span className="text-white font-bold text-sm">MES 12</span>
                  </div>
                  <div className="flex-1 bg-purple-800/30 rounded-lg p-4">
                    <h4 className="text-purple-100 font-bold mb-2">🌙 Cierre e Integración</h4>
                    <p className="text-purple-200 text-sm mb-2">
                      📅 {formatDate(birthData?.date || birthData?.birthDate)} {new Date().getFullYear() + 1}
                    </p>
                    <p className="text-purple-50 text-sm">
                      Último mes para cerrar ciclos conscientes y preparar siguiente revolución.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-rose-900/40 rounded-lg border border-rose-400/20">
              <p className="text-rose-200 text-sm text-center">
                💡 <strong>Nota Importante:</strong> Estos momentos clave se activan automáticamente cuando el Sol transita
                las posiciones críticas respecto a tu Solar Return. Úsalos para evaluar tu progreso anual.
              </p>
            </div>
          </div>
        </div>

        {/* ✅ SECCIÓN 6: BOTÓN REGENERAR */}
        <div className="max-w-2xl mx-auto mb-8">
          <button
            onClick={handleRegenerateChart}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center text-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Regenerando...' : 'Regenerar Carta'}
          </button>
        </div>

      </div>
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