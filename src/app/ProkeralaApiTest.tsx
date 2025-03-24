'use client';

import { useState } from 'react';
import { searchLocation, getNatalHoroscope } from '@/services/prokeralaService';
import Button from '@/components/ui/Button';

export default function ProkeralaApiTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [testType, setTestType] = useState<'location' | 'chart'>('location');

  const handleLocationTest = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      // Probamos la búsqueda de una ubicación
      const data = await searchLocation('Madrid, Spain');
      setResult(data);
    } catch (err) {
      console.error('Error en prueba de API:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChartTest = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      // Probamos la generación de una carta natal con datos de ejemplo
      const datetime = '1990-01-01T12:00:00';
      const latitude = 40.4168;   // Madrid
      const longitude = -3.7038;  // Madrid
      const timezone = 'Europe/Madrid';
      
      const data = await getNatalHoroscope(datetime, latitude, longitude, timezone);
      setResult(data);
    } catch (err) {
      console.error('Error en prueba de API:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = () => {
    if (testType === 'location') {
      handleLocationTest();
    } else {
      handleChartTest();
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Prueba de API Prokerala</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona el tipo de prueba</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setTestType('location')}
            className={`px-4 py-2 rounded-md ${
              testType === 'location' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Búsqueda de Ubicación
          </button>
          <button
            onClick={() => setTestType('chart')}
            className={`px-4 py-2 rounded-md ${
              testType === 'chart' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Carta Natal
          </button>
        </div>
      </div>
      
      <Button
        onClick={handleTest}
        isLoading={isLoading}
        className="mb-4"
      >
        Ejecutar Prueba
      </Button>
      
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {result && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Resultado</h3>
          <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96 text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}