'use client';

import { useState } from 'react';
import { Sparkles, X, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface EventData {
  type: 'luna_nueva' | 'luna_llena' | 'transito' | 'aspecto';
  date: string; // YYYY-MM-DD
  sign?: string;
  house: number;
  planetsInvolved?: string[];
  transitingPlanet?: string;
  natalPlanet?: string;
  aspectType?: string;
}

interface EventInterpretationButtonProps {
  userId: string;
  event: EventData;
  className?: string;
}

export default function EventInterpretationButton({
  userId,
  event,
  className = ''
}: EventInterpretationButtonProps) {
  const { user } = useAuth();
  const [interpretation, setInterpretation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleGenerateInterpretation = async (regenerate = false) => {
    setLoading(true);
    setError(null);

    try {
      // ✅ Obtener token de Firebase
      if (!user) {
        setError('Debes estar autenticado');
        setLoading(false);
        return;
      }

      let token: string;
      try {
        token = await user.getIdToken();
      } catch (tokenError) {
        console.error('❌ Error getting token:', tokenError);
        setError('Error de autenticación. Intenta refrescar la página.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/interpretations/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          event,
          regenerate
        })
      });

      const data = await response.json();

      if (data.success) {
        setInterpretation(data.interpretation);
        setShowModal(true);
      } else {
        setError(data.error || 'Error generando interpretación');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* BOTÓN */}
      <button
        onClick={() => handleGenerateInterpretation(false)}
        disabled={loading}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg
          bg-gradient-to-r from-purple-600 to-pink-600
          hover:from-purple-700 hover:to-pink-700
          text-white font-semibold
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generando...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Ver Interpretación Personalizada
          </>
        )}
      </button>

      {/* ERROR */}
      {error && (
        <div className="mt-2 p-3 bg-red-900/30 border border-red-400/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-200 text-sm">{error}</p>
              <button
                onClick={() => handleGenerateInterpretation(false)}
                className="mt-2 text-red-100 text-sm underline hover:text-white"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FULLSCREEN - FORMATO AGENDA FÍSICA */}
      {showModal && interpretation && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-2xl shadow-2xl border border-purple-500/20 mb-8">

              {/* HEADER */}
              <div className="bg-gradient-to-r from-purple-900/90 to-pink-900/90 px-6 py-6 rounded-t-2xl border-b border-purple-400/30">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                      🌙 {interpretation.titulo_evento || 'Evento Astrológico'}
                    </h1>
                    <p className="text-purple-200 text-sm mb-3">
                      {new Date(event.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>

                    {/* Clima del día */}
                    {interpretation.clima_del_dia && interpretation.clima_del_dia.length > 0 && (
                      <div className="text-purple-100 text-sm mb-2">
                        <strong>Clima del día:</strong> {interpretation.clima_del_dia.join(' · ')}
                      </div>
                    )}

                    {/* Energías activas */}
                    {interpretation.energias_activas && interpretation.energias_activas.length > 0 && (
                      <div className="text-purple-100 text-sm">
                        <strong>Energías activas este año:</strong> {interpretation.energias_activas.join(' · ')}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {/* Regenerar */}
                    <button
                      onClick={() => handleGenerateInterpretation(true)}
                      disabled={loading}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Regenerar interpretación"
                    >
                      <RefreshCw className={`w-5 h-5 text-purple-200 ${loading ? 'animate-spin' : ''}`} />
                    </button>

                    {/* Cerrar */}
                    <button
                      onClick={handleClose}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6 text-purple-200" />
                    </button>
                  </div>
                </div>
              </div>

              {/* CONTENT - Sin restricciones de altura */}
              <div className="p-6 md:p-8 space-y-8">
                {/* ==========================================
                    📊 NIVEL 1: ANÁLISIS OBJETIVO
                    ========================================== */}
                {(interpretation.nivel_1_analisis_objetivo || interpretation.capa_1_descriptivo) && (
                  <div className="space-y-6">
                    {/* Título de Nivel 1 */}
                    <div className="border-l-4 border-blue-400 pl-4 py-2 bg-blue-950/30">
                      <h2 className="text-2xl font-bold text-blue-100">
                        📊 Análisis Objetivo
                      </h2>
                      <p className="text-blue-300 text-sm mt-1">
                        ¿Qué pasa astronómicamente? (Sin interpretar)
                      </p>
                    </div>

                    {/* Datos Objetivos */}
                    {interpretation.capa_1_descriptivo.datos_objetivos && (
                      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl p-5 border border-slate-600/40">
                        <h3 className="text-lg font-bold text-slate-200 mb-3">
                          📊 Datos Objetivos
                        </h3>
                        <div className="space-y-2 text-slate-300 text-sm">
                          <p><span className="font-semibold">Evento:</span> {interpretation.capa_1_descriptivo.datos_objetivos.evento}</p>
                          <p><span className="font-semibold">Fecha:</span> {interpretation.capa_1_descriptivo.datos_objetivos.fecha}</p>
                          <p><span className="font-semibold">Signo Principal:</span> {interpretation.capa_1_descriptivo.datos_objetivos.signo_principal}</p>
                          {interpretation.capa_1_descriptivo.datos_objetivos.signo_opuesto && (
                            <p><span className="font-semibold">Signo Opuesto:</span> {interpretation.capa_1_descriptivo.datos_objetivos.signo_opuesto}</p>
                          )}
                          <p><span className="font-semibold">Tipo de Energía:</span> {interpretation.capa_1_descriptivo.datos_objetivos.tipo_energia}</p>
                        </div>
                      </div>
                    )}

                    {/* Casas Activadas */}
                    {interpretation.capa_1_descriptivo.casas_activadas_en_tu_carta && (
                      <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 rounded-xl p-5 border border-indigo-400/30">
                        <h3 className="text-lg font-bold text-indigo-100 mb-3">
                          🏠 Casas Activadas en Tu Carta
                        </h3>
                        <div className="space-y-3 text-indigo-50">
                          <p><span className="font-semibold text-indigo-200">Casa Principal:</span> {interpretation.capa_1_descriptivo.casas_activadas_en_tu_carta.casa_principal}</p>
                          {interpretation.capa_1_descriptivo.casas_activadas_en_tu_carta.casa_opuesta && (
                            <p><span className="font-semibold text-indigo-200">Casa Opuesta:</span> {interpretation.capa_1_descriptivo.casas_activadas_en_tu_carta.casa_opuesta}</p>
                          )}
                          {interpretation.capa_1_descriptivo.casas_activadas_en_tu_carta.eje_activado && (
                            <p className="mt-3 pt-3 border-t border-indigo-400/30">
                              <span className="font-semibold text-indigo-200">Eje Activado:</span> {interpretation.capa_1_descriptivo.casas_activadas_en_tu_carta.eje_activado}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Planetas Natales Implicados */}
                    {interpretation.capa_1_descriptivo.planetas_natales_implicados && interpretation.capa_1_descriptivo.planetas_natales_implicados.length > 0 && (
                      <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-xl p-5 border border-purple-400/30">
                        <h3 className="text-lg font-bold text-purple-100 mb-3">
                          🪐 Planetas Natales Implicados
                        </h3>
                        <ul className="space-y-2">
                          {interpretation.capa_1_descriptivo.planetas_natales_implicados.map((planeta: string, i: number) => (
                            <li key={i} className="text-purple-50 flex items-start gap-2">
                              <span className="text-purple-300 mt-1">•</span>
                              <span>{planeta}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Descripción Estructural */}
                    {interpretation.capa_1_descriptivo.descripcion_estructural && (
                      <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-xl p-5 border border-cyan-400/30">
                        <h3 className="text-lg font-bold text-cyan-100 mb-3">
                          🔍 Descripción Estructural
                        </h3>
                        <p className="text-cyan-50 leading-relaxed whitespace-pre-line">
                          {interpretation.capa_1_descriptivo.descripcion_estructural}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ==========================================
                    🛠️ CAPA 2: INTERPRETACIÓN APLICADA
                    ========================================== */}
                {interpretation.capa_2_aplicado && (
                  <div className="space-y-6 mt-12">
                    {/* Título de Capa 2 */}
                    <div className="border-l-4 border-amber-400 pl-4 py-2 bg-amber-950/30">
                      <h2 className="text-2xl font-bold text-amber-100">
                        🛠️ Interpretación Aplicada a Tu Caso
                      </h2>
                      <p className="text-amber-300 text-sm mt-1">
                        Cómo se vive este evento en tu vida y qué hacer con él
                      </p>
                    </div>

                    {/* Cruce con Tu Estructura Natal */}
                    {interpretation.capa_2_aplicado.cruce_con_tu_estructura_natal && (
                      <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-6 border border-purple-400/30">
                        <h3 className="text-xl font-bold text-purple-100 mb-4">
                          🌟 Cruce con Tu Estructura Natal
                        </h3>
                        <p className="text-purple-50 text-lg leading-relaxed whitespace-pre-line">
                          {interpretation.capa_2_aplicado.cruce_con_tu_estructura_natal}
                        </p>
                      </div>
                    )}

                    {/* Cómo Se Vive en Ti */}
                    {interpretation.capa_2_aplicado.como_se_vive_en_ti && (
                      <div className="bg-gradient-to-br from-violet-900/40 to-purple-900/40 rounded-xl p-6 border border-violet-400/30">
                        <h3 className="text-xl font-bold text-violet-100 mb-4">
                          💫 Cómo Se Vive en Ti
                        </h3>
                        <p className="text-violet-50 text-lg leading-relaxed whitespace-pre-line">
                          {interpretation.capa_2_aplicado.como_se_vive_en_ti}
                        </p>
                      </div>
                    )}

                    {/* Riesgo Si Vives Inconscientemente */}
                    {interpretation.capa_2_aplicado.riesgo_si_vives_inconscientemente && (
                      <div className="bg-gradient-to-br from-rose-900/40 to-red-900/40 rounded-xl p-6 border border-rose-400/30">
                        <h3 className="text-xl font-bold text-rose-100 mb-4">
                          ⚠️ Riesgo Si Vives Inconscientemente
                        </h3>
                        <p className="text-rose-50 leading-relaxed whitespace-pre-line">
                          {interpretation.capa_2_aplicado.riesgo_si_vives_inconscientemente}
                        </p>
                      </div>
                    )}

                    {/* Uso Consciente - Consejo Aplicado */}
                    {interpretation.capa_2_aplicado.uso_consciente_consejo_aplicado && (
                      <div className="bg-gradient-to-br from-emerald-900/40 to-green-900/40 rounded-xl p-6 border border-emerald-400/30">
                        <h3 className="text-xl font-bold text-emerald-100 mb-4">
                          ✅ Uso Consciente - Consejo Aplicado
                        </h3>
                        <p className="text-emerald-50 text-lg leading-relaxed whitespace-pre-line">
                          {interpretation.capa_2_aplicado.uso_consciente_consejo_aplicado}
                        </p>
                      </div>
                    )}

                    {/* Acción Práctica Sugerida */}
                    {interpretation.capa_2_aplicado.accion_practica_sugerida && (
                      <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-xl p-6 border border-blue-400/30">
                        <h3 className="text-xl font-bold text-blue-100 mb-4">
                          🎯 Acción Práctica Sugerida
                        </h3>
                        <p className="text-blue-50 leading-relaxed whitespace-pre-line">
                          {interpretation.capa_2_aplicado.accion_practica_sugerida}
                        </p>
                      </div>
                    )}

                    {/* Síntesis Final */}
                    {interpretation.capa_2_aplicado.sintesis_final && (
                      <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 rounded-xl p-6 border border-amber-400/30">
                        <h3 className="text-xl font-bold text-amber-100 mb-4">
                          ✨ Síntesis Final - Tu Mantra
                        </h3>
                        <p className="text-amber-50 text-xl font-bold italic text-center leading-relaxed">
                          "{interpretation.capa_2_aplicado.sintesis_final}"
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Análisis Técnico (opcional, solo para debug) */}
                {interpretation.analisis_tecnico && (
                  <details className="bg-slate-800/50 rounded-xl p-4 border border-slate-600/30 mt-8">
                    <summary className="text-slate-300 font-semibold cursor-pointer hover:text-white">
                      🔍 Análisis Técnico (Detalles)
                    </summary>
                    <div className="mt-4 space-y-2 text-slate-400 text-sm">
                      <p>Casa Natal: {interpretation.analisis_tecnico.evento_en_casa_natal}</p>
                      <p>Significado: {interpretation.analisis_tecnico.significado_casa}</p>
                      {interpretation.analisis_tecnico.planetas_natales_activados?.length > 0 && (
                        <div>
                          <p className="font-semibold text-slate-300 mt-3">Planetas Activados:</p>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            {interpretation.analisis_tecnico.planetas_natales_activados.map((p: string, i: number) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </details>
                )}

              </div>

              {/* FOOTER */}
              <div className="px-6 py-4 border-t border-purple-400/30 bg-slate-900/50 rounded-b-2xl">
                <div className="flex justify-between items-center">
                  <p className="text-slate-400 text-sm">
                    💫 Interpretación personalizada generada con IA
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
