// src/components/dashboard/BirthDataForm.tsx - VERSIÓN COMPLETA RESTAURADA
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  User, Calendar, Clock, MapPin, Star, AlertCircle, CheckCircle2, 
  Search, Target, Timer, ArrowRight
} from 'lucide-react';

// ==========================================
// TIPOS Y VALIDACIÓN
// ==========================================
// 🔧 CORRECCIÓN DEL SCHEMA - LÍNEAS 20-30 APROX
// Reemplaza esta parte del schema en BirthDataForm.tsx

const schema = z.object({
  fullName: z.string().min(2, 'Nombre requerido'),
  birthDate: z.string().nonempty('Fecha requerida'),
  birthTimeKnown: z.boolean(),
  inputMethod: z.enum(['location', 'coordinates']),
  birthTime: z.string().optional(),
  birthPlace: z.string().optional(),
  timezone: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type FormData = {
  fullName: string;
  birthDate: string;
  birthTimeKnown: boolean;
  inputMethod: 'location' | 'coordinates';
  birthTime?: string;
  birthPlace?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
};


interface LocationSuggestion {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=es`
    );
    const data = await response.json();
    const city = data.address?.city || data.address?.town || 'Ubicación';
    const country = data.address?.country || '';
    return country ? `${city}, ${country}` : city;
  } catch (error) {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};

const calculateTimezone = (date: string, timezone: string): string => {
  const birthDate = new Date(date);
  const year = birthDate.getFullYear();
  
  if (timezone === 'Europe/Madrid') {
    const dstStart = new Date(year, 2, 31 - new Date(year, 2, 31).getDay());
    const dstEnd = new Date(year, 9, 31 - new Date(year, 9, 31).getDay());
    return birthDate >= dstStart && birthDate < dstEnd ? '+02:00' : '+01:00';
  }
  
  const timezones: Record<string, string> = {
    'America/Argentina/Buenos_Aires': '-03:00',
    'America/Bogota': '-05:00',
    'America/Lima': '-05:00',
    'UTC': '+00:00'
  };
  
  return timezones[timezone] || '+00:00';
};

const parseCoords = (coords: string): { lat: number; lng: number } | null => {
  try {
    const parts = coords.replace(/[°'"]/g, '').split(/[,\s]+/);
    if (parts.length >= 2) {
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);
      if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
    }
    return null;
  } catch {
    return null;
  }
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

export default function BirthDataForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [inputMethod, setInputMethod] = useState<'location' | 'coordinates'>('location');
  const [birthTimeKnown, setBirthTimeKnown] = useState(true);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [googleCoords, setGoogleCoords] = useState('');
  const [detectedLocation, setDetectedLocation] = useState('');
  const [showDetection, setShowDetection] = useState(false);
  
  const { user } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      birthDate: '',
      birthTime: '',
      birthTimeKnown: true,
      inputMethod: 'location',
      birthPlace: '',
      timezone: 'Europe/Madrid',
    }
  });

  const watchedBirthPlace = watch('birthPlace');

  // ==========================================
  // BÚSQUEDA DE UBICACIONES
  // ==========================================

  const searchLocations = useCallback(async (query: string) => {
    if (query.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
      const data = await response.json();
      
      const locations = data.map((item: any) => ({
        name: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        country: item.address?.country || ''
      }));
      
      setLocationSuggestions(locations);
    } catch (error) {
      setLocationSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (inputMethod === 'location' && watchedBirthPlace) {
      const timer = setTimeout(() => searchLocations(watchedBirthPlace), 500);
      return () => clearTimeout(timer);
    }
  }, [watchedBirthPlace, inputMethod, searchLocations]);

  // ==========================================
  // MANEJO DE COORDENADAS GOOGLE MAPS
  // ==========================================

  const handleCoordsChange = async (coords: string) => {
    setGoogleCoords(coords);
    setShowDetection(false);
    setDetectedLocation('');
    
    if (coords.length > 10) {
      const parsed = parseCoords(coords);
      if (parsed) {
        console.log('🗺️ Coordenadas detectadas:', parsed);
        
        setDetectedLocation('Detectando ubicación...');
        setShowDetection(true);
        
        try {
          const locationName = await reverseGeocode(parsed.lat, parsed.lng);
          setDetectedLocation(locationName);
          console.log('✅ Ubicación detectada:', locationName);
        } catch (error) {
          console.error('❌ Error en geocoding:', error);
          setDetectedLocation('Error detectando ubicación');
        }
      }
    }
  };

  // ==========================================
  // CARGA DE DATOS EXISTENTES
  // ==========================================

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
            setValue('timezone', data.timezone || 'Europe/Madrid');
            
            if (data.latitude && data.longitude) {
              setInputMethod('coordinates');
              setGoogleCoords(`${data.latitude}, ${data.longitude}`);
              setDetectedLocation(data.birthPlace || 'Ubicación guardada');
              setShowDetection(true);
            }
          } else if (user.displayName) {
            setValue('fullName', user.displayName);
          }
        }
      } catch (error) {
        if (user.displayName) {
          setValue('fullName', user.displayName);
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [user, setValue]);

  // ==========================================
  // ENVÍO DEL FORMULARIO - SIMPLIFICADO
  // ==========================================

  const onSubmit = async (data: FormData) => {
    if (!user) {
      setError('Debes iniciar sesión para guardar tus datos');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      let finalLat: number, finalLng: number, finalPlace: string;
      
      if (inputMethod === 'location') {
        if (selectedLocation) {
          finalLat = selectedLocation.latitude;
          finalLng = selectedLocation.longitude;
          finalPlace = selectedLocation.name;
        } else {
          const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(data.birthPlace || '')}`);
          const geoData = await geoResponse.json();
          
          if (!geoData || geoData.length === 0) {
            setError('No se pudo encontrar el lugar. Intenta con "Ciudad, País" o usa coordenadas.');
            setIsSubmitting(false);
            return;
          }
          
          finalLat = parseFloat(geoData[0].lat);
          finalLng = parseFloat(geoData[0].lon);
          finalPlace = data.birthPlace || geoData[0].display_name;
        }
      } else {
        const parsed = parseCoords(googleCoords);
        if (!parsed) {
          setError('Coordenadas no válidas. Copia desde Google Maps.');
          setIsSubmitting(false);
          return;
        }
        
        finalLat = parsed.lat;
        finalLng = parsed.lng;
        finalPlace = await reverseGeocode(finalLat, finalLng);
      }

      // Formatear coordenadas (4 decimales máximo)
      const lat = Math.round(finalLat * 10000) / 10000;
      const lng = Math.round(finalLng * 10000) / 10000;
      
      const birthData = {
        userId: user.uid,
        fullName: data.fullName || user.displayName || 'Usuario',
        birthDate: data.birthDate,
        birthTime: birthTimeKnown ? (data.birthTime || '12:00:00') : '12:00:00',
        birthTimeKnown: birthTimeKnown,
        birthPlace: finalPlace,
        latitude: lat,
        longitude: lng,
        timezone: data.timezone || 'Europe/Madrid'
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
      
      // ✅ FLUJO SIMPLIFICADO: Solo mostrar éxito
      setSuccess(true);
      console.log('✅ Datos guardados exitosamente');
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // FUNCIONES DE NAVEGACIÓN SIMPLIFICADAS
  // ==========================================

  const goToDashboard = () => {
    router.push('/dashboard?datos=guardados');
  };

  const goToNatalChart = () => {
    router.push('/natal-chart');
  };

  const selectLocation = (location: LocationSuggestion) => {
    setSelectedLocation(location);
    setValue('birthPlace', location.name);
    setLocationSuggestions([]);
  };

  // ==========================================
  // RENDERIZADO
  // ==========================================

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

          {/* ✅ ÉXITO SIMPLIFICADO */}
          {success && (
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm border border-green-400/30 rounded-3xl p-8 mb-8">
              <div className="text-center">
                <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4 animate-pulse" />
                <h3 className="text-3xl font-bold text-green-300 mb-4">¡Datos guardados exitosamente!</h3>
                <p className="text-green-200 text-lg mb-6">
                  Tu información natal ha sido procesada y está lista para generar tu carta astrológica.
                </p>
                
                {/* Botones de navegación */}
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
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xl flex items-center justify-center"
                  >
                    Ir al Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Formulario - Solo mostrar si no hay éxito */}
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
                      step="1"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-colors"
                    />
                  ) : (
                    <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4">
                      <p className="text-yellow-200 text-sm flex items-center">
                        <Timer className="w-4 h-4 mr-2" />
                        Se usará mediodía (12:00) como aproximación
                      </p>
                    </div>
                  )}
                </div>

                {/* Método de ubicación */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">Método de ubicación</label>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setInputMethod('location')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        inputMethod === 'location'
                          ? 'border-yellow-400 bg-yellow-400/10 text-white'
                          : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40'
                      }`}
                    >
                      <Search className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">Buscar lugar</div>
                      <div className="text-xs opacity-70">Ciudad, país</div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setInputMethod('coordinates')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        inputMethod === 'coordinates'
                          ? 'border-yellow-400 bg-yellow-400/10 text-white'
                          : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40'
                      }`}
                    >
                      <Target className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">Coordenadas</div>
                      <div className="text-xs opacity-70">Google Maps</div>
                    </button>
                  </div>
                </div>

                {/* Búsqueda de lugar */}
                {inputMethod === 'location' && (
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Lugar de nacimiento
                    </label>
                    
                    <div className="relative">
                      <input
                        {...register('birthPlace')}
                        type="text"
                        value={watchedBirthPlace || ''}
                        onChange={(e) => {
                          setValue('birthPlace', e.target.value);
                          setSelectedLocation(null);
                        }}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-colors"
                        placeholder="Ej: Madrid, España"
                      />
                      
                      {isSearching && (
                        <div className="absolute right-3 top-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Sugerencias */}
                    {locationSuggestions.length > 0 && !selectedLocation && (
                      <div className="mt-2 bg-white/10 border border-white/20 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                        {locationSuggestions.map((location, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => selectLocation(location)}
                            className="w-full text-left px-4 py-4 hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0"
                          >
                            <div className="text-white font-medium text-base">{location.name}</div>
                            <div className="text-gray-300 text-sm mt-1">
                              📍 {location.country} • Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Ubicación seleccionada */}
                    {selectedLocation && (
                      <div className="mt-3 bg-green-400/10 border border-green-400/30 rounded-xl p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start">
                            <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 mt-0.5" />
                            <div>
                              <h4 className="text-green-300 font-semibold mb-1">✅ Ubicación seleccionada</h4>
                              <p className="text-white font-medium">{selectedLocation.name}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLocation(null);
                              setValue('birthPlace', '');
                            }}
                            className="text-green-300 hover:text-green-200 text-sm underline"
                          >
                            Cambiar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Coordenadas Google Maps */}
                {inputMethod === 'coordinates' && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-xl p-4">
                      <div className="flex items-start">
                        <Target className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-blue-300 font-semibold mb-2">📍 Coordenadas de Google Maps</h4>
                          <p className="text-blue-200 text-sm mb-3">
                            Ve a Google Maps, busca tu lugar exacto, haz clic derecho y copia las coordenadas.
                          </p>
                          
                          <input
                            type="text"
                            value={googleCoords}
                            onChange={(e) => handleCoordsChange(e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-blue-400/30 rounded-lg text-white placeholder-gray-400 text-base"
                            placeholder="Ej: 40.4164, -3.7025"
                          />
                          
                          {/* Detección automática */}
                          {showDetection && (
                            <div className="mt-3 bg-green-400/10 border border-green-400/30 rounded-lg p-4">
                              <div className="flex items-center mb-2">
                                {detectedLocation === 'Detectando ubicación...' ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400 mr-2"></div>
                                    <span className="text-green-300 text-sm font-medium">Detectando ubicación...</span>
                                  </>
                                ) : detectedLocation.includes('Error') ? (
                                  <>
                                    <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                                    <span className="text-red-300 text-sm font-medium">Error detectando ubicación</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                                    <span className="text-green-300 text-sm font-medium">✅ Ubicación detectada</span>
                                  </>
                                )}
                              </div>
                              
                              {!detectedLocation.includes('Error') && !detectedLocation.includes('Detectando') && (
                                <div className="text-green-200 text-base font-medium">{detectedLocation}</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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