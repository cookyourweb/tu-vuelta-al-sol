// src/types/astrology/unified-types.ts
// 🔥 TIPOS UNIFICADOS MEJORADOS CON DATOS DETALLADOS DE CARTA NATAL

// ==========================================
// TIPOS BÁSICOS
// ==========================================

export type ElementType = 'fire' | 'earth' | 'air' | 'water';
export type ModeType = 'cardinal' | 'fixed' | 'mutable';
export type EventType = 
  | 'lunar_phase' 
  | 'lunar_resonance'
  | 'solar_activation'
  | 'planetary_transit' 
  | 'retrograde' 
  | 'direct' 
  | 'aspect' 
  | 'eclipse' 
  | 'seasonal'
  | 'venus_harmony'
  | 'mars_action'
  | 'mercury_communication'
  | 'life_purpose_activation';

export type PersonalizedEventType = 
  | 'solar_activation'
  | 'lunar_resonance' 
  | 'life_purpose_activation'
  | 'venus_harmony'
  | 'mars_action'
  | 'mercury_communication'
  | 'lunar_phase'
  | 'planetary_transit'
  | 'eclipse';

export interface PersonalizedEventTypeWithContext {
  type: PersonalizedEventType;
  frequency: number;
  personalContext: PersonalizedEventContext;
}

// ==========================================
// 🔥 DATOS DETALLADOS DE PLANETAS
// ==========================================

export interface PlanetPosition {
  sign: string;           // "Acuario", "Libra", etc.
  house: number;          // 1-12
  degree: number;         // 0-30 grados dentro del signo
  longitude: number;      // 0-360 grados absolutos
  retrograde?: boolean;   // Si está retrógrado
  element: ElementType;   // fuego, tierra, aire, agua
  mode: ModeType;         // cardinal, fijo, mutable
}

export interface DetailedNatalChart {
  // Planetas principales con datos completos
  sol: PlanetPosition;
  luna: PlanetPosition;
  mercurio: PlanetPosition;
  venus: PlanetPosition;
  marte: PlanetPosition;
  jupiter: PlanetPosition;
  saturno: PlanetPosition;
  urano: PlanetPosition;
  neptuno: PlanetPosition;
  pluton: PlanetPosition;
  
  // Puntos importantes
  ascendente: PlanetPosition;
  mediocielo: PlanetPosition;
  
  // Nodos lunares
  nodo_norte?: PlanetPosition;
  nodo_sur?: PlanetPosition;
  
  // Aspectos principales
  aspectos: Array<{
    planeta1: string;
    planeta2: string;
    tipo: 'conjuncion' | 'oposicion' | 'trigono' | 'cuadratura' | 'sextil';
    orbe: number;
    energia: 'armonica' | 'desafiante' | 'neutra';
  }>;
}

export interface DetailedProgressedChart {
  // Planetas progresados más importantes
  sol_progresado: PlanetPosition;
  luna_progresada: PlanetPosition;
  mercurio_progresado: PlanetPosition;
  venus_progresada: PlanetPosition;
  marte_progresado: PlanetPosition;
  
  // Aspectos natal-progresado más relevantes
  aspectos_natales_progresados: Array<{
    planeta_natal: string;
    planeta_progresado: string;
    tipo: string;
    significado: string;
  }>;
  
  // Información del año progresado
  año_progresado: number;
  edad_correspondiente: number;
  periodo_validez: {
    inicio: string;
    fin: string;
  };
}

// ==========================================
// 🔥 PERFIL DE USUARIO ENRIQUECIDO
// ==========================================

export interface UserProfile {
  userId: string;
  name?: string;
  birthDate: string;
  birthTime?: string;
  birthPlace?: string;
  currentAge: number;
  nextAge: number;
  latitude: number;
  longitude: number;
  timezone: string;
  place: string;
  
  // 🔥 NUEVA SECCIÓN: Datos astrológicos detallados
  astrological?: AstrologicalAnalysis;
  detailedNatalChart?: DetailedNatalChart;
  detailedProgressedChart?: DetailedProgressedChart;
}

