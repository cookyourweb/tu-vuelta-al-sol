import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData from '@/models/BirthData';

export async function GET() {
  try {
    await connectDB();
    const allBirthData = await BirthData.find({});
    return NextResponse.json({ success: true, data: allBirthData }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener todo el birth data:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener birth data', details: error instanceof Error ? error.message : '' },
      { status: 500 }
    );
  }
}
