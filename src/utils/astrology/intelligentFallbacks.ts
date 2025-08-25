// src/utils/astrology/intelligentFallbacks.ts
// SISTEMA DE FALLBACKS INTELIGENTES PARA REDUCIR COSTOS IA
// Estrategia: 100% de interpretaciones locales, 0% costos IA

import type { 
  AstrologicalEvent, 
  PersonalizedInterpretation, 
  UserProfile,
  ActionPlan 
} from '@/types/astrology/unified-types';

// ==========================================
// BASE DE CONOCIMIENTO ASTROLÓGICO LOCAL
// ==========================================

const PLANETARY_MEANINGS: Record<string, {
  base: string;
  keywords: string[];
  themes: Record<string, string>;
}> = {
  'Sol': {
    base: 'identidad, ego, propósito vital, creatividad, autoridad',
    keywords: ['brillar', 'liderar', 'crear', 'expresar', 'iluminar'],
    themes: {
      activation: 'MOMENTO ÉPICO DE ACTIVACIÓN SOLAR',
      transit: 'El Sol activa tu poder personal',
      retrograde: 'Reflexión sobre tu verdadero yo',
      aspect: 'Tu esencia se conecta con nuevas energías'
    }
  },
  'Luna': {
    base: 'emociones, intuición, hogar, madre, ciclos',
    keywords: ['sentir', 'nutrir', 'intuir', 'proteger', 'fluir'],
    themes: {
      nueva: 'PORTAL DE SIEMBRA EMOCIONAL',
      llena: 'MOMENTO DE PLENITUD Y LIBERACIÓN',
      creciente: 'Crecimiento de tus emociones',
      menguante: 'Soltar patrones emocionales'
    }
  },
  'Mercurio': {
    base: 'comunicación, mente, aprendizaje, viajes cortos',
    keywords: ['comunicar', 'aprender', 'conectar', 'analizar', 'intercambiar'],
    themes: {
      directo: 'Claridad mental y comunicativa',
      retrograde: 'REVOLUCIÓN COMUNICATIVA INTERIOR',
      aspect: 'Nuevas formas de pensar y comunicar'
    }
  },
  'Venus': {
    base: 'amor, belleza, valores, dinero, placer',
    keywords: ['amar', 'valorar', 'disfrutar', 'crear belleza', 'armonizar'],
    themes: {
      directo: 'Armonía en amor y recursos',
      retrograde: 'Revisión de valores y relaciones',
      aspect: 'Nuevas formas de amar y valorar'
    }
  },
  'Marte': {
    base: 'acción, energía, guerra, pasión, iniciativa',
    keywords: ['actuar', 'luchar', 'iniciar', 'conquistar', 'defender'],
    themes: {
      directo: 'MOMENTO DE ACCIÓN Y CONQUISTA',
      retrograde: 'Reflexión sobre tu fuerza interior',
      aspect: 'Nuevas formas de usar tu energía'
    }
  },
  'Júpiter': {
    base: 'expansión, sabiduría, abundancia, filosofía',
    keywords: ['expandir', 'enseñar', 'crecer', 'prosperar', 'filosofar'],
    themes: {
      directo: 'EXPANSIÓN Y ABUNDANCIA ACTIVADA',
      retrograde: 'Sabiduría interior en desarrollo',
      aspect: 'Nuevas oportunidades de crecimiento'
    }
  },
  'Saturno': {
    base: 'disciplina, estructura, límites, maestría, tiempo',
    keywords: ['estructurar', 'disciplinar', 'construir', 'limitar', 'madurar'],
    themes: {
      directo: 'MOMENTO DE CONSTRUCCIÓN SÓLIDA',
      retrograde: 'REVOLUCIÓN DE ESTRUCTURAS INTERNAS',
      aspect: 'Nuevas formas de crear disciplina'
    }
  }
};

