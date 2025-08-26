// src/utils/astrology/intelligentFallbacks.ts
// SISTEMA DE FALLBACKS INTELIGENTES + DISRUPTIVO Y MOTIVACIONAL
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
// INTERFAZ DISRUPTIVA
// ==========================================

interface DisruptiveInterpretation {
  shockValue: string;
  epicRealization: string;
  whatToExpect: {
    energeticShift: string;
    emotionalWave: string;
    mentalClarity: string;
    physicalSensations: string;
  };
  preparation: {
    ritual: string;
    mindsetShift: string;
    physicalAction: string;
    energeticProtection: string;
  };
  revolutionaryAdvice: {
    doThis: string[];
    avoidThis: string[];
    powerHours: string[];
    dangerZones: string[];
  };
  manifestation: {
    mantra: string;
    visualization: string;
    physicalGesture: string;
    elementalConnection: string;
  };
  expectedTransformation: {
    immediate: string;
    weekly: string;
    longTerm: string;
  };
}

// ==========================================
// FUNCIÓN PRINCIPAL MEJORADA CON ENFOQUE DISRUPTIVO
// ==========================================

export function generateCostEffectiveInterpretation(
  event: AstrologicalEvent, 
  userProfile: UserProfile
): PersonalizedInterpretation {
  
  const eventPlanet = event.planet || extractPlanetFromTitle(event.title);
  const eventSign = event.sign || userProfile.astrological?.signs?.sun || 'Aries';
  const eventType = event.type;
  
  // Detectar si es un retrogrado para usar interpretación disruptiva específica
  if (eventType === 'retrograde' || event.title.toLowerCase().includes('retrógrado')) {
    const retrogradeType = detectRetrogradeType(event.title, eventPlanet);
    if (retrogradeType) {
      const disruptiveInterp = generateRetrogradeInterpretation(retrogradeType, userProfile);
      return convertDisruptiveToPersonalized(disruptiveInterp, event, userProfile);
    }
  }
  
  // Para eventos normales, usar el enfoque disruptivo mejorado
  const personalizedMeaning = generateDisruptiveAdvice(eventPlanet, eventSign, eventType, userProfile);
  const personalizedAdvice = generateDisruptiveAdvice(eventPlanet, eventSign, eventType, userProfile);
  const personalizedMantra = generatePersonalizedMantra(eventPlanet, eventSign, userProfile);
  const personalizedRitual = generateDisruptiveRitual(eventPlanet, eventType, userProfile);
  const actionPlan = generateIntelligentActionPlan(event, userProfile);
  const warningsAndOpportunities = generateDisruptiveWarningsAndOpportunities(eventPlanet, eventSign, userProfile);
  const lifeAreas = generateAffectedLifeAreas(eventPlanet, eventSign, userProfile);

  return {
    meaning: Array.isArray(personalizedMeaning) ? personalizedMeaning.join('\n') : personalizedMeaning,
    lifeAreas,
    advice: personalizedAdvice,
    mantra: personalizedMantra,
    ritual: personalizedRitual,
    actionPlan: [actionPlan],
    warningsAndOpportunities
  };
}

// ==========================================
// INTERPRETACIONES ESPECÍFICAS PARA RETRÓGRADOS
// ==========================================

