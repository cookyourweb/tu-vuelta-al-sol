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
  const prompt = `Eres un astrólogo profesional que genera comparaciones VIVENCIALES, POTENTES y ACCIONABLES entre Natal y Solar Return.

PLANETA: ${planetName}
NATAL: ${planetName} en ${natal.sign}, Casa ${natal.house}
SOLAR RETURN ${year}: ${planetName} en ${solarReturn.sign}, Casa ${solarReturn.house}

════════════════════════════════════════════════════════
🔥 ESTRUCTURA CORRECTA:

1️⃣ QUÉ SE ACTIVA ESTE AÑO
   - Frase de ACTIVACIÓN inicial: "Este año tu [planeta] [qué pasa], aunque tú normalmente [patrón natal]"
   - Explicar Casa ${solarReturn.house} en la PRÁCTICA
   - Enumerar qué se activa (3-4 items concretos)
   - 👉 Condición: "Si intentas [patrón antiguo], [consecuencia]. Si te permites [nuevo patrón], [resultado]."

2️⃣ POR QUÉ SE SIENTE TAN DIFERENTE EN TI (Cruce con natal)
   - Explicar cómo funciona ${planetName} natal en ${natal.sign} Casa ${natal.house}
   - "De base, tú estás acostumbrada a: [3 items]"
   - "Por eso este año puede sentirse [emoción]: [3 síntomas]"
   - 💥 VALIDACIÓN: "No estás [miedo]. Estás [transformación real]."

3️⃣ QUÉ TE ESTÁ PIDIENDO LA VIDA ESTE AÑO
   - Frase directa: "Este año no se trata de [lo antiguo], sino de [lo nuevo]"
   - "La vida te pide: [3 items con emoji]"
   - "Este es un año de: [4-5 conceptos clave]"

4️⃣ CONSECUENCIAS
   🌱 Si lo respetas: [4 consecuencias positivas MUY específicas]
   ⚠️ Si lo resistes: [4 consecuencias negativas concretas - no genéricas]

5️⃣ ACCIONES CONCRETAS
   HAZ: ✅ [3-4 acciones VIVENCIALES - no "sé creativo" sino acciones específicas]
   EVITA: ❌ [3 acciones a evitar - específicas del contexto]

════════════════════════════════════════════════════════

REGLAS CRÍTICAS:

✅ FRASE DE ACTIVACIÓN al inicio: "Este año tu [planeta] [cambio], aunque tú normalmente [patrón natal]"
✅ Cruce natal TEMPRANO (en sección 2, no al final)
✅ DIRECCIÓN CENTRAL clara: No es [miedo común], es [transformación específica]
✅ Acciones VIVENCIALES: no genéricas - específicas a ${planetName} ${solarReturn.sign} Casa ${solarReturn.house}
✅ Usar emociones: "puede sentirse desconcertante", "aparece confusión", etc.
✅ Validar siempre: "💥 No estás [miedo]. Estás [verdad]."

❌ NO acciones genéricas tipo "sé más creativo" o "confía en ti"
❌ NO solo describir - dar DIRECCIÓN
❌ NO dejar el natal para el final - integrarlo en sección 2

════════════════════════════════════════════════════════

ESTRUCTURA JSON:

{
  "titulo_atractivo": "${planetName} en tu Retorno Solar ${year}",
  "subtitulo": "[Frase gancho de 8-12 palabras - ejemplo: 'El año en que tu identidad se redefine desde dentro']",

  "que_se_activa": {
    "ubicacion": "${planetName} en ${solarReturn.sign} · Casa ${solarReturn.house} (Retorno Solar ${year})",
    "narrativa": "**FRASE DE ACTIVACIÓN:** Este año tu ${planetName} [qué pasa específicamente], aunque tú normalmente [patrón natal en 3-4 palabras].\\n\\n[2 párrafos explicando qué significa Casa ${solarReturn.house} en la PRÁCTICA y cómo afecta a ${planetName}. Usar lenguaje emocional.]\\n\\nLa Casa ${solarReturn.house} [significado práctico]:
• [qué se activa 1]\\n• [qué se activa 2]\\n• [qué se activa 3]\\n• [qué se activa 4]\\n\\n👉 Si intentas [patrón antiguo], [consecuencia específica].\\n👉 Si te permites [nuevo patrón], [resultado específico].",
    "se_activa_lista": "[ítem 1] · [ítem 2] · [ítem 3] · [ítem 4]"
  },

  "por_que_descoloca": {
    "titulo_seccion": "POR QUÉ SE SIENTE TAN DIFERENTE EN TI",
    "subtitulo": "(Cruce con tu carta natal)",
    "ubicacion": "${planetName} natal en ${natal.sign} · Casa ${natal.house}",
    "narrativa": "De base, tú estás acostumbrada a:\\n• [patrón natal específico 1]\\n• [patrón natal específico 2]\\n• [patrón natal específico 3]\\n\\nPor eso este año puede sentirse [emoción específica - ejemplo: desconcertante, liberador, confuso]:\\n• [síntoma del conflicto 1]\\n• [síntoma del conflicto 2]\\n• [síntoma del conflicto 3]\\n\\n💥 No estás [miedo/pérdida]. Estás [transformación real en 1 frase potente]."
  },

  "que_te_pide": {
    "narrativa": "Este año no se trata de [patrón antiguo específico],\\nsino de [patrón nuevo específico].\\n\\nLa vida te pide:\\n🧠 [petición 1 - concreta]\\n🧠 [petición 2 - concreta]\\n🧠 [petición 3 - concreta]\\n\\nEste es un año de:\\n[concepto 1] · [concepto 2] · [concepto 3] · [concepto 4]"
  },

  "consecuencias": {
    "si_lo_respetas": "[consecuencia positiva 1 muy específica] · [consecuencia 2] · [consecuencia 3] · [consecuencia 4]",
    "si_no_lo_respetas": "[consecuencia negativa 1 muy específica - NO genérica] · [consecuencia 2] · [consecuencia 3] · [consecuencia 4]"
  },

  "acciones": {
    "hacer": [
      "[acción vivencial 1 - ejemplo: 'crea espacios de silencio (meditación, escritura intuitiva)']",
      "[acción vivencial 2 - ejemplo: 'permite decisiones sin lógica inmediata']",
      "[acción vivencial 3 - específica al contexto]",
      "[acción vivencial 4]"
    ],
    "evitar": [
      "[qué evitar 1 - específico - ejemplo: 'forzarte a tener todo claro']",
      "[qué evitar 2 - específico]",
      "[qué evitar 3 - específico]"
    ]
  },

  "sintesis": {
    "frase_potente": "[Frase de 1 línea potente - ejemplo: 'Este año no vienes a ser alguien nuevo. Vienes a recordar quién eres cuando nadie te mira.']",
    "explicacion": "[1-2 frases de cierre]",
    "declaracion": "\\"Cuando [acción correcta específica], mi ${planetName} [resultado]. Cuando [acción incorrecta específica], [consecuencia].\\""
  },

  "drawer": {
    "titulo": "${planetName} en tu Retorno Solar ${year}",
    "educativo": "📍 ${planetName} en ${solarReturn.sign} · Casa ${solarReturn.house}\\n\\n[que_se_activa.narrativa completa incluyendo frase de activación]",
    "observador": "**POR QUÉ SE SIENTE TAN DIFERENTE EN TI**\\n(Cruce con tu carta natal)\\n\\n📍 ${planetName} natal en ${natal.sign} · Casa ${natal.house}\\n\\n[por_que_descoloca.narrativa completa]",
    "impacto_real": "**QUÉ TE ESTÁ PIDIENDO LA VIDA ESTE AÑO**\\n\\n[que_te_pide.narrativa]\\n\\n🌱 **SI LO RESPETAS:**\\n• [consecuencias positivas con bullets]\\n\\n⚠️ **SI LO RESISTES:**\\n• [consecuencias negativas con bullets]",
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
    "observador": "📍 Mercurio natal en Piscis · Casa 1\\n\\nTú, de base, piensas mostrándote. Hablas para entenderte. Conectas emocionalmente a través de la palabra.\\n\\nPor eso este año se siente raro: no quieres explicar tanto, no te apetece exponerte, necesitas procesar antes de decir.\\n\\n💥 No es bloqueo. Es recalibración mental.",
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
// Helper: Format Comparison as Drawer
// =============================================================================
function formatComparisonAsDrawer(comparison: any, planetName: string): any {
  // Helper: Asegurar array (puede venir como string o array)
  const ensureArray = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return [value];
    return [];
  };

  // Construir narrativa de QUÉ SE ACTIVA
  const seActivaLista = ensureArray(comparison.que_se_activa?.se_activa_lista);
  const queSeActivaNarrativa = [
    comparison.que_se_activa?.narrativa || '',
    '',
    seActivaLista.length > 0
      ? `**Este año se activa:**\n${seActivaLista.map((item: string) => `• ${item}`).join('\n')}`
      : ''
  ].filter(Boolean).join('\n');

  // Construir narrativa de QUÉ TE PIDE
  const tePideLista = ensureArray(comparison.que_te_pide?.te_pide_lista);
  const conceptosClave = ensureArray(comparison.que_te_pide?.conceptos_clave);

  const queTeVideNarrativa = [
    comparison.que_te_pide?.narrativa || '',
    '',
    tePideLista.length > 0
      ? `**La vida te pide:**\n${tePideLista.map((item: string) => `• ${item}`).join('\n')}`
      : '',
    '',
    conceptosClave.length > 0
      ? `**Este es un año de:** ${conceptosClave.join(', ')}`
      : ''
  ].filter(Boolean).join('\n');

  // Construir consecuencias
  const siLoRespetas = ensureArray(comparison.consecuencias?.si_lo_respetas);
  const siLoResistes = ensureArray(comparison.consecuencias?.si_no_lo_respetas);

  const consecuencias = [
    '**🌱 Si lo respetas:**',
    ...siLoRespetas.map((c: string) => `• ${c}`),
    '',
    '**⚠️ Si lo resistes:**',
    ...siLoResistes.map((c: string) => `• ${c}`)
  ].join('\n');

  return {
    titulo: comparison.titulo_atractivo || `${planetName} en tu Retorno Solar`,
    subtitulo: comparison.subtitulo || '',

    // 📚 QUÉ SIGNIFICA (Sección 1: QUÉ SE ACTIVA)
    educativo: queSeActivaNarrativa,

    // 🔥 CÓMO SE MANIFIESTA (Sección 2: POR QUÉ DESCOLOCA - Cruce con natal)
    observador: comparison.por_que_descoloca?.narrativa || '',

    // 🌍 IMPACTO REAL (Sección 3: QUÉ TE PIDE)
    impacto_real: queTeVideNarrativa,

    // ⚠️ SOMBRAS (Sección 4: CONSECUENCIAS)
    sombras: [{
      nombre: 'Consecuencias',
      descripcion: 'Según cómo manejes esta energía',
      trampa: consecuencias,
      regalo: '' // No se usa aquí, está en trampa
    }],

    // 💎 SÍNTESIS (Sección 5: ACCIONES)
    sintesis: {
      frase: comparison.subtitulo || `${planetName} se activa de manera específica este año`,
      declaracion: [
        '**✅ HAZ:**',
        ...ensureArray(comparison.acciones?.hacer).map((a: string) => `• ${a}`),
        '',
        '**❌ EVITA:**',
        ...ensureArray(comparison.acciones?.evitar).map((a: string) => `• ${a}`)
      ].join('\n')
    }
  };
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

    // Convert UserProfile to the format expected by tripleFusedInterpretationService
    const convertedProfile = userProfile ? {
      name: userProfile.name || 'Usuario',
      age: 0, // Age calculation would require birth date parsing
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
        convertedProfile
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

      // Formatear comparación como drawer para respuesta inmediata
      const drawer = formatComparisonAsDrawer(comparison, planetName);

      return NextResponse.json({
        success: true,
        interpretation: {
          ...comparison,
          drawer  // ⭐ Incluir drawer formateado
        },
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
      convertedProfile
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