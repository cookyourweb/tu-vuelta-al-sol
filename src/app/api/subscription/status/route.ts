import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { stripe } from '@/lib/stripe';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get customer from Stripe using metadata
    const customers = await stripe.customers.list({
      limit: 100,
    });

    // Find customer by userId in metadata
    const customer = customers.data.find(cust =>
      cust.metadata?.userId === userId
    );

    if (!customer) {
      return NextResponse.json({
        hasActiveSubscription: false,
        subscription: null
      });
    }

    // Get active subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });

    const activeSubscription = subscriptions.data[0];

    return NextResponse.json({
      hasActiveSubscription: !!activeSubscription,
      subscription: activeSubscription || null,
      customer: {
        id: customer.id,
        email: customer.email,
      }
    });

  } catch (error) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
}
