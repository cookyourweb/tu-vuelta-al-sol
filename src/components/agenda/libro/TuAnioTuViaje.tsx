'use client';

interface TuAnioTuViajeProps {
  userName: string;
  apertura?: {
    carta_de_bienvenida?: string;
    tema_central_del_año?: string;
    que_soltar?: string;
  };
  solarReturn?: {
    interpretation?: string;
    tema_anual?: string;
  };
}

export default function TuAnioTuViaje({
  userName,
  apertura,
  solarReturn
}: TuAnioTuViajeProps) {
  const temaCentral = apertura?.tema_central_del_año || solarReturn?.tema_anual;
  const interpretacion = solarReturn?.interpretation;

  return (
    <>
      {/* BIENVENIDA PERSONAL */}
      <div className="print-page bg-white p-12">
        <div className="max-w-3xl mx-auto">
          {/* Título de sección */}
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-cosmic-gold mb-4">
              Tu Año, Tu Viaje
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
          </div>

          {/* Saludo personal */}
          <div className="mb-12">
            <p className="font-display text-2xl text-gray-800 mb-6">
              Querido/a {userName},
            </p>

            {apertura?.carta_de_bienvenida ? (
              <p className="font-body text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {apertura.carta_de_bienvenida}
              </p>
            ) : (
              <div className="space-y-4">
                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  Bienvenido/a a tu nuevo año solar. Este libro es tu compañero de viaje,
                  diseñado específicamente para ti y los ciclos planetarios que te acompañarán
                  durante los próximos 12 meses.
                </p>
                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  Cada página de esta agenda ha sido creada teniendo en cuenta tu carta natal,
                  tu retorno solar y los tránsitos planetarios que marcarán tu camino.
                </p>
                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  Este no es un viaje lineal, sino espiral: cada mes te llevará más profundo
                  en el conocimiento de ti mismo/a y en la conexión con los ritmos del universo.
                </p>
              </div>
            )}
          </div>

          {/* Cita inspiradora */}
          <div className="bg-cosmic-purple/5 p-6 rounded-lg border border-cosmic-gold/20">
            <p className="font-body text-lg text-gray-700 leading-relaxed italic text-center">
              "No estás aprendiendo astrología. Estás recordando el lenguaje
              que tu alma siempre ha hablado."
            </p>
          </div>
        </div>
      </div>

      {/* TEMA CENTRAL DEL AÑO */}
      {(temaCentral || interpretacion) && (
        <div className="print-page bg-white p-12">
          <div className="max-w-3xl mx-auto">
            {/* Título de sección */}
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl text-cosmic-gold mb-4">
                El Tema de Tu Año
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
            </div>

            {/* Contenido del tema */}
            <div className="space-y-8">
              {temaCentral && (
                <div>
                  <h3 className="font-display text-2xl text-gray-800 mb-4">
                    Tu Enfoque Principal
                  </h3>
                  <p className="font-body text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                    {temaCentral}
                  </p>
                </div>
              )}

              {interpretacion && (
                <div>
                  <h3 className="font-display text-2xl text-gray-800 mb-4">
                    Interpretación de Tu Retorno Solar
                  </h3>
                  <p className="font-body text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                    {interpretacion}
                  </p>
                </div>
              )}

              {/* Decoración */}
              <div className="flex items-center justify-center space-x-4 py-8">
                <span className="text-cosmic-gold text-2xl">✧</span>
                <span className="text-cosmic-gold text-2xl">☉</span>
                <span className="text-cosmic-gold text-2xl">✧</span>
              </div>

              {/* Reflexión guiada */}
              <div className="bg-cosmic-purple/5 p-8 rounded-lg border border-cosmic-gold/20">
                <h4 className="font-display text-xl text-cosmic-gold mb-4">
                  Preguntas para Reflexionar
                </h4>
                <ul className="font-body text-base text-gray-700 leading-relaxed space-y-3">
                  <li>¿Qué partes de mí están listas para florecer este año?</li>
                  <li>¿Qué habilidades o talentos quiero desarrollar?</li>
                  <li>¿Qué áreas de mi vida requieren más atención?</li>
                  <li>¿Cómo puedo honrar los ciclos naturales en mi día a día?</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUÉ SOLTAR */}
      {apertura?.que_soltar && (
        <div className="print-page bg-white p-12">
          <div className="max-w-3xl mx-auto">
            {/* Título de sección */}
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl text-cosmic-gold mb-4">
                Lo Que Dejas Atrás
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
            </div>

            {/* Contenido */}
            <div className="space-y-8">
              <div>
                <p className="font-body text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                  {apertura.que_soltar}
                </p>
              </div>

              {/* Espacio para escribir */}
              <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-8 min-h-[200px]">
                <h4 className="font-display text-xl text-cosmic-gold mb-4">
                  Mi Intención de Liberación
                </h4>
                <p className="font-body text-sm text-gray-500 italic mb-4">
                  Escribe aquí lo que estás lista/o para soltar en este nuevo ciclo:
                </p>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="border-b border-gray-300"></div>
                  ))}
                </div>
              </div>

              {/* Ritual de liberación */}
              <div className="bg-cosmic-purple/5 p-8 rounded-lg border border-cosmic-gold/20">
                <h4 className="font-display text-xl text-cosmic-gold mb-4">
                  Ritual de Liberación
                </h4>
                <p className="font-body text-base text-gray-700 leading-relaxed">
                  En la próxima Luna Menguante, escribe en un papel aquello que deseas soltar.
                  Lee tus palabras en voz alta, agradeciéndole a esa experiencia por lo que te enseñó.
                  Luego, quema el papel de forma segura o entiérralo en la tierra,
                  devolviendo esa energía al universo para su transformación.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
