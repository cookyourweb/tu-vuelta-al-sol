'use client';

import { useState, useEffect } from 'react';
import { X, Star, Sun, Calendar, Sparkles } from 'lucide-react';

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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-3">
            Tu Vuelta al Sol
          </h1>

          {/* Subtitle */}
          <p className="text-purple-200 mb-6 text-lg font-semibold">
            Agenda astrológica personalizada
          </p>

          {/* Description */}
          <p className="text-white text-base mb-5 leading-relaxed">
            Una experiencia creada a partir de tu carta natal y tu retorno solar, diseñada para acompañarte durante todo el año.
          </p>

          {/* Highlighted message */}
          <div className="bg-purple-800/40 border border-purple-500/30 rounded-xl p-4 mb-6">
            <p className="text-white font-medium text-sm mb-2">
              No es un horóscopo genérico.
            </p>
            <p className="text-purple-200 text-sm">
              Es una guía personal para entender tus ciclos, tomar decisiones con más conciencia y vivir el año alineada contigo.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <p className="text-purple-300 text-sm font-semibold text-left">✨ Incluye:</p>

            {/* Feature 1 */}
            <div className="flex items-start space-x-3 text-left">
              <div className="w-10 h-10 bg-blue-600/30 border border-blue-400/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <h3 className="text-blue-300 font-semibold text-sm">Carta Natal</h3>
                <p className="text-purple-300 text-xs">tu esencia y patrones personales</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start space-x-3 text-left">
              <div className="w-10 h-10 bg-yellow-600/30 border border-yellow-400/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sun className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <h3 className="text-yellow-300 font-semibold text-sm">Retorno Solar</h3>
                <p className="text-purple-300 text-xs">las energías activas de este año</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start space-x-3 text-left">
              <div className="w-10 h-10 bg-purple-600/30 border border-purple-400/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <h3 className="text-purple-300 font-semibold text-sm">Agenda personalizada</h3>
                <p className="text-purple-300 text-xs">ciclos, fechas clave y espacios de reflexión</p>
              </div>
            </div>

          </div>

          {/* Final message */}
          <div className="bg-pink-800/30 border border-pink-500/30 rounded-xl p-4 mb-6">
            <p className="text-white font-medium text-sm mb-1">
              Este año no va de hacer más.
            </p>
            <p className="text-purple-200 font-semibold text-sm">
              Va de vivir con sentido.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleStartJourney}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:via-purple-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg mb-3"
          >
            👉 Empieza tu Vuelta al Sol
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
