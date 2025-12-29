// =============================================================================
// ⚡ INTERPRET ASPECT SOLAR RETURN API ROUTE
// app/api/astrology/interpret-aspect-sr/route.ts
// Genera interpretación comparativa de aspectos: Natal vs Solar Return
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { getUserProfile } from '@/services/userDataService';
import Chart from '@/models/Chart';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// =============================================================================
// Helper: Generate Aspect Comparison (Natal vs Solar Return)
// =============================================================================
async function generateAspectComparison(
  planet1: string,
  planet2: string,
  aspectType: string,
  natalOrb: number | null,
  solarReturnOrb: number,
  year: number,
  userProfile: any
) {
  // Determinar el estado del aspecto
  let estado = 'nuevo'; // por defecto
  if (natalOrb !== null && natalOrb !== undefined) {
    if (Math.abs(solarReturnOrb - natalOrb) < 1) {
      estado = 'persiste';
    } else {
      estado = 'se_intensifica';
    }
  }

  const prompt = `Eres un astrólogo profesional que interpreta aspectos en Solar Return comparando con la carta natal.

ASPECTO: ${planet1} ${aspectType} ${planet2}
${natalOrb !== null ? `NATAL: Orbe ${natalOrb.toFixed(2)}°` : 'NATAL: NO existe este aspecto'}
SOLAR RETURN ${year}: Orbe ${solarReturnOrb.toFixed(2)}°
ESTADO: ${estado === 'nuevo' ? 'ASPECTO NUEVO (no existe en natal)' : estado === 'persiste' ? 'ASPECTO PERSISTENTE (similar en natal)' : 'ASPECTO QUE SE INTENSIFICA'}

════════════════════════════════════════════════════════

🎯 ESTRUCTURA DEL JSON:

{
  "titulo_atractivo": "${planet1} ${aspectType} ${planet2} en tu Retorno Solar ${year}",
  "subtitulo": "[Frase gancho de 8-12 palabras]",
  "estado_aspecto": "${estado}",

  "que_significa": {
    "tipo_aspecto": "${aspectType}",
    "naturaleza": "[armónico/tenso/neutral]",
    "narrativa": "[2-3 párrafos explicando qué significa este aspecto en GENERAL. ¿Qué energías combina ${planet1} con ${planet2}? ¿Qué tipo de diálogo interno o externo crea?]"
  },

  "como_se_activa_este_año": {
    "orbe": "${solarReturnOrb.toFixed(2)}°",
    "intensidad": "[exacto/fuerte/moderado/suave según orbe]",
    "narrativa": "[2 párrafos sobre CÓMO este aspecto se manifiesta específicamente este año. ¿En qué áreas de vida se nota? ¿Qué situaciones lo activan?]",
    "manifestaciones": ["[manifestación 1]", "[manifestación 2]", "[manifestación 3]", "[manifestación 4]"]
  },

  "cruce_con_natal": {
    "contexto_natal": "${natalOrb !== null ? `Este aspecto ya existe en tu natal con orbe ${natalOrb.toFixed(2)}°` : 'Este aspecto NO existe en tu carta natal'}",
    "narrativa": "[Si es NUEVO: explicar por qué este aspecto se siente desconocido y qué está pidiendo que desarrolles. Si PERSISTE: explicar cómo tu patrón natal se intensifica. Si SE INTENSIFICA: explicar el cambio de intensidad]",
    "impacto_diferencial": "[¿Cómo cambia tu experiencia habitual? ¿Qué patrones natales se activan o se desactivan?]"
  },

  "impacto_real": {
    "areas_vida": ["[área 1]", "[área 2]", "[área 3]"],
    "narrativa": "[2-3 párrafos CONCRETOS sobre cómo esto afecta tu vida diaria. Decisiones, relaciones, trabajo, emociones. NO metáforas - EJEMPLOS REALES.]",
    "señales": ["[señal 1: cómo lo notas]", "[señal 2]", "[señal 3]"]
  },

  "como_trabajarlo": {
    "enfoque": "[¿Qué actitud tomar ante este aspecto?]",
    "acciones": {
      "hacer": ["[acción específica 1]", "[acción 2]", "[acción 3]", "[acción 4]"],
      "evitar": ["[qué no hacer 1]", "[qué no hacer 2]", "[qué no hacer 3]"]
    },
    "momento_clave": "[¿Cuándo este aspecto está más activo durante el año?]"
  },

  "sombras": {
    "trampa_automatica": "[Patrón automático negativo que este aspecto puede activar]",
    "antidoto": "[Cómo contrarrestar esa trampa]",
    "oportunidad_oculta": "[¿Qué regalo trae este aspecto si se trabaja conscientemente?]"
  },

  "sintesis": {
    "frase_clave": "[Una frase potente de 1 línea]",
    "resumen": "[2-3 frases resumiendo el año con este aspecto]"
  },

  "drawer": {
    "titulo": "${planet1} ${aspectType} ${planet2} en tu Retorno Solar ${year}",
    "educativo": "**¿QUÉ ES ESTE ASPECTO?**\\n\\n[que_significa.narrativa]\\n\\n**Tipo:** ${aspectType}\\n**Naturaleza:** [armónico/tenso]\\n**Orbe:** ${solarReturnOrb.toFixed(2)}°",
    "observador": "**CÓMO SE ACTIVA ESTE AÑO**\\n\\n[como_se_activa_este_año.narrativa]\\n\\n**Se manifiesta en:**\\n${`• [manifestaciones con bullets]`}",
    "impacto_real": "**CRUCE CON TU NATAL**\\n\\n[cruce_con_natal.narrativa]\\n\\n**IMPACTO EN TU VIDA:**\\n\\n[impacto_real.narrativa]\\n\\n**Señales de que está activo:**\\n${`• [señales con bullets]`}",
    "sombras": [{
      "nombre": "Sombras y Oportunidades",
      "descripcion": "Aspectos a cuidar",
      "trampa": "❌ **TRAMPA:** [sombras.trampa_automatica]",
      "regalo": "✅ **ANTÍDOTO:** [sombras.antidoto]\\n\\n💎 **OPORTUNIDAD:** [sombras.oportunidad_oculta]"
    }],
    "sintesis": {
      "frase": "[sintesis.frase_clave]\\n\\n[sintesis.resumen]",
      "declaracion": "**✅ HAZ:**\\n${`• [acciones.hacer con bullets]`}\\n\\n**❌ EVITA:**\\n${`• [acciones.evitar con bullets]`}"
    }
  }
}

════════════════════════════════════════════════════════

TONO Y ESTILO:
- Profesional, directo, sin metáforas largas
- Concreto y accionable
- Validar la experiencia del usuario
- Comparar con natal cuando aplique
- Usar ejemplos específicos en lugar de descripciones abstractas

IMPORTANTE:
- Si es aspecto NUEVO: enfatizar que esto es algo que no has experimentado antes en esta forma
- Si PERSISTE: explicar que tu patrón natal se intensifica este año
- Si SE INTENSIFICA: explicar el cambio de intensidad y qué significa

Devuelve SOLO el JSON completo siguiendo EXACTAMENTE esta estructura.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.85,
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from OpenAI');

  return JSON.parse(content);
}

// =============================================================================
// POST - Generate aspect comparison interpretation
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planet1, planet2, aspectType, solarReturnOrb, year } = body;

    console.log('⚡ [ASPECT-SR] Generating comparison for:', `${planet1} ${aspectType} ${planet2}`);
    console.log('⚡ [ASPECT-SR] Year:', year);
    console.log('⚡ [ASPECT-SR] SR Orb:', solarReturnOrb);

    if (!userId || !planet1 || !planet2 || !aspectType || solarReturnOrb === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, planet1, planet2, aspectType, solarReturnOrb' },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    // Fetch user profile
    const userProfile = await getUserProfile(userId);

    const convertedProfile = userProfile ? {
      name: userProfile.name || 'Usuario',
      age: 0,
      birthDate: userProfile.birthData?.date || '',
      birthTime: userProfile.birthData?.time || '',
      birthPlace: userProfile.birthData?.location || ''
    } : {
      name: 'Usuario',
      age: 0,
      birthDate: '',
      birthTime: '',
      birthPlace: ''
    };

    // Obtener carta natal para comparar aspectos
    const chartDoc = await Chart.findOne({ userId });

    let natalOrb: number | null = null;

    if (chartDoc?.natalChart?.aspects) {
      // Buscar el aspecto en natal (puede estar como planet1-planet2 o planet2-planet1)
      const natalAspect = chartDoc.natalChart.aspects.find((a: any) =>
        (a.planet1 === planet1 && a.planet2 === planet2 && a.type === aspectType) ||
        (a.planet1 === planet2 && a.planet2 === planet1 && a.type === aspectType)
      );

      if (natalAspect) {
        natalOrb = natalAspect.orb;
        console.log(`📍 [ASPECT-SR] Aspecto encontrado en natal - Orbe: ${natalOrb}°`);
      } else {
        console.log(`📍 [ASPECT-SR] Aspecto NO existe en natal - es NUEVO`);
      }
    }

    // Generar comparación usando OpenAI
    const comparison = await generateAspectComparison(
      planet1,
      planet2,
      aspectType,
      natalOrb,
      solarReturnOrb,
      year || new Date().getFullYear(),
      convertedProfile
    );

    if (!comparison) {
      throw new Error('Failed to generate aspect comparison');
    }

    // Guardar en MongoDB
    const aspectKey = `${planet1}-${planet2}-${aspectType}`;

    console.log(`📝 [ASPECT-SR] Guardando en: aspects_solar_return.${aspectKey}`);

    await db.collection('interpretations').updateOne(
      { userId, chartType: 'solar-return', year: year || new Date().getFullYear() },
      {
        $set: {
          [`interpretations.aspects_solar_return.${aspectKey}`]: comparison,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log('✅ [ASPECT-SR] Comparison saved:', aspectKey);

    return NextResponse.json({
      success: true,
      interpretation: comparison,
      aspectKey,
      message: `Comparación de aspecto ${planet1} ${aspectType} ${planet2} generada correctamente`,
    });

  } catch (error) {
    console.error('❌ [ASPECT-SR] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Server error',
    }, { status: 500 });
  }
}

// =============================================================================
// GET - Retrieve cached aspect SR interpretation
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const planet1 = searchParams.get('planet1');
    const planet2 = searchParams.get('planet2');
    const aspectType = searchParams.get('aspectType');
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    if (!userId || !planet1 || !planet2 || !aspectType) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    const aspectKey = `${planet1}-${planet2}-${aspectType}`;

    console.log(`🔍 [ASPECT-SR] Buscando: ${aspectKey} año ${year}`);

    const doc = await db.collection('interpretations').findOne(
      { userId, chartType: 'solar-return', year },
      { projection: { [`interpretations.aspects_solar_return.${aspectKey}`]: 1 } }
    );

    if (doc?.interpretations?.aspects_solar_return?.[aspectKey]) {
      console.log('✅ [ASPECT-SR] Found cached interpretation');
      return NextResponse.json({
        success: true,
        interpretation: doc.interpretations.aspects_solar_return[aspectKey],
        cached: true,
      });
    }

    console.log('⚠️ [ASPECT-SR] No cached interpretation found');
    return NextResponse.json({
      success: false,
      error: 'No interpretation found',
      cached: false,
    }, { status: 404 });

  } catch (error) {
    console.error('❌ [ASPECT-SR] Error retrieving:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Server error',
    }, { status: 500 });
  }
}
