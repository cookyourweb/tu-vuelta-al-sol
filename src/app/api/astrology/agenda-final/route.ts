// src/app/api/astrology/agenda-final/route.ts - VERSIÓN PROFESIONAL
import { NextRequest, NextResponse } from 'next/server';
import { getNatalHoroscope, getAstronomicalEvents } from '@/services/astrologyService';
import { getProgressedChart } from '@/services/progressedChartService';
import { ChartData, Planet, House, Aspect, PlanetName, ZodiacSign, AspectName } from '@/types/astrology';

/**
 * ✅ ENDPOINT PROFESIONAL DE AGENDA ASTROLÓGICA
 */

// =============================================================================
// INTERFACES ESPECÍFICAS DEL ENDPOINT
// =============================================================================

interface BirthDataRequest {
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  startDate?: string;
  endDate?: string;
  fullName?: string;
}

interface AgendaResponse {
  success: boolean;
  agenda: AgendaData;
  resumen: AgendaSummary;
}

interface AgendaData {
  portada: AgendaCover;
  cartas: ChartsSection;
  eventos: EventsSection;
  analisis: AnalysisSection;
  rituales: RitualsSection;
  metadata: AgendaMetadata;
}

interface AgendaCover {
  titulo: string;
  subtitulo: string;
  nombre: string;
  periodo: { inicio: string; fin: string };
  datosNacimiento: BirthDataSummary;
}

interface ChartsSection {
  natal: ChartResult;
  progresada: ChartResult;
}

interface ChartResult {
  estado: 'obtenida exitosamente' | 'no disponible';
  planetas?: Planet[];
  casas?: House[];
  aspectos?: Aspect[];
  error?: string;
  año?: number;
  evolutivo?: boolean;
}

interface EventsSection {
  fasesLunares: LunarPhase[];
  retrogradaciones: Retrograde[] | null;
  estado: 'completos' | 'simulados';
  errores: string[];
}

interface LunarPhase {
  fecha: string;
  tipo: string;
  signo: ZodiacSign;
  grado: number;
  hora?: string;
}

interface Retrograde {
  planeta: PlanetName;
  fechaInicio: string;
  fechaFin: string;
  signoInicio: ZodiacSign;
  signoFin: ZodiacSign;
}

interface AnalysisSection {
  enfoquesPrincipales: string[];
  temasPredominantes: string[];
  recomendacionesClave: string[];
}

interface RitualsSection {
  lunasNuevas: string[];
  lunasLlenas: string[];
  estaciones: string[];
  afirmaciones: string[];
}

interface BirthDataSummary {
  fecha: string;
  hora: string;
  coordenadas: string;
  timezone: string;
  lugar: string;
}

interface AgendaMetadata {
  generadaEn: string;
  configuracion: ConfigurationInfo;
  datosCorregidos: CorrectedData;
}

interface ConfigurationInfo {
  ayanamsa: string;
  sistemaCasas: string;
  precisionCoordenadas: number;
  timezone: string;
  version: string;
}

interface CorrectedData {
  fechaOriginal: string;
  fechaCorregida: string;
  horaOriginal: string;
  horaCorregida: string;
  timezoneAplicado: string;
}

interface AgendaSummary {
  cartaNatal: string;
  cartaProgresada: string;
  eventosAstrologicos: string;
  estado: string;
}

// =============================================================================
// UTILIDADES DE TRANSFORMACIÓN DE DATOS
// =============================================================================

class DataTransformService {
  /**
   * Convierte datos de API a estructura Planet tipada
   */
  static transformPlanets(apiPlanets: any[]): Planet[] {
    if (!Array.isArray(apiPlanets)) return [];
    
    return apiPlanets.map(planet => ({
      name: this.mapPlanetName(planet?.name || planet?.nombre || 'Sol'),
      sign: this.mapZodiacSign(planet?.sign || planet?.signo || 'Aries'),
      degree: this.formatDegree(planet?.degree || planet?.grado || 0),
      longitude: planet?.longitude || planet?.longitud || 0,
      houseNumber: planet?.house || planet?.casa || 1,
      isRetrograde: Boolean(planet?.retrograde || planet?.retrogrado || false)
    }));
  }

