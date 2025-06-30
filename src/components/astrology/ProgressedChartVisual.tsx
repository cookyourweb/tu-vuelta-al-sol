// src/components/astrology/ProgressedChartVisual.tsx - COMPONENTE COMPLETO
'use client';

import React from 'react';
import ChartDisplay from './ChartDisplay';
import { Moon, Calendar, TrendingUp, Sparkles, Clock4, ArrowUp, Mountain } from 'lucide-react';

interface ProgressedChartData {
  houses: any[];
  planets: any[];
  elementDistribution: { fire: number; earth: number; air: number; water: number };
  modalityDistribution: { cardinal: number; fixed: number; mutable: number };
  keyAspects: any[];
  ascendant?: { longitude?: number; sign?: string; degree?: number };
  midheaven?: { longitude?: number; sign?: string; degree?: number };
  progressionInfo: {
    year: number;
    period: string;
    description: string;
    startDate?: string;
    endDate?: string;
  };
  birthData?: {
    birthDate?: string;
    birthTime?: string;
    birthPlace?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
  };
}

interface ProgressedChartVisualProps {
  data: ProgressedChartData;
  isLoading?: boolean;
  error?: string | null;
}

const ProgressedChartVisual: React.FC<ProgressedChartVisualProps> = ({
  data,
  isLoading = false,
  error = null
}) => {
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Loading State */}
        <div className="bg-gradient-to-br from-emerald-900/30 via-teal-900/20 to-cyan-900/30 backdrop-blur-sm border border-emerald-400/30 rounded-3xl p-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin text-6xl mb-4">🌙</div>
              <h3 className="text-xl font-bold text-white mb-2">Generando Carta Progresada</h3>
              <p className="text-emerald-200">Calculando tu evolución astrológica anual...</p>
              <div className="mt-4 flex justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        {/* Error State */}
        <div className="bg-gradient-to-br from-red-900/30 via-pink-900/20 to-purple-900/30 backdrop-blur-sm border border-red-400/30 rounded-3xl p-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-xl font-bold text-white mb-2">Error en Carta Progresada</h3>
              <p className="text-red-200 mb-4">{error}</p>
              <div className="space-y-2 text-sm text-gray-300">
                <p>🔍 <strong>Posibles causas:</strong></p>
                <ul className="text-left max-w-md mx-auto space-y-1">
                  <li>• Limitaciones del plan de Prokerala API</li>
                  <li>• Endpoint de carta progresada no disponible</li>
                  <li>• Error temporal en el servicio externo</li>
                  <li>• Parámetros de progresión incorrectos</li>
                </ul>
              </div>
              <button className="mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 transition-all">
                🔄 Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.planets || data.planets.length === 0) {
    return (
      <div className="space-y-8">
        {/* No Data State */}
        <div className="bg-gradient-to-br from-gray-900/30 via-emerald-900/20 to-teal-900/30 backdrop-blur-sm border border-gray-400/30 rounded-3xl p-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-6xl mb-4">🔮</div>
              <h3 className="text-xl font-bold text-white mb-2">Carta Progresada No Disponible</h3>
              <p className="text-gray-200 mb-4">No se han recibido datos de tu carta progresada</p>
              <div className="space-y-2 text-sm text-gray-300">
                <p>💡 <strong>Información:</strong></p>
                <ul className="text-left max-w-md mx-auto space-y-1">
                  <li>• La carta progresada muestra tu evolución anual</li>
                  <li>• Calcula cómo han "progresado" tus planetas</li>
                  <li>• Revela los temas principales de tu año astrológico</li>
                  <li>• Funcionalidad próximamente disponible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header específico para carta progresada */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-sm border border-emerald-400/30 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-emerald-400 mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center">
                🌱 Tu Carta Progresada
                <Clock4 className="w-5 h-5 text-emerald-400 ml-2" />
                <span className="ml-3 text-lg text-emerald-300">
                  {data.progressionInfo.period}
                </span>
              </h1>
              <p className="text-emerald-200 mt-1">
                Tu evolución astrológica para el período {data.progressionInfo.description}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="bg-emerald-500/20 rounded-lg p-3 border border-emerald-400/30">
              <div className="text-emerald-300 text-sm font-semibold">Año de Progresión</div>
              <div className="text-white text-xl font-bold">{data.progressionInfo.year}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Información comparativa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <Calendar className="w-6 h-6 text-emerald-400 mr-3" />
            <h3 className="text-lg font-bold text-white">Período Activo</h3>
          </div>
          <div className="space-y-2">
            <div className="text-emerald-200 text-sm">
              <strong>Desde:</strong> {data.progressionInfo.startDate ? new Date(data.progressionInfo.startDate).toLocaleDateString('es-ES') : 'Cumpleaños actual'}
            </div>
            <div className="text-emerald-200 text-sm">
              <strong>Hasta:</strong> {data.progressionInfo.endDate ? new Date(data.progressionInfo.endDate).toLocaleDateString('es-ES') : 'Próximo cumpleaños'}
            </div>
            <div className="text-emerald-300 text-xs mt-3">
              Tu carta progresada se basa en el movimiento simbólico de los planetas: 1 día = 1 año de vida.
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 backdrop-blur-sm border border-teal-400/30 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 text-teal-400 mr-3" />
            <h3 className="text-lg font-bold text-white">Evolución</h3>
          </div>
          <div className="space-y-2">
            <div className="text-teal-200 text-sm">
              <strong>Tipo:</strong> Progresiones Secundarias
            </div>
            <div className="text-teal-200 text-sm">
              <strong>Método:</strong> 1 día = 1 año
            </div>
            <div className="text-teal-300 text-xs mt-3">
              Muestra cómo han evolucionado tus energías planetarias desde tu nacimiento hasta tu edad actual.
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <Sparkles className="w-6 h-6 text-cyan-400 mr-3" />
            <h3 className="text-lg font-bold text-white">Diferencias</h3>
          </div>
          <div className="space-y-2">
            <div className="text-cyan-200 text-sm">
              <strong>vs. Natal:</strong> Energías evolucionadas
            </div>
            <div className="text-cyan-200 text-sm">
              <strong>Enfoque:</strong> Desarrollo personal
            </div>
            <div className="text-cyan-300 text-xs mt-3">
              La carta natal muestra tu potencial; la progresada muestra cómo lo estás desarrollando.
            </div>
          </div>
        </div>
      </div>

      {/* Componente ChartDisplay con configuración específica para carta progresada */}
      <ChartDisplay
        houses={data.houses}
        planets={data.planets}
        elementDistribution={data.elementDistribution}
        modalityDistribution={data.modalityDistribution}
        keyAspects={data.keyAspects}
        ascendant={data.ascendant}
        midheaven={data.midheaven}
        birthData={data.birthData}
        chartType="progressed"
        progressionInfo={data.progressionInfo}
      />

      {/* Footer informativo */}
      <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 backdrop-blur-sm border border-emerald-400/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          📚 Cómo Interpretar tu Carta Progresada
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="text-emerald-300 font-semibold mb-2">🌟 Planetas Progresados</h4>
            <ul className="space-y-1 text-gray-300">
              <li>• <strong>Sol progresado:</strong> Tu identidad en evolución</li>
              <li>• <strong>Luna progresada:</strong> Tus necesidades emocionales actuales</li>
              <li>• <strong>Mercurio progresado:</strong> Cómo piensas y comunicas ahora</li>
              <li>• <strong>Venus progresado:</strong> Tus valores y relaciones actuales</li>
              <li>• <strong>Marte progresado:</strong> Tu energía y motivación presente</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-teal-300 font-semibold mb-2">🔄 Cambios Significativos</h4>
            <ul className="space-y-1 text-gray-300">
              <li>• <strong>Cambios de signo:</strong> Nuevas energías disponibles</li>
              <li>• <strong>Cambios de casa:</strong> Nuevas áreas de enfoque</li>
              <li>• <strong>Aspectos nuevos:</strong> Oportunidades y desafíos emergentes</li>
              <li>• <strong>Aspectos exactos:</strong> Momentos de máxima intensidad</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
          <div className="text-yellow-300 text-sm font-semibold mb-1">💡 Consejo Importante:</div>
          <div className="text-yellow-200 text-xs">
            Tu carta progresada complementa tu carta natal, no la reemplaza. Mientras tu carta natal 
            muestra tu potencial y personalidad básica, la progresada revela cómo estás desarrollando 
            ese potencial en esta etapa de tu vida. Úsala para entender los temas y oportunidades 
            principales de tu año astrológico actual.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressedChartVisual;