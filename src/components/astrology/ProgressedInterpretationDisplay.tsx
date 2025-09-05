//src/components/astrology/ProgressedInterpretationDisplay.tsx

'use client'
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Atom, Sparkles, TrendingUp, Compass, Star, 
  Zap, Target, Orbit, RefreshCw, Loader2,
  Flame, Mountain, Wind, Waves, BookOpen
} from 'lucide-react';

interface AstrologicalInterpretationProps {
  userId?: string;
  onInterpretationLoaded?: (data: any) => void;
}

interface ConfiguracionDominante {
  patron_evolutivo_principal: string;
  elementos_activados: string[];
  modalidades_activadas: string[];
  energia_general: string;
}

interface AnalisisProgresion {
  planeta: string;
  configuracion_natal: string;
  configuracion_progresada: string;
  significado_arquetipico: string;
  proceso_evolutivo: string;
  energia_trabajar: string;
  energia_integrar: string;
}

interface AstrologicalInterpretationData {
  configuracion_dominante: ConfiguracionDominante;
  analisis_progresiones: AnalisisProgresion[];
  dinamicas_activas: Array<{
    configuracion: string;
    significado_tradicional: string;
    manifestacion_evolutiva: string;
    potencial_desarrollo: string;
    reto_arquetipico: string;
  }>;
  elementos_y_modalidades: {
    distribucion_natal: string;
    distribucion_progresada: string;
    impacto_evolutivo: string;
    equilibrio_necesario: string;
  };
  casas_activadas: Array<{
    casa: string;
    tema_arquetipico: string;
    activacion_actual: string;
    desarrollo_sugerido: string;
  }>;
  ciclos_planetarios: {
    ciclos_completandose: string;
    ciclos_iniciandose: string;
    timing_natural: string;
    preparacion_proxima_fase: string;
  };
  integracion_practica: {
    arquetipos_activar: string;
    energias_canalizar: string;
    elementos_equilibrar: string;
    modalidades_desarrollar: string;
    rituales_arquetipicos: string;
    afirmaciones_planetarias: string[];
  };
  perspectiva_evolutiva: string;
}

