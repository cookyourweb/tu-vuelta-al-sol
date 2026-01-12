import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/context/StyleContext';
import { Moon, Sun, Circle, Sparkles, Star, Calendar as CalendarIcon } from 'lucide-react';

// ============ CALENDARIO MENSUAL COMPLETO ESTILO MODERNO ============
// - Página completa A5 con bordes redondeados
// - Grid calendario en la parte superior
// - Eventos con explicaciones en la parte inferior
// - Si no caben los eventos, van en página aparte
// - Inspirado en calendarios imprimibles profesionales
// =====================================================================

interface EventoMes {
  dia: number;
  tipo: 'lunaNueva' | 'lunaLlena' | 'eclipse' | 'retrogrado' | 'ingreso' | 'especial' | 'cumpleanos';
  titulo: string;
  signo?: string;
  interpretacion?: string;
}

interface CalendarioCompletoModernoProps {
  monthDate: Date;
  mesNumero: number;
  nombreZodiaco: string;
  simboloZodiaco: string;
  temaDelMes: string;
  eventos: EventoMes[];
  birthday?: Date;
}

const diasSemana = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const generateCalendarWeeks = (monthDate: Date) => {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });

  const weeks: Date[][] = [];
  let currentDay = calendarStart;

  while (currentDay <= monthEnd || weeks.length < 5) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(currentDay);
      currentDay = addDays(currentDay, 1);
    }
    weeks.push(week);
    if (weeks.length >= 6) break;
  }

  return weeks;
};

const IconoEvento = ({ tipo, className = "w-4 h-4" }: { tipo: string; className?: string }) => {
  switch (tipo) {
    case 'lunaLlena': return <Circle className={className} fill="currentColor" />;
    case 'lunaNueva': return <Moon className={className} />;
    case 'eclipse': return <Sparkles className={className} />;
    case 'cumpleanos': return <Sun className={className} />;
    case 'retrogrado': return <span className="font-bold text-sm">℞</span>;
    case 'especial': return <Star className={className} fill="currentColor" />;
    default: return <Circle className={className} />;
  }
};

