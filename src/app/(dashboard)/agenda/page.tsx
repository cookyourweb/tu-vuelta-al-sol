// src/app/(dashboard)/agenda/page.tsx - ARREGLADA COMPLETA
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AstrologicalCalendar from '@/components/astrology/AstrologicalCalendar';
import Button from '@/components/ui/Button';
import { 
  Star, 
  Calendar, 
  Moon, 
  Sun, 
  Zap, 
  BarChart3,
  RefreshCw,
  ArrowLeft,
  Eye,
  TrendingUp
} from 'lucide-react';

interface EventMetadata {
  totalEvents: number;
  lunarPhases: number;
  planetaryTransits: number;
  eclipses: number;
  retrogrades: number;
  highPriorityEvents: number;
  withAiInterpretation: number;
  period: {
    startDate: string;
    endDate: string;
  };
  userLocation: {
    place: string;
  };
}

export default function AgendaPage() {
  const [loading, setLoading] = useState(true);
  const [hasNatalChart, setHasNatalChart] = useState(false);
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [eventsMetadata, setEventsMetadata] = useState<EventMetadata | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    const initializeAgenda = async () => {
      try {
        setLoading(true);
        
        // Verificar carta natal
        const chartResponse = await fetch(`/api/charts/natal?userId=${user.uid}`);
        
        if (chartResponse.ok) {
          setHasNatalChart(true);
          
          // Obtener datos de nacimiento
          const birthDataResponse = await fetch(`/api/birth-data?userId=${user.uid}`);
          
          if (birthDataResponse.ok) {
            const birthData = await birthDataResponse.json();
            if (birthData.data && birthData.data.birthDate) {
              setBirthDate(birthData.data.birthDate);
            }
          }

          // Obtener metadata de eventos del endpoint correcto
          await loadEventsMetadata();
          
        } else {
          setHasNatalChart(false);
        }
      } catch (error) {
        console.error('Error al inicializar agenda:', error);
        setError('Ocurrió un error al cargar tus datos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    initializeAgenda();
  }, [user, router]);

  const loadEventsMetadata = async () => {
    try {
      console.log('📊 Cargando metadata de eventos...');
      
      // ARREGLADO: Usar complete-events en lugar de events
      const response = await fetch('/api/astrology/complete-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user?.uid,
          months: 6
        })
      });
      
      const data = await response.json();
      console.log('📥 Respuesta metadata:', data);
      
      // ARREGLADO: Acceder a data.data.events en lugar de data.events
      if (data.success && data.data && data.data.events) {
        const events = data.data.events;
        const statistics = data.data.statistics || {};
        const userProfile = data.data.userProfile || {};
        
        // Calcular metadata mejorada
        const metadata: EventMetadata = {
          totalEvents: statistics.totalEvents || events.length,
          lunarPhases: statistics.lunarPhases || events.filter((e: any) => e.type && e.type.includes('luna')).length,
          planetaryTransits: statistics.planetaryTransits || events.filter((e: any) => e.type === 'transito').length,
          eclipses: statistics.eclipses || events.filter((e: any) => e.type === 'eclipse').length,
          retrogrades: statistics.retrogrades || events.filter((e: any) => e.type === 'retrogrado').length,
          highPriorityEvents: statistics.highPriorityEvents || events.filter((e: any) => e.priority === 'high').length,
          withAiInterpretation: statistics.withAiInterpretation || events.filter((e: any) => e.hasAiInterpretation).length,
          period: {
            startDate: new Date().toLocaleDateString('es-ES'),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')
          },
          userLocation: {
            place: userProfile.place || 'Tu ubicación'
          }
        };
        
        setEventsMetadata(metadata);
        console.log(`✅ Metadata cargada: ${metadata.totalEvents} eventos totales, ${metadata.withAiInterpretation} con IA`);
      } else {
        console.warn('⚠️ No se pudo cargar metadata:', data.error);
        setError(`Error cargando eventos: ${data.error || 'Respuesta inválida'}`);
      }
    } catch (error) {
      console.error('❌ Error cargando metadata:', error);
      setError('Error de conexión al cargar eventos');
    }
  };

  const regenerateEvents = async () => {
    setRefreshing(true);
    try {
      console.log('🔄 Regenerando eventos...');
      
      // Forzar regeneración en el backend
      const response = await fetch('/api/astrology/complete-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user?.uid,
          forceRegenerate: true,
          months: 6
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Eventos regenerados exitosamente');
        // Recargar metadata
        await loadEventsMetadata();
        // Recargar la página para actualizar el calendario
        window.location.reload();
      } else {
        console.error('❌ Error regenerando:', data.error);
        setError(`Error al regenerar eventos: ${data.error}`);
      }
    } catch (error) {
      console.error('❌ Error regenerando eventos:', error);
      setError('Error de conexión al regenerar eventos');
    } finally {
      setRefreshing(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-400 border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Star className="w-8 h-8 text-yellow-400 animate-pulse" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Consultando las estrellas...</h2>
          <p className="text-purple-200 text-lg">Preparando tu calendario astrológico</p>
          <p className="text-purple-300 text-sm mt-2">✨ Cargando eventos e interpretaciones IA</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black py-8">
        <div className="container mx-auto px-4">
          <div className="p-8 bg-red-900/40 backdrop-blur-sm border border-red-400/30 rounded-3xl max-w-2xl mx-auto mt-8">
            <div className="text-center">
              <div className="text-6xl mb-6">❌</div>
              <h2 className="text-2xl font-bold text-red-300 mb-4">Error Cósmico</h2>
              <p className="text-red-200 mb-6">{error}</p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => {
                    setError(null);
                    window.location.reload();
                  }} 
                  className="bg-red-600 hover:bg-red-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reintentar
                </Button>
                <Button 
                  onClick={() => router.push('/dashboard')} 
                  variant="secondary"
                  className="bg-gray-700 hover:bg-gray-600 text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!hasNatalChart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black py-8">
        <div className="container mx-auto px-4">
          <div className="p-8 bg-amber-900/40 backdrop-blur-sm border border-amber-400/30 rounded-3xl max-w-2xl mx-auto mt-8">
            <div className="text-center">
              <div className="text-6xl mb-6">🌟</div>
              <h2 className="text-3xl font-bold text-amber-300 mb-4">Tu Viaje Cósmico Está a Punto de Comenzar</h2>
              <p className="text-amber-200 text-lg mb-6">
                Para acceder a tu agenda astrológica con eventos reales interpretados por IA, 
                necesitas generar tu carta natal primero.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                <Button 
                  onClick={() => router.push('/birth-data')} 
                  className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Configurar Datos de Nacimiento
                </Button>
                <Button 
                  onClick={() => router.push('/natal-chart')} 
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Generar Carta Natal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black py-8">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-full p-4 backdrop-blur-sm">
              <Calendar className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ✨ Tu Agenda Astrológica ✨
          </h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            Calendario interactivo con eventos reales de Prokerala e interpretaciones personalizadas de IA
          </p>
        </div>

        {/* Estadísticas */}
        {eventsMetadata && (
          <div className="max-w-6xl mx-auto mb-8">
            <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-sm border border-purple-400/30 rounded-3xl p-6">
              <h2 className="text-xl font-semibold text-purple-200 mb-6 text-center">
                🔮 Resumen de tu Año Astrológico
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-white mb-1">
                    {eventsMetadata.totalEvents}
                  </div>
                  <div className="text-gray-300 text-sm flex items-center justify-center">
                    <Star className="w-4 h-4 mr-1" />
                    Total
                  </div>
                </div>
                
                <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-blue-300 mb-1">
                    {eventsMetadata.lunarPhases}
                  </div>
                  <div className="text-gray-300 text-sm flex items-center justify-center">
                    <Moon className="w-4 h-4 mr-1" />
                    Lunares
                  </div>
                </div>
                
                <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-green-300 mb-1">
                    {eventsMetadata.planetaryTransits}
                  </div>
                  <div className="text-gray-300 text-sm flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Tránsitos
                  </div>
                </div>
                
                <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-yellow-300 mb-1">
                    {eventsMetadata.eclipses}
                  </div>
                  <div className="text-gray-300 text-sm flex items-center justify-center">
                    <Sun className="w-4 h-4 mr-1" />
                    Eclipses
                  </div>
                </div>
                
                <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-orange-300 mb-1">
                    {eventsMetadata.retrogrades}
                  </div>
                  <div className="text-gray-300 text-sm flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Retrógrados
                  </div>
                </div>
                
                <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-red-300 mb-1">
                    {eventsMetadata.highPriorityEvents}
                  </div>
                  <div className="text-gray-300 text-sm flex items-center justify-center">
                    <Zap className="w-4 h-4 mr-1" />
                    Alta Prioridad
                  </div>
                </div>
                
                <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-purple-300 mb-1">
                    {eventsMetadata.withAiInterpretation}
                  </div>
                  <div className="text-gray-300 text-sm flex items-center justify-center">
                    <Star className="w-4 h-4 mr-1" />
                    Con IA
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-purple-200 text-sm">
                  📅 Período: {eventsMetadata.period.startDate} → {eventsMetadata.period.endDate}
                </p>
                <p className="text-purple-300 text-xs mt-1">
                  📍 {eventsMetadata.userLocation.place}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Calendario Principal - ARREGLADO: Pasar userId */}
        <div className="max-w-7xl mx-auto mb-8">
          {user?.uid ? (
            <AstrologicalCalendar userId={user.uid} />
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-600">Cargando calendario...</p>
            </div>
          )}
        </div>
        
        {/* Botones de navegación */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900/40 to-gray-800/40 backdrop-blur-sm border border-gray-600/30 rounded-3xl p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => router.push('/dashboard')} 
                variant="secondary"
                className="bg-gray-700 hover:bg-gray-600 text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Button>
              
              <Button
                onClick={() => router.push('/natal-chart')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver Carta Natal
              </Button>
              
              <Button
                onClick={() => router.push('/progressed-chart')}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Ver Carta Progresada
              </Button>
              
              <Button
                onClick={regenerateEvents}
                className="bg-pink-600 hover:bg-pink-700"
                disabled={refreshing}
              >
                {refreshing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Regenerando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualizar Eventos
                  </>
                )}
              </Button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                💡 Haz clic en cualquier evento del calendario para ver su interpretación completa
              </p>
              {eventsMetadata && eventsMetadata.withAiInterpretation > 0 && (
                <p className="text-green-400 text-xs mt-1">
                  🤖 {eventsMetadata.withAiInterpretation} eventos con interpretaciones IA personalizadas
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}