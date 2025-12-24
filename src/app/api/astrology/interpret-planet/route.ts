// =============================================================================
// 🪐 INTERPRET PLANET API ROUTE
// app/api/astrology/interpret-planet/route.ts
// Genera interpretación de UN SOLO planeta
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import {
  generatePlanetInterpretation,
  generateAscendantInterpretation,
  generateMidheavenInterpretation
} from '@/services/tripleFusedInterpretationService';
import * as admin from 'firebase-admin';


// =============================================================================
// POST - Generate single planet interpretation
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planetName, sign, house, degree, chartType = 'natal', year } = body;

    console.log('🪐 [PLANET] Generating interpretation for:', planetName, 'chartType:', chartType);

    if (!userId || !planetName || !sign || !house) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, planetName, sign, house' },
        { status: 400 }
      );
    }

    // Para Solar Return, el año es obligatorio
    if (chartType === 'solar-return' && !year) {
      return NextResponse.json(
        { success: false, error: 'Year is required for Solar Return interpretations' },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    // ⭐ CRÍTICO: Para Solar Return, buscar la posición NATAL del mismo planeta
    let natalPlanetPosition = undefined;

    if (chartType === 'solar-return' && userId) {
      try {
        console.log(`🔍 [PLANET] Buscando posición natal de ${planetName} para comparación...`);

        // Buscar la interpretación natal guardada que contiene la carta completa
        const natalInterpretation = await db.collection('interpretations').findOne({
          userId,
          chartType: 'natal'
        });

        if (natalInterpretation && natalInterpretation.natalChart) {
          // Buscar el planeta en la carta natal
          const natalPlanet = natalInterpretation.natalChart.planets?.find(
            (p: any) => p.name === planetName
          );

          if (natalPlanet) {
            natalPlanetPosition = {
              sign: natalPlanet.sign,
              house: natalPlanet.house
            };
            console.log(`✅ [PLANET] Posición natal encontrada: ${planetName} en ${natalPlanet.sign} Casa ${natalPlanet.house}`);
            console.log(`📊 [PLANET] Comparación: Natal ${natalPlanet.sign} Casa ${natalPlanet.house} → SR ${sign} Casa ${house}`);
          } else {
            console.warn(`⚠️ [PLANET] ${planetName} no encontrado en carta natal`);
          }
        } else {
          console.warn(`⚠️ [PLANET] No se encontró carta natal para userId ${userId}`);
        }
      } catch (error) {
        console.error(`❌ [PLANET] Error buscando posición natal:`, error);
        // Continuar sin posición natal (el prompt funcionará igual pero sin comparación)
      }
    }

    // ✅ NEW: Check if it's an angle (Ascendente or MedioCielo)
    const isAscendente = planetName === 'Ascendente';
    const isMedioCielo = planetName === 'MedioCielo' || planetName === 'Medio Cielo';

    let interpretation;
    let planetKey;
    let section;

    // ✅ Generate interpretation based on type
    if (isAscendente) {
      console.log('🌅 [ANGLE] Generando Ascendente...');
      interpretation = await generateAscendantInterpretation(
        sign,
        degree || 0,
        {} as any // TODO: Add proper userProfile parameter
      );
      planetKey = 'Ascendente';
      section = 'angles';
      console.log('🎯 [ANGLE] Detectado ASCENDENTE - guardando en sección: angles');
    } else if (isMedioCielo) {
      console.log('🌐 [ANGLE] Generando Medio Cielo...');
      interpretation = await generateMidheavenInterpretation(
        sign,
        degree || 0,
        {} as any // TODO: Add proper userProfile parameter
      );
      planetKey = 'MedioCielo';
      section = 'angles';
      console.log('🎯 [ANGLE] Detectado MEDIO CIELO - guardando en sección: angles');
    } else {
      // Regular planet
      interpretation = await generatePlanetInterpretation(
        planetName,
        sign,
        house,
        degree || 0,
        {} as any, // TODO: Add proper userProfile parameter
        chartType,
        year,
        natalPlanetPosition  // ⭐ Pasar posición natal para comparación
      );

      planetKey = `${planetName}-${sign}-${house}`;

      // Determinar categoría del planeta
      section = 'planets'; // Por defecto

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
    }

    if (!interpretation) {
      throw new Error(`Failed to generate interpretation for ${planetName}`);
    }

    console.log(`✅ [${section.toUpperCase()}] Generated interpretation for: ${planetName}`);

    console.log(`📝 [PLANET] Guardando en sección: ${section}`);
    console.log(`📝 [PLANET] chartType: ${chartType}`);
    console.log(`📝 [PLANET] Key completo: ${section}.${planetKey}`);

    // Guardar con el chartType correcto
    await db.collection('interpretations').updateOne(
      { userId, chartType: chartType },
      {
        $set: {
          [`interpretations.${section}.${planetKey}`]: interpretation,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log('✅ [PLANET] Saved to MongoDB:', `${section}.${planetKey}`, 'chartType:', chartType);

    return NextResponse.json({
      success: true,
      interpretation,
      planetKey,
      chartType,
      message: `Interpretación de ${planetName} ${chartType === 'solar-return' ? `SR ${year}` : ''} generada correctamente`,
    });

  } catch (error) {
    console.error('❌ [PLANET] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Server error',
    }, { status: 500 });
  }
}