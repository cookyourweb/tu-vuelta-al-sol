// src/components/astrology/InterpretationButton.tsx en local
// COMPONENTE REUTILIZABLE PARA INTERPRETACIONES - CON CACHÉ INTELIGENTE Y PROMPT DISRUPTIVO

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Brain, Sparkles, RefreshCw, Eye, X, Star, Target, Zap, Copy, Check, Download, Clock, TrendingUp } from 'lucide-react';
import Button from '@/components/ui/Button';

interface InterpretationButtonProps {
  type: 'natal' | 'progressed' | 'solar-return';
  userId: string;
  chartData: any;
  natalChart?: any;
  userProfile: {
    name: string;
    age: number;
    birthPlace: string;
    birthDate: string;
    birthTime: string;
  };
  natalInterpretation?: any;
  className?: string;
  isAdmin?: boolean;
}

interface InterpretationData {
  interpretation: any;
  cached: boolean;
  generatedAt: string;
  method: string;
}

interface SavedInterpretation {
  _id: string;
  interpretation: any;
  generatedAt: string;
  chartType: string;
  userProfile: any;
  isActive: boolean;
}

const InterpretationButton: React.FC<InterpretationButtonProps> = ({
  type,
  userId,
  chartData,
  natalChart,
  userProfile,
  natalInterpretation,
  className = "",
  isAdmin = false
}) => {
  const [interpretation, setInterpretation] = useState<InterpretationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingCache, setCheckingCache] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedInterpretations, setSavedInterpretations] = useState<SavedInterpretation[]>([]);
  const [hasRecentInterpretation, setHasRecentInterpretation] = useState(false);

  // ✅ ADD THESE NEW STATES
  const [regenerating, setRegenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  const [waitTime, setWaitTime] = useState(0);
  const [generationStartTime, setGenerationStartTime] = useState<number | null>(null);
  const [chunkProgress, setChunkProgress] = useState(0);
  const [currentChunk, setCurrentChunk] = useState('');

  const modalContentRef = useRef<HTMLDivElement>(null);

  // ✅ ADD WAIT TIME COUNTER EFFECT
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (regenerating && generationStartTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - generationStartTime) / 1000);
        setWaitTime(elapsed);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [regenerating, generationStartTime]);

  const isNatal = type === 'natal';
  const isSolarReturn = type === 'solar-return';

  // ✅ NEW: Use complete interpretation endpoint for natal charts
  const endpoint = isNatal ? '/api/astrology/interpret-natal-complete' :
                isSolarReturn ? '/api/astrology/interpret-solar-return' :
                '/api/astrology/interpret-progressed';

  // ✅ Keep old endpoint for backwards compatibility
  const legacyEndpoint = '/api/astrology/interpret-natal';

  useEffect(() => {
    if (userId) {
      loadSavedInterpretations();
    }
  }, [userId, type]);

  const loadSavedInterpretations = async () => {
    setCheckingCache(true);
    try {
      console.log(`🔍 ===== CARGANDO INTERPRETACIONES GUARDADAS =====`);
      console.log(`🔍 userId: ${userId}, type: ${type}`);

      // ✅ NEW: Use complete endpoint for natal type
      const fetchUrl = isNatal
        ? `${endpoint}?userId=${userId}`
        : `/api/interpretations/save?userId=${userId}&chartType=${type}`;

      console.log(`🔍 Fetching from: ${fetchUrl}`);

      const response = await fetch(fetchUrl);

      console.log(`📡 Respuesta API: ${response.status}`);

      if (!response.ok) {
        // 404 = No interpretation found (normal on first load)
        if (response.status === 404) {
          console.log('ℹ️ No hay interpretación guardada aún (primera vez)');
          setSavedInterpretations([]);
          setHasRecentInterpretation(false);
          return;
        }

        console.error(`❌ Error en respuesta API: ${response.status}`);
        setSavedInterpretations([]);
        setHasRecentInterpretation(false);
        return;
      }

      const data = await response.json();
      console.log(`📦 Datos completos recibidos:`, data);

      // ✅ HANDLE SINGLE INTERPRETATION RESPONSE (not array!)
      if (data.success && data.interpretation) {
        const generatedTime = new Date(data.generatedAt).getTime();
        const now = new Date().getTime();
        const hoursDiff = (now - generatedTime) / (1000 * 60 * 60);

        console.log(`⏰ Interpretación encontrada: ${hoursDiff.toFixed(1)}h atrás`);

        const isRecent = hoursDiff < 24;
        setHasRecentInterpretation(isRecent);

        // ✅ Convert single interpretation to array format for compatibility
        const singleInterpretation = {
          _id: 'current',
          interpretation: data.interpretation,
          generatedAt: data.generatedAt,
          chartType: type,
          userProfile: userProfile,
          isActive: true
        };

        setSavedInterpretations([singleInterpretation]);

        if (isRecent) {
          // ✅ LOAD INTERPRETATION FROM CACHE
          const cachedInterpretation = {
            interpretation: data.interpretation,
            cached: true,
            generatedAt: data.generatedAt,
            method: data.method || 'cached'
          };

          console.log(`✅ ===== CARGANDO DESDE CACHÉ =====`);
          console.log(`✅ Interpretación ${type} encontrada (${hoursDiff.toFixed(1)}h ago)`);

          // ✅ FIX: Check correct field names based on type
          if (type === 'solar-return') {
            console.log(`✅ Esencia revolucionaria anual:`,
              data.interpretation.esencia_revolucionaria_anual?.substring(0, 100) || 'NOT FOUND');
            console.log(`✅ Propósito de vida anual:`,
              data.interpretation.proposito_vida_anual?.substring(0, 100) || 'NOT FOUND');

            // ✅ VALIDATE: If fields are undefined, don't use cache
            if (!data.interpretation.esencia_revolucionaria_anual ||
                !data.interpretation.proposito_vida_anual) {
              console.warn('⚠️ Cached interpretation has incorrect structure, will regenerate');
              setHasRecentInterpretation(false);
              setSavedInterpretations([]);
              return; // Don't load broken cache
            }
          } else {
            console.log(`✅ Esencia revolucionaria:`,
              data.interpretation.esencia_revolucionaria?.substring(0, 100) || 'NOT FOUND');
            console.log(`✅ Propósito de vida:`,
              data.interpretation.proposito_vida?.substring(0, 100) || 'NOT FOUND');
          }

          setInterpretation(cachedInterpretation);
          console.log(`✅ Interpretación ${type} cargada desde caché exitosamente`);
        } else {
          console.log(`⚠️ ===== INTERPRETACIÓN EXPIRADA =====`);
          console.log(`⚠️ Interpretación ${type} expirada (${hoursDiff.toFixed(1)}h ago) - se generará nueva`);
        }
      } else {
        console.log(`ℹ️ No hay interpretaciones guardadas para ${type}`);
        setSavedInterpretations([]);
        setHasRecentInterpretation(false);
      }
    } catch (error) {
      console.error('❌ Error cargando interpretaciones guardadas:', error);
      setSavedInterpretations([]);
      setHasRecentInterpretation(false);
    } finally {
      setCheckingCache(false);
    }
  };

  const generateInterpretation = async (forceRegenerate = false) => {
    // ✅ If has recent interpretation and NOT force regenerating, just show modal
    if (hasRecentInterpretation && interpretation && !forceRegenerate) {
      console.log('🔄 ===== USANDO INTERPRETACIÓN EXISTENTE =====');
      console.log('🔄 Usando interpretación existente para evitar gasto de créditos');
      setShowModal(true);
      return;
    }

    if (!userId || !chartData) {
      console.log('❌ ===== ERROR: DATOS INSUFICIENTES =====');
      console.log('❌ userId:', userId);
      console.log('❌ chartData:', !!chartData);
      setError('Datos insuficientes para generar interpretación');
      return;
    }

    // ✅ Use regenerating state for force regenerate
    if (forceRegenerate) {
      setRegenerating(true);
      setGenerationProgress('Iniciando regeneración revolucionaria...');
      setGenerationStartTime(Date.now());
      setChunkProgress(0);
      setCurrentChunk('');
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      console.log(`🤖 ===== GENERANDO NUEVA INTERPRETACIÓN =====`);
      console.log(`🤖 Tipo: ${type}, Forzada: ${forceRegenerate}`);
      console.log(`🤖 userId: ${userId}`);
      console.log(`🤖 userProfile:`, userProfile);

      // ✅ SINGLE REQUEST - Use new complete endpoint for natal
      {
        // ✅ Simulate progress messages
        if (forceRegenerate) {
          setTimeout(() => setGenerationProgress('Conectando con los astros...'), 500);
          setTimeout(() => setGenerationProgress('Analizando tu carta natal...'), 2000);
          setTimeout(() => setGenerationProgress('Calculando posiciones planetarias...'), 4000);
          setTimeout(() => setGenerationProgress('Generando interpretación disruptiva con IA...'), 6000);
          setTimeout(() => setGenerationProgress('Casi listo... Creando tu revolución personal...'), 10000);
        }

        // ✅ NEW: Different request body structure for complete natal interpretation
        const requestBody = isNatal
          ? {
              userId,
              chartData: chartData, // ✅ Changed from natalChart to chartData
              userProfile,
              regenerate: forceRegenerate,
              useChunked: true, // ✅ Use chunked generation for more reliable results
            }
          : isSolarReturn
          ? {
              userId,
              natalChart: natalChart || {},
              solarReturnChart: chartData,
              userProfile,
              regenerate: forceRegenerate
            }
          : {
              userId,
              progressedChart: chartData,
              natalChart: natalChart || {},
              userProfile,
              natalInterpretation,
              regenerate: forceRegenerate,
              disruptiveMode: true
            };

        console.log(`📦 Request body:`, {
          userId: requestBody.userId,
          userProfileName: (requestBody as any).userProfile?.name,
          userProfileAge: (requestBody as any).userProfile?.age,
          hasSolarReturnChart: !!(requestBody as any).solarReturnChart,
          hasNatalChart: !!(requestBody as any).natalChart
        });

        // ✅ Procesar respuesta con progreso simulado
        let progressPercentage = 0;
        const progressInterval = setInterval(() => {
          if (progressPercentage < 95) {
            progressPercentage += 1;

            // Actualizar mensaje según progreso
            if (progressPercentage < 10) {
              setGenerationProgress('🌟 Iniciando generación de interpretaciones...');
            } else if (progressPercentage < 20) {
              setGenerationProgress('✨ Generando Ascendente y Medio Cielo...');
            } else if (progressPercentage < 50) {
              setGenerationProgress('🪐 Interpretando planetas principales...');
            } else if (progressPercentage < 70) {
              setGenerationProgress('🌙 Generando nodos lunares y asteroides...');
            } else if (progressPercentage < 90) {
              setGenerationProgress('🔥 Analizando elementos y modalidades...');
            } else {
              setGenerationProgress('🔗 Procesando aspectos planetarios...');
            }
          }
        }, 5000); // Cada 5 segundos

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        console.log(`📡 Response status: ${response.status}`);

        if (!response.ok) {
          clearInterval(progressInterval);
          const errorText = await response.text();
          console.error(`❌ API Error Response:`, errorText);
          throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const result = await response.json();

        // Completar al 100%
        clearInterval(progressInterval);
        setGenerationProgress('✨ ¡Interpretaciones completadas! 🎉');

        if (result.success) {
          console.log('📺 ===== PROCESANDO RESPUESTA DE INTERPRETACIÓN =====');

          // ✅ NEW: Handle both old and new response structures
          const rawInterpretation = result.interpretation || result.data?.interpretation;

          if (!rawInterpretation) {
            console.log('❌ No se encontró interpretación en la respuesta');
            throw new Error('No se encontró interpretación en la respuesta');
          }

          console.log('🔍 ===== DATOS RECIBIDOS =====');
          console.log('🔍 Claves en rawInterpretation:', Object.keys(rawInterpretation));

          // ✅ AÑADIR LOGS PARA VERIFICAR DATOS COMPLETOS
          console.log('🔍 ===== VERIFICANDO DATOS COMPLETOS =====');
          console.log('🔍 esencia_revolucionaria:', rawInterpretation.esencia_revolucionaria ? 'SÍ' : 'NO');
          console.log('🔍 proposito_vida:', rawInterpretation.proposito_vida ? 'SÍ' : 'NO');
          console.log('🔍 interpretaciones:', rawInterpretation.interpretaciones ? 'SÍ' : 'NO');
          console.log('🔍 sintesis_elemental:', rawInterpretation.sintesis_elemental ? 'SÍ' : 'NO');

          // Si están, mostrar un preview
          if (rawInterpretation.esencia_revolucionaria) {
            console.log('📖 esencia_revolucionaria preview:', rawInterpretation.esencia_revolucionaria.substring(0, 100));
          }

          let interpretationData;

          if (type === 'natal') {
            // ✅ NEW: Map new complete interpretation structure
            interpretationData = {
              // Core sections
              esencia_revolucionaria: rawInterpretation.esencia_revolucionaria,
              proposito_vida: rawInterpretation.proposito_vida,
              declaracion_poder: rawInterpretation.declaracion_poder,
              declaracion_poder_final: rawInterpretation.declaracion_poder_final,
              mantra_personal: rawInterpretation.mantra_personal,

              // New complete sections
              puntos_fundamentales: rawInterpretation.puntos_fundamentales,
              sintesis_elemental: rawInterpretation.sintesis_elemental,
              modalidades: rawInterpretation.modalidades,
              interpretaciones_planetarias: rawInterpretation.interpretaciones_planetarias, // NEW structure
              aspectos_destacados: rawInterpretation.aspectos_destacados, // NEW
              integracion_carta: rawInterpretation.integracion_carta, // NEW
              fortalezas_educativas: rawInterpretation.fortalezas_educativas,
              areas_especializacion: rawInterpretation.areas_especializacion,
              patrones_sanacion: rawInterpretation.patrones_sanacion,
              manifestacion_amor: rawInterpretation.manifestacion_amor,
              visualizacion: rawInterpretation.visualizacion,
              visualizacion_guiada: rawInterpretation.visualizacion_guiada, // Alternative field name
              datos_para_agenda: rawInterpretation.datos_para_agenda,

              // Backwards compatibility with old structure
              interpretaciones: rawInterpretation.interpretaciones, // OLD structure (for backwards compat)
              formacion_temprana: rawInterpretation.formacion_temprana,
              patrones_psicologicos: rawInterpretation.patrones_psicologicos,
              planetas_profundos: rawInterpretation.planetas_profundos,
              nodos_lunares: rawInterpretation.nodos_lunares,
              planetas: rawInterpretation.planetas,
              plan_accion: rawInterpretation.plan_accion,
              advertencias: rawInterpretation.advertencias,
              insights_transformacionales: rawInterpretation.insights_transformacionales,
              rituales_recomendados: rawInterpretation.rituales_recomendados,
            };
          } else if (type === 'solar-return') {
            interpretationData = {
              esencia_revolucionaria: rawInterpretation.esencia_revolucionaria_anual,
              proposito_vida: rawInterpretation.proposito_vida_anual,
              tema_anual: rawInterpretation.tema_central_del_anio,
              analisis_tecnico: rawInterpretation.analisis_tecnico_profesional,
              plan_accion: rawInterpretation.plan_accion,
              calendario_lunar: rawInterpretation.calendario_lunar_anual,
              declaracion_poder: rawInterpretation.declaracion_poder_anual,
              advertencias: rawInterpretation.advertencias,
              eventos_clave: rawInterpretation.eventos_clave_del_anio,
              insights_transformacionales: rawInterpretation.insights_transformacionales,
              rituales_recomendados: rawInterpretation.rituales_recomendados,
              integracion_final: rawInterpretation.integracion_final
            };
          } else {
            interpretationData = rawInterpretation;
          }

          const newInterpretation = {
            interpretation: interpretationData,
            cached: result.cached || result.data?.cached || false,
            generatedAt: result.generatedAt || result.data?.generatedAt || new Date().toISOString(),
            method: result.method || result.data?.method || 'api'
          };

          console.log('✅ ===== INTERPRETACIÓN PROCESADA EXITOSAMENTE =====');

          setInterpretation(newInterpretation);
          setHasRecentInterpretation(true);

          // ✅ Only show modal after regeneration is complete
          if (forceRegenerate) {
            setGenerationProgress('¡Revolución completada! 🎉');
            await new Promise(resolve => setTimeout(resolve, 1000));
            setShowModal(true);
          } else {
            setShowModal(true);
          }

          await autoSaveInterpretation(newInterpretation);

          console.log('✅ ===== INTERPRETACIÓN COMPLETADA =====');
        } else {
          throw new Error(result.error || 'Error desconocido');
        }
      }

    } catch (err) {
      console.error('❌ ===== ERROR EN GENERATEINTERPRETATION =====');
      console.error('❌ Error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
      setRegenerating(false);
      setGenerationProgress('');
      setGenerationStartTime(null);
      setWaitTime(0);
      setChunkProgress(0);
      setCurrentChunk('');
    }
  };

  const autoSaveInterpretation = async (interpretationData: InterpretationData) => {
    try {
      // ✅ NEW: Skip saving for natal type - the complete endpoint already saves to MongoDB
      if (isNatal) {
        console.log('💾 ===== NATAL: Ya guardado por endpoint completo =====');
        console.log('💾 Skipping duplicate save for natal type');
        return;
      }

      console.log('💾 ===== GUARDANDO INTERPRETACIÓN EN MONGODB =====');
      console.log('💾 userId:', userId);
      console.log('💾 chartType:', type);
      console.log('💾 generatedAt:', interpretationData.generatedAt);

      const saveData = {
        userId,
        chartType: type,
        interpretation: interpretationData.interpretation,
        userProfile,
        generatedAt: interpretationData.generatedAt || new Date().toISOString()
      };

      console.log('💾 Datos a enviar:', {
        userId: saveData.userId,
        chartType: saveData.chartType,
        interpretationKeys: Object.keys(saveData.interpretation),
        generatedAt: saveData.generatedAt
      });

      const response = await fetch('/api/interpretations/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ ===== INTERPRETACIÓN GUARDADA =====');
        console.log('✅ Respuesta MongoDB:', data);
        console.log('✅ ID guardado:', data.interpretationId);

        // ✅ FIX: Esperar para que MongoDB actualice índices
        console.log('⏳ Esperando 1s para actualización de índices...');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // ✅ FIX: Recargar usando chartType (más confiable que ID)
        console.log('🔄 Recargando interpretación desde BD...');

        const getResponse = await fetch(`/api/interpretations/save?userId=${userId}&chartType=${type}`);

        if (getResponse.ok) {
          const savedData = await getResponse.json();
          console.log('✅ Interpretación recargada exitosamente');
          console.log('✅ Datos actualizados:', {
            hasInterpretation: !!savedData.interpretation,
            generatedAt: savedData.generatedAt
          });
        } else {
          console.warn('⚠️ No se pudo recargar interpretación, pero está guardada');
        }
      } else {
        console.error('❌ ===== ERROR GUARDANDO EN MONGODB =====');
        console.error('❌ Status:', response.status);
        const errorText = await response.text();
        console.error('❌ Error:', errorText);
      }
    } catch (error) {
      console.error('❌ ===== ERROR EN AUTOSAVE =====');
      console.error('❌ Error:', error);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!modalContentRef.current) return;

    try {
      const textContent = modalContentRef.current.innerText;
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copiando:', error);
    }
  };

  const handleDownloadText = () => {
    if (!modalContentRef.current) return;

    const textContent = modalContentRef.current.innerText;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `interpretacion-${type}-${userProfile.name}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const loadSpecificInterpretation = (savedInterp: SavedInterpretation) => {
    setInterpretation({
      interpretation: savedInterp.interpretation,
      cached: true,
      generatedAt: savedInterp.generatedAt,
      method: 'historical'
    });
    setShowModal(true);
  };

  const getTimeSinceGeneration = (generatedAt: string) => {
    const now = new Date();
    const generated = new Date(generatedAt);
    const diffMs = now.getTime() - generated.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `hace ${diffHours}h ${diffMinutes}m`;
    }
    return `hace ${diffMinutes}m`;
  };

  const renderInterpretationContent = () => {
    if (!interpretation?.interpretation) {
      return null;
    }

    const data = interpretation.interpretation;

    return (
      <div className="space-y-8">
        {data.esencia_revolucionaria && (
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-2xl p-8 border border-purple-400/30">
            <h4 className="text-purple-100 font-bold text-xl mb-4 flex items-center gap-3">
              <Star className="w-8 h-8 text-purple-300" />
              Tu Esencia Revolucionaria
            </h4>
            <p className="text-purple-50 text-lg leading-relaxed font-medium">{data.esencia_revolucionaria}</p>
          </div>
        )}

        {data.proposito_vida && (
          <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-2xl p-8 border border-blue-400/30">
            <h4 className="text-blue-100 font-bold text-xl mb-4 flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-300" />
              Tu Propósito de Vida
            </h4>
            {typeof data.proposito_vida === 'string' ? (
              <p className="text-blue-50 text-lg leading-relaxed font-medium">{data.proposito_vida}</p>
            ) : (
              <div className="space-y-4">
                {data.proposito_vida.nodo_norte && (
                  <div className="bg-blue-800/30 rounded-lg p-4">
                    <h5 className="text-blue-200 font-semibold mb-2">⬆️ Nodo Norte: {data.proposito_vida.nodo_norte.signo} Casa {data.proposito_vida.nodo_norte.casa}</h5>
                    <p className="text-blue-50">{data.proposito_vida.nodo_norte.mision}</p>
                    {data.proposito_vida.nodo_norte.habilidades_activar && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {data.proposito_vida.nodo_norte.habilidades_activar.map((h: string, i: number) => (
                          <span key={i} className="bg-blue-600/40 text-blue-100 px-2 py-1 rounded-full text-xs">{h}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {data.proposito_vida.nodo_sur && (
                  <div className="bg-orange-800/30 rounded-lg p-4">
                    <h5 className="text-orange-200 font-semibold mb-2">⬇️ Nodo Sur: {data.proposito_vida.nodo_sur.signo} Casa {data.proposito_vida.nodo_sur.casa}</h5>
                    <p className="text-orange-50">{data.proposito_vida.nodo_sur.zona_confort}</p>
                    {data.proposito_vida.nodo_sur.patrones_soltar && (
                      <div className="mt-2">
                        <p className="text-orange-200 text-sm font-semibold mb-1">Patrones a soltar:</p>
                        <ul className="list-disc list-inside text-orange-50 text-sm">
                          {data.proposito_vida.nodo_sur.patrones_soltar.map((p: string, i: number) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                {data.proposito_vida.salto_evolutivo && (
                  <div className="bg-gradient-to-r from-purple-800/40 to-pink-800/40 rounded-lg p-4">
                    <h5 className="text-purple-200 font-semibold mb-2">🚀 Salto Evolutivo</h5>
                    <p className="text-purple-50">
                      <span className="text-red-300">DE:</span> {data.proposito_vida.salto_evolutivo.de}
                    </p>
                    <p className="text-purple-50">
                      <span className="text-green-300">A:</span> {data.proposito_vida.salto_evolutivo.a}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ✅ NUEVA SECCIÓN: SÍNTESIS ELEMENTAL */}
        {data.sintesis_elemental && (
          <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 rounded-2xl p-8 border border-amber-400/30">
            <h4 className="text-amber-100 font-bold text-xl mb-6 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-amber-300" />
              Síntesis Elemental - Tu Alquimia Interior
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {data.sintesis_elemental.fuego && (
                <div className="bg-red-900/40 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-red-200 font-bold text-lg">{data.sintesis_elemental.fuego.porcentaje}%</div>
                  <div className="text-red-300 text-sm">Fuego</div>
                  {data.sintesis_elemental.fuego.planetas && (
                    <div className="text-red-400 text-xs mt-1">{data.sintesis_elemental.fuego.planetas.join(', ')}</div>
                  )}
                </div>
              )}
              {data.sintesis_elemental.tierra && (
                <div className="bg-green-900/40 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🌍</div>
                  <div className="text-green-200 font-bold text-lg">{data.sintesis_elemental.tierra.porcentaje}%</div>
                  <div className="text-green-300 text-sm">Tierra</div>
                  {data.sintesis_elemental.tierra.planetas && (
                    <div className="text-green-400 text-xs mt-1">{data.sintesis_elemental.tierra.planetas.join(', ')}</div>
                  )}
                </div>
              )}
              {data.sintesis_elemental.aire && (
                <div className="bg-cyan-900/40 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">💨</div>
                  <div className="text-cyan-200 font-bold text-lg">{data.sintesis_elemental.aire.porcentaje}%</div>
                  <div className="text-cyan-300 text-sm">Aire</div>
                  {data.sintesis_elemental.aire.planetas && (
                    <div className="text-cyan-400 text-xs mt-1">{data.sintesis_elemental.aire.planetas.join(', ')}</div>
                  )}
                </div>
              )}
              {data.sintesis_elemental.agua && (
                <div className="bg-blue-900/40 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">💧</div>
                  <div className="text-blue-200 font-bold text-lg">{data.sintesis_elemental.agua.porcentaje}%</div>
                  <div className="text-blue-300 text-sm">Agua</div>
                  {data.sintesis_elemental.agua.planetas && (
                    <div className="text-blue-400 text-xs mt-1">{data.sintesis_elemental.agua.planetas.join(', ')}</div>
                  )}
                </div>
              )}
            </div>
            {data.sintesis_elemental.configuracion_alquimica && (
              <div className="bg-amber-800/30 rounded-lg p-4">
                <p className="text-amber-50 leading-relaxed">{data.sintesis_elemental.configuracion_alquimica}</p>
              </div>
            )}
          </div>
        )}

        {/* ✅ NUEVA SECCIÓN: MODALIDADES */}
        {data.modalidades && (
          <div className="bg-gradient-to-br from-violet-900/40 to-indigo-900/40 rounded-2xl p-8 border border-violet-400/30">
            <h4 className="text-violet-100 font-bold text-xl mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-violet-300" />
              Tu Ritmo de Acción - Modalidades
            </h4>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {data.modalidades.cardinal && (
                <div className="bg-red-900/30 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🚀</div>
                  <div className="text-red-200 font-bold text-lg">{data.modalidades.cardinal.porcentaje}%</div>
                  <div className="text-red-300 text-sm">Cardinal</div>
                  <p className="text-red-400 text-xs mt-2">{data.modalidades.cardinal.significado}</p>
                </div>
              )}
              {data.modalidades.fijo && (
                <div className="bg-amber-900/30 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🗿</div>
                  <div className="text-amber-200 font-bold text-lg">{data.modalidades.fijo.porcentaje}%</div>
                  <div className="text-amber-300 text-sm">Fijo</div>
                  <p className="text-amber-400 text-xs mt-2">{data.modalidades.fijo.significado}</p>
                </div>
              )}
              {data.modalidades.mutable && (
                <div className="bg-cyan-900/30 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🌊</div>
                  <div className="text-cyan-200 font-bold text-lg">{data.modalidades.mutable.porcentaje}%</div>
                  <div className="text-cyan-300 text-sm">Mutable</div>
                  <p className="text-cyan-400 text-xs mt-2">{data.modalidades.mutable.significado}</p>
                </div>
              )}
            </div>
            {data.modalidades.ritmo_accion && (
              <div className="bg-violet-800/30 rounded-lg p-4">
                <p className="text-violet-50 leading-relaxed">{data.modalidades.ritmo_accion}</p>
              </div>
            )}
          </div>
        )}

        {/* ✅ NUEVA SECCIÓN: INTERPRETACIONES PLANETARIAS COMPLETAS */}
        {data.interpretaciones_planetarias && (
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white text-center mb-8">
              🪐 Interpretaciones Planetarias Completas
            </h3>

            {/* SOL */}
            {data.interpretaciones_planetarias.sol && (
              <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-xl p-6 border border-yellow-400/20">
                <div className="mb-4">
                  <h4 className="text-yellow-100 font-bold text-2xl mb-2">☀️ Sol</h4>
                  <p className="text-yellow-300 text-sm mb-3">{data.interpretaciones_planetarias.sol.posicion}</p>
                  {data.interpretaciones_planetarias.sol.titulo_arquetipo && (
                    <p className="text-yellow-50 text-xl font-bold italic">✨ {data.interpretaciones_planetarias.sol.titulo_arquetipo}</p>
                  )}
                </div>
                {data.interpretaciones_planetarias.sol.proposito_vida && (
                  <div className="bg-yellow-800/30 rounded-lg p-4 mb-3">
                    <h5 className="text-yellow-200 font-semibold mb-2">🎯 Propósito de Vida</h5>
                    <p className="text-yellow-50 leading-relaxed whitespace-pre-line">{data.interpretaciones_planetarias.sol.proposito_vida}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.sol.trampa && (
                  <div className="bg-red-900/30 rounded-lg p-4 mb-3">
                    <h5 className="text-red-200 font-semibold mb-2">⚠️ Trampa</h5>
                    <p className="text-red-50">{data.interpretaciones_planetarias.sol.trampa}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.sol.superpoder && (
                  <div className="bg-green-900/30 rounded-lg p-4 mb-3">
                    <h5 className="text-green-200 font-semibold mb-2">⚡ Superpoder</h5>
                    <p className="text-green-50">{data.interpretaciones_planetarias.sol.superpoder}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.sol.afirmacion && (
                  <div className="bg-gradient-to-r from-yellow-800/40 to-orange-800/40 rounded-lg p-4 border border-yellow-400/30">
                    <p className="text-yellow-50 text-lg font-bold italic text-center">"{data.interpretaciones_planetarias.sol.afirmacion}"</p>
                  </div>
                )}
              </div>
            )}

            {/* LUNA */}
            {data.interpretaciones_planetarias.luna && (
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-400/20">
                <div className="mb-4">
                  <h4 className="text-blue-100 font-bold text-2xl mb-2">🌙 Luna</h4>
                  <p className="text-blue-300 text-sm mb-3">{data.interpretaciones_planetarias.luna.posicion}</p>
                  {data.interpretaciones_planetarias.luna.titulo_arquetipo && (
                    <p className="text-blue-50 text-xl font-bold italic">✨ {data.interpretaciones_planetarias.luna.titulo_arquetipo}</p>
                  )}
                </div>
                {data.interpretaciones_planetarias.luna.mundo_emocional && (
                  <div className="bg-blue-800/30 rounded-lg p-4 mb-3">
                    <h5 className="text-blue-200 font-semibold mb-2">💙 Mundo Emocional</h5>
                    <p className="text-blue-50 leading-relaxed whitespace-pre-line">{data.interpretaciones_planetarias.luna.mundo_emocional}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.luna.como_se_nutre && (
                  <div className="bg-blue-800/30 rounded-lg p-4 mb-3">
                    <h5 className="text-blue-200 font-semibold mb-2">🍃 Cómo Se Nutre</h5>
                    <p className="text-blue-50 leading-relaxed">{data.interpretaciones_planetarias.luna.como_se_nutre}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.luna.patron_infancia && (
                  <div className="bg-purple-900/30 rounded-lg p-4 mb-3">
                    <h5 className="text-purple-200 font-semibold mb-2">🧒 Patrón de Infancia</h5>
                    <p className="text-purple-50">{data.interpretaciones_planetarias.luna.patron_infancia}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.luna.sanacion_emocional && (
                  <div className="bg-green-900/30 rounded-lg p-4">
                    <h5 className="text-green-200 font-semibold mb-2">💚 Sanación Emocional</h5>
                    <p className="text-green-50">{data.interpretaciones_planetarias.luna.sanacion_emocional}</p>
                  </div>
                )}
              </div>
            )}

            {/* ASCENDENTE */}
            {data.interpretaciones_planetarias.ascendente && (
              <div className="bg-gradient-to-br from-pink-900/30 to-rose-900/30 rounded-xl p-6 border border-pink-400/20">
                <div className="mb-4">
                  <h4 className="text-pink-100 font-bold text-2xl mb-2">⬆️ Ascendente</h4>
                  <p className="text-pink-300 text-sm mb-3">{data.interpretaciones_planetarias.ascendente.posicion}</p>
                  {data.interpretaciones_planetarias.ascendente.titulo_arquetipo && (
                    <p className="text-pink-50 text-xl font-bold italic">✨ {data.interpretaciones_planetarias.ascendente.titulo_arquetipo}</p>
                  )}
                </div>
                {data.interpretaciones_planetarias.ascendente.personalidad_visible && (
                  <div className="bg-pink-800/30 rounded-lg p-4 mb-3">
                    <h5 className="text-pink-200 font-semibold mb-2">👤 Personalidad Visible</h5>
                    <p className="text-pink-50 leading-relaxed whitespace-pre-line">{data.interpretaciones_planetarias.ascendente.personalidad_visible}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.ascendente.presencia && (
                  <div className="bg-pink-800/30 rounded-lg p-4 mb-3">
                    <h5 className="text-pink-200 font-semibold mb-2">✨ Presencia</h5>
                    <p className="text-pink-50">{data.interpretaciones_planetarias.ascendente.presencia}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.ascendente.mascara_vs_esencia && (
                  <div className="bg-rose-900/30 rounded-lg p-4">
                    <h5 className="text-rose-200 font-semibold mb-2">🎭 Máscara vs Esencia</h5>
                    <p className="text-rose-50">{data.interpretaciones_planetarias.ascendente.mascara_vs_esencia}</p>
                  </div>
                )}
              </div>
            )}

            {/* MERCURIO */}
            {data.interpretaciones_planetarias.mercurio && (
              <div className="bg-gradient-to-br from-cyan-900/30 to-teal-900/30 rounded-xl p-6 border border-cyan-400/20">
                <div className="mb-4">
                  <h4 className="text-cyan-100 font-bold text-2xl mb-2">💬 Mercurio</h4>
                  <p className="text-cyan-300 text-sm mb-3">{data.interpretaciones_planetarias.mercurio.posicion}</p>
                  {data.interpretaciones_planetarias.mercurio.titulo_arquetipo && (
                    <p className="text-cyan-50 text-xl font-bold italic">✨ {data.interpretaciones_planetarias.mercurio.titulo_arquetipo}</p>
                  )}
                </div>
                {data.interpretaciones_planetarias.mercurio.como_piensa && (
                  <div className="bg-cyan-800/30 rounded-lg p-4 mb-3">
                    <h5 className="text-cyan-200 font-semibold mb-2">🧠 Cómo Piensa</h5>
                    <p className="text-cyan-50 leading-relaxed whitespace-pre-line">{data.interpretaciones_planetarias.mercurio.como_piensa}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.mercurio.fortalezas_mentales && (
                  <div className="bg-cyan-800/30 rounded-lg p-4 mb-3">
                    <h5 className="text-cyan-200 font-semibold mb-2">⚡ Fortalezas Mentales</h5>
                    <p className="text-cyan-50">{data.interpretaciones_planetarias.mercurio.fortalezas_mentales}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.mercurio.desafio && (
                  <div className="bg-orange-900/30 rounded-lg p-4">
                    <h5 className="text-orange-200 font-semibold mb-2">🎯 Desafío</h5>
                    <p className="text-orange-50">{data.interpretaciones_planetarias.mercurio.desafio}</p>
                  </div>
                )}
              </div>
            )}

            {/* VENUS */}
            {data.interpretaciones_planetarias.venus && (
              <div className="bg-gradient-to-br from-rose-900/30 to-pink-900/30 rounded-xl p-6 border border-rose-400/20">
                <div className="mb-4">
                  <h4 className="text-rose-100 font-bold text-2xl mb-2">💕 Venus</h4>
                  <p className="text-rose-300 text-sm mb-3">{data.interpretaciones_planetarias.venus.posicion}</p>
                  {data.interpretaciones_planetarias.venus.titulo_arquetipo && (
                    <p className="text-rose-50 text-xl font-bold italic">✨ {data.interpretaciones_planetarias.venus.titulo_arquetipo}</p>
                  )}
                </div>
                {data.interpretaciones_planetarias.venus.como_ama && (
                  <div className="bg-rose-800/30 rounded-lg p-4 mb-3">
                    <h5 className="text-rose-200 font-semibold mb-2">❤️ Cómo Ama</h5>
                    <p className="text-rose-50 leading-relaxed whitespace-pre-line">{data.interpretaciones_planetarias.venus.como_ama}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.venus.que_necesita_en_pareja && (
                  <div className="bg-rose-800/30 rounded-lg p-4 mb-3">
                    <h5 className="text-rose-200 font-semibold mb-2">💝 Qué Necesita en Pareja</h5>
                    <p className="text-rose-50">{data.interpretaciones_planetarias.venus.que_necesita_en_pareja}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.venus.trampa_amorosa && (
                  <div className="bg-red-900/30 rounded-lg p-4 mb-3">
                    <h5 className="text-red-200 font-semibold mb-2">⚠️ Trampa Amorosa</h5>
                    <p className="text-red-50">{data.interpretaciones_planetarias.venus.trampa_amorosa}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.venus.valores && (
                  <div className="bg-pink-800/30 rounded-lg p-4">
                    <h5 className="text-pink-200 font-semibold mb-2">💎 Valores</h5>
                    <p className="text-pink-50">{data.interpretaciones_planetarias.venus.valores}</p>
                  </div>
                )}
              </div>
            )}

            {/* MARTE */}
            {data.interpretaciones_planetarias.marte && (
              <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-xl p-6 border border-red-400/20">
                <div className="mb-4">
                  <h4 className="text-red-100 font-bold text-2xl mb-2">⚔️ Marte</h4>
                  <p className="text-red-300 text-sm mb-3">{data.interpretaciones_planetarias.marte.posicion}</p>
                  {data.interpretaciones_planetarias.marte.titulo_arquetipo && (
                    <p className="text-red-50 text-xl font-bold italic">✨ {data.interpretaciones_planetarias.marte.titulo_arquetipo}</p>
                  )}
                </div>
                {data.interpretaciones_planetarias.marte.como_actua && (
                  <div className="bg-red-800/30 rounded-lg p-4 mb-3">
                    <h5 className="text-red-200 font-semibold mb-2">🎯 Cómo Actúa</h5>
                    <p className="text-red-50 leading-relaxed whitespace-pre-line">{data.interpretaciones_planetarias.marte.como_actua}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.marte.energia_vital && (
                  <div className="bg-red-800/30 rounded-lg p-4 mb-3">
                    <h5 className="text-red-200 font-semibold mb-2">⚡ Energía Vital</h5>
                    <p className="text-red-50">{data.interpretaciones_planetarias.marte.energia_vital}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.marte.ira && (
                  <div className="bg-orange-900/30 rounded-lg p-4 mb-3">
                    <h5 className="text-orange-200 font-semibold mb-2">🔥 Ira</h5>
                    <p className="text-orange-50">{data.interpretaciones_planetarias.marte.ira}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.marte.desafio && (
                  <div className="bg-yellow-900/30 rounded-lg p-4">
                    <h5 className="text-yellow-200 font-semibold mb-2">🎯 Desafío</h5>
                    <p className="text-yellow-50">{data.interpretaciones_planetarias.marte.desafio}</p>
                  </div>
                )}
              </div>
            )}

            {/* JÚPITER */}
            {data.interpretaciones_planetarias.jupiter && (
              <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-400/20">
                <div className="mb-4">
                  <h4 className="text-purple-100 font-bold text-2xl mb-2">🍀 Júpiter</h4>
                  <p className="text-purple-300 text-sm mb-3">{data.interpretaciones_planetarias.jupiter.posicion}</p>
                  {data.interpretaciones_planetarias.jupiter.titulo_arquetipo && (
                    <p className="text-purple-50 text-xl font-bold italic">✨ {data.interpretaciones_planetarias.jupiter.titulo_arquetipo}</p>
                  )}
                </div>
                {data.interpretaciones_planetarias.jupiter.donde_viene_suerte && (
                  <div className="bg-purple-800/30 rounded-lg p-4 mb-3">
                    <h5 className="text-purple-200 font-semibold mb-2">🎲 De Dónde Viene Tu Suerte</h5>
                    <p className="text-purple-50">{data.interpretaciones_planetarias.jupiter.donde_viene_suerte}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.jupiter.expansion && (
                  <div className="bg-purple-800/30 rounded-lg p-4 mb-3">
                    <h5 className="text-purple-200 font-semibold mb-2">🚀 Expansión</h5>
                    <p className="text-purple-50">{data.interpretaciones_planetarias.jupiter.expansion}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.jupiter.consejo && (
                  <div className="bg-indigo-900/30 rounded-lg p-4">
                    <h5 className="text-indigo-200 font-semibold mb-2">💡 Consejo</h5>
                    <p className="text-indigo-50">{data.interpretaciones_planetarias.jupiter.consejo}</p>
                  </div>
                )}
              </div>
            )}

            {/* SATURNO */}
            {data.interpretaciones_planetarias.saturno && (
              <div className="bg-gradient-to-br from-gray-900/30 to-slate-900/30 rounded-xl p-6 border border-gray-400/20">
                <div className="mb-4">
                  <h4 className="text-gray-100 font-bold text-2xl mb-2">🪐 Saturno</h4>
                  <p className="text-gray-300 text-sm mb-3">{data.interpretaciones_planetarias.saturno.posicion}</p>
                  {data.interpretaciones_planetarias.saturno.titulo_arquetipo && (
                    <p className="text-gray-50 text-xl font-bold italic">✨ {data.interpretaciones_planetarias.saturno.titulo_arquetipo}</p>
                  )}
                </div>
                {data.interpretaciones_planetarias.saturno.karma_lecciones && (
                  <div className="bg-gray-800/30 rounded-lg p-4 mb-3">
                    <h5 className="text-gray-200 font-semibold mb-2">🔄 Karma y Lecciones</h5>
                    <p className="text-gray-50 leading-relaxed whitespace-pre-line">{data.interpretaciones_planetarias.saturno.karma_lecciones}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.saturno.responsabilidad && (
                  <div className="bg-gray-800/30 rounded-lg p-4 mb-3">
                    <h5 className="text-gray-200 font-semibold mb-2">⚖️ Responsabilidad</h5>
                    <p className="text-gray-50">{data.interpretaciones_planetarias.saturno.responsabilidad}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.saturno.recompensa && (
                  <div className="bg-green-900/30 rounded-lg p-4">
                    <h5 className="text-green-200 font-semibold mb-2">🏆 Recompensa (después de los 29-30)</h5>
                    <p className="text-green-50">{data.interpretaciones_planetarias.saturno.recompensa}</p>
                  </div>
                )}
              </div>
            )}

            {/* URANO */}
            {data.interpretaciones_planetarias.urano && (
              <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-6 border border-cyan-400/20">
                <div className="mb-4">
                  <h4 className="text-cyan-100 font-bold text-2xl mb-2">⚡ Urano</h4>
                  <p className="text-cyan-300 text-sm mb-3">{data.interpretaciones_planetarias.urano.posicion}</p>
                </div>
                {data.interpretaciones_planetarias.urano.donde_revoluciona && (
                  <div className="bg-cyan-800/30 rounded-lg p-4 mb-3">
                    <h5 className="text-cyan-200 font-semibold mb-2">🔥 Dónde Revolucionas</h5>
                    <p className="text-cyan-50">{data.interpretaciones_planetarias.urano.donde_revoluciona}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.urano.genialidad && (
                  <div className="bg-cyan-800/30 rounded-lg p-4">
                    <h5 className="text-cyan-200 font-semibold mb-2">💡 Genialidad</h5>
                    <p className="text-cyan-50">{data.interpretaciones_planetarias.urano.genialidad}</p>
                  </div>
                )}
              </div>
            )}

            {/* NEPTUNO */}
            {data.interpretaciones_planetarias.neptuno && (
              <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-6 border border-indigo-400/20">
                <div className="mb-4">
                  <h4 className="text-indigo-100 font-bold text-2xl mb-2">🌊 Neptuno</h4>
                  <p className="text-indigo-300 text-sm mb-3">{data.interpretaciones_planetarias.neptuno.posicion}</p>
                </div>
                {data.interpretaciones_planetarias.neptuno.espiritualidad && (
                  <div className="bg-indigo-800/30 rounded-lg p-4 mb-3">
                    <h5 className="text-indigo-200 font-semibold mb-2">✨ Espiritualidad</h5>
                    <p className="text-indigo-50">{data.interpretaciones_planetarias.neptuno.espiritualidad}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.neptuno.ilusion_vs_inspiracion && (
                  <div className="bg-indigo-800/30 rounded-lg p-4">
                    <h5 className="text-indigo-200 font-semibold mb-2">🎭 Ilusión vs Inspiración</h5>
                    <p className="text-indigo-50">{data.interpretaciones_planetarias.neptuno.ilusion_vs_inspiracion}</p>
                  </div>
                )}
              </div>
            )}

            {/* PLUTÓN */}
            {data.interpretaciones_planetarias.pluton && (
              <div className="bg-gradient-to-br from-purple-900/30 to-black/30 rounded-xl p-6 border border-purple-400/20">
                <div className="mb-4">
                  <h4 className="text-purple-100 font-bold text-2xl mb-2">🕳️ Plutón</h4>
                  <p className="text-purple-300 text-sm mb-3">{data.interpretaciones_planetarias.pluton.posicion}</p>
                </div>
                {data.interpretaciones_planetarias.pluton.transformacion && (
                  <div className="bg-purple-800/30 rounded-lg p-4 mb-3">
                    <h5 className="text-purple-200 font-semibold mb-2">🔄 Transformación</h5>
                    <p className="text-purple-50">{data.interpretaciones_planetarias.pluton.transformacion}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.pluton.sombra_y_poder && (
                  <div className="bg-purple-800/30 rounded-lg p-4">
                    <h5 className="text-purple-200 font-semibold mb-2">🌑 Sombra y Poder</h5>
                    <p className="text-purple-50">{data.interpretaciones_planetarias.pluton.sombra_y_poder}</p>
                  </div>
                )}
              </div>
            )}

            {/* QUIRÓN */}
            {data.interpretaciones_planetarias.quiron && (
              <div className="bg-gradient-to-br from-teal-900/30 to-emerald-900/30 rounded-xl p-6 border border-teal-400/20">
                <div className="mb-4">
                  <h4 className="text-teal-100 font-bold text-2xl mb-2">🏥 Quirón</h4>
                  <p className="text-teal-300 text-sm mb-3">{data.interpretaciones_planetarias.quiron.posicion}</p>
                </div>
                {data.interpretaciones_planetarias.quiron.herida_principal && (
                  <div className="bg-teal-800/30 rounded-lg p-4 mb-3">
                    <h5 className="text-teal-200 font-semibold mb-2">💔 Herida Principal</h5>
                    <p className="text-teal-50">{data.interpretaciones_planetarias.quiron.herida_principal}</p>
                  </div>
                )}
                {data.interpretaciones_planetarias.quiron.don_sanador && (
                  <div className="bg-green-900/30 rounded-lg p-4">
                    <h5 className="text-green-200 font-semibold mb-2">💚 Don Sanador</h5>
                    <p className="text-green-50">{data.interpretaciones_planetarias.quiron.don_sanador}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ✅ BACKWARDS COMPATIBILITY: Old interpretaciones structure */}
        {data.interpretaciones && !data.interpretaciones_planetarias && (
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white text-center mb-8">
              🪐 Interpretaciones Planetarias
            </h3>

            {Object.entries(data.interpretaciones).map(([planetKey, planetData]: [string, any]) => (
              <div
                key={planetKey}
                className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-6 border border-indigo-400/20"
              >
                <h4 className="text-indigo-100 font-bold text-xl mb-4 capitalize">
                  {planetKey === 'medio_cielo' ? 'Medio Cielo' : planetKey === 'nodo_norte' ? 'Nodo Norte' : planetKey}
                  {planetData.posicion && (
                    <span className="text-indigo-300 text-sm ml-2 font-normal">
                      ({planetData.posicion.signo} Casa {planetData.posicion.casa})
                    </span>
                  )}
                </h4>

                {planetData.educativo && (
                  <div className="bg-blue-900/30 rounded-lg p-4 mb-3">
                    <h5 className="text-blue-200 font-semibold text-sm mb-2">📚 Educativo</h5>
                    <p className="text-blue-50 text-sm leading-relaxed">{planetData.educativo}</p>
                  </div>
                )}

                {planetData.poderoso && (
                  <div className="bg-red-900/30 rounded-lg p-4 mb-3">
                    <h5 className="text-red-200 font-semibold text-sm mb-2">🔥 Poderoso</h5>
                    <p className="text-red-50 text-sm leading-relaxed">{planetData.poderoso}</p>
                  </div>
                )}

                {planetData.poetico && (
                  <div className="bg-purple-900/30 rounded-lg p-4 mb-3">
                    <h5 className="text-purple-200 font-semibold text-sm mb-2">🌙 Poético</h5>
                    <p className="text-purple-50 text-sm leading-relaxed italic">{planetData.poetico}</p>
                  </div>
                )}

                {planetData.sombras && planetData.sombras.length > 0 && (
                  <div className="bg-gray-900/30 rounded-lg p-4 mb-3">
                    <h5 className="text-gray-200 font-semibold text-sm mb-2">🌑 Sombras</h5>
                    {planetData.sombras.map((sombra: any, i: number) => (
                      <div key={i} className="mb-2 last:mb-0">
                        <p className="text-gray-100 font-semibold text-sm">{sombra.nombre}</p>
                        <p className="text-gray-300 text-xs">{sombra.patron}</p>
                        <p className="text-red-400 text-xs">{sombra.trampa}</p>
                        <p className="text-green-400 text-xs">{sombra.regalo}</p>
                      </div>
                    ))}
                  </div>
                )}

                {planetData.sintesis && (
                  <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-lg p-4">
                    <p className="text-emerald-200 font-bold text-sm mb-1">{planetData.sintesis.frase}</p>
                    <p className="text-emerald-50 text-sm italic">{planetData.sintesis.declaracion}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ✅ NUEVA SECCIÓN: ASPECTOS DESTACADOS */}
        {data.aspectos_destacados && (
          <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 rounded-2xl p-8 border border-purple-400/30">
            <h3 className="text-3xl font-bold text-white text-center mb-8">
              ✨ Aspectos Destacados de Tu Carta
            </h3>

            {data.aspectos_destacados.stelliums && (
              <div className="bg-purple-800/30 rounded-lg p-4 mb-4">
                <h4 className="text-purple-200 font-bold text-lg mb-2">🌟 Stelliums (Concentraciones Planetarias)</h4>
                <p className="text-purple-50 leading-relaxed">{data.aspectos_destacados.stelliums}</p>
              </div>
            )}

            {data.aspectos_destacados.aspectos_tensos && (
              <div className="bg-red-900/30 rounded-lg p-4 mb-4">
                <h4 className="text-red-200 font-bold text-lg mb-2">⚡ Aspectos Tensos (Cuadraturas y Oposiciones)</h4>
                <p className="text-red-50 leading-relaxed">{data.aspectos_destacados.aspectos_tensos}</p>
              </div>
            )}

            {data.aspectos_destacados.aspectos_armoniosos && (
              <div className="bg-green-900/30 rounded-lg p-4 mb-4">
                <h4 className="text-green-200 font-bold text-lg mb-2">🌈 Aspectos Armoniosos (Trígonos y Sextiles)</h4>
                <p className="text-green-50 leading-relaxed">{data.aspectos_destacados.aspectos_armoniosos}</p>
              </div>
            )}

            {data.aspectos_destacados.patron_dominante && (
              <div className="bg-gradient-to-r from-fuchsia-800/40 to-purple-800/40 rounded-lg p-4 border border-fuchsia-400/30">
                <h4 className="text-fuchsia-200 font-bold text-lg mb-2">🔮 Patrón Dominante</h4>
                <p className="text-fuchsia-50 text-lg leading-relaxed">{data.aspectos_destacados.patron_dominante}</p>
              </div>
            )}
          </div>
        )}

        {/* ✅ NUEVA SECCIÓN: INTEGRACIÓN DE TU CARTA NATAL */}
        {data.integracion_carta && (
          <div className="bg-gradient-to-br from-amber-900/40 to-yellow-900/40 rounded-2xl p-8 border border-amber-400/30">
            <h3 className="text-3xl font-bold text-white text-center mb-8">
              🌟 Integración de Tu Carta Natal - El Hilo de Oro
            </h3>

            {data.integracion_carta.hilo_de_oro && (
              <div className="bg-amber-800/30 rounded-lg p-6 mb-6 border border-amber-400/20">
                <h4 className="text-amber-200 font-bold text-xl mb-4">✨ El Hilo de Oro que Une Tu Carta</h4>
                <p className="text-amber-50 text-lg leading-relaxed whitespace-pre-line">{data.integracion_carta.hilo_de_oro}</p>
              </div>
            )}

            {data.integracion_carta.sintesis && (
              <div className="bg-gradient-to-r from-yellow-800/40 to-amber-800/40 rounded-lg p-4 mb-6 border border-yellow-400/30">
                <h4 className="text-yellow-200 font-bold text-lg mb-2">💫 Síntesis</h4>
                <p className="text-yellow-50 text-xl font-bold italic text-center">"{data.integracion_carta.sintesis}"</p>
              </div>
            )}

            {data.integracion_carta.polaridades && data.integracion_carta.polaridades.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-amber-200 font-bold text-lg mb-4">⚖️ Polaridades a Integrar</h4>
                {data.integracion_carta.polaridades.map((polaridad: any, i: number) => (
                  <div key={i} className="bg-amber-800/30 rounded-lg p-4 border border-amber-400/20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-red-900/30 rounded p-3">
                        <p className="text-red-200 font-semibold text-sm mb-1">Polo A</p>
                        <p className="text-red-50">{polaridad.polo_a}</p>
                      </div>
                      <div className="bg-blue-900/30 rounded p-3">
                        <p className="text-blue-200 font-semibold text-sm mb-1">Polo B</p>
                        <p className="text-blue-50">{polaridad.polo_b}</p>
                      </div>
                      <div className="bg-green-900/30 rounded p-3">
                        <p className="text-green-200 font-semibold text-sm mb-1">Integración</p>
                        <p className="text-green-50">{polaridad.integracion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ✅ NUEVA SECCIÓN: FORTALEZAS EDUCATIVAS */}
        {data.fortalezas_educativas && (
          <div className="bg-gradient-to-br from-emerald-900/40 to-green-900/40 rounded-2xl p-8 border border-emerald-400/30">
            <h4 className="text-emerald-100 font-bold text-xl mb-6 flex items-center gap-3">
              <Brain className="w-8 h-8 text-emerald-300" />
              Fortalezas Educativas - Cómo Aprendes Mejor
            </h4>

            {data.fortalezas_educativas.como_aprendes_mejor && (
              <div className="bg-emerald-800/30 rounded-lg p-4 mb-4">
                <h5 className="text-emerald-200 font-semibold mb-2">📖 Cómo Aprendes Mejor</h5>
                <ul className="space-y-2">
                  {data.fortalezas_educativas.como_aprendes_mejor.map((item: string, i: number) => (
                    <li key={i} className="text-emerald-50 flex items-start gap-2">
                      <span className="text-emerald-400">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.fortalezas_educativas.inteligencias_dominantes && (
              <div className="bg-emerald-800/30 rounded-lg p-4 mb-4">
                <h5 className="text-emerald-200 font-semibold mb-2">🧠 Inteligencias Dominantes</h5>
                <div className="space-y-3">
                  {data.fortalezas_educativas.inteligencias_dominantes.map((intel: any, i: number) => (
                    <div key={i} className="bg-emerald-700/30 rounded p-3">
                      <p className="text-emerald-100 font-semibold">{intel.tipo}</p>
                      <p className="text-emerald-200 text-sm">{intel.descripcion}</p>
                      <p className="text-emerald-400 text-xs mt-1">Origen: {intel.planeta_origen}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.fortalezas_educativas.modalidades_estudio && (
              <div className="bg-emerald-800/30 rounded-lg p-4">
                <h5 className="text-emerald-200 font-semibold mb-2">📚 Modalidades de Estudio Recomendadas</h5>
                <ul className="space-y-1">
                  {data.fortalezas_educativas.modalidades_estudio.map((mod: string, i: number) => (
                    <li key={i} className="text-emerald-50 text-sm">• {mod}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ✅ NUEVA SECCIÓN: ÁREAS DE ESPECIALIZACIÓN */}
        {data.areas_especializacion && data.areas_especializacion.length > 0 && (
          <div className="bg-gradient-to-br from-yellow-900/40 to-amber-900/40 rounded-2xl p-8 border border-yellow-400/30">
            <h4 className="text-yellow-100 font-bold text-xl mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-yellow-300" />
              Áreas de Especialización Profesional
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.areas_especializacion.map((area: any, i: number) => (
                <div key={i} className="bg-yellow-800/30 rounded-lg p-4">
                  <h5 className="text-yellow-200 font-bold mb-2">{area.area}</h5>
                  <p className="text-yellow-400 text-xs mb-2">Origen: {area.planetas_origen}</p>
                  <div className="flex flex-wrap gap-1">
                    {area.profesiones_sugeridas?.map((prof: string, j: number) => (
                      <span key={j} className="bg-yellow-600/40 text-yellow-100 px-2 py-1 rounded text-xs">{prof}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ NUEVA SECCIÓN: PATRONES DE SANACIÓN */}
        {data.patrones_sanacion && data.patrones_sanacion.heridas && (
          <div className="bg-gradient-to-br from-rose-900/40 to-pink-900/40 rounded-2xl p-8 border border-rose-400/30">
            <h4 className="text-rose-100 font-bold text-xl mb-6 flex items-center gap-3">
              <Star className="w-8 h-8 text-rose-300" />
              Patrones de Sanación - Tus Heridas y Regalos
            </h4>
            <div className="space-y-6">
              {data.patrones_sanacion.heridas.map((herida: any, i: number) => (
                <div key={i} className="bg-rose-800/30 rounded-lg p-4">
                  <h5 className="text-rose-200 font-bold text-lg mb-2">{herida.nombre}</h5>
                  <p className="text-rose-400 text-xs mb-2">Origen: {herida.planeta_origen}</p>
                  <p className="text-rose-50 mb-3">{herida.patron}</p>

                  {herida.origen_infancia && (
                    <div className="bg-rose-700/30 rounded p-3 mb-2">
                      <p className="text-rose-200 text-sm font-semibold">🧒 Origen en la Infancia:</p>
                      <p className="text-rose-50 text-sm">{herida.origen_infancia}</p>
                    </div>
                  )}

                  {herida.como_se_manifiesta && (
                    <div className="mb-2">
                      <p className="text-rose-200 text-sm font-semibold mb-1">📋 Cómo se Manifiesta:</p>
                      <ul className="list-disc list-inside text-rose-50 text-sm">
                        {herida.como_se_manifiesta.map((m: string, j: number) => (
                          <li key={j}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {herida.sanacion && (
                    <div className="bg-green-900/30 rounded p-3">
                      <p className="text-green-200 text-sm font-semibold">💚 Sanación:</p>
                      <p className="text-green-50 text-sm">{herida.sanacion}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ NUEVA SECCIÓN: MANIFESTACIÓN DEL AMOR */}
        {data.manifestacion_amor && (
          <div className="bg-gradient-to-br from-pink-900/40 to-red-900/40 rounded-2xl p-8 border border-pink-400/30">
            <h4 className="text-pink-100 font-bold text-xl mb-6 flex items-center gap-3">
              <Star className="w-8 h-8 text-pink-300" />
              💕 Manifestación del Amor
            </h4>

            {data.manifestacion_amor.patron_amoroso && (
              <div className="bg-pink-800/30 rounded-lg p-4 mb-4">
                <h5 className="text-pink-200 font-semibold mb-2">Tu Patrón Amoroso</h5>
                <p className="text-pink-50">{data.manifestacion_amor.patron_amoroso}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {data.manifestacion_amor.que_atraes && (
                <div className="bg-pink-800/30 rounded-lg p-4">
                  <h5 className="text-pink-200 font-semibold mb-2">🧲 Qué Atraes</h5>
                  <p className="text-pink-50 text-sm">{data.manifestacion_amor.que_atraes}</p>
                </div>
              )}
              {data.manifestacion_amor.que_necesitas && (
                <div className="bg-pink-800/30 rounded-lg p-4">
                  <h5 className="text-pink-200 font-semibold mb-2">💝 Qué Necesitas</h5>
                  <p className="text-pink-50 text-sm">{data.manifestacion_amor.que_necesitas}</p>
                </div>
              )}
            </div>

            {data.manifestacion_amor.trampa_amorosa && (
              <div className="bg-red-900/30 rounded-lg p-4 mb-4">
                <h5 className="text-red-200 font-semibold mb-2">⚠️ Tu Trampa Amorosa</h5>
                <p className="text-red-50 text-sm">{data.manifestacion_amor.trampa_amorosa}</p>
              </div>
            )}

            {data.manifestacion_amor.leccion_amorosa && (
              <div className="bg-purple-900/30 rounded-lg p-4 mb-4">
                <h5 className="text-purple-200 font-semibold mb-2">📚 Tu Lección Amorosa</h5>
                <p className="text-purple-50 text-sm">{data.manifestacion_amor.leccion_amorosa}</p>
              </div>
            )}

            {data.manifestacion_amor.ritual_luna_nueva_venus && (
              <div className="bg-gradient-to-br from-rose-800/40 to-purple-800/40 rounded-lg p-6 mb-4 border border-rose-400/30">
                <h5 className="text-rose-100 font-bold text-lg mb-4">🌙 Ritual de Luna Nueva para Venus</h5>

                {data.manifestacion_amor.ritual_luna_nueva_venus.preparacion && (
                  <div className="bg-rose-900/30 rounded-lg p-4 mb-3">
                    <h6 className="text-rose-200 font-semibold mb-2">✨ Preparación</h6>
                    <p className="text-rose-50 leading-relaxed">{data.manifestacion_amor.ritual_luna_nueva_venus.preparacion}</p>
                  </div>
                )}

                {data.manifestacion_amor.ritual_luna_nueva_venus.activacion_28_dias && (
                  <div className="bg-purple-900/30 rounded-lg p-4 mb-3">
                    <h6 className="text-purple-200 font-semibold mb-2">🔄 Activación 28 Días</h6>
                    <p className="text-purple-50 leading-relaxed">{data.manifestacion_amor.ritual_luna_nueva_venus.activacion_28_dias}</p>
                  </div>
                )}

                {data.manifestacion_amor.ritual_luna_nueva_venus.entrega_luna_llena && (
                  <div className="bg-pink-900/30 rounded-lg p-4">
                    <h6 className="text-pink-200 font-semibold mb-2">🌕 Entrega en Luna Llena</h6>
                    <p className="text-pink-50 leading-relaxed">{data.manifestacion_amor.ritual_luna_nueva_venus.entrega_luna_llena}</p>
                  </div>
                )}
              </div>
            )}

            {data.manifestacion_amor.declaracion_amor && (
              <div className="bg-gradient-to-r from-pink-800/40 to-red-800/40 rounded-lg p-4 border border-pink-400/30">
                <p className="text-pink-50 text-lg font-bold italic text-center">
                  "{data.manifestacion_amor.declaracion_amor}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* ✅ NUEVA SECCIÓN: VISUALIZACIÓN */}
        {data.visualizacion && (
          <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 rounded-2xl p-8 border border-indigo-400/30">
            <h4 className="text-indigo-100 font-bold text-xl mb-6 flex items-center gap-3">
              <Eye className="w-8 h-8 text-indigo-300" />
              🔮 Visualización Guiada Personalizada
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {data.visualizacion.duracion && (
                <div className="bg-indigo-800/30 rounded-lg p-3">
                  <p className="text-indigo-200 font-semibold text-sm">⏱️ Duración: {data.visualizacion.duracion}</p>
                </div>
              )}
              {data.visualizacion.mejor_momento && (
                <div className="bg-indigo-800/30 rounded-lg p-3">
                  <p className="text-indigo-200 font-semibold text-sm">🌙 Mejor Momento: {data.visualizacion.mejor_momento}</p>
                </div>
              )}
            </div>

            {data.visualizacion.preparacion && (
              <div className="bg-indigo-800/30 rounded-lg p-4 mb-4">
                <h5 className="text-indigo-200 font-semibold mb-2">🧘 Preparación</h5>
                <ul className="space-y-1">
                  {data.visualizacion.preparacion.map((prep: string, i: number) => (
                    <li key={i} className="text-indigo-50 text-sm">• {prep}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.visualizacion.texto_visualizacion && (
              <div className="bg-gradient-to-b from-indigo-800/40 to-purple-800/40 rounded-lg p-6 border border-indigo-400/20">
                <h5 className="text-indigo-200 font-semibold mb-3">✨ Texto de Visualización</h5>
                <p className="text-indigo-50 leading-relaxed italic whitespace-pre-line">
                  {data.visualizacion.texto_visualizacion}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ✅ NUEVA SECCIÓN: DATOS PARA AGENDA (LUNARES) */}
        {data.datos_para_agenda && (
          <div className="bg-gradient-to-br from-slate-900/60 to-indigo-900/60 rounded-2xl p-8 border border-slate-400/30">
            <h3 className="text-3xl font-bold text-white text-center mb-8">
              🌙 Datos para Tu Agenda Lunar
            </h3>

            {/* Eventos Lunares Personalizados */}
            {data.datos_para_agenda.eventos_lunares_personalizados && data.datos_para_agenda.eventos_lunares_personalizados.length > 0 && (
              <div className="mb-6">
                <h4 className="text-slate-100 font-bold text-xl mb-4">✨ Eventos Lunares Personalizados</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.datos_para_agenda.eventos_lunares_personalizados.map((evento: any, i: number) => (
                    <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-500/20">
                      <h5 className="text-slate-100 font-bold mb-2">{evento.evento}</h5>
                      <p className="text-slate-200 text-sm mb-2">{evento.significado}</p>
                      {evento.ritual && (
                        <div className="bg-indigo-900/30 rounded p-3 mb-2">
                          <p className="text-indigo-200 text-xs font-semibold mb-1">Ritual:</p>
                          <p className="text-indigo-100 text-xs">{evento.ritual}</p>
                        </div>
                      )}
                      {evento.intencion && (
                        <div className="bg-purple-900/30 rounded p-3">
                          <p className="text-purple-200 text-xs font-semibold mb-1">Intención:</p>
                          <p className="text-purple-100 text-xs">{evento.intencion}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prácticas por Fase Lunar */}
            {data.datos_para_agenda.practicas_por_fase && (
              <div className="mb-6">
                <h4 className="text-slate-100 font-bold text-xl mb-4">🌓 Prácticas por Fase Lunar</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {data.datos_para_agenda.practicas_por_fase.luna_nueva && (
                    <div className="bg-black/40 rounded-lg p-4 border border-blue-500/20">
                      <h5 className="text-blue-200 font-bold mb-3">🌑 Luna Nueva</h5>
                      <ul className="space-y-2">
                        {data.datos_para_agenda.practicas_por_fase.luna_nueva.map((practica: string, i: number) => (
                          <li key={i} className="text-blue-100 text-sm flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{practica}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {data.datos_para_agenda.practicas_por_fase.cuarto_creciente && (
                    <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/20">
                      <h5 className="text-green-200 font-bold mb-3">🌓 Cuarto Creciente</h5>
                      <ul className="space-y-2">
                        {data.datos_para_agenda.practicas_por_fase.cuarto_creciente.map((practica: string, i: number) => (
                          <li key={i} className="text-green-100 text-sm flex items-start gap-2">
                            <span className="text-green-400 mt-1">•</span>
                            <span>{practica}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {data.datos_para_agenda.practicas_por_fase.luna_llena && (
                    <div className="bg-yellow-900/30 rounded-lg p-4 border border-yellow-500/20">
                      <h5 className="text-yellow-200 font-bold mb-3">🌕 Luna Llena</h5>
                      <ul className="space-y-2">
                        {data.datos_para_agenda.practicas_por_fase.luna_llena.map((practica: string, i: number) => (
                          <li key={i} className="text-yellow-100 text-sm flex items-start gap-2">
                            <span className="text-yellow-400 mt-1">•</span>
                            <span>{practica}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {data.datos_para_agenda.practicas_por_fase.cuarto_menguante && (
                    <div className="bg-red-900/30 rounded-lg p-4 border border-red-500/20">
                      <h5 className="text-red-200 font-bold mb-3">🌗 Cuarto Menguante</h5>
                      <ul className="space-y-2">
                        {data.datos_para_agenda.practicas_por_fase.cuarto_menguante.map((practica: string, i: number) => (
                          <li key={i} className="text-red-100 text-sm flex items-start gap-2">
                            <span className="text-red-400 mt-1">•</span>
                            <span>{practica}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Días de Poder */}
            {data.datos_para_agenda.dias_poder && data.datos_para_agenda.dias_poder.length > 0 && (
              <div className="mb-6">
                <h4 className="text-slate-100 font-bold text-xl mb-4">⚡ Días de Poder Personal</h4>
                <div className="space-y-3">
                  {data.datos_para_agenda.dias_poder.map((dia: any, i: number) => (
                    <div key={i} className="bg-amber-900/30 rounded-lg p-4 border border-amber-500/20">
                      <h5 className="text-amber-200 font-bold mb-2">{dia.cuando}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-green-200 text-xs font-semibold mb-1">✅ Qué Hacer:</p>
                          <p className="text-green-100 text-sm">{dia.que_hacer}</p>
                        </div>
                        <div>
                          <p className="text-red-200 text-xs font-semibold mb-1">⚠️ Qué Evitar:</p>
                          <p className="text-red-100 text-sm">{dia.que_evitar}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Advertencias Cósmicas */}
            {data.datos_para_agenda.advertencias_cosmicas && data.datos_para_agenda.advertencias_cosmicas.length > 0 && (
              <div>
                <h4 className="text-slate-100 font-bold text-xl mb-4">🔮 Advertencias Cósmicas</h4>
                <div className="space-y-3">
                  {data.datos_para_agenda.advertencias_cosmicas.map((advertencia: any, i: number) => (
                    <div key={i} className="bg-red-900/30 rounded-lg p-4 border border-red-500/20">
                      <h5 className="text-red-200 font-bold mb-2">⚠️ {advertencia.situacion}</h5>
                      <p className="text-red-100 text-sm mb-2">{advertencia.como_afecta}</p>
                      <div className="bg-orange-900/30 rounded p-3">
                        <p className="text-orange-200 text-xs font-semibold mb-1">Precauciones:</p>
                        <p className="text-orange-100 text-xs">{advertencia.precauciones}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ✅ NUEVA SECCIÓN: FORMACIÓN TEMPRANA */}
        {data.formacion_temprana && (
          <div className="bg-gradient-to-br from-cyan-900/40 to-teal-900/40 rounded-2xl p-8 border border-cyan-400/30">
            <h4 className="text-cyan-100 font-bold text-xl mb-6 flex items-center gap-3">
              <Star className="w-8 h-8 text-cyan-300" />
              Formación Temprana (Casa Lunar, Saturnina, Venusina)
            </h4>
            <div className="space-y-6">
              {data.formacion_temprana.casa_lunar && (
                <div className="bg-cyan-800/30 rounded-lg p-4">
                  <h5 className="text-cyan-200 font-semibold mb-2">🌙 Casa Lunar (Infancia y Raíces)</h5>
                  {typeof data.formacion_temprana.casa_lunar === 'string' ? (
                    <p className="text-cyan-50">{data.formacion_temprana.casa_lunar}</p>
                  ) : (
                    <div className="space-y-2">
                      {data.formacion_temprana.casa_lunar.signo_casa && (
                        <p className="text-cyan-200 text-sm font-semibold">
                          📍 {data.formacion_temprana.casa_lunar.signo_casa}
                        </p>
                      )}
                      {data.formacion_temprana.casa_lunar.interpretacion && (
                        <p className="text-cyan-50 text-sm">
                          {data.formacion_temprana.casa_lunar.interpretacion}
                        </p>
                      )}
                      {data.formacion_temprana.casa_lunar.influencia && (
                        <div className="bg-cyan-700/30 rounded-lg p-2 mt-2">
                          <p className="text-cyan-200 font-semibold text-xs mb-1">
                            🌟 Influencia:
                          </p>
                          <p className="text-cyan-50 text-xs">
                            {data.formacion_temprana.casa_lunar.influencia}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {data.formacion_temprana.casa_saturnina && (
                <div className="bg-cyan-800/30 rounded-lg p-4">
                  <h5 className="text-cyan-200 font-semibold mb-2">🪐 Casa Saturnina (Lecciones y Disciplina)</h5>
                  {typeof data.formacion_temprana.casa_saturnina === 'string' ? (
                    <p className="text-cyan-50">{data.formacion_temprana.casa_saturnina}</p>
                  ) : (
                    <div className="space-y-2">
                      {data.formacion_temprana.casa_saturnina.signo_casa && (
                        <p className="text-cyan-200 text-sm font-semibold">
                          📍 {data.formacion_temprana.casa_saturnina.signo_casa}
                        </p>
                      )}
                      {data.formacion_temprana.casa_saturnina.interpretacion && (
                        <p className="text-cyan-50 text-sm">
                          {data.formacion_temprana.casa_saturnina.interpretacion}
                        </p>
                      )}
                      {data.formacion_temprana.casa_saturnina.leccion && (
                        <div className="bg-cyan-700/30 rounded-lg p-2 mt-2">
                          <p className="text-cyan-200 font-semibold text-xs mb-1">
                            📚 Lección:
                          </p>
                          <p className="text-cyan-50 text-xs">
                            {data.formacion_temprana.casa_saturnina.leccion}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {data.formacion_temprana.casa_venusina && (
                <div className="bg-cyan-800/30 rounded-lg p-4">
                  <h5 className="text-cyan-200 font-semibold mb-2">💕 Casa Venusina (Amor y Valores)</h5>
                  {typeof data.formacion_temprana.casa_venusina === 'string' ? (
                    <p className="text-cyan-50">{data.formacion_temprana.casa_venusina}</p>
                  ) : (
                    <div className="space-y-2">
                      {data.formacion_temprana.casa_venusina.signo_casa && (
                        <p className="text-cyan-200 text-sm font-semibold">
                          📍 {data.formacion_temprana.casa_venusina.signo_casa}
                        </p>
                      )}
                      {data.formacion_temprana.casa_venusina.interpretacion && (
                        <p className="text-cyan-50 text-sm">
                          {data.formacion_temprana.casa_venusina.interpretacion}
                        </p>
                      )}
                      {data.formacion_temprana.casa_venusina.valores && (
                        <div className="bg-cyan-700/30 rounded-lg p-2 mt-2">
                          <p className="text-cyan-200 font-semibold text-xs mb-1">
                            💎 Valores:
                          </p>
                          <p className="text-cyan-50 text-xs">
                            {data.formacion_temprana.casa_venusina.valores}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ✅ NUEVA SECCIÓN: PATRONES PSICOLÓGICOS */}
        {data.patrones_psicologicos && (
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-2xl p-8 border border-indigo-400/30">
            <h4 className="text-indigo-100 font-bold text-xl mb-6 flex items-center gap-3">
              <Brain className="w-8 h-8 text-indigo-300" />
              Patrones Psicológicos Profundos
            </h4>
            <div className="space-y-4">
              {Array.isArray(data.patrones_psicologicos) ? (
                data.patrones_psicologicos.map((patron: string | any, index: number) => (
                  <div key={index} className="bg-indigo-800/30 rounded-lg p-4">
                    {typeof patron === 'string' ? (
                      <p className="text-indigo-50 leading-relaxed">{patron}</p>
                    ) : (
                      <div className="space-y-2">
                        {patron.planeta && <p className="text-indigo-200 font-semibold">🪐 {patron.planeta}</p>}
                        {patron.infancia_emocional && <p className="text-indigo-50">👶 {patron.infancia_emocional}</p>}
                        {patron.patron_formado && <p className="text-indigo-50">🔄 {patron.patron_formado}</p>}
                        {patron.impacto_adulto && <p className="text-indigo-50">👤 {patron.impacto_adulto}</p>}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-indigo-50 leading-relaxed">{data.patrones_psicologicos}</p>
              )}
            </div>
          </div>
        )}

        {/* ✅ NUEVA SECCIÓN: PLANETAS PROFUNDOS */}
        {data.planetas_profundos && (
          <div className="bg-gradient-to-br from-violet-900/40 to-purple-900/40 rounded-2xl p-8 border border-violet-400/30">
            <h4 className="text-violet-100 font-bold text-xl mb-6 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-violet-300" />
              Planetas Profundos (Urano, Neptuno, Plutón)
            </h4>
            <div className="space-y-4">
              {data.planetas_profundos.urano && (
                <div className="bg-violet-800/30 rounded-lg p-4">
                  <h5 className="text-violet-200 font-semibold mb-2">⚡ Urano (Revolución e Innovación)</h5>
                  <p className="text-violet-50">{data.planetas_profundos.urano}</p>
                </div>
              )}
              {data.planetas_profundos.neptuno && (
                <div className="bg-violet-800/30 rounded-lg p-4">
                  <h5 className="text-violet-200 font-semibold mb-2">🌊 Neptuno (Espiritualidad y Sueños)</h5>
                  <p className="text-violet-50">{data.planetas_profundos.neptuno}</p>
                </div>
              )}
              {data.planetas_profundos.pluton && (
                <div className="bg-violet-800/30 rounded-lg p-4">
                  <h5 className="text-violet-200 font-semibold mb-2">🕳️ Plutón (Transformación y Poder)</h5>
                  <p className="text-violet-50">{data.planetas_profundos.pluton}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ✅ NUEVA SECCIÓN: NODOS LUNALES */}
        {data.nodos_lunares && (
          <div className="bg-gradient-to-br from-slate-900/40 to-gray-900/40 rounded-2xl p-8 border border-slate-400/30">
            <h4 className="text-slate-100 font-bold text-xl mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-slate-300" />
              Nodos Lunares (Camino de Vida)
            </h4>
            <div className="space-y-6">
              {data.nodos_lunares.nodo_norte && (
                <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-lg p-6">
                  <h5 className="text-green-200 font-semibold text-lg mb-3">⬆️ Nodo Norte (Destino y Crecimiento)</h5>

                  {typeof data.nodos_lunares.nodo_norte === 'string' ? (
                    <p className="text-green-50">{data.nodos_lunares.nodo_norte}</p>
                  ) : (
                    <div className="space-y-3">
                      {data.nodos_lunares.nodo_norte.signo_casa && (
                        <p className="text-green-200 text-sm font-semibold">
                          📍 {data.nodos_lunares.nodo_norte.signo_casa}
                        </p>
                      )}

                      {data.nodos_lunares.nodo_norte.direccion_evolutiva && (
                        <div className="bg-green-800/30 rounded-lg p-3">
                          <p className="text-green-200 font-semibold text-sm mb-1">
                            🎯 Dirección Evolutiva:
                          </p>
                          <p className="text-green-50 text-sm">
                            {data.nodos_lunares.nodo_norte.direccion_evolutiva}
                          </p>
                        </div>
                      )}

                      {data.nodos_lunares.nodo_norte.desafio && (
                        <div className="bg-green-800/30 rounded-lg p-3">
                          <p className="text-green-200 font-semibold text-sm mb-1">
                            🚀 Desafío:
                          </p>
                          <p className="text-green-50 text-sm">
                            {data.nodos_lunares.nodo_norte.desafio}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {data.nodos_lunares.nodo_sur && (
                <div className="bg-gradient-to-br from-orange-900/40 to-amber-900/40 rounded-lg p-6">
                  <h5 className="text-orange-200 font-semibold text-lg mb-3">⬇️ Nodo Sur (Pasado y Lecciones)</h5>

                  {typeof data.nodos_lunares.nodo_sur === 'string' ? (
                    <p className="text-orange-50">{data.nodos_lunares.nodo_sur}</p>
                  ) : (
                    <div className="space-y-3">
                      {data.nodos_lunares.nodo_sur.signo_casa && (
                        <p className="text-orange-200 text-sm font-semibold">
                          📍 {data.nodos_lunares.nodo_sur.signo_casa}
                        </p>
                      )}

                      {data.nodos_lunares.nodo_sur.zona_comfort && (
                        <div className="bg-orange-800/30 rounded-lg p-3">
                          <p className="text-orange-200 font-semibold text-sm mb-1">
                            ✅ Zona de Confort:
                          </p>
                          <p className="text-orange-50 text-sm">
                            {data.nodos_lunares.nodo_sur.zona_comfort}
                          </p>
                        </div>
                      )}

                      {data.nodos_lunares.nodo_sur.patron_repetitivo && (
                        <div className="bg-red-900/30 rounded-lg p-3 border border-red-500/30">
                          <p className="text-red-200 font-semibold text-sm mb-1">
                            ⚠️ Patrón Repetitivo:
                          </p>
                          <p className="text-red-50 text-sm">
                            {data.nodos_lunares.nodo_sur.patron_repetitivo}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ✅ SOLAR RETURN: TEMA CENTRAL DEL AÑO */}
        {data.tema_anual && type === 'solar-return' && (
          <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 rounded-2xl p-8 border border-amber-400/30">
            <h4 className="text-amber-100 font-bold text-xl mb-4 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-amber-300" />
              Tema Central del Año
            </h4>
            <p className="text-amber-50 text-2xl leading-relaxed font-bold text-center italic">
              "{data.tema_anual}"
            </p>
          </div>
        )}

        {/* ✅ SOLAR RETURN: ANÁLISIS TÉCNICO PROFESIONAL */}
        {data.analisis_tecnico && type === 'solar-return' && (
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white text-center mb-8">
              📊 Análisis Técnico Profesional
            </h3>

            {/* ASC SR en Casa Natal */}
            {data.analisis_tecnico.asc_sr_en_casa_natal && (
              <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 rounded-2xl p-8 border border-indigo-400/30">
                <h4 className="text-indigo-100 font-bold text-2xl mb-4">
                  🎯 Ascendente Solar Return en Casa {data.analisis_tecnico.asc_sr_en_casa_natal.casa_natal} Natal
                </h4>
                <p className="text-indigo-200 text-sm mb-3">
                  Signo: {data.analisis_tecnico.asc_sr_en_casa_natal.signo_asc_sr}
                </p>
                <p className="text-indigo-50 text-lg leading-relaxed mb-4">
                  {data.analisis_tecnico.asc_sr_en_casa_natal.interpretacion}
                </p>
                {data.analisis_tecnico.asc_sr_en_casa_natal.palabras_clave && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {data.analisis_tecnico.asc_sr_en_casa_natal.palabras_clave.map((palabra: string, i: number) => (
                      <span key={i} className="bg-indigo-600/40 text-indigo-100 px-3 py-1 rounded-full text-sm font-semibold">
                        {palabra}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sol en Casa SR */}
            {data.analisis_tecnico.sol_en_casa_sr && (
              <div className="bg-gradient-to-br from-yellow-900/40 to-amber-900/40 rounded-2xl p-8 border border-yellow-400/30">
                <h4 className="text-yellow-100 font-bold text-2xl mb-4">
                  ☀️ Sol en Casa {data.analisis_tecnico.sol_en_casa_sr.casa_sr} Solar Return
                </h4>
                <p className="text-yellow-200 text-sm mb-3">
                  Casa Natal del Sol: {data.analisis_tecnico.sol_en_casa_sr.casa_natal_sol} |
                  {data.analisis_tecnico.sol_en_casa_sr.cambio_de_casa ? ' ⚡ Casa cambió' : ' ✓ Misma casa'}
                </p>
                <p className="text-yellow-50 text-lg leading-relaxed mb-4">
                  {data.analisis_tecnico.sol_en_casa_sr.interpretacion}
                </p>
                {data.analisis_tecnico.sol_en_casa_sr.energia_disponible && (
                  <div className="bg-yellow-800/30 rounded-lg p-4 mt-4">
                    <p className="text-yellow-100 font-semibold">
                      💪 Energía Disponible: {data.analisis_tecnico.sol_en_casa_sr.energia_disponible}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Planetas Angulares */}
            {data.analisis_tecnico.planetas_angulares_sr && data.analisis_tecnico.planetas_angulares_sr.length > 0 && (
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-2xl p-8 border border-purple-400/30">
                <h4 className="text-purple-100 font-bold text-2xl mb-6">
                  ⭐ Planetas Angulares (Los Más Poderosos del Año)
                </h4>
                <div className="space-y-4">
                  {data.analisis_tecnico.planetas_angulares_sr.map((planeta: any, i: number) => (
                    <div key={i} className="bg-purple-800/30 rounded-lg p-4">
                      <h5 className="text-purple-200 font-bold text-lg mb-2">
                        {planeta.planeta} en {planeta.angulo}
                      </h5>
                      <p className="text-purple-50">{planeta.interpretacion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ✅ SOLAR RETURN: CALENDARIO LUNAR ANUAL */}
        {data.calendario_lunar && type === 'solar-return' && (
          <div className="bg-gradient-to-br from-slate-900/60 to-slate-800/60 rounded-2xl p-8 border border-slate-400/30">
            <h3 className="text-3xl font-bold text-white text-center mb-8">
              🌙 Calendario Lunar Anual 2025-2026
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.calendario_lunar.map((mes: any, i: number) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-500/20">
                  <h4 className="text-slate-100 font-bold text-lg mb-3">{mes.mes}</h4>

                  {mes.luna_nueva && (
                    <div className="mb-3 p-3 bg-blue-900/30 rounded-lg">
                      <p className="text-blue-200 font-semibold text-sm">🌑 Luna Nueva</p>
                      <p className="text-blue-100 text-xs">{mes.luna_nueva.fecha}</p>
                      <p className="text-blue-100 text-sm">{mes.luna_nueva.signo}</p>
                      <p className="text-blue-50 text-xs mt-2">{mes.luna_nueva.mensaje}</p>
                    </div>
                  )}

                  {mes.luna_llena && (
                    <div className="p-3 bg-yellow-900/30 rounded-lg">
                      <p className="text-yellow-200 font-semibold text-sm">🌕 Luna Llena</p>
                      <p className="text-yellow-100 text-xs">{mes.luna_llena.fecha}</p>
                      <p className="text-yellow-100 text-sm">{mes.luna_llena.signo}</p>
                      <p className="text-yellow-50 text-xs mt-2">{mes.luna_llena.mensaje}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ SOLAR RETURN: EVENTOS CLAVE DEL AÑO */}
        {data.eventos_clave && type === 'solar-return' && (
          <div className="bg-gradient-to-br from-rose-900/40 to-red-900/40 rounded-2xl p-8 border border-rose-400/30">
            <h3 className="text-3xl font-bold text-white text-center mb-8">
              📅 Eventos Clave del Año
            </h3>
            <div className="space-y-6">
              {data.eventos_clave.map((evento: any, i: number) => (
                <div key={i} className="bg-rose-800/30 rounded-xl p-6 border border-rose-500/20">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-rose-100 font-bold text-lg">{evento.evento}</h4>
                    <span className="bg-rose-600/40 text-rose-100 px-3 py-1 rounded-full text-xs">
                      {evento.periodo}
                    </span>
                  </div>
                  <p className="text-rose-200 text-sm mb-2">Tipo: {evento.tipo}</p>
                  <p className="text-rose-50 leading-relaxed mb-4">{evento.descripcion}</p>
                  {evento.accion_recomendada && (
                    <div className="bg-green-900/30 rounded-lg p-3">
                      <p className="text-green-200 font-semibold text-sm">🎯 Acción Recomendada:</p>
                      <p className="text-green-50 text-sm">{evento.accion_recomendada}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NUEVA SECCIÓN: PLANETAS INDIVIDUALES */}
        {data.planetas && Object.keys(data.planetas).length > 0 && (
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white text-center mb-8">
              🪐 Tu Mapa Planetario Completo
            </h3>

            {Object.entries(data.planetas).map(([planetKey, planetData]: [string, any]) => (
              <div
                key={planetKey}
                className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-6 border border-indigo-400/20"
              >
                {planetData.titulo && (
                  <h4 className="text-indigo-100 font-bold text-xl mb-4">
                    {planetData.titulo}
                  </h4>
                )}

                {planetData.posicion_tecnica && (
                  <p className="text-indigo-300 text-sm mb-3 font-mono">
                    📍 {planetData.posicion_tecnica}
                  </p>
                )}

                {planetData.descripcion && (
                  <div className="text-indigo-50 leading-relaxed mb-4 whitespace-pre-line">
                    {planetData.descripcion}
                  </div>
                )}

                {planetData.poder_especifico && (
                  <div className="bg-indigo-800/30 rounded-lg p-4 mb-3">
                    <p className="text-indigo-200 font-semibold text-sm mb-1">⚡ TU SUPERPODER:</p>
                    <p className="text-indigo-50">{planetData.poder_especifico}</p>
                  </div>
                )}

                {planetData.accion_inmediata && (
                  <div className="bg-green-900/30 rounded-lg p-4 mb-3">
                    <p className="text-green-200 font-semibold text-sm mb-1">🎯 ACCIÓN HOY:</p>
                    <p className="text-green-50">{planetData.accion_inmediata}</p>
                  </div>
                )}

                {planetData.ritual && (
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <p className="text-purple-200 font-semibold text-sm mb-1">🕯️ RITUAL:</p>
                    <p className="text-purple-50">{planetData.ritual}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {data.plan_accion && (
          <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 rounded-2xl p-8 border border-orange-400/30">
            <h4 className="text-orange-100 font-bold text-xl mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-orange-300" />
              Plan de Acción Inmediato
            </h4>
            
            {data.plan_accion.hoy_mismo && (
              <div className="mb-6">
                <h5 className="text-orange-200 font-bold text-lg mb-3">🔥 HOY MISMO:</h5>
                <ul className="space-y-3">
                  {data.plan_accion.hoy_mismo.map((accion: string, index: number) => (
                    <li key={index} className="text-orange-50 flex items-start gap-3">
                      <span className="text-orange-400 font-bold text-lg">•</span>
                      <span className="font-medium">{accion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.plan_accion.esta_semana && (
              <div className="mb-6">
                <h5 className="text-orange-200 font-bold text-lg mb-3">⚡ ESTA SEMANA:</h5>
                <ul className="space-y-3">
                  {data.plan_accion.esta_semana.map((accion: string, index: number) => (
                    <li key={index} className="text-orange-50 flex items-start gap-3">
                      <span className="text-orange-400 font-bold text-lg">•</span>
                      <span className="font-medium">{accion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.plan_accion.este_mes && (
              <div>
                <h5 className="text-orange-200 font-bold text-lg mb-3">🚀 ESTE MES:</h5>
                <ul className="space-y-3">
                  {data.plan_accion.este_mes.map((accion: string, index: number) => (
                    <li key={index} className="text-orange-50 flex items-start gap-3">
                      <span className="text-orange-400 font-bold text-lg">•</span>
                      <span className="font-medium">{accion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {data.declaracion_poder && (
          <div className="bg-gradient-to-br from-emerald-900/40 to-green-900/40 rounded-2xl p-8 border border-emerald-400/30">
            <h4 className="text-emerald-100 font-bold text-xl mb-4 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-emerald-300" />
              Declaración de Poder Personal
            </h4>
            <div className="bg-emerald-800/30 rounded-xl p-6 border border-emerald-400/20">
              <p className="text-emerald-50 text-lg leading-relaxed font-bold italic">
                "{data.declaracion_poder}"
              </p>
            </div>
          </div>
        )}

        {data.advertencias && (
          <div className="bg-gradient-to-br from-red-900/40 to-rose-900/40 rounded-2xl p-8 border border-red-400/30">
            <h4 className="text-red-100 font-bold text-xl mb-4">⚠️ Advertencias Brutalmente Honestas</h4>
            <ul className="space-y-3">
              {data.advertencias.map((advertencia: string, index: number) => (
                <li key={index} className="text-red-50 flex items-start gap-3">
                  <span className="text-red-400 font-bold text-lg">⚠️</span>
                  <span className="font-medium">{advertencia}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.insights_transformacionales && (
          <div className="bg-green-900/30 rounded-xl p-6">
            <h4 className="text-green-200 font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Insights Transformacionales
            </h4>
            <ul className="space-y-2">
              {data.insights_transformacionales.map((insight: string, index: number) => (
                <li key={index} className="text-green-100 flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.rituales_recomendados && (
          <div className="bg-violet-900/30 rounded-xl p-6">
            <h4 className="text-violet-200 font-semibold mb-3">
              Rituales Recomendados
            </h4>
            <ul className="space-y-2">
              {data.rituales_recomendados.map((ritual: string, index: number) => (
                <li key={index} className="text-violet-100 flex items-start gap-2">
                  <span className="text-violet-400 mt-1">•</span>
                  {ritual}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ✅ SOLAR RETURN: INTEGRACIÓN FINAL */}
        {data.integracion_final && type === 'solar-return' && (
          <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 rounded-2xl p-8 border border-emerald-400/30">
            <h3 className="text-3xl font-bold text-white text-center mb-8">
              🌟 Integración Final
            </h3>

            {data.integracion_final.sintesis && (
              <div className="mb-6">
                <h4 className="text-emerald-200 font-bold text-xl mb-3">Síntesis del Año</h4>
                <p className="text-emerald-50 text-lg leading-relaxed">
                  {data.integracion_final.sintesis}
                </p>
              </div>
            )}

            {data.integracion_final.pregunta_reflexion && (
              <div className="bg-emerald-800/30 rounded-xl p-6 border border-emerald-400/20">
                <p className="text-emerald-200 font-semibold mb-2">💭 Pregunta para Reflexionar:</p>
                <p className="text-emerald-50 text-lg italic">
                  "{data.integracion_final.pregunta_reflexion}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (checkingCache) {
    return (
      <div className={`${className} space-y-2`}>
        <div className="w-full p-4 bg-purple-900/30 rounded-lg border border-purple-500/30">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-4 h-4 mr-2 animate-spin text-purple-400" />
            <span className="text-purple-200 text-sm">Verificando interpretaciones guardadas...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${className} space-y-2`}>
        
        {hasRecentInterpretation && interpretation ? (
          <>
            <Button
              onClick={(e) => {
                e.stopPropagation(); // Prevenir que se cierre un tooltip padre
                setShowModal(true);
              }}
              className={`w-full ${isNatal
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
              }`}
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Interpretación Revolucionaria
              <span className="ml-2 bg-white/20 text-xs px-2 py-1 rounded-full">
                {interpretation.cached ? getTimeSinceGeneration(interpretation.generatedAt) : 'Nueva'}
              </span>
            </Button>
            
            {isAdmin && (
              <>
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevenir que se cierre un tooltip padre
                    generateInterpretation(true);
                  }}
                  disabled={loading}
                  variant="outline"
                  className={`w-full ${isNatal
                    ? 'border-blue-400 text-blue-300 hover:bg-blue-400/20'
                    : 'border-purple-400 text-purple-300 hover:bg-purple-400/20'
                  }`}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Regenerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      🔑 Regenerar Nueva (Admin)
                    </>
                  )}
                </Button>

                {isNatal && (
                  <Button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!confirm('⚠️ Esto borrará el cache y regenerará con la estructura completa nueva. ¿Continuar?')) {
                        return;
                      }

                      try {
                        // Delete cache first
                        const deleteRes = await fetch(
                          `/api/astrology/interpret-natal-complete?userId=${userId}`,
                          { method: 'DELETE' }
                        );

                        if (deleteRes.ok) {
                          console.log('✅ Cache borrado exitosamente');
                          // Force regeneration
                          generateInterpretation(true);
                        }
                      } catch (error) {
                        console.error('❌ Error borrando cache:', error);
                        alert('Error borrando cache');
                      }
                    }}
                    disabled={loading}
                    variant="outline"
                    className="w-full border-red-400 text-red-300 hover:bg-red-400/20"
                  >
                    🗑️ Limpiar Cache + Regenerar
                  </Button>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <Button
              onClick={(e) => {
                e.stopPropagation(); // Prevenir que se cierre un tooltip padre
                generateInterpretation(false);
              }}
              disabled={loading}
              className={`w-full ${isNatal
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              }`}
              data-interpret-button
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generando Interpretación Revolucionaria...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  {isNatal ? 'Interpretar Carta Natal Disruptiva' :
                   isSolarReturn ? 'Interpretar Solar Return Revolucionario' :
                   'Interpretar Evolución Solar'}
                </>
              )}
            </Button>

            {isAdmin && (
              <Button
                onClick={(e) => {
                  e.stopPropagation(); // Prevenir que se cierre un tooltip padre
                  generateInterpretation(true);
                }}
                disabled={loading}
                variant="outline"
                className={`w-full mt-2 ${isNatal
                  ? 'border-yellow-400 text-yellow-300 hover:bg-yellow-400/20'
                  : 'border-yellow-400 text-yellow-300 hover:bg-yellow-400/20'
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Regenerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    🔑 Regenerar Nueva (Admin)
                  </>
                )}
              </Button>
            )}
          </>
        )}

        {savedInterpretations.length > 1 && (
          <div className="mt-3">
            <p className="text-gray-400 text-xs mb-2">Interpretaciones anteriores:</p>
            <div className="space-y-1">
              {savedInterpretations.slice(1, 3).map((saved) => (
                <button
                  key={saved._id}
                  onClick={() => loadSpecificInterpretation(saved)}
                  className="w-full text-left p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded text-xs text-gray-300 hover:text-white transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span>{new Date(saved.generatedAt).toLocaleDateString('es-ES')}</span>
                    <Clock className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-900/30 border border-red-400/30 rounded-lg">
            <p className="text-red-200 text-sm">{error}</p>
            <Button
              onClick={() => generateInterpretation(true)}
              size="sm"
              className="mt-2 bg-red-600 hover:bg-red-700"
            >
              Reintentar
            </Button>
          </div>
        )}
      </div>

      {/* ✅ REGENERATION LOADING MODAL */}
      {regenerating && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 rounded-3xl max-w-md w-full p-8 shadow-2xl border-2 border-purple-400/50 animate-pulse-slow">
            <div className="text-center space-y-6">
              {/* Animated Icon */}
              <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                <div className="absolute inset-2 bg-purple-900 rounded-full flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-purple-300 animate-pulse" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white">
                🔮 Regenerando tu Revolución Cósmica
              </h3>

              {/* Progress Message */}
              <div className="bg-purple-800/50 rounded-xl p-4 border border-purple-400/30">
                <p className="text-purple-100 text-lg font-semibold animate-pulse">
                  {generationProgress}
                </p>
                {currentChunk && (
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <span className="text-purple-300 text-sm font-medium">
                      {currentChunk}
                    </span>
                  </div>
                )}
                <div className="mt-3 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-purple-300" />
                  <span className="text-purple-200 text-sm">
                    Tiempo transcurrido: {waitTime}s
                  </span>
                </div>
                {chunkProgress > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-purple-200 text-xs">Progreso</span>
                      <span className="text-purple-200 text-xs">{chunkProgress}%</span>
                    </div>
                    <div className="w-full bg-purple-950/50 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500 ease-out"
                        style={{ width: `${chunkProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Info Text */}
              <div className="space-y-3 text-purple-200 text-sm">
                <p className="flex items-center justify-center gap-2">
                  <span className="animate-bounce">⚡</span>
                  Estamos consultando los astros...
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span className="animate-bounce delay-100">🌟</span>
                  Generando interpretación única con IA
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span className="animate-bounce delay-200">🎯</span>
                  Esto puede tardar 10-30 segundos
                </p>
              </div>

              {/* Loading Bar */}
              <div className="w-full bg-purple-950/50 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 h-full animate-loading-bar"></div>
              </div>

              <p className="text-purple-300 text-xs italic">
                💫 "La paciencia cósmica será recompensada con sabiduría estelar"
              </p>
            </div>
          </div>
        </div>
      )}

      {showModal && interpretation && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl max-w-6xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-purple-500/30">
            
            <div className={`p-6 ${isNatal 
              ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-blue-400/20' 
              : 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-purple-400/20'
            } rounded-t-2xl`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center">
                  {isNatal ? (
                    <Star className="w-6 h-6 text-blue-400 mr-3" />
                  ) : (
                    <Sparkles className="w-6 h-6 text-purple-400 mr-3" />
                  )}
                  <div>
                    <div role="heading" aria-level={3} className="text-2xl font-bold text-white">
                      {isNatal ? 'Interpretación Revolucionaria Natal' :
                       isSolarReturn ? 'Solar Return Revolucionario' :
                       'Evolución Solar Disruptiva'}
                    </div>
                    <p className="text-purple-200 text-sm">
                      {userProfile.name} • {new Date(interpretation.generatedAt).toLocaleDateString('es-ES')}
                      {interpretation.cached && (
                        <span className="ml-2 bg-green-600/30 text-green-200 px-2 py-1 rounded-full text-xs">
                          Desde caché • {getTimeSinceGeneration(interpretation.generatedAt)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    onClick={() => {
                      // ✅ Don't close modal - keep it open and start regeneration
                      generateInterpretation(true);
                    }}
                    size="sm"
                    className="bg-yellow-600 hover:bg-yellow-700"
                    disabled={loading || regenerating}
                  >
                    {regenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                        Regenerando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Regenerar
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleCopyToClipboard}
                    size="sm"
                    className={copied ? "bg-green-600" : "bg-gray-600 hover:bg-gray-700"}
                  >
                    {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                    {copied ? 'Copiado' : 'Copiar'}
                  </Button>

                  <Button
                    onClick={handleDownloadText}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    TXT
                  </Button>

                  <Button
                    onClick={() => setShowModal(false)}
                    size="sm"
                    variant="outline"
                    className="border-gray-400 text-gray-300 hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar" ref={modalContentRef}>
              {renderInterpretationContent()}
            </div>

            <div className="p-4 border-t border-purple-500/30 bg-gray-900/50 rounded-b-2xl">
              <p className="text-purple-300 text-sm text-center">
                Interpretación personalizada revolucionaria • Generada el {new Date(interpretation.generatedAt).toLocaleDateString('es-ES')}
                {interpretation.cached && ' • Desde caché para ahorrar créditos'}
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.6);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.8);
        }

        /* ✅ ADD THESE ANIMATIONS */
        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .delay-100 {
          animation-delay: 100ms;
        }

        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </>
  );
};

export default InterpretationButton;