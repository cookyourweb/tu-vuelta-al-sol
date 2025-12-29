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

// ⏱️ Configurar timeout para Vercel (60 segundos en plan Pro)
export const maxDuration = 10;

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
  const prompt = `Eres un astrólogo profesional que interpreta comparaciones entre Natal y Solar Return con un enfoque psicológico y observador.

PLANETA: ${planetName}
NATAL: ${planetName} en ${natal.sign}, Casa ${natal.house}
SOLAR RETURN ${year}: ${planetName} en ${solarReturn.sign}, Casa ${solarReturn.house}

════════════════════════════════════════════════════════
ESTRUCTURA:

1️⃣ QUÉ SE ACTIVA ESTE AÑO
   - Descripción del cambio: "Durante este período, tu ${planetName} se manifiesta de manera diferente a tu patrón habitual"
   - Explicar Casa ${solarReturn.house} en términos prácticos y experienciales
   - Describir qué aspectos de vida se activan (3-4 áreas concretas)
   - Observar patrones: "Cuando se mantiene el patrón anterior, suele aparecer... Cuando se permite el ajuste, tiende a manifestarse..."

2️⃣ POR QUÉ SE SIENTE DIFERENTE (Cruce con natal)
   - Explicar cómo funciona ${planetName} natal en ${natal.sign} Casa ${natal.house}
   - "Habitualmente, tu ${planetName} opera desde: [3 patrones específicos]"
   - "Este año, puede experimentarse: [3 señales del cambio]"
   - Normalizar: "Esta configuración no indica un problema, sino un ajuste en cómo se procesa..."

3️⃣ PROCESO CENTRAL DEL AÑO
   - Descripción neutral: "Este período se centra en [tema principal] más que en [tema secundario]"
   - "Durante estos meses suele aparecer: [3 experiencias concretas]"
   - "Este es un año marcado por: [4-5 conceptos clave]"

4️⃣ DINÁMICAS OBSERVADAS
   Cuando se permite el proceso: [4 manifestaciones concretas y específicas]
   Cuando se resiste el ajuste: [4 señales de fricción - concretas, no genéricas]

5️⃣ QUÉ SUELE FUNCIONAR
   Prácticas que facilitan: [3-4 acciones concretas - ejemplo: "espacios regulares de introspección"]
   Patrones que generan fricción: [3 acciones específicas del contexto]

════════════════════════════════════════════════════════

TONO Y ESTILO:

✅ Lenguaje observador, no imperativo
✅ Describir procesos, no dar órdenes
✅ "Suele aparecer...", "Tiende a manifestarse...", "Se experimenta como..."
✅ Comparar natal y SR desde el inicio (sección 2)
✅ Validar sin dramatizar: "Esta configuración es un ajuste natural en..."
✅ Usar emociones descriptivas: "puede sentirse diferente", "aparece una sensación de..."

❌ NO usar: "HAZ", "EVITA", "La vida te pide"
❌ NO promesas ni predicciones
❌ NO coaching directo ni frases imperativas
❌ NO dejar el natal para el final

════════════════════════════════════════════════════════

ESTRUCTURA JSON:

{
  "titulo_atractivo": "${planetName} en tu Retorno Solar ${year}",
  "subtitulo": "[Frase gancho de 8-12 palabras - ejemplo: 'El año en que tu identidad se redefine desde dentro']",

  "que_se_activa": {
    "ubicacion": "${planetName} en ${solarReturn.sign} · Casa ${solarReturn.house} (Retorno Solar ${year})",
    "narrativa": "Durante este período, tu ${planetName} se manifiesta desde ${solarReturn.sign} en Casa ${solarReturn.house}, lo cual difiere de tu patrón habitual.\\n\\n[2 párrafos explicando qué significa Casa ${solarReturn.house} en términos prácticos y cómo afecta a ${planetName}. Lenguaje descriptivo y observador.]\\n\\nEn la Casa ${solarReturn.house} suelen activarse:
• [área de vida 1]\\n• [área de vida 2]\\n• [área de vida 3]\\n• [área de vida 4]\\n\\nCuando se mantiene el patrón anterior, suele aparecer [manifestación específica]. Cuando se permite el ajuste, tiende a manifestarse [experiencia específica].",
    "se_activa_lista": "[ítem 1] · [ítem 2] · [ítem 3] · [ítem 4]"
  },

  "por_que_descoloca": {
    "titulo_seccion": "POR QUÉ SE SIENTE DIFERENTE",
    "subtitulo": "(En relación a tu configuración natal)",
    "ubicacion": "${planetName} natal en ${natal.sign} · Casa ${natal.house}",
    "narrativa": "Habitualmente, tu ${planetName} opera desde:\\n• [patrón natal específico 1]\\n• [patrón natal específico 2]\\n• [patrón natal específico 3]\\n\\nEste año, puede experimentarse:\\n• [señal del cambio 1]\\n• [señal del cambio 2]\\n• [señal del cambio 3]\\n\\nEsta configuración no indica un problema, sino un ajuste temporal en cómo se procesa [área específica]. Es un cambio de énfasis natural durante este ciclo."
  },

  "que_te_pide": {
    "narrativa": "Este período se centra en [tema principal] más que en [tema secundario].\\n\\nDurante estos meses suele aparecer:\\n• [experiencia concreta 1]\\n• [experiencia concreta 2]\\n• [experiencia concreta 3]\\n\\nEste es un año marcado por:\\n[concepto 1] · [concepto 2] · [concepto 3] · [concepto 4]"
  },

  "consecuencias": {
    "si_lo_respetas": "[manifestación 1 cuando se permite el proceso] · [manifestación 2] · [manifestación 3] · [manifestación 4]",
    "si_no_lo_respetas": "[señal de fricción 1 cuando se resiste] · [fricción 2] · [fricción 3] · [fricción 4]"
  },

  "acciones": {
    "hacer": [
      "[práctica que facilita 1 - ejemplo: 'espacios regulares de introspección']",
      "[práctica que facilita 2 - ejemplo: 'permitir decisiones desde la intuición']",
      "[práctica que facilita 3 - específica al contexto]",
      "[práctica que facilita 4]"
    ],
    "evitar": [
      "[patrón que genera fricción 1 - ejemplo: 'forzar claridad inmediata']",
      "[patrón que genera fricción 2 - específico]",
      "[patrón que genera fricción 3 - específico]"
    ]
  },

  "sintesis": {
    "frase_potente": "[Frase de 1 línea potente - ejemplo: 'Este año no vienes a ser alguien nuevo. Vienes a recordar quién eres cuando nadie te mira.']",
    "explicacion": "[1-2 frases de cierre]",
    "declaracion": "\\"Cuando [acción correcta específica], mi ${planetName} [resultado]. Cuando [acción incorrecta específica], [consecuencia].\\""
  },

  "drawer": {
    "titulo": "${planetName} en tu Retorno Solar ${year}",
    "educativo": "📍 ${planetName} en ${solarReturn.sign} · Casa ${solarReturn.house}\\n\\n[que_se_activa.narrativa completa]",
    "observador": "**POR QUÉ SE SIENTE DIFERENTE**\\n(En relación a tu configuración natal)\\n\\n📍 ${planetName} natal en ${natal.sign} · Casa ${natal.house}\\n\\n[por_que_descoloca.narrativa completa]",
    "impacto_real": "**PROCESO CENTRAL DEL AÑO**\\n\\n[que_te_pide.narrativa]\\n\\n**Cuando se permite el proceso:**\\n• [consecuencias.si_lo_respetas con bullets]\\n\\n**Cuando se resiste el ajuste:**\\n• [consecuencias.si_no_lo_respetas con bullets]",
    "sombras": [{
      "nombre": "Prácticas observadas ${year}",
      "descripcion": "Qué suele facilitar y qué genera fricción",
      "trampa": "Patrones que generan fricción: [acciones.evitar separadas por ·]",
      "regalo": "Prácticas que facilitan: [acciones.hacer separadas por ·]"
    }],
    "sintesis": {
      "frase": "[sintesis.frase_potente]\\n\\n[sintesis.explicacion]",
      "declaracion": "[sintesis.declaracion]"
    }
  }
}

════════════════════════════════════════════════════════

EJEMPLO (Mercurio Piscis Casa 1 → Acuario Casa 12):

{
  "titulo_atractivo": "Mercurio en tu Retorno Solar 2025",
  "subtitulo": "Un año de procesamiento interno diferente",
  "que_se_activa": {
    "ubicacion": "Mercurio en Acuario · Casa 12 (Retorno Solar 2025)",
    "narrativa": "Durante este período, tu Mercurio se manifiesta desde Acuario en Casa 12, lo cual difiere de tu patrón habitual.\\n\\nLa Casa 12 activa procesos mentales que operan desde la introspección más que desde la expresión inmediata. Es un espacio donde las ideas se gestan internamente antes de verbalizarse.\\n\\nEn la Casa 12 suelen activarse:\\n• Pensamiento menos verbalizado\\n• Necesidad de procesar en privado\\n• Ideas que emergen sin lógica lineal\\n• Distancia de la comunicación constante\\n\\nCuando se mantiene el patrón anterior de expresión constante, suele aparecer saturación mental. Cuando se permite el ajuste hacia más silencio, tiende a manifestarse mayor claridad.",
    "se_activa_lista": "procesamiento interno · ideas gestándose · comprensión no lineal · distancia de la comunicación habitual"
  },
  "por_que_descoloca": {
    "titulo_seccion": "POR QUÉ SE SIENTE DIFERENTE",
    "subtitulo": "(En relación a tu configuración natal)",
    "ubicacion": "Mercurio natal en Piscis · Casa 1",
    "narrativa": "Habitualmente, tu Mercurio opera desde:\\n• Pensar mostrándote externamente\\n• Verbalizar para comprender\\n• Conexión emocional a través de palabras\\n\\nEste año, puede experimentarse:\\n• Menos necesidad de explicar\\n• Resistencia a exponerse mentalmente\\n• Necesidad de procesar antes de comunicar\\n\\nEsta configuración no indica un bloqueo, sino un ajuste temporal en cómo se procesa la información. Es un cambio de énfasis natural hacia la elaboración interna."
  },
  "que_te_pide": {
    "narrativa": "Este período se centra en la incubación de ideas más que en su exposición inmediata.\\n\\nDurante estos meses suele aparecer:\\n• Pensamientos que necesitan madurar en privado\\n• Creación sin necesidad de testigos\\n• Ideas que emergen desde el silencio\\n\\nEste es un año marcado por:\\nprocesamiento profundo · insights no verbalizados · redefinición interna · gestación de nuevas formas de pensar"
  },
  "consecuencias": {
    "si_lo_respetas": "claridad mental gradual · ideas originales gestándose · sensación de coherencia interna · preparación para un nuevo ciclo de expresión",
    "si_no_lo_respetas": "confusión por forzar verbalización · cansancio mental · comunicación que no refleja el proceso interno · sensación de desconexión"
  },
  "acciones": {
    "hacer": ["escritura privada sin objetivo de compartir", "trabajo de ideas en solitario", "observación de pensamientos sin juicio", "espacios de silencio regular", "permitir que ideas maduren sin prisa"],
    "evitar": ["explicarse constantemente", "buscar validación de cada pensamiento", "forzar decisiones rápidas", "exponer procesos que aún no están maduros"]
  },
  "sintesis": {
    "frase_potente": "Este año tu mente procesa desde un lugar diferente al habitual.",
    "explicacion": "El énfasis está en la gestación interna más que en la expresión externa, lo cual es un ajuste temporal natural.",
    "declaracion": "\\"Cuando permito el silencio, mi pensamiento se clarifica. Cuando fuerzo la comunicación, aparece confusión.\\""
  },
  "drawer": {
    "titulo": "Mercurio en tu Retorno Solar 2025",
    "educativo": "📍 Mercurio en Acuario · Casa 12\\n\\nDurante este período, tu Mercurio se manifiesta desde Acuario en Casa 12, lo cual difiere de tu patrón habitual.\\n\\nLa Casa 12 activa procesos mentales que operan desde la introspección más que desde la expresión inmediata. Es un espacio donde las ideas se gestan internamente antes de verbalizarse.\\n\\nEn la Casa 12 suelen activarse: pensamiento menos verbalizado, necesidad de procesar en privado, ideas que emergen sin lógica lineal, distancia de la comunicación constante.\\n\\nCuando se mantiene el patrón anterior de expresión constante, suele aparecer saturación mental. Cuando se permite el ajuste hacia más silencio, tiende a manifestarse mayor claridad.",
    "observador": "**POR QUÉ SE SIENTE DIFERENTE**\\n(En relación a tu configuración natal)\\n\\n📍 Mercurio natal en Piscis · Casa 1\\n\\nHabitualmente, tu Mercurio opera desde: pensar mostrándote externamente, verbalizar para comprender, conexión emocional a través de palabras.\\n\\nEste año, puede experimentarse: menos necesidad de explicar, resistencia a exponerse mentalmente, necesidad de procesar antes de comunicar.\\n\\nEsta configuración no indica un bloqueo, sino un ajuste temporal en cómo se procesa la información. Es un cambio de énfasis natural hacia la elaboración interna.",
    "impacto_real": "**PROCESO CENTRAL DEL AÑO**\\n\\nEste período se centra en la incubación de ideas más que en su exposición inmediata.\\n\\nDurante estos meses suele aparecer: pensamientos que necesitan madurar en privado, creación sin necesidad de testigos, ideas que emergen desde el silencio.\\n\\nEste es un año marcado por: procesamiento profundo, insights no verbalizados, redefinición interna, gestación de nuevas formas de pensar.\\n\\n**Cuando se permite el proceso:**\\n• Claridad mental gradual\\n• Ideas originales gestándose\\n• Sensación de coherencia interna\\n• Preparación para un nuevo ciclo\\n\\n**Cuando se resiste el ajuste:**\\n• Confusión por forzar verbalización\\n• Cansancio mental\\n• Comunicación desconectada del proceso\\n• Sensación de desajuste",
    "sombras": [{
      "nombre": "Prácticas observadas 2025",
      "descripcion": "Qué suele facilitar y qué genera fricción",
      "trampa": "Patrones que generan fricción: explicarse constantemente · buscar validación de cada pensamiento · forzar decisiones rápidas · exponer procesos inmaduros",
      "regalo": "Prácticas que facilitan: escritura privada · trabajo en solitario · observación sin juicio · espacios de silencio · permitir maduración"
    }],
    "sintesis": {
      "frase": "Este año tu mente procesa desde un lugar diferente al habitual.\\n\\nEl énfasis está en la gestación interna más que en la expresión externa, lo cual es un ajuste temporal natural.",
      "declaracion": "\\"Cuando permito el silencio, mi pensamiento se clarifica. Cuando fuerzo la comunicación, aparece confusión.\\""
    }
  }
}

════════════════════════════════════════════════════════

Devuelve SOLO el JSON completo siguiendo EXACTAMENTE esta estructura y este tono observador.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // ⚡ Cambio a mini: 5-10x más rápido para plan gratuito
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.85,
    response_format: { type: 'json_object' },
    timeout: 8000 // ⏱️ 8 segundos max para dejar margen en 10seg total
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