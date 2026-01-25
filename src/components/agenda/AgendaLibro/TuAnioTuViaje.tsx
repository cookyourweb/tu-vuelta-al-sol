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
  srInterpretation?: any; // Interpretación completa del SR
  onGenerateSolarReturn?: () => void;
  isGenerating?: boolean;
}

export const TemaCentralAnio = ({
  interpretacion,
  srInterpretation,
  onGenerateSolarReturn,
  isGenerating = false
}: TemaCentralAnioProps) => {
  const { config } = useStyle();

  const esInterpretacionPersonalizada = !!interpretacion;
  const aperturaAnual = srInterpretation?.apertura_anual;

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
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                <span className="text-sm font-semibold text-amber-800">✨ Generando tu Retorno Solar...</span>
                <p className="text-xs text-amber-700 text-center max-w-md">
                  Esto puede tomar 1-2 minutos. Estamos interpretando tu carta astrológica anual.
                </p>
              </>
            ) : (
              <>
                <span className="text-sm font-semibold text-amber-800">⚠️ Interpretación No Disponible</span>
                <p className="text-xs text-amber-700 text-center max-w-md">
                  Para ver el tema central de tu año personalizado, necesitas generar tu <strong>Retorno Solar (Revolución Solar)</strong>.
                </p>
                {onGenerateSolarReturn ? (
                  <>
                    <button
                      onClick={onGenerateSolarReturn}
                      className="mt-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
                    >
                      ✨ Generar Ahora (1-2 min)
                    </button>
                    <p className="text-xs text-amber-600 italic">
                      O visita <a href="/solar-return" className="underline hover:text-amber-800">la página de Solar Return</a>
                    </p>
                  </>
                ) : (
                  <a
                    href="/solar-return"
                    className="mt-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all no-underline"
                  >
                    Generar Retorno Solar →
                  </a>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className={`flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full ${config.fontBody}`}>
        {esInterpretacionPersonalizada ? (
          <>
            {/* Tema Central */}
            <div className={`${config.highlightPrimary} rounded-lg p-8 mb-6`}>
              <h3 className={`${config.fontDisplay} ${config.iconPrimary} font-medium mb-4 text-lg`}>El tema central</h3>
              <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                {interpretacion}
              </div>
            </div>

            {/* Eje del Año */}
            {aperturaAnual?.eje_del_ano && (
              <div className={`${config.highlightSecondary} rounded-lg p-6 mb-4`}>
                <h3 className={`${config.fontDisplay} ${config.iconSecondary} font-medium mb-3`}>El eje del año</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {aperturaAnual.eje_del_ano}
                </div>
              </div>
            )}

            {/* Cómo se Siente */}
            {aperturaAnual?.como_se_siente && (
              <div className={`${config.highlightAccent} rounded-lg p-6 mb-4`}>
                <h3 className={`${config.fontDisplay} ${config.iconAccent} font-medium mb-3`}>Cómo se siente este año</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {aperturaAnual.como_se_siente}
                </div>
              </div>
            )}

            {/* Conexión Natal */}
            {aperturaAnual?.conexion_natal && (
              <div className={`${config.highlightPrimary} rounded-lg p-6`}>
                <h3 className={`${config.fontDisplay} ${config.iconPrimary} font-medium mb-3`}>Conexión con tu carta natal</h3>
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {aperturaAnual.conexion_natal}
                </div>
              </div>
            )}
          </>
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

interface LoQueVieneMoverProps {
  facilidad?: string;
  incomodidad?: string;
  medida_del_ano?: string;
  actitud_nueva?: string;
}

export const LoQueVieneAMover = ({
  facilidad,
  incomodidad,
  medida_del_ano,
  actitud_nueva
}: LoQueVieneMoverProps) => {
  const { config } = useStyle();

  const tieneContenidoPersonalizado = !!(facilidad || incomodidad || medida_del_ano || actitud_nueva);

  return (
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`${config.iconSecondary} opacity-60 text-sm tracking-[0.3em] uppercase ${config.fontBody}`}>Tu Año, Tu Viaje</span>
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient} mt-2`}>
          Cómo se vive siendo tú este año
        </h2>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />

        {!tieneContenidoPersonalizado && (
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg no-print">
            <span className="text-xs text-amber-700">⚠️ Genera tu Retorno Solar para ver contenido personalizado</span>
          </div>
        )}
      </div>

      <div className={`flex-1 space-y-6 max-w-2xl mx-auto w-full ${config.fontBody}`}>
        {tieneContenidoPersonalizado ? (
          <>
            {/* Medida del Año */}
            {medida_del_ano && (
              <div className={`${config.highlightAccent} rounded-lg p-6`}>
                <h3 className={`${config.fontDisplay} ${config.iconAccent} font-medium mb-3`}>📏 La medida del año</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {medida_del_ano}
                </div>
              </div>
            )}

            {/* Lo que fluye naturalmente */}
            {facilidad && (
              <div className={`${config.highlightPrimary} rounded-lg p-6`}>
                <h3 className={`${config.fontDisplay} ${config.iconPrimary} font-medium mb-3`}>✅ Lo que fluye naturalmente</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {facilidad}
                </div>
              </div>
            )}

            {/* Lo que te incomoda */}
            {incomodidad && (
              <div className={`${config.highlightSecondary} rounded-lg p-6`}>
                <h3 className={`${config.fontDisplay} ${config.iconSecondary} font-medium mb-3`}>⚠️ Lo que te incomoda</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {incomodidad}
                </div>
              </div>
            )}

            {/* Actitud Nueva */}
            {actitud_nueva && (
              <div className={`${config.highlightPrimary} rounded-lg p-6`}>
                <h3 className={`${config.fontDisplay} ${config.iconPrimary} font-medium mb-3`}>✨ La actitud nueva que te pide el año</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {actitud_nueva}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Contenido genérico (fallback) */}
            <div className={`${config.highlightPrimary} rounded-lg p-6 opacity-50`}>
              <h3 className={`${config.fontDisplay} ${config.iconPrimary} font-medium mb-3`}>En tu interior</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Silencios necesarios.</li>
                <li>• Procesos inconscientes que por fin salen a la luz.</li>
                <li>• Una redefinición profunda de quién eres cuando no te están mirando.</li>
              </ul>
            </div>

            <div className={`${config.highlightSecondary} rounded-lg p-6 opacity-50`}>
              <h3 className={`${config.fontDisplay} ${config.iconSecondary} font-medium mb-3`}>En tus relaciones</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Menos personajes.</li>
                <li>• Más verdad.</li>
                <li>• Vínculos que respeten tu espacio interno.</li>
              </ul>
            </div>

            <div className={`${config.highlightAccent} rounded-lg p-6 opacity-50`}>
              <h3 className={`${config.fontDisplay} ${config.iconAccent} font-medium mb-3`}>En tu vida práctica</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Pausas estratégicas.</li>
                <li>• Decisiones que se gestan antes de ejecutarse.</li>
                <li>• Cerrar ciclos antes de abrir otros.</li>
              </ul>
            </div>
          </>
        )}
      </div>

      <FooterLibro pagina={5} />
    </div>
  );
};

interface LoQuePideSoltarProps {
  reflejos_obsoletos?: string;
  sombras?: string[];
}

export const LoQuePideSoltar = ({ reflejos_obsoletos, sombras }: LoQuePideSoltarProps) => {
  const { config } = useStyle();

  const tieneContenidoPersonalizado = !!(reflejos_obsoletos || (sombras && sombras.length > 0));

  return (
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient}`}>Lo que este año te pide soltar</h2>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />

        {!tieneContenidoPersonalizado && (
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg no-print">
            <span className="text-xs text-amber-700">⚠️ Genera tu Retorno Solar para ver contenido personalizado</span>
          </div>
        )}
      </div>

      <div className={`flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full ${config.fontBody}`}>
        <p className="text-gray-600 text-center mb-8 italic text-lg">
          No puedes avanzar cargando lo que ya no te pertenece.<br />
          Este año te invita a dejar ir:
        </p>

        <div className="space-y-6">
          {tieneContenidoPersonalizado ? (
            <>
              {/* Reflejos obsoletos personalizados */}
              {reflejos_obsoletos && (
                <div className={`${config.highlightPrimary} rounded-lg p-6`}>
                  <h3 className={`${config.fontDisplay} ${config.iconPrimary} font-medium mb-3`}>🔄 Reflejos obsoletos</h3>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {reflejos_obsoletos}
                  </div>
                </div>
              )}

              {/* Sombras del año */}
              {sombras && sombras.length > 0 && (
                <div className="space-y-4">
                  <h3 className={`${config.fontDisplay} text-lg ${config.iconSecondary} font-medium text-center`}>⚠️ Sombras del año</h3>
                  {sombras.map((sombra, idx) => (
                    <div key={idx} className={`flex items-start gap-4 ${config.highlightSecondary} rounded-lg p-4`}>
                      <span className={`${config.iconSecondary} text-2xl`}>☽</span>
                      <span className="text-gray-700">{sombra}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Contenido genérico (fallback) */}
              <div className={`flex items-start gap-4 ${config.highlightPrimary} rounded-lg p-4 opacity-50`}>
                <span className={`${config.iconSecondary} text-2xl`}>☽</span>
                <span className="text-gray-700">La necesidad de validación externa</span>
              </div>
              <div className={`flex items-start gap-4 ${config.highlightSecondary} rounded-lg p-4 opacity-50`}>
                <span className={`${config.iconSecondary} text-2xl`}>☽</span>
                <span className="text-gray-700">La urgencia por demostrar</span>
              </div>
              <div className={`flex items-start gap-4 ${config.highlightAccent} rounded-lg p-4 opacity-50`}>
                <span className={`${config.iconSecondary} text-2xl`}>☽</span>
                <span className="text-gray-700">El miedo a "no estar haciendo suficiente"</span>
              </div>
            </>
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm italic">
            "Soltar no es perder.<br />Es hacer espacio para lo nuevo."
          </p>
        </div>
      </div>

      <FooterLibro pagina={6} />
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
