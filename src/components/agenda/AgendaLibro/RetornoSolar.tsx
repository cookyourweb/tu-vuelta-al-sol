'use client';

import { useStyle } from "@/context/StyleContext";
import { FooterLibro } from './MesCompleto';
import { Check } from 'lucide-react';

export const QueEsRetornoSolar = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`${config.iconSecondary} opacity-60 text-sm tracking-[0.3em] uppercase ${config.fontBody}`}>Retorno Solar</span>
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient} mt-2`}>Retorno Solar 2025–2026</h2>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>

      <div className={`flex-1 max-w-2xl mx-auto w-full space-y-6 ${config.fontBody}`}>
        <div className={`text-center ${config.iconSecondary} text-6xl mb-6`}>☉</div>

        <p className="text-gray-700 text-lg leading-relaxed">
          Cada año, en tu cumpleaños (o muy cerca de él), el Sol vuelve al grado exacto
          donde estaba cuando naciste. Ese momento es tu <span className={config.iconSecondary}>Retorno Solar</span>.
        </p>

        <p className="text-gray-600 leading-relaxed">
          La carta del Retorno Solar es un mapa energético para los próximos 365 días.
          No reemplaza tu carta natal, la complementa. Te muestra qué áreas de tu vida
          estarán más activas, qué necesitarás emocionalmente, y dónde encontrarás
          tus mayores aprendizajes.
        </p>

        <div className={`${config.highlightSecondary} rounded-lg p-6`}>
          <h4 className={`${config.fontDisplay} ${config.iconPrimary} font-medium mb-3`}>Lo que tu Retorno Solar revela:</h4>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="flex items-start gap-2">
              <span className={config.iconSecondary}>✧</span>
              <span>El enfoque principal del año (Ascendente)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className={config.iconSecondary}>✧</span>
              <span>Tu propósito visible (Sol)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className={config.iconSecondary}>✧</span>
              <span>Tus necesidades emocionales (Luna)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className={config.iconSecondary}>✧</span>
              <span>Las áreas que no podrás ignorar (Planetas angulares)</span>
            </li>
          </ul>
        </div>

        <p className="text-gray-500 italic text-center">
          "Tu cumpleaños no es solo una celebración. Es un portal."
        </p>
      </div>

      <FooterLibro pagina={10} />
    </div>
  );
};

export const AscendenteAnio = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`${config.iconSecondary} text-4xl`}>↑</span>
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient} mt-4`}>Ascendente del Retorno</h2>
        <p className={`text-gray-500 mt-2 ${config.fontBody}`}>Acuario – Casa 1 (identidad, enfoque vital)</p>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>

      <div className={`flex-1 max-w-2xl mx-auto w-full space-y-6 ${config.fontBody}`}>
        <div className={`${config.highlightPrimary} rounded-lg p-6`}>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Este año encaras la vida desde la honestidad radical contigo misma.
          </p>
          <div className="space-y-4">
            <div>
              <span className={`${config.iconSecondary} text-sm font-medium`}>Activa:</span>
              <p className="text-gray-700 mt-1">autenticidad · libertad interna · desapego sano</p>
            </div>
            <div>
              <span className={`${config.iconSecondary} text-sm font-medium`}>Reta:</span>
              <p className="text-gray-700 mt-1">tolerar no tener respuestas inmediatas</p>
            </div>
            <div>
              <span className={`${config.iconSecondary} text-sm font-medium`}>Cómo trabajarlo:</span>
              <p className="text-gray-700 mt-1">respetando tus tiempos y honrando el silencio</p>
            </div>
          </div>
        </div>
      </div>

      <FooterLibro pagina={11} />
    </div>
  );
};

// ============ COMPONENTE GENÉRICO PARA COMPARACIONES PLANETARIAS ============
interface ComparacionPlanetariaProps {
  planetName: string;
  planetSymbol: string;
  pageNumber: number;
  comparacion?: {
    natal: {
      posicion: string;
      descripcion: string;
    };
    solar_return: {
      posicion: string;
      descripcion: string;
    };
    choque: string;
    que_hacer: string;
    mandato_del_ano: string;
  };
}

