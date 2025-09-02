// =============================================================================
// 🔧 CORRECCIÓN CRÍTICA: Restaurar carga de datos completa
// ARCHIVO 1: src/app/api/charts/natal/route.ts - MÉTODO GET CORREGIDO
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData, { castBirthData } from '@/models/BirthData';
import Chart, { castChart } from '@/models/Chart';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'userId requerido' 
      }, { status: 400 });
    }

    console.log('🔍 [NATAL-GET] Buscando carta natal para userId:', userId);

    // ✅ BUSCAR CARTA EXISTENTE
    const existingChartRaw = await Chart.findOne({ 
      $or: [
        { userId: userId },
        { uid: userId }
      ] 
    }).lean();

    const existingChart = castChart(existingChartRaw);

    if (existingChart && existingChart.natalChart) {
      console.log('✅ [NATAL-GET] Carta natal encontrada');
      return NextResponse.json({
        success: true,
        natalChart: existingChart.natalChart,
        found: true,
        source: 'database'
      });
    } else {
      console.log('❌ [NATAL-GET] No se encontró carta natal');
      return NextResponse.json({
        success: false,
        error: 'Carta natal no encontrada',
        found: false
      }, { status: 404 });
    }

  } catch (error) {
    console.error('❌ [NATAL-GET] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { userId, regenerate = false } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'userId requerido' 
      }, { status: 400 });
    }

    console.log('🔍 [NATAL-POST] Generando carta natal para userId:', userId);

    // ✅ BUSCAR DATOS DE NACIMIENTO
    const birthDataRaw = await BirthData.findOne({ 
      $or: [
        { userId: userId },
        { uid: userId }
      ] 
    }).lean();

    const birthData = castBirthData(birthDataRaw);

    if (!birthData) {
      return NextResponse.json({ 
        success: false, 
        error: 'Datos de nacimiento no encontrados. Ve a configurar tu perfil primero.' 
      }, { status: 404 });
    }

    // ✅ VERIFICAR SI YA EXISTE CARTA (si no es regeneración)
    if (!regenerate) {
      const existingChartRaw = await Chart.findOne({ 
        $or: [
          { userId: userId },
          { uid: userId }
        ] 
      }).lean();

      const existingChart = castChart(existingChartRaw);

      if (existingChart && existingChart.natalChart) {
        console.log('✅ [NATAL-POST] Carta existente encontrada');
        return NextResponse.json({
          success: true,
          natalChart: existingChart.natalChart,
          regenerated: false,
          source: 'existing'
        });
      }
    }

    // ✅ GENERAR/REGENERAR CARTA NATAL
    try {
      console.log('🎨 [NATAL-POST] Generando nueva carta natal...');
      
      // Llamar a la API de Prokerala
      const prokeralaResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/prokerala/natal-chart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: birthData.birthDate instanceof Date 
            ? birthData.birthDate.toISOString().split('T')[0] 
            : birthData.birthDate,
          birthTime: birthData.birthTime,
          latitude: Number(birthData.latitude),
          longitude: Number(birthData.longitude),
          timezone: birthData.timezone
        })
      });

      let natalChart;
      
      if (prokeralaResponse.ok) {
        const prokeralaData = await prokeralaResponse.json();
        if (prokeralaData.success) {
          natalChart = prokeralaData.data;
          console.log('✅ [NATAL-POST] Carta generada con Prokerala');
        } else {
          throw new Error('Error en respuesta Prokerala');
        }
      } else {
        throw new Error('Error llamando API Prokerala');
      }

      // Si falla Prokerala, usar datos fallback
      if (!natalChart) {
        console.log('⚠️ [NATAL-POST] Usando datos fallback');
        natalChart = generateFallbackNatalChart(birthData);
      }

      // ✅ GUARDAR EN BASE DE DATOS
      const existingChartRaw = await Chart.findOne({ 
        $or: [{ userId }, { uid: userId }] 
      }).lean();
      
      const existingChart = castChart(existingChartRaw);

      if (existingChart) {
        // Actualizar carta existente
        await Chart.updateOne(
          { _id: existingChart._id },
          { 
            natalChart: natalChart,
            lastUpdated: new Date()
          }
        );
        console.log('💾 [NATAL-POST] Carta actualizada');
      } else {
        // Crear nueva carta
        const newChart = new Chart({
          userId: userId,
          uid: userId,
          birthDataId: birthData._id,
          chartType: 'natal',
          natalChart: natalChart,
          progressedCharts: [],
          lastUpdated: new Date()
        });
        await newChart.save();
        console.log('💾 [NATAL-POST] Nueva carta creada');
      }

      return NextResponse.json({
        success: true,
        natalChart: natalChart,
        regenerated: regenerate,
        source: 'generated'
      });

    } catch (generationError) {
      console.log('⚠️ [NATAL-POST] Error generando, usando fallback:', generationError);
      
      const fallbackChart = generateFallbackNatalChart(birthData);
      
      // Intentar guardar el fallback también
      try {
        const existingChartRaw = await Chart.findOne({ 
          $or: [{ userId }, { uid: userId }] 
        }).lean();
        
        const existingChart = castChart(existingChartRaw);

        if (existingChart) {
          await Chart.updateOne(
            { _id: existingChart._id },
            { 
              natalChart: fallbackChart,
              lastUpdated: new Date()
            }
          );
        } else {
          const newChart = new Chart({
            userId: userId,
            uid: userId,
            birthDataId: birthData._id,
            chartType: 'natal',
            natalChart: fallbackChart,
            progressedCharts: [],
            lastUpdated: new Date()
          });
          await newChart.save();
        }
      } catch (saveError) {
        console.log('⚠️ [NATAL-POST] Error guardando fallback:', saveError);
      }

      return NextResponse.json({
        success: true,
        natalChart: fallbackChart,
        fallback: true,
        source: 'fallback'
      });
    }

  } catch (error) {
    console.error('❌ [NATAL-POST] Error crítico:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// ✅ FUNCIÓN AUXILIAR: Generar carta natal fallback
function generateFallbackNatalChart(birthData: any) {
  const birthDate = new Date(birthData.birthDate);
  const dayOfYear = Math.floor((birthDate.getTime() - new Date(birthDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  // Calcular Sol aproximado (muy básico)
  const sunLongitude = (dayOfYear * 0.9856) % 360;
  const sunSign = ['Capricornio', 'Acuario', 'Piscis', 'Aries', 'Tauro', 'Géminis', 
                   'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario'][Math.floor(sunLongitude / 30)];
  
  return {
    planets: [
      {
        name: 'Sol',
        sign: sunSign,
        degree: Math.floor(sunLongitude % 30),
        minutes: Math.floor((sunLongitude % 1) * 60),
        retrograde: false,
        housePosition: 1
      },
      {
        name: 'Luna',
        sign: 'Libra',
        degree: 15,
        minutes: 30,
        retrograde: false,
        housePosition: 7
      }
    ],
    houses: Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      sign: ['Acuario', 'Piscis', 'Aries', 'Tauro', 'Géminis', 'Cáncer', 
             'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio'][i],
      degree: 0,
      minutes: 0
    })),
    aspects: [],
    ascendant: {
      sign: 'Acuario',
      degree: 15,
      minutes: 0,
      longitude: 315
    },
    midheaven: {
      sign: 'Escorpio',
      degree: 15,
      minutes: 0,
      longitude: 225
    },
    elementDistribution: { fire: 25, earth: 25, air: 25, water: 25 },
    modalityDistribution: { cardinal: 33, fixed: 33, mutable: 34 },
    isFallback: true,
    generatedAt: new Date().toISOString()
  };
}

