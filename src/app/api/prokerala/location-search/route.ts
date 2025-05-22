// src/app/api/prokerala/location-search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { searchLocation } from '../../charts/progressed/route';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Missing query parameter "q"' }, { status: 400 });
    }

    const results = await searchLocation(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching location:', error);
    return NextResponse.json({ error: 'Error searching location' }, { status: 500 });
  }
}
