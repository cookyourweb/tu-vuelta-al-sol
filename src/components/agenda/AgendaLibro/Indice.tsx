'use client';

import React from 'react';
import { useStyle } from '@/context/StyleContext';
import {
  BookOpen, Sun, Moon, Star, Calendar,
  PenLine, Heart, Sparkles
} from 'lucide-react';

interface SeccionIndice {
  titulo: string;
  pagina: number;
  icono: React.ReactNode;
  subsecciones?: { titulo: string; pagina: number }[];
}

export const IndiceNavegable: React.FC = () => {
  const { config } = useStyle();

  const secciones: SeccionIndice[] = [
    {
      titulo: 'Portal de Entrada',
      pagina: 1,
      icono: <Sparkles className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Portada Personalizada', pagina: 1 },
        { titulo: 'Intención del Año', pagina: 2 },
      ]
    },
    {
      titulo: 'Tu Año, Tu Viaje',
      pagina: 3,
      icono: <BookOpen className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Carta de Bienvenida', pagina: 3 },
        { titulo: 'Tema Central del Año', pagina: 4 },
        { titulo: 'Lo Que Viene a Mover', pagina: 5 },
        { titulo: 'Lo Que Pide Soltar', pagina: 6 },
      ]
    },
    {
      titulo: 'Soul Chart',
      pagina: 7,
      icono: <Star className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Esencia Natal', pagina: 7 },
        { titulo: 'Nodo Norte', pagina: 8 },
        { titulo: 'Nodo Sur', pagina: 9 },
        { titulo: 'Planetas Dominantes', pagina: 10 },
        { titulo: 'Patrones Emocionales', pagina: 11 },
      ]
    },
    {
      titulo: 'Retorno Solar',
      pagina: 12,
      icono: <Sun className="w-4 h-4" />,
      subsecciones: [
        { titulo: '¿Qué es el Retorno Solar?', pagina: 12 },
        { titulo: 'Ascendente del Año', pagina: 13 },
        { titulo: 'Sol en Retorno', pagina: 14 },
        { titulo: 'Luna en Retorno', pagina: 15 },
        { titulo: 'Ejes del Año', pagina: 16 },
        { titulo: 'Ritual de Cumpleaños', pagina: 18 },
      ]
    },
    {
      titulo: 'Calendario Anual',
      pagina: 19,
      icono: <Calendar className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Línea de Tiempo Emocional', pagina: 19 },
        { titulo: 'Meses Clave', pagina: 20 },
        { titulo: 'Grandes Aprendizajes', pagina: 21 },
      ]
    },
    {
      titulo: 'Enero 2026',
      pagina: 22,
      icono: <Moon className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Calendario Mensual', pagina: 22 },
        { titulo: 'Semanas 1-4', pagina: 23 },
      ]
    },
    {
      titulo: 'Febrero - Diciembre 2026',
      pagina: 27,
      icono: <Calendar className="w-4 h-4" />,
    },
    {
      titulo: 'Terapias Creativas',
      pagina: 132,
      icono: <PenLine className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Escritura Terapéutica', pagina: 132 },
        { titulo: 'Visualización', pagina: 133 },
        { titulo: 'Ritual Simbólico', pagina: 134 },
      ]
    },
    {
      titulo: 'Cierre de Ciclo',
      pagina: 136,
      icono: <Heart className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Quién Era, Quién Soy', pagina: 136 },
        { titulo: 'Preparación Próxima Vuelta', pagina: 137 },
        { titulo: 'Carta de Cierre', pagina: 138 },
      ]
    },
  ];

  return (
    <div className={`print-page bg-white p-8 flex flex-col ${config.pattern}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className={`text-3xl font-display ${config.titleGradient} mb-2`}>
          Índice
        </h1>
        <div className={`w-16 h-px mx-auto ${config.iconAccent} opacity-50`} />
        <p className={`mt-2 text-xs italic ${config.iconSecondary}`}>
          Tu mapa para navegar el año
        </p>
      </div>

      {/* Secciones - ajustado a A5 */}
      <div className="flex-1 overflow-hidden">
        <div className="space-y-px">
          {secciones.map((seccion, idx) => (
            <div key={idx}>
              {/* Sección principal */}
              <div className="flex items-center gap-2 py-1.5 border-b border-gray-100">
                <span className={`${config.iconPrimary}`}>
                  {seccion.icono}
                </span>
                <span className={`flex-1 font-display text-sm font-medium text-gray-800`}>
                  {seccion.titulo}
                </span>
                <span className="text-gray-300 text-xs">{'·'.repeat(12)}</span>
                <span className={`w-6 text-right text-sm font-bold ${config.iconPrimary}`}>
                  {seccion.pagina}
                </span>
              </div>

              {/* Subsecciones */}
              {seccion.subsecciones && (
                <div className="ml-6 border-l border-gray-100">
                  {seccion.subsecciones.map((sub, subIdx) => (
                    <div
                      key={subIdx}
                      className="flex items-center gap-2 py-1 pl-3"
                    >
                      <span className="flex-1 text-xs text-gray-600">
                        {sub.titulo}
                      </span>
                      <span className="text-gray-200 text-xs">{'·'.repeat(8)}</span>
                      <span className="w-6 text-right text-xs text-gray-500">
                        {sub.pagina}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-200 text-center">
        <p className={`text-[10px] ${config.iconSecondary}`}>
          Este libro se lee según lo necesites, no de forma lineal.
          <br />
          <span className="italic">Salta, vuelve, subraya, escribe. Es tuyo.</span>
        </p>
      </div>
    </div>
  );
};
