// =============================================================================
// 🌟 CONSTANTES EDUCATIVAS PARA CARTA PROGRESADA
// src/constants/astrology/progressedChartConstants.ts
// =============================================================================

// ✅ SIGNIFICADOS DE PLANETAS PROGRESADOS
export const progressedPlanetMeanings = {
  'Sol': {
    meaning: 'Tu identidad y propósito de vida evolucionando',
    evolution: 'Cómo has desarrollado tu autoestima y liderazgo',
    keywords: ['Identidad', 'Propósito', 'Autoestima', 'Liderazgo', 'Vitalidad'],
    developmentPhases: {
      '0-30': 'Formación de la identidad básica y primeras experiencias de liderazgo',
      '30-60': 'Consolidación del propósito de vida y maduración del ego',
      '60+': 'Sabiduría solar y mentoreo de otros en el desarrollo personal'
    }
  },
  'Luna': {
    meaning: 'Tus emociones y necesidades internas cambiando',
    evolution: 'La evolución de tus patrones emocionales y hogar interior',
    keywords: ['Emociones', 'Intuición', 'Hogar', 'Familia', 'Seguridad'],
    developmentPhases: {
      '0-30': 'Establecimiento de patrones emocionales y necesidades de seguridad',
      '30-60': 'Maduración emocional y redefinición del concepto de hogar',
      '60+': 'Sabiduría emocional y capacidad de nutrir a otros'
    }
  },
  'Mercurio': {
    meaning: 'Tu forma de pensar y comunicarte transformándose',
    evolution: 'Cómo ha crecido tu capacidad mental y expresión',
    keywords: ['Comunicación', 'Pensamiento', 'Aprendizaje', 'Curiosidad', 'Adaptabilidad'],
    developmentPhases: {
      '0-30': 'Desarrollo del pensamiento lógico y habilidades de comunicación básicas',
      '30-60': 'Refinamiento intelectual y especialización en áreas de interés',
      '60+': 'Sabiduría comunicativa y capacidad de enseñar'
    }
  },
  'Venus': {
    meaning: 'Tus valores, amor y creatividad madurando',
    evolution: 'La evolución de tus relaciones y sentido estético',
    keywords: ['Amor', 'Belleza', 'Valores', 'Relaciones', 'Creatividad'],
    developmentPhases: {
      '0-30': 'Exploración del amor y establecimiento de valores personales',
      '30-60': 'Refinamiento estético y relaciones más maduras',
      '60+': 'Amor universal y expresión artística madura'
    }
  },
  'Marte': {
    meaning: 'Tu energía, ambición y forma de actuar desarrollándose',
    evolution: 'Cómo has canalizado tu fuerza vital y determinación',
    keywords: ['Acción', 'Energía', 'Ambición', 'Coraje', 'Competitividad'],
    developmentPhases: {
      '0-30': 'Aprendizaje del uso constructivo de la energía y la agresión',
      '30-60': 'Canalización madura de la ambición hacia metas significativas',
      '60+': 'Sabiduría en la acción y liderazgo inspirador'
    }
  },
  'Júpiter': {
    meaning: 'Tu sabiduría y búsqueda de significado expandiéndose',
    evolution: 'El crecimiento de tu filosofía de vida y búsqueda de verdad',
    keywords: ['Sabiduría', 'Expansión', 'Filosofía', 'Justicia', 'Optimismo'],
    developmentPhases: {
      '0-30': 'Formación de creencias y búsqueda inicial de significado',
      '30-60': 'Expansión de horizontes y desarrollo de sabiduría práctica',
      '60+': 'Maestría filosófica y capacidad de guiar a otros'
    }
  },
  'Saturno': {
    meaning: 'Tu disciplina y estructura interna madurando',
    evolution: 'Cómo has desarrollado responsabilidad y autoridad personal',
    keywords: ['Disciplina', 'Responsabilidad', 'Estructura', 'Autoridad', 'Paciencia'],
    developmentPhases: {
      '0-30': 'Aprendizaje de límites y desarrollo de disciplina básica',
      '30-60': 'Construcción de autoridad y asunción de responsabilidades mayores',
      '60+': 'Maestría en la disciplina y sabiduría estructural'
    }
  }
};

