// src/components/astrology/ElementsModalitiesCard.tsx
// Card de Elementos + Modalidades

import React from 'react';

interface ElementsModalitiesCardProps {
  elementDistribution: { fire: number; earth: number; air: number; water: number };
  modalityDistribution: { cardinal: number; fixed: number; mutable: number };
}

const ElementsModalitiesCard: React.FC<ElementsModalitiesCardProps> = ({ 
  elementDistribution, 
  modalityDistribution 
}) => {
  return (
    <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-sm border border-orange-400/30 rounded-3xl p-8 relative group hover:scale-105 transition-all duration-300 overflow-hidden">
      <div className="absolute top-4 right-4 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-orange-400/10 rounded-full"></div>
      
      {/* Elementos */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-4 backdrop-blur-sm mb-4 w-fit group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 flex items-center">
          <svg className="w-5 h-5 text-yellow-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
          Distribución de Elementos
        </h3>
        
        <div className="space-y-2">
          {Object.entries(elementDistribution).map(([element, count]) => {
            const percentage = ((count / 10) * 100).toFixed(0);
            const elementInfo = {
              fire: { 
                emoji: <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8 2 5 5 5 9c0 5 4 9 7 11 3-2 7-6 7-11 0-4-3-7-7-7z"/></svg>, 
                name: 'Fuego', 
                color: 'bg-red-500' 
              },
              earth: { 
                emoji: <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" fill="none" stroke="currentColor" strokeWidth="2"/></svg>, 
                name: 'Tierra', 
                color: 'bg-green-500' 
              },
              air: { 
                emoji: <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>, 
                name: 'Aire', 
                color: 'bg-blue-500' 
              },
              water: { 
                emoji: <svg className="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>, 
                name: 'Agua', 
                color: 'bg-purple-500' 
              }
            };
            
            return (
              <div key={element} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <span className="mr-2">{elementInfo[element as keyof typeof elementInfo].emoji}</span>
                  <span className="text-gray-300">{elementInfo[element as keyof typeof elementInfo].name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-700 rounded-full h-1.5">
                    <div 
                      className={`${elementInfo[element as keyof typeof elementInfo].color} h-1.5 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-white font-medium text-xs min-w-[35px]">
                    {count} ({percentage}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modalidades */}
      <div>
        <div className="bg-gradient-to-r from-purple-400/20 to-pink-500/20 border border-purple-400/30 rounded-full p-4 backdrop-blur-sm mb-4 w-fit group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
          </svg>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 flex items-center">
          <svg className="w-5 h-5 text-purple-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
          </svg>
          Distribución de Modalidades
        </h3>
        
        <div className="space-y-2">
          {Object.entries(modalityDistribution).map(([modality, count]) => {
            const percentage = ((count / 10) * 100).toFixed(0);
            const modalityInfo = {
              cardinal: { 
                emoji: <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg>, 
                name: 'Cardinal', 
                color: 'bg-red-500' 
              },
              fixed: { 
                emoji: <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><circle cx="12" cy="16" r="1"/></svg>, 
                name: 'Fijo', 
                color: 'bg-blue-500' 
              },
              mutable: { 
                emoji: <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>, 
                name: 'Mutable', 
                color: 'bg-green-500' 
              }
            };
            
            return (
              <div key={modality} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <span className="mr-2">{modalityInfo[modality as keyof typeof modalityInfo].emoji}</span>
                  <span className="text-gray-300">{modalityInfo[modality as keyof typeof modalityInfo].name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-700 rounded-full h-1.5">
                    <div 
                      className={`${modalityInfo[modality as keyof typeof modalityInfo].color} h-1.5 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-white font-medium text-xs min-w-[35px]">
                    {count} ({percentage}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-orange-500/10 border border-orange-400/30 rounded-lg">
        <div className="text-orange-200 text-xs">
          <strong>💡 Tu perfil energético:</strong> Combinación única de elementos y modalidades que define tu estilo personal.
        </div>
      </div>
    </div>
  );
};

export default ElementsModalitiesCard;