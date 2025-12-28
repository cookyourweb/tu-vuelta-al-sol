// =============================================================================
// 🪐 INTERPRET PLANET API ROUTE
// app/api/astrology/interpret-planet/route.ts
// Genera interpretación de UN SOLO planeta
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { generatePlanetInterpretation } from '@/services/tripleFusedInterpretationService';
import { getUserProfile } from '@/services/userDataService';
import Chart from '@/models/Chart';
import * as admin from 'firebase-admin';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// =============================================================================
// Helper: Generate Planet Comparison (Natal vs Solar Return)
// =============================================================================
async function generatePlanetComparison(
  planetName: string,
  natal: { sign: string; house: number },
  solarReturn: { sign: string; house: number },
  year: number,
  userProfile: any
) {
  const prompt = `Eres un astrólogo profesional especializado en Solar Returns. Vas a generar una comparación PROFUNDA y TRANSFORMADORA entre la posición natal de un planeta y su posición en Solar Return.

PLANETA: ${planetName}
NATAL: ${planetName} en ${natal.sign}, Casa ${natal.house}
SOLAR RETURN ${year}: ${planetName} en ${solarReturn.sign}, Casa ${solarReturn.house}

USUARIO:
- Nombre: ${userProfile.name || 'Usuario'}
- Edad: ${userProfile.age || 'N/A'}

════════════════════════════════════════════════════════
LÓGICA PROFESIONAL QUE DEBES SEGUIR:

A) QUIÉN ERES (NATAL) → patrón estable, automático
B) QUÉ SE ACTIVA (SOLAR) → escenario del año
C) TENSIÓN / AJUSTE → dónde tienes que cambiar el comportamiento
D) IMPACTO REAL → cómo se nota en decisiones, cuerpo, mente, relaciones
E) ACCIÓN CONCRETA → qué hacer, qué evitar, qué pasa si no lo haces

════════════════════════════════════════════════════════

IMPORTANTE:
- Tu texto debe TRANSFORMAR, no solo describir
- Debe sentirse VIVENCIAL: "esto me pasa A MÍ"
- Incluir CONFLICTO INTERNO entre natal y solar
- Mostrar CONSECUENCIAS REALES si actúa / si no actúa
- Usar segunda persona (tú) para dirigirte al usuario
- Lenguaje MOTIVADOR y ACCIONABLE
- Mostrar el RIESGO NATAL y la OPORTUNIDAD DEL AÑO
- SER CONCRETO: mencionar situaciones específicas, no teoría abstracta
- NO usar lenguaje poético - usar lenguaje DIRECTO y POTENTE

════════════════════════════════════════════════════════

Genera un JSON con esta estructura EXACTA:

{
  "natal": {
    "ubicacion": "${planetName} en ${natal.sign}, Casa ${natal.house}",
    "descripcion": "Tu [energía/expansión/acción/etc.] natural ocurre cuando [patrón específico].\\n\\n[Explicar cómo funciona este planeta naturalmente - 3-4 líneas]\\n\\nConfías en: [lista de 2-3 items]\\n\\n**Tu riesgo natal:** [riesgo específico de esta posición natal - 1 línea clara]"
  },
  "solar_return": {
    "ubicacion": "${planetName} en ${solarReturn.sign}, Casa ${solarReturn.house}",
    "descripcion": "Este año **no se trata de** [lo que hacías antes], sino de [lo nuevo que se activa].\\n\\nLa [expansión/acción/etc.] llega a través de:\\n- [item 1]\\n- [item 2]\\n- [item 3]\\n\\n**Si no [acción], no se activa.**\\n**Si no [acción], no crece.**"
  },
  "comparacion": "**Normalmente:**\\n- [patrón natal 1]\\n- [patrón natal 2]\\n- [patrón natal 3]\\n\\n**Este año:**\\n- [nuevo patrón 1]\\n- [nuevo patrón 2]\\n- [nuevo patrón 3]\\n\\n👉 El [crecimiento/cambio/etc.] no viene de [viejo patrón], viene de [nuevo patrón].\\n\\n**Lo notarás así:**\\n• [síntoma concreto 1]\\n• [síntoma concreto 2]\\n• [oportunidad que aparece]\\n\\n**Si te quedas en [patrón antiguo]:**\\n• [consecuencia negativa 1]\\n• [consecuencia negativa 2]",
  "accion": "**Este año ${planetName} te pide:**\\n\\n✅ [acción concreta 1]\\n✅ [acción concreta 2]\\n✅ [acción concreta 3]\\n✅ [acción concreta 4]\\n\\n**No te pide:**\\n❌ [lo que NO hacer 1]\\n❌ [lo que NO hacer 2]\\n❌ [lo que NO hacer 3]\\n\\n⚠️ **SOMBRA A TRABAJAR:** [sombra específica de esta combinación]\\n\\n💡 **Clave:** [frase directa de máximo 10 palabras]",
  "frase_clave": "[Frase POTENTE de máximo 12 palabras que capture la esencia de la activación]",
  "drawer": {
    "titulo": "${planetName}: Natal vs Solar Return ${year}",
    "educativo": "🔹 CÓMO ERES NORMALMENTE (Carta Natal)\\n\\n📍 ${planetName} en ${natal.sign} · Casa ${natal.house}\\n\\n[descripción natal completa con riesgo natal]",
    "poderoso": "🔸 QUÉ SE ACTIVA ESTE AÑO (Retorno Solar)\\n\\n📍 ${planetName} en ${solarReturn.sign} · Casa ${solarReturn.house}\\n\\n[descripción solar return con condiciones de activación]",
    "impacto_real": "🔁 DÓNDE SE AJUSTA TU MANERA DE [VERBO]\\n\\n[comparación completa con síntomas y consecuencias]",
    "sombras": [{
      "nombre": "Acción Recomendada ${year}",
      "descripcion": "Qué hacer y qué evitar",
      "trampa": "❌ **Trampas:** [trampas específicas separadas por ·]",
      "regalo": "✅ **Acciones:** [acciones concretas separadas por ·]"
    }],
    "sintesis": {
      "frase": "[Frase inicial potente]. Cuando [acción positiva], tu [energía] se [resultado]. Cuando [acción negativa], se [consecuencia].",
      "declaracion": "\"Mi ${planetName} este año [declaración específica del año en primera persona].\""
    }
  }
}

════════════════════════════════════════════════════════

EJEMPLO DE TONO CORRECTO:

❌ MAL: "Júpiter en Acuario te hace visionario"
✅ BIEN: "Tu expansión natural ocurre cuando eres fiel a tu forma única de ver el mundo. Creces siendo diferente, rompiendo moldes y siguiendo ideas que otros aún no entienden."

❌ MAL: "Este año expande comunicación"
✅ BIEN: "Este año no se trata de ser más visionaria, sino de explicar, compartir y mover tus ideas. Si no hablas, no se activa. Si no preguntas, no crece."

════════════════════════════════════════════════════════

Devuelve SOLO el JSON, sin explicaciones adicionales.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from OpenAI');

  return JSON.parse(content);
}


// =============================================================================
// POST - Generate single planet interpretation
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planetName, sign, house, degree, chartType, year } = body;

    console.log('🪐 [PLANET] Generating interpretation for:', planetName);
    console.log('🪐 [PLANET] Chart type:', chartType);
    console.log('🪐 [PLANET] Year:', year);

    if (!userId || !planetName || !sign || !house) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, planetName, sign, house' },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    // Fetch user profile
    const userProfile = await getUserProfile(userId);
    if (!userProfile) {
      console.warn('⚠️ [PLANET] User profile not found, using defaults');
    }

    // ⭐ SOLAR RETURN: Generar comparación Natal vs SR
    if (chartType === 'solar-return') {
      console.log('🔄 [PLANET] Generando COMPARACIÓN Natal vs Solar Return');

      // Obtener carta natal del usuario
      const chartDoc = await Chart.findOne({ userId });
      console.log('📊 Chart document found:', !!chartDoc);
      console.log('📊 Has natalChart:', !!chartDoc?.natalChart);
      console.log('📊 Has planets:', !!chartDoc?.natalChart?.planets);

      if (!chartDoc?.natalChart?.planets) {
        throw new Error('Carta natal no encontrada - se necesita para generar comparación');
      }

      // Buscar planeta en carta natal
      const natalPlanet = chartDoc.natalChart.planets.find((p: any) => p.name === planetName);
      if (!natalPlanet) {
        throw new Error(`Planeta ${planetName} no encontrado en carta natal`);
      }

      console.log(`📍 NATAL: ${planetName} en ${natalPlanet.sign} Casa ${natalPlanet.house}`);
      console.log(`📍 SR ${year}: ${planetName} en ${sign} Casa ${house}`);

      // Generar comparación usando OpenAI
      const comparison = await generatePlanetComparison(
        planetName,
        { sign: natalPlanet.sign, house: natalPlanet.house },
        { sign, house },
        year,
        userProfile || { name: '', age: 0, birthDate: '', birthPlace: '' }
      );

      if (!comparison) {
        throw new Error('Failed to generate planet comparison');
      }

      // Guardar en comparaciones_planetarias de Solar Return
      const planetKeyLower = planetName.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // quitar acentos

      console.log(`📝 [PLANET] Guardando comparación en: comparaciones_planetarias.${planetKeyLower}`);

      await db.collection('interpretations').updateOne(
        { userId, chartType: 'solar-return', year: year || new Date().getFullYear() },
        {
          $set: {
            [`interpretations.comparaciones_planetarias.${planetKeyLower}`]: comparison,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );

      console.log('✅ [PLANET] Comparación guardada:', planetKeyLower);

      return NextResponse.json({
        success: true,
        interpretation: comparison,
        planetKey: planetKeyLower,
        message: `Comparación de ${planetName} generada correctamente`,
      });
    }

    // ⭐ NATAL: Generar interpretación individual (lógica original)
    const interpretation = await generatePlanetInterpretation(
      planetName,
      sign,
      house,
      degree || 0,
      userProfile || { name: '', age: 0, birthDate: '', birthPlace: '' }
    );

    if (!interpretation) {
      throw new Error('Failed to generate planet interpretation');
    }

    console.log('✅ [PLANET] Generated interpretation for:', planetName);

    // Save to MongoDB
    const planetKey = `${planetName}-${sign}-${house}`;

    // Determinar categoría del planeta
    let section = 'planets'; // Por defecto

    // Nodos se guardan en "nodes"
    if (planetName.includes('Nodo')) {
      section = 'nodes';
      console.log('🎯 [PLANET] Detectado NODO - guardando en sección: nodes');
    }
    // Asteroides se guardan en "asteroids"
    else if (['Quirón', 'Lilith', 'Ceres', 'Pallas', 'Juno', 'Vesta'].includes(planetName)) {
      section = 'asteroids';
      console.log('🎯 [PLANET] Detectado ASTEROIDE - guardando en sección: asteroids');
    }

    console.log(`📝 [PLANET] Guardando en sección: ${section}`);
    console.log(`📝 [PLANET] Key completo: ${section}.${planetKey}`);

    await db.collection('interpretations').updateOne(
      { userId, chartType: 'natal' },
      {
        $set: {
          [`interpretations.${section}.${planetKey}`]: interpretation,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log('✅ [PLANET] Saved to MongoDB:', `${section}.${planetKey}`);

    return NextResponse.json({
      success: true,
      interpretation,
      planetKey,
      message: `Interpretación de ${planetName} generada correctamente`,
    });

  } catch (error) {
    console.error('❌ [PLANET] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Server error',
    }, { status: 500 });
  }
}