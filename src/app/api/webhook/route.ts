// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';
import connectDB from '@/lib/db';
import Subscription from '@/models/Subscription';
import User from '@/models/User';

export const runtime = 'nodejs';

// Note: In App Router, body parsing is disabled by default for webhooks
// No need to export config - it's handled automatically

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Conectar a la base de datos
  await connectDB();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: `Webhook processing error: ${error.message}` },
      { status: 500 }
    );
  }
}

// ============= HANDLERS =============

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);
  
  const userId = session.metadata?.userId;
  if (!userId) {
    console.error('No userId in session metadata');
    return;
  }

  // Si es una suscripción, se manejará en subscription.created
  if (session.mode === 'subscription') {
    console.log('Subscription checkout, will be handled by subscription.created event');
    return;
  }

  // Para pagos únicos, registrar la compra
  const user = await User.findById(userId);
  if (user) {
    if (!user.purchases) {
      user.purchases = [];
    }
    user.purchases.push({
      sessionId: session.id,
      amount: session.amount_total || 0,
      currency: session.currency || 'eur',
      status: 'completed',
      createdAt: new Date(),
    });
    await user.save();
    console.log('Purchase recorded for user:', userId);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);
  
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  // Crear o actualizar suscripción en la base de datos
  await Subscription.findOneAndUpdate(
    { stripeSubscriptionId: subscription.id },
    {
      userId,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      status: subscription.status,
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    },
    { upsert: true, new: true }
  );

  console.log('Subscription saved to database for user:', userId);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);
  
  await Subscription.findOneAndUpdate(
    { stripeSubscriptionId: subscription.id },
    {
      status: subscription.status,
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
    }
  );

  console.log('Subscription updated in database');
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  await Subscription.findOneAndUpdate(
    { stripeSubscriptionId: subscription.id },
    {
      status: 'canceled',
      canceledAt: new Date(),
    }
  );

  console.log('Subscription marked as canceled in database');
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Invoice payment succeeded:', invoice.id);
  
  // Actualizar estado de suscripción si es necesario
  if ((invoice as any).subscription) {
    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId: (invoice as any).subscription as string },
      {
        status: 'active',
        lastPaymentDate: new Date(),
      }
    );
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id);
  
  // Actualizar estado de suscripción
  if ((invoice as any).subscription) {
    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId: (invoice as any).subscription as string },
      {
        status: 'past_due',
        lastPaymentError: new Date(),
      }
    );
  }
}