import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/context/StyleContext';
import { Moon, Sun, Circle, Sparkles, Star } from 'lucide-react';

// ============ TIPOS ============
interface EventoMes {
  dia: number;
  tipo: 'lunaNueva' | 'lunaLlena' | 'eclipse' | 'retrogrado' | 'ingreso' | 'especial' | 'cumpleanos';
  titulo: string;
  signo?: string;
}

interface CalendarioMensualEscrituraProps {
  monthDate: Date;
  mesNumero: number;
  nombreZodiaco: string;
  simboloZodiaco: string;
  temaDelMes: string;
  eventos: EventoMes[];
  birthday?: Date;
}

// ============ UTILIDADES ============
const weekDays = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

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

const IconoEvento = ({ tipo, className = "w-3 h-3" }: { tipo: string; className?: string }) => {
  switch (tipo) {
    case 'lunaLlena': return <Circle className={className} fill="currentColor" />;
    case 'lunaNueva': return <Moon className={className} />;
    case 'eclipse': return <Sparkles className={className} />;
    case 'cumpleanos': return <Sun className={className} />;
    case 'retrogrado': return <span className={`${className} font-bold`}>℞</span>;
    case 'especial': return <Star className={className} fill="currentColor" />;
    default: return <Circle className={className} />;
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

// ============ CALENDARIO MENSUAL CON ESPACIO PARA ESCRIBIR ============
export const CalendarioMensualEscritura: React.FC<CalendarioMensualEscrituraProps> = ({
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

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header compacto */}
      <div className="flex items-center justify-between border-b-2 border-gray-300 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-2xl ${config.iconPrimary}`}>{simboloZodiaco}</span>
          <div>
            <h1 className={`text-xl font-display capitalize ${config.titleGradient}`}>
              {format(monthDate, 'MMMM yyyy', { locale: es })}
            </h1>
            <span className={`text-[9px] uppercase tracking-wider ${config.iconSecondary}`}>
              {nombreZodiaco}
            </span>
          </div>
        </div>
        <div className="text-right max-w-[180px]">
          <p className={`text-[10px] italic ${config.iconPrimary}`}>"{temaDelMes}"</p>
        </div>
      </div>

      {/* Headers días de la semana */}
      <div className={`grid grid-cols-7 ${config.badgePrimary}`}>
        {weekDays.map(day => (
          <div key={day} className="text-center text-[9px] font-bold py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendario Grid - MÁXIMO ESPACIO PARA ESCRIBIR */}
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
                    flex flex-col p-1.5
                    ${!isCurrentMonth ? 'bg-gray-50/30' : ''}
                    ${isBirthday ? config.highlightAccent : ''}
                    ${evento && !isBirthday ? 'bg-blue-50/20' : ''}
                  `}
                >
                  {/* Header del día: número + evento si existe */}
                  <div className="flex items-start justify-between mb-1">
                    <span className={`
                      text-sm font-bold
                      ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                      ${isBirthday ? config.iconAccent : ''}
                    `}>
                      {dayNum}
                    </span>
                    {(evento || isBirthday) && (
                      <div className="flex items-center gap-0.5">
                        <IconoEvento
                          tipo={isBirthday ? 'cumpleanos' : evento!.tipo}
                          className={`w-2.5 h-2.5 ${isBirthday ? config.iconAccent : config.iconSecondary}`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Nombre del evento (si existe) */}
                  {evento && !isBirthday && (
                    <div className={`text-[7px] ${config.iconSecondary} mb-1 leading-tight`}>
                      {evento.titulo}
                    </div>
                  )}
                  {isBirthday && (
                    <div className={`text-[7px] ${config.iconAccent} font-bold mb-1`}>
                      RETORNO SOLAR
                    </div>
                  )}

                  {/* ESPACIO PARA ESCRIBIR - Líneas sutiles */}
                  <div className="flex-1 flex flex-col justify-start">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="border-b border-gray-100"
                        style={{ height: '14px' }}
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

export default CalendarioMensualEscritura;
