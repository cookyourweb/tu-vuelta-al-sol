eurosimport Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{
      price: "price_xxxxxxxxx", // creado en Stripe
      quantity: 1,
    }],
  });

  return Response.json({ id: session.id });
}