const getEventoColor = (tipo: string) => {
  switch (tipo) {
    case 'lunaLlena': return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'text-amber-500' };
    case 'lunaNueva': return { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', icon: 'text-indigo-500' };
    case 'eclipse': return { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: 'text-purple-500' };
    case 'cumpleanos': return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-500' };
    case 'retrogrado': return { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', icon: 'text-rose-500' };
    case 'ingreso': return { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', icon: 'text-teal-500' };
    case 'especial': return { bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-700', icon: 'text-fuchsia-500' };
    default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: 'text-gray-500' };
  }
};

const FooterLibro = ({ pagina }: { pagina?: number }) => {
  const { config } = useStyle();
  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-8 text-[10px]">
      <span className={`${config.iconSecondary} opacity-50`}>Tu Vuelta al Sol</span>
      {pagina && <span className={`${config.iconSecondary} opacity-50`}>{pagina}</span>}
      <span className={`${config.iconSecondary} opacity-50`}>☉</span>
    </div>
  );
};

// ============ PÁGINA PRINCIPAL: CALENDARIO DEL MES ============
export const CalendarioCompletoModerno: React.FC<CalendarioCompletoModernoProps> = ({
  monthDate,
  mesNumero,
  nombreZodiaco,
  simboloZodiaco,
  temaDelMes,
  eventos,
  birthday
}) => {
  const { config } = useStyle();
  const weeks = generateCalendarWeeks(monthDate);

  // Determinar cuántos eventos caben en la parte inferior
  const maxEventosEnPagina = 3;
  const eventosConInterpretacion = eventos.filter(e => e.interpretacion);
  const eventosPagina1 = eventosConInterpretacion.slice(0, maxEventosEnPagina);
  const eventosPagina2 = eventosConInterpretacion.slice(maxEventosEnPagina);

  return (
    <>
      {/* PÁGINA 1: Calendario + Primeros Eventos */}
      <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
        {/* Header con bordes redondeados */}
        <div className={`${config.headerBg} rounded-2xl p-4 mb-4 shadow-sm`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${config.badgePrimary} rounded-xl flex items-center justify-center`}>
                <span className={`text-2xl ${config.iconPrimary}`}>{simboloZodiaco}</span>
              </div>
              <div>
                <h1 className={`text-2xl font-display capitalize ${config.headerText}`}>
                  {format(monthDate, 'MMMM yyyy', { locale: es })}
                </h1>
                <p className={`text-xs ${config.headerText} opacity-70`}>{nombreZodiaco}</p>
              </div>
            </div>
            <div className={`text-right ${config.headerText}`}>
              <CalendarIcon className="w-6 h-6 opacity-50" />
            </div>
          </div>
          <div className={`mt-3 pt-3 border-t ${config.headerText} border-white/20`}>
            <p className={`text-sm italic ${config.headerText}`}>"{temaDelMes}"</p>
          </div>
        </div>

        {/* Grid del Calendario con bordes redondeados */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          {/* Headers días */}
          <div className={`grid grid-cols-7 ${config.badgeSecondary}`}>
            {diasSemana.map(dia => (
              <div key={dia} className="text-center text-xs font-bold py-2 border-r border-white/20 last:border-r-0">
                {dia}
              </div>
            ))}
          </div>

          {/* Semanas */}
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 border-b border-gray-100 last:border-b-0">
              {week.map((day, di) => {
                const isCurrentMonth = isSameMonth(day, monthDate);
                const dayNum = day.getDate();
                const evento = eventos.find(e => e.dia === dayNum);
                const isBirthday = birthday && isSameDay(day, new Date(monthDate.getFullYear(), birthday.getMonth(), birthday.getDate()));

                return (
                  <div
                    key={di}
                    className={`
                      min-h-[65px] p-2 border-r border-gray-100 last:border-r-0
                      ${!isCurrentMonth ? 'bg-gray-50/30' : 'bg-white'}
                      ${isBirthday ? config.highlightAccent + ' ' + 'rounded-lg m-0.5' : ''}
                      flex flex-col
                    `}
                  >
                    {/* Número del día */}
                    <div className="flex items-start justify-between mb-1">
                      <span className={`
                        text-sm font-bold
                        ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                        ${isBirthday ? config.iconAccent : ''}
                      `}>
                        {dayNum}
                      </span>
                      {(evento || isBirthday) && (
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          isBirthday ? config.iconAccent :
                          getEventoColor(evento!.tipo).icon
                        }`} style={{ backgroundColor: 'currentColor' }} />
                      )}
                    </div>

                    {/* Espacio para escribir - líneas sutiles */}
                    <div className="flex-1 flex flex-col justify-start gap-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="border-b border-gray-100"
                          style={{ height: '10px' }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Eventos con Interpretación (primeros 3) */}
        {eventosPagina1.length > 0 && (
          <div className="flex-1">
            <div className={`flex items-center gap-2 mb-3 ${config.iconPrimary}`}>
              <Sparkles className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase">Eventos del Mes</h3>
            </div>
            <div className="space-y-2">
              {eventosPagina1.map((evento, idx) => {
                const colors = getEventoColor(evento.tipo);
                return (
                  <div
                    key={idx}
                    className={`${colors.bg} ${colors.border} border rounded-xl p-3`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <IconoEvento tipo={evento.tipo} className={`w-4 h-4 ${colors.icon}`} />
                      <span className={`text-xs font-bold ${colors.text}`}>
                        Día {evento.dia}: {evento.titulo}
                      </span>
                    </div>
                    {evento.interpretacion && (
                      <p className={`text-xs ${colors.text} leading-relaxed`}>
                        {evento.interpretacion}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <FooterLibro pagina={mesNumero * 10} />
      </div>

      {/* PÁGINA 2: Eventos adicionales (si no cupieron) */}
      {eventosPagina2.length > 0 && (
        <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
          {/* Header */}
          <div className={`${config.headerBg} rounded-2xl p-4 mb-6 shadow-sm`}>
            <div className="flex items-center gap-3">
              <Sparkles className={`w-6 h-6 ${config.headerText}`} />
              <div>
                <h1 className={`text-xl font-display ${config.headerText}`}>
                  Eventos de {format(monthDate, 'MMMM', { locale: es })}
                </h1>
                <p className={`text-xs ${config.headerText} opacity-70`}>Continuación</p>
              </div>
            </div>
          </div>

          {/* Eventos restantes */}
          <div className="flex-1 space-y-3">
            {eventosPagina2.map((evento, idx) => {
              const colors = getEventoColor(evento.tipo);
              return (
                <div
                  key={idx}
                  className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-4`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <IconoEvento tipo={evento.tipo} className={`w-5 h-5 ${colors.icon}`} />
                    <span className={`text-sm font-bold ${colors.text}`}>
                      Día {evento.dia}: {evento.titulo}
                    </span>
                  </div>
                  {evento.interpretacion && (
                    <p className={`text-sm ${colors.text} leading-relaxed`}>
                      {evento.interpretacion}
                    </p>
                  )}
                  {/* Espacio para notas personales */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Mis notas:</p>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="border-b border-gray-200"
                        style={{ height: '20px', marginBottom: '8px' }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <FooterLibro pagina={mesNumero * 10 + 1} />
        </div>
      )}
    </>
  );
};

export default CalendarioCompletoModerno;