  /**
   * Convierte datos de API a estructura House tipada
   */
  static transformHouses(apiHouses: any[]): House[] {
    if (!Array.isArray(apiHouses)) return [];
    
    return apiHouses.map((house, index) => ({
      number: house?.number || house?.numero || (index + 1),
      sign: this.mapZodiacSign(house?.sign || house?.signo || 'Aries'),
      degree: this.formatDegree(house?.degree || house?.grado || 0),
      longitude: house?.longitude || house?.longitud || 0
    }));
  }

  /**
   * Convierte datos de API a estructura Aspect tipada
   */
  static transformAspects(apiAspects: any[]): Aspect[] {
    if (!Array.isArray(apiAspects)) return [];
    
    return apiAspects.map(aspect => ({
      planet1: {
        id: aspect?.planet1?.id || 1,
        name: aspect?.planet1?.name || aspect?.planeta1 || 'Sol'
      },
      planet2: {
        id: aspect?.planet2?.id || 2,
        name: aspect?.planet2?.name || aspect?.planeta2 || 'Luna'
      },
      aspect: {
        id: aspect?.aspect?.id || 1,
        name: this.mapAspectName(aspect?.type || aspect?.tipo || aspect?.aspect?.name || 'Conjunción')
      },
      orb: aspect?.orb || aspect?.orbe || 0
    }));
  }

  /**
   * Mapea nombres de planetas a tipos válidos
   */
  private static mapPlanetName(name: string): PlanetName {
    const planetMap: Record<string, PlanetName> = {
      'Sun': 'Sol',
      'Moon': 'Luna',
      'Mercury': 'Mercurio',
      'Venus': 'Venus',
      'Mars': 'Marte',
      'Jupiter': 'Júpiter',
      'Saturn': 'Saturno',
      'Uranus': 'Urano',
      'Neptune': 'Neptuno',
      'Pluto': 'Plutón',
      'Chiron': 'Quirón',
      'Lilith': 'Lilith',
      'North Node': 'Nodo N Verdadero',
      'South Node': 'Nodo S Verdadero',
      // Nombres en español
      'Sol': 'Sol',
      'Luna': 'Luna',
      'Mercurio': 'Mercurio'
    };
    
    return planetMap[name] || 'Sol';
  }

  /**
   * Mapea nombres de signos a tipos válidos
   */
  private static mapZodiacSign(sign: string): ZodiacSign {
    const signMap: Record<string, ZodiacSign> = {
      'Aries': 'Aries',
      'Taurus': 'Tauro',
      'Gemini': 'Géminis',
      'Cancer': 'Cáncer',
      'Leo': 'Leo',
      'Virgo': 'Virgo',
      'Libra': 'Libra',
      'Scorpio': 'Escorpio',
      'Sagittarius': 'Sagitario',
      'Capricorn': 'Capricornio',
      'Aquarius': 'Acuario',
      'Pisces': 'Piscis',
      // Nombres en español
      'Tauro': 'Tauro',
      'Géminis': 'Géminis',
      'Cáncer': 'Cáncer',
      'Escorpio': 'Escorpio',
      'Sagitario': 'Sagitario',
      'Capricornio': 'Capricornio',
      'Acuario': 'Acuario'
    };
    
    return signMap[sign] || 'Aries';
  }

  /**
   * Mapea nombres de aspectos a tipos válidos
   */
  private static mapAspectName(name: string): AspectName {
    const aspectMap: Record<string, AspectName> = {
      'conjunction': 'Conjunción',
      'opposition': 'Oposición',
      'square': 'Cuadratura',
      'trine': 'Trígono',
      'sextile': 'Sextil',
      'quincunx': 'Quincuncio',
      'semisextile': 'Semisextil',
      'sesquiquadrate': 'Sesquicuadratura',
      'semisquare': 'Semicuadratura',
      'quintile': 'Quintil',
      'biquintile': 'Biquintil'
    };
    
    return aspectMap[name.toLowerCase()] || 'Conjunción';
  }

  /**
   * Formatea grados con precisión
   */
  private static formatDegree(degree: number): string {
    const deg = Math.floor(degree % 30);
    const min = Math.floor((degree % 1) * 60);
    const sec = Math.floor(((degree % 1) * 60 % 1) * 60);
    return `${deg}°${min}'${sec}"`;
  }
}

// =============================================================================
// SERVICIO DE UTILIDADES GENERALES
// =============================================================================

