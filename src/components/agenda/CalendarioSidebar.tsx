// src/components/agenda/CalendarioSidebar.tsx
'use client';

import React from 'react';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import AgendaBookGenerator from './AgendaBookGenerator';
import type { AstrologicalEvent } from '@/types/astrology/unified-types';

interface PlanetCard {
  planet: string;
  prioridad: 1 | 2 | 3;
  traduccion_practica: string;
}

interface CalendarioSidebarProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  setCurrentMonth: (date: Date) => void;
  events: AstrologicalEvent[];
  setSelectedDayEvents: (events: AstrologicalEvent[]) => void;
  selectedDayEvents: AstrologicalEvent[];
  activePlanets: PlanetCard[];
  loadingActivePlanets: boolean;
  handleEventClick: (event: AstrologicalEvent) => void;
  getEventIcon: (type: string, priority: string) => string;
  handleEventHover: (event: AstrologicalEvent, e: React.MouseEvent) => void;
  handleEventLeave: () => void;
  getEventColor: (type: string, priority: string) => string;
}

export default function CalendarioSidebar({
  selectedDate,
  setSelectedDate,
  setCurrentMonth,
  events,
  setSelectedDayEvents,
  selectedDayEvents,
  activePlanets,
  loadingActivePlanets,
  handleEventClick,
  getEventIcon,
  handleEventHover,
  handleEventLeave,
  getEventColor
}: CalendarioSidebarProps) {

  const currentYear = new Date().getFullYear();

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-8 space-y-6">
        {/* 📅 SELECTOR DE FECHA */}
        <div className="bg-gradient-to-r from-yellow-600/30 to-orange-600/30 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/30">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center">
            <span className="mr-2">📅</span>
            Ir a una fecha
          </h3>
          <input
            type="date"
            value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              setSelectedDate(newDate);
              setCurrentMonth(newDate);
              // Buscar eventos del día seleccionado
              const dayEvents = events.filter(event =>
                isSameDay(new Date(event.date), newDate)
              );
              setSelectedDayEvents(dayEvents);
            }}
            className="w-full px-4 py-3 rounded-lg bg-purple-900/50 border border-yellow-400/30 text-white font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
        </div>

        {/* 🪐 PLANETAS ACTIVOS DEL AÑO */}
        {loadingActivePlanets ? (
          <div className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          </div>
        ) : activePlanets.length > 0 && (
          <div className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center">
              <span className="mr-2">🪐</span>
              Planetas Activos {currentYear}
            </h3>
            <div className="space-y-3">
              {activePlanets.filter(p => p.prioridad === 1).slice(0, 3).map((planet, idx) => (
                <div key={idx} className="bg-purple-900/40 rounded-lg p-3 border border-purple-400/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-bold text-sm">{planet.planet}</span>
                    <span className="text-xs text-yellow-400 font-semibold">⭐ Alta</span>
                  </div>
                  <p className="text-purple-200 text-xs line-clamp-2">
                    {planet.traduccion_practica}
                  </p>
                </div>
              ))}
              {activePlanets.length > 3 && (
                <p className="text-purple-300 text-xs text-center mt-2">
                  + {activePlanets.length - 3} planetas más activos
                </p>
              )}
            </div>
          </div>
        )}

        {/* 📖 AGENDA IMPRIMIBLE */}
        <div className="bg-gradient-to-r from-green-600/30 to-emerald-600/30 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center">
            <span className="mr-2">📖</span>
            Tu Agenda Física
          </h3>
          <div className="space-y-3">
            <AgendaBookGenerator />
            <button
              onClick={() => window.print()}
              className="w-full bg-gradient-to-r from-green-500/80 to-emerald-500/80 hover:from-green-400/90 hover:to-emerald-400/90 transition-all duration-200 shadow-lg hover:shadow-green-500/25 border border-white/10 p-3 rounded-lg group"
              title="Imprimir agenda actual"
            >
              <svg className="h-5 w-5 text-white group-hover:scale-110 transition-transform inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span className="text-sm font-semibold">Imprimir Vista Actual</span>
            </button>
          </div>
        </div>

        {/* Header del sidebar - Día seleccionado */}
        <div className="bg-gradient-to-r from-pink-600/30 to-purple-600/30 backdrop-blur-sm rounded-2xl p-6 border border-pink-400/30">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center">
            <span className="mr-3">🌙</span>
            {selectedDate
              ? `${selectedDate.getDate()} de ${format(selectedDate, 'MMMM', { locale: es })}`
              : 'Selecciona un día'
            }
          </h3>
          <p className="text-pink-200 text-sm">
            {selectedDayEvents.length === 0
              ? 'Haz click en un día para ver sus eventos'
              : `${selectedDayEvents.length} evento${selectedDayEvents.length > 1 ? 's' : ''} cósmico${selectedDayEvents.length > 1 ? 's' : ''}`
            }
          </p>
        </div>

        {/* Lista de eventos */}
        {selectedDayEvents.length > 0 && (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {selectedDayEvents.map((event) => (
              <div
                key={event.id}
                className={`
                  bg-gradient-to-r ${getEventColor(event.type, event.priority)}/20 backdrop-blur-sm
                  rounded-2xl p-4 border border-white/20 hover:shadow-lg transition-all duration-200
                  cursor-pointer hover:scale-105
                `}
                onClick={() => handleEventClick(event)}
                onMouseEnter={(e) => handleEventHover(event, e)}
                onMouseLeave={handleEventLeave}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getEventIcon(event.type, event.priority)}</span>
                    <div>
                      <h4 className="font-bold text-white text-sm lg:text-base">{event.title}</h4>
                      {event.planet && event.sign && (
                        <p className="text-purple-200 text-xs">{event.planet} en {event.sign}</p>
                      )}
                    </div>
                  </div>
                  {event.priority === 'high' && (
                    <span className="bg-red-500/80 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      CRÍTICO
                    </span>
                  )}
                </div>

                <p className="text-gray-200 text-sm mb-3 line-clamp-2">{event.description}</p>

                <div className="text-purple-300 text-xs italic">
                  Click para ver interpretación completa ✨
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
