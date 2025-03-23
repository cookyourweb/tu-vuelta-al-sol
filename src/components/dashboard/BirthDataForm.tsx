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

  const { register, handleSubmit, formState: { errors }, reset } = useForm<BirthDataFormValues>({
    resolver: zodResolver(birthDataSchema),
    defaultValues: {
      fullName: user?.displayName || '',
      birthDate: '',
      birthTime: '',
      birthPlace: '',
    }
  });

  // Cargar datos existentes
  useEffect(() => {
    async function loadExistingData() {
      if (!user) return;
      
      try {
        const response = await fetch(`/api/birth-data?userId=${user.uid}`);
        
        if (response.ok) {
          const { data } = await response.json();
          
          if (data) {
            // Formatear la fecha para el input tipo date (YYYY-MM-DD)
            const birthDate = new Date(data.birthDate);
            const formattedDate = birthDate.toISOString().split('T')[0];
            
            console.log('Datos cargados:', {
              ...data,
              birthDate: formattedDate,
            });
            
            // Actualizar el formulario con los datos existentes
            reset({
              fullName: data.fullName,
              birthDate: formattedDate,
              birthTime: data.birthTime,
              birthPlace: data.birthPlace,
            });
          }
        }
      } catch (error) {
        console.error('Error cargando datos existentes:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadExistingData();
  }, [user, reset]);

  const onSubmit = async (data: BirthDataFormValues) => {
    if (!user) {
      setError('Debes iniciar sesión para guardar tus datos');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    
    // Log para depuración
    console.log('Datos del formulario:', data);
    
    try {
      // Obtener coordenadas geográficas desde la API de geolocalización
      const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(data.birthPlace)}`);
      const geoData = await geoResponse.json();
      
      console.log('Datos geocodificados:', geoData);
      
      if (!geoData || geoData.length === 0) {
        setError('No se pudo encontrar el lugar de nacimiento. Por favor, intenta con una ubicación más específica.');
        setIsSubmitting(false);
        return;
      }
      
      // Preparar datos completos
      const birthData = {
        userId: user.uid,
        fullName: data.fullName,
        birthDate: data.birthDate, // Asegúrate de que este valor no esté vacío
        birthTime: data.birthTime || '00:00',
        birthPlace: data.birthPlace,
        latitude: parseFloat(geoData[0].lat),
        longitude: parseFloat(geoData[0].lon),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone // Obtener zona horaria del navegador
      };
      
      console.log('Datos a enviar al servidor:', birthData);
      
      // Guardar datos
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
      
      // Redirigir al dashboard o a la página de carta natal después de un breve delay
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
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900">
          Datos de Nacimiento
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Estos datos son necesarios para generar tu carta natal personalizada.
        </p>
      </div>
      
      {error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
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
      
      {success && (
        <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Datos guardados correctamente. Redirigiendo...
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Input
            id="fullName"
            type="text"
            label="Nombre completo"
            autoComplete="name"
            placeholder="Tu nombre completo"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          
          <Input
            id="birthDate"
            type="date"
            label="Fecha de nacimiento"
            error={errors.birthDate?.message}
            {...register('birthDate')}
          />
          
          <Input
            id="birthTime"
            type="time"
            label="Hora de nacimiento (si la conoces)"
            error={errors.birthTime?.message}
            {...register('birthTime')}
          />
          
          <Input
            id="birthPlace"
            type="text"
            label="Lugar de nacimiento"
            placeholder="Ciudad, País"
            error={errors.birthPlace?.message}
            {...register('birthPlace')}
          />
          <p className="text-xs text-gray-500">
            Ingresa el lugar lo más específico posible (ciudad, provincia/estado, país)
          </p>
        </div>

        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full"
        >
          Guardar datos
        </Button>
      </form>
    </div>
  );
}