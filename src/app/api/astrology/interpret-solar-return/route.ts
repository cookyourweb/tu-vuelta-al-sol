// src/app/api/astrology/interpret-solar-return/route.ts
// 🔥 COMPLETE SOLAR RETURN INTERPRETATION WITH 12 SECTIONS
// Methodology: Shea + Teal + Louis (Professional Astrology)
// Output: Full year prediction with actionable insights

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import connectDB from '@/lib/db';
import Interpretation from '@/models/Interpretation';
// ✅ Importar nuevo prompt de 3 CAPAS (Natal → Solar → Acción)
import { generateSolarReturn3LayersPrompt } from '@/utils/prompts/solarReturnPrompt_3layers';
import { generateSRComparison } from '@/utils/astrology/solarReturnComparison';

// ⏱️ Configurar timeout para Vercel (60 segundos en plan Pro)
export const maxDuration = 60;

// ✅ Lazy initialization to avoid build-time errors
let openai: OpenAI | null = null;

function getOpenAI() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// ==========================================
// 📊 SOLAR RETURN 3 CAPAS INTERFACE
// ==========================================

interface CompleteSolarReturnInterpretation {
  // APERTURA DEL AÑO
  apertura_anual: {
    ano_solar: string;
    tema_central: string;
    eje_del_ano: string;
    como_se_siente: string;
    conexion_natal: string;
  };

  // CÓMO SE VIVE SIENDO TÚ
  como_se_vive_siendo_tu: {
    facilidad: string;
    incomodidad: string;
    medida_del_ano: string;
    reflejos_obsoletos: string;
    actitud_nueva: string;
  };

  // COMPARACIONES PLANETARIAS (3 CAPAS: Natal → Solar → Acción)
  comparaciones_planetarias: {
    sol: PlanetComparison;
    luna: PlanetComparison;
    mercurio: PlanetComparison;
    venus: PlanetComparison;
    marte: PlanetComparison;
    jupiter: PlanetComparison;
    saturno: PlanetComparison;
  };

  // LÍNEA DE TIEMPO ANUAL
  linea_tiempo_anual: {
    mes_1_2: TimelineEvent;
    mes_3_4: TimelineEvent;
    mes_6_7: TimelineEvent;
    mes_9_10: TimelineEvent;
    mes_12: TimelineEvent;
  };

  // SOMBRAS DEL AÑO
  sombras_del_ano: string[];

  // CLAVES DE INTEGRACIÓN
  claves_integracion: string[];

  // USO CALENDARIO LUNAR
  uso_calendario_lunar: {
    marco_general: string;
    lunas_clave: Array<{
      fase: string;
      fecha_aproximada: string;
      signo: string;
      por_que_es_clave: string;
    }>;
  };

  // SÍNTESIS FINAL
  sintesis_final: {
    frase_cierre_potente: string;
    pregunta_final: string;
  };

  // ANÁLISIS TÉCNICO
  analisis_tecnico: {
    asc_sr_en_casa_natal: {
      casa: number;
      signo_asc_sr: string;
      significado: string;
      area_dominante: string;
    };
    sol_en_casa_sr: {
      casa: number;
      significado: string;
    };
  };
}

interface PlanetComparison {
  natal: {
    posicion: string;
    descripcion: string;
  };
  solar_return: {
    posicion: string;
    descripcion: string;
  };
  choque: string;
  que_hacer: string;
  mandato_del_ano: string;
}

interface TimelineEvent {
  titulo: string;
  descripcion: string;
  accion_clave: string;
}

// ==========================================
// 🤖 GENERATE WITH OPENAI
// ==========================================

