//src/components/astrology/InterpretationDrawer.tsx

// =============================================================================
// 🎨 DRAWER DE INTERPRETACIONES TRIPLE FUSIONADO
// InterpretationDrawer.tsx
// =============================================================================
// Componente que muestra la interpretación completa de planetas/aspectos
// con lenguaje educativo + poderoso + poético
// =============================================================================

'use client';

import React, { useEffect } from 'react';

// =============================================================================
// 📚 INTERFACES
// =============================================================================

interface DrawerContent {
  titulo: string;
  educativo: string;
  poderoso: string;
  poetico: string;
  sombras: {
    nombre: string;
    descripcion: string;
    trampa: string;
    regalo: string;
  }[];
  sintesis: {
    frase: string;
    declaracion: string;
  };
  // ✅ NEW: Metadatos técnicos del aspecto/planeta
  metadata?: {
    type: 'planet' | 'aspect' | 'angle';
    name?: string;           // Para planetas: "Sol", para aspectos: "Oposición"
    planet1?: string;        // Para aspectos
    planet2?: string;        // Para aspectos
    sign?: string;           // Para planetas/ángulos
    house?: number;          // Para planetas
    degree?: number;         // Grado exacto
    aspectType?: string;     // Para aspectos: "opposition", "trine", etc.
    angle?: number;          // Para aspectos: ángulo en grados
    orb?: number;            // Orbe del aspecto
    isExact?: boolean;       // Si el aspecto es exacto (orbe < 1°)
  };
}

interface InterpretationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  content: DrawerContent | null;
  chartType?: 'natal' | 'progressed' | 'solar-return';  // ✅ NEW
}

// =============================================================================
// 🎨 COMPONENTE PRINCIPAL
// =============================================================================

