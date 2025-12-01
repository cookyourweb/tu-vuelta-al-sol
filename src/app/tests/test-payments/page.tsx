import PaymentButton, { SubscriptionButton } from '@/components/stripe/PaymentButton';

export default function TestPaymentsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-white mb-8">Test de Pagos Stripe</h1>

        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Pago Único</h2>
            <PaymentButton
              priceId={process.env.NEXT_PUBLIC_STRIPE_TEST_PRICE_ID || "price_test_example"}
              userId="test_user_id"
            >
              Pagar $10
            </PaymentButton>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Suscripción</h2>
            <SubscriptionButton plan="basic">
              Suscribirse al Plan Básico
            </SubscriptionButton>
          </div>
        </div>

        <div className="mt-8 text-gray-300">
          <p>Nota: Necesitas configurar las variables de entorno de Stripe</p>
          <p>y crear un precio de suscripción en tu dashboard de Stripe</p>
        </div>
      </div>
    </div>
  );
}
