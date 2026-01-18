'use client';

import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/context/StyleContext';

// ============ LÍNEAS DE ESCRITURA ============
const LineasEscritura = ({ count = 6, spacing = 28 }: { count?: number; spacing?: number }) => (
  <div className="flex flex-col">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="border-b border-gray-200" style={{ height: `${spacing}px` }} />
    ))}
  </div>
);

// ============ CARTA DE BIENVENIDA ============
export const CartaBienvenida: React.FC<{
  nombre: string;
  cartaBienvenida?: string;
}> = ({ nombre, cartaBienvenida }) => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header decorativo */}
      <div className="text-center mb-8 pb-6 border-b border-cosmic-gold/20">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <span className="text-cosmic-gold text-sm">✧</span>
          <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>Carta de Bienvenida</span>
          <span className="text-cosmic-gold text-sm">✧</span>
        </div>
        <h2 className="font-display text-4xl text-cosmic-gold mb-3">Un mensaje para ti</h2>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full">
        {/* Carta con fondo */}
        <div className="bg-cosmic-purple/5 border border-cosmic-gold/20 rounded-lg p-8">
          <p className="font-display text-2xl text-cosmic-gold mb-6">Querida {nombre},</p>

          <div className="space-y-5 font-body text-gray-700 leading-relaxed text-lg">
            {cartaBienvenida ? (
              <p className="whitespace-pre-line">{cartaBienvenida}</p>
            ) : (
              <>
                <p>
                  Bienvenida a tu nueva vuelta al Sol. Este libro es tu compañero de viaje durante
                  los próximos 12 meses, un espacio para registrar, reflexionar y conectar con
                  los ritmos naturales del universo.
                </p>

                <p>
                  Cada página ha sido diseñada pensando en ti, en tu carta natal, en tu retorno solar
                  y en los eventos astrológicos que marcarán tu año. No es un libro más: es TU libro,
                  personalizado con las energías que te acompañarán en este ciclo.
                </p>

                <p>
                  A lo largo de estas páginas encontrarás interpretaciones profundas, rituales sugeridos,
                  espacios para escribir y reflexionar. Úsalo como quieras: no hay forma incorrecta
                  de habitar tu propia historia.
                </p>

                {/* Frase central con fondo */}
                <div className="bg-gradient-to-br from-cosmic-gold/20 to-cosmic-purple/10 border-l-4 border-cosmic-gold rounded-r-lg p-6 text-center my-8">
                  <p className="font-display text-2xl text-cosmic-gold italic">
                    "Este es tu año. Este es tu viaje."
                  </p>
                </div>

                <p>
                  Que este libro sea un faro en los momentos de oscuridad, un espejo en los momentos
                  de transformación, y un mapa en los momentos de incertidumbre.
                </p>

                <p>
                  Feliz vuelta al Sol.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Despedida */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-cosmic-gold">✧</span>
            <span className="text-cosmic-gold">☉</span>
            <span className="text-cosmic-gold">✧</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ PRIMER DÍA DEL CICLO ============
export const PrimerDiaCiclo: React.FC<{
  fecha: Date;
  nombre: string;
}> = ({ fecha, nombre }) => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Sol decorativo */}
        <div className="mb-6">
          <span className="text-6xl text-cosmic-gold">☉</span>
        </div>

        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="text-cosmic-gold text-sm">✧</span>
          <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>
            {format(fecha, "d 'de' MMMM, yyyy", { locale: es })}
          </span>
          <span className="text-cosmic-gold text-sm">✧</span>
        </div>

        <h1 className="font-display text-5xl text-cosmic-gold mt-4 mb-2">
          Primer Día de Tu Ciclo
        </h1>
        <p className="font-body text-2xl text-gray-700 mb-8">¡Feliz cumpleaños, {nombre}!</p>

        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent my-8"></div>

        <div className="max-w-md space-y-6 text-left w-full">
          {/* Intención */}
          <div className="bg-cosmic-purple/5 border border-cosmic-gold/20 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-cosmic-gold">✦</span>
              <h3 className="font-display text-base text-cosmic-gold uppercase tracking-wide">Intención para este nuevo ciclo</h3>
            </div>
            <LineasEscritura count={4} spacing={28} />
          </div>

          {/* Cultivar */}
          <div className="bg-gradient-to-br from-cosmic-gold/10 to-cosmic-purple/5 border-l-4 border-cosmic-gold rounded-r-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-cosmic-gold">☉</span>
              <h3 className="font-display text-base text-cosmic-gold uppercase tracking-wide">¿Qué quiero cultivar este año?</h3>
            </div>
            <LineasEscritura count={4} spacing={28} />
          </div>

          {/* Soltar */}
          <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-cosmic-gold">✧</span>
              <h3 className="font-display text-base text-cosmic-gold uppercase tracking-wide">¿Qué decido soltar?</h3>
            </div>
            <LineasEscritura count={4} spacing={28} />
          </div>
        </div>

        {/* Cierre decorativo */}
        <div className="mt-8">
          <p className="font-body text-gray-600 italic text-sm">
            "Hoy empieza tu nueva vuelta al Sol."
          </p>
        </div>
      </div>
    </div>
  );
};

