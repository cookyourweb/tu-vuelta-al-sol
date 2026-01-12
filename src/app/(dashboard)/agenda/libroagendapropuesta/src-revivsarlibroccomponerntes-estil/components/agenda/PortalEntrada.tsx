import { useStyle } from "@/contexts/StyleContext";

interface PortalEntradaProps {
  name: string;
  startDate: Date;
  endDate: Date;
  age?: number;
  birthInfo?: string;
  ascendant?: string;
}

export const PortadaPersonalizada = ({ 
  name, 
  startDate, 
  endDate, 
  age = 51,
  birthInfo = "10 de febrero de 1974 · Madrid",
  ascendant = "Ascendente Acuario"
}: PortalEntradaProps) => {
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  const { config } = useStyle();

  return (
    <div className={`print-page flex flex-col items-center justify-center text-center p-12 relative overflow-hidden ${config.headerBg} ${config.pattern}`}>
      {/* Decorative circles */}
      <div className={`absolute top-20 left-20 w-32 h-32 border ${config.headerText} opacity-20 rounded-full`} />
      <div className={`absolute bottom-20 right-20 w-48 h-48 border ${config.headerText} opacity-10 rounded-full`} />
      <div className={`absolute top-1/2 left-1/4 w-64 h-64 border ${config.headerText} opacity-5 rounded-full -translate-y-1/2`} />
      
      <div className="relative z-10 space-y-8">
        <div className={`${config.headerText} opacity-60 text-sm tracking-[0.5em] uppercase ${config.fontBody}`}>
          Agenda Astrológica Personalizada
        </div>
        
        <h1 className={`${config.fontDisplay} text-6xl md:text-7xl ${config.headerText} tracking-wide`}>
          Tu Vuelta al Sol
        </h1>
        
        <div className={`text-3xl md:text-4xl font-light ${config.headerText} opacity-90 ${config.fontBody}`}>
          {startYear}–{endYear}
        </div>
        
        <div className={config.divider + " w-24 mx-auto"} />
        
        <div className={`text-2xl md:text-3xl ${config.fontDisplay} ${config.headerText} opacity-90 mt-8`}>
          {name.toUpperCase()} · {age} años
        </div>
        
        <div className={`text-base ${config.headerText} opacity-70 ${config.fontBody}`}>
          ({birthInfo} · {ascendant})
        </div>
        
        <div className={`mt-12 text-lg ${config.headerText} opacity-70 italic max-w-md ${config.fontBody}`}>
          "No todo fue fácil.<br />Pero todo tuvo sentido."
        </div>
      </div>
      
      {/* Sun symbol */}
      <div className={`absolute bottom-12 ${config.headerText} opacity-20 text-8xl`}>
        ☉
      </div>
    </div>
  );
};

export const PaginaIntencion = () => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-background p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-12">
        <h2 className={`${config.fontDisplay} text-3xl mb-4 ${config.titleGradient}`}>Este libro es tu espacio</h2>
        <div className={config.divider + " w-16 mx-auto"} />
      </div>
      
      <div className={`space-y-8 text-foreground/80 leading-relaxed max-w-2xl mx-auto ${config.fontBody}`}>
        <p className="text-lg">
          Esta agenda no es un horóscopo.<br />
          No predice el futuro ni te dice qué hacer.
        </p>
        
        <p className="text-lg">
          Es un espacio de encuentro contigo misma.<br />
          Una consulta extendida de un año.<br />
          Una terapeuta simbólica en papel.
        </p>
        
        <p className="text-lg italic">
          Aquí no vienes a exigirte.<br />
          Vienes a escucharte.
        </p>
        
        <div className={`text-center ${config.iconSecondary} opacity-40 text-2xl my-8`}>
          ☽
        </div>
        
        <div className={`${config.highlightSecondary} rounded-lg p-6`}>
          <h3 className={`${config.fontDisplay} text-xl mb-4 ${config.titleGradient}`}>Cómo usar esta agenda</h3>
          <ul className={`space-y-3 text-sm ${config.fontBody}`}>
            <li className="flex items-start gap-3">
              <span className={config.iconSecondary}>☽</span>
              <span>No la leas de corrido. Vívela mes a mes, semana a semana.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className={config.iconSecondary}>☽</span>
              <span>Los rituales son invitaciones, no obligaciones. Si resuena, pruébalo.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className={config.iconSecondary}>☽</span>
              <span>Escribe sin filtro. Nadie más leerá estas páginas.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className={config.iconSecondary}>☽</span>
              <span>Vuelve a las páginas que necesites cuando las necesites.</span>
            </li>
          </ul>
        </div>
        
        <div className={`border-l-4 pl-6 italic text-foreground/60 ${config.cardBorder}`}>
          <p className={`mb-2 font-medium ${config.iconSecondary}`}>Advertencia amorosa:</p>
          <p>
            No todo se entiende de inmediato.<br />
            Algunas páginas cobrarán sentido meses después.<br /><br />
            Confía en el proceso, incluso cuando no lo entiendas.
          </p>
        </div>
      </div>
      
      <div className={`mt-auto text-center ${config.iconSecondary} opacity-40 text-sm`}>
        ✧
      </div>
    </div>
  );
};