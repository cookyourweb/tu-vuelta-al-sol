// src/services/educationalInterpretationService.ts
// 🎓 SISTEMA DE INTERPRETACIONES EDUCATIVAS MEJORADO - VERSIÓN COMPLETA

import { DetailedNatalChart, DetailedProgressedChart, UserProfile, PersonalizedInterpretation, ActionPlan } from '@/types/astrology/unified-types';

export interface EducationalInterpretation extends PersonalizedInterpretation {
  educational: {
    // 📚 Explicaciones de conceptos astrológicos
    conceptExplanations: {
      [key: string]: {
        simpleExplanation: string;
        deeperMeaning: string;
        historicalContext: string;
        modernPsychology: string;
      };
    };
    
    // 🎯 Por qué esta interpretación es específica para esta persona
    personalizationWhy: {
      natalFactors: string[];
      progressedFactors: string[];
      timeFactors: string[];
      locationFactors: string[];
    };
    
    // 🔗 Conexiones entre planetas, casas y signos
    astrologicalConnections: {
      planetaryInfluences: string[];
      houseActivations: string[];
      signEnergies: string[];
      aspectPatterns: string[];
    };
    
    // 📈 Evolución y crecimiento
    evolutionaryPerspective: {
      currentLevel: string;
      nextLevel: string;
      growthChallenges: string[];
      masteryIndicators: string[];
    };
    
    // 🧠 Psicología y patrones
    psychologicalInsights: {
      coreBehaviorPatterns: string[];
      emotionalTriggers: string[];
      motivationalDrivers: string[];
      defenseMechanisms: string[];
    };
  };
}

// 🎯 FUNCIÓN PRINCIPAL: INTERPRETACIÓN NATAL EDUCATIVA
export async function generateEducationalNatalInterpretation(
  natalChart: DetailedNatalChart,
  userProfile: UserProfile
): Promise<EducationalInterpretation> {
  
  // Obtener elementos fundamentales de la carta
  const sunSign = natalChart.sol.sign;
  const moonSign = natalChart.luna.sign;
  const ascendantSign = natalChart.ascendente?.sign || 'Aries';
  
  // 🔥 INTERPRETAR PERSONALIDAD CORE CON EDUCACIÓN
  const corePersonality = analyzePersonalityWithEducation(natalChart);
  
  // 🎓 CREAR EXPLICACIONES EDUCATIVAS
  const conceptExplanations = createConceptExplanations(natalChart);
  
  // 🎯 EXPLICAR POR QUÉ ES PERSONALIZADA
  const personalizationWhy = explainPersonalization(natalChart, userProfile);
  
  // 🔗 CONECTAR ELEMENTOS ASTROLÓGICOS
  const astrologicalConnections = analyzeConnections(natalChart);
  
  // 📈 PERSPECTIVA EVOLUTIVA
  const evolutionaryPerspective = analyzeEvolution(natalChart, userProfile);
  
  // 🧠 INSIGHTS PSICOLÓGICOS
  const psychologicalInsights = analyzePsychology(natalChart);

  return {
    meaning: corePersonality.meaning,
    lifeAreas: corePersonality.lifeAreas,
    advice: corePersonality.advice,
    mantra: corePersonality.mantra,
    ritual: corePersonality.ritual,
    actionPlan: corePersonality.actionPlan,
    warningsAndOpportunities: corePersonality.warningsAndOpportunities,
    
    educational: {
      conceptExplanations,
      personalizationWhy,
      astrologicalConnections,
      evolutionaryPerspective,
      psychologicalInsights
    }
  };
}

// 🔥 ANÁLISIS DE PERSONALIDAD CON CONTEXTO EDUCATIVO
function analyzePersonalityWithEducation(natalChart: DetailedNatalChart) {
  const sunSign = natalChart.sol.sign;
  const moonSign = natalChart.luna.sign;
  const ascendant = natalChart.ascendente?.sign || 'Aries';
  
  return {
    meaning: `Tu Sol en ${sunSign} representa tu ESENCIA VITAL - el núcleo de quién eres cuando estás siendo auténtico. Tu Luna en ${moonSign} revela tu MUNDO EMOCIONAL - cómo procesas sentimientos y qué necesitas para sentirte seguro. Tu Ascendente ${ascendant} es tu MÁSCARA SOCIAL - cómo te presenta el mundo y tu primera impresión.`,
    
    lifeAreas: [
      `Identidad y propósito (Sol en ${sunSign})`,
      `Vida emocional y seguridad (Luna en ${moonSign})`,
      `Imagen pública y primeras impresiones (Ascendente ${ascendant})`,
      'Relaciones y asociaciones',
      'Carrera y reconocimiento público'
    ],
    
    advice: `ESTRATEGIA PERSONALIZADA: Integra tu esencia ${sunSign} (lo que eres) con tus necesidades emocionales ${moonSign} (lo que sientes) y tu presentación ${ascendant} (cómo te ve el mundo). Esta trinidad es tu fórmula única de éxito.`,
    
    mantra: generatePersonalizedMantra(sunSign, moonSign, ascendant),
    
    ritual: `RITUAL DE INTEGRACIÓN TRIPLE: Cada mañana, conecta con tu Sol ${sunSign} (5 min de visualización de tu propósito), honra tu Luna ${moonSign} (5 min sintiendo tus emociones del día), y activa tu Ascendente ${ascendant} (5 min preparando tu energía para el mundo).`,
    
    actionPlan: createEducationalActionPlan(natalChart),
    
    warningsAndOpportunities: {
      warnings: [
        `⚠️ DESBALANCE: Si solo expresas tu ${sunSign} ignorando tu ${moonSign}, te sentirás vacío emocionalmente`,
        `⚠️ MÁSCARA EXCESIVA: Si solo muestras tu ${ascendant} sin tu autenticidad ${sunSign}, te sentirás falso`,
        `⚠️ SOLO EMOCIONES: Si solo vives desde tu ${moonSign} sin propósito ${sunSign}, te sentirás perdido`
      ],
      opportunities: [
        `🎯 INTEGRACIÓN PERFECTA: Cuando alineas Sol-Luna-Ascendente, te vuelves magnético e imparable`,
        `🎯 AUTENTICIDAD MAGNÉTICA: Tu combinación única ${sunSign}-${moonSign}-${ascendant} es tu superpoder`,
        `🎯 LIDERAZGO NATURAL: Esta configuración te da una presencia única que otros admiran`
      ]
    }
  };
}

// 🎓 CREAR EXPLICACIONES DE CONCEPTOS COMPLETAS
function createConceptExplanations(natalChart: DetailedNatalChart) {
  return {
    "Sol": {
      simpleExplanation: "Tu Sol representa tu identidad central, tu propósito de vida y tu energía vital básica.",
      deeperMeaning: "El Sol simboliza el héroe de tu historia personal. Es lo que viniste a expresar en esta vida, tu regalo único al mundo.",
      historicalContext: "En astrología tradicional, el Sol era considerado el 'corazón' del horóscopo, el planeta más importante para determinar la naturaleza esencial de una persona.",
      modernPsychology: "Psicológicamente, el Sol representa tu ego consciente, tu identidad central y tu voluntad de ser único e individual."
    },
    
    "Luna": {
      simpleExplanation: "Tu Luna gobierna tus emociones, instintos, necesidades de seguridad y patrones de respuesta automática.",
      deeperMeaning: "La Luna es tu niño interior, tu lado receptivo y nutritivo. Representa cómo procesas la vida emocionalmente y qué necesitas para sentirte 'en casa'.",
      historicalContext: "Tradicionalmente, la Luna representaba la madre, la fertilidad, los ciclos naturales y el mundo de los sentimientos y la intuición.",
      modernPsychology: "La Luna corresponde a tu mente subconsciente, patrones emocionales heredados, y tus mecanismos de supervivencia emocional."
    },
    
    "Ascendente": {
      simpleExplanation: "Tu Ascendente es tu 'máscara social' - cómo te presentas al mundo y cómo otros te perciben inicialmente.",
      deeperMeaning: "El Ascendente es tu vehículo de expresión en el mundo físico. Es la energía que irradias y cómo abordas nuevas situaciones.",
      historicalContext: "En astrología clásica, el Ascendente era llamado 'Horoscopus' - el punto que 'observa la hora' del nacimiento, considerado crucial para el destino.",
      modernPsychology: "Representa tu persona (máscara de Jung), tu estilo de aproximación a la vida y tu primera línea de defensa psicológica."
    },
    
    "Casas": {
      simpleExplanation: "Las 12 casas representan las diferentes áreas de experiencia de vida donde se manifiestan las energías planetarias.",
      deeperMeaning: "Las casas son los 'escenarios' donde actúan tus planetas. Cada casa tiene temas específicos que van desde lo personal hasta lo transpersonal.",
      historicalContext: "El sistema de casas deriva de la rotación diaria de la Tierra, dividiendo el cielo en 12 sectores basados en tu ubicación exacta de nacimiento.",
      modernPsychology: "Las casas representan los diferentes aspectos del desarrollo psicológico, desde las necesidades básicas hasta la autorrealización."
    },
    
    "Aspectos": {
      simpleExplanation: "Los aspectos son los 'ángulos de conversación' entre planetas - cómo se comunican e influencian entre sí.",
      deeperMeaning: "Los aspectos crean la dinámica interna de tu personalidad. Son las tensiones, apoyos y oportunidades entre diferentes partes de ti.",
      historicalContext: "Los aspectos se basan en la armonía musical pitagórica - ciertos ángulos crean resonancia, otros crean tensión creativa.",
      modernPsychology: "Representan los diferentes subpersonalidades dentro de ti y cómo negocian entre sí para crear tu comportamiento único."
    }
  };
}

