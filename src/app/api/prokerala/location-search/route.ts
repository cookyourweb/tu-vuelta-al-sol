import { NextRequest, NextResponse } from 'next/server';
import { prokeralaClient } from '@/lib/prokerala/client';
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Missing query parameter "q"' }, { status: 400 });
    }

    const results = await prokeralaClient.searchLocation(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching location:', error);
    return NextResponse.json({ error: 'Error searching location' }, { status: 500 });
  }
}
