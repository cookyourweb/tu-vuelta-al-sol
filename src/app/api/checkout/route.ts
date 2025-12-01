import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { stripe, getOrCreateStripeCustomer, SUBSCRIPTION_PLANS } from '@/lib/stripe';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Inicializar Firebase Admin si no está inicializado
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

export async function POST(req: NextRequest) {
  try {
    const { priceId, userId, successUrl, cancelUrl } = await req.json();

    if (!priceId || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters: priceId and userId' },
        { status: 400 }
      );
    }

    // Verificar autenticación del usuario
    const auth = getAuth();
    let userRecord;
    try {
      userRecord = await auth.getUser(userId);
    } catch (error) {
      console.error('Error fetching user:', error);
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Obtener o crear cliente de Stripe
    const customerId = await getOrCreateStripeCustomer(
      userId,
      userRecord.email!,
      userRecord.displayName || undefined
    );

    // Determinar el modo de checkout basado en el priceId
    const isSubscription = priceId.includes('price_1SY6ks') ||
                          priceId.includes('price_1SY6my') ||
                          priceId.includes('price_1SY6oI');

    const mode = isSubscription ? 'subscription' : 'payment';

    // URLs de éxito y cancelación
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const finalSuccessUrl = successUrl || `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`;
    const finalCancelUrl = cancelUrl || `${baseUrl}/cancel`;

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      metadata: {
        userId,
        priceId,
      },
      allow_promotion_codes: true,
    });

    // Guardar información de la sesión en Firestore para seguimiento
    await db.collection('checkout_sessions').doc(session.id).set({
      userId,
      customerId,
      sessionId: session.id,
      priceId,
      mode,
      status: 'created',
      createdAt: new Date(),
      metadata: {
        userId,
        priceId,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
