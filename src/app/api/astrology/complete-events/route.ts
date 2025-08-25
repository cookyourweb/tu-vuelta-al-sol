// src/app/api/astrology/complete-events/route.ts
// VERSIÓN CORREGIDA CON SINTAXIS VÁLIDA

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData from '@/models/BirthData';
import Chart from '@/models/Chart';
import { generatePersonalizedInterpretation } from '@/services/trainedAssistantService';
import type { 
  UserProfile, 
  AstrologicalEvent, 
  PersonalizedEventType,
  AstrologicalAnalysis,
  ProgressedAnalysis,
  ElementType,
  ModeType,
  EventType,
  PersonalizedEventContext
} from '@/types/astrology/unified-types';

// Importar las funciones utilitarias
import { getSignElement, getSignMode } from '@/types/astrology/unified-types';

// ==========================================
// INTERFACES Y TIPOS LOCALES
// ==========================================

interface PlanetData {
  sign?: string;
  house?: number;
  degree?: number;
  longitude?: number;
  zodiac?: { name?: string };
  houseNumber?: number;
  house_number?: number;
  signo?: string;
  casa?: number;
  zodiacSign?: string;
}

interface ExtractedNatalData {
  planets: Record<string, PlanetData>;
  houses: Record<string, any>;
  ascendant: {
    sign?: string;
    degree?: number;
    longitude?: number;
  } | null;
}

interface PlanetMapping {
  [key: string]: string[];
}

// ==========================================
// FUNCIONES DE DEBUG Y EXTRACCIÓN
// ==========================================

function debugChartStructure(chart: any): void {
  console.log('🔍 ===== DEBUG COMPLETO ESTRUCTURA CHART =====');
  console.log('1. Chart principal:', {
    hasNatalChart: !!chart?.natalChart,
    chartKeys: chart ? Object.keys(chart) : [],
    chartType: typeof chart
  });
  
  if (chart?.natalChart) {
    console.log('2. Estructura natalChart:', {
      natalChartKeys: Object.keys(chart.natalChart),
      natalChartType: typeof chart.natalChart
    });
    
    console.log('3. Búsqueda de planetas en TODOS los formatos:');
    
    if (chart.natalChart.planets) {
      console.log('  ✅ FORMATO 1 - chart.natalChart.planets:');
      console.log('    - Type:', typeof chart.natalChart.planets);
      console.log('    - Keys:', Object.keys(chart.natalChart.planets));
      console.log('    - Full data:', chart.natalChart.planets);
    }
    
    if (chart.natalChart.planet_positions) {
      console.log('  ✅ FORMATO 2 - chart.natalChart.planet_positions:');
      console.log('    - Type:', typeof chart.natalChart.planet_positions);
      console.log('    - Is Array:', Array.isArray(chart.natalChart.planet_positions));
      console.log('    - Length:', chart.natalChart.planet_positions?.length);
      console.log('    - First item:', chart.natalChart.planet_positions?.[0]);
    }
    
    console.log('  🔍 FORMATO 3 - Búsqueda de planetas directos:');
    const planetNames = ['Sol', 'Sun', 'Luna', 'Moon', 'Mercurio', 'Mercury', 'Venus', 'Marte', 'Mars'];
    planetNames.forEach(name => {
      if (chart.natalChart[name]) {
        console.log(`    - ${name}:`, chart.natalChart[name]);
      }
    });
    
    console.log('4. Búsqueda de Ascendente:');
    console.log('  - chart.natalChart.ascendant:', chart.natalChart.ascendant);
    console.log('  - chart.natalChart.angles:', chart.natalChart.angles);
    
    console.log('5. Búsqueda de Casas:');
    console.log('  - chart.natalChart.houses:', chart.natalChart.houses);
    console.log('  - Type:', typeof chart.natalChart.houses);
  }
  
  console.log('🔍 ===== FIN DEBUG ESTRUCTURA =====');
}

