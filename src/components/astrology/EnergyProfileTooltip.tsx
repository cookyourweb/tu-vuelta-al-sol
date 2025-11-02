import React from 'react';

interface EnergyProfileTooltipProps {
  ascendant?: { sign?: string; degree?: number };
  midheaven?: { sign?: string; degree?: number };
  elementDistribution: { fire: number; earth: number; air: number; water: number };
  modalityDistribution: { cardinal: number; fixed: number; mutable: number };
  userId?: string;
  birthData?: any;
}

const EnergyProfileTooltip: React.FC<EnergyProfileTooltipProps> = ({
  ascendant,
  midheaven,
  elementDistribution,
  modalityDistribution,
  userId,
  birthData
}) => {
  return (
    <div>
      {/* Componente vacío - esperando nuevas instrucciones */}
    </div>
  );
};

export default EnergyProfileTooltip;
