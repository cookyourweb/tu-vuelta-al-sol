// src/utils/astrology/extractAstroProfile.ts
// 🌟 EXTRACTOR DE PERFIL ASTROLÓGICO COMPLETO
// Estrategia: UNA LLAMADA IA POR USUARIO/AÑO + FALLBACKS INTELIGENTES

import type { UserProfile, ElementType, ModeType } from '@/types/astrology/unified-types';

// ==========================================
// INTERFACES PARA EXTRACCIÓN
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
  name?: string;
}

interface ExtractorInput {
  natal: any;
  progressed?: any;
  nombre?: string;
  birthDate: string;
  place: string;
}

interface AstroProfileOutput extends UserProfile {
  // Perfil enriquecido específico para IA
  personalityCore: {
    solarTheme: string;
    lunarNeed: string;
    ascendantMask: string;
    dominantElement: string;
    dominantMode: string;
  };
  lifePatterns: {
    strength: string[];
    challenge: string[];
    growth: string[];
    purpose: string[];
  };
  interpretationContext: {
    natalStrengths: string[];
    evolutiveThemes: string[];
    currentFocus: string;
    yearlyThemes: string[];
  };
}

// ==========================================
// MAPEOS Y TRADUCCIONES
// ==========================================

const PLANET_TRANSLATIONS: Record<string, string[]> = {
  'Sol': ['Sol', 'Sun', 'sun', 'SUN', '0'],
  'Luna': ['Luna', 'Moon', 'moon', 'MOON', '1'],
  'Mercurio': ['Mercurio', 'Mercury', 'mercury', 'MERCURY', '2'],
  'Venus': ['Venus', 'venus', 'VENUS', '3'],
  'Marte': ['Marte', 'Mars', 'mars', 'MARS', '4'],
  'Júpiter': ['Júpiter', 'Jupiter', 'jupiter', 'JUPITER', '5'],
  'Saturno': ['Saturno', 'Saturn', 'saturn', 'SATURN', '6'],
  'Urano': ['Urano', 'Uranus', 'uranus', 'URANUS', '7'],
  'Neptuno': ['Neptuno', 'Neptune', 'neptune', 'NEPTUNE', '8'],
  'Plutón': ['Plutón', 'Pluto', 'pluto', 'PLUTO', '9']
};

const SIGN_THEMES: Record<string, {
  element: 'fire' | 'earth' | 'air' | 'water';
  mode: 'cardinal' | 'fixed' | 'mutable';
  theme: string;
  strength: string;
  challenge: string;
}> = {
  'Aries': { element: 'fire', mode: 'cardinal', theme: 'Iniciativa y liderazgo', strength: 'Pionero valiente', challenge: 'Impaciencia' },
  'Tauro': { element: 'earth', mode: 'fixed', theme: 'Estabilidad y recursos', strength: 'Persistencia práctica', challenge: 'Rigidez' },
  'Géminis': { element: 'air', mode: 'mutable', theme: 'Comunicación y versatilidad', strength: 'Adaptabilidad mental', challenge: 'Dispersión' },
  'Cáncer': { element: 'water', mode: 'cardinal', theme: 'Hogar y emociones', strength: 'Intuición protectora', challenge: 'Hipersensibilidad' },
  'Leo': { element: 'fire', mode: 'fixed', theme: 'Creatividad y brillo', strength: 'Expresión creativa', challenge: 'Ego inflado' },
  'Virgo': { element: 'earth', mode: 'mutable', theme: 'Servicio y perfección', strength: 'Análisis detallado', challenge: 'Autocrítica excesiva' },
  'Libra': { element: 'air', mode: 'cardinal', theme: 'Armonía y relaciones', strength: 'Diplomacia natural', challenge: 'Indecisión' },
  'Escorpio': { element: 'water', mode: 'fixed', theme: 'Transformación profunda', strength: 'Poder regenerativo', challenge: 'Control obsesivo' },
  'Sagitario': { element: 'fire', mode: 'mutable', theme: 'Expansión y sabiduría', strength: 'Visión amplia', challenge: 'Falta de enfoque' },
  'Capricornio': { element: 'earth', mode: 'cardinal', theme: 'Estructura y logro', strength: 'Ambición disciplinada', challenge: 'Rigidez mental' },
  'Acuario': { element: 'air', mode: 'fixed', theme: 'Innovación y humanidad', strength: 'Visión futurista', challenge: 'Desapego emocional' },
  'Piscis': { element: 'water', mode: 'mutable', theme: 'Compasión y trascendencia', strength: 'Sensibilidad espiritual', challenge: 'Escapismo' }
};

