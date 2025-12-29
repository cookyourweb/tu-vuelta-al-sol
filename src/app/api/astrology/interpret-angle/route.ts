// =============================================================================
// 🎯 INTERPRET ANGLE API ROUTE
// app/api/astrology/interpret-angle/route.ts
// Genera interpretación de UN SOLO ángulo (Ascendente o Medio Cielo)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { generateAscendantInterpretation, generateMidheavenInterpretation } from '@/services/tripleFusedInterpretationService';
import { getUserProfile } from '@/services/userDataService';

// =============================================================================
// POST - Generate single angle interpretation
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, angleName, sign, degree } = body;

    console.log('🎯 [ANGLE] Generating interpretation for:', angleName);

    if (!userId || !angleName || !sign) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, angleName, sign' },
        { status: 400 }
      );
    }

    // Validar que sea un ángulo válido
    if (angleName !== 'Ascendente' && angleName !== 'Medio Cielo') {
      return NextResponse.json(
        { success: false, error: 'Invalid angle name. Must be "Ascendente" or "Medio Cielo"' },
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
      console.warn('⚠️ [ANGLE] User profile not found, using defaults');
    }

    // Generate angle interpretation
    let interpretation;
    if (angleName === 'Ascendente') {
      interpretation = await generateAscendantInterpretation(
        sign,
        degree || 0,
        convertedProfile
      );
    } else {
      interpretation = await generateMidheavenInterpretation(
        sign,
        degree || 0,
        convertedProfile
      );
    }

    if (!interpretation) {
      throw new Error('Failed to generate angle interpretation');
    }

    console.log('✅ [ANGLE] Generated interpretation for:', angleName);

    // Save to MongoDB
    const angleKey = angleName === 'Ascendente' ? 'Ascendente' : 'MedioCielo';

    console.log(`📝 [ANGLE] Guardando en sección: angles.${angleKey}`);

    await db.collection('interpretations').updateOne(
      { userId, chartType: 'natal' },
      {
        $set: {
          [`interpretations.angles.${angleKey}`]: interpretation,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log('✅ [ANGLE] Saved to MongoDB:', `angles.${angleKey}`);

    return NextResponse.json({
      success: true,
      interpretation,
      angleKey,
      message: `Interpretación de ${angleName} generada correctamente`,
    });

  } catch (error) {
    console.error('❌ [ANGLE] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Server error',
    }, { status: 500 });
  }
}