// 🎯 EXPLICAR POR QUÉ ES PERSONALIZADA
function explainPersonalization(natalChart: DetailedNatalChart, userProfile: UserProfile) {
  return {
    natalFactors: [
      `Tu Sol en ${natalChart.sol.sign} Casa ${natalChart.sol.house} crea una expresión única de identidad`,
      `Tu Luna en ${natalChart.luna.sign} Casa ${natalChart.luna.house} genera patrones emocionales específicos`,
      `La combinación exacta de signos-casas-aspectos que tienes es literalmente única en millones`
    ],
    
    progressedFactors: [
      `A los ${userProfile.currentAge} años, tu desarrollo evolutivo está en una fase específica`,
      `Tus progresiones actuales activan diferentes partes de tu carta natal`,
      `El timing de tu vida actual requiere estrategias específicas para tu edad y momento evolutivo`
    ],
    
    timeFactors: [
      `Naciste en ${userProfile.birthDate}, lo que determina el contexto generacional de tu carta`,
      `Los tránsitos planetarios actuales afectan tu carta natal de manera específica`,
      `Tu próximo año solar (de ${userProfile.currentAge} a ${userProfile.nextAge} años) tiene temas únicos`
    ],
    
    locationFactors: [
      `Naciste en ${userProfile.place}, lo que determina tu Ascendente y distribución de casas`,
      `Tu ubicación geográfica influye en qué planetas están prominentes en tu carta`,
      `Las coordenadas exactas ${userProfile.latitude}, ${userProfile.longitude} crean tu mapa celeste único`
    ]
  };
}

// 🔗 ANALIZAR CONEXIONES ASTROLÓGICAS
function analyzeConnections(natalChart: DetailedNatalChart) {
  const sunSign = natalChart.sol.sign;
  const moonSign = natalChart.luna.sign;
  const sunHouse = natalChart.sol.house;
  const moonHouse = natalChart.luna.house;
  
  return {
    planetaryInfluences: [
      `Tu Sol en ${sunSign} y Luna en ${moonSign} crean una dinámica específica entre propósito y emociones`,
      `El Sol en Casa ${sunHouse} enfoca tu identidad en temas de ${getHouseTheme(sunHouse)}`,
      `La Luna en Casa ${moonHouse} canaliza tus emociones hacia ${getHouseTheme(moonHouse)}`,
      `Esta combinación Sol-Luna te hace único en cómo expresas poder personal y sensibilidad emocional`
    ],
    
    houseActivations: [
      `Casa ${sunHouse} (Sol): Tu identidad se expresa principalmente a través de ${getHouseTheme(sunHouse)}`,
      `Casa ${moonHouse} (Luna): Tus emociones encuentran hogar en temas de ${getHouseTheme(moonHouse)}`,
      `Las casas ocupadas crean los 'focos de actividad' principales de tu vida`,
      `Las casas vacías no están inactivas - representan áreas de fluidez natural`
    ],
    
    signEnergies: [
      `${sunSign} (Sol): Aporta energía ${getSignElement(sunSign)} y modalidad ${getSignModality(sunSign)} a tu identidad`,
      `${moonSign} (Luna): Filtra tus emociones con cualidades ${getSignElement(moonSign)} y patrón ${getSignModality(moonSign)}`,
      `La combinación de elementos y modalidades crea tu 'temperamento astrológico' único`,
      `Esta mezcla específica influye en cómo respondes al estrés, la alegría y los desafíos`
    ],
    
    aspectPatterns: [
      `Los aspectos en tu carta crean 'conversaciones internas' entre diferentes partes de tu personalidad`,
      `Aspectos armónicos (trígonos, sextiles) representan talentos naturales y flujos fáciles`,
      `Aspectos tensos (cuadraturas, oposiciones) crean tensión creativa y oportunidades de crecimiento`,
      `Tu patrón específico de aspectos determina tu 'estilo de procesamiento' psicológico único`
    ]
  };
}

// 📈 ANALIZAR EVOLUCIÓN Y CRECIMIENTO
function analyzeEvolution(natalChart: DetailedNatalChart, userProfile: UserProfile) {
  const age = userProfile.currentAge;
  const sunSign = natalChart.sol.sign;
  
  return {
    currentLevel: `A los ${age} años, estás en la fase ${getLifePhase(age)} de desarrollo. Tu Sol en ${sunSign} está expresándose con ${getAgeMaturity(age, sunSign)}.`,
    
    nextLevel: `Hacia los ${age + 5} años, tu desafío evolutivo será ${getNextEvolutionaryStep(age, sunSign)}. Es importante prepararte desarrollando ${getPreparationSkills(sunSign)}.`,
    
    growthChallenges: [
      `INTEGRACIÓN: Armonizar las diferentes energías de tu carta en una expresión coherente`,
      `MADURACIÓN: Evolucionar las expresiones inmaduras de tu ${sunSign} hacia manifestaciones más sabias`,
      `EQUILIBRIO: Balancear tus fortalezas naturales con el desarrollo de áreas menos desarrolladas`,
      `AUTENTICIDAD: Vivir cada vez más desde tu Sol verdadero y menos desde expectativas externas`
    ],
    
    masteryIndicators: [
      `✨ AUTOCONOCIMIENTO: Reconoces tus patrones astrológicos y los usas conscientemente`,
      `✨ INTEGRACIÓN: Las diferentes partes de tu carta trabajan juntas armoniosamente`,
      `✨ SERVICIO: Usas tus dones únicos para contribuir al mundo de manera significativa`,
      `✨ SABIDURÍA: Ves los desafíos como oportunidades de crecimiento alineadas con tu propósito`
    ]
  };
}

// 🧠 ANALIZAR PSICOLOGÍA Y PATRONES
function analyzePsychology(natalChart: DetailedNatalChart) {
  const sunSign = natalChart.sol.sign;
  const moonSign = natalChart.luna.sign;
  
  return {
    coreBehaviorPatterns: [
      `PATRÓN SOLAR: Tu ${sunSign} te impulsa a ${getSolarBehaviorPattern(sunSign)}`,
      `PATRÓN LUNAR: Tu ${moonSign} te hace responder emocionalmente ${getLunarResponsePattern(moonSign)}`,
      `PATRÓN INTEGRADO: Combinas ${sunSign} y ${moonSign} creando un estilo único de ${getIntegratedPattern(sunSign, moonSign)}`,
      `PATRÓN DEFENSIVO: Cuando te sientes amenazado, activas mecanismos de ${getDefensePattern(sunSign, moonSign)}`
    ],
    
    emotionalTriggers: [
      `🔥 IDENTIDAD AMENAZADA: Cuando sienten que no reconocen tu esencia ${sunSign}`,
      `🔥 SEGURIDAD EMOCIONAL: Cuando tus necesidades ${moonSign} no son respetadas o satisfechas`,
      `🔥 VALORES VIOLADOS: Cuando el entorno va contra tus principios fundamentales`,
      `🔥 CONTROL PERDIDO: Cuando sientes que no puedes expresar tu naturaleza auténtica`
    ],
    
    motivationalDrivers: [
      `🎯 PROPÓSITO SOLAR: Te motiva profundamente poder expresar tu ${sunSign} de manera auténtica`,
      `🎯 SEGURIDAD LUNAR: Te impulsa crear condiciones donde tu ${moonSign} se sienta seguro y nutrido`,
      `🎯 RECONOCIMIENTO: Buscas que valoren tu contribución única al mundo`,
      `🎯 CRECIMIENTO: Te atrae constantemente evolucionar y convertirte en la mejor versión de ti`
    ],
    
    defenseMechanisms: [
      `🛡️ MÁSCARA SOLAR: Exageras tu ${sunSign} cuando te sientes inseguro`,
      `🛡️ RETIRO LUNAR: Te refugias en patrones ${moonSign} cuando te sientes vulnerable`,
      `🛡️ PROYECCIÓN: Atribuyes a otros las partes no integradas de tu personalidad`,
      `🛡️ PERFECCIONISMO: Usas altos estándares para evitar el riesgo de ser rechazado`
    ]
  };
}

