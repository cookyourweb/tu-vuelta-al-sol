import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Sparkles, Moon, Sun, Star, Compass } from "lucide-react";

interface AgendaCoverProps {
  name: string;
  startDate: Date;
  endDate: Date;
}

export const AgendaCover = ({ name, startDate, endDate }: AgendaCoverProps) => {
  return (
    <div className="print-page w-full h-[297mm] bg-card flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background pattern - light and elegant */}
      <div className="absolute inset-0 stars-bg-light opacity-30" />
      
      {/* Decorative circles */}
      <div className="absolute top-16 left-16 w-32 h-32 rounded-full border-2 border-cosmic-gold/20" />
      <div className="absolute top-12 left-12 w-40 h-40 rounded-full border border-cosmic-rose/10" />
      <div className="absolute bottom-20 right-16 w-24 h-24 rounded-full border-2 border-cosmic-purple/20" />
      <div className="absolute bottom-16 right-12 w-32 h-32 rounded-full border border-cosmic-gold/10" />

      {/* Top decoration - orbital design */}
      <div className="relative mb-12">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cosmic-gold via-cosmic-amber to-cosmic-rose flex items-center justify-center shadow-glow animate-spin-slow">
          <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-cosmic-gold" />
          </div>
        </div>
        <Moon className="absolute -left-10 top-1/2 -translate-y-1/2 w-8 h-8 text-cosmic-purple icon-cosmic" />
        <Sun className="absolute -right-10 top-1/2 -translate-y-1/2 w-8 h-8 text-cosmic-gold icon-gold" />
        <Star className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-6 h-6 text-cosmic-rose icon-accent" fill="currentColor" />
      </div>

      {/* Title */}
      <p className="text-cosmic-purple text-sm tracking-[0.5em] uppercase mb-3 font-medium">
        Agenda Astrológica Personalizada
      </p>
      
      <h1 className="font-display text-6xl md:text-7xl text-primary mb-2 text-center">
        Tu Vuelta al Sol
      </h1>
      
      <div className="divider-cosmic w-48 my-6" />

      {/* Name */}
      <div className="my-6">
        <p className="text-muted-foreground text-lg mb-2 text-center">
          Preparada especialmente para
        </p>
        <h2 className="font-display text-5xl text-cosmic-gold text-center">
          {name}
        </h2>
      </div>

      {/* Date range */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-4 px-8 py-4 bg-primary/5 border border-primary/20 rounded-full">
          <Compass className="w-5 h-5 text-cosmic-purple" />
          <span className="text-foreground font-display text-lg">
            {format(startDate, "d MMMM yyyy", { locale: es })}
          </span>
          <span className="text-cosmic-gold text-xl">→</span>
          <span className="text-foreground font-display text-lg">
            {format(endDate, "d MMMM yyyy", { locale: es })}
          </span>
        </div>
      </div>

      {/* Bottom quote */}
      <div className="absolute bottom-24 left-0 right-0 text-center px-8">
        <p className="text-muted-foreground italic text-xl font-display">
          "El universo tiene un plan para ti"
        </p>
      </div>

      {/* Corner decorations - geometric */}
      <div className="absolute top-8 left-8">
        <div className="w-20 h-20 border-t-2 border-l-2 border-cosmic-purple/40 rounded-tl-2xl" />
        <div className="absolute top-2 left-2 w-16 h-16 border-t border-l border-cosmic-gold/30 rounded-tl-xl" />
      </div>
      <div className="absolute top-8 right-8">
        <div className="w-20 h-20 border-t-2 border-r-2 border-cosmic-purple/40 rounded-tr-2xl" />
        <div className="absolute top-2 right-2 w-16 h-16 border-t border-r border-cosmic-gold/30 rounded-tr-xl" />
      </div>
      <div className="absolute bottom-8 left-8">
        <div className="w-20 h-20 border-b-2 border-l-2 border-cosmic-purple/40 rounded-bl-2xl" />
        <div className="absolute bottom-2 left-2 w-16 h-16 border-b border-l border-cosmic-gold/30 rounded-bl-xl" />
      </div>
      <div className="absolute bottom-8 right-8">
        <div className="w-20 h-20 border-b-2 border-r-2 border-cosmic-purple/40 rounded-br-2xl" />
        <div className="absolute bottom-2 right-2 w-16 h-16 border-b border-r border-cosmic-gold/30 rounded-br-xl" />
      </div>
    </div>
  );
};
