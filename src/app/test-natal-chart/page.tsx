// src/app/test-natal-chart/page.tsx - VERSIÓN MEJORADA
'use client';

import React, { useState, useEffect } from 'react';
import ChartDisplay from '../../components/astrology/ChartDisplay';
// Importación simplificada - no necesitamos generateVeronicaAspects aquí

// =============================================================================
// DATOS DE PRUEBA ESTÁTICOS (SIN DEPENDENCIAS EXTERNAS)
// =============================================================================

const REFERENCE_CHART_DATA = {
  birthData: {
    date: '1974-02-10',
    time: '07:30:00',
    place: 'Madrid, España',
    latitude: 40.4164,
    longitude: -3.7025,
    timezone: 'Europe/Madrid'
  },
  planets: [
    { name: 'Sol', sign: 'Acuario', degree: 21, minutes: 8, longitude: 321.1397, house: 1, isRetrograde: false },
    { name: 'Luna', sign: 'Cáncer', degree: 6, minutes: 3, longitude: 96.0586, house: 8, isRetrograde: false },
    { name: 'Mercurio', sign: 'Piscis', degree: 9, minutes: 16, longitude: 339.2667, house: 1, isRetrograde: false },
    { name: 'Venus', sign: 'Escorpio', degree: 25, minutes: 59, longitude: 205.9833, house: 12, isRetrograde: true },
    { name: 'Marte', sign: 'Tauro', degree: 20, minutes: 47, longitude: 50.7833, house: 3, isRetrograde: false },
    { name: 'Júpiter', sign: 'Acuario', degree: 23, minutes: 45, longitude: 323.75, house: 1, isRetrograde: false },
    { name: 'Saturno', sign: 'Géminis', degree: 28, minutes: 4, longitude: 88.0667, house: 5, isRetrograde: true },
    { name: 'Urano', sign: 'Escorpio', degree: 27, minutes: 44, longitude: 207.7333, house: 8, isRetrograde: true },
    { name: 'Neptuno', sign: 'Sagitario', degree: 9, minutes: 22, longitude: 249.3667, house: 10, isRetrograde: false },
    { name: 'Plutón', sign: 'Libra', degree: 6, minutes: 32, longitude: 186.5333, house: 8, isRetrograde: true }
  ],
  houses: [
    { number: 1, sign: 'Acuario', degree: 4, minutes: 9, longitude: 304.15 },
    { number: 2, sign: 'Piscis', degree: 12, minutes: 0, longitude: 342 },
    { number: 3, sign: 'Aries', degree: 20, minutes: 0, longitude: 20 },
    { number: 4, sign: 'Tauro', degree: 25, minutes: 0, longitude: 55 },
    { number: 5, sign: 'Géminis', degree: 20, minutes: 0, longitude: 80 },
    { number: 6, sign: 'Cáncer', degree: 12, minutes: 0, longitude: 102 },
    { number: 7, sign: 'Leo', degree: 4, minutes: 9, longitude: 124.15 },
    { number: 8, sign: 'Virgo', degree: 12, minutes: 0, longitude: 162 },
    { number: 9, sign: 'Libra', degree: 20, minutes: 0, longitude: 200 },
    { number: 10, sign: 'Escorpio', degree: 25, minutes: 0, longitude: 235 },
    { number: 11, sign: 'Sagitario', degree: 20, minutes: 0, longitude: 260 },
    { number: 12, sign: 'Capricornio', degree: 12, minutes: 0, longitude: 282 }
  ],
  ascendant: { sign: 'Acuario', degree: 4, minutes: 9, longitude: 304.15 },
  midheaven: { sign: 'Escorpio', degree: 25, minutes: 0, longitude: 235 }
};
  
 
// Datos de prueba alternativos para testing
const SAMPLE_DATA = {
  planets: [
    { name: 'Sol', sign: 'Leo', degree: 15, longitude: 135, house: 5, isRetrograde: false },
    { name: 'Luna', sign: 'Cáncer', degree: 22, longitude: 112, house: 4, isRetrograde: false },
    { name: 'Mercurio', sign: 'Virgo', degree: 3, longitude: 153, house: 6, isRetrograde: false },
    { name: 'Venus', sign: 'Libra', degree: 8, longitude: 188, house: 7, isRetrograde: false },
    { name: 'Marte', sign: 'Aries', degree: 12, longitude: 12, house: 1, isRetrograde: false },
  ],
  houses: [
    { number: 1, longitude: 0 }, { number: 2, longitude: 30 }, { number: 3, longitude: 60 },
    { number: 4, longitude: 90 }, { number: 5, longitude: 120 }, { number: 6, longitude: 150 },
    { number: 7, longitude: 180 }, { number: 8, longitude: 210 }, { number: 9, longitude: 240 },
    { number: 10, longitude: 270 }, { number: 11, longitude: 300 }, { number: 12, longitude: 330 }
  ]
};

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