export interface AstrologicalAnalysis {
  // Análisis básico (mantener compatibilidad)
  signs: {
    sun: string;
    moon: string;
    ascendant: string;
    mercury: string;
    venus: string;
    mars: string;
  };
  houses: {
    sun: number;
    moon: number;
    mercury: number;
    venus: number;
    mars: number;
  };
  dominantElements: ElementType[];
  dominantMode: ModeType;
  lifeThemes: string[];
  strengths: string[];
  challenges: string[];
  progressions?: any;
  
  // 🔥 NUEVA SECCIÓN: Datos de carta detallados
  natalChart?: any;
  progressedChart?: any;
  
  // 🔥 NUEVA SECCIÓN: Análisis profundo
  planetaryStrengths?: {
    elemento_dominante: ElementType;
    planetas_en_elemento: string[];
    modo_dominante: ModeType;
    planetas_en_modo: string[];
  };
  
  aspectPattern?: {
    gran_trigono?: boolean;
    gran_cuadratura?: boolean;
    stellium?: {
      signo: string;
      planetas: string[];
      casa: number;
    };
  };
  
  casasActivadas?: {
    [casa: number]: {
      planetas: string[];
      tema_principal: string;
      energia: 'fuerte' | 'moderada' | 'debil';
    };
  };
}

// ==========================================
// ANÁLISIS PROGRESADO
// ==========================================

export interface ProgressedAnalysis {
  currentYear: number;
  progessedSun: {
    sign: string;
    house: number;
    degree: number;
  };
  progressedMoon: {
    sign: string;
    house: number;
    phase: string;
  };
  majorThemes: string[];
  opportunities: string[];
  challenges: string[];
  keyDates: Array<{
    date: string;
    event: string;
    significance: string;
  }>;
}

// ==========================================
// EVENTOS ASTROLÓGICOS
// ==========================================

export interface AstrologicalEvent {
  id: string;
  type: EventType | string;
  date: string;
  time?: string;
  title: string;
  description: string;
  priority?: 'high' | 'medium' | 'low';
  planet?: string;
  sign?: string;
  house?: number;
  phase?: string;
  
  // Interpretación IA opcional
  aiInterpretation?: PersonalizedInterpretation;
  
  // Contexto personalizado opcional
  personalContext?: PersonalizedEventContext;
}

export interface PersonalizedEventContext {
  relevantPlanet?: string;
  relevantSign?: string;
  natalConnection?: string;
  progressedConnection?: string | null;
  personalTheme?: string;
  lifeArea?: string;
  
  // 🔥 NUEVO: Conexión específica con carta natal
  natalPlanetPosition?: PlanetPosition;
  progressedPlanetPosition?: PlanetPosition;
  aspectosActivados?: Array<{
    tipo: string;
    planetas: string[];
    significado: string;
  }>;
}

// ==========================================
// INTERPRETACIONES PERSONALIZADAS MEJORADAS
// ==========================================

export interface PersonalizedInterpretation {
  meaning: string;
  lifeAreas: string[];
  advice: string | string[];
  mantra: string;
  ritual: string;
  actionPlan?: ActionPlan[];
  warningsAndOpportunities?: {
    warnings: string[];
    opportunities: string[];
  };
  
  // 🔥 NUEVO: Interpretación específica basada en carta
  natalContext?: {
    conexionPlanetaria: string;
    casaActivada: number;
    temaVida: string;
    desafioEvolutivo: string;
  };
  
  progressedContext?: {
    evolucionActual: string;
    temasEmergentes: string[];
    oportunidadesCrecimiento: string[];
  };
}

export interface ActionPlan {
  // Para compatibilidad con ambos formatos
  category?: string;
  action?: string;
  timing?: string;
  difficulty?: string;
  impact?: string;
  
