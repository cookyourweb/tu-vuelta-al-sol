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
      <div className="print-page bg-white flex flex-col items-center justify-center p-12 text-center">
        {/* Logo o símbolo del sol */}
        <div className="mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cosmic-gold to-cosmic-amber flex items-center justify-center">
            <span className="text-4xl text-white">☉</span>
          </div>
        </div>

        {/* Título principal */}
        <h1 className="font-display text-5xl text-cosmic-gold mb-4">
          Tu Vuelta al Sol
        </h1>

        {/* Subtítulo personalizado */}
        <h2 className="font-display text-3xl text-gray-800 mb-8">
          {portada?.subtitulo || `${startYear} - ${endYear}`}
        </h2>

        {/* Nombre del usuario */}
        <div className="mb-12">
          <p className="font-body text-xl text-gray-600 mb-2">Un viaje astrológico para</p>
          <p className="font-display text-4xl text-cosmic-gold">{userName}</p>
        </div>

        {/* Dedicatoria */}
        {portada?.dedicatoria && (
          <div className="max-w-2xl">
            <p className="font-body text-lg text-gray-700 italic leading-relaxed">
              {portada.dedicatoria}
            </p>
          </div>
        )}

        {/* Fechas del ciclo */}
        <div className="mt-12 pt-8 border-t border-cosmic-gold/20">
          <p className="font-body text-sm text-gray-600">
            {format(startDate, "d 'de' MMMM 'de' yyyy", { locale: es })} — {format(endDate, "d 'de' MMMM 'de' yyyy", { locale: es })}
          </p>
        </div>
      </div>

      {/* PÁGINA DE INTENCIÓN */}
      <div className="print-page bg-white p-12">
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
