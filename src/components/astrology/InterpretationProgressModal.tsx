'use client';

import { useEffect, useState } from 'react';
import { Brain, Sparkles, Star, Zap, Flame, Droplets, Wind, Mountain } from 'lucide-react';

interface InterpretationProgressModalProps {
  isOpen: boolean;
  progress: string;
  onClose?: () => void;
}

const progressIcons = [
  <Brain key="brain" className="w-8 h-8 text-purple-400 animate-pulse" />,
  <Sparkles key="sparkles" className="w-8 h-8 text-yellow-400 animate-spin" />,
  <Star key="star" className="w-8 h-8 text-blue-400 animate-bounce" />,
  <Zap key="zap" className="w-8 h-8 text-orange-400 animate-pulse" />,
  <Flame key="flame" className="w-8 h-8 text-red-400 animate-pulse" />,
  <Mountain key="mountain" className="w-8 h-8 text-green-400 animate-pulse" />,
  <Wind key="wind" className="w-8 h-8 text-cyan-400 animate-pulse" />,
  <Droplets key="droplets" className="w-8 h-8 text-blue-400 animate-pulse" />,
];

export default function InterpretationProgressModal({
  isOpen,
  progress,
  onClose
}: InterpretationProgressModalProps) {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Animación de íconos
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCurrentIconIndex((prev) => (prev + 1) % progressIcons.length);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // ⏱️ Contador de tiempo transcurrido
  useEffect(() => {
    if (isOpen) {
      setElapsedTime(0);
      const timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getProgressPercentage = (message: string): number => {
    if (message.includes('Ascendente y Medio Cielo')) return 5;
    if (message.includes('interpretaciones de planetas')) return 15;
    if (message.includes('Sol en')) return 20;
    if (message.includes('Luna en')) return 25;
    if (message.includes('Mercurio en')) return 30;
    if (message.includes('Venus en')) return 35;
    if (message.includes('Marte en')) return 40;
    if (message.includes('Jupiter en')) return 45;
    if (message.includes('Saturno en')) return 50;
    if (message.includes('Lilith y Chiron')) return 50;
    if (message.includes('Lilith en')) return 55;
    if (message.includes('Chiron en')) return 60;
    if (message.includes('Nodos Lunares')) return 65;
    if (message.includes('Nodo Norte en')) return 70;
    if (message.includes('Nodo Sur en')) return 75;
    if (message.includes('Elementos')) return 80;
    if (message.includes('Elemento Fuego')) return 82;
    if (message.includes('Elemento Tierra')) return 84;
    if (message.includes('Elemento Aire')) return 86;
    if (message.includes('Elemento Agua')) return 88;
    if (message.includes('Modalidades')) return 90;
    if (message.includes('Modalidad Cardinal')) return 92;
    if (message.includes('Modalidad Fijo')) return 94;
    if (message.includes('Modalidad Mutable')) return 96;
    if (message.includes('Aspectos principales')) return 98;
    if (message.includes('Aspecto')) return 99;
    if (message.includes('¡Interpretaciones completadas!')) return 100;
    return 0;
  };

  const progressPercentage = getProgressPercentage(progress);

  // Detectar si es el mensaje inicial de advertencia
  const isWarningMessage = progress.includes('IMPORTANTE') || progress.includes('NO cierres');

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
            Generando Interpretaciones AI
          </h2>

          <p className="text-purple-200 text-sm">
            Tu mapa cósmico está siendo revelado...
          </p>
        </div>

        {/* ⚠️ ADVERTENCIA PROMINENTE (si aplica) */}
        {isWarningMessage && (
          <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-2 border-yellow-400/50 rounded-xl p-4 mb-6 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0">⚠️</div>
              <div>
                <p className="text-yellow-200 font-bold text-sm mb-1">
                  IMPORTANTE - NO CERRAR
                </p>
                <p className="text-yellow-100 text-xs leading-relaxed">
                  Este análisis profundo tarda 2-3 minutos. Por favor mantén esta ventana abierta.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Message */}
        <div className="bg-black/30 rounded-xl p-4 mb-6 border border-purple-400/20">
          <p className="text-white text-center font-medium leading-relaxed">
            {progress}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progreso</span>
            <span>{progressPercentage}%</span>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="h-full bg-white/20 animate-pulse rounded-full"></div>
            </div>
          </div>

          {/* ⏱️ TIEMPO TRANSCURRIDO Y ESTIMADO */}
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>⏱️ Tiempo: {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}</span>
            <span>
              {elapsedTime < 180
                ? `⏳ Estimado: ~${Math.max(0, Math.ceil((180 - elapsedTime) / 60))} min restantes`
                : '⚡ Finalizando...'}
            </span>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-4 border border-purple-400/20">
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-purple-200 text-sm leading-relaxed">
                {progressPercentage < 20 && "🌟 Analizando tu configuración única en el cosmos..."}
                {progressPercentage >= 20 && progressPercentage < 50 && "🪐 Descifrando el lenguaje secreto de tus planetas..."}
                {progressPercentage >= 50 && progressPercentage < 80 && "🔮 Integrando energías astrológicas profundas..."}
                {progressPercentage >= 80 && progressPercentage < 100 && "✨ Tejiendo tu narrativa cósmica personal..."}
                {progressPercentage === 100 && "🎉 ¡Tu revolución astrológica está completa!"}
              </p>
            </div>
          </div>
        </div>

        {/* Close button (optional) */}
        {onClose && progressPercentage === 100 && (
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all text-sm"
            >
              Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
