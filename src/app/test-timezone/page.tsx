// src/app/test-timezone/page.tsx
'use client';

import dynamic from 'next/dynamic';

// Importar dinámicamente para evitar errores de SSR
const SimpleTimezoneTest = dynamic(
  () => import('../../components/test/SimpleTimezonetest'),
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando pruebas de timezone...</p>
      </div>
    </div>
  }
);

export default function TestTimezonePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <SimpleTimezoneTest />
    </div>
  );
}