// src/components/agenda/AstrologicalAgenda.tsx - VERSIÓN COMPLETA CORREGIDA
// ✅ PROBLEMA RESUELTO: Eventos no se mostraban en sidebar derecho

import React, { useState, useEffect } from 'react';
import { format, isSameDay, isSameMonth, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { normalizeEvent, AstrologicalEvent } from '@/types/astrology/unified-types';
import { motion, AnimatePresence } from 'framer-motion';

// ✅ TIPOS CORREGIDOS CON AMBOS CAMPOS
interface AstronomicalEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: string;
  importance: 'high' | 'medium' | 'low';
  priority: 'high' | 'medium' | 'low'; // ✅ COMPATIBILIDAD
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
  aiInterpretation?: {
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
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  // ✅ CARGA DE EVENTOS CORREGIDA
  useEffect(() => {
    const loadCompleteEvents = async () => {
      if (!userId) {
        console.warn('⚠️ No hay userId, usando eventos de ejemplo');
        setEvents(generateSampleEvents());
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔡 Cargando eventos desde último cumpleaños...');
        
        // ✅ USAR EL ENDPOINT CORRECTO PARA PERÍODO COMPLETO
        const response = await fetch('/api/astrology/complete-events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: userId,
            includeFullYear: true, // ✅ AÑO COMPLETO
            eventsPerMonth: 12 // ✅ MÁS EVENTOS PARA EFECTO WOW
          })
        });
        
        const data = await response.json();
        
        if (data.success && data.data.events) {
          // ✅ NORMALIZAR EVENTOS CON AMBOS CAMPOS
          const normalizedEvents = data.data.events.map((event: any) => normalizeEvent(event));
          
          console.log(`✅ ${normalizedEvents.length} eventos normalizados cargados`);
          console.log('🔍 Primer evento:', normalizedEvents[0]);
          
          // Combinar con eventos IA si los hay
          const combinedEvents = [...normalizedEvents, ...aiEvents.map(normalizeEvent)];
          setEvents(combinedEvents);
          setEventsMetadata(data.data);
          
          console.log('📊 Total eventos combinados:', combinedEvents.length);
        } else {
          console.warn('⚠️ Error cargando eventos:', data.error);
          setError(`Error cargando eventos: ${data.error}`);
          setEvents(generateSampleEvents());
        }
      } catch (error) {
        console.error('❌ Error cargando eventos:', error);
        setError('Error de conexión al cargar eventos astrológicos');
        setEvents(generateSampleEvents());
      } finally {
        setLoading(false);
      }
    };
    
    loadCompleteEvents();
  }, [userId, aiEvents]);

  // ✅ GENERACIÓN DE DÍAS CON EVENTOS CORREGIDA
  const getDaysWithEvents = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay() + 1);
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (7 - monthEnd.getDay()));

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map(day => {
      const dayDateStr = format(day, 'yyyy-MM-dd');
      
      // ✅ BÚSQUEDA MEJORADA DE EVENTOS PARA EL DÍA
      const dayEvents = events.filter(event => {
        const eventDateStr = event.date;
        const eventDate = eventDateStr.split('T')[0]; // Remover tiempo si existe
        
        const match = eventDate === dayDateStr;
        if (match) {
          console.log(`🎯 Evento encontrado para ${dayDateStr}:`, event.title);
        }
        return match;
      });

      const dayData: AstronomicalDay = {
        date: day,
        events: dayEvents,
        isCurrentMonth: isSameMonth(day, currentMonth),
        hasEvents: dayEvents.length > 0
      };
      
      // Debug para días con eventos
      if (dayEvents.length > 0) {
        console.log(`📅 Día ${dayDateStr}: ${dayEvents.length} eventos`, 
          dayEvents.map(e => e.title));
      }
      
      return dayData;
    });
  };

  // ✅ MANEJO DE CLIC EN DÍA CORREGIDO
  const handleDayClick = (day: AstronomicalDay) => {
    console.log('🖱️ Clic en día:', {
      fecha: format(day.date, 'yyyy-MM-dd'),
      eventos: day.events.length,
      títulos: day.events.map(e => e.title)
    });
    
    setSelectedDate(day.date);
    setSelectedDayEvents(day.events);
    
    // ✅ FORZAR RE-RENDER SI HAY EVENTOS
    if (day.events.length > 0) {
      console.log('✅ Eventos asignados al sidebar:', day.events);
    } else {
      console.log('⚠️ No hay eventos para este día');
    }
  };

  // ✅ EVENTOS DE EJEMPLO MEJORADOS PARA TESTING
  const generateSampleEvents = (): AstronomicalEvent[] => {
    const today = new Date();
    const sampleEvents: AstronomicalEvent[] = [];
    
    // Generar eventos para los próximos 30 días
    for (let i = 0; i < 30; i++) {
      const eventDate = new Date(today);
      eventDate.setDate(today.getDate() + i);
      
      if (i % 3 === 0) { // Un evento cada 3 días
        sampleEvents.push({
          id: `sample-${i}`,
          date: format(eventDate, 'yyyy-MM-dd'),
          title: i % 6 === 0 ? 'Luna Nueva Energética' : 'Tránsito Planetario',
          description: i % 6 === 0 ? 
            'Momento perfecto para nuevos comienzos' : 
            'Energía planetaria especial activando tu potencial',
          type: i % 6 === 0 ? 'lunar_new' : 'planetary_transit',
          importance: i % 9 === 0 ? 'high' : 'medium',
          priority: i % 9 === 0 ? 'high' : 'medium', // ✅ AMBOS CAMPOS
          planet: i % 6 === 0 ? 'Luna' : 'Júpiter',
          sign: ZODIAC_SIGNS[i % 12],
          personalInterpretation: {
            impact: 'Energías especiales activando tu crecimiento personal',
            advice: 'Aprovecha este momento para conectar con tu intuición',
            mantra: 'Estoy alineado/a con las energías del universo',
            ritual: 'Medita 5 minutos visualizando tus objetivos',
            opportunity: 'Momento ideal para tomar decisiones importantes'
          }
        });
      }
    }
    
    console.log('🎭 Eventos de ejemplo generados:', sampleEvents.length);
    return sampleEvents;
  };

  // ✅ NAVEGACIÓN DE MESES
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

  // ✅ FUNCIÓN MEJORADA PARA ESTILOS DE EVENTOS
  const getEventIndicatorStyle = (eventType: string, importance: string) => {
    const baseStyle = "h-2 w-2 rounded-full mr-2 flex-shrink-0";
    
    if (importance === 'high') {
      return `${baseStyle} bg-gradient-to-r from-red-500 to-orange-500 shadow-sm animate-pulse`;
    }
    
    switch (eventType) {
      case 'lunar_new':
      case 'lunar_full':
      case 'lunar_phase':
        return `${baseStyle} bg-gradient-to-r from-indigo-500 to-purple-500 shadow-sm`;
      case 'planetary_transit':
        return `${baseStyle} bg-gradient-to-r from-blue-500 to-cyan-500 shadow-sm`;
      case 'retrograde':
        return `${baseStyle} bg-gradient-to-r from-red-600 to-pink-600 shadow-sm`;
      case 'solar_activation':
        return `${baseStyle} bg-gradient-to-r from-yellow-500 to-orange-500 shadow-sm`;
      case 'venus_harmony':
        return `${baseStyle} bg-gradient-to-r from-pink-500 to-rose-500 shadow-sm`;
      case 'mars_action':
        return `${baseStyle} bg-gradient-to-r from-red-500 to-orange-600 shadow-sm`;
      case 'mercury_communication':
        return `${baseStyle} bg-gradient-to-r from-green-500 to-emerald-500 shadow-sm`;
      case 'life_purpose_activation':
        return `${baseStyle} bg-gradient-to-r from-violet-500 to-purple-500 shadow-sm`;
      default:
        return `${baseStyle} bg-gradient-to-r from-gray-500 to-gray-600 shadow-sm`;
    }
  };

  // ✅ MANEJO DE TOOLTIP
  const handleEventHover = (event: AstronomicalEvent, e: React.MouseEvent) => {
    setHoveredEvent(event.id);
  };

  const handleEventLeave = () => {
    setHoveredEvent(null);
  };

  const daysWithEvents = getDaysWithEvents();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* ✅ HEADER MEJORADO */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 relative"
        >
          <div className="relative z-10">
            <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center">
              <span className="text-yellow-400 mr-4">🌟</span>
              Tu Agenda Astrológica
              <span className="text-yellow-400 ml-4">✨</span>
            </h1>
            <p className="text-purple-200 text-xl mb-2">
              Desde tu último cumpleaños hasta el próximo • Año astrológico completo
            </p>
            {birthDate && (
              <p className="text-purple-300 text-sm mt-2">
                📅 Período: Cumpleaños a Cumpleaños • {events.length} eventos cargados
              </p>
            )}
          </div>
        </motion.div>

        {/* ✅ INFO DE EVENTOS REALES */}
        {showRealEventsInfo && eventsMetadata && (
          <div className="mb-6 p-4 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 backdrop-blur-sm border border-indigo-400/30 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-200 font-semibold flex items-center">
                  <span className="text-indigo-400 mr-2">✨</span>
                  Eventos Astrológicos Reales: {eventsMetadata.highlights?.totalEvents || events.length} eventos obtenidos
                </p>
                <p className="text-indigo-300 text-sm mt-1">
                  Estrategia: {eventsMetadata.metadata?.strategy || 'Híbrida Prokerala + Cálculos astronómicos'}
                </p>
                {eventsMetadata.highlights?.withAiInterpretation && (
                  <p className="text-indigo-300 text-sm">
                    🤖 {eventsMetadata.highlights.withAiInterpretation} interpretados con IA personalizada
                  </p>
                )}
              </div>
              <div className="text-indigo-400 text-3xl">🌟</div>
            </div>
          </div>
        )}

        {/* ✅ ESTADO DE CARGA */}
        {loading && (
          <div className="flex justify-center items-center h-32 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl shadow-lg mb-6 border border-white/20">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-400 border-t-transparent"></div>
            <span className="ml-3 text-purple-200 font-medium">Consultando las estrellas...</span>
          </div>
        )}

        {/* ✅ MENSAJE DE ERROR */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/60 border border-red-400/30 rounded-2xl backdrop-blur-sm">
            <p className="text-red-200">⚠️ {error}</p>
            <p className="text-red-300 text-sm mt-1">Mostrando eventos de ejemplo como respaldo</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ✅ CALENDARIO PRINCIPAL */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              
              {/* Header del calendario */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <span className="text-purple-400 mr-2">📅</span>
                  {getCurrentMonthName()}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={goToPreviousMonth}
                    className="p-3 rounded-xl bg-gradient-to-r from-gray-100/20 to-gray-200/20 hover:from-gray-200/30 hover:to-gray-300/30 transition-all duration-200 shadow-sm border border-white/10"
                    aria-label="Mes anterior"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={goToNextMonth}
                    className="p-3 rounded-xl bg-gradient-to-r from-gray-100/20 to-gray-200/20 hover:from-gray-200/30 hover:to-gray-300/30 transition-all duration-200 shadow-sm border border-white/10"
                    aria-label="Mes siguiente"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Días de la semana */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-purple-200 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* ✅ GRID DE DÍAS CORREGIDO */}
              <div className="grid grid-cols-7 gap-2">
                {daysWithEvents.map((day, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative p-3 min-h-[100px] rounded-xl cursor-pointer transition-all duration-200 group
                      ${day.isCurrentMonth 
                        ? day.hasEvents 
                          ? 'bg-gradient-to-br from-purple-500/40 to-pink-500/40 border-2 border-purple-400/50 hover:from-purple-500/60 hover:to-pink-500/60'
                          : 'bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:bg-white/20'
                        : 'bg-gray-800/20 text-gray-500 border border-gray-600/20'
                      } 
                      ${isSameDay(day.date, selectedDate || new Date(0)) ? 'ring-2 ring-purple-400/60 ring-inset shadow-lg' : ''}
                      ${isSameDay(day.date, new Date()) ? 'ring-2 ring-yellow-400/60 ring-inset' : ''}
                    `}
                    onClick={() => handleDayClick(day)}
                  >
                    {/* Número del día */}
                    <div className={`font-semibold text-sm mb-2 ${
                      isSameDay(day.date, new Date()) 
                        ? 'text-yellow-200 font-bold' 
                        : day.isCurrentMonth ? 'text-white' : 'text-gray-500'
                    }`}>
                      {day.date.getDate()}
                    </div>
                    
                    {/* Indicador de hoy */}
                    {isSameDay(day.date, new Date()) && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                    )}
                    
                    {/* ✅ EVENTOS DEL DÍA MEJORADOS */}
                    {day.hasEvents && (
                      <div className="space-y-1">
                        {day.events.slice(0, 3).map((event, eventIndex) => (
                          <div
                            key={`${event.id}-${eventIndex}`}
                            className="flex items-center cursor-pointer group-hover:scale-105 transition-transform duration-200 hover:bg-white/10 rounded p-1"
                            title={event.description}
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

                    {/* Indicador de hover */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-400/30 rounded transition-colors duration-200 pointer-events-none"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* ✅ SIDEBAR CORREGIDO - AQUÍ ESTABA EL PROBLEMA PRINCIPAL */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-6">
              
              {/* Header del sidebar */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                  <span className="text-yellow-400 mr-2">📅</span>
                  {selectedDate ? 'Eventos del Día' : 'Selecciona un Día'}
                </h3>
                {selectedDate && (
                  <p className="text-purple-200 text-sm">
                    {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: es })}
                  </p>
                )}
              </div>

              {/* ✅ CONTENIDO DEL SIDEBAR CORREGIDO */}
              {selectedDate ? (
                <div className="space-y-4">
                  {/* Información del día */}
                  <div className="p-4 bg-gradient-to-r from-purple-600/40 to-indigo-600/40 rounded-xl border border-purple-400/30">
                    <p className="text-purple-100 text-sm text-center">
                      {selectedDayEvents.length === 0 
                        ? 'No hay eventos programados para este día'
                        : `${selectedDayEvents.length} evento${selectedDayEvents.length > 1 ? 's' : ''} programado${selectedDayEvents.length > 1 ? 's' : ''}`
                      }
                    </p>
                  </div>

                  {/* ✅ LISTA DE EVENTOS CORREGIDA */}
                  {selectedDayEvents.length > 0 && (
                    <div className="space-y-3">
                      {selectedDayEvents.map((event, index) => (
                        <motion.div
                          key={`sidebar-${event.id}-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-xl border border-indigo-400/30 hover:border-indigo-300/50 transition-colors duration-200"
                        >
                          {/* Header del evento */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center">
                              <span className={getEventIndicatorStyle(event.type, event.importance)}></span>
                              <h4 className="text-white font-semibold text-sm">{event.title}</h4>
                            </div>
                            {event.importance === 'high' && (
                              <span className="text-red-400 text-xs font-bold animate-pulse px-2 py-1 bg-red-400/20 rounded-full">
                                ALTA
                              </span>
                            )}
                          </div>

                          {/* Descripción */}
                          <p className="text-gray-200 text-xs mb-3 leading-relaxed">
                            {event.description}
                          </p>

                          {/* ✅ INTERPRETACIÓN PERSONALIZADA */}
                          {(event.personalInterpretation || event.aiInterpretation) && (
                            <div className="space-y-2">
                              {(event.personalInterpretation?.advice || event.aiInterpretation?.advice) && (
                                <div className="p-2 bg-blue-900/30 rounded-lg">
                                  <p className="text-blue-200 text-xs">
                                    <span className="font-semibold">💡 Consejo:</span> {event.personalInterpretation?.advice || event.aiInterpretation?.advice}
                                  </p>
                                </div>
                              )}
                              
                              {(event.personalInterpretation?.mantra || event.aiInterpretation?.mantra) && (
                                <div className="p-2 bg-purple-900/30 rounded-lg">
                                  <p className="text-purple-200 text-xs">
                                    <span className="font-semibold">🧘 Mantra:</span> "{event.personalInterpretation?.mantra || event.aiInterpretation?.mantra}"
                                  </p>
                                </div>
                              )}
                              
                              {(event.personalInterpretation?.opportunity || event.aiInterpretation?.opportunity) && (
                                <div className="p-2 bg-green-900/30 rounded-lg">
                                  <p className="text-green-200 text-xs">
                                    <span className="font-semibold">🌟 Oportunidad:</span> {event.personalInterpretation?.opportunity || event.aiInterpretation?.opportunity}
                                  </p>
                                </div>
                              )}

                              {(event.personalInterpretation?.ritual || event.aiInterpretation?.ritual) && (
                                <div className="p-2 bg-violet-900/30 rounded-lg">
                                  <p className="text-violet-200 text-xs">
                                    <span className="font-semibold">🕯️ Ritual:</span> {event.personalInterpretation?.ritual || event.aiInterpretation?.ritual}
                                  </p>
                                </div>
                              )}

                              {(event.personalInterpretation?.avoid || event.aiInterpretation?.avoid) && (
                                <div className="p-2 bg-orange-900/30 rounded-lg">
                                  <p className="text-orange-200 text-xs">
                                    <span className="font-semibold">⚠️ Evitar:</span> {event.personalInterpretation?.avoid || event.aiInterpretation?.avoid}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Info planetaria */}
                          {(event.planet || event.sign) && (
                            <div className="mt-3 pt-3 border-t border-white/10">
                              <div className="flex items-center text-xs text-gray-300">
                                {event.planet && (
                                  <span className="mr-3 flex items-center">
                                    <span className="mr-1">{getPlanetEmoji(event.planet)}</span>
                                    {event.planet}
                                  </span>
                                )}
                                {event.sign && (
                                  <span className="flex items-center">
                                    <span className="mr-1">♈</span>
                                    {event.sign}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Mensaje cuando no hay día seleccionado */
                <div className="text-center text-gray-300">
                  <div className="text-6xl mb-4">🌙</div>
                  <p className="text-lg font-medium mb-2">Explora tu Agenda</p>
                  <p className="text-sm text-gray-400">
                    Haz clic en cualquier día del calendario para ver tus eventos astrológicos
                  </p>
                  
                  {/* Stats de eventos */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-400/30 rounded-lg">
                    <p className="text-purple-200 text-sm">
                      📊 <strong>{events.length}</strong> eventos en tu año astrológico
                    </p>
                    <div className="mt-2 text-xs text-purple-300 space-y-1">
                      <div>Alta prioridad: <span className="text-red-400">{events.filter(e => e.importance === 'high').length}</span></div>
                      <div>Media: <span className="text-yellow-400">{events.filter(e => e.importance === 'medium').length}</span></div>
                      <div>Baja: <span className="text-blue-400">{events.filter(e => e.importance === 'low').length}</span></div>
                    </div>
                  </div>

                  {/* Quick preview de próximos eventos */}
                  {events.length > 0 && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-indigo-400/30 rounded-lg">
                      <h5 className="text-indigo-200 font-semibold mb-3 text-sm">🔮 Próximos Eventos</h5>
                      <div className="space-y-2">
                        {events
                          .filter(e => new Date(e.date) >= new Date())
                          .slice(0, 3)
                          .map((event, idx) => (
                            <div key={idx} className="flex items-center text-xs">
                              <span className={getEventIndicatorStyle(event.type, event.importance)}></span>
                              <span className="text-indigo-100 truncate">{event.title}</span>
                              <span className="text-indigo-300 ml-auto">
                                {format(new Date(event.date), 'dd MMM', { locale: es })}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ✅ LEYENDA DE EVENTOS */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <h5 className="text-purple-200 font-semibold mb-4 text-sm">Tipos de Eventos:</h5>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mr-3 shadow-sm"></span>
                    <span className="text-gray-200 text-sm">🌙 Fases Lunares</span>
                  </div>
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mr-3 shadow-sm"></span>
                    <span className="text-gray-200 text-sm">🪐 Tránsitos Planetarios</span>
                  </div>
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-gradient-to-r from-red-600 to-pink-600 mr-3 shadow-sm"></span>
                    <span className="text-gray-200 text-sm">⚡ Retrogradaciones</span>
                  </div>
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 mr-3 shadow-sm"></span>
                    <span className="text-gray-200 text-sm">☀️ Activaciones Solares</span>
                  </div>
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 mr-3 shadow-sm"></span>
                    <span className="text-gray-200 text-sm">💖 Venus Armonioso</span>
                  </div>
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-gradient-to-r from-red-500 to-orange-600 mr-3 shadow-sm"></span>
                    <span className="text-gray-200 text-sm">🔥 Marte Activo</span>
                  </div>
                </div>
                
                {/* Indicadores de prioridad */}
                <div className="mt-6 pt-4 border-t border-white/20">
                  <h5 className="text-purple-200 font-semibold mb-3 text-sm">Niveles de Importancia:</h5>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center">
                      <span className="h-3 w-3 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                      <span className="text-red-200 text-sm">Alta</span>
                    </div>
                    <div className="flex items-center">
                      <span className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></span>
                      <span className="text-yellow-200 text-sm">Media</span>
                    </div>
                    <div className="flex items-center">
                      <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
                      <span className="text-blue-200 text-sm">Baja</span>
                    </div>
                  </div>
                </div>

                {/* Tip de uso */}
                <div className="mt-4 p-3 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-400/30 rounded-lg">
                  <p className="text-purple-200 text-sm text-center">
                    <span className="font-semibold">💡 Tip:</span> Los eventos están basados en tu carta natal específica
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ RESUMEN ESTADÍSTICO */}
        <div className="mt-8 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
          <h3 className="text-white font-bold mb-4 flex items-center">
            📊 Resumen de tu Año Astrológico
            {birthDate && (
              <span className="ml-3 text-purple-300 text-sm font-normal">
                📅 {format(new Date(birthDate), 'dd MMM yyyy', { locale: es })}
              </span>
            )}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{events.length}</div>
              <div className="text-purple-200 text-sm">Total Eventos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{events.filter(e => e.importance === 'high').length}</div>
              <div className="text-red-200 text-sm">Alta Prioridad</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{events.filter(e => e.importance === 'medium').length}</div>
              <div className="text-yellow-200 text-sm">Media Prioridad</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {events.filter(e => e.personalInterpretation || e.aiInterpretation).length}
              </div>
              <div className="text-green-200 text-sm">Con IA Personal</div>
            </div>
          </div>

          <div className="text-purple-200 text-sm">
            <strong>Planetas más activos:</strong> {' '}
            {Object.entries(
              events.reduce((acc, event) => {
                const planet = event.planet || 'Otros';
                acc[planet] = (acc[planet] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            )
              .sort(([,a], [,b]) => b - a)
              .slice(0, 3)
              .map(([planet, count]) => `${planet} (${count})`)
              .join(', ')}
          </div>
        </div>

        {/* ✅ DEBUG INFO (solo en desarrollo) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-900/60 rounded-xl border border-gray-600/30">
            <h4 className="text-white font-semibold mb-2">🔧 Debug Info:</h4>
            <div className="text-xs text-gray-300 space-y-1">
              <p>Total eventos cargados: {events.length}</p>
              <p>Eventos con interpretación IA: {events.filter(e => e.personalInterpretation || e.aiInterpretation).length}</p>
              <p>UserId: {userId}</p>
              <p>Mes actual: {format(currentMonth, 'yyyy-MM')}</p>
              {selectedDate && (
                <p>Día seleccionado: {format(selectedDate, 'yyyy-MM-dd')} ({selectedDayEvents.length} eventos)</p>
              )}
              {birthDate && (
                <p>Fecha nacimiento: {birthDate}</p>
              )}
              <details className="mt-2">
                <summary className="cursor-pointer text-gray-400">Eventos raw (primeros 3)</summary>
                <pre className="mt-2 text-xs bg-black/50 p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(events.slice(0, 3), null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ CONSTANTES Y FUNCIONES AUXILIARES
const ZODIAC_SIGNS = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
];

function getPlanetEmoji(planet?: string): string {
  const emojis: Record<string, string> = {
    'Sol': '☀️',
    'Luna': '🌙',
    'Mercurio': '💫',
    'Venus': '💖',
    'Marte': '🔥',
    'Júpiter': '🌟',
    'Saturno': '⚡',
    'Urano': '⚡',
    'Neptuno': '🌊',
    'Plutón': '💎'
  };
  return emojis[planet || ''] || '🪐';
}