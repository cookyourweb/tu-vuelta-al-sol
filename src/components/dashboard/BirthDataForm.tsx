// src/components/dashboard/BirthDataForm.tsx - VERSIÓN CORTA Y FUNCIONAL
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  User, Calendar, Clock, MapPin, Star, AlertCircle, CheckCircle2, ArrowRight
} from 'lucide-react';

// Schema de validación
const schema = z.object({
  fullName: z.string().min(2, 'Nombre requerido'),
  birthDate: z.string().nonempty('Fecha requerida'),
  birthTime: z.string().optional(),
  birthPlace: z.string().min(2, 'Lugar requerido'),
});

type FormData = z.infer<typeof schema>;

export default function BirthDataForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [birthTimeKnown, setBirthTimeKnown] = useState(true);
  
  const { user } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      birthDate: '',
      birthTime: '',
      birthPlace: '',
    }
  });

  // Cargar datos existentes
  useEffect(() => {
    async function loadData() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/birth-data?userId=${user.uid}`);
        
        if (response.ok) {
          const { data } = await response.json();
          
          if (data) {
            const birthDate = new Date(data.birthDate).toISOString().split('T')[0];
            setValue('fullName', data.fullName || user.displayName || '');
            setValue('birthDate', birthDate);
            setValue('birthTime', data.birthTime || '');
            setValue('birthPlace', data.birthPlace || '');
          } else if (user.displayName) {
            setValue('fullName', user.displayName);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [user, setValue]);

  // Envío del formulario
  const onSubmit = async (data: FormData) => {
    if (!user) {
      setError('Debes iniciar sesión para guardar tus datos');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Geocodificación simple para obtener coordenadas
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(data.birthPlace)}&limit=1`
      );
      const geoData = await geoResponse.json();
      
      if (!geoData || geoData.length === 0) {
        setError('No se pudo encontrar el lugar. Intenta con "Ciudad, País".');
        setIsSubmitting(false);
        return;
      }
      
      const latitude = parseFloat(geoData[0].lat);
      const longitude = parseFloat(geoData[0].lon);
      
      const birthData = {
        userId: user.uid,
        fullName: data.fullName || user.displayName || 'Usuario',
        birthDate: data.birthDate,
        birthTime: birthTimeKnown ? (data.birthTime || '12:00:00') : '12:00:00',
        birthTimeKnown: birthTimeKnown,
        birthPlace: data.birthPlace,
        latitude: Math.round(latitude * 10000) / 10000,
        longitude: Math.round(longitude * 10000) / 10000,
        timezone: 'Europe/Madrid'
      };
      
      const response = await fetch('/api/birth-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(birthData),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Error al guardar los datos');
      }
      
      setSuccess(true);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navegación
  const goToDashboard = () => router.push('/dashboard?datos=guardados');
  const goToNatalChart = () => router.push('/natal-chart');

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <Star className="w-16 h-16 text-yellow-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Cargando datos...</h2>
          <p className="text-gray-300">Verificando información existente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-6 w-fit mx-auto mb-6">
              <Star className="w-12 h-12 text-yellow-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Datos de Nacimiento</h1>
            <p className="text-xl text-gray-300">Información precisa para tu carta natal</p>
          </div>

          {/* Éxito */}
          {success && (
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm border border-green-400/30 rounded-3xl p-8 mb-8">
              <div className="text-center">
                <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4 animate-pulse" />
                <h3 className="text-3xl font-bold text-green-300 mb-4">¡Datos guardados exitosamente!</h3>
                <p className="text-green-200 text-lg mb-6">
                  Tu información natal ha sido procesada correctamente.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={goToNatalChart}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-xl flex items-center justify-center group"
                  >
                    <Star className="w-5 h-5 mr-2 group-hover:animate-spin" />
                    Ver mi Carta Natal
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <button
                    onClick={goToDashboard}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all"
                  >
                    Ir al Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Formulario */}
          {!success && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Nombre completo
                  </label>
                  <input
                    {...register('fullName')}
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-colors"
                    placeholder="Tu nombre completo"
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-400 flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Fecha */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Fecha de nacimiento
                  </label>
                  <input
                    {...register('birthDate')}
                    type="date"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-colors"
                  />
                  {errors.birthDate && (
                    <p className="text-sm text-red-400 flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.birthDate.message}
                    </p>
                  )}
                </div>

                {/* Hora */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-white flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Hora de nacimiento
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={birthTimeKnown}
                        onChange={(e) => setBirthTimeKnown(e.target.checked)}
                        className="rounded border-white/20"
                      />
                      <span className="text-sm text-gray-300">Conozco la hora exacta</span>
                    </div>
                  </div>
                  
                  {birthTimeKnown ? (
                    <input
                      {...register('birthTime')}
                      type="time"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-colors"
                    />
                  ) : (
                    <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4">
                      <p className="text-yellow-200 text-sm">
                        Se usará mediodía (12:00) como aproximación
                      </p>
                    </div>
                  )}
                </div>

                {/* Lugar */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Lugar de nacimiento
                  </label>
                  <input
                    {...register('birthPlace')}
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-colors"
                    placeholder="Ej: Madrid, España"
                  />
                  {errors.birthPlace && (
                    <p className="text-sm text-red-400 flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.birthPlace.message}
                    </p>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                      <p className="text-red-300">{error}</p>
                    </div>
                  </div>
                )}

                {/* Botón enviar */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Guardando datos...
                    </>
                  ) : (
                    <>
                      <Star className="w-5 h-5 mr-2" />
                      Guardar datos de nacimiento
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-xs text-gray-400">
                    🌟 Información segura y procesada automáticamente
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}