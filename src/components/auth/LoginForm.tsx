//src/components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const errorCode = (err as { code?: string })?.code;
      
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
        setError('Correo electrónico o contraseña incorrectos');
      } else if (errorCode === 'auth/too-many-requests') {
        setError('Demasiados intentos fallidos. Inténtalo más tarde');
      } else if (errorCode === 'auth/user-disabled') {
        setError('Esta cuenta ha sido deshabilitada');
      } else {
        setError('Ha ocurrido un error. Inténtalo de nuevo más tarde');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Mensaje de error mágico */}
      {error && (
        <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-400/30 rounded-2xl p-4 backdrop-blur-sm relative">
          <div className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-red-400/20 rounded-full p-2 mr-3">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-red-300 font-medium text-sm">Error Cósmico</p>
              <p className="text-red-200 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        
        {/* Campo Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-300">
            Correo Electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-blue-400" />
            </div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tu@ejemplo.com"
              className={`w-full pl-12 pr-4 py-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border ${
                errors.email ? 'border-red-400/50' : 'border-white/20'
              } rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300`}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Campo Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-300">
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-purple-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Tu contraseña"
              className={`w-full pl-12 pr-12 py-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border ${
                errors.password ? 'border-red-400/50' : 'border-white/20'
              } rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300`}
              {...register('password')}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Opciones adicionales */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-400 focus:ring-blue-400/50 bg-white/10 border-white/30 rounded transition-colors"
            />
            <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-300">
              Recordarme
            </label>
          </div>

          <div className="text-sm">
            <Link 
              href="/forgot-password" 
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-300"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        {/* Botón de submit */}
        <div className="space-y-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold py-4 px-6 rounded-2xl hover:from-blue-300 hover:to-purple-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl relative overflow-hidden"
          >
            <div className="relative z-10 flex items-center justify-center">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                  Conectando con el cosmos...
                </>
              ) : (
                'Acceder a mi universo'
              )}
            </div>
            {!isSubmitting && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-r from-indigo-950 via-purple-900 to-black text-gray-400">
                ¿Nuevo en el cosmos?
              </span>
            </div>
          </div>

          {/* Link a registro */}
          <div className="text-center">
            <Link 
              href="/register"
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl hover:from-white/10 hover:to-white/15 transition-all duration-300 transform hover:scale-105"
            >
              Comienza tu viaje astrológico
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}