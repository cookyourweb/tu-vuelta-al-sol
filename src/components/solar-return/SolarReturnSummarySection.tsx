import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SolarReturnSummarySection() {
  return (
    <div id="resumen" className="max-w-4xl mx-auto mb-12 scroll-mt-24">
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-2xl p-8 border border-purple-400/30">
        <h2 className="text-2xl font-bold text-purple-100 mb-4 flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-purple-300" />
          ¿Qué es la Revolución Solar?
        </h2>
        <div className="space-y-4 text-purple-50">
          <p className="leading-relaxed">
            La <strong>Revolución Solar</strong> es la carta astral levantada para el momento exacto
            en que el Sol regresa a la posición que tenía cuando naciste. Este evento ocurre cerca
            de tu cumpleaños cada año y marca el inicio de un nuevo ciclo anual.
          </p>
          <div className="bg-purple-800/30 rounded-lg p-4">
            <p className="text-sm text-purple-200">
              <strong>💡 Dato clave:</strong> El Sol siempre está en la misma posición zodiacal
              que en tu carta natal, pero los otros planetas cambian, creando un mapa único de
              energías disponibles para los próximos 12 meses.
            </p>
          </div>
          <p className="leading-relaxed">
            Esta técnica predictiva te permite conocer las áreas de vida que se activarán,
            los desafíos que enfrentarás y las oportunidades que surgirán durante tu año personal.
          </p>
        </div>
      </div>
    </div>
  );
}
