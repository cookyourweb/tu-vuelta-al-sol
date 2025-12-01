// lib/stripe.ts
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

// Inicializar Stripe para el servidor
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17.clover',
  typescript: true,
  appInfo: {
    name: 'Tu Vuelta al Sol',
    version: '1.0.0',
  },
});

// Función helper para obtener o crear un cliente de Stripe
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<string> {
  try {
    // Buscar cliente existente por metadata
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0].id;
    }

    // Crear nuevo cliente
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    });

    return customer.id;
  } catch (error) {
    console.error('Error creating/fetching Stripe customer:', error);
    throw error;
  }
}

// Función para formatear precio en euros
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount / 100);
}

// Productos y precios
export const STRIPE_PRODUCTS = {
  // Suscripciones anuales
  BASIC_ANNUAL: {
    name: 'Plan Básico',
    description: 'Agenda anual completa con interpretaciones astrológicas',
    price: 1900, // €19.00
    priceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PLAN_PRICE_ID,
    interval: 'year' as const,
  },
  PREMIUM_ANNUAL: {
    name: 'Plan Premium',
    description: 'Agenda + Google Calendar + actualizaciones mensuales',
    price: 3900, // €39.00
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_PRICE_ID,
    interval: 'year' as const,
  },
  VIP_ANNUAL: {
    name: 'Plan VIP',
    description: 'Todo Premium + consultas personales + informes especiales',
    price: 7900, // €79.00
    priceId: process.env.NEXT_PUBLIC_STRIPE_VIP_PLAN_PRICE_ID,
    interval: 'year' as const,
  },
  
  // Productos únicos
  COMPATIBILITY: {
    name: 'Compatibilidad de Pareja',
    description: 'Carta sinastría completa',
    price: 2900, // €29.00
    priceId: process.env.STRIPE_COMPATIBILITY_PRICE_ID,
  },
  BABY_CHART: {
    name: 'Carta para Bebés',
    description: 'Regalo perfecto para padres',
    price: 2400, // €24.00
    priceId: process.env.STRIPE_BABY_CHART_PRICE_ID,
  },
  THEMATIC_REPORT: {
    name: 'Informe Temático',
    description: 'Amor, carrera o salud',
    price: 1500, // €15.00
    priceId: process.env.STRIPE_THEMATIC_REPORT_PRICE_ID,
  },
  LUNAR_CALENDAR: {
    name: 'Calendario Lunar Físico',
    description: 'Producto físico personalizado',
    price: 3500, // €35.00
    priceId: process.env.STRIPE_LUNAR_CALENDAR_PRICE_ID,
  },
  CONSULTATION: {
    name: 'Consulta 1:1',
    description: 'Con astrólogos certificados (1 hora)',
    price: 7500, // €75.00
    priceId: process.env.STRIPE_CONSULTATION_PRICE_ID,
  },
  ASTRO_GIFT: {
    name: 'Regalo Astrológico',
    description: 'Carta personalizada para regalar',
    price: 2500, // €25.00
    priceId: process.env.STRIPE_ASTRO_GIFT_PRICE_ID,
  },
};

// Tipo para los planes de suscripción
export type SubscriptionPlan = 'basic' | 'premium' | 'vip';

// Mapeo de planes
export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, typeof STRIPE_PRODUCTS.BASIC_ANNUAL> = {
  basic: STRIPE_PRODUCTS.BASIC_ANNUAL,
  premium: STRIPE_PRODUCTS.PREMIUM_ANNUAL,
  vip: STRIPE_PRODUCTS.VIP_ANNUAL,
};
