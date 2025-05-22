// src/components/astrology/AstrologicalAgenda.tsx
'use client';

import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, isSameMonth, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';

interface AstronomicalEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'lunar_phase' | 'planetary_ingress' | 'retrograde' | 'direct' | 'aspect';
  importance: 'high' | 'medium' | 'low';
}

interface AstronomicalDay {
  date: Date;
  events: AstronomicalEvent[];
  isCurrentMonth: boolean;
}

interface AstronomicalAgendaProps {
  userId: string;
  initialMonth?: Date;
  birthDate?: string;
}

export default function AstrologicalAgenda({
  userId,
  initialMonth = new Date(),
  birthDate
}: AstronomicalAgendaProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(initialMonth);
  const [events, setEvents] = useState<AstronomicalEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState<AstronomicalEvent[]>([]);

  // Datos de ejemplo para demostración
  const sampleEvents: AstronomicalEvent[] = [
    {
      id: '1',
      date: format(new Date(), 'yyyy-MM-dd'),
      title: 'Luna Llena en Géminis',
      description: 'Luna llena que ilumina tus relaciones y comunicaciones. Buen momento para expresar tus sentimientos.',
      type: 'lunar_phase',
      importance: 'high'
    },
    {
      id: '2',
      date: format(addMonths(new Date(), 0), 'yyyy-MM-dd'),
      title: 'Mercurio entra en Capricornio',
      description: 'Mercurio en Capricornio trae pensamiento estructurado y práctico. Buen momento para planificación.',
      type: 'planetary_ingress',
      importance: 'medium'
    },
    {
      id: '3',
      date: format(addMonths(new Date(), 0), 'yyyy-MM-dd'),
      title: 'Mercurio Retrógrado comienza',
      description: 'Período de revisión y reconsideración. Cuidado con las comunicaciones y viajes.',
      type: 'retrograde',
      importance: 'high'
    },
    {
      id: '4',
      date: format(addMonths(subMonths(new Date(), 0), 0), 'yyyy-MM-15'),
      title: 'Venus entra en Acuario',
      description: 'Venus en Acuario trae un enfoque más independiente y original a las relaciones.',
      type: 'planetary_ingress',
      importance: 'medium'
    },
    {
      id: '5',
      date: format(addMonths(new Date(), 0), 'yyyy-MM-20'),
      title: 'Marte - Saturno Cuadratura',
      description: 'Tensión entre acción y restricción. Posibles frustraciones pero también disciplina productiva.',
      type: 'aspect',
      importance: 'medium'
    }
  ];

  // Cargar eventos para el mes actual
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // En un escenario real, aquí cargaríamos los eventos desde la API
        // const startDateStr = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
        // const endDateStr = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
        // const response = await fetch(`/api/events/astrological?startDate=${startDateStr}&endDate=${endDateStr}&userId=${userId}`);
        // const data = await response.json();
        // setEvents(data.events);
        
        // Usando eventos de ejemplo para demostración
        // Simulamos un pequeño retraso para mostrar el estado de carga
        setTimeout(() => {
          setEvents(sampleEvents);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error al cargar eventos astrológicos:', err);
        setError('No se pudieron cargar los eventos astrológicos. Por favor intenta de nuevo más tarde.');
        setLoading(false);
      }
    };
    
    loadEvents();
  }, [currentMonth, userId]);

  // Preparar días para el calendario
  const getDaysWithEvents = (): AstronomicalDay[] => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = monthStart;
    const endDate = monthEnd;
    
    // Obtener todos los días del intervalo
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Mapear eventos a los días
    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayEvents = events.filter(event => {
        return event.date === dateStr;
      });
      
      return {
        date: day,
        events: dayEvents,
        isCurrentMonth: isSameMonth(day, currentMonth)
      };
    });
  };

  // Obtener nombre del mes actual
  const getCurrentMonthName = (): string => {
    return format(currentMonth, 'LLLL yyyy', { locale: es });
  };

  // Cambiar al mes anterior
  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
    setSelectedDate(null);
  };

  // Cambiar al mes siguiente
  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
    setSelectedDate(null);
  };

  // Manejar clic en un día
  const handleDateClick = (day: AstronomicalDay) => {
    setSelectedDate(day.date);
    setSelectedDayEvents(day.events);
  };

  // Obtener color según tipo de evento
  const getEventColor = (eventType: string): string => {
    switch (eventType) {
      case 'lunar_phase':
        return 'bg-purple-500';
      case 'planetary_ingress':
        return 'bg-blue-500';
      case 'retrograde':
        return 'bg-red-500';
      case 'direct':
        return 'bg-green-500';
      case 'aspect':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Obtener nombre legible del tipo de evento
  const getEventTypeName = (eventType: string): string => {
    switch (eventType) {
      case 'lunar_phase':
        return 'Fase Lunar';
      case 'planetary_ingress':
        return 'Ingreso Planetario';
      case 'retrograde':
        return 'Retrogradación';
      case 'direct':
        return 'Directo';
      case 'aspect':
        return 'Aspecto';
      default:
        return 'Evento';
    }
  };

  // Generar días de la semana
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const days = getDaysWithEvents();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cabecera del calendario */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 capitalize">
          {getCurrentMonthName()}
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

      {/* Mensaje de datos de ejemplo */}
      <div className="bg-yellow-50 p-4 rounded-md mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Esta es una versión de demostración con eventos de ejemplo. Los eventos reales personalizados estarán disponibles próximamente.
            </p>
          </div>
        </div>
      </div>

      {/* Calendario */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {weekDays.map((day, index) => (
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
              className={`min-h-[5rem] p-2 ${
                day.isCurrentMonth
                  ? isSameDay(day.date, new Date())
                    ? 'bg-purple-50'
                    : 'bg-white'
                  : 'bg-gray-50 text-gray-400'
              } ${isSameDay(day.date, selectedDate || new Date(0)) ? 'ring-2 ring-inset ring-purple-500' : ''}`}
              onClick={() => handleDateClick(day)}
            >
              <div className="font-medium text-sm mb-1">{format(day.date, 'd')}</div>
              {day.events.length > 0 && (
                <div className="space-y-1">
                  {day.events.slice(0, 3).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="flex items-center"
                    >
                      <span className={`h-2 w-2 rounded-full mr-1 ${getEventColor(event.type)}`}></span>
                      <span className="text-xs truncate">
                        {event.title}
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
            {format(selectedDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
          </h3>
          
          {selectedDayEvents.length === 0 ? (
            <p className="text-gray-500">No hay eventos astrológicos para este día.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {selectedDayEvents.map((event, index) => (
                <li key={index} className="py-3">
                  <div className="flex items-start">
                    <span className={`mt-1 h-3 w-3 rounded-full mr-2 ${getEventColor(event.type)}`}></span>
                    <div>
                      <div className="font-medium text-gray-900">
                        {event.title}
                      </div>
                      <div className="text-xs text-purple-600 mb-1">
                        {getEventTypeName(event.type)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      {/* Leyenda */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow">
        <h3 className="font-medium text-lg mb-2">Leyenda</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full mr-2 bg-purple-500"></span>
            <span className="text-sm">Fase Lunar</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full mr-2 bg-blue-500"></span>
            <span className="text-sm">Ingreso Planetario</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full mr-2 bg-red-500"></span>
            <span className="text-sm">Retrogradación</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full mr-2 bg-green-500"></span>
            <span className="text-sm">Directo</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full mr-2 bg-yellow-500"></span>
            <span className="text-sm">Aspecto</span>
          </div>
        </div>
      </div>
    </div>
  );
}