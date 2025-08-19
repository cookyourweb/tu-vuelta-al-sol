// src/components/astrology/AstrologicalCalendar.tsx
// 📅 CALENDARIO ASTROLÓGICO CON SISTEMA DE CACHÉ INTELIGENTE

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

import { 
  ChevronLeft, 
  ChevronRight, 
  Moon, 
  Sun, 
  Star, 
  Zap, 
  RefreshCw,
  Eye,
  Clock,
  TrendingUp,
  Heart,
  Brain,
  ShieldCheck,
  Database,
  CheckCircle
} from 'lucide-react';
import { AgendaLoadingStates, LOADING_STEPS, useAgendaLoading } from './AgendaLoadingStates';

interface AstrologicalEvent {
  id: string;
  date: string;
  title: string;
  type: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  planet?: string;
  sign?: string;
  aiInterpretation?: {
    meaning: string;
    lifeAreas: string[];
    advice: string;
    mantra: string;
    ritual: string;
    actionPlan: Array<{
      category: string;
      action: string;
      timing: string;
      difficulty: string;
      impact: string;
    }>;
    warningsAndOpportunities: {
      warnings: string[];
      opportunities: string[];
    };
  };
}

interface CacheInfo {
  hasCache: boolean;
  lastGenerated: string | null;
  eventsCount: number;
  aiEventsCount: number;
}

