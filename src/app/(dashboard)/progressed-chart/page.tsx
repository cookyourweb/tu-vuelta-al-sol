// =============================================================================
// 📊 PÁGINA CARTA PROGRESADA COMPLETA - VERSIÓN DEFINITIVA
// src/app/(dashboard)/progressed-chart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Clock, Calendar, TrendingUp, Eye, BarChart3, RefreshCw, 
  Sparkles, Loader2, Star, ArrowRight, User, MapPin,
  BookOpen, Lightbulb, Zap, HelpCircle, Settings
} from 'lucide-react';

// ✅ COMPONENTE LOADING MEJORADO
function LoadingSpinner({ 
  size = 'medium', 
  message = 'Cargando...',
  subMessage 
}: { 
  size?: 'small' | 'medium' | 'large';
  message?: string;
  subMessage?: string;
}) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} text-violet-400 animate-spin`} />
        <div className="absolute -inset-4 rounded-full border-2 border-violet-400/20 animate-pulse"></div>
      </div>
      {message && (
        <div className="text-center">
          <p className="text-violet-200 text-lg font-medium animate-pulse">{message}</p>
          {subMessage && (
            <p className="text-violet-300 text-sm mt-2">{subMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ✅ INTERFACES COMPLETAS
interface ProgressedPlanet {
  longitude: number;
  sign: string;
  degree: number;
  house: number;
  retrograde?: boolean;
  symbol?: string;
  meaning?: string;
  minutes?: number;
}

interface ProgressedChartData {
  // Planetas progresados principales
  sol_progresado?: ProgressedPlanet;
  luna_progresada?: ProgressedPlanet;
  mercurio_progresado?: ProgressedPlanet;
  venus_progresada?: ProgressedPlanet;
  marte_progresado?: ProgressedPlanet;
  
  // Legacy support
  planets?: Record<string, ProgressedPlanet>;
  
  // Datos adicionales
  currentAge: number;
  houses?: any[];
  aspectos_natales_progresados?: any[];
  generatedAt: string;
  isMockData?: boolean;
  progressionPeriod?: any;
  
  // Metadata
  elementDistribution?: { fire: number; earth: number; air: number; water: number };
  modalityDistribution?: { cardinal: number; fixed: number; mutable: number };
  ascendant?: { longitude?: number; sign?: string; degree?: number };
  midheaven?: { longitude?: number; sign?: string; degree?: number };
}

interface ProgressedPeriod {
  from: string;
  to: string;
  solarYear: number;
  description?: string;
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

interface ApiResponse {
  success: boolean;
  data?: {
    progressedChart: ProgressedChartData;
    period: ProgressedPeriod;
    age?: number;
    source?: string;
    metadata?: any;
  };
  error?: string;
}

export default function ProgressedChartPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  // Estados principales
  const [chartData, setChartData] = useState<ProgressedChartData | null>(null);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [period, setPeriod] = useState<ProgressedPeriod | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [currentAge, setCurrentAge] = useState<number>(0);
  const [natalChartData, setNatalChartData] = useState<any>(null); // 🔧 AÑADIDO: Datos de carta natal para comparación

  // ✅ FUNCIÓN: Calcular edad actual
  const calculateCurrentAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // ✅ FUNCIÓN: Obtener planetas formateados
  const getFormattedPlanets = (chartData: ProgressedChartData): Array<{ name: string; data: ProgressedPlanet }> => {
    const planets: Array<{ name: string; data: ProgressedPlanet }> = [];
    
    // Planetas progresados específicos
    if (chartData.sol_progresado) planets.push({ name: 'Sol', data: chartData.sol_progresado });
    if (chartData.luna_progresada) planets.push({ name: 'Luna', data: chartData.luna_progresada });
    if (chartData.mercurio_progresado) planets.push({ name: 'Mercurio', data: chartData.mercurio_progresado });
    if (chartData.venus_progresada) planets.push({ name: 'Venus', data: chartData.venus_progresada });
    if (chartData.marte_progresado) planets.push({ name: 'Marte', data: chartData.marte_progresado });
    
    // Legacy support - planetas en formato de objeto
    if (chartData.planets && typeof chartData.planets === 'object') {
      Object.entries(chartData.planets).forEach(([name, data]) => {
        if (data && typeof data === 'object') {
          planets.push({ name: name.charAt(0).toUpperCase() + name.slice(1), data });
        }
      });
    }
    
    return planets.filter(planet => planet.data != null);
  };

  // ✅ FUNCIÓN: Cargar datos de nacimiento
  const loadBirthData = async () => {
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

          // Calcular edad
          const age = calculateCurrentAge(result.data.birthDate);
          setCurrentAge(age);

          return result.data;
        }
      }
    } catch (error) {
      console.log('⚠️ Error cargando datos de nacimiento:', error);
    }
    return null;
  };

  // 🔧 FUNCIÓN AÑADIDA: Cargar carta natal para comparación
  const loadNatalChart = async () => {
    try {
      console.log('🔍 Cargando carta natal para comparación...');
      const response = await fetch(`/api/charts/natal?userId=${user?.uid}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.natalChart) {
          setNatalChartData(result.natalChart);
          console.log('✅ Carta natal cargada para comparación');
        } else if (result.success && result.data) {
          // Fallback para estructura alternativa
          setNatalChartData(result.data);
          console.log('✅ Carta natal cargada (estructura alternativa)');
        }
      }
    } catch (error) {
      console.log('⚠️ Error cargando carta natal:', error);
    }
  };

  // ✅ FUNCIÓN: Cargar carta progresada
  const fetchProgressedChart = async (regenerate = false) => {
    if (!user) return;
    
    try {
      setDebugInfo(regenerate ? '🔄 Regenerando carta progresada...' : '🔍 Cargando carta progresada...');
      
      const url = `/api/charts/progressed?uid=${user.uid}${regenerate ? '&regenerate=true' : ''}`;
      const response = await fetch(url);
      const result: ApiResponse = await response.json();
      
      console.log('📊 Respuesta carta progresada:', result);
      
      if (result.success && result.data) {
        setChartData(result.data.progressedChart);
        setPeriod(result.data.period);
        setError(null);
        setDebugInfo('✅ Carta progresada cargada exitosamente');
        
        if (result.data.age) {
          setCurrentAge(result.data.age);
        }
        
        // Guardar en localStorage para cache
        localStorage.setItem('progressedChartData', JSON.stringify({
          chartData: result.data.progressedChart,
          period: result.data.period,
          age: result.data.age,
          generatedAt: new Date().toISOString()
        }));
      } else {
        setError(result.error || 'Error cargando carta progresada');
        setDebugInfo(`❌ Error: ${result.error || 'Error desconocido'}`);
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setError('Error de conexión al servidor');
      setDebugInfo(`❌ Error de conexión: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
      setIsRegenerating(false);
    }
  };

  // ✅ EFFECT: Cargar datos cuando el usuario esté disponible
  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    
    // Cargar datos de nacimiento, carta natal y carta progresada
    const loadData = async () => {
      await loadBirthData();
      await loadNatalChart(); // 🔧 AÑADIDO: Cargar carta natal para comparación
      await fetchProgressedChart();
    };

    loadData();
  }, [user, authLoading, router]);

  // ✅ FUNCIÓN: Regenerar carta
  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setError(null);
    await fetchProgressedChart(true);
  };

  // ✅ FUNCIÓN: Navegación
  const navigateToAgenda = () => {
    router.push('/agenda');
  };

  const navigateToNatalChart = () => {
    router.push('/natal-chart');
  };

  const navigateToBirthData = () => {
    router.push('/birth-data');
  };

  // ✅ LOADING STATE
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950">
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner 
            size="large" 
            message="Calculando tu evolución cósmica..."
            subMessage="Progresiones secundarias en proceso..."
          />
        </div>
      </div>
    );
  }

  // ✅ ERROR STATE
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-red-900/30 backdrop-blur-xl border border-red-700/30 p-8 rounded-2xl text-center max-w-md">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h2 className="text-white text-xl font-semibold mb-4">Error</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            {debugInfo && (
              <p className="text-gray-400 text-sm mb-6 font-mono bg-gray-900/50 p-3 rounded-lg">
                {debugInfo}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => fetchProgressedChart()}
                className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl transition-colors"
              >
                Reintentar
              </button>
              <button 
                onClick={navigateToBirthData}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-colors"
              >
                Verificar Datos
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ OBTENER PLANETAS FORMATEADOS
  const formattedPlanets = chartData ? getFormattedPlanets(chartData) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950">
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border-2 border-violet-400/10 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 border-2 border-purple-400/10 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/2 w-32 h-32 border-2 border-indigo-400/10 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
        
        {/* Estrellas de fondo */}
        <div className="absolute top-20 left-20 w-1 h-1 bg-violet-300 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-300 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-40 w-1 h-1 bg-indigo-300 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Mejorado */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6 bg-violet-900/30 backdrop-blur-xl border border-violet-700/30 px-8 py-4 rounded-2xl">
            <TrendingUp className="w-8 h-8 text-violet-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
              Tu Carta Progresada
            </h1>
            <Sparkles className="w-6 h-6 text-violet-400 animate-pulse" />
          </div>
          
          <p className="text-violet-200 text-lg mb-4">
            Evolución astrológica desde tu nacimiento hasta ahora
          </p>
          
          {birthData && (
            <div className="flex items-center justify-center gap-6 text-violet-300 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{birthData.fullName}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{birthData.birthPlace}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{new Date(birthData.birthDate).toLocaleDateString('es-ES')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Información del Período */}
        {period && chartData && (
          <div className="bg-violet-900/20 backdrop-blur-xl border border-violet-700/30 rounded-2xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-violet-800/20 rounded-xl p-6">
                <div className="text-violet-300 text-sm font-medium mb-2">Edad Actual</div>
                <div className="text-3xl font-bold text-white mb-1">{currentAge || chartData.currentAge}</div>
                <div className="text-violet-400 text-sm">
                  {currentAge >= 50 ? 'Fase de consolidación y sabiduría' : 'Fase de desarrollo y expansión'}
                </div>
              </div>
              
              <div className="bg-purple-800/20 rounded-xl p-6">
                <div className="text-purple-300 text-sm font-medium mb-2">Período Solar</div>
                <div className="text-xl font-semibold text-white mb-1">{period.from} → {period.to}</div>
                <div className="text-purple-400 text-sm">
                  {period.description || 'Año solar personal'}
                </div>
              </div>
              
              <div className="bg-indigo-800/20 rounded-xl p-6">
                <div className="text-indigo-300 text-sm font-medium mb-2">Enfoque Evolutivo</div>
                <div className="text-lg font-semibold text-white mb-1">
                  {currentAge >= 50 ? 'Integración Profunda' : 'Crecimiento Activo'}
                </div>
                <div className="text-indigo-400 text-sm">
                  {currentAge >= 50 ? 'Progresiones más sutiles' : 'Cambios más evidentes'}
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button 
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                {isRegenerating ? 'Regenerando...' : 'Actualizar Carta'}
              </button>
              
              <button 
                onClick={navigateToAgenda}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Ver Agenda Personalizada
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button 
                onClick={navigateToNatalChart}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-colors"
              >
                <Star className="w-4 h-4" />
                Comparar con Natal
              </button>
            </div>
          </div>
        )}

        {/* Debug Info */}
        {debugInfo && (
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <Settings className="w-4 h-4" />
              <span className="font-mono">{debugInfo}</span>
            </div>
          </div>
        )}

        {/* Planetas Progresados */}
        {formattedPlanets.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-violet-400" />
              <h2 className="text-2xl font-bold text-white">Planetas Progresados</h2>
              <div className="text-violet-300 text-sm">
                ({formattedPlanets.length} planetas analizados)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formattedPlanets.map(({ name, data }) => (
                <div key={name} className="bg-violet-900/20 backdrop-blur-xl border border-violet-700/30 rounded-2xl p-6 hover:bg-violet-900/30 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {getPlanetSymbol(name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{name} Progresado</h3>
                      <p className="text-violet-300 text-sm">
                        {data?.degree ? data.degree.toFixed(1) : '0'}° {data?.sign || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-violet-400">Casa:</span>
                      <span className="text-white font-medium">{data?.house || 'N/A'}</span>
                    </div>

                    {data?.retrograde && (
                      <div className="flex justify-between text-sm">
                        <span className="text-violet-400">Retrógrado:</span>
                        <span className="text-orange-400 font-medium">Sí</span>
                      </div>
                    )}

                    {data?.meaning && (
                      <div className="mt-3 p-3 bg-violet-800/30 rounded-lg">
                        <p className="text-xs text-violet-200 italic leading-relaxed">
                          {data.meaning}
                        </p>
                      </div>
                    )}

                    <div className="text-xs text-violet-300 italic border-t border-violet-700/30 pt-3">
                      Energía de {name} evolucionando en {data?.sign || 'desarrollo'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🔧 SECCIÓN AÑADIDA: Ascendente y Medio Cielo Progresados */}
        {chartData?.ascendant && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-indigo-400" />
              <h2 className="text-2xl font-bold text-white">Puntos Angulares Progresados</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-indigo-900/20 backdrop-blur-xl border border-indigo-700/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    AC
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Ascendente Progresado</h3>
                    <p className="text-indigo-300 text-sm">
                      {chartData.ascendant.degree?.toFixed(1) || '0'}° {chartData.ascendant.sign || 'N/A'}
                    </p>
                  </div>
                </div>
                <p className="text-indigo-200 text-sm">
                  Tu máscara social y primera impresión evolucionan. Representa cómo te presentas al mundo en esta etapa de tu vida.
                </p>
              </div>

              {chartData.midheaven && (
                <div className="bg-indigo-900/20 backdrop-blur-xl border border-indigo-700/30 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      MC
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">Medio Cielo Progresado</h3>
                      <p className="text-indigo-300 text-sm">
                        {chartData.midheaven.degree?.toFixed(1) || '0'}° {chartData.midheaven.sign || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <p className="text-indigo-200 text-sm">
                    Tu carrera, reputación y aspiraciones públicas se transforman. Indica tu dirección profesional y social.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🔧 SECCIÓN AÑADIDA: Casas Progresadas */}
        {chartData?.houses && chartData.houses.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold text-white">Casas Progresadas</h2>
              <div className="text-emerald-300 text-sm">
                ({chartData.houses.length} casas calculadas)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chartData.houses.map((house: any) => (
                <div key={house.house} className="bg-emerald-900/20 backdrop-blur-xl border border-emerald-700/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">Casa {house.house}</h4>
                    <span className="text-emerald-300 text-sm">
                      {house.sign || 'N/A'}
                    </span>
                  </div>
                  <p className="text-emerald-200 text-xs">
                    {getHouseMeaning(house.house)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🔧 SECCIÓN AÑADIDA: Distribución Elemental y Modal */}
        {chartData?.elementDistribution && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">Distribución Energética</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-amber-900/20 backdrop-blur-xl border border-amber-700/30 rounded-2xl p-6">
                <h3 className="font-semibold text-white text-lg mb-4">Elementos</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-300">Fuego 🔥</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-amber-800/30 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${(chartData.elementDistribution.fire / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white text-sm w-8">{chartData.elementDistribution.fire}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-300">Tierra 🌱</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-amber-800/30 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(chartData.elementDistribution.earth / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white text-sm w-8">{chartData.elementDistribution.earth}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-300">Aire 💨</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-amber-800/30 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(chartData.elementDistribution.air / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white text-sm w-8">{chartData.elementDistribution.air}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-300">Agua 🌊</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-amber-800/30 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(chartData.elementDistribution.water / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white text-sm w-8">{chartData.elementDistribution.water}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-900/20 backdrop-blur-xl border border-amber-700/30 rounded-2xl p-6">
                <h3 className="font-semibold text-white text-lg mb-4">Modalidades</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-300">Cardinal ♈♋♎♑</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-amber-800/30 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${((chartData.modalityDistribution?.cardinal || 0) / 4) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white text-sm w-8">{chartData.modalityDistribution?.cardinal || 0}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-300">Fijo ♉♌♏♒</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-amber-800/30 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${((chartData.modalityDistribution?.fixed || 0) / 4) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white text-sm w-8">{chartData.modalityDistribution?.fixed || 0}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-300">Mutable ♊♍♐♓</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-amber-800/30 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${((chartData.modalityDistribution?.mutable || 0) / 4) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white text-sm w-8">{chartData.modalityDistribution?.mutable || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 🔧 SECCIÓN AÑADIDA: Comparación con Carta Natal */}
        {natalChartData && chartData && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-rose-400" />
              <h2 className="text-2xl font-bold text-white">Comparación Natal vs Progresada</h2>
            </div>

            <div className="bg-rose-900/20 backdrop-blur-xl border border-rose-700/30 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Sol */}
                {(() => {
                  // Buscar Sol en natal chart (manejar diferentes estructuras)
                  const natalSun = natalChartData.planets?.find((p: any) => p.name === 'Sol') ||
                                 natalChartData.sol;
                  const progressedSun = chartData.sol_progresado;

                  if (natalSun && progressedSun) {
                    return (
                      <div className="bg-rose-800/20 rounded-xl p-4">
                        <h4 className="font-semibold text-white mb-2">Sol ☉</h4>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-rose-300">Natal:</span>
                            <span className="text-white">{natalSun.degree?.toFixed(1) || natalSun.degree || '0'}° {natalSun.sign || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-rose-300">Progresado:</span>
                            <span className="text-white">{progressedSun.degree?.toFixed(1) || '0'}° {progressedSun.sign || 'N/A'}</span>
                          </div>
                          <div className="text-xs text-rose-400 mt-2">
                            Diferencia: {Math.abs((progressedSun.longitude || 0) - (natalSun.longitude || 0)).toFixed(1)}°
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Luna */}
                {(() => {
                  const natalMoon = natalChartData.planets?.find((p: any) => p.name === 'Luna') ||
                                  natalChartData.luna;
                  const progressedMoon = chartData.luna_progresada;

                  if (natalMoon && progressedMoon) {
                    return (
                      <div className="bg-rose-800/20 rounded-xl p-4">
                        <h4 className="font-semibold text-white mb-2">Luna ☽</h4>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-rose-300">Natal:</span>
                            <span className="text-white">{natalMoon.degree?.toFixed(1) || natalMoon.degree || '0'}° {natalMoon.sign || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-rose-300">Progresado:</span>
                            <span className="text-white">{progressedMoon.degree?.toFixed(1) || '0'}° {progressedMoon.sign || 'N/A'}</span>
                          </div>
                          <div className="text-xs text-rose-400 mt-2">
                            Diferencia: {Math.abs((progressedMoon.longitude || 0) - (natalMoon.longitude || 0)).toFixed(1)}°
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Ascendente */}
                {(() => {
                  const natalAsc = natalChartData.ascendant || natalChartData.ascendente;
                  const progressedAsc = chartData.ascendant;

                  if (natalAsc && progressedAsc) {
                    return (
                      <div className="bg-rose-800/20 rounded-xl p-4">
                        <h4 className="font-semibold text-white mb-2">Ascendente AC</h4>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-rose-300">Natal:</span>
                            <span className="text-white">{natalAsc.degree?.toFixed(1) || natalAsc.degree || '0'}° {natalAsc.sign || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-rose-300">Progresado:</span>
                            <span className="text-white">{progressedAsc.degree?.toFixed(1) || '0'}° {progressedAsc.sign || 'N/A'}</span>
                          </div>
                          <div className="text-xs text-rose-400 mt-2">
                            Diferencia: {Math.abs((progressedAsc.longitude || 0) - (natalAsc.longitude || 0)).toFixed(1)}°
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              <div className="mt-6 p-4 bg-rose-800/30 rounded-lg">
                <p className="text-rose-200 text-sm">
                  <strong>Interpretación:</strong> Las posiciones progresadas muestran cómo han evolucionado tus energías planetarias desde el nacimiento.
                  Cada día después del nacimiento equivale aproximadamente a un año de vida, revelando cambios sutiles pero profundos en tu personalidad y experiencias.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje si no hay planetas */}
        {chartData && formattedPlanets.length === 0 && (
          <div className="bg-yellow-900/30 backdrop-blur-xl border border-yellow-700/30 p-8 rounded-2xl text-center mb-8">
            <div className="text-yellow-400 text-3xl mb-4">⚠️</div>
            <h3 className="text-yellow-200 font-semibold text-lg mb-2">Sin Datos de Planetas</h3>
            <p className="text-yellow-300 text-sm mb-4">
              No se pudieron cargar los datos de planetas progresados. Esto puede deberse a:
            </p>
            <ul className="text-yellow-300 text-sm text-left max-w-md mx-auto space-y-1">
              <li>• Datos de nacimiento incompletos</li>
              <li>• Error temporal en el servicio de cálculos</li>
              <li>• Necesidad de regenerar la carta</li>
            </ul>
            <button 
              onClick={handleRegenerate}
              className="mt-6 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-xl transition-colors"
            >
              Intentar Regenerar
            </button>
          </div>
        )}

        {/* Información adicional */}
        {chartData?.aspectos_natales_progresados && chartData.aspectos_natales_progresados.length > 0 && (
          <div className="bg-indigo-900/20 backdrop-blur-xl border border-indigo-700/30 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-indigo-400" />
              <h3 className="text-xl font-bold text-white">Aspectos Progresados</h3>
            </div>
            <div className="text-indigo-200 text-sm">
              Se encontraron {chartData.aspectos_natales_progresados.length} aspectos progresados activos.
              Esta funcionalidad se expandirá en futuras versiones.
            </div>
          </div>
        )}

        {/* Warning datos mock */}
        {chartData?.isMockData && (
          <div className="bg-yellow-900/30 backdrop-blur-xl border border-yellow-700/30 p-6 rounded-2xl text-center">
            <div className="text-yellow-400 text-2xl mb-2">⚠️</div>
            <p className="text-yellow-200 font-medium">Datos de Ejemplo</p>
            <p className="text-yellow-300 text-sm mt-2">
              Estamos perfeccionando los cálculos progresados. Los datos mostrados son aproximados para demostración.
            </p>
          </div>
        )}

        {/* Footer educativo */}
        <div className="mt-12 bg-violet-900/10 backdrop-blur-xl border border-violet-700/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-5 h-5 text-violet-400" />
            <h4 className="text-white font-semibold">¿Qué es la Carta Progresada?</h4>
          </div>
          <p className="text-violet-200 text-sm leading-relaxed">
            La carta progresada muestra cómo han evolucionado las energías planetarias desde tu nacimiento. 
            Cada día después del nacimiento equivale a un año de vida (progresiones secundarias), 
            revelando ciclos de crecimiento, cambios internos y nuevas etapas de desarrollo personal.
          </p>
        </div>
      </div>
    </div>
  );
}

// ✅ FUNCIÓN: Obtener símbolos planetarios
function getPlanetSymbol(planetName: string): string {
  const symbols: Record<string, string> = {
    'sol': '☉',
    'luna': '☽',
    'mercurio': '☿',
    'venus': '♀',
    'marte': '♂',
    'jupiter': '♃',
    'saturno': '♄',
    'urano': '♅',
    'neptuno': '♆',
    'pluton': '♇',
    'plutón': '♇'
  };

  const key = planetName.toLowerCase().replace(' progresado', '').replace(' progresada', '');
  return symbols[key] || planetName?.[0]?.toUpperCase() || '●';
}

// ✅ FUNCIÓN: Obtener significado de las casas
function getHouseMeaning(houseNumber: number): string {
  const meanings: Record<number, string> = {
    1: 'Identidad, apariencia, primeros impulsos',
    2: 'Valores, recursos, autoestima financiera',
    3: 'Comunicación, aprendizaje, hermanos',
    4: 'Hogar, familia, raíces emocionales',
    5: 'Creatividad, romance, hijos',
    6: 'Trabajo diario, salud, servicio',
    7: 'Relaciones, matrimonio, asociaciones',
    8: 'Transformación, sexualidad, recursos compartidos',
    9: 'Filosofía, viajes, educación superior',
    10: 'Carrera, reputación, autoridad',
    11: 'Amigos, grupos, aspiraciones',
    12: 'Espiritualidad, subconsciente, sacrificio'
  };

  return meanings[houseNumber] || 'Significado astrológico de la casa';
}
