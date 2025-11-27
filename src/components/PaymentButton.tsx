"use client";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
  : null;

interface PaymentButtonProps {
  className?: string;
}

export default function PaymentButton({ className }: PaymentButtonProps) {
  const pagar = async () => {
    if (!stripePromise) {
      alert("Error: Stripe no está configurado. Por favor, contacta al administrador.");
      return;
    }

    try {
      const stripe = await stripePromise;

      const res = await fetch("/api/checkout", { method: "POST" });
      const { id } = await res.json();

      if (stripe && (stripe as any).redirectToCheckout) {
        await (stripe as any).redirectToCheckout({ sessionId: id });
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert("Error al procesar el pago. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <button onClick={pagar} className={className}>
      💳 Comprar Agenda Astrológica (€15)
    </button>
  );
}

interface SubscriptionButtonProps {
  className?: string;
}

export function SubscriptionButton({ className }: SubscriptionButtonProps) {
  const suscribirse = async () => {
    if (!stripePromise) {
      alert("Error: Stripe no está configurado. Por favor, contacta al administrador.");
      return;
    }

    try {
      const stripe = await stripePromise;

      const res = await fetch("/api/subscription", { method: "POST" });
      const { id } = await res.json();

      if (stripe && (stripe as any).redirectToCheckout) {
        await (stripe as any).redirectToCheckout({ sessionId: id });
      }
    } catch (error) {
      console.error("Error al procesar la suscripción:", error);
      alert("Error al procesar la suscripción. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <button onClick={suscribirse} className={className}>
      🌟 Suscribirse Mensualmente
    </button>
  );
}
