import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  
  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Se requieren parámetros lat y lng' },
      { status: 400 }
    );
  }

  try {
    // ✅ AGREGAR USER-AGENT OBLIGATORIO
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=es`,
      {
        headers: {
          'User-Agent': 'TuVueltaAlSol/1.0 (contacto@tuvueltaalsol.com)', // ✅ CRÍTICO
          'Accept-Language': 'es-ES,es;q=0.9'
        }
      }
    );

    if (!response.ok) {
      console.error(`❌ Nominatim reverse respondió con status ${response.status}`);
      throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('❌ Error en proxy de geocodificación inversa:', error);
    return NextResponse.json(
      { error: 'Error al obtener información de ubicación' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
