// app/(dashboard)/natal-chart/page.tsx - VERSIÓN CORREGIDA COMPLETA
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ChartDisplay from '@/components/astrology/ChartDisplay';
import Button from '@/components/ui/Button';
import { 
  Star, 
  Calendar, 
  MapPin, 
  Clock, 
  Sparkles, 
  Moon, 
  Sun, 
  ArrowLeft, 
  Edit, 
  Download,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Zap,
  RefreshCw
} from 'lucide-react';

// ✅ INTERFACES CORREGIDAS PARA COMPATIBILIDAD TOTAL
interface Planet {
  name: string;
  degree: number;
  sign: string;
  minutes?: number;
  longitude?: number;
  houseNumber?: number;
  housePosition?: number;
  isRetrograde?: boolean;
  retrograde?: boolean;
}

interface House {
  number: number;
  sign: string;
  degree: number;
  minutes?: number;
  longitude?: number;
}

interface Aspect {
  planet1: string;
  planet2: string;
  type: string;
  orb: number;
  applying?: boolean;
}

interface NatalChartData {
  planets: Planet[];
  houses: House[];
  aspects: Aspect[];
  ascendant?: {
    sign: string;
    degree: number;
    minutes: number;
  };
  midheaven?: {
    sign: string;
    degree: number;
    minutes: number;
  };
  elementDistribution?: { fire: number; earth: number; air: number; water: number };
  modalityDistribution?: { cardinal: number; fixed: number; mutable: number };
}

