// =============================================================================
// ⚡ INTERPRET ASPECT API ROUTE
// app/api/astrology/interpret-aspect/route.ts
// Genera interpretación de UN SOLO aspecto entre planetas
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { generateAspectInterpretation } from '@/services/tripleFusedInterpretationService';
import { getUserProfile } from '@/services/userDataService';

// ⏱️ Configurar timeout para Vercel (60 segundos en plan Pro)
export const maxDuration = 10;

// =============================================================================
// POST - Generate single aspect interpretation
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planet1, planet2, aspectType, orb, chartType } = body;

    console.log('⚡ [ASPECT] Generating interpretation for:', `${planet1} ${aspectType} ${planet2}`);
    console.log('⚡ [ASPECT] Chart type:', chartType);
    console.log('⚡ [ASPECT] Orb:', orb);

    if (!userId || !planet1 || !planet2 || !aspectType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, planet1, planet2, aspectType' },
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
      age: 0,
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
      console.warn('⚠️ [ASPECT] User profile not found, using defaults');
    }

    // Generate aspect interpretation using existing service
    const interpretation = await generateAspectInterpretation(
      planet1,
      planet2,
      aspectType,
      orb || 0,
      convertedProfile
    );

    if (!interpretation) {
      throw new Error('Failed to generate aspect interpretation');
    }

    console.log('✅ [ASPECT] Generated interpretation for:', `${planet1} ${aspectType} ${planet2}`);

    // Save to MongoDB
    const aspectKey = `${planet1}-${planet2}-${aspectType}`;

    // Determinar tipo de carta
    const saveChartType = chartType === 'solar-return' ? 'solar-return' : 'natal';

    console.log(`📝 [ASPECT] Guardando en chartType: ${saveChartType}`);
    console.log(`📝 [ASPECT] Key completo: aspects.${aspectKey}`);

    await db.collection('interpretations').updateOne(
      { userId, chartType: saveChartType },
      {
        $set: {
          [`interpretations.aspects.${aspectKey}`]: interpretation,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log('✅ [ASPECT] Saved to MongoDB:', `aspects.${aspectKey}`);

    return NextResponse.json({
      success: true,
      interpretation,
      aspectKey,
      message: `Interpretación de ${planet1} ${aspectType} ${planet2} generada correctamente`,
    });

  } catch (error) {
    console.error('❌ [ASPECT] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Server error',
    }, { status: 500 });
  }
}

// =============================================================================
// GET - Retrieve cached aspect interpretation
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const planet1 = searchParams.get('planet1');
    const planet2 = searchParams.get('planet2');
    const aspectType = searchParams.get('aspectType');
    const chartType = searchParams.get('chartType') || 'natal';

    if (!userId || !planet1 || !planet2 || !aspectType) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: userId, planet1, planet2, aspectType' },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    const aspectKey = `${planet1}-${planet2}-${aspectType}`;

    console.log(`🔍 [ASPECT] Buscando interpretación: ${aspectKey} en chartType: ${chartType}`);

    // Buscar interpretación en MongoDB
    const doc = await db.collection('interpretations').findOne(
      { userId, chartType },
      { projection: { [`interpretations.aspects.${aspectKey}`]: 1 } }
    );

    if (doc?.interpretations?.aspects?.[aspectKey]) {
      console.log('✅ [ASPECT] Found cached interpretation');
      return NextResponse.json({
        success: true,
        interpretation: doc.interpretations.aspects[aspectKey],
        cached: true,
      });
    }

    console.log('⚠️ [ASPECT] No cached interpretation found');
    return NextResponse.json({
      success: false,
      error: 'No interpretation found',
      cached: false,
    }, { status: 404 });

  } catch (error) {
    console.error('❌ [ASPECT] Error retrieving:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Server error',
    }, { status: 500 });
  }
}
