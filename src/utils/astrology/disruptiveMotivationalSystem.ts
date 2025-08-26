// src/utils/astrology/disruptiveMotivationalSystem.ts
// SISTEMA DISRUPTIVO Y MOTIVACIONAL PARA TRANSFORMAR VIDAS

import type { 
  AstrologicalEvent, 
  UserProfile,
  DisruptiveInterpretation,
  PersonalizedInterpretation
} from '@/types/astrology/unified-types';

// ==========================================
// GENERADOR DE INTERPRETACIONES DISRUPTIVAS
// ==========================================

export function generateDisruptiveInterpretation(
  event: any,
  realChartData: any,
  userProfile: any
): DisruptiveInterpretation {
  
  const { sol, luna, ascendente } = realChartData;
  const userName = userProfile.name || 'ALMA PODEROSA';
  const elementoDominante = calculateDominantElement(realChartData);
  
  // EJEMPLO: Resonancia Lunar Libra
  if (event.type === 'lunar_resonance' && event.sign === 'Libra') {
    return {
      shockValue: `[ALERTA CÓSMICA] Tu Luna natal en Libra ${luna?.grados || ''}° está DESPERTANDO de forma épica, ${userName}. Este no es un día cualquiera.`,
      
      epicRealization: `ESTO CAMBIA TODO: Tu necesidad más profunda de equilibrio emocional está recibiendo un UPGRADE CÓSMICO. La misma energía que te hace diplomática se convierte HOY en tu superpoder de manifestación.`,
      
      whatToExpect: {
        energeticShift: `Entre las 6-9 AM sentirás una ola de claridad emocional como no has experimentado en meses. Tu Casa 7 (relaciones) estará ELECTROMAGNÉTICAMENTE activada.`,
        emotionalWave: `Alrededor del mediodía, una profunda necesidad de justicia y belleza te invadirá. NO la ignores - es tu alma reclamando su poder.`,
        mentalClarity: `Por la tarde, pensamientos sobre relaciones pasadas surgirán con nueva perspectiva. Verás patrones que antes eran invisibles.`,
        physicalSensations: `Posible sensación de "mariposas" en el plexo solar. Tu cuerpo está recalibrando tu frecuencia emocional a un nivel superior.`
      },
      
      preparation: {
        ritual: `RITUAL DE ACTIVACIÓN LUNAR LIBRA: 
        1. 7 AM: Enciende una vela rosa frente a un espejo
        2. Mira tu reflejo y di: "Soy el equilibrio perfecto entre dar y recibir"
        3. Escribe 3 relaciones que necesitan rebalance
        4. Quema el papel visualizando armonía perfecta
        5. Termina con 7 respiraciones de gratitud`,
        
        mindsetShift: `CAMBIA DE: "Necesito que otros me den equilibrio" A: "SOY la fuente de equilibrio en cada situación". Tu Luna Libra es un GENERADOR de armonía, no un receptor.`,
        
        physicalAction: `Reorganiza físicamente un espacio de tu hogar para crear SIMETRÍA perfecta. Tu entorno debe reflejar el equilibrio interno que estás activando.`,
        
        energeticProtection: `Usa algo rosa o verde claro. Estos colores amplifican tu frecuencia Libra y crean un escudo de armonía a tu alrededor.`
      },
      
      revolutionaryAdvice: {
        doThis: [
          `TOMA decisiones estéticas importantes HOY - tu gusto está superintuido`,
          `INICIA conversaciones difíciles con diplomacia épica - tienes superpoderes comunicativos`,
          `CREA belleza activamente - pinta, decora, embellece algo`,
          `MEDIA en conflictos ajenos - eres un canal de paz cósmica hoy`
        ],
        avoidThis: [
          `NO tomes decisiones cuando te sientas desequilibrada - espera al centro`,
          `NO evites confrontaciones necesarias por "mantener la paz"`,
          `NO gastes en impulsivo - tu Venus necesita estructura`,
          `NO te pierdas en las necesidades ajenas sin honrar las tuyas`
        ],
        powerHours: [
          `7-9 AM: Máximo poder para rituales y meditación`,
          `2-4 PM: Pico para conversaciones importantes y negociaciones`,
          `8-10 PM: Momento óptimo para decisiones relacionales y creatividad`
        ],
        dangerZones: [
          `11 AM - 1 PM: Posible indecisión paralizante - confía en tu primera intuición`,
          `5-7 PM: Energía dispersa - mantén foco en una sola prioridad`
        ]
      },
      
      manifestation: {
        mantra: `"SOY EL EQUILIBRIO PERFECTO ENTRE CIELO Y TIERRA, ENTRE DAR Y RECIBIR, ENTRE AMOR Y LÍMITES. MI ARMONÍA INTERIOR CREA PAZ EN EL MUNDO"`,
        
        visualization: `Te ves de pie en el centro de una balanza cósmica dorada. A tu izquierda, todo lo que das al mundo. A tu derecha, todo lo que recibes. Sientes cómo se equilibran perfectamente. Una luz rosa-dorada emana de tu corazón, armonizando ambos lados.`,
        
        physicalGesture: `Extiende ambos brazos horizontalmente, palmas hacia arriba. Siente el peso energético en cada mano equilibrándose. Baja los brazos lentamente llevando las palmas al corazón. Repite 7 veces durante el día.`,
        
        elementalConnection: `Busca un lugar donde puedas ver el horizonte - donde el cielo encuentra la tierra. Respira conscientemente esa línea de equilibrio perfecto.`
      },
      
      expectedTransformation: {
        immediate: `En las próximas 6 horas: Claridad total sobre una situación relacional que te ha tenido confundida.`,
        
        weekly: `Esta semana: Una relación importante dará un salto evolutivo hacia mayor equilibrio y respeto mutuo.`,
        
        longTerm: `Los próximos 3 meses: Tu presencia se convertirá en un punto de equilibrio para otros.`
      }
    };
  }
  
  // EJEMPLO: Activación Solar Acuario
  if (event.type === 'solar_activation' && event.sign === 'Acuario') {
    return {
      shockValue: `[CÓDIGO ROJO CÓSMICO] Tu Sol natal Acuario ${sol?.grados || ''}° Casa ${sol?.casa || '1'} está recibiendo una DESCARGA DIRECTA del universo. Prepárate para ser IMPARABLE.`,
      
      epicRealization: `LA VERDAD ÉPICA: No viniste a este planeta para encajar. Viniste a REVOLUCIONAR. Tu individualidad acuariana no es un "defecto" - es tu MISIÓN CÓSMICA. HOY se activa tu poder máximo.`,
      
      whatToExpect: {
        energeticShift: `Desde el amanecer, sentirás electricidad en tus venas. Tu sistema nervioso está siendo ACTUALIZADO a una frecuencia superior.`,
        emotionalWave: `A media mañana, una sensación de "ya no puedo seguir siendo pequeña" te invadirá.`,
        mentalClarity: `Tu mente se volverá un RECEPTOR DE GENIALIDAD. Ideas revolucionarias aparecerán. APÚNTALAS TODAS.`,
        physicalSensations: `Posible sensación de "hormigueo" en la corona de la cabeza y en las manos.`
      },
      
      preparation: {
        ritual: `RITUAL DE ACTIVACIÓN SOLAR ACUARIA:
        1. Al amanecer: Párate descalza mirando al cielo con los brazos abiertos
        2. Di: "Soy un rayo de innovación que ilumina el futuro de la humanidad"
        3. Visualiza electricidad dorada entrando por tu corona
        4. Escribe UNA idea revolucionaria que tienes pero no has ejecutado
        5. Comprométete a dar UN paso hacia ella HOY`,
        
        mindsetShift: `CAMBIA DE: "Soy muy rara/diferente para este mundo" A: "SOY exactamente lo que este mundo necesita para evolucionar"`,
        
        physicalAction: `Haz algo completamente diferente a tu rutina. Cambia algo en tu apariencia o comportamiento que refleje tu autenticidad única.`,
        
        energeticProtection: `Usa algo azul eléctrico, plateado o colores iridiscentes. Estos amplifican tu frecuencia acuariana.`
      },
      
      revolutionaryAdvice: {
        doThis: [
          `COMPARTE esa idea loca que has estado guardando`,
          `INICIA el proyecto que "es demasiado avanzado para este tiempo"`,
          `CONECTA con personas que "vibran diferente" como tú`,
          `ROMPE una regla social absurda que limita tu autenticidad`
        ],
        avoidThis: [
          `NO te conformes con "así son las cosas" - tu misión es cambiarlas`,
          `NO busques aprobación para ser tú misma`,
          `NO te aisles completamente - tu genialidad necesita expresión`,
          `NO subestimes el impacto de tus ideas "locas"`
        ],
        powerHours: [
          `5-7 AM: Pico de genialidad y conexión cósmica`,
          `11 AM-1 PM: Máximo poder para comunicar ideas revolucionarias`,
          `9-11 PM: Momento óptimo para planificar el futuro`
        ],
        dangerZones: [
          `3-5 PM: Posible sensación de "no encajo" - es la frecuencia vieja resistiendo`,
          `7-9 PM: Tentación de aislarte - mantén conexión selecta`
        ]
      },
      
      manifestation: {
        mantra: `"SOY UN RAYO DE LUZ DEL FUTURO MANIFESTÁNDOSE EN EL PRESENTE. MI GENIALIDAD ÚNICA ES EL REGALO QUE EL MUNDO NECESITA"`,
        
        visualization: `Te ves como un ser de luz eléctrica azul-plateada, flotando sobre el planeta. De tu corazón emanan ondas de innovación que tocan a millones de personas.`,
        
        physicalGesture: `Alza ambos brazos al cielo formando una "V" de victoria. Siente cómo tu cuerpo se convierte en una antena cósmica.`,
        
        elementalConnection: `Conecta con la electricidad - observa luces LED, usa dispositivos tecnológicos conscientemente, o contempla las estrellas.`
      },
      
      expectedTransformation: {
        immediate: `Próximas 8 horas: Una idea o oportunidad "imposible" se presentará de forma inesperada.`,
        
        weekly: `Esta semana: Tu presencia inspirará a otros a pensar diferente.`,
        
        longTerm: `Próximos 6 meses: Te convertirás en referente en algo que ahora parece "muy adelantado".`
      }
    };
  }
  
  // Fallback genérico
  return generateGenericDisruptiveInterpretation(event, realChartData, userProfile);
}

