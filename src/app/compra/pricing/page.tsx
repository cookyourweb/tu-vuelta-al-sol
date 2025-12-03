// app/stripe/pricing/page.tsx
'use client';

import { Check, Star, Sparkles, Crown } from 'lucide-react';
import PaymentButton, { SubscriptionButton } from '@/components/stripe/PaymentButton';
import { useAuth } from '@/context/AuthContext';

const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Plan Básico',
    price: '€19',
    period: 'año',
    icon: Star,
    color: 'from-blue-500 to-cyan-500',
    features: [
      'Agenda anual completa',
      'Interpretaciones astrológicas detalladas',
      'Carta natal personalizada',
      'Tránsitos planetarios mensuales',
      'Soporte por email',
    ],
  },
  {
    id: 'premium',
    name: 'Plan Premium',
    price: '€39',
    period: 'año',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    popular: true,
    features: [
      'Todo lo del Plan Básico',
      'Integración con Google Calendar',
      'Actualizaciones mensuales personalizadas',
      'Cartas progresadas',
      'Informes de compatibilidad',
      'Soporte prioritario',
    ],
  },
  {
    id: 'vip',
    name: 'Plan VIP',
    price: '€79',
    period: 'año',
    icon: Crown,
    color: 'from-yellow-500 to-orange-500',
    features: [
      'Todo lo del Plan Premium',
      'Consultas personales 1:1',
      'Informes especiales trimestrales',
      'Acceso anticipado a nuevas funcionalidades',
      'Regalos astrológicos mensuales',
      'Soporte VIP 24/7',
    ],
  },
];

const oneTimeProducts = [
  {
    id: 'compatibility',
    name: 'Compatibilidad de Pareja',
    price: '€29',
    description: 'Análisis completo de sinastría entre dos personas',
    features: ['Carta sinastría', 'Aspectos interplanetas', 'Áreas de compatibilidad'],
  },
  {
    id: 'baby_chart',
    name: 'Carta para Bebés',
    price: '€24',
    description: 'Regalo perfecto para padres primerizos',
    features: ['Carta natal del bebé', 'Potencialidades', 'Guía de crianza astrológica'],
  },
  {
    id: 'thematic_report',
    name: 'Informe Temático',
    price: '€15',
    description: 'Profundiza en amor, carrera o salud',
    features: ['Análisis específico', 'Consejos prácticos', 'Predicciones'],
  },
  {
    id: 'lunar_calendar',
    name: 'Calendario Lunar Físico',
    price: '€35',
    description: 'Calendario personalizado en formato físico',
    features: ['Producto físico', 'Fases lunares', 'Envío incluido'],
  },
  {
    id: 'consultation',
    name: 'Consulta 1:1',
    price: '€75',
    description: 'Sesión privada con astrólogo certificado',
    features: ['1 hora de consulta', 'Grabación incluida', 'Informe post-sesión'],
  },
  {
    id: 'astro_gift',
    name: 'Regalo Astrológico',
    price: '€25',
    description: 'Carta personalizada para regalar',
    features: ['Diseño premium', 'Mensaje personalizado', 'Envío digital'],
  },
];

export default function PricingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Elige tu Plan Perfecto
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Descubre el poder de la astrología personalizada y transforma tu vida
          </p>
        </div>

        {/* Planes de Suscripción */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Suscripciones Anuales
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan) => {
              const IconComponent = plan.icon;
              return (
                <div
                  key={plan.id}
                  className={`relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 transition-all hover:scale-105 ${
                    plan.popular
                      ? 'border-purple-400 shadow-2xl shadow-purple-500/50'
                      : 'border-white/20'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Más Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${plan.color} mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400">/ {plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <SubscriptionButton
                    className="w-full" plan={''}                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Productos Únicos */}
        <div>
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Productos Adicionales
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {oneTimeProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-purple-400/50 transition-all"
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">
                      {product.name}
                    </h3>
                    <span className="text-2xl font-bold text-purple-400">
                      {product.price}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    {product.description}
                  </p>
                </div>

                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-400 text-sm">
                      <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <PaymentButton
                  priceId={product.id}
                  userId={user?.uid || ''}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all text-sm"
                >
                  Comprar por {product.price}
                </PaymentButton>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ o garantía */}
        <div className="mt-20 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              🔒 Garantía de Satisfacción
            </h3>
            <p className="text-gray-300 mb-6">
              Si no estás completamente satisfecho con tu compra, te devolvemos tu dinero 
              dentro de los primeros 30 días. Sin preguntas.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <span>✓ Pago seguro con Stripe</span>
              <span>✓ Cancela cuando quieras</span>
              <span>✓ Soporte 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}