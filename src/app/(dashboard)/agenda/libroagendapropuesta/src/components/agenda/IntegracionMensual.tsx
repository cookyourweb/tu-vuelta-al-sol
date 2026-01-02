import { format } from "date-fns";
import { es } from "date-fns/locale";

interface IntegracionMensualProps {
  monthDate: Date;
}

export const IntegracionMensual = ({ monthDate }: IntegracionMensualProps) => {
  return (
    <div className="print-page bg-background p-12 flex flex-col">
      <div className="text-center mb-8">
        <span className="text-cosmic-gold/60 text-sm tracking-[0.3em] uppercase">Integración</span>
        <h2 className="font-display text-3xl text-cosmic-gold mt-2 capitalize">
          {format(monthDate, "MMMM", { locale: es })}
        </h2>
        <div className="w-16 h-px bg-cosmic-gold/30 mx-auto mt-4" />
      </div>
      
      <div className="flex-1 max-w-2xl mx-auto w-full space-y-6">
        <p className="text-foreground/60 italic text-center text-sm">
          Frases disparadoras, no instrucciones rígidas.
        </p>
        
        <div className="bg-cosmic-purple/10 border border-cosmic-gold/20 rounded-lg p-6">
          <h4 className="text-cosmic-gold font-medium mb-4">Qué aprendí este mes</h4>
          <div className="space-y-4">
            <div className="h-16 border-b border-dashed border-cosmic-gold/20" />
            <div className="h-16 border-b border-dashed border-cosmic-gold/20" />
            <div className="h-16" />
          </div>
        </div>
        
        <div className="bg-cosmic-purple/10 border border-cosmic-gold/20 rounded-lg p-6">
          <h4 className="text-cosmic-gold font-medium mb-4">Qué me movió emocionalmente</h4>
          <div className="space-y-4">
            <div className="h-16 border-b border-dashed border-cosmic-gold/20" />
            <div className="h-16 border-b border-dashed border-cosmic-gold/20" />
            <div className="h-16" />
          </div>
        </div>
        
        <div className="bg-cosmic-purple/10 border border-cosmic-gold/20 rounded-lg p-6">
          <h4 className="text-cosmic-gold font-medium mb-4">Qué necesito ajustar</h4>
          <div className="space-y-4">
            <div className="h-16 border-b border-dashed border-cosmic-gold/20" />
            <div className="h-16" />
          </div>
        </div>
        
        <div className="bg-cosmic-purple/5 border border-cosmic-gold/10 rounded-lg p-6">
          <h4 className="text-cosmic-gold font-medium mb-4">Qué agradezco</h4>
          <div className="space-y-4">
            <div className="h-16 border-b border-dashed border-cosmic-gold/20" />
            <div className="h-16" />
          </div>
        </div>
      </div>
    </div>
  );
};
