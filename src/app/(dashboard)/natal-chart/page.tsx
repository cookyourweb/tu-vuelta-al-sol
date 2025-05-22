// app/(dashboard)/natal-chart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ChartDisplay from '@/components/astrology/ChartDisplay';
import Button from '@/components/ui/Button';

export default function NatalChartPage() {
  const [chartData, setChartData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [birthData, setBirthData] = useState<any | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    const fetchChartData = async () => {
      try {
        setLoading(true);
        
        // Primero, obtener los datos de nacimiento
        const birthDataResponse = await fetch(`/api/birth-data?userId=${user.uid}`);
        
        if (!birthDataResponse.ok) {
          // Si no hay datos de nacimiento, redirigir al formulario
          router.push('/birth-data');
          return;
        }
        
        const birthDataResult = await birthDataResponse.json();
        
        if (!birthDataResult.data) {
          router.push('/birth-data');
          return;
        }
        
        setBirthData(birthDataResult.data);
        
        // Con los datos de nacimiento, generar la carta natal
        const { birthDate, birthTime, latitude, longitude, timezone, birthPlace } = birthDataResult.data;
        
        // Formatear la fecha para la API
        const formattedDate = new Date(birthDate).toISOString().split('T')[0];
        
        // Llamar a nuestro API para obtener la carta natal
        const chartResponse = await fetch('/api/prokerala/natal-chart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            birthDate: formattedDate,
            birthTime,
            latitude,
            longitude,
            timezone,
            birthPlace
          }),
        });
        
        const chartResult = await chartResponse.json();
        
        if (chartResponse.ok && chartResult.success) {
          setChartData(chartResult.data);
        } else {
          throw new Error(chartResult.error || 'Error al obtener la carta natal');
        }
      } catch (err: unknown) {
        console.error('Error fetching chart data:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocurrió un error desconocido');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchChartData();
  }, [user, router]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8 bg-red-50 rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-red-800 mb-4">Error</h2>
        <p className="text-red-600">{error}</p>
        <Button 
          onClick={() => router.push('/birth-data')} 
          className="mt-4"
        >
          Ingresar datos de nacimiento
        </Button>
      </div>
    );
  }
  
  if (!chartData) {
    return (
      <div className="p-8 bg-yellow-50 rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-yellow-800 mb-4">Datos no encontrados</h2>
        <p className="text-yellow-600">No se ha encontrado tu carta natal. Por favor, ingresa tus datos de nacimiento para generar tu carta.</p>
        <Button 
          onClick={() => router.push('/birth-data')} 
          className="mt-4"
        >
          Ingresar datos de nacimiento
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-900">Tu Carta Natal</h1>
      
      {birthData && (
        <div className="max-w-4xl mx-auto mb-8 bg-indigo-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-indigo-800 mb-2">Datos de Nacimiento</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Fecha de nacimiento:</p>
              <p className="font-medium">{new Date(birthData.birthDate).toLocaleDateString('es-ES')}</p>
            </div>
            {birthData.birthTime && (
              <div>
                <p className="text-sm text-gray-600">Hora de nacimiento:</p>
                <p className="font-medium">{birthData.birthTime}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Lugar de nacimiento:</p>
              <p className="font-medium">{birthData.birthPlace}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Coordenadas:</p>
              <p className="font-medium">{birthData.latitude.toFixed(4)}, {birthData.longitude.toFixed(4)}</p>
            </div>
          </div>
        </div>
      )}
      
      <ChartDisplay 
        houses={chartData.houses || []}
        planets={chartData.planets || []}
        elementDistribution={chartData.elementDistribution || { fire: 0, earth: 0, air: 0, water: 0 }}
        modalityDistribution={chartData.modalityDistribution || { cardinal: 0, fixed: 0, mutable: 0 }}
        keyAspects={chartData.keyAspects || []}
      />
      
      <div className="mt-8 text-center">
        <Button 
          onClick={() => router.push('/dashboard')} 
          variant="secondary"
          className="mr-4"
        >
          Volver al Dashboard
        </Button>
        <Button 
          onClick={() => router.push('/birth-data')} 
        >
          Actualizar Datos de Nacimiento
        </Button>
      </div>
    </div>
  );
}