const SIGN_PERSONALITIES: Record<string, {
  style: string;
  approach: string;
  challenge: string;
  gift: string;
}> = {
  'Aries': {
    style: 'pionero y directo',
    approach: 'acción inmediata',
    challenge: 'paciencia',
    gift: 'iniciativa'
  },
  'Tauro': {
    style: 'práctico y sensual',
    approach: 'paso a paso',
    challenge: 'flexibilidad',
    gift: 'perseverancia'
  },
  'Géminis': {
    style: 'versátil y comunicativo',
    approach: 'múltiples opciones',
    challenge: 'concentración',
    gift: 'adaptabilidad'
  },
  'Cáncer': {
    style: 'intuitivo y protector',
    approach: 'desde las emociones',
    challenge: 'objetividad',
    gift: 'sensibilidad'
  },
  'Leo': {
    style: 'creativo y generoso',
    approach: 'con dramatismo',
    challenge: 'humildad',
    gift: 'inspiración'
  },
  'Virgo': {
    style: 'analítico y servicial',
    approach: 'mejoramiento continuo',
    challenge: 'perfeccionismo',
    gift: 'precisión'
  },
  'Libra': {
    style: 'diplomático y estético',
    approach: 'buscando equilibrio',
    challenge: 'decisión',
    gift: 'armonización'
  },
  'Escorpio': {
    style: 'intenso y transformativo',
    approach: 'profundidad total',
    challenge: 'control',
    gift: 'regeneración'
  },
  'Sagitario': {
    style: 'expansivo y filosófico',
    approach: 'visión amplia',
    challenge: 'detalles',
    gift: 'sabiduría'
  },
  'Capricornio': {
    style: 'ambicioso y responsable',
    approach: 'metas a largo plazo',
    challenge: 'rigidez',
    gift: 'logro'
  },
  'Acuario': {
    style: 'innovador y humanitario',
    approach: 'desde el futuro',
    challenge: 'emociones',
    gift: 'revolución'
  },
  'Piscis': {
    style: 'compasivo y místico',
    approach: 'fluyendo con la corriente',
    challenge: 'límites',
    gift: 'conexión universal'
  }
};

// ==========================================
// FUNCIÓN PRINCIPAL EXPORTADA
// ==========================================

export function generateCostEffectiveInterpretation(
  event: AstrologicalEvent, 
  userProfile: UserProfile
): PersonalizedInterpretation {
  
  const eventPlanet = event.planet || extractPlanetFromTitle(event.title);
  const eventSign = event.sign || userProfile.astrological?.signs?.sun || 'Aries';
  const eventType = event.type;
  
  const personalizedMeaning = generatePersonalizedMeaning(eventPlanet, eventSign, eventType, userProfile);
  const personalizedAdvice = generatePersonalizedAdvice(eventPlanet, eventSign, userProfile);
  const personalizedMantra = generatePersonalizedMantra(eventPlanet, eventSign, userProfile);
  const personalizedRitual = generatePersonalizedRitual(eventPlanet, eventType, userProfile);
  const actionPlan = generateIntelligentActionPlan(event, userProfile);
  const warningsAndOpportunities = generateWarningsAndOpportunities(eventPlanet, eventSign, userProfile);
  const lifeAreas = generateAffectedLifeAreas(eventPlanet, eventSign, userProfile);

  return {
    meaning: personalizedMeaning,
    lifeAreas,
    advice: personalizedAdvice,
    mantra: personalizedMantra,
    ritual: personalizedRitual,
    actionPlan,
    warningsAndOpportunities
  };
}

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

function extractPlanetFromTitle(title: string): string {
  const planetPatterns = {
    'Sol': /sol|solar/i,
    'Luna': /lun|lunar/i,
    'Mercurio': /mercur/i,
    'Venus': /venus/i,
    'Marte': /marte|mars/i,
    'Júpiter': /júpiter|jupiter/i,
    'Saturno': /saturno/i
  };

  for (const [planet, pattern] of Object.entries(planetPatterns)) {
    if (pattern.test(title)) {
      return planet;
    }
  }

  return 'Sol'; // Default
}

function generatePersonalizedMeaning(
  planet: string, 
  sign: string, 
  eventType: string, 
  user: UserProfile
): string {
  const planetData = PLANETARY_MEANINGS[planet];
  const signData = SIGN_PERSONALITIES[sign];
  const userName = user.name || 'Usuario';
  const userAge = user.nextAge;
  
  if (!planetData) {
    return `Momento cósmico de transformación para ${userName}. A los ${userAge} años, es tiempo de activar tu potencial más profundo.`;
  }

  const baseTheme = planetData.themes[eventType] || planetData.themes['activation'] || planetData.base;
  const signStyle = signData?.style || 'auténtico y poderoso';
  
  return `${baseTheme} para ${userName}. Con tu energía ${signStyle}, este momento te invita a ${planetData.keywords[Math.floor(Math.random() * planetData.keywords.length)]} desde tu verdad más auténtica. A los ${userAge} años, tienes la madurez perfecta para aprovechar esta activación cósmica.`;
}

