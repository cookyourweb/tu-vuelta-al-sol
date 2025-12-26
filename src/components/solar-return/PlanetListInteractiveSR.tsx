// =============================================================================
// 📋 COMPONENTE DEMO: Lista interactiva de planetas Solar Return
// =============================================================================
// Componente de ejemplo que muestra cómo usar PlanetClickableSR
// Puede usarse temporalmente o como base para integración final
// =============================================================================

'use client';

import React from 'react';
import { PlanetClickableSR } from './PlanetClickableSR';

// =============================================================================
// 📚 INTERFACES
// =============================================================================

interface PlanetData {
  name: string;
  natalSign: string;
  natalHouse: number;
  natalDegree: number;
  srSign: string;
  srHouse: number;
  srDegree: number;
}

interface PlanetListInteractiveSRProps {
  userId: string;
  returnYear: number;
  userFirstName: string;
  planets: PlanetData[];
  natalChart?: any; // Para obtener interpretaciones natales si existen
}

// =============================================================================
// 🎨 COMPONENTE PRINCIPAL
// =============================================================================

export const PlanetListInteractiveSR: React.FC<PlanetListInteractiveSRProps> = ({
  userId,
  returnYear,
  userFirstName,
  planets,
  natalChart,
}) => {

  // Mapeo de símbolos de planetas
  const planetSymbols: Record<string, string> = {
    sol: '☀️',
    luna: '🌙',
    mercurio: '☿',
    venus: '♀',
    marte: '♂',
    jupiter: '♃',
    saturno: '♄',
    urano: '♅',
    neptuno: '♆',
    pluton: '♇',
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">
        🪐 Planetas del Retorno Solar {returnYear}
      </h2>
      <p className="text-gray-300 text-sm mb-6">
        Haz clic en cualquier planeta para ver su interpretación profesional personalizada (8 secciones)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {planets.map((planet) => (
          <PlanetClickableSR
            key={planet.name}
            planetName={planet.name.toLowerCase()}
            userId={userId}
            returnYear={returnYear}
            userFirstName={userFirstName}
            natalSign={planet.natalSign}
            natalHouse={planet.natalHouse}
            natalDegree={planet.natalDegree}
            srSign={planet.srSign}
            srHouse={planet.srHouse}
            srDegree={planet.srDegree}
          >
            {({ onClick, isLoading }) => (
              <button
                onClick={onClick}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg p-4 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {planetSymbols[planet.name.toLowerCase()] || '⭐'}
                    </span>
                    <div className="text-left">
                      <div className="font-bold text-lg">
                        {planet.name.charAt(0).toUpperCase() + planet.name.slice(1)}
                      </div>
                      <div className="text-xs text-indigo-200">
                        Natal: {planet.natalSign} Casa {planet.natalHouse}
                      </div>
                      <div className="text-xs text-purple-200">
                        SR: {planet.srSign} Casa {planet.srHouse}
                      </div>
                    </div>
                  </div>

                  {isLoading ? (
                    <span className="animate-spin text-2xl">⏳</span>
                  ) : (
                    <span className="text-2xl">→</span>
                  )}
                </div>
              </button>
            )}
          </PlanetClickableSR>
        ))}
      </div>

      <div className="mt-8 bg-blue-900/20 rounded-lg p-4 border border-blue-700/30">
        <h3 className="text-sm font-bold text-blue-200 mb-2 flex items-center gap-2">
          <span>ℹ️</span> Cómo funciona
        </h3>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>• Al hacer clic, se genera una interpretación personalizada (o se obtiene del caché)</li>
          <li>• La interpretación tiene 8 secciones profesionales (NO poéticas como la Carta Natal)</li>
          <li>• Tono directo y concreto: "Durante este período: te vuelves más consciente de..."</li>
          <li>• Incluye acciones concretas y cómo usar esta energía en tu agenda</li>
        </ul>
      </div>
    </div>
  );
};
