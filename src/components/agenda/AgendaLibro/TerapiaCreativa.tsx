'use client';

import React from 'react';
import { useStyle } from '@/context/StyleContext';
import { FooterLibro } from './MesCompleto';

// ============ ESCRITURA TERAPÉUTICA ============
export const EscrituraTerapeutica = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white p-12 flex flex-col relative ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>Terapia Astrológica Creativa</span>
        <h2 className={`text-3xl font-display mt-2 ${config.titleGradient}`}>Escritura terapéutica</h2>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full space-y-6">
        <p className={`${config.iconSecondary} italic text-center`}>
          Si resuena contigo, pruébalo.
        </p>

        <div className={`${config.highlightSecondary} border ${config.cardBorder} rounded-lg p-6`}>
          <h4 className={`${config.iconPrimary} font-medium mb-4`}>Instrucciones:</h4>
          <ol className={`${config.iconSecondary} text-sm space-y-2 pl-4`}>
            <li>1. Busca un momento de soledad y silencio.</li>
            <li>2. Respira profundo tres veces.</li>
            <li>3. Lee la pregunta y escribe sin parar durante 10 minutos.</li>
            <li>4. No juzgues lo que escribes. Deja que fluya.</li>
            <li>5. Al terminar, lee lo que escribiste con compasión.</li>
          </ol>
        </div>

        <div className={`border-l-2 ${config.cardBorder} pl-6`}>
          <p className={`${config.iconPrimary} italic mb-4`}>Pregunta disparadora:</p>
          <p className="text-gray-800 text-lg">
            "Si mi cuerpo pudiera hablar, ¿qué me diría que estoy ignorando?"
          </p>
        </div>

        <div className={`${config.highlightPrimary} border ${config.cardBorder} rounded-lg p-6 flex-1`}>
          <div className="space-y-4">
            <div className="h-16 border-b border-dashed border-gray-300" />
            <div className="h-16 border-b border-dashed border-gray-300" />
            <div className="h-16 border-b border-dashed border-gray-300" />
            <div className="h-16 border-b border-dashed border-gray-300" />
            <div className="h-16" />
          </div>
        </div>
      </div>

      <FooterLibro />
    </div>
  );
};

// ============ VISUALIZACIÓN GUIADA ============
export const Visualizacion = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white p-12 flex flex-col relative ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>Terapia Astrológica Creativa</span>
        <h2 className={`text-3xl font-display mt-2 ${config.titleGradient}`}>Visualización guiada</h2>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full space-y-6">
        <p className={`${config.iconSecondary} italic text-center`}>
          Si resuena contigo, pruébalo.
        </p>

        <div className={`${config.highlightSecondary} border ${config.cardBorder} rounded-lg p-6`}>
          <h4 className={`${config.iconPrimary} font-medium mb-4`}>Visualización: Tu yo del futuro</h4>
          <div className={`${config.iconSecondary} text-sm space-y-3`}>
            <p>Cierra los ojos. Respira profundo tres veces.</p>
            <p>Imagina que caminas por un sendero. Al final, hay una versión de ti del futuro esperándote.</p>
            <p>Es la versión de ti que ya completó esta vuelta al sol.</p>
            <p>Mírala. ¿Cómo se ve? ¿Qué energía transmite?</p>
            <p>Acércate y pregúntale: "¿Qué necesito saber para llegar a donde tú estás?"</p>
            <p>Escucha su respuesta.</p>
            <p>Agradece y despídete.</p>
            <p>Abre los ojos cuando estés lista.</p>
          </div>
        </div>

        <div className={`${config.highlightPrimary} border ${config.cardBorder} rounded-lg p-6`}>
          <h4 className={`${config.iconPrimary} font-medium mb-3`}>Lo que vi / escuché / sentí:</h4>
          <div className="space-y-4">
            <div className="h-20 border-b border-dashed border-gray-300" />
            <div className="h-20 border-b border-dashed border-gray-300" />
            <div className="h-20" />
          </div>
        </div>
      </div>

      <FooterLibro />
    </div>
  );
};

