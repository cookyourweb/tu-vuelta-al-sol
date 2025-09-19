// src/app/api/astrology/interpret-progressed/route.ts
// ENDPOINT ESPECÍFICO PARA INTERPRETACIÓN DE CARTA PROGRESADA

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// INTERFACES
interface ProgressedInterpretationRequest {
  userId: string;
  progressedChart: any;
  natalChart: any;
  userProfile: {
    name: string;
    age: number;
    birthPlace: string;
    birthDate: string;
    birthTime: string;
  };
  natalInterpretation?: any; // Si está disponible para contexto
  regenerate?: boolean;
}

interface ProgressedInterpretation {
  tema_anual: string;
  evolucion_personalidad: string;
  nuevas_fortalezas: string[];
  desafios_superados: string[];
  enfoque_transformacional: string;
  cambios_energeticos: string;
  activaciones_casas: number[];
  aspectos_clave: string[];
  oportunidades_crecimiento: string[];
  comparacion_natal: {
    planetas_evolucionados: Array<{
      planeta: string;
      natal: string;
      progresado: string;
      significado: string;
    }>;
    casas_activadas: Array<{
      casa: number;
      significado: string;
    }>;
    tema_evolutivo: string;
  };
  consejos_integracion: string[];
  rituales_recomendados: string[];
}

export async function POST(request: NextRequest) {
  console.log('🌙 [INTERPRET-PROGRESSED] Iniciando interpretación de carta progresada');

  try {
    const body: ProgressedInterpretationRequest = await request.json();
    const { userId, progressedChart, natalChart, userProfile, natalInterpretation, regenerate = false } = body;

    // Validación mejorada
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId requerido'
      }, { status: 400 });
    }

    if (!progressedChart) {
      return NextResponse.json({
        success: false,
        error: 'progressedChart requerido'
      }, { status: 400 });
    }

    // Verificar si ya existe interpretación (cache)
    const cacheKey = `progressed_interpretation_${userId}`;
    if (!regenerate) {
      const existingInterpretation = getCachedInterpretation(cacheKey);
      if (existingInterpretation) {
        console.log('✅ [INTERPRET-PROGRESSED] Interpretación encontrada en cache');
        return NextResponse.json({
          success: true,
          data: {
            interpretation: existingInterpretation,
            cached: true,
            generatedAt: new Date().toISOString()
          }
        });
      }
    }

    console.log(`📊 [INTERPRET-PROGRESSED] Generando nueva interpretación progresada para: ${userProfile.name}`);

    let interpretation: ProgressedInterpretation;

    // Intentar con OpenAI Assistant
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_ASSISTANT_ID) {
      try {
        console.log('🤖 [INTERPRET-PROGRESSED] Usando OpenAI Assistant');
        interpretation = await generateProgressedAIInterpretation(
          progressedChart, 
          natalChart, 
          userProfile, 
          natalInterpretation
        );
        console.log('✅ [INTERPRET-PROGRESSED] Interpretación IA generada exitosamente');
      } catch (aiError) {
        console.error('❌ [INTERPRET-PROGRESSED] Error con IA, usando fallback:', aiError);
        interpretation = createProgressedFallback(progressedChart, natalChart, userProfile);
      }
    } else {
      console.log('📋 [INTERPRET-PROGRESSED] Variables OpenAI no configuradas, usando fallback');
      interpretation = createProgressedFallback(progressedChart, natalChart, userProfile);
    }

    // Guardar en cache
    setCachedInterpretation(cacheKey, interpretation);

    return NextResponse.json({
      success: true,
      data: {
        interpretation,
        cached: false,
        generatedAt: new Date().toISOString(),
        method: process.env.OPENAI_API_KEY ? 'openai_assistant' : 'fallback',
        hasNatalContext: !!natalInterpretation
      },
      metadata: {
        userId,
        userName: userProfile.name,
        progressedPlanets: progressedChart.planets?.length || 0,
        processingTime: Date.now()
      }
    });

  } catch (error) {
    console.error('❌ [INTERPRET-PROGRESSED] Error crítico:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GENERACIÓN CON IA
async function generateProgressedAIInterpretation(
  progressedChart: any,
  natalChart: any,
  userProfile: any,
  natalInterpretation: any
): Promise<ProgressedInterpretation> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!
  });

  const prompt = buildProgressedPrompt(progressedChart, natalChart, userProfile, natalInterpretation);

  try {
    // Crear thread con el assistant
    const thread = await openai.beta.threads.create({
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    // Ejecutar con el assistant configurado
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID!,
      temperature: 0.8,
      max_completion_tokens: 2500,
      instructions: `
Actúa como un astrólogo evolutivo experto especializado en cartas progresadas y análisis comparativo natal-progresada.

RESPONDE SOLO EN JSON VÁLIDO con esta estructura EXACTA:
{
  "tema_anual": "Tema evolutivo principal para este año progresado",
  "evolucion_personalidad": "Análisis de cómo ha evolucionado desde su carta natal",
  "nuevas_fortalezas": ["nueva fortaleza 1", "nueva fortaleza 2", "nueva fortaleza 3"],
  "desafios_superados": ["desafío superado 1", "desafío superado 2", "desafío superado 3"],
  "enfoque_transformacional": "Enfoque principal de transformación para este período",
  "cambios_energeticos": "Descripción de los cambios energéticos principales",
  "activaciones_casas": [casa1, casa2, casa3],
  "aspectos_clave": ["aspecto clave 1", "aspecto clave 2", "aspecto clave 3"],
  "oportunidades_crecimiento": ["oportunidad 1", "oportunidad 2", "oportunidad 3"],
  "comparacion_natal": {
    "planetas_evolucionados": [
      {
        "planeta": "Sol",
        "natal": "signo casa grado natal",
        "progresado": "signo casa grado progresado",
        "significado": "significado específico de esta evolución"
      }
    ],
    "casas_activadas": [
      {
        "casa": numero,
        "significado": "significado de la activación de esta casa"
      }
    ],
    "tema_evolutivo": "tema evolutivo principal basado en comparación"
  },
  "consejos_integracion": ["consejo práctico 1", "consejo práctico 2", "consejo práctico 3"],
  "rituales_recomendados": ["ritual 1", "ritual 2", "ritual 3"]
}

ENFOQUE ESPECÍFICO:
- Compara directamente posiciones natales vs progresadas
- Explica QUÉ ha cambiado y POR QUÉ es significativo
- Usa datos exactos de ambas cartas
- Enfoque evolutivo y de crecimiento consciente
- Conecta cambios con desarrollo psicológico
- Da consejos prácticos de integración
`
    });

    // Esperar completación
    let runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
    let attempts = 0;
    const maxAttempts = 30;

    while ((runStatus.status === 'in_progress' || runStatus.status === 'queued') && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
      attempts++;
    }

    if (runStatus.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const lastMessage = messages.data[0];
      
      if (lastMessage.content[0].type === 'text') {
        const responseText = lastMessage.content[0].text.value;
        const cleanResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        try {
          const parsedResponse = JSON.parse(cleanResponse);
          return parsedResponse as ProgressedInterpretation;
        } catch (parseError) {
          console.error('Error parseando respuesta IA:', parseError);
          throw new Error('Respuesta IA no es JSON válido');
        }
      }
    }

    throw new Error(`Assistant no completó la interpretación. Estado: ${runStatus.status}`);

  } catch (error) {
    console.error('Error en generateProgressedAIInterpretation:', error);
    throw error;
  }
}

