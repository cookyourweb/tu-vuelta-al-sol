'use client';

import { useEffect, useState } from 'react';
import { Calendar, Sparkles, Star, Moon, Sun, Zap } from 'lucide-react';

interface EventsLoadingModalProps {
  isOpen: boolean;
  month: string; // e.g., "Diciembre 2025"
  onClose?: () => void;
}

const progressIcons = [
  <Calendar key="calendar" className="w-8 h-8 text-purple-400 animate-pulse" />,
  <Sparkles key="sparkles" className="w-8 h-8 text-yellow-400 animate-spin" />,
  <Star key="star" className="w-8 h-8 text-blue-400 animate-bounce" />,
  <Moon key="moon" className="w-8 h-8 text-indigo-400 animate-pulse" />,
  <Sun key="sun" className="w-8 h-8 text-orange-400 animate-pulse" />,
  <Zap key="zap" className="w-8 h-8 text-pink-400 animate-bounce" />,
];

export default function EventsLoadingModal({
  isOpen,
  month,
  onClose
}: EventsLoadingModalProps) {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Iniciando cálculos astrológicos...');

  // Animación de íconos
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCurrentIconIndex((prev) => (prev + 1) % progressIcons.length);
      }, 600);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Progreso simulado con mensajes
  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      setStatusMessage('🌙 Calculando fases lunares...');

      const steps = [
        { delay: 300, progress: 20, message: '🌙 Calculando fases lunares...' },
        { delay: 900, progress: 40, message: '⏪ Detectando retrogradaciones...' },
        { delay: 1500, progress: 60, message: '🌑 Buscando eclipses...' },
        { delay: 2100, progress: 80, message: '🪐 Analizando tránsitos planetarios...' },
        { delay: 2700, progress: 95, message: '✨ Finalizando cálculos...' },
        { delay: 3000, progress: 100, message: '✅ ¡Eventos calculados!' }
      ];

      const timers = steps.map(step =>
        setTimeout(() => {
          setProgress(step.progress);
          setStatusMessage(step.message);
        }, step.delay)
      );

      return () => {
        timers.forEach(timer => clearTimeout(timer));
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 border border-purple-400/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-purple-900/50 rounded-full flex items-center justify-center border border-purple-400/30">
                {progressIcons[currentIconIndex]}
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-2">
            Calculando Eventos del Mes
          </h2>

          <p className="text-purple-200 text-sm">
            {month}
          </p>
        </div>

        {/* Mensaje de estado */}
        <div className="bg-black/30 rounded-xl p-4 mb-6 border border-purple-400/20">
          <p className="text-white text-center font-medium leading-relaxed">
            {statusMessage}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progreso</span>
            <span>{progress}%</span>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full bg-white/20 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Mensaje informativo */}
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-4 border border-purple-400/20">
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-purple-200 text-sm leading-relaxed">
                {progress < 30 && "🌟 Conectando con las energías lunares del mes..."}
                {progress >= 30 && progress < 60 && "🪐 Rastreando movimientos planetarios retrógrados..."}
                {progress >= 60 && progress < 90 && "✨ Identificando portales de eclipses y tránsitos..."}
                {progress >= 90 && progress < 100 && "🎯 Organizando tu calendario cósmico..."}
                {progress === 100 && "🎉 ¡Tu agenda mensual está lista!"}
              </p>
            </div>
          </div>
        </div>

        {/* Close button cuando termine */}
        {onClose && progress === 100 && (
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all text-sm"
            >
              Ver Eventos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
