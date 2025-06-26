// src/components/dashboard/BirthDataForm.tsx
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
// FUNCIONES DE PROCESAMIENTO (del test-birth-data)
// ==========================================

// Función mejorada para calcular timezone correcto según fecha
const calculateTimezoneOffset = (date: string, timezone: string): string => {
  const birthDate = new Date(date);
  const year = birthDate.getFullYear();
  
  // Función auxiliar para obtener el último domingo de un mes
  const getLastSunday = (year: number, month: number): number => {
    const lastDay = new Date(year, month, 0);
    const dayOfWeek = lastDay.getDay();
    return lastDay.getDate() - dayOfWeek;
  };
  
  if (timezone === 'Europe/Madrid' || timezone === 'Europe/Berlin' || timezone === 'Europe/Paris') {
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

// Función para formatear coordenadas con precisión correcta
const formatCoordinates = (lat: number, lng: number): string => {
  // Redondear a 4 decimales para Prokerala
  const latFixed = Math.round(lat * 10000) / 10000;
  const lngFixed = Math.round(lng * 10000) / 10000;
  return `${latFixed.toFixed(4)},${lngFixed.toFixed(4)}`;
};

// Función para procesar coordenadas de Google Maps
const processGoogleCoords = (coords: string): { lat: number; lng: number; formatted: string } => {
  // Limpiar y dividir coordenadas
  const cleanCoords = coords.replace(/\s+/g, '').split(',');
  
  if (cleanCoords.length !== 2) {
    throw new Error('Formato inválido. Usa: latitud, longitud');
  }

  const lat = parseFloat(cleanCoords[0]);
  const lng = parseFloat(cleanCoords[1]);

  if (isNaN(lat) || isNaN(lng)) {
    throw new Error('Las coordenadas deben ser números válidos');
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw new Error('Coordenadas fuera de rango válido');
  }

  const formatted = formatCoordinates(lat, lng);
  
  console.log('🗺️ Google Maps coords procesadas:', {
    original: { lat, lng },
    formatted: formatted,
    decimals_original: {
      lat: lat.toString().split('.')[1]?.length || 0,
      lng: lng.toString().split('.')[1]?.length || 0
    },
    decimals_prokerala: 4
  });

  return { lat, lng, formatted };
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
  const watchedBirthDate = watch('birthDate');
  const watchedTimezone = watch('timezone');
  const watchedLatitude = watch('latitude');
  const watchedLongitude = watch('longitude');

  // ==========================================
  // BÚSQUEDA DE UBICACIONES MEJORADA
  // ==========================================

  const searchLocation = useCallback(async (query: string) => {
    if (query.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      // Intentar tu API primero
      try {
        const response = await fetch(`/api/prokerala/location-search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.success && data.locations) {
          setLocationSuggestions(data.locations.slice(0, 5));
          setIsSearching(false);
          return;
        }
      } catch (apiError) {
        console.log('API propia no disponible, usando fallback');
      }

      // Fallback a Nominatim
      const nominatimResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`
      );
      const nominatimData = await nominatimResponse.json();
      
      const formattedLocations: LocationSuggestion[] = nominatimData.map((item: any) => ({
        name: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        timezone: 'Europe/Madrid', // Default, se calculará después
        country: item.address?.country || 'Desconocido',
        region: item.address?.state || item.address?.region
      }));
      
      setLocationSuggestions(formattedLocations);
    } catch (error) {
      console.error('Error buscando ubicaciones:', error);
      setLocationSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce para búsqueda
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => searchLocation(query), 300);
      };
    })(),
    [searchLocation]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setValue('birthPlace', query);
    debouncedSearch(query);
  };

  const selectLocation = (location: LocationSuggestion) => {
    console.log('📍 Ubicación seleccionada:', location);
    
    setSelectedLocation(location);
    setSearchQuery(location.name);
    setValue('birthPlace', location.name);
    setValue('latitude', location.latitude);
    setValue('longitude', location.longitude);
    setValue('timezone', location.timezone);
    setLocationSuggestions([]);
  };

  // ==========================================
  // MANEJO DE COORDENADAS GOOGLE MAPS
  // ==========================================

  const handleGoogleCoordsChange = (coords: string) => {
    setGoogleCoords(coords);
    
    if (coords.length > 10) { // Solo procesar si parece una coordenada válida
      try {
        const { lat, lng, formatted } = processGoogleCoords(coords);
        setProcessedCoords(formatted);
        setShowProcessing(true);
        
        // Actualizar el formulario
        setValue('latitude', lat);
        setValue('longitude', lng);
        
        console.log('✅ Coordenadas Google Maps procesadas automáticamente');
      } catch (err) {
        setShowProcessing(false);
        console.log('⏳ Esperando coordenadas válidas...');
      }
    } else {
      setShowProcessing(false);
    }
  };

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
              setProcessedCoords(formatCoordinates(data.latitude, data.longitude));
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
  // ENVÍO CON LÓGICA MEJORADA
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
      
      if (inputMethod === 'location') {
        if (selectedLocation) {
          // Usar ubicación seleccionada con coordenadas ya formateadas
          processedCoordinates = formatCoordinates(selectedLocation.latitude, selectedLocation.longitude);
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
          
          processedCoordinates = formatCoordinates(parseFloat(geoData[0].lat), parseFloat(geoData[0].lon));
          console.log('🌍 Geocodificación exitosa:', geoData[0].display_name);
        }
      } else {
        // Usar coordenadas manuales con formateo correcto
        const lat = data.latitude || 0;
        const lng = data.longitude || 0;
        processedCoordinates = formatCoordinates(lat, lng);
        
        geoData = [{
          lat: lat.toString(),
          lon: lng.toString(),
          display_name: `${lat}, ${lng}`
        }];
        
        console.log('🎯 Usando coordenadas manuales Google Maps:', processedCoordinates);
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
        birthPlace: inputMethod === 'location' ? (data.birthPlace || '') : geoData[0].display_name,
        latitude: parseFloat(geoData[0].lat),
        longitude: parseFloat(geoData[0].lon),
        timezone: data.timezone || 'Europe/Madrid',
        
        // Añadir datos procesados para verificación
        processed: {
          datetime,
          coordinates: processedCoordinates,
          timezone_offset: correctTimezone,
          input_method: inputMethod,
          google_maps_used: inputMethod === 'coordinates' && googleCoords.length > 0
        }
      };
      
      console.log('📡 Datos procesados para API:', birthData);
      
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
      
      // ¡ÉXITO! Guardar datos y mostrar mensaje
      setSavedData(birthData);
      setSuccess(true);
      
      console.log('✅ Datos guardados exitosamente:', responseData);
      
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
      setError('Datos guardados correctamente, pero hubo un problema generando la carta natal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // RENDER LOADING
  // ==========================================

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

  // ==========================================
  // RENDER PRINCIPAL MEJORADO
  // ==========================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/10 via-transparent to-transparent"></div>
      
      {/* Estrellas decorativas */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-300"></div>
      <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-700"></div>
      <div className="absolute bottom-1/3 right-1/2 w-3 h-3 bg-yellow-300 rounded-full animate-pulse delay-500"></div>
      <div className="absolute top-3/4 left-1/2 w-4 h-4 bg-pink-400 rounded-full animate-bounce delay-1200"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          
          {/* Header mejorado */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-6">
              <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-6 backdrop-blur-sm relative">
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <User className="w-8 h-8 text-yellow-400" />
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
                <Sparkles className="w-5 h-5 text-blue-400 mr-2" />
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
            
            {/* Mensajes de error */}
            {error && (
              <div className="mb-8 bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-400/50 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-red-300 mb-2">Algo no salió como esperábamos</h3>
                    <p className="text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Mensaje de éxito MEJORADO */}
            {success && savedData && (
              <div className="mb-8 bg-gradient-to-r from-green-900/50 to-green-800/50 border border-green-400/50 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-bold text-green-300 mb-4">¡Perfecto! Tu información ha sido guardada</h3>
                    
                    {/* Resumen de datos guardados */}
                    <div className="bg-green-800/30 rounded-lg p-4 mb-4">
                      <h4 className="text-green-200 font-semibold mb-3">📊 Datos guardados:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-green-300">Nombre:</span>
                          <span className="text-white ml-2">{savedData.fullName}</span>
                        </div>
                        <div>
                          <span className="text-green-300">Fecha:</span>
                          <span className="text-white ml-2">{savedData.birthDate}</span>
                        </div>
                        <div>
                          <span className="text-green-300">Hora:</span>
                          <span className="text-white ml-2">
                            {savedData.birthTime} {!savedData.birthTimeKnown && '(aproximada)'}
                          </span>
                        </div>
                        <div>
                          <span className="text-green-300">Lugar:</span>
                          <span className="text-white ml-2">{savedData.birthPlace}</span>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-green-300">Coordenadas:</span>
                          <span className="text-green-200 ml-2 font-mono">
                            {savedData.processed?.coordinates}
                          </span>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-green-300">Timezone:</span>
                          <span className="text-blue-300 ml-2">
                            {savedData.timezone} ({savedData.processed?.timezone_offset})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={generateNatalChart}
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center justify-center"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Generando carta...
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
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center"
                      >
                        <Globe className="w-5 h-5 mr-2" />
                        Ir al Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Formulario - Solo mostrar si no hay éxito */}
            {!success && (
              <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                
                {/* Nombre completo */}
                <div className="space-y-3">
                  <label className="flex items-center text-lg font-bold text-yellow-400">
                    <User className="w-5 h-5 mr-3" />
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
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Fecha de nacimiento */}
                <div className="space-y-3">
                  <label className="flex items-center text-lg font-bold text-yellow-400">
                    <Calendar className="w-5 h-5 mr-3" />
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
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.birthDate.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Hora de nacimiento MEJORADA */}
                <div className="space-y-3">
                  <label className="flex items-center text-lg font-bold text-yellow-400">
                    <Clock className="w-5 h-5 mr-3" />
                    Hora de nacimiento
                  </label>
                  
                  {/* Toggle hora conocida/desconocida */}
                  <div className="flex items-center space-x-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setBirthTimeKnown(true)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        birthTimeKnown 
                          ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                          : 'bg-black/20 text-gray-400 border border-gray-600/30 hover:border-gray-500/50'
                      }`}
                    >
                      Sé mi hora exacta
                    </button>
                    <button
                      type="button"
                      onClick={() => setBirthTimeKnown(false)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        !birthTimeKnown 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' 
                          : 'bg-black/20 text-gray-400 border border-gray-600/30 hover:border-gray-500/50'
                      }`}
                    >
                      No estoy seguro
                    </button>
                  </div>

                  {birthTimeKnown ? (
                    <div className="relative">
                      <input
                        type="time"
                        className="w-full p-4 rounded-xl bg-black/30 border border-purple-400/30 text-white focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all backdrop-blur-sm"
                        {...register('birthTime')}
                      />
                      {errors.birthTime && (
                        <p className="mt-2 text-sm text-red-400 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.birthTime.message}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-500/10 border border-amber-400/30 rounded-xl backdrop-blur-sm">
                      <div className="flex items-start">
                        <Timer className="w-5 h-5 text-amber-400 mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-amber-300 font-semibold mb-2">Hora aproximada</h4>
                          <p className="text-amber-200 text-sm">
                            Usaremos las 12:00 del mediodía como hora aproximada. Esto puede afectar la precisión de tu carta natal, especialmente las casas astrológicas.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lugar de nacimiento MEJORADO CON GOOGLE MAPS */}
                <div className="space-y-4">
                  <label className="flex items-center text-lg font-bold text-yellow-400">
                    <MapPin className="w-5 h-5 mr-3" />
                    Lugar de nacimiento
                  </label>
                  
                  {/* Tabs para método de entrada */}
                  <div className="flex bg-black/20 rounded-xl p-1 border border-purple-400/30">
                    <button
                      type="button"
                      onClick={() => setInputMethod('location')}
                      className={`flex-1 px-4 py-3 rounded-lg transition-all flex items-center justify-center ${
                        inputMethod === 'location'
                          ? 'bg-purple-500/30 text-purple-200 border border-purple-400/30'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Buscar lugar
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMethod('coordinates')}
                      className={`flex-1 px-4 py-3 rounded-lg transition-all flex items-center justify-center ${
                        inputMethod === 'coordinates'
                          ? 'bg-orange-500/30 text-orange-200 border border-orange-400/30'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Google Maps
                    </button>
                  </div>

                  {/* Búsqueda de lugar */}
                  {inputMethod === 'location' && (
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Busca tu ciudad de nacimiento..."
                          value={searchQuery}
                          onChange={handleSearchChange}
                          className="w-full p-4 pr-12 rounded-xl bg-black/30 border border-purple-400/30 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all backdrop-blur-sm"
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          {isSearching ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-400 border-t-transparent"></div>
                          ) : (
                            <Search className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Sugerencias de ubicación */}
                      {locationSuggestions.length > 0 && (
                        <div className="bg-black/50 border border-purple-400/30 rounded-xl backdrop-blur-sm max-h-60 overflow-y-auto">
                          {locationSuggestions.map((location, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => selectLocation(location)}
                              className="w-full p-4 text-left hover:bg-purple-500/20 transition-all border-b border-purple-400/20 last:border-b-0"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-white font-medium">{location.name}</p>
                                  <p className="text-gray-400 text-sm">{location.country}</p>
                                </div>
                                <Globe className="w-4 h-4 text-purple-400" />
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Ubicación seleccionada */}
                      {selectedLocation && (
                        <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl backdrop-blur-sm">
                          <div className="flex items-start">
                            <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="text-green-300 font-semibold mb-2">Ubicación confirmada</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-400">Coordenadas:</p>
                                  <p className="text-white font-medium font-mono">
                                    {formatCoordinates(selectedLocation.latitude, selectedLocation.longitude)}
                                  </p>
                                  <p className="text-green-300 text-xs mt-1">
                                    ✓ Formateado para Prokerala
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Zona horaria:</p>
                                  <p className="text-white font-medium">{selectedLocation.timezone}</p>
                                  {watchedBirthDate && (
                                    <p className="text-blue-300 text-xs mt-1">
                                      Offset: {calculateTimezoneOffset(watchedBirthDate, selectedLocation.timezone)}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <p className="text-gray-400">País:</p>
                                  <p className="text-white font-medium">{selectedLocation.country}</p>
                                  <p className="text-green-300 text-xs mt-1">
                                    ✓ Autodetectado
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <input type="hidden" {...register('birthPlace')} />
                      
                      {errors.birthPlace && (
                        <p className="text-sm text-red-400 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.birthPlace.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Coordenadas Google Maps MEJORADO */}
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
                            <p className="text-yellow-300 text-xs">
                              💡 Ejemplo: 40.43702097891494, -3.695654974109133
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Pega aquí las coordenadas de Google Maps:
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={googleCoords}
                            onChange={(e) => handleGoogleCoordsChange(e.target.value)}
                            placeholder="40.43702097891494, -3.695654974109133"
                            className="flex-1 p-4 rounded-xl bg-black/30 border border-purple-400/30 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all backdrop-blur-sm font-mono text-sm"
                          />
                          {googleCoords && (
                            <button
                              type="button"
                              onClick={() => navigator.clipboard.writeText(processedCoords)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Mostrar coordenadas procesadas */}
                      {showProcessing && processedCoords && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-black">
                          <h4 className="font-semibold text-green-800 mb-3 flex items-center text-sm">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            ✅ Coordenadas Procesadas Automáticamente
                          </h4>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600 mb-1">Originales (Google Maps):</p>
                              <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono block">
                                {googleCoords}
                              </code>
                            </div>
                            
                            <div>
                              <p className="text-gray-600 mb-1">Formateadas (Prokerala):</p>
                              <code className="bg-green-100 px-2 py-1 rounded text-xs font-mono text-green-800 block">
                                {processedCoords}
                              </code>
                            </div>
                          </div>
                          
                          <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                            <p className="text-blue-800 text-xs">
                              ✓ <strong>Precisión:</strong> 4 decimales = ±11 metros (perfecto para astrología)
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Campos hidden para react-hook-form */}
                      <input type="hidden" {...register('latitude', { valueAsNumber: true })} />
                      <input type="hidden" {...register('longitude', { valueAsNumber: true })} />
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Zona Horaria
                        </label>
                        <select
                          className="w-full p-4 rounded-xl bg-black/30 border border-purple-400/30 text-white focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all backdrop-blur-sm"
                          {...register('timezone')}
                        >
                          <option value="">Seleccionar zona horaria</option>
                          <option value="Europe/Madrid">Europa/Madrid (España)</option>
                          <option value="Europe/Paris">Europa/París (Francia)</option>
                          <option value="Europe/Berlin">Europa/Berlín (Alemania)</option>
                          <option value="America/Argentina/Buenos_Aires">América/Buenos_Aires (Argentina)</option>
                          <option value="America/Mexico_City">América/Ciudad_de_México</option>
                          <option value="America/Bogota">América/Bogotá (Colombia)</option>
                          <option value="America/Lima">América/Lima (Perú)</option>
                          <option value="America/Santiago">América/Santiago (Chile)</option>
                          <option value="America/New_York">América/Nueva_York (USA Este)</option>
                          <option value="America/Los_Angeles">América/Los_Ángeles (USA Oeste)</option>
                          <option value="UTC">UTC (Tiempo Universal)</option>
                        </select>
                        
                        {/* Mostrar offset calculado */}
                        {watchedTimezone && watchedBirthDate && (
                          <div className="mt-2 p-3 bg-blue-500/10 rounded-lg border border-blue-400/30">
                            <p className="text-blue-300 text-sm">
                              <strong>Offset calculado:</strong> {calculateTimezoneOffset(watchedBirthDate, watchedTimezone)}
                            </p>
                            <p className="text-blue-200 text-xs mt-1">
                              {watchedTimezone.includes('Europe') ? 
                                '🌍 Incluye cambio automático horario verano/invierno' :
                                '🌎 Zona horaria fija (sin cambio estacional)'
                              }
                            </p>
                          </div>
                        )}
                        
                        {errors.timezone && (
                          <p className="mt-2 text-sm text-red-400 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.timezone.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Botón de envío */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-5 rounded-2xl text-xl font-black hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black mr-3"></div>
                        Guardando tus datos...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Sparkles className="w-6 h-6 mr-3" />
                        Guardar Mis Datos
                        <Star className="w-6 h-6 ml-3" />
                      </div>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Información de privacidad */}
            <div className="mt-8 text-center">
              <div className="bg-gradient-to-r from-gray-800/30 to-gray-700/30 border border-gray-600/30 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm text-gray-400">
                  🔒 <strong className="text-white">Tu privacidad es sagrada.</strong> Toda tu información personal está encriptada y protegida. 
                  Nunca compartiremos tus datos con terceros.
                </p>
              </div>
            </div>
          </div>

          {/* Panel informativo adicional */}
          {!success && (
            <div className="mt-8 max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-400/30 rounded-xl p-6 backdrop-blur-sm">
                <h2 className="text-lg font-bold text-indigo-300 mb-4 flex items-center">
                  <Globe className="w-6 h-6 mr-2" />
                  ¿Cómo obtener coordenadas de Google Maps?
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h3 className="font-semibold text-indigo-400 mb-3">📱 Pasos rápidos:</h3>
                    <ol className="space-y-2 text-indigo-200 list-decimal list-inside">
                      <li>Ve a Google Maps</li>
                      <li>Busca tu lugar de nacimiento</li>
                      <li>Haz clic derecho en el punto exacto</li>
                      <li>Copia las coordenadas que aparecen</li>
                      <li>Pégalas en el campo "Google Maps"</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-purple-400 mb-3">✨ Ventajas:</h3>
                    <ul className="space-y-2 text-purple-200">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Máxima precisión astrológica</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Formateo automático para Prokerala</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Cálculo correcto de timezone</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enlaces de ayuda */}
          <div className="mt-8 text-center">
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a 
                href="/test-birth-data" 
                target="_blank"
                className="text-purple-400 hover:text-purple-300 underline flex items-center"
              >
                🧪 Test completo de datos
              </a>
              <a 
                href="/test-natal-chart" 
                target="_blank"
                className="text-blue-400 hover:text-blue-300 underline flex items-center"
              >
                🔮 Test carta natal
              </a>
              <a 
                href="/dashboard" 
                className="text-green-400 hover:text-green-300 underline flex items-center"
              >
                🏠 Volver al dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}