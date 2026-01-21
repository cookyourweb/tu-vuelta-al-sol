'use client';

import { useStyle } from "@/context/StyleContext";
import { FooterLibro } from './MesCompleto';

interface TuAnioTuViajeProps {
  name: string;
}

export const CartaBienvenida = ({ name }: TuAnioTuViajeProps) => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`${config.iconSecondary} opacity-60 text-sm tracking-[0.3em] uppercase ${config.fontBody}`}>Carta de Bienvenida</span>
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient} mt-2`}>Querida {name},</h2>
      </div>

      <div className={`space-y-6 text-gray-700 leading-relaxed max-w-2xl mx-auto text-lg ${config.fontBody}`}>
        <p>
          Hoy empieza un nuevo ciclo.<br />
          No es un año más: es TU año.
        </p>

        <p>
          Cumples años, y el Sol vuelve al mismo lugar donde estaba cuando llegaste al mundo.
          Ese instante no es solo simbólico: es un portal.
        </p>

        <p>
          Este año no viene a exigirte más.<br />
          Viene a reordenarte por dentro.
        </p>

        <p>
          Tu carta natal habla de una persona intuitiva, sensible y profundamente perceptiva.
          Tu Retorno Solar confirma que este ciclo es menos visible, pero mucho más verdadero.
        </p>

        <p>
          Esta agenda no te dirá qué hacer.<br />
          Te ayudará a escucharte.<br />
          A bajar el ruido.<br />
          A confiar en tu ritmo.
        </p>

        <p className={`italic ${config.iconSecondary}`}>
          Estoy contigo durante este año.<br />
          No te empujo.<br />
          Te acompaño.
        </p>

        <p className="font-medium">
          Bienvenida a tu vuelta al Sol.
        </p>
      </div>

      <div className={`mt-auto text-right ${config.iconSecondary} opacity-60 italic ${config.fontBody}`}>
        Con amor cósmico ✧
      </div>

      <FooterLibro pagina={3} />
    </div>
  );
};

interface TemaCentralAnioProps {
  interpretacion?: string;
}

export const TemaCentralAnio = ({ interpretacion }: TemaCentralAnioProps) => {
  const { config } = useStyle();

  const esInterpretacionPersonalizada = !!interpretacion;

  return (
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`${config.iconSecondary} opacity-60 text-sm tracking-[0.3em] uppercase ${config.fontBody}`}>Tu Año, Tu Viaje</span>
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient} mt-2`}>El tema central de tu año</h2>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />

        {/* Indicador de interpretación personalizada */}
        {esInterpretacionPersonalizada ? (
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
            <span className="text-xs font-semibold text-purple-700">✨ Interpretación Personalizada</span>
          </div>
        ) : (
          <div className="mt-3 inline-flex flex-col items-center gap-3 px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 no-print">
            <span className="text-sm font-semibold text-amber-800">⚠️ Interpretación No Disponible</span>
            <p className="text-xs text-amber-700 text-center max-w-md">
              Para ver el tema central de tu año personalizado, necesitas generar primero tu <strong>Retorno Solar (Revolución Solar)</strong>.
            </p>
            <a
              href="/solar-return"
              className="mt-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all no-underline"
            >
              Generar Retorno Solar →
            </a>
            <p className="text-xs text-amber-600 italic mt-1">
              Una vez generado, recarga esta página para ver tu interpretación
            </p>
          </div>
        )}
      </div>

      <div className={`flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full ${config.fontBody}`}>
        {esInterpretacionPersonalizada ? (
          <div className={`${config.highlightSecondary} rounded-lg p-8 mb-8`}>
            <div className="space-y-4 text-gray-700 text-base leading-relaxed whitespace-pre-line">
              {interpretacion}
            </div>
          </div>
        ) : (
          <div className={`${config.highlightSecondary} rounded-lg p-8 mb-8 opacity-50`}>
            <div className="space-y-6 text-gray-500 text-lg leading-relaxed italic text-center">
              <p>
                Esta página mostrará el tema central de tu año solar<br />
                una vez que generes tu Retorno Solar.
              </p>
              <p className="text-sm">
                El Retorno Solar es tu carta astrológica anual,<br />
                calculada para el momento exacto en que el Sol regresa<br />
                a la posición que tenía cuando naciste.
              </p>
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <span className={`${config.iconSecondary} opacity-40 text-2xl`}>☉</span>
        </div>
      </div>

      <FooterLibro pagina={4} />
    </div>
  );
};

