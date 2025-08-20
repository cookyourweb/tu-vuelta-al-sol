// src/components/astrology/AstrologicalCalendar.tsx
// 📅 CALENDARIO ASTROLÓGICO CON SISTEMA DE CACHÉ INTELIGENTE

'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, Calendar, Star, Moon, Sun } from 'lucide-react';

interface Event {
  id: string;
  date: string;
  title: string;
  description: string;
  type: string;
  priority: string;
}

interface Props {
  userId: string;
}

export default function AstrologicalCalendar({ userId }: Props) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadEvents();
    }
  }, [userId]);

  const loadEvents = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Cargando eventos...');
      
      const response = await fetch('/api/astrology/complete-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId, months: 6 })
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Error en respuesta');
      }
      
      const rawEvents = data.data?.events || [];
      
      const processedEvents = rawEvents.map((event: any, index: number) => ({
        id: event.id || `event-${index}`,
        date: event.date || new Date().toISOString().split('T')[0],
        title: event.title || 'Evento',
        description: event.description || 'Sin descripción',
        type: event.type || 'general',
        priority: event.priority || 'medium'
      }));
      
      setEvents(processedEvents);
      console.log(`${processedEvents.length} eventos cargados`);
      
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      
      // Eventos de ejemplo
      setEvents([
        {
          id: '1',
          date: new Date().toISOString().split('T')[0],
          title: 'Luna Nueva',
          description: 'Evento de ejemplo',
          type: 'lunar',
          priority: 'high'
        },
        {
          id: '2',
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          title: 'Venus en Tauro',
          description: 'Evento de ejemplo',
          type: 'transit',
          priority: 'medium'
        }
      ]);
      
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'bg-red-500';
    if (priority === 'medium') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getIcon = (type: string) => {
    if (type.includes('luna')) return <Moon className="w-4 h-4" />;
    if (type.includes('sol')) return <Sun className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('es-ES');
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
            <h3 className="text-xl font-semibold text-indigo-600">Cargando...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-red-800 font-semibold">Error</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadEvents}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <Calendar className="w-6 h-6" />
              <span>Calendario Astrológico</span>
            </h2>
            <p className="text-indigo-100 mt-1">{events.length} eventos</p>
          </div>
          <button
            onClick={loadEvents}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Events */}
      <div className="p-6">
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg text-white ${getPriorityColor(event.priority)}`}>
                    {getIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-800">{event.title}</h4>
                      <span className="text-sm text-gray-500">{formatDate(event.date)}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">Sin eventos</h3>
            <button
              onClick={loadEvents}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Cargar Eventos
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="border-t bg-gray-50 px-6 py-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-indigo-600">{events.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {events.filter(e => e.priority === 'high').length}
            </div>
            <div className="text-sm text-gray-600">Alta</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {events.filter(e => e.type.includes('luna')).length}
            </div>
            <div className="text-sm text-gray-600">Lunares</div>
          </div>
        </div>
      </div>
    </div>
  );
}