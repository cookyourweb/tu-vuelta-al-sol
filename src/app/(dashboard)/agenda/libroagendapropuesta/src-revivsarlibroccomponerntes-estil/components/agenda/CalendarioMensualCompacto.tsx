import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/contexts/StyleContext';
import { 
  Moon, Sun, Star, Sparkles, Circle, Flame,
  ArrowRight, Compass, Heart, Target
} from 'lucide-react';

// ============ TIPOS ============
interface EventoMensual {
  dia: number;
  tipo: 'lunaLlena' | 'lunaNueva' | 'eclipse' | 'retrogrado' | 'ingreso' | 'especial';
  nombre: string;
  signo?: string;
  casa?: string;
  descripcionCorta: string;
}

interface CalendarioMensualCompactoProps {
  mes: number;
  anio: number;
  eventos: EventoMensual[];
  tema: string;
  preguntaGuia: string;
  loQueSeActiva: {
    titulo: string;
    descripcion: string;
  }[];
}

// ============ ICONOS ASTROLÓGICOS ============
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

// ============ COLORES POR TIPO ============
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
    case 'eclipse':
      return {
        bg: 'bg-purple-100',
        border: 'border-purple-300',
        text: 'text-purple-800',
        icon: 'text-purple-600'
      };
    case 'retrogrado':
      return {
        bg: 'bg-rose-100',
        border: 'border-rose-300',
        text: 'text-rose-800',
        icon: 'text-rose-600'
      };
    case 'ingreso':
      return {
        bg: 'bg-teal-100',
        border: 'border-teal-300',
        text: 'text-teal-800',
        icon: 'text-teal-600'
      };
    case 'especial':
      return {
        bg: 'bg-fuchsia-100',
        border: 'border-fuchsia-300',
        text: 'text-fuchsia-800',
        icon: 'text-fuchsia-600'
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

// ============ GENERAR SEMANAS ============
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

// ============ COMPONENTE PRINCIPAL ============
export const CalendarioMensualCompacto: React.FC<CalendarioMensualCompactoProps> = ({
  mes,
  anio,
  eventos,
  tema,
  preguntaGuia,
  loQueSeActiva,
}) => {
  const { config } = useStyle();
  const { weeks, monthDate } = generarSemanasCalendario(mes, anio);
  
  const getEventoDelDia = (dia: number) => eventos.find(e => e.dia === dia);

  return (
    <div className={`print-page bg-white p-6 flex flex-col ${config.pattern}`}>
      {/* Header compacto */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-3 mb-1">
          <Star className={`w-5 h-5 ${config.iconSecondary}`} fill="currentColor" />
          <h1 className={`text-3xl font-display ${config.titleGradient}`}>
            {nombresMeses[mes - 1]} {anio}
          </h1>
          <Star className={`w-5 h-5 ${config.iconSecondary}`} fill="currentColor" />
        </div>
        <p className={`text-sm ${config.iconSecondary} italic`}>{tema}</p>
      </div>

      {/* Calendario Grid - Compacto */}
      <div className="mb-4 rounded-xl overflow-hidden border-2 border-gray-200">
        {/* Días de la semana */}
        <div className={`grid grid-cols-7 ${config.headerBg}`}>
          {diasSemana.map((dia, idx) => (
            <div
              key={idx}
              className={`text-center py-2 text-xs font-bold ${config.headerText} border-r border-white/20 last:border-r-0`}
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
                    min-h-[52px] p-1 border-r border-gray-100 last:border-r-0 relative
                    ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                    ${isWeekend && isCurrentMonth && !evento ? 'bg-gray-50/50' : ''}
                    ${evento ? `${colors?.bg} ${colors?.border} border-2` : ''}
                  `}
                >
                  {isCurrentMonth && (
                    <div className="h-full flex flex-col">
                      <span className={`
                        text-sm font-bold
                        ${evento ? colors?.text : isWeekend ? 'text-gray-400' : 'text-gray-700'}
                      `}>
                        {dayNum}
                      </span>
                      {evento && (
                        <div className="flex-1 flex flex-col items-center justify-center">
                          <div className={`${colors?.icon}`}>
                            <IconoEvento tipo={evento.tipo} className="w-4 h-4" />
                          </div>
                          <span className={`text-[9px] font-bold ${colors?.text} text-center leading-tight mt-0.5`}>
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

      {/* Eventos del mes - Lista compacta */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {eventos.map((evento, idx) => {
          const colors = getEventoColors(evento.tipo, config);
          return (
            <div
              key={idx}
              className={`p-3 rounded-lg ${colors.bg} border ${colors.border}`}
            >
              <div className="flex items-start gap-2">
                <div className={`${colors.icon} mt-0.5`}>
                  <IconoEvento tipo={evento.tipo} className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold ${colors.text}`}>
                      {evento.dia} {nombresMeses[mes - 1].toLowerCase()}
                    </span>
                    {evento.signo && (
                      <span className={`text-xs ${colors.text} opacity-70`}>
                        en {evento.signo}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm font-bold ${colors.text}`}>{evento.nombre}</p>
                  {evento.casa && (
                    <span className={`text-[10px] ${colors.text} opacity-80`}>
                      Casa {evento.casa}
                    </span>
                  )}
                  <p className={`text-xs ${colors.text} opacity-90 mt-1 leading-tight`}>
                    {evento.descripcionCorta}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lo que se activa este mes */}
      <div className={`${config.highlightSecondary} rounded-xl p-4`}>
        <div className="flex items-center gap-2 mb-3">
          <Flame className={`w-5 h-5 ${config.iconAccent}`} />
          <h3 className={`text-sm font-bold uppercase tracking-wide ${config.iconAccent}`}>
            Lo que se activa este mes
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {loQueSeActiva.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <Circle className={`w-2 h-2 ${config.iconSecondary} mt-1.5 flex-shrink-0`} fill="currentColor" />
              <div>
                <p className={`text-sm font-bold ${config.iconPrimary}`}>{item.titulo}</p>
                <p className="text-xs text-gray-600">{item.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pregunta guía */}
        <div className={`mt-4 pt-3 border-t border-current/10`}>
          <p className={`text-center italic ${config.iconSecondary} text-sm`}>
            "{preguntaGuia}"
          </p>
        </div>
      </div>
    </div>
  );
};

// ============ EJEMPLO: ENERO 2026 COMPLETO ============
export const CalendarioEnero2026Completo: React.FC = () => {
  const eventosEnero2026: EventoMensual[] = [
    {
      dia: 2,
      tipo: 'especial',
      nombre: 'Quirón Directo',
      signo: 'Aries',
      casa: '11',
      descripcionCorta: 'Sanación en comunidad y propósitos. Verdades emocionales emergen.'
    },
    {
      dia: 3,
      tipo: 'lunaLlena',
      nombre: 'Luna Llena',
      signo: 'Cáncer',
      casa: '4',
      descripcionCorta: 'Culminación emocional. Hogar interno, raíces, límites familiares.'
    },
    {
      dia: 18,
      tipo: 'lunaNueva',
      nombre: 'Luna Nueva',
      signo: 'Capricornio',
      casa: '10',
      descripcionCorta: 'Nuevo inicio en dirección vital. Metas prácticas y responsabilidad.'
    },
    {
      dia: 26,
      tipo: 'ingreso',
      nombre: 'Neptuno → Aries',
      signo: 'Aries',
      casa: '11',
      descripcionCorta: 'Inicio de ciclo de 12 años. Sueños colectivos, ideales renovados.'
    },
  ];

  const loQueSeActiva = [
    { titulo: 'Eje Casa 4-10', descripcion: 'Balance entre hogar interno y dirección vital' },
    { titulo: 'Saturno sextil Urano', descripcion: 'Cambios estructurales con estabilidad (20 enero)' },
    { titulo: 'Stellium Capricornio', descripcion: 'Sol, Mercurio, Venus, Marte: enfoque en metas' },
    { titulo: 'Transición Acuario', descripcion: 'Sol entra el 19, nuevas perspectivas sociales' },
  ];

  return (
    <CalendarioMensualCompacto
      mes={1}
      anio={2026}
      eventos={eventosEnero2026}
      tema="Ordenar tu energía antes de exigir resultados"
      preguntaGuia="¿Desde dónde estoy arrancando: desde la exigencia o desde la coherencia?"
      loQueSeActiva={loQueSeActiva}
    />
  );
};

export default CalendarioMensualCompacto;
