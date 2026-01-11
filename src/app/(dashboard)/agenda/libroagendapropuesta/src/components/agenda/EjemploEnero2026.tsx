import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Moon, Sun, Target, Heart, Compass, Flame, 
  Sparkles, PenLine, BookOpen, Calendar, 
  CheckCircle2, Circle, ArrowRight, Lightbulb,
  Star, Zap, Waves, TreePine, Mountain
} from "lucide-react";
import { useStyle } from "@/contexts/StyleContext";

// ENERO 2026 - EJEMPLO COMPLETO

// ============ 1. APERTURA DEL MES (2 páginas) ============

export const AperturaEneroIzquierda = () => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-white p-10 flex flex-col relative overflow-hidden ${config.pattern}`}>
      {/* Background decorative elements */}
      <div className="absolute top-8 right-8 opacity-[0.08]">
        <Mountain className={`w-32 h-32 ${config.iconPrimary}`} />
      </div>
      <div className="absolute bottom-12 left-8 opacity-[0.08]">
        <TreePine className={`w-24 h-24 ${config.iconAccent}`} />
      </div>
      
      {/* Header */}
      <div className="text-center mb-6 relative z-10">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className={`${config.badgePrimary} px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide`}>
            <Calendar className="w-3 h-3 inline mr-1" />
            Mes 1
          </span>
        </div>
        <h1 className={`font-display text-5xl ${config.titleGradient} mt-2`}>ENERO 2026</h1>
        <div className="flex items-center justify-center gap-3 mt-4">
          <Star className={`w-5 h-5 ${config.iconSecondary}`} fill="currentColor" />
          <span className={`text-4xl ${config.iconSecondary}`}>♑</span>
          <Star className={`w-5 h-5 ${config.iconSecondary}`} fill="currentColor" />
        </div>
        <div className={`${config.divider} w-40 mx-auto mt-5`} />
      </div>

      {/* El mapa del mes */}
      <div className="flex-1 space-y-4 relative z-10">
        <div className="text-center mb-4">
          <h2 className={`font-display text-xl tracking-wide flex items-center justify-center gap-3 ${config.titleGradient}`}>
            <Compass className={`w-6 h-6 ${config.iconSecondary}`} />
            EL MAPA DEL MES
            <Compass className={`w-6 h-6 ${config.iconSecondary}`} />
          </h2>
        </div>

        <div className={`${config.cardBg} ${config.cardBorder} ${config.cardAccent} rounded-xl p-5`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-full ${config.headerBg} flex items-center justify-center`}>
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3 className={`${config.iconPrimary} text-sm uppercase tracking-wider font-bold`}>Tema central del mes</h3>
          </div>
          <p className="text-gray-800 text-lg leading-relaxed pl-[52px] font-medium">
            Ordenar tu energía antes de exigir resultados.
          </p>
        </div>

        <div className={`${config.highlightAccent} rounded-xl p-5`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-full ${config.badgeAccent} flex items-center justify-center`}>
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h3 className={`${config.iconAccent} text-sm uppercase tracking-wider font-bold`}>Sensación emocional</h3>
          </div>
          <p className="text-gray-800 leading-relaxed pl-[52px]">
            Necesidad de empezar bien, pero sin repetir viejos automatismos.
          </p>
        </div>

        <div className={`${config.highlightSecondary} rounded-xl p-5`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-full ${config.badgeSecondary} flex items-center justify-center`}>
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h3 className={`${config.iconSecondary} text-sm uppercase tracking-wider font-bold`}>Pregunta guía</h3>
          </div>
          <p className="text-gray-800 text-lg italic leading-relaxed pl-[52px] font-medium">
            "¿Desde dónde estoy arrancando este año: desde la exigencia o desde la coherencia?"
          </p>
        </div>
      </div>
    </div>
  );
};

