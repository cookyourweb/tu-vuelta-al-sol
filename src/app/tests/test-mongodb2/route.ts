// src/app/api/test-mongodb/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    const connection = await connectDB();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Conexión a MongoDB establecida correctamente',
      connectionDetails: {
        readyState: connection.connection.readyState,
        host: connection.connection.host,
        name: connection.connection.name,
      }
    });
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error al conectar con MongoDB',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}