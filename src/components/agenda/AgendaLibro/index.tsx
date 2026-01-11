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
import { IndiceNavegable } from './IndiceNavegable';
import {
  PropuestaCalendario1,
  PropuestaCalendario2,
  PropuestaCalendario3,
  PropuestaSemana1,
  PropuestaSemana2,
  PropuestaSemana3
} from './PropuestasCalendario';

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
    window.print();
  };

  return (
    <div className="min-h-screen bg-white">
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

        {/* 3. ÍNDICE NAVEGABLE - Tercera página del libro */}
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

        {/* 5. PROPUESTAS DE CALENDARIO - Para decidir estilo visual */}
        <div className="print-page bg-white p-10">
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-display ${config.titleGradient} mb-4`}>
              📅 Propuestas de Calendario
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A continuación verás diferentes estilos visuales para el calendario mensual y las semanas.
              Todos se adaptan a los 4 temas (Elegante, Creativo, Minimalista, Bohemio).
              Estas son páginas de muestra antes de generar el contenido final con IA.
            </p>
          </div>
        </div>

        {/* Propuestas de Calendario Mensual */}
        <PropuestaCalendario1 />
        <PropuestaCalendario2 />
        <PropuestaCalendario3 />

        {/* Propuestas de Semana */}
        <PropuestaSemana1 />
        <PropuestaSemana2 />
        <PropuestaSemana3 />

      </div>
    </div>
  );
};
