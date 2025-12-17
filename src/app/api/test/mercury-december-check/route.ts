// Test para verificar posición REAL de Mercurio en diciembre 2025
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
  const positions = [];

  // Verificar Mercurio cada día de diciembre 2025
  for (let day = 1; day <= 31; day++) {
    const date = new Date(`2025-12-${day.toString().padStart(2, '0')}T12:00:00Z`);
    const mercuryVec = Astronomy.GeoVector(Astronomy.Body.Mercury, date, false);
    const ecliptic = Astronomy.Ecliptic(mercuryVec);
    const zodiac = eclipticToZodiac(ecliptic.elon);

    positions.push({
      date: date.toISOString().split('T')[0],
      ...zodiac
    });
  }

  // Encontrar cambios de signo
  const ingresses = [];
  for (let i = 1; i < positions.length; i++) {
    if (positions[i].sign !== positions[i-1].sign) {
      ingresses.push({
        date: positions[i].date,
        from: positions[i-1].sign,
        to: positions[i].sign,
        longitude: positions[i].longitude
      });
    }
  }

  return NextResponse.json({
    positions_daily: positions,
    sign_changes: ingresses,
    expected_vs_actual: {
      expected: 'Mercurio debería entrar en Capricornio el 2 dic 2025',
      actual_from_astronomy_engine: ingresses
    }
  });
}
