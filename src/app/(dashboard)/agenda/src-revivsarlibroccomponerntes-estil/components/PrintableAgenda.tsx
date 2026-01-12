import { useRef } from "react";
import { addDays, addMonths, startOfMonth, isBefore, format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";
import { useStyle } from "@/contexts/StyleContext";
import { StyleSwitcher } from "./StyleSwitcher";
// Portal de Entrada
import { PortadaPersonalizada, PaginaIntencion } from "./agenda/PortalEntrada";
// ÍNDICE NAVEGABLE
import { IndiceNavegable } from "./agenda/IndiceNavegable";
// Tu Año Tu Viaje
import { CartaBienvenida, TemaCentralAnio, LoQueVieneAMover, LoQuePideSoltar, PaginaIntencionAnual } from "./agenda/TuAnioTuViaje";
// Tu Año 2026 Overview (Personalizado Vero)
import { TuAnio2026Overview, TuAnio2026Ciclos } from "./agenda/TuAnio2026Vero";
// Soul Chart
import { EsenciaNatal, NodoNorte, NodoSur, PlanetasDominantes, PatronesEmocionales } from "./agenda/SoulChart";
// Retorno Solar
import { QueEsRetornoSolar, AscendenteAnio, SolRetorno, LunaRetorno, EjesDelAnio, EjesDelAnio2, IntegracionEjes, RitualCumpleanos, MantraAnual } from "./agenda/RetornoSolar";
// NUEVO: Calendario Anual Unificado (con estilos)
import { LineaTiempoEmocionalEstilizada, MesesClavePuntosGiroEstilizado, GrandesAprendizajesEstilizado } from "./agenda/CalendarioAnualUnificado";
// NUEVO: Ejemplos de meses completos
import { Enero2026Completo, Febrero2026Completo, Junio2026Completo, UltimoDiaCicloEjemplo } from "./agenda/EjemplosMesCompleto";
// Terapias Creativas
import { EscrituraTerapeutica, Visualizacion, RitualSimbolico, TrabajoEmocional } from "./agenda/TerapiasCreativas";
// Cierre
import { QuienEraQuienSoy, PreparacionProximaVuelta, CartaCierre, Contraportada } from "./agenda/CierreCiclo";

interface PrintableAgendaProps {
  name: string;
  birthday: Date;
  onBack: () => void;
}

export const PrintableAgenda = ({ name, birthday, onBack }: PrintableAgendaProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const { config } = useStyle();

  const currentYear = new Date().getFullYear();
  const birthdayThisYear = new Date(currentYear, birthday.getMonth(), birthday.getDate());
  const today = new Date();
  
  const startDate = isBefore(birthdayThisYear, today)
    ? birthdayThisYear
    : new Date(currentYear - 1, birthday.getMonth(), birthday.getDate());
  
  const endDate = addDays(new Date(startDate.getFullYear() + 1, birthday.getMonth(), birthday.getDate()), -1);

  // Generate months
  const generateMonths = () => {
    const months: Date[] = [];
    let currentMonth = startOfMonth(startDate);
    while (isBefore(currentMonth, endDate)) {
      months.push(currentMonth);
      currentMonth = addMonths(currentMonth, 1);
    }
    return months.slice(0, 12);
  };

  const months = generateMonths();

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-background">
      {/* Controls */}
      <div className={`no-print sticky top-0 z-50 backdrop-blur border-b border-border p-4 ${config.headerBg} ${config.headerText}`}>
        <div className="container mx-auto flex items-center justify-between">
          <Button variant="cosmic-outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" /> Volver
          </Button>
          <div className="flex items-center gap-4">
            <StyleSwitcher />
            <Button variant="cosmic" onClick={handlePrint}>
              <Printer className="w-4 h-4" /> Imprimir Libro
            </Button>
          </div>
        </div>
        <p className="text-center text-muted-foreground text-sm mt-2">
          Agenda de <span className="text-cosmic-gold font-semibold">{name}</span> · {format(startDate, "d MMM yyyy", { locale: es })} - {format(endDate, "d MMM yyyy", { locale: es })}
        </p>
      </div>

      {/* Book content */}
      <div ref={printRef} className="container mx-auto py-8 space-y-0 print:p-0">
        {/* 1. PORTAL DE ENTRADA */}
        <PortadaPersonalizada name={name} startDate={startDate} endDate={endDate} />
        <PaginaIntencion />

        {/* ÍNDICE NAVEGABLE (dentro del libro) */}
        <IndiceNavegable />

        {/* 2. TU AÑO, TU VIAJE */}
        <CartaBienvenida name={name} />
        <TemaCentralAnio />
        <LoQueVieneAMover />
        <LoQuePideSoltar />
        <PaginaIntencionAnual />

        {/* 3. SOUL CHART */}
        <EsenciaNatal />
        <NodoNorte />
        <NodoSur />
        <PlanetasDominantes />
        <PatronesEmocionales />

        {/* 4. RETORNO SOLAR */}
        <QueEsRetornoSolar />
        <AscendenteAnio />
        <SolRetorno />
        <LunaRetorno />
        <EjesDelAnio />
        <EjesDelAnio2 />
        <IntegracionEjes />
        <RitualCumpleanos />
        <MantraAnual />

        {/* 5. TU AÑO 2026 - OVERVIEW */}
        <TuAnio2026Overview />
        <TuAnio2026Ciclos />

        {/* 6. CALENDARIO ANUAL - CON ESTILOS UNIFICADOS */}
        <LineaTiempoEmocionalEstilizada startDate={startDate} endDate={endDate} />
        <MesesClavePuntosGiroEstilizado />
        <GrandesAprendizajesEstilizado />

        {/* EJEMPLO 1: ENERO 2026 COMPLETO */}
        <Enero2026Completo birthday={birthday} />

        {/* EJEMPLO 2: FEBRERO 2026 (MES DEL CUMPLEAÑOS) */}
        <Febrero2026Completo birthday={birthday} nombre={name} />

        {/* EJEMPLO 3: JUNIO 2026 (MES MITAD DE AÑO) */}
        <Junio2026Completo birthday={birthday} />

        {/* 9. TERAPIAS CREATIVAS */}
        <EscrituraTerapeutica />
        <Visualizacion />
        <RitualSimbolico />
        <TrabajoEmocional />

        {/* 10. CIERRE DE CICLO */}
        <UltimoDiaCicloEjemplo birthday={birthday} nombre={name} />
        <QuienEraQuienSoy />
        <PreparacionProximaVuelta />
        <CartaCierre name={name} />

        {/* 11. CONTRAPORTADA */}
        <Contraportada />
      </div>
    </div>
  );
};
