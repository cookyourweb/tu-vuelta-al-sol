"use client";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

interface PaymentButtonProps {
  priceId: string;
  userId: string;
  className?: string;
  children?: React.ReactNode;
}

export default function PaymentButton({
  priceId,
  userId,
  className,
  children
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!stripePromise) {
      alert("Error: Stripe no está configurado. Por favor, contacta al administrador.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userId,
          successUrl: `${window.location.origin}/compra/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/compra/cancel`
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const { url } = await res.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No se recibió URL de checkout");
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert("Error al procesar el pago. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? 'Procesando...' : children}
    </button>
  );
}

interface SubscriptionButtonProps {
  plan: string;
  className?: string;
  children?: React.ReactNode;
}

export function SubscriptionButton({
  plan,
  className,
  children
}: SubscriptionButtonProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscription = async () => {
    if (!user) {
      alert("Debes iniciar sesión para suscribirte.");
      return;
    }

    if (!stripePromise) {
      alert("Error: Stripe no está configurado. Por favor, contacta al administrador.");
      return;
    }

    setLoading(true);

    try {
      // Map plan names to price IDs
      const planPriceIds: Record<string, string> = {
        basic: process.env.NEXT_PUBLIC_STRIPE_BASIC_PLAN_PRICE_ID!,
        premium: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_PRICE_ID!,
        vip: process.env.NEXT_PUBLIC_STRIPE_VIP_PLAN_PRICE_ID!,
      };

      const priceId = planPriceIds[plan];
      if (!priceId) {
        throw new Error(`Plan ${plan} no encontrado`);
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userId: user.uid,
          successUrl: `${window.location.origin}/stripe/success`,
          cancelUrl: `${window.location.origin}/stripe/cancel`
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const { url } = await res.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No se recibió URL de checkout");
      }
    } catch (error) {
      console.error("Error al procesar la suscripción:", error);
      alert("Error al procesar la suscripción. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscription}
      disabled={loading}
      className={`${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? 'Procesando...' : children}
    </button>
  );
}
