// src/components/astrology/InterpretationDisplay.tsx
// ✅ VERSIÓN MEJORADA CON TODOS LOS PLANETAS

'use client';

import React, { useState } from 'react';
import { X, Download, RefreshCw, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';

interface PlanetInterpretation {
  titulo: string;
  descripcion: string;
  poder_especifico: string;
  accion_inmediata?: string;
  ritual?: string;
}

interface InterpretationData {
  esencia_revolucionaria: string;
  proposito_vida: string;
  planetas?: {
    sol?: PlanetInterpretation;
    luna?: PlanetInterpretation;
    mercurio?: PlanetInterpretation;
    venus?: PlanetInterpretation;
    marte?: PlanetInterpretation;
    jupiter?: PlanetInterpretation;
    saturno?: PlanetInterpretation;
    urano?: PlanetInterpretation;
    neptuno?: PlanetInterpretation;
    pluton?: PlanetInterpretation;
  };
  declaracion_poder?: string;
  plan_accion?: {
    hoy_mismo?: string[];
    esta_semana?: string[];
    este_mes?: string[];
  };
  advertencias?: string[];
  insights_transformacionales?: string[];
  rituales_recomendados?: string[];
}

interface InterpretationDisplayProps {
  data: InterpretationData;
  onClose: () => void;
  onRegenerate?: () => void;
  onPurchase?: () => void;
  isFullVersion?: boolean;
}

export default function InterpretationDisplay({
  data,
  onClose,
  onRegenerate,
  onPurchase,
  isFullVersion = false
}: InterpretationDisplayProps) {
  const [expandedPlanets, setExpandedPlanets] = useState<Set<string>>(new Set(['sol', 'luna']));

  const togglePlanet = (planet: string) => {
    setExpandedPlanets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(planet)) {
        newSet.delete(planet);
      } else {
        newSet.add(planet);
      }
      return newSet;
    });
  };

  const handleDownloadPDF = () => {
    // TODO: Implementar generación PDF
    alert('Generación de PDF disponible próximamente. Instalar librería: npm install jspdf html2canvas');
  };

  const planetsOrder = [
    { key: 'sol', icon: '☉' },
    { key: 'luna', icon: '☽' },
    { key: 'mercurio', icon: '☿' },
    { key: 'venus', icon: '♀' },
    { key: 'marte', icon: '♂' },
    { key: 'jupiter', icon: '♃' },
    { key: 'saturno', icon: '♄' },
    { key: 'urano', icon: '♅' },
    { key: 'neptuno', icon: '♆' },
    { key: 'pluton', icon: '♇' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-gradient-to-br from-purple-900 via-indigo-900 to-black rounded-2xl shadow-2xl overflow-hidden">
        
        {/* ✅ HEADER CON MENÚ NUEVO */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-800 to-indigo-800 px-6 py-4 flex items-center justify-between border-b border-white/10">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">🌟</span>
            Tu Interpretación Astrológica
          </h2>
          
          <div className="flex items-center gap-2">
            {/* ✅ BOTÓN REGENERAR */}
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm font-medium"
                title="Regenerar interpretación"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Regenerar</span>
              </button>
            )}
            
            {/* ✅ BOTÓN PDF */}
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium"
              title="Descargar PDF"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">PDF</span>
            </button>
            
            {/* ✅ BOTÓN COMPRAR (placeholder) */}
            {!isFullVersion && onPurchase && (
              <button
                onClick={() => alert('Sistema de pagos disponible próximamente. Fase 3: Septiembre 2025')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg transition-colors text-sm font-medium"
                title="Comprar versión completa"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Comprar</span>
              </button>
            )}
            
            {/* ✅ BOTÓN CERRAR */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ✅ CONTENIDO SCROLLABLE */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 custom-scrollbar">
          
          {/* ESENCIA REVOLUCIONARIA */}
          <section className="mb-8 p-6 bg-gradient-to-r from-purple-800/50 to-pink-800/50 rounded-xl border border-purple-500/30">
            <h3 className="text-2xl font-bold mb-4 text-yellow-300">✨ Tu Esencia Revolucionaria</h3>
            <p className="text-lg leading-relaxed text-white/90">{data.esencia_revolucionaria}</p>
          </section>

          {/* PROPÓSITO DE VIDA */}
          <section className="mb-8 p-6 bg-gradient-to-r from-blue-800/50 to-purple-800/50 rounded-xl border border-blue-500/30">
            <h3 className="text-2xl font-bold mb-4 text-cyan-300">🎯 Tu Propósito de Vida</h3>
            <p className="text-lg leading-relaxed text-white/90">{data.proposito_vida}</p>
          </section>

          {/* ✅ PLANETAS - SECCIÓN EXPANDIBLE */}
          {data.planetas && (
            <section className="mb-8">
              <h3 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                <span>🪐</span>
                Tus Planetas: Tu Arquitectura Cósmica
              </h3>
              
              <div className="space-y-4">
                {planetsOrder.map(({ key, icon }) => {
                  const planet = data.planetas?.[key as keyof typeof data.planetas];
                  if (!planet) return null;

                  const isExpanded = expandedPlanets.has(key);

                  return (
                    <div 
                      key={key}
                      className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl border border-indigo-500/30 overflow-hidden transition-all"
                    >
                      {/* HEADER CLICKEABLE */}
                      <button
                        onClick={() => togglePlanet(key)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                      >
                        <h4 className="text-xl font-bold text-white flex items-center gap-3">
                          <span className="text-2xl">{icon}</span>
                          {planet.titulo}
                        </h4>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-white/60" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-white/60" />
                        )}
                      </button>

                      {/* CONTENIDO EXPANDIBLE */}
                      {isExpanded && (
                        <div className="px-6 pb-6 space-y-4">
                          {/* Descripción */}
                          <div>
                            <h5 className="text-sm font-semibold text-purple-300 mb-2">Interpretación</h5>
                            <p className="text-white/90 leading-relaxed">{planet.descripcion}</p>
                          </div>

                          {/* Poder Específico */}
                          {planet.poder_especifico && (
                            <div className="bg-purple-800/30 p-4 rounded-lg border-l-4 border-yellow-400">
                              <h5 className="text-sm font-semibold text-yellow-300 mb-2">💫 Tu Poder Único</h5>
                              <p className="text-white/90">{planet.poder_especifico}</p>
                            </div>
                          )}

                          {/* Acción Inmediata */}
                          {planet.accion_inmediata && (
                            <div className="bg-green-800/30 p-4 rounded-lg border-l-4 border-green-400">
                              <h5 className="text-sm font-semibold text-green-300 mb-2">⚡ Acción para Hoy</h5>
                              <p className="text-white/90">{planet.accion_inmediata}</p>
                            </div>
                          )}

                          {/* Ritual */}
                          {planet.ritual && (
                            <div className="bg-pink-800/30 p-4 rounded-lg border-l-4 border-pink-400">
                              <h5 className="text-sm font-semibold text-pink-300 mb-2">🔮 Ritual Recomendado</h5>
                              <p className="text-white/90">{planet.ritual}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* DECLARACIÓN DE PODER */}
          {data.declaracion_poder && (
            <section className="mb-8 p-6 bg-gradient-to-r from-yellow-800/50 to-orange-800/50 rounded-xl border border-yellow-500/30">
              <h3 className="text-2xl font-bold mb-4 text-yellow-200">💎 Tu Declaración de Poder</h3>
              <p className="text-xl leading-relaxed text-white font-semibold italic">"{data.declaracion_poder}"</p>
              <p className="text-sm text-white/70 mt-3">Repite esta declaración cada mañana para activar tu poder.</p>
            </section>
          )}

          {/* PLAN DE ACCIÓN */}
          {data.plan_accion && (
            <section className="mb-8">
              <h3 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                <span>⚡</span>
                Tu Plan de Acción
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                {/* Hoy Mismo */}
                {data.plan_accion.hoy_mismo && (
                  <div className="bg-red-900/30 p-5 rounded-xl border border-red-500/30">
                    <h4 className="text-lg font-bold text-red-300 mb-3">🔥 Hoy Mismo</h4>
                    <ul className="space-y-2">
                      {data.plan_accion.hoy_mismo.map((accion, i) => (
                        <li key={i} className="text-white/90 text-sm flex items-start gap-2">
                          <span className="text-red-400 mt-1">•</span>
                          <span>{accion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Esta Semana */}
                {data.plan_accion.esta_semana && (
                  <div className="bg-orange-900/30 p-5 rounded-xl border border-orange-500/30">
                    <h4 className="text-lg font-bold text-orange-300 mb-3">📅 Esta Semana</h4>
                    <ul className="space-y-2">
                      {data.plan_accion.esta_semana.map((accion, i) => (
                        <li key={i} className="text-white/90 text-sm flex items-start gap-2">
                          <span className="text-orange-400 mt-1">•</span>
                          <span>{accion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Este Mes */}
                {data.plan_accion.este_mes && (
                  <div className="bg-green-900/30 p-5 rounded-xl border border-green-500/30">
                    <h4 className="text-lg font-bold text-green-300 mb-3">🌙 Este Mes</h4>
                    <ul className="space-y-2">
                      {data.plan_accion.este_mes.map((accion, i) => (
                        <li key={i} className="text-white/90 text-sm flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span>{accion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ADVERTENCIAS */}
          {data.advertencias && data.advertencias.length > 0 && (
            <section className="mb-8 p-6 bg-gradient-to-r from-red-900/50 to-orange-900/50 rounded-xl border border-red-500/30">
              <h3 className="text-2xl font-bold mb-4 text-red-300">⚠️ Advertencias Importantes</h3>
              <ul className="space-y-3">
                {data.advertencias.map((advertencia, i) => (
                  <li key={i} className="text-white/90 flex items-start gap-3">
                    <span className="text-red-400 text-xl mt-1">⚠</span>
                    <span>{advertencia}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* INSIGHTS TRANSFORMACIONALES */}
          {data.insights_transformacionales && data.insights_transformacionales.length > 0 && (
            <section className="mb-8 p-6 bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-xl border border-cyan-500/30">
              <h3 className="text-2xl font-bold mb-4 text-cyan-300">💡 Insights Transformacionales</h3>
              <ul className="space-y-3">
                {data.insights_transformacionales.map((insight, i) => (
                  <li key={i} className="text-white/90 flex items-start gap-3">
                    <span className="text-cyan-400 text-xl mt-1">💡</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* RITUALES RECOMENDADOS */}
          {data.rituales_recomendados && data.rituales_recomendados.length > 0 && (
            <section className="mb-8 p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl border border-purple-500/30">
              <h3 className="text-2xl font-bold mb-4 text-purple-300">🔮 Rituales Recomendados</h3>
              <ul className="space-y-3">
                {data.rituales_recomendados.map((ritual, i) => (
                  <li key={i} className="text-white/90 flex items-start gap-3">
                    <span className="text-purple-400 text-xl mt-1">🔮</span>
                    <span>{ritual}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* FOOTER CON LLAMADO A LA ACCIÓN */}
          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-800/50 to-purple-800/50 rounded-xl border border-indigo-500/30 text-center">
            <p className="text-white/80 mb-4">
              ✨ Esta es tu brújula cósmica. Úsala para navegar tu poder único.
            </p>
            {!isFullVersion && (
              <button
                onClick={() => alert('Sistema de pagos disponible próximamente. Fase 3: Septiembre 2025')}
                className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-full font-bold text-lg transition-all transform hover:scale-105"
              >
                Desbloquear Versión Completa 💎
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}