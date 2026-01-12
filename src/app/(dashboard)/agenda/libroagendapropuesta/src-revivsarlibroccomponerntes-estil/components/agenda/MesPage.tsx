import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, getDay } from "date-fns";
import { es } from "date-fns/locale";
import { useStyle } from "@/contexts/StyleContext";

const zodiacSigns = [
  { sign: "Aries", symbol: "♈", element: "Fuego" },
  { sign: "Tauro", symbol: "♉", element: "Tierra" },
  { sign: "Géminis", symbol: "♊", element: "Aire" },
  { sign: "Cáncer", symbol: "♋", element: "Agua" },
  { sign: "Leo", symbol: "♌", element: "Fuego" },
  { sign: "Virgo", symbol: "♍", element: "Tierra" },
  { sign: "Libra", symbol: "♎", element: "Aire" },
  { sign: "Escorpio", symbol: "♏", element: "Agua" },
  { sign: "Sagitario", symbol: "♐", element: "Fuego" },
  { sign: "Capricornio", symbol: "♑", element: "Tierra" },
  { sign: "Acuario", symbol: "♒", element: "Aire" },
  { sign: "Piscis", symbol: "♓", element: "Agua" },
];

const getZodiacForMonth = (month: number) => {
  const zodiacByMonth = [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8];
  return zodiacSigns[zodiacByMonth[month]];
};

interface MesPageProps {
  monthDate: Date;
  monthNumber: number;
  birthday?: Date;
}

// Generate only the weeks that contain days from this month
const generateCalendarWeeks = (monthDate: Date) => {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const weeks: Date[][] = [];
  let currentDay = calendarStart;
  
  while (currentDay <= calendarEnd) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(currentDay);
      currentDay = addDays(currentDay, 1);
    }
    weeks.push(week);
  }
  
  return weeks;
};

const weekDays = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

