'use client';

import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/context/StyleContext';
import {
  Moon, Sun, Star, Sparkles, Circle, PenLine,
  Flame, Target, Heart, Compass, ArrowRight,
  Calendar
} from 'lucide-react';

// ============ TIPOS ============
interface EventoMensual {
  dia: number;
  tipo: 'lunaLlena' | 'lunaNueva' | 'eclipse' | 'retrogrado' | 'ingreso' | 'especial';
  nombre: string;
  signo?: string;
  descripcionCorta: string;
}

// ============ EVENTOS DE ENERO 2026 ============
const eventosEnero2026: EventoMensual[] = [
  {
    dia: 6,
    tipo: 'ingreso',
    nombre: 'Venus → Piscis',
    signo: 'Piscis',
    descripcionCorta: 'El amor se vuelve compasivo. Conexiones espirituales.'
  },
  {
    dia: 13,
    tipo: 'lunaLlena',
    nombre: 'Luna Llena',
    signo: 'Cáncer',
    descripcionCorta: 'Culminación emocional. Hogar, raíces, límites familiares.'
  },
  {
    dia: 20,
    tipo: 'ingreso',
    nombre: 'Sol → Acuario',
    signo: 'Acuario',
    descripcionCorta: 'Temporada de innovación y comunidad.'
  },
  {
    dia: 29,
    tipo: 'lunaNueva',
    nombre: 'Luna Nueva',
    signo: 'Acuario',
    descripcionCorta: 'Siembra intenciones sobre libertad e innovación.'
  },
];

// ============ FUNCIONES AUXILIARES ============
const IconoEvento = ({ tipo, className = "w-4 h-4" }: { tipo: EventoMensual['tipo']; className?: string }) => {
  switch (tipo) {
    case 'lunaLlena':
      return <Circle className={className} fill="currentColor" />;
    case 'lunaNueva':
      return <Moon className={className} />;
    case 'eclipse':
      return <Sparkles className={className} />;
    case 'retrogrado':
      return <span className={`${className} font-bold`}>℞</span>;
    case 'ingreso':
      return <ArrowRight className={className} />;
    case 'especial':
      return <Star className={className} fill="currentColor" />;
    default:
      return <Circle className={className} />;
  }
};

const getEventoColors = (tipo: EventoMensual['tipo'], config: any) => {
  switch (tipo) {
    case 'lunaLlena':
      return {
        bg: 'bg-amber-100',
        border: 'border-amber-300',
        text: 'text-amber-800',
        icon: 'text-amber-600'
      };
    case 'lunaNueva':
      return {
        bg: 'bg-indigo-100',
        border: 'border-indigo-300',
        text: 'text-indigo-800',
        icon: 'text-indigo-600'
      };
    case 'ingreso':
      return {
        bg: 'bg-teal-100',
        border: 'border-teal-300',
        text: 'text-teal-800',
        icon: 'text-teal-600'
      };
    default:
      return {
        bg: 'bg-gray-100',
        border: 'border-gray-300',
        text: 'text-gray-800',
        icon: 'text-gray-600'
      };
  }
};

const generarSemanasCalendario = (mes: number, anio: number) => {
  const monthDate = new Date(anio, mes - 1, 1);
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });

  const weeks: Date[][] = [];
  let currentDay = calendarStart;

  while (currentDay <= monthEnd || weeks.length < 5) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(currentDay);
      currentDay = addDays(currentDay, 1);
    }
    weeks.push(week);
    if (weeks.length >= 6) break;
  }

  return { weeks, monthDate };
};

const nombresMeses = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
];

const diasSemana = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

// ============================================================
// ENERO 2026 - CALENDARIO COMPACTO
// ============================================================

