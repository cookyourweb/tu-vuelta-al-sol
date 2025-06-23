// src/app/api/charts/natal/route.ts - VERSIÓN SINCRONIZADA CON PROKERALA
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData from '@/models/BirthData';
import Chart from '@/models/Chart';

/**
 * ✅ API CHARTS/NATAL SINCRONIZADA
 * 
 * CORRECCIÓN PRINCIPAL: Ahora usa exactamente la misma lógica que /api/prokerala/natal-chart
 * 
 * GET: Obtiene carta guardada
 * POST: Genera nueva carta llamando directamente a la API de Prokerala  
 * DELETE: Elimina carta guardada (para forzar regeneración)
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Se requiere el parámetro userId' }, 
        { status: 400 }
      );
    }
    
    await connectDB();
    
    const chart = await Chart.findOne({ userId });
    
    if (!chart || !chart.natalChart) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No se encontró una carta natal para este usuario',
          message: 'Necesitas generar tu carta natal primero'
        }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Carta natal recuperada con éxito',
        natalChart: chart.natalChart 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener carta natal:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al recuperar la carta natal',
        message: 'Hubo un problema al recuperar tu carta natal. Por favor, inténtalo nuevamente.'
      },
      { status: 500 }
    );
  }
}

/**
 * 🗑️ DELETE: Eliminar carta guardada para forzar regeneración
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Se requiere el ID de usuario' }, 
        { status: 400 }
      );
    }
    
    console.log('🗑️ === ELIMINANDO CARTA GUARDADA ===');
    console.log('👤 Usuario:', userId);
    
    await connectDB();
    
    // Eliminar carta existente
    const result = await Chart.deleteOne({ userId });
    
    console.log('📊 Resultado eliminación:', result);
    
    if (result.deletedCount > 0) {
      console.log('✅ Carta eliminada exitosamente');
      return NextResponse.json(
        { 
          success: true,
          message: 'Carta natal eliminada. La próxima generación será nueva.',
          deletedCount: result.deletedCount
        },
        { status: 200 }
      );
    } else {
      console.log('📭 No había carta para eliminar');
      return NextResponse.json(
        { 
          success: true,
          message: 'No había carta guardada para este usuario',
          deletedCount: 0
        },
        { status: 200 }
      );
    }
    
  } catch (error) {
    console.error('❌ Error eliminando carta:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al eliminar la carta natal',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

/**
 * ✅ FUNCIÓN CORREGIDA: Llama directamente a la API de Prokerala (misma lógica)
 */
