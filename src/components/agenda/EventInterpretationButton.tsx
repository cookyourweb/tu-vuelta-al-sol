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

      {/* MODAL FULLSCREEN */}
      {showModal && interpretation && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-2xl shadow-2xl border border-purple-500/20 mb-8">
              {/* HEADER */}
              <div className="bg-gradient-to-r from-purple-900/90 to-pink-900/90 px-6 py-4 rounded-t-2xl border-b border-purple-400/30">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                      {interpretation.titulo_evento || 'Interpretación del Evento'}
                    </h2>
                    <p className="text-purple-200 text-sm">
                      {event.date} • Casa {event.house}
                      {event.sign && ` • ${event.sign}`}
                    </p>
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
                {/* Para Ti Específicamente */}
                {interpretation.para_ti_especificamente && (
                  <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-2xl p-6 border border-purple-400/30">
                    <h3 className="text-xl font-bold text-purple-100 mb-4">
                      🌟 Para Ti Específicamente
                    </h3>
                    <p className="text-purple-50 text-lg leading-relaxed whitespace-pre-line">
                      {interpretation.para_ti_especificamente}
                    </p>
                  </div>
                )}

                {/* Tu Fortaleza a Usar */}
                {interpretation.tu_fortaleza_a_usar && (
                  <div className="bg-gradient-to-br from-emerald-900/40 to-green-900/40 rounded-2xl p-6 border border-emerald-400/30">
                    <h3 className="text-xl font-bold text-emerald-100 mb-4">
                      ⚡ Tu Fortaleza a Usar
                    </h3>
                    <h4 className="text-emerald-200 font-semibold text-lg mb-3">
                      {interpretation.tu_fortaleza_a_usar.fortaleza}
                    </h4>
                    <p className="text-emerald-50 leading-relaxed whitespace-pre-line">
                      {interpretation.tu_fortaleza_a_usar.como_usarla}
                    </p>
                  </div>
                )}

                {/* Tu Bloqueo a Trabajar */}
                {interpretation.tu_bloqueo_a_trabajar && (
                  <div className="bg-gradient-to-br from-rose-900/40 to-red-900/40 rounded-2xl p-6 border border-rose-400/30">
                    <h3 className="text-xl font-bold text-rose-100 mb-4">
                      🔥 Tu Bloqueo a Transformar
                    </h3>
                    <h4 className="text-rose-200 font-semibold text-lg mb-3">
                      {interpretation.tu_bloqueo_a_trabajar.bloqueo}
                    </h4>
                    <p className="text-rose-50 leading-relaxed whitespace-pre-line">
                      {interpretation.tu_bloqueo_a_trabajar.reframe}
                    </p>
                  </div>
                )}

                {/* Mantra Personalizado */}
                {interpretation.mantra_personalizado && (
                  <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 rounded-2xl p-6 border border-amber-400/30">
                    <h3 className="text-xl font-bold text-amber-100 mb-4">
                      ✨ Tu Mantra Personalizado
                    </h3>
                    <p className="text-amber-50 text-xl font-bold italic text-center leading-relaxed">
                      "{interpretation.mantra_personalizado}"
                    </p>
                  </div>
                )}

                {/* Ejercicio Para Ti */}
                {interpretation.ejercicio_para_ti && (
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-2xl p-6 border border-blue-400/30">
                    <h3 className="text-xl font-bold text-blue-100 mb-4">
                      📝 Ejercicio Para Ti
                    </h3>
                    <p className="text-blue-50 leading-relaxed whitespace-pre-line">
                      {interpretation.ejercicio_para_ti}
                    </p>
                  </div>
                )}

                {/* Consejo Específico */}
                {interpretation.consejo_especifico && (
                  <div className="bg-gradient-to-br from-violet-900/40 to-purple-900/40 rounded-2xl p-6 border border-violet-400/30">
                    <h3 className="text-xl font-bold text-violet-100 mb-4">
                      💡 Consejo Específico
                    </h3>
                    <p className="text-violet-50 leading-relaxed whitespace-pre-line">
                      {interpretation.consejo_especifico}
                    </p>
                  </div>
                )}

                {/* Timing Evolutivo */}
                {interpretation.timing_evolutivo && (
                  <div className="bg-gradient-to-br from-cyan-900/40 to-teal-900/40 rounded-2xl p-6 border border-cyan-400/30">
                    <h3 className="text-xl font-bold text-cyan-100 mb-6">
                      ⏰ Timing Evolutivo
                    </h3>

                    <div className="space-y-4">
                      {interpretation.timing_evolutivo.que_sembrar && (
                        <div>
                          <h4 className="text-cyan-200 font-semibold mb-2">
                            🌱 Qué Sembrar:
                          </h4>
                          <p className="text-cyan-50 leading-relaxed whitespace-pre-line">
                            {interpretation.timing_evolutivo.que_sembrar}
                          </p>
                        </div>
                      )}

                      {interpretation.timing_evolutivo.cuando_actuar && (
                        <div>
                          <h4 className="text-cyan-200 font-semibold mb-2">
                            ⚡ Cuándo Actuar:
                          </h4>
                          <p className="text-cyan-50 leading-relaxed whitespace-pre-line">
                            {interpretation.timing_evolutivo.cuando_actuar}
                          </p>
                        </div>
                      )}

                      {interpretation.timing_evolutivo.resultado_esperado && (
                        <div>
                          <h4 className="text-cyan-200 font-semibold mb-2">
                            🎯 Resultado Esperado:
                          </h4>
                          <p className="text-cyan-50 leading-relaxed whitespace-pre-line">
                            {interpretation.timing_evolutivo.resultado_esperado}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Análisis Técnico (opcional, solo para admins o debug) */}
                {interpretation.analisis_tecnico && (
                  <details className="bg-slate-800/50 rounded-xl p-4 border border-slate-600/30">
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
