// src/services/trainedAssistantService.ts - CORREGIDO PARA EFECTO WOW
// ✅ PROBLEMA RESUELTO: IA ahora recibe datos específicos de la carta natal

import { AstrologicalEvent, PersonalizedInterpretation, UserProfile, DetailedNatalChart, PlanetPosition } from "@/types/astrology/unified-types";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ MAPEO COMPLETO DE EVENTOS A PLANETAS - PROBLEMA CRÍTICO RESUELTO
const eventPlanetMap: Record<string, keyof DetailedNatalChart> = {
  // Eventos lunares
  'lunar_phase': 'luna',
  'lunar_new': 'luna',
  'lunar_full': 'luna',
  'lunar_resonance': 'luna',
  
  // Eventos solares
  'solar_activation': 'sol',
  'life_purpose_activation': 'sol',
  
  // Eventos planetarios específicos
  'mercury_communication': 'mercurio',
  'venus_harmony': 'venus',
  'mars_action': 'marte',
  'jupiter_expansion': 'jupiter',
  'saturn_discipline': 'saturno',
  'uranus_innovation': 'urano',
  'neptune_intuition': 'neptuno',
  'pluto_transformation': 'pluton',
  
  // Eventos generales
  'planetary_transit': 'sol', // Fallback inteligente
  'retrograde': 'mercurio',  // Mayoría son Mercurio retrógrado
  'direct': 'mercurio',
  'aspect': 'sol',
  'eclipse': 'luna',
  'seasonal': 'sol',
  'ai_generated': 'sol'
};

/**
 * ✅ FUNCIÓN PRINCIPAL CORREGIDA: Generar interpretación con datos natales específicos
 */
