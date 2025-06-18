// types/agenda.ts - Tipos específicos para la agenda astrológica
import { Planet, ZodiacSign } from '../astrology';
import { Aspect, House } from '@/services/astrologyService';

export interface BirthDataRequest {
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  startDate?: string;
  endDate?: string;
  fullName?: string;
}

export interface AgendaResponse {
  success: boolean;
  agenda: AgendaData;
  resumen: AgendaSummary;
}

export interface AgendaData {
  portada: AgendaCover;
  cartas: ChartsSection;
  eventos: EventsSection;
  analisis: AnalysisSection;
  rituales: RitualsSection;
  metadata: AgendaMetadata;
}

export interface AgendaCover {
  titulo: string;
  subtitulo: string;
  nombre: string;
  periodo: { inicio: string; fin: string };
  datosNacimiento: BirthDataSummary;
}

export interface ChartsSection {
  natal: ChartResult;
  progresada: ChartResult;
}

export interface ChartResult {
  estado: 'obtenida exitosamente' | 'no disponible';
  planetas?: Planet[];
  casas?: House[];
  aspectos?: Aspect[];
  error?: string;
  año?: number;
  evolutivo?: boolean;
}

export interface EventsSection {
  fasesLunares: LunarPhase[];
  retrogradaciones: Retrograde[] | null;
  estado: 'completos' | 'simulados';
  errores: string[];
}

export interface LunarPhase {
  fecha: string;
  tipo: string;
  signo: ZodiacSign;
  grado: number;
  hora?: string;
}

export interface Retrograde {
  planeta: Planet;
  fechaInicio: string;
  fechaFin: string;
  signoInicio: ZodiacSign;
  signoFin: ZodiacSign;
}

export interface AnalysisSection {
  enfoquesPrincipales: string[];
  temasPredominantes: string[];
  recomendacionesClave: string[];
}

export interface RitualsSection {
  lunasNuevas: string[];
  lunasLlenas: string[];
  estaciones: string[];
  afirmaciones: string[];
}

export interface BirthDataSummary {
  fecha: string;
  hora: string;
  coordenadas: string;
  timezone: string;
  lugar: string;
}

export interface AgendaMetadata {
  generadaEn: string;
  configuracion: ConfigurationInfo;
  datosCorregidos: CorrectedData;
}

export interface ConfigurationInfo {
  ayanamsa: string;
  sistemaCasas: string;
  precisionCoordenadas: number;
  timezone: string;
  version: string;
}

export interface CorrectedData {
  fechaOriginal: string;
  fechaCorregida: string;
  horaOriginal: string;
  horaCorregida: string;
  timezoneAplicado: string;
}

export interface AgendaSummary {
  cartaNatal: string;
  cartaProgresada: string;
  eventosAstrologicos: string;
  estado: string;
}