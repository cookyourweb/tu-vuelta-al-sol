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
    const { userId, planetName, sign, house, degree, chartType, year, natalPosition } = body;

    const type = chartType || 'natal';
    const typeLabel = type === 'solar-return' ? `SR ${year || ''}` : 'Natal';

    console.log(`🪐 [PLANET] Generating ${typeLabel} interpretation for:`, planetName);

    if (!userId || !planetName || !sign || !house) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, planetName, sign, house' },
        { status: 400 }
      );
    }

    // Validar que si es solar-return, tenga year
    if (type === 'solar-return' && !year) {
      return NextResponse.json(
        { success: false, error: 'Year is required for solar-return interpretations' },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    // Obtener perfil del usuario para la interpretación
    const userDoc = await db.collection('users').findOne({ userId });
    const userProfile = userDoc
      ? {
          name: userDoc.name || 'Usuario',
          age: userDoc.age || 0,
          birthDate: userDoc.birthDate || '',
          birthTime: userDoc.birthTime || '',
          birthPlace: userDoc.birthPlace || '',
        }
      : {
          name: 'Usuario',
          age: 0,
          birthDate: '',
          birthTime: '',
          birthPlace: '',
        };

    // Generate planet interpretation
    const interpretation = await generatePlanetInterpretation(
      planetName,
      sign,
      house,
      degree || 0,
      userProfile,
      type as 'natal' | 'solar-return',
      year,
      natalPosition
    );

    if (!interpretation) {
      throw new Error('Failed to generate planet interpretation');
    }

    console.log(`✅ [PLANET] Generated ${typeLabel} interpretation for:`, planetName);

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
    console.log(`📝 [PLANET] ChartType: ${type}${type === 'solar-return' ? ` (año ${year})` : ''}`);

    // Guardar con el chartType correcto
    const filter: any = { userId, chartType: type };
    if (type === 'solar-return') {
      filter.year = year;
    }

    await db.collection('interpretations').updateOne(
      filter,
      {
        $set: {
          [`interpretations.${section}.${planetKey}`]: interpretation,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log(`✅ [PLANET] Saved to MongoDB: ${section}.${planetKey} (${type}${type === 'solar-return' ? ` ${year}` : ''})`);

    return NextResponse.json({
      success: true,
      interpretation,
      planetKey,
      chartType: type,
      year: year || null,
      message: `Interpretación ${typeLabel} de ${planetName} generada correctamente`,
    });

  } catch (error) {
    console.error('❌ [PLANET] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Server error',
    }, { status: 500 });
  }
}