export const AperturaEneroDerecha = () => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-white p-10 flex flex-col relative overflow-hidden ${config.pattern}`}>
      {/* Background */}
      <div className="absolute top-12 left-8 opacity-[0.08]">
        <Waves className={`w-28 h-28 ${config.iconAccent}`} />
      </div>
      
      {/* Header */}
      <div className="text-center mb-6 relative z-10">
        <h2 className={`font-display text-xl tracking-wide flex items-center justify-center gap-3 ${config.titleGradient}`}>
          <Sparkles className={`w-6 h-6 ${config.iconAccent}`} />
          QUÉ SE MUEVE ESTE MES
          <Sparkles className={`w-6 h-6 ${config.iconAccent}`} />
        </h2>
        <p className="text-gray-500 text-sm mt-2">Visión general de los eventos</p>
        <div className={`${config.divider} w-24 mx-auto mt-4`} />
      </div>

      {/* Eventos principales */}
      <div className="flex-1 space-y-4 relative z-10">
        <div className={`${config.highlightPrimary} rounded-xl p-5 shadow-lg`}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-full ${config.headerBg} flex items-center justify-center shadow-lg`}>
              <Moon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className={`${config.iconPrimary} font-bold text-lg`}>Luna Nueva en Capricornio</h3>
              <span className={`${config.badgeSecondary} px-3 py-1 rounded-full text-xs font-semibold mt-1 inline-block`}>6 de enero</span>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed pl-[72px]">
            Inicio consciente en estructura, responsabilidad y dirección.
          </p>
        </div>

        <div className={`${config.highlightSecondary} rounded-xl p-5 shadow-lg`}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-full ${config.badgeSecondary} flex items-center justify-center shadow-lg`}>
              <Sun className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className={`${config.iconSecondary} font-bold text-lg`}>Luna Llena en Cáncer</h3>
              <span className={`${config.badgeAccent} px-3 py-1 rounded-full text-xs font-semibold mt-1 inline-block`}>21 de enero</span>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed pl-[72px]">
            Culminación emocional, límites familiares y autocuidado.
          </p>
        </div>

        <div className={`${config.highlightAccent} rounded-xl p-5`}>
          <div className="flex items-center gap-3 mb-4">
            <Zap className={`w-6 h-6 ${config.iconAccent}`} />
            <h3 className={`${config.iconAccent} text-sm uppercase tracking-wider font-bold`}>Eje activado</h3>
          </div>
          <div className="space-y-3 pl-9">
            <div className="flex items-center gap-3">
              <span className={`${config.badgePrimary} px-3 py-1 rounded-full text-xs font-semibold`}>Casa 10</span>
              <ArrowRight className={`w-4 h-4 ${config.iconSecondary}`} />
              <span className="text-gray-800 font-medium">Dirección, propósito, responsabilidad</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`${config.badgeAccent} px-3 py-1 rounded-full text-xs font-semibold`}>Casa 4</span>
              <ArrowRight className={`w-4 h-4 ${config.iconSecondary}`} />
              <span className="text-gray-800 font-medium">Base emocional, hogar interno</span>
            </div>
          </div>
        </div>

        <div className={`text-center mt-4 p-4 ${config.highlightSecondary} rounded-xl`}>
          <p className="text-gray-700 text-sm italic font-medium">
            ✨ Este mes te pide equilibrar lo que construyes afuera con lo que sientes adentro ✨
          </p>
        </div>
      </div>
    </div>
  );
};

// ============ 2. CALENDARIO VISUAL (2 páginas) ============

const weekDays = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

const enero2026Events: Record<number, { icon: React.ReactNode; label: string; color: string; bgColor: string }> = {
  6: { icon: <Moon className="w-5 h-5" />, label: "Inicio", color: "text-white", bgColor: "bg-gradient-to-br from-primary to-cosmic-violet" },
  21: { icon: <Sun className="w-5 h-5" />, label: "Cierre", color: "text-white", bgColor: "bg-gradient-to-br from-cosmic-gold to-cosmic-amber" },
};

const generateEnero2026Weeks = () => {
  const monthDate = new Date(2026, 0, 1);
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

export const CalendarioVisualEnero = () => {
  const { config } = useStyle();
  const weeks = generateEnero2026Weeks();
  const monthDate = new Date(2026, 0, 1);

  return (
    <div className={`print-page bg-white p-8 flex flex-col relative overflow-hidden ${config.pattern}`}>
      {/* Decorative background */}
      <div className="absolute top-4 right-4 opacity-[0.05]">
        <Calendar className={`w-48 h-48 ${config.iconPrimary}`} />
      </div>
      
      {/* Header */}
      <div className="text-center mb-4 relative z-10">
        <div className="flex items-center justify-center gap-4">
          <Star className={`w-6 h-6 ${config.iconSecondary}`} fill="currentColor" />
          <h2 className={`font-display text-3xl ${config.titleGradient}`}>
            ENERO 2026
          </h2>
          <Star className={`w-6 h-6 ${config.iconSecondary}`} fill="currentColor" />
        </div>
        <p className="text-gray-500 text-sm mt-2 flex items-center justify-center gap-2">
          <span className={`text-2xl ${config.iconSecondary}`}>♑</span>
          Calendario visual
        </p>
        <div className={`${config.divider} w-32 mx-auto mt-3`} />
      </div>
      
      {/* Calendar Grid */}
      <div className="flex-1 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 relative z-10">
        {/* Week day headers */}
        <div className={`grid grid-cols-7 ${config.headerBg}`}>
          {weekDays.map((day) => (
            <div key={day} className={`text-center ${config.headerText} text-sm font-bold py-3 border-r border-white/20 last:border-r-0`}>
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar weeks */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-t border-gray-200" style={{ height: 'calc((100% - 44px) / 5)' }}>
            {week.map((day, dayIndex) => {
              const isCurrentMonth = isSameMonth(day, monthDate);
              const dayNum = day.getDate();
              const event = isCurrentMonth ? enero2026Events[dayNum] : null;
              const isWeekend = dayIndex >= 5;
              
              return (
                <div
                  key={dayIndex}
                  className={`
                    p-2 border-r border-gray-100 last:border-r-0 flex flex-col
                    ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                    ${isWeekend && isCurrentMonth ? 'bg-gray-50' : ''}
                    ${event ? config.highlightSecondary : ''}
                  `}
                >
                  <div className={`
                    text-lg font-bold 
                    ${isCurrentMonth ? 'text-gray-800' : 'text-gray-300'} 
                    ${event ? config.iconPrimary : ''}
                    ${isWeekend && isCurrentMonth && !event ? config.iconAccent : ''}
                  `}>
                    {format(day, "d")}
                  </div>
                  
                  {event && (
                    <div className="flex-1 flex flex-col justify-center items-center mt-1">
                      <div className={`w-8 h-8 rounded-full ${event.bgColor} flex items-center justify-center shadow-lg`}>
                        <div className={event.color}>{event.icon}</div>
                      </div>
                      <span className={`text-xs ${config.iconPrimary} mt-1 text-center leading-tight font-bold`}>{event.label}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p className="text-center text-gray-400 text-xs mt-3 italic relative z-10">
        Solo mapa visual • La interpretación viene en las siguientes páginas
      </p>
    </div>
  );
};

// ============ 3. INTERPRETACIÓN PERSONAL (2-3 páginas) ============

export const InterpretacionLunaNuevaEnero = () => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-white p-10 flex flex-col relative overflow-hidden ${config.pattern}`}>
      {/* Background */}
      <div className="absolute bottom-8 right-8 opacity-[0.08]">
        <Moon className={`w-56 h-56 ${config.iconPrimary}`} />
      </div>
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className={`w-18 h-18 rounded-full ${config.headerBg} flex items-center justify-center shadow-lg p-4`}>
          <Moon className="w-10 h-10 text-white" />
        </div>
        <div>
          <h2 className={`font-display text-2xl ${config.titleGradient}`}>Luna Nueva</h2>
          <span className={`${config.badgeSecondary} px-3 py-1 rounded-full text-xs font-semibold mt-1 inline-block`}>6 de enero de 2026</span>
        </div>
      </div>

      <div className={`${config.divider} w-full mb-6 relative z-10`} />

      {/* Content */}
      <div className="flex-1 space-y-4 relative z-10">
        <div className={`${config.cardBg} ${config.cardBorder} ${config.cardAccent} rounded-xl p-5`}>
          <div className="flex items-center gap-3 mb-2">
            <Compass className={`w-5 h-5 ${config.iconSecondary}`} />
            <h3 className={`${config.iconSecondary} font-bold`}>Dónde cae en tu carta</h3>
          </div>
          <div className="flex items-center gap-3 pl-8">
            <span className={`${config.badgePrimary} px-3 py-1 rounded-full text-xs font-semibold`}>Casa 10</span>
            <span className="text-gray-800 font-medium">Dirección vital, propósito, responsabilidad</span>
          </div>
        </div>

        <div className={`${config.highlightSecondary} rounded-xl p-5`}>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className={`w-5 h-5 ${config.iconSecondary}`} />
            <h3 className={`${config.iconSecondary} font-bold`}>Qué es</h3>
          </div>
          <p className="text-gray-800 leading-relaxed pl-8">
            Una Luna Nueva marca un inicio interno. No se ve todavía afuera.
          </p>
        </div>

        <div className={`${config.highlightAccent} rounded-xl p-5`}>
          <div className="flex items-center gap-3 mb-2">
            <Flame className={`w-5 h-5 ${config.iconAccent}`} />
            <h3 className={`${config.iconAccent} font-bold`}>Qué activa en ti</h3>
          </div>
          <p className="text-gray-800 leading-relaxed pl-8">
            Activa tu relación con el "tengo que" y el "quiero construir".
          </p>
        </div>

        <div className={`${config.highlightPrimary} rounded-xl p-5`}>
          <div className="flex items-center gap-3 mb-2">
            <Lightbulb className={`w-5 h-5 ${config.iconPrimary}`} />
            <h3 className={`${config.iconPrimary} font-bold`}>Por qué es importante para ti</h3>
          </div>
          <p className="text-gray-800 leading-relaxed pl-8">
            Tu carta natal muestra una tendencia a cargarte de responsabilidad emocional antes de tiempo. 
            Esta Luna te pide redefinir qué es compromiso y qué es autoexigencia heredada.
          </p>
        </div>

        <div className={`${config.cardBg} ${config.cardBorder} rounded-xl p-5`}>
          <div className="flex items-center gap-3 mb-3">
            <Heart className={`w-5 h-5 ${config.iconAccent}`} />
            <h3 className={`${config.iconAccent} font-bold`}>Cómo puedes sentirlo</h3>
          </div>
          <ul className="text-gray-800 space-y-2 pl-8">
            <li className="flex items-center gap-3"><Circle className={`w-3 h-3 ${config.iconSecondary}`} fill="currentColor" /> Ganas de organizar</li>
            <li className="flex items-center gap-3"><Circle className={`w-3 h-3 ${config.iconAccent}`} fill="currentColor" /> Presión por "arrancar bien"</li>
            <li className="flex items-center gap-3"><Circle className={`w-3 h-3 ${config.iconPrimary}`} fill="currentColor" /> Pensamientos sobre futuro y decisiones</li>
          </ul>
        </div>

        <div className={`${config.highlightPrimary} ${config.cardBorder} rounded-xl p-5`}>
          <div className="flex items-center gap-3 mb-2">
            <Target className={`w-5 h-5 ${config.iconPrimary}`} />
            <h3 className={`${config.iconPrimary} font-bold`}>Uso consciente</h3>
          </div>
          <p className="text-gray-800 font-bold pl-8 text-lg">
            No tomes decisiones definitivas aún. Define INTENCIONES, no obligaciones.
          </p>
        </div>
      </div>
    </div>
  );
};

