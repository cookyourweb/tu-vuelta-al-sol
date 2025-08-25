// src/app/(dashboard)/natal-chart/page.tsx - CORREGIDA PARA NUEVA ESTRUCTURA PROKERALA
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
      
      // ✅ PROCESAR DATOS RECIBIDOS - CON DEBUGGING MEJORADO
      console.log('🔍 Datos completos recibidos:', generateResult);
      console.log('🔍 generateResult.data:', generateResult.data);
      console.log('🔍 generateResult.natalChart:', generateResult.natalChart);
      
      // ✅ CORRECCIÓN CRÍTICA: Intentar múltiples estructuras posibles
      let dataToProcess = null;
      
      // Probar diferentes ubicaciones de los datos
      if (generateResult.data) {
        dataToProcess = generateResult.data;
        console.log('🎯 Usando generateResult.data');
      } else if (generateResult.natalChart) {
        dataToProcess = generateResult.natalChart;
        console.log('🎯 Usando generateResult.natalChart');
      } else if (generateResult.chartData) {
        dataToProcess = generateResult.chartData;
        console.log('🎯 Usando generateResult.chartData');
      } else {
        dataToProcess = generateResult;
        console.log('🎯 Usando generateResult completo');
      }
      
      console.log('🔍 Datos finales a procesar:', dataToProcess);
      
      if (!dataToProcess) {
        throw new Error('No se encontraron datos de carta natal en la respuesta');
      }
      
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
    console.log('🔍 Respuesta de datos de nacimiento:', response);
      
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

  // ✅ FUNCIÓN CORREGIDA: Forzar regeneración
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
      
      // ✅ CORRECCIÓN CRÍTICA: Manejo seguro de datos
      let dataToProcess = null;
      
      if (regenerateResult.data) {
        dataToProcess = regenerateResult.data;
      } else if (regenerateResult.natalChart) {
        dataToProcess = regenerateResult.natalChart;
      } else if (regenerateResult.chartData) {
        dataToProcess = regenerateResult.chartData;
      } else {
        dataToProcess = regenerateResult;
      }
      
      console.log('🔄 Datos para regeneración:', dataToProcess);
      
      if (!dataToProcess) {
        throw new Error('No se encontraron datos en la respuesta de regeneración');
      }
      
      const processedData = processChartData(dataToProcess);
      setChartData(processedData);
      
    } catch (error) {
      console.error('❌ Error regenerando carta:', error);
      setError(error instanceof Error ? error.message : 'Error regenerando carta');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNCIÓN ADAPTADORA MEJORADA: Convierte estructura Prokerala a estructura frontend
  const adaptProkeralaData = (rawData: any): any => {
    console.log('🔍 Adaptando datos Prokerala:', rawData);
    
    if (!rawData) {
      console.warn('⚠️ rawData es null/undefined en adaptProkeralaData');
      return null;
    }
    
    // ✅ DETECCIÓN MEJORADA: Múltiples formas de detectar estructura nueva
    const hasAngles = rawData.angles && Array.isArray(rawData.angles);
    const hasPlanetPositions = rawData.planet_positions && Array.isArray(rawData.planet_positions);
    const hasNewStructure = hasAngles || hasPlanetPositions || rawData.planets?.some((p: any) => p.zodiac);
    
    console.log('🔍 Estructura detectada:', {
      hasAngles,
      hasPlanetPositions,
      hasNewStructure,
      isProkeralaAPI: hasAngles && hasPlanetPositions
    });
    
    if (!hasNewStructure) {
      // Es estructura antigua o ya procesada, devolver tal cual
      console.log('📄 Estructura antigua/procesada detectada');
      return rawData;
    }
    
    // ✅ NUEVA ESTRUCTURA DE PROKERALA: Adaptar completamente
    console.log('🔄 Adaptando estructura nueva de Prokerala...');
    
    const adaptedData: any = {
      planets: [],
      houses: [],
      aspects: [],
      ascendant: null,
      midheaven: null
    };
    
    // ✅ ADAPTAR PLANETAS - Nueva estructura de Prokerala
    if (rawData.planet_positions && Array.isArray(rawData.planet_positions)) {
      console.log('🪐 Adaptando planetas de planet_positions');
      adaptedData.planets = rawData.planet_positions.map((planet: any) => ({
        name: translatePlanetNameToSpanish(planet.name || ''),
        degree: planet.degree || Math.floor((planet.longitude || 0) % 30),
        sign: planet.zodiac?.name || getSignNameFromLongitude(planet.longitude || 0),
        minutes: planet.minutes || Math.floor(((planet.longitude || 0) % 1) * 60),
        longitude: planet.longitude || 0,
        houseNumber: planet.house || 1,
        housePosition: planet.house || 1,
        isRetrograde: planet.is_retrograde || false,
        retrograde: planet.is_retrograde || false
      }));
    } else if (rawData.planets && Array.isArray(rawData.planets)) {
      console.log('🪐 Adaptando planetas de planets (fallback)');
      adaptedData.planets = rawData.planets.map((planet: any) => ({
        name: planet.name,
        degree: planet.degree,
        sign: planet.signName || planet.sign,
        minutes: planet.minutes || 0,
        longitude: planet.longitude,
        houseNumber: planet.house || 1,
        housePosition: planet.house || 1,
        isRetrograde: planet.retrograde || false,
        retrograde: planet.retrograde || false
      }));
    }
    
    // ✅ ADAPTAR CASAS - Nueva estructura de Prokerala
    if (rawData.houses && Array.isArray(rawData.houses)) {
      console.log('🏠 Adaptando casas');
      adaptedData.houses = rawData.houses.map((house: any, index: number) => ({
        number: house.number || (index + 1),
        sign: house.zodiac?.name || house.signName || house.sign || getSignNameFromLongitude(house.longitude || 0),
        degree: house.degree || Math.floor((house.longitude || 0) % 30),
        minutes: house.minutes || Math.floor(((house.longitude || 0) % 1) * 60),
        longitude: house.longitude || 0
      }));
    }
    
    // ✅ CRÍTICO: ADAPTAR ÁNGULOS - Ascendente y Medio Cielo desde nueva estructura
    if (rawData.angles && Array.isArray(rawData.angles)) {
      console.log('🔺 Adaptando ángulos desde structure angles');
      console.log('🔍 Ángulos disponibles:', rawData.angles.map((a: any) => a.name));
      
      // Buscar ascendente
      const ascendantAngle = rawData.angles.find((angle: any) => 
        angle.name === 'Ascendente' || 
        angle.name === 'Ascendant' ||
        angle.name === 'ASC' ||
        angle.name?.toLowerCase().includes('ascend')
      );
      
      if (ascendantAngle) {
        console.log('🔺 Ascendente encontrado en angles:', ascendantAngle);
        adaptedData.ascendant = {
          longitude: ascendantAngle.longitude,
          sign: ascendantAngle.zodiac?.name || getSignNameFromLongitude(ascendantAngle.longitude),
          degree: ascendantAngle.degree || Math.floor((ascendantAngle.longitude || 0) % 30),
          minutes: ascendantAngle.minutes || Math.floor(((ascendantAngle.longitude || 0) % 1) * 60)
        };
      } else {
        console.warn('⚠️ No se encontró ascendente en angles');
      }
      
      // Buscar medio cielo
      const midheavenAngle = rawData.angles.find((angle: any) => 
        angle.name === 'Midheaven' || 
        angle.name === 'MC' || 
        angle.name === 'Medio Cielo' ||
        angle.name?.toLowerCase().includes('midheaven')
      );
      
      if (midheavenAngle) {
        console.log('🔺 Medio Cielo encontrado en angles:', midheavenAngle);
        adaptedData.midheaven = {
          longitude: midheavenAngle.longitude,
          sign: midheavenAngle.zodiac?.name || getSignNameFromLongitude(midheavenAngle.longitude),
          degree: midheavenAngle.degree || Math.floor((midheavenAngle.longitude || 0) % 30),
          minutes: midheavenAngle.minutes || Math.floor(((midheavenAngle.longitude || 0) % 1) * 60)
        };
      }
    }
    
    // ✅ ADAPTAR ASPECTOS
    if (rawData.aspects && Array.isArray(rawData.aspects)) {
      console.log('🔗 Adaptando aspectos');
      adaptedData.aspects = rawData.aspects.map((aspect: any) => ({
        planet1: translatePlanetNameToSpanish(aspect.planet_one?.name || aspect.planet1 || ''),
        planet2: translatePlanetNameToSpanish(aspect.planet_two?.name || aspect.planet2 || ''),
        type: aspect.aspect?.name || aspect.type || 'conjunction',
        orb: aspect.orb || 0,
        applying: aspect.is_applying || aspect.applying || false
      }));
    }
    
    // ✅ PRESERVAR DISTRIBUCIONES SI EXISTEN
    if (rawData.elementDistribution) {
      adaptedData.elementDistribution = rawData.elementDistribution;
    }
    if (rawData.modalityDistribution) {
      adaptedData.modalityDistribution = rawData.modalityDistribution;
    }
    
    console.log('✅ Datos adaptados completos:', adaptedData);
    console.log('🔺 Ascendente adaptado:', adaptedData.ascendant);
    
    return adaptedData;
  };

  // ✅ FUNCIÓN HELPER: Traducciones de planetas
  const translatePlanetNameToSpanish = (englishName: string): string => {
    const translations: Record<string, string> = {
      'Sun': 'Sol',
      'Moon': 'Luna',
      'Mercury': 'Mercurio',
      'Venus': 'Venus',
      'Mars': 'Marte',
      'Jupiter': 'Júpiter',
      'Saturn': 'Saturno',
      'Uranus': 'Urano',
      'Neptune': 'Neptuno',
      'Pluto': 'Plutón',
      'Chiron': 'Quirón',
      'North Node': 'Nodo Norte',
      'South Node': 'Nodo Sur',
      'Lilith': 'Lilith'
    };
    
    return translations[englishName] || englishName;
  };

  // ✅ FUNCIÓN HELPER: Obtener signo desde longitud
  const getSignNameFromLongitude = (longitude: number): string => {
    const signs = [
      'Aries', 'Tauro', 'Géminis', 'Cáncer',
      'Leo', 'Virgo', 'Libra', 'Escorpio',
      'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
    ];
    
    const signIndex = Math.floor((longitude || 0) / 30) % 12;
    return signs[signIndex] || 'Aries';
  };

  // ✅ FUNCIÓN CORREGIDA: Procesa datos usando el adaptador mejorado
  const processChartData = (rawData: any): NatalChartData => {
    console.log('🔍 === INICIANDO processChartData ===');
    
    // Obtener datos de nacimiento del estado del componente
    const birthDate = birthData?.birthDate || 'No disponible';
    const birthTime = birthData?.birthTime || 'No disponible';
    const datetime = birthData?.birthDate && birthData?.birthTime 
      ? `${birthData.birthDate}T${birthData.birthTime}` 
      : 'No disponible';
    
    console.log('🔍 === DEBUG DATOS DE NACIMIENTO ===');
    console.log('birthDate recibido:', birthDate);
    console.log('birthTime recibido:', birthTime);
    console.log('datetime formateado:', datetime);
    console.log('🔍 rawData recibido:', rawData);
    console.log('🔍 Tipo de rawData:', typeof rawData);
    console.log('🔍 rawData keys:', Object.keys(rawData || {}));
    
    // ✅ VALIDACIÓN CRÍTICA: Verificar que rawData existe
    if (!rawData || (typeof rawData === 'object' && Object.keys(rawData).length === 0)) {
      console.error('❌ rawData es null/undefined/vacío en processChartData');
      console.error('❌ rawData valor:', rawData);
      throw new Error('No hay datos de carta natal para procesar');
    }

    // ✅ PRIMERO: Adaptar la estructura de datos
    console.log('🔄 Iniciando adaptación de datos...');
    const adaptedData = adaptProkeralaData(rawData);
    
    if (!adaptedData) {
      console.error('❌ adaptedData es null después de adaptación');
      throw new Error('Error adaptando estructura de datos de carta natal');
    }
    
    console.log('✅ Datos adaptados exitosamente:', adaptedData);
    
    // ✅ LUEGO: Procesar con la estructura adaptada
    const planets = adaptedData.planets || [];
    const houses = adaptedData.houses || [];
    const aspects = adaptedData.aspects || [];
    const ascendant = adaptedData.ascendant;
    const midheaven = adaptedData.midheaven;
    const elementDistribution = adaptedData.elementDistribution;
    const modalityDistribution = adaptedData.modalityDistribution;

    console.log('🔍 Elementos extraídos post-adaptación:', {
      planetsCount: planets.length,
      housesCount: houses.length,
      aspectsCount: aspects.length,
      hasAscendant: !!ascendant,
      ascendantSign: ascendant?.sign,
      hasMidheaven: !!midheaven
    });

    // ✅ PROCESAR PLANETAS con validación
    const processedPlanets: any[] = planets.map((planet: any, index: number) => {
      try {
        return {
          name: planet.name || `Planeta${index + 1}`,
          degree: planet.degree || 0,
          sign: planet.sign || 'Aries',
          minutes: planet.minutes || 0,
          longitude: planet.longitude || planet.degree || 0,
          houseNumber: planet.houseNumber || planet.housePosition || 1,
          housePosition: planet.housePosition || planet.houseNumber || 1,
          isRetrograde: planet.isRetrograde || planet.retrograde || false,
          retrograde: planet.retrograde || planet.isRetrograde || false
        };
      } catch (error) {
        console.warn(`⚠️ Error procesando planeta ${index}:`, error);
        return {
          name: `Planeta${index + 1}`,
          degree: 0,
          sign: 'Aries',
          minutes: 0,
          longitude: 0,
          houseNumber: 1,
          housePosition: 1,
          isRetrograde: false,
          retrograde: false
        };
      }
    });

    // ✅ PROCESAR CASAS con validación
    const processedHouses: any[] = houses.length > 0 
      ? houses.map((house: any, index: number) => {
          try {
            return {
              number: house.number || (index + 1),
              sign: house.sign || 'Aries',
              degree: house.degree || 0,
              minutes: house.minutes || 0,
              longitude: house.longitude || house.degree || 0
            };
          } catch (error) {
            console.warn(`⚠️ Error procesando casa ${index}:`, error);
            return {
              number: index + 1,
              sign: 'Aries',
              degree: 0,
              minutes: 0,
              longitude: 0
            };
          }
        })
      : Array.from({ length: 12 }, (_, index) => ({
          number: index + 1,
          sign: 'Aries',
          degree: 0,
          minutes: 0,
          longitude: 0
        }));

    // ✅ PROCESAR ASPECTOS con validación
    const processedAspects: any[] = aspects.map((aspect: any, index: number) => {
      try {
        return {
          planet1: aspect.planet1 || 'Sol',
          planet2: aspect.planet2 || 'Luna',
          type: aspect.type || 'conjunction',
          orb: aspect.orb || 0,
          applying: aspect.applying || false
        };
      } catch (error) {
        console.warn(`⚠️ Error procesando aspecto ${index}:`, error);
        return {
          planet1: 'Sol',
          planet2: 'Luna',
          type: 'conjunction',
          orb: 0,
          applying: false
        };
      }
    });

    // ✅ CALCULAR DISTRIBUCIONES
    const finalElementDistribution = elementDistribution || calculateElementDistribution(processedPlanets);
    const finalModalityDistribution = modalityDistribution || calculateModalityDistribution(processedPlanets);

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

    console.log('✅ === RESULTADO FINAL processChartData ===');
    console.log('🪐 Planetas procesados:', result.planets.length);
    console.log('🏠 Casas procesadas:', result.houses.length);
    console.log('🔗 Aspectos procesados:', result.aspects.length);
    console.log('🔺 Ascendente final:', result.ascendant);
    console.log('🔺 Medio Cielo final:', result.midheaven);

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