function generateRetrogradeInterpretation(
  retrogradeType: string,
  userProfile: UserProfile
): DisruptiveInterpretation {
  
  const userName = userProfile.name || 'ALMA PODEROSA';
  
  // MERCURIO RETRÓGRADO
  if (retrogradeType === 'mercury') {
    return {
      shockValue: `[ALERTA] MERCURIO RETRÓGRADO ALERT: ${userName}, aquí vamos otra vez. Ya sabes lo que pasa por estas fechas cada año, ¿verdad?`,
      
      epicRealization: `LA CRUDA REALIDAD: Cada vez que Mercurio retrograda en esta época del año, TU MENTE hace exactamente lo mismo. Empiezas a darle vueltas a cosas del pasado, te pones nostálgica, y SÍ - piensas en el ex. Pero este año va a ser DIFERENTE porque ahora SABES el patrón.`,
      
      whatToExpect: {
        energeticShift: `Los próximos 21 días tu mente será como un playlist en repeat de "recuerdos que creías superados". Con tu naturaleza ${userProfile.astrological?.dominantElements?.[0] || 'aire'}, esto se intensifica x10.`,
        
        emotionalWave: `DÍAS 1-7: Nostalgia intensa. Querrás revisar fotos viejas, stalkear redes sociales, mandar "ese mensaje". DÍAS 8-14: Análisis paralización - darás 500 vueltas a conversaciones de hace años. DÍAS 15-21: Liberación gradual si sigues el plan.`,
        
        mentalClarity: `Tu mente va a querer resolver "conversaciones pendientes" del pasado. Esto se manifiesta como revisión obsesiva de patrones relacionales.`,
        
        physicalSensations: `Posible tensión en mandíbula (pensar de más), dolor de cabeza por las tardes, y esa sensación de "nudo en la garganta" cuando recuerdas ciertas conversaciones.`
      },
      
      preparation: {
        ritual: `RITUAL ANTI-RETRÓGRADO DE PODER:\n[DÍA 1] Escribe TODOS los nombres de personas del pasado que sabes que van a aparecer en tu mente\n[DÍA 2] Al lado de cada nombre, escribe QUÉ aprendiste de esa experiencia\n[DÍA 3] Quema la lista diciendo: "Gracias por las lecciones, ahora elijo mi presente"\n[CADA DÍA] Cuando venga el recuerdo, di en voz alta: "Esto es solo Mercurio retrógrado, no mi verdad actual"`,
        
        mindsetShift: `CAMBIA DE: "¿Y si le escribo? ¿Y si intentamos otra vez?" A: "Mi mente está en modo rewind automático. Estas no son mis verdaderas ganas, es solo el tránsito"`,
        
        physicalAction: `CADA vez que sientas la tentación de contactar a alguien del pasado: haz 20 sentadillas. Literalmente. Cambia la energía mental por física INMEDIATAMENTE.`,
        
        energeticProtection: `Usa algo VERDE (color de Mercurio sanado) y lleva siempre papel y lápiz. Cuando venga la obsesión mental, ESCRÍBELA y luego rómpela. No la guardes en tu cabeza.`
      },
      
      revolutionaryAdvice: {
        doThis: [
          `ESCRIBE todo lo que piensas en lugar de darle vueltas mentalmente`,
          `HAZ copias de seguridad de TODO (archivos, documentos, conversaciones importantes)`,
          `APROVECHA para organizar tu vida digital - borra fotos que te activan nostalgia`,
          `PRACTICA el mantra "Esto es temporal, mis sentimientos actuales son más reales"`,
          `USA este tiempo para PLANIFICAR proyectos futuros, no para revisar el pasado`
        ],
        
        avoidThis: [
          `NO contactes al ex por NINGÚN motivo - ni "para cerrar ciclos" ni "como amigos"`,
          `NO tomes decisiones importantes basadas en nostalgia - espera al directo`,
          `NO interpretes las "señales" como que "el universo te dice algo" - es solo tu mente en rewind`,
          `NO revises conversaciones viejas, fotos juntos, o perfiles de redes sociales`,
          `NO creas que "esta vez será diferente si hablo con esa persona"`
        ],
        
        powerHours: [
          `6-8 AM: Máximo poder para rituales de liberación y escritura terapéutica`,
          `12-2 PM: Momento óptimo para organización digital y limpieza mental`,
          `8-10 PM: Perfecto para planificación futura y visualización de metas`
        ],
        
        dangerZones: [
          `9-11 PM: Hora peligrosa para nostalgia y tentación de contactar al pasado`,
          `Domingos por la tarde: Máxima vulnerabilidad emocional - mantente ocupada`,
          `Días de lluvia o grises: Tu energía lunar se pone más sensible - extra cuidado`
        ]
      },
      
      manifestation: {
        mantra: `"MI PRESENTE ES MÁS PODEROSO QUE MI PASADO. CADA RECUERDO QUE VIENE ES SOLO MI MENTE LIMPIÁNDOSE. ELIJO CREAR NUEVAS MEMORIAS ÉPICAS"`,
        
        visualization: `Te ves parada en una biblioteca gigante llena de libros de tu pasado. Caminas entre los estantes, los observas con cariño pero NO los abres. Al final de la biblioteca hay una puerta dorada brillante etiquetada "MI FUTURO ÉPICO". Cada día del retrógrado, das un paso más hacia esa puerta.`,
        
        physicalGesture: `Cada vez que venga un pensamiento del pasado: pon tu mano en el corazón y di "Gracias por la lección", luego lleva la mano a la frente y di "Ahora elijo mi presente". Literalmente estás moviendo la energía del corazón (emociones) a la mente (decisiones conscientes).`,
        
        elementalConnection: `Conecta con VIENTO/AIRE - tu elemento dominante. Cuando te sientas atascada mentalmente, sal y respira aire fresco conscientemente. El viento se lleva los pensamientos obsesivos.`
      },
      
      expectedTransformation: {
        immediate: `Próximas 48 horas: Una persona del pasado aparecerá en tu mente o incluso te contactará. PERO ahora tienes las herramientas para no caer en el patrón.`,
        
        weekly: `Esta semana: Te darás cuenta de cuánta energía mental desperdiciaras antes en "análisis paralización". Empezarás a usar esa energía para crear en lugar de revisar.`,
        
        longTerm: `Próximos 3 meses: Habrás roto definitivamente el patrón de "volver al pasado" durante retrogrados. Tu mente se volverá una máquina de manifestación futura en lugar de revisión obsesiva.`
      }
    };
  }
  
  // VENUS RETRÓGRADO
  if (retrogradeType === 'venus') {
    return {
      shockValue: `[CORAZÓN] VENUS RETRÓGRADA SEASON: ${userName}, prepárate porque tu corazón va a querer hacer de las suyas. Cada año por estas fechas pasa LO MISMO.`,
      
      epicRealization: `VERDAD BOMBA: Venus retrógrada es como tu examen anual de amor propio. El universo te pone a TODOS los fantasmas del amor enfrente para ver si ya aprendiste a elegirte a TI PRIMERO.`,
      
      whatToExpect: {
        energeticShift: `Tu corazón va a sentir como si estuviera en una montaña rusa emocional. Un día extrañas al ex, al siguiente te sientes libre, al otro día quieres "intentarlo otra vez". Es NORMAL - no eres bipolar, es Venus jugando contigo.`,
        
        emotionalWave: `SEMANA 1-2: "¿Y si vuelvo con...?" SEMANA 3-4: "¿Por qué no me valoro más?" SEMANA 5-6: Claridad sobre lo que REALMENTE quieres en amor. El patrón es predecible, úsalo a tu favor.`,
        
        mentalClarity: `Tu mente va a romantizar relaciones que sabes que no funcionaron. Recordarás solo las partes bonitas y olvidarás por qué terminaron.`,
        
        physicalSensations: `Corazón acelerado al ver ciertas fotos, sensación de vacío en el pecho cuando piensas en "lo que pudo ser", y esa necesidad física de abrazar que te hace vulnerable.`
      },
      
      preparation: {
        ritual: `RITUAL DE INMUNIDAD VENUSINA:\n[AMOR] Crea un altar de AMOR PROPIO con tu foto más radiante en el centro\n[CARTA] Escribe una carta de amor para TI - todo lo que quisieras escuchar\n[DIARIO] Cada mañana, léete esa carta en voz alta frente al espejo\n[PRÁCTICA] Cuando sientas tentación de buscar amor externo, ve al altar y date ese amor TÚ MISMA`,
        
        mindsetShift: `CAMBIA DE: "Necesito que alguien me ame para sentirme completa" A: "Soy un océano de amor, no una copa vacía esperando ser llenada"`,
        
        physicalAction: `CADA vez que quieras mandar un mensaje de "reconciliación": date un baño de lujo, hazte una mascarilla, o cómprate flores. Redirige esa energía de "buscar amor" hacia "darte amor".`,
        
        energeticProtection: `Usa ROSA CUARZO o algo rosa. Y aquí viene lo clave: NO uses ropa que te ponías con el ex, no escuches "su canción", no veas "su película". Tu campo energético está súper sensible.`
      },
      
      revolutionaryAdvice: {
        doThis: [
          `ESCRIBE una lista de cómo te mereces ser amada - léela diariamente`,
          `PLANEA citas contigo misma épicas - museo, spa, restaurante bonito SOLA`,
          `ACTUALIZA tu perfil de citas (si quieres) pero NO para buscar nada serio`,
          `PRACTICA decir NO a planes que no te emocionan al 100%`,
          `INVIERTE en tu belleza y bienestar - nuevas sábanas, ropa que te haga sentir diosa`
        ],
        
        avoidThis: [
          `NO contactes a NINGÚN ex "para ver cómo está" - no estás genuinamente preocupada`,
          `NO aceptes invitaciones de exs que "casualmente" aparecen ahora`,
          `NO hagas cambios drásticos en tu apariencia para "llamar la atención de alguien"`,
          `NO busques validación en aplicaciones de citas o redes sociales`,
          `NO romantices relaciones que terminaron mal - tu mente está editando la realidad`
        ],
        
        powerHours: [
          `7-9 AM: Máximo poder para autocuidado y rituales de amor propio`,
          `3-5 PM: Momento óptimo para actividades que te hagan sentir bella y valorada`,
          `9-10 PM: Perfecto para journaling sobre tus verdaderos deseos en amor`
        ],
        
        dangerZones: [
          `10 PM-12 AM: Hora peligrosa para mensajes nostálgicos - apaga el teléfono`,
          `Viernes y sábados por la noche: Máxima vulnerabilidad - ten un plan`,
          `14 de febrero (si cae en el retrógrado): DÍA DE MÁXIMO PELIGRO - celebra tu amor propio`
        ]
      },
      
      manifestation: {
        mantra: `"SOY EL AMOR QUE BUSCO. MI CORAZÓN ES UN PALACIO Y YO SOY LA REINA. ATRAIGO AMOR QUE HONRA MI VALOR, NO QUE LO CUESTIONA"`,
        
        visualization: `Te ves sentada en un trono dorado en el centro de tu corazón. Tu amor propio es como un sol radiante que sale de tu pecho. Alrededor del trono, todas las versiones de ti que no se valoraron se inclinan ante la REINA que eres ahora.`,
        
        physicalGesture: `Cada mañana, abraza tu cuerpo fuertemente y di "Te amo" 3 veces. Cada noche, pon tu mano en tu corazón y agradece por un acto de amor propio que hiciste ese día.`,
        
        elementalConnection: `Conecta con flores y plantas - símbolo de Venus sanada. Ten flores frescas en tu casa durante todo el retrógrado. Cuando las veas, recuerda que mereces que te regalen flores simplemente por existir.`
      },
      
      expectedTransformation: {
        immediate: `Próximas 72 horas: Un ex o alguien del pasado romántico va a aparecer de alguna forma. PERO vas a elegir tu bienestar por encima de la curiosidad.`,
        
        weekly: `Próximas 2 semanas: Te darás cuenta de patrones en tus relaciones pasadas que nunca habías visto. Esto te dará claridad sobre qué SÍ quieres en el futuro.`,
        
        longTerm: `Próximos 4 meses: Tu estándar en amor se elevará completamente. No volverás a conformarte con migajas emocionales. Te habrás convertido en tu propia pareja más leal.`
      }
    };
  }

  // Fallback disruptivo genérico
  return generateGenericDisruptiveInterpretation(retrogradeType, userProfile);
}

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