// ✅ EDUCACIÓN SOBRE PROGRESIONES
export const progressedChartEducation = {
  conceptoBasico: {
    titulo: '¿Qué es una Carta Progresada?',
    descripcion: `Tu carta progresada muestra cómo has evolucionado internamente desde tu nacimiento. 
    Mientras que tu carta natal es tu "semilla cósmica", la progresada es tu "árbol crecido".`,
    analogias: [
      'Carta Natal = Semilla con todo el potencial',
      'Carta Progresada = Árbol que ha crecido con el tiempo',
      'Natal = Plano arquitectónico de tu alma',
      'Progresada = Casa construida con experiencia'
    ]
  },
  
  metodoCalculo: {
    titulo: 'Método de Cálculo',
    descripcion: 'Cada día después de tu nacimiento = 1 año de tu vida',
    ejemplos: [
      'Si tienes 25 años → carta para el día 25 después de nacer',
      'Si tienes 50 años → carta para el día 50 después de nacer',
      'Es como si el cosmos "envejeciera" un año por cada día'
    ],
    importante: 'Este método se basa en el movimiento natural de los planetas y refleja tu evolución interna'
  },
  
  diferenciaClave: {
    natal: {
      descripcion: 'Tu potencial y características innatas',
      representa: ['Temperamento básico', 'Talentos naturales', 'Desafíos kármicos', 'Misión del alma'],
      preguntasClave: ['¿Quién soy?', '¿Cuál es mi propósito?', '¿Qué vine a aprender?']
    },
    progresada: {
      descripcion: 'Cómo has desarrollado ese potencial',
      representa: ['Evolución personal', 'Maduración emocional', 'Desarrollo de talentos', 'Integración de experiencias'],
      preguntasClave: ['¿Cómo he crecido?', '¿Qué he desarrollado?', '¿En qué me he convertido?']
    }
  },
  
  utilidades: [
    'Entender tu evolución personal a lo largo de los años',
    'Ver patrones de crecimiento y desarrollo',
    'Identificar timing de cambios internos importantes',
    'Integrar nuevas facetas de tu personalidad',
    'Comprender ciclos de maduración emocional',
    'Reconocer el desarrollo de tus talentos'
  ]
};

// ✅ FASES DE VIDA ASTROLÓGICAS
export const lifePhases = {
  juventud: {
    rango: '0-29 años',
    titulo: 'Formación y Exploración',
    descripcion: 'Desarrollo de la personalidad básica y exploración del mundo',
    planetasActivos: ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte'],
    temasClave: ['Identidad', 'Educación', 'Primeras relaciones', 'Carrera inicial'],
    desarrolloProgresado: 'Los planetas personales muestran su primera maduración'
  },
  
  adultoJoven: {
    rango: '30-59 años',
    titulo: 'Consolidación y Expansión',
    descripcion: 'Establecimiento en la vida y desarrollo de sabiduría práctica',
    planetasActivos: ['Júpiter', 'Saturno'],
    temasClave: ['Carrera consolidada', 'Relaciones maduras', 'Responsabilidades', 'Expansión'],
    desarrolloProgresado: 'Los planetas sociales guían el crecimiento y la responsabilidad'
  },
  
  madurez: {
    rango: '60+ años',
    titulo: 'Sabiduría y Trascendencia',
    descripcion: 'Integración de experiencias y desarrollo de sabiduría universal',
    planetasActivos: ['Urano', 'Neptuno', 'Plutón'],
    temasClave: ['Sabiduría', 'Mentoreo', 'Legado', 'Espiritualidad'],
    desarrolloProgresado: 'Los planetas transpersonales revelan el propósito más profundo'
  }
};

// ✅ SIGNIFICADOS DE ASPECTOS PROGRESADOS
export const progressedAspectMeanings = {
  conjuncion: {
    simbolo: '☌',
    significado: 'Fusión y nueva síntesis',
    desarrollo: 'Dos partes de tu personalidad se han unido para crear algo nuevo',
    energia: 'Intensidad, nuevo comienzo, potencial concentrado'
  },
  
  sextil: {
    simbolo: '⚹',
    significado: 'Oportunidad y cooperación',
    desarrollo: 'Has desarrollado la habilidad de integrar estas energías de forma armoniosa',
    energia: 'Facilidad, oportunidad, talento natural desarrollado'
  },
  
  cuadratura: {
    simbolo: '□',
    significado: 'Tensión creativa y crecimiento',
    desarrollo: 'La tensión entre estas energías te ha hecho crecer y evolucionar',
    energia: 'Desafío, crecimiento, fuerza desarrollada a través del conflicto'
  },
  
  trigono: {
    simbolo: '△',
    significado: 'Fluidez y talento natural',
    desarrollo: 'Has desarrollado una capacidad natural para expresar estas energías',
    energia: 'Armonía, talento, expresión fluida y natural'
  },
  
  oposicion: {
    simbolo: '☍',
    significado: 'Equilibrio y integración',
    desarrollo: 'Has aprendido a equilibrar estas fuerzas opuestas en tu vida',
    energia: 'Polaridad, equilibrio, integración de opuestos'
  }
};

