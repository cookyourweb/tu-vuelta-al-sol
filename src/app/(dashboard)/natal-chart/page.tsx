// src/app/(dashboard)/natal-chart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ChartDisplay from '@/components/astrology/ChartDisplay';
import { NatalChart } from '@/services/astrologyService';

export default function NatalChartPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chart, setChart] = useState<NatalChart | null>(null);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Verificar autenticación
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Cargar la carta natal
  useEffect(() => {
    async function loadChart() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/charts?userId=${user.uid}`);
        
        if (response.ok) {
          const data = await response.json();
          setChart(data.chart.natalChart);
        } else if (response.status === 404) {
          // Si no hay carta, intentar generarla
          const generateResponse = await fetch('/api/charts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.uid }),
          });
          
          if (generateResponse.ok) {
            const data = await generateResponse.json();
            setChart(data.natalChart);
          } else {
            const errorData = await generateResponse.json();
            setError(errorData.error || 'No se pudo generar la carta natal');
          }
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Error al cargar la carta natal');
        }
      } catch (error) {
        console.error('Error cargando carta natal:', error);
        setError('Error al cargar la carta natal. Inténtalo de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadChart();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              {error.includes('datos de nacimiento') && (
                <div className="mt-2">
                  <Link 
                    href="/birth-data" 
                    className="text-sm font-medium text-red-700 hover:text-red-600"
                  >
                    Completar datos de nacimiento
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!chart) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                No se pudo cargar la carta natal. Por favor, intenta nuevamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tu Carta Natal</h1>
      
      <ChartDisplay chart={chart} />
      
      <div className="mt-8 text-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200"
        >
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}