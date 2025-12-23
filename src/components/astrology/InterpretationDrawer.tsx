//src/components/astrology/InterpretationDrawer.tsx

// =============================================================================
// 🎨 DRAWER DE INTERPRETACIONES - FORMATO EDUCATIVO
// InterpretationDrawer.tsx
// =============================================================================
// Componente que muestra la interpretación completa de planetas/aspectos
// con formato educativo claro y pedagógico
// =============================================================================

'use client';

import React, { useEffect } from 'react';

// =============================================================================
// 📚 INTERFACES
// =============================================================================

// Nuevo formato educativo
interface DrawerContentEducativo {
  titulo: string;
  subtitulo: string;
  explicacion_casa: string;
  parrafos: string[];
  cierre: {
    activacion: string;
    don_mayor: string;
  };
}

// Formato antiguo (triple fusionado) - mantenido para compatibilidad
interface DrawerContentLegacy {
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
}

type DrawerContent = DrawerContentEducativo | DrawerContentLegacy;

interface InterpretationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  content: DrawerContent | null;
}

// =============================================================================
// 🎨 COMPONENTE PRINCIPAL
// =============================================================================

export const InterpretationDrawer: React.FC<InterpretationDrawerProps> = ({
  isOpen,
  onClose,
  content
}) => {

  console.log('=== DRAWER COMPONENT RENDER ===');
  console.log('isOpen:', isOpen);
  console.log('content:', content);
  console.log('content?.titulo:', content?.titulo);
  console.log('¿Debería renderizarse el drawer?', isOpen && content);

  // =========================================================================
  // 🔍 DETECTAR FORMATO DEL CONTENIDO
  // =========================================================================
  const isEducativoFormat = (c: DrawerContent): c is DrawerContentEducativo => {
    return 'parrafos' in c && Array.isArray((c as any).parrafos);
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

  const useEducativoFormat = isEducativoFormat(content);

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
      <div className="absolute right-0 top-0 h-full w-full md:w-[45%] lg:w-[40%] bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 shadow-2xl overflow-y-auto animate-slide-in-right">
        {/* Header fijo con efecto glassmorphism */}
        <div className="sticky top-0 bg-purple-900/90 backdrop-blur-md p-4 md:p-6 border-b border-purple-700/50 flex justify-between items-center z-10 shadow-lg">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-white">{content.titulo}</h2>
            {useEducativoFormat && (content as DrawerContentEducativo).subtitulo && (
              <p className="text-lg text-purple-200 mt-1">{(content as DrawerContentEducativo).subtitulo}</p>
            )}
          </div>
          <button
            onClick={() => {
              onClose();
              // Reset tooltip when drawer closes - handled by page-level state
            }}
            className="text-white hover:text-purple-300 text-2xl transition-colors flex-shrink-0 ml-4"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Contenido - FORMATO CONDICIONAL */}
        <div className="p-4 md:p-6 space-y-6">

          {useEducativoFormat ? (
            // ═══════════════════════════════════════════════════════════
            // FORMATO EDUCATIVO NUEVO
            // ═══════════════════════════════════════════════════════════
            <>
              {/* Explicación de casa */}
              {(content as DrawerContentEducativo).explicacion_casa && (
                <div className="text-sm md:text-base text-purple-200 italic mb-4">
                  {(content as DrawerContentEducativo).explicacion_casa}
                </div>
              )}

              {/* Párrafos educativos */}
              <div className="space-y-4">
                {(content as DrawerContentEducativo).parrafos.map((parrafo: string, i: number) => (
                  <p
                    key={i}
                    className="text-sm md:text-base text-gray-200 leading-relaxed"
                  >
                    {parrafo}
                  </p>
                ))}
              </div>

              {/* Cierre */}
              <div className="mt-8 bg-purple-800/30 rounded-lg p-4 md:p-6 border border-purple-700/50">
                <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                  <span className="text-2xl">✨</span> EN RESUMEN
                </h3>
                <div className="space-y-3">
                  <p className="text-sm md:text-base text-gray-200">
                    <strong className="text-purple-200">Te activas cuando:</strong>{' '}
                    {(content as DrawerContentEducativo).cierre.activacion}
                  </p>
                  <p className="text-sm md:text-base text-gray-200">
                    <strong className="text-purple-200">Tu don mayor:</strong>{' '}
                    {(content as DrawerContentEducativo).cierre.don_mayor}
                  </p>
                </div>
              </div>
            </>
          ) : (
            // ═══════════════════════════════════════════════════════════
            // FORMATO LEGACY (Triple Fusionado)
            // ═══════════════════════════════════════════════════════════
            <>

              {/* SECCIÓN EDUCATIVA */}
              <section>
                <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-white">
                  <span className="text-2xl">📚</span> QUÉ SIGNIFICA
                </h3>
                <div className="prose prose-invert max-w-none">
                  {(content as DrawerContentLegacy).educativo.split('\n\n').map((parrafo: string, i: number) => {
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

              <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

              {/* SECCIÓN PODEROSA */}
              <section>
                <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-white">
                  <span className="text-2xl">🔥</span> CÓMO USARLO COMO SUPERPODER
                </h3>
                <div className="prose prose-invert max-w-none">
                  {(content as DrawerContentLegacy).poderoso.split('\n\n').map((parrafo: string, i: number) => {
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

              <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

              {/* SECCIÓN POÉTICA */}
              <section>
                <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-white">
                  <span className="text-2xl">🌙</span> LA METÁFORA
                </h3>
                <div className="prose prose-invert max-w-none">
                  {(content as DrawerContentLegacy).poetico.split('\n\n').map((parrafo: string, i: number) => {
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

              <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

              {/* SOMBRAS */}
              {(content as DrawerContentLegacy).sombras && (content as DrawerContentLegacy).sombras.length > 0 && (
                <section>
                  <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-white">
                    <span className="text-2xl">⚠️</span> SOMBRAS A TRABAJAR
                  </h3>
                  <div className="space-y-4">
                    {(content as DrawerContentLegacy).sombras.map((sombra, i) => (
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

              <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

              {/* SÍNTESIS */}
              <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 md:p-6 shadow-xl">
                <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-white">
                  <span className="text-2xl">✨</span> SÍNTESIS
                </h3>
                <blockquote className="text-xl md:text-2xl font-bold mb-4 italic text-white leading-tight">
                  "{(content as DrawerContentLegacy).sintesis.frase}"
                </blockquote>
                <div className="h-px bg-white/30 my-4" />
                <p className="text-base md:text-lg leading-relaxed text-white/95 font-medium whitespace-pre-wrap">
                  {(content as DrawerContentLegacy).sintesis.declaracion}
                </p>
              </section>
            </>
          )}

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