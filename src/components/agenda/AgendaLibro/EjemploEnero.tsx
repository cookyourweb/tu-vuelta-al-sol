import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth } from "date-fns";
import { es } from "date-fns/locale";
import {
  Moon, Sun, Target, Heart, Compass, Flame,
  Sparkles, PenLine, BookOpen, Calendar,
  CheckCircle2, Circle, ArrowRight, Lightbulb,
  Star, Zap, Waves, TreePine, Mountain
} from "lucide-react";
import { useStyle } from "@/context/StyleContext";

// ENERO - EJEMPLO COMPLETO (año dinámico)

interface EneroComponentProps {
  year: number;
}

// ============ 1. APERTURA DEL MES (2 páginas) ============

export const AperturaEneroIzquierda = ({ year }: EneroComponentProps) => {
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
        <h1 className={`font-display text-5xl ${config.titleGradient} mt-2`}>ENERO {year}</h1>
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

export const AperturaEneroDerecha = ({ year }: EneroComponentProps) => {
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

const weekDays = ["L", "M", "X", "J", "V", "S", "D"];

const eneroEvents: Record<number, { icon: React.ReactNode; label: string; color: string; bgColor: string }> = {
  6: { icon: <Moon className="w-5 h-5" />, label: "Inicio", color: "text-white", bgColor: "bg-gradient-to-br from-primary to-cosmic-violet" },
  21: { icon: <Sun className="w-5 h-5" />, label: "Cierre", color: "text-white", bgColor: "bg-gradient-to-br from-cosmic-gold to-cosmic-amber" },
};

const generateEneroWeeks = (year: number) => {
  const monthDate = new Date(year, 0, 1);
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

export const CalendarioVisualEnero = ({ year }: EneroComponentProps) => {
  const { config } = useStyle();
  const weeks = generateEneroWeeks(year);
  const monthDate = new Date(year, 0, 1);

  // Define eventos destacados del mes - usando colores del tema
  const eventosDestacados = [
    {
      dia: 9,
      titulo: "Retorno Solar",
      descripcion: "Sol a 19°03' Piscis. Inicio de nuevo ciclo personal con énfasis en relaciones.",
      ritual: "Gran Ritual de Retorno Solar",
      hora: "15:30",
      icon: "☀",
      bgColor: config.highlightPrimary,
      textColor: config.iconPrimary
    },
    {
      dia: 14,
      titulo: "Luna Nueva",
      descripcion: "Momento perfecto para sembrar intenciones alineadas con tu Sol natal.",
      ritual: "Luna Nueva en Piscis",
      icon: "☾",
      bgColor: config.highlightSecondary,
      textColor: config.iconSecondary
    },
    {
      dia: 20,
      titulo: "Equinoccio",
      descripcion: "Sol ingresa en Aries. Portal de inicio en sincronía con Sol progresado 1°12' Aries.",
      ritual: "Portal de Primavera",
      icon: "✦",
      bgColor: config.highlightAccent,
      textColor: config.iconAccent
    },
    {
      dia: 28,
      titulo: "Luna Llena",
      descripcion: "Activa tu Luna natal. Culminación emocional y equilibrio en relaciones.",
      ritual: "Luna Llena en Libra",
      icon: "☾",
      bgColor: config.highlightPrimary,
      textColor: config.iconPrimary
    }
  ];

  return (
    <div className={`print-page bg-white p-10 flex flex-col ${config.pattern}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className={`${config.fontDisplay} text-4xl ${config.titleGradient} font-bold mb-2`}>
          MARZO {year}
        </h2>
        <p className={`text-gray-600 text-base italic ${config.fontBody}`}>
          Celebración Solar y Renacimiento
        </p>
      </div>

      {/* Calendar Grid SIN bordes */}
      <div className="mb-6">
        {/* Week day headers */}
        <div className="grid grid-cols-7 mb-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className={`text-center text-gray-600 text-sm font-bold py-2 ${config.fontBody}`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar weeks - SIN bordes */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => {
              const isCurrentMonth = isSameMonth(day, monthDate);
              const dayNum = day.getDate();
              const evento = eventosDestacados.find(e => e.dia === dayNum);
              const isWeekend = dayIndex >= 5;

              return (
                <div
                  key={dayIndex}
                  className={`
                    relative h-20 flex flex-col rounded
                    ${!isCurrentMonth ? 'bg-gray-50 text-gray-300' : ''}
                    ${isCurrentMonth && !evento ? 'bg-white' : ''}
                    ${evento ? evento.bgColor : ''}
                    ${isWeekend && isCurrentMonth && !evento ? 'bg-gray-50/50' : ''}
                  `}
                >
                  <div className={`
                    text-base font-semibold pt-1 px-1
                    ${!isCurrentMonth ? 'text-gray-300' : ''}
                    ${isCurrentMonth && !evento ? 'text-gray-800' : ''}
                    ${evento ? evento.textColor + ' font-bold' : ''}
                  `}>
                    {format(day, "d")}
                  </div>

                  {evento && (
                    <div className="flex-1 flex flex-col items-center justify-center pb-1">
                      <div className={`text-2xl ${evento.textColor} mb-1`}>
                        {evento.icon}
                      </div>
                      <div className={`text-[9px] font-bold ${evento.textColor} leading-tight text-center px-1`}>
                        {evento.titulo}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Eventos Clave - Destacados abajo */}
      <div className="space-y-3">
        {eventosDestacados.map((evento, idx) => (
          <div key={idx} className={`p-4 rounded-lg ${evento.bgColor}`}>
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 text-2xl ${evento.textColor}`}>
                {evento.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`font-bold ${evento.textColor} text-base ${config.fontDisplay}`}>
                    {evento.dia} Marzo
                  </span>
                  <span className={`text-sm font-semibold ${evento.textColor} ${config.fontBody}`}>
                    {evento.titulo}
                  </span>
                </div>
                <p className={`text-xs text-gray-700 leading-relaxed mb-2 ${config.fontBody}`}>
                  {evento.descripcion}
                </p>
                <p className={`text-xs ${evento.textColor} font-medium ${config.fontBody}`}>
                  Ritual: {evento.ritual}
                  {evento.hora && (
                    <span className={`ml-2`}>
                      · Hora óptima: {evento.hora}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Energía del mes - Personalizada */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-start gap-2 mb-3">
          <span className={`${config.iconPrimary} text-xl`}>📅</span>
          <h3 className={`${config.fontDisplay} text-base ${config.iconPrimary} font-bold`}>
            Energía de Marzo {year}
          </h3>
        </div>
        <p className={`text-sm text-gray-700 leading-relaxed ${config.fontBody}`}>
          Marzo marca el inicio de tu nuevo ciclo solar con el Sol regresando a su posición natal en Piscis.
          Con tu Sol progresado recién entrado en Aries (1°12'), experimentas una profunda conexión con tu
          esencia intuitiva y una fase más asertiva. La Luna Nueva potencia nuevos comienzos mientras te enfocas
          en relaciones, honrando tanto la profundidad intuitiva como la claridad de propósito que este año te invita a manifestar.
        </p>
      </div>
    </div>
  );
};

// ============ 3. INTERPRETACIÓN PERSONAL (2-3 páginas) ============

export const InterpretacionLunaNuevaEnero = ({ year }: EneroComponentProps) => {
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
          <span className={`${config.badgeSecondary} px-3 py-1 rounded-full text-xs font-semibold mt-1 inline-block`}>6 de enero de {year}</span>
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

export const InterpretacionLunaLlenaEnero = ({ year }: EneroComponentProps) => {
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
          <span className={`${config.badgeAccent} px-3 py-1 rounded-full text-xs font-semibold mt-1 inline-block`}>21 de enero de {year}</span>
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

export const EjerciciosEnero = ({ year }: EneroComponentProps) => {
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
        <span className={`${config.badgePrimary} px-3 py-1 rounded-full text-xs font-semibold mt-2 inline-block`}>Enero {year}</span>
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

export const MantraEnero = ({ year }: EneroComponentProps) => {
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
        <span className={`${config.badgeAccent} px-3 py-1 rounded-full text-xs font-semibold mt-2 inline-block`}>Enero {year}</span>
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
  dias: { dia: string; fecha: number }[]; // Array de 7 días: lun-dom
  energia: string;
  clave: string;
  eventoActivo?: { icon: React.ReactNode; nombre: string; color: string };
  microejercicio: string;
}

const SemanaEnero = ({ semanaNum, dias, energia, clave, eventoActivo, microejercicio }: SemanaEneroProps) => {
  const { config } = useStyle();
  const diasSemana = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

  return (
    <div className={`print-page bg-white p-8 flex flex-col relative overflow-hidden ${config.pattern}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full ${config.headerBg} flex items-center justify-center shadow-lg`}>
            <span className="text-white font-display text-xl">{semanaNum}</span>
          </div>
          <div>
            <h2 className={`font-display text-xl ${config.titleGradient}`}>Semana {semanaNum}</h2>
            <p className="text-gray-500 text-sm font-medium">{dias[0].fecha} - {dias[6].fecha} de Marzo</p>
          </div>
        </div>
        {eventoActivo && (
          <div className={`flex items-center gap-2 ${eventoActivo.color} px-3 py-1.5 rounded-full shadow-lg`}>
            {eventoActivo.icon}
            <span className="text-white text-xs font-bold">{eventoActivo.nombre}</span>
          </div>
        )}
      </div>

      {/* Grid de 7 días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-4 relative z-10">
        {dias.map((dia, idx) => (
          <div
            key={idx}
            className={`
              ${config.cardBorder} rounded-lg p-2 text-center
              ${idx >= 5 ? config.highlightSecondary : config.highlightPrimary}
            `}
          >
            <div className={`text-xs font-bold ${config.iconSecondary} mb-1`}>
              {diasSemana[idx]}
            </div>
            <div className={`text-lg font-bold ${config.iconPrimary}`}>
              {dia.fecha}
            </div>
            <div className="h-8 mt-1 text-[10px] text-gray-500">
              {/* Espacio para notas */}
            </div>
          </div>
        ))}
      </div>

      <div className={`${config.divider} w-full mb-3 relative z-10`} />

      {/* Energy and key */}
      <div className="grid grid-cols-2 gap-3 mb-3 relative z-10">
        <div className={`${config.highlightAccent} rounded-lg p-3`}>
          <div className="flex items-center gap-2 mb-1">
            <Flame className={`w-4 h-4 ${config.iconAccent}`} />
            <h3 className={`${config.iconAccent} text-xs uppercase tracking-wider font-bold`}>Energía</h3>
          </div>
          <p className="text-gray-800 font-bold text-sm">{energia}</p>
        </div>
        <div className={`${config.highlightSecondary} rounded-lg p-3`}>
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className={`w-4 h-4 ${config.iconSecondary}`} />
            <h3 className={`${config.iconSecondary} text-xs uppercase tracking-wider font-bold`}>Clave</h3>
          </div>
          <p className="text-gray-800 font-bold text-sm">{clave}</p>
        </div>
      </div>

      {/* Micro-exercise */}
      <div className={`${config.highlightPrimary} rounded-lg p-3 mb-3 relative z-10`}>
        <div className="flex items-center gap-2 mb-1">
          <Target className={`w-4 h-4 ${config.iconPrimary}`} />
          <h3 className={`${config.iconPrimary} text-xs uppercase tracking-wider font-bold`}>Micro-ejercicio</h3>
        </div>
        <p className="text-gray-800 font-medium text-sm">{microejercicio}</p>
      </div>

      {/* Daily planning space */}
      <div className={`flex-1 ${config.cardBorder} rounded-lg p-3 writing-area relative z-10`}>
        <h3 className={`${config.iconPrimary} text-xs uppercase tracking-wider mb-2 flex items-center gap-2 font-bold`}>
          <PenLine className={`w-3 h-3 ${config.iconSecondary}`} />
          Notas y reflexión de la semana
        </h3>
        <div className="space-y-3 writing-lines">
          <div className="h-6 border-b border-dashed border-gray-300" />
          <div className="h-6 border-b border-dashed border-gray-300" />
          <div className="h-6 border-b border-dashed border-gray-300" />
          <div className="h-6 border-b border-dashed border-gray-300" />
          <div className="h-6 border-b border-dashed border-gray-300" />
        </div>
      </div>
    </div>
  );
};

export const Semana1Enero = ({ year }: EneroComponentProps) => (
  <SemanaEnero
    semanaNum={1}
    dias={[
      { dia: "LUN", fecha: 3 },
      { dia: "MAR", fecha: 4 },
      { dia: "MIÉ", fecha: 5 },
      { dia: "JUE", fecha: 6 },
      { dia: "VIE", fecha: 7 },
      { dia: "SÁB", fecha: 8 },
      { dia: "DOM", fecha: 9 }
    ]}
    energia="Preparación"
    clave="No acelerar"
    eventoActivo={{
      icon: <Sun className="w-4 h-4 text-white" />,
      nombre: "Retorno Solar",
      color: "bg-gradient-to-r from-orange-500 to-yellow-500"
    }}
    microejercicio="Escribir qué NO quieres repetir este año"
  />
);

export const Semana2Enero = ({ year }: EneroComponentProps) => (
  <SemanaEnero
    semanaNum={2}
    dias={[
      { dia: "LUN", fecha: 10 },
      { dia: "MAR", fecha: 11 },
      { dia: "MIÉ", fecha: 12 },
      { dia: "JUE", fecha: 13 },
      { dia: "VIE", fecha: 14 },
      { dia: "SÁB", fecha: 15 },
      { dia: "DOM", fecha: 16 }
    ]}
    energia="Intención consciente"
    clave="Define solo 1 objetivo real"
    eventoActivo={{
      icon: <Moon className="w-4 h-4 text-white" />,
      nombre: "Luna Nueva",
      color: "bg-gradient-to-r from-blue-500 to-indigo-500"
    }}
    microejercicio="Escribir tu intención en una frase"
  />
);

export const Semana3Enero = ({ year }: EneroComponentProps) => (
  <SemanaEnero
    semanaNum={3}
    dias={[
      { dia: "LUN", fecha: 17 },
      { dia: "MAR", fecha: 18 },
      { dia: "MIÉ", fecha: 19 },
      { dia: "JUE", fecha: 20 },
      { dia: "VIE", fecha: 21 },
      { dia: "SÁB", fecha: 22 },
      { dia: "DOM", fecha: 23 }
    ]}
    energia="Ajuste"
    clave="Menos hacer, más observar"
    eventoActivo={{
      icon: <Star className="w-4 h-4 text-white" fill="currentColor" />,
      nombre: "Equinoccio",
      color: "bg-gradient-to-r from-yellow-500 to-orange-500"
    }}
    microejercicio="Observa qué pesa y ajusta ritmos"
  />
);

export const Semana4Enero = ({ year }: EneroComponentProps) => (
  <SemanaEnero
    semanaNum={4}
    dias={[
      { dia: "LUN", fecha: 24 },
      { dia: "MAR", fecha: 25 },
      { dia: "MIÉ", fecha: 26 },
      { dia: "JUE", fecha: 27 },
      { dia: "VIE", fecha: 28 },
      { dia: "SÁB", fecha: 29 },
      { dia: "DOM", fecha: 30 }
    ]}
    energia="Liberación emocional"
    clave="Baja el ritmo, escucha emociones"
    eventoActivo={{
      icon: <Moon className="w-4 h-4 text-white" />,
      nombre: "Luna Llena",
      color: "bg-gradient-to-r from-purple-500 to-pink-500"
    }}
    microejercicio="¿Qué necesito soltar?"
  />
);

// ============ 6. CIERRE DEL MES ============

export const CierreEnero = ({ year }: EneroComponentProps) => {
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
