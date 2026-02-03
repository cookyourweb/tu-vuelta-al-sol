'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function SRCheckPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      if (!user?.uid) return;

      try {
        const response = await fetch(`/api/debug/check-sr?userId=${user.uid}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    check();
  }, [user]);

  if (loading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🔍 Verificación Solar Return</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Usuario: {user?.uid}</h2>
        <p className="text-lg mb-2">Total encontrados: <strong>{data?.total || 0}</strong></p>
        <p className="text-sm text-gray-600">{data?.message}</p>
      </div>

      {data?.results?.map((sr: any, idx: number) => (
        <div key={idx} className="bg-gray-50 rounded-lg p-6 mb-4 border-2 border-gray-200">
          <h3 className="text-lg font-semibold mb-3">Solar Return #{idx + 1}</h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Generado:</p>
              <p className="font-mono text-sm">{new Date(sr.generatedAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Expira:</p>
              <p className="font-mono text-sm">{new Date(sr.expiresAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Método:</p>
              <p className="font-semibold">{sr.method}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estado:</p>
              <p className={sr.isExpired ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                {sr.isExpired ? '❌ EXPIRADO' : '✅ VÁLIDO'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded p-4 mb-4">
            <h4 className="font-semibold mb-2">Estructura de datos:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className={sr.hasAperturaAnual ? 'text-green-600' : 'text-red-600'}>
                {sr.hasAperturaAnual ? '✅' : '❌'} apertura_anual
              </div>
              <div className={sr.hasTemaCentral ? 'text-green-600' : 'text-red-600'}>
                {sr.hasTemaCentral ? '✅' : '❌'} tema_central
              </div>
              <div className={sr.hasComoSeVive ? 'text-green-600' : 'text-red-600'}>
                {sr.hasComoSeVive ? '✅' : '❌'} como_se_vive_siendo_tu
              </div>
              <div className={sr.hasSombras ? 'text-green-600' : 'text-red-600'}>
                {sr.hasSombras ? '✅' : '❌'} sombras_del_ano
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded p-4">
            <h4 className="font-semibold mb-2">Campos en interpretation:</h4>
            <div className="flex flex-wrap gap-2">
              {sr.interpretationKeys?.map((key: string) => (
                <span key={key} className="bg-blue-200 px-2 py-1 rounded text-xs font-mono">
                  {key}
                </span>
              ))}
            </div>
          </div>

          {sr.temaCentralPreview && (
            <div className="mt-4 bg-purple-50 rounded p-4">
              <h4 className="font-semibold mb-2">Preview del tema central:</h4>
              <p className="text-sm italic">{sr.temaCentralPreview}...</p>
            </div>
          )}
        </div>
      ))}

      {data?.total === 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
          <p className="text-xl font-semibold text-red-600 mb-2">❌ No se encontró Solar Return</p>
          <p className="text-gray-700">No hay ninguna interpretación de Solar Return en la base de datos para este usuario.</p>
        </div>
      )}
    </div>
  );
}
