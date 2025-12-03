// components/stripe/SubscriptionManager.tsx
'use client';

import { useState, useEffect } from 'react';

import { Crown, AlertCircle, CheckCircle, Calendar, CreditCard, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SubscriptionData {
  hasActiveSubscription: boolean;
  subscription: {
    id: string;
    status: string;
    planType: 'basic' | 'premium' | 'vip' | 'unknown';
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    canceledAt?: string;
    trialEnd?: string;
  } | null;
}

const PLAN_INFO = {
  basic: {
    name: 'Plan Básico',
    price: '€19/año',
    color: 'from-blue-500 to-cyan-500',
    icon: '⭐',
  },
  premium: {
    name: 'Plan Premium',
    price: '€39/año',
    color: 'from-purple-500 to-pink-500',
    icon: '💎',
  },
  vip: {
    name: 'Plan VIP',
    price: '€79/año',
    color: 'from-yellow-500 to-orange-500',
    icon: '👑',
  },
};

export default function SubscriptionManager() {
  const { user } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSubscriptionStatus();
    }
  }, [user]);

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/subscription/status?userId=${user?.uid}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener el estado de la suscripción');
      }

      const data = await response.json();
      setSubscriptionData(data);
    } catch (err: any) {
      console.error('Error fetching subscription:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (immediately: boolean = false) => {
    if (!subscriptionData?.subscription?.id) return;

    const confirmMessage = immediately
      ? '¿Estás seguro de que deseas cancelar tu suscripción inmediatamente? Perderás acceso de inmediato.'
      : '¿Estás seguro de que deseas cancelar tu suscripción? Mantendrás acceso hasta el final del período actual.';

    if (!confirm(confirmMessage)) return;

    try {
      setCanceling(true);
      setError(null);

      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscriptionData.subscription.id,
          userId: user?.uid,
          immediately,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cancelar la suscripción');
      }

      await fetchSubscriptionStatus();
      alert(immediately 
        ? 'Suscripción cancelada exitosamente'
        : 'Tu suscripción se cancelará al final del período actual'
      );
    } catch (err: any) {
      console.error('Error canceling subscription:', err);
      setError(err.message);
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-300">Cargando información de suscripción...</span>
        </div>
      </div>
    );
  }

  if (!subscriptionData?.hasActiveSubscription) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No tienes una suscripción activa
            </h3>
            <p className="text-gray-300 mb-4">
              Suscríbete para acceder a todas las funcionalidades premium de Tu Vuelta al Sol.
            </p>
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              <Crown className="w-5 h-5" />
              Ver Planes
            </a>
          </div>
        </div>
      </div>
    );
  }

  const { subscription } = subscriptionData;
  const planInfo = subscription && subscription.planType !== 'unknown' 
    ? PLAN_INFO[subscription.planType]
    : { name: 'Plan Personalizado', price: '', color: 'from-gray-500 to-gray-600', icon: '📦' };

  return (
    <div className="space-y-6">
      {/* Tarjeta principal de suscripción */}
      <div className={`bg-gradient-to-r ${planInfo.color} rounded-xl p-6 shadow-2xl`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{planInfo.icon}</span>
            <div>
              <h3 className="text-2xl font-bold text-white">
                {planInfo.name}
              </h3>
              <p className="text-white/80">{planInfo.price}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
            subscription?.status === 'active'
              ? 'bg-green-500/20 text-green-100'
              : subscription?.status === 'trialing'
              ? 'bg-blue-500/20 text-blue-100'
              : 'bg-gray-500/20 text-gray-100'
          }`}>
            {subscription?.status === 'active' && <CheckCircle className="w-4 h-4 inline mr-1" />}
            {subscription?.status === 'active' ? 'Activa' : subscription?.status}
          </div>
        </div>

        {/* Información del período */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-white/90">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Período actual:</span>
          </div>
          <div className="text-white font-semibold">
            {subscription && new Date(subscription.currentPeriodStart).toLocaleDateString('es-ES')} -{' '}
            {subscription && new Date(subscription.currentPeriodEnd).toLocaleDateString('es-ES')}
          </div>
        </div>

        {/* Advertencia si está marcada para cancelar */}
        {subscription?.cancelAtPeriodEnd && (
          <div className="mt-4 bg-orange-500/20 border border-orange-500/30 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-orange-100">
              Tu suscripción se cancelará el{' '}
              <strong>{subscription && new Date(subscription.currentPeriodEnd).toLocaleDateString('es-ES')}</strong>.
              Mantendrás acceso hasta esa fecha.
            </div>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h4 className="text-lg font-semibold text-white mb-4">
          Gestionar Suscripción
        </h4>
        
        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
            <XCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-100">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          {!subscription?.cancelAtPeriodEnd && (
            <>
              <button
                onClick={() => handleCancelSubscription(false)}
                disabled={canceling}
                className="w-full bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-100 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {canceling ? 'Procesando...' : 'Cancelar al final del período'}
              </button>
              
              <button
                onClick={() => handleCancelSubscription(true)}
                disabled={canceling}
                className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-100 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {canceling ? 'Procesando...' : 'Cancelar inmediatamente'}
              </button>
            </>
          )}

          <a
            href="https://billing.stripe.com/p/login/test_123"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-3 rounded-lg font-medium transition-all"
          >
            <CreditCard className="w-5 h-5" />
            Gestionar método de pago
          </a>
        </div>

        <p className="mt-4 text-sm text-gray-400 text-center">
          ¿Necesitas ayuda?{' '}
          <a href="mailto:soporte@tuvueltaalsol.com" className="text-purple-400 hover:underline">
            Contacta soporte
          </a>
        </p>
      </div>
    </div>
  );
}