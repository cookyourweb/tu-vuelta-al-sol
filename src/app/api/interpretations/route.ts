// src/app/api/interpretations/route.ts
// 📖 ENDPOINT: Obtener interpretaciones (Natal, Solar Return)
// GET /api/interpretations?userId=xxx&chartType=natal|solar-return

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Interpretation from '@/models/Interpretation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const chartType = searchParams.get('chartType');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    if (!chartType) {
      return NextResponse.json(
        { error: 'chartType is required (natal or solar-return)' },
        { status: 400 }
      );
    }

    if (!['natal', 'solar-return', 'progressed'].includes(chartType)) {
      return NextResponse.json(
        { error: 'chartType must be natal, solar-return, or progressed' },
        { status: 400 }
      );
    }

    await connectDB();

    // Buscar la interpretación más reciente que NO haya expirado
    const interpretation = await Interpretation.findOne({
      userId,
      chartType,
      expiresAt: { $gt: new Date() }
    })
      .sort({ generatedAt: -1 })
      .lean();

    if (!interpretation) {
      return NextResponse.json(
        { error: 'No interpretation found', exists: false },
        { status: 404 }
      );
    }

    console.log(`✅ [GET-INTERPRETATION] Found ${chartType} for user ${userId}`);

    return NextResponse.json({
      exists: true,
      interpretation: interpretation.interpretation,
      generatedAt: interpretation.generatedAt,
      method: interpretation.method,
      cached: interpretation.cached
    });

  } catch (error: any) {
    console.error('❌ [GET-INTERPRETATION] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interpretation', message: error.message },
      { status: 500 }
    );
  }
}