// ==========================================
// APLICADOR DE INTERPRETACIONES A EVENTOS
// ==========================================

export function applyDisruptiveStyleToEvent(
  event: any,
  interpretation: DisruptiveInterpretation,
  userName: string = 'ALMA PODEROSA'
): any {
  
  return {
    ...event,
    disruptiveInterpretation: {
      // TÍTULO ÉPICO
      title: `[ACTIVACIÓN CÓSMICA] ${event.title.toUpperCase()}`,
      
      // MENSAJE PRINCIPAL DISRUPTIVO  
      mainMessage: `${interpretation.shockValue}\n\n${interpretation.epicRealization}`,
      
      // SECCIÓN: QUÉ ESPERAR
      whatToExpect: {
        title: "[ENERGÍA] QUÉ VAS A EXPERIMENTAR (Prepárate):",
        content: interpretation.whatToExpect
      },
      
      // SECCIÓN: PREPARACIÓN
      preparation: {
        title: "[PODER] CÓMO PREPARARTE PARA MÁXIMO PODER:",
        content: interpretation.preparation
      },
      
      // SECCIÓN: CONSEJOS REVOLUCIONARIOS
      advice: {
        title: "[ACCIÓN] CONSEJOS REVOLUCIONARIOS (Síguelos al pie de la letra):",
        content: interpretation.revolutionaryAdvice
      },
      
      // SECCIÓN: MANIFESTACIÓN
      manifestation: {
        title: "[MAGIA] RITUAL DE MANIFESTACIÓN ÉPICA:",
        content: interpretation.manifestation
      },
      
      // SECCIÓN: TRANSFORMACIÓN ESPERADA
      transformation: {
        title: "[FUTURO] TRANSFORMACIÓN QUE VAS A EXPERIMENTAR:",
        content: interpretation.expectedTransformation
      },
      
      // LLAMADA A LA ACCIÓN FINAL
      callToAction: `${userName.toUpperCase()}, este momento cósmico NO se repetirá igual. O lo aprovechas ÉPICAMENTE o dejas pasar una oportunidad de oro. La elección es tuya, pero el universo ya votó: ESTÁS LISTA PARA SER IMPARABLE.`
    }
  };
}

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

