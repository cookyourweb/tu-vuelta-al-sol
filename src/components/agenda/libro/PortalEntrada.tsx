'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PortalEntradaProps {
  userName: string;
  startDate: Date;
  endDate: Date;
  portada?: {
    titulo?: string;
    subtitulo?: string;
    dedicatoria?: string;
  };
  apertura?: {
    antes_de_empezar?: string;
    carta_de_bienvenida?: string;
  };
}

export default function PortalEntrada({
  userName,
  startDate,
  endDate,
  portada,
  apertura
}: PortalEntradaProps) {
  const startYear = format(startDate, 'yyyy', { locale: es });
  const endYear = format(endDate, 'yyyy', { locale: es });

  return (
    <>
      {/* PORTADA PERSONALIZADA */}
      <div className="print-page print-no-bg bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex flex-col items-center justify-center text-center relative overflow-hidden" style={{ padding: '15mm' }}>
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)',
          }} />
        </div>

        <div className="relative z-10 space-y-8">
          {/* Logo o símbolo del sol */}
          <div className="mb-6">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cosmic-gold to-cosmic-amber flex items-center justify-center shadow-2xl">
              <span className="text-5xl text-white">☉</span>
            </div>
          </div>

          {/* Título principal */}
          <h1 className="font-display text-6xl text-white mb-4">
            Tu Vuelta al Sol
          </h1>

          {/* Subtítulo personalizado */}
          <h2 className="font-display text-3xl text-cosmic-gold mb-8">
            {portada?.subtitulo || `${startYear} - ${endYear}`}
          </h2>

          {/* Nombre del usuario */}
          <div className="mb-10">
            <p className="font-body text-xl text-white/80 mb-3">Un viaje astrológico para</p>
            <p className="font-display text-5xl text-cosmic-gold">{userName}</p>
          </div>

          {/* Dedicatoria */}
          {portada?.dedicatoria && (
            <div className="max-w-2xl bg-white/10 backdrop-blur-sm border border-cosmic-gold/30 rounded-lg p-6">
              <p className="font-body text-lg text-white/90 italic leading-relaxed">
                {portada.dedicatoria}
              </p>
            </div>
          )}

          {/* Fechas del ciclo */}
          <div className="mt-10 pt-6 border-t border-cosmic-gold/30">
            <p className="font-body text-sm text-white/70">
              {format(startDate, "d 'de' MMMM 'de' yyyy", { locale: es })} — {format(endDate, "d 'de' MMMM 'de' yyyy", { locale: es })}
            </p>
          </div>
        </div>
      </div>

      {/* PÁGINA DE INTENCIÓN */}
      <div className="print-page bg-white" style={{ padding: '15mm' }}>
        <div className="max-w-3xl mx-auto">
          {/* Título de sección */}
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-cosmic-gold mb-4">
              Antes de Empezar
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
          </div>

          {/* Contenido de bienvenida */}
          <div className="space-y-8">
            {apertura?.antes_de_empezar && (
              <div>
                <h3 className="font-display text-2xl text-gray-800 mb-4">
                  Cómo Usar Esta Agenda
                </h3>
                <p className="font-body text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                  {apertura.antes_de_empezar}
                </p>
              </div>
            )}

            {apertura?.carta_de_bienvenida && (
              <div>
                <h3 className="font-display text-2xl text-gray-800 mb-4">
                  Carta de Bienvenida
                </h3>
                <p className="font-body text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                  {apertura.carta_de_bienvenida}
                </p>
              </div>
            )}

            {/* Instrucciones por defecto si no hay contenido de API */}
            {!apertura?.antes_de_empezar && !apertura?.carta_de_bienvenida && (
              <>
                <div>
                  <h3 className="font-display text-2xl text-gray-800 mb-4">
                    Tu Compañera de Viaje
                  </h3>
                  <p className="font-body text-lg text-gray-700 leading-relaxed">
                    Esta agenda es más que un calendario: es un mapa de tu viaje personal alrededor del Sol.
                    Cada página está diseñada para acompañarte en tu crecimiento, registrar tus descubrimientos
                    y conectar con los ritmos naturales del universo.
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-2xl text-gray-800 mb-4">
                    Cómo Navegar Este Libro
                  </h3>
                  <ul className="font-body text-lg text-gray-700 leading-relaxed space-y-3">
                    <li className="flex items-start">
                      <span className="text-cosmic-gold mr-3">☉</span>
                      <span>Comienza leyendo tu Retorno Solar para entender el tema central de tu año</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cosmic-gold mr-3">☽</span>
                      <span>Observa las Lunas Nuevas para sembrar intenciones y las Lunas Llenas para cosechar</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cosmic-gold mr-3">✧</span>
                      <span>Consulta los eventos astrológicos clave para navegar las energías de cada mes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cosmic-gold mr-3">♃</span>
                      <span>Usa los espacios de reflexión para integrar tus experiencias</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-cosmic-purple/5 p-6 rounded-lg border border-cosmic-gold/20">
                  <p className="font-body text-lg text-gray-700 leading-relaxed italic text-center">
                    "El cosmos no te sucede a ti. Tú eres el cosmos experimentándose a sí mismo."
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
