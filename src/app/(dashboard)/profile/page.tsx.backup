// src/app/(dashboard)/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { success, error } = useNotifications();
  const router = useRouter();
  
  const [birthData, setBirthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasNatalChart, setHasNatalChart] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Cargar datos de nacimiento
      const birthResponse = await fetch(`/api/birth-data?userId=${user?.uid}`);
      if (birthResponse.ok) {
        const birthResult = await birthResponse.json();
        setBirthData(birthResult.data);
      }
      
      // Verificar si tiene carta natal
      const chartResponse = await fetch(`/api/charts/natal?userId=${user?.uid}`);
      setHasNatalChart(chartResponse.ok);
      
    } catch (err) {
      console.error('Error loading user data:', err);
      error('Error al cargar los datos del perfil');
    } finally {
      setLoading(false);
    }
  };

  const regenerateNatalChart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch('/api/charts/natal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          regenerate: true
        }),
      });
      
      if (response.ok) {
        success('Carta natal regenerada correctamente');
        setHasNatalChart(true);
      } else {
        const errorData = await response.json();
        error(errorData.message || 'Error al regenerar la carta natal');
      }
    } catch (err) {
      console.error('Error regenerating natal chart:', err);
      error('Error al regenerar la carta natal');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>
      
      {/* Información de la cuenta */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Información de la Cuenta</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Detalles de tu cuenta y preferencias.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Nombre completo</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.displayName || 'No configurado'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Correo electrónico</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Fecha de registro</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user?.metadata?.creationTime ? 
                  new Date(user.metadata.creationTime).toLocaleDateString('es-ES') : 
                  'No disponible'
                }
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Último acceso</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user?.metadata?.lastSignInTime ? 
                  new Date(user.metadata.lastSignInTime).toLocaleDateString('es-ES') : 
                  'No disponible'
                }
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Información astrológica */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Información Astrológica</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Tus datos de nacimiento y carta natal.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          {birthData ? (
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Fecha de nacimiento</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(birthData.birthDate).toLocaleDateString('es-ES')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Hora de nacimiento</dt>
                <dd className="mt-1 text-sm text-gray-900">{birthData.birthTime || 'No especificada'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Lugar de nacimiento</dt>
                <dd className="mt-1 text-sm text-gray-900">{birthData.birthPlace}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Coordenadas</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {birthData.latitude.toFixed(4)}, {birthData.longitude.toFixed(4)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Zona horaria</dt>
                <dd className="mt-1 text-sm text-gray-900">{birthData.timezone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Estado de la carta natal</dt>
                <dd className="mt-1 text-sm">
                  {hasNatalChart ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Generada
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pendiente
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          ) : (
            <Alert variant="warning" title="Datos de nacimiento no configurados">
              Para generar tu carta natal y agenda astrológica, necesitas configurar primero tus datos de nacimiento.
            </Alert>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Acciones</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Gestiona tu información y configuración astrológica.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Button
              onClick={() => router.push('/birth-data')}
              variant="outline"
              className="w-full"
            >
              {birthData ? 'Actualizar Datos de Nacimiento' : 'Configurar Datos de Nacimiento'}
            </Button>
            
            {birthData && (
              <Button
                onClick={() => router.push('/natal-chart')}
                variant="outline"
                className="w-full"
              >
                Ver Carta Natal
              </Button>
            )}
            
            {birthData && hasNatalChart && (
              <Button
                onClick={regenerateNatalChart}
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                Regenerar Carta Natal
              </Button>
            )}
            
            {hasNatalChart && (
              <Button
                onClick={() => router.push('/agenda')}
                className="w-full"
              >
                Ver Agenda Astrológica
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Información adicional */}
      <div className="mt-8 bg-indigo-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-indigo-900 mb-2">¿Necesitas ayuda?</h3>
        <p className="text-indigo-700 mb-4">
          Si tienes problemas con tu carta natal o necesitas actualizar tu información, no dudes en contactarnos.
        </p>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <a 
            href="mailto:wunjocreations@gmail.com" 
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            wunjocreations@gmail.com
          </a>
          <a 
            href="https://instagram.com/wunjocreations" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            @wunjocreations
          </a>
        </div>
      </div>
    </div>
  );
}