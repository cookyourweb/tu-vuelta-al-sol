// src/app/api/astrology/test-postman/route.ts - CORREGIDO
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    console.log('🎯 TEST-POSTMAN: Datos exactos Verónica 1974');
    
    // Get token from Prokerala
    const CLIENT_ID = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_ID;
    const CLIENT_SECRET = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_SECRET;
    
    if (!CLIENT_ID || !CLIENT_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Missing Prokerala API credentials' },
        { status: 500 }
      );
    }
    
    // Get token
    const tokenResponse = await axios.post(
      'https://api.prokerala.com/token',
      new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    const token = tokenResponse.data.access_token;
    
    // ✅ URL EXACTA CON DATOS CORRECTOS DE VERÓNICA
    // Cambiando coordenadas a Madrid exacto: 40.4164,-3.7025 (no 40.4168,-3.7038)
    const exactUrl = "https://api.prokerala.com/v2/astrology/natal-chart?profile[datetime]=1974-02-10T07:30:00%2B01:00&profile[coordinates]=40.4164,-3.7025&birth_time_unknown=false&house_system=placidus&orb=default&birth_time_rectification=flat-chart&aspect_filter=all&la=es&ayanamsa=0";
    
    console.log('📡 Llamando con URL corregida:', exactUrl);
    
    // Make the exact same request as Postman
    const response = await axios.get(exactUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    // ✅ VALIDAR POSICIONES CRÍTICAS
    const data = response.data;
    const planets = data.planets || [];
    const sun = planets.find((p: any) => p.name === 'Sun' || p.name === 'Sol');
    const moon = planets.find((p: any) => p.name === 'Moon' || p.name === 'Luna');
    const ascendant = data.ascendant;
    
    // Calcular signos para verificación
    const getSign = (longitude: number) => {
      const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 
                    'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
      return signs[Math.floor(longitude / 30)];
    };
    
    const validation = {
      sun_position: sun ? `${sun.longitude.toFixed(2)}° ${getSign(sun.longitude)}` : 'No encontrado',
      moon_position: moon ? `${moon.longitude.toFixed(2)}° ${getSign(moon.longitude)}` : 'No encontrado',
      ascendant_position: ascendant ? `${ascendant.longitude.toFixed(2)}° ${getSign(ascendant.longitude)}` : 'No encontrado',
      expected_sun: "~21° Acuario",
      expected_moon: "~6° Libra", 
      expected_ascendant: "~4° Acuario"
    };
    
    console.log('🔍 VALIDACIÓN:', validation);
    
    // ✅ VERIFICAR SI LAS POSICIONES SON CORRECTAS
    const sunCorrect = sun && getSign(sun.longitude) === 'Acuario' && sun.longitude > 20 && sun.longitude < 22;
    const moonCorrect = moon && getSign(moon.longitude) === 'Libra' && moon.longitude > 5 && moon.longitude < 7;
    const ascCorrect = ascendant && getSign(ascendant.longitude) === 'Acuario' && ascendant.longitude > 3 && ascendant.longitude < 5;
    
    return NextResponse.json({
      success: true,
      message: "Carta natal generada - Validación automática",
      data: response.data,
      validation,
      verification: {
        sun_correct: sunCorrect,
        moon_correct: moonCorrect,
        ascendant_correct: ascCorrect,
        all_correct: sunCorrect && moonCorrect && ascCorrect
      },
      instructions: {
        next_step: sunCorrect && moonCorrect && ascCorrect 
          ? "¡PERFECTO! Posiciones correctas. Usar este endpoint en la app principal."
          : "❌ Posiciones incorrectas. Revisar parámetros de API."
      }
    });
    
  } catch (error) {
    console.error('❌ Error con test Postman:', error);
    
    let errorDetails: any = 'Unknown error';
    
    if (axios.isAxiosError(error)) {
      errorDetails = {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url
      };
    } else if (error instanceof Error) {
      errorDetails = error.message;
    }
    
    return NextResponse.json({
      success: false,
      error: 'Error testing Prokerala API',
      details: errorDetails
    }, { status: 500 });
  }
}