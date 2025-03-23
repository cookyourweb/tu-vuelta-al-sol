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
    
    // Validación básica
    if (!userId || !fullName || !birthDate || !birthPlace || !latitude || !longitude) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
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
        { message: 'Datos actualizados correctamente', data: existingData },
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
      { message: 'Datos guardados correctamente', data: newBirthData },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al guardar datos de nacimiento:', error);
    return NextResponse.json(
      { error: 'Error al guardar datos de nacimiento' },
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
    
    const birthData = await BirthData.findOne({ userId });
    
    if (!birthData) {
      return NextResponse.json({ error: 'No se encontraron datos' }, { status: 404 });
    }
    
    return NextResponse.json({ data: birthData }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener datos de nacimiento:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos de nacimiento' },
      { status: 500 }
    );
  }
}