interface EventDetailModalProps {
  event: AstrologicalEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

// 🔮 Modal de detalles del evento (igual que antes)
function EventDetailModal({ event, isOpen, onClose }: EventDetailModalProps) {
  if (!isOpen || !event) return null;

  const priorityColors = {
    high: 'border-red-400 bg-red-500/10',
    medium: 'border-yellow-400 bg-yellow-500/10', 
    low: 'border-blue-400 bg-blue-500/10'
  };

  const categoryIcons: Record<string, JSX.Element> = {
    trabajo: <TrendingUp className="w-4 h-4" />,
    amor: <Heart className="w-4 h-4" />,
    salud: <ShieldCheck className="w-4 h-4" />,
    crecimiento: <Brain className="w-4 h-4" />,
    default: <Star className="w-4 h-4" />
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-600 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className={`p-6 border-b border-gray-700 ${priorityColors[event.priority]}`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <span>📅 {new Date(event.date).toLocaleDateString('es-ES')}</span>
                <span className="capitalize">🌟 {event.priority} prioridad</span>
                {event.planet && <span>🪐 {event.planet}</span>}
                {event.sign && <span>♈ {event.sign}</span>}
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          
          {/* Descripción base */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">📜 Descripción</h3>
            <p className="text-gray-300">{event.description}</p>
          </div>

          {/* Interpretación IA */}
          {event.aiInterpretation ? (
            <>
              {/* Significado */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">🔮 Significado Personal</h3>
                <p className="text-gray-300 leading-relaxed">{event.aiInterpretation.meaning}</p>
              </div>

              {/* Áreas de vida */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">🎯 Áreas de Vida Afectadas</h3>
                <div className="flex flex-wrap gap-2">
                  {event.aiInterpretation.lifeAreas.map((area, index) => (
                    <span 
                      key={index}
                      className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Consejo */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">💡 Consejo Práctico</h3>
                <p className="text-gray-300 leading-relaxed">{event.aiInterpretation.advice}</p>
              </div>

              {/* Mantra */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">🧘 Mantra</h3>
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/30 rounded-2xl p-4">
                  <p className="text-purple-300 font-medium italic text-center">
                    "{event.aiInterpretation.mantra}"
                  </p>
                </div>
              </div>

              {/* Ritual */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">🕯️ Ritual Sugerido</h3>
                <p className="text-gray-300 leading-relaxed">{event.aiInterpretation.ritual}</p>
              </div>

              {/* Plan de acción */}
              {event.aiInterpretation.actionPlan && event.aiInterpretation.actionPlan.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">📋 Plan de Acción</h3>
                  <div className="space-y-3">
                    {event.aiInterpretation.actionPlan.map((action, index) => (
                      <div 
                        key={index}
                        className="bg-gray-800/50 border border-gray-600 rounded-xl p-4"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="text-blue-400 mt-1">
                            {categoryIcons[action.category] || categoryIcons.default}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-blue-300 font-medium capitalize">{action.category}</span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-400 capitalize">{action.timing}</span>
                            </div>
                            <p className="text-gray-300 text-sm">{action.action}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs">
                              <span className="text-yellow-400">🎯 {action.difficulty}</span>
                              <span className="text-green-400">📈 Impacto {action.impact}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advertencias y Oportunidades */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">⚠️ Cuidado con</h3>
                  <div className="space-y-2">
                    {event.aiInterpretation.warningsAndOpportunities.warnings.map((warning, index) => (
                      <div key={index} className="bg-red-500/10 border border-red-400/30 rounded-lg p-3">
                        <p className="text-red-300 text-sm">{warning}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">🌟 Oportunidades</h3>
                  <div className="space-y-2">
                    {event.aiInterpretation.warningsAndOpportunities.opportunities.map((opportunity, index) => (
                      <div key={index} className="bg-green-500/10 border border-green-400/30 rounded-lg p-3">
                        <p className="text-green-300 text-sm">{opportunity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-500">Interpretación IA no disponible para este evento</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 📅 Componente principal del calendario
export default function AstrologicalCalendar() {
  const { user } = useAuth();
  const { isLoading, currentStep, progress, startLoading, updateStep, finishLoading } = useAgendaLoading();
  
  const [events, setEvents] = useState<AstrologicalEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<AstrologicalEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheInfo, setCacheInfo] = useState<CacheInfo>({
    hasCache: false,
    lastGenerated: null,
    eventsCount: 0,
    aiEventsCount: 0
  });

  // 🧠 FUNCIÓN PARA VERIFICAR CACHÉ
  const checkCache = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      console.log('🔍 Verificando caché de eventos...');
      
      // Intentar cargar eventos guardados desde el endpoint que ya maneja caché
      const response = await fetch('/api/astrology/complete-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.uid,
          checkCache: true // Parámetro para solo verificar caché
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.events && data.events.length > 0) {
          console.log(`💾 Caché encontrado: ${data.events.length} eventos`);
          setEvents(data.events);
          
          const aiEventsCount = data.events.filter((e: AstrologicalEvent) => e.aiInterpretation).length;
          setCacheInfo({
            hasCache: true,
            lastGenerated: data.metadata?.generatedAt || new Date().toISOString(),
            eventsCount: data.events.length,
            aiEventsCount
          });
          
          return true; // ✅ Caché encontrado
        }
      }
      
      console.log('💭 No se encontró caché válido');
      return false; // ❌ No hay caché
      
    } catch (error) {
      console.error('❌ Error verificando caché:', error);
      return false;
    }
  };

  // 📡 FUNCIÓN PARA CARGAR EVENTOS (solo si no hay caché)
  const loadEvents = async (forceRegenerate: boolean = false) => {
    if (!user) return;

    try {
      // 🔍 PASO 1: Verificar caché (solo si no es regeneración forzada)
      if (!forceRegenerate) {
        updateStep('🔍 Verificando eventos guardados...', 10);
        const hasCachedEvents = await checkCache();
        
        if (hasCachedEvents) {
          updateStep('✅ Eventos cargados desde caché', 100);
          finishLoading();
          return; // ✅ Salir aquí - ya tenemos los eventos
        }
      }

      // 🚀 PASO 2: Generar eventos nuevos (solo si no hay caché)
      startLoading();
      setError(null);
      
      updateStep(LOADING_STEPS.FETCHING_EVENTS, 25);
      
      console.log('🌟 Generando eventos astrológicos nuevos...');
      const response = await fetch('/api/astrology/complete-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.uid,
          regenerate: forceRegenerate 
        })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      updateStep(LOADING_STEPS.GENERATING_INTERPRETATIONS, 75);
      
      const data = await response.json();
      
      if (data.success && data.events) {
        setEvents(data.events);
        
        const aiEventsCount = data.events.filter((e: AstrologicalEvent) => e.aiInterpretation).length;
        setCacheInfo({
          hasCache: true,
          lastGenerated: new Date().toISOString(),
          eventsCount: data.events.length,
          aiEventsCount
        });
        
        updateStep(LOADING_STEPS.FINALIZING, 100);
        console.log(`✅ ${data.events.length} eventos generados (${aiEventsCount} con IA)`);
      } else {
        throw new Error(data.message || 'Error cargando eventos');
      }

    } catch (error) {
      console.error('Error cargando eventos:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      finishLoading();
    }
  };

  // 🔄 FUNCIÓN PARA REGENERAR FORZADAMENTE
  const forceRegenerate = async () => {
    console.log('🔄 Forzando regeneración de eventos...');
    setCacheInfo({
      hasCache: false,
      lastGenerated: null,
      eventsCount: 0,
      aiEventsCount: 0
    });
    await loadEvents(true);
  };

  // 🚀 CARGAR AL INICIAR
  useEffect(() => {
    if (user) {
      startLoading();
      loadEvents();
    }
  }, [user]);

  // Obtener eventos del mes actual
  const getMonthEvents = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  };

  // Generar días del calendario
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const monthEvents = getMonthEvents();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayEvents = monthEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === date.toDateString();
      });

      days.push({
        date: new Date(date),
        isCurrentMonth: date.getMonth() === month,
        events: dayEvents
      });
    }

    return days;
  };

  const days = generateCalendarDays();

  // Funciones de navegación
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + (direction === 'next' ? 1 : -1), 1));
  };

  const openEventModal = (event: AstrologicalEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeEventModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Iconos por tipo de evento
  const getEventIcon = (type: string, priority: string) => {
    const icons: Record<string, JSX.Element> = {
      lunar_phase: <Moon className="w-3 h-3" />,
      eclipse: <Sun className="w-3 h-3" />,
      retrograde: <RefreshCw className="w-3 h-3" />,
      planetary_transit: <Star className="w-3 h-3" />,
      default: <Zap className="w-3 h-3" />
    };

    const colors = {
      high: 'text-red-400',
      medium: 'text-yellow-400',
      low: 'text-blue-400'
    };

    return (
      <span className={colors[priority as keyof typeof colors]}>
        {icons[type] || icons.default}
      </span>
    );
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-500/10 border border-red-400/30 rounded-2xl p-8 max-w-md mx-auto">
          <p className="text-red-400 mb-4">❌ {error}</p>
          <div className="space-y-2">
            <button 
              onClick={() => loadEvents()}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors mr-2"
            >
              🔄 Reintentar
            </button>
            <button 
              onClick={forceRegenerate}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              🔥 Regenerar Todo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AgendaLoadingStates isGenerating={isLoading} currentStep={currentStep} progress={progress} />
      
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-600 overflow-hidden">
        
        {/* Header del calendario */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              🔮 Tu Agenda Astrológica
            </h2>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigateMonth('prev')}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <h3 className="text-xl font-semibold text-white min-w-[200px] text-center">
                {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </h3>
              
              <button 
                onClick={() => navigateMonth('next')}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Info del caché */}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-blue-100">
              <p>📅 {events.length} eventos en tu año astrológico • {getMonthEvents().length} este mes</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {cacheInfo.hasCache && (
                <div className="flex items-center text-green-200 text-sm">
                  <Database className="w-4 h-4 mr-1" />
                  <span>{cacheInfo.aiEventsCount} con IA</span>
                </div>
              )}
              
              <button
                onClick={forceRegenerate}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center"
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Regenerar
              </button>
            </div>
          </div>
        </div>

        {/* Info de caché */}
        {cacheInfo.hasCache && cacheInfo.lastGenerated && (
          <div className="bg-green-800/20 border-b border-green-600/30 px-6 py-2">
            <div className="flex items-center justify-center text-green-200 text-sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>
                Última actualización: {new Date(cacheInfo.lastGenerated).toLocaleString('es-ES')} 
                • {cacheInfo.eventsCount} eventos guardados
              </span>
            </div>
          </div>
        )}

        {/* Días de la semana */}
        <div className="grid grid-cols-7 bg-gray-800 border-b border-gray-600">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="p-4 text-center text-gray-400 font-medium border-r border-gray-700 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Días del calendario */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => (
            <div 
              key={index}
              className={`min-h-[120px] p-2 border-r border-b border-gray-700 last:border-r-0 ${
                day.isCurrentMonth ? 'bg-gray-800' : 'bg-gray-900'
              }`}
            >
              <div className={`text-sm font-medium mb-2 ${
                day.isCurrentMonth ? 'text-white' : 'text-gray-500'
              }`}>
                {day.date.getDate()}
              </div>
              
              <div className="space-y-1">
                {day.events.slice(0, 3).map(event => (
                  <div 
                    key={event.id}
                    onClick={() => openEventModal(event)}
                    className={`text-xs p-1 rounded cursor-pointer hover:scale-105 transition-transform ${
                      event.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                      event.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-blue-500/20 text-blue-300'
                    } ${event.aiInterpretation ? 'border border-purple-400/30' : ''}`}
                  >
                    <div className="flex items-center space-x-1">
                      {getEventIcon(event.type, event.priority)}
                      <span className="truncate">{event.title}</span>
                      {event.aiInterpretation && (
                        <span className="text-purple-400 text-xs">✨</span>
                      )}
                    </div>
                  </div>
                ))}
                
                {day.events.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{day.events.length - 3} más
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Stats del mes */}
        <div className="bg-gray-800 p-4 border-t border-gray-600">
          <div className="flex justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-gray-300">Alta prioridad</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-gray-300">Media prioridad</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-300">Baja prioridad</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-purple-400">✨</span>
              <span className="text-gray-300">Con IA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalles */}
      <EventDetailModal 
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={closeEventModal}
      />
    </>
  );
}