// ============ ÚLTIMO DÍA DEL CICLO ============
export const UltimoDiaCiclo: React.FC<{
  fecha: Date;
  nombre: string;
}> = ({ fecha, nombre }) => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Luna decorativa */}
        <div className="mb-6">
          <span className="text-6xl text-cosmic-gold">☽</span>
        </div>

        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="text-cosmic-gold text-sm">✧</span>
          <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>
            {format(fecha, "d 'de' MMMM, yyyy", { locale: es })}
          </span>
          <span className="text-cosmic-gold text-sm">✧</span>
        </div>

        <h1 className="font-display text-5xl text-cosmic-gold mt-4 mb-2">
          Último Día del Ciclo
        </h1>
        <p className="font-body text-2xl text-gray-700 mb-8">Cierre y preparación, {nombre}</p>

        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent my-8"></div>

        <div className="max-w-md space-y-6 text-left w-full">
          {/* Aprendizaje */}
          <div className="bg-cosmic-purple/5 border border-cosmic-gold/20 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-cosmic-gold">✦</span>
              <h3 className="font-display text-base text-cosmic-gold uppercase tracking-wide">Lo más importante que aprendí</h3>
            </div>
            <LineasEscritura count={4} spacing={28} />
          </div>

          {/* Transformación */}
          <div className="bg-gradient-to-br from-cosmic-gold/10 to-cosmic-purple/5 border-l-4 border-cosmic-gold rounded-r-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-cosmic-gold">☉</span>
              <h3 className="font-display text-base text-cosmic-gold uppercase tracking-wide">¿Quién era hace un año? ¿Quién soy hoy?</h3>
            </div>
            <LineasEscritura count={4} spacing={28} />
          </div>

          {/* Gratitud */}
          <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-cosmic-gold">✧</span>
              <h3 className="font-display text-base text-cosmic-gold uppercase tracking-wide">Carta de gratitud a mí mismo/a</h3>
            </div>
            <LineasEscritura count={4} spacing={28} />
          </div>
        </div>

        {/* Cierre decorativo */}
        <div className="mt-8">
          <p className="font-body text-gray-600 italic text-sm">
            "Completaste una vuelta al Sol. Honra tu camino."
          </p>
        </div>
      </div>
    </div>
  );
};

// ============ CIERRE DE MES ============
export const CierreMes: React.FC<{
  monthDate: Date;
}> = ({ monthDate }) => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header decorativo */}
      <div className="text-center mb-8 pb-6 border-b border-cosmic-gold/20">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <span className="text-cosmic-gold text-sm">✧</span>
          <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>Cierre de Mes</span>
          <span className="text-cosmic-gold text-sm">✧</span>
        </div>
        <h1 className="font-display text-4xl text-cosmic-gold capitalize">
          {format(monthDate, 'MMMM yyyy', { locale: es })}
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto mt-4"></div>
      </div>

      <div className="flex-1 space-y-6 max-w-2xl mx-auto w-full">
        {/* Cambios */}
        <div className="bg-cosmic-purple/5 border border-cosmic-gold/20 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-cosmic-gold">✦</span>
            <h3 className="font-display text-base text-cosmic-gold uppercase tracking-wide">¿Qué cambió en mí este mes?</h3>
          </div>
          <LineasEscritura count={5} spacing={28} />
        </div>

        {/* Soltar */}
        <div className="bg-gradient-to-br from-cosmic-gold/10 to-cosmic-purple/5 border-l-4 border-cosmic-gold rounded-r-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-cosmic-gold">☽</span>
            <h3 className="font-display text-base text-cosmic-gold uppercase tracking-wide">¿Qué solté sin darme cuenta?</h3>
          </div>
          <LineasEscritura count={5} spacing={28} />
        </div>

        {/* Descubrimiento */}
        <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-cosmic-gold">☉</span>
            <h3 className="font-display text-base text-cosmic-gold uppercase tracking-wide">¿Qué descubrí de mí?</h3>
          </div>
          <LineasEscritura count={5} spacing={28} />
        </div>

        {/* Palabra clave */}
        <div className="bg-cosmic-purple/5 border border-cosmic-gold/20 rounded-lg p-6 text-center">
          <span className="font-body text-xs uppercase text-cosmic-gold tracking-widest">Una palabra que resume este mes</span>
          <div className="border-b-2 border-dashed border-cosmic-gold/40 h-12 mt-4 max-w-xs mx-auto" />
        </div>
      </div>
    </div>
  );
};

