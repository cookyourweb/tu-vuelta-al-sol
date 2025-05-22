//src/components/test/NatalChartTest.tsx
'use client';

import React, { useState } from 'react';
import ChartDisplay from '@/components/astrology/ChartDisplay';

const NatalChartTest: React.FC = () => {
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [birthTime, setBirthTime] = useState('12:00:00');
  const [latitude, setLatitude] = useState(40.4168);
  const [longitude, setLongitude] = useState(-3.7038);
  const [timezone, setTimezone] = useState('Europe/Madrid');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  interface ChartData {
    houses: { houseNumber: number; degree: number; sign: string }[]; // Replace 'any' with a specific type
    planets: { name: string; degree: number; sign: string; retrograde: boolean }[];
    aspects: { aspect: string; planet1: string; planet2: string; orb: number }[];
    angles: { name: string; degree: number }[];
    elementDistribution: {
      fire: number;
      earth: number;
      air: number;
      water: number;
    };
    modalityDistribution: {
      cardinal: number;
      fixed: number;
      mutable: number;
    };
    keyAspects: { aspect: string; planet1: string; planet2: string; orb: number }[];
  }

  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [rawResponse, setRawResponse] = useState<Record<string, unknown> | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setChartData(null);
    setRawResponse(null);

    try {
      // Llamar al endpoint simplificado
      const response = await fetch('/api/prokerala/natal-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthDate,
          birthTime,
          latitude,
          longitude,
          timezone
        }),
      });

      // Obtener respuesta completa (para depuración)
      const result = await response.json();
      setRawResponse(result);

      if (!response.ok) {
        throw new Error(result.error || 'Error al obtener carta natal');
      }

      // Verificar si hay datos de carta
      if (result.success && result.data) {
        setChartData(result.data);
      } else {
        throw new Error('Formato de respuesta incorrecto');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Test de Carta Natal</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora de nacimiento
            </label>
            <input
              type="time"
              step="1"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitud
            </label>
            <input
              type="number"
              step="0.0001"
              value={latitude}
              onChange={(e) => setLatitude(parseFloat(e.target.value))}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitud
            </label>
            <input
              type="number"
              step="0.0001"
              value={longitude}
              onChange={(e) => setLongitude(parseFloat(e.target.value))}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zona horaria
            </label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Formato: &apos;Europe/Madrid&apos;, &apos;America/New_York&apos;, etc.
            </p>
          </div>
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando...
              </>
            ) : 'Generar Carta Natal'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Visualización de datos crudos (para depuración) */}
      {rawResponse && (
        <div className="mb-8">
          <details className="bg-gray-50 p-4 rounded-md">
            <summary className="font-medium cursor-pointer">Ver respuesta completa</summary>
            <pre className="mt-4 text-xs overflow-auto max-h-96">
              {JSON.stringify(rawResponse, null, 2)}
            </pre>
          </details>
        </div>
      )}
      
      {/* Visualización de la carta natal */}
      {chartData && (
        <div className="mb-8">
          <ChartDisplay 
            houses={(chartData.houses || []).map(house => ({
              id: house.houseNumber,
              degree: house.degree,
              name: house.sign,
            }))}
            planets={(chartData.planets || []).map(planet => ({
              name: planet.name,
              longitude: planet.degree,
              sign: planet.sign,
            }))}
            aspects={(chartData.aspects || []).map(aspect => ({
              planet1: { name: aspect.planet1 },
              planet2: { name: aspect.planet2 },
              type: aspect.aspect,
            }))}
            elementDistribution={chartData.elementDistribution || { fire: 0, earth: 0, air: 0, water: 0 }}
            
            modalityDistribution={chartData.modalityDistribution || { cardinal: 0, fixed: 0, mutable: 0 }}
            // keyAspects prop removed as it is not defined in ChartDisplayProps
          />
        </div>
      )}
    </div>
  );
};

export default NatalChartTest;