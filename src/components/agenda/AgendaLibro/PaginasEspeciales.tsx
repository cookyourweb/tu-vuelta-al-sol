'use client';

import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/context/StyleContext';
import { Sun, Moon, Star, Heart, Sparkles } from 'lucide-react';
import { FooterLibro } from './MesCompleto';

// ============ HELPER: Normalizar fecha para evitar problemas de timezone ============
// Cuando una fecha UTC se convierte a local, puede cambiar el día
// Esta función crea una fecha local con los mismos valores de año/mes/día
const normalizeDateForDisplay = (date: Date): Date => {
  // Si la fecha viene de UTC, crear nueva fecha local con los mismos valores
  const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return normalized;
};

// ============ LÍNEAS DE ESCRITURA ============
const LineasEscritura = ({ count = 6, spacing = 28 }: { count?: number; spacing?: number }) => (
  <div className="flex flex-col">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="border-b border-gray-200" style={{ height: `${spacing}px` }} />
    ))}
  </div>
);

// ============ PRIMER DÍA DEL CICLO ============
// Esta página va DESPUÉS de todas las interpretaciones (Natal + Solar Return)
// Para que el usuario reflexione con toda la información que acaba de leer
export const PrimerDiaCiclo: React.FC<{
  fecha: Date;
  nombre: string;
  temaCentral?: string;
  mandato?: string;
}> = ({ fecha, nombre, temaCentral, mandato }) => {
  const { config } = useStyle();

  // Normalizar fecha para evitar problemas de timezone
  const fechaNormalizada = normalizeDateForDisplay(fecha);

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '20mm' }}>
      <div className="flex-1 flex flex-col items-center text-center">
        <Sun className={`w-14 h-14 ${config.iconAccent} mb-4`} />
        <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>
          {format(fechaNormalizada, "d 'de' MMMM, yyyy", { locale: es })}
        </span>
        <h1 className={`text-3xl font-display ${config.titleGradient} mt-3 mb-2`}>
          Antes de Empezar
        </h1>
        <p className={`text-base ${config.iconSecondary} mb-4`}>Ritual de apertura para {nombre}</p>

        <div className={`${config.divider} w-24 my-4`} />

        {/* Introducción al ritual */}
        <div className={`max-w-lg text-left mb-6 ${config.highlightSecondary} p-5 rounded-lg`}>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            <strong>Ahora que ya has leído quién eres y qué se activa este año</strong>,
            es momento de hacer una pausa consciente.
          </p>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            Antes de empezar con tu agenda:
          </p>
          <ul className="text-gray-600 text-sm space-y-2 ml-4">
            <li>🕯️ Busca un lugar tranquilo</li>
            <li>☕ Prepárate una infusión o tu bebida favorita</li>
            <li>✨ Enciende una vela si te apetece</li>
            <li>🌬️ Respira profundo tres veces</li>
          </ul>
          <p className="text-gray-600 text-sm italic mt-4">
            Este es tu momento. Sin prisas, sin presión. Solo tú y tu nuevo ciclo.
          </p>
        </div>

        {/* Secciones para escribir */}
        <div className="max-w-md space-y-4 text-left w-full">
          <div className={`${config.highlightPrimary} p-4`}>
            <h3 className={`text-xs font-bold uppercase ${config.iconPrimary} mb-2`}>¿Qué sensaciones te ha dejado esta lectura?</h3>
            <LineasEscritura count={3} spacing={24} />
          </div>

          <div className={`${config.highlightAccent} p-4`}>
            <h3 className={`text-xs font-bold uppercase ${config.iconAccent} mb-2`}>¿Qué palabra resume lo que quieres para este año?</h3>
            <LineasEscritura count={2} spacing={24} />
          </div>

          <div className={`${config.highlightSecondary} p-4`}>
            <h3 className={`text-xs font-bold uppercase ${config.iconSecondary} mb-2`}>¿Qué te inspira empezar hoy?</h3>
            <LineasEscritura count={3} spacing={24} />
          </div>
        </div>
      </div>

      <FooterLibro />
    </div>
  );
};