const ComparacionPlanetaria = ({
  planetName,
  planetSymbol,
  pageNumber,
  comparacion
}: ComparacionPlanetariaProps) => {
  const { config } = useStyle();
  const tieneContenidoPersonalizado = !!comparacion;

  return (
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`${config.iconSecondary} text-4xl`}>{planetSymbol}</span>
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient} mt-4`}>
          {planetName} del Retorno
        </h2>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>

      <div className={`flex-1 max-w-2xl mx-auto w-full space-y-6 ${config.fontBody}`}>
        {tieneContenidoPersonalizado ? (
          <>
            {/* Natal */}
            <div className={`${config.highlightPrimary} rounded-lg p-6`}>
              <h3 className={`${config.fontDisplay} ${config.iconPrimary} font-medium mb-3 flex items-center gap-2`}>
                <span className="text-xl">{planetSymbol}</span>
                Tu {planetName} Natal
              </h3>
              <p className={`text-xs ${config.iconSecondary} mb-2`}>{comparacion.natal.posicion}</p>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {comparacion.natal.descripcion}
              </p>
            </div>

            {/* Solar Return */}
            <div className={`${config.highlightSecondary} rounded-lg p-6`}>
              <h3 className={`${config.fontDisplay} ${config.iconSecondary} font-medium mb-3 flex items-center gap-2`}>
                <span className="text-xl">☉</span>
                Tu {planetName} en Solar Return
              </h3>
              <p className={`text-xs ${config.iconSecondary} mb-2`}>{comparacion.solar_return.posicion}</p>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {comparacion.solar_return.descripcion}
              </p>
            </div>

            {/* El Choque */}
            <div className={`${config.highlightAccent} rounded-lg p-6`}>
              <h3 className={`${config.fontDisplay} ${config.iconAccent} font-medium mb-3`}>⚡ El choque</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {comparacion.choque}
              </p>
            </div>

            {/* Qué Hacer */}
            <div className={`${config.highlightPrimary} rounded-lg p-6`}>
              <h3 className={`${config.fontDisplay} ${config.iconPrimary} font-medium mb-3 flex items-center gap-2`}><Check className="w-5 h-5" /> Qué hacer</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {comparacion.que_hacer}
              </p>
            </div>

            {/* Mandato del Año */}
            {comparacion.mandato_del_ano && (
              <div className={`border-l-4 ${config.cardBorder} pl-6`}>
                <p className={`${config.iconSecondary} text-sm font-medium mb-2`}>Mandato del año:</p>
                <p className="text-gray-700 text-lg italic leading-relaxed">
                  "{comparacion.mandato_del_ano}"
                </p>
              </div>
            )}
          </>
        ) : (
          <div className={`${config.highlightSecondary} rounded-lg p-8 opacity-50`}>
            <p className="text-gray-500 text-center italic">
              Genera tu Retorno Solar para ver la comparación<br />
              entre tu {planetName} Natal y tu {planetName} en este año.
            </p>
          </div>
        )}
      </div>

      <FooterLibro pagina={pageNumber} />
    </div>
  );
};

export const SolRetorno = ({ comparacion }: { comparacion?: any }) => {
  return <ComparacionPlanetaria planetName="Sol" planetSymbol="☉" pageNumber={12} comparacion={comparacion} />;
};

export const LunaRetorno = ({ comparacion }: { comparacion?: any }) => {
  return <ComparacionPlanetaria planetName="Luna" planetSymbol="☽" pageNumber={13} comparacion={comparacion} />;
};

export const MercurioRetorno = ({ comparacion }: { comparacion?: any }) => {
  return <ComparacionPlanetaria planetName="Mercurio" planetSymbol="☿" pageNumber={14} comparacion={comparacion} />;
};

export const VenusRetorno = ({ comparacion }: { comparacion?: any }) => {
  return <ComparacionPlanetaria planetName="Venus" planetSymbol="♀" pageNumber={15} comparacion={comparacion} />;
};

export const MarteRetorno = ({ comparacion }: { comparacion?: any }) => {
  return <ComparacionPlanetaria planetName="Marte" planetSymbol="♂" pageNumber={16} comparacion={comparacion} />;
};

interface EjesDelAnioProps {
  ascSign?: { sign: string; degree?: number } | null;
  mcSign?: { sign: string; degree?: number } | null;
}

export const EjesDelAnio = ({ ascSign, mcSign }: EjesDelAnioProps) => {
  const { config } = useStyle();

  // Formatear signo con grado si está disponible
  const formatSigno = (data: { sign: string; degree?: number } | null | undefined) => {
    if (!data) return null;
    if (data.degree !== undefined) {
      return `${data.sign} ${Math.floor(data.degree)}°`;
    }
    return data.sign;
  };

  return (
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`${config.iconSecondary} text-3xl`}>☊</span>
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient} mt-4`}>Los Ejes del Año</h2>
        <p className={`text-gray-500 mt-2 ${config.fontBody}`}>Lo que estructura tu experiencia</p>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>

      <div className={`flex-1 max-w-2xl mx-auto w-full space-y-6 ${config.fontBody}`}>
        <p className="text-gray-700 leading-relaxed">
          Este año no se sostiene por eventos aislados, sino por cuatro puntos clave
          que marcan cómo vives, decides y te posicionas en el mundo.
        </p>

        <p className="text-gray-600 italic text-center">
          No son exigencias externas.<br />
          Son ajustes internos.
        </p>

        {/* ASC */}
        <div className={`${config.highlightPrimary} rounded-lg p-6`}>
          <div className="flex items-center gap-3 mb-3">
            <span className={`${config.iconSecondary} text-2xl`}>↑</span>
            <div>
              <span className={`${config.fontDisplay} ${config.iconPrimary} font-medium`}>Ascendente del Retorno</span>
              {ascSign && (
                <span className={`${config.iconSecondary} text-sm ml-2 font-medium`}>en {formatSigno(ascSign)}</span>
              )}
              <span className="text-gray-400 text-sm ml-2">— Casa 1</span>
            </div>
          </div>
          <p className="text-gray-500 text-xs italic mb-3">Identidad, presencia, forma de iniciar</p>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            Este año te presentas al mundo desde un lugar más honesto y menos defensivo.
            No vienes a gustar: vienes a ser coherente contigo.
          </p>
          <p className="text-gray-600 text-sm mb-3">
            La pregunta que se repite es:<br />
            <span className={`${config.iconSecondary} italic`}>¿Esto que hago me representa de verdad?</span>
          </p>
          <p className="text-gray-600 text-sm mb-3">
            Puede que no tengas una imagen clara de quién estás siendo ahora, y eso está bien.
            Este ascendente te pide permitirte redefinirte sin prisa, incluso sin explicación.
          </p>
          <div className={`border-l-2 ${config.cardBorder} pl-4 mt-4`}>
            <p className={`${config.iconSecondary} text-sm font-medium`}>Aprendizaje:</p>
            <p className="text-gray-700 text-sm italic">
              No necesitas tenerlo todo claro para empezar. Necesitas sentirte alineada.
            </p>
          </div>
        </div>

        {/* MC */}
        <div className={`${config.highlightSecondary} rounded-lg p-6`}>
          <div className="flex items-center gap-3 mb-3">
            <span className={`${config.iconSecondary} text-2xl`}>⬆</span>
            <div>
              <span className={`${config.fontDisplay} ${config.iconPrimary} font-medium`}>Medio Cielo (MC) del Retorno</span>
              {mcSign && (
                <span className={`${config.iconSecondary} text-sm ml-2 font-medium`}>en {formatSigno(mcSign)}</span>
              )}
              <span className="text-gray-400 text-sm ml-2">— Casa 10</span>
            </div>
          </div>
          <p className="text-gray-500 text-xs italic mb-3">Vocación, dirección, propósito visible</p>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            Este año no busca logros espectaculares ni reconocimiento inmediato.
            Busca sentido.
          </p>
          <p className="text-gray-600 text-sm mb-3">
            Puede haber dudas sobre el rumbo profesional, el propósito o la utilidad de lo que haces.
            No es un retroceso: es una recalibración.
          </p>
          <p className="text-gray-600 text-sm mb-3">
            El MC te pide revisar <span className="italic">para qué</span> haces lo que haces, no solo cómo ni cuánto.
          </p>
          <div className={`border-l-2 ${config.cardBorder} pl-4 mt-4`}>
            <p className={`${config.iconSecondary} text-sm font-medium`}>Aprendizaje:</p>
            <p className="text-gray-700 text-sm italic">
              Cuando el propósito cambia, la forma también debe hacerlo.
            </p>
          </div>
        </div>
      </div>

      <FooterLibro pagina={17} />
    </div>
  );
};

