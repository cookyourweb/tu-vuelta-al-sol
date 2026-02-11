import React from 'react';
import { Star, Target, Sparkles, MessageCircle } from 'lucide-react';
import SectionNavigation from './SectionNavigation';
import { formatDate } from './helpers';

interface SolarReturnIntegrationSectionProps {
  birthData: any;
}

export default function SolarReturnIntegrationSection({
  birthData
}: SolarReturnIntegrationSectionProps) {
  return (
    <div id="integracion" className="max-w-4xl mx-auto mb-12 scroll-mt-24">
      <SectionNavigation currentSection="integracion" />
      <div className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border-2 border-emerald-400/40 shadow-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-emerald-600/30 to-teal-600/30 backdrop-blur-sm rounded-2xl px-6 py-3 mb-4 border border-emerald-400/30">
            <Star className="w-10 h-10 text-emerald-300" />
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300 mb-3">
            Integración Final
          </h3>
          <p className="text-emerald-200 text-lg">
            Síntesis de Tu Revolución Solar
          </p>
        </div>

        {/* Contenido */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-800/40 to-teal-800/40 backdrop-blur-sm rounded-2xl p-6 border border-emerald-400/20">
            <h4 className="text-emerald-100 font-bold text-xl mb-4 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-emerald-200" />
              Síntesis del Año
            </h4>
            <p className="text-emerald-50 text-base leading-relaxed">
              Este año {new Date().getFullYear()}-{new Date().getFullYear() + 1} es tu <strong>LABORATORIO DE TRANSFORMACIÓN CONSCIENTE</strong>.
              No es tiempo de víctimas ni espectadores - es tiempo de <strong>PROTAGONISTAS REVOLUCIONARIOS</strong>.
              Cada Luna Nueva es un reinicio. Cada decisión cuenta. Cada acción crea tu realidad.
            </p>
          </div>

          <div className="bg-gradient-to-r from-teal-800/40 to-emerald-800/40 backdrop-blur-sm rounded-2xl p-6 border border-teal-400/20">
            <h4 className="text-teal-100 font-bold text-xl mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-teal-200" />
              Tu Poder de Elección
            </h4>
            <p className="text-teal-50 text-base leading-relaxed">
              El Solar Return te entrega el <strong>MAPA</strong> - tú decides si lo sigues con valentía disruptiva
              o lo ignoras por comodidad mediocre. La astrología no predice - <strong>PREPARA</strong>.
              Usa este conocimiento para volverte <strong>ANTIFRÁGIL</strong>: más fuerte ante cada desafío,
              más consciente ante cada oportunidad, más auténtico ante cada elección.
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-900/60 to-teal-900/60 backdrop-blur-sm rounded-2xl p-8 border-2 border-emerald-400/40">
            <h4 className="text-emerald-100 font-bold text-xl mb-4 flex items-center gap-2 justify-center">
              <Sparkles className="w-6 h-6 text-emerald-200" />
              Pregunta para Reflexionar
            </h4>
            <p className="text-emerald-50 text-lg md:text-xl font-semibold text-center italic leading-relaxed">
              "¿Qué versión de ti mismo/a elegirás manifestar este año:
              la <strong className="text-emerald-300">VALIENTE y AUTÉNTICA</strong>,
              o la <strong className="text-gray-400">cómoda y conocida</strong>?"
            </p>
          </div>

          <div className="text-center mt-8">
            <p className="text-emerald-200 text-sm">
Tu revolución personal ya comenzó
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