// 🌟 GENERAR MANTRA PERSONALIZADO
function generatePersonalizedMantra(sunSign: string, moonSign: string, ascendant: string): string {
  const mantras: Record<string, string> = {
    'Aries': 'Lidero con coraje',
    'Tauro': 'Construyo con paciencia',
    'Géminis': 'Conecto con curiosidad',
    'Cáncer': 'Nutro con amor',
    'Leo': 'Brillo con autenticidad',
    'Virgo': 'Perfecciono con servicio',
    'Libra': 'Equilibro con belleza',
    'Escorpio': 'Transformo con poder',
    'Sagitario': 'Expando con sabiduría',
    'Capricornio': 'Logro con disciplina',
    'Acuario': 'Innovo con libertad',
    'Piscis': 'Fluyo con compasión'
  };

  return `${mantras[sunSign as keyof typeof mantras] || 'Soy auténtico'}, ${mantras[moonSign]?.toLowerCase() || 'siento profundo'}, ${mantras[ascendant]?.toLowerCase() || 'proyecto poder'}.`;
}

// 📋 CREAR PLAN DE ACCIÓN EDUCATIVO
function createEducationalActionPlan(natalChart: DetailedNatalChart): ActionPlan[] {
  // Explicitly cast category to the allowed literal types to satisfy TypeScript
  return [
    {
      category: 'crecimiento' as 'crecimiento',
      action: `INTEGRACIÓN DIARIA: Practica 10 minutos diarios conectando conscientemente con tu Sol ${natalChart.sol.sign} (propósito) y tu Luna ${natalChart.luna.sign} (emociones)`,
      timing: 'inmediato',
      difficulty: 'fácil',
      impact: 'alto'
    },
    {
      category: 'amor' as 'amor',
      action: `RELACIONES AUTÉNTICAS: En tus relaciones, comunica abiertamente tus necesidades ${natalChart.luna.sign} mientras mantienes tu identidad ${natalChart.sol.sign}`,
      timing: 'esta_semana',
      difficulty: 'moderado',
      impact: 'alto'
    },
    {
      category: 'trabajo' as 'trabajo',
      action: `CARRERA ALINEADA: Busca oportunidades profesionales que te permitan expresar tu ${natalChart.sol.sign} y que respeten tu proceso emocional ${natalChart.luna.sign}`,
      timing: 'este_mes',
      difficulty: 'desafiante',
      impact: 'alto'
    }
  ] as ActionPlan[];
}

// 🔧 FUNCIONES AUXILIARES
function getHouseTheme(house: number): string {
  const themes: { [key: number]: string } = {
    1: 'identidad personal y autoimagen',
    2: 'recursos, valores y seguridad material',
    3: 'comunicación y entorno cercano',
    4: 'hogar, familia y raíces emocionales',
    5: 'creatividad, romance y autoexpresión',
    6: 'trabajo diario, salud y servicio',
    7: 'relaciones de pareja y asociaciones',
    8: 'transformación y recursos compartidos',
    9: 'filosofía, viajes y educación superior',
    10: 'carrera, reputación y logros públicos',
    11: 'amistad, grupos y visiones futuras',
    12: 'espiritualidad, subconsciente y trascendencia'
  };
  return themes[house] || 'desarrollo personal';
}

function getSignElement(sign: string): string {
  const elements: { [key: string]: string } = {
    'Aries': 'fuego', 'Leo': 'fuego', 'Sagitario': 'fuego',
    'Tauro': 'tierra', 'Virgo': 'tierra', 'Capricornio': 'tierra',
    'Géminis': 'aire', 'Libra': 'aire', 'Acuario': 'aire',
    'Cáncer': 'agua', 'Escorpio': 'agua', 'Piscis': 'agua'
  };
  return elements[sign] || 'fuego';
}

function getSignModality(sign: string): string {
  const modalities: { [key: string]: string } = {
    'Aries': 'cardinal', 'Cáncer': 'cardinal', 'Libra': 'cardinal', 'Capricornio': 'cardinal',
    'Tauro': 'fijo', 'Leo': 'fijo', 'Escorpio': 'fijo', 'Acuario': 'fijo',
    'Géminis': 'mutable', 'Virgo': 'mutable', 'Sagitario': 'mutable', 'Piscis': 'mutable'
  };
  return modalities[sign] || 'cardinal';
}

function getLifePhase(age: number): string {
  if (age < 12) return 'infancia lunar';
  if (age < 24) return 'juventud mercurial';
  if (age < 42) return 'madurez venusiana-marcial';
  if (age < 56) return 'consolidación jupiteriana';
  if (age < 70) return 'maestría saturnina';
  return 'sabiduría uraniana';
}

function getAgeMaturity(age: number, sunSign: string): string {
  const maturityLevels: Record<string, string> = {
    'Aries': age < 30 ? 'impulsividad juvenil' : 'liderazgo maduro',
    'Tauro': age < 30 ? 'terquedad básica' : 'sabiduría práctica',
    'Géminis': age < 30 ? 'dispersión curiosa' : 'comunicación profunda',
    'Cáncer': age < 30 ? 'emotividad reactive' : 'nutrición sabia',
    'Leo': age < 30 ? 'ego dramático' : 'generosidad real',
    'Virgo': age < 30 ? 'perfeccionismo ansioso' : 'servicio refinado',
    'Libra': age < 30 ? 'indecisión social' : 'diplomacia equilibrada',
    'Escorpio': age < 30 ? 'intensidad destructiva' : 'transformación consciente',
    'Sagitario': age < 30 ? 'filosofía superficial' : 'sabiduría expandida',
    'Capricornio': age < 30 ? 'ambición rígida' : 'autoridad natural',
    'Acuario': age < 30 ? 'rebeldía adolescente' : 'innovación humanitaria',
    'Piscis': age < 30 ? 'sensibilidad escapista' : 'compasión universal'
  };

  return maturityLevels[sunSign] || 'desarrollo personal';
}

function getNextEvolutionaryStep(age: number, sunSign: string): string {
  return `integrar más profundamente las cualidades maduras de ${sunSign} mientras desarrollas mayor sabiduría emocional y espiritual`;
}

function getPreparationSkills(sunSign: string): string {
  const skills: { [key: string]: string } = {
    'Aries': 'paciencia y consideración hacia otros',
    'Tauro': 'flexibilidad y apertura al cambio',
    'Géminis': 'profundidad y compromiso sostenido',
    'Cáncer': 'límites saludables y objetividad',
    'Leo': 'humildad y servicio desinteresado',
    'Virgo': 'aceptación de la imperfección y fluidez',
    'Libra': 'decisión firme y autenticidad personal',
    'Escorpio': 'perdón y liberación constructiva',
    'Sagitario': 'disciplina y atención al detalle',
    'Capricornio': 'espontaneidad y expresión emocional',
    'Acuario': 'intimidad emocional y compromiso personal',
    'Piscis': 'límites claros y acción práctica'
  };
  return skills[sunSign] || 'autoconocimiento profundo';
}

function getSolarBehaviorPattern(sunSign: string): string {
  const patterns: { [key: string]: string } = {
    'Aries': 'iniciar, liderar y actuar con decisión rápida',
    'Tauro': 'construir, persistir y buscar estabilidad duradera',
    'Géminis': 'comunicar, aprender y conectar ideas diversas',
    'Cáncer': 'proteger, nutrir y crear seguridad emocional',
    'Leo': 'crear, expresar y buscar reconocimiento auténtico',
    'Virgo': 'analizar, perfeccionar y servir con dedicación',
    'Libra': 'armonizar, equilibrar y crear belleza relacional',
    'Escorpio': 'transformar, profundizar y regenerar intensamente',
    'Sagitario': 'explorar, enseñar y expandir horizontes',
    'Capricornio': 'lograr, estructurar y construir autoridad',
    'Acuario': 'innovar, liberar y servir causas humanitarias',
    'Piscis': 'fluir, inspirar y servir con compasión universal'
  };
  return patterns[sunSign] || 'expresar tu naturaleza auténtica';
}

