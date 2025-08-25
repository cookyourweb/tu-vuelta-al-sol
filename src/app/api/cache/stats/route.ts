import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Aquí puedes agregar la lógica para obtener estadísticas del caché
    const stats = {
      message: 'Estadísticas del caché',
      // Agrega más datos según sea necesario
    };

    return NextResponse.json({ success: true, data: stats }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener estadísticas del caché:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
