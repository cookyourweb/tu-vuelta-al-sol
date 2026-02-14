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
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const getCalendarUrl = () => {
    const params = new URLSearchParams({ userId, yearLabel });
    return `/api/agenda/export-calendar?${params}`;
  };

  // Añadir directamente a Google Calendar (suscripción por URL)
  const handleGoogleCalendar = () => {
    const baseUrl = `${window.location.origin}${getCalendarUrl()}`;
    const webcalUrl = baseUrl.replace('https://', 'webcal://').replace('http://', 'webcal://');
    const googleUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}`;
    window.open(googleUrl, '_blank');
    setShowMenu(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  // Añadir a Apple Calendar / Outlook (protocolo webcal://)
  const handleWebcal = () => {
    const baseUrl = `${window.location.origin}${getCalendarUrl()}`;
    const webcalUrl = baseUrl.replace('https://', 'webcal://').replace('http://', 'webcal://');
    window.location.href = webcalUrl;
    setShowMenu(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  // Descargar archivo .ics
  const handleDownload = async () => {
    if (!userId || !yearLabel || loading) return;

    setLoading(true);
    setError(null);
    setSuccess(false);
    setShowMenu(false);

    try {
      const response = await fetch(getCalendarUrl());

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al exportar calendario');
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
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => !disabled && !loading && setShowMenu(!showMenu)}
        disabled={disabled || loading}
        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 border border-white/10 px-5 py-2.5 rounded-full flex items-center gap-2"
        title={disabled ? 'Primero genera un ciclo solar' : 'Sincronizar con tu calendario'}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-white font-bold text-sm">Exportando...</span>
          </>
        ) : success ? (
          <>
            <Check className="w-4 h-4 text-white" />
            <span className="text-white font-bold text-sm">Listo</span>
          </>
        ) : error ? (
          <>
            <AlertCircle className="w-4 h-4 text-white" />
            <span className="text-white font-bold text-sm">Error</span>
          </>
        ) : (
          <>
            <Calendar className="w-4 h-4 text-white" />
            <span className="text-white font-bold text-sm">Sincronizar Calendario</span>
            <ChevronDown className="w-3 h-3 text-white/70" />
          </>
        )}
      </button>

      {/* Dropdown menú */}
      {showMenu && (
        <div className="absolute top-full mt-2 right-0 w-72 bg-slate-800 border border-purple-400/30 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-white font-semibold text-sm">Añadir a tu calendario</span>
            <button onClick={() => setShowMenu(false)} className="text-white/50 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Google Calendar */}
          <button
            onClick={handleGoogleCalendar}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-purple-500/20 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#4285F4" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10z" opacity=".1"/>
                <path fill="#4285F4" d="M17.5 8.5h-2V6H8.5v2.5h-2V17h11V8.5z" opacity=".3"/>
                <path fill="#EA4335" d="M6.5 6.5h4v4h-4z"/>
                <path fill="#FBBC05" d="M6.5 13.5h4v4h-4z"/>
                <path fill="#34A853" d="M13.5 13.5h4v4h-4z"/>
                <path fill="#4285F4" d="M13.5 6.5h4v4h-4z"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-medium text-sm">Google Calendar</p>
              <p className="text-white/50 text-xs">Se sincroniza automaticamente</p>
            </div>
          </button>

          {/* Apple Calendar / Outlook */}
          <button
            onClick={handleWebcal}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-purple-500/20 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Apple Calendar / Outlook</p>
              <p className="text-white/50 text-xs">Abre tu app de calendario directamente</p>
            </div>
          </button>

          {/* Descargar .ics */}
          <button
            onClick={handleDownload}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-purple-500/20 transition-colors text-left border-t border-white/5"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-white/70" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Descargar archivo .ics</p>
              <p className="text-white/50 text-xs">Importar manualmente en cualquier calendario</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportCalendarButton;
