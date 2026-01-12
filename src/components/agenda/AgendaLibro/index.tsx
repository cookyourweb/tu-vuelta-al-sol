'use client';

import React, { useRef } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/context/StyleContext';
import { StyleSwitcher } from '@/components/agenda/StyleSwitcher';
import { Printer, X } from 'lucide-react';

// Secciones del libro
import { PortadaPersonalizada, PaginaIntencion } from './PortalEntrada';
import { CartaBienvenida, TemaCentralAnio, LoQueVieneAMover, LoQuePideSoltar, PaginaIntencionAnual } from './TuAnioTuViaje';
import { EsenciaNatal, NodoNorte, NodoSur, PlanetasDominantes, PatronesEmocionales } from './SoulChart';
import { QueEsRetornoSolar, AscendenteAnio, SolRetorno, LunaRetorno, EjesDelAnio, EjesDelAnio2, IntegracionEjes, RitualCumpleanos, MantraAnual } from './RetornoSolar';
import { IndiceNavegable } from './Indice';
import { CalendarioYMapaMes, LunasYEjercicios, SemanaConInterpretacion, CierreMes, PrimerDiaCiclo } from './MesCompleto';
import { CalendarioMensualEscritura } from './CalendarioMensualEscritura';
import { CalendarioMensualCompactoMaximo } from './CalendarioMensualCompactoMaximo';
import { CalendarioMensualTabla } from './CalendarioMensualTabla';
import { CalendarioCompletoModerno } from './CalendarioCompletoModerno';
import '@/styles/print-libro.css';

interface AgendaLibroProps {
  onClose: () => void;
  userName: string;
  startDate: Date;
  endDate: Date;
}