// ============ ÚLTIMO DÍA DEL CICLO ============
export const UltimoDiaCiclo: React.FC<{
  fecha: Date;
  nombre: string;
}> = ({ fecha, nombre }) => {
  const { config } = useStyle();

  // Normalizar fecha para evitar problemas de timezone
  const fechaNormalizada = normalizeDateForDisplay(fecha);

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '20mm' }}>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <Moon className={`w-16 h-16 ${config.iconPrimary} mb-6`} />
        <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>
          {format(fechaNormalizada, "d 'de' MMMM, yyyy", { locale: es })}
        </span>
        <h1 className={`text-4xl font-display ${config.titleGradient} mt-4 mb-2`}>
          Último Día del Ciclo
        </h1>
        <p className={`text-lg ${config.iconSecondary} mb-8`}>Cierre y preparación, {nombre}</p>

        <div className={`${config.divider} w-32 my-8`} />

        <div className="max-w-md space-y-6 text-left w-full">
          <div className={`${config.highlightSecondary} p-5`}>
            <h3 className={`text-sm font-bold uppercase ${config.iconSecondary} mb-3`}>Lo más importante que aprendí</h3>
            <LineasEscritura count={4} spacing={28} />
          </div>

          <div className={`${config.highlightPrimary} p-5`}>
            <h3 className={`text-sm font-bold uppercase ${config.iconPrimary} mb-3`}>¿Quién era hace un año? ¿Quién soy hoy?</h3>
            <LineasEscritura count={4} spacing={28} />
          </div>

          <div className={`${config.highlightAccent} p-5`}>
            <h3 className={`text-sm font-bold uppercase ${config.iconAccent} mb-3`}>Carta de gratitud a mí mismo/a</h3>
            <LineasEscritura count={4} spacing={28} />
          </div>
        </div>
      </div>

      <FooterLibro />
    </div>
  );
};

// ============ CIERRE DE MES ============
export const CierreMes: React.FC<{
  monthDate: Date;
}> = ({ monthDate }) => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '20mm' }}>
      <div className="text-center mb-6">
        <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>Cierre</span>
        <h1 className={`text-2xl font-display ${config.titleGradient} capitalize`}>
          {format(monthDate, 'MMMM yyyy', { locale: es })}
        </h1>
        <div className={`${config.divider} w-24 mx-auto mt-4`} />
      </div>

      <div className="flex-1 space-y-6">
        <div className={`${config.highlightSecondary} p-5`}>
          <h3 className={`text-sm font-bold uppercase ${config.iconSecondary} mb-3`}>¿Qué cambió en mí este mes?</h3>
          <LineasEscritura count={5} spacing={28} />
        </div>

        <div className={`${config.highlightPrimary} p-5`}>
          <h3 className={`text-sm font-bold uppercase ${config.iconPrimary} mb-3`}>¿Qué solté sin darme cuenta?</h3>
          <LineasEscritura count={5} spacing={28} />
        </div>

        <div className={`${config.highlightAccent} p-5`}>
          <h3 className={`text-sm font-bold uppercase ${config.iconAccent} mb-3`}>¿Qué descubrí de mí?</h3>
          <LineasEscritura count={5} spacing={28} />
        </div>

        <div className={`${config.headerBg} p-5 text-center`}>
          <span className={`text-[10px] uppercase ${config.headerText} opacity-70`}>Una palabra que resume este mes</span>
          <div className="border-b border-current/30 h-10 mt-3 max-w-xs mx-auto" />
        </div>
      </div>

      <FooterLibro />
    </div>
  );
};

// ============ CIERRE DEL CICLO ============
export const QuienEraQuienSoy = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b-2 border-gray-200">
        <span className={`text-[10px] uppercase tracking-[0.3em] ${config.iconSecondary}`}>Cierre de Ciclo</span>
        <h2 className={`text-2xl font-display mt-2 ${config.titleGradient}`}>El viaje completado</h2>
        <Star className={`w-5 h-5 mx-auto mt-3 ${config.iconPrimary}`} />
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full space-y-5">
        {/* Quién era */}
        <div className={`${config.highlightPrimary} p-5`}>
          <div className="flex items-center gap-2 mb-3">
            <Heart className={`w-4 h-4 ${config.iconPrimary}`} />
            <h4 className={`text-sm font-bold uppercase ${config.iconPrimary}`}>Quién era cuando empecé este año</h4>
          </div>
          <LineasEscritura count={5} spacing={28} />
        </div>

        {/* Quién soy */}
        <div className={`${config.highlightSecondary} p-5`}>
          <div className="flex items-center gap-2 mb-3">
            <Sun className={`w-4 h-4 ${config.iconSecondary}`} />
            <h4 className={`text-sm font-bold uppercase ${config.iconSecondary}`}>Quién soy ahora</h4>
          </div>
          <LineasEscritura count={5} spacing={28} />
        </div>

        {/* Qué versión nació */}
        <div className={`${config.highlightAccent} p-5`}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className={`w-4 h-4 ${config.iconAccent}`} />
            <h4 className={`text-sm font-bold uppercase ${config.iconAccent}`}>Qué versión mía nació</h4>
          </div>
          <LineasEscritura count={4} spacing={28} />
        </div>
      </div>

      <FooterLibro pagina={145} />
    </div>
  );
};

