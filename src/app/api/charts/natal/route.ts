// src/app/api/charts/natal/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData from '@/models/BirthData';
import Chart from '@/models/Chart';

/**
 * API para obtener o generar una carta natal
 * 
 * GET: Obtiene la carta natal guardada de un usuario
 * POST: Genera y guarda una nueva carta natal para un usuario
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
    
    // Buscar la carta en la base de datos
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

// Función para obtener carta natal desde Prokerala API
async function getNatalChart(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezone: string,
  birthPlace: string
) {
  try {
    // Obtener URL base para la API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // Hacer la solicitud a la API de Prokerala
    const prokeralaResponse = await fetch(`${baseUrl}/api/prokerala/natal-chart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        birthDate,
        birthTime,
        latitude,
        longitude,
        timezone,
        birthPlace
      }),
    });
    
    const prokeralaResult = await prokeralaResponse.json();
    
    if (!prokeralaResponse.ok || !prokeralaResult.success) {
      throw new Error(prokeralaResult.error || 'Error al obtener carta natal de Prokerala');
    }
    
    return prokeralaResult.data;
  } catch (error) {
    console.error('Error obteniendo carta natal desde Prokerala:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, regenerate = false } = body;
    
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
    
    // Comprobar si ya existe una carta natal para el usuario y si no se ha solicitado regenerar
    if (!regenerate) {
      const existingChart = await Chart.findOne({ userId });
      
      if (existingChart && existingChart.natalChart) {
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
    
    // Preparar datos de nacimiento
    const birthDate = birthData.birthDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const birthTime = birthData.birthTime || '00:00:00';
    
    console.log(`Generando carta natal para: ${userId}, Fecha: ${birthDate}, Hora: ${birthTime}`);
    
    // Generar carta natal con el servicio de astrología
    try {
      const natalChart = await getNatalChart(
        birthDate,
        birthTime,
        birthData.latitude,
        birthData.longitude,
        birthData.timezone,
        birthData.birthPlace
      );
      
      // Buscar si ya existe un registro de carta para este usuario
      let chart = await Chart.findOne({ userId });
      
      if (chart) {
        // Actualizar la carta existente
        chart.natalChart = natalChart;
        chart.lastUpdated = new Date();
        
        await chart.save();
        console.log(`Carta natal actualizada para usuario: ${userId}`);
      } else {
        // Crear un nuevo registro de carta
        chart = new Chart({
          userId,
          birthDataId: birthData._id,
          natalChart,
          progressedCharts: [],
          createdAt: new Date(),
          lastUpdated: new Date()
        });
        
        await chart.save();
        console.log(`Nueva carta natal creada para usuario: ${userId}`);
      }
      
      return NextResponse.json(
        { 
          success: true,
          message: 'Carta natal generada correctamente',
          natalChart
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error durante la generación de la carta natal:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Error al generar la carta natal',
          message: 'Hubo un problema al calcular tu carta natal. Por favor, verifica que tus datos de nacimiento sean correctos.'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error general en la API de carta natal:', error);
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