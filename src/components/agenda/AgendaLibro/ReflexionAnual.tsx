'use client';

import { useStyle } from "@/context/StyleContext";
import { Sparkles, Moon, Sun, Calendar } from "lucide-react";

interface ReflexionAnualProps {
  year: number;
  userName: string;
}

// Página de resumen del año que comienza
export const TuAnioResumen = ({ year, userName }: ReflexionAnualProps) => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white p-10 flex flex-col ${config.pattern}`}>
      {/* Icono decorativo */}
      <div className={`text-center mb-6 ${config.iconPrimary}`}>
        <Sparkles className="w-12 h-12 mx-auto" />
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className={`${config.fontDisplay} text-4xl ${config.titleGradient} font-bold mb-2`}>
          Tu Año {year}
        </h1>
        <p className={`text-xl ${config.iconSecondary} ${config.fontBody}`}>
          Consolidación y Expansión
        </p>
      </div>

      <div className={`${config.divider} w-24 mx-auto mb-8`} />

      {/* Ciclo de Manifestación */}
      <div className="text-center mb-10">
        <h2 className={`${config.fontDisplay} text-xl ${config.iconPrimary} font-semibold mb-4`}>
          Ciclo de Manifestación
        </h2>
        <div className="flex items-center justify-center gap-6 text-3xl mb-2">
          <span className={config.iconSecondary}>☽</span>
          <span className={config.iconPrimary}>✦</span>
          <span className={config.iconAccent}>↗</span>
        </div>
      </div>

      {/* El Camino del año */}
      <div className={`${config.highlightPrimary} rounded-lg p-6 mb-6`}>
        <h3 className={`${config.fontDisplay} ${config.iconPrimary} text-lg font-bold mb-3`}>
          El Camino del {year}
        </h3>
        <p className={`text-gray-700 leading-relaxed ${config.fontBody}`}>
          {year} marca un punto de consolidación en tu evolución. Tras la exploración del {year - 1},
          entras en fase de manifestación tangible. Las semillas plantadas comienzan a dar frutos,
          mientras te enfocas en estructurar tus visiones. Este año te invita a equilibrar estructura
          y flexibilidad, esfuerzo y receptividad, transformando lo intangible en realidad concreta.
        </p>
      </div>

      {/* Influencias Planetarias */}
      <div className="mb-6">
        <h3 className={`${config.fontDisplay} ${config.iconSecondary} text-lg font-bold mb-4`}>
          Influencias Planetarias
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <div className={`${config.highlightSecondary} rounded-lg p-4`}>
            <div className="flex items-start gap-3">
              <Sun className={`w-5 h-5 ${config.iconPrimary} flex-shrink-0 mt-0.5`} />
              <div>
                <h4 className={`font-bold text-gray-800 text-sm ${config.fontBody}`}>Saturno en Piscis</h4>
                <p className={`text-xs text-gray-600 ${config.fontBody}`}>
                  Estructura tu intuición. Manifestación concreta de visión espiritual.
                </p>
              </div>
            </div>
          </div>
          <div className={`${config.highlightAccent} rounded-lg p-4`}>
            <div className="flex items-start gap-3">
              <Moon className={`w-5 h-5 ${config.iconSecondary} flex-shrink-0 mt-0.5`} />
              <div>
                <h4 className={`font-bold text-gray-800 text-sm ${config.fontBody}`}>Júpiter en Géminis</h4>
                <p className={`text-xs text-gray-600 ${config.fontBody}`}>
                  Expansión de conexiones y aprendizajes. Versatilidad mental.
                </p>
              </div>
            </div>
          </div>
          <div className={`${config.highlightPrimary} rounded-lg p-4`}>
            <div className="flex items-start gap-3">
              <Sparkles className={`w-5 h-5 ${config.iconAccent} flex-shrink-0 mt-0.5`} />
              <div>
                <h4 className={`font-bold text-gray-800 text-sm ${config.fontBody}`}>Plutón en Acuario</h4>
                <p className={`text-xs text-gray-600 ${config.fontBody}`}>
                  Transformación de relaciones y estructuras colectivas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Energías Clave */}
      <div className="mt-auto">
        <h3 className={`${config.fontDisplay} ${config.iconPrimary} text-base font-bold mb-3 text-center`}>
          Energías Clave {year}
        </h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className={`w-3 h-3 rounded-full ${config.badgePrimary} mx-auto mb-1`}></div>
            <p className={`text-xs font-bold ${config.iconPrimary} ${config.fontBody}`}>Manifestación</p>
            <p className={`text-[10px] text-gray-600 ${config.fontBody}`}>Tangibilidad, forma, presencia material</p>
          </div>
          <div>
            <div className={`w-3 h-3 rounded-full ${config.badgeSecondary} mx-auto mb-1`}></div>
            <p className={`text-xs font-bold ${config.iconSecondary} ${config.fontBody}`}>Integración</p>
            <p className={`text-[10px] text-gray-600 ${config.fontBody}`}>Síntesis, coherencia, unidad funcional</p>
          </div>
          <div>
            <div className={`w-3 h-3 rounded-full ${config.badgeAccent} mx-auto mb-1`}></div>
            <p className={`text-xs font-bold ${config.iconAccent} ${config.fontBody}`}>Expansión</p>
            <p className={`text-[10px] text-gray-600 ${config.fontBody}`}>Crecimiento, alcance, nuevos territorios</p>
          </div>
        </div>
      </div>

      {/* Frase inspiradora */}
      <div className="text-center mt-6">
        <p className={`${config.iconPrimary} italic text-sm ${config.fontBody}`}>
          "Materializa lo invisible, transforma con consciencia"
        </p>
        <div className={`${config.iconSecondary} text-2xl mt-2`}>✧</div>
      </div>
    </div>
  );
};

// Página de Ciclos del Año
export const CiclosDelAnio = ({ year }: { year: number }) => {
  const { config } = useStyle();

  const ciclos = [
    {
      periodo: "Enero-Marzo",
      titulo: "Cimientos y estructura",
      descripcion: "Planificación estratégica. Definición de metas anuales.",
      color: config.highlightPrimary
    },
    {
      periodo: "Abril-Junio",
      titulo: "Crecimiento y expansión",
      descripcion: "Desarrollo de proyectos. Nuevas asociaciones.",
      color: config.highlightSecondary
    },
    {
      periodo: "Julio-Sept",
      titulo: "Cosecha y refinamiento",
      descripcion: "Resultados visibles. Ajustes de curso.",
      color: config.highlightAccent
    },
    {
      periodo: "Oct-Dic",
      titulo: "Integración y visión",
      descripcion: "Celebración de logros. Preparación nuevo ciclo.",
      color: config.highlightSecondary
    }
  ];

  return (
    <div className={`print-page bg-white p-10 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient} font-bold mb-2`}>
          Ciclos del Año
        </h2>
        <p className={`text-gray-500 text-sm ${config.fontBody}`}>
          Las cuatro estaciones de tu manifestación
        </p>
        <div className={`${config.divider} w-24 mx-auto mt-4`} />
      </div>

      <div className="flex-1 space-y-6">
        {ciclos.map((ciclo, idx) => (
          <div key={idx} className={`${ciclo.color} rounded-lg p-5`}>
            <div className="flex items-start justify-between mb-2">
              <h3 className={`${config.fontDisplay} text-lg ${config.iconPrimary} font-bold`}>
                {ciclo.titulo}
              </h3>
              <span className={`${config.badgePrimary} px-3 py-1 rounded-full text-xs font-semibold`}>
                {ciclo.periodo}
              </span>
            </div>
            <p className={`text-gray-700 text-sm leading-relaxed ${config.fontBody}`}>
              {ciclo.descripcion}
            </p>
          </div>
        ))}
      </div>

      {/* Líneas de Crecimiento */}
      <div className="mt-8">
        <h3 className={`${config.fontDisplay} ${config.iconSecondary} text-lg font-bold mb-4`}>
          Líneas de Crecimiento
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-start gap-3">
            <Sparkles className={`w-5 h-5 ${config.iconPrimary} flex-shrink-0 mt-0.5`} />
            <div>
              <h4 className={`font-bold text-gray-800 text-sm ${config.fontBody}`}>Consolidación Profesional</h4>
              <p className={`text-xs text-gray-600 ${config.fontBody}`}>
                Estructuras sólidas en carrera. Mayor autoridad y reconocimiento.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className={`w-5 h-5 ${config.iconSecondary} flex-shrink-0 mt-0.5`} />
            <div>
              <h4 className={`font-bold text-gray-800 text-sm ${config.fontBody}`}>Liderazgo Espiritual</h4>
              <p className={`text-xs text-gray-600 ${config.fontBody}`}>
                Expresión concreta de sabiduría interior. Guiar desde autenticidad.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className={`w-5 h-5 ${config.iconAccent} flex-shrink-0 mt-0.5`} />
            <div>
              <h4 className={`font-bold text-gray-800 text-sm ${config.fontBody}`}>Materialización</h4>
              <p className={`text-xs text-gray-600 ${config.fontBody}`}>
                Manifestación de visiones. Convertir lo Invisible en tangible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Página de Reflexión Personal - Fin de Año
export const ReflexionFinDeAnio = ({ year, userName }: ReflexionAnualProps) => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white p-10 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-6">
        <Calendar className={`w-10 h-10 ${config.iconSecondary} mx-auto mb-3`} />
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient} font-bold mb-2`}>
          Diciembre {year - 1}
        </h2>
        <p className={`text-lg ${config.iconSecondary} ${config.fontBody}`}>
          Cerrando el ciclo
        </p>
        <div className={`${config.divider} w-24 mx-auto mt-4`} />
      </div>

      <div className={`${config.highlightSecondary} rounded-lg p-6 mb-6`}>
        <h3 className={`${config.fontDisplay} ${config.iconPrimary} font-bold mb-3`}>
          Querida {userName},
        </h3>
        <p className={`text-gray-700 leading-relaxed mb-4 ${config.fontBody}`}>
          Estás a punto de cerrar un ciclo solar completo. Este es el momento de honrar
          todo lo que viviste, aprendiste y transformaste desde tu último cumpleaños.
        </p>
        <p className={`text-gray-700 leading-relaxed ${config.fontBody}`}>
          Antes de dar la vuelta al Sol una vez más, tómate este espacio para reconocer
          tu camino.
        </p>
      </div>

      <div className="space-y-6 flex-1">
        <div className={`${config.highlightPrimary} rounded-lg p-5`}>
          <h4 className={`${config.fontDisplay} ${config.iconPrimary} font-bold mb-3 flex items-center gap-2`}>
            <span className="text-2xl">📖</span>
            Lo que me llevo de este año
          </h4>
          <div className="space-y-2">
            <div className={`border-b border-dashed ${config.iconSecondary} opacity-30 pb-3`}></div>
            <div className={`border-b border-dashed ${config.iconSecondary} opacity-30 pb-3`}></div>
            <div className={`border-b border-dashed ${config.iconSecondary} opacity-30 pb-3`}></div>
          </div>
        </div>

        <div className={`${config.highlightAccent} rounded-lg p-5`}>
          <h4 className={`${config.fontDisplay} ${config.iconAccent} font-bold mb-3 flex items-center gap-2`}>
            <span className="text-2xl">💫</span>
            Lo que dejo atrás
          </h4>
          <div className="space-y-2">
            <div className={`border-b border-dashed ${config.iconSecondary} opacity-30 pb-3`}></div>
            <div className={`border-b border-dashed ${config.iconSecondary} opacity-30 pb-3`}></div>
          </div>
        </div>

        <div className={`${config.highlightSecondary} rounded-lg p-5`}>
          <h4 className={`${config.fontDisplay} ${config.iconSecondary} font-bold mb-3 flex items-center gap-2`}>
            <span className="text-2xl">✨</span>
            Mi mayor aprendizaje
          </h4>
          <div className="space-y-2">
            <div className={`border-b border-dashed ${config.iconSecondary} opacity-30 pb-3`}></div>
            <div className={`border-b border-dashed ${config.iconSecondary} opacity-30 pb-3`}></div>
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <p className={`${config.iconSecondary} italic text-sm ${config.fontBody}`}>
          "Honra tu camino. Todo tuvo sentido."
        </p>
      </div>
    </div>
  );
};