function extractPlanetFromTitle(title: string): string {
  const planets = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno'];
  for (const planet of planets) {
    if (title.includes(planet)) return planet;
  }
  return 'Sol';
}

function detectRetrogradeType(title: string, planet: string): string | null {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('mercurio') || planet === 'Mercurio') return 'mercury';
  if (titleLower.includes('venus') || planet === 'Venus') return 'venus';
  if (titleLower.includes('marte') || planet === 'Marte') return 'mars';
  return null;
}

function convertDisruptiveToPersonalized(
  disruptive: DisruptiveInterpretation,
  event: AstrologicalEvent,
  userProfile: UserProfile
): PersonalizedInterpretation {
  return {
    meaning: `${disruptive.shockValue}\n\n${disruptive.epicRealization}`,
    
    lifeAreas: [
      `Energético: ${disruptive.whatToExpect.energeticShift}`,
      `Emocional: ${disruptive.whatToExpect.emotionalWave}`,
      `Mental: ${disruptive.whatToExpect.mentalClarity}`,
      `Físico: ${disruptive.whatToExpect.physicalSensations}`
    ],
    
    advice: [
      ...disruptive.revolutionaryAdvice.doThis.slice(0, 3),
      `Evita: ${disruptive.revolutionaryAdvice.avoidThis[0]}`
    ],
    
    mantra: disruptive.manifestation.mantra,
    
    ritual: disruptive.preparation.ritual,
    
    actionPlan: [{
      timeframe: 'monthly',
      objectives: [
        disruptive.preparation.mindsetShift,
        disruptive.preparation.physicalAction
      ],
      actions: disruptive.revolutionaryAdvice.doThis,
      milestones: [
        `Inmediato: ${disruptive.expectedTransformation.immediate}`,
        `Esta semana: ${disruptive.expectedTransformation.weekly}`,
        `A largo plazo: ${disruptive.expectedTransformation.longTerm}`
      ],
      metrics: ['Estado emocional diario', 'Patrones evitados', 'Nuevas acciones tomadas']
    }],
    
    warningsAndOpportunities: {
      warnings: disruptive.revolutionaryAdvice.dangerZones,
      opportunities: disruptive.revolutionaryAdvice.powerHours
    }
  };
}

