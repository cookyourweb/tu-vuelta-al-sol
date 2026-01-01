// src/components/agenda/FichasPlanetarias.tsx
'use client';

import React from 'react';

interface PlanetCard {
  planet: string;
  prioridad: 1 | 2 | 3;
  natal: {
    posicion: string;
    descripcion: string;
  };
  activacion_anual: {
    posicion: string;
    razon_activacion: string;
  };
  traduccion_practica: string;
  regla_del_ano: string;
}

interface FichasPlanetariasProps {
  activePlanets: PlanetCard[];
  loadingActivePlanets: boolean;
}

export default function FichasPlanetarias({ activePlanets, loadingActivePlanets }: FichasPlanetariasProps) {
  const currentYear = new Date().getFullYear();

  // Filtrar solo planetas de prioridad 1 y 2
  const planetsToShow = activePlanets.filter(p => p.prioridad === 1 || p.prioridad === 2);

  return (
    <div className="max-w-7xl mx-auto mb-12">
      <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-sm rounded-3xl p-8 border border-purple-400/30 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center justify-between">
          <span className="flex items-center gap-3">
            <span className="text-4xl">🪐</span>
            Tus Planetas Activos {currentYear}
          </span>
          <span className="text-sm text-purple-300">
            (Solo planetas enfatizados este año)
          </span>
        </h2>

        {loadingActivePlanets ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400 mb-4"></div>
            <p className="text-purple-300">Cargando planetas activos...</p>
          </div>
        ) : planetsToShow.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {planetsToShow.map((planet, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">{planet.planet} del Año</h3>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    planet.prioridad === 1
                      ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-400/30'
                      : 'bg-blue-500/30 text-blue-300 border border-blue-400/30'
                  }`}>
                    {planet.prioridad === 1 ? '⭐ Alta' : '🌟 Media'}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* NATAL */}
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-purple-300 text-xs font-semibold mb-1">QUIÉN ERES:</p>
                    <p className="text-white text-sm">{planet.natal.posicion}</p>
                    <p className="text-gray-300 text-xs mt-2 line-clamp-2">{planet.natal.descripcion}</p>
                  </div>

                  {/* ACTIVACIÓN ANUAL */}
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-cyan-300 text-xs font-semibold mb-1">QUÉ SE ACTIVA:</p>
                    <p className="text-white text-sm">{planet.activacion_anual.posicion}</p>
                    <p className="text-gray-300 text-xs mt-2">{planet.activacion_anual.razon_activacion}</p>
                  </div>

                  {/* TRADUCCIÓN PRÁCTICA */}
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-l-4 border-yellow-400 rounded-lg p-3">
                    <p className="text-white text-sm italic font-medium leading-relaxed">
                      "{planet.traduccion_practica}"
                    </p>
                  </div>

                  {/* REGLA DEL AÑO */}
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-l-4 border-green-400 rounded-lg p-3">
                    <p className="text-green-200 text-xs font-semibold mb-1">REGLA:</p>
                    <p className="text-white text-sm">
                      {planet.regla_del_ano}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-purple-300 py-8">
            No se encontraron planetas activos. Asegúrate de tener tu carta natal y retorno solar calculados.
          </p>
        )}
      </div>
    </div>
  );
}
