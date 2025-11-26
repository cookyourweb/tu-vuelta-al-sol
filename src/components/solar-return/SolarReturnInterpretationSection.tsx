import React from 'react';
import InterpretationButton from '@/components/astrology/InterpretationButton';

interface SolarReturnInterpretationSectionProps {
  solarReturnData: any;
  natalChart: any;
  birthData: any;
  user: any;
}

export default function SolarReturnInterpretationSection({
  solarReturnData,
  natalChart,
  birthData,
  user
}: SolarReturnInterpretationSectionProps) {
  if (!solarReturnData || !natalChart || !birthData) {
    return null;
  }

  const userProfile = {
    name: birthData.fullName || 'Usuario',
    age: calculateAge(birthData.birthDate || birthData.date),
    birthPlace: birthData.birthPlace || '',
    currentLocation: birthData.currentPlace || birthData.currentLocation || birthData.birthPlace || '',
    birthDate: new Date(birthData.birthDate || birthData.date).toLocaleDateString('es-ES'),
    birthTime: birthData.birthTime || birthData.time || ''
  };

  if (!userProfile.name || userProfile.name === 'Usuario') {
    return (
      <div className="mb-8 p-4 bg-yellow-900/30 border border-yellow-400/30 rounded-lg">
        <p className="text-yellow-200">⚠️ Nombre de usuario no disponible</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <InterpretationButton
        type="solar-return"
        userId={user?.uid || ''}
        chartData={solarReturnData}
        natalChart={natalChart}
        userProfile={userProfile}
        isAdmin={user?.email?.includes('admin') || false}
        className="max-w-2xl mx-auto"
      />
    </div>
  );
}

// Helper function to calculate age
function calculateAge(birthDateString: string): number {
  if (!birthDateString) return 0;
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}
