// src/components/astrology/AgendaLoadingStates.tsx
// 🔄 COMPONENTE DE LOADING PARA AGENDA ASTROLÓGICA

import React from 'react';

interface LoadingStatesProps {
  isGenerating: boolean;
  currentStep: string;
  progress?: number;
}

export function AgendaLoadingStates({ isGenerating, currentStep, progress }: LoadingStatesProps) {
  if (!isGenerating) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
        
        {/* Spinner */}
        <div className="relative mx-auto mb-6 w-16 h-16">
          <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-2 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600 text-xl">🔮</span>
          </div>
        </div>

        {/* Título */}
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Generando tu Agenda Astrológica
        </h3>

        {/* Paso actual */}
        <p className="text-gray-600 mb-4">
          {currentStep}
        </p>

        {/* Barra de progreso */}
        {progress !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Mensaje motivacional */}
        <p className="text-sm text-gray-500">
          ✨ Estamos consultando las estrellas para crear tu guía personalizada...
        </p>
        
        <p className="text-xs text-gray-400 mt-2">
          Esto puede tomar unos minutos
        </p>
      </div>
    </div>
  );
}

// Estados de carga específicos
export const LOADING_STEPS = {
  FETCHING_EVENTS: "📅 Calculando eventos astrológicos...",
  GENERATING_INTERPRETATIONS: "🤖 Generando interpretaciones con IA...",
  CREATING_SUMMARY: "📊 Creando resumen ejecutivo...",
  FINALIZING: "✨ Finalizando tu agenda personalizada..."
} as const;

// Hook para manejar loading
export function useAgendaLoading() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState<string>(LOADING_STEPS.FETCHING_EVENTS);
  const [progress, setProgress] = React.useState(0);

  const startLoading = () => {
    setIsLoading(true);
    setCurrentStep(LOADING_STEPS.FETCHING_EVENTS);
    setProgress(0);
  };

  const updateStep = (step: string, progressValue?: number) => {
    setCurrentStep(step);
    if (progressValue !== undefined) {
      setProgress(progressValue);
    }
  };

  const finishLoading = () => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 500);
  };

  return {
    isLoading,
    currentStep,
    progress,
    startLoading,
    updateStep,
    finishLoading
  };
}