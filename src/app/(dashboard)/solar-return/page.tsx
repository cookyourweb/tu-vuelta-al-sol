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

  const handleRegenerateChart = async () => {
    if (!user?.uid || !birthData) {
      setError('Faltan datos necesarios');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/charts/solar-return', {
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

        {/* ✅ SECCIÓN 5: INTEGRACIÓN FINAL */}
        <div id="integracion" className="max-w-6xl mx-auto mb-12 scroll-mt-24">
          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-2xl p-8 border border-purple-400/30">
            <h3 className="text-3xl font-bold text-purple-100 mb-6 text-center flex items-center justify-center gap-3">
              <span className="text-3xl">💫</span>
              Integración Final - Tu Año Solar
            </h3>

            {/* Resumen Solar Return */}
            <div className="mb-8 p-6 bg-purple-800/30 rounded-xl border border-purple-400/20">
              <h4 className="text-xl font-bold text-purple-100 mb-4">🌟 Síntesis de tu Revolución Solar</h4>
              <div className="text-purple-50 space-y-3">
                <p className="leading-relaxed">
                  Este año solar representa un ciclo único en tu vida, marcado por las posiciones planetarias
                  específicas que se activaron en el momento exacto de tu retorno solar. La combinación de
                  los planetas en las casas y los aspectos que forman entre sí crean el mapa energético de
                  tu año personal.
                </p>
                <p className="leading-relaxed">
                  Los temas principales que se destacan en tu Solar Return indican las áreas de vida donde
                  experimentarás mayor actividad, aprendizaje y transformación durante los próximos 12 meses.
                  Presta especial atención a las casas donde se concentran más planetas y a los aspectos exactos,
                  ya que representan las energías más poderosas de tu año.
                </p>
              </div>
            </div>

            {/* Secciones Educativas */}
            <div className="space-y-8 mb-8">
              {/* Resumen de Aspectos */}
              <div className="p-6 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-xl border border-indigo-400/30">
                <div className="text-center mb-6">
                  <h4 className="text-white font-bold text-xl mb-3">
                    <svg className="w-6 h-6 inline mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10,9 9,9 8,9"/>
                    </svg>
                    Resumen de Aspectos - Cómo interactúan tus energías planetarias
                  </h4>
                  <div className="text-indigo-200 text-base mb-4">Comprende las dinámicas internas de tu personalidad a través de los aspectos astrológicos</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                  <div className="text-center p-4 bg-green-400/10 rounded-xl border border-green-400/30">
                    <div className="text-green-300 font-bold text-xl mb-3 flex items-center justify-center">
                      <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6 9 17l-5-5"/>
                      </svg>
                      Aspectos Armónicos
                    </div>
                    <div className="text-green-200 text-sm mb-2 font-semibold">Trígono (120°), Sextil (60°), Semisextil (30°)</div>
                    <div className="text-green-100 text-xs leading-relaxed">
                      <strong>🌟 Qué significan:</strong> Son tus facilidades naturales, talentos innatos y energías que fluyen sin esfuerzo.
                      Representan las áreas donde tienes habilidades naturales y donde las cosas te salen más fácil.
                    </div>
                    <div className="text-green-200 text-xs mt-2 font-medium">✨ En tu vida: Aprovecha estos aspectos para desarrollar tus fortalezas</div>
                  </div>

                  <div className="text-center p-4 bg-red-400/10 rounded-xl border border-red-400/30">
                    <div className="text-red-300 font-bold text-xl mb-3 flex items-center justify-center">
                      <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
                      </svg>
                      Aspectos Tensos
                    </div>
                    <div className="text-red-200 text-sm mb-2 font-semibold">Cuadratura (90°), Oposición (180°), Quincuncio (150°)</div>
                    <div className="text-red-100 text-xs leading-relaxed">
                      <strong>⚡ Qué significan:</strong> Son tus desafíos internos que generan crecimiento. Crean tensión creativa que te impulsa
                      a evolucionar y desarrollar nuevas capacidades. Son tu motor de transformación personal.
                    </div>
                    <div className="text-red-200 text-xs mt-2 font-medium">🚀 En tu vida: Abraza estos desafíos como oportunidades de crecimiento</div>
                  </div>

                  <div className="text-center p-4 bg-yellow-400/10 rounded-xl border border-yellow-400/30">
                    <div className="text-yellow-300 font-bold text-xl mb-3 flex items-center justify-center">
                      <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <circle cx="12" cy="12" r="6"/>
                        <circle cx="12" cy="12" r="2"/>
                      </svg>
                      Aspectos Especiales
                    </div>
                    <div className="text-yellow-200 text-sm mb-2 font-semibold">Conjunción (0°), Aspectos Menores</div>
                    <div className="text-yellow-100 text-xs leading-relaxed">
                      <strong>🔥 Qué significan:</strong> Las conjunciones fusionan energías planetarias creando una fuerza unificada muy potente.
                      Los aspectos menores añaden matices y sutilezas a tu personalidad.
                    </div>
                    <div className="text-yellow-200 text-xs mt-2 font-medium">💫 En tu vida: Reconoce estas energías intensas y únicas en ti</div>
                  </div>
                </div>
              </div>

              {/* ¿Qué son los Aspectos EXACTOS? */}
              <div className="p-6 bg-yellow-400/15 border border-yellow-400/40 rounded-xl">
                <div className="text-center mb-4">
                  <div className="text-yellow-300 font-bold text-xl mb-2 flex items-center justify-center">
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                    </svg>
                    ¿Qué son los Aspectos EXACTOS?
                  </div>
                </div>

                <div className="text-yellow-100 text-sm leading-relaxed max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="font-semibold mb-2 text-yellow-200">🎯 Definición:</div>
                      <div className="mb-4">
                        Un aspecto se considera <span className="bg-yellow-400 text-black px-2 py-1 rounded font-bold">EXACTO</span> cuando
                        el orbe (diferencia angular) es menor a <span className="font-semibold text-yellow-200">1 grado</span>.
                        Esto significa que los planetas están casi en el ángulo perfecto del aspecto.
                      </div>

                      <div className="font-semibold mb-2 text-yellow-200">⚡ Intensidad:</div>
                      <div>
                        Los aspectos exactos tienen <span className="font-semibold text-yellow-200">máxima potencia energética</span>
                        y representan las influencias <span className="font-semibold text-yellow-200">más poderosas y definitorias</span>
                        en tu personalidad y destino.
                      </div>
                    </div>

                    <div>
                      <div className="font-semibold mb-2 text-yellow-200">🌟 En tu carta:</div>
                      <div className="mb-4">
                        Si tienes aspectos exactos, estas energías planetarias están <span className="font-semibold text-yellow-200">perfectamente sincronizadas</span>
                        en tu ser. Son como "superpoderes astrológicos" que definen rasgos muy marcados de tu personalidad.
                      </div>

                      <div className="font-semibold mb-2 text-yellow-200">💫 Importancia:</div>
                      <div>
                        Presta especial atención a tus aspectos exactos: son las <span className="font-semibold text-yellow-200">claves maestras</span>
                        para entender tu naturaleza más profunda y tus potenciales más desarrollados.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón Regenerar */}
            <div className="text-center">
              <button
                onClick={handleRegenerateChart}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center mx-auto text-base disabled:opacity-50 shadow-lg"
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Regenerando...' : 'Regenerar Carta Solar Return'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ✅ HELPER FUNCTIONS
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