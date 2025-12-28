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
  const prompt = `Eres un astrólogo profesional que genera comparaciones VIVENCIALES entre Natal y Solar Return. Tu objetivo: que la persona SIENTA "esto me pasa a mí AHORA y sé qué hacer".

PLANETA: ${planetName}
NATAL: ${planetName} en ${natal.sign}, Casa ${natal.house}
SOLAR RETURN ${year}: ${planetName} en ${solarReturn.sign}, Casa ${solarReturn.house}

════════════════════════════════════════════════════════
🔥 ESTRUCTURA MENTAL CORRECTA (ORDEN SAGRADO):

1️⃣ QUÉ SE ACTIVA ESTE AÑO (Solar primero)
→ "Esto es lo que estás viviendo AHORA"
→ Parte del PRESENTE, no del pasado

2️⃣ POR QUÉ TE DESCOLOCA (Natal después)
→ "Por qué te resulta fácil o difícil"
→ Tu natal explica el CONFLICTO

3️⃣ QUÉ TE ESTÁ PIDIENDO LA VIDA
→ "Cambio de comportamiento concreto"
→ Dirección clara

4️⃣ CONSECUENCIAS
→ "Qué pasa si lo haces / si no"
→ Conciencia + urgencia

5️⃣ ACCIONES CONCRETAS
→ "Pocas, directas, reales"

════════════════════════════════════════════════════════

REGLAS DE ORO:

✅ Empieza SIEMPRE con el Solar Return (lo que vive AHORA)
✅ Usa NARRATIVA FLUIDA, no listas técnicas
✅ Habla en PRESENTE: "Este año tu mente no quiere ruido"
✅ Explica el CONFLICTO: "Tú, de base, piensas mostrándote. Por eso este año se siente raro"
✅ Valida lo que siente: "No es bloqueo. Es recalibración."
✅ Consecuencias ESPECÍFICAS: no "estancamiento" sino "confusión, cansancio mental, hablar de más"
✅ Acciones POCAS pero REALES: "escribe solo para ti" no "sé más creativo"

❌ NO empieces con Natal
❌ NO uses tono académico
❌ NO digas "tu energía natural ocurre cuando..."
❌ NO hagas listas sin contexto

════════════════════════════════════════════════════════

ESTRUCTURA JSON:

{
  "titulo_atractivo": "${planetName} en tu Retorno Solar ${year}",
  "subtitulo": "[Frase gancho de 8-12 palabras que capture el tema del año - ejemplo: 'El año en que tu mente cambia de plano']",

  "que_se_activa": {
    "ubicacion": "${planetName} en ${solarReturn.sign} · Casa ${solarReturn.house} (Retorno Solar ${year})",
    "narrativa": "[2-3 párrafos narrativos empezando con 'Este año tu [planeta] no quiere [patrón antiguo]. Quiere [patrón nuevo].' Explicar qué significa Casa ${solarReturn.house} en la PRÁCTICA, no en teoría. Usar frases cortas y directas. Terminar con '👉 Si intentas [patrón antiguo], te [consecuencia].']",
    "se_activa_lista": "[3-4 items cortos de qué se activa - ejemplo: 'pensamiento no convencional', 'ideas disruptivas']"
  },

  "por_que_descoloca": {
    "ubicacion": "${planetName} natal en ${natal.sign} · Casa ${natal.house}",
    "narrativa": "[2-3 párrafos explicando: 'Tú, de base, [patrón natal]. [Explicar cómo funciona normalmente]. Por eso este año se siente raro: [lista de 2-3 síntomas del conflicto].' Terminar validando: '💥 No es [miedo/bloqueo]. Es [recalibración/ajuste/transformación].']"
  },

  "que_te_pide": {
    "narrativa": "[2 párrafos. Primero: 'La vida te está pidiendo: [lista de 3 items con emoji 🧠 o similar]'. Segundo: 'Este es un año de: [4-5 conceptos clave separados por línea]'. Terminar con frase potente: 'No todo lo que [haces normalmente] ahora [resultado]. Y eso está bien.']"
  },

  "consecuencias": {
    "si_lo_respetas": "[4 consecuencias positivas concretas - ejemplo: 'claridad mental profunda', 'ideas verdaderamente originales']",
    "si_no_lo_respetas": "[4 consecuencias negativas específicas - ejemplo: 'confusión', 'cansancio mental', 'hablar de más', 'sensación de no ser comprendida']"
  },

  "acciones": {
    "hacer": [
      "[acción concreta 1 - ejemplo: 'escribe solo para ti']",
      "[acción concreta 2]",
      "[acción concreta 3]",
      "[acción concreta 4]",
      "[acción concreta 5]"
    ],
    "evitar": [
      "[qué NO hacer 1 - ejemplo: 'explicarte constantemente']",
      "[qué NO hacer 2]",
      "[qué NO hacer 3]",
      "[qué NO hacer 4]"
    ]
  },

  "sintesis": {
    "frase_potente": "[Frase de 1 línea que capture el año - ejemplo: 'Este año no vienes a hablar más. Vienes a pensar distinto.']",
    "explicacion": "[1-2 frases explicando la transformación]",
    "declaracion": "\"Cuando [acción correcta], mi ${planetName} [resultado positivo]. Cuando [acción incorrecta], [resultado negativo].\""
  },

  "drawer": {
    "titulo": "${planetName} en tu Retorno Solar ${year}",
    "educativo": "📍 ${planetName} en ${solarReturn.sign} · Casa ${solarReturn.house}\\n\\n[que_se_activa.narrativa completa SIN el emoji inicial ni título - solo la narrativa pura]",
    "poderoso": "📍 ${planetName} natal en ${natal.sign} · Casa ${natal.house}\\n\\n[por_que_descoloca.narrativa completa SIN el emoji inicial ni título - solo la narrativa pura]",
    "impacto_real": "[que_te_pide.narrativa completa]\\n\\n🌱 SI LO RESPETAS:\\n• [consecuencias.si_lo_respetas lista con bullets]\\n\\n⚠️ SI NO LO RESPETAS:\\n• [consecuencias.si_no_lo_respetas lista con bullets]",
    "sombras": [{
      "nombre": "Acciones Concretas ${year}",
      "descripcion": "Qué hacer y qué evitar",
      "trampa": "❌ EVITA: [acciones.evitar separadas por ·]",
      "regalo": "✅ HAZ: [acciones.hacer separadas por ·]"
    }],
    "sintesis": {
      "frase": "[sintesis.frase_potente]\\n\\n[sintesis.explicacion]",
      "declaracion": "[sintesis.declaracion]"
    }
  }
}

════════════════════════════════════════════════════════

EJEMPLO COMPLETO (Mercurio Piscis Casa 1 → Acuario Casa 12):

{
  "titulo_atractivo": "Mercurio en tu Retorno Solar 2025",
  "subtitulo": "El año en que tu mente cambia de plano",
  "que_se_activa": {
    "ubicacion": "Mercurio en Acuario · Casa 12 (Retorno Solar 2025)",
    "narrativa": "Este año tu mente no quiere ruido. Quiere espacio, silencio y libertad.\\n\\nNo es un año para explicar quién eres, sino para pensar diferente desde dentro. La Casa 12 es el laboratorio mental invisible - donde las ideas se gestan antes de nacer.\\n\\n👉 Si intentas forzarte a comunicarte como siempre, te saturas.",
    "se_activa_lista": "pensamiento no convencional · ideas disruptivas · comprensión profunda de patrones invisibles · necesidad de aislarte mentalmente"
  },
  "por_que_descoloca": {
    "ubicacion": "Mercurio natal en Piscis · Casa 1",
    "narrativa": "Tú, de base, piensas mostrándote. Hablas para entenderte. Conectas emocionalmente a través de la palabra.\\n\\nPor eso este año se siente raro: no quieres explicar tanto, no te apetece exponerte, necesitas procesar antes de decir.\\n\\n💥 No es bloqueo. Es recalibración mental."
  },
  "que_te_pide": {
    "narrativa": "La vida te está pidiendo:\\n🧠 pensar sin necesidad de compartir\\n🧠 crear sin testigos\\n🧠 gestar ideas antes de exponerlas\\n\\nEste es un año de:\\nincubación mental\\ninsights\\nredefinición interna de tu discurso\\nruptura con viejas narrativas\\n\\nNo todo lo que piensas ahora está listo para ser dicho. Y eso está bien."
  },
  "consecuencias": {
    "si_lo_respetas": "claridad mental profunda · ideas verdaderamente originales · sensación de sentido · preparación para un nuevo ciclo de expresión",
    "si_no_lo_respetas": "confusión · cansancio mental · hablar de más · sensación de no ser comprendida"
  },
  "acciones": {
    "hacer": ["escribe solo para ti", "trabaja ideas en privado", "observa tus pensamientos sin juzgarlos", "medita o camina en silencio", "deja que las ideas maduren"],
    "evitar": ["explicarte constantemente", "buscar validación mental", "forzarte a decidir rápido", "exponer procesos inacabados"]
  },
  "sintesis": {
    "frase_potente": "Este año no vienes a hablar más. Vienes a pensar distinto.",
    "explicacion": "Tu mente se está liberando de viejas formas, aunque todavía no tenga palabras para explicarlo.",
    "declaracion": "\\"Cuando respeto el silencio, mi Mercurio innova. Cuando me fuerzo a comunicar, me pierdo.\\""
  },
  "drawer": {
    "titulo": "Mercurio en tu Retorno Solar 2025",
    "educativo": "📍 Mercurio en Acuario · Casa 12\\n\\nEste año tu mente no quiere ruido. Quiere espacio, silencio y libertad.\\n\\nNo es un año para explicar quién eres, sino para pensar diferente desde dentro. La Casa 12 es el laboratorio mental invisible - donde las ideas se gestan antes de nacer.\\n\\n👉 Si intentas forzarte a comunicarte como siempre, te saturas.",
    "poderoso": "📍 Mercurio natal en Piscis · Casa 1\\n\\nTú, de base, piensas mostrándote. Hablas para entenderte. Conectas emocionalmente a través de la palabra.\\n\\nPor eso este año se siente raro: no quieres explicar tanto, no te apetece exponerte, necesitas procesar antes de decir.\\n\\n💥 No es bloqueo. Es recalibración mental.",
    "impacto_real": "La vida te está pidiendo:\\n🧠 pensar sin necesidad de compartir\\n🧠 crear sin testigos\\n🧠 gestar ideas antes de exponerlas\\n\\nEste es un año de:\\nincubación mental\\ninsights\\nredefinición interna de tu discurso\\nruptura con viejas narrativas\\n\\nNo todo lo que piensas ahora está listo para ser dicho. Y eso está bien.\\n\\n🌱 SI LO RESPETAS:\\n• claridad mental profunda\\n• ideas verdaderamente originales\\n• sensación de sentido\\n• preparación para un nuevo ciclo de expresión\\n\\n⚠️ SI NO LO RESPETAS:\\n• confusión\\n• cansancio mental\\n• hablar de más\\n• sensación de no ser comprendida",
    "sombras": [{
      "nombre": "Acciones Concretas 2025",
      "descripcion": "Qué hacer y qué evitar",
      "trampa": "❌ EVITA: explicarte constantemente · buscar validación mental · forzarte a decidir rápido · exponer procesos inacabados",
      "regalo": "✅ HAZ: escribe solo para ti · trabaja ideas en privado · observa tus pensamientos sin juzgarlos · medita o camina en silencio · deja que las ideas maduren"
    }],
    "sintesis": {
      "frase": "Este año no vienes a hablar más. Vienes a pensar distinto.\\n\\nTu mente se está liberando de viejas formas, aunque todavía no tenga palabras para explicarlo.",
      "declaracion": "\\"Cuando respeto el silencio, mi Mercurio innova. Cuando me fuerzo a comunicar, me pierdo.\\""
    }
  }
}

════════════════════════════════════════════════════════

Devuelve SOLO el JSON completo siguiendo EXACTAMENTE esta estructura y este tono.`;

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