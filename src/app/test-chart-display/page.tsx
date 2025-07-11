'use client';

import React from 'react';
import ChartDisplay from '../../components/astrology/ChartDisplaycompletosinrefactorizar';
// Removed import of ChartDisplayProps as it is not exported from ChartDisplay component

const sampleHouses = Array(12).fill(null).map((_, i) => ({
  number: i + 1,
  degree: i * 30,
  sign: ['Aries','Tauro','Géminis','Cáncer','Leo','Virgo','Libra','Escorpio','Sagitario','Capricornio','Acuario','Piscis'][i],
}));

const samplePlanets = [
  { name: 'Sun', degree: 10, sign: 'Aries', house: 1, retrograde: false },
  { name: 'Moon', degree: 20, sign: 'Tauro', house: 2, retrograde: false },
  { name: 'Mercury', degree: 15, sign: 'Géminis', house: 3, retrograde: true },
  { name: 'Venus', degree: 5, sign: 'Cáncer', house: 4, retrograde: false },
  { name: 'Mars', degree: 25, sign: 'Leo', house: 5, retrograde: false },
];

const sampleAscendant = { degree: 15, sign: 'Aries' };
const sampleMidheaven = { degree: 10, sign: 'Capricornio' };
const sampleBirthData = {
  name: 'Test User',
  birthDate: '1990-01-01',
  birthTime: '12:00',
  location: 'Test Location',
};

export default function TestChartDisplayPage() {
  return (
    <div style={{ padding: '2rem', backgroundColor: '#111', minHeight: '100vh' }}>
      <h1 style={{ color: 'white', marginBottom: '1rem' }}>Test ChartDisplay Refactorizado</h1>
      <ChartDisplay
        houses={sampleHouses}
        planets={samplePlanets}
        ascendant={sampleAscendant}
        midheaven={sampleMidheaven}
        birthData={sampleBirthData}
        elementDistribution={{ fire: 0, earth: 0, air: 0, water: 0 }}
        modalityDistribution={{ cardinal: 0, fixed: 0, mutable: 0 }}
        keyAspects={[]}
      />
    </div>
  );
}
