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

    // ✅ Extraer solo datos esenciales para reducir tokens
    const natalEssentials = {
      sun: natalChart.planets?.find((p: any) => p.name === 'Sol' || p.name === 'Sun'),
      moon: natalChart.planets?.find((p: any) => p.name === 'Luna' || p.name === 'Moon'),
      ascendant: natalChart.ascendant,
      midheaven: natalChart.midheaven
    };

    const solarEssentials = {
      sun: solarReturnChart.planets?.find((p: any) => p.name === 'Sol' || p.name === 'Sun'),
      moon: solarReturnChart.planets?.find((p: any) => p.name === 'Luna' || p.name === 'Moon'),
      ascendant: solarReturnChart.ascendant,
      midheaven: solarReturnChart.midheaven,
      year: solarReturnChart.solarReturnInfo?.year || new Date().getFullYear()
    };

    // ✅ Prompt ULTRA-COMPACTO (metodología Shea-Teal-Louis)
    const prompt = `Genera interpretación Solar Return año ${solarEssentials.year} para ${userProfile.name}.

DATOS CLAVE:
Natal: Sol ${natalEssentials.sun?.sign || ''} Casa ${natalEssentials.sun?.house || 1}, ASC ${natalEssentials.ascendant?.sign || ''}
Solar: Sol ${solarEssentials.sun?.sign || ''} Casa ${solarEssentials.sun?.house || 1}, ASC ${solarEssentials.ascendant?.sign || ''}

METODOLOGÍA (Shea-Teal-Louis):
1. ASC Solar en casa natal = tema central año
2. Sol Solar en casa natal = energía vital
3. Comparar posiciones natal vs solar

Responde SOLO con JSON válido en español:
{
  "esencia_revolucionaria_anual": "Declaración disruptiva del año (150 palabras)",
  "proposito_vida_anual": "Misión del año (100 palabras)",
  "tema_central_del_anio": "Título del año",
  "plan_accion": {
    "hoy_mismo": ["acción 1", "acción 2", "acción 3"],
    "esta_semana": ["acción 1", "acción 2", "acción 3"],
    "este_mes": ["acción 1", "acción 2", "acción 3"]
  },
  "declaracion_poder_anual": "Frase de poder",
  "advertencias": ["advertencia 1", "advertencia 2", "advertencia 3"],
  "eventos_clave_del_anio": [
    {
      "periodo": "Trimestre 1",
      "evento": "Nombre",
      "tipo": "Tipo",
      "descripcion": "Descripción breve",
      "accion_recomendada": "Acción"
    }
  ],
  "insights_transformacionales": ["insight 1", "insight 2", "insight 3"],
  "rituales_recomendados": ["ritual 1", "ritual 2", "ritual 3"]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo', // ✅ CAMBIADO de 'gpt-4' a 'gpt-4-turbo'
      messages: [
        {
          role: 'system',
          content: `Eres astrólogo profesional especializado en Solar Return (metodología Shea-Teal-Louis).

PRINCIPIOS TÉCNICOS:
- Solar Return = carta cuando Sol regresa a posición natal cada año
- ASC Solar en casa natal = INDICADOR #1 (tema central año)
- Sol Solar en casa natal = dónde fluye energía vital
- Comparar posiciones natal vs solar = áreas activadas

LENGUAJE:
- Profesional pero transformacional
- Directo, específico, sin eufemismos
- Enfocado en ACCIÓN