function generateGenericDisruptiveInterpretation(
  eventType: string, 
  userProfile: UserProfile
): DisruptiveInterpretation {
  return {
    shockValue: `[ALERTA] ACTIVACIÓN CÓSMICA: ${eventType} está activando frecuencias ÉPICAS en tu campo energético.`,
    epicRealization: `Este momento NO es casualidad. Tu alma programó esta activación cósmica antes de nacer. Es tiempo de DESPERTAR.`,
    whatToExpect: {
      energeticShift: `Tu frecuencia vibracional subirá significativamente en las próximas horas.`,
      emotionalWave: `Emociones profundas pueden surgir - es tu sistema liberando lo que ya no sirve.`,
      mentalClarity: `Tu intuición estará súper activada - confía en los primeros instintos.`,
      physicalSensations: `Posible sensación de energía corriendo por tu cuerpo - es normal y poderoso.`
    },
    preparation: {
      ritual: `Dedica 15 minutos a respirar conscientemente y agradecer a tu yo futuro por esta transformación.`,
      mindsetShift: `Cambia de "algo me pasa" a "algo ÉPICO me está sucediendo".`,
      physicalAction: `Mueve tu cuerpo - baila, camina, estírate. Tu cuerpo necesita procesar la nueva energía.`,
      energeticProtection: `Usa colores que te hagan sentir poderosa y mantén hidratación extra.`
    },
    revolutionaryAdvice: {
      doThis: [`Confía en tu intuición`, `Actúa desde el corazón`, `Mantén mente abierta`],
      avoidThis: [`No te juzgues`, `No resistas el cambio`, `No busques control excesivo`],
      powerHours: [`Mañana temprano`, `Atardecer`],
      dangerZones: [`Mediodía - mantén calma`]
    },
    manifestation: {
      mantra: `SOY UNA FUERZA CÓSMICA DE TRANSFORMACIÓN POSITIVA`,
      visualization: `Te ves rodeada de luz dorada, transformándote en tu versión más poderosa.`,
      physicalGesture: `Lleva ambas manos al corazón y respira profundo 3 veces.`,
      elementalConnection: `Conecta con la naturaleza por al menos 5 minutos.`
    },
    expectedTransformation: {
      immediate: `Mayor claridad sobre tu dirección de vida.`,
      weekly: `Nuevas oportunidades aparecerán de forma inesperada.`,
      longTerm: `Te convertirás en una versión más auténtica y poderosa de ti misma.`
    }
  };
}

