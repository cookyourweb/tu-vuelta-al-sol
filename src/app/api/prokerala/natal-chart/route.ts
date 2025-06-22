// src/app/api/prokerala/natal-chart/route.ts - REDIRECCIÓN SIMPLE
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST - Redirecciona al endpoint principal
 * Este archivo existe para compatibilidad, pero redirige al endpoint correcto
 */
export async function POST(request: NextRequest) {
  console.log('\n🔄 /api/prokerala/natal-chart - REDIRIGIENDO...');
  
  try {
    const body = await request.json();
    console.log('📨 Redirigiendo llamada a /api/astrology/natal-chart-accurate');
    
    // ✅ REDIRECCIONAR AL ENDPOINT PRINCIPAL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/astrology/natal-chart-accurate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    // ✅ DEVOLVER MISMA ESTRUCTURA
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('❌ Error en redirección:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Redirection error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Info del endpoint
 */
export async function GET() {
  return NextResponse.json({
    message: 'Este endpoint redirige a /api/astrology/natal-chart-accurate',
    redirect: '/api/astrology/natal-chart-accurate',
    version: 'redirect-only'
  });
}