'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Sparkles, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Procesando tu pago...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 text-center">
        {/* Icono de éxito animado */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <CheckCircle className="w-24 h-24 text-green-400 animate-bounce" />
            <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
          </div>
        </div>

        {/* Mensaje principal */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          ¡Pago Exitoso! 🎉
        </h1>

        <p className="text-xl text-purple-200 mb-8">
          Gracias por tu compra. Tu agenda astrológica está siendo preparada.
        </p>

        {/* Información de la sesión */}
        {sessionId && (
          <div className="bg-white/5 rounded-xl p-4 mb-8">
            <p className="text-sm text-purple-300">
              ID de sesión: <span className="font-mono text-white">{sessionId}</span>
            </p>
          </div>
        )}

        {/* Próximos pasos */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 mb-8 text-left">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Mail className="w-6 h-6 text-yellow-400" />
            Próximos Pasos
          </h2>

          <div className="space-y-3 text-purple-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📧</span>
              <p>Recibirás un email de confirmación con los detalles de tu compra.</p>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">✨</span>
              <p>Tu agenda astrológica será generada en las próximas 24-48 horas.</p>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">📮</span>
              <p>Te enviaremos la versión digital por email y la física por correo postal.</p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            <Calendar className="w-5 h-5" />
            Ir al Dashboard
          </Link>

          <Link
            href="/agenda"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all border border-white/20"
          >
            Ver mi Agenda
          </Link>
        </div>

        {/* Nota de soporte */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <p className="text-sm text-purple-300">
            ¿Necesitas ayuda? Contáctanos en{' '}
            <a href="mailto:hello.cookyourweb@gmail.com" className="text-yellow-400 hover:underline">
              hello.cookyourweb@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