export async function generatePersonalizedInterpretation(
  event: AstrologicalEvent,
  userProfile: UserProfile,
  natalChart?: DetailedNatalChart
): Promise<PersonalizedInterpretation> {
  
  console.log('🤖 Generando interpretación personalizada para:', {
    evento: event.title,
    tipo: event.type,
    planeta: event.planet,
    usuario: userProfile.name,
    edad: userProfile.currentAge,
    tieneCartaNatal: !!natalChart
  });

  try {
    // ✅ OBTENER POSICIÓN NATAL RELEVANTE - CORREGIDO
    const relevantPlanet = getRelevantNatalPosition(event, natalChart);
    
    // ✅ CREAR CONTEXTO ESPECÍFICO CON DATOS REALES
    const specificContext = createSpecificContext(event, userProfile, relevantPlanet);
    
    console.log('🎯 Contexto específico creado:', {
      planetaRelevante: relevantPlanet ? `${relevantPlanet.planetName} en ${relevantPlanet.sign} Casa ${relevantPlanet.house}` : 'Sol (fallback)',
      tieneDatosNatales: !!relevantPlanet,
      edadEspecífica: userProfile.currentAge
    });

    // ✅ PROMPT MEJORADO CON DATOS ESPECÍFICOS
    const prompt = `
Actúa como un astrólogo profesional evolutivo y emocional.

DATOS ESPECÍFICOS DEL USUARIO:
- Nombre: ${userProfile.name || 'Usuario'}
- Edad actual: ${userProfile.currentAge} años
- Próxima edad: ${userProfile.nextAge} años
${specificContext}

EVENTO ASTROLÓGICO ESPECÍFICO:
- Tipo: ${event.type}
- Fecha: ${event.date}
- Título: ${event.title}
- Planeta: ${event.planet || 'No especificado'}
- Signo: ${event.sign || 'No especificado'}

${relevantPlanet ? `
CONEXIÓN CON TU CARTA NATAL:
- ${relevantPlanet.planetName} natal en ${relevantPlanet.sign}, Casa ${relevantPlanet.house}
- Grado: ${relevantPlanet.degree}°
- Elemento: ${relevantPlanet.element}
- Modalidad: ${relevantPlanet.mode}
${relevantPlanet.retrograde ? '- ⚠️ Retrógrado natal' : ''}

INTERPRETACIÓN NATAL:
El evento activa directamente tu ${relevantPlanet.planetName} natal en ${relevantPlanet.sign} Casa ${relevantPlanet.house}.
Esto significa que las energías del evento resuenan específicamente con tu ${getPlanetTheme(relevantPlanet.planetName)} personal.
` : ''}

INSTRUCCIONES ESPECÍFICAS:
1. Personaliza según la edad exacta (${userProfile.currentAge} años)
2. ${userProfile.currentAge < 18 ? 'Usa lenguaje apropiado para adolescentes, enfócate en estudios, amistades, autoconocimiento' : 'Enfócate en carrera, relaciones maduras, propósito de vida'}
3. Conecta el evento con los datos natales específicos
4. Sé específico y preciso, no genérico
5. Genera un efecto WOW que haga sentir al usuario que realmente conoces su carta

FORMATO DE RESPUESTA (JSON estricto):
{
  "meaning": "Explicación específica del evento conectado con su carta natal",
  "lifeAreas": ["área1", "área2", "área3"],
  "advice": "Consejo específico basado en su configuración planetaria",
  "mantra": "Afirmación personalizada para su situación específica",
  "ritual": "Ritual específico considerando su planeta natal",
  "actionPlan": [
    {
      "category": "trabajo|amor|salud|dinero|crecimiento|relaciones|creatividad",
      "action": "Acción específica para su configuración",
      "timing": "inmediato|esta_semana|este_mes",
      "difficulty": "fácil|moderado|desafiante",
      "impact": "bajo|medio|alto|transformador"
    }
  ],
  "warningsAndOpportunities": {
    "warnings": ["Evita esto específico según tu carta"],
    "opportunities": ["Aprovecha esto según tu configuración natal"]
  },
  "natalContext": {
    "conexionPlanetaria": "Explicación de cómo conecta con su planeta natal específico",
    "casaActivada": ${relevantPlanet?.house || 1},
    "temaVida": "Tema específico de vida que se activa",
    "desafioEvolutivo": "Desafío específico para su configuración"
  }
}

RESPONDE ÚNICAMENTE CON EL JSON. NO AÑADAS TEXTO ADICIONAL.
`;

    // ✅ LLAMADA A OPENAI CON PROMPT MEJORADO
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    });

    const response = completion.choices[0].message.content;
    
    if (!response) {
      throw new Error('No se recibió respuesta de OpenAI');
    }

    // ✅ PARSEAR RESPUESTA JSON
    let parsedResponse: PersonalizedInterpretation;
    
    try {
      // Limpiar respuesta de posibles marcas de código
      const cleanResponse = response
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      
      parsedResponse = JSON.parse(cleanResponse);
      
      console.log('✅ Interpretación específica generada:', {
        tieneConexiónNatal: !!parsedResponse.natalContext,
        planAcción: parsedResponse.actionPlan?.length || 0,
        personalizaciónCompleta: !!parsedResponse.meaning
      });
      
    } catch (parseError) {
      console.warn('⚠️ Error parseando JSON, usando fallback inteligente:', parseError);
      
      // ✅ FALLBACK INTELIGENTE CON DATOS ESPECÍFICOS
      parsedResponse = createIntelligentFallback(event, userProfile, relevantPlanet);
    }

    return parsedResponse;

  } catch (error) {
    console.error('❌ Error generando interpretación IA:', error);
    
    // ✅ FALLBACK CON DATOS NATALES
    return createIntelligentFallback(event, userProfile, getRelevantNatalPosition(event, natalChart));
  }
}