// ==========================================
// GENERADORES DE CONTENIDO PERSONALIZADO
// ==========================================

// (Eliminada implementación duplicada de convertDisruptiveToPersonalized)


function generateDisruptiveAdvice(
planet: string, sign: string, eventType: string, userProfile: UserProfile): string[] {
  const advice: string[] = [];
  const planetData = PLANETARY_MEANINGS[planet] || PLANETARY_MEANINGS['Sol'];
  const signData = SIGN_PERSONALITIES[sign] || SIGN_PERSONALITIES['Aries'];
  
  // Consejo basado en planeta
  advice.push(`ACTIVA tu poder de ${planetData.keywords[0]} - es tu momento de ${planetData.keywords[1]} sin límites`);
  
  // Consejo basado en signo
  advice.push(`USA tu naturaleza ${signData.style} como arma secreta - nadie más tiene tu combinación única`);
  
  // Consejo basado en elemento dominante del usuario
  const dominantElement = userProfile.astrological?.dominantElements?.[0] || 'fire';
  const elementAdvice: Record<string, string> = {
    fire: `ENCIENDE tu fuego interior - la acción directa es tu medicina`,
    earth: `CONSTRUYE sobre bases sólidas - tu pragmatismo es oro puro`,
    air: `COMUNICA tu verdad - tus ideas pueden cambiar el mundo`,
    water: `FLUYE con tus emociones - tu intuición nunca falla`
  };
  advice.push(elementAdvice[dominantElement]);
  
  // Consejo personalizado final
  advice.push(`RECUERDA: ${userProfile.name || 'Tú'}, viniste a este planeta a ser EXTRAORDINARIA, no normal`);
  
  return advice;
}