export const LoQueVieneAMover = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient}`}>Lo que este año viene a mover</h2>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>

      <div className={`flex-1 grid grid-cols-1 gap-6 max-w-2xl mx-auto w-full ${config.fontBody}`}>
        <div className={`${config.highlightPrimary} rounded-lg p-6`}>
          <h3 className={`${config.fontDisplay} ${config.iconPrimary} font-medium mb-3`}>En tu interior</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Silencios necesarios.</li>
            <li>• Procesos inconscientes que por fin salen a la luz.</li>
            <li>• Una redefinición profunda de quién eres cuando no te están mirando.</li>
          </ul>
        </div>

        <div className={`${config.highlightSecondary} rounded-lg p-6`}>
          <h3 className={`${config.fontDisplay} ${config.iconSecondary} font-medium mb-3`}>En tus relaciones</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Menos personajes.</li>
            <li>• Más verdad.</li>
            <li>• Vínculos que respeten tu espacio interno.</li>
          </ul>
        </div>

        <div className={`${config.highlightAccent} rounded-lg p-6`}>
          <h3 className={`${config.fontDisplay} ${config.iconAccent} font-medium mb-3`}>En tu vida práctica</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Pausas estratégicas.</li>
            <li>• Decisiones que se gestan antes de ejecutarse.</li>
            <li>• Cerrar ciclos antes de abrir otros.</li>
          </ul>
        </div>
      </div>

      <FooterLibro pagina={6} />
    </div>
  );
};

export const LoQuePideSoltar = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient}`}>Lo que este año te pide soltar</h2>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>

      <div className={`flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full ${config.fontBody}`}>
        <p className="text-gray-600 text-center mb-8 italic text-lg">
          No puedes avanzar cargando lo que ya no te pertenece.<br />
          Este año te invita a dejar ir:
        </p>

        <div className="space-y-6">
          <div className={`flex items-start gap-4 ${config.highlightPrimary} rounded-lg p-4`}>
            <span className={`${config.iconSecondary} text-2xl`}>☽</span>
            <span className="text-gray-700">La necesidad de validación externa</span>
          </div>
          <div className={`flex items-start gap-4 ${config.highlightSecondary} rounded-lg p-4`}>
            <span className={`${config.iconSecondary} text-2xl`}>☽</span>
            <span className="text-gray-700">La urgencia por demostrar</span>
          </div>
          <div className={`flex items-start gap-4 ${config.highlightAccent} rounded-lg p-4`}>
            <span className={`${config.iconSecondary} text-2xl`}>☽</span>
            <span className="text-gray-700">El miedo a "no estar haciendo suficiente"</span>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm italic">
            "Soltar no es perder.<br />Es hacer espacio para lo nuevo."
          </p>
        </div>
      </div>

      <FooterLibro pagina={8} />
    </div>
  );
};

export const PaginaIntencionAnual = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`${config.iconSecondary} text-4xl`}>✧</span>
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient} mt-4`}>Mi intención para esta vuelta al Sol</h2>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>

      <div className={`flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full ${config.fontBody}`}>
        <p className="text-gray-500 text-center mb-8 text-sm italic">
          (Espacio de escritura libre)
        </p>

        <div className={`${config.highlightPrimary} rounded-lg p-8`}>
          <div className="space-y-8">
            <div className={`h-24 border-b border-dashed ${config.iconSecondary} opacity-30`} />
            <div className={`h-24 border-b border-dashed ${config.iconSecondary} opacity-30`} />
            <div className={`h-24 border-b border-dashed ${config.iconSecondary} opacity-30`} />
            <div className={`h-24 border-b border-dashed ${config.iconSecondary} opacity-30`} />
            <div className="h-24" />
          </div>
        </div>
      </div>

      <div className={`text-center ${config.iconSecondary} opacity-40 text-xs mt-4 ${config.fontBody}`}>
        Página de escritura libre
      </div>

      <FooterLibro pagina={7} />
    </div>
  );
};
