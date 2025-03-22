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
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await registerUser(data.email, data.password, data.fullName);
      router.push('/dashboard');
    } catch (err: any) {
      const errorCode = err?.code;
      
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

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crea tu cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          O{' '}
          <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500">
            inicia sesión si ya tienes una cuenta
          </Link>
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Input
            id="fullName"
            type="text"
            label="Nombre completo"
            autoComplete="name"
            placeholder="Tu nombre completo"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          
          <Input
            id="email"
            type="email"
            label="Correo electrónico"
            autoComplete="email"
            placeholder="tu@ejemplo.com"
            error={errors.email?.message}
            {...register('email')}
          />
          
          <Input
            id="password"
            type="password"
            label="Contraseña"
            autoComplete="new-password"
            placeholder="Contraseña (mínimo 6 caracteres)"
            error={errors.password?.message}
            {...register('password')}
          />
          
          <Input
            id="confirmPassword"
            type="password"
            label="Confirmar contraseña"
            autoComplete="new-password"
            placeholder="Confirma tu contraseña"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full"
        >
          Registrarse
        </Button>
      </form>
    </div>
  );
}