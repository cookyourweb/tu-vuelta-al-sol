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
    clima_general: string;
    conexion_natal: string;
  };

  // CÓMO SE VIVE SIENDO TÚ
  como_se_vive_siendo_tu: {
    facilidad: string;
    incomodidad: string;
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
    mes_1_activacion: TimelineEvent;
    mes_3_4_primer_desafio: TimelineEvent;
    mes_6_7_punto_medio: TimelineEvent;
    mes_9_10_cosecha: TimelineEvent;
    mes_12_cierre: TimelineEvent;
  };

  // SOMBRAS DEL AÑO
  sombras_del_ano: string[];

  // CLAVES DE INTEGRACIÓN
  claves_integracion: string[];

  // CALENDARIO LUNAR ANUAL
  calendario_lunar_anual: Array<{
    mes: string;
    luna_nueva: {
      fecha: string;
      signo: string;
      accion: string;
    };
    luna_llena: {
      fecha: string;
      signo: string;
      accion: string;
    };
  }>;

  // CIERRE E INTEGRACIÓN
  cierre_integracion: {
    texto: string;
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
}

interface TimelineEvent {
  titulo: string;
  [key: string]: string;
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

  // ✅ SYSTEM PROMPT WITH 3 LAYERS STRUCTURE
  let systemPrompt = `You are a PROFESSIONAL astrologer specializing in Solar Return interpretation using the 3 LAYERS methodology.

⚠️ CRITICAL REQUIREMENTS:
1. You MUST respond with VALID JSON with the exact structure specified
2. Use REAL astronomical data (planets, houses, signs, degrees)
3. Use REAL user data: ${userProfile.name}, age ${userProfile.age}
4. Use SPECIFIC positions: "Sol en ${solarReturnChart?.planets?.find((p: any) => p.name === 'Sol')?.sign} Casa ${solarReturnChart?.planets?.find((p: any) => p.name === 'Sol')?.house}"
5. The 3 LAYERS are MANDATORY for each planet:
   - NATAL: Who they ARE (permanent identity)
   - SOLAR_RETURN: What activates THIS YEAR (temporary area)
   - CHOQUE: Where it clashes/enhances (specific comparison)
   - QUE_HACER: What to DO (concrete action, NO generic advice)

Required JSON structure:
{
  "apertura_anual": {
    "ano_solar": "string",
    "tema_central": "string (10-15 words)",
    "clima_general": "string (150-180 words)",
    "conexion_natal": "string (60-80 words)"
  },
  "como_se_vive_siendo_tu": {
    "facilidad": "string (60-80 words)",
    "incomodidad": "string (60-80 words)",
    "reflejos_obsoletos": "string (60-80 words)",
    "actitud_nueva": "string (60-80 words)"
  },
  "comparaciones_planetarias": {
    "sol": {
      "natal": {"posicion": "string", "descripcion": "string (80-100 words)"},
      "solar_return": {"posicion": "string", "descripcion": "string (80-100 words)"},
      "choque": "string (120-150 words - BE SPECIFIC with houses)",
      "que_hacer": "string (100-120 words - concrete action)"
    },
    "luna": {...same structure...},
    "mercurio": {...same structure...},
    "venus": {...same structure...},
    "marte": {...same structure...},
    "jupiter": {...same structure...},
    "saturno": {...same structure...}
  },
  "linea_tiempo_anual": {
    "mes_1_activacion": {
      "titulo": "string",
      "que_se_activa": "string (80 words)",
      "que_observar": "string (60 words)",
      "actitud_recomendada": "string (60 words)"
    },
    "mes_3_4_primer_desafio": {...},
    "mes_6_7_punto_medio": {...},
    "mes_9_10_cosecha": {...},
    "mes_12_cierre": {...}
  },
  "sombras_del_ano": ["string (40-50 words)", "string", "string"],
  "claves_integracion": ["string (10-15 words)", "string", "string"],
  "calendario_lunar_anual": [
    {
      "mes": "string",
      "luna_nueva": {"fecha": "YYYY-MM-DD", "signo": "string", "accion": "string (50 words)"},
      "luna_llena": {"fecha": "YYYY-MM-DD", "signo": "string", "accion": "string (50 words)"}
    }
    // 12 months
  ],
  "cierre_integracion": {
    "texto": "string (150-180 words)",
    "pregunta_final": "string (15-20 words)"
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
- NO "Formación Temprana" in Solar Return (that's only for Natal Chart)
- NO tooltip/drawer structure in main interpretation
- Professional, balanced tone (NO "REVOLUTION", NO excessive capitals)
- Use first name only (${userProfile.name?.split(' ')[0]}) 1-3 times maximum
- Be VERY SPECIFIC with houses in comparisons
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
      console.log('🔍 Sample check - has calendario_lunar_anual?', !!parsedResponse.calendario_lunar_anual);
      console.log('🔍 Sample check - has calendario_lunar?', !!parsedResponse.calendario_lunar);

      // Required sections for 3 LAYERS structure
      const requiredSections = [
        'apertura_anual',
        'como_se_vive_siendo_tu',
        'comparaciones_planetarias',
        'linea_tiempo_anual',
        'sombras_del_ano',
        'claves_integracion',
        'calendario_lunar_anual',
        'cierre_integracion',
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

        // Check if each planet has the 3 LAYERS structure
        const hasProperStructure = requiredPlanets.every(planet => {
          const p = parsedResponse.comparaciones_planetarias[planet];
          return p?.natal && p?.solar_return && p?.choque && p?.que_hacer;
        });

        if (!hasProperStructure) {
          console.warn('⚠️ Response missing 3 LAYERS structure in comparaciones_planetarias');
          throw new Error('Response missing required 3 LAYERS structure (natal, solar_return, choque, que_hacer)');
        }

        // Check if response has meaningful content
        const hasContent =
          parsedResponse.apertura_anual?.clima_general?.length > 100 &&
          parsedResponse.comparaciones_planetarias?.sol?.natal?.descripcion?.length > 50 &&
          parsedResponse.comparaciones_planetarias?.sol?.choque?.length > 100;

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
      planets_count: parsedResponse.comparaciones_planetarias ? Object.keys(parsedResponse.comparaciones_planetarias).length : 0
    },
    contentLengths: {
      clima_general: parsedResponse.apertura_anual?.clima_general?.length || 0,
      sol_natal_desc: parsedResponse.comparaciones_planetarias?.sol?.natal?.descripcion?.length || 0,
      sol_choque: parsedResponse.comparaciones_planetarias?.sol?.choque?.length || 0
    }
  });

  console.log('📊 Sample content check:', {
    tema_central: parsedResponse.apertura_anual?.tema_central?.substring(0, 100) || 'MISSING',
    sol_choque_preview: parsedResponse.comparaciones_planetarias?.sol?.choque?.substring(0, 100) || 'MISSING'
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
      hasCalendario: !!interpretation.calendario_lunar_anual
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