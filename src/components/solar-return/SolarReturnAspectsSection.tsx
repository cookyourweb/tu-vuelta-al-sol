import React from 'react';
import SectionNavigation from './SectionNavigation';
import { getAspectSymbol, getAspectColor } from './helpers';

interface SolarReturnAspectsSectionProps {
  chartData: any;
}

export default function SolarReturnAspectsSection({
  chartData
}: SolarReturnAspectsSectionProps) {
  if (!chartData || !chartData.keyAspects || chartData.keyAspects.length === 0) {
    return null;
  }

  return (
    <div id="aspectos" className="max-w-6xl mx-auto mb-12 scroll-mt-24">
      <SectionNavigation currentSection="aspectos" />
      <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-2xl p-8 border border-cyan-400/30">
        <h2 className="text-2xl md:text-3xl font-bold text-cyan-100 mb-6 text-center">
          ✨ Aspectos Planetarios Clave
        </h2>
        <div className="space-y-4">
          {chartData.keyAspects.map((aspect: any, index: number) => (
            <div
              key={index}
              className="bg-gradient-to-r from-cyan-800/40 to-blue-800/40 backdrop-blur-sm rounded-xl p-5 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-cyan-100">
                  {aspect.planet1} {getAspectSymbol(aspect.aspect)} {aspect.planet2}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getAspectColor(aspect.aspect)}`}>
                  {aspect.aspect}
                </span>
              </div>
              <p className="text-cyan-200 text-sm">
                Orbe: {aspect.orb?.toFixed(2)}°
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
