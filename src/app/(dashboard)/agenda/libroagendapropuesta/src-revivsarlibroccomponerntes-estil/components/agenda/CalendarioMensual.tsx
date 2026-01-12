import React from 'react';
import { useStyle } from '@/contexts/StyleContext';
import { Moon, Sun, Star, Sparkles, RefreshCw, Circle } from 'lucide-react';

interface EventoCalendario {
  dia: number;
  tipo: 'lunaNueva' | 'lunaLlena' | 'retornoSolar' | 'equinoccio' | 'eclipse' | 'retrogrado';
  nombre: string;
  descripcion?: string;
  ritual?: string;
  horaOptima?: string;
}

interface CalendarioMensualProps {
  mes: number;
  anio: number;
  subtitulo?: string;
  eventos: EventoCalendario[];
  energiaMes?: string;
}

const diasSemana = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const getIconoEvento = (tipo: EventoCalendario['tipo']) => {
  switch (tipo) {
    case 'lunaNueva':
      return <Moon className="w-4 h-4" />;
    case 'lunaLlena':
      return <Circle className="w-4 h-4 fill-current" />;
    case 'retornoSolar':
      return <Sun className="w-4 h-4" />;
    case 'equinoccio':
      return <Star className="w-4 h-4 fill-current" />;
    case 'eclipse':
      return <Sparkles className="w-4 h-4" />;
    case 'retrogrado':
      return <RefreshCw className="w-4 h-4" />;
    default:
      return null;
  }
};

const getColorIcono = (tipo: EventoCalendario['tipo']) => {
  switch (tipo) {
    case 'lunaNueva':
      return 'text-indigo-500';
    case 'lunaLlena':
      return 'text-purple-500';
    case 'retornoSolar':
      return 'text-orange-500';
    case 'equinoccio':
      return 'text-yellow-600';
    case 'eclipse':
      return 'text-slate-600';
    case 'retrogrado':
      return 'text-rose-500';
    default:
      return 'text-gray-500';
  }
};

const generarCalendario = (mes: number, anio: number) => {
  const primerDia = new Date(anio, mes - 1, 1);
  const ultimoDia = new Date(anio, mes, 0);
  const diasEnMes = ultimoDia.getDate();
  
  // Ajustar para que lunes sea 0
  let diaSemanaInicio = primerDia.getDay() - 1;
  if (diaSemanaInicio < 0) diaSemanaInicio = 6;
  
  const semanas: (number | null)[][] = [];
  let semanaActual: (number | null)[] = [];
  
  // Días vacíos al inicio
  for (let i = 0; i < diaSemanaInicio; i++) {
    semanaActual.push(null);
  }
  
  // Días del mes
  for (let dia = 1; dia <= diasEnMes; dia++) {
    semanaActual.push(dia);
    if (semanaActual.length === 7) {
      semanas.push(semanaActual);
      semanaActual = [];
    }
  }
  
  // Completar última semana
  while (semanaActual.length > 0 && semanaActual.length < 7) {
    semanaActual.push(null);
  }
  if (semanaActual.length > 0) {
    semanas.push(semanaActual);
  }
  
  return semanas;
};

const nombresMeses = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
];

