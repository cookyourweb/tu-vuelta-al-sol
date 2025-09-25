'use client';

// =============================================================================
// 🌟 PÁGINA CARTA PROGRESADA - UX MEJORADA Y DIFERENCIADA
// src/app/(dashboard)/progressed-chart/page.tsx
// =============================================================================

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ChartDisplay from '@/components/astrology/ChartDisplay';
import InterpretationButton from '@/components/astrology/InterpretationButton';
import { Sparkles, Edit, TrendingUp, RefreshCw, Calendar, Clock, Star, Zap, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/Button';

// ✅ INTERFACES COMPLETAS
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

interface NatalChartData {
  planets: any[];
  houses: any[];
  aspects?: any[];
  keyAspects?: any[];
  elementDistribution: { fire: number; earth: number; air: number; water: number };
  modalityDistribution: { cardinal: number; fixed: number; mutable: number };
  ascendant?: { longitude?: number; sign?: string; degree?: number };
  midheaven?: { longitude?: number; sign?: string; degree?: number };
}

export default function ProgressedChartPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  // Estados principales
  const [chartData, setChartData] = useState<ProgressedChartData | null>(null);
  const [natalChartData, setNatalChartData] = useState<NatalChartData | null>(null);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  // ✅ FUNCIÓN: Procesar datos de carta progresada
  const processProgressedChartData = (rawData: any): ProgressedChartData => {
    console.log('🔍 Datos recibidos para procesar:', rawData);
    
    if (!rawData) {
      throw new Error('No hay datos para procesar');
    }

    // Los datos pueden venir en diferentes estructuras
    let actualData = rawData;
    
    // Si los datos vienen envueltos en un objeto 'data'
    if (rawData.data && !rawData.planets) {
      actualData = rawData.data;
    }
    
    // Si los datos vienen como 'progressedChart'
    if (rawData.progressedChart) {
      actualData = rawData.progressedChart;
    }

    console.log('🔍 Datos reales a procesar:', actualData);

    return {
      planets: actualData.planets || [],
      houses: actualData.houses || [],
      aspects: actualData.aspects || [],
      keyAspects: actualData.keyAspects || actualData.aspects || [],
      elementDistribution: actualData.elementDistribution || { fire: 25, earth: 25, air: 25, water: 25 },
      modalityDistribution: actualData.modalityDistribution || { cardinal: 33, fixed: 33, mutable: 34 },
      ascendant: actualData.ascendant || null,
      midheaven: actualData.midheaven || null,
      progressionInfo: actualData.progressionInfo || actualData.progressionPeriod || null,
      isFallback: actualData.isFallback || false,
      generatedAt: actualData.generatedAt || new Date().toISOString()
    };
  };

  // ✅ FUNCIÓN: Procesar datos de carta natal
  const processNatalChartData = (rawData: any): NatalChartData => {
    if (!rawData) {
      throw new Error('No hay datos de carta natal');
    }

    return {
      planets: rawData.planets || [],
      houses: rawData.houses || [],
      aspects: rawData.aspects || [],
      keyAspects: rawData.keyAspects || [],
      elementDistribution: rawData.elementDistribution || { fire: 25, earth: 25, air: 25, water: 25 },
      modalityDistribution: rawData.modalityDistribution || { cardinal: 33, fixed: 33, mutable: 34 },
      ascendant: rawData.ascendant || null,
      midheaven: rawData.midheaven || null
    };
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

  // ✅ FUNCIÓN: Cargar carta natal
  const loadNatalChart = async () => {
    try {
      const response = await fetch(`/api/charts/natal?userId=${user?.uid}`, {
        method: 'GET'
      });
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.natalChart) {
          const processedNatalData = processNatalChartData(result.natalChart);
          setNatalChartData(processedNatalData);
          return processedNatalData;
        }
      }
      return null;
    } catch (error) {
      console.log('⚠️ No se pudo cargar carta natal:', error);
      return null;
    }
  };

  // ✅ FUNCIÓN: Cargar carta progresada
  const loadProgressedChart = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo('🔍 Cargando carta progresada...');
      
      console.log('🔍 Cargando carta progresada para usuario:', user?.uid);
      
      // Primero cargar carta natal (necesaria para progresada)
      await loadNatalChart();
      
      // Intentar cargar carta progresada existente
      const response = await fetch(`/api/charts/progressed?userId=${user?.uid}`, {
        method: 'GET'
      });
      
      console.log('📡 Respuesta carta progresada:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && (result.data?.progressedChart || result.progressedChart)) {
          console.log('✅ Carta progresada cargada correctamente');
          setDebugInfo('✅ Carta progresada cargada');
          
          const dataToProcess = result.data?.progressedChart || result.progressedChart || result.data;
          console.log('🔍 Datos para procesar:', dataToProcess);
          
          const processedData = processProgressedChartData(dataToProcess);
          setChartData(processedData);
          
          // Cargar datos de nacimiento para mostrar información
          await loadBirthDataInfo();
          return;
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
          
          const dataToProcess = generateResult.data?.progressedChart || generateResult.progressedChart || generateResult.data;
          console.log('🔍 Datos para procesar:', dataToProcess);
          
          const processedData = processProgressedChartData(dataToProcess);
          setChartData(processedData);
          
          await loadBirthDataInfo();
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

      const dataToProcess = regenerateResult.data?.progressedChart || regenerateResult.progressedChart || regenerateResult.data;
      console.log('🔄 Datos para regeneración:', dataToProcess);

      if (!dataToProcess) {
        throw new Error('No se encontraron datos en la respuesta de regeneración');
      }

      const processedData = processProgressedChartData(dataToProcess);
      setChartData(processedData);
      
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
    
    loadProgressedChart();
  }, [user, router]);

  // ✅ FUNCIONES DE NAVEGACIÓN
  const navigateToBirthData = () => {
    router.push('/birth-data');
  };

  // ✅ PANTALLA DE CARGA
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6 max-w-md mx-auto">
          {/* ICONO DIFERENCIADO - PROGRESIÓN CON GRADIENTE PÚRPURA */}
          <div className="bg-gradient-to-br from-purple-500/20 via-violet-500/20 to-indigo-500/20 border-2 border-purple-400/40 rounded-full p-8 backdrop-blur-sm relative mx-auto w-fit">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-violet-500/10 rounded-full animate-pulse"></div>
            <div className="relative flex items-center justify-center">
              <TrendingUp className="w-12 h-12 text-purple-300 animate-pulse" />
              <RotateCcw className="w-6 h-6 text-violet-400 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-300 via-violet-300 to-indigo-300 bg-clip-text text-transparent">
              Cargando tu Carta Progresada
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Procesando tu evolución astrológica...
            </p>

            {debugInfo && (
              <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3 text-sm text-purple-200 font-mono">
                {debugInfo}
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.3}s` }}
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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-400/40 rounded-full p-8 backdrop-blur-sm mx-auto w-fit">
            <TrendingUp className="w-16 h-16 text-red-300" />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Error al cargar carta progresada</h2>
            <p className="text-gray-300">{error}</p>

            {debugInfo && (
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 text-sm text-red-200 font-mono text-left">
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
                  onClick={() => loadProgressedChart()}
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

  // ✅ PANTALLA PRINCIPAL - CARTA PROGRESADA (DIFERENCIADA)
  if (!chartData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-300">No hay datos de carta progresada disponibles</p>
          <Button
            onClick={() => loadProgressedChart()}
            className="mt-4 bg-purple-600 hover:bg-purple-700"
          >
            Cargar carta progresada
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header principal DIFERENCIADO PÚRPURA */}
      <div className="text-center space-y-6">
        <div className="flex justify-center items-center mb-6">
          <div className="bg-gradient-to-br from-purple-500/25 via-violet-500/25 to-indigo-500/25 border-2 border-purple-400/50 rounded-full p-6 backdrop-blur-sm relative">
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="relative flex items-center justify-center">
              <TrendingUp className="w-12 h-12 text-purple-300" />
              <Zap className="w-5 h-5 text-violet-400 absolute -top-1 -right-1" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl text-white font-bold">
          Carta Progresada{' '}
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Tu Evolución Cósmica
          </span>
        </h1>

        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed flex items-center justify-center gap-3">
          <TrendingUp className="w-6 h-6 text-purple-400 flex-shrink-0" />
          Descubre cómo has evolucionado desde tu nacimiento y hacia dónde te diriges
        </p>

        {/* Información de progresión MEJORADA */}
        {chartData.progressionInfo && (
          <div className="bg-gradient-to-br from-purple-900/40 via-violet-900/40 to-indigo-900/40 border-2 border-purple-400/30 rounded-xl p-6 max-w-2xl mx-auto backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-purple-300" />
              <h3 className="text-lg font-semibold text-white">Período de Progresión Actual</h3>
              <Star className="w-4 h-4 text-violet-300 animate-pulse" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-purple-200">Año:</span>
                  <span className="text-white font-medium">{chartData.progressionInfo.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Edad:</span>
                  <span className="text-white font-medium">{chartData.progressionInfo.ageAtStart} años</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-purple-200">Período:</span>
                  <span className="text-white font-medium text-xs">{chartData.progressionInfo.period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Estado:</span>
                  <span className={`font-medium ${chartData.progressionInfo.isCurrentYear ? 'text-green-300' : 'text-amber-300'}`}>
                    {chartData.progressionInfo.isCurrentYear ? 'Activo' : 'Proyección'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LAYOUT IGUAL QUE NATAL CHART */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
            Detalles de tu Carta Progresada
          </h2>

          <div className="bg-gradient-to-r from-purple-900/30 via-violet-900/30 to-indigo-900/30 border border-purple-500/30 rounded-lg p-4">
            <p className="text-gray-300 leading-relaxed">
              <span className="font-medium text-purple-200">Evolución Personal:</span> Tu carta progresada muestra cómo has evolucionado astrológicamente desde tu nacimiento. Cada planeta progresado refleja el crecimiento y los cambios en diferentes áreas de tu vida.
              <br className="my-2" />
              <span className="font-medium text-violet-200">Progresión Secundaria:</span> Este método calcula un día de vida por cada año transcurrido, revelando tu desarrollo interno y las lecciones que has integrado.
            </p>
          </div>

          {chartData.isFallback && (
            <div className="bg-amber-900/30 border border-amber-500/30 rounded-lg p-3">
              <p className="text-amber-200 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Datos de demostración. Regenera para obtener tu carta progresada real.
              </p>
            </div>
          )}
        </div>

        {/* Botones de acción IGUAL QUE NATAL */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* BOTÓN DE INTERPRETACIÓN */}
          <InterpretationButton
            chartData={chartData}
            natalChart={natalChartData}
            className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
            type="progressed"
            userId={user?.uid || ''}
            userProfile={{
              name: birthData?.fullName || 'Usuario',
              age: chartData.progressionInfo?.ageAtStart || 0,
              birthPlace: birthData?.birthPlace || '',
              birthDate: birthData?.birthDate || '',
              birthTime: birthData?.birthTime || ''
            }}
          />

          {/* BOTÓN DE REGENERAR */}
          <Button
            onClick={regenerateChart}
            disabled={isRegenerating}
            className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 flex items-center justify-center gap-2"
          >
            {isRegenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Regenerando...</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>Regenerar Carta</span>
              </>
            )}
          </Button>
        </div>
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
            aspects={chartData.aspects || []}
            ascendant={chartData.ascendant}
            midheaven={chartData.midheaven}
            birthData={birthData || undefined}
            chartType="progressed"
          />
        </div>
      )}

      {/* Debug info */}
      {debugInfo && (
        <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-3 max-w-2xl mx-auto">
          <p className="text-purple-200 text-xs font-mono text-center">{debugInfo}</p>
        </div>
      )}
    </div>
  );
}