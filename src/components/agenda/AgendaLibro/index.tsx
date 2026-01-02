'use client';

import React, { useRef } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/context/StyleContext';
import { StyleSwitcher } from '@/components/agenda/StyleSwitcher';
import { Printer, X } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
      {/* Header de controles - NO se imprime */}
      <div className={`no-print sticky top-0 z-50 backdrop-blur border-b border-purple-400/30 ${config.headerBg} ${config.headerText} p-4`}>
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

        {/* Portada simple */}
        <div className={`print-page bg-white p-10 flex flex-col items-center justify-center relative overflow-hidden ${config.pattern}`}>
          <div className="text-center relative z-10">
            <div className="mb-8">
              <span className="text-6xl">🌟</span>
            </div>

            <h1 className={`text-5xl font-bold mb-4 ${config.titleGradient}`}>
              Tu Vuelta al Sol
            </h1>

            <div className={`${config.divider} w-40 mx-auto my-6`} />

            <h2 className="text-3xl font-semibold text-gray-700 mb-2">
              {userName}
            </h2>

            <p className="text-lg text-gray-500 mt-4">
              {format(startDate, "d 'de' MMMM 'de' yyyy", { locale: es })}
              <br />
              al
              <br />
              {format(endDate, "d 'de' MMMM 'de' yyyy", { locale: es })}
            </p>

            <div className="mt-12">
              <p className="text-sm text-gray-400 italic">
                Tu agenda astrológica personalizada
              </p>
            </div>
          </div>
        </div>

        {/* Placeholder para contenido futuro */}
        <div className="print-page bg-white p-10 text-center flex items-center justify-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-600 mb-4">
              📅 Contenido en Desarrollo
            </h2>
            <p className="text-gray-500">
              Las secciones de la agenda se agregarán en los siguientes pasos:
            </p>
            <ul className="text-left inline-block mt-6 space-y-2 text-gray-600">
              <li>✅ Portal de Entrada</li>
              <li>⏳ Tu Año, Tu Viaje</li>
              <li>⏳ Soul Chart</li>
              <li>⏳ Retorno Solar</li>
              <li>⏳ Ejemplo Enero 2026</li>
              <li>⏳ Meses 2-12</li>
              <li>⏳ Terapias Creativas</li>
              <li>⏳ Cierre de Ciclo</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};
