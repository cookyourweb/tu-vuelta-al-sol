//src/app/(dashboard)/layout.tsx
'use client';

import Footer from '@/components/layout/Footer';
import PrimaryHeader from '@/components/layout/PrimaryHeader';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Proteger todas las rutas del dashboard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white">Conectando con el cosmos...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no renderizar nada (se redirigirá)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black">
      {/* Fondo mágico global */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30 pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/5 via-transparent to-transparent pointer-events-none"></div>
      
      {/* Estrellas decorativas globales */}
      <div className="fixed top-10 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse pointer-events-none"></div>
      <div className="fixed top-20 right-20 w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-300 pointer-events-none"></div>
      <div className="fixed bottom-20 left-1/4 w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-1000 pointer-events-none"></div>
      <div className="fixed bottom-40 right-1/3 w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-700 pointer-events-none"></div>
      
      {/* Estructura sin espacios */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <PrimaryHeader />
        <main className="flex-1 pb-16 md:pb-0">
          {children}
        </main>
        {/* Footer en desktop, MobileBottomNav en mobile */}
        <div className="hidden md:block">
          <Footer />
        </div>
        <MobileBottomNav />
      </div>
    </div>
  );
}