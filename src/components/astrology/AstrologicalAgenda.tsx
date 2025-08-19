// src/components/astrology/AstrologicalAgenda.tsx - VERSIÓN MEJORADA
'use client';

import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, isSameMonth, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';

interface AstronomicalEvent {
  id: string;
  date: string;
  time?: string;
  title: string;
  description: string;
  type: 'ai_generated' | 'lunar_phase' | 'planetary_transit' | 'retrograde' | 'direct' | 'aspect' | 'eclipse' | 'seasonal';
  importance: 'high' | 'medium' | 'low';
  planet?: string;
  sign?: string;
  personalInterpretation?: {
    impact: string;
    advice: string;
    mantra: string;
    ritual?: string;
    avoid?: string;
    opportunity?: string;
  };
}

interface AstronomicalDay {
  date: Date;
  events: AstronomicalEvent[];
  isCurrentMonth: boolean;
  hasEvents: boolean;
}

interface AstronomicalAgendaProps {
  userId: string;
  initialMonth?: Date;
  birthDate?: string;
  aiEvents?: AstronomicalEvent[];
  showRealEventsInfo?: boolean;
}

export default function AstrologicalAgenda({
  userId,
  initialMonth = new Date(),
  birthDate,
  aiEvents = [],
  showRealEventsInfo = false
}: AstronomicalAgendaProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(initialMonth);
  const [events, setEvents] = useState<AstronomicalEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState<AstronomicalEvent[]>([]);
  const [eventsMetadata, setEventsMetadata] = useState<any>(null);

  // Cargar eventos reales desde la API
  useEffect(() => {
    const loadRealEvents = async () => {
      if (!userId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('📡 Cargando eventos astrológicos reales...');
        
        const response = await fetch('/api/astrology/complete-events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: userId,
            months: 6 // 6 meses de eventos
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          const realEvents = data.data.events || [];
          console.log(`✅ ${realEvents.length} eventos reales cargados`);
          
          // Combinar eventos reales con eventos IA si los hay
          const combinedEvents = [...realEvents, ...aiEvents];
          setEvents(combinedEvents);
          setEventsMetadata(data.data);
          
          console.log('📊 Metadatos de eventos:', data.data.highlights);
        } else {
          console.warn('⚠️ Error cargando eventos reales:', data.error);
          setError(`Error cargando eventos: ${data.error}`);
          
          // Fallback a eventos de ejemplo
          setEvents(generateSampleEvents());
        }
      } catch (error) {
        console.error('❌ Error cargando eventos reales:', error);
        setError('Error de conexión al cargar eventos astrológicos');
        
        // Fallback a eventos de ejemplo
        setEvents(generateSampleEvents());
      } finally {
        setLoading(false);
      }
    };
    
    loadRealEvents();
  }, [userId, aiEvents]);

  // Eventos de ejemplo como fallback
  const generateSampleEvents = (): AstronomicalEvent[] => {
    return [
      {
        id: 'sample-1',
        date: format(new Date(), 'yyyy-MM-dd'),
        title: 'Luna Llena Energética',
        description: 'Energía lunar amplificada para manifestación y liberación.',
        type: 'lunar_phase',
        importance: 'high',
        personalInterpretation: {
          impact: 'Momento perfecto para conectar con tu intuición y liberar lo que ya no te sirve.',
          advice: 'Medita bajo la luz lunar y establece intenciones claras para el nuevo ciclo.',
          mantra: 'Libero con amor todo lo que ya no necesito en mi vida.'
        }
      },
      {
        id: 'sample-2',
        date: format(addMonths(new Date(), 0), 'yyyy-MM-' + String(Math.floor(Math.random() * 25) + 1).padStart(2, '0')),
        title: 'Tránsito Planetario Importante',
        description: 'Energías planetarias favorables para nuevos proyectos.',
        type: 'planetary_transit',
        importance: 'medium',
        planet: 'Júpiter',
        sign: 'Tauro',
        personalInterpretation: {
          impact: 'Las energías de abundancia y crecimiento están especialmente activas.',
          advice: 'Es un momento excelente para iniciar proyectos relacionados con estabilidad y recursos.',
          mantra: 'Atraigo abundancia y prosperidad a mi vida de manera natural.'
        }
      }
    ];
  };

  const getDaysWithEvents = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay() + 1);
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (7 - monthEnd.getDay()));

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map(day => {
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return isSameDay(day, eventDate);
      });

      return {
        date: day,
        events: dayEvents,
        isCurrentMonth: isSameMonth(day, currentMonth),
        hasEvents: dayEvents.length > 0
      };
    });
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
    setSelectedDate(null);
    setSelectedDayEvents([]);
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
    setSelectedDate(null);
    setSelectedDayEvents([]);
  };

  const getCurrentMonthName = () => {
    return format(currentMonth, 'MMMM yyyy', { locale: es });
  };

  const handleDayClick = (day: AstronomicalDay) => {
    setSelectedDate(day.date);
    setSelectedDayEvents(day.events);
  };

  const getEventIndicatorStyle = (eventType: string, importance: string) => {
    const baseStyle = "h-2 w-2 rounded-full mr-2 flex-shrink-0";
    
    if (importance === 'high') {
      return `${baseStyle} bg-gradient-to-r from-red-500 to-orange-500 shadow-sm animate-pulse`;
    }
    
    switch (eventType) {
      case 'lunar_phase':
        return `${baseStyle} bg-gradient-to-r from-indigo-500 to-purple-500 shadow-sm`;
      case 'planetary_transit':
        return `${baseStyle} bg-gradient-to-r from-blue-500 to-cyan-500 shadow-sm`;
      case 'retrograde':
        return `${baseStyle} bg-gradient-to-r from-orange-500 to-red-500 shadow-sm`;
      case 'direct':
        return `${baseStyle} bg-gradient-to-r from-green-500 to-emerald-500 shadow-sm`;
      case 'eclipse':
        return `${baseStyle} bg-gradient-to-r from-purple-600 to-pink-600 shadow-sm`;
      case 'seasonal':
        return `${baseStyle} bg-gradient-to-r from-yellow-500 to-orange-500 shadow-sm`;
      default:
        return `${baseStyle} bg-gray-400`;
    }
  };

  const getEventTypeName = (eventType: string): string => {
    const typeNames: { [key: string]: string } = {
      'lunar_phase': '🌙 Lunar',
      'planetary_transit': '🪐 Tránsito',
      'retrograde': '🔄 Retrógrado',
      'direct': '➡️ Directo',
      'eclipse': '🌒 Eclipse',
      'seasonal': '🍂 Estacional',
      'ai_generated': '✨ IA',
      'aspect': '🔗 Aspecto'
    };
    
    return typeNames[eventType] || '⭐ Evento';
  };

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const days = getDaysWithEvents();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header con estadísticas de eventos */}
      <div className="mb-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-3xl font-bold text-gray-800 capitalize mb-2">
              {getCurrentMonthName()}
            </h2>
            
            {eventsMetadata && (
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center text-blue-600">
                  <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                  {eventsMetadata.highlights?.totalEvents || 0} eventos totales
                </span>
                <span className="flex items-center text-red-600">
                  <span className="h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                  {eventsMetadata.highlights?.highPriorityEvents || 0} alta prioridad
                </span>
                <span className="flex items-center text-purple-600">
                  <span className="h-2 w-2 rounded-full bg-purple-500 mr-2"></span>
                  {eventsMetadata.highlights?.lunarPhases || 0} fases lunares
                </span>
                <span className="flex items-center text-orange-600">
                  <span className="h-2 w-2 rounded-full bg-orange-500 mr-2"></span>
                  {eventsMetadata.highlights?.retrogrades || 0} retrógrados
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={goToPreviousMonth}
              className="p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-sm"
              aria-label="Mes anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-sm"
            >
              Hoy
            </button>
            
            <button
              onClick={goToNextMonth}
              className="p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-sm"
              aria-label="Mes siguiente"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Información sobre eventos reales */}
      {showRealEventsInfo && eventsMetadata && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-800 font-semibold">
                🌟 <strong>Eventos Astrológicos Reales:</strong> {eventsMetadata.highlights?.totalEvents || 0} eventos obtenidos
              </p>
              <p className="text-blue-600 text-sm mt-1">
                Estrategia: {eventsMetadata.metadata?.strategy || 'Híbrida Prokerala + Cálculos astronómicos'}
              </p>
              {eventsMetadata.highlights?.withAiInterpretation && (
                <p className="text-blue-600 text-sm">
                  🤖 {eventsMetadata.highlights.withAiInterpretation} interpretados con IA
                </p>
              )}
            </div>
            <div className="text-blue-400 text-2xl">🔮</div>
          </div>
        </div>
      )}

      {/* Estado de carga */}
      {loading && (
        <div className="flex justify-center items-center h-32 bg-white/95 rounded-2xl shadow-sm mb-6">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
          <span className="ml-3 text-gray-600">Consultando las estrellas...</span>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl mb-6 shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <p className="text-xs text-red-600 mt-1">Mostrando eventos de ejemplo mientras se resuelve el problema.</p>
            </div>
          </div>
        </div>
      )}

      {/* CALENDARIO PRINCIPAL */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-px bg-gray-100">
          {weekDays.map((day, index) => (
            <div key={index} className="bg-gray-50 py-4 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
              {day}
            </div>
          ))}
        </div>

        {/* Días del mes con eventos */}
        <div className="grid grid-cols-7 gap-px bg-gray-100">
          {days.map((day, index) => (
            <div
              key={index}
              className={`min-h-[120px] p-3 cursor-pointer transition-all duration-200 relative group ${
                day.isCurrentMonth
                  ? isSameDay(day.date, new Date())
                    ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300'
                    : 'bg-white hover:bg-gray-50'
                  : 'bg-gray-50 text-gray-400'
              } ${isSameDay(day.date, selectedDate || new Date(0)) ? 'ring-2 ring-purple-500 ring-inset' : ''}`}
              onClick={() => handleDayClick(day)}
            >
              {/* Número del día */}
              <div className={`font-semibold text-sm mb-2 ${
                isSameDay(day.date, new Date()) 
                  ? 'text-purple-700' 
                  : day.isCurrentMonth ? 'text-gray-800' : 'text-gray-400'
              }`}>
                {day.date.getDate()}
              </div>
              
              {/* Eventos del día */}
              {day.hasEvents && (
                <div className="space-y-1">
                  {day.events.slice(0, 3).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="flex items-center cursor-pointer group-hover:scale-105 transition-transform duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDate(day.date);
                        setSelectedDayEvents(day.events);
                      }}
                    >
                      <span className={getEventIndicatorStyle(event.type, event.importance)}></span>
                      <span className="text-xs truncate font-medium text-gray-700 flex-1">
                        {event.title}
                      </span>
                      {event.importance === 'high' && (
                        <span className="text-red-500 text-xs ml-1">!</span>
                      )}
                    </div>
                  ))}
                  {day.events.length > 3 && (
                    <div className="text-xs text-gray-500 font-medium pl-4">
                      +{day.events.length - 3} más
                    </div>
                  )}
                </div>
              )}

              {/* Indicador de hover mejorado */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-200 rounded transition-colors duration-200 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>

      {/* DETALLES DEL DÍA SELECCIONADO */}
      {selectedDate && (
        <div className="mt-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">
              {selectedDate.toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </h3>
            <p className="text-purple-100">
              {selectedDayEvents.length === 0 
                ? 'No hay eventos programados para este día' 
                : `${selectedDayEvents.length} evento${selectedDayEvents.length > 1 ? 's' : ''} astrológico${selectedDayEvents.length > 1 ? 's' : ''}`
              }
            </p>
          </div>
          
          {selectedDayEvents.length > 0 && (
            <div className="p-6 space-y-6">
              {selectedDayEvents.map((event, index) => (
                <div key={index} className={`p-5 rounded-xl border-l-4 shadow-sm transition-all hover:shadow-md ${
                  event.importance === 'high' 
                    ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-500'
                    : event.type === 'lunar_phase'
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-500'
                      : event.type === 'retrograde'
                        ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-500'
                        : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-500'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-800 mb-1">{event.title}</h4>
                      {event.time && (
                        <p className="text-sm text-gray-600 mb-2">🕐 {event.time}</p>
                      )}
                      {event.planet && event.sign && (
                        <p className="text-sm text-gray-600 mb-2">
                          🪐 {event.planet} en {event.sign}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        event.importance === 'high'
                          ? 'bg-red-100 text-red-800'
                          : event.importance === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {event.importance === 'high' ? 'Alta' : event.importance === 'medium' ? 'Media' : 'Baja'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
                        {getEventTypeName(event.type)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">{event.description}</p>
                  
                  {/* INTERPRETACIÓN PERSONALIZADA */}
                  {event.personalInterpretation && (
                    <div className="space-y-3 border-t border-gray-200 pt-4">
                      <h5 className="font-semibold text-gray-800 mb-3">🔮 Interpretación Personalizada:</h5>
                      
                      <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                        <strong className="text-blue-800 block mb-1">💫 Impacto:</strong>
                        <p className="text-blue-700 text-sm">{event.personalInterpretation.impact}</p>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                        <strong className="text-green-800 block mb-1">✅ Consejo:</strong>
                        <p className="text-green-700 text-sm">{event.personalInterpretation.advice}</p>
                      </div>
                      
                      <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                        <strong className="text-purple-800 block mb-1">🧘 Mantra del día:</strong>
                        <p className="text-purple-700 text-sm italic">"{event.personalInterpretation.mantra}"</p>
                      </div>
                      
                      {event.personalInterpretation.avoid && (
                        <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                          <strong className="text-red-800 block mb-1">⚠️ Evitar:</strong>
                          <p className="text-red-700 text-sm">{event.personalInterpretation.avoid}</p>
                        </div>
                      )}
                      
                      {event.personalInterpretation.opportunity && (
                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                          <strong className="text-yellow-800 block mb-1">🌟 Oportunidad:</strong>
                          <p className="text-yellow-700 text-sm">{event.personalInterpretation.opportunity}</p>
                        </div>
                      )}
                      
                      {event.personalInterpretation.ritual && (
                        <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg">
                          <strong className="text-indigo-800 block mb-1">✨ Ritual sugerido:</strong>
                          <p className="text-indigo-700 text-sm">{event.personalInterpretation.ritual}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* LEYENDA DE TIPOS DE EVENTOS */}
      <div className="mt-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
        <h4 className="font-bold text-gray-800 mb-4 text-lg">🎨 Tipos de Eventos Astrológicos</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center p-3 bg-indigo-50 rounded-lg">
            <span className="h-4 w-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mr-3 shadow-sm"></span>
            <span className="text-gray-700 font-medium">🌙 Fases Lunares</span>
          </div>
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <span className="h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mr-3 shadow-sm"></span>
            <span className="text-gray-700 font-medium">🪐 Tránsitos Planetarios</span>
          </div>
          <div className="flex items-center p-3 bg-orange-50 rounded-lg">
            <span className="h-4 w-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 mr-3 shadow-sm"></span>
            <span className="text-gray-700 font-medium">🔄 Movimientos Retrógrados</span>
          </div>
          <div className="flex items-center p-3 bg-green-50 rounded-lg">
            <span className="h-4 w-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mr-3 shadow-sm"></span>
            <span className="text-gray-700 font-medium">➡️ Movimientos Directos</span>
          </div>
          <div className="flex items-center p-3 bg-purple-50 rounded-lg">
            <span className="h-4 w-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 mr-3 shadow-sm"></span>
            <span className="text-gray-700 font-medium">🌒 Eclipses</span>
          </div>
          <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
            <span className="h-4 w-4 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 mr-3 shadow-sm"></span>
            <span className="text-gray-700 font-medium">🍂 Eventos Estacionales</span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>💡 Prioridades:</strong>
            <span className="text-red-600 ml-2">🔴 Alta prioridad</span>
            <span className="text-yellow-600 ml-2">🟡 Media prioridad</span>
            <span className="text-green-600 ml-2">🟢 Baja prioridad</span>
          </p>
        </div>
      </div>
    </div>
  );
}