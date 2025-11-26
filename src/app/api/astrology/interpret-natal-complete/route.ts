// =============================================================================
// 🎯 COMPLETE NATAL INTERPRETATION API ROUTE
// src/app/api/astrology/interpret-natal-complete/route.ts
// Genera interpretación COMPLETA con 17 secciones en una sola llamada
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import {
  generateCompleteNatalInterpretation,
  generateCompleteNatalInterpretationChunked,
  type CartaNatalCompleta,
} from '@/services/completeNatalInterpretationService';
import type { ChartData, UserProfile } from '@/utils/prompts/completeNatalChartPrompt';

// =============================================================================
// GET - Retrieve existing complete interpretation
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId required'
      }, { status: 400 });
    }

    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    const interpretation = await db.collection('interpretations_complete').findOne({
      userId,
      chartType: 'natal-complete',
    });

    if (!interpretation) {
      return NextResponse.json({
        success: false,
        needsGeneration: true,
        message: 'No complete interpretation found. Generate one first.',
      });
    }

    return NextResponse.json({
      success: true,
      interpretation: interpretation.interpretation,
      cached: true,
      generatedAt: interpretation.generatedAt,
      method: interpretation.method || 'cached',
    });

  } catch (error) {
    console.error('❌ Error fetching complete interpretation:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error'
    }, { status: 500 });
  }
}

// =============================================================================
// POST - Generate complete interpretation (all 17 sections)
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, chartData, userProfile, regenerate = false, useChunked = true } = body;

    console.log('🎯 [COMPLETE NATAL] POST request received');
    console.log('🎯 [COMPLETE NATAL] userId:', userId);
    console.log('🎯 [COMPLETE NATAL] userProfile:', userProfile?.name);
    console.log('🎯 [COMPLETE NATAL] regenerate:', regenerate);
    console.log('🎯 [COMPLETE NATAL] useChunked:', useChunked);

    if (!userId || !chartData || !userProfile) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, chartData, userProfile' },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    // Check for existing interpretation (unless regenerating)
    if (!regenerate) {
      const existing = await db.collection('interpretations_complete').findOne({
        userId,
        chartType: 'natal-complete',
      });

      if (existing) {
        const generatedTime = new Date(existing.generatedAt).getTime();
        const now = new Date().getTime();
        const hoursDiff = (now - generatedTime) / (1000 * 60 * 60);

        // Return cached if less than 24 hours old
        if (hoursDiff < 24) {
          console.log('✅ [COMPLETE NATAL] Returning cached interpretation');
          return NextResponse.json({
            success: true,
            interpretation: existing.interpretation,
            cached: true,
            generatedAt: existing.generatedAt,
            method: 'cached',
          });
        }
      }
    }

    console.log('🎯 [COMPLETE NATAL] Starting generation for:', userProfile.name);

    const startTime = Date.now();

    // Prepare chart data for service
    const preparedChartData: ChartData = {
      ascendant: chartData.ascendant || { sign: 'Unknown', degree: 0 },
      midheaven: chartData.midheaven || { sign: 'Unknown', degree: 0 },
      planets: chartData.planets || [],
      houses: chartData.houses || [],
      aspects: chartData.aspects || chartData.calculatedAspects || [],
    };

    // Prepare user profile
    const preparedUserProfile: UserProfile = {
      name: userProfile.name || 'Usuario',
      age: userProfile.age || 30,
      birthDate: userProfile.birthDate || '',
      birthTime: userProfile.birthTime || '',
      birthPlace: userProfile.birthPlace || '',
    };

    // Generate interpretation (single call or chunked)
    let interpretation: CartaNatalCompleta;

    if (useChunked) {
      console.log('🎯 [COMPLETE NATAL] Using chunked generation');
      interpretation = await generateCompleteNatalInterpretationChunked(
        preparedChartData,
        preparedUserProfile
      );
    } else {
      console.log('🎯 [COMPLETE NATAL] Using single-call generation');
      interpretation = await generateCompleteNatalInterpretation(
        preparedChartData,
        preparedUserProfile
      );
    }

    const generationTime = ((Date.now() - startTime) / 1000).toFixed(0);

    console.log('✅ [COMPLETE NATAL] Generation complete in', generationTime, 'seconds');
    console.log('✅ [COMPLETE NATAL] Sections generated:', Object.keys(interpretation).length);

    // Save to MongoDB
    await db.collection('interpretations_complete').updateOne(
      { userId, chartType: 'natal-complete' },
      {
        $set: {
          userId,
          chartType: 'natal-complete',
          interpretation,
          userProfile: preparedUserProfile,
          generatedAt: new Date(),
          generationTime: `${generationTime}s`,
          method: useChunked ? 'chunked' : 'single',
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        },
      },
      { upsert: true }
    );

    console.log('✅ [COMPLETE NATAL] Saved to MongoDB');

    return NextResponse.json({
      success: true,
      interpretation,
      cached: false,
      generatedAt: new Date().toISOString(),
      method: useChunked ? 'chunked' : 'single',
      generationTime: `${generationTime}s`,
    });

  } catch (error) {
    console.error('❌ [COMPLETE NATAL] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Server error',
    }, { status: 500 });
  }
}

// =============================================================================
// DELETE - Remove cached interpretation (force regeneration)
// =============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId required'
      }, { status: 400 });
    }

    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    await db.collection('interpretations_complete').deleteOne({
      userId,
      chartType: 'natal-complete',
    });

    console.log('🗑️ Deleted complete interpretation for:', userId);
    return NextResponse.json({
      success: true,
      message: 'Complete interpretation deleted',
    });

  } catch (error) {
    console.error('❌ Error deleting interpretation:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error'
    }, { status: 500 });
  }
}