  // Formato alternativo
  steps?: string[];
  powerHours?: string[];
  dangerZones?: string[];
  timeframe?: 'immediate' | 'weekly' | 'monthly' | 'quarterly';
  objectives?: string[];
  actions?: string[];
  milestones?: string[];
  metrics?: string[];
  
  // 🔥 NUEVO: Acciones basadas en posiciones planetarias
  planetaryTiming?: {
    mejoresMomentos: string[];
    evitarMomentos: string[];
    lunarPhase?: string;
    planetaryHours?: string[];
  };
}

// ==========================================
// 🔥 SISTEMA DISRUPTIVO INTEGRADO
// ==========================================

export interface DisruptiveInterpretation {
  shockValue: string;              // Apertura impactante
  epicRealization: string;         // Realización profunda
  whatToExpected: {                // Qué esperar por horas
    energeticShift: string;
    emotionalWave: string;
    mentalClarity: string;
    physicalSensations: string;
  };
  preparation: {                   // Preparación épica
    ritual: string;
    mindsetShift: string;
    physicalAction: string;
    energeticProtection: string;
  };
  revolutionaryAdvice: {          // Consejos revolucionarios
    doThis: string[];
    avoidThis: string[];
    powerHours: string[];
    dangerZones: string[];
  };
  manifestation: {                // Manifestación activa
    mantra: string;
    visualization: string;
    physicalGesture: string;
    elementalConnection: string;
  };
  expectedTransformation: {       // Transformación esperada
    immediate: string;
    weekly: string;
    longTerm: string;
  };
}

// ==========================================
// FUNCIONES AUXILIARES DE SIGNOS
// ==========================================

export function getSignElement(sign: string): ElementType {
  const elements: Record<string, ElementType> = {
    'Aries': 'fire', 'Leo': 'fire', 'Sagitario': 'fire',
    'Tauro': 'earth', 'Virgo': 'earth', 'Capricornio': 'earth',
    'Géminis': 'air', 'Libra': 'air', 'Acuario': 'air',
    'Cáncer': 'water', 'Escorpio': 'water', 'Piscis': 'water'
  };
  return elements[sign] || 'fire';
}

export function getSignMode(sign: string): ModeType {
  const modes: Record<string, ModeType> = {
    'Aries': 'cardinal', 'Cáncer': 'cardinal', 'Libra': 'cardinal', 'Capricornio': 'cardinal',
    'Tauro': 'fixed', 'Leo': 'fixed', 'Escorpio': 'fixed', 'Acuario': 'fixed',
    'Géminis': 'mutable', 'Virgo': 'mutable', 'Sagitario': 'mutable', 'Piscis': 'mutable'
  };
  return modes[sign] || 'cardinal';
}

// 🔥 NUEVAS FUNCIONES AUXILIARES
export function getPlanetaryRuler(sign: string): string {
  const rulers: Record<string, string> = {
    'Aries': 'Marte',
    'Tauro': 'Venus', 
    'Géminis': 'Mercurio',
    'Cáncer': 'Luna',
    'Leo': 'Sol',
    'Virgo': 'Mercurio',
    'Libra': 'Venus',
    'Escorpio': 'Plutón',
    'Sagitario': 'Júpiter',
    'Capricornio': 'Saturno',
    'Acuario': 'Urano',
    'Piscis': 'Neptuno'
  };
  return rulers[sign] || 'Sol';
}

export function getHouseTheme(house: number): string {
  const themes: Record<number, string> = {
    1: 'Identidad y autopresentación',
    2: 'Recursos y valores personales',
    3: 'Comunicación y hermanos',
    4: 'Hogar y familia',
    5: 'Creatividad y romance',
    6: 'Trabajo y salud',
    7: 'Relaciones y matrimonio',
    8: 'Transformación y recursos compartidos',
    9: 'Filosofía y estudios superiores',
    10: 'Carrera y reputación',
    11: 'Amistades y grupos',
    12: 'Espiritualidad y subconsciente'
  };
  return themes[house] || 'Área de vida';
}

// ==========================================
// TIPOS PARA AGENDA
// ==========================================