const HOUSE_THEMES: Record<number, {
  area: string;
  theme: string;
  focus: string;
}> = {
  1: { area: 'Identidad', theme: 'Yo Soy', focus: 'Autopresentación y imagen' },
  2: { area: 'Recursos', theme: 'Yo Tengo', focus: 'Valores y posesiones' },
  3: { area: 'Comunicación', theme: 'Yo Pienso', focus: 'Hermanos y entorno inmediato' },
  4: { area: 'Hogar', theme: 'Yo Siento', focus: 'Familia y raíces' },
  5: { area: 'Creatividad', theme: 'Yo Creo', focus: 'Hijos y romance' },
  6: { area: 'Trabajo', theme: 'Yo Sirvo', focus: 'Salud y rutina' },
  7: { area: 'Relaciones', theme: 'Nosotros Somos', focus: 'Matrimonio y socios' },
  8: { area: 'Transformación', theme: 'Nosotros Tenemos', focus: 'Recursos compartidos y muerte' },
  9: { area: 'Filosofía', theme: 'Nosotros Pensamos', focus: 'Viajes y estudios superiores' },
  10: { area: 'Carrera', theme: 'Nosotros Sentimos', focus: 'Reputación y status' },
  11: { area: 'Grupos', theme: 'Nosotros Creamos', focus: 'Amistades y objetivos' },
  12: { area: 'Espiritualidad', theme: 'Nosotros Servimos', focus: 'Subconsciente y sacrificio' }
};

// ==========================================
// FUNCIÓN PRINCIPAL DE EXTRACCIÓN
// ==========================================

export default function extractAstroProfile(input: ExtractorInput): AstroProfileOutput {
  console.log('🎯 === EXTRACTOR DE PERFIL ASTROLÓGICO INICIADO ===');
  console.log('Input recibido:', {
    hasNatal: !!input.natal,
    hasProgressed: !!input.progressed,
    nombre: input.nombre,
    place: input.place
  });

  // 1. EXTRAER PLANETAS CON MÚLTIPLES ESTRATEGIAS
  const extractedPlanets = extractPlanetsFromChart(input.natal);
  console.log('🪐 Planetas extraídos:', Object.keys(extractedPlanets));

  // 2. EXTRAER CASAS
  const extractedHouses = extractHousesFromChart(input.natal);
  console.log('🏠 Casas extraídas:', extractedHouses);

  // 3. EXTRAER ASCENDENTE
  const extractedAscendant = extractAscendantFromChart(input.natal);
  console.log('⬆️ Ascendente extraído:', extractedAscendant);

  // 4. CALCULAR ANÁLISIS ASTROLÓGICO
  const astroAnalysis = calculateAstrologicalAnalysis(extractedPlanets, extractedHouses, extractedAscendant);
  console.log('📊 Análisis calculado:', astroAnalysis);

  // 5. CREAR PERFIL BASE
  const currentDate = new Date();
  const birthDate = new Date(input.birthDate);
  const currentAge = currentDate.getFullYear() - birthDate.getFullYear();

  const baseProfile: UserProfile = {
    userId: '', // Asignar el userId aquí, por ejemplo: input.userId || ''
    name: input.nombre || 'Usuario',
    birthDate: input.birthDate,
    currentAge,
    nextAge: currentAge + 1,
    place: input.place,
    latitude: 0, // Se completa desde el caller
    longitude: 0, // Se completa desde el caller
    timezone: 'Europe/Madrid',
    
    astrological: {
      signs: astroAnalysis.signs,
      houses: astroAnalysis.houses,
      dominantElements: astroAnalysis.dominantElements as ElementType[],
      dominantMode: astroAnalysis.dominantMode as ModeType,
      lifeThemes: astroAnalysis.lifeThemes,
      strengths: astroAnalysis.strengths,
      challenges: astroAnalysis.challenges
    }
  };

  // 6. ENRIQUECER PERFIL PARA IA
  const enrichedProfile: AstroProfileOutput = {
    ...baseProfile,
    
    personalityCore: {
      solarTheme: generateSolarTheme(astroAnalysis.signs.sun, astroAnalysis.houses.sun),
      lunarNeed: generateLunarNeed(astroAnalysis.signs.moon, astroAnalysis.houses.moon),
      ascendantMask: generateAscendantMask(astroAnalysis.signs.ascendant),
      dominantElement: astroAnalysis.dominantElements[0] as ElementType,
      dominantMode: astroAnalysis.dominantMode
    },

    lifePatterns: {
      strength: astroAnalysis.strengths,
      challenge: astroAnalysis.challenges,
      growth: generateGrowthPatterns(astroAnalysis),
      purpose: generatePurposePatterns(astroAnalysis)
    },

    interpretationContext: {
      natalStrengths: astroAnalysis.natalStrengths,
      evolutiveThemes: astroAnalysis.evolutiveThemes,
      currentFocus: generateCurrentFocus(currentAge, astroAnalysis),
      yearlyThemes: generateYearlyThemes(currentAge, astroAnalysis)
    }
  };

  console.log('✅ PERFIL ENRIQUECIDO COMPLETADO');
  return enrichedProfile;
}

