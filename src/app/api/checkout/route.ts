import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Agenda Astrológica Personalizada",
              description: "Tu agenda cósmica mensual con eventos y rituales personalizados",
            },
            unit_amount: 1500, // €15.00 en céntimos
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000"}/cancel`,
    });

    return Response.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return Response.json(
      { error: "Error al crear la sesión de pago" },
      { status: 500 }
    );
  }
}