async function getNatalChartFromProkeralaAPI(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezone: string
) {
  try {
    console.log('🔄 === LLAMANDO A API PROKERALA DIRECTAMENTE ===');
    console.log('📅 Datos:', { birthDate, birthTime, latitude, longitude, timezone });
    
    // ✅ LLAMADA DIRECTA A LA API QUE FUNCIONA
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/prokerala/natal-chart`;
    
    console.log('🌐 Llamando a:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        birthDate,
        birthTime,
        latitude,
        longitude,
        timezone
      }),
    });
    
    console.log('📊 Status respuesta:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error respuesta API:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Error al obtener carta natal de Prokerala');
    }
    
    console.log('✅ === CARTA OBTENIDA DE PROKERALA ===');
    console.log('🔺 Ascendente:', result.data?.ascendant?.sign);
    console.log('🧪 Es Verónica:', result.debug?.isVeronica);
    console.log('⚙️ Método usado:', result.debug?.method);
    
    // Verificar si es Verónica y el resultado
    const isVeronica = birthDate === '1974-02-10' && 
                      Math.abs(latitude - 40.4168) < 0.01 && 
                      Math.abs(longitude - (-3.7038)) < 0.01;
    
    if (isVeronica) {
      console.log('🎯 === VERIFICACIÓN VERÓNICA ===');
      console.log('🔺 ASC obtenido:', result.data?.ascendant?.sign);
      console.log('✅ Esperado: Acuario');
      console.log('🎉 Correcto:', result.data?.ascendant?.sign === 'Acuario' ? 'SÍ' : 'NO');
      
      if (result.data?.ascendant?.sign !== 'Acuario') {
        console.log('⚠️ ATENCIÓN: ASC no es Acuario para Verónica');
      }
    }
    
    return result.data;
  } catch (error) {
    console.error('❌ Error obteniendo carta desde API Prokerala:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, regenerate = false } = body;
    
    console.log('🔥 === CHARTS/NATAL POST (SINCRONIZADA CON PROKERALA) ===');
    console.log('📝 Parámetros:', { userId, regenerate });
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Se requiere el ID de usuario' }, 
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Buscar datos de nacimiento del usuario
    const birthData = await BirthData.findOne({ userId });
    
    if (!birthData) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No se encontraron datos de nacimiento',
          message: 'Primero debes ingresar tus datos de nacimiento para generar la carta natal.'
        }, 
        { status: 404 }
      );
    }
    
    console.log('✅ Datos de nacimiento encontrados:', {
      birthDate: birthData.birthDate,
      birthPlace: birthData.birthPlace,
      latitude: birthData.latitude,
      longitude: birthData.longitude,
      timezone: birthData.timezone
    });
    
    // ✅ SI SE SOLICITA REGENERAR, ELIMINAR CARTA EXISTENTE
    if (regenerate) {
      console.log('🔄 Regeneración solicitada, eliminando carta existente...');
      await Chart.deleteOne({ userId });
      console.log('✅ Carta antigua eliminada');
    } else {
      // Comprobar si ya existe una carta natal
      const existingChart = await Chart.findOne({ userId });
      
      if (existingChart && existingChart.natalChart) {
        console.log('📋 Carta existente encontrada, devolviendo...');
        console.log('🔺 ASC carta existente:', existingChart.natalChart.ascendant?.sign);
        
        return NextResponse.json(
          { 
            success: true,
            message: 'Ya existe una carta natal para este usuario',
            natalChart: existingChart.natalChart 
          },
          { status: 200 }
        );
      }
    }
    
    // Preparar datos de nacimiento en el formato correcto
    const birthDate = birthData.birthDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const birthTime = birthData.birthTime || '12:00:00'; // HH:MM:SS
    const latitude = parseFloat(birthData.latitude);
    const longitude = parseFloat(birthData.longitude);
    const timezone = birthData.timezone || 'Europe/Madrid';
    
    console.log('🔧 Datos procesados para API Prokerala:', {
      birthDate,
      birthTime, 
      latitude,
      longitude,
      timezone
    });
    
    // ✅ GENERAR CARTA NATAL LLAMANDO DIRECTAMENTE A LA API DE PROKERALA
    try {
      console.log('🔄 === LLAMANDO A API PROKERALA QUE FUNCIONA ===');
      
      const natalChart = await getNatalChartFromProkeralaAPI(
        birthDate,
        birthTime,
        latitude,
        longitude,
        timezone
      );
      
      // Crear o actualizar registro de carta con upsert
      const chartData = {
        userId,
        birthDataId: birthData._id,
        natalChart,
        progressedCharts: [],
        lastUpdated: new Date()
      };
      
      const chart = await Chart.findOneAndUpdate(
        { userId },
        chartData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      
      console.log(`✅ Carta natal creada o actualizada para usuario: ${userId}`);
      
      // Log final para verificación
      console.log('🎉 === CARTA NATAL COMPLETADA ===');
      console.log('🔺 Ascendente final:', natalChart.ascendant?.sign);
      
      // Verificación específica para Verónica
      const isVeronica = birthDate === '1974-02-10';
      if (isVeronica) {
        console.log('🎯 === RESULTADO FINAL PARA VERÓNICA ===');
        console.log('🔺 ASC:', natalChart.ascendant?.sign);
        console.log('✅ Esperado: Acuario');
        console.log('🎉 Correcto:', natalChart.ascendant?.sign === 'Acuario' ? 'SÍ' : 'NO');
      }
      
      return NextResponse.json(
        { 
          success: true,
          message: `Carta natal ${regenerate ? 'regenerada' : 'generada'} correctamente usando API Prokerala`,
          natalChart,
          birthData: {
            birthDate: birthData.birthDate,
            birthTime: birthData.birthTime,
            birthPlace: birthData.birthPlace
          }
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('❌ Error durante la generación de la carta natal:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Error al generar la carta natal',
          message: 'Hubo un problema al calcular tu carta natal. Por favor, verifica que tus datos de nacimiento sean correctos.',
          details: error instanceof Error ? error.message : 'Error desconocido'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Error general en la API de carta natal:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor',
        message: 'Ocurrió un error inesperado. Por favor, inténtalo más tarde.'
      },
      { status: 500 }
    );
  }
}