'use client';

import React from 'react';
import { useStyle } from '@/context/StyleContext';

// Props interface for therapy pages
interface TerapiaCreativaProps {
  patronesInconscientes?: string; // Patrones de carta natal
  desafiosEvolutivos?: string[];  // Desafíos evolutivos
  nodoSur?: string;               // Nodo sur (zona de confort)
}

// ============ TU ZONA CONOCIDA (Nueva página) ============
export const TuZonaConocida: React.FC<TerapiaCreativaProps> = ({
  patronesInconscientes,
  desafiosEvolutivos,
  nodoSur
}) => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header decorativo */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <span className="text-cosmic-gold text-xl">✧</span>
          <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>Terapia Astrológica Creativa</span>
          <span className="text-cosmic-gold text-xl">✧</span>
        </div>
        <h2 className="font-display text-4xl text-cosmic-gold mb-4">Tu zona conocida</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full space-y-5">
        {/* Lo que dice tu carta natal */}
        <div className="bg-cosmic-purple/5 border border-cosmic-gold/20 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-cosmic-gold text-lg">☽</span>
            <h4 className="font-display text-lg text-cosmic-gold">Lo que tu carta natal revela</h4>
          </div>
          <p className="font-body text-gray-700 leading-relaxed text-sm">
            Según tu carta natal, estos son los patrones que tiendes a repetir:
          </p>

          {nodoSur && (
            <div className="mt-3 bg-white/50 rounded p-3">
              <p className="font-body text-sm text-gray-700 font-semibold mb-1">Tu Nodo Sur (zona de confort):</p>
              <p className="font-body text-sm text-gray-600 italic">{nodoSur}</p>
            </div>
          )}

          {patronesInconscientes && (
            <div className="mt-3 bg-white/50 rounded p-3">
              <p className="font-body text-sm text-gray-700 font-semibold mb-1">Patrones inconscientes:</p>
              <p className="font-body text-sm text-gray-600">{patronesInconscientes}</p>
            </div>
          )}

          {desafiosEvolutivos && desafiosEvolutivos.length > 0 && (
            <div className="mt-3 bg-white/50 rounded p-3">
              <p className="font-body text-sm text-gray-700 font-semibold mb-1">Desafíos a trabajar:</p>
              <ul className="font-body text-sm text-gray-600 list-disc list-inside">
                {desafiosEvolutivos.slice(0, 3).map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Pregunta terapéutica */}
        <div className="bg-gradient-to-br from-cosmic-gold/10 to-cosmic-purple/5 border-l-4 border-cosmic-gold rounded-r-lg p-5">
          <p className="font-display text-cosmic-gold mb-2 text-base">Pregunta para reflexionar:</p>
          <p className="font-body text-gray-800 text-lg italic leading-relaxed">
            "¿Qué patrón repites esperando resultados distintos?"
          </p>
        </div>

        {/* Espacio de escritura */}
        <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-5">
          <div className="flex items-center justify-center mb-3">
            <span className="text-cosmic-gold text-sm">✦ Tu reflexión ✦</span>
          </div>
          <div className="space-y-3">
            <div className="h-14 border-b border-dashed border-gray-300" />
            <div className="h-14 border-b border-dashed border-gray-300" />
            <div className="h-14 border-b border-dashed border-gray-300" />
            <div className="h-14 border-b border-dashed border-gray-300" />
            <div className="h-14" />
          </div>
        </div>

        {/* Cierre reflexivo */}
        <div className="text-center pt-2">
          <p className="font-body text-gray-600 italic text-sm">
            "Lo que repites te muestra dónde tu alma pide atención."
          </p>
        </div>
      </div>
    </div>
  );
};

