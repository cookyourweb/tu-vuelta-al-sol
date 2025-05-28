// src/app/(dashboard)/dashboard/page.tsx
'use client';

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [birthData, setBirthData] = useState({
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    latitude: null,
    longitude: null,
    timezone: ''
  });
  const [loadingBirthData, setLoadingBirthData] = useState(true);
  const [hasNatalChart, setHasNatalChart] = useState(false);
  
  // Cargar datos de nacimiento del usuario
  useEffect(() => {
    if (user) {
      const fetchBirthData = async () => {
        try {
          setLoadingBirthData(true);
          const res = await fetch(`/api/birth-data?userId=${user.uid}`);
          
          if (res.ok) {
            const data = await res.json();
            
            if (data && data.data) {
              // Formatear la fecha para mostrarla
              const birthDate = new Date(data.data.birthDate);
              const formattedDate = birthDate.toLocaleDateString('es-ES');
              
              setBirthData({
                birthDate: formattedDate,
                birthTime: data.data.birthTime || '',
                birthPlace: data.data.birthPlace || '',
                latitude: data.data.latitude,
                longitude: data.data.longitude,
                timezone: data.data.timezone || ''
              });
              
              // También verificamos si hay carta natal
              checkNatalChart(user.uid);
            }
          } else {
            console.log('No se encontraron datos de nacimiento');
          }
        } catch (error) {
          console.error('Error fetching birth data:', error);
        } finally {
          setLoadingBirthData(false);
        }
      };
      
      fetchBirthData();
    } else {
      setLoadingBirthData(false);
    }
  }, [user]);
  
  // Verificar si el usuario tiene una carta natal
  const checkNatalChart = async (userId: string): Promise<void> => {
    try {
      const res = await fetch(`/api/charts/natal?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setHasNatalChart(!!data.natalChart);
      } else {
        setHasNatalChart(false);
      }
    } catch (error) {
      console.error('Error checking natal chart:', error);
      setHasNatalChart(false);
    }
  };

  if (isLoading || loadingBirthData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Bienvenido a Tu Vuelta Al Sol</h1>
      
      {/* Tarjeta de información personal */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 bg-purple-50">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Tu Información Personal</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Datos necesarios para tu carta natal y agenda astrológica.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Nombre completo</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.displayName || 'No configurado'}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Correo electrónico</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.email || 'No configurado'}</dd>
            </div>
            
            {birthData.birthDate ? (
              <>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Fecha de nacimiento</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{birthData.birthDate}</dd>
                </div>
                
                {birthData.birthTime && (
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Hora de nacimiento</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{birthData.birthTime}</dd>
                  </div>
                )}
                
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Lugar de nacimiento</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{birthData.birthPlace}</dd>
                </div>
              </>
            ) : (
              <div className="bg-yellow-50 px-4 py-5 sm:px-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Datos de nacimiento no configurados</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Para generar tu carta natal y agenda astrológica personalizada, necesitamos tus datos de nacimiento.
                      </p>
                      <p className="mt-2">
                        <Link 
                          href="/birth-data"
                          className="font-medium text-yellow-800 underline hover:text-yellow-900"
                        >
                          Configurar datos de nacimiento
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </dl>
        </div>
      </div>
      
      {/* Grid de tarjetas de funcionalidades */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Tarjeta de datos de nacimiento */}
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <h3 className="text-lg font-medium text-gray-900">Datos de Nacimiento</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {birthData.birthDate 
                    ? 'Actualiza tus datos de nacimiento para obtener una carta natal más precisa.'
                    : 'Configura tus datos de nacimiento para comenzar.'}
                </p>
              </div>
            </div>
            <div className="mt-5">
              <Link href="/birth-data">
                <Button className="w-full">
                  {birthData.birthDate ? 'Actualizar datos' : 'Configurar datos'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Tarjeta de carta natal */}
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <h3 className="text-lg font-medium text-gray-900">Carta Natal</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {hasNatalChart 
                    ? 'Visualiza tu carta natal con detalles astrológicos completos.'
                    : birthData.birthDate 
                      ? 'Genera tu carta natal basada en tus datos de nacimiento.'
                      : 'Primero debes configurar tus datos de nacimiento.'}
                </p>
              </div>
            </div>
            <div className="mt-5">
              {birthData.birthDate ? (
                <Link href="/natal-chart">
                  <Button className="w-full" variant={hasNatalChart ? 'default' : 'secondary'}>
                    {hasNatalChart ? 'Ver carta natal' : 'Generar carta natal'}
                  </Button>
                </Link>
              ) : (
                <Button className="w-full" disabled>Carta natal no disponible</Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Tarjeta de agenda astrológica */}
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <h3 className="text-lg font-medium text-gray-900">Agenda Astrológica</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {hasNatalChart 
                    ? 'Consulta tu calendario astrológico personalizado con eventos relevantes para tu carta natal.'
                    : 'Primero necesitas generar tu carta natal para ver la agenda.'}
                </p>
              </div>
            </div>
            <div className="mt-5">
              {hasNatalChart ? (
                <Link href="/agenda">
                  <Button className="w-full">
                    Ver Agenda Astrológica
                  </Button>
                </Link>
              ) : (
                <Button className="w-full" disabled>Agenda no disponible</Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección de próximos eventos (ejemplo) */}
      {hasNatalChart && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Próximos Eventos Astrológicos</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <p className="text-center text-sm text-gray-500">
                El calendario de eventos astrológicos personalizados estará disponible próximamente.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}