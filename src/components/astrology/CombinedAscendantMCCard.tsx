// src/components/astrology/CombinedAscendantMCCard.tsx
// Card combinada de Ascendente + Medio Cielo - VERSIÓN COMPACTA

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
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4 relative group hover:scale-[1.02] transition-all duration-300 overflow-hidden">
      <div className="absolute top-3 right-3 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
      
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-r from-blue-400/20 to-purple-500/20 border border-blue-400/30 rounded-full p-2 mr-3">
          <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
          </svg>
        </div>
        <h3 className="text-white font-bold text-lg">Ángulos Principales</h3>
      </div>

      <div className="space-y-3">
        {/* ASCENDENTE COMPACTO */}
        <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/10">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 rounded-full p-1.5 mr-3">
              <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 19V5"/>
                <path d="M5 12l7-7 7 7"/>
              </svg>
            </div>
            <div>
              <div className="text-cyan-300 font-semibold text-sm">Ascendente</div>
              <div className="text-gray-400 text-xs">Tu máscara social</div>
            </div>
          </div>
          <div className="text-right">
            {ascendant?.sign ? (
              <>
                <div className="flex items-center text-white font-bold">
                  <span className="text-xl mr-2">{SIGN_SYMBOLS[ascendant.sign] || '♈'}</span>
                  <span className="text-sm">{ascendant.sign}</span>
                </div>
                <div className="text-cyan-300 text-xs">
                  {ascendant.degree ? `${Math.floor(ascendant.degree)}° ${ascendant.minutes ? Math.floor(ascendant.minutes) + "'" : ''}` : 'N/A'}
                </div>
              </>
            ) : (
              <div className="text-gray-500 text-xs">No disponible</div>
            )}
          </div>
        </div>

        {/* MEDIO CIELO COMPACTO */}
        <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/10">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-400/20 to-pink-500/20 border border-purple-400/30 rounded-full p-1.5 mr-3">
              <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 3h18v18H3zM9 9h6v6H9z"/>
                <path d="M9 1v6M15 1v6M9 17v6M15 17v6M1 9h6M1 15h6M17 9h6M17 15h6"/>
              </svg>
            </div>
            <div>
              <div className="text-purple-300 font-semibold text-sm">Medio Cielo</div>
              <div className="text-gray-400 text-xs">Tu vocación pública</div>
            </div>
          </div>
          <div className="text-right">
            {midheaven?.sign ? (
              <>
                <div className="flex items-center text-white font-bold">
                  <span className="text-xl mr-2">{SIGN_SYMBOLS[midheaven.sign] || '♈'}</span>
                  <span className="text-sm">{midheaven.sign}</span>
                </div>
                <div className="text-purple-300 text-xs">
                  {midheaven.degree ? `${Math.floor(midheaven.degree)}° ${midheaven.minutes ? Math.floor(midheaven.minutes) + "'" : ''}` : 'N/A'}
                </div>
              </>
            ) : (
              <div className="text-gray-500 text-xs">No disponible</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedAscendantMCCard;