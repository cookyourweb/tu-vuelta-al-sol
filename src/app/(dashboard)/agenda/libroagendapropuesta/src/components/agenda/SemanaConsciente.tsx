import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { useStyle } from "@/contexts/StyleContext";

interface SemanaConscienteProps {
  weekStart: Date;
  weekNumber: number;
}

const lunarPhases = [
  { phase: "Luna Nueva", symbol: "🌑", energy: "Sembrar intenciones" },
  { phase: "Cuarto Creciente", symbol: "🌓", energy: "Actuar y construir" },
  { phase: "Luna Llena", symbol: "🌕", energy: "Culminar y celebrar" },
  { phase: "Cuarto Menguante", symbol: "🌗", energy: "Soltar y reflexionar" },
];

export const SemanaConsciente = ({ weekStart, weekNumber }: SemanaConscienteProps) => {
  const weekEnd = addDays(weekStart, 6);
  const lunarPhase = lunarPhases[weekNumber % 4];
  const { config } = useStyle();
  
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  return (
    <>
      {/* Page 1: Week overview */}
      <div className={`print-page bg-background p-10 flex flex-col ${config.pattern}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className={`${config.iconSecondary} opacity-60 text-xs tracking-[0.2em] uppercase`}>
              Semana {weekNumber}
            </span>
            <h2 className={`font-display text-xl mt-1 ${config.titleGradient}`}>
              {format(weekStart, "d", { locale: es })} — {format(weekEnd, "d MMMM", { locale: es })}
            </h2>
          </div>
          <div className="text-right">
            <span className="text-2xl">{lunarPhase.symbol}</span>
            <p className="text-foreground/50 text-xs mt-1">{lunarPhase.phase}</p>
          </div>
        </div>
        
        <div className={`${config.highlightSecondary} rounded-lg p-4 mb-6`}>
          <h4 className={`${config.iconSecondary} text-sm font-medium mb-2`}>Influencia lunar de la semana</h4>
          <p className="text-foreground/60 text-xs mb-2">{lunarPhase.energy}</p>
          <div className="h-12 border-b border-dashed border-current/20" />
        </div>
        
        <div className={`${config.cardBorder} pl-4 mb-6`}>
          <p className={`${config.iconSecondary} italic text-sm mb-2`}>Pregunta guía:</p>
          <div className="h-10 border-b border-dashed border-current/20" />
        </div>
        
        <div className="flex-1 grid grid-cols-2 gap-3">
          {days.slice(0, 4).map((day, index) => (
            <div 
              key={index}
              className={`${config.highlightPrimary} rounded-lg p-3`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`${config.iconSecondary} font-medium text-sm`}>
                  {format(day, "EEE", { locale: es })}
                </span>
                <span className="text-foreground/40 text-xs">
                  {format(day, "d", { locale: es })}
                </span>
              </div>
              <div className="h-16 border-b border-dashed border-current/10" />
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-foreground/40 text-xs italic">
            "La agenda debe respirar."
          </p>
        </div>
      </div>
      
      {/* Page 2: Rest of week + notes */}
      <div className={`print-page bg-background p-10 flex flex-col ${config.pattern}`}>
        <div className="flex items-center justify-between mb-6">
          <span className={`${config.iconSecondary} opacity-60 text-xs tracking-[0.2em] uppercase`}>
            Semana {weekNumber} — continuación
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          {days.slice(4, 7).map((day, index) => (
            <div 
              key={index}
              className={`${config.highlightPrimary} rounded-lg p-3`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`${config.iconSecondary} font-medium text-sm`}>
                  {format(day, "EEE", { locale: es })}
                </span>
                <span className="text-foreground/40 text-xs">
                  {format(day, "d", { locale: es })}
                </span>
              </div>
              <div className="h-20 border-b border-dashed border-current/10" />
            </div>
          ))}
        </div>
        
        <div className={`flex-1 ${config.highlightPrimary} rounded-lg p-6`}>
          <h4 className={`${config.iconSecondary} font-medium mb-4`}>Espacio libre</h4>
          <div className="space-y-4">
            <div className="h-16 border-b border-dashed border-current/10" />
            <div className="h-16 border-b border-dashed border-current/10" />
            <div className="h-16 border-b border-dashed border-current/10" />
            <div className="h-16" />
          </div>
        </div>
        
        <div className={`mt-6 text-center ${config.highlightSecondary} rounded-lg p-4`}>
          <span className={`${config.iconSecondary} opacity-60 text-xs uppercase tracking-wider`}>Mini mantra</span>
          <div className="h-8 border-b border-dashed border-current/20 mt-2 max-w-xs mx-auto" />
        </div>
      </div>
    </>
  );
};
