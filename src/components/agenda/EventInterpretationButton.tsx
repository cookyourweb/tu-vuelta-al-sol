'use client';

import { useState, useEffect } from 'react';
import { Sparkles, X, Loader2, AlertCircle, RefreshCw, Download } from 'lucide-react';
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
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [hasExistingInterpretation, setHasExistingInterpretation] = useState(false);

  // ✅ NUEVO: Cargar interpretación automáticamente al montar
  useEffect(() => {
    const loadExistingInterpretation = async () => {
      if (!user) {
        setLoadingInitial(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/interpretations/event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            event,
            regenerate: false
          })
        });

        const data = await response.json();

        if (data.success && data.interpretation) {
          setInterpretation(data.interpretation);
          setHasExistingInterpretation(true);
        }
      } catch (err) {
        console.error('Error cargando interpretación existente:', err);
      } finally {
        setLoadingInitial(false);
      }
    };

    loadExistingInterpretation();
  }, [user, event]);

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
        setHasExistingInterpretation(true);
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

  const handleDownload = () => {
    if (!interpretation) return;

    // Crear contenido de texto para descarga
    let content = `🌙 ${interpretation.titulo_evento || 'Evento Astrológico'}\n`;
    content += `\n📅 ${new Date(event.date).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })}\n`;
    content += `\n${'='.repeat(60)}\n\n`;

    if (interpretation.clima_del_dia && interpretation.clima_del_dia.length > 0) {
      content += `Clima del día: ${interpretation.clima_del_dia.join(' · ')}\n\n`;
    }

    if (interpretation.energias_activas && interpretation.energias_activas.length > 0) {
      content += `Energías activas este año: ${interpretation.energias_activas.join(' · ')}\n\n`;
    }

    if (interpretation.mensaje_sintesis) {
      content += `🔥 PRIORIDAD CRÍTICA\n`;
      content += `${interpretation.mensaje_sintesis}\n\n`;
      content += `${'='.repeat(60)}\n\n`;
    }

    if (interpretation.como_te_afecta) {
      content += `🧠 ¿CÓMO TE AFECTA A TI?\n`;
      content += `(personalizado a tu carta y a tu año)\n\n`;
      content += `${interpretation.como_te_afecta}\n\n`;
      content += `${'='.repeat(60)}\n\n`;
    }

    if (interpretation.interpretacion_practica && interpretation.interpretacion_practica.length > 0) {
      content += `⚙️ INTERPRETACIÓN PRÁCTICA DEL MOMENTO\n`;
      content += `(cruce real de energías, como lo haría un astrólogo)\n\n`;
      interpretation.interpretacion_practica.forEach((item: any) => {
        content += `${item.planeta} activo: ${item.que_pide}\n`;
      });
      if (interpretation.sintesis_practica) {
        content += `\n${interpretation.sintesis_practica}\n`;
      }
      content += `\n${'='.repeat(60)}\n\n`;
    }

    if (interpretation.acciones_concretas && interpretation.acciones_concretas.length > 0) {
      content += `✅ ACCIONES CONCRETAS PARA HOY\n\n`;
      interpretation.acciones_concretas.forEach((accion: string, i: number) => {
        content += `${i + 1}. ${accion}\n`;
      });
      content += `\n${'='.repeat(60)}\n\n`;
    }

    if (interpretation.preguntas_reflexion && interpretation.preguntas_reflexion.length > 0) {
      content += `🤔 PREGUNTAS PARA REFLEXIONAR\n\n`;
      interpretation.preguntas_reflexion.forEach((pregunta: string, i: number) => {
        content += `${i + 1}. ${pregunta}\n`;
      });
      content += `\n${'='.repeat(60)}\n\n`;
    }

    if (interpretation.perspectiva_evolutiva) {
      content += `🌱 PERSPECTIVA EVOLUTIVA\n\n`;
      content += `${interpretation.perspectiva_evolutiva}\n\n`;
    }

    content += `\n\n---\nGenerado por Tu Vuelta al Sol\nwww.tuvueltaalsol.es\n`;

    // Crear blob y descargar
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interpretacion-${new Date(event.date).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* BOTÓN */}
      <button
        onClick={() => hasExistingInterpretation ? setShowModal(true) : handleGenerateInterpretation(false)}
        disabled={loading || loadingInitial}
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
        {loadingInitial ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Verificando...
          </>
        ) : loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generando...
          </>
        ) : hasExistingInterpretation ? (
          <>
            <Sparkles className="w-4 h-4" />
            Ver Interpretación
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generar Interpretación Personalizada
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
        <div className="fixed inset-0 z-[250] bg-black/90 backdrop-blur-sm overflow-y-auto">
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
                    {/* Descargar */}
                    <button
                      onClick={handleDownload}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Descargar interpretación"
                    >
                      <Download className="w-5 h-5 text-purple-200" />
                    </button>

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

              {/* CONTENT - FORMATO AGENDA FÍSICA */}
              <div className="p-6 md:p-8 space-y-6">

                {/* 🔥 MENSAJE DE SÍNTESIS */}
                {interpretation.mensaje_sintesis && (
                  <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-l-4 border-red-400 rounded-r-xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🔥</span>
                      <h2 className="text-lg font-bold text-red-200">PRIORIDAD CRÍTICA</h2>
                    </div>
                    <p className="text-white text-lg leading-relaxed whitespace-pre-line">
                      {interpretation.mensaje_sintesis}
                    </p>
                  </div>
                )}

                {/* 🧠 ¿CÓMO TE AFECTA A TI? */}
                {interpretation.como_te_afecta && (
                  <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-2xl p-6 border border-purple-400/20">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">🧠</span>
                      <h2 className="text-xl font-bold text-purple-100">¿CÓMO TE AFECTA A TI?</h2>
                    </div>
                    <p className="text-gray-100 text-sm text-purple-300 mb-3">(personalizado a tu carta y a tu año)</p>
                    <div className="text-white text-base leading-relaxed whitespace-pre-line">
                      {interpretation.como_te_afecta}
                    </div>
                  </div>
                )}

                {/* ⚙️ INTERPRETACIÓN PRÁCTICA DEL MOMENTO */}
                {interpretation.interpretacion_practica && interpretation.interpretacion_practica.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-2xl p-6 border border-blue-400/20">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">⚙️</span>
                      <h2 className="text-xl font-bold text-blue-100">INTERPRETACIÓN PRÁCTICA DEL MOMENTO</h2>
                    </div>
                    <p className="text-gray-100 text-sm text-blue-300 mb-4">(cruce real de energías, como lo haría un astrólogo)</p>
                    <div className="space-y-3">
                      {interpretation.interpretacion_practica.map((item: any, index: number) => (
                        <div key={index} className="text-white">
                          <span className="font-semibold text-blue-200">{item.planeta} activo:</span>{' '}
                          <span className="text-gray-100">{item.que_pide}</span>
                        </div>
                      ))}
                    </div>
                    {interpretation.sintesis_practica && (
                      <p className="mt-4 text-white italic border-t border-blue-400/30 pt-4">
                        {interpretation.sintesis_practica}
                      </p>
                    )}
                  </div>
                )}

                {/* ✍️ ACCIÓN CONCRETA PARA HOY */}
                {interpretation.accion_concreta && (
                  <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border border-green-400/20">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">✍️</span>
                      <h2 className="text-xl font-bold text-green-100">ACCIÓN CONCRETA PARA HOY</h2>
                    </div>
                    <p className="text-gray-100 text-sm text-green-300 mb-4">(esto es lo que la agenda te pide hacer)</p>
                    {interpretation.accion_concreta.titulo && (
                      <h3 className="text-green-200 font-semibold mb-3">{interpretation.accion_concreta.titulo}:</h3>
                    )}
                    {interpretation.accion_concreta.pasos && interpretation.accion_concreta.pasos.length > 0 && (
                      <ol className="space-y-3 list-decimal list-inside text-white">
                        {interpretation.accion_concreta.pasos.map((paso: string, index: number) => (
                          <li key={index} className="leading-relaxed">
                            {paso}
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                )}

                {/* ⚠️ SOMBRA A EVITAR HOY */}
                {interpretation.sombra_a_evitar && interpretation.sombra_a_evitar.length > 0 && (
                  <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-2xl p-6 border border-orange-400/20">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">⚠️</span>
                      <h2 className="text-xl font-bold text-orange-100">SOMBRA A EVITAR HOY</h2>
                    </div>
                    <ul className="space-y-2 text-white mb-4">
                      {interpretation.sombra_a_evitar.map((sombra: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-orange-400 mt-1">•</span>
                          <span>{sombra}</span>
                        </li>
                      ))}
                    </ul>
                    {interpretation.explicacion_sombra && (
                      <div className="border-t border-orange-400/30 pt-4">
                        <p className="text-orange-100">
                          <span className="text-orange-200 font-semibold">👉</span> {interpretation.explicacion_sombra}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 🌟 FRASE ANCLA DEL DÍA */}
                {interpretation.frase_ancla && (
                  <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 rounded-2xl p-8 border border-yellow-400/20 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-3xl">🌟</span>
                      <h2 className="text-xl font-bold text-yellow-100">FRASE ANCLA DEL DÍA</h2>
                    </div>
                    <p className="text-white text-2xl font-bold italic">
                      "{interpretation.frase_ancla}"
                    </p>
                  </div>
                )}

                {/* 🔮 APOYO ENERGÉTICO (OPCIONAL) */}
                {interpretation.apoyo_energetico && interpretation.apoyo_energetico.length > 0 && (
                  <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 rounded-2xl p-6 border border-violet-400/20">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">🔮</span>
                      <h2 className="text-xl font-bold text-violet-100">APOYO ENERGÉTICO (OPCIONAL)</h2>
                    </div>
                    <p className="text-gray-100 text-sm text-violet-300 mb-4">(herramientas que amplifican la intención)</p>
                    <div className="space-y-3">
                      {interpretation.apoyo_energetico.map((apoyo: any, index: number) => (
                        <div key={index} className="flex items-start gap-3 text-white">
                          <span className="text-xl">{apoyo.tipo}</span>
                          <div>
                            <span className="font-semibold text-violet-200">{apoyo.elemento}</span>
                            <span className="text-gray-300"> → {apoyo.proposito}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {interpretation.nota_apoyo && (
                      <p className="mt-4 text-violet-200 italic border-t border-violet-400/30 pt-4">
                        {interpretation.nota_apoyo}
                      </p>
                    )}
                  </div>
                )}

                {/* 📌 CIERRE DEL DÍA */}
                {interpretation.cierre_dia && (
                  <div className="bg-gradient-to-r from-pink-900/30 to-rose-900/30 rounded-2xl p-6 border border-pink-400/20">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">📌</span>
                      <h2 className="text-xl font-bold text-pink-100">CIERRE DEL DÍA</h2>
                    </div>
                    <p className="text-white text-lg leading-relaxed whitespace-pre-line">
                      {interpretation.cierre_dia}
                    </p>
                  </div>
                )}

                {/* 🔍 Análisis Técnico (opcional, colapsable) */}
                {interpretation.analisis_tecnico && (
                  <details className="bg-slate-800/50 rounded-xl p-4 border border-slate-600/30">
                    <summary className="text-slate-300 font-semibold cursor-pointer hover:text-white flex items-center gap-2">
                      <span className="text-lg">🔍</span>
                      Análisis Técnico (Detalles)
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
