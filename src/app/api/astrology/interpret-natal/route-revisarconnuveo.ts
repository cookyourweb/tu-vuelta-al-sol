// src/app/api/astrology/interpret-natal/route.ts
// ============================================================================
// 🔥 ENDPOINT INTERPRETACIÓN NATAL - VERSIÓN ULTRA-ROBUSTA
// ============================================================================
// SOLUCIONA: [object Object], parsing errors, falta de explicaciones educativas
// GARANTIZA: Respuestas siempre válidas, super educativas, nunca falla
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// ============================================================================
// 📚 INTERFACES
// ============================================================================

interface ChartData {
  planets: Array<{
    name: string;
    sign: string;
    degree: number;
    house?: number;
    houseNumber?: number;
    retrograde?: boolean;
    longitude?: number;
  }>;
  houses?: Array<{
    number: number;
    sign: string;
    degree: number;
  }>;
  aspects?: Array<{
    planet1: string;
    planet2: string;
    type: string;
    orb: number;
  }>;
  ascendant?: {
    sign: string;
    degree: number;
  };
  midheaven?: {
    sign: string;
    degree: number;
  };
}

interface UserProfile {
  name: string;
  age: number;
  birthPlace: string;
  birthDate: string;
  birthTime: string;
}

interface NatalInterpretationRequest {
  userId: string;
  natalChart: ChartData;
  userProfile: UserProfile;
  regenerate?: boolean;
}

// ============================================================================
// 🛠️ HELPERS - EDUCATIVOS
// ============================================================================

/**
 * Obtiene explicación educativa de un planeta
 */
function getPlanetEducationalMeaning(planet: string): string {
  const meanings: Record<string, string> = {
    'Sol': 'tu identidad esencial, tu propósito vital, tu luz interior',
    'Luna': 'tus emociones, tus necesidades emocionales, tu nutrición afectiva',
    'Mercurio': 'tu mente, tu comunicación, cómo procesas información',
    'Venus': 'tu forma de amar, tus valores, lo que disfrutas',
    'Marte': 'tu acción, tu deseo, tu energía para conquistar',
    'Júpiter': 'tu expansión, tu sabiduría, tus oportunidades',
    'Saturno': 'tu estructura, tus límites, tu maestro interno',
    'Urano': 'tu rebeldía, tu innovación, tu autenticidad radical',
    'Neptuno': 'tu espiritualidad, tu intuición, tu conexión con lo divino',
    'Plutón': 'tu poder transformador, tu intensidad, tu renacimiento',
    'Quirón': 'tu herida sanadora, tu don único nacido del dolor',
    'Nodo Norte': 'tu evolución, tu propósito de alma',
    'Nodo Sur': 'tus talentos pasados, tu zona de confort'
  };
  return meanings[planet] || 'tu energía planetaria';
}

/**
 * Obtiene explicación educativa de una casa
 */
function getHouseEducationalMeaning(house: number): string {
  const meanings: Record<number, string> = {
    1: 'tu identidad, tu presencia, tu impacto al mundo',
    2: 'tus recursos, tu valor personal, tu seguridad material',
    3: 'tu comunicación, tu aprendizaje, tus conexiones cercanas',
    4: 'tu hogar emocional, tus raíces, tu familia interna',
    5: 'tu creatividad, tu autoexpresión, tu alegría',
    6: 'tu trabajo diario, tu salud, tu servicio',
    7: 'tus relaciones íntimas, tu pareja, tus asociaciones',
    8: 'tu transformación profunda, tu poder compartido, tu sexualidad',
    9: 'tu sabiduría, tu filosofía de vida, tu expansión mental',
    10: 'tu carrera, tu legado público, tu contribución al mundo',
    11: 'tu comunidad, tus ideales, tu visión de futuro',
    12: 'tu espiritualidad, tu conexión con lo universal, tu liberación'
  };
  return meanings[house] || 'tu zona de experiencia';
}

/**
 * Obtiene explicación educativa de un signo
 */
