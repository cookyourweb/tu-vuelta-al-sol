// src/components/astrology/AscendantCard.tsx
// Card del Ascendente extraída del ChartDisplay

import React from 'react';
// ✅ IMPORT CORREGIDO
import { SIGN_SYMBOLS, signMeanings } from '../../constants/astrology/chartConstants';

interface AscendantCardProps {
  ascendant?: { 
    longitude?: number; 
    sign?: string; 
    degree?: number; 
    minutes?: number;
  };
}

const AscendantCard: React.FC<AscendantCardProps> = ({ ascendant }) => {
  if (!ascendant || !ascendant.sign) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-8 relative group hover:scale-105 transition-all duration-300 overflow-hidden">
      <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-green-400/10 rounded-full"></div>
      
      <div className="bg-gradient-to-r from-green-400/20 to-emerald-500/20 border border-green-400/30 rounded-full p-6 backdrop-blur-sm mb-6 w-fit group-hover:scale-110 transition-transform">
        <svg className="w-8 h-8 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="19" x2="12" y2="5"/>
          <polyline points="5,12 12,5 19,12"/>
        </svg>
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-4">Tu Ascendente</h3>
      <p className="text-gray-300 mb-6 leading-relaxed">
        🎭 Tu máscara social y la primera impresión que causas al mundo.
      </p>
      
      <div className="space-y-4">
        <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm border border-white/10">
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-4">{SIGN_SYMBOLS[ascendant.sign] || '♈'}</span>
            <div>
              <div className="text-green-300 font-bold text-xl">{ascendant.sign}</div>
              <div className="text-gray-300 text-sm">{ascendant.degree}°{ascendant.minutes ? ` ${ascendant.minutes}'` : ''}</div>
            </div>
          </div>
          
          <div className="text-green-200 text-sm mb-3">
            <strong>🌟 Personalidad externa:</strong> {signMeanings[ascendant.sign as keyof typeof signMeanings]}
          </div>
          
          <div className="text-gray-300 text-xs leading-relaxed">
            Con Ascendente en {ascendant.sign}, te presentas al mundo con las cualidades de {signMeanings[ascendant.sign as keyof typeof signMeanings]?.toLowerCase()}. 
            Esta es la energía que proyectas naturalmente.
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <span className="bg-green-400/20 text-green-200 text-xs px-3 py-1 rounded-full border border-green-400/30">Personalidad</span>
          <span className="bg-green-400/20 text-green-200 text-xs px-3 py-1 rounded-full border border-green-400/30">Imagen</span>
          <span className="bg-green-400/20 text-green-200 text-xs px-3 py-1 rounded-full border border-green-400/30">Vitalidad</span>
        </div>
      </div>
    </div>
  );
};

export default AscendantCard;