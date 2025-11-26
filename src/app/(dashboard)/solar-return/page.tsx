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

// Helper function to get month name in Spanish from birthday
function getMonthName(birthDate: string, monthOffset: number): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const date = new Date(birthDate);
  const birthMonth = date.getMonth(); // 0-11
  const targetMonth = (birthMonth + monthOffset) % 12;

  return months[targetMonth];
}

// Helper function to get month with year
function getMonthWithYear(birthDate: string, monthOffset: number, currentYear: number): string {
  const monthName = getMonthName(birthDate, monthOffset);
  const date = new Date(birthDate);
  const birthMonth = date.getMonth();

  // Calculate if we're in the next year
  const yearsToAdd = Math.floor((birthMonth + monthOffset) / 12);
  const year = currentYear + yearsToAdd;

  return `${monthName} ${year}`;
}

// Componente de navegación reutilizable
function SectionNavigation({ currentSection }: { currentSection?: string }) {
  const sections = [
    { id: 'carta', label: '🌟 Carta', icon: '🌟' },
    { id: 'aspectos', label: '✨ Aspectos', icon: '✨' },
    { id: 'planetas', label: '🪐 Planetas', icon: '🪐' }
  ];

  return (
    <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-purple-400/20">
      <nav className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
        {sections.map((section) => {
          const isActive = currentSection === section.id;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`px-3 py-1.5 text-xs md:text-sm font-semibold rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-purple-200 hover:text-white hover:bg-purple-700/50'
              }`}
            >
              {section.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}

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
  const [loadingProgress, setLoadingProgress] = useState(0);

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
        { text: '☀️ Iniciando tu Vuelta al Sol...', progress: 5 },
        { text: '🔄 Calculando tu revolución solar anual...', progress: 20 },
        { text: '🌅 Localizando el momento exacto de tu retorno solar...', progress: 35 },
        { text: '⚡ Comparando carta natal vs solar return...', progress: 50 },
        { text: '🪐 Identificando energías del nuevo ciclo...', progress: 65 },
        { text: '✨ Determinando áreas de vida activadas...', progress: 80 },
        { text: '💫 Preparando tu mapa anual personalizado...', progress: 95 }
      ];

      let index = 0;
      setLoadingMessage(messages[0].text);
      setLoadingProgress(messages[0].progress);

      const interval = setInterval(() => {
        index = (index + 1) % messages.length;
        setLoadingMessage(messages[index].text);
        setLoadingProgress(messages[index].progress);
      }, 2500);

      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
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
    console.log('🔄 [REGENERATE] Button clicked');

    if (!user?.uid || !birthData) {
      console.error('❌ [REGENERATE] Missing user or birthData');
      setError('Faltan datos necesarios');
      return;
    }

    console.log('🔄 [REGENERATE] Starting regeneration for user:', user.uid);
    setLoading(true);
    setError(null);

    try {
      // STEP 1: Delete cached interpretation first
      console.log('🗑️ [REGENERATE] Deleting cached interpretation...');
      try {
        const deleteInterpretationRes = await fetch(`/api/astrology/interpret-solar-return?userId=${user.uid}`, {
          method: 'DELETE'
        });

        if (deleteInterpretationRes.ok) {
          console.log('✅ [REGENERATE] Cached interpretation deleted successfully');
        } else {
          console.warn('⚠️ [REGENERATE] Could not delete cached interpretation (might not exist)');
        }
      } catch (deleteErr) {
        console.warn('⚠️ [REGENERATE] Error deleting interpretation cache:', deleteErr);
        // Continue anyway - not critical
      }

      // STEP 2: Regenerate Solar Return chart
      console.log('🔄 [REGENERATE] Regenerating Solar Return chart...');
      const response = await fetch('/api/charts/solar-return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          birthDate: birthData.date,
          birthTime: birthData.time,
          birthPlace: birthData.birthPlace,
          currentLocation: birthData.currentPlace || birthData.currentLocation || birthData.birthPlace,
          regenerate: true
        })
      });

      console.log('📡 [REGENERATE] Response status:', response.status);

      if (!response.ok) {
        throw new Error('Error regenerando carta');
      }

      const data = await response.json();
      console.log('✅ [REGENERATE] Response received:', {
        success: data.success,
        hasChart: !!data.data?.solarReturnChart,
        source: data.data?.source
      });

      if (data.success && data.data?.solarReturnChart) {
        setChartData(data.data.solarReturnChart);
        setSolarReturnData(data.data.solarReturnChart);
        console.log('✅ [REGENERATE] Chart updated successfully');

        // Show success message
        alert('✅ Solar Return y su interpretación regenerados exitosamente.\n\n💡 Presiona el botón "Generar Interpretación Completa" para ver la nueva interpretación.');
      } else if (data.solarReturnChart) {
        // Fallback for different response structure
        setChartData(data.solarReturnChart);
        setSolarReturnData(data.solarReturnChart);
        console.log('✅ [REGENERATE] Chart updated successfully (fallback structure)');
        alert('✅ Solar Return y su interpretación regenerados exitosamente.\n\n💡 Presiona el botón "Generar Interpretación Completa" para ver la nueva interpretación.');
      } else {
        throw new Error('No se recibió la carta regenerada');
      }

    } catch (err) {
      console.error('❌ [REGENERATE] Error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      alert('❌ Error al regenerar la carta: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setLoading(false);
      console.log('🔄 [REGENERATE] Process finished');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-orange-900/20 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
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

          <div className="bg-orange-900/30 backdrop-blur-sm border border-orange-400/30 rounded-xl p-4 mb-6">
            <p className="text-orange-200 text-sm">
              Estamos calculando tu Solar Return con precisión astronómica.
              Este proceso puede tomar hasta 90 segundos...
            </p>
          </div>

          {/* Barra de progreso con porcentaje */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-orange-300 font-semibold">Progreso</span>
              <span className="text-orange-200 font-bold text-lg">{loadingProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden shadow-lg">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p className="text-orange-400/70 text-xs mt-2">
              Por favor, no abandones esta página mientras calculamos tu carta...
            </p>
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
            currentLocation: birthData.currentPlace || birthData.currentLocation || birthData.birthPlace || '', // ✅ Add current location for SR
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

        {/* ✅ SECCIÓN 3: CARTA ASTROLÓGICA */}
        {chartData && (
          <div id="carta" className="max-w-5xl mx-auto mb-12 scroll-mt-24">
            <SectionNavigation currentSection="carta" />
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
                  currentLocation={birthData?.currentPlace || birthData?.currentLocation || birthData?.birthPlace} // ✅ Use current location for SR
                  solarReturnYear={new Date().getFullYear()}
                  solarReturnTheme="Revolución de Identidad y Empoderamiento Profesional"
                  ascSRInNatalHouse={10}
                />
              </div>
            </div>
          </div>
        )}

        {/* ✅ SECCIÓN 4: ASPECTOS */}
        {chartData && chartData.keyAspects && chartData.keyAspects.length > 0 && (
          <div id="aspectos" className="max-w-6xl mx-auto mb-12 scroll-mt-24">
            <SectionNavigation currentSection="aspectos" />
            <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-2xl p-8 border border-cyan-400/30">
              <h2 className="text-2xl md:text-3xl font-bold text-cyan-100 mb-6 text-center">
                ✨ Aspectos Planetarios Clave
              </h2>
              <div className="space-y-4">
                {chartData.keyAspects.map((aspect: any, index: number) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-cyan-800/40 to-blue-800/40 backdrop-blur-sm rounded-xl p-5 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-cyan-100">
                        {aspect.planet1} {getAspectSymbol(aspect.aspect)} {aspect.planet2}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getAspectColor(aspect.aspect)}`}>
                        {aspect.aspect}
                      </span>
                    </div>
                    <p className="text-cyan-200 text-sm">
                      Orbe: {aspect.orb?.toFixed(2)}°
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ✅ SECCIÓN 5: LÍNEA DE TIEMPO SOLAR RETURN */}
        <div id="linea-tiempo" className="max-w-7xl mx-auto mb-12 scroll-mt-24">
          <div className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 border-2 border-purple-400/40 shadow-2xl">

            {/* Header mejorado */}
            <div className="text-center mb-12">
              <div className="inline-block bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-sm rounded-2xl px-6 py-3 mb-4 border border-purple-400/30">
                <span className="text-4xl">📅</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-3">
                Línea de Tiempo Solar Return
              </h3>
              <p className="text-purple-200 text-lg">
                {new Date().getFullYear()} - {new Date().getFullYear() + 1}
              </p>
            </div>

            <div className="relative max-w-5xl mx-auto">
              {/* Línea vertical más gruesa y visible */}
              <div className="absolute left-14 md:left-16 top-0 bottom-0 w-1.5 bg-gradient-to-b from-rose-500 via-purple-500 to-pink-500 opacity-60"></div>

              <div className="space-y-8 md:space-y-10">
                {/* Mes 1 - REDISEÑADO */}
                <div className="flex items-start gap-6 md:gap-8 relative">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-rose-600 to-rose-700 flex flex-col items-center justify-center flex-shrink-0 z-10 border-4 border-slate-900 shadow-2xl shadow-rose-500/50">
                    <span className="text-white font-black text-base md:text-lg">MES 1</span>
                    <span className="text-rose-100 text-xs md:text-sm font-semibold mt-1 px-2 text-center leading-tight">
                      {birthData && getMonthWithYear(birthData.birthDate || birthData.date, 0, new Date().getFullYear())}
                    </span>
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-rose-900/60 to-rose-800/60 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-rose-400/30 shadow-lg hover:shadow-rose-500/20 transition-all duration-300 hover:scale-105">
                    <h4 className="text-rose-100 font-bold text-lg md:text-xl mb-3 flex items-center gap-2">
                      <span className="text-2xl">🎯</span>
                      Activación del Ciclo Anual
                    </h4>
                    <p className="text-rose-200 text-sm md:text-base mb-3 font-medium">
                      📅 {formatDate(birthData?.date || birthData?.birthDate)} {new Date().getFullYear()}
                    </p>
                    <p className="text-rose-50 text-sm md:text-base leading-relaxed">
                      Las primeras 4 semanas marcan el <strong>TONO</strong> del año. Cada acción cuenta <strong>DOBLE</strong>.
                    </p>
                  </div>
                </div>

                {/* Mes 3 - REDISEÑADO */}
                <div className="flex items-start gap-6 md:gap-8 relative">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-orange-600 to-orange-700 flex flex-col items-center justify-center flex-shrink-0 z-10 border-4 border-slate-900 shadow-2xl shadow-orange-500/50">
                    <span className="text-white font-black text-base md:text-lg">MES 3</span>
                    <span className="text-orange-100 text-xs md:text-sm font-semibold mt-1 px-2 text-center leading-tight">
                      {birthData && getMonthWithYear(birthData.birthDate || birthData.date, 2, new Date().getFullYear())}
                    </span>
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-orange-900/60 to-orange-800/60 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-orange-400/30 shadow-lg hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105">
                    <h4 className="text-orange-100 font-bold text-lg md:text-xl mb-3 flex items-center gap-2">
                      <span className="text-2xl">⚡</span>
                      Primera Cuadratura Solar
                    </h4>
                    <p className="text-orange-200 text-sm md:text-base mb-3 font-medium">
                      Tipo: Desafío Necesario
                    </p>
                    <p className="text-orange-50 text-sm md:text-base leading-relaxed">
                      <strong>MOMENTO DE VERDAD:</strong> ¿Estás alineado con tus intenciones o solo hablando?
                    </p>
                  </div>
                </div>

                {/* Mes 6 - REDISEÑADO */}
                <div className="flex items-start gap-6 md:gap-8 relative">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex flex-col items-center justify-center flex-shrink-0 z-10 border-4 border-slate-900 shadow-2xl shadow-green-500/50">
                    <span className="text-white font-black text-base md:text-lg">MES 6</span>
                    <span className="text-green-100 text-xs md:text-sm font-semibold mt-1 px-2 text-center leading-tight">
                      {birthData && getMonthWithYear(birthData.birthDate || birthData.date, 5, new Date().getFullYear())}
                    </span>
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-green-900/60 to-green-800/60 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-green-400/30 shadow-lg hover:shadow-green-500/20 transition-all duration-300 hover:scale-105">
                    <h4 className="text-green-100 font-bold text-lg md:text-xl mb-3 flex items-center gap-2">
                      <span className="text-2xl">🌟</span>
                      Trígono Solar - Flujo Cósmico
                    </h4>
                    <p className="text-green-200 text-sm md:text-base mb-3 font-medium">
                      Tipo: Ventana de Oportunidad
                    </p>
                    <p className="text-green-50 text-sm md:text-base leading-relaxed">
                      TODO fluye SI hiciste el trabajo previo. Momento de <strong>CAPITALIZAR</strong> esfuerzos.
                    </p>
                  </div>
                </div>

                {/* Mes 7 - REDISEÑADO (CRÍTICO) */}
                <div className="flex items-start gap-6 md:gap-8 relative">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex flex-col items-center justify-center flex-shrink-0 z-10 border-4 border-slate-900 shadow-2xl shadow-red-500/60 animate-pulse">
                    <span className="text-white font-black text-base md:text-lg">MES 7</span>
                    <span className="text-red-100 text-xs md:text-sm font-semibold mt-1 px-2 text-center leading-tight">
                      {birthData && getMonthWithYear(birthData.birthDate || birthData.date, 6, new Date().getFullYear())}
                    </span>
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-red-900/70 to-red-800/70 backdrop-blur-sm rounded-2xl p-5 md:p-6 border-2 border-red-400/50 shadow-2xl hover:shadow-red-500/30 transition-all duration-300 hover:scale-105">
                    <h4 className="text-red-100 font-black text-lg md:text-xl mb-3 flex items-center gap-2">
                      <span className="text-2xl">🔥</span>
                      OPOSICIÓN SOLAR - Momento de Verdad Definitivo
                    </h4>
                    <div className="inline-block bg-red-600/30 border border-red-400/40 rounded-full px-3 py-1 mb-3">
                      <p className="text-red-200 text-xs md:text-sm font-bold">
                        ⚠️ CRÍTICO - Revelación Total
                      </p>
                    </div>
                    <p className="text-red-50 text-sm md:text-base leading-relaxed">
                      VES con <strong>claridad TOTAL:</strong> ¿funcionó tu estrategia o no? Sin filtros, sin excusas.
                    </p>
                  </div>
                </div>

                {/* Mes 9 - REDISEÑADO */}
                <div className="flex items-start gap-6 md:gap-8 relative">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-700 flex flex-col items-center justify-center flex-shrink-0 z-10 border-4 border-slate-900 shadow-2xl shadow-yellow-500/50">
                    <span className="text-white font-black text-base md:text-lg">MES 9</span>
                    <span className="text-yellow-100 text-xs md:text-sm font-semibold mt-1 px-2 text-center leading-tight">
                      {birthData && getMonthWithYear(birthData.birthDate || birthData.date, 8, new Date().getFullYear())}
                    </span>
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-yellow-900/60 to-yellow-800/60 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-yellow-400/30 shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 hover:scale-105">
                    <h4 className="text-yellow-100 font-bold text-lg md:text-xl mb-3 flex items-center gap-2">
                      <span className="text-2xl">🎁</span>
                      Cosecha Visible
                    </h4>
                    <p className="text-yellow-200 text-sm md:text-base mb-3 font-medium">
                      Tipo: Manifestación de Resultados
                    </p>
                    <p className="text-yellow-50 text-sm md:text-base leading-relaxed">
                      Frutos de tu trabajo se vuelven <strong>VISIBLES</strong>. Si trabajaste, cosecharás.
                    </p>
                  </div>
                </div>

                {/* Mes 12 - REDISEÑADO */}
                <div className="flex items-start gap-6 md:gap-8 relative">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex flex-col items-center justify-center flex-shrink-0 z-10 border-4 border-slate-900 shadow-2xl shadow-purple-500/50">
                    <span className="text-white font-black text-base md:text-lg">MES 12</span>
                    <span className="text-purple-100 text-xs md:text-sm font-semibold mt-1 px-2 text-center leading-tight">
                      {birthData && getMonthWithYear(birthData.birthDate || birthData.date, 11, new Date().getFullYear())}
                    </span>
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-purple-900/60 to-purple-800/60 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-purple-400/30 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105">
                    <h4 className="text-purple-100 font-bold text-lg md:text-xl mb-3 flex items-center gap-2">
                      <span className="text-2xl">🌙</span>
                      Cierre e Integración
                    </h4>
                    <p className="text-purple-200 text-sm md:text-base mb-3 font-medium">
                      📅 {formatDate(birthData?.date || birthData?.birthDate)} {new Date().getFullYear() + 1}
                    </p>
                    <p className="text-purple-50 text-sm md:text-base leading-relaxed">
                      Último mes para <strong>cerrar ciclos</strong> conscientes y preparar siguiente revolución.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Nota final mejorada */}
            <div className="mt-10 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-purple-400/30">
              <div className="flex items-start gap-4">
                <div className="bg-purple-600/30 rounded-full p-3 flex-shrink-0">
                  <span className="text-3xl">💡</span>
                </div>
                <div>
                  <h4 className="text-purple-100 font-bold text-lg mb-2">
                    Nota Importante
                  </h4>
                  <p className="text-purple-200 text-sm md:text-base leading-relaxed">
                    Estos <strong>momentos clave</strong> se activan automáticamente cuando el Sol transita
                    las posiciones críticas respecto a tu Solar Return. Úsalos para <strong>evaluar tu progreso anual</strong> y
                    ajustar tu rumbo con consciencia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ SECCIÓN 6: INTEGRACIÓN FINAL */}
        <div id="integracion" className="max-w-4xl mx-auto mb-12 scroll-mt-24">
          <div className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border-2 border-emerald-400/40 shadow-2xl">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-emerald-600/30 to-teal-600/30 backdrop-blur-sm rounded-2xl px-6 py-3 mb-4 border border-emerald-400/30">
                <span className="text-4xl">🌟</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300 mb-3">
                Integración Final
              </h3>
              <p className="text-emerald-200 text-lg">
                Síntesis de Tu Revolución Solar
              </p>
            </div>

            {/* Contenido */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-800/40 to-teal-800/40 backdrop-blur-sm rounded-2xl p-6 border border-emerald-400/20">
                <h4 className="text-emerald-100 font-bold text-xl mb-4 flex items-center gap-2">
                  <span className="text-2xl">💭</span>
                  Síntesis del Año
                </h4>
                <p className="text-emerald-50 text-base leading-relaxed">
                  Este año {new Date().getFullYear()}-{new Date().getFullYear() + 1} es tu <strong>LABORATORIO DE TRANSFORMACIÓN CONSCIENTE</strong>.
                  No es tiempo de víctimas ni espectadores - es tiempo de <strong>PROTAGONISTAS REVOLUCIONARIOS</strong>.
                  Cada Luna Nueva es un reinicio. Cada decisión cuenta. Cada acción crea tu realidad.
                </p>
              </div>

              <div className="bg-gradient-to-r from-teal-800/40 to-emerald-800/40 backdrop-blur-sm rounded-2xl p-6 border border-teal-400/20">
                <h4 className="text-teal-100 font-bold text-xl mb-4 flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Tu Poder de Elección
                </h4>
                <p className="text-teal-50 text-base leading-relaxed">
                  El Solar Return te entrega el <strong>MAPA</strong> - tú decides si lo sigues con valentía disruptiva
                  o lo ignoras por comodidad mediocre. La astrología no predice - <strong>PREPARA</strong>.
                  Usa este conocimiento para volverte <strong>ANTIFRÁGIL</strong>: más fuerte ante cada desafío,
                  más consciente ante cada oportunidad, más auténtico ante cada elección.
                </p>
              </div>

              <div className="bg-gradient-to-br from-emerald-900/60 to-teal-900/60 backdrop-blur-sm rounded-2xl p-8 border-2 border-emerald-400/40">
                <h4 className="text-emerald-100 font-bold text-xl mb-4 flex items-center gap-2 justify-center">
                  <span className="text-2xl">💫</span>
                  Pregunta para Reflexionar
                </h4>
                <p className="text-emerald-50 text-lg md:text-xl font-semibold text-center italic leading-relaxed">
                  "¿Qué versión de ti mismo/a elegirás manifestar este año:
                  la <strong className="text-emerald-300">VALIENTE y AUTÉNTICA</strong>,
                  o la <strong className="text-gray-400">cómoda y conocida</strong>?"
                </p>
              </div>

              <div className="text-center mt-8">
                <p className="text-emerald-200 text-sm">
                  ✨ Tu revolución personal ya comenzó ✨
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ✅ SECCIÓN 7: RESUMEN DE ASPECTOS */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-2xl p-8 border border-cyan-400/30">
            <h2 className="text-2xl font-bold text-cyan-100 mb-6 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-cyan-300" />
              Resumen de Aspectos - Cómo interactúan tus energías planetarias
            </h2>
            <p className="text-cyan-50 mb-6 leading-relaxed">
              Comprende las dinámicas internas de tu personalidad a través de los aspectos astrológicos
            </p>

            <div className="space-y-6">
              {/* Aspectos Armónicos */}
              <div className="bg-cyan-800/30 rounded-xl p-6 border border-cyan-400/20">
                <h3 className="text-xl font-bold text-cyan-100 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🌟</span>
                  Aspectos Armónicos
                </h3>
                <p className="text-cyan-200 text-sm mb-3 italic">
                  Trígono (120°), Sextil (60°), Semisextil (30°)
                </p>
                <div className="space-y-3 text-cyan-50">
                  <p>
                    <strong className="text-cyan-200">🌟 Qué significan:</strong> Son tus facilidades naturales,
                    talentos innatos y energías que fluyen sin esfuerzo. Representan las áreas donde tienes
                    habilidades naturales y donde las cosas te salen más fácil.
                  </p>
                  <p>
                    <strong className="text-cyan-200">✨ En tu vida:</strong> Aprovecha estos aspectos para
                    desarrollar tus fortalezas
                  </p>
                </div>
              </div>

              {/* Aspectos Tensos */}
              <div className="bg-orange-800/30 rounded-xl p-6 border border-orange-400/20">
                <h3 className="text-xl font-bold text-orange-100 mb-4 flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  Aspectos Tensos
                </h3>
                <p className="text-orange-200 text-sm mb-3 italic">
                  Cuadratura (90°), Oposición (180°), Quincuncio (150°)
                </p>
                <div className="space-y-3 text-orange-50">
                  <p>
                    <strong className="text-orange-200">⚡ Qué significan:</strong> Son tus desafíos internos que
                    generan crecimiento. Crean tensión creativa que te impulsa a evolucionar y desarrollar nuevas
                    capacidades. Son tu motor de transformación personal.
                  </p>
                  <p>
                    <strong className="text-orange-200">🚀 En tu vida:</strong> Abraza estos desafíos como
                    oportunidades de crecimiento
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ SECCIÓN 8: RESUMEN - QUÉ ES SOLAR RETURN */}
        <div id="resumen" className="max-w-4xl mx-auto mb-12 scroll-mt-24">
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

        {/* ✅ SECCIÓN 9: BOTÓN REGENERAR */}
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

function getPlanetEmoji(planetName: string): string {
  const emojis: Record<string, string> = {
    'Sol': '☀️',
    'Luna': '🌙',
    'Mercurio': '☿️',
    'Venus': '♀️',
    'Marte': '♂️',
    'Júpiter': '♃',
    'Saturno': '♄',
    'Urano': '♅',
    'Neptuno': '♆',
    'Plutón': '♇'
  };
  return emojis[planetName] || '⭐';
}

function getAspectSymbol(aspectType: string): string {
  const symbols: Record<string, string> = {
    'Conjunción': '☌',
    'Oposición': '☍',
    'Trígono': '△',
    'Cuadratura': '□',
    'Sextil': '⚹'
  };
  return symbols[aspectType] || '◇';
}

function getAspectColor(aspectType: string): string {
  const colors: Record<string, string> = {
    'Conjunción': 'bg-yellow-600/30 border border-yellow-400/40 text-yellow-200',
    'Oposición': 'bg-red-600/30 border border-red-400/40 text-red-200',
    'Trígono': 'bg-green-600/30 border border-green-400/40 text-green-200',
    'Cuadratura': 'bg-orange-600/30 border border-orange-400/40 text-orange-200',
    'Sextil': 'bg-blue-600/30 border border-blue-400/40 text-blue-200'
  };
  return colors[aspectType] || 'bg-purple-600/30 border border-purple-400/40 text-purple-200';
}