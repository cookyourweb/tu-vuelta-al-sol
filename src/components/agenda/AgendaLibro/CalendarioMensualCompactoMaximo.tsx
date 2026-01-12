import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/context/StyleContext';
import { Moon, Sun, Circle, Sparkles, Star } from 'lucide-react';

// ============ CALENDARIO COMPACTO CON MÁXIMO ESPACIO ============
// - Ocupa exactamente una hoja A5
// - Grid perfectamente ajustado
// - 3-4 líneas por día
// - Sin headers grandes, todo compacto
// ================================================================

interface EventoMes {
  dia: number;
  tipo: 'lunaNueva' | 'lunaLlena' | 'eclipse' | 'retrogrado' | 'ingreso' | 'especial' | 'cumpleanos';
  titulo: string;
  signo?: string;
}

interface CalendarioCompactoMaximoProps {
  monthDate: Date;
  mesNumero: number;
  nombreZodiaco: string;
  simboloZodiaco: string;
  eventos: EventoMes[];
  birthday?: Date;
}

const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

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

const IconoEvento = ({ tipo, className = "w-2 h-2" }: { tipo: string; className?: string }) => {
  switch (tipo) {
    case 'lunaLlena': return <Circle className={className} fill="currentColor" />;
    case 'lunaNueva': return <Moon className={className} />;
    case 'eclipse': return <Sparkles className={className} />;
    case 'cumpleanos': return <Sun className={className} />;
    case 'retrogrado': return <span className="font-bold text-[8px]">℞</span>;
    case 'especial': return <Star className={className} fill="currentColor" />;
    default: return <Circle className={className} />;
  }
};

const FooterLibro = ({ pagina }: { pagina?: number }) => {
  const { config } = useStyle();
  return (
    <div className="absolute bottom-3 left-0 right-0 flex justify-between items-center px-6 text-[9px]">
      <span className={`${config.iconSecondary} opacity-40`}>Tu Vuelta al Sol</span>
      {pagina && <span className={`${config.iconSecondary} opacity-40`}>{pagina}</span>}
      <span className={`${config.iconSecondary} opacity-40`}>☉</span>
    </div>
  );
};

export const CalendarioMensualCompactoMaximo: React.FC<CalendarioCompactoMaximoProps> = ({
  monthDate,
  mesNumero,
  nombreZodiaco,
  simboloZodiaco,
  eventos,
  birthday
}) => {
  const { config } = useStyle();
  const weeks = generateCalendarWeeks(monthDate);

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '12mm' }}>
      {/* Header ultra compacto */}
      <div className="flex items-center justify-between border-b border-gray-300 pb-1.5 mb-2">
        <div className="flex items-center gap-1.5">
          <span className={`text-lg ${config.iconPrimary}`}>{simboloZodiaco}</span>
          <h1 className={`text-base font-display capitalize ${config.titleGradient}`}>
            {format(monthDate, 'MMMM yyyy', { locale: es })}
          </h1>
        </div>
        <span className={`text-[8px] uppercase tracking-wider ${config.iconSecondary}`}>
          {nombreZodiaco}
        </span>
      </div>

      {/* Headers días - MUY compactos */}
      <div className={`grid grid-cols-7 ${config.badgePrimary} mb-0.5`}>
        {weekDays.map(day => (
          <div key={day} className="text-center text-[8px] font-bold py-0.5">
            {day}
          </div>
        ))}
      </div>

      {/* Calendario Grid - TODO EL ESPACIO RESTANTE */}
      <div className="flex-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 h-full" style={{ minHeight: `${100 / weeks.length}%` }}>
            {week.map((day, di) => {
              const isCurrentMonth = isSameMonth(day, monthDate);
              const dayNum = day.getDate();
              const evento = eventos.find(e => e.dia === dayNum);
              const isBirthday = birthday && isSameDay(day, new Date(monthDate.getFullYear(), birthday.getMonth(), birthday.getDate()));

              return (
                <div
                  key={di}
                  className={`
                    border-r border-b border-gray-200 last:border-r-0
                    flex flex-col p-1
                    ${!isCurrentMonth ? 'bg-gray-50/20' : ''}
                    ${isBirthday ? config.highlightAccent : ''}
                  `}
                >
                  {/* Número del día */}
                  <div className="flex items-start justify-between mb-0.5">
                    <span className={`
                      text-xs font-bold leading-none
                      ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                      ${isBirthday ? config.iconAccent : ''}
                    `}>
                      {dayNum}
                    </span>
                    {(evento || isBirthday) && (
                      <IconoEvento
                        tipo={isBirthday ? 'cumpleanos' : evento!.tipo}
                        className={`${isBirthday ? config.iconAccent : config.iconSecondary}`}
                      />
                    )}
                  </div>

                  {/* LÍNEAS PARA ESCRIBIR - 4 líneas muy compactas */}
                  <div className="flex-1 flex flex-col justify-start">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="border-b border-gray-100"
                        style={{ height: '11px' }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <FooterLibro pagina={mesNumero * 10} />
    </div>
  );
};

export default CalendarioMensualCompactoMaximo;
