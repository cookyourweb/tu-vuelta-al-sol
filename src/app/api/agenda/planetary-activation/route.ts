// src/app/api/agenda/planetary-activation/route.ts
// 📋 ENDPOINT: Generar fichas de activación planetaria para el año
// GET /api/agenda/planetary-activation?userId=xxx&year=2025

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { generateActivePlanetsReport } from '@/services/planetaryActivationService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const year = searchParams.get('year') || new Date().getFullYear().toString();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // ✅ 1. Obtener carta natal del usuario
    const mongoose = await connectDB();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    const natalDoc = await db.collection('charts').findOne({
      userId,
      chartType: 'natal'
    });

    if (!natalDoc || !natalDoc.chartData) {
      return NextResponse.json({
        success: false,
        error: 'Carta natal no encontrada. Por favor, genera primero tu carta natal.'
      }, { status: 404 });
    }

    // ✅ 2. Obtener carta de retorno solar para el año especificado
    const solarReturnDoc = await db.collection('charts').findOne({
      userId,
      chartType: 'solar-return',
      year: parseInt(year)
    });

    if (!solarReturnDoc || !solarReturnDoc.chartData) {
      return NextResponse.json({
        success: false,
        error: `Retorno solar ${year} no encontrado. Por favor, genera primero tu retorno solar.`
      }, { status: 404 });
    }

    // ✅ 3. Obtener interpretaciones natales (si existen)
    let natalInterpretations = null;
    try {
      const natalInterpDoc = await db.collection('interpretations_complete').findOne({
        userId,
        chartType: 'natal-complete'
      });

      if (natalInterpDoc) {
        natalInterpretations = natalInterpDoc.interpretation;
        console.log('✅ Interpretaciones natales encontradas para personalizar fichas');
      }
    } catch (err) {
      console.warn('⚠️ No se encontraron interpretaciones natales:', err);
    }

    // ✅ 4. Generar reporte de planetas activos
    console.log(`🎯 Generando fichas de activación planetaria para ${userId} año ${year}`);

    const report = generateActivePlanetsReport(
      natalDoc.chartData,
      solarReturnDoc.chartData,
      parseInt(year),
      natalInterpretations
    );

    console.log(`✅ Generadas ${report.planetas_activos.length} fichas planetarias`);

    return NextResponse.json({
      success: true,
      year: parseInt(year),
      planetas_activos: report.planetas_activos,
      resumen: report.resumen,
      generatedAt: new Date()
    });

  } catch (error: any) {
    console.error('❌ Error generando fichas de activación planetaria:', error);
    return NextResponse.json({
      success: false,
      error: 'Error generando fichas de activación planetaria',
      details: error.message
    }, { status: 500 });
  }
}
