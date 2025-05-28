//src/app/api/astrology/ChartLoader.tsx
'use client';

import React, { useState } from 'react';
import ChartDisplay from '@/components/astrology/ChartDisplay';


// Define or import the ChartData type
interface ChartData {
  houses: { number: number; sign: string; degree: number }[]; // Corrected to match House type
  planets: { id: number; name: string; degree: number }[]; // Structure for planets
  aspects: { id: number; type: string; planet1: string; planet2: string; degree: number }[];
  angles: { id: number; name: string; degree: number }[];
  elementDistribution: { fire: number; earth: number; air: number; water: number };
  modalityDistribution: { cardinal: number; fixed: number; mutable: number };
  keyAspects: { id: number; description: string; importance: number }[];
}


interface ChartLoaderProps {
  initialBirthDate?: string;
  initialBirthTime?: string;
  initialLatitude?: number;
  initialLongitude?: number;
  initialTimezone?: string;
}

// Helper function to calculate the astrological sign based on degree
const calculateSign = (degree: number): string => {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  return signs[Math.floor(degree / 30) % 12];
};

const ChartLoader: React.FC<ChartLoaderProps> = ({
  initialBirthDate = '1990-01-01',
  initialBirthTime = '12:00:00',
  initialLatitude = 40.4168,
  initialLongitude = -3.7038,
  initialTimezone = 'Europe/Madrid'
}) => {
  // Estados para los datos del formulario
  const [birthDate, setBirthDate] = useState(initialBirthDate);
  const [birthTime, setBirthTime] = useState(initialBirthTime);
  const [latitude, setLatitude] = useState(initialLatitude);
  const [longitude, setLongitude] = useState(initialLongitude);
  const [timezone, setTimezone] = useState(initialTimezone);
  
  // Estados para la carga y visualización
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setChartData(null);
    setIsFallback(false);

    try {
      // Llamar a nuestra API
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

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al obtener carta natal');
      }
      
      // Verificar si es una respuesta de fallback
      if (result.fallback) {
        setIsFallback(true);
        console.log('Usando carta simulada debido a un problema con la API');
      }
      
      // Establecer datos de la carta
      setChartData(result.data || null);
    } catch (err) {
      console.error('Error en la solicitud:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-indigo-700">Generar Carta Natal</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
                  Calculando...
                </>
              ) : 'Generar Carta Natal'}
            </button>
          </div>
        </form>
      </div>
      
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
      
      {isFallback && (
        <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Usando datos simulados debido a un problema con la API de astrología.
                Los resultados pueden no ser totalmente precisos.
              </p>
            {chartData && chartData.planets.map(planet => (
              <div key={planet.id}>
                <p>Name: {planet.name}</p>
                <p>Longitude: {planet.degree}</p>
                <p>Sign: {calculateSign(planet.degree)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
      
{chartData ? (
  <div className="mb-8">
    <ChartDisplay 
      houses={chartData.houses.map(house => ({
        ...house,
        degree: house.degree.toString(),
      }))}
      planets={chartData.planets.map(planet => ({
        name: planet.name,
        longitude: planet.degree,
        sign: calculateSign(planet.degree),
        degree: planet.degree.toString(),
      }))}
      aspects={chartData.aspects.map(aspect => ({
        planet1: { name: aspect.planet1 },
        planet2: { name: aspect.planet2 },
        type: aspect.type,
      }))}
      elementDistribution={{
        fire: chartData.elementDistribution.fire || 0,
        earth: chartData.elementDistribution.earth || 0,
        air: chartData.elementDistribution.air || 0,
        water: chartData.elementDistribution.water || 0,
      }}
      modalityDistribution={{
        cardinal: chartData.modalityDistribution.cardinal || 0,
        fixed: chartData.modalityDistribution.fixed || 0,
        mutable: chartData.modalityDistribution.mutable || 0,
      }}
  keyAspects={chartData.keyAspects.map(ka => ({
    id: ka.id,
    planet_one: { id: 0, name: '' }, // Replace with actual planet data if available
    planet_two: { id: 0, name: '' }, // Replace with actual planet data if available
    aspect: { id: 0, name: ka.description }, // Fix type to match expected Aspect type
    orb: 0, // Or provide a default or mapped value
    description: ka.description,
    importance: ka.importance,
  }))}
    />
  </div>
) : null}
    </div>
  );
};

export default ChartLoader;