'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Info, X } from 'lucide-react';

export default function AgendaBookGenerator() {
  const router = useRouter();
  const [showInfo, setShowInfo] = useState(false);

  const handleGenerateBook = () => {
    router.push('/agenda/libro');
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <button
          onClick={handleGenerateBook}
          className="bg-gradient-to-r from-amber-500/80 to-yellow-500/80 hover:from-amber-400/90 hover:to-yellow-400/90 transition-all duration-200 shadow-lg hover:shadow-amber-500/25 border border-white/10 p-3 rounded-full group w-full"
          title="Generar libro completo de la agenda"
        >
          <BookOpen className="h-5 w-5 text-white group-hover:scale-110 transition-transform inline mr-2" />
          <span className="text-white text-sm font-semibold">Generar Libro Completo</span>
        </button>

        <button
          onClick={() => setShowInfo(true)}
          className="text-purple-300 hover:text-purple-200 text-xs flex items-center justify-center gap-1 transition-colors"
        >
          <Info className="w-3 h-3" />
          Ver detalles de generación
        </button>
      </div>

      {/* Modal informativo */}
      {showInfo && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={() => setShowInfo(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-sm border border-purple-400/40 rounded-3xl shadow-2xl max-w-md w-full p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">📖 Generación de Agenda</h3>
                <button
                  onClick={() => setShowInfo(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4">
                  <p className="text-green-200 font-semibold mb-2">✨ Versión Gratuita</p>
                  <ul className="text-sm text-green-100 space-y-1">
                    <li>• Primeros 3 meses con interpretaciones IA personalizadas</li>
                    <li>• Resto del año con calendario básico</li>
                    <li>• Perfecto para probar la agenda</li>
                  </ul>
                </div>

                <div className="bg-amber-500/20 border border-amber-400/30 rounded-xl p-4">
                  <p className="text-amber-200 font-semibold mb-2">💎 Versión Completa (Premium)</p>
                  <ul className="text-sm text-amber-100 space-y-1">
                    <li>• 12 meses completos con IA ultra-personalizada</li>
                    <li>• Interpretaciones profundas de cada evento</li>
                    <li>• Rituales y mantras personalizados</li>
                    <li>• Sin límites de generación</li>
                  </ul>
                </div>

                <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
                  <p className="text-blue-200 font-semibold mb-2">👨‍💼 Admin</p>
                  <ul className="text-sm text-blue-100 space-y-1">
                    <li>• Acceso completo sin restricciones</li>
                    <li>• Generación ilimitada para pruebas</li>
                  </ul>
                </div>

                <p className="text-xs text-purple-300 text-center mt-4">
                  La agenda se genera según tu retorno solar (cumpleaños a cumpleaños)
                </p>
              </div>

              <button
                onClick={() => {
                  setShowInfo(false);
                  handleGenerateBook();
                }}
                className="w-full mt-6 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg"
              >
                Generar Ahora
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