// ==========================================
// FUNCIONES DE EXTRACCIÓN DE DATOS
// ==========================================

function extractPlanetsFromChart(natalChart: any): Record<string, PlanetData> {
  console.log('🔍 EXTRAYENDO PLANETAS - Múltiples estrategias');
  
  const planets: Record<string, PlanetData> = {};
  
  // ESTRATEGIA 1: natalChart.planets (formato estándar)
  if (natalChart?.planets && typeof natalChart.planets === 'object') {
    console.log('✅ Estrategia 1: natalChart.planets');
    
    // Si es array (formato Prokerala)
    if (Array.isArray(natalChart.planets)) {
      natalChart.planets.forEach((planet: any, index: number) => {
        const normalizedName = normalizePlanetName(planet.name || index.toString());
        if (normalizedName) {
          planets[normalizedName] = {
            sign: planet.zodiac?.name || planet.sign || planet.signo,
            house: planet.house || planet.casa || planet.houseNumber,
            degree: planet.degree,
            longitude: planet.longitude || planet.full_degree
          };
        }
      });
    } 
    // Si es objeto con claves
    else {
      Object.entries(natalChart.planets).forEach(([key, planetData]: [string, any]) => {
        const normalizedName = normalizePlanetName(key);
        if (normalizedName && planetData) {
          planets[normalizedName] = {
            sign: planetData.zodiac?.name || planetData.sign || planetData.signo,
            house: planetData.house || planetData.casa || planetData.houseNumber,
            degree: planetData.degree,
            longitude: planetData.longitude || planetData.full_degree
          };
        }
      });
    }
  }

  // ESTRATEGIA 2: planet_positions array
  if (natalChart?.planet_positions && Array.isArray(natalChart.planet_positions)) {
    console.log('✅ Estrategia 2: planet_positions array');
    
    natalChart.planet_positions.forEach((planet: any) => {
      const normalizedName = normalizePlanetName(planet.name);
      if (normalizedName) {
        planets[normalizedName] = {
          sign: planet.zodiac?.name || planet.sign,
          house: planet.house,
          degree: planet.degree,
          longitude: planet.longitude || planet.full_degree
        };
      }
    });
  }

  // ESTRATEGIA 3: Búsqueda directa por nombres conocidos
  if (Object.keys(planets).length === 0) {
    console.log('✅ Estrategia 3: Búsqueda directa');
    
    Object.entries(PLANET_TRANSLATIONS).forEach(([spanishName, possibleNames]) => {
      for (const possibleName of possibleNames) {
        if (natalChart?.[possibleName]) {
          planets[spanishName] = natalChart[possibleName];
          break;
        }
      }
    });
  }

  console.log(`🪐 PLANETAS EXTRAÍDOS: ${Object.keys(planets).join(', ')}`);
  return planets;
}

function extractHousesFromChart(natalChart: any): Record<string, number> {
  const houses: Record<string, number> = {};
  
  if (natalChart?.houses) {
    // Intentar extraer casas de planetas
    const planets = extractPlanetsFromChart(natalChart);
    
    Object.entries(planets).forEach(([planet, data]) => {
      if (data.house) {
        houses[planet.toLowerCase()] = data.house;
      }
    });
  }

  return houses;
}

function extractAscendantFromChart(natalChart: any): { sign?: string; degree?: number } | null {
  // Múltiples ubicaciones posibles del ascendente
  const ascendantSources = [
    natalChart?.ascendant,
    natalChart?.angles?.ascendant,
    natalChart?.houses?.[0], // Casa 1
    natalChart?.asc
  ];

  for (const source of ascendantSources) {
    if (source?.sign || source?.zodiac?.name) {
      return {
        sign: source.sign || source.zodiac?.name,
        degree: source.degree
      };
    }
  }

  return null;
}

