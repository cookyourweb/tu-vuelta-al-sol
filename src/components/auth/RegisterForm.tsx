//src/components/auth/RegisterForm.tsx
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
import { User, Mail, Lock, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';

const registerSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const watchPassword = watch('password');

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Registra el usuario en Firebase (usa tu AuthContext)
      const firebaseUser = await registerUser(data.email, data.password, data.fullName);
      let uid;
      if (firebaseUser?.user?.uid) {
        uid = firebaseUser.user.uid;
      } else if (firebaseUser?.uid) {
        uid = firebaseUser.uid;
      }

      // 2. Registra en MongoDB (colección usuarios principal)
      if (uid) {
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid,
            email: data.email,
            fullName: data.fullName
          })
        });

        // 3. Registra birth data automáticamente (con lo que tengas disponible)
        await fetch('/api/birth-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: uid,
            fullName: data.fullName,
            birthDate: '',
            birthTime: '',
            birthPlace: '',
            latitude: 0,
            longitude: 0,
            timezone: 'UTC'
          })
        });
      }

      router.push('/dashboard');
    } catch (err: unknown) {
      const errorCode = (err as { code?: string })?.code;

      if (errorCode === 'auth/email-already-in-use') {
        setError('Este correo electrónico ya está en uso');
      } else if (errorCode === 'auth/invalid-email') {
        setError('Correo electrónico inválido');
      } else if (errorCode === 'auth/weak-password') {
        setError('La contraseña es demasiado débil');
      } else {
        setError('Ha ocurrido un error. Inténtalo de nuevo más tarde');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { level: 0, text: '', color: '' };
    if (password.length < 6) return { level: 1, text: 'Muy débil', color: 'text-red-400' };
    if (password.length < 8) return { level: 2, text: 'Débil', color: 'text-orange-400' };
    if (password.length < 12) return { level: 3, text: 'Buena', color: 'text-yellow-400' };
    return { level: 4, text: 'Excelente', color: 'text-green-400' };
  };

  const passwordStrength = getPasswordStrength(watchPassword || '');

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
        
        {/* Campo Nombre */}
        <div className="space-y-2">
          <label htmlFor="fullName" className="block text-sm font-semibold text-gray-300">
            Nombre Completo
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-green-400" />
            </div>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="Tu nombre completo"
              className={`w-full pl-12 pr-4 py-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border ${
                errors.fullName ? 'border-red-400/50' : 'border-white/20'
              } rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300`}
              {...register('fullName')}
            />
          </div>
          {errors.fullName && (
            <p className="text-red-400 text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.fullName.message}
            </p>
          )}
        </div>

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
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
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
          
          {/* Indicador de fortaleza de contraseña */}
          {watchPassword && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Fortaleza:</span>
                <span className={`text-xs font-medium ${passwordStrength.color}`}>
                  {passwordStrength.text}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    passwordStrength.level === 1 ? 'bg-red-400 w-1/4' :
                    passwordStrength.level === 2 ? 'bg-orange-400 w-2/4' :
                    passwordStrength.level === 3 ? 'bg-yellow-400 w-3/4' :
                    passwordStrength.level === 4 ? 'bg-green-400 w-full' : 'w-0'
                  }`}
                ></div>
              </div>
            </div>
          )}
          
          {errors.password && (
            <p className="text-red-400 text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Campo Confirmar Password */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-300">
            Confirmar Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-purple-400" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Confirma tu contraseña"
              className={`w-full pl-12 pr-12 py-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border ${
                errors.confirmPassword ? 'border-red-400/50' : 'border-white/20'
              } rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300`}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Botón de submit */}
        <div className="space-y-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 px-6 rounded-2xl hover:from-yellow-300 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl relative overflow-hidden"
          >
            <div className="relative z-10 flex items-center justify-center">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black mr-3"></div>
                  Creando tu universo...
                </>
              ) : (
                'Comenzar mi viaje cósmico'
              )}
            </div>
            {!isSubmitting && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            )}
          </button>

          {/* Beneficios del registro */}
          <div className="bg-gradient-to-r from-green-400/10 to-emerald-500/10 border border-green-400/30 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-green-300 font-medium text-sm">Al registrarte obtienes:</span>
            </div>
            <ul className="text-gray-300 text-xs space-y-1 ml-7">
              <li>• Carta natal personalizada gratuita</li>
              <li>• Acceso a tu calendario astrológico</li>
              <li>• Rituales diseñados para ti</li>
              <li>• Opciones para agenda física premium</li>
            </ul>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-r from-indigo-950 via-purple-900 to-black text-gray-400">
                ¿Ya tienes cuenta?
              </span>
            </div>
          </div>

          {/* Link a login */}
          <div className="text-center">
            <Link 
              href="/login"
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl hover:from-white/10 hover:to-white/15 transition-all duration-300 transform hover:scale-105"
            >
              Acceder a mi universo
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}