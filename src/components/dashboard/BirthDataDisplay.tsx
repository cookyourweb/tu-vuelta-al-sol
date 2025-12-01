'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Calendar, Clock, MapPin, Star, CheckCircle2, Home } from 'lucide-react';

interface BirthData {
  fullName: string;
  date: string;
  time: string;
  location: string;
  birthPlace?: string;
  currentPlace?: string;
  livesInSamePlace?: boolean;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

interface BirthDataDisplayProps {
  className?: string;
}

export default function BirthDataDisplay({ className = '' }: BirthDataDisplayProps) {
  const { user } = useAuth();
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBirthData() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/birth-data?userId=${user.uid}`);
        if (response.ok) {
          const { data } = await response.json();
          if (data) {
            setBirthData(data);
          }
        } else {
          setError('No se encontraron datos de nacimiento');
        }
      } catch (error) {
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    }

    loadBirthData();
  }, [user]);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Cargando datos...</span>
        </div>
      </div>
    );
  }

  if (error || !birthData) {
    return (
      <div className={`bg-white rounded-lg p-6 ${className}`}>
        <div className="text-center py-8">
          <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay datos de nacimiento</h3>
          <p className="text-gray-500 text-sm">
            Necesitas configurar tus datos de nacimiento para continuar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle2 className="w-6 h-6 text-green-500" />
        <h3 className="text-lg font-semibold text-gray-800">Datos de Nacimiento</h3>
      </div>

      <div className="space-y-4">
        {/* Nombre */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <User className="w-5 h-5 text-purple-600" />
          <div>
            <p className="text-sm text-gray-500">Nombre completo</p>
            <p className="font-medium text-gray-800">{birthData.fullName}</p>
          </div>
        </div>

        {/* Fecha de nacimiento */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Calendar className="w-5 h-5 text-purple-600" />
          <div>
            <p className="text-sm text-gray-500">Fecha de nacimiento</p>
            <p className="font-medium text-gray-800">
              {new Date(birthData.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Hora de nacimiento */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Clock className="w-5 h-5 text-purple-600" />
          <div>
            <p className="text-sm text-gray-500">Hora de nacimiento</p>
            <p className="font-medium text-gray-800">{birthData.time || 'No especificada'}</p>
          </div>
        </div>

        {/* Lugar de nacimiento */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <MapPin className="w-5 h-5 text-purple-600" />
          <div>
            <p className="text-sm text-gray-500">Lugar de nacimiento</p>
            <p className="font-medium text-gray-800">{birthData.location || birthData.birthPlace}</p>
            {birthData.latitude && birthData.longitude && (
              <p className="text-xs text-gray-500 mt-1">
                Coordenadas: {birthData.latitude.toFixed(4)}, {birthData.longitude.toFixed(4)}
              </p>
            )}
          </div>
        </div>

        {/* Lugar actual (si es diferente) */}
        {!birthData.livesInSamePlace && birthData.currentPlace && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Home className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600">Lugar actual</p>
              <p className="font-medium text-gray-800">{birthData.currentPlace}</p>
            </div>
          </div>
        )}

        {/* Zona horaria */}
        {birthData.timezone && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Clock className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Zona horaria</p>
              <p className="font-medium text-gray-800">{birthData.timezone}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">Datos verificados y listos</span>
        </div>
        <p className="text-green-700 text-sm mt-1">
          Estos datos se usarán para generar tu agenda astrológica personalizada.
        </p>
      </div>
    </div>
  );
}
