'use client';

import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import EventInterpretationPrint from './EventInterpretationPrint';

interface MonthEvent {
  date: string | Date;
  type: string;
  sign?: string;
  signo?: string;
  description?: string;
  house?: number;
  interpretation?: any; // Interpretación personalizada del evento
}

interface MonthInterpretation {
  mes: string;
  portada_mes?: string;
  interpretacion_mensual?: string;
  ritual_del_mes?: string;
  mantra_mensual?: string;
}

interface MesPageProps {
  monthDate: Date;
  monthData?: {
    nombre: string;
    nombreCorto: string;
    lunas_nuevas: MonthEvent[];
    lunas_llenas: MonthEvent[];
    eclipses: MonthEvent[];
    ingresos_destacados: MonthEvent[];
    total_eventos: number;
  };
  interpretation?: MonthInterpretation;
  allEvents?: MonthEvent[];
  userName?: string; // Para personalizar interpretaciones
  eventInterpretations?: { [eventId: string]: any }; // Mapa de interpretaciones por evento
}

const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function MesPage({
  monthDate,
  monthData,
  interpretation,
  allEvents = [],
  userName,
  eventInterpretations = {}
}: MesPageProps) {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Calcular día de inicio (0 = domingo, ajustar a lunes = 0)
  const firstDayOfWeek = (getDay(monthStart) + 6) % 7; // Convertir a lunes = 0

  // Crear array de días con espacios vacíos al inicio
  const calendarDays = [
    ...Array(firstDayOfWeek).fill(null),
    ...daysInMonth
  ];

  // Encontrar eventos para cada día
  const getEventsForDay = (day: Date) => {
    return allEvents.filter(event => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, day);
    });
  };

  const monthName = format(monthDate, 'MMMM', { locale: es });
  const monthYear = format(monthDate, 'yyyy', { locale: es });

  return (
    <>
      {/* PORTADA DEL MES */}
      <div className="print-page bg-white p-12 flex flex-col justify-center">
        <div className="max-w-2xl mx-auto text-center">
          {/* Número del mes */}
          <div className="mb-6">
            <p className="font-display text-8xl text-cosmic-gold/20">
              {format(monthDate, 'MM', { locale: es })}
            </p>
          </div>

          {/* Nombre del mes */}
          <h2 className="font-display text-5xl text-cosmic-gold mb-4 capitalize">
            {monthName}
          </h2>
          <p className="font-display text-2xl text-gray-600 mb-8">
            {monthYear}
          </p>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto mb-8"></div>

          {/* Mensaje del mes */}
          {interpretation?.portada_mes && (
            <p className="font-body text-lg text-gray-700 leading-relaxed italic">
              "{interpretation.portada_mes}"
            </p>
          )}

          {/* Iconos de eventos destacados */}
          {monthData && (
            <div className="mt-12 flex justify-center space-x-6 text-sm text-gray-600">
              {monthData.eclipses.length > 0 && (
                <div className="text-center">
                  <span className="block text-2xl text-cosmic-gold mb-1">●</span>
                  <span className="font-body">Eclipse</span>
                </div>
              )}
              {monthData.lunas_nuevas.length > 0 && (
                <div className="text-center">
                  <span className="block text-2xl mb-1">☽</span>
                  <span className="font-body">{monthData.lunas_nuevas.length} Luna Nueva</span>
                </div>
              )}
              {monthData.lunas_llenas.length > 0 && (
                <div className="text-center">
                  <span className="block text-2xl mb-1">○</span>
                  <span className="font-body">{monthData.lunas_llenas.length} Luna Llena</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CALENDARIO DEL MES */}
      <div className="print-page bg-white p-12">
        <div className="max-w-5xl mx-auto">
          {/* Encabezado */}
          <div className="text-center mb-8">
            <h3 className="font-display text-3xl text-cosmic-gold capitalize">
              {monthName} {monthYear}
            </h3>
            <div className="w-16 h-1 bg-cosmic-gold/50 mx-auto mt-3"></div>
          </div>

          {/* Grid del calendario */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Días de la semana */}
            <div className="grid grid-cols-7 bg-cosmic-purple/5 border-b border-gray-300">
              {DAYS_OF_WEEK.map((day, idx) => (
                <div
                  key={idx}
                  className="text-center py-3 font-display text-sm text-gray-700 border-r border-gray-200 last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Días del mes */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                if (!day) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="aspect-square border-r border-b border-gray-200 bg-gray-50"
                    />
                  );
                }

                const dayEvents = getEventsForDay(day);
                const hasEvents = dayEvents.length > 0;

                return (
                  <div
                    key={idx}
                    className={`
                      aspect-square border-r border-b border-gray-200 p-2
                      ${hasEvents ? 'bg-cosmic-gold/5' : 'bg-white'}
                      ${idx % 7 === 6 ? 'border-r-0' : ''}
                    `}
                  >
                    <div className="flex flex-col h-full">
                      {/* Número del día */}
                      <div className={`
                        font-body text-sm mb-1
                        ${hasEvents ? 'text-cosmic-gold font-semibold' : 'text-gray-600'}
                      `}>
                        {format(day, 'd')}
                      </div>

                      {/* Indicadores de eventos */}
                      {hasEvents && (
                        <div className="flex flex-wrap gap-1">
                          {dayEvents.map((event, eventIdx) => (
                            <span
                              key={eventIdx}
                              className="text-xs"
                              title={event.description || event.type}
                            >
                              {getEventIcon(event.type)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leyenda de eventos */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm font-body text-gray-600">
            <div className="flex items-center">
              <span className="mr-2">☽</span>
              Luna Nueva
            </div>
            <div className="flex items-center">
              <span className="mr-2">○</span>
              Luna Llena
            </div>
            <div className="flex items-center">
              <span className="text-cosmic-gold mr-2">●</span>
              Eclipse
            </div>
            <div className="flex items-center">
              <span className="mr-2">↗</span>
              Ingreso
            </div>
            <div className="flex items-center">
              <span className="mr-2">℞</span>
              Retrógrado
            </div>
          </div>
        </div>
      </div>

      {/* INTERPRETACIÓN MENSUAL */}
      {interpretation?.interpretacion_mensual && (
        <div className="print-page bg-white p-12">
          <div className="max-w-3xl mx-auto">
            {/* Título */}
            <div className="text-center mb-12">
              <h3 className="font-display text-3xl text-cosmic-gold mb-4 capitalize">
                El Mensaje de {monthName}
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
            </div>

            {/* Contenido */}
            <div className="space-y-8">
              <p className="font-body text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {interpretation.interpretacion_mensual}
              </p>

              {/* Mantra del mes */}
              {interpretation.mantra_mensual && (
                <div className="bg-cosmic-purple/5 p-8 rounded-lg border border-cosmic-gold/20">
                  <h4 className="font-display text-lg text-cosmic-gold mb-4 text-center">
                    Mantra del Mes
                  </h4>
                  <p className="font-body text-xl text-gray-700 leading-relaxed italic text-center">
                    "{interpretation.mantra_mensual}"
                  </p>
                </div>
              )}

              {/* Ritual del mes */}
              {interpretation.ritual_del_mes && (
                <div className="border-l-4 border-cosmic-gold pl-6">
                  <h4 className="font-display text-xl text-gray-800 mb-4">
                    Ritual Sugerido
                  </h4>
                  <p className="font-body text-base text-gray-700 leading-relaxed whitespace-pre-line">
                    {interpretation.ritual_del_mes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EVENTOS DESTACADOS DEL MES */}
      {monthData && (monthData.lunas_nuevas.length > 0 || monthData.lunas_llenas.length > 0 || monthData.eclipses.length > 0) && (
        <div className="print-page bg-white p-12">
          <div className="max-w-3xl mx-auto">
            {/* Título */}
            <div className="text-center mb-12">
              <h3 className="font-display text-3xl text-cosmic-gold mb-4">
                Eventos Clave
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
            </div>

<div className="space-y-8">
              {/* Eclipses */}
              {monthData.eclipses.map((eclipse, idx) => {
                const eventDate = format(new Date(eclipse.fecha), 'yyyy-MM-dd');
                const eventId = `eclipse-${eventDate}`;
                const eventInterp = eventInterpretations[eventId];

                return (
                  <div key={`eclipse-${idx}`}>
                    {/* Resumen del Evento */}
                    <div className="border-l-4 border-cosmic-gold pl-6 py-4 bg-cosmic-gold/5">
                      <div className="flex items-start">
                        <span className="text-2xl text-cosmic-gold mr-3">●</span>
                        <div>
                          <h4 className="font-display text-xl text-gray-800 mb-2">
                            Eclipse en {eclipse.signo || 'signo'}
                          </h4>
                          <p className="font-body text-sm text-gray-600 mb-2">
                            {format(new Date(eclipse.fecha), "d 'de' MMMM", { locale: es })}
                          </p>
                          {eclipse.descripcion && (
                            <p className="font-body text-base text-gray-700 leading-relaxed">
                              {eclipse.descripcion}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Interpretación Personalizada (si existe) */}
                    {eventInterp && (
                      <EventInterpretationPrint
                        event={{
                          type: eclipse.tipo || 'eclipse',
                          date: eventDate,
                          sign: eclipse.signo,
                          house: eclipse.casa,
                          description: eclipse.descripcion
                        }}
                        interpretation={eventInterp}
                        userName={userName}
                      />
                    )}
                  </div>
                );
              })}

              {/* Lunas Nuevas */}
              {monthData.lunas_nuevas.map((luna, idx) => {
                const eventDate = format(new Date(luna.fecha), 'yyyy-MM-dd');
                // Generar eventId igual que en el modelo: luna_nueva_YYYY-MM-DD_signo
                const eventId = `luna_nueva_${eventDate}_${luna.signo?.toLowerCase()}`;
                const eventInterp = eventInterpretations[eventId];

                return (
                  <div key={`ln-${idx}`}>
                    {/* Resumen del Evento */}
                    <div className="border-l-4 border-gray-400 pl-6 py-3">
                      <div className="flex items-start">
                        <span className="text-2xl text-gray-600 mr-3">☽</span>
                        <div>
                          <h4 className="font-display text-lg text-gray-800 mb-1">
                            Luna Nueva en {luna.signo || 'signo'}
                          </h4>
                          <p className="font-body text-sm text-gray-600 mb-2">
                            {format(new Date(luna.fecha), "d 'de' MMMM", { locale: es })}
                          </p>
                          {luna.descripcion && (
                            <p className="font-body text-sm text-gray-700">
                              {luna.descripcion}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Interpretación Personalizada (si existe) */}
                    {eventInterp && (
                      <EventInterpretationPrint
                        event={{
                          type: 'luna_nueva',
                          date: eventDate,
                          sign: luna.signo,
                          house: luna.casa,
                          description: luna.descripcion
                        }}
                        interpretation={eventInterp}
                        userName={userName}
                      />
                    )}
                  </div>
                );
              })}

              {/* Lunas Llenas */}
              {monthData.lunas_llenas.map((luna, idx) => {
                const eventDate = format(new Date(luna.fecha), 'yyyy-MM-dd');
                // Generar eventId igual que en el modelo: luna_llena_YYYY-MM-DD_signo
                const eventId = `luna_llena_${eventDate}_${luna.signo?.toLowerCase()}`;
                const eventInterp = eventInterpretations[eventId];

                return (
                  <div key={`ll-${idx}`}>
                    {/* Resumen del Evento */}
                    <div className="border-l-4 border-cosmic-amber pl-6 py-3">
                      <div className="flex items-start">
                        <span className="text-2xl text-cosmic-amber mr-3">○</span>
                        <div>
                          <h4 className="font-display text-lg text-gray-800 mb-1">
                            Luna Llena en {luna.signo || 'signo'}
                          </h4>
                          <p className="font-body text-sm text-gray-600 mb-2">
                            {format(new Date(luna.fecha), "d 'de' MMMM", { locale: es })}
                          </p>
                          {luna.descripcion && (
                            <p className="font-body text-sm text-gray-700">
                              {luna.descripcion}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Interpretación Personalizada (si existe) */}
                    {eventInterp && (
                      <EventInterpretationPrint
                        event={{
                          type: 'luna_llena',
                          date: eventDate,
                          sign: luna.signo,
                          house: luna.casa,
                          description: luna.descripcion
                        }}
                        interpretation={eventInterp}
                        userName={userName}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* INTEGRACIÓN MENSUAL - Espacio para reflexión */}
      <div className="print-page bg-white p-12">
        <div className="max-w-3xl mx-auto">
          {/* Título */}
          <div className="text-center mb-12">
            <h3 className="font-display text-3xl text-cosmic-gold mb-4">
              Integración Mensual
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
          </div>

          <div className="space-y-8">
            {/* Preguntas de reflexión */}
            <div>
              <h4 className="font-display text-xl text-gray-800 mb-4">
                Al Final del Mes, Reflexiona:
              </h4>
              <ul className="space-y-3 font-body text-base text-gray-700">
                <li>• ¿Qué momentos significativos viví este mes?</li>
                <li>• ¿Cómo trabajé con las energías astrológicas?</li>
                <li>• ¿Qué patrones o tendencias observé en mí?</li>
                <li>• ¿Qué aprendizajes me llevo al próximo mes?</li>
              </ul>
            </div>

            {/* Espacio para escribir */}
            <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-8 min-h-[300px]">
              <h4 className="font-display text-lg text-cosmic-gold mb-4">
                Mis Reflexiones
              </h4>
              <div className="space-y-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="border-b border-gray-300"></div>
                ))}
              </div>
            </div>

            {/* Gratitud */}
            <div className="bg-cosmic-purple/5 p-6 rounded-lg border border-cosmic-gold/20">
              <h4 className="font-display text-lg text-cosmic-gold mb-3">
                Agradecimientos del Mes
              </h4>
              <p className="font-body text-sm text-gray-600 italic mb-3">
                Tres cosas por las que estoy agradecido/a este mes:
              </p>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start">
                    <span className="text-cosmic-gold mr-2">{i}.</span>
                    <div className="flex-1 border-b border-gray-300"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper: Obtener icono según tipo de evento
function getEventIcon(type: string): string {
  const icons: { [key: string]: string } = {
    'luna-nueva': '☽',
    'luna-llena': '○',
    'eclipse-solar': '●',
    'eclipse-lunar': '●',
    'ingreso': '↗',
    'retrogrado-inicio': '℞',
    'retrogrado-fin': 'D',
  };

  return icons[type] || '•';
}
