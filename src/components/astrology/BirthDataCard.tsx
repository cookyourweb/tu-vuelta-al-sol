// src/components/astrology/BirthDataCard.tsx
// Card de datos de nacimiento - VERSIÓN COMPACTA

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
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long', 
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4 relative group hover:scale-[1.02] transition-all duration-300 overflow-hidden">
      <div className="absolute top-3 right-3 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-r from-green-400/20 to-blue-500/20 border border-green-400/30 rounded-full p-2 mr-3">
          <Calendar className="w-4 h-4 text-green-400" />
        </div>
        <h3 className="text-white font-bold text-lg">Tu Momento Cósmico</h3>
      </div>
      
      <div className="space-y-3">
        {/* Fecha compacta */}
        <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/10">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-gray-300 text-sm">Fecha</span>
          </div>
          <span className="text-white font-semibold text-sm">
            {formatDate(birthData?.birthDate)}
          </span>
        </div>

        {/* Hora compacta */}
        <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/10">
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-gray-300 text-sm">Hora</span>
          </div>
          <span className="text-white font-semibold text-sm">
            {birthData?.birthTime || 'No disponible'}
          </span>
        </div>

        {/* Lugar compacto */}
        <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/10">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 text-green-400 mr-2" />
            <span className="text-gray-300 text-sm">Lugar</span>
          </div>
          <span className="text-white font-semibold text-sm text-right max-w-[120px] truncate">
            {birthData?.birthPlace || 'No disponible'}
          </span>
        </div>

        {/* Estado de precisión compacto */}
        <div className="flex items-center justify-center p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg">
          <Star className="w-3 h-3 text-green-400 mr-2" />
          <span className="text-green-300 font-semibold text-xs">Precisión Exacta</span>
        </div>
      </div>
    </div>
  );
};

export default BirthDataCard;