// BUILD PROMPT PARA CARTA PROGRESADA
function buildProgressedPrompt(
  progressedChart: any,
  natalChart: any,
  userProfile: any,
  natalInterpretation: any
): string {
  const natalSol = natalChart.planets?.find((p: any) => p.name === 'Sol') || natalChart.sol;
  const progressedSol = progressedChart.planets?.find((p: any) => p.name === 'Sol') || progressedChart.sol;
  
  const natalLuna = natalChart.planets?.find((p: any) => p.name === 'Luna') || natalChart.luna;
  const progressedLuna = progressedChart.planets?.find((p: any) => p.name === 'Luna') || progressedChart.luna;

  return `
ANÁLISIS DE CARTA PROGRESADA CON COMPARACIÓN NATAL

📊 DATOS DE LA PERSONA:
- Nombre: ${userProfile.name}
- Edad: ${userProfile.age} años
- Lugar: ${userProfile.birthPlace}
- Fecha: ${userProfile.birthDate}

🌟 COMPARACIÓN SOL NATAL vs PROGRESADO:
- Sol Natal: ${natalSol?.sign || 'N/A'} Casa ${natalSol?.house || 'N/A'} (${natalSol?.degree || 0}°)
- Sol Progresado: ${progressedSol?.sign || 'N/A'} Casa ${progressedSol?.house || 'N/A'} (${progressedSol?.degree || 0}°)
- Evolución: ${calculateEvolution(natalSol, progressedSol)}

🌙 COMPARACIÓN LUNA NATAL vs PROGRESADA:
- Luna Natal: ${natalLuna?.sign || 'N/A'} Casa ${natalLuna?.house || 'N/A'} (${natalLuna?.degree || 0}°)
- Luna Progresada: ${progressedLuna?.sign || 'N/A'} Casa ${progressedLuna?.house || 'N/A'} (${progressedLuna?.degree || 0}°)
- Evolución: ${calculateEvolution(natalLuna, progressedLuna)}

🪐 TODOS LOS PLANETAS PROGRESADOS:
${progressedChart.planets?.map((p: any) => 
  `- ${p.name}: ${p.sign} Casa ${p.house} (${p.degree?.toFixed(1)}°)`
).join('\n') || 'Datos de planetas progresados no disponibles'}

🏠 CASAS PROGRESADAS:
${progressedChart.houses?.slice(0, 4).map((h: any, i: number) => 
  `- Casa ${i + 1}: ${h.sign} (${h.degree?.toFixed(1)}°)`
).join('\n') || 'Datos de casas progresadas no disponibles'}

⚡ ASPECTOS PROGRESADOS:
${progressedChart.aspects?.slice(0, 5).map((a: any) => 
  `- ${a.planet1} ${a.aspect} ${a.planet2} (${a.orb?.toFixed(1)}° orbe)`
).join('\n') || 'Aspectos progresados en procesamiento'}

📋 CONTEXTO NATAL (si disponible):
${natalInterpretation ? `
- Personalidad core natal: ${natalInterpretation.personalidad_core?.substring(0, 200)}...
- Fortalezas natales: ${natalInterpretation.fortalezas_principales?.slice(0, 2).join(', ')}
- Propósito natal: ${natalInterpretation.proposito_vida?.substring(0, 150)}...
` : 'Interpretación natal no disponible como contexto'}

INSTRUCCIONES:
Analiza la EVOLUCIÓN específica desde la carta natal hacia la progresada.
Explica QUÉ ha cambiado, POR QUÉ es significativo, y CÓMO integrarlo.
Usa los datos exactos para mostrar el crecimiento psicológico específico.
Enfócate en oportunidades evolutivas y nuevas capacidades disponibles.
Conecta los cambios con el desarrollo de la personalidad y propósito de vida.
`;
}

