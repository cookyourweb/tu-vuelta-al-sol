import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/context/StyleContext';
import { Moon, Sun, Circle, Sparkles, Star, PenLine, Heart, Calendar } from 'lucide-react';

// ============ TIPOS ============
interface EventoMes {
  dia: number;
  tipo: 'lunaNueva' | 'lunaLlena' | 'eclipse' | 'retrogrado' | 'ingreso' | 'especial' | 'cumpleanos';
  titulo: string;
  signo?: string;
  interpretacion?: string;
  consejos?: string[];
}

interface MesCompletoProps {
  monthDate: Date;
  mesNumero: number;
  nombreZodiaco: string;
  simboloZodiaco: string;
  temaDelMes: string;
  energiaDelMes: string;
  preguntaGuia: string;
  eventos: EventoMes[];
  ejercicioCentral: {
    titulo: string;
    descripcion: string;
  };
  mantra: string;
  birthday?: Date;
}

// ============ UTILIDADES ============
const weekDays = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

const generateCalendarWeeks = (monthDate: Date) => {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const weeks: Date[][] = [];
  let currentDay = calendarStart;

  while (currentDay <= calendarEnd) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(currentDay);
      currentDay = addDays(currentDay, 1);
    }
    weeks.push(week);
  }

  return weeks;
};

const IconoEvento = ({ tipo, className = "w-4 h-4" }: { tipo: string; className?: string }) => {
  switch (tipo) {
    case 'lunaLlena': return <Circle className={className} fill="currentColor" />;
    case 'lunaNueva': return <Moon className={className} />;
    case 'eclipse': return <Sparkles className={className} />;
    case 'cumpleanos': return <Sun className={className} />;
    case 'retrogrado': return <span className={`${className} font-bold`}>℞</span>;
    case 'especial': return <Star className={className} fill="currentColor" />;
    default: return <Circle className={className} />;
  }
};

// ============ FOOTER DEL LIBRO ============
export const FooterLibro: React.FC<{ pagina?: number }> = ({ pagina }) => {
  const { config } = useStyle();
  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-8 text-[10px]">
      <a
        href="https://wunjocreations.es"
        target="_blank"
        rel="noopener noreferrer"
        className={`${config.iconSecondary} opacity-50 hover:opacity-100 transition-opacity no-print-hover`}
      >
        Tu Vuelta al Sol by Wunjo Creations
      </a>
      {pagina && <span className={`${config.iconSecondary} opacity-50 font-medium`}>{pagina}</span>}
      <span className={`${config.iconSecondary} opacity-50`}></span>
    </div>
  );
};

// ============ LÍNEAS DE ESCRITURA ============
const LineasEscritura = ({ count = 6, spacing = 28 }: { count?: number; spacing?: number }) => (
  <div className="flex flex-col">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="border-b border-gray-200" style={{ height: `${spacing}px` }} />
    ))}
  </div>
);

