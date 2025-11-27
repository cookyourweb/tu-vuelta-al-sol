// src/app/api/webhook/route.ts
// 🔔 STRIPE WEBHOOKS - Handle payment events and fulfill orders

import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// ==========================================
// 🎯 WEBHOOK HANDLER
// ==========================================

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err);
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 });
  }

  console.log(`📨 Webhook received: ${event.type}`);

  try {
    await connectDB();

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true, processed: true });

  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return NextResponse.json(
      { received: true, processed: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// ==========================================
// 🎁 HANDLE CHECKOUT COMPLETED
// ==========================================

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("✅ Checkout completed:", session.id);

  const { customer_email, metadata, amount_total, currency } = session;
  const productType = metadata?.productType || 'unknown';
  const productName = metadata?.productName || 'Unknown Product';

  // TODO: Save order to MongoDB
  // - Create Order model
  // - Store: userId, productType, amount, status, etc.
  // - Send confirmation email
  // - For digital products: generate download link
  // - For physical products: notify fulfillment system

  console.log("📦 Order details:", {
    email: customer_email,
    productType,
    productName,
    amount: amount_total ? amount_total / 100 : 0,
    currency
  });

  // For Agenda Digital: Generate PDF and Google Calendar link
  if (productType === 'agenda-digital') {
    console.log("📅 TODO: Generate agenda for user:", customer_email);
    // TODO:
    // 1. Get user's birth data from MongoDB
    // 2. Generate personalized agenda
    // 3. Create PDF
    // 4. Generate Google Calendar .ics file
    // 5. Send email with download links
  }

  // For physical products: Mark for shipment
  if (['kit-rituales', 'vela-personalizada', 'bundle-completo'].includes(productType)) {
    console.log("📦 TODO: Process shipment for:", customer_email);
    // TODO:
    // 1. Create shipment record
    // 2. Notify warehouse/fulfillment
    // 3. Send tracking email when shipped
  }
}

// ==========================================
// 🔄 HANDLE SUBSCRIPTION EVENTS
// ==========================================

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log("🎉 New subscription created:", subscription.id);

  // TODO:
  // - Save subscription to MongoDB
  // - Grant access to premium features
  // - Send welcome email
  // - Schedule first monthly agenda generation
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("🔄 Subscription updated:", subscription.id);

  // TODO:
  // - Update subscription status in MongoDB
  // - Handle plan changes
  // - Adjust access permissions
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("❌ Subscription cancelled:", subscription.id);

  // TODO:
  // - Update subscription status in MongoDB
  // - Revoke premium access (at period end)
  // - Send cancellation confirmation email
}

// ==========================================
// 💳 HANDLE PAYMENT SUCCEEDED
// ==========================================

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log("💰 Payment succeeded:", paymentIntent.id);

  // TODO:
  // - Update order status to 'paid'
  // - Trigger fulfillment
}
