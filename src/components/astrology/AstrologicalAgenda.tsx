// src/components/astrology/AstrologicalAgenda.tsx - CON TOOLTIPS ON HOVER
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
    lifeAreas?: string[];
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
  eventsMetadata?: any;
  loading?: boolean;
  error?: string | null;
  events?: AstronomicalEvent[];
}

export default function AstrologicalAgenda({
  userId,
  initialMonth = new Date(),
  birthDate,
  aiEvents = [],
  showRealEventsInfo = false,
  eventsMetadata,
  loading = false,
  error = null,
  events = []
}: AstronomicalAgendaProps) {
  // Estados principales
  const [currentMonth, setCurrentMonth] = useState<Date>(initialMonth);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState<AstronomicalEvent[]>([]);

  // Estados para tooltips
  const [hoveredEvent, setHoveredEvent] = useState<AstronomicalEvent | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Función para obtener eventos de muestra
  const getSampleEvents = (): AstronomicalEvent[] => {
    return [
      {
        id: 'sample-1',
        date: '2025-09-04',
        title: 'Portal de Propósito Personal',
        description: 'Las energías cósmicas se alinean para revelar tu propósito más profundo.',
        type: 'ai_generated',
        importance: 'high',
        personalInterpretation: {
          impact: '¡REVOLUCIÓN ENERGÉTICA VERO2708! Tu Sol natal en Acuario 21.4° Casa 1 está siendo DIRECTAMENTE ACTIVADO por este evento cósmico. Las frecuencias del universo están sintonizándose específicamente con tu configuración natal única.',
          advice: 'ACTIVA tu poder de brillar - es tu momento de liderar sin límites. USA tu naturaleza innovadora y humanitaria como arma secreta - nadie más tiene tu combinación única. COMUNICA tu verdad - tus ideas pueden cambiar el mundo.',
          mantra: 'SOY REVOLUCIÓN PURA. MI BRILLAR ES MI SUPERPODER. ABRAZO MI NATURALEZA INNOVADORA Y HUMANITARIA Y TRANSFORMO TODO EN ORO.',
          ritual: 'RITUAL SOLAR PERSONALIZADO: 1) Al amanecer, activa tu Casa 1 (identidad). 2) Respira conscientemente (elemento aire). 3) Declara: "Soy innovación constante". 4) Ancla con 7 respiraciones.',
          lifeAreas: ['Identidad personal (Casa 1)', 'Propósito de vida', 'Creatividad e innovación'],
          avoid: 'Evita el desapego emocional típico de Acuario.',
          opportunity: 'Tu Sol Acuario Casa 1 + Luna Libra Casa 7 te convierte en LÍDER MAGNÉTICO.'
        }
      },
      {
        id: 'sample-2',
        date: '2025-09-15',
        title: 'Resonancia Lunar Libra',
        description: 'Tu Luna natal recibe activación directa para equilibrio emocional.',
        type: 'lunar_phase',
        importance: 'medium',
        personalInterpretation: {
          impact: '¡ACTIVACIÓN CÓSMICA DETECTADA! Tu Luna natal en Libra 5.9° Casa 7 recibe códigos de actualización del cosmos.',
          advice: 'EQUILIBRA tus emociones usando tu superpoder natural de Libra. Tu Casa 7 se activa para relaciones armoniosas.',
          mantra: 'SOY EQUILIBRIO PERFECTO. MI LUNA EN LIBRA ES MI BRÚJULA EMOCIONAL.',
          lifeAreas: ['Relaciones (Casa 7)', 'Equilibrio emocional', 'Armonía']
        }
      }
    ];
  };

  // Funciones de navegación
  const getDaysWithEvents = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay() + 1);
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (7 - monthEnd.getDay()));

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const allEvents = [...events, ...getSampleEvents()];

    return days.map(day => {
      const dayEvents = allEvents.filter(event => {
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

  // Funciones para tooltips
  const handleEventHover = (event: AstronomicalEvent, mouseEvent: React.MouseEvent) => {
    setHoveredEvent(event);
    const rect = mouseEvent.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const handleEventLeave = () => {
    setHoveredEvent(null);
  };

  // Manejo del movimiento del mouse para tooltips
  const handleMouseMove = (event: React.MouseEvent) => {
    if (hoveredEvent) {
      setTooltipPosition({
        x: event.clientX,
        y: event.clientY - 20
      });
    }
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
        return `${baseStyle} bg-gradient-to-r from-purple-500 to-pink-500 shadow-sm`;
    }
  };

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const days = getDaysWithEvents();

  return (
    <div className="max-w-6xl mx-auto" onMouseMove={handleMouseMove}>
      {/* Header con estadísticas - RESTAURADO */}
      <div className="mb-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-3xl font-bold text-white capitalize mb-2 flex items-center">
              <span className="text-purple-400 mr-3">🗓️</span>
              {getCurrentMonthName()}
            </h2>
            
            {eventsMetadata && (
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center text-blue-300">
                  <span className="h-2 w-2 rounded-full bg-blue-400 mr-2"></span>
                  {eventsMetadata.highlights?.totalEvents || 0} eventos totales
                </span>
                
                {eventsMetadata.highlights?.highPriority > 0 && (
                  <span className="flex items-center text-red-300">
                    <span className="h-2 w-2 rounded-full bg-red-400 mr-2 animate-pulse"></span>
                    {eventsMetadata.highlights.highPriority} alta prioridad
                  </span>
                )}
                
                {eventsMetadata.highlights?.withAiInterpretation > 0 && (
                  <span className="flex items-center text-purple-300">
                    <span className="h-2 w-2 rounded-full bg-purple-400 mr-2"></span>
                    {eventsMetadata.highlights.withAiInterpretation} con IA
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Navegación de meses - RESTAURADA */}
          <div className="flex items-center gap-3">
            <button
              onClick={goToPreviousMonth}
              className="p-3 rounded-xl bg-gradient-to-r from-purple-600/80 to-indigo-600/80 hover:from-purple-500/90 hover:to-indigo-500/90 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 border border-white/10"
              aria-label="Mes anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={goToNextMonth}
              className="p-3 rounded-xl bg-gradient-to-r from-purple-600/80 to-indigo-600/80 hover:from-purple-500/90 hover:to-indigo-500/90 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 border border-white/10"
              aria-label="Mes siguiente"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Información sobre eventos reales - RESTAURADA */}
      {showRealEventsInfo && eventsMetadata && (
        <div className="mb-6 p-4 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 backdrop-blur-sm border border-indigo-400/30 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-200 font-semibold flex items-center">
                <span className="text-indigo-400 mr-2">✨</span>
                Eventos Astrológicos Reales: {eventsMetadata.highlights?.totalEvents || 0} eventos obtenidos
              </p>
              <p className="text-indigo-300 text-sm mt-1">
                Estrategia: {eventsMetadata.metadata?.strategy || 'Híbrida Prokerala + Cálculos astronómicos'}
              </p>
              {eventsMetadata.highlights?.withAiInterpretation && (
                <p className="text-indigo-300 text-sm">
                  {eventsMetadata.highlights.withAiInterpretation} interpretados con IA personalizada
                </p>
              )}
            </div>
            <div className="text-indigo-400 text-3xl">🌟</div>
          </div>
        </div>
      )}

      {/* Estado de carga - RESTAURADO */}
      {loading && (
        <div className="flex justify-center items-center h-32 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl shadow-lg mb-6 border border-white/20">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-400 border-t-transparent"></div>
          <span className="ml-3 text-purple-200 font-medium">Consultando las estrellas...</span>
        </div>
      )}

      {/* Mensaje de error - RESTAURADO */}
      {error && (
        <div className="bg-gradient-to-r from-red-900/60 to-orange-900/60 border border-red-400/30 p-4 rounded-2xl mb-6 shadow-lg backdrop-blur-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-200 font-medium">{error}</p>
              <p className="text-xs text-red-300 mt-1">Mostrando eventos de ejemplo mientras se resuelve el problema.</p>
            </div>
          </div>
        </div>
      )}

      {/* CALENDARIO PRINCIPAL - RESTAURADO CON ESTILOS */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-px bg-gradient-to-r from-purple-800/50 to-indigo-800/50">
          {weekDays.map((day, index) => (
            <div key={index} className="bg-gradient-to-br from-purple-700/40 to-indigo-700/40 backdrop-blur-sm py-4 text-center text-sm font-semibold text-purple-100 border-b border-white/10">
              {day}
            </div>
          ))}
        </div>

        {/* Días del mes con eventos */}
        <div className="grid grid-cols-7 gap-px bg-gradient-to-br from-purple-800/30 to-indigo-800/30">
          {days.map((day, index) => (
            <div
              key={index}
              className={`min-h-[120px] p-3 cursor-pointer transition-all duration-300 relative group border-white/5 ${
                day.isCurrentMonth
                  ? isSameDay(day.date, new Date())
                    ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-400/50 shadow-lg'
                    : 'bg-gradient-to-br from-white/5 to-white/0 hover:from-white/10 hover:to-white/5'
                  : 'bg-gradient-to-br from-gray-800/20 to-gray-900/20 text-gray-500'
              } ${isSameDay(day.date, selectedDate || new Date(0)) ? 'ring-2 ring-purple-400/60 ring-inset shadow-lg' : ''}`}
              onClick={() => handleDayClick(day)}
            >
              {/* Número del día */}
              <div className={`font-semibold text-sm mb-2 ${
                isSameDay(day.date, new Date()) 
                  ? 'text-purple-200 font-bold' 
                  : day.isCurrentMonth ? 'text-white' : 'text-gray-500'
              }`}>
                {day.date.getDate()}
              </div>
              
              {/* Eventos del día */}
              {day.hasEvents && (
                <div className="space-y-1">
                  {day.events.slice(0, 3).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="flex items-center cursor-pointer group-hover:scale-105 transition-transform duration-200 hover:bg-white/10 rounded p-1"
                      onMouseEnter={(e) => handleEventHover(event, e)}
                      onMouseLeave={handleEventLeave}
                    >
                      <span className={getEventIndicatorStyle(event.type, event.importance)}></span>
                      <span className="text-xs truncate font-medium text-gray-100 flex-1">
                        {event.title}
                      </span>
                      {event.importance === 'high' && (
                        <span className="text-red-400 text-xs ml-1 animate-pulse">!</span>
                      )}
                    </div>
                  ))}
                  {day.events.length > 3 && (
                    <div className="text-xs text-purple-300 font-medium pl-4">
                      +{day.events.length - 3} más
                    </div>
                  )}
                </div>
              )}

              {/* Indicador de hover mejorado */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-400/30 rounded transition-colors duration-200 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>

      {/* DETALLES DEL DÍA SELECCIONADO - PANEL LATERAL */}
      {selectedDate && (
        <div className="mt-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 p-6 text-white border-b border-white/20">
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              <span className="text-yellow-300 mr-3">📅</span>
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
                : `${selectedDayEvents.length} evento${selectedDayEvents.length > 1 ? 's' : ''} programado${selectedDayEvents.length > 1 ? 's' : ''}`
              }
            </p>
          </div>

          {selectedDayEvents.length > 0 && (
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {selectedDayEvents.map((event) => (
                <div
                  key={event.id}
                  className="border border-white/20 rounded-xl p-4 hover:shadow-lg hover:bg-white/5 transition-all duration-200 cursor-pointer backdrop-blur-sm"
                  onMouseEnter={(e) => handleEventHover(event, e)}
                  onMouseLeave={handleEventLeave}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <span className={getEventIndicatorStyle(event.type, event.importance)}></span>
                      <h4 className="font-semibold text-white">{event.title}</h4>
                    </div>
                    {event.importance === 'high' && (
                      <span className="bg-red-500/80 text-white text-xs font-medium px-2 py-1 rounded-full animate-pulse">
                        Alta prioridad
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3">{event.description}</p>
                  
                  {(event.planet || event.sign) && (
                    <div className="flex items-center gap-4 text-sm">
                      {event.planet && (
                        <span className="flex items-center text-blue-300">
                          <span className="font-medium">Planeta:</span>
                          <span className="ml-1">{event.planet}</span>
                        </span>
                      )}
                      {event.sign && (
                        <span className="flex items-center text-purple-300">
                          <span className="font-medium">Signo:</span>
                          <span className="ml-1">{event.sign}</span>
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-3 text-xs text-purple-300 italic">
                    Mantén el cursor sobre el evento para ver interpretación completa
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TOOLTIP DE EVENTO - ESTILO CARTA NATAL */}
      {hoveredEvent && hoveredEvent.personalInterpretation && (
        <div 
          className="fixed bg-gradient-to-r from-purple-500/95 to-pink-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-5 shadow-2xl max-w-lg pointer-events-none"
          style={{ 
            left: tooltipPosition.x - 250,
            top: tooltipPosition.y - 20,
            zIndex: 100000,
            transform: tooltipPosition.x > window.innerWidth - 500 ? 'translateX(-50%)' : 'none'
          }}
        >
          {/* Header del tooltip */}
          <div className="flex items-center mb-4">
            <div className={`w-4 h-4 rounded-full mr-3 ${
              hoveredEvent.importance === 'high' ? 'bg-red-400 animate-pulse' :
              hoveredEvent.importance === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
            }`}></div>
            <div>
              <div className="text-white font-bold text-lg">{hoveredEvent.title}</div>
              <div className="text-gray-200 text-sm">
                {new Date(hoveredEvent.date).toLocaleDateString('es-ES', { 
                  weekday: 'long', day: 'numeric', month: 'long' 
                })}
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="space-y-3">
            {/* Significado Épico */}
            <div className="bg-white/10 rounded-lg p-3 border border-white/20">
              <div className="text-yellow-300 font-semibold text-sm mb-1 flex items-center">
                <span className="mr-2">🔥</span>
                SIGNIFICADO ÉPICO:
              </div>
              <div className="text-white text-sm leading-relaxed">
                {hoveredEvent.personalInterpretation.impact}
              </div>
            </div>

            {/* Áreas Activadas */}
            {hoveredEvent.personalInterpretation.lifeAreas && (
              <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                <div className="text-blue-300 font-semibold text-sm mb-2 flex items-center">
                  <span className="mr-2">🎯</span>
                  ÁREAS ACTIVADAS:
                </div>
                <div className="flex flex-wrap gap-1">
                  {hoveredEvent.personalInterpretation.lifeAreas.map((area: string, index: number) => (
                    <span key={index} className="bg-blue-500/20 border border-blue-400/30 text-blue-200 px-2 py-1 rounded-full text-xs">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Consejo Revolucionario */}
            <div className="bg-white/10 rounded-lg p-3 border border-white/20">
              <div className="text-emerald-300 font-semibold text-sm mb-1 flex items-center">
                <span className="mr-2">⚡</span>
                CONSEJO:
              </div>
              <div className="text-white text-sm leading-relaxed">
                {hoveredEvent.personalInterpretation.advice}
              </div>
            </div>

            {/* Mantra */}
            {hoveredEvent.personalInterpretation.mantra && (
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-lg p-3 text-center">
                <div className="text-yellow-300 font-semibold text-sm mb-1 flex items-center justify-center">
                  <span className="mr-2">✨</span>
                  MANTRA:
                </div>
                <div className="text-white text-sm font-medium italic">
                  "{hoveredEvent.personalInterpretation.mantra}"
                </div>
              </div>
            )}
          </div>

          {/* Indicador de más información */}
          <div className="mt-3 pt-3 border-t border-white/20 text-center">
            <div className="text-gray-300 text-xs">
              Haz clic en el evento para ver rituales y detalles completos
            </div>
          </div>
        </div>
      )}

      {/* LEYENDA DE TIPOS DE EVENTOS - RESTAURADA */}
      <div className="mt-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <h4 className="font-bold text-white mb-4 text-lg flex items-center">
          <span className="text-purple-400 mr-3">🎨</span>
          Tipos de Eventos Astrológicos
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center p-3 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-lg backdrop-blur-sm border border-indigo-400/20">
            <span className="h-4 w-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mr-3 shadow-sm"></span>
            <span className="text-gray-100 font-medium">🌙 Fases Lunares</span>
          </div>
          <div className="flex items-center p-3 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-lg backdrop-blur-sm border border-blue-400/20">
            <span className="h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mr-3 shadow-sm"></span>
            <span className="text-gray-100 font-medium">🪐 Tránsitos Planetarios</span>
          </div>
          <div className="flex items-center p-3 bg-gradient-to-r from-orange-900/40 to-red-900/40 rounded-lg backdrop-blur-sm border border-orange-400/20">
            <span className="h-4 w-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 mr-3 shadow-sm"></span>
            <span className="text-gray-100 font-medium">↩️ Retrogradaciones</span>
          </div>
          <div className="flex items-center p-3 bg-gradient-to-r from-green-900/40 to-emerald-900/40 rounded-lg backdrop-blur-sm border border-green-400/20">
            <span className="h-4 w-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mr-3 shadow-sm"></span>
            <span className="text-gray-100 font-medium">➡️ Movimientos Directos</span>
          </div>
          <div className="flex items-center p-3 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-lg backdrop-blur-sm border border-purple-400/20">
            <span className="h-4 w-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 mr-3 shadow-sm"></span>
            <span className="text-gray-100 font-medium">🌑 Eclipses</span>
          </div>
          <div className="flex items-center p-3 bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-lg backdrop-blur-sm border border-yellow-400/20">
            <span className="h-4 w-4 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 mr-3 shadow-sm"></span>
            <span className="text-gray-100 font-medium">🍃 Cambios Estacionales</span>
          </div>
        </div>
        
        {/* Indicadores de prioridad */}
        <div className="mt-6 pt-4 border-t border-white/20">
          <h5 className="text-purple-200 font-semibold mb-3">Niveles de Importancia:</h5>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-red-500 mr-2 animate-pulse"></span>
              <span className="text-gray-200 text-sm">Alta Prioridad - Eventos críticos</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></span>
              <span className="text-gray-200 text-sm">Media Prioridad - Importantes</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
              <span className="text-gray-200 text-sm">Baja Prioridad - Informativos</span>
            </div>
          </div>
        </div>

        {/* Instrucciones de uso */}
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-400/30 rounded-lg">
          <p className="text-purple-200 text-sm text-center">
            <span className="font-semibold">💡 Tip:</span> Mantén el cursor sobre cualquier evento para ver su interpretación personalizada completa
          </p>
        </div>
      </div>
    </div>
  );
}