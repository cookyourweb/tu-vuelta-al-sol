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

interface DiasSemana {
  fecha: Date;
  eventos: EventoMensual[];
}

// Generar días del mes
const generarDiasMes = (mes: number, anio: number) => {
  const inicio = startOfMonth(new Date(anio, mes - 1));
  const dias: Date[] = [];

  // Ajustar al lunes anterior si no empieza en lunes
  let diaActual = new Date(inicio);
  const diaSemana = diaActual.getDay();
  const ajuste = diaSemana === 0 ? -6 : 1 - diaSemana;
  diaActual = addDays(diaActual, ajuste);

  // Generar 42 días (6 semanas completas)
  for (let i = 0; i < 42; i++) {
    dias.push(new Date(diaActual));
    diaActual = addDays(diaActual, 1);
  }

  return dias;
};

// ============================================================
// PROPUESTA 1: CALENDARIO MINIMALISTA FUNCIONAL
// Sin bordes, solo líneas divisorias
// Máximo espacio para escribir
// ============================================================

export const CalendarioMensualPropuesta1: React.FC = () => {
  const { config } = useStyle();

  const eventos: EventoMensual[] = [
    {
      dia: 3,
      tipo: 'lunaLlena',
      titulo: 'Luna Llena en Cáncer',
      interpretacion: 'Momento de culminación emocional. Presta atención a lo que necesitas soltar en el hogar y familia.'
    },
    {
      dia: 10,
      tipo: 'especial',
      titulo: 'Tu Retorno Solar',
      interpretacion: 'Tu nuevo año personal comienza. Define tu intención para este ciclo.'
    },
    {
      dia: 18,
      tipo: 'lunaNueva',
      titulo: 'Luna Nueva en Acuario',
      interpretacion: 'Siembra intenciones sobre comunidad, innovación y libertad personal.'
    },
  ];

  const dias = generarDiasMes(2, 2026);
  const mesReferencia = new Date(2026, 1, 1);

  const getEventoDelDia = (fecha: Date) => {
    const dia = fecha.getDate();
    return eventos.find(e => e.dia === dia && isSameMonth(fecha, mesReferencia));
  };

  return (
    <div className="print-page bg-white p-6 flex flex-col">
      {/* Header simple */}
      <div className="mb-3">
        <h1 className={`text-2xl font-display ${config.titleGradient} mb-1`}>
          FEBRERO 2026
        </h1>
        <p className="text-xs text-gray-500 italic">
          Mes de tu Retorno Solar · Renacimiento personal
        </p>
      </div>

      {/* Calendario - Grid sin bordes */}
      <div className="mb-3">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 border-b border-gray-400 pb-1 mb-1">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((dia, idx) => (
            <div key={idx} className="text-center">
              <span className="text-[10px] font-bold text-gray-600 uppercase">
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
                      h-[24mm] p-1 border-r border-gray-200 last:border-r-0
                      ${esDelMes ? '' : 'bg-gray-50'}
                    `}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between">
                        <span className={`text-sm font-bold ${esDelMes ? 'text-gray-800' : 'text-gray-400'}`}>
                          {dia}
                        </span>
                        {evento && <span className="text-[8px]">●</span>}
                      </div>

                      {/* Espacio para escribir */}
                      <div className="flex-1 mt-0.5">
                        {evento && (
                          <p className="text-[7px] text-gray-600 leading-tight">
                            {evento.titulo.substring(0, 15)}...
                          </p>
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

      {/* Eventos del mes */}
      <div className="border-t border-gray-400 pt-2">
        <h3 className="text-[10px] font-bold text-gray-700 uppercase mb-1.5">
          Eventos clave de febrero
        </h3>
        <div className="space-y-1.5">
          {eventos.map((evento, idx) => (
            <div key={idx} className="border-l-2 border-gray-800 pl-2">
              <div className="flex items-baseline gap-1.5 mb-0.5">
                <span className="text-sm font-bold text-gray-800">{evento.dia}</span>
                <span className="text-[9px] font-bold text-gray-700">{evento.titulo}</span>
              </div>
              <p className="text-[8px] text-gray-600 leading-tight">
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
// PROPUESTA 2: SEMANA CON 2 COLUMNAS
// Días a la izquierda, eventos/reflexiones a la derecha
// ============================================================

export const SemanaPropuesta2Columnas: React.FC = () => {
  const { config } = useStyle();

  const semana: DiasSemana[] = [
    { fecha: new Date(2026, 1, 9), eventos: [] },
    {
      fecha: new Date(2026, 1, 10),
      eventos: [{
        dia: 10,
        tipo: 'especial',
        titulo: '☀ Tu Retorno Solar',
        interpretacion: 'Hoy comienza tu nuevo año personal. El Sol vuelve al mismo grado que tenía en tu nacimiento. Este es un momento para reflexionar sobre quién eres ahora y qué quieres sembrar para los próximos 12 meses. Escribe tu intención del año.'
      }]
    },
    { fecha: new Date(2026, 1, 11), eventos: [] },
    {
      fecha: new Date(2026, 1, 12),
      eventos: [{
        dia: 12,
        tipo: 'lunaLlena',
        titulo: '○ Luna Llena en Leo',
        interpretacion: 'Culminación creativa. La Luna ilumina tu creatividad y autenticidad. Es momento de ver qué proyectos o expresiones tuyas están maduras para mostrarse al mundo. ¿Qué parte de ti pide ser vista?'
      }]
    },
    { fecha: new Date(2026, 1, 13), eventos: [] },
    { fecha: new Date(2026, 1, 14), eventos: [] },
    { fecha: new Date(2026, 1, 15), eventos: [] },
  ];

  return (
    <div className="print-page bg-white p-6 flex flex-col">
      {/* Header */}
      <div className="mb-2 pb-2 border-b border-gray-800">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[9px] text-gray-500 uppercase tracking-wider">Febrero 2026</span>
            <h1 className={`text-lg font-display ${config.titleGradient}`}>
              Semana 2 · 9-15 febrero
            </h1>
          </div>
          <span className="text-[9px] italic text-gray-600">Tu semana de renacimiento</span>
        </div>
      </div>

      {/* Layout 2 columnas */}
      <div className="flex-1 flex gap-3">
        {/* COLUMNA IZQUIERDA: Días (40%) */}
        <div className="w-[40%] flex flex-col">
          {semana.map((dia, idx) => {
            const nombreDia = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][idx];
            const numDia = dia.fecha.getDate();
            const tieneEvento = dia.eventos.length > 0;

            return (
              <div
                key={idx}
                className={`
                  flex-1 flex items-center border-b border-gray-200 last:border-b-0 pl-1
                  ${tieneEvento ? 'border-l-2 border-l-gray-800' : ''}
                `}
              >
                <div className="flex items-center gap-2 flex-1">
                  <div className="text-center">
                    <div className={`text-xl font-bold ${tieneEvento ? 'text-gray-800' : 'text-gray-600'}`}>
                      {numDia}
                    </div>
                    <div className="text-[8px] uppercase text-gray-500">{nombreDia}</div>
                  </div>

                  <div className="flex-1 border-b border-dotted border-gray-300" />
                </div>
              </div>
            );
          })}
        </div>

        {/* COLUMNA DERECHA: Eventos y reflexiones (60%) */}
        <div className="w-[60%] border-l border-gray-300 pl-3">
          <h3 className="text-[9px] font-bold uppercase text-gray-700 mb-2">
            Eventos de la semana
          </h3>

          <div className="space-y-3">
            {semana.filter(d => d.eventos.length > 0).map((dia, idx) => (
              <div key={idx} className="border-l-2 border-gray-800 pl-2">
                <div className="mb-1">
                  <span className="text-base font-bold text-gray-800">
                    {dia.fecha.getDate()}
                  </span>
                  <span className="text-[10px] font-bold text-gray-700 ml-2">
                    {dia.eventos[0].titulo}
                  </span>
                </div>
                <p className="text-[9px] text-gray-600 leading-snug">
                  {dia.eventos[0].interpretacion}
                </p>
              </div>
            ))}
          </div>

          {/* Espacio para notas */}
          <div className="mt-4 pt-3 border-t border-gray-300">
            <h4 className="text-[8px] font-bold uppercase text-gray-600 mb-1">
              Tus notas de la semana
            </h4>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 border-b border-dotted border-gray-300" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// PROPUESTA 3: PÁGINA ESPECIAL CUMPLEAÑOS
// ============================================================

export const PaginaCumpleanos: React.FC<{ nombre: string }> = ({ nombre }) => {
  const { config } = useStyle();

  return (
    <div className="print-page bg-white p-8 flex flex-col justify-center items-center text-center">
      <div className="max-w-md">
        {/* Símbolo */}
        <div className="text-6xl mb-6">☀</div>

        {/* Título */}
        <h1 className={`text-3xl font-display ${config.titleGradient} mb-4`}>
          10 de febrero 2026
        </h1>

        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Tu Retorno Solar, {nombre}
        </h2>

        {/* Mensaje */}
        <div className="space-y-4 text-left">
          <p className="text-sm text-gray-700 leading-relaxed">
            Hoy el Sol vuelve al mismo grado exacto que tenía cuando naciste.
            Este es tu <strong>Año Nuevo Personal</strong>.
          </p>

          <p className="text-sm text-gray-700 leading-relaxed">
            Los próximos 365 días serán un ciclo único, con sus propios aprendizajes,
            desafíos y regalos. No es el mismo ciclo que hace un año. Tú no eres la misma persona.
          </p>

          <div className="border-l-4 border-gray-800 pl-4 my-6">
            <p className="text-sm font-bold text-gray-800 mb-2">
              Pregunta del año:
            </p>
            <p className="text-sm italic text-gray-700">
              ¿Qué versión de mí quiero habitar durante este ciclo?
            </p>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            Escribe tu intención en las páginas siguientes. Recuerda: no se trata de
            predecir, sino de <strong>sembrar con consciencia</strong>.
          </p>
        </div>

        {/* Líneas para escribir */}
        <div className="mt-8 space-y-2">
          <p className="text-[9px] font-bold uppercase text-gray-600 text-left">
            Mi intención para este año:
          </p>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border-b border-gray-400" />
          ))}
        </div>
      </div>
    </div>
  );
};
