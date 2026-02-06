// src/components/astrology/AgendaLoadingStates.tsx
// 🔄 COMPONENTE DE LOADING PARA AGENDA ASTROLÓGICA

'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles } from 'lucide-react';

interface LoadingStatesProps {
  isGenerating: boolean;
  currentStep: string;
  progress?: number;
}

export function AgendaLoadingStates({ isGenerating, currentStep, progress }: LoadingStatesProps) {
  const [waitTime, setWaitTime] = useState(0);

  // Timer para mostrar tiempo transcurrido
  useEffect(() => {
    if (!isGenerating) {
      setWaitTime(0);
      return;
    }
    const interval = setInterval(() => {
      setWaitTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isGenerating]);

  if (!isGenerating) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 rounded-3xl max-w-md w-full p-8 shadow-2xl border-2 border-purple-400/50">
        <div className="text-center space-y-6">

          {/* Animated Icon */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-2 bg-purple-900 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-purple-300 animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white">
            📅 Generando tu Agenda Astrológica
          </h3>

          {/* Progress Message */}
          <div className="bg-purple-800/50 rounded-xl p-4 border border-purple-400/30">
            <p className="text-purple-100 text-lg font-semibold animate-pulse">
              {currentStep}
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-purple-300" />
              <span className="text-purple-200 text-sm">
                Tiempo transcurrido: {waitTime}s
              </span>
            </div>
            {progress !== undefined && progress > 0 && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-purple-200 text-xs">Progreso</span>
                  <span className="text-purple-200 text-xs">{progress}%</span>
                </div>
                <div className="w-full bg-purple-950/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
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
              <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🌟</span>
              Calculando eventos astrológicos
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🎯</span>
              Esto puede tardar unos minutos
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