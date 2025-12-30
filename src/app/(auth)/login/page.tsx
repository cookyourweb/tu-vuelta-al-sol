// src/app/(auth)/login/page.tsx
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import { Star, Sparkles, ArrowLeft, Sun, Calendar } from 'lucide-react';

export default function LoginPage() {
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
            
            {/* Header de bienvenida */}
            <div className="text-center">
              <div className="flex justify-center items-center mb-8">
                <div className="bg-gradient-to-r from-blue-400/20 to-purple-500/20 border border-blue-400/30 rounded-full p-8 backdrop-blur-sm relative">
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                  <Star className="w-12 h-12 text-blue-400" />
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                Tu Vuelta al Sol
              </h1>

              <p className="text-lg text-purple-300 font-semibold mb-6">
                Agenda astrológica personalizada
              </p>

              <div className="max-w-lg mx-auto space-y-6 text-left">
                <p className="text-base text-gray-200 leading-relaxed">
                  Una experiencia creada a partir de tu carta natal y tu retorno solar, diseñada para acompañarte durante todo el año.
                </p>

                <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/20 border border-purple-400/20 rounded-2xl p-4">
                  <p className="text-base text-white font-medium mb-2">
                    No es un horóscopo genérico.
                  </p>
                  <p className="text-sm text-gray-300">
                    Es una guía personal para entender tus ciclos, tomar decisiones con más conciencia y vivir el año alineada contigo.
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-semibold text-purple-300">✨ Incluye:</p>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Star className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-blue-300">Carta Natal</p>
                        <p className="text-xs text-gray-400">tu esencia y patrones personales</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Sun className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-yellow-300">Retorno Solar</p>
                        <p className="text-xs text-gray-400">las energías activas de este año</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-purple-300">Agenda personalizada</p>
                        <p className="text-xs text-gray-400">ciclos, fechas clave y espacios de reflexión</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 border border-pink-400/20 rounded-2xl p-4 text-center">
                  <p className="text-base text-white font-medium mb-1">
                    Este año no va de hacer más.
                  </p>
                  <p className="text-base text-purple-300 font-semibold">
                    Va de vivir con sentido.
                  </p>
                </div>
              </div>
            </div>

            {/* Formulario de login */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-8 relative">
              <div className="absolute top-4 right-4 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              
              <LoginForm />
            </div>

            {/* Link de registro */}
            <div className="text-center">
              <p className="text-gray-400">
                ¿Nuevo aquí?{' '}
                <Link
                  href="/register"
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300"
                >
                  Crea tu cuenta
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}