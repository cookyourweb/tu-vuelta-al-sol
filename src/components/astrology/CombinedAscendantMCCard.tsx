// src/components/astrology/CombinedAscendantMCCard.tsx
// Card combinada de Ascendente + Medio Cielo

import React from 'react';
import { SIGN_SYMBOLS, signMeanings } from '../../constants/astrology/chartConstants';

interface CombinedAscendantMCCardProps {
  ascendant?: { 
    longitude?: number; 
    sign?: string; 
    degree?: number; 
    minutes?: number;
  };
  midheaven?: { 
    longitude?: number; 
    sign?: string; 
    degree?: number; 
    minutes?: number;
  };
}

const CombinedAscendantMCCard: React.FC<CombinedAscendantMCCardProps> = ({ 
  ascendant, 
  midheaven 
}) => {
  return (
    <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-sm border border-blue-400/30 rounded-3xl p-8 relative group hover:scale-105 transition-all duration-300 overflow-hidden">
      <div className="absolute top-4 right-4 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-400/10 rounded-full"></div>
      
      {/* Ascendente */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-green-400/20 to-blue-500/20 border border-green-400/30 rounded-full p-4 backdrop-blur-sm mb-4 w-fit group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5"/>
            <path d="M5 12l7-7 7 7"/>
          </svg>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 flex items-center">
          <svg className="w-5 h-5 text-green-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5"/>
            <path d="M5 12l7-7 7 7"/>
          </svg>
          Tu Ascendente
        </h3>
        <p className="text-gray-300 mb-4 text-sm leading-relaxed">
          Tu máscara social y la primera impresión que causas al mundo.
        </p>
        
        {ascendant?.sign ? (
          <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">♒</span>
                <div>
                  <div className="text-blue-300 font-bold text-lg">
                    {ascendant.sign}
                  </div>
                  <div className="text-blue-200 text-sm">
                    {ascendant.degree ? `${Math.floor(ascendant.degree)}° ${ascendant.minutes ? Math.floor(ascendant.minutes) + "'" : ''}` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 text-green-200 text-xs">
              <strong>💫 Personalidad externa:</strong> {signMeanings[ascendant.sign as keyof typeof signMeanings]?.slice(0, 50)}...
            </div>
          </div>
        ) : (
          <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10">
            <div className="text-gray-400 text-sm">Ascendente no disponible</div>
          </div>
        )}
      </div>

      {/* Medio Cielo */}
      <div>
        <div className="bg-gradient-to-r from-purple-400/20 to-pink-500/20 border border-purple-400/30 rounded-full p-4 backdrop-blur-sm mb-4 w-fit group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3h18v18H3zM9 9h6v6H9z"/>
            <path d="M9 1v6M15 1v6M9 17v6M15 17v6M1 9h6M1 15h6M17 9h6M17 15h6"/>
          </svg>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 flex items-center">
          <svg className="w-5 h-5 text-purple-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3h18v18H3zM9 9h6v6H9z"/>
            <path d="M9 1v6M15 1v6M9 17v6M15 17v6M1 9h6M1 15h6M17 9h6M17 15h6"/>
          </svg>
          Tu Medio Cielo
        </h3>
        <p className="text-gray-300 mb-4 text-sm leading-relaxed">
          Tu vocación, carrera ideal y propósito profesional en el mundo.
        </p>
        
        {midheaven?.sign ? (
          <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">♏</span>
                <div>
                  <div className="text-purple-300 font-bold text-lg">
                    {midheaven.sign}
                  </div>
                  <div className="text-purple-200 text-sm">
                    {midheaven.degree ? `${Math.floor(midheaven.degree)}° ${midheaven.minutes ? Math.floor(midheaven.minutes) + "'" : ''}` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 text-purple-200 text-xs">
              <strong>🏆 Vocación profesional:</strong> {signMeanings[midheaven.sign as keyof typeof signMeanings]?.slice(0, 50)}...
            </div>
          </div>
        ) : (
          <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10">
            <div className="text-gray-400 text-sm">Medio Cielo no disponible</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CombinedAscendantMCCard;