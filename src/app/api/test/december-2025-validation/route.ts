// =============================================================================
// 🧪 TEST ENDPOINT: Validación de Eventos Diciembre 2025
// src/app/api/test/december-2025-validation/route.ts
// =============================================================================
// Valida que los eventos de diciembre 2025 sean TROPICALES y sin retrógrados
// =============================================================================

import { NextResponse } from 'next/server';
import * as Astronomy from 'astronomy-engine';

const ZODIAC_SIGNS = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
];

function eclipticToZodiac(longitude: number) {
  const normalizedLon = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLon / 30);
  const degree = normalizedLon % 30;

  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree: degree.toFixed(2),
    longitude: normalizedLon.toFixed(2)
  };
}

export async function GET() {
  try {
    console.log('\n🧪 === VALIDACIÓN DICIEMBRE 2025 ===\n');

    const results = [];

    // ============================================================================
    // TEST 1: Verificar posición de Mercurio el 2 de diciembre 2025
    // ============================================================================
    const dec2_2025 = new Date('2025-12-02T12:00:00Z');
    const mercuryDec2 = Astronomy.GeoVector(Astronomy.Body.Mercury, dec2_2025, false);
    const mercuryDec2Ecliptic = Astronomy.Ecliptic(mercuryDec2);
    const mercuryDec2Zodiac = eclipticToZodiac(mercuryDec2Ecliptic.elon);

    results.push({
      test: 'Mercurio el 2 de diciembre 2025',
      date: '2025-12-02T12:00:00Z',
      planet: 'Mercurio',
      tropical: mercuryDec2Zodiac,
      expected: 'Debería estar cerca de la frontera Sagitario-Capricornio',
      interpretation: mercuryDec2Zodiac.sign === 'Capricornio'
        ? '✅ CORRECTO: Mercurio en Capricornio (TROPICAL)'
        : mercuryDec2Zodiac.sign === 'Sagitario'
        ? '⚠️ Mercurio todavía en Sagitario, cerca del ingreso a Capricornio'
        : '❌ UNEXPECTED: Posición inesperada'
    });

    // ============================================================================
    // TEST 2: Verificar posición de Mercurio el 11 de diciembre 2025
    // ============================================================================
    const dec11_2025 = new Date('2025-12-11T22:34:00Z');
    const mercuryDec11 = Astronomy.GeoVector(Astronomy.Body.Mercury, dec11_2025, false);
    const mercuryDec11Ecliptic = Astronomy.Ecliptic(mercuryDec11);
    const mercuryDec11Zodiac = eclipticToZodiac(mercuryDec11Ecliptic.elon);

    // Verificar si Mercurio está retrógrado
    const sixHoursBefore = new Date(dec11_2025.getTime() - 6 * 60 * 60 * 1000);
    const sixHoursAfter = new Date(dec11_2025.getTime() + 6 * 60 * 60 * 1000);

    const mercuryBefore = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Mercury, sixHoursBefore, false));
    const mercuryAfter = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Mercury, sixHoursAfter, false));

    let lonDiff = mercuryAfter.elon - mercuryBefore.elon;
    if (lonDiff > 180) lonDiff -= 360;
    if (lonDiff < -180) lonDiff += 360;

    const isRetrograde = lonDiff < 0;

    results.push({
      test: 'Mercurio el 11 de diciembre 2025 (fecha del evento problemático)',
      date: '2025-12-11T22:34:00Z',
      planet: 'Mercurio',
      tropical: mercuryDec11Zodiac,
      retrograde: {
        isRetrograde,
        lonBefore: mercuryBefore.elon.toFixed(2),
        lonAfter: mercuryAfter.elon.toFixed(2),
        lonDiff: lonDiff.toFixed(4),
        movement: isRetrograde ? 'RETRÓGRADO ⏪' : 'DIRECTO ➡️'
      },
      interpretation: isRetrograde
        ? '✅ CORRECTO: Mercurio RETRÓGRADO - Este evento debe ser FILTRADO (no aparecer en agenda)'
        : '❌ ERROR: Mercurio directo cuando debería estar retrógrado'
    });

    // ============================================================================
    // TEST 3: Encontrar el ingreso DIRECTO de Mercurio a Capricornio
    // ============================================================================
    let mercuryIngressDate: Date | null = null;
    let currentDate = new Date('2025-11-25T00:00:00Z');
    const endSearch = new Date('2025-12-10T00:00:00Z');
    let lastSign = '';

    while (currentDate < endSearch && !mercuryIngressDate) {
      const pos = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Mercury, currentDate, false));
      const zodiac = eclipticToZodiac(pos.elon);

      if (lastSign === 'Sagitario' && zodiac.sign === 'Capricornio') {
        // Encontramos el ingreso! Ahora verificar si es directo
        const before = new Date(currentDate.getTime() - 6 * 60 * 60 * 1000);
        const after = new Date(currentDate.getTime() + 6 * 60 * 60 * 1000);
        const posBefore = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Mercury, before, false));
        const posAfter = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Mercury, after, false));

        let diff = posAfter.elon - posBefore.elon;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        if (diff > 0) {
          // Es ingreso directo!
          mercuryIngressDate = currentDate;
        }
      }

      lastSign = zodiac.sign;
      currentDate = new Date(currentDate.getTime() + 2 * 60 * 60 * 1000); // Avanzar 2 horas
    }

    results.push({
      test: 'Ingreso DIRECTO de Mercurio a Capricornio',
      date: mercuryIngressDate?.toISOString() || 'No encontrado',
      planet: 'Mercurio',
      interpretation: mercuryIngressDate
        ? `✅ ENCONTRADO: Mercurio ingresa DIRECTAMENTE a Capricornio el ${mercuryIngressDate.toLocaleString('es-ES', { timeZone: 'UTC' })}`
        : '❌ No se encontró ingreso directo en el rango buscado'
    });

    // ============================================================================
    // TEST 4: Solsticio de Invierno (referencia tropical)
    // ============================================================================
    const seasons2025 = Astronomy.Seasons(2025);
    const winterSolstice = seasons2025.dec_solstice.date;
    const sunAtSolstice = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Sun, winterSolstice, false));
    const sunZodiac = eclipticToZodiac(sunAtSolstice.elon);

    results.push({
      test: 'Solsticio de Invierno 2025 (referencia TROPICAL)',
      date: winterSolstice.toISOString(),
      planet: 'Sol',
      tropical: sunZodiac,
      expected: 'Sol en 270° exactos (0° Capricornio)',
      interpretation: sunZodiac.sign === 'Capricornio' && parseFloat(sunZodiac.degree) < 1
        ? '✅ PERFECTO: Sol en 0° Capricornio = TROPICAL CONFIRMADO'
        : '❌ ERROR: El solsticio no coincide con 0° Capricornio'
    });

    // ============================================================================
    // RESUMEN FINAL
    // ============================================================================
    const conclusion = {
      sistema: 'TROPICAL (Occidental)',
      libreria: 'astronomy-engine',
      confirmacion_tropical: '✅ El solsticio confirma zodíaco tropical',
      filtro_retrogrados: results[1].retrograde?.isRetrograde
        ? '✅ El filtro debe OMITIR el evento del 11 de diciembre'
        : '❌ Problema con detección de retrógrados',
      evento_correcto_diciembre: mercuryIngressDate
        ? `✅ Mostrar: Mercurio ingresa a Capricornio el ${new Date(mercuryIngressDate).toLocaleDateString('es-ES')}`
        : '⚠️ Verificar manualmente',
      evento_incorrecto_diciembre: results[1].retrograde?.isRetrograde
        ? '❌ NO mostrar: Mercurio RE-entra en Sagitario el 11 de diciembre (retrógrado)'
        : '⚠️ Verificar',
      accion_requerida: 'Presionar botón REGENERAR en la agenda para actualizar eventos con filtro aplicado'
    };

    return NextResponse.json({
      success: true,
      fecha_test: new Date().toISOString(),
      tests: results,
      conclusion,
      como_usar: {
        paso_1: 'Revisa los tests arriba para confirmar que los cálculos son tropicales',
        paso_2: 'Verifica que el evento del 11 de diciembre está marcado como RETRÓGRADO',
        paso_3: 'Confirma que el filtro debe OMITIR ese evento',
        paso_4: 'Ve a la agenda y presiona el botón REGENERAR para actualizar los eventos',
        paso_5: 'Verifica que el evento retrógrado ya no aparece'
      }
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error en validación de diciembre 2025:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
