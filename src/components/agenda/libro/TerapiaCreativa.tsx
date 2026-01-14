'use client';

import React from 'react';
import { useStyle } from '@/context/StyleContext';

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
    </div>
  );
};

export default { EscrituraTerapeutica, Visualizacion, RitualSimbolico, TrabajoEmocional };
