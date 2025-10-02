// src/components/dashboard/BirthDataForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const birthDataSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  birthDate: z.string().nonempty('La fecha de nacimiento es obligatoria'),
  birthTime: z.string().optional(),
  birthPlace: z.string().nonempty('El lugar de nacimiento es obligatorio'),
});

type BirthDataFormValues = z.infer<typeof birthDataSchema>;

export default function BirthDataForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<BirthDataFormValues>({
    resolver: zodResolver(birthDataSchema),
    defaultValues: {
      fullName: '',
      birthDate: '',
      birthTime: '',
      birthPlace: '',
    }
  });

  // Cargar datos existentes
  useEffect(() => {
    async function loadExistingData() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/birth-data?userId=${user.uid}`);
        
        if (response.ok) {
          const { data } = await response.json();
          
          if (data) {
            // ✅ USAR NOMBRES CORRECTOS DE LA API
            const birthDate = data.date || data.birthDate
              ? new Date(data.date || data.birthDate).toISOString().split('T')[0]
              : '';

            console.log('Datos cargados:', {
              ...data,
              birthDate: birthDate,
            });

            // ✅ FORMATEAR HORA PARA INPUT type="time"
            const formattedTime = (data.time || data.birthTime)
              ? (data.time || data.birthTime).split(':').slice(0, 2).join(':')  // "07:30:00" → "07:30"
              : '';

            setValue('fullName', data.fullName || user.displayName || '');
            setValue('birthDate', birthDate);
            setValue('birthTime', formattedTime);
            setValue('birthPlace', data.location || data.birthPlace || '');
          } else {
            if (user.displayName) {
              setValue('fullName', user.displayName);
            }
          }
        } else {
          if (user.displayName) {
            setValue('fullName', user.displayName);
          }
        }
      } catch (error) {
        console.error('Error cargando datos existentes:', error);
        if (user.displayName) {
          setValue('fullName', user.displayName);
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    loadExistingData();
  }, [user, setValue]);

  const onSubmit = async (data: BirthDataFormValues) => {
    if (!user) {
      setError('Debes iniciar sesión para guardar tus datos');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    
    console.log('Datos del formulario:', data);
    
    try {
      const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(data.birthPlace)}`);
      const geoData = await geoResponse.json();
      
      console.log('Datos geocodificados:', geoData);
      
      if (!geoData || geoData.length === 0) {
        setError('No se pudo encontrar el lugar de nacimiento. Por favor, intenta con una ubicación más específica.');
        setIsSubmitting(false);
        return;
      }
      
      const birthData: any = {
  userId: user.uid,
  fullName: data.fullName || user.displayName || 'Usuario',
  birthDate: data.birthDate,
  birthPlace: data.birthPlace,
  latitude: parseFloat(geoData[0].lat),
  longitude: parseFloat(geoData[0].lon),
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
};// ✅ Solo agregar birthTime si el usuario lo ingresó
if (data.birthTime && data.birthTime.trim()) {
  birthData.birthTime = data.birthTime;
}
      
      console.log('Datos a enviar al servidor:', birthData);
      
      const response = await fetch('/api/birth-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(birthData),
      });
      
      console.log('Respuesta del servidor status:', response.status);
      
      const responseData = await response.json();
      console.log('Respuesta del servidor:', responseData);
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Error al guardar los datos');
      }
      
      setSuccess(true);
      
      try {
        const chartResponse = await fetch('/api/charts/natal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.uid,
            regenerate: true
          }),
        });
        
        const chartData = await chartResponse.json();
        console.log('Respuesta de generación de carta:', chartData);
        
        if (!chartResponse.ok) {
          console.warn('Advertencia: La carta natal no se generó correctamente:', chartData.error);
        }
      } catch (chartError) {
        console.error('Error al generar la carta natal:', chartError);
      }
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error guardando datos de nacimiento:', error);
      setError('Ha ocurrido un error al guardar los datos. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white relative overflow-hidden flex justify-center items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30"></div>
        
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-purple-400 rounded-full animate-pulse"></div>
        
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-lg text-gray-300">Preparando tu mapa estelar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/10 via-transparent to-transparent"></div>
      
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-300"></div>
      <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-700"></div>
      <div className="absolute bottom-1/3 right-1/2 w-3 h-3 bg-yellow-300 rounded-full animate-pulse delay-500"></div>
      <div className="absolute top-3/4 left-1/2 w-4 h-4 bg-pink-400 rounded-full animate-bounce delay-1200"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          
          <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-6">
              <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-6 backdrop-blur-sm relative">
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Cuéntanos sobre tu 
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> llegada a este mundo</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Para crear tu guía astrológica personalizada, necesitamos conocer el momento exacto en que el universo te dio la bienvenida.
            </p>
            
            <div className="bg-gradient-to-r from-blue-400/10 to-purple-400/10 border border-blue-400/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span className="font-bold text-blue-300">¿Sabías que...?</span>
              </div>
              <p className="text-sm text-gray-400">
                El momento exacto de tu nacimiento determina la posición de todos los planetas y define tu mapa astrológico único.
                <strong className="text-white"> No hay dos cartas natales iguales en el universo.</strong>
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12 relative">
            <div className="absolute top-6 right-6 w-5 h-5 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-6 left-6 w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
            
            {error && (
              <div className="mb-8 bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-400/50 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-start">
                  <svg className="h-6 w-6 text-red-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-red-300 mb-2">Algo no salió como esperábamos</h3>
                    <p className="text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {success && (
              <div className="mb-8 bg-gradient-to-r from-green-900/50 to-green-800/50 border border-green-400/50 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-start">
                  <svg className="h-6 w-6 text-green-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-green-300 mb-2">¡Perfecto! Tu información ha sido guardada</h3>
                    <p className="text-green-200">
                      Estamos generando tu carta natal y preparando tu guía personalizada. Te redirigiremos en un momento...
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
              
              <div className="space-y-3">
                <label className="flex items-center text-lg font-bold text-yellow-400">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Tu nombre completo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Escribe tu nombre completo"
                    className="w-full p-4 rounded-xl bg-black/30 border border-purple-400/30 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all backdrop-blur-sm"
                    {...register('fullName')}
                  />
                  {errors.fullName && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center text-lg font-bold text-yellow-400">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Fecha de nacimiento
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full p-4 rounded-xl bg-black/30 border border-purple-400/30 text-white focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all backdrop-blur-sm"
                    {...register('birthDate')}
                  />
                  {errors.birthDate && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.birthDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center text-lg font-bold text-yellow-400">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Hora de nacimiento
                </label>
                <div className="relative">
                  <input
                    type="time"
                    className="w-full p-4 rounded-xl bg-black/30 border border-purple-400/30 text-white focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all backdrop-blur-sm"
                    {...register('birthTime')}
                  />
                  {errors.birthTime && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.birthTime.message}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-400 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    Si no conoces la hora exacta, déjalo vacío. Usaremos el mediodía como referencia.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center text-lg font-bold text-yellow-400">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Lugar de nacimiento
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ciudad, País (ej: Madrid, España)"
                    className="w-full p-4 rounded-xl bg-black/30 border border-purple-400/30 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all backdrop-blur-sm"
                    {...register('birthPlace')}
                  />
                  {errors.birthPlace && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.birthPlace.message}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-400">
                    Sé lo más específico posible: ciudad, provincia/estado, país. Esto nos ayuda a encontrar las coordenadas exactas.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-5 rounded-2xl text-xl font-black hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black mr-3"></div>
                      Creando tu mapa estelar...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Crear Mi Guía Astrológica
                      <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <div className="bg-gradient-to-r from-gray-800/30 to-gray-700/30 border border-gray-600/30 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm text-gray-400">
                  🔒 <strong className="text-white">Tu privacidad es sagrada.</strong> Toda tu información personal está encriptada y protegida. 
                  Nunca compartiremos tus datos con terceros.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}