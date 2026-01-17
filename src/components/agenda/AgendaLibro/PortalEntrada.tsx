'use client';

import { useStyle } from "@/context/StyleContext";
import { FooterLibro } from './MesCompleto';
import { Sun, Moon } from 'lucide-react';

interface PortalEntradaProps {
  name: string;
  startDate: Date;
  endDate: Date;
  sunSign?: string;
  moonSign?: string;
  ascendant?: string;
}

export const PortadaPersonalizada = ({
  name,
  startDate,
  endDate,
  sunSign = "Acuario",
  moonSign = "Piscis",
  ascendant = "Ascendente Acuario"
}: PortalEntradaProps) => {
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  const { config } = useStyle();

  return (
    <div className={`print-page print-no-bg flex flex-col items-center justify-center text-center p-12 relative overflow-hidden ${config.headerBg} ${config.pattern}`}>
      {/* Decorative circles */}
      <div className={`absolute top-20 left-20 w-32 h-32 border ${config.headerText} opacity-20 rounded-full`} />
      <div className={`absolute bottom-20 right-20 w-48 h-48 border ${config.headerText} opacity-10 rounded-full`} />
      <div className={`absolute top-1/2 left-1/4 w-64 h-64 border ${config.headerText} opacity-5 rounded-full -translate-y-1/2`} />

      <div className="relative z-10 space-y-6">
        {/* Título principal */}
        <h1 className={`${config.fontDisplay} text-6xl md:text-7xl ${config.headerText} tracking-wide`}>
          Tu Vuelta al Sol
        </h1>

        <div className={`${config.headerText} opacity-60 text-sm tracking-[0.4em] uppercase ${config.fontBody}`}>
          Agenda Astrológica Personalizada
        </div>

        {/* Año del ciclo */}
        <div className={`text-4xl md:text-5xl font-light ${config.headerText} opacity-90 ${config.fontBody} mt-6`}>
          {startYear}–{endYear}
        </div>

        <div className={config.divider + " w-24 mx-auto my-8"} />

        {/* Iconos astrológicos */}
        <div className={`flex items-center justify-center gap-6 text-3xl ${config.headerText} opacity-70 my-6`}>
          <Sun className="w-10 h-10" />
          <span>•</span>
          <Moon className="w-10 h-10" />
          <span>•</span>
          <span className="text-4xl">↑</span>
        </div>

        {/* Datos astrológicos */}
        <div className={`text-lg ${config.headerText} opacity-80 ${config.fontBody} max-w-2xl mx-auto`}>
          Sol en {sunSign} • Luna en {moonSign} • {ascendant}
        </div>

        <div className={config.divider + " w-16 mx-auto my-8"} />

        {/* Mensaje final */}
        <div className={`mt-10 text-base ${config.headerText} opacity-70 max-w-md mx-auto leading-relaxed ${config.fontBody}`}>
          <p>Tu carta dice quién eres.</p>
          <p>Tu retorno muestra qué se activa.</p>
          <p>La agenda te enseña cómo vivirlo.</p>
        </div>
      </div>

      {/* Sun symbol en el fondo */}
      <div className={`absolute bottom-12 ${config.headerText} opacity-15 text-8xl`}>
        ☉
      </div>
    </div>
  );
};

export const PaginaIntencion = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-12">
        <h2 className={`${config.fontDisplay} text-3xl mb-4 ${config.titleGradient}`}>Este libro es tu espacio</h2>
        <div className={config.divider + " w-16 mx-auto"} />
      </div>

      <div className={`space-y-8 text-gray-700 leading-relaxed max-w-2xl mx-auto ${config.fontBody}`}>
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

        <div className={`border-l-4 pl-6 italic text-gray-600 ${config.cardBorder}`}>
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

      <FooterLibro pagina={2} />
    </div>
  );
};