export const InterpretationDrawer: React.FC<InterpretationDrawerProps> = ({
  isOpen,
  onClose,
  content,
  chartType = 'natal'  // ✅ DEFAULT: natal
}) => {

  console.log('=== DRAWER COMPONENT RENDER ===');
  console.log('isOpen:', isOpen);
  console.log('content:', content);
  console.log('chartType:', chartType);
  console.log('content?.titulo:', content?.titulo);
  console.log('¿Debería renderizarse el drawer?', isOpen && content);

  // ✅ CONFIGURACIÓN DE ESTILOS SEGÚN TIPO DE CARTA
  const chartConfig = {
    'natal': {
      badge: '🌟 Carta Natal',
      badgeBg: 'bg-purple-600',
      headerGradient: 'from-purple-900 via-indigo-900 to-purple-900',
      headerBg: 'bg-purple-900/90',
      headerBorder: 'border-purple-700/50',
      dividerColor: 'via-purple-500',
      description: 'Tu estructura base'
    },
    'solar-return': {
      badge: '☀️ Retorno Solar',
      badgeBg: 'bg-orange-600',
      headerGradient: 'from-orange-900 via-yellow-900 to-orange-900',
      headerBg: 'bg-orange-900/90',
      headerBorder: 'border-orange-700/50',
      dividerColor: 'via-orange-500',
      description: 'Clima del año'
    },
    'progressed': {
      badge: '🌙 Carta Progresada',
      badgeBg: 'bg-blue-600',
      headerGradient: 'from-blue-900 via-indigo-900 to-blue-900',
      headerBg: 'bg-blue-900/90',
      headerBorder: 'border-blue-700/50',
      dividerColor: 'via-blue-500',
      description: 'Tu evolución'
    }
  };

  const config = chartConfig[chartType];

  // ✅ Helper para describir el significado de cada casa
  const getHouseDescription = (house: number): string => {
    const descriptions: Record<number, string> = {
      1: 'Identidad y autopercepción',
      2: 'Recursos y valores personales',
      3: 'Comunicación y entorno cercano',
      4: 'Hogar y raíces emocionales',
      5: 'Creatividad y expresión personal',
      6: 'Trabajo y salud cotidiana',
      7: 'Relaciones y asociaciones',
      8: 'Transformación y recursos compartidos',
      9: 'Filosofía y expansión',
      10: 'Carrera y reconocimiento público',
      11: 'Comunidad y visión futura',
      12: 'Espiritualidad y lo inconsciente'
    };
    return descriptions[house] || 'Área de vida';
  };

  // =========================================================================
  // ⌨️ CERRAR CON TECLA ESC
  // =========================================================================
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Bloquear scroll del body cuando drawer está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // =========================================================================
  // 🚫 NO RENDERIZAR SI NO ESTÁ ABIERTO
  // =========================================================================
  if (!isOpen || !content) return null;

  // =========================================================================
  // 🎨 RENDERIZADO
  // =========================================================================
  return (
    <div className="fixed inset-0 z-[999999]">
      {/* Overlay más transparente - SIN BLUR */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Drawer - animación desde la derecha */}
      <div className={`absolute right-0 top-0 h-full w-full md:w-[45%] lg:w-[40%] bg-gradient-to-br ${config.headerGradient} shadow-2xl overflow-y-auto animate-slide-in-right`}>

        {/* Header fijo con efecto glassmorphism - MEJORADO */}
        <div className={`sticky top-0 ${config.headerBg} backdrop-blur-md border-b ${config.headerBorder} z-10 shadow-lg`}>

          {/* Badge del tipo de carta */}
          <div className="px-4 md:px-6 pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className={`${config.badgeBg} text-white text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1`}>
                {config.badge}
              </span>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-300 text-2xl transition-colors flex-shrink-0"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Información técnica del aspecto/planeta */}
          {content.metadata && (
            <div className="px-4 md:px-6 pb-2">
              {/* ASPECTO */}
              {content.metadata.type === 'aspect' && (
                <div className="space-y-1">
                  <div className="text-sm text-gray-300 uppercase tracking-wide font-semibold">
                    {content.metadata.name || content.metadata.aspectType}
                  </div>
                  <div className="text-lg md:text-xl text-white font-bold">
                    {content.metadata.planet1} ↔ {content.metadata.planet2}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    <span>Ángulo: {content.metadata.angle}°</span>
                    <span>•</span>
                    <span>Orbe: {content.metadata.orb?.toFixed(2)}° {content.metadata.isExact && '⭐ EXACTO'}</span>
                  </div>
                </div>
              )}

              {/* PLANETA */}
              {content.metadata.type === 'planet' && (
                <div className="space-y-2">
                  <div className="text-lg md:text-xl text-white font-bold">
                    {content.metadata.name} en {content.metadata.sign} {content.metadata.degree?.toFixed(2)}°
                    {content.metadata.house && ` en Casa ${content.metadata.house}`}
                  </div>
                  {content.metadata.house && (
                    <div className="text-sm text-gray-400 italic">
                      Casa {content.metadata.house}: {getHouseDescription(content.metadata.house)}
                    </div>
                  )}
                </div>
              )}

              {/* ÁNGULO (ASC/MC) */}
              {content.metadata.type === 'angle' && (
                <div className="space-y-2">
                  <div className="text-lg md:text-xl text-white font-bold">
                    {content.metadata.name} en {content.metadata.sign} {content.metadata.degree?.toFixed(2)}°
                  </div>
                  <div className="text-sm text-gray-400 italic">
                    {content.metadata.name === 'Ascendente' && 'Tu manera de presentarte al mundo'}
                    {content.metadata.name === 'Medio Cielo' && 'Tu vocación y propósito público'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Título de la interpretación */}
          <div className={`px-4 md:px-6 py-3 border-t ${config.headerBorder} bg-black/20`}>
            <h2 className="text-base md:text-lg font-bold text-white leading-tight">
              {content.titulo}
            </h2>
          </div>

        </div>

        {/* Contenido seguido (sin tabs) */}
        <div className="p-4 md:p-6 space-y-8">

          {/* SECCIÓN EDUCATIVA */}
          <section>
            <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <span className="text-2xl">📚</span> QUÉ SIGNIFICA
            </h3>
            <div className="prose prose-invert max-w-none">
              {content.educativo.split('\n\n').map((parrafo: string, i: number) => {
                const cleanParrafo = parrafo.trim();
                if (!cleanParrafo) return null;

                return (
                  <p
                    key={i}
                    className="mb-4 text-sm md:text-base text-gray-200 leading-relaxed"
                  >
                    {cleanParrafo}
                  </p>
                );
              })}
            </div>
          </section>

          <div className={`h-px bg-gradient-to-r from-transparent ${config.dividerColor} to-transparent`} />

          {/* SECCIÓN PODEROSA */}
          <section>
            <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <span className="text-2xl">🔥</span> CÓMO USARLO COMO SUPERPODER
            </h3>
            <div className="prose prose-invert max-w-none">
              {content.poderoso.split('\n\n').map((parrafo: string, i: number) => {
                const cleanParrafo = parrafo.trim();
                if (!cleanParrafo) return null;

                return (
                  <p
                    key={i}
                    className="mb-4 text-sm md:text-base text-gray-200 leading-relaxed"
                  >
                    {cleanParrafo}
                  </p>
                );
              })}
            </div>
          </section>

          <div className={`h-px bg-gradient-to-r from-transparent ${config.dividerColor} to-transparent`} />

          {/* SECCIÓN POÉTICA */}
          <section>
            <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <span className="text-2xl">🌙</span> LA METÁFORA
            </h3>
            <div className="prose prose-invert max-w-none">
              {content.poetico.split('\n\n').map((parrafo: string, i: number) => {
                const cleanParrafo = parrafo.trim();
                if (!cleanParrafo) return null;

                return (
                  <p
                    key={i}
                    className="mb-4 text-sm md:text-base text-gray-200 leading-relaxed italic"
                  >
                    {cleanParrafo}
                  </p>
                );
              })}
            </div>
          </section>

          <div className={`h-px bg-gradient-to-r from-transparent ${config.dividerColor} to-transparent`} />

          {/* SOMBRAS */}
          {content.sombras && content.sombras.length > 0 && (
            <section>
              <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <span className="text-2xl">⚠️</span> SOMBRAS A TRABAJAR
              </h3>
              <div className="space-y-4">
                {content.sombras.map((sombra, i) => (
                  <div
                    key={i}
                    className="bg-purple-800/30 rounded-lg p-4 border border-purple-700/50 hover:border-purple-600 hover:bg-purple-800/40 transition-all duration-200"
                  >
                    <h4 className="font-bold text-base md:text-lg mb-2 text-purple-200">
                      {sombra.nombre}
                    </h4>
                    <p className="text-gray-300 mb-3 text-sm md:text-base">
                      {sombra.descripcion}
                    </p>
                    <div className="space-y-1 text-sm">
                      <p className="text-red-300">{sombra.trampa}</p>
                      <p className="text-green-300">{sombra.regalo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className={`h-px bg-gradient-to-r from-transparent ${config.dividerColor} to-transparent`} />

          {/* SÍNTESIS */}
          <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 md:p-6 shadow-xl">
            <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <span className="text-2xl">✨</span> SÍNTESIS
            </h3>
            <blockquote className="text-xl md:text-2xl font-bold mb-4 italic text-white leading-tight">
              "{content.sintesis.frase}"
            </blockquote>
            <div className="h-px bg-white/30 my-4" />
            <p className="text-base md:text-lg leading-relaxed text-white/95 font-medium whitespace-pre-wrap">
              {content.sintesis.declaracion}
            </p>
          </section>

          {/* Espacio al final para scroll cómodo */}
          <div className="h-16" />

        </div>
      </div>

      {/* Estilos de animaciones mejorados */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

// =============================================================================
// 🎨 ESTILOS CSS ADICIONALES (agregar a globals.css si es necesario)
// =============================================================================

/*
@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
*/