// ============ RITUAL SIMBÓLICO ============
export const RitualSimbolico = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white p-12 flex flex-col relative ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>Terapia Astrológica Creativa</span>
        <h2 className={`text-3xl font-display mt-2 ${config.titleGradient}`}>Ritual simbólico</h2>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full space-y-6">
        <p className={`${config.iconSecondary} italic text-center`}>
          Si resuena contigo, pruébalo.
        </p>

        <div className={`${config.highlightSecondary} border ${config.cardBorder} rounded-lg p-6`}>
          <h4 className={`${config.iconPrimary} font-medium mb-4`}>Ritual de liberación</h4>
          <div className={`${config.iconSecondary} text-sm space-y-2 mb-4`}>
            <p><span className={`${config.iconPrimary}`}>Necesitas:</span> Papel, bolígrafo, un lugar donde puedas quemar papel de forma segura.</p>
          </div>
          <ol className={`${config.iconSecondary} text-sm space-y-2 pl-4`}>
            <li>1. Escribe en el papel todo lo que quieres soltar.</li>
            <li>2. No te censures. Puede ser un nombre, una emoción, un miedo, un patrón.</li>
            <li>3. Lee lo que escribiste en voz alta (solo para ti).</li>
            <li>4. Quema el papel con intención, visualizando cómo eso se transforma.</li>
            <li>5. Respira profundo. Ya no te pertenece.</li>
          </ol>
        </div>

        <div className={`${config.highlightPrimary} border ${config.cardBorder} rounded-lg p-6`}>
          <h4 className={`${config.iconPrimary} font-medium mb-3`}>Lo que solté hoy:</h4>
          <div className="space-y-4">
            <div className="h-16 border-b border-dashed border-gray-300" />
            <div className="h-16 border-b border-dashed border-gray-300" />
          </div>
        </div>

        <div className={`${config.highlightPrimary} border ${config.cardBorder} rounded-lg p-6`}>
          <h4 className={`${config.iconPrimary} font-medium mb-3`}>Lo que siento ahora:</h4>
          <div className="space-y-4">
            <div className="h-16 border-b border-dashed border-gray-300" />
            <div className="h-16" />
          </div>
        </div>
      </div>

      <FooterLibro />
    </div>
  );
};

