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
      titulo: 'Portal de Entrada',
      pagina: 1,
      id: 'portal-entrada',
      icono: <Sparkles className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Portada Personalizada', pagina: 1, id: 'portada' },
        { titulo: 'Intención del Año', pagina: 2, id: 'intencion-anio' },
      ]
    },
    {
      titulo: 'Tu Año, Tu Viaje',
      pagina: 3,
      id: 'tu-anio-tu-viaje',
      icono: <BookOpen className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Carta de Bienvenida', pagina: 3, id: 'carta-bienvenida' },
        { titulo: 'Tema Central del Año', pagina: 4, id: 'tema-central' },
        { titulo: 'Lo Que Viene a Mover', pagina: 5, id: 'viene-mover' },
        { titulo: 'Lo Que Pide Soltar', pagina: 6, id: 'pide-soltar' },
      ]
    },
    {
      titulo: 'Soul Chart',
      pagina: 7,
      id: 'soul-chart',
      icono: <Star className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Esencia Natal', pagina: 7, id: 'esencia-natal' },
        { titulo: 'Nodo Norte', pagina: 8, id: 'nodo-norte' },
        { titulo: 'Nodo Sur', pagina: 9, id: 'nodo-sur' },
        { titulo: 'Planetas Dominantes', pagina: 10, id: 'planetas-dominantes' },
        { titulo: 'Patrones Emocionales', pagina: 11, id: 'patrones-emocionales' },
      ]
    },
    {
      titulo: 'Retorno Solar',
      pagina: 12,
      id: 'retorno-solar',
      icono: <Sun className="w-4 h-4" />,
      subsecciones: [
        { titulo: '¿Qué es el Retorno Solar?', pagina: 12, id: 'que-es-retorno' },
        { titulo: 'Ascendente del Año', pagina: 13, id: 'ascendente-anio' },
        { titulo: 'Sol en Retorno', pagina: 14, id: 'sol-retorno' },
        { titulo: 'Luna en Retorno', pagina: 15, id: 'luna-retorno' },
        { titulo: 'Ejes del Año', pagina: 16, id: 'ejes-anio' },
        { titulo: 'Ritual de Cumpleaños', pagina: 18, id: 'ritual-cumpleanos' },
      ]
    },
    {
      titulo: 'Tu Año 2026-2027',
      pagina: 13,
      id: 'tu-anio-overview',
      icono: <Star className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Overview del Año', pagina: 13, id: 'tu-anio-overview' },
        { titulo: 'Ciclos del Año', pagina: 14, id: 'ciclos-del-anio' },
      ]
    },
    {
      titulo: 'Ciclos Anuales',
      pagina: 15,
      id: 'ciclos-anuales',
      icono: <Calendar className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Línea de Tiempo Emocional', pagina: 15, id: 'linea-tiempo' },
        { titulo: 'Meses Clave y Puntos de Giro', pagina: 16, id: 'meses-clave' },
        { titulo: 'Grandes Aprendizajes', pagina: 17, id: 'grandes-aprendizajes' },
      ]
    },
    {
      titulo: 'Calendario Mensual',
      pagina: 19,
      id: 'calendario-mensual',
      icono: <Moon className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Enero 2026', pagina: 19, id: 'mes-enero' },
        { titulo: 'Febrero 2026 (Cumpleaños)', pagina: 21, id: 'mes-febrero' },
      ]
    },
    {
      titulo: 'Terapia Astrológica Creativa',
      pagina: 140,
      id: 'terapia-creativa',
      icono: <Heart className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'Escritura Terapéutica', pagina: 140, id: 'escritura-terapeutica' },
        { titulo: 'Visualización Guiada', pagina: 141, id: 'visualizacion' },
        { titulo: 'Ritual Simbólico', pagina: 142, id: 'ritual-simbolico' },
        { titulo: 'Trabajo Emocional', pagina: 143, id: 'trabajo-emocional' },
      ]
    },
    {
      titulo: 'Cierre del Ciclo',
      pagina: 145,
      id: 'cierre-ciclo',
      icono: <Sparkles className="w-4 h-4" />,
      subsecciones: [
        { titulo: 'El Viaje Completado', pagina: 145, id: 'quien-era-quien-soy' },
        { titulo: 'Preparación Próxima Vuelta', pagina: 146, id: 'preparacion-proxima' },
        { titulo: 'Carta de Cierre', pagina: 147, id: 'carta-cierre' },
        { titulo: 'Página Final', pagina: 148, id: 'pagina-final' },
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