// ============ PÁGINA 1: CALENDARIO MENSUAL + MAPA DEL MES ============
export const CalendarioYMapaMes: React.FC<Omit<MesCompletoProps, 'ejercicioCentral' | 'mantra'>> = ({
  monthDate,
  mesNumero,
  nombreZodiaco,
  simboloZodiaco,
  temaDelMes,
  energiaDelMes,
  preguntaGuia,
  eventos,
  birthday
}) => {
  const { config } = useStyle();
  const weeks = generateCalendarWeeks(monthDate);

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-gray-300 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <span className={`text-3xl ${config.iconPrimary}`}>{simboloZodiaco}</span>
          <div>
            <h1 className={`text-2xl font-display capitalize ${config.titleGradient}`}>
              {format(monthDate, 'MMMM yyyy', { locale: es })}
            </h1>
            <span className={`text-xs uppercase tracking-wider ${config.iconSecondary}`}>
              Mes {mesNumero} · {nombreZodiaco}
            </span>
          </div>
        </div>
        <div className={`text-right max-w-[200px]`}>
          <p className={`text-xs italic ${config.iconPrimary}`}>"{temaDelMes}"</p>
        </div>
      </div>

      {/* Calendario Grid - Sin bordes, sin redondeos */}
      <div className="mb-4">
        {/* Headers días */}
        <div className={`grid grid-cols-7 ${config.badgePrimary} mb-1`}>
          {weekDays.map(day => (
            <div key={day} className="text-center text-[10px] font-bold py-1.5">
              {day}
            </div>
          ))}
        </div>

        {/* Semanas */}
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((day, di) => {
              const isCurrentMonth = isSameMonth(day, monthDate);
              const dayNum = day.getDate();
              const evento = eventos.find(e => e.dia === dayNum);
              const isBirthday = birthday && isSameDay(day, new Date(monthDate.getFullYear(), birthday.getMonth(), birthday.getDate()));

              return (
                <div
                  key={di}
                  className={`
                    h-14 p-1 border-b border-r border-gray-100 flex flex-col
                    ${!isCurrentMonth ? 'bg-gray-50/50' : 'bg-white'}
                    ${evento ? 'bg-gradient-to-r from-transparent to-gray-50' : ''}
                    ${isBirthday ? config.highlightAccent : ''}
                  `}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium ${isCurrentMonth ? 'text-gray-800' : 'text-gray-300'} ${isBirthday ? config.iconAccent + ' font-bold' : ''}`}>
                      {dayNum}
                    </span>
                    {evento && isCurrentMonth && (
                      <IconoEvento tipo={evento.tipo} className={`w-3 h-3 ${config.iconPrimary}`} />
                    )}
                  </div>
                  {evento && isCurrentMonth && (
                    <span className={`text-[8px] ${config.iconSecondary} leading-tight mt-0.5 truncate`}>
                      {evento.titulo.split(' ').slice(0, 2).join(' ')}
                    </span>
                  )}
                  {isBirthday && isCurrentMonth && (
                    <span className={`text-[8px] ${config.iconAccent} font-bold`}>☉ RETORNO</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Mapa del Mes - Qué se mueve */}
      <div className="flex-1 grid grid-cols-2 gap-4">
        {/* Columna izquierda: Energía y pregunta */}
        <div className={`${config.highlightSecondary} p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <Star className={`w-4 h-4 ${config.iconSecondary}`} />
            <h3 className={`text-xs font-bold uppercase ${config.iconSecondary}`}>Energía del Mes</h3>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">{energiaDelMes}</p>

          <div className={`${config.highlightPrimary} p-3 mt-auto`}>
            <span className={`text-[10px] uppercase ${config.iconPrimary}`}>Pregunta guía</span>
            <p className={`text-sm italic ${config.iconPrimary} mt-1`}>"{preguntaGuia}"</p>
          </div>
        </div>

        {/* Columna derecha: Eventos del mes */}
        <div className={`${config.highlightPrimary} p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <Moon className={`w-4 h-4 ${config.iconPrimary}`} />
            <h3 className={`text-xs font-bold uppercase ${config.iconPrimary}`}>Qué se Mueve</h3>
          </div>
          <div className="space-y-2">
            {eventos.slice(0, 4).map((evento, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <IconoEvento tipo={evento.tipo} className={`w-3 h-3 ${config.iconSecondary} mt-0.5 flex-shrink-0`} />
                <div>
                  <span className="font-medium text-gray-700">{evento.dia}: </span>
                  <span className="text-gray-600">{evento.titulo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FooterLibro pagina={mesNumero * 10} />
    </div>
  );
};

// ============ PÁGINA 2: INTERPRETACIONES LUNARES + EJERCICIOS ============
export const LunasYEjercicios: React.FC<{
  monthDate: Date;
  eventos: EventoMes[];
  ejercicioCentral: { titulo: string; descripcion: string };
  mantra: string;
}> = ({ monthDate, eventos, ejercicioCentral, mantra }) => {
  const { config } = useStyle();
  const lunaNueva = eventos.find(e => e.tipo === 'lunaNueva');
  const lunaLlena = eventos.find(e => e.tipo === 'lunaLlena');

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header */}
      <div className="text-center mb-4 pb-3 border-b border-gray-200">
        <span className={`text-xs uppercase tracking-wider ${config.iconSecondary}`}>
          {format(monthDate, 'MMMM yyyy', { locale: es })}
        </span>
        <h1 className={`text-xl font-display ${config.titleGradient}`}>
          Lunas, Ejercicios y Mantra
        </h1>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {/* Fila superior: Lunas */}
        <div className="grid grid-cols-2 gap-4">
          {/* Luna Nueva */}
          <div className={`${config.highlightSecondary} p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <Moon className={`w-4 h-4 ${config.iconSecondary}`} />
              <span className={`text-xs font-bold uppercase ${config.iconSecondary}`}>Luna Nueva</span>
              {lunaNueva && <span className="text-xs text-gray-500">· Día {lunaNueva.dia}</span>}
            </div>
            {lunaNueva ? (
              <div className="space-y-2">
                <p className={`text-sm font-medium ${config.iconPrimary}`}>{lunaNueva.titulo}</p>
                {lunaNueva.interpretacion && (
                  <p className="text-xs text-gray-600 leading-relaxed">{lunaNueva.interpretacion}</p>
                )}
                <LineasEscritura count={3} spacing={24} />
              </div>
            ) : (
              <LineasEscritura count={5} spacing={24} />
            )}
          </div>

          {/* Luna Llena */}
          <div className={`${config.highlightPrimary} p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <Circle className={`w-4 h-4 ${config.iconPrimary}`} fill="currentColor" />
              <span className={`text-xs font-bold uppercase ${config.iconPrimary}`}>Luna Llena</span>
              {lunaLlena && <span className="text-xs text-gray-500">· Día {lunaLlena.dia}</span>}
            </div>
            {lunaLlena ? (
              <div className="space-y-2">
                <p className={`text-sm font-medium ${config.iconSecondary}`}>{lunaLlena.titulo}</p>
                {lunaLlena.interpretacion && (
                  <p className="text-xs text-gray-600 leading-relaxed">{lunaLlena.interpretacion}</p>
                )}
                <LineasEscritura count={3} spacing={24} />
              </div>
            ) : (
              <LineasEscritura count={5} spacing={24} />
            )}
          </div>
        </div>

        {/* Ejercicio Central */}
        <div className={`${config.highlightAccent} p-5 flex-1`}>
          <div className="flex items-center gap-2 mb-3">
            <PenLine className={`w-4 h-4 ${config.iconAccent}`} />
            <h3 className={`text-sm font-bold uppercase ${config.iconAccent}`}>Ejercicio del Mes</h3>
          </div>
          <p className={`text-sm font-medium ${config.iconPrimary} mb-2`}>{ejercicioCentral.titulo}</p>
          <p className="text-xs text-gray-600 mb-4">{ejercicioCentral.descripcion}</p>
          <LineasEscritura count={8} spacing={28} />
        </div>

        {/* Mantra */}
        <div className={`${config.headerBg} p-4 text-center`}>
          <span className={`text-[10px] uppercase tracking-wider ${config.headerText} opacity-70`}>Mantra del Mes</span>
          <p className={`text-lg font-display italic ${config.headerText} mt-1`}>"{mantra}"</p>
        </div>
      </div>

      <FooterLibro />
    </div>
  );
};

// ============ PÁGINA 3-4: SEMANA CON MITAD DÍAS / MITAD EXPLICACIONES ============
export const SemanaConInterpretacion: React.FC<{
  weekStart: Date;
  weekNumber: number;
  mesNombre: string;
  tematica: string;
  eventos: EventoMes[];
  interpretacionSemanal: string;
  ejercicioSemana: string;
  birthday?: Date;
}> = ({ weekStart, weekNumber, mesNombre, tematica, eventos, interpretacionSemanal, ejercicioSemana, birthday }) => {
  const { config } = useStyle();
  const diasSemana = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

  const dias = Array.from({ length: 7 }).map((_, i) => {
    const fecha = addDays(weekStart, i);
    const dayNum = fecha.getDate();
    const evento = eventos.find(e => e.dia === dayNum);
    const esCumple = birthday &&
      fecha.getDate() === birthday.getDate() &&
      fecha.getMonth() === birthday.getMonth();

    return { fecha, evento, esCumple, dayNum };
  });

  const weekEnd = addDays(weekStart, 6);

  return (
    <div className={`print-page bg-white flex relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Columna izquierda: Días */}
      <div className="w-1/2 pr-4 border-r border-gray-200">
        {/* Header */}
        <div className="mb-3 pb-2 border-b-2 border-gray-300">
          <span className={`text-[10px] uppercase tracking-wider ${config.iconSecondary}`}>{mesNombre}</span>
          <h2 className={`text-lg font-display ${config.titleGradient}`}>
            Semana {weekNumber}: {format(weekStart, 'd', { locale: es })}-{format(weekEnd, 'd MMM', { locale: es })}
          </h2>
          <p className={`text-xs italic ${config.iconSecondary}`}>{tematica}</p>
        </div>

        {/* Grid de días */}
        <div className="flex-1 flex flex-col">
          {dias.map((dia, idx) => (
            <div
              key={idx}
              className={`
                flex items-stretch border-b border-gray-100 last:border-b-0
                ${dia.evento ? config.highlightSecondary : ''}
                ${dia.esCumple ? config.highlightAccent : ''}
              `}
              style={{ minHeight: '68px' }}
            >
              {/* Fecha */}
              <div className="w-12 pt-2 flex flex-col items-center flex-shrink-0">
                <span className={`text-xl font-bold ${dia.esCumple ? config.iconAccent : 'text-gray-800'}`}>
                  {dia.dayNum}
                </span>
                <span className={`text-[8px] uppercase ${dia.esCumple ? config.iconAccent : 'text-gray-400'}`}>
                  {diasSemana[idx]}
                </span>
              </div>

              {/* Contenido */}
              <div className="flex-1 pt-2 pl-2">
                {dia.evento && (
                  <div className="flex items-center gap-1 mb-1">
                    <IconoEvento tipo={dia.evento.tipo} className={`w-3 h-3 ${config.iconSecondary}`} />
                    <span className={`text-[10px] font-bold ${config.iconSecondary}`}>{dia.evento.titulo}</span>
                  </div>
                )}
                {dia.esCumple && (
                  <div className="flex items-center gap-1 mb-1">
                    <Sun className={`w-3 h-3 ${config.iconAccent}`} />
                    <span className={`text-[10px] font-bold ${config.iconAccent}`}>RETORNO SOLAR</span>
                  </div>
                )}
                {/* Líneas para escribir */}
                <div className="flex flex-col">
                  {Array.from({ length: dia.evento || dia.esCumple ? 2 : 3 }).map((_, i) => (
                    <div key={i} className="border-b border-gray-200" style={{ height: '18px' }} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Columna derecha: Interpretación y Ejercicio */}
      <div className="w-1/2 pl-4 flex flex-col">
        {/* Interpretación */}
        <div className={`${config.highlightPrimary} p-4 mb-4`}>
          <div className="flex items-center gap-2 mb-2">
            <Star className={`w-4 h-4 ${config.iconPrimary}`} />
            <h3 className={`text-xs font-bold uppercase ${config.iconPrimary}`}>Qué se mueve esta semana</h3>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">{interpretacionSemanal}</p>
        </div>

        {/* Ejercicio */}
        <div className={`${config.highlightSecondary} p-4 flex-1`}>
          <div className="flex items-center gap-2 mb-2">
            <PenLine className={`w-4 h-4 ${config.iconSecondary}`} />
            <h3 className={`text-xs font-bold uppercase ${config.iconSecondary}`}>Ejercicio de la semana</h3>
          </div>
          <p className="text-xs text-gray-600 italic mb-3">{ejercicioSemana}</p>
          <LineasEscritura count={10} spacing={26} />
        </div>

        {/* Notas */}
        <div className="mt-4">
          <span className={`text-[9px] uppercase tracking-wider ${config.iconSecondary}`}>Notas</span>
          <LineasEscritura count={4} spacing={22} />
        </div>
      </div>

      <FooterLibro />
    </div>
  );
};

// ============ PÁGINA: CIERRE DE SEMANA ============
export const CierreSemana: React.FC<{
  weekNumber: number;
  mesNombre: string;
}> = ({ weekNumber, mesNombre }) => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      <div className="text-center mb-6">
        <span className={`text-[10px] uppercase tracking-wider ${config.iconSecondary}`}>{mesNombre}</span>
        <h1 className={`text-xl font-display ${config.titleGradient}`}>Cierre Semana {weekNumber}</h1>
        <div className={`${config.divider} w-20 mx-auto mt-3`} />
      </div>

      <div className="flex-1 grid grid-cols-2 gap-6">
        {/* Columna izquierda */}
        <div className="space-y-4">
          <div className={`${config.highlightSecondary} p-4`}>
            <h3 className={`text-xs font-bold uppercase ${config.iconSecondary} mb-2`}>Lo que funcionó</h3>
            <LineasEscritura count={5} spacing={26} />
          </div>
          <div className={`${config.highlightPrimary} p-4`}>
            <h3 className={`text-xs font-bold uppercase ${config.iconPrimary} mb-2`}>Lo que no funcionó</h3>
            <LineasEscritura count={5} spacing={26} />
          </div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-4">
          <div className={`${config.highlightAccent} p-4`}>
            <h3 className={`text-xs font-bold uppercase ${config.iconAccent} mb-2`}>Aprendizaje clave</h3>
            <LineasEscritura count={5} spacing={26} />
          </div>
          <div className={`${config.highlightSecondary} p-4`}>
            <h3 className={`text-xs font-bold uppercase ${config.iconSecondary} mb-2`}>Para la próxima semana</h3>
            <LineasEscritura count={5} spacing={26} />
          </div>
        </div>
      </div>

      {/* Gratitud */}
      <div className={`${config.headerBg} p-4 mt-4 text-center`}>
        <span className={`text-[10px] uppercase tracking-wider ${config.headerText} opacity-70`}>Gratitud</span>
        <p className={`text-xs ${config.headerText} opacity-80 mt-1`}>¿Qué agradezco de esta semana?</p>
        <div className="border-b border-current/30 h-8 mt-2" />
      </div>

      <FooterLibro />
    </div>
  );
};

// ============ PÁGINAS ESPECIALES: PRIMER Y ÚLTIMO DÍA ============
export const PrimerDiaCiclo: React.FC<{
  fecha: Date;
  nombre: string;
}> = ({ fecha, nombre }) => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '20mm' }}>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <Sun className={`w-16 h-16 ${config.iconAccent} mb-6`} />
        <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>
          {format(fecha, "d 'de' MMMM, yyyy", { locale: es })}
        </span>
        <h1 className={`text-4xl font-display ${config.titleGradient} mt-4 mb-2`}>
          Primer Día de Tu Ciclo
        </h1>
        <p className={`text-lg ${config.iconSecondary} mb-8`}>¡Feliz cumpleaños, {nombre}!</p>

        <div className={`${config.divider} w-32 my-8`} />

        <div className="max-w-md space-y-6 text-left">
          <div className={`${config.highlightSecondary} p-5`}>
            <h3 className={`text-sm font-bold uppercase ${config.iconSecondary} mb-3`}>Intención para este nuevo ciclo</h3>
            <LineasEscritura count={4} spacing={28} />
          </div>

          <div className={`${config.highlightAccent} p-5`}>
            <h3 className={`text-sm font-bold uppercase ${config.iconAccent} mb-3`}>¿Qué quiero cultivar este año?</h3>
            <LineasEscritura count={4} spacing={28} />
          </div>

          <div className={`${config.highlightPrimary} p-5`}>
            <h3 className={`text-sm font-bold uppercase ${config.iconPrimary} mb-3`}>¿Qué decido soltar?</h3>
            <LineasEscritura count={4} spacing={28} />
          </div>
        </div>
      </div>

      <FooterLibro />
    </div>
  );
};

export const UltimoDiaCiclo: React.FC<{
  fecha: Date;
  nombre: string;
}> = ({ fecha, nombre }) => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '20mm' }}>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <Moon className={`w-16 h-16 ${config.iconPrimary} mb-6`} />
        <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>
          {format(fecha, "d 'de' MMMM, yyyy", { locale: es })}
        </span>
        <h1 className={`text-4xl font-display ${config.titleGradient} mt-4 mb-2`}>
          Último Día del Ciclo
        </h1>
        <p className={`text-lg ${config.iconSecondary} mb-8`}>Cierre y preparación, {nombre}</p>

        <div className={`${config.divider} w-32 my-8`} />

        <div className="max-w-md space-y-6 text-left">
          <div className={`${config.highlightSecondary} p-5`}>
            <h3 className={`text-sm font-bold uppercase ${config.iconSecondary} mb-3`}>Lo más importante que aprendí</h3>
            <LineasEscritura count={4} spacing={28} />
          </div>

          <div className={`${config.highlightPrimary} p-5`}>
            <h3 className={`text-sm font-bold uppercase ${config.iconPrimary} mb-3`}>¿Quién era hace un año? ¿Quién soy hoy?</h3>
            <LineasEscritura count={4} spacing={28} />
          </div>

          <div className={`${config.highlightAccent} p-5`}>
            <h3 className={`text-sm font-bold uppercase ${config.iconAccent} mb-3`}>Carta de gratitud a mí mismo/a</h3>
            <LineasEscritura count={4} spacing={28} />
          </div>
        </div>
      </div>

      <FooterLibro />
    </div>
  );
};

