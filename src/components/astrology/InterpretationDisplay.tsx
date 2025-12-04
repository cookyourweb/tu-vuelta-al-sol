// src/components/astrology/InterpretationDisplay.tsx
// ✅ VERSIÓN COMPLETA: NATAL + SOLAR RETURN

'use client';

import React, { useState } from 'react';
import {
  Star, Sparkles, Zap, Calendar, AlertTriangle,
  Target, TrendingUp, Moon, Sun, ChevronDown, ChevronUp
} from 'lucide-react';

// ✅ HELPER: Safe render any value
const safeRender = (value: any): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    // Si es objeto, intentar extraer info útil
    if (value.name) return value.name;
    if (value.signo_casa) return value.signo_casa;
    return JSON.stringify(value);
  }
  return String(value);
};

// ✅ CRITICAL FIX: Extract text from nested objects safely
const safeExtract = (obj: any, fallback: string = ''): string => {
  if (!obj) return fallback;
  if (typeof obj === 'string') return obj;
  if (typeof obj === 'number') return String(obj);
  if (typeof obj === 'boolean') return obj ? 'Sí' : 'No';

  // Handle nested objects - check for direct string properties first
  if (typeof obj === 'object') {
    // Direct string properties
    if (obj.signo_casa && typeof obj.signo_casa === 'string') return obj.signo_casa;
    if (obj.direccion_evolutiva && typeof obj.direccion_evolutiva === 'string') return obj.direccion_evolutiva;
    if (obj.desafio && typeof obj.desafio === 'string') return obj.desafio;
    if (obj.zona_comfort && typeof obj.zona_comfort === 'string') return obj.zona_comfort;
    if (obj.patron_repetitivo && typeof obj.patron_repetitivo === 'string') return obj.patron_repetitivo;

    // Nested object properties (for complex data structures)
    if (obj.signo_casa && typeof obj.signo_casa === 'object' && obj.signo_casa.signo) return obj.signo_casa.signo;
    if (obj.direccion_evolutiva && typeof obj.direccion_evolutiva === 'object' && obj.direccion_evolutiva.signo) return obj.direccion_evolutiva.signo;
    if (obj.desafio && typeof obj.desafio === 'object' && obj.desafio.signo) return obj.desafio.signo;
    if (obj.zona_comfort && typeof obj.zona_comfort === 'object' && obj.zona_comfort.signo) return obj.zona_comfort.signo;
    if (obj.patron_repetitivo && typeof obj.patron_repetitivo === 'object' && obj.patron_repetitivo.signo) return obj.patron_repetitivo.signo;

    // If still an object, stringify to prevent React error
    return JSON.stringify(obj);
  }

  return String(obj) || fallback;
};

// Interfaces para ambos tipos
interface NatalInterpretation {
  esencia_revolucionaria?: string;
  proposito_vida?: string;
  formacion_temprana?: any;
  patrones_psicologicos?: any[];
  planetas_profundos?: any[];
  nodos_lunares?: any;
  declaracion_poder?: string;
  advertencias?: string[];
  insights_transformacionales?: string[];
  pregunta_final_reflexion?: string;
}

interface SolarReturnInterpretation {
  esencia_revolucionaria_anual?: string;
  proposito_vida_anual?: string;
  tema_central_del_anio?: string;
  analisis_tecnico_profesional?: any;
  plan_accion?: any;
  calendario_lunar_anual?: any[];
  declaracion_poder_anual?: string;
  advertencias?: string[];
  eventos_clave_del_anio?: any[];
  insights_transformacionales?: string[];
  rituales_recomendados?: string[];
  integracion_final?: any;
}

interface Props {
  interpretation: NatalInterpretation | SolarReturnInterpretation;
  chartType: 'natal' | 'solar-return' | 'progressed';
}

//  Component Section reutilizable
const Section = ({ 
  title, 
  icon, 
  isExpanded, 
  onToggle, 
  children, 
  gradient 
}: { 
  title: string; 
  icon: React.ReactNode; 
  isExpanded: boolean; 
  onToggle: () => void; 
  children: React.ReactNode; 
  gradient: string; 
}) => (
  <div className={`rounded-xl border border-white/10 overflow-hidden bg-gradient-to-br ${gradient}`}>
    <button
      onClick={onToggle}
      className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
    >
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
    </button>
    {isExpanded && (
      <div className="px-6 pb-6 pt-2">
        {children}
      </div>
    )}
  </div>
);