// FUNCIÓN AUXILIAR: CALCULAR EVOLUCIÓN
function calculateEvolution(natal: any, progressed: any): string {
  if (!natal || !progressed) return 'Datos no disponibles';
  
  if (natal.sign !== progressed.sign) {
    return `Cambio de signo: ${natal.sign} → ${progressed.sign} (evolución fundamental)`;
  }
  
  if (natal.house !== progressed.house) {
    return `Cambio de casa: Casa ${natal.house} → Casa ${progressed.house} (nuevo enfoque)`;
  }
  
  const degreeDiff = Math.abs((progressed.degree || 0) - (natal.degree || 0));
  return `Mismo signo/casa, evolución ${degreeDiff.toFixed(1)}° (refinamiento)`;
}

// FALLBACK ASTROLÓGICO PARA CARTA PROGRESADA
function createProgressedFallback(
  progressedChart: any,
  natalChart: any,
  userProfile: any
): ProgressedInterpretation {
  const natalSol = natalChart.planets?.find((p: any) => p.name === 'Sol') || natalChart.sol || { sign: 'Acuario', house: 1, degree: 21 };
  const progressedSol = progressedChart.planets?.find((p: any) => p.name === 'Sol') || progressedChart.sol || { sign: 'Acuario', house: 1, degree: 25 };
  
  const natalLuna = natalChart.planets?.find((p: any) => p.name === 'Luna') || natalChart.luna || { sign: 'Libra', house: 7, degree: 6 };
  const progressedLuna = progressedChart.planets?.find((p: any) => p.name === 'Luna') || progressedChart.luna || { sign: 'Libra', house: 7, degree: 15 };

  const solEvolution = calculateProgressedEvolution(natalSol, progressedSol);
  const lunaEvolution = calculateProgressedEvolution(natalLuna, progressedLuna);

  return {
    tema_anual: `Año de ${determineEvolutionTheme(solEvolution, lunaEvolution)} - Integración consciente de tu crecimiento ${natalSol.sign}-${natalLuna.sign}`,
    
    evolucion_personalidad: `Tu personalidad ha evolucionado desde tu configuración natal ${natalSol.sign}-${natalLuna.sign}. ${solEvolution.type === 'refinement' ? `Tu esencia ${natalSol.sign} se ha refinado ${solEvolution.degrees}° hacia mayor madurez` : `Tu identidad solar ha evolucionado hacia ${progressedSol.sign}, marcando un cambio fundamental`}. ${lunaEvolution.type === 'refinement' ? `Tu mundo emocional ${natalLuna.sign} ha desarrollado mayor sofisticación` : `Tus necesidades emocionales han evolucionado hacia ${progressedLuna.sign}`}. Esta evolución refleja ${userProfile.age} años de crecimiento consciente e inconsciente.`,
    
    nuevas_fortalezas: [
      `Madurez ${progressedSol.sign}: Tu esencia solar ahora opera desde una octava más sofisticada`,
      `Evolución emocional ${progressedLuna.sign}: Mayor inteligencia emocional y sabiduría del corazón`,
      `Integración consciente: Capacidad de usar tanto tu base natal como tu evolución progresada`,
      `Síntesis evolutiva: Equilibrio único entre tu fundamento original y tu crecimiento actual`
    ],
    
    desafios_superados: [
      `Conflictos natal-progresado: La tensión entre tu ${natalSol.sign} original y tu evolución actual ahora es sinergia`,
      `Bloqueos de expresión: Los patrones que limitaban tu Casa ${natalSol.house} han sido transformados`,
      `Evolución emocional: Tu ${natalLuna.sign} natal ha integrado nueva complejidad y profundidad`,
      `Resistencias al cambio: Has desarrollado flexibilidad consciente para tu crecimiento evolutivo`
    ],
    
    enfoque_transformacional: `Integración consciente de tu base natal ${natalSol.sign}-${natalLuna.sign} con tu evolución progresada para crear expresión auténtica expandida. El enfoque es síntesis, no reemplazo - honras tu esencia mientras abrazas tu crecimiento.`,
    
    cambios_energeticos: `Tu patrón energético natal ${natalSol.sign}-${natalLuna.sign} ahora vibra en una frecuencia evolutiva superior. ${getEnergeticEvolution(natalSol, progressedSol, natalLuna, progressedLuna)}`,
    
    activaciones_casas: getActivatedHouses(natalSol, progressedSol, natalLuna, progressedLuna),
    
    aspectos_clave: [
      `Evolución Solar: ${getSolarEvolutionInsight(natalSol, progressedSol)}`,
      `Evolución Lunar: ${getLunarEvolutionInsight(natalLuna, progressedLuna)}`,
      `Integración temporal: Tu edad ${userProfile.age} años representa esta fase específica de desarrollo`,
      `Potencial activado: Nuevas capacidades están disponibles basadas en tu maduración cósmica`
    ],
    
    oportunidades_crecimiento: [
      `Liderazgo evolutivo: Guiar a otros desde tu experiencia de integración consciente`,
      `Maestría emocional: Usar tu evolución lunar para contribuir a sanación colectiva`,
      `Innovación madura: Tu ${progressedSol.sign} progresado tiene herramientas que tu natal no tenía`,
      `Servicio consciente: Tu evolución personal ahora puede beneficiar el despertar colectivo`,
      `Síntesis sabia: Combinar experiencia natal con capacidades progresadas para impacto único`
    ],
    
    comparacion_natal: {
      planetas_evolucionados: [
        {
          planeta: 'Sol',
          natal: `${natalSol.sign} Casa ${natalSol.house} ${natalSol.degree}°`,
          progresado: `${progressedSol.sign} Casa ${progressedSol.house} ${progressedSol.degree}°`,
          significado: getSolarEvolutionMeaning(natalSol, progressedSol)
        },
        {
          planeta: 'Luna',
          natal: `${natalLuna.sign} Casa ${natalLuna.house} ${natalLuna.degree}°`,
          progresado: `${progressedLuna.sign} Casa ${progressedLuna.house} ${progressedLuna.degree}°`,
          significado: getLunarEvolutionMeaning(natalLuna, progressedLuna)
        }
      ],
      casas_activadas: getActivatedHousesDetailed(natalSol, progressedSol, natalLuna, progressedLuna),
      tema_evolutivo: `${getMainEvolutionTheme(solEvolution, lunaEvolution)}: Tu proceso de maduración cósmica integra conscientemente fundamento natal con crecimiento progresado`
    },
    
    consejos_integracion: [
      `Honra tu base natal ${natalSol.sign}: Mantén conexión con tu esencia original mientras abrazas tu evolución`,
      `Integra tu ${progressedLuna.sign} progresada: Permite que tus nuevas necesidades emocionales coexistan con tu naturaleza natal`,
      `Usa ambas versiones: En diferentes situaciones, puedes acceder tanto a tu sabiduría natal como a tu crecimiento progresado`,
      `Síntesis consciente: Medita sobre cómo tu evolución ${natalSol.sign}→${progressedSol.sign} sirve a tu propósito de vida expandido`
    ],
    
    rituales_recomendados: [
      `Ritual de integración natal-progresada: Ceremonia honrando tanto tu fundamento como tu evolución`,
      `Meditación de síntesis: Conectar conscientemente con ambas versiones de tu ${natalSol.sign} solar`,
      `Diario evolutivo: Escribir sobre cómo has crecido manteniendo tu esencia ${natalLuna.sign} emocional`,
      `Manifestación consciente: Crear desde la síntesis de tu sabiduría natal y capacidades progresadas`
    ]
  };
}

