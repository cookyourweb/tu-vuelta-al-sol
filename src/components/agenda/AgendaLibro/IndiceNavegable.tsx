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
        { titulo: 'Meses Clave y Puntos de Giro', pagina: 20 },
        { titulo: 'Grandes Aprendizajes', pagina: 21 },
      ]
    },
    {
      titulo: 'Enero 2026',
      pagina: 22,
      icono: <Moon className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Apertura del Mes', pagina: 22 },
        { titulo: 'Calendario Mensual', pagina: 24 },
        { titulo: 'Semanas 1-4', pagina: 25 },
        { titulo: 'Ejercicios del Mes', pagina: 33 },
      ]
    },
    {
      titulo: 'Febrero 2026 · Retorno Solar',
      pagina: 34,
      icono: <Sun className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Página de Cumpleaños', pagina: 34 },
        { titulo: 'Calendario Mensual', pagina: 35 },
        { titulo: 'Semanas 5-8', pagina: 36 },
      ]
    },
    {
      titulo: 'Marzo - Diciembre 2026',
      pagina: 44,
      icono: <Calendar className="w-4 h-4" />,
    },
    {
      titulo: 'Enero 2027',
      pagina: 120,
      icono: <Moon className="w-4 h-4" />,
    },
    {
      titulo: 'Terapias Creativas',
      pagina: 132,
      icono: <PenLine className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Escritura Terapéutica', pagina: 132 },
        { titulo: 'Visualización', pagina: 133 },
        { titulo: 'Ritual Simbólico', pagina: 134 },
        { titulo: 'Trabajo Emocional', pagina: 135 },
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
    <div className={`print-page bg-white p-10 flex flex-col ${config.pattern}`}>
      {/* Header elegante */}
      <div className="text-center mb-10">
        <h1 className={`text-4xl font-display ${config.titleGradient} mb-2`}>
          Índice
        </h1>
        <div className={`w-24 h-0.5 mx-auto ${config.iconAccent} opacity-50`}
             style={{ background: 'linear-gradient(90deg, transparent, currentColor, transparent)' }} />
        <p className={`mt-4 text-sm italic ${config.iconSecondary}`}>
          Tu mapa para navegar el año
        </p>
      </div>

      {/* Grid de secciones */}
      <div className="flex-1">
        <div className="space-y-1">
          {secciones.map((seccion, idx) => (
            <div key={idx}>
              {/* Sección principal */}
              <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                <span className={`${config.iconPrimary}`}>
                  {seccion.icono}
                </span>
                <span className={`flex-1 font-display text-base font-medium text-gray-800`}>
                  {seccion.titulo}
                </span>
                <span className="flex-shrink-0">
                  {/* Línea de puntos */}
                  <span className="text-gray-300 tracking-[0.2em] text-xs">
                    {'·'.repeat(20)}
                  </span>
                </span>
                <span className={`w-8 text-right font-bold ${config.iconPrimary}`}>
                  {seccion.pagina}
                </span>
              </div>

              {/* Subsecciones */}
              {seccion.subsecciones && (
                <div className="ml-8 border-l border-gray-100">
                  {seccion.subsecciones.map((sub, subIdx) => (
                    <div
                      key={subIdx}
                      className="flex items-center gap-3 py-1.5 pl-4"
                    >
                      <span className="flex-1 text-sm text-gray-600">
                        {sub.titulo}
                      </span>
                      <span className="flex-shrink-0">
                        <span className="text-gray-200 tracking-[0.15em] text-xs">
                          {'·'.repeat(15)}
                        </span>
                      </span>
                      <span className="w-8 text-right text-sm text-gray-500">
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
      <div className="mt-8 pt-4 border-t border-gray-200 text-center">
        <p className={`text-xs ${config.iconSecondary}`}>
          Este libro se lee según lo necesites, no de forma lineal.
          <br />
          <span className="italic">Salta, vuelve, subraya, escribe. Es tuyo.</span>
        </p>
      </div>
    </div>
  );
};

export default IndiceNavegable;
