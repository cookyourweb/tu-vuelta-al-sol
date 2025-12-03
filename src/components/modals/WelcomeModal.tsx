'use client';

import { useState, useEffect } from 'react';
import { X, Star, Sunrise, Calendar, Sparkles } from 'lucide-react';

export default function WelcomeModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome modal before
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  const handleStartJourney = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenWelcome', 'true');
    // Could add navigation or analytics here
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-300 border border-purple-700/50">

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors duration-200 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">

          {/* Logo/Icon */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Star className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-2">
            Bienvenido a
          </h2>
          <h1 className="text-2xl font-bold text-yellow-400 mb-6">
            Tu Vuelta al Sol
          </h1>

          {/* Subtitle */}
          <p className="text-purple-200 mb-8 text-lg">
            Tu agenda astrológica personalizada
          </p>

          {/* Features */}
          <div className="space-y-4 mb-8">

            {/* Feature 1 */}
            <div className="flex items-center space-x-4 text-left">
              <div className="w-12 h-12 bg-purple-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Tu Carta Natal</h3>
                <p className="text-purple-300 text-sm">Descubre tu mapa astrológico personal y conoce tu esencia cósmica</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center space-x-4 text-left">
              <div className="w-12 h-12 bg-purple-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sunrise className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Retorno Solar Anual</h3>
                <p className="text-purple-300 text-sm">Tu evolución astrológica año tras año, con insights personalizados</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center space-x-4 text-left">
              <div className="w-12 h-12 bg-purple-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Agenda Personalizada</h3>
                <p className="text-purple-300 text-sm">Eventos astrológicos importantes organizados para ti</p>
              </div>
            </div>

          </div>

          {/* CTA Button */}
          <button
            onClick={handleStartJourney}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/25 mb-4"
          >
            Comenzar mi viaje ✨
          </button>

          {/* Secondary button */}
          <button
            onClick={handleClose}
            className="text-purple-300 hover:text-white transition-colors duration-200 text-sm"
          >
            Continuar explorando
          </button>

        </div>
      </div>
    </div>
  );
}
