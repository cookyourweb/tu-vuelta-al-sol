// src/components/astrology/AstrologicalCalendar.tsx - VERSIÓN CON ESTILOS DISRUPTIVOS

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
  CheckCircle,
  Sparkles,
  Crown,
  Target,
  Flame,
  Gem,
  Rocket,
  // Lightning, // Reemplazado por Zap
  Compass,
  Wand2
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

// ICONOS DESCRIPTIVOS POR TIPO DE EVENTO
const getEventIconAndStyle = (type: string, priority: string) => {
  const eventStyles = {
    lunar_phase: {
      icon: <Moon className="w-4 h-4" />,
      label: "FASE LUNAR",
      bgGradient: "from-indigo-500 to-blue-600",
      borderColor: "border-blue-400",
      textColor: "text-blue-100",
      shadowColor: "shadow-blue-500/30"
    },
    eclipse: {
      icon: <Crown className="w-4 h-4" />,
      label: "ECLIPSE SUPREMO",
      bgGradient: "from-yellow-500 to-orange-600",
      borderColor: "border-yellow-400",
      textColor: "text-yellow-100",
      shadowColor: "shadow-yellow-500/50"
    },
    retrograde: {
      icon: <Compass className="w-4 h-4" />,
      label: "RETRO POWER",
      bgGradient: "from-purple-500 to-pink-600",
      borderColor: "border-purple-400",
      textColor: "text-purple-100",
      shadowColor: "shadow-purple-500/40"
    },
    planetary_transit: {
      icon: <Rocket className="w-4 h-4" />,
      label: "TRÁNSITO CÓSMICO",
      bgGradient: "from-green-500 to-emerald-600",
      borderColor: "border-green-400",
      textColor: "text-green-100",
      shadowColor: "shadow-green-500/30"
    },
    seasonal: {
      icon: <Gem className="w-4 h-4" />,
      label: "CAMBIO ESTACIONAL",
      bgGradient: "from-teal-500 to-cyan-600",
      borderColor: "border-teal-400",
      textColor: "text-teal-100",
      shadowColor: "shadow-teal-500/30"
    },
    default: {
      icon: <Sparkles className="w-4 h-4" />,
      label: "EVENTO MÁGICO",
      bgGradient: "from-gray-500 to-gray-600",
      borderColor: "border-gray-400",
      textColor: "text-gray-100",
      shadowColor: "shadow-gray-500/30"
    }
  };

  const priorityEffects = {
    high: "animate-pulse ring-2 ring-red-400 ring-opacity-75",
    medium: "ring-1 ring-yellow-400 ring-opacity-50",
    low: ""
  };

  const style = eventStyles[type as keyof typeof eventStyles] || eventStyles.default;
  const effect = priorityEffects[priority as keyof typeof priorityEffects] || "";

  return { ...style, effect };
};

