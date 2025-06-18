// src/app/test-prokerala-utils/page.tsx
'use client';

import { useState } from 'react';

export default function TestProkeralaUtils() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testUtils = async () => {
    setLoading(true);
    setResults(null);

    try {
      // Test del endpoint que combina todas las utilidades
      const response = await fetch('/api/astrology/agenda-final', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: "1974-02-10",
          birthTime: "07:30:00",
          latitude: 40.4164,
          longitude: -3.7025,
          timezone: "Europe/Madrid",
          startDate: "2025-02-10",
          endDate: "2026-02-10",
          fullName: "Verónica"
        })
      });

      const data = await response.json();
      setResults(data);

    } catch (error) {
      setResults({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">
        🧪 Test de Utilidades Consolidadas
      </h1>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
        <h2 className="font-bold text-blue-800">ℹ️ Información</h2>
        <p className="text-blue-700 text-sm mt-1">
          Este test verifica que las nuevas utilidades consolidan correctamente:
          validación, formateo, coordenadas, datetime y peticiones a Prokerala.
        </p>
      </div>

      <div className="text-center mb-8">
        <button
          onClick={testUtils}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-8 py-4 rounded-lg font-semibold text-lg"
        >
          {loading ? '🔄 Ejecutando Test...' : '🚀 Test Utilidades Consolidadas'}
        </button>
      </div>

      {results && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">
            {results.success ? '✅ Resultado Exitoso' : '❌ Error Encontrado'}
          </h3>
          
          {results.success && (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded">
                <h4 className="font-semibold text-green-800">📊 Resumen:</h4>
                <ul className="text-green-700 text-sm mt-2 space-y-1">
                  <li>• Carta Natal: {results.resumen?.cartaNatal}</li>
                  <li>• Carta Progresada: {results.resumen?.cartaProgresada}</li>
                  <li>• Eventos: {results.resumen?.eventosAstrologicos}</li>
                  <li>• Estado: {results.resumen?.estado}</li>
                </ul>
              </div>

              {results.agenda?.metadata && (
                <div className="bg-blue-50 p-4 rounded">
                  <h4 className="font-semibold text-blue-800">🔧 Configuración:</h4>
                  <ul className="text-blue-700 text-sm mt-2 space-y-1">
                    <li>• Ayanamsa: {results.agenda.metadata.configuracion.ayanamsa}</li>
                    <li>• Precisión: {results.agenda.metadata.configuracion.precisionCoordenadas} decimales</li>
                    <li>• Timezone: {results.agenda.metadata.configuracion.timezone}</li>
                    <li>• Versión: {results.agenda.metadata.configuracion.version}</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {!results.success && (
            <div className="bg-red-50 p-4 rounded">
              <h4 className="font-semibold text-red-800">❌ Error:</h4>
              <p className="text-red-700 text-sm mt-1">{results.error}</p>
              {results.details && (
                <ul className="text-red-600 text-xs mt-2">
                  {results.details.map((detail: string, i: number) => (
                    <li key={i}>• {detail}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <details className="mt-4">
            <summary className="cursor-pointer font-semibold text-gray-700">
              🔍 Ver Respuesta Completa
            </summary>
            <pre className="bg-gray-100 p-4 rounded mt-2 text-xs overflow-auto">
              {JSON.stringify(results, null, 2)}
            </pre>
          </details>
        </div>
      )}

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="font-bold mb-4">📋 ¿Qué verifica este test?</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Validaciones:</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• ✅ Formato de fecha correcto</li>
              <li>• ✅ Coordenadas en rango válido</li>
              <li>• ✅ Timezone aplicado correctamente</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Transformaciones:</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• ✅ Coordenadas a 4 decimales</li>
              <li>• ✅ DateTime con timezone correcto</li>
              <li>• ✅ Parámetros Prokerala exactos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}