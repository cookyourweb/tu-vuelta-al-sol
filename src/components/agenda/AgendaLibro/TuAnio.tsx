import React from 'react';
import { useStyle } from '@/context/StyleContext';
import { Star, Moon, Sun, Sparkles, TrendingUp, Circle } from 'lucide-react';
import { FooterLibro } from './MesCompleto';

// ==========================================
// TU AÑO - OVERVIEW
// (Tu cumpleaños año presente - Tu cumpleaños año siguiente)
// ==========================================

interface TuAnioProps {
  startDate: Date;
  endDate: Date;
  userName: string;
  hasSolarReturn?: boolean; // Nuevo prop para indicar si tiene Solar Return
}

export const TuAnioOverview: React.FC<TuAnioProps> = ({ startDate, endDate, userName, hasSolarReturn = false }) => {
  const { config } = useStyle();
  const yearStart = startDate.getFullYear();
  const yearEnd = endDate.getFullYear();

  return (
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <Star className={`w-10 h-10 mx-auto ${config.iconSecondary} mb-4`} />
        <h1 className={`text-4xl mb-2 ${config.titleGradient}`}>
          Tu Año {yearStart}–{yearEnd}
        </h1>

        {/* Aviso si no hay Solar Return */}
        {!hasSolarReturn && (
          <div className="mt-4 inline-flex flex-col items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200 no-print">
            <span className="text-xs font-semibold text-amber-800">⚠️ Contenido Genérico</span>
            <p className="text-xs text-amber-700">
              Esta información se personalizará cuando generes tu Retorno Solar
            </p>
          </div>
        )}

        <p className={`${config.iconSecondary} text-xl italic mt-2`}>
          {hasSolarReturn ? 'Tu Camino Personalizado' : 'Consolidación y Expansión'}
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <span className={`${config.badgeSecondary} px-3 py-1 rounded-full text-sm`}>
            Ciclo de Manifestación
          </span>
        </div>
        <div className="flex items-center justify-center gap-3 mt-4">
          <Moon className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400">✦</span>
          <span className="text-gray-400">✧</span>
        </div>
      </div>

      {/* El Camino del Año */}
      <div className={`${config.highlightPrimary} rounded-xl p-6 mb-6`}>
        <h3 className={`font-medium ${config.iconSecondary} text-lg mb-3`}>
          El Camino de este Año
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Este año marca un punto de consolidación en tu evolución. Tras la exploración del año anterior,
          entras en fase de manifestación tangible. Las semillas plantadas comienzan a dar frutos,
          mientras te enfocas en estructurar tus visiones. Este año te invita a equilibrar estructura
          y flexibilidad, esfuerzo y receptividad, transformando lo intangible en realidad concreta.
        </p>
        <p className="text-gray-700 leading-relaxed mt-3">
          Con tu Sol en Acuario Casa 12 del Retorno Solar, este año tiene un componente de cierre
          y preparación silenciosa. No todo lo que se construye será visible de inmediato, pero
          será profundamente real.
        </p>
      </div>

      {/* Influencias Planetarias */}
      <div className={`${config.highlightSecondary} rounded-xl p-6 mb-6`}>
        <h3 className={`font-medium ${config.iconSecondary} text-lg mb-4`}>
          Influencias Planetarias
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <Sparkles className={`w-5 h-5 mx-auto ${config.iconPrimary} mb-2`} />
            <h4 className={`font-medium ${config.iconPrimary} text-sm`}>
              Saturno en Piscis
            </h4>
            <p className="text-gray-600 text-xs mt-1">
              Estructura tu intuición. Manifestación concreta de visión espiritual.
            </p>
          </div>
          <div className="text-center">
            <Moon className={`w-5 h-5 mx-auto ${config.iconSecondary} mb-2`} />
            <h4 className={`font-medium ${config.iconSecondary} text-sm`}>
              Júpiter en Géminis
            </h4>
            <p className="text-gray-600 text-xs mt-1">
              Expansión de conexiones y aprendizajes. Versatilidad mental.
            </p>
          </div>
          <div className="text-center">
            <Star className={`w-5 h-5 mx-auto ${config.iconAccent} mb-2`} />
            <h4 className={`font-medium ${config.iconAccent} text-sm`}>
              Plutón en Acuario
            </h4>
            <p className="text-gray-600 text-xs mt-1">
              Transformación de relaciones y estructuras colectivas.
            </p>
          </div>
        </div>
      </div>

      {/* Líneas de Crecimiento */}
      <div className={`${config.cardBg} ${config.cardBorder} rounded-xl p-6 mb-6`}>
        <h3 className={`font-medium ${config.iconSecondary} text-lg mb-4`}>
          Líneas de Crecimiento
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Sparkles className={`w-4 h-4 ${config.iconPrimary} mb-2`} />
            <h4 className={`font-medium ${config.iconPrimary} text-sm`}>
              Integración Interior
            </h4>
            <p className="text-gray-600 text-xs mt-1">
              Procesos de sanación profunda. Cierre de ciclos emocionales antiguos.
            </p>
          </div>
          <div>
            <TrendingUp className={`w-4 h-4 ${config.iconSecondary} mb-2`} />
            <h4 className={`font-medium ${config.iconSecondary} text-sm`}>
              Autenticidad Visible
            </h4>
            <p className="text-gray-600 text-xs mt-1">
              Expresión consciente de quién eres. Mostrarte sin máscaras.
            </p>
          </div>
          <div>
            <Sun className={`w-4 h-4 ${config.iconAccent} mb-2`} />
            <h4 className={`font-medium ${config.iconAccent} text-sm`}>
              Creatividad Emocional
            </h4>
            <p className="text-gray-600 text-xs mt-1">
              Luna en Leo pide expresión alegre. Juego sin necesidad de aprobación.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto text-center">
        <p className={`${config.iconSecondary} italic text-sm`}>
          "Confío en lo que se gesta en silencio."
        </p>
      </div>

      <FooterLibro pagina={25} />
    </div>
  );
};