const TestNatalChartPage: React.FC = () => {
  // Estados
  const [selectedDataset, setSelectedDataset] = useState<'veronica' | 'sample' | 'api'>('veronica');
  const [apiData, setApiData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(true);

  // =============================================================================
  // FUNCIONES DE CARGA DE DATOS
  // =============================================================================

  const loadApiData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Cargando datos de la API...');
      
      const response = await fetch('/api/prokerala/natal-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthDate: '1974-02-10',
          birthTime: '07:30:00',
          latitude: 40.4164,
          longitude: -3.7025,
          timezone: 'Europe/Madrid'
        }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error desconocido de la API');
      }

      console.log('✅ Datos de API cargados:', result.data);
      setApiData(result.data);
      setSelectedDataset('api');
      
    } catch (err) {
      console.error('❌ Error cargando datos de API:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  // =============================================================================
  // OBTENER DATOS SEGÚN SELECCIÓN
  // =============================================================================

  const getCurrentData = () => {
    switch (selectedDataset) {
      case 'veronica':
        return {
          planets: REFERENCE_CHART_DATA.planets,
          houses: REFERENCE_CHART_DATA.houses,
          aspects: [],
          ascendant: REFERENCE_CHART_DATA.ascendant,
          midheaven: REFERENCE_CHART_DATA.midheaven
        };
      
      case 'sample':
        return {
          planets: SAMPLE_DATA.planets,
          houses: SAMPLE_DATA.houses,
          aspects: [],
          ascendant: null,
          midheaven: null
        };
      
      case 'api':
        return apiData ? {
          planets: apiData.planets || [],
          houses: apiData.houses || [],
          aspects: apiData.aspects || [],
          ascendant: apiData.ascendant,
          midheaven: apiData.midheaven
        } : null;
      
      default:
        return null;
    }
  };

  const currentData = getCurrentData();

  // =============================================================================
  // ESTADÍSTICAS PARA COMPARACIÓN
  // =============================================================================

  const calculateStats = (data: any) => {
    if (!data) return null;
    
    return {
      planetsCount: data.planets?.length || 0,
      housesCount: data.houses?.length || 0,
      aspectsCount: data.aspects?.length || 0,
      retrogradeCount: data.planets?.filter((p: any) => p.isRetrograde)?.length || 0,
      planetsWithLongitude: data.planets?.filter((p: any) => p.longitude && p.longitude > 0)?.length || 0
    };
  };

  const stats = calculateStats(currentData);

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🔬 Laboratorio de Cartas Natales
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Herramienta de testing para validar el cálculo de aspectos, posicionamiento de planetas
            y visualización de cartas natales. Compara datos de referencia con resultados de la API.
          </p>
        </div>

        {/* Panel de Control */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🎛️ Panel de Control</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Selector de Dataset */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Fuente de Datos</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="dataset"
                    value="veronica"
                    checked={selectedDataset === 'veronica'}
                    onChange={(e) => setSelectedDataset(e.target.value as any)}
                    className="text-indigo-600"
                  />
                  <div>
                    <div className="font-medium">Carta de Verónica (Referencia)</div>
                    <div className="text-sm text-gray-500">Datos exactos del 10/02/1974 07:30 Madrid</div>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="dataset"
                    value="sample"
                    checked={selectedDataset === 'sample'}
                    onChange={(e) => setSelectedDataset(e.target.value as any)}
                    className="text-indigo-600"
                  />
                  <div>
                    <div className="font-medium">Datos de Muestra</div>
                    <div className="text-sm text-gray-500">Dataset sintético para testing</div>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="dataset"
                    value="api"
                    checked={selectedDataset === 'api'}
                    onChange={(e) => setSelectedDataset(e.target.value as any)}
                    className="text-indigo-600"
                    disabled={!apiData}
                  />
                  <div>
                    <div className="font-medium">Datos de API Prokerala</div>
                    <div className="text-sm text-gray-500">
                      {apiData ? 'Datos cargados correctamente' : 'No cargado - usar botón de abajo'}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Controles */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Acciones</h3>
              <div className="space-y-3">
                <button
                  onClick={loadApiData}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Cargando...
                    </>
                  ) : (
                    <>
                      🔄 Cargar desde API Prokerala
                    </>
                  )}
                </button>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="debugInfo"
                    checked={showDebugInfo}
                    onChange={(e) => setShowDebugInfo(e.target.checked)}
                    className="text-indigo-600"
                  />
                  <label htmlFor="debugInfo" className="text-sm text-gray-700">
                    Mostrar información de debug
                  </label>
                </div>
              </div>

              {/* Estadísticas rápidas */}
              {stats && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">Estadísticas del Dataset:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Planetas: <span className="font-bold">{stats.planetsCount}</span></div>
                    <div>Casas: <span className="font-bold">{stats.housesCount}</span></div>
                    <div>Aspectos: <span className="font-bold">{stats.aspectsCount}</span></div>
                    <div>Retrógrados: <span className="font-bold text-red-600">{stats.retrogradeCount}</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <span>❌</span>
                <span className="font-medium">Error al cargar datos:</span>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          )}
        </div>

        {/* Carta Natal */}
{currentData ? (
  <ChartDisplay
    planets={currentData.planets}
    houses={currentData.houses}
    elementDistribution={{ fire: 0, earth: 0, air: 0, water: 0 }}
    modalityDistribution={{ cardinal: 0, fixed: 0, mutable: 0 }}
    keyAspects={currentData.aspects}
    ascendant={currentData.ascendant}
    midheaven={currentData.midheaven}
    showAspects={true}
    showDebugInfo={showDebugInfo}
  />
) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No hay datos para mostrar</h3>
            <p className="text-gray-500">
              Selecciona una fuente de datos o carga datos desde la API para ver la carta natal.
            </p>
          </div>
        )}

        {/* Información de Validación */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">✅ Lista de Validación</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Aspectos del Wheel Chart</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Se calculan aspectos automáticamente si no vienen de la API</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Múltiples líneas de aspectos visibles con diferentes colores</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Aspectos mayores (conjunción, oposición, trígono, cuadratura, sextil)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Hover interactivo en líneas de aspectos</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Mejoras Visuales</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Diseño moderno con gradientes y sombras</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Controles para filtrar aspectos (mayores/todos)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Tooltips informativos en planetas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Estadísticas y análisis de la carta</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            🚀 <strong>Laboratorio de Desarrollo:</strong> Esta herramienta valida el correcto funcionamiento 
            del cálculo de aspectos y la visualización de cartas natales antes del deploy en producción.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestNatalChartPage;