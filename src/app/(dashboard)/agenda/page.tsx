//src/app/(dashboard)/agenda/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, AlertCircle, Star, Clock, Target, Heart, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { generateCostEffectiveInterpretation } from '@/utils/astrology/intelligentFallbacks';
import { useAuth } from '@/context/AuthContext';
import type { UserProfile, AstrologicalEvent } from '@/types/astrology/unified-types';

const AgendaPersonalizada = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<AstrologicalEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AstrologicalEvent | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'year'>('month');
  const [loading, setLoading] = useState(false);
  const [yearView, setYearView] = useState(new Date().getFullYear());
const { user } = useAuth(); // Si tienes AuthContext
  // Perfil de usuario mock (reemplazar con datos reales)
  const userProfile: UserProfile = {
    userId: user?.uid || 'demo-user',
    name: user?.displayName || 'Usuario',
    birthDate: '1990-01-01',
    currentAge: 34,
    nextAge: 35,
    latitude: 40.4168,
    longitude: -3.7038,
    timezone: 'Europe/Madrid',
    place: 'Madrid, España',
    astrological: {
      signs: {
        sun: 'Acuario',
        moon: 'Libra',
        ascendant: 'Acuario',
        mercury: 'Acuario',
        venus: 'Piscis',
        mars: 'Aries'
      },
      houses: {
        sun: 1,
        moon: 7,
        mercury: 1,
        venus: 12,
        mars: 3
      },
      dominantElements: ['air'],
      dominantMode: 'fixed',
      lifeThemes: ['Innovación', 'Humanitarismo', 'Libertad'],
      strengths: ['Creatividad', 'Originalidad', 'Independencia'],
      challenges: ['Desapego emocional', 'Rebeldía', 'Imprevisibilidad']
    }
  };

  // Generar eventos para todo el año
  useEffect(() => {
    generateYearEvents();
  }, [yearView]);

  // Función para obtener eventos reales
  const generateYearEvents = async () => {
    setLoading(true);
    
    try {
      // Llamar a tu API de eventos reales
      const response = await fetch('/api/astrology/complete-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userProfile.userId, // Usar el userId real
          startDate: `${yearView}-01-01`,
          endDate: `${yearView}-12-31`
        })
      });

      if (!response.ok) {
        throw new Error('Error obteniendo eventos');
      }

      const data = await response.json();
      
      // Aplicar interpretaciones a cada evento
      const eventsWithInterpretations = (data.events || []).map((event: any) => {
        try {
          const aiInterpretation = generateCostEffectiveInterpretation(event, userProfile);
          return {
            ...event,
            aiInterpretation
          };
        } catch (error) {
          console.error('Error generando interpretación:', error);
          return event;
        }
      });

      setEvents(eventsWithInterpretations);
      
    } catch (error) {
      console.error('Error cargando eventos:', error);
      
      // Fallback a eventos de ejemplo si falla la API
      generateExampleEvents(); // Crear esta función con el código anterior
    } finally {
      setLoading(false);
    }
  };

  // Función de fallback para generar eventos de ejemplo
  const generateExampleEvents = () => {
    const exampleEvents: AstrologicalEvent[] = [];
    const currentYear = yearView;
    
    // Generar eventos para cada mes
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
      
      // Generar 2-5 eventos por mes
      const eventsThisMonth = Math.floor(Math.random() * 4) + 2;
      
      for (let i = 0; i < eventsThisMonth; i++) {
        const day = Math.floor(Math.random() * daysInMonth) + 1;
        const date = `${currentYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        exampleEvents.push({
          id: `example-${month}-${i}`,
          date,
          title: getRandomEventTitle(),
          description: `Evento astrológico importante para tu crecimiento personal`,
          type: getRandomEventType(),
          priority: getRandomPriority(),
          planet: getRandomPlanet(),
          sign: getRandomSign()
        });
      }
    }
    
    // Aplicar interpretaciones a cada evento
    const eventsWithInterpretations = exampleEvents.map(event => {
      try {
        const aiInterpretation = generateCostEffectiveInterpretation(event, userProfile);
        return {
          ...event,
          aiInterpretation
        };
      } catch (error) {
        console.error('Error generando interpretación:', error);
        return event;
      }
    });

    setEvents(eventsWithInterpretations);
  };

  const getRandomSign = () => {
    const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 
                   'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
    return signs[Math.floor(Math.random() * signs.length)];
  };

  const getRandomPlanet = () => {
    const planets = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno'];
    return planets[Math.floor(Math.random() * planets.length)];
  };

  const getRandomEventType = () => {
    const types = ['planetary_transit', 'aspect', 'lunar_resonance', 'venus_harmony', 'mars_action'];
    return types[Math.floor(Math.random() * types.length)];
  };

  const getRandomEventTitle = () => {
    const titles = [
      'Trígono Venus-Júpiter',
      'Marte en aspecto con Plutón',
      'Activación del Nodo Norte',
      'Portal de Abundancia',
      'Resonancia Kármica'
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  };

  const getRandomPriority = (): 'high' | 'medium' | 'low' => {
    const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
    return priorities[Math.floor(Math.random() * priorities.length)];
  };

  // Obtener eventos del mes
  const getMonthEvents = (year: number, month: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  };

  // Obtener eventos del día
  const getDayEvents = (date: Date): AstrologicalEvent[] => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  // Navegación de meses
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Renderizar interpretación
  const renderInterpretation = (event: AstrologicalEvent) => {
        if (!event.aiInterpretation) {
      return (
        <div className="p-4 bg-purple-900/50 rounded-lg">
          <p className="text-white">{event.description}</p>
        </div>
      );
    }

    const interp = event.aiInterpretation;
    
    return (
      <div className="space-y-4">
        {/* Significado */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-4 rounded-lg">
          <h4 className="text-yellow-400 font-bold mb-2">SIGNIFICADO ÉPICO:</h4>
          <p className="text-white">{interp.meaning}</p>
        </div>

        {/* Áreas de Vida */}
        {interp.lifeAreas && interp.lifeAreas.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-900 to-blue-900 p-4 rounded-lg">
            <h4 className="text-green-400 font-bold mb-2">ÁREAS ACTIVADAS:</h4>
            <ul className="text-white space-y-1">
              {interp.lifeAreas.map((area: string, idx: number) => (
                <li key={idx} className="flex items-start">
                  <span className="text-green-400 mr-2">→</span>
                  {area}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Consejo */}
        {interp.advice && (
          <div className="bg-gradient-to-r from-pink-900 to-purple-900 p-4 rounded-lg">
            <h4 className="text-orange-400 font-bold mb-2">CONSEJO REVOLUCIONARIO:</h4>
            <p className="text-white">
              {Array.isArray(interp.advice) ? interp.advice.join(' ') : interp.advice}
            </p>
          </div>
        )}

        {/* Mantra */}
        {interp.mantra && (
          <div className="bg-gradient-to-r from-yellow-900 to-orange-900 p-4 rounded-lg text-center">
            <h4 className="text-yellow-300 font-bold mb-2">MANTRA DE PODER:</h4>
            <p className="text-white font-bold text-lg italic">"{interp.mantra}"</p>
          </div>
        )}

        {/* Ritual */}
        {interp.ritual && (
          <div className="bg-gradient-to-r from-teal-900 to-cyan-900 p-4 rounded-lg">
            <h4 className="text-cyan-300 font-bold mb-2">RITUAL DE ACTIVACIÓN:</h4>
            <p className="text-white whitespace-pre-line">{interp.ritual}</p>
          </div>
        )}
      </div>
    );
  };

  // Vista de calendario mensual
  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
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

    return (
      <div className="grid grid-cols-7 gap-1">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="text-center text-purple-300 font-semibold p-2">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const dayEvents = getDayEvents(day);
          const isCurrentMonth = day.getMonth() === month;
          const isToday = day.toDateString() === new Date().toDateString();
          const isSelected = day.toDateString() === selectedDate.toDateString();

          return (
            <div
              key={index}
              onClick={() => setSelectedDate(day)}
              className={`
                min-h-[100px] p-2 rounded-lg cursor-pointer transition-all
                ${isCurrentMonth ? 'bg-white/10' : 'bg-white/5'}
                ${isToday ? 'ring-2 ring-yellow-400' : ''}
                ${isSelected ? 'bg-purple-600/40' : ''}
                hover:bg-white/20
              `}
            >
              <div className={`text-sm font-semibold mb-1 ${
                isCurrentMonth ? 'text-white' : 'text-purple-400'
              }`}>
                {day.getDate()}
              </div>
              {dayEvents.length > 0 && (
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded truncate ${
                        event.priority === 'high' ? 'bg-red-500' :
                        event.priority === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      } text-white`}
                    >
                      {event.title.substring(0, 15)}...
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-purple-300">
                      +{dayEvents.length - 2}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Vista anual
  const renderYearView = () => {
    const months = [];
    for (let month = 0; month < 12; month++) {
      const monthEvents = getMonthEvents(yearView, month);
      const highPriorityCount = monthEvents.filter(e => e.priority === 'high').length;
      
      months.push({
        month,
        name: new Date(yearView, month).toLocaleString('es', { month: 'long' }),
        events: monthEvents,
        highPriority: highPriorityCount
      });
    }

    return (
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {months.map(({ month, name, events, highPriority }) => (
          <div
            key={month}
            onClick={() => {
              setCurrentDate(new Date(yearView, month, 1));
              setViewMode('month');
            }}
            className="bg-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/20 transition-all"
          >
            <h3 className="text-white font-bold capitalize mb-2">{name}</h3>
            <div className="text-sm space-y-1">
              <div className="text-purple-300">
                {events.length} eventos
              </div>
              {highPriority > 0 && (
                <div className="text-red-400">
                  {highPriority} críticos
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            AGENDA CÓSMICA PERSONALIZADA
          </h1>
          <p className="text-purple-200">
            Tu guía revolucionaria para navegar las energías del universo - Año {yearView}
          </p>
        </div>

        {/* Controles */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'month' ? 'bg-purple-600 text-white' : 'bg-white/20 text-purple-200'
                }`}
              >
                Mes
              </button>
              <button
                onClick={() => setViewMode('year')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'year' ? 'bg-purple-600 text-white' : 'bg-white/20 text-purple-200'
                }`}
              >
                Año
              </button>
            </div>

            {viewMode === 'month' && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="text-white hover:text-purple-300"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="text-2xl font-bold text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </div>
                <button
                  onClick={() => navigateMonth('next')}
                  className="text-white hover:text-purple-300"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}

            {viewMode === 'year' && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setYearView(prev => prev - 1)}
                  className="text-white hover:text-purple-300"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="text-2xl font-bold text-white">
                  {yearView}
                </div>
                <button
                  onClick={() => setYearView(prev => prev + 1)}
                  className="text-white hover:text-purple-300"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Vista principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-6">
            {viewMode === 'month' && renderMonthView()}
            {viewMode === 'year' && renderYearView()}
          </div>

          {/* Panel de eventos */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              {viewMode === 'month' 
                ? `Eventos del ${selectedDate.getDate()} de ${monthNames[selectedDate.getMonth()]}`
                : `Resumen del Año ${yearView}`
              }
            </h3>
            
            {viewMode === 'month' ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {getDayEvents(selectedDate).length === 0 ? (
                  <p className="text-purple-300 italic">No hay eventos este día</p>
                ) : (
                  getDayEvents(selectedDate).map(event => (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="bg-white/10 rounded-lg p-3 cursor-pointer hover:bg-white/20"
                    >
                      <h4 className="font-semibold text-white">{event.title}</h4>
                      <p className="text-sm text-purple-200 mt-1">{event.description}</p>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-3">
                  <div className="text-white font-bold">Total de Eventos</div>
                  <div className="text-2xl text-white">{events.length}</div>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg p-3">
                  <div className="text-white font-bold">Eventos Críticos</div>
                  <div className="text-2xl text-white">
                    {events.filter(e => e.priority === 'high').length}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel de interpretación expandida */}
        {selectedEvent && (
          <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-white">
                {selectedEvent.title.toUpperCase()}
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-purple-300 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            {renderInterpretation(selectedEvent)}
          </div>
        )}
      </div>
    </div>
  );
};

export default function AgendaPage() {
  return <AgendaPersonalizada />;
}