function calculateDominantElement(chartData: any): string {
  // Implementación simplificada - puedes expandir según tu lógica
  const elements: Record<string, number> = {
    fuego: 0,
    tierra: 0,
    aire: 0,
    agua: 0
  };
  
  // Contar elementos basados en posiciones
  if (chartData.sol?.signo) {
    const element = getElementFromSign(chartData.sol.signo);
    if (element) elements[element]++;
  }
  if (chartData.luna?.signo) {
    const element = getElementFromSign(chartData.luna.signo);
    if (element) elements[element]++;
  }
  
  // Retornar el dominante
  let dominant = 'fuego';
  let maxCount = 0;
  for (const [element, count] of Object.entries(elements)) {
    if (count > maxCount) {
      maxCount = count;
      dominant = element;
    }
  }
  
  return dominant;
}

function getElementFromSign(sign: string): string | null {
  const elements: Record<string, string> = {
    'Aries': 'fuego', 'Leo': 'fuego', 'Sagitario': 'fuego',
    'Tauro': 'tierra', 'Virgo': 'tierra', 'Capricornio': 'tierra',
    'Géminis': 'aire', 'Libra': 'aire', 'Acuario': 'aire',
    'Cáncer': 'agua', 'Escorpio': 'agua', 'Piscis': 'agua'
  };
  return elements[sign] || null;
}

