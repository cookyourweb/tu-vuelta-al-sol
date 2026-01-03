'use client';

import { useStyle } from "@/context/StyleContext";

interface PortalEntradaProps {
  name: string;
  startDate: Date;
  endDate: Date;
  sunSign?: string;
  moonSign?: string;
  ascendant?: string;
  inspirationalQuote?: string;
}

export const PortadaPersonalizada = ({
  name,
  startDate,
  endDate,
  sunSign = "Piscis",
  moonSign = "Libra",
  ascendant = "Leo",
  inspirationalQuote = "Guiando almas a través de la transformación con sabiduría y amor"
}: PortalEntradaProps) => {
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  const { config } = useStyle();

  return (
    <div className={`print-page flex flex-col items-center justify-center text-center p-12 relative overflow-hidden
      ${config.headerBg} print:bg-transparent ${config.pattern}`}>

      {/* Decorative star icon top */}
      <div className={`relative z-10 mb-8 ${config.headerText} opacity-80 print:opacity-60`}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      </div>

      <div className="relative z-10 space-y-6">
        <h1 className={`${config.fontDisplay} text-5xl md:text-6xl ${config.headerText} tracking-wide font-bold`}>
          Tu Vuelta al Sol
        </h1>

        <div className={`${config.headerText} opacity-80 text-lg tracking-wider ${config.fontBody}`}>
          Agenda Astrológica Personalizada
        </div>

        <div className={`text-3xl font-light ${config.headerText} ${config.fontBody}`}>
          {startYear}-{endYear}
        </div>

        {/* Iconos astronómicos */}
        <div className={`flex items-center justify-center gap-6 text-3xl ${config.headerText} opacity-70 print:opacity-50 my-6`}>
          <span title="Sol">☉</span>
          <span title="Luna">☽</span>
          <span title="Ascendente">↗</span>
        </div>

        <div className={`text-3xl ${config.fontDisplay} ${config.headerText} mt-8`}>
          {name}
        </div>

        <div className={`text-base ${config.headerText} opacity-80 print:opacity-70 ${config.fontBody}`}>
          Sol en {sunSign} · Luna en {moonSign} · Ascendente {ascendant}
        </div>

        <div className={`mt-10 text-base ${config.headerText} opacity-75 print:opacity-65 italic max-w-lg mx-auto ${config.fontBody} leading-relaxed`}>
          "{inspirationalQuote}"
        </div>
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
    </div>
  );
};
