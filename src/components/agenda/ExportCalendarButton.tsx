// src/components/agenda/ExportCalendarButton.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Download, Check, AlertCircle, ChevronDown, X } from 'lucide-react';

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
  const [showMenu, setShowMenu] = useState(false);
  const [showInstructions, setShowInstructions] = useState<'google' | 'outlook' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
        setShowInstructions(null);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // Descargar el .ics y luego abrir la página de importación
  const downloadAndImport = async (target: 'google' | 'outlook' | 'apple' | 'file') => {
    if (!userId || !yearLabel || loading) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const params = new URLSearchParams({ userId, yearLabel });
      const response = await fetch(`/api/agenda/export-calendar?${params}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al exportar');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `agenda-astrologica-${yearLabel}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Después de descargar, abrir la página de importación
      if (target === 'google') {
        setShowInstructions('google');
        // Abrir la página de importación de Google Calendar
        setTimeout(() => {
          window.open('https://calendar.google.com/calendar/r/settings/export', '_blank');
        }, 500);
      } else if (target === 'outlook') {
        setShowInstructions('outlook');
        setTimeout(() => {
          window.open('https://outlook.live.com/calendar/0/import', '_blank');
        }, 500);
      } else if (target === 'apple') {
        // En Mac, doble clic en el .ics ya abre Calendar automáticamente
        setShowMenu(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setShowMenu(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Error al exportar');
      setShowMenu(false);
      setTimeout(() => setError(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => !disabled && !loading && setShowMenu(!showMenu)}
        disabled={disabled || loading}
        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 border border-white/10 px-5 py-2.5 rounded-full flex items-center gap-2"
        title={disabled ? 'Primero genera un ciclo solar' : 'Exportar a tu calendario'}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-white font-bold text-sm">Descargando...</span>
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
            <ChevronDown className="w-3 h-3 text-white/70" />
          </>
        )}
      </button>

      {showMenu && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-slate-800 border border-purple-400/30 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-white font-semibold text-sm">Exportar a tu calendario</span>
            <button onClick={() => { setShowMenu(false); setShowInstructions(null); }} className="text-white/50 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Instrucciones post-descarga */}
          {showInstructions === 'google' && (
            <div className="px-4 py-3 bg-blue-500/10 border-b border-blue-400/20">
              <p className="text-blue-200 text-xs font-medium mb-1">Archivo descargado. En Google Calendar:</p>
              <ol className="text-blue-100/80 text-xs space-y-1 list-decimal list-inside">
                <li>Se ha abierto la pagina de Importacion</li>
                <li>Haz clic en <strong>&quot;Seleccionar archivo&quot;</strong></li>
                <li>Sube el archivo <strong>.ics</strong> descargado</li>
                <li>Haz clic en <strong>&quot;Importar&quot;</strong></li>
              </ol>
            </div>
          )}
          {showInstructions === 'outlook' && (
            <div className="px-4 py-3 bg-blue-500/10 border-b border-blue-400/20">
              <p className="text-blue-200 text-xs font-medium mb-1">Archivo descargado. En Outlook:</p>
              <ol className="text-blue-100/80 text-xs space-y-1 list-decimal list-inside">
                <li>Se ha abierto Outlook Calendar</li>
                <li>Ve a <strong>&quot;Cargar desde archivo&quot;</strong></li>
                <li>Sube el archivo <strong>.ics</strong> descargado</li>
                <li>Los eventos aparecen al instante</li>
              </ol>
            </div>
          )}

          {/* Google Calendar */}
          <button
            onClick={() => downloadAndImport('google')}
            disabled={loading}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-purple-500/20 transition-colors text-left disabled:opacity-50"
          >
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#EA4335" d="M6.5 6.5h4v4h-4z"/>
                <path fill="#FBBC05" d="M6.5 13.5h4v4h-4z"/>
                <path fill="#34A853" d="M13.5 13.5h4v4h-4z"/>
                <path fill="#4285F4" d="M13.5 6.5h4v4h-4z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">Google Calendar</p>
              <p className="text-white/50 text-xs">Descarga + abre pagina de importacion</p>
            </div>
            <Download className="w-4 h-4 text-white/30" />
          </button>

          {/* Outlook */}
          <button
            onClick={() => downloadAndImport('outlook')}
            disabled={loading}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-purple-500/20 transition-colors text-left disabled:opacity-50"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0078d4] flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">Outlook</p>
              <p className="text-white/50 text-xs">Descarga + abre Outlook en el navegador</p>
            </div>
            <Download className="w-4 h-4 text-white/30" />
          </button>

          {/* Apple Calendar */}
          <button
            onClick={() => downloadAndImport('apple')}
            disabled={loading}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-purple-500/20 transition-colors text-left disabled:opacity-50"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">Apple Calendar (Mac/iPhone)</p>
              <p className="text-white/50 text-xs">Descarga y abre con doble clic</p>
            </div>
            <Download className="w-4 h-4 text-white/30" />
          </button>

          {/* Solo descargar */}
          <button
            onClick={() => downloadAndImport('file')}
            disabled={loading}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-purple-500/20 transition-colors text-left border-t border-white/5 disabled:opacity-50"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-white/70" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">Solo descargar .ics</p>
              <p className="text-white/50 text-xs">Para importar manualmente</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportCalendarButton;
