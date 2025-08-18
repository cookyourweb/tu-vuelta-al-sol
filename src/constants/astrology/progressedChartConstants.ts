// src/constants/astrology/progressedChartConstants.ts
// Constantes específicas para carta progresada con enfoque evolutivo

// =============================================================================
// SIGNIFICADOS EVOLUTIVOS DE PLANETAS PROGRESADOS
// =============================================================================

export interface ProgressedPlanetMeaning {
  evolutiveRole: string;
  currentPhase: string;
  lifeAreas: string[];
  keywords: string;
  timeframe: string;
}

export const progressedPlanetMeanings: Record<string, ProgressedPlanetMeaning> = {
  'Sol': {
    evolutiveRole: 'Evolución de tu identidad y propósito de vida',
    currentPhase: 'Tu esencia más auténtica está madurando hacia nuevas formas de autoexpresión y liderazgo',
    lifeAreas: ['Identidad personal', 'Autoestima', 'Creatividad', 'Liderazgo', 'Propósito vital'],
    keywords: 'Madurez, Autenticidad, Propósito, Creatividad, Liderazgo',
    timeframe: 'Cambios graduales durante 30 años aproximadamente por signo'
  },
  'Luna': {
    evolutiveRole: 'Transformación de tus necesidades emocionales y hogar interno',
    currentPhase: 'Tu mundo emocional y forma de sentir seguridad están evolucionando hacia nuevos patrones',
    lifeAreas: ['Emociones', 'Hogar', 'Familia', 'Intuición', 'Necesidades básicas'],
    keywords: 'Sensibilidad, Hogar, Intuición, Cuidado, Emociones',
    timeframe: 'Ciclo completo de 28 años - el más rápido de todos'
  },
  'Mercurio': {
    evolutiveRole: 'Evolución de tu forma de pensar y comunicarte',
    currentPhase: 'Tu mente está desarrollando nuevas formas de procesar información y expresar ideas',
    lifeAreas: ['Comunicación', 'Aprendizaje', 'Escritura', 'Tecnología', 'Hermanos'],
    keywords: 'Comunicación, Aprendizaje, Agilidad mental, Adaptabilidad',
    timeframe: 'Cambios cada 25-30 años por signo'
  },
  'Venus': {
    evolutiveRole: 'Transformación de tus valores, amor y estética',
    currentPhase: 'Tu forma de amar, valorar y crear belleza está madurando hacia nuevas expresiones',
    lifeAreas: ['Amor', 'Relaciones', 'Arte', 'Dinero', 'Valores', 'Belleza'],
    keywords: 'Amor, Belleza, Valores, Armonía, Creatividad artística',
    timeframe: 'Evolución cada 25-30 años por signo'
  },
  'Marte': {
    evolutiveRole: 'Evolución de tu energía vital y forma de actuar',
    currentPhase: 'Tu manera de usar la energía y enfrentar desafíos está desarrollándose hacia nuevos enfoques',
    lifeAreas: ['Acción', 'Energía', 'Sexualidad', 'Competitividad', 'Coraje'],
    keywords: 'Acción, Energía, Coraje, Impulso, Determinación',
    timeframe: 'Cambios cada 22-25 años por signo'
  },
  'Júpiter': {
    evolutiveRole: 'Expansión de tu sabiduría y visión del mundo',
    currentPhase: 'Tu filosofía de vida y búsqueda de significado están expandiéndose hacia nuevos horizontes',
    lifeAreas: ['Filosofía', 'Viajes', 'Educación superior', 'Religión', 'Justicia'],
    keywords: 'Sabiduría, Expansión, Optimismo, Filosofía, Abundancia',
    timeframe: 'Evolución muy lenta - aproximadamente 12 años por signo'
  },
  'Saturno': {
    evolutiveRole: 'Maduración de tu estructura personal y responsabilidades',
    currentPhase: 'Tu sentido de disciplina y autoridad están cristalizando en nuevas formas de maestría',
    lifeAreas: ['Disciplina', 'Carrera', 'Autoridad', 'Tiempo', 'Límites'],
    keywords: 'Disciplina, Responsabilidad, Maestría, Autoridad, Perseverancia',
    timeframe: 'Cambios muy lentos - aproximadamente 30 años por signo'
  },
  'Urano': {
    evolutiveRole: 'Despertar de tu originalidad y libertad',
    currentPhase: 'Tu necesidad de independencia y innovación está manifestándose en nuevas áreas de vida',
    lifeAreas: ['Innovación', 'Libertad', 'Tecnología', 'Amistad', 'Revolución personal'],
    keywords: 'Originalidad, Libertad, Innovación, Rebeldía, Genialidad',
    timeframe: 'Evolución ultra-lenta - aproximadamente 84 años por signo'
  },
  'Neptuno': {
    evolutiveRole: 'Disolución de ilusiones y despertar espiritual',
    currentPhase: 'Tu conexión espiritual y capacidad de trascendencia están refinándose hacia mayor claridad',
    lifeAreas: ['Espiritualidad', 'Arte', 'Compasión', 'Intuición', 'Servicio'],
    keywords: 'Espiritualidad, Compasión, Intuición, Arte, Trascendencia',
    timeframe: 'Evolución generacional - aproximadamente 165 años por signo'
  },
  'Plutón': {
    evolutiveRole: 'Transformación profunda del alma',
    currentPhase: 'Tu poder personal y capacidad de regeneración están emergiendo en nuevas dimensiones de vida',
    lifeAreas: ['Transformación', 'Poder', 'Psicología', 'Muerte-renacimiento', 'Recursos compartidos'],
    keywords: 'Transformación, Poder, Regeneración, Profundidad, Renacimiento',
    timeframe: 'Evolución ultra-lenta - hasta 248 años por signo'
  }
};

