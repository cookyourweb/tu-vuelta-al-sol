// src/app/(dashboard)/agenda/page.tsx - ESTILOS DISRUPTIVOS Y MOTIVADORES

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AstrologicalCalendar from '@/components/astrology/AstrologicalCalendar';
import AstrologicalAgenda from '@/components/astrology/AstrologicalAgenda';
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
  TrendingUp,
  List,
  Grid,
  ToggleRight,
  Crown,
  Rocket,
  Flame,
  Gem,
  Sparkles,
  Target,
  Compass,

  Wand2
} from 'lucide-react';

interface EventMetadata {
  totalEvents: number;
  lunarPhases: number;
  planetaryTransits: number;
  eclipses: number;
  retrogrades: number;
  highPriorityEvents: number;
  period: {
    startDate: string;
    endDate: string;
  };
  userLocation: {
    place: string;
  };
}

// FRASES DISRUPTIVAS MOTIVADORAS
const getMotivationalPhrase = () => {
  const phrases = [
    "TU DESPERTAR CÓSMICO COMIENZA AHORA",
    "EL UNIVERSO HA CONSPIRADO PARA TU GRANDEZA", 
    "MOMENTO DE ACTIVAR TU PODER CELESTIAL",
    "TUS ESTRELLAS SE ALINEAN PARA LA VICTORIA",
    "PREPÁRATE PARA TU REVOLUCIÓN PERSONAL",
    "EL COSMOS TE LLAMA A BRILLAR SIN LÍMITES",
    "TU DESTINO ÉPICO SE DESBLOQUEA HOY",
    "ENERGÍA SUPERIOR ACTIVADA - ÚSALA SABIAMENTE",
    "LAS FUERZAS UNIVERSALES TRABAJAN PARA TI",
    "MOMENTO DE MANIFESTAR TU MÁXIMO POTENCIAL"
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
};

export default function AgendaPage() {
  const [loading, setLoading] = useState(true);
  const [hasNatalChart, setHasNatalChart] = useState(false);
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [eventsMetadata, setEventsMetadata] = useState<EventMetadata | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'agenda' | 'both'>('both');
  const [motivationalPhrase, setMotivationalPhrase] = useState(getMotivationalPhrase());
  
  const { user } = useAuth();
  const router = useRouter();
  
  // Cambiar frase motivacional cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setMotivationalPhrase(getMotivationalPhrase());
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    const initializeAgenda = async () => {
      try {
        setLoading(true);
        
        const chartResponse = await fetch(`/api/charts/natal?userId=${user.uid}`);
        
        if (chartResponse.ok) {
          setHasNatalChart(true);
          
          const birthDataResponse = await fetch(`/api/birth-data?userId=${user.uid}`);
          
          if (birthDataResponse.ok) {
            const birthData = await birthDataResponse.json();
            if (birthData.data && birthData.data.birthDate) {
              setBirthDate(birthData.data.birthDate);
            }
          }

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
      console.log('Cargando metadata de eventos...');
      
      const response = await fetch('/api/astrology/complete-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user?.uid
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.data && data.data.events) {
        const events = data.data.events;
        
        const metadata: EventMetadata = {
          totalEvents: events.length,
          lunarPhases: events.filter((e: any) => 
            e.type === 'lunar_phase' || 
            e.type && e.type.includes('luna')
          ).length,
          planetaryTransits: events.filter((e: any) => 
            e.type === 'transito' || 
            e.type === 'planetary_transit' ||
            e.type && e.type.includes('transito')
          ).length,
          eclipses: events.filter((e: any) => 
            e.type === 'eclipse'
          ).length,
          retrogrades: events.filter((e: any) => 
            e.type === 'retrogrado' || 
            e.type === 'retrograde' ||
            e.type && e.type.includes('retrogrado')
          ).length,
          highPriorityEvents: events.filter((e: any) => e.priority === 'high').length,
          period: {
            startDate: new Date().toLocaleDateString('es-ES'),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')
          },
          userLocation: {
            place: 'Madrid, España'
          }
        };
        
        setEventsMetadata(metadata);
      } else {
        console.warn('No se pudo cargar metadata:', data.error);
      }
    } catch (error) {
      console.error('Error cargando metadata:', error);
    }
  };

  const regenerateEvents = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/astrology/complete-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user?.uid,
          regenerate: true
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Eventos regenerados exitosamente');
        await loadEventsMetadata();
        window.location.reload();
      } else {
        setError('Error al regenerar eventos');
      }
    } catch (error) {
      console.error('Error regenerando eventos:', error);
      setError('Error de conexión al regenerar eventos');
    } finally {
      setRefreshing(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black relative overflow-hidden">
        {/* Efectos de fondo */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center text-white max-w-2xl mx-auto px-4">
            {/* Logo/Icono épico */}
            <div className="relative mb-12">
              <div className="w-32 h-32 mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full animate-spin opacity-75"></div>
                <div className="absolute inset-2 bg-gradient-to-br from-indigo-950 to-purple-900 rounded-full flex items-center justify-center">
                  <Star className="w-16 h-16 text-yellow-400 animate-pulse" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              CONSULTANDO LAS ESTRELLAS
            </h1>
            
            <div className="text-2xl md:text-3xl font-bold text-purple-200 mb-4">
              {motivationalPhrase}
            </div>
            
            <p className="text-xl text-purple-300 mb-8">
              Preparando tu calendario cósmico personalizado
            </p>
            
            <div className="flex justify-center space-x-4 text-sm text-purple-400">
              <span className="flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Cargando eventos reales
              </span>
              <span className="flex items-center">
                <Wand2 className="w-4 h-4 mr-2" />
                Generando interpretaciones IA
              </span>
              <span className="flex items-center">
                <Crown className="w-4 h-4 mr-2" />
                Activando tu poder personal
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black py-8 relative overflow-hidden">
        {/* Efectos de fondo para error */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="p-12 bg-gradient-to-br from-red-900/40 via-pink-900/20 to-orange-900/40 backdrop-blur-xl border border-red-400/30 rounded-3xl max-w-2xl mx-auto mt-8 shadow-2xl">
            <div className="text-center">
              <div className="text-8xl mb-8 animate-bounce">⚡</div>
              <h2 className="text-4xl font-black text-red-300 mb-6 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                CONEXIÓN CÓSMICA INTERRUMPIDA
              </h2>
              <p className="text-xl text-red-200 mb-8 leading-relaxed">{error}</p>
              
              <div className="text-lg font-bold text-orange-300 mb-8">
                NO TE PREOCUPES - TU DESTINO SIGUE INTACTO
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 transform hover:scale-105 transition-all text-lg px-8 py-4 font-bold"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  RECONECTAR CON EL COSMOS
                </Button>
                <Button 
                  onClick={() => router.push('/dashboard')} 
                  variant="secondary"
                  className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white transform hover:scale-105 transition-all text-lg px-8 py-4 font-bold"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  VOLVER AL CENTRO DE CONTROL
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black py-8 relative overflow-hidden">
        {/* Efectos de fondo */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-500 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="p-12 bg-gradient-to-br from-amber-900/40 via-yellow-900/20 to-orange-900/40 backdrop-blur-xl border border-amber-400/30 rounded-3xl max-w-3xl mx-auto mt-8 shadow-2xl">
            <div className="text-center">
              <div className="text-8xl mb-8 animate-bounce">🌟</div>
              <h2 className="text-4xl md:text-5xl font-black text-amber-300 mb-6 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                TU VIAJE CÓSMICO ESTÁ A PUNTO DE COMENZAR
              </h2>
              <div className="text-2xl font-bold text-amber-200 mb-6">
                PREPÁRATE PARA DESBLOQUEAR TU PODER ASTRAL
              </div>
              <p className="text-xl text-amber-200 mb-8 leading-relaxed">
                Para acceder a tu agenda astrológica épica con eventos reales interpretados por IA, 
                necesitas activar tu mapa cósmico personal primero.
              </p>
              
              <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-400/20 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-bold text-yellow-300 mb-4">LO QUE CONSEGUIRÁS:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center text-amber-200">
                    <Crown className="w-5 h-5 mr-3 text-yellow-400" />
                    Calendario cósmico personalizado
                  </div>
                  <div className="flex items-center text-amber-200">
                    <Rocket className="w-5 h-5 mr-3 text-yellow-400" />
                    Interpretaciones IA específicas
                  </div>
                  <div className="flex items-center text-amber-200">
                    <Zap className="w-5 h-5 mr-3 text-yellow-400" />
                    Eventos de alta precisión
                  </div>
                  <div className="flex items-center text-amber-200">
                    <Target className="w-5 h-5 mr-3 text-yellow-400" />
                    Consejos accionables diarios
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                <Button 
                  onClick={() => router.push('/birth-data')} 
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 transform hover:scale-105 transition-all text-lg px-8 py-4 font-bold"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  CONFIGURAR DATOS CÓSMICOS
                </Button>
                <Button 
                  onClick={() => router.push('/natal-chart')} 
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all text-lg px-8 py-4 font-bold"
                >
                  <Star className="w-5 h-5 mr-2" />
                  GENERAR MAPA ASTRAL
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black py-8 relative overflow-hidden">
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4">
        
        {/* Header Épico */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-2 bg-gradient-to-br from-indigo-950 to-purple-900 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            TU AGENDA CÓSMICA
          </h1>
          
          <div className="text-2xl md:text-3xl font-bold text-purple-300 mb-4 animate-pulse">
            {motivationalPhrase}
          </div>
          
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto leading-relaxed">
            Calendario interactivo con eventos reales de Prokerala e interpretaciones épicas de IA
          </p>
        </div>

        {/* Controles de Vista Disruptivos */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-gray-900/60 via-purple-900/30 to-gray-900/60 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-6 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">ELIGE TU MODO DE PODER</h2>
              <p className="text-purple-300">Selecciona cómo quieres experimentar tu destino</p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center px-8 py-4 rounded-2xl transition-all transform hover:scale-105 font-bold text-lg ${
                  viewMode === 'calendar' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                }`}
              >
                <Grid className="w-6 h-6 mr-3" />
                VISTA CALENDARIO
              </button>
              
              <button
                onClick={() => setViewMode('agenda')}
                className={`flex items-center px-8 py-4 rounded-2xl transition-all transform hover:scale-105 font-bold text-lg ${
                  viewMode === 'agenda' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                }`}
              >
                <List className="w-6 h-6 mr-3" />
                VISTA LISTA
              </button>
              
              <button
                onClick={() => setViewMode('both')}
                className={`flex items-center px-8 py-4 rounded-2xl transition-all transform hover:scale-105 font-bold text-lg ${
                  viewMode === 'both' 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                }`}
              >
                <ToggleRight className="w-6 h-6 mr-3" />
                PODER TOTAL
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas Épicas */}
        {eventsMetadata && (
          <div className="max-w-7xl mx-auto mb-12">
            <div className="bg-gradient-to-r from-purple-900/40 via-pink-900/20 to-blue-900/40 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-3xl font-black text-center text-purple-200 mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                TU RESUMEN DE PODER CÓSMICO
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <div className="text-center bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-6 border border-white/20 transform hover:scale-105 transition-all">
                  <div className="text-4xl font-black text-white mb-2">
                    {eventsMetadata.totalEvents}
                  </div>
                  <div className="text-gray-300 text-sm flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5 mr-2" />
                    EVENTOS TOTALES
                  </div>
                </div>
                
                <div className="text-center bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-3xl p-6 border border-blue-400/30 transform hover:scale-105 transition-all">
                  <div className="text-4xl font-black text-blue-300 mb-2">
                    {eventsMetadata.lunarPhases}
                  </div>
                  <div className="text-blue-200 text-sm flex items-center justify-center font-bold">
                    <Moon className="w-5 h-5 mr-2" />
                    FASES LUNARES
                  </div>
                </div>
                
                <div className="text-center bg-gradient-to-br from-green-500/20 to-emerald-600/10 rounded-3xl p-6 border border-green-400/30 transform hover:scale-105 transition-all">
                  <div className="text-4xl font-black text-green-300 mb-2">
                    {eventsMetadata.planetaryTransits}
                  </div>
                  <div className="text-green-200 text-sm flex items-center justify-center font-bold">
                    <Rocket className="w-5 h-5 mr-2" />
                    TRÁNSITOS
                  </div>
                </div>
                
                <div className="text-center bg-gradient-to-br from-yellow-500/20 to-orange-600/10 rounded-3xl p-6 border border-yellow-400/30 transform hover:scale-105 transition-all">
                  <div className="text-4xl font-black text-yellow-300 mb-2">
                    {eventsMetadata.eclipses}
                  </div>
                  <div className="text-yellow-200 text-sm flex items-center justify-center font-bold">
                    <Crown className="w-5 h-5 mr-2" />
                    ECLIPSES
                  </div>
                </div>
                
                <div className="text-center bg-gradient-to-br from-purple-500/20 to-pink-600/10 rounded-3xl p-6 border border-purple-400/30 transform hover:scale-105 transition-all">
                  <div className="text-4xl font-black text-purple-300 mb-2">
                    {eventsMetadata.retrogrades}
                  </div>
                  <div className="text-purple-200 text-sm flex items-center justify-center font-bold">
                    <Compass className="w-5 h-5 mr-2" />
                    RETRÓGRADOS
                  </div>
                </div>
                
                <div className="text-center bg-gradient-to-br from-red-500/20 to-pink-600/10 rounded-3xl p-6 border border-red-400/30 transform hover:scale-105 transition-all">
                  <div className="text-4xl font-black text-red-300 mb-2">
                    {eventsMetadata.highPriorityEvents}
                  </div>
                  <div className="text-red-200 text-sm flex items-center justify-center font-bold">
                    <Zap className="w-5 h-5 mr-2" />
                    ALTA PRIORIDAD
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-400/30 rounded-2xl p-6">
                  <p className="text-2xl font-bold text-indigo-200 mb-2">
                    PERÍODO ACTIVO: {eventsMetadata.period.startDate} → {eventsMetadata.period.endDate}
                  </p>
                  <p className="text-purple-300 text-lg">
                    TU REVOLUCIÓN PERSONAL ESTÁ EN MARCHA
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Componentes principales */}
        <div className="max-w-8xl mx-auto space-y-12">
          
          {/* CALENDARIO VISUAL */}
          {(viewMode === 'calendar' || viewMode === 'both') && user?.uid && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-black text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  CALENDARIO VISUAL DE PODER
                </h2>
                <p className="text-purple-300 text-lg">
                  Tu mapa cósmico interactivo con eventos reales
                </p>
              </div>
              <AstrologicalCalendar />
            </div>
          )}
          
          {/* SEPARADOR VISUAL */}
          {viewMode === 'both' && (
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
              <div className="mx-6 text-purple-400">
                <Gem className="w-8 h-8" />
              </div>
              <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            </div>
          )}
          
          {/* AGENDA/LISTA */}
          {(viewMode === 'agenda' || viewMode === 'both') && user?.uid && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-black text-white mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  LISTA DETALLADA DE EVENTOS
                </h2>
                <p className="text-blue-300 text-lg">
                  Análisis completo con interpretaciones IA personalizadas
                </p>
              </div>
              <AstrologicalAgenda 
                userId={user.uid}
                birthDate={birthDate || undefined}
                showRealEventsInfo={true}
              />
            </div>
          )}
        </div>
        
        {/* Botones de navegación épicos */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="bg-gradient-to-r from-gray-900/60 via-purple-900/30 to-gray-900/60 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">CENTRO DE CONTROL CÓSMICO</h3>
              <p className="text-purple-300">Navega por tu universo personal</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                onClick={() => router.push('/dashboard')} 
                variant="secondary"
                className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white transform hover:scale-105 transition-all text-lg px-8 py-4 font-bold"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                VOLVER AL CENTRO
              </Button>
              
              <Button
                onClick={() => router.push('/natal-chart')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all text-lg px-8 py-4 font-bold"
              >
                <Eye className="w-5 h-5 mr-2" />
                VER CARTA NATAL
              </Button>
              
              <Button
                onClick={() => router.push('/progressed-chart')}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transform hover:scale-105 transition-all text-lg px-8 py-4 font-bold"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                VER CARTA PROGRESADA
              </Button>
              
              <Button
                onClick={regenerateEvents}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all text-lg px-8 py-4 font-bold"
                disabled={refreshing}
              >
                {refreshing ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    REGENERANDO PODER...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2" />
                    ACTUALIZAR EVENTOS
                  </>
                )}
              </Button>
            </div>
            
            <div className="mt-8 text-center">
              <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-400/20 rounded-2xl p-4">
                <p className="text-purple-300 font-bold text-lg">
                  HAZ CLIC EN CUALQUIER EVENTO PARA DESBLOQUEAR SU PODER SECRETO
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer motivacional */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-400/20 rounded-3xl p-8">
            <h3 className="text-3xl font-black text-white mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              TU MOMENTO DE BRILLAR HA LLEGADO
            </h3>
            <p className="text-xl text-purple-300 font-semibold">
              Las estrellas han conspirado para tu grandeza - úsalas sabiamente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}