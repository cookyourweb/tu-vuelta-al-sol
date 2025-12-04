// src/components/astrology/MidheavenCard.tsx
// Card del Medio Cielo extraída del ChartDisplay

import React from 'react';
// ✅ IMPORT CORREGIDO
import { SIGN_SYMBOLS, signMeanings } from '@/constants/astrology/chartConstants';

interface MidheavenCardProps {
  midheaven?: { 
    longitude?: number; 
    sign?: string; 
    degree?: number; 
    minutes?: number;
  };
}

const MidheavenCard: React.FC<MidheavenCardProps> = ({ midheaven }) => {
  if (!midheaven || !midheaven.sign) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-8 relative group hover:scale-105 transition-all duration-300 overflow-hidden">
      <div className="absolute top-4 right-4 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
      <div className="absolute -top-10 -left-10 w-20 h-20 bg-purple-400/10 rounded-full"></div>
      
      <div className="bg-gradient-to-r from-purple-400/20 to-violet-500/20 border border-purple-400/30 rounded-full p-6 backdrop-blur-sm mb-6 w-fit group-hover:scale-110 transition-transform">
        <svg className="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
          <polyline points="16,7 22,7 22,13"/>
        </svg>
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-4">Tu Medio Cielo</h3>
      <p className="text-gray-300 mb-6 leading-relaxed">
        🎯 Tu vocación, carrera ideal y propósito profesional en el mundo.
      </p>
      
      <div className="space-y-4">
        <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm border border-white/10">
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-4">{SIGN_SYMBOLS[midheaven.sign] || '♈'}</span>
            <div>
              <div className="text-purple-300 font-bold text-xl">{midheaven.sign}</div>
              <div className="text-gray-300 text-sm">{midheaven.degree}°{midheaven.minutes ? ` ${midheaven.minutes}'` : ''}</div>
            </div>
          </div>
          
          <div className="text-purple-200 text-sm mb-3">
            <strong>💼 Vocación profesional:</strong> {signMeanings[midheaven.sign as keyof typeof signMeanings]}
          </div>
          
          <div className="text-gray-300 text-xs leading-relaxed">
            Con Medio Cielo en {midheaven.sign}, tu carrera y estatus se expresan a través de {signMeanings[midheaven.sign as keyof typeof signMeanings]?.toLowerCase()}. 
            Esta es la energía que quieres proyectar profesionalmente.
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <span className="bg-purple-400/20 text-purple-200 text-xs px-3 py-1 rounded-full border border-purple-400/30">Carrera</span>
          <span className="bg-purple-400/20 text-purple-200 text-xs px-3 py-1 rounded-full border border-purple-400/30">Reconocimiento</span>
          <span className="bg-purple-400/20 text-purple-200 text-xs px-3 py-1 rounded-full border border-purple-400/30">Estatus</span>
        </div>
      </div>
    </div>
  );
};

export default MidheavenCard;