function generatePersonalizedMantra(
  planet: string,
  sign: string,
  userProfile: UserProfile
): string {
  const planetData = PLANETARY_MEANINGS[planet] || PLANETARY_MEANINGS['Sol'];
  const signData = SIGN_PERSONALITIES[sign] || SIGN_PERSONALITIES['Aries'];
  
  return `SOY ${signData.gift.toUpperCase()} PURA. MI ${planetData.keywords[0].toUpperCase()} ES MI SUPERPODER. ABRAZO MI NATURALEZA ${signData.style.toUpperCase()} Y TRANSFORMO TODO EN ORO.`;
}

function generateDisruptiveRitual(
  planet: string,
  eventType: string,
  userProfile: UserProfile
): string {
  const rituals: Record<string, string> = {
    'Sol': `RITUAL SOLAR: Al amanecer, párate frente al sol con brazos abiertos. Visualiza luz dorada entrando por tu corona. Di 3 veces: "Soy luz, soy poder, soy creación"`,
    'Luna': `RITUAL LUNAR: En la noche, báñate con sal marina y pétalos blancos. Mientras el agua corre, suelta 3 cosas que ya no necesitas. La Luna las transformará`,
    'Mercurio': `RITUAL MERCURIAL: Escribe 3 verdades que no has dicho. Léelas en voz alta al viento. Luego escribe 3 mentiras que te has contado y quémalas`,
    'Venus': `RITUAL VENUSINO: Mírate al espejo y declara 7 cosas que amas de ti. Luego date un regalo (flores, chocolate, algo bello). El amor propio activa la magia`,
    'Marte': `RITUAL MARCIANO: Haz ejercicio intenso por 15 minutos mientras repites "Soy fuerza". Luego escribe una acción valiente y comprométete a hacerla HOY`,
    'Júpiter': `RITUAL JUPITERIANO: Dona algo valioso o ayuda a alguien sin esperar nada. La abundancia se multiplica cuando circula. Agradece 12 cosas antes de dormir`,
    'Saturno': `RITUAL SATURNINO: Limpia y organiza un espacio caótico. Mientras lo haces, visualiza ordenando tu vida. Estructura externa = estructura interna`
  };
  
  return rituals[planet] || rituals['Sol'];
}

function generateIntelligentActionPlan(
  event: AstrologicalEvent,
  userProfile: UserProfile
): ActionPlan {
  const planet = event.planet || 'Sol';
  const timeframe = event.type === 'retrograde' ? 'monthly' : 'weekly';
  
  return {
    timeframe,
    objectives: [
      `Integrar la energía de ${planet} en tu vida diaria`,
      `Transformar desafíos en oportunidades de crecimiento`,
      `Elevar tu vibración al siguiente nivel de consciencia`
    ],
    actions: [
      `Medita 10 minutos diarios enfocándote en ${planet}`,
      `Journaling nocturno: "¿Cómo manifesté hoy la energía de ${planet}?"`,
      `Una acción valiente semanal alineada con ${planet}`,
      `Crear un símbolo/amuleto que represente esta energía`
    ],
    milestones: [
      `Día 3: Primera señal de cambio energético`,
      `Semana 1: Patrón viejo identificado y en proceso de liberación`,
      `Semana 2: Nueva rutina establecida`,
      `Mes 1: Transformación visible en área de vida relacionada`
    ],
    metrics: [
      `Nivel de energía diario (1-10)`,
      `Sincronicidades notadas`,
      `Patrones viejos evitados`,
      `Nuevas oportunidades manifestadas`
    ]
  };
}

