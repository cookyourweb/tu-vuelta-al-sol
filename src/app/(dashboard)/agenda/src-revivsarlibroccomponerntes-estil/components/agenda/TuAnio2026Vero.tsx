import { useStyle } from "@/contexts/StyleContext";
import { Star, Moon, Sun, Sparkles, TrendingUp, Circle } from "lucide-react";

// ==========================================
// TU AÑO 2026-2027 - OVERVIEW PARA VERÓNICA
// (10 Febrero 2026 - 10 Febrero 2027)
// ==========================================

export const TuAnio2026Overview = () => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-background p-8 flex flex-col ${config.pattern}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <Star className={`w-10 h-10 mx-auto ${config.iconSecondary} mb-4`} />
        <h1 className={`font-display text-4xl mb-2 ${config.titleGradient}`} style={{ fontFamily: config.fontDisplay }}>
          Tu Año 2026
        </h1>
        <p className={`${config.iconSecondary} text-xl italic`} style={{ fontFamily: config.fontBody }}>
          Consolidación y Expansión
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <span className={`${config.badgeSecondary} px-3 py-1 rounded-full text-sm`}>
            Ciclo de Manifestación
          </span>
        </div>
        <div className="flex items-center justify-center gap-3 mt-4">
          <Moon className="w-5 h-5 text-foreground/40" />
          <span className="text-foreground/40">✦</span>
          <span className="text-foreground/40">✧</span>
        </div>
      </div>
      
      {/* El Camino del 2026 */}
      <div className={`${config.highlightPrimary} rounded-xl p-6 mb-6`}>
        <h3 className={`font-medium ${config.iconSecondary} text-lg mb-3`} style={{ fontFamily: config.fontDisplay }}>
          El Camino del 2026
        </h3>
        <p className="text-foreground/80 leading-relaxed" style={{ fontFamily: config.fontBody }}>
          2026 marca un punto de consolidación en <strong>tu</strong> evolución. Tras la exploración del 2025, 
          entras en fase de manifestación tangible. Las semillas plantadas comienzan a dar frutos, 
          mientras te enfocas en estructurar tus visiones. Este año te invita a equilibrar estructura 
          y flexibilidad, esfuerzo y receptividad, transformando lo intangible en realidad concreta.
        </p>
        <p className="text-foreground/80 leading-relaxed mt-3" style={{ fontFamily: config.fontBody }}>
          Con tu Sol en Acuario Casa 12 del Retorno Solar, este año tiene un componente de cierre 
          y preparación silenciosa. No todo lo que se construye será visible de inmediato, pero 
          será profundamente real.
        </p>
      </div>
      
      {/* Influencias Planetarias */}
      <div className={`${config.highlightSecondary} rounded-xl p-6 mb-6`}>
        <h3 className={`font-medium ${config.iconSecondary} text-lg mb-4`} style={{ fontFamily: config.fontDisplay }}>
          Influencias Planetarias
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <Sparkles className={`w-5 h-5 mx-auto ${config.iconPrimary} mb-2`} />
            <h4 className={`font-medium ${config.iconPrimary} text-sm`} style={{ fontFamily: config.fontDisplay }}>
              Saturno en Piscis
            </h4>
            <p className="text-foreground/60 text-xs mt-1" style={{ fontFamily: config.fontBody }}>
              Estructura tu intuición. Manifestación concreta de visión espiritual.
            </p>
          </div>
          <div className="text-center">
            <Moon className={`w-5 h-5 mx-auto ${config.iconSecondary} mb-2`} />
            <h4 className={`font-medium ${config.iconSecondary} text-sm`} style={{ fontFamily: config.fontDisplay }}>
              Júpiter en Géminis
            </h4>
            <p className="text-foreground/60 text-xs mt-1" style={{ fontFamily: config.fontBody }}>
              Expansión de conexiones y aprendizajes. Versatilidad mental.
            </p>
          </div>
          <div className="text-center">
            <Star className={`w-5 h-5 mx-auto ${config.iconAccent} mb-2`} />
            <h4 className={`font-medium ${config.iconAccent} text-sm`} style={{ fontFamily: config.fontDisplay }}>
              Plutón en Acuario
            </h4>
            <p className="text-foreground/60 text-xs mt-1" style={{ fontFamily: config.fontBody }}>
              Transformación de relaciones y estructuras colectivas.
            </p>
          </div>
        </div>
      </div>
      
      {/* Líneas de Crecimiento */}
      <div className={`${config.cardBg} ${config.cardBorder} rounded-xl p-6 mb-6`}>
        <h3 className={`font-medium ${config.iconSecondary} text-lg mb-4`} style={{ fontFamily: config.fontDisplay }}>
          Líneas de Crecimiento
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Sparkles className={`w-4 h-4 ${config.iconPrimary} mb-2`} />
            <h4 className={`font-medium ${config.iconPrimary} text-sm`} style={{ fontFamily: config.fontDisplay }}>
              Integración Interior
            </h4>
            <p className="text-foreground/60 text-xs mt-1" style={{ fontFamily: config.fontBody }}>
              Procesos de sanación profunda. Cierre de ciclos emocionales antiguos.
            </p>
          </div>
          <div>
            <TrendingUp className={`w-4 h-4 ${config.iconSecondary} mb-2`} />
            <h4 className={`font-medium ${config.iconSecondary} text-sm`} style={{ fontFamily: config.fontDisplay }}>
              Autenticidad Visible
            </h4>
            <p className="text-foreground/60 text-xs mt-1" style={{ fontFamily: config.fontBody }}>
              Expresión consciente de quién eres. Mostrarte sin máscaras.
            </p>
          </div>
          <div>
            <Sun className={`w-4 h-4 ${config.iconAccent} mb-2`} />
            <h4 className={`font-medium ${config.iconAccent} text-sm`} style={{ fontFamily: config.fontDisplay }}>
              Creatividad Emocional
            </h4>
            <p className="text-foreground/60 text-xs mt-1" style={{ fontFamily: config.fontBody }}>
              Luna en Leo pide expresión alegre. Juego sin necesidad de aprobación.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-auto text-center">
        <p className={`${config.iconSecondary} italic text-sm`} style={{ fontFamily: config.fontBody }}>
          "Confío en lo que se gesta en silencio."
        </p>
      </div>
    </div>
  );
};

