// src/components/astrology/InterpretationButton.tsx
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
  className = ""
}) => {
  const [interpretation, setInterpretation] = useState<InterpretationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingCache, setCheckingCache] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedInterpretations, setSavedInterpretations] = useState<SavedInterpretation[]>([]);
  const [hasRecentInterpretation, setHasRecentInterpretation] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const isNatal = type === 'natal';
  const isSolarReturn = type === 'solar-return';
  const endpoint = isNatal ? '/api/astrology/interpret-natal' :
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
      const response = await fetch(`/api/interpretations/save?userId=${userId}&chartType=${type}`);
      if (response.ok) {
        const data = await response.json();
        setSavedInterpretations(data.interpretations || []);
        
        if (data.interpretations && data.interpretations.length > 0) {
          const latest = data.interpretations[0];
          const generatedTime = new Date(latest.generatedAt).getTime();
          const now = new Date().getTime();
          const hoursDiff = (now - generatedTime) / (1000 * 60 * 60);
          
          const isRecent = hoursDiff < 24;
          setHasRecentInterpretation(isRecent);
          
          if (isRecent) {
            setInterpretation({
              interpretation: latest.interpretation,
              cached: true,
              generatedAt: latest.generatedAt,
              method: 'cached'
            });
            console.log(`✅ Interpretación ${type} cargada desde caché (${hoursDiff.toFixed(1)}h ago)`);
          } else {
            console.log(`⚠️ Interpretación ${type} expirada (${hoursDiff.toFixed(1)}h ago) - se generará nueva`);
          }
        }
      }
    } catch (error) {
      console.error('Error cargando interpretaciones guardadas:', error);
    } finally {
      setCheckingCache(false);
    }
  };

  const generateInterpretation = async (forceRegenerate = false) => {
    if (hasRecentInterpretation && interpretation && !forceRegenerate) {
      console.log('🔄 Usando interpretación existente para evitar gasto de créditos');
      setShowModal(true);
      return;
    }

    if (!userId || !chartData) {
      setError('Datos insuficientes para generar interpretación');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`🤖 Generando nueva interpretación ${type} (forzada: ${forceRegenerate})`);

      const requestBody = isNatal
        ? {
            userId,
            natalChart: chartData,
            userProfile,
            regenerate: forceRegenerate,
            disruptiveMode: true
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

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Error generando interpretación');
      }

      const result = await response.json();

      // ✅ LOGS DE DEBUGGING
      console.log('🔍 ===== DEBUGGING RESPUESTA ENDPOINT =====');
      console.log('🔍 result completo:', result);
      console.log('🔍 result.success:', result.success);
      console.log('🔍 result.data:', result.data);
      console.log('🔍 result.data?.interpretation (primeras claves):', 
        result.data?.interpretation ? Object.keys(result.data.interpretation) : 'NO EXISTE');
      console.log('🔍 Esencia en result.data.interpretation:', 
        result.data?.interpretation?.esencia_revolucionaria);
      console.log('🔍 Esencia en result.interpretation:', 
        result.interpretation?.esencia_revolucionaria);

      if (result.success) {
        const newInterpretation = {
          interpretation: result.data?.interpretation || result.interpretation,
          cached: false,
          generatedAt: result.data?.generatedAt || new Date().toISOString(),
          method: result.data?.method || 'api'
        };

        // ✅ LOG DEL ESTADO QUE SE VA A SETEAR
        console.log('📺 ===== ESTADO QUE SE VA A SETEAR =====');
        console.log('📺 newInterpretation completo:', newInterpretation);
        console.log('📺 Esencia que se mostrará:', 
          newInterpretation.interpretation?.esencia_revolucionaria);
        console.log('📺 Propósito que se mostrará:', 
          newInterpretation.interpretation?.proposito_vida);
        console.log('📺 Tiene plan_accion:', 
          !!newInterpretation.interpretation?.plan_accion);

        setInterpretation(newInterpretation);
        setHasRecentInterpretation(true);
        setShowModal(true);

        // Auto-guardar la nueva interpretación
        await autoSaveInterpretation(newInterpretation);

        console.log('✅ Nueva interpretación generada y guardada');
        
        // ✅ VERIFICACIÓN FINAL DEL ESTADO
        console.log('🎯 ===== VERIFICACIÓN FINAL =====');
        console.log('🎯 Estado interpretation actual:', interpretation);
        console.log('🎯 hasRecentInterpretation:', hasRecentInterpretation);
      } else {
        throw new Error(result.error || 'Error desconocido');
      }

    } catch (err) {
      console.error('❌ Error en generateInterpretation:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const autoSaveInterpretation = async (interpretationData: InterpretationData) => {
    try {
      console.log('💾 ===== GUARDANDO EN MONGODB =====');
      console.log('💾 Datos a guardar:', {
        userId,
        chartType: type,
        tieneInterpretacion: !!interpretationData.interpretation,
        esencia: interpretationData.interpretation?.esencia_revolucionaria
      });

      const response = await fetch('/api/interpretations/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          chartType: type,
          interpretation: interpretationData.interpretation,
          userProfile,
          generatedAt: interpretationData.generatedAt || new Date().toISOString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Interpretación guardada en MongoDB:', data);

        // ✅ RECARGAR LISTA
        console.log('🔄 Recargando lista de interpretaciones guardadas...');
        await loadSavedInterpretations();
        
        // ✅ FORZAR ACTUALIZACIÓN DEL ESTADO
        setInterpretation(prev => {
          const updated = {
            ...prev!,
            interpretation: interpretationData.interpretation,
            cached: false,
            generatedAt: interpretationData.generatedAt || new Date().toISOString()
          };
          
          console.log('🔄 Estado actualizado después de guardar:', {
            esencia: updated.interpretation?.esencia_revolucionaria,
            cached: updated.cached,
            generatedAt: updated.generatedAt
          });
          
          return updated;
        });

        console.log('✅ Lista de interpretaciones recargada y estado actualizado');
      } else {
        const errorText = await response.text();
        console.error('❌ Error guardando en MongoDB:', errorText);
      }
    } catch (error) {
      console.error('❌ Error en autoSave:', error);
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
      console.log('⚠️ renderInterpretationContent: NO HAY INTERPRETATION');
      return null;
    }

    const data = interpretation.interpretation;
    
    // ✅ LOG AL RENDERIZAR
    console.log('🎨 ===== RENDERIZANDO INTERPRETACIÓN =====');
    console.log('🎨 Esencia a renderizar:', data.esencia_revolucionaria);
    console.log('🎨 Propósito a renderizar:', data.proposito_vida);

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
                {/* Título del Planeta */}
                {planetData.titulo && (
                  <h4 className="text-indigo-100 font-bold text-xl mb-4">
                    {planetData.titulo}
                  </h4>
                )}

                {/* Posición Técnica */}
                {planetData.posicion_tecnica && (
                  <p className="text-indigo-300 text-sm mb-3 font-mono">
                    📍 {planetData.posicion_tecnica}
                  </p>
                )}

                {/* Descripción */}
                {planetData.descripcion && (
                  <div className="text-indigo-50 leading-relaxed mb-4 whitespace-pre-line">
                    {planetData.descripcion}
                  </div>
                )}

                {/* Poder Específico */}
                {planetData.poder_especifico && (
                  <div className="bg-indigo-800/30 rounded-lg p-4 mb-3">
                    <p className="text-indigo-200 font-semibold text-sm mb-1">⚡ TU SUPERPODER:</p>
                    <p className="text-indigo-50">{planetData.poder_especifico}</p>
                  </div>
                )}

                {/* Acción Inmediata */}
                {planetData.accion_inmediata && (
                  <div className="bg-green-900/30 rounded-lg p-4 mb-3">
                    <p className="text-green-200 font-semibold text-sm mb-1">🎯 ACCIÓN HOY:</p>
                    <p className="text-green-50">{planetData.accion_inmediata}</p>
                  </div>
                )}

                {/* Ritual */}
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
                  Generar Nueva Interpretación Disruptiva
                </>
              )}
            </Button>
          </>
        ) : (
          <Button
            onClick={() => generateInterpretation(false)}
            disabled={loading}
            className={`w-full ${isNatal 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
            }`}
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
                 'Interpretar Evolución Progresada'}
              </>
            )}
          </Button>
        )}

        {savedInterpretations.length > 1 && (
          <div className="mt-3">
            <p className="text-gray-400 text-xs mb-2">Interpretaciones anteriores:</p>
            <div className="space-y-1">
              {savedInterpretations.slice(1, 3).map((saved, index) => (
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
                    <h3 className="text-2xl font-bold text-white">
                      {isNatal ? 'Interpretación Revolucionaria Natal' :
                       isSolarReturn ? 'Solar Return Revolucionario' :
                       'Evolución Progresada Disruptiva'}
                    </h3>
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
                      setShowModal(false);
                      setTimeout(() => generateInterpretation(true), 300);
                    }}
                    size="sm"
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Regenerar
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
      `}</style>
    </>
  );
};

export default InterpretationButton;