function generatePersonalizedAdvice(
  planet: string, 
  sign: string, 
  user: UserProfile
): string {
  const planetData = PLANETARY_MEANINGS[planet];
  const signData = SIGN_PERSONALITIES[sign];
  const dominantElement = user.astrological?.dominantElements?.[0] || 'fire';
  
  if (!planetData || !signData) {
    return `CONFÍA EN TU SABIDURÍA INTERIOR. Como ser de elemento ${dominantElement}, tienes acceso a una fuente inagotable de poder personal. Este momento cósmico te invita a brillar desde tu autenticidad.`;
  }

  const approach = signData.approach;
  const challenge = signData.challenge;
  
  return `APROVECHA TU NATURALEZA ${sign.toUpperCase()}. Tu don natural para actuar ${approach} es tu mayor fortaleza ahora. Mantente consciente de tu tendencia hacia ${challenge}, y usa esto como trampolín hacia tu siguiente nivel de evolución. Tu elemento ${dominantElement} te guía hacia la acción correcta.`;
}

function generatePersonalizedMantra(
  planet: string, 
  sign: string, 
  user: UserProfile
): string {
  const planetData = PLANETARY_MEANINGS[planet];
  const dominantElement = user.astrological?.dominantElements?.[0] || 'fire';
  
  const elementMantras: Record<string, string> = {
    fire: 'SOY UNA LLAMA DE PODER Y ACCIÓN CONSCIENTE',
    earth: 'SOY FUERZA SÓLIDA QUE CONSTRUYE REALIDADES',
    air: 'SOY VIENTO DE CAMBIO Y COMUNICACIÓN CLARA',
    water: 'SOY OCÉANO DE SABIDURÍA EMOCIONAL PROFUNDA'
  };

  const planetKeyword = planetData?.keywords?.[0] || 'manifestar';
  
  return `${elementMantras[dominantElement]} - ELIJO ${planetKeyword.toUpperCase()} DESDE MI CENTRO DE PODER`;
}

function generatePersonalizedRitual(
  planet: string, 
  eventType: string, 
  user: UserProfile
): string {
  const dominantElement = user.astrological?.dominantElements?.[0] || 'fire';
  const userName = user.name || 'alma poderosa';
  
  const elementRituals: Record<string, string> = {
    fire: 'Enciende una vela roja y visualiza tu poder interior expandiéndose como llamas doradas',
    earth: 'Sal descalza a la naturaleza y conecta con la fuerza sólida de la Tierra',
    air: 'Realiza 7 respiraciones conscientes mientras escribes tus intenciones al viento',
    water: 'Toma un baño ritual con sal marina visualizando la purificación emocional'
  };

  const eventRituals: Record<string, string> = {
    'lunar_phase': 'bajo la luna nueva, siembra tus intenciones más poderosas',
    'eclipse': 'durante este eclipse, permite que tu alma se transforme completamente',
    'retrograde': 'en este período retrógrado, reflexiona sobre tu evolución interior',
    'solar_activation': 'durante esta activación solar, conecta con tu propósito',
    'lunar_resonance': 'en este momento lunar, honra tus emociones',
    'life_purpose_activation': 'mientras activas tu propósito, visualiza tu misión'
  };

  const baseRitual = elementRituals[dominantElement];
  const specificRitual = eventRituals[eventType];
  
  if (specificRitual) {
    return `${userName}, ${baseRitual} y ${specificRitual}. Termina agradeciendo a tu yo futuro por la transformación que está ocurriendo.`;
  }
  
  return `${userName}, ${baseRitual}. Dedica 11 minutos a conectar con la energía de ${planet} y permite que te guíe hacia tu máximo potencial.`;
}

