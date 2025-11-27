'use client';

import { XCircle, ArrowLeft, HelpCircle, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 text-center">
        {/* Icono de cancelación */}
        <div className="mb-8 flex justify-center">
          <XCircle className="w-24 h-24 text-orange-400" />
        </div>

        {/* Mensaje principal */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Pago Cancelado
        </h1>

        <p className="text-xl text-orange-200 mb-8">
          No te preocupes, tu pago no se ha procesado. Puedes intentarlo de nuevo cuando estés listo.
        </p>

        {/* Razones comunes */}
        <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-2xl p-6 mb-8 text-left">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-yellow-400" />
            ¿Por qué cancelar?
          </h2>

          <div className="space-y-2 text-orange-200">
            <p>• ¿Necesitas más información sobre el producto?</p>
            <p>• ¿Tienes dudas sobre el proceso de pago?</p>
            <p>• ¿Prefieres otro método de pago?</p>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-white">
              Estamos aquí para ayudarte:{' '}
              <a
                href="mailto:hello.cookyourweb@gmail.com"
                className="text-yellow-400 hover:underline font-medium"
              >
                hello.cookyourweb@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/buy-agenda"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            <ShoppingCart className="w-5 h-5" />
            Intentar de Nuevo
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Dashboard
          </Link>
        </div>

        {/* Garantías */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="text-orange-200">
              <div className="text-2xl mb-1">🔒</div>
              <p className="text-sm">Pago seguro con Stripe</p>
            </div>
            <div className="text-orange-200">
              <div className="text-2xl mb-1">💯</div>
              <p className="text-sm">Satisfacción garantizada</p>
            </div>
            <div className="text-orange-200">
              <div className="text-2xl mb-1">📧</div>
              <p className="text-sm">Soporte 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