function getLunarResponsePattern(moonSign: string): string {
  const patterns: { [key: string]: string } = {
    'Aries': 'reaccionando rápido y directamente a estímulos',
    'Tauro': 'buscando comodidad y estabilidad emocional',
    'Géminis': 'procesando través de comunicación y análisis',
    'Cáncer': 'retirándote para nutrir y proteger tus sentimientos',
    'Leo': 'necesitando reconocimiento y expresión dramática',
    'Virgo': 'analizando y organizando tus experiencias emocionales',
    'Libra': 'buscando armonía y evitando conflictos emocionales',
    'Escorpio': 'sintiendo con intensidad y buscando transformación',
    'Sagitario': 'necesitando libertad y perspectiva filosófica',
    'Capricornio': 'controlando emociones y buscando estructura',
    'Acuario': 'distanciándote emocionalmente para ganar objetividad',
    'Piscis': 'absorbiendo las emociones del entorno como una esponja'
  };
  return patterns[moonSign] || 'de manera única y personal';
}

function getIntegratedPattern(sunSign: string, moonSign: string): string {
  return `${sunSign.toLowerCase()} consciente con sensibilidad ${moonSign.toLowerCase()}`;
}

function getDefensePattern(sunSign: string, moonSign: string): string {
  return `${sunSign.toLowerCase()} exagerado cuando tu ${moonSign.toLowerCase()} se siente amenazado`;
}

// 🎯 FUNCIÓN COMPARATIVA: NATAL VS PROGRESADA
export async function generateEducationalProgressedComparison(
  natalChart: DetailedNatalChart,
  progressedChart: DetailedProgressedChart,
  userProfile: UserProfile
): Promise<{
  evolution: string;
  keyChanges: string[];
  integrationAdvice: string;
  nextEvolutionStep: string;
}> {
  
  const natalSun = natalChart.sol;
  const natalMoon = natalChart.luna;
  
  // 🌟 ANALIZAR EVOLUCIÓN SOLAR
  const sunEvolution = analyzeSunEvolution(natalSun, progressedChart.sol_progresado, userProfile.currentAge);

  // 🌙 ANALIZAR EVOLUCIÓN LUNAR
  const moonEvolution = analyzeMoonEvolution(natalMoon, progressedChart.luna_progresada, userProfile.currentAge);
  
  // 🏠 ANALIZAR CAMBIOS DE CASAS
  const houseShifts = analyzeHouseShifts(natalChart, progressedChart);
  
  return {
    evolution: `EVOLUCIÓN PERSONAL A LOS ${userProfile.currentAge} AÑOS:

🌟 IDENTIDAD (Sol): ${sunEvolution.description}
Tu Sol natal en ${natalSun.sign} Casa ${natalSun.house} ahora se expresa como Sol progresado en ${progressedChart.sol_progresado.sign} Casa ${progressedChart.sol_progresado.house}. ${sunEvolution.meaning}

🌙 EMOCIONALIDAD (Luna): ${moonEvolution.description}
Tu Luna natal en ${natalMoon.sign} Casa ${natalMoon.house} ha evolucionado a Luna progresada en ${progressedChart.luna_progresada.sign} Casa ${progressedChart.luna_progresada.house}. ${moonEvolution.meaning}

🏠 ENFOQUES DE VIDA: ${houseShifts.description}`,

    keyChanges: [
      `🔄 IDENTIDAD SOLAR: De ${natalSun.sign} (${getSunSignCore(natalSun.sign)}) a ${progressedChart.sol_progresado.sign} (${getSunSignCore(progressedChart.sol_progresado.sign)})`,
      `🔄 RESPUESTA EMOCIONAL: De patrones ${natalMoon.sign} (${getMoonSignCore(natalMoon.sign)}) a ${progressedChart.luna_progresada.sign} (${getMoonSignCore(progressedChart.luna_progresada.sign)})`,
      `🔄 ÁREA DE ENFOQUE: De Casa ${natalSun.house} (${getHouseTheme(natalSun.house)}) a Casa ${progressedChart.sol_progresado.house} (${getHouseTheme(progressedChart.sol_progresado.house)})`,
      `🔄 PROCESAMIENTO EMOCIONAL: De Casa ${natalMoon.house} (${getHouseTheme(natalMoon.house)}) a Casa ${progressedChart.luna_progresada.house} (${getHouseTheme(progressedChart.luna_progresada.house)})`,
      ...houseShifts.specificChanges
    ],

    integrationAdvice: `ESTRATEGIA DE INTEGRACIÓN CONSCIENTE:

💡 HONRA TU BASE NATAL: Nunca abandones completamente tu esencia natal ${natalSun.sign}-${natalMoon.sign}. Es tu fundamento eterno.

🌱 ABRAZA TU EVOLUCIÓN PROGRESADA: Permite que tu nuevo ${progressedChart.sol_progresado.sign}-${progressedChart.luna_progresada.sign} se exprese, pero desde la sabiduría de tu base natal.

🔄 CICLO DE INTEGRACIÓN DIARIA:
- Mañana: Conecta con tu propósito progresado ${progressedChart.sol_progresado.sign}
- Tarde: Actúa desde tu identidad natal ${natalSun.sign}
- Noche: Procesa emocionalmente como ${progressedChart.luna_progresada.sign} informado por tu ${natalMoon.sign} natal

⚖️ NO ES REEMPLAZO, ES EVOLUCIÓN: Tu carta progresada no reemplaza la natal - la enriquece. Eres ${natalSun.sign} evolucionando hacia ${progressedChart.sol_progresado.sign}, no ${progressedChart.sol_progresado.sign} puro.`,

    nextEvolutionStep: `PRÓXIMO NIVEL EVOLUTIVO (Años ${userProfile.currentAge + 1}-${userProfile.currentAge + 5}):

🎯 MAESTRÍA DE LA TRANSICIÓN: Dominar completamente la integración ${natalSun.sign}→${progressedChart.sol_progresado.sign} y ${natalMoon.sign}→${progressedChart.luna_progresada.sign}.

🚀 NUEVA EXPRESIÓN: Desarrollar un estilo único que sea auténticamente tuyo - ni puramente natal ni puramente progresado, sino una síntesis superior.

🌟 SERVICIO EVOLUCIONADO: Usar tu experiencia de transición para ayudar a otros que pasen por cambios similares.

📈 PREPARACIÓN: ${getNextEvolutionPreparation(progressedChart.sol_progresado.sign, progressedChart.luna_progresada.sign, userProfile.currentAge)}`
  };
}

// 🌟 ANALIZAR EVOLUCIÓN SOLAR ESPECÍFICA
function analyzeSunEvolution(natalSun: any, progressedSun: any, age: number) {
  if (natalSun.sign === progressedSun.sign) {
    return {
      description: `Tu Sol sigue en ${natalSun.sign}, pero con ${age} años de experiencia y madurez`,
      meaning: `Has profundizado tu comprensión de lo que significa ser ${natalSun.sign}. Ya no es la expresión cruda del inicio, sino una versión refinada y madura.`
    };
  }
  
  return {
    description: `Tu Sol ha evolucionado de ${natalSun.sign} a ${progressedSun.sign} - una transformación significativa de identidad`,
    meaning: `Esta transición representa un cambio fundamental en cómo te ves a ti mismo y cómo quieres expresar tu propósito en el mundo. Mantienes la base ${natalSun.sign}, pero ahora la expresas a través del filtro ${progressedSun.sign}.`
  };
}

// 🌙 ANALIZAR EVOLUCIÓN LUNAR ESPECÍFICA  
function analyzeMoonEvolution(natalMoon: any, progressedMoon: any, age: number) {
  if (natalMoon.sign === progressedMoon.sign) {
    return {
      description: `Tu Luna permanece en ${natalMoon.sign}, indicando continuidad en tu naturaleza emocional básica`,
      meaning: `Tus patrones emocionales fundamentales siguen siendo ${natalMoon.sign}, pero han madurado con la experiencia. Tu forma de procesar emociones es más sabia pero mantiene la esencia original.`
    };
  }
  
  return {
    description: `Tu Luna ha transitado de ${natalMoon.sign} a ${progressedMoon.sign} - evolución en tu mundo emocional`,
    meaning: `Esta es una transformación profunda en cómo procesas emociones y qué necesitas para sentirte seguro. Tu ${natalMoon.sign} natal sigue siendo tu base, pero ahora filtras experiencias emocionales a través de ${progressedMoon.sign}.`
  };
}

