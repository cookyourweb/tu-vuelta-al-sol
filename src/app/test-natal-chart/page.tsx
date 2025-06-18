// src/app/test-natal-chart/page.tsx - VERSIÓN MEJORADA
'use client';

import React, { useState } from 'react';
import NatalChartWheel from '../../components/astrology/NatalChartWheel';

// Static test data
const REFERENCE_CHART_DATA = {
  birthData: {
    date: '1974-02-10',
    time: '07:30:00',
    place: 'Madrid, España',
    latitude: 40.4164,
    longitude: -3.7025,
    timezone: 'Europe/Madrid'
  },
  planets: [
    { name: 'Sol', sign: 'Acuario', degree: 21, minutes: 8, longitude: 321.1397, house: 1, isRetrograde: false },
    { name: 'Luna', sign: 'Cáncer', degree: 6, minutes: 3, longitude: 96.0586, house: 8, isRetrograde: false },
    { name: 'Mercurio', sign: 'Piscis', degree: 9, minutes: 16, longitude: 339.2667, house: 1, isRetrograde: false },
    { name: 'Venus', sign: 'Escorpio', degree: 25, minutes: 59, longitude: 205.9833, house: 12, isRetrograde: true },
    { name: 'Marte', sign: 'Tauro', degree: 20, minutes: 47, longitude: 50.7833, house: 3, isRetrograde: false },
    { name: 'Júpiter', sign: 'Acuario', degree: 23, minutes: 45, longitude: 323.75, house: 1, isRetrograde: false },
    { name: 'Saturno', sign: 'Géminis', degree: 28, minutes: 4, longitude: 88.0667, house: 5, isRetrograde: true },
    { name: 'Urano', sign: 'Escorpio', degree: 27, minutes: 44, longitude: 207.7333, house: 8, isRetrograde: true },
    { name: 'Neptuno', sign: 'Sagitario', degree: 9, minutes: 22, longitude: 249.3667, house: 10, isRetrograde: false },
    { name: 'Plutón', sign: 'Libra', degree: 6, minutes: 32, longitude: 186.5333, house: 8, isRetrograde: true }
  ],
  houses: [
    { number: 1, sign: 'Acuario', degree: 4, minutes: 9, longitude: 304.15 },
    { number: 2, sign: 'Piscis', degree: 12, minutes: 0, longitude: 342 },
    { number: 3, sign: 'Aries', degree: 20, minutes: 0, longitude: 20 },
    { number: 4, sign: 'Tauro', degree: 25, minutes: 0, longitude: 55 },
    { number: 5, sign: 'Géminis', degree: 20, minutes: 0, longitude: 80 },
    { number: 6, sign: 'Cáncer', degree: 12, minutes: 0, longitude: 102 },
    { number: 7, sign: 'Leo', degree: 4, minutes: 9, longitude: 124.15 },
    { number: 8, sign: 'Virgo', degree: 12, minutes: 0, longitude: 162 },
    { number: 9, sign: 'Libra', degree: 20, minutes: 0, longitude: 200 },
    { number: 10, sign: 'Escorpio', degree: 25, minutes: 0, longitude: 235 },
    { number: 11, sign: 'Sagitario', degree: 20, minutes: 0, longitude: 260 },
    { number: 12, sign: 'Capricornio', degree: 12, minutes: 0, longitude: 282 }
  ],
  ascendant: { sign: 'Acuario', degree: 4, minutes: 9, longitude: 304.15 },
  midheaven: { sign: 'Escorpio', degree: 25, minutes: 0, longitude: 235 }
};

const TestNatalChartPage: React.FC = () => {
  const [showDebugInfo, setShowDebugInfo] = useState(true);

  let aspects = calculateAllAspects(REFERENCE_CHART_DATA.planets);

  // Remove normalization to lowercase to fix type error
  // aspects = aspects.map(a => ({
  //   planet1: a.planet1,
  //   planet2: a.planet2,
  //   type: a.type.toLowerCase() as 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile',
  //   orb: a.orb,
  //   exact: a.exact,
  //   angle: a.angle
  // }));


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Test Carta Natal - Wheel Chart con Líneas y Aspectos</h1>

      <NatalChartWheel
        planets={REFERENCE_CHART_DATA.planets}
        houses={REFERENCE_CHART_DATA.houses}
        aspects={aspects}
        ascendant={REFERENCE_CHART_DATA.ascendant}
        midheaven={REFERENCE_CHART_DATA.midheaven}
        showAspects={true}
        showPlanetNames={true}
        showDegrees={true}
        width={700}
        height={700}
      />

      {showDebugInfo && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded">
          <h2 className="font-semibold mb-2">Información de Debug</h2>
          <p>Planetas: {REFERENCE_CHART_DATA.planets.length}</p>
          <p>Casas: {REFERENCE_CHART_DATA.houses.length}</p>
          <p>Aspectos calculados: {Array.isArray(aspects) ? aspects.length : 0}</p>
        </div>
      )}
    </div>
  );
};

export default TestNatalChartPage;
type AspectType = 'Conjunction' | 'Opposition' | 'Trine' | 'Square' | 'Sextile';

interface Aspect {
  planet1: string;
  planet2: string;
  type: AspectType;
  orb: number;
  exact: boolean;
  angle: number;
}

const ASPECTS: { type: AspectType; angle: number; orb: number }[] = [
  { type: 'Conjunction', angle: 0, orb: 8 },
  { type: 'Opposition', angle: 180, orb: 8 },
  { type: 'Trine', angle: 120, orb: 6 },
  { type: 'Square', angle: 90, orb: 6 },
  { type: 'Sextile', angle: 60, orb: 4 },
];

function calculateAllAspects(planets: { name: string; sign: string; degree: number; minutes: number; longitude: number; house: number; isRetrograde: boolean; }[]): Aspect[] {
  const aspects: Aspect[] = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      const diff = Math.abs(p1.longitude - p2.longitude);
      const angle = diff > 180 ? 360 - diff : diff;
      for (const aspectDef of ASPECTS) {
        const orb = Math.abs(angle - aspectDef.angle);
        if (orb <= aspectDef.orb) {
          aspects.push({
            planet1: p1.name,
            planet2: p2.name,
            type: aspectDef.type,
            orb,
            exact: orb < 0.5,
            angle,
          });
        }
      }
    }
  }
  return aspects;
}