// ============ TRABAJO EMOCIONAL ============
export const TrabajoEmocional = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white p-12 flex flex-col relative ${config.pattern}`}>
      <div className="text-center mb-8">
        <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>Terapia Astrológica Creativa</span>
        <h2 className={`text-3xl font-display mt-2 ${config.titleGradient}`}>Trabajo emocional</h2>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full space-y-6">
        <p className={`${config.iconSecondary} italic text-center`}>
          Si resuena contigo, pruébalo.
        </p>

        <div className={`${config.highlightSecondary} border ${config.cardBorder} rounded-lg p-6`}>
          <h4 className={`${config.iconPrimary} font-medium mb-4`}>Ejercicio: El mapa de mis emociones</h4>
          <p className={`${config.iconSecondary} text-sm mb-4`}>
            Cierra los ojos. Escanea tu cuerpo de pies a cabeza.
            ¿Dónde sientes tensión? ¿Dónde sientes ligereza?
            Dibuja o escribe lo que encuentres.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`${config.highlightPrimary} border ${config.cardBorder} rounded-lg p-4`}>
            <h5 className={`${config.iconPrimary} text-sm font-medium mb-2`}>Dónde siento tensión:</h5>
            <div className="h-24 border-b border-dashed border-gray-300" />
          </div>
          <div className={`${config.highlightPrimary} border ${config.cardBorder} rounded-lg p-4`}>
            <h5 className={`${config.iconPrimary} text-sm font-medium mb-2`}>Dónde siento ligereza:</h5>
            <div className="h-24 border-b border-dashed border-gray-300" />
          </div>
        </div>

        <div className={`${config.highlightSecondary} border ${config.cardBorder} rounded-lg p-6`}>
          <h4 className={`${config.iconPrimary} font-medium mb-3`}>¿Qué me está diciendo mi cuerpo?</h4>
          <div className="space-y-4">
            <div className="h-16 border-b border-dashed border-gray-300" />
            <div className="h-16 border-b border-dashed border-gray-300" />
            <div className="h-16" />
          </div>
        </div>
      </div>

      <FooterLibro />
    </div>
  );
};

// ============ ESCRITURA MENSUAL (para CADA mes) ============
// Página de diario/escritura terapéutica con directrices adaptadas al mes
const DIRECTRICES_MENSUALES: Record<number, { pregunta: string; guia: string }> = {
  1: { pregunta: '¿Cómo quiero empezar este ciclo? ¿Qué necesito para sentirme en mi centro?', guia: 'Inicio del ciclo: conecta con tu intención' },
  2: { pregunta: '¿Qué necesito soltar del mes anterior para avanzar más ligera?', guia: 'Segundo mes: ajustar el paso' },
  3: { pregunta: '¿Qué patrón estoy repitiendo sin darme cuenta? ¿Qué quiero cambiar?', guia: 'Tercer mes: observar patrones' },
  4: { pregunta: '¿Qué me está enseñando la incomodidad que siento? ¿Dónde me resisto?', guia: 'Cuarto mes: abrazar la incomodidad' },
  5: { pregunta: '¿Qué está creciendo dentro de mí que aún no tiene nombre?', guia: 'Quinto mes: nombrar lo invisible' },
  6: { pregunta: '¿Estoy donde quiero estar? ¿Qué necesito ajustar para la segunda mitad del año?', guia: 'Mitad del ciclo: punto de revisión' },
  7: { pregunta: '¿A quién necesito perdonar (incluyéndome a mí misma)?', guia: 'Séptimo mes: soltar cargas' },
  8: { pregunta: '¿Qué logro quiero celebrar, por pequeño que sea?', guia: 'Octavo mes: reconocer avances' },
  9: { pregunta: '¿Qué versión de mí está emergiendo? ¿Qué necesita esa versión?', guia: 'Noveno mes: la nueva yo' },
  10: { pregunta: '¿Qué me da miedo perder? ¿Qué pasaría si lo suelto?', guia: 'Décimo mes: profundizar' },
  11: { pregunta: '¿Qué aprendí este año que no esperaba? ¿Cómo me transformó?', guia: 'Undécimo mes: integrar' },
  12: { pregunta: '¿Qué me llevo de este ciclo? ¿Qué dejo atrás?', guia: 'Cierre del ciclo: preparar el siguiente' },
  13: { pregunta: '¿Quién era cuando empecé y quién soy ahora?', guia: 'Tu nueva vuelta al Sol comienza' },
};

interface EscrituraMensualProps {
  mesNumero: number;
  mantra?: string;
}

export const EscrituraMensual: React.FC<EscrituraMensualProps> = ({ mesNumero, mantra }) => {
  const { config } = useStyle();
  const directriz = DIRECTRICES_MENSUALES[mesNumero] || DIRECTRICES_MENSUALES[1];

  return (
    <div className={`print-page bg-white p-12 flex flex-col relative ${config.pattern}`}>
      <div className="text-center mb-6">
        <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>{directriz.guia}</span>
        <h2 className={`text-2xl font-display mt-2 ${config.titleGradient}`}>Mi Diario del Mes</h2>
        <div className={`${config.divider} w-16 mx-auto mt-3`} />
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full flex flex-col">
        {/* Pregunta disparadora */}
        <div className={`${config.highlightSecondary} border ${config.cardBorder} rounded-lg p-5 mb-4`}>
          <p className={`${config.iconPrimary} italic text-base leading-relaxed text-center`}>
            "{directriz.pregunta}"
          </p>
        </div>

        {/* Instrucción breve */}
        <p className="text-xs text-gray-500 italic text-center mb-4">
          Escribe sin filtro. No juzgues. Nadie más leerá esto.
        </p>

        {/* Espacio de escritura amplio */}
        <div className={`${config.highlightPrimary} rounded-lg p-6 flex-1`}>
          <div className="space-y-5">
            <div className="h-12 border-b border-dashed border-gray-300" />
            <div className="h-12 border-b border-dashed border-gray-300" />
            <div className="h-12 border-b border-dashed border-gray-300" />
            <div className="h-12 border-b border-dashed border-gray-300" />
            <div className="h-12 border-b border-dashed border-gray-300" />
            <div className="h-12 border-b border-dashed border-gray-300" />
            <div className="h-12 border-b border-dashed border-gray-300" />
            <div className="h-12 border-b border-dashed border-gray-300" />
          </div>
        </div>

        {/* Mantra del mes si existe */}
        {mantra && (
          <div className="mt-4 text-center">
            <p className={`${config.iconSecondary} italic text-sm`}>
              Mantra del mes: "{mantra}"
            </p>
          </div>
        )}
      </div>

      <FooterLibro />
    </div>
  );
};

export default EscrituraTerapeutica;
