// src/app/(dashboard)/progressed-chart/page.tsx - VERSIÓN CORREGIDA Y MEJORADA
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ProgressedChartVisual from '@/components/astrology/ProgressedChartVisual';
import { RefreshCw, Calendar, Clock, Star, TrendingUp, Info, MapPin, AlertTriangle, Sparkles, User, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';

// ✅ INTERFACES CORREGIDAS
interface ProgressedChartData {
  houses: any[];
  planets: any[];
  aspects: any[]; // 🔧 AÑADIDO: Aspectos progresados
  elementDistribution: { fire: number; earth: number; air: number; water: number };
  modalityDistribution: { cardinal: number; fixed: number; mutable: number };
  keyAspects: any[];
  ascendant?: { longitude?: number; sign?: string; degree?: number };
  midheaven?: { longitude?: number; sign?: string; degree?: number };
  progressionInfo: {
    year: number;
    period: string;
    description: string;
    startDate: string; // 🔧 REQUERIDO: Fecha de inicio
    endDate: string;   // 🔧 REQUERIDO: Fecha de fin
    ageAtStart: number; // 🔧 AÑADIDO: Edad al inicio del período
    isCurrentYear: boolean; // 🔧 AÑADIDO: Si es el año actual
  };
  birthData: {
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    latitude: number;
    longitude: number;
    timezone: string;
    fullName: string; // 🔧 AÑADIDO: Nombre completo
  };
  // 🔧 AÑADIDO: Comparación con carta natal
  natalComparison?: {
    planetaryMovements: any[];
    significantChanges: any[];
    newAspects: any[];
    dissolvingAspects: any[];
  };
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

export default function ProgressedChartPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Estados principales
  const [chartData, setChartData] = useState<ProgressedChartData | null>(null);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [currentAge, setCurrentAge] = useState<number>(0); // 🔧 AÑADIDO: Edad actual

  // 🔧 FUNCIÓN: Calcular edad actual
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

  // 🔧 FUNCIÓN: Calcular período de progresión personalizado (cumpleaños a cumpleaños)
  const calculateProgressionPeriod = (birthDate: string) => {
    const birth = new Date(birthDate);
    const currentYear = new Date().getFullYear();
    const age = calculateCurrentAge(birthDate);
    
    // 📅 PERÍODO ACTUAL: Del último cumpleaños al próximo
    const lastBirthday = new Date(birth);
    lastBirthday.setFullYear(currentYear);
    
    // Si el cumpleaños ya pasó este año, usar este año
    // Si no ha pasado, usar el año anterior
    const today = new Date();
    if (today < lastBirthday) {
      lastBirthday.setFullYear(currentYear - 1);
    }
    
    const nextBirthday = new Date(lastBirthday);
    nextBirthday.setFullYear(lastBirthday.getFullYear() + 1);
    
    return {
      startDate: lastBirthday.toISOString().split('T')[0],
      endDate: nextBirthday.toISOString().split('T')[0],
      year: lastBirthday.getFullYear(),
      ageAtStart: age,
      description: `Año Solar ${age} (${lastBirthday.getFullYear()}-${nextBirthday.getFullYear()})`,
      period: `Cumpleaños ${lastBirthday.getFullYear()} → ${nextBirthday.getFullYear()}`,
      isCurrentYear: true
    };
  };

  // 🔍 DEBUG: Log cambios importantes
  useEffect(() => {
    console.log('📡 Estado carta progresada:', {
      chartData: !!chartData,
      birthData: !!birthData,
      loading,
      error,
      currentAge
    });
  }, [chartData, birthData, loading, error, currentAge]);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    loadBirthData();
  }, [user, router]);

  useEffect(() => {
    if (birthData) {
      const age = calculateCurrentAge(birthData.birthDate);
      setCurrentAge(age);
      generateProgressedChart();
    }
  }, [birthData]);

  // ✅ FUNCIÓN: Cargar datos de nacimiento
  const loadBirthData = async () => {
    try {
      console.log('🔍 Cargando datos de nacimiento para carta progresada...');
      setDebugInfo('📡 Cargando datos de nacimiento...');
      
      const response = await fetch(`/api/birth-data?userId=${user?.uid}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Datos de nacimiento recibidos:', data);
        
        if (data.data) {
          const processedData: BirthData = {
            birthDate: data.data.birthDate,
            birthTime: data.data.birthTime,
            birthPlace: data.data.birthPlace || `${data.data.latitude}, ${data.data.longitude}`,
            latitude: data.data.latitude,
            longitude: data.data.longitude,
            timezone: data.data.timezone,
            fullName: data.data.fullName
          };
          
          setBirthData(processedData);
          setDebugInfo('✅ Datos de nacimiento cargados correctamente');
        } else {
          setError('No se encontraron datos de nacimiento');
          setDebugInfo('❌ Sin datos de nacimiento');
          router.push('/birth-data');
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Error API:', response.status, errorText);
        setError('Error al cargar datos de nacimiento');
        setDebugInfo('❌ Error cargando datos');
        router.push('/birth-data');
      }
    } catch (error) {
      console.error('💥 Error cargando datos:', error);
      setError('Error de conexión al cargar datos');
      setDebugInfo('💥 Error de conexión');
      router.push('/birth-data');
    }
  };

  // ✅ FUNCIÓN MEJORADA: Generar carta progresada
  const generateProgressedChart = async () => {
    if (!birthData || !user) return;
    
    setLoading(true);
    setError(null);
    setDebugInfo('🔄 Generando carta progresada personalizada...');
    
    try {
      // 📅 Calcular período personalizado
      const progressionPeriod = calculateProgressionPeriod(birthData.birthDate);
      
      console.log('🎭 Período de progresión calculado:', progressionPeriod);
      setDebugInfo(`📅 Período: ${progressionPeriod.description}`);
      
      // 🔧 LLAMADA MEJORADA AL API
      const response = await fetch('/api/charts/progressed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          regenerate: true,
          // 🔧 PARÁMETROS ESPECÍFICOS PARA CARTA PROGRESADA
          progressionConfig: {
            method: 'secondary', // Progresiones secundarias (1 día = 1 año)
            targetYear: progressionPeriod.year,
            startDate: progressionPeriod.startDate,
            endDate: progressionPeriod.endDate,
            includeNatalComparison: true // 🔧 COMPARACIÓN CON NATAL
          }
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error API carta progresada:', response.status, errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Resultado carta progresada:', result);
      
      if (result.success && result.data) {
        // ✅ PROCESAMIENTO MEJORADO DE DATOS
        const progressedChartData: ProgressedChartData = {
          planets: result.data.chart?.planets || [],
          houses: result.data.chart?.houses || [],
          aspects: result.data.chart?.aspects || [], // 🔧 ASPECTOS PROGRESADOS
          keyAspects: result.data.chart?.keyAspects || [],
          elementDistribution: result.data.chart?.elementDistribution || { fire: 0, earth: 0, air: 0, water: 0 },
          modalityDistribution: result.data.chart?.modalityDistribution || { cardinal: 0, fixed: 0, mutable: 0 },
          ascendant: result.data.chart?.ascendant,
          midheaven: result.data.chart?.midheaven,
          progressionInfo: {
            year: progressionPeriod.year,
            period: progressionPeriod.period,
            description: progressionPeriod.description,
            startDate: progressionPeriod.startDate,
            endDate: progressionPeriod.endDate,
            ageAtStart: progressionPeriod.ageAtStart,
            isCurrentYear: progressionPeriod.isCurrentYear
          },
          birthData: {
            birthDate: birthData.birthDate,
            birthTime: birthData.birthTime,
            birthPlace: birthData.birthPlace,
            latitude: birthData.latitude,
            longitude: birthData.longitude,
            timezone: birthData.timezone,
            fullName: birthData.fullName
          },
          // 🔧 COMPARACIÓN CON NATAL
          natalComparison: result.data.natalComparison || {
            planetaryMovements: [],
            significantChanges: [],
            newAspects: [],
            dissolvingAspects: []
          }
        };
        
        console.log('🎉 Carta progresada procesada exitosamente:', progressedChartData);
        setChartData(progressedChartData);
        setDebugInfo('✅ Carta progresada generada exitosamente');
        
      } else {
        console.error('❌ Respuesta inválida:', result);
        throw new Error(result.error || 'Error procesando carta progresada');
      }
      
    } catch (error) {
      console.error('💥 Error generando carta progresada:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      setDebugInfo('❌ Error en generación');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNCIÓN: Regenerar carta
  const handleRegenerate = () => {
    console.log('🔄 Regenerando carta progresada...');
    setChartData(null);
    setError(null);
    setDebugInfo('🔄 Regenerando...');
    generateProgressedChart();
  };

  // 🔧 FUNCIÓN: Navegar a agenda personalizada
  const handleViewPersonalAgenda = () => {
    router.push('/agenda');
  };

  // Renderizado de estados de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-black/50 to-purple-900/30 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
              <div className="animate-spin text-6xl mb-4">🌙</div>
              <h1 className="text-3xl font-bold text-white mb-4">
                Generando tu Carta Progresada
              </h1>
              <p className="text-xl text-gray-300 mb-4">
                Calculando tu evolución astrológica para la edad {currentAge}...
              </p>
              <div className="text-sm text-blue-300 bg-blue-900/20 rounded-lg p-3 max-w-md mx-auto">
                {debugInfo || 'Iniciando cálculos progresados...'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizado de errores
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-black/50 to-red-900/30 backdrop-blur-sm border border-red-400/30 rounded-3xl p-8">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-4">Error en Carta Progresada</h1>
              <p className="text-red-200 mb-6">{error}</p>
              
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => router.push('/birth-data')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Verificar Datos
                </Button>
                <Button
                  onClick={handleRegenerate}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reintentar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizado de datos faltantes
  if (!birthData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-black/50 to-yellow-900/30 backdrop-blur-sm border border-yellow-400/30 rounded-3xl p-8">
            <div className="text-center">
              <Info className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-4">
                Datos de Nacimiento Requeridos
              </h1>
              <p className="text-yellow-200 mb-6">
                Para generar tu carta progresada necesitamos tus datos de nacimiento completos.
              </p>
              
              <Button
                onClick={() => router.push('/birth-data')}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Completar Datos de Nacimiento
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ RENDERIZADO PRINCIPAL MEJORADO
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header principal mejorado */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-black/50 to-purple-900/30 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <TrendingUp className="w-10 h-10 text-purple-400 mr-3" />
              Tu Carta Progresada
            </h1>
            
            {/* 🔧 INFO PERSONALIZADA */}
            <div className="text-xl text-gray-300 mb-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <User className="w-5 h-5 text-purple-400" />
                <span>{birthData.fullName}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span>Evolución desde {birthData.birthPlace}</span>
              </div>
            </div>
            
            {/* Info del período personalizado */}
            {chartData?.progressionInfo && (
              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/20 rounded-xl p-6 max-w-3xl mx-auto mb-6">
                <h3 className="text-2xl font-semibold text-white mb-3 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-400 mr-2" />
                  {chartData.progressionInfo.description}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-purple-300 font-medium">Edad</div>
                    <div className="text-white text-lg">{chartData.progressionInfo.ageAtStart} años</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-300 font-medium">Período</div>
                    <div className="text-white text-lg">{chartData.progressionInfo.period}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-300 font-medium">Año Solar</div>
                    <div className="text-white text-lg">{chartData.progressionInfo.year}</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Botones de acción */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleRegenerate}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerar
              </Button>
              <Button
                onClick={handleViewPersonalAgenda}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Ver Agenda Personalizada
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Componente de visualización */}
        {chartData ? (
          <ProgressedChartVisual
            data={chartData}
            isLoading={loading}
            error={error}
          />
        ) : (
          <div className="bg-gradient-to-br from-black/50 to-purple-900/30 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
            <div className="text-center">
              <Clock className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Preparando tu Carta Progresada Personal
              </h3>
              <p className="text-gray-300 mb-6">
                Calculando tu evolución astrológica para la edad {currentAge}
              </p>
              <Button
                onClick={generateProgressedChart}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Star className="w-4 h-4 mr-2" />
                Generar Carta Progresada
              </Button>
            </div>
          </div>
        )}

        {/* 🔧 PRÓXIMOS PASOS */}
        <div className="mt-8 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 backdrop-blur-sm border border-emerald-400/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <Sparkles className="w-5 h-5 text-emerald-400 mr-2" />
            Próximos Pasos en tu Viaje Astrológico
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-emerald-300 font-semibold mb-2">📅 Agenda Personalizada</h4>
              <p className="text-gray-300 text-sm mb-3">
                Genera tu guía astrológica completa para todo el año con fechas específicas,
                lunaciones, tránsitos y recomendaciones personalizadas.
              </p>
              <Button
                onClick={handleViewPersonalAgenda}
                className="bg-emerald-600 hover:bg-emerald-700 text-sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Crear Agenda
              </Button>
            </div>
            
            <div>
              <h4 className="text-teal-300 font-semibold mb-2">🔮 Interpretación IA</h4>
              <p className="text-gray-300 text-sm mb-3">
                Obtén una interpretación detallada y personalizada de tu carta progresada
                generada por inteligencia artificial especializada en astrología.
              </p>
              <Button
                onClick={() => router.push('/interpretation')}
                className="bg-teal-600 hover:bg-teal-700 text-sm"
                disabled
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Próximamente
              </Button>
            </div>
          </div>
        </div>

        {/* Debug info */}
        {debugInfo && (
          <div className="mt-6 bg-gray-900/50 border border-gray-600/30 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">
              Estado del proceso:
            </h4>
            <p className="text-xs text-gray-400">{debugInfo}</p>
          </div>
        )}
      </div>
    </div>
  );
}