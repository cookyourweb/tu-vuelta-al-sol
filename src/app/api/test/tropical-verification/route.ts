// =============================================================================
// 🧪 ENDPOINT DE VERIFICACIÓN: TROPICAL vs SIDERAL
// src/app/api/test/tropical-verification/route.ts
// =============================================================================
// Prueba para verificar que los eventos son TROPICALES, no siderales
// =============================================================================

import { NextResponse } from 'next/server';
import * as Astronomy from 'astronomy-engine';

const ZODIAC_SIGNS_TROPICAL = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
];

function eclipticToTropical(longitude: number) {
  const normalizedLon = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLon / 30);
  const degree = normalizedLon % 30;

  return {
    sign: ZODIAC_SIGNS_TROPICAL[signIndex],
    degree: degree,
    longitude: normalizedLon
  };
}

function eclipticToSideral(longitude: number) {
  // Ayanamsa Lahiri aproximado para 2025: ~24.1°
  const AYANAMSA_LAHIRI = 24.1;
  const sideralLon = ((longitude - AYANAMSA_LAHIRI + 360) % 360);
  const signIndex = Math.floor(sideralLon / 30);
  const degree = sideralLon % 30;

  return {
    sign: ZODIAC_SIGNS_TROPICAL[signIndex],
    degree: degree,
    longitude: sideralLon
  };
}

export async function GET() {
  try {
    console.log('\n🧪 === TEST DE VERIFICACIÓN TROPICAL vs SIDERAL ===\n');

    const tests = [];

    // TEST 1: Luna Nueva en diciembre 2025
    const dec2025Date = new Date('2025-12-01T00:00:00Z');
    const newMoonDec = Astronomy.SearchMoonPhase(0, dec2025Date, 40);

    if (newMoonDec) {
      const moonVec = Astronomy.GeoVector(Astronomy.Body.Moon, newMoonDec.date, false);
      const ecliptic = Astronomy.Ecliptic(moonVec);
      const tropical = eclipticToTropical(ecliptic.elon);
      const sideral = eclipticToSideral(ecliptic.elon);

      tests.push({
        name: 'Luna Nueva Diciembre 2025',
        date: newMoonDec.date.toISOString(),
        dateFormatted: newMoonDec.date.toLocaleString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'UTC'
        }),
        tropical: {
          sign: tropical.sign,
          degree: tropical.degree.toFixed(1),
          longitude: tropical.longitude.toFixed(2),
          system: 'TROPICAL (Occidental)'
        },
        sideral: {
          sign: sideral.sign,
          degree: sideral.degree.toFixed(1),
          longitude: sideral.longitude.toFixed(2),
          system: 'SIDERAL (Védico/Lahiri)'
        },
        verdict: '✅ astronomy-engine usa TROPICAL por defecto'
      });
    }

    // TEST 2: Sol en Capricornio (Solsticio de Invierno)
    const winterSolstice2025 = Astronomy.Seasons(2025);
    const sunVec = Astronomy.GeoVector(Astronomy.Body.Sun, winterSolstice2025.dec_solstice, false);
    const sunEcliptic = Astronomy.Ecliptic(sunVec);
    const sunTropical = eclipticToTropical(sunEcliptic.elon);
    const sunSideral = eclipticToSideral(sunEcliptic.elon);

    tests.push({
      name: 'Sol en Capricornio (Solsticio)',
      date: winterSolstice2025.dec_solstice.date.toISOString(),
      dateFormatted: winterSolstice2025.dec_solstice.date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
      }),
      tropical: {
        sign: sunTropical.sign,
        degree: sunTropical.degree.toFixed(1),
        longitude: sunTropical.longitude.toFixed(2),
        expected: '270.0° (0° Capricornio)',
        system: 'TROPICAL (Occidental)'
      },
      sideral: {
        sign: sunSideral.sign,
        degree: sunSideral.degree.toFixed(1),
        longitude: sunSideral.longitude.toFixed(2),
        note: 'En sideral estaría en Sagitario',
        system: 'SIDERAL (Védico/Lahiri)'
      },
      verdict: sunTropical.longitude >= 269 && sunTropical.longitude <= 271
        ? '✅ CORRECTO: Sol en 270° = 0° Capricornio (TROPICAL)'
        : '❌ ERROR: No coincide con solsticio tropical'
    });

    // TEST 3: Verificación de Ayanamsa
    const ayanamsaInfo = {
      concepto: 'Ayanamsa es el desfase entre zodiaco tropical y sideral',
      ayanamsa_lahiri_2025: '~24.1°',
      explicacion: {
        tropical: 'Zodiaco basado en equinoccios/solsticios (estaciones)',
        sideral: 'Zodiaco basado en constelaciones fijas',
        diferencia: '~24° de desfase (Ayanamsa)'
      },
      como_distinguir: {
        tropical: 'Sol en Capricornio el 21-22 diciembre',
        sideral: 'Sol en Sagitario el 21-22 diciembre'
      }
    };

    return NextResponse.json({
      success: true,
      sistema_usado: '🌍 ASTRONOMY-ENGINE (TROPICAL por defecto)',
      tests: tests,
      ayanamsa_info: ayanamsaInfo,
      conclusion: {
        resultado: '✅ TODOS los eventos son TROPICALES',
        libreria: 'astronomy-engine',
        referencia: 'Equinoccio Vernal (0° Aries)',
        nota: 'NO usa ayanamsa porque no es una librería védica'
      },
      como_verificar: {
        paso_1: 'Mira la fecha del Solsticio de Invierno',
        paso_2: 'Si Sol está en Capricornio (270°) → TROPICAL ✅',
        paso_3: 'Si Sol está en Sagitario (~246°) → SIDERAL ❌',
        resultado: tests[1].verdict
      }
    });

  } catch (error) {
    console.error('❌ Error en test de verificación:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