export const CalendarioMensual: React.FC<CalendarioMensualProps> = ({
  mes,
  anio,
  subtitulo,
  eventos,
  energiaMes,
}) => {
  const { config } = useStyle();
  const semanas = generarCalendario(mes, anio);
  
  const getEventoDelDia = (dia: number) => {
    return eventos.find(e => e.dia === dia);
  };

  return (
    <div className="print-page bg-white p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className={`text-3xl ${config.fontDisplay} ${config.titleGradient} mb-2`}>
          {nombresMeses[mes - 1]} {anio}
        </h1>
        {subtitulo && (
          <p className={`text-lg ${config.fontBody} ${config.iconSecondary} italic`}>
            {subtitulo}
          </p>
        )}
      </div>

      {/* Calendario Grid */}
      <div className="mb-8">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {diasSemana.map((dia, idx) => (
            <div
              key={idx}
              className={`text-center py-2 text-sm font-medium ${config.fontBody} text-gray-500`}
            >
              {dia}
            </div>
          ))}
        </div>

        {/* Semanas */}
        <div className="grid gap-1">
          {semanas.map((semana, semanaIdx) => (
            <div key={semanaIdx} className="grid grid-cols-7 gap-1">
              {semana.map((dia, diaIdx) => {
                const evento = dia ? getEventoDelDia(dia) : null;
                
                return (
                  <div
                    key={diaIdx}
                    className={`
                      min-h-[72px] p-2 border border-gray-100 rounded-sm
                      ${!dia ? 'bg-gray-50/50' : 'bg-white'}
                      ${evento ? config.calendarColors[evento.tipo] : ''}
                      transition-all
                    `}
                  >
                    {dia && (
                      <div className="h-full flex flex-col">
                        <span className={`text-lg font-medium ${config.fontDisplay} text-gray-800`}>
                          {dia}
                        </span>
                        {evento && (
                          <div className="mt-1 flex flex-col items-start">
                            <span className={`${getColorIcono(evento.tipo)}`}>
                              {getIconoEvento(evento.tipo)}
                            </span>
                            <span className={`text-xs mt-1 ${config.fontBody} text-gray-700 leading-tight`}>
                              {evento.nombre}
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
      </div>

      {/* Eventos detallados */}
      {eventos.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {eventos.map((evento, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg ${config.calendarColors[evento.tipo]}`}
            >
              <div className="flex items-start gap-2 mb-2">
                <span className={`${getColorIcono(evento.tipo)} mt-0.5`}>
                  {getIconoEvento(evento.tipo)}
                </span>
                <div>
                  <p className={`text-sm font-medium ${config.fontBody} text-gray-900`}>
                    {evento.dia} {nombresMeses[mes - 1]}
                  </p>
                  <p className={`text-base font-semibold ${config.fontDisplay} text-gray-800`}>
                    {evento.nombre}
                  </p>
                </div>
              </div>
              {evento.descripcion && (
                <p className={`text-sm ${config.fontBody} text-gray-700 mb-2`}>
                  {evento.descripcion}
                </p>
              )}
              {evento.ritual && (
                <p className={`text-sm ${config.fontBody} text-gray-600`}>
                  Ritual: {evento.ritual}
                </p>
              )}
              {evento.horaOptima && (
                <p className={`text-sm ${config.fontBody} ${config.iconSecondary} mt-1 font-medium`}>
                  Hora óptima: {evento.horaOptima}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Energía del mes */}
      {energiaMes && (
        <div className={`p-4 ${config.highlightSecondary} rounded-lg`}>
          <div className="flex items-start gap-2">
            <Sparkles className={`w-5 h-5 ${config.iconSecondary} mt-0.5 flex-shrink-0`} />
            <div>
              <p className={`text-sm font-semibold ${config.fontDisplay} text-gray-800 mb-1`}>
                Energía de {nombresMeses[mes - 1]} {anio}
              </p>
              <p className={`text-sm ${config.fontBody} text-gray-700 leading-relaxed`}>
                {energiaMes}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Ejemplo de uso con datos de Vero - Febrero 2025
export const CalendarioFebrero2025: React.FC = () => {
  const eventos: EventoCalendario[] = [
    {
      dia: 10,
      tipo: 'retornoSolar',
      nombre: 'Retorno Solar',
      descripcion: 'Sol a 21° Acuario. Tu nuevo ciclo personal comienza. Portal de renovación e identidad.',
      ritual: 'Gran Ritual de Retorno Solar',
      horaOptima: '7:30',
    },
    {
      dia: 12,
      tipo: 'lunaNueva',
      nombre: 'Luna Nueva',
      descripcion: 'Momento perfecto para sembrar intenciones alineadas con tu Sol natal en Acuario.',
      ritual: 'Luna Nueva en Acuario',
    },
    {
      dia: 27,
      tipo: 'lunaLlena',
      nombre: 'Luna Llena',
      descripcion: 'Activa tu Luna natal en Libra. Culminación emocional y equilibrio en relaciones.',
      ritual: 'Luna Llena en Virgo',
    },
  ];

  return (
    <CalendarioMensual
      mes={2}
      anio={2025}
      subtitulo="Inicio de tu Ciclo Solar"
      eventos={eventos}
      energiaMes="Este mes marca el inicio de tu nuevo ciclo solar con el Sol regresando a su posición natal en Acuario. Cumples 51 años y entras en un año de introspección profunda. La Luna Nueva potencia nuevos comienzos mientras la Luna Llena activa tu Luna natal, trayendo culminaciones importantes en el ámbito relacional."
    />
  );
};

export default CalendarioMensual;