export const TuAnio2026Ciclos = () => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-background p-8 flex flex-col ${config.pattern}`}>
      {/* Ciclos del Año */}
      <h2 className={`font-display text-2xl mb-6 ${config.titleGradient} text-center`} style={{ fontFamily: config.fontDisplay }}>
        Ciclos del Año
      </h2>
      
      <div className="grid grid-cols-4 gap-3 mb-8">
        <div className={`${config.highlightPrimary} rounded-lg p-4`}>
          <h4 className={`font-medium ${config.iconSecondary} text-sm mb-2`} style={{ fontFamily: config.fontDisplay }}>
            Feb-Abril
          </h4>
          <p className="text-foreground/70 text-xs" style={{ fontFamily: config.fontBody }}>
            Cimientos internos. Cierre de ciclos. Tu cumpleaños abre el portal de introspección consciente.
          </p>
        </div>
        <div className={`${config.highlightSecondary} rounded-lg p-4`}>
          <h4 className={`font-medium ${config.iconSecondary} text-sm mb-2`} style={{ fontFamily: config.fontDisplay }}>
            Mayo-Julio
          </h4>
          <p className="text-foreground/70 text-xs" style={{ fontFamily: config.fontBody }}>
            Crecimiento relacional. Vínculos que respetan tu proceso interno. Equilibrio entre dar y recibir.
          </p>
        </div>
        <div className={`${config.highlightPrimary} rounded-lg p-4`}>
          <h4 className={`font-medium ${config.iconSecondary} text-sm mb-2`} style={{ fontFamily: config.fontDisplay }}>
            Agosto-Oct
          </h4>
          <p className="text-foreground/70 text-xs" style={{ fontFamily: config.fontBody }}>
            Expresión creativa. Lo que has integrado comienza a manifestarse externamente.
          </p>
        </div>
        <div className={`${config.highlightSecondary} rounded-lg p-4`}>
          <h4 className={`font-medium ${config.iconSecondary} text-sm mb-2`} style={{ fontFamily: config.fontDisplay }}>
            Nov-Enero
          </h4>
          <p className="text-foreground/70 text-xs" style={{ fontFamily: config.fontBody }}>
            Integración final. Preparación para el próximo ciclo solar. Celebración de lo logrado.
          </p>
        </div>
      </div>
      
      {/* Energías Clave 2026 */}
      <div className={`${config.highlightSecondary} rounded-xl p-6 mb-6`}>
        <h3 className={`font-medium ${config.iconSecondary} text-lg mb-4 text-center`} style={{ fontFamily: config.fontDisplay }}>
          Energías Clave 2026
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <Circle className={`w-6 h-6 mx-auto mb-2`} fill="hsl(var(--primary))" stroke="none" />
            <h4 className={`font-medium ${config.iconPrimary} text-sm`} style={{ fontFamily: config.fontDisplay }}>
              Introspección
            </h4>
            <p className="text-foreground/60 text-xs mt-1" style={{ fontFamily: config.fontBody }}>
              Procesos internos, silencio fértil, sanación invisible
            </p>
          </div>
          <div className="text-center">
            <Circle className={`w-6 h-6 mx-auto mb-2`} fill="hsl(var(--secondary))" stroke="none" />
            <h4 className={`font-medium ${config.iconSecondary} text-sm`} style={{ fontFamily: config.fontDisplay }}>
              Autenticidad
            </h4>
            <p className="text-foreground/60 text-xs mt-1" style={{ fontFamily: config.fontBody }}>
              Coherencia, honestidad contigo, desapego de expectativas
            </p>
          </div>
          <div className="text-center">
            <Circle className={`w-6 h-6 mx-auto mb-2`} fill="hsl(var(--accent))" stroke="none" />
            <h4 className={`font-medium ${config.iconAccent} text-sm`} style={{ fontFamily: config.fontDisplay }}>
              Expresión
            </h4>
            <p className="text-foreground/60 text-xs mt-1" style={{ fontFamily: config.fontBody }}>
              Creatividad emocional, alegría sin filtro, juego
            </p>
          </div>
        </div>
      </div>
      
      {/* Configuración Astrológica Especial para Vero */}
      <div className={`${config.cardBg} ${config.cardBorder} rounded-xl p-6 mb-6`}>
        <h3 className={`font-medium ${config.iconSecondary} text-lg mb-4`} style={{ fontFamily: config.fontDisplay }}>
          Tu Configuración Astrológica 2026
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className={`font-medium ${config.iconPrimary} text-sm mb-1`} style={{ fontFamily: config.fontDisplay }}>
              Sol en Casa 12 (Retorno)
            </h4>
            <p className="text-foreground/60 text-xs" style={{ fontFamily: config.fontBody }}>
              Año de cierre interno antes de un nuevo comienzo visible. Los procesos más importantes serán invisibles para otros pero profundamente transformadores para ti.
            </p>
          </div>
          <div>
            <h4 className={`font-medium ${config.iconSecondary} text-sm mb-1`} style={{ fontFamily: config.fontDisplay }}>
              Luna en Leo Casa 5
            </h4>
            <p className="text-foreground/60 text-xs" style={{ fontFamily: config.fontBody }}>
              Tu necesidad emocional este año es expresarte sin juicio. Crear por el placer de crear. Permitirte alegría sin justificación.
            </p>
          </div>
          <div>
            <h4 className={`font-medium ${config.iconPrimary} text-sm mb-1`} style={{ fontFamily: config.fontDisplay }}>
              Venus con Quirón
            </h4>
            <p className="text-foreground/60 text-xs" style={{ fontFamily: config.fontBody }}>
              Sanar heridas relacionadas con el valor personal y las relaciones. Un año para el amor consciente.
            </p>
          </div>
          <div>
            <h4 className={`font-medium ${config.iconSecondary} text-sm mb-1`} style={{ fontFamily: config.fontDisplay }}>
              Ascendente Acuario (Retorno)
            </h4>
            <p className="text-foreground/60 text-xs" style={{ fontFamily: config.fontBody }}>
              Te presentas al mundo desde honestidad radical. No vienes a gustar: vienes a ser coherente contigo.
            </p>
          </div>
        </div>
      </div>
      
      {/* Mantra Footer */}
      <div className={`mt-auto text-center ${config.highlightSecondary} rounded-lg p-4`}>
        <p className={`${config.iconSecondary} italic`} style={{ fontFamily: config.fontBody }}>
          "Materializa lo invisible, transforma con consciencia"
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Sparkles className={`w-4 h-4 ${config.iconSecondary}`} />
        </div>
        <p className="text-foreground/50 text-xs mt-2">¡Feliz cumpleaños y feliz nuevo ciclo solar, Vero!</p>
      </div>
    </div>
  );
};

// ==========================================
// PÁGINA ESPECIAL CUMPLEAÑOS - 10 FEBRERO
// ==========================================
export const PaginaCumpleanos10Feb = () => {
  const { config } = useStyle();
  
  return (
    <div className={`print-page bg-background p-8 flex flex-col items-center justify-center ${config.pattern}`}>
      <div className="text-center max-w-md">
        <Sparkles className={`w-8 h-8 mx-auto ${config.iconSecondary} mb-4`} />
        
        <h2 className={`font-display text-3xl mb-2 ${config.titleGradient}`} style={{ fontFamily: config.fontDisplay }}>
          10 de Febrero
        </h2>
        <p className={`${config.iconSecondary} text-xl italic mb-6`} style={{ fontFamily: config.fontBody }}>
          Tu Nueva Vuelta al Sol
        </p>
        
        {/* Sun Circle */}
        <div className={`w-32 h-32 mx-auto rounded-full ${config.calendarColors.retornoSolar} flex items-center justify-center mb-6 border-4`}>
          <Sun className={`w-16 h-16 ${config.iconPrimary}`} />
        </div>
        
        <p className="text-foreground/70 italic mb-8" style={{ fontFamily: config.fontBody }}>
          "Cuando el Sol regresa a la posición que ocupaba en tu nacimiento, se completa un ciclo y comienza uno nuevo."
        </p>
        
        {/* Pasado - Presente - Futuro */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className={`${config.highlightPrimary} rounded-lg p-3`}>
            <span className="text-lg">☽</span>
            <h4 className={`font-medium ${config.iconSecondary} text-sm mt-1`} style={{ fontFamily: config.fontDisplay }}>
              Ciclo Pasado
            </h4>
            <ul className="text-foreground/60 text-xs mt-2 space-y-1 text-left" style={{ fontFamily: config.fontBody }}>
              <li>✧ Reflexiona sobre tus logros</li>
              <li>✧ Agradece las lecciones</li>
              <li>✧ Reconoce tu evolución</li>
            </ul>
          </div>
          <div className={`${config.highlightSecondary} rounded-lg p-3`}>
            <span className="text-lg">♡</span>
            <h4 className={`font-medium ${config.iconSecondary} text-sm mt-1`} style={{ fontFamily: config.fontDisplay }}>
              Presente
            </h4>
            <ul className="text-foreground/60 text-xs mt-2 space-y-1 text-left" style={{ fontFamily: config.fontBody }}>
              <li>✧ Siente gratitud por ser</li>
              <li>✧ Conéctate con seres queridos</li>
              <li>✧ Haz algo que te traiga alegría</li>
            </ul>
          </div>
          <div className={`${config.highlightPrimary} rounded-lg p-3`}>
            <span className="text-lg">☉</span>
            <h4 className={`font-medium ${config.iconSecondary} text-sm mt-1`} style={{ fontFamily: config.fontDisplay }}>
              Futuro
            </h4>
            <ul className="text-foreground/60 text-xs mt-2 space-y-1 text-left" style={{ fontFamily: config.fontBody }}>
              <li>✧ Visualiza tu próximo año</li>
              <li>✧ Establece intenciones</li>
              <li>✧ Conecta con tu propósito</li>
            </ul>
          </div>
        </div>
        
        {/* Ritual */}
        <div className={`${config.cardBg} ${config.cardBorder} rounded-lg p-4`}>
          <h4 className={`font-medium ${config.iconSecondary} text-sm mb-2 flex items-center justify-center gap-2`} style={{ fontFamily: config.fontDisplay }}>
            <Moon className="w-4 h-4" /> Ritual para tu Retorno Solar
          </h4>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-foreground/70 text-xs font-medium mb-1">Preparación:</p>
              <ul className="text-foreground/60 text-xs space-y-0.5" style={{ fontFamily: config.fontBody }}>
                <li>• Vela dorada o amarilla</li>
                <li>• Papel y bolígrafo</li>
                <li>• Objeto de tu año pasado</li>
                <li>• Objeto para el nuevo ciclo</li>
              </ul>
            </div>
            <div>
              <p className="text-foreground/70 text-xs font-medium mb-1">Pasos:</p>
              <ol className="text-foreground/60 text-xs space-y-0.5" style={{ fontFamily: config.fontBody }}>
                <li>1. Crea un espacio sagrado</li>
                <li>2. Enciende la vela</li>
                <li>3. Escribe lo que liberas</li>
                <li>4. Escribe tus intenciones</li>
                <li>5. Afirma positivamente</li>
              </ol>
            </div>
          </div>
        </div>
        
        <p className={`${config.iconSecondary} italic text-sm mt-6`} style={{ fontFamily: config.fontBody }}>
          "Eres un ser en constante evolución."
        </p>
      </div>
    </div>
  );
};
