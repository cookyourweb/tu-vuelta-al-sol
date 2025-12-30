// src/app/(auth)/register/page.tsx
import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';
import { Star, Sparkles, ArrowLeft, Heart, Zap, Moon } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white relative overflow-hidden">
      {/* Fondo mágico */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/5 via-transparent to-transparent"></div>
      
      {/* Estrellas decorativas */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="absolute top-32 right-20 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300"></div>
      <div className="absolute top-64 left-1/4 w-4 h-4 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-96 right-1/3 w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-700"></div>
      <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-yellow-300 rounded-full animate-pulse delay-500"></div>
      <div className="absolute bottom-48 right-1/4 w-4 h-4 bg-blue-300 rounded-full animate-bounce delay-1200"></div>
      <div className="absolute top-1/2 left-20 w-3 h-3 bg-purple-300 rounded-full animate-pulse delay-800"></div>
      <div className="absolute bottom-64 right-10 w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-400"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header con navegación */}
        <div className="p-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-300 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver al inicio
          </Link>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            
            {/* Header inspiracional */}
            <div className="text-center">
              <div className="flex justify-center items-center mb-8">
                <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-8 backdrop-blur-sm relative">
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-orange-400 rounded-full animate-bounce"></div>
                  <Star className="w-12 h-12 text-yellow-400" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-4">
                Bienvenido/a a
              </h1>

              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                Tu Vuelta al Sol
              </h2>

              <p className="text-xl text-purple-300 font-semibold mb-4">
                Tu agenda astrológica personalizada
              </p>

              <p className="text-gray-300 text-base leading-relaxed">
                No es un horóscopo genérico.<br/>
                Es una herramienta para entenderte mejor y vivir con más sentido.
              </p>
            </div>

            {/* Beneficios rápidos */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-400/10 to-cyan-500/10 border border-blue-400/30 rounded-2xl p-4 text-center backdrop-blur-sm">
                <Moon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-blue-300 text-xs font-semibold">Tu carta natal</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-400/10 to-orange-500/10 border border-yellow-400/30 rounded-2xl p-4 text-center backdrop-blur-sm">
                <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-yellow-300 text-xs font-semibold">Retorno solar</p>
              </div>

              <div className="bg-gradient-to-br from-purple-400/10 to-pink-500/10 border border-purple-400/30 rounded-2xl p-4 text-center backdrop-blur-sm">
                <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-purple-300 text-xs font-semibold">Agenda personal</p>
              </div>
            </div>

            {/* Formulario de registro */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-8 relative">
              <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              
              <RegisterForm />
            </div>

            {/* Link de login */}
            <div className="text-center">
              <p className="text-gray-400">
                ¿Ya tienes cuenta?{' '}
                <Link 
                  href="/login"
                  className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors duration-300"
                >
                  Accede a tu universo
                </Link>
              </p>
            </div>

            {/* Mensaje inspiracional */}
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/20 border border-purple-400/30 rounded-2xl p-6 backdrop-blur-sm text-center">
              <div className="flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
                <span className="font-semibold text-purple-300">¿Para quién es?</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Para personas que sienten que este año no va de correr más,<br/>
                <span className="text-purple-300 font-medium">sino de vivir con más sentido.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}