//src/components/test/ProkeralaNatalTest.tsx
'use client';

import { useState } from 'react';
import { getNatalHoroscope, NatalChart } from '@/services/prokeralaService';

export default function TestNatalChartPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [natalChart, setNatalChart] = useState<NatalChart | null>(null);
  
  // Valores predeterminados para el formulario
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [birthTime, setBirthTime] = useState('12:00:00');
  const [latitude, setLatitude] = useState(40.4168);
  const [longitude, setLongitude] = useState(-3.7038);
  const [timezone, setTimezone] = useState('Europe/Madrid');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNatalChart(null);

    try {
      // Obtener datos de la carta natal (ya viene convertida)
      const chart = await getNatalHoroscope(
        birthDate,
        birthTime,
        latitude,
        longitude,
        timezone
      );

      setNatalChart(chart);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Carta Natal</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora de nacimiento
            </label>
            <input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
              className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
              className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
              className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {loading ? 'Calculando...' : 'Calcular carta natal'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>Error: {error}</p>
        </div>
      )}
      
      {natalChart && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Carta natal obtenida:</h2>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Información básica:</h3>
            <ul className="space-y-1 text-sm">
              <li><strong>Fecha:</strong> {natalChart.birthData.datetime}</li>
              <li>
                <strong>Ascendente:</strong> {natalChart.ascendant?.sign} {natalChart.ascendant?.degree}° {natalChart.ascendant?.minutes}&apos;
              </li>
              <li>
                <strong>Medio Cielo:</strong> {natalChart.midheaven?.sign} {natalChart.midheaven?.degree}° {natalChart.midheaven?.minutes}&apos;
              </li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Planetas:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {natalChart.planets.map((planet, index) => (
                <div key={index} className="text-sm border rounded p-2">
                  <strong>{planet.name}:</strong> {planet.sign} {planet.degree}° {planet.minutes}&apos; 
                  {planet.retrograde && <span className="text-red-500 ml-1">℞</span>}
                  <div className="text-gray-500">Casa {planet.housePosition}</div>
                </div>
              ))}
            </div>
          </div>
          
          <details>
            <summary className="cursor-pointer font-medium mb-2">Casas astrológicas</summary>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {natalChart.houses.map((house, index) => (
                <div key={index} className="text-sm border rounded p-2">
                  <strong>Casa {house.number}:</strong> {house.sign} {house.degree}° {house.minutes}&apos;
                </div>
              ))}
            </div>
          </details>
          
          <details className="mt-4">
            <summary className="cursor-pointer font-medium mb-2">Aspectos planetarios</summary>
            <table className="text-sm w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Planetas</th>
                  <th className="p-2 text-left">Aspecto</th>
                  <th className="p-2 text-left">Orbe</th>
                </tr>
              </thead>
              <tbody>
                {natalChart.aspects.slice(0, 10).map((aspect, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{aspect.planet1} - {aspect.planet2}</td>
                    <td className="p-2">{aspect.type}</td>
                    <td className="p-2">{typeof aspect.orb === 'number' ? aspect.orb.toFixed(1) : aspect.orb}°</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </div>
      )}
    </div>
  );
}