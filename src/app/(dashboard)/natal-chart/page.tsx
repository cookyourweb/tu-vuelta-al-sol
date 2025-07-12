// src/app/(dashboard)/natal-chart/page.tsx - CORREGIDA
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ChartDisplay from '@/components/astrology/ChartDisplay';
import { Sparkles, Edit, Star, ArrowLeft, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';

// Interfaces
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

interface BirthData {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

export default function NatalChartPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Estados
  const [chartData, setChartData] = useState<NatalChartData | null>(null);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    loadChartData();
  }, [user, router]);

  // ✅ FUNCIÓN CORREGIDA: Cargar o generar carta natal
  const loadChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo('🔍 Verificando carta natal existente...');
      
      console.log('🔍 Cargando carta natal para usuario:', user?.uid);
      
      // ✅ PRIMERO: Verificar si ya existe carta natal
      const checkResponse = await fetch(`/api/charts/natal?userId=${user?.uid}`);
      
      if (checkResponse.ok) {
        const checkResult = await checkResponse.json();
        
        if (checkResult.success && checkResult.natalChart) {
          // ✅ Ya existe carta natal
          console.log('✅ Carta natal encontrada');
          setDebugInfo('✅ Carta natal encontrada y cargada');
          
          const processedData = processChartData(checkResult.natalChart);
          setChartData(processedData);
          
          // Cargar datos de nacimiento para mostrar información
          await loadBirthDataInfo();
          return;
        }
      }
      
      // ❌ No existe carta natal - generar
      setDebugInfo('❌ No existe carta natal, generando automáticamente...');
      console.log('❌ No existe carta natal, generando...');
      await generateNatalChart();
      
    } catch (error) {
      console.error('❌ Error en loadChartData:', error);
      setDebugInfo(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setError('Error cargando carta natal');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNCIÓN CORREGIDA: Generar carta natal
  const generateNatalChart = async () => {
    try {
      setDebugInfo('🔮 Generando carta natal...');
      
      // ✅ CORRECCIÓN: POST request con userId en body
      const generateResponse = await fetch('/api/charts/natal', {
        method: 'POST',  // ✅ POST en lugar de GET
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.uid,
          regenerate: false  // No forzar regeneración la primera vez
        })
      });
      
      console.log('📡 Respuesta generación:', generateResponse.status);
      
      if (!generateResponse.ok) {
        const errorResult = await generateResponse.json();
        console.error('❌ Error generando carta:', errorResult);
        
        if (errorResult.error?.includes('datos de nacimiento')) {
          setError('Primero necesitas configurar tus datos de nacimiento.');
          setDebugInfo('❌ Faltan datos de nacimiento');
          return;
        }
        
        throw new Error(errorResult.error || `Error HTTP ${generateResponse.status}`);
      }
      
      const generateResult = await generateResponse.json();
      
      if (!generateResult.success) {
        throw new Error(generateResult.error || 'Error al generar carta natal');
      }
      
      setDebugInfo('✅ Carta natal generada correctamente');
      console.log('✅ Carta natal generada:', generateResult);
      
      // ✅ PROCESAR DATOS RECIBIDOS - CON DEBUGGING
      console.log('🔍 Datos completos recibidos:', generateResult);
      console.log('🔍 generateResult.data:', generateResult.data);
      console.log('🔍 generateResult.natalChart:', generateResult.natalChart);
      
      // Intentar diferentes estructuras de datos
      let dataToProcess = generateResult.data || generateResult.natalChart || generateResult;
      console.log('🔍 Datos a procesar:', dataToProcess);
      
      const processedData = processChartData(dataToProcess);
      setChartData(processedData);
      
      // Cargar datos de nacimiento para mostrar información
      await loadBirthDataInfo();
      
    } catch (error) {
      console.error('❌ Error generando carta:', error);
      setDebugInfo(`❌ Error generando: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setError(error instanceof Error ? error.message : 'Error generando carta natal');
    }
  };

  // ✅ FUNCIÓN: Cargar información de datos de nacimiento (solo para mostrar)
  const loadBirthDataInfo = async () => {
    try {
      const response = await fetch(`/api/birth-data?userId=${user?.uid}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.data) {
          setBirthData({
            birthDate: data.data.birthDate,
            birthTime: data.data.birthTime,
            birthPlace: data.data.birthPlace
          });
        }
      }
    } catch (error) {
      console.log('⚠️ No se pudieron cargar datos de nacimiento para mostrar:', error);
    }
  };

  // ✅ FUNCIÓN: Forzar regeneración
  const regenerateChart = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo('🔄 Regenerando carta natal...');
      
      const regenerateResponse = await fetch('/api/charts/natal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.uid,
          regenerate: true  // ✅ Forzar regeneración
        })
      });
      
      if (!regenerateResponse.ok) {
        const errorResult = await regenerateResponse.json();
        throw new Error(errorResult.error || 'Error regenerando carta');
      }
      
      const regenerateResult = await regenerateResponse.json();
      
      if (!regenerateResult.success) {
        throw new Error(regenerateResult.error || 'Error al regenerar carta natal');
      }
      
      setDebugInfo('✅ Carta natal regenerada correctamente');
      
      const processedData = processChartData(regenerateResult.data);
      setChartData(processedData);
      
    } catch (error) {
      console.error('❌ Error regenerando carta:', error);
      setError(error instanceof Error ? error.message : 'Error regenerando carta');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNCIÓN PARA PROCESAR DATOS DE LA API - CON DEBUGGING MEJORADO
  const processChartData = (rawData: any): NatalChartData => {
    console.log('🔍 processChartData recibió:', rawData);
    console.log('🔍 Tipo de datos:', typeof rawData);
    console.log('🔍 Es array?:', Array.isArray(rawData));
    console.log('🔍 Keys:', rawData ? Object.keys(rawData) : 'no keys');
    
    if (!rawData) {
      console.error('❌ rawData es null/undefined');
      throw new Error('No hay datos de carta natal');
    }

    // Detectar estructura de datos automáticamente
    let planets = [];
    let houses = [];
    let aspects = [];
    let ascendant = null;
    let midheaven = null;
    let elementDistribution = null;
    let modalityDistribution = null;

    // Intentar diferentes estructuras
    if (rawData.planets) {
      planets = rawData.planets;
    } else if (Array.isArray(rawData)) {
      planets = rawData;
    }

    if (rawData.houses) {
      houses = rawData.houses;
    }

    if (rawData.aspects) {
      aspects = rawData.aspects;
    }

    if (rawData.ascendant) {
      ascendant = rawData.ascendant;
    }

    if (rawData.midheaven || rawData.mc) {
      midheaven = rawData.midheaven || rawData.mc;
    }

    console.log('🔍 Elementos extraídos:', {
      planetsCount: planets.length,
      housesCount: houses.length,
      aspectsCount: aspects.length,
      hasAscendant: !!ascendant,
      hasMidheaven: !!midheaven
    });

    // ✅ PROCESAR PLANETAS CON VALIDACIÓN
    const processedPlanets: any[] = (planets || []).map((planet: any, index: number) => ({
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
    const processedHouses: any[] = (houses || []).map((house: any, index: number) => ({
      number: house.number || (index + 1),
      sign: house.sign || 'Aries',
      degree: house.degree || 0,
      minutes: house.minutes || 0,
      longitude: house.longitude || house.degree || 0
    }));

    // ✅ PROCESAR ASPECTOS CON VALIDACIÓN
    const processedAspects: any[] = (aspects || []).map((aspect: any) => ({
      planet1: aspect.planet1 || 'Sol',
      planet2: aspect.planet2 || 'Luna',
      type: aspect.type || 'conjunction',
      orb: aspect.orb || 0,
      applying: aspect.applying || false
    }));

    // ✅ CALCULAR DISTRIBUCIONES SI NO EXISTEN
    const finalElementDistribution = elementDistribution || rawData.elementDistribution || calculateElementDistribution(processedPlanets);
    const finalModalityDistribution = modalityDistribution || rawData.modalityDistribution || calculateModalityDistribution(processedPlanets);

    const result = {
      planets: processedPlanets,
      houses: processedHouses,
      aspects: processedAspects,
      keyAspects: processedAspects,
      ascendant: ascendant,
      midheaven: midheaven,
      elementDistribution: finalElementDistribution,
      modalityDistribution: finalModalityDistribution
    };

    console.log('✅ Datos procesados finales:', result);
    return result;
  };

  // ✅ FUNCIONES DE CÁLCULO DE DISTRIBUCIONES
  const calculateElementDistribution = (planets: any[]) => {
    const elementMap: { [key: string]: string } = {
      'Aries': 'fire', 'Leo': 'fire', 'Sagitario': 'fire',
      'Tauro': 'earth', 'Virgo': 'earth', 'Capricornio': 'earth',
      'Géminis': 'air', 'Libra': 'air', 'Acuario': 'air',
      'Cáncer': 'water', 'Escorpio': 'water', 'Piscis': 'water'
    };

    const distribution = { fire: 0, earth: 0, air: 0, water: 0 };
    
    planets.forEach(planet => {
      const element = elementMap[planet.sign];
      if (element) {
        distribution[element as keyof typeof distribution]++;
      }
    });

    return distribution;
  };

  const calculateModalityDistribution = (planets: any[]) => {
    const modalityMap: { [key: string]: string } = {
      'Aries': 'cardinal', 'Cáncer': 'cardinal', 'Libra': 'cardinal', 'Capricornio': 'cardinal',
      'Tauro': 'fixed', 'Leo': 'fixed', 'Escorpio': 'fixed', 'Acuario': 'fixed',
      'Géminis': 'mutable', 'Virgo': 'mutable', 'Sagitario': 'mutable', 'Piscis': 'mutable'
    };

    const distribution = { cardinal: 0, fixed: 0, mutable: 0 };
    
    planets.forEach(planet => {
      const modality = modalityMap[planet.sign];
      if (modality) {
        distribution[modality as keyof typeof distribution]++;
      }
    });

    return distribution;
  };

  // Navegación
  const goToDashboard = () => router.push('/dashboard');
  const goToBirthData = () => router.push('/birth-data');

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
            <h2 className="text-2xl font-bold text-white">Cargando tu Carta Natal</h2>
            <p className="text-gray-300 leading-relaxed">
              Procesando información astrológica...
            </p>
            
            {debugInfo && (
              <div className="bg-black/30 rounded-lg p-3 text-sm text-blue-300 font-mono">
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
                  onClick={goToBirthData}
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

  // ✅ PANTALLA PRINCIPAL - CARTA NATAL
  if (!chartData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white flex items-center justify-center">
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
              Tu Carta Natal
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
            Carta Natal{' '}
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Tu Mapa Cósmico
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed flex items-center justify-center gap-3">
            <Star className="w-6 h-6 text-yellow-400 flex-shrink-0" />
            Descubre los secretos que los astros revelaron en el momento exacto de tu nacimiento
          </p>
        </div>

        {/* Carta natal */}
        {chartData && (
          <div className="flex justify-center">
            <ChartDisplay
              houses={chartData.houses || []}
              planets={chartData.planets || []}
              elementDistribution={chartData.elementDistribution || {}}
              modalityDistribution={chartData.modalityDistribution || {}}
              keyAspects={chartData.aspects || chartData.keyAspects || []}
              ascendant={chartData.ascendant}
              midheaven={chartData.midheaven}
              birthData={birthData ?? undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
}