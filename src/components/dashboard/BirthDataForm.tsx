// src/components/dashboard/BirthDataForm.tsx - VERSIÓN COMPLETA CON GEOCODING INVERSO
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Star, 
  AlertCircle, 
  CheckCircle2, 
  Search,
  Target,
  Globe,
  Timer,
  Copy
} from 'lucide-react';

// ==========================================
// SCHEMAS Y TIPOS MEJORADOS
// ==========================================

const birthDataSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  birthDate: z.string().nonempty('La fecha de nacimiento es obligatoria'),
  birthTime: z.string().optional(),
  birthTimeKnown: z.boolean().default(true),
  inputMethod: z.enum(['location', 'coordinates']).default('location'),
  birthPlace: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  timezone: z.string().optional(),
});

type BirthDataFormValues = z.infer<typeof birthDataSchema>;

interface LocationSuggestion {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country: string;
  region?: string;
}

// ==========================================
// FUNCIONES AUXILIARES MEJORADAS
// ==========================================

/**
 * ✅ NUEVA FUNCIÓN: Geocoding inverso para convertir coordenadas a nombre de ciudad
 */
const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    console.log(`🌍 Haciendo geocoding inverso para: ${lat}, ${lng}`);
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=es`
    );
    
    if (!response.ok) {
      throw new Error('Error en geocoding inverso');
    }
    
    const data = await response.json();
    
    // Extraer ciudad y país de manera inteligente
    const city = data.address?.city || 
                 data.address?.town || 
                 data.address?.village || 
                 data.address?.municipality || 
                 'Ubicación';
                 
    const country = data.address?.country || '';
    
    const locationName = country ? `${city}, ${country}` : city;
    
    console.log(`✅ Geocoding inverso exitoso: ${locationName}`);
    return locationName;
    
  } catch (error) {
    console.warn('⚠️ Error en geocoding inverso:', error);
    // Fallback: retornar coordenadas si falla
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};

/**
 * ✅ FUNCIÓN MEJORADA: Calcular offset de timezone correctamente
 */
const calculateTimezoneOffset = (date: string, timezone: string): string => {
  const birthDate = new Date(date);
  const year = birthDate.getFullYear();
  
  // Función auxiliar para obtener el último domingo de un mes
  const getLastSunday = (year: number, month: number): number => {
    const lastDay = new Date(year, month, 0);
    const dayOfWeek = lastDay.getDay();
    return lastDay.getDate() - dayOfWeek;
  };
  
  if (timezone === 'Europe/Madrid' || timezone === 'Europe/Berlin') {
    // Europa Central: Horario de verano desde último domingo de marzo hasta último domingo de octubre
    const dstStart = new Date(year, 2, getLastSunday(year, 3)); // Marzo
    const dstEnd = new Date(year, 9, getLastSunday(year, 10)); // Octubre
    
    if (birthDate >= dstStart && birthDate < dstEnd) {
      return '+02:00'; // CEST (Verano)
    } else {
      return '+01:00'; // CET (Invierno)
    }
  }
  
  // Zonas sin cambio de horario
  const staticTimezones: Record<string, string> = {
    'America/Argentina/Buenos_Aires': '-03:00',
    'America/Bogota': '-05:00',
    'America/Lima': '-05:00',
    'Asia/Tokyo': '+09:00',
    'UTC': '+00:00'
  };
  
  return staticTimezones[timezone] || '+00:00';
};

/**
 * ✅ FUNCIÓN MEJORADA: Formatear coordenadas con precisión máxima
 */
const formatCoordinates = (lat: number, lng: number) => {
  // Redondear a 4 decimales para máxima precisión con Prokerala
  const latFixed = Math.round(lat * 10000) / 10000;
  const lngFixed = Math.round(lng * 10000) / 10000;
  
  const formatted = `${latFixed},${lngFixed}`;
  
  console.log(`🎯 Coordenadas formateadas: ${formatted}`, {
    original: { lat, lng },
    fixed: { lat: latFixed, lng: lngFixed },
    precision: {
      lat: lat.toString().split('.')[1]?.length || 0,
      lng: lng.toString().split('.')[1]?.length || 0
    },
    decimals_prokerala: 4
  });

  return { lat: latFixed, lng: lngFixed, formatted };
};

// ==========================================
// COMPONENTE PRINCIPAL MEJORADO
// ==========================================

export default function BirthDataForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [savedData, setSavedData] = useState<any>(null);
  const { user } = useAuth();
  const router = useRouter();

  // Estados adicionales para funcionalidades avanzadas
  const [inputMethod, setInputMethod] = useState<'location' | 'coordinates'>('location');
  const [birthTimeKnown, setBirthTimeKnown] = useState(true);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Estados para coordenadas Google Maps
  const [googleCoords, setGoogleCoords] = useState('');
  const [processedCoords, setProcessedCoords] = useState('');
  const [showProcessing, setShowProcessing] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<BirthDataFormValues>({
    resolver: zodResolver(birthDataSchema),
    defaultValues: {
      fullName: '',
      birthDate: '',
      birthTime: '',
      birthTimeKnown: true,
      inputMethod: 'location',
      birthPlace: '',
      latitude: undefined,
      longitude: undefined,
      timezone: 'Europe/Madrid',
    }
  });

  // Watch para valores dinámicos
  const watchedBirthPlace = watch('birthPlace');

  // ==========================================
  // BÚSQUEDA DE UBICACIONES CON DEBOUNCE
  // ==========================================

  const searchLocations = useCallback(async (query: string) => {
    if (query.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/prokerala/location-search?q=${encodeURIComponent(query)}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.locations) {
          setLocationSuggestions(data.locations);
        }
      } else {
        // Fallback a Nominatim si Prokerala falla
        const nominatimResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
        const nominatimData = await nominatimResponse.json();
        
        const locations = nominatimData.map((item: any) => ({
          name: item.display_name,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          timezone: 'Europe/Madrid', // Default
          country: item.address?.country || ''
        }));
        
        setLocationSuggestions(locations);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      setLocationSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce para búsqueda de ubicaciones
  useEffect(() => {
    if (inputMethod === 'location' && watchedBirthPlace) {
      const timer = setTimeout(() => {
        searchLocations(watchedBirthPlace);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [watchedBirthPlace, inputMethod, searchLocations]);

  // ==========================================
  // CARGA DE DATOS EXISTENTES
  // ==========================================

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
            const birthDate = new Date(data.birthDate);
            const formattedDate = birthDate.toISOString().split('T')[0];
            
            console.log('Datos cargados:', { ...data, birthDate: formattedDate });
            
            setValue('fullName', data.fullName || user.displayName || '');
            setValue('birthDate', formattedDate);
            setValue('birthTime', data.birthTime || '');
            setValue('birthPlace', data.birthPlace || '');
            
            // Si hay coordenadas, cambiar a modo coordenadas
            if (data.latitude && data.longitude) {
              setInputMethod('coordinates');
              setValue('inputMethod', 'coordinates');
              setValue('latitude', data.latitude);
              setValue('longitude', data.longitude);
              setValue('timezone', data.timezone || 'Europe/Madrid');
              
              // Mostrar coordenadas en campo Google Maps
              setGoogleCoords(`${data.latitude}, ${data.longitude}`);
              setProcessedCoords(formatCoordinates(data.latitude, data.longitude).formatted);
              setShowProcessing(true);
            }
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

  // ==========================================
  // ENVÍO CON LÓGICA MEJORADA Y GEOCODING INVERSO
  // ==========================================

  const onSubmit = async (data: BirthDataFormValues) => {
    if (!user) {
      setError('Debes iniciar sesión para guardar tus datos');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    
    console.log('🌟 Procesando datos con lógica mejorada:', data);
    
    try {
      let geoData;
      let processedCoordinates = '';
      let finalBirthPlace = '';
      
      if (inputMethod === 'location') {
        if (selectedLocation) {
          // Usar ubicación seleccionada con coordenadas ya formateadas
          processedCoordinates = formatCoordinates(selectedLocation.latitude, selectedLocation.longitude).formatted;
          finalBirthPlace = selectedLocation.name;
          geoData = [{
            lat: selectedLocation.latitude.toString(),
            lon: selectedLocation.longitude.toString(),
            display_name: selectedLocation.name
          }];
          console.log('📍 Usando ubicación seleccionada:', selectedLocation.name);
        } else {
          // Fallback a geocoding original
          const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(data.birthPlace || '')}`);
          geoData = await geoResponse.json();
          
          if (!geoData || geoData.length === 0) {
            setError('No se pudo encontrar el lugar de nacimiento. Intenta con una ubicación más específica o usa coordenadas manuales.');
            setIsSubmitting(false);
            return;
          }
          
          processedCoordinates = formatCoordinates(parseFloat(geoData[0].lat), parseFloat(geoData[0].lon)).formatted;
          finalBirthPlace = data.birthPlace || geoData[0].display_name;
          console.log('🌍 Geocodificación exitosa:', geoData[0].display_name);
        }
      } else {
        // ✅ CORRECCIÓN CRÍTICA: Usar coordenadas manuales + geocoding inverso
        const lat = data.latitude || 0;
        const lng = data.longitude || 0;
        processedCoordinates = formatCoordinates(lat, lng).formatted;
        
        // 🆕 HACER GEOCODING INVERSO PARA OBTENER NOMBRE DE CIUDAD
        finalBirthPlace = await reverseGeocode(lat, lng);
        
        geoData = [{
          lat: lat.toString(),
          lon: lng.toString(),
          display_name: finalBirthPlace  // ✅ Ahora es "Madrid, España" en lugar de coordenadas
        }];
        
        console.log(`🎯 Coordenadas manuales: ${processedCoordinates} → ${finalBirthPlace}`);
      }

      // Calcular timezone correcto usando la lógica del test
      const correctTimezone = calculateTimezoneOffset(
        data.birthDate, 
        data.timezone || 'Europe/Madrid'
      );
      
      console.log(`🌍 Timezone calculado: ${correctTimezone} para ${data.timezone} en ${data.birthDate}`);
      
      // Formatear datetime para Prokerala con timezone correcto
      const birthTime = birthTimeKnown ? (data.birthTime || '12:00:00') : '12:00:00';
      const datetime = `${data.birthDate}T${birthTime}${correctTimezone}`;
      console.log(`📅 DateTime formateado: ${datetime}`);

      // Preparar datos para la API (manteniendo estructura original)
      const birthData = {
        userId: user.uid,
        fullName: data.fullName || user.displayName || 'Usuario',
        birthDate: data.birthDate,
        birthTime: birthTime,
        birthTimeKnown: birthTimeKnown,
        birthPlace: finalBirthPlace,  // ✅ Ahora siempre será nombre de ciudad
        latitude: parseFloat(geoData[0].lat),
        longitude: parseFloat(geoData[0].lon),
        timezone: data.timezone || 'Europe/Madrid',
        
        // Añadir datos procesados para verificación
        processed: {
          datetime,
          coordinates: processedCoordinates,
          timezone_offset: correctTimezone,
          input_method: inputMethod,
          reverse_geocoded: inputMethod === 'coordinates',
          google_maps_used: inputMethod === 'coordinates' && googleCoords.length > 0
        }
      };
      
      console.log('📡 Datos procesados para API (con geocoding inverso):', birthData);
      
      // Envío a la API (manteniendo lógica original)
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
      
      // ¡ÉXITO! - Ahora birthPlace será "Madrid, España"
      setSavedData(birthData);
      setSuccess(true);
      
      console.log('✅ Datos guardados exitosamente con geocoding inverso:', responseData);
      console.log('🏙️ Lugar guardado como:', finalBirthPlace);
      
      // NO intentar generar carta natal automáticamente - solo mostrar éxito
      console.log('💾 Datos listos para generar carta natal cuando el usuario lo solicite');
      
    } catch (error) {
      console.error('❌ Error guardando datos de nacimiento:', error);
      setError(error instanceof Error ? error.message : 'Ha ocurrido un error. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para ir al dashboard
  const goToDashboard = () => {
    router.push('/dashboard');
  };

  // Función para generar carta natal
  const generateNatalChart = async () => {
    if (!savedData) return;
    
    setIsSubmitting(true);
    try {
      console.log('🔮 Generando carta natal...');
      const chartResponse = await fetch('/api/charts/natal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.uid,
          regenerate: true
        }),
      });
      
      const chartData = await chartResponse.json();
      
      if (chartResponse.ok) {
        console.log('✅ Carta natal generada exitosamente');
        router.push('/dashboard?carta=generada');
      } else {
        console.warn('⚠️ Error generando carta natal:', chartData.error);
        setError('Datos guardados correctamente, pero hubo un problema generando la carta natal. Puedes intentarlo desde el dashboard.');
      }
    } catch (chartError) {
      console.error('❌ Error al generar la carta natal:', chartError);
      setError('Datos guardados correctamente, pero hubo un problema generando la carta natal. Puedes intentarlo desde el dashboard.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para seleccionar ubicación
  const selectLocation = (location: LocationSuggestion) => {
    setSelectedLocation(location);
    setValue('birthPlace', location.name);
    setValue('latitude', location.latitude);
    setValue('longitude', location.longitude);
    setValue('timezone', location.timezone);
    setLocationSuggestions([]);
  };

  // Procesar coordenadas Google Maps
  const processGoogleCoords = () => {
    const coords = googleCoords.trim();
    
    if (!coords) {
      setProcessedCoords('');
      setShowProcessing(false);
      return;
    }
    
    try {
      // Parsear coordenadas de varios formatos posibles
      const cleanCoords = coords.replace(/[°'"]/g, '').trim();
      const parts = cleanCoords.split(/[,\s]+/);
      
      if (parts.length >= 2) {
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);
        
        if (!isNaN(lat) && !isNaN(lng)) {
          const { formatted } = formatCoordinates(lat, lng);
          setProcessedCoords(formatted);
          setShowProcessing(true);
          
          // Actualizar formulario
          setValue('latitude', lat);
          setValue('longitude', lng);
          
          console.log(`🗺️ Coordenadas Google Maps procesadas: ${formatted}`);
        }
      }
    } catch (error) {
      console.error('Error procesando coordenadas:', error);
      setProcessedCoords('');
      setShowProcessing(false);
    }
  };

  // ==========================================
  // RENDERIZADO
  // ==========================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-yellow-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Cargando datos...</h2>
          <p className="text-gray-300">Verificando información existente</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 max-w-2xl mx-4 text-center">
          <div className="bg-gradient-to-r from-green-400/20 to-emerald-500/20 border border-green-400/30 rounded-full p-6 w-fit mx-auto mb-6">
            <CheckCircle2 className="w-16 h-16 text-green-400" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            ¡Datos guardados exitosamente!
          </h2>
          
          <p className="text-xl text-gray-300 mb-6">
            Tu información de nacimiento ha sido guardada correctamente.
          </p>
          
          {savedData && (
            <div className="bg-black/30 rounded-xl p-4 mb-6 text-left">
              <h3 className="text-lg font-semibold text-white mb-3">📋 Resumen de datos:</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-300">Nombre:</span> <span className="text-white font-medium">{savedData.fullName}</span></p>
                <p><span className="text-gray-300">Fecha:</span> <span className="text-white font-medium">{savedData.birthDate}</span></p>
                <p><span className="text-gray-300">Hora:</span> <span className="text-white font-medium">{savedData.birthTime}</span></p>
                <p><span className="text-gray-300">Lugar:</span> <span className="text-white font-medium">{savedData.birthPlace}</span></p>
                <p><span className="text-gray-300">Coordenadas:</span> <span className="text-white font-medium">{savedData.latitude.toFixed(4)}, {savedData.longitude.toFixed(4)}</span></p>
                {savedData.processed?.reverse_geocoded && (
                  <p className="text-green-300 text-xs mt-2">✅ Ubicación detectada automáticamente desde coordenadas</p>
                )}
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={generateNatalChart}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generando...
                </>
              ) : (
                <>
                  <Star className="w-5 h-5 mr-2" />
                  Generar Carta Natal
                </>
              )}
            </button>
            
            <button
              onClick={goToDashboard}
              className="bg-white/10 border border-white/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              Ir al Dashboard
            </button>
          </div>
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
              <Sparkles className="w-12 h-12 text-yellow-400" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              Datos de Nacimiento
            </h1>
            <p className="text-xl text-gray-300">
              Información necesaria para generar tu carta natal con máxima precisión
            </p>
          </div>

          {/* Formulario */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Nombre completo */}
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

              {/* Fecha de nacimiento */}
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

              {/* Hora de nacimiento */}
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
                    <p className="text-yellow-200 text-sm flex items-center">
                      <Timer className="w-4 h-4 mr-2" />
                      Se usará el mediodía (12:00) como hora aproximada
                    </p>
                  </div>
                )}
              </div>

              {/* Método de entrada */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Método de ubicación
                </label>
                
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
                    <div className="text-sm font-medium">Coordenadas exactas</div>
                    <div className="text-xs opacity-70">Máxima precisión</div>
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
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-colors"
                      placeholder="Ej: Madrid, España"
                    />
                    
                    {isSearching && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Sugerencias de ubicación */}
                  {locationSuggestions.length > 0 && (
                    <div className="mt-2 bg-white/10 border border-white/20 rounded-xl overflow-hidden">
                      {locationSuggestions.map((location, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectLocation(location)}
                          className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0"
                        >
                          <div className="text-white font-medium">{location.name}</div>
                          <div className="text-gray-300 text-sm">
                            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Ubicación seleccionada */}
                  {selectedLocation && (
                    <div className="mt-3 bg-green-400/10 border border-green-400/30 rounded-xl p-4">
                      <div className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-green-300 font-semibold mb-2">Ubicación seleccionada</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">Lugar:</p>
                              <p className="text-white font-medium">{selectedLocation.name}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Coordenadas:</p>
                              <p className="text-white font-medium">
                                {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400">Zona horaria:</p>
                              <p className="text-white font-medium">{selectedLocation.timezone}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">País:</p>
                              <p className="text-white font-medium">{selectedLocation.country}</p>
                              <p className="text-green-300 text-xs mt-1">✓ Autodetectado</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <input type="hidden" {...register('birthPlace')} />
                  
                  {errors.birthPlace && (
                    <p className="text-sm text-red-400 flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.birthPlace.message}
                    </p>
                  )}
                </div>
              )}

              {/* Coordenadas exactas */}
              {inputMethod === 'coordinates' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-400/30 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-start">
                      <Target className="w-5 h-5 text-orange-400 mr-3 mt-0.5" />
                      <div>
                        <h4 className="text-orange-300 font-semibold mb-2">Coordenadas de Google Maps</h4>
                        <p className="text-orange-200 text-sm mb-2">
                          Ve a Google Maps, busca tu lugar de nacimiento, haz clic derecho y copia las coordenadas.
                        </p>
                        
                        <div className="space-y-3">
                          <div>
                            <input
                              type="text"
                              value={googleCoords}
                              onChange={(e) => setGoogleCoords(e.target.value)}
                              onBlur={processGoogleCoords}
                              className="w-full px-3 py-2 bg-white/10 border border-orange-400/30 rounded-lg text-white placeholder-gray-400 text-sm"
                              placeholder="40.4164, -3.7025 o 40.4164,-3.7025"
                            />
                          </div>
                          
                          {showProcessing && processedCoords && (
                            <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-3">
                              <div className="flex items-center mb-1">
                                <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                                <span className="text-green-300 text-sm font-medium">Coordenadas procesadas</span>
                              </div>
                              <div className="text-green-200 text-sm font-mono">{processedCoords}</div>
                              <div className="text-green-300 text-xs mt-1">
                                ✓ Formato Prokerala optimizado (4 decimales)
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Campos manuales de coordenadas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Latitud *
                      </label>
                      <input
                        {...register('latitude', { valueAsNumber: true })}
                        type="number"
                        step="0.0001"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-colors"
                        placeholder="40.4164"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Longitud *
                      </label>
                      <input
                        {...register('longitude', { valueAsNumber: true })}
                        type="number"
                        step="0.0001"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-colors"
                        placeholder="-3.7025"
                      />
                    </div>
                  </div>
                  
                  {/* Zona horaria */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Zona Horaria *
                    </label>
                    <select
                      {...register('timezone')}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-colors"
                    >
                      <option value="Europe/Madrid">Europa/Madrid (España)</option>
                      <option value="America/Mexico_City">América/Ciudad_de_México</option>
                      <option value="America/Argentina/Buenos_Aires">América/Buenos_Aires</option>
                      <option value="America/Bogota">América/Bogotá (Colombia)</option>
                      <option value="America/Lima">América/Lima (Perú)</option>
                      <option value="America/Santiago">América/Santiago (Chile)</option>
                      <option value="UTC">UTC (Tiempo Universal)</option>
                    </select>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
                    <div className="flex items-start">
                      <Globe className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
                      <div>
                        <h4 className="text-blue-300 font-semibold mb-2">💡 Precisión Máxima</h4>
                        <p className="text-blue-200 text-sm">
                          Las coordenadas exactas aseguran la máxima precisión astrológica. 
                          Diferencias de pocos metros pueden cambiar interpretaciones importantes.
                        </p>
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
                    <Sparkles className="w-5 h-5 mr-2" />
                    Guardar Datos de Nacimiento
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}