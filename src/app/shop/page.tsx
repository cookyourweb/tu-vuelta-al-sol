'use client';

import { Sparkles, ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Background stars */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/5 w-2 h-2 bg-pink-300 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/6 right-2/5 w-2 h-2 bg-purple-200 rounded-full animate-bounce delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <ShoppingBag className="w-5 h-5 text-purple-300" />
            <span className="text-white font-medium">Tienda Astrológica</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Productos y Servicios
          </h1>

          <p className="text-xl text-purple-200 leading-relaxed max-w-3xl mx-auto">
            Herramientas cósmicas diseñadas para tu transformación personal y evolución espiritual
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

          {/* Agenda Digital */}
          <ProductCard
            productType="agenda-digital"
            name="Agenda Astrológica Digital"
            description="Tu agenda cósmica personalizada con eventos basados en tu carta natal."
            price="€15"
            badge="Más Popular"
            features={[
              'PDF descargable de alta calidad',
              'Integración con Google Calendar',
              'Eventos lunares personalizados',
              'Tránsitos importantes del mes',
              'Rituales energéticos diarios',
              'Acceso inmediato después del pago'
            ]}
          />

          {/* Suscripción Premium */}
          <ProductCard
            productType="subscription"
            name="Suscripción Premium"
            description="Acceso mensual automático a tu agenda actualizada y contenido exclusivo."
            price="€9.99"
            badge="Ahorra €5/mes"
            features={[
              'Agenda mensual automática',
              'Actualizaciones de tránsitos',
              'Rituales exclusivos cada mes',
              'Consultas priorizadas',
              'Acceso anticipado a nuevos productos',
              'Cancela cuando quieras'
            ]}
          />

          {/* Kit Rituales - PRÓXIMAMENTE */}
          <ProductCard
            productType="kit-rituales"
            name="Kit de Rituales"
            description="Velas, cristales y guía de rituales según tu carta natal."
            price="€35"
            badge="Próximamente"
            isPhysical={true}
            features={[
              'Velas personalizadas (3 unidades)',
              'Cristales según tu carta natal',
              'Guía de rituales detallada',
              'Incienso natural',
              'Envío certificado a toda España',
              'Embalaje sostenible y elegante'
            ]}
            className="opacity-75"
          />

          {/* Vela Personalizada - PRÓXIMAMENTE */}
          <ProductCard
            productType="vela-personalizada"
            name="Vela Astrológica"
            description="Vela artesanal creada según tu signo solar con aromas personalizados."
            price="€12"
            badge="Próximamente"
            isPhysical={true}
            features={[
              'Aromas según tu elemento',
              'Colores de tu signo zodiacal',
              'Cristales incrustados',
              'Duración 20+ horas',
              'Cera natural 100% vegetal',
              'Envío rápido en 48-72h'
            ]}
            className="opacity-75"
          />

          {/* Bundle Completo - PRÓXIMAMENTE */}
          <ProductCard
            productType="bundle-completo"
            name="Bundle Completo"
            description="Agenda Digital + Kit de Rituales completo con descuento especial."
            price="€45"
            badge="Ahorra €5"
            isPhysical={true}
            features={[
              'Todo lo de Agenda Digital',
              'Todo lo del Kit de Rituales',
              'Vela adicional de regalo',
              'Consulta personalizada 30 min',
              'Guía de integración paso a paso',
              'Mejor relación calidad-precio'
            ]}
            className="opacity-75 md:col-span-2 lg:col-span-1"
          />
        </div>

        {/* Trust Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-4xl">🔒</div>
                <h3 className="text-white font-bold">Pago Seguro</h3>
                <p className="text-purple-200 text-sm">Procesado por Stripe con encriptación SSL</p>
              </div>

              <div className="space-y-2">
                <div className="text-4xl">📦</div>
                <h3 className="text-white font-bold">Envío Rápido</h3>
                <p className="text-purple-200 text-sm">48-72h para productos físicos en España</p>
              </div>

              <div className="space-y-2">
                <div className="text-4xl">💯</div>
                <h3 className="text-white font-bold">Satisfacción Garantizada</h3>
                <p className="text-purple-200 text-sm">Devolución del 100% si no estás satisfecho</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-12 text-center">
          <p className="text-purple-200">
            ¿Tienes dudas? Contáctanos en{' '}
            <a
              href="mailto:hello.cookyourweb@gmail.com"
              className="text-yellow-400 hover:underline font-medium"
            >
              hello.cookyourweb@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