interface EjesDelAnio2Props {
  dscSign?: { sign: string } | null;
  icSign?: { sign: string } | null;
}

export const EjesDelAnio2 = ({ dscSign, icSign }: EjesDelAnio2Props) => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-6">
        <span className={`${config.iconSecondary} opacity-60 text-sm tracking-[0.3em] uppercase ${config.fontBody}`}>Los Ejes del Año</span>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>

      <div className={`flex-1 max-w-2xl mx-auto w-full space-y-6 ${config.fontBody}`}>
        {/* DSC */}
        <div className={`${config.highlightAccent} rounded-lg p-6`}>
          <div className="flex items-center gap-3 mb-3">
            <span className={`${config.iconSecondary} text-2xl`}>↓</span>
            <div>
              <span className={`${config.fontDisplay} ${config.iconPrimary} font-medium`}>Descendente (DSC) del Retorno</span>
              {dscSign && (
                <span className={`${config.iconSecondary} text-sm ml-2 font-medium`}>en {dscSign.sign}</span>
              )}
              <span className="text-gray-400 text-sm ml-2">— Casa 7</span>
            </div>
          </div>
          <p className="text-gray-500 text-xs italic mb-3">Relaciones, vínculos, espejo emocional</p>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            Este año las relaciones funcionan como espejo directo.
            Lo que no está equilibrado se nota más.
            Lo que es verdadero, se profundiza.
          </p>
          <p className="text-gray-600 text-sm mb-3">
            No hay espacio para personajes ni acuerdos silenciosos.
            Necesitas vínculos donde puedas ser tú sin editarte.
          </p>
          <p className="text-gray-600 text-sm mb-3">
            Algunas relaciones se ajustan.
            Otras se caen.
            Otras se vuelven más reales.
          </p>
          <div className={`border-l-2 ${config.cardBorder} pl-4 mt-4`}>
            <p className={`${config.iconSecondary} text-sm font-medium`}>Aprendizaje:</p>
            <p className="text-gray-700 text-sm italic">
              La armonía no se construye sacrificándote.
            </p>
          </div>
        </div>

        {/* IC */}
        <div className={`${config.highlightPrimary} rounded-lg p-6`}>
          <div className="flex items-center gap-3 mb-3">
            <span className={`${config.iconSecondary} text-2xl`}>⬇</span>
            <div>
              <span className={`${config.fontDisplay} ${config.iconPrimary} font-medium`}>Fondo del Cielo (IC) del Retorno</span>
              {icSign && (
                <span className={`${config.iconSecondary} text-sm ml-2 font-medium`}>en {icSign.sign}</span>
              )}
              <span className="text-gray-400 text-sm ml-2">— Casa 4</span>
            </div>
          </div>
          <p className="text-gray-500 text-xs italic mb-3">Hogar interno, raíces, seguridad emocional</p>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            Este es el punto más sensible del año.
            Tu sistema emocional pide descanso, refugio y contención.
          </p>
          <p className="text-gray-600 text-sm mb-3">
            Necesitas espacios donde no tengas que explicar nada.
            Donde puedas bajar la guardia.
          </p>
          <p className="text-gray-600 text-sm mb-3">
            Puede aparecer una necesidad fuerte de silencio, de intimidad,
            de reconectar contigo lejos del ruido externo.
          </p>
          <div className={`border-l-2 ${config.cardBorder} pl-4 mt-4`}>
            <p className={`${config.iconSecondary} text-sm font-medium`}>Aprendizaje:</p>
            <p className="text-gray-700 text-sm italic">
              No todo se resuelve hacia fuera. Algunas respuestas solo llegan cuando te recoges.
            </p>
          </div>
        </div>
      </div>

      <FooterLibro pagina={18} />
    </div>
  );
};

