// src/app/api/charts/progressed/route.ts - CORRECCIÓN RÁPIDA
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData from '@/models/BirthData';
import Chart from '@/models/Chart';
// ✅ CORRECCIÓN 1: Cambiar import
import { generateProgressedChart } from '@/services/progressedChartService';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { userId, regenerate = false } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      );
    }

    console.log(`🔮 Generando carta progresada personalizada para usuario: ${userId}`);

    // 1. Obtener datos de nacimiento del usuario
    const birthData = await BirthData.findOne({ userId });
    if (!birthData) {
      return NextResponse.json(
        { error: 'Datos de nacimiento no encontrados. Completa tu perfil primero.' },
        { status: 404 }
      );
    }

    // 2. Calcular período personalizado (cumpleaños a cumpleaños)
    const progressionPeriod = calculateProgressionPeriod(birthData.birthDate);
    
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

    // 4. Generar nueva carta progresada
    console.log(`🔄 Generando nueva carta progresada para período: ${progressionPeriod.description}`);
    
    // ✅ CORRECCIÓN 2: Cambiar llamada de función y parámetros
    const progressedChartData = await generateProgressedChart({
      birthDate: birthData.birthDate.toISOString().split('T')[0], // YYYY-MM-DD
      birthTime: birthData.birthTime || '12:00:00',
      latitude: parseFloat(birthData.latitude),
      longitude: parseFloat(birthData.longitude),
      timezone: birthData.timezone || 'Europe/Madrid',
      progressionYear: progressionPeriod.startYear // ⭐ AÑO DINÁMICO BASADO EN CUMPLEAÑOS
    });

    // 5. Guardar en base de datos
    const progressedEntry = {
      period: progressionPeriod.description,
      year: progressionPeriod.startYear,
      startDate: progressionPeriod.startDate,
      endDate: progressionPeriod.endDate,
      chart: progressedChartData,
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

    console.log(`✅ Carta progresada guardada exitosamente para período: ${progressionPeriod.description}`);

    return NextResponse.json({
      success: true,
      data: {
        period: progressionPeriod,
        chart: progressedChartData,
        cached: false,
        message: 'Carta progresada generada exitosamente'
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

// ⭐ FUNCIÓN CLAVE: Calcular período personalizado por cumpleaños
function calculateProgressionPeriod(birthDate: Date) {
  const today = new Date();
  const birthMonth = birthDate.getMonth(); // 0-11
  const birthDay = birthDate.getDate(); // 1-31
  
  // Calcular próximo cumpleaños
  let nextBirthday = new Date(today.getFullYear(), birthMonth, birthDay);
  
  // Si el cumpleaños ya pasó este año, usar el próximo año
  if (nextBirthday < today) {
    nextBirthday = new Date(today.getFullYear() + 1, birthMonth, birthDay);
  }
  
  // Calcular cumpleaños siguiente (fin del período)
  const followingBirthday = new Date(nextBirthday.getFullYear() + 1, birthMonth, birthDay);
  
  // Formatear fechas para mostrar al usuario
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  return {
    startDate: nextBirthday,
    endDate: followingBirthday,
    startYear: nextBirthday.getFullYear(),
    description: `${formatDate(nextBirthday)} - ${formatDate(followingBirthday)}`,
    shortDescription: `Año ${nextBirthday.getFullYear()}-${followingBirthday.getFullYear()}`,
    daysUntilStart: Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
    isCurrentPeriod: nextBirthday.getFullYear() === today.getFullYear()
  };
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

    // Calcular período actual
    const currentPeriod = calculateProgressionPeriod(birthData.birthDate);
    
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
      (pc: { period: string; chart: any; createdAt?: Date }) => pc.period === currentPeriod.description
    );

    return NextResponse.json({
      success: true,
      data: {
        period: currentPeriod,
        chart: currentProgressedChart?.chart || null,
        hasChart: !!currentProgressedChart,
        createdAt: currentProgressedChart?.createdAt || null
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
