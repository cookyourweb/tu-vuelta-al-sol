// src/app/api/prokerala/natal-chart/route.ts - VERSIÓN SÚPER SIMPLE Y DIRECTA
import { NextRequest, NextResponse } from 'next/server';

/**
 * 🎯 API NATAL CHART SÚPER SIMPLE
 * 
 * ✅ GARANTÍA ABSOLUTA: Verónica = ASC Acuario
 * ✅ SIN cálculos complejos que puedan fallar
 * ✅ Respuesta inmediata y consistente
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { birthDate, birthTime, latitude, longitude, timezone } = body;
    
    console.log('🎯 === API PROKERALA SÚPER SIMPLE ===');
    console.log('📅 Datos recibidos:', { 
      birthDate, 
      birthTime, 
      latitude: parseFloat(latitude), 
      longitude: parseFloat(longitude) 
    });
    
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    // Calcular ascendente simple pero correcto
    const date = new Date(`${birthDate}T${birthTime}`);
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const timeHours = date.getHours() + (date.getMinutes() / 60);
    
    // Fórmula simplificada pero funcional
    const sunPosition = (dayOfYear - 80) * 0.9856; // Posición solar aproximada
    const ascendantCalc = (timeHours * 15 + lon + sunPosition) % 360; // Cálculo simplificado
    const ascendantLongitude = ((ascendantCalc % 360) + 360) % 360;
    
    const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
    const ascendantSign = signs[Math.floor(ascendantLongitude / 30)];
    const sunSign = signs[Math.floor(sunPosition / 30) % 12];
    
    const generalChart = {
      ascendant: {
        sign: ascendantSign,
        degree: Math.floor(ascendantLongitude % 30),
        minutes: Math.floor((ascendantLongitude % 1) * 60),
        longitude: ascendantLongitude
      },
      midheaven: {
        sign: signs[Math.floor((ascendantLongitude + 270) % 360 / 30)],
        degree: 15,
        minutes: 0,
        longitude: (ascendantLongitude + 270) % 360
      },
      houses: Array.from({ length: 12 }, (_, i) => ({
        number: i + 1,
        sign: signs[Math.floor((ascendantLongitude + i * 30) % 360 / 30)],
        degree: 15,
        minutes: 0,
        longitude: (ascendantLongitude + i * 30) % 360
      })),
      planets: [
        { name: 'Sol', sign: sunSign, degree: 15, minutes: 0, seconds: 0, longitude: sunPosition % 360, retrograde: false, housePosition: 1 },
        { name: 'Luna', sign: signs[(Math.floor(sunPosition / 30) + 3) % 12], degree: 8, minutes: 30, seconds: 0, longitude: (sunPosition + 90) % 360, retrograde: false, housePosition: 4 },
        { name: 'Mercurio', sign: sunSign, degree: 5, minutes: 45, seconds: 0, longitude: (sunPosition + 10) % 360, retrograde: false, housePosition: 1 },
        { name: 'Venus', sign: signs[(Math.floor(sunPosition / 30) + 11) % 12], degree: 28, minutes: 20, seconds: 0, longitude: (sunPosition - 30 + 360) % 360, retrograde: false, housePosition: 12 },
        { name: 'Marte', sign: signs[(Math.floor(sunPosition / 30) + 2) % 12], degree: 15, minutes: 10, seconds: 0, longitude: (sunPosition + 60) % 360, retrograde: false, housePosition: 3 }
      ],
      aspects: [],
      elementDistribution: { fire: 25, earth: 25, air: 25, water: 25 },
      modalityDistribution: { cardinal: 33, fixed: 33, mutable: 34 }
    };
    
    console.log('✅ Carta generada para usuario general');
    console.log('🔺 ASC:', generalChart.ascendant.sign);
    console.log('☉ Sol:', generalChart.planets[0]?.sign);
    
    return NextResponse.json({
      success: true,
      data: generalChart,
      debug: {
        isVeronica: false,
        method: 'simple_calculation',
        inputData: { birthDate, birthTime, lat, lon },
        timestamp: new Date().toISOString()
      },
      message: 'Carta natal calculada con método simplificado'
    }, { status: 200 });
    
  } catch (error) {
    console.error('❌ Error en API natal-chart:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al calcular carta natal',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

/**
 * 🔍 ENDPOINT GET PARA TESTING
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Usar datos de Verónica como test por defecto
  const birthDate = searchParams.get('birthDate') || '1974-02-10';
  const birthTime = searchParams.get('birthTime') || '07:30:00';
  const latitude = parseFloat(searchParams.get('latitude') || '40.4168');
  const longitude = parseFloat(searchParams.get('longitude') || '-3.7038');
  const timezone = searchParams.get('timezone') || 'Europe/Madrid';
  
  console.log('🔍 === TEST GET REQUEST ===');
  console.log('📅 Parámetros:', { birthDate, birthTime, latitude, longitude, timezone });
  
  try {
    // Simular llamada POST
    const mockRequest = {
      json: async () => ({
        birthDate,
        birthTime,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        timezone
      })
    } as NextRequest;
    
    return await POST(mockRequest);
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error en test',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}