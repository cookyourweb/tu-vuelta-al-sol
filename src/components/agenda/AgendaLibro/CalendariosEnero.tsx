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

interface EventoDia {
  titulo: string;
  tipo: 'lunaLlena' | 'lunaNueva' | 'eclipse' | 'retrogrado' | 'ingreso' | 'especial';
  descripcion?: string;
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
const IconoEvento = ({ tipo, className = "w-4 h-4" }: { tipo: EventoMensual['tipo'] | EventoDia['tipo']; className?: string }) => {
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

const getEventoColors = (tipo: EventoMensual['tipo'] | EventoDia['tipo']) => {
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

const diasSemana = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
const diasSemanaCortos = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

// ============================================================
// ESTILO 1: CALENDARIO MENSUAL COMPACTO
// Grid mensual completo con eventos abajo
// ============================================================

export const EneroEstilo1: React.FC = () => {
  const { config } = useStyle();
  const { weeks, monthDate } = generarSemanasCalendario(1, 2026);

  const getEventoDelDia = (dia: number) => eventosEnero2026.find(e => e.dia === dia);

  return (
    <div className={`print-page bg-white p-6 flex flex-col ${config.pattern}`}>
      {/* Header compacto */}
      <div className="text-center mb-3">
        <div className="flex items-center justify-center gap-3 mb-1">
          <Star className={`w-4 h-4 ${config.iconSecondary}`} fill="currentColor" />
          <h1 className={`text-2xl font-display ${config.titleGradient}`}>
            ENERO 2026
          </h1>
          <Star className={`w-4 h-4 ${config.iconSecondary}`} fill="currentColor" />
        </div>
        <p className={`text-[10px] ${config.iconSecondary} italic`}>
          Mes de inicios y renovación · ♑ → ♒
        </p>
      </div>

      {/* Calendario Grid - Compacto */}
      <div className="mb-3 rounded-lg overflow-hidden border border-gray-200">
        {/* Días de la semana */}
        <div className={`grid grid-cols-7 ${config.headerBg}`}>
          {diasSemanaCortos.map((dia, idx) => (
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
          <div key={weekIdx} className="grid grid-cols-7 border-t border-gray-200" style={{ height: '36px' }}>
            {week.map((day, dayIdx) => {
              const isCurrentMonth = isSameMonth(day, monthDate);
              const dayNum = day.getDate();
              const evento = isCurrentMonth ? getEventoDelDia(dayNum) : null;
              const colors = evento ? getEventoColors(evento.tipo) : null;
              const isWeekend = dayIdx >= 5;

              return (
                <div
                  key={dayIdx}
                  className={`
                    p-1 border-r border-gray-100 last:border-r-0 relative flex items-start
                    ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                    ${isWeekend && isCurrentMonth && !evento ? 'bg-gray-50/50' : ''}
                    ${evento ? `${colors?.bg}` : ''}
                  `}
                >
                  {isCurrentMonth && (
                    <>
                      <span className={`
                        text-xs font-bold
                        ${evento ? colors?.text : isWeekend ? 'text-gray-400' : 'text-gray-700'}
                      `}>
                        {dayNum}
                      </span>
                      {evento && (
                        <div className={`absolute bottom-0.5 right-0.5 ${colors?.icon}`}>
                          <IconoEvento tipo={evento.tipo} className="w-2 h-2" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Eventos del mes - Grid compacto 2 columnas */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        {eventosEnero2026.map((evento, idx) => {
          const colors = getEventoColors(evento.tipo);
          return (
            <div
              key={idx}
              className={`p-2 rounded ${colors.bg} border ${colors.border}`}
            >
              <div className="flex items-start gap-1">
                <div className={`${colors.icon} mt-0.5`}>
                  <IconoEvento tipo={evento.tipo} className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className={`text-[10px] font-bold ${colors.text}`}>
                      {evento.dia} ENE
                    </span>
                  </div>
                  <p className={`text-[11px] font-bold ${colors.text} leading-tight`}>{evento.nombre}</p>
                  <p className={`text-[9px] ${colors.text} opacity-90 leading-tight`}>
                    {evento.descripcionCorta}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lo que se activa este mes */}
      <div className={`${config.highlightSecondary} rounded-lg p-3`}>
        <div className="flex items-center gap-2 mb-2">
          <Flame className={`w-4 h-4 ${config.iconAccent}`} />
          <h3 className={`text-[10px] font-bold uppercase tracking-wide ${config.iconAccent}`}>
            Lo que se activa este mes
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-start gap-1">
            <Circle className={`w-1.5 h-1.5 ${config.iconSecondary} mt-1 flex-shrink-0`} fill="currentColor" />
            <p className="text-[10px] text-gray-700"><span className="font-bold">Inicio consciente:</span> Sin repetir automatismos</p>
          </div>
          <div className="flex items-start gap-1">
            <Circle className={`w-1.5 h-1.5 ${config.iconSecondary} mt-1 flex-shrink-0`} fill="currentColor" />
            <p className="text-[10px] text-gray-700"><span className="font-bold">Coherencia:</span> Entre lo externo e interno</p>
          </div>
        </div>
        <div className={`mt-2 pt-2 border-t border-current/10`}>
          <p className={`text-center italic ${config.iconSecondary} text-[9px]`}>
            "¿Desde dónde estoy arrancando: desde la exigencia o desde la coherencia?"
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ESTILO 2: SEMANA DETALLADA CON 2 COLUMNAS
// Días izquierda, eventos y notas derecha
// ============================================================

export const EneroEstilo2: React.FC = () => {
  const { config } = useStyle();

  // Semana 12-18 enero (incluye Luna Llena)
  const semana = [
    { fecha: new Date(2026, 0, 12), dia: 'LUN', evento: null },
    {
      fecha: new Date(2026, 0, 13),
      dia: 'MAR',
      evento: {
        titulo: 'Luna Llena en Cáncer',
        tipo: 'lunaLlena' as const,
        descripcion: 'Culminación emocional. Observa qué necesitas soltar.'
      }
    },
    { fecha: new Date(2026, 0, 14), dia: 'MIÉ', evento: null },
    { fecha: new Date(2026, 0, 15), dia: 'JUE', evento: null },
    { fecha: new Date(2026, 0, 16), dia: 'VIE', evento: null },
    { fecha: new Date(2026, 0, 17), dia: 'SÁB', evento: null },
    { fecha: new Date(2026, 0, 18), dia: 'DOM', evento: null },
  ];

  return (
    <div className={`print-page bg-white p-6 flex flex-col ${config.pattern}`}>
      {/* Header */}
      <div className="mb-3 pb-2 border-b border-gray-800">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[9px] text-gray-500 uppercase tracking-wider">Enero 2026</span>
            <h1 className={`text-lg font-display ${config.titleGradient}`}>
              Semana 2 · 12-18 enero
            </h1>
          </div>
          <span className="text-[8px] italic text-gray-600">Semana de culminación</span>
        </div>
      </div>

      {/* Layout 2 columnas */}
      <div className="flex-1 flex gap-3">
        {/* COLUMNA IZQUIERDA: Días (40%) */}
        <div className="w-[40%] flex flex-col">
          {semana.map((dia, idx) => {
            const numDia = dia.fecha.getDate();
            const tieneEvento = dia.evento !== null;
            const colors = tieneEvento && dia.evento ? getEventoColors(dia.evento.tipo) : null;

            return (
              <div
                key={idx}
                className={`
                  flex-1 flex items-center border-b border-gray-200 last:border-b-0 px-1
                  ${tieneEvento && colors ? `border-l-2 ${colors.border}` : ''}
                `}
              >
                <div className="flex items-center gap-2 flex-1">
                  <div className="text-center">
                    <div className={`text-base font-bold ${tieneEvento ? 'text-gray-800' : 'text-gray-600'}`}>
                      {numDia}
                    </div>
                    <div className="text-[8px] uppercase text-gray-500">{dia.dia}</div>
                  </div>
                  {tieneEvento && colors && (
                    <div className={`flex-1 ${colors.bg} rounded px-1 py-0.5`}>
                      <div className="flex items-center gap-1">
                        <IconoEvento tipo={dia.evento!.tipo} className={`w-2 h-2 ${colors.icon}`} />
                        <span className={`text-[8px] font-bold ${colors.text}`}>
                          {dia.evento!.titulo}
                        </span>
                      </div>
                    </div>
                  )}
                  {!tieneEvento && (
                    <div className="flex-1 border-b border-dotted border-gray-300" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* COLUMNA DERECHA: Eventos y reflexiones (60%) */}
        <div className="w-[60%] border-l border-gray-300 pl-3 flex flex-col">
          <h3 className="text-[9px] font-bold uppercase text-gray-700 mb-2">
            Eventos de la semana
          </h3>

          <div className="space-y-2 mb-2">
            {semana.filter(d => d.evento).map((dia, idx) => {
              const colors = getEventoColors(dia.evento!.tipo);
              return (
                <div key={idx} className={`border-l-2 ${colors.border} pl-2`}>
                  <div className="mb-0.5">
                    <span className="text-xs font-bold text-gray-800">
                      {dia.fecha.getDate()}
                    </span>
                    <span className={`text-[9px] font-bold ${colors.text} ml-1`}>
                      {dia.evento!.titulo}
                    </span>
                  </div>
                  <p className="text-[8px] text-gray-600 leading-snug">
                    {dia.evento!.descripcion}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Espacio para notas personales */}
          <div className="flex-1 pt-2 border-t border-gray-300">
            <h4 className="text-[8px] font-bold uppercase text-gray-600 mb-1">
              Tus notas y reflexiones
            </h4>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="h-2.5 border-b border-dotted border-gray-300" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ESTILO 3: MINI CALENDARIO + EVENTOS DESTACADOS
// Vista general compacta + detalles de eventos principales
// ============================================================

export const EneroEstilo3: React.FC = () => {
  const { config } = useStyle();
  const { weeks, monthDate } = generarSemanasCalendario(1, 2026);

  const getEventoDelDia = (dia: number) => eventosEnero2026.find(e => e.dia === dia);

  return (
    <div className={`print-page bg-white p-6 flex flex-col ${config.pattern}`}>
      {/* Header */}
      <div className="mb-3">
        <h1 className={`text-2xl font-display ${config.titleGradient} mb-0.5`}>
          ENERO 2026
        </h1>
        <p className="text-[9px] text-gray-500 italic">
          Vista general + eventos clave
        </p>
      </div>

      {/* Mini calendario mensual - muy compacto */}
      <div className="mb-3 pb-3 border-b border-gray-300">
        <div className="grid grid-cols-7 gap-px bg-gray-200 p-0.5 rounded">
          {diasSemanaCortos.map((dia, idx) => (
            <div key={idx} className="text-center bg-white py-0.5">
              <span className="text-[8px] font-bold text-gray-500">{dia}</span>
            </div>
          ))}
          {weeks.slice(0, 35).map((week, weekIdx) =>
            week.map((day, dayIdx) => {
              const isCurrentMonth = isSameMonth(day, monthDate);
              const evento = isCurrentMonth ? getEventoDelDia(day.getDate()) : null;
              const dayNum = day.getDate();

              return (
                <div
                  key={`${weekIdx}-${dayIdx}`}
                  className={`
                    text-center py-1 bg-white
                    ${isCurrentMonth ? '' : 'opacity-40'}
                  `}
                >
                  <span className={`text-[9px] ${evento ? 'font-bold' : 'font-normal'} ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}`}>
                    {dayNum}
                  </span>
                  {evento && <div className={`w-1 h-1 rounded-full mx-auto mt-0.5 ${getEventoColors(evento.tipo).icon}`} style={{backgroundColor: 'currentColor'}} />}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Eventos destacados */}
      <div className="space-y-2 mb-3">
        {eventosEnero2026.filter(e => e.tipo === 'lunaLlena' || e.tipo === 'lunaNueva').map((evento, idx) => {
          const colors = getEventoColors(evento.tipo);
          return (
            <div key={idx} className={`${colors.bg} border ${colors.border} rounded-lg p-3`}>
              <div className="flex items-start gap-2 mb-1">
                <div className={`w-8 h-8 rounded-full ${colors.bg} border-2 ${colors.border} flex items-center justify-center flex-shrink-0`}>
                  <IconoEvento tipo={evento.tipo} className={`w-4 h-4 ${colors.icon}`} />
                </div>
                <div>
                  <h3 className={`${colors.text} font-bold text-sm`}>{evento.nombre}</h3>
                  <span className={`text-[9px] ${colors.text} opacity-70`}>
                    {evento.dia} de enero en {evento.signo}
                  </span>
                </div>
              </div>
              <p className={`text-[10px] ${colors.text} opacity-90 pl-10 leading-tight`}>
                {evento.descripcionCorta}
              </p>
            </div>
          );
        })}
      </div>

      {/* Otros eventos */}
      <div className="pt-2 border-t border-gray-400">
        <h3 className="text-[9px] font-bold text-gray-700 uppercase mb-2">
          Otros eventos del mes
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          {eventosEnero2026.filter(e => e.tipo !== 'lunaLlena' && e.tipo !== 'lunaNueva').map((evento, idx) => (
            <div key={idx} className="text-[9px] flex items-center gap-1">
              <span className="font-bold text-gray-800">{evento.dia}</span>
              <span className="text-gray-600">{evento.nombre}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Espacio para notas */}
      <div className="mt-3 flex-1 border-t border-gray-300 pt-2">
        <h4 className="text-[8px] font-bold uppercase text-gray-600 mb-1">
          Notas del mes
        </h4>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-2.5 border-b border-dotted border-gray-300" />
        ))}
      </div>
    </div>
  );
};
