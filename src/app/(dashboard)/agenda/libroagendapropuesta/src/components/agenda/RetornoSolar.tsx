import { useStyle } from "@/contexts/StyleContext";

export const QueEsRetornoSolar = () => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-background p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`${config.iconSecondary} opacity-60 text-sm tracking-[0.3em] uppercase ${config.fontBody}`}>Retorno Solar</span>
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient} mt-2`}>Retorno Solar 2025–2026</h2>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>
      
      <div className={`flex-1 max-w-2xl mx-auto w-full space-y-6 ${config.fontBody}`}>
        <div className={`text-center ${config.iconSecondary} text-6xl mb-6`}>☉</div>
        
        <p className="text-foreground/80 text-lg leading-relaxed">
          Cada año, en tu cumpleaños (o muy cerca de él), el Sol vuelve al grado exacto 
          donde estaba cuando naciste. Ese momento es tu <span className={config.iconSecondary}>Retorno Solar</span>.
        </p>
        
        <p className="text-foreground/70 leading-relaxed">
          La carta del Retorno Solar es un mapa energético para los próximos 365 días. 
          No reemplaza tu carta natal, la complementa. Te muestra qué áreas de tu vida 
          estarán más activas, qué necesitarás emocionalmente, y dónde encontrarás 
          tus mayores aprendizajes.
        </p>
        
        <div className={`${config.highlightSecondary} rounded-lg p-6`}>
          <h4 className={`${config.fontDisplay} ${config.iconPrimary} font-medium mb-3`}>Lo que tu Retorno Solar revela:</h4>
          <ul className="space-y-2 text-foreground/70 text-sm">
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
        
        <p className="text-foreground/60 italic text-center">
          "Tu cumpleaños no es solo una celebración. Es un portal."
        </p>
      </div>
    </div>
  );
};

export const AscendenteAnio = () => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-background p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`${config.iconSecondary} text-4xl`}>↑</span>
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient} mt-4`}>Ascendente del Retorno</h2>
        <p className={`text-foreground/60 mt-2 ${config.fontBody}`}>Acuario – Casa 1 (identidad, enfoque vital)</p>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>
      
      <div className={`flex-1 max-w-2xl mx-auto w-full space-y-6 ${config.fontBody}`}>
        <div className={`${config.highlightPrimary} rounded-lg p-6`}>
          <p className="text-foreground/80 text-lg leading-relaxed mb-6">
            Este año encaras la vida desde la honestidad radical contigo misma.
          </p>
          <div className="space-y-4">
            <div>
              <span className={`${config.iconSecondary} text-sm font-medium`}>Activa:</span>
              <p className="text-foreground/80 mt-1">autenticidad · libertad interna · desapego sano</p>
            </div>
            <div>
              <span className={`${config.iconSecondary} text-sm font-medium`}>Reta:</span>
              <p className="text-foreground/80 mt-1">tolerar no tener respuestas inmediatas</p>
            </div>
            <div>
              <span className={`${config.iconSecondary} text-sm font-medium`}>Cómo trabajarlo:</span>
              <p className="text-foreground/80 mt-1">respetando tus tiempos y honrando el silencio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SolRetorno = () => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-background p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`${config.iconSecondary} text-4xl`}>☉</span>
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient} mt-4`}>Sol del Retorno</h2>
        <p className={`text-foreground/60 mt-2 ${config.fontBody}`}>Acuario – Casa 12 (inconsciente, cierre de ciclo)</p>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>
      
      <div className={`flex-1 max-w-2xl mx-auto w-full space-y-6 ${config.fontBody}`}>
        <div className={`${config.highlightSecondary} rounded-lg p-6`}>
          <p className="text-foreground/80 text-lg leading-relaxed mb-6">
            Este año no es para exponerte.<br />
            Es para cerrar, sanar y preparar.
          </p>
          <div className="space-y-4">
            <div>
              <span className={`${config.iconSecondary} text-sm font-medium`}>Activa:</span>
              <p className="text-foreground/80 mt-1">introspección · sanación · retiro consciente</p>
            </div>
            <div>
              <span className={`${config.iconSecondary} text-sm font-medium`}>Reta:</span>
              <p className="text-foreground/80 mt-1">la sensación de "no estar haciendo suficiente"</p>
            </div>
            <div>
              <span className={`${config.iconSecondary} text-sm font-medium`}>Cómo trabajarlo:</span>
              <p className="text-foreground/80 mt-1">confiando en los procesos invisibles</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LunaRetorno = () => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-background p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`${config.iconSecondary} text-4xl`}>☽</span>
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient} mt-4`}>Luna del Retorno</h2>
        <p className={`text-foreground/60 mt-2 ${config.fontBody}`}>Leo – Casa 5 (creatividad, disfrute)</p>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>
      
      <div className={`flex-1 max-w-2xl mx-auto w-full space-y-6 ${config.fontBody}`}>
        <div className={`${config.highlightAccent} rounded-lg p-6`}>
          <p className="text-foreground/80 text-lg leading-relaxed mb-6">
            Tu necesidad emocional es expresarte sin juicio.
          </p>
          <div className="space-y-4">
            <div>
              <span className={`${config.iconSecondary} text-sm font-medium`}>Activa:</span>
              <p className="text-foreground/80 mt-1">alegría · juego · expresión auténtica</p>
            </div>
            <div>
              <span className={`${config.iconSecondary} text-sm font-medium`}>Reta:</span>
              <p className="text-foreground/80 mt-1">buscar aprobación</p>
            </div>
            <div>
              <span className={`${config.iconSecondary} text-sm font-medium`}>Cómo trabajarlo:</span>
              <p className="text-foreground/80 mt-1">crear sin mostrar, disfrutar sin explicar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EjesDelAnio = () => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-background p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`${config.iconSecondary} text-3xl`}>☊</span>
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient} mt-4`}>Los Ejes del Año</h2>
        <p className={`text-foreground/60 mt-2 ${config.fontBody}`}>Lo que estructura tu experiencia</p>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>
      
      <div className={`flex-1 max-w-2xl mx-auto w-full space-y-6 ${config.fontBody}`}>
        <p className="text-foreground/80 leading-relaxed">
          Este año no se sostiene por eventos aislados, sino por cuatro puntos clave 
          que marcan cómo vives, decides y te posicionas en el mundo.
        </p>
        
        <p className="text-foreground/70 italic text-center">
          No son exigencias externas.<br />
          Son ajustes internos.
        </p>
        
        {/* ASC */}
        <div className={`${config.highlightPrimary} rounded-lg p-6`}>
          <div className="flex items-center gap-3 mb-3">
            <span className={`${config.iconSecondary} text-2xl`}>↑</span>
            <div>
              <span className={`${config.fontDisplay} ${config.iconPrimary} font-medium`}>Ascendente del Retorno</span>
              <span className="text-foreground/50 text-sm ml-2">— Casa 1</span>
            </div>
          </div>
          <p className="text-foreground/60 text-xs italic mb-3">Identidad, presencia, forma de iniciar</p>
          <p className="text-foreground/80 text-sm leading-relaxed mb-3">
            Este año te presentas al mundo desde un lugar más honesto y menos defensivo.
            No vienes a gustar: vienes a ser coherente contigo.
          </p>
          <p className="text-foreground/70 text-sm mb-3">
            La pregunta que se repite es:<br />
            <span className={`${config.iconSecondary} italic`}>¿Esto que hago me representa de verdad?</span>
          </p>
          <p className="text-foreground/70 text-sm mb-3">
            Puede que no tengas una imagen clara de quién estás siendo ahora, y eso está bien.
            Este ascendente te pide permitirte redefinirte sin prisa, incluso sin explicación.
          </p>
          <div className={`border-l-2 ${config.cardBorder} pl-4 mt-4`}>
            <p className={`${config.iconSecondary} text-sm font-medium`}>Aprendizaje:</p>
            <p className="text-foreground/80 text-sm italic">
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
            </div>
          </div>
          <p className="text-foreground/60 text-xs italic mb-3">Vocación, dirección, propósito visible</p>
          <p className="text-foreground/80 text-sm leading-relaxed mb-3">
            Este año no busca logros espectaculares ni reconocimiento inmediato.
            Busca sentido.
          </p>
          <p className="text-foreground/70 text-sm mb-3">
            Puede haber dudas sobre el rumbo profesional, el propósito o la utilidad de lo que haces.
            No es un retroceso: es una recalibración.
          </p>
          <p className="text-foreground/70 text-sm mb-3">
            El MC te pide revisar <span className="italic">para qué</span> haces lo que haces, no solo cómo ni cuánto.
          </p>
          <div className={`border-l-2 ${config.cardBorder} pl-4 mt-4`}>
            <p className={`${config.iconSecondary} text-sm font-medium`}>Aprendizaje:</p>
            <p className="text-foreground/80 text-sm italic">
              Cuando el propósito cambia, la forma también debe hacerlo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EjesDelAnio2 = () => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-background p-12 flex flex-col ${config.pattern}`}>
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
            </div>
          </div>
          <p className="text-foreground/60 text-xs italic mb-3">Relaciones, vínculos, espejo emocional</p>
          <p className="text-foreground/80 text-sm leading-relaxed mb-3">
            Este año las relaciones funcionan como espejo directo.
            Lo que no está equilibrado se nota más.
            Lo que es verdadero, se profundiza.
          </p>
          <p className="text-foreground/70 text-sm mb-3">
            No hay espacio para personajes ni acuerdos silenciosos.
            Necesitas vínculos donde puedas ser tú sin editarte.
          </p>
          <p className="text-foreground/70 text-sm mb-3">
            Algunas relaciones se ajustan.
            Otras se caen.
            Otras se vuelven más reales.
          </p>
          <div className={`border-l-2 ${config.cardBorder} pl-4 mt-4`}>
            <p className={`${config.iconSecondary} text-sm font-medium`}>Aprendizaje:</p>
            <p className="text-foreground/80 text-sm italic">
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
            </div>
          </div>
          <p className="text-foreground/60 text-xs italic mb-3">Hogar interno, raíces, seguridad emocional</p>
          <p className="text-foreground/80 text-sm leading-relaxed mb-3">
            Este es el punto más sensible del año.
            Tu sistema emocional pide descanso, refugio y contención.
          </p>
          <p className="text-foreground/70 text-sm mb-3">
            Necesitas espacios donde no tengas que explicar nada.
            Donde puedas bajar la guardia.
          </p>
          <p className="text-foreground/70 text-sm mb-3">
            Puede aparecer una necesidad fuerte de silencio, de intimidad, 
            de reconectar contigo lejos del ruido externo.
          </p>
          <div className={`border-l-2 ${config.cardBorder} pl-4 mt-4`}>
            <p className={`${config.iconSecondary} text-sm font-medium`}>Aprendizaje:</p>
            <p className="text-foreground/80 text-sm italic">
              No todo se resuelve hacia fuera. Algunas respuestas solo llegan cuando te recoges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const IntegracionEjes = () => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-background p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`${config.iconSecondary} text-3xl`}>✧</span>
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient} mt-4`}>Integración de los cuatro ejes</h2>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>
      
      <div className={`flex-1 max-w-2xl mx-auto w-full space-y-8 ${config.fontBody}`}>
        <p className="text-foreground/80 text-lg leading-relaxed text-center">
          Este año te enseña a:
        </p>
        
        <div className="space-y-4">
          <div className={`${config.highlightPrimary} rounded-lg p-4 flex items-center gap-4`}>
            <span className={`${config.iconSecondary} text-xl`}>↑</span>
            <p className="text-foreground/80">Ser sin definirte del todo <span className="text-foreground/50 text-sm">(ASC)</span></p>
          </div>
          
          <div className={`${config.highlightSecondary} rounded-lg p-4 flex items-center gap-4`}>
            <span className={`${config.iconSecondary} text-xl`}>⬆</span>
            <p className="text-foreground/80">Replantear tu rumbo sin exigirte resultados <span className="text-foreground/50 text-sm">(MC)</span></p>
          </div>
          
          <div className={`${config.highlightAccent} rounded-lg p-4 flex items-center gap-4`}>
            <span className={`${config.iconSecondary} text-xl`}>↓</span>
            <p className="text-foreground/80">Relacionarte sin traicionarte <span className="text-foreground/50 text-sm">(DSC)</span></p>
          </div>
          
          <div className={`${config.highlightPrimary} rounded-lg p-4 flex items-center gap-4`}>
            <span className={`${config.iconSecondary} text-xl`}>⬇</span>
            <p className="text-foreground/80">Cuidar tu base emocional como prioridad <span className="text-foreground/50 text-sm">(IC)</span></p>
          </div>
        </div>
        
        <p className="text-foreground/60 text-center italic mt-6">
          Nada de esto ocurre de golpe.<br />
          Se entrena día a día.
        </p>
        
        <div className={`bg-gradient-to-r ${config.headerBg} rounded-lg p-8 text-center mt-8`}>
          <p className={`text-foreground/50 text-sm uppercase tracking-widest mb-4 ${config.fontBody}`}>Frase guía del eje del año</p>
          <p className={`${config.fontDisplay} text-xl ${config.headerText} italic leading-relaxed`}>
            "Me permito ser honesta conmigo antes de intentar encajar en el mundo."
          </p>
        </div>
      </div>
    </div>
  );
};

export const RitualCumpleanos = () => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-background p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`${config.iconSecondary} text-4xl`}>✧</span>
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient} mt-4`}>Ritual de cumpleaños</h2>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>
      
      <div className={`flex-1 max-w-2xl mx-auto w-full space-y-6 ${config.fontBody}`}>
        <p className="text-foreground/70 italic text-center">
          Un pequeño ritual para honrar tu nuevo ciclo solar.
        </p>
        
        <div className={`${config.highlightSecondary} rounded-lg p-6 space-y-4`}>
          <div>
            <h4 className={`${config.fontDisplay} ${config.iconPrimary} font-medium mb-2`}>Necesitas:</h4>
            <ul className="text-foreground/70 text-sm space-y-1 pl-4">
              <li>• Una vela (preferiblemente dorada o blanca)</li>
              <li>• Papel y bolígrafo</li>
              <li>• Un momento de soledad</li>
            </ul>
          </div>
          
          <div>
            <h4 className={`${config.fontDisplay} ${config.iconPrimary} font-medium mb-2`}>El ritual:</h4>
            <ol className="text-foreground/70 text-sm space-y-2 pl-4">
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
    </div>
  );
};

