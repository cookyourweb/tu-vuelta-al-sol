// =============================================================================
// 🧪 TEST: Mercurio en Diciembre 2025 - Valores RAW
// src/app/api/test/mercury-december-2025/route.ts
// =============================================================================
// Verifica las posiciones exactas de Mercurio en diciembre 2025
// usando astronomy-engine (tropical puro) y compara con efemérides
// =============================================================================

import { NextResponse } from 'next/server';
import * as Astronomy from 'astronomy-engine';

// Función canónica de conversión (NO CAMBIAR)
function zodiacSignFromLongitude(longitudeDeg: number): string {
  const normalized = ((longitudeDeg % 360) + 360) % 360;
  const index = Math.floor(normalized / 30);

  const signs = [
    "Aries", "Tauro", "Géminis", "Cáncer",
    "Leo", "Virgo", "Libra", "Escorpio",
    "Sagitario", "Capricornio", "Acuario", "Piscis"
  ];

  return signs[index];
}

export async function GET() {
  console.log('\n🧪 DICIEMBRE 2025 — LOGS RAW (TROPICAL PURO)\n');

  const results = {
    mercury: [] as any[],
    sun: [] as any[],
    mars: [] as any[],
    validation: {} as any
  };

  // ========== MERCURIO ==========
  const mercuryTestDates = [
    '2025-12-01T00:00:00Z',
    '2025-12-02T00:00:00Z',
    '2025-12-02T12:00:00Z',
    '2025-12-03T00:00:00Z',
    '2025-12-05T00:00:00Z',
    '2025-12-10T00:00:00Z',
    '2025-12-11T00:00:00Z',  // ← DÍA CONFLICTIVO
    '2025-12-11T22:39:00Z',  // ← Hora exacta según Moontracks
    '2025-12-12T00:00:00Z',
    '2025-12-15T00:00:00Z',
    '2025-12-20T00:00:00Z',
    '2025-12-21T00:00:00Z',
    '2025-12-25T00:00:00Z',
    '2025-12-31T00:00:00Z',
  ];

  console.log('☿ MERCURIO — diciembre 2025\n');

  mercuryTestDates.forEach(dateStr => {
    const date = new Date(dateStr);

    // Obtener posición de Mercurio
    const mercuryVector = Astronomy.GeoVector(Astronomy.Body.Mercury, date, false);
    const mercuryEcliptic = Astronomy.Ecliptic(mercuryVector);

    const longitude = mercuryEcliptic.elon;
    const sign = zodiacSignFromLongitude(longitude);

    const result = {
      dateUTC: dateStr,
      planet: 'Mercury',
      eclipticLongitudeDeg: parseFloat(longitude.toFixed(2)),
      signCalculated: sign
    };

    console.log(JSON.stringify(result, null, 2));
    results.mercury.push(result);
  });

  // ========== SOL ==========
  const sunTestDates = [
    '2025-12-20T00:00:00Z',
    '2025-12-20T12:00:00Z',
    '2025-12-21T00:00:00Z',  // ← Solsticio
    '2025-12-21T12:00:00Z',
    '2025-12-22T00:00:00Z',
  ];

  console.log('\n☀️ SOL — diciembre 2025 (control cruzado)\n');

  sunTestDates.forEach(dateStr => {
    const date = new Date(dateStr);

    // Obtener posición del Sol
    const sunVector = Astronomy.GeoVector(Astronomy.Body.Sun, date, false);
    const sunEcliptic = Astronomy.Ecliptic(sunVector);

    const longitude = sunEcliptic.elon;
    const sign = zodiacSignFromLongitude(longitude);

    const result = {
      dateUTC: dateStr,
      planet: 'Sun',
      eclipticLongitudeDeg: parseFloat(longitude.toFixed(2)),
      signCalculated: sign
    };

    console.log(JSON.stringify(result, null, 2));
    results.sun.push(result);
  });

  // ========== MARTE ==========
  const marsTestDates = [
    '2025-12-14T00:00:00Z',
    '2025-12-15T00:00:00Z',
    '2025-12-15T06:00:00Z',  // ← Ingreso según efemérides
    '2025-12-15T12:00:00Z',
    '2025-12-16T00:00:00Z',
  ];

  console.log('\n🔥 MARTE — diciembre 2025\n');

  marsTestDates.forEach(dateStr => {
    const date = new Date(dateStr);

    // Obtener posición de Marte
    const marsVector = Astronomy.GeoVector(Astronomy.Body.Mars, date, false);
    const marsEcliptic = Astronomy.Ecliptic(marsVector);

    const longitude = marsEcliptic.elon;
    const sign = zodiacSignFromLongitude(longitude);

    const result = {
      dateUTC: dateStr,
      planet: 'Mars',
      eclipticLongitudeDeg: parseFloat(longitude.toFixed(2)),
      signCalculated: sign
    };

    console.log(JSON.stringify(result, null, 2));
    results.mars.push(result);
  });

  // ========== VALIDACIÓN ==========
  const mercuryDec11 = results.mercury.find(r => r.dateUTC === '2025-12-11T00:00:00Z');
  const mercuryDec11_exact = results.mercury.find(r => r.dateUTC === '2025-12-11T22:39:00Z');

  results.validation = {
    description: '🧠 VALIDACIÓN CLAVE',
    mercuryDec11: mercuryDec11,
    mercuryDec11_exact: mercuryDec11_exact,
    expectedLongitude: '~281°',
    expectedSign: 'Capricornio',
    isCorrect: mercuryDec11?.signCalculated === 'Capricornio' && mercuryDec11_exact?.signCalculated === 'Capricornio',
    thresholds: {
      sagittarius: '240-270°',
      capricorn: '270-300°',
      aquarius: '300-330°'
    },
    notes: [
      'Para Mercurio el 11 de diciembre:',
      '✔️ astronomy-engine debería dar ~281° → Capricornio',
      '❌ Si devuelve Sagitario → BUG confirmado'
    ]
  };

  console.log('\n🧠 VALIDACIÓN CLAVE:\n');
  console.log('Para Mercurio el 11 de diciembre:');
  console.log('✔️ astronomy-engine debería dar ~281° → Capricornio');
  console.log('❌ Si devuelve Sagitario → BUG confirmado\n');
  console.log('📌 Referencia de umbrales:');
  console.log('  240-270° = Sagitario');
  console.log('  270-300° = Capricornio');
  console.log('  300-330° = Acuario\n');

  return NextResponse.json(results, { status: 200 });
}
