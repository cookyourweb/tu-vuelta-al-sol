// src/components/agenda/EventModal.tsx
'use client';

import React from 'react';
import type { AstrologicalEvent } from '@/types/astrology/unified-types';

interface EventModalProps {
  isOpen: boolean;
  event: AstrologicalEvent | null;
  onClose: () => void;
  crossedInterpretation: any | null;
  loadingCrossedInterpretation: boolean;
  getEventIcon: (type: string, priority?: string) => string;
}

export default function EventModal({
  isOpen,
  event,
  onClose,
  crossedInterpretation,
  loadingCrossedInterpretation,
  getEventIcon
}: EventModalProps) {
  if (!isOpen || !event) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
        onClick={onClose}
      />

      {/* Modal centrado */}
      <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
        <div className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-sm border border-purple-400/40 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header del modal */}
          <div className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{getEventIcon(event.type, event.priority)}</span>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">{event.title}</h2>
                  <p className="text-purple-200 text-sm">
                    {new Date(event.date).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  {event.planet && event.sign && (
                    <p className="text-purple-300 text-xs mt-1">
                      {event.planet} en {event.sign}
                    </p>
                  )}
                  {/* DURACIÓN del evento */}
                  {(event as any).duration && (
                    <div className="mt-2 inline-block bg-yellow-500/20 border border-yellow-400/30 rounded-lg px-3 py-1">
                      <p className="text-yellow-200 text-xs font-semibold">
                        ⏱️ Duración: {(event as any).duration}
                      </p>
                    </div>
                  )}
                  {/* TIPO DE TRÁNSITO */}
                  {(event as any).transitType && (
                    <div className="mt-2 inline-block bg-cyan-500/20 border border-cyan-400/30 rounded-lg px-3 py-1 ml-2">
                      <p className="text-cyan-200 text-xs font-semibold">
                        {(event as any).transitType === 'lento' && '🐢 Tránsito Lento (generacional)'}
                        {(event as any).transitType === 'mediano' && '🏃 Tránsito Mediano (anual)'}
                        {(event as any).transitType === 'rápido' && '⚡ Tránsito Rápido (mensual)'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Botón cerrar */}
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nivel de importancia */}
            {event.priority === 'high' && (
              <div className="mt-4 inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-full px-4 py-2">
                <span className="text-red-300 text-sm font-medium">🔥 PRIORIDAD CRÍTICA</span>
              </div>
            )}
          </div>

          {/* Contenido del modal con scroll */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {/* Descripción síntesis */}
            <div className="mb-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-l-4 border-yellow-400 rounded-lg p-4">
              <p className="text-white text-lg font-semibold leading-relaxed">{event.description}</p>
            </div>

            {/* ✨ INTERPRETACIÓN V3 CRUZADA (Nueva Metodología) */}
            {loadingCrossedInterpretation ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-purple-300 text-sm">Generando interpretación cruzada...</p>
                </div>
              </div>
            ) : crossedInterpretation ? (
              <div className="space-y-5">
                {/* ENERGÍA DOMINANTE DEL DÍA */}
                <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/30 rounded-2xl p-5">
                  <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center">
                    <span className="mr-2">🔥</span>
                    ENERGÍA DOMINANTE DEL DÍA
                  </h3>
                  <p className="text-white leading-relaxed">{crossedInterpretation.energia_dominante}</p>
                </div>

                {/* INTERPRETACIÓN CRUZADA - Preguntas por Planeta Activo */}
                {crossedInterpretation.interpretacion_cruzada && crossedInterpretation.interpretacion_cruzada.length > 0 && (
                  <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 rounded-2xl p-5">
                    <h3 className="text-lg font-bold text-indigo-300 mb-4 flex items-center">
                      <span className="mr-2">🪐</span>
                      INTERPRETACIÓN CRUZADA
                    </h3>
                    <div className="space-y-4">
                      {crossedInterpretation.interpretacion_cruzada.map((planetQ: any, idx: number) => (
                        <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-yellow-400 font-bold text-sm">{planetQ.planet}</span>
                            <span className="text-indigo-300 text-xs">({planetQ.context})</span>
                          </div>
                          <p className="text-white font-semibold italic">
                            {planetQ.question}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CÓMO VIVIR ESTE DÍA SIENDO TÚ */}
                <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 rounded-2xl p-5">
                  <h3 className="text-lg font-bold text-emerald-300 mb-3 flex items-center">
                    <span className="mr-2">🧭</span>
                    CÓMO VIVIR ESTE DÍA SIENDO TÚ
                  </h3>
                  <p className="text-white leading-relaxed">{crossedInterpretation.como_vivir_siendo_tu}</p>
                </div>

                {/* ACCIÓN CONSCIENTE RECOMENDADA */}
                {crossedInterpretation.accion_recomendada && crossedInterpretation.accion_recomendada.length > 0 && (
                  <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-2xl p-5">
                    <h3 className="text-lg font-bold text-cyan-300 mb-3 flex items-center">
                      <span className="mr-2">✨</span>
                      ACCIÓN CONSCIENTE RECOMENDADA
                    </h3>
                    <ul className="space-y-2">
                      {crossedInterpretation.accion_recomendada.map((action: string, idx: number) => (
                        <li key={idx} className="text-white leading-relaxed flex items-start">
                          <span className="text-cyan-400 mr-2">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* SOMBRA A EVITAR HOY */}
                {crossedInterpretation.sombra_a_evitar && crossedInterpretation.sombra_a_evitar.length > 0 && (
                  <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-2xl p-5">
                    <h3 className="text-lg font-bold text-orange-300 mb-3 flex items-center">
                      <span className="mr-2">⚠️</span>
                      SOMBRA A OBSERVAR HOY
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {crossedInterpretation.sombra_a_evitar.map((sombra: string, idx: number) => (
                        <span key={idx} className="bg-orange-500/20 border border-orange-400/30 rounded-full px-3 py-1 text-orange-200 text-sm">
                          {sombra}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* FRASE ANCLA DEL DÍA */}
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400/40 rounded-2xl p-6 text-center">
                  <h3 className="text-base font-bold text-purple-300 mb-3">🔑 FRASE ANCLA DEL DÍA</h3>
                  <p className="text-white text-xl font-bold italic leading-relaxed">
                    "{crossedInterpretation.frase_ancla}"
                  </p>
                </div>
              </div>
            ) : (
              /* Fallback: Interpretación antigua si no hay V3 */
              event.aiInterpretation && (
                <div className="space-y-5">
                  {/* ENERGÍA DOMINANTE DEL DÍA - Planeta líder */}
                  {event.aiInterpretation.meaning && (
                    <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/30 rounded-2xl p-5">
                      <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center">
                        <span className="mr-2">🧠</span>
                        ENERGÍA DOMINANTE DEL DÍA
                      </h3>
                      <p className="text-white leading-relaxed">{event.aiInterpretation.meaning}</p>
                    </div>
                  )}

                  {/* CÓMO VIVIR ESTE DÍA SIENDO TÚ */}
                  {event.aiInterpretation.advice && (
                    <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 rounded-2xl p-5">
                      <h3 className="text-lg font-bold text-emerald-300 mb-3 flex items-center">
                        <span className="mr-2">🧭</span>
                        CÓMO VIVIR ESTE DÍA SIENDO TÚ
                      </h3>
                      <p className="text-white leading-relaxed">{event.aiInterpretation.advice}</p>
                    </div>
                  )}

                  {/* FRASE ANCLA DEL DÍA */}
                  {event.aiInterpretation.mantra && (
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400/40 rounded-2xl p-6 text-center">
                      <h3 className="text-base font-bold text-purple-300 mb-3">🔑 FRASE ANCLA DEL DÍA</h3>
                      <p className="text-white text-xl font-bold italic leading-relaxed">
                        "{event.aiInterpretation.mantra}"
                      </p>
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          {/* Footer del modal */}
          <div className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 p-6 border-t border-white/20">
            <div className="flex items-center justify-between">
              <div className="text-purple-200 text-sm">
                <span className="font-medium">Tipo:</span> {event.type.replace('_', ' ').toUpperCase()}
              </div>
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-400 hover:to-pink-400 transition-all duration-200 shadow-lg"
              >
                Cerrar ✨
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
