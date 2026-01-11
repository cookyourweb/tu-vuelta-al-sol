import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/context/StyleContext';
import { 
  Moon, Sun, Star, Sparkles, Circle, PenLine, 
  Flame, ArrowRight, Calendar
} from 'lucide-react';

// ============ TIPOS COMPARTIDOS ============
interface EventoMensual {
  dia: number;
  tipo: 'lunaLlena' | 'lunaNueva' | 'eclipse' | 'retrogrado' | 'ingreso' | 'especial';
  nombre: string;
  icono?: string;
}

interface EventoDia {
  titulo: string;
  tipo: 'lunaLlena' | 'lunaNueva' | 'eclipse' | 'retrogrado' | 'ingreso' | 'especial' | 'cumpleanos';
}

// ============ ICONOS ============
const IconoEvento = ({ tipo, className = "w-4 h-4" }: { tipo: string; className?: string }) => {
  switch (tipo) {
    case 'lunaLlena':
      return <Circle className={className} fill="currentColor" />;
    case 'lunaNueva':
      return <Moon className={className} />;
    case 'eclipse':
      return <Sparkles className={className} />;
    case 'cumpleanos':
      return <Sun className={className} />;
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

const getEventoColor = (tipo: string) => {
  switch (tipo) {
    case 'lunaLlena': return { bg: 'bg-amber-50', text: 'text-amber-700', accent: 'bg-amber-400' };
    case 'lunaNueva': return { bg: 'bg-indigo-50', text: 'text-indigo-700', accent: 'bg-indigo-400' };
    case 'eclipse': return { bg: 'bg-purple-50', text: 'text-purple-700', accent: 'bg-purple-400' };
    case 'cumpleanos': return { bg: 'bg-orange-50', text: 'text-orange-700', accent: 'bg-orange-400' };
    case 'retrogrado': return { bg: 'bg-rose-50', text: 'text-rose-700', accent: 'bg-rose-400' };
    case 'ingreso': return { bg: 'bg-teal-50', text: 'text-teal-700', accent: 'bg-teal-400' };
    case 'especial': return { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', accent: 'bg-fuchsia-400' };
    default: return { bg: 'bg-gray-50', text: 'text-gray-700', accent: 'bg-gray-400' };
  }
};

const nombresMeses = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
];

const diasSemana = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const diasSemanaFull = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

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

// ============================================================
// PROPUESTA 1: CALENDARIO MINIMALISTA CON LÍNEAS
// - Sin bordes exteriores, solo líneas divisorias sutiles
// - Eventos dentro de cada celda con indicador de color lateral
// - Máximo espacio para el contenido
// ============================================================

export const PropuestaCalendario1: React.FC = () => {
  const { config } = useStyle();
  const eventos: EventoMensual[] = [
    { dia: 2, tipo: 'especial', nombre: 'Quirón Directo' },
    { dia: 3, tipo: 'lunaLlena', nombre: 'Luna Llena ☽' },
    { dia: 18, tipo: 'lunaNueva', nombre: 'Luna Nueva ●' },
    { dia: 26, tipo: 'ingreso', nombre: 'Neptuno → Aries' },
  ];
  
  const { weeks, monthDate } = generarSemanasCalendario(1, 2026);
  const getEventoDelDia = (dia: number) => eventos.find(e => e.dia === dia);

  return (
    <div className={`print-page bg-white p-8 flex flex-col ${config.pattern}`}>
      {/* Header minimalista */}
      <div className="mb-6">
        <h1 className={`text-4xl font-display ${config.titleGradient} tracking-tight`}>
          ENERO 2026
        </h1>
        <p className={`text-sm ${config.iconSecondary} mt-1`}>
          Ordenar tu energía antes de exigir resultados
        </p>
      </div>

      {/* Calendario Grid - Sin bordes exteriores */}
      <div className="flex-1 flex flex-col">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 border-b-2 border-gray-200 pb-2 mb-2">
          {diasSemana.map((dia, idx) => (
            <div key={idx} className="text-center">
              <span className={`text-xs font-bold ${config.iconSecondary} uppercase`}>
                {dia}
              </span>
            </div>
          ))}
        </div>

        {/* Semanas */}
        <div className="flex-1 grid grid-rows-6">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 border-b border-gray-100 last:border-b-0">
              {week.map((day, dayIdx) => {
                const isCurrentMonth = isSameMonth(day, monthDate);
                const dayNum = day.getDate();
                const evento = isCurrentMonth ? getEventoDelDia(dayNum) : null;
                const colors = evento ? getEventoColor(evento.tipo) : null;
                
                return (
                  <div
                    key={dayIdx}
                    className={`
                      min-h-[70px] p-2 border-r border-gray-100 last:border-r-0
                      ${isCurrentMonth ? '' : 'opacity-30'}
                      ${evento ? colors?.bg : ''}
                    `}
                  >
                    <div className="flex items-start gap-1">
                      {evento && (
                        <div className={`w-1 h-8 ${colors?.accent} flex-shrink-0`} />
                      )}
                      <div className="flex-1">
                        <span className={`text-lg font-bold ${evento ? colors?.text : 'text-gray-800'}`}>
                          {dayNum}
                        </span>
                        {evento && (
                          <div className={`text-[10px] font-medium ${colors?.text} leading-tight mt-0.5`}>
                            {evento.nombre}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Activaciones - Footer compacto */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Flame className={`w-4 h-4 ${config.iconAccent}`} />
          <span className={`text-xs font-bold uppercase ${config.iconAccent}`}>Lo que se activa</span>
        </div>
        <div className="grid grid-cols-4 gap-4 text-xs text-gray-600">
          <div><strong className={config.iconPrimary}>Eje 4-10:</strong> Hogar vs Dirección</div>
          <div><strong className={config.iconPrimary}>Saturno-Urano:</strong> Cambios estables</div>
          <div><strong className={config.iconPrimary}>Stellium Cap:</strong> Enfoque metas</div>
          <div><strong className={config.iconPrimary}>Acuario 19:</strong> Nuevas perspectivas</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// PROPUESTA 2: CALENDARIO EDITORIAL CON EVENTOS LATERALES
// - Diseño tipo revista/editorial
// - Número grande, eventos como badges dentro de celdas
// - Columnas anchas sin bordes visibles
// ============================================================

export const PropuestaCalendario2: React.FC = () => {
  const { config } = useStyle();
  const eventos: EventoMensual[] = [
    { dia: 2, tipo: 'especial', nombre: 'Quirón Directo en Aries' },
    { dia: 3, tipo: 'lunaLlena', nombre: 'Luna Llena en Cáncer' },
    { dia: 18, tipo: 'lunaNueva', nombre: 'Luna Nueva en Capricornio' },
    { dia: 26, tipo: 'ingreso', nombre: 'Neptuno entra en Aries' },
  ];
  
  const { weeks, monthDate } = generarSemanasCalendario(1, 2026);
  const getEventoDelDia = (dia: number) => eventos.find(e => e.dia === dia);

  return (
    <div className={`print-page bg-white p-6 flex flex-col ${config.pattern}`}>
      {/* Header editorial */}
      <div className="flex items-baseline gap-4 mb-4 border-b-4 border-gray-900 pb-2">
        <span className={`text-6xl font-display font-bold ${config.titleGradient}`}>01</span>
        <div>
          <h1 className="text-2xl font-display tracking-widest text-gray-900">ENERO</h1>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Dos Mil Veintiséis</p>
        </div>
        <div className="ml-auto text-right">
          <p className={`text-sm italic ${config.iconSecondary}`}>
            "Ordenar tu energía antes de exigir resultados"
          </p>
        </div>
      </div>

      {/* Calendario Grid */}
      <div className="flex-1">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 mb-1">
          {diasSemanaFull.map((dia, idx) => (
            <div key={idx} className={`text-center py-1 ${idx >= 5 ? 'text-gray-400' : 'text-gray-700'}`}>
              <span className="text-[10px] font-bold uppercase tracking-widest">{dia}</span>
            </div>
          ))}
        </div>

        {/* Semanas */}
        <div className="flex-1">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7">
              {week.map((day, dayIdx) => {
                const isCurrentMonth = isSameMonth(day, monthDate);
                const dayNum = day.getDate();
                const evento = isCurrentMonth ? getEventoDelDia(dayNum) : null;
                const colors = evento ? getEventoColor(evento.tipo) : null;
                const isWeekend = dayIdx >= 5;
                
                return (
                  <div
                    key={dayIdx}
                    className={`
                      h-[80px] p-1.5 relative
                      ${isCurrentMonth ? '' : 'opacity-20'}
                    `}
                  >
                    {/* Background para eventos */}
                    {evento && (
                      <div className={`absolute inset-1 ${colors?.bg}`} />
                    )}
                    
                    <div className="relative z-10">
                      <span className={`
                        text-2xl font-light
                        ${evento ? colors?.text : isWeekend ? 'text-gray-300' : 'text-gray-700'}
                      `}>
                        {dayNum}
                      </span>
                      
                      {evento && (
                        <div className="mt-0.5">
                          <div className={`flex items-center gap-1 ${colors?.text}`}>
                            <IconoEvento tipo={evento.tipo} className="w-3 h-3" />
                            <span className="text-[9px] font-bold leading-tight">
                              {evento.nombre.split(' ').slice(0, 3).join(' ')}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Eventos detallados en footer */}
      <div className="mt-3 grid grid-cols-4 gap-3">
        {eventos.map((evento, idx) => {
          const colors = getEventoColor(evento.tipo);
          return (
            <div key={idx} className={`p-2 ${colors.bg}`}>
              <div className="flex items-center gap-1.5">
                <span className={`text-lg font-bold ${colors.text}`}>{evento.dia}</span>
                <IconoEvento tipo={evento.tipo} className={`w-4 h-4 ${colors.text}`} />
              </div>
              <p className={`text-[10px] font-medium ${colors.text} leading-tight`}>
                {evento.nombre}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// PROPUESTA 3: CALENDARIO FUNCIONAL MÁXIMO ESPACIO
// - Celdas muy grandes para escribir
// - Eventos como chips inline
// - Sin decoración, puramente funcional
// ============================================================

export const PropuestaCalendario3: React.FC = () => {
  const { config } = useStyle();
  const eventos: EventoMensual[] = [
    { dia: 2, tipo: 'especial', nombre: 'Quirón ⬆' },
    { dia: 3, tipo: 'lunaLlena', nombre: '○ Luna Llena' },
    { dia: 18, tipo: 'lunaNueva', nombre: '● Luna Nueva' },
    { dia: 26, tipo: 'ingreso', nombre: '♆ → Aries' },
  ];
  
  const { weeks, monthDate } = generarSemanasCalendario(1, 2026);
  const getEventoDelDia = (dia: number) => eventos.find(e => e.dia === dia);

  return (
    <div className={`print-page bg-white p-4 flex flex-col ${config.pattern}`}>
      {/* Header ultra-compacto */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-300">
        <h1 className={`text-3xl font-display font-bold ${config.titleGradient}`}>
          ENERO 2026
        </h1>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400"></span> Luna Llena</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-indigo-400"></span> Luna Nueva</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-teal-400"></span> Ingreso</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-fuchsia-400"></span> Especial</span>
        </div>
      </div>

      {/* Calendario - Máximo espacio */}
      <div className="flex-1 flex flex-col">
        {/* Header días */}
        <div className="grid grid-cols-7">
          {diasSemana.map((dia, idx) => (
            <div key={idx} className={`text-center py-1 text-[10px] font-bold text-gray-400 uppercase`}>
              {dia}
            </div>
          ))}
        </div>

        {/* Grid de días - Expandido */}
        <div className="flex-1 grid grid-rows-6">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 border-t border-gray-200 first:border-t-0">
              {week.map((day, dayIdx) => {
                const isCurrentMonth = isSameMonth(day, monthDate);
                const dayNum = day.getDate();
                const evento = isCurrentMonth ? getEventoDelDia(dayNum) : null;
                const colors = evento ? getEventoColor(evento.tipo) : null;
                
                return (
                  <div
                    key={dayIdx}
                    className={`
                      min-h-[85px] p-1 border-l border-gray-200 first:border-l-0
                      ${isCurrentMonth ? '' : 'bg-gray-50 opacity-40'}
                    `}
                  >
                    <div className="flex flex-col h-full">
                      {/* Número + evento en la misma línea */}
                      <div className="flex items-start justify-between">
                        <span className={`text-base font-bold ${evento ? colors?.text : 'text-gray-800'}`}>
                          {dayNum}
                        </span>
                        {evento && (
                          <div className={`w-2 h-2 ${colors?.accent}`} />
                        )}
                      </div>
                      
                      {/* Evento inline */}
                      {evento && (
                        <div className={`text-[9px] font-bold ${colors?.text} mt-0.5 leading-tight`}>
                          {evento.nombre}
                        </div>
                      )}
                      
                      {/* Espacio para escribir */}
                      <div className="flex-1 mt-1">
                        <div className="h-full border-b border-dotted border-gray-200" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer minimal */}
      <div className={`mt-2 pt-2 border-t border-gray-300 text-center`}>
        <p className={`text-xs italic ${config.iconSecondary}`}>
          ¿Desde dónde estoy arrancando: desde la exigencia o desde la coherencia?
        </p>
      </div>
    </div>
  );
};

// ============================================================
// PROPUESTA SEMANA 1: DÍAS AMPLIOS - EVENTOS INTEGRADOS
// - Cada día ocupa todo el ancho posible
// - Eventos dentro del día con color de fondo
// - Máximo espacio para escritura
// ============================================================

export const PropuestaSemana1: React.FC = () => {
  const { config } = useStyle();
  
  const dias = [
    { fecha: new Date(2026, 1, 9), evento: null },
    { fecha: new Date(2026, 1, 10), evento: { tipo: 'cumpleanos', titulo: 'RETORNO SOLAR' } as EventoDia },
    { fecha: new Date(2026, 1, 11), evento: null },
    { fecha: new Date(2026, 1, 12), evento: { tipo: 'lunaLlena', titulo: 'Luna Llena en Leo' } as EventoDia },
    { fecha: new Date(2026, 1, 13), evento: null },
    { fecha: new Date(2026, 1, 14), evento: null },
    { fecha: new Date(2026, 1, 15), evento: null },
  ];

  // Líneas de escritura por día
  const LineasEscritura = ({ count = 3 }: { count?: number }) => (
    <div className="flex-1 flex flex-col justify-start mt-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-5 border-b border-gray-200" />
      ))}
    </div>
  );

  return (
    <div className={`print-page bg-white p-6 flex flex-col h-full ${config.pattern}`}>
      {/* Header compacto */}
      <div className="flex items-baseline justify-between mb-4 pb-2 border-b-2 border-gray-400">
        <div className="flex items-baseline gap-3">
          <span className={`text-xs font-bold uppercase tracking-widest ${config.iconSecondary}`}>FEBRERO 2026</span>
          <h1 className={`text-xl font-display ${config.titleGradient}`}>Semana 2: 9-15 febrero</h1>
        </div>
        <p className={`text-xs italic ${config.iconSecondary}`}>Renacimiento Solar</p>
      </div>

      {/* Grid de días - ocupa toda la página */}
      <div className="flex-1 flex flex-col">
        {dias.map((dia, idx) => {
          const dayNum = dia.fecha.getDate();
          const dayName = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'][dia.fecha.getDay() === 0 ? 6 : dia.fecha.getDay() - 1];
          const colors = dia.evento ? getEventoColor(dia.evento.tipo) : null;
          
          return (
            <div
              key={idx}
              className={`flex-1 flex items-start border-b border-gray-200 last:border-b-0 min-h-[60px] ${colors ? colors.bg : ''}`}
            >
              {/* Indicador lateral de color */}
              {colors && <div className={`w-1 self-stretch ${colors.accent}`} />}
              
              {/* Fecha - alineada arriba */}
              <div className={`w-14 pt-1.5 flex flex-col items-center ${colors ? '' : ''}`}>
                <span className={`text-2xl font-bold leading-none ${colors ? colors.text : 'text-gray-800'}`}>{dayNum}</span>
                <span className={`text-[9px] uppercase mt-0.5 ${colors ? colors.text : 'text-gray-400'}`}>{dayName}</span>
              </div>
              
              {/* Contenido - alineado arriba con líneas */}
              <div className="flex-1 pt-1.5 pr-2 flex flex-col h-full">
                {dia.evento ? (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <IconoEvento tipo={dia.evento.tipo} className={`w-4 h-4 ${colors?.text}`} />
                      <span className={`text-sm font-bold ${colors?.text}`}>{dia.evento.titulo}</span>
                      {dia.evento.tipo === 'cumpleanos' && <span className="text-sm">🌟</span>}
                    </div>
                    <LineasEscritura count={2} />
                  </>
                ) : (
                  <LineasEscritura count={3} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer con espacio para notas - más compacto */}
      <div className="mt-3 pt-2 border-t border-gray-400">
        <div className="flex items-center gap-2 mb-2">
          <PenLine className={`w-3 h-3 ${config.iconSecondary}`} />
          <span className={`text-[10px] font-bold uppercase tracking-wider ${config.iconSecondary}`}>Notas de la semana</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="h-4 border-b border-gray-200" />
            <div className="h-4 border-b border-gray-200" />
          </div>
          <div>
            <div className="h-4 border-b border-gray-200" />
            <div className="h-4 border-b border-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// PROPUESTA SEMANA 2: 2 COLUMNAS EQUILIBRADAS
// - Días en columna izquierda con eventos integrados
// - Reflexiones y notas en columna derecha
// - Sin bordes, solo separadores sutiles
// ============================================================

export const PropuestaSemana2: React.FC = () => {
  const { config } = useStyle();
  
  const dias = [
    { fecha: new Date(2026, 1, 9), evento: null },
    { fecha: new Date(2026, 1, 10), evento: { tipo: 'cumpleanos', titulo: 'RETORNO SOLAR ☀' } as EventoDia },
    { fecha: new Date(2026, 1, 11), evento: null },
    { fecha: new Date(2026, 1, 12), evento: { tipo: 'lunaLlena', titulo: 'Luna Llena ○' } as EventoDia },
    { fecha: new Date(2026, 1, 13), evento: null },
    { fecha: new Date(2026, 1, 14), evento: null },
    { fecha: new Date(2026, 1, 15), evento: null },
  ];

  return (
    <div className={`print-page bg-white p-5 flex flex-col ${config.pattern}`}>
      {/* Header */}
      <div className="text-center mb-3 pb-2 border-b-2 border-gray-800">
        <div className={`text-xs font-bold uppercase tracking-[0.3em] ${config.iconSecondary}`}>FEBRERO</div>
        <h1 className={`text-3xl font-display ${config.titleGradient}`}>Semana 2</h1>
        <p className="text-sm text-gray-500">9 - 15 febrero 2026</p>
      </div>

      {/* 2 columnas */}
      <div className="flex-1 grid grid-cols-5 gap-4">
        {/* Columna izquierda - 3/5 */}
        <div className="col-span-3 flex flex-col">
          {dias.map((dia, idx) => {
            const dayNum = dia.fecha.getDate();
            const dayName = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][dia.fecha.getDay() === 0 ? 6 : dia.fecha.getDay() - 1];
            const colors = dia.evento ? getEventoColor(dia.evento.tipo) : null;
            
            return (
              <div
                key={idx}
                className={`flex-1 flex border-b border-gray-100 last:border-b-0 ${colors ? colors.bg : ''}`}
              >
                {/* Barra de color */}
                {colors && <div className={`w-1.5 ${colors.accent}`} />}
                
                {/* Fecha y día */}
                <div className="w-20 py-2 px-2 flex items-center gap-2">
                  <span className={`text-xl font-bold ${colors ? colors.text : 'text-gray-800'}`}>{dayNum}</span>
                  <span className={`text-[9px] uppercase ${colors ? colors.text : 'text-gray-400'}`}>{dayName.slice(0,3)}</span>
                </div>
                
                {/* Evento o línea para escribir */}
                <div className="flex-1 py-2 pr-2 flex items-center">
                  {dia.evento ? (
                    <div className="flex items-center gap-2">
                      <IconoEvento tipo={dia.evento.tipo} className={`w-4 h-4 ${colors?.text}`} />
                      <span className={`text-sm font-bold ${colors?.text}`}>{dia.evento.titulo}</span>
                    </div>
                  ) : (
                    <div className="w-full border-b border-dotted border-gray-300" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Columna derecha - 2/5 */}
        <div className="col-span-2 flex flex-col gap-3">
          {/* Propósito */}
          <div className={`${config.highlightPrimary} p-3`}>
            <h3 className={`text-[10px] font-bold uppercase ${config.iconPrimary} mb-1`}>Propósito de la semana</h3>
            <p className="text-xs text-gray-700 italic">Renacimiento Solar. Tu nuevo ciclo personal comienza.</p>
          </div>
          
          {/* Eventos */}
          <div className={`${config.highlightSecondary} p-3`}>
            <h3 className={`text-[10px] font-bold uppercase ${config.iconSecondary} mb-2`}>Eventos activos</h3>
            <div className="space-y-2 text-xs">
              <div className={`p-2 ${getEventoColor('cumpleanos').bg}`}>
                <span className={`font-bold ${getEventoColor('cumpleanos').text}`}>10 Feb · Retorno Solar</span>
                <p className="text-gray-600 mt-0.5">Tu nuevo año personal comienza</p>
              </div>
              <div className={`p-2 ${getEventoColor('lunaLlena').bg}`}>
                <span className={`font-bold ${getEventoColor('lunaLlena').text}`}>12 Feb · Luna Llena en Leo</span>
                <p className="text-gray-600 mt-0.5">Culminación creativa y expresión</p>
              </div>
            </div>
          </div>
          
          {/* Notas */}
          <div className="flex-1 flex flex-col">
            <h3 className={`text-[10px] font-bold uppercase ${config.iconSecondary} mb-1`}>Notas</h3>
            <div className="flex-1 space-y-3">
              <div className="border-b border-dotted border-gray-300" />
              <div className="border-b border-dotted border-gray-300" />
              <div className="border-b border-dotted border-gray-300" />
              <div className="border-b border-dotted border-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// PROPUESTA SEMANA 3: TABLA LIMPIA SIN BORDES
// - Grid tipo tabla sin bordes visibles
// - Eventos como tags de color dentro de celda
// - Ultra funcional para escribir
// ============================================================

export const PropuestaSemana3: React.FC = () => {
  const { config } = useStyle();
  
  const dias = [
    { fecha: new Date(2026, 1, 9), evento: null },
    { fecha: new Date(2026, 1, 10), evento: { tipo: 'cumpleanos', titulo: '☀ Retorno Solar' } as EventoDia },
    { fecha: new Date(2026, 1, 11), evento: null },
    { fecha: new Date(2026, 1, 12), evento: { tipo: 'lunaLlena', titulo: '○ Luna Llena Leo' } as EventoDia },
    { fecha: new Date(2026, 1, 13), evento: null },
    { fecha: new Date(2026, 1, 14), evento: null },
    { fecha: new Date(2026, 1, 15), evento: null },
  ];

  return (
    <div className={`print-page bg-white p-6 flex flex-col ${config.pattern}`}>
      {/* Header en línea */}
      <div className="flex items-baseline gap-3 mb-4">
        <h1 className={`text-4xl font-display font-bold ${config.titleGradient}`}>S2</h1>
        <div className="flex-1">
          <span className="text-lg text-gray-800">9 - 15 febrero 2026</span>
          <span className={`ml-3 text-sm ${config.iconSecondary}`}>· Renacimiento Solar</span>
        </div>
      </div>

      {/* Grid de días - Ocupa toda la página */}
      <div className="flex-1 flex flex-col">
        {dias.map((dia, idx) => {
          const dayNum = dia.fecha.getDate();
          const dayName = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'][dia.fecha.getDay() === 0 ? 6 : dia.fecha.getDay() - 1];
          const colors = dia.evento ? getEventoColor(dia.evento.tipo) : null;
          
          return (
            <div
              key={idx}
              className="flex-1 flex items-stretch"
            >
              {/* Fecha compacta */}
              <div className="w-14 flex items-center justify-center gap-1 text-gray-400">
                <span className="text-xl font-bold text-gray-700">{dayNum}</span>
                <span className="text-[9px] uppercase">{dayName}</span>
              </div>
              
              {/* Contenido del día */}
              <div className={`flex-1 border-l-2 ${colors ? colors.accent.replace('bg-', 'border-') : 'border-gray-100'} pl-3 py-2 flex flex-col justify-center`}>
                {dia.evento ? (
                  <div className={`inline-flex items-center gap-2 ${colors?.bg} px-2 py-1 self-start`}>
                    <span className={`text-sm font-bold ${colors?.text}`}>{dia.evento.titulo}</span>
                  </div>
                ) : null}
                
                {/* Líneas para escribir */}
                <div className="mt-1 space-y-2 flex-1">
                  <div className="border-b border-dotted border-gray-200" />
                  <div className="border-b border-dotted border-gray-200" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ejercicios de la semana - Compacto */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1">
            <h3 className={`text-[10px] font-bold uppercase ${config.iconAccent} mb-1`}>Ejercicio de la semana</h3>
            <p className="text-xs text-gray-600">Escribe lo que sueltas del ciclo anterior y lo que invitas al nuevo.</p>
          </div>
          <div className="w-1/3">
            <h3 className={`text-[10px] font-bold uppercase ${config.iconSecondary} mb-1`}>Mantra</h3>
            <p className={`text-xs italic ${config.iconPrimary}`}>"Este año viene a reordenarme"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ EXPORTAR DEMO ============
export const DemoTodasPropuestas: React.FC = () => (
  <>
    <PropuestaCalendario1 />
    <PropuestaCalendario2 />
    <PropuestaCalendario3 />
    <PropuestaSemana1 />
    <PropuestaSemana2 />
    <PropuestaSemana3 />
  </>
);

export default DemoTodasPropuestas;