function generateIntelligentActionPlan(
  event: AstrologicalEvent, 
  user: UserProfile
): ActionPlan[] {
  const dominantElement = user.astrological?.dominantElements?.[0] || 'fire';
  const userAge = user.nextAge;
  const lifeStage = getLifeStage(userAge);
  const planet = event.planet || 'Sol';
  
  const plans: ActionPlan[] = [];
  
  // Acción inmediata basada en elemento dominante
  const immediateActions: Record<string, string> = {
    fire: 'Toma una decisión que has estado posponiendo y actúa inmediatamente',
    earth: 'Organiza un área importante de tu vida que necesita estructura',
    air: 'Inicia una conversación importante que has estado evitando',
    water: 'Dedica tiempo a procesar y expresar una emoción profunda'
  };
  
  plans.push({
    category: 'creatividad',
    action: immediateActions[dominantElement],
    timing: 'inmediato',
    difficulty: 'fácil',
    impact: 'alto'
  });

  // Acción semanal basada en etapa de vida
  const weeklyActions: Record<string, string> = {
    'joven': 'Explora una nueva habilidad que conecte con tu propósito',
    'adulto': 'Fortalece una relación importante en tu vida',
    'maduro': 'Comparte tu sabiduría con alguien que pueda beneficiarse',
    'sabio': 'Crea algo que trascienda y deje un legado positivo'
  };
  
  plans.push({
    category: 'crecimiento',
    action: weeklyActions[lifeStage],
    timing: 'esta_semana',
    difficulty: 'moderado',
    impact: 'alto'
  });

  // Acción mensual personalizada
  const planetActions: Record<string, string> = {
    'Sol': 'Define y declara públicamente un objetivo que refleje tu esencia',
    'Luna': 'Crea un ritual de autocuidado que nutras tu bienestar emocional',
    'Mercurio': 'Aprende algo nuevo que expanda tu forma de comunicarte',
    'Venus': 'Mejora la calidad estética o amorosa de un área de tu vida',
    'Marte': 'Inicia un proyecto que requiera coraje y determinación',
    'Júpiter': 'Expande tus horizontes a través de una nueva experiencia',
    'Saturno': 'Establece una disciplina que construya algo duradero'
  };

  plans.push({
    category: 'crecimiento',
    action: planetActions[planet] || 'Dedica tiempo a reflexionar sobre tu crecimiento personal',
    timing: 'este_mes',
    difficulty: 'desafiante',
    impact: 'alto'
  });

  return plans;
}

function generateWarningsAndOpportunities(
  planet: string, 
  sign: string, 
  user: UserProfile
): { warnings: string[], opportunities: string[] } {
  const signData = SIGN_PERSONALITIES[sign];
  const dominantElement = user.astrological?.dominantElements?.[0];
  
  const warnings = [
    signData?.challenge ? `Cuidado con la tendencia hacia ${signData.challenge}` : 'Mantén el equilibrio en tus decisiones',
    dominantElement === 'fire' ? 'Evita actuar demasiado impulsivamente' :
    dominantElement === 'earth' ? 'No te aferres excesivamente a la rutina' :
    dominantElement === 'air' ? 'Evita dispersarte en demasiadas direcciones' :
    'No te pierdas en las emociones'
  ];

  const opportunities = [
    signData?.gift ? `Aprovecha tu don natural para ${signData.gift}` : 'Confía en tu sabiduría interior',
    `Tu naturaleza ${dominantElement} te permite acceder a fuerzas cósmicas especiales`,
    `Este momento activa aspectos dormidos de tu ${planet} interior`
  ];

  return { warnings, opportunities };
}

function generateAffectedLifeAreas(
  planet: string, 
  sign: string, 
  user: UserProfile
): string[] {
  const planetAreas: Record<string, string[]> = {
    'Sol': ['identidad', 'creatividad', 'liderazgo'],
    'Luna': ['emociones', 'hogar', 'intuición'],
    'Mercurio': ['comunicación', 'aprendizaje', 'hermanos'],
    'Venus': ['amor', 'dinero', 'belleza'],
    'Marte': ['acción', 'sexualidad', 'conflictos'],
    'Júpiter': ['expansión', 'filosofía', 'abundancia'],
    'Saturno': ['disciplina', 'estructura', 'tiempo']
  };

  const userHouses = user.astrological?.houses;
  const areas = planetAreas[planet] || ['crecimiento', 'transformación'];
  
  // Agregar área específica si conocemos la casa del planeta
  if (userHouses) {
    const planetKeyMap: Record<string, keyof typeof userHouses> = {
      'Sol': 'sun',
      'Luna': 'moon',
      'Mercurio': 'mercury',
      'Venus': 'venus',
      'Marte': 'mars'
    };
    const planetKey = planetKeyMap[planet];
    if (planetKey && userHouses[planetKey] !== undefined) {
      const planetHouse = userHouses[planetKey];
      const houseAreas: Record<number, string> = {
        1: 'identidad', 2: 'recursos', 3: 'comunicación', 4: 'hogar',
        5: 'creatividad', 6: 'servicio', 7: 'relaciones', 8: 'transformación',
        9: 'sabiduría', 10: 'carrera', 11: 'grupos', 12: 'trascendencia'
      };
      const houseArea = houseAreas[planetHouse];
      if (houseArea) areas.push(houseArea);
    }
  }

  return areas.slice(0, 3);
}

function getLifeStage(age: number): string {
  if (age < 30) return 'joven';
  if (age < 50) return 'adulto';
  if (age < 70) return 'maduro';
  return 'sabio';
}

// ==========================================
// EXPORTACIONES
// ==========================================

export default {
  generateCostEffectiveInterpretation
};