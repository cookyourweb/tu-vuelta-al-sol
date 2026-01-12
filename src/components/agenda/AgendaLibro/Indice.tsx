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
    <div className={`print-page bg-white p-12 flex flex-col ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`${config.iconSecondary} opacity-60 text-sm tracking-[0.3em] uppercase ${config.fontBody}`}>Navegación</span>
        <h2 className={`${config.fontDisplay} text-3xl ${config.titleGradient} mt-2`}>Índice</h2>
      </div>

      <div className={`space-y-4 text-gray-700 leading-relaxed max-w-2xl mx-auto ${config.fontBody}`}>
        {secciones.map((seccion, idx) => (
          <div key={idx}>
            {/* Sección principal */}
            <div className="flex items-center gap-3 py-2 border-b border-gray-200">
              <span className={`${config.iconPrimary}`}>
                {seccion.icono}
              </span>
              <span className="flex-1 font-medium text-gray-800">
                {seccion.titulo}
              </span>
              <span className="text-gray-300">{'·'.repeat(15)}</span>
              <span className={`font-bold ${config.iconPrimary}`}>
                {seccion.pagina}
              </span>
            </div>

            {/* Subsecciones */}
            {seccion.subsecciones && (
              <div className="ml-8 space-y-1 mt-2">
                {seccion.subsecciones.map((sub, subIdx) => (
                  <div
                    key={subIdx}
                    className="flex items-center gap-2"
                  >
                    <span className="flex-1 text-sm text-gray-600">
                      {sub.titulo}
                    </span>
                    <span className="text-gray-200">{'·'.repeat(12)}</span>
                    <span className="text-sm text-gray-500">
                      {sub.pagina}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={`mt-auto text-center ${config.iconSecondary} opacity-60 italic ${config.fontBody}`}>
        Tu mapa para navegar el año ✧
      </div>
    </div>
  );
};
