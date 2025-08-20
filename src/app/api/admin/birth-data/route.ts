// src/app/api/admin/birth-data/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData from '@/models/BirthData';

export async function GET() {
  try {
    await connectDB();

    // Obtener todos los registros de birthdata
    const birthData = await BirthData.find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({ 
      success: true, 
      data: birthData 
    }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener datos de nacimiento:', error);
    return NextResponse.json({ error: 'Error al obtener datos de nacimiento' }, { status: 500 });
  }
}