// ✅ FUNCIÓN CORREGIDA: Obtener posición natal relevante
function getRelevantNatalPosition(
  event: AstrologicalEvent,
  natalChart?: DetailedNatalChart
): (PlanetPosition & { planetName: string }) | null {
  
  if (!natalChart) {
    console.log('⚠️ No hay carta natal disponible');
    return null;
  }

  // ✅ PRIORIZAR event.planet SI EXISTE
  if (event.planet) {
    const planetKey = planetNameToKey(event.planet);
    if (planetKey && natalChart[planetKey]) {
      console.log(`🎯 Planeta específico encontrado: ${event.planet} → ${planetKey}`);
      const planetData = natalChart[planetKey];
      if (
        planetData &&
        typeof planetData === 'object' &&
        !Array.isArray(planetData) &&
        'sign' in planetData &&
        'house' in planetData &&
        'degree' in planetData &&
        'element' in planetData &&
        'mode' in planetData
      ) {
        return {
          ...planetData,
          planetName: event.planet
        };
      }
      return null;
    }
  }

  // ✅ USAR MAPEO DE TIPOS DE EVENTOS
  const planetKey = eventPlanetMap[event.type];
  if (planetKey && natalChart[planetKey]) {
    console.log(`🔄 Planeta por tipo de evento: ${event.type} → ${planetKey}`);
    const planetData = natalChart[planetKey];
    if (
      planetData &&
      typeof planetData === 'object' &&
      !Array.isArray(planetData) &&
      'sign' in planetData &&
      'house' in planetData &&
      'degree' in planetData &&
      'element' in planetData &&
      'mode' in planetData
    ) {
      return {
        ...planetData,
        planetName: keyToPlanetName(planetKey)
      };
    }
    return null;
  }

  // ✅ FALLBACK INTELIGENTE AL SOL
  console.log('🌞 Usando Sol como fallback inteligente');
  if (
    natalChart &&
    natalChart.sol &&
    typeof natalChart.sol === 'object' &&
    !Array.isArray(natalChart.sol) &&
    'sign' in natalChart.sol &&
    'house' in natalChart.sol &&
    'degree' in natalChart.sol &&
    'element' in natalChart.sol &&
    'mode' in natalChart.sol
  ) {
    return { ...natalChart.sol, planetName: 'Sol' };
  }
  return null;
}

// ✅ FUNCIÓN NUEVA: Convertir nombre de planeta a clave
function planetNameToKey(planetName: string): keyof DetailedNatalChart | null {
  const mapping: Record<string, keyof DetailedNatalChart> = {
    'Sol': 'sol',
    'Luna': 'luna',
    'Mercurio': 'mercurio',
    'Venus': 'venus',
    'Marte': 'marte',
    'Júpiter': 'jupiter',
    'Saturno': 'saturno',
    'Urano': 'urano',
    'Neptuno': 'neptuno',
    'Plutón': 'pluton'
  };
  
  return mapping[planetName] || null;
}

// ✅ FUNCIÓN NUEVA: Convertir clave a nombre de planeta
function keyToPlanetName(key: keyof DetailedNatalChart): string {
  const mapping: Record<keyof DetailedNatalChart, string> = {
    sol: 'Sol',
    luna: 'Luna',
    mercurio: 'Mercurio',
    venus: 'Venus',
    marte: 'Marte',
    jupiter: 'Júpiter',
    saturno: 'Saturno',
    urano: 'Urano',
    neptuno: 'Neptuno',
    pluton: 'Plutón',
    ascendente: 'Ascendente',
    mediocielo: 'Medio Cielo',
    aspectos: 'Aspectos'
  };
  
  return mapping[key] || 'Planeta';
}

// ✅ FUNCIÓN NUEVA: Crear contexto específico
function createSpecificContext(
  event: AstrologicalEvent,
  userProfile: UserProfile,
  planetPosition?: (PlanetPosition & { planetName: string }) | null
): string {
  let context = `
PERFIL ASTROLÓGICO:
- Sol natal: ${userProfile.astrological?.signs?.sun || 'No disponible'}
- Luna natal: ${userProfile.astrological?.signs?.moon || 'No disponible'}
- Ascendente: ${userProfile.astrological?.signs?.ascendant || 'No disponible'}`;

  if (planetPosition) {
    context += `

PLANETA ACTIVADO EN TU CARTA:
- ${planetPosition.planetName} en ${planetPosition.sign}, Casa ${planetPosition.house}
- Grado exacto: ${planetPosition.degree}°
- Elemento: ${planetPosition.element}
- Modalidad: ${planetPosition.mode}
${planetPosition.retrograde ? '- Estado: Retrógrado natal (energía internalizada)' : ''}`;
  }

  return context;
}