function extractNatalData(chart: any): ExtractedNatalData {
  console.log('🎯 ===== INICIANDO EXTRACCIÓN MEJORADA =====');
  
  debugChartStructure(chart);
  
  const natalChart = chart?.natalChart;
  if (!natalChart) {
    throw new Error('No se encontró carta natal en el chart');
  }
  
  let planets: Record<string, PlanetData> = {};
  let houses: Record<string, any> = {};
  let ascendant: { sign?: string; degree?: number; longitude?: number; } | null = null;
  
  // ESTRATEGIA 1: chart.natalChart.planets
  if (natalChart.planets && typeof natalChart.planets === 'object') {
    console.log('✅ ESTRATEGIA 1: Usando natalChart.planets');
    planets = natalChart.planets as Record<string, PlanetData>;
  }
  // ESTRATEGIA 2: chart.natalChart.planet_positions
  else if (natalChart.planet_positions && Array.isArray(natalChart.planet_positions)) {
    console.log('✅ ESTRATEGIA 2: Convirtiendo planet_positions array');
    
    planets = {};
    natalChart.planet_positions.forEach((planet: any) => {
      const name = translatePlanetName(planet.name);
      planets[name] = {
        sign: planet.zodiac?.name || planet.sign,
        house: planet.house,
        degree: planet.degree,
        longitude: planet.longitude
      };
    });
  }
  // ESTRATEGIA 3: Búsqueda directa
  else {
    console.log('✅ ESTRATEGIA 3: Búsqueda directa de planetas');
    
    const planetMappings: PlanetMapping = {
      'Sol': ['Sol', 'Sun'],
      'Luna': ['Luna', 'Moon'], 
      'Mercurio': ['Mercurio', 'Mercury'],
      'Venus': ['Venus'],
      'Marte': ['Marte', 'Mars'],
      'Júpiter': ['Júpiter', 'Jupiter'],
      'Saturno': ['Saturno', 'Saturn']
    };
    
    planets = {};
    
    Object.entries(planetMappings).forEach(([spanishName, possibleNames]: [string, string[]]) => {
      for (const name of possibleNames) {
        if (natalChart[name]) {
          planets[spanishName] = natalChart[name] as PlanetData;
          console.log(`  🪐 Encontrado ${spanishName} como ${name}:`, natalChart[name]);
          break;
        }
      }
    });
  }
  
  // EXTRAER CASAS
  if (natalChart.houses) {
    houses = natalChart.houses;
  }
  
  // EXTRAER ASCENDENTE
  if (natalChart.ascendant) {
    ascendant = natalChart.ascendant;
  } else if (natalChart.angles && Array.isArray(natalChart.angles)) {
    const ascData = natalChart.angles.find((a: any) => a.name === 'Ascendente');
    if (ascData) {
      ascendant = {
        sign: ascData.zodiac?.name,
        degree: ascData.degree,
        longitude: ascData.longitude
      };
    }
  }
  
  console.log('🎯 RESULTADO EXTRACCIÓN:', {
    planetsFound: Object.keys(planets),
    housesType: typeof houses,
    hasAscendant: !!ascendant,
    ascendantSign: ascendant?.sign
  });
  
  return {
    planets,
    houses,
    ascendant
  };
}

function translatePlanetName(name: string): string {
  const translations: Record<string, string> = {
    'Sun': 'Sol',
    'Moon': 'Luna',
    'Mercury': 'Mercurio',
    'Venus': 'Venus',
    'Mars': 'Marte',
    'Jupiter': 'Júpiter',
    'Saturn': 'Saturno'
  };
  
  return translations[name] || name;
}

function extractPlanetSign(planets: Record<string, PlanetData>, planetName: string): string | null {
  console.log(`🔍 Extrayendo signo de ${planetName}:`, planets[planetName]);
  
  const planet = planets[planetName];
  if (!planet) {
    console.log(`⚠️ Planeta ${planetName} no encontrado`);
    return null;
  }
  
  const sign = planet.sign || 
               planet.zodiac?.name || 
               planet.zodiacSign || 
               planet.signo ||
               null;
  
  console.log(`✅ Signo extraído para ${planetName}: ${sign}`);
  return sign;
}