export const InterpretacionLunaLlenaEnero = () => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-white p-10 flex flex-col relative overflow-hidden ${config.pattern}`}>
      {/* Background */}
      <div className="absolute bottom-8 right-8 opacity-[0.08]">
        <Sun className={`w-56 h-56 ${config.iconSecondary}`} />
      </div>
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className={`w-18 h-18 rounded-full ${config.badgeSecondary} flex items-center justify-center shadow-lg p-4`}>
          <Sun className="w-10 h-10 text-white" />
        </div>
        <div>
          <h2 className={`font-display text-2xl ${config.titleGradient}`}>Luna Llena</h2>
          <span className={`${config.badgeAccent} px-3 py-1 rounded-full text-xs font-semibold mt-1 inline-block`}>21 de enero de 2026</span>
        </div>
      </div>

      <div className={`${config.divider} w-full mb-6 relative z-10`} />

      {/* Content */}
      <div className="flex-1 space-y-4 relative z-10">
        <div className={`${config.highlightAccent} rounded-xl p-5`}>
          <div className="flex items-center gap-3 mb-2">
            <Compass className={`w-5 h-5 ${config.iconAccent}`} />
            <h3 className={`${config.iconAccent} font-bold`}>Dónde cae en tu carta</h3>
          </div>
          <div className="flex items-center gap-3 pl-8">
            <span className={`${config.badgeAccent} px-3 py-1 rounded-full text-xs font-semibold`}>Casa 4</span>
            <span className="text-gray-800 font-medium">Hogar interno, raíces, emociones</span>
          </div>
        </div>

        <div className={`${config.highlightSecondary} rounded-xl p-5`}>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className={`w-5 h-5 ${config.iconSecondary}`} />
            <h3 className={`${config.iconSecondary} font-bold`}>Qué es</h3>
          </div>
          <p className="text-gray-800 leading-relaxed pl-8">
            Una culminación emocional. Algo se hace visible.
          </p>
        </div>

        <div className={`${config.highlightPrimary} rounded-xl p-5`}>
          <div className="flex items-center gap-3 mb-2">
            <Flame className={`w-5 h-5 ${config.iconPrimary}`} />
            <h3 className={`${config.iconPrimary} font-bold`}>Qué activa en ti</h3>
          </div>
          <p className="text-gray-800 leading-relaxed pl-8">
            La tensión entre lo que sostienes afuera y lo que te pasa por dentro.
          </p>
        </div>

        <div className={`${config.cardBg} ${config.cardBorder} rounded-xl p-5`}>
          <div className="flex items-center gap-3 mb-3">
            <Heart className={`w-5 h-5 ${config.iconAccent}`} />
            <h3 className={`${config.iconAccent} font-bold`}>Cómo puede manifestarse</h3>
          </div>
          <ul className="text-gray-800 space-y-2 pl-8">
            <li className="flex items-center gap-3"><Circle className={`w-3 h-3 ${config.iconAccent}`} fill="currentColor" /> Cansancio emocional</li>
            <li className="flex items-center gap-3"><Circle className={`w-3 h-3 ${config.iconSecondary}`} fill="currentColor" /> Necesidad de bajar el ritmo</li>
            <li className="flex items-center gap-3"><Circle className={`w-3 h-3 ${config.iconPrimary}`} fill="currentColor" /> Emociones familiares o del pasado</li>
          </ul>
        </div>

        <div className={`${config.highlightSecondary} ${config.cardBorder} rounded-xl p-6`}>
          <div className="flex items-center gap-3 mb-3">
            <Lightbulb className={`w-6 h-6 ${config.iconSecondary}`} />
            <h3 className={`${config.iconSecondary} font-bold text-lg`}>Clave</h3>
          </div>
          <p className="text-gray-800 font-bold text-xl pl-9">
            Si no escuchas el cuerpo, el cuerpo habla solo.
          </p>
        </div>
      </div>
    </div>
  );
};

// ============ 4. EJERCICIOS Y MANTRA (1-2 páginas) ============

export const EjerciciosEnero = () => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-white p-10 flex flex-col relative overflow-hidden ${config.pattern}`}>
      {/* Background */}
      <div className="absolute top-8 right-8 opacity-[0.08]">
        <PenLine className={`w-40 h-40 ${config.iconSecondary}`} />
      </div>
      
      {/* Header */}
      <div className="text-center mb-6 relative z-10">
        <div className={`w-16 h-16 rounded-full ${config.badgeSecondary} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
          <PenLine className="w-8 h-8 text-white" />
        </div>
        <h2 className={`font-display text-2xl ${config.titleGradient} mt-2`}>Ejercicio Central del Mes</h2>
        <span className={`${config.badgePrimary} px-3 py-1 rounded-full text-xs font-semibold mt-2 inline-block`}>Enero 2026</span>
        <div className={`${config.divider} w-32 mx-auto mt-4`} />
      </div>

      {/* Main Exercise */}
      <div className="flex-1 space-y-4 relative z-10">
        <div className={`${config.highlightSecondary} ${config.cardBorder} rounded-xl p-6`}>
          <h3 className={`${config.iconSecondary} font-display text-xl mb-4 flex items-center gap-3`}>
            <Target className={`w-6 h-6 ${config.iconSecondary}`} />
            "Compromisos Vivos vs. Compromisos Muertos"
          </h3>
          <p className="text-gray-500 text-sm italic mb-4 pl-9">
            Hazlo durante la primera semana de enero.
          </p>
          
          <div className="space-y-3 pl-9">
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full ${config.headerBg} text-white flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-lg`}>1</div>
              <p className="text-gray-800 pt-1 font-medium">Escribe todos los compromisos que arrastras.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full ${config.badgeAccent} text-white flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-lg`}>2</div>
              <p className="text-gray-800 pt-1 font-medium">Marca con ✖ los que ya no tienen sentido.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full ${config.badgeSecondary} text-white flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-lg`}>3</div>
              <p className="text-gray-800 pt-1 font-medium">Elige solo <span className={`${config.badgeSecondary} px-2 py-0.5 rounded-full text-xs font-semibold`}>3 compromisos vivos</span> para enero.</p>
            </div>
          </div>
        </div>

        <div className={`${config.highlightPrimary} rounded-xl p-4 flex items-center gap-3`}>
          <Zap className={`w-5 h-5 ${config.iconPrimary} flex-shrink-0`} />
          <p className="text-gray-800 text-sm font-medium">
            Esto trabaja directamente tu patrón natal de sobre-responsabilidad.
          </p>
        </div>

        {/* Writing space */}
        <div className={`${config.cardBorder} rounded-xl p-6 flex-1 writing-area`}>
          <h4 className={`${config.iconPrimary} text-sm uppercase tracking-wider mb-4 flex items-center gap-2 font-bold`}>
            <PenLine className={`w-4 h-4 ${config.iconSecondary}`} />
            Mis compromisos
          </h4>
          <div className="space-y-4 writing-lines">
            <div className="h-8" />
            <div className="h-8" />
            <div className="h-8" />
            <div className="h-8" />
            <div className="h-8" />
            <div className="h-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const MantraEnero = () => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-white p-10 flex flex-col relative overflow-hidden ${config.pattern}`}>
      {/* Background */}
      <div className="absolute top-1/4 left-8 opacity-[0.08]">
        <Sparkles className={`w-32 h-32 ${config.iconAccent}`} />
      </div>
      <div className="absolute bottom-1/4 right-8 opacity-[0.08]">
        <Star className={`w-28 h-28 ${config.iconSecondary}`} />
      </div>
      
      {/* Header */}
      <div className="text-center mb-6 relative z-10">
        <div className={`w-16 h-16 rounded-full ${config.badgeAccent} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className={`font-display text-2xl ${config.titleGradient} mt-2`}>Mantra del Mes</h2>
        <span className={`${config.badgeAccent} px-3 py-1 rounded-full text-xs font-semibold mt-2 inline-block`}>Enero 2026</span>
        <div className={`${config.divider} w-32 mx-auto mt-4`} />
      </div>

      {/* Mantra */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className={`${config.highlightPrimary} ${config.cardBorder} rounded-2xl p-12 text-center shadow-lg`}>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Star className={`w-6 h-6 ${config.iconSecondary}`} fill="currentColor" />
            <Star className={`w-4 h-4 ${config.iconAccent}`} fill="currentColor" />
            <Star className={`w-6 h-6 ${config.iconSecondary}`} fill="currentColor" />
          </div>
          <p className={`font-display text-3xl ${config.titleGradient} leading-relaxed`}>
            "Mi estructura me sostiene,<br />no me asfixia."
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Star className={`w-6 h-6 ${config.iconSecondary}`} fill="currentColor" />
            <Star className={`w-4 h-4 ${config.iconAccent}`} fill="currentColor" />
            <Star className={`w-6 h-6 ${config.iconSecondary}`} fill="currentColor" />
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6 italic font-medium">
          ✨ Repítelo cuando lo necesites ✨
        </p>

        {/* Space to rewrite */}
        <div className={`mt-8 ${config.cardBorder} rounded-xl p-6 writing-area`}>
          <h4 className={`${config.iconPrimary} text-sm uppercase tracking-wider mb-4 flex items-center gap-2 font-bold`}>
            <PenLine className={`w-4 h-4 ${config.iconAccent}`} />
            Escríbelo con tus palabras
          </h4>
          <div className="space-y-5 writing-lines">
            <div className="h-12" />
            <div className="h-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ 5. SEMANAS DEL MES ============

interface SemanaEneroProps {
  semanaNum: number;
  fechas: string;
  energia: string;
  clave: string;
  eventoActivo?: { icon: React.ReactNode; nombre: string; color: string };
  microejercicio: string;
}

const SemanaEnero = ({ semanaNum, fechas, energia, clave, eventoActivo, microejercicio }: SemanaEneroProps) => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-white p-8 flex flex-col relative overflow-hidden ${config.pattern}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-full ${config.headerBg} flex items-center justify-center shadow-lg`}>
            <span className="text-white font-display text-2xl">{semanaNum}</span>
          </div>
          <div>
            <h2 className={`font-display text-xl ${config.titleGradient}`}>Semana {semanaNum}</h2>
            <p className="text-gray-500 font-medium">{fechas}</p>
          </div>
        </div>
        {eventoActivo && (
          <div className={`flex items-center gap-2 ${eventoActivo.color} px-4 py-2 rounded-full shadow-lg`}>
            {eventoActivo.icon}
            <span className="text-white text-sm font-bold">{eventoActivo.nombre}</span>
          </div>
        )}
      </div>

      <div className={`${config.divider} w-full mb-4 relative z-10`} />

      {/* Energy and key */}
      <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
        <div className={`${config.highlightAccent} rounded-xl p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <Flame className={`w-5 h-5 ${config.iconAccent}`} />
            <h3 className={`${config.iconAccent} text-sm uppercase tracking-wider font-bold`}>Energía</h3>
          </div>
          <p className="text-gray-800 font-bold pl-7 text-lg">{energia}</p>
        </div>
        <div className={`${config.highlightSecondary} rounded-xl p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className={`w-5 h-5 ${config.iconSecondary}`} />
            <h3 className={`${config.iconSecondary} text-sm uppercase tracking-wider font-bold`}>Clave</h3>
          </div>
          <p className="text-gray-800 font-bold pl-7 text-lg">{clave}</p>
        </div>
      </div>

      {/* Micro-exercise */}
      <div className={`${config.highlightPrimary} rounded-xl p-4 mb-4 relative z-10`}>
        <div className="flex items-center gap-2 mb-2">
          <Target className={`w-5 h-5 ${config.iconPrimary}`} />
          <h3 className={`${config.iconPrimary} text-sm uppercase tracking-wider font-bold`}>Micro-ejercicio</h3>
        </div>
        <p className="text-gray-800 font-medium pl-7">{microejercicio}</p>
      </div>

      {/* Daily planning space */}
      <div className={`flex-1 ${config.cardBorder} rounded-xl p-4 writing-area relative z-10`}>
        <h3 className={`${config.iconPrimary} text-sm uppercase tracking-wider mb-3 flex items-center gap-2 font-bold`}>
          <PenLine className={`w-4 h-4 ${config.iconSecondary}`} />
          Planificación y reflexión
        </h3>
        <div className="grid grid-cols-2 gap-4 h-full writing-lines">
          <div className="space-y-4">
            <div className="h-8" />
            <div className="h-8" />
            <div className="h-8" />
            <div className="h-8" />
            <div className="h-8" />
          </div>
          <div className="space-y-4">
            <div className="h-8" />
            <div className="h-8" />
            <div className="h-8" />
            <div className="h-8" />
            <div className="h-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Semana1Enero = () => (
  <SemanaEnero
    semanaNum={1}
    fechas="del 1 al 5 de enero"
    energia="Preparación"
    clave="No acelerar"
    microejercicio="Escribir qué NO quieres repetir este año"
  />
);

