// src/components/agenda/ExportCalendarButton.tsx
'use client';

import React, { useState } from 'react';
import { Calendar, Download, Check, AlertCircle } from 'lucide-react';

interface ExportCalendarButtonProps {
  userId: string;
  yearLabel: string;
  disabled?: boolean;
}

const ExportCalendarButton: React.FC<ExportCalendarButtonProps> = ({
  userId,
  yearLabel,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    if (!userId || !yearLabel || loading) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const params = new URLSearchParams({ userId, yearLabel });
      const response = await fetch(`/api/agenda/export-calendar?${params}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al exportar calendario');
      }

      // Descargar el archivo .ics
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `agenda-astrologica-${yearLabel}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al exportar');
      setTimeout(() => setError(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || loading}
      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 border border-white/10 px-5 py-2.5 rounded-full flex items-center gap-2"
      title={disabled ? 'Primero genera un ciclo solar' : 'Exportar eventos a Google Calendar / Apple Calendar'}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span className="text-white font-bold text-sm">Exportando...</span>
        </>
      ) : success ? (
        <>
          <Check className="w-4 h-4 text-white" />
          <span className="text-white font-bold text-sm">Descargado</span>
        </>
      ) : error ? (
        <>
          <AlertCircle className="w-4 h-4 text-white" />
          <span className="text-white font-bold text-sm">Error</span>
        </>
      ) : (
        <>
          <Calendar className="w-4 h-4 text-white" />
          <span className="text-white font-bold text-sm">Exportar Calendario</span>
        </>
      )}
    </button>
  );
};

export default ExportCalendarButton;
