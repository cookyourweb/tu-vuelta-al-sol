'use client';

import React, { useRef, useMemo } from 'react';
import { format, addMonths, isSameMonth, getMonth, getYear } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/context/StyleContext';
import { StyleSwitcher } from '@/components/agenda/StyleSwitcher';
import { Printer, X } from 'lucide-react';
import type { AstrologicalEvent } from '@/types/astrology/unified-types';

// Secciones del libro
import { PortadaPersonalizada, PaginaIntencion } from './PortalEntrada';
import { CartaBienvenida, TemaCentralAnio, LoQueVieneAMover, LoQuePideSoltar, PaginaIntencionAnual } from './TuAnioTuViaje';
import { TuAnioOverview, TuAnioCiclos, PaginaCumpleanos } from './TuAnio';
import { LineaTiempoEmocional, MesesClavePuntosGiro, GrandesAprendizajes } from './CiclosAnuales';
import { EsenciaNatal, NodoNorte, NodoSur, PlanetasDominantes, PatronesEmocionales } from './SoulChart';
import { QueEsRetornoSolar, AscendenteAnio, SolRetorno, LunaRetorno, EjesDelAnio, EjesDelAnio2, IntegracionEjes, RitualCumpleanos, MantraAnual } from './RetornoSolar';
import { IndiceNavegable } from './Indice';
import { CalendarioYMapaMes, LunasYEjercicios, SemanaConInterpretacion, CierreMes, PrimerDiaCiclo as PrimerDiaCicloMes } from './MesCompleto';
import { CalendarioMensualTabla } from './CalendarioMensualTabla';
import { EscrituraTerapeutica, Visualizacion, RitualSimbolico, TrabajoEmocional } from './TerapiaCreativa';
import { PrimerDiaCiclo, UltimoDiaCiclo, QuienEraQuienSoy, PreparacionProximaVuelta, CartaCierre, PaginaFinalBlanca, Contraportada } from './PaginasEspeciales';
import '@/styles/print-libro.css';

// ============ TIPOS PARA EVENTOS DEL LIBRO ============
interface EventoMes {
  dia: number;
  tipo: 'lunaNueva' | 'lunaLlena' | 'eclipse' | 'retrogrado' | 'ingreso' | 'especial' | 'cumpleanos';
  titulo: string;
  signo?: string;
  interpretacion?: string;
}

interface MesData {
  monthDate: Date;
  mesNumero: number;
  nombreZodiaco: string;
  simboloZodiaco: string;
  temaDelMes: string;
  eventos: EventoMes[];
  isBirthdayMonth: boolean;
}

// ============ CONSTANTES DE ZODIACO ============
const SIGNOS_ZODIACO = [
  { nombre: 'Capricornio → Acuario', simbolo: '♑', meses: [0] },   // Enero
  { nombre: 'Acuario → Piscis', simbolo: '♒', meses: [1] },        // Febrero
  { nombre: 'Piscis → Aries', simbolo: '♓', meses: [2] },          // Marzo
  { nombre: 'Aries → Tauro', simbolo: '♈', meses: [3] },           // Abril
  { nombre: 'Tauro → Géminis', simbolo: '♉', meses: [4] },         // Mayo
  { nombre: 'Géminis → Cáncer', simbolo: '♊', meses: [5] },        // Junio
  { nombre: 'Cáncer → Leo', simbolo: '♋', meses: [6] },            // Julio
  { nombre: 'Leo → Virgo', simbolo: '♌', meses: [7] },             // Agosto
  { nombre: 'Virgo → Libra', simbolo: '♍', meses: [8] },           // Septiembre
  { nombre: 'Libra → Escorpio', simbolo: '♎', meses: [9] },        // Octubre
  { nombre: 'Escorpio → Sagitario', simbolo: '♏', meses: [10] },   // Noviembre
  { nombre: 'Sagitario → Capricornio', simbolo: '♐', meses: [11] } // Diciembre
];

