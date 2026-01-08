import { useRef } from "react";
import { addDays, addWeeks, addMonths, startOfWeek, startOfMonth, isBefore, format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";
import { useStyle } from "@/contexts/StyleContext";
import { StyleSwitcher } from "./StyleSwitcher";
// Portal de Entrada
import { PortadaPersonalizada, PaginaIntencion } from "./agenda/PortalEntrada";
// Tu Año Tu Viaje
import { CartaBienvenida, TemaCentralAnio, LoQueVieneAMover, LoQuePideSoltar, PaginaIntencionAnual } from "./agenda/TuAnioTuViaje";
// Soul Chart
import { EsenciaNatal, NodoNorte, NodoSur, PlanetasDominantes, PatronesEmocionales } from "./agenda/SoulChart";
// Retorno Solar
import { QueEsRetornoSolar, AscendenteAnio, SolRetorno, LunaRetorno, EjesDelAnio, EjesDelAnio2, IntegracionEjes, RitualCumpleanos, MantraAnual } from "./agenda/RetornoSolar";
// Calendario Anual
import { LineaTiempoEmocional, MesesClaveYPuntosGiro, GrandesAprendizajes } from "./agenda/CalendarioAnual";
// Mes Pages
import { PortadaMes, CalendarioMensualCompleto, DiasDelMes, InterpretacionMensual, RitualYMantraMes, IntencionMes } from "./agenda/MesPage";
// Ejemplo completo Enero 2026
import { 
  AperturaEneroIzquierda, 
  AperturaEneroDerecha, 
  CalendarioVisualEnero, 
  InterpretacionLunaNuevaEnero, 
  InterpretacionLunaLlenaEnero, 
  EjerciciosEnero, 
  MantraEnero, 
  Semana1Enero, 
  Semana2Enero, 
  Semana3Enero, 
  Semana4Enero, 
  CierreEnero 
} from "./agenda/EjemploEnero2026";
// Semanas
import { SemanaConsciente } from "./agenda/SemanaConsciente";
// Eventos Astrológicos
import { PaginaLunaNueva, PaginaLunaLlena, PaginaEclipse } from "./agenda/EventosAstrologicos";
// Terapias Creativas
import { EscrituraTerapeutica, Visualizacion, RitualSimbolico, TrabajoEmocional } from "./agenda/TerapiasCreativas";
// Integración
import { IntegracionMensual } from "./agenda/IntegracionMensual";
// Cierre
import { QuienEraQuienSoy, PreparacionProximaVuelta, CartaCierre, PaginaFinalBlanca, Contraportada } from "./agenda/CierreCiclo";

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

  // Generate weeks for each month
  const generateWeeksForMonth = (monthDate: Date) => {
    const weeks: { weekStart: Date; weekNumber: number }[] = [];
    const monthStart = startOfMonth(monthDate);
    const monthEnd = addMonths(monthStart, 1);
    let currentWeek = startOfWeek(monthStart, { weekStartsOn: 1 });
    let weekNum = 1;
    
    while (isBefore(currentWeek, monthEnd)) {
      weeks.push({ weekStart: currentWeek, weekNumber: weekNum });
      currentWeek = addWeeks(currentWeek, 1);
      weekNum++;
    }
    return weeks.slice(0, 4);
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

        {/* 5. CALENDARIO ANUAL */}
        <LineaTiempoEmocional startDate={startDate} endDate={endDate} />
        <MesesClaveYPuntosGiro />
        <GrandesAprendizajes />

        {/* EJEMPLO COMPLETO: ENERO 2026 */}
        <AperturaEneroIzquierda />
        <AperturaEneroDerecha />
        <CalendarioVisualEnero />
        <InterpretacionLunaNuevaEnero />
        <InterpretacionLunaLlenaEnero />
        <EjerciciosEnero />
        <MantraEnero />
        <Semana1Enero />
        <Semana2Enero />
        <Semana3Enero />
        <Semana4Enero />
        <CierreEnero />

        {/* 6-10. RESTO DE MESES (estructura base) */}
        {months.slice(1).map((monthDate, monthIndex) => {
          const weeksInMonth = generateWeeksForMonth(monthDate);
          const actualMonthNumber = monthIndex + 2; // Start from 2 since January is already shown
          return (
            <div key={monthIndex}>
              <PortadaMes monthDate={monthDate} monthNumber={actualMonthNumber} />
              <CalendarioMensualCompleto monthDate={monthDate} monthNumber={actualMonthNumber} birthday={birthday} />
              <DiasDelMes monthDate={monthDate} monthNumber={actualMonthNumber} birthday={birthday} />
              <InterpretacionMensual monthDate={monthDate} monthNumber={actualMonthNumber} />
              <RitualYMantraMes monthDate={monthDate} monthNumber={actualMonthNumber} />
              <IntencionMes monthDate={monthDate} monthNumber={actualMonthNumber} />
              
              {/* Semanas del mes */}
              {weeksInMonth.map((week, weekIdx) => (
                <SemanaConsciente 
                  key={weekIdx} 
                  weekStart={week.weekStart} 
                  weekNumber={(actualMonthNumber * 4) + weekIdx + 1} 
                />
              ))}
              
              {/* Eventos lunares intercalados */}
              {monthIndex % 3 === 0 && <PaginaLunaNueva />}
              {monthIndex % 3 === 1 && <PaginaLunaLlena />}
              {monthIndex === 4 && <PaginaEclipse />}
              
              {/* Integración mensual */}
              <IntegracionMensual monthDate={monthDate} />
            </div>
          );
        })}

        {/* 9. TERAPIAS CREATIVAS */}
        <EscrituraTerapeutica />
        <Visualizacion />
        <RitualSimbolico />
        <TrabajoEmocional />

        {/* 11. CIERRE DE CICLO */}
        <QuienEraQuienSoy />
        <PreparacionProximaVuelta />
        <CartaCierre name={name} />
        <PaginaFinalBlanca />

        {/* 12. CONTRAPORTADA */}
        <Contraportada />
      </div>
    </div>
  );
};