export const TuAnioCiclos: React.FC<TuAnioProps> = ({ startDate, endDate, hasSolarReturn = false }) => {
  const { config } = useStyle();
  const yearStart = startDate.getFullYear();
  const yearEnd = endDate.getFullYear();

  return (
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      {/* Ciclos del Año */}
      <h2 className={`text-2xl mb-6 ${config.titleGradient} text-center`}>
        Ciclos del Año
      </h2>

      {/* Aviso si no hay Solar Return */}
      {!hasSolarReturn && (
        <div className="mb-4 mx-auto inline-flex flex-col items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200 no-print">
          <span className="text-xs font-semibold text-amber-800">⚠️ Contenido Genérico</span>
          <p className="text-xs text-amber-700 text-center">
            Esta información se personalizará cuando generes tu Retorno Solar
          </p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3 mb-8">
        <div className={`${config.highlightPrimary} rounded-lg p-4`}>
          <h4 className={`font-medium ${config.iconSecondary} text-sm mb-2`}>
            Feb-Abril
          </h4>
          <p className="text-gray-700 text-xs">
            Cimientos internos. Cierre de ciclos. Tu cumpleaños abre el portal de introspección consciente.
          </p>
        </div>
        <div className={`${config.highlightSecondary} rounded-lg p-4`}>
          <h4 className={`font-medium ${config.iconSecondary} text-sm mb-2`}>
            Mayo-Julio
          </h4>
          <p className="text-gray-700 text-xs">
            Crecimiento relacional. Vínculos que respetan tu proceso interno. Equilibrio entre dar y recibir.
          </p>
        </div>
        <div className={`${config.highlightPrimary} rounded-lg p-4`}>
          <h4 className={`font-medium ${config.iconSecondary} text-sm mb-2`}>
            Agosto-Oct
          </h4>
          <p className="text-gray-700 text-xs">
            Expresión creativa. Lo que has integrado comienza a manifestarse externamente.
          </p>
        </div>
        <div className={`${config.highlightSecondary} rounded-lg p-4`}>
          <h4 className={`font-medium ${config.iconSecondary} text-sm mb-2`}>
            Nov-Enero
          </h4>
          <p className="text-gray-700 text-xs">
            Integración final. Preparación para el próximo ciclo solar. Celebración de lo logrado.
          </p>
        </div>
      </div>

      {/* Energías Clave */}
      <div className={`${config.highlightSecondary} rounded-xl p-6 mb-6`}>
        <h3 className={`font-medium ${config.iconSecondary} text-lg mb-4 text-center`}>
          Energías Clave {yearStart}–{yearEnd}
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <Circle className={`w-6 h-6 mx-auto mb-2 ${config.iconPrimary}`} fill="currentColor" stroke="none" />
            <h4 className={`font-medium ${config.iconPrimary} text-sm`}>
              Introspección
            </h4>
            <p className="text-gray-600 text-xs mt-1">
              Procesos internos, silencio fértil, sanación invisible
            </p>
          </div>
          <div className="text-center">
            <Circle className={`w-6 h-6 mx-auto mb-2 ${config.iconSecondary}`} fill="currentColor" stroke="none" />
            <h4 className={`font-medium ${config.iconSecondary} text-sm`}>
              Autenticidad
            </h4>
            <p className="text-gray-600 text-xs mt-1">
              Coherencia, honestidad contigo, desapego de expectativas
            </p>
          </div>
          <div className="text-center">
            <Circle className={`w-6 h-6 mx-auto mb-2 ${config.iconAccent}`} fill="currentColor" stroke="none" />
            <h4 className={`font-medium ${config.iconAccent} text-sm`}>
              Expresión
            </h4>
            <p className="text-gray-600 text-xs mt-1">
              Creatividad emocional, alegría sin filtro, juego
            </p>
          </div>
        </div>
      </div>

      {/* Configuración Astrológica */}
      <div className={`${config.cardBg} ${config.cardBorder} rounded-xl p-6 mb-6`}>
        <h3 className={`font-medium ${config.iconSecondary} text-lg mb-4`}>
          Tu Configuración Astrológica {yearStart}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className={`font-medium ${config.iconPrimary} text-sm mb-1`}>
              Sol en Casa 12 (Retorno)
            </h4>
            <p className="text-gray-600 text-xs">
              Año de cierre interno antes de un nuevo comienzo visible. Los procesos más importantes serán invisibles para otros pero profundamente transformadores para ti.
            </p>
          </div>
          <div>
            <h4 className={`font-medium ${config.iconSecondary} text-sm mb-1`}>
              Luna en Leo Casa 5
            </h4>
            <p className="text-gray-600 text-xs">
              Tu necesidad emocional este año es expresarte sin juicio. Crear por el placer de crear. Permitirte alegría sin justificación.
            </p>
          </div>
          <div>
            <h4 className={`font-medium ${config.iconPrimary} text-sm mb-1`}>
              Venus con Quirón
            </h4>
            <p className="text-gray-600 text-xs">
              Sanar heridas relacionadas con el valor personal y las relaciones. Un año para el amor consciente.
            </p>
          </div>
          <div>
            <h4 className={`font-medium ${config.iconSecondary} text-sm mb-1`}>
              Ascendente Acuario (Retorno)
            </h4>
            <p className="text-gray-600 text-xs">
              Te presentas al mundo desde honestidad radical. No vienes a gustar: vienes a ser coherente contigo.
            </p>
          </div>
        </div>
      </div>

      {/* Mantra Footer */}
      <div className={`mt-auto text-center ${config.highlightSecondary} rounded-lg p-4`}>
        <p className={`${config.iconSecondary} italic`}>
          "Materializa lo invisible, transforma con consciencia"
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Sparkles className={`w-4 h-4 ${config.iconSecondary}`} />
        </div>
      </div>

      <FooterLibro pagina={26} />
    </div>
  );
};

// ==========================================
// PÁGINA ESPECIAL CUMPLEAÑOS
// ==========================================
export const PaginaCumpleanos: React.FC<{ birthDate: Date; userName: string }> = ({ birthDate, userName }) => {
  const { config } = useStyle();
  const birthDay = birthDate.getDate();
  const birthMonth = birthDate.toLocaleDateString('es-ES', { month: 'long' });

  return (
    <div className={`print-page bg-white p-12 flex flex-col items-center justify-center ${config.pattern}`}>
      <div className="text-center max-w-md">
        <Sparkles className={`w-8 h-8 mx-auto ${config.iconSecondary} mb-4`} />

        <h2 className={`text-3xl mb-2 ${config.titleGradient}`}>
          {birthDay} de {birthMonth}
        </h2>
        <p className={`${config.iconSecondary} text-xl italic mb-6`}>
          Tu Nueva Vuelta al Sol
        </p>

        {/* Sun Circle */}
        <div className={`w-32 h-32 mx-auto rounded-full ${config.highlightAccent} flex items-center justify-center mb-6 border-4 ${config.cardBorder}`}>
          <Sun className={`w-16 h-16 ${config.iconPrimary}`} />
        </div>

        <p className="text-gray-600 italic mb-8">
          "Cuando el Sol regresa a la posición que ocupaba en tu nacimiento, se completa un ciclo y comienza uno nuevo."
        </p>

        {/* Pasado - Presente - Futuro */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className={`${config.highlightPrimary} rounded-lg p-3`}>
            <span className="text-lg">☽</span>
            <h4 className={`font-medium ${config.iconSecondary} text-sm mt-1`}>
              Ciclo Pasado
            </h4>
            <ul className="text-gray-600 text-xs mt-2 space-y-1 text-left">
              <li>✧ Reflexiona sobre tus logros</li>
              <li>✧ Agradece las lecciones</li>
              <li>✧ Reconoce tu evolución</li>
            </ul>
          </div>
          <div className={`${config.highlightSecondary} rounded-lg p-3`}>
            <span className="text-lg">♡</span>
            <h4 className={`font-medium ${config.iconSecondary} text-sm mt-1`}>
              Presente
            </h4>
            <ul className="text-gray-600 text-xs mt-2 space-y-1 text-left">
              <li>✧ Siente gratitud por ser</li>
              <li>✧ Conéctate con seres queridos</li>
              <li>✧ Haz algo que te traiga alegría</li>
            </ul>
          </div>
          <div className={`${config.highlightPrimary} rounded-lg p-3`}>
            <span className="text-lg">☉</span>
            <h4 className={`font-medium ${config.iconSecondary} text-sm mt-1`}>
              Futuro
            </h4>
            <ul className="text-gray-600 text-xs mt-2 space-y-1 text-left">
              <li>✧ Visualiza tu próximo año</li>
              <li>✧ Establece intenciones</li>
              <li>✧ Conecta con tu propósito</li>
            </ul>
          </div>
        </div>

        {/* Ritual */}
        <div className={`${config.cardBg} ${config.cardBorder} rounded-lg p-4`}>
          <h4 className={`font-medium ${config.iconSecondary} text-sm mb-2 flex items-center justify-center gap-2`}>
            <Moon className="w-4 h-4" /> Ritual para tu Retorno Solar
          </h4>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-gray-700 text-xs font-medium mb-1">Preparación:</p>
              <ul className="text-gray-600 text-xs space-y-0.5">
                <li>• Vela dorada o amarilla</li>
                <li>• Papel y bolígrafo</li>
                <li>• Objeto de tu año pasado</li>
                <li>• Objeto para el nuevo ciclo</li>
              </ul>
            </div>
            <div>
              <p className="text-gray-700 text-xs font-medium mb-1">Pasos:</p>
              <ol className="text-gray-600 text-xs space-y-0.5">
                <li>1. Crea un espacio sagrado</li>
                <li>2. Enciende la vela</li>
                <li>3. Escribe lo que liberas</li>
                <li>4. Escribe tus intenciones</li>
                <li>5. Afirma positivamente</li>
              </ol>
            </div>
          </div>
        </div>

        <p className={`${config.iconSecondary} italic text-sm mt-6`}>
          "Eres un ser en constante evolución."
        </p>
        <p className="text-gray-500 text-xs mt-4">¡Feliz cumpleaños y feliz nuevo ciclo solar, {userName}!</p>
      </div>

      <FooterLibro />
    </div>
  );
};
