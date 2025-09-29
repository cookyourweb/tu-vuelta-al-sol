import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { error: 'Se requiere parámetro q' },
      { status: 400 }
    );
  }

  try {
    console.log(`🔍 Buscando ubicación: ${query}`);

    // ✅ LLAMADA DIRECTA A NOMINATIM CON USER-AGENT ADECUADO
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'TuVueltaAlSol/1.0 (contacto@tuvueltaalsol.com)',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
        }
      }
    );

    if (!response.ok) {
      console.error(`❌ Nominatim respondió con status ${response.status}`);
      throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Encontradas ${data.length} ubicaciones`);

    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('❌ Error en geocodificación:', error);
    return NextResponse.json(
      {
        error: 'Error al buscar ubicaciones',
        suggestion: 'Prueba usando coordenadas de Google Maps en su lugar'
      },
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
