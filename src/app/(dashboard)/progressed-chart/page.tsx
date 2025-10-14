'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ChartDisplay from '@/components/astrology/ChartDisplay';
import InterpretationButton from '@/components/astrology/InterpretationButton';
import {
  Sun, RefreshCw, MapPin, Target,
  Sparkles, AlertTriangle, Info
} from 'lucide-react';

export default function SolarReturnPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [chartData, setChartData] = useState<any>(null);
  const [natalChart, setNatalChart] = useState<any>(null);
  const [birthData, setBirthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      loadAllData();
    }
  }, [user, authLoading, router]);

  const loadAllData = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      setError(null);

      // 1. Cargar Birth Data
      const birthResponse = await fetch(`/api/birth-data?userId=${user.uid}`);
      if (birthResponse.ok) {
        const birthResult = await birthResponse.json();
        if (birthResult.success && birthResult.data) {
          setBirthData(birthResult.data);
          console.log('✅ Birth Data cargado:', birthResult.data);
        }
      }

      // 2. Cargar Carta Natal
      const natalResponse = await fetch(`/api/charts/natal?userId=${user.uid}`);
      if (natalResponse.ok) {
        const natalResult = await natalResponse.json();
        if (natalResult.success && natalResult.natalChart) {
          setNatalChart(natalResult.natalChart);
          console.log('✅ Carta Natal cargada');
        }
      }

      // 3. Cargar Solar Return
      const solarResponse = await fetch(`/api/charts/progressed?userId=${user.uid}`);
      
      if (!solarResponse.ok) {
        throw new Error('Error al obtener Solar Return');
      }

      const solarResult = await solarResponse.json();
      console.log('📦 Solar Return Response completo:', solarResult);

      if (solarResult.success && solarResult.data) {
        const solarReturnData = solarResult.data.solarReturnChart || 
                                solarResult.data.progressedChart || 
                                solarResult.data;

        console.log('🌅 Solar Return Data extraído:', solarReturnData);

        if (solarReturnData && solarReturnData.planets) {
          setChartData(solarReturnData);
          console.log('✅ Solar Return cargado con', solarReturnData.planets.length, 'planetas');
        } else {
          throw new Error('Solar Return sin datos de planetas');
        }
      } else {
        throw new Error(solarResult.error || 'Solar Return no disponible');
      }

    } catch (err) {
      console.error('❌ Error cargando datos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!user?.uid) return;

    try {
      setRegenerating(true);
      setError(null);

      const response = await fetch('/api/charts/progressed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.uid,
          force: true 
        })
      });

      if (!response.ok) {
        throw new Error('Error regenerando Solar Return');
      }

      const result = await response.json();
      console.log('🔄 Regeneración resultado:', result);
      
      if (result.success && result.data) {
        const solarReturnData = result.data.solarReturnChart || 
                                result.data.progressedChart || 
                                result.data;
        
        if (solarReturnData && solarReturnData.planets) {
          setChartData(solarReturnData);
          console.log('✅ Solar Return regenerado');
        }
      }

    } catch (err) {
      console.error('❌ Error regenerando:', err);
      setError(err instanceof Error ? err.message : 'Error regenerando');
    } finally {
      setRegenerating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-orange-900/10 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Sun className="w-16 h-16 text-orange-400 mx-auto mb-4 animate-pulse" />
          <p className="text-orange-200 text-lg">Cargando tu Solar Return...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-900/10 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-red-900/30 border border-red-500/30 rounded-2xl p-8 max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-300 mb-4 text-center">Error</h2>
          <p className="text-red-200 mb-6 text-center">{error}</p>
          <button
            onClick={loadAllData}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-all"
          >
            <RefreshCw className="w-5 h-5 inline mr-2" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-orange-900/10 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-orange-900/30 border border-orange-500/30 rounded-2xl p-8 max-w-md text-center">
          <Sun className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-orange-300 mb-4">Solar Return No Disponible</h2>
          <p className="text-orange-200 mb-6">
            Necesitas generar tu Solar Return primero.
          </p>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            {regenerating ? (
              <>
                <RefreshCw className="w-5 h-5 inline mr-2 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sun className="w-5 h-5 inline mr-2" />
                Generar Solar Return
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ✅ Calcular el año del Solar Return y la edad
  const solarReturnYear = chartData.solarReturnInfo?.year || 
                          chartData.progressionInfo?.year || 
                          new Date().getFullYear();
  
  const nextYear = solarReturnYear + 1;

  // ✅ Calcular edad correctamente
  const calculateAge = () => {
    if (chartData.solarReturnInfo?.ageAtStart) {
      return chartData.solarReturnInfo.ageAtStart;
    }
    if (chartData.progressionInfo?.ageAtStart) {
      return chartData.progressionInfo.ageAtStart;
    }
    if (birthData?.birthDate) {
      const birthYear = new Date(birthData.birthDate).getFullYear();
      return solarReturnYear - birthYear;
    }
    return null;
  };

  const userAge = calculateAge();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-orange-900/10 to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-orange-400/20 to-red-400/20 border border-orange-400/30 rounded-full px-6 py-2 mb-4">
            <span className="text-orange-300 font-semibold flex items-center gap-2">
              <Sun className="w-5 h-5" />
              Solar Return {solarReturnYear}-{nextYear}
            </span>
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-300 mb-4">
            ☀️ Tu Vuelta al Sol
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Tu carta astrológica anual - válida desde tu cumpleaños {solarReturnYear} hasta tu cumpleaños {nextYear}
          </p>
        </div>

        {/* Education Card */}
        <div className="bg-gradient-to-r from-amber-900/20 via-orange-900/20 to-red-900/20 backdrop-blur-sm border border-amber-400/20 rounded-2xl p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="bg-gradient-to-r from-amber-400/20 to-orange-500/20 border border-amber-400/30 rounded-full p-3 backdrop-blur-sm flex-shrink-0">
              <Sun className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-300 mb-3">
                ☀️ ¿Qué es tu Solar Return?
              </h3>
              <p className="text-amber-100 leading-relaxed mb-3">
                Tu Solar Return (Revolución Solar) es una carta astrológica especial que se calcula para el momento exacto 
                cuando el Sol regresa a la misma posición que tenía en tu nacimiento. Esto ocurre cada año cerca de tu cumpleaños.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-amber-800/20 rounded-lg p-4">
                  <h4 className="text-amber-300 font-semibold mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Características Únicas
                  </h4>
                  <ul className="text-amber-100 text-sm space-y-1">
                    <li>• Sol FIJO en tu posición natal</li>
                    <li>• Otros planetas en NUEVAS posiciones</li>
                    <li>• Ascendente ANUAL diferente</li>
                    <li>• Válido 12 meses (cumpleaños a cumpleaños)</li>
                  </ul>
                </div>
                <div className="bg-amber-800/20 rounded-lg p-4">
                  <h4 className="text-amber-300 font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Para Qué Sirve
                  </h4>
                  <ul className="text-amber-100 text-sm space-y-1">
                    <li>• Identificar energías del año</li>
                    <li>• Ver áreas de vida activadas</li>
                    <li>• Planificar proyectos importantes</li>
                    <li>• Prepararse para desafíos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Solar Return Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-orange-900/30 border border-orange-500/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="w-5 h-5 text-orange-400" />
              <span className="text-orange-300 font-semibold">Período</span>
            </div>
            <p className="text-white text-lg font-bold">
              {solarReturnYear} - {nextYear}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {birthData?.birthDate ? new Date(birthData.birthDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }) : 'Tu cumpleaños'} → próximo año
            </p>
          </div>

          <div className="bg-orange-900/30 border border-orange-500/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-orange-400" />
              <span className="text-orange-300 font-semibold">Edad</span>
            </div>
            <p className="text-white text-lg font-bold">
              {userAge !== null ? `${userAge} años` : 'Calculando...'}
            </p>
            <p className="text-gray-400 text-sm mt-1">edad durante este ciclo</p>
          </div>

          <div className="bg-orange-900/30 border border-orange-500/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-orange-400" />
              <span className="text-orange-300 font-semibold">Ubicación</span>
            </div>
            <p className="text-white text-sm">
              {birthData?.livesInSamePlace ? birthData?.birthPlace : birthData?.currentPlace || 'No especificado'}
            </p>
            <p className="text-gray-400 text-xs mt-1">lugar del cálculo</p>
          </div>
        </div>

        {/* Chart Display */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Sun className="w-6 h-6 text-orange-400" />
              Carta Solar Return {solarReturnYear}
            </h2>
          </div>

          <ChartDisplay
            planets={chartData.planets || []}
            houses={chartData.houses || []}
            elementDistribution={chartData.elementDistribution || { fire: 0, earth: 0, air: 0, water: 0 }}
            modalityDistribution={chartData.modalityDistribution || { cardinal: 0, fixed: 0, mutable: 0 }}
            keyAspects={chartData.keyAspects || chartData.aspects || []}
            aspects={chartData.aspects || []}
            ascendant={chartData.ascendant || undefined}
            midheaven={chartData.midheaven || undefined}
            birthData={birthData || undefined}
            chartType="progressed"
            showOnlyProgressedAspects={false}
            progressionInfo={chartData.solarReturnInfo || chartData.progressionInfo || undefined}
          />
        </div>

        {/* Botón de Interpretación */}
        {natalChart && birthData && (
          <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-sm border border-purple-400/20 rounded-3xl p-8">
            <div className="text-center mb-6">
              <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-pulse" />
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-4">
                Interpreta Tu Solar Return {solarReturnYear}-{nextYear}
              </h2>
              <p className="text-purple-200 leading-relaxed max-w-2xl mx-auto">
                Descubre el significado profundo de este nuevo ciclo solar con una interpretación personalizada,
                disruptiva y transformadora basada en tu carta natal y tu Solar Return.
              </p>
            </div>

            <div className="flex justify-center">
              <InterpretationButton
                type="solar-return"
                userId={user?.uid || ''}
                chartData={chartData}
                natalChart={natalChart}
                userProfile={{
                  name: birthData?.fullName || 'Usuario',
                  age: userAge || 0,
                  birthPlace: birthData?.birthPlace || '',
                  birthDate: birthData?.birthDate || '',
                  birthTime: birthData?.birthTime || ''
                }}
                className="max-w-xl w-full"
              />
            </div>

            <p className="text-purple-300 text-sm mt-6 text-center">
              💡 Interpretación generada con IA + Metodología profesional (Shea-Teal-Louis)
            </p>
          </div>
        )}

        {/* Botón Regenerar - SOLO SI HAY ERROR O ADMIN */}
        {(error || user?.email === 'admin@tuvueltaalsol.com') && (
          <div className="text-center mt-8">
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition-all mx-auto"
            >
              <RefreshCw className={`w-5 h-5 ${regenerating ? 'animate-spin' : ''}`} />
              {regenerating ? 'Regenerando...' : 'Regenerar Solar Return'}
            </button>
            {error && (
              <p className="text-red-400 text-sm mt-2">
                Hay un error con tu Solar Return. Usa este botón para regenerarlo.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