// FUNCIONES AUXILIARES PARA ANÁLISIS PROGRESADO

interface EvolutionData {
  type: 'sign_change' | 'house_change' | 'refinement';
  degrees: number;
  significance: 'major' | 'moderate' | 'subtle';
}

function calculateProgressedEvolution(natal: any, progressed: any): EvolutionData {
  if (!natal || !progressed) {
    return { type: 'refinement', degrees: 0, significance: 'subtle' };
  }

  if (natal.sign !== progressed.sign) {
    return { type: 'sign_change', degrees: 0, significance: 'major' };
  }

  if (natal.house !== progressed.house) {
    return { type: 'house_change', degrees: 0, significance: 'moderate' };
  }

  const degrees = Math.abs((progressed.degree || 0) - (natal.degree || 0));
  const significance = degrees > 5 ? 'moderate' : 'subtle';
  
  return { type: 'refinement', degrees, significance };
}

function determineEvolutionTheme(solEvolution: EvolutionData, lunaEvolution: EvolutionData): string {
  if (solEvolution.type === 'sign_change' || lunaEvolution.type === 'sign_change') {
    return 'transformación fundamental';
  }
  if (solEvolution.type === 'house_change' || lunaEvolution.type === 'house_change') {
    return 'reenfoque vital';
  }
  return 'refinamiento profundo';
}