export const Semana2Enero = () => (
  <SemanaEnero
    semanaNum={2}
    fechas="del 6 al 12 de enero"
    energia="Intención consciente"
    clave="Define solo 1 objetivo real"
    eventoActivo={{ 
      icon: <Moon className="w-5 h-5 text-white" />, 
      nombre: "Luna Nueva",
      color: "bg-gradient-to-r from-primary to-cosmic-violet"
    }}
    microejercicio="Escribir tu intención en una frase"
  />
);

export const Semana3Enero = () => (
  <SemanaEnero
    semanaNum={3}
    fechas="del 13 al 19 de enero"
    energia="Ajuste"
    clave="Menos hacer, más observar"
    microejercicio="Observa qué pesa y ajusta ritmos"
  />
);

export const Semana4Enero = () => (
  <SemanaEnero
    semanaNum={4}
    fechas="del 20 al 26 de enero"
    energia="Liberación emocional"
    clave="Baja el ritmo, escucha emociones"
    eventoActivo={{ 
      icon: <Sun className="w-5 h-5 text-white" />, 
      nombre: "Luna Llena",
      color: "bg-gradient-to-r from-cosmic-gold to-cosmic-amber"
    }}
    microejercicio="¿Qué necesito soltar?"
  />
);

// ============ 6. CIERRE DEL MES ============

