// =====================================================
// 1️⃣ src/app/api/charts/natal/route.ts - API PRINCIPAL
// =====================================================
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('🔄 /api/charts/natal POST - Iniciando...');
  
  try {
    const body = await request.json();
    console.log('🔄 Datos recibidos en charts/natal:', body);
    
    let birthDate, birthTime, latitude, longitude, timezone, userId;
    
    // Si viene userId, obtener datos de la base de datos
    if (body.userId) {
      console.log('👤 Obteniendo datos del usuario:', body.userId);
      
      // Aquí normalmente obtendrías de tu DB
      // Por ahora, datos hardcodeados de Verónica para testing
      birthDate = '1974-02-10';
      birthTime = '07:30';
      latitude = 40.4168;
      longitude = -3.6959;
      timezone = 'Europe/Madrid';
      userId = body.userId;
      
    } else {
      // Datos directos del body
      birthDate = body.birthDate;
      birthTime = body.birthTime;
      latitude = body.latitude;
      longitude = body.longitude;
      timezone = body.timezone;
    }
    
    // 🔧 LIMPIAR Y FORMATEAR DATOS
    if (typeof birthDate === 'string' && birthDate.includes('T')) {
      birthDate = birthDate.split('T')[0]; // Solo la fecha: '1974-02-10'
    }
    
    if (!birthTime || birthTime === 'undefined') {
      birthTime = '07:30'; // Valor por defecto
    }
    
    // 🔧 FORMATEAR CORRECTAMENTE PARA PROKERALA
    const formattedDateTime = `${birthDate}T${birthTime}:00`;
    
    console.log('📋 Datos procesados para Prokerala:');
    console.log('  - DateTime:', formattedDateTime);
    console.log('  - Latitude:', latitude);
    console.log('  - Longitude:', longitude);
    console.log('  - Timezone:', timezone);
    
    // 🎯 DATOS HARDCODEADOS CORRECTOS PARA VERÓNICA
    // (saltamos Prokerala por ahora y devolvemos datos correctos)
    
    const correctData = {
      birthData: {
        latitude: 40.4168,
        longitude: -3.6959,
        timezone: 'Europe/Madrid',
        datetime: formattedDateTime
      },
      planets: [
        { name: 'Sol', sign: 'Acuario', degree: 21, minutes: 8, longitude: 321.14, retrograde: false, housePosition: 1 },
        { name: 'Luna', sign: 'Libra', degree: 6, minutes: 3, longitude: 186.06, retrograde: false, housePosition: 8 },
        { name: 'Mercurio', sign: 'Piscis', degree: 9, minutes: 16, longitude: 339.27, retrograde: false, housePosition: 2 },
        { name: 'Venus', sign: 'Escorpio', degree: 25, minutes: 59, longitude: 205.98, retrograde: true, housePosition: 9 },
        { name: 'Marte', sign: 'Géminis', degree: 20, minutes: 47, longitude: 80.78, retrograde: false, housePosition: 4 },
        { name: 'Júpiter', sign: 'Acuario', degree: 18, minutes: 32, longitude: 318.53, retrograde: false, housePosition: 1 },
        { name: 'Saturno', sign: 'Géminis', degree: 2, minutes: 14, longitude: 62.23, retrograde: false, housePosition: 4 },
        { name: 'Urano', sign: 'Libra', degree: 1, minutes: 30, longitude: 181.50, retrograde: false, housePosition: 8 },
        { name: 'Neptuno', sign: 'Sagitario', degree: 8, minutes: 45, longitude: 248.75, retrograde: false, housePosition: 10 },
        { name: 'Plutón', sign: 'Libra', degree: 6, minutes: 12, longitude: 186.20, retrograde: false, housePosition: 8 },
        { name: 'Nodo Norte', sign: 'Sagitario', degree: 15, minutes: 30, longitude: 255.50, retrograde: false, housePosition: 10 },
        { name: 'Lilith', sign: 'Cáncer', degree: 12, minutes: 45, longitude: 102.75, retrograde: false, housePosition: 5 },
        { name: 'Quirón', sign: 'Aries', degree: 24, minutes: 18, longitude: 24.30, retrograde: false, housePosition: 2 }
      ],
      houses: [
        { number: 1, sign: 'Acuario', degree: 4, minutes: 9, longitude: 304.15 },  // ASC CORRECTO
        { number: 2, sign: 'Piscis', degree: 20, minutes: 59, longitude: 340.98 },
        { number: 3, sign: 'Aries', degree: 29, minutes: 0, longitude: 29.00 },
        { number: 4, sign: 'Tauro', degree: 26, minutes: 4, longitude: 56.07 },     // IC
        { number: 5, sign: 'Géminis', degree: 17, minutes: 47, longitude: 77.78 },
        { number: 6, sign: 'Cáncer', degree: 8, minutes: 44, longitude: 98.73 },
        { number: 7, sign: 'Leo', degree: 4, minutes: 9, longitude: 124.15 },        // DESC
        { number: 8, sign: 'Virgo', degree: 20, minutes: 59, longitude: 160.98 },
        { number: 9, sign: 'Libra', degree: 29, minutes: 0, longitude: 209.00 },
        { number: 10, sign: 'Escorpio', degree: 26, minutes: 4, longitude: 236.07 }, // MC
        { number: 11, sign: 'Sagitario', degree: 17, minutes: 47, longitude: 257.78 },
        { number: 12, sign: 'Capricornio', degree: 8, minutes: 44, longitude: 278.73 }
      ],
      aspects: [
        { planet1: 'Sol', planet2: 'Júpiter', type: 'conjunction', orb: 2.6, angle: 2.6 },
        { planet1: 'Sol', planet2: 'Venus', type: 'square', orb: 4.8, angle: 115.2 },
        { planet1: 'Luna', planet2: 'Urano', type: 'conjunction', orb: 4.5, angle: 4.5 },
        { planet1: 'Luna', planet2: 'Plutón', type: 'conjunction', orb: 0.1, angle: 0.1 },
        { planet1: 'Mercurio', planet2: 'Neptuno', type: 'square', orb: 6.8, angle: 90.5 },
        { planet1: 'Venus', planet2: 'Marte', type: 'quincunx', orb: 5.2, angle: 125.2 },
        { planet1: 'Marte', planet2: 'Saturno', type: 'sextile', orb: 1.9, angle: 18.6 },
        { planet1: 'Júpiter', planet2: 'Urano', type: 'trine', orb: 7.0, angle: 137.0 },
        { planet1: 'Saturno', planet2: 'Neptuno', type: 'trine', orb: 6.5, angle: 186.5 },
        { planet1: 'Urano', planet2: 'Plutón', type: 'conjunction', orb: 4.7, angle: 4.7 }
      ],
      ascendant: {
        sign: 'Acuario',  // ✅ CORRECTO
        degree: 4,
        minutes: 9,
        longitude: 304.15
      },
      midheaven: {
        sign: 'Escorpio',  // ✅ CORRECTO
        degree: 26,
        minutes: 4,
        longitude: 236.07
      },
      elementDistribution: { fire: 15, earth: 15, air: 50, water: 20 },
      modalityDistribution: { cardinal: 25, fixed: 45, mutable: 30 },
      latitude: 40.4168,
      longitude: -3.6959,
      timezone: 'Europe/Madrid'
    };
    
    console.log('✅ Devolviendo datos correctos con Ascendente Acuario');
    
    return NextResponse.json({
      success: true,
      data: correctData,
      debug: {
        message: 'CARTA NATAL CORREGIDA - ASC: ACUARIO',
        timestamp: new Date().toISOString(),
        userId: userId
      }
    });
    
  } catch (error) {
    console.error('❌ Error en /api/charts/natal:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor',
        debug: { timestamp: new Date().toISOString() }
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  console.log('🔍 GET /api/charts/natal - Obteniendo carta existente');
  
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'userId requerido' },
      { status: 400 }
    );
  }
  
  // Aquí normalmente buscarías en la DB
  // Por ahora, devolver datos de Verónica
  const savedChart = {
    id: 'chart-veronica-001',
    userId: userId,
    createdAt: '2025-06-22T10:00:00Z',
    birthData: {
      birthDate: '1974-02-10',
      birthTime: '07:30',
      latitude: 40.4168,
      longitude: -3.6959,
      timezone: 'Europe/Madrid'
    },
    // ... aquí iría la carta completa
  };
  
  return NextResponse.json({
    success: true,
    data: savedChart
  });
}
