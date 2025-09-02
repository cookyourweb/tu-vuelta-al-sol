// =============================================================================
// MÉTODO 1: API Route de Diagnóstico (MÁS FÁCIL)
// src/app/api/debug/mongodb/route.ts - CREAR ESTE ARCHIVO NUEVO

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData from '@/models/BirthData';
import Chart from '@/models/Chart';

export async function GET() {
  try {
    await connectDB();
    
    // 1. Contar documentos totales
    const birthDataCount = await BirthData.countDocuments({});
    const chartCount = await Chart.countDocuments({});
    
    // 2. Ejemplo de documento BirthData
    const sampleBirthData = await BirthData.findOne({}).lean();
    
    // 3. Ejemplo de documento Chart
    const sampleChart = await Chart.findOne({}).lean();
    
    // 4. Contar por tipos de campos
    const birthDataWithUserId = await BirthData.countDocuments({ userId: { $exists: true } });
    const birthDataWithUid = await BirthData.countDocuments({ uid: { $exists: true } });
    
    // 5. Buscar charts por tipos
    const chartsWithNatal = await Chart.countDocuments({ natalChart: { $exists: true } });
    const chartsWithProgressed = await Chart.countDocuments({ progressedChart: { $exists: true } });
    const chartsWithProgressedArray = await Chart.countDocuments({ progressedCharts: { $exists: true, $ne: [] } });
    
    const diagnostico = {
      timestamp: new Date().toISOString(),
      counts: {
        birthDataTotal: birthDataCount,
        chartTotal: chartCount,
        birthDataWithUserId,
        birthDataWithUid,
        chartsWithNatal,
        chartsWithProgressed,
        chartsWithProgressedArray
      },
      samples: {
        birthDataStructure: sampleBirthData ? Object.keys(sampleBirthData) : null,
        chartStructure: sampleChart ? Object.keys(sampleChart) : null,
        sampleBirthDataFields: sampleBirthData ? {
          userId: sampleBirthData.userId,
          uid: sampleBirthData.uid,
          fullName: sampleBirthData.fullName,
          hasCoordinates: !!(sampleBirthData.latitude && sampleBirthData.longitude)
        } : null
      },
      recommendations: []
    };
    
    // Generar recomendaciones
    if (birthDataCount === 0) {
      diagnostico.recommendations.push("❌ No hay datos de nacimiento. Crear datos de prueba.");
    }
    
    if (birthDataWithUserId === 0 && birthDataWithUid === 0) {
      diagnostico.recommendations.push("❌ Documentos no tienen userId ni uid. Verificar estructura.");
    }
    
    if (birthDataWithUserId > 0 && birthDataWithUid === 0) {
      diagnostico.recommendations.push("⚠️ Documentos solo tienen userId, falta uid para compatibilidad.");
    }
    
    if (chartsWithNatal === 0) {
      diagnostico.recommendations.push("❌ No hay cartas natales. Generar carta para usuario de prueba.");
    }
    
    return NextResponse.json({
      success: true,
      diagnostico
    });
    
  } catch (error) {
    console.error('Error en diagnóstico:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

// Endpoint para ejecutar migraciones
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    await connectDB();
    
    let resultado;
    
    switch (action) {
      case 'add_uid_field':
        // Añadir campo uid a documentos que solo tienen userId
        resultado = await BirthData.updateMany(
          { uid: { $exists: false }, userId: { $exists: true } },
          [{ $set: { uid: '$userId' } }]
        );
        break;
        
      case 'add_userId_field':
        // Añadir campo userId a documentos que solo tienen uid
        resultado = await BirthData.updateMany(
          { userId: { $exists: false }, uid: { $exists: true } },
          [{ $set: { userId: '$uid' } }]
        );
        break;
        
      case 'create_test_data':
        // Crear datos de prueba
        const testData = new BirthData({
          userId: 'test-user-12345',
          uid: 'test-user-12345',
          fullName: 'Usuario de Prueba',
          birthDate: new Date('1974-02-10'),
          birthTime: '07:30',
          birthPlace: 'Madrid, España',
          latitude: 40.4164,
          longitude: -3.7025,
          timezone: 'Europe/Madrid'
        });
        resultado = await testData.save();
        break;
        
      default:
        throw new Error('Acción no válida');
    }
    
    return NextResponse.json({
      success: true,
      action,
      resultado
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error ejecutando acción'
    }, { status: 500 });
  }
}