function getEnergeticEvolution(natalSol: any, progressedSol: any, natalLuna: any, progressedLuna: any): string {
  const solChanged = natalSol.sign !== progressedSol.sign;
  const lunaChanged = natalLuna.sign !== progressedLuna.sign;
  
  if (solChanged && lunaChanged) {
    return `Transformación completa: tanto tu energía solar como lunar han evolucionado hacia nuevos arquetipos cósmicos`;
  }
  if (solChanged) {
    return `Tu identidad solar ha evolucionado hacia ${progressedSol.sign} mientras mantienes tu naturaleza emocional ${natalLuna.sign}`;
  }
  if (lunaChanged) {
    return `Tu mundo emocional ha evolucionado hacia ${progressedLuna.sign} mientras mantienes tu esencia solar ${natalSol.sign}`;
  }
  return `Intensificación y refinamiento de tu patrón natal ${natalSol.sign}-${natalLuna.sign} hacia mayor maestría`;
}

function getActivatedHouses(natalSol: any, progressedSol: any, natalLuna: any, progressedLuna: any): number[] {
  const houses = new Set<number>();
  
  if (natalSol.house) houses.add(natalSol.house);
  if (progressedSol.house) houses.add(progressedSol.house);
  if (natalLuna.house) houses.add(natalLuna.house);
  if (progressedLuna.house) houses.add(progressedLuna.house);
  
  return Array.from(houses).sort((a, b) => a - b);
}

function getSolarEvolutionInsight(natal: any, progressed: any): string {
  if (natal.sign !== progressed.sign) {
    return `Tu Sol natal ${natal.sign} ha evolucionado hacia ${progressed.sign} - nueva octava de poder personal disponible`;
  }
  return `Tu Sol ${natal.sign} se ha refinado hacia mayor autenticidad y presencia magnética`;
}

