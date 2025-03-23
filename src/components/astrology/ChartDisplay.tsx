'use client';

import { NatalChart } from '@/services/astrologyService';
import { useState } from 'react';
interface ChartDisplayProps {
  chart: NatalChart;
}

export default function ChartDisplay({ chart }: ChartDisplayProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

  // Obtener interpretación para el planeta seleccionado
  const getInterpretationForPlanet = () => {
    if (!selectedPlanet) return null;
    
    const planet = chart.planets.find((p: { name: string }) => p.name === selectedPlanet);
    if (!planet) return null;
    
    return (
      <div className="mt-4 p-4 bg-purple-50 rounded-lg">
        <h3 className="text-lg font-medium text-purple-900">{planet.name} en {planet.sign} (Casa {planet.housePosition})</h3>
        <p className="mt-2 text-sm text-purple-800">
          {planet.name} en {planet.sign} en la casa {planet.housePosition} indica...
          {planet.retrograde && ' Este planeta está retrógrado, lo que sugiere una energía más internalizada.'}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu Carta Natal</h2>
      
      {/* Información básica */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Información Básica</h3>
        <div className="grid grid-cols-2 gap-4">
          {chart.ascendant && (
            <div>
              <span className="text-gray-500">Ascendente:</span>{' '}
              <span className="font-medium">{chart.ascendant.sign} {chart.ascendant.degree}°{chart.ascendant.minutes}&apos;</span>
            </div>
          )}
          {chart.midheaven && (
            <div>
              <span className="text-gray-500">Medio Cielo:</span>{' '}
              <span className="font-medium">{chart.midheaven.sign} {chart.midheaven.degree}°{chart.midheaven.minutes}&apos;</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Posiciones planetarias */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Posiciones Planetarias</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chart.planets.map((planet: { name: string; sign: string; degree: number; minutes: number; retrograde: boolean; housePosition: number }) => (
            <div 
              key={planet.name}
              className={`p-3 rounded-md border cursor-pointer transition-colors ${
                selectedPlanet === planet.name 
                  ? 'bg-purple-100 border-purple-300' 
                  : 'bg-white hover:bg-gray-50 border-gray-200'
              }`}
              onClick={() => setSelectedPlanet(planet.name === selectedPlanet ? null : planet.name)}
            >
              <div className="font-medium">{planet.name}</div>
              <div>
                {planet.sign} {planet.degree}°{planet.minutes}&apos;
                {planet.retrograde && <span className="text-red-500 ml-1">℞</span>}
              </div>
              <div className="text-gray-500 text-sm">Casa {planet.housePosition}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Interpretación del planeta seleccionado */}
      {selectedPlanet && getInterpretationForPlanet()}
      
      {/* Aspectos */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aspectos Principales</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planetas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aspecto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orbe</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chart.aspects.slice(0, 10).map((aspect: { planet1: string; planet2: string; type: string; orb: number | string }, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {aspect.planet1} - {aspect.planet2}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {aspect.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {typeof aspect.orb === 'number' ? aspect.orb.toFixed(1) : aspect.orb}°
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
