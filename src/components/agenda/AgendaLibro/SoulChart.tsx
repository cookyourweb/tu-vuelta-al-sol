'use client';

import { useStyle } from "@/context/StyleContext";

export const EsenciaNatal = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`${config.iconSecondary} opacity-60 text-sm tracking-[0.3em] uppercase ${config.fontBody}`}>Tu Mapa del Alma</span>
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient} mt-2`}>Tu esencia natal</h2>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>

      <div className={`flex-1 max-w-2xl mx-auto w-full ${config.fontBody}`}>
        <p className="text-gray-600 text-center mb-8 italic">
          Antes de mirar hacia dónde vas, recordemos de dónde vienes.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className={`${config.highlightPrimary} rounded-lg p-4`}>
            <span className={`${config.iconSecondary} text-2xl`}>☉</span>
            <h4 className={`${config.fontDisplay} ${config.iconPrimary} font-medium mt-2`}>Sol en Acuario</h4>
            <p className="text-sm text-gray-600 mt-1">Casa 1 (identidad, presencia, yo)</p>
            <p className="text-sm text-gray-700 mt-2">
              Tu esencia es libre, auténtica y orientada a la verdad personal.
              Viniste a ser tú, no una versión adaptada.
            </p>
          </div>
          <div className={`${config.highlightSecondary} rounded-lg p-4`}>
            <span className={`${config.iconSecondary} text-2xl`}>☽</span>
            <h4 className={`${config.fontDisplay} ${config.iconPrimary} font-medium mt-2`}>Luna en Libra</h4>
            <p className="text-sm text-gray-600 mt-1">Casa 8 (emociones profundas, transformación)</p>
            <p className="text-sm text-gray-700 mt-2">
              Necesitas equilibrio emocional, pero a través de procesos intensos.
              Sientes profundamente y transformas a través del vínculo.
            </p>
          </div>
          <div className={`${config.highlightAccent} rounded-lg p-4`}>
            <span className={`${config.iconSecondary} text-2xl`}>↑</span>
            <h4 className={`${config.fontDisplay} ${config.iconPrimary} font-medium mt-2`}>Ascendente Acuario</h4>
            <p className="text-sm text-gray-600 mt-1">Casa 1 (forma de empezar, identidad visible)</p>
            <p className="text-sm text-gray-700 mt-2">
              Te muestras independiente, diferente, mentalmente libre.
              Tu camino siempre empieza rompiendo moldes.
            </p>
          </div>
          <div className={`${config.highlightPrimary} rounded-lg p-4`}>
            <span className={`${config.iconSecondary} text-2xl`}>☿</span>
            <h4 className={`${config.fontDisplay} ${config.iconPrimary} font-medium mt-2`}>Mercurio en Piscis</h4>
            <p className="text-sm text-gray-600 mt-1">Casa 1 (mente, comunicación)</p>
            <p className="text-sm text-gray-700 mt-2">
              Piensas y comunicas desde la intuición.
              Lees el ambiente antes de que nadie diga nada.
            </p>
          </div>
        </div>

        <div className={`${config.highlightSecondary} rounded-lg p-6`}>
          <h4 className={`${config.fontDisplay} ${config.iconPrimary} font-medium mb-3`}>Resumen de tu carta</h4>
          <div className={`space-y-2 text-gray-700 ${config.fontBody}`}>
            <p><strong>Predominio de Aire + Agua</strong></p>
            <p className="text-sm">– Aire: mente, conciencia, visión</p>
            <p className="text-sm">– Agua: sensibilidad, intuición, empatía</p>
            <p className="text-sm mt-3">Menos Tierra → necesidad de anclaje consciente</p>
            <p className="text-sm">Menos Fuego → acción solo cuando hay sentido</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NodoNorte = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`${config.iconSecondary} text-4xl`}>☊</span>
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient} mt-4`}>Tu dirección evolutiva</h2>
        <p className={`text-gray-500 mt-2 ${config.fontBody}`}>Nodo Norte</p>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>

      <div className={`flex-1 max-w-2xl mx-auto w-full space-y-6 ${config.fontBody}`}>
        <div className={`${config.highlightPrimary} rounded-lg p-6`}>
          <p className="text-gray-700 text-lg leading-relaxed">
            Cuando eliges ser emocionalmente auténtica, incluso con miedo, creces.
            Este punto de tu carta te invita a dejar de protegerte tanto y a habitarte con más verdad.
          </p>
        </div>

        <div className={`border-l-4 ${config.cardBorder} pl-6`}>
          <p className={`${config.iconSecondary} italic mb-4`}>Pregunta terapéutica:</p>
          <p className="text-gray-700 text-lg">
            "¿Dónde sientes que te llama la vida, pero dudas en responder?"
          </p>
        </div>

        <div className={`${config.highlightSecondary} rounded-lg p-6`}>
          <p className={`${config.iconSecondary} opacity-60 text-sm mb-3`}>Tu respuesta:</p>
          <div className="space-y-4">
            <div className={`h-16 border-b border-dashed ${config.iconSecondary} opacity-30`} />
            <div className={`h-16 border-b border-dashed ${config.iconSecondary} opacity-30`} />
            <div className="h-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const NodoSur = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`${config.iconSecondary} text-4xl`}>☋</span>
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient} mt-4`}>Tu zona conocida</h2>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>

      <div className={`flex-1 max-w-2xl mx-auto w-full space-y-6 ${config.fontBody}`}>
        <div className={`${config.highlightPrimary} rounded-lg p-6`}>
          <p className="text-gray-700 text-lg leading-relaxed">
            Cuando te adaptas demasiado, te pierdes.
            Aquí está la tendencia a sostener más de lo que te corresponde.
          </p>
        </div>

        <div className={`border-l-4 ${config.cardBorder} pl-6`}>
          <p className={`${config.iconSecondary} italic mb-4`}>Pregunta terapéutica:</p>
          <p className="text-gray-700 text-lg">
            "¿Qué patrón repites esperando resultados distintos?"
          </p>
        </div>

        <div className={`${config.highlightSecondary} rounded-lg p-6`}>
          <p className={`${config.iconSecondary} opacity-60 text-sm mb-3`}>Tu respuesta:</p>
          <div className="space-y-4">
            <div className={`h-16 border-b border-dashed ${config.iconSecondary} opacity-30`} />
            <div className={`h-16 border-b border-dashed ${config.iconSecondary} opacity-30`} />
            <div className="h-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const PlanetasDominantes = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient}`}>Planetas dominantes del alma</h2>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>

      <div className={`flex-1 max-w-2xl mx-auto w-full ${config.fontBody}`}>
        <p className="text-gray-600 text-center mb-8 italic text-sm">
          Tu mente intuitiva, tu identidad fuerte y tu mundo emocional profundo
          no funcionan separados. Este año aprenderán a escucharse sin empujarse.
        </p>

        <div className="space-y-4">
          <div className={`${config.highlightPrimary} rounded-lg p-5`}>
            <div className="flex items-center gap-3 mb-3">
              <span className={`${config.iconSecondary} text-xl`}>☿</span>
              <span className={`${config.fontDisplay} ${config.iconPrimary}`}>Mercurio (mente intuitiva)</span>
            </div>
            <p className="text-gray-700 text-sm">
              Tu forma de procesar información es profundamente sensible y perceptiva.
            </p>
          </div>

          <div className={`${config.highlightSecondary} rounded-lg p-5`}>
            <div className="flex items-center gap-3 mb-3">
              <span className={`${config.iconSecondary} text-xl`}>☉</span>
              <span className={`${config.fontDisplay} ${config.iconPrimary}`}>Sol (identidad fuerte)</span>
            </div>
            <p className="text-gray-700 text-sm">
              Tu esencia auténtica busca expresarse sin máscaras ni adaptaciones.
            </p>
          </div>

          <div className={`${config.highlightAccent} rounded-lg p-5`}>
            <div className="flex items-center gap-3 mb-3">
              <span className={`${config.iconSecondary} text-xl`}>☽</span>
              <span className={`${config.fontDisplay} ${config.iconPrimary}`}>Luna (mundo emocional profundo)</span>
            </div>
            <p className="text-gray-700 text-sm">
              Tus emociones son intensas y transformadoras, especialmente en los vínculos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PatronesEmocionales = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient}`}>Patrones emocionales a observar</h2>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>

      <div className={`flex-1 max-w-2xl mx-auto w-full space-y-6 ${config.fontBody}`}>
        <p className="text-gray-600 text-center italic text-sm">
          Lo que haces sin darte cuenta. Lo que repites sin saber por qué.
        </p>

        <div className={`${config.highlightPrimary} rounded-lg p-6`}>
          <p className={`${config.iconSecondary} text-sm mb-4`}>
            Basado en tu carta natal, estos son tus patrones emocionales más profundos:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className={config.iconSecondary}>–</span>
              <span>Absorber emociones ajenas</span>
            </li>
            <li className="flex items-start gap-3">
              <span className={config.iconSecondary}>–</span>
              <span>Dudar de tu propio ritmo</span>
            </li>
            <li className="flex items-start gap-3">
              <span className={config.iconSecondary}>–</span>
              <span>Postergarte por armonía</span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className={`border-l-4 ${config.cardBorder} pl-6`}>
            <p className={`${config.iconSecondary} italic mb-2`}>Pregunta para reflexionar:</p>
            <p className="text-gray-700">"Cuando repito, ¿qué estoy buscando?"</p>
            <div className={`h-16 border-b border-dashed ${config.iconSecondary} opacity-30 mt-4`} />
          </div>

          <div className={`border-l-4 ${config.cardBorder} pl-6`}>
            <p className={`${config.iconSecondary} italic mb-2`}>Y también:</p>
            <p className="text-gray-700">"¿Qué parte de mí quiere evolucionar ahora?"</p>
            <div className={`h-16 border-b border-dashed ${config.iconSecondary} opacity-30 mt-4`} />
          </div>
        </div>
      </div>
    </div>
  );
};