function getLunarEvolutionInsight(natal: any, progressed: any): string {
  if (natal.sign !== progressed.sign) {
    return `Tu Luna natal ${natal.sign} ha evolucionado hacia ${progressed.sign} - nuevas necesidades del alma activadas`;
  }
  return `Tu Luna ${natal.sign} ha desarrollado mayor sofisticación e inteligencia emocional`;
}

function getSolarEvolutionMeaning(natal: any, progressed: any): string {
  if (natal.sign !== progressed.sign) {
    return `Evolución fundamental de identidad: de ${natal.sign} hacia ${progressed.sign} - nuevo paradigma de expresión personal`;
  }
  
  const degrees = Math.abs((progressed.degree || 0) - (natal.degree || 0));
  return `Refinamiento de tu esencia ${natal.sign}: ${degrees.toFixed(1)}° de evolución hacia mayor madurez y autenticidad`;
}

function getLunarEvolutionMeaning(natal: any, progressed: any): string {
  if (natal.sign !== progressed.sign) {
    return `Revolución emocional: de ${natal.sign} hacia ${progressed.sign} - nuevas necesidades del alma y formas de nutrición`;
  }
  
  const degrees = Math.abs((progressed.degree || 0) - (natal.degree || 0));
  return `Sofisticación de tu naturaleza ${natal.sign}: ${degrees.toFixed(1)}° de evolución emocional hacia mayor sabiduría del corazón`;
}

function getActivatedHousesDetailed(natalSol: any, progressedSol: any, natalLuna: any, progressedLuna: any): Array<{casa: number, significado: string}> {
  const houses = [];
  
  if (progressedSol.house !== natalSol.house) {
    houses.push({
      casa: progressedSol.house,
      significado: `Casa ${progressedSol.house} activada por evolución solar: nuevo foco de expresión personal`
    });
  }
  
  if (progressedLuna.house !== natalLuna.house) {
    houses.push({
      casa: progressedLuna.house,
      significado: `Casa ${progressedLuna.house} activada por evolución lunar: nuevo área de satisfacción emocional`
    });
  }
  
  // Si no hay cambios de casa, mostrar casas principales
  if (houses.length === 0) {
    houses.push({
      casa: natalSol.house,
      significado: `Casa ${natalSol.house} intensificada: refinamiento profundo de expresión solar`
    });
  }
  
  return houses;
}

function getMainEvolutionTheme(solEvolution: EvolutionData, lunaEvolution: EvolutionData): string {
  if (solEvolution.type === 'sign_change' && lunaEvolution.type === 'sign_change') {
    return 'Transformación total';
  }
  if (solEvolution.type === 'sign_change') {
    return 'Evolución de identidad';
  }
  if (lunaEvolution.type === 'sign_change') {
    return 'Revolución emocional';
  }
  if (solEvolution.type === 'house_change' || lunaEvolution.type === 'house_change') {
    return 'Reenfoque vital';
  }
  return 'Refinamiento consciente';
}

// CACHE FUNCTIONS
function getCachedInterpretation(cacheKey: string): ProgressedInterpretation | null {
  if (typeof localStorage !== 'undefined') {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const data = JSON.parse(cached);
        if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
          return data.interpretation;
        }
      } catch (error) {
        console.error('Error parsing cached progressed interpretation:', error);
      }
    }
  }
  return null;
}

function setCachedInterpretation(cacheKey: string, interpretation: ProgressedInterpretation): void {
  if (typeof localStorage !== 'undefined') {
    const dataToCache = {
      interpretation,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
  }
}

// GET ENDPOINT PARA VERIFICAR STATUS
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  return NextResponse.json({
    status: "✅ Endpoint de Interpretación Progresada funcionando",
    capabilities: [
      "Interpretación evolutiva usando OpenAI Assistant",
      "Comparación directa natal vs progresada",
      "Análisis de cambios específicos (signos, casas, grados)",
      "Cache de interpretaciones (24h)",
      "Consejos de integración consciente"
    ],
    usage: {
      method: "POST",
      required_params: ["userId", "progressedChart", "natalChart", "userProfile"],
      optional_params: ["natalInterpretation", "regenerate"],
      response: "Interpretación evolutiva completa con comparación natal"
    },
    hasCache: userId ? !!getCachedInterpretation(`progressed_interpretation_${userId}`) : false,
    openaiConfigured: !!process.env.OPENAI_API_KEY && !!process.env.OPENAI_ASSISTANT_ID
  });
}