function generateDisruptiveWarningsAndOpportunities(
  planet: string,
  sign: string,
  userProfile: UserProfile
): { warnings: string[], opportunities: string[] } {
  const warnings: string[] = [];
  const opportunities: string[] = [];
  
  // Warnings basados en planeta
  const planetWarnings: Record<string, string> = {
    'Mercurio': `CUIDADO con malentendidos y tecnología fallando - respaldo TODO`,
    'Venus': `OJO con gastos impulsivos y ex's apareciendo "casualmente"`,
    'Marte': `ALERTA con conflictos innecesarios y accidentes por prisa`,
    'Saturno': `ATENCIÓN a la rigidez excesiva y el pesimismo`
  };
  warnings.push(planetWarnings[planet] || `MANTÉN consciencia elevada - las energías están intensas`);
  
  // Opportunities basadas en signo
  const signOpportunities: Record<string, string> = {
    'Aries': `MOMENTO PERFECTO para iniciar ese proyecto que te da miedo`,
    'Tauro': `OPORTUNIDAD DE ORO para manifestar abundancia material`,
    'Géminis': `CONEXIONES ÉPICAS esperan - sal y socializa`,
    'Cáncer': `SANACIÓN EMOCIONAL profunda disponible - aprovéchala`,
    'Leo': `TU MOMENTO DE BRILLAR ha llegado - no te escondas`,
    'Virgo': `PERFECCIONA ese sistema/hábito que transformará tu vida`,
    'Libra': `RELACIONES KÁRMICAS listas para sanar y evolucionar`,
    'Escorpio': `TRANSFORMACIÓN TOTAL disponible - suelta lo viejo`,
    'Sagitario': `EXPANSIÓN Y AVENTURA te llaman - di SÍ`,
    'Capricornio': `LOGROS IMPORTANTES al alcance - enfócate`,
    'Acuario': `INNOVACIÓN Y GENIALIDAD fluyendo - crea algo único`,
    'Piscis': `CONEXIÓN ESPIRITUAL en su máximo - medita y recibe`
  };
  opportunities.push(signOpportunities[sign] || `APROVECHA este portal cósmico único`);
  
  // Añadir más basado en perfil del usuario
  if (userProfile.currentAge && userProfile.currentAge < 30) {
    opportunities.push(`EDAD PERFECTA para tomar riesgos calculados - el universo te respalda`);
  } else if (userProfile.currentAge && userProfile.currentAge >= 30) {
    opportunities.push(`SABIDURÍA ACUMULADA + energía cósmica = ÉXITO GARANTIZADO`);
  }
  
  return { warnings, opportunities };
}

function generateAffectedLifeAreas(
  planet: string,
  sign: string,
  userProfile: UserProfile
): string[] {
  const areas: string[] = [];
  
  // Áreas basadas en planeta
  const planetAreas: Record<string, string[]> = {
    'Sol': ['Identidad personal', 'Propósito de vida', 'Creatividad', 'Liderazgo'],
    'Luna': ['Emociones', 'Hogar y familia', 'Intuición', 'Necesidades básicas'],
    'Mercurio': ['Comunicación', 'Aprendizaje', 'Viajes cortos', 'Hermanos'],
    'Venus': ['Amor y relaciones', 'Dinero y valores', 'Belleza y arte', 'Placer'],
    'Marte': ['Acción y energía', 'Sexualidad', 'Competencia', 'Coraje'],
    'Júpiter': ['Expansión y crecimiento', 'Educación superior', 'Viajes largos', 'Filosofía'],
    'Saturno': ['Responsabilidad', 'Carrera', 'Estructura', 'Lecciones kármicas']
  };
  
  const selectedAreas = planetAreas[planet] || planetAreas['Sol'];
  areas.push(...selectedAreas.slice(0, 3));
  
  return areas;
}

// ==========================================
// EXPORTACIONES
// ==========================================

export default {
  generateCostEffectiveInterpretation,
  generateDisruptiveAdvice,
  generatePersonalizedMantra,
  generateDisruptiveRitual,
  generateIntelligentActionPlan,
  generateDisruptiveWarningsAndOpportunities,
  generateAffectedLifeAreas
};