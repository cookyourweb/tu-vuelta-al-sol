// =============================================================================
// 🌟 COPIA DE PÁGINA CARTA PROGRESADA - BASADA EN CARTA NATAL
// src/app/(dashboard)/progressed-chart/page-copy.tsx
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ChartDisplay from '@/components/astrology/ChartDisplay';
import { Sparkles, Edit, Star, ArrowLeft, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';

// ✅ INTERFACES
interface ProgressedChartData {
  planets: any[];
  houses: any[];
  aspects?: any[];
  keyAspects?: any[];
  elementDistribution: { fire: number; earth: number; air: number; water: number };
  modalityDistribution: { cardinal: number; fixed: number; mutable: number };
  ascendant?: { longitude?: number; sign?: string; degree?: number };
  midheaven?: { longitude?: number; sign?: string; degree?: number };
  progressionInfo?: {
    year: number;
    period: string;
    description: string;
    startDate: string;
    endDate: string;
    ageAtStart: number;
    isCurrentYear: boolean;
    progressionDate?: string;
    progressionTime?: string;
  };
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

export default function ProgressedChartCopyPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  // Estados principales
  const [chartData, setChartData] = useState<ProgressedChartData | null>(null);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  // ✅ FUNCIÓN: Procesar datos de carta progresada
  const processChartData = (rawData: any): ProgressedChartData => {
    if (!rawData) {
      throw new Error('No hay datos para procesar');
    }

    console.log('🔄 Procesando datos crudos:', rawData);
    console.log('🔍 Claves disponibles en rawData:', Object.keys(rawData));

    // ✅ TRANSFORMAR DATOS DEL SERVICIO AL FORMATO ESPERADO POR EL COMPONENTE
    const planets = [];

    // Convertir planetas individuales al formato esperado
    if (rawData.sol_progresado) {
      planets.push({
        name: 'Sol',
        sign: rawData.sol_progresado.sign,
        degree: rawData.sol_progresado.degree,
        house: rawData.sol_progresado.house,
        retrograde: rawData.sol_progresado.retrograde,
        longitude: rawData.sol_progresado.longitude,
        symbol: rawData.sol_progresado.symbol
      });
    }

    if (rawData.luna_progresada) {
      planets.push({
        name: 'Luna',
        sign: rawData.luna_progresada.sign,
        degree: rawData.luna_progresada.degree,
        house: rawData.luna_progresada.house,
        retrograde: rawData.luna_progresada.retrograde,
        longitude: rawData.luna_progresada.longitude,
        symbol: rawData.luna_progresada.symbol
      });
    }

    if (rawData.mercurio_progresado) {
      planets.push({
        name: 'Mercurio',
        sign: rawData.mercurio_progresado.sign,
        degree: rawData.mercurio_progresado.degree,
        house: rawData.mercurio_progresado.house,
        retrograde: rawData.mercurio_progresado.retrograde,
        longitude: rawData.mercurio_progresado.longitude,
        symbol: rawData.mercurio_progresado.symbol
      });
    }

    if (rawData.venus_progresada) {
      planets.push({
        name: 'Venus',
        sign: rawData.venus_progresada.sign,
        degree: rawData.venus_progresada.degree,
        house: rawData.venus_progresada.house,
        retrograde: rawData.venus_progresada.retrograde,
        longitude: rawData.venus_progresada.longitude,
        symbol: rawData.venus_progresada.symbol
      });
    }

    if (rawData.marte_progresado) {
      planets.push({
        name: 'Marte',
        sign: rawData.marte_progresado.sign,
        degree: rawData.marte_progresado.degree,
        house: rawData.marte_progresado.house,
        retrograde: rawData.marte_progresado.retrograde,
        longitude: rawData.marte_progresado.longitude,
        symbol: rawData.marte_progresado.symbol
      });
    }

    if (rawData.jupiter_progresado) {
      planets.push({
        name: 'Júpiter',
        sign: rawData.jupiter_progresado.sign,
        degree: rawData.jupiter_progresado.degree,
        house: rawData.jupiter_progresado.house,
        retrograde: rawData.jupiter_progresado.retrograde,
        longitude: rawData.jupiter_progresado.longitude,
        symbol: rawData.jupiter_progresado.symbol
      });
    }

    if (rawData.saturno_progresado) {
      planets.push({
        name: 'Saturno',
        sign: rawData.saturno_progresado.sign,
        degree: rawData.saturno_progresado.degree,
        house: rawData.saturno_progresado.house,
        retrograde: rawData.saturno_progresado.retrograde,
        longitude: rawData.saturno_progresado.longitude,
        symbol: rawData.saturno_progresado.symbol
      });
    }

    if (rawData.urano_progresado) {
      planets.push({
        name: 'Urano',
        sign: rawData.urano_progresado.sign,
        degree: rawData.urano_progresado.degree,
        house: rawData.urano_progresado.house,
        retrograde: rawData.urano_progresado.retrograde,
        longitude: rawData.urano_progresado.longitude,
        symbol: rawData.urano_progresado.symbol
      });
    }

    if (rawData.neptuno_progresado) {
      planets.push({
        name: 'Neptuno',
        sign: rawData.neptuno_progresado.sign,
        degree: rawData.neptuno_progresado.degree,
        house: rawData.neptuno_progresado.house,
        retrograde: rawData.neptuno_progresado.retrograde,
        longitude: rawData.neptuno_progresado.longitude,
        symbol: rawData.neptuno_progresado.symbol
      });
    }

    if (rawData.pluton_progresado) {
      planets.push({
        name: 'Plutón',
        sign: rawData.pluton_progresado.sign,
        degree: rawData.pluton_progresado.degree,
        house: rawData.pluton_progresado.house,
        retrograde: rawData.pluton_progresado.retrograde,
        longitude: rawData.pluton_progresado.longitude,
        symbol: rawData.pluton_progresado.symbol
      });
    }

    // Procesar casas
    const houses = rawData.houses || [];

    // Calcular distribución elemental básica
    const elementDistribution = { fire: 25, earth: 25, air: 25, water: 25 };
    const modalityDistribution = { cardinal: 33, fixed: 33, mutable: 34 };

    // Determinar ascendente y medio cielo de las casas
    let ascendant = undefined;
    let midheaven = undefined;

    if (houses.length >= 10) {
      // Casa 1 = Ascendente
      const ascHouse = houses.find((h: any) => h.house === 1);
      if (ascHouse) {
        ascendant = {
          longitude: ascHouse.longitude,
          sign: ascHouse.sign,
          degree: ascHouse.longitude % 30
        };
      }

      // Casa 10 = Medio Cielo
      const mcHouse = houses.find((h: any) => h.house === 10);
      if (mcHouse) {
        midheaven = {
          longitude: mcHouse.longitude,
          sign: mcHouse.sign,
          degree: mcHouse.longitude % 30
        };
      }
    }

    const result = {
      planets,
      houses,
      aspects: rawData.aspectos_natales_progresados || [],
      keyAspects: rawData.aspectos_natales_progresados?.slice(0, 3) || [],
      elementDistribution,
      modalityDistribution,
      ascendant,
      midheaven,
      progressionInfo: {
        year: (() => {
          if (rawData.birthDate) {
            const birthYear = new Date(rawData.birthDate).getFullYear();
            return birthYear + (rawData.currentAge || 0);
          }
          return new Date().getFullYear();
        })(),
        period: (() => {
          if (rawData.birthDate) {
            const birthYear = new Date(rawData.birthDate).getFullYear();
            const startYear = birthYear + (rawData.currentAge || 0);
            const endYear = startYear + 1;
            return `${startYear} - ${endYear}`;
          }
          return `Año Solar ${rawData.currentAge || 'N/A'}`;
        })(),
        description: `Progresión para ${rawData.currentAge || 'N/A'} años`,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        ageAtStart: rawData.currentAge || 0,
        isCurrentYear: true
      },
      isFallback: rawData.isMockData || false,
      generatedAt: rawData.generatedAt || new Date().toISOString()
    };

    console.log('✅ Datos procesados finales:', {
      planetsCount: planets.length,
      housesCount: houses.length,
      aspectsCount: result.aspects.length,
      isMockData: result.isFallback,
      currentAge: rawData.currentAge
    });

    return result;
  };

  // ✅ FUNCIÓN: Cargar datos de nacimiento
  const loadBirthDataInfo = async () => {
    try {
      const response = await fetch(`/api/birth-data?userId=${user?.uid}`);
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data) {
          setBirthData({
            birthDate: result.data.birthDate,
            birthTime: result.data.birthTime,
            birthPlace: result.data.birthPlace,
            latitude: result.data.latitude,
            longitude: result.data.longitude,
            timezone: result.data.timezone,
            fullName: result.data.fullName
          });
        }
      }
    } catch (error) {
      console.log('⚠️ No se pudieron cargar datos de nacimiento:', error);
    }
  };

  // ✅ FUNCIÓN: Cargar carta progresada (igual que natal pero con endpoint progresado)
  const loadChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo('🔍 Cargando carta progresada...');
      
      console.log('🔍 Cargando carta progresada para usuario:', user?.uid);
      
      // Intentar cargar carta progresada existente
      const response = await fetch(`/api/charts/progressed?uid=${user?.uid}`, {
        method: 'GET'
      });
      
      console.log('📡 Respuesta carta progresada:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data) {
          console.log('✅ Carta progresada cargada correctamente');
          console.log('ℹ️ Datos recibidos:', result.data);
          console.log('ℹ️ ¿Datos mock?:', result.data.progressedChart?.isMockData === true);
          console.log('ℹ️ Fuente:', result.data.source);
          setDebugInfo('✅ Carta progresada cargada');

          try {
            const processedData = processChartData(result.data.progressedChart);
            setChartData(processedData);

            // Guardar datos en localStorage para persistencia temporal
            if (typeof window !== 'undefined') {
              localStorage.setItem('progressedChartData', JSON.stringify(processedData));
            }

            // Cargar datos de nacimiento para mostrar información
            await loadBirthDataInfo();
            return;
          } catch (processError) {
            console.error('❌ Error procesando datos de carta:', processError);
            setError('Error procesando datos de carta progresada');
            setDebugInfo(`❌ Error procesando: ${processError instanceof Error ? processError.message : 'Error desconocido'}`);
            return;
          }
        }
      }
      
      // Si no existe, generar automáticamente
      setDebugInfo('📝 Generando carta progresada automáticamente...');
      console.log('📝 No existe carta progresada, generando...');
      
      const generateResponse = await fetch('/api/charts/progressed', {
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
          console.log('✅ Carta progresada generada correctamente');
          setDebugInfo('✅ Carta progresada generada');

          try {
            const processedData = processChartData(generateResult.data.chart);
            setChartData(processedData);

            // Guardar datos generados en localStorage para persistencia temporal
            if (typeof window !== 'undefined') {
              localStorage.setItem('progressedChartData', JSON.stringify(processedData));
            }

            await loadBirthDataInfo();
          } catch (processError) {
            console.error('❌ Error procesando datos generados:', processError);
            setError('Error procesando datos generados de carta progresada');
            setDebugInfo(`❌ Error procesando generados: ${processError instanceof Error ? processError.message : 'Error desconocido'}`);
          }
        } else {
          throw new Error(generateResult.error || 'Error generando carta progresada');
        }
      } else {
        throw new Error('Error en respuesta del servidor');
      }
      
    } catch (error) {
      console.error('❌ Error cargando carta progresada:', error);
      setError(error instanceof Error ? error.message : 'Error cargando carta progresada');
      setDebugInfo(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNCIÓN: Regenerar carta progresada
  const regenerateChart = async () => {
    try {
      setIsRegenerating(true);
      setError(null);
      setDebugInfo('🔄 Regenerando carta progresada...');
      
      const regenerateResponse = await fetch('/api/charts/progressed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.uid,
          regenerate: true
        })
      });
      
      if (!regenerateResponse.ok) {
        const errorResult = await regenerateResponse.json();
        throw new Error(errorResult.error || 'Error regenerando carta progresada');
      }
      
      const regenerateResult = await regenerateResponse.json();
      
      if (!regenerateResult.success) {
        throw new Error(regenerateResult.error || 'Error al regenerar carta progresada');
      }
      
      setDebugInfo('✅ Carta progresada regenerada correctamente');
      
      let dataToProcess = null;

      if (regenerateResult.data && regenerateResult.data.chart) {
        dataToProcess = regenerateResult.data.chart;
      } else if (regenerateResult.data) {
        dataToProcess = regenerateResult.data;
      } else {
        dataToProcess = regenerateResult;
      }

      console.log('🔄 Datos para regeneración:', dataToProcess);

      if (!dataToProcess) {
        throw new Error('No se encontraron datos en la respuesta de regeneración');
      }

      try {
        const processedData = processChartData(dataToProcess);
        setChartData(processedData);

        // Guardar datos regenerados en localStorage para persistencia temporal
        if (typeof window !== 'undefined') {
          localStorage.setItem('progressedChartData', JSON.stringify(processedData));
        }
      } catch (processError) {
        console.error('❌ Error procesando datos regenerados:', processError);
        setError('Error procesando datos regenerados de carta progresada');
        setDebugInfo(`❌ Error procesando regenerados: ${processError instanceof Error ? processError.message : 'Error desconocido'}`);
      }
      
    } catch (error) {
      console.error('❌ Error regenerando carta progresada:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      setDebugInfo(`❌ Error regenerando: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsRegenerating(false);
    }
  };

  // ✅ USEEFFECT
  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    // Intentar cargar datos guardados en localStorage para persistencia temporal
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('progressedChartData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setChartData(parsedData);
          setLoading(false);
          console.log('✅ Datos cargados desde localStorage');
        } catch (e) {
          console.warn('No se pudo parsear progressedChartData de localStorage', e);
        }
      }
    }

    // Siempre intentar cargar datos frescos de la API
    loadChartData();
  }, [user, router]);

  // ✅ FUNCIONES DE NAVEGACIÓN
  const goToDashboard = () => {
    router.push('/dashboard');
  };

  const navigateToAgenda = () => {
    router.push('/agenda');
  };

  const navigateToBirthData = () => {
    router.push('/birth-data');
  };

  // ✅ PANTALLA DE CARGA
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-6">
          <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-8 backdrop-blur-sm relative mx-auto w-fit">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-full animate-pulse"></div>
            <Sparkles className="w-16 h-16 text-yellow-400 animate-spin" />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white">Cargando tu Carta Progresada</h2>
            <p className="text-gray-300 leading-relaxed">
              Procesando información astrológica...
            </p>

            {debugInfo && (
              <div className="bg-black/30 rounded-lg p-3 text-sm text-yellow-300 font-mono">
                {debugInfo}
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ PANTALLA DE ERROR
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-6">
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

              <Button
                onClick={goToDashboard}
                variant="outline"
                className="border-gray-400 text-gray-300 hover:bg-gray-400/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ PANTALLA PRINCIPAL - CARTA PROGRESADA
  if (!chartData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300">No hay datos de carta progresada disponibles</p>
          <Button
            onClick={() => loadChartData()}
            className="mt-4 bg-yellow-600 hover:bg-yellow-700"
          >
            Cargar carta
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black">
      {/* Header con navegación */}
      <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-sm border-b border-purple-700/30 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={goToDashboard}
              className="mr-4 p-2 rounded-lg hover:bg-white/10 transition-colors flex items-center text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Dashboard
            </button>
            <h1 className="text-2xl font-bold text-white flex items-center">
              <Star className="w-6 h-6 mr-3 text-yellow-400" />
              Tu Carta Progresada
            </h1>
          </div>

          <button
            onClick={regenerateChart}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center text-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerar
          </button>
        </div>
      </div>

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
            Tu Evolución Astrológica Personal
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed flex items-center justify-center gap-3">
            <Star className="w-6 h-6 text-yellow-400 flex-shrink-0" />
            Descubre cómo has crecido interiormente desde tu nacimiento y hacia dónde te diriges
          </p>

          {chartData && (
            <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-yellow-400 text-2xl font-bold">
                    {chartData.progressionInfo?.ageAtStart || 'N/A'} años
                  </div>
                  <div className="text-yellow-200 text-sm">Edad de Evolución</div>
                </div>
                <div>
                  <div className="text-orange-400 text-2xl font-bold">
                    {chartData.progressionInfo?.year || 'N/A'}
                  </div>
                  <div className="text-orange-200 text-sm">Año de Progresión</div>
                </div>
                <div>
                  <div className="text-yellow-400 text-2xl font-bold">
                    {chartData.progressionInfo?.isCurrentYear ? 'Actual' : 'Histórico'}
                  </div>
                  <div className="text-yellow-200 text-sm">Período</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Carta progresada */}
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
            />
          </div>
        )}
      </div>
    </div>
  );
}