export interface AgendaData {
  userProfile: UserProfile;
  events: AstrologicalEvent[];
  executiveSummary?: ExecutiveSummary;
  statistics?: EventStatistics;
  metadata?: {
    generatedAt: string;
    version: string;
    dataQuality: {
      completeness: number;
      hasNatalChart: boolean;
      hasProgressedChart: boolean;
      hasAIInterpretations: boolean;
      hasDetailedPositions: boolean;
    };
  };
}

export interface ExecutiveSummary {
  monthlyHighlights: string[];
  quarterlyFocus: string[];
  yearlyThemes: string[];
  priorityActions: ActionPlan[];
  keyInsights?: string[];
  cosmicOverview?: string;
}

export interface EventStatistics {
  totalEvents: number;
  highPriorityEvents: number;
  interpretedEvents: number;
  eventsByType: Record<string, number>;
  eventsByMonth: Record<string, number>;
  aiInterpretationCoverage: number;
}

// ==========================================
// 🔥 FUNCIONES DE CONVERSIÓN DE DATOS
// ==========================================

export function convertProkeralaToDetailedChart(prokeralaData: any): DetailedNatalChart | null {
  try {
    const planets = prokeralaData?.planets;
    const houses = prokeralaData?.houses;
    
    if (!planets || !Array.isArray(planets)) {
      return null;
    }
    
    const detailedChart: Partial<DetailedNatalChart> = {
      aspectos: [] // Inicializar aspectos vacío
    };
    
    // Mapear planetas
    planets.forEach((planet: any) => {
      const planetName = planet.name?.toLowerCase();
      const sign = getSignNameFromId(planet.sign);
      
      if (sign) {
        const position: PlanetPosition = {
          sign,
          house: planet.house || 1,
          degree: planet.degree || 0,
          longitude: planet.full_degree || 0,
          retrograde: planet.retrograde || false,
          element: getSignElement(sign),
          mode: getSignMode(sign)
        };
        
        // Mapear a los nombres correctos
        switch (planetName) {
          case 'sun': case 'sol':
            detailedChart.sol = position;
            break;
          case 'moon': case 'luna':
            detailedChart.luna = position;
            break;
          case 'mercury': case 'mercurio':
            detailedChart.mercurio = position;
            break;
          case 'venus':
            detailedChart.venus = position;
            break;
          case 'mars': case 'marte':
            detailedChart.marte = position;
            break;
          case 'jupiter': case 'júpiter':
            detailedChart.jupiter = position;
            break;
          case 'saturn': case 'saturno':
            detailedChart.saturno = position;
            break;
          case 'uranus': case 'urano':
            detailedChart.urano = position;
            break;
          case 'neptune': case 'neptuno':
            detailedChart.neptuno = position;
            break;
          case 'pluto': case 'plutón':
            detailedChart.pluton = position;
            break;
        }
      }
    });
    
    // Calcular ascendente si hay datos de casas
    if (houses && Array.isArray(houses) && houses[0]) {
      const ascSign = getSignNameFromId(houses[0].sign);
      if (ascSign) {
        detailedChart.ascendente = {
          sign: ascSign,
          house: 1,
          degree: houses[0].degree || 0,
          longitude: houses[0].degree || 0,
          retrograde: false,
          element: getSignElement(ascSign),
          mode: getSignMode(ascSign)
        };
      }
    }
    
    return detailedChart as DetailedNatalChart;
  } catch (error) {
    console.error('Error convirtiendo datos Prokerala:', error);
    return null;
  }
}

function getSignNameFromId(signId: number): string | null {
  const signs: Record<number, string> = {
    1: 'Aries', 2: 'Tauro', 3: 'Géminis', 4: 'Cáncer',
    5: 'Leo', 6: 'Virgo', 7: 'Libra', 8: 'Escorpio',
    9: 'Sagitario', 10: 'Capricornio', 11: 'Acuario', 12: 'Piscis'
  };
  return signs[signId] || null;
}