const TEMAS_MES = [
  'Inicios conscientes',
  'Conexión y visión',
  'Renacimiento y sueños',
  'Impulso y acción',
  'Estabilidad y valores',
  'Comunicación y curiosidad',
  'Hogar y emociones',
  'Expresión y creatividad',
  'Orden y servicio',
  'Equilibrio y relaciones',
  'Transformación profunda',
  'Expansión y sabiduría'
];

// ============ FUNCIONES DE TRANSFORMACIÓN ============

/**
 * Transforma AstrologicalEvent a EventoMes para el calendario del libro
 */
function transformEventToEventoMes(event: AstrologicalEvent): EventoMes {
  const eventDate = new Date(event.date);
  const dia = eventDate.getDate();

  // Determinar el tipo de evento
  let tipo: EventoMes['tipo'] = 'especial';
  const titleLower = event.title?.toLowerCase() || '';
  const typeLower = event.type?.toLowerCase() || '';

  if (titleLower.includes('luna nueva') || typeLower === 'lunar_phase' && titleLower.includes('nueva')) {
    tipo = 'lunaNueva';
  } else if (titleLower.includes('luna llena') || typeLower === 'lunar_phase' && titleLower.includes('llena')) {
    tipo = 'lunaLlena';
  } else if (titleLower.includes('eclipse') || typeLower === 'eclipse') {
    tipo = 'eclipse';
  } else if (titleLower.includes('retrógrado') || titleLower.includes('retrogrado') || typeLower === 'retrograde') {
    tipo = 'retrogrado';
  } else if (titleLower.includes('entra en') || titleLower.includes('ingresa') || typeLower === 'planetary_transit') {
    tipo = 'ingreso';
  }

  // Limpiar el título de emojis para el libro impreso
  const tituloLimpio = event.title
    ?.replace(/🌙|🌑|🌕|⏪|🪐|🌸|☀️|⚡|✨|🔥|💫/g, '')
    .trim() || 'Evento astrológico';

  // Construir interpretación desde personalInterpretation o aiInterpretation
  let interpretacion = '';
  const interp = event.personalInterpretation || event.aiInterpretation;
  if (interp) {
    if (interp.meaning) interpretacion += interp.meaning + '\n\n';
    if (interp.advice) interpretacion += '💡 ' + interp.advice + '\n\n';
    if (interp.mantra) interpretacion += '✨ Mantra: ' + interp.mantra;
  } else if (event.description) {
    interpretacion = event.description;
  }

  return {
    dia,
    tipo,
    titulo: tituloLimpio,
    signo: event.sign,
    interpretacion: interpretacion.trim() || undefined
  };
}

/**
 * Agrupa eventos por mes y genera los datos de cada mes
 */
function generateMonthsData(
  startDate: Date,
  endDate: Date,
  events: AstrologicalEvent[],
  birthDate?: Date
): MesData[] {
  const months: MesData[] = [];
  let currentDate = new Date(startDate);
  let mesNumero = 1;

  while (currentDate < endDate && mesNumero <= 12) {
    const monthIndex = getMonth(currentDate);
    const year = getYear(currentDate);

    // Filtrar eventos de este mes
    const monthEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return isSameMonth(eventDate, currentDate);
    });

    // Transformar a formato EventoMes
    const eventosDelMes: EventoMes[] = monthEvents.map(transformEventToEventoMes);

    // Verificar si es el mes del cumpleaños
    const isBirthdayMonth = birthDate ?
      getMonth(birthDate) === monthIndex : false;

    // Obtener info del zodiaco
    const zodiacoInfo = SIGNOS_ZODIACO[monthIndex] || SIGNOS_ZODIACO[0];

    months.push({
      monthDate: new Date(year, monthIndex, 1),
      mesNumero,
      nombreZodiaco: zodiacoInfo.nombre,
      simboloZodiaco: zodiacoInfo.simbolo,
      temaDelMes: TEMAS_MES[monthIndex] || 'Exploración consciente',
      eventos: eventosDelMes,
      isBirthdayMonth
    });

    // Avanzar al siguiente mes
    currentDate = addMonths(currentDate, 1);
    mesNumero++;
  }

  return months;
}

