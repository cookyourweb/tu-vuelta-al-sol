// src/app/(dashboard)/progressed-chart/page.tsx - VERSIÓN COMPLETA SIN HEADER DUPLICADO
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { RefreshCw, Calendar, Clock, Star, TrendingUp, Info, MapPin } from 'lucide-react';

interface ProgressionPeriod {
  startDate: Date;
  endDate: Date;
  startYear: number;
  description: string;
  shortDescription: string;
  daysUntilStart: number;
  isCurrentPeriod: boolean;
}

interface ProgressedChartData {
  period: ProgressionPeriod;
  chart: any;
  cached: boolean;
  message: string;
}

interface AstroEvent {
  icon: string;
  title: string;
  description: string;
  type: 'season' | 'moon' | 'planet' | 'special';
}

export default function ProgressedChartPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [progressedData, setProgressedData] = useState<ProgressedChartData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasExistingChart, setHasExistingChart] = useState(false);
  const [currentAstroEvent, setCurrentAstroEvent] = useState<AstroEvent | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string>('Sevilla, España');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    checkExistingChart();
    detectCurrentAstroEvent();
    detectLocation();
  }, [user, router]);

  // 🌍 NUEVA FUNCIÓN: Detectar ubicación actual
  const detectLocation = () => {
    // Por ahora usamos Sevilla como ubicación por defecto
    // En el futuro se puede integrar con geolocalización o perfil del usuario
    setCurrentLocation('Sevilla, España');
  };

  // 🌟 FUNCIÓN MEJORADA: Detectar evento astrológico actual con más precisión
  const detectCurrentAstroEvent = () => {
    const today = new Date();
    const month = today.getMonth() + 1; // 1-12
    const day = today.getDate();
    
    let event: AstroEvent | null = null;
    
    // Temporadas zodiacales con fechas exactas
    if (month === 3 && day >= 21 || month === 4 && day < 20) {
      event = {
        icon: '♈',
        title: 'Temporada de Aries',
        description: 'Energía de renovación, iniciativa y liderazgo',
        type: 'season'
      };
    } else if (month === 4 && day >= 20 || month === 5 && day < 21) {
      event = {
        icon: '♉',
        title: 'Temporada de Tauro',
        description: 'Estabilidad, determinación y conexión con la naturaleza',
        type: 'season'
      };
    } else if (month === 5 && day >= 21 || month === 6 && day < 21) {
      event = {
        icon: '♊',
        title: 'Temporada de Géminis',
        description: 'Comunicación, versatilidad y aprendizaje',
        type: 'season'
      };
    } else if (month === 6 && day >= 21 || month === 7 && day < 23) {
      event = {
        icon: '♋',
        title: 'Temporada de Cáncer',
        description: 'Emociones, hogar y conexiones familiares',
        type: 'season'
      };
    } else if (month === 7 && day >= 23 || month === 8 && day < 23) {
      event = {
        icon: '♌',
        title: 'Temporada de Leo',
        description: 'Creatividad, autoexpresión y brillo personal',
        type: 'season'
      };
    } else if (month === 8 && day >= 23 || month === 9 && day < 23) {
      event = {
        icon: '♍',
        title: 'Temporada de Virgo',
        description: 'Organización, perfeccionamiento y servicio',
        type: 'season'
      };
    } else if (month === 9 && day >= 23 || month === 10 && day < 23) {
      event = {
        icon: '♎',
        title: 'Temporada de Libra',
        description: 'Equilibrio, relaciones y armonía',
        type: 'season'
      };
    } else if (month === 10 && day >= 23 || month === 11 && day < 22) {
      event = {
        icon: '♏',
        title: 'Temporada de Escorpio',
        description: 'Transformación, profundidad y regeneración',
        type: 'season'
      };
    } else if (month === 11 && day >= 22 || month === 12 && day < 22) {
      event = {
        icon: '♐',
        title: 'Temporada de Sagitario',
        description: 'Expansión, filosofía y aventura',
        type: 'season'
      };
    } else if (month === 12 && day >= 22 || month === 1 && day < 20) {
      event = {
        icon: '♑',
        title: 'Temporada de Capricornio',
        description: 'Disciplina, logros y construcción sólida',
        type: 'season'
      };
    } else if (month === 1 && day >= 20 || month === 2 && day < 19) {
      event = {
        icon: '♒',
        title: 'Temporada de Acuario',
        description: 'Innovación, independencia y visión futurista',
        type: 'season'
      };
    } else if (month === 2 && day >= 19 || month === 3 && day < 21) {
      event = {
        icon: '♓',
        title: 'Temporada de Piscis',
        description: 'Intuición, espiritualidad y compasión',
        type: 'season'
      };
    }
    
    // Evento por defecto si no hay temporada específica
    if (!event) {
      event = {
        icon: '✨',
        title: 'Momento de Reflexión Cósmica',
        description: 'Tiempo ideal para conectar con tu sabiduría interior',
        type: 'special'
      };
    }
    
    setCurrentAstroEvent(event);
  };

  const checkExistingChart = async () => {
    try {
      const response = await fetch(`/api/charts/progressed?userId=${user?.uid}`);
      const data = await response.json();
      
      if (data.success && data.data.hasChart) {
        setProgressedData(data.data);
        setHasExistingChart(true);
      } else {
        setHasExistingChart(false);
        if (data.data.period) {
          setProgressedData({ 
            period: data.data.period, 
            chart: null, 
            cached: false, 
            message: 'Carta progresada no generada aún' 
          });
        }
      }
    } catch (error) {
      console.error('Error verificando carta existente:', error);
    }
  };

  // 🎯 FUNCIÓN MEJORADA: Calcular período de progresión basado en fecha actual
  const calculateCurrentProgressionPeriod = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    // Ejemplo: si el cumpleaños del usuario es 10 febrero
    // Su año astrológico actual sería desde 10 feb 2025 a 10 feb 2026
    const birthdayMonth = 2; // Febrero (ejemplo)
    const birthdayDay = 10; // Día 10 (ejemplo)
    
    let startYear = currentYear;
    let endYear = currentYear + 1;
    
    // Si aún no ha pasado el cumpleaños este año
    if (today.getMonth() + 1 < birthdayMonth || 
        (today.getMonth() + 1 === birthdayMonth && today.getDate() < birthdayDay)) {
      startYear = currentYear - 1;
      endYear = currentYear;
    }
    
    const startDate = new Date(startYear, birthdayMonth - 1, birthdayDay);
    const endDate = new Date(endYear, birthdayMonth - 1, birthdayDay);
    
    const daysUntilStart = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const isCurrentPeriod = today >= startDate && today <= endDate;
    
    return {
      startDate,
      endDate,
      startYear,
      description: `${startDate.toLocaleDateString('es-ES')} - ${endDate.toLocaleDateString('es-ES')}`,
      shortDescription: `Año ${startYear}-${endYear}`,
      daysUntilStart,
      isCurrentPeriod
    };
  };

  const generateProgressedChart = async (regenerate: boolean = false) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/charts/progressed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          regenerate
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProgressedData(data.data);
        setHasExistingChart(true);
      } else {
        setError(data.error || 'Error generando carta progresada');
      }
    } catch (error) {
      console.error('Error generando carta progresada:', error);
      setError('Error de conexión al generar carta progresada');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // 🎯 FUNCIÓN MEJORADA: Determinar estado del período con mejor lógica
  const getPeriodStatus = (period: ProgressionPeriod) => {
    const today = new Date();
    const startDate = new Date(period.startDate);
    const endDate = new Date(period.endDate);
    
    if (today >= startDate && today <= endDate) {
      const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return {
        status: 'current',
        text: `Activo (${daysRemaining} días restantes)`,
        color: 'text-green-400 bg-green-900/20',
        days: daysRemaining
      };
    } else if (today < startDate) {
      const daysUntil = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return {
        status: 'future',
        text: `Comienza en ${daysUntil} días`,
        color: 'text-blue-400 bg-blue-900/20',
        days: daysUntil
      };
    } else {
      const daysPassed = Math.ceil((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
      return {
        status: 'past',
        text: `Finalizado hace ${daysPassed} días`,
        color: 'text-gray-400 bg-gray-900/20',
        days: daysPassed
      };
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🔮</div>
          <p className="text-white text-xl">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  // Si no hay datos de período, calcular uno temporal
  const displayPeriod = progressedData?.period || calculateCurrentProgressionPeriod();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* ✅ SIN PrimaryHeader - se renderiza automáticamente por layout */}
      
      {/* Hero Section */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 pt-8">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🔮 Tu Carta Progresada
            </h1>
            <p className="text-xl text-purple-200 mb-2">
              Tu evolución astrológica personalizada
            </p>
            <p className="text-purple-300">
              Descubre cómo los astros influirán en tu próximo año de vida
            </p>
          </div>

          {/* 🌟 NUEVO: Banner de evento astrológico actual */}
          {currentAstroEvent && (
            <div className="bg-gradient-to-r from-yellow-800/30 to-orange-800/30 border border-yellow-500/30 rounded-xl p-4 mb-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-4">
                <div className="text-3xl">{currentAstroEvent.icon}</div>
                <div className="text-center">
                  <h3 className="text-yellow-200 font-semibold text-lg">
                    {currentAstroEvent.title}
                  </h3>
                  <p className="text-yellow-300 text-sm">
                    {currentAstroEvent.description}
                  </p>
                </div>
                <div className="flex items-center text-yellow-400 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{currentLocation}</span>
                </div>
              </div>
            </div>
          )}

          {/* Información del Período */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h2 className="text-2xl font-bold text-white mb-2">
                  📊 Período de Progresión
                </h2>
                <p className="text-lg text-purple-200 font-semibold">
                  {displayPeriod.description}
                </p>
                <p className="text-purple-300 text-sm mt-1">
                  Año astrológico: {displayPeriod.shortDescription}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {(() => {
                  const statusInfo = getPeriodStatus(displayPeriod);
                  return (
                    <div className={`px-4 py-2 rounded-lg ${statusInfo.color} border border-current/20`}>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{statusInfo.text}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="container mx-auto px-4 py-8">
        
        {/* Mensajes de Error */}
        {error && (
          <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-4 mb-6 max-w-4xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">!</span>
              </div>
              <div>
                <h3 className="text-red-200 font-semibold">Error</h3>
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-4xl mx-auto">
          {!hasExistingChart ? (
            <button
              onClick={() => generateProgressedChart(false)}
              disabled={isLoading}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Star className="w-5 h-5" />
              )}
              <span>
                {isLoading ? 'Generando Carta...' : '🔮 Generar Mi Carta Progresada'}
              </span>
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button
                onClick={() => generateProgressedChart(true)}
                disabled={isLoading}
                className="flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Regenerar Carta</span>
              </button>
              
              <button className="flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-all">
                <TrendingUp className="w-4 h-4" />
                <span>Interpretar con IA</span>
              </button>
            </div>
          )}
        </div>

        {/* Contenido de la Carta */}
        {progressedData?.chart ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            
            {/* Visualización de la Carta */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  🌌 Carta Progresada Visual
                </h2>
                <div className="text-sm text-purple-300">
                  {progressedData.cached ? '💾 Cache' : '🆕 Nueva'}
                </div>
              </div>
              
              <div className="aspect-square bg-black/30 rounded-xl flex items-center justify-center border-2 border-dashed border-purple-400/50">
                <div className="text-center">
                  <div className="text-6xl mb-4">🔮</div>
                  <p className="text-purple-200 font-medium">
                    Visualización de Carta Progresada
                  </p>
                  <p className="text-purple-400 text-sm mt-2">
                    Próximamente: Círculo zodiacal interactivo
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-black/30 rounded-lg">
                <h3 className="text-white font-semibold mb-3">📋 Datos Técnicos</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-purple-300">Año de Progresión:</span>
                    <span className="text-white ml-2 font-medium">
                      {progressedData.period.startYear}
                    </span>
                  </div>
                  <div>
                    <span className="text-purple-300">Sistema:</span>
                    <span className="text-white ml-2 font-medium">Tropical</span>
                  </div>
                  <div>
                    <span className="text-purple-300">Casas:</span>
                    <span className="text-white ml-2 font-medium">Placidus</span>
                  </div>
                  <div>
                    <span className="text-purple-300">Aspectos:</span>
                    <span className="text-white ml-2 font-medium">Completos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interpretación */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">
                🧠 Interpretación del Período
              </h2>
              
              <div className="bg-gradient-to-r from-purple-800/50 to-blue-800/50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  ✨ Resumen de tu Año Astrológico
                </h3>
                <p className="text-purple-200 leading-relaxed">
                  Tu carta progresada para el período {progressedData.period.shortDescription} revela 
                  importantes cambios y oportunidades de crecimiento personal. Este es un momento 
                  clave para la evolución de tu alma según los movimientos planetarios progresados.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="border-l-4 border-purple-400 pl-4">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    🎯 Temas Principales del Año
                  </h4>
                  <ul className="text-purple-200 space-y-2">
                    <li>• Transformación personal profunda</li>
                    <li>• Nuevas oportunidades de crecimiento</li>
                    <li>• Cambios en relaciones importantes</li>
                    <li>• Evolución espiritual y consciencia</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    🌟 Oportunidades de Crecimiento
                  </h4>
                  <p className="text-green-200">
                    Las progresiones planetarias indican momentos favorables para 
                    iniciar proyectos importantes y tomar decisiones que marcarán 
                    tu futuro a largo plazo.
                  </p>
                </div>

                <div className="border-l-4 border-orange-400 pl-4">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    ⚠️ Áreas de Atención
                  </h4>
                  <p className="text-orange-200">
                    Algunos aspectos progresados sugieren la necesidad de paciencia 
                    y reflexión antes de actuar. Es momento de integrar las lecciones 
                    aprendidas.
                  </p>
                </div>

                <div className="bg-blue-900/30 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-3">
                    🚀 Próximos Pasos
                  </h4>
                  <div className="space-y-2 text-blue-200">
                    <p>📅 <strong>Generar interpretación completa</strong> con inteligencia artificial</p>
                    <p>🎨 <strong>Visualización interactiva</strong> de aspectos progresados</p>
                    <p>📊 <strong>Comparación</strong> con tu carta natal</p>
                    <p>📱 <strong>Integración</strong> con tu agenda personal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-white/20">
              <div className="mb-6">
                <div className="text-8xl mb-4">🔮</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Tu Carta Progresada te está esperando
                </h2>
                <p className="text-xl text-purple-200 mb-6">
                  Descubre cómo evolucionarás durante tu próximo año astrológico
                </p>
              </div>

              <div className="bg-blue-900/30 rounded-lg p-6 mb-8 text-left">
                <div className="flex items-start space-x-3">
                  <Info className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      ¿Qué es una Carta Progresada?
                    </h3>
                    <div className="text-blue-200 space-y-2">
                      <p>
                        • <strong>Evolución personal:</strong> Muestra cómo evolucionas internamente a lo largo del tiempo
                      </p>
                      <p>
                        • <strong>Ciclo anual:</strong> Calculada desde tu cumpleaños hasta el siguiente
                      </p>
                      <p>
                        • <strong>Guía práctica:</strong> Te ayuda a entender las energías del año y cómo aprovecharlas
                      </p>
                      <p>
                        • <strong>Complemento natal:</strong> Funciona junto con tu carta natal para una visión completa
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-900/30 rounded-lg p-4 mb-6">
                <p className="text-purple-200">
                  <strong>Tu período actual:</strong> {displayPeriod.description}
                </p>
                {(() => {
                  const statusInfo = getPeriodStatus(displayPeriod);
                  return (
                    <p className="text-purple-300 text-sm mt-1">
                      {statusInfo.text}
                    </p>
                  );
                })()}
              </div>

              <p className="text-purple-300 mb-8">
                Haz clic en "Generar Mi Carta Progresada" para comenzar tu análisis personalizado
              </p>
            </div>
          </div>
        )}

        {/* Enlaces relacionados */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gradient-to-r from-purple-800/30 to-blue-800/30 rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              🌟 Explora más de tu universo astrológico
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/natal-chart"
                className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors group"
              >
                <span className="text-2xl">🌙</span>
                <div>
                  <p className="font-semibold text-white group-hover:text-purple-200">
                    Carta Natal
                  </p>
                  <p className="text-sm text-purple-300">
                    Tu mapa al nacer
                  </p>
                </div>
              </a>
              
              <a
                href="/agenda"
                className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors group"
              >
                <span className="text-2xl">📅</span>
                <div>
                  <p className="font-semibold text-white group-hover:text-purple-200">
                    Agenda Anual
                  </p>
                  <p className="text-sm text-purple-300">
                    Eventos cósmicos</p>
               </div>
             </a>
             
             
              <a href="/birth-data"
               className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors group"
             >
               <span className="text-2xl">📊</span>
               <div>
                 <p className="font-semibold text-white group-hover:text-purple-200">
                   Mis Datos
                 </p>
                 <p className="text-sm text-purple-300">
                   Perfil cósmico
                 </p>
               </div>
             </a>
           </div>
         </div>
       </div>

       {/* 🌟 NUEVA SECCIÓN: Panel de hoy - Estado actual */}
       <div className="max-w-4xl mx-auto mt-8">
         <div className="bg-gradient-to-r from-indigo-800/30 to-purple-800/30 rounded-xl p-6 border border-white/20">
           <h3 className="text-xl font-bold text-white mb-4 flex items-center">
             📍 Tu Momento Cósmico Actual
             <span className="ml-2 text-sm bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
               EN VIVO
             </span>
           </h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Fecha y ubicación actual */}
             <div className="bg-black/20 rounded-lg p-4">
               <h4 className="text-white font-semibold mb-3 flex items-center">
                 <Calendar className="w-4 h-4 mr-2" />
                 Fecha Actual
               </h4>
               <div className="space-y-2 text-sm">
                 <p className="text-purple-200">
                   <strong>Hoy:</strong> {new Date().toLocaleDateString('es-ES', { 
                     weekday: 'long', 
                     year: 'numeric', 
                     month: 'long', 
                     day: 'numeric' 
                   })}
                 </p>
                 <p className="text-purple-200">
                   <strong>Ubicación:</strong> {currentLocation}
                 </p>
                 <p className="text-purple-200">
                   <strong>Hora local:</strong> {new Date().toLocaleTimeString('es-ES', {
                     hour: '2-digit',
                     minute: '2-digit'
                   })}
                 </p>
               </div>
             </div>

             {/* Estado de tu período personal */}
             <div className="bg-black/20 rounded-lg p-4">
               <h4 className="text-white font-semibold mb-3 flex items-center">
                 <TrendingUp className="w-4 h-4 mr-2" />
                 Tu Año Astrológico
               </h4>
               <div className="space-y-2 text-sm">
                 {(() => {
                   const statusInfo = getPeriodStatus(displayPeriod);
                   const isActive = statusInfo.status === 'current';
                   
                   return (
                     <>
                       <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${statusInfo.color}`}>
                         {isActive ? '🟢' : statusInfo.status === 'future' ? '🔵' : '⚫'} {statusInfo.text}
                       </div>
                       <p className="text-purple-200">
                         <strong>Período:</strong> {displayPeriod.shortDescription}
                       </p>
                       {isActive && (
                         <p className="text-green-300 text-xs">
                           ✨ Es el momento perfecto para generar tu carta progresada
                         </p>
                       )}
                     </>
                   );
                 })()}
               </div>
             </div>
           </div>

           {/* Consejo del día basado en la temporada actual */}
           {currentAstroEvent && (
             <div className="mt-6 bg-gradient-to-r from-yellow-800/20 to-orange-800/20 rounded-lg p-4 border border-yellow-500/20">
               <h4 className="text-yellow-200 font-semibold mb-2 flex items-center">
                 {currentAstroEvent.icon} Energía de Hoy: {currentAstroEvent.title}
               </h4>
               <p className="text-yellow-300 text-sm mb-3">
                 {currentAstroEvent.description}
               </p>
               
               {/* Consejos específicos por temporada */}
               <div className="text-yellow-200 text-sm">
                 <strong>💡 Consejo para hoy:</strong>
                 {(() => {
                   const month = new Date().getMonth() + 1;
                   if (month >= 3 && month <= 5) return " Aprovecha la energía primaveral para iniciar nuevos proyectos.";
                   if (month >= 6 && month <= 8) return " El verano te invita a brillar y expresar tu creatividad.";
                   if (month >= 9 && month <= 11) return " El otoño es perfecto para reflexionar y organizar tu vida.";
                   return " El invierno te llama a la introspección y planificación para el futuro.";
                 })()}
               </div>
             </div>
           )}
         </div>
       </div>

       {/* 🎯 NUEVA SECCIÓN: Próximos eventos importantes */}
       <div className="max-w-4xl mx-auto mt-8">
         <div className="bg-gradient-to-r from-blue-800/30 to-cyan-800/30 rounded-xl p-6 border border-white/20">
           <h3 className="text-xl font-bold text-white mb-4 flex items-center">
             🔮 Próximos Eventos Cósmicos Importantes
           </h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Calcular próximo equinoccio/solsticio */}
             {(() => {
               const today = new Date();
               const year = today.getFullYear();
               const month = today.getMonth() + 1;
               
               let nextSeason = '';
               let nextDate = '';
               let daysUntil = 0;
               
               if (month < 3 || (month === 3 && today.getDate() < 21)) {
                 nextSeason = 'Equinoccio de Primavera';
                 const springDate = new Date(year, 2, 21); // 21 marzo
                 nextDate = springDate.toLocaleDateString('es-ES');
                 daysUntil = Math.ceil((springDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
               } else if (month < 6 || (month === 6 && today.getDate() < 21)) {
                 nextSeason = 'Solsticio de Verano';
                 const summerDate = new Date(year, 5, 21); // 21 junio
                 nextDate = summerDate.toLocaleDateString('es-ES');
                 daysUntil = Math.ceil((summerDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
               } else if (month < 9 || (month === 9 && today.getDate() < 23)) {
                 nextSeason = 'Equinoccio de Otoño';
                 const autumnDate = new Date(year, 8, 23); // 23 septiembre
                 nextDate = autumnDate.toLocaleDateString('es-ES');
                 daysUntil = Math.ceil((autumnDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
               } else if (month < 12 || (month === 12 && today.getDate() < 22)) {
                 nextSeason = 'Solsticio de Invierno';
                 const winterDate = new Date(year, 11, 22); // 22 diciembre
                 nextDate = winterDate.toLocaleDateString('es-ES');
                 daysUntil = Math.ceil((winterDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
               } else {
                 nextSeason = 'Equinoccio de Primavera';
                 const springDate = new Date(year + 1, 2, 21); // 21 marzo del siguiente año
                 nextDate = springDate.toLocaleDateString('es-ES');
                 daysUntil = Math.ceil((springDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
               }
               
               return (
                 <div className="bg-black/20 rounded-lg p-4">
                   <h4 className="text-cyan-200 font-semibold mb-2 flex items-center">
                     🌅 {nextSeason}
                   </h4>
                   <p className="text-cyan-300 text-sm">
                     <strong>Fecha:</strong> {nextDate}
                   </p>
                   <p className="text-cyan-300 text-sm">
                     <strong>En:</strong> {daysUntil} días
                   </p>
                   <p className="text-cyan-400 text-xs mt-2">
                     Cambio estacional importante para renovar energías
                   </p>
                 </div>
               );
             })()}

             {/* Próximo cumpleaños (simulado) */}
             <div className="bg-black/20 rounded-lg p-4">
               <h4 className="text-cyan-200 font-semibold mb-2 flex items-center">
                 🎂 Tu Próximo Año Astrológico
               </h4>
               {(() => {
                 const statusInfo = getPeriodStatus(displayPeriod);
                 if (statusInfo.status === 'current') {
                   return (
                     <>
                       <p className="text-cyan-300 text-sm">
                         <strong>Termina en:</strong> {statusInfo.days} días
                       </p>
                       <p className="text-cyan-400 text-xs mt-2">
                         Prepárate para tu nueva evolución cósmica
                       </p>
                     </>
                   );
                 } else if (statusInfo.status === 'future') {
                   return (
                     <>
                       <p className="text-cyan-300 text-sm">
                         <strong>Comienza en:</strong> {statusInfo.days} días
                       </p>
                       <p className="text-cyan-400 text-xs mt-2">
                         Tu nueva carta progresada estará lista pronto
                       </p>
                     </>
                   );
                 } else {
                   return (
                     <>
                       <p className="text-cyan-300 text-sm">
                         <strong>Nuevo ciclo:</strong> Ya disponible
                       </p>
                       <p className="text-cyan-400 text-xs mt-2">
                         ¡Es hora de generar tu nueva carta progresada!
                       </p>
                     </>
                   );
                 }
               })()}
             </div>
           </div>

           {/* Llamada a la acción contextual */}
           <div className="mt-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-3 border border-purple-400/20">
             <p className="text-purple-200 text-sm text-center">
               <strong>💫 Recomendación:</strong> 
               {(() => {
                 const statusInfo = getPeriodStatus(displayPeriod);
                 if (statusInfo.status === 'current') {
                   return " Tu período progresado está activo. ¡Es el momento perfecto para generar tu carta!";
                 } else if (statusInfo.status === 'future') {
                   return " Prepárate para tu próximo año astrológico explorando tu carta actual.";
                 } else {
                   return " Tu nuevo período ha comenzado. Genera tu carta progresada actualizada.";
                 }
               })()}
             </p>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
}
