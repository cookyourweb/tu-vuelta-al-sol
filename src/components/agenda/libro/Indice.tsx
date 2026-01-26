'use client';

import { useStyle } from '@/context/StyleContext';

interface IndiceProps {
  startYear: number;
  endYear: number;
}

export default function Indice({ startYear, endYear }: IndiceProps) {
  const { config } = useStyle();

  const secciones = [
    { titulo: 'Carta de Bienvenida', pagina: 3 },
    { titulo: 'El Tema de Tu Año', pagina: 4 },
    { titulo: 'Primer Día del Ciclo', pagina: 5 },
    { titulo: 'Tu Año, Tu Viaje', pagina: 6 },
    { titulo: 'Soul Chart - Tu Mapa Interior', pagina: 7 },
    { titulo: `Retorno Solar ${startYear}-${endYear}`, pagina: 8 },
    { titulo: 'Calendario Anual', pagina: 9 },
    { titulo: 'Mes a Mes', pagina: 10, subsecciones: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]},
    { titulo: 'Terapia Astrológica Creativa', pagina: null },
    { titulo: 'Cierre del Ciclo', pagina: null },
    { titulo: 'Último Día del Ciclo', pagina: null },
  ];

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      <div className="max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12 pb-6 border-b border-cosmic-gold/20">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <span className="text-cosmic-gold text-sm">✧</span>
            <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>
              Tu Viaje Paso a Paso
            </span>
            <span className="text-cosmic-gold text-sm">✧</span>
          </div>
          <h2 className="font-display text-5xl text-cosmic-gold mb-3">Índice</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
        </div>

        {/* Introducción */}
        <div className="mb-10 bg-cosmic-purple/5 border border-cosmic-gold/20 rounded-lg p-6">
          <p className="font-body text-base text-gray-700 leading-relaxed italic text-center">
            Este libro está organizado como un viaje espiral: cada sección te lleva más profundo
            en el autoconocimiento y la conexión con los ritmos del universo.
          </p>
        </div>

        {/* Lista de secciones */}
        <div className="space-y-3">
          {secciones.map((seccion, idx) => (
            <div key={idx}>
              {/* Sección principal */}
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-cosmic-gold text-sm">☉</span>
                  <span className="font-display text-lg text-gray-800">
                    {seccion.titulo}
                  </span>
                </div>
                {seccion.pagina && (
                  <span className="font-body text-sm text-gray-500 ml-4">
                    pág. {seccion.pagina}
                  </span>
                )}
              </div>

              {/* Subsecciones */}
              {seccion.subsecciones && (
                <div className="ml-8 mt-2 space-y-2">
                  {seccion.subsecciones.map((sub, subIdx) => (
                    <div key={subIdx} className="flex items-center gap-2 py-1">
                      <span className="text-cosmic-gold text-xs">•</span>
                      <span className="font-body text-sm text-gray-600">{sub}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer decorativo */}
        <div className="mt-12 flex items-center justify-center space-x-3">
          <span className="text-cosmic-gold text-sm">✧</span>
          <span className="text-cosmic-gold text-sm">☉</span>
          <span className="text-cosmic-gold text-sm">✧</span>
        </div>
      </div>

      {/* Número de página */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <span className="text-xs text-gray-400 font-body">2</span>
      </div>
    </div>
  );
}