// =============================================================================
// EXPLICACIONES SOBRE QUÉ ES UNA CARTA PROGRESADA
// =============================================================================

export const progressedChartEducation = {
  mainConcept: {
    title: "¿Qué es tu Carta Progresada?",
    explanation: "Tu carta progresada muestra cómo has evolucionado internamente desde el día que naciste. Mientras tu carta natal es tu 'semilla original', la progresada es tu 'crecimiento actual'.",
    analogy: "Si tu carta natal es el ADN de tu personalidad, la carta progresada es cómo ese ADN se está expresando ahora, después de años de experiencias y crecimiento."
  },
  
  howItWorks: {
    title: "¿Cómo funciona la progresión?",
    method: "Cada día después de tu nacimiento equivale a un año de tu vida (1 día = 1 año)",
    example: "Si naciste el 10/02/1974 y ahora tienes 51 años, tu carta progresada se calcula para el 2/04/1974 (51 días después)",
    timeframe: "Para tu año solar actual (de cumpleaños a cumpleaños)"
  },
  
  differences: {
    title: "Diferencias clave con tu Carta Natal",
    natal: {
      what: "Carta Natal",
      represents: "Tu personalidad base, talentos innatos, desafíos de nacimiento",
      changes: "NUNCA cambia - es tu configuración original",
      use: "Para entender tu esencia, propósito y potencial de vida"
    },
    progressed: {
      what: "Carta Progresada", 
      represents: "Tu evolución actual, madurez emocional, nuevas fases de vida",
      changes: "Cambia constantemente - refleja tu crecimiento interno",
      use: "Para entender qué está emergiendo en ti AHORA"
    }
  },
  
  interpretation: {
    title: "Cómo interpretar las diferencias",
    sameSign: "Si un planeta progresado está en el mismo signo que natal = estás profundizando esas cualidades",
    differentSign: "Si cambió de signo = estás desarrollando nuevas facetas de esa energía planetaria",
    newAspects: "Nuevos aspectos = nuevas dinámicas internas están emergiendo",
    dissolvedAspects: "Aspectos que se disuelven = viejos patrones están siendo superados"
  }
};

// =============================================================================
// FASES DE VIDA SEGÚN PROGRESIONES
// =============================================================================

export const lifePhases = {
  youngAdult: {
    ageRange: "18-30 años",
    description: "Primeras progresiones significativas - especialmente Luna progresada",
    focus: "Desarrollo emocional, primeras relaciones importantes, definición de identidad"
  },
  earlyMaturity: {
    ageRange: "30-40 años", 
    description: "Progresiones del Sol y planetas personales más evidentes",
    focus: "Consolidación profesional, relaciones estables, madurez emocional"
  },
  midlife: {
    ageRange: "40-50 años",
    description: "Posibles cambios significativos especialmente en planetas rápidos", 
    focus: "Replanteamiento de valores, posibles crisis de crecimiento, nuevas direcciones"
  },
  matureWisdom: {
    ageRange: "50+ años",
    description: "Progresiones más sutiles pero profundas - sabiduría acumulada",
    focus: "Integración de experiencias, enseñanza, legado, espiritualidad"
  }
};

// =============================================================================
// ASPECTOS PROGRESADOS - SIGNIFICADOS EVOLUTIVOS
// =============================================================================

export const progressedAspectMeanings = {
  forming: {
    title: "Aspectos que se Forman",
    meaning: "Nuevas dinámicas internas que están emergiendo en tu personalidad",
    significance: "Representan nuevas habilidades, desafíos o oportunidades que estás desarrollando"
  },
  exact: {
    title: "Aspectos Exactos", 
    meaning: "Dinámicas que están en su punto de máxima influencia",
    significance: "Período de máxima intensidad para integrar estas energías"
  },
  separating: {
    title: "Aspectos que se Separan",
    meaning: "Dinámicas que están perdiendo intensidad o siendo superadas",
    significance: "Patrones que estás dejando atrás o integrando definitivamente"
  }
};

// =============================================================================
// COLORES ESPECÍFICOS PARA PROGRESIONES
// =============================================================================

export const progressedColors = {
  natalPlanets: '#3B82F6', // Azul para planetas natales (referencia)
  progressedPlanets: '#EF4444', // Rojo para planetas progresados (actuales)
  newAspects: '#10B981', // Verde para aspectos nuevos
  dissolvedAspects: '#F59E0B', // Ámbar para aspectos que se disuelven
  stableAspects: '#8B5CF6' // Púrpura para aspectos que permanecen
};

// =============================================================================
// TOOLTIPS EDUCATIVOS ESPECÍFICOS
// =============================================================================

export const progressedTooltips = {
  planetDifference: (natalSign: string, progressedSign: string, planetName: string) => {
    if (natalSign === progressedSign) {
      return `Tu ${planetName} sigue en ${natalSign} - estás profundizando y madurando estas cualidades naturales.`;
    } else {
      return `Tu ${planetName} ha evolucionado de ${natalSign} a ${progressedSign} - estás desarrollando nuevas facetas de esta energía.`;
    }
  },
  
  ageRelevance: (ageAtStart: number) => {
    if (ageAtStart < 30) return "Estás en una fase de desarrollo de identidad y exploración emocional.";
    if (ageAtStart < 45) return "Estás en una fase de consolidación y madurez de tus valores.";
    if (ageAtStart < 60) return "Estás en una fase de replanteamiento y posibles nuevas direcciones.";
    return "Estás en una fase de sabiduría acumulada e integración de experiencias.";
  },
  
  timeRelevance: "Esta carta progresada es específica para tu año solar actual - desde tu último cumpleaños hasta el próximo."
}