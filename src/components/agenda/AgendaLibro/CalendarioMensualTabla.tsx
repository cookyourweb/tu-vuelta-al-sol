import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, isSameMonth, isSameDay, getWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/context/StyleContext';
import { Moon, Sun, Circle, Sparkles, Star } from 'lucide-react';

// ============ CALENDARIO TABLA LIMPIA ============
// - Formato de agenda profesional
// - Filas por semana
// - Máximo espacio horizontal por día
// - Estilo minimalista con bordes limpios
// ==================================================

interface EventoMes {
  dia: number;
  tipo: 'lunaNueva' | 'lunaLlena' | 'eclipse' | 'retrogrado' | 'ingreso' | 'especial' | 'cumpleanos';
  titulo: string;
  signo?: string;
}

interface CalendarioTablaProps {
  monthDate: Date;
  mesNumero: number;
  nombreZodiaco: string;
  simboloZodiaco: string;
  temaDelMes: string;
  eventos: EventoMes[];
  birthday?: Date;
}

const diasSemanaFull = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

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
    case 'retrogrado': return <span className="font-bold text-[10px]">℞</span>;
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

export const CalendarioMensualTabla: React.FC<CalendarioTablaProps> = ({
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
      {/* Header */}
      <div className="text-center mb-4 pb-3 border-b-2 border-gray-300">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className={`text-2xl ${config.iconPrimary}`}>{simboloZodiaco}</span>
          <h1 className={`text-2xl font-display capitalize ${config.titleGradient}`}>
            {format(monthDate, 'MMMM yyyy', { locale: es })}
          </h1>
        </div>
        <p className={`text-[10px] uppercase tracking-wider ${config.iconSecondary}`}>
          {nombreZodiaco}
        </p>
        <p className={`text-xs italic ${config.iconPrimary} mt-1`}>
          "{temaDelMes}"
        </p>
      </div>

      {/* Tabla de semanas */}
      <div className="flex-1 flex flex-col">
        {weeks.map((week, wi) => {
          const weekStart = week[0];
          const weekEnd = week[6];
          const isCurrentMonthWeek = isSameMonth(weekStart, monthDate) || isSameMonth(weekEnd, monthDate);

          if (!isCurrentMonthWeek) return null;

          return (
            <div key={wi} className="flex border-b border-gray-300 last:border-b-0" style={{ minHeight: '45mm' }}>
              {/* Columna izquierda: Info de semana */}
              <div className="w-16 flex-shrink-0 border-r border-gray-300 p-2 bg-gray-50/50">
                <div className="text-center">
                  <div className={`text-[9px] uppercase tracking-wider ${config.iconSecondary} mb-1`}>
                    Semana
                  </div>
                  <div className={`text-lg font-bold ${config.iconPrimary}`}>
                    {getWeek(weekStart, { weekStartsOn: 1 })}
                  </div>
                  <div className={`text-[8px] ${config.iconSecondary} mt-1`}>
                    {format(weekStart, 'd', { locale: es })}-{format(weekEnd, 'd MMM', { locale: es })}
                  </div>
                </div>
              </div>

              {/* Columna derecha: Días de la semana */}
              <div className="flex-1 grid grid-cols-7">
                {week.map((day, di) => {
                  const isCurrentMonth = isSameMonth(day, monthDate);
                  const dayNum = day.getDate();
                  const evento = eventos.find(e => e.dia === dayNum);
                  const isBirthday = birthday && isSameDay(day, new Date(monthDate.getFullYear(), birthday.getMonth(), birthday.getDate()));

                  return (
                    <div
                      key={di}
                      className={`
                        border-r border-gray-200 last:border-r-0 p-1.5 flex flex-col
                        ${!isCurrentMonth ? 'bg-gray-50/30' : ''}
                        ${isBirthday ? config.highlightAccent : ''}
                      `}
                    >
                      {/* Header del día */}
                      <div className="text-center mb-1">
                        <div className={`text-[8px] uppercase ${config.iconSecondary}`}>
                          {diasSemanaFull[di].slice(0, 3)}
                        </div>
                        <div className={`
                          text-base font-bold
                          ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                          ${isBirthday ? config.iconAccent : ''}
                        `}>
                          {dayNum}
                        </div>
                      </div>

                      {/* Evento si existe */}
                      {(evento || isBirthday) && (
                        <div className="flex items-center justify-center gap-0.5 mb-1">
                          <IconoEvento
                            tipo={isBirthday ? 'cumpleanos' : evento!.tipo}
                            className={`${isBirthday ? config.iconAccent : config.iconSecondary}`}
                          />
                        </div>
                      )}

                      {/* Espacio para escribir */}
                      <div className="flex-1 flex flex-col justify-start">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className="border-b border-gray-100"
                            style={{ height: '12px' }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <FooterLibro pagina={mesNumero * 10} />
    </div>
  );
};

export default CalendarioMensualTabla;