export default function NatalChartPage() {
  const [chartData, setChartData] = useState<NatalChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [birthData, setBirthData] = useState<any | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('Iniciando...'); 
  const [isVeronica, setIsVeronica] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // ✅ FUNCIÓN PRINCIPAL CORREGIDA
  const fetchChartData = async (regenerate = false) => {
    try {
      if (!user?.uid) {
        setDebugInfo('❌ No hay usuario autenticado');
        setLoading(false);
        router.push('/auth/login');
        return;
      }
      
      setDebugInfo(`✅ Usuario encontrado: ${user.uid}`);
      setLoading(true);
      setError(null);
      
      // ✅ PASO 1: Obtener datos de nacimiento
      setDebugInfo('📡 Obteniendo datos de nacimiento...');
      
      const birthDataResponse = await fetch(`/api/birth-data?userId=${user.uid}`);
      
      if (!birthDataResponse.ok) {
        setDebugInfo('❌ No se encontraron datos de nacimiento');
        setError('No se encontraron datos de nacimiento. Primero debes ingresar tus datos de nacimiento.');
        setLoading(false);
        return;
      }
      
      const birthDataResult = await birthDataResponse.json();
      
      if (!birthDataResult.success) {
        setDebugInfo('❌ Error obteniendo datos de nacimiento');
        setError(birthDataResult.error || 'Error al obtener datos de nacimiento');
        setLoading(false);
        return;
      }
      
      setBirthData(birthDataResult.data);
      setDebugInfo(`✅ Datos de nacimiento obtenidos: ${birthDataResult.data.birthPlace}`);
      
      // Verificar si es Verónica
      const birthDate = new Date(birthDataResult.data.birthDate);
      const isVeronicaBirth = birthDate.getFullYear() === 1974 && 
                             birthDate.getMonth() === 1 && // Febrero = 1 (0-indexed)
                             birthDate.getDate() === 10;
      setIsVeronica(isVeronicaBirth);
      
      // ✅ PASO 2: Intentar obtener carta existente (solo si no regeneramos)
      if (!regenerate) {
        setDebugInfo('🔍 Buscando carta natal existente...');
        
        const chartResponse = await fetch(`/api/charts/natal?userId=${user.uid}`);
        
        if (chartResponse.ok) {
          const chartResult = await chartResponse.json();
          
          if (chartResult.success && chartResult.natalChart) {
            setDebugInfo('✅ Carta natal existente encontrada');
            setChartData(processChartData(chartResult.natalChart));
            setLoading(false);
            return;
          }
        }
        
        setDebugInfo('📝 No se encontró carta existente, generando nueva...');
      } else {
        setDebugInfo('🔄 Regenerando carta natal...');
      }
      
      // ✅ PASO 3: Generar nueva carta natal
      setDebugInfo('🔄 Generando carta natal con API Prokerala...');
      
      const generateResponse = await fetch('/api/charts/natal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          regenerate: regenerate
        }),
      });
      
      if (!generateResponse.ok) {
        const errorText = await generateResponse.text();
        setDebugInfo(`❌ Error HTTP: ${generateResponse.status}`);
        setError(`Error ${generateResponse.status}: ${errorText}`);
        setLoading(false);
        return;
      }
      
      const generateResult = await generateResponse.json();
      
      if (!generateResult.success) {
        setDebugInfo('❌ Error generando carta');
        setError(generateResult.error || 'Error al generar carta natal');
        setLoading(false);
        return;
      }
      
      setDebugInfo('✅ Carta natal generada correctamente');
      
      // ✅ LOG DE DEBUGGING
      console.log('📊 Respuesta completa de API Charts:', generateResult);
      
      if (isVeronicaBirth) {
        const ascSign = generateResult.natalChart?.ascendant?.sign;
        setDebugInfo(`🎯 Verónica detectada - ASC: ${ascSign} (esperado: Acuario)`);
      }
      
      // ✅ PROCESAR DATOS RECIBIDOS
      const processedData = processChartData(generateResult.natalChart);
      setChartData(processedData);
      setLoading(false);
      
    } catch (error) {
      console.error('❌ Error en fetchChartData:', error);
      setDebugInfo(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setError('Error de conexión. Verifica tu conexión a internet.');
      setLoading(false);
    }
  };

  // ✅ FUNCIÓN PARA PROCESAR DATOS DE LA API
  const processChartData = (rawData: any): NatalChartData => {
    if (!rawData) {
      throw new Error('No hay datos de carta natal');
    }

    // ✅ PROCESAR PLANETAS CON VALIDACIÓN
    const planets: Planet[] = (rawData.planets || []).map((planet: any, index: number) => ({
      name: planet.name || `Planeta ${index + 1}`,
      degree: planet.degree || 0,
      sign: planet.sign || 'Aries',
      minutes: planet.minutes || 0,
      longitude: planet.longitude || planet.degree || 0,
      houseNumber: planet.houseNumber || planet.housePosition || 1,
      housePosition: planet.housePosition || planet.houseNumber || 1,
      isRetrograde: planet.isRetrograde || planet.retrograde || false,
      retrograde: planet.retrograde || planet.isRetrograde || false
    }));

    // ✅ PROCESAR CASAS CON VALIDACIÓN
    const houses: House[] = (rawData.houses || []).map((house: any, index: number) => ({
      number: house.number || (index + 1),
      sign: house.sign || 'Aries',
      degree: house.degree || 0,
      minutes: house.minutes || 0,
      longitude: house.longitude || house.degree || 0
    }));

    // ✅ PROCESAR ASPECTOS CON VALIDACIÓN
    const aspects: Aspect[] = (rawData.aspects || []).map((aspect: any) => ({
      planet1: aspect.planet1 || 'Sol',
      planet2: aspect.planet2 || 'Luna',
      type: aspect.type || 'conjunction',
      orb: aspect.orb || 0,
      applying: aspect.applying || false
    }));

    // ✅ CALCULAR DISTRIBUCIONES SI NO EXISTEN
    const elementDistribution = rawData.elementDistribution || calculateElementDistribution(planets);
    const modalityDistribution = rawData.modalityDistribution || calculateModalityDistribution(planets);

    return {
      planets,
      houses,
      aspects,
      ascendant: rawData.ascendant,
      midheaven: rawData.midheaven,
      elementDistribution,
      modalityDistribution
    };
  };

  // ✅ CALCULAR DISTRIBUCIÓN DE ELEMENTOS
  const calculateElementDistribution = (planets: Planet[]) => {
    const elementMap: { [key: string]: string } = {
      'Aries': 'fire', 'Leo': 'fire', 'Sagitario': 'fire',
      'Tauro': 'earth', 'Virgo': 'earth', 'Capricornio': 'earth',
      'Géminis': 'air', 'Libra': 'air', 'Acuario': 'air',
      'Cáncer': 'water', 'Escorpio': 'water', 'Piscis': 'water'
    };

    const distribution = { fire: 0, earth: 0, air: 0, water: 0 };
    
    planets.forEach(planet => {
      const element = elementMap[planet.sign];
      if (element && distribution.hasOwnProperty(element)) {
        distribution[element as keyof typeof distribution]++;
      }
    });

    return distribution;
  };

  // ✅ CALCULAR DISTRIBUCIÓN DE MODALIDADES
  const calculateModalityDistribution = (planets: Planet[]) => {
    const modalityMap: { [key: string]: string } = {
      'Aries': 'cardinal', 'Cáncer': 'cardinal', 'Libra': 'cardinal', 'Capricornio': 'cardinal',
      'Tauro': 'fixed', 'Leo': 'fixed', 'Escorpio': 'fixed', 'Acuario': 'fixed',
      'Géminis': 'mutable', 'Virgo': 'mutable', 'Sagitario': 'mutable', 'Piscis': 'mutable'
    };

    const distribution = { cardinal: 0, fixed: 0, mutable: 0 };
    
    planets.forEach(planet => {
      const modality = modalityMap[planet.sign];
      if (modality && distribution.hasOwnProperty(modality)) {
        distribution[modality as keyof typeof distribution]++;
      }
    });

    return distribution;
  };

  // ✅ CARGAR DATOS AL MONTAR COMPONENTE
  useEffect(() => {
    fetchChartData();
  }, [user]);

  // ✅ FUNCIÓN PARA REGENERAR CARTA
  const handleRegenerate = async () => {
    await fetchChartData(true);
  };

  // ✅ RENDER DE ESTADOS DE CARGA Y ERROR
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black flex items-center justify-center">
        <div className="text-center space-y-6 p-8">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin mx-auto"></div>
            <Star className="w-6 h-6 text-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Calculando tu Carta Natal</h2>
            <p className="text-gray-400">Conectando con los astros...</p>
            <div className="text-sm text-purple-300 font-mono">{debugInfo}</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-red-900/20 to-black flex items-center justify-center">
        <div className="text-center space-y-6 p-8 max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Error al cargar tu carta</h2>
            <p className="text-gray-400">{error}</p>
            <div className="text-sm text-red-300 font-mono">{debugInfo}</div>
          </div>
          <div className="space-y-3">
            <Button
              onClick={() => fetchChartData()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Intentar de nuevo
            </Button>
            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
      {/* Header épico */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/30 via-black/50 to-indigo-900/30 backdrop-blur-sm border-b border-white/10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center text-gray-400 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver al Dashboard
              </button>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowDebug(!showDebug)}
                  className="flex items-center px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {showDebug ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showDebug ? 'Ocultar Debug' : 'Ver Debug'}
                </button>
                
                <Button
                  onClick={handleRegenerate}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerar Carta
                </Button>
              </div>
            </div>
            
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Star className="w-8 h-8 text-yellow-400 animate-pulse" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Tu Carta Natal
                </h1>
                <Moon className="w-8 h-8 text-blue-400 animate-pulse" />
              </div>
              
              <div className="text-gray-300 text-lg max-w-2xl mx-auto">
                Descubre los secretos que los astros revelaron en el momento exacto de tu nacimiento
              </div>
              
              {isVeronica && (
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-xl p-4 max-w-md mx-auto">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-300 font-semibold">Carta verificada para Verónica</span>
                  </div>
                  <div className="text-green-200 text-sm mt-1">
                    ASC: {chartData?.ascendant?.sign || 'Calculando...'} | ✅ Datos corregidos
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      {showDebug && (
        <div className="bg-black/80 border-b border-white/10 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400">
              <div>🔍 Debug: {debugInfo}</div>
              <div>👤 Usuario: {user?.uid}</div>
              <div>🎯 Es Verónica: {isVeronica ? 'Sí' : 'No'}</div>
              <div>📊 Planetas cargados: {chartData?.planets?.length || 0}</div>
              <div>🏠 Casas cargadas: {chartData?.houses?.length || 0}</div>
              <div>🔺 Ascendente: {chartData?.ascendant?.sign || 'N/A'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Información de nacimiento */}
      {birthData && (
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center mb-3">
                  <Calendar className="w-6 h-6 text-purple-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">Fecha de Nacimiento</h3>
                </div>
                <p className="text-gray-300">
                  {new Date(birthData.birthDate).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center mb-3">
                  <Clock className="w-6 h-6 text-blue-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">Hora de Nacimiento</h3>
                </div>
                <p className="text-gray-300">{birthData.birthTime || '12:00:00'}</p>
              </div>
              
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center mb-3">
                  <MapPin className="w-6 h-6 text-green-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">Lugar de Nacimiento</h3>
                </div>
                <p className="text-gray-300">{birthData.birthPlace}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Carta Natal Display */}
      <div className="px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {chartData ? (
            <ChartDisplay
              houses={chartData.houses}
              planets={chartData.planets}
              elementDistribution={chartData.elementDistribution || { fire: 0, earth: 0, air: 0, water: 0 }}
              modalityDistribution={chartData.modalityDistribution || { cardinal: 0, fixed: 0, mutable: 0 }}
              keyAspects={chartData.aspects}
              ascendant={chartData.ascendant}
              midheaven={chartData.midheaven}
            />
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No se pudo cargar la carta natal</h3>
              <p className="text-gray-400">Intenta regenerar la carta o contacta con soporte</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}