function analyzeHouseShifts(natalChart: DetailedNatalChart, progressedChart: DetailedProgressedChart) {
  const sunHouseChange = natalChart.sol.house !== progressedChart.sol_progresado.house;
  const moonHouseChange = natalChart.luna.house !== progressedChart.luna_progresada.house;
  
  const changes = [];
  let description = "Los enfoques de vida han ";
  
  if (sunHouseChange) {
    changes.push(`🎯 ENFOQUE SOLAR: De Casa ${natalChart.sol.house} (${getHouseTheme(natalChart.sol.house)}) a Casa ${progressedChart.sol_progresado.house} (${getHouseTheme(progressedChart.sol_progresado.house)})`);
    description += `cambiado significativamente en términos de propósito`;
  } else {
    description += `mantenido consistencia en el propósito (Casa ${natalChart.sol.house})`;
  }
  
  if (moonHouseChange) {
    changes.push(`🌙 ENFOQUE EMOCIONAL: De Casa ${natalChart.luna.house} (${getHouseTheme(natalChart.luna.house)}) a Casa ${progressedChart.luna_progresada.house} (${getHouseTheme(progressedChart.luna_progresada.house)})`);
    if (sunHouseChange) {
      description += ` y emocional`;
    } else {
      description += `, pero han evolucionado emocionalmente hacia Casa ${progressedChart.luna_progresada.house}`;
    }
  } else if (!sunHouseChange) {
    description += ` pero con mayor profundidad y madurez`;
  }
  
  return {
    description,
    specificChanges: changes
  };
}

// 🎯 FUNCIONES AUXILIARES PARA INTERPRETACIÓN
function getSunSignCore(sign: string): string {
  const cores: { [key: string]: string } = {
    'Aries': 'iniciativa pionera',
    'Tauro': 'estabilidad constructiva', 
    'Géminis': 'comunicación versátil',
    'Cáncer': 'nutrición protectora',
    'Leo': 'expresión creativa',
    'Virgo': 'perfeccionamiento servicial',
    'Libra': 'armonía relacional',
    'Escorpio': 'transformación intensa',
    'Sagitario': 'expansión filosófica',
    'Capricornio': 'logro estructurado',
    'Acuario': 'innovación humanitaria',
    'Piscis': 'compasión universal'
  };
  return cores[sign] || 'expresión auténtica';
}

function getMoonSignCore(sign: string): string {
  const cores: { [key: string]: string } = {
    'Aries': 'reacción impulsiva directa',
    'Tauro': 'seguridad a través de estabilidad',
    'Géminis': 'procesamiento a través de comunicación',
    'Cáncer': 'protección emocional instintiva',
    'Leo': 'necesidad de reconocimiento emocional',
    'Virgo': 'orden emocional y análisis',
    'Libra': 'equilibrio emocional y armonía',
    'Escorpio': 'intensidad emocional transformadora',
    'Sagitario': 'libertad emocional y optimismo',
    'Capricornio': 'control emocional y pragmatismo',
    'Acuario': 'distanciamiento emocional objetivo',
    'Piscis': 'sensibilidad emocional absorbente'
  };
  return cores[sign] || 'respuesta emocional única';
}

function getNextEvolutionPreparation(progressedSun: string, progressedMoon: string, age: number): string {
  return `Para los próximos años, enfócate en dominar completamente tu nueva identidad ${progressedSun} mientras mantienes la sabiduría emocional ${progressedMoon}. Practica integración diaria y busca oportunidades para expresar esta nueva versión de ti en el mundo.`;
}

// 🎯 FUNCIÓN PARA INTERPRETACIÓN DE EVENTOS ESPECÍFICOS
export async function generateEducationalEventInterpretation(
  event: any,
  natalChart: DetailedNatalChart,
  progressedChart: DetailedProgressedChart,
  userProfile: UserProfile
): Promise<EducationalInterpretation> {
  
  const eventPlanet = event.planet || 'Energía Cósmica';
  const eventSign = event.sign || 'Universal';
  const eventHouse = event.house || 1;
  
  // 🎯 INTERPRETAR EL EVENTO EN CONTEXTO PERSONAL
  const eventMeaning = analyzeEventMeaning(event, natalChart, userProfile);
  
  // 📚 CREAR EXPLICACIÓN EDUCATIVA DEL EVENTO
  const eventEducation = createEventEducation(event, eventPlanet, eventSign, eventHouse);
  
  // 🔄 CONECTAR CON CARTA NATAL Y PROGRESADA
  const personalConnections = analyzeEventConnections(event, natalChart, progressedChart);
  
  return {
    meaning: eventMeaning.core,
    lifeAreas: eventMeaning.areas,
    advice: eventMeaning.strategy,
    mantra: eventMeaning.mantra,
    ritual: eventMeaning.ritual,
    actionPlan: eventMeaning.actions,
    warningsAndOpportunities: eventMeaning.alerts,
    
    educational: {
      conceptExplanations: eventEducation,
      personalizationWhy: personalConnections.why,
      astrologicalConnections: personalConnections.connections,
      evolutionaryPerspective: personalConnections.evolution,
      psychologicalInsights: personalConnections.psychology
    }
  };
}

// 🔄 ANALIZAR SIGNIFICADO DEL EVENTO
function analyzeEventMeaning(event: any, natalChart: DetailedNatalChart, userProfile: UserProfile) {
  const eventType = event.type || 'tránsito';
  const eventPlanet = event.planet || 'Energía Universal';
  const userName = userProfile.name || 'Usuario';
  const userAge = userProfile.currentAge;
  
  return {
    core: `${userName}, este ${eventType} de ${eventPlanet} es específicamente significativo para ti a los ${userAge} años porque activa elementos únicos de tu carta natal. No es un evento genérico - es un momento cósmico diseñado específicamente para tu evolución personal.`,
    
    areas: [
      `Desarrollo personal (relacionado con tu ${natalChart.sol.sign} natal)`,
      `Procesamiento emocional (conectado con tu ${natalChart.luna.sign} natal)`,
      `Expresión social (influencia en tu ${natalChart.ascendente?.sign || 'Ascendente'})`,
      'Crecimiento evolutivo específico para tu edad',
      'Preparación para tu próximo nivel de madurez'
    ],
    
    strategy: `ENFOQUE PERSONALIZADO PARA ESTE EVENTO: Usa tu fortaleza natal ${natalChart.sol.sign} como base estable, permite que tu sensibilidad ${natalChart.luna.sign} procese la experiencia, y expresa los resultados a través de tu estilo único ${natalChart.ascendente?.sign || 'personal'}. Este evento no viene a desestabilizarte - viene a evolucionar lo que ya eres.`,
    
    mantra: `"Recibo esta energía ${eventPlanet} con mi sabiduría ${natalChart.sol.sign}, la proceso con mi sensibilidad ${natalChart.luna.sign}, y la expreso con mi autenticidad única."`,
    
    ritual: `RITUAL DE INTEGRACIÓN CONSCIENTE: 
1. Conecta con tu Sol natal ${natalChart.sol.sign} (5 min recordando quién eres esencialmente)
2. Honra tu Luna natal ${natalChart.luna.sign} (5 min sintiendo cómo este evento te afecta emocionalmente) 
3. Integra la nueva energía ${eventPlanet} (10 min visualizando cómo puede mejorar tu vida sin cambiar tu esencia)
4. Actúa desde tu totalidad (durante el día, toma decisiones desde esta integración)`,
    
    actions: [
      {
        category: 'crecimiento' as 'crecimiento',
        action: `Estudia cómo este evento ${eventPlanet} puede potenciar tu naturaleza ${natalChart.sol.sign} sin contradecirla`,
        timing: 'inmediato',
        difficulty: 'fácil',
        impact: 'alto'
      },
      {
        category: 'amor' as 'amor',
        action: `En relaciones, comunica cómo este tránsito está afectando tu proceso emocional ${natalChart.luna.sign}`,
        timing: 'esta_semana',
        difficulty: 'moderado',
        impact: 'alto'
      },
      {
        category: 'trabajo' as 'trabajo',
        action: `Busca maneras de aplicar la nueva energía ${eventPlanet} en tu trabajo, manteniendo tu estilo ${natalChart.sol.sign}`,
        timing: 'este_mes',
        difficulty: 'moderado',
        impact: 'medio'
      }
    ] as ActionPlan[],
    
    alerts: {
      warnings: [
        `⚠️ NO PIERDAS TU ESENCIA: Este evento no requiere que cambies quién eres fundamentalmente`,
        `⚠️ NO IGNORES TUS EMOCIONES: Tu ${natalChart.luna.sign} natal necesita procesar esta energía gradualmente`,
        `⚠️ NO ACTÚES IMPULSIVAMENTE: Integra conscientemente antes de tomar decisiones importantes`
      ],
      opportunities: [
        `🎯 EVOLUCIÓN NATURAL: Este es el momento perfecto para que tu ${natalChart.sol.sign} crezca al siguiente nivel`,
        `🎯 SABIDURÍA EMOCIONAL: Tu ${natalChart.luna.sign} puede desarrollar nueva profundidad y madurez`,
        `🎯 EXPRESIÓN AUTÉNTICA: Oportunidad única para mostrar al mundo una versión evolucionada de ti mismo`
      ]
    }
  };
}

