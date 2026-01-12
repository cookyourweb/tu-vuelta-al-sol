import React from 'react';
import { useStyle } from '@/contexts/StyleContext';
import { 
  BookOpen, Sun, Moon, Star, Calendar, 
  PenLine, Heart, Sparkles 
} from 'lucide-react';
import { FooterLibro } from './MesCompleto';

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
        { titulo: 'Calendario + Mapa del Mes', pagina: 22 },
        { titulo: 'Lunas + Ejercicios + Mantra', pagina: 23 },
        { titulo: 'Semanas con Interpretación', pagina: 24 },
        { titulo: 'Cierre del Mes', pagina: 28 },
      ]
    },
    {
      titulo: 'Febrero 2026 · Retorno Solar',
      pagina: 29,
      icono: <Sun className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Primer Día del Ciclo', pagina: 29 },
        { titulo: 'Calendario + Mapa', pagina: 30 },
        { titulo: 'Semana del Cumpleaños', pagina: 32 },
      ]
    },
    {
      titulo: 'Marzo - Diciembre 2026',
      pagina: 35,
      icono: <Calendar className="w-4 h-4" />,
    },
    {
      titulo: 'Enero 2027',
      pagina: 110,
      icono: <Moon className="w-4 h-4" />,
    },
    {
      titulo: 'Terapias Creativas',
      pagina: 120,
      icono: <PenLine className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Escritura Terapéutica', pagina: 120 },
        { titulo: 'Visualización', pagina: 121 },
        { titulo: 'Ritual Simbólico', pagina: 122 },
        { titulo: 'Trabajo Emocional', pagina: 123 },
      ]
    },
    {
      titulo: 'Cierre de Ciclo',
      pagina: 124,
      icono: <Heart className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Último Día del Ciclo', pagina: 124 },
        { titulo: 'Quién Era, Quién Soy', pagina: 125 },
        { titulo: 'Carta de Cierre', pagina: 126 },
      ]
    },
  ];

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm 20mm' }}>
      {/* Header elegante */}
      <div className="text-center mb-8">
        <h1 className={`text-3xl font-display ${config.titleGradient} mb-2`}>
          Índice
        </h1>
        <div className={`${config.divider} w-24 mx-auto`} />
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
              <div className={`flex items-center gap-3 py-2 border-b ${config.highlightPrimary.includes('border') ? 'border-gray-100' : 'border-gray-100'}`}>
                <span className={`${config.iconPrimary}`}>
                  {seccion.icono}
                </span>
                <span className={`flex-1 font-display text-sm font-medium text-gray-800`}>
                  {seccion.titulo}
                </span>
                <span className="flex-shrink-0">
                  <span className="text-gray-300 tracking-[0.2em] text-xs">
                    {'·'.repeat(15)}
                  </span>
                </span>
                <span className={`w-8 text-right font-bold text-sm ${config.iconPrimary}`}>
                  {seccion.pagina}
                </span>
              </div>

              {/* Subsecciones */}
              {seccion.subsecciones && (
                <div className={`ml-8 border-l-2 ${config.cardBorder.replace('border-l-4', '')}`}>
                  {seccion.subsecciones.map((sub, subIdx) => (
                    <div 
                      key={subIdx} 
                      className="flex items-center gap-3 py-1 pl-4"
                    >
                      <span className="flex-1 text-xs text-gray-600">
                        {sub.titulo}
                      </span>
                      <span className="flex-shrink-0">
                        <span className="text-gray-200 tracking-[0.15em] text-xs">
                          {'·'.repeat(10)}
                        </span>
                      </span>
                      <span className="w-8 text-right text-xs text-gray-500">
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
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className={`text-xs ${config.iconSecondary}`}>
          Este libro se lee según lo necesites, no de forma lineal.
          <br />
          <span className="italic">Salta, vuelve, subraya, escribe. Es tuyo.</span>
        </p>
      </div>

      <FooterLibro />
    </div>
  );
};

export default IndiceNavegable;
