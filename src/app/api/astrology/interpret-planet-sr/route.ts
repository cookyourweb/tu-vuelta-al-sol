// =============================================================================
// 🪐 INTERPRET PLANET SOLAR RETURN API ROUTE
// app/api/astrology/interpret-planet-sr/route.ts
// Genera interpretación de UN SOLO planeta en contexto SOLAR RETURN
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import OpenAI from 'openai';
import {
  generatePlanetIndividualSolarReturnPrompt,
  PLANET_SYMBOLS
} from '@/utils/prompts/planetIndividualSolarReturnPrompt';
import {
  PlanetIndividualSRInterpretation,
} from '@/types/astrology/interpretation';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// =============================================================================
// POST - Generate single planet interpretation in Solar Return context
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      planetName, // "sol", "luna", "mercurio", etc.
      returnYear,

      // Datos natales
      natalSign,
      natalHouse,
      natalDegree,
      natalInterpretation, // Opcional - interpretación natal guardada

      // Datos Solar Return
      srSign,
      srHouse,
      srDegree,

      // Contexto del usuario
      userFirstName,
    } = body;

    console.log(`🪐 [PLANET-SR] Generating ${planetName.toUpperCase()} interpretation for SR ${returnYear}`);

    // Validación de campos requeridos
    if (!userId || !planetName || !returnYear || !natalSign || !natalHouse || !srSign || !srHouse) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: userId, planetName, returnYear, natalSign, natalHouse, srSign, srHouse'
        },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    // Si existe interpretación natal guardada en MongoDB, intentar obtenerla
    let natalInterpretationText = natalInterpretation;

    if (!natalInterpretationText) {
      console.log(`🔍 [PLANET-SR] Looking for natal interpretation for ${planetName}...`);

      const natalDoc = await db.collection('interpretations_complete').findOne({
        userId,
        chartType: 'natal-complete'
      });

      if (natalDoc?.interpretation?.planetas?.[planetName]?.interpretacion) {
        natalInterpretationText = natalDoc.interpretation.planetas[planetName].interpretacion;
        console.log(`✅ [PLANET-SR] Found natal interpretation for ${planetName} in MongoDB`);
      }
    }

    // Generar símbolo del planeta
    const planetSymbol = PLANET_SYMBOLS[planetName.toLowerCase()] || '🪐';

    // Generar prompt
    const prompt = generatePlanetIndividualSolarReturnPrompt({
      planetName,
      planetSymbol,
      natalSign,
      natalHouse: Number(natalHouse),
      natalDegree: Number(natalDegree) || 0,
      natalInterpretation: natalInterpretationText,
      srSign,
      srHouse: Number(srHouse),
      srDegree: Number(srDegree) || 0,
      userFirstName: userFirstName || 'Usuario',
      returnYear: Number(returnYear),
    });

    console.log(`📝 [PLANET-SR] Prompt generated, calling OpenAI...`);

    // Llamada a OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Eres un astrólogo profesional especializado en interpretaciones de Retorno Solar. Tu tono es profesional, concreto y directo, sin metáforas largas ni lenguaje místico. Generas interpretaciones en formato JSON válido.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
    });

    const rawContent = completion.choices[0]?.message?.content;

    if (!rawContent) {
      throw new Error('OpenAI returned empty response');
    }

    console.log(`✅ [PLANET-SR] OpenAI response received`);

    // Parse JSON
    let interpretation: PlanetIndividualSRInterpretation;
    try {
      interpretation = JSON.parse(rawContent);
    } catch (parseError) {
      console.error('❌ [PLANET-SR] JSON Parse Error:', parseError);
      console.error('Raw content:', rawContent);
      throw new Error('Failed to parse OpenAI JSON response');
    }

    // Validación básica de estructura
    if (!interpretation.tooltip || !interpretation.drawer) {
      throw new Error('Invalid interpretation structure: missing tooltip or drawer');
    }

    console.log(`✅ [PLANET-SR] JSON parsed successfully`);

    // Guardar en MongoDB
    const planetKey = `${planetName}-sr-${returnYear}`;

    await db.collection('interpretations').updateOne(
      { userId, chartType: 'solar-return', returnYear },
      {
        $set: {
          [`interpretations.planets_individual.${planetKey}`]: interpretation,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log(`✅ [PLANET-SR] Saved to MongoDB: planets_individual.${planetKey}`);

    return NextResponse.json({
      success: true,
      interpretation,
      planetKey,
      message: `Interpretación de ${planetName.toUpperCase()} para Retorno Solar ${returnYear} generada correctamente`,
    });

  } catch (error) {
    console.error('❌ [PLANET-SR] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Server error',
      details: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}

// =============================================================================
// GET - Retrieve cached planet interpretation for Solar Return
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const planetName = searchParams.get('planetName');
    const returnYear = searchParams.get('returnYear');

    if (!userId || !planetName || !returnYear) {
      return NextResponse.json(
        { success: false, error: 'Missing required params: userId, planetName, returnYear' },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    const planetKey = `${planetName}-sr-${returnYear}`;

    const doc = await db.collection('interpretations').findOne({
      userId,
      chartType: 'solar-return',
      returnYear: Number(returnYear),
    });

    if (!doc?.interpretations?.planets_individual?.[planetKey]) {
      return NextResponse.json(
        { success: false, error: 'Interpretation not found in cache', cached: false },
        { status: 404 }
      );
    }

    console.log(`✅ [PLANET-SR] Retrieved cached interpretation for ${planetKey}`);

    return NextResponse.json({
      success: true,
      interpretation: doc.interpretations.planets_individual[planetKey],
      cached: true,
    });

  } catch (error) {
    console.error('❌ [PLANET-SR] GET Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Server error',
    }, { status: 500 });
  }
}
