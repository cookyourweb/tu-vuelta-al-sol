// src/app/(dashboard)/natal-chart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ChartDisplay from '@/components/astrology/ChartDisplay';
import { Sparkles, Edit, Star } from 'lucide-react';
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

  // Verificar si es Verónica (para debugging)
  const isVeronica = birthData?.birthDate === '1974-02-10' && 
                    birthData?.birthTime === '07:30:00' && 
                    birthData?.birthPlace?.includes('Sevilla');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    loadBirthData();
  }, [user, router]);

  useEffect(() => {
    if (birthData) {
      fetchChartData();
    }
  }, [birthData]);

  // ✅ FUNCIÓN CORREGIDA:
  const loadBirthData = async () => {
    try {
      console.log('🔍 Cargando datos de nacimiento...');
      console.log('👤 User UID:', user?.uid);
      
      // ✅ AÑADIR EL USERID COMO PARÁMETRO
      const response = await fetch(`/api/birth-data?userId=${user?.uid}`);
      console.log('📡 Respuesta API status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Datos recibidos:', data);
        
        // ✅ PROCESAR DATOS CORRECTAMENTE
        const processedData = {
          birthDate: data.birthDate,
          birthTime: data.birthTime,
          birthPlace: data.birthPlace || `${data.latitude},${data.longitude}`
        };
        
        console.log('🔄 Datos procesados:', processedData);
        setBirthData(processedData);
      } else {
        const errorText = await response.text();
        console.log('❌ Error API:', response.status, errorText);
        console.log('🔄 Redirigiendo a birth-data...');
        router.push('/birth-data');
      }
    } catch (error) {
      console.error('💥 Error cargando datos de nacimiento:', error);
      router.push('/birth-data');
    }
  };

  // ✅ FUNCIÓN: Generar carta natal
  const fetchChartData = async () => {
    if (!birthData) return;
    
    setLoading(true);
    setError(null);
    setDebugInfo('🔄 Generando carta natal...');
    
    try {
      // Construir parámetros para la API
      const params = new URLSearchParams({
        date: birthData.birthDate,
        time: birthData.birthTime,
        location: birthData.birthPlace,
        userId: user?.uid || '' // ✅ AÑADIR USERID
      });
      
      setDebugInfo('📡 Enviando petición a API Charts...');
      
      // ✅ RUTA CORREGIDA: /api/charts/natal en lugar de /api/charts/generate
      const generateResponse = await fetch(`/api/charts/natal?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!generateResponse.ok) {
        const errorText = await generateResponse.text();
        setDebugInfo(`❌ Error HTTP ${generateResponse.status}`);
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
      
      if (isVeronica) {
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
    const planets: any[] = (rawData.planets || []).map((planet: any, index: number) => ({
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
    const houses: any[] = (rawData.houses || []).map((house: any, index: number) => ({
      number: house.number || (index + 1),
      sign: house.sign || 'Aries',
      degree: house.degree || 0,
      minutes: house.minutes || 0,
      longitude: house.longitude || house.degree || 0
    }));

    // ✅ PROCESAR ASPECTOS CON VALIDACIÓN
    const aspects: any[] = (rawData.aspects || []).map((aspect: any) => ({
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
      keyAspects: aspects,
      ascendant: rawData.ascendant,
      midheaven: rawData.midheaven,
      elementDistribution,
      modalityDistribution
    };
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
            <h2 className="text-2xl font-bold text-white">Generando tu Carta Natal</h2>
            <p className="text-gray-300 leading-relaxed">
              Calculando las posiciones planetarias exactas para el momento de tu nacimiento...
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
            <h2 className="text-2xl font-bold text-white">Error al generar carta</h2>
            <p className="text-gray-300">{error}</p>
            
            {debugInfo && (
              <div className="bg-black/30 rounded-lg p-3 text-sm text-red-300 font-mono text-left">
                {debugInfo}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="bg-purple-600 hover:bg-purple-700 flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Intentar de nuevo</span>
              </Button>
              <Button
                onClick={() => router.push('/birth-data')}
                variant="outline"
                className="border-purple-400 text-purple-300 hover:bg-purple-400/10"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar datos
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ PANTALLA PRINCIPAL - CARTA NATAL GENERADA
  if (!chartData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300">No hay datos de carta natal disponibles</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 bg-purple-600 hover:bg-purple-700"
          >
            Recargar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Header mejorado con icono movido */}
        <div className="text-center space-y-6">
          <div className="flex justify-center items-center mb-6">
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-6 backdrop-blur-sm relative">
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              <Star className="w-12 h-12 text-yellow-400" />
              
              {/* Badge de corrección para Verónica */}
              {isVeronica && chartData?.ascendant?.sign === 'Acuario' && (
                <div className="absolute -bottom-2 -left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  ✅ Corregido
                </div>
              )}
            </div>
          </div>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed flex items-center justify-center gap-3">
            <Star className="w-6 h-6 text-yellow-400 flex-shrink-0" />
            Descubre los secretos que los astros revelaron en el momento exacto de tu nacimiento
          </p>
          
        </div>

        {/* Carta natal - SIN TARJETAS DE INFORMACIÓN */}
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