// ==========================================
// FUNCIONES DE ANÁLISIS
// ==========================================

function calculateAstrologicalAnalysis(planets: Record<string, PlanetData>, houses: Record<string, number>, ascendant: any) {
  const elements: Record<string, number> = { fire: 0, earth: 0, air: 0, water: 0 };
  const modes: Record<string, number> = { cardinal: 0, fixed: 0, mutable: 0 };
  
  const signs = {
    sun: extractSignFromPlanet(planets, 'Sol') || 'Aries',
    moon: extractSignFromPlanet(planets, 'Luna') || 'Cáncer',
    ascendant: ascendant?.sign || 'Aries',
    mercury: extractSignFromPlanet(planets, 'Mercurio') || 'Géminis',
    venus: extractSignFromPlanet(planets, 'Venus') || 'Tauro',
    mars: extractSignFromPlanet(planets, 'Marte') || 'Aries'
  };

  const planetHouses = {
    sun: houses.sol || houses.sun || 1,
    moon: houses.luna || houses.moon || 4,
    mercury: houses.mercurio || houses.mercury || 3,
    venus: houses.venus || 2,
    mars: houses.marte || houses.mars || 1
  };

  // Contar elementos y modalidades
  Object.values(signs).forEach(sign => {
    const signData = SIGN_THEMES[sign];
    if (signData) {
      elements[signData.element]++;
      modes[signData.mode]++;
    }
  });

  const dominantElement = Object.entries(elements).reduce((a, b) => elements[a[0]] > elements[b[0]] ? a : b)[0];
  const dominantMode = Object.entries(modes).reduce((a, b) => modes[a[0]] > modes[b[0]] ? a : b)[0];

  return {
    signs,
    houses: planetHouses,
    dominantElements: [dominantElement],
    dominantMode,
    lifeThemes: generateLifeThemes(signs, planetHouses),
    strengths: generateStrengths(signs, elements),
    challenges: generateChallenges(signs, elements),
    natalStrengths: generateNatalStrengths(signs, planetHouses),
    evolutiveThemes: generateEvolutiveThemes(signs, planetHouses)
  };
}

// ==========================================
// FUNCIONES DE GENERACIÓN DE TEMAS
// ==========================================

function generateSolarTheme(sunSign: string, sunHouse: number): string {
  const signTheme = SIGN_THEMES[sunSign]?.theme || 'Autoexpresión';
  const houseTheme = HOUSE_THEMES[sunHouse]?.focus || 'desarrollo personal';
  return `${signTheme} expresado a través de ${houseTheme}`;
}

function generateLunarNeed(moonSign: string, moonHouse: number): string {
  const signTheme = SIGN_THEMES[moonSign]?.theme || 'Seguridad emocional';
  const houseArea = HOUSE_THEMES[moonHouse]?.area || 'vida interior';
  return `Necesidad de ${signTheme.toLowerCase()} en el área de ${houseArea.toLowerCase()}`;
}

function generateAscendantMask(ascSign: string): string {
  const signTheme = SIGN_THEMES[ascSign]?.strength || 'Personalidad auténtica';
  return `Máscara social: ${signTheme}`;
}

function generateLifeThemes(signs: any, houses: any): string[] {
  const themes = [];
  
  // Tema solar (propósito)
  const sunHouseTheme = HOUSE_THEMES[houses.sun]?.theme;
  if (sunHouseTheme) themes.push(`Propósito: ${sunHouseTheme}`);
  
  // Tema lunar (necesidades)
  const moonHouseTheme = HOUSE_THEMES[houses.moon]?.theme;
  if (moonHouseTheme) themes.push(`Necesidades: ${moonHouseTheme}`);
  
  // Temas por casa ocupada
  Object.entries(houses).forEach(([planet, house]) => {
    const houseData = HOUSE_THEMES[house as number];
    if (houseData && themes.length < 5) {
      themes.push(`${planet}: ${houseData.area}`);
    }
  });

  return themes.slice(0, 5);
}

