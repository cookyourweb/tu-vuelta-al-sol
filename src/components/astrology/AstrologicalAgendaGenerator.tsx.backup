//src/app/components/astrology/AstrologicalCalendar.tsx
'use client';

import { useState, useEffect } from 'react';

// Define or import the AstronomicalEvent type
interface AstronomicalEvent {
  date?: string;
  startDate?: string;
  type: string;
  planet?: string;
  phase?: string;
  sign?: string;
  description?: string;
}

interface AstrologicalCalendarProps {
  userId?: string;
  initialMonth?: Date;
  onEventClick?: (event: AstronomicalEvent) => void;
}

export default function AstrologicalCalendar({


  initialMonth = new Date(),
  onEventClick
}: AstrologicalCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(initialMonth);
  const [events, setEvents] = useState<AstronomicalEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<AstronomicalEvent[]>([]);

  // Obtener eventos astrológicos para el mes actual
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        // Calcular primer y último día del mes
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Formatear fechas para la API
        const startDate = firstDay.toISOString().split('T')[0];
        const endDate = lastDay.toISOString().split('T')[0];

        // Realizar la petición a la API
        const response = await fetch(
          `/api/events/astrological?startDate=${startDate}&endDate=${endDate}`
        );

        if (!response.ok) {
          throw new Error('Error al cargar eventos astrológicos');
        }

        const data = await response.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error('Error al obtener eventos astrológicos:', error);
        setError('No se pudieron cargar los eventos astrológicos');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentMonth]);

  // Generar días del mes
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysCount = lastDay.getDate();
    
    // Obtener día de la semana del primer día (0 = Domingo, 1 = Lunes, etc.)
    const firstDayOfWeek = firstDay.getDay();
    
    // Ajustar para que la semana comience en lunes (0 = Lunes, 6 = Domingo)
    const adjustedFirstDayOfWeek = (firstDayOfWeek + 6) % 7;
    
    const days = [];
    
    // Agregar días del mes anterior para completar la primera semana
    for (let i = 0; i < adjustedFirstDayOfWeek; i++) {
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      const day = prevMonthLastDay - adjustedFirstDayOfWeek + i + 1;
      days.push({
        date: new Date(year, month - 1, day),
        isCurrentMonth: false,
        hasEvents: false,
        events: []
      });
    }
    
    // Agregar días del mes actual
    for (let day = 1; day <= daysCount; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      
      // Encontrar eventos para este día
      const dayEvents = events.filter(event => {
        const eventDate = event.date || (event.startDate || '');
        return eventDate.startsWith(dateStr);
      });
      
      days.push({
        date,
        isCurrentMonth: true,
        hasEvents: dayEvents.length > 0,
        events: dayEvents
      });
    }
    
    // Agregar días del mes siguiente para completar la última semana
    const remainingDays = 7 - (days.length % 7 || 7);
    if (remainingDays < 7) {
      for (let day = 1; day <= remainingDays; day++) {
        days.push({
          date: new Date(year, month + 1, day),
          isCurrentMonth: false,
          hasEvents: false,
          events: []
        });
      }
    }
    
    return days;
  };

  // Cambiar al mes anterior
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const year = prev.getFullYear();
      const month = prev.getMonth();
      return new Date(year, month - 1, 1);
    });
  };

  // Cambiar al mes siguiente
  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const year = prev.getFullYear();
      const month = prev.getMonth();
      return new Date(year, month + 1, 1);
    });
  };

  // Obtener nombre del mes actual
  const getMonthName = () => {
    return currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  // Manejar clic en un día
  interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    hasEvents: boolean;
    events: AstronomicalEvent[];
  }

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    setSelectedEvents(day.events);
  };

  // Manejar clic en un evento
  const handleEventClick = (event: AstronomicalEvent) => {
    if (onEventClick) {
      onEventClick(event);
    }
  };

  // Obtener estilo para el indicador de evento según el tipo
  const getEventIndicatorStyle = (eventType: string) => {
    switch (eventType) {
      case 'LunarPhase':
        return 'bg-purple-500';
      case 'PlanetIngress':
        return 'bg-blue-500';
      case 'Retrograde':
        return 'bg-red-500';
      case 'Direct':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Obtener nombre corto del día de la semana
  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const days = getDaysInMonth();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cabecera del calendario */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 capitalize">
          {getMonthName()}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Mes anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Mes siguiente"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Calendario */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {dayNames.map((day, index) => (
            <div key={index} className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((day, index) => (
            <div
              key={index}
              className={`min-h-[100px] p-2 ${
                day.isCurrentMonth
                  ? day.date.toDateString() === new Date().toDateString()
                    ? 'bg-purple-50'
                    : 'bg-white'
                  : 'bg-gray-50 text-gray-400'
              } ${day.date.toDateString() === selectedDate?.toDateString() ? 'ring-2 ring-inset ring-purple-500' : ''}`}
              onClick={() => handleDayClick(day)}
            >
              <div className="font-medium text-sm mb-1">{day.date.getDate()}</div>
              {day.hasEvents && (
                <div className="space-y-1">
                  {day.events.slice(0, 3).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                    >
                      <span className={`h-2 w-2 rounded-full mr-1 ${getEventIndicatorStyle(event.type)}`}></span>
                      <span className="text-xs truncate">
                        {event.planet || event.phase || event.type}
                      </span>
                    </div>
                  ))}
                  {day.events.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{day.events.length - 3} más
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detalles del día seleccionado */}
      {selectedDate && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <h3 className="font-medium text-lg mb-2">
            {selectedDate.toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </h3>
          
          {selectedEvents.length === 0 ? (
            <p className="text-gray-500">No hay eventos astrológicos para este día.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {selectedEvents.map((event, index) => (
                <li key={index} className="py-3">
                  <div className="flex items-start">
                    <span className={`mt-1 h-3 w-3 rounded-full mr-2 ${getEventIndicatorStyle(event.type)}`}></span>
                    <div>
                      <div className="font-medium">
                        {event.type === 'LunarPhase' && event.phase && (
                          <>Luna {event.phase}</>
                        )}
                        {event.type === 'PlanetIngress' && event.planet && event.sign && (
                          <>{event.planet} ingresa en {event.sign}</>
                        )}
                        {event.type === 'Retrograde' && event.planet && (
                          <>{event.planet} comienza retrogradación</>
                        )}
                        {event.type === 'Direct' && event.planet && (
                          <>{event.planet} termina retrogradación</>
                        )}
                        {!event.phase && !event.planet && (
                          <>{event.type}</>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {event.description || 'Sin descripción disponible'}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}