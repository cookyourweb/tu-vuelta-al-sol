// src/components/astrology/InterpretationDisplay.tsx (versión COMPLETA)
// 🔥 DISPLAY ÉPICO PARA SOLAR RETURN CON TODAS LAS SECCIONES

import React, { useState } from 'react';
import { 
  Star, Sparkles, Zap, Calendar, AlertTriangle, 
  Target, TrendingUp, Moon, Sun, ChevronDown, ChevronUp
} from 'lucide-react';

interface CompleteSolarReturnInterpretation {
  esencia_revolucionaria_anual: string;
  proposito_vida_anual: string;
  tema_central_del_anio: string;
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
  interpretation: CompleteSolarReturnInterpretation;
  chartType: 'natal' | 'solar-return' | 'progressed';
}

export default function InterpretationDisplayComplete({ interpretation, chartType }: Props) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['esencia', 'proposito'])
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

  if (chartType !== 'solar-return') {
    return <div className="text-white">Display solo para Solar Return por ahora</div>;
  }

  const i = interpretation;

  return (
    <div className="space-y-6">
      
      {/* 🌟 ESENCIA REVOLUCIONARIA */}
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

      {/* 🎯 PROPÓSITO DE VIDA ANUAL */}
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

      {/* 🔥 TEMA CENTRAL */}
      <Section
        title="Tema Central del Año"
        icon={<Zap className="w-6 h-6" />}
        isExpanded={expandedSections.has('tema')}
        onToggle={() => toggleSection('tema')}
        gradient="from-orange-900/40 to-red-900/40"
      >
        <div className="text-orange-50">
          <h3 className="text-2xl font-bold mb-4">{i.tema_central_del_anio}</h3>
          <p className="text-lg">
            Este será tu hilo conductor durante los próximos 12 meses.
          </p>
        </div>
      </Section>

      {/* 📊 ANÁLISIS TÉCNICO PROFESIONAL */}
      {i.analisis_tecnico_profesional && (
        <Section
          title="Análisis Técnico Profesional"
          icon={<TrendingUp className="w-6 h-6" />}
          isExpanded={expandedSections.has('tecnico')}
          onToggle={() => toggleSection('tecnico')}
          gradient="from-green-900/40 to-emerald-900/40"
        >
          <div className="space-y-4 text-green-50">
            {/* ASC SR en Casa Natal */}
            {i.analisis_tecnico_profesional.asc_sr_en_casa_natal && (
              <div className="p-4 bg-green-950/30 rounded-lg">
                <h4 className="font-bold text-lg mb-2">
                  🔑 Ascendente Solar Return en Casa {i.analisis_tecnico_profesional.asc_sr_en_casa_natal.casa} Natal
                </h4>
                <p className="text-sm mb-2">
                  <strong>Signo:</strong> {i.analisis_tecnico_profesional.asc_sr_en_casa_natal.signo_asc_sr}
                </p>
                <p className="mb-2">{i.analisis_tecnico_profesional.asc_sr_en_casa_natal.significado}</p>
                <p className="text-sm italic">
                  Área de vida dominante: {i.analisis_tecnico_profesional.asc_sr_en_casa_natal.area_vida_dominante}
                </p>
              </div>
            )}

            {/* Sol en Casa SR */}
            {i.analisis_tecnico_profesional.sol_en_casa_sr && (
              <div className="p-4 bg-yellow-950/30 rounded-lg">
                <h4 className="font-bold text-lg mb-2">
                  ☀️ Sol en Casa {i.analisis_tecnico_profesional.sol_en_casa_sr.casa} de Solar Return
                </h4>
                <p>{i.analisis_tecnico_profesional.sol_en_casa_sr.significado}</p>
              </div>
            )}

            {/* Planetas Angulares */}
            {i.analisis_tecnico_profesional.planetas_angulares_sr?.length > 0 && (
              <div className="p-4 bg-purple-950/30 rounded-lg">
                <h4 className="font-bold text-lg mb-3">⚡ Planetas Angulares (Poder Dominante)</h4>
                <div className="space-y-2">
                  {i.analisis_tecnico_profesional.planetas_angulares_sr.map((p: any, idx: number) => (
                    <div key={idx} className="border-l-2 border-purple-400 pl-3">
                      <p className="font-semibold">{p.planeta} en {p.posicion}</p>
                      <p className="text-sm">{p.impacto}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Aspectos Cruzados */}
            {i.analisis_tecnico_profesional.aspectos_cruzados_natal_sr?.length > 0 && (
              <div className="p-4 bg-blue-950/30 rounded-lg">
                <h4 className="font-bold text-lg mb-3">🔄 Aspectos Natal vs Solar Return</h4>
                <div className="space-y-2">
                  {i.analisis_tecnico_profesional.aspectos_cruzados_natal_sr.map((a: any, idx: number) => (
                    <div key={idx} className="text-sm">
                      <p>
                        <strong>{a.planeta_natal} (Natal)</strong> {a.aspecto} 
                        <strong> {a.planeta_sr} (SR)</strong> 
                        {a.orbe && ` | Orbe: ${a.orbe}°`}
                      </p>
                      <p className="text-blue-200 italic">{a.significado}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* 📅 PLAN DE ACCIÓN TRIMESTRAL */}
      {i.plan_accion && (
        <Section
          title="Plan de Acción Trimestral"
          icon={<Calendar className="w-6 h-6" />}
          isExpanded={expandedSections.has('plan')}
          onToggle={() => toggleSection('plan')}
          gradient="from-indigo-900/40 to-purple-900/40"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(t => {
              const trimestre = i.plan_accion[`trimestre_${t}` as keyof typeof i.plan_accion];
              if (!trimestre) return null;
              
              return (
                <div key={t} className="p-4 bg-indigo-950/40 rounded-lg border border-indigo-500/30">
                  <h4 className="font-bold text-indigo-200 mb-2">Trimestre {t}</h4>
                  <p className="text-indigo-100 font-semibold mb-3">{trimestre.foco}</p>
                  <ul className="space-y-1 text-sm text-indigo-200">
                    {trimestre.acciones?.map((accion: string, idx: number) => (
                      <li key={idx}>✓ {accion}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* 🌙 CALENDARIO LUNAR ANUAL */}
      {i.calendario_lunar_anual && i.calendario_lunar_anual.length > 0 && (
        <Section
          title="Calendario Lunar Anual"
          icon={<Moon className="w-6 h-6" />}
          isExpanded={expandedSections.has('lunar')}
          onToggle={() => toggleSection('lunar')}
          gradient="from-slate-900/40 to-gray-900/40"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {i.calendario_lunar_anual.map((mes, idx) => (
              <div key={idx} className="p-3 bg-slate-950/40 rounded-lg border border-slate-600/30">
                <h4 className="font-bold text-slate-200 mb-2">{mes.mes}</h4>
                
                <div className="text-xs space-y-2">
                  <div className="bg-yellow-950/30 p-2 rounded">
                    <p className="font-semibold text-yellow-200">🌑 Luna Nueva</p>
                    <p className="text-yellow-100">{mes.luna_nueva.fecha}</p>
                    <p className="text-yellow-100">{mes.luna_nueva.signo}</p>
                    <p className="italic text-yellow-200/80 text-xs">{mes.luna_nueva.mensaje}</p>
                  </div>
                  
                  <div className="bg-blue-950/30 p-2 rounded">
                    <p className="font-semibold text-blue-200">🌕 Luna Llena</p>
                    <p className="text-blue-100">{mes.luna_llena.fecha}</p>
                    <p className="text-blue-100">{mes.luna_llena.signo}</p>
                    <p className="italic text-blue-200/80 text-xs">{mes.luna_llena.mensaje}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 💎 DECLARACIÓN DE PODER */}
      {i.declaracion_poder_anual && (
        <Section
          title="Tu Declaración de Poder Anual"
          icon={<Sparkles className="w-6 h-6" />}
          isExpanded={expandedSections.has('declaracion')}
          onToggle={() => toggleSection('declaracion')}
          gradient="from-yellow-900/40 to-amber-900/40"
        >
          <div className="p-6 bg-gradient-to-r from-yellow-950/50 to-amber-950/50 rounded-xl border-2 border-yellow-500/50">
            <p className="text-yellow-100 text-xl font-bold text-center leading-relaxed">
              {i.declaracion_poder_anual}
            </p>
            <p className="text-yellow-200/70 text-center mt-4 text-sm italic">
              Repite esta declaración en voz alta en lunas nuevas y momentos clave
            </p>
          </div>
        </Section>
      )}

      {/* ⚠️ ADVERTENCIAS */}
      {i.advertencias && i.advertencias.length > 0 && (
        <Section
          title="Advertencias y Desafíos a Evitar"
          icon={<AlertTriangle className="w-6 h-6" />}
          isExpanded={expandedSections.has('advertencias')}
          onToggle={() => toggleSection('advertencias')}
          gradient="from-red-900/40 to-orange-900/40"
        >
          <div className="space-y-3">
            {i.advertencias.map((advertencia, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-red-950/30 rounded-lg border-l-4 border-red-500">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                <p className="text-red-100">{advertencia}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 🎯 EVENTOS CLAVE DEL AÑO */}
      {i.eventos_clave_del_anio && i.eventos_clave_del_anio.length > 0 && (
        <Section
          title="Eventos Clave del Año"
          icon={<Calendar className="w-6 h-6" />}
          isExpanded={expandedSections.has('eventos')}
          onToggle={() => toggleSection('eventos')}
          gradient="from-teal-900/40 to-cyan-900/40"
        >
          <div className="space-y-4">
            {i.eventos_clave_del_anio.map((evento, idx) => (
              <div key={idx} className="p-4 bg-teal-950/30 rounded-lg border border-teal-600/30">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-teal-200">{evento.evento}</h4>
                  <span className="text-xs bg-teal-700/50 px-2 py-1 rounded text-teal-100">
                    {evento.tipo}
                  </span>
                </div>
                <p className="text-sm text-teal-300 mb-2">{evento.periodo}</p>
                <p className="text-teal-100 mb-3">{evento.descripcion}</p>
                {evento.accion_recomendada && (
                  <div className="mt-3 p-2 bg-teal-900/40 rounded">
                    <p className="text-sm text-teal-200">
                      <strong>Acción:</strong> {evento.accion_recomendada}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 💡 INSIGHTS TRANSFORMACIONALES */}
      {i.insights_transformacionales && i.insights_transformacionales.length > 0 && (
        <Section
          title="Insights Transformacionales"
          icon={<Zap className="w-6 h-6" />}
          isExpanded={expandedSections.has('insights')}
          onToggle={() => toggleSection('insights')}
          gradient="from-violet-900/40 to-fuchsia-900/40"
        >
          <div className="space-y-2">
            {i.insights_transformacionales.map((insight, idx) => (
              <div key={idx} className="flex gap-3 items-start p-3 bg-violet-950/30 rounded-lg">
                <Sparkles className="w-5 h-5 text-violet-400 flex-shrink-0 mt-1" />
                <p className="text-violet-100">{insight}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 🕯️ RITUALES RECOMENDADOS */}
      {i.rituales_recomendados && i.rituales_recomendados.length > 0 && (
        <Section
          title="Rituales Recomendados"
          icon={<Sun className="w-6 h-6" />}
          isExpanded={expandedSections.has('rituales')}
          onToggle={() => toggleSection('rituales')}
          gradient="from-amber-900/40 to-orange-900/40"
        >
          <div className="space-y-3">
            {i.rituales_recomendados.map((ritual, idx) => (
              <div key={idx} className="p-4 bg-amber-950/30 rounded-lg border-l-4 border-amber-500">
                <p className="text-amber-100">{ritual}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 🌈 INTEGRACIÓN FINAL */}
      {i.integracion_final && (
        <Section
          title="Integración Final"
          icon={<Star className="w-6 h-6" />}
          isExpanded={expandedSections.has('integracion')}
          onToggle={() => toggleSection('integracion')}
          gradient="from-pink-900/40 to-rose-900/40"
        >
          <div className="space-y-4">
            <div className="p-4 bg-pink-950/30 rounded-lg">
              <h4 className="font-bold text-pink-200 mb-3">Síntesis del Año</h4>
              <p className="text-pink-100 leading-relaxed">{i.integracion_final.sintesis}</p>
            </div>
            
            {i.integracion_final.pregunta_reflexion && (
              <div className="p-4 bg-rose-950/30 rounded-lg border-2 border-rose-500/50">
                <h4 className="font-bold text-rose-200 mb-2">Pregunta para Reflexión</h4>
                <p className="text-rose-100 text-lg italic">{i.integracion_final.pregunta_reflexion}</p>
              </div>
            )}
          </div>
        </Section>
      )}

    </div>
  );
}

// ==========================================
// 🎨 COMPONENTE SECTION REUTILIZABLE
// ==========================================

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  gradient: string;
}

function Section({ title, icon, children, isExpanded, onToggle, gradient }: SectionProps) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl border border-white/10 overflow-hidden`}>
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-white">{icon}</div>
          <h3 className="text-white font-bold text-xl">{title}</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-6 h-6 text-white" />
        ) : (
          <ChevronDown className="w-6 h-6 text-white" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-6 pt-0">
          {children}
        </div>
      )}
    </div>
  );
}