class AgendaUtilsService {
  static formatSpanishDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }

  static determineLocation(lat: number, lon: number): string {
    const knownLocations = [
      { lat: 40.4164, lon: -3.7025, name: 'Madrid, España' },
      { lat: 41.3851, lon: 2.1734, name: 'Barcelona, España' },
      { lat: 40.7128, lon: -74.0060, name: 'Nueva York, Estados Unidos' },
      { lat: 51.5074, lon: -0.1278, name: 'Londres, Reino Unido' },
      { lat: -34.6037, lon: -58.3816, name: 'Buenos Aires, Argentina' }
    ];

    let closestLocation = 'Ubicación personalizada';
    let minDistance = Infinity;

    knownLocations.forEach(location => {
      const distance = Math.sqrt(
        Math.pow(lat - location.lat, 2) + Math.pow(lon - location.lon, 2)
      );

      if (distance < minDistance && distance < 0.1) {
        minDistance = distance;
        closestLocation = location.name;
      }
    });

    return closestLocation;
  }

  static validateBirthData(data: Partial<BirthDataRequest>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.birthDate) errors.push('Se requiere fecha de nacimiento');
    if (data.latitude === undefined) errors.push('Se requiere latitud');
    if (data.longitude === undefined) errors.push('Se requiere longitud');

    if (data.latitude !== undefined && (data.latitude < -90 || data.latitude > 90)) {
      errors.push('Latitud debe estar entre -90 y 90');
    }

    if (data.longitude !== undefined && (data.longitude < -180 || data.longitude > 180)) {
      errors.push('Longitud debe estar entre -180 y 180');
    }

    return { valid: errors.length === 0, errors };
  }
}

// =============================================================================
// GENERADORES DE CONTENIDO
// =============================================================================

class ContentGeneratorService {
  static generateSampleLunarPhases(): LunarPhase[] {
    return [
      { fecha: '2025-01-13', tipo: 'Luna Llena', signo: 'Cáncer', grado: 23 },
      { fecha: '2025-01-29', tipo: 'Luna Nueva', signo: 'Acuario', grado: 9 },
      { fecha: '2025-02-12', tipo: 'Luna Llena', signo: 'Leo', grado: 24 },
      { fecha: '2025-02-27', tipo: 'Luna Nueva', signo: 'Piscis', grado: 9 },
      { fecha: '2025-03-14', tipo: 'Luna Llena', signo: 'Virgo', grado: 24 },
      { fecha: '2025-03-29', tipo: 'Luna Nueva', signo: 'Aries', grado: 9 }
    ];
  }

  static generatePersonalizedAnalysis(hasNatalData: boolean, hasProgressedData: boolean): AnalysisSection {
    return {
      enfoquesPrincipales: [
        'Propósito evolutivo y destino del alma',
        'Sanación emocional y liberación kármica',
        'Manifestación consciente y abundancia',
        'Relaciones y conexiones significativas'
      ],
      temasPredominantes: hasNatalData ? [
        'Análisis basado en carta natal disponible',
        hasProgressedData ? 'Evolución anual integrada' : 'Enfoque en patrones natales'
      ] : [
        'Análisis general personalizado',
        'Enfoque en crecimiento espiritual'
      ],
      recomendacionesClave: [
        'Conectar con los ciclos lunares para mayor armonía',
        'Utilizar los períodos retrógrados para reflexión profunda',
        'Honrar tu naturaleza astrológica única',
        'Integrar sabiduría cósmica en decisiones diarias'
      ]
    };
  }

  static generateRituals(year: number): RitualsSection {
    return {
      lunasNuevas: [
        'Ritual de intenciones en luna nueva: Escribir 3 deseos específicos',
        'Meditación de manifestación con velas blancas',
        'Diario de gratitud y visión del futuro'
      ],
      lunasLlenas: [
        'Ritual de liberación en luna llena: Quemar lo que ya no sirve',
        'Baño purificador con sal marina y aceites esenciales',
        'Celebración de logros y reconocimiento personal'
      ],
      estaciones: [
        `Ritual de año nuevo ${year}: Renovación de propósitos`,
        'Ritual de equinoccio: Equilibrio entre luz y sombra',
        'Ritual de solsticio: Honrar los ciclos naturales'
      ],
      afirmaciones: [
        'Confío en el timing perfecto del universo',
        'Estoy alineado/a con mi propósito más elevado',
        'Abrazo los cambios como oportunidades de crecimiento',
        'Soy un canal de amor, sabiduría y abundancia'
      ]
    };
  }
}

// =============================================================================
// ENDPOINT PRINCIPAL
// =============================================================================