// ============ CIERRE DEL CICLO ============
export const QuienEraQuienSoy = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header decorativo */}
      <div className="text-center mb-8 pb-6 border-b border-cosmic-gold/20">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <span className="text-cosmic-gold text-sm">✧</span>
          <span className={`text-[10px] uppercase tracking-[0.3em] ${config.iconSecondary}`}>Cierre de Ciclo</span>
          <span className="text-cosmic-gold text-sm">✧</span>
        </div>
        <h2 className="font-display text-4xl text-cosmic-gold mb-3">El viaje completado</h2>
        <div className="flex items-center justify-center space-x-2">
          <span className="text-cosmic-gold text-xl">✦</span>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full space-y-5">
        {/* Quién era */}
        <div className="bg-cosmic-purple/5 border border-cosmic-gold/20 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-cosmic-gold text-lg">☽</span>
            <h4 className="font-display text-base text-cosmic-gold uppercase tracking-wide">Quién era cuando empecé este año</h4>
          </div>
          <LineasEscritura count={5} spacing={28} />
        </div>

        {/* Quién soy */}
        <div className="bg-gradient-to-br from-cosmic-gold/10 to-cosmic-purple/5 border-l-4 border-cosmic-gold rounded-r-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-cosmic-gold text-lg">☉</span>
            <h4 className="font-display text-base text-cosmic-gold uppercase tracking-wide">Quién soy ahora</h4>
          </div>
          <LineasEscritura count={5} spacing={28} />
        </div>

        {/* Qué versión nació */}
        <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-cosmic-gold text-lg">✧</span>
            <h4 className="font-display text-base text-cosmic-gold uppercase tracking-wide">Qué versión mía nació</h4>
          </div>
          <LineasEscritura count={4} spacing={28} />
        </div>
      </div>

      {/* Cierre */}
      <div className="text-center mt-8">
        <p className="font-body text-gray-600 italic text-sm">
          "La transformación no siempre es ruidosa. A veces, simplemente sucede."
        </p>
      </div>
    </div>
  );
};

export const PreparacionProximaVuelta = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header decorativo */}
      <div className="text-center mb-8 pb-6 border-b border-cosmic-gold/20">
        <div className="mb-4">
          <span className="text-5xl text-cosmic-gold">☉</span>
        </div>
        <h2 className="font-display text-4xl text-cosmic-gold mb-3">Preparación para la próxima vuelta al Sol</h2>
        <p className="font-body text-gray-600 italic">
          El ciclo termina, pero tú continúas.
        </p>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full space-y-5">
        {/* Lo que llevo */}
        <div className="bg-cosmic-purple/5 border border-cosmic-gold/20 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-cosmic-gold text-lg">✦</span>
            <h4 className="font-display text-base text-cosmic-gold uppercase tracking-wide">Lo que llevo conmigo al próximo año</h4>
          </div>
          <LineasEscritura count={5} spacing={28} />
        </div>

        {/* Lo que dejo */}
        <div className="bg-gradient-to-br from-cosmic-gold/10 to-cosmic-purple/5 border-l-4 border-cosmic-gold rounded-r-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-cosmic-gold text-lg">✧</span>
            <h4 className="font-display text-base text-cosmic-gold uppercase tracking-wide">Lo que dejo aquí</h4>
          </div>
          <LineasEscritura count={5} spacing={28} />
        </div>

        {/* Deseo */}
        <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-cosmic-gold text-lg">☽</span>
            <h4 className="font-display text-base text-cosmic-gold uppercase tracking-wide">Mi deseo para el próximo ciclo</h4>
          </div>
          <LineasEscritura count={4} spacing={28} />
        </div>
      </div>

      {/* Cierre */}
      <div className="text-center mt-8">
        <p className="font-body text-gray-600 italic text-sm">
          "Cada final es semilla de un nuevo comienzo."
        </p>
      </div>
    </div>
  );
};

