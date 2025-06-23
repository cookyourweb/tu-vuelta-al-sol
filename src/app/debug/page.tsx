// src/app/debug/page.tsx - Página para debug y regeneración
'use client';

import ForceRegenerateChart from '../../components/debug/ForceRegenerateChart';





export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">🔧 Herramientas de Debug</h1>
          <p className="text-gray-300">
            Herramientas para desarrolladores y resolución de problemas
          </p>
        </div>
        
        <ForceRegenerateChart />
      </div>
    </div>
  );
}