import React from 'react';
import { RefreshCw } from 'lucide-react';

interface SolarReturnRegenerateSectionProps {
  onRegenerate: () => void;
  loading: boolean;
}

export default function SolarReturnRegenerateSection({
  onRegenerate,
  loading
}: SolarReturnRegenerateSectionProps) {
  return (
    <div className="max-w-2xl mx-auto mb-8">
      <button
        onClick={onRegenerate}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center text-sm disabled:opacity-50"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Regenerando...' : 'Regenerar Carta'}
      </button>
    </div>
  );
}
