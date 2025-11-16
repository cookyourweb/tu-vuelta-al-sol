'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Star, Sun, Moon, Heart, Zap, Target, Compass } from 'lucide-react';

interface ChartProgressModalProps {
  isOpen: boolean;
  progress: string;
  onClose?: () => void;
}

const progressIcons = [
  <Sun key="sun" className="w-8 h-8 text-yellow-400 animate-pulse" />,
  <Moon key="moon" className="w-8 h-8 text-blue-400 animate-bounce" />,
  <Heart key="heart" className="w-8 h-8 text-pink-400 animate-pulse" />,
  <Zap key="zap" className="w-8 h-8 text-orange-400 animate-pulse" />,
  <Target key="target" className="w-8 h-8 text-red-400 animate-pulse" />,
  <Compass key="compass" className="w-8 h-8 text-green-400 animate-pulse" />,
  <Sparkles key="sparkles" className="w-8 h-8 text-purple-400 animate-spin" />,
  <Star key="star" className="w-8 h-8 text-cyan-400 animate-pulse" />,
];

export default function ChartProgressModal({
  isOpen,
  progress,
  onClose
}: ChartProgressModalProps) {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      console.log('🎯 [MODAL] Modal abierto');
      console.log('🎯 [MODAL] Progress recibido:', progress);
      const interval = setInterval(() => {
        setCurrentIconIndex((prev) => (prev + 1) % progressIcons.length);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && progress) {
      console.log('🎯 [MODAL] Progress actualizado:', progress);
    }
  }, [progress, isOpen]);

  if (!isOpen) return null;

  const getProgressPercentage = (message: string): number => {
    if (!message) {
      console.log('⚠️ [MODAL] No hay mensaje');
      return 0;
    }

    if (message.includes('Conectando con el cosmos')) return 5;
    if (message.includes('Calculando posiciones planetarias')) return 15;
    if (message.includes('Descifrando tu mapa cósmico')) return 30;
    if (message.includes('Interpretando las energías astrales')) return 50;
    if (message.includes('Analizando aspectos planetarios')) return 70;
    if (message.includes('Revelando tu configuración única')) return 85;
    if (message.includes('Casi listo')) return 95;
    if (message.includes('¡Carta completada!')) return 100;

    console.log('⚠️ [MODAL] Mensaje no reconocido:', message);
    return 0;
  };

  const progressPercentage = getProgressPercentage(progress);

  console.log('🎯 [MODAL] Renderizando con:', {
    isOpen,
    progress,
    progressPercentage
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900/20 to-blue-900 border border-indigo-400/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-indigo-900/50 rounded-full flex items-center justify-center border border-indigo-400/30">
                {progressIcons[currentIconIndex]}
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-2">
            Creando tu Carta Natal
          </h2>

          <p className="text-indigo-200 text-sm">
            Calculando tu mapa cósmico único...
          </p>
        </div>

        {/* Progress Message */}
        <div className="bg-black/30 rounded-xl p-4 mb-6 border border-indigo-400/20">
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
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="h-full bg-white/20 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl p-4 border border-indigo-400/20">
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-indigo-200 text-sm leading-relaxed">
                {progressPercentage < 20 && "🌟 Conectando con las energías primordiales del universo..."}
                {progressPercentage >= 20 && progressPercentage < 50 && "🪐 Calculando las posiciones exactas de tus planetas personales..."}
                {progressPercentage >= 50 && progressPercentage < 80 && "🔮 Descifrando cómo los astros influyen en tu vida diaria..."}
                {progressPercentage >= 80 && progressPercentage < 100 && "✨ Integrando todos los aspectos de tu ser cósmico..."}
                {progressPercentage === 100 && "🎉 ¡Tu carta natal está lista para revelarte tus secretos!"}
              </p>
            </div>
          </div>
        </div>

        {/* Close button (optional) */}
        {onClose && progressPercentage === 100 && (
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all text-sm"
            >
              Explorar mi Carta
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