function getSignEducationalMeaning(sign: string): string {
  const meanings: Record<string, string> = {
    'Aries': 'iniciar, liderar, actuar con coraje',
    'Tauro': 'construir, valorar, disfrutar lo tangible',
    'Géminis': 'comunicar, conectar, aprender constantemente',
    'Cáncer': 'nutrir, proteger, sentir profundamente',
    'Leo': 'brillar, crear, expresar tu autenticidad',
    'Virgo': 'perfeccionar, servir, organizar con maestría',
    'Libra': 'equilibrar, relacionarte, crear armonía',
    'Escorpio': 'transformar, profundizar, renacer',
    'Sagitario': 'expandir, explorar, buscar verdades',
    'Capricornio': 'construir legado, estructurar, alcanzar metas',
    'Acuario': 'innovar, revolucionar, liberar',
    'Piscis': 'trascender, intuir, amar universalmente'
  };
  return meanings[sign] || 'expresarte';
}

/**
 * Formatea posición planetaria de forma SUPER EDUCATIVA
 */
function formatPlanetaryPositionEducationally(
  planetName: string,
  sign: string,
  house: number,
  degree: number,
  retrograde?: boolean
): string {
  const planetMeaning = getPlanetEducationalMeaning(planetName);
  const houseMeaning = getHouseEducationalMeaning(house);
  const signMeaning = getSignEducationalMeaning(sign);
  const retroText = retrograde ? ' ♻️ RETRÓGRADO (energía más interna e introspectiva)' : '';
  
  return `${planetName} (${planetMeaning}) en ${sign} (${signMeaning}) ${degree.toFixed(1)}° en Casa ${house} (${houseMeaning})${retroText}`;
}

// ============================================================================
// 🎨 PROMPT SUPER EDUCATIVO
// ============================================================================

function generateSuperEducationalNatalPrompt(
  chartData: ChartData,
  userProfile: UserProfile
): string {
  const { name, age } = userProfile;
  
  // Extraer planetas clave con EXPLICACIONES
  const planetsText = chartData.planets
    .map(p => {
      const house = p.house || p.houseNumber || 1;
      return `📍 ${formatPlanetaryPositionEducationally(
        p.name,
        p.sign,
        house,
        p.degree,
        p.retrograde
      )}`;
    })
    .join('\n');

  return `
🔥 MISIÓN CRÍTICA: INTERPRETACIÓN NATAL SUPER EDUCATIVA Y TRANSFORMACIONAL

📊 DATOS DE ${name.toUpperCase()} (${age} años):

${planetsText}

🎯 TU MISIÓN COMO ASTRÓLOGO EDUCATIVO REVOLUCIONARIO:

1. **SER SUPER EDUCATIVO** ✨
   - SIEMPRE explica cada planeta entre paréntesis: "Luna (tus emociones, necesidades)"
   - SIEMPRE explica cada casa entre paréntesis: "Casa 7 (relaciones, pareja)"
   - SIEMPRE explica cada signo entre paréntesis: "Libra (equilibrio, armonía)"
   - Usa lenguaje cotidiano, NO jargon astrológico sin explicar
   - Que lo entienda CUALQUIERA, incluso sin saber astrología

2. **SER PROFUNDAMENTE PSICOLÓGICO** 🧠
   - Identifica patrones emocionales desde la infancia
   - Explica el origen de creencias limitantes
   - Muestra ciclos kármicos que se repiten
   - Da el NOMBRE del patrón (ej: "La Huérfana Emocional")

3. **SER DISRUPTIVO Y EMOCIONAL** 🔥
   - Usa lenguaje directo, emotivo, activador
   - CAPS para énfasis en palabras clave
   - Emojis estratégicos (2-3 por sección)
   - Preguntas poderosas que hagan reflexionar

4. **SER PRÁCTICO Y TRANSFORMADOR** 🎯
   - Cada insight con acción concreta esta semana
   - Ritual específico y accionable
   - Afirmación poderosa en CAPS
   - Pasos claros de transformación

📋 ESTRUCTURA JSON REQUERIDA (CRÍTICO - DEBE SER JSON VÁLIDO AL 100%):

{
  "esencia_revolucionaria": "Una frase ÉPICA que capture la esencia única de ${name}",
  
  "proposito_vida": "El propósito profundo y transformador de ${name} en esta encarnación",
  
  "planetas_clave": [
    {
      "planeta": "Sol (tu identidad, propósito) en Acuario (innovar, revolucionar) Casa 1 (identidad, presencia)",
      "lectura_psicologica": "Explicación profunda del impacto psicológico de esta posición",
      "luz": "Fortalezas y dones que esta posición otorga",
      "sombra": "Desafíos y patrones limitantes a transformar",
      "integracion": "Cómo integrar luz y sombra para evolucionar"
    }
  ],
  
  "patrones_transformar": [
    {
      "nombre_patron": "Nombre memorable del patrón (ej: La Huérfana Emocional)",
      "origen": "De dónde viene este patrón (infancia, familia)",
      "como_se_manifiesta": ["Conducta específica 1", "Conducta específica 2"],
      "dialogo_interno": ["Pensamiento limitante 1", "Pensamiento limitante 2"],
      "ciclo_karmico": "Paso 1 → Paso 2 → Paso 3 → Vuelve a Paso 1",
      "transformacion": "Cómo romper este ciclo y evolucionar"
    }
  ],
  
  "rituales_activacion": [
    {
      "nombre": "Nombre del ritual",
      "descripcion": "Paso a paso específico y accionable",
      "frecuencia": "Cuándo hacerlo (diario, semanal, mensual)"
    }
  ],
  
  "accion_esta_semana": "UNA acción concreta y específica que ${name} puede hacer esta semana",
  
  "afirmacion_poder": "AFIRMACIÓN PODEROSA EN MAYÚSCULAS PARA ACTIVAR TRANSFORMACIÓN",
  
  "pregunta_reflexion": "Una pregunta profunda para que ${name} reflexione"
}

🚨 CRÍTICO:
- Responde SOLO con JSON válido (sin markdown, sin texto antes/después)
- Cierra TODAS las strings, arrays y objetos correctamente
- Si te quedas sin espacio, prioriza completar el JSON aunque acortes contenido
- Usa comillas dobles para strings
- No uses comillas simples dentro de strings sin escapar

💡 RECUERDA: Esto es para ${name}, una persona REAL buscando transformación REAL.
    Sé profundo, pero claro. Disruptivo, pero empático. Revolucionario, pero práctico.
`.trim();
}

