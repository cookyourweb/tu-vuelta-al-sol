// src/app/api/checkout/products/route.ts
// 🛍️ MULTI-PRODUCT CHECKOUT SYSTEM
// Supports digital products (agendas) and future physical products (candles, kits)

import Stripe from "stripe";
import { NextRequest } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// 📦 Product Types
export type ProductType =
  | 'agenda-digital'        // Digital agenda (PDF + Google Calendar)
  | 'subscription'          // Monthly subscription
  | 'kit-rituales'          // Physical ritual kit (future)
  | 'vela-personalizada'    // Personalized candle (future)
  | 'bundle-completo';      // Bundle (future)

// 🎯 Product Configuration
const PRODUCTS: Record<ProductType, {
  name: string;
  description: string;
  priceId: string | undefined;
  type: 'digital' | 'physical';
  requiresShipping: boolean;
}> = {
  'agenda-digital': {
    name: 'Agenda Astrológica Digital Personalizada',
    description: 'Tu agenda cósmica con eventos personalizados. Incluye PDF descargable e integración Google Calendar.',
    priceId: process.env.STRIPE_AGENDA_DIGITAL_PRICE_ID,
    type: 'digital',
    requiresShipping: false
  },
  'subscription': {
    name: 'Suscripción Premium Mensual',
    description: 'Acceso a agenda mensual automática y actualizaciones de tránsitos.',
    priceId: process.env.STRIPE_SUBSCRIPTION_PRICE_ID,
    type: 'digital',
    requiresShipping: false
  },
  'kit-rituales': {
    name: 'Kit de Rituales Astrológicos',
    description: 'Velas, cristales y guía de rituales según tu carta natal.',
    priceId: process.env.STRIPE_KIT_RITUALES_PRICE_ID,
    type: 'physical',
    requiresShipping: true
  },
  'vela-personalizada': {
    name: 'Vela Astrológica Personalizada',
    description: 'Vela creada según tu signo con aromas y colores personalizados.',
    priceId: process.env.STRIPE_VELA_PRICE_ID,
    type: 'physical',
    requiresShipping: true
  },
  'bundle-completo': {
    name: 'Bundle Completo',
    description: 'Agenda Digital + Kit Rituales + Vela (ahorra €5)',
    priceId: process.env.STRIPE_BUNDLE_COMPLETO_PRICE_ID,
    type: 'physical',
    requiresShipping: true
  }
};

// ==========================================
// 🛒 CREATE CHECKOUT SESSION
// ==========================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productType,
      quantity = 1,
      metadata = {},
      customerEmail
    }: {
      productType: ProductType;
      quantity?: number;
      metadata?: Record<string, string>;
      customerEmail?: string;
    } = body;

    // Validation
    if (!productType || !PRODUCTS[productType]) {
      return Response.json(
        { error: 'Invalid product type' },
        { status: 400 }
      );
    }

    const product = PRODUCTS[productType];

    if (!product.priceId) {
      return Response.json(
        {
          error: 'Product not configured. Please add Price ID to environment variables.',
          productType
        },
        { status: 500 }
      );
    }

    // Create checkout session
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: productType === 'subscription' ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: product.priceId,
          quantity
        }
      ],
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}&product=${productType}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000"}/cancel?product=${productType}`,

      // Add metadata for tracking
      metadata: {
        productType,
        productName: product.name,
        ...metadata
      },

      // Customer email
      ...(customerEmail && { customer_email: customerEmail }),

      // Shipping for physical products
      ...(product.requiresShipping && {
        shipping_address_collection: {
          allowed_countries: ['ES', 'PT', 'FR', 'IT', 'DE'] // Europe for now
        }
      }),

      // Allow promotion codes
      allow_promotion_codes: true,

      // Billing address
      billing_address_collection: 'auto'
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log(`✅ Checkout session created: ${session.id} for ${productType}`);

    return Response.json({
      id: session.id,
      url: session.url,
      productType,
      productName: product.name
    });

  } catch (error) {
    console.error("Error creating checkout session:", error);
    return Response.json(
      {
        error: "Error al crear la sesión de pago",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// ==========================================
// 📖 GET AVAILABLE PRODUCTS
// ==========================================

export async function GET() {
  try {
    const availableProducts = Object.entries(PRODUCTS)
      .filter(([_, product]) => product.priceId) // Only configured products
      .map(([key, product]) => ({
        id: key,
        name: product.name,
        description: product.description,
        type: product.type,
        requiresShipping: product.requiresShipping,
        configured: !!product.priceId
      }));

    return Response.json({
      products: availableProducts,
      count: availableProducts.length
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    return Response.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}