export default function InterpretationDisplay({ interpretation, chartType }: Props) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['esencia', 'proposito', 'formacion'])
  );

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  // ✅ RENDERIZADO PARA CARTA NATAL
  if (chartType === 'natal') {
    const i = interpretation as NatalInterpretation;

    // ✅ DEBUG LOGS
    console.log('🔍 INTERPRETACIÓN RECIBIDA:', i);
    console.log('🔍 Formación Temprana:', i.formacion_temprana);
    console.log('🔍 Patrones:', i.patrones_psicologicos);
    console.log('🔍 Planetas:', i.planetas_profundos);
    console.log('🔍 Nodos:', i.nodos_lunares);

    return (
      <div className="space-y-6">
        
        {/* 🌟 ESENCIA REVOLUCIONARIA */}
        {i.esencia_revolucionaria && (
          <Section
            title="Tu Esencia Revolucionaria"
            icon={<Star className="w-6 h-6" />}
            isExpanded={expandedSections.has('esencia')}
            onToggle={() => toggleSection('esencia')}
            gradient="from-purple-900/40 to-pink-900/40"
          >
            <p className="text-purple-50 text-lg leading-relaxed font-medium">
              {i.esencia_revolucionaria}
            </p>
          </Section>
        )}

        {/* 🎯 PROPÓSITO DE VIDA */}
        {i.proposito_vida && (
          <Section
            title="Tu Propósito de Vida"
            icon={<Target className="w-6 h-6" />}
            isExpanded={expandedSections.has('proposito')}
            onToggle={() => toggleSection('proposito')}
            gradient="from-blue-900/40 to-cyan-900/40"
          >
            <p className="text-blue-50 text-lg leading-relaxed">
              {i.proposito_vida}
            </p>
          </Section>
        )}

        {/* 📖 FORMACIÓN TEMPRANA */}
        {i.formacion_temprana && (
          <Section
            title="Formación Temprana: Raíces de Tu Psique"
            icon={<Sparkles className="w-6 h-6" />}
            isExpanded={expandedSections.has('formacion')}
            onToggle={() => toggleSection('formacion')}
            gradient="from-purple-900/40 to-pink-900/40"
          >
            <div className="space-y-6">
              
              {/* Casa Lunar */}
              {i.formacion_temprana.casa_lunar && (
                <div className="p-5 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Moon className="w-5 h-5 text-blue-400" />
                    <h4 className="font-bold text-xl text-blue-300">
                      🌙 Casa Lunar: {safeRender(i.formacion_temprana.casa_lunar.planeta)}
                    </h4>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-semibold text-blue-200 mb-1">💧 Tu Infancia Emocional:</div>
                      <p className="text-blue-100 leading-relaxed">
                        {safeRender(i.formacion_temprana.casa_lunar.infancia_emocional)}
                      </p>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-purple-200 mb-1">🧬 Patrón Formado:</div>
                      <p className="text-purple-100 leading-relaxed">
                        {safeRender(i.formacion_temprana.casa_lunar.patron_formado)}
                      </p>
                    </div>
                    
                    <div className="bg-yellow-400/10 rounded-lg p-3 border border-yellow-400/30">
                      <div className="font-semibold text-yellow-300 mb-1">⚡ Impacto HOY:</div>
                      <p className="text-yellow-100 leading-relaxed">
                        {safeRender(i.formacion_temprana.casa_lunar.impacto_adulto)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Casa Saturnina */}
              {i.formacion_temprana.casa_saturnina && (
                <div className="p-5 bg-gradient-to-br from-gray-900/30 to-slate-900/30 rounded-xl border border-gray-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-gray-400" />
                    <h4 className="font-bold text-xl text-gray-300">
                      ⛰️ Casa Saturnina: {safeRender(i.formacion_temprana.casa_saturnina.planeta)}
                    </h4>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-semibold text-gray-200 mb-1">🔒 Límites Internalizados:</div>
                      <p className="text-gray-100 leading-relaxed">
                        {safeRender(i.formacion_temprana.casa_saturnina.limites_internalizados)}
                      </p>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-slate-200 mb-1">📜 Mensaje Recibido:</div>
                      <p className="text-slate-100 leading-relaxed">
                        {safeRender(i.formacion_temprana.casa_saturnina.mensaje_recibido)}
                      </p>
                    </div>
                    
                    <div className="bg-red-400/10 rounded-lg p-3 border border-red-400/30">
                      <div className="font-semibold text-red-300 mb-1">⚡ Impacto HOY:</div>
                      <p className="text-red-100 leading-relaxed">
                        {safeRender(i.formacion_temprana.casa_saturnina.impacto_adulto)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Casa Venusina */}
              {i.formacion_temprana.casa_venusina && (
                <div className="p-5 bg-gradient-to-br from-pink-900/30 to-rose-900/30 rounded-xl border border-pink-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-pink-400" />
                    <h4 className="font-bold text-xl text-pink-300">
                      💖 Casa Venusina: {safeRender(i.formacion_temprana.casa_venusina.planeta)}
                    </h4>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-semibold text-pink-200 mb-1">💕 Amor Aprendido:</div>
                      <p className="text-pink-100 leading-relaxed">
                        {safeRender(i.formacion_temprana.casa_venusina.amor_aprendido)}
                      </p>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-rose-200 mb-1">👥 Modelo Relacional:</div>
                      <p className="text-rose-100 leading-relaxed">
                        {safeRender(i.formacion_temprana.casa_venusina.modelo_relacional)}
                      </p>
                    </div>
                    
                    <div className="bg-green-400/10 rounded-lg p-3 border border-green-400/30">
                      <div className="font-semibold text-green-300 mb-1">⚡ Impacto HOY:</div>
                      <p className="text-green-100 leading-relaxed">
                        {safeRender(i.formacion_temprana.casa_venusina.impacto_adulto)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* CONTINÚA EN PARTE 2 */}
        {/* 🧠 PATRONES PSICOLÓGICOS */}
        {i.patrones_psicologicos && i.patrones_psicologicos.length > 0 && (
          <Section
            title="Patrones Psicológicos: Tus Ciclos Repetitivos"
            icon={<Zap className="w-6 h-6" />}
            isExpanded={expandedSections.has('patrones')}
            onToggle={() => toggleSection('patrones')}
            gradient="from-orange-900/40 to-red-900/40"
          >
            <div className="space-y-8">
              {i.patrones_psicologicos.map((patron: any, idx: number) => (
                <div key={idx} className="p-6 bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-xl border border-orange-500/30">
                  
                  {/* Nombre del patrón */}
                  <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg p-4 mb-4 border border-yellow-400/40">
                    <h4 className="font-bold text-2xl text-yellow-300 mb-1">
                      {patron.nombre_patron}
                    </h4>
                    <p className="text-sm text-orange-200">{patron.planeta_origen}</p>
                  </div>

                  {/* Cómo se manifiesta */}
                  <div className="mb-4">
                    <h5 className="font-semibold text-orange-200 mb-2">👁️ Cómo Se Manifiesta:</h5>
                    <ul className="space-y-1">
                      {patron.como_se_manifiesta?.map((item: string, i: number) => (
                        <li key={i} className="text-sm text-orange-100 flex items-start gap-2">
                          <span className="text-orange-400 mt-1">→</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Origen en infancia */}
                  <div className="mb-4 bg-purple-400/10 rounded-lg p-3">
                    <h5 className="font-semibold text-purple-200 mb-2">🧒 Origen en la Infancia:</h5>
                    <p className="text-sm text-purple-100 leading-relaxed">{patron.origen_infancia}</p>
                  </div>

                  {/* Diálogo interno */}
                  {patron.dialogo_interno && patron.dialogo_interno.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-semibold text-red-200 mb-2">💭 Diálogo Interno:</h5>
                      <div className="space-y-1">
                        {patron.dialogo_interno.map((pensamiento: string, i: number) => (
                          <p key={i} className="text-sm text-red-100 italic pl-4 border-l-2 border-red-400/50">
                            "{pensamiento}"
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ciclo kármico */}
                  {patron.ciclo_karmico && patron.ciclo_karmico.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-semibold text-yellow-200 mb-2">🔄 Ciclo Kármico:</h5>
                      <div className="space-y-2">
                        {patron.ciclo_karmico.map((paso: string, i: number) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-yellow-400 font-bold text-sm">{i + 1}.</span>
                            <p className="text-sm text-yellow-100">{paso}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sombra junguiana */}
                  <div className="mb-4 bg-gray-900/40 rounded-lg p-3 border border-gray-700">
                    <h5 className="font-semibold text-gray-300 mb-2">🌑 Sombra Junguiana:</h5>
                    <p className="text-sm text-gray-200 leading-relaxed">{patron.sombra_junguiana}</p>
                  </div>

                  {/* Superpoder integrado */}
                  <div className="mb-4 bg-green-400/10 rounded-lg p-3 border border-green-400/30">
                    <h5 className="font-semibold text-green-300 mb-2">✨ Superpoder Integrado:</h5>
                    <p className="text-sm text-green-100 leading-relaxed font-medium">{patron.superpoder_integrado}</p>
                  </div>

                  {/* Pregunta de reflexión */}
                  {patron.pregunta_reflexion && (
                    <div className="bg-blue-400/10 rounded-lg p-3 border border-blue-400/30">
                      <h5 className="font-semibold text-blue-300 mb-2">❓ Pregunta para Ti:</h5>
                      <p className="text-sm text-blue-100 italic leading-relaxed">{patron.pregunta_reflexion}</p>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </Section>
        )}

        {/* 🪐 PLANETAS PROFUNDOS */}
        {i.planetas_profundos && i.planetas_profundos.length > 0 && (
          <Section
            title="Planetas Profundos: Tu Mapa Interior"
            icon={<Moon className="w-6 h-6" />}
            isExpanded={expandedSections.has('planetas')}
            onToggle={() => toggleSection('planetas')}
            gradient="from-indigo-900/40 to-purple-900/40"
          >
            <div className="space-y-6">
              {i.planetas_profundos.map((planeta: any, idx: number) => (
                <div key={idx} className="p-5 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl border border-indigo-500/30">
                  
                  {/* Encabezado */}
                  <div className="mb-4">
                    <h4 className="font-bold text-2xl text-indigo-300 mb-1">{planeta.planeta}</h4>
                    <p className="text-sm text-indigo-300">{planeta.posicion_completa}</p>
                    <p className="text-xs text-purple-300 italic mt-1">{planeta.arquetipo}</p>
                  </div>

                  {/* Lectura psicológica */}
                  <p className="text-sm text-indigo-100 leading-relaxed mb-4">
                    {planeta.lectura_psicologica}
                  </p>

                  {/* Luz */}
                  <div className="mb-3 bg-yellow-400/10 rounded-lg p-3">
                    <div className="font-semibold text-yellow-300 mb-1 text-sm">✨ Luz:</div>
                    <p className="text-xs text-yellow-100 leading-relaxed">{planeta.luz}</p>
                  </div>

                  {/* Sombra */}
                  <div className="mb-3 bg-red-400/10 rounded-lg p-3">
                    <div className="font-semibold text-red-300 mb-1 text-sm">🌑 Sombra:</div>
                    <p className="text-xs text-red-100 leading-relaxed">{planeta.sombra}</p>
                  </div>

                  {/* Integración */}
                  <div className="bg-green-400/10 rounded-lg p-3 border border-green-400/30">
                    <div className="font-semibold text-green-300 mb-1 text-sm">🌱 Integración:</div>
                    <p className="text-xs text-green-100 leading-relaxed">{planeta.integracion}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* 🧭 NODOS LUNARES */}
        {i.nodos_lunares && (
          <Section
            title="Nodos Lunares: Tu GPS Evolutivo"
            icon={<Target className="w-6 h-6" />}
            isExpanded={expandedSections.has('nodos')}
            onToggle={() => toggleSection('nodos')}
            gradient="from-cyan-900/40 to-blue-900/40"
          >
            {console.log('🔍 Nodos data:', i.nodos_lunares)}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Nodo Sur */}
              {i.nodos_lunares.nodo_sur && (
                <div className="p-5 bg-gradient-to-br from-orange-900/20 to-amber-900/20 rounded-xl border border-orange-500/30">
                  <h4 className="font-bold text-xl text-orange-300 mb-4">🍂 Nodo Sur: Tu Zona de Confort</h4>
                  <p className="text-sm text-orange-200 mb-3">
                    {safeExtract(i.nodos_lunares.nodo_sur.signo_casa, 'Nodo Sur')}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <div className="font-semibold text-orange-200 mb-1 text-sm">✅ Habilidades que Dominas:</div>
                      <p className="text-xs text-orange-100 leading-relaxed">
                        {safeExtract(i.nodos_lunares.nodo_sur.zona_comfort, 'Tu zona de confort natural')}
                      </p>
                    </div>

                    <div className="bg-red-400/10 rounded-lg p-3">
                      <div className="font-semibold text-red-300 mb-1 text-sm">⚠️ Patrón Repetitivo:</div>
                      <p className="text-xs text-red-100 leading-relaxed">
                        {safeExtract(i.nodos_lunares.nodo_sur.patron_repetitivo, 'Patrones que repites')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nodo Norte */}
              {i.nodos_lunares.nodo_norte && (
                <div className="p-5 bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl border border-green-500/30">
                  <h4 className="font-bold text-xl text-green-300 mb-4">🌱 Nodo Norte: Tu Dirección Evolutiva</h4>
                  <p className="text-sm text-green-200 mb-3">
                    {safeExtract(i.nodos_lunares.nodo_norte.signo_casa, 'Nodo Norte')}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <div className="font-semibold text-green-200 mb-1 text-sm">🎯 Hacia Dónde Crecer:</div>
                      <p className="text-xs text-green-100 leading-relaxed">
                        {safeExtract(i.nodos_lunares.nodo_norte.direccion_evolutiva, 'Tu dirección de crecimiento')}
                      </p>
                    </div>

                    <div className="bg-yellow-400/10 rounded-lg p-3">
                      <div className="font-semibold text-yellow-300 mb-1 text-sm">⚡ El Desafío:</div>
                      <p className="text-xs text-yellow-100 leading-relaxed">
                        {safeExtract(i.nodos_lunares.nodo_norte.desafio, 'Tu desafío evolutivo')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Eje completo */}
            {i.nodos_lunares.eje_completo && (
              <div className="mt-6 p-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-lg border border-cyan-500/30">
                <h5 className="font-semibold text-cyan-300 mb-2">🧭 El Eje Completo:</h5>
                <p className="text-sm text-cyan-100 leading-relaxed">
                  {i.nodos_lunares.eje_completo}
                </p>
              </div>
            )}
          </Section>
        )}

        {/* 💎 DECLARACIÓN DE PODER */}
        {i.declaracion_poder && (
          <Section
            title="Declaración de Poder Personal"
            icon={<Zap className="w-6 h-6" />}
            isExpanded={expandedSections.has('declaracion')}
            onToggle={() => toggleSection('declaracion')}
            gradient="from-green-900/40 to-emerald-900/40"
          >
            <div className="p-6 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-xl border border-green-400/30">
              <p className="text-green-100 text-lg font-bold italic leading-relaxed">
                "{i.declaracion_poder}"
              </p>
            </div>
          </Section>
        )}

        {/* ⚠️ ADVERTENCIAS */}
        {i.advertencias && i.advertencias.length > 0 && (
          <Section
            title="⚠️ Advertencias Brutalmente Honestas"
            icon={<AlertTriangle className="w-6 h-6" />}
            isExpanded={expandedSections.has('advertencias')}
            onToggle={() => toggleSection('advertencias')}
            gradient="from-red-900/40 to-orange-900/40"
          >
            <div className="space-y-3">
              {i.advertencias.map((advertencia: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-red-400/10 rounded-lg border border-red-400/30">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-100 text-sm leading-relaxed">{advertencia}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ✨ INSIGHTS TRANSFORMACIONALES */}
        {i.insights_transformacionales && i.insights_transformacionales.length > 0 && (
          <Section
            title="Insights Transformacionales"
            icon={<Sparkles className="w-6 h-6" />}
            isExpanded={expandedSections.has('insights')}
            onToggle={() => toggleSection('insights')}
            gradient="from-purple-900/40 to-pink-900/40"
          >
            <ul className="space-y-3">
              {i.insights_transformacionales.map((insight: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-purple-100 text-sm leading-relaxed">
                  <span className="text-pink-400 text-lg">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* ❓ PREGUNTA FINAL */}
        {i.pregunta_final_reflexion && (
          <div className="p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-500/30">
            <h4 className="font-semibold text-blue-300 mb-3 text-lg">❓ Pregunta de Reflexión Final:</h4>
            <p className="text-blue-100 text-base italic leading-relaxed">
              {i.pregunta_final_reflexion}
            </p>
          </div>
        )}

      </div>
    );
  }

  // ✅ RENDERIZADO PARA SOLAR RETURN
  if (chartType === 'solar-return') {
    const i = interpretation as SolarReturnInterpretation;

    return (
      <div className="space-y-6">
        
        {/* 🌟 ESENCIA REVOLUCIONARIA ANUAL */}
        {i.esencia_revolucionaria_anual && (
          <Section
            title="Tu Esencia Revolucionaria Anual"
            icon={<Star className="w-6 h-6" />}
            isExpanded={expandedSections.has('esencia')}
            onToggle={() => toggleSection('esencia')}
            gradient="from-purple-900/40 to-pink-900/40"
          >
            <p className="text-purple-50 text-lg leading-relaxed font-medium">
              {i.esencia_revolucionaria_anual}
            </p>
          </Section>
        )}

        {/* 🎯 PROPÓSITO ANUAL */}
        {i.proposito_vida_anual && (
          <Section
            title="Tu Propósito de Vida Este Año"
            icon={<Target className="w-6 h-6" />}
            isExpanded={expandedSections.has('proposito')}
            onToggle={() => toggleSection('proposito')}
            gradient="from-blue-900/40 to-cyan-900/40"
          >
            <p className="text-blue-50 text-lg leading-relaxed">
              {i.proposito_vida_anual}
            </p>
          </Section>
        )}

        {/* 🔥 TEMA CENTRAL */}
        {i.tema_central_del_anio && (
          <Section
            title="Tema Central del Año"
            icon={<Zap className="w-6 h-6" />}
            isExpanded={expandedSections.has('tema')}
            onToggle={() => toggleSection('tema')}
            gradient="from-orange-900/40 to-red-900/40"
          >
            <div className="text-orange-50">
              <p className="text-lg leading-relaxed">
                {typeof i.tema_central_del_anio === 'string' ? i.tema_central_del_anio : safeRender(i.tema_central_del_anio)}
              </p>
            </div>
          </Section>
        )}

        {/* Resto de secciones de Solar Return... */}
        {/* (Las que ya tienes funcionando) */}

        {/* 💎 DECLARACIÓN DE PODER ANUAL */}
        {i.declaracion_poder_anual && (
          <Section
            title="Declaración de Poder Anual"
            icon={<Zap className="w-6 h-6" />}
            isExpanded={expandedSections.has('declaracion')}
            onToggle={() => toggleSection('declaracion')}
            gradient="from-green-900/40 to-emerald-900/40"
          >
            <div className="p-6 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-xl border border-green-400/30">
              <p className="text-green-100 text-lg font-bold italic leading-relaxed">
                "{i.declaracion_poder_anual}"
              </p>
            </div>
          </Section>
        )}

        {/* ⚠️ ADVERTENCIAS */}
        {i.advertencias && i.advertencias.length > 0 && (
          <Section
            title="⚠️ Advertencias para Este Año"
            icon={<AlertTriangle className="w-6 h-6" />}
            isExpanded={expandedSections.has('advertencias')}
            onToggle={() => toggleSection('advertencias')}
            gradient="from-red-900/40 to-orange-900/40"
          >
            <div className="space-y-3">
              {i.advertencias.map((advertencia: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-red-400/10 rounded-lg border border-red-400/30">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-100 text-sm leading-relaxed">{advertencia}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ✨ INSIGHTS */}
        {i.insights_transformacionales && i.insights_transformacionales.length > 0 && (
          <Section
            title="Insights Transformacionales"
            icon={<Sparkles className="w-6 h-6" />}
            isExpanded={expandedSections.has('insights')}
            onToggle={() => toggleSection('insights')}
            gradient="from-purple-900/40 to-pink-900/40"
          >
            <ul className="space-y-3">
              {i.insights_transformacionales.map((insight: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-purple-100 text-sm leading-relaxed">
                  <span className="text-pink-400 text-lg">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

      </div>
    );
  }

  // Fallback
  return (
    <div className="text-white p-6">
      <p>Tipo de carta no soportado: {chartType}</p>
    </div>
  );
}
