'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addMonths } from 'date-fns';

// Importar componentes del libro
import PortalEntrada from '@/components/agenda/libro/PortalEntrada';
import TuAnioTuViaje from '@/components/agenda/libro/TuAnioTuViaje';
import SoulChart from '@/components/agenda/libro/SoulChart';
import RetornoSolar from '@/components/agenda/libro/RetornoSolar';
import CalendarioAnual from '@/components/agenda/libro/CalendarioAnual';
import MesPage from '@/components/agenda/libro/MesPage';
import CierreCiclo from '@/components/agenda/libro/CierreCiclo';
import { EscrituraTerapeutica, Visualizacion, RitualSimbolico, TrabajoEmocional } from '@/components/agenda/libro/TerapiaCreativa';
import { PrimerDiaCiclo, UltimoDiaCiclo, QuienEraQuienSoy, PreparacionProximaVuelta, CartaCierre, PaginaFinalBlanca, Contraportada } from '@/components/agenda/libro/PaginasEspeciales';

interface MonthEvent {
  date: string | Date;
  type: string;
  sign?: string;
  signo?: string;
  description?: string;
  house?: number;
  interpretation?: any;
}

interface MonthData {
  nombre: string;
  nombreCorto: string;
  inicio: string;
  fin: string;
  lunas_nuevas: Array<{
    fecha: string;
    signo: string;
    casa: number;
    descripcion: string;
  }>;
  lunas_llenas: Array<{
    fecha: string;
    signo: string;
    casa: number;
    descripcion: string;
  }>;
  eclipses: Array<{
    fecha: string;
    tipo: string;
    signo: string;
    casa: number;
    descripcion: string;
  }>;
  ingresos_destacados: Array<{
    fecha: string;
    planeta: string;
    signo: string;
    descripcion: string;
  }>;
  total_eventos: number;
}

interface MonthInterpretation {
  mes: string;
  portada_mes: string;
  interpretacion_mensual: string;
  ritual_del_mes: string;
  mantra_mensual: string;
}

interface BookContent {
  userName: string;
  userAge?: number;
  startDate: string;
  endDate: string;
  natalChart?: {
    planets?: any[];
    houses?: any[];
    ascendant?: any;
    nodes?: any[];
  };
  solarReturn?: {
    interpretation?: string;
    ascendant?: any;
    planets?: any[];
    chartDate?: string;
    location?: string;
  };
  yearEvents?: any[];
  eventInterpretations?: { [eventId: string]: any }; // ✨ Interpretaciones de eventos por eventId
  portada?: {
    titulo?: string;
    subtitulo?: string;
    dedicatoria?: string;
  };
  apertura_del_viaje?: {
    antes_de_empezar?: string;
    carta_de_bienvenida?: string;
    tema_central_del_año?: string;
    que_soltar?: string;
    ritual_de_inicio?: string;
  };
  tu_mapa_interior?: {
    carta_natal_explicada?: string;
    soul_chart?: {
      nodo_sur?: string;
      nodo_norte?: string;
      planeta_dominante?: string;
      patron_alma?: string;
      patrones_inconscientes?: string;
    };
    integrar_proposito?: string;
  };
  tu_año_astrologico?: {
    retorno_solar?: {
      asc_significado?: string;
      sol_en_casa?: string;
      luna_en_casa?: string;
      planetas_angulares?: string;
      ritual_inicio?: string;
      ascendente_del_año?: string;
      tema_principal?: string;
      ritual_de_cumpleaños?: string;
      mantra_del_año?: string;
    };
  };
  calendario_personalizado?: {
    descripcion?: string;
    meses_clave?: string;
    aprendizajes_del_año?: string;
    lunas_nuevas_intro?: string;
    lunas_llenas_intro?: string;
    eclipses_intro?: string;
  };
  mes_a_mes?: MonthInterpretation[];
  monthsData?: MonthData[];
  cierre_del_ciclo?: {
    integrar_lo_vivido?: string;
    carta_de_cierre?: string;
    preparacion_proximo_ciclo?: string;
    preparar_proxima_vuelta?: string;
  };
  frase_final?: string;
}