function generateStrengths(signs: any, elements: Record<string, number>): string[] {
  const strengths = [];
  
  // Fortalezas por elemento dominante
  if (elements.fire >= 3) strengths.push('Iniciativa y liderazgo natural');
  if (elements.earth >= 3) strengths.push('Practicidad y determinación');
  if (elements.air >= 3) strengths.push('Comunicación y adaptabilidad');
  if (elements.water >= 3) strengths.push('Intuición y sensibilidad');
  
  // Fortalezas específicas por signo solar
  const solarStrength = SIGN_THEMES[signs.sun]?.strength;
  if (solarStrength && !strengths.includes(solarStrength)) {
    strengths.push(solarStrength);
  }

  return strengths.slice(0, 3);
}

function generateChallenges(signs: any, elements: Record<string, number>): string[] {
  const challenges = [];
  
  // Desafíos por elemento faltante
  if (elements.fire === 0) challenges.push('Desarrollar iniciativa y autoconfianza');
  if (elements.earth === 0) challenges.push('Trabajar la practicidad y perseverancia');
  if (elements.air === 0) challenges.push('Mejorar comunicación y flexibilidad');
  if (elements.water === 0) challenges.push('Conectar con emociones e intuición');
  
  // Desafío específico por signo solar
  const solarChallenge = SIGN_THEMES[signs.sun]?.challenge;
  if (solarChallenge && !challenges.some(c => c.includes(solarChallenge))) {
    challenges.push(`Superar tendencia a ${solarChallenge.toLowerCase()}`);
  }

  return challenges.slice(0, 2);
}

function generateGrowthPatterns(analysis: any): string[] {
  return [
    `Integración de ${analysis.dominantElements[0]} con otros elementos`,
    `Equilibrar ${analysis.dominantMode} con flexibilidad`,
    `Armonizar Sol en ${analysis.signs.sun} con Luna en ${analysis.signs.moon}`
  ];
}

function generatePurposePatterns(analysis: any): string[] {
  const sunHouse = HOUSE_THEMES[analysis.houses.sun];
  return [
    `Misión principal: ${sunHouse?.theme || 'Autoconocimiento'}`,
    `Servicio: ${SIGN_THEMES[analysis.signs.sun]?.theme || 'Expresión auténtica'}`,
    `Legado: Integración de talentos naturales`
  ];
}

function generateNatalStrengths(signs: any, houses: any): string[] {
  return [
    `Sol en ${signs.sun} - Casa ${houses.sun}`,
    `Luna en ${signs.moon} - Casa ${houses.moon}`,
    `Ascendente en ${signs.ascendant}`
  ];
}

function generateEvolutiveThemes(signs: any, houses: any): string[] {
  const currentYear = new Date().getFullYear();
  return [
    `${currentYear}: Integración ${signs.sun}-${signs.moon}`,
    'Desarrollo del potencial creativo',
    'Equilibrio entre ser y hacer'
  ];
}

function generateCurrentFocus(age: number, analysis: any): string {
  const cycles = {
    '20-29': 'Establecimiento de identidad',
    '30-39': 'Construcción de bases sólidas',
    '40-49': 'Realización del propósito',
    '50-59': 'Sabiduría y mentoría',
    '60+': 'Trascendencia y legado'
  };
  
  const ageRange = age < 30 ? '20-29' : 
                   age < 40 ? '30-39' :
                   age < 50 ? '40-49' :
                   age < 60 ? '50-59' : '60+';
  
  return `${cycles[ageRange]} - Énfasis en ${analysis.dominantElements[0]}`;
}

function generateYearlyThemes(age: number, analysis: any): string[] {
  return [
    `Año ${age}: Desarrollo de ${SIGN_THEMES[analysis.signs.sun]?.theme}`,
    `Año ${age + 1}: Integración emocional ${SIGN_THEMES[analysis.signs.moon]?.theme}`,
    `Ciclo 2-3 años: Maestría en ${analysis.dominantElements[0]}`
  ];
}

function extractProgressedAnalysis(progressedChart: any): any {
  // Implementar análisis de progresiones secundarias
  return {
    activeProgressions: [],
    evolutiveFocus: 'Desarrollo actual',
    newThemes: []
  };
}

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

function normalizePlanetName(name: string | number): string | null {
  const nameStr = name.toString();
  
  for (const [spanishName, variants] of Object.entries(PLANET_TRANSLATIONS)) {
    if (variants.some(variant => 
      variant.toLowerCase() === nameStr.toLowerCase() || 
      variant === nameStr
    )) {
      return spanishName;
    }
  }
  
  return null;
}

function extractSignFromPlanet(planets: Record<string, PlanetData>, planetName: string): string | null {
  const planet = planets[planetName];
  return planet?.sign || planet?.zodiac?.name || planet?.zodiacSign || null;
}