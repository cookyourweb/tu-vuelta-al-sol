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

        {/* Índice Completo del Libro */}
        <div className="print-page bg-white p-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6 text-center">
              📖 Índice Completo de Tu Agenda Astrológica
            </h2>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 mb-6">
              <p className="text-gray-700 text-center mb-4 text-lg">
                Tu agenda contiene <span className="font-bold text-purple-600">139 secciones</span> diseñadas para acompañarte durante todo tu año solar
              </p>
              <p className="text-gray-600 text-center text-sm">
                De {format(startDate, "d 'de' MMMM yyyy", { locale: es })} a {format(endDate, "d 'de' MMMM yyyy", { locale: es })}
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-600 mb-3 flex items-center gap-2">
                  <span>🌟</span> Estructura Completa Documentada
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 font-bold">✅</span>
                    <div>
                      <span className="font-semibold">PARTE I:</span> Portal de Entrada (2 secciones)
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 font-bold">✅</span>
                    <div>
                      <span className="font-semibold">PARTE II:</span> Tu Año, Tu Viaje (5 secciones)
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 font-bold">✅</span>
                    <div>
                      <span className="font-semibold">PARTE III:</span> Soul Chart - Carta Natal (5 secciones)
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 font-bold">✅</span>
                    <div>
                      <span className="font-semibold">PARTE IV:</span> Retorno Solar (9 secciones)
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 font-bold">✅</span>
                    <div>
                      <span className="font-semibold">PARTE V:</span> Calendario Anual (3 secciones)
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 font-bold">✅</span>
                    <div>
                      <span className="font-semibold">PARTE VI:</span> Los 12 Meses del Año
                      <div className="text-sm text-gray-600 mt-1 ml-6">
                        • Calendario visual mensual<br/>
                        • Interpretaciones de Lunas Nueva y Llena<br/>
                        • Ejercicios y mantras mensuales<br/>
                        • 4 semanas por mes con días individuales<br/>
                        • Integración y cierre mensual
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 font-bold">✅</span>
                    <div>
                      <span className="font-semibold">PARTE VII:</span> Terapias Creativas (4 secciones)
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 font-bold">✅</span>
                    <div>
                      <span className="font-semibold">PARTE VIII:</span> Cierre de Ciclo (5 secciones)
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6">
                <h3 className="text-lg font-bold text-orange-600 mb-3 flex items-center gap-2">
                  <span>📏</span> Especificaciones Técnicas
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <span className="font-semibold">Formato:</span> A5 (148mm x 210mm)</li>
                  <li>• <span className="font-semibold">Páginas:</span> 350-400 aprox.</li>
                  <li>• <span className="font-semibold">Estilos visuales:</span> Elegante, Creativo, Minimalista, Bohemio</li>
                  <li>• <span className="font-semibold">Contenido:</span> Personalizado según tu carta natal y retorno solar</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 text-center">
                <p className="text-gray-700 text-sm">
                  📝 Ver documentación completa en <span className="font-mono text-purple-600">INDICE_AGENDA_LIBRO.md</span>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