export const CierreEnero = () => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-white p-10 flex flex-col relative overflow-hidden ${config.pattern}`}>
      {/* Background */}
      <div className="absolute top-8 left-8 opacity-[0.08]">
        <CheckCircle2 className={`w-32 h-32 ${config.iconPrimary}`} />
      </div>
      
      {/* Header */}
      <div className="text-center mb-6 relative z-10">
        <div className={`w-16 h-16 rounded-full ${config.headerBg} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h2 className={`font-display text-2xl ${config.titleGradient} mt-2`}>Cierre de Enero</h2>
        <span className={`${config.badgePrimary} px-3 py-1 rounded-full text-xs font-semibold mt-2 inline-block`}>Reflexión final</span>
        <div className={`${config.divider} w-32 mx-auto mt-4`} />
      </div>

      {/* Main question */}
      <div className={`${config.highlightPrimary} ${config.cardBorder} rounded-2xl p-8 mb-6 relative z-10`}>
        <h3 className={`${config.titleGradient} font-display text-xl text-center mb-2 flex items-center justify-center gap-3`}>
          <Lightbulb className={`w-6 h-6 ${config.iconSecondary}`} />
          ¿Qué cambió en mi forma de empezar el año?
          <Lightbulb className={`w-6 h-6 ${config.iconSecondary}`} />
        </h3>
      </div>

      {/* Writing space */}
      <div className={`flex-1 ${config.cardBorder} rounded-xl p-6 writing-area relative z-10`}>
        <div className="writing-lines h-full">
          <div className="h-12" />
          <div className="h-12" />
          <div className="h-12" />
          <div className="h-12" />
          <div className="h-12" />
          <div className="h-12" />
          <div className="h-12" />
          <div className="h-12" />
        </div>
      </div>

      {/* Summary box */}
      <div className={`mt-6 ${config.highlightSecondary} ${config.cardBorder} rounded-xl p-4 relative z-10`}>
        <div className="text-center">
          <p className="mb-3 font-bold text-gray-800">Esta agenda:</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className={`flex items-center gap-1 font-medium ${config.iconPrimary}`}><CheckCircle2 className="w-5 h-5" /> Informa</span>
            <span className={`flex items-center gap-1 font-medium ${config.iconSecondary}`}><CheckCircle2 className="w-5 h-5" /> Acompaña</span>
            <span className={`flex items-center gap-1 font-medium ${config.iconAccent}`}><CheckCircle2 className="w-5 h-5" /> No abruma</span>
            <span className={`flex items-center gap-1 font-medium ${config.iconPrimary}`}><CheckCircle2 className="w-5 h-5" /> No infantiliza</span>
          </div>
        </div>
      </div>
    </div>
  );
};
