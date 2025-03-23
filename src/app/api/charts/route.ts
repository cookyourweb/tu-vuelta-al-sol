// src/app/api/charts/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData from '@/models/BirthData';
import Chart from '@/models/Chart';
import { getNatalChart } from '@/services/astrologyService';

export async function POST(request: Request) {
  try {
    // Obtener el ID de usuario de la solicitud
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'Se requiere el ID de usuario' }, { status: 400 });
    }
    
    await connectDB();
    
    // Buscar los datos de nacimiento del usuario
    const birthData = await BirthData.findOne({ userId });
    
    if (!birthData) {
      return NextResponse.json(
        { error: 'No se encontraron datos de nacimiento para este usuario' }, 
        { status: 404 }
      );
    }
    
    // Obtener fecha y hora de nacimiento en formato adecuado
    const birthDate = birthData.birthDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const birthTime = birthData.birthTime || '00:00';
    
    // Generar carta natal
    const natalChart = await getNatalChart(
      birthDate,
      birthTime,
      birthData.latitude,
      birthData.longitude,
      birthData.timezone
    );
    
    // Buscar si ya existe una carta para este usuario
    let chart = await Chart.findOne({ userId });
    
    if (chart) {
      // Actualizar la carta existente
      chart.natalChart = natalChart;
      chart.lastUpdated = new Date();
      
      await chart.save();
    } else {
      // Crear una nueva carta
      chart = new Chart({
        userId,
        birthDataId: birthData._id,
        natalChart,
        progressedCharts: [],
        createdAt: new Date(),
        lastUpdated: new Date()
      });
      
      await chart.save();
    }
    
    return NextResponse.json(
      { 
        message: 'Carta natal generada correctamente',
        natalChart
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al generar carta natal:', error);
    return NextResponse.json(
      { error: 'Error al generar carta natal' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'Se requiere userId' }, { status: 400 });
    }
    
    await connectDB();
    
    const chart = await Chart.findOne({ userId });
    
    if (!chart) {
      return NextResponse.json({ error: 'No se encontraron cartas para este usuario' }, { status: 404 });
    }
    
    return NextResponse.json({ chart }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener cartas astrales:', error);
    return NextResponse.json(
      { error: 'Error al obtener cartas astrales' },
      { status: 500 }
    );
  }
}   