// =============================================================================
// 🧠 NATAL GLOBAL INTERPRETATION API - SECCIONES PSICOLÓGICAS PROFUNDAS
// src/app/api/astrology/interpret-natal-global/route.ts
// =============================================================================
// Genera 4 secciones psicológicas que requieren análisis integral de la carta:
// 1. formacion_temprana - Luna, IC, Saturno → raíces psicológicas
// 2. patrones_psicologicos - Luna, Mercurio, Plutón → patrones actuales
// 3. planetas_profundos - Plutón, Urano, Neptuno → transformación
// 4. nodos_lunares - Nodo Norte/Sur → evolución kármica
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import OpenAI from 'openai';
import {
  generateNatalGlobalSystemPrompt,
  generateNatalGlobalPrompt,
} from '@/utils/prompts/natalGlobalPrompts';

// =============================================================================
// TYPES
// =============================================================================

interface NatalGlobalInterpretation {
  formacion_temprana: string;
  patrones_psicologicos: string;
  planetas_profundos: string;
  nodos_lunares: string;
}

// =============================================================================
// OPENAI CLIENT
// =============================================================================

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// =============================================================================
// GET - Retrieve existing global interpretation
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId required' },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    const interpretation = await db.collection('interpretations').findOne({
      userId,
      chartType: 'natal-global',
    });

    if (!interpretation) {
      return NextResponse.json({
        success: false,
        needsGeneration: true,
        message: 'No global interpretation found. Generate it first.',
      });
    }

    return NextResponse.json({
      success: true,
      data: interpretation.interpretation,
      cached: true,
      generatedAt: interpretation.generatedAt,
    });
  } catch (error) {
    console.error('❌ Error fetching global interpretation:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST - Generate global interpretation (4 sections in 1 call)
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, chartData, userProfile } = body;

    console.log('🧠 [GLOBAL] Starting global interpretation generation');
    console.log('🧠 [GLOBAL] User:', userProfile.name, userProfile.age);

    if (!userId || !chartData || !userProfile) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    const openai = getOpenAIClient();

    // Generate prompts
    const systemPrompt = generateNatalGlobalSystemPrompt();
    const userPrompt = generateNatalGlobalPrompt({ chartData, userProfile });

    console.log('🧠 [GLOBAL] Calling OpenAI...');
    console.log('🧠 [GLOBAL] System prompt length:', systemPrompt.length);
    console.log('🧠 [GLOBAL] User prompt length:', userPrompt.length);

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 8000, // 4 secciones x ~2000 tokens c/u
      response_format: { type: 'json_object' },
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response from OpenAI');
    }

    console.log('🧠 [GLOBAL] OpenAI response received, length:', response.length);

    // Clean and parse response
    let cleanedResponse = response
      .trim()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed: NatalGlobalInterpretation = JSON.parse(cleanedResponse);

    // Validate structure
    const requiredSections = [
      'formacion_temprana',
      'patrones_psicologicos',
      'planetas_profundos',
      'nodos_lunares',
    ];

    const missingSections = requiredSections.filter(
      (section) => !parsed[section as keyof NatalGlobalInterpretation]
    );

    if (missingSections.length > 0) {
      console.error('❌ [GLOBAL] Missing sections:', missingSections);
      throw new Error(`Missing sections: ${missingSections.join(', ')}`);
    }

    console.log('✅ [GLOBAL] All 4 sections present');

    // Validate minimum lengths (approx 250-300 words = 1500-1800 chars)
    const minLengths = {
      formacion_temprana: 1500,
      patrones_psicologicos: 1500,
      planetas_profundos: 1800,
      nodos_lunares: 1500,
    };

    for (const [section, minLength] of Object.entries(minLengths)) {
      const sectionContent = parsed[section as keyof NatalGlobalInterpretation];
      if (sectionContent.length < minLength) {
        console.warn(
          `⚠️ [GLOBAL] ${section} is shorter than expected: ${sectionContent.length} chars (min: ${minLength})`
        );
      }
    }

    // Validate name usage
    const hasUserName = Object.values(parsed).some((section) =>
      section.includes(userProfile.name)
    );

    if (!hasUserName) {
      console.warn('⚠️ [GLOBAL] User name not found in any section');
    }

    // Save to MongoDB
    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    const interpretationDoc = {
      userId,
      chartType: 'natal-global',
      interpretation: parsed,
      generatedAt: new Date().toISOString(),
      userProfile,
      stats: {
        formacion_temprana_length: parsed.formacion_temprana.length,
        patrones_psicologicos_length: parsed.patrones_psicologicos.length,
        planetas_profundos_length: parsed.planetas_profundos.length,
        nodos_lunares_length: parsed.nodos_lunares.length,
        total_length: Object.values(parsed).join('').length,
        generation_time_ms: Date.now() - startTime,
      },
    };

    await db.collection('interpretations').updateOne(
      { userId, chartType: 'natal-global' },
      { $set: interpretationDoc },
      { upsert: true }
    );

    console.log('✅ [GLOBAL] Saved to MongoDB');
    console.log('✅ [GLOBAL] Generation time:', Date.now() - startTime, 'ms');
    console.log('✅ [GLOBAL] Stats:', interpretationDoc.stats);

    return NextResponse.json({
      success: true,
      data: parsed,
      cached: false,
      generatedAt: interpretationDoc.generatedAt,
      stats: interpretationDoc.stats,
    });
  } catch (error) {
    console.error('❌ [GLOBAL] Error generating interpretation:', error);
    console.error('❌ [GLOBAL] Stack:', error instanceof Error ? error.stack : 'No stack');

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE - Remove global interpretation (for regeneration)
// =============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId required' },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    const result = await db.collection('interpretations').deleteMany({
      userId,
      chartType: 'natal-global',
    });

    console.log(`🗑️ [GLOBAL] Deleted ${result.deletedCount} global interpretation(s)`);

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Deleted ${result.deletedCount} global interpretation(s)`,
    });
  } catch (error) {
    console.error('❌ [GLOBAL] Error deleting interpretation:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
