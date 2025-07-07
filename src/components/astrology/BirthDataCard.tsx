// src/components/astrology/BirthDataCard.tsx
// Card de datos de nacimiento extraída del ChartDisplay

import React from 'react';
import { Calendar, MapPin, Clock, Star } from 'lucide-react';

interface BirthDataCardProps {
  birthData?: {
    birthDate?: string;
    birthTime?: string;
    birthPlace?: string;
  };
  ascendant?: { 
    longitude?: number; 
    sign?: string; 
    degree?: number; 
    minutes?: number;
  };
}

const BirthDataCard: React.FC<BirthDataCardProps> = ({ birthData, ascendant }) => {
  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-8 relative group hover:scale-105 transition-all duration-300 overflow-hidden">
      <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-green-400/10 rounded-full"></div>
      
      <div className="bg-gradient-to-r from-green-400/20 to-blue-500/20 border border-green-400/30 rounded-full p-6 backdrop-blur-sm mb-6 w-fit group-hover:scale-110 transition-transform">
        <Calendar className="w-8 h-8 text-green-400" />
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-4">Tu Momento Cósmico</h3>
      <p className="text-gray-300 mb-6 leading-relaxed">
        Los datos exactos que definen las posiciones planetarias en tu carta natal.
      </p>
      
      <div className="space-y-4">
        <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10">
          <div className="flex items-center mb-2">
            <Calendar className="w-5 h-5 text-yellow-400 mr-2" />
            <span className="text-yellow-300 font-semibold text-sm">Fecha</span>
          </div>
          <div className="text-white font-bold">
            {birthData?.birthDate ? new Date(birthData.birthDate).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long', 
              year: 'numeric'
            }) : 'No especificada'}
          </div>
        </div>
        
        <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10">
          <div className="flex items-center mb-2">
            <Clock className="w-5 h-5 text-purple-400 mr-2" />
            <span className="text-purple-300 font-semibold text-sm">Hora</span>
          </div>
          <div className="text-white font-bold">
            {birthData?.birthTime || 'No especificada'}
          </div>
        </div>
        
        <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10">
          <div className="flex items-center mb-2">
            <MapPin className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-green-300 font-semibold text-sm">Lugar</span>
          </div>
          <div className="text-white font-bold">
            {birthData?.birthPlace || 'No especificado'}
          </div>
        </div>
        
        <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10">
          <div className="flex items-center mb-2">
            <Star className="w-5 h-5 text-cyan-400 mr-2" />
            <span className="text-cyan-300 font-semibold text-sm">Precisión</span>
          </div>
          <div className="text-white font-bold">
            {ascendant?.sign ? '✅ Exacta' : '⚠️ Aproximada'}
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-3 bg-green-500/10 border border-green-400/30 rounded-lg">
        <div className="text-green-200 text-xs">
          <strong>📍 Info:</strong> La hora exacta es crucial para el Ascendente y las casas astrológicas.
        </div>
      </div>
    </div>
  );
};

export default BirthDataCard;