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
  const prompt = `Eres un astrólogo profesional especializado en Solar Returns. Vas a generar una comparación PROFUNDA, ESPECÍFICA y TRANSFORMADORA entre la posición natal de un planeta y su posición en Solar Return.

PLANETA: ${planetName}
NATAL: ${planetName} en ${natal.sign}, Casa ${natal.house}
SOLAR RETURN ${year}: ${planetName} en ${solarReturn.sign}, Casa ${solarReturn.house}

USUARIO:
- Nombre: ${userProfile.name || 'Usuario'}
- Edad: ${userProfile.age || 'N/A'}

════════════════════════════════════════════════════════
LÓGICA PROFESIONAL:

A) QUIÉN ERES (NATAL) → patrón estable de ${planetName} en ${natal.sign} Casa ${natal.house}
B) QUÉ SE ACTIVA (SOLAR) → ${planetName} en ${solarReturn.sign} Casa ${solarReturn.house} este año
C) TENSIÓN / AJUSTE → diferencia entre Casa ${natal.house} y Casa ${solarReturn.house}
D) IMPACTO REAL → síntomas específicos, decisiones concretas, cambios observables
E) ACCIÓN CONCRETA → acciones específicas (no genéricas como "sé creativo")

════════════════════════════════════════════════════════

IMPORTANTE - LEE ESTO COMPLETAMENTE:

1. **ESPECIFICIDAD DE CASAS**:
   - Debes explicar el significado de Casa ${natal.house} vs Casa ${solarReturn.house}
   - NO digas "actúas con cautela" - DI "actúas en tu entorno cercano, con palabras, en conversaciones del día a día" (si Casa 3)
   - Ejemplo: Casa 3 = comunicación cercana, Casa 5 = escenario, protagonismo público

2. **NARRATIVA, NO LISTAS**:
   - Usa párrafos conectados, no solo bullets
   - Cuenta una HISTORIA de transformación
   - "Tu [planeta] natal funciona así: [2-3 frases]. Este año cambia porque [2-3 frases explicando por qué]."

3. **EJEMPLOS CONCRETOS DE VIDA REAL**:
   ❌ MAL: "Deseo de destacar"
   ✅ BIEN: "Te darán ganas de subir tu trabajo a redes, de hablar en público, de ponerte al frente de un proyecto, de que te vean"

   ❌ MAL: "Mayor creatividad"
   ✅ BIEN: "Querrás crear algo que lleve tu nombre, que muestre tu estilo, que te diferencie"

4. **ACCIONES ESPECÍFICAS**:
   ❌ MAL: "Lidera con creatividad"
   ✅ BIEN: "Crea un proyecto que muestre tu trabajo públicamente. Comparte tu proceso en redes. Organiza algo donde seas visible. Di que sí a estar al frente."

5. **CONTRASTE ESPECÍFICO POR SIGNO Y CASA**:
   - ${natal.sign} Casa ${natal.house} tiene una energía MUY diferente a ${solarReturn.sign} Casa ${solarReturn.house}
   - Explica CÓMO se siente esa diferencia en la vida diaria
   - Ejemplo: "Normalmente actúas desde la estabilidad y lo cercano (Tauro Casa 3). Este año necesitas actuar desde el protagonismo y lo visible (Leo Casa 5)."

6. **CONSECUENCIAS REALES**:
   - No digas "estancamiento" - DI "te sentirás frustrado porque tendrás ideas pero no las mostrarás, verás oportunidades pasar porque no te atreviste a estar visible"

════════════════════════════════════════════════════════

ESTRUCTURA JSON:

{
  "natal": {
    "ubicacion": "${planetName} en ${natal.sign}, Casa ${natal.house}",
    "descripcion": "Tu ${planetName} natal funciona así: [2-3 frases narrativas explicando cómo actúa naturalmente este planeta en ${natal.sign} Casa ${natal.house}]. [Nueva línea] [Explicar qué significa Casa ${natal.house} en la práctica - no teoría, sino cómo se vive].\\n\\nConfías en:\\n• [item específico 1 - NO genérico]\\n• [item específico 2]\\n• [item específico 3]\\n\\n**Tu riesgo natal:** [Riesgo específico de ${natal.sign} Casa ${natal.house} - 1-2 frases concretas]"
  },
  "solar_return": {
    "ubicacion": "${planetName} en ${solarReturn.sign}, Casa ${solarReturn.house}",
    "descripcion": "Este año **no se trata de** [patrón natal específico], sino de [lo nuevo que se activa con ${solarReturn.sign} Casa ${solarReturn.house}]. [Explicar qué significa Casa ${solarReturn.house} en la práctica].\\n\\nLa [acción/expansión/energía] llega a través de:\\n• [situación concreta 1 - no "creatividad", sino "crear algo que muestre tu estilo"]\\n• [situación concreta 2]\\n• [situación concreta 3]\\n• [situación concreta 4]\\n\\n**Si no [acción específica], no se activa.**\\n**Si no [acción específica 2], no crece.**"
  },
  "comparacion": "**Normalmente** (${natal.sign} Casa ${natal.house}):\\n[Párrafo narrativo de 2-3 frases describiendo cómo actúas normalmente - específico, no genérico]\\n\\n**Este año** (${solarReturn.sign} Casa ${solarReturn.house}):\\n[Párrafo narrativo de 2-3 frases describiendo cómo necesitas actuar este año - específico, mencionar Casa ${solarReturn.house}]\\n\\n👉 [Frase de transición explicando el ajuste necesario].\\n\\n**Lo notarás así en tu vida diaria:**\\n• [Síntoma observable 1 - ejemplo: "Te darán ganas de..."]\\n• [Síntoma observable 2 - ejemplo: "Te sentirás inquieto cuando..."]\\n• [Oportunidad que aparece - ejemplo: "Llegarán situaciones donde..."]\\n• [Cambio interno - ejemplo: "Pensarás diferente sobre..."]\\n\\n**Si te quedas en ${natal.sign} Casa ${natal.house}:**\\n• [Consecuencia específica 1 - no "estancamiento", sino qué sentirás exactamente]\\n• [Consecuencia específica 2 - qué oportunidades perderás]\\n• [Frustración concreta - cómo se manifestará]",
  "accion": "**Este año ${planetName} te pide:**\\n\\n✅ [Acción concreta 1 - ejemplo: "Comparte tu trabajo en redes semanalmente"]\\n✅ [Acción concreta 2 - ejemplo: "Di que sí a liderar un proyecto"]\\n✅ [Acción concreta 3 - ejemplo: "Crea algo que lleve tu nombre"]\\n✅ [Acción concreta 4 - ejemplo: "Habla en público aunque te dé miedo"]\\n✅ [Acción concreta 5]\\n\\n**No te pide:**\\n❌ [Lo que NO hacer 1 - específico]\\n❌ [Lo que NO hacer 2 - específico]\\n❌ [Lo que NO hacer 3 - específico]\\n\\n⚠️ **SOMBRA A TRABAJAR:** [Sombra específica de ${solarReturn.sign} Casa ${solarReturn.house} - ejemplo: "El ego excesivo, querer brillar sin sustancia, imponerte sin escuchar"]\\n\\n💡 **Clave:** [Frase directa de máximo 8 palabras]",
  "frase_clave": "[Frase POTENTE de máximo 10 palabras - debe capturar el contraste entre Casa ${natal.house} y Casa ${solarReturn.house}]",
  "drawer": {
    "titulo": "${planetName}: Natal vs Solar Return ${year}",
    "educativo": "🔹 CÓMO ERES NORMALMENTE (Carta Natal)\\n\\n📍 ${planetName} en ${natal.sign} · Casa ${natal.house}\\n\\n[Descripción natal completa - narrativa, no lista]",
    "poderoso": "🔸 QUÉ SE ACTIVA ESTE AÑO (Retorno Solar)\\n\\n📍 ${planetName} en ${solarReturn.sign} · Casa ${solarReturn.house}\\n\\n[Descripción SR completa - narrativa con ejemplos concretos]",
    "impacto_real": "🔁 DÓNDE SE AJUSTA TU MANERA DE [VERBO según planeta]\\n\\n[Comparación completa con ejemplos de vida real y consecuencias específicas]",
    "sombras": [{
      "nombre": "Acción Recomendada ${year}",
      "descripcion": "Qué hacer y qué evitar",
      "trampa": "❌ **Trampas:** [trampa 1 específica] · [trampa 2] · [trampa 3]",
      "regalo": "✅ **Acciones:** [acción concreta 1] · [acción concreta 2] · [acción concreta 3] · [acción concreta 4]"
    }],
    "sintesis": {
      "frase": "[Frase inicial potente de 1 línea]. Cuando [acción positiva específica], tu ${planetName} [resultado]. Cuando [acción negativa específica], se [consecuencia].",
      "declaracion": "\\"Mi ${planetName} este año [declaración en primera persona usando el contraste Casa ${natal.house} → Casa ${solarReturn.house}].\\""
    }
  }
}

════════════════════════════════════════════════════════

EJEMPLOS DE TONO CORRECTO:

❌ MAL: "Tu acción natural ocurre cuando construyes con paciencia"
✅ BIEN: "Tu Marte natal se mueve desde la constancia. No te lanzas - construyes. No improvisas - planificas. Actúas en tu entorno cercano (Casa 3): con palabras cuidadas, ideas concretas, conversaciones donde controlas cada detalle. Tu fuerza viene de la repetición, no del riesgo."

❌ MAL: "Este año expande comunicación"
✅ BIEN: "Este año Marte no quiere que planifiques - quiere que brilles. Pasa de Casa 3 (entorno cercano) a Casa 5 (escenario). Ahora la acción llega cuando te expones, cuando creas algo que lleve tu sello, cuando te pones al frente aunque no tengas todo controlado. Si te quedas en lo seguro, no se activa nada."

❌ MAL: "Lo notarás así: Deseo de destacar"
✅ BIEN: "Lo notarás así: Te darán ganas de subir tu trabajo a redes (aunque antes lo guardabas). Querrás liderar algo visible (aunque antes preferías estar detrás). Te sentirás inquieto si nadie ve lo que haces. Llegarán oportunidades donde tienes que estar al frente - y esta vez dirás que sí."

════════════════════════════════════════════════════════

Devuelve SOLO el JSON completo, sin explicaciones adicionales.`;

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