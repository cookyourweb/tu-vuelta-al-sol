// src/components/admin/MongoDBDiagnostic.tsx - CREAR ESTE ARCHIVO

'use client';

import { useState } from 'react';

interface DiagnosticData {
  diagnostico: {
    counts: Record<string, number>;
    samples: Record<string, any>;
    recommendations: string[];
  };
}

export default function MongoDBDiagnostic() {
  const [diagnostic, setDiagnostic] = useState<DiagnosticData | null>(null);
  const [loading, setLoading] = useState(false);
  const [migrating, setMigrating] = useState('');

  const runDiagnostic = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/mongodb');
      const data = await response.json();
      setDiagnostic(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const runMigration = async (action: string) => {
    setMigrating(action);
    try {
      const response = await fetch('/api/debug/mongodb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await response.json();
      console.log('Migración completada:', data);
      // Volver a ejecutar diagnóstico
      runDiagnostic();
    } catch (error) {
      console.error('Error en migración:', error);
    } finally {
      setMigrating('');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Diagnóstico MongoDB</h2>
        
        <div className="mb-6">
          <button
            onClick={runDiagnostic}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Ejecutando...' : 'Ejecutar Diagnóstico'}
          </button>
        </div>

        {diagnostic && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-lg font-semibold mb-3">Conteos</h3>
              <pre className="text-sm">{JSON.stringify(diagnostic.diagnostico.counts, null, 2)}</pre>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-lg font-semibold mb-3">Estructura de Datos</h3>
              <pre className="text-sm">{JSON.stringify(diagnostic.diagnostico.samples, null, 2)}</pre>
            </div>

            {diagnostic.diagnostico.recommendations.length > 0 && (
              <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-400">
                <h3 className="text-lg font-semibold mb-3">Recomendaciones</h3>
                <ul className="space-y-2">
                  {diagnostic.diagnostico.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="text-sm">{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded">
              <h3 className="text-lg font-semibold mb-3">Acciones de Corrección</h3>
              <div className="space-y-2">
                <button
                  onClick={() => runMigration('add_uid_field')}
                  disabled={migrating === 'add_uid_field'}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50 mr-2"
                >
                  {migrating === 'add_uid_field' ? 'Ejecutando...' : 'Añadir campo uid'}
                </button>

                <button
                  onClick={() => runMigration('add_userId_field')}
                  disabled={migrating === 'add_userId_field'}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50 mr-2"
                >
                  {migrating === 'add_userId_field' ? 'Ejecutando...' : 'Añadir campo userId'}
                </button>

                <button
                  onClick={() => runMigration('create_test_data')}
                  disabled={migrating === 'create_test_data'}
                  className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 disabled:opacity-50"
                >
                  {migrating === 'create_test_data' ? 'Creando...' : 'Crear datos de prueba'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