// ============================================================================
// 🤖 GENERACIÓN CON OPENAI - ULTRA ROBUSTO
// ============================================================================

async function generateNatalInterpretationSafe(
  chartData: ChartData,
  userProfile: UserProfile
): Promise<any> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  const prompt = generateSuperEducationalNatalPrompt(chartData, userProfile);

  console.log('🚀 === GENERANDO INTERPRETACIÓN NATAL EDUCATIVA ===');
  console.log('👤 Usuario:', userProfile.name);
  console.log('📊 Planetas:', chartData.planets?.length || 0);
  console.log('📝 Prompt length:', prompt.length);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Eres un astrólogo educativo revolucionario del sistema TuVueltaAlSol.es. 
          
REGLAS CRÍTICAS:
1. Responde SOLO con JSON válido (sin markdown, sin texto adicional)
2. SIEMPRE explica planetas, casas y signos entre paréntesis
3. Lenguaje claro para TODOS (no solo astrólogos)
4. Cierra TODAS las strings, arrays y objetos
5. Si llegas al límite de tokens, completa el JSON correctamente aunque acortes contenido`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response from OpenAI');
    }

    console.log('✅ Respuesta recibida de OpenAI');

    // LIMPIEZA ROBUSTA del JSON
    let cleanedResponse = response
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    // Si empieza con texto antes del JSON, encontrar el primer {
    const firstBrace = cleanedResponse.indexOf('{');
    if (firstBrace > 0) {
      cleanedResponse = cleanedResponse.substring(firstBrace);
    }

    // Si termina con texto después del JSON, encontrar el último }
    const lastBrace = cleanedResponse.lastIndexOf('}');
    if (lastBrace > 0 && lastBrace < cleanedResponse.length - 1) {
      cleanedResponse = cleanedResponse.substring(0, lastBrace + 1);
    }

    console.log('🧹 JSON limpiado, intentando parsear...');

    try {
      const parsed = JSON.parse(cleanedResponse);
      console.log('✅ JSON parseado exitosamente');
      return parsed;
    } catch (parseError) {
      console.error('❌ Error parseando JSON:', parseError);
      console.error('📄 Respuesta que falló:', cleanedResponse.substring(0, 500));
      
      // FALLBACK: Intentar reparar JSON común
      try {
        // Reemplazar comillas simples por dobles
        let repaired = cleanedResponse.replace(/'/g, '"');
        // Remover trailing commas
        repaired = repaired.replace(/,(\s*[}\]])/g, '$1');
        
        const parsedRepaired = JSON.parse(repaired);
        console.log('✅ JSON reparado y parseado exitosamente');
        return parsedRepaired;
      } catch (repairError) {
        console.error('❌ No se pudo reparar el JSON');
        throw new Error('Invalid JSON from AI');
      }
    }

  } catch (error) {
    console.error('❌ Error en OpenAI:', error);
    throw error;
  }
}

// ============================================================================
// 💪 FALLBACK EDUCATIVO - SI TODO FALLA
// ============================================================================

function generateEducationalFallback(
  chartData: ChartData,
  userProfile: UserProfile
): any {
  const { name, age } = userProfile;
  const sol = chartData.planets.find(p => p.name === 'Sol');
  const luna = chartData.planets.find(p => p.name === 'Luna');
  
  return {
    esencia_revolucionaria: `${name}, eres una fuerza revolucionaria auténtica. Tu presencia cambia energías automáticamente. 🔥`,
    
    proposito_vida: `Activar el potencial humano dormido a través de tu autenticidad radical y visión de futuro. Tu vida no es para encajar - es para TRANSFORMAR.`,
    
    planetas_clave: [
      {
        planeta: sol ? formatPlanetaryPositionEducationally(
          'Sol',
          sol.sign,
          sol.house || sol.houseNumber || 1,
          sol.degree
        ) : 'Sol (tu identidad)',
        lectura_psicologica: `Tu Sol representa tu esencia más profunda. Es quien REALMENTE eres cuando nadie te está mirando. Tu identidad auténtica que vino a brillar en este mundo.`,
        luz: `Capacidad de SER tú mismo sin disculpas. Liderazgo natural. Autenticidad magnética.`,
        sombra: `A veces sientes que debes "apagarte" para que otros brillen. Miedo a ser "demasiado".`,
        integracion: `Tu trabajo es BRILLAR sin pedir permiso. El mundo necesita tu luz específica.`
      },
      {
        planeta: luna ? formatPlanetaryPositionEducationally(
          'Luna',
          luna.sign,
          luna.house || luna.houseNumber || 1,
          luna.degree
        ) : 'Luna (tus emociones)',
        lectura_psicologica: `Tu Luna habla de tus necesidades emocionales más profundas. Lo que necesitas para sentirte seguro, nutrido, en casa dentro de ti.`,
        luz: `Capacidad de nutrir y nutrirte. Intuición poderosa. Empatía profunda.`,
        sombra: `A veces ignoras tus necesidades emocionales por "no molestar" o "ser fuerte".`,
        integracion: `Honrar tus necesidades NO es egoísmo - es SUPERVIVENCIA emocional.`
      }
    ],
    
    patrones_transformar: [
      {
        nombre_patron: "El Guerrero Herido que Ayuda a Otros",
        origen: "Aprendiste temprano que tus necesidades importan menos que las de otros",
        como_se_manifiesta: [
          "Ayudas a todos pero te cuesta pedir ayuda",
          "Te sientes culpable al poner límites",
          "Priorizas a otros sobre ti constantemente"
        ],
        dialogo_interno: [
          "No quiero ser una carga",
          "Los demás tienen problemas más importantes",
          "Puedo manejarlo solo"
        ],
        ciclo_karmico: "Ayudas a todos → Te agotas → Te resientes → Te sientes culpable por resentirte → Ayudas más para compensar",
        transformacion: "Entender que PEDIR AYUDA es un ACTO DE PODER, no de debilidad. Tus necesidades importan TANTO como las de otros."
      }
    ],
    
    rituales_activacion: [
      {
        nombre: "Ritual del Espejo de Verdad",
        descripcion: "Cada mañana, mírate al espejo 3 minutos. Di: 'Hoy elijo brillar sin pedir permiso. Mis necesidades importan. SOY DIGNO DE MI PROPIA ATENCIÓN.' Siente la resistencia. Hazlo igual.",
        frecuencia: "Diario durante 21 días"
      }
    ],
    
    accion_esta_semana: `Esta semana, pide ayuda en UNA cosa, aunque sientas que 'puedes manejarlo solo'. Observa la resistencia. Pide igual.`,
    
    afirmacion_poder: `YO ${name.toUpperCase()}, ELIJO BRILLAR SIN DISCULPAS. MIS NECESIDADES IMPORTAN. MI AUTENTICIDAD ES MI PODER. SOY DIGNO DE TODO LO BUENO QUE LLEGA.`,
    
    pregunta_reflexion: `${name}, ¿qué pasaría si dejaras de "manejarlo todo solo" y permitieras que otros te vean vulnerable?`
  };
}

// ============================================================================
// 🎯 ENDPOINT PRINCIPAL - POST
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body: NatalInterpretationRequest = await request.json();
    const { userId, natalChart, userProfile, regenerate = false } = body;

    console.log('📥 === REQUEST RECIBIDA ===');
    console.log('👤 UserId:', userId);
    console.log('👤 UserProfile:', userProfile?.name, userProfile?.age);
    console.log('📊 NatalChart planets:', natalChart?.planets?.length || 0);
    console.log('🔄 Regenerate:', regenerate);

    // ✅ ADD THIS DEBUG LOG
    console.log('🔍 ===== INTERPRET NATAL DEBUG =====');
    console.log('📊 Chart Data Received:', {
      hasPlanets: !!natalChart?.planets,
      planetsCount: natalChart?.planets?.length,
      firstPlanet: natalChart?.planets?.[0],
      hasHouses: !!natalChart?.houses,
      housesCount: natalChart?.houses?.length,
      ascendant: natalChart?.ascendant
    });
    console.log('👤 User Profile:', userProfile);
    console.log('🔄 Regenerate:', regenerate);

    // VALIDACIÓN
    if (!userId || !natalChart || !userProfile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: userId, natalChart, userProfile'
        },
        { status: 400 }
      );
    }

    if (!userProfile.name) {
      return NextResponse.json(
        {
          success: false,
          error: 'userProfile.name is required'
        },
        { status: 400 }
      );
    }

    // GENERAR INTERPRETACIÓN
    let interpretation: any;
    let method = 'unknown';

    try {
      interpretation = await generateNatalInterpretationSafe(natalChart, userProfile);
      method = 'openai-success';
      console.log('✅ Interpretación generada con OpenAI');
    } catch (openaiError) {
      console.error('⚠️ OpenAI falló, usando fallback educativo:', openaiError);
      interpretation = generateEducationalFallback(natalChart, userProfile);
      method = 'educational-fallback';
    }

    // VALIDAR que la interpretación NO tenga [object Object]
    const responseText = JSON.stringify(interpretation);
    if (responseText.includes('[object Object]')) {
      console.error('❌ Detectado [object Object] en respuesta, regenerando con fallback');
      interpretation = generateEducationalFallback(natalChart, userProfile);
      method = 'fallback-after-object-detection';
    }

    // RESPUESTA EXITOSA
    return NextResponse.json({
      success: true,
      interpretation,
      metadata: {
        method,
        generatedAt: new Date().toISOString(),
        userName: userProfile.name,
        planetsCount: natalChart.planets?.length || 0
      }
    });

  } catch (error) {
    console.error('❌ === ERROR CRÍTICO EN ENDPOINT ===');
    console.error(error);

    // RESPUESTA DE ERROR - NUNCA DEVOLVER [object Object]
    return NextResponse.json(
      {
        success: false,
        error: 'Error generating interpretation',
        errorDetails: error instanceof Error ? error.message : 'Unknown error',
        fallbackAvailable: true
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// 🧪 ENDPOINT GET - PARA TESTING
// ============================================================================

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/astrology/interpret-natal',
    version: '2.0-ultra-robust',
    features: [
      '✅ Super educativo - explica TODO',
      '✅ Nunca devuelve [object Object]',
      '✅ Parsing robusto de JSON',
      '✅ Fallback educativo si falla',
      '✅ Lenguaje para TODOS (no solo astrólogos)'
    ]
  });
}