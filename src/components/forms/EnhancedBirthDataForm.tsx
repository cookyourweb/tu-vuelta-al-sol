// src/components/forms/EnhancedBirthDataForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema de validación
const birthDataSchema = z.object({
  fullName: z.string().min(2, 'Nombre requerido'),
  birthDate: z.string().min(10, 'Fecha requerida'),
  birthTime: z.string().optional(),
  birthTimeKnown: z.boolean().default(true),
  inputMethod: z.enum(['location', 'coordinates']).default('location'),
  
  // Para búsqueda de lugar
  birthPlace: z.string().optional(),
  
  // Para coordenadas manuales
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  timezone: z.string().optional(),
});

type BirthDataForm = z.infer<typeof birthDataSchema>;

export default function EnhancedBirthDataForm() {
  const [inputMethod, setInputMethod] = useState<'location' | 'coordinates'>('location');
  const [birthTimeKnown, setBirthTimeKnown] = useState(true);
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<BirthDataForm>({
    resolver: zodResolver(birthDataSchema),
    defaultValues: {
      birthTime: new Date().toTimeString().slice(0, 5),
      birthTimeKnown: true,
      inputMethod: 'location'
    }
  });

  // Búsqueda de lugares con debounce
  const searchLocation = async (query: string) => {
    if (query.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`/api/astrology/location-search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success) {
        setLocationSuggestions(data.locations || []);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
    }
  };

  // Seleccionar ubicación de sugerencias
  const selectLocation = (location: any) => {
    setSelectedLocation(location);
    setValue('birthPlace', location.name);
    setValue('latitude', location.latitude);
    setValue('longitude', location.longitude);
    setValue('timezone', location.timezone);
    setLocationSuggestions([]);
  };

  // Manejar envío del formulario
  const onSubmit = async (data: BirthDataForm) => {
    try {
      console.log('🌟 Generando carta natal con:', data);

      // Preparar datos para la API
      const apiData = {
        fullName: data.fullName,
        birthDate: data.birthDate,
        birthTime: data.birthTimeKnown ? data.birthTime : '12:00:00',
        birthTimeKnown: data.birthTimeKnown,
        ...(inputMethod === 'location' ? {
          birthPlace: data.birthPlace,
          inputMethod: 'location'
        } : {
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone,
          inputMethod: 'coordinates'
        })
      };

      const response = await fetch('/api/astrology/natal-chart-accurate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Carta natal generada:', result.data);
        // TODO: Redirigir a página de resultados
      } else {
        console.error('❌ Error:', result.error);
      }
    } catch (error) {
      console.error('❌ Error generando carta:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-900">
        Datos de Nacimiento
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nombre completo */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Nombre Completo *
          </label>
          <input
            {...register('fullName')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Tu nombre completo"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Fecha de nacimiento */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Fecha de Nacimiento *
          </label>
          <input
            {...register('birthDate')}
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.birthDate && (
            <p className="text-red-500 text-sm mt-1">{errors.birthDate.message}</p>
          )}
        </div>

        {/* Hora de nacimiento */}
        <div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="birthTimeKnown"
              checked={birthTimeKnown}
              onChange={(e) => {
                setBirthTimeKnown(e.target.checked);
                setValue('birthTimeKnown', e.target.checked);
                if (!e.target.checked) {
                  setValue('birthTime', '12:00');
                }
              }}
              className="mr-2"
            />
            <label htmlFor="birthTimeKnown" className="text-sm font-medium">
              Conozco mi hora exacta de nacimiento
            </label>
          </div>
          
          <input
            {...register('birthTime')}
            type="time"
            disabled={!birthTimeKnown}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
              !birthTimeKnown ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          />
          
          {!birthTimeKnown && (
            <p className="text-amber-600 text-sm mt-1">
              ⚠️ Usaremos mediodía (12:00) como aproximación. La precisión de tu carta puede verse afectada.
            </p>
          )}
        </div>

        {/* Método de entrada de ubicación */}
        <div>
          <label className="block text-sm font-medium mb-3">
            ¿Cómo prefieres ingresar tu lugar de nacimiento?
          </label>
          
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="location"
                checked={inputMethod === 'location'}
                onChange={(e) => {
                  setInputMethod('location');
                  setValue('inputMethod', 'location');
                }}
                className="mr-2"
              />
              <span className="text-sm">🔍 Buscar ciudad</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                value="coordinates"
                checked={inputMethod === 'coordinates'}
                onChange={(e) => {
                  setInputMethod('coordinates');
                  setValue('inputMethod', 'coordinates');
                }}
                className="mr-2"
              />
              <span className="text-sm">📍 Coordenadas exactas</span>
            </label>
          </div>
        </div>

        {/* Búsqueda de lugar */}
        {inputMethod === 'location' && (
          <div className="relative">
            <label className="block text-sm font-medium mb-2">
              Lugar de Nacimiento *
            </label>
            <input
              {...register('birthPlace')}
              type="text"
              onChange={(e) => searchLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: Madrid, España"
            />
            
            {/* Sugerencias de ubicación */}
            {locationSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {locationSuggestions.map((location, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectLocation(location)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium">{location.name}</div>
                    <div className="text-sm text-gray-500">
                      {location.country} • Lat: {location.latitude}, Lon: {location.longitude}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Ubicación seleccionada */}
            {selectedLocation && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                <div className="text-sm text-green-800">
                  ✅ <strong>{selectedLocation.name}</strong>
                  <br />
                  📍 {selectedLocation.latitude}, {selectedLocation.longitude}
                  <br />
                  🕒 {selectedLocation.timezone}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Coordenadas manuales */}
        {inputMethod === 'coordinates' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Latitud *
                </label>
                <input
                  {...register('latitude', { valueAsNumber: true })}
                  type="number"
                  step="0.0001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="40.4164"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Longitud *
                </label>
                <input
                  {...register('longitude', { valueAsNumber: true })}
                  type="number"
                  step="0.0001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="-3.7025"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Zona Horaria *
              </label>
              <select
                {...register('timezone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccionar zona horaria</option>
                <option value="Europe/Madrid">Europa/Madrid (España)</option>
                <option value="America/Mexico_City">América/Ciudad_de_México</option>
                <option value="America/Argentina/Buenos_Aires">América/Buenos_Aires</option>
                <option value="America/Bogota">América/Bogotá (Colombia)</option>
                <option value="America/Lima">América/Lima (Perú)</option>
                <option value="America/Santiago">América/Santiago (Chile)</option>
              </select>
            </div>
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Las coordenadas deben ser precisas para máxima exactitud. 
                Puedes obtenerlas en Google Maps haciendo clic derecho en tu lugar de nacimiento.
              </p>
            </div>
          </div>
        )}

        {/* Botón enviar */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {isSubmitting ? 'Generando Carta Natal...' : '🌟 Generar Mi Carta Natal'}
        </button>
      </form>
    </div>
  );
}