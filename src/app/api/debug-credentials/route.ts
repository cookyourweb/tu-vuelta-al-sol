// src/app/api/debug-credentials/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Leer EXACTAMENTE las mismas variables que usa natal-chart
  const CLIENT_ID = process.env.PROKERALA_CLIENT_ID;
  const CLIENT_SECRET = process.env.PROKERALA_CLIENT_SECRET;

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    credentials: {
      CLIENT_ID_exists: !!CLIENT_ID,
      CLIENT_ID_length: CLIENT_ID?.length || 0,
      CLIENT_ID_preview: CLIENT_ID ? CLIENT_ID.substring(0, 8) + '...' : 'UNDEFINED',
      CLIENT_ID_full: CLIENT_ID, // ⚠️ Solo para debug, quitar en producción
      CLIENT_SECRET_exists: !!CLIENT_SECRET,
      CLIENT_SECRET_length: CLIENT_SECRET?.length || 0,
      CLIENT_SECRET_preview: CLIENT_SECRET ? CLIENT_SECRET.substring(0, 8) + '...' : 'UNDEFINED',
      CLIENT_SECRET_full: CLIENT_SECRET, // ⚠️ Solo para debug, quitar en producción
    },
    allEnvVars: Object.keys(process.env).filter(key =>
      key.startsWith('PROKERALA')
    ),
    expectedValues: {
      CLIENT_ID_should_be: '1c6bf7c7-2b6b-4721-8b32-d054129ecd87',
      CLIENT_SECRET_should_be: 'uUBszMlWGA3cPZrngCOrQssCygjBvCZh8w3SQPus'
    }
  });
}