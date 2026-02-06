import React from 'react';
import { useStyle } from '@/context/StyleContext';
import {
  BookOpen, Sun, Moon, Star, Calendar,
  PenLine, Heart, Sparkles
} from 'lucide-react';
import { FooterLibro } from './MesCompleto';

interface SeccionIndice {
  titulo: string;
  pagina: number;
  icono: React.ReactNode;
  id: string; // ID para navegación
  subsecciones?: { titulo: string; pagina: number; id: string }[];
}

export const IndiceNavegable: React.FC = () => {
  const { config } = useStyle();

  const handleNavigation = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const secciones: SeccionIndice[] = [
    {
      titulo: 'Bienvenida',
      pagina: 1,
      id: 'portal-entrada',
      icono: <BookOpen className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Portada', pagina: 1, id: 'portada' },
        { titulo: 'Carta de Bienvenida', pagina: 2, id: 'bienvenida' },
        { titulo: 'Guía de la Agenda', pagina: 3, id: 'guia-agenda' },
      ]
    },
    {
      titulo: 'Soul Chart - Tu Carta Natal',
      pagina: 5,
      id: 'soul-chart',
      icono: <Star className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Esencia Natal', pagina: 5, id: 'esencia-natal' },
        { titulo: 'Nodo Norte', pagina: 6, id: 'nodo-norte' },
        { titulo: 'Nodo Sur', pagina: 7, id: 'nodo-sur' },
        { titulo: 'Planetas Dominantes', pagina: 8, id: 'planetas-dominantes' },
        { titulo: 'Patrones Emocionales', pagina: 9, id: 'patrones-emocionales' },
      ]
    },
    {
      titulo: 'Retorno Solar',
      pagina: 10,
      id: 'retorno-solar',
      icono: <Sun className="w-4 h-4" />,
      subsecciones: [
        { titulo: '¿Qué es el Retorno Solar?', pagina: 10, id: 'que-es-retorno' },
        { titulo: 'Ascendente del Año', pagina: 11, id: 'ascendente-anio' },
        { titulo: 'Sol en Retorno', pagina: 12, id: 'sol-retorno' },
        { titulo: 'Luna en Retorno', pagina: 13, id: 'luna-retorno' },
        { titulo: 'Mercurio en Retorno', pagina: 14, id: 'mercurio-retorno' },
        { titulo: 'Venus en Retorno', pagina: 15, id: 'venus-retorno' },
        { titulo: 'Marte en Retorno', pagina: 16, id: 'marte-retorno' },
        { titulo: 'Ejes del Año', pagina: 17, id: 'ejes-anio' },
        { titulo: 'Mantra Anual', pagina: 21, id: 'mantra-anual' },
      ]
    },
    {
      titulo: 'Ciclos Anuales',
      pagina: 22,
      id: 'ciclos-anuales',
      icono: <Calendar className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Línea de Tiempo Emocional', pagina: 22, id: 'linea-tiempo' },
        { titulo: 'Meses Clave y Puntos de Giro', pagina: 23, id: 'meses-clave' },
        { titulo: 'Grandes Aprendizajes', pagina: 24, id: 'grandes-aprendizajes' },
      ]
    },
    {
      titulo: 'Tu Año',
      pagina: 25,
      id: 'tu-anio-overview',
      icono: <Star className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Overview del Año', pagina: 25, id: 'tu-anio-overview' },
        { titulo: 'Ciclos del Año', pagina: 26, id: 'ciclos-del-anio' },
        { titulo: 'Ritual de Cumpleaños', pagina: 27, id: 'ritual-cumpleanos' },
        { titulo: 'Primer Día del Ciclo', pagina: 28, id: 'primer-dia-ciclo' },
        { titulo: 'Intención Anual', pagina: 29, id: 'intencion-anual' },
      ]
    },
    {
      titulo: 'Calendario Mensual',
      pagina: 30,
      id: 'calendario-mensual',
      icono: <Moon className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Enero 2026', pagina: 30, id: 'mes-enero' },
        { titulo: 'Febrero 2026 (Cumpleaños)', pagina: 32, id: 'mes-febrero' },
      ]
    },
    {
      titulo: 'Terapia Astrológica Creativa',
      pagina: 141,
      id: 'terapia-creativa',
      icono: <Heart className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Escritura Terapéutica', pagina: 141, id: 'escritura-terapeutica' },
        { titulo: 'Visualización Guiada', pagina: 142, id: 'visualizacion' },
        { titulo: 'Ritual Simbólico', pagina: 143, id: 'ritual-simbolico' },
        { titulo: 'Trabajo Emocional', pagina: 144, id: 'trabajo-emocional' },
      ]
    },
    {
      titulo: 'Cierre del Ciclo',
      pagina: 146,
      id: 'cierre-ciclo',
      icono: <Sparkles className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'El Viaje Completado', pagina: 146, id: 'quien-era-quien-soy' },
        { titulo: 'Preparación Próxima Vuelta', pagina: 147, id: 'preparacion-proxima' },
        { titulo: 'Carta de Cierre', pagina: 148, id: 'carta-cierre' },
        { titulo: 'Página Final', pagina: 149, id: 'pagina-final' },
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
              {/* Sección principal - clickeable */}
              <button
                onClick={() => handleNavigation(seccion.id)}
                className={`w-full flex items-center gap-3 py-2 border-b ${config.highlightPrimary.includes('border') ? 'border-gray-100' : 'border-gray-100'} hover:bg-gray-50 transition-colors cursor-pointer no-print-hover`}
              >
                <span className={`${config.iconPrimary}`}>
                  {seccion.icono}
                </span>
                <span className={`flex-1 font-display text-sm font-medium text-gray-800 text-left`}>
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
              </button>

              {/* Subsecciones - clickeables */}
              {seccion.subsecciones && (
                <div className={`ml-8 border-l-2 ${config.cardBorder.replace('border-l-4', '')}`}>
                  {seccion.subsecciones.map((sub, subIdx) => (
                    <button
                      key={subIdx}
                      onClick={() => handleNavigation(sub.id)}
                      className="w-full flex items-center gap-3 py-1 pl-4 hover:bg-gray-50 transition-colors cursor-pointer no-print-hover"
                    >
                      <span className="flex-1 text-xs text-gray-600 text-left">
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
                    </button>
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
