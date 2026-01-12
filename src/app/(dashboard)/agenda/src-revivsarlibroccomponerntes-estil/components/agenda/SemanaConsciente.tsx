import { format, addDays, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { useStyle } from "@/contexts/StyleContext";
import { Sun, Moon, Sparkles, PenLine } from "lucide-react";

interface SemanaConscienteProps {
  weekStart: Date;
  weekNumber: number;
  birthday?: Date;
  weekTitle?: string;
  weekSubtitle?: string;
  events?: WeekEvent[];
  ritual?: {
    title: string;
    description: string;
  };
  reflection?: {
    title: string;
    description: string;
  };
  transition?: {
    title: string;
    description: string;
  };
}

interface WeekEvent {
  day: number;
  title: string;
  description: string;
  type: "lunaNueva" | "lunaLlena" | "eclipse" | "retornoSolar" | "special";
}

export const SemanaConsciente = ({ 
  weekStart, 
  weekNumber, 
  birthday,
  weekTitle = "Integración y Reflexión",
  weekSubtitle,
  events = [],
  ritual,
  reflection,
  transition
}: SemanaConscienteProps) => {
  const weekEnd = addDays(weekStart, 6);
  const { config } = useStyle();
  
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  // Check if any day is a birthday
  const getBirthdayDay = () => {
    if (!birthday) return null;
    return days.find(day => 
      day.getDate() === birthday.getDate() && 
      day.getMonth() === birthday.getMonth()
    );
  };
  
  const birthdayDay = getBirthdayDay();
  
  // Get event for a specific day
  const getEventForDay = (dayDate: Date) => {
    return events.find(e => e.day === dayDate.getDate());
  };

  return (
    <div className={`print-page bg-background p-8 flex flex-col ${config.pattern}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className={`font-display text-2xl ${config.titleGradient}`} style={{ fontFamily: config.fontDisplay }}>
          Semana {weekNumber}: {format(weekStart, "d", { locale: es })}-{format(weekEnd, "d MMMM yyyy", { locale: es })}
        </h2>
        <p className={`${config.iconSecondary} italic text-sm mt-1`} style={{ fontFamily: config.fontBody }}>
          {weekTitle}
        </p>
      </div>
      
      {/* Two Column Layout */}
      <div className="flex-1 grid grid-cols-2 gap-6">
        {/* Left Column - Days */}
        <div className="space-y-2">
          {days.map((day, index) => {
            const event = getEventForDay(day);
            const isBirthday = birthday && isSameDay(day, new Date(day.getFullYear(), birthday.getMonth(), birthday.getDate()));
            
            return (
              <div 
                key={index}
                className={`rounded-lg p-3 ${
                  isBirthday 
                    ? `${config.calendarColors.retornoSolar} border-2` 
                    : event 
                      ? config.calendarColors[event.type] || config.highlightPrimary
                      : config.highlightPrimary
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-lg ${config.iconSecondary}`} style={{ fontFamily: config.fontDisplay }}>
                      {format(day, "d", { locale: es })}
                    </span>
                    <span className="text-foreground/70 text-sm capitalize" style={{ fontFamily: config.fontBody }}>
                      {format(day, "EEEE", { locale: es })}
                    </span>
                  </div>
                  {isBirthday && (
                    <div className="flex items-center gap-1">
                      <Sun className={`w-4 h-4 ${config.iconPrimary}`} />
                      <span className={`text-xs font-medium ${config.iconPrimary}`}>🎂 Cumpleaños Solar</span>
                    </div>
                  )}
                  {event && !isBirthday && (
                    <span className={`text-xs ${config.iconSecondary}`}>
                      {event.type === "lunaNueva" && "🌑"}
                      {event.type === "lunaLlena" && "🌕"}
                      {event.type === "eclipse" && "🌒"}
                      {event.title}
                    </span>
                  )}
                </div>
                <div className="flex items-start gap-1">
                  <Sparkles className="w-3 h-3 text-foreground/30 mt-1 flex-shrink-0" />
                  <p className="text-foreground/40 text-xs italic" style={{ fontFamily: config.fontBody }}>Notas</p>
                </div>
                <div className="h-8 border-b border-dashed border-current/10 mt-1" />
              </div>
            );
          })}
        </div>
        
        {/* Right Column - Events, Reflections, Notes */}
        <div className="space-y-4">
          {/* Main Event of the Week */}
          {events.length > 0 && events.map((event, idx) => (
            <div key={idx} className={`${config.highlightSecondary} rounded-lg p-4`}>
              <h4 className={`font-medium ${config.iconSecondary} mb-2`} style={{ fontFamily: config.fontDisplay }}>
                {event.type === "lunaNueva" && "🌑 "}
                {event.type === "lunaLlena" && "🌕 "}
                {event.type === "eclipse" && "🌒 "}
                {event.title}
              </h4>
              <p className="text-foreground/70 text-sm leading-relaxed" style={{ fontFamily: config.fontBody }}>
                {event.description}
              </p>
            </div>
          ))}
          
          {/* Ritual */}
          {ritual && (
            <div className={`${config.cardBg} border border-current/20 rounded-lg p-4`}>
              <h4 className={`font-medium ${config.iconPrimary} mb-2 flex items-center gap-2`} style={{ fontFamily: config.fontDisplay }}>
                <Moon className="w-4 h-4" />
                {ritual.title}
              </h4>
              <p className="text-foreground/70 text-sm leading-relaxed" style={{ fontFamily: config.fontBody }}>
                {ritual.description}
              </p>
            </div>
          )}
          
          {/* Transition */}
          {transition && (
            <div className={`${config.highlightPrimary} rounded-lg p-4`}>
              <h4 className={`font-medium ${config.iconSecondary} mb-2`} style={{ fontFamily: config.fontDisplay }}>
                {transition.title}
              </h4>
              <p className="text-foreground/70 text-sm leading-relaxed" style={{ fontFamily: config.fontBody }}>
                {transition.description}
              </p>
            </div>
          )}
          
          {/* Reflection */}
          {reflection && (
            <div className={`${config.highlightSecondary} rounded-lg p-4`}>
              <h4 className={`font-medium ${config.iconSecondary} mb-2 flex items-center gap-2`} style={{ fontFamily: config.fontDisplay }}>
                <PenLine className="w-4 h-4" />
                {reflection.title}
              </h4>
              <p className="text-foreground/70 text-sm leading-relaxed" style={{ fontFamily: config.fontBody }}>
                {reflection.description}
              </p>
            </div>
          )}
          
          {/* Space for Notes - always show */}
          <div className={`flex-1 ${config.cardBg} border border-dashed border-current/20 rounded-lg p-4`}>
            <h4 className={`${config.iconSecondary} text-sm mb-3 flex items-center gap-2`} style={{ fontFamily: config.fontDisplay }}>
              <PenLine className="w-4 h-4" />
              Espacio para notas
            </h4>
            <div className="space-y-3">
              <div className="h-6 border-b border-dashed border-current/10" />
              <div className="h-6 border-b border-dashed border-current/10" />
              <div className="h-6 border-b border-dashed border-current/10" />
              <div className="h-6 border-b border-dashed border-current/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// EJEMPLO: Semana del Cumpleaños de Vero (Feb 9-15, 2026)
// ==========================================
export const SemanaCumpleVero = () => {
  const weekStart = new Date(2026, 1, 9); // 9 de Febrero 2026
  const birthday = new Date(1974, 1, 10); // 10 de Febrero
  
  return (
    <SemanaConsciente
      weekStart={weekStart}
      weekNumber={2}
      birthday={birthday}
      weekTitle="Renacimiento Solar"
      events={[
        {
          day: 10,
          title: "Tu Retorno Solar",
          description: "El 10 de febrero el Sol regresa exactamente al mismo grado donde estaba cuando naciste. Este es tu momento de renacimiento anual. Tu carta de Retorno Solar para este ciclo tiene el Ascendente en Acuario, lo que marca un año de autenticidad radical y desapego consciente. El Sol en Casa 12 indica un año de procesos internos profundos, cierre de ciclos y preparación silenciosa para lo que viene.",
          type: "retornoSolar"
        }
      ]}
      ritual={{
        title: "Ritual de Cumpleaños",
        description: "Crea un espacio sagrado con vela dorada. Escribe en un papel lo que sueltas del ciclo anterior. En otro papel, tus intenciones para este nuevo año solar. Quema el primero y guarda el segundo. Mírate al espejo y di: 'Me permito ser honesta conmigo antes de intentar encajar en el mundo.'"
      }}
      reflection={{
        title: "Reflexión del Retorno Solar",
        description: "Este año no viene a exigirte más. Viene a reordenarte por dentro. Tu carta natal habla de una mujer intuitiva, sensible y profundamente perceptiva. Este ciclo es menos visible, pero mucho más verdadero. ¿Desde dónde estás arrancando: desde la exigencia o desde la coherencia?"
      }}
    />
  );
};

// ==========================================
// EJEMPLO: Última semana de Enero 2026 (26-31 Enero)
// ==========================================
export const SemanaFinEnero2026 = () => {
  const weekStart = new Date(2026, 0, 26); // 26 de Enero 2026
  
  return (
    <SemanaConsciente
      weekStart={weekStart}
      weekNumber={5}
      weekTitle="Culminación e Integración"
      events={[
        {
          day: 26,
          title: "Luna Llena en Leo: Expresión e Identidad",
          description: "El 26 de enero, la Luna Llena en Leo ilumina tu casa 1 de identidad, creando un eje con el Sol en Acuario en tu casa 7 de relaciones. Esta lunación destaca la dinámica entre tu auténtica expresión personal y tus conexiones con los demás. Es un momento para encontrar equilibrio entre individualidad y colaboraciones, entre tu necesidad de reconocimiento (Leo) y la visión compartida (Acuario). Observa cómo tus relaciones reflejan tu identidad y cómo puedes expresarte más plenamente sin comprometer conexiones significativas.",
          type: "lunaLlena"
        }
      ]}
      ritual={{
        title: "Ritual: Nutrición Colectiva",
        description: "Crea un espacio con elementos dorados/amarillos (Leo) y azules/plateados (Acuario). Enciende una vela dorada y coloca un espejo pequeño y un símbolo de tus conexiones importantes. Después de tres respiraciones profundas, mírate al espejo y afirma tres cualidades que aprecias de ti. Luego, observa el símbolo de conexión y reconoce tres formas en que tus relaciones enriquecen tu vida."
      }}
      transition={{
        title: "Transición hacia Febrero",
        description: "Al cerrar enero, prepárate para un febrero centrado en profundización intuitiva y transformación relacional. Venus seguirá retrógrado hasta mediados de mes, invitándote a continuar revisando tus valores. La energía acuariana permanecerá fuerte durante la primera mitad del mes, permitiéndote explorar nuevas formas de relacionarte. A mediados de febrero, el Sol ingresará en Piscis, tu signo solar natal, activando tu casa 8 de transformación e intimidad."
      }}
      reflection={{
        title: "Reflexión de Enero",
        description: "Has navegado un mes de estructuración consciente con Capricornio y luego innovación relacional con Acuario. La Luna Llena en Leo marca el punto culminante de este viaje, iluminando cómo tu expresión personal puede florecer dentro de relaciones significativas. Toma un momento para apreciar tu crecimiento durante este mes."
      }}
    />
  );
};
