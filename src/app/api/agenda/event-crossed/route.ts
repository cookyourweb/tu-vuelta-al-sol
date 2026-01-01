// src/app/api/agenda/event-crossed/route.ts
// 🎯 ENDPOINT: Generar interpretación cruzada de evento (V3)
// POST /api/agenda/event-crossed
// Body: { userId, event, skipCache }

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import {
  generateCrossedInterpretation,
  generateNatalSummary
} from '@/services/eventInterpretationServiceV3_CrossedMethod';
import { generateActivationCards, identifyActivePlanets } from '@/services/planetaryActivationService';
import { AstrologicalEvent } from '@/types/astrology/events';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, event, skipCache = false } = body;

    if (!userId || !event) {
      return NextResponse.json(
        { error: 'userId and event are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // ✅ 1. Obtener carta natal
    const mongoose = await connectDB();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    const natalDoc = await db.collection('charts').findOne({
      userId,
      chartType: 'natal'
    });

    if (!natalDoc || !natalDoc.chartData) {
      return NextResponse.json({
        success: false,
        error: 'Carta natal no encontrada'
      }, { status: 404 });
    }

    // ✅ 2. Obtener carta de retorno solar
    const currentYear = new Date().getFullYear();
    const solarReturnDoc = await db.collection('charts').findOne({
      userId,
      chartType: 'solar-return',
      year: currentYear
    });

    if (!solarReturnDoc || !solarReturnDoc.chartData) {
      return NextResponse.json({
        success: false,
        error: `Retorno solar ${currentYear} no encontrado`
      }, { status: 404 });
    }

    // ✅ 3. Obtener datos del usuario
    const userDoc = await db.collection('users').findOne({ userId });

    if (!userDoc) {
      return NextResponse.json({
        success: false,
        error: 'Usuario no encontrado'
      }, { status: 404 });
    }

    const userName = userDoc.name || userDoc.displayName || 'Usuario';
    const userAge = userDoc.age || calculateAge(userDoc.birthDate);

    // ✅ 4. Generar resumen natal
    const natalSummary = generateNatalSummary(natalDoc.chartData);

    // ✅ 5. Identificar planetas activos y generar fichas
    console.log(`🎯 Identificando planetas activos para ${userName}...`);

    const activePlanets = generateActivationCards(
      natalDoc.chartData,
      solarReturnDoc.chartData
    );

    console.log(`✅ ${activePlanets.length} planetas activos identificados:`, activePlanets.map(p => p.planet));

    // ✅ 6. Generar interpretación cruzada del evento
    console.log(`🤖 Generando interpretación cruzada para evento: ${event.title}`);

    const interpretation = await generateCrossedInterpretation(
      event as AstrologicalEvent,
      userId,
      userName,
      userAge,
      natalSummary,
      activePlanets,
      { skipCache }
    );

    console.log(`✅ Interpretación cruzada generada con ${interpretation.interpretacion_cruzada.length} preguntas planetarias`);

    return NextResponse.json({
      success: true,
      interpretation,
      activePlanets: activePlanets.map(p => ({
        planet: p.planet,
        prioridad: p.prioridad
      })),
      generatedAt: new Date()
    });

  } catch (error: any) {
    console.error('❌ Error generando interpretación cruzada:', error);
    return NextResponse.json({
      success: false,
      error: 'Error generando interpretación cruzada',
      details: error.message
    }, { status: 500 });
  }
}

// ==========================================
// HELPER: Calcular edad desde birthDate
// ==========================================

function calculateAge(birthDate: string | Date): number {
  if (!birthDate) return 30; // Default

  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}
