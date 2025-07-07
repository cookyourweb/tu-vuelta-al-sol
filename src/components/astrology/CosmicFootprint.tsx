import React, { useState } from 'react';
import { Calendar, ArrowUp, Sun } from 'lucide-react';

interface CosmicFootprintProps {
  birthData?: {
    birthDate?: string;
    birthTime?: string;
    birthPlace?: string;
  };
  ascendant?: {
    degree?: number;
    sign?: string;
  };
  midheaven?: {
    degree?: number;
    sign?: string;
  };
}

const cardBaseClasses = "rounded-2xl p-6 backdrop-blur-sm border border-white/20 cursor-pointer transition-transform duration-300 ease-in-out";

const CosmicFootprint: React.FC<CosmicFootprintProps> = ({ birthData, ascendant, midheaven }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto">
      {/* Card 1: Datos de Nacimiento */}
      <div
        className={`${cardBaseClasses} bg-gradient-to-br from-purple-700/50 to-indigo-900/50 flex-1 relative`}
        onMouseEnter={() => setHoveredCard('birth')}
        onMouseLeave={() => setHoveredCard(null)}
        style={{ transform: hoveredCard === 'birth' ? 'scale(1.05)' : 'scale(1)' }}
      >
        <div className="flex items-center mb-4">
          <div className="bg-purple-600 rounded-full p-3 mr-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Datos de Nacimiento</h3>
        </div>
        <div className="text-white text-sm space-y-2">
          <div><strong>Fecha:</strong> {birthData?.birthDate ? new Date(birthData.birthDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'No especificada'}</div>
          <div><strong>Hora:</strong> {birthData?.birthTime || 'No especificada'}</div>
          <div><strong>Lugar:</strong> {birthData?.birthPlace || 'No especificado'}</div>
        </div>
        {hoveredCard === 'birth' && (
          <div className="absolute top-full left-0 mt-2 p-3 bg-black/80 rounded-lg text-xs text-gray-300 max-w-sm shadow-lg z-50">
            Actualiza o revisa tus datos de nacimiento para obtener lecturas más precisas.
          </div>
        )}
      </div>

      {/* Card 2: Ascendente */}
      <div
        className={`${cardBaseClasses} bg-gradient-to-br from-green-700/50 to-emerald-900/50 flex-1 relative`}
        onMouseEnter={() => setHoveredCard('ascendant')}
        onMouseLeave={() => setHoveredCard(null)}
        style={{ transform: hoveredCard === 'ascendant' ? 'scale(1.05)' : 'scale(1)' }}
      >
        <div className="flex items-center mb-4">
          <div className="bg-green-600 rounded-full p-3 mr-4">
            <ArrowUp className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Ascendente</h3>
        </div>
        <div className="text-white text-sm space-y-2">
          <div><strong>Grado:</strong> {ascendant?.degree ?? 'N/A'}°</div>
          <div><strong>Signo:</strong> {ascendant?.sign || 'N/A'}</div>
        </div>
        {hoveredCard === 'ascendant' && (
          <div className="absolute top-full left-0 mt-2 p-3 bg-black/80 rounded-lg text-xs text-gray-300 max-w-sm shadow-lg z-50">
            Tu máscara social: cómo te presentas al mundo y primeras impresiones que causas.
          </div>
        )}
      </div>

      {/* Card 3: Medio Cielo */}
      <div
        className={`${cardBaseClasses} bg-gradient-to-br from-yellow-700/50 to-orange-900/50 flex-1 relative`}
        onMouseEnter={() => setHoveredCard('midheaven')}
        onMouseLeave={() => setHoveredCard(null)}
        style={{ transform: hoveredCard === 'midheaven' ? 'scale(1.05)' : 'scale(1)' }}
      >
        <div className="flex items-center mb-4">
          <div className="bg-yellow-600 rounded-full p-3 mr-4">
            <Sun className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Medio Cielo</h3>
        </div>
        <div className="text-white text-sm space-y-2">
          <div><strong>Grado:</strong> {midheaven?.degree ?? 'N/A'}°</div>
          <div><strong>Signo:</strong> {midheaven?.sign || 'N/A'}</div>
        </div>
        {hoveredCard === 'midheaven' && (
          <div className="absolute top-full left-0 mt-2 p-3 bg-black/80 rounded-lg text-xs text-gray-300 max-w-sm shadow-lg z-50">
            Tu vocación: carrera ideal, reputación pública y propósito profesional.
          </div>
        )}
      </div>
    </div>
  );
};

export default CosmicFootprint;
