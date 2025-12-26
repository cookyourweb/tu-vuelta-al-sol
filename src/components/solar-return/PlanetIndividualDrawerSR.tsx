// =============================================================================
// 🪐 DRAWER DE INTERPRETACIÓN INDIVIDUAL - SOLAR RETURN
// =============================================================================
// Drawer con 8 secciones profesionales para interpretación individual de planetas
// en contexto de Retorno Solar (DIFERENTE del drawer de Carta Natal)
// =============================================================================

'use client';

import React, { useEffect } from 'react';
import type { PlanetIndividualSRInterpretation } from '@/types/astrology/interpretation';

// =============================================================================
// 📚 INTERFACES
// =============================================================================

interface PlanetIndividualDrawerSRProps {
  isOpen: boolean;
  onClose: () => void;
  planetName: string;
  interpretation: PlanetIndividualSRInterpretation | null;
  isLoading?: boolean;
}

// =============================================================================
// 🎨 COMPONENTE PRINCIPAL
// =============================================================================

export const PlanetIndividualDrawerSR: React.FC<PlanetIndividualDrawerSRProps> = ({
  isOpen,
  onClose,
  planetName,
  interpretation,
  isLoading
}) => {

  console.log('=== PLANET INDIVIDUAL SR DRAWER RENDER ===');
  console.log('isOpen:', isOpen);
  console.log('planetName:', planetName);
  console.log('interpretation:', interpretation);
  console.log('isLoading:', isLoading);

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
  if (!isOpen) return null;

  // =========================================================================
  // ⏳ ESTADO DE CARGA
  // =========================================================================
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[999999]">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={onClose}
        />

        {/* Drawer */}
        <div className="absolute right-0 top-0 h-full w-full md:w-[50%] lg:w-[45%] bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 shadow-2xl overflow-y-auto animate-slide-in-right">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-spin">⏳</div>
              <p className="text-white text-xl font-semibold">Generando interpretación...</p>
              <p className="text-purple-300 text-sm mt-2">Esto puede tomar unos segundos</p>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .animate-slide-in-right {
            animation: slideInRight 0.4s ease-out;
          }
        `}</style>
      </div>
    );
  }

  // =========================================================================
  // ❌ SIN INTERPRETACIÓN
  // =========================================================================
  if (!interpretation) {
    return (
      <div className="fixed inset-0 z-[999999]">
        <div
          className="absolute inset-0 bg-black/40"
          onClick={onClose}
        />
        <div className="absolute right-0 top-0 h-full w-full md:w-[50%] lg:w-[45%] bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 shadow-2xl overflow-y-auto">
          <div className="sticky top-0 bg-purple-900/95 backdrop-blur-md p-4 md:p-6 border-b border-purple-700/50 flex justify-between items-center z-10 shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold text-white">Error</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-300 text-2xl transition-colors"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
          <div className="p-6 text-center">
            <p className="text-red-300">No se pudo cargar la interpretación</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { tooltip, drawer } = interpretation;
  const planetTitle = planetName.charAt(0).toUpperCase() + planetName.slice(1);

  // =========================================================================
  // ✅ RENDERIZADO COMPLETO CON 8 SECCIONES
  // =========================================================================
  return (
    <div className="fixed inset-0 z-[999999]">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Drawer - animación desde la derecha */}
      <div className="absolute right-0 top-0 h-full w-full md:w-[55%] lg:w-[50%] bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-900 shadow-2xl overflow-y-auto animate-slide-in-right">

        {/* Header fijo */}
        <div className="sticky top-0 bg-indigo-900/95 backdrop-blur-md p-4 md:p-6 border-b border-indigo-700/50 flex justify-between items-center z-10 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{tooltip.simbolo}</span>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">{planetTitle}</h2>
              <p className="text-sm text-indigo-200">{tooltip.titulo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-indigo-300 text-2xl transition-colors flex-shrink-0 ml-4"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Contenido del drawer */}
        <div className="p-4 md:p-6 space-y-6">

          {/* SECCIÓN 1: 🧬 QUIÉN ERES (Base Natal) */}
          <section>
            <h3 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2 text-blue-200">
              {drawer.quien_eres.titulo}
            </h3>
            <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700/30">
              <p className="text-sm font-mono text-blue-300 mb-2">{drawer.quien_eres.posicion_natal}</p>
              <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                {drawer.quien_eres.descripcion}
              </p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

          {/* SECCIÓN 2: ⚡ QUÉ SE ACTIVA ESTE AÑO */}
          <section>
            <h3 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2 text-orange-200">
              {drawer.que_se_activa.titulo}
            </h3>
            <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-700/30">
              <p className="text-sm font-mono text-orange-300 mb-2">{drawer.que_se_activa.posicion_sr}</p>
              <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                {drawer.que_se_activa.descripcion}
              </p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

          {/* SECCIÓN 3: 🔄 EL CRUCE CLAVE (Natal + Año) */}
          <section>
            <h3 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2 text-yellow-200">
              {drawer.cruce_clave.titulo}
            </h3>
            <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-700/30">
              <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                {drawer.cruce_clave.descripcion}
              </p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

          {/* SECCIÓN 4: 🎯 IMPACTO REAL EN TU VIDA (concreto, NO metáforas) */}
          <section>
            <h3 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2 text-green-200">
              {drawer.impacto_real.titulo}
            </h3>
            <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/30">
              <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                {drawer.impacto_real.descripcion}
              </p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

          {/* SECCIÓN 5: 💡 CÓMO USAR ESTA ENERGÍA A TU FAVOR */}
          <section>
            <h3 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2 text-cyan-200">
              {drawer.como_usar.titulo}
            </h3>
            <div className="space-y-3">
              <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-700/30">
                <p className="text-sm font-semibold text-cyan-300 mb-2">Acción concreta:</p>
                <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                  {drawer.como_usar.accion_concreta}
                </p>
              </div>
              <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-700/30">
                <p className="text-sm font-semibold text-cyan-300 mb-2">Ejemplo práctico:</p>
                <p className="text-sm md:text-base text-gray-200 leading-relaxed italic">
                  {drawer.como_usar.ejemplo_practico}
                </p>
              </div>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

          {/* SECCIÓN 6: ⚠️ SOMBRAS A TRABAJAR */}
          <section>
            <h3 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2 text-red-200">
              {drawer.sombras.titulo}
            </h3>
            <div className="space-y-3">
              <div className="bg-red-900/20 rounded-lg p-4 border border-red-700/30">
                <p className="text-sm font-semibold text-red-300 mb-2">Trampa automática:</p>
                <p className="text-sm md:text-base text-red-100 leading-relaxed">
                  {drawer.sombras.trampa_automatica}
                </p>
              </div>
              <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/30">
                <p className="text-sm font-semibold text-green-300 mb-2">Antídoto:</p>
                <p className="text-sm md:text-base text-green-100 leading-relaxed">
                  {drawer.sombras.antidoto}
                </p>
              </div>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

          {/* SECCIÓN 7: 📌 SÍNTESIS */}
          <section className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-4 md:p-5 shadow-xl">
            <h3 className="text-base font-bold mb-3 flex items-center gap-2 text-white uppercase tracking-wide">
              {drawer.sintesis.titulo}
            </h3>
            <blockquote className="text-base md:text-lg font-semibold text-white leading-tight">
              {drawer.sintesis.frase_resumen}
            </blockquote>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

          {/* SECCIÓN 8: 📅 CÓMO ESTO ENCAJA EN TU AGENDA */}
          <section>
            <h3 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2 text-white">
              {drawer.encaja_agenda.titulo}
            </h3>

            {/* Luna Nueva */}
            <div className="mb-4 bg-indigo-900/30 rounded-lg p-4 border border-indigo-700/30">
              <h4 className="font-bold text-base mb-2 text-indigo-200 flex items-center gap-2">
                <span>🌑</span> Luna Nueva (Inicio de ciclos)
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                {drawer.encaja_agenda.luna_nueva}
              </p>
            </div>

            {/* Luna Llena */}
            <div className="mb-4 bg-indigo-900/30 rounded-lg p-4 border border-indigo-700/30">
              <h4 className="font-bold text-base mb-2 text-indigo-200 flex items-center gap-2">
                <span>🌕</span> Luna Llena (Revisión y liberación)
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                {drawer.encaja_agenda.luna_llena}
              </p>
            </div>

            {/* Retrogradaciones */}
            <div className="bg-indigo-900/30 rounded-lg p-4 border border-indigo-700/30">
              <h4 className="font-bold text-base mb-2 text-indigo-200 flex items-center gap-2">
                <span>↩️</span> Retrogradaciones
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                {drawer.encaja_agenda.retrogradaciones}
              </p>
            </div>
          </section>

          {/* Espacio al final para scroll cómodo */}
          <div className="h-16" />

        </div>
      </div>

      {/* Estilos de animaciones */}
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
          animation: slideInRight 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};