// ============ CIERRE DE MES ============
export const CierreMes: React.FC<{
  monthDate: Date;
}> = ({ monthDate }) => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '20mm' }}>
      <div className="text-center mb-6">
        <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>Cierre</span>
        <h1 className={`text-2xl font-display ${config.titleGradient} capitalize`}>
          {format(monthDate, 'MMMM yyyy', { locale: es })}
        </h1>
        <div className={`${config.divider} w-24 mx-auto mt-4`} />
      </div>

      <div className="flex-1 space-y-6">
        <div className={`${config.highlightSecondary} p-5`}>
          <h3 className={`text-sm font-bold uppercase ${config.iconSecondary} mb-3`}>¿Qué cambió en mí este mes?</h3>
          <LineasEscritura count={5} spacing={28} />
        </div>

        <div className={`${config.highlightPrimary} p-5`}>
          <h3 className={`text-sm font-bold uppercase ${config.iconPrimary} mb-3`}>¿Qué solté sin darme cuenta?</h3>
          <LineasEscritura count={5} spacing={28} />
        </div>

        <div className={`${config.highlightAccent} p-5`}>
          <h3 className={`text-sm font-bold uppercase ${config.iconAccent} mb-3`}>¿Qué descubrí de mí?</h3>
          <LineasEscritura count={5} spacing={28} />
        </div>

        <div className={`${config.headerBg} p-5 text-center`}>
          <span className={`text-[10px] uppercase ${config.headerText} opacity-70`}>Una palabra que resume este mes</span>
          <div className="border-b border-current/30 h-10 mt-3 max-w-xs mx-auto" />
        </div>
      </div>

      <FooterLibro />
    </div>
  );
};

export default CalendarioYMapaMes;
