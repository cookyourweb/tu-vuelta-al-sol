'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, AlertCircle, Star, Clock, Target, Heart, Zap } from 'lucide-react';

// Tipos simplificados para el componente
interface AstrologicalEvent {
  id: string;
  date: string;
  time?: string;
  title: string;
  description: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  planet?: string;
  sign?: string;
  disruptiveInterpretation?: any;
}

interface AgendaProps {
  userId?: string;
  events?: AstrologicalEvent[];
}

const AgendaPersonalizada: React.FC<AgendaProps> = ({ 
  userId = 'demo-user',
  events: initialEvents = []
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<AstrologicalEvent[]>(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<AstrologicalEvent | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [loading, setLoading] = useState(false);

  // Generar eventos de ejemplo si no hay eventos
  useEffect(() => {
    if (events.length === 0) {
      generateSampleEvents();
    }
  }, []);

  const generateSampleEvents = () => {
    const sampleEvents: AstrologicalEvent[] = [
      {
        id: '1',
        date: '2025-08-28',
        title: 'Luna Nueva en Virgo',
        description: 'PORTAL DE MANIFESTACIÓN: Momento ideal para sembrar intenciones de orden y salud',
        type: 'lunar_phase',
        priority: 'high',
        sign: 'Virgo'
      },
      {
        id: '2', 
        date: '2025-08-30',
        title: 'Mercurio Retrógrado',
        description: '[ALERTA] Período de revisión profunda en comunicación y tecnología',
        type: 'retrograde',
        priority: 'high',
        planet: 'Mercurio',
        sign: 'Virgo'
      },
      {
        id: '3',
        date: '2025-09-02',
        title: 'Activación Solar Personal',
        description: 'TU SOL NATAL SE ACTIVA: Máximo poder para manifestar tu propósito',
        type: 'solar_activation',
        priority: 'high',
        planet: 'Sol',
        sign: 'Acuario'
      },
      {
        id: '4',
        date: '2025-09-07',
        title: 'Resonancia Lunar Libra',
        description: 'Tu Luna natal en Libra resuena con energías cósmicas de equilibrio',
        type: 'lunar_resonance',
        priority: 'medium',
        planet: 'Luna',
        sign: 'Libra'
      },
      {
        id: '5',
        date: '2025-09-15',
        title: 'Portal de Transformación',
        description: 'MOMENTO ÉPICO: Las energías convergen para tu evolución radical',
        type: 'life_purpose_activation',
        priority: 'high'
      }
    ];
    setEvents(sampleEvents);
  };

  // Obtener eventos del día seleccionado
  const getDayEvents = (date: Date): AstrologicalEvent[] => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  // Generar días del calendario
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  // Renderizar interpretación disruptiva
  const renderDisruptiveInterpretation = (event: AstrologicalEvent) => {
    if (!event.disruptiveInterpretation) {
      return (
        <div className="mt-4 p-4 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg">
          <h4 className="text-lg font-bold text-white mb-2">[ACTIVACIÓN CÓSMICA]</h4>
          <p className="text-purple-100">{event.description}</p>
          <div className="mt-4 space-y-2">
            <div className="flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400 mt-1" />
              <div>
                <p className="text-sm font-semibold text-yellow-400">QUÉ ESPERAR:</p>
                <p className="text-sm text-purple-100">
                  Tu energía estará elevada. Aprovecha para tomar acción decisiva hacia tus metas.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Target className="w-5 h-5 text-green-400 mt-1" />
              <div>
                <p className="text-sm font-semibold text-green-400">ACCIÓN RECOMENDADA:</p>
                <p className="text-sm text-purple-100">
                  Dedica 15 minutos a meditar sobre tu propósito y toma UNA acción concreta hoy.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-orange-400 mt-1" />
              <div>
                <p className="text-sm font-semibold text-orange-400">EVITA:</p>
                <p className="text-sm text-purple-100">
                  No te disperses en múltiples direcciones. Mantén el foco en tu prioridad principal.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="mt-4 p-4 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg">
        {/* Contenido personalizado basado en la interpretación */}
        <div dangerouslySetInnerHTML={{ __html: event.disruptiveInterpretation }} />
      </div>
    );
  };

  // Obtener color según prioridad
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Obtener icono según tipo de evento
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'lunar_phase':
      case 'lunar_resonance':
        return '🌙';
      case 'solar_activation':
        return '☀️';
      case 'retrograde':
        return '🔄';
      case 'life_purpose_activation':
        return '⚡';
      default:
        return '✨';
    }
  };

  const calendarDays = generateCalendarDays();
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            AGENDA CÓSMICA PERSONALIZADA
          </h1>
          <p className="text-purple-200">
            Tu guía revolucionaria para navegar las energías del universo
          </p>
        </div>

        {/* Controles */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'day' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/20 text-purple-200 hover:bg-white/30'
                }`}
              >
                Día
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'week' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/20 text-purple-200 hover:bg-white/30'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'month' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/20 text-purple-200 hover:bg-white/30'
                }`}
              >
                Mes
              </button>
            </div>
            <div className="text-2xl font-bold text-white">
              {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendario */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <div className="grid grid-cols-7 gap-1">
              {/* Días de la semana */}
              {weekDays.map((day) => (
                <div key={day} className="text-center text-purple-300 font-semibold p-2">
                  {day}
                </div>
              ))}
              
              {/* Días del calendario */}
              {calendarDays.map((day, index) => {
                const dayEvents = getDayEvents(day);
                const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
                const isToday = day.toDateString() === new Date().toDateString();
                const isSelected = day.toDateString() === selectedDate.toDateString();
                
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      min-h-[80px] p-2 rounded-lg cursor-pointer transition-all
                      ${isCurrentMonth ? 'bg-white/10' : 'bg-white/5'}
                      ${isToday ? 'ring-2 ring-yellow-400' : ''}
                      ${isSelected ? 'bg-purple-600/40' : ''}
                      hover:bg-white/20
                    `}
                  >
                    <div className={`text-sm font-semibold ${
                      isCurrentMonth ? 'text-white' : 'text-purple-400'
                    }`}>
                      {day.getDate()}
                    </div>
                    
                    {/* Indicadores de eventos */}
                    {dayEvents.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded ${getPriorityColor(event.priority)} text-white`}
                          >
                            {getEventIcon(event.type)} {event.title.substring(0, 12)}...
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-purple-300">
                            +{dayEvents.length - 2} más
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panel de Eventos del Día */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Eventos del {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]}
            </h3>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {getDayEvents(selectedDate).length === 0 ? (
                <p className="text-purple-300 italic">No hay eventos cósmicos este día</p>
              ) : (
                getDayEvents(selectedDate).map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="bg-white/10 rounded-lg p-3 cursor-pointer hover:bg-white/20 transition-all"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">{getEventIcon(event.type)}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{event.title}</h4>
                        <p className="text-sm text-purple-200 mt-1">{event.description}</p>
                        {event.planet && (
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                              {event.planet}
                            </span>
                            {event.sign && (
                              <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">
                                {event.sign}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <span className={`w-2 h-2 rounded-full ${getPriorityColor(event.priority)}`} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Panel de Interpretación Disruptiva */}
        {selectedEvent && (
          <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-white">
                {selectedEvent.title.toUpperCase()}
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-purple-300 hover:text-white"
              >
                ✕
              </button>
            </div>
            {renderDisruptiveInterpretation(selectedEvent)}
          </div>
        )}

        {/* Resumen Mensual */}
        <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-white mb-4">
            RESUMEN ÉPICO DEL MES
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-6 h-6 text-white" />
                <h4 className="font-bold text-white">ALTA PRIORIDAD</h4>
              </div>
              <p className="text-white/90 text-sm">
                {events.filter(e => e.priority === 'high').length} eventos críticos este mes
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-6 h-6 text-white" />
                <h4 className="font-bold text-white">OPORTUNIDADES</h4>
              </div>
              <p className="text-white/90 text-sm">
                Múltiples portales de manifestación activos
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-6 h-6 text-white" />
                <h4 className="font-bold text-white">TEMA PRINCIPAL</h4>
              </div>
              <p className="text-white/90 text-sm">
                Revolución personal y activación de poder
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AgendaPage() {
  return <AgendaPersonalizada />;
}