// 📚 CREAR EDUCACIÓN ESPECÍFICA DEL EVENTO
function createEventEducation(event: any, planet: string, sign: string, house: number) {
  return {
    [event.type || 'Tránsito']: {
      simpleExplanation: `Un ${event.type || 'tránsito'} ocurre cuando ${planet} en el cielo actual forma una relación específica con planetas en tu carta natal.`,
      deeperMeaning: `Este evento representa un momento donde la energía cósmica actual (${planet} en ${sign}) interactúa directamente con tu blueprint natal, creando una oportunidad de crecimiento específica.`,
      historicalContext: `Los astrólogos han observado durante milenios que estos eventos cósmicos coinciden con períodos de desarrollo personal significativo.`,
      modernPsychology: `Psicológicamente, estos períodos representan momentos donde tu inconsciente está más receptivo al cambio y la integración de nuevos aspectos de personalidad.`
    },
    
    [planet]: {
      simpleExplanation: `${planet} representa ${getPlanetSimpleCore(planet)} en tu vida.`,
      deeperMeaning: `En este momento, la energía de ${planet} está especialmente activa en tu experiencia, ofreciéndote oportunidades de desarrollo en ${getPlanetDeepCore(planet)}.`,
      historicalContext: `Tradicionalmente, ${planet} ha sido asociado con ${getPlanetTraditional(planet)}.`,
      modernPsychology: `Psicológicamente, ${planet} representa ${getPlanetPsychological(planet)} en tu desarrollo personal.`
    },
    
    [sign]: {
      simpleExplanation: `${sign} aporta cualidades de ${getSignSimpleCore(sign)} a la energía de ${planet}.`,
      deeperMeaning: `La energía ${sign} filtra y colora cómo experimentas ${planet}, dándole un sabor específico de ${getSignDeepCore(sign)}.`,
      historicalContext: `${sign} tradicionalmente representa ${getSignTraditional(sign)} en el zodíaco.`,
      modernPsychology: `${sign} simboliza ${getSignPsychological(sign)} en términos de desarrollo de la personalidad.`
    },
    
    [`Casa ${house}`]: {
      simpleExplanation: `Casa ${house} representa el área de vida de ${getHouseTheme(house)} donde se manifiesta este evento.`,
      deeperMeaning: `Esta casa indica que el evento impactará específicamente tus experiencias relacionadas con ${getHouseDeepTheme(house)}.`,
      historicalContext: `En astrología tradicional, Casa ${house} gobierna ${getHouseTraditional(house)}.`,
      modernPsychology: `Psicológicamente, Casa ${house} representa ${getHousePsychological(house)} en tu desarrollo.`
    }
  };
}

// 🔗 ANALIZAR CONEXIONES DEL EVENTO
function analyzeEventConnections(event: any, natalChart: DetailedNatalChart, progressedChart: DetailedProgressedChart) {
  return {
    why: {
      natalFactors: [
        `Tu Sol natal en ${natalChart.sol.sign} Casa ${natalChart.sol.house} resuena específicamente con este evento`,
        `Tu Luna natal en ${natalChart.luna.sign} Casa ${natalChart.luna.house} será activada por esta energía`,
        `Los aspectos únicos en tu carta natal amplifican o modifican cómo experimentas este evento`
      ],
      progressedFactors: [
        `Tu desarrollo actual hasta este punto te ha preparado específicamente para este momento`,
        `Tus progresiones actuales están en el timing perfecto para integrar esta nueva energía`,
        `Tu madurez evolutiva actual te permite aprovechar este evento de manera constructiva`
      ],
      timeFactors: [
        `Este evento ocurre en el momento perfecto de tu ciclo de vida personal`,
        `Tu edad actual (${natalChart.sol.house ? 'determinada por tu carta' : 'específica'}) hace que este evento tenga máximo impacto evolutivo`,
        `Los tránsitos previos te han preparado para recibir esta energía de manera constructiva`
      ],
      locationFactors: [
        `Tu ubicación de nacimiento determina cómo este evento se manifiesta en tu vida específica`,
        `Las coordenadas de tu carta crean el contexto único para cómo experimentas esta energía`,
        `Tu entorno actual amplifica ciertos aspectos de este evento astrológico`
      ]
    },
    
    connections: {
      planetaryInfluences: [
        `${event.planet || 'La energía'} activa específicamente patrones relacionados con tu configuración natal única`,
        `La interacción entre este evento y tus planetas natales crea un momento de síntesis personal`,
        `Tu carta natal actúa como un 'filtro personalizado' para cómo experimentas esta energía cósmica`
      ],
      
      houseActivations: [
        `Casa ${event.house || 1} en tu carta será especialmente activa durante este período`,
        `La energía se manifestará principalmente en áreas de vida relacionadas con ${getHouseTheme(event.house || 1)}`,
        `Otras casas conectadas por aspectos también experimentarán activación secundaria`
      ],
      
      signEnergies: [
        `${event.sign || 'La energía'} combina con tu configuración natal creando una expresión única`,
        `Tu distribución elemental natal modificará cómo integras esta nueva energía ${event.sign || 'cósmica'}`,
        `La modalidad de ${event.sign || 'esta energía'} interactúa específicamente con tu temperamento astrológico natal`
      ],
      
      aspectPatterns: [
        `Los aspectos que este evento forma con tu carta natal determinan la facilidad o desafío de integración`,
        `Tu patrón natal de aspectos proporciona el 'contexto de conversación' para esta nueva energía`,
        `La geometría específica entre este evento y tu carta crea oportunidades únicas de crecimiento`
      ]
    },
    
    evolution: {
      currentLevel: `Este evento te encuentra en tu nivel actual de desarrollo, preparado para el siguiente paso evolutivo`,
      nextLevel: `Te prepara específicamente para una nueva fase de expresión de tu naturaleza esencial`,
      growthChallenges: [
        `Integrar nueva energía sin perder tu esencia natal`,
        `Mantener equilibrio durante el proceso de expansión personal`,
        `Usar este crecimiento para servir mejor tu propósito de vida`
      ],
      masteryIndicators: [
        `Reconoces cómo este evento se conecta con tu patrón de vida más grande`,
        `Puedes integrar la nueva energía manteniendo tu autenticidad central`,
        `Usas este desarrollo para contribuir más efectivamente al mundo`
      ]
    },
    
    psychology: {
      coreBehaviorPatterns: [
        `Este evento activará patrones de comportamiento relacionados con tu configuración natal ${natalChart.sol.sign}-${natalChart.luna.sign}`,
        `Tus respuestas automáticas serán amplificadas, dándote oportunidad de observarlas y refinarlas`,
        `Patrones inconscientes pueden volverse más visibles durante este período`
      ],
      
      emotionalTriggers: [
        `Situaciones que normalmente activarían tu ${natalChart.luna.sign} natal pueden intensificarse temporalmente`,
        `Tu sensibilidad emocional puede estar más activa, requiriendo consciencia extra`,
        `Temas no resueltos relacionados con tu desarrollo ${natalChart.sol.sign} pueden emerger para sanación`
      ],
      
      motivationalDrivers: [
        `Tu impulso fundamental ${natalChart.sol.sign} será energizado por este evento`,
        `Motivaciones que habían estado dormidas pueden reactivarse con nueva intensidad`,
        `Oportunidades para expresar tu propósito de vida de maneras nuevas y expandidas`
      ],
      
      defenseMechanisms: [
        `Ten consciencia de tus patrones defensivos ${natalChart.luna.sign} durante este período de cambio`,
        `La resistencia al crecimiento puede manifestarse como reacción ${natalChart.sol.sign} exagerada`,
        `Usa tu madurez actual para elegir respuestas constructivas en lugar de reactivas`
      ]
    }
  };
}

