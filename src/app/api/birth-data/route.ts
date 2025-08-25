//src/app/api/birth-data/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData from '@/models/BirthData';

export async function POST(request: Request) {
  try {
    const {
      userId,
      fullName,
      birthDate,
      birthTime,
      birthPlace,
      latitude,
      longitude,
      timezone
    } = await request.json();
    
    console.log('🔍 Datos recibidos en POST:', {
      userId,
      fullName,
      birthDate,
      birthTime,
      birthPlace,
      latitude,
      longitude,
      timezone
    });
    
    // Validación básica
    if (!userId || !fullName || !birthDate || !birthPlace || !latitude || !longitude) {
      return NextResponse.json({ 
        success: false, 
        error: 'Faltan datos requeridos' 
      }, { status: 400 });
    }

    await connectDB();

    // Verificar si ya existen datos para este usuario
    const existingData = await BirthData.findOne({ userId });
    
    if (existingData) {
      // Actualizar datos existentes
      existingData.fullName = fullName;
      existingData.birthDate = new Date(birthDate);
      existingData.birthTime = birthTime;
      existingData.birthPlace = birthPlace;
      existingData.latitude = latitude;
      existingData.longitude = longitude;
      existingData.timezone = timezone;
      
      await existingData.save();
      
      return NextResponse.json(
        { 
          success: true,
          message: 'Datos actualizados correctamente', 
          data: existingData 
        },
        { status: 200 }
      );
    }
    
    // Crear nuevos datos
    const newBirthData = new BirthData({
      userId,
      fullName,
      birthDate: new Date(birthDate),
      birthTime,
      birthPlace,
      latitude,
      longitude,
      timezone
    });

    await newBirthData.save();

    return NextResponse.json(
      { 
        success: true,
        message: 'Datos guardados correctamente', 
        data: newBirthData 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al guardar datos de nacimiento:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al guardar datos de nacimiento',
        message: 'Ocurrió un error al guardar tus datos. Por favor, inténtalo de nuevo.'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Se requiere userId' }, { status: 400 });
    }
    await connectDB();
    const result = await BirthData.deleteMany({ userId });
    if (result.deletedCount > 0) {
      return NextResponse.json({ success: true, deleted: result.deletedCount });
    }
    return NextResponse.json({ success: false, error: 'No encontrado' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error eliminando birth data', details: error instanceof Error ? error.message : '' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Se requiere userId' 
      }, { status: 400 });
    }
    
    await connectDB();
    
    const birthData = await BirthData.findOne({ userId });
    
    if (!birthData) {
      return NextResponse.json({ 
        success: false, 
        error: 'No se encontraron datos' 
      }, { status: 404 });
    }
    // Mapeo de respuesta a formato estándar para el frontend y validadores
    const mappedData = {
      birthDate: birthData.birthDate instanceof Date ? birthData.birthDate.toISOString().split('T')[0] : (birthData.birthDate || ''),
      birthTime: birthData.birthTime || '',
      birthPlace: birthData.birthPlace || '',
      latitude: birthData.latitude || 0,
      longitude: birthData.longitude || 0,
      timezone: birthData.timezone || 'UTC'
    };
    
    return NextResponse.json({ 
      success: true, 
      data: mappedData 
    }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener datos de nacimiento:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al obtener datos de nacimiento',
        message: 'Ocurrió un error al recuperar tus datos. Por favor, inténtalo de nuevo.'
      },
      { status: 500 }
    );
  }
}