// ============ ESCRITURA TERAPÉUTICA ============
export const EscrituraTerapeutica: React.FC<TerapiaCreativaProps> = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header decorativo */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <span className="text-cosmic-gold text-xl">✧</span>
          <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>Terapia Astrológica Creativa</span>
          <span className="text-cosmic-gold text-xl">✧</span>
        </div>
        <h2 className="font-display text-4xl text-cosmic-gold mb-4">Escritura terapéutica</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full space-y-6">
        <div className="text-center mb-6">
          <p className={`${config.iconSecondary} italic text-lg`}>
            Si resuena contigo, pruébalo.
          </p>
        </div>

        {/* Instrucciones con fondo */}
        <div className="bg-cosmic-purple/5 border border-cosmic-gold/20 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-cosmic-gold text-lg">☉</span>
            <h4 className="font-display text-xl text-cosmic-gold">Instrucciones</h4>
          </div>
          <ol className="font-body text-gray-700 leading-relaxed space-y-2">
            <li className="flex items-start">
              <span className="text-cosmic-gold mr-3 mt-1">1.</span>
              <span>Busca un momento de soledad y silencio.</span>
            </li>
            <li className="flex items-start">
              <span className="text-cosmic-gold mr-3 mt-1">2.</span>
              <span>Respira profundo tres veces.</span>
            </li>
            <li className="flex items-start">
              <span className="text-cosmic-gold mr-3 mt-1">3.</span>
              <span>Lee la pregunta y escribe sin parar durante 10 minutos.</span>
            </li>
            <li className="flex items-start">
              <span className="text-cosmic-gold mr-3 mt-1">4.</span>
              <span>No juzgues lo que escribes. Deja que fluya.</span>
            </li>
            <li className="flex items-start">
              <span className="text-cosmic-gold mr-3 mt-1">5.</span>
              <span>Al terminar, lee lo que escribiste con compasión.</span>
            </li>
          </ol>
        </div>

        {/* Pregunta disparadora */}
        <div className="bg-gradient-to-br from-cosmic-gold/10 to-cosmic-purple/5 border-l-4 border-cosmic-gold rounded-r-lg p-6">
          <p className="font-display text-cosmic-gold mb-3 text-lg">Pregunta disparadora:</p>
          <p className="font-body text-gray-800 text-xl italic leading-relaxed">
            "Si mi cuerpo pudiera hablar, ¿qué me diría que estoy ignorando?"
          </p>
        </div>

        {/* Espacio de escritura decorado */}
        <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-6">
          <div className="flex items-center justify-center mb-4">
            <span className="text-cosmic-gold text-sm">✦ Espacio para tu escritura ✦</span>
          </div>
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
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header decorativo */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <span className="text-cosmic-gold text-xl">✧</span>
          <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>Terapia Astrológica Creativa</span>
          <span className="text-cosmic-gold text-xl">✧</span>
        </div>
        <h2 className="font-display text-4xl text-cosmic-gold mb-4">Visualización guiada</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full space-y-6">
        <div className="text-center mb-6">
          <p className={`${config.iconSecondary} italic text-lg`}>
            Si resuena contigo, pruébalo.
          </p>
        </div>

        {/* Guión de visualización */}
        <div className="bg-cosmic-purple/5 border border-cosmic-gold/20 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-cosmic-gold text-lg">☽</span>
            <h4 className="font-display text-xl text-cosmic-gold">Visualización: Tu yo del futuro</h4>
          </div>
          <div className="font-body text-gray-700 leading-relaxed space-y-3">
            <p>Cierra los ojos. Respira profundo tres veces.</p>
            <p>Imagina que caminas por un sendero. Al final, hay una versión de ti del futuro esperándote.</p>
            <p>Es la versión de ti que ya completó esta vuelta al sol.</p>
            <p>Mírala. ¿Cómo se ve? ¿Qué energía transmite?</p>
            <p className="text-cosmic-gold italic">Acércate y pregúntale: "¿Qué necesito saber para llegar a donde tú estás?"</p>
            <p>Escucha su respuesta.</p>
            <p>Agradece y despídete.</p>
            <p>Abre los ojos cuando estés lista.</p>
          </div>
        </div>

        {/* Espacio para registrar */}
        <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-cosmic-gold">✦</span>
            <h4 className="font-display text-lg text-cosmic-gold">Lo que vi / escuché / sentí:</h4>
          </div>
          <div className="space-y-4">
            <div className="h-20 border-b border-dashed border-gray-300" />
            <div className="h-20 border-b border-dashed border-gray-300" />
            <div className="h-20" />
          </div>
        </div>

        {/* Cierre reflexivo */}
        <div className="bg-gradient-to-br from-cosmic-gold/10 to-cosmic-purple/5 rounded-lg p-4 text-center">
          <p className="font-body text-gray-700 italic text-sm">
            "El futuro ya vive en ti. Solo necesitas permiso para encontrarlo."
          </p>
        </div>
      </div>
    </div>
  );
};

