// src/components/solar-return/SolarReturnPlanetDrawer.tsx

// =============================================================================
// 🔄 DRAWER DE COMPARACIONES PLANETARIAS (Natal vs Solar Return)
// =============================================================================
// Muestra la comparación personalizada entre carta natal y retorno solar
// siguiendo la arquitectura de 3 capas
// =============================================================================

'use client';

import React, { useEffect } from 'react';
import type { ComparacionPlanetaria } from '@/types/astrology/interpretation';

// =============================================================================
// 📚 INTERFACES
// =============================================================================

interface SolarReturnPlanetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  planetName: string;
  comparacion: ComparacionPlanetaria | null;
}

// =============================================================================
// 🎨 COMPONENTE PRINCIPAL
// =============================================================================

export const SolarReturnPlanetDrawer: React.FC<SolarReturnPlanetDrawerProps> = ({
  isOpen,
  onClose,
  planetName,
  comparacion
}) => {

  console.log('=== SR PLANET DRAWER RENDER ===');
  console.log('isOpen:', isOpen);
  console.log('planetName:', planetName);
  console.log('comparacion:', comparacion);

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
  if (!isOpen || !comparacion) return null;

  // =========================================================================
  // 🎨 ICONOS POR PLANETA
  // =========================================================================
  const planetIcons: Record<string, string> = {
    sol: '☀️',
    luna: '🌙',
    mercurio: '🗣️',
    venus: '💚',
    marte: '⚔️',
    jupiter: '🎯',
    saturno: '🏔️'
  };

  const planetIcon = planetIcons[planetName.toLowerCase()] || '⭐';
  const planetTitle = planetName.charAt(0).toUpperCase() + planetName.slice(1);

  // =========================================================================
  // 🎨 RENDERIZADO
  // =========================================================================
  return (
    <div className="fixed inset-0 z-[999999]">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Drawer - animación desde la derecha */}
      <div className="absolute right-0 top-0 h-full w-full md:w-[50%] lg:w-[45%] bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 shadow-2xl overflow-y-auto animate-slide-in-right">

        {/* Header fijo */}
        <div className="sticky top-0 bg-purple-900/95 backdrop-blur-md p-4 md:p-6 border-b border-purple-700/50 flex justify-between items-center z-10 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{planetIcon}</span>
            <h2 className="text-xl md:text-2xl font-bold text-white">{planetTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-purple-300 text-2xl transition-colors flex-shrink-0 ml-4"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 md:p-6 space-y-6">

          {/* FRASE CLAVE DEL AÑO - Destacada al inicio */}
          <section className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-4 md:p-5 shadow-xl">
            <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-black/80 uppercase tracking-wide">
              <span>⚡</span> FRASE CLAVE DEL AÑO
            </h3>
            <blockquote className="text-lg md:text-xl font-bold italic text-white leading-tight">
              "{comparacion.frase_clave}"
            </blockquote>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

          {/* 1️⃣ CÓMO ERES NORMALMENTE (Natal) */}
          <section>
            <h3 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2 text-purple-200">
              <span className="text-2xl">🔹</span> CÓMO ERES NORMALMENTE
            </h3>
            <div className="bg-purple-800/20 rounded-lg p-4 border border-purple-700/30">
              <p className="text-sm font-mono text-purple-300 mb-2">{comparacion.natal.posicion}</p>
              <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                {comparacion.natal.descripcion}
              </p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

          {/* 2️⃣ QUÉ SE ACTIVA ESTE AÑO (Solar Return) */}
          <section>
            <h3 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2 text-orange-200">
              <span className="text-2xl">🔸</span> QUÉ SE ACTIVA ESTE AÑO
            </h3>
            <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-700/30">
              <p className="text-sm font-mono text-orange-300 mb-2">{comparacion.solar_return.posicion}</p>
              <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                {comparacion.solar_return.descripcion}
              </p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

          {/* 3️⃣ DÓNDE CHOCA O POTENCIA */}
          <section>
            <h3 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2 text-yellow-200">
              <span className="text-2xl">🔁</span> DÓNDE CHOCA O POTENCIA
            </h3>
            <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-700/30">
              <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                {comparacion.choque}
              </p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

          {/* 4️⃣ QUÉ HACER (Acción Concreta) */}
          <section>
            <h3 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2 text-green-200">
              <span className="text-2xl">✅</span> QUÉ CONVIENE HACER AHORA
            </h3>
            <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/30">
              <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                {comparacion.que_hacer}
              </p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

          {/* ERROR AUTOMÁTICO */}
          <section className="bg-red-900/20 rounded-lg p-4 border border-red-700/50">
            <h3 className="text-base font-bold mb-2 flex items-center gap-2 text-red-200">
              <span className="text-xl">⚠️</span> ERROR AUTOMÁTICO DEL AÑO
            </h3>
            <p className="text-sm md:text-base text-red-100 italic">
              {comparacion.error_automatico}
            </p>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

          {/* 5️⃣ CÓMO USAR EN AGENDA (Layer 3) */}
          <section>
            <h3 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2 text-white">
              <span className="text-2xl">📅</span> CÓMO USAR EN TU AGENDA
            </h3>

            {/* Luna Nueva */}
            <div className="mb-4 bg-indigo-900/30 rounded-lg p-4 border border-indigo-700/30">
              <h4 className="font-bold text-base mb-2 text-indigo-200 flex items-center gap-2">
                <span>🌑</span> Luna Nueva (Inicio de ciclos)
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                {comparacion.uso_agenda.luna_nueva}
              </p>
            </div>

            {/* Luna Llena */}
            <div className="mb-4 bg-indigo-900/30 rounded-lg p-4 border border-indigo-700/30">
              <h4 className="font-bold text-base mb-2 text-indigo-200 flex items-center gap-2">
                <span>🌕</span> Luna Llena (Revisión y liberación)
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                {comparacion.uso_agenda.luna_llena}
              </p>
            </div>

            {/* Retrogradaciones */}
            <div className="bg-indigo-900/30 rounded-lg p-4 border border-indigo-700/30">
              <h4 className="font-bold text-base mb-2 text-indigo-200 flex items-center gap-2">
                <span>↩️</span> Retrogradaciones
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                {comparacion.uso_agenda.retrogradaciones}
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