export async function POST(request: NextRequest): Promise<NextResponse<AgendaResponse | { success: false; error: string; details?: string[] }>> {
  try {
    const body = await request.json() as BirthDataRequest;
    
    // Validación de datos de entrada
    const validation = AgendaUtilsService.validateBirthData(body);
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: 'Datos de entrada inválidos',
        details: validation.errors
      }, { status: 400 });
    }

    const {
      birthDate,
      birthTime = '12:00:00',
      latitude,
      longitude,
      timezone = 'Europe/Madrid',
      startDate,
      endDate,
      fullName = 'Alma Especial'
    } = body;

    const currentYear = new Date(startDate || new Date()).getFullYear();

    console.log('📅 Generando agenda profesional:', { birthDate, birthTime, latitude, longitude });

    // Obtener carta natal
    let natalChart: ChartResult;
    try {
      const natalData = await getNatalHoroscope(birthDate, birthTime, latitude, longitude, timezone);
      natalChart = {
        estado: 'obtenida exitosamente',
        planetas: DataTransformService.transformPlanets(natalData?.planets || []),
        casas: DataTransformService.transformHouses(natalData?.houses || []),
        aspectos: DataTransformService.transformAspects(natalData?.aspects || [])
      };
    } catch (error) {
      natalChart = {
        estado: 'no disponible',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }

    // Obtener carta progresada
    let progressedChart: ChartResult;
    try {
      const progressedData = await getProgressedChart(birthDate, birthTime, latitude, longitude, timezone, currentYear);
      progressedChart = {
        estado: 'obtenida exitosamente',
        año: currentYear,
        planetas: DataTransformService.transformPlanets(progressedData?.planets || []),
        evolutivo: true
      };
    } catch (error) {
      progressedChart = {
        estado: 'no disponible',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }

    // Construir agenda
    const agenda: AgendaData = {
      portada: {
        titulo: `Tu Vuelta al Sol ${currentYear}`,
        subtitulo: 'Agenda Astrológica Personalizada',
        nombre: fullName,
        periodo: {
          inicio: AgendaUtilsService.formatSpanishDate(startDate || `${currentYear}-01-01`),
          fin: AgendaUtilsService.formatSpanishDate(endDate || `${currentYear}-12-31`)
        },
        datosNacimiento: {
          fecha: AgendaUtilsService.formatSpanishDate(birthDate),
          hora: birthTime,
          coordenadas: `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`,
          timezone,
          lugar: AgendaUtilsService.determineLocation(latitude, longitude)
        }
      },
      cartas: {
        natal: natalChart,
        progresada: progressedChart
      },
      eventos: {
        fasesLunares: ContentGeneratorService.generateSampleLunarPhases(),
        retrogradaciones: null,
        estado: 'simulados',
        errores: []
      },
      analisis: ContentGeneratorService.generatePersonalizedAnalysis(
        natalChart.estado === 'obtenida exitosamente',
        progressedChart.estado === 'obtenida exitosamente'
      ),
      rituales: ContentGeneratorService.generateRituals(currentYear),
      metadata: {
        generadaEn: new Date().toISOString(),
        configuracion: {
          ayanamsa: 'tropical (0)',
          sistemaCasas: 'placidus',
          precisionCoordenadas: 4,
          timezone,
          version: 'v3.0-profesional'
        },
        datosCorregidos: {
          fechaOriginal: body.birthDate,
          fechaCorregida: birthDate,
          horaOriginal: body.birthTime || 'no especificada',
          horaCorregida: birthTime,
          timezoneAplicado: timezone
        }
      }
    };

    return NextResponse.json({
      success: true,
      agenda,
      resumen: {
        cartaNatal: natalChart.estado === 'obtenida exitosamente' ? '✅ Exitosa' : '❌ Error',
        cartaProgresada: progressedChart.estado === 'obtenida exitosamente' ? '✅ Exitosa' : '⚠️ No disponible',
        eventosAstrologicos: '⚠️ Simulados',
        estado: 'AGENDA GENERADA PROFESIONALMENTE'
      }
    });

  } catch (error) {
    console.error('❌ Error generando agenda:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/astrology/agenda-final',
    version: 'v3.0-profesional',
    descripcion: 'Endpoint profesional con tipos TypeScript y servicios reutilizables',
    estado: 'OPERATIVO',
    servicios: [
      'DataTransformService - Transformación de datos tipada',
      'AgendaUtilsService - Utilidades generales',
      'ContentGeneratorService - Generación de contenido'
    ]
  });
}