export const PortadaMes = ({ monthDate, monthNumber }: MesPageProps) => {
  const zodiac = getZodiacForMonth(monthDate.getMonth());
  const { config } = useStyle();
  
  return (
    <div className={`print-page flex flex-col items-center justify-center text-center p-12 relative overflow-hidden ${config.headerBg} ${config.pattern}`}>
      <div className="relative z-10 space-y-6">
        <span className={`${config.headerText} opacity-60 text-sm tracking-[0.3em] uppercase`}>
          Mes {monthNumber}
        </span>
        
        <div className={`${config.headerText} text-7xl`}>{zodiac.symbol}</div>
        
        <h2 className={`font-display text-5xl capitalize ${config.titleGradient}`}>
          {format(monthDate, "MMMM", { locale: es })}
        </h2>
        
        <p className="text-foreground/60">
          {format(monthDate, "yyyy", { locale: es })}
        </p>
        
        <div className={config.divider + " w-24 mx-auto"} />
        
        <div className="mt-8 space-y-4 max-w-md">
          <div className={`${config.highlightSecondary} rounded-lg p-4`}>
            <span className={`${config.iconSecondary} text-xs uppercase tracking-wider`}>Energía del mes</span>
            <div className="h-8 border-b border-dashed border-current/30 mt-2" />
          </div>
          
          <div className={`${config.highlightSecondary} rounded-lg p-4`}>
            <span className={`${config.iconSecondary} text-xs uppercase tracking-wider`}>Tema emocional</span>
            <div className="h-8 border-b border-dashed border-current/30 mt-2" />
          </div>
          
          <div className={`${config.highlightSecondary} rounded-lg p-4`}>
            <span className={`${config.iconSecondary} text-xs uppercase tracking-wider`}>Consejo clave</span>
            <div className="h-8 border-b border-dashed border-current/30 mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CalendarioMensualCompleto = ({ monthDate, monthNumber, birthday }: MesPageProps) => {
  const weeks = generateCalendarWeeks(monthDate);
  const zodiac = getZodiacForMonth(monthDate.getMonth());
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-background p-6 flex flex-col ${config.pattern}`}>
      {/* Header */}
      <div className="text-center mb-3">
        <h2 className={`font-display text-2xl capitalize flex items-center justify-center gap-2 ${config.titleGradient}`}>
          <span className="text-3xl">{zodiac.symbol}</span>
          {format(monthDate, "MMMM yyyy", { locale: es })}
        </h2>
      </div>
      
      {/* Calendar Grid */}
      <div className={`border rounded-lg overflow-hidden ${config.cardBorder}`}>
        {/* Week day headers */}
        <div className={`grid grid-cols-7 ${config.badgePrimary}`}>
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-bold py-2 border-r border-current/20 last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar weeks - dynamic height based on number of weeks */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-t border-current/20">
            {week.map((day, dayIndex) => {
              const isCurrentMonth = isSameMonth(day, monthDate);
              const isBirthday = birthday && isSameDay(day, new Date(monthDate.getFullYear(), birthday.getMonth(), birthday.getDate()));
              
              return (
                <div
                  key={dayIndex}
                  className={`
                    h-16 p-1 border-r border-current/10 last:border-r-0 flex flex-col
                    ${isCurrentMonth ? 'bg-background' : config.highlightPrimary}
                    ${isBirthday ? config.highlightAccent : ''}
                  `}
                >
                  <div className={`text-right text-sm font-medium ${isCurrentMonth ? 'text-foreground' : 'text-foreground/20'} ${isBirthday ? config.iconAccent + ' font-bold' : ''}`}>
                    {format(day, "d")}
                  </div>
                  
                  {isCurrentMonth && (
                    <div className="flex-1 mt-0.5 space-y-0.5 overflow-hidden">
                      {isBirthday && (
                        <div className={`text-[8px] ${config.iconAccent} flex items-center gap-0.5 ${config.highlightAccent} rounded px-0.5 truncate`}>
                          <span>☉</span><span>Cumple</span>
                        </div>
                      )}
                      {/* Placeholder for events */}
                      <div className="text-[8px] text-foreground/40 truncate"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Events summary below - more space */}
      <div className="mt-4 flex-1 grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className={`${config.highlightSecondary} rounded-lg p-4`}>
            <h4 className={`${config.iconSecondary} font-medium text-sm mb-3 flex items-center gap-2`}>
              <span className="text-lg">🌑</span> Luna Nueva
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex gap-2">
                <span className="text-foreground/50 w-14">Fecha:</span>
                <div className="flex-1 h-5 border-b border-dashed border-current/20" />
              </div>
              <div className="flex gap-2">
                <span className="text-foreground/50 w-14">Signo:</span>
                <div className="flex-1 h-5 border-b border-dashed border-current/20" />
              </div>
              <div className="flex gap-2">
                <span className="text-foreground/50 w-14">Tema:</span>
                <div className="flex-1 h-5 border-b border-dashed border-current/20" />
              </div>
            </div>
          </div>
          
          <div className={`${config.highlightSecondary} rounded-lg p-4`}>
            <h4 className={`${config.iconSecondary} font-medium text-sm mb-3 flex items-center gap-2`}>
              <span className="text-lg">🌕</span> Luna Llena
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex gap-2">
                <span className="text-foreground/50 w-14">Fecha:</span>
                <div className="flex-1 h-5 border-b border-dashed border-current/20" />
              </div>
              <div className="flex gap-2">
                <span className="text-foreground/50 w-14">Signo:</span>
                <div className="flex-1 h-5 border-b border-dashed border-current/20" />
              </div>
              <div className="flex gap-2">
                <span className="text-foreground/50 w-14">Tema:</span>
                <div className="flex-1 h-5 border-b border-dashed border-current/20" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className={`${config.highlightSecondary} rounded-lg p-4`}>
            <h4 className={`${config.iconSecondary} font-medium text-sm mb-3`}>Tránsitos importantes</h4>
            <div className="space-y-2">
              <div className="h-6 border-b border-dashed border-current/20" />
              <div className="h-6 border-b border-dashed border-current/20" />
              <div className="h-6 border-b border-dashed border-current/20" />
            </div>
          </div>
          
          <div className={`${config.highlightSecondary} rounded-lg p-4`}>
            <h4 className={`${config.iconSecondary} font-medium text-sm mb-3`}>Retrogradaciones</h4>
            <div className="space-y-2">
              <div className="h-6 border-b border-dashed border-current/20" />
              <div className="h-6 border-b border-dashed border-current/20" />
            </div>
          </div>
          
          <div className={`${config.highlightAccent} rounded-lg p-4`}>
            <h4 className={`${config.iconAccent} font-medium text-sm mb-2`}>Energía del mes</h4>
            <div className="h-10 border-b border-dashed border-current/30" />
          </div>
        </div>
      </div>
    </div>
  );
};

// New: Day detail pages (7 days per page)
export const DiasDelMes = ({ monthDate, birthday }: MesPageProps) => {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const daysInMonth: Date[] = [];
  const { config } = useStyle();
  
  let currentDay = monthStart;
  while (currentDay <= monthEnd) {
    daysInMonth.push(currentDay);
    currentDay = addDays(currentDay, 1);
  }
  
  // Split into pages of 7 days each
  const pages: Date[][] = [];
  for (let i = 0; i < daysInMonth.length; i += 7) {
    pages.push(daysInMonth.slice(i, i + 7));
  }
  
  return (
    <>
      {pages.map((pageDays, pageIndex) => (
        <div key={pageIndex} className={`print-page bg-background p-6 flex flex-col ${config.pattern}`}>
          <div className="text-center mb-4">
            <h3 className={`font-display text-lg capitalize ${config.titleGradient}`}>
              {format(monthDate, "MMMM yyyy", { locale: es })} — Días {format(pageDays[0], "d")} al {format(pageDays[pageDays.length - 1], "d")}
            </h3>
            <div className={config.divider + " w-12 mx-auto mt-2"} />
          </div>
          
          <div className="flex-1 space-y-2">
            {pageDays.map((day, dayIndex) => {
              const isBirthday = birthday && isSameDay(day, new Date(monthDate.getFullYear(), birthday.getMonth(), birthday.getDate()));
              const dayOfWeek = format(day, "EEEE", { locale: es });
              
              return (
                <div
                  key={dayIndex}
                  className={`
                    flex gap-3 p-3 rounded-lg
                    ${isBirthday 
                      ? config.highlightAccent 
                      : config.highlightPrimary
                    }
                  `}
                >
                  {/* Date column */}
                  <div className="w-16 flex-shrink-0 text-center">
                    <div className={`text-2xl font-display ${isBirthday ? config.iconAccent : 'text-foreground'}`}>
                      {format(day, "d")}
                    </div>
                    <div className="text-xs text-foreground/50 capitalize">{dayOfWeek}</div>
                    {isBirthday && <div className={`${config.iconAccent} text-sm mt-1`}>☉</div>}
                  </div>
                  
                  {/* Events column */}
                  <div className={`flex-1 border-l pl-3 ${config.cardBorder}`}>
                    <div className="flex gap-2 mb-1">
                      <span className="text-foreground/40 text-xs w-16">Evento:</span>
                      <div className="flex-1 h-4 border-b border-dashed border-current/15" />
                    </div>
                    <div className="flex gap-2 mb-1">
                      <span className="text-foreground/40 text-xs w-16">Lunar:</span>
                      <div className="flex-1 h-4 border-b border-dashed border-current/15" />
                    </div>
                    <div className="flex gap-2">
                      <span className="text-foreground/40 text-xs w-16">Notas:</span>
                      <div className="flex-1 h-4 border-b border-dashed border-current/15" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
};

export const InterpretacionMensual = ({ monthDate }: MesPageProps) => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-background p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-6">
        <h2 className={`font-display text-2xl ${config.titleGradient}`}>
          Interpretación del mes
        </h2>
        <p className="text-foreground/60 capitalize mt-1">
          {format(monthDate, "MMMM yyyy", { locale: es })}
        </p>
        <div className={config.divider + " w-16 mx-auto mt-3"} />
      </div>
      
      <div className="flex-1 space-y-6 max-w-2xl mx-auto w-full">
        <div className={`${config.highlightSecondary} rounded-lg p-6`}>
          <h4 className={`${config.iconSecondary} font-medium mb-3`}>Qué se activa</h4>
          <div className="space-y-3">
            <div className="h-16 border-b border-dashed border-current/20" />
            <div className="h-16 border-b border-dashed border-current/20" />
          </div>
        </div>
        
        <div className={`${config.highlightSecondary} rounded-lg p-6`}>
          <h4 className={`${config.iconSecondary} font-medium mb-3`}>Qué se mueve dentro</h4>
          <div className="space-y-3">
            <div className="h-16 border-b border-dashed border-current/20" />
            <div className="h-16 border-b border-dashed border-current/20" />
          </div>
        </div>
        
        <div className={`${config.highlightSecondary} rounded-lg p-6`}>
          <h4 className={`${config.iconSecondary} font-medium mb-3`}>Qué pide conciencia</h4>
          <div className="space-y-3">
            <div className="h-16 border-b border-dashed border-current/20" />
            <div className="h-16 border-b border-dashed border-current/20" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const RitualYMantraMes = ({ monthDate }: MesPageProps) => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-background p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-6">
        <span className={`${config.iconSecondary} text-3xl`}>✧</span>
        <h2 className={`font-display text-2xl mt-2 ${config.titleGradient}`}>
          Ritual y Mantra del mes
        </h2>
        <p className="text-foreground/60 capitalize mt-1">
          {format(monthDate, "MMMM", { locale: es })}
        </p>
        <div className={config.divider + " w-16 mx-auto mt-3"} />
      </div>
      
      <div className="flex-1 space-y-6 max-w-2xl mx-auto w-full">
        <div className={`${config.highlightSecondary} rounded-lg p-6`}>
          <h4 className={`${config.iconSecondary} font-medium mb-4`}>Ritual del mes</h4>
          <p className="text-foreground/60 text-sm italic mb-4">
            Si resuena contigo, pruébalo.
          </p>
          <div className="space-y-3">
            <div className="h-20 border-b border-dashed border-current/20" />
            <div className="h-20 border-b border-dashed border-current/20" />
            <div className="h-20" />
          </div>
        </div>
        
        <div className={`${config.headerBg} rounded-lg p-6 text-center`}>
          <h4 className={`${config.headerText} font-medium mb-4`}>Mantra del mes</h4>
          <div className="h-20 border-b border-dashed border-current/30" />
          <p className={`${config.headerText} opacity-50 text-xs mt-4 italic`}>
            Repítelo cuando lo necesites.
          </p>
        </div>
      </div>
    </div>
  );
};

export const IntencionMes = ({ monthDate }: MesPageProps) => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-background p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-6">
        <h2 className={`font-display text-2xl ${config.titleGradient}`}>
          Cómo quiero vivir este mes
        </h2>
        <p className="text-foreground/60 capitalize mt-1">
          {format(monthDate, "MMMM yyyy", { locale: es })}
        </p>
        <div className={config.divider + " w-16 mx-auto mt-3"} />
      </div>
      
      <div className="flex-1 max-w-2xl mx-auto w-full">
        <p className="text-foreground/60 text-center mb-8 text-sm italic">
          No es una lista de tareas. Es una brújula emocional.
        </p>
        
        <div className={`${config.highlightPrimary} rounded-lg p-8`}>
          <div className="space-y-6">
            <div className="h-20 border-b border-dashed border-current/20" />
            <div className="h-20 border-b border-dashed border-current/20" />
            <div className="h-20 border-b border-dashed border-current/20" />
            <div className="h-20 border-b border-dashed border-current/20" />
            <div className="h-20 border-b border-dashed border-current/20" />
            <div className="h-20" />
          </div>
        </div>
      </div>
    </div>
  );
};
