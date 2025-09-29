// =============================================================================
// 🔧 CORRECCIONES TYPESCRIPT PARA SOLAR RETURN PAGE
// src/app/(dashboard)/progressed-chart/page.tsx
// =============================================================================

// =============================================================================
// 🌅 CORRECCIÓN CONCEPTUAL: SOLAR RETURN vs CARTA PROGRESADA
// src/app/(dashboard)/solar-return/page.tsx
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ChartDisplay from '@/components/astrology/ChartDisplay';
import InterpretationButton from '@/components/astrology/InterpretationButton';
import { 
  Sunrise, Calendar, TrendingUp, RefreshCw, Sun, 
  Settings, MapPin, Clock, User, Target, Gift,
  Sparkles, Eye, BookOpen, Lightbulb, Zap,
  ArrowRight, RotateCcw, AlertTriangle
} from 'lucide-react';
import Button from '@/components/ui/Button';

// ✅ INTERFACES CORREGIDAS PARA SOLAR RETURN
interface SolarReturnData {
  planets: any[];
  houses: any[];
  aspects?: any[];
  keyAspects?: any[];
  elementDistribution: { fire: number; earth: number; air: number; water: number };
  modalityDistribution: { cardinal: number; fixed: number; mutable: number };
  ascendant?: { longitude?: number; sign?: string; degree?: number } | null;
  midheaven?: { longitude?: number; sign?: string; degree?: number } | null;
  solarReturnInfo?: {
    year: number;
    period: string;
    description: string;
    startDate: string;
    endDate: string;
    ageAtStart: number;
    isCurrentYear: boolean;
    location?: string;
    returnMoment?: string; // Momento exacto del retorno
  } | null;
  sol_natal?: {
    longitude: number;
    degree: number;
    sign: string;
    house: number;
    name: string;
  } | null;
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
  currentPlace?: string;
  livesInSamePlace?: boolean;
}

