import { format, addMonths } from "date-fns";
import { es } from "date-fns/locale";

interface CalendarioAnualProps {
  startDate: Date;
  endDate: Date;
}

export const LineaTiempoEmocional = ({ startDate, endDate }: CalendarioAnualProps) => {
  const months = [];
  let currentMonth = new Date(startDate);
  
  while (currentMonth <= endDate) {
    months.push(new Date(currentMonth));
    currentMonth = addMonths(currentMonth, 1);
  }

  return (
    <div className="print-page bg-background p-12 flex flex-col">
      <div className="text-center mb-8">
        <span className="text-cosmic-gold/60 text-sm tracking-[0.3em] uppercase">Calendario Astrológico</span>
        <h2 className="font-display text-3xl text-cosmic-gold mt-2">Línea del tiempo emocional</h2>
        <div className="w-16 h-px bg-cosmic-gold/30 mx-auto mt-4" />
      </div>
      
      <div className="flex-1 max-w-3xl mx-auto w-full">
        <p className="text-foreground/70 text-center mb-8 italic text-sm">
          Vista general de tu año: los momentos clave y los ciclos emocionales.
        </p>
        
        <div className="grid grid-cols-3 gap-3">
          {months.slice(0, 12).map((month, index) => (
            <div 
              key={index}
              className="bg-cosmic-purple/10 border border-cosmic-gold/20 rounded-lg p-3 text-center"
            >
              <span className="text-cosmic-gold font-medium text-sm">
                {format(month, "MMMM", { locale: es })}
              </span>
              <div className="h-12 border-b border-dashed border-cosmic-gold/20 mt-2" />
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-cosmic-purple/5 border border-cosmic-gold/10 rounded-lg p-6">
          <h4 className="text-cosmic-gold font-medium mb-3">Leyenda de intensidad:</h4>
          <div className="flex items-center justify-around text-sm text-foreground/60">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-cosmic-gold/20" />
              <span>Calma</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-cosmic-gold/50" />
              <span>Movimiento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-cosmic-gold" />
              <span>Intensidad</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MesesClaveYPuntosGiro = () => {
  return (
    <div className="print-page bg-background p-12 flex flex-col">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl text-cosmic-gold">Meses clave y puntos de giro</h2>
        <div className="w-16 h-px bg-cosmic-gold/30 mx-auto mt-4" />
      </div>
      
      <div className="flex-1 max-w-2xl mx-auto w-full space-y-4">
        <p className="text-foreground/70 text-center mb-6 italic text-sm">
          Los momentos del año donde algo importante se mueve, cambia o culmina.
        </p>
        
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="bg-cosmic-purple/10 border border-cosmic-gold/20 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-cosmic-gold font-display text-xl">{num}.</span>
              <div className="flex-1">
                <div className="h-6 border-b border-dashed border-cosmic-gold/20" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-cosmic-gold/60 text-xs">Mes:</span>
                <div className="h-6 border-b border-dashed border-cosmic-gold/20" />
              </div>
              <div>
                <span className="text-cosmic-gold/60 text-xs">Evento:</span>
                <div className="h-6 border-b border-dashed border-cosmic-gold/20" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-cosmic-gold/60 text-xs">Qué significa para ti:</span>
              <div className="h-12 border-b border-dashed border-cosmic-gold/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const GrandesAprendizajes = () => {
  return (
    <div className="print-page bg-background p-12 flex flex-col">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl text-cosmic-gold">Grandes aprendizajes del ciclo</h2>
        <div className="w-16 h-px bg-cosmic-gold/30 mx-auto mt-4" />
      </div>
      
      <div className="flex-1 max-w-2xl mx-auto w-full space-y-6">
        <p className="text-foreground/70 text-center italic text-sm">
          Los temas que este año viene a enseñarte, basados en los tránsitos mayores.
        </p>
        
        <div className="space-y-4">
          <div className="bg-cosmic-purple/10 border border-cosmic-gold/20 rounded-lg p-6">
            <h4 className="text-cosmic-gold font-medium mb-3 flex items-center gap-2">
              <span>♄</span> Saturno te enseña:
            </h4>
            <div className="h-20 border-b border-dashed border-cosmic-gold/20" />
          </div>
          
          <div className="bg-cosmic-purple/10 border border-cosmic-gold/20 rounded-lg p-6">
            <h4 className="text-cosmic-gold font-medium mb-3 flex items-center gap-2">
              <span>♃</span> Júpiter te expande:
            </h4>
            <div className="h-20 border-b border-dashed border-cosmic-gold/20" />
          </div>
          
          <div className="bg-cosmic-purple/10 border border-cosmic-gold/20 rounded-lg p-6">
            <h4 className="text-cosmic-gold font-medium mb-3 flex items-center gap-2">
              <span>♇</span> Plutón transforma:
            </h4>
            <div className="h-20 border-b border-dashed border-cosmic-gold/20" />
          </div>
        </div>
        
        <div className="text-center text-foreground/50 text-sm italic mt-8">
          "No viniste a sobrevivir el año. Viniste a transformarte."
        </div>
      </div>
    </div>
  );
};
