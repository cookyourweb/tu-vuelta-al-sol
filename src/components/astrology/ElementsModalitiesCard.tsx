// src/components/astrology/ElementsModalitiesCard.tsx
// Card de Elementos + Modalidades - VERSIÓN COMPACTA

import React from 'react';

interface ElementsModalitiesCardProps {
  elementDistribution: { fire: number; earth: number; air: number; water: number };
  modalityDistribution: { cardinal: number; fixed: number; mutable: number };
}

const ElementsModalitiesCard: React.FC<ElementsModalitiesCardProps> = ({ 
  elementDistribution, 
  modalityDistribution 
}) => {
  const elementInfo = {
    fire: { 
      emoji: '🔥', 
      name: 'Fuego', 
      color: 'bg-red-500',
      gradient: 'from-red-500/20 to-orange-500/20',
      border: 'border-red-400/30',
      text: 'text-red-400'
    },
    earth: { 
      emoji: '🌱', 
      name: 'Tierra', 
      color: 'bg-green-500',
      gradient: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-400/30',
      text: 'text-green-400'
    },
    air: { 
      emoji: '💨', 
      name: 'Aire', 
      color: 'bg-blue-500',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-blue-400/30',
      text: 'text-blue-400'
    },
    water: { 
      emoji: '💧', 
      name: 'Agua', 
      color: 'bg-purple-500',
      gradient: 'from-purple-500/20 to-indigo-500/20',
      border: 'border-purple-400/30',
      text: 'text-purple-400'
    }
  };

  const modalityInfo = {
    cardinal: { 
      emoji: '⚡', 
      name: 'Cardinal', 
      color: 'bg-orange-500',
      gradient: 'from-orange-500/20 to-red-500/20',
      border: 'border-orange-400/30',
      text: 'text-orange-400'
    },
    fixed: { 
      emoji: '🔒', 
      name: 'Fijo', 
      color: 'bg-blue-500',
      gradient: 'from-blue-500/20 to-indigo-500/20',
      border: 'border-blue-400/30',
      text: 'text-blue-400'
    },
    mutable: { 
      emoji: '🔄', 
      name: 'Mutable', 
      color: 'bg-green-500',
      gradient: 'from-green-500/20 to-teal-500/20',
      border: 'border-green-400/30',
      text: 'text-green-400'
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4 relative group hover:scale-[1.02] transition-all duration-300 overflow-hidden">
      <div className="absolute top-3 right-3 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
      
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-2 mr-3">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
          </svg>
        </div>
        <h3 className="text-white font-bold text-lg">Distribuciones</h3>
      </div>

      <div className="space-y-4">
        {/* ELEMENTOS COMPACTOS */}
        <div>
          <h4 className="text-yellow-300 font-semibold text-sm mb-2 flex items-center">
            <span className="text-yellow-400 mr-2">✨</span>
            Elementos
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(elementDistribution).map(([element, count]) => {
              const percentage = count;
              const info = elementInfo[element as keyof typeof elementInfo];
              
              return (
                <div key={element} className={`bg-gradient-to-r ${info.gradient} border ${info.border} rounded-lg p-2 flex items-center justify-between`}>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">{info.emoji}</span>
                    <span className={`${info.text} font-medium text-xs capitalize`}>
                      {info.name}
                    </span>
                  </div>
                  <span className="text-white font-bold text-xs">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* MODALIDADES COMPACTAS */}
        <div>
          <h4 className="text-purple-300 font-semibold text-sm mb-2 flex items-center">
            <span className="text-purple-400 mr-2">⚡</span>
            Modalidades
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(modalityDistribution).map(([modality, count]) => {
              const percentage = count;
              const info = modalityInfo[modality as keyof typeof modalityInfo];
              
              return (
                <div key={modality} className={`bg-gradient-to-r ${info.gradient} border ${info.border} rounded-lg p-2 flex items-center justify-between`}>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">{info.emoji}</span>
                    <span className={`${info.text} font-medium text-xs capitalize`}>
                      {info.name}
                    </span>
                  </div>
                  <span className="text-white font-bold text-xs">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Footer compacto */}
      <div className="mt-3 p-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/20 rounded-lg">
        <div className="text-yellow-200 text-xs text-center">
          <strong>💫 Perfil energético único</strong>
        </div>
      </div>
    </div>
  );
};

export default ElementsModalitiesCard;