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
      <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 overflow-y-auto">
        <div className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-sm border border-purple-400/40 rounded-3xl shadow-2xl max-w-4xl w-full my-8">
          {/* Header del modal */}
          <div className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 p-6 border-b border-white/20 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
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
                </div>
              </div>

              {/* Botón cerrar */}
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 ml-4 flex-shrink-0"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Clima del día y energías activas */}
            {crossedInterpretation && (
              <div className="mt-4 space-y-2">
                {/* Clima del día */}
                {crossedInterpretation.clima_del_dia && crossedInterpretation.clima_del_dia.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-purple-200">
                    <span className="font-semibold">Clima del día:</span>
                    <span>{crossedInterpretation.clima_del_dia.join(' · ')}</span>
                  </div>
                )}

                {/* Energías activas */}
                {crossedInterpretation.energias_activas && crossedInterpretation.energias_activas.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-purple-200">
                    <span className="font-semibold">Energías activas este año:</span>
                    <span>{crossedInterpretation.energias_activas.join(' · ')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Nivel de importancia */}
            {event.priority === 'high' && (
              <div className="mt-4 inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-full px-4 py-2">
                <span className="text-red-300 text-sm font-medium">🔥 PRIORIDAD CRÍTICA</span>
              </div>
            )}
          </div>

          {/* Contenido del modal con scroll */}
          <div className="p-6 space-y-6">
            {loadingCrossedInterpretation ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-purple-300 text-sm">Generando interpretación cruzada...</p>
                </div>
              </div>
            ) : crossedInterpretation ? (
              <div className="space-y-6">
                {/* MENSAJE SÍNTESIS */}
                {crossedInterpretation.mensaje_sintesis && (
                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-l-4 border-yellow-400 rounded-lg p-4">
                    <p className="text-white text-lg font-semibold leading-relaxed">
                      {crossedInterpretation.mensaje_sintesis}
                    </p>
                  </div>
                )}

                {/* 🧠 CÓMO TE AFECTA A TI */}
                {crossedInterpretation.como_te_afecta && (
                  <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/30 rounded-2xl p-5">
                    <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center">
                      <span className="mr-2">🧠</span>
                      ¿CÓMO TE AFECTA A TI?
                    </h3>
                    <div className="text-white leading-relaxed whitespace-pre-wrap">
                      {crossedInterpretation.como_te_afecta}
                    </div>
                  </div>
                )}

                {/* ⚙️ INTERPRETACIÓN PRÁCTICA DEL MOMENTO */}
                {crossedInterpretation.interpretacion_practica && crossedInterpretation.interpretacion_practica.length > 0 && (
                  <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 rounded-2xl p-5">
                    <h3 className="text-lg font-bold text-indigo-300 mb-4 flex items-center">
                      <span className="mr-2">⚙️</span>
                      INTERPRETACIÓN PRÁCTICA DEL MOMENTO
                    </h3>
                    <div className="space-y-3">
                      {crossedInterpretation.interpretacion_practica.map((ctx: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-3">
                          <span className="text-yellow-400 font-bold text-sm flex-shrink-0">{ctx.planet}:</span>
                          <p className="text-white leading-relaxed">{ctx.interpretation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ✍️ ACCIÓN CONCRETA PARA HOY */}
                {crossedInterpretation.accion_concreta && crossedInterpretation.accion_concreta.steps && crossedInterpretation.accion_concreta.steps.length > 0 && (
                  <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 rounded-2xl p-5">
                    <h3 className="text-lg font-bold text-emerald-300 mb-3 flex items-center">
                      <span className="mr-2">✍️</span>
                      ACCIÓN CONCRETA PARA HOY
                    </h3>
                    {crossedInterpretation.accion_concreta.title && (
                      <p className="text-white font-semibold mb-3">{crossedInterpretation.accion_concreta.title}</p>
                    )}
                    <div className="space-y-2">
                      {crossedInterpretation.accion_concreta.steps.map((step: string, idx: number) => (
                        <p key={idx} className="text-white leading-relaxed pl-4 border-l-2 border-emerald-400/50">
                          {step}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* ⚠️ SOMBRA A EVITAR HOY */}
                {crossedInterpretation.sombra_a_evitar && crossedInterpretation.sombra_a_evitar.length > 0 && (
                  <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-2xl p-5">
                    <h3 className="text-lg font-bold text-orange-300 mb-3 flex items-center">
                      <span className="mr-2">⚠️</span>
                      SOMBRA A EVITAR HOY
                    </h3>
                    <ul className="space-y-2">
                      {crossedInterpretation.sombra_a_evitar.map((item: any, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-orange-400 mr-2">•</span>
                          <div className="text-white">
                            <span className="font-medium">{typeof item === 'string' ? item : item.shadow}</span>
                            {typeof item === 'object' && item.explanation && (
                              <div className="text-orange-200 text-sm mt-1">{item.explanation}</div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 🌟 FRASE ANCLA DEL DÍA */}
                {crossedInterpretation.frase_ancla && (
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400/40 rounded-2xl p-6 text-center">
                    <h3 className="text-base font-bold text-purple-300 mb-3">🔑 FRASE ANCLA DEL DÍA</h3>
                    <p className="text-white text-xl font-bold italic leading-relaxed">
                      "{crossedInterpretation.frase_ancla}"
                    </p>
                  </div>
                )}

                {/* 🔮 APOYO ENERGÉTICO (OPCIONAL) */}
                {crossedInterpretation.apoyo_energetico && crossedInterpretation.apoyo_energetico.length > 0 && (
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl p-5">
                    <h3 className="text-lg font-bold text-green-300 mb-4 flex items-center">
                      <span className="mr-2">🔮</span>
                      APOYO ENERGÉTICO (OPCIONAL)
                    </h3>
                    <div className="space-y-3">
                      {crossedInterpretation.apoyo_energetico.map((support: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0">
                            {support.type === 'vela' ? '🕯️' : support.type === 'piedra' ? '🪨' : '🧘'}
                          </span>
                          <div className="text-white">
                            <span className="font-semibold">{support.item}</span>
                            <span className="text-green-200"> → {support.purpose}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-green-200 text-sm mt-4 italic">Nada obligatorio. Solo herramientas que acompañan la decisión.</p>
                  </div>
                )}

                {/* 📌 CIERRE DEL DÍA */}
                {crossedInterpretation.cierre_del_dia && (
                  <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-2xl p-5">
                    <h3 className="text-lg font-bold text-cyan-300 mb-3 flex items-center">
                      <span className="mr-2">📌</span>
                      CIERRE DEL DÍA
                    </h3>
                    <p className="text-white leading-relaxed">{crossedInterpretation.cierre_del_dia}</p>
                  </div>
                )}
              </div>
            ) : (
              /* Fallback: Interpretación antigua si no hay V3 */
              event.description && (
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-l-4 border-yellow-400 rounded-lg p-4">
                  <p className="text-white text-lg font-semibold leading-relaxed">{event.description}</p>
                </div>
              )
            )}
          </div>

          {/* Footer del modal */}
          <div className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 p-6 border-t border-white/20 sticky bottom-0">
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