export const AgendaLibro = ({ onClose, userName, startDate, endDate }: AgendaLibroProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const { config } = useStyle();

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
        <PortadaPersonalizada
          name={userName}
          startDate={startDate}
          endDate={endDate}
        />
        <PaginaIntencion />
        <IndiceNavegable />

        {/* 2. TU AÑO, TU VIAJE */}
        <CartaBienvenida name={userName} />
        <TemaCentralAnio />
        <LoQueVieneAMover />
        <LoQuePideSoltar />
        <PaginaIntencionAnual />

        {/* 3. SOUL CHART */}
        <EsenciaNatal />
        <NodoNorte />
        <NodoSur />
        <PlanetasDominantes />
        <PatronesEmocionales />

        {/* 4. RETORNO SOLAR */}
        <QueEsRetornoSolar />
        <AscendenteAnio />
        <SolRetorno />
        <LunaRetorno />
        <EjesDelAnio />
        <EjesDelAnio2 />
        <IntegracionEjes />
        <RitualCumpleanos />
        <MantraAnual />

        {/* 5. PROPUESTA 1: CALENDARIO CON MÁXIMO ESPACIO PARA ESCRIBIR */}
        <CalendarioMensualEscritura
          monthDate={new Date(2026, 0, 1)}
          mesNumero={1}
          nombreZodiaco="Capricornio → Acuario"
          simboloZodiaco="♑"
          temaDelMes="Inicios conscientes"
          eventos={[
            { dia: 6, tipo: 'ingreso', titulo: 'Venus → Piscis', signo: 'Piscis' },
            { dia: 13, tipo: 'lunaLlena', titulo: 'Luna Llena en Cáncer', signo: 'Cáncer' },
            { dia: 20, tipo: 'ingreso', titulo: 'Sol → Acuario', signo: 'Acuario' },
            { dia: 29, tipo: 'lunaNueva', titulo: 'Luna Nueva en Acuario', signo: 'Acuario' }
          ]}
        />

        {/* 6. PROPUESTA 2: CALENDARIO COMPACTO MÁXIMO (4 líneas por día) */}
        <CalendarioMensualCompactoMaximo
          monthDate={new Date(2026, 0, 1)}
          mesNumero={1}
          nombreZodiaco="Capricornio → Acuario"
          simboloZodiaco="♑"
          eventos={[
            { dia: 6, tipo: 'ingreso', titulo: 'Venus → Piscis', signo: 'Piscis' },
            { dia: 13, tipo: 'lunaLlena', titulo: 'Luna Llena en Cáncer', signo: 'Cáncer' },
            { dia: 20, tipo: 'ingreso', titulo: 'Sol → Acuario', signo: 'Acuario' },
            { dia: 29, tipo: 'lunaNueva', titulo: 'Luna Nueva en Acuario', signo: 'Acuario' }
          ]}
        />

        {/* 7. PROPUESTA 3: CALENDARIO TABLA (formato profesional) */}
        <CalendarioMensualTabla
          monthDate={new Date(2026, 0, 1)}
          mesNumero={1}
          nombreZodiaco="Capicornio → Acuario"
          simboloZodiaco="♑"
          temaDelMes="Inicios conscientes"
          eventos={[
            { dia: 6, tipo: 'ingreso', titulo: 'Venus → Piscis', signo: 'Piscis' },
            { dia: 13, tipo: 'lunaLlena', titulo: 'Luna Llena en Cáncer', signo: 'Cáncer' },
            { dia: 20, tipo: 'ingreso', titulo: 'Sol → Acuario', signo: 'Acuario' },
            { dia: 29, tipo: 'lunaNueva', titulo: 'Luna Nueva en Acuario', signo: 'Acuario' }
          ]}
        />

        {/* 8. PROPUESTA 4: CALENDARIO COMPLETO MODERNO (con eventos + interpretaciones) */}
        <CalendarioCompletoModerno
          monthDate={new Date(2026, 0, 1)}
          mesNumero={1}
          nombreZodiaco="Capricornio → Acuario"
          simboloZodiaco="♑"
          temaDelMes="Inicios conscientes"
          eventos={[
            {
              dia: 6,
              tipo: 'ingreso',
              titulo: 'Venus → Piscis',
              signo: 'Piscis',
              interpretacion: 'Venus ingresa en Piscis trayendo una energía más empática y compasiva al amor y las relaciones. Es tiempo de conectar desde el corazón.'
            },
            {
              dia: 13,
              tipo: 'lunaLlena',
              titulo: 'Luna Llena en Cáncer',
              signo: 'Cáncer',
              interpretacion: 'Culminación emocional. Momento para soltar lo que ya no te pertenece en el ámbito familiar y emocional. Cierra ciclos con amor.'
            },
            {
              dia: 20,
              tipo: 'ingreso',
              titulo: 'Sol → Acuario',
              signo: 'Acuario',
              interpretacion: 'El Sol ingresa en Acuario iniciando una temporada de innovación, comunidad y pensamiento original. Tiempo de romper moldes.'
            },
            {
              dia: 29,
              tipo: 'lunaNueva',
              titulo: 'Luna Nueva en Acuario',
              signo: 'Acuario',
              interpretacion: 'Siembra intenciones sobre libertad, amistad y tu visión única del mundo. Es momento de conectar con tu tribu y tu propósito social.'
            }
          ]}
        />

        <LunasYEjercicios
          monthDate={new Date(2026, 0, 1)}
          eventos={[
            {
              dia: 13,
              tipo: 'lunaLlena',
              titulo: 'Luna Llena en Cáncer',
              interpretacion: 'Culminación emocional. Momento para soltar lo que ya no te pertenece en el ámbito familiar y emocional.'
            },
            {
              dia: 29,
              tipo: 'lunaNueva',
              titulo: 'Luna Nueva en Acuario',
              interpretacion: 'Siembra intenciones sobre libertad, comunidad e innovación. Tiempo de conectar con tu visión única.'
            }
          ]}
          ejercicioCentral={{
            titulo: 'Revisar automatismos',
            descripcion: 'Durante este mes, identifica una acción que haces por inercia y pregúntate: ¿esto me sigue sirviendo?'
          }}
          mantra="Arranco desde mi verdad, no desde la prisa"
        />
        <SemanaConInterpretacion
          weekStart={new Date(2026, 0, 5)}
          weekNumber={1}
          mesNombre="Enero 2026"
          tematica="Pausa y revisión"
          eventos={[
            { dia: 6, tipo: 'ingreso', titulo: 'Venus → Piscis', signo: 'Piscis' }
          ]}
          interpretacionSemanal="Esta primera semana del año es para bajar el ritmo y revisar qué quieres cultivar realmente. No hay prisa."
          ejercicioSemana="Escribe 3 cosas que NO quieres repetir este año."
        />
        <CierreMes monthDate={new Date(2026, 0, 1)} />

      </div>
    </div>
  );
};
