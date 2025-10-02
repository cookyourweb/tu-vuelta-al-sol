// src/app/api/astrology/interpret-solar-return/route.ts
// =============================================================================
// ENDPOINT PARA INTERPRETACIONES DE SOLAR RETURN
// Integración OpenAI GPT-4 + Caché MongoDB + Fallbacks
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { MongoClient } from 'mongodb';
import { generateSolarReturnMasterPrompt } from '@/utils/prompts/solarReturnPrompts';

// ✅ CONFIGURACIÓN OPENAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ CONFIGURACIÓN MONGODB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/astrology';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas en ms

// ✅ INTERFACES
interface SolarReturnRequest {
  userId: string;
  natalChart: any;
  solarReturnChart: any;
  userProfile: {
    name: string;
    age: number;
    birthPlace: string;
    birthDate: string;
    birthTime: string;
  };
  regenerate?: boolean;
}

interface CachedInterpretation {
  _id?: string;
  userId: string;
  chartType: 'solar-return';
  natalChart: any;
  solarReturnChart: any;
  userProfile: any;
  interpretation: any;
  generatedAt: string;
  expiresAt: Date;
}

// ✅ FUNCIÓN: Verificar caché MongoDB
async function checkCache(userId: string, natalChart: any, solarReturnChart: any): Promise<CachedInterpretation | null> {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db('astrology');
    const collection = db.collection('interpretations');

    // Buscar interpretación válida (no expirada)
    const cached = await collection.findOne({
      userId,
      chartType: 'solar-return',
      'natalChart.planets': { $exists: true },
      'solarReturnChart.planets': { $exists: true },
      expiresAt: { $gt: new Date() }
    });

    await client.close();

    if (cached) {
      console.log('✅ Interpretación Solar Return encontrada en caché');
      return cached as unknown as CachedInterpretation;
    }

    return null;
  } catch (error) {
    console.error('❌ Error verificando caché:', error);
    return null;
  }
}

// ✅ FUNCIÓN: Guardar en caché
async function saveToCache(interpretation: CachedInterpretation): Promise<void> {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db('astrology');
    const collection = db.collection('interpretations');

    // Establecer expiración
    interpretation.expiresAt = new Date(Date.now() + CACHE_DURATION);

    await collection.insertOne(interpretation as any);
    await client.close();

    console.log('💾 Interpretación Solar Return guardada en caché');
  } catch (error) {
    console.error('❌ Error guardando en caché:', error);
  }
}