export const PreparacionProximaVuelta = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b-2 border-gray-200">
        <Sun className={`w-8 h-8 mx-auto ${config.iconPrimary}`} />
        <h2 className={`text-2xl font-display mt-3 ${config.titleGradient}`}>Preparación para la próxima vuelta al Sol</h2>
        <p className={`text-sm italic mt-2 ${config.iconSecondary}`}>
          El ciclo termina, pero tú continúas.
        </p>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full space-y-5">
        {/* Lo que llevo */}
        <div className={`${config.highlightPrimary} p-5`}>
          <div className="flex items-center gap-2 mb-3">
            <Heart className={`w-4 h-4 ${config.iconPrimary}`} />
            <h4 className={`text-sm font-bold uppercase ${config.iconPrimary}`}>Lo que llevo conmigo al próximo año</h4>
          </div>
          <LineasEscritura count={5} spacing={28} />
        </div>

        {/* Lo que dejo */}
        <div className={`${config.highlightSecondary} p-5`}>
          <div className="flex items-center gap-2 mb-3">
            <Star className={`w-4 h-4 ${config.iconSecondary}`} />
            <h4 className={`text-sm font-bold uppercase ${config.iconSecondary}`}>Lo que dejo aquí</h4>
          </div>
          <LineasEscritura count={5} spacing={28} />
        </div>

        {/* Deseo */}
        <div className={`${config.highlightAccent} p-5`}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className={`w-4 h-4 ${config.iconAccent}`} />
            <h4 className={`text-sm font-bold uppercase ${config.iconAccent}`}>Mi deseo para el próximo ciclo</h4>
          </div>
          <LineasEscritura count={4} spacing={28} />
        </div>
      </div>

      <FooterLibro pagina={146} />
    </div>
  );
};

export const CartaCierre: React.FC<{ name: string }> = ({ name }) => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b-2 border-gray-200">
        <Sparkles className={`w-6 h-6 mx-auto ${config.iconPrimary}`} />
        <h2 className={`text-2xl font-display mt-3 ${config.titleGradient}`}>Carta de cierre</h2>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full">
        <div className={`${config.highlightPrimary} p-8`}>
          <p className={`text-lg font-display ${config.iconPrimary} mb-6`}>Querida {name},</p>

          <p className="text-sm text-gray-700 mb-5 leading-relaxed">
            Has llegado al final de esta vuelta al sol. No importa si fue fácil o difícil,
            si todo salió como esperabas o si el universo tenía otros planes.
            Lo que importa es que estás aquí, leyendo estas palabras,
            habiendo atravesado otro año de tu vida.
          </p>

          <p className="text-sm text-gray-700 mb-5 leading-relaxed">
            Cada página de esta agenda fue testigo de algo. Cada pregunta que respondiste
            (o dejaste en blanco) fue parte del proceso. Cada ritual que hiciste
            (o ignoraste) estaba bien tal como fue.
          </p>

          <p className="text-sm text-gray-700 mb-6 leading-relaxed">
            Porque esta agenda nunca fue sobre hacer todo perfecto.
            Fue sobre acompañarte mientras vivías.
          </p>

          <div className={`${config.headerBg} p-4 text-center mt-6`}>
            <p className={`text-lg italic font-display ${config.headerText}`}>
              "Nada fue casual. Todo fue parte del proceso."
            </p>
          </div>
        </div>

        <div className={`mt-6 text-center ${config.iconSecondary} text-sm`}>
          Hasta la próxima vuelta al sol ✧
        </div>
      </div>

      <FooterLibro pagina={147} />
    </div>
  );
};

export const PaginaFinalBlanca = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b-2 border-gray-200">
        <h2 className={`text-xl font-display ${config.titleGradient}`}>Lo que todavía no sé</h2>
        <p className={`text-xs italic mt-2 ${config.iconSecondary}`}>
          Una página en blanco para lo que aún está por descubrir.
        </p>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full">
        <div className={`${config.highlightSecondary} p-6 h-full`}>
          <LineasEscritura count={18} spacing={32} />
        </div>
      </div>

      <FooterLibro pagina={148} />
    </div>
  );
};

export const Contraportada = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page print-no-bg flex flex-col items-center justify-center text-center relative overflow-hidden ${config.headerBg}`} style={{ padding: '15mm' }}>
      {/* Decoración de fondo */}
      <div className={`absolute inset-0 ${config.pattern} opacity-30`} />

      <div className="relative z-10 space-y-8 max-w-xl">
        <Sun className={`w-16 h-16 mx-auto ${config.headerText}`} />

        <div className="space-y-4">
          <p className={`text-xl italic leading-relaxed ${config.headerText} opacity-80`}>
            "No todo fue fácil.
          </p>
          <p className={`text-3xl font-display ${config.headerText}`}>
            Pero todo tuvo sentido."
          </p>
        </div>

        <div className={`w-24 h-px mx-auto ${config.headerText} opacity-30`}
             style={{ background: 'currentColor' }} />

        <p className={`${config.headerText} text-lg font-display`}>
          Tu Vuelta al Sol
        </p>

        <p className={`${config.headerText} opacity-60 text-sm`}>
          Agenda Astrológica Personalizada
        </p>
      </div>

      <div className={`absolute bottom-8 ${config.headerText} opacity-40 text-sm`}>
        tuvueltaalsol.es
      </div>
    </div>
  );
};

export default PrimerDiaCiclo;