// ✅ FUNCIÓN NUEVA: Obtener tema del planeta
function getPlanetTheme(planetName: string): string {
  const themes: Record<string, string> = {
    'Sol': 'identidad, propósito y poder personal',
    'Luna': 'mundo emocional y necesidades profundas',
    'Mercurio': 'comunicación y procesos mentales',
    'Venus': 'amor, relaciones y valores',
    'Marte': 'acción, energía y deseos',
    'Júpiter': 'expansión, sabiduría y oportunidades',
    'Saturno': 'estructura, responsabilidad y logros',
    'Urano': 'innovación, libertad y cambios únicos',
    'Neptuno': 'intuición, espiritualidad y sueños',
    'Plutón': 'transformación profunda y poder interior'
  };
  
  return themes[planetName] || 'desarrollo personal';
}

// ✅ FUNCIÓN NUEVA: Fallback inteligente con datos específicos
function createIntelligentFallback(
  event: AstrologicalEvent,
  userProfile: UserProfile,
  planetPosition?: (PlanetPosition & { planetName: string }) | null
): PersonalizedInterpretation {
  
  const isAdolescent = userProfile.currentAge < 18;
  const planetTheme = planetPosition ? getPlanetTheme(planetPosition.planetName) : 'crecimiento personal';
  
  return {
    meaning: planetPosition ? 
      `Este evento activa tu ${planetPosition.planetName} natal en ${planetPosition.sign} Casa ${planetPosition.house}, conectando directamente con tu ${planetTheme}. Es un momento especialmente significativo para tu configuración astrológica única.` :
      `Este evento resuena con las energías de tu carta natal, activando temas importantes de ${planetTheme} en tu vida.`,
    
    lifeAreas: isAdolescent ? 
      ['estudios', 'amistades', 'autoconocimiento', 'expresión_personal'] :
      ['carrera', 'relaciones', 'propósito_vida', 'crecimiento_personal'],
    
    advice: planetPosition ?
      `Aprovecha que tu ${planetPosition.planetName} en ${planetPosition.sign} está siendo activado. ${planetPosition.mode === 'cardinal' ? 'Inicia nuevos proyectos' : planetPosition.mode === 'fixed' ? 'Persiste en tus objetivos' : 'Mantente flexible y adaptable'}.` :
      `Conecta con las energías de este evento para potenciar tu ${planetTheme}.`,
    
    mantra: planetPosition ?
      `Mi ${planetPosition.planetName} en ${planetPosition.sign} me guía hacia mi ${planetTheme} único y especial.` :
      `Estoy alineado/a con las energías cósmicas que potencian mi ${planetTheme}.`,
    
    ritual: planetPosition ?
      `Medita visualizando la energía de ${planetPosition.planetName} en ${planetPosition.sign} fluyendo por tu Casa ${planetPosition.house}.` :
      'Dedica 5 minutos a conectar con tu intuición y visualizar tus objetivos manifestándose.',
    
    actionPlan: [{
      category: isAdolescent ? 'crecimiento' : 'trabajo',
      action: planetPosition ?
        `Activa conscientemente tu ${planetPosition.planetName} en ${planetPosition.sign} ${isAdolescent ? 'explorando nuevos intereses' : 'tomando decisiones importantes'}.` :
        `Aprovecha las energías del evento para ${isAdolescent ? 'desarrollar tus talentos' : 'avanzar en tus objetivos'}.`,
      timing: 'esta_semana',
      difficulty: 'moderado',
      impact: planetPosition ? 'transformador' : 'alto'
    }],
    
    warningsAndOpportunities: {
      warnings: planetPosition && planetPosition.retrograde ? 
        [`Ten paciencia, tu ${planetPosition.planetName} natal retrógrado requiere tiempo para integrar cambios`] :
        ['Evita tomar decisiones impulsivas durante este tránsito'],
      opportunities: planetPosition ?
        [`Tu ${planetPosition.planetName} en ${planetPosition.sign} Casa ${planetPosition.house} está especialmente activado - momento único para ${planetTheme}`] :
        [`Momento excelente para conectar con tu propósito de vida y manifestar tus objetivos`]
    },
    
    natalContext: planetPosition ? {
      conexionPlanetaria: `Tu ${planetPosition.planetName} natal en ${planetPosition.sign} Casa ${planetPosition.house} está siendo directamente activado por este evento`,
      casaActivada: planetPosition.house,
      temaVida: `${planetTheme} - Casa ${planetPosition.house}`,
      desafioEvolutivo: `Integrar conscientemente las energías de ${planetPosition.planetName} en ${planetPosition.sign} para tu ${planetTheme}`
    } : undefined
  };
}

