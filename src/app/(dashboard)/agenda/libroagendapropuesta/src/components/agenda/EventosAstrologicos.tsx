export const PaginaLunaNueva = () => {
  return (
    <div className="print-page bg-background p-12 flex flex-col">
      <div className="text-center mb-8">
        <span className="text-cosmic-gold text-5xl">🌑</span>
        <h2 className="font-display text-3xl text-cosmic-gold mt-4">Luna Nueva</h2>
        <div className="w-16 h-px bg-cosmic-gold/30 mx-auto mt-4" />
      </div>
      
      <div className="flex-1 max-w-2xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-cosmic-purple/10 border border-cosmic-gold/20 rounded-lg p-4">
            <span className="text-cosmic-gold/60 text-xs">Fecha</span>
            <div className="h-8 border-b border-dashed border-cosmic-gold/20 mt-1" />
          </div>
          <div className="bg-cosmic-purple/10 border border-cosmic-gold/20 rounded-lg p-4">
            <span className="text-cosmic-gold/60 text-xs">Signo</span>
            <div className="h-8 border-b border-dashed border-cosmic-gold/20 mt-1" />
          </div>
        </div>
        
        <div className="bg-cosmic-purple/10 border border-cosmic-gold/20 rounded-lg p-6">
          <h4 className="text-cosmic-gold font-medium mb-3">Intención</h4>
          <p className="text-foreground/60 text-sm mb-4">
            La Luna Nueva es el momento de sembrar. ¿Qué quieres plantar en este ciclo?
          </p>
          <div className="space-y-4">
            <div className="h-16 border-b border-dashed border-cosmic-gold/20" />
            <div className="h-16 border-b border-dashed border-cosmic-gold/20" />
          </div>
        </div>
        
        <div className="bg-cosmic-purple/10 border border-cosmic-gold/20 rounded-lg p-6">
          <h4 className="text-cosmic-gold font-medium mb-3">Ejercicio</h4>
          <div className="space-y-4">
            <div className="h-20 border-b border-dashed border-cosmic-gold/20" />
            <div className="h-20 border-b border-dashed border-cosmic-gold/20" />
          </div>
        </div>
        
        <div className="bg-cosmic-purple/5 border border-cosmic-gold/10 rounded-lg p-6">
          <h4 className="text-cosmic-gold font-medium mb-3">Escribe tu intención</h4>
          <div className="space-y-4">
            <div className="h-16 border-b border-dashed border-cosmic-gold/20" />
            <div className="h-16 border-b border-dashed border-cosmic-gold/20" />
            <div className="h-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const PaginaLunaLlena = () => {
  return (
    <div className="print-page bg-background p-12 flex flex-col">
      <div className="text-center mb-8">
        <span className="text-cosmic-gold text-5xl">🌕</span>
        <h2 className="font-display text-3xl text-cosmic-gold mt-4">Luna Llena</h2>
        <div className="w-16 h-px bg-cosmic-gold/30 mx-auto mt-4" />
      </div>
      
      <div className="flex-1 max-w-2xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-cosmic-purple/10 border border-cosmic-gold/20 rounded-lg p-4">
            <span className="text-cosmic-gold/60 text-xs">Fecha</span>
            <div className="h-8 border-b border-dashed border-cosmic-gold/20 mt-1" />
          </div>
          <div className="bg-cosmic-purple/10 border border-cosmic-gold/20 rounded-lg p-4">
            <span className="text-cosmic-gold/60 text-xs">Signo</span>
            <div className="h-8 border-b border-dashed border-cosmic-gold/20 mt-1" />
          </div>
        </div>
        
        <div className="bg-cosmic-purple/10 border border-cosmic-gold/20 rounded-lg p-6">
          <h4 className="text-cosmic-gold font-medium mb-3">Culminación</h4>
          <p className="text-foreground/60 text-sm mb-4">
            La Luna Llena ilumina lo que estaba oculto. ¿Qué ves ahora con claridad?
          </p>
          <div className="space-y-4">
            <div className="h-16 border-b border-dashed border-cosmic-gold/20" />
            <div className="h-16 border-b border-dashed border-cosmic-gold/20" />
          </div>
        </div>
        
        <div className="bg-cosmic-purple/10 border border-cosmic-gold/20 rounded-lg p-6">
          <h4 className="text-cosmic-gold font-medium mb-3">Liberación</h4>
          <p className="text-foreground/60 text-sm mb-4">
            Es momento de soltar. ¿Qué ya no necesitas cargar?
          </p>
          <div className="space-y-4">
            <div className="h-16 border-b border-dashed border-cosmic-gold/20" />
            <div className="h-16" />
          </div>
        </div>
        
        <div className="bg-cosmic-purple/5 border border-cosmic-gold/10 rounded-lg p-6">
          <h4 className="text-cosmic-gold font-medium mb-3">Cierre emocional</h4>
          <div className="space-y-4">
            <div className="h-16 border-b border-dashed border-cosmic-gold/20" />
            <div className="h-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const PaginaEclipse = () => {
  return (
    <div className="print-page bg-cosmic-gradient p-12 flex flex-col relative overflow-hidden">
      <div className="stars-bg absolute inset-0 opacity-30" />
      
      <div className="relative z-10 text-center mb-8">
        <span className="text-cosmic-gold text-5xl">◐</span>
        <h2 className="font-display text-3xl text-cosmic-gold mt-4">Eclipse</h2>
        <p className="text-foreground/60 mt-2">Portal de transformación</p>
        <div className="w-16 h-px bg-cosmic-gold/30 mx-auto mt-4" />
      </div>
      
      <div className="relative z-10 flex-1 max-w-2xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-cosmic-purple/30 border border-cosmic-gold/30 rounded-lg p-4">
            <span className="text-cosmic-gold/60 text-xs">Fecha</span>
            <div className="h-8 border-b border-dashed border-cosmic-gold/30 mt-1" />
          </div>
          <div className="bg-cosmic-purple/30 border border-cosmic-gold/30 rounded-lg p-4">
            <span className="text-cosmic-gold/60 text-xs">Tipo</span>
            <div className="h-8 border-b border-dashed border-cosmic-gold/30 mt-1" />
          </div>
        </div>
        
        <div className="bg-cosmic-purple/30 border border-cosmic-gold/30 rounded-lg p-6">
          <h4 className="text-cosmic-gold font-medium mb-3">Qué cambia</h4>
          <p className="text-foreground/60 text-sm mb-4">
            Los eclipses son puntos de inflexión. Algo termina para que algo nuevo comience.
          </p>
          <div className="space-y-4">
            <div className="h-16 border-b border-dashed border-cosmic-gold/30" />
            <div className="h-16" />
          </div>
        </div>
        
        <div className="bg-cosmic-purple/30 border border-cosmic-gold/30 rounded-lg p-6">
          <h4 className="text-cosmic-gold font-medium mb-3">Qué se revela</h4>
          <div className="space-y-4">
            <div className="h-16 border-b border-dashed border-cosmic-gold/30" />
            <div className="h-16" />
          </div>
        </div>
        
        <div className="bg-cosmic-purple/20 border border-cosmic-gold/20 rounded-lg p-6 text-center">
          <p className="text-cosmic-gold/80 italic">
            "Qué no vuelve a ser igual"
          </p>
          <div className="h-16 border-b border-dashed border-cosmic-gold/30 mt-4 max-w-sm mx-auto" />
        </div>
      </div>
    </div>
  );
};