export const CartaCierre: React.FC<{ name: string }> = ({ name }) => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header decorativo */}
      <div className="text-center mb-8 pb-6 border-b border-cosmic-gold/20">
        <div className="mb-4">
          <span className="text-4xl text-cosmic-gold">✧</span>
        </div>
        <h2 className="font-display text-4xl text-cosmic-gold">Carta de cierre</h2>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full">
        {/* Carta con fondo */}
        <div className="bg-cosmic-purple/5 border border-cosmic-gold/20 rounded-lg p-8">
          <p className="font-display text-2xl text-cosmic-gold mb-6">Querida {name},</p>

          <div className="space-y-5 font-body text-gray-700 leading-relaxed">
            <p>
              Has llegado al final de esta vuelta al sol. No importa si fue fácil o difícil,
              si todo salió como esperabas o si el universo tenía otros planes.
              Lo que importa es que estás aquí, leyendo estas palabras,
              habiendo atravesado otro año de tu vida.
            </p>

            <p>
              Cada página de esta agenda fue testigo de algo. Cada pregunta que respondiste
              (o dejaste en blanco) fue parte del proceso. Cada ritual que hiciste
              (o ignoraste) estaba bien tal como fue.
            </p>

            <p>
              Porque esta agenda nunca fue sobre hacer todo perfecto.
              Fue sobre acompañarte mientras vivías.
            </p>

            {/* Frase central con fondo */}
            <div className="bg-gradient-to-br from-cosmic-gold/20 to-cosmic-purple/10 border-l-4 border-cosmic-gold rounded-r-lg p-6 text-center mt-8">
              <p className="font-display text-2xl text-cosmic-gold italic">
                "Nada fue casual. Todo fue parte del proceso."
              </p>
            </div>
          </div>
        </div>

        {/* Despedida */}
        <div className="mt-8 text-center">
          <p className="font-body text-gray-600 text-base">
            Hasta la próxima vuelta al sol
          </p>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <span className="text-cosmic-gold">✧</span>
            <span className="text-cosmic-gold">☉</span>
            <span className="text-cosmic-gold">✧</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PaginaFinalBlanca = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header decorativo */}
      <div className="text-center mb-8 pb-6 border-b border-cosmic-gold/20">
        <div className="mb-4">
          <span className="text-4xl text-cosmic-gold">✧</span>
        </div>
        <h2 className="font-display text-4xl text-cosmic-gold">Lo que todavía no sé</h2>
        <p className="font-body text-gray-600 italic mt-3">
          Una página en blanco para lo que aún está por descubrir.
        </p>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full">
        {/* Espacio en blanco decorado */}
        <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-6 min-h-[500px]">
          <LineasEscritura count={18} spacing={32} />
        </div>
      </div>

      {/* Frase final */}
      <div className="text-center mt-8">
        <p className="font-body text-gray-600 italic text-sm">
          "El misterio es parte del viaje."
        </p>
      </div>
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
        {/* Sol grande */}
        <div>
          <span className="text-7xl text-white">☉</span>
        </div>

        {/* Frase principal */}
        <div className="space-y-4">
          <p className="text-2xl italic leading-relaxed text-white/80 font-body">
            "No todo fue fácil.
          </p>
          <p className="text-4xl font-display text-white">
            Pero todo tuvo sentido."
          </p>
        </div>

        {/* Divider con estrellas */}
        <div className="flex items-center justify-center space-x-3 py-4">
          <span className="text-white/40">✧</span>
          <div className="w-24 h-px bg-white/30" />
          <span className="text-white/40">✧</span>
        </div>

        {/* Marca */}
        <div className="space-y-2">
          <p className="text-2xl font-display text-white">
            Tu Vuelta al Sol
          </p>
          <p className="text-white/60 text-sm">
            Agenda Astrológica Personalizada
          </p>
        </div>
      </div>

      {/* URL en el footer */}
      <div className="absolute bottom-8 text-white/40 text-sm font-body">
        tuvueltaalsol.es
      </div>
    </div>
  );
};

export default { CartaBienvenida, PrimerDiaCiclo, UltimoDiaCiclo, CierreMes, QuienEraQuienSoy, PreparacionProximaVuelta, CartaCierre, PaginaFinalBlanca, Contraportada };