async function generateCompleteWithOpenAI(
  natalChart: any,
  solarReturnChart: any,
  userProfile: any,
  returnYear: number,
  srComparison?: any,
  natalInterpretations?: any
): Promise<CompleteSolarReturnInterpretation> {

  console.log('🤖 ===== GENERATING WITH OPENAI =====');
  console.log('🤖 Input validation:', {
    userName: userProfile?.name,
    userAge: userProfile?.age,
    natalPlanets: natalChart?.planets?.length,
    srPlanets: solarReturnChart?.planets?.length,
    returnYear
  });

  // ✅ GENERATE PROMPT (usando versión 3 CAPAS: Natal → Solar → Acción)
  const prompt = generateSolarReturn3LayersPrompt({
    natalChart,
    solarReturnChart,
    userProfile,
    returnYear,
    srComparison,
    natalInterpretations  // ✅ PASS NATAL INTERPRETATIONS FOR COMPARISONS
  });

  console.log('📏 Prompt stats:', {
    length: prompt.length,
    containsUserName: prompt.includes(userProfile.name),
    containsReturnYear: prompt.includes(returnYear.toString())
  });

  // ✅ SYSTEM PROMPT WITH NEW STRUCTURE (jerarquía + dirección)
  let systemPrompt = `You are a PROFESSIONAL astrologer specializing in Solar Return interpretation using JERARQUÍA + DIRECCIÓN methodology.

⚠️ CRITICAL REQUIREMENTS:
1. You MUST respond with VALID JSON with the exact structure specified
2. Use REAL astronomical data (planets, houses, signs, degrees)
3. Use REAL user data: ${userProfile.name}, age ${userProfile.age}
4. Use SPECIFIC positions: "Sol en ${solarReturnChart?.planets?.find((p: any) => p.name === 'Sol')?.sign} Casa ${solarReturnChart?.planets?.find((p: any) => p.name === 'Sol')?.house}"
5. JERARQUÍA PLANETARIA:
   - PRIORIDAD 1 (200 palabras): Sol + Saturno + planetas en casas angulares
   - PRIORIDAD 2 (150 palabras): Mercurio + Luna
   - PRIORIDAD 3 (120 palabras): Venus + Marte + Júpiter
6. Each planet MUST have: natal, solar_return, choque, que_hacer, mandato_del_ano

Required JSON structure:
{
  "apertura_anual": {
    "ano_solar": "string",
    "tema_central": "string (10-15 words) - DIRECCIÓN CLARA + PROPÓSITO",
    "eje_del_ano": "string (40-60 words) - ¿Qué está pasando REALMENTE? NO describir, DIRIGIR",
    "como_se_siente": "string (80-100 words) - Termina con FRASE DE CONSECUENCIA",
    "conexion_natal": "string (70-90 words) - CONTRASTE CLARO + FRASE EVOLUTIVA"
  },
  "como_se_vive_siendo_tu": {
    "facilidad": "string (40-60 words) - 3-4 items",
    "incomodidad": "string (40-60 words) - 3-4 items",
    "medida_del_ano": "string (60-80 words) - Cómo NO medir + cómo SÍ medir",
    "reflejos_obsoletos": "string (30-50 words) - 3 items LENGUAJE ACTIVO",
    "actitud_nueva": "string (30-50 words) - 3 items LENGUAJE ACTIVO"
  },
  "comparaciones_planetarias": {
    "sol": {
      "natal": {"posicion": "string", "descripcion": "string (60-80 words)"},
      "solar_return": {"posicion": "string", "descripcion": "string (60-80 words)"},
      "choque": "string (100-120 words - BE SPECIFIC with houses)",
      "que_hacer": "string (80-100 words - concrete action)",
      "mandato_del_ano": "string (15-25 words) - Este año, este planeta te pide X. Si haces Y, fluye. Si haces Z, se bloquea."
    },
    "luna": {...same structure with mandato_del_ano...},
    "mercurio": {...same structure with mandato_del_ano...},
    "venus": {...same structure with mandato_del_ano...},
    "marte": {...same structure with mandato_del_ano...},
    "jupiter": {...same structure with mandato_del_ano...},
    "saturno": {...same structure with mandato_del_ano...}
  },
  "linea_tiempo_anual": {
    "mes_1_2": {
      "titulo": "Mes 1–2 | Activación",
      "descripcion": "string (50-70 words) - SINTÉTICO",
      "accion_clave": "string (3-5 words) - Una acción específica"
    },
    "mes_3_4": {
      "titulo": "Mes 3–4 | Primer ajuste",
      "descripcion": "string (50-70 words)",
      "accion_clave": "string (3-5 words)"
    },
    "mes_6_7": {
      "titulo": "Mes 6–7 | Punto medio",
      "descripcion": "string (50-70 words)",
      "accion_clave": "string (3-5 words)"
    },
    "mes_9_10": {
      "titulo": "Mes 9–10 | Primeros frutos",
      "descripcion": "string (50-70 words)",
      "accion_clave": "string (3-5 words)"
    },
    "mes_12": {
      "titulo": "Mes 12 | Cierre",
      "descripcion": "string (50-70 words)",
      "accion_clave": "string (3-5 words)"
    }
  },
  "sombras_del_ano": ["Sombra 1: (40-50 words)", "Sombra 2:", "Sombra 3:"],
  "claves_integracion": ["Frase práctica 1 (10-15 words)", "Frase 2", "Frase 3"],
  "uso_calendario_lunar": {
    "marco_general": "string (80-100 words) - CÓMO USAR las lunas este año específico",
    "lunas_clave": [
      {
        "fase": "Luna Nueva o Luna Llena",
        "fecha_aproximada": "YYYY-MM-DD",
        "signo": "string",
        "por_que_es_clave": "string (60-80 words) - Por qué es importante ESTE AÑO para ESTE usuario"
      },
      {...2 more lunas - TOTAL 3, NOT 12 or 24...}
    ]
  },
  "sintesis_final": {
    "frase_cierre_potente": "string (60-80 words) - 3-4 frases CORTAS Y POTENTES",
    "pregunta_final": "string (10-15 words) - Una pregunta reflexiva"
  },
  "analisis_tecnico": {
    "asc_sr_en_casa_natal": {
      "casa": number,
      "signo_asc_sr": "string",
      "significado": "string (150-180 words)",
      "area_dominante": "string"
    },
    "sol_en_casa_sr": {
      "casa": number,
      "significado": "string (100-120 words)"
    }
  }
}

⚠️ IMPORTANT NOTES:
- NO repetition - each concept stated ONCE
- 30-40% shorter than old format (~2100 words total, not 3000)
- HIERARCHY: Not all planets weigh equally
- OBSERVADOR tone (NOT directive): "Este año funciona mejor cuando..." instead of "Debes hacer..."
- VARIACIÓN LÉXICA: Alternate "Este año" with "Durante este periodo", "A lo largo del año", "En este ciclo", "Ahora"
- VARIACIÓN LÉXICA: Alternate "validación externa" with "reconocimiento externo", "aprobación externa", "mirada externa"
- Use consequences, not commands: "Si escuchas, fluye. Si fuerzas, aparece tensión."
- Use SUGERENCIAS NO IMPERATIVAS: "Puede ser útil...", "Este periodo favorece...", "Tiende a funcionar mejor cuando..."
- NO imperatives: avoid "haz", "debes", "tienes que", "evita", "dedica tiempo a", "prioriza"
- Each planet MUST have mandato_del_ano (with observador tone + sugerencias)
- Timeline MUST have accion_clave
- Lunar calendar: 3 lunas clave ONLY (not 12 months, not 24 dates)
- Use first name only (${userProfile.name?.split(' ')[0]}) 1-3 times maximum
- ${natalInterpretations ? 'USE PROVIDED NATAL INTERPRETATIONS in natal.descripcion of each planet' : 'Generate permanent identity descriptions based on natal chart'}

⚠️ OUTPUT ONLY JSON - NO markdown, NO explanations, NO text before/after`;

  // ✅ CALL OPENAI WITH RETRIES
  let attempts = 0;
  const MAX_ATTEMPTS = 2;
  let parsedResponse: any;

  while (attempts < MAX_ATTEMPTS) {
    try {
      console.log(`🤖 OpenAI attempt ${attempts + 1}/${MAX_ATTEMPTS}`);

      const client = getOpenAI();
      if (!client) {
        throw new Error('OpenAI client not available');
      }

      const completion = await client.chat.completions.create({
        model: 'gpt-4o-2024-08-06',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 16000, // ✅ INCREASED: Needed for complete Solar Return interpretation with all sections
        response_format: { type: "json_object" }
      });

      const rawResponse = completion.choices[0]?.message?.content;

      if (!rawResponse) {
        throw new Error('Empty response from OpenAI');
      }

      console.log('📦 Response received:', {
        length: rawResponse.length,
        first100: rawResponse.substring(0, 100),
        last100: rawResponse.substring(rawResponse.length - 100)
      });

      // ✅ PARSE & VALIDATE
      parsedResponse = JSON.parse(rawResponse);

      // ✅ DEBUG: Log exactly what keys OpenAI returned
      console.log('🔍 Keys returned by OpenAI:', Object.keys(parsedResponse));
      console.log('🔍 Sample check - has uso_calendario_lunar?', !!parsedResponse.uso_calendario_lunar);
      console.log('🔍 Sample check - has sintesis_final?', !!parsedResponse.sintesis_final);

      // Required sections for NEW structure (jerarquía + dirección)
      const requiredSections = [
        'apertura_anual',
        'como_se_vive_siendo_tu',
        'comparaciones_planetarias',
        'linea_tiempo_anual',
        'sombras_del_ano',
        'claves_integracion',
        'uso_calendario_lunar',
        'sintesis_final',
        'analisis_tecnico'
      ];

      const missingSections = requiredSections.filter(
        section => !parsedResponse[section]
      );

      console.log('📊 Validation check:', {
        totalKeys: Object.keys(parsedResponse).length,
        requiredSections: requiredSections.length,
        missingSections: missingSections.length,
        missing: missingSections
      });

      if (missingSections.length === 0) {
        // ✅ VALIDATE CONTENT QUALITY
        console.log('🔍 Validating response quality...');

        // Check if comparaciones_planetarias has all planets
        const requiredPlanets = ['sol', 'luna', 'mercurio', 'venus', 'marte', 'jupiter', 'saturno'];
        const missingPlanets = requiredPlanets.filter(
          planet => !parsedResponse.comparaciones_planetarias?.[planet]
        );

        if (missingPlanets.length > 0) {
          console.warn('⚠️ Response missing planets:', missingPlanets);
          throw new Error(`Response missing planets: ${missingPlanets.join(', ')}`);
        }

        // Check if each planet has the NEW structure (with mandato_del_ano)
        const hasProperStructure = requiredPlanets.every(planet => {
          const p = parsedResponse.comparaciones_planetarias[planet];
          return p?.natal && p?.solar_return && p?.choque && p?.que_hacer && p?.mandato_del_ano;
        });

        if (!hasProperStructure) {
          console.warn('⚠️ Response missing NEW structure in comparaciones_planetarias');
          throw new Error('Response missing required structure (natal, solar_return, choque, que_hacer, mandato_del_ano)');
        }

        // Check if apertura_anual has new fields
        const hasNewAperturaFields =
          parsedResponse.apertura_anual?.eje_del_ano &&
          parsedResponse.apertura_anual?.como_se_siente;

        if (!hasNewAperturaFields) {
          console.warn('⚠️ Response missing new apertura_anual fields (eje_del_ano, como_se_siente)');
          throw new Error('Response missing eje_del_ano and como_se_siente in apertura_anual');
        }

        // Check if como_se_vive_siendo_tu has medida_del_ano
        if (!parsedResponse.como_se_vive_siendo_tu?.medida_del_ano) {
          console.warn('⚠️ Response missing medida_del_ano');
          throw new Error('Response missing medida_del_ano in como_se_vive_siendo_tu');
        }

        // Check if linea_tiempo has accion_clave
        const timelineKeys = ['mes_1_2', 'mes_3_4', 'mes_6_7', 'mes_9_10', 'mes_12'];
        const hasAccionClave = timelineKeys.every(key =>
          parsedResponse.linea_tiempo_anual?.[key]?.accion_clave
        );

        if (!hasAccionClave) {
          console.warn('⚠️ Response missing accion_clave in timeline');
          throw new Error('Response missing accion_clave in linea_tiempo_anual');
        }

        // Check if uso_calendario_lunar has 3 lunas
        const lunasCount = parsedResponse.uso_calendario_lunar?.lunas_clave?.length || 0;
        if (lunasCount !== 3) {
          console.warn(`⚠️ Response has ${lunasCount} lunas instead of 3`);
          throw new Error(`uso_calendario_lunar must have exactly 3 lunas_clave, got ${lunasCount}`);
        }

        // Check if response has meaningful content
        const hasContent =
          parsedResponse.apertura_anual?.eje_del_ano?.length > 30 &&
          parsedResponse.apertura_anual?.como_se_siente?.length > 70 &&
          parsedResponse.comparaciones_planetarias?.sol?.natal?.descripcion?.length > 50 &&
          parsedResponse.comparaciones_planetarias?.sol?.choque?.length > 80 &&
          parsedResponse.comparaciones_planetarias?.sol?.mandato_del_ano?.length > 10;

        if (!hasContent) {
          console.warn('⚠️ Response has structure but empty content');
          throw new Error('Response has empty or minimal content');
        }

        console.log(`✅ Complete valid response on attempt ${attempts + 1}`, {
          hasProperStructure: true,
          hasContent: true,
          allPlanetsPresent: true
        });
        break;
      } else {
        console.warn(`⚠️ Attempt ${attempts + 1}: Missing ${missingSections.length} sections:`, missingSections);
        attempts++;

        if (attempts < MAX_ATTEMPTS) {
          systemPrompt += `\n\n🚨 RETRY: Previous response missing: ${missingSections.join(', ')}. Include them NOW with REAL data.`;
        }
      }

    } catch (error) {
      console.error(`❌ Attempt ${attempts + 1} failed:`, error);
      attempts++;

      if (attempts >= MAX_ATTEMPTS) {
        throw error;
      }
    }
  }

  if (!parsedResponse || attempts >= MAX_ATTEMPTS) {
    throw new Error('Failed to generate valid interpretation after retries');
  }

  console.log('✅ OpenAI interpretation validated:', {
    sections: Object.keys(parsedResponse).length,
    coreStructure: {
      has_apertura_anual: !!parsedResponse.apertura_anual,
      has_como_se_vive: !!parsedResponse.como_se_vive_siendo_tu,
      has_comparaciones: !!parsedResponse.comparaciones_planetarias,
      planets_count: parsedResponse.comparaciones_planetarias ? Object.keys(parsedResponse.comparaciones_planetarias).length : 0,
      has_uso_calendario_lunar: !!parsedResponse.uso_calendario_lunar,
      has_sintesis_final: !!parsedResponse.sintesis_final
    },
    newFields: {
      has_eje_del_ano: !!parsedResponse.apertura_anual?.eje_del_ano,
      has_como_se_siente: !!parsedResponse.apertura_anual?.como_se_siente,
      has_medida_del_ano: !!parsedResponse.como_se_vive_siendo_tu?.medida_del_ano,
      has_mandato_del_ano: !!parsedResponse.comparaciones_planetarias?.sol?.mandato_del_ano,
      lunas_count: parsedResponse.uso_calendario_lunar?.lunas_clave?.length || 0
    },
    contentLengths: {
      eje_del_ano: parsedResponse.apertura_anual?.eje_del_ano?.length || 0,
      sol_natal_desc: parsedResponse.comparaciones_planetarias?.sol?.natal?.descripcion?.length || 0,
      sol_choque: parsedResponse.comparaciones_planetarias?.sol?.choque?.length || 0,
      sol_mandato: parsedResponse.comparaciones_planetarias?.sol?.mandato_del_ano?.length || 0
    }
  });

  console.log('📊 Sample content check:', {
    tema_central: parsedResponse.apertura_anual?.tema_central?.substring(0, 100) || 'MISSING',
    eje_del_ano: parsedResponse.apertura_anual?.eje_del_ano?.substring(0, 100) || 'MISSING',
    sol_mandato: parsedResponse.comparaciones_planetarias?.sol?.mandato_del_ano || 'MISSING'
  });

  return parsedResponse;
}

