// src/components/astrology/InterpretationButton.tsx
// COMPONENTE REUTILIZABLE PARA INTERPRETACIONES

'use client';

import React, { useState } from 'react';
import { Brain, Sparkles, RefreshCw, Eye, X, BookOpen, Star, Target, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';

interface InterpretationButtonProps {
  type: 'natal' | 'progressed';
  userId: string;
  chartData: any;
  natalChart?: any; // Para progresada
  userProfile: {
    name: string;
    age: number;
    birthPlace: string;
    birthDate: string;
    birthTime: string;
  };
  natalInterpretation?: any; // Para progresada
  className?: string;
}

interface InterpretationData {
  interpretation: any;
  cached: boolean;
  generatedAt: string;
  method: string;
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
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const isNatal = type === 'natal';
  const endpoint = isNatal ? '/api/astrology/interpret-natal' : '/api/astrology/interpret-progressed';

  const generateInterpretation = async (regenerate = false) => {
    if (!userId || !chartData) {
      setError('Datos insuficientes para generar interpretación');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requestBody = isNatal 
        ? {
            userId,
            natalChart: chartData,
            userProfile,
            regenerate
          }
        : {
            userId,
            progressedChart: chartData,
            natalChart: natalChart || {},
            userProfile,
            natalInterpretation,
            regenerate
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
      
      if (result.success) {
        setInterpretation(result.data);
        setShowModal(true);
      } else {
        throw new Error(result.error || 'Error desconocido');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* BOTÓN PRINCIPAL */}
      <div className={`${className} space-y-2`}>
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
              Generando Interpretación...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              {isNatal ? 'Interpretar Carta Natal' : 'Interpretar Carta Progresada'}
            </>
          )}
        </Button>

        {/* BOTÓN VER INTERPRETACIÓN (si ya existe) */}
        {interpretation && (
          <Button
            onClick={() => setShowModal(true)}
            variant="outline"
            className={`w-full ${isNatal 
              ? 'border-blue-400 text-blue-300 hover:bg-blue-400/20' 
              : 'border-purple-400 text-purple-300 hover:bg-purple-400/20'
            }`}
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Interpretación
          </Button>
        )}

        {/* MENSAJE DE ERROR */}
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

      {/* MODAL DE INTERPRETACIÓN */}
      {showModal && interpretation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            
            {/* HEADER */}
            <div className={`p-6 ${isNatal 
              ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-blue-400/20' 
              : 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-purple-400/20'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {isNatal ? (
                    <Star className="w-6 h-6 text-blue-400 mr-3" />
                  ) : (
                    <Sparkles className="w-6 h-6 text-purple-400 mr-3" />
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {isNatal ? 'Tu Interpretación Natal' : 'Tu Evolución Progresada'}
                    </h3>
                    <p className={`text-sm ${isNatal ? 'text-blue-200' : 'text-purple-200'}`}>
                      Generado: {new Date(interpretation.generatedAt).toLocaleString('es-ES')} | 
                      Método: {interpretation.method === 'openai_assistant' ? ' IA Avanzada' : ' Astrología Clásica'}
                      {interpretation.cached && ' (Cache)'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => generateInterpretation(true)}
                    size="sm"
                    variant="outline"
                    disabled={loading}
                    className="border-gray-400 text-gray-300"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </Button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* CONTENIDO */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {isNatal ? (
                <NatalInterpretationDisplay interpretation={interpretation.interpretation} />
              ) : (
                <ProgressedInterpretationDisplay interpretation={interpretation.interpretation} />
              )}
            </div>

            {/* FOOTER */}
            <div className={`p-4 ${isNatal 
              ? 'bg-blue-900/20 border-t border-blue-400/20' 
              : 'bg-purple-900/20 border-t border-purple-400/20'
            } flex justify-end gap-3`}>
              <Button
                onClick={() => setShowModal(false)}
                variant="outline"
                className="border-gray-400 text-gray-300"
              >
                Cerrar
              </Button>
              <Button
                onClick={() => {
                  // Aquí puedes agregar lógica para navegar a otra página o exportar
                  console.log('Interpretación completa:', interpretation);
                }}
                className={isNatal 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-purple-600 hover:bg-purple-700'
                }
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Guardar / Exportar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// COMPONENTE PARA MOSTRAR INTERPRETACIÓN NATAL
const NatalInterpretationDisplay: React.FC<{ interpretation: any }> = ({ interpretation }) => {
  return (
    <div className="space-y-6">
      
      {/* PERSONALIDAD CORE */}
      <div className="bg-blue-900/20 rounded-xl p-6">
        <h4 className="text-blue-300 font-semibold mb-3 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Tu Personalidad Esencial
        </h4>
        <p className="text-blue-100 leading-relaxed">{interpretation.personalidad_core}</p>
      </div>

      {/* FORTALEZAS PRINCIPALES */}
      <div className="bg-green-900/20 rounded-xl p-6">
        <h4 className="text-green-300 font-semibold mb-3 flex items-center">
          <Zap className="w-5 h-5 mr-2" />
          Tus Fortalezas Principales
        </h4>
        <div className="space-y-2">
          {interpretation.fortalezas_principales?.map((fortaleza: string, index: number) => (
            <div key={index} className="flex items-start">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-green-100">{fortaleza}</p>
            </div>
          ))}
        </div>
      </div>

      {/* DESAFÍOS EVOLUTIVOS */}
      <div className="bg-amber-900/20 rounded-xl p-6">
        <h4 className="text-amber-300 font-semibold mb-3 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Desafíos Evolutivos
        </h4>
        <div className="space-y-2">
          {interpretation.desafios_evolutivos?.map((desafio: string, index: number) => (
            <div key={index} className="flex items-start">
              <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-amber-100">{desafio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PROPÓSITO DE VIDA */}
      <div className="bg-purple-900/20 rounded-xl p-6">
        <h4 className="text-purple-300 font-semibold mb-3 flex items-center">
          <Star className="w-5 h-5 mr-2" />
          Tu Propósito de Vida
        </h4>
        <p className="text-purple-100 leading-relaxed">{interpretation.proposito_vida}</p>
      </div>

      {/* INFORMACIÓN TÉCNICA */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-800/30 rounded-lg p-4">
          <h5 className="text-gray-300 font-medium mb-2">Patrón Energético</h5>
          <p className="text-gray-100 text-sm">{interpretation.patron_energetico}</p>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-4">
          <h5 className="text-gray-300 font-medium mb-2">Casa Más Activada</h5>
          <p className="text-gray-100 text-sm">Casa {interpretation.casa_mas_activada}</p>
        </div>
      </div>

      {/* CONSEJOS DE DESARROLLO */}
      {interpretation.consejos_desarrollo && (
        <div className="bg-indigo-900/20 rounded-xl p-6">
          <h4 className="text-indigo-300 font-semibold mb-3">Consejos para tu Desarrollo</h4>
          <div className="space-y-2">
            {interpretation.consejos_desarrollo.map((consejo: string, index: number) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-indigo-100">{consejo}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// COMPONENTE PARA MOSTRAR INTERPRETACIÓN PROGRESADA
const ProgressedInterpretationDisplay: React.FC<{ interpretation: any }> = ({ interpretation }) => {
  return (
    <div className="space-y-6">
      
      {/* TEMA ANUAL */}
      <div className="bg-purple-900/20 rounded-xl p-6">
        <h4 className="text-purple-300 font-semibold mb-3 flex items-center">
          <Sparkles className="w-5 h-5 mr-2" />
          Tu Tema Evolutivo Anual
        </h4>
        <p className="text-purple-100 text-lg leading-relaxed">{interpretation.tema_anual}</p>
      </div>

      {/* EVOLUCIÓN DE PERSONALIDAD */}
      <div className="bg-indigo-900/20 rounded-xl p-6">
        <h4 className="text-indigo-300 font-semibold mb-3 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Cómo Has Evolucionado
        </h4>
        <p className="text-indigo-100 leading-relaxed">{interpretation.evolucion_personalidad}</p>
      </div>

      {/* NUEVAS FORTALEZAS */}
      <div className="bg-green-900/20 rounded-xl p-6">
        <h4 className="text-green-300 font-semibold mb-3 flex items-center">
          <Zap className="w-5 h-5 mr-2" />
          Nuevas Fortalezas Disponibles
        </h4>
        <div className="space-y-2">
          {interpretation.nuevas_fortalezas?.map((fortaleza: string, index: number) => (
            <div key={index} className="flex items-start">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-green-100">{fortaleza}</p>
            </div>
          ))}
        </div>
      </div>

      {/* COMPARACIÓN NATAL */}
      {interpretation.comparacion_natal && (
        <div className="bg-teal-900/20 rounded-xl p-6">
          <h4 className="text-teal-300 font-semibold mb-4">Comparación Natal vs Progresada</h4>
          
          {interpretation.comparacion_natal.planetas_evolucionados && (
            <div className="mb-4">
              <h5 className="text-teal-200 font-medium mb-2">Planetas Evolucionados:</h5>
              <div className="space-y-2">
                {interpretation.comparacion_natal.planetas_evolucionados.map((planeta: any, index: number) => (
                  <div key={index} className="bg-teal-800/20 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-teal-100">{planeta.planeta}</span>
                      <span className="text-xs text-teal-300">→</span>
                    </div>
                    <div className="text-sm text-teal-200">
                      <p>Natal: {planeta.natal}</p>
                      <p>Progresado: {planeta.progresado}</p>
                      <p className="text-teal-300 italic mt-1">{planeta.significado}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 bg-teal-800/20 rounded-lg">
            <p className="text-teal-100 font-medium">{interpretation.comparacion_natal.tema_evolutivo}</p>
          </div>
        </div>
      )}

      {/* OPORTUNIDADES DE CRECIMIENTO */}
      <div className="bg-pink-900/20 rounded-xl p-6">
        <h4 className="text-pink-300 font-semibold mb-3 flex items-center">
          <Star className="w-5 h-5 mr-2" />
          Oportunidades de Crecimiento
        </h4>
        <div className="space-y-2">
          {interpretation.oportunidades_crecimiento?.map((oportunidad: string, index: number) => (
            <div key={index} className="flex items-start">
              <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-pink-100">{oportunidad}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CONSEJOS DE INTEGRACIÓN */}
      {interpretation.consejos_integracion && (
        <div className="bg-amber-900/20 rounded-xl p-6">
          <h4 className="text-amber-300 font-semibold mb-3">Consejos de Integración</h4>
          <div className="space-y-2">
            {interpretation.consejos_integracion.map((consejo: string, index: number) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-amber-100">{consejo}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RITUALES RECOMENDADOS */}
      {interpretation.rituales_recomendados && (
        <div className="bg-violet-900/20 rounded-xl p-6">
          <h4 className="text-violet-300 font-semibold mb-3">Rituales Recomendados</h4>
          <div className="space-y-2">
            {interpretation.rituales_recomendados.map((ritual: string, index: number) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-violet-100">{ritual}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterpretationButton;