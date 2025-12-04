// =============================================================================
// 🪐 INTERPRET PLANET API ROUTE
// app/api/astrology/interpret-planet/route.ts
// Genera interpretación de UN SOLO planeta
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { generatePlanetInterpretation } from '@/services/tripleFusedInterpretationService';
import * as admin from 'firebase-admin';


// =============================================================================
// POST - Generate single planet interpretation
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planetName, sign, house, degree } = body;

    console.log('🪐 [PLANET] Generating interpretation for:', planetName);

    if (!userId || !planetName || !sign || !house) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, planetName, sign, house' },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    // Generate planet interpretation
    const interpretation = await generatePlanetInterpretation(
      planetName,
      sign,
      house,
      degree || 0,
      {} as any // TODO: Add proper userProfile parameter
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