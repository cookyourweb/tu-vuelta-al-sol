'use client';

import { useStyle } from "@/context/StyleContext";
import { BookOpen, Star, Moon, Sun, Compass, Heart, Calendar, Sparkles } from "lucide-react";

export const PaginaIndice = () => {
  const { config } = useStyle();

  const secciones = [
    { num: 1, titulo: "Portal de Entrada", pagina: "1", icon: <Star className="w-4 h-4" /> },
    { num: 2, titulo: "Tu Año, Tu Viaje", pagina: "4", icon: <Compass className="w-4 h-4" /> },
    { num: 3, titulo: "Soul Chart - Tu Esencia Natal", pagina: "9", icon: <Heart className="w-4 h-4" /> },
    { num: 4, titulo: "Retorno Solar", pagina: "14", icon: <Sun className="w-4 h-4" /> },
    { num: 5, titulo: "Calendario y Eventos del Año", pagina: "23", icon: <Calendar className="w-4 h-4" /> },
    { num: 6, titulo: "Terapias Creativas", pagina: "36", icon: <Sparkles className="w-4 h-4" /> },
    { num: 7, titulo: "Reflexión de Fin de Año", pagina: "40", icon: <Moon className="w-4 h-4" /> },
    { num: 8, titulo: "Cierre de Ciclo", pagina: "41", icon: <BookOpen className="w-4 h-4" /> }
  ];

  return (
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      {/* Header */}
      <div className="text-center mb-10">
        <BookOpen className={`w-12 h-12 ${config.iconPrimary} mx-auto mb-4`} />
        <h1 className={`${config.fontDisplay} text-4xl ${config.titleGradient} font-bold mb-2`}>
          Índice
        </h1>
        <p className={`text-gray-500 text-sm ${config.fontBody}`}>
          Tu guía para navegar este año solar
        </p>
        <div className={`${config.divider} w-24 mx-auto mt-4`} />
      </div>

      {/* Índice */}
      <div className="flex-1 space-y-1 max-w-2xl mx-auto w-full">
        {secciones.map((seccion, idx) => (
          <div
            key={idx}
            className={`
              group flex items-center justify-between py-4 px-5 rounded-lg
              transition-all duration-200
              ${idx % 2 === 0 ? config.highlightPrimary : config.highlightSecondary}
              hover:shadow-md
            `}
          >
            <div className="flex items-center gap-4 flex-1">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${config.badgePrimary}
              `}>
                <span className={`text-sm font-bold ${config.headerText}`}>
                  {seccion.num}
                </span>
              </div>

              <div className="flex items-center gap-3 flex-1">
                <div className={config.iconSecondary}>
                  {seccion.icon}
                </div>
                <h3 className={`${config.fontBody} text-gray-800 font-medium text-base`}>
                  {seccion.titulo}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`h-px flex-1 min-w-[40px] border-t-2 border-dotted ${config.iconSecondary} opacity-30`}></div>
              <span className={`${config.fontDisplay} ${config.iconPrimary} font-bold text-lg`}>
                {seccion.pagina}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-10 text-center">
        <p className={`${config.iconSecondary} text-sm italic ${config.fontBody}`}>
          "Cada página es una invitación a conocerte más profundamente"
        </p>
        <div className={`${config.iconSecondary} text-2xl mt-3`}>✧</div>
      </div>
    </div>
  );
};