interface AgendaLibroProps {
  onClose: () => void;
  userName: string;
  startDate: Date;
  endDate: Date;
  events?: AstrologicalEvent[];
  birthDate?: Date;
}

export const AgendaLibro = ({ onClose, userName, startDate, endDate, events = [], birthDate }: AgendaLibroProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const { config } = useStyle();

  // Generar datos de los 12 meses dinámicamente
  const monthsData = useMemo(() => {
    return generateMonthsData(startDate, endDate, events, birthDate);
  }, [startDate, endDate, events, birthDate]);

  const handlePrint = () => {
    // Forzar el layout antes de imprimir
    window.setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="libro-container min-h-screen bg-gray-100">
      {/* Header de controles - NO se imprime */}
      <div className={`no-print sticky top-0 z-50 backdrop-blur border-b ${config.headerBg} ${config.headerText} p-4`}>
        <div className="container mx-auto flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/20"
          >
            <X className="w-4 h-4" />
            Cerrar
          </button>

          <div className="flex items-center gap-4">
            <StyleSwitcher />
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-400 hover:to-pink-400 transition-all duration-200 shadow-lg"
            >
              <Printer className="w-4 h-4" />
              Imprimir Libro
            </button>
          </div>
        </div>

        <p className="text-center text-sm mt-2 opacity-90">
          Agenda de <span className="font-semibold">{userName}</span> · {format(startDate, "d MMM yyyy", { locale: es })} - {format(endDate, "d MMM yyyy", { locale: es })}
        </p>
      </div>

      {/* Contenido del libro */}
      <div ref={printRef} className="container mx-auto py-8 space-y-0 print:p-0">

        {/* 1. PORTAL DE ENTRADA */}
        <div id="portal-entrada">
          <div id="portada">
            <PortadaPersonalizada
              name={userName}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
          <div id="intencion-anio">
            <PaginaIntencion />
          </div>
        </div>
        <IndiceNavegable />

        {/* 2. TU AÑO 2026-2027 - OVERVIEW */}
        <div id="tu-anio-overview">
          <TuAnioOverview
            startDate={startDate}
            endDate={endDate}
            userName={userName}
          />
          <TuAnioCiclos
            startDate={startDate}
            endDate={endDate}
            userName={userName}
          />
        </div>

        {/* 3. CICLOS ANUALES */}
        <div id="ciclos-anuales">
          <LineaTiempoEmocional
            startDate={startDate}
            endDate={endDate}
          />
          <MesesClavePuntosGiro />
          <GrandesAprendizajes />
        </div>

        {/* 4. TU AÑO, TU VIAJE */}
        <div id="tu-anio-tu-viaje">
          <div id="carta-bienvenida">
            <CartaBienvenida name={userName} />
          </div>
          <div id="tema-central">
            <TemaCentralAnio />
          </div>
          <div id="viene-mover">
            <LoQueVieneAMover />
          </div>
          <div id="pide-soltar">
            <LoQuePideSoltar />
          </div>
          <PaginaIntencionAnual />
        </div>

        {/* 3. SOUL CHART */}
        <div id="soul-chart">
          <div id="esencia-natal">
            <EsenciaNatal />
          </div>
          <div id="nodo-norte">
            <NodoNorte />
          </div>
          <div id="nodo-sur">
            <NodoSur />
          </div>
          <div id="planetas-dominantes">
            <PlanetasDominantes />
          </div>
          <div id="patrones-emocionales">
            <PatronesEmocionales />
          </div>
        </div>

        {/* 4. RETORNO SOLAR */}
        <div id="retorno-solar">
          <div id="que-es-retorno">
            <QueEsRetornoSolar />
          </div>
          <div id="ascendente-anio">
            <AscendenteAnio />
          </div>
          <div id="sol-retorno">
            <SolRetorno />
          </div>
          <div id="luna-retorno">
            <LunaRetorno />
          </div>
          <div id="ejes-anio">
            <EjesDelAnio />
            <EjesDelAnio2 />
            <IntegracionEjes />
          </div>
          <div id="ritual-cumpleanos">
            <RitualCumpleanos />
          </div>
          <MantraAnual />
        </div>

        {/* 5. CALENDARIO MENSUAL (12 meses dinámicos) */}
        <div id="calendario-mensual">
          {monthsData.map((mesData, index) => {
            // Calcular fecha de cumpleaños para este mes si aplica
            const birthdayInMonth = birthDate && mesData.isBirthdayMonth
              ? new Date(getYear(mesData.monthDate), getMonth(birthDate), birthDate.getDate())
              : undefined;

            // Filtrar solo eventos de lunas para el componente LunasYEjercicios
            const eventosLunares = mesData.eventos.filter(
              e => e.tipo === 'lunaNueva' || e.tipo === 'lunaLlena'
            );

            return (
              <div key={`mes-${index}`} id={`mes-${index + 1}`}>
                {/* Página especial de cumpleaños si es el mes del cumpleaños */}
                {mesData.isBirthdayMonth && birthDate && (
                  <PaginaCumpleanos
                    birthDate={new Date(getYear(mesData.monthDate), getMonth(birthDate), birthDate.getDate())}
                    userName={userName}
                  />
                )}

                {/* Calendario del mes con eventos */}
                <CalendarioMensualTabla
                  monthDate={mesData.monthDate}
                  mesNumero={mesData.mesNumero}
                  nombreZodiaco={mesData.nombreZodiaco}
                  simboloZodiaco={mesData.simboloZodiaco}
                  temaDelMes={mesData.temaDelMes}
                  eventos={mesData.eventos}
                  birthday={birthdayInMonth}
                />

                {/* Página de lunas y ejercicios si hay eventos lunares */}
                {eventosLunares.length > 0 && (
                  <LunasYEjercicios
                    monthDate={mesData.monthDate}
                    eventos={eventosLunares.map(e => ({
                      dia: e.dia,
                      tipo: e.tipo as 'lunaNueva' | 'lunaLlena',
                      titulo: e.titulo,
                      interpretacion: e.interpretacion || `Evento lunar importante para reflexión y conexión interior.`
                    }))}
                    ejercicioCentral={{
                      titulo: `Ejercicio de ${format(mesData.monthDate, 'MMMM', { locale: es })}`,
                      descripcion: `Este mes, dedica tiempo a observar cómo las fases lunares influyen en tu energía y emociones.`
                    }}
                    mantra={`Fluyo con los ciclos naturales de ${format(mesData.monthDate, 'MMMM', { locale: es })}`}
                  />
                )}

                {/* Cierre del mes */}
                <CierreMes monthDate={mesData.monthDate} />
              </div>
            );
          })}

          {/* Mensaje si no hay meses generados */}
          {monthsData.length === 0 && (
            <div className="print-page bg-white flex flex-col items-center justify-center" style={{ padding: '15mm' }}>
              <p className="text-gray-500 text-center">
                No hay eventos cargados para este período.
                <br />
                Por favor, asegúrate de que los eventos astrológicos estén disponibles.
              </p>
            </div>
          )}
        </div>

        {/* TERAPIA ASTROLÓGICA CREATIVA */}
        <div id="terapia-creativa">
          <EscrituraTerapeutica />
          <Visualizacion />
          <RitualSimbolico />
          <TrabajoEmocional />
        </div>

        {/* CIERRE DEL CICLO */}
        <div id="cierre-ciclo">
          <QuienEraQuienSoy />
          <PreparacionProximaVuelta />
          <CartaCierre name={userName} />
          <PaginaFinalBlanca />
        </div>

        {/* CONTRAPORTADA */}
        <Contraportada />

      </div>
    </div>
  );
};