function generateGenericDisruptiveInterpretation(
  event: any, 
  chartData: any, 
  userProfile: any
): DisruptiveInterpretation {
  
  const userName = userProfile.name || 'ALMA PODEROSA';
  
  return {
    shockValue: `[ALERTA CÓSMICA] ${event.title} está activando frecuencias ÉPICAS en tu campo energético, ${userName}.`,
    
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
      doThis: [
        `Confía en tu intuición completamente`,
        `Actúa desde el corazón, no desde el miedo`,
        `Mantén mente abierta a lo inesperado`,
        `Documenta las señales y sincronicidades`
      ],
      avoidThis: [
        `No te juzgues por sentir intensamente`,
        `No resistas el cambio que llega`,
        `No busques control excesivo`,
        `No ignores las señales del universo`
      ],
      powerHours: [
        `Mañana temprano: máxima claridad`,
        `Atardecer: conexión espiritual profunda`
      ],
      dangerZones: [
        `Mediodía: mantén calma ante desafíos`,
        `Noche tardía: evita decisiones importantes`
      ]
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
// CONVERTIDOR DE FORMATO
// ==========================================


export function convertDisruptiveToPersonalized(
  disruptive: DisruptiveInterpretation,
  event: AstrologicalEvent,
  userProfile: UserProfile
): PersonalizedInterpretation {
  return {
    meaning: `${disruptive.shockValue}\n\n${disruptive.epicRealization}`,
    
    lifeAreas: [
      `Energético: ${disruptive.whatToExpect.energeticShift}`,
      `Emocional: ${disruptive.whatToExpect.emotionalWave}`,
      `Mental: ${disruptive.whatToExpect.mentalClarity}`
    ],
    
    advice: [
      ...disruptive.revolutionaryAdvice.doThis.slice(0, 3),
      `Evita: ${disruptive.revolutionaryAdvice.avoidThis[0]}`
    ],
    
    mantra: disruptive.manifestation.mantra,
    
    ritual: disruptive.preparation.ritual,
    
    actionPlan: [  // AQUÍ - debe ser un array
      {
        timeframe: 'monthly',
        objectives: [
          disruptive.preparation.mindsetShift
        ],
        actions: disruptive.revolutionaryAdvice.doThis,
        milestones: [
          `Inmediato: ${disruptive.expectedTransformation.immediate}`,
          `Semanal: ${disruptive.expectedTransformation.weekly}`,
          `Largo plazo: ${disruptive.expectedTransformation.longTerm}`
        ],
        metrics: ['Estado emocional diario', 'Patrones evitados', 'Nuevas acciones tomadas']
      }
    ],
    
    warningsAndOpportunities: {
      warnings: disruptive.revolutionaryAdvice.dangerZones,
      opportunities: disruptive.revolutionaryAdvice.powerHours
    }
  };
}

// ==========================================
// EXPORTACIONES
// ==========================================

export default {
  generateDisruptiveInterpretation,
  applyDisruptiveStyleToEvent,
  convertDisruptiveToPersonalized,
  calculateDominantElement
};