export const EneroEstilo1: React.FC = () => {
  const { config } = useStyle();
  const { weeks, monthDate } = generarSemanasCalendario(1, 2026);

  const getEventoDelDia = (dia: number) => eventosEnero2026.find(e => e.dia === dia);

  return (
    <div className={`print-page bg-white p-4 flex flex-col ${config.pattern}`}>
      {/* Header compacto */}
      <div className="text-center mb-2">
        <div className="flex items-center justify-center gap-2 mb-0.5">
          <Star className={`w-4 h-4 ${config.iconSecondary}`} fill="currentColor" />
          <h1 className={`text-2xl font-display ${config.titleGradient}`}>
            ENERO 2026
          </h1>
          <Star className={`w-4 h-4 ${config.iconSecondary}`} fill="currentColor" />
        </div>
        <p className={`text-xs ${config.iconSecondary} italic`}>
          Mes de inicios y renovación · ♑ → ♒
        </p>
      </div>

      {/* Calendario Grid - Compacto */}
      <div className="mb-2 rounded-lg overflow-hidden border border-gray-200">
        {/* Días de la semana */}
        <div className={`grid grid-cols-7 ${config.headerBg}`}>
          {diasSemana.map((dia, idx) => (
            <div
              key={idx}
              className={`text-center py-1 text-[10px] font-bold ${config.headerText} border-r border-white/20 last:border-r-0`}
            >
              {dia}
            </div>
          ))}
        </div>

        {/* Semanas */}
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 border-t border-gray-200">
            {week.map((day, dayIdx) => {
              const isCurrentMonth = isSameMonth(day, monthDate);
              const dayNum = day.getDate();
              const evento = isCurrentMonth ? getEventoDelDia(dayNum) : null;
              const colors = evento ? getEventoColors(evento.tipo, config) : null;
              const isWeekend = dayIdx >= 5;

              return (
                <div
                  key={dayIdx}
                  className={`
                    min-h-[38px] p-0.5 border-r border-gray-100 last:border-r-0 relative
                    ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                    ${isWeekend && isCurrentMonth && !evento ? 'bg-gray-50/50' : ''}
                    ${evento ? `${colors?.bg} ${colors?.border} border` : ''}
                  `}
                >
                  {isCurrentMonth && (
                    <div className="h-full flex flex-col">
                      <span className={`
                        text-xs font-bold
                        ${evento ? colors?.text : isWeekend ? 'text-gray-400' : 'text-gray-700'}
                      `}>
                        {dayNum}
                      </span>
                      {evento && (
                        <div className="flex-1 flex flex-col items-center justify-center">
                          <div className={`${colors?.icon}`}>
                            <IconoEvento tipo={evento.tipo} className="w-3 h-3" />
                          </div>
                          <span className={`text-[8px] font-bold ${colors?.text} text-center leading-tight`}>
                            {evento.nombre.split(' ').slice(0, 2).join(' ')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Eventos del mes - Grid compacto 2 columnas */}
      <div className="grid grid-cols-2 gap-1.5 mb-2">
        {eventosEnero2026.map((evento, idx) => {
          const colors = getEventoColors(evento.tipo, config);
          return (
            <div
              key={idx}
              className={`p-2 rounded-md ${colors.bg} border ${colors.border}`}
            >
              <div className="flex items-start gap-1.5">
                <div className={`${colors.icon} mt-0.5`}>
                  <IconoEvento tipo={evento.tipo} className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-bold ${colors.text}`}>
                      {evento.dia} ENE
                    </span>
                    {evento.signo && (
                      <span className={`text-[10px] ${colors.text} opacity-70`}>
                        en {evento.signo}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs font-bold ${colors.text}`}>{evento.nombre}</p>
                  <p className={`text-[10px] ${colors.text} opacity-90 mt-0.5 leading-tight`}>
                    {evento.descripcionCorta}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lo que se activa este mes */}
      <div className={`${config.highlightSecondary} rounded-lg p-2.5`}>
        <div className="flex items-center gap-1.5 mb-2">
          <Flame className={`w-4 h-4 ${config.iconAccent}`} />
          <h3 className={`text-xs font-bold uppercase tracking-wide ${config.iconAccent}`}>
            Lo que se activa este mes
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-start gap-1.5">
            <Circle className={`w-1.5 h-1.5 ${config.iconSecondary} mt-1 flex-shrink-0`} fill="currentColor" />
            <div>
              <p className={`text-xs font-bold ${config.iconPrimary}`}>Inicio consciente</p>
              <p className="text-[10px] text-gray-600">Sin repetir automatismos</p>
            </div>
          </div>
          <div className="flex items-start gap-1.5">
            <Circle className={`w-1.5 h-1.5 ${config.iconSecondary} mt-1 flex-shrink-0`} fill="currentColor" />
            <div>
              <p className={`text-xs font-bold ${config.iconPrimary}`}>Coherencia</p>
              <p className="text-[10px] text-gray-600">Entre lo externo e interno</p>
            </div>
          </div>
        </div>
        <div className={`mt-2 pt-2 border-t border-current/10`}>
          <p className={`text-center italic ${config.iconSecondary} text-[10px]`}>
            "¿Desde dónde estoy arrancando: desde la exigencia o desde la coherencia?"
          </p>
        </div>
      </div>
    </div>
  );
};

// Exportar solo una versión para simplificar
export const EneroEstilo2 = EneroEstilo1;
export const EneroEstilo3 = EneroEstilo1;
