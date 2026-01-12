'use client';

import React from 'react';
import { format, startOfMonth, addDays, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/context/StyleContext';

// Tipos
interface EventoMensual {
  dia: number;
  tipo: 'lunaLlena' | 'lunaNueva' | 'retrogrado' | 'ingreso' | 'especial';
  titulo: string;
  interpretacion: string;
}

// Eventos de Enero 2026
const eventosEnero: EventoMensual[] = [
  {
    dia: 1,
    tipo: 'especial',
    titulo: 'Año Nuevo',
    interpretacion: 'Inicio del año calendario. Momento para intenciones colectivas y renovación.'
  },
  {
    dia: 6,
    tipo: 'ingreso',
    titulo: 'Venus en Piscis',
    interpretacion: 'El amor se vuelve más compasivo. Conexiones espirituales y artísticas florecen.'
  },
  {
    dia: 13,
    tipo: 'lunaLlena',
    titulo: 'Luna Llena en Cáncer',
    interpretacion: 'Culminación emocional. Lo que sembraste en familia y hogar llega a su punto máximo. Observa qué necesitas soltar para sentirte en casa contigo mismo.'
  },
  {
    dia: 20,
    tipo: 'ingreso',
    titulo: 'Sol en Acuario',
    interpretacion: 'Comienza la temporada de innovación y comunidad. Es momento de pensar en colectivo y en el futuro.'
  },
  {
    dia: 29,
    tipo: 'lunaNueva',
    titulo: 'Luna Nueva en Acuario',
    interpretacion: 'Siembra intenciones sobre libertad, innovación y propósito colectivo. ¿Qué quieres crear con tu tribu?'
  },
];

// Generar días del mes
const generarDiasMes = (mes: number, anio: number) => {
  const inicio = startOfMonth(new Date(anio, mes - 1));
  const dias: Date[] = [];

  let diaActual = new Date(inicio);
  const diaSemana = diaActual.getDay();
  const ajuste = diaSemana === 0 ? -6 : 1 - diaSemana;
  diaActual = addDays(diaActual, ajuste);

  for (let i = 0; i < 42; i++) {
    dias.push(new Date(diaActual));
    diaActual = addDays(diaActual, 1);
  }

  return dias;
};

// ============================================================
// ESTILO 1: GRID MENSUAL COMPACTO CON EVENTOS ABAJO
// Funcional, máximo espacio para escribir
// ============================================================

export const EneroEstilo1: React.FC = () => {
  const { config } = useStyle();
  const dias = generarDiasMes(1, 2026);
  const mesReferencia = new Date(2026, 0, 1);

  const getEventoDelDia = (fecha: Date) => {
    const dia = fecha.getDate();
    return eventosEnero.find(e => e.dia === dia && isSameMonth(fecha, mesReferencia));
  };

  return (
    <div className="print-page bg-white p-6 flex flex-col">
      {/* Header simple */}
      <div className="mb-2">
        <h1 className={`text-2xl font-display ${config.titleGradient} mb-0.5`}>
          ENERO 2026
        </h1>
        <p className="text-[10px] text-gray-500 italic">
          Mes de inicios y renovación · Capricornio ♑ → Acuario ♒
        </p>
      </div>

      {/* Calendario - Grid sin bordes decorativos */}
      <div className="mb-2">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 border-b border-gray-400 pb-0.5 mb-0.5">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((dia, idx) => (
            <div key={idx} className="text-center">
              <span className="text-[9px] font-bold text-gray-600 uppercase">
                {dia}
              </span>
            </div>
          ))}
        </div>

        {/* Grid de días - 6 filas */}
        <div className="grid grid-rows-6 gap-0">
          {Array.from({ length: 6 }).map((_, semanaIdx) => (
            <div key={semanaIdx} className="grid grid-cols-7 border-b border-gray-200 last:border-b-0">
              {dias.slice(semanaIdx * 7, (semanaIdx + 1) * 7).map((fecha, diaIdx) => {
                const esDelMes = isSameMonth(fecha, mesReferencia);
                const evento = getEventoDelDia(fecha);
                const dia = fecha.getDate();

                return (
                  <div
                    key={diaIdx}
                    className={`
                      h-[22mm] p-0.5 border-r border-gray-200 last:border-r-0
                      ${esDelMes ? '' : 'bg-gray-50'}
                    `}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-0.5">
                        <span className={`text-xs font-bold ${esDelMes ? 'text-gray-800' : 'text-gray-400'}`}>
                          {dia}
                        </span>
                        {evento && <span className={`text-[7px] ${config.iconPrimary}`}>●</span>}
                      </div>

                      {/* Espacio para escribir - líneas sutiles */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="h-2 border-b border-dotted border-gray-200" />
                        <div className="h-2 border-b border-dotted border-gray-200" />
                        <div className="h-2" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Eventos del mes - Sección compacta */}
      <div className="border-t-2 border-gray-800 pt-1.5">
        <h3 className="text-[9px] font-bold text-gray-700 uppercase mb-1">
          Eventos clave de enero
        </h3>
        <div className="space-y-1">
          {eventosEnero.map((evento, idx) => (
            <div key={idx} className="border-l-2 border-gray-400 pl-1.5">
              <div className="flex items-baseline gap-1 mb-0.5">
                <span className="text-xs font-bold text-gray-800">{evento.dia}</span>
                <span className="text-[8px] font-bold text-gray-700">{evento.titulo}</span>
              </div>
              <p className="text-[7px] text-gray-600 leading-tight">
                {evento.interpretacion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ESTILO 2: VISTA SEMANAL CON 2 COLUMNAS
// Días a la izquierda, eventos y espacio para reflexiones a la derecha
// ============================================================

export const EneroEstilo2: React.FC = () => {
  const { config } = useStyle();

  // Semana representativa: 12-18 enero (incluye Luna Llena)
  const semana = [
    { fecha: new Date(2026, 0, 12), eventos: [] },
    {
      fecha: new Date(2026, 0, 13),
      eventos: [eventosEnero.find(e => e.dia === 13)!]
    },
    { fecha: new Date(2026, 0, 14), eventos: [] },
    { fecha: new Date(2026, 0, 15), eventos: [] },
    { fecha: new Date(2026, 0, 16), eventos: [] },
    { fecha: new Date(2026, 0, 17), eventos: [] },
    { fecha: new Date(2026, 0, 18), eventos: [] },
  ];

  return (
    <div className="print-page bg-white p-6 flex flex-col">
      {/* Header */}
      <div className="mb-2 pb-1.5 border-b border-gray-800">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[8px] text-gray-500 uppercase tracking-wider">Enero 2026</span>
            <h1 className={`text-lg font-display ${config.titleGradient}`}>
              Semana 2 · 12-18 enero
            </h1>
          </div>
          <span className="text-[8px] italic text-gray-600">Semana de culminación emocional</span>
        </div>
      </div>

      {/* Layout 2 columnas */}
      <div className="flex-1 flex gap-2">
        {/* COLUMNA IZQUIERDA: Días (35%) */}
        <div className="w-[35%] flex flex-col">
          {semana.map((dia, idx) => {
            const nombreDia = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][idx];
            const numDia = dia.fecha.getDate();
            const tieneEvento = dia.eventos.length > 0;

            return (
              <div
                key={idx}
                className={`
                  flex-1 flex items-center border-b border-gray-200 last:border-b-0 pl-0.5
                  ${tieneEvento ? `border-l-2 ${config.cardBorder}` : ''}
                `}
              >
                <div className="flex items-center gap-1.5 flex-1">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${tieneEvento ? 'text-gray-800' : 'text-gray-600'}`}>
                      {numDia}
                    </div>
                    <div className="text-[7px] uppercase text-gray-500">{nombreDia}</div>
                  </div>
                  <div className="flex-1 border-b border-dotted border-gray-300" />
                </div>
              </div>
            );
          })}
        </div>

        {/* COLUMNA DERECHA: Eventos y reflexiones (65%) */}
        <div className="w-[65%] border-l border-gray-300 pl-2">
          <h3 className="text-[8px] font-bold uppercase text-gray-700 mb-1.5">
            Eventos de la semana
          </h3>

          <div className="space-y-2 mb-3">
            {semana.filter(d => d.eventos.length > 0).map((dia, idx) => (
              <div key={idx} className="border-l-2 border-gray-800 pl-1.5">
                <div className="mb-0.5">
                  <span className="text-sm font-bold text-gray-800">
                    {dia.fecha.getDate()}
                  </span>
                  <span className="text-[9px] font-bold text-gray-700 ml-1.5">
                    {dia.eventos[0].titulo}
                  </span>
                </div>
                <p className="text-[8px] text-gray-600 leading-snug">
                  {dia.eventos[0].interpretacion}
                </p>
              </div>
            ))}
          </div>

          {/* Espacio para notas personales */}
          <div className="mt-3 pt-2 border-t border-gray-300">
            <h4 className="text-[7px] font-bold uppercase text-gray-600 mb-1">
              Tus notas y reflexiones
            </h4>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-3 border-b border-dotted border-gray-300" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ESTILO 3: HÍBRIDO - OVERVIEW MENSUAL + SEMANAS DETALLADAS
// Vista mensual compacta arriba, luego 2 semanas detalladas
// ============================================================

export const EneroEstilo3: React.FC = () => {
  const { config } = useStyle();
  const dias = generarDiasMes(1, 2026);
  const mesReferencia = new Date(2026, 0, 1);

  const getEventoDelDia = (fecha: Date) => {
    const dia = fecha.getDate();
    return eventosEnero.find(e => e.dia === dia && isSameMonth(fecha, mesReferencia));
  };

  // Semanas destacadas
  const semanas = [
    {
      titulo: 'Semana 1: 1-7 enero',
      dias: [1, 2, 3, 4, 5, 6, 7],
      evento: eventosEnero.find(e => e.dia === 6)
    },
    {
      titulo: 'Semana 2: 12-18 enero',
      dias: [12, 13, 14, 15, 16, 17, 18],
      evento: eventosEnero.find(e => e.dia === 13)
    },
  ];

  return (
    <div className="print-page bg-white p-6 flex flex-col">
      {/* Header */}
      <div className="mb-2">
        <h1 className={`text-2xl font-display ${config.titleGradient} mb-0.5`}>
          ENERO 2026
        </h1>
        <p className="text-[9px] text-gray-500 italic">
          Vista general + semanas destacadas
        </p>
      </div>

      {/* Mini calendario mensual - muy compacto */}
      <div className="mb-2 pb-2 border-b border-gray-300">
        <div className="grid grid-cols-7 gap-px bg-gray-200 p-0.5">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((dia, idx) => (
            <div key={idx} className="text-center bg-white py-0.5">
              <span className="text-[7px] font-bold text-gray-500">{dia}</span>
            </div>
          ))}
          {dias.slice(0, 35).map((fecha, idx) => {
            const esDelMes = isSameMonth(fecha, mesReferencia);
            const evento = getEventoDelDia(fecha);
            const dia = fecha.getDate();

            return (
              <div
                key={idx}
                className={`
                  text-center py-1 bg-white
                  ${esDelMes ? '' : 'opacity-40'}
                `}
              >
                <span className={`text-[9px] ${evento ? 'font-bold' : 'font-normal'} ${esDelMes ? 'text-gray-800' : 'text-gray-400'}`}>
                  {dia}
                </span>
                {evento && <div className={`w-1 h-1 rounded-full mx-auto mt-0.5 ${config.iconPrimary}`} style={{backgroundColor: 'currentColor'}} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Semanas destacadas */}
      <div className="space-y-2">
        {semanas.map((semana, idx) => (
          <div key={idx} className="border border-gray-300 p-1.5">
            <h3 className="text-[9px] font-bold text-gray-700 mb-1">
              {semana.titulo}
            </h3>

            {/* Días de la semana en línea */}
            <div className="flex gap-1 mb-1">
              {semana.dias.map(dia => (
                <div
                  key={dia}
                  className={`flex-1 text-center py-1 border border-gray-200 ${
                    semana.evento && semana.evento.dia === dia
                      ? 'border-gray-800 bg-gray-50'
                      : ''
                  }`}
                >
                  <span className="text-[9px] font-bold text-gray-700">{dia}</span>
                </div>
              ))}
            </div>

            {/* Evento destacado */}
            {semana.evento && (
              <div className="border-l-2 border-gray-800 pl-1.5 mb-1">
                <span className="text-[8px] font-bold text-gray-700">
                  {semana.evento.titulo}
                </span>
                <p className="text-[7px] text-gray-600 leading-tight mt-0.5">
                  {semana.evento.interpretacion}
                </p>
              </div>
            )}

            {/* Espacio para notas */}
            <div className="space-y-0.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-2 border-b border-dotted border-gray-300" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Eventos restantes */}
      <div className="mt-2 pt-1.5 border-t border-gray-400">
        <h3 className="text-[8px] font-bold text-gray-700 uppercase mb-1">
          Otros eventos del mes
        </h3>
        <div className="grid grid-cols-2 gap-1">
          {eventosEnero.filter(e => ![6, 13].includes(e.dia)).map((evento, idx) => (
            <div key={idx} className="text-[7px]">
              <span className="font-bold text-gray-800">{evento.dia}</span>
              <span className="text-gray-600 ml-1">{evento.titulo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