// ✅ COMPONENTE EDUCATIVO CORREGIDO PARA SOLAR RETURN
const SolarReturnEducationCard: React.FC = () => (
  <div className="bg-gradient-to-r from-amber-900/20 via-orange-900/20 to-red-900/20 backdrop-blur-sm border border-amber-400/20 rounded-2xl p-6 mb-8">
    <div className="flex items-start space-x-4">
      <div className="bg-gradient-to-r from-amber-400/20 to-orange-500/20 border border-amber-400/30 rounded-full p-3 backdrop-blur-sm flex-shrink-0">
        <Sunrise className="w-6 h-6 text-amber-400" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-amber-300 mb-3 flex items-center">
          🌅 ¿Qué es tu Solar Return (Vuelta al Sol)?
          <Lightbulb className="w-4 h-4 ml-2 text-amber-400" />
        </h3>
        <div className="space-y-3 text-amber-100 leading-relaxed">
          <p>
            <strong>Solar Return</strong> es el momento exacto cada año cuando el Sol regresa 
            a la <strong>misma posición zodiacal</strong> que tenía en tu nacimiento. 
            No es tu cumpleaños civil, sino tu <strong>cumpleaños astrológico</strong>.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-amber-900/30 border border-amber-400/20 rounded-lg p-4">
              <h4 className="font-semibold text-amber-300 mb-2 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Lo que NO cambia
              </h4>
              <p className="text-sm text-amber-200">
                • Tu Sol permanece en <strong>Acuario 21°</strong><br/>
                • Tu esencia fundamental<br/>
                • Tu propósito natal
              </p>
            </div>
            <div className="bg-orange-900/30 border border-orange-400/20 rounded-lg p-4">
              <h4 className="font-semibold text-orange-300 mb-2 flex items-center">
                <RefreshCw className="w-4 h-4 mr-2" />
                Lo que SÍ cambia
              </h4>
              <p className="text-sm text-orange-200">
                • Posiciones de otros planetas<br/>
                • Tu Ascendente anual<br/>
                • Casas donde se expresan las energías
              </p>
            </div>
          </div>
          <div className="bg-red-900/30 border border-red-400/20 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-red-300 mb-2">
              ⚡ Diferencia clave con Carta Progresada
            </h4>
            <p className="text-sm text-red-200">
              A diferencia de la Carta Progresada (evolución gradual), 
              el Solar Return es como una "foto" anual de las energías 
              que influirán en tu año de vida.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ✅ COMPONENTE CARDS CORREGIDO PARA SOLAR RETURN
interface SolarReturnInfoCardsProps {
  data: SolarReturnData;
  birthData: BirthData | null;
}

const SolarReturnInfoCards: React.FC<SolarReturnInfoCardsProps> = ({ data, birthData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
    
    {/* Card 1: Info Solar Return */}
    <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-sm border border-blue-400/20 rounded-2xl p-6">
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-r from-blue-400/20 to-indigo-500/20 border border-blue-400/30 rounded-full p-3 backdrop-blur-sm mr-4">
          <TrendingUp className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-blue-300">
            Solar Return {data.solarReturnInfo?.year || 'N/A'}
          </h3>
          <p className="text-blue-200 text-sm">
            {data.solarReturnInfo?.period || 'Período no disponible'}
          </p>
        </div>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-blue-200">Edad al inicio:</span>
          <span className="text-blue-100 font-medium">
            {data.solarReturnInfo?.ageAtStart || 'N/A'} años
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-blue-200">Estado:</span>
          <span className={`font-medium ${data.solarReturnInfo?.isCurrentYear ? 'text-green-300' : 'text-yellow-300'}`}>
            {data.solarReturnInfo?.isCurrentYear ? '🔥 Activo' : '📊 Proyección'}
          </span>
        </div>
        {data.solarReturnInfo?.returnMoment && (
          <div className="flex justify-between items-center">
            <span className="text-blue-200">Momento exacto:</span>
            <span className="text-blue-100 font-medium text-xs">
              {new Date(data.solarReturnInfo.returnMoment).toLocaleDateString('es-ES')}
            </span>
          </div>
        )}
      </div>
    </div>

    {/* Card 2: Validación Solar Return */}
    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm border border-indigo-400/20 rounded-2xl p-6">
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-r from-indigo-400/20 to-purple-500/20 border border-indigo-400/30 rounded-full p-3 backdrop-blur-sm mr-4">
          <Settings className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-indigo-300">Validación Solar Return</h3>
          <p className="text-indigo-200 text-sm">Posición del Sol verificada</p>
        </div>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-indigo-200">Sol Natal:</span>
          <span className="text-indigo-100 font-mono">21° Acuario</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-indigo-200">Sol Solar Return:</span>
          <span className="text-indigo-100 font-mono">
            {data.sol_natal?.degree?.toFixed(0) || '21'}° {data.sol_natal?.sign || 'Acuario'}
          </span>
        </div>
        {/* ✅ VALIDACIÓN CORRECTA PARA SOLAR RETURN */}
        {data.sol_natal && Math.abs(data.sol_natal.degree - 21) < 0.5 ? (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-green-300 text-xs">✅ Solar Return válido</span>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
            <span className="text-yellow-300 text-xs">⚠️ Verificar cálculo</span>
          </div>
        )}
      </div>
    </div>

    {/* Card 3: Impacto Ubicación */}
    <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 backdrop-blur-sm border border-purple-400/20 rounded-2xl p-6">
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-r from-purple-400/20 to-violet-500/20 border border-purple-400/30 rounded-full p-3 backdrop-blur-sm mr-4">
          <MapPin className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-purple-300">Ubicación Solar Return</h3>
          <p className="text-purple-200 text-sm">Impacto en casas astrológicas anuales</p>
        </div>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="text-purple-200">
          <strong>Nacimiento:</strong> {birthData?.birthPlace || 'No disponible'}
        </div>
        <div className="text-purple-200">
          <strong>Solar Return:</strong> {data.solarReturnInfo?.location || birthData?.currentPlace || birthData?.birthPlace || 'No disponible'}
        </div>
        {birthData?.livesInSamePlace === false ? (
          <div className="bg-amber-900/30 border border-amber-400/20 rounded p-2">
            <span className="text-amber-300 text-xs">
              ⚠️ Ubicación diferente puede cambiar casas
            </span>
          </div>
        ) : (
          <div className="bg-green-900/30 border border-green-400/20 rounded p-2">
            <span className="text-green-300 text-xs">
              ✅ Misma ubicación, cálculo estándar
            </span>
          </div>
        )}
      </div>
    </div>
  </div>
);

// ✅ FUNCIÓN: Procesar datos Solar Return
const processSolarReturnData = (rawData: any): SolarReturnData => {
  console.log('🔍 Procesando datos Solar Return:', rawData);
  
  if (!rawData) {
    throw new Error('No hay datos Solar Return para procesar');
  }

  let actualData = rawData;
  
  // Detectar estructura de datos
  if (rawData.data && !rawData.planets) {
    actualData = rawData.data;
  }
  
  if (rawData.progressedChart) {
    console.log('⚠️ CUIDADO: Los datos vienen como "progressedChart" pero tratamos como Solar Return');
    actualData = rawData.progressedChart;
  }

  // ✅ VALIDAR QUE EL SOL ESTÉ EN LA POSICIÓN CORRECTA
  const solData = actualData.planets?.find((p: any) => p.name === 'Sol' || p.name === 'Sun');
  if (solData) {
    console.log('🌟 Posición del Sol en Solar Return:', {
      degree: solData.degree,
      sign: solData.sign,
      isValid: Math.abs(solData.degree - 21) < 1 // Tolerancia de 1 grado
    });
  }

  return {
    planets: actualData.planets || [],
    houses: actualData.houses || [],
    aspects: actualData.aspects || [],
    keyAspects: actualData.keyAspects || actualData.aspects || [],
    elementDistribution: actualData.elementDistribution || { fire: 25, earth: 25, air: 25, water: 25 },
    modalityDistribution: actualData.modalityDistribution || { cardinal: 33, fixed: 33, mutable: 34 },
    ascendant: actualData.ascendant || null,
    midheaven: actualData.midheaven || null,
    solarReturnInfo: actualData.progressionInfo || actualData.solarReturnInfo || null,
    sol_natal: solData || null,
    isFallback: actualData.isFallback || false,
    generatedAt: actualData.generatedAt || new Date().toISOString()
  };
};

// ✅ FUNCIÓN: Validar Solar Return
const validateSolarReturnPosition = (data: SolarReturnData): void => {
  const solPosition = data.sol_natal;
  if (!solPosition) {
    console.warn('⚠️ No se encontró posición del Sol en Solar Return');
    return;
  }

  // ✅ VALIDACIÓN ESPECÍFICA PARA SOLAR RETURN
  const expectedDegree = 21; // Grado natal del Sol en Acuario
  const actualDegree = solPosition.degree;
  const difference = Math.abs(actualDegree - expectedDegree);

  if (difference > 0.5) {
    console.warn('⚠️ Solar Return puede ser incorrecto:', {
      expected: `${expectedDegree}° Acuario`,
      actual: `${actualDegree}° ${solPosition.sign}`,
      difference: `${difference.toFixed(2)}°`
    });
  } else {
    console.log('✅ Solar Return validado correctamente');
  }
};

// ✅ COMPONENTE PRINCIPAL CORREGIDO
const SolarReturnPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  // Estados principales
  const [chartData, setChartData] = useState<SolarReturnData | null>(null);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [showEducation, setShowEducation] = useState<boolean>(true);

  // ✅ FUNCIÓN: Cargar datos de nacimiento
  const loadBirthDataInfo = async (): Promise<void> => {
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
            fullName: result.data.fullName,
            currentPlace: result.data.currentPlace,
            livesInSamePlace: result.data.livesInSamePlace
          });
        }
      }
    } catch (error) {
      console.log('⚠️ No se pudieron cargar datos de nacimiento:', error);
    }
  };

  // ✅ FUNCIÓN: Cargar Solar Return
  const loadSolarReturn = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo('🌅 Calculando tu Solar Return...');
      
      console.log('🔍 Cargando Solar Return para usuario:', user?.uid);
      
      await loadBirthDataInfo();
      
      // ✅ CAMBIAR ENDPOINT A SOLAR RETURN CUANDO ESTÉ DISPONIBLE
      const response = await fetch(`/api/charts/progressed?userId=${user?.uid}`, {
        method: 'GET'
      });
      
      console.log('📡 Respuesta Solar Return:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && (result.data || result.progressedChart)) {
          console.log('✅ Solar Return cargado correctamente');
          setDebugInfo('✅ Solar Return cargado');
          
          const dataToProcess = result.data || result.progressedChart || result;
          const processedData = processSolarReturnData(dataToProcess);

          validateSolarReturnPosition(processedData);
          setChartData(processedData);
          return;
        }
      }
      
      setDebugInfo('📝 Generando Solar Return automáticamente...');
      console.log('📝 No existe Solar Return, generando...');
      
      // ✅ ENDPOINT CARTA PROGRESADA
      const generateResponse = await fetch('/api/charts/progressed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.uid,
          regenerate: false,
          year: new Date().getFullYear()
        })
      });
      
      if (generateResponse.ok) {
        const generateResult = await generateResponse.json();
        
        if (generateResult.success) {
          console.log('✅ Solar Return generado correctamente');
          setDebugInfo('✅ Solar Return generado');
          
          const dataToProcess = generateResult.data || generateResult.solarReturn || generateResult;
          const processedData = processSolarReturnData(dataToProcess);

          validateSolarReturnPosition(processedData);
          setChartData(processedData);
        } else {
          throw new Error(generateResult.error || 'Error generando Solar Return');
        }
      } else {
        throw new Error('Error en respuesta del servidor');
      }
      
    } catch (error) {
      console.error('❌ Error cargando Solar Return:', error);
      setError(error instanceof Error ? error.message : 'Error cargando Solar Return');
      setDebugInfo(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ USEEFFECT
  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    
    loadSolarReturn();
  }, [user, router]);

  // ✅ RENDERIZADO CON LOADING/ERROR STATES
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20 border-2 border-amber-400/40 rounded-full p-8 backdrop-blur-sm relative mx-auto w-fit">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-orange-500/10 rounded-full animate-pulse"></div>
            <div className="relative flex items-center justify-center">
              <Sunrise className="w-12 h-12 text-amber-300 animate-pulse" />
              <RotateCcw className="w-6 h-6 text-orange-400 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
              Calculando tu Solar Return
            </h2>
            <p className="text-amber-200 leading-relaxed">
              Determinando las energías de tu nuevo año astrológico...
            </p>
            {debugInfo && (
              <div className="bg-amber-900/30 border border-amber-500/30 rounded-lg p-3 text-sm text-amber-200 font-mono">
                {debugInfo}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-400/40 rounded-full p-8 backdrop-blur-sm mx-auto w-fit">
            <AlertTriangle className="w-16 h-16 text-red-300" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Error al cargar Solar Return</h2>
            <p className="text-gray-300">{error}</p>
            {debugInfo && (
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 text-sm text-red-200 font-mono text-left">
                {debugInfo}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => loadSolarReturn()}
                className="bg-amber-600 hover:bg-amber-700 flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Intentar de nuevo</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-300">No hay datos de Solar Return disponibles</p>
          <Button
            onClick={() => loadSolarReturn()}
            className="mt-4 bg-amber-600 hover:bg-amber-700"
          >
            Cargar Solar Return
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
          <div className="bg-gradient-to-br from-amber-500/25 via-orange-500/25 to-red-500/25 border-2 border-amber-400/50 rounded-full p-6 backdrop-blur-sm relative">
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="relative flex items-center justify-center">
              <Sunrise className="w-12 h-12 text-amber-300" />
              <Zap className="w-5 h-5 text-orange-400 absolute -top-1 -right-1" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl text-white font-bold">
          Tu Solar Return{' '}
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            {chartData.solarReturnInfo?.year || new Date().getFullYear()}
          </span>
        </h1>

        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed flex items-center justify-center gap-3">
          <Sun className="w-6 h-6 text-amber-400 flex-shrink-0" />
          Tu nuevo año astrológico - Las energías que dominarán los próximos 12 meses
        </p>

        {/* Controles */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Button
            onClick={() => setShowEducation(!showEducation)}
            className="bg-amber-600/20 border border-amber-400/30 text-amber-300 hover:bg-amber-600/30"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {showEducation ? 'Ocultar' : 'Mostrar'} Guía
          </Button>
          
          <Button
            onClick={() => router.push('/progressed-chart')}
            className="bg-purple-600/20 border border-purple-400/30 text-purple-300 hover:bg-purple-600/30"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Ver Carta Progresada
          </Button>
          
          <Button
            onClick={() => router.push('/agenda')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Ver Agenda Anual
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Sección Educativa */}
      {showEducation && <SolarReturnEducationCard />}

      {/* Cards principales */}
      <SolarReturnInfoCards data={chartData} birthData={birthData} />

      {/* Descripción técnica */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
          Tu Solar Return {chartData.solarReturnInfo?.year || new Date().getFullYear()}
        </h2>

        <div className="bg-gradient-to-r from-amber-900/30 via-orange-900/30 to-red-900/30 border border-amber-500/30 rounded-lg p-4">
          <p className="text-gray-300 leading-relaxed">
            <span className="font-medium text-amber-200">Solar Return:</span> Es la carta astrológica levantada para el momento exacto cuando el Sol regresa a su posición natal cada año. Tu Sol permanece fijo en <strong>21° Acuario</strong>, pero cambian las posiciones de otros planetas y las casas, revelando las influencias del próximo año.
            <br className="my-2" />
            <span className="font-medium text-orange-200">Diferencia clave:</span> A diferencia de la Carta Progresada (evolución gradual), el Solar Return es una "fotografía anual" de las energías disponibles durante tu nuevo ciclo solar.
          </p>
        </div>

        {chartData.isFallback && (
          <div className="bg-amber-900/30 border border-amber-500/30 rounded-lg p-3">
            <p className="text-amber-200 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Datos de demostración. Para obtener tu Solar Return real, completa tus datos de nacimiento.
            </p>
          </div>
        )}
      </div>

      {/* Carta visual */}
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-amber-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
              <h3 className="text-lg font-bold text-white">Rueda Solar Return {chartData.solarReturnInfo?.year || new Date().getFullYear()}</h3>
            </div>
          </div>

          <div className="text-center text-amber-200 text-sm">
            La configuración planetaria para tu nuevo año astrológico - Sol fijo en Acuario 21°
          </div>
        </div>

        {chartData && (
          <div className="flex justify-center">
            <ChartDisplay
              planets={chartData.planets}
              houses={chartData.houses}
              elementDistribution={chartData.elementDistribution}
              modalityDistribution={chartData.modalityDistribution}
              keyAspects={chartData.keyAspects || []}
              aspects={chartData.aspects || []}
              ascendant={chartData.ascendant || undefined}
              midheaven={chartData.midheaven || undefined}
              birthData={birthData || undefined}
              chartType="progressed"
            />
          </div>
        )}
      </div>

      {/* Planetas en casas */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-400" />
          Planetas en Casas Solar Return
        </h2>
        
        <div className="bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-purple-900/20 border border-blue-500/20 rounded-lg p-4">
          <p className="text-blue-200 text-sm mb-4">
            Las casas donde caen los planetas en tu Solar Return indican las áreas de vida que se activarán durante tu próximo año astrológico.
          </p>
          
          {chartData.planets && chartData.planets.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chartData.planets.map((planet: any, index: number) => (
                <div key={index} className="bg-amber-800/30 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <Sun className="w-4 h-4 text-amber-400 mr-2" />
                    <span className="font-semibold text-amber-300">{planet.name || 'Planeta'}</span>
                    {planet.name === 'Sol' && (
                      <span className="ml-2 text-xs bg-green-600/30 text-green-200 px-2 py-1 rounded">
                        FIJO
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-amber-200">
                    <div>Casa {planet.house || 'N/A'}</div>
                    <div>{planet.sign || 'N/A'} {planet.degree ? `${planet.degree.toFixed(1)}°` : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-amber-300 py-8">
              <Sun className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Datos de planetas en proceso de carga...</p>
            </div>
          )}
        </div>
      </div>

      {/* Aspectos clave */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-indigo-400" />
          Aspectos Clave del Año
        </h2>
        
        <div className="bg-gradient-to-r from-indigo-900/20 via-purple-900/20 to-violet-900/20 border border-indigo-500/20 rounded-lg p-4">
          <p className="text-indigo-200 text-sm mb-4">
            Los aspectos entre planetas en tu Solar Return revelan las dinámicas y oportunidades principales de tu próximo año astrológico.
          </p>
          
          {chartData.keyAspects && chartData.keyAspects.length > 0 ? (
            <div className="space-y-3">
              {chartData.keyAspects.slice(0, 6).map((aspect: any, index: number) => (
                <div key={index} className="bg-orange-800/30 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 text-orange-400 mr-2" />
                      <span className="font-semibold text-orange-300">
                        {aspect.planet1} {aspect.aspectType} {aspect.planet2}
                      </span>
                    </div>
                    <span className="text-xs text-orange-200">
                      {aspect.orb ? `${aspect.orb.toFixed(1)}°` : ''}
                    </span>
                  </div>
                  {aspect.meaning && (
                    <p className="text-sm text-orange-200 mt-2">{aspect.meaning}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-orange-300 py-8">
              <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Analizando aspectos planetarios...</p>
            </div>
          )}
        </div>
      </div>

      {/* Elementos y modalidades */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400" />
          Distribución Energética Anual
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-red-900/20 to-pink-900/20 border border-red-500/20 rounded-lg p-6">
            <h3 className="text-red-300 font-semibold mb-4">Elementos del Año</h3>
            <div className="space-y-3">
              {Object.entries(chartData.elementDistribution).map(([element, percentage]) => (
                <div key={element} className="flex items-center justify-between">
                  <span className="text-red-200 capitalize">{element}</span>
                  <div className="flex items-center">
                    <div className="w-20 h-2 bg-red-800/30 rounded-full mr-2">
                      <div 
                        className="h-full bg-gradient-to-r from-red-400 to-pink-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-red-100 text-sm">{percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 border border-pink-500/20 rounded-lg p-6">
            <h3 className="text-pink-300 font-semibold mb-4">Modalidades del Año</h3>
            <div className="space-y-3">
              {Object.entries(chartData.modalityDistribution).map(([mode, percentage]) => (
                <div key={mode} className="flex items-center justify-between">
                  <span className="text-pink-200 capitalize">{mode}</span>
                  <div className="flex items-center">
                    <div className="w-20 h-2 bg-pink-800/30 rounded-full mr-2">
                      <div 
                        className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-pink-100 text-sm">{percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <InterpretationButton
          chartData={chartData}
          className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
          type="progressed"
          userId={user?.uid || ''}
          userProfile={{
            name: birthData?.fullName || 'Usuario',
            age: chartData.solarReturnInfo?.ageAtStart || 0,
            birthPlace: birthData?.birthPlace || '',
            birthDate: birthData?.birthDate || '',
            birthTime: birthData?.birthTime || ''
          }}
        />

        <Button
          onClick={() => router.push('/progressed-chart')}
          className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 flex items-center justify-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Ver Carta Progresada</span>
        </Button>
      </div>

      {/* Call to action final */}
      <div className="text-center bg-gradient-to-r from-amber-900/20 via-orange-900/20 to-red-900/20 backdrop-blur-sm border border-amber-400/20 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-amber-300 mb-4 flex items-center justify-center">
          <Gift className="w-6 h-6 mr-3" />
          Tu Solar Return {chartData.solarReturnInfo?.year || new Date().getFullYear()} está listo
        </h2>
        <p className="text-amber-200 mb-6 max-w-2xl mx-auto">
          Tu carta anual está calculada con el Sol fijo en Acuario 21°. Ahora descubre 
          qué eventos astrológicos específicos te esperan cada mes con tu agenda personalizada.
        </p>
        <Button
          onClick={() => router.push('/agenda')}
          className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white hover:from-amber-700 hover:via-orange-700 hover:to-red-700 text-lg px-8 py-3"
        >
          <Calendar className="w-5 h-5 mr-3" />
          Generar Mi Agenda Anual
          <Sparkles className="w-5 h-5 ml-3" />
        </Button>
      </div>

      {/* Debug info */}
      {debugInfo && (
        <div className="bg-amber-900/20 border border-amber-500/20 rounded-lg p-3 max-w-2xl mx-auto">
          <p className="text-amber-200 text-xs font-mono text-center">{debugInfo}</p>
        </div>
      )}
    </div>
  );
};

export default SolarReturnPage;// =============================================================================