// ==========================================
// 🎯 MAIN POST HANDLER
// ==========================================

export async function POST(request: NextRequest) {
  try {
    console.log('🌅 ===== SOLAR RETURN INTERPRETATION REQUEST =====');

    const body = await request.json();
    const { userId, natalChart, solarReturnChart, userProfile, birthData, regenerate = false } = body;

    // ✅ LOG LOCATION DATA (important for Solar Return accuracy)
    if (birthData) {
      console.log('📍 Location data received:', {
        livesInSamePlace: birthData.livesInSamePlace,
        birthPlace: birthData.birthPlace,
        currentPlace: birthData.currentPlace || 'Same as birth',
        hasCurrentCoordinates: !!(birthData.currentLatitude && birthData.currentLongitude)
      });
    }

    // Validation
    if (!userId || !natalChart || !solarReturnChart) {
      return NextResponse.json(
        { error: 'userId, natalChart, and solarReturnChart are required' },
        { status: 400 }
      );
    }

    if (!userProfile || !userProfile.name) {
      return NextResponse.json(
        { error: 'Valid userProfile with name is required' },
        { status: 400 }
      );
    }

    // ✅ DETAILED VALIDATION & LOGGING
    console.log('🔍 ===== VALIDATING INPUT DATA =====');
    console.log('📋 userProfile received:', {
      name: userProfile?.name,
      age: userProfile?.age,
      birthPlace: userProfile?.birthPlace,
      birthDate: userProfile?.birthDate,
      birthTime: userProfile?.birthTime
    });

    console.log('📊 natalChart data:', {
      hasPlanets: !!natalChart?.planets,
      planetsCount: natalChart?.planets?.length,
      ascendant: natalChart?.ascendant?.sign,
      houses: natalChart?.houses?.length
    });

    console.log('📊 solarReturnChart data:', {
      hasPlanets: !!solarReturnChart?.planets,
      planetsCount: solarReturnChart?.planets?.length,
      ascendant: solarReturnChart?.ascendant?.sign,
      houses: solarReturnChart?.houses?.length,
      solarReturnYear: solarReturnChart?.solarReturnInfo?.year
    });

    // ✅ VALIDATION: Reject if critical data missing
    if (!userProfile?.name || userProfile.name === 'Usuario') {
      console.error('❌ CRITICAL: Invalid user name');
      return NextResponse.json({
        success: false,
        error: 'Invalid user profile: name is required and cannot be "Usuario"'
      }, { status: 400 });
    }

    if (!userProfile?.age || userProfile.age === 0) {
      console.error('❌ CRITICAL: Invalid user age');
      return NextResponse.json({
        success: false,
        error: 'Invalid user profile: age is required and cannot be 0'
      }, { status: 400 });
    }

    if (!natalChart?.planets || natalChart.planets.length === 0) {
      console.error('❌ CRITICAL: Invalid natal chart');
      return NextResponse.json({
        success: false,
        error: 'Invalid natal chart: planets data missing'
      }, { status: 400 });
    }

    if (!solarReturnChart?.planets || solarReturnChart.planets.length === 0) {
      console.error('❌ CRITICAL: Invalid solar return chart');
      return NextResponse.json({
        success: false,
        error: 'Invalid solar return chart: planets data missing'
      }, { status: 400 });
    }

    console.log('✅ All input data validated successfully');

    await connectDB();

    // Check cache (if not forcing regeneration)
    if (!regenerate) {
      console.log('🔍 Checking cache...');
      
      const cached = await Interpretation.findOne({
        userId,
        chartType: 'solar-return',
        expiresAt: { $gt: new Date() }
      })
      .sort({ generatedAt: -1 })
      .lean()
      .exec();

      if (cached) {
        console.log('✅ Cached interpretation found');
        const cachedObj = Array.isArray(cached) ? cached[0] : cached;
        return NextResponse.json({
          success: true,
          interpretation: cachedObj?.interpretation,
          cached: true,
          generatedAt: cachedObj?.generatedAt,
          method: 'mongodb_cache'
        });
      }
    }

    // Generate new interpretation
    console.log('🤖 Generating new complete interpretation...');

    const returnYear = solarReturnChart?.solarReturnInfo?.year || new Date().getFullYear();
    let interpretation: CompleteSolarReturnInterpretation;

    // ✅ PREPARE LOCATION DATA FOR INTERPRETATION
    const locationContext = birthData ? {
      livesInSamePlace: birthData.livesInSamePlace,
      birthPlace: birthData.birthPlace,
      currentPlace: birthData.livesInSamePlace
        ? birthData.birthPlace
        : (birthData.currentPlace || birthData.birthPlace),
      relocated: !birthData.livesInSamePlace,
      coordinates: {
        birth: {
          lat: birthData.latitude,
          lon: birthData.longitude
        },
        current: birthData.livesInSamePlace ? {
          lat: birthData.latitude,
          lon: birthData.longitude
        } : {
          lat: birthData.currentLatitude || birthData.latitude,
          lon: birthData.currentLongitude || birthData.longitude
        }
      }
    } : null;

    if (locationContext?.relocated) {
      console.log('🌍 RELOCATION DETECTED:', {
        from: locationContext.birthPlace,
        to: locationContext.currentPlace,
        distanceNote: 'Solar Return calculated for current location'
      });
    }

    // ✅ GENERAR COMPARACIÓN NATAL vs SR
    const srComparison = generateSRComparison(natalChart, solarReturnChart);

    console.log('📊 Comparación generada:', {
      ascSRInNatalHouse: srComparison.ascSRInNatalHouse,
      planetaryChanges: srComparison.planetaryChanges.length
    });

    // ✅ BUSCAR INTERPRETACIONES NATALES (para comparaciones personalizadas)
    console.log('🔍 Buscando interpretaciones natales...');
    let natalInterpretations = null;

    try {
      const mongoose = await connectDB();
      const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

      const natalDoc = await db.collection('interpretations_complete').findOne({
        userId,
        chartType: 'natal-complete'
      });

      if (natalDoc) {
        natalInterpretations = natalDoc.interpretation;
        console.log('✅ Interpretaciones natales encontradas:', {
          hasSol: !!natalInterpretations?.sol,
          hasLuna: !!natalInterpretations?.luna,
          hasMercurio: !!natalInterpretations?.mercurio
        });
      } else {
        console.log('⚠️ No se encontraron interpretaciones natales guardadas');
      }
    } catch (natalError) {
      console.warn('⚠️ Error buscando interpretaciones natales:', natalError);
      // Continuar sin interpretaciones natales
    }

    if (process.env.OPENAI_API_KEY) {
      try {
        interpretation = await generateCompleteWithOpenAI(
          natalChart,
          solarReturnChart,
          { ...userProfile, locationContext }, // Pass location data
          returnYear,
          srComparison, // ✅ PASAR COMPARACIÓN
          natalInterpretations // ✅ PASAR INTERPRETACIONES NATALES
        );
      } catch (openaiError) {
        console.error('❌ OpenAI failed:', openaiError);
        throw new Error('Failed to generate Solar Return interpretation with OpenAI');
      }
    } else {
      console.error('❌ No OpenAI API key configured');
      throw new Error('OpenAI API key is required for Solar Return interpretation');
    }

    // ✅ LOG BEFORE SAVING TO VERIFY STRUCTURE
    console.log('💾 Saving to MongoDB...');
    console.log('📊 Interpretation structure before save:', {
      totalKeys: Object.keys(interpretation).length,
      hasAperturaAnual: !!interpretation.apertura_anual,
      hasComoSeVive: !!interpretation.como_se_vive_siendo_tu,
      hasComparaciones: !!interpretation.comparaciones_planetarias,
      planetsCount: interpretation.comparaciones_planetarias ? Object.keys(interpretation.comparaciones_planetarias).length : 0,
      hasLineaTiempo: !!interpretation.linea_tiempo_anual,
      hasUsoCalendarioLunar: !!interpretation.uso_calendario_lunar,
      hasSintesisFinal: !!interpretation.sintesis_final,
      newFields: {
        has_eje_del_ano: !!interpretation.apertura_anual?.eje_del_ano,
        has_medida_del_ano: !!interpretation.como_se_vive_siendo_tu?.medida_del_ano,
        lunas_count: interpretation.uso_calendario_lunar?.lunas_clave?.length || 0
      }
    });

    const savedInterpretation = await Interpretation.create({
      userId,
      chartType: 'solar-return',
      natalChart,
      solarReturnChart,
      userProfile: {
        name: userProfile.name,
        age: userProfile.age || 0,
        birthPlace: userProfile.birthPlace || 'Unknown',
        birthDate: userProfile.birthDate || 'Unknown',
        birthTime: userProfile.birthTime || 'Unknown',
        // ✅ ADD LOCATION CONTEXT TO STORED DATA
        currentPlace: locationContext?.currentPlace,
        relocated: locationContext?.relocated || false
      },
      interpretation,
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + CACHE_DURATION),
      method: process.env.OPENAI_API_KEY ? 'openai' : 'fallback',
      cached: false
    });

    console.log('✅ Interpretation saved:', savedInterpretation._id);
    console.log('📊 Sections generated:', Object.keys(interpretation).length);

    return NextResponse.json({
      success: true,
      interpretation,
      cached: false,
      generatedAt: savedInterpretation.generatedAt,
      method: savedInterpretation.method
    });

  } catch (error) {
    console.error('❌ Error in Solar Return interpretation:', error);

    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('exceeded')) {
        return NextResponse.json({
          success: false,
          error: 'Se ha excedido el límite de uso de la API de OpenAI. Por favor, contacta al administrador para actualizar el plan de facturación.',
          errorType: 'quota_exceeded'
        }, { status: 429 });
      }

      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        return NextResponse.json({
          success: false,
          error: 'Error de autenticación con OpenAI. La clave API puede ser inválida.',
          errorType: 'auth_error'
        }, { status: 503 });
      }

      if (error.message.includes('rate limit')) {
        return NextResponse.json({
          success: false,
          error: 'Límite de velocidad excedido. Por favor, espera unos minutos antes de intentar nuevamente.',
          errorType: 'rate_limit'
        }, { status: 429 });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to generate interpretation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// ==========================================
// 📖 GET: RETRIEVE EXISTING INTERPRETATION
// ==========================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const interpretationDoc = await Interpretation.findOne({
      userId,
      chartType: 'solar-return',
      expiresAt: { $gt: new Date() }
    })
    .sort({ generatedAt: -1 })
    .lean()
    .exec();

    if (!interpretationDoc) {
      return NextResponse.json({
        success: false,
        message: 'No Solar Return interpretation available'
      }, { status: 404 });
    }

    // Handle case where interpretationDoc could be an array
    const doc = Array.isArray(interpretationDoc) ? interpretationDoc[0] : interpretationDoc;

    return NextResponse.json({
      success: true,
      interpretation: doc?.interpretation,
      cached: true,
      generatedAt: doc?.generatedAt,
      method: 'mongodb_cached'
    });

  } catch (error) {
    console.error('❌ Error retrieving Solar Return:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve interpretation'
    }, { status: 500 });
  }
}

// ==========================================
// 🗑️ DELETE: CLEAR CACHED INTERPRETATION
// ==========================================

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await Interpretation.deleteOne({
      userId,
      chartType: 'solar-return',
    });

    console.log(`🗑️ Deleted ${result.deletedCount} Solar Return interpretation(s) for user ${userId}`);

    return NextResponse.json({
      success: true,
      message: 'Solar Return cache cleared successfully',
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('❌ Error deleting Solar Return cache:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to clear cache'
    }, { status: 500 });
  }
}