export const GrandesAprendizajes = () => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-background p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient}`}>Grandes aprendizajes del ciclo</h2>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>
      
      <div className={`flex-1 max-w-2xl mx-auto w-full space-y-6 ${config.fontBody}`}>
        <div className={`${config.highlightPrimary} rounded-lg p-6`}>
          <div className="flex items-center gap-3 mb-3">
            <span className={`${config.iconSecondary} text-2xl`}>♄</span>
            <span className={`${config.fontDisplay} ${config.iconPrimary} font-medium`}>Saturno te enseña</span>
          </div>
          <p className="text-foreground/80">Límites y coherencia</p>
        </div>
        
        <div className={`${config.highlightSecondary} rounded-lg p-6`}>
          <div className="flex items-center gap-3 mb-3">
            <span className={`${config.iconSecondary} text-2xl`}>♃</span>
            <span className={`${config.fontDisplay} ${config.iconPrimary} font-medium`}>Júpiter te expande</span>
          </div>
          <p className="text-foreground/80">La comprensión</p>
        </div>
        
        <div className={`${config.highlightAccent} rounded-lg p-6`}>
          <div className="flex items-center gap-3 mb-3">
            <span className={`${config.iconSecondary} text-2xl`}>♇</span>
            <span className={`${config.fontDisplay} ${config.iconPrimary} font-medium`}>Plutón transforma</span>
          </div>
          <p className="text-foreground/80">Tu identidad profunda</p>
        </div>
        
        <div className="text-center mt-12">
          <p className={`${config.fontDisplay} text-lg ${config.titleGradient} italic`}>
            No viniste a sobrevivir el año.<br />
            Viniste a transformarte.
          </p>
        </div>
      </div>
    </div>
  );
};