// 🎯 FUNCIONES AUXILIARES PARA PLANETAS
function getPlanetSimpleCore(planet: string): string {
  const cores: { [key: string]: string } = {
    'Sol': 'identidad, propósito y expresión personal',
    'Luna': 'emociones, instintos y necesidades de seguridad',
    'Mercurio': 'comunicación, pensamiento y aprendizaje',
    'Venus': 'amor, valores y atracción',
    'Marte': 'acción, impulso y energía',
    'Júpiter': 'expansión, sabiduría y oportunidades',
    'Saturno': 'disciplina, responsabilidad y estructura',
    'Urano': 'innovación, cambio y libertad',
    'Neptuno': 'espiritualidad, intuición e inspiración',
    'Plutón': 'transformación, poder y regeneración'
  };
  return cores[planet] || 'energía evolutiva';
}

function getPlanetDeepCore(planet: string): string {
  const cores: { [key: string]: string } = {
    'Sol': 'autorrealización y expresión del propósito único de vida',
    'Luna': 'sanación emocional y desarrollo de seguridad interior auténtica',
    'Mercurio': 'refinamiento de la comunicación y expansión de la perspectiva mental',
    'Venus': 'profundización de la capacidad de amar y crear belleza',
    'Marte': 'canalización constructiva de la energía vital y el coraje personal',
    'Júpiter': 'expansión de la sabiduría personal y conexión con significado mayor',
    'Saturno': 'construcción de autoridad auténtica y maestría personal',
    'Urano': 'liberación de patrones limitantes e innovación personal',
    'Neptuno': 'desarrollo de la compasión universal y conexión espiritual',
    'Plutón': 'transformación profunda y regeneración del poder personal'
  };
  return cores[planet] || 'evolución de la conciencia';
}

function getPlanetTraditional(planet: string): string {
  const traditional: { [key: string]: string } = {
    'Sol': 'la realeza, el padre, la autoridad y la vitalidad',
    'Luna': 'la madre, las mujeres, la fertilidad y los ciclos naturales',
    'Mercurio': 'los mensajeros, el comercio, los viajes y el conocimiento',
    'Venus': 'la belleza, el amor, las artes y los placeres',
    'Marte': 'la guerra, los soldados, la competencia y la energía física',
    'Júpiter': 'los maestros, la religión, la justicia y la abundancia',
    'Saturno': 'el tiempo, las limitaciones, la vejez y la disciplina',
    'Urano': 'la revolución, la tecnología y los cambios súbitos',
    'Neptuno': 'el océano, los sueños, la música y la espiritualidad',
    'Plutón': 'el inframundo, la muerte-renacimiento y los tesoros ocultos'
  };
  return traditional[planet] || 'fuerzas transformadoras';
}

function getPlanetPsychological(planet: string): string {
  const psychological: { [key: string]: string } = {
    'Sol': 'el ego consciente y la identidad central del individuo',
    'Luna': 'el inconsciente personal y los patrones emocionales básicos',
    'Mercurio': 'la función mental y los procesos de comunicación',
    'Venus': 'la función de valoración y la capacidad de relacionarse',
    'Marte': 'la función de aserción y la energía libidinal dirigida',
    'Júpiter': 'la función de expansión y el principio de crecimiento',
    'Saturno': 'el principio de realidad y la estructura del super-ego',
    'Urano': 'la función de individuación y liberación de la personalidad',
    'Neptuno': 'la función transcendente y la disolución de los límites del ego',
    'Plutón': 'la función transformadora y los procesos de muerte-renacimiento psicológico'
  };
  return psychological[planet] || 'aspectos complejos del desarrollo psicológico';
}

// 🌟 FUNCIONES AUXILIARES PARA SIGNOS
function getSignSimpleCore(sign: string): string {
  return getSignElement(sign) + ' ' + getSignModality(sign);
}

function getSignDeepCore(sign: string): string {
  const deep: { [key: string]: string } = {
    'Aries': 'iniciativa pionera y coraje para comenzar nuevos ciclos',
    'Tauro': 'construcción paciente y creación de seguridad duradera',
    'Géminis': 'conexión versátil y síntesis de información diversa',
    'Cáncer': 'nutrición emocional y creación de espacios seguros',
    'Leo': 'expresión creativa auténtica y generosidad del corazón',
    'Virgo': 'refinamiento dedicado y servicio perfeccionado',
    'Libra': 'armonización bella y creación de equilibrio relacional',
    'Escorpio': 'transformación profunda y regeneración del poder personal',
    'Sagitario': 'expansión filosófica y búsqueda de verdades universales',
    'Capricornio': 'construcción de autoridad auténtica y logro duradero',
    'Acuario': 'innovación humanitaria y liberación de patrones obsoletos',
    'Piscis': 'compasión universal y disolución de fronteras separativas'
  };
  return deep[sign] || 'expresión única de la energía zodiacal';
}

function getSignTraditional(sign: string): string {
  const traditional: { [key: string]: string } = {
    'Aries': 'el carnero, el guerrero, el iniciador del zodíaco',
    'Tauro': 'el toro, el constructor, el preservador de recursos',
    'Géminis': 'los gemelos, el comunicador, el intercambiador de ideas',
    'Cáncer': 'el cangrejo, la madre, el protector del hogar',
    'Leo': 'el león, el rey, el creador de espectáculos',
    'Virgo': 'la virgen, el sanador, el perfeccionador de sistemas',
    'Libra': 'la balanza, el diplomático, el armonizador de opuestos',
    'Escorpio': 'el escorpión, el transformador, el guardián de misterios',
    'Sagitario': 'el arquero, el filósofo, el explorador de horizontes',
    'Capricornio': 'la cabra, el ejecutivo, el escalador de montañas',
    'Acuario': 'el aguador, el revolucionario, el visionario del futuro',
    'Piscis': 'los peces, el místico, el unificador de toda la experiencia'
  };
  return traditional[sign] || 'arquetipo zodiacal tradicional';
}

function getSignPsychological(sign: string): string {
  const psychological: { [key: string]: string } = {
    'Aries': 'el impulso de individuación y la afirmación del yo',
    'Tauro': 'la necesidad de seguridad material y estabilidad sensorial',
    'Géminis': 'la función adaptativa y la necesidad de variedad mental',
    'Cáncer': 'la función nutritiva y la necesidad de pertenencia emocional',
    'Leo': 'la necesidad de reconocimiento y expresión creativa del ego',
    'Virgo': 'la función discriminatoria y la necesidad de orden perfecto',
    'Libra': 'la función relacional y la necesidad de armonía interpersonal',
    'Escorpio': 'la función regenerativa y la necesidad de transformación profunda',
    'Sagitario': 'la función expansiva y la necesidad de significado universal',
    'Capricornio': 'la función ejecutiva y la necesidad de logro estructurado',
    'Acuario': 'la función innovadora y la necesidad de libertad grupal',
    'Piscis': 'la función transcendente y la necesidad de unión universal'
  };
  return psychological[sign] || 'patrón psicológico específico del desarrollo';
}

// 🏠 FUNCIONES AUXILIARES PARA CASAS
function getHouseDeepTheme(house: number): string {
  const deepThemes: { [key: number]: string } = {
    1: 'desarrollo de la identidad personal auténtica y presencia en el mundo',
    2: 'construcción de recursos internos y externos, valores personales profundos',
    3: 'refinamiento de la comunicación y conexión con el entorno inmediato',
    4: 'sanación de las raíces familiares y creación de seguridad emocional',
    5: 'expresión creativa auténtica y desarrollo del niño interior',
    6: 'perfeccionamiento del servicio diario y cuidado de la salud integral',
    7: 'maestría en las relaciones uno-a-uno y equilibrio interpersonal',
    8: 'transformación profunda y manejo consciente del poder personal',
    9: 'expansión de la sabiduría personal y conexión con verdades universales',
    10: 'construcción de reputación auténtica y contribución al mundo',
    11: 'realización de visiones grupales y manifestación de ideales',
    12: 'disolución del ego separativo y servicio transpersonal'
  };
  return deepThemes[house] || 'desarrollo específico de la conciencia';
}

