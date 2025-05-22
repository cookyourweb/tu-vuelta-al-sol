'use client';

import NatalChartTest from '@/components/test/NatalChartTest';

export default function ProkeralaTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-900">
        Prueba de Integración con Prokerala
      </h1>
      
      <p className="text-center mb-8 text-gray-600 max-w-2xl mx-auto">
        Esta página te permite probar la integración con la API de Prokerala para generar cartas natales.
        Introduce los datos de nacimiento y haz clic en el botón para generar la carta.
      </p>
      
      <NatalChartTest />
    </div>
  );
}