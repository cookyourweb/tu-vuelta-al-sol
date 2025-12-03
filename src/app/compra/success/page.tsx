// app/stripe/success/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session_id = searchParams.get('session_id');
    setSessionId(session_id);
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
        <span className="text-gray-300">Verificando pago...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
        {/* Icono de éxito */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-500/20 rounded-full p-4">
            <CheckCircle className="w-16 h-16 text-green-400" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-4xl font-bold text-white text-center mb-4">
          ¡Pago Exitoso! 🎉
        </h1>

        {/* Mensaje */}
        <p className="text-xl text-gray-300 text-center mb-8">
          Tu compra ha sido procesada correctamente
        </p>

        {/* Información adicional */}
        <div className="bg-white/5 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">
            ¿Qué sigue ahora?
          </h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">✓</span>
              <span>Recibirás un email de confirmación en unos minutos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">✓</span>
              <span>Puedes acceder a tu contenido desde el dashboard</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">✓</span>
              <span>Tu factura estará disponible en la sección de pagos</span>
            </li>
          </ul>
        </div>

        {/* Session ID (opcional, para debugging) */}
        {sessionId && (
          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400 mb-1">ID de Sesión:</p>
            <p className="text-xs text-gray-500 font-mono break-all">
              {sessionId}
            </p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            Ir al Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-semibold transition-all border border-white/20"
          >
            Volver al Inicio
          </button>
        </div>

        {/* Soporte */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-gray-400">
            ¿Necesitas ayuda?{' '}
            <a
              href="mailto:hello.cookyourweb@gmail.com"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              hello.cookyourweb@gmail.com
            </a>
            {' '}o{' '}
            <a
              href="https://wa.me/34612345678?text=Hola,%20tengo%20una%20incidencia%20con%20mi%20compra"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 underline"
            >
              WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