function getHouseTraditional(house: number): string {
  const traditional: { [key: number]: string } = {
    1: 'la personalidad, el cuerpo físico y las primeras impresiones',
    2: 'las posesiones, el dinero y los recursos materiales',
    3: 'los hermanos, los viajes cortos y la comunicación cotidiana',
    4: 'el hogar, la madre y las raíces familiares',
    5: 'los hijos, el romance y los placeres creativos',
    6: 'el trabajo diario, la salud y los empleados',
    7: 'el matrimonio, los socios y los enemigos abiertos',
    8: 'la muerte, las herencias y el dinero de otros',
    9: 'la religión, los viajes largos y la educación superior',
    10: 'la carrera, el padre y la reputación pública',
    11: 'los amigos, los grupos y las esperanzas',
    12: 'los enemigos ocultos, las instituciones y el karma'
  };
  return traditional[house] || 'área tradicional de la experiencia humana';
}

function getHousePsychological(house: number): string {
  const psychological: { [key: number]: string } = {
    1: 'el desarrollo del ego consciente y la máscara social',
    2: 'la seguridad básica y el sentido de valor personal',
    3: 'la función adaptativa y la comunicación con el entorno',
    4: 'la base emocional inconsciente y los patrones familiares',
    5: 'la expresión creativa del ego y la individualidad única',
    6: 'la función de mantenimiento y los hábitos de vida',
    7: 'la proyección del ánima/ánimus y la función relacional',
    8: 'los procesos de muerte-renacimiento psicológico',
    9: 'la función de búsqueda de significado y expansión mental',
    10: 'la realización del potencial personal y la autoridad social',
    11: 'la función social grupal y la realización de ideales',
    12: 'la disolución del ego y la conexión con el inconsciente colectivo'
  };
  return psychological[house] || 'área específica del desarrollo psicológico';
}

// 🎓 FUNCIÓN PRINCIPAL DE EXPORTACIÓN PARA INTEGRAR CON EL SISTEMA EXISTENTE
export async function integrateEducationalSystem(
  natalChart: DetailedNatalChart,
  progressedChart?: DetailedProgressedChart,
  userProfile?: UserProfile,
  specificEvent?: any
): Promise<{
  natalEducational?: EducationalInterpretation;
  progressedComparison?: any;
  eventEducational?: EducationalInterpretation;
  integrationAdvice: string;
}> {
  
  const results: any = {};
  
  // 🌟 INTERPRETACIÓN NATAL EDUCATIVA
  if (natalChart && userProfile) {
    results.natalEducational = await generateEducationalNatalInterpretation(natalChart, userProfile);
    console.log('✅ Interpretación natal educativa generada');
  }
  
  // 🌙 COMPARACIÓN PROGRESADA EDUCATIVA
  if (natalChart && progressedChart && userProfile) {
    results.progressedComparison = await generateEducationalProgressedComparison(
      natalChart, 
      progressedChart, 
      userProfile
    );
    console.log('✅ Comparación progresada educativa generada');
  }
  
  // 🎯 EVENTO ESPECÍFICO EDUCATIVO
  if (specificEvent && natalChart && userProfile) {
    if (progressedChart) {
      results.eventEducational = await generateEducationalEventInterpretation(
        specificEvent,
        natalChart,
        progressedChart,
        userProfile
      );
    } else {
      // Fallback si no hay carta progresada - crear una carta progresada básica
      const mockProgressedChart: DetailedProgressedChart = {
        sol_progresado: natalChart.sol,
        luna_progresada: natalChart.luna,
        aspectos_natales_progresados: [],
        currentAge: userProfile.currentAge,
        isMockData: true
      };
      results.eventEducational = await generateEducationalEventInterpretation(
        specificEvent,
        natalChart,
        mockProgressedChart,
        userProfile
      );
    }
    console.log('✅ Interpretación de evento educativa generada');
  }
  
  // 🔗 CONSEJO DE INTEGRACIÓN GENERAL
  results.integrationAdvice = generateIntegrationAdvice(natalChart, progressedChart, userProfile);
  
  return results;
}

// 🔗 GENERAR CONSEJO DE INTEGRACIÓN GENERAL
function generateIntegrationAdvice(
  natalChart: DetailedNatalChart, 
  progressedChart?: DetailedProgressedChart, 
  userProfile?: UserProfile
): string {
  const userName = userProfile?.name || 'Usuario';
  const userAge = userProfile?.currentAge || 30;
  const sunSign = natalChart.sol.sign;
  const moonSign = natalChart.luna.sign;
  
  if (progressedChart) {
    return `${userName}, a los ${userAge} años, tu camino evolutivo combina tu esencia natal ${sunSign}-${moonSign} con tu desarrollo progresado hacia ${progressedChart.sol_progresado.sign}-${progressedChart.luna_progresada.sign}.

🎯 ESTRATEGIA DE INTEGRACIÓN MAESTRA:
1. MANTÉN TU BASE: Tu ${sunSign}-${moonSign} natal es tu fundamento eterno - nunca lo abandones
2. ABRAZA TU EVOLUCIÓN: Permite que tu crecimiento hacia ${progressedChart.sol_progresado.sign}-${progressedChart.luna_progresada.sign} enriquezca, no reemplace, tu esencia
3. SÍNTESIS CREATIVA: Crea una expresión única que sea auténticamente tuya - ni puro natal ni puro progresado
4. SERVICIO EVOLUTIVO: Usa tu experiencia de crecimiento para ayudar a otros en su propio camino

Tu tarea no es convertirte en alguien diferente, sino en la versión más evolucionada y sabia de quien siempre has sido.`;
  }
  
  return `${userName}, tu carta natal ${sunSign}-${moonSign} contiene todo lo necesario para tu realización personal. 

🌟 ENFOQUE DE DESARROLLO:
1. PROFUNDIZA tu comprensión de tu naturaleza ${sunSign} esencial
2. MADURA tus respuestas emocionales ${moonSign} hacia mayor sabiduría
3. INTEGRA todas las partes de tu carta en una expresión coherente y auténtica
4. SIRVE al mundo desde tu configuración única y genuina

El crecimiento verdadero no viene de cambiar quién eres, sino de convertirte en la versión más plena y consciente de tu naturaleza auténtica.`;
}

// 🚀 FUNCIÓN DE TESTING Y VALIDACIÓN
export function validateEducationalService(): {
  isReady: boolean;
  missingComponents: string[];
  recommendations: string[];
} {
  const missing: string[] = [];
  const recommendations: string[] = [];

  // Verificar dependencias - simplificado ya que no podemos verificar tipos en runtime
  try {
    // Verificar que las funciones principales existen
    if (typeof generateEducationalNatalInterpretation !== 'function') {
      missing.push('Función generateEducationalNatalInterpretation');
    }

    if (typeof generateEducationalProgressedComparison !== 'function') {
      missing.push('Función generateEducationalProgressedComparison');
    }

    if (typeof generateEducationalEventInterpretation !== 'function') {
      missing.push('Función generateEducationalEventInterpretation');
    }

    if (typeof integrateEducationalSystem !== 'function') {
      missing.push('Función integrateEducationalSystem');
    }

  } catch (error) {
    missing.push('Error al verificar funciones del servicio');
  }

  // Recomendaciones de integración
  recommendations.push('Integrar con trainedAssistantService.ts para interpretaciones de IA');
  recommendations.push('Conectar con chartInterpretationsService.ts para interpretaciones básicas');
  recommendations.push('Usar en AgendaAIDisplay.tsx para mostrar interpretaciones educativas');
  recommendations.push('Implementar en natal-chart y solar-return pages');

  return {
    isReady: missing.length === 0,
    missingComponents: missing,
    recommendations
  };
}

console.log('🎓 Educational Interpretation Service loaded successfully');
console.log('📚 Available functions: generateEducationalNatalInterpretation, generateEducationalProgressedComparison, generateEducationalEventInterpretation, integrateEducationalSystem');

// Export por defecto para facilitar la importación
export default {
  generateEducationalNatalInterpretation,
  generateEducationalProgressedComparison, 
  generateEducationalEventInterpretation,
  integrateEducationalSystem,
  validateEducationalService
};