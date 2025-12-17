'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2, BookOpen, X } from 'lucide-react';

interface BookContent {
  portada: {
    titulo: string;
    subtitulo: string;
    dedicatoria: string;
  };
  apertura_del_viaje: {
    antes_de_empezar: string;
    carta_de_bienvenida: string;
    tema_central_del_año: string;
    ritual_de_inicio: string;
  };
  tu_mapa_interior: {
    carta_natal_explicada: string;
    soul_chart: {
      nodo_sur: string;
      nodo_norte: string;
      patrones_inconscientes: string;
    };
    integrar_proposito: string;
  };
  tu_año_astrologico: {
    retorno_solar: {
      ascendente_del_año: string;
      tema_principal: string;
      ritual_de_cumpleaños: string;
      mantra_del_año: string;
    };
  };
  calendario_personalizado: {
    descripcion: string;
    lunas_nuevas_intro: string;
    lunas_llenas_intro: string;
    eclipses_intro: string;
  };
  cierre_del_ciclo: {
    integrar_lo_vivido: string;
    carta_de_cierre: string;
    preparar_proxima_vuelta: string;
  };
  frase_final: string;
}

export default function AgendaBookGenerator() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookContent, setBookContent] = useState<BookContent | null>(null);
  const [showBook, setShowBook] = useState(false);

  const handleGenerateBook = async () => {
    if (!user) {
      setError('Debes estar autenticado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken();

      const response = await fetch('/api/agenda/generate-book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const data = await response.json();

      if (data.success) {
        setBookContent(data.book);
        setShowBook(true);
      } else {
        setError(data.error || 'Error generando el libro');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* BOTÓN GENERAR LIBRO */}
      <button
        onClick={handleGenerateBook}
        disabled={loading}
        className="bg-gradient-to-r from-amber-500/80 to-yellow-500/80 hover:from-amber-400/90 hover:to-yellow-400/90 transition-all duration-200 shadow-lg hover:shadow-amber-500/25 border border-white/10 p-3 rounded-full group disabled:opacity-50 disabled:cursor-not-allowed"
        title="Generar libro completo de la agenda"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 text-white animate-spin inline mr-2" />
            <span className="text-white text-sm font-semibold">Generando...</span>
          </>
        ) : (
          <>
            <BookOpen className="h-5 w-5 text-white group-hover:scale-110 transition-transform inline mr-2" />
            <span className="text-white text-sm font-semibold">Generar Libro Completo</span>
          </>
        )}
      </button>

      {/* ERROR */}
      {error && (
        <div className="mt-2 p-3 bg-red-900/30 border border-red-400/30 rounded-lg">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* MODAL FULLSCREEN CON EL LIBRO */}
      {showBook && bookContent && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm overflow-y-auto print:bg-white">
          <div className="min-h-screen px-4 py-8 print:p-0">
            {/* BOTÓN CERRAR (solo en pantalla) */}
            <div className="max-w-4xl mx-auto mb-4 flex justify-end gap-4 print:hidden">
              <button
                onClick={() => window.print()}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                🖨️ Imprimir
              </button>
              <button
                onClick={() => setShowBook(false)}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
              >
                <X className="w-5 h-5 inline mr-2" />
                Cerrar
              </button>
            </div>

            {/* CONTENIDO DEL LIBRO */}
            <div className="book-content max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl print:shadow-none print:rounded-none">

              {/* PORTADA */}
              <div className="portada p-16 text-center flex flex-col justify-center items-center min-h-screen border-b-4 border-purple-200 print:page-break-after-always">
                <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-8">
                  {bookContent.portada.titulo}
                </h1>
                <p className="text-2xl text-gray-700 italic max-w-2xl mb-12">
                  "{bookContent.portada.subtitulo}"
                </p>
                <p className="text-xl text-gray-600">
                  {bookContent.portada.dedicatoria}
                </p>
              </div>

              {/* APERTURA DEL VIAJE */}
              <div className="seccion p-12 print:page-break-after-always">
                <h2 className="text-4xl font-bold text-purple-900 mb-8 border-b-2 border-purple-200 pb-4">
                  ✨ Apertura del Viaje
                </h2>

                <div className="espacio mb-10">
                  <h3 className="text-2xl font-semibold text-purple-700 mb-4">Antes de empezar</h3>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {bookContent.apertura_del_viaje.antes_de_empezar}
                  </p>
                </div>

                <div className="espacio mb-10">
                  <h3 className="text-2xl font-semibold text-purple-700 mb-4">Carta de bienvenida</h3>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {bookContent.apertura_del_viaje.carta_de_bienvenida}
                  </p>
                </div>

                <div className="espacio mb-10">
                  <h3 className="text-2xl font-semibold text-purple-700 mb-4">El tema central de tu año</h3>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {bookContent.apertura_del_viaje.tema_central_del_año}
                  </p>
                </div>

                <div className="espacio">
                  <h3 className="text-2xl font-semibold text-purple-700 mb-4">Ritual de inicio</h3>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {bookContent.apertura_del_viaje.ritual_de_inicio}
                  </p>
                </div>
              </div>

              {/* TU MAPA INTERIOR */}
              <div className="seccion p-12 print:page-break-after-always">
                <h2 className="text-4xl font-bold text-indigo-900 mb-8 border-b-2 border-indigo-200 pb-4">
                  🌌 Tu Mapa Interior
                </h2>

                <div className="espacio mb-10">
                  <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Tu carta natal, explicada para vivirla</h3>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {bookContent.tu_mapa_interior.carta_natal_explicada}
                  </p>
                </div>

                <div className="espacio mb-10">
                  <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Soul Chart - El camino del alma</h3>

                  <div className="ml-6 space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-indigo-600 mb-2">De dónde vienes (Nodo Sur)</h4>
                      <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                        {bookContent.tu_mapa_interior.soul_chart.nodo_sur}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-indigo-600 mb-2">Hacia dónde creces (Nodo Norte)</h4>
                      <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                        {bookContent.tu_mapa_interior.soul_chart.nodo_norte}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-indigo-600 mb-2">Patrones inconscientes</h4>
                      <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                        {bookContent.tu_mapa_interior.soul_chart.patrones_inconscientes}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="espacio">
                  <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Integrar tu propósito en la vida real</h3>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {bookContent.tu_mapa_interior.integrar_proposito}
                  </p>
                </div>
              </div>

              {/* TU AÑO ASTROLÓGICO */}
              <div className="seccion p-12 print:page-break-after-always">
                <h2 className="text-4xl font-bold text-amber-900 mb-8 border-b-2 border-amber-200 pb-4">
                  ☀️ Tu Año Astrológico
                </h2>

                <div className="espacio mb-10">
                  <h3 className="text-2xl font-semibold text-amber-700 mb-4">Retorno Solar - La foto de tu año</h3>

                  <div className="ml-6 space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-amber-600 mb-2">Ascendente del año</h4>
                      <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                        {bookContent.tu_año_astrologico.retorno_solar.ascendente_del_año}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-amber-600 mb-2">Tema principal</h4>
                      <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                        {bookContent.tu_año_astrologico.retorno_solar.tema_principal}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-amber-600 mb-2">Ritual de cumpleaños</h4>
                      <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                        {bookContent.tu_año_astrologico.retorno_solar.ritual_de_cumpleaños}
                      </p>
                    </div>

                    <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-400">
                      <h4 className="text-lg font-bold text-amber-700 mb-2">✨ Mantra del año</h4>
                      <p className="text-amber-900 italic text-xl leading-relaxed">
                        "{bookContent.tu_año_astrologico.retorno_solar.mantra_del_año}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CALENDARIO PERSONALIZADO */}
              <div className="seccion p-12 print:page-break-after-always">
                <h2 className="text-4xl font-bold text-blue-900 mb-8 border-b-2 border-blue-200 pb-4">
                  🌙 El Calendario de Tu Proceso
                </h2>

                <div className="espacio mb-10">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line mb-8">
                    {bookContent.calendario_personalizado.descripcion}
                  </p>
                </div>

                <div className="espacio mb-8">
                  <h3 className="text-2xl font-semibold text-blue-700 mb-4">🌑 Lunas Nuevas - Sembrar conciencia</h3>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {bookContent.calendario_personalizado.lunas_nuevas_intro}
                  </p>
                </div>

                <div className="espacio mb-8">
                  <h3 className="text-2xl font-semibold text-blue-700 mb-4">🌕 Lunas Llenas - Iluminar y soltar</h3>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {bookContent.calendario_personalizado.lunas_llenas_intro}
                  </p>
                </div>

                <div className="espacio">
                  <h3 className="text-2xl font-semibold text-blue-700 mb-4">🌘 Eclipses - Cambios que no negocian</h3>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {bookContent.calendario_personalizado.eclipses_intro}
                  </p>
                </div>
              </div>

              {/* CIERRE DEL CICLO */}
              <div className="seccion p-12 print:page-break-after-always">
                <h2 className="text-4xl font-bold text-rose-900 mb-8 border-b-2 border-rose-200 pb-4">
                  🕯️ Cierre del Ciclo
                </h2>

                <div className="espacio mb-10">
                  <h3 className="text-2xl font-semibold text-rose-700 mb-4">Integrar lo vivido</h3>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {bookContent.cierre_del_ciclo.integrar_lo_vivido}
                  </p>
                </div>

                <div className="espacio mb-10">
                  <h3 className="text-2xl font-semibold text-rose-700 mb-4">Carta de cierre</h3>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {bookContent.cierre_del_ciclo.carta_de_cierre}
                  </p>
                </div>

                <div className="espacio">
                  <h3 className="text-2xl font-semibold text-rose-700 mb-4">Preparar la próxima vuelta al Sol</h3>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {bookContent.cierre_del_ciclo.preparar_proxima_vuelta}
                  </p>
                </div>
              </div>

              {/* CONTRAPORTADA */}
              <div className="portada p-16 text-center flex flex-col justify-center items-center min-h-screen">
                <p className="text-3xl text-gray-700 italic max-w-2xl leading-relaxed">
                  "{bookContent.frase_final}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ESTILOS DE IMPRESIÓN */}
      <style jsx global>{`
        @media print {
          @page {
            size: A5;
            margin: 1.5cm;
          }

          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          .book-content {
            background: white !important;
            box-shadow: none !important;
          }

          .portada,
          .seccion {
            page-break-inside: avoid;
          }

          .espacio {
            page-break-inside: avoid;
          }

          h1, h2, h3, h4 {
            page-break-after: avoid;
          }

          p {
            orphans: 3;
            widows: 3;
          }
        }
      `}</style>
    </>
  );
}
