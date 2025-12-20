'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CierreCicloProps {
  userName: string;
  startDate: Date;
  endDate: Date;
  cierreDelCiclo?: {
    integrar_lo_vivido?: string;
    preparacion_proximo_ciclo?: string;
    carta_de_cierre?: string;
  };
  fraseFinal?: string;
}

export default function CierreCiclo({
  userName,
  startDate,
  endDate,
  cierreDelCiclo,
  fraseFinal
}: CierreCicloProps) {
  return (
    <>
      {/* INTEGRAR LO VIVIDO */}
      <div className="print-page bg-white p-12">
        <div className="max-w-3xl mx-auto">
          {/* Título de sección */}
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-cosmic-gold mb-4">
              Cierre del Ciclo
            </h2>
            <p className="font-body text-lg text-gray-600">
              Integrando Tu Viaje
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto mt-4"></div>
          </div>

          {/* Contenido */}
          <div className="space-y-8">
            {cierreDelCiclo?.integrar_lo_vivido ? (
              <p className="font-body text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {cierreDelCiclo.integrar_lo_vivido}
              </p>
            ) : (
              <div className="space-y-6">
                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  Has completado un ciclo solar completo. Durante estos 12 meses, has navegado
                  los ritmos del universo, has danzado con las lunas, has sido testigo de
                  eclipses, y has crecido de maneras que quizás aún estás descubriendo.
                </p>

                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  Antes de cerrar este capítulo y dar la bienvenida a tu próximo retorno solar,
                  tómate un momento para honrar todo lo que has vivido, aprendido y transformado.
                </p>
              </div>
            )}

            {/* Preguntas de integración */}
            <div className="bg-cosmic-purple/5 p-8 rounded-lg border border-cosmic-gold/20">
              <h4 className="font-display text-xl text-cosmic-gold mb-6">
                Preguntas para la Integración Final
              </h4>
              <ul className="space-y-4 font-body text-base text-gray-700">
                <li className="flex items-start">
                  <span className="text-cosmic-gold mr-3">•</span>
                  <span>¿Quién era yo al inicio de este año? ¿Quién soy ahora?</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cosmic-gold mr-3">•</span>
                  <span>¿Qué eventos significativos marcaron este ciclo?</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cosmic-gold mr-3">•</span>
                  <span>¿Cómo trabajé conscientemente con las energías astrológicas?</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cosmic-gold mr-3">•</span>
                  <span>¿Qué lecciones del retorno solar se manifestaron en mi vida?</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cosmic-gold mr-3">•</span>
                  <span>¿Qué aspectos de mí se fortalecieron? ¿Qué se transformó?</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ESPACIO PARA REFLEXIÓN PROFUNDA */}
      <div className="print-page bg-white p-12">
        <div className="max-w-3xl mx-auto">
          {/* Título */}
          <div className="text-center mb-12">
            <h3 className="font-display text-3xl text-cosmic-gold mb-4">
              Mi Viaje en Retrospectiva
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
          </div>

          {/* Espacios para escribir */}
          <div className="space-y-8">
            <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-8 min-h-[200px]">
              <h4 className="font-display text-lg text-cosmic-gold mb-4">
                Quién Era vs. Quién Soy
              </h4>
              <p className="font-body text-sm text-gray-600 italic mb-4">
                Describe tu transformación a lo largo de este año:
              </p>
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="border-b border-gray-300"></div>
                ))}
              </div>
            </div>

            <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-8 min-h-[200px]">
              <h4 className="font-display text-lg text-cosmic-gold mb-4">
                Los Momentos Que Me Cambiaron
              </h4>
              <p className="font-body text-sm text-gray-600 italic mb-4">
                Eventos, decisiones o revelaciones significativas:
              </p>
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="border-b border-gray-300"></div>
                ))}
              </div>
            </div>

            <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-8 min-h-[200px]">
              <h4 className="font-display text-lg text-cosmic-gold mb-4">
                Lecciones del Alma
              </h4>
              <p className="font-body text-sm text-gray-600 italic mb-4">
                Los aprendizajes más profundos de este ciclo:
              </p>
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="border-b border-gray-300"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PREPARACIÓN PARA EL PRÓXIMO CICLO */}
      <div className="print-page bg-white p-12">
        <div className="max-w-3xl mx-auto">
          {/* Título */}
          <div className="text-center mb-12">
            <h3 className="font-display text-3xl text-cosmic-gold mb-4">
              Hacia Tu Próxima Vuelta al Sol
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
          </div>

          {/* Contenido */}
          <div className="space-y-8">
            {cierreDelCiclo?.preparacion_proximo_ciclo ? (
              <p className="font-body text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {cierreDelCiclo.preparacion_proximo_ciclo}
              </p>
            ) : (
              <div className="space-y-6">
                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  Mientras este ciclo se cierra, un nuevo retorno solar ya está gestándose.
                  Los aprendizajes de este año son las semillas que plantarás en el próximo.
                </p>

                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  Lleva contigo la sabiduría ganada, pero deja ir lo que ya no necesitas.
                  Cada ciclo solar es una oportunidad de renacer, más consciente y más alineado/a
                  con tu verdadera esencia.
                </p>
              </div>
            )}

            {/* Intenciones para el próximo año */}
            <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-8 min-h-[200px]">
              <h4 className="font-display text-lg text-cosmic-gold mb-4">
                Semillas para Mi Próximo Año
              </h4>
              <p className="font-body text-sm text-gray-600 italic mb-4">
                ¿Qué intenciones o semillas quiero plantar para mi próximo ciclo solar?
              </p>
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="border-b border-gray-300"></div>
                ))}
              </div>
            </div>

            {/* Compromiso personal */}
            <div className="bg-cosmic-purple/5 p-8 rounded-lg border border-cosmic-gold/20">
              <h4 className="font-display text-lg text-cosmic-gold mb-4 text-center">
                Mi Compromiso Conmigo Mismo/a
              </h4>
              <p className="font-body text-base text-gray-700 leading-relaxed text-center mb-6">
                En mi próximo año solar, me comprometo a:
              </p>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start">
                    <span className="text-cosmic-gold mr-2">{i}.</span>
                    <div className="flex-1 border-b border-gray-400"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CARTA DE CIERRE */}
      <div className="print-page bg-white p-12">
        <div className="max-w-3xl mx-auto">
          {/* Título */}
          <div className="text-center mb-12">
            <h3 className="font-display text-3xl text-cosmic-gold mb-4">
              Una Carta para Ti
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
          </div>

          {/* Contenido */}
          <div className="space-y-6">
            {cierreDelCiclo?.carta_de_cierre ? (
              <p className="font-body text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {cierreDelCiclo.carta_de_cierre}
              </p>
            ) : (
              <div className="space-y-6">
                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  Querido/a {userName},
                </p>

                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  Has caminado un año completo alrededor del Sol. Has navegado estaciones,
                  lunaciones, eclipses y retrogradaciones. Has crecido en formas visibles
                  e invisibles. Has sido valiente. Has sido vulnerable. Has sido humano/a.
                </p>

                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  La astrología no es tu destino: es tu recordatorio de que eres parte de
                  un cosmos vivo, consciente, en constante evolución. Las estrellas no te
                  dicen quién ser; te recuerdan quién ya eres.
                </p>

                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  Lleva esta agenda contigo como testimonio de tu viaje. Vuelve a leerla
                  en años futuros. Sorpréndete de cuánto has crecido. Agradece a tu yo
                  del pasado por cada paso dado con consciencia.
                </p>

                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  Y cuando el Sol regrese a su posición natal una vez más, recibirás una
                  nueva agenda, un nuevo mapa, una nueva invitación a evolucionar.
                </p>

                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  Hasta tu próxima vuelta al Sol.
                </p>

                <p className="font-body text-lg text-gray-700 leading-relaxed italic mt-8">
                  Con todo el amor del universo,
                </p>
              </div>
            )}

            {/* Firma simbólica */}
            <div className="text-center mt-12 pt-8 border-t border-cosmic-gold/20">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <span className="text-cosmic-gold text-2xl">✧</span>
                <span className="text-cosmic-gold text-3xl">☉</span>
                <span className="text-cosmic-gold text-2xl">✧</span>
              </div>
              <p className="font-display text-xl text-cosmic-gold">
                Tu Vuelta al Sol
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTRAPORTADA */}
      <div className="print-page bg-white p-12 flex flex-col justify-center items-center">
        <div className="max-w-2xl text-center">
          {/* Logo/símbolo */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-cosmic-gold to-cosmic-amber flex items-center justify-center">
              <span className="text-5xl text-white">☉</span>
            </div>
          </div>

          {/* Frase final */}
          {fraseFinal ? (
            <p className="font-body text-xl text-gray-700 leading-relaxed italic mb-12">
              "{fraseFinal}"
            </p>
          ) : (
            <p className="font-body text-xl text-gray-700 leading-relaxed italic mb-12">
              "El final de un ciclo es siempre el comienzo de otro.
              El cosmos nunca deja de invitarte a florecer."
            </p>
          )}

          {/* Fechas del ciclo */}
          <div className="space-y-2 font-body text-sm text-gray-600">
            <p>Tu Ciclo Solar</p>
            <p className="font-display text-lg text-cosmic-gold">
              {format(startDate, "d 'de' MMMM 'de' yyyy", { locale: es })}
            </p>
            <p className="text-gray-400">—</p>
            <p className="font-display text-lg text-cosmic-gold">
              {format(endDate, "d 'de' MMMM 'de' yyyy", { locale: es })}
            </p>
          </div>

          {/* Web/contacto */}
          <div className="mt-12 pt-8 border-t border-cosmic-gold/20">
            <p className="font-body text-sm text-gray-500">
              www.tuvueltaalsol.es
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