export default function LibroAgendaPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookContent, setBookContent] = useState<BookContent | null>(null);

  useEffect(() => {
    const generateBook = async () => {
      if (!user) {
        router.push('/agenda');
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

    generateBook();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Generando tu libro astrológico personalizado...</p>
          <p className="text-purple-300 text-sm mt-2">Esto puede tomar unos momentos</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-900/30 border border-red-400/30 rounded-lg p-6">
          <h2 className="text-red-200 text-xl font-semibold mb-3">Error</h2>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={() => router.push('/agenda')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Volver a Agenda
          </button>
        </div>
      </div>
    );
  }

  if (!bookContent) {
    return null;
  }

  // Parsear fechas
  const startDate = bookContent.startDate ? new Date(bookContent.startDate) : new Date();
  const endDate = bookContent.endDate ? new Date(bookContent.endDate) : addMonths(startDate, 12);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* BARRA SUPERIOR (solo en pantalla) */}
      <div className="sticky top-0 z-50 bg-purple-900 border-b border-purple-700 shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <button
            onClick={() => router.push('/agenda')}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Agenda
          </button>

          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-cosmic-gold hover:bg-cosmic-amber text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir Libro
          </button>
        </div>
      </div>

      {/* CONTENIDO DEL LIBRO */}
      <div className="book-content bg-white print:bg-white">

        {/* PORTAL DE ENTRADA */}
        <PortalEntrada
          userName={bookContent.userName}
          startDate={startDate}
          endDate={endDate}
          portada={bookContent.portada}
          apertura={bookContent.apertura_del_viaje}
        />

        {/* PRIMER DÍA DEL CICLO */}
        <PrimerDiaCiclo
          fecha={startDate}
          nombre={bookContent.userName}
        />

        {/* TU AÑO TU VIAJE */}
        <TuAnioTuViaje
          userName={bookContent.userName}
          apertura={bookContent.apertura_del_viaje}
          solarReturn={bookContent.solarReturn}
        />

        {/* SOUL CHART */}
        <SoulChart
          natalChart={bookContent.natalChart}
          tuMapaInterior={bookContent.tu_mapa_interior}
        />

        {/* RETORNO SOLAR */}
        <RetornoSolar
          solarReturn={bookContent.solarReturn}
          tuAñoAstrologico={bookContent.tu_año_astrologico}
          startDate={startDate}
        />

        {/* CALENDARIO ANUAL */}
        <CalendarioAnual
          startDate={startDate}
          endDate={endDate}
          monthsData={bookContent.monthsData}
          yearEvents={bookContent.yearEvents}
          calendarioPersonalizado={bookContent.calendario_personalizado}
        />

        {/* MES A MES */}
        {bookContent.mes_a_mes && bookContent.monthsData && (
          <>
            {bookContent.mes_a_mes.map((monthInterp, index) => {
              const monthData = bookContent.monthsData?.[index];
              if (!monthData) return null;

              // Calcular fecha del mes
              const monthDate = addMonths(startDate, index);

              // Combinar todos los eventos del mes para MesPage
              const allMonthEvents: MonthEvent[] = [
                ...monthData.lunas_nuevas.map(e => ({ date: e.fecha, type: 'luna-nueva', sign: e.signo, description: e.descripcion, house: e.casa })),
                ...monthData.lunas_llenas.map(e => ({ date: e.fecha, type: 'luna-llena', sign: e.signo, description: e.descripcion, house: e.casa })),
                ...monthData.eclipses.map(e => ({ date: e.fecha, type: e.tipo, sign: e.signo, description: e.descripcion, house: e.casa })),
                ...monthData.ingresos_destacados.map(e => ({ date: e.fecha, type: 'ingreso', sign: e.signo, description: e.descripcion, house: 1 })) // ingresos no tienen casa
              ];

              // Transformar monthData para MesPage (Spanish → English field names)
              const transformedMonthData = {
                nombre: monthData.nombre,
                nombreCorto: monthData.nombreCorto,
                lunas_nuevas: monthData.lunas_nuevas.map(e => ({ date: e.fecha, type: 'luna-nueva', sign: e.signo, signo: e.signo, description: e.descripcion, house: e.casa })),
                lunas_llenas: monthData.lunas_llenas.map(e => ({ date: e.fecha, type: 'luna-llena', sign: e.signo, signo: e.signo, description: e.descripcion, house: e.casa })),
                eclipses: monthData.eclipses.map(e => ({ date: e.fecha, type: e.tipo, sign: e.signo, signo: e.signo, description: e.descripcion, house: e.casa })),
                ingresos_destacados: monthData.ingresos_destacados.map(e => ({ date: e.fecha, type: 'ingreso', sign: e.signo, signo: e.signo, description: e.descripcion })),
                total_eventos: monthData.total_eventos,
              };

              return (
                <MesPage
                  key={index}
                  monthDate={monthDate}
                  monthData={transformedMonthData}
                  interpretation={monthInterp}
                  allEvents={allMonthEvents}
                  userName={bookContent.userName}
                  eventInterpretations={bookContent.eventInterpretations || {}}
                />
              );
            })}
          </>
        )}

        {/* TERAPIA ASTROLÓGICA CREATIVA */}
        <EscrituraTerapeutica />
        <Visualizacion />
        <RitualSimbolico />
        <TrabajoEmocional />

        {/* CIERRE DEL CICLO */}
        <CierreCiclo
          userName={bookContent.userName}
          startDate={startDate}
          endDate={endDate}
          cierreDelCiclo={bookContent.cierre_del_ciclo}
          fraseFinal={bookContent.frase_final}
        />

        {/* PÁGINAS FINALES DE REFLEXIÓN */}
        <QuienEraQuienSoy />
        <PreparacionProximaVuelta />
        <CartaCierre name={bookContent.userName} />
        <PaginaFinalBlanca />

        {/* ÚLTIMO DÍA DEL CICLO */}
        <UltimoDiaCiclo
          fecha={endDate}
          nombre={bookContent.userName}
        />

        {/* CONTRAPORTADA */}
        <Contraportada />
      </div>

      {/* Print styles are configured in globals.css */}
    </div>
  );
}
