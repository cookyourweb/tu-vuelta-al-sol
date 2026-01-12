import React from 'react';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/contexts/StyleContext';
import { 
  Moon, Sun, Star, Sparkles, Circle, PenLine
} from 'lucide-react';

// ============ TIPOS ============
interface EventoDia {
  titulo: string;
  tipo: 'lunaLlena' | 'lunaNueva' | 'eclipse' | 'retrogrado' | 'ingreso' | 'especial' | 'cumpleanos';
}

interface DiaData {
  fecha: Date;
  evento?: EventoDia | null;
}

interface SemanaPrincipalProps {
  weekStart: Date;
  weekNumber: number;
  mesNombre: string;
  tematica?: string;
  eventos?: { dia: number; evento: EventoDia }[];
  birthday?: Date;
}

// ============ ICONOS Y COLORES ============
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
    case 'especial':
      return <Star className={className} fill="currentColor" />;
    default:
      return <Circle className={className} />;
  }
};

const getEventoColor = (tipo: string) => {
  switch (tipo) {
    case 'lunaLlena': return { bg: 'bg-amber-50', text: 'text-amber-700', accent: 'bg-amber-500' };
    case 'lunaNueva': return { bg: 'bg-indigo-50', text: 'text-indigo-700', accent: 'bg-indigo-500' };
    case 'eclipse': return { bg: 'bg-purple-50', text: 'text-purple-700', accent: 'bg-purple-500' };
    case 'cumpleanos': return { bg: 'bg-orange-50', text: 'text-orange-600', accent: 'bg-orange-500' };
    case 'retrogrado': return { bg: 'bg-rose-50', text: 'text-rose-700', accent: 'bg-rose-500' };
    case 'ingreso': return { bg: 'bg-teal-50', text: 'text-teal-700', accent: 'bg-teal-500' };
    case 'especial': return { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', accent: 'bg-fuchsia-500' };
    default: return { bg: 'bg-gray-50', text: 'text-gray-700', accent: 'bg-gray-500' };
  }
};

// ============ LÍNEAS DE ESCRITURA ============
// Espaciado óptimo para escritura a mano: 8mm aprox = 32px
const LineasEscritura = ({ count = 4 }: { count?: number }) => (
  <div className="flex flex-col mt-1">
    {Array.from({ length: count }).map((_, i) => (
      <div 
        key={i} 
        className="border-b border-gray-200"
        style={{ height: '24px' }} // ~6mm para escritura cómoda
      />
    ))}
  </div>
);

// ============ COMPONENTE PRINCIPAL ============
export const SemanaPrincipal: React.FC<SemanaPrincipalProps> = ({
  weekStart,
  weekNumber,
  mesNombre,
  tematica = '',
  eventos = [],
  birthday
}) => {
  const { config } = useStyle();

  // Generar los 7 días de la semana
  const dias: DiaData[] = Array.from({ length: 7 }).map((_, i) => {
    const fecha = addDays(weekStart, i);
    const dayNum = fecha.getDate();
    const eventoDelDia = eventos.find(e => e.dia === dayNum);
    
    // Verificar si es cumpleaños
    const esCumple = birthday && 
      fecha.getDate() === birthday.getDate() && 
      fecha.getMonth() === birthday.getMonth();
    
    return {
      fecha,
      evento: esCumple 
        ? { tipo: 'cumpleanos' as const, titulo: 'RETORNO SOLAR' }
        : eventoDelDia?.evento || null
    };
  });

  const weekEnd = addDays(weekStart, 6);
  const rangoFechas = `${format(weekStart, 'd', { locale: es })} - ${format(weekEnd, 'd MMMM', { locale: es })}`;

  const diasSemana = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

  return (
    <div className={`print-page bg-white flex flex-col ${config.pattern}`} style={{ padding: '20mm 15mm' }}>
      {/* Header de la semana */}
      <div className="flex items-baseline justify-between pb-3 border-b-2 border-gray-300 mb-4">
        <div className="flex items-baseline gap-4">
          <span className={`text-xs font-bold uppercase tracking-widest ${config.iconSecondary}`}>
            {mesNombre}
          </span>
          <h1 className={`text-xl font-display font-semibold ${config.titleGradient}`}>
            Semana {weekNumber}: {rangoFechas}
          </h1>
        </div>
        {tematica && (
          <p className={`text-xs italic ${config.iconSecondary}`}>
            {tematica}
          </p>
        )}
      </div>

      {/* Grid de días - Diseño optimizado para escritura */}
      <div className="flex-1 flex flex-col">
        {dias.map((dia, idx) => {
          const dayNum = dia.fecha.getDate();
          const dayName = diasSemana[idx];
          const colors = dia.evento ? getEventoColor(dia.evento.tipo) : null;
          const esFinDeSemana = idx >= 5;
          
          return (
            <div
              key={idx}
              className={`
                flex items-stretch border-b border-gray-100 last:border-b-0
                ${colors ? colors.bg : ''}
              `}
              style={{ minHeight: '80px', flex: 1 }}
            >
              {/* Indicador de color lateral */}
              {colors && (
                <div className={`w-1 flex-shrink-0 ${colors.accent}`} />
              )}
              
              {/* Fecha - Alineada arriba */}
              <div className={`w-16 pt-2 flex flex-col items-center flex-shrink-0 ${esFinDeSemana ? 'bg-gray-50/50' : ''}`}>
                <span className={`text-2xl font-bold leading-none ${colors ? colors.text : 'text-gray-800'}`}>
                  {dayNum}
                </span>
                <span className={`text-[9px] uppercase mt-1 font-medium ${colors ? colors.text : 'text-gray-400'}`}>
                  {dayName}
                </span>
              </div>
              
              {/* Contenido del día - Con líneas de escritura */}
              <div className="flex-1 pt-2 pr-4 flex flex-col">
                {/* Evento si existe */}
                {dia.evento && (
                  <div className="flex items-center gap-2 mb-1">
                    <IconoEvento tipo={dia.evento.tipo} className={`w-4 h-4 ${colors?.text}`} />
                    <span className={`text-sm font-bold ${colors?.text}`}>
                      {dia.evento.titulo}
                    </span>
                  </div>
                )}
                
                {/* Líneas de escritura - más espacio si no hay evento */}
                <LineasEscritura count={dia.evento ? 3 : 4} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer - Notas de la semana */}
      <div className="mt-4 pt-3 border-t border-gray-300">
        <div className="flex items-center gap-2 mb-2">
          <PenLine className={`w-3 h-3 ${config.iconSecondary}`} />
          <span className={`text-[10px] font-bold uppercase tracking-wider ${config.iconSecondary}`}>
            Notas de la semana
          </span>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-0">
            <div className="border-b border-gray-200" style={{ height: '22px' }} />
            <div className="border-b border-gray-200" style={{ height: '22px' }} />
          </div>
          <div className="space-y-0">
            <div className="border-b border-gray-200" style={{ height: '22px' }} />
            <div className="border-b border-gray-200" style={{ height: '22px' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ EJERCICIOS DE LA SEMANA ============
interface EjerciciosSemanaProps {
  weekNumber: number;
  ejercicioPrincipal: string;
  preguntaReflexion: string;
  mantra?: string;
}

export const EjerciciosSemana: React.FC<EjerciciosSemanaProps> = ({
  weekNumber,
  ejercicioPrincipal,
  preguntaReflexion,
  mantra
}) => {
  const { config } = useStyle();

  // Líneas con mejor espaciado para escritura extensa
  const LineasAmplias = ({ count = 8 }: { count?: number }) => (
    <div className="flex flex-col">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="border-b border-gray-200"
          style={{ height: '28px' }} // Más espacio para escritura terapéutica
        />
      ))}
    </div>
  );

  return (
    <div className={`print-page bg-white flex flex-col ${config.pattern}`} style={{ padding: '20mm 15mm' }}>
      {/* Header */}
      <div className="text-center mb-6">
        <span className={`text-xs font-bold uppercase tracking-widest ${config.iconSecondary}`}>
          Ejercicios
        </span>
        <h1 className={`text-2xl font-display ${config.titleGradient} mt-1`}>
          Semana {weekNumber}
        </h1>
      </div>

      {/* Ejercicio principal */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-6 h-6 flex items-center justify-center ${config.highlightPrimary}`}>
            <PenLine className={`w-4 h-4 ${config.iconPrimary}`} />
          </div>
          <h2 className={`text-sm font-bold uppercase ${config.iconPrimary}`}>
            Ejercicio de la semana
          </h2>
        </div>
        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
          {ejercicioPrincipal}
        </p>
        <LineasAmplias count={10} />
      </div>

      {/* Pregunta de reflexión */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-6 h-6 flex items-center justify-center ${config.highlightSecondary}`}>
            <Star className={`w-4 h-4 ${config.iconSecondary}`} />
          </div>
          <h2 className={`text-sm font-bold uppercase ${config.iconSecondary}`}>
            Reflexión
          </h2>
        </div>
        <p className={`text-sm italic ${config.iconPrimary} mb-4`}>
          "{preguntaReflexion}"
        </p>
        <LineasAmplias count={8} />
      </div>

      {/* Mantra */}
      {mantra && (
        <div className="mt-auto pt-4 border-t border-gray-200 text-center">
          <span className={`text-xs uppercase tracking-wider ${config.iconSecondary}`}>Mantra</span>
          <p className={`text-lg font-display italic ${config.titleGradient} mt-1`}>
            "{mantra}"
          </p>
        </div>
      )}
    </div>
  );
};

// ============ EXPORTS PARA MESES ESPECÍFICOS ============

// Enero 2026 - Semanas
export const Semana1Enero: React.FC<{ birthday?: Date }> = ({ birthday }) => (
  <SemanaPrincipal
    weekStart={new Date(2026, 0, 5)} // Lunes 5 enero
    weekNumber={1}
    mesNombre="ENERO 2026"
    tematica="Ordenar antes de exigir"
    eventos={[
      { dia: 6, evento: { tipo: 'lunaNueva', titulo: 'Luna Nueva en Capricornio' } }
    ]}
    birthday={birthday}
  />
);

export const Semana2Enero: React.FC<{ birthday?: Date }> = ({ birthday }) => (
  <SemanaPrincipal
    weekStart={new Date(2026, 0, 12)}
    weekNumber={2}
    mesNombre="ENERO 2026"
    tematica="Construir sobre lo ordenado"
    birthday={birthday}
  />
);

export const Semana3Enero: React.FC<{ birthday?: Date }> = ({ birthday }) => (
  <SemanaPrincipal
    weekStart={new Date(2026, 0, 19)}
    weekNumber={3}
    mesNombre="ENERO 2026"
    tematica="Culminación emocional"
    eventos={[
      { dia: 21, evento: { tipo: 'lunaLlena', titulo: 'Luna Llena en Leo' } }
    ]}
    birthday={birthday}
  />
);

export const Semana4Enero: React.FC<{ birthday?: Date }> = ({ birthday }) => (
  <SemanaPrincipal
    weekStart={new Date(2026, 0, 26)}
    weekNumber={4}
    mesNombre="ENERO 2026"
    tematica="Cierre e integración"
    eventos={[
      { dia: 26, evento: { tipo: 'ingreso', titulo: 'Neptuno → Aries' } }
    ]}
    birthday={birthday}
  />
);

// Ejercicios Enero
export const EjerciciosSemana1Enero: React.FC = () => (
  <EjerciciosSemana
    weekNumber={1}
    ejercicioPrincipal="Escribe tres compromisos que arrastras del año pasado. ¿Cuáles siguen vivos? ¿Cuáles están muertos pero aún ocupan espacio? Tacha los que ya no te sirven."
    preguntaReflexion="¿Desde dónde estoy arrancando: desde la exigencia o desde la coherencia?"
    mantra="Este año viene a reordenarme, no a exigirme más"
  />
);

export const EjerciciosSemana2Enero: React.FC = () => (
  <EjerciciosSemana
    weekNumber={2}
    ejercicioPrincipal="Dibuja o escribe cómo te gustaría sentirte en tu día a día este año. No qué quieres lograr, sino cómo quieres sentirte mientras lo logras."
    preguntaReflexion="¿Qué estaría dispuesto/a a soltar si supiera que me acerca a esa sensación?"
  />
);

// Febrero 2026 - Semana del cumpleaños
export const SemanaCumpleFebrero: React.FC<{ birthday?: Date }> = ({ birthday }) => (
  <SemanaPrincipal
    weekStart={new Date(2026, 1, 9)}
    weekNumber={6}
    mesNombre="FEBRERO 2026"
    tematica="Renacimiento Solar"
    eventos={[
      { dia: 12, evento: { tipo: 'lunaLlena', titulo: 'Luna Llena en Leo' } }
    ]}
    birthday={birthday}
  />
);

export default SemanaPrincipal;