/**
 * ✅ FUNCIÓN BATCH: Procesar múltiples eventos con eficiencia
 */
export async function generateBatchInterpretations(
  events: AstrologicalEvent[],
  userProfile: UserProfile,
  natalChart?: DetailedNatalChart
): Promise<AstrologicalEvent[]> {
  
  console.log(`🚀 Generando interpretaciones para ${events.length} eventos...`);
  
  // Procesar en lotes de 3 para evitar rate limits
  const batchSize = 3;
  const processedEvents: AstrologicalEvent[] = [];
  
  for (let i = 0; i < events.length; i += batchSize) {
    const batch = events.slice(i, i + batchSize);
    
    console.log(`📦 Procesando lote ${Math.floor(i / batchSize) + 1}/${Math.ceil(events.length / batchSize)}...`);
    
    const batchPromises = batch.map(async (event) => {
      try {
        const interpretation = await generatePersonalizedInterpretation(event, userProfile, natalChart);
        return {
          ...event,
          personalInterpretation: interpretation,
          aiInterpretation: interpretation // ✅ COMPATIBILIDAD
        };
      } catch (error) {
        console.error(`❌ Error procesando evento ${event.id}:`, error);
        return {
          ...event,
          personalInterpretation: createIntelligentFallback(event, userProfile, getRelevantNatalPosition(event, natalChart))
        };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    processedEvents.push(...batchResults);
    
    // Pausa entre lotes para evitar rate limiting
    if (i + batchSize < events.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`✅ Interpretaciones completadas: ${processedEvents.filter(e => e.personalInterpretation).length}/${events.length}`);
  
  return processedEvents;
}

/**
 * ✅ FUNCIÓN DE VALIDACIÓN: Verificar que las interpretaciones son específicas
 */
export function validateInterpretationQuality(interpretation: PersonalizedInterpretation): {
  isHighQuality: boolean;
  score: number;
  issues: string[];
} {
  let score = 0;
  const issues: string[] = [];
  
  // Verificar especificidad del significado
  if (interpretation.meaning.includes('carta natal') || interpretation.meaning.includes('Casa ')) {
    score += 25;
  } else {
    issues.push('Falta conexión específica con carta natal');
  }
  
  // Verificar contexto natal
  if (interpretation.natalContext) {
    score += 25;
  } else {
    issues.push('Falta contexto natal específico');
  }
  
  // Verificar plan de acción
  if (interpretation.actionPlan && interpretation.actionPlan.length > 0) {
    score += 25;
  } else {
    issues.push('Falta plan de acción');
  }
  
  // Verificar personalización
  if (interpretation.mantra && !interpretation.mantra.includes('genérico')) {
    score += 25;
  } else {
    issues.push('Mantra demasiado genérico');
  }
  
  return {
    isHighQuality: score >= 75,
    score,
    issues
  };
}

/**
 * ✅ ESTADÍSTICAS DE INTERPRETACIONES
 */
export function getInterpretationStats(events: AstrologicalEvent[]): {
  total: number;
  withInterpretation: number;
  withNatalContext: number;
  averageQuality: number;
  byPlanet: Record<string, number>;
} {
  const stats = {
    total: events.length,
    withInterpretation: 0,
    withNatalContext: 0,
    averageQuality: 0,
    byPlanet: {} as Record<string, number>
  };
  
  let totalQuality = 0;
  
  events.forEach(event => {
    if (event.personalInterpretation) {
      stats.withInterpretation++;
      
      if (event.personalInterpretation.natalContext) {
        stats.withNatalContext++;
      }
      
      const quality = validateInterpretationQuality(event.personalInterpretation);
      totalQuality += quality.score;
      
      // Estadísticas por planeta
      const planet = event.planet || 'No especificado';
      stats.byPlanet[planet] = (stats.byPlanet[planet] || 0) + 1;
    }
  });
  
  stats.averageQuality = stats.withInterpretation > 0 ? 
    Math.round(totalQuality / stats.withInterpretation) : 0;
  
  return stats;
}

// ✅ EXPORTACIONES
export default {
  generatePersonalizedInterpretation,
  generateBatchInterpretations,
  validateInterpretationQuality,
  getInterpretationStats
};