interface IntegracionEjesProps {
  asc?: string;
  mc?: string;
  dsc?: string;
  ic?: string;
  frase_guia?: string;
}

export const IntegracionEjes = ({ asc, mc, dsc, ic, frase_guia }: IntegracionEjesProps) => {
  const { config } = useStyle();
  const tieneContenidoPersonalizado = !!(asc || mc || dsc || ic);

  return (
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-6">
        <span className={`${config.iconSecondary} text-3xl`}>✧</span>
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient} mt-4`}>Integración de los cuatro ejes</h2>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>

      <div className={`flex-1 max-w-2xl mx-auto w-full space-y-5 ${config.fontBody}`}>
        <p className="text-gray-700 text-base leading-relaxed text-center">
          Este año te enseña a:
        </p>

        <div className="space-y-3">
          <div className={`${config.highlightPrimary} rounded-lg p-4`}>
            <div className="flex items-center gap-3 mb-2">
              <span className={`${config.iconSecondary} text-xl`}>↑</span>
              <span className={`${config.iconPrimary} font-medium text-sm`}>Ascendente (ASC) - Identidad</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {asc || 'Ser sin definirte del todo. Permitirte evolucionar sin forzar una versión fija de ti.'}
            </p>
          </div>

          <div className={`${config.highlightSecondary} rounded-lg p-4`}>
            <div className="flex items-center gap-3 mb-2">
              <span className={`${config.iconSecondary} text-xl`}>⬆</span>
              <span className={`${config.iconPrimary} font-medium text-sm`}>Medio Cielo (MC) - Propósito</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {mc || 'Replantear tu rumbo sin exigirte resultados. Encontrar sentido antes que logros.'}
            </p>
          </div>

          <div className={`${config.highlightAccent} rounded-lg p-4`}>
            <div className="flex items-center gap-3 mb-2">
              <span className={`${config.iconSecondary} text-xl`}>↓</span>
              <span className={`${config.iconPrimary} font-medium text-sm`}>Descendente (DSC) - Relaciones</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {dsc || 'Relacionarte sin traicionarte. Mantener tu esencia en el vínculo con otros.'}
            </p>
          </div>

          <div className={`${config.highlightPrimary} rounded-lg p-4`}>
            <div className="flex items-center gap-3 mb-2">
              <span className={`${config.iconSecondary} text-xl`}>⬇</span>
              <span className={`${config.iconPrimary} font-medium text-sm`}>Fondo de Cielo (IC) - Raíces</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {ic || 'Cuidar tu base emocional como prioridad. Nutrir tus raíces internas.'}
            </p>
          </div>
        </div>

        <p className="text-gray-500 text-center italic text-sm mt-4">
          Nada de esto ocurre de golpe. Se entrena día a día.
        </p>

        <div className={`bg-gradient-to-r ${config.headerBg} rounded-lg p-6 text-center mt-4`}>
          <p className={`text-gray-400 text-xs uppercase tracking-widest mb-3 ${config.fontBody}`}>Frase guía del eje del año</p>
          <p className={`${config.fontDisplay} text-lg ${config.headerText} italic leading-relaxed`}>
            "{frase_guia || 'Me permito ser honesta conmigo antes de intentar encajar en el mundo.'}"
          </p>
        </div>
      </div>

      <FooterLibro pagina={19} />
    </div>
  );
};

export const RitualCumpleanos = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`${config.iconSecondary} text-4xl`}>✧</span>
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient} mt-4`}>Ritual de cumpleaños</h2>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>

      <div className={`flex-1 max-w-2xl mx-auto w-full space-y-6 ${config.fontBody}`}>
        <p className="text-gray-600 italic text-center">
          Un pequeño ritual para honrar tu nuevo ciclo solar.
        </p>

        <div className={`${config.highlightSecondary} rounded-lg p-6 space-y-4`}>
          <div>
            <h4 className={`${config.fontDisplay} ${config.iconPrimary} font-medium mb-2`}>Necesitas:</h4>
            <ul className="text-gray-600 text-sm space-y-1 pl-4">
              <li>• Una vela (preferiblemente dorada o blanca)</li>
              <li>• Papel y bolígrafo</li>
              <li>• Un momento de soledad</li>
            </ul>
          </div>

          <div>
            <h4 className={`${config.fontDisplay} ${config.iconPrimary} font-medium mb-2`}>El ritual:</h4>
            <ol className="text-gray-600 text-sm space-y-2 pl-4">
              <li>1. Enciende la vela y respira profundo tres veces.</li>
              <li>2. Escribe una carta a la versión de ti que cumple años el próximo año.</li>
              <li>3. Cuéntale qué esperas haber aprendido, sentido, soltado.</li>
              <li>4. Guarda la carta sin leerla hasta tu próximo cumpleaños.</li>
              <li>5. Apaga la vela con gratitud.</li>
            </ol>
          </div>
        </div>

        <div className={`border-l-4 ${config.cardBorder} pl-6 mt-8`}>
          <p className={`${config.iconSecondary} italic text-sm`}>Si resuena contigo, pruébalo.</p>
        </div>
      </div>

      <FooterLibro pagina={30} />
    </div>
  );
};

export const MantraAnual = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page ${config.headerBg} flex flex-col items-center justify-center text-center p-12 relative overflow-hidden ${config.pattern}`}>
      <div className="relative z-10 space-y-8 max-w-xl">
        <span className={`${config.headerText} opacity-60 text-sm tracking-[0.3em] uppercase ${config.fontBody}`}>Mantra del año</span>

        <div className={`${config.headerText} text-6xl`}>☉</div>

        <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-8`}>
          <p className={`${config.fontDisplay} text-3xl ${config.headerText} italic leading-relaxed`}>
            "Confío en lo que se gesta en silencio."
          </p>
        </div>

        <p className={`${config.headerText} opacity-70 text-sm ${config.fontBody}`}>
          Repítelo cuando lo necesites.<br />
          Escríbelo donde puedas verlo.<br />
          Deja que te guíe.
        </p>
      </div>

      <FooterLibro pagina={21} />
    </div>
  );
};
