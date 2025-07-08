// src/components/astrology/AspectControlPanel.tsx
// Panel de control para filtros de aspectos extraído del ChartDisplay

import React from 'react';
import type { SelectedAspectTypes } from '../../types/astrology/chartDisplay';

interface AspectControlPanelProps {
  showAspects: boolean;
  setShowAspects: (show: boolean) => void;
  selectedAspectTypes: SelectedAspectTypes;
  toggleAspectType: (type: keyof SelectedAspectTypes) => void;
  aspectStats: {
    total: number;
    exact: number;
    major: number;
    minor: number;
  };
}

const AspectControlPanel: React.FC<AspectControlPanelProps> = ({
  showAspects,
  setShowAspects,
  selectedAspectTypes,
  toggleAspectType,
  aspectStats
}) => {
  
  const aspectTypeConfigs = {
    major: { 
      label: 'Aspectos Mayores', 
      tooltip: 'Los 5 aspectos principales: más fuertes y definitorios',
      color: 'blue',
      count: aspectStats.major,
      icon: () => (
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      )
    },
    minor: { 
      label: 'Aspectos Menores', 
      tooltip: 'Influencias más sutiles pero importantes',
      color: 'purple',
      count: aspectStats.minor,
      icon: () => (
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
      )
    },
    easy: { 
      label: 'Aspectos Armónicos', 
      tooltip: 'Facilidades, talentos y energías que fluyen',
      color: 'cyan',
      count: Math.floor(aspectStats.total * 0.4), // Estimación
      icon: () => (
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 6 9 17l-5-5"/>
        </svg>
      )
    },
    hard: { 
      label: 'Aspectos Tensos', 
      tooltip: 'Tensiones creativas que impulsan el desarrollo',
      color: 'red',
      count: Math.floor(aspectStats.total * 0.6), // Estimación
      icon: () => (
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
        </svg>
      )
    }
  };

  const getColorClasses = (color: string, isActive: boolean) => {
    const colorMap = {
      blue: isActive 
        ? 'from-blue-400/30 to-purple-500/30 border-blue-400/50 text-blue-300' 
        : 'bg-gray-600/20 border-gray-500/30 text-gray-400',
      purple: isActive 
        ? 'from-purple-400/30 to-pink-500/30 border-purple-400/50 text-purple-300' 
        : 'bg-gray-600/20 border-gray-500/30 text-gray-400',
      cyan: isActive 
        ? 'from-cyan-400/30 to-blue-500/30 border-cyan-400/50 text-cyan-300' 
        : 'bg-gray-600/20 border-gray-500/30 text-gray-400',
      red: isActive 
        ? 'from-red-400/30 to-pink-500/30 border-red-400/50 text-red-300' 
        : 'bg-gray-600/20 border-gray-500/30 text-gray-400'
    };
    
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-purple-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="13.5" cy="6.5" r=".5"/>
            <circle cx="17.5" cy="10.5" r=".5"/>
            <circle cx="8.5" cy="7.5" r=".5"/>
            <circle cx="6.5" cy="12.5" r=".5"/>
            <polyline points="13.5,6.5 8.5,7.5 6.5,12.5 17.5,10.5"/>
          </svg>
          <h3 className="text-lg font-bold text-white">Configuración de Aspectos de la Carta</h3>
          <div className="ml-2 text-gray-400 text-sm">
            (Líneas que conectan planetas en la carta visual)
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Stats compactos */}
          <div className="flex items-center space-x-3 text-sm">
            <div className="flex items-center">
              <span className="text-blue-300 font-semibold">{aspectStats.total}</span>
              <span className="text-gray-400 ml-1">total</span>
            </div>
            <div className="flex items-center">
              <span className="text-yellow-300 font-semibold">{aspectStats.exact}</span>
              <span className="text-gray-400 ml-1">exactos</span>
            </div>
          </div>
          
          <button
            onClick={() => setShowAspects(!showAspects)}
            className={`flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
              showAspects 
                ? 'bg-gradient-to-r from-green-400/20 to-blue-500/20 border border-green-400/30 text-green-300' 
                : 'bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-500/30 text-gray-400'
            }`}
          >
            {showAspects ? (
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            )}
            {showAspects ? 'Ocultar Aspectos' : 'Mostrar Aspectos'}
          </button>
        </div>
      </div>
      
      {showAspects && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {Object.entries(aspectTypeConfigs).map(([key, config]) => {
              const IconComponent = config.icon;
              const isActive = selectedAspectTypes[key as keyof SelectedAspectTypes];
              
              return (
                <div key={key} className="relative group">
                  <button
                    onClick={() => toggleAspectType(key as keyof SelectedAspectTypes)}
                    className={`w-full p-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center border ${
                      isActive 
                        ? `bg-gradient-to-r ${getColorClasses(config.color, true)}` 
                        : getColorClasses(config.color, false)
                    }`}
                  >
                    <IconComponent />
                    <div className="flex flex-col items-start">
                      <span>{config.label}</span>
                      <span className="text-xs opacity-75">({config.count})</span>
                    </div>
                  </button>
                  
                  <div 
                    className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-sm border border-white/30 rounded-xl p-3 shadow-2xl transition-opacity duration-200 pointer-events-none max-w-xs"
                    style={{ zIndex: 99999 }}
                  >
                    <div className="text-white text-xs font-semibold mb-1">{config.label}</div>
                    <div className="text-gray-300 text-xs">{config.tooltip}</div>
                    <div className="text-cyan-300 text-xs mt-1">Detectados: {config.count}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Información adicional sobre aspectos exactos */}
          {aspectStats.exact > 0 && (
            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-3">
              <div className="flex items-center text-yellow-300 text-sm font-semibold mb-1">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
                {aspectStats.exact} Aspecto{aspectStats.exact > 1 ? 's' : ''} Exacto{aspectStats.exact > 1 ? 's' : ''} Detectado{aspectStats.exact > 1 ? 's' : ''}
              </div>
              <div className="text-yellow-200 text-xs">
                Los aspectos exactos (orbe &lt; 1°) tienen máxima potencia energética y son especialmente importantes en tu carta.
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AspectControlPanel;