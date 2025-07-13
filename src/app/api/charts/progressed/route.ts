// src/app/api/charts/progressed/route.ts - CORREGIDO PARA USAR SERVICIO ACTUALIZADO
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData from '@/models/BirthData';
import Chart from '@/models/Chart';
// ✅ CORRECCIÓN 1: Importar funciones correctas del servicio actualizado
import { 
  generateUserProgressedChart, 
  calculateUserProgressionPeriod 
} from '@/services/progressedChartService';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { 
      userId, 
      regenerate = false,
      useCurrentLocation = false,
      currentLatitude,
      currentLongitude 
    } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      );
    }

    console.log(`🔮 Generando carta progresada personalizada para usuario: ${userId}`);
    console.log(`📍 Ubicación actual: ${useCurrentLocation ? 'Sí' : 'No (usar natal)'}`);

    // 1. Obtener datos de nacimiento del usuario
    const birthData = await BirthData.findOne({ userId });
    if (!birthData) {
      return NextResponse.json(
        { error: 'Datos de nacimiento no encontrados. Completa tu perfil primero.' },
        { status: 404 }
      );
    }

    // 2. Calcular período personalizado (cumpleaños a cumpleaños) usando servicio actualizado
    const progressionPeriod = calculateUserProgressionPeriod(birthData.birthDate);
    
    console.log(`📅 Período progresado personalizado:`, progressionPeriod);

    // 3. Verificar si ya existe carta progresada para este período
    if (!regenerate) {
      const existingChart = await Chart.findOne({ 
        userId,
        'progressedCharts.period': progressionPeriod.description
      });
      
      if (existingChart) {
        const currentProgressedChart = existingChart.progressedCharts.find(
          (pc: any) => pc.period === progressionPeriod.description
        );
        
        if (currentProgressedChart) {
          console.log(`✅ Carta progresada existente encontrada para período: ${progressionPeriod.description}`);
          return NextResponse.json({
            success: true,
            data: {
              period: progressionPeriod,
              chart: currentProgressedChart.chart,
              cached: true,
              message: 'Carta progresada encontrada en cache'
            }
          });
        }
      }
    }

    // 4. Generar nueva carta progresada usando servicio actualizado
    console.log(`🔄 Generando nueva carta progresada para período: ${progressionPeriod.description}`);
    
    // ✅ CORRECCIÓN 2: Usar generateUserProgressedChart con opciones de ubicación
    const progressedResult = await generateUserProgressedChart(
      userId,
      {
        birthDate: birthData.birthDate,
        birthTime: birthData.birthTime || '12:00:00',
        latitude: parseFloat(birthData.latitude),
        longitude: parseFloat(birthData.longitude),
        timezone: birthData.timezone || 'Europe/Madrid'
      },
      {
        forceRegenerate: regenerate,
        useCurrentLocation,
        currentLatitude: currentLatitude ? parseFloat(currentLatitude) : undefined,
        currentLongitude: currentLongitude ? parseFloat(currentLongitude) : undefined
      }
    );

    // 5. Guardar en base de datos
    const progressedEntry = {
      period: progressedResult.period.description,
      year: progressedResult.period.startYear,
      startDate: progressedResult.period.startDate,
      endDate: progressedResult.period.endDate,
      chart: progressedResult.chart,
      useCurrentLocation,
      currentLatitude: currentLatitude || null,
      currentLongitude: currentLongitude || null,
      createdAt: new Date()
    };

    await Chart.findOneAndUpdate(
      { userId },
      {
        $push: { progressedCharts: progressedEntry },
        $set: { lastUpdated: new Date() }
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Carta progresada guardada exitosamente para período: ${progressedResult.period.description}`);

    return NextResponse.json({
      success: true,
      data: {
        period: progressedResult.period,
        chart: progressedResult.chart,
        cached: false,
        useCurrentLocation,
        message: progressedResult.message,
        debug: {
          method: 'progression_chart_corrected',
          corrections_applied: [
            'birth_time_unknown sin profile[]',
            'endpoint: progression-chart',
            'soporte ubicación natal vs actual'
          ],
          timestamp: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('❌ Error generando carta progresada:', error);
    return NextResponse.json(
      { 
        error: 'Error interno generando carta progresada',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Obtener datos de nacimiento para calcular período actual
    const birthData = await BirthData.findOne({ userId });
    if (!birthData) {
      return NextResponse.json(
        { error: 'Datos de nacimiento no encontrados' },
        { status: 404 }
      );
    }

    // ✅ CORRECCIÓN 3: Usar función del servicio actualizado
    const currentPeriod = calculateUserProgressionPeriod(birthData.birthDate);
    
    // Buscar carta progresada existente
    const chart = await Chart.findOne({ 
      userId,
      'progressedCharts.period': currentPeriod.description
    });

    if (!chart || !chart.progressedCharts.length) {
      return NextResponse.json({
        success: true,
        data: {
          period: currentPeriod,
          hasChart: false,
          message: 'No hay carta progresada generada para este período'
        }
      });
    }

    const currentProgressedChart = chart.progressedCharts.find(
      (pc: { 
        period: string; 
        chart: any; 
        createdAt?: Date;
        useCurrentLocation?: boolean;
        currentLatitude?: number;
        currentLongitude?: number;
      }) => pc.period === currentPeriod.description
    );

    return NextResponse.json({
      success: true,
      data: {
        period: currentPeriod,
        chart: currentProgressedChart?.chart || null,
        hasChart: !!currentProgressedChart,
        createdAt: currentProgressedChart?.createdAt || null,
        useCurrentLocation: currentProgressedChart?.useCurrentLocation || false,
        currentLatitude: currentProgressedChart?.currentLatitude || null,
        currentLongitude: currentProgressedChart?.currentLongitude || null
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo carta progresada:', error);
    return NextResponse.json(
      { error: 'Error interno obteniendo carta progresada' },
      { status: 500 }
    );
  }
}

// ✅ CORRECCIÓN 4: Añadir endpoint DELETE para limpiar cartas progresadas
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Se requiere el ID de usuario' }, 
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Limpiar solo las cartas progresadas, mantener carta natal
    const result = await Chart.findOneAndUpdate(
      { userId },
      { 
        $set: {
          progressedCharts: [],
          lastUpdated: new Date()
        }
      }
    );
    
    return NextResponse.json(
      { 
        success: true,
        message: result ? 'Cartas progresadas eliminadas' : 'No había cartas progresadas para eliminar'
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('❌ Error eliminando cartas progresadas:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al eliminar cartas progresadas'
      },
      { status: 500 }
    );
  }
}