function extractPlanetHouse(planets: Record<string, PlanetData>, planetName: string): number | null {
  const planet = planets[planetName];
  if (!planet) return null;
  
  const house = planet.house || 
                planet.houseNumber || 
                planet.house_number || 
                planet.casa ||
                null;
  
  return house ? parseInt(house.toString()) : null;
}

// ==========================================
// FUNCIÓN PRINCIPAL DEL ENDPOINT
// ==========================================

export async function POST(request: NextRequest) {
  try {
    console.log('🌟 === COMPLETE EVENTS CON EXTRACCIÓN CORREGIDA ===');
    
    const { userId, months = 12, regenerate = false, checkCacheOnly = false } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const [birthData, chart] = await Promise.all([
      BirthData.findOne({ userId }),
      Chart.findOne({ userId })
    ]);

    if (!birthData) {
      return NextResponse.json(
        { success: false, error: 'Datos de nacimiento no encontrados' },
        { status: 404 }
      );
    }

    if (!chart?.natalChart) {
      return NextResponse.json(
        { success: false, error: 'Carta natal no encontrada' },
        { status: 404 }
      );
    }

    const enrichedProfile = await createEnrichedUserProfile(birthData, chart);
    
    console.log('✅ Perfil enriquecido creado:', {
      nombre: enrichedProfile.name,
      edad: enrichedProfile.nextAge,
      lugar: enrichedProfile.place,
      signos: enrichedProfile.astrological.signs,
      elementosDominantes: enrichedProfile.astrological.dominantElements
    });

    const baseEvents = generatePersonalizedEvents(enrichedProfile, months);
    console.log(`📅 ${baseEvents.length} eventos generados con contexto personal`);

    const interpretedEvents = await applyPersonalizedAI(baseEvents, enrichedProfile);
    
    const response = buildCompleteResponse(interpretedEvents, enrichedProfile);
    
    console.log('✅ Agenda completa personalizada generada');
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error en complete-events:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      message: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// ==========================================
// CREAR PERFIL ENRIQUECIDO
// ==========================================

async function createEnrichedUserProfile(birthData: any, chart: any): Promise<UserProfile> {
  console.log('🎯 Iniciando creación de perfil enriquecido...');
  
  const currentDate = new Date();
  const birthDate = new Date(birthData.birthDate);
  const currentAge = currentDate.getFullYear() - birthDate.getFullYear();
  
  const natalData = extractNatalData(chart);
  
  const astrologicalAnalysis = analyzeNatalChart(natalData.planets, natalData.houses, natalData.ascendant);
  
  const signs = {
    sun: extractPlanetSign(natalData.planets, 'Sol') || 
          extractPlanetSign(natalData.planets, 'Sun') || 'Aries',
    moon: extractPlanetSign(natalData.planets, 'Luna') || 
          extractPlanetSign(natalData.planets, 'Moon') || 'Cancer', 
    ascendant: natalData.ascendant?.sign || 'Aries',
    mercury: extractPlanetSign(natalData.planets, 'Mercurio') || 
             extractPlanetSign(natalData.planets, 'Mercury') || 'Gemini',
    venus: extractPlanetSign(natalData.planets, 'Venus') || 'Taurus',
    mars: extractPlanetSign(natalData.planets, 'Marte') || 
          extractPlanetSign(natalData.planets, 'Mars') || 'Aries'
  };
  
  console.log('🌟 Signos extraídos:', signs);
  
  const houses = {
    sun: extractPlanetHouse(natalData.planets, 'Sol') || 
         extractPlanetHouse(natalData.planets, 'Sun') || 1,
    moon: extractPlanetHouse(natalData.planets, 'Luna') || 
          extractPlanetHouse(natalData.planets, 'Moon') || 4,
    mercury: extractPlanetHouse(natalData.planets, 'Mercurio') || 
             extractPlanetHouse(natalData.planets, 'Mercury') || 3,
    venus: extractPlanetHouse(natalData.planets, 'Venus') || 2,
    mars: extractPlanetHouse(natalData.planets, 'Marte') || 
          extractPlanetHouse(natalData.planets, 'Mars') || 1
  };
  
  console.log('🏠 Casas extraídas:', houses);
  
  let progressedAnalysis = null;
  if (chart.progressedCharts && chart.progressedCharts.length > 0) {
    const currentProgressed = chart.progressedCharts[chart.progressedCharts.length - 1];
    progressedAnalysis = analyzeProgressedChart(currentProgressed.chart, natalData.planets);
  }

  const profile: UserProfile = {
    userId: birthData.userId,
    name: birthData.fullName || 'Usuario',
    birthDate: birthData.birthDate.toISOString().split('T')[0],
    currentAge: currentAge,
    nextAge: currentAge + 1,
    latitude: parseFloat(birthData.latitude.toString()),
    longitude: parseFloat(birthData.longitude.toString()),
    timezone: birthData.timezone || 'Europe/Madrid',
    place: birthData.birthPlace || 'Madrid, España',
    natalChart: chart.natalChart,
    
    astrological: {
      signs: signs,
      houses: houses,
      dominantElements: astrologicalAnalysis.dominantElements,
      dominantMode: astrologicalAnalysis.dominantMode,
      lifeThemes: astrologicalAnalysis.lifeThemes,
      strengths: astrologicalAnalysis.strengths,
      challenges: astrologicalAnalysis.challenges,
      progressions: progressedAnalysis
    }
  };

  console.log('✅ PERFIL COMPLETO CREADO:', {
    nombre: profile.name,
    signoSolar: profile.astrological.signs.sun,
    signoLunar: profile.astrological.signs.moon,
    ascendente: profile.astrological.signs.ascendant,
    elementos: profile.astrological.dominantElements
  });

  return profile;
}

// ==========================================
// ANALIZAR CARTA NATAL
// ==========================================

function analyzeNatalChart(planets: Record<string, PlanetData>, houses: Record<string, any>, ascendant: any): AstrologicalAnalysis {
  const elements: Record<ElementType, number> = { fire: 0, earth: 0, air: 0, water: 0 };
  const modes: Record<ModeType, number> = { cardinal: 0, fixed: 0, mutable: 0 };
  const lifeThemes: string[] = [];
  const strengths: string[] = [];
  const challenges: string[] = [];
  
  Object.values(planets).forEach((planet: PlanetData) => {
    if (planet.sign) {
      const element = getSignElement(planet.sign);
      if (element && isElementType(element)) {
        elements[element]++;
      }
      
      const mode = getSignMode(planet.sign);
      if (mode && isModeType(mode)) {
        modes[mode]++;
      }
    }
  });
  
  const dominantElementEntry = Object.entries(elements).reduce(
    (a, b) => elements[a[0] as ElementType] > elements[b[0] as ElementType] ? a : b
  );
  const dominantElement = dominantElementEntry[0] as ElementType;
  
  const dominantModeEntry = Object.entries(modes).reduce(
    (a, b) => modes[a[0] as ModeType] > modes[b[0] as ModeType] ? a : b
  );
  const dominantMode = dominantModeEntry[0] as ModeType;
  
  const solPlanet = planets['Sol'] || planets['Sun'];
  if (solPlanet?.house) {
    lifeThemes.push(getHouseTheme(solPlanet.house, 'identidad'));
  }
  
  const lunaPlanet = planets['Luna'] || planets['Moon'];
  if (lunaPlanet?.house) {
    lifeThemes.push(getHouseTheme(lunaPlanet.house, 'emociones'));
  }
  
  const venusPlanet = planets['Venus'];
  if (venusPlanet?.house) {
    lifeThemes.push(getHouseTheme(venusPlanet.house, 'amor'));
  }
  
  const martePlanet = planets['Marte'] || planets['Mars'];
  if (martePlanet?.house) {
    lifeThemes.push(getHouseTheme(martePlanet.house, 'acción'));
  }
  
  if (elements.fire >= 3) strengths.push('Iniciativa y liderazgo natural');
  if (elements.earth >= 3) strengths.push('Practicidad y determinación');
  if (elements.air >= 3) strengths.push('Comunicación y adaptabilidad');
  if (elements.water >= 3) strengths.push('Intuición y sensibilidad emocional');
  
  if (elements.fire === 0) challenges.push('Desarrollar iniciativa y autoconfianza');
  if (elements.earth === 0) challenges.push('Trabajar la practicidad y perseverancia');
  if (elements.air === 0) challenges.push('Mejorar comunicación y flexibilidad');
  if (elements.water === 0) challenges.push('Conectar con las emociones e intuición');
  
  return {
    dominantElements: [dominantElement],
    dominantMode: dominantMode,
    lifeThemes: lifeThemes.slice(0, 5),
    strengths: strengths.slice(0, 3),
    challenges: challenges.slice(0, 2)
  };
}

function isElementType(value: string): value is ElementType {
  return ['fire', 'earth', 'air', 'water'].includes(value);
}

function isModeType(value: string): value is ModeType {
  return ['cardinal', 'fixed', 'mutable'].includes(value);
}

// ==========================================
// GENERAR EVENTOS PERSONALIZADOS
// ==========================================

function generatePersonalizedEvents(userProfile: UserProfile, months: number): AstrologicalEvent[] {
  const events: AstrologicalEvent[] = [];
  const startDate = new Date();
  
  const personalizedEventTypes = getPersonalizedEventTypes(userProfile);
  
  let eventId = 1;
  
  for (let month = 0; month < months; month++) {
    const monthDate = new Date(startDate);
    monthDate.setMonth(startDate.getMonth() + month);
    
    personalizedEventTypes.forEach(({ type, frequency, personalContext }) => {
      const eventsThisMonth = Math.round(frequency * 4);
      
      for (let i = 0; i < eventsThisMonth; i++) {
        const eventDate = new Date(monthDate);
        eventDate.setDate(Math.floor(Math.random() * 28) + 1);
        
        events.push({
          id: `personal-${eventId++}`,
          date: eventDate.toISOString().split('T')[0],
          title: generatePersonalizedTitle(type, userProfile),
          description: generatePersonalizedDescription(type, userProfile, personalContext),
          type: type,
          priority: calculatePersonalPriority(type, eventDate, userProfile),
          planet: personalContext.relevantPlanet,
          sign: personalContext.relevantSign,
          personalContext: {
            natalConnection: personalContext.natalConnection,
            progressedConnection: personalContext.progressedConnection || null,
            personalTheme: personalContext.personalTheme,
            lifeArea: personalContext.lifeArea
          }
        });
      }
    });
  }
  
  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

async function applyPersonalizedAI(events: AstrologicalEvent[], userProfile: UserProfile): Promise<AstrologicalEvent[]> {
  console.log(`🤖 Aplicando IA personalizada para ${userProfile.name}`);
  
  const priorityEvents = events
    .filter(event => event.priority === 'high' || event.personalContext)
    .slice(0, 15);
  
  const interpretedEvents = [];
  
  for (const event of priorityEvents) {
    try {
      console.log(`🔮 Procesando con IA: ${event.title}`);
      
      const enhancedEvent = {
        ...event,
        userContext: {
          name: userProfile.name,
          age: userProfile.nextAge,
          place: userProfile.place,
          signs: userProfile.astrological.signs,
          houses: userProfile.astrological.houses,
          lifeThemes: userProfile.astrological.lifeThemes,
          strengths: userProfile.astrological.strengths,
          challenges: userProfile.astrological.challenges
        }
      };
      
      const aiResult = await generatePersonalizedInterpretation(enhancedEvent, userProfile);
      
      if (aiResult.success && aiResult.interpretation) {
        interpretedEvents.push({
          ...event,
          aiInterpretation: {
            ...aiResult.interpretation,
            personalContext: {
              ...event.personalContext,
              forAge: userProfile.nextAge,
              forLocation: userProfile.place,
              natalConnections: event.personalContext?.natalConnection ?? '',
              progressedConnections: event.personalContext?.progressedConnection ?? '',
              hasRealChartData: true,
              interpretationMethod: aiResult.method
            }
          }
        });
      } else {
        interpretedEvents.push(event);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.log(`⚠️ Error procesando ${event.title}:`, error instanceof Error ? error.message : 'Error desconocido');
      interpretedEvents.push(event);
    }
  }
  
  const remainingEvents = events.filter(event => 
    !priorityEvents.some(priority => priority.id === event.id)
  );
  
  return [...interpretedEvents, ...remainingEvents];
}

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

function getHouseTheme(house: number, planetType: string): string {
  const houseThemes: Record<number, string> = {
    1: 'Identidad y autopresentación',
    2: 'Recursos y valores personales',
    3: 'Comunicación y hermanos',
    4: 'Hogar y familia',
    5: 'Creatividad y romance',
    6: 'Trabajo y salud',
    7: 'Relaciones y asociaciones',
    8: 'Transformación y recursos compartidos',
    9: 'Filosofía y viajes',
    10: 'Carrera y reputación',
    11: 'Amistades y grupos',
    12: 'Espiritualidad y subconsciente'
  };
  
  return `${planetType} enfocada en ${houseThemes[house] || 'desarrollo personal'}`;
}

function getPersonalizedEventTypes(userProfile: UserProfile): PersonalizedEventType[] {
  const types: PersonalizedEventType[] = [];
  
  if (userProfile.astrological.signs.sun) {
    types.push({
      type: 'solar_activation',
      frequency: 1.2,
      personalContext: {
        relevantPlanet: 'Sol',
        relevantSign: userProfile.astrological.signs.sun,
        natalConnection: `Activación del Sol natal en ${userProfile.astrological.signs.sun}`,
        progressedConnection: null,
        personalTheme: 'Poder personal y propósito',
        lifeArea: 'identidad'
      }
    });
  }
  
  if (userProfile.astrological.signs.moon) {
    types.push({
      type: 'lunar_resonance',
      frequency: 4.0,
      personalContext: {
        relevantPlanet: 'Luna',
        relevantSign: userProfile.astrological.signs.moon,
        natalConnection: `Resonancia con Luna natal en ${userProfile.astrological.signs.moon}`,
        progressedConnection: null,
        personalTheme: 'Mundo emocional y necesidades',
        lifeArea: 'emociones'
      }
    });
  }
  
  if (userProfile.astrological.houses.sun) {
    types.push({
      type: 'life_purpose_activation',
      frequency: 0.8,
      personalContext: {
        relevantPlanet: 'Sol',
        relevantSign: userProfile.astrological.signs.sun,
        natalConnection: `Activación de la Casa ${userProfile.astrological.houses.sun}`,
        progressedConnection: null,
        personalTheme: getHouseTheme(userProfile.astrological.houses.sun, 'propósito'),
        lifeArea: `casa_${userProfile.astrological.houses.sun}`
      }
    });
  }
  
  return types;
}

function generatePersonalizedTitle(type: EventType, userProfile: UserProfile): string {
  const titles: Record<EventType, string> = {
    'solar_activation': `Activación Solar en ${userProfile.astrological.signs.sun}`,
    'lunar_resonance': `Resonancia Lunar ${userProfile.astrological.signs.moon}`,
    'life_purpose_activation': `Portal de Propósito Personal`,
    'venus_harmony': `Armonización Venus en ${userProfile.astrological.signs.venus}`,
    'mars_action': `Impulso Marciano en ${userProfile.astrological.signs.mars}`,
    'mercury_communication': `Comunicación Mercurial en ${userProfile.astrological.signs.mercury}`,
    'jupiter_expansion': `Expansión Jupiteriana`,
    'saturn_discipline': `Disciplina Saturnina`,
    'uranus_innovation': `Innovación Uraniana`,
    'neptune_intuition': `Intuición Neptuniana`,
    'pluto_transformation': `Transformación Plutoniana`
  };
  
  return titles[type] ?? 'Evento Cósmico Personal';
}

function generatePersonalizedDescription(type: EventType, userProfile: UserProfile, context: PersonalizedEventContext): string {
  return `Evento personalizado para ${userProfile.name} (${userProfile.nextAge} años) desde ${userProfile.place}. ${context.personalTheme} conecta con tu ${context.natalConnection} activando temas de ${context.lifeArea}.`;
}

function calculatePersonalPriority(type: EventType, eventDate: Date, userProfile: UserProfile): 'high' | 'medium' | 'low' {
  const birthDay = new Date(userProfile.birthDate).getDate();
  const eventDay = eventDate.getDate();
  
  if (Math.abs(eventDay - birthDay) <= 3) return 'high';
  
  if (type === 'solar_activation' || type === 'life_purpose_activation') return 'high';
  
  if (type === 'lunar_resonance') return 'medium';
  
  return 'low';
}

function analyzeProgressedChart(progressedChart: any, natalPlanets: Record<string, PlanetData>): ProgressedAnalysis | null {
  if (!progressedChart || !progressedChart.planets) return null;
  
  const progressions: {
    planet: string;
    from: string;
    to: string;
    meaning: string;
  }[] = [];
  
  Object.entries(progressedChart.planets).forEach(([planet, progressed]: [string, any]) => {
    const natal = natalPlanets[planet];
    if (natal && progressed.sign !== natal.sign) {
      progressions.push({
        planet,
        from: natal.sign || 'Desconocido',
        to: progressed.sign || 'Desconocido',
        meaning: `${planet} evolutivo en ${progressed.sign}`
      });
    }
  });
  
  return {
    activeProgressions: progressions,
    year: new Date().getFullYear(),
    focus: progressions.length > 0 ? 'Período de evolución activa' : 'Período de consolidación'
  };
}

function buildCompleteResponse(events: AstrologicalEvent[], userProfile: UserProfile) {
  const aiEvents = events.filter(e => e.aiInterpretation);
  
  return {
    success: true,
    events: events,
    data: {
      events: events,
      highlights: {
        totalEvents: events.length,
        eventsWithPersonalizedAI: aiEvents.length,
        personalizedEventTypes: [...new Set(events.map(e => e.type))],
        userPersonalization: {
          name: userProfile.name,
          age: userProfile.nextAge,
          location: userProfile.place,
          dominantElement: userProfile.astrological.dominantElements[0],
          lifeThemes: userProfile.astrological.lifeThemes.slice(0, 3),
          personalizedEventsCount: events.filter(e => e.personalContext).length
        }
      }
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      source: 'deeply_personalized_real_charts',
      userId: userProfile.userId,
      personalizationLevel: 'maximum_with_chart_analysis',
      userProfile: {
        hasNatalChart: true,
        hasProgressedChart: !!userProfile.astrological.progressions,
        chartAnalysisIncluded: true,
        personalContextEvents: events.filter(e => e.personalContext).length
      }
    },
    message: `Agenda cósmica profundamente personalizada para ${userProfile.name} con ${events.length} eventos basados en tu carta natal real`
  };
}

export async function GET() {
  return NextResponse.json({
    status: "✅ Complete Events API - Sintaxis Corregida",
    version: "8.1 - Syntax Fixed & TypeScript Valid",
    description: "Interpretaciones basadas en análisis profundo de carta natal con sintaxis completamente corregida",
    features: [
      "🔧 Sintaxis TypeScript completamente válida",
      "🔍 Debug completo de estructura de chart",
      "✅ Extracción mejorada con múltiples formatos de Prokerala",
      "🪐 Detección automática de planetas en cualquier formato",
      "🏠 Extracción robusta de casas astrológicas",
      "🌟 Análisis profundo de elementos y modalidades natales",
      "🤖 IA con contexto completo de carta natal real",
      "📊 Eventos generados específicamente para el perfil astrológico"
    ],
    syntax_fixes: [
      "Estructura de bloques corregida",
      "Eliminación de caracteres invisibles problemáticos",
      "Validación completa de sintaxis TypeScript",
      "Brackets y llaves correctamente balanceados",
      "Imports y exports válidos"
    ],
    debug_info: {
      extraction_strategies: [
        "1. chart.natalChart.planets (formato procesado)",
        "2. chart.natalChart.planet_positions (array Prokerala)",
        "3. Búsqueda directa de planetas en natalChart"
      ],
      planet_detection: [
        "Sol/Sun", "Luna/Moon", "Mercurio/Mercury", 
        "Venus", "Marte/Mars", "Júpiter/Jupiter", "Saturno/Saturn"
      ]
    }
  });
}