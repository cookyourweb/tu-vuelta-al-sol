// src/app/api/debug/check-sr/route.ts
// 🔍 DEBUG ENDPOINT: Verificar Solar Returns en BD

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Interpretation from '@/models/Interpretation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    await connectDB();

    // Si hay userId, buscar solo ese usuario
    const filter = userId ? { chartType: 'solar-return', userId } : { chartType: 'solar-return' };

    const solarReturns = await Interpretation.find(filter)
      .select('userId chartType generatedAt expiresAt interpretation method')
      .sort({ generatedAt: -1 })
      .lean();

    const results = solarReturns.map((sr: any) => ({
      userId: sr.userId,
      generatedAt: sr.generatedAt,
      expiresAt: sr.expiresAt,
      method: sr.method,
      isExpired: new Date(sr.expiresAt) < new Date(),
      hasAperturaAnual: !!sr.interpretation?.apertura_anual,
      hasTemaCentral: !!sr.interpretation?.apertura_anual?.tema_central,
      hasComoSeVive: !!sr.interpretation?.como_se_vive_siendo_tu,
      hasSombras: !!sr.interpretation?.sombras_del_ano,
      interpretationKeys: Object.keys(sr.interpretation || {}),
      temaCentralPreview: sr.interpretation?.apertura_anual?.tema_central?.substring(0, 100)
    }));

    return NextResponse.json({
      total: results.length,
      results,
      message: userId
        ? `Found ${results.length} Solar Return(s) for user ${userId}`
        : `Found ${results.length} Solar Return(s) in total`
    });

  } catch (error: any) {
    console.error('❌ Error checking Solar Returns:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
