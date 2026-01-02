interface CierreCicloProps {
  name: string;
}

export const QuienEraQuienSoy = () => {
  return (
    <div className="print-page bg-background p-12 flex flex-col">
      <div className="text-center mb-8">
        <span className="text-cosmic-gold/60 text-sm tracking-[0.3em] uppercase">Cierre de Ciclo</span>
        <h2 className="font-display text-3xl text-cosmic-gold mt-2">El viaje completado</h2>
        <div className="w-16 h-px bg-cosmic-gold/30 mx-auto mt-4" />
      </div>
      
      <div className="flex-1 max-w-2xl mx-auto w-full space-y-6">
        <div className="bg-cosmic-purple/10 border border-cosmic-gold/20 rounded-lg p-6">
          <h4 className="text-cosmic-gold font-medium mb-4">Quién era cuando empecé este año</h4>
          <div className="space-y-4">
            <div className="h-20 border-b border-dashed border-cosmic-gold/20" />
            <div className="h-20 border-b border-dashed border-cosmic-gold/20" />
            <div className="h-20" />
          </div>
        </div>
        
        <div className="bg-cosmic-purple/10 border border-cosmic-gold/20 rounded-lg p-6">
          <h4 className="text-cosmic-gold font-medium mb-4">Quién soy ahora</h4>
          <div className="space-y-4">
            <div className="h-20 border-b border-dashed border-cosmic-gold/20" />
            <div className="h-20 border-b border-dashed border-cosmic-gold/20" />
            <div className="h-20" />
          </div>
        </div>
        
        <div className="bg-cosmic-purple/10 border border-cosmic-gold/20 rounded-lg p-6">
          <h4 className="text-cosmic-gold font-medium mb-4">Qué versión mía nació</h4>
          <div className="space-y-4">
            <div className="h-20 border-b border-dashed border-cosmic-gold/20" />
            <div className="h-20" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const PreparacionProximaVuelta = () => {
  return (
    <div className="print-page bg-background p-12 flex flex-col">
      <div className="text-center mb-8">
        <span className="text-cosmic-gold text-4xl">☉</span>
        <h2 className="font-display text-3xl text-cosmic-gold mt-4">Preparación para la próxima vuelta al Sol</h2>
        <div className="w-16 h-px bg-cosmic-gold/30 mx-auto mt-4" />
      </div>
      
      <div className="flex-1 max-w-2xl mx-auto w-full space-y-6">
        <p className="text-foreground/70 italic text-center">
          El ciclo termina, pero tú continúas.
        </p>
        
        <div className="bg-cosmic-purple/10 border border-cosmic-gold/20 rounded-lg p-6">
          <h4 className="text-cosmic-gold font-medium mb-4">Lo que llevo conmigo al próximo año</h4>
          <div className="space-y-4">
            <div className="h-16 border-b border-dashed border-cosmic-gold/20" />
            <div className="h-16 border-b border-dashed border-cosmic-gold/20" />
            <div className="h-16" />
          </div>
        </div>
        
        <div className="bg-cosmic-purple/10 border border-cosmic-gold/20 rounded-lg p-6">
          <h4 className="text-cosmic-gold font-medium mb-4">Lo que dejo aquí</h4>
          <div className="space-y-4">
            <div className="h-16 border-b border-dashed border-cosmic-gold/20" />
            <div className="h-16 border-b border-dashed border-cosmic-gold/20" />
            <div className="h-16" />
          </div>
        </div>
        
        <div className="bg-cosmic-purple/10 border border-cosmic-gold/20 rounded-lg p-6">
          <h4 className="text-cosmic-gold font-medium mb-4">Mi deseo para el próximo ciclo</h4>
          <div className="space-y-4">
            <div className="h-16 border-b border-dashed border-cosmic-gold/20" />
            <div className="h-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CartaCierre = ({ name }: CierreCicloProps) => {
  return (
    <div className="print-page bg-background p-12 flex flex-col">
      <div className="text-center mb-8">
        <span className="text-cosmic-gold text-3xl">✧</span>
        <h2 className="font-display text-3xl text-cosmic-gold mt-4">Carta de cierre</h2>
        <div className="w-16 h-px bg-cosmic-gold/30 mx-auto mt-4" />
      </div>
      
      <div className="flex-1 max-w-2xl mx-auto w-full">
        <div className="bg-cosmic-purple/5 border border-cosmic-gold/10 rounded-lg p-8">
          <p className="text-cosmic-gold mb-6">Querida {name},</p>
          
          <p className="text-foreground/70 mb-6 leading-relaxed">
            Has llegado al final de esta vuelta al sol. No importa si fue fácil o difícil, 
            si todo salió como esperabas o si el universo tenía otros planes. 
            Lo que importa es que estás aquí, leyendo estas palabras, 
            habiendo atravesado otro año de tu vida.
          </p>
          
          <p className="text-foreground/70 mb-6 leading-relaxed">
            Cada página de esta agenda fue testigo de algo. Cada pregunta que respondiste 
            (o dejaste en blanco) fue parte del proceso. Cada ritual que hiciste 
            (o ignoraste) estaba bien tal como fue.
          </p>
          
          <p className="text-foreground/70 mb-6 leading-relaxed">
            Porque esta agenda nunca fue sobre hacer todo perfecto. 
            Fue sobre acompañarte mientras vivías.
          </p>
          
          <p className="text-cosmic-gold/80 italic text-center text-lg mt-8">
            "Nada fue casual. Todo fue parte del proceso."
          </p>
        </div>
        
        <div className="mt-8 text-center text-foreground/50 text-sm">
          Hasta la próxima vuelta al sol ✧
        </div>
      </div>
    </div>
  );
};

export const PaginaFinalBlanca = () => {
  return (
    <div className="print-page bg-background p-12 flex flex-col">
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl text-cosmic-gold">Lo que todavía no sé</h2>
        <div className="w-16 h-px bg-cosmic-gold/30 mx-auto mt-4" />
      </div>
      
      <div className="flex-1 max-w-2xl mx-auto w-full">
        <p className="text-foreground/50 italic text-center text-sm mb-8">
          Una página en blanco para lo que aún está por descubrir.
        </p>
        
        <div className="bg-cosmic-purple/5 border border-cosmic-gold/10 rounded-lg p-8 h-[calc(100%-6rem)]">
          <div className="h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="h-16 border-b border-dashed border-cosmic-gold/10" />
              <div className="h-16 border-b border-dashed border-cosmic-gold/10" />
              <div className="h-16 border-b border-dashed border-cosmic-gold/10" />
              <div className="h-16 border-b border-dashed border-cosmic-gold/10" />
              <div className="h-16 border-b border-dashed border-cosmic-gold/10" />
              <div className="h-16 border-b border-dashed border-cosmic-gold/10" />
              <div className="h-16 border-b border-dashed border-cosmic-gold/10" />
              <div className="h-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Contraportada = () => {
  return (
    <div className="print-page bg-cosmic-gradient flex flex-col items-center justify-center text-center p-12 relative overflow-hidden">
      <div className="stars-bg absolute inset-0 opacity-20" />
      
      <div className="relative z-10 space-y-8 max-w-xl">
        <div className="text-cosmic-gold text-6xl">☉</div>
        
        <div className="space-y-4">
          <p className="text-foreground/80 text-xl italic leading-relaxed">
            "No todo fue fácil.
          </p>
          <p className="text-cosmic-gold text-2xl font-display">
            Pero todo tuvo sentido."
          </p>
        </div>
        
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto" />
        
        <p className="text-foreground/50 text-sm">
          Tu Vuelta al Sol
        </p>
        
        <p className="text-foreground/40 text-xs">
          Agenda Astrológica Personalizada
        </p>
      </div>
      
      <div className="absolute bottom-8 text-cosmic-gold/20 text-sm">
        tuvueltaalsol.es
      </div>
    </div>
  );
};