export default function ProgressedInterpretationDisplay({ 
  userId, 
  onInterpretationLoaded 
}: AstrologicalInterpretationProps) {
  const { user } = useAuth();
  const [interpretation, setInterpretation] = useState<AstrologicalInterpretationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

  const targetUserId = userId || user?.uid;

  const loadInterpretation = async () => {
    if (!targetUserId) {
      setError('Usuario no identificado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔮 Cargando interpretación astrológica para:', targetUserId);

      const response = await fetch('/api/astrology/progressed-interpretation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: targetUserId,
          focusAreas: ['evolution', 'archetypes', 'cycles']
        }),
      });

      const result = await response.json();

      if (result.success && result.data.interpretation) {
        setInterpretation(result.data.interpretation);
        onInterpretationLoaded?.(result.data);
        console.log('✅ Interpretación astrológica cargada');
      } else {
        throw new Error(result.error || 'Error cargando interpretación');
      }

    } catch (err) {
      console.error('❌ Error cargando interpretación:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targetUserId) {
      loadInterpretation();
    }
  }, [targetUserId]);

  // Función para obtener icono de elemento
  const getElementIcon = (element: string) => {
    const icons = {
      'fuego': <Flame className="w-4 h-4 text-red-400" />,
      'tierra': <Mountain className="w-4 h-4 text-green-400" />,
      'aire': <Wind className="w-4 h-4 text-blue-400" />,
      'agua': <Waves className="w-4 h-4 text-blue-600" />
    };
    return icons[element.toLowerCase() as keyof typeof icons] || <Atom className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="bg-violet-900/20 backdrop-blur-xl border border-violet-700/30 rounded-2xl p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-violet-400 animate-spin" />
            <Orbit className="w-8 h-8 text-violet-600 absolute top-2 left-2 animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-violet-200 text-lg font-medium">Analizando configuración astrológica...</p>
            <p className="text-violet-300 text-sm mt-2">Interpretando patrones evolutivos</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 backdrop-blur-xl border border-red-700/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-red-400 text-2xl">⚠️</div>
          <h3 className="text-red-200 font-semibold">Error en análisis astrológico</h3>
        </div>
        <p className="text-red-300 text-sm mb-4">{error}</p>
        <button 
          onClick={loadInterpretation}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Reintentar Análisis
        </button>
      </div>
    );
  }

  if (!interpretation) {
    return (
      <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6 text-center">
        <p className="text-gray-400 mb-4">No hay análisis astrológico disponible</p>
        <button 
          onClick={loadInterpretation}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Generar Análisis Astrológico
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Configuración Dominante */}
      <div className="bg-gradient-to-r from-purple-900/40 via-violet-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-700/30 rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-purple-600 rounded-full">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">Configuración Astrológica Dominante</h2>
            <p className="text-purple-300">Patrón evolutivo principal</p>
          </div>
          <button 
            onClick={loadInterpretation}
            disabled={loading}
            className="p-2 bg-purple-600/20 hover:bg-purple-600/40 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-purple-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="bg-purple-800/30 rounded-xl p-6 mb-6">
          <h3 className="text-purple-200 font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Patrón Evolutivo Central
          </h3>
          <p className="text-purple-100 leading-relaxed">{interpretation.configuracion_dominante.patron_evolutivo_principal}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-800/20 rounded-lg p-4">
            <h4 className="text-purple-300 font-medium mb-3">Elementos Activados</h4>
            <div className="flex flex-wrap gap-2">
              {interpretation.configuracion_dominante.elementos_activados.map((elemento, index) => (
                <div key={index} className="flex items-center gap-2 bg-purple-700/30 rounded-full px-3 py-1">
                  {getElementIcon(elemento)}
                  <span className="text-purple-100 text-sm capitalize">{elemento}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-purple-800/20 rounded-lg p-4">
            <h4 className="text-purple-300 font-medium mb-3">Modalidades Activas</h4>
            <div className="flex flex-wrap gap-2">
              {interpretation.configuracion_dominante.modalidades_activadas.map((modalidad, index) => (
                <div key={index} className="bg-purple-700/30 rounded-full px-3 py-1">
                  <span className="text-purple-100 text-sm capitalize">{modalidad}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!showFullAnalysis && (
          <button 
            onClick={() => setShowFullAnalysis(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Atom className="w-5 h-5" />
            Ver Análisis Astrológico Completo
          </button>
        )}
      </div>

      {showFullAnalysis && (
        <>
          {/* Análisis de Progresiones */}
          <div className="bg-emerald-900/20 backdrop-blur-xl border border-emerald-700/30 rounded-2xl p-6">
            <h3 className="text-emerald-200 font-semibold mb-4 flex items-center gap-2">
              <Orbit className="w-5 h-5" />
              Análisis de Progresiones Planetarias
            </h3>
            <div className="space-y-4">
              {interpretation.analisis_progresiones.map((progresion, index) => (
                <div key={index} className="bg-emerald-800/30 rounded-lg p-4">
                  <h4 className="text-emerald-300 font-medium mb-2">{progresion.planeta}</h4>
                  <div className="grid md:grid-cols-2 gap-3 text-sm mb-3">
                    <div>
                      <span className="text-emerald-400">Configuración Natal: </span>
                      <span className="text-emerald-100">{progresion.configuracion_natal}</span>
                    </div>
                    <div>
                      <span className="text-emerald-400">Configuración Progresada: </span>
                      <span className="text-emerald-100">{progresion.configuracion_progresada}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-emerald-100 text-sm"><strong>Significado Arquetípico:</strong> {progresion.significado_arquetipico}</p>
                    <p className="text-emerald-200 text-sm"><strong>Energía a Trabajar:</strong> {progresion.energia_trabajar}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Elementos y Modalidades */}
          <div className="bg-amber-900/20 backdrop-blur-xl border border-amber-700/30 rounded-2xl p-6">
            <h3 className="text-amber-200 font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Distribución Elemental y Modal
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-amber-800/30 rounded-lg p-4">
                <h4 className="text-amber-300 font-medium mb-2">Evolución Elemental</h4>
                <p className="text-amber-100 text-sm mb-2">{interpretation.elementos_y_modalidades.distribucion_progresada}</p>
                <p className="text-amber-200 text-xs">{interpretation.elementos_y_modalidades.impacto_evolutivo}</p>
              </div>
              <div className="bg-amber-800/30 rounded-lg p-4">
                <h4 className="text-amber-300 font-medium mb-2">Equilibrio Necesario</h4>
                <p className="text-amber-100 text-sm">{interpretation.elementos_y_modalidades.equilibrio_necesario}</p>
              </div>
            </div>
          </div>

          {/* Integración Práctica */}
          <div className="bg-rose-900/20 backdrop-blur-xl border border-rose-700/30 rounded-2xl p-6">
            <h3 className="text-rose-200 font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Integración Práctica
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-rose-800/30 rounded-lg p-4">
                  <h4 className="text-rose-300 font-medium mb-2">Arquetipos a Activar</h4>
                  <p className="text-rose-100 text-sm">{interpretation.integracion_practica.arquetipos_activar}</p>
                </div>
                
                <div className="bg-rose-800/30 rounded-lg p-4">
                  <h4 className="text-rose-300 font-medium mb-2">Energías a Canalizar</h4>
                  <p className="text-rose-100 text-sm">{interpretation.integracion_practica.energias_canalizar}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-rose-800/30 rounded-lg p-4">
                  <h4 className="text-rose-300 font-medium mb-2">Rituales Arquetípicos</h4>
                  <p className="text-rose-100 text-sm">{interpretation.integracion_practica.rituales_arquetipicos}</p>
                </div>
                
                <div className="bg-rose-800/30 rounded-lg p-4">
                  <h4 className="text-rose-300 font-medium mb-2">Afirmaciones Planetarias</h4>
                  <ul className="space-y-1">
                    {interpretation.integracion_practica.afirmaciones_planetarias.map((afirmacion, index) => (
                      <li key={index} className="text-rose-100 text-sm">• {afirmacion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Perspectiva Evolutiva */}
          <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-violet-900/40 backdrop-blur-xl border border-indigo-700/30 rounded-2xl p-8 text-center">
            <h3 className="text-indigo-200 font-semibold mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6" />
              Perspectiva Evolutiva
            </h3>
            <p className="text-indigo-100 text-lg leading-relaxed font-medium">
              {interpretation.perspectiva_evolutiva}
            </p>
          </div>
        </>
      )}
    </div>
  );
}