// ✅ FUNCIÓN: Generar interpretación con OpenAI
async function generateWithOpenAI(natalChart: any, solarReturnChart: any, userProfile: any): Promise<any> {
  try {
    console.log('🤖 Generando interpretación Solar Return con OpenAI...');

    // Preparar datos para el prompt
    const promptData = {
      userName: userProfile.name || 'Usuario',
      userAge: userProfile.age || 0,
      birthDate: userProfile.birthDate || '',
      birthTime: userProfile.birthTime || '',
      birthPlace: userProfile.birthPlace || '',
      solarReturnYear: solarReturnChart?.solarReturnInfo?.year || new Date().getFullYear(),
      natalChart: JSON.stringify(natalChart, null, 2),
      solarReturnChart: JSON.stringify(solarReturnChart, null, 2)
    };

    // Generar prompt maestro usando la función
    const prompt = generateSolarReturnMasterPrompt({
      natalChart: JSON.parse(promptData.natalChart),
      solarReturnChart: JSON.parse(promptData.solarReturnChart),
      userProfile: {
        name: promptData.userName,
        age: promptData.userAge,
        birthPlace: promptData.birthPlace,
        birthDate: promptData.birthDate,
        birthTime: promptData.birthTime
      },
      returnYear: promptData.solarReturnYear
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Eres un astrólogo profesional especializado en SOLAR RETURN (Revolución Solar), siguiendo la metodología de Mary Fortier Shea, Celeste Teal y Anthony Louis.

CONTEXTO: Solar Return es la carta astrológica levantada para el momento exacto cuando el Sol regresa a su posición natal cada año. NO es carta progresada - es una fotografía anual de energías disponibles.

METODOLOGÍA PROFESIONAL:
1. Ascendente Solar Return en Casa Natal = INDICADOR #1 (Shea)
2. Sol en Casa Solar Return = Tema central del año (Teal)
3. Planetas Angulares Solar Return = Asuntos dominantes (Louis)
4. Superposición Natal-Solar Return = Áreas de vida activadas (Shea)
5. Aspectos cruzados = Dinámicas específicas (Louis)
6. Timing mensual basado en aspectos del Sol transitante (Teal)

PRINCIPIOS:
- El Sol SIEMPRE está en el mismo grado natal en Solar Return
- La ubicación de cálculo debe ser el lugar de residencia actual
- Los otros planetas SÍ cambian de posición cada año
- Las casas se recalculan para el año solar
- Es una herramienta predictiva Y de empoderamiento

LENGUAJE:
- Profesional pero transformacional
- Directo sin ser agresivo
- Específico con casas, grados, signos reales
- Sin eufemismos innecesarios
- Enfocado en ACCIÓN, no solo descripción

RESPONDE SOLO CON JSON VÁLIDO EN ESPAÑOL. Sin texto adicional antes o después del JSON.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.8,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Parsear JSON
    const interpretation = JSON.parse(response);
    console.log('✅ Interpretación Solar Return generada exitosamente');

    return interpretation;

  } catch (error) {
    console.error('❌ Error generando con OpenAI:', error);
    throw error;
  }
}

// ✅ FUNCIÓN: Generar fallback disruptivo en ESPAÑOL
function generateFallback(natalChart: any, solarReturnChart: any, userProfile: any): any {
  console.log('🔄 Generando fallback disruptivo para Solar Return');

  const returnYear = solarReturnChart?.solarReturnInfo?.year || new Date().getFullYear();
  const solarAsc = solarReturnChart.ascendant?.sign || 'Libra';
  const solarSol = solarReturnChart.planets?.find((p: any) => p.name === 'Sol' || p.name === 'Sun');

  return {
    esencia_revolucionaria_anual: `¡${userProfile.name || 'Usuario'}, DESPIERTA! Tu año ${returnYear}-${returnYear + 1} NO es un ciclo más. Es tu REVOLUCIÓN PERSONAL obligatoria. Con Ascendente ${solarAsc}, te conviertes en un AGENTE DE CAMBIO que no puede ser ignorado. Este Solar Return te obliga a EVOLUCIONAR o PERECER en la mediocridad.`,

    proposito_vida_anual: `Tu MISIÓN NO NEGOCIABLE: DESMANTELAR toda estructura mental que te mantiene pequeño/a. En Casa ${solarSol?.house || 1}, tu Sol SR exige que emerjas como la AUTORIDAD que siempre has sido. No hay excusas. No hay retrasos. ACTIVA tu poder AHORA.`,

    tema_central_del_anio: `REVOLUCIÓN ${solarAsc} - Año de PODER OBLIGATORIO`,

    plan_accion: {
      hoy_mismo: [
        `¡URGENTE! Elimina TODA duda sobre tu valor. Tu Ascendente ${solarAsc} exige PRESENCIA TOTAL.`,
        "DESTRUYE cualquier excusa que te mantenga en la zona de confort. Escribe 3 acciones CONCRETAS que te aterroricen.",
        `Declara en voz ALTA y FURIOSA: "Soy ${solarAsc} en acción. Mi poder es IRREFUTABLE durante ${returnYear}."`
      ],
      esta_semana: [
        `INVESTIGA sin piedad las debilidades de ${solarAsc} que has estado evitando. Es hora de CONQUISTARLAS.`,
        "Establece un RITUAL DIARIO de activación. No es opcional, es OBLIGATORIO para sobrevivir este año.",
        "IDENTIFICA y ELIMINA la relación/hábito tóxico que te mantiene en el pasado. Sin anestesia."
      ],
      este_mes: [
        "LANZA un proyecto que refleje tu energía lunar anual SIN CENSURA. El miedo es para los débiles.",
        "REORGANIZA tu vida física según tu Ascendente SR. Si algo no vibra con tu poder, ¡FUERA!",
        "INVIERTE en formación que potencie tu Casa 10 SR. Tu carrera NO es un hobby, es tu DOMINIO."
      ]
    },

    declaracion_poder_anual: `Soy ${solarAsc} en acción destructiva y creadora. Mi año ${returnYear} es mi CAMPO DE BATALLA. Emergeré victorioso/a o no emergeré.`,

    advertencias: [
      "¡PELIGRO! Si ignoras Saturno SR, te aplastará como a un insecto. Sus lecciones son BRUTALES pero necesarias.",
      "Verifica tu ubicación SR con PRECISIÓN MILIMÉTRICA. Un error aquí arruina todo el año.",
      "Cuando Marte SR forme aspectos tensos, ¡DETENTE! Las decisiones impulsivas te costarán sangre, sudor y lágrimas."
    ],

    comparacion_natal_vs_solar_return: {
      planetas_que_cambian_casa: [
        {
          planeta: "Luna",
          natal: natalChart.planets?.find((p: any) => p.name === 'Luna' || p.name === 'Moon')?.house || 7,
          solar_return: solarReturnChart.planets?.find((p: any) => p.name === 'Luna' || p.name === 'Moon')?.house || 5,
          significado: "Tu corazón emocional MIGRA de zona segura a TERRITORIO DE GUERRA. Este año sientes TODO más INTENSAMENTE."
        }
      ],
      nuevos_aspectos_formados: "Aspectos SR que NO existían en tu natal: estas son tus NUEVAS HERRAMIENTAS DE PODER. Apréndelas o quédate obsoleto.",
      casas_activadas_este_anio: [1, 4, 7, 10]
    },

    eventos_clave_del_anio: [
      {
        periodo: "Primer trimestre - ACTIVACIÓN OBLIGATORIA",
        evento: "EL ASCENDENTE ${solarAsc} TE RECLAMA",
        tipo: "OBLIGACIÓN CÓSMICA",
        descripcion: "Las primeras 90 días son tu PRUEBA DE FUEGO. Si fallas aquí, el año entero es un desastre.",
        accion_recomendada: "ESTABLECE tu identidad anual con MANO DE HIERRO. ¿Quién demonios eres en este ciclo?"
      },
      {
        periodo: "Segundo trimestre - CONFRONTACIÓN DIRECTA",
        evento: "OPOSICIÓN SOLAR - EL ESPEJO BRUTAL",
        tipo: "DESAFÍO MORTAL",
        descripcion: "La realidad te golpea como un tren de carga. Tus excusas quedan expuestas y destruidas.",
        accion_recomendada: "REVISA todo. ADAPTA o MUERE. La flexibilidad no es opcional, es tu ÚNICA SALVACIÓN."
      },
      {
        periodo: "Tercer trimestre - DOMINIO Y EXPANSIÓN",
        evento: "COSECHA DEL PODER GANADO",
        tipo: "TRIUNFO OBLIGATORIO",
        descripcion: "Lo que sembraste florece. Es momento de ESCALAR sin piedad o perderlo todo.",
        accion_recomendada: "DUPLICA esfuerzos en Casa ${solarSol?.house}. Tu zona de PODER máximo debe ser IMPARABLE."
      },
      {
        periodo: "Cuarto trimestre - INTEGRACIÓN FINAL",
        evento: "PREPARACIÓN PARA EL SIGUIENTE CICLO",
        tipo: "SABIDURÍA FORZADA",
        descripcion: "Cierre consciente. DOCUMENTA todo o repite los errores el próximo año.",
        accion_recomendada: "Escribe tu carta al futuro YO. ¿Sobreviviste? ¿Evolucionaste? ¿Estás listo para más?"
      }
    ],

    insights_transformacionales: [
      `Ascendente ${solarAsc} no es una máscara, es tu NUEVA PIEL. Úsala o arráncala, pero no la ignores.`,
      "Casas vacías en SR son TU TERRITORIO VIRGEN. Conquista o quédate estancado para siempre.",
      "Aspectos al Sol SR son tus CÓDIGOS DE ACTIVACIÓN. Estúdialos como tu vida depende de ello.",
      "Tu ubicación SR determina si eres REY o ESCLAVO este año. Elige tu trono con precisión."
    ],

    rituales_recomendados: [
      "RITUAL DE INICIO: Día exacto cumpleaños - Quema tu carta de 'excusas pasadas' en fuego sagrado.",
      `RITUAL LUNAR: Cada Luna Nueva - Conecta con elementos de ${solarAsc}. Sin piedad, sin excusas.`,
      "RITUAL DIARIO: 5 minutos de MEDITACIÓN DE PODER. Visualiza tu dominación del año.",
      "RITUAL DE CIERRE: 3 días pre-cumpleaños - Escribe sangre, sudor y lágrimas. ¿Valió la pena?"
    ]
  };
}

// ✅ POST HANDLER PRINCIPAL
export async function POST(request: NextRequest) {
  try {
    console.log('🌅 Solicitud de interpretación Solar Return recibida');

    const body: SolarReturnRequest = await request.json();
    const { userId, natalChart, solarReturnChart, userProfile, regenerate = false } = body;

    // ✅ VALIDACIONES
    if (!userId) {
      return NextResponse.json({ error: 'userId requerido' }, { status: 400 });
    }

    if (!natalChart || !solarReturnChart) {
      return NextResponse.json({ error: 'natalChart y solarReturnChart requeridos' }, { status: 400 });
    }

    // ✅ VERIFICAR CACHÉ (si no se fuerza regeneración)
    if (!regenerate) {
      const cached = await checkCache(userId, natalChart, solarReturnChart);
      if (cached) {
        return NextResponse.json({
          success: true,
          interpretation: cached.interpretation,
          cached: true,
          generatedAt: cached.generatedAt
        });
      }
    }

    // ✅ GENERAR INTERPRETACIÓN
    let interpretation;

    try {
      // Intentar con OpenAI primero
      interpretation = await generateWithOpenAI(natalChart, solarReturnChart, userProfile);
    } catch (openaiError) {
      console.warn('⚠️ OpenAI falló, usando fallback:', openaiError);
      // Fallback si OpenAI falla
      interpretation = generateFallback(natalChart, solarReturnChart, userProfile);
    }

    // ✅ GUARDAR EN CACHÉ
    const cacheData: CachedInterpretation = {
      userId,
      chartType: 'solar-return',
      natalChart,
      solarReturnChart,
      userProfile,
      interpretation,
      generatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + CACHE_DURATION)
    };

    await saveToCache(cacheData);

    // ✅ RESPUESTA EXITOSA
    return NextResponse.json({
      success: true,
      interpretation,
      cached: false,
      generatedAt: cacheData.generatedAt
    });

  } catch (error) {
    console.error('❌ Error en endpoint Solar Return:', error);

    return NextResponse.json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

// ✅ GET HANDLER PARA TESTING
export async function GET() {
  return NextResponse.json({
    message: 'Endpoint Solar Return Interpretation',
    status: 'active',
    cacheDuration: `${CACHE_DURATION / (1000 * 60 * 60)} horas`
  });
}
