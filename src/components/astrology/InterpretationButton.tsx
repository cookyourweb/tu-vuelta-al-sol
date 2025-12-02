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

  // ✅ ADD WAIT TIME COUNTER EFFECT - Works for BOTH loading AND regenerating
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if ((loading || regenerating) && generationStartTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - generationStartTime) / 1000);
        setWaitTime(elapsed);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading, regenerating, generationStartTime]);

  const isNatal = type === 'natal';
  const isSolarReturn = type === 'solar-return';
  // ✅ FIX: Usar interpret-natal-clean para la interpretación revolucionaria completa
  // interpret-natal-clean usa el prompt disruptivo con advertencias, insights, rituales, etc.
  const endpoint = isNatal ? '/api/astrology/interpret-natal-clean' :
                isSolarReturn ? '/api/astrology/interpret-solar-return' :
                '/api/astrology/interpret-progressed';

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

      const response = await fetch(`/api/interpretations/save?userId=${userId}&chartType=${type}`);

      console.log(`📡 Respuesta API: ${response.status}`);

      if (!response.ok) {
        // 404 = No interpretation found (normal on first load)
        if (response.status === 404) {
          console.log('ℹ️ No hay interpretación guardada aún (primera vez) - generando automáticamente');
          setSavedInterpretations([]);
          setHasRecentInterpretation(false);
          // ✅ Automatically generate interpretation when not found
          generateInterpretation(false);
          return;
        }

        console.error(`❌ Error en respuesta API: ${response.status}`);
        setSavedInterpretations([]);
        setHasRecentInterpretation(false);
        return;
      }

      const data = await response.json();
      console.log(`📦 Datos completos recibidos:`, data);
      console.log(`📦 data.success:`, data.success);
      console.log(`📦 data.interpretation exists:`, !!data.interpretation);
      console.log(`📦 data.generatedAt:`, data.generatedAt);

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
          } else if (type === 'natal') {
            // ✅ VALIDATE NATAL: Check for DISRUPTIVE PROMPT sections
            console.log(`✅ Esencia revolucionaria:`,
              data.interpretation.esencia_revolucionaria?.substring(0, 100) || 'NOT FOUND');
            console.log(`✅ Propósito de vida:`,
              data.interpretation.proposito_vida?.substring(0, 100) || 'NOT FOUND');
            console.log(`✅ Advertencias:`,
              data.interpretation.advertencias ? `SÍ (${data.interpretation.advertencias.length} items)` : 'NO');
            console.log(`✅ Insights transformacionales:`,
              data.interpretation.insights_transformacionales ? `SÍ (${data.interpretation.insights_transformacionales.length} items)` : 'NO');
            console.log(`✅ Rituales recomendados:`,
              data.interpretation.rituales_recomendados ? `SÍ (${data.interpretation.rituales_recomendados.length} items)` : 'NO');

            // ✅ CRITICAL: Check if this is an OLD interpretation without disruptive sections
            // NOTE: The disruptive prompt generates: advertencias, insights_transformacionales
            // rituales_recomendados is optional (only in fallback, not in AI prompt)
            const hasDisruptiveSections =
              data.interpretation.advertencias &&
              data.interpretation.advertencias.length > 0 &&
              data.interpretation.insights_transformacionales &&
              data.interpretation.insights_transformacionales.length > 0;

            if (!hasDisruptiveSections) {
              console.warn('⚠️ ===== INTERPRETACIÓN ANTIGUA DETECTADA =====');
              console.warn('⚠️ La interpretación no tiene secciones del prompt disruptivo');
              console.warn('⚠️ Falta: advertencias, insights_transformacionales, rituales_recomendados');
              console.warn('⚠️ Se forzará regeneración para obtener versión disruptiva completa');
              setHasRecentInterpretation(false);
              setSavedInterpretations([]);
              return; // Don't load old/broken cache - will force regeneration
            }

            console.log('✅ Interpretación natal tiene todas las secciones disruptivas');
          } else {
            console.log(`✅ Esencia revolucionaria:`,
              data.interpretation.esencia_revolucionaria?.substring(0, 100) || 'NOT FOUND');
            console.log(`✅ Propósito de vida:`,
              data.interpretation.proposito_vida?.substring(0, 100) || 'NOT FOUND');
          }

          setInterpretation(cachedInterpretation);
          console.log(`✅ Interpretación ${type} cargada desde caché exitosamente`);
          console.log(`✅ hasRecentInterpretation set to: true`);
          console.log(`✅ interpretation set to:`, cachedInterpretation ? 'object' : 'null');
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
      console.log(`🏁 ===== CARGA FINALIZADA =====`);
      console.log(`🏁 checkingCache: false`);
    }
  };

  const generateInterpretation = async (forceRegenerate = false) => {
    console.log('🎯 ===== GENERATE INTERPRETATION CALLED =====');
    console.log('🎯 forceRegenerate:', forceRegenerate);
    console.log('🎯 hasRecentInterpretation:', hasRecentInterpretation);
    console.log('🎯 interpretation:', interpretation ? 'exists' : 'null');

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

    // ✅ Initialize loading states for BOTH first generation AND force regenerate
    if (forceRegenerate) {
      setRegenerating(true);
      setGenerationProgress('Iniciando regeneración revolucionaria...');
    } else {
      setLoading(true);
      setGenerationProgress('Iniciando interpretación revolucionaria...');
    }

    // ✅ Always initialize timing and progress tracking
    setGenerationStartTime(Date.now());
    setChunkProgress(0);
    setCurrentChunk('');

    setError(null);

    try {
      console.log(`🤖 ===== GENERANDO NUEVA INTERPRETACIÓN =====`);
      console.log(`🤖 Tipo: ${type}, Forzada: ${forceRegenerate}`);
      console.log(`🤖 userId: ${userId}`);
      console.log(`🤖 userProfile:`, userProfile);

      // ✅ CHUNKED GENERATION FOR FASTER RESULTS
      if (forceRegenerate && type === 'natal') {
        console.log('🔄 ===== GENERANDO EN CHUNKS =====');

        const chunks: Record<string, any> = {};
        const sections = [
          { key: 'esencia', section: 'esencia_revolucionaria', label: 'Esencia Revolucionaria', progress: 20 },
          { key: 'proposito', section: 'proposito_vida', label: 'Propósito de Vida', progress: 40 },
          { key: 'formacion', section: 'formacion_temprana', label: 'Formación Temprana', progress: 60 },
          { key: 'nodos', section: 'nodos_lunares', label: 'Nodos Lunares', progress: 80 },
          { key: 'declaracion', section: 'declaracion_poder', label: 'Declaración de Poder', progress: 100 }
        ];

        for (const { key, section, label, progress } of sections) {
          setCurrentChunk(`Generando ${label}...`);
          setGenerationProgress(`Consultando los astros para ${label.toLowerCase()}...`);

          const chunkResponse = await fetch('/api/astrology/interpret-chunk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              chartData,
              section,
              userProfile,
              type,
              natalChart
            })
          });

          if (!chunkResponse.ok) {
            throw new Error(`Error generando ${label}`);
          }

          const chunkData = await chunkResponse.json();
          chunks[key] = chunkData.data;
          setChunkProgress(progress);

          console.log(`✅ Chunk ${label} completado`);
        }

        // Combine chunks
        const interpretationData = {
          esencia_revolucionaria: chunks['esencia'],
          proposito_vida: chunks['proposito'],
          formacion_temprana: chunks['formacion'],
          nodos_lunares: chunks['nodos'],
          declaracion_poder: chunks['declaracion'],
          planetas: [],
          plan_accion: [],
          advertencias: [],
          insights_transformacionales: [],
          rituales_recomendados: [],
          integracion_carta: ''
        };

        const newInterpretation = {
          interpretation: interpretationData,
          cached: false,
          generatedAt: new Date().toISOString(),
          method: 'chunked'
        };

        console.log('✅ ===== INTERPRETACIÓN EN CHUNKS COMPLETADA =====');

        setInterpretation(newInterpretation);
        setHasRecentInterpretation(true);
        setGenerationProgress('¡Revolución completada! 🎉');
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowModal(true);

        await autoSaveInterpretation(newInterpretation);

      } else {
        // ✅ ORIGINAL SINGLE REQUEST FOR NON-NATAL OR NON-FORCE REGENERATE
        // ✅ Simulate progress messages
        if (forceRegenerate) {
          setTimeout(() => setGenerationProgress('Conectando con los astros...'), 500);
          setTimeout(() => setGenerationProgress('Analizando tu carta natal...'), 2000);
          setTimeout(() => setGenerationProgress('Calculando posiciones planetarias...'), 4000);
          setTimeout(() => setGenerationProgress('Generando interpretación disruptiva con IA...'), 6000);
          setTimeout(() => setGenerationProgress('Casi listo... Creando tu revolución personal...'), 10000);
        }

        const requestBody = isNatal
          ? {
              userId,
              natalChart: chartData,  // ✅ FIX: interpret-natal-clean expects 'natalChart'
              userProfile,
              regenerate: forceRegenerate,
              disruptiveMode: true  // ✅ Activar modo disruptivo para usar el prompt completo
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
            progressPercentage += 2; // Incremento más rápido para mejor UX
            setChunkProgress(progressPercentage); // ✅ FIX: Actualizar la barra de progreso

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
        }, 1000); // ✅ FIX: Cada 1 segundo para actualización más fluida

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

          // ✅ FIX: API returns data directly, not data.interpretation
          const rawInterpretation = result.data?.interpretation || result.interpretation || result.data;

          if (!rawInterpretation) {
            console.log('❌ No se encontró interpretación en la respuesta');
            console.log('❌ result keys:', Object.keys(result));
            console.log('❌ result.data keys:', result.data ? Object.keys(result.data) : 'undefined');
            throw new Error('No se encontró interpretación en la respuesta');
          }

          console.log('🔍 ===== DATOS RECIBIDOS =====');
          console.log('🔍 Claves en rawInterpretation:', Object.keys(rawInterpretation));

          // ✅ AÑADIR LOGS PARA VERIFICAR DATOS COMPLETOS
          console.log('🔍 ===== VERIFICANDO DATOS COMPLETOS =====');
          console.log('🔍 formacion_temprana:', rawInterpretation.formacion_temprana ? 'SÍ' : 'NO');
          console.log('🔍 patrones_psicologicos:', rawInterpretation.patrones_psicologicos ? 'SÍ' : 'NO');
          console.log('🔍 planetas_profundos:', rawInterpretation.planetas_profundos ? 'SÍ' : 'NO');
          console.log('🔍 nodos_lunares:', rawInterpretation.nodos_lunares ? 'SÍ' : 'NO');

          // Si están, mostrar un preview
          if (rawInterpretation.formacion_temprana) {
            console.log('📖 formacion_temprana completa:', rawInterpretation.formacion_temprana);
          }

          let interpretationData;

          if (type === 'natal') {
            interpretationData = {
              esencia_revolucionaria: rawInterpretation.esencia_revolucionaria,
              proposito_vida: rawInterpretation.proposito_vida,
              formacion_temprana: rawInterpretation.formacion_temprana,
              patrones_psicologicos: rawInterpretation.patrones_psicologicos,
              planetas_profundos: rawInterpretation.planetas_profundos,
              angulos_vitales: rawInterpretation.angulos_vitales, // ✅ NUEVO: Ascendente y MC
              nodos_lunares: rawInterpretation.nodos_lunares,
              planetas: rawInterpretation.planetas,
              plan_accion: rawInterpretation.plan_accion,
              declaracion_poder: rawInterpretation.declaracion_poder,
              advertencias: rawInterpretation.advertencias,
              insights_transformacionales: rawInterpretation.insights_transformacionales,
              rituales_recomendados: rawInterpretation.rituales_recomendados,
              pregunta_final_reflexion: rawInterpretation.pregunta_final_reflexion, // ✅ NUEVO
              integracion_carta: rawInterpretation.integracion_carta
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
              integracion_final: rawInterpretation.integracion_final,
              // ✅ ADD MISSING SECTIONS FOR COMPLETE SOLAR RETURN DISPLAY
              formacion_temprana: rawInterpretation.formacion_temprana,
              patrones_psicologicos: rawInterpretation.patrones_psicologicos,
              planetas_profundos: rawInterpretation.planetas_profundos,
              angulos_vitales: rawInterpretation.angulos_vitales,
              nodos_lunares: rawInterpretation.nodos_lunares,
              pregunta_final_reflexion: rawInterpretation.pregunta_final_reflexion
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

      // ✅ FIX: Use PUT method to REPLACE existing interpretation (upsert)
      // POST creates duplicates, PUT replaces the existing one
      const response = await fetch('/api/interpretations/save', {
        method: 'PUT',
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
    console.log('🎨 ===== RENDER INTERPRETATION CONTENT =====');
    console.log('🎨 interpretation:', interpretation);
    console.log('🎨 interpretation?.interpretation:', interpretation?.interpretation);

    if (!interpretation?.interpretation) {
      console.log('🎨 ❌ No hay interpretation.interpretation - return null');
      return null;
    }

    const data = interpretation.interpretation;

    // ✅ SAFETY: Ensure data is a plain object and filter out non-renderable properties
    if (typeof data !== 'object' || Array.isArray(data) || data === null) {
      console.log('🎨 ❌ Data is not a valid object - return null');
      return null;
    }

    console.log('🎨 data keys:', Object.keys(data));
    console.log('🎨 data.esencia_revolucionaria:', data.esencia_revolucionaria ? 'EXISTS' : 'NOT FOUND');
    console.log('🎨 data.proposito_vida:', data.proposito_vida ? 'EXISTS' : 'NOT FOUND');
    console.log('🎨 data.planets:', data.planets ? 'EXISTS' : 'NOT FOUND');
    console.log('🎨 Full data:', data);

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
      <p className="text-blue-50 text-lg leading-relaxed font-medium">{data.proposito_vida}</p>
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
              🕯️ Rituales Recomendados
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

        {/* ✅ NUEVA SECCIÓN: ÁNGULOS VITALES */}
        {data.angulos_vitales && (
          <div className="bg-gradient-to-br from-amber-900/40 to-yellow-900/40 rounded-2xl p-8 border border-amber-400/30">
            <h4 className="text-amber-100 font-bold text-xl mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-amber-300" />
              Ángulos Vitales (Ascendente y Medio Cielo)
            </h4>
            <div className="space-y-6">
              {data.angulos_vitales.ascendente && (
                <div className="bg-amber-800/30 rounded-lg p-6">
                  <h5 className="text-amber-200 font-semibold text-lg mb-4">⬆️ Tu Ascendente</h5>
                  <div className="space-y-3">
                    {data.angulos_vitales.ascendente.posicion && (
                      <p className="text-amber-200 text-sm font-semibold">📍 {data.angulos_vitales.ascendente.posicion}</p>
                    )}
                    {data.angulos_vitales.ascendente.mascara_social && (
                      <div className="bg-amber-700/30 rounded-lg p-3">
                        <p className="text-amber-200 font-semibold text-sm mb-1">🎭 Máscara Social:</p>
                        <p className="text-amber-50 text-sm">{data.angulos_vitales.ascendente.mascara_social}</p>
                      </div>
                    )}
                    {data.angulos_vitales.ascendente.superpoder && (
                      <div className="bg-amber-700/30 rounded-lg p-3">
                        <p className="text-amber-200 font-semibold text-sm mb-1">⚡ Superpoder:</p>
                        <p className="text-amber-50 text-sm">{data.angulos_vitales.ascendente.superpoder}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {data.angulos_vitales.medio_cielo && (
                <div className="bg-amber-800/30 rounded-lg p-6">
                  <h5 className="text-amber-200 font-semibold text-lg mb-4">🏔️ Tu Medio Cielo</h5>
                  <div className="space-y-3">
                    {data.angulos_vitales.medio_cielo.posicion && (
                      <p className="text-amber-200 text-sm font-semibold">📍 {data.angulos_vitales.medio_cielo.posicion}</p>
                    )}
                    {data.angulos_vitales.medio_cielo.vocacion_soul && (
                      <div className="bg-amber-700/30 rounded-lg p-3">
                        <p className="text-amber-200 font-semibold text-sm mb-1">✨ Vocación del Alma:</p>
                        <p className="text-amber-50 text-sm">{data.angulos_vitales.medio_cielo.vocacion_soul}</p>
                      </div>
                    )}
                    {data.angulos_vitales.medio_cielo.legado && (
                      <div className="bg-amber-700/30 rounded-lg p-3">
                        <p className="text-amber-200 font-semibold text-sm mb-1">🌟 Legado:</p>
                        <p className="text-amber-50 text-sm">{data.angulos_vitales.medio_cielo.legado}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ✅ NUEVA SECCIÓN: PREGUNTA FINAL DE REFLEXIÓN */}
        {data.pregunta_final_reflexion && (
          <div className="bg-gradient-to-br from-pink-900/40 to-rose-900/40 rounded-2xl p-8 border border-pink-400/30">
            <h4 className="text-pink-100 font-bold text-xl mb-4 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-pink-300" />
              Pregunta Final para tu Reflexión
            </h4>
            <div className="bg-pink-800/30 rounded-xl p-6 border border-pink-400/20">
              <p className="text-pink-50 text-xl leading-relaxed font-medium italic text-center">
                "{data.pregunta_final_reflexion}"
              </p>
            </div>
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
              onClick={() => setShowModal(true)}
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
              <Button
                onClick={() => generateInterpretation(true)}
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
            )}
          </>
        ) : (
          <>
            <Button
              onClick={() => generateInterpretation(false)}
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
                onClick={() => generateInterpretation(true)}
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

      {/* ✅ LOADING MODAL - Shows for BOTH first generation AND regeneration */}
      {(loading || regenerating) && (
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
                🔮 {regenerating ? 'Regenerando tu Revolución Cósmica' : 'Generando tu Revolución Cósmica'}
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