// ✅ TOOLTIPS EDUCATIVOS
export const progressedTooltips = {
  education: 'Las progresiones muestran tu evolución interna desde el nacimiento usando el método "un día = un año"',
  
  comparison: 'Compara tu carta natal (potencial innato) con la progresada (desarrollo alcanzado) para ver tu crecimiento',
  
  aspects: 'Los aspectos progresados son nuevas dinámicas internas que has desarrollado. No estaban activas al nacer pero han emergido con tu maduración',
  
  houses: 'Las casas muestran las áreas de vida donde se manifiestan estos cambios evolutivos internos',
  
  planets: 'Cada planeta progresado representa cómo esa función psicológica ha evolucionado desde tu nacimiento',
  
  timing: 'El timing de las progresiones revela cuándo ocurren los cambios internos más significativos',
  
  elements: 'La distribución elemental progresada muestra cómo ha cambiado tu temperamento básico',
  
  modalities: 'Las modalidades progresadas indican cómo ha evolucionado tu forma de actuar en el mundo'
};

// ✅ CICLOS EVOLUTIVOS IMPORTANTES
export const evolutionaryCycles = {
  lunaProgresada: {
    ciclo: '27-29 años',
    nombre: 'Retorno Lunar Progresado',
    significado: 'La Luna progresada vuelve a su posición natal',
    descripcion: 'Momento de renovación emocional y nuevo ciclo de crecimiento interior',
    temas: ['Renovación emocional', 'Nuevo hogar interior', 'Ciclo femenino', 'Intuición madura']
  },
  
  solProgresado: {
    ciclo: '30 años aprox',
    nombre: 'Cambio de Signo Solar',
    significado: 'El Sol progresado cambia de signo zodiacal',
    descripcion: 'Transformación profunda de la identidad y propósito de vida',
    temas: ['Nueva identidad', 'Propósito renovado', 'Liderazgo diferente', 'Vitalidad transformada']
  },
  
  retornoSaturno: {
    ciclo: '29.5 años',
    nombre: 'Retorno de Saturno',
    significado: 'Saturno vuelve a su posición natal (tránsito)',
    descripcion: 'Crisis de maduración y asunción de responsabilidades adultas',
    temas: ['Maduración', 'Responsabilidad', 'Estructura de vida', 'Autoridad personal']
  }
};

// ✅ GUÍAS INTERPRETATIVAS POR EDAD
export const ageInterpretationGuides = {
  '0-7': {
    fase: 'Infancia Astrológica',
    planetaDominante: 'Luna',
    desarrollo: 'Formación de la base emocional y vínculos primarios',
    progresiones: 'Los planetas apenas han comenzado su viaje progresado'
  },
  
  '7-14': {
    fase: 'Despertar Mental',
    planetaDominante: 'Mercurio',
    desarrollo: 'Desarrollo del pensamiento lógico y comunicación',
    progresiones: 'Mercurio progresado puede cambiar de signo, alterando el estilo mental'
  },
  
  '14-21': {
    fase: 'Despertar Emocional y Social',
    planetaDominante: 'Venus',
    desarrollo: 'Primeras relaciones amorosas y desarrollo estético',
    progresiones: 'Venus progresado influye en los valores y relaciones tempranas'
  },
  
  '21-28': {
    fase: 'Afirmación Personal',
    planetaDominante: 'Marte',
    desarrollo: 'Desarrollo de la voluntad y capacidad de acción',
    progresiones: 'Marte progresado muestra cómo se ha desarrollado la asertividad'
  },
  
  '29-35': {
    fase: 'Primera Maduración',
    planetaDominante: 'Sol',
    desarrollo: 'Crisis de los 30 y redefinición del propósito',
    progresiones: 'Retorno de Saturno y posible cambio de signo del Sol progresado'
  },
  
  '35-42': {
    fase: 'Expansión Jupiteriana',
    planetaDominante: 'Júpiter',
    desarrollo: 'Búsqueda de significado y expansión de horizontes',
    progresiones: 'Las progresiones muestran la evolución de la sabiduría personal'
  },
  
  '42-49': {
    fase: 'Crisis de Medio Camino',
    planetaDominante: 'Urano (tránsito)',
    desarrollo: 'Cuestionamiento profundo y necesidad de cambio',
    progresiones: 'Los planetas progresados revelan cambios internos profundos'
  },
  
  '49+': {
    fase: 'Sabiduría y Trascendencia',
    planetaDominante: 'Neptuno/Plutón',
    desarrollo: 'Integración de experiencias y desarrollo espiritual',
    progresiones: 'Las progresiones muestran la síntesis final de la personalidad'
  }
};

export default {
  progressedPlanetMeanings,
  progressedChartEducation,
  lifePhases,
  progressedAspectMeanings,
  progressedTooltips,
  evolutionaryCycles,
  ageInterpretationGuides
};