// src/app/api/astrology/interpret-solar-return/route.ts
// =============================================================================
// ENDPOINT PARA INTERPRETACIONES DE SOLAR RETURN
// Integración OpenAI GPT-4 + Caché MongoDB + Fallbacks
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { MongoClient } from 'mongodb';
import { generateSolarReturnMasterPrompt } from '@/utils/prompts/solarReturnPrompts';
import { generateSRComparison } from '@/utils/astrology/solarReturnComparison';

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
async function generateWithOpenAI(natalChart: any, solarReturnChart: any, userProfile: any, srComparison?: any): Promise<any> {
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

    // ✅ Generar prompt maestro con comparación
    const prompt = generateSolarReturnMasterPrompt({
      natalChart,
      solarReturnChart,
      userProfile,
      returnYear: solarEssentials.year,
      srComparison
    });

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
export async function POST(request: Request) {
  console.log('🌟 ===== INICIO INTERPRET SOLAR RETURN =====');

  try {
    const body = await request.json();
    console.log('📦 Body recibido:', JSON.stringify(body, null, 2));

    const { userId, natalChart, solarReturnChart, userProfile, regenerate } = body;

    // ✅ VALIDACIONES CON LOGS
    if (!userId) {
      console.error('❌ ERROR: userId faltante');
      return NextResponse.json({
        success: false,
        error: 'userId es requerido'
      }, { status: 400 });
    }

    if (!solarReturnChart) {
      console.error('❌ ERROR: solarReturnChart faltante');
      return NextResponse.json({
        success: false,
        error: 'solarReturnChart es requerido'
      }, { status: 400 });
    }

    if (!natalChart) {
      console.error('❌ ERROR: natalChart faltante');
      return NextResponse.json({
        success: false,
        error: 'natalChart es requerido para comparación'
      }, { status: 400 });
    }

    console.log('✅ Validaciones pasadas');
    console.log('📊 Solar Return Chart:', {
      hasPlanets: !!solarReturnChart.planets,
      planetsCount: solarReturnChart.planets?.length,
      hasAscendant: !!solarReturnChart.ascendant,
      ascendantSign: solarReturnChart.ascendant?.sign
    });

    console.log('📊 Natal Chart:', {
      hasPlanets: !!natalChart.planets,
      planetsCount: natalChart.planets?.length,
      hasHouses: !!natalChart.houses,
      housesCount: natalChart.houses?.length
    });

    // ✅ GENERAR COMPARACIÓN SR
    console.log('🔄 Generando comparación Natal vs SR...');

    let srComparison;
    try {
      srComparison = generateSRComparison(natalChart, solarReturnChart);

      console.log('✅ Comparación generada:', {
        ascSRInNatalHouse: srComparison.ascSRInNatalHouse,
        mcSRInNatalHouse: srComparison.mcSRInNatalHouse,
        planetaryChangesCount: srComparison.planetaryChanges?.length,
        stelliumsNatalCount: srComparison.stelliumsNatal?.length,
        stelliumsSRCount: srComparison.stelliumsSR?.length,
        configuracionesCount: srComparison.configuracionesNatal?.length,
        aspectosCruzadosCount: srComparison.aspectosCruzados?.length
      });
    } catch (compError) {
      console.error('❌ ERROR generando comparación:', compError);
      return NextResponse.json({
        success: false,
        error: 'Error en comparación SR: ' + (compError instanceof Error ? compError.message : 'Unknown')
      }, { status: 500 });
    }

    // ✅ VERIFICAR CACHÉ (si no es regeneración forzada)
    if (!regenerate) {
      console.log('🔍 Verificando caché en MongoDB...');
      try {
        const cached = await checkCache(userId, natalChart, solarReturnChart);

        if (cached) {
          console.log('✅ Interpretación encontrada en caché:', {
            generatedAt: cached.generatedAt,
            hasInterpretation: !!cached.interpretation,
            esenciaPreview: cached.interpretation?.esencia_revolucionaria_anual?.substring(0, 50)
          });

          return NextResponse.json({
            success: true,
            data: {
              interpretation: cached.interpretation,
              cached: true,
              generatedAt: cached.generatedAt,
              method: 'mongodb_cache'
            }
          });
        } else {
          console.log('ℹ️ No hay caché disponible, generando nueva interpretación...');
        }
      } catch (cacheError) {
        console.error('⚠️ Error verificando caché (continuando):', cacheError);
      }
    } else {
      console.log('🔄 Regeneración forzada - saltando caché');
    }

    // ✅ GENERAR INTERPRETACIÓN CON OPENAI
    console.log('🤖 Llamando a OpenAI para generar interpretación...');

    let interpretation;
    try {
      interpretation = await generateWithOpenAI(
        natalChart,
        solarReturnChart,
        userProfile,
        srComparison
      );

      console.log('✅ Interpretación generada por OpenAI:', {
        hasEsencia: !!interpretation.esencia_revolucionaria_anual,
        hasProposito: !!interpretation.proposito_vida_anual,
        hasPlanAccion: !!interpretation.plan_accion,
        keys: Object.keys(interpretation)
      });
    } catch (openaiError) {
      console.error('❌ ERROR en OpenAI:', openaiError);
      console.error('Stack:', openaiError instanceof Error ? openaiError.stack : 'No stack');

      console.log('⚠️ Usando fallback debido a error OpenAI');
      interpretation = generateFallback(natalChart, solarReturnChart, userProfile);

      console.log('✅ Fallback generado:', {
        hasEsencia: !!interpretation.esencia_revolucionaria_anual,
        keys: Object.keys(interpretation)
      });
    }

    // ✅ GUARDAR EN CACHÉ
    console.log('💾 Guardando interpretación en MongoDB...');
    try {
      await saveToCache({
        userId,
        chartType: 'solar-return',
        natalChart,
        solarReturnChart,
        userProfile,
        interpretation,
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + CACHE_DURATION)
      });
      console.log('✅ Interpretación guardada en caché');
    } catch (saveError) {
      console.error('⚠️ Error guardando en caché (continuando):', saveError);
    }

    // ✅ RESPUESTA FINAL
    const response = {
      success: true,
      data: {
        interpretation,
        cached: false,
        generatedAt: new Date().toISOString(),
        method: interpretation.method || 'openai_with_comparison'
      }
    };

    console.log('✅ Respuesta final:', {
      success: response.success,
      hasInterpretation: !!response.data.interpretation,
      method: response.data.method
    });

    console.log('🌟 ===== FIN INTERPRET SOLAR RETURN =====');

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ ===== ERROR GENERAL =====');
    console.error('Error completo:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack');

    return NextResponse.json({
      success: false,
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
