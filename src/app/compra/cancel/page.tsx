// app/cancel/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCcw } from 'lucide-react';

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
        {/* Icono de cancelación */}
        <div className="flex justify-center mb-6">
          <div className="bg-orange-500/20 rounded-full p-4">
            <XCircle className="w-16 h-16 text-orange-400" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-4xl font-bold text-white text-center mb-4">
          Pago Cancelado
        </h1>

        {/* Mensaje */}
        <p className="text-xl text-gray-300 text-center mb-8">
          No se realizó ningún cargo a tu tarjeta
        </p>

        {/* Información */}
        <div className="bg-white/5 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">
            ¿Qué pasó?
          </h2>
          <p className="text-gray-300 mb-4">
            El proceso de pago fue cancelado. Esto puede ocurrir por varias razones:
          </p>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-1">•</span>
              <span>Decidiste no completar la compra</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-1">•</span>
              <span>Cerraste la ventana de pago</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-1">•</span>
              <span>Hubo un problema con la conexión</span>
            </li>
          </ul>
        </div>

        {/* Mensaje de tranquilidad */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-8">
          <p className="text-green-300 text-sm">
            <strong>No te preocupes:</strong> No se ha realizado ningún cargo a tu método de pago. 
            Tus datos están seguros y puedes intentar nuevamente cuando lo desees.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            <RefreshCcw className="w-5 h-5" />
            Intentar Nuevamente
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-semibold transition-all border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Inicio
          </button>
        </div>

        {/* Ayuda */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-gray-400 mb-3">
            ¿Tuviste algún problema durante el proceso?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <a
              href="mailto:soporte@tuvueltaalsol.com"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Contactar Soporte
            </a>
            <span className="hidden sm:inline text-gray-600">|</span>
            <a
              href="/faq"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Ver Preguntas Frecuentes
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}