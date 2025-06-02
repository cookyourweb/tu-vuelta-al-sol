"use client";

import React, { useState } from 'react';

const ProgressedChartPage = () => {
  const [chartData, setChartData] = useState<ProgressionYear[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Datos de Verónica predefinidos
  const veronicaData = {
    birthDate: "1974-02-10",
    birthTime: "07:30:00", 
    latitude: 40.4166,
    longitude: -3.7038,
    timezone: "Europe/Madrid"
  };

  const generateProgressedChart = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Enviando datos para carta progresada:', veronicaData);

      const response = await fetch('/api/charts/progressed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(veronicaData),
      });

      const data = await response.json();
      console.log('📊 Respuesta carta progresada:', data);

      if (data.success) {
        if (Array.isArray(data.data)) {
          setChartData(data.data);
          console.log('✅ Carta progresada generada correctamente');
        } else {
          setError('Datos de progresión inválidos: no es un arreglo');
          console.error('❌ Error: data.data no es un arreglo', data.data);
        }
      } else {
        setError(data.error || 'Error generando carta progresada');
        console.error('❌ Error en respuesta:', data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('❌ Error de red:', err);
    } finally {
      setLoading(false);
    }
  };

  // Componente para mostrar años de progresión
  type Planet = {
    name: string;
    sign: string;
    degree: number;
    minutes: number;
    retrograde?: boolean;
    house?: number;
  };

  type ProgressionYear = {
    year: number;
    startDate: string;
    endDate: string;
    daysElapsed: number;
    progressionDays: number;
    planets: Planet[];
  };

  const ProgressionYears = ({ progressionData }: { progressionData: ProgressionYear[] }) => {
    if (!progressionData) return null;

    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-purple-600 mb-4">Años de Progresión</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {progressionData.map((year, index) => (
            <div key={index} className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📅</span>
                <h4 className="font-bold text-purple-700">Año {year.year}</h4>
              </div>
              <div className="text-sm space-y-1">
                <p><strong>Desde:</strong> {new Date(year.startDate).toLocaleDateString('es-ES')}</p>
                <p><strong>Hasta:</strong> {new Date(year.endDate).toLocaleDateString('es-ES')}</p>
                <p><strong>Días transcurridos:</strong> {year.daysElapsed}</p>
                <p><strong>Progresión:</strong> {year.progressionDays} días</p>
              </div>
              
              {year.planets && year.planets.length > 0 && (
                <div className="mt-3">
                  <p className="font-medium text-blue-600 mb-2">Planetas Progresados:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {year.planets.slice(0, 6).map((planet, pIndex) => (
                      <div key={pIndex} className="bg-white p-2 rounded border">
                        <div className="font-medium">{planet.name}</div>
                        <div className="text-purple-600">{planet.sign} {planet.degree}°{planet.minutes}'</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Componente para mostrar planetas progresados detallados
  const ProgressedPlanets = ({ progressionData }: { progressionData: ProgressionYear[] }) => {
    if (!progressionData || progressionData.length === 0) return null;

    const latestYear = progressionData[progressionData.length - 1];
    if (!latestYear.planets) return null;

    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-purple-600 mb-4">
          Planetas Progresados {latestYear.year}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {latestYear.planets.map((planet, index) => (
            <div key={index} className="border rounded-lg p-3 hover:bg-gray-50">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{planet.name}</span>
                {planet.retrograde && <span className="text-red-500 text-xs">R</span>}
              </div>
              <div className="text-sm text-purple-600 font-bold bg-purple-100 px-2 py-1 rounded">
                {planet.sign}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {planet.degree}°{planet.minutes}'
              </div>
              {planet.house && (
                <div className="text-xs text-blue-600 mt-1">
                  Casa {planet.house}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Componente para mostrar comparación natal vs progresada
  const ComparisonTable = ({ progressionData }: { progressionData: ProgressionYear[] }) => {
    if (!progressionData || progressionData.length === 0) return null;

    const currentYear = progressionData.find(year => year.year === 2025);
    if (!currentYear || !currentYear.planets) return null;

    // Planetas natales de Verónica para comparar
    const natalPlanets: Record<'Sol' | 'Luna' | 'Mercurio' | 'Venus' | 'Marte', string> = {
      'Sol': 'Acuario 21°',
      'Luna': 'Tauro 6°',
      'Mercurio': 'Piscis 9°',
      'Venus': 'Virgo 25°',
      'Marte': 'Tauro 20°'
    };

    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-purple-600 mb-4">
          Comparación: Natal vs Progresada 2025
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-purple-100">
                <th className="border border-gray-300 p-2 text-left">Planeta</th>
                <th className="border border-gray-300 p-2 text-left">Posición Natal</th>
                <th className="border border-gray-300 p-2 text-left">Posición Progresada</th>
                <th className="border border-gray-300 p-2 text-left">Diferencia</th>
              </tr>
            </thead>
            <tbody>
              {currentYear.planets.slice(0, 5).map((planet, index) => {
                const natalPosition = natalPlanets[planet.name as keyof typeof natalPlanets];
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2 font-medium">{planet.name}</td>
                    <td className="border border-gray-300 p-2 text-sm">{natalPosition || 'N/A'}</td>
                    <td className="border border-gray-300 p-2 text-sm">
                      {planet.sign} {planet.degree}°{planet.minutes}'
                    </td>
                    <td className="border border-gray-300 p-2 text-xs text-blue-600">
                      📊 Progresión calculada
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-600 mb-2">
          Carta Progresada
        </h1>
        <p className="text-gray-600 mb-6">
          Las progresiones secundarias muestran la evolución de tu carta natal a lo largo del tiempo. 
          Cada día después del nacimiento equivale a un año de vida.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel Principal */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">🔮</div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Progresiones Secundarias</h2>
              <p className="text-gray-600">Evolución temporal de Verónica</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-blue-800 mb-2">📊 Datos de Progresión:</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• <strong>Persona:</strong> Verónica</p>
              <p>• <strong>Fecha Natal:</strong> 10 febrero 1974</p>
              <p>• <strong>Hora:</strong> 07:30 CET</p>
              <p>• <strong>Lugar:</strong> Madrid, España</p>
              <p>• <strong>Método:</strong> Progresión Secundaria (1 día = 1 año)</p>
              <p>• <strong>Años calculados:</strong> 2025-2026</p>
            </div>
          </div>

          <button
            onClick={generateProgressedChart}
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? '🔄 Calculando Progresiones...' : '🚀 Generar Carta Progresada'}
          </button>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700 font-medium">❌ Error</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          )}

          {chartData && (
            <div className="bg-green-100 border-l-4 border-green-500 p-4">
              <p className="text-green-700 font-medium">✅ Progresiones Calculadas</p>
              <div className="mt-2 text-sm text-green-600">
                <p>• <strong>Años generados:</strong> {chartData.length || 0}</p>
                <p>• <strong>Método:</strong> Progresión Secundaria</p>
                <p>• <strong>Estado:</strong> Completado</p>
              </div>
            </div>
          )}
        </div>

        {/* Panel de Información */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">📚</div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">¿Qué son las Progresiones?</h2>
              <p className="text-gray-600">Conceptos fundamentales</p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="bg-purple-50 p-3 rounded">
              <h4 className="font-medium text-purple-800 mb-1">🔄 Progresión Secundaria</h4>
              <p className="text-purple-700">
                Cada día después del nacimiento representa un año de vida. 
                Es el método más utilizado en astrología predictiva.
              </p>
            </div>

            <div className="bg-blue-50 p-3 rounded">
              <h4 className="font-medium text-blue-800 mb-1">⏱️ Cálculo Temporal</h4>
              <p className="text-blue-700">
                Para Verónica (nacida 10/02/1974), el día 11/02/1974 
                representa su año 2025 (51 años después).
              </p>
            </div>

            <div className="bg-green-50 p-3 rounded">
              <h4 className="font-medium text-green-800 mb-1">🌟 Planetas Rápidos</h4>
              <p className="text-green-700">
                Sol, Luna, Mercurio, Venus y Marte son los que más 
                se mueven y ofrecen insights sobre tendencias anuales.
              </p>
            </div>

            <div className="bg-yellow-50 p-3 rounded">
              <h4 className="font-medium text-yellow-800 mb-1">📅 Aplicación Práctica</h4>
              <p className="text-yellow-700">
                Las progresiones muestran temas internos y evolutivos, 
                complementando los tránsitos (eventos externos).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {chartData && (
        <>
          <ProgressionYears progressionData={chartData} />
          <ProgressedPlanets progressionData={chartData} />
          <ComparisonTable progressionData={chartData} />
        </>
      )}

      {/* Debug Info */}
      {chartData && (
        <details className="mt-8 bg-white p-6 rounded-lg shadow">
          <summary className="cursor-pointer text-purple-600 hover:text-purple-800 font-medium">
            🔍 Ver datos técnicos completos
          </summary>
          <pre className="mt-4 p-4 bg-gray-100 rounded-lg text-xs overflow-auto max-h-96">
            {JSON.stringify(chartData, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default ProgressedChartPage;
