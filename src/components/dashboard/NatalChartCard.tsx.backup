// File: src/components/dashboard/NatalChartCard.tsx
import React from 'react';
import Link from 'next/link';

interface NatalChartCardProps {
  hasChart: boolean;
}

const NatalChartCard: React.FC<NatalChartCardProps> = ({ hasChart }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6" aria-label="Mi Carta Natal Card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Mi Carta Natal</h3>
      {hasChart ? (
        <>
          <p className="text-gray-700 mb-4">
            Ya tienes tu carta natal calculada. Puedes verla en detalle.
          </p>
          <div className="mt-4 flex space-x-4">
            <Link href="/natal-chart" passHref>
              <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-700 hover:bg-purple-800">
                Ver Carta Natal
              </button>
            </Link>
            <Link href="/birth-data" passHref>
              <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-purple-700 bg-purple-100 hover:bg-purple-200">
                Configurar Datos
              </button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-700 mb-4">
            Aún no has generado tu carta natal. Para comenzar, necesitamos tus datos de nacimiento exactos.
          </p>
          <div className="mt-4">
            <Link href="/birth-data" passHref>
              <button className="inline-flex w-full justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-700 hover:bg-purple-800">
                Ingresar Datos de Nacimiento
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default NatalChartCard;
