// src/app/(dashboard)/agenda/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AstrologicalAgenda from '@/components/astrology/AstrologicalAgenda';
import Button from '@/components/ui/Button';

export default function AgendaPage() {
  const [loading, setLoading] = useState(true);
  const [hasNatalChart, setHasNatalChart] = useState(false);
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    const checkNatalChart = async () => {
      try {
        setLoading(true);
        
        // Primero, verificar si el usuario tiene una carta natal
        const chartResponse = await fetch(`/api/charts/natal?userId=${user.uid}`);
        
        if (chartResponse.ok) {
          setHasNatalChart(true);
          
          // Obtener datos de nacimiento para mostrar info relevante
          const birthDataResponse = await fetch(`/api/birth-data?userId=${user.uid}`);
          
          if (birthDataResponse.ok) {
            const birthData = await birthDataResponse.json();
            if (birthData.data && birthData.data.birthDate) {
              setBirthDate(birthData.data.birthDate);
            }
          }
        } else {
          setHasNatalChart(false);
        }
      } catch (error) {
        console.error('Error al verificar carta natal:', error);
        setError('Ocurrió un error al cargar tus datos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    checkNatalChart();
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
      <div className="container mx-auto px-4 py-8">
        <div className="p-8 bg-red-50 rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Error</h2>
          <p className="text-red-600">{error}</p>
          <Button 
            onClick={() => router.push('/dashboard')} 
            className="mt-4"
          >
            Volver al Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  if (!hasNatalChart) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-8 bg-yellow-50 rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">Carta Natal no Encontrada</h2>
          <p className="text-yellow-600 mb-4">
            Para ver tu agenda astrológica personalizada, primero necesitas generar tu carta natal. 
            Tu agenda se basará en las posiciones planetarias específicas de tu carta natal.
          </p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button 
              onClick={() => router.push('/birth-data')} 
              className="w-full sm:w-auto"
            >
              Ingresar Datos de Nacimiento
            </Button>
            <Button 
              onClick={() => router.push('/natal-chart')} 
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Generar Carta Natal
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-900">Tu Agenda Astrológica</h1>
      
      <div className="max-w-4xl mx-auto mb-8 bg-indigo-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-indigo-800 mb-4">Eventos Astrológicos Personalizados</h2>
        <p className="text-gray-600 mb-4">
          Esta agenda muestra los eventos astrológicos relevantes para tu carta natal. 
          Los eventos están personalizados según las posiciones planetarias de tu nacimiento y te ayudarán a aprovechar 
          las energías cósmicas de manera efectiva.
        </p>
        <p className="text-sm text-indigo-600">
          <strong>Nota:</strong> Esta es una versión preliminar de la agenda. Próximamente contará con eventos 
          personalizados basados en tu carta natal y carta progresada, con rituales y prácticas recomendadas.
        </p>
      </div>
      
      {/* Componente de Agenda */}
      <AstrologicalAgenda userId={user.uid} birthDate={birthDate || undefined} />
      
      <div className="mt-8 text-center">
        <Button 
          onClick={() => router.push('/dashboard')} 
          variant="secondary"
          className="mr-4"
        >
          Volver al Dashboard
        </Button>
        <Button
          onClick={() => router.push('/natal-chart')}
        >
          Ver Carta Natal
        </Button>
      </div>
    </div>
  );
}