// FRASES DISRUPTIVAS ALEATORIAS
const getDisruptivePhrase = () => {
  const phrases = [
    "TU DESTINO SE ESCRIBE HOY",
    "LAS ESTRELLAS CONSPIRAN A TU FAVOR",
    "MOMENTO DE DESPERTAR CÓSMICO",
    "TU PODER INTERIOR SE ACTIVA",
    "REVOLUCIÓN PERSONAL EN MARCHA",
    "EL UNIVERSO TE LLAMA A BRILLAR",
    "TRANSFORMACIÓN ÉPICA INICIADA",
    "TU ERA DE MANIFESTACIÓN COMIENZA",
    "CÓDIGO CÓSMICO DESBLOQUEADO",
    "ENERGÍA SUPERIOR ACTIVADA"
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
};

// Componente Modal mejorado
function EventModal({ 
  event, 
  isOpen, 
  onClose 
}: { 
  event: AstrologicalEvent | null; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  if (!isOpen || !event) return null;

  const eventStyle = getEventIconAndStyle(event.type, event.priority);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-black border border-purple-400/30 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header Disruptivo */}
        <div className={`bg-gradient-to-r ${eventStyle.bgGradient} p-8 rounded-t-3xl relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-3">
                  {eventStyle.icon}
                  <span className="ml-2 text-xs font-bold tracking-wider opacity-80">
                    {eventStyle.label}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-white mb-3">{event.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-white/80">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(event.date).toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    {event.priority === 'high' ? 'PRIORIDAD MÁXIMA' : event.priority === 'medium' ? 'PRIORIDAD ALTA' : 'PRIORIDAD MEDIA'}
                  </span>
                </div>
                <div className="mt-4 text-lg font-bold text-white/90">
                  {getDisruptivePhrase()}
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors bg-black/20 rounded-full p-2"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-8 space-y-8">
          
          {/* Descripción */}
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-400/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Wand2 className="w-5 h-5 text-purple-400 mr-2" />
              MENSAJE DEL COSMOS
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">{event.description}</p>
          </div>

          {event.aiInterpretation && (
            <>
              {/* Mantra Power */}
              <div className="bg-gradient-to-r from-pink-900/30 to-rose-900/30 border border-pink-400/30 rounded-2xl p-6 text-center">
                <h3 className="text-xl font-bold text-pink-300 mb-4 flex items-center justify-center">
                  <Heart className="w-5 h-5 mr-2" />
                  TU MANTRA DE PODER
                </h3>
                <div className="text-2xl font-bold text-white italic">
                  "{event.aiInterpretation.mantra}"
                </div>
              </div>

              {/* Plan de Acción */}
              <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-400/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-emerald-300 mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  PLAN DE ACCIÓN CÓSMICO
                </h3>
                <div className="grid gap-4">
                  {event.aiInterpretation.actionPlan.slice(0, 3).map((action, index) => (
                    <div key={index} className="bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-emerald-300 font-semibold text-sm uppercase tracking-wide">
                          {action.category}
                        </span>
                        <span className="text-xs bg-emerald-400/20 text-emerald-300 px-2 py-1 rounded-full">
                          {action.timing}
                        </span>
                      </div>
                      <p className="text-white font-medium">{action.action}</p>
                      <div className="flex items-center mt-2 space-x-3 text-xs">
                        <span className={`px-2 py-1 rounded-full ${
                          action.difficulty === 'fácil' ? 'bg-green-400/20 text-green-300' :
                          action.difficulty === 'moderado' ? 'bg-yellow-400/20 text-yellow-300' :
                          'bg-red-400/20 text-red-300'
                        }`}>
                          {action.difficulty}
                        </span>
                        <span className={`px-2 py-1 rounded-full ${
                          action.impact === 'alto' ? 'bg-red-400/20 text-red-300' :
                          action.impact === 'medio' ? 'bg-yellow-400/20 text-yellow-300' :
                          'bg-blue-400/20 text-blue-300'
                        }`}>
                          Impacto: {action.impact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advertencias y Oportunidades */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-red-900/20 to-pink-900/20 border border-red-400/30 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-red-300 mb-4 flex items-center">
                    <ShieldCheck className="w-5 h-5 mr-2" />
                    EVITA ESTO
                  </h3>
                  <div className="space-y-3">
                    {event.aiInterpretation.warningsAndOpportunities.warnings.map((warning, index) => (
                      <div key={index} className="bg-red-500/10 border-l-4 border-red-400 p-3 rounded">
                        <p className="text-red-200 text-sm">{warning}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-400/30 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-green-300 mb-4 flex items-center">
                    <Gem className="w-5 h-5 mr-2" />
                    APROVECHA ESTO
                  </h3>
                  <div className="space-y-3">
                    {event.aiInterpretation.warningsAndOpportunities.opportunities.map((opportunity, index) => (
                      <div key={index} className="bg-green-500/10 border-l-4 border-green-400 p-3 rounded">
                        <p className="text-green-200 text-sm">{opportunity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ritual */}
              {event.aiInterpretation.ritual && (
                <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-400/30 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-indigo-300 mb-4 flex items-center">
                    <Flame className="w-5 h-5 mr-2" />
                    RITUAL DE ACTIVACIÓN
                  </h3>
                  <p className="text-indigo-100 text-lg leading-relaxed">{event.aiInterpretation.ritual}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-900 to-purple-900/30 p-6 rounded-b-3xl border-t border-purple-400/20">
          <div className="text-center">
            <p className="text-purple-300 text-lg font-semibold">
              EL PODER ESTÁ EN TUS MANOS - ÚSALO SABIAMENTE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente principal del calendario
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

  // Función para verificar caché
  const checkCache = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      console.log('Verificando caché de eventos...');
      
      const requestBody = {
        userId: user.uid,
        months: 12,
        checkCacheOnly: true
      };
      
      const response = await fetch('/api/astrology/complete-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          let events = [];
          if (data.events) {
            events = data.events;
          } else if (data.data && data.data.events) {
            events = data.data.events;
          }
          
          if (events && events.length > 0) {
            console.log(`Caché encontrado: ${events.length} eventos`);
            setEvents(events);
            
            const aiEventsCount = events.filter((e: AstrologicalEvent) => e.aiInterpretation).length;
            setCacheInfo({
              hasCache: true,
              lastGenerated: data.metadata?.generatedAt || new Date().toISOString(),
              eventsCount: events.length,
              aiEventsCount
            });
            
            return true;
          }
        }
      }
      
      console.log('No se encontró caché válido');
      return false;
      
    } catch (error) {
      console.error('Error verificando caché:', error);
      return false;
    }
  };

  // Función para cargar eventos
  const loadEvents = async (forceRegenerate: boolean = false) => {
    if (!user) return;

    try {
      if (!forceRegenerate) {
        updateStep('Verificando eventos guardados...', 10);
        const hasCachedEvents = await checkCache();
        
        if (hasCachedEvents) {
          updateStep('Eventos cargados desde caché', 100);
          finishLoading();
          return;
        }
      }

      startLoading();
      setError(null);
      
      updateStep(LOADING_STEPS.FETCHING_EVENTS, 25);
      
      console.log('Generando eventos astrológicos nuevos...');
      
      const requestBody = {
        userId: user.uid,
        months: 12,
        regenerate: forceRegenerate
      };
      
      const response = await fetch('/api/astrology/complete-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      updateStep(LOADING_STEPS.GENERATING_INTERPRETATIONS, 75);
      
      const data = await response.json();
      
      if (data.success) {
        let events = [];
        
        if (data.events) {
          events = data.events;
        } else if (data.data && data.data.events) {
          events = data.data.events;
        } else {
          throw new Error('No se encontraron eventos en la respuesta');
        }
        
        setEvents(events);
        
        const aiEventsCount = events.filter((e: AstrologicalEvent) => e.aiInterpretation).length;
        setCacheInfo({
          hasCache: true,
          lastGenerated: new Date().toISOString(),
          eventsCount: events.length,
          aiEventsCount
        });
        
        updateStep(LOADING_STEPS.FINALIZING, 100);
        console.log(`${events.length} eventos generados (${aiEventsCount} con IA)`);
      } else {
        throw new Error(data.error || data.message || 'Error cargando eventos');
      }

    } catch (error) {
      console.error('Error cargando eventos:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      finishLoading();
    }
  };

  const forceRegenerate = async () => {
    console.log('Forzando regeneración de eventos...');
    setCacheInfo({
      hasCache: false,
      lastGenerated: null,
      eventsCount: 0,
      aiEventsCount: 0
    });
    await loadEvents(true);
  };

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

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 rounded-3xl p-8 max-w-md mx-auto">
          <div className="text-6xl mb-4">🚨</div>
          <h3 className="text-2xl font-bold text-red-300 mb-4">CONEXIÓN CÓSMICA PERDIDA</h3>
          <p className="text-red-200 mb-6">{error}</p>
          <div className="space-y-2">
            <button 
              onClick={() => loadEvents()}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 mr-2"
            >
              RECONECTAR
            </button>
            <button 
              onClick={forceRegenerate}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105"
            >
              REGENERAR TODO
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AgendaLoadingStates isGenerating={isLoading} currentStep={currentStep} progress={progress} />
      
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/10 to-black rounded-3xl border border-purple-400/30 overflow-hidden shadow-2xl">
        
        {/* Header épico */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black text-white mb-2">
                  TU CALENDARIO CÓSMICO
                </h2>
                <p className="text-white/80 text-lg">{getDisruptivePhrase()}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigateMonth('prev')}
                  className="text-white hover:text-gray-200 transition-colors bg-white/10 rounded-full p-3 hover:bg-white/20"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <h3 className="text-2xl font-bold text-white min-w-[250px] text-center">
                  {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
                </h3>
                
                <button 
                  onClick={() => navigateMonth('next')}
                  className="text-white hover:text-gray-200 transition-colors bg-white/10 rounded-full p-3 hover:bg-white/20"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              
              <button 
                onClick={forceRegenerate}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-all transform hover:scale-105 flex items-center"
                disabled={isLoading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                REGENERAR
              </button>
            </div>
            
            {cacheInfo.hasCache && (
              <div className="mt-6 text-white/80 text-sm flex items-center">
                <Database className="w-4 h-4 mr-2" />
                <strong>{cacheInfo.eventsCount} EVENTOS CARGADOS</strong>
                <span className="mx-2">•</span>
                <strong>{cacheInfo.aiEventsCount} CON IA</strong>
                {cacheInfo.lastGenerated && (
                  <>
                    <span className="mx-2">•</span>
                    <span>ÚLTIMA ACTUALIZACIÓN: {new Date(cacheInfo.lastGenerated).toLocaleDateString('es-ES')}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 bg-gradient-to-r from-gray-800 to-purple-800/30 border-b border-purple-400/20">
          {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map(day => (
            <div key={day} className="p-4 text-center text-purple-300 font-bold text-sm tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendario */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => (
            <div 
              key={index}
              className={`min-h-[140px] p-3 border-r border-b border-gray-700/50 relative
                ${day.isCurrentMonth ? 'bg-gray-900/50' : 'bg-gray-900/20'}
                ${day.events.length > 0 ? 'hover:bg-purple-900/20 cursor-pointer transition-all duration-300' : ''}
              `}
            >
              <div className={`text-sm font-bold mb-3 
                ${day.isCurrentMonth ? 'text-white' : 'text-gray-500'}
                ${day.date.toDateString() === new Date().toDateString() ? 'text-yellow-400 font-black text-lg' : ''}
              `}>
                {day.date.getDate()}
              </div>
              
              {day.events.length > 0 && (
                <div className="space-y-2">
                  {day.events.slice(0, 2).map((event, eventIndex) => {
                    const eventStyle = getEventIconAndStyle(event.type, event.priority);
                    return (
                      <div 
                        key={eventIndex}
                        onClick={() => openEventModal(event)}
                        className={`bg-gradient-to-r ${eventStyle.bgGradient} ${eventStyle.borderColor} border ${eventStyle.shadowColor} shadow-lg text-white text-xs p-2 rounded-lg cursor-pointer hover:scale-105 transition-all transform ${eventStyle.effect}`}
                        title={event.title}
                      >
                        <div className="flex items-center justify-between">
                          {eventStyle.icon}
                          <span className="font-bold text-xs truncate ml-1">{event.title}</span>
                        </div>
                        <div className="text-xs opacity-80 mt-1">{eventStyle.label}</div>
                      </div>
                    );
                  })}
                  
                  {day.events.length > 2 && (
                    <div className="text-xs text-purple-300 font-bold bg-purple-500/20 rounded px-2 py-1 text-center">
                      +{day.events.length - 2} MÁS
                    </div>
                  )}
                </div>
              )}

              {day.date.toDateString() === new Date().toDateString() && (
                <div className="absolute top-1 right-1">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer con estadísticas épicas */}
        <div className="bg-gradient-to-r from-gray-900 via-purple-900/20 to-gray-900 p-6 border-t border-purple-400/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6 text-sm">
              <span className="flex items-center text-emerald-400 font-bold">
                <CheckCircle className="w-5 h-5 mr-2" />
                {events.length} EVENTOS TOTALES
              </span>
              <span className="flex items-center text-blue-400 font-bold">
                <Brain className="w-5 h-5 mr-2" />
                {cacheInfo.aiEventsCount} CON IA PERSONALIZADA
              </span>
              <span className="flex items-center text-purple-400 font-bold">
                <Zap className="w-5 h-5 mr-2" />
                {getMonthEvents().length} ESTE MES
              </span>
            </div>
            
            <div className="text-purple-300 font-bold text-lg">
              {getDisruptivePhrase()}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalles del evento */}
      <EventModal 
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={closeEventModal}
      />
    </>
  );
}