RESPONDE SOLO JSON VÁLIDO EN ESPAÑOL. Sin texto adicional.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 3000, // ✅ Aumentado de 2000
      temperature: 0.8,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Limpiar markdown si existe
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }

  

  const interpretation = JSON.parse(cleanedResponse);
    console.log('🎯 INTERPRETACIÓN GENERADA:', JSON.stringify(interpretation, null, 2)); // ✅ AÑADIR
    console.log('✅ Interpretación Solar Return generada exitosamente');

    return interpretation;;

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
    esencia_revolucionaria_anual: `${userProfile.name || 'Usuario'}, tu año ${returnYear}-${returnYear + 1} NO es un ciclo más. Es tu REVOLUCIÓN PERSONAL obligatoria. Con Ascendente ${solarAsc}, te conviertes en un AGENTE DE CAMBIO que no puede ser ignorado. Este Solar Return te obliga a EVOLUCIONAR o quedarte atrás.`,

    proposito_vida_anual: `Tu MISIÓN este año: DESMANTELAR toda estructura mental que te mantiene pequeño/a. En Casa ${solarSol?.house || 1}, tu Sol exige que emerjas como la AUTORIDAD que siempre has sido. No hay excusas. ACTIVA tu poder AHORA.`,

    tema_central_del_anio: `REVOLUCIÓN ${solarAsc} - Año de PODER TOTAL`,

    plan_accion: {
      hoy_mismo: [
        `¡URGENTE! Elimina TODA duda sobre tu valor. Tu Ascendente ${solarAsc} exige PRESENCIA TOTAL.`,
        "DESTRUYE cualquier excusa que te mantenga en la zona de confort. Escribe 3 acciones CONCRETAS que te aterroricen.",
        `Declara en voz ALTA: "Soy ${solarAsc} en acción. Mi poder es IRREFUTABLE durante ${returnYear}."`
      ],
      esta_semana: [
        `INVESTIGA sin piedad las debilidades de ${solarAsc} que has estado evitando.`,
        "Establece un RITUAL DIARIO de activación. No es opcional.",
        "IDENTIFICA y ELIMINA la relación/hábito tóxico que te mantiene en el pasado."
      ],
      este_mes: [
        "LANZA un proyecto que refleje tu energía lunar anual SIN CENSURA.",
        "REORGANIZA tu vida física según tu Ascendente Solar Return.",
        "INVIERTE en formación que potencie tu Casa 10. Tu carrera es tu DOMINIO."
      ]
    },

    declaracion_poder_anual: `Soy ${solarAsc} en acción destructiva y creadora. Mi año ${returnYear} es mi CAMPO DE BATALLA. Emergeré victorioso/a.`,

    advertencias: [
      "¡PELIGRO! Si ignoras Saturno Solar Return, te aplastará. Sus lecciones son BRUTALES pero necesarias.",
      "Verifica tu ubicación Solar Return con PRECISIÓN. Un error aquí arruina todo el año.",
      "Cuando Marte forme aspectos tensos, ¡DETENTE! Las decisiones impulsivas te costarán."
    ],

    eventos_clave_del_anio: [
      {
        periodo: "Primer trimestre - ACTIVACIÓN OBLIGATORIA",
        evento: `ASCENDENTE ${solarAsc} TE RECLAMA`,
        tipo: "OBLIGACIÓN CÓSMICA",
        descripcion: "Los primeros 90 días son tu PRUEBA DE FUEGO. Si fallas aquí, el año entero es un desastre.",
        accion_recomendada: "ESTABLECE tu identidad anual con MANO DE HIERRO. ¿Quién eres en este ciclo?"
      },
      {
        periodo: "Segundo trimestre - CONFRONTACIÓN DIRECTA",
        evento: "OPOSICIÓN SOLAR - EL ESPEJO BRUTAL",
        tipo: "DESAFÍO MORTAL",
        descripcion: "La realidad te golpea. Tus excusas quedan expuestas y destruidas.",
        accion_recomendada: "REVISA todo. ADAPTA o MUERE. La flexibilidad es tu ÚNICA SALVACIÓN."
      },
      {
        periodo: "Tercer trimestre - DOMINIO Y EXPANSIÓN",
        evento: "COSECHA DEL PODER GANADO",
        tipo: "TRIUNFO OBLIGATORIO",
        descripcion: "Lo que sembraste florece. Momento de ESCALAR sin piedad.",
        accion_recomendada: `DUPLICA esfuerzos en Casa ${solarSol?.house || 1}. Tu zona de PODER máximo debe ser IMPARABLE.`
      },
      {
        periodo: "Cuarto trimestre - INTEGRACIÓN FINAL",
        evento: "PREPARACIÓN PARA EL SIGUIENTE CICLO",
        tipo: "SABIDURÍA FORZADA",
        descripcion: "Cierre consciente. DOCUMENTA todo o repites los errores.",
        accion_recomendada: "Escribe tu carta al futuro YO. ¿Sobreviviste? ¿Evolucionaste?"
      }
    ],

    insights_transformacionales: [
      `Ascendente ${solarAsc} no es una máscara, es tu NUEVA PIEL.`,
      "Casas vacías en Solar Return son TU TERRITORIO VIRGEN. Conquista o quédate estancado.",
      "Aspectos al Sol Solar Return son tus CÓDIGOS DE ACTIVACIÓN.",
      "Tu ubicación Solar Return determina si eres REY o ESCLAVO este año."
    ],

    rituales_recomendados: [
      "RITUAL DE INICIO: Día exacto cumpleaños - Quema tu carta de 'excusas pasadas'.",
      `RITUAL LUNAR: Cada Luna Nueva - Conecta con elementos de ${solarAsc}.`,
      "RITUAL DIARIO: 5 minutos de MEDITACIÓN DE PODER. Visualiza tu dominación del año.",
      "RITUAL DE CIERRE: 3 días pre-cumpleaños - Escribe sangre, sudor y lágrimas."
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
