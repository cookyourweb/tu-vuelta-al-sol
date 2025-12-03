'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { ShoppingCart, Download, Calendar, Package, Sparkles } from 'lucide-react';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
  : null;

export type ProductType =
  | 'agenda-digital'
  | 'subscription'
  | 'kit-rituales'
  | 'vela-personalizada'
  | 'bundle-completo';

interface ProductCardProps {
  productType: ProductType;
  name: string;
  description: string;
  price: string;
  features: string[];
  isPhysical?: boolean;
  badge?: string;
  className?: string;
}

export default function ProductCard({
  productType,
  name,
  description,
  price,
  features,
  isPhysical = false,
  badge,
  className = ''
}: ProductCardProps) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (!stripePromise) {
      alert('Error: Stripe no está configurado correctamente.');
      return;
    }

    setLoading(true);

    try {
      const stripe = await stripePromise;

      // Call multi-product checkout endpoint
      const res = await fetch('/api/checkout/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productType,
          quantity: 1
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al crear sesión de pago');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error al obtener la URL de pago. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Error al procesar el pago. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => {
    switch (productType) {
      case 'agenda-digital':
        return <Download className="w-6 h-6" />;
      case 'subscription':
        return <Calendar className="w-6 h-6" />;
      case 'kit-rituales':
      case 'vela-personalizada':
      case 'bundle-completo':
        return <Package className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all ${className}`}>
      {/* Badge */}
      {badge && (
        <div className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-full px-3 py-1 mb-4">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-300 text-sm font-medium">{badge}</span>
        </div>
      )}

      {/* Icon */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-purple-600/20 rounded-xl text-purple-300">
          {getIcon()}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">{name}</h3>
          {isPhysical && (
            <span className="text-sm text-purple-300">📦 Envío incluido</span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-purple-200 mb-4">{description}</p>

      {/* Features */}
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-white">
            <span className="text-green-400 mt-1">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Price */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-4xl font-bold text-white">{price}</span>
        {productType === 'subscription' && (
          <span className="text-purple-300">/mes</span>
        )}
      </div>

      {/* Button */}
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            Comprar Ahora
          </>
        )}
      </button>

      {/* Trust badges */}
      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-4 text-sm text-purple-300">
        <span>🔒 Pago seguro</span>
        <span>•</span>
        <span>💯 Garantía</span>
      </div>
    </div>
  );
}