// ============ RITUAL SIMBÓLICO ============
export const RitualSimbolico = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header decorativo */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <span className="text-cosmic-gold text-xl">✧</span>
          <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>Terapia Astrológica Creativa</span>
          <span className="text-cosmic-gold text-xl">✧</span>
        </div>
        <h2 className="font-display text-4xl text-cosmic-gold mb-4">Ritual simbólico</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full space-y-6">
        <div className="text-center mb-6">
          <p className={`${config.iconSecondary} italic text-lg`}>
            Si resuena contigo, pruébalo.
          </p>
        </div>

        {/* Instrucciones del ritual */}
        <div className="bg-cosmic-purple/5 border border-cosmic-gold/20 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-cosmic-gold text-lg">✦</span>
            <h4 className="font-display text-xl text-cosmic-gold">Ritual de liberación</h4>
          </div>
          <div className="mb-4">
            <p className="font-body text-gray-700 mb-3">
              <span className="text-cosmic-gold font-semibold">Necesitas:</span> Papel, bolígrafo, un lugar donde puedas quemar papel de forma segura.
            </p>
          </div>
          <ol className="font-body text-gray-700 leading-relaxed space-y-2">
            <li className="flex items-start">
              <span className="text-cosmic-gold mr-3 mt-1 font-semibold">1.</span>
              <span>Escribe en el papel todo lo que quieres soltar.</span>
            </li>
            <li className="flex items-start">
              <span className="text-cosmic-gold mr-3 mt-1 font-semibold">2.</span>
              <span>No te censures. Puede ser un nombre, una emoción, un miedo, un patrón.</span>
            </li>
            <li className="flex items-start">
              <span className="text-cosmic-gold mr-3 mt-1 font-semibold">3.</span>
              <span>Lee lo que escribiste en voz alta (solo para ti).</span>
            </li>
            <li className="flex items-start">
              <span className="text-cosmic-gold mr-3 mt-1 font-semibold">4.</span>
              <span>Quema el papel con intención, visualizando cómo eso se transforma.</span>
            </li>
            <li className="flex items-start">
              <span className="text-cosmic-gold mr-3 mt-1 font-semibold">5.</span>
              <span>Respira profundo. Ya no te pertenece.</span>
            </li>
          </ol>
        </div>

        {/* Registro: Lo que solté */}
        <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-cosmic-gold">☉</span>
            <h4 className="font-display text-lg text-cosmic-gold">Lo que solté hoy:</h4>
          </div>
          <div className="space-y-4">
            <div className="h-16 border-b border-dashed border-gray-300" />
            <div className="h-16 border-b border-dashed border-gray-300" />
          </div>
        </div>

        {/* Registro: Cómo me siento */}
        <div className="bg-gradient-to-br from-cosmic-gold/10 to-cosmic-purple/5 border-l-4 border-cosmic-gold rounded-r-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-cosmic-gold">✧</span>
            <h4 className="font-display text-lg text-cosmic-gold">Lo que siento ahora:</h4>
          </div>
          <div className="space-y-4">
            <div className="h-16 border-b border-dashed border-gray-300" />
            <div className="h-16" />
          </div>
        </div>

        {/* Cierre */}
        <div className="text-center pt-4">
          <p className="font-body text-gray-600 italic text-sm">
            "Soltar no es olvidar. Es dejar de cargar lo que ya no te sirve."
          </p>
        </div>
      </div>
    </div>
  );
};

// ============ TRABAJO EMOCIONAL ============
export const TrabajoEmocional = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header decorativo */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <span className="text-cosmic-gold text-xl">✧</span>
          <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>Terapia Astrológica Creativa</span>
          <span className="text-cosmic-gold text-xl">✧</span>
        </div>
        <h2 className="font-display text-4xl text-cosmic-gold mb-4">Trabajo emocional</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full space-y-6">
        <div className="text-center mb-6">
          <p className={`${config.iconSecondary} italic text-lg`}>
            Si resuena contigo, pruébalo.
          </p>
        </div>

        {/* Instrucciones del ejercicio */}
        <div className="bg-cosmic-purple/5 border border-cosmic-gold/20 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-cosmic-gold text-lg">☽</span>
            <h4 className="font-display text-xl text-cosmic-gold">Ejercicio: El mapa de mis emociones</h4>
          </div>
          <p className="font-body text-gray-700 leading-relaxed">
            Cierra los ojos. Escanea tu cuerpo de pies a cabeza.
            ¿Dónde sientes tensión? ¿Dónde sientes ligereza?
            Dibuja o escribe lo que encuentres.
          </p>
        </div>

        {/* Mapa corporal */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-cosmic-gold">✦</span>
              <h5 className="font-display text-base text-cosmic-gold">Dónde siento tensión:</h5>
            </div>
            <div className="h-24 border-b border-dashed border-gray-300" />
            <div className="h-24" />
          </div>
          <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-cosmic-gold">✧</span>
              <h5 className="font-display text-base text-cosmic-gold">Dónde siento ligereza:</h5>
            </div>
            <div className="h-24 border-b border-dashed border-gray-300" />
            <div className="h-24" />
          </div>
        </div>

        {/* Reflexión profunda */}
        <div className="bg-gradient-to-br from-cosmic-gold/10 to-cosmic-purple/5 border-l-4 border-cosmic-gold rounded-r-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-cosmic-gold text-lg">☉</span>
            <h4 className="font-display text-lg text-cosmic-gold">¿Qué me está diciendo mi cuerpo?</h4>
          </div>
          <div className="space-y-4">
            <div className="h-16 border-b border-dashed border-gray-300" />
            <div className="h-16 border-b border-dashed border-gray-300" />
            <div className="h-16" />
          </div>
        </div>

        {/* Cierre reflexivo */}
        <div className="text-center pt-4">
          <p className="font-body text-gray-600 italic text-sm">
            "Tu cuerpo nunca miente. Escúchalo con compasión."
          </p>
        </div>
      </div>
    </div>
  );
};

export default { TuZonaConocida, EscrituraTerapeutica, Visualizacion, RitualSimbolico, TrabajoEmocional };
